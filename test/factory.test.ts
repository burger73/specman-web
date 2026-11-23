import { describe, expect, it } from 'vitest';
import { content, htmlToPlain, newDiagram } from '../src/core/factory.ts';

describe('Fabrik', () => {
  it('neues Diagramm wie Specman.initEmptyDiagram', () => {
    const d = newDiagram();
    expect(d).toMatchObject({ name: 'frame0', width: 700, zoomFactor: 100, changeModeEnabled: false });
    expect(d.mainSequence.steps).toEqual([]);
  });

  it('Textfassung ohne Tags und mit aufgelösten Entities', () => {
    expect(htmlToPlain('<b>Subsequenz 1</b> &amp; &lt;x&gt; &#228;&#xE4;')).toBe('Subsequenz 1 & <x> ää');
    expect(content('Neuer Schritt 2').areas[0]).toEqual({ kind: 'text', text: 'Neuer Schritt 2', plainText: 'Neuer Schritt 2', markups: [] });
  });
});
