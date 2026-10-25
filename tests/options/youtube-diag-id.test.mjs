// Regresja: w Opcjach panel YouTube i blok diagnostyki YouTube miały to samo id="youtube".
// Otwarcie Diagnostyki wpisywało raport do pierwszego elementu z tym id, czyli do panelu
// YouTube, i niszczyło jego zawartość. Diagnostyka ma teraz id="youtubeDiag".
//
// 1) statycznie: brak powtórzonych id w stronach rozszerzenia,
// 2) w prawdziwym Chromium: po otwarciu Diagnostyki panel YouTube istnieje, ma swoje kontrolki
//    i działa, a raport trafia do #youtubeDiag. Brak Playwright/Chromium → SKIP.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, EXTENSION_ENTRIES, ROOT } from '../../tools/chromium-smoke.mjs';

const PAGES = ['options/options.html', 'popup/popup.html', 'welcome/welcome.html'];

function duplicateIds(html) {
  const seen = new Map();
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) || 0) + 1);
  return [...seen].filter(([, n]) => n > 1).map(([id]) => id);
}

test('strony rozszerzenia nie mają powtórzonych id', () => {
  for (const p of PAGES) {
    const file = path.join(ROOT, p);
    if (!fs.existsSync(file)) continue;
    assert.deepEqual(duplicateIds(fs.readFileSync(file, 'utf8')), [], p);
  }
  // test pomocniczy nie jest pusty
  assert.deepEqual(duplicateIds('<div id="a"></div><p id="a"></p><i id="b"></i>'), ['a']);
});

test('Opcje: diagnostyka YouTube ma własne id, JS pisze do #youtubeDiag', () => {
  const html = fs.readFileSync(path.join(ROOT, 'options/options.html'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'options/options.js'), 'utf8');
  assert.match(html, /<section id="youtube" class="panel"/);
  assert.match(html, /<div id="youtubeDiag" class="diag-block">/);
  assert.match(js, /\$\('youtubeDiag'\)\.innerHTML/);
  assert.doesNotMatch(js, /\$\('youtube'\)\.innerHTML/);
});

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

test('Opcje w Chromium: po otwarciu Diagnostyki panel YouTube nadal istnieje i działa', { skip, timeout: 180_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-ytdiag-'));
  const ext = path.join(tmp, 'ext');
  fs.mkdirSync(ext);
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  const ctx = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true, channel: 'chromium',
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'],
  });
  try {
    await ctx.route(/^https?:/, (r) => r.fulfill({ status: 204, body: '' }));
    let [sw] = ctx.serviceWorkers();
    if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 30000 });
    const id = new URL(sw.url()).host;
    const opt = await ctx.newPage();
    await opt.goto(`chrome-extension://${id}/options/options.html`);
    // options.js podpina listener Diagnostyki po `await options:get` – czekamy na wyrenderowane Opcje
    await opt.waitForFunction(() => document.getElementById('modeCards').children.length > 0
      && document.getElementById('focusOptions').children.length > 0, null, { timeout: 15000 });
    const panelBefore = await opt.locator('#youtube').innerHTML();

    // otwarcie Diagnostyki renderuje raport (w tym blok YouTube)
    await opt.click('.tab[data-tab="diag"]');
    await opt.waitForFunction(() => document.getElementById('youtubeDiag').textContent.trim().length > 0, null, { timeout: 15000 });

    assert.equal(await opt.locator('[id="youtube"]').count(), 1, 'jeden element #youtube');
    assert.equal(await opt.evaluate(() => document.getElementById('youtube').tagName), 'SECTION', '#youtube to panel');
    assert.equal(await opt.locator('#youtube').innerHTML(), panelBefore, 'panel YouTube nienadpisany przez diagnostykę');
    assert.match(await opt.locator('#youtubeDiag').innerText(), /Status:/, 'raport YouTube w bloku diagnostyki');
    assert.equal(await opt.locator('#youtubeDiag').evaluate((e) => !!e.closest('#diag')), true, 'blok w panelu Diagnostyka');

    // panel YouTube działa: otwiera się z zakładki, kontrolki są widoczne i reagują
    await opt.click('.tab[data-tab="youtube"]');
    assert.equal(await opt.locator('#youtube').isVisible(), true);
    assert.equal(await opt.locator('#diag').isVisible(), false);
    const box = opt.locator('#focusEnabled');
    const before = await box.isChecked();
    await opt.locator('label.focus-master').click();
    await opt.waitForFunction((b) => document.getElementById('focusEnabled').checked !== b, before, { timeout: 10000 });
    const stored = await opt.evaluate(() => chrome.runtime.sendMessage({ type: 'options:get' }));
    assert.equal(!!(stored.youtubeFocus || stored.focus || {}).enabled, !before, 'zmiana zapisana w ustawieniach');
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
