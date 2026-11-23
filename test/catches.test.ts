// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { catchHeadingOfPath, linkCatch, removeOrMarkCatchHeading, syncCatchHeading, unlinkedBreakSteps } from '../src/core/catches.ts';
import { EditException, forEachStep } from '../src/core/editor.ts';
import type { Diagram, Step, StepSequence, SubsequenceStep, TextEditArea } from '../src/core/model.ts';
import { indexPaths } from '../src/core/paths.ts';
import { readDiagram } from '../src/core/reader.ts';
import { useTextTracker } from '../src/core/recording.ts';
import { deleteOrMarkStep } from '../src/core/steps.ts';
import { acceptChanges, rejectChanges } from '../src/core/tracking.ts';
import { writeDiagram } from '../src/core/writer.ts';
import { domTextTracker } from '../src/ui/texttrack.ts';

beforeAll(() => useTextTracker(domTextTracker));

const load = (f: string) => readDiagram(readFileSync(join(import.meta.dirname, 'fixtures', f), 'utf8')).diagram;
const roundtrip = (d: Diagram) => {
  const s = writeDiagram(d);
  expect(writeDiagram(readDiagram(s).diagram)).toBe(s);
  return s;
};
const byNumber = (d: Diagram, nr: string) => {
  let found: Step | undefined;
  forEachStep(d.mainSequence, (s) => {
    if (s.stepNumber === nr) found = s;
  });
  return found!;
};
const pathOf = (d: Diagram, obj: object) => indexPaths(d).get(obj)!;
const textPath = (d: Diagram, nr: string) => pathOf(d, byNumber(d, nr).content.areas[0]);
const sub = (d: Diagram, i: number) => (d.mainSequence.steps[i] as SubsequenceStep).subsequence;

