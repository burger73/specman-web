// Werkzeuggruppe „Änderungen“ (DiagramToolBar: ChangeSetButton, Änderungen verfolgen, übernehmen, verwerfen,
// Change Sets zusammenführen, Review). Change Set und Verfolgen stehen im Modell (settings der Datei).
// Umschalten ist wie im Original kein Undo-Schritt.
import { CHANGE_SETS, changeSet, css, type ChangeSetColors } from '../core/changesets.ts';
import type { DiagramEditor, Focus } from '../core/editor.ts';
import { EditException } from '../core/editor.ts';
import type { Diagram } from '../core/model.ts';
import { acceptChanges, collapseForReview, mergeChangeSets, NO_CHANGES_MESSAGE, rejectChanges } from '../core/tracking.ts';
import { domTextTracker } from './texttrack.ts';

export interface ChangesHost {
  editor(): DiagramEditor | undefined;
  /** Knopf der Toolbar wie in main.ts */
  button(icon: string, title: string, onClick: () => void): HTMLButtonElement;
  /** Operation als Undo-Schritt, danach neu zeichnen; Fehler erscheinen als Meldung */
  structural(op: (d: Diagram) => Focus | undefined): void;
  /** neu zeichnen ohne Undo-Schritt (nach dem Zuklappen für das Review) */
  redraw(): void;
}

export interface ChangesGroup {
  element: HTMLElement;
  /** Zustand aus dem Modell übernehmen (nach Laden, Undo, …) */
  update(): void;
}

/** ChangeSetDotIcon: farbiger Punkt mit dunklem Rand */
function dot(cs: ChangeSetColors): HTMLElement {
  const d = document.createElement('span');
  d.className = 'app-cs-dot';
  d.style.backgroundColor = css(cs.text);
  return d;
}

/** Popup unter einem Knopf mit einem Eintrag je Change Set (ChangeSetButton, MergeChangeSetsADBLOpButton) */
export function changeSetPopup(anchor: HTMLElement, sets: ChangeSetColors[], onChoose: (name: string) => void): void {
  document.querySelector('.app-cs-popup')?.remove();
  const popup = document.createElement('div');
  popup.className = 'app-cs-popup';
  for (const cs of sets) {
    const item = document.createElement('button');
    item.className = 'app-cs-item';
    item.dataset.changeset = cs.name;
    item.style.backgroundColor = css(cs.panel);
    item.style.setProperty('--cs-hover', css(cs.text));
    item.append(dot(cs), cs.name);
    item.addEventListener('mousedown', (e) => e.preventDefault());
    item.addEventListener('click', () => {
      popup.remove();
      onChoose(cs.name);
    });
    popup.append(item);
  }
  const r = anchor.getBoundingClientRect();
  popup.style.left = `${r.left + window.scrollX}px`;
  popup.style.top = `${r.bottom + window.scrollY}px`;
  document.body.append(popup);
  const close = (e: Event) => {
    if (popup.contains(e.target as Node)) return;
    popup.remove();
    document.removeEventListener('mousedown', close, true);
  };
  setTimeout(() => document.addEventListener('mousedown', close, true));
}

export function createChangesGroup(host: ChangesHost): ChangesGroup {
  const group = document.createElement('div');
  group.className = 'app-group';

  const csBtn = document.createElement('button');
  csBtn.className = 'app-cs-btn';
  csBtn.title = 'Change Set';
  csBtn.dataset.name = 'toolbar.changeset';
  csBtn.addEventListener('mousedown', (e) => e.preventDefault());
  csBtn.addEventListener('click', () =>
    changeSetPopup(csBtn, [...CHANGE_SETS.values()], (name) => {
      host.editor()?.mutateSilently((d) => (d.changeSetName = name));
    }),
  );

  const track = host.button('material/format_ink_highlighter', 'Änderungen verfolgen', () => {
    host.editor()?.mutateSilently((d) => (d.changeModeEnabled = !d.changeModeEnabled));
  });
  track.classList.add('app-toggle');
  track.dataset.name = 'toolbar.track.changes';

  /** AcceptChangesADBLOpButton / RejectChangesADBLOpButton: ohne Änderungen nur die Meldung, kein Undo-Schritt */
  const resolve = (fn: typeof acceptChanges) =>
    host.structural((d) => {
      if (fn(d, d.changeSetName, domTextTracker) === 0) throw new EditException(NO_CHANGES_MESSAGE);
      return undefined;
    });
  const accept = host.button('material/check_circle', 'Änderungen des ausgewählten Change Sets übernehmen', () => resolve(acceptChanges));
  accept.dataset.name = 'toolbar.accept.changes';
  const reject = host.button('material/cancel', 'Änderungen des ausgewählten Change Sets verwerfen', () => resolve(rejectChanges));
  reject.dataset.name = 'toolbar.reject.changes';

  /** MergeChangeSetsADBLOpButton: Popup mit den anderen Sets, deren Änderungen dem aktuellen zugeschlagen werden */
  const merge = host.button('material/merge', 'Change Sets zusammenführen', () => {
    const d = host.editor()?.diagram;
    if (!d) return;
    const others = [...CHANGE_SETS.values()].filter((cs) => cs.name !== d.changeSetName);
    changeSetPopup(merge, others, (source) =>
      host.structural((dd) => {
        mergeChangeSets(dd, dd.changeSetName, source);
        return undefined;
      }),
    );
  });
  merge.dataset.name = 'toolbar.merge.changesets';

  /** ReviewOpButton: Klappen ist wie im Original kein Undo-Schritt */
  const review = host.button('material/text_compare', 'Für Review zusammenklappen', () => {
    host.editor()?.mutateSilently(collapseForReview);
    host.redraw();
  });
  review.dataset.name = 'toolbar.review';

  group.append(csBtn, track, accept, reject, merge, review);

  function update(): void {
    const d = host.editor()?.diagram;
    for (const b of [csBtn, track, accept, reject, merge, review]) b.disabled = !d;
    if (!d) return;
    const cs = changeSet(d.changeSetName);
    csBtn.replaceChildren(dot(cs), 'Change Set ▾');
    csBtn.style.backgroundColor = css(cs.panel);
    track.classList.toggle('app-toggle-on', d.changeModeEnabled);
    track.setAttribute('aria-pressed', String(d.changeModeEnabled));
  }

  return { element: group, update };
}
