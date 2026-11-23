// Lesende Darstellung eines Diagramms als DOM, angelehnt an die Swing-Views von Specman
// (specman.view.*SchrittView, EditContainer, RoundedBorderDecorator, CatchBereich).
// Die Linien des Struktogramms entstehen wie im Original aus 2px-Lücken auf schwarzem Hintergrund.
import { changeSet, css, STEPNUMBER_LINK_COLOR } from '../core/changesets.ts';
import { queryAllSteps } from '../core/model.ts';
import type {
  BranchSequence,
  CaseStep,
  CatchArea,
  CatchSequence,
  ChangeInfo,
  Diagram,
  DoWhileStep,
  EditArea,
  EditorContent,
  IfElseStep,
  IfStep,
  ImageArea,
  MetaTag,
  MetaTagConfig,
  Markup,
  Step,
  StepSequence,
  SubsequenceStep,
  TableEditArea,
  TextEditArea,
  WhileStep,
} from '../core/model.ts';
import { childSequences } from '../core/model.ts';
import { indexPaths } from '../core/paths.ts';
import { applyMarkups } from './markups.ts';
import { sanitizeHtml } from './sanitize.ts';

/** AbstractSchrittView.TEXTEINRUECKUNG */
const TEXTEINRUECKUNG = 18;
/** Halbe Diagonale der Raute bei 100 % (IfElseSchrittView.spalteUmrechnen) */
const RAUTE = 20;

/** Schritt-ID → Schrittnummer, für die Nummern an catch und coCatch */
let stepNumbers = new Map<string, string>();
let tagConfigs = new Map<string, MetaTagConfig>();
/** Modellobjekt → Pfad (paths.ts), damit Edit-Areas nach dem Neuzeichnen wiedergefunden werden */
let paths = new Map<object, string>();

export interface RenderOptions {
  /** Klapp-Knopf eines strukturierten Schritts; ohne Handler klappt nur die Darstellung */
  onToggle?: (stepId: string) => void;
  /** Text-Areas bearbeitbar machen (contenteditable) */
  editable?: boolean;
}
let options: RenderOptions = {};

export function renderDiagram(d: Diagram, opts: RenderOptions = {}): HTMLElement {
  options = opts;
  paths = indexPaths(d);
  stepNumbers = new Map(queryAllSteps(d).map((s) => [s.id, s.stepNumber]));
  tagConfigs = new Map(d.metaTagConfigs.map((c) => [c.name, c]));
  const sheet = div('sm-sheet');
  if (opts.editable) sheet.classList.add('sm-editable');
  // width gilt im Original beim gespeicherten Zoom (Bildschirmpixel), umgerechnet auf 100 %
  sheet.style.width = `${(d.width * 100) / (d.zoomFactor || 100)}px`;
  const intro = introOutro(d, 'intro');
  if (intro) sheet.append(intro);
  if (d.mainSequence.steps.length > 0) {
    const frame = div('sm-frame');
    frame.append(renderSequence(d.mainSequence));
    sheet.append(frame);
  } else sheet.append(welcome());
  const outro = introOutro(d, 'outro');
  if (outro) sheet.append(outro);
  return sheet;
}

/** Intro bzw. Outro; beim Bearbeiten auch ohne Inhalt als leere Area zum Hineinschreiben (wie im Original) */
function introOutro(d: Diagram, which: 'intro' | 'outro'): HTMLElement | undefined {
  const ec = d[which];
  if (ec) return renderContent(ec, { cls: `sm-${which}` });
  if (!options.editable) return undefined;
  const el = renderContent({ areas: [{ kind: 'text', text: '', plainText: '', markups: [] }] }, { cls: `sm-${which}` });
  // textinput.ts legt Intro/Outro beim ersten Tippen im Modell an
  el.querySelector<HTMLElement>('.sm-text')!.dataset.path = `${which}/areas/0`;
  return el;
}

/** WelcomeMessagePanel (welcome.message): Hinweis im leeren Diagramm, bis der erste Schritt angelegt ist */
function welcome(): HTMLElement {
  const el = div('sm-welcome');
  const h = document.createElement('h2');
  h.textContent = 'Willkommen bei Specman Web';
  const p = document.createElement('p');
  p.textContent =
    'Das ist der Modellierungsbereich. Klicken Sie auf einen Button der Schrittpalette, um einen Schritt unterhalb des Schritts anzufügen, in dem der Textcursor steht.';
  el.append(h, p);
  return el;
}

