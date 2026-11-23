// Text-Werkzeuge der Toolbar (SHEF HTMLEditorPane.createToolbarComponents): Absatzformat, Schriftart,
// Schriftgröße, Schriftfarbe, Ausrichtung und Styles löschen. Fett, kursiv, unterstrichen stehen in textinput.ts.
//
// Das HTML bleibt bei dem, was Swing schreibt (geprüft mit den SHEF-Aktionen auf einem JEditorPane):
// - Absatzformat (HTMLBlockAction.changeBlockType): jeder berührte Absatz bekommt das neue Tag, seine Attribute
//   bleiben. Text ohne Block (Swings p-implied) wird eingepackt. Vorformatiert fasst den Leerraum zusammen.
// - Ausrichtung (HTMLAlignAction.alignElement): align-Attribut am Absatz. Text direkt im Body lässt das Original, wie
//   er ist; hier wird er in <div align> gepackt (Abweichung, siehe README).
// - Schriftgröße (HTMLFontSizeAction): Eintrag i ergibt <font size="i+1">, Schriftfarbe <font color>, Schriftart
//   <font face>; Sitka (der erste Eintrag) entfernt face (FontChangeHandler, HTMLUtils.setFontFamily(null)).
// - Styles löschen (ClearStylesAction): alle Zeichenformate der Auswahl fallen weg, auch Links.
// Chromes formatBlock, justify* und removeFormat passen dazu nicht (CSS statt align, Attribute gehen verloren, Links
// bleiben), deshalb sind diese drei hier selbst geschrieben. fontName, fontSize und foreColor liefern mit
// styleWithCSS=false dasselbe wie Swing.
import type { DiagramEditor } from '../core/editor.ts';
import { BLOCKS } from './textedit.ts';
import { locateArea, parentListItem } from '../core/areas.ts';
import { plainOffset, rangeAt } from './focus.ts';
import { applyFormat, selectedArea, toggleList, type TextInputHost } from './textinput.ts';

/** Absatzformate wie in HTMLEditorActionFactory.createBlockElementActionList, dahinter die Listenaktionen */
export const PARAGRAPH_TYPES: { tag: string; label: string; key?: string }[] = [
  // body_text fehlt in SHEFs deutschen Texten, das Original zeigt daher den englischen
  { tag: 'DIV', label: 'Body Text', key: 'KeyD' },
  { tag: 'P', label: 'Absatz', key: 'Enter' },
  { tag: 'BLOCKQUOTE', label: 'Blockquote', key: 'KeyQ' },
  { tag: 'PRE', label: 'Vorformatiert', key: 'KeyR' },
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ tag: `H${n}`, label: `Überschrift ${n}`, key: `Digit${n}` })),
  // im Original heißen beide „Listeneintrag“, die Combo zeigt keine Symbole
  { tag: 'UL', label: 'Listeneintrag (Aufzählung)' },
  { tag: 'OL', label: 'Listeneintrag (nummeriert)' },
];

/** FontFamily.ALL_FONTS: Anzeigename und face; Sitka ist die Standardschrift und wird nicht geschrieben */
export const FONT_FAMILIES: { label: string; face: string | null }[] = [
  { label: 'Sitka - Serif', face: null },
  { label: 'Roboto - Sans Serif', face: 'Roboto' },
  { label: 'Courier - Monospace', face: 'CourierPrime' },
];

/** HTMLFontSizeAction.SIZES (deutsch); Eintrag i schreibt <font size="i+1">, ohne Angabe gilt „Mittel“ */
export const FONT_SIZES = ['xx-Klein', 'x-Klein', 'Klein', 'Mittel', 'Groß', 'x-Groß', 'xx-Groß'];
const DEFAULT_SIZE_INDEX = 3;

export const ALIGNMENTS: { value: string; label: string; icon: string }[] = [
  { value: 'left', label: 'Linksbündig', icon: 'format_align_left' },
  { value: 'center', label: 'Zentriert', icon: 'format_align_center' },
  { value: 'right', label: 'Rechtsbündig', icon: 'format_align_right' },
  { value: 'justify', label: 'Blocksatz', icon: 'format_align_justify' },
];

