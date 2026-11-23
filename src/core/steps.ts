// Schritte anlegen und entfernen, Port von SchrittSequenzView.*Zwischenschieben/*Anhaengen, schrittEntfernen,
// DeleteStepADBLOp und CaseSchrittView.neuenZweigHinzufuegen/zweigEntfernen (ohne Änderungsverfolgung).
// Nach jeder Operation werden die Schritte neu nummeriert und die Schrittverweise im Text nachgezogen.
import type { Focus } from './editor.ts';
import { EditException } from './editor.ts';
import { content } from './factory.ts';
import type { BranchSequence, CaseStep, Diagram, EditorContent, Step, StepSequence } from './model.ts';
import { childSequences, generateId } from './model.ts';
import { renumber } from './numbering.ts';
import { indexPaths, resolvePath } from './paths.ts';
import { numberMapping, rewriteSteplinks, stepNumbersById } from './steplinks.ts';

/** Schrittarten der Schrittpalette (StepButtonBar) */
export type NewStepKind = 'simple' | 'while' | 'doWhile' | 'ifElse' | 'if' | 'case' | 'subsequence' | 'break';

/** AbstractSchrittView.SPALTENLAYOUT_UMGEHUNG_GROESSE */
const SPALTENLAYOUT_UMGEHUNG_GROESSE = 18;

// ---- Suchen ----

export interface StepLocation {
  step: Step;
  seq: StepSequence;
  index: number;
}

export function locateStep(d: Diagram, id: string): StepLocation | undefined {
  const walk = (seq: StepSequence): StepLocation | undefined => {
    for (let index = 0; index < seq.steps.length; index++) {
      const step = seq.steps[index];
      if (step.id === id) return { step, seq, index };
      for (const sub of childSequences(step)) {
        const found = walk(sub);
        if (found) return found;
      }
    }
    for (const c of seq.catchArea?.catchSequences ?? []) {
      const found = walk(c);
      if (found) return found;
    }
    return undefined;
  };
  return walk(d.mainSequence);
}

/**
 * Schritt, zu dem ein Pfad gehört (SchrittSequenzView.findeSchritt): der innerste Schritt, in dessen Text oder
 * Zweig-Überschrift der Pfad liegt. Intro, Outro und Catch-Überschriften gehören zu keinem Schritt.
 */
export function stepOfPath(d: Diagram, path: string): Step | undefined {
  const parts = path.split('/');
  for (let n = parts.length; n > 0; n--) {
    const prefix = parts.slice(0, n).join('/');
    if (!/\/steps\/\d+$/.test(prefix)) continue;
    const rest = parts.slice(n);
    // Text des Schritts oder Überschrift eines seiner Zweige
    if (rest[0] === 'content' || (rest[1] === 'heading' && rest[0] !== 'catchArea') || (rest[2] === 'heading' && rest[0] === 'caseSequences')) {
      return resolvePath(d, prefix) as Step;
    }
  }
  return undefined;
}

/** Zweig eines Case-Schritts, in dessen Überschrift der Pfad liegt: 0 = Sonst, ab 1 die Fälle */
export function caseBranchOfPath(d: Diagram, path: string): { step: CaseStep; branch: number } | undefined {
  const m = /^(.*\/steps\/\d+)\/(defaultSequence|caseSequences\/(\d+))\/heading\//.exec(path);
  if (!m) return undefined;
  const step = resolvePath(d, m[1]) as Step;
  if (step?.kind !== 'case') return undefined;
  return { step, branch: m[3] === undefined ? 0 : Number(m[3]) + 1 };
}

// ---- Neue Schritte (Anfangsinhalte wie im Original, TextInit und *SchrittView-Konstruktoren) ----

const aligned = (align: 'center' | 'right', text: string): EditorContent => ({
  areas: [{ kind: 'text', text: `<div align='${align}'>${text}</div>`, plainText: text, markups: [] }],
});

const base = (text: EditorContent) => ({ id: generateId(), stepNumber: '', content: text, decorationStyle: 'None' as const, tags: [] });