// ---- Sequenzen ----

function renderSequence(seq: StepSequence): HTMLElement {
  const el = div('sm-seq');
  seq.steps.forEach((step, i) => {
    const prev = seq.steps[i - 1];
    el.append(renderStep(step, prev !== undefined && prev.decorationStyle !== 'None'));
  });
  if (seq.catchArea && seq.catchArea.catchSequences.length > 0) el.append(renderCatchArea(seq.catchArea));
  return el;
}

// ---- Schritte ----

function renderStep(step: Step, prevDecorated: boolean): HTMLElement {
  const inner = renderStepInner(step);
  inner.dataset.stepId = step.id;
  inner.style.setProperty('--sm-bg', step.shade !== undefined ? '#' + step.shade.toString(16).padStart(6, '0') : '#fff');
  if (step.changeInfo) markStepChange(inner, step.changeInfo);
  if (step.decorationStyle === 'None') return inner;
  // RoundedBorderDecorator: weißer Rand mit INSET 15, abgerundete Linie (ARC 25), bei Co ohne Abstand oben
  const deco = div('sm-deco');
  if (step.decorationStyle === 'Full' || !prevDecorated) deco.classList.add('sm-deco-top');
  const box = div('sm-deco-box');
  box.append(inner);
  deco.append(box);
  return deco;
}

function renderStepInner(step: Step): HTMLElement {
  switch (step.kind) {
    case 'simple':
      return renderContent(step.content, { step, cls: 'sm-cell sm-simple' });
    case 'source':
      return renderContent(step.content, { step, cls: 'sm-cell sm-source' });
    case 'break': {
      const el = renderContent(step.content, { step, cls: 'sm-cell sm-break' });
      el.prepend(chevron('left'));
      return el;
    }
    case 'while':
    case 'doWhile':
      return renderLoop(step, step.loopSequence, step.barWidth);
    case 'subsequence':
      return renderSubsequence(step);
    case 'ifElse':
      return renderIfElse(step);
    case 'if':
      return renderIf(step);
    case 'case':
      return renderCase(step);
  }
}

/** While oben, Do-While (While-While) unten: Kopf bzw. Fuß über die volle Breite, links der Schleifenbalken */
function renderLoop(step: WhileStep | DoWhileStep, seq: StepSequence, barWidth: number): HTMLElement {
  const kind = step.kind;
  const el = div(`sm-structured sm-loop sm-${kind}`);
  el.style.gridTemplateColumns = `${barWidth}px 1fr`;
  const text = renderContent(step.content, { step, cls: 'sm-cell sm-loop-text' });
  text.style.paddingLeft = `${barWidth + 2 + 3}px`;
  const bar = div('sm-cell sm-loop-bar sm-body');
  const body = renderSequence(seq);
  body.classList.add('sm-body');
  if (kind === 'while') el.append(text, bar, body);
  else el.append(bar, body, text);
  addToggle(el, text, step);
  return el;
}

function renderSubsequence(step: SubsequenceStep): HTMLElement {
  const el = div('sm-structured sm-subsequence');
  const head = renderContent(step.content, { step, cls: 'sm-cell sm-subsequence-head' });
  head.style.paddingLeft = `${TEXTEINRUECKUNG + 3}px`;
  const body = renderSequence(step.subsequence);
  body.classList.add('sm-body');
  el.append(head, body);
  addToggle(el, head, step);
  return el;
}

/** Verzweigungen: Zeile 1 Bedingung, Zeile 2 Zweig-Überschriften, Zeile 3 Zweige; Raute auf der ersten Spaltengrenze */
function branching(step: IfElseStep | IfStep | CaseStep, columns: string[], conditionCell: HTMLElement, headings: HTMLElement[], bodies: HTMLElement[], cls: string): HTMLElement {
  const el = div(`sm-structured sm-branching ${cls}`);
  el.style.gridTemplateColumns = columns.join(' ');
  const filler = div('sm-cell sm-filler');
  conditionCell.classList.add('sm-condition');
  conditionCell.style.gridColumn = `2 / span ${columns.length - 1}`;
  conditionCell.append(raute());
  el.append(filler, conditionCell, ...headings);
  for (const b of bodies) {
    b.classList.add('sm-body');
    el.append(b);
  }
  addToggle(el, conditionCell, step);
  return el;
}

