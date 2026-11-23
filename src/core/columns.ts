// Spaltenbreiten ziehen: SpaltenResizer ruft beim Loslassen spaltenbreitenAnpassenNachMausDragging der jeweiligen
// View auf, jede wirksame Änderung ist ein Undo-Schritt (UndoableSpaltenbreiteAngepasst).
// Gemessene Breiten und delta kommen als ganze Pixel beim gespeicherten Zoom (wie die Pixelwerte im Modell), denn im
// Original ist der Zoom der Ansicht immer der des Modells.
import type { CaseStep, CatchArea, CatchSequence, Diagram, DoWhileStep, IfElseStep, IfStep, TableEditArea, WhileStep } from './model.ts';
import { resolvePath } from './paths.ts';

/** AbstractSchrittView.LINIENBREITE */
export const LINIENBREITE = 2;

export type ResizeTarget =
  /** Specman.breitenAnpasser: rechter Rand der Hauptsequenz */
  | { kind: 'diagram' }
  /** Pfad des Schritts; widths = [Breite Ja-Zweig, Breite Nein-Zweig] */
  | { kind: 'ifElse'; path: string }
  /** widths = [Breite der leeren linken Spalte] */
  | { kind: 'if'; path: string }
  /** widths = [Breite des Schleifenbalkens] */
  | { kind: 'loop'; path: string }
  /** widths = Breiten aller Zweige (Sonst zuerst); column = Zweig links der Grenze */
  | { kind: 'case'; path: string; column: number }
  /** Pfad des Catch-Bereichs; widths = Breiten der Catch-Überschriften */
  | { kind: 'catchColumns'; path: string; column: number }
  /** Pfad der Catch-Sequenz; widths = [Breite des Überschriften-Panels] */
  | { kind: 'coCatchBar'; path: string }
  /** Pfad der Tabelle; widths = Breiten der Zellen der ersten Zeile */
  | { kind: 'tableColumns'; path: string; column: number }
  /** widths = [aktuelle Tabellenbreite, verfügbare Breite] */
  | { kind: 'tableWidth'; path: string };

/** Änderung, die auf das Diagramm anzuwenden ist, oder undefined, wenn das Ziehen nichts bewirkt */
export type ColumnChange = (d: Diagram) => void;

export function columnResize(d: Diagram, target: ResizeTarget, widths: number[], delta: number): ColumnChange | undefined {
  if (delta === 0) return undefined;
  switch (target.kind) {
    case 'diagram': {
      // Specman.spaltenbreitenAnpassenNachMausDragging (ohne Grenze; nicht unter 0)
      const width = Math.max(0, d.width + delta);
      return width === d.width ? undefined : (dd) => void (dd.width = width);
    }
    case 'ifElse': {
      // IfElseSchrittView: Anteil des Ja-Zweigs aus den Überschriftenbreiten (das Layout hält beide bei mindestens 10px)
      const [ifW, elseW] = widths;
      const ratio = clamp01((ifW + delta) / (ifW + elseW));
      return at<IfElseStep>(target.path, (s) => (s.ifWidthRatio = ratio));
    }
    case 'if': {
      // IfSchrittView: Breite der linken Spalte in Pixeln
      const w = Math.max(0, widths[0] + delta);
      return at<IfStep>(target.path, (s) => (s.emptyWidth = w));
    }
    case 'loop': {
      // SchleifenSchrittView: Breite des linken Balkens in Pixeln
      const w = Math.max(0, widths[0] + delta);
      return at<WhileStep | DoWhileStep>(target.path, (s) => (s.barWidth = w));
    }
    case 'case': {
      // CaseSchrittView: die Nachbarspalte gibt ab bzw. bekommt, keine Spalte unter 0
      const ws = [...widths];
      const c = target.column;
      if (ws[c] + delta < 0) delta = -ws[c];
      else if (ws[c + 1] - delta < 0) delta = ws[c + 1];
      if (delta === 0) return undefined;
      ws[c] += delta;
      ws[c + 1] -= delta;
      // spaltenbreitenAnteileBerechnen: Summe einschließlich der Lücken zwischen den Spalten
      const sum = ws.reduce((a, b) => a + b, 0) + (ws.length - 1) * LINIENBREITE;
      const ratios = ws.map((w) => Math.fround(w / sum));
      return at<CaseStep>(target.path, (s) => (s.columnWidthRatios = ratios));
    }
    case 'catchColumns': {
      const percents = recomputePercents(widths, delta, target.column);
      return percents && at<CatchArea>(target.path, (a) => (a.sequencesWidthPercent = percents));
    }
    case 'coCatchBar': {
      // CatchSchrittSequenzView: der Balken rechts neben den Co-Catch-Überschriften, höchstens die halbe Breite
      const panel = widths[0];
      const seq = resolvePath(d, target.path) as CatchSequence | undefined;
      if (!seq) return undefined;
      const newRightBarX = panel - seq.headingRightBarWidth + delta;
      if (newRightBarX < panel / 2 || newRightBarX > panel) return undefined;
      const bar = seq.headingRightBarWidth - delta;
      return at<CatchSequence>(target.path, (s) => (s.headingRightBarWidth = bar));
    }
    case 'tableColumns': {
      // TableEditArea.updateColumnsWidthPercentage: wie in Word bleibt die Tabellenbreite gleich
      const percents = recomputePercents(widths, delta, target.column);
      return percents && at<TableEditArea>(target.path, (t) => (t.columnsWidthPercent = percents));
    }
    case 'tableWidth': {
      // TableEditArea.updateTableWidthPercentage: über das Maximum hinaus heißt zurück auf 100 %
      const [current, maximum] = widths;
      if (current + delta < 0) return undefined;
      if (current + delta > maximum) delta = maximum - current;
      if (delta === 0) return undefined;
      const percent = Math.trunc(((current + delta) / maximum) * 100);
      return at<TableEditArea>(target.path, (t) => (t.tableWidthPercent = percent));
    }
  }
}

/** ColumnSpecByPercent.recomputePercents: zu weit gezogen wird ignoriert, Prozente abgeschnitten */
export function recomputePercents(absoluteWidths: number[], delta: number, column: number): number[] | undefined {
  const ws = [...absoluteWidths];
  if (ws[column] + delta < 0) return undefined;
  if (delta > ws[column + 1]) return undefined;
  ws[column] += delta;
  ws[column + 1] -= delta;
  const sum = ws.reduce((a, b) => a + b, 0);
  return ws.map((w) => Math.trunc(Math.fround(Math.fround(w / sum) * 100)));
}

/** AbstractSchrittView.groesseUmrechnen */
export function groesseUmrechnen(groesse: number, prozentNeu: number, prozentAktuell: number): number {
  const groesse100Prozent = Math.fround(groesse / prozentAktuell) * 100;
  return Math.trunc((groesse100Prozent * prozentNeu) / 100);
}

function at<T>(path: string, set: (obj: T) => void): ColumnChange {
  return (d) => {
    const obj = resolvePath(d, path) as T | undefined;
    if (!obj) throw new Error(`Kein Element unter ${path}`);
    set(obj);
  };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
