// Tester jednego blockera na stronach (tests/local/single-blocker-sites.mjs).
// 1) czysta logika: argumenty, corpus, ocena strony (priorytety, challenge, consent, błędy JS ≠ breakage), YouTube, podsumowanie;
// 2) w prawdziwym Chromium, BEZ internetu: lokalne atrapy stron (ctx.route) przechodzą przez cały przebieg
//    none vs chromeblock – reklama, pusty slot, promo, CMP (odrzucenie / tylko akceptacja), anti-adblock,
//    pusta strona, menu i wyszukiwarka, main content, challenge, błąd strony, raport HTML/TXT/JSON i zrzuty.
//    Brak Playwright/Chromium → SKIP.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, ROOT } from '../../tools/chromium-smoke.mjs';
import {
  CONFIGS, STATUS, AD_CLASSES, CONSENT_STATES, PATTERNS, parseSitesArgs, loadSites, siteOf, classifySite, classifyYouTube,
  consentComparable, diffOf, summarize, formatTxt, formatHtml, runSitesTest,
} from '../../tests/local/single-blocker-sites.mjs';

const ads = (o = {}) => ({ counts: { REAL_AD: 0, EMPTY_AD_SLOT: 0, LABEL_ONLY: 0, SITE_PROMO: 0, UNKNOWN: 0, ...o }, samples: { REAL_AD: [], EMPTY_AD_SLOT: [], LABEL_ONLY: [], SITE_PROMO: [], UNKNOWN: [] } });
const m = (o = {}) => ({
  status: 200, textLength: 5000, blank: false, mainContent: true, overflowX: false, scrollLocked: false, pageErrors: 0,
  menuLinks: 10, nav: { ok: true }, search: { present: true, ok: true }, videos: 0, challenge: '', antiAdblock: '',
  consent: { state: CONSENT_STATES.NONE, clicked: [], reason: '' }, ads: ads(),
  requests: { total: 100, blocked: 0, failed: 0, adHostRequests: 0, adHostLoaded: 0, adHosts: {} }, ...o,
});

