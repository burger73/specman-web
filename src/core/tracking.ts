// Änderungen übernehmen, verwerfen, Change Sets zusammenführen, für das Review zuklappen.
// Port von aenderungenUebernehmen/aenderungenVerwerfen der Views und EditAreas, ChangeSetMerger und ReviewCollapser.
// Übernehmen und Verwerfen gelten wie im Original immer für das ganze Diagramm und nur für ein Change Set.
// Text-Markups bearbeitet ein TextTracker (HTML, braucht das DOM, siehe ui/texttrack.ts), alles andere ist Modell.
import { removeAreaAt, dropTableColumn } from './areas.ts';
import { DEFAULT_CHANGE_SET } from './changesets.ts';
import { EditException, forEachStep } from './editor.ts';
import type {
  Aenderungsart,
  BranchSequence,
  CatchSequence,
  ChangeInfo,
  Diagram,
  EditArea,
  EditorContent,
  Markup,
  Step,
  StepSequence,
  TableEditArea,
  TextEditArea,
} from './model.ts';
import { childSequences } from './model.ts';
import { renumber } from './numbering.ts';
import { numberMapping, rewriteSteplinks, stepNumbersById } from './steplinks.ts';

/** Übernehmen und Verwerfen der Änderungs-Markups im Text einer Area (TextEditArea.aenderungenUebernehmen/-Verwerfen) */
export interface TextTracker {
  /** gestrichenen Text des Change Sets entfernen, übrige Markups des Sets auflösen; liefert die Zahl der Änderungen */
  accept(area: TextEditArea, cs: string): number;
  /** hinzugefügten Text des Change Sets entfernen, Streichungen des Sets aufheben; liefert die Zahl der Änderungen */
  reject(area: TextEditArea, cs: string): number;
}

type Mode = 'accept' | 'reject';

const changedBy = (ci: ChangeInfo | undefined, cs: string): boolean => ci?.changeset === cs;
const is = (ci: ChangeInfo | undefined, cs: string, art: Aenderungsart): boolean => changedBy(ci, cs) && ci!.changetype === art;
/** ChangeInfo.numChangesBy */
const num = (ci: ChangeInfo | undefined, cs: string): number => (changedBy(ci, cs) ? 1 : 0);

/** Change Set eines Änderungs-Markups (ohne Angabe gilt das Standard-Set) */
export function markupChangeset(m: Markup): string | undefined {
  return m.type === 'Steplink' ? undefined : (m.changeset ?? DEFAULT_CHANGE_SET.name);
}

/** Der Text hat Änderungs-Markups des Change Sets */
export function textChangedBy(area: TextEditArea, cs: string): boolean {
  return area.markups.some((m) => markupChangeset(m) === cs);
}

// ---- Übernehmen / Verwerfen ----

class Resolver {
  count = 0;
  /** IDs entfernter Schritte, deren Catch-Sequenzen mit verschwinden */
  readonly removed = new Set<string>();

  private readonly d: Diagram;
  private readonly cs: string;
  private readonly mode: Mode;
  private readonly text: TextTracker;

  constructor(d: Diagram, cs: string, mode: Mode, text: TextTracker) {
    this.d = d;
    this.cs = cs;
    this.mode = mode;
    this.text = text;
  }

  run(): number {
    const { d } = this;
    if (d.intro) this.content(d.intro);
    this.sequence(d.mainSequence);
    if (d.outro) this.content(d.outro);
    return this.count;
  }

  // ---- Edit-Areas ----

  /** EditContainer.aenderungenUebernehmen/-Verwerfen */
  content(ec: EditorContent): void {
    const start = this.count;
    for (const area of [...ec.areas]) {
      const index = ec.areas.indexOf(area);
      if (index >= 0) this.area(ec, index, area);
    }
    // Wie in EditContainer.aenderungenVerwerfen ein zweiter Durchlauf: Ist eine Area verschwunden, kann ein Text in den
    // vorangehenden gewandert sein und dort noch Markierungen haben (im Original nur beim Verwerfen, beim Übernehmen
    // blieben sie dann stehen)
    if (this.count !== start) this.content(ec);
  }