function heading(seq: BranchSequence, side: 'left' | 'right'): HTMLElement {
  const h = renderContent(seq.heading, { cls: `sm-cell sm-branch-heading sm-branch-${side}` });
  if (seq.changeInfo) markWholeChange(h, seq.changeInfo.changetype, seq.changeInfo.changeset);
  return h;
}

function renderIfElse(step: IfElseStep): HTMLElement {
  const r = step.ifWidthRatio;
  return branching(
    step,
    [`minmax(10px, ${r}fr)`, `minmax(10px, ${1 - r}fr)`],
    renderContent(step.content, { step, cls: 'sm-cell' }),
    [heading(step.ifSequence, 'left'), heading(step.elseSequence, 'right')],
    [renderSequence(step.ifSequence), renderSequence(step.elseSequence)],
    'sm-ifelse',
  );
}

/** Im Original bleibt die linke Spalte leer, rechts liegt der bedingte Zweig (siehe IfSchrittView) */
function renderIf(step: IfStep): HTMLElement {
  return branching(
    step,
    [`${step.emptyWidth}px`, 'minmax(10px, 1fr)'],
    renderContent(step.content, { step, cls: 'sm-cell' }),
    [div('sm-cell sm-branch-heading'), heading(step.ifSequence, 'right')],
    [div('sm-cell sm-empty-branch'), renderSequence(step.ifSequence)],
    'sm-if',
  );
}

function renderCase(step: CaseStep): HTMLElement {
  const seqs = [step.defaultSequence, ...step.caseSequences];
  const raw = step.columnWidthRatios.length === seqs.length ? step.columnWidthRatios : seqs.map(() => 1);
  // auf Summe 1 normieren: fr-Anteile unter 1 füllen in CSS nicht die ganze Breite
  const sum = raw.reduce((a, b) => a + b, 0) || 1;
  const ratios = raw.map((r) => r / sum);
  return branching(
    step,
    ratios.map((r) => `minmax(10px, ${r}fr)`),
    renderContent(step.content, { step, cls: 'sm-cell' }),
    seqs.map((s, i) => heading(s, i === 0 ? 'left' : 'right')),
    seqs.map(renderSequence),
    'sm-case',
  );
}

// ---- Catch-Bereich ----

function renderCatchArea(area: CatchArea): HTMLElement {
  const el = div('sm-catcharea');
  const columns = div('sm-catch-columns');
  const widths = area.sequencesWidthPercent;
  columns.style.gridTemplateColumns =
    widths && widths.length === area.catchSequences.length ? widths.map((w) => `minmax(10px, ${w}fr)`).join(' ') : `repeat(${area.catchSequences.length}, minmax(10px, 1fr))`;
  for (const c of area.catchSequences) columns.append(renderCatchSequence(c));
  columns.classList.add('sm-body');
  el.append(div('sm-divider'), columns, div('sm-divider sm-body'));
  if (area.collapsed) el.classList.add('sm-collapsed');
  return el;
}

function renderCatchSequence(c: CatchSequence): HTMLElement {
  const el = div('sm-catch');
  const head = renderContent(c.heading, { number: stepNumbers.get(c.id) ?? '?', cls: 'sm-cell sm-catch-heading' });
  head.prepend(chevron('right'));
  if (c.changeInfo) markWholeChange(head, c.changeInfo.changetype, c.changeInfo.changeset);
  el.append(head);
  for (const cc of c.coCatches) {
    const co = renderContent(cc.heading, { number: stepNumbers.get(cc.breakStepId) ?? '?', cls: 'sm-cell sm-catch-heading sm-cocatch' });
    co.prepend(chevron('right'));
    co.style.marginRight = `${c.headingRightBarWidth}px`;
    if (cc.changeInfo) markWholeChange(co, cc.changeInfo.changetype, cc.changeInfo.changeset);
    el.append(co);
  }
  el.append(renderSequence(c));
  return el;
}

// ---- Edit-Container ----

