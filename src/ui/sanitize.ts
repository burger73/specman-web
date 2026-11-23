// HTML aus Modelldateien in DOM überführen. Skripte und Event-Handler werden entfernt,
// weil Dateien von anderen stammen können. Leere Absätze bekommen ein <br>, damit sie wie in Swing eine Zeile belegen.

import { EMPTY_BLOCKS } from './textedit.ts';

const DROP = new Set(['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'STYLE', 'LINK', 'META', 'BASE', 'FORM']);

export function sanitizeHtml(html: string): DocumentFragment {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  clean(doc.body);
  const frag = document.createDocumentFragment();
  frag.append(...Array.from(doc.body.childNodes));
  return frag;
}

function clean(el: Element): void {
  for (const child of Array.from(el.children)) {
    if (DROP.has(child.tagName)) {
      child.remove();
      continue;
    }
    for (const attr of Array.from(child.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      if (name.startsWith('on') || ((name === 'href' || name === 'src') && value.startsWith('javascript:'))) {
        child.removeAttribute(attr.name);
      }
    }
    if (child.tagName === 'A') {
      child.setAttribute('target', '_blank');
      child.setAttribute('rel', 'noopener noreferrer');
    }
    if (child.matches(EMPTY_BLOCKS) && child.children.length === 0 && child.textContent!.trim() === '') {
      child.textContent = '';
      child.append(document.createElement('br'));
    }
    clean(child);
  }
}
