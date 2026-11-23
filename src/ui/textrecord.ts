// Tippen und Löschen im Text bei eingeschalteter Änderungsverfolgung, Port von TextEditAreaKeyListener
// (aenderungsStilSetzenWennNochNichtVorhanden), AbstractRemovalKeyPressedHandler.handleTextDeletion,
// markSelectedTextAsDeletedInModificationMode und MarkedCharSequence.insertParagraphBoundaryAt.
// Gearbeitet wird direkt im DOM der Text-Area (Markup-Spans, <strike>), textinput.ts liest danach ins Modell zurück.
import { changeSet, css } from '../core/changesets.ts';
import { setBreak } from './markups.ts';
import { BLOCKS } from './textedit.ts';
import { mergeBreak } from './texttrack.ts';

const STRUCK = 'strike, s, del';
let counter = 0;

const textColor = (cs: string) => css(changeSet(cs).text);
const steplinkColor = (cs: string) => css(changeSet(cs).stepnumberLink);

/** Neuer Markup-Span für geänderten Text des Sets (data-markup muss in der Area nur eindeutig sein) */
function changeSpan(cs: string): HTMLSpanElement {
  const s = document.createElement('span');
  s.className = 'sm-markup sm-markup-Changed';
  s.dataset.markup = `n${Date.now().toString(36)}${counter++}`;
  s.dataset.type = 'Changed';
  s.dataset.changeset = cs;
  s.style.backgroundColor = textColor(cs);
  return s;
}

/** Innerster Markup-Span und äußerstes <strike> zwischen node und root */
function context(node: Node, root: HTMLElement): { markup?: HTMLElement; strike?: HTMLElement } {
  let markup: HTMLElement | undefined;
  let strike: HTMLElement | undefined;
  for (let e = node instanceof HTMLElement ? node : node.parentElement; e && e !== root; e = e.parentElement) {
    if (!markup && e.classList.contains('sm-markup')) markup = e;
    if (e.matches(STRUCK)) strike = e;
  }
  return { markup, strike };
}

const isSteplink = (m: HTMLElement | undefined) => m !== undefined && (m.dataset.type === 'Steplink' || m.dataset.type === 'ChangedSteplink');

function textBetween(a: Node, aOffset: number, b: Node, bOffset: number): string {
  const r = document.createRange();
  r.setStart(a, aOffset);
  r.setEnd(b, bOffset);
  return r.toString();
}

/**
 * Einfügestelle aus dem Element el herausschieben: am Anfang davor, am Ende dahinter, in der Mitte wird el geteilt.
 * @returns Range an der neuen Stelle (zwischen den Teilen)
 */
function escape(range: Range, el: HTMLElement): Range {
  const r = document.createRange();
  if (textBetween(el, 0, range.startContainer, range.startOffset) === '') {
    r.setStartBefore(el);
  } else if (textBetween(range.startContainer, range.startOffset, el, el.childNodes.length) === '') {
    r.setStartAfter(el);
  } else {
    const tail = document.createRange();
    tail.setStart(range.startContainer, range.startOffset);
    tail.setEndAfter(el);
    const frag = tail.extractContents(); // enthält eine Kopie von el mit dem hinteren Teil
    el.after(frag);
    r.setStartAfter(el);
  }
  r.collapse(true);
  return r;
}

/** Einfügestelle außerhalb von Markup-Spans (außer einem, der passt) und Streichungen */
function insertionPoint(range: Range, root: HTMLElement, keep: (m: HTMLElement) => boolean): Range | undefined {
  let r = range;
  for (let i = 0; i < 20; i++) {
    const { markup, strike } = context(r.startContainer, root);
    const badMarkup = markup && !keep(markup) ? markup : undefined;
    if (!badMarkup && !strike) return r;
    // in einem Schrittverweis wird nicht getippt (shouldPreventActionInsideStepnumberLink)
    if (isSteplink(badMarkup) && textBetween(badMarkup!, 0, r.startContainer, r.startOffset) !== '' && textBetween(r.startContainer, r.startOffset, badMarkup!, badMarkup!.childNodes.length) !== '') return undefined;
    // das äußere der beiden Elemente zuerst verlassen
    const outer = badMarkup && strike ? (badMarkup.contains(strike) ? badMarkup : strike) : (badMarkup ?? strike)!;
    r = escape(r, outer);
  }
  return r;
}

