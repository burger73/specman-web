// Bilder einfügen und bearbeiten (AddImageSpecmanOp, PasteKeyPressedHandler, AbstractImageEditArea).
// Rastergrafiken speichert das Original immer als PNG (PERSISTED_IMAGETYPE), SVG-Dateien bleiben Vektorgrafiken.
import { addTextAfter, insertImage, removeOrMarkArea, setImageScale } from '../core/areas.ts';
import type { Focus } from '../core/editor.ts';
import type { Diagram, ImageArea } from '../core/model.ts';
import { splitAtCaret } from './textsplit.ts';

export interface ImageHost {
  structural(op: (d: Diagram) => Focus | undefined): void;
}

/** Bild am Cursor der Text-Area el einfügen */
function insertAt(host: ImageHost, el: HTMLElement, image: ImageArea): void {
  const parts = splitAtCaret(el);
  if (!parts) return;
  const path = el.dataset.path!;
  const after = parts.after.plainText === '' && !/<(img|br)\b/i.test(parts.after.text) ? undefined : parts.after;
  host.structural((d) => insertImage(d, path, parts.before, after, image));
}

/** Datei in eine Bild-Area umwandeln; Rastergrafiken werden über ein Canvas zu PNG */
export async function imageFromFile(file: File): Promise<ImageArea> {
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    const source = (await file.text()).replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    return { kind: 'svg', source, individualScalePercent: 1 };
  }
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
  const dataUrl = canvas.toDataURL('image/png');
  return { kind: 'image', imageData: dataUrl.substring(dataUrl.indexOf(',') + 1), imageType: 'png', individualScalePercent: 1 };
}

/** AddImageSpecmanOp.addViaFileChooser */
export function insertImageDialog(host: ImageHost): void {
  const el = document.getSelection()?.focusNode?.parentElement?.closest<HTMLElement>('[data-path]');
  if (!el) return;
  // Cursorposition vor dem Dialog sichern, er nimmt den Fokus weg
  const sel = document.getSelection()!;
  const range = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : undefined;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,.svg';
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const image = await imageFromFile(file);
      if (range) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      insertAt(host, el, image);
    } catch {
      alert(`${file.name} lässt sich nicht als Bild lesen.`);
    }
  });
  input.click();
}

export function installImageEditing(stage: HTMLElement, host: ImageHost): void {
  // Bild aus der Zwischenablage (PasteKeyPressedHandler); Text behandelt textinput.ts
  stage.addEventListener(
    'paste',
    (e) => {
      const el = (e.target as HTMLElement).closest?.<HTMLElement>('[data-path]');
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.kind === 'file' && i.type.startsWith('image/'));
      const file = item?.getAsFile();
      if (!el || !file) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      void imageFromFile(file).then((image) => insertAt(host, el, image));
    },
    { capture: true },
  );

  // ausgewähltes Bild: Entf/Backspace entfernt, Enter legt einen Absatz dahinter an
  stage.addEventListener('keydown', (e) => {
    const img = (e.target as HTMLElement).closest?.<HTMLElement>('.sm-image[data-image-path]');
    if (!img || e.ctrlKey || e.metaKey || e.altKey) return;
    const path = img.dataset.imagePath!;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      host.structural((d) => removeOrMarkArea(d, path));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      host.structural((d) => addTextAfter(d, path));
    }
  });

  // Größe per Ziehen am rechten Rand (SpaltenResizer): Skalierung wächst mit der Breite
  stage.addEventListener('mousedown', (e) => {
    const handle = (e.target as HTMLElement).closest?.<HTMLElement>('.sm-image-resizer');
    const wrap = handle?.closest<HTMLElement>('.sm-image[data-image-path]');
    const img = wrap?.querySelector<HTMLElement>('img');
    if (!handle || !wrap || !img || e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = img.getBoundingClientRect().width;
    const zoom = startWidth / img.offsetWidth || 1;
    const startScale = Number(wrap.dataset.scale);
    const cssWidth = img.offsetWidth;
    const move = (m: MouseEvent) => {
      img.style.width = `${Math.max(10, cssWidth + (m.clientX - startX) / zoom)}px`;
    };
    const up = (m: MouseEvent) => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      const delta = m.clientX - startX;
      if (delta === 0) return;
      const scale = startScale * Math.max(10, startWidth + delta) / startWidth;
      host.structural((d) => {
        setImageScale(d, wrap.dataset.imagePath!, scale);
        return undefined;
      });
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });
}