describe('Catch-Sequenzen anlegen', () => {
  it('Dialog bietet die unverknüpften Break-Schritte der Sequenz an', () => {
    const d = load('breakcatch.nsd');
    expect(unlinkedBreakSteps(d, sub(d, 0)).map((s) => s.stepNumber)).toEqual(['1.3']);
    expect(unlinkedBreakSteps(d, sub(d, 1)).map((s) => s.stepNumber)).toEqual(['2.3', '2.4']);
    expect(unlinkedBreakSteps(d, sub(d, 2))).toEqual([]);
    expect(unlinkedBreakSteps(d, d.mainSequence).map((s) => s.stepNumber)).toEqual(['1.3', '2.3', '2.4']);
  });

  it('Catch-Sequenz am Ende des Catch-Bereichs, Überschrift aus dem Break-Schritt, ein neuer Schritt', () => {
    const d = load('breakcatch.nsd');
    const brk = byNumber(d, '1.3');
    const focus = linkCatch(d, textPath(d, '1.1'), brk.id);
    const area = sub(d, 0).catchArea!;
    expect(area.catchSequences).toHaveLength(1);
    const c = area.catchSequences[0];
    expect(c.id).toBe(brk.id);
    expect(c.heading).toEqual(brk.content);
    expect(c.steps.map((s) => `${s.stepNumber} ${(s.content.areas[0] as TextEditArea).plainText}`)).toEqual(['1.3.1 Neuer Schritt 1']);
    expect(focus?.path).toBe(pathOf(d, c.steps[0].content.areas[0]));
    expect(roundtrip(d)).toContain('catch(1.3, `<b>Customer not found</b>`');
    expect(() => linkCatch(d, textPath(d, '1.1'), brk.id)).toThrow(EditException);
  });

  it('Co-Catch hinter der Überschrift mit dem Cursor', () => {
    const d = load('breakcatch.nsd');
    linkCatch(d, textPath(d, '2.1'), byNumber(d, '2.3').id);
    const c = sub(d, 1).catchArea!.catchSequences[0];
    linkCatch(d, pathOf(d, c.heading.areas[0]), byNumber(d, '2.4').id);
    expect(c.coCatches.map((cc) => cc.breakStepId)).toEqual([byNumber(d, '2.4').id]);
    expect(roundtrip(d)).toMatch(/catch\(2\.3, [^\n]*\{\n\s*coCatch\(2\.4, `<b>Open invoices<\/b>`/);
  });

  it('mit Verfolgung hinzugefügt; Verwerfen nimmt sie wieder heraus', () => {
    const d = load('breakcatch.nsd');
    d.changeModeEnabled = true;
    d.changeSetName = 'orange';
    linkCatch(d, textPath(d, '1.1'), byNumber(d, '1.3').id);
    const c = sub(d, 0).catchArea!.catchSequences[0];
    expect(c.changeInfo).toEqual({ changetype: 'Hinzugefuegt', changeset: 'orange' });
    expect(c.steps[0].changeInfo?.changetype).toBe('Hinzugefuegt');
    expect(roundtrip(d)).toMatch(/catch\(1\.3, [^\n]*change=\(added, orange\)/);
    rejectChanges(d, 'orange', domTextTracker);
    expect(sub(d, 0).catchArea).toBeUndefined();
  });
});

describe('Catch-Überschriften entfernen', () => {
  const catchArea = (d: Diagram) => sub(d, 2).catchArea!;

  it('ohne Verfolgung: primäre Überschrift entfernt die Sequenz, Co-Catch nur sich', () => {
    const d = load('breakcatch.nsd');
    const second = catchArea(d).catchSequences[1];
    removeOrMarkCatchHeading(d, pathOf(d, second.coCatches[0].heading.areas[0]));
    expect(second.coCatches).toEqual([]);
    removeOrMarkCatchHeading(d, pathOf(d, catchArea(d).catchSequences[0].heading.areas[0]));
    expect(catchArea(d).catchSequences.map((c) => c.id)).toEqual([second.id]);
    roundtrip(d);
  });

  it('mit Verfolgung markiert; Übernehmen entfernt', () => {
    const d = load('breakcatch.nsd');
    d.changeModeEnabled = true;
    const first = catchArea(d).catchSequences[0];
    removeOrMarkCatchHeading(d, pathOf(d, first.heading.areas[0]));
    expect(first.changeInfo).toEqual({ changetype: 'Geloescht', changeset: 'yellow' });
    expect(first.steps.every((s) => s.changeInfo?.changetype === 'Geloescht')).toBe(true);
    expect(roundtrip(d)).toMatch(/catch\(3\.3, [^\n]*change=\(removed, yellow\)/);
    acceptChanges(d, 'yellow', domTextTracker);
    expect(catchArea(d).catchSequences).toHaveLength(1);
  });

  it('Pfad erkennt primäre und Co-Catch-Überschrift', () => {
    const d = load('breakcatch.nsd');
    const second = catchArea(d).catchSequences[1];
    expect(catchHeadingOfPath(d, pathOf(d, second.heading.areas[0]))?.coIndex).toBe(-1);
    expect(catchHeadingOfPath(d, pathOf(d, second.coCatches[0].heading.areas[0]))?.coIndex).toBe(0);
    expect(catchHeadingOfPath(d, textPath(d, '3.1'))).toBeUndefined();
  });
});

describe('Abgleich Break-Schritt und Catch-Überschrift', () => {
  it('Text des Break-Schritts landet in der Überschrift und umgekehrt', () => {
    const d = load('breakcatch.nsd');
    const brk = byNumber(d, '3.3');
    Object.assign(brk.content.areas[0], { text: '<b>Kunde fehlt</b>', plainText: 'Kunde fehlt' });
    expect(syncCatchHeading(d, textPath(d, '3.3'))).toBe(true);
    const c = sub(d, 2).catchArea!.catchSequences[0];
    expect((c.heading.areas[0] as TextEditArea).plainText).toBe('Kunde fehlt');
    expect(syncCatchHeading(d, textPath(d, '3.3'))).toBe(false);
    Object.assign(c.heading.areas[0], { text: 'Kein Kunde', plainText: 'Kein Kunde' });
    expect(syncCatchHeading(d, pathOf(d, c.heading.areas[0]))).toBe(true);
    expect((brk.content.areas[0] as TextEditArea).plainText).toBe('Kein Kunde');
  });
});

describe('Letzter nicht gelöschter Schritt', () => {
  it('bleibt, auch wenn noch markierte daneben stehen (allowsStepDeletion)', () => {
    const d = load('breakcatch.nsd');
    d.changeModeEnabled = true;
    const seq: StepSequence = sub(d, 0);
    for (const s of seq.steps.slice(1)) deleteOrMarkStep(d, s.id);
    expect(() => deleteOrMarkStep(d, seq.steps[0].id)).toThrow('letzte Schritt');
  });
});
