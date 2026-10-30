// HISTORYCZNY tester trybów ochrony (tests/local/protection-modes-sites.mjs): produkt nie ma już trybów.
// Zostają testy czystej logiki; przebieg w Chromium i wrappery usunięte (narzędzie działało do 0e3fe92,
// gałąź legacy/protection-modes-tester).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT, CONFIGS, AUTO, MANUAL_VERDICTS, parseModesArgs, loadSites, classifySite, summarizeConfig, adScore, siteOf,
} from '../../tests/local/protection-modes-sites.mjs';

const base = (o = {}) => ({
  textLength: 5000, mainContent: true, overflowX: false, scrollLocked: false, pageErrors: 0, menuLinks: 10,
  nav: { ok: true }, search: { ok: true }, overlays: { cmp: false, antiAdblock: false, other: false }, antiAdblockText: '',
  ads: { elements: 0, iframes: 0, labels: 0, emptySlots: 0 }, requests: { total: 100, blocked: 0 }, ...o,
});

test('argumenty: domyślnie wszystkie konfiguracje (z kontrolą bez rozszerzenia), filtry, błędy', () => {
  const o = parseModesArgs(['--modes']);
  assert.deepEqual(o.configs, ['none', 'basic', 'balanced', 'strict']);
  assert.equal(o.youtube, true);
  assert.equal(o.screenshots, true);
  const p = parseModesArgs(['--modes', '--configs', 'basic,strict', '--limit', '5', '--only', 'www.Onet.pl,wp.pl', '--no-youtube', '--no-screenshots', '--headless', '--results', 'x']);
  assert.deepEqual([p.configs, p.limit, p.only, p.youtube, p.screenshots, p.headless], [['basic', 'strict'], 5, ['onet.pl', 'wp.pl'], false, false, true]);
  assert.equal(p.resultsDir, path.resolve('x'));
  assert.throws(() => parseModesArgs(['--configs', 'turbo']), /nieznana konfiguracja/);
  assert.deepEqual([...CONFIGS], ['none', 'basic', 'balanced', 'strict']);
});

