// Screenshot der Toolbar mit den Text-Werkzeugen (3.5), optional mit geöffnetem Menü
// Aufruf: node scripts/shot-textformat.cjs out.png [paragraph|font|size]
const { chromium } = require('playwright');
(async () => {
  const [, , out = '/tmp/textformat.png', open] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1500, height: 500 }, deviceScaleFactor: 1 });
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto('http://100.101.105.4:5180/?sample=specman-reference-v1.4-model-v2.nsd');
  await p.waitForSelector('[data-path]');
  // Schreibmarke in die Überschrift „Heading 2“
  await p.evaluate(() => {
    const h = [...document.querySelectorAll('[data-path] h2')].find((e) => e.textContent.includes('Heading 2'));
    h.scrollIntoView({ block: 'center' });
    const r = document.createRange();
    r.setStart(h.firstChild, 3);
    h.closest('[data-path]').focus();
    getSelection().removeAllRanges();
    getSelection().addRange(r);
  });
  await p.waitForTimeout(200);
  if (open === 'size') await p.click('button[title="Schriftgröße"]');
  else if (open) await p.click(`.app-combo[data-name="${open}"]`);
  await p.waitForTimeout(200);
  await p.screenshot({ path: out });
  console.log(errors.join('\n'));
  await b.close();
})();
