// Tester trybów ochrony na stronach (tests/local/protection-modes-sites.mjs): logika, lista stron,
// raporty, wrappery .cmd oraz pełny przebieg w Chromium na lokalnych stronach-atrapach (bez internetu).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {
  ROOT, CONFIGS, AUTO, MANUAL_VERDICTS, parseModesArgs, loadSites, classifySite, summarizeConfig, adScore, siteOf,
  formatTxt, formatHtml, runModesSites,
} from '../../tests/local/protection-modes-sites.mjs';
import { loadPlaywright } from '../../tools/chromium-smoke.mjs';

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

test('wrappery: test-chromeblock.cmd --modes (osobne ścieżki raportu), test-protection-modes.cmd, wyniki poza repo', () => {
  const cmd = fs.readFileSync(path.join(ROOT, 'test-chromeblock.cmd'), 'utf8');
  assert.equal(cmd.split('\n').length - 1, (cmd.match(/\r\n/g) || []).length, 'CRLF');
  assert.match(cmd, /for %%a in \(%\*\) do if \/i "%%~a"=="--modes" set "MODES=1"/);
  assert.match(cmd, /if "%MODES%"=="1" goto :modesdone/);
  assert.match(cmd, /%RES%\\modes\\latest\.html/);
  assert.match(cmd, /\r\n:end\r\necho\.\r\npause\r\nexit \/b %RC%/);
  const w = fs.readFileSync(path.join(ROOT, 'test-protection-modes.cmd'), 'utf8');
  assert.equal(w.split('\n').length - 1, (w.match(/\r\n/g) || []).length, 'CRLF');
  assert.match(w, /^call "%~dp0test-chromeblock\.cmd" --modes %\*\r$/m);
  assert.doesNotMatch(w, /pause/i, 'jedno pause – w test-chromeblock.cmd');
  const local = fs.readFileSync(path.join(ROOT, 'tests/local/chromeblock-local-test.mjs'), 'utf8');
  assert.match(local, /if \(process\.argv\.includes\('--modes'\)\) \{\n\s+const modes = await import\('\.\/protection-modes-sites\.mjs'\);/);
  assert.match(fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8'), /^tests\/local\/results\/$/m, 'raporty i zrzuty nie są commitowane');
});

// --- pełny przebieg w Chromium na stronach-atrapach -----------------------------------------------

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

const PAGES = {
  '/news': `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Portal testowy</title></head><body>
    <header><nav><a href="/news/kraj">Kraj</a> <a href="/news/swiat">Świat</a> <a href="/news/sport">Sport</a> <a href="/login">Zaloguj</a></nav>
      <form role="search"><input type="search" name="q" placeholder="Szukaj"></form></header>
    <main><article><h1>Artykuł</h1><p>${'Treść artykułu testowego. '.repeat(80)}</p></article>
      <div id="div-gpt-ad-1" style="width:300px;height:250px">slot reklamowy</div>
      <ins class="adsbygoogle" style="display:block;width:300px;height:250px">reklama google</ins>
      <div style="width:300px;height:250px"><span>REKLAMA</span></div></main>
    <footer><a href="/reklama">Reklama</a></footer></body></html>`,
  '/news/kraj': `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Kraj</title></head><body><main><p>${'Wiadomości z kraju. '.repeat(40)}</p></main></body></html>`,
  '/cookies': `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Sklep</title></head><body><main><p>${'Oferta sklepu. '.repeat(80)}</p></main>
    <div id="cmp" style="position:fixed;left:0;right:0;bottom:0;height:45vh;background:#eee;z-index:9">Używamy plików cookie. Wyrażasz zgodę na przetwarzanie danych? <button>Akceptuję</button></div></body></html>`,
  '/antiab': `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Blog</title></head><body><main><p>${'Wpis na blogu. '.repeat(80)}</p></main>
    <div style="position:fixed;inset:0;background:rgba(0,0,0,.8);color:#fff;z-index:99">Wykryliśmy AdBlock. Wyłącz bloker reklam, aby czytać dalej.</div></body></html>`,
};

test('Chromium: kontrola + Basic na stronach-atrapach → raport JSON/TXT/HTML, sygnały reklam, cookies, anti-adblock, menu, wyszukiwarka', { skip, timeout: 300_000 }, async () => {
  const server = http.createServer((req, res) => {
    const body = PAGES[req.url.split('?')[0]];
    res.writeHead(body ? 200 : 404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(body || 'brak');
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-modes-sites-'));
  const sitesFile = path.join(tmp, 'sites.json');
  fs.writeFileSync(sitesFile, JSON.stringify({ categories: { atrapy: [`${origin}/news`, `${origin}/cookies`, `${origin}/antiab`] } }));
  try {
    const logs = [];
    const { report, outDir } = await runModesSites({ ...parseModesArgs(['--configs', 'none,basic', '--headless', '--no-youtube']), sitesFile, resultsDir: tmp, log: (l) => logs.push(l) });
    assert.equal(report.configs.basic.mode, 'basic', 'tryb ustawiony i potwierdzony');
    assert.ok(report.configs.basic.startupMs > 0);
    const [news, cookies, antiab] = report.sites;
    const n0 = news.results.none;
    assert.ok(n0.textLength > 1000 && n0.mainContent);
    assert.ok(n0.ads.elements >= 2, 'slot GPT i ins.adsbygoogle widoczne bez rozszerzenia');
    assert.ok(n0.ads.labels >= 1 && n0.ads.emptySlots >= 1, 'pusta etykieta REKLAMA (stopka pominięta)');
    assert.ok(n0.menuLinks >= 3);
    assert.equal(n0.nav.ok, true, 'link z menu działa');
    assert.match(n0.nav.href, /\/news\/kraj$/, 'link logowania pominięty');
    assert.equal(n0.search.ok, true, 'wyszukiwarka przyjmuje tekst');
    assert.equal(n0.hasLogin, true);
    assert.ok(news.results.basic.ads.elements < n0.ads.elements, 'ChromeBlock ukrywa slot reklamowy');
    assert.equal(news.verdicts.basic.auto, AUTO.AD, 'pozostała widoczna reklama → „reklama?” (do ręcznej oceny)');
    assert.equal(cookies.results.none.overlays.cmp, true, 'nakładka cookies rozpoznana');
    assert.equal(antiab.results.none.overlays.antiAdblock, true, 'nakładka anti-adblock rozpoznana');
    assert.match(antiab.results.none.antiAdblockText, /AdBlock/i);
    assert.ok(news.verdicts.basic && !('none' in news.verdicts), 'ocena tylko dla trybów');
    assert.ok(Object.values(AUTO).includes(news.verdicts.basic.auto));
    assert.ok(report.summary.basic.adSignalsReductionPct > 0);
    for (const f of ['latest.json', 'latest.txt', 'latest.html']) assert.ok(fs.existsSync(path.join(outDir, f)), f);
    assert.ok(fs.readdirSync(path.join(outDir, 'shots')).some((f) => /-basic\.jpg$/.test(f)), 'zrzuty lokalnie');
    const html = fs.readFileSync(path.join(outDir, 'latest.html'), 'utf8');
    assert.equal((html.match(/<select data-key=/g) || []).length, 3, 'ręczna ocena dla każdej strony w trybie (bez kontroli)');
    for (const v of MANUAL_VERDICTS) assert.ok(html.includes(`<option>${v}</option>`), v);
    assert.match(html, /Eksportuj oceny/);
    assert.doesNotMatch(html, /<script src=|<link [^>]*href="http/, 'raport bez zewnętrznych zasobów');
    const txt = fs.readFileSync(path.join(outDir, 'latest.txt'), 'utf8');
    assert.match(txt, /Wyniki automatyczne to podejrzenia, nie werdykt/);
    assert.doesNotMatch(txt, /\bPASS\b/, 'automat nie ogłasza PASS');
    assert.equal(formatTxt(report), txt);
    assert.equal(formatHtml(report, outDir), html);
  } finally {
    server.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