test('lista stron: ~50 realnych stron, głównie PL, kategorie z zadania, kilka zagranicznych, YouTube osobno', () => {
  const { sites, youtube } = loadSites();
  assert.ok(sites.length >= 50 && sites.length <= 60, `stron: ${sites.length}`);
  assert.equal(new Set(sites.map((s) => s.host)).size, sites.length, 'bez powtórzeń');
  for (const s of sites) assert.match(s.url, /^https:\/\//, s.url);
  assert.ok(!sites.some((s) => /example\.|localhost|127\.0\.0\.1/.test(s.url)), 'tylko realne strony');
  const cats = new Set(sites.map((s) => s.category));
  for (const c of ['portale i news (PL)', 'technologie (PL)', 'video', 'sklepy (PL)', 'fora i społeczności', 'rozrywka, ciężkie reklamy (PL)', 'zagraniczne']) assert.ok(cats.has(c), c);
  const pl = sites.filter((s) => /\.pl$|\.com\.pl$|^(?:www\.)?(?:wykop|jbzd|kwejk|empik|onet)/.test(s.host)).length;
  assert.ok(pl >= sites.length * 0.7, `polskich: ${pl}`);
  assert.ok(sites.filter((s) => s.category === 'zagraniczne').length >= 5);
  assert.ok(!sites.some((s) => /youtube\.com/.test(s.host)), 'YouTube ma osobny test');
  assert.match(youtube.watch, /^https:\/\/www\.youtube\.com\/watch\?v=/);
  assert.equal(loadSites(undefined, { limit: 3 }).sites.length, 3);
  assert.deepEqual(loadSites(undefined, { only: ['onet.pl', 'wp.pl'] }).sites.map((s) => s.host), ['www.onet.pl', 'www.wp.pl']);
  assert.equal(siteOf('cdn.example.com.pl'), 'example.com.pl');
  assert.equal(siteOf('a.b.onet.pl'), 'onet.pl');
});

test('ocena automatyczna: podejrzenie, nie werdykt; priorytet breakage > anti-adblock > reklama', () => {
  const ctrl = base({ ads: { elements: 3, iframes: 2, labels: 1, emptySlots: 0 } });
  // nigdy „PASS” z automatu
  assert.ok(!Object.values(AUTO).includes('PASS'));
  assert.deepEqual([...MANUAL_VERDICTS], ['PASS', 'reklama pozostała', 'breakage', 'anti-adblock', 'wymaga ręcznego sprawdzenia']);
  const ok = classifySite(base(), ctrl);
  assert.equal(ok.auto, AUTO.OK);
  assert.match(ok.reasons.join(), /to nie jest gwarancja/);
  assert.equal(classifySite(base({ ads: { elements: 1, iframes: 0, labels: 1, emptySlots: 1 } }), ctrl).auto, AUTO.AD);
  assert.equal(classifySite(base({ overlays: { cmp: false, antiAdblock: true, other: false } }), ctrl).auto, AUTO.ANTI);
  assert.notEqual(classifySite(base({ antiAdblockText: 'adblock' }), base({ antiAdblockText: 'adblock' })).auto, AUTO.ANTI, 'ten sam komunikat bez rozszerzenia');
  for (const [m, re] of [
    [base({ textLength: 900 }), /treści 900 vs 5000/],
    [base({ mainContent: false }), /główna treść/],
    [base({ nav: { ok: false, error: 'timeout' } }), /link z menu/],
    [base({ search: { ok: false } }), /wyszukiwarka/],
    [base({ menuLinks: 0 }), /menu/],
    [base({ pageErrors: 9 }), /błędy JS/],
    [base({ overflowX: true }), /układ/],
  ]) {
    const v = classifySite(m, ctrl);
    assert.equal(v.auto, AUTO.BREAK, JSON.stringify(m));
    assert.match(v.reasons.join(), re);
  }
  // breakage ma pierwszeństwo przed reklamą i anti-adblock
  assert.equal(classifySite(base({ textLength: 100, ads: { elements: 5, iframes: 0, labels: 0, emptySlots: 0 }, overlays: { antiAdblock: true } }), ctrl).auto, AUTO.BREAK);
  // nie załadowała się: z rozszerzeniem błąd, bez – OK → breakage?; obie nieudane → ręcznie
  assert.equal(classifySite({ error: 'ERR_TIMED_OUT' }, ctrl).auto, AUTO.BREAK);
  assert.equal(classifySite({ error: 'ERR_NAME_NOT_RESOLVED' }, { error: 'ERR_NAME_NOT_RESOLVED' }).auto, AUTO.MANUAL);
  assert.equal(classifySite(base(), null).auto, AUTO.OK, 'bez kontroli – tylko sygnały bezwzględne');
});

test('podsumowanie trybu: zablokowane żądania, sygnały reklam i redukcja względem kontroli', () => {
  const rows = [
    { results: { none: base({ ads: { elements: 4, iframes: 2, labels: 0, emptySlots: 0 } }), basic: base({ requests: { total: 80, blocked: 20 }, ads: { elements: 1, iframes: 0, labels: 0, emptySlots: 0 } }) } },
    { results: { none: base({ ads: { elements: 2, iframes: 0, labels: 2, emptySlots: 0 } }), basic: base({ requests: { total: 50, blocked: 5 } }) } },
    { results: { none: { error: 'x' }, basic: { error: 'x' } } },
  ].map((r) => ({ ...r, verdicts: { basic: classifySite(r.results.basic, r.results.none) } }));
  const s = summarizeConfig(rows, 'basic');
  assert.deepEqual([s.sites, s.loaded, s.blockedRequests, s.requests, s.adSignals, s.sitesWithAds], [3, 2, 25, 130, 1, 1]);
  assert.equal(s.adSignalsReductionPct, 90, '10 → 1 sygnałów');
  assert.deepEqual(s.auto, { ok: 1, ad: 1, breakage: 0, antiAdblock: 0, manual: 1 });
  assert.equal(summarizeConfig(rows, 'none').adSignalsReductionPct, null);
  assert.equal(adScore({ error: 'x' }), 0);
});

test('narzędzie oznaczone jako historyczne: bez uruchomienia, bez wrappera i poza paczką testera', async () => {
  const src = fs.readFileSync(path.join(ROOT, 'tests/local/protection-modes-sites.mjs'), 'utf8');
  assert.match(src.split('\n').slice(0, 5).join('\n'), /HISTORYCZNE NARZĘDZIE/);
  const { main, LEGACY_NOTICE } = await import('../../tests/local/protection-modes-sites.mjs');
  const logs = [];
  const orig = console.log;
  console.log = (m) => logs.push(m);
  try { assert.equal(await main(['--modes']), 2); } finally { console.log = orig; }
  assert.deepEqual(logs, [LEGACY_NOTICE]);
  assert.match(LEGACY_NOTICE, /legacy\/protection-modes-tester/);
  assert.ok(!fs.existsSync(path.join(ROOT, 'test-protection-modes.cmd')));
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'test-apex-adblocker.cmd'), 'utf8'), /--modes|MODES/);
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'tests/local/apex-local-test.mjs'), 'utf8'), /protection-modes-sites/);
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'tools/package-dev.mjs'), 'utf8'), /protection-modes/);
});
