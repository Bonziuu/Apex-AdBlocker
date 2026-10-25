// Kopia ustawień w prawdziwym Chromium z ChromeBlock: eksport do pliku przez UI, import przez UI,
// podsumowanie, Focus Mode na otwartej karcie YouTube bez przeładowania, uszkodzony plik bez zmian.
// Strona-atrapa pod https://www.youtube.com/ (bez sieci). Brak Playwright/Chromium → SKIP.

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

const YT = '<!doctype html><title>YouTube</title><ytd-watch-flexy><div id="secondary"><div id="related">proponowane</div></div></ytd-watch-flexy><script>window.__loadId=Math.random()</script>';

test('UI: eksport → zmiana ustawień → import przywraca; Focus Mode na otwartej karcie; uszkodzony plik bez zmian', { skip, timeout: 240_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-backup-'));
  const ext = path.join(tmp, 'ext');
  fs.mkdirSync(ext);
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  const ctx = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true, channel: 'chromium', acceptDownloads: true,
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'],
  });
  try {
    await ctx.route(/^https?:/, (r) => (new URL(r.request().url()).hostname === 'www.youtube.com'
      ? r.fulfill({ contentType: 'text/html', body: YT }) : r.fulfill({ status: 204, body: '' })));
    let [sw] = ctx.serviceWorkers();
    if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 30000 });
    const id = new URL(sw.url()).host;
    const opt = await ctx.newPage();
    const errors = [];
    opt.on('pageerror', (e) => errors.push(String(e)));
    await opt.goto(`chrome-extension://${id}/options/options.html#backup`);
    const call = (msg) => opt.evaluate((m) => chrome.runtime.sendMessage(m), msg);
    await opt.waitForFunction(() => document.querySelectorAll('#listContainer input').length > 0, null, { timeout: 30000 });

    // stan do zapisania: Balanced, 1 wyłączona strona, własny filtr, Focus Mode ON
    await call({ type: 'options:setProtectionMode', mode: 'balanced' });
    await call({ type: 'options:setDisabledSites', sites: ['bank.example'] });
    await call({ type: 'options:setUserFilters', text: '||ads.example^\n' });
    await call({ type: 'options:setYouTubeFocus', settings: { enabled: true } });
    await opt.reload();
    await opt.waitForSelector('#exportSettings');

    // eksport przez UI → plik
    const [download] = await Promise.all([opt.waitForEvent('download'), opt.click('#exportSettings')]);
    assert.match(download.suggestedFilename(), /^chromeblock-ustawienia-\d{4}-\d{2}-\d{2}\.json$/);
    const file = path.join(tmp, 'kopia.json');
    await download.saveAs(file);
    const backup = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(backup.format, 'chromeblock-settings');
    assert.equal(backup.settings.protectionMode, 'balanced');
    assert.deepEqual(backup.settings.disabledSites, ['bank.example']);
    assert.equal(backup.settings.youtubeFocus.enabled, true);

    // zmiana wszystkiego na inne wartości
    await call({ type: 'options:setProtectionMode', mode: 'basic' });
    await call({ type: 'options:setDisabledSites', sites: [] });
    await call({ type: 'options:setUserFilters', text: '' });
    await call({ type: 'options:setYouTubeFocus', settings: { enabled: false } });

    // otwarta karta YouTube – Focus Mode OFF
    const yt = await ctx.newPage();
    await yt.goto('https://www.youtube.com/watch?v=backupTest1');
    const loadId = await yt.evaluate(() => window.__loadId);
    await yt.waitForTimeout(800);
    assert.equal(await yt.evaluate(() => getComputedStyle(document.querySelector('#related')).display), 'block');

    // uszkodzony plik → błąd, bez zmian
    const broken = path.join(tmp, 'zly.json');
    fs.writeFileSync(broken, '{"format": "chromeblock-settings", "version": 1, "settings": ');
    await opt.bringToFront();
    await opt.setInputFiles('#importFile', broken);
    await opt.waitForSelector('#importErrors:not([hidden])');
    assert.match(await opt.textContent('#importErrors'), /niepoprawny.*JSON/s);
    assert.equal((await call({ type: 'options:get' })).protectionMode, 'basic', 'bez zmian po złym pliku');

    // import kopii przez UI → przywrócone + podsumowanie
    await opt.setInputFiles('#importFile', file);
    await opt.waitForSelector('#importSummary:not([hidden])', { timeout: 60000 });
    const summary = await opt.textContent('#importSummary');
    assert.match(summary, /Tryb ochrony: Balanced/);
    assert.match(summary, /Wyłączone strony: 1/);
    assert.match(summary, /Focus Mode: włączony/);
    assert.equal(await opt.isHidden('#importErrors'), true);
    const o = await call({ type: 'options:get' });
    assert.equal(o.protectionMode, 'balanced');
    assert.deepEqual(o.disabledSites, ['bank.example']);
    assert.equal(o.userFilters, '||ads.example^\n');
    assert.equal(o.youtubeFocus.enabled, true);
    assert.equal(await opt.isChecked('#focusEnabled'), true, 'UI opcji odświeżone po imporcie');

    // Focus Mode na otwartej karcie – bez przeładowania
    await yt.waitForFunction(() => getComputedStyle(document.querySelector('#related')).display === 'none', null, { timeout: 10000 });
    assert.equal(await yt.evaluate(() => window.__loadId), loadId);
    assert.deepEqual(errors, []);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('UI: niepełny rollback nie twierdzi, że przywrócono ustawienia; pokazuje ostrzeżenie i prowadzi do Diagnostyki', { skip, timeout: 120_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-backup-ui-'));
  const ext = path.join(tmp, 'ext');
  fs.mkdirSync(ext);
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  const ctx = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true, channel: 'chromium',
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'],
  });
  try {
    let [sw] = ctx.serviceWorkers();
    if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 30000 });
    const id = new URL(sw.url()).host;
    const opt = await ctx.newPage();
    const errors = [];
    opt.on('pageerror', (e) => errors.push(String(e)));
    // odpowiedź tła dla importu podstawiona (pozostałe wiadomości – prawdziwe)
    await opt.addInitScript(() => {
      const real = chrome.runtime.sendMessage.bind(chrome.runtime);
      chrome.runtime.sendMessage = async (m) => (m && m.type === 'settings:import' ? window.__importResult : real(m));
    });
    await opt.goto(`chrome-extension://${id}/options/options.html#backup`);
    await opt.waitForSelector('#importSettings');
    const file = path.join(tmp, 'kopia.json');
    fs.writeFileSync(file, '{}');

    await opt.evaluate(() => { window.__importResult = { ok: false, rolledBack: false, errors: ['scriptlety: Invalid match pattern'], rollbackErrors: ['synchronizacja (listy filtrów): Internal error'] }; });
    await opt.setInputFiles('#importFile', file);
    await opt.waitForSelector('#importErrors:not([hidden])');
    const text = await opt.textContent('#importErrors');
    assert.match(text, /Import nie powiódł się i nie udało się w pełni przywrócić poprzedniego stanu\. Otwórz Diagnostykę\./);
    assert.doesNotMatch(text, /przywrócono poprzednie ustawienia/i);
    assert.match(text, /przywracanie: synchronizacja \(listy filtrów\)/);
    assert.equal(await opt.isHidden('#importSummary'), true);
    await opt.click('#openDiag');
    assert.equal(await opt.getAttribute('.tab[data-tab="diag"]', 'aria-selected'), 'true', 'przycisk otwiera Diagnostykę');

    // pełny rollback – dopiero wtedy komunikat „przywrócono”
    await opt.click('.tab[data-tab="backup"]');
    await opt.evaluate(() => { window.__importResult = { ok: false, rolledBack: true, errors: ['listy filtrów: Internal error'] }; });
    // jak użytkownik: przycisk „Importuj ustawienia” → okno wyboru pliku (ten sam plik ponownie)
    const [chooser] = await Promise.all([opt.waitForEvent('filechooser'), opt.click('#importSettings')]);
    await chooser.setFiles(file);
    await opt.waitForFunction(() => /przywrócono poprzednie ustawienia/.test(document.getElementById('importErrors').textContent));
    assert.equal(await opt.locator('#openDiag').count(), 0);
    assert.deepEqual(errors, []);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