function placeCaret(node: Node, offset: number): void {
  const sel = document.getSelection()!;
  const r = document.createRange();
  r.setStart(node, offset);
  r.collapse(true);
  sel.removeAllRanges();
  sel.addRange(r);
}

/** Text mit Zeilenumbrüchen als Knoten; Umbrüche werden <br>, beim Aufzeichnen als hinzugefügte Absatzgrenzen */
function textNodes(text: string, cs: string | undefined): Node[] {
  const out: Node[] = [];
  text.split(/\r?\n/).forEach((line, i) => {
    if (i > 0) {
      const br = document.createElement('br');
      if (cs) setBreak(br, 'changed', cs, textColor(cs));
      out.push(br);
    }
    if (line) out.push(document.createTextNode(line));
  });
  return out;
}

/**
 * Text an der Stelle range einfügen. Mit cs (Verfolgung an) landet er in einem Changed-Markup des Sets, sonst
 * außerhalb aller Änderungs-Markups (standardStilSetzenWennNochNichtVorhanden). Schrittverweise und Streichungen
 * werden dafür verlassen.
 * @returns false, wenn nichts eingefügt wurde (Cursor mitten in einem Schrittverweis)
 */
export function insertText(root: HTMLElement, range: Range, text: string, cs: string | undefined): boolean {
  const own = (m: HTMLElement) => cs !== undefined && m.dataset.type === 'Changed' && m.dataset.changeset === cs;
  const at = insertionPoint(range, root, own);
  if (!at) return false;
  const nodes = textNodes(protectSpaces(root, at, text), cs);
  if (nodes.length === 0) return true;
  const { markup } = context(at.startContainer, root);
  let target: Node;
  if (cs && !(markup && own(markup))) {
    const span = changeSpan(cs);
    span.append(...nodes);
    at.insertNode(span);
    target = span;
  } else {
    const frag = document.createDocumentFragment();
    frag.append(...nodes);
    const last = nodes[nodes.length - 1];
    at.insertNode(frag);
    target = last;
  }
  // Cursor hinter den eingefügten Text, bei einem Span in dessen Ende (weiteres Tippen landet dort)
  if (target instanceof HTMLSpanElement) {
    const last = target.lastChild!;
    if (last instanceof Text) placeCaret(last, last.data.length);
    else placeCaret(target, target.childNodes.length);
  } else if (target instanceof Text) placeCaret(target, target.data.length);
  else {
    const r = document.createRange();
    r.setStartAfter(target);
    placeCaret(r.startContainer, r.startOffset);
  }
  return true;
}

/** Zeichen vor einer Stelle innerhalb der Area (Textknoten und Index) */
function charBefore(root: HTMLElement, at: Range): { node: Text; offset: number } | undefined {
  if (at.startContainer instanceof Text && at.startOffset > 0) return { node: at.startContainer, offset: at.startOffset - 1 };
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let found: Text | undefined;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text;
    if (t.data.length > 0 && at.comparePoint(t, t.data.length) <= 0) found = t;
    else if (at.comparePoint(t, 0) > 0) break;
  }
  return found ? { node: found, offset: found.data.length - 1 } : undefined;
}

/**
 * Leerzeichen so einfügen, dass der Browser sie nicht zusammenfasst (wie Chromes eigenes Bearbeiten): ein Leerzeichen
 * am Ende oder nach einem Leerzeichen wird geschützt; folgt Text auf ein geschütztes, wird es wieder normal.
 */
