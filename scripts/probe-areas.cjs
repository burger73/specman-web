// Hilfsskript: listet die Bearbeitungsbereiche einer Beispieldatei mit Lage (zum Schreiben von e2e-Checks)
const { chromium } = require('playwright');
const BASE = process.env.SPECMAN_URL || 'http://100.101.105.4:5180/';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1300, height: 900 } });
  await page.goto(`${BASE}?sample=${process.argv[2] || 'specman-reference-v1.4-model-v2.nsd'}`);
  await page.waitForSelector('.sm-sheet');
  const list = await page.$$eval('[data-path], .sm-image[data-image-path]', (els) =>
    els.map((e) => {
      const r = e.getBoundingClientRect();
      return `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} ${e.dataset.path || 'IMG ' + e.dataset.imagePath} ${e.isContentEditable ? '' : '(ro)'} ${JSON.stringify((e.textContent || '').slice(0, 40))}`;
    }),
  );
  console.log(list.join('\n'));
  await browser.close();
})();
