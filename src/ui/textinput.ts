// Tippen in den Text-Areas: jede Eingabe geht sofort ins Modell, ohne neu zu zeichnen.
// Aufeinanderfolgende Eingaben in derselben Area bilden einen Undo-Schritt (mergeKey = Pfad der Area).
import type { DiagramEditor, Focus } from '../core/editor.ts';
import { content } from '../core/factory.ts';
import { addListItem, backspaceAtStart, dissolveListItem, locateArea, nextCell, parentListItem, splitListItem, tableCellOfPath } from '../core/areas.ts';
import type { Diagram, TableEditArea, TextEditArea } from '../core/model.ts';
import { resolvePath } from '../core/paths.ts';
import { currentFocus } from './focus.ts';
import { readTextArea } from './textedit.ts';
import { caretAtStart, cutParagraph, splitAtCaret } from './textsplit.ts';

export interface TextInputHost {
  editor(): DiagramEditor | undefined;
  undo(): void;
  redo(): void;
  /** Strukturelle Operation als eigener Undo-Schritt, danach neu zeichnen und den gelieferten Fokus setzen */
  structural(op: (d: Diagram) => Focus | undefined): void;
  /** Fokus setzen ohne Änderung am Modell */
  focus(f: Focus): void;
}

export function installTextInput(stage: HTMLElement, host: TextInputHost): void {
  /** Fokus vor der laufenden Eingabe, landet beim ersten Tastendruck einer Folge im Undo-Schnappschuss */
  let before: Focus | undefined;

  stage.addEventListener('beforeinput', (e) => {
    // Rückgängig über das Kontextmenü des Browsers: unser Undo statt dem des Browsers
    if (e.inputType === 'historyUndo' || e.inputType === 'historyRedo') {
      e.preventDefault();
      if (e.inputType === 'historyUndo') host.undo();
      else host.redo();
      return;
    }
    // Durchgestrichen bleibt gesperrt, es kollidiert mit den Löschmarkierungen der Änderungsverfolgung
    if (e.inputType === 'formatStrikeThrough') {
      e.preventDefault();
      return;
    }
    before = currentFocus();
    // Strg+B/I/U des Browsers: ebenfalls eigener Undo-Schritt
    if (e.inputType.startsWith('format')) host.editor()?.endMerge();
  });

  stage.addEventListener('input', (e) => {
    const editor = host.editor();
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-path]');
    if (!editor || !el) return;
    const path = el.dataset.path!;
    const read = readTextArea(el);
    editor.apply(
      (d) => {
        // Intro/Outro ohne Inhalt gibt es nur in der Darstellung, beim ersten Tippen entstehen sie im Modell
        if (path === 'intro/areas/0') d.intro ??= content();
        if (path === 'outro/areas/0') d.outro ??= content();
        const area = resolvePath(d, path) as TextEditArea | undefined;
        if (area?.kind !== 'text') throw new Error(`Text-Area ${path} nicht gefunden`);
        area.text = read.text;
        area.plainText = read.plainText;
        area.markups = read.markups;
      },
      { mergeKey: path, focus: before },
    );
    if ((e as InputEvent).inputType.startsWith('format')) editor.endMerge();
  });

  // Enter im Listenpunkt teilt ihn, Backspace am Anfang löst auf (EnterKeyPressedHandler, BackspaceKeyPressedHandler)
  stage.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    const el = (e.target as HTMLElement).closest?.<HTMLElement>('[data-path]');
    const editor = host.editor();
    if (!el || !editor) return;
    const path = el.dataset.path!;
    if (e.key === 'Tab' && !e.shiftKey) {
      // TabKeyPressedHandler: in Tabellen zur nächsten Zelle, in der letzten eine neue Zeile
      const cell = tableCellOfPath(path);
      if (!cell) return;
      e.preventDefault();
      const table = resolvePath(editor.diagram, cell.tablePath) as TableEditArea;
      const last = cell.row === table.cells.length - 1 && cell.column === table.cells[cell.row].length - 1;
      if (last) host.structural((d) => nextCell(d, cell.tablePath, cell.row, cell.column));
      else host.focus(nextCell(editor.diagram, cell.tablePath, cell.row, cell.column));
    } else if (e.key === 'Enter' && !e.shiftKey) {
      const { containerPath } = locateArea(editor.diagram, path);
      if (!parentListItem(editor.diagram, containerPath)) return;
      const parts = splitAtCaret(el);
      if (!parts) return;
      e.preventDefault();
      host.structural((d) => splitListItem(d, path, parts.before, parts.after));
    } else if (e.key === 'Backspace' && caretAtStart(el)) {
      const probe = structuredClone(editor.diagram);
      if (backspaceAtStart(probe, path) === undefined) return;
      e.preventDefault();
      host.structural((d) => backspaceAtStart(d, path));
    }
  });

  // Area verlassen beendet den Undo-Schritt
  stage.addEventListener('focusout', () => host.editor()?.endMerge());

  // Einfügen nur als reiner Text, Formatierungen aus anderen Programmen passen nicht ins Dateiformat
  stage.addEventListener('paste', (e) => {
    if (!(e.target as HTMLElement).closest?.('[data-path]')) return;
    const text = e.clipboardData?.getData('text/plain');
    if (text === undefined) return;
    e.preventDefault();
    document.execCommand('insertText', false, text);
  });
}

/** Formatierung der Auswahl umschalten: bold, italic, underline */
export function format(editor: DiagramEditor | undefined, command: 'bold' | 'italic' | 'underline'): void {
  const sel = document.getSelection();
  const el = sel?.focusNode?.parentElement?.closest('[data-path]');
  if (!el) return;
  // eigener Undo-Schritt, getrennt vom Tippen davor und danach
  editor?.endMerge();
  document.execCommand('styleWithCSS', false, 'false');
  document.execCommand(command);
  editor?.endMerge();
}

/** TextEditArea.toggleListItemUDBL: Absatz am Cursor wird Listenpunkt, im Listenpunkt wird er aufgelöst */
export function toggleList(host: TextInputHost, ordered: boolean): void {
  const editor = host.editor();
  const el = document.getSelection()?.focusNode?.parentElement?.closest<HTMLElement>('[data-path]');
  if (!editor || !el) return;
  const path = el.dataset.path!;
  const { containerPath } = locateArea(editor.diagram, path);
  const li = parentListItem(editor.diagram, containerPath);
  if (li) {
    host.structural((d) => dissolveListItem(d, li.path));
    return;
  }
  const parts = cutParagraph(el);
  if (!parts) return;
  host.structural((d) => ({ ...addListItem(d, path, ordered, parts.leading, parts.caret, parts.trailing), offset: parts.offset }));
}
