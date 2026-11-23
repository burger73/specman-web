// Pfeiltasten über die Grenzen der Bearbeitungsbereiche hinweg (editarea/focusmover, keylistener).
// Hoch/Runter in der ersten bzw. letzten Zeile eines Texts und auf Bildern springen in den grafisch nächsten Bereich,
// egal ob im selben Schritt, in einem anderen oder in einer Tabellenzelle. Links/Rechts überspringen einen
// Schrittverweis als Ganzes.
import { restoreFocus, plainOffset } from './focus.ts';
import { plainAndMarkups } from './textedit.ts';

export type Direction = 'up' | 'down';

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Nachbarbereiche dürfen sich um die Breite gemeinsamer Rahmenlinien überlappen und gelten trotzdem als darüber/darunter */
const BORDER_SLACK = 4;
/** Kandidaten, deren senkrechter Abstand sich um weniger als das unterscheidet, gelten als in derselben Reihe */
const ROW_TOLERANCE = 4;

/** Senkrechter Abstand vom Ausgangsbereich zum Kandidaten in der Richtung, negativ bei Überlappung */
function gap(source: Box, candidate: Box, direction: Direction): number {
  return direction === 'down' ? candidate.y - (source.y + source.height) : source.y - (candidate.y + candidate.height);
}

function overlapsHorizontally(a: Box, b: Box): boolean {
  return Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x);
}

/** 0, wenn x innerhalb der waagrechten Ausdehnung liegt */
function horizontalDistance(b: Box, x: number): number {
  if (x < b.x) return b.x - x;
  return Math.max(0, x - (b.x + b.width));
}

function minBy<T>(items: T[], key: (t: T) => number): T | undefined {
  let best: T | undefined;
  let bestKey = Infinity;
  for (const t of items) {
    const k = key(t);
    if (k < bestKey) {
      best = t;
      bestKey = k;
    }
  }
  return best;
}

/**
 * EditAreaNeighbourFinder.find: Von den Kandidaten über bzw. unter dem Ausgangsbereich werden die bevorzugt, die ihn
 * waagrecht überlappen, unter ihnen gewinnt der senkrecht nächste. Sind mehrere gleich nah (z. B. die Zweige eines
 * If-Else), gewinnt der waagrecht nächste zur gewünschten x-Position. Nur wenn nichts überlappt, gewinnt der mit dem
 * kleinsten Abstand, egal wie weit daneben.
 */
export function findNeighbour<T extends { box: Box }>(source: Box, candidates: T[], desiredX: number, direction: Direction): T | undefined {
  const inDirection = candidates.filter((c) => gap(source, c.box, direction) >= -BORDER_SLACK);
  const overlapping = inDirection.filter((c) => overlapsHorizontally(source, c.box));
  if (overlapping.length === 0) {
    return minBy(inDirection, (c) => Math.hypot(horizontalDistance(c.box, desiredX), Math.max(0, gap(source, c.box, direction))));
  }
  const smallestGap = Math.min(...overlapping.map((c) => gap(source, c.box, direction)));
  const row = overlapping.filter((c) => gap(source, c.box, direction) <= smallestGap + ROW_TOLERANCE);
  return minBy(row, (c) => horizontalDistance(c.box, desiredX));
}

// ---- DOM ----

const TEXT = '[data-path]';
const IMAGE = '.sm-image[data-image-path]';

/**
 * Die Spalte, in die die Schreibmarke will (Swings magic caret position): Nach einem Sprung bleibt die x-Position
 * gemerkt, solange die Schreibmarke dort steht, wo der Sprung sie abgesetzt hat. So geht die Spalte über einen kurzen
 * Text hinweg nicht verloren. Jede andere Bewegung (Tippen, Klicken, Links/Rechts) gibt sie auf.
 */
let magic: { el: HTMLElement; x: number; node: Node; offset: number } | undefined;

function toBox(r: DOMRect): Box {
  return { x: r.left, y: r.top, width: r.width, height: r.height };
}

