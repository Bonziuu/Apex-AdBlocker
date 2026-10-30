// Nawigacja SPA w prawdziwym Chromium (bez sieci, bez uprawnień webNavigation i tabs).
// Brak Playwright/Chromium → SKIP.
//   1. Chrome dostarcza changeInfo.url w tabs.onUpdated dla history.pushState (dzięki <all_urls>).
//   2. YouTube (atrapa): raport odtwarzacza starego filmu znika po pushState watch → watch,
//      watch → Shorts i Shorts → watch; od razu przychodzi świeży raport nowej strony
//      (prośba service workera do youtube/health.js), także przy identycznym stanie odtwarzacza.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, EXTENSION_ENTRIES, ROOT } from '../../tools/chromium-smoke.mjs';

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

const PAGE = '<!doctype html><title>Strona</title><p>treść</p>';
// atrapa odtwarzacza z widocznym błędem → youtube/health.js od razu raportuje status "error"
const YT = '<!doctype html><title>YouTube</title><div id="movie_player" class="html5-video-player" style="width:320px;height:180px">'
  + '<div class="ytp-error" style="display:block;width:100px;height:20px">błąd</div></div>';

async function launch(tmp) {
  const ext = path.join(tmp, 'ext');
  fs.mkdirSync(ext);
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  return chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true, channel: 'chromium',
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'],
  });
}

async function poll(fn, ok, timeout = 15000, step = 200) {
  const end = Date.now() + timeout;
  let v;
  while (Date.now() < end) {
    v = await fn();
    if (ok(v)) return v;
    await new Promise((r) => setTimeout(r, step));
  }
  return v;
}

test('Chromium: history.pushState → tabs.onUpdated z url; YouTube SPA: stary raport usunięty, świeży raport nowego filmu', { skip, timeout: 240_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-nav-'));
  const ctx = await launch(tmp);
  const errors = [];
  ctx.on('weberror', (e) => errors.push(String(e.error())));
  try {
    await ctx.route(/^https?:/, (r) => {
      const host = new URL(r.request().url()).hostname;
      if (host === 'www.youtube.com') return r.fulfill({ contentType: 'text/html', body: YT });
      if (host === 'www.example.com') return r.fulfill({ contentType: 'text/html', body: PAGE });
      return r.fulfill({ status: 204, body: '' });
    });
    let [sw] = ctx.serviceWorkers();
    if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 30000 });
    const id = new URL(sw.url()).host;
    const ext = await ctx.newPage();
    await ext.goto(`chrome-extension://${id}/options/options.html`);
    await ext.waitForFunction(() => document.querySelectorAll('#listContainer .card').length > 0, null, { timeout: 60000 });
    assert.ok(!(await ext.evaluate(() => chrome.runtime.getManifest().permissions)).includes('webNavigation'));
    // własny podsłuch na stronie rozszerzenia – te same zdarzenia, które dostaje service worker
    await ext.evaluate(() => {
      window.__urls = [];
      chrome.tabs.onUpdated.addListener((tabId, info) => { if (info.url) window.__urls.push(info.url); });
    });
    const call = (msg) => ext.evaluate((m) => chrome.runtime.sendMessage(m), msg);
    const player = async () => ((await call({ type: 'health:get' })).youtube || {}).player || null;

    // 1. zwykła strona: pushState → changeInfo.url bez uprawnienia tabs
    const page = await ctx.newPage();
    await page.goto('https://www.example.com/a');
    await page.evaluate(() => history.pushState({}, '', '/b?x=1'));
    const urls = await poll(() => ext.evaluate(() => window.__urls.slice()), (u) => u.includes('https://www.example.com/b?x=1'));
    assert.ok(urls.includes('https://www.example.com/b?x=1'), `pushState dostarczył url: ${urls.join(', ')}`);
    await page.close();

    // 2. YouTube SPA
    const yt = await ctx.newPage();
    await yt.goto('https://www.youtube.com/watch?v=AAAAAAAAAAA');
    await yt.bringToFront(); // health.js raportuje tylko z widocznej karty
    let p = await poll(player, (x) => x && x.status === 'error' && x.page === 'watch');
    assert.equal(p && p.page, 'watch', 'raport filmu A');

    // watch → inny watch (bez przeładowania, identyczny stan odtwarzacza): raport filmu A usunięty,
    // service worker prosi health.js o ponowny raport → świeży raport B od razu (bez czekania na tick)
    const atA = p.at;
    const t0 = Date.now();
    await yt.evaluate(() => history.pushState({}, '', '/watch?v=BBBBBBBBBBB'));
    p = await poll(player, (x) => x && x.at > atA, 2500, 50);
    assert.ok(p && p.at > atA, 'świeży raport B po watch → watch');
    assert.equal(p.page, 'watch');
    assert.equal(p.status, 'error', 'aktualny stan odtwarzacza');
    assert.ok(Date.now() - t0 < 2500, `raport B bez czekania na 3-sekundowy tick (${Date.now() - t0} ms)`);

    // watch → Shorts: stary raport usunięty, nowy raport z typem strony "shorts"
    await yt.evaluate(() => history.pushState({}, '', '/shorts/CCCCCCCCCCC'));
    p = await poll(player, (x) => x && x.page === 'shorts', 10000);
    assert.equal(p && p.page, 'shorts', 'nowy raport dla Shorts');

    // Shorts → watch
    await yt.evaluate(() => history.pushState({}, '', '/watch?v=DDDDDDDDDDD'));
    p = await poll(player, (x) => x && x.page === 'watch', 10000);
    assert.equal(p && p.page, 'watch', 'nowy raport dla watch');

    assert.ok((await ext.evaluate(() => window.__urls.slice())).includes('https://www.youtube.com/shorts/CCCCCCCCCCC'));
    assert.deepEqual(errors, []);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('Chromium: ochrona wyłączona dla strony – stan per karta po nawigacji (pełnej i SPA)', { skip, timeout: 180_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-nav-off-'));
  const ctx = await launch(tmp);
  try {
    await ctx.route(/^https?:/, (r) => r.fulfill({ contentType: 'text/html', body: PAGE }));
    let [sw] = ctx.serviceWorkers();
    if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 30000 });
    const id = new URL(sw.url()).host;
    const ext = await ctx.newPage();
    await ext.goto(`chrome-extension://${id}/options/options.html`);
    await ext.waitForFunction(() => document.querySelectorAll('#listContainer .card').length > 0, null, { timeout: 60000 });
    const call = (msg) => ext.evaluate((m) => chrome.runtime.sendMessage(m), msg);
    const r = await call({ type: 'options:setDisabledSites', sites: ['example.com'] });
    assert.deepEqual(r.disabledSites, ['example.com']);

    const page = await ctx.newPage();
    await page.goto('https://www.example.com/');
    const tabId = await ext.evaluate(async () => (await chrome.tabs.query({ url: 'https://www.example.com/*' }))[0].id);
    const get = () => call({ type: 'popup:get', tabId });
    assert.equal((await get()).disabled, true, 'wyłączona strona');
    await page.evaluate(() => history.pushState({}, '', '/inna'));
    assert.equal((await get()).disabled, true, 'po pushState nadal wyłączona');
    await page.goto('https://news.example/');
    assert.equal((await get()).disabled, false, 'inna strona – ochrona włączona');
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
