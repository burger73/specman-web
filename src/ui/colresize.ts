// Spaltenbreiten ziehen wie mit dem SpaltenResizer des Originals: Während des Ziehens steht eine gestrichelte
// senkrechte Linie (WorkingAreaPanel.showDragLine), erst beim Loslassen ändert sich das Layout, Escape bricht ab.
// Jede wirksame Änderung ist ein Undo-Schritt. Die Ziehgriffe setzt render.ts (data-resize), Tabellen meldet
// tableedit.ts über startColumnDrag.
import { columnResize, type ResizeTarget } from '../core/columns.ts';
import type { Focus } from '../core/editor.ts';
import type { Diagram } from '../core/model.ts';
import { currentFocus } from './focus.ts';

export interface ColumnResizeHost {
  diagram(): Diagram | undefined;
  structural(op: (d: Diagram) => Focus | undefined): void;
}

export function installColumnResizing(stage: HTMLElement, host: ColumnResizeHost): void {
  stage.addEventListener('pointerdown', (e) => {
    const handle = (e.target as HTMLElement).closest?.<HTMLElement>('.sm-resizer[data-resize]');
    if (!handle || e.button !== 0) return;
    const target = JSON.parse(handle.dataset.resize!) as ResizeTarget;
    startColumnDrag(e, (delta) => applyResize(host, target, handle, delta));
  });
}

/** Ziehen beginnen; onDrop bekommt die Verschiebung in Bildschirmpixeln */
export function startColumnDrag(e: PointerEvent | MouseEvent, onDrop: (delta: number) => void): void {
  e.preventDefault();
  const startX = e.clientX;
  const line = document.createElement('div');
  line.className = 'sm-dragline';
  let dragged = false;
  const move = (ev: PointerEvent) => {
    if (ev.clientX !== startX) dragged = true;
    if (!dragged) return;
    line.style.left = `${ev.clientX}px`;
    if (!line.isConnected) document.body.append(line);
  };
  const end = (ev: PointerEvent | undefined) => {
    window.removeEventListener('pointermove', move, true);
    window.removeEventListener('pointerup', up, true);
    window.removeEventListener('pointercancel', cancel, true);
    window.removeEventListener('keydown', key, true);
    document.body.classList.remove('app-col-resize');
    line.remove();
    if (ev && dragged && ev.clientX !== startX) onDrop(ev.clientX - startX);
  };
  const up = (ev: PointerEvent) => end(ev);
  const cancel = () => end(undefined);
  const key = (ev: KeyboardEvent) => {
    if (ev.key !== 'Escape') return;
    ev.preventDefault();
    ev.stopPropagation();
    end(undefined);
  };
  window.addEventListener('pointermove', move, true);
  window.addEventListener('pointerup', up, true);
  window.addEventListener('pointercancel', cancel, true);
  window.addEventListener('keydown', key, true);
  document.body.classList.add('app-col-resize');
}

/** Bildschirmpixel → Pixel beim gespeicherten Zoom (die Ansicht kann anders gezoomt sein als die Datei) */
export function screenToModel(d: Diagram, el: Element): number {
  const sheet = el.closest<HTMLElement>('.sm-sheet');
  const viewZoom = sheet && sheet.offsetWidth ? sheet.getBoundingClientRect().width / sheet.offsetWidth : 1;
  return (d.zoomFactor || 100) / 100 / viewZoom;
}

const widthOf = (el: Element | null | undefined) => el?.getBoundingClientRect().width ?? 0;
const children = (el: Element, selector: string) => Array.from(el.querySelectorAll(`:scope > ${selector}`));

/** Breiten, die die View des Originals für spaltenbreitenAnpassenNachMausDragging misst (in Bildschirmpixeln) */
function measure(target: ResizeTarget, handle: HTMLElement): number[] {
  const parent = handle.parentElement!;
  switch (target.kind) {
    case 'diagram':
      return [];
    case 'ifElse':
    case 'case':
      return children(parent, '.sm-branch-heading').map(widthOf);
    case 'if':
      return [widthOf(children(parent, '.sm-branch-heading')[0])];
    case 'loop':
      return [widthOf(parent.querySelector(':scope > .sm-loop-bar'))];
    case 'catchColumns':
      return children(parent, '.sm-catch').map(widthOf);
    case 'coCatchBar':
      return [widthOf(parent.closest('.sm-catch'))];
    case 'tableColumns':
    case 'tableWidth':
      return []; // misst tableedit.ts
  }
}

function applyResize(host: ColumnResizeHost, target: ResizeTarget, handle: HTMLElement, screenDelta: number, screenWidths?: number[]): void {
  const d = host.diagram();
  if (!d) return;
  const k = screenToModel(d, handle);
  const widths = (screenWidths ?? measure(target, handle)).map((w) => Math.round(w * k));
  const change = columnResize(d, target, widths, Math.round(screenDelta * k));
  if (!change) return;
  const focus = currentFocus();
  host.structural((dd) => {
    change(dd);
    return focus;
  });
}

/** Für Tabellen: Ziel und gemessene Breiten (Bildschirmpixel) kommen von tableedit.ts */
export function resizeTableDrag(host: ColumnResizeHost, e: MouseEvent, wrap: HTMLElement, target: ResizeTarget, screenWidths: number[]): void {
  startColumnDrag(e, (delta) => applyResize(host, target, wrap, delta, screenWidths));
}
