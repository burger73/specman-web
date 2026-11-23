// Markups (Zeichenbereiche im Plaintext) auf den gerenderten HTML-Text übertragen.
// Im Original: MarkupBackgroundStyleInitializer, dort ist `to` inklusiv (Länge = to - from + 1).
// Der Plaintext stammt aus Swings HTMLDocument und unterscheidet sich vom DOM-Text nur in Leerraum.
// Daher werden die Zeichen gierig einander zugeordnet, Leerraum darf auf beiden Seiten fehlen.
import type { Markup } from '../core/model.ts';

interface Pos {
  node: Text;
  offset: number;
}

const isSpace = (c: string) => /\s/.test(c);

export function applyMarkups(root: HTMLElement, plain: string, markups: Markup[], background: (m: Markup) => string): void {
  const positions = mapPlainToDom(root, plain);
  // von hinten nach vorn, damit das Aufteilen der Textknoten frühere Positionen nicht verschiebt
  const sorted = [...markups].sort((a, b) => b.from - a.from);
  for (const m of sorted) {
    let start: Pos | undefined;
    let end: Pos | undefined;
    for (let i = m.from; i <= m.to && i < positions.length; i++) {
      const p = positions[i];
      if (!p) continue;
      start ??= p;
      end = p;
    }
    if (!start || !end) continue;
    wrap(start, { node: end.node, offset: end.offset + 1 }, background(m), m);
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

/** Alle Textstücke zwischen start und end in Spans mit Hintergrundfarbe einpacken */
function wrap(start: Pos, end: Pos, color: string, m: Markup): void {
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
    s.style.backgroundColor = color;
    target.replaceWith(s);
    s.append(target);
  }
}
