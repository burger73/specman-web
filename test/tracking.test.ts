// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { forEachStep } from '../src/core/editor.ts';
import type { Diagram, ListItemEditArea, Step, TableEditArea, TextEditArea } from '../src/core/model.ts';
import { readDiagram } from '../src/core/reader.ts';
import { acceptChanges, collapseForReview, firstChangeInStep, mergeChangeSets, rejectChanges } from '../src/core/tracking.ts';
import { writeDiagram } from '../src/core/writer.ts';
import { domTextTracker } from '../src/ui/texttrack.ts';

const load = (f: string) => readDiagram(readFileSync(join(import.meta.dirname, 'fixtures', f), 'utf8')).diagram;
const roundtrip = (d: Diagram) => {
  const s = writeDiagram(d);
  expect(writeDiagram(readDiagram(s).diagram)).toBe(s);
  return s;
};
const text = (s: Step) => s.content.areas[0] as TextEditArea;
const outline = (d: Diagram) => d.mainSequence.steps.flatMap((s) => (s.kind === 'subsequence' ? s.subsequence.steps : [s])).map((s) => `${s.stepNumber} ${s.kind} ${text(s).plainText}`);
const allChanges = (d: Diagram, cs: string) => {
  const json = JSON.stringify(d);
  return json.split(`"changeset":"${cs}"`).length - 1;
};

describe('Übernehmen und Verwerfen (changetracking.nsd)', () => {
  it('Übernehmen yellow: Text, hinzugefügter Schritt, Listenpunkt, Verschiebung', () => {
    const d = load('changetracking.nsd');
    expect(acceptChanges(d, 'yellow', domTextTracker)).toBeGreaterThan(0);
    expect(outline(d)).toEqual([
      '1.1 simple If the user wants to delete the customer, they press the button Delete.',
      '1.2 simple The system checks whether the customer may be deleted.',
      '1.3 simple The system asks the user to confirm the deletion.',
      '1.4 simple The system writes an audit log entry.',
      '1.5 simple The deletion is only possible if the customer has',
      '1.6 simple The system sends a notification mail to the customer.',
    ]);
    const steps = d.mainSequence.steps[0].kind === 'subsequence' ? d.mainSequence.steps[0].subsequence.steps : [];
    expect(text(steps[1]).text).not.toContain('strike');
    expect(text(steps[1]).markups).toEqual([]);
    expect(steps[2].changeInfo).toBeUndefined();
    expect(steps[3].changeInfo).toBeUndefined();
    expect(steps[3].sourceStepId).toBeUndefined();
    // gelöscht in blue bleibt, ebenso der lilac-Listenpunkt
    expect(steps[5].changeInfo).toEqual({ changetype: 'Geloescht', changeset: 'blue' });
    const items = steps[4].content.areas.filter((a) => a.kind === 'listItem') as ListItemEditArea[];
    expect(items.map((i) => i.changeInfo?.changeset)).toEqual([undefined, undefined, undefined, 'lilac']);
    expect(allChanges(d, 'yellow')).toBe(0);
    roundtrip(d);
  });

  it('Verwerfen yellow: Streichung aufgehoben, Hinzugefügtes weg, Zielschritt zurück an die Quelle', () => {
    const d = load('changetracking.nsd');
    expect(rejectChanges(d, 'yellow', domTextTracker)).toBeGreaterThan(0);
    expect(outline(d)).toEqual([
      '1.1 simple If the user wants to delete the customer, they press the button Delete.',
      '1.2 simple The system checks whether the customer can be deleted.',
      '1.3 simple The deletion is only possible if the customer has',
      '1.4 simple The system sends a notification mail to the customer.',
      '1.5 simple The system writes an audit log entry.',
    ]);
    const steps = d.mainSequence.steps[0].kind === 'subsequence' ? d.mainSequence.steps[0].subsequence.steps : [];
    expect(text(steps[1]).text).toBe('The system checks whether the customer can be deleted.');
    expect(steps[4].changeInfo).toBeUndefined();
    expect(steps[4].id).toBe('6c0e82a4');
    const items = steps[2].content.areas.filter((a) => a.kind === 'listItem') as ListItemEditArea[];
    expect(items.map((i) => (i.content.areas[0] as TextEditArea).plainText)).toEqual(['no open orders', 'no open payments', 'no pending refunds']);
    expect(allChanges(d, 'yellow')).toBe(0);
    roundtrip(d);
  });

  it('Übernehmen blue entfernt den gelöschten Schritt, Verwerfen blue behält ihn', () => {
    const a = load('changetracking.nsd');
    acceptChanges(a, 'blue', domTextTracker);
    expect(outline(a)).not.toContain('1.6 simple The system sends a notification mail to the customer.');
    expect(outline(a)).toHaveLength(6);
    const r = load('changetracking.nsd');
    rejectChanges(r, 'blue', domTextTracker);
    expect(outline(r)).toHaveLength(7);
    let deleted = 0;
    forEachStep(r.mainSequence, (s) => (deleted += s.changeInfo?.changetype === 'Geloescht' ? 1 : 0));
    expect(deleted).toBe(0);
  });

  it('ohne Änderungen des Sets: 0 und Diagramm unverändert', () => {
    const d = load('changetracking.nsd');
    const before = writeDiagram(d);
    expect(acceptChanges(d, 'pink', domTextTracker)).toBe(0);
    expect(rejectChanges(d, 'orange', domTextTracker)).toBe(0);
    expect(writeDiagram(d)).toBe(before);
  });
});

