// Tabellen bearbeiten wie TableEditAreaSelectionTracker: Im Rand links und über der Tabelle wählt die Maus Zeilen,
// Spalten und die Lücken dazwischen aus, die Ecke oben links die ganze Tabelle, der Streifen darunter einen neuen
// Absatz. Ein Klick führt die Operation aus. Der Mauszeiger zeigt sie mit den Cursor-Grafiken des Originals an.
import { addTableColumn, addTableRow, insertTable, paragraphBelow, removeOrMarkArea, removeTableColumn, removeTableRow } from '../core/areas.ts';
import type { Focus } from '../core/editor.ts';
import type { Diagram } from '../core/model.ts';
import { resizeTableDrag, type ColumnResizeHost } from './colresize.ts';
import { splitAtCaret } from './textsplit.ts';

type Operation = 'addRow' | 'removeRow' | 'addColumn' | 'removeColumn' | 'removeTable' | 'paragraphBelow' | 'resizeColumn' | 'resizeTable';

interface Selection {
  op: Operation;
  index: number;
  /** Hervorhebung in Bildschirmkoordinaten */
  rect: { left: number; top: number; width: number; height: number };
}

/** SELEECTION_GAP_SIZE = 4 * LINIENBREITE */
const GAP = 8;

export interface TableHost extends ColumnResizeHost {
  structural(op: (d: Diagram) => Focus | undefined): void;
}

/** Halbe Breite der Ziehzone auf Spaltengrenzen und am rechten Tabellenrand (SpaltenResizer) */
const RESIZE_HALF = 3;

export function installTableEditing(stage: HTMLElement, host: TableHost): void {
  let current: { wrap: HTMLElement; sel: Selection } | undefined;
  const overlay = document.createElement('div');
  overlay.className = 'sm-table-selection';

  const clear = () => {
    if (current) current.wrap.removeAttribute('data-table-op');
    current = undefined;
    overlay.remove();
  };

  stage.addEventListener('mousemove', (e) => {
    const wrap = (e.target as HTMLElement).closest?.<HTMLElement>('.sm-table-wrap[data-table-path]');
    const table = wrap?.querySelector<HTMLTableElement>(':scope > table');
    if (!wrap || !table || wrap.closest('[contenteditable="false"]')) return clear();
    const sel = selectionAt(table, wrap, e.clientX, e.clientY);
    if (!sel) return clear();
    if (sel.op === 'resizeColumn' || sel.op === 'resizeTable') {
      // Ziehgriff: nur der Mauszeiger, keine Hervorhebung
      if (current && current.wrap !== wrap) current.wrap.removeAttribute('data-table-op');
      current = { wrap, sel };
      wrap.dataset.tableOp = sel.op;
      overlay.remove();
      return;
    }
    if (current && current.wrap !== wrap) current.wrap.removeAttribute('data-table-op');
    current = { wrap, sel };
    wrap.dataset.tableOp = sel.op;
    // Hervorhebung in den (gezoomten) CSS-Pixeln der Tabelle
    const w = wrap.getBoundingClientRect();
    const zoom = w.width / wrap.offsetWidth || 1;
    Object.assign(overlay.style, {
      left: `${(sel.rect.left - w.left) / zoom}px`,
      top: `${(sel.rect.top - w.top) / zoom}px`,
      width: `${sel.rect.width / zoom}px`,
      height: `${sel.rect.height / zoom}px`,
    });
    if (overlay.parentElement !== wrap) wrap.append(overlay);
  });
  stage.addEventListener('mouseleave', clear);

  stage.addEventListener('mousedown', (e) => {
    if (!current || e.button !== 0) return;
    const { wrap, sel } = current;
    if (!wrap.contains(e.target as Node)) return;
    e.preventDefault();
    const path = wrap.dataset.tablePath!;
    clear();
    if (sel.op === 'resizeColumn' || sel.op === 'resizeTable') {
      // TableEditArea: Resizer zwischen den Spalten bzw. am rechten Rand (WHOLETABLE_COLUMN_INDICATOR)
      const table = wrap.querySelector<HTMLTableElement>(':scope > table')!;
      const cells = Array.from(table.rows[0].cells).map((c) => c.getBoundingClientRect().width);
      const w = wrap.getBoundingClientRect();
      const zoom = w.width / wrap.offsetWidth || 1;
      const available = (wrap.clientWidth - parseFloat(getComputedStyle(wrap).paddingLeft) - parseFloat(getComputedStyle(wrap).paddingRight)) * zoom;
      if (sel.op === 'resizeColumn') resizeTableDrag(host, e, wrap, { kind: 'tableColumns', path, column: sel.index }, cells);
      else resizeTableDrag(host, e, wrap, { kind: 'tableWidth', path }, [table.getBoundingClientRect().width, available]);
      return;
    }
    host.structural((d) => {
      switch (sel.op) {
        case 'addRow':
          return addTableRow(d, path, sel.index);
        case 'removeRow':
          return removeTableRow(d, path, sel.index);
        case 'addColumn':
          return addTableColumn(d, path, sel.index);
        case 'removeColumn':
          return removeTableColumn(d, path, sel.index);
        case 'removeTable':
          return removeOrMarkArea(d, path);
        case 'paragraphBelow':
          return paragraphBelow(d, path);
        default:
          return undefined;
      }
    });
  });
}