function protectSpaces(root: HTMLElement, at: Range, text: string): string {
  const prev = charBefore(root, at);
  const prevChar = prev ? prev.node.data[prev.offset] : undefined;
  if (prev && prevChar === '\u00a0' && text.length > 0 && !/\s/.test(text[0])) {
    const before = prev.offset > 0 ? prev.node.data[prev.offset - 1] : charBefore(root, rangeAt(prev.node, prev.offset))?.node.data.slice(-1);
    if (before !== undefined && !/\s/.test(before)) {
      const caretHere = at.startContainer === prev.node && at.startOffset === prev.offset + 1;
      prev.node.replaceData(prev.offset, 1, ' ');
      // replaceData schiebt eine Range-Grenze hinter dem Zeichen davor
      if (caretHere) {
        at.setStart(prev.node, prev.offset + 1);
        at.collapse(true);
      }
    }
  }
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const p = i > 0 ? out[i - 1] : prevChar;
    if (c === ' ' && (i === text.length - 1 || p === undefined || p === ' ' || p === '\u00a0' || p === '\n')) out += '\u00a0';
    else out += c;
  }
  return out;
}

function rangeAt(node: Node, offset: number): Range {
  const r = document.createRange();
  r.setStart(node, offset);
  r.collapse(true);
  return r;
}

interface Segment {
  node: Text;
  start: number;
  end: number;
}

function segments(range: Range): Segment[] {
  const out: Segment[] = [];
  const common = range.commonAncestorContainer;
  const walker = document.createTreeWalker(common instanceof Text ? common.parentNode! : common, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text;
    if (!range.intersectsNode(t)) continue;
    const start = t === range.startContainer ? range.startOffset : 0;
    const end = t === range.endContainer ? range.endOffset : t.data.length;
    if (end > start) out.push({ node: t, start, end });
  }
  return out;
}

/** Elemente, deren Absatzgrenze (davor) im Bereich liegt: Blöcke, die im Bereich beginnen, und <br> */
function breaksIn(range: Range, root: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  const startPoint = range.cloneRange();
  startPoint.collapse(true);
  for (const e of Array.from(root.querySelectorAll<HTMLElement>('*'))) {
    if (e.tagName !== 'BR' && !BLOCKS.has(e.tagName)) continue;
    if (e.tagName === 'BR') {
      if (range.intersectsNode(e) && !(e.parentElement && e.parentElement !== root && e.parentElement.childNodes.length === 1)) out.push(e);
      continue;
    }
    // Block beginnt im Bereich: sein Anfang liegt hinter dem Bereichsanfang und nicht hinter dem Ende
    const startsAfter = range.comparePoint(e, 0) === 0 && startPoint.comparePoint(e, 0) === 1;
    const precededByContent = textBetween(root, 0, e, 0) !== '';
    if (startsAfter && precededByContent) out.push(e);
  }
  return out;
}

/**
 * handleTextDeletion: Bereich löschen bei eingeschalteter Verfolgung.
 * - unmarkierter Text wird gestrichen und markiert, ein Schrittverweis als Ganzes
 * - geänderter, nicht gestrichener Text (jedes Change Set) wird wirklich entfernt
 * - gestrichener Text bleibt
 * - Absatzgrenzen: hinzugefügte verschwinden, andere werden als gelöscht markiert
 * Der Cursor steht danach am Anfang (Backspace) bzw. hinter dem Gestrichenen (Entf).
 */