test('argumenty i corpus: 53 strony z historycznego testera, znane przypadki, YouTube osobno', () => {
  const o = parseSitesArgs(['--sites']);
  assert.deepEqual([o.limit, o.only, o.youtube, o.screenshots], [0, [], true, true]);
  const p = parseSitesArgs(['--sites', '--limit', '4', '--only', 'www.Onet.pl,edition.cnn.com', '--no-youtube', '--no-screenshots', '--headless', '--results', 'x']);
  assert.deepEqual([p.limit, p.only, p.youtube, p.screenshots, p.headless], [4, ['onet.pl', 'cnn.com'], false, false, true]);
  assert.equal(p.resultsDir, path.resolve('x'));
  assert.deepEqual([...CONFIGS], ['none', 'chromeblock']);

  const { sites, youtube } = loadSites();
  assert.equal(sites.length, 53);
  assert.equal(new Set(sites.map((s) => s.host)).size, 53);
  // ten sam corpus co w historycznym testerze trybów
  const legacy = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/local/sites-protection-modes.json'), 'utf8'));
  assert.deepEqual(sites.map((s) => s.url), Object.values(legacy.categories).flat());
  assert.ok(!sites.some((s) => /youtube\.com/.test(s.host)));
  assert.match(youtube.watch, /^https:\/\/www\.youtube\.com\/watch\?v=/);
  assert.match(youtube.shorts, /^https:\/\/www\.youtube\.com\/shorts\//);
  for (const host of ['wykop.pl', 'forbes.com', 'filmweb.pl', 'theguardian.com', 'allegro.pl']) {
    assert.ok(sites.find((s) => s.host.replace(/^www\./, '') === host && s.knownCase), `znany przypadek: ${host}`);
  }
  assert.equal(loadSites(undefined, { limit: 3 }).sites.length, 3);
  assert.deepEqual(loadSites(undefined, { only: ['onet.pl', 'wp.pl'] }).sites.map((s) => s.host), ['www.onet.pl', 'www.wp.pl']);
  assert.equal(siteOf('a.b.onet.pl'), 'onet.pl');
  assert.equal(siteOf('x.example.com.pl'), 'example.com.pl');
});

test('wzorce consent: odrzucenie tak, akceptacja/login/subskrypcja nie', () => {
  const reject = new RegExp(PATTERNS.reject, 'i');
  const forbidden = new RegExp(PATTERNS.forbidden, 'i');
  for (const t of ['Odrzuć wszystko', 'ODRZUĆ', 'Nie zgadzam się', 'Tylko niezbędne', 'Zaakceptuj tylko niezbędne', 'Reject all', 'Decline', 'Only necessary cookies', 'Continue without accepting']) assert.match(t, reject, t);
  for (const t of ['Akceptuj wszystko', 'Zaakceptuj', 'Accept all', 'Zgadzam się', 'Ustawienia', 'Zaloguj się', 'Subskrybuj', 'Przejdź do serwisu']) assert.doesNotMatch(t, reject, t);
  for (const t of ['Zaloguj się', 'Subscribe', 'Kup premium', 'Zapłać']) assert.match(t, forbidden, t);
  assert.match('Ta strona używa plików cookie', new RegExp(PATTERNS.cmpText, 'i'));
});

test('ocena strony: priorytety, challenge vs kontrola, consent, błędy JS nie są breakage', () => {
  const ctrl = m({ ads: ads({ REAL_AD: 4 }) });
  // PASS – wskazówka, nie gwarancja
  const ok = classifySite(ctrl, m());
  assert.equal(ok.status, STATUS.PASS);
  assert.match(ok.reasons.join(), /4 → 0/);
  assert.match(ok.reasons.join(), /wskazówka, nie gwarancja/);
  // reklamy
  assert.equal(classifySite(ctrl, m({ ads: ads({ REAL_AD: 1 }) })).status, STATUS.REAL_AD);
  assert.equal(classifySite(ctrl, m({ ads: ads({ EMPTY_AD_SLOT: 2 }) })).status, STATUS.EMPTY_AD_SLOT);
  assert.equal(classifySite(ctrl, m({ ads: ads({ UNKNOWN: 1 }) })).status, STATUS.MANUAL_REVIEW);
  assert.equal(classifySite(ctrl, m({ ads: ads({ LABEL_ONLY: 2, SITE_PROMO: 1 }) })).status, STATUS.PASS, 'etykieta i promocja strony to nie reklama');
  // błędy JS – tylko informacja (Filmweb, Guardian)
  const js = classifySite(m({ pageErrors: 2 }), m({ pageErrors: 40 }));
  assert.equal(js.status, STATUS.PASS);
  assert.match(js.reasons.join(), /tylko informacja, nie breakage/);
  // breakage względem kontroli
  for (const [cb, re] of [
    [m({ blank: true, textLength: 20 }), /pusta strona/],
    [m({ textLength: 900 }), /spadek treści/],
    [m({ mainContent: false }), /główna treść/],
    [m({ menuLinks: 0 }), /menu/],
    [m({ nav: { ok: false, error: 'timeout' } }), /link z menu/],
    [m({ search: { present: true, ok: false } }), /wyszukiwarka/],
    [m({ overflowX: true }), /układ/],
  ]) {
    const v = classifySite(m(), cb);
    assert.equal(v.status, STATUS.BREAKAGE, JSON.stringify(cb));
    assert.match(v.reasons.join(), re);
  }
  assert.equal(classifySite(m({ videos: 1 }), m({ videos: 0 })).status, STATUS.BREAKAGE, 'player');
  assert.equal(classifySite(m({ mainContent: false }), m({ mainContent: false })).status, STATUS.PASS, 'to samo w kontroli → nie breakage');
  // breakage > anti-adblock > reklama
  assert.equal(classifySite(m(), m({ textLength: 100, antiAdblock: 'adblock', ads: ads({ REAL_AD: 3 }) })).status, STATUS.BREAKAGE);
  assert.equal(classifySite(m(), m({ antiAdblock: 'Wyłącz AdBlock', ads: ads({ REAL_AD: 3 }) })).status, STATUS.ANTI_ADBLOCK);
  assert.notEqual(classifySite(m({ antiAdblock: 'adblock' }), m({ antiAdblock: 'adblock' })).status, STATUS.ANTI_ADBLOCK, 'ten sam tekst bez rozszerzenia');
  // challenge: Allegro (oba) vs Forbes (tylko z ChromeBlock)
  const both = classifySite(m({ challenge: 'captcha' }), m({ challenge: 'captcha' }));
  assert.deepEqual([both.status, both.scope], [STATUS.BOT_CHALLENGE, 'both']);
  assert.match(both.reasons.join(), /także BEZ ChromeBlock – nie przypisujemy/);
  const cbOnly = classifySite(m(), m({ challenge: 'nie jestem robotem' }));
  assert.deepEqual([cbOnly.status, cbOnly.scope], [STATUS.BOT_CHALLENGE, 'chromeblock']);
  assert.equal(classifySite(m({ challenge: 'captcha' }), m()).status, STATUS.MANUAL_REVIEW);
  // błędy ładowania
  assert.equal(classifySite({ error: 'ERR_NAME_NOT_RESOLVED' }, { error: 'ERR_NAME_NOT_RESOLVED' }).status, STATUS.SITE_ERROR);
  assert.equal(classifySite(m({ status: 503 }), m({ status: 503 })).status, STATUS.SITE_ERROR);
  assert.equal(classifySite({ error: 'timeout' }, m()).status, STATUS.SITE_ERROR, 'bez kontroli nie oceniamy');
  assert.equal(classifySite(m(), { error: 'ERR_TIMED_OUT' }).status, STATUS.BREAKAGE);
  // consent: nierozwiązany w którejkolwiek konfiguracji → bez porównania reklam
  const unresolved = { state: CONSENT_STATES.UNRESOLVED, clicked: [], reason: 'tylko przycisk akceptacji (nie klikamy)' };
  const ci = classifySite(m({ consent: unresolved }), m({ ads: ads({ REAL_AD: 5 }) }));
  assert.equal(ci.status, STATUS.CONSENT_INCONCLUSIVE);
  assert.match(ci.reasons.join(), /reklamy nie są porównywane/);
  assert.equal(consentComparable(m({ consent: { state: 'rejected', clicked: ['Odrzuć'] } }), m()), true, 'brak banera i odrzucony są równoważne');
  assert.equal(classifySite(m(), m({ consent: unresolved, scrollLocked: true })).status, STATUS.CONSENT_INCONCLUSIVE, 'blokada przewijania przez baner zgody ≠ breakage');
  assert.equal(diffOf(m({ consent: unresolved }), m()).comparable, false);
});

test('YouTube: brak okazji reklamowej = INCONCLUSIVE; seek A/B z kontrolą; Protection i bramka 30/30', () => {
  const play = (o = {}) => ({ player: true, video: true, progressS: 8, playing: true, adSeen: false, antiAdblock: false, seek: { ok: true }, shorts: { ok: true, progressS: 5 }, ...o });
  const by = (checks) => Object.fromEntries(checks.map((c) => [c.id, c.status]));
  const ok = by(classifyYouTube(play(), play({ protection: { status: 'ok', compat: '30/30', gate: true } })));
  assert.deepEqual(ok, { 'yt-player': 'PASS', 'yt-seek': 'PASS', 'yt-shorts': 'PASS', 'yt-ads': 'INCONCLUSIVE', 'yt-antiadblock': 'PASS', 'yt-protection': 'PASS' });
  assert.equal(by(classifyYouTube(play({ adSeen: true }), play()))['yt-ads'], 'PASS', 'reklama w kontroli, z ChromeBlock brak');
  assert.equal(by(classifyYouTube(play(), play({ adSeen: true })))['yt-ads'], 'REAL_AD');
  assert.equal(by(classifyYouTube(play({ seek: { ok: false } }), play({ seek: { ok: false } })))['yt-seek'], 'INCONCLUSIVE', 'seek zepsuty także bez rozszerzenia');
  assert.equal(by(classifyYouTube(play(), play({ seek: { ok: false } })))['yt-seek'], 'BREAKAGE');
  assert.equal(by(classifyYouTube(play(), play({ playing: false, progressS: 0 })))['yt-player'], 'BREAKAGE');
  assert.equal(by(classifyYouTube(play(), play({ antiAdblock: true })))['yt-antiadblock'], 'ANTI_ADBLOCK');
  assert.equal(by(classifyYouTube(play(), play({ protection: { status: 'warning', compat: '29/30', gate: false } })))['yt-protection'], 'MANUAL_REVIEW');
  assert.equal(classifyYouTube(play(), { skip: 'INCONCLUSIVE – CAPTCHA' })[0].status, 'INCONCLUSIVE');
});

test('podsumowanie i raporty: różnica none → ChromeBlock, zrzuty obok siebie, ręczna ocena, eksport JSON', () => {
  const rows = [
    { url: 'https://a.pl/', host: 'a.pl', category: 'x', knownCase: 'sprawdź baner', results: { none: m({ ads: ads({ REAL_AD: 4 }) }), chromeblock: m({ ads: ads({ REAL_AD: 1 }), requests: { total: 50, blocked: 30, failed: 0, adHostRequests: 0, adHostLoaded: 0, adHosts: {} } }) } },
    { url: 'https://b.pl/', host: 'b.pl', category: 'x', knownCase: null, results: { none: m({ ads: ads({ REAL_AD: 2 }), consent: { state: 'unresolved', clicked: [], reason: 'r' } }), chromeblock: m() } },
    { url: 'https://c.pl/', host: 'c.pl', category: 'x', knownCase: null, results: { none: m({ challenge: 'captcha' }), chromeblock: m({ challenge: 'captcha' }) } },
  ].map((r) => ({ ...r, verdict: classifySite(r.results.none, r.results.chromeblock), diff: diffOf(r.results.none, r.results.chromeblock) }));
  const s = summarize(rows);
  assert.equal(s.comparableSites, 2, 'strona bez porównywalnej zgody nie liczy się do reklam');
  assert.deepEqual(s.ads.REAL_AD, { none: 4, chromeblock: 1 });
  assert.equal(s.realAdReductionPct, 75);
  assert.deepEqual([s.status.REAL_AD, s.status.CONSENT_INCONCLUSIVE, s.status.BOT_CHALLENGE, s.challenge.both], [1, 1, 1, 1]);
  assert.equal(s.blockedRequests, 30);
  const report = { startedAt: '2026-01-01T00:00:00.000Z', finishedAt: '2026-01-01T00:10:00.000Z', environment: { os: 'X', node: 'v20' }, extension: { version: '0.3.4', lists: ['ads', 'privacy', 'security'] }, sites: rows, youtube: null, summary: s, note: 'Wynik automatyczny to wskazówka.' };
  const txt = formatTxt(report);
  assert.match(txt, /REAL_AD 4 → 1/);
  assert.match(txt, /Redukcja REAL_AD: 75%/);
  assert.match(txt, /znany przypadek: sprawdź baner/);
  const html = formatHtml(report, '/tmp');
  for (const re of [/BEZ ChromeBlock/, /Z ChromeBlock/, /Eksportuj oceny/, /<select data-key="https:\/\/a\.pl\/">/, /Znany przypadek: sprawdź baner/, /localStorage/]) assert.match(html, re);
  assert.equal((html.match(/<section class="site/g) || []).length, 3);
  for (const st of Object.values(STATUS)) assert.match(html, new RegExp(`<option>${st}</option>`));
  assert.deepEqual(AD_CLASSES, ['REAL_AD', 'EMPTY_AD_SLOT', 'LABEL_ONLY', 'SITE_PROMO', 'UNKNOWN']);
});

test('tester nie dotyka produktu: brak zmian zachowania, osobny plik', () => {
  const src = fs.readFileSync(path.join(ROOT, 'tests/local/single-blocker-sites.mjs'), 'utf8');
  assert.doesNotMatch(src, /options:set|chrome\.storage\.local\.set|disabledSites|userFilters/, 'tester nie zmienia ustawień rozszerzenia');
  assert.doesNotMatch(src, /protectionMode|basic|balanced|strict/i, 'bez trybów');
});

test('uruchomienie: test-sites.cmd → test-chromeblock.cmd --sites, npm run test:sites, paczka testera', async () => {
  const cmd = fs.readFileSync(path.join(ROOT, 'test-chromeblock.cmd'), 'utf8');
  assert.match(cmd, /if \/i "%~1"=="--sites" set "SCRIPT=tests\\local\\single-blocker-sites\.mjs"/);
  assert.match(cmd, /sites\\latest\.html/);
  const sites = fs.readFileSync(path.join(ROOT, 'test-sites.cmd'), 'utf8');
  assert.match(sites, /\r\n/, 'CRLF');
  assert.match(sites, /call "%~dp0test-chromeblock\.cmd" --sites %\*/);
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['test:sites'], 'node tests/local/single-blocker-sites.mjs');
  assert.doesNotMatch(pkg.scripts.test, /sites/);
  const { TESTER_FILES, EXTRA_FILES, missingTesterImports } = await import('../../tools/package-dev.mjs');
  for (const f of ['tests/local/single-blocker-sites.mjs', 'tests/local/sites-single-blocker.json']) assert.ok(TESTER_FILES.includes(f), f);
  assert.ok(EXTRA_FILES.some(([, d]) => d === 'test-sites.cmd'));
  assert.deepEqual(missingTesterImports(), []);
});

// ---------------------------------------------------------------------------------------------
// Atrapy stron w prawdziwym Chromium (bez internetu)

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

const ARTICLE = `<article><h1>Artykuł testowy</h1>${'<p>Treść artykułu o pogodzie i polityce lokalnej, wystarczająco długa, żeby liczyć się jako główna treść strony. </p>'.repeat(25)}</article>`;
const NAV = '<header><nav><a href="/kraj">Kraj</a> <a href="/swiat">Świat</a> <a href="/sport">Sport</a> <a href="/kultura">Kultura</a></nav><form role="search"><input type="search" name="q" placeholder="Szukaj"></form></header>';
const page = (body, head = '') => `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Atrapa</title>${head}</head><body style="margin:0;font:16px sans-serif">${NAV}<main>${body}</main><footer><a href="/reklama">Reklama</a> · <a href="/kontakt">Kontakt</a></footer></body></html>`;
const AD_IMG = 'https://securepubads.g.doubleclick.net/pagead/banner-300x250.png';
const AD_FRAME = 'https://securepubads.g.doubleclick.net/pagead/ad.html';
// skrypt blokowany bez zastępnika (adsbygoogle.js/gpt.js ChromeBlock podmienia na neutralny surrogate → onload, nie onerror)
const AD_JS = 'https://static.criteo.net/js/ld/publishertag.js';
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

const CMP = (buttons) => `<div id="cookie-consent" style="position:fixed;inset:auto 0 0 0;height:260px;background:#fff;border-top:2px solid #000;z-index:99;padding:20px">
<p>Ta strona używa plików cookie i przetwarza Twoje dane w celach reklamowych. Zgoda RODO.</p>${buttons}</div>
<script>window.__accept = () => { fetch('/__accepted'); document.getElementById('cookie-consent').remove(); };
window.__reject = () => document.getElementById('cookie-consent').remove();</script>`;

const FIXTURES = {
  // reklama: obrazek z hosta reklamowego w kontenerze z etykietą, w żadnym znanym selektorze kosmetycznym
  'ad.cb-fixture.pl': page(`${ARTICLE}<div class="box-x7" style="width:300px;margin:20px"><span>Reklama</span><a href="https://advertiser.example/"><img src="${AD_IMG}" width="300" height="250" alt=""></a></div>`),
  // reklama w iframe (zablokowana przez ChromeBlock → slot pusty albo ukryty)
  'frame.cb-fixture.pl': page(`${ARTICLE}<div id="div-gpt-ad-1" style="width:300px;height:250px"><iframe src="${AD_FRAME}" width="300" height="250" style="border:0"></iframe></div>`),
  // pusty slot z etykietą w obu konfiguracjach
  'empty.cb-fixture.pl': page(`${ARTICLE}<div class="box-q2" style="width:320px;height:260px;border:1px solid #ccc"><small>REKLAMA</small></div>`),
  // materiał promocyjny strony (link do tej samej domeny)
  'promo.cb-fixture.pl': page(`${ARTICLE}<div class="tile-k" style="width:320px"><span>Materiał partnera</span><a href="/promocja/abc"><img src="/img/promo.png" width="300" height="160" alt=""></a><p>Nowa oferta w naszym serwisie</p></div>`),
  // CMP z odrzuceniem (akceptacji nigdy nie klikamy)
  'cmp.cb-fixture.pl': page(`${ARTICLE}${CMP('<button onclick="__accept()">Akceptuj wszystko</button> <button onclick="__reject()">Odrzuć wszystko</button>')}`),
  // CMP tylko z akceptacją → CONSENT_INCONCLUSIVE
  'cmpaccept.cb-fixture.pl': page(`${ARTICLE}${CMP('<button onclick="__accept()">Akceptuj i przejdź do serwisu</button>')}`),
  // anti-adblock: komunikat, gdy skrypt reklamowy się nie wczyta
  'anti.cb-fixture.pl': page(`${ARTICLE}<div id="msg"></div><script>const s = document.createElement('script'); s.src = '${AD_JS}';
s.onerror = () => { document.getElementById('msg').innerHTML = '<div style="padding:20px;border:2px solid red">Wykryliśmy AdBlock. Wyłącz blokadę reklam, aby czytać dalej.</div>'; };
document.head.appendChild(s);</script>`),
  // pusta strona: aplikacja renderowana dopiero po wczytaniu skryptu z hosta reklamowego
  'blank.cb-fixture.pl': `<!doctype html><html><head><meta charset="utf-8"><title>App</title></head><body><div id="app"></div><script>const s = document.createElement('script'); s.src = '${AD_JS}';
s.onload = () => { document.getElementById('app').innerHTML = ${JSON.stringify(NAV + '<main>' + ARTICLE + '</main>')}; };
document.head.appendChild(s);</script></body></html>`,
  // challenge w obu konfiguracjach (jak Allegro)
  'challenge.cb-fixture.pl': '<!doctype html><html><head><meta charset="utf-8"><title>Just a moment...</title></head><body><h1>Verify you are human</h1><p>Potwierdź, że nie jesteś robotem.</p></body></html>',
  // challenge tylko z ChromeBlock (jak Forbes): pojawia się, gdy skrypt z hosta reklamowego się nie wczyta
  'cbchallenge.cb-fixture.pl': page(`${ARTICLE}<script>const s = document.createElement('script'); s.src = '${AD_JS}';
s.onerror = () => { document.body.innerHTML = '<h1>Nie jestem robotem</h1><p>Potwierdź, że jesteś człowiekiem.</p>'; };
document.head.appendChild(s);</script>`),
  // czysta strona: menu, wyszukiwarka, main + dużo błędów JS (nie breakage)
  'clean.cb-fixture.pl': page(`${ARTICLE}<script>for (let i = 0; i < 12; i++) setTimeout(() => { throw new Error('błąd strony ' + i); }, i * 10);</script>`),
};

async function installFixtures(ctx, hits) {
  await ctx.route(/^https?:\/\//, async (route) => {
    const u = new URL(route.request().url());
    if (u.pathname === '/__accepted') { hits.accepted.push(u.hostname); return route.fulfill({ status: 204, body: '' }); }
    if (u.hostname === 'error.cb-fixture.pl') return route.fulfill({ status: 503, contentType: 'text/html', body: '<h1>503 Service Unavailable</h1>' });
    if (/\.png$/.test(u.pathname)) return route.fulfill({ status: 200, contentType: 'image/png', body: PNG });
    if (u.hostname === 'static.criteo.net') return route.fulfill({ status: 200, contentType: 'text/javascript', body: 'window.__adsLoaded = true;' });
    if (u.hostname === 'securepubads.g.doubleclick.net') return route.fulfill({ status: 200, contentType: 'text/html', body: `<body style="margin:0"><img src="${AD_IMG}" width="300" height="250"></body>` });
    const html = FIXTURES[u.hostname];
    if (!html) return route.fulfill({ status: 404, contentType: 'text/html', body: '<h1>404</h1>' });
    const body = u.pathname === '/' ? html : page(ARTICLE.replace('Artykuł testowy', `Podstrona ${u.pathname}`));
    return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body });
  });
}