interface ContentOptions {
  /** Schritt, dessen Nummer und Tags im Meta-Streifen stehen */
  step?: Step;
  /** Nummer ohne Schritt (catch, coCatch) */
  number?: string;
  cls?: string;
}

/** EditContainer: Meta-Streifen (Tags, Schrittnummer) oben rechts, darunter die Edit-Areas */
export function renderContent(ec: EditorContent, opts: ContentOptions = {}): HTMLElement {
  const el = div('sm-ec' + (opts.cls ? ' ' + opts.cls : ''));
  if (opts.step || opts.number !== undefined) {
    const meta = div('sm-meta');
    if (opts.step) for (const tag of opts.step.tags) meta.append(renderTag(tag));
    meta.append(opts.step ? stepNumberLabel(opts.step) : span('sm-nr', opts.number!));
    el.append(meta);
  }
  renderAreas(ec.areas, el);
  return el;
}

/** StepnumberLabel: Standard grau, gelöscht schwarz, Ziel „eigene < Quelle“, Quelle „eigene > Ziel“ */
function stepNumberLabel(step: Step): HTMLElement {
  const label = span('sm-nr', '');
  const ci = step.changeInfo;
  const related = step.sourceStepId !== undefined ? stepNumbers.get(step.sourceStepId) : undefined;
  if (ci?.changetype === 'Zielschritt') {
    label.classList.add('sm-nr-target');
    label.style.backgroundColor = css(changeSet(ci.changeset).panel);
    label.append(step.stepNumber);
    if (related !== undefined) label.append(' < ', strike(related));
  } else if (ci?.changetype === 'Quellschritt') {
    label.classList.add('sm-nr-source');
    label.append(strike(step.stepNumber));
    if (related !== undefined) label.append(' > ' + related);
  } else if (ci?.changetype === 'Geloescht') {
    label.classList.add('sm-nr-deleted');
    label.append(strike(step.stepNumber));
  } else {
    label.textContent = step.stepNumber;
  }
  return label;
}

function strike(text: string): HTMLElement {
  const s = document.createElement('s');
  s.textContent = text;
  return s;
}

/** Meta-Tag (GenericMetaTag): Hintergrund und Rand aus der Konfiguration, Icon und/oder Label, Freitext als Tooltip */
function renderTag(tag: MetaTag): HTMLElement {
  const config = tagConfigs.get(tag.configName);
  const el = span('sm-tag', '');
  if (tag.freetext) el.title = tag.freetext;
  if (!config) {
    el.textContent = tag.configName;
    return el;
  }
  el.style.backgroundColor = argbCss(config.backgroundColor);
  el.style.borderColor = config.borderColor !== undefined ? argbCss(config.borderColor) : 'transparent';
  if (config.iconSvg) {
    const icon = document.createElement('img');
    icon.className = 'sm-tag-icon';
    icon.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(config.iconSvg);
    icon.alt = '';
    el.append(icon);
  }
  if (config.label) el.append(span('sm-tag-label', config.label));
  return el;
}

function argbCss(argb: number): string {
  return `rgba(${(argb >>> 16) & 0xff}, ${(argb >>> 8) & 0xff}, ${argb & 0xff}, ${((argb >>> 24) & 0xff) / 255})`;
}

function renderAreas(areas: EditArea[], into: HTMLElement): void {
  let i = 0;
  while (i < areas.length) {
    const area = areas[i];
    if (area.kind === 'listItem') {
      // aufeinanderfolgende Listenpunkte gleicher Art bilden eine Liste, wie im Dateiformat
      const list = document.createElement(area.ordered ? 'ol' : 'ul');
      list.className = 'sm-list';
      let a: EditArea;
      while (i < areas.length && (a = areas[i]).kind === 'listItem' && a.ordered === area.ordered) {
        const li = document.createElement('li');
        renderAreas(a.content.areas, li);
        if (a.changeInfo) markWholeChange(li, a.changeInfo.changetype, a.changeInfo.changeset);
        list.append(li);
        i++;
      }
      into.append(list);
      continue;
    }
    into.append(renderArea(area));
    i++;
  }
}

function renderArea(area: Exclude<EditArea, { kind: 'listItem' }>): HTMLElement {
  let el: HTMLElement;
  switch (area.kind) {
    case 'text':
      el = renderText(area);
      break;
    case 'table':
      el = renderTable(area);
      break;
    default:
      el = renderImage(area);
  }
  if (area.changeInfo) markWholeChange(el, area.changeInfo.changetype, area.changeInfo.changeset);
  return el;
}

