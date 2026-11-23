// Browser-Prüfungen fürs Bearbeiten (Phase 1) gegen den laufenden Dev-Server: node scripts/e2e-edit.cjs
// Gespeichert wird als Download, die Datei wird mit Erwartungen verglichen.
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');

const BASE = process.env.SPECMAN_URL || 'http://100.101.105.4:5180/';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'specman-e2e-'));
let failures = 0;

function check(name, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${name}${ok ? '' : '\n    ' + detail}`);
  if (!ok) failures++;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (d) => d.accept());
  const k = page.keyboard;
  const open = async (sample) => {
    await page.goto(`${BASE}?sample=${sample}`);
    await page.waitForSelector('.sm-sheet');
  };
  const save = async () => {
    const [dl] = await Promise.all([page.waitForEvent('download'), k.press('Control+s')]);
    const file = path.join(tmp, `${Date.now()}.nsd`);
    await dl.saveAs(file);
    return fs.readFileSync(file, 'utf8');
  };
  const area = (p) => `[data-path="${p}"]`;
  const step = (n) => area(`mainSequence/steps/${n}/content/areas/0`);
  const fixture = (f) => fs.readFileSync(path.join(__dirname, '..', 'test', 'fixtures', f), 'utf8');

  // ---- Tippen, Markups, Undo ----
  await open('specman-reference-v1.4-model-v2.nsd');
  await page.click(step(3), { position: { x: 5, y: 8 } });
  await k.press('Home');
  await k.type('XYZ ');
  let out = await save();
  check('Steplink-Markup wandert beim Tippen mit', out.includes('plain=`XYZ As step refering') && out.includes('markups=[(51,51,Steplink)]'));
  await k.press('Shift+ArrowLeft');
  await k.press('Control+b');
  await k.press('Control+z');
  await page.waitForTimeout(50);
  out = await save();
  check('Fett ist ein eigener Undo-Schritt', /simple\(4, 5bfae252, `XYZ As step[^`]*`/.test(out) && !/simple\(4, 5bfae252, `[^`]*<b>/.test(out));
  await k.press('Control+z');
  await page.waitForTimeout(50);
  check('Undo bis zum Original', (await save()) === fixture('specman-reference-v1.4-model-v2.nsd'));

  // ---- Absätze ----
  await open('gutenmorgen.nsd');
  await page.click(step(0));
  await k.press('Control+End');
  await k.press('Enter');
  await k.type('Zwei');
  await k.press('Enter');
  await k.press('Enter');
  await k.type('Vier');
  out = await save();
  check('Absätze und Leerzeile in der Textfassung', out.includes('plain=`Wecker klingelt\nZwei\n\nVier`'), out.match(/simple\(1,[^\n]*\n[^\n]*/)?.[0]);

  // ---- Listen ----
  await open('gutenmorgen.nsd');
  await page.click(step(0));
  await k.press('Control+End');
  await k.press('Enter');
  await k.type('Punkt eins');
  await page.click('button[title="Aufzählung"]');
  await k.type(' mehr');
  await k.press('Enter');
  await k.type('Punkt zwei');
  out = await save();
  check('Listenpunkt anlegen, Cursor bleibt, Enter teilt', /list\(ordered=false\) \{\n\s+item\(`[^\n]*Punkt eins mehr[^\n]*\n\s+item\(`Punkt zwei`, plain=`Punkt zwei`\)/.test(out), out.match(/list[\s\S]*?\n    \}/)?.[0]);
  await page.click('button[title="Aufzählung"]');
  out = await save();
  check('Listen-Knopf im Listenpunkt löst ihn auf', /item\([^\n]*Punkt eins mehr[^\n]*\n\s+\}\n\s+text\(`Punkt zwei`/.test(out), out.match(/simple\(1[\s\S]*?\n    \}/)?.[0]);
  await page.click('button[title="Nummerierte Liste"]');
  out = await save();
  check('Nummerierte Liste', out.includes('list(ordered=true)'));
  await k.press('Home');
  await k.press('Backspace');
  out = await save();
  // wie im Original: der Text wird als eigener Absatz an den (leeren) Text davor gehängt
  check('Backspace am Anfang löst den Listenpunkt auf', !out.includes('list(ordered=true)') && out.includes('text(`<div>Punkt zwei</div>`'), out.match(/simple\(1[\s\S]*?\n    \}/)?.[0]);

  // ---- Schritte ----
  await open('specman-reference-v1.4-model-v2.nsd');
  await page.click(step(0));
  await page.click('button[title="Einfachen Schritt anlegen"]');
  await k.type(' X');
  out = await save();
  check('Schritt hinter dem fokussierten, Cursor am Textende, Nummern und Verweise nachgezogen',
    /simple\(2, \w+, `Neuer Schritt \d+ X`/.test(out) && out.includes('while(3, e81623e9') && /simple\(5, 5bfae252,[^\n]*\n[^\n]*markups=\[\(47,47,Steplink\)\]/.test(out));
  await page.click(step(0));
  await page.click('button[title="Schritt löschen"]');
  out = await save();
  check('Löschen eines referenzierten Schritts markiert den Verweis als defekt', out.includes('by its number 1?.') && out.includes('markups=[(47,48,Steplink)]'));
  for (let i = 0; i < 3; i++) await k.press('Control+z'); // Löschen, Tippen, Einfügen
  await page.waitForTimeout(50);
  check('Undo nach Einfügen und Löschen ergibt das Original', (await save()) === fixture('specman-reference-v1.4-model-v2.nsd'));

  await page.goto(`${BASE}?new`);
  await page.waitForSelector('.sm-welcome');
  await page.click('button[title="Case-Schritt anlegen"]');
  await page.click('text=Sonst');
  await page.click('button[title="Case-Zweig anlegen"]');
  out = await save();
  check('Case-Schritt im leeren Diagramm, Zweig rechts von Sonst', /default_branch\(`Sonst`[\s\S]*case_branch\(`Fall 1`[\s\S]*simple\(2\.1[\s\S]*case_branch\(`Fall 1`[\s\S]*case_branch\(`Fall 2`/.test(out), out.slice(out.indexOf('mainSequence')));

  check('keine Fehler im Browser', errors.length === 0, errors.join('\n'));
  await browser.close();
  fs.rmSync(tmp, { recursive: true });
  process.exit(failures ? 1 : 0);
})();
