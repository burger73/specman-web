// Browser-Prüfungen der Änderungsverfolgung (Phase 2) gegen den laufenden Dev-Server: node scripts/e2e-changes.cjs
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
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  const dialogs = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (d) => {
    dialogs.push(d.message());
    d.accept();
  });
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
  const fixture = (f) => fs.readFileSync(path.join(__dirname, '..', 'test', 'fixtures', f), 'utf8');
  const tool = (name) => page.click(`[data-name="${name}"]`);
  const chooseSet = async (name) => {
    await tool('toolbar.changeset');
    await page.click(`.app-cs-popup [data-changeset="${name}"]`);
  };

  // ---- 2.1 Change Set und Verfolgen ----
  await open('changetracking.nsd');
  await tool('toolbar.track.changes');
  await chooseSet('lilac');
  let out = await save();
  check('Verfolgen und Change Set landen in den settings', out.includes('changeModeEnabled=true') && out.includes('changeSetName=lilac'));
  check('Knopf zeigt den Zustand', (await page.getAttribute('[data-name="toolbar.track.changes"]', 'aria-pressed')) === 'true');

  // ---- 2.2 Übernehmen und Verwerfen ----
  await open('changetracking.nsd');
  await tool('toolbar.accept.changes');
  out = await save();
  check('Übernehmen yellow: keine yellow-Änderungen mehr', !/(Changed|added|removed|target|source)[^)\n]*yellow/.test(out) && out.includes('may be deleted') && !out.includes('can </strike>'), out.slice(800, 2000));
  check('gelöschter Schritt in blue bleibt', out.includes('change=(removed, blue)'));
  await k.press('Control+z');
  await page.waitForTimeout(50);
  check('Undo stellt das Original her', (await save()) === fixture('changetracking.nsd'));
  await tool('toolbar.reject.changes');
  out = await save();
  check('Verwerfen yellow: Zielschritt steht wieder an der Quelle', out.includes('can be deleted') && !out.includes('source(') && /simple\(1\.5, 6c0e82a4/.test(out));
  dialogs.length = 0;
  await chooseSet('pink');
  await tool('toolbar.accept.changes');
  check('ohne Änderungen kommt die Meldung', dialogs.some((m) => m.includes('keine Änderungen')), dialogs.join(' | '));

  // ---- 2.3 Zusammenführen und Review ----
  await open('changetracking.nsd');
  await tool('toolbar.merge.changesets');
  await page.click('.app-cs-popup [data-changeset="lilac"]');
  out = await save();
  check('Zusammenführen lilac → yellow', !out.includes('lilac') && out.includes('no pending refunds`, markups=[(0,17,Changed,yellow)]'));
  await open('specman-reference-v1.4-model-v2.nsd');
  const before = await page.locator('.sm-collapsed').count();
  await tool('toolbar.review');
  const after = await page.locator('.sm-collapsed').count();
  check('Review klappt Schritte ohne Änderungen zu', after > before, `${before} → ${after}`);
  check('Review ist kein Undo-Schritt', await page.isDisabled('button[title^="Rückgängig"]'));

  // ---- 2.4 Aufzeichnen strukturell ----
  await open('gutenmorgen.nsd');
  await tool('toolbar.track.changes');
  const step = (n) => `[data-path="mainSequence/steps/${n}/content/areas/0"]`;
  await page.click(step(0));
  await page.click('.app-palette-btn[title="Einfachen Schritt anlegen"]');
  out = await save();
  check('neuer Schritt ist hinzugefügt', /simple\(2, [0-9a-f]{8}, `Neuer Schritt \d+`, plain=`Neuer Schritt \d+`, markups=\[\(0,\d+,Changed,yellow\)\], change=\(added, yellow\)\)/.test(out));
  const bg = await page.$eval('[data-step-id]:nth-child(2)', (e) => getComputedStyle(e).getPropertyValue('--sm-bg'));
  check('neuer Schritt in der Panel-Farbe', bg.includes('255, 255, 204'), bg);
  await page.click(step(0));
  await page.click('button[title="Schritt löschen"]');
  out = await save();
  check('Löschen markiert den Schritt', /simple\(1, fcee183f, [^;]*change=\(removed, yellow\)/.test(out));
  check('gelöschter Text ist nicht bearbeitbar', (await page.getAttribute(step(0), 'contenteditable')) === 'false');
  await page.click(step(1));
  await page.click('button[title="Schritt löschen"]');
  out = await save();
  check('hinzugefügter Schritt verschwindet beim Löschen', !out.includes('Neuer Schritt'));
  await k.press('Control+z');
  await k.press('Control+z');
  await page.waitForTimeout(50);
  out = await save();
  check('Undo nimmt das Markieren zurück', !out.includes('removed') && out.includes('change=(added, yellow)'));

  check('keine Fehler im Browser', errors.length === 0, errors.join('\n'));
  await browser.close();
  process.exit(failures ? 1 : 0);
})();
