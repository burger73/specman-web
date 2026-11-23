// Eine bearbeitete Text-Area am Cursor zerlegen (TextEditArea.split, ParagraphCutter), ohne das DOM zu verändern.
// Die Teile werden über Ranges kopiert. Markup-Spans kommen mit, damit Markups erhalten bleiben.
import { textArea } from '../core/factory.ts';
import type { TextEditArea } from '../core/model.ts';
import { readTextArea } from './textedit.ts';

const BLOCK = /^(DIV|P|H[1-6]|UL|OL|PRE|BLOCKQUOTE|TABLE|CENTER)$/;

/** Cursor als Range-Position, falls er in el liegt und nichts markiert ist */
export function caretIn(el: HTMLElement): { node: Node; offset: number } | undefined {
  const sel = document.getSelection();
  if (!sel || sel.rangeCount === 0 || !sel.isCollapsed || !el.contains(sel.focusNode)) return undefined;
  return { node: sel.focusNode!, offset: sel.focusOffset };
}

function areaOf(frag: DocumentFragment): TextEditArea {
  const div = document.createElement('div');
  div.append(frag);
  const r = readTextArea(div);
  return { ...textArea(''), ...r };
}

function slice(el: HTMLElement, from: { node: Node; offset: number } | 'start', to: { node: Node; offset: number } | 'end'): TextEditArea {
  const r = document.createRange();
  r.selectNodeContents(el);
  if (from !== 'start') r.setStart(from.node, from.offset);
  if (to !== 'end') r.setEnd(to.node, to.offset);
  return areaOf(r.cloneContents());
}

/** TextEditArea.split: Text vor und nach dem Cursor */
export function splitAtCaret(el: HTMLElement): { before: TextEditArea; after: TextEditArea } | undefined {
  const caret = caretIn(el);
  if (!caret) return undefined;
  return { before: orEmpty(slice(el, 'start', caret)), after: orEmpty(slice(el, caret, 'end')) };
}

/**
 * ParagraphCutter: vorangehende Absätze, Absatz mit dem Cursor, nachfolgende Absätze.
 * Absätze sind die Blöcke auf oberster Ebene; Inline-Inhalt dazwischen bildet Absätze, die ein <br> beendet.
 */
export function cutParagraph(el: HTMLElement): { leading: TextEditArea; caret: TextEditArea; trailing: TextEditArea | undefined; offset: number } | undefined {
  const caret = caretIn(el);
  if (!caret) return undefined;
  // oberste Ebene, in der der Cursor liegt
  let top: Node | null;
  if (caret.node === el) top = el.childNodes[caret.offset] ?? el.childNodes[caret.offset - 1] ?? null;
  else {
    top = caret.node;
    while (top && top.parentNode !== el) top = top.parentNode;
  }
  const children = Array.from(el.childNodes);
  let start = 0;
  let end = children.length;
  if (top) {
    const i = children.indexOf(top as ChildNode);
    if (isBlock(top)) {
      start = i;
      end = i + 1;
    } else {
      start = i;
      while (start > 0 && !isBlock(children[start - 1]) && !isBr(children[start - 1])) start--;
      end = i;
      while (end < children.length && !isBlock(children[end]) && !isBr(children[end])) end++;
      if (end < children.length && isBr(children[end])) end++;
    }
  }
  const pos = (index: number) => ({ node: el as Node, offset: index });
  const trailing = end < children.length ? slice(el, pos(end), 'end') : undefined;
  // Klartext-Position des Cursors im Absatz, damit er nach dem Umbau an derselben Stelle steht
  const r = document.createRange();
  r.setStart(el, start);
  r.setEnd(caret.node, caret.offset);
  const before = areaOf(r.cloneContents()).plainText.length + (/\s$/.test(r.toString()) && r.toString().trim() ? 1 : 0);
  return {
    offset: before,
    leading: slice(el, 'start', pos(start)),
    caret: slice(el, pos(start), pos(end)),
    trailing: trailing && (trailing.plainText !== '' || /<(img|br)\b/i.test(trailing.text)) ? trailing : undefined,
  };
}

/** Teil ohne sichtbaren Inhalt (nur leere Hüllen der Formatierung) wird zum leeren Text */
const orEmpty = (t: TextEditArea) => (t.plainText === '' && !/<(img|br|hr)\b/i.test(t.text) ? textArea('') : t);

const isBlock = (n: Node) => n instanceof HTMLElement && BLOCK.test(n.tagName);
const isBr = (n: Node) => n instanceof HTMLElement && n.tagName === 'BR';

/** Cursor steht ganz am Anfang der Area (vor ihm nur Leerraum, kein Zeilenumbruch, kein früherer Absatz) */
export function caretAtStart(el: HTMLElement): boolean {
  const caret = caretIn(el);
  if (!caret) return false;
  const r = document.createRange();
  r.selectNodeContents(el);
  r.setEnd(caret.node, caret.offset);
  const frag = r.cloneContents();
  if (frag.textContent!.trim() !== '' || frag.querySelector('br, img')) return false;
  // angeschnittene Vorfahren des Cursors erscheinen als Kopien, jeder weitere Block ist ein früherer Absatz
  let ancestors = 0;
  for (let n: Node | null = caret.node; n && n !== el; n = n.parentNode) if (isBlock(n)) ancestors++;
  return Array.from(frag.querySelectorAll('*')).filter(isBlock).length <= ancestors;
}
