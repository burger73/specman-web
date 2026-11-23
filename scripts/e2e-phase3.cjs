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

  // ---- 3.3 Pfeiltasten zwischen den Bereichen ----
  await open(REF);
  const M = 'mainSequence/steps/';
  /** Schreibmarke an den Anfang (erste Zeile) oder ans Ende (letzte Zeile) eines Texts, x optional per Klick */
  const caret = (p, where) =>
    page.evaluate(
      ([p, where]) => {
        const el = document.querySelector(`[data-path="${CSS.escape(p)}"]`);
        el.scrollIntoView({ block: 'center' });
        el.focus();
        const texts = [];
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = w.nextNode(); n; n = w.nextNode()) if (n.data.trim()) texts.push(n);
        const r = document.createRange();
        if (!texts.length) r.selectNodeContents(el);
        else if (where === 'start') r.setStart(texts[0], texts[0].data.search(/\S/));
        else r.setStart(texts.at(-1), texts.at(-1).data.trimEnd().length);
        r.collapse(true);
        getSelection().removeAllRanges();
        getSelection().addRange(r);
      },
      [p, where],
    );
  const clickAt = async (p, fx, fy) => {
    const el = await page.$(`[data-path="${p}"]`);
    await el.scrollIntoViewIfNeeded();
    const b = await el.boundingBox();
    await page.mouse.click(b.x + b.width * fx, b.y + b.height * fy);
  };
  /** wo steht der Fokus: Pfad der Text-Area bzw. „IMG Pfad“ */
  const where = () =>
    page.evaluate(() => {
      const a = document.activeElement;
      if (a?.dataset?.imagePath) return 'IMG ' + a.dataset.imagePath;
      const n = getSelection().focusNode;
      return (n instanceof Element ? n : n?.parentElement)?.closest('[data-path]')?.dataset.path;
    });
  const caretX = () => page.evaluate(() => getSelection().getRangeAt(0).getBoundingClientRect().left);
  const press = async (key, n = 1) => {
    for (let i = 0; i < n; i++) await k.press(key);
  };
  let at;

  await caret(`${M}0/content/areas/0`, 'end');
  await press('ArrowDown');
  check('Runter aus der letzten Zeile: in den nächsten Schritt', (at = await where()) === `${M}1/content/areas/0`, at);
  await press('ArrowDown');
  check('Runter in die Schleife', (at = await where()) === `${M}1/loopSequence/steps/0/content/areas/0`, at);
  await press('ArrowUp', 2);
  check('Hoch zurück in den mehrzeiligen Text, letzte Zeile', (at = await where()) === `${M}0/content/areas/0`, at);
  await press('ArrowUp');
  check('Hoch innerhalb des Texts bleibt im Text', (at = await where()) === `${M}0/content/areas/0`, at);
  await caret(`${M}0/content/areas/0`, 'start');
  await press('ArrowUp');
  check('Hoch aus der ersten Zeile: ins Intro', (at = await where()) === 'intro/areas/0', at);

  await caret(`${M}6/content/areas/0`, 'end');
  await press('ArrowDown');
  check('gelöschter Schritt wird übersprungen', (at = await where()) === `${M}8/content/areas/0`, at);
  await press('ArrowDown');
  check('Runter in den Listenpunkt', (at = await where()) === `${M}8/content/areas/1/content/areas/0`, at);

  await press('ArrowUp', 2);
  await press('Shift+ArrowDown');
  check('mit Umschalt bleibt die Taste im Text', (at = await where()) === `${M}6/content/areas/0`, at);

  // If-Else: der Bedingungstext liegt nur über dem Nein-Zweig, überlappende Bereiche haben Vorrang
  await clickAt(`${M}9/content/areas/0`, 0.05, 0.5);
  await press('ArrowDown');
  check('in den Bedingungstext des If-Else', (at = await where()) === `${M}10/content/areas/0`, at);
  await press('ArrowDown');
  check('zweizeiliger Bedingungstext: erst in die zweite Zeile', (at = await where()) === `${M}10/content/areas/0`, at);
  await press('ArrowDown');
  check('dann in den Nein-Zweig darunter', (at = await where()) === `${M}10/elseSequence/heading/areas/0`, at);
  await caret(`${M}10/ifSequence/heading/areas/0`, 'end');
  await press('ArrowDown');
  check('aus dem Ja-Zweig in dessen Schritt', (at = await where()) === `${M}10/ifSequence/steps/0/content/areas/0`, at);
  // Spalte bleibt über die kurze Zeile „.“ hinweg gemerkt
  await clickAt(`${M}3/content/areas/0`, 0.3, 0.75);
  const x0 = await caretX();
  await press('ArrowDown');
  check('in den Schritt mit nur einem Punkt', (at = await where()) === `${M}4/content/areas/0`, at);
  const xShort = await caretX();
  await press('ArrowDown');
  const x1 = await caretX();
  check('danach wieder in der Ausgangsspalte', xShort < x0 - 100 && Math.abs(x1 - x0) < 15, `${x0} → ${xShort} → ${x1}`);

  // Tabelle
  await caret(`${M}20/content/areas/0`, 'end');
  await clickAt(`${M}20/content/areas/0`, 0.45, 0.8);
  await press('ArrowDown');
  check('Runter in die Tabellenzelle darunter', (at = await where()) === `${M}20/content/areas/1/cells/0/1/areas/0`, at);
  await press('ArrowDown');
  check('Runter in die nächste Tabellenzeile', (at = await where()) === `${M}20/content/areas/1/cells/1/1/areas/0`, at);
  await press('ArrowDown');
  check('aus der Tabelle in den nächsten Schritt', (at = await where()) === `${M}21/content/areas/0`, at);

  // zugeklappt
  await caret(`${M}31/content/areas/0`, 'end');
  await press('ArrowDown');
  check('zugeklappte Schleife wird übersprungen', (at = await where()) === `${M}32/loopSequence/steps/0/content/areas/0`, at);

  // Bilder
  await caret('outro/areas/0', 'end');
  await press('ArrowDown');
  check('Runter auf das Bild', (at = await where()) === 'IMG outro/areas/1', at);
  await press('ArrowDown');
  check('vom Bild in den Text darunter', (at = await where()) === 'outro/areas/2', at);
  await press('ArrowUp');
  check('Hoch zurück aufs Bild', (at = await where()) === 'IMG outro/areas/1', at);
  await press('ArrowUp');
  check('vom Bild hoch in den Text', (at = await where()) === 'outro/areas/0', at);
  await caret('outro/areas/6', 'end');
  await press('ArrowDown');
  check('gelöschtes Bild wird übersprungen', (at = await where()) === 'outro/areas/8', at);

  // Schrittverweis „10“ als Ganzes überspringen
  const LINK = 'mainSequence/catchArea/catchSequences/0/steps/0/content/areas/0';
  const textBefore = () =>
    page.evaluate((p) => {
      const el = document.querySelector(`[data-path="${CSS.escape(p)}"]`);
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = getSelection().getRangeAt(0);
      r.setEnd(s.startContainer, s.startOffset);
      return r.toString().replace(/\s+/g, ' ').trimStart();
    }, LINK);
  await page.evaluate((p) => {
    const el = document.querySelector(`[data-path="${CSS.escape(p)}"]`);
    el.scrollIntoView({ block: 'center' });
    el.focus();
    const link = el.querySelector('.sm-markup-Steplink');
    const r = document.createRange();
    r.setStartBefore(link);
    r.collapse(true);
    getSelection().removeAllRanges();
    getSelection().addRange(r);
  }, LINK);
  await press('ArrowRight');
  check('Rechts springt hinter den Schrittverweis', (await textBefore()).endsWith('break step 10'), await textBefore());
  await press('ArrowRight');
  check('danach wieder zeichenweise', (await textBefore()).endsWith('break step 10 '), await textBefore());
  await press('ArrowLeft');
  await press('ArrowLeft');
  check('Links springt vor den Schrittverweis', (await textBefore()).endsWith('break step '), await textBefore());
  out = await save();
  check('Pfeiltasten ändern nichts am Dokument', out === fixture(REF));

  // ---- 3.4 Schrittverweise anlegen und folgen ----
  await open(REF);
  const S1 = `${M}0/content/areas/0`;
  const linkBtn = 'button[title="Link auf Schrittnummer..."]';
  const choose = (re) => page.locator('.app-steplink-dialog .app-catch-item', { hasText: re }).first().click();
  /** Klartext und Markups des Schritts 1 in der gespeicherten Datei */
  const step1 = (text) => {
    const m = /simple\(1, 5582897d,[\s\S]*?plain=`([^`]*)`(?:, markups=\[([^\]]*)\])?/.exec(text);
    return { plain: m?.[1] ?? '', markups: m?.[2] ?? '' };
  };
  await caret(S1, 'end');
  await page.click(linkBtn);
  check('der Dialog geht auf, der Filter hat den Fokus', await page.$eval('.app-steplink-dialog', (d) => d.open && document.activeElement?.classList.contains('app-steplink-filter')));
  const items = await page.$$eval('.app-steplink-dialog .app-catch-item', (b) => b.map((x) => x.textContent));
  check('alle Schritte nach Nummer, mit Text, höchstens 60 Zeichen', items[0].startsWith('1 - Simple step') && items.some((t) => t.startsWith('10.1 - ')) && items.every((t) => t.length <= 60), items.slice(0, 3).join(' | '));
  await choose(/^4 - /);
  out = await save();
  let s1 = step1(out);
  check('Verweis am Cursor eingefügt', s1.plain.endsWith('number sequence.4') || /4$/.test(s1.plain), s1.plain.slice(-40));
  check('als Steplink-Markup über der Nummer', s1.markups === `(${s1.plain.length - 1},${s1.plain.length - 1},Steplink)`, s1.markups);
  check('Tooltip am Verweis', (await page.$eval(`[data-path="${S1}"] .sm-markup-Steplink`, (s) => s.title)) === 'STRG+Klicken, um dem Link zu folgen');
  check('Schreibmarke hinter dem Verweis', (await where()) === S1);
  await page.click(linkBtn);
  await choose(/^2 - /);
  s1 = step1(await save());
  check('zweiter Verweis direkt dahinter: mit Leerzeichen getrennt', s1.plain.endsWith('4 2') && s1.markups.split(')(').length === 2, `${s1.plain.slice(-10)} ${s1.markups}`);
  await k.press('Control+z');
  await k.press('Control+z');
  check('Undo nimmt beide Verweise zurück', (await save()) === fixture(REF));

  // mit Verfolgung
  await page.click('[data-name="toolbar.track.changes"]');
  await caret(S1, 'end');
  await page.click(linkBtn);
  await choose(/^4 - /);
  s1 = step1(await save());
  check('mit Verfolgung als ChangedSteplink des Sets', /,ChangedSteplink,yellow\)$/.test(s1.markups) || /ChangedSteplink, ?yellow/.test(s1.markups), s1.markups);
  await k.press('Control+z');
  await page.click('[data-name="toolbar.track.changes"]');

  // Filter und Schließen
  await caret(S1, 'end');
  await page.click(linkBtn);
  await page.fill('.app-steplink-filter', 'WHILE');
  const filtered = await page.$$eval('.app-steplink-dialog .app-catch-item', (b) => b.map((x) => x.textContent));
  // gefiltert wird wie im Original über den ganzen Text des Schritts, nicht nur über die angezeigten 60 Zeichen
  check('Filter ohne Groß-/Kleinschreibung', filtered.length < items.length && filtered.some((t) => t.startsWith('2 - While loop')) && !filtered.some((t) => t.startsWith('1 - ')), filtered.join(' | '));
  await k.press('Enter');
  // das close-Ereignis des Dialogs kommt asynchron, erst danach ist er entfernt
  const gone = await page.waitForSelector('.app-steplink-dialog', { state: 'detached', timeout: 2000 }).then(() => true, () => false);
  out = await save();
  check('Enter schließt ohne Einfügen', gone && out === fixture(REF), `geschlossen: ${gone}, ${step1(out).plain.slice(-20)} | ${(out.match(/changeModeEnabled=\w+/) || [])[0]}`);

  // Strg+Klick folgt dem Verweis
  const catchLink = `[data-path="mainSequence/catchArea/catchSequences/0/steps/0/content/areas/0"] .sm-markup-Steplink`;
  await page.$eval(catchLink, (s) => s.scrollIntoView({ block: 'center' }));
  await k.down('Control');
  check('Handzeiger mit Strg', (await page.$eval(catchLink, (s) => getComputedStyle(s).cursor)) === 'pointer');
  await page.click(catchLink);
  await k.up('Control');
  check('Strg+Klick springt zum Schritt 10', (at = await where()) === `${M}9/content/areas/0`, at);
  const visible = await page.$eval(`[data-path="${M}9/content/areas/0"]`, (e) => {
    const r = e.getBoundingClientRect();
    const bar = document.querySelector('.app-bar').getBoundingClientRect();
    return { ok: r.top >= bar.bottom && r.bottom <= innerHeight, top: r.top, bar: bar.bottom };
  });
  // die Leiste klebt oben, das Ziel darf nicht darunter verschwinden
  check('der Schritt ist zu sehen (nicht unter der Leiste)', visible.ok, JSON.stringify(visible));

  // defekter Verweis: Ziel gelöscht
  await caret(S1, 'end');
  await page.click(linkBtn);
  await choose(/^5 - /);
  await caret(`${M}4/content/areas/0`, 'end');
  await page.click('button[title="Schritt löschen"]');
  dialogs.length = 0; // Rückfrage wegen des Verweises
  out = await save();
  check('Verweis auf gelöschten Schritt wird defekt', step1(out).plain.endsWith('5?'), step1(out).plain.slice(-10));
  const s1Link = `[data-path="${S1}"] .sm-markup-Steplink`;
  await page.$eval(s1Link, (s) => s.scrollIntoView({ block: 'center' }));
  await page.click(s1Link, { modifiers: ['Control'] });
  check('Strg+Klick auf defekten Verweis meldet sich', dialogs.length === 1 && dialogs[0].startsWith('Springen nicht möglich'), JSON.stringify(dialogs));
  dialogs.length = 0;

  // ---- 3.5 Text-Werkzeuge ----
  await open(REF);
  /** Text des Schritts 1 in der gespeicherten Datei (HTML und Klartext) */
  const step1Html = (text) => /simple\(1, 5582897d, `([^`]*)`/.exec(text)?.[1] ?? '';
  const paraMenu = async (label) => {
    await page.click('.app-combo[data-name="paragraph"]');
    await page.locator('.app-menu-item', { hasText: label }).first().click();
  };
  const sizeMenu = async (label) => {
    await page.click('button[title="Schriftgröße"]');
    await page.locator('.app-menu-item', { hasText: new RegExp(`^${label}$`) }).click();
  };
  const fontMenu = async (label) => {
    await page.click('.app-combo[data-name="font"]');
    await page.locator('.app-menu-item', { hasText: label }).click();
  };
  /** Wort in einer Area auswählen (erstes Vorkommen) */
  const selectWord = (p, word) =>
    page.evaluate(
      ([p, word]) => {
        const el = document.querySelector(`[data-path="${CSS.escape(p)}"]`);
        el.scrollIntoView({ block: 'center' });
        el.focus();
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          const i = n.data.indexOf(word);
          if (i < 0) continue;
          getSelection().setBaseAndExtent(n, i, n, i + word.length);
          return true;
        }
        return false;
      },
      [p, word],
    );
  const pressed = (sel) => page.$eval(sel, (b) => b.classList.contains('app-toggle-on'));
  const comboText = (name) => page.$eval(`.app-combo[data-name="${name}"]`, (b) => b.textContent);
  const settle = () => page.waitForTimeout(50);

  await caret(S1, 'end');
  await page.click('button[title="Zentriert"]');
  check('Ausrichten von Text ohne Absatz-Element ändert nichts (wie Swing)', (await save()) === fixture(REF));
  check('Absatzformat zeigt Body Text', (await comboText('paragraph')) === 'Body Text');
  await paraMenu('Überschrift 1');
  out = await save();
  check('Überschrift 1 packt den Text ein', /^<h1>\s*Simple step\.[\s\S]*inserted before\.\s*<\/h1>$/.test(step1Html(out)), step1Html(out).slice(0, 80));
  check('der Klartext bleibt', step1(out).plain === step1(fixture(REF)).plain);
  await settle();
  check('die Combo folgt der Schreibmarke', (await comboText('paragraph')) === 'Überschrift 1');
  await page.click('button[title="Zentriert"]');
  out = await save();
  check('Zentriert setzt align am Absatz', step1Html(out).startsWith('<h1 align="center">'), step1Html(out).slice(0, 40));
  await settle();
  check('der Knopf zeigt die Ausrichtung', (await pressed('button[title="Zentriert"]')) && !(await pressed('button[title="Linksbündig"]')));
  await k.press('Alt+2');
  out = await save();
  check('Alt+2: Überschrift 2, align bleibt', step1Html(out).startsWith('<h2 align="center">'), step1Html(out).slice(0, 40));
  await paraMenu('Vorformatiert');
  out = await save();
  check('Vorformatiert fasst den Leerraum zusammen', step1Html(out) === `<pre align="center">${step1(fixture(REF)).plain}</pre>`, step1Html(out).slice(0, 80));
  check('Schreibmarke bleibt in der Area', (await where()) === S1);
  await press('Control+z', 4);
  check('jedes Absatzformat und jede Ausrichtung ist ein Undo-Schritt', (await save()) === fixture(REF));

  // Zeichenformate
  await selectWord(S1, 'Simple');
  await sizeMenu('Groß');
  out = await save();
  check('Schriftgröße Groß schreibt <font size="5">', step1Html(out).startsWith('<font size="5">Simple</font> step.'), step1Html(out).slice(0, 40));
  await page.click('button[title="Schriftgröße"]');
  check('das Größenmenü zeigt die Größe an der Auswahl', (await page.$eval('.app-menu-checked', (b) => b.textContent)) === 'Groß');
  await k.press('Escape');
  check('Escape schließt das Menü', (await page.$('.app-menu')) === null);
  await selectWord(S1, 'Every');
  await fontMenu('Roboto');
  out = await save();
  check('Schriftart Roboto', step1Html(out).includes('<font face="Roboto">Every</font>'), step1Html(out).slice(0, 80));
  check('die Schrift-Combo zeigt die gewählte Schrift', (await comboText('font')) === 'Roboto - Sans Serif');
  await selectWord(S1, 'Every');
  await fontMenu('Sitka');
  out = await save();
  check('Sitka entfernt face wieder', !step1Html(out).includes('face=') && step1Html(out).includes(' Every step'), step1Html(out).slice(0, 80));
  await selectWord(S1, 'ID');
  await page.click('button[title="Farbe..."]');
  // der Farbwähler des Browsers lässt sich nicht bedienen: schließen und die Wahl nachstellen
  await k.press('Escape');
  await page.$eval('.app-color-input', (i) => {
    i.value = '#ff0000';
    i.dispatchEvent(new Event('change'));
  });
  out = await save();
  check('Farbe schreibt <font color>', step1Html(out).includes('<font color="#ff0000">ID</font>'), step1Html(out).slice(0, 80));
  await selectWord(S1, 'step');
  await k.press('Control+b');
  await settle();
  check('Fett-Knopf zeigt den Zustand', await pressed('button[title="Fett (Strg+B)"]'));
  // alles auswählen, Styles löschen
  await page.evaluate((p) => {
    const el = document.querySelector(`[data-path="${CSS.escape(p)}"]`);
    getSelection().selectAllChildren(el);
  }, S1);
  await k.press('Control+Shift+Y');
  out = await save();
  check('Strg+Umschalt+Y löscht alle Zeichenformate', !/<(font|b)\b/.test(step1Html(out)) && step1(out).plain === step1(fixture(REF)).plain, step1Html(out).slice(0, 80));
  await press('Control+z', 6);
  check('Zeichenformate sind je ein Undo-Schritt', (await save()) === fixture(REF));

  // Markierungen der Änderungsverfolgung überstehen Absatzformat und Styles löschen
  await page.click('[data-name="toolbar.track.changes"]');
  await caret(S1, 'end');
  await k.type(' neu');
  await paraMenu('Überschrift 3');
  await page.evaluate((p) => getSelection().selectAllChildren(document.querySelector(`[data-path="${CSS.escape(p)}"]`)), S1);
  await page.click('button[title="Styles löschen (Strg+Umschalt+Y)"]');
  out = await save();
  s1 = step1(out);
  check('Änderungsmarkierung bleibt bei Absatzformat und Styles löschen', step1Html(out).startsWith('<h3>') && s1.plain.endsWith('before. neu') && /\(\d+,\d+,Changed,/.test(s1.markups), `${step1Html(out).slice(0, 10)} ${s1.markups}`);
  await page.click('[data-name="toolbar.track.changes"]');

  // leerer neuer Schritt: Überschrift und tippen
  await open(REF);
  await caret(S1, 'end');
  await page.click('.app-palette-btn[title="Einfachen Schritt anlegen"]');
  await page.evaluate(() => getSelection().selectAllChildren(getSelection().focusNode.parentElement.closest('[data-path]')));
  await k.press('Delete');
  await k.press('Alt+1');
  await k.type('Neu');
  out = await save();
  check('leerer Schritt wird Überschrift, Tippen landet darin', /simple\(2, \w+, `<h1>\s*Neu\s*<\/h1>`, plain=`Neu`/.test(out), (/simple\(2, [^\n]*/.exec(out) || [''])[0]);

  check('keine Dialoge unerwartet', dialogs.length === 0, JSON.stringify(dialogs));
  check('keine Fehler im Browser', errors.length === 0, errors.join('\n'));
  await browser.close();
  process.exit(failures ? 1 : 0);
})();
