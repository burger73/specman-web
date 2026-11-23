// Schrittverweise im Text nach dem Umnummerieren nachziehen, Port von ModelStepnumberRewriter_V002.
// Ein Verweis ist ein Steplink-Markup über der Schrittnummer im Klartext. Verweise auf entfernte Schritte
// bekommen wie im Original ein „?“ angehängt (StepnumberLink.STEPNUMBER_DEFECT_MARK).
import type { Diagram, EditorContent, Markup, StepSequence, TextEditArea } from './model.ts';
import { childSequences } from './model.ts';

export const STEPNUMBER_DEFECT_MARK = '?';

const isSteplink = (m: Markup) => m.type === 'Steplink' || m.type === 'ChangedSteplink';

/** Schritt-ID → Nummer aller Schritte einschließlich der Catch-Sequenzen */
export function stepNumbersById(d: Diagram): Map<string, string> {
  const map = new Map<string, string>();
  const walk = (seq: StepSequence) => {
    for (const s of seq.steps) {
      map.set(s.id, s.stepNumber);
      childSequences(s).forEach(walk);
    }
    seq.catchArea?.catchSequences.forEach(walk);
  };
  walk(d.mainSequence);
  return map;
}

/** Zuordnung alte → neue Nummer aus den Nummern vor und nach einer Änderung; entfernte Schritte werden defekt */
export function numberMapping(before: Map<string, string>, after: Map<string, string>): Map<string, string> {
  const mapping = new Map<string, string>();
  for (const [id, old] of before) mapping.set(old, after.get(id) ?? old + STEPNUMBER_DEFECT_MARK);
  return mapping;
}

/** Alle Schrittverweise im Diagramm umschreiben */
export function rewriteSteplinks(d: Diagram, mapping: Map<string, string>): void {
  forEachContent(d, (c) => rewriteContent(c, mapping));
}

/** Gibt es Verweise auf eine der Nummern? (Rückfrage vor dem Löschen, DeleteStepADBLOp.isDeletionAllowed) */
export function hasSteplinksTo(d: Diagram, numbers: Set<string>): boolean {
  let found = false;
  forEachContent(d, (c) =>
    forEachText(c, (t) => {
      for (const m of t.markups) if (isSteplink(m) && numbers.has(t.plainText.substring(m.from, m.to + 1))) found = true;
    }),
  );
  return found;
}

function forEachContent(d: Diagram, fn: (c: EditorContent) => void): void {
  if (d.intro) fn(d.intro);
  if (d.outro) fn(d.outro);
  const walk = (seq: StepSequence) => {
    if ('heading' in seq) fn((seq as StepSequence & { heading: EditorContent }).heading);
    for (const s of seq.steps) {
      fn(s.content);
      childSequences(s).forEach(walk);
    }
    for (const c of seq.catchArea?.catchSequences ?? []) {
      for (const cc of c.coCatches) fn(cc.heading);
      walk(c);
    }
  };
  walk(d.mainSequence);
}

function forEachText(c: EditorContent, fn: (t: TextEditArea) => void): void {
  for (const a of c.areas) {
    if (a.kind === 'text') fn(a);
    else if (a.kind === 'listItem') forEachText(a.content, fn);
    else if (a.kind === 'table') for (const row of a.cells) for (const cell of row) forEachText(cell, fn);
  }
}

function rewriteContent(c: EditorContent, mapping: Map<string, string>): void {
  forEachText(c, (t) => {
    if (!t.markups.some(isSteplink)) return;
    // von hinten, damit Längenänderungen die vorderen Positionen nicht verschieben
    const order = t.markups.map((_, i) => i).sort((a, b) => t.markups[b].from - t.markups[a].from);
    for (const i of order) {
      const m = t.markups[i];
      if (!isSteplink(m)) continue;
      const current = t.plainText.substring(m.from, m.to + 1);
      const next = mapping.get(current);
      if (next === undefined || next === current) continue;
      replaceInText(t, m.from, m.to, next);
      const delta = next.length - current.length;
      m.to = m.from + next.length - 1;
      for (const other of t.markups) if (other !== m && other.from > m.from) {
        other.from += delta;
        other.to += delta;
      }
    }
  });
}

/** Klartext-Zeichen from..to (inklusiv) durch text ersetzen, im Klartext und an der passenden Stelle im HTML */
function replaceInText(t: TextEditArea, from: number, to: number, text: string): void {
  const spans = mapPlainToHtml(t.text, t.plainText);
  const start = spans[from];
  const end = spans[to];
  if (start && end) t.text = t.text.substring(0, start.start) + escapeHtml(text) + t.text.substring(end.end);
  t.plainText = t.plainText.substring(0, from) + text + t.plainText.substring(to + 1);
}

const escapeHtml = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/**
 * Für jedes Klartext-Zeichen die Stelle im HTML-Quelltext (wie mapPlainToDom in der UI, aber ohne DOM):
 * Textzeichen außerhalb der Tags werden gierig zugeordnet, Leerraum darf auf beiden Seiten fehlen.
 */
export function mapPlainToHtml(html: string, plain: string): ({ start: number; end: number } | undefined)[] {
  const chars: { c: string; start: number; end: number }[] = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const close = html.indexOf('>', i);
      i = close < 0 ? html.length : close + 1;
      continue;
    }
    if (html[i] === '&') {
      const m = /^&(#\d+|#x[0-9a-f]+|\w+);/i.exec(html.substring(i, i + 12));
      if (m) {
        const e = m[1];
        const c = e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : (ENTITIES[e] ?? m[0]);
        chars.push({ c, start: i, end: i + m[0].length });
        i += m[0].length;
        continue;
      }
    }
    chars.push({ c: html[i], start: i, end: i + 1 });
    i++;
  }
  const isSpace = (c: string) => /\s/.test(c) && c !== ' ';
  const result: ({ start: number; end: number } | undefined)[] = new Array(plain.length);
  let j = 0;
  for (let k = 0; k < plain.length; k++) {
    const c = plain[k];
    if (isSpace(c)) {
      if (j < chars.length && isSpace(chars[j].c)) {
        result[k] = chars[j];
        while (j < chars.length && isSpace(chars[j].c)) j++;
      }
      continue;
    }
    while (j < chars.length && chars[j].c !== c) j++;
    if (j >= chars.length) break;
    result[k] = chars[j];
    j++;
  }
  return result;
}
