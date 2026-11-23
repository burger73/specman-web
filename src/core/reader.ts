// Parsebaum → Modell. Portierung von specman.model.v002.io.ModelParser_V002.
import { parseDiagram, type ParseError } from './parse.ts';
import type * as P from './parser/SpecmanModel_V002Parser.ts';
import {
  ImageBlockContext,
  TableBlockContext,
  TextAreaContext,
} from './parser/SpecmanModel_V002Parser.ts';
import {
  generateId,
  type Aenderungsart,
  type BranchSequence,
  type BreakStep,
  type CaseStep,
  type CatchArea,
  type CatchSequence,
  type ChangeInfo,
  type CoCatch,
  type Diagram,
  type DoWhileStep,
  type EditArea,
  type EditorContent,
  type Envelope,
  type IfElseStep,
  type IfStep,
  type ImageArea,
  type Markup,
  type MarkupType,
  type MetaTag,
  type MetaTagConfig,
  type PdfExportOptions,
  type RoundedBorderDecorationStyle,
  type SimpleStep,
  type SourceStep,
  type Step,
  type StepSequence,
  type SubsequenceStep,
  type TableEditArea,
  type TextEditArea,
  type WhileStep,
} from './model.ts';

export class ModelParseException extends Error {
  readonly errors: ParseError[];
  constructor(message: string, errors: ParseError[] = []) {
    super(message);
    this.errors = errors;
  }
}

export interface ReadResult {
  envelope: Envelope;
  diagram: Diagram;
}

const DEFAULT_ENVELOPE: Envelope = { specmanVersion: '', modelType: 'specman.model.v002.DiagramModel_V002' };

/** Liest eine V2-Modelldatei. Wirft ModelParseException beim ersten Syntaxfehler (wie das Original). */
export function readDiagram(content: string): ReadResult {
  const { tree, errors } = parseDiagram(content);
  if (errors.length > 0) {
    const e = errors[0];
    throw new ModelParseException(`line ${e.line}:${e.column} ${e.message}`, errors);
  }
  return { envelope: readEnvelope(content), diagram: buildDiagram(tree, extractName(content)) };
}

/** Erste Zeile: // {"specmanVersion":...,"modelType":...} – im Original LoadDiagrammSpecmanOp.readMeta() */
export function readEnvelope(content: string): Envelope {
  const m = /^\/\/\s*(\{.*\})\s*$/m.exec(content.split('\n', 1)[0]);
  if (!m) return { ...DEFAULT_ENVELOPE };
  try {
    const json = JSON.parse(m[1]) as Partial<Envelope>;
    return { specmanVersion: json.specmanVersion ?? '', modelType: json.modelType ?? DEFAULT_ENVELOPE.modelType };
  } catch {
    return { ...DEFAULT_ENVELOPE };
  }
}

function extractName(content: string): string {
  const m = /\/\/\s*Specman:\s*(.+)/.exec(content);
  return m ? m[1].trim() : 'frame0';
}

function buildDiagram(ctx: P.DiagramContext, name: string): Diagram {
  const s = buildSettings(ctx.settings());
  const intro = ctx.intro();
  const outro = ctx.outro();
  return {
    name,
    width: s.width,
    zoomFactor: s.zoomFactor,
    changeModeEnabled: s.changeModeEnabled,
    changeSetName: s.changeSetName,
    mainSequence: buildMainSequence(ctx.mainSequence()),
    intro: intro ? buildEditContainer(intro.editContainerHead(), intro.editContainerTail()) : undefined,
    outro: outro ? buildEditContainer(outro.editContainerHead(), outro.editContainerTail()) : undefined,
    pdfExportOptions: s.pdfOptions,
    metaTagConfigs: s.metaTagConfigs,
  };
}

// ---- Settings ----

interface Settings {
  width: number;
  zoomFactor: number;
  changeModeEnabled: boolean;
  changeSetName: string;
  pdfOptions?: PdfExportOptions;
  metaTagConfigs: MetaTagConfig[];
}

