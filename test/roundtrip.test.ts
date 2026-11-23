import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readDiagram } from '../src/core/reader.ts';
import { writeDiagram } from '../src/core/writer.ts';

const dir = join(import.meta.dirname, 'fixtures');
const files = readdirSync(dir).filter((f) => f.endsWith('.nsd'));

/**
 * Specman 1.3 schrieb einen kürzeren Kopf und leere plain=``-Attribute, der heutige Serializer (Java wie TS) nicht mehr.
 * Für 1.3-Dateien wird daher ab dem settings-Block und ohne leere plain-Attribute verglichen.
 */
const normalize13 = (s: string) => s.substring(s.indexOf('\nsettings {')).replaceAll(', plain=``', '');

describe('Roundtrip lesen → schreiben', () => {
  it.each(files)('%s kommt zeichengleich heraus', (f) => {
    const original = readFileSync(join(dir, f), 'utf8');
    const { diagram, envelope } = readDiagram(original);
    const written = writeDiagram(diagram, envelope.specmanVersion);
    if (envelope.specmanVersion === '1.3.0') {
      expect(written).toBe(written.substring(0, written.indexOf('\nsettings {')) + normalize13(original));
    } else {
      expect(written).toBe(original);
    }
  });

  it.each(files)('%s: zweiter Durchlauf ist stabil', (f) => {
    const once = writeDiagram(readDiagram(readFileSync(join(dir, f), 'utf8')).diagram);
    expect(writeDiagram(readDiagram(once).diagram)).toBe(once);
  });
});
