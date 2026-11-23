// Screenshot des Dialogs „Link auf Schrittnummer...“: node scripts/shot-steplink.cjs [datei.png]
const { chromium } = require('playwright');
const BASE = process.env.SPECMAN_URL || 'http://100.101.105.4:5180/';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1300, height: 900 } });
  await page.goto(`${BASE}?sample=specman-reference-v1.4-model-v2.nsd`);
  await page.waitForSelector('.sm-sheet');
  await page.click('[data-path="mainSequence/steps/0/content/areas/0"]');
  await page.click('button[title="Link auf Schrittnummer..."]');
  await page.mouse.move(650, 400);
  await page.screenshot({ path: process.argv[2] || '/tmp/steplink.png' });
  await browser.close();
})();