/** einfachenSchrittAnhaengen in einer neuen Sequenz: „Neuer Schritt 1“ */
const initialSequence = (): StepSequence => ({ id: generateId(), steps: [createStep('simple', 1)] });
const branch = (heading: EditorContent): BranchSequence => ({ ...initialSequence(), heading });

/** Neuer Schritt; n ist die Nummer im Anfangstext (Anzahl der Schritte in der Sequenz + 1) */
export function createStep(kind: NewStepKind, n: number): Step {
  switch (kind) {
    case 'simple':
      return { kind, ...base(content(`Neuer Schritt ${n}`)) };
    case 'while':
    case 'doWhile':
      return { kind, ...base(content(`Neue Schleife ${n}`)), collapsed: false, loopSequence: initialSequence(), barWidth: SPALTENLAYOUT_UMGEHUNG_GROESSE };
    case 'ifElse':
      return { kind, ...base(aligned('center', `If-Else ${n}`)), collapsed: false, ifSequence: branch(content('Ja')), elseSequence: branch(aligned('right', 'Nein')), ifWidthRatio: 0.5 };
    case 'if':
      return { kind, ...base(aligned('center', `If ${n}`)), collapsed: false, ifSequence: branch(aligned('right', 'Ja')), emptyWidth: SPALTENLAYOUT_UMGEHUNG_GROESSE + 2 };
    case 'case':
      return {
        kind,
        ...base(content(`Case-${n}`)),
        collapsed: false,
        defaultSequence: branch(content('Sonst')),
        caseSequences: [branch(content('Fall 1')), branch(content('Fall 2'))],
        columnWidthRatios: [1 / 3, 1 / 3, 1 / 3],
      };
    case 'subsequence':
      return { kind, ...base(content(`<b>Subsequenz ${n}</b>`)), collapsed: false, subsequence: initialSequence(), flatNumbering: false };
    case 'break':
      return { kind, ...base(content(`<b>Exception ${n}</b>`)) };
  }
}

// ---- Operationen ----

/** Rahmen für Strukturänderungen: danach neu nummerieren und Schrittverweise umschreiben */
function restructure<T>(d: Diagram, op: () => T): T {
  const before = stepNumbersById(d);
  const result = op();
  renumber(d);
  rewriteSteplinks(d, numberMapping(before, stepNumbersById(d)));
  return result;
}

/** Fokus ans Ende des ersten Texts eines Objekts (Schritt, Zweig-Überschrift); Swing setzt den Cursor nach setText ans Ende */
function focusFirstText(d: Diagram, obj: object): Focus | undefined {
  const paths = indexPaths(d);
  const ec = 'content' in obj ? (obj as Step).content : (obj as BranchSequence).heading;
  const path = paths.get(ec.areas[0]);
  return path === undefined ? undefined : { path };
}

/**
 * AbstractCreateStepOpButton.execute: neuen Schritt hinter dem Schritt einfügen, in dem der Cursor steht,
 * ohne solchen Schritt am Ende der Hauptsequenz anhängen.
 */
export function insertStep(d: Diagram, kind: NewStepKind, afterStepId: string | undefined): Focus | undefined {
  return restructure(d, () => {
    const loc = afterStepId !== undefined ? locateStep(d, afterStepId) : undefined;
    const seq = loc?.seq ?? d.mainSequence;
    const step = createStep(kind, seq.steps.length + 1);
    const existing = stepNumbersById(d);
    while (existing.has(step.id)) step.id = generateId();
    seq.steps.splice(loc ? loc.index + 1 : seq.steps.length, 0, step);
    return focusFirstText(d, step);
  });
}

/** Alle Schritt-IDs eines Schritts mit seinen Unterschritten */
export function stepTreeIds(step: Step): string[] {
  const ids = [step.id];
  for (const seq of childSequences(step)) {
    for (const s of seq.steps) ids.push(...stepTreeIds(s));
    for (const c of seq.catchArea?.catchSequences ?? []) for (const s of c.steps) ids.push(...stepTreeIds(s));
  }
  return ids;
}