export function deleteTracked(root: HTMLElement, range: Range, cs: string, forward: boolean): void {
  const segs = segments(range);
  const breaks = breaksIn(range, root);
  const steplinks = new Set<HTMLElement>();
  /** Ergebnis-Elemente in Dokumentreihenfolge (für den Cursor) */
  let first: Node | undefined;
  let last: Node | undefined;
  let removedAtStart: { node: Node; offset: number } | undefined;
  for (let i = segs.length - 1; i >= 0; i--) {
    const { node, start, end } = segs[i];
    // Leerraum zwischen Blöcken (Einrückung im HTML) ist kein Text
    if (/^[ \t\n\r\f]*$/.test(node.data) && [node.previousSibling, node.nextSibling].some((n) => n instanceof HTMLElement && BLOCKS.has(n.tagName))) continue;
    const { markup, strike } = context(node, root);
    if (strike) {
      first = strike;
      last ??= strike;
      continue;
    }
    if (markup && (markup.dataset.type === 'Changed' || markup.dataset.type === 'ChangedSteplink')) {
      if (markup.dataset.type === 'ChangedSteplink') {
        removedAtStart = { node: markup.parentNode!, offset: Array.prototype.indexOf.call(markup.parentNode!.childNodes, markup) };
        markup.remove();
      } else {
        node.deleteData(start, end - start);
        removedAtStart = { node, offset: start };
        if (markup.textContent === '') {
          removedAtStart = { node: markup.parentNode!, offset: Array.prototype.indexOf.call(markup.parentNode!.childNodes, markup) };
          markup.remove();
        }
      }
      first = undefined;
      continue;
    }
    if (markup && markup.dataset.type === 'Steplink') {
      if (!steplinks.has(markup)) {
        steplinks.add(markup);
        markup.dataset.type = 'ChangedSteplink';
        markup.dataset.changeset = cs;
        markup.className = 'sm-markup sm-markup-ChangedSteplink';
        markup.style.backgroundColor = steplinkColor(cs);
        const s = document.createElement('strike');
        markup.replaceWith(s);
        s.append(markup);
        first = s;
        last ??= s;
      }
      continue;
    }
    // unmarkierter Text: Abschnitt isolieren und gestrichen markieren
    if (end < node.data.length) node.splitText(end);
    const target = start > 0 ? node.splitText(start) : node;
    const s = document.createElement('strike');
    const span = changeSpan(cs);
    target.replaceWith(s);
    span.append(target);
    s.append(span);
    first = s;
    last ??= s;
  }
  for (const b of breaks) {
    if (b.dataset.break === 'deleted') continue;
    if (b.dataset.break === 'changed') mergeBreak(b);
    else setBreak(b, 'deleted', cs, textColor(cs));
  }
  root.normalize();
  // Cursor
  const r = document.createRange();
  if (forward && last && root.contains(last)) r.setStartAfter(last);
  else if (!forward && first && root.contains(first)) r.setStartBefore(first);
  else if (removedAtStart && root.contains(removedAtStart.node)) r.setStart(removedAtStart.node, Math.min(removedAtStart.offset, maxOffset(removedAtStart.node)));
  else if (forward) r.setStart(range.endContainer, Math.min(range.endOffset, maxOffset(range.endContainer)));
  else r.setStart(range.startContainer, Math.min(range.startOffset, maxOffset(range.startContainer)));
  placeCaret(r.startContainer, r.startOffset);
}

const maxOffset = (n: Node) => (n instanceof Text ? n.data.length : n.childNodes.length);

/** Nach Enter (insertParagraph): den Absatz mit dem Cursor als hinzugefügte Grenze markieren */
export function markNewParagraph(root: HTMLElement, cs: string): void {
  const sel = document.getSelection();
  let e = sel?.anchorNode instanceof HTMLElement ? sel.anchorNode : sel?.anchorNode?.parentElement;
  while (e && e !== root && !BLOCKS.has(e.tagName)) e = e.parentElement;
  if (e && e !== root && root.contains(e)) setBreak(e, 'changed', cs, textColor(cs));
}

/** Nach Umschalt+Enter (insertLineBreak): das <br> vor dem Cursor markieren */
export function markNewLineBreak(root: HTMLElement, cs: string): void {
  const sel = document.getSelection();
  if (!sel?.anchorNode) return;
  const r = document.createRange();
  r.setStart(root, 0);
  r.setEnd(sel.anchorNode, sel.anchorOffset);
  const brs = Array.from(root.querySelectorAll('br')).filter((b) => r.intersectsNode(b));
  const br = brs[brs.length - 1];
  if (br) setBreak(br, 'changed', cs, textColor(cs));
}

/** compositionend: der gerade komponierte Text vor dem Cursor kommt in ein Changed-Markup des Sets */
export function markComposed(root: HTMLElement, data: string, cs: string): boolean {
  const sel = document.getSelection();
  const node = sel?.anchorNode;
  if (!(node instanceof Text) || !root.contains(node)) return false;
  const end = sel!.anchorOffset;
  const start = end - data.length;
  if (start < 0 || node.data.substring(start, end) !== data) return false;
  const { markup, strike } = context(node, root);
  if (!strike && markup?.dataset.type === 'Changed' && markup.dataset.changeset === cs) return false;
  const r = document.createRange();
  r.setStart(node, start);
  r.setEnd(node, end);
  r.deleteContents();
  return insertText(root, r, data, cs);
}