describe('Übernehmen und Verwerfen (Referenzdatei)', () => {
  const ref = 'specman-reference-v1.4-model-v2.nsd';
  const tableOf = (d: Diagram, nr: string) => {
    let t: TableEditArea | undefined;
    forEachStep(d.mainSequence, (s) => {
      if (s.stepNumber === nr) t = s.content.areas.find((a) => a.kind === 'table') as TableEditArea | undefined;
    });
    return t;
  };

  it('Verwerfen yellow entfernt hinzugefügte Tabelle und Zeile, Verweis im entfernten Schritt verschwindet mit', () => {
    const d = load(ref);
    const count = d.mainSequence.steps.length;
    rejectChanges(d, 'yellow', domTextTracker);
    expect(d.mainSequence.steps.length).toBeLessThan(count);
    expect(JSON.stringify(d)).not.toContain('A step being added in the yellow change set');
    roundtrip(d);
  });

  it('Tabellen: hinzugefügte Tabelle und Zeile', () => {
    const r = load(ref);
    const nrTable = '26';
    const nrRow = '27';
    expect(tableOf(r, nrTable)).toBeDefined();
    expect(tableOf(r, nrRow)!.cells).toHaveLength(2);
    // nur die Text-Areas prüfen, die Schritte selbst sind nicht hinzugefügt
    rejectChanges(r, 'yellow', domTextTracker);
    let t26: TableEditArea | undefined = undefined;
    let t27: TableEditArea | undefined = undefined;
    forEachStep(r.mainSequence, (s) => {
      const p = text(s).plainText;
      if (p === 'Table added in yellow change set:') t26 = s.content.areas.find((a) => a.kind === 'table') as TableEditArea;
      if (p === 'Table with row added in yellow change set:') t27 = s.content.areas.find((a) => a.kind === 'table') as TableEditArea;
    });
    expect(t26).toBeUndefined();
    expect(t27!.cells).toHaveLength(1);

    const a = load(ref);
    acceptChanges(a, 'yellow', domTextTracker);
    const t = tableOf(a, nrRow)!;
    expect(t.cells).toHaveLength(2);
    expect(t.cells[1].every((c) => c.areas.every((x) => !x.changeInfo && (x.kind !== 'text' || x.markups.length === 0)))).toBe(true);
  });

  it('Übernehmen yellow macht einen hinzugefügten Schrittverweis zum normalen Verweis', () => {
    const d = load(ref);
    acceptChanges(d, 'yellow', domTextTracker);
    let area: TextEditArea | undefined;
    forEachStep(d.mainSequence, (s) => {
      if (text(s).plainText.startsWith('A step being added in the yellow change set')) area = text(s);
    });
    expect(area!.markups).toEqual([{ from: 68, to: 68, type: 'Steplink' }]);
  });

  it('alle Sets nacheinander übernehmen: keine Änderungen mehr, Datei gültig', () => {
    const d = load(ref);
    for (const cs of ['yellow', 'lilac', 'blue', 'orange', 'pink']) acceptChanges(d, cs, domTextTracker);
    const s = roundtrip(d);
    expect(s).not.toMatch(/change=|Changed/);
  });

  it('alle Sets nacheinander verwerfen: keine Änderungen mehr, Datei gültig', () => {
    const d = load(ref);
    for (const cs of ['yellow', 'lilac', 'blue', 'orange', 'pink']) rejectChanges(d, cs, domTextTracker);
    const s = roundtrip(d);
    expect(s).not.toMatch(/change=|Changed|<strike>/);
  });
});

describe('Zusammenführen und Review', () => {
  it('lilac nach yellow: alle lilac-Markierungen werden yellow', () => {
    const d = load('changetracking.nsd');
    const lilac = allChanges(d, 'lilac');
    const yellow = allChanges(d, 'yellow');
    mergeChangeSets(d, 'yellow', 'lilac');
    expect(allChanges(d, 'lilac')).toBe(0);
    expect(allChanges(d, 'yellow')).toBe(yellow + lilac);
    expect(writeDiagram(d)).toContain('item(`no pending refunds`, plain=`no pending refunds`, markups=[(0,17,Changed,yellow)], change=(added, yellow))');
    roundtrip(d);
  });

  it('Review klappt nur Schritte ohne Änderungen zu', () => {
    const d = load('specman-reference-v1.4-model-v2.nsd');
    collapseForReview(d);
    let checked = 0;
    forEachStep(d.mainSequence, (s) => {
      if (!('collapsed' in s)) return;
      checked++;
      if (!firstChangeInStep(s)) expect(s.collapsed).toBe(true);
    });
    expect(checked).toBeGreaterThan(0);
  });
});