test('atrapy stron w Chromium (bez internetu): none vs ChromeBlock, consent, statusy, raport i zrzuty', { skip, timeout: 600_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-sites-fixture-'));
  try {
    const hosts = [...Object.keys(FIXTURES), 'error.cb-fixture.pl'];
    const sitesFile = path.join(tmp, 'sites.json');
    fs.writeFileSync(sitesFile, JSON.stringify({ categories: { atrapy: hosts.map((h) => `https://${h}/`) }, knownCases: { 'cbchallenge.cb-fixture.pl': 'challenge tylko z ChromeBlock – sprawdź powtarzalność' } }));
    const hits = { accepted: [] };
    const { report, outDir } = await runSitesTest({
      sitesFile, resultsDir: path.join(tmp, 'results'), headless: true, screenshots: true, youtube: false, settleMs: 300, limit: 0, only: [],
      onContext: (ctx) => installFixtures(ctx, hits), log: () => {},
    });
    const by = Object.fromEntries(report.sites.map((r) => [r.host.split('.')[0], r]));
    const st = (k) => by[k].verdict.status;
    const res = (k, c) => by[k].results[c];
    const dump = (k) => JSON.stringify({ verdict: by[k].verdict, none: res(k, 'none').ads?.counts, cb: res(k, 'chromeblock').ads?.counts, consent: [res(k, 'none').consent, res(k, 'chromeblock').consent] });

    assert.deepEqual(report.extension.lists, ['ads', 'privacy', 'security']);
    // reklama: widoczna bez rozszerzenia, ChromeBlock blokuje host reklamowy
    assert.ok(res('ad', 'none').ads.counts.REAL_AD >= 1, dump('ad'));
    assert.ok(res('ad', 'chromeblock').requests.blocked >= 1, dump('ad'));
    assert.ok(res('ad', 'none').requests.adHostLoaded >= 1);
    assert.ok(by.ad.diff.ads.REAL_AD.chromeblock < by.ad.diff.ads.REAL_AD.none, dump('ad'));
    assert.ok(res('frame', 'none').ads.counts.REAL_AD >= 1, dump('frame'));
    assert.equal(res('frame', 'chromeblock').ads.counts.REAL_AD, 0, dump('frame'));
    // pusty slot (w obu) i materiał promocyjny strony
    assert.equal(st('empty'), STATUS.EMPTY_AD_SLOT, dump('empty'));
    assert.equal(res('empty', 'none').ads.counts.EMPTY_AD_SLOT, 1);
    assert.equal(res('promo', 'chromeblock').ads.counts.SITE_PROMO, 1, dump('promo'));
    assert.equal(st('promo'), STATUS.PASS, dump('promo'));
    // link „Reklama” w stopce nie jest reklamą ani etykietą
    assert.equal(res('clean', 'none').ads.counts.LABEL_ONLY, 0, dump('clean'));
    // CMP: ta sama procedura w obu, kliknięte tylko odrzucenie, baner nie jest reklamą
    for (const c of CONFIGS) {
      assert.equal(res('cmp', c).consent.state, CONSENT_STATES.REJECTED, `${c}: ${dump('cmp')}`);
      assert.deepEqual(res('cmp', c).consent.clicked, ['Odrzuć wszystko']);
      assert.equal(res('cmpaccept', c).consent.state, CONSENT_STATES.UNRESOLVED);
      assert.match(res('cmpaccept', c).consent.reason, /tylko przycisk akceptacji/);
      assert.equal(res('clean', c).consent.state, CONSENT_STATES.NONE);
    }
    assert.equal(st('cmp'), STATUS.PASS, dump('cmp'));
    assert.equal(st('cmpaccept'), STATUS.CONSENT_INCONCLUSIVE);
    assert.deepEqual(hits.accepted, [], 'nigdy nie kliknięto akceptacji');
    // anti-adblock tylko z ChromeBlock
    assert.equal(st('anti'), STATUS.ANTI_ADBLOCK, dump('anti'));
    assert.equal(res('anti', 'none').antiAdblock, '');
    // pusta strona tylko z ChromeBlock
    assert.equal(st('blank'), STATUS.BREAKAGE, dump('blank'));
    assert.match(by.blank.verdict.reasons.join(), /pusta strona/);
    // challenge: w obu (nie obwiniamy) i tylko z ChromeBlock (do ręcznej weryfikacji)
    assert.deepEqual([st('challenge'), by.challenge.verdict.scope], [STATUS.BOT_CHALLENGE, 'both']);
    assert.deepEqual([st('cbchallenge'), by.cbchallenge.verdict.scope], [STATUS.BOT_CHALLENGE, 'chromeblock']);
    assert.match(by.cbchallenge.knownCase, /powtarzalność/);
    // błąd strony w obu
    assert.equal(st('error'), STATUS.SITE_ERROR);
    // czysta strona: menu, nawigacja, wyszukiwarka, main; błędy JS nie są breakage
    for (const c of CONFIGS) {
      const r = res('clean', c);
      assert.ok(r.menuLinks >= 4 && r.nav.ok === true && r.search.ok === true && r.mainContent === true, `${c}: ${JSON.stringify(r.nav)}`);
      assert.ok(r.pageErrors >= 10);
    }
    assert.equal(st('clean'), STATUS.PASS, dump('clean'));

    // raporty i zrzuty (ta sama rozdzielczość obok siebie)
    for (const f of ['latest.json', 'latest.txt', 'latest.html']) assert.ok(fs.existsSync(path.join(outDir, f)), f);
    const html = fs.readFileSync(path.join(outDir, 'latest.html'), 'utf8');
    assert.match(html, /BEZ ChromeBlock[\s\S]*Z ChromeBlock/);
    const shots = [...html.matchAll(/<img src="([^"]+)"/g)].map((x) => x[1]);
    assert.equal(shots.length, hosts.length * 2 - 0, 'zrzut none i chromeblock dla każdej strony');
    for (const s of shots) assert.ok(fs.existsSync(path.join(outDir, s)), s);
    const sizes = new Set(shots.map((s) => { const b = fs.readFileSync(path.join(outDir, s)); for (let i = 2; i < b.length;) { const len = b.readUInt16BE(i + 2); if (b[i + 1] >= 0xc0 && b[i + 1] <= 0xc2) return `${b.readUInt16BE(i + 7)}x${b.readUInt16BE(i + 5)}`; i += 2 + len; } return '?'; }));
    assert.deepEqual([...sizes], ['1366x800']);
    const json = JSON.parse(fs.readFileSync(path.join(outDir, 'latest.json'), 'utf8'));
    assert.equal(json.kind, 'chromeblock-single-blocker-sites');
    assert.equal(json.sites.length, hosts.length);
    assert.match(fs.readFileSync(path.join(outDir, 'latest.txt'), 'utf8'), /bez → z/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
