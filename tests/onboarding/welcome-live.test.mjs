// Onboarding w prawdziwym Chromium z ChromeBlock (bez sieci). Brak Playwright/Chromium → SKIP.
// Świeża instalacja → strona powitalna sama się otwiera; Basic domyślnie; wybór trybu przez istniejące
// presety; potwierdzenie i zamknięcie karty; przeładowanie rozszerzenia jej nie otwiera; „Otwórz ustawienia”
// nic nie zmienia; błąd → bez „Gotowe”, karta zostaje.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, EXTENSION_ENTRIES, ROOT } from '../../tools/chromium-smoke.mjs';
import { PROTECTION_MODES } from '../../shared/protection-modes.js';

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;
const sorted = (a) => [...a].sort();

test('onboarding w Chromium: instalacja → wybór Strict → potwierdzenie i zamknięcie; reload bez strony; ustawienia; błąd', { skip, timeout: 240_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-welcome-'));
  const ext = path.join(tmp, 'ext');
  fs.mkdirSync(ext);
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  const ctx = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true, channel: 'chromium',
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'],
  });
  const errors = [];
  ctx.on('weberror', (e) => errors.push(String(e.error())));
  const isWelcome = (p) => /\/welcome\/welcome\.html$/.test(p.url());
  try {
    // 1. świeża instalacja → karta powitalna (dokładnie jedna)
    let welcome = ctx.pages().find(isWelcome) || await ctx.waitForEvent('page', { predicate: isWelcome, timeout: 20000 });
    await welcome.waitForSelector('#modes input');
    assert.equal(ctx.pages().filter(isWelcome).length, 1);
    const id = new URL(welcome.url()).host;
    assert.match(await welcome.textContent('h1'), /ChromeBlock/);
    assert.match(await welcome.textContent('.lead'), /lokalnie/);
    assert.deepEqual(await welcome.$$eval('#modes .name', (n) => n.map((x) => x.textContent)), ['Basic', 'Balanced', 'Strict']);
    assert.equal(await welcome.$eval('#modes input:checked', (i) => i.value), 'basic', 'Basic domyślnie');
    assert.match(await welcome.textContent('body'), /później zmienić/);

    // 2. Strict → „Zacznij korzystać” → potwierdzenie → karta zamknięta → listy z presetu
    await welcome.check('#modes input[value="strict"]');
    const closed = welcome.waitForEvent('close', { timeout: 60000 });
    await welcome.click('#start');
    await welcome.waitForSelector('#status.ok', { timeout: 60000 });
    assert.match(await welcome.textContent('#status'), /Gotowe – włączono tryb Strict/);
    await closed;
    const opt = await ctx.newPage();
    await opt.goto(`chrome-extension://${id}/options/options.html`);
    const lists = await opt.evaluate(() => chrome.storage.local.get('enabledLists').then((x) => x.enabledLists));
    assert.deepEqual(sorted(lists), sorted(PROTECTION_MODES.strict));
    assert.equal((await opt.evaluate(() => chrome.runtime.sendMessage({ type: 'options:get' }))).protectionMode, 'strict');

    // 3. przeładowanie rozszerzenia (jak „↻” w chrome://extensions; reason = update) → strona powitalna się NIE otwiera
    const ce = await ctx.newPage();
    await ce.goto('chrome://extensions');
    await ce.evaluate(async (extId) => {
      await chrome.developerPrivate.updateProfileConfiguration({ inDeveloperMode: true });
      await chrome.developerPrivate.reload(extId, { failQuietly: true });
    }, id);
    let reason = '';
    for (let i = 0; i < 40 && !/update/.test(reason); i++) {
      await new Promise((r) => setTimeout(r, 500));
      const p = await ctx.newPage();
      try {
        await p.goto(`chrome-extension://${id}/options/options.html`);
        const prof = await p.evaluate(() => chrome.runtime.sendMessage({ type: 'startup:profile' })).catch(() => null);
        reason = (prof && prof.profile && prof.profile.reason) || '';
      } catch { /* rozszerzenie jeszcze się przeładowuje */ } finally { await p.close().catch(() => {}); }
    }
    assert.match(reason, /onInstalled: update/, 'przeładowanie wywołało onInstalled(update)');
    await new Promise((r) => setTimeout(r, 2000));
    assert.equal(ctx.pages().filter(isWelcome).length, 0, 'po przeładowaniu bez strony powitalnej');
    await ce.close();

    // 4. „Otwórz ustawienia” → Opcje, bez zmiany ustawień
    const page = await ctx.newPage();
    await page.goto(`chrome-extension://${id}/welcome/welcome.html`);
    await page.waitForSelector('#modes input');
    const before = await page.evaluate(() => chrome.storage.local.get(null).then((s) => JSON.stringify({ l: s.enabledLists, m: s.protectionMode, d: s.disabledSites, u: s.userFilters, f: s.youtubeFocus })));
    const [options] = await Promise.all([ctx.waitForEvent('page', { predicate: (p) => /options\/options\.html/.test(p.url()), timeout: 15000 }), page.click('#openOptions')]);
    assert.match(options.url(), /options\/options\.html/);
    const after = await page.evaluate(() => chrome.storage.local.get(null).then((s) => JSON.stringify({ l: s.enabledLists, m: s.protectionMode, d: s.disabledSites, u: s.userFilters, f: s.youtubeFocus })));
    assert.equal(after, before, 'otwarcie ustawień nic nie zmienia');
    await page.close();

    // 5. błąd zastosowania trybu → bez „Gotowe”, karta zostaje, przycisk znów aktywny
    const failing = await ctx.newPage();
    await failing.addInitScript(() => {
      const real = chrome.runtime.sendMessage.bind(chrome.runtime);
      chrome.runtime.sendMessage = async (m) => (m && m.type === 'options:setProtectionMode'
        ? { ok: false, error: 'Chrome nie pozwolił zmienić list: Internal error', protectionMode: 'strict' } : real(m));
    });
    await failing.goto(`chrome-extension://${id}/welcome/welcome.html`);
    await failing.waitForSelector('#modes input');
    await failing.check('#modes input[value="balanced"]');
    await failing.click('#start');
    await failing.waitForSelector('#status.err');
    const msg = await failing.textContent('#status');
    assert.match(msg, /Nie udało się zastosować trybu Balanced/);
    assert.doesNotMatch(msg, /Gotowe/);
    await failing.waitForTimeout(2500);
    assert.equal(failing.isClosed(), false, 'karta zostaje otwarta');
    assert.equal(await failing.isEnabled('#start'), true, 'można spróbować ponownie');
    assert.deepEqual(errors, []);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
