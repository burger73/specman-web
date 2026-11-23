// Fokus und Schreibmarke über das Neuzeichnen hinweg: gemerkt werden Pfad der Text-Area und Zeichenposition.
import type { Focus } from '../core/editor.ts';

/** Text-Area mit der Schreibmarke, als Pfad und Zeichenposition */
export function currentFocus(): Focus | undefined {
  const sel = document.getSelection();
  if (!sel || sel.rangeCount === 0) return undefined;
  const node = sel.focusNode;
  const el = (node instanceof Element ? node : node?.parentElement)?.closest<HTMLElement>('[data-path]');
  if (!el) return undefined;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.setEnd(sel.focusNode!, sel.focusOffset);
  return { path: el.dataset.path!, offset: range.toString().length };
}

/** Schreibmarke in die Area mit dem Pfad setzen; ohne offset ans Ende. false, wenn es die Area nicht mehr gibt */
export function restoreFocus(root: HTMLElement, focus: Focus): boolean {
  const el = root.querySelector<HTMLElement>(`[data-path="${CSS.escape(focus.path)}"]`);
  if (!el) return false;
  el.focus({ preventScroll: true });
  const sel = document.getSelection();
  if (!sel) return true;
  const range = document.createRange();
  let rest = focus.offset ?? Infinity;
  let found = false;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode() as Text | null; n && !found; n = walker.nextNode() as Text | null) {
    if (rest <= n.data.length) {
      range.setStart(n, rest);
      found = true;
    } else rest -= n.data.length;
  }
  if (!found) {
    range.selectNodeContents(el);
    range.collapse(false);
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
