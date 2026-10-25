// Reguły ChromeBlock Polish Supplement (partia 1 po reteście) w prawdziwym Chromium – na LOKALNYCH stronach
// testowych o opisanej w obserwacjach strukturze (bez sieci). Rozszerzenie testowe ma w liście „ads”
// WYŁĄCZNIE ChromeBlock Polish Supplement, więc wynik zależy tylko od naszych reguł.
// To test mechaniki reguł, a nie retest prawdziwych stron (ten wymaga internetu: test:polish-sites).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { LISTS, ROOT } from '../../tools/lists-config.mjs';
import { EXTENSION_ENTRIES, loadPlaywright } from '../../tools/chromium-smoke.mjs';
import { buildGapExtension } from '../../tools/polish-sites/test-polish-sites.mjs';

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

const filler = (t) => `<p>${`${t} `.repeat(30)}</p>`;
const PAGES = {
  'www.bankier.pl': `<!doctype html><meta charset="utf-8"><title>B</title><body>${filler('Notowania.')}
    <div id="n2b-ad-r2" class="n2b-ad-container -r2" style="width:940px;height:200px"><span>REKLAMA</span></div>
    <div id="n2b-ad-r3" class="n2b-ad-container -r3" style="width:940px;height:200px"><span>REKLAMA</span></div>
    <div id="notowania" style="height:100px">Kursy walut</div></body>`,
  'businessinsider.com.pl': `<!doctype html><meta charset="utf-8"><title>BI</title><body>
    <header><nav><ul class="first-level"><li id="nav-promo">Materiał promocyjny</li><li>Gospodarka</li></ul></nav></header>${filler('Gospodarka.')}
    <div class="section-list_mosaic-3elem" id="mosaic">
      <a class="list-item item--m item--m--img-right" id="slot-flat-natleft-2" href="#"><div class="item_description"><span>MATERIAŁ PROMOCYJNY</span><h3>Tytuł A</h3></div></a>
      <a class="list-item item--m item--m--img-right" id="card-promo" href="#"><div class="item_description"><span>Materiał promocyjny</span><h3>Tytuł B</h3></div></a>
      <a class="list-item item--m item--m--img-right" id="card-normal" href="#"><div class="item_description"><span>Finanse</span><h3>Materiał promocyjny w tytule nie jest etykietą</h3></div></a>
    </div>
    <div class="section-list_other"><a class="list-item item--m item--m--img-right" id="card-outside" href="#"><div class="item_description"><span>Materiał promocyjny</span><h3>Poza mozaiką</h3></div></a></div></body>`,
  'www.gazeta.pl': `<!doctype html><meta charset="utf-8"><title>G</title><body>${filler('Wiadomości.')}
    <article class="tile" id="t1"><div class="tile__meta"><span>MATERIAŁ PROMOCYJNY</span></div><h2>Promocja 1</h2></article>
    <article class="tile tile--big" id="t2"><span> Materiał promocyjny </span><h2>Promocja 2</h2></article>
    <article class="tile" id="t3"><span>Sport</span><h2>Zwykły kafel</h2></article>
    <article class="tile" id="t4"><span>Kultura</span><h2>Materiał promocyjny – recenzja kampanii</h2></article>
    <div class="salesModule salesModule--fourColumn" id="sales">
      <a class="salesModule__article" id="s1" href="#"><div><span>MATERIAŁ PROMOCYJNY</span></div><h3>Oferta</h3></a>
      <a class="salesModule__article" id="s2" href="#"><div><span>Zakupy</span></div><h3>Zwykły link</h3></a>
    </div>
    <footer id="stopka"><span>Materiał promocyjny</span> <span>Kontakt</span></footer></body>`,
};

test('Chromium (lokalne strony testowe): reguły partii 1 ukrywają tylko obserwowane sloty / kafle z dokładną etykietą', { skip, timeout: 600_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-polish-rules-'));
  const ext = path.join(tmp, 'ext');
  fs.mkdirSync(ext);
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  // ads = tylko ChromeBlock Polish Supplement; pozostałe listy bez zmian
  const lists = LISTS.map((l) => (l.id === 'ads' ? { ...l, sources: [{ file: 'chromeblock-polish/chromeblock-polish.txt' }] } : l));
  buildGapExtension(ext, { lists });
  const ctx = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true, channel: 'chromium',
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'],
  });
  try {
    await ctx.route(/^https?:/, (r) => {
      const h = new URL(r.request().url()).hostname;
      return PAGES[h] ? r.fulfill({ contentType: 'text/html; charset=utf-8', body: PAGES[h] }) : r.fulfill({ status: 204, body: '' });
    });
    let [sw] = ctx.serviceWorkers();
    if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));
    const shown = (page, sel) => page.$eval(sel, (el) => { const r = el.getBoundingClientRect(); return getComputedStyle(el).display !== 'none' && r.height > 0; });
    const check = async (url, hidden, visible) => {
      const page = await ctx.newPage();
      await page.goto(url);
      for (const sel of hidden) await page.waitForFunction((s) => { const el = document.querySelector(s); return el && (getComputedStyle(el).display === 'none' || el.getBoundingClientRect().height === 0); }, sel, { timeout: 15000 });
      await page.waitForTimeout(500);
      for (const sel of hidden) assert.equal(await shown(page, sel), false, `${url}: ${sel} ukryty`);
      for (const sel of visible) assert.equal(await shown(page, sel), true, `${url}: ${sel} widoczny`);
      await page.close();
    };
    await check('https://www.bankier.pl/', ['#n2b-ad-r2'], ['#n2b-ad-r3', '#notowania']);
    await check('https://businessinsider.com.pl/', ['#slot-flat-natleft-2', '#card-promo'], ['#mosaic', '#card-normal', '#card-outside', '#nav-promo']);
    await check('https://www.gazeta.pl/', ['#t1', '#t2', '#s1'], ['#t3', '#t4', '#sales', '#s2', '#stopka']);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