function buildSettings(ctx: P.SettingsContext | null): Settings {
  const s: Settings = { width: 700, zoomFactor: 100, changeModeEnabled: false, changeSetName: 'yellow', metaTagConfigs: [] };
  if (!ctx) return s;
  for (const entry of ctx.settingEntry()) {
    switch (entry.start!.text) {
      case 'width':
        s.width = parseInt(entry.INT()!.getText(), 10);
        break;
      case 'zoom':
        s.zoomFactor = parseInt(entry.INT()!.getText(), 10);
        break;
      case 'changeModeEnabled':
        s.changeModeEnabled = entry.boolVal()!.getText() === 'true';
        break;
      case 'changeSetName':
        s.changeSetName = entry.ID()!.getText();
        break;
      case 'pdfOptions':
        s.pdfOptions = buildPdfOptions(entry.pdfOptionEntry());
        break;
      case 'metaTags':
        for (const c of entry.metaTagConfig()) {
          const config = buildMetaTagConfig(c);
          if (s.metaTagConfigs.some((e) => e.name === config.name)) {
            throw new ModelParseException(`The meta tag '${config.name}' is defined more than once`);
          }
          s.metaTagConfigs.push(config);
        }
        break;
    }
  }
  return s;
}

function buildMetaTagConfig(ctx: P.MetaTagConfigContext): MetaTagConfig {
  const colors = ctx.COLOR_HEX();
  const content = ctx.metaTagContent();
  const label = content.labelParam();
  const icon = content.iconParam();
  return {
    name: stripBackticks(ctx.tagId().getText()),
    label: label ? stripBackticks(label.BACKTICK_STRING().getText()) : '',
    iconSvg: icon ? stripBackticks(icon.BACKTICK_STRING().getText()) : undefined,
    backgroundColor: fromModelColor(colors[0].getText()),
    borderColor: colors.length > 1 ? fromModelColor(colors[1].getText()) : undefined,
    freetextAllowed: ctx.freetextParam() === null,
  };
}

/** ReadWriteColor.fromModelColor → ARGB (vorzeichenlos). #rrggbb ist deckend, #rrggbbaa hat Alpha. */
export function fromModelColor(text: string): number {
  if (text.length === '#rrggbbaa'.length) {
    const rgb = parseInt(text.substring(1, 7), 16);
    const alpha = parseInt(text.substring(7), 16);
    return ((alpha << 24) | rgb) >>> 0;
  }
  return (0xff000000 | (parseInt(text.substring(1), 16) & 0xffffff)) >>> 0;
}

function buildPdfOptions(entries: P.PdfOptionEntryContext[]): PdfExportOptions {
  const o: PdfExportOptions = { portrait: true, paging: false };
  for (const e of entries) {
    switch (e.start!.text) {
      case 'filename':
        o.filename = stripBackticks(e.BACKTICK_STRING()!.getText());
        break;
      case 'modelFilename':
        o.modelFilename = stripBackticks(e.BACKTICK_STRING()!.getText());
        break;
      case 'pageSize':
        o.pageSize = e.ID()!.getText();
        break;
      case 'portrait':
        o.portrait = e.boolVal()!.getText() === 'true';
        break;
      case 'paging':
        o.paging = e.boolVal()!.getText() === 'true';
        break;
    }
  }
  return o;
}

// ---- Sequenzen und Catch-Bereiche ----

/** Schrittnummer → ID aller Break-Schritte, rekursiv (ohne Catch-Sequenzen), für die Zuordnung der catch-Blöcke */
type BreakStepIds = Map<string, string>;

function collectBreakStepIdsDeep(steps: P.StepContext[], map: BreakStepIds = new Map()): BreakStepIds {
  for (const s of steps) {
    const br = s.breakStep();
    if (br) map.set(br.stepNum().getText(), br.stepId().getText());
    s.whileStep() && collectBreakStepIdsDeep(s.whileStep()!.step(), map);
    s.doWhileStep() && collectBreakStepIdsDeep(s.doWhileStep()!.step(), map);
    const ie = s.ifElseStep();
    if (ie) {
      collectBreakStepIdsDeep(ie.ifBranch().step(), map);
      collectBreakStepIdsDeep(ie.elseBranch().step(), map);
    }
    s.ifStep() && collectBreakStepIdsDeep(s.ifStep()!.ifBranch().step(), map);
    const cs = s.caseStep();
    if (cs) {
      collectBreakStepIdsDeep(cs.defaultBranch().step(), map);
      for (const cb of cs.caseBranch()) collectBreakStepIdsDeep(cb.step(), map);
    }
    s.subsequenceStep() && collectBreakStepIdsDeep(s.subsequenceStep()!.step(), map);
  }
  return map;
}

