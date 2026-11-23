// Operationen auf den Edit-Areas eines EditorContents, Port der *UDBL-Methoden von EditContainer,
// AbstractListItemEditArea und TextEditArea. Wo das Original am Cursor schneidet, liefert die UI die Teile
// schon als fertige Text-Areas (HTML zerlegen kann nur das DOM), hier wird nur das Modell umgebaut.
import type { Focus } from './editor.ts';
import { EditException } from './editor.ts';
import type { Diagram, EditArea, EditorContent, ListItemEditArea, TextEditArea } from './model.ts';
import { resolvePath } from './paths.ts';

/** Lage einer Area: Inhalt, in dem sie steht, ihr Index und der Pfad des Inhalts */
export interface AreaLocation {
  container: EditorContent;
  containerPath: string;
  index: number;
  area: EditArea;
}

export function locateArea(d: Diagram, path: string): AreaLocation {
  const m = /^(.*)\/areas\/(\d+)$/.exec(path);
  const container = m ? (resolvePath(d, m[1]) as EditorContent | undefined) : undefined;
  const area = container?.areas?.[Number(m?.[2])];
  if (!m || !container || !area) throw new EditException(`Area ${path} nicht gefunden`);
  return { container, containerPath: m[1], index: Number(m[2]), area };
}

function locateText(d: Diagram, path: string): AreaLocation & { area: TextEditArea } {
  const loc = locateArea(d, path);
  if (loc.area.kind !== 'text') throw new EditException(`${path} ist keine Text-Area`);
  return loc as AreaLocation & { area: TextEditArea };
}

/** Listenpunkt, dessen Inhalt der Container ist, oder undefined */
export function parentListItem(d: Diagram, containerPath: string): { path: string; item: ListItemEditArea } | undefined {
  if (!containerPath.endsWith('/content')) return undefined;
  const path = containerPath.slice(0, -'/content'.length);
  const item = resolvePath(d, path) as EditArea | undefined;
  return item?.kind === 'listItem' ? { path, item } : undefined;
}

const areaPath = (containerPath: string, index: number) => `${containerPath}/areas/${index}`;

const BLOCK_START = /^\s*<(div|p|h\d|ul|ol|pre|blockquote|table)\b/i;
const BLOCK_END = /<\/(div|p|h\d|ul|ol|pre|blockquote|table)>\s*$/i;

/** TextEditArea.appendText: HTML und Textfassung aneinanderhängen, Markups des zweiten Texts verschieben */
export function appendText(target: TextEditArea, trailing: TextEditArea): void {
  // stoßen zwei Absätze aneinander, trennt sie in der Textfassung ein Zeilenumbruch
  const sep = target.plainText !== '' && trailing.plainText !== '' && (BLOCK_END.test(target.text) || BLOCK_START.test(trailing.text)) ? '\n' : '';
  const shift = target.plainText.length + sep.length;
  target.markups = [...target.markups, ...trailing.markups.map((m) => ({ ...m, from: m.from + shift, to: m.to + shift }))];
  target.text = target.text.trim() + trailing.text;
  target.plainText = target.plainText + sep + trailing.plainText;
}

/**
 * EditContainer.addListItemUDBL: Der Absatz mit dem Cursor wird zum Listenpunkt. leading ersetzt die bisherige
 * Area (bleibt auch leer stehen), trailing folgt dem Listenpunkt, wenn es nachfolgende Absätze gab.
 */
export function addListItem(d: Diagram, path: string, ordered: boolean, leading: TextEditArea, caret: TextEditArea, trailing: TextEditArea | undefined): Focus {
  const { container, containerPath, index } = locateText(d, path);
  const item: ListItemEditArea = { kind: 'listItem', ordered, content: { areas: [caret] } };
  container.areas.splice(index, 1, leading, item, ...(trailing ? [trailing] : []));
  return { path: areaPath(`${areaPath(containerPath, index + 1)}/content`, 0), offset: 0 };
}

/**
 * EditContainer.dissolveListItemEditAreaUDBL: Die Areas des Listenpunkts rücken in den umgebenden Inhalt.
 * Steht davor ein Text, wird der erste Text des Listenpunkts angehängt, ebenso ein folgender Text an den letzten.
 * @returns Fokus am Anfang des aufgelösten Texts
 */
