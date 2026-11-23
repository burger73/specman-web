// Dateien öffnen und speichern. Mit der File System Access API (Chrome/Edge) wird in dieselbe Datei
// zurückgeschrieben, sonst bleibt nur Hochladen per Dateiauswahl und Speichern als Download.
// Alles passiert im Browser, nichts verlässt den Rechner.

interface FilePickerOptions {
  suggestedName?: string;
  types?: { description: string; accept: Record<string, string[]> }[];
  excludeAcceptAllOption?: boolean;
}

interface FsWindow {
  showOpenFilePicker?: (o?: FilePickerOptions) => Promise<FileSystemFileHandle[]>;
  showSaveFilePicker?: (o?: FilePickerOptions) => Promise<FileSystemFileHandle>;
}

const fsWindow = window as unknown as FsWindow;
const TYPES = [{ description: 'Specman-Diagramme', accept: { 'text/plain': ['.nsd'] } }];

/** Geöffnete Datei: Name, Inhalt und, falls der Browser das kann, das Handle zum Zurückschreiben */
export interface OpenedFile {
  name: string;
  text: string;
  handle?: FileSystemFileHandle;
}

/** Abbruch im Dateidialog ist kein Fehler */
export const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError';

/** Dateiauswahl; undefined bei Abbruch */
export async function pickFile(): Promise<OpenedFile | undefined> {
  if (fsWindow.showOpenFilePicker) {
    try {
      const [handle] = await fsWindow.showOpenFilePicker({ types: TYPES });
      const file = await handle.getFile();
      return { name: file.name, text: await file.text(), handle };
    } catch (e) {
      if (isAbort(e)) return undefined;
      throw e;
    }
  }
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.nsd';
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      resolve(file ? { name: file.name, text: await file.text() } : undefined);
    });
    input.addEventListener('cancel', () => resolve(undefined));
    input.click();
  });
}

/** Per Drag & Drop abgelegte Datei, in Chrome mit Handle */
export async function droppedFile(dt: DataTransfer): Promise<OpenedFile | undefined> {
  const item = dt.items[0] as (DataTransferItem & { getAsFileSystemHandle?: () => Promise<FileSystemHandle | null> }) | undefined;
  // das Handle muss synchron im drop-Ereignis angefordert werden, deshalb vor jedem await
  const handlePromise = item?.kind === 'file' ? item.getAsFileSystemHandle?.() : undefined;
  const file = dt.files[0];
  if (!file) return undefined;
  const handle = await handlePromise?.catch(() => null);
  return { name: file.name, text: await file.text(), handle: handle?.kind === 'file' ? (handle as FileSystemFileHandle) : undefined };
}

/**
 * Text speichern: ohne Handle (oder mit saveAs) über den Speichern-Dialog, ohne File System Access API als Download.
 * @returns Name und Handle der geschriebenen Datei, undefined bei Abbruch
 */
export async function saveFile(text: string, name: string, handle: FileSystemFileHandle | undefined, saveAs: boolean): Promise<{ name: string; handle?: FileSystemFileHandle } | undefined> {
  if (!name.endsWith('.nsd')) name += '.nsd';
  if (fsWindow.showSaveFilePicker) {
    try {
      if (!handle || saveAs) handle = await fsWindow.showSaveFilePicker({ suggestedName: name, types: TYPES });
      const w = await handle.createWritable();
      await w.write(text);
      await w.close();
      return { name: handle.name, handle };
    } catch (e) {
      if (isAbort(e)) return undefined;
      throw e;
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  return { name };
}
