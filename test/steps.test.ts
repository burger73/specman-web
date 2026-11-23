import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EditException, forEachStep } from '../src/core/editor.ts';
import { newDiagram } from '../src/core/factory.ts';
import { childSequences, type CaseStep, type Diagram, type Step, type StepSequence, type TextEditArea } from '../src/core/model.ts';
import { resolvePath } from '../src/core/paths.ts';
import { readDiagram } from '../src/core/reader.ts';
import { mapPlainToHtml } from '../src/core/steplinks.ts';
import { addCaseBranch, caseBranchOfPath, deleteStep, insertStep, locateStep, removeCaseBranch, setAllCollapsed, stepOfPath, toggleBorder, toggleShade, type NewStepKind } from '../src/core/steps.ts';
import { writeDiagram } from '../src/core/writer.ts';

const load = (f: string) => readDiagram(readFileSync(join(import.meta.dirname, 'fixtures', f), 'utf8')).diagram;
const roundtrip = (d: Diagram) => {
  const s = writeDiagram(d);
  expect(writeDiagram(readDiagram(s).diagram)).toBe(s);
  return s;
};
const outline = (steps: Step[]): string[] => steps.map((s) => `${s.stepNumber} ${s.kind} ${(s.content.areas[0] as TextEditArea).plainText}`);

describe('Schritte einfügen', () => {
  it('alle Arten im leeren Diagramm, Datei bleibt gültig', () => {
    const d = newDiagram();
    const kinds: NewStepKind[] = ['simple', 'while', 'doWhile', 'ifElse', 'if', 'case', 'subsequence', 'break'];
    let after: string | undefined;
    for (const k of kinds) {
      insertStep(d, k, after);
      after = d.mainSequence.steps[d.mainSequence.steps.length - 1].id;
    }
    expect(outline(d.mainSequence.steps)).toEqual([
      '1 simple Neuer Schritt 1',
      '2 while Neue Schleife 2',
      '3 doWhile Neue Schleife 3',
      '4 ifElse If-Else 4',
      '6 if If 5',
      '7 case Case-6',
      '10 subsequence Subsequenz 7',
      '11 break Exception 8',
    ]);
    const s = roundtrip(d);
    expect(s).toContain("ifElse(4, ");
    expect(s).toContain("if_branch(`Ja`");
    expect(s).toContain("else_branch(`<div align='right'>Nein</div>`, plain=`Nein`)");
    expect(s).toContain('simple(5.1, ');
    expect(s).toContain('simple(9.1, ');
  });

  it('hinter dem Schritt mit dem Cursor, in dessen Sequenz; Fokus auf den neuen Schritt', () => {
    const d = load('gutenmorgen.nsd');
    const ref = d.mainSequence.steps[0];
    const focus = insertStep(d, 'simple', ref.id)!;
    const added = d.mainSequence.steps[1];
    expect(added.stepNumber).toBe('2');
    expect((added.content.areas[0] as TextEditArea).plainText).toBe(`Neuer Schritt ${d.mainSequence.steps.length}`);
    expect(resolvePath(d, focus.path)).toBe(added.content.areas[0]);
    expect(d.mainSequence.steps[2].stepNumber).toBe('3');
    roundtrip(d);
  });

  it('ohne Cursor am Ende der Hauptsequenz', () => {
    const d = load('gutenmorgen.nsd');
    const n = d.mainSequence.steps.length;
    insertStep(d, 'break', undefined);
    expect(d.mainSequence.steps[n].kind).toBe('break');
  });
});

describe('Schrittverweise', () => {
  it('werden beim Einfügen davor umgeschrieben, auch im HTML', () => {
    const d = load('specman-reference-v1.4-model-v2.nsd');
    // Schritt 4 verweist auf Schritt 1
    insertStep(d, 'simple', undefined);
    const first = d.mainSequence.steps[0];
    d.mainSequence.steps.splice(0, 0); // Struktur unverändert
    insertStep(d, 'simple', first.id);
    const ref = d.mainSequence.steps[4].content.areas[0] as TextEditArea;
    expect(ref.plainText).toContain('by its number 1.');
    // vor Schritt 1 einfügen geht nur über Löschen/Einfügen; Schritt 1 entfernen macht den Verweis defekt
    deleteStep(d, first.id);
    const after = d.mainSequence.steps[3].content.areas[0] as TextEditArea;
    expect(after.plainText).toContain('by its number 1?.');
    expect(after.text).toContain('number 1?.');
    expect(after.markups).toEqual([{ from: 47, to: 48, type: 'Steplink' }]);
    roundtrip(d);
  });

  it('Klartext-Positionen im HTML finden', () => {
    const html = '<div>\n  Schritt &amp; <b>2.1</b>\n</div>';
    const spans = mapPlainToHtml(html, 'Schritt & 2.1');
    expect(html.substring(spans[10]!.start, spans[12]!.end)).toBe('2.1');
    expect(html.substring(spans[8]!.start, spans[8]!.end)).toBe('&amp;');
  });
});

