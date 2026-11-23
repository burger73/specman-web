import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { childSequences, type CatchSequence, type Diagram, type Step, type StepSequence } from '../src/core/model.ts';
import { ModelParseException, readDiagram } from '../src/core/reader.ts';

const dir = join(import.meta.dirname, 'fixtures');
const files = readdirSync(dir).filter((f) => f.endsWith('.nsd'));
const load = (f: string) => readDiagram(readFileSync(join(dir, f), 'utf8'));

/** alle Schritte inkl. der Schritte in Catch-Sequenzen */
function allSteps(seq: StepSequence, out: Step[] = []): Step[] {
  for (const s of seq.steps) {
    out.push(s);
    for (const c of childSequences(s)) allSteps(c, out);
  }
  for (const c of seq.catchArea?.catchSequences ?? []) allSteps(c, out);
  return out;
}

function allCatches(seq: StepSequence, out: CatchSequence[] = []): CatchSequence[] {
  out.push(...(seq.catchArea?.catchSequences ?? []));
  for (const s of seq.steps) for (const c of childSequences(s)) allCatches(c, out);
  for (const c of seq.catchArea?.catchSequences ?? []) allCatches(c, out);
  return out;
}

describe('Reader', () => {
  it.each(files)('%s lässt sich lesen', (f) => {
    const { diagram, envelope } = load(f);
    expect(envelope.modelType).toBe('specman.model.v002.DiagramModel_V002');
    expect(diagram.mainSequence.steps.length).toBeGreaterThan(0);
  });

  describe('Referenzdatei 1.4', () => {
    const { diagram, envelope }: { diagram: Diagram; envelope: { specmanVersion: string } } =
      load('specman-reference-v1.4-model-v2.nsd');
    const steps = allSteps(diagram.mainSequence);
    const count = (k: Step['kind']) => steps.filter((s) => s.kind === k).length;

    it('Envelope und Settings', () => {
      expect(envelope.specmanVersion).toBe('1.4.0');
      expect(diagram.name).toBe('frame0');
      expect(diagram.width).toBeGreaterThan(0);
      expect(diagram.intro).toBeDefined();
      expect(diagram.outro).toBeDefined();
    });

    it('alle Schritt-Arten', () => {
      expect(count('simple')).toBe(45);
      expect(count('break')).toBe(8);
      expect(count('source')).toBe(2);
      expect(count('while')).toBe(3);
      expect(count('doWhile')).toBe(2);
      expect(count('ifElse')).toBe(3);
      expect(count('if')).toBe(1);
      expect(count('case')).toBe(1);
      expect(count('subsequence')).toBe(2);
    });

    it('catch-Blöcke zeigen auf existierende Break-Schritte', () => {
      const breakIds = new Set(steps.filter((s) => s.kind === 'break').map((s) => s.id));
      const catches = allCatches(diagram.mainSequence);
      expect(catches.length).toBe(5);
      for (const c of catches) {
        expect(breakIds.has(c.id)).toBe(true);
        for (const cc of c.coCatches) expect(breakIds.has(cc.breakStepId)).toBe(true);
      }
    });

    it('Edit-Areas: head ist immer Text', () => {
      for (const s of steps) expect(s.content.areas[0].kind).toBe('text');
    });
  });

  it('Change-Infos und Markups (changetracking.nsd)', () => {
    const { diagram } = load('changetracking.nsd');
    const steps = allSteps(diagram.mainSequence);
    expect(steps.some((s) => s.changeInfo !== undefined)).toBe(true);
    const markups = steps.flatMap((s) => s.content.areas.flatMap((a) => (a.kind === 'text' ? a.markups : [])));
    expect(markups.length).toBeGreaterThan(0);
  });

  it('Meta-Tags (metatags.nsd)', () => {
    const { diagram } = load('metatags.nsd');
    expect(diagram.metaTagConfigs.length).toBeGreaterThan(0);
    expect(allSteps(diagram.mainSequence).some((s) => s.tags.length > 0)).toBe(true);
  });

  it('Syntaxfehler → ModelParseException', () => {
    expect(() => readDiagram('mainSequence { }')).toThrow(ModelParseException);
  });
});
