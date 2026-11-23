// Catch-Sequenzen anlegen, entfernen und mit ihrem Break-Schritt abgleichen. Port von CreateCatchSequenceADBLOpButton,
// CatchLinkPanel (UnlinkedBreakStepCollector, choose), CatchBereich.catchSequenzAnhaengenUDBL,
// CatchSchrittSequenzView.addCoCatchUDBL/removeOrMarkAsDeletedUDBL und CatchUeberschrift (Abgleich beim Verlassen).
import type { Focus } from './editor.ts';
import { EditException } from './editor.ts';
import type { BreakStep, CatchSequence, ChangeInfo, CoCatch, Diagram, EditorContent, Step, StepSequence, TextEditArea } from './model.ts';
import { childSequences } from './model.ts';
import { renumber } from './numbering.ts';
import { indexPaths, resolvePath } from './paths.ts';
import { added, markContentDeleted, markSequenceDeleted, markStepAdded, trackingSet } from './recording.ts';
import { createStep, locateStep, stepOfPath } from './steps.ts';

/** HEADING_RIGHT_BAR_WIDTH bzw. Standard beim Lesen */
const HEADING_RIGHT_BAR_WIDTH = 18;

/** Catch-Überschrift, in der ein Pfad liegt: Sequenz mit dem Catch-Bereich, Catch-Sequenz, Co-Catch (-1 = primär) */
export interface CatchHeadingLocation {
  seq: StepSequence;
  catchSeq: CatchSequence;
  coIndex: number;
}

export function catchHeadingOfPath(d: Diagram, path: string): CatchHeadingLocation | undefined {
  const m = /^(.*)\/catchArea\/catchSequences\/(\d+)\/(?:heading|coCatches\/(\d+)\/heading)\/areas\/\d+$/.exec(path);
  if (!m) return undefined;
  const seq = (m[1] === 'mainSequence' ? d.mainSequence : resolvePath(d, m[1])) as StepSequence | undefined;
  const catchSeq = seq?.catchArea?.catchSequences[Number(m[2])];
  if (!seq || !catchSeq) return undefined;
  return { seq, catchSeq, coIndex: m[3] === undefined ? -1 : Number(m[3]) };
}

/**
 * Sequenz, für die der Catch-Dialog Break-Schritte anbietet (CreateCatchSequenceADBLOpButton.execute): die Sequenz des
 * Schritts mit dem Cursor; steht er in einer Catch-Überschrift, die Sequenz mit diesem Catch-Bereich.
 */
export function catchTargetOfPath(d: Diagram, path: string): { seq: StepSequence; heading?: CatchHeadingLocation } | undefined {
  const heading = catchHeadingOfPath(d, path);
  if (heading) return { seq: heading.seq, heading };
  const step = stepOfPath(d, path);
  const loc = step ? locateStep(d, step.id) : undefined;
  return loc ? { seq: loc.seq } : undefined;
}

/** Ist der Break-Schritt schon mit einer Catch-Sequenz oder einem Co-Catch verknüpft? (BreakSchrittView.isLinked) */
export function isLinked(d: Diagram, breakId: string): boolean {
  const walk = (seq: StepSequence): boolean =>
    seq.steps.some((s) => childSequences(s).some(walk)) ||
    (seq.catchArea?.catchSequences ?? []).some((c) => c.id === breakId || c.coCatches.some((cc) => cc.breakStepId === breakId) || walk(c));
  return walk(d.mainSequence);
}

/** UnlinkedBreakStepCollector: unverknüpfte Break-Schritte der Sequenz samt Unterschritten, ohne Catch-Bereiche */
export function unlinkedBreakSteps(d: Diagram, seq: StepSequence): BreakStep[] {
  const out: BreakStep[] = [];
  const walk = (s: StepSequence) => {
    for (const step of s.steps) {
      if (step.kind === 'break' && !isLinked(d, step.id)) out.push(step);
      childSequences(step).forEach(walk);
    }
  };
  walk(seq);
  return out;
}

/** Eintrag im Dialog (AbstractSchrittView.toString, gekürzt auf MAXIMAL_REFERENCE_TEXTLENGTH) */
export function breakStepLabel(step: Step): string {
  return `${step.stepNumber} - ${(step.content.areas[0] as TextEditArea).plainText}`.substring(0, 60);
}

