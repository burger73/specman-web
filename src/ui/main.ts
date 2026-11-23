import { DiagramEditor, forEachStep, type Focus } from '../core/editor.ts';
import type { Envelope } from '../core/model.ts';
import { readDiagram } from '../core/reader.ts';
import { currentFocus, restoreFocus } from './focus.ts';
import { renderDiagram } from './render.ts';
import './style.css';

// Beispiele: die Testdateien aus dem Original-Repo
const samples = import.meta.glob('../../test/fixtures/*.nsd', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const app = document.getElementById('app')!;
const bar = document.createElement('header');
bar.className = 'app-bar';
const select = document.createElement('select');
for (const path of Object.keys(samples).sort()) {
  const o = document.createElement('option');
  o.value = path;
  o.textContent = path.split('/').pop()!;
  select.append(o);
}
const zoom = document.createElement('select');
for (const z of ['Datei', '80', '100', '120', '150']) {
  const o = document.createElement('option');
  o.value = z;
  o.textContent = z === 'Datei' ? 'Zoom wie Datei' : `${z} %`;
  zoom.append(o);
}
const open = document.createElement('label');
open.className = 'app-open';
open.textContent = 'Datei öffnen …';
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.nsd';
fileInput.hidden = true;
open.append(fileInput);
const undoBtn = button('↶', 'Rückgängig (Strg+Z)', () => undo());
const redoBtn = button('↷', 'Wiederholen (Strg+Y)', () => redo());
const status = document.createElement('span');
status.className = 'app-status';
bar.append(open, select, zoom, undoBtn, redoBtn, status);
const stage = document.createElement('main');
stage.className = 'app-stage';
app.append(bar, stage);

function button(label: string, title: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'app-btn';
  b.textContent = label;
  b.title = title;
  b.addEventListener('mousedown', (e) => e.preventDefault()); // Fokus bleibt im Text
  b.addEventListener('click', onClick);
  return b;
}

/** Das geöffnete Dokument; das Modell im Editor ist die Wahrheit, die Darstellung wird daraus neu erzeugt */
let doc: { name: string; envelope: Envelope; editor: DiagramEditor } | undefined;

function show(name: string, text: string): void {
  try {
    const { diagram, envelope } = readDiagram(text);
    const editor = new DiagramEditor(diagram);
    editor.onChange(updateBar);
    doc = { name, envelope, editor };
    redraw();
    updateBar();
  } catch (e) {
    doc = undefined;
    stage.replaceChildren();
    status.textContent = `${name}: ${(e as Error).message}`;
    updateBar();
  }
}

/** Neu zeichnen und danach den Fokus wiederherstellen (Standard: der aktuelle) */
function redraw(focus: Focus | undefined = currentFocus()): void {
  if (!doc) return;
  const d = doc.editor.diagram;
  const editor = doc.editor;
  const sheet = renderDiagram(d, {
    onToggle: (id) => {
      editor.mutateSilently((dd) => {
        forEachStep(dd.mainSequence, (s) => {
          if (s.id === id && 'collapsed' in s) s.collapsed = !s.collapsed;
        });
      });
      redraw();
    },
  });
  sheet.style.zoom = String((zoom.value === 'Datei' ? d.zoomFactor : Number(zoom.value)) / 100);
  stage.replaceChildren(sheet);
  if (focus) restoreFocus(stage, focus);
}

function updateBar(): void {
  const e = doc?.editor;
  undoBtn.disabled = !e?.canUndo;
  redoBtn.disabled = !e?.canRedo;
  if (!doc || !e) return;
  status.textContent = `${e.dirty ? '● ' : ''}${doc.name} – Specman ${doc.envelope.specmanVersion}, gespeicherter Zoom ${e.diagram.zoomFactor} %`;
  document.title = `${e.dirty ? '● ' : ''}${doc.name} – Specman Web`;
}

function undo(): void {
  const focus = doc?.editor.undo(currentFocus());
  if (focus !== null) redraw(focus);
}

function redo(): void {
  const focus = doc?.editor.redo(currentFocus());
  if (focus !== null) redraw(focus);
}

document.addEventListener('keydown', (e) => {
  if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === 'z' && !e.shiftKey) undo();
  else if (k === 'y' || (k === 'z' && e.shiftKey)) redo();
  else return;
  e.preventDefault();
});

function showSelected(): void {
  show(select.selectedOptions[0].textContent!, samples[select.value]);
}

const params = new URLSearchParams(location.search);
const wanted = params.get('sample');
if (wanted) {
  const match = Object.keys(samples).find((p) => p.endsWith('/' + wanted));
  if (match) select.value = match;
}
if (params.get('zoom')) zoom.value = params.get('zoom')!;
// Eigene Dateien werden nur im Browser gelesen, nichts verlässt den Rechner
async function openFile(file: File): Promise<void> {
  show(file.name, await file.text());
  select.selectedIndex = -1;
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (file) void openFile(file);
  fileInput.value = '';
});
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  document.body.classList.add('app-drop');
});
document.addEventListener('dragleave', (e) => {
  if (e.relatedTarget === null) document.body.classList.remove('app-drop');
});
document.addEventListener('drop', (e) => {
  e.preventDefault();
  document.body.classList.remove('app-drop');
  const file = e.dataTransfer?.files[0];
  if (file) void openFile(file);
});
select.addEventListener('change', showSelected);
zoom.addEventListener('change', () => redraw());
showSelected();
