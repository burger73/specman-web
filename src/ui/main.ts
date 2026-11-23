import { DiagramEditor, forEachStep, type Focus } from '../core/editor.ts';
import { newDiagram } from '../core/factory.ts';
import { readDiagram } from '../core/reader.ts';
import { writeDiagram } from '../core/writer.ts';
import { droppedFile, pickFile, saveFile, type OpenedFile } from './files.ts';
import { currentFocus, restoreFocus } from './focus.ts';
import { createPalette, deleteFocusedStep, toggleBorderOfFocusedStep, toneFocusedStep, type PaletteHost } from './palette.ts';
import { setAllCollapsed } from '../core/steps.ts';
import { renderDiagram } from './render.ts';
import { createChangesGroup } from './changes.ts';
import { insertTableDialog, installTableEditing } from './tableedit.ts';
import { insertImageDialog, installImageEditing } from './imageedit.ts';
import { format, installTextInput, toggleList, type TextInputHost } from './textinput.ts';
import './style.css';

// Beispiele: die Testdateien aus dem Original-Repo
const samples = import.meta.glob('../../test/fixtures/*.nsd', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const app = document.getElementById('app')!;
const bar = document.createElement('header');
bar.className = 'app-bar';

function button(icon: string, title: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'app-btn';
  b.title = title;
  const img = document.createElement('img');
  img.src = `/icons/${icon}.svg`;
  img.alt = title;
  b.append(img);
  b.addEventListener('mousedown', (e) => e.preventDefault()); // Fokus bleibt im Text
  b.addEventListener('click', onClick);
  return b;
}

function group(...items: HTMLElement[]): HTMLElement {
  const g = document.createElement('div');
  g.className = 'app-group';
  g.append(...items);
  return g;
}

const newBtn = button('material/note_add', 'Neues Diagramm', () => newDocument());
const openBtn = button('material/folder_open', 'Öffnen … (Strg+O)', () => void openDialog());
const saveBtn = button('material/save', 'Speichern (Strg+S)', () => void save(false));
const saveAsBtn = button('material/save_as', 'Speichern unter … (Strg+Umschalt+S)', () => void save(true));
const undoBtn = button('material/undo', 'Rückgängig (Strg+Z)', () => undo());
const redoBtn = button('material/redo', 'Wiederholen (Strg+Y)', () => redo());
const boldBtn = button('material/format_bold', 'Fett (Strg+B)', () => format(doc?.editor, 'bold'));
const italicBtn = button('material/format_italic', 'Kursiv (Strg+I)', () => format(doc?.editor, 'italic'));
const underlineBtn = button('material/format_underlined', 'Unterstrichen (Strg+U)', () => format(doc?.editor, 'underline'));
const tableBtn = button('material/table', 'Tabelle einfügen', () => insertTableDialog(textHost));
const imageBtn = button('material/image', 'Bild einfügen', () => insertImageDialog(textHost));
const toneBtn = button('material/contrast', 'Hintergrund schattieren', () => toneFocusedStep(textHost));
const deleteBtn = button('material/delete', 'Schritt löschen', () => deleteFocusedStep(textHost));
const borderBtn = button('material/rounded_corner', 'Rahmen umschalten', () => toggleBorderOfFocusedStep(textHost));
const collapseAllBtn = button('material/unfold_less', 'Alle Schritte einklappen', () => collapseAll(true));
const expandAllBtn = button('material/unfold_more', 'Alle Schritte ausklappen', () => collapseAll(false));
const ulBtn = button('material/format_list_bulleted', 'Aufzählung', () => toggleList(textHost, false));
const olBtn = button('material/format_list_numbered', 'Nummerierte Liste', () => toggleList(textHost, true));

const changes = createChangesGroup({ editor: () => doc?.editor, button, structural: (op) => textHost.structural(op), redraw: () => redraw() });

const select = document.createElement('select');
select.title = 'Beispiele aus dem Original-Repo';
const placeholder = document.createElement('option');
placeholder.textContent = 'Beispiel öffnen …';
placeholder.value = '';
placeholder.disabled = true;
select.append(placeholder);
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
const status = document.createElement('span');
status.className = 'app-status';
bar.append(group(newBtn, openBtn, saveBtn, saveAsBtn), group(undoBtn, redoBtn), group(boldBtn, italicBtn, underlineBtn, ulBtn, olBtn), group(tableBtn, imageBtn), group(toneBtn, deleteBtn, borderBtn), group(collapseAllBtn, expandAllBtn), changes.element, select, zoom, status);
const stage = document.createElement('main');
stage.className = 'app-stage';
const body = document.createElement('div');
body.className = 'app-body';
app.append(bar, body);

/** Das geöffnete Dokument; das Modell im Editor ist die Wahrheit, die Darstellung wird daraus neu erzeugt */
interface Doc {
  name: string;
  /** Version aus dem Kopf der gelesenen Datei, nur zur Anzeige; gespeichert wird als aktuelle Version */
  version?: string;
  editor: DiagramEditor;
  handle?: FileSystemFileHandle;
}
let doc: Doc | undefined;

function setDoc(d: Doc): void {
  doc = d;
  d.editor.onChange(updateBar);
  redraw(undefined);
  updateBar();
}

function load(file: OpenedFile): void {
  try {
    const { diagram, envelope } = readDiagram(file.text);
    setDoc({ name: file.name, version: envelope.specmanVersion, editor: new DiagramEditor(diagram), handle: file.handle });
  } catch (e) {
    alert(`${file.name} lässt sich nicht lesen:\n${(e as Error).message}`);
  }
}

/** NewDiagrammSpecmanOp / confirmDiscardUnsavedChanges */
function confirmDiscard(): boolean {
  return !doc?.editor.dirty || confirm(`${doc.name} enthält ungespeicherte Änderungen. Verwerfen?`);
}

function newDocument(): void {
  if (!confirmDiscard()) return;
  select.value = '';
  setDoc({ name: 'Unbekannt', editor: new DiagramEditor(newDiagram()) });
}

async function openDialog(): Promise<void> {
  if (!confirmDiscard()) return;
  const file = await pickFile();
  if (file) {
    select.value = '';
    load(file);
  }
}

async function save(saveAs: boolean): Promise<void> {
  if (!doc) return;
  const d = doc;
  if (d.editor.diagram.mainSequence.steps.length === 0) {
    // das Dateiformat verlangt mindestens einen Schritt in der Hauptsequenz
    alert('Ein leeres Diagramm kann nicht gespeichert werden. Bitte zuerst einen Schritt anlegen.');
    return;
  }
  try {
    const text = writeDiagram(d.editor.diagram);
    const saved = await saveFile(text, d.name === 'Unbekannt' ? 'diagramm.nsd' : d.name, d.handle, saveAs);
    if (!saved) return;
    d.name = saved.name;
    d.handle = saved.handle;
    d.version = undefined;
    d.editor.markSaved();
  } catch (e) {
    alert(`Speichern fehlgeschlagen:\n${(e as Error).message}`);
  }
}

/** Neu zeichnen und danach den Fokus wiederherstellen (Standard: der aktuelle) */
function redraw(focus: Focus | undefined = currentFocus()): void {
  if (!doc) return;
  const editor = doc.editor;
  const d = editor.diagram;
  const sheet = renderDiagram(d, {
    editable: true,
    onToggle: (id) => {
      editor.mutateSilently((dd) =>
        forEachStep(dd.mainSequence, (s) => {
          if (s.id === id && 'collapsed' in s) s.collapsed = !s.collapsed;
        }),
      );
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
  saveBtn.disabled = saveAsBtn.disabled = !doc;
  changes.update();
  if (!doc || !e) return;
  const mark = e.dirty ? '● ' : '';
  const version = doc.version ? ` – Specman ${doc.version}` : '';
  status.textContent = `${mark}${doc.name}${version}, gespeicherter Zoom ${e.diagram.zoomFactor} %`;
  document.title = `${mark}${doc.name} – Specman Web`;
}

/** Specman.alleSchritteKlappen: wie das Klappen einzelner Schritte kein Undo-Schritt */
function collapseAll(collapsed: boolean): void {
  doc?.editor.mutateSilently((d) => setAllCollapsed(d, collapsed));
  redraw();
}

/** Undo/Redo liefern null, wenn es nichts zu tun gab, sonst den Fokus vor der Operation (oder undefined) */
function afterUndoRedo(focus: Focus | undefined | null): void {
  if (focus === null) return;
  redraw(focus ?? currentFocus());
}

const undo = () => doc && afterUndoRedo(doc.editor.undo(currentFocus()));
const redo = () => doc && afterUndoRedo(doc.editor.redo(currentFocus()));
const textHost: TextInputHost & PaletteHost = {
  editor: () => doc?.editor,
  diagram: () => doc?.editor.diagram,
  undo,
  redo,
  focus: (f) => restoreFocus(stage, f),
  structural(op) {
    const editor = doc?.editor;
    if (!editor) return;
    try {
      const focus = editor.apply(op, { focus: currentFocus() });
      redraw(focus);
    } catch (e) {
      alert((e as Error).message);
    }
  },
};
installTextInput(stage, textHost);
installTableEditing(stage, textHost);
installImageEditing(stage, textHost);
body.append(createPalette(textHost), stage);

document.addEventListener('keydown', (e) => {
  if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === 'z' && !e.shiftKey) undo();
  else if (k === 'y' || (k === 'z' && e.shiftKey)) redo();
  else if (k === 's') void save(e.shiftKey);
  else if (k === 'o') void openDialog();
  else return;
  e.preventDefault();
});

window.addEventListener('beforeunload', (e) => {
  if (doc?.editor.dirty) e.preventDefault();
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
  if (!e.dataTransfer) return;
  const pending = droppedFile(e.dataTransfer);
  if (!confirmDiscard()) return;
  void pending.then((file) => {
    if (file) {
      select.value = '';
      load(file);
    }
  });
});

select.addEventListener('change', () => {
  const path = select.value;
  if (!confirmDiscard()) {
    select.value = '';
    return;
  }
  load({ name: path.split('/').pop()!, text: samples[path] });
});
zoom.addEventListener('change', () => redraw());

// Start: ?new für ein leeres Diagramm, ?sample=… für ein Beispiel, sonst das erste Beispiel
const params = new URLSearchParams(location.search);
if (params.get('zoom')) zoom.value = params.get('zoom')!;
const paths = Object.keys(samples).sort();
const wanted = params.get('sample');
const start = wanted ? paths.find((p) => p.endsWith('/' + wanted)) : paths[0];
if (params.has('new') || !start) newDocument();
else {
  select.value = start;
  load({ name: start.split('/').pop()!, text: samples[start] });
}