  private removeArea(ec: EditorContent, index: number): void {
    // die erste Area eines Inhalts ist immer ein Text und bleibt (das Original hätte sonst einen Inhalt ohne Kopf)
    if (index === 0) ec.areas[0] = { kind: 'text', text: '', plainText: '', markups: [] };
    else removeAreaAt(ec, index);
  }

  private area(ec: EditorContent, index: number, area: EditArea): void {
    const { cs, mode } = this;
    const ci = area.changeInfo;
    switch (area.kind) {
      case 'text': {
        this.count += num(ci, cs);
        if (mode === 'reject' && is(ci, cs, 'Hinzugefuegt')) {
          this.removeArea(ec, index);
          return;
        }
        // gelöschter Text: das Original stellt beim Verwerfen das Backup her, hier ist der Text unverändert geblieben
        if (!(mode === 'reject' && is(ci, cs, 'Geloescht'))) this.count += mode === 'accept' ? this.text.accept(area, cs) : this.text.reject(area, cs);
        break;
      }
      case 'listItem':
        // AbstractListItemEditArea
        this.count += num(ci, cs);
        if (is(ci, cs, mode === 'accept' ? 'Geloescht' : 'Hinzugefuegt')) {
          this.removeArea(ec, index);
          this.count++;
          return;
        }
        this.content(area.content);
        break;
      case 'table':
        this.count += num(ci, cs);
        if (this.table(area)) {
          this.removeArea(ec, index);
          this.count++;
          return;
        }
        break;
      case 'plantuml':
        // PlantUmlImageEditArea: geänderter Quelltext mit Backup
        if (area.backupSource !== undefined && area.backupChangeset === cs) {
          if (mode === 'reject') area.source = area.backupSource;
          delete area.backupSource;
          delete area.backupChangeset;
          this.count++;
          return;
        }
      // fall through
      default:
        // AbstractImageEditArea
        this.count += num(ci, cs);
        if (is(ci, cs, mode === 'accept' ? 'Geloescht' : 'Hinzugefuegt')) {
          this.removeArea(ec, index);
          return;
        }
    }
    if (changedBy(area.changeInfo, cs)) delete area.changeInfo;
  }

  /** TableEditArea: liefert true, wenn die ganze Tabelle verschwindet */
  private table(t: TableEditArea): boolean {
    const { cs, mode } = this;
    const art: Aenderungsart = mode === 'accept' ? 'Geloescht' : 'Hinzugefuegt';
    if (is(t.changeInfo, cs, art) || t.cells.every((row) => row.every((cell) => cellMarkedAs(cell, cs, art)))) return true;
    for (let r = 0; r < t.cells.length; r++) {
      if (t.cells[r].every((cell) => cellMarkedAs(cell, cs, art))) {
        t.cells.splice(r--, 1);
        this.count++;
      }
    }
    for (let c = 0; c < (t.cells[0]?.length ?? 0); c++) {
      if (t.cells.every((row) => cellMarkedAs(row[c], cs, art))) {
        dropTableColumn(t, c--);
        this.count++;
      }
    }
    for (const row of t.cells) for (const cell of row) this.content(cell);
    if (changedBy(t.changeInfo, cs)) delete t.changeInfo;
    return false;
  }

  // ---- Sequenzen und Schritte ----

  /** SchrittSequenzView.aenderungenUebernehmen/-Verwerfen */
  sequence(seq: StepSequence): void {
    const { cs } = this;
    if (this.mode === 'reject') this.count += num(seq.changeInfo, cs);
    for (const step of [...seq.steps]) {
      // ein verworfener Zielschritt kann inzwischen woanders stehen
      if (seq.steps.includes(step)) this.step(step, seq);
    }
    if (changedBy(seq.changeInfo, cs)) delete seq.changeInfo;
    for (const c of [...(seq.catchArea?.catchSequences ?? [])]) this.catchSequence(c, seq);
  }

  /** ZweigSchrittSequenzView: Überschrift und Schritte */
  private branch(seq: BranchSequence): void {
    this.content(seq.heading);
    this.sequence(seq);
  }