/**
 * Überschrift aus dem Inhalt des Break-Schritts (getEditorContent). initHeadingChangeSet: Ist der Break-Schritt in
 * einem anderen Change Set geändert, gehören die Änderungen der Areas zum aktuellen Set.
 */
function headingFrom(d: Diagram, brk: Step): EditorContent {
  const heading = structuredClone(brk.content);
  const breakSet = brk.changeInfo?.changeset;
  if (breakSet && breakSet !== d.changeSetName) reassignAreas(heading, breakSet, d.changeSetName);
  return heading;
}

/** ChangeSetMerger ohne Markups: Änderungen der Areas von source nach target */
function reassignAreas(ec: EditorContent, source: string, target: string): void {
  for (const a of ec.areas) {
    if (a.changeInfo?.changeset === source) a.changeInfo = { ...a.changeInfo, changeset: target };
    if (a.kind === 'listItem') reassignAreas(a.content, source, target);
    if (a.kind === 'table') for (const row of a.cells) for (const cell of row) reassignAreas(cell, source, target);
  }
}

/**
 * CatchLinkPanel.choose: zum Break-Schritt eine Catch-Sequenz am Ende des Catch-Bereichs der Sequenz anlegen, oder,
 * wenn der Cursor in einer Catch-Überschrift stand, einen Co-Catch dahinter. Bei eingeschalteter Verfolgung ist das
 * Neue hinzugefügt (TextInit.initialChangeInfo).
 * @returns Fokus auf den ersten Schritt der Catch-Sequenz
 */
export function linkCatch(d: Diagram, focusPath: string, breakId: string): Focus | undefined {
  const target = catchTargetOfPath(d, focusPath);
  const brk = locateStep(d, breakId)?.step;
  if (!target || brk?.kind !== 'break') throw new EditException('Kein Break-Schritt ausgewählt');
  if (isLinked(d, breakId)) throw new EditException('Der Break-Schritt ist schon verknüpft.');
  const cs = trackingSet(d);
  let catchSeq: CatchSequence;
  if (target.heading) {
    catchSeq = target.heading.catchSeq;
    const co: CoCatch = { breakStepId: breakId, heading: headingFrom(d, brk) };
    if (cs) co.changeInfo = added(cs);
    catchSeq.coCatches.splice(target.heading.coIndex + 1, 0, co);
  } else {
    const step = createStep('simple', 1);
    if (cs) markStepAdded(step, cs);
    catchSeq = { id: breakId, heading: headingFrom(d, brk), coCatches: [], headingRightBarWidth: HEADING_RIGHT_BAR_WIDTH, steps: [step] };
    if (cs) catchSeq.changeInfo = added(cs);
    const area = (target.seq.catchArea ??= { catchSequences: [], collapsed: false });
    // ColumnSpecByPercent.allocPercent: die neue Spalte bekommt die Hälfte der letzten
    const p = area.sequencesWidthPercent;
    if (p?.length && p.length === area.catchSequences.length) {
      const half = Math.trunc(p[p.length - 1] / 2);
      p[p.length - 1] = half;
      p.push(half);
    }
    area.catchSequences.push(catchSeq);
  }
  renumber(d);
  const path = indexPaths(d).get(catchSeq.steps[0].content.areas[0]);
  return path === undefined ? undefined : { path };
}

/**
 * DeleteStepADBLOp für Catch-Überschriften: die primäre Überschrift entfernt bzw. markiert die ganze Catch-Sequenz,
 * eine Co-Catch-Überschrift nur sich. Markiert wird bei eingeschalteter Verfolgung, wenn sie nicht hinzugefügt ist.
 */
