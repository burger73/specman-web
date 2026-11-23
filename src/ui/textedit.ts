// Bearbeitete Text-Area (contenteditable) zurück ins Modell: HTML, Textfassung und Markups.
// Die Markups stecken während des Bearbeitens als Spans im DOM (markups.ts) und wandern so mit dem Text mit.
// Die Textfassung folgt Swings HTMLDocument: Absätze durch \n getrennt, Leerraum zusammengefasst.
import type { Markup, MarkupType } from '../core/model.ts';

export const BLOCKS = new Set(['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'UL', 'OL', 'PRE', 'BLOCKQUOTE', 'TABLE', 'TR', 'CENTER']);

export interface TextAreaContent {
  text: string;
  plainText: string;
  markups: Markup[];
}

export function readTextArea(el: HTMLElement): TextAreaContent {
  const { plainText, markups } = plainAndMarkups(el);
  return { text: cleanHtml(el), plainText, markups };
}

/** Absatzgrenze mit Änderungsmarkierung: Attribut am Element, das nach der Grenze beginnt (Block oder <br>) */
export const BREAK_ATTR = 'break';

/** Schlüssel einer markierten Absatzgrenze (data-break = changed | deleted, data-break-cs = Change Set) */
function breakKey(el: HTMLElement, meta: Map<string, { type: MarkupType; changeset?: string }>): string | undefined {
  const kind = el.dataset[BREAK_ATTR];
  const cs = el.dataset.breakCs;
  if (!kind || !cs) return undefined;
  const key = `b:${kind}:${cs}`;
  meta.set(key, { type: 'Changed', changeset: cs });
  return key;
}

/**
 * Textfassung und Markup-Bereiche (to inklusiv) in einem Durchlauf. Ein Markup ist ein zusammenhängender Lauf von
 * Zeichen mit demselben Markup-Span (data-markup); zusammengefasster Leerraum zwischen zwei Zeichen desselben Laufs
 * gehört dazu. Markierte Absatzgrenzen (siehe BREAK_ATTR) ergeben ein Changed-Markup über dem Zeilenumbruch, wie
 * im Original, wo der Umbruch ein Zeichen mit Hintergrundfarbe ist.
 * @returns zusätzlich je Zeilenumbruch der Fassung das Element, das ihn auslöst (Block-Anfang oder <br>), sonst null
 */
export function plainAndMarkups(root: HTMLElement): { plainText: string; markups: Markup[]; breakOwners: (HTMLElement | null)[] } {
  let out = '';
  let pendingSpace = false;
  /** je Zeichen: Schlüssel des Markups, undefined ohne, null für zusammengefassten Leerraum (neutral) */
  const keys: (string | null | undefined)[] = [];
  const meta = new Map<string, { type: MarkupType; changeset?: string }>();
  const owners: (HTMLElement | null)[] = [];

  /** Markup des ersten Zeichens im gerade zusammengefassten Leerraum, null ohne (dann neutral) */
  let pendingKey: string | null = null;
  const keyOf = (markup: HTMLElement): string => {
    const key = 'm:' + markup.dataset.markup!;
    meta.set(key, { type: markup.dataset.type as MarkupType, changeset: markup.dataset.changeset });
    return key;
  };
  const push = (c: string, key: string | null | undefined, owner: HTMLElement | null = null) => {
    out += c;
    keys.push(key);
    if (c === '\n') owners.push(owner);
  };
  const newline = (owner: HTMLElement | null) => {
    pendingSpace = false;
    if (out.length > 0 && !out.endsWith('\n')) push('\n', undefined, owner);
  };

  const walk = (node: Node, markup: HTMLElement | undefined): void => {
    if (node instanceof Text) {
      const pre = node.parentElement?.closest('pre') != null;
      for (const raw of node.data) {
        // wie Swings HTMLDocument: Leerraum-Folgen werden ein Leerzeichen, geschützte Leerzeichen bleiben einzeln
        if (!pre && /[ \t\n\r\f]/.test(raw)) {
          // vom zusammengefassten Leerraum zählt das erste Zeichen (dessen Markup gilt)
          if (!pendingSpace) pendingKey = markup ? keyOf(markup) : null;
          pendingSpace = true;
          continue;
        }
        const c = raw === '\u00a0' ? ' ' : raw;
        if (pendingSpace && out.length > 0 && !out.endsWith('\n')) push(' ', pendingKey);
        pendingSpace = false;
        push(c, markup ? keyOf(markup) : undefined);
      }
      return;
    }
    if (!(node instanceof HTMLElement)) return;
    if (node.tagName === 'BR') {
      // ein <br> als einziger Inhalt eines Absatzes hält nur die Zeile offen
      if (node.parentElement && node.parentElement !== root && node.parentElement.childNodes.length === 1) return;
      push('\n', breakKey(node, meta), node);
      pendingSpace = false;
      return;
    }
    const block = BLOCKS.has(node.tagName);
    if (block) {
      newline(node);
      // die Grenze vor dem Block gehört zum Block, auch wenn der Umbruch schon am Ende des vorigen entstand
      const bk = breakKey(node, meta);
      if (out.endsWith('\n')) {
        if (bk) keys[out.length - 1] = bk;
        owners[owners.length - 1] ??= node;
      }
    }
    // leerer Absatz (nur <br>) ergibt eine Leerzeile
    if (block && node.textContent === '' && node.querySelector('br')) {
      push('\n', undefined, node);
      return;
    }
    const m = node.classList.contains('sm-markup') ? node : markup;
    for (const child of Array.from(node.childNodes)) walk(child, m);
    if (block) newline(null);
  };

  for (const child of Array.from(root.childNodes)) walk(child, undefined);
  const plainText = out.replace(/\n+$/, '');
  // neutraler Leerraum gehört zum Lauf, wenn davor und danach derselbe Schlüssel steht
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== null) continue;
    let a = i - 1;
    while (a >= 0 && keys[a] === null) a--;
    let b = i + 1;
    while (b < keys.length && keys[b] === null) b++;
    keys[i] = a >= 0 && b < keys.length && keys[a] !== undefined && keys[a] === keys[b] ? keys[a] : undefined;
  }
  const markups: Markup[] = [];
  for (let i = 0; i < plainText.length; ) {
    const key = keys[i];
    let j = i + 1;
    while (j < plainText.length && keys[j] === key) j++;
    if (key) {
      const info = meta.get(key)!;
      const m: Markup = { from: i, to: j - 1, type: info.type };
      if (info.changeset !== undefined) m.changeset = info.changeset;
      markups.push(m);
    }
    i = j;
  }
  // abgeschnittene Umbrüche am Ende haben keinen Besitzer mehr
  owners.length = plainText.split('\n').length - 1;
  return { plainText, markups, breakOwners: owners };
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
  // markierte Absatzgrenzen stehen nur in den Markups, nicht im HTML
  for (const e of Array.from(root.querySelectorAll<HTMLElement>('[data-break]'))) {
    e.removeAttribute('data-break');
    e.removeAttribute('data-break-cs');
    e.style.removeProperty('--sm-break-color');
    if (e.getAttribute('style') === '') e.removeAttribute('style');
  }
  for (const e of Array.from(root.querySelectorAll('*'))) normalizeElement(e as HTMLElement);
  // vom Sanitizer eingefügt: <br> in leeren Absätzen
  for (const br of Array.from(root.querySelectorAll(EMPTY_BLOCKS.split(', ').map((b) => `${b} > br:only-child`).join(', ')))) {
    if (br.parentElement!.textContent === '') br.remove();
  }
  // leere Formatierungs-Hüllen, z. B. nach dem Teilen am Textende
  for (const e of Array.from(root.querySelectorAll('span, font, b, i, u, s, strike')).reverse()) {
    if (e.textContent === '' && !e.querySelector('br, img')) e.remove();
  }
  root.normalize();
  return root.innerHTML;
}

/** Blöcke, die leer ein <br> brauchen, um eine Zeile zu belegen (Sanitizer und Absatzformat setzen es) */
export const EMPTY_BLOCKS = 'div, p, h1, h2, h3, h4, h5, h6, pre, blockquote';

function normalizeElement(e: HTMLElement): void {
  // Sitka ist die Standardschrift, im Text steht sie nie (FontChangeHandler entfernt face)
  if (e.tagName === 'FONT' && e.getAttribute('face') === 'SitkaDisplay') {
    e.removeAttribute('face');
    if (e.attributes.length === 0) {
      e.replaceWith(...Array.from(e.childNodes));
      return;
    }
  }
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