  /** AbstractSchrittView und die Überschreibungen der strukturierten Schritte */
  private step(step: Step, seq: StepSequence): void {
    const { cs, mode } = this;
    this.content(step.content);
    // CaseSchrittView: gelöschte (bzw. hinzugefügte) Zweige des Sets verschwinden, die anderen werden bearbeitet
    if (step.kind === 'case') {
      this.branch(step.defaultSequence);
      for (const b of [...step.caseSequences]) {
        if (is(b.changeInfo, cs, mode === 'accept' ? 'Geloescht' : 'Hinzugefuegt')) {
          this.removeBranch(step, b);
          this.count++;
        } else this.branch(b);
      }
    }
    let gone = false;
    if (changedBy(step.changeInfo, cs)) {
      this.count++;
      const art = step.changeInfo!.changetype;
      if (mode === 'accept') {
        if (art === 'Geloescht' || art === 'Quellschritt') gone = this.removeStep(step, seq);
        else if (art === 'Zielschritt') delete step.sourceStepId;
      } else {
        if (art === 'Hinzugefuegt') gone = this.removeStep(step, seq);
        else if (art === 'Zielschritt') this.moveBack(step, seq);
        else if (art === 'Quellschritt') delete step.sourceStepId;
      }
      delete step.changeInfo;
    }
    if (gone || step.kind === 'case') return;
    if (step.kind === 'ifElse') {
      this.branch(step.ifSequence);
      this.branch(step.elseSequence);
    } else if (step.kind === 'if') this.branch(step.ifSequence);
    else for (const sub of childSequences(step)) this.sequence(sub);
  }

  /** SchrittSequenzView.checkSchrittEntfernen/schrittEntfernen mit Purpose Accept bzw. Reject */
  private removeStep(step: Step, seq: StepSequence): boolean {
    if (seq.steps.length <= 1) {
      // die Sequenz verschwindet selbst mit derselben Änderung, dann bleibt ihr letzter Schritt stehen
      if (sameChange(seq.changeInfo, step.changeInfo)) return false;
      throw new EditException('Der letzte Schritt kann nicht entfernt werden.');
    }
    const index = seq.steps.indexOf(step);
    seq.steps.splice(index, 1);
    updateFollowingDecoration(seq, index);
    for (const s of forEachStepIn(step)) this.removed.add(s);
    return true;
  }

  /** Verwerfen eines Zielschritts: zurück an die Stelle des Quellschritts, der Quellschritt verschwindet */
  private moveBack(step: Step, seq: StepSequence): void {
    const source = step.sourceStepId !== undefined ? findStep(this.d.mainSequence, step.sourceStepId) : undefined;
    delete step.sourceStepId;
    if (!source) return;
    // schrittEntfernen mit Purpose Move: der letzte Schritt einer Sequenz bleibt
    if (seq.steps.length <= 1) throw new EditException('Der letzte Schritt kann nicht entfernt werden.');
    const index = seq.steps.indexOf(step);
    seq.steps.splice(index, 1);
    updateFollowingDecoration(seq, index);
    const at = source.seq.steps.indexOf(source.step);
    source.seq.steps.splice(at, 1, step);
    this.removed.add(source.step.id);
  }

  private removeBranch(step: Step & { kind: 'case' }, b: BranchSequence): void {
    const i = step.caseSequences.indexOf(b);
    const n = step.caseSequences.length + 1;
    const r = step.columnWidthRatios.length === n ? [...step.columnWidthRatios] : new Array(n).fill(1 / n);
    step.caseSequences.splice(i, 1);
    r.splice(i + 1, 1);
    const sum = r.reduce((a, x) => a + x, 0) || 1;
    step.columnWidthRatios = r.map((x) => x / sum);
    for (const s of b.steps) for (const id of forEachStepIn(s)) this.removed.add(id);
  }

