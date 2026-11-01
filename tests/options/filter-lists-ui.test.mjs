// Opcje → Ochrona: wbudowane listy filtrów. Polskie Filtry są osobną pozycją (od wydzielenia listy `pl`),
// bez przełącznika i bez oznaczeń „premium”; teksty PL/EN z _locales.
// 1) offline: komunikaty i18n, 2) w Chromium (PL i EN): karty list. Brak Playwright/Chromium → SKIP.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, EXTENSION_ENTRIES, ROOT } from '../../tools/chromium-smoke.mjs';

const messages = (lang) => JSON.parse(fs.readFileSync(path.join(ROOT, '_locales', lang, 'messages.json'), 'utf8'));
const EXPECTED = {
  pl: [
    ['Reklamy', 'EasyList i uBlock filters'],
    ['Śledzenie i prywatność', 'EasyPrivacy i uBlock filters – Privacy'],
    ['Złośliwe strony', 'uBlock filters – Badware risks (oszustwa, malware)'],
    ['Polskie Filtry', 'Oficjalne Polskie Filtry (Certyficate IT) – reklamy na polskich stronach'],
  ],
  en: [
    ['Ads', 'EasyList and uBlock filters'],
    ['Tracking and privacy', 'EasyPrivacy and uBlock filters – Privacy'],
    ['Malicious sites', 'uBlock filters – Badware risks (scams, malware)'],
    ['Polish Filters', 'Official Polish Filters (Certyficate IT) – ads on Polish websites'],
  ],
};

test('i18n: osobna pozycja Polskie Filtry / Polish Filters; opis listy Reklamy bez Polskich Filtrów', () => {
  for (const lang of ['pl', 'en']) {
    const m = messages(lang);
    const ids = ['ads', 'privacy', 'security', 'pl'];
    assert.deepEqual(ids.map((id) => [m[`list_${id}_name`].message, m[`list_${id}_desc`].message]), EXPECTED[lang], lang);
    assert.doesNotMatch(m.list_ads_desc.message, /Pol/i, `${lang}: ads bez Polskich Filtrów`);
    assert.match(m.about_lists.message, /CC BY-NC-SA 4\.0/);
    assert.match(m.about_lists.message, /Certyficate IT/);
    for (const id of ids) assert.doesNotMatch(m[`list_${id}_name`].message + m[`list_${id}_desc`].message, /premium|pro\b|plus\b/i);
  }
});

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

for (const lang of ['pl', 'en']) {
  test(`Opcje w Chromium (${lang}): 4 listy, Polskie Filtry osobno, bez przełączników`, { skip, timeout: 120_000 }, async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `apex-lists-ui-${lang}-`));
    const ext = path.join(tmp, 'ext');
    fs.mkdirSync(ext);
    for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
    const ctx = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
      headless: true, channel: 'chromium',
      args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update', `--lang=${lang}`],
      env: { ...process.env, LANGUAGE: lang, LANG: lang === 'pl' ? 'pl_PL.UTF-8' : 'en_US.UTF-8' },
    });
    try {
      await ctx.route(/^https?:/, (r) => r.fulfill({ status: 204, body: '' }));
      let [sw] = ctx.serviceWorkers();
      if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 30000 });
      const id = new URL(sw.url()).host;
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(`chrome-extension://${id}/options/options.html`);
      await page.waitForFunction(() => document.querySelectorAll('#listContainer .card').length === 4, null, { timeout: 30000 });
      const cards = await page.$$eval('#listContainer .card', (els) => els.map((c) => ({
        name: c.querySelector('.name').textContent,
        desc: c.querySelector('.desc').textContent,
        count: c.querySelector('.count').textContent,
        inputs: c.querySelectorAll('input').length,
      })));
      assert.deepEqual(cards.map((c) => [c.name, c.desc]), EXPECTED[lang]);
      for (const c of cards) {
        assert.equal(c.inputs, 0, `${c.name}: bez przełącznika`);
        assert.match(c.count, /\d/, `${c.name}: liczby filtrów`);
      }
      const rulesets = await sw.evaluate(() => chrome.declarativeNetRequest.getEnabledRulesets());
      assert.deepEqual([...rulesets].sort(), ['ads', 'pl', 'privacy', 'security']);
      assert.deepEqual(errors, []);
    } finally {
      await ctx.close();
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
}
