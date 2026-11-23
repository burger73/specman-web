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

  // ---- 2.5 Aufzeichnen im Text ----
  const textOf = (n) => `[data-path="mainSequence/steps/${n}/content/areas/0"]`;
  await open('gutenmorgen.nsd');
  await tool('toolbar.track.changes');
  await page.click(textOf(0));
  await k.press('End');
  await k.type(' laut');
  await k.press('Home');
  await k.press('Shift+ArrowRight');
  await k.press('Delete');
  out = await save();
  check('Tippen markiert, Löschen streicht', /`<strike>W<\/strike>[\s\S]*klingelt[\s\S]*laut[^`]*`, plain=`Wecker klingelt laut`, markups=\[\(0,0,Changed,yellow\)\(15,19,Changed,yellow\)\]/.test(out), out.split('\n').find((l) => l.includes('simple(1,')) + '\n' + out.split('\n').find((l) => l.includes('laut')));
  await k.press('End');
  await k.press('Backspace');
  await k.press('Backspace');
  out = await save();
  check('eigenen Text löschen entfernt ihn', out.includes('plain=`Wecker klingelt la`'));
  // Enter: neue Absatzgrenze ist hinzugefügt, Verwerfen nimmt sie samt Text zurück
  await k.press('Enter');
  await k.type('Zeile');
  out = await save();
  check('Enter markiert die Absatzgrenze', /plain=`Wecker klingelt la\nZeile`, markups=\[\(0,0,Changed,yellow\)\(15,\d+,Changed,yellow\)/.test(out), out.split('\n').filter((l) => l.includes('Zeile')).join('\n'));
  await tool('toolbar.reject.changes');
  out = await save();
  check('Verwerfen stellt den Text her', out.includes('plain=`Wecker klingelt`') && !out.includes('Zeile') && !/simple\(1, [^;]*markups/.test(out));
  // Backspace am Absatzanfang streicht die Grenze, Übernehmen verbindet die Absätze
  await open('specman-reference-v1.4-model-v2.nsd');
  await tool('toolbar.track.changes');
  const intro = '[data-path="intro/areas/0"]';
  await page.click(intro + ' div:nth-of-type(1)', { position: { x: 3, y: 8 } });
  await k.press('Home');
  await k.press('Backspace');
  out = await save();
  check('Backspace am Absatzanfang markiert die Grenze', /plain=`Specman Reference\nThis model[^`]*`, markups=\[\(17,17,Changed,yellow\)\]/.test(out), (out.match(/intro\([\s\S]*?\) \{/) ?? [''])[0]);
  await tool('toolbar.accept.changes');
  out = await save();
  check('Übernehmen entfernt die gestrichene Grenze', /plain=`Specman Reference\s?This model/.test(out));
  // Einfügen: als hinzugefügter Text, Zeilen werden zu hinzugefügten Umbrüchen
  await open('gutenmorgen.nsd');
  await tool('toolbar.track.changes');
  await page.click(textOf(0));
  await k.press('End');
  await page.evaluate(() => {
    const dt = new DataTransfer();
    dt.setData('text/plain', 'A\nB');
    document.activeElement.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  });
  out = await save();
  check('Einfügen ist hinzugefügt, auch der Umbruch', /plain=`Wecker klingeltA\nB`, markups=\[(\(15,17,Changed,yellow\)|\(15,15,Changed,yellow\)\(16,16,Changed,yellow\)\(17,17,Changed,yellow\))\]/.test(out), (out.match(/simple\(1, [\s\S]*?\);/) ?? [''])[0]);
  // Schrittverweis: als Ganzes gestrichen
  await open('specman-reference-v1.4-model-v2.nsd');
  await tool('toolbar.track.changes');
  const ref = textOf(3);
  await page.click(ref, { position: { x: 5, y: 8 } });
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    const link = el.querySelector('.sm-markup-Steplink');
    const r = document.createRange();
    r.setStartAfter(link);
    r.collapse(true);
    getSelection().removeAllRanges();
    getSelection().addRange(r);
  }, ref);
  await k.press('Backspace');
  out = await save();
  check('Schrittverweis wird als Ganzes gestrichen', out.includes('markups=[(47,47,ChangedSteplink,yellow)]') && /number <strike>1<\/strike>/.test(out), out.split('\n').filter((l) => l.includes('refering')).join('\n'));
  await k.type('x');
  out = await save();
  // wie im Original steht der Cursor danach vor dem Verweis (linkStilStart)
  check('Tippen danach landet vor dem Verweis, außerhalb', out.includes('markups=[(47,47,Changed,yellow)(48,48,ChangedSteplink,yellow)]'), out.split('\n').filter((l) => l.includes('refering')).join('\n'));

  // ---- 2.6 Catch-Sequenzen ----
  await open('breakcatch.nsd');
  const sub0 = (n) => `[data-path="mainSequence/steps/0/subsequence/steps/${n}/content/areas/0"]`;
  await page.click(sub0(0));
  await page.click('.app-palette-btn[title="Catch-Block anlegen"]');
  const items = await page.$$eval('.app-catch-item', (els) => els.map((e) => e.textContent));
  check('Dialog bietet den unverknüpften Break-Schritt an', items.length === 1 && items[0] === '1.3 - Customer not found', JSON.stringify(items));
  await page.click('.app-catch-item');
  out = await save();
  check('Catch-Sequenz angelegt', /catch\(1\.3, `<b>Customer not found<\/b>`[^\n]*\{\n\s*simple\(1\.3\.1, [0-9a-f]{8}, `Neuer Schritt 1`/.test(out));
  const head = '[data-path="mainSequence/steps/0/subsequence/catchArea/catchSequences/0/heading/areas/0"]';
  await page.click(head);
  await page.click('button[title="Schritt löschen"]');
  out = await save();
  check('Löschen in der Catch-Überschrift entfernt die Sequenz', !out.includes('catch(1.3,'));
  // Abgleich beim Verlassen
  const brk = '[data-path="mainSequence/steps/2/subsequence/steps/2/content/areas/0"]';
  await page.click(brk);
  await k.press('End');
  await k.type('!');
  await page.click(sub0(0));
  await page.waitForTimeout(100);
  out = await save();
  check('Break-Text wandert in die Catch-Überschrift', /catch\(3\.3, `<b>Customer not found!<\/b>`/.test(out), (out.match(/catch\(3\.3[^\n]*/) ?? [''])[0]);
  await k.press('Control+z');
  await page.waitForTimeout(50);
  out = await save();
  check('Undo nimmt Tippen und Abgleich zusammen zurück', out === fixture('breakcatch.nsd'));
  // mit Verfolgung
  await tool('toolbar.track.changes');
  await page.click(sub0(0));
  await page.click('.app-palette-btn[title="Catch-Block anlegen"]');
  await page.click('.app-catch-item');
  out = await save();
  check('mit Verfolgung ist die Catch-Sequenz hinzugefügt', /catch\(1\.3, [^\n]*change=\(added, yellow\)/.test(out));

  check('keine Fehler im Browser', errors.length === 0, errors.join('\n'));
  await browser.close();
  process.exit(failures ? 1 : 0);
})();
