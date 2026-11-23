// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { addTableRow, insertImage, insertTable, removeOrMarkArea, removeTableColumn, removeTableRow, splitListItem, addListItem } from '../src/core/areas.ts';
import { EditException, forEachStep } from '../src/core/editor.ts';
import { newDiagram, textArea } from '../src/core/factory.ts';
import type { CaseStep, Diagram, ListItemEditArea, Step, TableEditArea, TextEditArea } from '../src/core/model.ts';
import { readDiagram } from '../src/core/reader.ts';
import { useTextTracker } from '../src/core/recording.ts';
import { addCaseBranch, deleteOrMarkStep, insertStep, locateStep } from '../src/core/steps.ts';
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
const text = (s: Step) => s.content.areas[0] as TextEditArea;
/** Neues Diagramm mit zwei unverfolgten Schritten, danach Verfolgung in cs an */
function tracked(cs = 'lilac'): Diagram {
  const d = newDiagram();
  insertStep(d, 'simple', undefined);
  insertStep(d, 'simple', d.mainSequence.steps[0].id);
  d.changeModeEnabled = true;
  d.changeSetName = cs;
  return d;
}
const byNumber = (d: Diagram, nr: string) => {
  let found: Step | undefined;
  forEachStep(d.mainSequence, (s) => {
    if (s.stepNumber === nr) found = s;
  });
  return found!;
};

describe('Aufzeichnen: neue Schritte und Zweige', () => {
  it('neuer If-Else-Schritt ist samt Zweigen und Unterschritten hinzugefügt', () => {
    const d = tracked();
    insertStep(d, 'ifElse', d.mainSequence.steps[1].id);
    const s = d.mainSequence.steps[2];
    expect(s.changeInfo).toEqual({ changetype: 'Hinzugefuegt', changeset: 'lilac' });
    expect(text(s).markups).toEqual([{ from: 0, to: 8, type: 'Changed', changeset: 'lilac' }]);
    if (s.kind !== 'ifElse') throw new Error();
    expect(s.ifSequence.changeInfo?.changetype).toBe('Hinzugefuegt');
    expect(s.elseSequence.steps[0].changeInfo?.changetype).toBe('Hinzugefuegt');
    const out = roundtrip(d);
    expect(out).toContain('change=(added, lilac)');
    expect(out).toContain('changeModeEnabled=true');
    // Verwerfen nimmt den Schritt wieder heraus
    rejectChanges(d, 'lilac', domTextTracker);
    expect(d.mainSequence.steps).toHaveLength(2);
  });

  it('ohne Verfolgung bleibt alles unmarkiert', () => {
    const d = tracked();
    d.changeModeEnabled = false;
    insertStep(d, 'case', undefined);
    expect(JSON.stringify(d)).not.toContain('changeInfo');
  });

  it('neuer Case-Zweig ist hinzugefügt, Löschen entfernt ihn ohne Mindestzahl-Prüfung', () => {
    const d = tracked();
    d.changeModeEnabled = false;
    insertStep(d, 'case', undefined);
    d.changeModeEnabled = true;
    const c = d.mainSequence.steps[2] as CaseStep;
    addCaseBranch(d, c.id, 2);
    expect(c.caseSequences[2].changeInfo?.changetype).toBe('Hinzugefuegt');
    expect((c.caseSequences[2].heading.areas[0] as TextEditArea).markups[0]?.type).toBe('Changed');
    deleteOrMarkStep(d, c.id, 3);
    expect(c.caseSequences).toHaveLength(2);
  });
});

