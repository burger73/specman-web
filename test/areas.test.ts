import { describe, expect, it } from 'vitest';
import { addListItem, appendText, backspaceAtStart, dissolveListItem, splitListItem } from '../src/core/areas.ts';
import { newDiagram, textArea } from '../src/core/factory.ts';
import type { Diagram, EditArea, ListItemEditArea, TextEditArea } from '../src/core/model.ts';
import { renumber } from '../src/core/numbering.ts';
import { readDiagram } from '../src/core/reader.ts';
import { writeDiagram } from '../src/core/writer.ts';

/** Diagramm mit einem Schritt, dessen Inhalt aus den angegebenen Areas besteht */
function diagram(...areas: EditArea[]): Diagram {
  const d = newDiagram();
  d.mainSequence.steps.push({ kind: 'simple', id: 'aaaaaaaa', stepNumber: '1', content: { areas }, decorationStyle: 'None', tags: [] });
  return d;
}
const P = 'mainSequence/steps/0/content';
const areas = (d: Diagram) => d.mainSequence.steps[0].content.areas;
const texts = (as: EditArea[]): unknown[] => as.map((a) => (a.kind === 'text' ? a.plainText : a.kind === 'listItem' ? texts(a.content.areas) : a.kind));
/** Datei schreiben und wieder lesen: das Ergebnis muss gültig sein */
const roundtrip = (d: Diagram) => {
  renumber(d);
  const s = writeDiagram(d);
  expect(writeDiagram(readDiagram(s).diagram)).toBe(s);
};

describe('Text anhängen', () => {
  it('verschiebt Markups und trennt Absätze', () => {
    const a = textArea('Siehe 1');
    a.markups = [{ from: 6, to: 6, type: 'Steplink' }];
    const b = textArea('<div>und 2</div>');
    b.markups = [{ from: 4, to: 4, type: 'Steplink' }];
    appendText(a, b);
    expect(a.plainText).toBe('Siehe 1\nund 2');
    expect(a.markups).toEqual([
      { from: 6, to: 6, type: 'Steplink' },
      { from: 12, to: 12, type: 'Steplink' },
    ]);
  });
});

describe('Listen', () => {
  it('Absatz wird zum Listenpunkt, davor und danach bleiben Texte', () => {
    const d = diagram(textArea('<div>a</div><div>b</div><div>c</div>'));
    const focus = addListItem(d, `${P}/areas/0`, true, textArea('<div>a</div>'), textArea('<div>b</div>'), textArea('<div>c</div>'));
    expect(texts(areas(d))).toEqual(['a', ['b'], 'c']);
    expect(focus).toEqual({ path: `${P}/areas/1/content/areas/0`, offset: 0 });
    expect((areas(d)[1] as ListItemEditArea).ordered).toBe(true);
    roundtrip(d);
  });

  it('Enter teilt den Listenpunkt, folgende Areas wandern mit', () => {
    const li: ListItemEditArea = { kind: 'listItem', ordered: false, content: { areas: [textArea('eins zwei'), textArea('drei')] } };
    const d = diagram(textArea(''), li);
    const focus = splitListItem(d, `${P}/areas/1/content/areas/0`, textArea('eins'), textArea('zwei'));
    expect(texts(areas(d))).toEqual(['', ['eins'], ['zwei', 'drei']]);
    expect(focus.path).toBe(`${P}/areas/2/content/areas/0`);
    expect((areas(d)[2] as ListItemEditArea).ordered).toBe(false);
    roundtrip(d);
  });

  it('Auflösen hängt den Text an den vorigen und den folgenden Text', () => {
    const li: ListItemEditArea = { kind: 'listItem', ordered: false, content: { areas: [textArea('b')] } };
    const d = diagram(textArea('a'), li, textArea('c'));
    const focus = dissolveListItem(d, `${P}/areas/1`);
    expect(texts(areas(d))).toEqual(['a\nb\nc']);
    expect((areas(d)[0] as TextEditArea).text).toBe('a<div>b</div><div>c</div>');
    expect(focus).toEqual({ path: `${P}/areas/0`, offset: 2 });
    roundtrip(d);
  });

  it('Auflösen ohne Text davor hebt die Areas einfach an', () => {
    const li: ListItemEditArea = { kind: 'listItem', ordered: false, content: { areas: [textArea('b'), { kind: 'svg', source: '<svg/>', individualScalePercent: 1 }] } };
    const d = diagram(textArea('a'), { kind: 'svg', source: '<svg/>', individualScalePercent: 1 }, li, textArea('c'));
    dissolveListItem(d, `${P}/areas/2`);
    expect(texts(areas(d))).toEqual(['a', 'svg', 'b', 'svg', 'c']);
  });

  it('Backspace am Anfang: Listenpunkt auflösen, in vorigen Listenpunkt übernehmen, leeren Text entfernen', () => {
    const li = (t: string): ListItemEditArea => ({ kind: 'listItem', ordered: false, content: { areas: [textArea(t)] } });
    let d = diagram(textArea('a'), li('b'));
    expect(backspaceAtStart(d, `${P}/areas/1/content/areas/0`)).toEqual({ path: `${P}/areas/0`, offset: 2 });
    expect(texts(areas(d))).toEqual(['a\nb']);

    d = diagram(textArea('a'), li('b'), textArea('c'));
    expect(backspaceAtStart(d, `${P}/areas/2`)).toEqual({ path: `${P}/areas/1/content/areas/0`, offset: 2 });
    expect(texts(areas(d))).toEqual(['a', ['b\nc']]);

    d = diagram(textArea('a'), li('b'), textArea(''));
    expect(backspaceAtStart(d, `${P}/areas/2`)).toEqual({ path: `${P}/areas/1/content/areas/0` });
    expect(texts(areas(d))).toEqual(['a', ['b']]);

    d = diagram(textArea('a'));
    expect(backspaceAtStart(d, `${P}/areas/0`)).toBeUndefined();
  });
});
