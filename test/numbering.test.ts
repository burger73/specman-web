import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { childSequences, type StepSequence } from '../src/core/model.ts';
import { renumber } from '../src/core/numbering.ts';
import { readDiagram } from '../src/core/reader.ts';
import { writeDiagram } from '../src/core/writer.ts';

const dir = join(import.meta.dirname, 'fixtures');
const files = readdirSync(dir).filter((f) => f.endsWith('.nsd'));

describe('Schrittnummern neu berechnen', () => {
  it.each(files)('%s: ergibt dieselben Nummern wie in der Datei', (f) => {
    const { diagram } = readDiagram(readFileSync(join(dir, f), 'utf8'));
    const before = writeDiagram(diagram);
    const scramble = (seq: StepSequence): void => {
      for (const s of seq.steps) {
        s.stepNumber = '0';
        childSequences(s).forEach(scramble);
      }
      seq.catchArea?.catchSequences.forEach(scramble);
    };
    scramble(diagram.mainSequence);
    renumber(diagram);
    expect(writeDiagram(diagram)).toBe(before);
  });
});
