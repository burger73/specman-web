import { readDiagram } from '../core/reader.ts';
import { renderDiagram } from './render.ts';
import './style.css';

// Beispiele: die Testdateien aus dem Original-Repo
const samples = import.meta.glob('../../test/fixtures/*.nsd', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const app = document.getElementById('app')!;
const bar = document.createElement('header');
bar.className = 'app-bar';
const select = document.createElement('select');
for (const path of Object.keys(samples).sort()) {
  const o = document.createElement('option');
  o.value = path;
  o.textContent = path.split('/').pop()!;
  select.append(o);
}
const zoom = document.createElement('select');
for (const z of ['Datei', '80', '100', '120', '150']) {
  const o = document.createElement('option');
  o.value = z;
  o.textContent = z === 'Datei' ? 'Zoom wie Datei' : `${z} %`;
  zoom.append(o);
}
const status = document.createElement('span');
status.className = 'app-status';
bar.append(select, zoom, status);
const stage = document.createElement('main');
stage.className = 'app-stage';
app.append(bar, stage);

function show(name: string, text: string): void {
  stage.replaceChildren();
  try {
    const { diagram, envelope } = readDiagram(text);
    const sheet = renderDiagram(diagram);
    sheet.style.zoom = String((zoom.value === 'Datei' ? diagram.zoomFactor : Number(zoom.value)) / 100);
    stage.append(sheet);
    status.textContent = `${name} – Specman ${envelope.specmanVersion}, Zoom ${diagram.zoomFactor} %`;
  } catch (e) {
    status.textContent = `${name}: ${(e as Error).message}`;
  }
}

function showSelected(): void {
  show(select.selectedOptions[0].textContent!, samples[select.value]);
}

const params = new URLSearchParams(location.search);
const wanted = params.get('sample');
if (wanted) {
  const match = Object.keys(samples).find((p) => p.endsWith('/' + wanted));
  if (match) select.value = match;
}
if (params.get('zoom')) zoom.value = params.get('zoom')!;
select.addEventListener('change', showSelected);
zoom.addEventListener('change', showSelected);
showSelected();
