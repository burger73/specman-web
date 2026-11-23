// Dialog „Mit Break-Schritt verknüpfen...“ (CatchLinkDialog, CatchLinkPanel): Liste der unverknüpften Break-Schritte
// der Sequenz mit dem Cursor, ein Klick legt die Catch-Sequenz (bzw. den Co-Catch) an, Schließen bricht ab.
import type { Focus } from '../core/editor.ts';
import { breakStepLabel, catchTargetOfPath, linkCatch, unlinkedBreakSteps } from '../core/catches.ts';
import type { Diagram } from '../core/model.ts';
import { currentFocus } from './focus.ts';

export interface CatchHost {
  diagram(): Diagram | undefined;
  structural(op: (d: Diagram) => Focus | undefined): void;
}

/** CreateCatchSequenceADBLOpButton.execute: ohne Cursor in einem Schritt (oder einer Catch-Überschrift) passiert nichts */
export function openCatchDialog(host: CatchHost): void {
  const d = host.diagram();
  const f = currentFocus();
  if (!d || !f) return;
  const target = catchTargetOfPath(d, f.path);
  if (!target) return;
  const steps = unlinkedBreakSteps(d, target.seq);

  const dialog = document.createElement('dialog');
  dialog.className = 'app-dialog app-catch-dialog';
  const header = document.createElement('div');
  header.className = 'app-dialog-header';
  const icon = document.createElement('img');
  icon.src = '/icons/material/link.svg';
  icon.alt = '';
  const titles = document.createElement('div');
  const h = document.createElement('h3');
  h.textContent = 'Mit Break-Schritt verknüpfen...';
  const p = document.createElement('p');
  p.textContent = 'Eine Catch-Sequenz anlegen, die mit einem Break-Schritt verknüpft ist';
  titles.append(h, p);
  header.append(icon, titles);

  const list = document.createElement('div');
  list.className = 'app-catch-list';
  for (const step of steps) {
    const item = document.createElement('button');
    item.className = 'app-catch-item';
    item.textContent = breakStepLabel(step);
    item.dataset.stepId = step.id;
    item.addEventListener('click', () => {
      dialog.close();
      host.structural((dd) => linkCatch(dd, f.path, step.id));
    });
    list.append(item);
  }

  const buttons = document.createElement('div');
  buttons.className = 'app-dialog-buttons';
  const close = document.createElement('button');
  close.textContent = 'Schließen';
  close.addEventListener('click', () => dialog.close());
  buttons.append(close);

  dialog.append(header, list, buttons);
  dialog.addEventListener('close', () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
  // Enter schließt wie im Original (Schließen ist der Standardknopf)
  close.focus();
}
