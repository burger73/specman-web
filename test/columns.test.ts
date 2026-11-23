import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { columnResize, groesseUmrechnen, recomputePercents, type ResizeTarget } from '../src/core/columns.ts';
import type { CaseStep, CatchSequence, Diagram, IfElseStep, IfStep, TableEditArea, WhileStep } from '../src/core/model.ts';
import { indexPaths, resolvePath } from '../src/core/paths.ts';
import { readDiagram } from '../src/core/reader.ts';
import { insertStep } from '../src/core/steps.ts';
import { writeDiagram } from '../src/core/writer.ts';

const load = (f: string) => readDiagram(readFileSync(join(import.meta.dirname, 'fixtures', f), 'utf8')).diagram;
const REF = 'specman-reference-v1.4-model-v2.nsd';

function find<T>(d: Diagram, pred: (o: Record<string, unknown>) => boolean): { obj: T; path: string } {
  for (const [obj, path] of indexPaths(d)) if (!Array.isArray(obj) && pred(obj as Record<string, unknown>)) return { obj: obj as T, path };
  throw new Error('nicht gefunden');
}
const step = <T>(d: Diagram, nr: string) => find<T>(d, (o) => o.stepNumber === nr && 'kind' in o);
function resize(d: Diagram, target: ResizeTarget, widths: number[], delta: number): boolean {
  const change = columnResize(d, target, widths, delta);
  change?.(d);
  return change !== undefined;
}

describe('Spaltenbreiten ziehen (spaltenbreitenAnpassenNachMausDragging)', () => {
  it('Diagrammbreite: Verschiebung kommt dazu', () => {
    const d = load(REF);
    expect(resize(d, { kind: 'diagram' }, [], -40)).toBe(true);
    expect(d.width).toBe(800);
    expect(writeDiagram(d)).toContain('width=800\n');
  });

  it('ohne Verschiebung keine Änderung (kein Undo-Schritt)', () => {
    const d = load(REF);
    expect(columnResize(d, { kind: 'diagram' }, [], 0)).toBeUndefined();
  });

  it('If-Else: Anteil aus den Überschriftenbreiten', () => {
    const d = load(REF);
    const { obj, path } = step<IfElseStep>(d, '11');
    expect(resize(d, { kind: 'ifElse', path }, [400, 400], 100)).toBe(true);
    expect(obj.ifWidthRatio).toBe(0.625);
    expect(writeDiagram(d)).toContain('ifRatio=62.50%');
  });

  it('If und Schleife: Pixelbreite der Spalte', () => {
    const d = load(REF);
    const ifs = step<IfStep>(d, '16');
    resize(d, { kind: 'if', path: ifs.path }, [24], 30);
    expect(ifs.obj.emptyWidth).toBe(54);
    const loop = step<WhileStep>(d, '2');
    resize(d, { kind: 'loop', path: loop.path }, [21], -30);
    expect(loop.obj.barWidth).toBe(0);
  });

  it('Case: Nachbarspalte gibt ab, nicht unter 0, Anteile mit den Lücken', () => {
    const d = load(REF);
    const { obj, path } = step<CaseStep>(d, '18');
    resize(d, { kind: 'case', path, column: 0 }, [100, 100, 100], 50);
    expect(obj.columnWidthRatios.map((r) => r.toFixed(4))).toEqual([150 / 304, 50 / 304, 100 / 304].map((r) => r.toFixed(4)));
    resize(d, { kind: 'case', path, column: 1 }, [100, 100, 100], 300);
    expect(obj.columnWidthRatios[2]).toBe(0);
  });

  it('recomputePercents: zu weit gezogen wird ignoriert, Prozente abgeschnitten', () => {
    expect(recomputePercents([100, 200], -101, 0)).toBeUndefined();
    expect(recomputePercents([100, 200], 201, 0)).toBeUndefined();
    expect(recomputePercents([100, 200], 1, 0)).toEqual([33, 66]);
  });

  it('Catch-Spalten und Co-Catch-Balken', () => {
    const d = load(REF);
    const area = find<{ sequencesWidthPercent?: number[] }>(d, (o) => 'catchSequences' in o && (o.catchSequences as unknown[]).length === 3);
    resize(d, { kind: 'catchColumns', path: area.path, column: 1 }, [280, 280, 280], 140);
    expect(area.obj.sequencesWidthPercent).toEqual([33, 50, 16]);
    const seq = find<CatchSequence>(d, (o) => 'coCatches' in o && (o.coCatches as unknown[]).length > 0);
    const bar = seq.obj.headingRightBarWidth;
    expect(resize(d, { kind: 'coCatchBar', path: seq.path }, [280], -10)).toBe(true);
    expect(seq.obj.headingRightBarWidth).toBe(bar + 10);
    // höchstens bis zur halben Breite
    expect(resize(d, { kind: 'coCatchBar', path: seq.path }, [280], -200)).toBe(false);
  });

  it('Tabelle: Spalten in Prozent, Gesamtbreite höchstens 100 %', () => {
    const d = load(REF);
    const t = find<TableEditArea>(d, (o) => o.kind === 'table');
    resize(d, { kind: 'tableColumns', path: t.path, column: 0 }, [200, 200, 200], -100);
    expect(t.obj.columnsWidthPercent).toEqual([16, 50, 33]);
    resize(d, { kind: 'tableWidth', path: t.path }, [600, 600], -150);
    expect(t.obj.tableWidthPercent).toBe(75);
    resize(d, { kind: 'tableWidth', path: t.path }, [450, 600], 400);
    expect(t.obj.tableWidthPercent).toBe(100);
    expect(writeDiagram(d)).toContain('table(width=100%, cols=[16%, 50%, 33%])');
    expect(resolvePath(d, t.path)).toBe(t.obj);
  });

  it('neue Schritte: Pixelwerte beim gespeicherten Zoom (Specman.newStepPostInit)', () => {
    expect(groesseUmrechnen(18, 120, 100)).toBe(21);
    const d = load(REF);
    insertStep(d, 'while', undefined);
    insertStep(d, 'if', undefined);
    const steps = d.mainSequence.steps;
    expect((steps.at(-2) as WhileStep).barWidth).toBe(21);
    expect((steps.at(-1) as IfStep).emptyWidth).toBe(24);
  });
});
