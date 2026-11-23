import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compareStepNumbers, filterStepChoices, isSteplinkDefect, stepChoices, stepIdByNumber } from '../src/core/steplinks.ts';
import { readDiagram } from '../src/core/reader.ts';

const load = (f: string) => readDiagram(readFileSync(join(import.meta.dirname, 'fixtures', f), 'utf8')).diagram;
const REF = 'specman-reference-v1.4-model-v2.nsd';

describe('Schrittauswahl für Verweise (StepnumberLinkPanel)', () => {
  it('vergleicht Nummern wie StepNumber.compareTo', () => {
    expect(['10', '2.1', '2', '1', '2.10', '2.9'].sort(compareStepNumbers)).toEqual(['1', '2', '2.1', '2.9', '2.10', '10']);
  });

  it('listet alle Schritte samt Catch-Sequenzen, nach Nummer sortiert, mit Nummer und Text', () => {
    const d = load(REF);
    const choices = stepChoices(d);
    const numbers = choices.map((c) => c.number);
    expect(numbers).toEqual([...numbers].sort(compareStepNumbers));
    expect(numbers).toContain('10.1');
    expect(choices[0].label).toMatch(/^1 - Simple step/);
    // Listenpunkte gehören zum Text, mit Zeilenumbruch verbunden
    expect(choices.find((c) => c.label.includes('Available change sets'))!.label).toContain('\nyellow\nlilac');
  });

  it('filtert ohne Rücksicht auf Groß-/Kleinschreibung, auch nach der Nummer', () => {
    const choices = stepChoices(load(REF));
    expect(filterStepChoices(choices, '  ')).toBe(choices);
    expect(filterStepChoices(choices, 'WHILE').every((c) => c.label.toLowerCase().includes('while'))).toBe(true);
    expect(filterStepChoices(choices, 'WHILE').length).toBeGreaterThan(1);
    expect(filterStepChoices(choices, '10.1 -').map((c) => c.number)).toEqual(['10.1']);
  });

  it('findet Schritte über die Nummer, defekte Verweise enden mit ?', () => {
    const d = load(REF);
    const id = stepIdByNumber(d, '4');
    expect(stepChoices(d).find((c) => c.id === id)!.number).toBe('4');
    expect(stepIdByNumber(d, '999')).toBeUndefined();
    expect(isSteplinkDefect('3?')).toBe(true);
    expect(isSteplinkDefect('3')).toBe(false);
  });
});
