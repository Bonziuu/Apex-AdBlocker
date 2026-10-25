// Reguły ChromeBlock Polish Supplement (partia 1 po retestach + partia 2A) w prawdziwym Chromium – na LOKALNYCH stronach
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
  // Business Insider – wariant B (drugi zaobserwowany DOM): slot flat-ad-wrapper i karty ods-c-card-wrapper
  'businessinsider.com.pl/wariant-b': `<!doctype html><meta charset="utf-8"><title>BI B</title><body>
    <header><nav><ul class="first-level"><li id="nav-promo-b">Materiał promocyjny</li><li>Biznes</li></ul></nav></header>${filler('Biznes.')}
    <section id="section-b">
      <flat-ad-wrapper id="flat-natleft-2" style="display:block;height:120px"><div><span>MATERIAŁ PROMOCYJNY</span><h3>Tytuł C</h3></div></flat-ad-wrapper>
      <flat-ad-wrapper id="flat-natleft-1" style="display:block;height:120px"><div><span>Biznes</span><h3>Slot bez etykiety</h3></div></flat-ad-wrapper>
      <div class="ods-c-card-wrapper" id="card-b-promo"><article><span>Materiał promocyjny</span><h3>Tytuł D</h3></article></div>
      <div class="ods-c-card-wrapper" id="card-b-normal"><article><span>Finanse</span><h3>Materiał promocyjny w tytule nie jest etykietą</h3></article></div>
      <div class="ods-c-card-wrapper" id="card-b-normal2"><article><span>Rynki</span><h3>Zwykły artykuł</h3></article></div>
    </section></body>`,
  // partia 2A
  'www.wykop.pl': `<!doctype html><meta charset="utf-8"><title>W</title><body>${filler('Znaleziska.')}
    <div class="content" id="wy-content"><ul><li id="wy-1">Znalezisko 1</li><li class="ad" id="wy-ad" style="width:250px;height:36px"><span>reklama</span></li><li id="wy-2">Znalezisko 2</li></ul></div>
    <footer id="wy-footer"><span>Reklama</span> <span>Regulamin</span></footer></body>`,
  'www.wp.pl': `<!doctype html><meta charset="utf-8"><title>wp</title><body>${filler('Wiadomości.')}
    <div class="mt-5 flex w-full" id="wp-row">
      <div class="w-[300px]"><a class="wp-teaser-regular group flex" id="9081726354" href="#"><div><span>SPONSOROWANE</span></div><h3>Oferta</h3></a></div>
      <div class="w-[300px]"><a class="wp-teaser-regular group flex" id="wp-2" href="#"><div><span>Sport</span></div><h3>Zwykły teaser</h3></a></div>
      <div class="w-[300px]"><a class="wp-teaser-regular group flex" id="wp-3" href="#"><div><span>Lifestyle</span></div><h3>Sponsorowane wakacje – jak je rozpoznać</h3></a></div>
    </div>
    <footer id="wp-footer"><span>Sponsorowane</span> <span>Kontakt</span></footer></body>`,
  'www.o2.pl': `<!doctype html><meta charset="utf-8"><title>o2</title><body>${filler('Wiadomości.')}
    <div class="mt-5 flex w-full" id="o2-row">
      <div class="w-[300px]"><a class="wp-teaser-regular group flex" id="5647382910" href="#"><div><span>SPONSOROWANE</span></div><h3>Oferta</h3></a></div>
      <div class="w-[300px]"><a class="wp-teaser-regular group flex" id="o2-2" href="#"><div><span>Sport</span></div><h3>Zwykły teaser</h3></a></div>
      <div class="w-[300px]"><a class="wp-teaser-regular group flex" id="o2-3" href="#"><div><span>Lifestyle</span></div><h3>Sponsorowane wakacje – jak je rozpoznać</h3></a></div>
    </div>
    <footer id="o2-footer"><span>Sponsorowane</span> <span>Kontakt</span></footer></body>`,
  'www.onet.pl': `<!doctype html><meta charset="utf-8"><title>O</title><body>${filler('Onet.')}
    <div class="StandardLeftFeed_feed__a9f3" id="on-feed">
      <article class="StandardCard_card__x1y2 StandardCard_withImage__z3" id="on-promo"><div><span>MATERIAŁ PROMOCYJNY</span></div><h2>Oferta</h2></article>
      <article class="StandardCard_card__x1y2" id="on-normal"><div><span>Kraj</span></div><h2>Wiadomość</h2></article>
      <article class="StandardCard_card__x1y2" id="on-title"><div><span>Biznes</span></div><h2>Materiał promocyjny – czym jest i jak go oznaczać</h2></article>
    </div>
    <section class="StandardRightFeed_feed__q7w8" id="on-right"><div>
      <article class="SmallCard_card__m3n4" id="on-small-promo" style="width:300px;height:86px"><div><span>MATERIAŁ PROMOCYJNY</span></div><h3>Monitor – poradnik zakupowy</h3></article>
      <article class="SmallCard_card__m3n4" id="on-small-normal" style="width:300px;height:86px"><div><span>Kraj</span></div><h3>Wiadomość</h3></article>
      <article class="SmallCard_card__m3n4" id="on-small-title" style="width:300px;height:86px"><div><span>Tech</span></div><h3>Materiał promocyjny – co oznacza ta etykieta</h3></article>
    </div></section>
    <aside class="OtherFeed_box__k1" id="on-other"><article class="SmallCard_card__m3n4" id="on-small-outside" style="width:300px;height:86px"><div><span>MATERIAŁ PROMOCYJNY</span></div><h3>Poza prawym feedem</h3></article></aside></body>`,
  // partia 2B
  'www.interia.pl': `<!doctype html><meta charset="utf-8"><title>I</title><body>${filler('Interia.')}
    <div class="content-main" id="in-main">
      <div class="item tile item4 area-item-3"><a class="tile-a" id="in-promo" href="#"><span>MATERIAŁ PROMOCYJNY</span><h3>Oferta</h3></a></div>
      <div class="item tile item5 area-item-4"><a class="tile-a pinned" id="in-pinned" href="#"><span>Materiał promocyjny</span><h3>Przypięta oferta</h3></a></div>
      <div class="item tile item6"><a class="tile-a" id="in-normal" href="#"><span>Fakty</span><h3>Wiadomość</h3></a></div>
      <div class="item tile item7"><a class="tile-a" id="in-title" href="#"><span>Biznes</span><h3>Materiał promocyjny – jak go oznaczać</h3></a></div>
    </div>
    <footer id="in-footer"><span>Materiał promocyjny</span> <span>Kontakt</span></footer></body>`,
  'www.se.pl': `<!doctype html><meta charset="utf-8"><title>S</title><body>${filler('Super Express.')}
    <div class="section__slots" id="se-slots">
      <a class="slot slot_4 slot__small" id="se-promo4" href="#"><span>MATERIAŁ SPONSOROWANY</span><h3>Oferta A</h3></a>
      <a class="slot slot_6 slot__small" id="se-promo6" href="#"><span>Materiał sponsorowany</span><h3>Oferta B</h3></a>
      <a class="slot slot_5 slot__small" id="se-normal" href="#"><span>Sport</span><h3>Wynik meczu</h3></a>
      <a class="slot slot_7 slot__small" id="se-title" href="#"><span>Rozrywka</span><h3>Materiał sponsorowany w tytule to nie etykieta</h3></a>
    </div>
    <footer id="se-footer"><span>Materiał sponsorowany</span> <span>Regulamin</span></footer></body>`,
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

