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
    dialogs.push(d.message());
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

  check('keine Dialoge unerwartet', dialogs.length === 0, dialogs.join('\n'));
  check('keine Fehler im Browser', errors.length === 0, errors.join('\n'));
  await browser.close();
  process.exit(failures ? 1 : 0);
})();