/** Im Dokument sichtbar, also nicht in einem zugeklappten Schritt (FocusCandidateCollector.isDisplayed) */
function displayed(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  return el.getClientRects().length > 0 && r.width > 0 && r.height > 0;
}

/** Bereiche, die die Schreibmarke aufnehmen können: bearbeitbare Texte und nicht gelöschte Bilder */
function candidates(stage: HTMLElement, source: HTMLElement): { el: HTMLElement; box: Box }[] {
  const out: { el: HTMLElement; box: Box }[] = [];
  for (const el of stage.querySelectorAll<HTMLElement>(`${TEXT}, ${IMAGE}`)) {
    if (el === source || !displayed(el)) continue;
    if (el.matches(TEXT) && !el.isContentEditable) continue;
    if (el.matches(IMAGE) && el.classList.contains('sm-change-Geloescht')) continue;
    out.push({ el, box: toBox(el.getBoundingClientRect()) });
  }
  return out;
}

/** Rechtecke der Zeilen eines Texts: Textstücke sowie leere Absätze, Zeilenumbrüche und Bilder */
function lineRects(el: HTMLElement): DOMRect[] {
  const rects: DOMRect[] = [];
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n instanceof Text) {
      if (!n.data.trim()) continue;
      range.selectNodeContents(n);
      rects.push(...Array.from(range.getClientRects()));
    } else if (n instanceof HTMLElement && (n.tagName === 'BR' || n.tagName === 'IMG' || !n.textContent?.trim())) {
      const r = n.getBoundingClientRect();
      if (r.height > 0) rects.push(r);
    }
  }
  return rects.filter((r) => r.height > 0);
}

/** Rechteck der Schreibmarke (Position node/offset) */
function caretRect(node: Node, offset: number, el: HTMLElement): DOMRect {
  const range = document.createRange();
  // Am Zeilenumbruch ist die Position mehrdeutig: das Zeichen danach entscheidet (Zeilenanfang statt -ende)
  if (node instanceof Text && offset < node.data.length && node.data[offset].trim()) {
    range.setStart(node, offset);
    range.setEnd(node, offset + 1);
    const c = range.getClientRects()[0];
    if (c && c.height > 0) return new DOMRect(c.left, c.top, 0, c.height);
  }
  range.setStart(node, offset);
  range.collapse(true);
  const r = Array.from(range.getClientRects()).find((x) => x.height > 0);
  if (r) return r;
  // An Elementgrenzen (z. B. im leeren Absatz) liefert der Browser kein Rechteck: das Nachbarelement nehmen
  if (node instanceof Element) {
    // erstes Zeichen danach bzw. letztes davor; sonst ein leeres Element (Absatz, Zeilenumbruch)
    const after = node.childNodes[offset];
    const before = node.childNodes[offset - 1];
    const t = (after && edgeCharRect(after, true)) ?? (before && edgeCharRect(before, false));
    if (t) return t;
    const child = after ?? before;
    return child instanceof Element ? child.getBoundingClientRect() : node.getBoundingClientRect();
  }
  if (node instanceof Text && node.data.length) {
    // neben ein Zeichen ausweichen
    const at = Math.min(offset, node.data.length - 1);
    range.setStart(node, at);
    range.setEnd(node, at + 1);
    const t = range.getClientRects()[0];
    if (t) return new DOMRect(offset > at ? t.right : t.left, t.top, 0, t.height);
  }
  return (node.parentElement ?? el).getBoundingClientRect();
}

/** Linker Rand des ersten bzw. rechter Rand des letzten Zeichens im Knoten, als Rechteck der Breite 0 */
function edgeCharRect(node: Node, first: boolean): DOMRect | undefined {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  const texts: Text[] = node instanceof Text ? [node] : [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) texts.push(n as Text);
  const t = (first ? texts : texts.reverse()).find((x) => x.data.trim());
  if (!t) return undefined;
  const range = document.createRange();
  const i = first ? t.data.search(/\S/) : t.data.trimEnd().length - 1;
  range.setStart(t, i);
  range.setEnd(t, i + 1);
  const r = range.getClientRects()[0];
  return r ? new DOMRect(first ? r.left : r.right, r.top, 0, r.height) : undefined;
}

