// Pfade ins Diagramm („mainSequence/steps/2/content/areas/0“), um Edit-Areas über Undo-Schnappschüsse und
// Neuzeichnen hinweg wiederzufinden. Das Modell hat für Areas keine IDs, die Datei auch nicht.
import type { Diagram } from './model.ts';

/** Pfad jedes Objekts im Diagramm (Areas, Inhalte, Schritte, Sequenzen) */
export function indexPaths(d: Diagram): Map<object, string> {
  const paths = new Map<object, string>();
  const walk = (value: unknown, path: string): void => {
    if (value === null || typeof value !== 'object') return;
    paths.set(value, path);
    if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}/${i}`));
    else for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}/${k}` : k);
  };
  walk(d, '');
  return paths;
}

/** Objekt zu einem Pfad oder undefined, wenn es ihn (nicht mehr) gibt */
export function resolvePath(d: Diagram, path: string): unknown {
  let cur: unknown = d;
  for (const key of path ? path.split('/') : []) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}
