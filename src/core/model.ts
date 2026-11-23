// TS-Modell des Specman-Dateiformats V2, Portierung von specman.model.v002.*_V002.
// Klassenhierarchien sind als Discriminated Unions abgebildet (Feld `kind`), Feldnamen wie im Java-Original.

/** Aenderungsart ohne Untracked: ein nicht verfolgtes Element hat einfach keine changeInfo. */
export type Aenderungsart = 'Hinzugefuegt' | 'Geloescht' | 'Quellschritt' | 'Zielschritt';

/** ChangeInfoModel_V002 */
export interface ChangeInfo {
  changetype: Aenderungsart;
  /** Name des Change Sets (yellow, lilac, blue, orange, pink), siehe changesets.ts */
  changeset: string;
}

export type MarkupType = 'Changed' | 'Steplink' | 'ChangedSteplink';

/** Markup_V002: Zeichenbereich [from, to) im Plaintext */
export interface Markup {
  from: number;
  to: number;
  type: MarkupType;
  changeset?: string;
}

// ---- Edit-Areas (AbstractEditAreaModel_V002) ----

/** TextEditAreaModel_V002 */
export interface TextEditArea {
  kind: 'text';
  /** HTML-Body ohne <html>/<body> */
  text: string;
  plainText: string;
  markups: Markup[];
  changeInfo?: ChangeInfo;
}

/** ListItemEditAreaModel_V002: jeder Listenpunkt ist eine eigene Area, die Datei gruppiert aufeinanderfolgende */
export interface ListItemEditArea {
  kind: 'listItem';
  content: EditorContent;
  ordered: boolean;
  changeInfo?: ChangeInfo;
}

/** TableEditAreaModel_V002 */
export interface TableEditArea {
  kind: 'table';
  cells: EditorContent[][];
  tableWidthPercent: number;
  columnsWidthPercent?: number[];
  changeInfo?: ChangeInfo;
}

/** ImageEditAreaModel_V002 (Rastergrafik, base64) */
export interface ImageEditArea {
  kind: 'image';
  /** base64 wie in der Datei; dekodiert wird erst bei der Anzeige */
  imageData: string;
  imageType: string;
  /** 1.0 = 100 % */
  individualScalePercent: number;
  changeInfo?: ChangeInfo;
}

/** PlantUmlImageEditAreaModel_V002 */
export interface PlantUmlImageEditArea {
  kind: 'plantuml';
  source: string;
  backupSource?: string;
  backupChangeset?: string;
  individualScalePercent: number;
  changeInfo?: ChangeInfo;
}

/** SvgImageEditAreaModel_V002 */
export interface SvgImageEditArea {
  kind: 'svg';
  source: string;
  individualScalePercent: number;
  changeInfo?: ChangeInfo;
}

export type ImageArea = ImageEditArea | PlantUmlImageEditArea | SvgImageEditArea;
export type EditArea = TextEditArea | ListItemEditArea | TableEditArea | ImageArea;

/** EditorContentModel_V002: areas[0] ist immer eine TextEditArea (editContainerHead) */
export interface EditorContent {
  areas: EditArea[];
}

// ---- Schritte (AbstractStepModel_V002) ----

export type RoundedBorderDecorationStyle = 'None' | 'Full' | 'Co';

/** MetaTagModel_V002: ein Tag an einem Schritt */
export interface MetaTag {
  configName: string;
  freetext?: string;
}

interface StepBase {
  /** 8 Hex-Zeichen */
  id: string;
  stepNumber: string;
  content: EditorContent;
  /** RGB (0xRRGGBB) oder undefined */
  shade?: number;
  changeInfo?: ChangeInfo;
  /** nur bei Ziel- und Quellschritten: ID des jeweils anderen Schritts */
  sourceStepId?: string;
  decorationStyle: RoundedBorderDecorationStyle;
  tags: MetaTag[];
}

interface StructuredStepBase extends StepBase {
  collapsed: boolean;
}

export interface SimpleStep extends StepBase { kind: 'simple' }
export interface BreakStep extends StepBase { kind: 'break' }
export interface SourceStep extends StepBase { kind: 'source' }

export interface WhileStep extends StructuredStepBase {
  kind: 'while';
  loopSequence: StepSequence;
  barWidth: number;
}

export interface DoWhileStep extends StructuredStepBase {
  kind: 'doWhile';
  loopSequence: StepSequence;
  barWidth: number;
}

export interface IfElseStep extends StructuredStepBase {
  kind: 'ifElse';
  ifSequence: BranchSequence;
  elseSequence: BranchSequence;
  /** Anteil des If-Zweigs an der Breite, 0..1 */
  ifWidthRatio: number;
}