/** CrossEditAreaFocusMoverFromText.caretAtTop/-Bottom: steht die Schreibmarke in der ersten bzw. letzten Zeile? */
function caretAtEdge(el: HTMLElement, caret: DOMRect, direction: Direction): boolean {
  return !lineRects(el).some((r) => (direction === 'up' ? r.bottom <= caret.top + 1 : r.top >= caret.bottom - 1));
}

/** Schreibmarke an einen Bildschirmpunkt: caretRangeFromPoint (Chrome, Safari) bzw. caretPositionFromPoint (Firefox) */
function caretFromPoint(x: number, y: number): { node: Node; offset: number } | undefined {
  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  if (doc.caretPositionFromPoint) {
    const p = doc.caretPositionFromPoint(x, y);
    return p ? { node: p.offsetNode, offset: p.offset } : undefined;
  }
  const r = doc.caretRangeFromPoint?.(x, y);
  return r ? { node: r.startContainer, offset: r.startOffset } : undefined;
}

/**
 * AbstractCrossEditAreaFocusMover.placeCaret: Schreibmarke in die erste (nach unten) bzw. letzte Zeile (nach oben)
 * des Texts, so nah an x, wie der Text der Zeile es zulässt. x bleibt als gewünschte Spalte gemerkt.
 */
function placeCaret(el: HTMLElement, x: number, direction: Direction): void {
  el.scrollIntoView({ block: 'nearest' });
  el.focus({ preventScroll: true });
  const lines = lineRects(el);
  const box = el.getBoundingClientRect();
  const row = lines.length === 0 ? box : direction === 'down' ? minBy(lines, (r) => r.top)! : minBy(lines, (r) => -r.bottom)!;
  const y = row.top + row.height / 2;
  const px = Math.min(Math.max(x, box.left + 1), box.right - 2);
  let pos = caretFromPoint(px, y);
  if (!pos || !el.contains(pos.node)) pos = undefined;
  const sel = document.getSelection();
  if (!sel) return;
  const range = document.createRange();
  if (pos) range.setStart(pos.node, pos.offset);
  else {
    range.selectNodeContents(el);
    range.collapse(direction === 'down');
  }
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  magic = { el, x, node: range.startContainer, offset: range.startOffset };
}

/** In den Zielbereich wechseln; Bilder merken sich die x-Position selbst (AbstractImageEditArea.setNavigationX) */
function enter(target: HTMLElement, x: number, direction: Direction): void {
  if (target.matches(IMAGE)) {
    magic = undefined;
    target.dataset.navigationX = String(x - target.getBoundingClientRect().left);
    target.scrollIntoView({ block: 'nearest' });
    target.focus({ preventScroll: true });
  } else placeCaret(target, x, direction);
}

function moveFrom(stage: HTMLElement, source: HTMLElement, x: number, direction: Direction): boolean {
  const target = findNeighbour(toBox(source.getBoundingClientRect()), candidates(stage, source), x, direction);
  if (!target) return false;
  enter(target.el, x, direction);
  return true;
}

/** Aus dem Text: nur in der ersten bzw. letzten Zeile, mit der gemerkten Spalte oder der x-Position der Schreibmarke */
function moveFromText(stage: HTMLElement, el: HTMLElement, direction: Direction): boolean {
  const sel = document.getSelection();
  if (!sel || sel.rangeCount === 0 || !sel.focusNode || !el.contains(sel.focusNode)) return false;
  const caret = caretRect(sel.focusNode, sel.focusOffset, el);
  const keep = magic && magic.el === el && magic.node === sel.focusNode && magic.offset === sel.focusOffset;
  if (!caretAtEdge(el, caret, direction)) return keep ? moveWithinText(el, caret, magic!.x, direction) : false;
  return moveFrom(stage, el, keep ? magic!.x : caret.left, direction);
}

