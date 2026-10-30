// Tester jednego blockera na stronach (tests/local/single-blocker-sites.mjs).
// 1) czysta logika: argumenty, corpus, ocena strony (priorytety, challenge, consent, błędy JS ≠ breakage), YouTube, podsumowanie;
// 2) w prawdziwym Chromium, BEZ internetu: lokalne atrapy stron (ctx.route) przechodzą przez cały przebieg
//    none vs apex – reklama, pusty slot, promo, CMP (odrzucenie / tylko akceptacja), anti-adblock,
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
  assert.deepEqual([...CONFIGS], ['none', 'apex']);

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

test('consent: realne warianty odrzucenia (WP, o2) i whitelista kroku ustawień CMP; zgody nigdy', () => {
  const reject = new RegExp(PATTERNS.reject, 'i');
  const settings = new RegExp(PATTERNS.settings, 'i');
  // regresja z live testu (WP, o2)
  assert.match('Odrzucam i chcę dowiedzieć się więcej', reject);
  assert.match('ODRZUCAM I CHCĘ DOWIEDZIEĆ SIĘ WIĘCEJ', reject, 'CSS text-transform: uppercase');
  for (const t of ['Odrzucam', 'Odrzuć', 'Odrzuć wszystko', 'Nie zgadzam się', 'Tylko niezbędne', 'Reject all', 'Decline', 'Only necessary']) assert.match(t, reject, t);
  // bez fuzzy: samo słowo „odrzuć” w dłuższym tekście nie wystarcza
  for (const t of ['Dowiedz się, jak odrzucić', 'Odrzuć i zaakceptuj resztę', 'Nie chcesz? Odrzuć w ustawieniach']) assert.doesNotMatch(t, reject, t);
  for (const t of ['Ustawienia zaawansowane', 'USTAWIENIA ZAAWANSOWANE', 'Ustawienia prywatności', 'USTAWIENIA PRYWATNOŚCI', 'Ustawienia preferencji', 'Zarządzaj ustawieniami', 'Pokaż cele', 'Manage options', 'Manage preferences', 'Privacy settings', 'Cookie settings']) assert.match(t, settings, t);
  // zgoda / niejednoznaczne zamknięcie: ani odrzucenie, ani ustawienia
  for (const t of ['Akceptuję', 'Akceptuję wszystko', 'Akceptuję i przechodzę do serwisu', 'Przejdź do serwisu', 'PRZEJDŹ DO SERWISU', 'Kontynuuj', 'Zaloguj się', 'Zarejestruj się', 'Subskrybuj', 'Zapłać', 'Ustawienia', 'Zapisz wybór']) {
    assert.doesNotMatch(t, reject, t);
    assert.doesNotMatch(t, settings, t);
  }
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
  // challenge: Allegro (oba) vs Forbes (tylko z Apex AdBlocker)
  const both = classifySite(m({ challenge: 'captcha' }), m({ challenge: 'captcha' }));
  assert.deepEqual([both.status, both.scope], [STATUS.BOT_CHALLENGE, 'both']);
  assert.match(both.reasons.join(), /także BEZ Apex AdBlocker – nie przypisujemy/);
  const cbOnly = classifySite(m(), m({ challenge: 'nie jestem robotem' }));
  assert.deepEqual([cbOnly.status, cbOnly.scope], [STATUS.BOT_CHALLENGE, 'apex']);
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
  assert.equal(classifySite(m(), m({ consent: unresolved, scrollLocked: true })).status, STATUS.CONSENT_INCONCLUSIVE, 'blokada przewijania przez baner zgody ≠ breakage');
  assert.equal(diffOf(m({ consent: unresolved }), m()).comparable, false);
});

