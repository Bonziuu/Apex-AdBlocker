// Onboarding w prawdziwym Chromium z ChromeBlock (bez sieci). Brak Playwright/Chromium → SKIP.
// Świeża instalacja → strona powitalna sama się otwiera; ochrona działa od razu (stały zestaw list,
// bez wyboru trybu); „Zacznij korzystać” zamyka kartę; przeładowanie rozszerzenia (onInstalled:
// update) jej nie otwiera i migruje zapisane tryby/listy starszej wersji; „Otwórz ustawienia” nic nie zmienia.

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
const CORE = ['ads', 'privacy', 'security'];
const enabledOf = (o) => o.lists.filter((l) => l.enabled).map((l) => l.id).sort();

test('onboarding w Chromium: instalacja → ochrona od razu → zamknięcie; przeładowanie: bez strony + migracja starych trybów; ustawienia', { skip, timeout: 240_000 }, async () => {
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
    const welcome = ctx.pages().find(isWelcome) || await ctx.waitForEvent('page', { predicate: isWelcome, timeout: 20000 });
    let [sw] = ctx.serviceWorkers();
    if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 30000 });
    const id = new URL(sw.url()).host;
    await welcome.waitForSelector('#start');
    assert.equal(ctx.pages().filter(isWelcome).length, 1);

    // 2. ochrona od razu: opis blokowania, brak wyboru trybu; stały zestaw list
    assert.equal(await welcome.locator('.features li').count(), 3);
    assert.equal(await welcome.locator('#modes, input[name="mode"], [data-mode]').count(), 0, 'bez wyboru trybu');
    const opt = await ctx.newPage();
    await opt.goto(`chrome-extension://${id}/options/options.html`);
    const call = (m) => opt.evaluate((x) => chrome.runtime.sendMessage(x), m);
    for (let i = 0; i < 60 && !(await call({ type: 'health:get' })).startupProfile?.totalMs; i++) await new Promise((r) => setTimeout(r, 250));
    assert.deepEqual(enabledOf(await call({ type: 'options:get' })), CORE);

    // „Zacznij korzystać” → karta się zamyka
    await welcome.bringToFront();
    const closed = welcome.waitForEvent('close', { timeout: 15000 });
    await welcome.click('#start');
    await closed;

    // 3. stan starszej wersji (tryb Strict z cookies/annoyances) + przeładowanie (reason = update)
    await opt.evaluate(() => chrome.storage.local.set({
      enabledLists: ['ads', 'privacy', 'security', 'cookies', 'annoyances'], protectionMode: 'strict', youtubeFocus: { enabled: true },
      disabledSites: ['bank.example'], userFilters: '||stare.example^\n',
    }));
    const ce = await ctx.newPage();
    await ce.goto('chrome://extensions');
    await ce.evaluate(async (extId) => {
      await chrome.developerPrivate.updateProfileConfiguration({ inDeveloperMode: true });
      await chrome.developerPrivate.reload(extId, { failQuietly: true });
    }, id);
    let reason = '';
    let stored = null;
    let lists = null;
    for (let i = 0; i < 40 && !(/update/.test(reason) && stored && !('enabledLists' in stored)); i++) {
      await new Promise((r) => setTimeout(r, 500));
      const p = await ctx.newPage();
      try {
        await p.goto(`chrome-extension://${id}/options/options.html`);
        const prof = await p.evaluate(() => chrome.runtime.sendMessage({ type: 'startup:profile' })).catch(() => null);
        reason = (prof && prof.profile && prof.profile.reason) || '';
        stored = await p.evaluate(() => chrome.storage.local.get(null));
        lists = enabledOf(await p.evaluate(() => chrome.runtime.sendMessage({ type: 'options:get' })));
      } catch { /* rozszerzenie jeszcze się przeładowuje */ } finally { await p.close().catch(() => {}); }
    }
    assert.match(reason, /onInstalled: update/, 'przeładowanie wywołało onInstalled(update)');
    for (const k of ['enabledLists', 'protectionMode', 'youtubeFocus']) assert.ok(!(k in stored), `migracja: usunięty ${k}`);
    assert.deepEqual(stored.disabledSites, ['bank.example'], 'wyłączone strony zachowane');
    assert.equal(stored.userFilters, '||stare.example^\n', 'własne filtry zachowane');
    assert.deepEqual(lists, CORE, 'po migracji stały zestaw');
    await new Promise((r) => setTimeout(r, 1500));
    assert.equal(ctx.pages().filter(isWelcome).length, 0, 'po przeładowaniu bez strony powitalnej');
    await ce.close();

    // 4. „Otwórz ustawienia” → Opcje, bez zmiany ustawień
    const page = await ctx.newPage();
    await page.goto(`chrome-extension://${id}/welcome/welcome.html`);
    await page.waitForSelector('#openOptions');
    const snap = () => page.evaluate(() => chrome.storage.local.get(null).then((s) => JSON.stringify({ d: s.disabledSites, u: s.userFilters, l: s.enabledLists, m: s.protectionMode })));
    const before = await snap();
    const [options] = await Promise.all([ctx.waitForEvent('page', { predicate: (p) => /options\/options\.html/.test(p.url()), timeout: 15000 }), page.click('#openOptions')]);
    assert.match(options.url(), /options\/options\.html/);
    assert.equal(await snap(), before, 'otwarcie ustawień nic nie zmienia');
    assert.deepEqual(errors, []);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
