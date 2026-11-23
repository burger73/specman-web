// @vitest-environment jsdom
// Absatzformat, Ausrichtung und Styles löschen gegen das, was die SHEF-Aktionen in Swing schreiben.
// Die Erwartungen stammen aus Läufen der Original-Aktionen auf einem kopflosen JEditorPane (Body ohne Einrückung).
import { describe, expect, it } from 'vitest';
import { alignParagraphs, changeBlockType, clearStyles, textStateAt } from '../src/ui/textformat.ts';
import { cleanHtml } from '../src/ui/textedit.ts';

/** Area mit dem HTML; die Auswahl reicht vom ersten Vorkommen von from bis zum Ende des ersten von to danach */
function area(html: string, from: string, to = from, caret = false) {
  const el = document.createElement('div');
  el.contentEditable = 'true';
  el.innerHTML = html;
  document.body.replaceChildren(el);
  const texts: Text[] = [];
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) texts.push(n as Text);
  const find = (s: string, after?: [Text, number]): [Text, number] => {
    let started = !after;
    for (const t of texts) {
      if (!started && t !== after![0]) continue;
      const i = t.data.indexOf(s, started ? 0 : after![1]);
      started = true;
      if (i >= 0) return [t, i];
    }
    throw new Error(`${s} nicht gefunden`);
  };
  const a = find(from);
  const b = caret ? a : find(to, a);
  const range = document.createRange();
  range.setStart(a[0], a[1]);
  range.setEnd(b[0], caret ? b[1] : b[1] + to.length);
  getSelection()!.removeAllRanges();
  getSelection()!.addRange(range);
  return { el, range };
}

const html = (el: HTMLElement) => cleanHtml(el).replace(/\s+/g, ' ').trim();

describe('Absatzformat (HTMLBlockAction)', () => {
  it('packt Text ohne Absatz-Element ein', () => {
    const { el, range } = area('Hallo Welt', 'Welt', 'Welt', true);
    changeBlockType(el, range, 'H1');
    expect(html(el)).toBe('<h1>Hallo Welt</h1>');
  });

  it('ändert nur den Absatz an der Schreibmarke', () => {
    const { el, range } = area('<div>A1</div><div>B2</div>', 'B2', 'B2', true);
    changeBlockType(el, range, 'H1');
    expect(html(el)).toBe('<div>A1</div><h1>B2</h1>');
  });

  it('übernimmt die Attribute des Absatzes', () => {
    const { el, range } = area('<h1 align="center">A1</h1>', 'A1', 'A1', true);
    changeBlockType(el, range, 'DIV');
    expect(html(el)).toBe('<div align="center">A1</div>');
  });

  it('ändert alle Absätze der Auswahl', () => {
    const { el, range } = area('<div>A1</div><div>B2</div><div>C3</div>', 'A1', 'B2');
    changeBlockType(el, range, 'P');
    expect(html(el)).toBe('<p>A1</p><p>B2</p><div>C3</div>');
  });

  it('Vorformatiert fasst den Leerraum zusammen', () => {
    const { el, range } = area('<div>\n      A  1\n    </div>', 'A', 'A', true);
    changeBlockType(el, range, 'PRE');
    expect(cleanHtml(el)).toBe('<pre>A 1</pre>');
  });

  it('Leerraum zwischen Blöcken ist kein Absatz', () => {
    const { el, range } = area('<div>A1</div>\n    <div>B2</div>', 'A1', 'B2');
    changeBlockType(el, range, 'BLOCKQUOTE');
    expect(html(el)).toBe('<blockquote>A1</blockquote> <blockquote>B2</blockquote>');
  });

  it('Markierungen der Änderungsverfolgung bleiben', () => {
    const { el, range } = area('<div data-break="changed" data-break-cs="gelb">A <span class="sm-markup" data-markup="0" data-type="Changed">neu</span></div>', 'A', 'A', true);
    changeBlockType(el, range, 'H2');
    expect(el.innerHTML).toBe('<h2 data-break="changed" data-break-cs="gelb">A <span class="sm-markup" data-markup="0" data-type="Changed">neu</span></h2>');
  });
});

describe('Ausrichtung (HTMLAlignAction)', () => {
  it('Text ohne Absatz-Element kommt in ein <div align> (Abweichung: Swing lässt ihn unverändert)', () => {
    const { el, range } = area('Hallo <b>Welt</b><div>B2</div>', 'Welt', 'Welt', true);
    alignParagraphs(el, range, 'center');
    expect(html(el)).toBe('<div align="center">Hallo <b>Welt</b></div><div>B2</div>');
    expect(getSelection()!.anchorNode!.textContent).toBe('Welt');
  });

  it('setzt align an den Absätzen der Auswahl', () => {
    const { el, range } = area('<div>A1</div><div>B2</div>', 'A1', 'A1', true);
    alignParagraphs(el, range, 'right');
    expect(html(el)).toBe('<div align="right">A1</div><div>B2</div>');
  });

  it('ersetzt eine vorhandene Ausrichtung', () => {
    const { el, range } = area('<p align="left">Hallo</p>', 'Hallo', 'Hallo', true);
    alignParagraphs(el, range, 'justify');
    expect(html(el)).toBe('<p align="justify">Hallo</p>');
  });
});

describe('Styles löschen (ClearStylesAction)', () => {
  it('entfernt alle Zeichenformate der Auswahl, auch Links', () => {
    const { el, range } = area('Hallo <b><font color="#ff0000" size="5">Welt</font></b> <u>x</u> <a href="y">z</a>', 'Welt', 'z');
    clearStyles(el, range);
    expect(html(el)).toBe('Hallo Welt x z');
  });

  it('teilt Formate an den Grenzen der Auswahl', () => {
    const { el, range } = area('<b>Hallo Welt</b>', 'llo', 'We');
    clearStyles(el, range);
    expect(html(el)).toBe('<b>Ha</b>llo We<b>lt</b>');
  });

  it('lässt Überschriften stehen', () => {
    const { el, range } = area('<h2>Hallo <i>Welt</i></h2>', 'Hallo', 'Welt');
    clearStyles(el, range);
    expect(html(el)).toBe('<h2>Hallo Welt</h2>');
  });

  it('Änderungsmarkierungen und Streichungen bleiben', () => {
    const { el, range } = area('<b>A <span class="sm-markup" data-markup="0" data-type="Changed"><strike>alt</strike></span></b>', 'A', 'alt');
    clearStyles(el, range);
    expect(el.innerHTML).toBe('A <span class="sm-markup" data-markup="0" data-type="Changed"><strike>alt</strike></span>');
  });

  it('die Auswahl bleibt erhalten', () => {
    const { el, range } = area('x <b>Hallo</b> y', 'Hallo');
    clearStyles(el, range);
    expect(getSelection()!.toString()).toBe('Hallo');
  });
});

describe('Zustand an der Schreibmarke', () => {
  it('Absatzformat, Ausrichtung, Größe, fett', () => {
    const { el, range } = area('<h3 align="center"><b><font size="6">Hallo</font></b></h3>', 'Hallo', 'Hallo', true);
    expect(textStateAt(el, range.startContainer)).toEqual({ block: 'H3', align: 'center', sizeIndex: 5, bold: true, italic: false, underline: false });
  });

  it('Text direkt im Body gilt als Body Text mit mittlerer Größe', () => {
    const { el, range } = area('Hallo', 'Hallo', 'Hallo', true);
    expect(textStateAt(el, range.startContainer)).toMatchObject({ block: 'DIV', align: undefined, sizeIndex: 3 });
  });
});
