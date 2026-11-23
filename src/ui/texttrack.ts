// Änderungs-Markups im Text übernehmen oder verwerfen (TextEditArea.aenderungenUebernehmen/-Verwerfen,
// ChangemarkDecolorer). Gelöschter Text ist <strike> mit einem Changed-Markup darüber, hinzugefügter nur das Markup.
// Der Text wird dazu wie beim Bearbeiten als DOM aufgebaut (Markups als Spans) und danach zurückgelesen.
import type { TextEditArea } from '../core/model.ts';
import { markupChangeset, textChangedBy, type TextTracker } from '../core/tracking.ts';
import { applyMarkups } from './markups.ts';
import { sanitizeHtml } from './sanitize.ts';
import { readTextArea } from './textedit.ts';

const STRIKE = 'strike, s, del';

/** Text-Area als DOM mit Markup-Spans (data-markup = Index des Markups) */
export function textToDom(area: TextEditArea): HTMLElement {
  const root = document.createElement('div');
  root.append(sanitizeHtml(area.text));
  if (area.markups.length > 0) applyMarkups(root, area.plainText, area.markups, () => '');
  return root;
}

/** Liegt das Element in gestrichenem Text? */
export function isStruck(el: Element, root: Element): boolean {
  for (let e: Element | null = el; e && e !== root; e = e.parentElement) {
    if (e.matches(STRIKE) || /line-through/.test((e as HTMLElement).style?.textDecoration ?? '')) return true;
  }
  return false;
}

/** Streichung über el aufheben: das umgebende <strike> wird geteilt, der Teil mit el ausgepackt */
export function unstrike(el: Element, root: Element): void {
  for (;;) {
    let strike: Element | null = el.parentElement;
    while (strike && strike !== root && !strike.matches(STRIKE)) strike = strike.parentElement;
    if (!strike || strike === root) return;
    const before = document.createRange();
    before.setStartBefore(strike);
    before.setEndBefore(el);
    const head = before.extractContents();
    const after = document.createRange();
    after.setStartAfter(el);
    after.setEndAfter(strike);
    const tail = after.extractContents();
    // extractContents liefert Kopien des <strike> mit dem Teil davor bzw. danach
    strike.before(head);
    strike.after(tail);
    strike.replaceWith(...Array.from(strike.childNodes));
    removeEmpty(root);
  }
}

function removeEmpty(root: Element): void {
  for (const e of Array.from(root.querySelectorAll(STRIKE)).reverse()) if (e.textContent === '' && !e.querySelector('br, img')) e.remove();
}

function resolve(area: TextEditArea, cs: string, mode: 'accept' | 'reject'): number {
  if (!textChangedBy(area, cs)) return 0;
  const root = textToDom(area);
  // ein Markup kann über mehrere Spans reichen (Formatierungen, Absätze)
  const spans = Array.from(root.querySelectorAll<HTMLElement>('span.sm-markup')).filter((s) => {
    const m = area.markups[Number(s.dataset.markup)];
    return m !== undefined && markupChangeset(m) === cs;
  });
  const touched = new Set<string>();
  for (const s of spans) {
    touched.add(s.dataset.markup!);
    const struck = isStruck(s, root);
    const remove = mode === 'accept' ? struck : !struck;
    if (remove) {
      s.remove();
      continue;
    }
    if (struck) unstrike(s, root);
    if (s.dataset.type === 'ChangedSteplink') {
      // Schrittverweis bleibt, nur die Änderungsfarbe verschwindet
      s.dataset.type = 'Steplink';
      delete s.dataset.changeset;
    } else s.replaceWith(...Array.from(s.childNodes));
  }
  const read = readTextArea(root);
  area.text = read.text;
  area.plainText = read.plainText;
  area.markups = read.markups;
  return touched.size;
}

export const domTextTracker: TextTracker = {
  accept: (area, cs) => resolve(area, cs, 'accept'),
  reject: (area, cs) => resolve(area, cs, 'reject'),
};