function renderText(area: TextEditArea): HTMLElement {
  const el = div('sm-text');
  const path = paths.get(area);
  if (path !== undefined) el.dataset.path = path;
  if (options.editable) el.contentEditable = 'true';
  el.append(sanitizeHtml(area.text));
  if (area.markups.length > 0) applyMarkups(el, area.plainText, area.markups, markupBackground);
  return el;
}

function markupBackground(m: Markup): string {
  switch (m.type) {
    case 'Changed':
      return css(changeSet(m.changeset).text);
    case 'ChangedSteplink':
      return css(changeSet(m.changeset).stepnumberLink);
    case 'Steplink':
      return css(STEPNUMBER_LINK_COLOR);
  }
}

function renderTable(t: TableEditArea): HTMLElement {
  const wrap = div('sm-table-wrap');
  const path = paths.get(t);
  if (path !== undefined) wrap.dataset.tablePath = path;
  const table = document.createElement('table');
  table.className = 'sm-table';
  table.style.width = `${t.tableWidthPercent}%`;
  if (t.columnsWidthPercent?.length) {
    const cg = document.createElement('colgroup');
    for (const w of t.columnsWidthPercent) {
      const col = document.createElement('col');
      col.style.width = `${w}%`;
      cg.append(col);
    }
    table.append(cg);
  }
  const tbody = document.createElement('tbody');
  for (const row of t.cells) {
    const tr = document.createElement('tr');
    for (const cell of row) {
      const td = document.createElement('td');
      renderAreas(cell.areas, td);
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  wrap.append(table);
  return wrap;
}

function renderImage(img: ImageArea): HTMLElement {
  const wrap = div('sm-image');
  if (img.kind === 'plantuml') {
    // Phase 0: kein PlantUML-Rendering, nur ein Platzhalter mit dem Quelltext
    wrap.classList.add('sm-plantuml');
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'PlantUML-Diagramm (Darstellung noch nicht portiert)';
    const pre = document.createElement('pre');
    pre.textContent = img.source;
    details.append(summary, pre);
    wrap.append(details);
    return wrap;
  }
  const el = document.createElement('img');
  el.src =
    img.kind === 'svg' ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(img.source) : `data:image/${img.imageType};base64,${img.imageData}`;
  el.alt = '';
  el.addEventListener('load', () => {
    el.style.width = `${el.naturalWidth * img.individualScalePercent}px`;
  });
  wrap.append(el);
  return wrap;
}

// ---- Änderungsmarkierungen ganzer Elemente (Phase 0.6) ----

/** Geänderte Schritte: Fläche in der Panel-Farbe des Change Sets; gelöschte zusätzlich mit grauem, durchgestrichenem Text auf Schwarz */
function markStepChange(el: HTMLElement, ci: ChangeInfo): void {
  markWholeChange(el, ci.changetype, ci.changeset);
  el.style.setProperty('--sm-bg', css(changeSet(ci.changeset).panel));
}

/** Areas, Zweig-Überschriften, Listenpunkte mit eigener Änderungsart */
export function markWholeChange(el: HTMLElement, changetype: string, changeset: string): void {
  const cs = changeSet(changeset);
  el.classList.add('sm-change', `sm-change-${changetype}`);
  el.style.setProperty('--sm-change-color', css(cs.text));
  el.style.setProperty('--sm-change-panel', css(cs.panel));
  if (changetype === 'Geloescht') markDeletedText(el);
}

/** Styles.ganzerSchrittGeloeschtStil: Textstücke einzeln umhüllen, damit Schwarz nur hinter dem Text liegt */
function markDeletedText(root: HTMLElement): void {
  const texts = root.matches('.sm-text') ? [root] : Array.from(root.querySelectorAll<HTMLElement>('.sm-text'));
  for (const text of texts) {
    // Gelöschtes bleibt bis zum Übernehmen/Verwerfen der Änderung (Phase 2) unbearbeitbar
    text.contentEditable = 'false';
    const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) if ((n as Text).data.trim()) nodes.push(n as Text);
    for (const n of nodes) {
      const s = span('sm-deleted-text', '');
      n.replaceWith(s);
      s.append(n);
    }
  }
}

/** Erstes Change Set, das im Inneren eines strukturierten Schritts vorkommt (für den Hinweis am Klapp-Knopf) */
function firstInnerChange(step: Step): string | undefined {
  for (const seq of childSequences(step)) {
    const cs = firstChangeInSequence(seq);
    if (cs) return cs;
  }
  return undefined;
}

function firstChangeInSequence(seq: StepSequence): string | undefined {
  if (seq.changeInfo) return seq.changeInfo.changeset;
  if ('heading' in seq) {
    const cs = firstChangeInContent((seq as BranchSequence).heading);
    if (cs) return cs;
  }
  for (const s of seq.steps) {
    const cs = s.changeInfo?.changeset ?? firstChangeInContent(s.content) ?? firstInnerChange(s);
    if (cs) return cs;
  }
  for (const c of seq.catchArea?.catchSequences ?? []) {
    const cs = c.changeInfo?.changeset ?? firstChangeInContent(c.heading) ?? firstChangeInSequence(c);
    if (cs) return cs;
  }
  return undefined;
}

function firstChangeInContent(ec: EditorContent): string | undefined {
  for (const a of ec.areas) {
    if (a.changeInfo) return a.changeInfo.changeset;
    if (a.kind === 'text') {
      const m = a.markups.find((m) => m.type !== 'Steplink');
      if (m) return m.changeset ?? 'yellow';
    }
    if (a.kind === 'listItem') {
      const cs = firstChangeInContent(a.content);
      if (cs) return cs;
    }
    if (a.kind === 'table') {
      for (const row of a.cells)
        for (const cell of row) {
          const cs = firstChangeInContent(cell);
          if (cs) return cs;
        }
    }
  }
  return undefined;
}

// ---- Auf- und Zuklappen ----

function addToggle(stepEl: HTMLElement, headCell: HTMLElement, step: Step & { collapsed: boolean }): void {
  if (step.collapsed) stepEl.classList.add('sm-collapsed');
  const btn = document.createElement('button');
  btn.className = 'sm-toggle';
  btn.title = 'Auf-/Zuklappen';
  // Hinweis: zugeklappte Schritte mit Änderungen im Inneren zeigen den Knopf in der Farbe des Change Sets
  const inner = firstInnerChange(step);
  if (inner) {
    btn.classList.add('sm-toggle-changes');
    btn.style.backgroundColor = css(changeSet(inner).text);
    btn.title += ' – enthält Änderungen';
  }
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (options.onToggle) options.onToggle(step.id);
    else stepEl.classList.toggle('sm-collapsed');
  });
  const meta = headCell.querySelector(':scope > .sm-meta');
  if (meta) meta.prepend(btn);
}

