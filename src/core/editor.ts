// Edit-Kern: Diagramm, Undo/Redo über Schnappschüsse, Dirty-Flag. Ohne DOM.
// Statt der rund 40 Undoable*-Klassen des Originals wird vor jeder Operation das ganze Diagramm kopiert
// (siehe PLAN-phase1.md). Tippen in einer Area wird über einen gemeinsamen mergeKey zu einem Undo-Schritt.
import type { Diagram, Step, StepSequence } from './model.ts';
import { childSequences } from './model.ts';

/** Position im Diagramm, an die nach Neuzeichnen, Undo oder Redo der Fokus zurückkehrt */
export interface Focus {
  /** Pfad zur TextEditArea, siehe paths.ts */
  path: string;
  /** Zeichenposition im Text der Area */
  offset?: number;
}

export interface ApplyOptions {
  /** Fokus vor der Operation, wird beim Undo wiederhergestellt */
  focus?: Focus;
  /** gleicher Schlüssel wie bei der vorigen Operation: kein neuer Undo-Schritt (Tippen in derselben Area) */
  mergeKey?: string;
}

interface Snapshot {
  diagram: Diagram;
  state: number;
  focus?: Focus;
}

/** Fehler bei unzulässigen Operationen, Port von specman.EditException; message ist der Text für den Benutzer */
export class EditException extends Error {}

const MAX_UNDO = 300;

export class DiagramEditor {
  private undoStack: Snapshot[] = [];
  private redoStack: Snapshot[] = [];
  private mergeKey: string | undefined;
  /** Jeder Diagrammzustand bekommt eine Nummer, gespeichert ist savedState */
  private state = 0;
  private nextState = 1;
  private savedState = 0;
  private listeners: (() => void)[] = [];

  diagram: Diagram;

  constructor(diagram: Diagram) {
    this.diagram = diagram;
  }

  get dirty(): boolean {
    return this.state !== this.savedState;
  }
  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }
  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /** Benachrichtigung nach jeder Änderung (auch Undo, Redo, Speichern) */
  onChange(fn: () => void): void {
    this.listeners.push(fn);
  }

  /**
   * Operation auf dem Diagramm ausführen. Wirft sie, bleibt das Diagramm unverändert und der Fehler geht weiter.
   * Das Ergebnis der Operation wird durchgereicht (z. B. der Fokus nach dem Einfügen eines Schritts).
   */
  apply<T>(op: (d: Diagram) => T, opts: ApplyOptions = {}): T {
    const merge = opts.mergeKey !== undefined && opts.mergeKey === this.mergeKey;
    const before = structuredClone(this.diagram);
    let result: T;
    try {
      result = op(this.diagram);
    } catch (e) {
      this.diagram = before;
      throw e;
    }
    if (!merge) {
      this.undoStack.push({ diagram: before, state: this.state, focus: opts.focus });
      if (this.undoStack.length > MAX_UNDO) this.undoStack.shift();
    }
    this.redoStack = [];
    this.mergeKey = opts.mergeKey;
    this.state = this.nextState++;
    this.notify();
    return result;
  }

  /** Nächste Operation beginnt auf jeden Fall einen neuen Undo-Schritt (z. B. Area verlassen) */
  endMerge(): void {
    this.mergeKey = undefined;
  }

  /** @returns Fokus, der vor der rückgängig gemachten Operation galt, oder null wenn nichts rückgängig zu machen war */
  undo(currentFocus?: Focus): Focus | undefined | null {
    return this.swap(this.undoStack, this.redoStack, currentFocus);
  }

  redo(currentFocus?: Focus): Focus | undefined | null {
    return this.swap(this.redoStack, this.undoStack, currentFocus);
  }

  private swap(from: Snapshot[], to: Snapshot[], currentFocus?: Focus): Focus | undefined | null {
    const snap = from.pop();
    if (!snap) return null;
    to.push({ diagram: this.diagram, state: this.state, focus: currentFocus });
    // Auf- und Zuklappen ist im Original keine rückgängig machbare Aktion, der aktuelle Zustand bleibt erhalten
    keepCollapsed(this.diagram, snap.diagram);
    this.diagram = snap.diagram;
    this.state = snap.state;
    this.mergeKey = undefined;
    this.notify();
    return snap.focus;
  }

  /** Aktueller Zustand ist gespeichert */
  markSaved(): void {
    this.savedState = this.state;
    this.notify();
  }

  /** Änderung ohne Undo-Schritt und ohne Dirty-Flag (Auf- und Zuklappen, wie im Original) */
  mutateSilently(op: (d: Diagram) => void): void {
    op(this.diagram);
    this.notify();
  }

  private notify(): void {
    for (const fn of this.listeners) fn();
  }
}

function keepCollapsed(from: Diagram, to: Diagram): void {
  const collapsed = new Map<string, boolean>();
  forEachStep(from.mainSequence, (s) => {
    if ('collapsed' in s) collapsed.set(s.id, s.collapsed);
  });
  forEachStep(to.mainSequence, (s) => {
    const c = collapsed.get(s.id);
    if (c !== undefined && 'collapsed' in s) s.collapsed = c;
  });
}

/** Alle Schritte einschließlich der Catch-Sequenzen */
export function forEachStep(seq: StepSequence, fn: (s: Step) => void): void {
  for (const s of seq.steps) {
    fn(s);
    for (const sub of childSequences(s)) forEachStep(sub, fn);
  }
  for (const c of seq.catchArea?.catchSequences ?? []) forEachStep(c, fn);
}
