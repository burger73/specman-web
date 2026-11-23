// Schrittverweise anlegen und ihnen folgen: Dialog „Link auf Schrittnummer...“ (StepnumberLinkAction,
// StepnumberLinkPanel, StepnumberLinkDialog), TextEditArea.addStepnumberLink und Strg+Klick (scrollToStepnumber).
import type { DiagramEditor, Focus } from '../core/editor.ts';
import { content } from '../core/factory.ts';
import type { Diagram, Markup, TextEditArea } from '../core/model.ts';
import { resolvePath } from '../core/paths.ts';
import { trackingSet } from '../core/recording.ts';
import { filterStepChoices, isSteplinkDefect, stepChoices, stepIdByNumber, type StepChoice } from '../core/steplinks.ts';
import { focusStep, plainOffset, restoreFocus } from './focus.ts';
import { plainAndMarkups, readTextArea } from './textedit.ts';

export interface SteplinkHost {
  editor(): DiagramEditor | undefined;
  structural(op: (d: Diagram) => Focus | undefined): void;
}

/** StepnumberLinkPanel.MAXIMAL_REFERENCE_TEXTLENGTH */
const MAXIMAL_REFERENCE_TEXTLENGTH = 60;
const LINK_SPAN = '.sm-markup-Steplink, .sm-markup-ChangedSteplink';
const isSteplink = (m: Markup) => m.type === 'Steplink' || m.type === 'ChangedSteplink';

/** StepnumberLinkAction.doEdit: Dialog mit allen Schritten; ohne Schreibmarke in einem Text passiert nichts */
export function openSteplinkDialog(host: SteplinkHost): void {
  const editor = host.editor();
  const sel = document.getSelection();
  const node = sel?.focusNode;
  const el = (node instanceof Element ? node : node?.parentElement)?.closest<HTMLElement>('[data-path]');
  if (!editor || !sel || !node || !el || !el.isContentEditable) return;
  // Schreibmarke vor dem Dialog sichern, er nimmt den Fokus weg
  const caret = { node, offset: sel.focusOffset };
  const steps = stepChoices(editor.diagram);

  const dialog = document.createElement('dialog');
  dialog.className = 'app-dialog app-catch-dialog app-steplink-dialog';
  const header = document.createElement('div');
  header.className = 'app-dialog-header';
  const icon = document.createElement('img');
  icon.src = 'icons/material/jump_to_element.svg';
  icon.alt = '';
  const titles = document.createElement('div');
  const h = document.createElement('h3');
  h.textContent = 'Link auf Schrittnummer...';
  const p = document.createElement('p');
  p.textContent = 'Einen Link auf eine Schrittnummer einfügen';
  titles.append(h, p);
  header.append(icon, titles);

  const filter = document.createElement('input');
  filter.className = 'app-steplink-filter';
  filter.type = 'text';
  const list = document.createElement('div');
  list.className = 'app-catch-list';
  const fill = (choices: StepChoice[]) => {
    list.replaceChildren(
      ...choices.map((c) => {
        const item = document.createElement('button');
        item.className = 'app-catch-item';
        // JLabel zeigt alles in einer Zeile
        item.textContent = c.label.substring(0, MAXIMAL_REFERENCE_TEXTLENGTH).replaceAll('\n', ' ');
        item.dataset.stepId = c.id;
        item.addEventListener('click', () => {
          dialog.close();
          insertSteplink(host, el, caret, c.number);
        });
        return item;
      }),
    );
  };
  fill(steps);
  filter.addEventListener('input', () => fill(filterStepChoices(steps, filter.value)));
  // Enter schließt wie im Original (Schließen ist der Standardknopf)
  filter.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      dialog.close();
    }
  });

  const buttons = document.createElement('div');
  buttons.className = 'app-dialog-buttons';
  const close = document.createElement('button');
  close.textContent = 'Schließen';
  close.addEventListener('click', () => dialog.close());
  buttons.append(close);

  dialog.append(header, filter, list, buttons);
  dialog.addEventListener('close', () => {
    dialog.remove();
    // ohne Auswahl zurück an die alte Stelle
    if (el.isConnected && !el.contains(document.getSelection()?.focusNode ?? null)) {
      el.focus({ preventScroll: true });
      document.getSelection()?.collapse(caret.node, caret.offset);
    }
  });
  document.body.append(dialog);
  dialog.showModal();
  filter.focus();
}

/**
 * TextEditArea.addStepnumberLink: die Nummer am Cursor als Verweis einfügen, mit eingeschalteter Verfolgung als
 * ChangedSteplink des Sets. Steht davor schon ein Verweis, kommt ein Leerzeichen dazwischen, damit beide getrennt
 * bleiben. Ein Undo-Schritt.
 */