// ---- Grafikelemente ----

/** Raute (VerzweigungSchrittView.rauteZeichnen): weiß gefüllt, schwarz umrandet */
function raute(): SVGSVGElement {
  const s = 2 * RAUTE;
  const svg = svgEl('svg', { class: 'sm-raute', width: s, height: s, viewBox: `-1 -1 ${s + 2} ${s + 2}` });
  svg.append(svgEl('polygon', { points: `0,${RAUTE} ${RAUTE},0 ${s},${RAUTE} ${RAUTE},${s}` }));
  return svg;
}

/** Spitze des Break-Schritts (links, „<“) bzw. der Catch-Überschrift (rechts, „>“) */
function chevron(dir: 'left' | 'right'): SVGSVGElement {
  const svg = svgEl('svg', { class: `sm-chevron sm-chevron-${dir}`, viewBox: '0 0 18 100', preserveAspectRatio: 'none' });
  const pts = dir === 'left' ? '18,0 0,50 18,100' : '0,0 18,50 0,100';
  svg.append(svgEl('polyline', { points: pts }));
  return svg;
}

// ---- DOM-Helfer ----

function div(cls: string): HTMLDivElement {
  const d = document.createElement('div');
  d.className = cls;
  return d;
}

function span(cls: string, text: string): HTMLSpanElement {
  const s = document.createElement('span');
  s.className = cls;
  s.textContent = text;
  return s;
}

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>): SVGElementTagNameMap[K] {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}
