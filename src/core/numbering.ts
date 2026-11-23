// Schrittnummern neu berechnen, Port von SchrittSequenzView.renummerieren und den setNumber-/
// newStepIDInSameSequence-Überschreibungen der Schritt-Views. Im Original laufen die Nummern über die Views,
// hier über das Modell (siehe PLAN-phase1.md, „Das Modell ist die Wahrheit“).
import { childSequences } from './model.ts';
import type { Diagram, Step, StepSequence } from './model.ts';

type Nr = number[];

const next = (n: Nr): Nr => [...n.slice(0, -1), n[n.length - 1] + 1];
const nextLevel = (n: Nr): Nr => [...n, 0];
const parse = (s: string): Nr => s.split('.').map(Number);

/** Alle Schrittnummern des Diagramms neu vergeben, Catch-Sequenzen nach der Nummer ihres Break-Schritts */
export function renumber(d: Diagram): void {
  renumberSequence(d.mainSequence, [0]);
  const byId = new Map<string, Step>();
  collect(d.mainSequence, byId);
  renumberCatches(d.mainSequence, byId);
}

/** SchrittSequenzView.renummerieren(sequenzBasisId) */
function renumberSequence(seq: StepSequence, base: Nr): void {
  let nr = next(base);
  for (const step of seq.steps) {
    setNumber(step, nr);
    nr = numberAfter(step, nr);
  }
}

/** setNumber der einzelnen Views: eigene Nummer, dann die Teilsequenzen */
function setNumber(step: Step, nr: Nr): void {
  step.stepNumber = nr.join('.');
  switch (step.kind) {
    case 'while':
    case 'doWhile':
      renumberSequence(step.loopSequence, nextLevel(nr));
      break;
    case 'ifElse':
      renumberSequence(step.ifSequence, nextLevel(nr));
      renumberSequence(step.elseSequence, nextLevel(next(nr)));
      break;
    case 'if':
      renumberSequence(step.ifSequence, nextLevel(nr));
      break;
    case 'case': {
      renumberSequence(step.defaultSequence, nextLevel(nr));
      let n = next(nr);
      for (const c of step.caseSequences) {
        renumberSequence(c, nextLevel(n));
        n = next(n);
      }
      break;
    }
    case 'subsequence':
      // flache Nummerierung: die Unterschritte zählen auf der Ebene des Subsequenz-Schritts weiter
      renumberSequence(step.subsequence, step.flatNumbering ? nr : nextLevel(nr));
      break;
  }
}

/** newStepIDInSameSequence(After): Nummer des nächsten Schritts in derselben Sequenz */
function numberAfter(step: Step, nr: Nr): Nr {
  switch (step.kind) {
    case 'ifElse':
      return next(next(nr));
    case 'case':
      return step.caseSequences.reduce((n) => next(n), next(nr));
    case 'subsequence': {
      if (!step.flatNumbering) return next(nr);
      // wie im Original: Nummer des letzten Unterschritts plus eins, ohne dessen eigene Verzweigungen
      const last = step.subsequence.steps[step.subsequence.steps.length - 1];
      return last ? next(parse(last.stepNumber)) : next(nr);
    }
    default:
      return next(nr);
  }
}

function collect(seq: StepSequence, byId: Map<string, Step>): void {
  for (const s of seq.steps) {
    byId.set(s.id, s);
    for (const sub of childSequences(s)) collect(sub, byId);
  }
  for (const c of seq.catchArea?.catchSequences ?? []) collect(c, byId);
}

/** CatchSchrittSequenzView.setId: Basis ist die Nummer des gefangenen Break-Schritts */
function renumberCatches(seq: StepSequence, byId: Map<string, Step>): void {
  for (const s of seq.steps) for (const sub of childSequences(s)) renumberCatches(sub, byId);
  for (const c of seq.catchArea?.catchSequences ?? []) {
    const brk = byId.get(c.id);
    if (brk) renumberSequence(c, nextLevel(parse(brk.stepNumber)));
    renumberCatches(c, byId);
  }
}