/** Zonen in der Reihenfolge des Originals (TableEditAreaSelectionTracker.mouseMoved) */
function selectionAt(table: HTMLTableElement, wrap: HTMLElement, x: number, y: number): Selection | undefined {
  const t = table.getBoundingClientRect();
  const rows = Array.from(table.rows).map((r) => r.getBoundingClientRect());
  const cols = Array.from(table.rows[0]?.cells ?? []).map((c) => c.getBoundingClientRect());
  if (rows.length === 0 || cols.length === 0) return undefined;
  const strip = (left: number, top: number, width: number, height: number) => ({ left, top, width, height });
  if (x < t.left && y < t.top) return { op: 'removeTable', index: 0, rect: strip(t.left, t.top, t.width, t.height) };
  if (x < t.left) {
    const gaps = [...rows.map((r) => r.top), rows[rows.length - 1].bottom];
    const g = gaps.findIndex((top) => y >= top - 1 && y <= top - 1 + GAP);
    if (g >= 0) return { op: 'addRow', index: g, rect: strip(t.left, gaps[g] - 1, t.width, GAP) };
  }
  if (y < t.top) {
    const gaps = [...cols.map((c) => c.left), cols[cols.length - 1].right];
    const g = gaps.findIndex((left) => x >= left - 1 && x <= left - 1 + GAP);
    if (g >= 0) return { op: 'addColumn', index: g, rect: strip(gaps[g] - 1, t.top, GAP, t.height) };
  }
  if (x < t.left) {
    const r = rows.findIndex((row) => y >= row.top && y < row.bottom);
    if (r >= 0) return { op: 'removeRow', index: r, rect: strip(t.left, rows[r].top, t.width, rows[r].height) };
  }
  if (y < t.top) {
    const c = cols.findIndex((col) => x >= col.left && x < col.right);
    if (c >= 0) return { op: 'removeColumn', index: c, rect: strip(cols[c].left, t.top, cols[c].width, t.height) };
  }
  // Spaltengrenzen und rechter Rand: in der Höhe der Tabelle
  if (y >= t.top && y < t.bottom) {
    if (Math.abs(x - t.right) <= RESIZE_HALF) return { op: 'resizeTable', index: 0, rect: strip(t.right, t.top, 0, t.height) };
    const inner = cols.slice(0, -1).findIndex((c) => Math.abs(x - c.right) <= RESIZE_HALF);
    if (inner >= 0) return { op: 'resizeColumn', index: inner, rect: strip(cols[inner].right, t.top, 0, t.height) };
  }
  const w = wrap.getBoundingClientRect();
  if (y >= t.bottom && x >= t.left && x < t.right) return { op: 'paragraphBelow', index: 0, rect: strip(t.left, t.bottom, t.width, w.bottom - t.bottom) };
  return undefined;
}

/** TableDialog: Spalten- und Zeilenzahl erfragen (Vorgabe 3 × 2), dann am Cursor einfügen */
export function insertTableDialog(host: TableHost): void {
  const el = document.getSelection()?.focusNode?.parentElement?.closest<HTMLElement>('[data-path]');
  if (!el) return;
  const parts = splitAtCaret(el);
  if (!parts) return;
  const path = el.dataset.path!;
  const dialog = document.createElement('dialog');
  dialog.className = 'app-dialog';
  dialog.innerHTML = `
    <form method="dialog">
      <h3>Tabelle einfügen</h3>
      <label>Spalten <input name="columns" type="number" min="1" max="20" value="3" required></label>
      <label>Zeilen <input name="rows" type="number" min="1" max="100" value="2" required></label>
      <div class="app-dialog-buttons"><button value="cancel" formnovalidate>Abbrechen</button><button value="ok">OK</button></div>
    </form>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => {
    const form = dialog.querySelector('form')!;
    const columns = Number((form.elements.namedItem('columns') as HTMLInputElement).value);
    const rows = Number((form.elements.namedItem('rows') as HTMLInputElement).value);
    const ok = dialog.returnValue === 'ok';
    dialog.remove();
    if (!ok) return;
    // Text-Area.split liefert hinter dem Cursor nichts, wenn er am Ende steht
    const after = parts.after.plainText === '' && !/<(img|br)\b/i.test(parts.after.text) ? undefined : parts.after;
    host.structural((d) => insertTable(d, path, parts.before, after, columns, rows));
  });
  dialog.showModal();
}