/** Zeichenformate, die Styles löschen entfernt (alles, was Swing als Zeichenattribut führt) */
const CHARACTER_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'FONT', 'A', 'SPAN', 'SUB', 'SUP', 'BIG', 'SMALL', 'CODE', 'TT', 'KBD', 'SAMP', 'VAR', 'CITE', 'DFN']);

const isBlock = (n: Node | null): n is HTMLElement => n instanceof HTMLElement && BLOCKS.has(n.tagName);
const indexOf = (n: Node) => Array.prototype.indexOf.call(n.parentNode!.childNodes, n) as number;

/** Ein Absatz im Sinne von Swings getParagraphElement: ein Block ohne Block-Kinder oder ein Lauf von Inline-Knoten */
type Paragraph = { el: HTMLElement } | { parent: HTMLElement; nodes: Node[] };

/** Hat der Lauf Inhalt? Leerraum zwischen Blöcken (aus der Einrückung der Datei) ist kein Absatz */
const hasContent = (nodes: Node[]) => nodes.some((n) => (n instanceof Text ? n.data.trim() !== '' : true));

/** Berührt der Bereich [vor first, hinter last]? Grenzen zählen mit, so trifft auch eine Schreibmarke */
function touches(range: Range, first: Node, last: Node): boolean {
  return range.comparePoint(first.parentNode!, indexOf(first)) <= 0 && range.comparePoint(last.parentNode!, indexOf(last) + 1) >= 0;
}

/** Die Absätze, die der Bereich berührt, in Dokumentreihenfolge (changeBlockType: von selectionStart bis selectionEnd) */
export function paragraphsIn(root: HTMLElement, range: Range): Paragraph[] {
  const out: Paragraph[] = [];
  const visit = (container: HTMLElement): void => {
    const kids = Array.from(container.childNodes);
    if (container !== root && !kids.some(isBlock)) {
      if (touches(range, container, container)) out.push({ el: container });
      return;
    }
    let run: Node[] = [];
    const flush = () => {
      if (run.length && hasContent(run) && touches(range, run[0], run[run.length - 1])) out.push({ parent: container, nodes: run });
      run = [];
    };
    for (const k of kids) {
      if (isBlock(k)) {
        flush();
        // Tabellen und Listen im Text bleiben, wie sie sind (im Original eigene Bereiche)
        if (!['TABLE', 'UL', 'OL'].includes(k.tagName)) visit(k);
      } else run.push(k);
    }
    flush();
  };
  visit(root);
  return out;
}

/** Absatz-Element an der Position (innerster Block innerhalb der Area), undefined direkt im Body */
function blockAt(root: HTMLElement, node: Node): HTMLElement | undefined {
  for (let n: Node | null = node; n && n !== root; n = n.parentNode) if (isBlock(n)) return n;
  return undefined;
}

/** Auswahl als Klartext-Positionen merken, damit sie das Umbauen des DOMs übersteht */
function saveSelection(el: HTMLElement, range: Range): { start: number; end: number; backward: boolean } {
  const sel = document.getSelection()!;
  const backward = sel.anchorNode === range.endContainer && sel.anchorOffset === range.endOffset && !range.collapsed;
  return { start: plainOffset(el, range.startContainer, range.startOffset), end: plainOffset(el, range.endContainer, range.endOffset), backward };
}

function restoreSelection(el: HTMLElement, s: { start: number; end: number; backward: boolean }): void {
  const a = rangeAt(el, s.start);
  const b = s.end === s.start ? a : rangeAt(el, s.end);
  const sel = document.getSelection()!;
  if (s.backward) sel.setBaseAndExtent(b.startContainer, b.startOffset, a.startContainer, a.startOffset);
  else sel.setBaseAndExtent(a.startContainer, a.startOffset, b.startContainer, b.startOffset);
}

