// Screenshot eines Beispiels in Abschnitten: node scripts/shot-parts.cjs <sample> <zoom> <prefix> [Höhe]
const { chromium } = require('playwright');
(async () => {
  const [, , sample, zoom, prefix, h] = process.argv;
  const height = Number(h || 1400);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 800 } });
  await p.goto(`http://100.101.105.4:5180/?sample=${sample}&zoom=${zoom}`);
  await p.waitForTimeout(800);
  await p.addStyleTag({ content: '.app-bar { display: none !important; }' });
  const box = await (await p.$('.sm-sheet')).boundingBox();
  for (let y = 0, i = 0; y < box.height; y += height, i++) {
    await p.screenshot({ path: `${prefix}-${i}.png`, fullPage: true, clip: { x: box.x, y: box.y + y, width: box.width, height: Math.min(height, box.height - y) } });
    console.log(`${prefix}-${i}.png`);
  }
  await b.close();
})();
