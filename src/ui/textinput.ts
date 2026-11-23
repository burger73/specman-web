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
import { trackingSet } from '../core/recording.ts';
import { catchHeadingOfPath, syncCatchHeading } from '../core/catches.ts';
import { stepOfPath } from '../core/steps.ts';
import { deleteTracked, insertText, markComposed, markNewLineBreak, markNewParagraph } from './textrecord.ts';

export interface TextInputHost {
  editor(): DiagramEditor | undefined;
  undo(): void;
  redo(): void;
  /** Strukturelle Operation als eigener Undo-Schritt, danach neu zeichnen und den gelieferten Fokus setzen */
  structural(op: (d: Diagram) => Focus | undefined): void;
  /** Fokus setzen ohne Änderung am Modell */
  focus(f: Focus): void;
  /** neu zeichnen, Fokus bleibt (nach dem Abgleich von Break-Schritt und Catch-Überschrift) */
  redraw?(): void;
}

export function installTextInput(stage: HTMLElement, host: TextInputHost): void {
  /** Fokus vor der laufenden Eingabe, landet beim ersten Tastendruck einer Folge im Undo-Schnappschuss */
  let before: Focus | undefined;

  /** Bearbeitete Area ins Modell zurücklesen; aufeinanderfolgende Eingaben bilden einen Undo-Schritt */
  const commit = (el: HTMLElement, isFormat: boolean): void => {
    const editor = host.editor();
    if (!editor) return;
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
    if (isFormat) editor.endMerge();
  };

  const trackingCs = () => {
    const d = host.editor()?.diagram;
    return d ? trackingSet(d) : undefined;
  };

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
    const el = (e.target as HTMLElement).closest?.<HTMLElement>('[data-path]');
    if (el && handleInput(e, el, trackingCs())) {
      e.preventDefault();
      commit(el, false);
    }
  });

  stage.addEventListener('input', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-path]');
    if (!host.editor() || !el) return;
    const type = (e as InputEvent).inputType;
    // neue Absatzgrenze (Enter, Umschalt+Enter) als hinzugefügt markieren (insertParagraphBoundaryAt)
    const cs = trackingCs();
    if (cs && type === 'insertParagraph') markNewParagraph(el, cs);
    if (cs && type === 'insertLineBreak') markNewLineBreak(el, cs);
    commit(el, type.startsWith('format'));
  });

  // Komposition (Tottasten, IME) lässt sich nicht abfangen: den fertigen Text danach als hinzugefügt markieren
  stage.addEventListener('compositionend', (e) => {
    const el = (e.target as HTMLElement).closest?.<HTMLElement>('[data-path]');
    const cs = trackingCs();
    if (!el || !cs || !e.data) return;
    if (markComposed(el, e.data, cs)) commit(el, false);
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

  // Area verlassen: Break-Schritt und Catch-Überschrift abgleichen (focusLost), dann endet der Undo-Schritt
  stage.addEventListener('focusout', (e) => {
    const editor = host.editor();
    const el = (e.target as HTMLElement).closest?.<HTMLElement>('[data-path]');
    if (editor && el) {
      const path = el.dataset.path!;
      const d = editor.diagram;
      if ((stepOfPath(d, path)?.kind === 'break' || catchHeadingOfPath(d, path)) && syncCatchHeading(structuredClone(d), path)) {
        // gehört zum Undo-Schritt des Tippens davor
        editor.apply((dd) => void syncCatchHeading(dd, path), { mergeKey: path });
        setTimeout(() => host.redraw?.());
      }
    }
    editor?.endMerge();
  });

  // Einfügen nur als reiner Text, Formatierungen aus anderen Programmen passen nicht ins Dateiformat
  stage.addEventListener('paste', (e) => {
    const el = (e.target as HTMLElement).closest?.<HTMLElement>('[data-path]');
    if (!el) return;
    const text = e.clipboardData?.getData('text/plain');
    if (text === undefined) return;
    e.preventDefault();
    // execCommand löst kein beforeinput aus, daher hier selbst (PasteKeyPressedHandler)
    const range = currentRange();
    before = currentFocus();
    if (range && insertInput(el, range, text, trackingCs())) commit(el, false);
    else document.execCommand('insertText', false, text);
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

/** Zielbereich einer Eingabe: getTargetRanges des Browsers, sonst die Auswahl */
function targetRange(e: InputEvent): Range | undefined {
  const t = e.getTargetRanges?.()[0];
  if (t) {
    const r = document.createRange();
    r.setStart(t.startContainer, t.startOffset);
    r.setEnd(t.endContainer, t.endOffset);
    return r;
  }
  const sel = document.getSelection();
  return sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : undefined;
}

function currentRange(): Range | undefined {
  const sel = document.getSelection();
  return sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : undefined;
}

/**
 * Text einfügen (Tippen, Einfügen, Ablegen). Mit Verfolgung: eine Auswahl wird gestrichen
 * (markSelectedTextAsDeletedInModificationMode) und der Text landet dahinter im Change Set. Ohne Verfolgung nur in
 * Markups selbst ausgeführt.
 * @returns true, wenn erledigt; false: Standardverhalten des Browsers
 */
export function insertInput(el: HTMLElement, range: Range, text: string, cs: string | undefined): boolean {
  if (cs) {
    let at: Range | undefined = range;
    if (!range.collapsed) {
      deleteTracked(el, range, cs, true);
      at = currentRange();
      if (!at) return true;
    }
    insertText(el, at, text, cs);
    return true;
  }
  if (!inMarkup(range.startContainer, el) && !inMarkup(range.endContainer, el)) return false;
  if (!range.collapsed) {
    range.deleteContents();
    range.collapse(true);
  }
  insertText(el, range, text, undefined);
  return true;
}

/** Hat die Stelle einen Markup-Span oder eine Streichung als Vorfahren (innerhalb der Area)? */
function inMarkup(node: Node, root: HTMLElement): boolean {
  const e = node instanceof HTMLElement ? node : node.parentElement;
  const m = e?.closest('.sm-markup, strike, s, del');
  return m != null && root.contains(m) && m !== root;
}

/**
 * Eingaben, die wir selbst ausführen (TextEditAreaKeyListener, Remove-Handler). Mit Verfolgung: Einfügen landet im
 * Change Set, Löschen streicht. Ohne Verfolgung nur Einfügen in Markups (Schrittverweis, Änderungen, Streichungen),
 * das wie im Original mit Standardstil außerhalb davon landet.
 * @returns true, wenn die Eingabe erledigt ist (dann ohne Standardverhalten)
 */
function handleInput(e: InputEvent, el: HTMLElement, cs: string | undefined): boolean {
  const type = e.inputType;
  if (type === 'insertText' || type === 'insertReplacementText' || type === 'insertFromPaste' || type === 'insertFromDrop' || type === 'insertFromYank') {
    const text = e.data ?? e.dataTransfer?.getData('text/plain') ?? '';
    const range = targetRange(e);
    return range ? insertInput(el, range, text, cs) : false;
  }
  if (!cs) return false;
  if (type.startsWith('delete')) {
    let range = targetRange(e);
    if (!range) return true;
    if (range.collapsed) {
      // ohne Zielbereich des Browsers: ein Zeichen (bzw. Wort, Zeile) erweitern
      const sel = document.getSelection()!;
      const forward = type.includes('Forward');
      const unit = type.includes('Word') ? 'word' : type.includes('Line') ? 'lineboundary' : 'character';
      sel.modify('extend', forward ? 'forward' : 'backward', unit);
      range = currentRange();
      if (!range || range.collapsed || !el.contains(range.commonAncestorContainer)) return true;
    }
    deleteTracked(el, range, cs, type.includes('Forward'));
    return true;
  }
  if ((type === 'insertParagraph' || type === 'insertLineBreak') && !(targetRange(e)?.collapsed ?? true)) {
    // Auswahl erst streichen, dann den Absatz am Ende der Auswahl einfügen (execCommand löst kein beforeinput aus)
    deleteTracked(el, targetRange(e)!, cs, true);
    document.execCommand(type);
    if (type === 'insertParagraph') markNewParagraph(el, cs);
    else markNewLineBreak(el, cs);
    return true;
  }
  return false;
}
