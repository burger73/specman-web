const { chromium } = require('playwright');
(async () => {
  const [,, sample, zoom, out, width] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: Number(width || 1000), height: 800 }, deviceScaleFactor: 1 });
  const errors = [];
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(`http://100.101.105.4:5180/?sample=${sample}&zoom=${zoom}`);
  await p.waitForTimeout(800);
  await p.addStyleTag({ content: '.app-bar { display: none !important; }' });
  const el = await p.$('.sm-sheet');
  if (el) await el.screenshot({ path: out }); else await p.screenshot({ path: out, fullPage: true });
  console.log(await p.textContent('.app-status'), errors.join('\n'));
  await b.close();
})();
