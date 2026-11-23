// Änderungen aufzeichnen, wenn „Änderungen verfolgen“ an ist: neue Elemente als hinzugefügt markieren
// (TextInit.initialChangeInfo/initialModel), gelöschte als gelöscht (alsGeloeschtMarkierenUDBL,
// setGeloeschtMarkiertStilUDBL). Wie im Original (editor().aenderungenVerfolgen()) entscheidet der Zustand des
// Diagramms, die Operationen in steps.ts und areas.ts fragen trackingSet(d).
import type { BranchSequence, ChangeInfo, Diagram, EditArea, EditorContent, Step, StepSequence, TextEditArea } from './model.ts';
import { childSequences } from './model.ts';
import type { TextTracker } from './tracking.ts';

/** Change Set, in dem aufgezeichnet wird, oder undefined bei ausgeschalteter Verfolgung */
export function trackingSet(d: Diagram): string | undefined {
  return d.changeModeEnabled ? d.changeSetName : undefined;
}

let textTracker: TextTracker | undefined;

/** Baustein für Text-Markups beim Markieren als gelöscht (braucht das DOM, die UI meldet ihn beim Start an) */
export function useTextTracker(t: TextTracker): void {
  textTracker = t;
}

function tt(): TextTracker {
  if (!textTracker) throw new Error('Kein TextTracker angemeldet (useTextTracker)');
  return textTracker;
}

/** ChangeInfo.added() */
export const added = (cs: string): ChangeInfo => ({ changetype: 'Hinzugefuegt', changeset: cs });

/** ChangeInfo.deleted(triggerSet) */
const deleted = (cs: string): ChangeInfo => ({ changetype: 'Geloescht', changeset: cs });

/** setAenderungsartUDBL von Schritten und Sequenzen: ein schon vorhandenes Change Set bleibt */
const deletedKeepingSet = (ci: ChangeInfo | undefined, cs: string): ChangeInfo => deleted(ci?.changeset ?? cs);

// ---- Hinzufügen ----

/** TextInit.initialModel: Changed-Markup über den ganzen Text */
export function markTextAdded(t: TextEditArea, cs: string): void {
  t.markups = t.plainText.length > 0 ? [{ from: 0, to: t.plainText.length - 1, type: 'Changed', changeset: cs }] : [];
}

function markContentTextAdded(ec: EditorContent, cs: string): void {
  for (const a of ec.areas) if (a.kind === 'text') markTextAdded(a, cs);
}

/** Neuer Schritt mit allen Anfangsinhalten (Unterschritte, Zweige) */
export function markStepAdded(step: Step, cs: string): void {
  step.changeInfo = added(cs);
  markContentTextAdded(step.content, cs);
  for (const seq of childSequences(step)) markSequenceAdded(seq, cs);
}

export function markSequenceAdded(seq: StepSequence, cs: string): void {
  seq.changeInfo = added(cs);
  if ('heading' in seq) markContentTextAdded((seq as BranchSequence).heading, cs);
  for (const s of seq.steps) markStepAdded(s, cs);
}

/** Neue Area (Tabelle, Bild, Listenpunkt, leerer Text): Tabellenzellen bekommen die Änderung ebenfalls (addInitialCells) */
export function markAreaAdded(area: EditArea, cs: string): void {
  area.changeInfo = added(cs);
  if (area.kind === 'table') for (const row of area.cells) for (const cell of row) for (const a of cell.areas) a.changeInfo = added(cs);
}

// ---- Löschen ----

/**
 * EditContainer.setGeloeschtMarkiertStilUDBL: jede Area als gelöscht markieren. Text verliert vorher die Änderungen
 * des Sets (aenderungenVerwerfen(triggerSet)). Hinzugefügte Texte des Sets und hinzugefügte Bilder verschwinden, der
 * Kopf-Text bleibt.
 */
