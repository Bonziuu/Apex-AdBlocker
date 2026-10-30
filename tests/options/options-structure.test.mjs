// Uproszczone Opcje: 4 główne zakładki (Ochrona, Moje filtry, Wyłączone strony, Więcej),
// w „Więcej” zwijane sekcje Kopia ustawień / Diagnostyka / O wtyczce, dane deweloperskie domyślnie zwinięte,
// stare deep linki (#diag z popupu, #backup, #about) działają, diagnostyka ładowana leniwie.
// 1) offline: struktura HTML (regex, bez jsdom) i routing (czysta funkcja),
// 2) w prawdziwym Chromium: deep linki i brak health:get przy zwykłym otwarciu. Brak Playwright/Chromium → SKIP.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, EXTENSION_ENTRIES, ROOT } from '../../tools/chromium-smoke.mjs';
import { resolveRoute, TABS, MORE_SECTIONS } from '../../options/routing.js';

const HTML = fs.readFileSync(path.join(ROOT, 'options/options.html'), 'utf8');
const JS = fs.readFileSync(path.join(ROOT, 'options/options.js'), 'utf8');

test('nawigacja: 4 zakładki w tej kolejności, każda ma swój panel', () => {
  const tabs = [...HTML.matchAll(/<button class="tab" data-tab="([^"]+)"[^>]*>([^<]+)</g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(tabs, [['protection', 'Ochrona'], ['filters', 'Moje filtry'], ['sites', 'Wyłączone strony'], ['more', 'Więcej']]);
  assert.deepEqual([...TABS], tabs.map(([id]) => id));
  for (const [id] of tabs) assert.match(HTML, new RegExp(`<section id="${id}" class="panel"`), id);
  assert.equal((HTML.match(/class="panel"/g) || []).length, 4);
});

test('Więcej: sekcje backup / diag / about jako <details>, domyślnie zwinięte; dane deweloperskie zwinięte', () => {
  const more = HTML.slice(HTML.indexOf('<section id="more"'), HTML.indexOf('</section>', HTML.indexOf('<section id="more"')));
  const sections = [...more.matchAll(/<details id="([^"]+)" class="more-section"( open)?>\s*<summary><h2>([^<]+)<\/h2>/g)].map((m) => [m[1], m[3], !!m[2]]);
  assert.deepEqual(sections, [['backup', 'Kopia ustawień', false], ['diag', 'Diagnostyka', false], ['about', 'O wtyczce', false]]);
  assert.deepEqual([...MORE_SECTIONS], sections.map(([id]) => id));
  // główna diagnostyka
  const diag = more.slice(more.indexOf('<details id="diag"'), more.indexOf('<details id="about"'));
  const dev = diag.slice(diag.indexOf('<details id="devDiag"'));
  const mainDiag = diag.slice(0, diag.indexOf('<details id="devDiag"'));
  for (const id of ['components', 'sync', 'youtubeDiag', 'errors', 'refreshDiag', 'resync', 'copyReport', 'clearErrors']) assert.match(mainDiag, new RegExp(`id="${id}"`), id);
  // dane deweloperskie – osobny, zamknięty blok
  assert.match(dev, /^<details id="devDiag" class="dev">\s*<summary>Dane deweloperskie<\/summary>/);
  for (const id of ['scriptletCompat', 'startupProfile', 'devPerf', 'resetPerf', 'perf', 'scriptletPerf']) {
    assert.match(dev, new RegExp(`id="${id}"`), id);
    assert.doesNotMatch(mainDiag, new RegExp(`id="${id}"`), `${id} nie w głównej diagnostyce`);
  }
  // funkcje backupu bez zmian
  const backup = more.slice(more.indexOf('<details id="backup"'), more.indexOf('<details id="diag"'));
  for (const id of ['exportSettings', 'importSettings', 'importFile', 'importSummary', 'importErrors']) assert.match(backup, new RegExp(`id="${id}"`), id);
});

