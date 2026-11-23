import { describe, expect, it } from 'vitest';
import { findNeighbour, type Box } from '../src/ui/focusmove.ts';

const c = (name: string, x: number, y: number, width: number, height: number) => ({ name, box: { x, y, width, height } as Box });

describe('findNeighbour (EditAreaNeighbourFinder)', () => {
  const source: Box = { x: 100, y: 100, width: 200, height: 20 };

  it('nimmt den senkrecht nächsten der überlappenden Kandidaten', () => {
    const r = findNeighbour(source, [c('weit', 100, 200, 200, 20), c('nah', 100, 130, 200, 20), c('oben', 100, 50, 200, 20)], 150, 'down');
    expect(r?.name).toBe('nah');
  });

  it('gleich nahe Zweige: der waagrecht nächste zur gewünschten x-Position', () => {
    const cands = [c('ja', 100, 122, 100, 20), c('nein', 200, 123, 100, 20)];
    expect(findNeighbour(source, cands, 120, 'down')?.name).toBe('ja');
    expect(findNeighbour(source, cands, 260, 'down')?.name).toBe('nein');
  });

  it('gemeinsame Rahmenlinien zählen noch als darunter', () => {
    expect(findNeighbour(source, [c('grenze', 100, 117, 200, 20)], 150, 'down')?.name).toBe('grenze');
    expect(findNeighbour(source, [c('daneben', 100, 110, 200, 20)], 150, 'down')).toBeUndefined();
  });

  it('ohne Überlappung gewinnt der kleinste Abstand', () => {
    const r = findNeighbour(source, [c('rechts', 400, 130, 50, 20), c('links', 0, 400, 50, 20)], 150, 'down');
    expect(r?.name).toBe('rechts');
  });

  it('nach oben', () => {
    const r = findNeighbour(source, [c('unten', 100, 130, 200, 20), c('oben', 100, 60, 200, 38)], 150, 'up');
    expect(r?.name).toBe('oben');
  });

  it('nichts in der Richtung', () => {
    expect(findNeighbour(source, [c('oben', 100, 60, 200, 20)], 150, 'down')).toBeUndefined();
  });
});
