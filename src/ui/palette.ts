// Schrittpalette links (StepButtonBar) und die schrittbezogenen Aktionen der Toolbar.
// Die Knöpfe nehmen den Fokus nicht weg, die Operationen beziehen sich auf den Text mit dem Cursor.
import type { Focus } from '../core/editor.ts';
import { EditException } from '../core/editor.ts';
import type { Diagram } from '../core/model.ts';
import { hasSteplinksTo, stepNumbersById } from '../core/steplinks.ts';
import { addCaseBranch, allowsStepDeletion, caseBranchOfPath, deleteOrMarkStep, insertStep, locateStep, stepOfPath, stepTreeIds, toggleBorder, toggleShade, type NewStepKind } from '../core/steps.ts';
import { trackingSet } from '../core/recording.ts';
import { catchHeadingOfPath, removeOrMarkCatchHeading } from '../core/catches.ts';
import { openCatchDialog } from './catchdialog.ts';
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
  bar.append(paletteButton('step-catch', 'Catch-Block', 'Catch-Block anlegen', () => openCatchDialog(host)));
  bar.append(paletteButton('step-case-branch', 'Case-Zweig', 'Case-Zweig anlegen', () => addBranch(host)));
  bar.append(resizeGrip(bar));
  return bar;
}

/** Breite der Palette (neu, nicht im Original): schmaler als die Beschriftungen schneidet diese ab, bis nur die Icons bleiben */
export const PALETTE_MIN_WIDTH = 36;
export const PALETTE_MAX_WIDTH = 300;

export function clampPaletteWidth(w: number): number {
  return Math.round(Math.min(PALETTE_MAX_WIDTH, Math.max(PALETTE_MIN_WIDTH, w)));
}

function resizeGrip(bar: HTMLElement): HTMLElement {
  const grip = document.createElement('div');
  grip.className = 'app-palette-grip';
  grip.title = 'Breite ziehen';
  grip.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startW = bar.getBoundingClientRect().width;
    grip.setPointerCapture(e.pointerId);
    document.body.classList.add('app-col-resize');
    const move = (ev: PointerEvent) => {
      bar.style.width = `${clampPaletteWidth(startW + ev.clientX - startX)}px`;
    };
    const up = () => {
      grip.removeEventListener('pointermove', move);
      grip.removeEventListener('pointerup', up);
      grip.removeEventListener('pointercancel', up);
      document.body.classList.remove('app-col-resize');
    };
    grip.addEventListener('pointermove', move);
    grip.addEventListener('pointerup', up);
    grip.addEventListener('pointercancel', up);
  });
  return grip;
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

/** DeleteStepOpButton / DeleteStepADBLOp: entfernen oder bei eingeschalteter Verfolgung als gelöscht markieren */
export function deleteFocusedStep(host: PaletteHost): void {
  const d = host.diagram();
  const f = currentFocus();
  if (!d || !f) return;
  // Catch-Überschrift: die Catch-Sequenz bzw. den Co-Catch entfernen oder markieren
  if (catchHeadingOfPath(d, f.path)) {
    host.structural((dd) => removeOrMarkCatchHeading(dd, f.path));
    return;
  }
  const step = stepOfPath(d, f.path);
  if (!step) return;
  const b = caseBranchOfPath(d, f.path);
  const marking = trackingSet(d) !== undefined && step.changeInfo?.changetype !== 'Hinzugefuegt';
  if (marking && step.changeInfo?.changetype === 'Geloescht') return;
  // Cursor in einer Zweig-Überschrift: den Zweig entfernen statt des Schritts (Sonst bleibt, mit Meldung)
  if (b && !marking) {
    host.structural((dd) => deleteOrMarkStep(dd, b.step.id, b.branch));
    return;
  }
  // isDeletionAllowed (beim Markieren auch für einen Zweig, wie im Original)
  const loc = locateStep(d, step.id);
  if (loc && !allowsStepDeletion(loc.seq)) return alert(new EditException('Der letzte Schritt kann nicht entfernt werden.').message);
  const numbers = stepNumbersById(d);
  const removed = new Set(stepTreeIds(step).map((id) => numbers.get(id)!));
  if (
    hasSteplinksTo(d, removed) &&
    !confirm("Der zu löschende Schritt wird referenziert. Möchten Sie den Schritt wirklich löschen? Die Referenzen werden dann als 'Defekt' markiert.")
  )
    return;
  host.structural((dd) => deleteOrMarkStep(dd, step.id, b?.branch));
}

/** Operation auf dem Schritt mit dem Cursor (Einfärben, Rahmen); ohne Schritt passiert nichts, wie im Original */
export function onFocusedStep(host: PaletteHost, op: (d: Diagram, stepId: string) => void): void {
  const d = host.diagram();
  const f = currentFocus();
  const step = d && f ? stepOfPath(d, f.path) : undefined;
  if (!step) return;
  host.structural((dd) => {
    op(dd, step.id);
    return f;
  });
}

export const toneFocusedStep = (host: PaletteHost) => onFocusedStep(host, toggleShade);
export const toggleBorderOfFocusedStep = (host: PaletteHost) => onFocusedStep(host, toggleBorder);
