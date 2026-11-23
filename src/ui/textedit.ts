// Bearbeitete Text-Area (contenteditable) zurück ins Modell: HTML, Textfassung und Markups.
// Die Markups stecken während des Bearbeitens als Spans im DOM (markups.ts) und wandern so mit dem Text mit.
// Die Textfassung folgt Swings HTMLDocument: Absätze durch \n getrennt, Leerraum zusammengefasst.
import type { Markup, MarkupType } from '../core/model.ts';

const BLOCKS = new Set(['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'UL', 'OL', 'PRE', 'BLOCKQUOTE', 'TABLE', 'TR', 'CENTER']);

export interface TextAreaContent {
  text: string;
  plainText: string;
  markups: Markup[];
}

export function readTextArea(el: HTMLElement): TextAreaContent {
  const { plainText, markups } = plainAndMarkups(el);
  return { text: cleanHtml(el), plainText, markups };
}

/** Textfassung und Markup-Bereiche (to inklusiv) in einem Durchlauf */
function plainAndMarkups(root: HTMLElement): { plainText: string; markups: Markup[] } {
  let out = '';
  let pendingSpace = false;
  const ranges = new Map<string, { from: number; to: number; type: MarkupType; changeset?: string }>();

  const newline = () => {
    pendingSpace = false;
    if (out.length > 0 && !out.endsWith('\n')) out += '\n';
  };

  const walk = (node: Node, markup: HTMLElement | undefined): void => {
    if (node instanceof Text) {
      const pre = node.parentElement?.closest('pre') != null;
      for (const c of node.data) {
        if (!pre && /\s/.test(c) && c !== ' ') {
          pendingSpace = true;
          continue;
        }
        if (pendingSpace && out.length > 0 && !out.endsWith('\n')) out += ' ';
        pendingSpace = false;
        if (markup) {
          const key = markup.dataset.markup!;
          const r = ranges.get(key);
          if (r) r.to = out.length;
          else ranges.set(key, { from: out.length, to: out.length, type: markup.dataset.type as MarkupType, changeset: markup.dataset.changeset });
        }
        out += c;
      }
      return;
    }
    if (!(node instanceof HTMLElement)) return;
    if (node.tagName === 'BR') {
      // ein <br> als einziger Inhalt eines Absatzes hält nur die Zeile offen
      if (node.parentElement && node.parentElement !== root && node.parentElement.childNodes.length === 1) return;
      out += '\n';
      pendingSpace = false;
      return;
    }
    const block = BLOCKS.has(node.tagName);
    if (block) newline();
    // leerer Absatz (nur <br>) ergibt eine Leerzeile
    if (block && node.textContent === '' && node.querySelector('br')) {
      out += '\n';
      return;
    }
    const m = node.classList.contains('sm-markup') ? node : markup;
    for (const child of Array.from(node.childNodes)) walk(child, m);
    if (block) newline();
  };

  for (const child of Array.from(root.childNodes)) walk(child, undefined);
  const plainText = out.replace(/\n+$/, '');
  const markups: Markup[] = [];
  for (const r of ranges.values()) {
    if (r.from >= plainText.length) continue;
    const m: Markup = { from: r.from, to: Math.min(r.to, plainText.length - 1), type: r.type };
    if (r.changeset !== undefined) m.changeset = r.changeset;
    markups.push(m);
  }
  markups.sort((a, b) => a.from - b.from);
  return { plainText, markups };
}

/**
 * Styles, die Chrome beim Zusammenführen von Absätzen als berechnete Werte einfügt. Farben bleiben, die nutzt
 * auch Swing (z. B. background-color in den Dateien des Originals).
 */
const BROWSER_STYLE = /^(font-family|font-size|font-weight|font-style|line-height|letter-spacing|word-spacing|white-space|text-indent|text-transform|orphans|widows|-webkit-[\w-]+|text-decoration-[\w-]+|font-variant[\w-]*)\s*:/;

/** HTML für das Modell: Darstellungs-Spans auspacken, Browser-Artefakte entfernen */
export function cleanHtml(el: HTMLElement): string {
  const root = el.cloneNode(true) as HTMLElement;
  for (const s of Array.from(root.querySelectorAll('span.sm-markup, span.sm-deleted-text'))) s.replaceWith(...Array.from(s.childNodes));
  for (const e of Array.from(root.querySelectorAll('*'))) normalizeElement(e as HTMLElement);
  // vom Sanitizer eingefügt: <br> in leeren Absätzen
  for (const br of Array.from(root.querySelectorAll('div > br:only-child, p > br:only-child'))) {
    if (br.parentElement!.textContent === '') br.remove();
  }
  root.normalize();
  return root.innerHTML;
}

function normalizeElement(e: HTMLElement): void {
  // vom Sanitizer gesetzt (Links öffnen in neuem Tab)
  if (e.tagName === 'A') {
    e.removeAttribute('target');
    e.removeAttribute('rel');
  }
  const style = e.getAttribute('style');
  if (style !== null) {
    const kept = style
      .split(';')
      .map((d) => d.trim())
      .filter((d) => d && !BROWSER_STYLE.test(d));
    if (kept.length) e.setAttribute('style', kept.join('; '));
    else e.removeAttribute('style');
  }
  const rename = e.tagName === 'STRONG' ? 'b' : e.tagName === 'EM' ? 'i' : undefined;
  if (rename) {
    const r = document.createElement(rename);
    r.append(...Array.from(e.childNodes));
    e.replaceWith(r);
    return;
  }
  // Spans ohne Attribute erzeugt Chrome beim Zusammenführen von Absätzen
  if (e.tagName === 'SPAN' && e.attributes.length === 0) e.replaceWith(...Array.from(e.childNodes));
}