export function removeOrMarkCatchHeading(d: Diagram, headingPath: string): Focus | undefined {
  const loc = catchHeadingOfPath(d, headingPath);
  if (!loc) throw new EditException('Keine Catch-Überschrift ausgewählt');
  const cs = trackingSet(d);
  const { seq, catchSeq, coIndex } = loc;
  if (coIndex >= 0) {
    const co = catchSeq.coCatches[coIndex];
    if (cs && co.changeInfo?.changetype !== 'Hinzugefuegt') {
      co.changeInfo = deletedInfo(cs);
      markContentDeleted(co.heading, cs);
      return undefined;
    }
    catchSeq.coCatches.splice(coIndex, 1);
    return focusOnFirstStep(d, catchSeq);
  }
  if (cs && catchSeq.changeInfo?.changetype !== 'Hinzugefuegt') {
    // CatchSchrittSequenzView.alsGeloeschtMarkierenUDBL: Sequenz, Schritte, primäre und Co-Catch-Überschriften
    markSequenceDeleted(d, catchSeq, cs);
    for (const co of catchSeq.coCatches) {
      co.changeInfo = deletedInfo(cs);
      markContentDeleted(co.heading, cs);
    }
    return undefined;
  }
  const area = seq.catchArea!;
  const i = area.catchSequences.indexOf(catchSeq);
  if (area.sequencesWidthPercent?.length === area.catchSequences.length) {
    // releasePercent: die Breite geht an die folgende (bzw. vorige) Spalte
    const p = area.sequencesWidthPercent;
    const eater = i === p.length - 1 ? i - 1 : i + 1;
    if (eater >= 0) p[eater] += p[i];
    p.splice(i, 1);
  }
  area.catchSequences.splice(i, 1);
  if (area.catchSequences.length === 0) delete seq.catchArea;
  renumber(d);
  return seq.steps.length ? focusOnStep(d, seq.steps[seq.steps.length - 1]) : undefined;
}

const deletedInfo = (cs: string): ChangeInfo => ({ changetype: 'Geloescht', changeset: cs });

function focusOnFirstStep(d: Diagram, seq: StepSequence): Focus | undefined {
  return focusOnStep(d, seq.steps[0]);
}

function focusOnStep(d: Diagram, step: Step | undefined): Focus | undefined {
  const path = step ? indexPaths(d).get(step.content.areas[0]) : undefined;
  return path === undefined ? undefined : { path };
}

// ---- Abgleich Break-Schritt ↔ Catch-Überschrift ----

/** Alle Überschriften, die den Break-Schritt fangen (primär oder Co-Catch) */
function headingsOf(d: Diagram, breakId: string): { content: () => EditorContent; set: (c: EditorContent) => void; changeInfo?: ChangeInfo; seqDeleted: boolean }[] {
  const out: ReturnType<typeof headingsOf> = [];
  const walk = (seq: StepSequence) => {
    for (const s of seq.steps) childSequences(s).forEach(walk);
    for (const c of seq.catchArea?.catchSequences ?? []) {
      const seqDeleted = c.changeInfo?.changetype === 'Geloescht';
      if (c.id === breakId) out.push({ content: () => c.heading, set: (h) => (c.heading = h), changeInfo: c.changeInfo, seqDeleted });
      for (const cc of c.coCatches) {
        if (cc.breakStepId === breakId) out.push({ content: () => cc.heading, set: (h) => (cc.heading = h), changeInfo: cc.changeInfo, seqDeleted });
      }
      walk(c);
    }
  };
  walk(d.mainSequence);
  return out;
}

const same = (a: EditorContent, b: EditorContent) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Text verlassen (BreakSchrittView.focusLost, CatchUeberschrift.focusLost): Break-Schritt und Catch-Überschrift
 * bekommen denselben Inhalt. Gelöschtes wird nicht abgeglichen.
 * @returns true, wenn sich etwas geändert hat
 */
export function syncCatchHeading(d: Diagram, path: string): boolean {
  const heading = catchHeadingOfPath(d, path);
  if (heading) {
    // updateLinkedBreakStepContent: Überschrift → Break-Schritt
    const co = heading.coIndex >= 0 ? heading.catchSeq.coCatches[heading.coIndex] : undefined;
    const ci = co ? co.changeInfo : heading.catchSeq.changeInfo;
    if (ci?.changetype === 'Geloescht') return false;
    const brk = locateStep(d, co ? co.breakStepId : heading.catchSeq.id)?.step;
    const content = co ? co.heading : heading.catchSeq.heading;
    if (!brk || same(brk.content, content)) return false;
    const copy = structuredClone(content);
    const breakSet = brk.changeInfo?.changeset;
    if (ci?.changeset && breakSet && ci.changeset !== breakSet) reassignAreas(copy, ci.changeset, breakSet);
    brk.content = copy;
    return true;
  }
  // updateFromBreakStepContent: Break-Schritt → Überschriften
  const step = stepOfPath(d, path);
  if (step?.kind !== 'break' || step.changeInfo?.changetype === 'Geloescht') return false;
  let changed = false;
  for (const h of headingsOf(d, step.id)) {
    if (h.seqDeleted || h.changeInfo?.changetype === 'Geloescht' || same(h.content(), step.content)) continue;
    h.set(structuredClone(step.content));
    changed = true;
  }
  return changed;
}