test('Chromium (lokalne strony testowe): reguły partii 1, 2A i 2B ukrywają tylko obserwowane sloty / kafle z dokładną etykietą', { skip, timeout: 600_000 }, async () => {
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
      const u = new URL(r.request().url());
      const body = PAGES[u.hostname + u.pathname] || PAGES[u.hostname];
      return body ? r.fulfill({ contentType: 'text/html; charset=utf-8', body }) : r.fulfill({ status: 204, body: '' });
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
    // wariant A (mozaika)
    await check('https://businessinsider.com.pl/', ['#slot-flat-natleft-2', '#card-promo'], ['#mosaic', '#card-normal', '#card-outside', '#nav-promo']);
    // wariant B (flat-ad-wrapper / ods-c-card-wrapper)
    await check('https://businessinsider.com.pl/wariant-b', ['#flat-natleft-2', '#card-b-promo'], ['#section-b', '#flat-natleft-1', '#card-b-normal', '#card-b-normal2', '#nav-promo-b']);
    await check('https://www.gazeta.pl/', ['#t1', '#t2', '#s1'], ['#t3', '#t4', '#sales', '#s2', '#stopka']);
    // partia 2A
    await check('https://www.wykop.pl/', ['#wy-ad'], ['#wy-content', '#wy-1', '#wy-2', '#wy-footer']);
    await check('https://www.wp.pl/', ['#\\39 081726354'], ['#wp-row', '#wp-2', '#wp-3', '#wp-footer']);
    await check('https://www.o2.pl/', ['#\\35 647382910'], ['#o2-row', '#o2-2', '#o2-3', '#o2-footer']);
    await check('https://www.onet.pl/', ['#on-promo', '#on-small-promo'], ['#on-feed', '#on-normal', '#on-title', '#on-right', '#on-small-normal', '#on-small-title', '#on-other', '#on-small-outside']);
    // partia 2B
    await check('https://www.interia.pl/', ['#in-promo', '#in-pinned'], ['#in-main', '#in-normal', '#in-title', '#in-footer']);
    await check('https://www.se.pl/', ['#se-promo4', '#se-promo6'], ['#se-slots', '#se-normal', '#se-title', '#se-footer']);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