export function dissolveListItem(d: Diagram, itemPath: string): Focus {
  const { container, containerPath, index, area } = locateArea(d, itemPath);
  if (area.kind !== 'listItem') throw new EditException(`${itemPath} ist kein Listenpunkt`);
  const lifted = [...area.content.areas];
  const prev = container.areas[index - 1];
  const next = container.areas[index + 1];
  const leadingMerge = prev?.kind === 'text' && lifted[0]?.kind === 'text';
  const trailingMerge = next?.kind === 'text' && lifted[lifted.length - 1]?.kind === 'text';
  let focus: Focus;
  let insertAt = index;
  container.areas.splice(index, 1);
  if (leadingMerge) {
    const prevText = prev as TextEditArea;
    focus = { path: areaPath(containerPath, index - 1), offset: prevText.plainText.length + (prevText.plainText ? 1 : 0) };
    const first = lifted.shift() as TextEditArea;
    // als eigener Absatz anhängen, wie im Original, wo der Listenpunkt zuvor eine eigene Zeile war
    appendText(prevText, asParagraph(first));
    if (lifted.length === 0 && trailingMerge) {
      appendText(prevText, asParagraph(next as TextEditArea));
      container.areas.splice(index, 1);
      return focus;
    }
  } else focus = { path: areaPath(containerPath, index), offset: 0 };
  container.areas.splice(insertAt, 0, ...lifted);
  insertAt += lifted.length;
  if (trailingMerge && lifted.length > 0) {
    const last = container.areas[insertAt - 1] as TextEditArea;
    appendText(last, asParagraph(next as TextEditArea));
    container.areas.splice(insertAt, 1);
  }
  return focus;
}

/** Text in einen eigenen Absatz packen, damit er beim Anhängen nicht in die vorige Zeile rutscht */
function asParagraph(t: TextEditArea): TextEditArea {
  if (BLOCK_START.test(t.text)) return t;
  return { ...t, text: `<div>${t.text}</div>` };
}

/**
 * AbstractListItemEditArea.split (Enter im Listenpunkt): before bleibt im Listenpunkt, after beginnt einen neuen
 * Listenpunkt gleicher Art, dorthin wandern auch alle Areas nach der geteilten.
 */
export function splitListItem(d: Diagram, path: string, before: TextEditArea, after: TextEditArea): Focus {
  const { container, containerPath, index } = locateText(d, path);
  const li = parentListItem(d, containerPath);
  if (!li) throw new EditException(`${path} liegt in keinem Listenpunkt`);
  const moved = container.areas.splice(index + 1);
  container.areas[index] = before;
  const item: ListItemEditArea = { kind: 'listItem', ordered: li.item.ordered, content: { areas: [after, ...moved] } };
  const outer = locateArea(d, li.path);
  outer.container.areas.splice(outer.index + 1, 0, item);
  return { path: areaPath(`${areaPath(outer.containerPath, outer.index + 1)}/content`, 0), offset: 0 };
}

/**
 * Backspace am Anfang einer Text-Area (EditContainer.tryDissolveEditAreaUDBL).
 * @returns Fokus danach oder undefined, wenn nichts zu tun ist (dann gilt das normale Verhalten)
 */
export function backspaceAtStart(d: Diagram, path: string): Focus | undefined {
  const { container, containerPath, index, area } = locateText(d, path);
  // leerer Text nach der ersten Area existiert nur als Schreibplatz und verschwindet
  if (index > 0 && area.plainText === '') {
    container.areas.splice(index, 1);
    return lastTextFocus(d, areaPath(containerPath, index - 1));
  }
  const li = parentListItem(d, containerPath);
  if (li && index === 0) return dissolveListItem(d, li.path);
  const prev = container.areas[index - 1];
  if (prev?.kind === 'listItem') {
    // in den vorangehenden Listenpunkt übernehmen
    const areas = prev.content.areas;
    const last = areas[areas.length - 1];
    const prevPath = `${areaPath(containerPath, index - 1)}/content`;
    container.areas.splice(index, 1);
    if (last?.kind === 'text') {
      const offset = last.plainText.length + (last.plainText && area.plainText ? 1 : 0);
      appendText(last, asParagraph(area));
      return { path: areaPath(prevPath, areas.length - 1), offset };
    }
    areas.push(area);
    return { path: areaPath(prevPath, areas.length - 1), offset: 0 };
  }
  return undefined;
}

/** Innerste letzte Text-Area einer Area (getInnermostLastArea), Schreibmarke ans Ende */
function lastTextFocus(d: Diagram, path: string): Focus | undefined {
  const area = resolvePath(d, path) as EditArea;
  switch (area.kind) {
    case 'text':
      return { path };
    case 'listItem':
      return lastTextFocus(d, areaPath(`${path}/content`, area.content.areas.length - 1));
    case 'table': {
      const r = area.cells.length - 1;
      const c = area.cells[r].length - 1;
      return lastTextFocus(d, areaPath(`${path}/cells/${r}/${c}`, area.cells[r][c].areas.length - 1));
    }
    default:
      return undefined;
  }
}