describe('Schritte löschen', () => {
  it('der letzte Schritt einer Sequenz bleibt', () => {
    const d = newDiagram();
    insertStep(d, 'while', undefined);
    const loop = d.mainSequence.steps[0] as Step & { loopSequence: { steps: Step[] } };
    expect(() => deleteStep(d, loop.loopSequence.steps[0].id)).toThrow(EditException);
    expect(() => deleteStep(d, loop.id)).toThrow('Der letzte Schritt kann nicht entfernt werden.');
  });

  it('Break mit Catch-Sequenz: die Catch-Sequenz verschwindet mit', () => {
    const d = load('breakcatch.nsd');
    const s = writeDiagram(d);
    expect(s).toContain('catch(');
    const caught = new Set<string>();
    forEachStep(d.mainSequence, () => {});
    const collect = (seq: StepSequence) => {
      seq.catchArea?.catchSequences.forEach((c) => caught.add(c.id));
      seq.steps.forEach((x) => childSequences(x).forEach(collect));
    };
    collect(d.mainSequence);
    let brk: Step | undefined;
    forEachStep(d.mainSequence, (x) => {
      if (!brk && x.kind === 'break' && caught.has(x.id) && locateStep(d, x.id)!.seq.steps.length > 1) brk = x;
    });
    expect(brk).toBeDefined();
    const catches = () => (writeDiagram(d).match(/catch\(/g) ?? []).length;
    const before = catches();
    deleteStep(d, brk!.id);
    expect(catches()).toBe(before - 1);
    roundtrip(d);
  });
});

describe('Case-Zweige', () => {
  it('rechts neben dem Zweig mit dem Cursor einfügen und wieder entfernen', () => {
    const d = newDiagram();
    insertStep(d, 'case', undefined);
    const step = d.mainSequence.steps[0] as CaseStep;
    const focus = addCaseBranch(d, step.id, 0)!;
    expect(step.caseSequences.map((c) => (c.heading.areas[0] as TextEditArea).plainText)).toEqual(['Fall 1', 'Fall 1', 'Fall 2']);
    expect(caseBranchOfPath(d, focus.path)).toEqual({ step, branch: 1 });
    expect(step.columnWidthRatios.reduce((a, b) => a + b)).toBeCloseTo(1);
    expect(step.columnWidthRatios[1]).toBeCloseTo(0.25);
    expect(step.caseSequences[1].steps[0].stepNumber).toBe('3.1');
    expect(stepOfPath(d, focus.path)).toBe(step);
    roundtrip(d);
    removeCaseBranch(d, step.id, 1);
    expect(step.caseSequences).toHaveLength(2);
    expect(() => removeCaseBranch(d, step.id, 1)).toThrow('mindestens 2');
    expect(() => removeCaseBranch(d, step.id, 0)).toThrow('Sonst');
    roundtrip(d);
  });
});

describe('Einfärben, Rahmen, Klappen', () => {
  it('Einfärben schaltet die Schattierung um', () => {
    const d = newDiagram();
    insertStep(d, 'simple', undefined);
    const s = d.mainSequence.steps[0];
    toggleShade(d, s.id);
    expect(roundtrip(d)).toContain('shade=#dcdcdc');
    toggleShade(d, s.id);
    expect(s.shade).toBeUndefined();
  });

  it('Rahmen: Full ohne gerahmten Vorgänger, sonst Co; der Nachfolger passt sich an', () => {
    const d = newDiagram();
    for (let i = 0; i < 3; i++) insertStep(d, 'simple', d.mainSequence.steps.at(-1)?.id);
    const [a, b, c] = d.mainSequence.steps;
    toggleBorder(d, b.id);
    toggleBorder(d, c.id);
    expect([a, b, c].map((s) => s.decorationStyle)).toEqual(['None', 'Full', 'Co']);
    toggleBorder(d, a.id);
    expect([a, b, c].map((s) => s.decorationStyle)).toEqual(['Full', 'Co', 'Co']);
    toggleBorder(d, b.id);
    expect([a, b, c].map((s) => s.decorationStyle)).toEqual(['Full', 'None', 'Full']);
    deleteStep(d, b.id);
    expect([a, c].map((s) => s.decorationStyle)).toEqual(['Full', 'Co']);
    roundtrip(d);
  });

  it('alle zuklappen und aufklappen', () => {
    const d = load('specman-reference-v1.4-model-v2.nsd');
    setAllCollapsed(d, true);
    const all: boolean[] = [];
    forEachStep(d.mainSequence, (s) => 'collapsed' in s && all.push(s.collapsed));
    expect(all.length).toBeGreaterThan(3);
    expect(all.every(Boolean)).toBe(true);
    setAllCollapsed(d, false);
    expect(roundtrip(d)).not.toContain('collapsed=true');
  });
});