export function insertSteplink(host: SteplinkHost, el: HTMLElement, caret: { node: Node; offset: number }, number: string): void {
  const editor = host.editor();
  if (!editor || !el.isConnected || !el.contains(caret.node)) return;
  const cs = trackingSet(editor.diagram);
  const range = document.createRange();
  range.setStart(caret.node, caret.offset);
  range.collapse(true);
  // nie in einen bestehenden Verweis hinein: hinter ihn
  const inLink = (caret.node instanceof Element ? caret.node : caret.node.parentElement)?.closest<HTMLElement>(LINK_SPAN);
  if (inLink && el.contains(inLink)) range.setStartAfter(inLink);
  const at = plainOffset(el, range.startContainer, range.startOffset);
  const linkBefore = at > 0 && plainAndMarkups(el).markups.some((m) => isSteplink(m) && m.from <= at - 1 && at - 1 <= m.to);

  const type = cs ? 'ChangedSteplink' : 'Steplink';
  const span = document.createElement('span');
  span.className = `sm-markup sm-markup-${type}`;
  span.dataset.markup = 'new';
  span.dataset.type = type;
  if (cs) span.dataset.changeset = cs;
  span.textContent = number;
  const frag = document.createDocumentFragment();
  if (linkBefore) frag.append(document.createTextNode(' '));
  frag.append(span);
  range.insertNode(frag);

  const read = readTextArea(el);
  const parent = span.parentNode!;
  const offset = plainOffset(el, parent, Array.prototype.indexOf.call(parent.childNodes, span) + 1);
  const path = el.dataset.path!;
  host.structural((d) => {
    // Intro/Outro ohne Inhalt gibt es nur in der Darstellung (wie beim Tippen, textinput.ts)
    if (path === 'intro/areas/0') d.intro ??= content();
    if (path === 'outro/areas/0') d.outro ??= content();
    const area = resolvePath(d, path) as TextEditArea | undefined;
    if (area?.kind !== 'text') throw new Error(`Text-Area ${path} nicht gefunden`);
    area.text = read.text;
    area.plainText = read.plainText;
    area.markups = read.markups;
    return { path, offset };
  });
}

/** Nummer, auf die ein Verweis-Span zeigt: alle Spans desselben Markups zusammen */
function linkNumber(span: HTMLElement, el: HTMLElement): string {
  const parts = Array.from(el.querySelectorAll<HTMLElement>(`[data-markup="${CSS.escape(span.dataset.markup ?? '')}"]`));
  return (parts.length ? parts : [span]).map((s) => s.textContent ?? '').join('').trim();
}

/** EditContainer.scrollTo: Schreibmarke an den Anfang des ersten Texts im Schritt */
function scrollToStep(stage: HTMLElement, stepId: string): void {
  const stepEl = stage.querySelector<HTMLElement>(`[data-step-id="${CSS.escape(stepId)}"]`);
  const first = Array.from(stepEl?.querySelectorAll<HTMLElement>('[data-path]') ?? []).find(
    (e) => e.closest('[data-step-id]') === stepEl && e.dataset.path!.endsWith('/content/areas/0'),
  );
  if (!first || !restoreFocus(stage, { path: first.dataset.path!, offset: 0 })) focusStep(stage, stepId);
}

export function installSteplinkFollowing(stage: HTMLElement, host: SteplinkHost): void {
  // Strg+Klick auf einen Verweis springt zum Schritt (TextEditArea.mousePressed, scrollToStepnumber)
  stage.addEventListener('mousedown', (e) => {
    if (!e.ctrlKey || e.button !== 0) return;
    const span = (e.target as HTMLElement).closest?.<HTMLElement>(LINK_SPAN);
    const el = span?.closest<HTMLElement>('[data-path]');
    const editor = host.editor();
    if (!span || !el || !editor) return;
    e.preventDefault();
    const number = linkNumber(span, el);
    if (isSteplinkDefect(number)) {
      alert('Springen nicht möglich\n\nDer Schritt, auf den der Schrittnummer-Link verwiesen hat, existiert nicht mehr.');
      return;
    }
    const id = stepIdByNumber(editor.diagram, number);
    if (id) scrollToStep(stage, id);
  });
  // Handzeiger über Verweisen, solange Strg gedrückt ist (setHandCursorWhenHoveringStepnumberLink)
  const ctrl = (on: boolean) => document.body.classList.toggle('app-ctrl', on);
  window.addEventListener('keydown', (e) => ctrl(e.ctrlKey));
  window.addEventListener('keyup', (e) => ctrl(e.ctrlKey));
  window.addEventListener('blur', () => ctrl(false));
}