describe('Aufzeichnen: Schritte löschen', () => {
  it('markiert statt zu entfernen; Übernehmen entfernt, Verwerfen stellt her', () => {
    const d = tracked();
    const id = d.mainSequence.steps[0].id;
    expect(deleteOrMarkStep(d, id)).toBeUndefined();
    expect(d.mainSequence.steps[0].changeInfo).toEqual({ changetype: 'Geloescht', changeset: 'lilac' });
    expect(roundtrip(d)).toContain('change=(removed, lilac)');
    const a = structuredClone(d);
    acceptChanges(a, 'lilac', domTextTracker);
    expect(a.mainSequence.steps.map((s) => s.id)).not.toContain(id);
    rejectChanges(d, 'lilac', domTextTracker);
    expect(d.mainSequence.steps[0].changeInfo).toBeUndefined();
    expect(text(d.mainSequence.steps[0]).plainText).toBe('Neuer Schritt 1');
  });

  it('eigene Text-Änderungen werden beim Markieren verworfen, fremde bleiben', () => {
    const d = tracked();
    const s = d.mainSequence.steps[0];
    Object.assign(text(s), {
      text: 'A <strike>alt</strike>neu B',
      plainText: 'A altneu B',
      markups: [
        { from: 2, to: 4, type: 'Changed', changeset: 'lilac' },
        { from: 5, to: 7, type: 'Changed', changeset: 'blue' },
      ],
    });
    deleteOrMarkStep(d, s.id);
    expect(text(s).plainText).toBe('A altneu B');
    expect(text(s).text).not.toContain('strike');
    expect(text(s).markups).toEqual([{ from: 5, to: 7, type: 'Changed', changeset: 'blue' }]);
  });

  it('schon gelöschte bleiben, hinzugefügte verschwinden sofort, der letzte Schritt bleibt', () => {
    const d = tracked();
    insertStep(d, 'simple', d.mainSequence.steps[1].id);
    const added = d.mainSequence.steps[2].id;
    deleteOrMarkStep(d, added);
    expect(locateStep(d, added)).toBeUndefined();
    const first = d.mainSequence.steps[0].id;
    deleteOrMarkStep(d, first);
    deleteOrMarkStep(d, first);
    expect(d.mainSequence.steps[0].changeInfo?.changetype).toBe('Geloescht');
    const single = newDiagram();
    insertStep(single, 'simple', undefined);
    single.changeModeEnabled = true;
    expect(() => deleteOrMarkStep(single, single.mainSequence.steps[0].id)).toThrow(EditException);
  });

  it('ein schon geändertes Change Set des Schritts bleibt (setAenderungsartUDBL)', () => {
    const d = load('changetracking.nsd');
    d.changeModeEnabled = true;
    d.changeSetName = 'pink';
    const target = byNumber(d, '1.4');
    deleteOrMarkStep(d, target.id);
    expect(target.changeInfo).toEqual({ changetype: 'Geloescht', changeset: 'yellow' });
  });

  it('Case-Zweig: markieren, Sonst und Mindestzahl melden', () => {
    const d = tracked();
    d.changeModeEnabled = false;
    insertStep(d, 'case', undefined);
    const c = d.mainSequence.steps[2] as CaseStep;
    addCaseBranch(d, c.id, 2);
    d.changeModeEnabled = true;
    expect(() => deleteOrMarkStep(d, c.id, 0)).toThrow('Sonst');
    deleteOrMarkStep(d, c.id, 3);
    expect(c.caseSequences[2].changeInfo).toEqual({ changetype: 'Geloescht', changeset: 'lilac' });
    expect(c.caseSequences[2].steps[0].changeInfo?.changetype).toBe('Geloescht');
    expect(c.changeInfo).toBeUndefined();
    roundtrip(d);
    acceptChanges(d, 'lilac', domTextTracker);
    expect(c.caseSequences).toHaveLength(2);
  });

  it('Break-Schritt: seine Catch-Sequenz wird mit markiert, ein Co-Catch ebenso', () => {
    const d = load('breakcatch.nsd');
    d.changeModeEnabled = true;
    const brk = byNumber(d, '3.3');
    deleteOrMarkStep(d, byNumber(d, '3.6').id);
    expect(JSON.stringify(d)).toContain('"coCatches":[{"breakStepId":"' + byNumber(d, '3.6').id + '","heading":');
    expect(writeDiagram(d)).toMatch(/coCatch\(3\.6, [^\n]*change=\(removed, yellow\)\)/);
    deleteOrMarkStep(d, brk.id);
    let catchSeq;
    const walk = (seq: Diagram['mainSequence']) => {
      for (const c of seq.catchArea?.catchSequences ?? []) if (c.id === brk.id) catchSeq = c;
      for (const s of seq.steps) for (const sub of 'subsequence' in s ? [s.subsequence] : []) walk(sub);
    };
    walk(d.mainSequence);
    expect(catchSeq!.changeInfo).toEqual({ changetype: 'Geloescht', changeset: 'yellow' });
    roundtrip(d);
    acceptChanges(d, 'yellow', domTextTracker);
    expect(JSON.stringify(d)).not.toContain(brk.id);
  });
});