/** Leerraum wie Swing zusammenfassen, wenn ein Absatz vorformatiert wird (getElementHTML schreibt ihn so) */
function collapseWhitespace(pre: HTMLElement): void {
  const texts: Text[] = [];
  const walker = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) texts.push(n as Text);
  for (const t of texts) t.data = t.data.replace(/[ \t\n\r\f]+/g, ' ');
  if (texts.length) {
    texts[0].data = texts[0].data.replace(/^ /, '');
    texts[texts.length - 1].data = texts[texts.length - 1].data.replace(/ $/, '');
  }
}

/** HTMLBlockAction.changeBlockType: die berührten Absätze bekommen das Tag, Attribute bleiben erhalten */
export function changeBlockType(root: HTMLElement, range: Range, tag: string): void {
  const saved = saveSelection(root, range);
  const paragraphs = paragraphsIn(root, range);
  // leere Area: Swing hat auch hier einen (impliziten) Absatz
  if (paragraphs.length === 0 && !hasContent(Array.from(root.childNodes))) paragraphs.push({ parent: root, nodes: Array.from(root.childNodes) });
  for (const p of paragraphs) {
    const block = document.createElement(tag);
    if ('el' in p) {
      for (const a of Array.from(p.el.attributes)) block.setAttribute(a.name, a.value);
      block.append(...Array.from(p.el.childNodes));
      p.el.replaceWith(block);
    } else {
      if (p.nodes.length) p.nodes[0].parentNode!.insertBefore(block, p.nodes[0]);
      else p.parent.append(block);
      block.append(...p.nodes);
    }
    if (tag === 'PRE') collapseWhitespace(block);
    // ein leerer Absatz braucht ein <br>, sonst hat er keine Zeile (cleanHtml entfernt es wieder)
    if (block.textContent === '' && !block.querySelector('br, img')) block.append(document.createElement('br'));
  }
  restoreSelection(root, saved);
}

/**
 * HTMLAlignAction.alignElement: align am Absatz. Text direkt im Body (Swings p-implied unter body) lässt das Original
 * unverändert; hier wird er wie die Zweigköpfe (HTMLEditorPane.formatInitialText) in <div align> gepackt (Markus).
 */
export function alignParagraphs(root: HTMLElement, range: Range, align: string): void {
  const saved = saveSelection(root, range);
  for (const p of paragraphsIn(root, range)) {
    if ('el' in p) p.el.setAttribute('align', align);
    else if (p.parent === root) {
      const div = document.createElement('div');
      div.setAttribute('align', align);
      p.nodes[0].parentNode!.insertBefore(div, p.nodes[0]);
      div.append(...p.nodes);
    } else if (!['PRE', 'DD'].includes(p.parent.tagName)) p.parent.setAttribute('align', align);
  }
  restoreSelection(root, saved);
}

/** Inline-Vorfahren an der Position teilen, bis die Grenze direkt in einem Block oder der Area liegt */
function splitInlineAt(root: HTMLElement, node: Node, offset: number): Comment {
  let parent: Node;
  let index: number;
  if (node instanceof Text) {
    parent = node.parentNode!;
    if (offset <= 0) index = indexOf(node);
    else if (offset >= node.data.length) index = indexOf(node) + 1;
    else index = indexOf(node.splitText(offset));
  } else {
    parent = node;
    index = offset;
  }
  while (parent !== root && !isBlock(parent)) {
    const el = parent as HTMLElement;
    if (index > 0 && index < el.childNodes.length) {
      const tail = el.cloneNode(false) as HTMLElement;
      tail.append(...Array.from(el.childNodes).slice(index));
      el.after(tail);
      index = indexOf(el) + 1;
    } else index = indexOf(el) + (index > 0 ? 1 : 0);
    parent = el.parentNode!;
  }
  const mark = document.createComment('');
  parent.insertBefore(mark, parent.childNodes[index] ?? null);
  return mark;
}

/**
 * ClearStylesAction: alle Zeichenformate der Auswahl entfernen, auch Links. Änderungsmarkierungen und Streichungen
 * der Änderungsverfolgung bleiben (im Original gehen sie dabei verloren).
 */
