// Browser-Prüfungen der Phase 3 (Lücken aus Phase 1 und 2) gegen den laufenden Dev-Server: node scripts/e2e-phase3.cjs
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
    if (d.type() !== 'beforeunload') dialogs.push(d.message());
    d.accept();
  });
  const k = page.keyboard;
  const open = async (sample) => {
    await page.goto(`${BASE}?sample=${sample}`);
    await page.waitForSelector('.sm-sheet');
  };
  // eslint-disable-next-line no-unused-vars
  const save = async () => {
    const [dl] = await Promise.all([page.waitForEvent('download'), k.press('Control+s')]);
    const file = path.join(tmp, `${Date.now()}.nsd`);
    await dl.saveAs(file);
    return fs.readFileSync(file, 'utf8');
  };

  // ---- 3.1 Palette in der Breite ziehen ----
  await open('goodmorning.nsd');
  const palWidth = () => page.$eval('.app-palette', (e) => e.getBoundingClientRect().width);
  const labelClipped = () =>
    page.$eval('.app-palette-btn span', (s) => s.scrollWidth > s.clientWidth || s.getBoundingClientRect().width < 1);
  const w0 = await palWidth();
  const grip = await page.$eval('.app-palette-grip', (g) => {
    const r = g.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + 200 };
  });
  const drag = async (dx) => {
    const x = await page.$eval('.app-palette-grip', (g) => g.getBoundingClientRect().x + 3);
    await page.mouse.move(x, grip.y);
    await page.mouse.down();
    await page.mouse.move(x + dx / 2, grip.y);
    await page.mouse.move(x + dx, grip.y);
    await page.mouse.up();
  };
  check('Palette zeigt zunächst die ganzen Beschriftungen', !(await labelClipped()));
  await drag(-60);
  check('schmaler gezogen', Math.abs((await palWidth()) - (w0 - 60)) <= 1, `${w0} → ${await palWidth()}`);
  check('Beschriftungen werden abgeschnitten', await labelClipped());
  await drag(-500);
  check('Mindestbreite: nur die Icons', (await palWidth()) === 36, String(await palWidth()));
  const iconVisible = await page.$eval('.app-palette-btn img', (i) => {
    const r = i.getBoundingClientRect();
    const p = i.closest('.app-palette').getBoundingClientRect();
    return r.width === 22 && r.right <= p.right;
  });
  check('Icons bleiben ganz sichtbar', iconVisible);
  await drag(800);
  check('Höchstbreite 300 px', (await palWidth()) === 300, String(await palWidth()));
  await page.click('.app-palette-btn[title="Einfachen Schritt anlegen"]');
  check('Knöpfe funktionieren nach dem Ziehen', errors.length === 0, errors.join('\n'));

  // ---- 3.2 Spaltenbreiten ziehen ----
  const REF = 'specman-reference-v1.4-model-v2.nsd';
  const fixture = (f) => fs.readFileSync(path.join(__dirname, '..', 'test', 'fixtures', f), 'utf8');
  await open(REF);
  const handle = async (kind, i = 0) => {
    const hs = await page.$$(`.sm-resizer[data-resize*='"kind":"${kind}"']`);
    const visible = [];
    for (const h of hs) if (await h.isVisible()) visible.push(h);
    return visible[i];
  };
  const dragBy = async (el, dx, { escape = false } = {}) => {
    await el.scrollIntoViewIfNeeded();
    const r = await el.boundingBox();
    const x0 = r.x + r.width / 2;
    const y0 = Math.min(Math.max(r.y, 120) + Math.min(r.height / 2, 15), r.y + r.height - 2);
    await page.mouse.move(x0, y0);
    await page.mouse.down();
    await page.mouse.move(x0 + dx / 2, y0);
    await page.mouse.move(x0 + dx, y0);
    const line = await page.$('.sm-dragline');
    if (escape) await k.press('Escape');
    await page.mouse.up();
    return line !== null;
  };
  let out;
  const lineShown = await dragBy(await handle('ifElse'), 60, { escape: true });
  check('beim Ziehen steht die gestrichelte Linie', lineShown);
  check('Escape bricht ab, die Linie verschwindet', !(await page.$('.sm-dragline')));
  out = await save();
  check('nach Escape bleibt alles beim Alten', out === fixture(REF));
  await dragBy(await handle('ifElse'), 60);
  out = await save();
  const ratio = Number(/If-Else-Step\. The field[^\n]*ifRatio=([\d.]+)%/.exec(out)?.[1]);
  check('If-Else: Anteil des Ja-Zweigs wächst', ratio > 55 && ratio < 65, String(ratio));
  await k.press('Control+z');
  out = await save();
  check('Undo nimmt das Ziehen zurück', out === fixture(REF));
  await dragBy(await handle('loop'), 20);
  out = await save();
  check('Schleife: Balken 20 px breiter (Zoom wie Datei)', /`While loop`, barWidth=41\)/.test(out), /While loop`[^\n]*/.exec(out)?.[0]);
  await k.press('Control+z');
  await dragBy(await handle('if'), -10);
  out = await save();
  check('If: linke Spalte schmaler', /emptyWidth=14\)/.test(out), /emptyWidth=\d+/.exec(out)?.[0]);
  await k.press('Control+z');
  await dragBy(await handle('case', 0), 30);
  out = await save();
  check('Case: Anteile neu berechnet', /cols=\[3[6-9]\.\d\d%, 2[6-9]\.\d\d%, 33\.\d\d%\]/.test(out), /Switch-Case[^\n]*(cols=[^\]]*\])/.exec(out)?.[1]);
  await k.press('Control+z');
  await dragBy(await handle('diagram'), -100);
  out = await save();
  check('Diagrammbreite 100 px schmaler', /\n\s*width=740\n/.test(out), /\n\s*width=\d+/.exec(out)?.[0]);
  await k.press('Control+z');
  // Catch-Bereich: Co-Catch-Balken und Spalten
  await dragBy(await handle('coCatchBar', 0), -12);
  out = await save();
  check('Co-Catch-Balken breiter', /headingWidth=33\)/.test(out), (out.match(/catch\(10[^\n]*/) || [''])[0].slice(0, 300));
  await k.press('Control+z');
  await dragBy(await handle('catchColumns', 0), 40);
  out = await save();
  check('Catch-Spalten in Prozent', /catchArea\(cols=\[\d+%, \d+%, \d+%\]\)/.test(out), (out.match(/catchArea\([^\n]*/g) || []).join(' | '));
  await k.press('Control+z');
  out = await save();
  check('alles zurückgenommen', out === fixture(REF));
  // Tabelle: Spaltengrenze und rechter Rand
  const tableBox = async () => {
    const t = await page.$('.sm-table-wrap[data-table-path] > table');
    await t.scrollIntoViewIfNeeded();
    const cells = await page.$$eval('.sm-table-wrap[data-table-path] > table tr:first-child > td', (tds) => tds.map((td) => td.getBoundingClientRect().right));
    return { box: await t.boundingBox(), cells };
  };
  let tb = await tableBox();
  await page.mouse.move(tb.cells[0], tb.box.y + tb.box.height / 2);
  check('Spaltengrenze der Tabelle zeigt den Ziehgriff', (await page.$eval('.sm-table-wrap[data-table-path]', (w) => w.dataset.tableOp)) === 'resizeColumn');
  await page.mouse.down();
  await page.mouse.move(tb.cells[0] - 40, tb.box.y + tb.box.height / 2);
  await page.mouse.up();
  out = await save();
  check('Tabellenspalten in Prozent', /table\(width=100%, cols=\[\d+%, \d+%, \d+%\]\)/.test(out), (out.match(/table\([^\n]*/) || [''])[0]);
  tb = await tableBox();
  await page.mouse.move(tb.box.x + tb.box.width - 2, tb.box.y + tb.box.height / 2);
  check('rechter Tabellenrand zeigt den Ziehgriff', (await page.$eval('.sm-table-wrap[data-table-path]', (w) => w.dataset.tableOp)) === 'resizeTable');
  await page.mouse.down();
  await page.mouse.move(tb.box.x + tb.box.width * 0.6, tb.box.y + tb.box.height / 2);
  await page.mouse.up();
  out = await save();
  check('Tabellenbreite ca. 60 %', /table\(width=(59|60|61)%/.test(out), (out.match(/table\([^\n]*/) || [''])[0]);

  check('keine Dialoge unerwartet', dialogs.length === 0, JSON.stringify(dialogs));
  check('keine Fehler im Browser', errors.length === 0, errors.join('\n'));
  await browser.close();
  process.exit(failures ? 1 : 0);
})();
