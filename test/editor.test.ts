import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DiagramEditor, EditException } from '../src/core/editor.ts';
import type { TextEditArea } from '../src/core/model.ts';
import { indexPaths, resolvePath } from '../src/core/paths.ts';
import { readDiagram } from '../src/core/reader.ts';
import { writeDiagram } from '../src/core/writer.ts';

const load = () => readDiagram(readFileSync(join(import.meta.dirname, 'fixtures', 'gutenmorgen.nsd'), 'utf8')).diagram;
const head = (e: DiagramEditor) => e.diagram.mainSequence.steps[0].content.areas[0] as TextEditArea;

describe('DiagramEditor', () => {
  it('Undo und Redo stellen die Zustände wieder her, Dirty folgt dem gespeicherten Stand', () => {
    const e = new DiagramEditor(load());
    const original = writeDiagram(e.diagram);
    expect(e.dirty).toBe(false);
    e.apply((d) => (d.name = 'eins'));
    e.apply((d) => (d.name = 'zwei'));
    expect(e.dirty).toBe(true);
    e.undo();
    expect(e.diagram.name).toBe('eins');
    e.undo();
    expect(writeDiagram(e.diagram)).toBe(original);
    expect(e.dirty).toBe(false);
    expect(e.undo()).toBeNull();
    e.redo();
    e.redo();
    expect(e.diagram.name).toBe('zwei');
    expect(e.canRedo).toBe(false);
  });

  it('Speichern verschiebt den sauberen Zustand, eine neue Operation verwirft Redo', () => {
    const e = new DiagramEditor(load());
    e.apply((d) => (d.name = 'a'));
    e.markSaved();
    expect(e.dirty).toBe(false);
    e.undo();
    expect(e.dirty).toBe(true);
    e.redo();
    expect(e.dirty).toBe(false);
    e.undo();
    e.apply((d) => (d.name = 'b'));
    expect(e.canRedo).toBe(false);
    expect(e.dirty).toBe(true);
  });

  it('Tippen mit gleichem mergeKey ergibt einen Undo-Schritt', () => {
    const e = new DiagramEditor(load());
    const before = head(e).plainText;
    for (const t of ['H', 'Ha', 'Hal']) e.apply(() => (head(e).plainText = t), { mergeKey: 'a', focus: { path: 'x', offset: 1 } });
    e.apply(() => (head(e).plainText = 'anderswo'), { mergeKey: 'b' });
    expect(e.undo()).toBeUndefined();
    expect(head(e).plainText).toBe('Hal');
    expect(e.undo()).toEqual({ path: 'x', offset: 1 });
    expect(head(e).plainText).toBe(before);
  });

  it('endMerge beginnt einen neuen Undo-Schritt', () => {
    const e = new DiagramEditor(load());
    e.apply((d) => (d.name = '1'), { mergeKey: 'a' });
    e.endMerge();
    e.apply((d) => (d.name = '2'), { mergeKey: 'a' });
    e.undo();
    expect(e.diagram.name).toBe('1');
  });

  it('eine werfende Operation lässt das Diagramm unverändert', () => {
    const e = new DiagramEditor(load());
    const original = writeDiagram(e.diagram);
    expect(() =>
      e.apply((d) => {
        d.mainSequence.steps = [];
        throw new EditException('geht nicht');
      }),
    ).toThrow('geht nicht');
    expect(writeDiagram(e.diagram)).toBe(original);
    expect(e.canUndo).toBe(false);
    expect(e.dirty).toBe(false);
  });

  it('Auf- und Zuklappen bleibt bei Undo erhalten und macht nicht dirty', () => {
    const e = new DiagramEditor(load());
    const structured = () => e.diagram.mainSequence.steps.find((s) => 'collapsed' in s) as { collapsed: boolean } | undefined;
    expect(structured()).toBeDefined();
    e.apply((d) => (d.name = 'x'));
    e.mutateSilently(() => (structured()!.collapsed = true));
    e.undo();
    expect(structured()!.collapsed).toBe(true);
    expect(e.dirty).toBe(false);
  });
});

describe('Pfade', () => {
  it('finden Areas über einen Schnappschuss hinweg wieder', () => {
    const d = load();
    const area = d.mainSequence.steps[1].content.areas[0];
    const path = indexPaths(d).get(area)!;
    expect(path).toBe('mainSequence/steps/1/content/areas/0');
    expect(resolvePath(structuredClone(d), path)).toEqual(area);
    expect(resolvePath(d, 'mainSequence/steps/99/content')).toBeUndefined();
  });
});