/**
 * DeleteStepADBLOp ohne Änderungsverfolgung: Schritt entfernen, der letzte einer Sequenz bleibt.
 * Catch-Sequenzen und Co-Catches, die einen entfernten Break-Schritt fangen, verschwinden mit.
 * @returns Fokus auf den vorigen (bzw. beim ersten den nächsten) Schritt
 */
export function deleteStep(d: Diagram, stepId: string): Focus | undefined {
  const loc = locateStep(d, stepId);
  if (!loc) throw new EditException('Schritt nicht gefunden');
  if (loc.seq.steps.length <= 1) throw new EditException('Der letzte Schritt kann nicht entfernt werden.');
  return restructure(d, () => {
    const removed = new Set(stepTreeIds(loc.step));
    loc.seq.steps.splice(loc.index, 1);
    removeCatchesOf(d.mainSequence, removed);
    const next = loc.seq.steps[loc.index === 0 ? 0 : loc.index - 1];
    return focusFirstText(d, next);
  });
}

function removeCatchesOf(seq: StepSequence, breakIds: Set<string>): void {
  for (const s of seq.steps) childSequences(s).forEach((c) => removeCatchesOf(c, breakIds));
  const area = seq.catchArea;
  if (!area) return;
  const keep = area.catchSequences.map((c) => !breakIds.has(c.id));
  if (area.sequencesWidthPercent?.length === area.catchSequences.length) area.sequencesWidthPercent = area.sequencesWidthPercent.filter((_, i) => keep[i]);
  area.catchSequences = area.catchSequences.filter((_, i) => keep[i]);
  for (const c of area.catchSequences) {
    c.coCatches = c.coCatches.filter((cc) => !breakIds.has(cc.breakStepId));
    removeCatchesOf(c, breakIds);
  }
  if (area.catchSequences.length === 0) delete seq.catchArea;
}

/** Spaltenanteile auf die richtige Länge bringen (fehlen sie, gelten gleiche Anteile) */
function ratios(step: CaseStep): number[] {
  const n = step.caseSequences.length + 1;
  return step.columnWidthRatios.length === n ? [...step.columnWidthRatios] : new Array(n).fill(1 / n);
}

/**
 * CaseSchrittView.neuenZweigHinzufuegen: neuer Fall rechts neben dem Zweig mit dem Cursor (0 = Sonst).
 * Die neue Spalte bekommt die Durchschnittsbreite, die anderen geben anteilig ab.
 */
export function addCaseBranch(d: Diagram, stepId: string, leftBranch: number): Focus | undefined {
  const loc = locateStep(d, stepId);
  if (loc?.step.kind !== 'case') throw new EditException('Kein Case-Schritt ausgewählt');
  const step = loc.step;
  return restructure(d, () => {
    const r = ratios(step);
    const share = 1 / (r.length + 1);
    const newRatios = r.map((x) => x * (1 - share));
    newRatios.splice(leftBranch + 1, 0, share);
    const b = branch(content(`Fall ${leftBranch + 1}`));
    step.caseSequences.splice(leftBranch, 0, b);
    step.columnWidthRatios = newRatios;
    return focusFirstText(d, b);
  });
}

/** CaseSchrittView.zweigEntfernen: Sonst bleibt, ebenso mindestens zwei Fälle */
export function removeCaseBranch(d: Diagram, stepId: string, branchIndex: number): Focus | undefined {
  const loc = locateStep(d, stepId);
  if (loc?.step.kind !== 'case') throw new EditException('Kein Case-Schritt ausgewählt');
  const step = loc.step;
  if (branchIndex === 0) throw new EditException('Der Sonst-Zweig kann nicht entfernt werden.');
  if (step.caseSequences.length <= 2) throw new EditException('Es müssen mindestens 2 Fälle bestehen bleiben.');
  return restructure(d, () => {
    const r = ratios(step);
    const removed = new Set(step.caseSequences[branchIndex - 1].steps.flatMap(stepTreeIds));
    step.caseSequences.splice(branchIndex - 1, 1);
    r.splice(branchIndex, 1);
    const sum = r.reduce((a, b) => a + b, 0) || 1;
    step.columnWidthRatios = r.map((x) => x / sum);
    removeCatchesOf(d.mainSequence, removed);
    return focusFirstText(d, step);
  });
}