describe('Aufzeichnen: Areas', () => {
  const P = 'mainSequence/steps/0/content';
  const areas = (d: Diagram) => d.mainSequence.steps[0].content.areas;

  it('neue Tabelle: Tabelle und alle Zellen hinzugefügt; Zeile löschen entfernt eigene neue Zeilen', () => {
    const d = tracked();
    insertTable(d, `${P}/areas/0`, textArea('Neuer Schritt 1'), undefined, 2, 2);
    const t = areas(d)[1] as TableEditArea;
    expect(t.changeInfo?.changetype).toBe('Hinzugefuegt');
    expect(t.cells.flat().every((c) => c.areas[0].changeInfo?.changetype === 'Hinzugefuegt')).toBe(true);
    roundtrip(d);
    removeTableRow(d, `${P}/areas/1`, 0);
    expect(t.cells).toHaveLength(1);
  });

  it('unverfolgte Tabelle: Zeile und Spalte werden markiert, Übernehmen entfernt sie', () => {
    const d = tracked();
    d.changeModeEnabled = false;
    insertTable(d, `${P}/areas/0`, textArea('Neuer Schritt 1'), undefined, 3, 3);
    d.changeModeEnabled = true;
    const t = areas(d)[1] as TableEditArea;
    addTableRow(d, `${P}/areas/1`, 3);
    expect(t.cells[3].every((c) => c.areas[0].changeInfo?.changetype === 'Hinzugefuegt')).toBe(true);
    removeTableRow(d, `${P}/areas/1`, 0);
    removeTableColumn(d, `${P}/areas/1`, 2);
    expect(t.cells).toHaveLength(4);
    expect(t.cells[0].every((c) => c.areas[0].changeInfo?.changetype === 'Geloescht')).toBe(true);
    const out = roundtrip(d);
    expect(out).toContain('change=(removed, lilac)');
    acceptChanges(d, 'lilac', domTextTracker);
    expect(t.cells.length).toBe(3);
    expect(t.cells[0].length).toBe(2);
    expect(JSON.stringify(t)).not.toContain('changeInfo');
  });

  it('unverfolgte Tabelle entfernen markiert sie, nochmal entfernen nimmt sie heraus', () => {
    const d = tracked();
    d.changeModeEnabled = false;
    insertTable(d, `${P}/areas/0`, textArea('Neuer Schritt 1'), undefined, 1, 1);
    d.changeModeEnabled = true;
    removeOrMarkArea(d, `${P}/areas/1`);
    expect(areas(d)[1].changeInfo?.changetype).toBe('Geloescht');
    removeOrMarkArea(d, `${P}/areas/1`);
    expect(areas(d)).toHaveLength(1);
  });

  it('Bild: neu hinzugefügt, unverfolgt entfernen markiert', () => {
    const d = tracked();
    const img = { kind: 'svg' as const, source: '<svg/>', individualScalePercent: 1 };
    insertImage(d, `${P}/areas/0`, textArea('Neuer Schritt 1'), undefined, img);
    expect(areas(d)[1].changeInfo?.changetype).toBe('Hinzugefuegt');
    delete areas(d)[1].changeInfo;
    removeOrMarkArea(d, `${P}/areas/1`);
    expect(areas(d)[1].changeInfo).toEqual({ changetype: 'Geloescht', changeset: 'lilac' });
    rejectChanges(d, 'lilac', domTextTracker);
    expect(areas(d)[1].changeInfo).toBeUndefined();
  });

  it('Listenpunkt: neu hinzugefügt, beim Teilen übernimmt der neue die Änderung', () => {
    const d = tracked();
    addListItem(d, `${P}/areas/0`, false, textArea(''), textArea('Punkt'), undefined);
    const li = areas(d)[1] as ListItemEditArea;
    expect(li.changeInfo?.changetype).toBe('Hinzugefuegt');
    splitListItem(d, `${P}/areas/1/content/areas/0`, textArea('Pu'), textArea('nkt'));
    expect((areas(d)[2] as ListItemEditArea).changeInfo).toEqual(li.changeInfo);
  });
});