export function clearStyles(root: HTMLElement, range: Range): void {
  if (range.collapsed) return;
  const saved = saveSelection(root, range);
  const endMark = splitInlineAt(root, range.endContainer, range.endOffset);
  const startMark = splitInlineAt(root, range.startContainer, range.startOffset);
  const inner = document.createRange();
  inner.setStartAfter(startMark);
  inner.setEndBefore(endMark);
  const contained = (e: Element) => inner.comparePoint(e.parentNode!, indexOf(e)) === 0 && inner.comparePoint(e.parentNode!, indexOf(e) + 1) === 0;
  const doomed = Array.from(root.querySelectorAll('*')).filter(
    (e) => CHARACTER_TAGS.has(e.tagName) && !Array.from(e.classList).some((c) => c.startsWith('sm-')) && contained(e),
  );
  for (const e of doomed.reverse()) e.replaceWith(...Array.from(e.childNodes));
  startMark.remove();
  endMark.remove();
  root.normalize();
  restoreSelection(root, saved);
}

/** Schriftart setzen (HTMLUtils.setFontFamily); null entfernt face, wie die Auswahl von Sitka */
export function setFontFamily(root: HTMLElement, face: string | null): void {
  document.execCommand('styleWithCSS', false, 'false');
  if (face) {
    document.execCommand('fontName', false, face);
    return;
  }
  // Chrome schiebt dabei die Schriften der Vorfahren nach unten; die Markierung wird danach entfernt
  document.execCommand('fontName', false, SITKA_FACE);
  for (const f of Array.from(root.querySelectorAll(`font[face="${SITKA_FACE}"]`))) unsetFace(f);
}

/** Der face-Name von Sitka (FontFamily.SITKA); im Text steht Sitka nie, es ist die Standardschrift */
export const SITKA_FACE = 'SitkaDisplay';

/** face entfernen; ein <font> ohne Attribute wird ausgepackt */
export function unsetFace(f: Element): void {
  f.removeAttribute('face');
  if (f.attributes.length === 0) f.replaceWith(...Array.from(f.childNodes));
}

