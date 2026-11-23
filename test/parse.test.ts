import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseDiagram } from '../src/core/parse.ts';

const dir = join(import.meta.dirname, 'fixtures');
const files = readdirSync(dir).filter((f) => f.endsWith('.nsd'));

describe('Parser (antlr-ng)', () => {
  it('findet Testdateien', () => {
    expect(files.length).toBe(9);
  });

  it.each(files)('%s parst fehlerfrei', (f) => {
    const { tree, errors } = parseDiagram(readFileSync(join(dir, f), 'utf8'));
    expect(errors).toEqual([]);
    expect(tree.mainSequence().step().length).toBeGreaterThan(0);
  });

  it('meldet Syntaxfehler', () => {
    const { errors } = parseDiagram('mainSequence { simple(1, 0000000g, `x`); }');
    expect(errors.length).toBeGreaterThan(0);
  });
});