export function markContentDeleted(ec: EditorContent, cs: string): void {
  for (let i = ec.areas.length - 1; i >= 0; i--) {
    const a = ec.areas[i];
    const isAdded = a.changeInfo?.changetype === 'Hinzugefuegt';
    const image = a.kind === 'image' || a.kind === 'svg' || a.kind === 'plantuml';
    // TextEditArea: hinzugefügt im selben Set; AbstractImageEditArea: hinzugefügt in irgendeinem Set
    if (i > 0 && isAdded && ((a.kind === 'text' && a.changeInfo!.changeset === cs) || image)) {
      ec.areas.splice(i, 1);
      continue;
    }
    markAreaDeleted(a, cs);
  }
}

/** setGeloeschtMarkiertStilUDBL einer Area */
export function markAreaDeleted(a: EditArea, cs: string): void {
  switch (a.kind) {
    case 'text':
      tt().reject(a, cs);
      a.changeInfo = deleted(cs);
      break;
    case 'listItem':
      a.changeInfo = deleted(cs);
      markContentDeleted(a.content, cs);
      break;
    case 'table':
      a.changeInfo = deleted(cs);
      for (const row of a.cells) for (const cell of row) markContentDeleted(cell, cs);
      break;
    default:
      // AbstractImageEditArea: nur unverfolgte Bilder werden markiert
      if (!a.changeInfo) a.changeInfo = deleted(cs);
      if (a.kind === 'plantuml' && a.backupSource !== undefined) {
        // PlantUmlImageEditArea: Gelöschtes zeigt den Quelltext von vor der Änderung
        a.source = a.backupSource;
        delete a.backupSource;
        delete a.backupChangeset;
      }
  }
}

/** AbstractSchrittView.alsGeloeschtMarkierenUDBL (Case ohne Zweig-Auswahl, Break mit seiner Catch-Überschrift) */
export function markStepDeleted(d: Diagram, step: Step, cs: string): void {
  for (const seq of childSequences(step)) markSequenceDeleted(d, seq, cs);
  step.changeInfo = deletedKeepingSet(step.changeInfo, cs);
  markContentDeleted(step.content, step.changeInfo.changeset);
  if (step.kind === 'break') removeOrMarkCatchHeading(d.mainSequence, step.id, cs);
}

/** SchrittSequenzView/ZweigSchrittSequenzView.alsGeloeschtMarkierenUDBL */
export function markSequenceDeleted(d: Diagram, seq: StepSequence, cs: string): void {
  seq.changeInfo = deletedKeepingSet(seq.changeInfo, cs);
  for (const s of seq.steps) markStepDeleted(d, s, cs);
  if ('heading' in seq) markContentDeleted((seq as BranchSequence).heading, seq.changeInfo.changeset);
}

/** CatchUeberschrift.removeOrMarkAsDeletedUDBL für die Überschrift, die den Break-Schritt fängt */
function removeOrMarkCatchHeading(seq: StepSequence, breakId: string, cs: string): boolean {
  const area = seq.catchArea;
  for (const c of area?.catchSequences ?? []) {
    if (c.id === breakId) {
      if (c.changeInfo?.changetype === 'Hinzugefuegt') {
        const i = area!.catchSequences.indexOf(c);
        if (area!.sequencesWidthPercent?.length === area!.catchSequences.length) area!.sequencesWidthPercent.splice(i, 1);
        area!.catchSequences.splice(i, 1);
        if (area!.catchSequences.length === 0) delete seq.catchArea;
      } else {
        c.changeInfo = deleted(cs);
        markContentDeleted(c.heading, cs);
      }
      return true;
    }
    const cc = c.coCatches.find((x) => x.breakStepId === breakId);
    if (cc) {
      if (cc.changeInfo?.changetype === 'Hinzugefuegt') c.coCatches.splice(c.coCatches.indexOf(cc), 1);
      else {
        cc.changeInfo = deleted(cs);
        markContentDeleted(cc.heading, cs);
      }
      return true;
    }
    if (removeOrMarkCatchHeading(c, breakId, cs)) return true;
  }
  for (const s of seq.steps) for (const sub of childSequences(s)) if (removeOrMarkCatchHeading(sub, breakId, cs)) return true;
  return false;
}
