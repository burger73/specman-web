// Farben der Change Sets, Portierung von specman.ChangeSet und specman.graphics.ChangeColorSet.
// Die Palette ist im Original bewusst für Farbfehlsichtigkeit gewählt, daher unverändert übernommen.

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface ChangeSetColors {
  name: string;
  /** Hintergrund geänderter Textstellen */
  text: Rgb;
  /** Hintergrund geänderter Schrittnummer-Links */
  stepnumberLink: Rgb;
  /** Hintergrund ganzer Schritte (Panel), Farbe zu 80 % mit Weiß gemischt */
  panel: Rgb;
}

/** ChangeSet.STEPNUMBER_LINK_COLOR */
export const STEPNUMBER_LINK_COLOR: Rgb = { r: 220, g: 220, b: 220 };

/** Styles.SCHRITTNUMMER_FARBE (Color.LIGHT_GRAY) */
export const STEPNUMBER_COLOR: Rgb = { r: 192, g: 192, b: 192 };

function combineColors(a: Rgb, b: Rgb): Rgb {
  return { r: Math.trunc((a.r + b.r) / 2), g: Math.trunc((a.g + b.g) / 2), b: Math.trunc((a.b + b.b) / 2) };
}

function mixWithWhite(c: Rgb, whiteFraction: number): Rgb {
  const f = (v: number) => Math.trunc(v + (255 - v) * whiteFraction);
  return { r: f(c.r), g: f(c.g), b: f(c.b) };
}

function register(name: string, text: Rgb): ChangeSetColors {
  return { name, text, stepnumberLink: combineColors(STEPNUMBER_LINK_COLOR, text), panel: mixWithWhite(text, 0.8) };
}

export const CHANGE_SETS: ReadonlyMap<string, ChangeSetColors> = new Map(
  [
    register('yellow', { r: 255, g: 255, b: 0 }),
    register('lilac', { r: 200, g: 170, b: 240 }),
    register('blue', { r: 130, g: 210, b: 255 }),
    register('orange', { r: 255, g: 220, b: 150 }),
    register('pink', { r: 255, g: 170, b: 170 }),
  ].map((cs) => [cs.name, cs]),
);

export const DEFAULT_CHANGE_SET = CHANGE_SETS.get('yellow')!;

/** ChangeSet.fromName mit Rückfall auf den Standard (im Original: das gerade aktive Change Set des Editors) */
export function changeSet(name: string | undefined): ChangeSetColors {
  return (name !== undefined && CHANGE_SETS.get(name)) || DEFAULT_CHANGE_SET;
}

export function css(c: Rgb): string {
  return `rgb(${c.r}, ${c.g}, ${c.b})`;
}
