// YouTube Focus Mode w prawdziwym Chromium z załadowanym ChromeBlock: zmiana ustawień działa
// od razu na otwartej karcie (bez przeładowania strony i rozszerzenia). Strona-atrapa pod
// https://www.youtube.com/ (Playwright route) – bez sieci i bez treści YouTube.
// Brak Playwright/Chromium → SKIP. Profil tymczasowy, usuwany po teście.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, EXTENSION_ENTRIES, ROOT } from '../../tools/chromium-smoke.mjs';
import { FOCUS_SELECTORS } from '../../shared/youtube-focus.js';

const FIXTURE = `<!doctype html><html><head><meta charset="utf-8"><title>YouTube</title></head><body>
<ytd-app>
  <ytd-guide-entry-renderer id="g-shorts"><a title="Shorts">Shorts</a></ytd-guide-entry-renderer>
  <ytd-browse page-subtype="home">
    <ytd-rich-grid-renderer id="home-feed">kanał rekomendacji</ytd-rich-grid-renderer>
  </ytd-browse>
  <ytd-rich-section-renderer id="home-shorts"><ytd-rich-shelf-renderer is-shorts>półka Shorts</ytd-rich-shelf-renderer></ytd-rich-section-renderer>
  <ytd-reel-shelf-renderer id="reel-shelf">Shorts w wynikach</ytd-reel-shelf-renderer>
  <ytd-watch-flexy>
    <div id="primary">
      <div id="movie_player" class="html5-video-player"><video id="vid"></video>
        <div class="ytp-endscreen-content" id="endscreen">sugestie końcowe</div>
        <div class="ytp-ce-element" id="card">karta końcowa</div>
      </div>
      <ytd-comments id="comments">komentarze</ytd-comments>
    </div>
    <div id="secondary"><div id="playlist">lista odtwarzania</div><div id="related">proponowane</div></div>
  </ytd-watch-flexy>
</ytd-app>
<script>window.__loadId = Math.random();</script>
</body></html>`;

const GROUPS = {
  shorts: ['#g-shorts', '#home-shorts', '#reel-shelf'],
  recommendations: ['#related', '#home-feed'],
  comments: ['#comments'],
  endscreen: ['#endscreen', '#card'],
};
const UNTOUCHED = ['#movie_player', '#vid', '#playlist'];

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

test('Focus Mode: zmiana w opcjach działa od razu na otwartej karcie YouTube (bez przeładowania)', { skip, timeout: 180_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-focus-'));
  const ext = path.join(tmp, 'ext');
  fs.mkdirSync(ext);
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  const ctx = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true, channel: 'chromium',
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'],
  });
  try {
    await ctx.route(/^https?:/, (r) => (new URL(r.request().url()).hostname === 'www.youtube.com'
      ? r.fulfill({ contentType: 'text/html; charset=utf-8', body: FIXTURE })
      : r.fulfill({ status: 204, body: '' })));
    let [sw] = ctx.serviceWorkers();
    if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 30000 });
    const id = new URL(sw.url()).host;
    const opt = await ctx.newPage();
    await opt.goto(`chrome-extension://${id}/options/options.html#youtube`);
    const setFocus = (settings) => opt.evaluate((s) => chrome.runtime.sendMessage({ type: 'options:setYouTubeFocus', settings: s }), settings);

    const yt = await ctx.newPage();
    await yt.goto('https://www.youtube.com/watch?v=focusTest01');
    const loadId = await yt.evaluate(() => window.__loadId);
    const hidden = (sel) => yt.evaluate((s) => getComputedStyle(document.querySelector(s)).display === 'none', sel);
    const state = async () => Object.fromEntries(await Promise.all([...Object.values(GROUPS).flat(), ...UNTOUCHED].map(async (s) => [s, await hidden(s)])));
    const waitFor = (fn) => yt.waitForFunction(fn, null, { timeout: 10000, polling: 100 });

    // 1. domyślnie OFF – nic nie jest ukryte, brak arkusza Focus Mode
    await yt.waitForTimeout(1500);
    let st = await state();
    for (const [s, h] of Object.entries(st)) assert.equal(h, false, `domyślnie widoczne: ${s}`);
    assert.equal(await yt.locator('#chromeblock-youtube-focus').count(), 0);

    // UI opcji: główny przełącznik + 4 opcje (domyślnie: OFF / ON×4)
    await opt.waitForFunction(() => document.querySelectorAll('#focusOptions input').length === 4, null, { timeout: 15000 });
    assert.deepEqual(await opt.evaluate(() => [document.getElementById('focusEnabled').checked, ...[...document.querySelectorAll('#focusOptions input')].map((i) => i.checked)]),
      [false, true, true, true, true]);

    // 2. włączenie głównego przełącznika KLIKNIĘCIEM w opcjach → wszystkie grupy ukryte od razu
    await opt.click('label.focus-master .switch span');
    await waitFor(() => getComputedStyle(document.querySelector('#related')).display === 'none');
    st = await state();
    for (const s of Object.values(GROUPS).flat()) assert.equal(st[s], true, `ukryte: ${s}`);
    for (const s of UNTOUCHED) assert.equal(st[s], false, `odtwarzacz / lista odtwarzania nietknięte: ${s}`);

    // 3. pojedyncza opcja OFF (kliknięcie „Ukryj komentarze” w opcjach) → tylko ta grupa wraca
    await opt.locator('#focusOptions input[data-key="comments"] + span').click();
    await waitFor(() => getComputedStyle(document.querySelector('#comments')).display !== 'none');
    st = await state();
    assert.equal(st['#comments'], false);
    for (const g of ['shorts', 'recommendations', 'endscreen']) for (const s of GROUPS[g]) assert.equal(st[s], true, `nadal ukryte: ${s}`);

    // 4. główny przełącznik OFF → wszystko widoczne, arkusz usunięty
    await setFocus({ enabled: false });
    await waitFor(() => !document.getElementById('chromeblock-youtube-focus'));
    st = await state();
    for (const [s, h] of Object.entries(st)) assert.equal(h, false, `po wyłączeniu widoczne: ${s}`);

    // bez przeładowania strony
    assert.equal(await yt.evaluate(() => window.__loadId), loadId, 'karta nie została przeładowana');

    // 5. każdy selektor Focus Mode jest poprawny dla Chromium
    const bad = await yt.evaluate((sels) => sels.filter((s) => { try { document.querySelectorAll(s); return false; } catch { return true; } }), Object.values(FOCUS_SELECTORS).flat());
    assert.deepEqual(bad, [], `niepoprawne selektory: ${bad.join(', ')}`);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
