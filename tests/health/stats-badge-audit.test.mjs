// Audyt źródeł statystyk w prawdziwym Chromium z ChromeBlock (strona-atrapa, bez sieci).
//
// 1. Licznik akcji DNR (badge, displayActionCountAsBadgeText) liczy KAŻDĄ akcję: block, redirect
//    (zneutralizowany zasób) i redirect:transform (usuwanie parametrów) – dlatego NIE jest źródłem
//    dokładnych statystyk blokad.
// 2. Statystyki ChromeBlock (getMatchedRules + data/*.block.json) liczą tylko akcje „block”.
// Brak Playwright/Chromium → SKIP.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, EXTENSION_ENTRIES, ROOT, syncFinished } from '../../tools/chromium-smoke.mjs';

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

// reguły z listy „Reklamy”: block (1261, 1262), redirect na noop.js (3653), removeparam (5700)
const PAGE = `<title>audyt</title>
<script src="https://daleelerah.info/a.js"></script>
<script src="https://get-me-wow.example/b.js"></script>
<script src="https://go.oclasrv.com/apu.php?zoneid=2"></script>
<script>fetch('https://cxm-api.fifa.com/fifaplusweb/api/video/y?adConfig=1').catch(() => {})</script>`;

test('badge liczy wszystkie akcje DNR (nie tylko blokady); statystyki liczą tylko „block”', { skip, timeout: 240_000 }, async () => {
  const typeOf = {};
  for (const f of fs.readdirSync(path.join(ROOT, 'rules'))) {
    for (const r of JSON.parse(fs.readFileSync(path.join(ROOT, 'rules', f), 'utf8'))) {
      typeOf[`${f.replace('.json', '')}:${r.id}`] = r.action.type === 'redirect' ? `redirect:${'transform' in r.action.redirect ? 'transform' : 'extensionPath'}` : r.action.type;
    }
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-badge-'));
  const ext = path.join(tmp, 'ext');
  fs.mkdirSync(ext);
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  const ctx = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true, channel: 'chromium',
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'],
  });
  try {
    await ctx.route(/^https?:/, (r) => (new URL(r.request().url()).hostname === 'mixed.audit'
      ? r.fulfill({ contentType: 'text/html', body: PAGE })
      : r.fulfill({ status: 200, contentType: 'text/plain', body: '' })));
    let [sw] = ctx.serviceWorkers();
    if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 30000 });
    const id = new URL(sw.url()).host;
    const opt = await ctx.newPage();
    await opt.goto(`chrome-extension://${id}/options/options.html`);
    for (let i = 0; i < 120; i++) {
      if (syncFinished(await opt.evaluate(() => chrome.runtime.sendMessage({ type: 'health:get' })))) break;
      await opt.waitForTimeout(1500);
    }
    const page = await ctx.newPage();
    await page.goto('https://mixed.audit/');
    await page.waitForTimeout(2000);
    const r = await opt.evaluate(async () => {
      const t = (await chrome.tabs.query({})).find((x) => (x.url || '').includes('mixed.audit'));
      const m = await chrome.declarativeNetRequest.getMatchedRules({ tabId: t.id });
      const badge = await chrome.action.getBadgeText({ tabId: t.id });
      const popup = await chrome.runtime.sendMessage({ type: 'popup:get', tabId: t.id });
      return { badge, matches: m.rulesMatchedInfo.map((x) => `${x.rule.rulesetId}:${x.rule.ruleId}`), popup };
    });
    const types = r.matches.map((k) => typeOf[k] || k);
    const blocks = types.filter((t) => t === 'block').length;
    assert.deepEqual([...types].sort(), ['block', 'block', 'redirect:extensionPath', 'redirect:transform'], `dopasowania: ${types.join(', ')}`);
    assert.equal(Number(r.badge), types.length, 'badge = liczba WSZYSTKICH akcji DNR');
    assert.notEqual(Number(r.badge), blocks, 'badge ≠ liczba blokad → nie nadaje się na dokładne statystyki');
    assert.equal(r.popup.stats.available, true);
    assert.equal(r.popup.stats.source, 'getMatchedRules');
    assert.equal(r.popup.stats.exact, false);
    assert.equal(r.popup.totalBlocked, blocks, 'statystyki: tylko faktyczne blokady');
    assert.equal(r.popup.siteBlocked, blocks);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