test('routing: stare deep linki #diag / #backup / #about otwierają sekcję w „Więcej”', () => {
  assert.deepEqual(resolveRoute('#diag'), { tab: 'more', section: 'diag' });
  assert.deepEqual(resolveRoute('#backup'), { tab: 'more', section: 'backup' });
  assert.deepEqual(resolveRoute('#about'), { tab: 'more', section: 'about' });
  for (const t of ['protection', 'filters', 'sites', 'more']) assert.deepEqual(resolveRoute(`#${t}`), { tab: t, section: null });
  assert.deepEqual(resolveRoute(''), { tab: 'protection', section: null });
  assert.deepEqual(resolveRoute('#nieznana'), { tab: 'protection', section: null });
  // popup nadal linkuje do #diag
  assert.match(fs.readFileSync(path.join(ROOT, 'popup/popup.js'), 'utf8'), /options\/options\.html#diag/);
  // Opcje używają routingu, a health:get jest wołane tylko z renderDiag (po rozwinięciu Diagnostyki)
  assert.match(JS, /from '\.\/routing\.js'/);
  assert.equal((JS.match(/type: 'health:get'/g) || []).length, 1);
  assert.match(JS, /\$\('diag'\)\.addEventListener\('toggle', \(\) => \{ if \(\$\('diag'\)\.open\) renderDiag\(\); \}\)/);
});

test('O wtyczce: zwięzłe, z ograniczeniami MV3 i pełnym attribution list (także Polskie Filtry)', () => {
  const about = HTML.slice(HTML.indexOf('<details id="about"'), HTML.indexOf('</details>', HTML.indexOf('<details id="about"')));
  for (const re of [/declarativeNetRequest/, /kosmetycznie/, /obsługiwane warianty scriptletów/, /Manifest V3/, /podzbiór składni filtrów uBO\/ABP/]) assert.match(about, re);
  assert.match(about, /EasyList, EasyPrivacy \(© The EasyList authors, GPLv3 \/ CC BY-SA 3\.0\)/);
  assert.match(about, /uBlock filters \(© Raymond Hill i współtwórcy, GPLv3\)/);
  assert.match(about, /Polskie Filtry Reklamowe \(© MajkiIT, CC BY-NC-SA 4\.0\)/);
  assert.doesNotMatch(HTML, /najszybsz|najmniejsz|najlepsz|fastest|smallest|\bbest\b/i);
  // Ochrona: stały zestaw, bez trybów i przełączników
  assert.doesNotMatch(HTML + JS, /Basic|Balanced|Strict|protectionMode/);
});

// ---------------------------------------------------------------------------------------------
// Chromium

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

test('Opcje w Chromium: health:get tylko po otwarciu Diagnostyki; deep linki #diag/#backup/#about', { skip, timeout: 180_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-options-'));
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
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    // licznik wiadomości health:get wysłanych z Opcji
    await page.addInitScript(() => {
      window.__health = 0;
      if (!globalThis.chrome || !chrome.runtime || !chrome.runtime.sendMessage) return; // about:blank
      const real = chrome.runtime.sendMessage.bind(chrome.runtime);
      chrome.runtime.sendMessage = (m) => { if (m && m.type === 'health:get') window.__health++; return real(m); };
    });
    const open = async (hash) => {
      await page.goto('about:blank'); // pełne wczytanie (sama zmiana # byłaby nawigacją w tym samym dokumencie)
      await page.goto(`chrome-extension://${id}/options/options.html${hash}`);
      await page.waitForFunction(() => document.querySelectorAll('#listContainer .card').length > 0, null, { timeout: 30000 });
      await page.waitForTimeout(300);
      return page.evaluate(() => ({
        tab: document.querySelector('.tab[aria-selected="true"]').dataset.tab,
        panels: [...document.querySelectorAll('.panel')].filter((p) => !p.hidden).map((p) => p.id),
        open: [...document.querySelectorAll('details.more-section')].filter((d) => d.open).map((d) => d.id),
        dev: document.getElementById('devDiag').open,
        health: window.__health,
      }));
    };
    // zwykłe otwarcie: Ochrona, bez health:get
    assert.deepEqual(await open(''), { tab: 'protection', panels: ['protection'], open: [], dev: false, health: 0 });
    // zakładka Więcej: sekcje zwinięte, nadal bez health:get
    await page.click('.tab[data-tab="more"]');
    assert.equal(await page.evaluate(() => window.__health), 0);
    assert.equal(new URL(page.url()).hash, '#more');
    // rozwinięcie Diagnostyki → health:get i dane
    await page.click('#diag > summary');
    await page.waitForFunction(() => document.getElementById('components').textContent.includes('Silnik sieciowy'), null, { timeout: 15000 });
    assert.equal(await page.evaluate(() => window.__health), 1);
    assert.equal(new URL(page.url()).hash, '#diag');
    // deep link z popupu
    const d = await open('#diag');
    assert.deepEqual([d.tab, d.panels, d.open, d.dev], ['more', ['more'], ['diag'], false]);
    await page.waitForFunction(() => window.__health >= 1 && document.getElementById('youtubeDiag').textContent.includes('Status'), null, { timeout: 15000 });
    // #backup i #about
    const b = await open('#backup');
    assert.deepEqual([b.tab, b.open, b.health], ['more', ['backup'], 0]);
    assert.equal(await page.isVisible('#exportSettings'), true);
    const a = await open('#about');
    assert.deepEqual([a.tab, a.open, a.health], ['more', ['about'], 0]);
    assert.match(await page.locator('#about').innerText(), /Polskie Filtry Reklamowe/);
    // stare zakładki
    for (const t of ['protection', 'filters', 'sites']) assert.deepEqual((await open(`#${t}`)).panels, [t]);
    // zmiana # w otwartych Opcjach (hashchange) też przełącza sekcję
    await page.evaluate(() => { location.hash = '#about'; });
    await page.waitForFunction(() => document.getElementById('about').open && !document.getElementById('more').hidden);
    assert.deepEqual(errors, []);
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