function buildMainSequence(ctx: P.MainSequenceContext): StepSequence {
  return buildSequence(ctx.step(), ctx.catchArea());
}

function buildSequence(steps: P.StepContext[], catchArea: P.CatchAreaContext | null): StepSequence {
  const ids = collectBreakStepIdsDeep(steps);
  return {
    id: generateId(),
    steps: steps.map((s) => buildStep(s, ids)),
    catchArea: buildCatchAreaFromCtx(catchArea, ids),
  };
}

function buildCatchAreaFromCtx(ctx: P.CatchAreaContext | null, ids: BreakStepIds): CatchArea {
  const area: CatchArea = { catchSequences: [], collapsed: false };
  if (!ctx) return area;
  for (const p of ctx.catchAreaParam()) {
    if (p.start!.text === 'collapsed') area.collapsed = true;
    else if (p.start!.text === 'cols') area.sequencesWidthPercent = p.PERCENT().map((t) => parsePercent(t.getText()));
  }
  for (const c of ctx.catchBlock()) area.catchSequences.push(buildCatchSequence(c, ids));
  return area;
}

function buildCatchSequence(ctx: P.CatchBlockContext, ids: BreakStepIds): CatchSequence {
  const breakId = ids.get(ctx.stepNum().getText()) ?? generateId();
  const coCatches: CoCatch[] = ctx.coCatch().map((cc) => ({
    breakStepId: ids.get(cc.stepNum().getText()) ?? generateId(),
    heading: buildEditContainer(cc.editContainerHead(), null),
    changeInfo: buildChangeInfo(cc.changeParam()),
  }));
  const hw = ctx.INT();
  return {
    id: breakId,
    changeInfo: buildChangeInfo(ctx.changeParam()),
    heading: buildEditContainer(ctx.editContainerHead(), ctx.editContainerTail()),
    coCatches,
    headingRightBarWidth: hw ? parseInt(hw.getText(), 10) : 18,
    // wie im Original: Schritte im Catch-Block lösen Break-IDs nicht über die Nummer auf
    steps: ctx.step().map((s) => buildStep(s, new Map())),
    catchArea: { catchSequences: [], collapsed: false },
  };
}

interface BranchCtx {
  editContainerHead(): P.EditContainerHeadContext;
  editContainerTail(): P.EditContainerTailContext;
  changeParam(): P.ChangeParamContext | null;
  step(): P.StepContext[];
}

function buildBranch(ctx: BranchCtx, catchArea: P.CatchAreaContext | null): BranchSequence {
  const ids = collectBreakStepIdsDeep(ctx.step());
  return {
    id: generateId(),
    changeInfo: buildChangeInfo(ctx.changeParam()),
    heading: buildEditContainer(ctx.editContainerHead(), ctx.editContainerTail()),
    steps: ctx.step().map((s) => buildStep(s, ids)),
    catchArea: buildCatchAreaFromCtx(catchArea, ids),
  };
}

// ---- Schritte ----

function buildStep(ctx: P.StepContext, ids: BreakStepIds): Step {
  if (ctx.simpleStep()) return buildSimpleStep(ctx.simpleStep()!);
  if (ctx.breakStep()) return buildBreakStep(ctx.breakStep()!, ids);
  if (ctx.sourceStep()) return buildSourceStep(ctx.sourceStep()!);
  if (ctx.whileStep()) return buildWhileStep(ctx.whileStep()!);
  if (ctx.doWhileStep()) return buildDoWhileStep(ctx.doWhileStep()!);
  if (ctx.ifElseStep()) return buildIfElseStep(ctx.ifElseStep()!);
  if (ctx.ifStep()) return buildIfStep(ctx.ifStep()!);
  if (ctx.caseStep()) return buildCaseStep(ctx.caseStep()!);
  if (ctx.subsequenceStep()) return buildSubsequenceStep(ctx.subsequenceStep()!);
  throw new Error('Unknown step type in context: ' + ctx.getText());
}

