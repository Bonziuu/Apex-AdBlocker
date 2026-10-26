// activeTab w prawdziwym Chromium (bez sieci). Brak Playwright/Chromium → SKIP.
// Rozszerzenie bez declarativeNetRequestFeedback: getMatchedRules dla karty BEZ przyznanego activeTab
// jest odrzucane przez Chrome, a popup:get nadal działa (licznik z plakietki) – na zwykłej stronie i YouTube.
// Przyznania activeTab (kliknięcie ikony na pasku) nie da się wywołać z Playwright – ścieżkę z dostępem
// sprawdzają testy jednostkowe (active-tab.test.mjs).

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

const PAGE = '<!doctype html><title>Strona</title><p>treść</p><script src="https://ads.doubleclick.net/ad.js"></script>';
const YT = '<!doctype html><title>YouTube</title><ytd-watch-flexy><div id="secondary"><div id="related">proponowane</div></div></ytd-watch-flexy>';

test('Chromium: bez activeTab getMatchedRules odmawia, popup:get działa przez fallback (zwykła strona i YouTube)', { skip, timeout: 180_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-activetab-'));
  const ext = path.join(tmp, 'ext');
  fs.mkdirSync(ext);
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  const ctx = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true, channel: 'chromium',
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'],
  });
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

    // manifest załadowany przez Chrome: activeTab, bez declarativeNetRequestFeedback
    const perms = await ext.evaluate(() => chrome.runtime.getManifest().permissions);
    assert.ok(perms.includes('activeTab'));
    assert.ok(!perms.includes('declarativeNetRequestFeedback'));

    for (const [url, host] of [['https://www.example.com/', 'www.example.com'], ['https://www.youtube.com/watch?v=activeTab1', 'www.youtube.com']]) {
      const page = await ctx.newPage();
      await page.goto(url);
      const tabId = await ext.evaluate(async (u) => (await chrome.tabs.query({ url: u + '*' }))[0].id, url);
      // bez przyznanego activeTab Chrome odmawia dostępu do dopasowań tej karty
      const direct = await ext.evaluate((t) => chrome.declarativeNetRequest.getMatchedRules({ tabId: t }).then(() => 'ok', (e) => String(e.message || e)), tabId);
      assert.match(direct, /activeTab|declarativeNetRequestFeedback|permission/i, `${host}: ${direct}`);
      // popup:get nie zgłasza błędu i zwraca liczbę z plakietki
      const r = await ext.evaluate((t) => chrome.runtime.sendMessage({ type: 'popup:get', tabId: t }), tabId);
      assert.equal(r.host, host);
      assert.equal(typeof r.blocked, 'number', `${host}: licznik z fallbacku`);
      assert.ok(r.blocked >= 0);
      assert.equal(r.canRun, true);
      assert.deepEqual(r.problems, [], `${host}: bez problemów zdrowia`);
      if (host === 'www.youtube.com') {
        assert.ok(r.youtube, 'wiersz YouTube Protection');
      } else {
        assert.equal(r.youtube, null);
      }
      assert.ok(!('youtubeFocus' in r), `${host}: bez Focus Mode`);
      await page.close();
    }

    // sam popup renderuje się bez błędów
    const popup = await ctx.newPage();
    await popup.goto(`chrome-extension://${id}/popup/popup.html`);
    await popup.waitForFunction(() => document.getElementById('blocked') && document.getElementById('blocked').textContent.trim() !== '', null, { timeout: 15000 });
    assert.deepEqual(errors, []);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
