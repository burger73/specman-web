// Schrittpalette links (StepButtonBar) und die schrittbezogenen Aktionen der Toolbar.
// Die Knöpfe nehmen den Fokus nicht weg, die Operationen beziehen sich auf den Text mit dem Cursor.
import type { Focus } from '../core/editor.ts';
import { EditException } from '../core/editor.ts';
import type { Diagram } from '../core/model.ts';
import { hasSteplinksTo, stepNumbersById } from '../core/steplinks.ts';
import { addCaseBranch, caseBranchOfPath, deleteStep, insertStep, locateStep, removeCaseBranch, stepOfPath, stepTreeIds, type NewStepKind } from '../core/steps.ts';
import { currentFocus } from './focus.ts';

export interface PaletteHost {
  diagram(): Diagram | undefined;
  /** wie TextInputHost.structural: Undo-Schritt, neu zeichnen, Fokus setzen */
  structural(op: (d: Diagram) => Focus | undefined): void;
}

/** Art, Icon, Beschriftung und Tooltip wie in den i18n-Texten des Originals (palette.label.*, palette.create.*) */
const STEPS: [NewStepKind, string, string, string][] = [
  ['simple', 'step-simple', 'Einfacher Schritt', 'Einfachen Schritt anlegen'],
  ['while', 'step-while', 'While-Schritt', 'While-Schritt anlegen'],
  ['doWhile', 'step-whilewhile', 'While-While-Schritt', 'While-While-Schritt anlegen'],
  ['ifElse', 'step-ifelse', 'If-Else-Schritt', 'If-Else-Schritt anlegen'],
  ['if', 'step-if', 'If-Schritt', 'If-Schritt anlegen'],
  ['case', 'step-case', 'Case-Schritt', 'Case-Schritt anlegen'],
  ['subsequence', 'step-subsequence', 'Subsequenz-Schritt', 'Subsequenz-Schritt anlegen'],
  ['break', 'step-break', 'Break-Schritt', 'Break-Schritt anlegen'],
];

export function createPalette(host: PaletteHost): HTMLElement {
  const bar = document.createElement('nav');
  bar.className = 'app-palette';
  for (const [kind, icon, label, title] of STEPS) {
    bar.append(paletteButton(icon, label, title, () => host.structural((d) => insertStep(d, kind, focusedStepId(d)))));
  }
  bar.append(paletteButton('step-case-branch', 'Case-Zweig', 'Case-Zweig anlegen', () => addBranch(host)));
  return bar;
}

function paletteButton(icon: string, label: string, title: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'app-palette-btn';
  b.title = title;
  const img = document.createElement('img');
  img.src = `/icons/specman/${icon}.svg`;
  img.alt = '';
  const span = document.createElement('span');
  span.textContent = label;
  b.append(img, span);
  b.addEventListener('mousedown', (e) => e.preventDefault());
  b.addEventListener('click', onClick);
  return b;
}

function focusedStepId(d: Diagram): string | undefined {
  const f = currentFocus();
  return f ? stepOfPath(d, f.path)?.id : undefined;
}

/** CreateCaseBranchADBLOpButton */
function addBranch(host: PaletteHost): void {
  const d = host.diagram();
  const f = currentFocus();
  if (!d) return;
  if (!f || stepOfPath(d, f.path)?.kind !== 'case') return alert('Kein Case-Schritt ausgewählt');
  const b = caseBranchOfPath(d, f.path);
  if (!b) return alert('Kein Zweig ausgewählt');
  host.structural((dd) => addCaseBranch(dd, b.step.id, b.branch));
}

/** DeleteStepOpButton / DeleteStepADBLOp ohne Änderungsverfolgung */
export function deleteFocusedStep(host: PaletteHost): void {
  const d = host.diagram();
  const f = currentFocus();
  if (!d || !f) return;
  const step = stepOfPath(d, f.path);
  if (!step) return;
  const b = caseBranchOfPath(d, f.path);
  // Cursor in einer Zweig-Überschrift: den Zweig entfernen statt des Schritts (Sonst bleibt, mit Meldung)
  if (b) {
    host.structural((dd) => removeCaseBranch(dd, b.step.id, b.branch));
    return;
  }
  const loc = locateStep(d, step.id);
  if (loc && loc.seq.steps.length <= 1) return alert(new EditException('Der letzte Schritt kann nicht entfernt werden.').message);
  const numbers = stepNumbersById(d);
  const removed = new Set(stepTreeIds(step).map((id) => numbers.get(id)!));
  if (
    hasSteplinksTo(d, removed) &&
    !confirm("Der zu löschende Schritt wird referenziert. Möchten Sie den Schritt wirklich löschen? Die Referenzen werden dann als 'Defekt' markiert.")
  )
    return;
  host.structural((dd) => deleteStep(dd, step.id));
}