/** Gemeinsame Parameter aller Schritt-Arten */
interface StepCtx {
  stepNum(): P.StepNumContext;
  stepId(): P.StepIdContext;
  editContainerHead(): P.EditContainerHeadContext;
  editContainerTail(): P.EditContainerTailContext | null;
  shadeParam(): P.ShadeParamContext | null;
  decoParam(): P.DecoParamContext | null;
  tagsParam(): P.TagsParamContext | null;
}

interface TrackedStepCtx extends StepCtx {
  changeParam(): P.ChangeParamContext | null;
}

function baseFields(ctx: TrackedStepCtx) {
  return {
    id: ctx.stepId().getText(),
    stepNumber: ctx.stepNum().getText(),
    content: buildEditContainer(ctx.editContainerHead(), ctx.editContainerTail()),
    shade: buildShade(ctx.shadeParam()),
    changeInfo: buildChangeInfo(ctx.changeParam()),
    sourceStepId: buildSourceStepId(ctx.changeParam()),
    decorationStyle: buildDecorationStyle(ctx.decoParam()),
    tags: buildTags(ctx.tagsParam()),
  };
}

function buildSimpleStep(ctx: P.SimpleStepContext): SimpleStep | SourceStep {
  const cp = ctx.changeParam();
  if (cp && cp.changeType().getText() === 'source') {
    // Altes Format: Quellschritt als simple mit change=(source, …)
    return {
      kind: 'source',
      id: ctx.stepId().getText(),
      stepNumber: ctx.stepNum().getText(),
      content: buildEditContainer(ctx.editContainerHead(), ctx.editContainerTail()),
      changeInfo: { changetype: 'Quellschritt', changeset: cp.ID().getText() },
      decorationStyle: 'None',
      tags: buildTags(ctx.tagsParam()),
    };
  }
  return { kind: 'simple', ...baseFields(ctx) };
}

function buildSourceStep(ctx: P.SourceStepContext): SourceStep {
  return {
    kind: 'source',
    id: ctx.stepId().getText(),
    stepNumber: ctx.stepNum().getText(),
    content: buildEditContainer(ctx.editContainerHead(), ctx.editContainerTail()),
    shade: buildShade(ctx.shadeParam()),
    changeInfo: { changetype: 'Quellschritt', changeset: ctx.ID().getText() },
    sourceStepId: ctx.STEP_ID()?.getText(),
    decorationStyle: buildDecorationStyle(ctx.decoParam()),
    tags: buildTags(ctx.tagsParam()),
  };
}

function buildBreakStep(ctx: P.BreakStepContext, ids: BreakStepIds): BreakStep {
  const base = baseFields(ctx);
  return { kind: 'break', ...base, id: ids.get(base.stepNumber) ?? base.id };
}

function buildWhileStep(ctx: P.WhileStepContext): WhileStep {
  const bw = ctx.INT();
  return {
    kind: 'while',
    ...baseFields(ctx),
    collapsed: ctx.KW_COLLAPSED() !== null,
    loopSequence: buildSequence(ctx.step(), ctx.catchArea()),
    barWidth: bw ? parseInt(bw.getText(), 10) : 18,
  };
}

function buildDoWhileStep(ctx: P.DoWhileStepContext): DoWhileStep {
  const bw = ctx.INT();
  return {
    kind: 'doWhile',
    ...baseFields(ctx),
    collapsed: ctx.KW_COLLAPSED() !== null,
    loopSequence: buildSequence(ctx.step(), null),
    barWidth: bw ? parseInt(bw.getText(), 10) : 18,
  };
}

