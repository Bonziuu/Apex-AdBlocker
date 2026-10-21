// ChromeBlock – testy E2E YouTube (Playwright, Chromium z załadowanym rozszerzeniem).
//
// Uruchomienie (wymaga dostępu do internetu i okna przeglądarki):
//   npm install
//   npx playwright install chromium
//   npm run test:e2e
//
// Zasady:
//  - bez logowania do YouTube,
//  - bez obchodzenia CAPTCHA i zabezpieczeń Google: jeśli YouTube pokaże stronę
//    zgody (consent.youtube.com) albo weryfikację (/sorry/), przypadek jest
//    POMIJANY z czytelnym komunikatem,
//  - test sprawdza stan silników ChromeBlock i lokalną diagnostykę odtwarzacza,
//    nie „gwarantuje” braku reklam (te zależą od konta, regionu i A/B testów).

import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { ROOT } from '../../tools/lists-config.mjs';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  chromium = null;
}

const CASES = [
  { name: 'youtube.com – strona główna', url: 'https://www.youtube.com/', player: false },
  { name: '/watch', url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', player: true },
  { name: 'playlista', url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw&list=PLbpi6ZahtOH6Ar_3GPy3workcbsbgMCjB', player: true },
  { name: 'Shorts', url: 'https://www.youtube.com/shorts/', player: false },
  { name: 'embed', url: 'https://www.youtube.com/embed/jNQXAC9IVRw', player: false },
  { name: 'music.youtube.com', url: 'https://music.youtube.com/', player: false },
];

const skipAll = chromium ? false : 'Playwright nie jest zainstalowany (npm install && npx playwright install chromium)';

async function launch() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-e2e-'));
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: process.env.E2E_HEADLESS === '1',
    args: [`--disable-extensions-except=${ROOT}`, `--load-extension=${ROOT}`],
  });
  let [sw] = context.serviceWorkers();
  if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 15000 });
  const extensionId = new URL(sw.url()).host;
  return { context, extensionId };
}

/** Pyta service worker o stan zdrowia przez stronę opcji rozszerzenia. */
async function health(context, extensionId) {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options/options.html`);
  const h = await page.evaluate(() => chrome.runtime.sendMessage({ type: 'health:get' }));
  await page.close();
  return h;
}

test('ChromeBlock E2E – YouTube', { skip: skipAll, timeout: 300000 }, async (t) => {
  const { context, extensionId } = await launch();
  try {
    // daj czas na instalację i rejestrację scriptletów
    await new Promise((r) => setTimeout(r, 3000));
    const h0 = await health(context, extensionId);
    assert.equal(h0.sync.rulesets.status, 'ok', 'syncRulesets');
    assert.equal(h0.sync.scriptlets.status, 'ok', 'syncScriptlets');
    assert.notEqual(h0.components.youtube.status, 'error', h0.components.youtube.detail);

    for (const c of CASES) {
      await t.test(c.name, async (st) => {
        const page = await context.newPage();
        const pageErrors = [];
        page.on('pageerror', (e) => pageErrors.push(String(e)));
        await page.goto(c.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        const url = page.url();
        if (/consent\.youtube\.com|consent\.google/.test(url)) { st.skip('YouTube wymaga zgody na cookies – test nie klika za użytkownika'); await page.close(); return; }
        if (/\/sorry\//.test(url)) { st.skip('Google wymaga weryfikacji (CAPTCHA) – pomijam, bez obchodzenia'); await page.close(); return; }
        await page.waitForTimeout(c.player ? 15000 : 5000);
        if (c.player) {
          const state = await page.evaluate(() => {
            const p = document.getElementById('movie_player');
            const v = p && p.querySelector('video');
            return { player: !!p, video: !!v, error: !!document.querySelector('.ytp-error'), adShowing: !!(p && p.classList.contains('ad-showing')) };
          });
          assert.ok(state.player, 'movie_player istnieje');
          assert.ok(!state.error, 'odtwarzacz nie pokazuje błędu');
          if (state.adShowing) st.diagnostic('UWAGA: odtwarzacz w trybie reklamy (ad-showing)');
          const h = await health(context, extensionId);
          if (h.youtube && h.youtube.player) {
            st.diagnostic(`diagnostyka odtwarzacza: ${h.youtube.player.status} ${(h.youtube.player.reasons || []).join(', ')}`);
            assert.notEqual(h.youtube.player.status, 'error');
          }
        }
        const fromExtension = pageErrors.filter((e) => /chromeblock|scriptlet/i.test(e));
        assert.deepEqual(fromExtension, [], 'brak błędów pochodzących z rozszerzenia');
        await page.close();
      });
    }
  } finally {
    await context.close();
  }
});