/** Zustand der Knöpfe an der Schreibmarke (updateWysiwygContextState der SHEF-Aktionen) */
export interface TextState {
  /** Tag des Absatzformats, DIV auch für Text direkt im Body; undefined in anderen Blöcken (z. B. Listen) */
  block?: string;
  align?: string;
  sizeIndex: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export function textStateAt(root: HTMLElement, node: Node): TextState {
  const block = blockAt(root, node);
  const tag = block?.tagName ?? 'DIV';
  const known = ['DIV', 'P', 'PRE', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  const el = node instanceof Element ? node : node.parentElement;
  const sized = el?.closest('font[size]');
  const size = sized && root.contains(sized) ? parseInt(sized.getAttribute('size')!, 10) : NaN;
  const has = (sel: string) => {
    const e = el?.closest(sel);
    return e != null && root.contains(e) && e !== root;
  };
  return {
    block: known.includes(tag) ? tag : undefined,
    align: block?.getAttribute('align') ?? undefined,
    sizeIndex: size >= 1 && size <= 7 ? size - 1 : DEFAULT_SIZE_INDEX,
    bold: has('b, strong'),
    italic: has('i, em'),
    underline: has('u'),
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Toolbar

export interface TextGroupHost extends TextInputHost {
  button(icon: string, title: string, onClick: () => void): HTMLButtonElement;
}

export interface TextGroup {
  /** Absatz- und Schriftauswahl, Größe, Farbe; die Knöpfe für fett/kursiv/unterstrichen fügt main.ts dazwischen */
  head: HTMLElement[];
  /** Ausrichtungen und Styles löschen */
  tail: HTMLElement[];
  /** Zustand der Knöpfe aus der Schreibmarke übernehmen */
  update(): void;
}

/** Popup-Menü unter einem Knopf; checked markiert den aktuellen Eintrag (Radio-Einträge wie im Original) */
function menu(anchor: HTMLElement, items: { label: string; checked?: boolean; onChoose: () => void }[]): void {
  closeMenu?.();
  const popup = document.createElement('div');
  popup.className = 'app-menu';
  // schließt bei Escape und bei einem Klick daneben; der Klick, der das Menü öffnet, ist dann schon vorbei
  const outside = (e: MouseEvent) => {
    if (!popup.contains(e.target as Node)) dismiss();
  };
  const escape = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    dismiss();
  };
  const dismiss = () => {
    popup.remove();
    document.removeEventListener('mousedown', outside, true);
    document.removeEventListener('keydown', escape, true);
    closeMenu = undefined;
  };
  for (const it of items) {
    const b = document.createElement('button');
    b.className = 'app-menu-item';
    if (it.checked) b.classList.add('app-menu-checked');
    b.textContent = it.label;
    b.addEventListener('mousedown', (e) => e.preventDefault()); // Auswahl im Text bleibt
    b.addEventListener('click', () => {
      dismiss();
      it.onChoose();
    });
    popup.append(b);
  }
  const r = anchor.getBoundingClientRect();
  popup.style.left = `${r.left + window.scrollX}px`;
  popup.style.top = `${r.bottom + window.scrollY}px`;
  document.body.append(popup);
  document.addEventListener('mousedown', outside, true);
  document.addEventListener('keydown', escape, true);
  closeMenu = dismiss;
}

/** Schließt das offene Menü */
let closeMenu: (() => void) | undefined;

/** Knopf, der wie eine Combo aussieht: zeigt einen Text und öffnet ein Menü */
function combo(title: string, width: number, open: (anchor: HTMLButtonElement) => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'app-combo';
  b.title = title;
  b.style.width = `${width}px`;
  b.addEventListener('mousedown', (e) => e.preventDefault());
  b.addEventListener('click', () => open(b));
  return b;
}

export function createTextGroup(host: TextGroupHost, inline: Record<'bold' | 'italic' | 'underline', HTMLButtonElement>): TextGroup {
  const editor = (): DiagramEditor | undefined => host.editor();
  let state: TextState | undefined;

  const setParagraph = (tag: string): void => {
    if (tag === 'UL' || tag === 'OL') toggleList(host, tag === 'OL');
    else applyFormat(editor(), (el, range) => changeBlockType(el, range, tag));
    update();
  };

  // Absatzformat: die Combo folgt der Schreibmarke (propertyChange „selected“ der Block-Aktionen)
  const paragraph = combo('Absatzformat', 120, (anchor) =>
    menu(anchor, PARAGRAPH_TYPES.map((p) => ({ label: p.label, checked: p.tag === state?.block, onChoose: () => setParagraph(p.tag) }))),
  );
  paragraph.dataset.name = 'paragraph';

  // Schriftart: die Combo zeigt die zuletzt gewählte Schrift, sie folgt der Schreibmarke nicht (wie im Original)
  let font = FONT_FAMILIES[0];
  const fontCombo = combo('Schriftart', 150, (anchor) =>
    menu(
      anchor,
      FONT_FAMILIES.map((f) => ({
        label: f.label,
        checked: f === font,
        onChoose: () => {
          font = f;
          fontCombo.textContent = f.label;
          applyFormat(editor(), (el) => setFontFamily(el, f.face));
        },
      })),
    ),
  );
  fontCombo.dataset.name = 'font';
  fontCombo.textContent = font.label;

  const sizeBtn = host.button('material/format_size', 'Schriftgröße', () =>
    menu(
      sizeBtn,
      FONT_SIZES.map((label, i) => ({
        label,
        checked: i === state?.sizeIndex,
        onChoose: () =>
          applyFormat(editor(), () => {
            document.execCommand('styleWithCSS', false, 'false');
            document.execCommand('fontSize', false, String(i + 1));
          }),
      })),
    ),
  );

  // Farbe...: JColorChooser startet mit Schwarz
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.className = 'app-color-input';
  colorInput.tabIndex = -1;
  let colorTarget: { el: HTMLElement; range: Range } | undefined;
  const colorBtn = host.button('material/format_color_text', 'Farbe...', () => {
    colorTarget = selectedArea();
    if (!colorTarget) return;
    colorTarget = { el: colorTarget.el, range: colorTarget.range.cloneRange() };
    colorInput.value = '#000000';
    try {
      colorInput.showPicker();
    } catch {
      colorInput.click();
    }
  });
  colorInput.addEventListener('change', () => {
    const t = colorTarget;
    colorTarget = undefined;
    if (!t || !t.el.isConnected) return;
    t.el.focus({ preventScroll: true });
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(t.range);
    applyFormat(editor(), () => {
      document.execCommand('styleWithCSS', false, 'false');
      document.execCommand('foreColor', false, colorInput.value);
    });
  });
  // außerhalb des Knopfs, sonst löst der Klick auf das Feld den Knopf erneut aus
  document.body.append(colorInput);

  const alignBtns = ALIGNMENTS.map((a) => {
    const b = host.button(`material/${a.icon}`, a.label, () => {
      applyFormat(editor(), (el, range) => alignParagraphs(el, range, a.value));
      update();
    });
    b.dataset.align = a.value;
    return b;
  });

  // Styles löschen steht im Original nur im Menü Format (Strg+Umschalt+Y)
  const clearBtn = host.button('material/format_clear', 'Styles löschen (Strg+Umschalt+Y)', () => clear());
  const clear = () => {
    applyFormat(editor(), (el, range) => clearStyles(el, range));
    update();
  };

  function update(): void {
    const at = selectedArea();
    state = at ? textStateAt(at.el, at.range.startContainer) : undefined;
    // im Listenpunkt zeigt die Combo den Listeneintrag (im Original bleibt die Wahl stehen, weil die Listenaktionen
    // keinen eigenen Zustand haben und sich der der Block-Aktionen dabei nicht ändert)
    // (erst bei einer Auswahl nach dem Editor fragen: beim Aufbau der Toolbar gibt es main.ts' doc noch nicht)
    const d = state && at ? editor()?.diagram : undefined;
    if (state && at && d) {
      const li = parentListItem(d, locateArea(d, at.el.dataset.path!).containerPath);
      if (li) state.block = li.item.ordered ? 'OL' : 'UL';
    }
    // die Combo behält ihren Eintrag, wenn keiner passt (setSelected wird dann für keinen gerufen)
    if (state?.block) paragraph.textContent = PARAGRAPH_TYPES.find((p) => p.tag === state!.block)!.label;
    else if (!paragraph.textContent) paragraph.textContent = PARAGRAPH_TYPES[0].label;
    const toggle = (b: HTMLButtonElement, on: boolean) => {
      b.classList.toggle('app-toggle-on', on);
      b.setAttribute('aria-pressed', String(on));
    };
    for (const b of alignBtns) toggle(b, state?.align === b.dataset.align);
    // HTMLInlineAction: Umschaltknöpfe mit dem Zustand an der Schreibmarke
    toggle(inline.bold, state?.bold ?? false);
    toggle(inline.italic, state?.italic ?? false);
    toggle(inline.underline, state?.underline ?? false);
  }

  // Tastenkürzel der Format-Menüs: Alt+D, Alt+Enter, Alt+1–6, Alt+R, Alt+Q und Strg+Umschalt+Y
  window.addEventListener('keydown', (e) => {
    if (!selectedArea() || e.isComposing) return;
    if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      const p = PARAGRAPH_TYPES.find((t) => t.key === e.code);
      if (!p) return;
      e.preventDefault();
      setParagraph(p.tag);
    } else if (e.ctrlKey && e.shiftKey && !e.altKey && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      clear();
    }
  });

  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      update();
    });
  };
  // auch nach Eingaben: Strg+B usw. ändern die Auswahl nicht
  document.addEventListener('selectionchange', schedule);
  document.addEventListener('input', schedule);
  update();

  return { head: [paragraph, fontCombo, sizeBtn, colorBtn], tail: [...alignBtns, clearBtn], update };
}