function buildIfElseStep(ctx: P.IfElseStepContext): IfElseStep {
  const ifCtx = ctx.ifBranch();
  const elseCtx = ctx.elseBranch();
  const pct = ctx.PERCENT();
  return {
    kind: 'ifElse',
    ...baseFields(ctx),
    collapsed: ctx.KW_COLLAPSED() !== null,
    ifSequence: buildBranch(ifCtx, ifCtx.catchArea()),
    elseSequence: buildBranch(elseCtx, elseCtx.catchArea()),
    ifWidthRatio: pct ? parseFloat(pct.getText()) / 100 : 0.5,
  };
}

function buildIfStep(ctx: P.IfStepContext): IfStep {
  const ifCtx = ctx.ifBranch();
  const ew = ctx.INT();
  return {
    kind: 'if',
    ...baseFields(ctx),
    collapsed: ctx.KW_COLLAPSED() !== null,
    ifSequence: buildBranch(ifCtx, ifCtx.catchArea()),
    emptyWidth: ew ? parseInt(ew.getText(), 10) : 20,
  };
}

function buildCaseStep(ctx: P.CaseStepContext): CaseStep {
  const percents = ctx.PERCENT();
  const numBranches = 1 + ctx.caseBranch().length;
  const columnWidthRatios =
    percents.length > 0
      ? percents.map((p) => parseFloat(p.getText()) / 100)
      : Array.from({ length: numBranches }, () => 1 / numBranches);
  return {
    kind: 'case',
    ...baseFields(ctx),
    collapsed: ctx.KW_COLLAPSED() !== null,
    defaultSequence: buildBranch(ctx.defaultBranch(), null),
    caseSequences: ctx.caseBranch().map((cb) => buildBranch(cb, null)),
    columnWidthRatios,
  };
}

function buildSubsequenceStep(ctx: P.SubsequenceStepContext): SubsequenceStep {
  return {
    kind: 'subsequence',
    ...baseFields(ctx),
    collapsed: ctx.KW_COLLAPSED() !== null,
    subsequence: buildSequence(ctx.step(), ctx.catchArea()),
    flatNumbering: ctx.KW_FLAT() !== null,
  };
}

function buildTags(ctx: P.TagsParamContext | null): MetaTag[] {
  if (!ctx) return [];
  return ctx.tagRef().map((t) => {
    const ft = t.BACKTICK_STRING();
    return { configName: stripBackticks(t.tagId().getText()), freetext: ft ? stripBackticks(ft.getText()) : undefined };
  });
}

// ---- Edit-Container und Areas ----

function buildEditContainer(
  head: P.EditContainerHeadContext,
  tail: P.EditContainerTailContext | null,
  headChangeParam: P.ChangeParamContext | null = null,
): EditorContent {
  const areas: EditArea[] = [buildText(head.htmlContent(), headChangeParam)];
  if (tail) for (const a of tail.area()) areas.push(...buildAreas(a));
  return { areas };
}

function buildAreas(ctx: P.AreaContext): EditArea[] {
  const list = ctx.listBlock();
  if (list) {
    const ordered = list.boolVal().getText() === 'true';
    return list.listItem().map((item) => {
      const areas: EditArea[] = [buildText(item.editContainerHead().htmlContent(), null)];
      // Abweichung vom Original: Reihenfolge der Tail-Areas bleibt erhalten (Java sortiert nach Text/Tabelle/Bild)
      for (const child of item.listItemTail()?.children ?? []) {
        if (child instanceof TextAreaContext) areas.push(buildText(child.htmlContent(), child.changeParam()));
        else if (child instanceof TableBlockContext) areas.push(buildTable(child));
        else if (child instanceof ImageBlockContext) areas.push(buildImage(child));
      }
      return { kind: 'listItem', content: { areas }, ordered, changeInfo: buildChangeInfo(item.changeParam()) };
    });
  }
  if (ctx.textArea()) return [buildText(ctx.textArea()!.htmlContent(), ctx.textArea()!.changeParam())];
  if (ctx.tableBlock()) return [buildTable(ctx.tableBlock()!)];
  if (ctx.imageBlock()) return [buildImage(ctx.imageBlock()!)];
  return [];
}