  /** CatchSchrittSequenzView und CatchUeberschrift */
  private catchSequence(c: CatchSequence, seq: StepSequence): void {
    const { cs, mode } = this;
    const area = seq.catchArea!;
    if (is(c.changeInfo, cs, mode === 'accept' ? 'Geloescht' : 'Hinzugefuegt')) {
      removeCatch(seq, c);
      this.count++;
      return;
    }
    this.count += num(c.changeInfo, cs);
    if (changedBy(c.changeInfo, cs)) delete c.changeInfo;
    this.content(c.heading);
    for (const cc of [...c.coCatches]) {
      this.count += num(cc.changeInfo, cs);
      if (is(cc.changeInfo, cs, mode === 'accept' ? 'Geloescht' : 'Hinzugefuegt')) {
        c.coCatches.splice(c.coCatches.indexOf(cc), 1);
        continue;
      }
      if (changedBy(cc.changeInfo, cs)) delete cc.changeInfo;
      this.content(cc.heading);
    }
    // Schritte der Catch-Sequenz
    if (area.catchSequences.includes(c)) this.sequence(c);
  }
}

function sameChange(a: ChangeInfo | undefined, b: ChangeInfo | undefined): boolean {
  return a?.changetype === b?.changetype && a?.changeset === b?.changeset;
}

function forEachStepIn(step: Step): string[] {
  const ids: string[] = [];
  forEachStep({ id: '', steps: [step] }, (s) => ids.push(s.id));
  return ids;
}

function findStep(seq: StepSequence, id: string): { step: Step; seq: StepSequence } | undefined {
  for (const step of seq.steps) {
    if (step.id === id) return { step, seq };
    for (const sub of childSequences(step)) {
      const f = findStep(sub, id);
      if (f) return f;
    }
  }
  for (const c of seq.catchArea?.catchSequences ?? []) {
    const f = findStep(c, id);
    if (f) return f;
  }
  return undefined;
}

/** wie steps.updateFollowingStepDecoration (ohne Import-Zyklus) */
function updateFollowingDecoration(seq: StepSequence, followerIndex: number): void {
  const follower = seq.steps[followerIndex];
  if (!follower || follower.decorationStyle === 'None') return;
  const preceding = followerIndex > 0 ? seq.steps[followerIndex - 1].decorationStyle : 'None';
  follower.decorationStyle = preceding === 'None' ? 'Full' : 'Co';
}

function removeCatch(seq: StepSequence, c: CatchSequence): void {
  const area = seq.catchArea!;
  const i = area.catchSequences.indexOf(c);
  if (area.sequencesWidthPercent?.length === area.catchSequences.length) area.sequencesWidthPercent.splice(i, 1);
  area.catchSequences.splice(i, 1);
  if (area.catchSequences.length === 0) delete seq.catchArea;
}

/** Catch-Sequenzen und Co-Catches entfernter Break-Schritte verschwinden mit (wie beim Löschen in Phase 1) */
function removeCatchesOf(seq: StepSequence, breakIds: Set<string>): void {
  for (const s of seq.steps) childSequences(s).forEach((c) => removeCatchesOf(c, breakIds));
  const area = seq.catchArea;
  if (!area) return;
  for (const c of [...area.catchSequences]) if (breakIds.has(c.id)) removeCatch(seq, c);
  for (const c of seq.catchArea?.catchSequences ?? []) {
    c.coCatches = c.coCatches.filter((cc) => !breakIds.has(cc.breakStepId));
    removeCatchesOf(c, breakIds);
  }
}

/** Zelle gilt als markiert, wenn alle ihre Areas diese Änderung des Sets tragen (EditContainer.isMarkedAs) */
function cellMarkedAs(cell: EditorContent, cs: string, art: Aenderungsart): boolean {
  return cell.areas.every((a) => is(a.changeInfo, cs, art));
}

function resolve(d: Diagram, cs: string, mode: Mode, text: TextTracker): number {
  const before = stepNumbersById(d);
  const r = new Resolver(d, cs, mode, text);
  const count = r.run();
  if (r.removed.size > 0) removeCatchesOf(d.mainSequence, r.removed);
  renumber(d);
  // Verweise auf entfernte Schritte werden defekt (markStepnumberLinksAsDefect), die übrigen folgen der Nummerierung
  rewriteSteplinks(d, numberMapping(before, stepNumbersById(d)));
  return count;
}

/** AcceptChangesADBLOpButton: alle Änderungen des Change Sets übernehmen; liefert die Zahl der Änderungen */
export function acceptChanges(d: Diagram, cs: string, text: TextTracker): number {
  return resolve(d, cs, 'accept', text);
}