test('consent: do porównania reklam tylko ten sam stan (none+none, rejected+rejected)', () => {
  const c = (state) => m({ consent: { state, clicked: state === 'rejected' ? ['Odrzuć wszystko'] : [], reason: state === 'unresolved' ? 'brak przycisku odrzucenia' : '' } });
  const matrix = [
    ['none', 'none', true], ['rejected', 'rejected', true],
    ['none', 'rejected', false], ['rejected', 'none', false],
    ['unresolved', 'none', false], ['none', 'unresolved', false], ['unresolved', 'rejected', false], ['rejected', 'unresolved', false], ['unresolved', 'unresolved', false],
  ];
  for (const [a, b, ok] of matrix) {
    assert.equal(consentComparable(c(a), c(b)), ok, `${a} + ${b}`);
    assert.equal(diffOf(c(a), c(b)).comparable, ok, `diff ${a} + ${b}`);
    const v = classifySite(c(a), { ...c(b), ads: ads({ REAL_AD: 2 }) });
    assert.equal(v.status, ok ? STATUS.REAL_AD : STATUS.CONSENT_INCONCLUSIVE, `${a} + ${b}`);
    assert.notEqual(v.status, STATUS.BREAKAGE);
  }
  assert.match(classifySite(c('none'), c('rejected')).reasons[0], /^różny stan zgody: none vs rejected \(bez → z\) – reklamy nie są porównywane$/);
  assert.match(classifySite(c('rejected'), c('none')).reasons[0], /różny stan zgody: rejected vs none/);
  assert.match(classifySite(c('unresolved'), c('none')).reasons[0], /zgoda bez: unresolved – brak przycisku odrzucenia; z: none – reklamy nie są porównywane/);
  assert.equal(consentComparable({ error: 'x' }, m()), false);
  // strona z różnym stanem zgody nie wchodzi do zbiorczych metryk reklam
  const rows = [[c('none'), m({ ads: ads({ REAL_AD: 2 }) }), m({ ads: ads({ REAL_AD: 1 }) })], [null, { ...c('none'), ads: ads({ REAL_AD: 5 }) }, { ...c('rejected'), ads: ads() }]]
    .map(([, a, b]) => ({ results: { none: a, apex: b }, verdict: classifySite(a, b), diff: diffOf(a, b) }));
  const s = summarize(rows);
  assert.deepEqual([s.comparableSites, s.ads.REAL_AD.none, s.ads.REAL_AD.apex, s.realAdReductionPct], [1, 2, 1, 50]);
});

