// Regresja: w Opcjach panel YouTube (Focus Mode) i blok diagnostyki YouTube miały to samo
// id="youtube". Otwarcie Diagnostyki wpisywało raport do panelu i niszczyło jego zawartość.
// Diagnostyka ma id="youtubeDiag". Focus Mode (i jego zakładka) został usunięty z produktu.
//
// 1) statycznie: brak powtórzonych id w stronach rozszerzenia,
// 2) w prawdziwym Chromium: raport YouTube Protection trafia do #youtubeDiag w Diagnostyce;
//    każda zakładka ma swój niepusty panel; brak martwych kontrolek Focus Mode. Brak Playwright/Chromium → SKIP.

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
  assert.doesNotMatch(html, /id="youtube"/, 'brak panelu Focus Mode');
  assert.doesNotMatch(html, /data-tab="youtube"|focus(Enabled|Options|Msg|Heading)/, 'brak zakładki i kontrolek Focus Mode');
  assert.match(html, /<div id="youtubeDiag" class="diag-block">/);
  assert.match(js, /\$\('youtubeDiag'\)\.innerHTML/);
  assert.doesNotMatch(js, /\$\('youtube'\)\.innerHTML/);
});

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

test('Opcje w Chromium: diagnostyka YouTube w #youtubeDiag; każda zakładka ma niepusty panel; brak martwych kontrolek', { skip, timeout: 180_000 }, async () => {
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
    const errors = [];
    opt.on('pageerror', (e) => errors.push(String(e)));
    await opt.goto(`chrome-extension://${id}/options/options.html`);
    // options.js podpina listenery zakładek po `await options:get` – czekamy na wyrenderowane Opcje
    await opt.waitForFunction(() => document.getElementById('modeCards').children.length > 0, null, { timeout: 15000 });

    // każda zakładka otwiera dokładnie swój panel, a panel nie jest pusty
    const tabs = await opt.$$eval('.tab', (els) => els.map((e) => e.dataset.tab));
    assert.ok(!tabs.includes('youtube'), 'brak zakładki Focus Mode');
    for (const tab of tabs) {
      await opt.click(`.tab[data-tab="${tab}"]`);
      const visible = await opt.$$eval('.panel', (ps) => ps.filter((p) => !p.hidden).map((p) => p.id));
      assert.deepEqual(visible, [tab], `zakładka ${tab}`);
      assert.ok((await opt.locator(`#${tab}`).innerText()).trim().length > 0, `panel ${tab} niepusty`);
    }
    assert.equal(await opt.locator('[id^="focus"], .focus-master, .focus-options').count(), 0, 'brak kontrolek Focus Mode');

    // Diagnostyka: raport YouTube Protection w #youtubeDiag
    await opt.click('.tab[data-tab="diag"]');
    await opt.waitForFunction(() => document.getElementById('youtubeDiag').textContent.trim().length > 0, null, { timeout: 15000 });
    assert.match(await opt.locator('#youtubeDiag').innerText(), /Status:/, 'raport YouTube w bloku diagnostyki');
    assert.equal(await opt.locator('#youtubeDiag').evaluate((e) => !!e.closest('#diag')), true, 'blok w panelu Diagnostyka');
    assert.equal(await opt.locator('[id="youtubeDiag"]').count(), 1);
    assert.deepEqual(errors, []);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
