// Fokus und Schreibmarke über das Neuzeichnen hinweg: gemerkt werden der Pfad der Text-Area und die Position
// im Klartext (plainText). So passen die Positionen zu denen, die die Operationen in src/core berechnen.
import type { Focus } from '../core/editor.ts';
import { mapPlainToDom } from './markups.ts';
import { plainAndMarkups } from './textedit.ts';

/** Zeichen aus dem privaten Unicode-Bereich, markiert die Schreibmarke in einer Kopie der Area */
const MARK = '';

/** Text-Area mit der Schreibmarke, als Pfad und Klartext-Position */
export function currentFocus(): Focus | undefined {
  const sel = document.getSelection();
  if (!sel || sel.rangeCount === 0) return undefined;
  const node = sel.focusNode;
  const el = (node instanceof Element ? node : node?.parentElement)?.closest<HTMLElement>('[data-path]');
  if (!el) return undefined;
  return { path: el.dataset.path!, offset: plainOffset(el, sel.focusNode!, sel.focusOffset) };
}

/** Klartext-Position einer DOM-Position: in einer Kopie die Marke einsetzen und im Klartext suchen */
export function plainOffset(el: HTMLElement, node: Node, offset: number): number {
  const route: number[] = [];
  for (let n: Node = node; n !== el; n = n.parentNode!) route.unshift(Array.prototype.indexOf.call(n.parentNode!.childNodes, n));
  const copy = el.cloneNode(true) as HTMLElement;
  let target: Node = copy;
  for (const i of route) target = target.childNodes[i];
  const mark = document.createTextNode(MARK);
  if (target instanceof Text) {
    const rest = target.splitText(offset);
    rest.before(mark);
  } else target.insertBefore(mark, target.childNodes[offset] ?? null);
  const i = plainAndMarkups(copy).plainText.indexOf(MARK);
  return i < 0 ? 0 : i;
}

/** Schreibmarke in die Area mit dem Pfad setzen; ohne offset ans Ende. false, wenn es die Area nicht mehr gibt */
export function restoreFocus(root: HTMLElement, focus: Focus): boolean {
  const el = root.querySelector<HTMLElement>(`[data-path="${CSS.escape(focus.path)}"]`);
  if (!el) return false;
  el.focus({ preventScroll: true });
  const sel = document.getSelection();
  if (!sel) return true;
  const range = document.createRange();
  const plain = plainAndMarkups(el).plainText;
  const positions = mapPlainToDom(el, plain);
  const offset = focus.offset ?? plain.length;
  // Schreibmarke vor das Zeichen an offset, bei Leerraum ohne Gegenstück vor das nächste vorhandene
  let pos = undefined;
  for (let i = offset; i < plain.length && !pos; i++) pos = positions[i];
  if (pos) range.setStart(pos.node, pos.offset);
  else {
    // ans Ende: hinter das letzte Zeichen oder ans Ende der Area
    let last = undefined;
    for (let i = Math.min(offset, plain.length) - 1; i >= 0 && !last; i--) last = positions[i];
    if (last) range.setStart(last.node, last.offset + 1);
    else {
      range.selectNodeContents(el);
      range.collapse(offset > 0 ? false : true);
    }
  }
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  el.scrollIntoView({ block: 'nearest' });
  return true;
}

/** Fokus in die erste Text-Area eines Schritts (nach dem Einfügen) */
export function focusStep(root: HTMLElement, stepId: string): boolean {
  const el = root.querySelector<HTMLElement>(`[data-step-id="${CSS.escape(stepId)}"] [data-path]`);
  if (!el) return false;
  return restoreFocus(root, { path: el.dataset.path!, offset: 0 });
}