/** RejectChangesADBLOpButton: alle Änderungen des Change Sets verwerfen */
export function rejectChanges(d: Diagram, cs: string, text: TextTracker): number {
  return resolve(d, cs, 'reject', text);
}

/** Meldung, wenn es nichts zu übernehmen oder verwerfen gab (msg.changes.none) */
export const NO_CHANGES_MESSAGE = 'Das Diagramm enthält keine Änderungen für das aktuelle ChangeSet.';

// ---- Zusammenführen ----

/** ChangeSetMerger (mit Markups): alle Änderungen des Sets source werden Änderungen von target */
export function mergeChangeSets(d: Diagram, target: string, source: string): void {
  const walk = (value: unknown): void => {
    if (value === null || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    const o = value as Record<string, unknown>;
    const ci = o.changeInfo as ChangeInfo | undefined;
    if (ci?.changeset === source) o.changeInfo = { ...ci, changeset: target };
    if (o.kind === 'text') {
      for (const m of (o as unknown as TextEditArea).markups) if (markupChangeset(m) === source) m.changeset = target;
    }
    if (o.kind === 'plantuml' && o.backupChangeset === source) o.backupChangeset = target;
    for (const [k, v] of Object.entries(o)) if (k !== 'changeInfo') walk(v);
  };
  walk(d.mainSequence);
  walk(d.intro);
  walk(d.outro);
}

// ---- Review ----

/** FirstChangeSetFinder: erstes Change Set in Inhalten (Text-Markups, Area-Änderungen) */
export function firstChangeInContent(ec: EditorContent): string | undefined {
  for (const a of ec.areas) {
    if (a.changeInfo) return a.changeInfo.changeset;
    if (a.kind === 'text') {
      const m = a.markups.find((m) => m.type !== 'Steplink');
      if (m) return markupChangeset(m);
    }
    if (a.kind === 'plantuml' && a.backupChangeset) return a.backupChangeset;
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

/**
 * Erstes Change Set in einer Sequenz. Schritte und Sequenzen zählen mit ihrer eigenen Änderung: Im Original stehen
 * die Markierungen dann auch an den Texten (Markup über den ganzen Text bzw. gelöschte Areas).
 */
export function firstChangeInSequence(seq: StepSequence): string | undefined {
  if (seq.changeInfo) return seq.changeInfo.changeset;
  if ('heading' in seq) {
    const cs = firstChangeInContent((seq as BranchSequence).heading);
    if (cs) return cs;
  }
  for (const s of seq.steps) {
    const cs = firstChangeInStep(s);
    if (cs) return cs;
  }
  for (const c of seq.catchArea?.catchSequences ?? []) {
    const cs = firstChangeInCatch(c);
    if (cs) return cs;
  }
  return undefined;
}

function firstChangeInCatch(c: CatchSequence): string | undefined {
  return c.changeInfo?.changeset ?? c.coCatches.find((cc) => cc.changeInfo)?.changeInfo?.changeset ?? firstChangeInSequence(c);
}

/** AbstractSchrittView.firstChangeSet: der Schritt selbst, sein Text und alle Unterschritte */
export function firstChangeInStep(step: Step): string | undefined {
  if (step.changeInfo) return step.changeInfo.changeset;
  const cs = firstChangeInContent(step.content);
  if (cs) return cs;
  for (const seq of childSequences(step)) {
    const inner = firstChangeInSequence(seq);
    if (inner) return inner;
  }
  return undefined;
}

/** ReviewCollapser: klappbare Schritte und Catch-Bereiche ohne Änderungsmarkierungen zuklappen, aufgeklappt wird nichts */
export function collapseForReview(d: Diagram): void {
  const walk = (seq: StepSequence) => {
    for (const s of seq.steps) {
      if ('collapsed' in s && !firstChangeInStep(s)) s.collapsed = true;
      childSequences(s).forEach(walk);
    }
    const area = seq.catchArea;
    if (area) {
      if (!area.catchSequences.some(firstChangeInCatch)) area.collapsed = true;
      area.catchSequences.forEach(walk);
    }
  };
  walk(d.mainSequence);
}