test('domena rejestrowalna: obca domena z tym samym sufiksem publicznym nie jest „własna”', () => {
  assert.equal(siteOf('businessinsider.com.pl'), 'businessinsider.com.pl');
  assert.equal(siteOf('www.businessinsider.com.pl'), 'businessinsider.com.pl');
  assert.equal(siteOf('partner.com.pl'), 'partner.com.pl');
  assert.notEqual(siteOf('www.businessinsider.com.pl'), siteOf('partner.com.pl'));
  assert.equal(siteOf('www.dailymail.co.uk'), 'dailymail.co.uk');
  assert.equal(siteOf('example.co.uk'), 'example.co.uk');
  assert.notEqual(siteOf('www.dailymail.co.uk'), siteOf('example.co.uk'));
  assert.equal(siteOf('news.dailymail.co.uk'), siteOf('www.dailymail.co.uk'), 'subdomena tej samej strony');
  assert.equal(siteOf('www.onet.pl'), 'onet.pl');
  // jedna logika: funkcja w stronie nie ma własnej wersji „2 ostatnie etykiety”
  const src = fs.readFileSync(path.join(ROOT, 'tests/local/single-blocker-sites.mjs'), 'utf8');
  assert.doesNotMatch(src, /ownSite|slice\(-2\)\.join\('\.'\)\s*;?\s*\}?\s*;\s*\n\s*const site/);
  const collect = src.slice(src.indexOf('export function collectInPage'), src.indexOf('const scrollFn'));
  assert.match(collect, /const site = siteOf\(location\.hostname\)/);
  assert.equal((collect.match(/split\('\.'\)/g) || []).length, 0, 'brak drugiej logiki domeny w stronie');
  assert.match(src, /const expression = `\(\(\) => \{ const siteOf = \$\{siteOf\};/);
});

test('YouTube: brak okazji reklamowej = INCONCLUSIVE; seek A/B z kontrolą; Protection i bramka 30/30', () => {
  const play = (o = {}) => ({ player: true, video: true, progressS: 8, playing: true, adSeen: false, antiAdblock: false, seek: { ok: true }, shorts: { ok: true, progressS: 5 }, ...o });
  const by = (checks) => Object.fromEntries(checks.map((c) => [c.id, c.status]));
  const ok = by(classifyYouTube(play(), play({ protection: { status: 'ok', compat: '30/30', gate: true } })));
  assert.deepEqual(ok, { 'yt-player': 'PASS', 'yt-seek': 'PASS', 'yt-shorts': 'PASS', 'yt-ads': 'INCONCLUSIVE', 'yt-antiadblock': 'PASS', 'yt-protection': 'PASS' });
  assert.equal(by(classifyYouTube(play({ adSeen: true }), play()))['yt-ads'], 'PASS', 'reklama w kontroli, z Apex AdBlocker brak');
  assert.equal(by(classifyYouTube(play(), play({ adSeen: true })))['yt-ads'], 'REAL_AD');
  assert.equal(by(classifyYouTube(play({ seek: { ok: false } }), play({ seek: { ok: false } })))['yt-seek'], 'INCONCLUSIVE', 'seek zepsuty także bez rozszerzenia');
  assert.equal(by(classifyYouTube(play(), play({ seek: { ok: false } })))['yt-seek'], 'BREAKAGE');
  assert.equal(by(classifyYouTube(play(), play({ playing: false, progressS: 0 })))['yt-player'], 'BREAKAGE');
  assert.equal(by(classifyYouTube(play(), play({ antiAdblock: true })))['yt-antiadblock'], 'ANTI_ADBLOCK');
  assert.equal(by(classifyYouTube(play(), play({ protection: { status: 'warning', compat: '29/30', gate: false } })))['yt-protection'], 'MANUAL_REVIEW');
  assert.equal(classifyYouTube(play(), { skip: 'INCONCLUSIVE – CAPTCHA' })[0].status, 'INCONCLUSIVE');
});

test('podsumowanie i raporty: różnica none → Apex AdBlocker, zrzuty obok siebie, ręczna ocena, eksport JSON', () => {
  const rows = [
    { url: 'https://a.pl/', host: 'a.pl', category: 'x', knownCase: 'sprawdź baner', results: { none: m({ ads: ads({ REAL_AD: 4 }) }), apex: m({ ads: ads({ REAL_AD: 1 }), requests: { total: 50, blocked: 30, failed: 0, adHostRequests: 0, adHostLoaded: 0, adHosts: {} } }) } },
    { url: 'https://b.pl/', host: 'b.pl', category: 'x', knownCase: null, results: { none: m({ ads: ads({ REAL_AD: 2 }), consent: { state: 'unresolved', clicked: [], reason: 'r' } }), apex: m() } },
    { url: 'https://c.pl/', host: 'c.pl', category: 'x', knownCase: null, results: { none: m({ challenge: 'captcha' }), apex: m({ challenge: 'captcha' }) } },
  ].map((r) => ({ ...r, verdict: classifySite(r.results.none, r.results.apex), diff: diffOf(r.results.none, r.results.apex) }));
  const s = summarize(rows);
  assert.equal(s.comparableSites, 2, 'strona bez porównywalnej zgody nie liczy się do reklam');
  assert.deepEqual(s.ads.REAL_AD, { none: 4, apex: 1 });
  assert.equal(s.realAdReductionPct, 75);
  assert.deepEqual([s.status.REAL_AD, s.status.CONSENT_INCONCLUSIVE, s.status.BOT_CHALLENGE, s.challenge.both], [1, 1, 1, 1]);
  assert.equal(s.blockedRequests, 30);
  const report = { startedAt: '2026-01-01T00:00:00.000Z', finishedAt: '2026-01-01T00:10:00.000Z', environment: { os: 'X', node: 'v20' }, extension: { version: '0.3.4', lists: ['ads', 'privacy', 'security'] }, sites: rows, youtube: null, summary: s, note: 'Wynik automatyczny to wskazówka.' };
  const txt = formatTxt(report);
  assert.match(txt, /REAL_AD 4 → 1/);
  assert.match(txt, /Redukcja REAL_AD: 75%/);
  assert.match(txt, /znany przypadek: sprawdź baner/);
  const html = formatHtml(report, '/tmp');
  for (const re of [/BEZ Apex AdBlocker/, /Z Apex AdBlocker/, /Eksportuj oceny/, /<select data-key="https:\/\/a\.pl\/">/, /Znany przypadek: sprawdź baner/, /localStorage/]) assert.match(html, re);
  assert.equal((html.match(/<section class="site/g) || []).length, 3);
  for (const st of Object.values(STATUS)) assert.match(html, new RegExp(`<option>${st}</option>`));
  assert.deepEqual(AD_CLASSES, ['REAL_AD', 'EMPTY_AD_SLOT', 'LABEL_ONLY', 'SITE_PROMO', 'UNKNOWN']);
});

test('tester nie dotyka produktu: brak zmian zachowania, osobny plik', () => {
  const src = fs.readFileSync(path.join(ROOT, 'tests/local/single-blocker-sites.mjs'), 'utf8');
  assert.doesNotMatch(src, /options:set|chrome\.storage\.local\.set|disabledSites|userFilters/, 'tester nie zmienia ustawień rozszerzenia');
  assert.doesNotMatch(src, /protectionMode|basic|balanced|strict/i, 'bez trybów');
});

test('uruchomienie: test-sites.cmd → test-apex-adblocker.cmd --sites, npm run test:sites', () => {
  const cmd = fs.readFileSync(path.join(ROOT, 'test-apex-adblocker.cmd'), 'utf8');
  assert.match(cmd, /if \/i "%~1"=="--sites" set "SCRIPT=tests\\local\\single-blocker-sites\.mjs"/);
  assert.match(cmd, /sites\\latest\.html/);
  const sites = fs.readFileSync(path.join(ROOT, 'test-sites.cmd'), 'utf8');
  assert.match(sites, /\r\n/, 'CRLF');
  assert.match(sites, /call "%~dp0test-apex-adblocker\.cmd" --sites %\*/);
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['test:sites'], 'node tests/local/single-blocker-sites.mjs');
  assert.doesNotMatch(pkg.scripts.test, /sites/);
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
// skrypt blokowany bez zastępnika (adsbygoogle.js/gpt.js Apex AdBlocker podmienia na neutralny surrogate → onload, nie onerror)
const AD_JS = 'https://static.criteo.net/js/ld/publishertag.js';
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

const CMP = (buttons) => `<div id="cookie-consent" style="position:fixed;inset:auto 0 0 0;height:260px;background:#fff;border-top:2px solid #000;z-index:99;padding:20px">
<p>Ta strona używa plików cookie i przetwarza Twoje dane w celach reklamowych. Zgoda RODO.</p>${buttons}</div>
<script>window.__accept = () => { fetch('/__accepted'); document.getElementById('cookie-consent').remove(); };
window.__reject = () => document.getElementById('cookie-consent').remove();</script>`;

// dwuetapowy CMP: ekran 1 → (ustawienia) → ekran 2 w tym samym kontenerze
const CMP2 = (first, second) => `${CMP(first)}<script>window.__settings = () => { document.getElementById('cookie-consent').innerHTML = ${JSON.stringify(`<p>Ustawienia prywatności i plików cookie. Wybierz cele przetwarzania danych.</p>${second}`)}; };</script>`;

// 2 linki menu do własnej strony + 3 do obcej domeny; kafelek promo do własnej subdomeny i do obcej domeny (krótki tekst → klasa zależy tylko od „tej samej strony”)
const tile = (href) => `<div class="tile-k" style="width:320px;margin:10px"><span>Materiał partnera</span><a href="${href}"><img src="/img/promo.png" width="300" height="160" alt=""></a></div>`;
const multiSuffix = (foreign, own) => `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Atrapa</title></head><body style="margin:0;font:16px sans-serif">
<header><nav><a href="/kraj">Kraj</a> <a href="/swiat">Świat</a> <a href="${foreign}/a">Partner A</a> <a href="${foreign}/b">Partner B</a> <a href="${foreign}/c">Partner C</a></nav></header>
<main>${ARTICLE}${tile(`${own}/promocja`)}${tile(`${foreign}/oferta`)}</main></body></html>`;

const PHOTOS = Array.from({ length: 4 }, (_, i) => `<figure><img src="/img/foto-${i}.png" width="600" height="340" alt=""><figcaption>Zdjęcie ${i + 1} z wydarzenia</figcaption></figure>`).join('');

const FIXTURES = {
  // reklama: obrazek z hosta reklamowego w kontenerze z etykietą, w żadnym znanym selektorze kosmetycznym
  'ad.cb-fixture.pl': page(`${ARTICLE}<div class="box-x7" style="width:300px;margin:20px"><span>Reklama</span><a href="https://advertiser.example/"><img src="${AD_IMG}" width="300" height="250" alt=""></a></div>`),
  // reklama w iframe (zablokowana przez Apex AdBlocker → slot pusty albo ukryty)
  'frame.cb-fixture.pl': page(`${ARTICLE}<div id="div-gpt-ad-1" style="width:300px;height:250px"><iframe src="${AD_FRAME}" width="300" height="250" style="border:0"></iframe></div>`),
  // pusty slot z etykietą w obu konfiguracjach
  // etykieta „REKLAMA” luzem w <main> z dużą ilością zwykłych zdjęć (Fakt.pl) – main nie jest slotem
  'mainlabel.cb-fixture.pl': page(`${ARTICLE}${PHOTOS}<small>REKLAMA</small>${PHOTOS}${ARTICLE}`),
  // to samo w wysokim wrapperze treści (nie main) – strażnik wysokości
  'wraplabel.cb-fixture.pl': page(`<div class="content-wrap">${ARTICLE}${PHOTOS}<small>REKLAMA</small>${PHOTOS}</div>`),
  // kontrola: prawdziwe sloty nadal REAL_AD (selektor .ad-container; etykieta + billboard 970×250 i halfpage 300×600)
  'adcontainer.cb-fixture.pl': page(`${ARTICLE}<div class="ad-container" style="width:300px"><span>REKLAMA</span><img src="/img/ad-local.png" width="300" height="250" alt=""></div>`),
  'bigslots.cb-fixture.pl': page(`${ARTICLE}<div class="box-bb" style="width:970px"><small>REKLAMA</small><img src="/img/bb.png" width="970" height="250" alt=""></div>
<div class="box-hp" style="width:300px"><small>REKLAMA</small><img src="/img/hp.png" width="300" height="600" alt=""></div>`),
  'empty.cb-fixture.pl': page(`${ARTICLE}<div class="box-q2" style="width:320px;height:260px;border:1px solid #ccc"><small>REKLAMA</small></div>`),
  // materiał promocyjny strony (link do tej samej domeny)
  'promo.cb-fixture.pl': page(`${ARTICLE}<div class="tile-k" style="width:320px"><span>Materiał partnera</span><a href="/promocja/abc"><img src="/img/promo.png" width="300" height="160" alt=""></a><p>Nowa oferta w naszym serwisie</p></div>`),
  // CMP z odrzuceniem (akceptacji nigdy nie klikamy)
  'cmp.cb-fixture.pl': page(`${ARTICLE}${CMP('<button onclick="__accept()">Akceptuj wszystko</button> <button onclick="__reject()">Odrzuć wszystko</button>')}`),
  // CMP tylko z akceptacją → CONSENT_INCONCLUSIVE
  'cmpaccept.cb-fixture.pl': page(`${ARTICLE}${CMP('<button onclick="__accept()">Akceptuj i przejdź do serwisu</button>')}`),
  // A: własny tekst odrzucenia (WP, o2)
  'cmpcustom.cb-fixture.pl': page(`${ARTICLE}${CMP('<button onclick="__accept()">Akceptuję i przechodzę do serwisu</button> <button onclick="__reject()">Odrzucam i chcę dowiedzieć się więcej</button>')}`),
  // B: ustawienia → odrzuć wszystko (Onet, Gazeta, RMF24)
  'cmptwostep.cb-fixture.pl': page(`${ARTICLE}${CMP2('<button onclick="__accept()">Akceptuję</button> <button onclick="__settings()">Ustawienia zaawansowane</button>',
    '<button onclick="__accept()">Akceptuję wszystko</button> <button onclick="__reject()">Odrzuć wszystko</button>')}`),
  // C: ustawienia bez bezpiecznego odrzucenia (tylko suwaki + akceptacja)
  'cmpnoreject.cb-fixture.pl': page(`${ARTICLE}${CMP2('<button onclick="__accept()">Akceptuję</button> <button onclick="__settings()">Ustawienia prywatności</button>',
    '<label><input type="checkbox"> Personalizacja</label> <label><input type="checkbox"> Pomiar</label> <button onclick="__accept()">Akceptuję</button>')}`),
  // D: przycisk „Ustawienia prywatności” strony POZA banerem zgody
  'cmpoutside.cb-fixture.pl': page(`${ARTICLE}<section><button onclick="fetch('/__outside')">Ustawienia prywatności</button></section>${CMP('<button onclick="__accept()">Akceptuję</button>')}`),
  // anti-adblock: komunikat, gdy skrypt reklamowy się nie wczyta
  'anti.cb-fixture.pl': page(`${ARTICLE}<div id="msg"></div><script>const s = document.createElement('script'); s.src = '${AD_JS}';
s.onerror = () => { document.getElementById('msg').innerHTML = '<div style="padding:20px;border:2px solid red">Wykryliśmy AdBlock. Wyłącz blokadę reklam, aby czytać dalej.</div>'; };
document.head.appendChild(s);</script>`),
  // pusta strona: aplikacja renderowana dopiero po wczytaniu skryptu z hosta reklamowego
  'blank.cb-fixture.pl': `<!doctype html><html><head><meta charset="utf-8"><title>App</title></head><body><div id="app"></div><script>const s = document.createElement('script'); s.src = '${AD_JS}';
s.onload = () => { document.getElementById('app').innerHTML = ${JSON.stringify(NAV + '<main>' + ARTICLE + '</main>')}; };
document.head.appendChild(s);</script></body></html>`,
  // sufiks com.pl / co.uk: menu i kafelki „Materiał partnera” do tej samej i do OBCEJ domeny z tym samym sufiksem
  'www.businessinsider.com.pl': multiSuffix('https://partner.com.pl', 'https://www.businessinsider.com.pl'),
  'www.dailymail.co.uk': multiSuffix('https://example.co.uk', 'https://news.dailymail.co.uk'),
  // challenge w obu konfiguracjach (jak Allegro)
  'challenge.cb-fixture.pl': '<!doctype html><html><head><meta charset="utf-8"><title>Just a moment...</title></head><body><h1>Verify you are human</h1><p>Potwierdź, że nie jesteś robotem.</p></body></html>',
  // challenge tylko z Apex AdBlocker (jak Forbes): pojawia się, gdy skrypt z hosta reklamowego się nie wczyta
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
    if (u.pathname === '/__outside') { hits.outside.push(u.hostname); return route.fulfill({ status: 204, body: '' }); }
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

test('atrapy stron w Chromium (bez internetu): none vs Apex AdBlocker, consent, statusy, raport i zrzuty', { skip, timeout: 600_000 }, async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-sites-fixture-'));
  try {
    const hosts = [...Object.keys(FIXTURES), 'error.cb-fixture.pl'];
    const sitesFile = path.join(tmp, 'sites.json');
    fs.writeFileSync(sitesFile, JSON.stringify({ categories: { atrapy: hosts.map((h) => `https://${h}/`) }, knownCases: { 'cbchallenge.cb-fixture.pl': 'challenge tylko z Apex AdBlocker – sprawdź powtarzalność' } }));
    const hits = { accepted: [], outside: [] };
    const { report, outDir } = await runSitesTest({
      sitesFile, resultsDir: path.join(tmp, 'results'), headless: true, screenshots: true, youtube: false, settleMs: 300, limit: 0, only: [],
      onContext: (ctx) => installFixtures(ctx, hits), log: () => {},
    });
    const by = Object.fromEntries(report.sites.map((r) => [r.host.split('.')[0], r]));
    const byHost = Object.fromEntries(report.sites.map((r) => [r.host, r]));
    const st = (k) => by[k].verdict.status;
    const res = (k, c) => by[k].results[c];
    const dump = (k) => JSON.stringify({ verdict: by[k].verdict, none: res(k, 'none').ads?.counts, cb: res(k, 'apex').ads?.counts, consent: [res(k, 'none').consent, res(k, 'apex').consent] });

    assert.deepEqual(report.extension.lists, ['ads', 'privacy', 'security']);
    // reklama: widoczna bez rozszerzenia, Apex AdBlocker blokuje host reklamowy
    assert.ok(res('ad', 'none').ads.counts.REAL_AD >= 1, dump('ad'));
    assert.ok(res('ad', 'apex').requests.blocked >= 1, dump('ad'));
    assert.ok(res('ad', 'none').requests.adHostLoaded >= 1);
    assert.ok(by.ad.diff.ads.REAL_AD.apex < by.ad.diff.ads.REAL_AD.none, dump('ad'));
    assert.ok(res('frame', 'none').ads.counts.REAL_AD >= 1, dump('frame'));
    assert.equal(res('frame', 'apex').ads.counts.REAL_AD, 0, dump('frame'));
    // pusty slot (w obu) i materiał promocyjny strony
    assert.equal(st('empty'), STATUS.EMPTY_AD_SLOT, dump('empty'));
    assert.equal(res('empty', 'none').ads.counts.EMPTY_AD_SLOT, 1);
    assert.equal(res('promo', 'apex').ads.counts.SITE_PROMO, 1, dump('promo'));
    // etykieta w <main>/wysokim wrapperze: nie REAL_AD, najwyżej LABEL_ONLY; zwykłe zdjęcia nie zmieniają wyniku
    for (const k of ['mainlabel', 'wraplabel']) {
      for (const c of CONFIGS) {
        const a = res(k, c).ads.counts;
        assert.deepEqual([a.REAL_AD, a.EMPTY_AD_SLOT, a.UNKNOWN, a.LABEL_ONLY], [0, 0, 0, 1], `${k} ${c}: ${dump(k)}`);
        assert.ok(!res(k, c).ads.samples.REAL_AD.some((x) => /^main\b/.test(x)));
      }
      assert.equal(st(k), STATUS.PASS, dump(k));
    }
    // kontrola: prawdziwy .ad-container z etykietą i obrazem = REAL_AD (bez rozszerzenia; Apex AdBlocker ukrywa .ad-container)
    assert.equal(res('adcontainer', 'none').ads.counts.REAL_AD, 1, dump('adcontainer'));
    assert.match(res('adcontainer', 'none').ads.samples.REAL_AD[0], /^div\.ad-container 300x\d+ „REKLAMA”/);
    // billboard i halfpage z etykietą (bez selektora, lokalne obrazy) nadal REAL_AD w obu konfiguracjach
    for (const c of CONFIGS) assert.equal(res('bigslots', c).ads.counts.REAL_AD, 2, `${c}: ${dump('bigslots')}`);
    assert.equal(st('promo'), STATUS.PASS, dump('promo'));
    // com.pl / co.uk: obca domena z tym samym sufiksem nie jest własna (menu i SITE_PROMO)
    for (const [host, own] of [['www.businessinsider.com.pl', 'businessinsider.com.pl'], ['www.dailymail.co.uk', 'dailymail.co.uk']]) {
      for (const c of CONFIGS) {
        const r = byHost[host].results[c];
        assert.equal(r.menuLinks, 2, `${host} ${c}: tylko 2 linki menu do własnej strony`);
        assert.equal(siteOf(new URL(r.navHref).hostname), own, `${host} ${c}: link nawigacji z własnej strony`);
        assert.equal(r.ads.counts.SITE_PROMO, 1, `${host} ${c}: ${JSON.stringify(r.ads)}`);
        assert.equal(r.ads.counts.UNKNOWN, 1, `${host} ${c}: kafelek do obcej domeny nie jest promocją strony`);
      }
    }
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
    // A/B/C/D – ta sama sekwencja w obu konfiguracjach
    for (const c of CONFIGS) {
      const a = res('cmpcustom', c).consent;
      assert.deepEqual([a.state, a.clicked], [CONSENT_STATES.REJECTED, ['Odrzucam i chcę dowiedzieć się więcej']], `A ${c}: ${JSON.stringify(a)}`);
      const b = res('cmptwostep', c).consent;
      assert.deepEqual([b.state, b.clicked], [CONSENT_STATES.REJECTED, ['Ustawienia zaawansowane', 'Odrzuć wszystko']], `B ${c}: ${JSON.stringify(b)}`);
      const cc = res('cmpnoreject', c).consent;
      assert.deepEqual([cc.state, cc.clicked], [CONSENT_STATES.UNRESOLVED, ['Ustawienia prywatności']], `C ${c}: ${JSON.stringify(cc)}`);
      assert.equal(cc.reason, 'po otwarciu ustawień brak bezpiecznego odrzucenia');
      assert.deepEqual(cc.diagnostics.visibleActions, ['Akceptuję']);
      assert.deepEqual([cc.diagnostics.directReject, cc.diagnostics.settingsStep, cc.diagnostics.frame], [false, true, 'main']);
      assert.deepEqual(cc.diagnostics.steps, [{ kind: 'settings', text: 'Ustawienia prywatności', frame: 'main' }]);
      const d = res('cmpoutside', c).consent;
      assert.deepEqual([d.state, d.clicked], [CONSENT_STATES.UNRESOLVED, []], `D ${c}: ${JSON.stringify(d)}`);
      assert.match(d.reason, /tylko przycisk akceptacji/);
      assert.deepEqual(d.diagnostics.visibleActions, ['Akceptuję'], 'przycisk poza CMP nie jest akcją CMP');
    }
    assert.deepEqual([st('cmpcustom'), st('cmptwostep'), st('cmpnoreject'), st('cmpoutside')], [STATUS.PASS, STATUS.PASS, STATUS.CONSENT_INCONCLUSIVE, STATUS.CONSENT_INCONCLUSIVE]);
    assert.deepEqual(hits.accepted, [], 'nigdy nie kliknięto akceptacji');
    assert.deepEqual(hits.outside, [], 'przycisk ustawień poza CMP nie został kliknięty');
    // anti-adblock tylko z Apex AdBlocker
    assert.equal(st('anti'), STATUS.ANTI_ADBLOCK, dump('anti'));
    assert.equal(res('anti', 'none').antiAdblock, '');
    // pusta strona tylko z Apex AdBlocker
    assert.equal(st('blank'), STATUS.BREAKAGE, dump('blank'));
    assert.match(by.blank.verdict.reasons.join(), /pusta strona/);
    // challenge: w obu (nie obwiniamy) i tylko z Apex AdBlocker (do ręcznej weryfikacji)
    assert.deepEqual([st('challenge'), by.challenge.verdict.scope], [STATUS.BOT_CHALLENGE, 'both']);
    assert.deepEqual([st('cbchallenge'), by.cbchallenge.verdict.scope], [STATUS.BOT_CHALLENGE, 'apex']);
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
    assert.match(html, /BEZ Apex AdBlocker[\s\S]*Z Apex AdBlocker/);
    const shots = [...html.matchAll(/<img src="([^"]+)"/g)].map((x) => x[1]);
    assert.equal(shots.length, hosts.length * 2 - 0, 'zrzut none i apex dla każdej strony');
    for (const s of shots) assert.ok(fs.existsSync(path.join(outDir, s)), s);
    const sizes = new Set(shots.map((s) => { const b = fs.readFileSync(path.join(outDir, s)); for (let i = 2; i < b.length;) { const len = b.readUInt16BE(i + 2); if (b[i + 1] >= 0xc0 && b[i + 1] <= 0xc2) return `${b.readUInt16BE(i + 7)}x${b.readUInt16BE(i + 5)}`; i += 2 + len; } return '?'; }));
    assert.deepEqual([...sizes], ['1366x800']);
    const json = JSON.parse(fs.readFileSync(path.join(outDir, 'latest.json'), 'utf8'));
    assert.equal(json.kind, 'apex-single-blocker-sites');
    assert.equal(json.sites.length, hosts.length);
    assert.match(fs.readFileSync(path.join(outDir, 'latest.txt'), 'utf8'), /bez → z/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