/**
 * Innerhalb des Texts eine Zeile weiter, solange eine Spalte gemerkt ist: so wie Swings eigene Hoch/Runter-Aktionen
 * die magic caret position lesen. Ohne gemerkte Spalte bleibt es beim Verhalten des Browsers.
 */
function moveWithinText(el: HTMLElement, caret: DOMRect, x: number, direction: Direction): boolean {
  const next =
    direction === 'down'
      ? minBy(lineRects(el).filter((r) => r.top >= caret.bottom - 1), (r) => r.top)
      : minBy(lineRects(el).filter((r) => r.bottom <= caret.top + 1), (r) => -r.bottom);
  if (!next) return false;
  const box = el.getBoundingClientRect();
  const pos = caretFromPoint(Math.min(Math.max(x, box.left + 1), box.right - 2), next.top + next.height / 2);
  if (!pos || !el.contains(pos.node)) return false;
  document.getSelection()!.collapse(pos.node, pos.offset);
  magic = { el, x, node: pos.node, offset: pos.offset };
  return true;
}

/** Aus dem Bild: dort, wo die Navigation hereinkam, sonst aus der Mitte (getNavigationX) */
function moveFromImage(stage: HTMLElement, img: HTMLElement, direction: Direction): void {
  const r = img.getBoundingClientRect();
  const local = img.dataset.navigationX !== undefined ? Number(img.dataset.navigationX) : r.width / 2;
  moveFrom(stage, img, r.left + local, direction);
}

/** AbstractKeyHandler.skipToStepnumberLinkEnd/-Start: Schreibmarke ans Ende bzw. an den Anfang des Schrittverweises */
function skipStepnumberLink(stage: HTMLElement, el: HTMLElement, forward: boolean): boolean {
  const sel = document.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  const range = sel.getRangeAt(0);
  if (!el.contains(range.startContainer) || !el.contains(range.endContainer)) return false;
  const links = plainAndMarkups(el).markups.filter((m) => m.type === 'Steplink' || m.type === 'ChangedSteplink');
  if (forward) {
    const end = plainOffset(el, range.endContainer, range.endOffset);
    const link = links.find((m) => m.from <= end && end <= m.to);
    if (!link) return false;
    return restoreFocus(stage, { path: el.dataset.path!, offset: link.to + 1 });
  }
  const start = plainOffset(el, range.startContainer, range.startOffset);
  if (start === 0) return false;
  const link = links.find((m) => m.from <= start - 1 && start - 1 <= m.to);
  if (!link) return false;
  return restoreFocus(stage, { path: el.dataset.path!, offset: link.from });
}

export function installFocusMoving(stage: HTMLElement): void {
  stage.addEventListener('keydown', (e) => {
    if (e.isComposing) return;
    const target = e.target as HTMLElement;
    const img = target.closest?.<HTMLElement>(IMAGE);
    if (img && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      // AbstractImageEditArea.keyPressed: immer verbraucht, auch wenn es keinen Nachbarn gibt
      e.preventDefault();
      moveFromImage(stage, img, e.key === 'ArrowUp' ? 'up' : 'down');
      return;
    }
    const el = target.closest?.<HTMLElement>(TEXT);
    if (!el || !el.isContentEditable) return;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // mit Umschalt usw. erweitert die Taste die Auswahl im Text, statt ihn zu verlassen
      if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
      if (moveFromText(stage, el, e.key === 'ArrowUp' ? 'up' : 'down')) e.preventDefault();
      else magic = undefined;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Strg+Alt+Links/Rechts blättert im Original im Bearbeitungsverlauf (nicht portiert)
      if (e.ctrlKey && e.altKey) return;
      if (skipStepnumberLink(stage, el, e.key === 'ArrowRight')) e.preventDefault();
    }
  });
}
