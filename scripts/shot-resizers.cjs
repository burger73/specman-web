// Screenshot mit sichtbar gemachten Ziehgriffen der Spaltenbreiten: node scripts/shot-resizers.cjs <beispiel.nsd> <out.png>
const { chromium } = require('playwright');
(async () => {
  const [, , sample, out] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
  await p.goto(`http://100.101.105.4:5180/?sample=${sample}&zoom=Datei`);
  await p.waitForSelector('.sm-sheet');
  await p.addStyleTag({ content: '.sm-resizer { background: rgba(255,0,0,0.5); }' });
  await p.waitForTimeout(300);
  await p.screenshot({ path: out, fullPage: true });
  console.log(await p.$$eval('.sm-resizer', (rs) => rs.length), 'Griffe');
  await b.close();
})();
