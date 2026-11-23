// Neue Modellobjekte, wie sie das Original beim Anlegen erzeugt (Specman.initEmptyDiagram, TextInit).
import type { Diagram, EditorContent, TextEditArea } from './model.ts';
import { generateId } from './model.ts';

/** WorkingAreaPanel.INITIAL_DIAGRAMM_WIDTH */
export const INITIAL_DIAGRAM_WIDTH = 700;

/** Specman.initEmptyDiagram: keine Schritte, leeres Intro und Outro, Breite 700, Zoom 100. Der Name ist der alte Swing-Komponentenname. */
export function newDiagram(): Diagram {
  return {
    name: 'frame0',
    width: INITIAL_DIAGRAM_WIDTH,
    zoomFactor: 100,
    changeModeEnabled: false,
    changeSetName: 'yellow',
    mainSequence: { id: generateId(), steps: [] },
    // Java legt immer Intro und Outro an und schreibt sie auch leer (intro(``) {})
    intro: content(),
    outro: content(),
    metaTagConfigs: [],
  };
}

/** Text-Area aus HTML; plainText ist die Textfassung ohne Tags (wie Swings HTMLDocument, Leerraum zusammengefasst) */
export function textArea(html: string): TextEditArea {
  return { kind: 'text', text: html, plainText: htmlToPlain(html), markups: [] };
}

/** TextInit.initialtext: Inhalt mit einer Text-Area */
export function content(html = ''): EditorContent {
  return { areas: [textArea(html)] };
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** Grobe Textfassung für neu angelegte Texte; beim Bearbeiten liefert der Browser den Text */
export function htmlToPlain(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e: string) =>
      e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : (ENTITIES[e] ?? m),
    );
}

