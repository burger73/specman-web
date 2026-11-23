// Markups (Zeichenbereiche im Plaintext) auf den gerenderten HTML-Text übertragen.
// Im Original: MarkupBackgroundStyleInitializer, dort ist `to` inklusiv (Länge = to - from + 1).
// Der Plaintext stammt aus Swings HTMLDocument und unterscheidet sich vom DOM-Text nur in Leerraum.
// Daher werden die Zeichen gierig einander zugeordnet, Leerraum darf auf beiden Seiten fehlen.
import type { Markup } from '../core/model.ts';
import { plainAndMarkups } from './textedit.ts';

interface Pos {
  node: Text;
  offset: number;
}

const isSpace = (c: string) => /\s/.test(c);

export function applyMarkups(root: HTMLElement, plain: string, markups: Markup[], background: (m: Markup) => string): void {
  markBreaks(root, plain, markups, background);
  const positions = mapPlainToDom(root, plain);
  // von hinten nach vorn, damit das Aufteilen der Textknoten frühere Positionen nicht verschiebt
  const sorted = markups.map((m, index) => ({ m, index })).sort((a, b) => b.m.from - a.m.from);
  for (const { m, index } of sorted) {
    let start: Pos | undefined;
    let end: Pos | undefined;
    for (let i = m.from; i <= m.to && i < positions.length; i++) {
      const p = positions[i];
      if (!p) continue;
      start ??= p;
      end = p;
    }
    if (!start || !end) continue;
    wrap(start, { node: end.node, offset: end.offset + 1 }, background(m), m, index);
  }
}

function textNodes(root: Node): Text[] {
  const out: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n as Text);
  return out;
}

/** Für jeden Index im Plaintext die DOM-Position des Zeichens, oder undefined bei Leerraum ohne Gegenstück */
export function mapPlainToDom(root: Node, plain: string): (Pos | undefined)[] {
  const chars: Pos[] = [];
  for (const node of textNodes(root)) for (let i = 0; i < node.data.length; i++) chars.push({ node, offset: i });
  const result: (Pos | undefined)[] = new Array(plain.length);
  let j = 0;
  for (let i = 0; i < plain.length; i++) {
    const c = plain[i];
    if (isSpace(c)) {
      // Leerraum im DOM überspringen und dem ersten zuordnen
      if (j < chars.length && isSpace(chars[j].node.data[chars[j].offset])) {
        result[i] = chars[j];
        while (j < chars.length && isSpace(chars[j].node.data[chars[j].offset])) j++;
      }
      continue;
    }
    while (j < chars.length && chars[j].node.data[chars[j].offset] !== c) j++;
    if (j >= chars.length) break;
    result[i] = chars[j];
    j++;
  }
  return result;
}

/** Alle Textstücke zwischen start und end in Spans mit Hintergrundfarbe einpacken; index = Nummer des Markups in der Area */
function wrap(start: Pos, end: Pos, color: string, m: Markup, index: number): void {
  const range = document.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset);
  const common = range.commonAncestorContainer;
  // liegt alles in einem Textknoten, ist er selbst der gemeinsame Vorfahr; der TreeWalker liefert seine Wurzel nicht
  const nodes = common instanceof Text ? [common] : textNodes(common).filter((n) => range.intersectsNode(n));
  for (const node of nodes) {
    const from = node === start.node ? start.offset : 0;
    const to = node === end.node ? end.offset : node.data.length;
    if (to <= from) continue;
    if (to < node.data.length) node.splitText(to); // node enthält jetzt [0, to)
    const target = from > 0 ? node.splitText(from) : node; // target enthält [from, to)
    const s = document.createElement('span');
    s.className = `sm-markup sm-markup-${m.type}`;
    // beim Bearbeiten werden die Markups aus diesen Spans zurückgewonnen (textedit.ts)
    s.dataset.markup = String(index);
    s.dataset.type = m.type;
    if (m.changeset !== undefined) s.dataset.changeset = m.changeset;
    s.style.backgroundColor = color;
    target.replaceWith(s);
    s.append(target);
  }
}

const STRUCK = 'strike, s, del';

/**
 * Änderungs-Markups über Zeilenumbrüchen: Das Element nach der Grenze bekommt data-break (changed, oder deleted, wenn
 * das Zeichen davor gestrichen ist) und data-break-cs. Der k-te Umbruch im Plaintext gehört zum k-ten im DOM.
 */
function markBreaks(root: HTMLElement, plain: string, markups: Markup[], background: (m: Markup) => string): void {
  const changed = markups.filter((m) => m.type === 'Changed' && plain.substring(m.from, m.to + 1).includes('\n'));
  if (changed.length === 0) return;
  const owners = plainAndMarkups(root).breakOwners;
  const newlines: number[] = [];
  for (let i = 0; i < plain.length; i++) if (plain[i] === '\n') newlines.push(i);
  if (newlines.length !== owners.length) return;
  const positions = mapPlainToDom(root, plain);
  for (const m of changed) {
    for (let i = m.from; i <= m.to; i++) {
      if (plain[i] !== '\n') continue;
      const owner = owners[newlines.indexOf(i)];
      if (!owner || !m.changeset) continue;
      const before = positions[i - 1];
      const struck = before !== undefined && before.node.parentElement?.closest(STRUCK) != null && root.contains(before.node.parentElement.closest(STRUCK));
      setBreak(owner, struck ? 'deleted' : 'changed', m.changeset, background(m));
    }
  }
}

/** Absatzgrenze vor el als hinzugefügt oder gelöscht markieren; color ist die Farbe des Change Sets */
export function setBreak(el: HTMLElement, kind: 'changed' | 'deleted', cs: string, color: string): void {
  el.dataset.break = kind;
  el.dataset.breakCs = cs;
  el.style.setProperty('--sm-break-color', color);
}