export interface IfStep extends StructuredStepBase {
  kind: 'if';
  ifSequence: BranchSequence;
  emptyWidth: number;
}

export interface CaseStep extends StructuredStepBase {
  kind: 'case';
  defaultSequence: BranchSequence;
  caseSequences: BranchSequence[];
  /** je Spalte inkl. Default, 0..1 */
  columnWidthRatios: number[];
}

export interface SubsequenceStep extends StructuredStepBase {
  kind: 'subsequence';
  subsequence: StepSequence;
  flatNumbering: boolean;
}

export type StructuredStep = WhileStep | DoWhileStep | IfElseStep | IfStep | CaseStep | SubsequenceStep;
export type Step = SimpleStep | BreakStep | SourceStep | StructuredStep;
export type StepKind = Step['kind'];

// ---- Sequenzen ----

/** StepSequenceModel_V002. Die id wird nicht gespeichert, sondern beim Laden neu erzeugt. */
export interface StepSequence {
  id: string;
  changeInfo?: ChangeInfo;
  steps: Step[];
  catchArea?: CatchArea;
}

/** BranchSequenceModel_V002 */
export interface BranchSequence extends StepSequence {
  heading: EditorContent;
}

/** CoCatchModel_V002 */
export interface CoCatch {
  breakStepId: string;
  heading: EditorContent;
  changeInfo?: ChangeInfo;
}

/** CatchSequenceModel_V002: id ist die ID des Break-Schritts, den sie fängt */
export interface CatchSequence extends BranchSequence {
  coCatches: CoCatch[];
  headingRightBarWidth: number;
}

/** CatchAreaModel_V002 */
export interface CatchArea {
  catchSequences: CatchSequence[];
  sequencesWidthPercent?: number[];
  collapsed: boolean;
}

// ---- Diagramm ----

/** PdfExportOptionsModel_V002 */
export interface PdfExportOptions {
  filename?: string;
  modelFilename?: string;
  pageSize?: string;
  portrait: boolean;
  paging: boolean;
}

/** MetaTagConfigModel_V002 */
export interface MetaTagConfig {
  name: string;
  label: string;
  iconSvg?: string;
  /** ARGB wie java.awt.Color.getRGB(), vorzeichenlos */
  backgroundColor: number;
  borderColor?: number;
  freetextAllowed: boolean;
}

/** DiagramModel_V002 */
export interface Diagram {
  name: string;
  width: number;
  zoomFactor: number;
  changeModeEnabled: boolean;
  changeSetName: string;
  mainSequence: StepSequence;
  intro?: EditorContent;
  outro?: EditorContent;
  pdfExportOptions?: PdfExportOptions;
  metaTagConfigs: MetaTagConfig[];
}

/** Erste Kommentarzeile der Datei (ModelEnvelope) */
export interface Envelope {
  specmanVersion: string;
  modelType: string;
}

export const ID_LENGTH = 8;

/** AbstractStepModel_V002.generateId() */
export function generateId(): string {
  return crypto.randomUUID().replaceAll('-', '').substring(0, ID_LENGTH);
}

/** AbstractStepModel_V002.normalizeId() */
export function normalizeId(id: string): string;
export function normalizeId(id: string | undefined): string | undefined;
export function normalizeId(id: string | undefined): string | undefined {
  if (id === undefined) return undefined;
  return id.includes('-') ? id.replaceAll('-', '').substring(0, ID_LENGTH) : id;
}

/** Alle Teilsequenzen eines Schritts (ohne Catch-Bereiche) */
export function childSequences(step: Step): StepSequence[] {
  switch (step.kind) {
    case 'while':
    case 'doWhile':
      return [step.loopSequence];
    case 'ifElse':
      return [step.ifSequence, step.elseSequence];
    case 'if':
      return [step.ifSequence];
    case 'case':
      return [step.defaultSequence, ...step.caseSequences];
    case 'subsequence':
      return [step.subsequence];
    default:
      return [];
  }
}

/** AbstractStepModel_V002.addStepRecursively: Schritt und alle Unterschritte, ohne Catch-Sequenzen (wie im Original) */
export function addStepRecursively(step: Step, all: Step[]): void {
  all.push(step);
  for (const seq of childSequences(step)) addStepsRecursively(seq, all);
}

export function addStepsRecursively(seq: StepSequence, all: Step[]): void {
  for (const s of seq.steps) addStepRecursively(s, all);
}

/** DiagramModel_V002.queryAllSteps */
export function queryAllSteps(d: Diagram): Step[] {
  const all: Step[] = [];
  addStepsRecursively(d.mainSequence, all);
  return all;
}