function buildText(ctx: P.HtmlContentContext, changeParam: P.ChangeParamContext | null): TextEditArea {
  const plain = ctx.plainAttr();
  const markups = ctx.markupsAttr();
  return {
    kind: 'text',
    text: stripBackticks(ctx.BACKTICK_STRING().getText()),
    plainText: plain ? stripBackticks(plain.BACKTICK_STRING().getText()) : '',
    markups: markups ? markups.markup().map(buildMarkup) : [],
    changeInfo: buildChangeInfo(changeParam),
  };
}

function buildMarkup(m: P.MarkupContext): Markup {
  const markup: Markup = {
    from: parseInt(m.INT(0)!.getText(), 10),
    to: parseInt(m.INT(1)!.getText(), 10),
    type: m.markupType().getText() as MarkupType,
  };
  const cs = m.ID();
  if (cs) markup.changeset = cs.getText();
  return markup;
}

function buildTable(ctx: P.TableBlockContext): TableEditArea {
  const percents = ctx.PERCENT();
  return {
    kind: 'table',
    tableWidthPercent: parsePercent(percents[0].getText()),
    columnsWidthPercent: percents.length > 1 ? percents.slice(1).map((p) => parsePercent(p.getText())) : undefined,
    cells: ctx.tableRow().map((row) =>
      row.tableCell().map((cell) => buildEditContainer(cell.editContainerHead(), cell.editContainerTail(), cell.changeParam())),
    ),
    changeInfo: buildChangeInfo(ctx.changeParam()),
  };
}

function buildImage(ctx: P.ImageBlockContext): ImageArea {
  const scale = parseFloat(ctx.PERCENT().getText().replace(',', '.')) / 100;
  const changeInfo = buildChangeInfo(ctx.changeParam());
  const bt = ctx.BACKTICK_STRING();
  if (ctx.KW_SVG()) return { kind: 'svg', source: stripBackticks(bt!.getText()), individualScalePercent: scale, changeInfo };
  if (bt) {
    const backup = ctx.backupAttr();
    return {
      kind: 'plantuml',
      source: stripBackticks(bt.getText()),
      backupSource: backup ? stripBackticks(backup.BACKTICK_STRING().getText()) : undefined,
      backupChangeset: backup ? backup.ID().getText() : undefined,
      individualScalePercent: scale,
      changeInfo,
    };
  }
  const block = ctx.BASE64_BLOCK()!.getText();
  return {
    kind: 'image',
    imageType: ctx.ID()!.getText(),
    imageData: block.replace(/^\[base64:/, '').replace(/\]$/, ''),
    individualScalePercent: scale,
    changeInfo,
  };
}

// ---- Kleinteile ----

const CHANGE_TYPES: Record<string, Aenderungsart> = {
  added: 'Hinzugefuegt',
  removed: 'Geloescht',
  source: 'Quellschritt',
  target: 'Zielschritt',
};

function buildChangeInfo(ctx: P.ChangeParamContext | null): ChangeInfo | undefined {
  if (!ctx) return undefined;
  const art = CHANGE_TYPES[ctx.changeType().getText()];
  return art ? { changetype: art, changeset: ctx.ID().getText() } : undefined;
}

function buildSourceStepId(ctx: P.ChangeParamContext | null): string | undefined {
  return ctx?.STEP_ID()?.getText();
}

function buildDecorationStyle(ctx: P.DecoParamContext | null): RoundedBorderDecorationStyle {
  return ctx ? (ctx.ID().getText() as RoundedBorderDecorationStyle) : 'None';
}

function buildShade(ctx: P.ShadeParamContext | null): number | undefined {
  if (!ctx) return undefined;
  const v = parseInt(ctx.COLOR_HEX().getText().substring(1), 16);
  return Number.isNaN(v) ? undefined : v & 0xffffff;
}

function stripBackticks(s: string): string {
  return s.length >= 2 && s.startsWith('`') && s.endsWith('`') ? s.substring(1, s.length - 1) : s;
}

function parsePercent(s: string): number {
  return Math.round(parseFloat(s.replace('%', '').replace(',', '.')));
}
