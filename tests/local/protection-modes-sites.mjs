#!/usr/bin/env node
// HISTORYCZNE NARZĘDZIE – nie rozwijamy go. Apex AdBlocker 1.0 nie ma trybów ochrony (stały zestaw
// list: shared/core-lists.js), więc ten tester nie działa z obecnym produktem. Ostatnia wersja, z
// którą działał: gałąź legacy/protection-modes-tester (commit 0e3fe92). Wyniki z tej wersji posłużyły
// do decyzji o jednym stałym zestawie list. Zostaje tylko jako dokumentacja metody.
//
// (opis historyczny)
// Apex AdBlocker – porównanie trybów ochrony na prawdziwych stronach (lokalnie, Windows/Chrome).
//
//   test-apex-adblocker.cmd --modes            (Windows, dwuklik: test-protection-modes.cmd)
//   npm run test:local -- --modes           (repozytorium)
//
// Dla każdej konfiguracji (bez rozszerzenia = kontrola, Basic, Balanced, Strict) uruchamia Playwright
// Chromium w JEDNORAZOWYM profilu i odwiedza strony z sites-protection-modes.json. Zbiera tylko
// sygnały automatyczne (bez udawania człowieka): ładowanie strony, ilość treści, błędy JS, nieudane
// i zablokowane żądania (net::ERR_BLOCKED_BY_CLIENT), widoczne elementy o typowych selektorach
// reklamowych, etykiety „Reklama/Sponsorowane”, nakładki (cookies, anti-adblock, inne), menu,
// wyszukiwarkę (wpisanie tekstu bez wysłania), jeden link z menu, wejście do logowania, wideo.
// YouTube: osobny test odtwarzacza i YouTube Protection (status + bramka zgodności).
//
// Wynik automatyczny to podejrzenie, NIE werdykt: „OK (automatycznie)”, „reklama?”, „breakage?”,
// „anti-adblock?”, „wymaga ręcznego sprawdzenia”. Raport HTML ma pola do ręcznej oceny
// (PASS / reklama pozostała / breakage / anti-adblock / wymaga ręcznego sprawdzenia) i eksport ocen.
//
// Opcje:
//   --configs none,basic,balanced,strict  które konfiguracje (domyślnie wszystkie)
//   --limit N        tylko N pierwszych stron        --only host[,host]  tylko wybrane hosty
//   --sites plik     inna lista stron (JSON jak sites-protection-modes.json)
//   --no-youtube     bez testu YouTube               --no-screenshots    bez zrzutów
//   --headless       bez okna (domyślnie z oknem na Windows/macOS)
//   --dir / --results jak w apex-local-test.mjs
// Wyniki: <results>/modes/latest.json, latest.txt, latest.html, shots/ (lokalnie, nie commitujemy).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlaywright, EXTENSION_ENTRIES } from '../../tools/chromium-smoke.mjs';
import { ensurePlaying, samplePlayer } from '../e2e/lib/youtube-page.mjs';
import { progressOf } from '../e2e/lib/classify.mjs';
import { RESULTS_DIR, browserArgs, openYouTube, networkErrorOf } from './apex-local-test.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..');
export const SITES_FILE = path.join(HERE, 'sites-protection-modes.json');
export const CONFIGS = Object.freeze(['none', 'basic', 'balanced', 'strict']);
export const CONFIG_LABEL = Object.freeze({ none: 'Bez rozszerzenia', basic: 'Basic', balanced: 'Balanced', strict: 'Strict' });
export const MANUAL_VERDICTS = Object.freeze(['PASS', 'reklama pozostała', 'breakage', 'anti-adblock', 'wymaga ręcznego sprawdzenia']);
export const AUTO = Object.freeze({ OK: 'OK (automatycznie)', AD: 'reklama?', BREAK: 'breakage?', ANTI: 'anti-adblock?', MANUAL: 'wymaga ręcznego sprawdzenia' });
const SETTLE_MS = 4000;

// ---------------------------------------------------------------------------------------------
// Czysta logika (testy: tests/tools/protection-modes-sites.test.mjs)

export function parseModesArgs(argv) {
  const o = {
    configs: [...CONFIGS], limit: 0, only: [], sitesFile: SITES_FILE, youtube: true, screenshots: true,
    headless: process.platform === 'linux' && !process.env.DISPLAY, extensionDir: null, resultsDir: RESULTS_DIR,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--modes') continue;
    if (a === '--configs') {
      o.configs = String(argv[++i] || '').split(',').map((s) => s.trim()).filter(Boolean);
      const bad = o.configs.filter((c) => !CONFIGS.includes(c));
      if (bad.length || !o.configs.length) throw new Error(`nieznana konfiguracja: ${bad.join(', ') || '(pusta)'} (dostępne: ${CONFIGS.join(', ')})`);
    } else if (a === '--limit') o.limit = Math.max(0, parseInt(argv[++i], 10) || 0);
    else if (a === '--only') o.only = String(argv[++i] || '').split(',').map((s) => s.trim().toLowerCase().replace(/^www\./, '')).filter(Boolean);
    else if (a === '--sites') o.sitesFile = path.resolve(argv[++i]);
    else if (a === '--no-youtube') o.youtube = false;
    else if (a === '--no-screenshots') o.screenshots = false;
    else if (a === '--headless') o.headless = true;
    else if (a === '--headed') o.headless = false;
    else if (a === '--dir') o.extensionDir = path.resolve(argv[++i]);
    else if (a === '--results') o.resultsDir = path.resolve(argv[++i]);
  }
  return o;
}

export const hostOf = (url) => { try { return new URL(url).hostname.toLowerCase(); } catch { return ''; } };
const bareHost = (url) => hostOf(url).replace(/^www\./, '');

/** Lista stron z pliku: [{url, host, category}], z filtrami --only / --limit. */
export function loadSites(file = SITES_FILE, { only = [], limit = 0 } = {}) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let sites = Object.entries(data.categories || {}).flatMap(([category, urls]) => urls.map((url) => ({ url, host: hostOf(url), category })));
  if (only.length) sites = sites.filter((s) => only.includes(bareHost(s.url)));
  if (limit) sites = sites.slice(0, limit);
  return { sites, youtube: data.youtube || null };
}

/** Domena „rejestrowalna” (przybliżenie bez listy sufiksów) – do rozróżnienia żądań 3rd-party. */
export function siteOf(host) {
  const parts = String(host).split('.');
  const two = ['com.pl', 'net.pl', 'org.pl', 'co.uk', 'com.au', 'co.jp'];
  return parts.length > 2 && two.includes(parts.slice(-2).join('.')) ? parts.slice(-3).join('.') : parts.slice(-2).join('.');
}

export const ANTI_ADBLOCK_RE = /ad ?block|adblock|blokad\w* reklam|bloker\w* reklam|blokujesz reklam|wyłącz\w* (?:bloker|blokad|adblock)|dodaj\w* (?:nas |stronę |serwis )?do (?:wyjątków|białej listy)|whitelist|ad blocker|disable your ad|turn off your ad|reklamy pozwalają nam|wykryli\w* .{0,30}blok/i;
export const CMP_RE = /cookie|ciasteczk|zgod[ay]|prywatno|RODO|consent|partner(?:zy|ów)|przetwarzani\w* danych/i;

/**
 * Automatyczna ocena strony w trybie względem kontroli (bez rozszerzenia). Zwraca podejrzenie,
 * nie werdykt: breakage? > anti-adblock? > reklama? > OK (automatycznie); brak danych → ręcznie.
 */
export function classifySite(m, control = null) {
  const reasons = [];
  if (!m || m.error) {
    const ctrlOk = control && !control.error;
    return { auto: ctrlOk ? AUTO.BREAK : AUTO.MANUAL, reasons: [m && m.error ? `nie załadowała się: ${m.error}` : 'brak danych', ...(ctrlOk ? ['bez rozszerzenia ładuje się'] : [])] };
  }
  const c = control && !control.error ? control : null;
  const brk = [];
  if (m.textLength < 200) brk.push(`prawie brak treści (${m.textLength} znaków)`);
  if (c && c.textLength > 1000 && m.textLength < 0.3 * c.textLength) brk.push(`treści ${m.textLength} vs ${c.textLength} bez rozszerzenia`);
  if (c && c.mainContent && !m.mainContent) brk.push('zniknęła główna treść (main/article)');
  if (c && c.nav.ok === true && m.nav.ok === false) brk.push(`link z menu nie działa (${m.nav.error || m.nav.href})`);
  if (c && c.search.ok === true && m.search.ok === false) brk.push('wyszukiwarka nie przyjmuje tekstu');
  if (c && c.menuLinks >= 3 && m.menuLinks === 0) brk.push('zniknęło menu');
  if (m.pageErrors > (c ? c.pageErrors : 0) + 5) brk.push(`błędy JS: ${m.pageErrors}${c ? ` (bez rozszerzenia ${c.pageErrors})` : ''}`);
  if (m.overflowX && !(c && c.overflowX)) brk.push('rozjechany układ (poziome przewijanie)');
  if (m.scrollLocked && !(c && c.scrollLocked) && !m.overlays.cmp) brk.push('zablokowane przewijanie strony');
  if (brk.length) return { auto: AUTO.BREAK, reasons: brk };
  if (m.overlays.antiAdblock || m.antiAdblockText) {
    const inControl = c && (c.overlays.antiAdblock || c.antiAdblockText);
    if (!inControl) return { auto: AUTO.ANTI, reasons: [`komunikat anti-adblock${m.antiAdblockText ? `: „${m.antiAdblockText}”` : ''}`] };
    reasons.push('komunikat podobny do anti-adblock także bez rozszerzenia');
  }
  const ads = adScore(m);
  if (ads > 0) return { auto: AUTO.AD, reasons: [...reasons, `widoczne sygnały reklam: ${ads} (elementy ${m.ads.elements}, ramki ${m.ads.iframes}, etykiety ${m.ads.labels}, puste sloty ${m.ads.emptySlots})`] };
  return { auto: AUTO.OK, reasons: [...reasons, 'brak automatycznych sygnałów problemu – to nie jest gwarancja poprawności'] };
}

/** Liczba widocznych sygnałów reklam na stronie. */
export const adScore = (m) => (m && !m.error && m.ads ? m.ads.elements + m.ads.iframes + m.ads.labels : 0);

/** Podsumowanie konfiguracji (trybu) względem kontroli. */
export function summarizeConfig(rows, config) {
  const res = rows.map((r) => r.results[config]).filter(Boolean);
  const ok = res.filter((m) => !m.error);
  const sum = (f) => ok.reduce((n, m) => n + f(m), 0);
  const by = (label) => rows.filter((r) => r.results[config] && r.verdicts[config] && r.verdicts[config].auto === label).length;
  const ctrlAds = rows.reduce((n, r) => n + (r.results.none && config !== 'none' && !r.results[config]?.error ? adScore(r.results.none) : 0), 0);
  const modeAds = rows.reduce((n, r) => n + (r.results.none && config !== 'none' && !r.results[config]?.error ? adScore(r.results[config]) : 0), 0);
  return {
    config, sites: res.length, loaded: ok.length,
    blockedRequests: sum((m) => m.requests.blocked), requests: sum((m) => m.requests.total),
    adSignals: sum(adScore), sitesWithAds: ok.filter((m) => adScore(m) > 0).length,
    adSignalsReductionPct: config !== 'none' && ctrlAds > 0 ? Math.round(((ctrlAds - modeAds) / ctrlAds) * 1000) / 10 : null,
    cmpVisible: ok.filter((m) => m.overlays.cmp).length,
    otherOverlays: ok.filter((m) => m.overlays.other).length,
    pageErrors: sum((m) => m.pageErrors),
    auto: { ok: by(AUTO.OK), ad: by(AUTO.AD), breakage: by(AUTO.BREAK), antiAdblock: by(AUTO.ANTI), manual: by(AUTO.MANUAL) },
  };
}

// ---------------------------------------------------------------------------------------------
// Zbieranie danych w stronie (świat izolowany – odporny na podmienione eval/console strony)

/** Funkcja wykonywana w stronie. Tylko odczyt + znacznik data-cb-* dla pola wyszukiwania i linku. */
export function collectInPage() {
  const vw = innerWidth;
  const vh = innerHeight;
  const vis = (el) => {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05;
  };
  const big = (el, min = 30) => { const r = el.getBoundingClientRect(); return r.width >= min && r.height >= min; };
  const desc = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id.slice(0, 40) : ''}${[...el.classList].slice(0, 2).map((c) => '.' + c.slice(0, 30)).join('')}`;
  const AD_SEL = [
    'ins.adsbygoogle', '[id^="google_ads_iframe"]', '[id^="div-gpt-ad"]', '[data-google-query-id]', '[id*="gpt-ad"]',
    '[class*="adsbygoogle"]', '[data-ad-slot]', '[data-adunit]', '[data-ad-unit]', '[id^="adocean"]', '[id^="adoceangemius"]',
    '.adslot', '.ad-slot', '.ad-container', '.advertisement', '[class^="ad-banner"]', '[id^="ad-banner"]', '.sponsored-content',
    '[class*="teads"]', '[id^="taboola"]', '.trc_rbox_container', '[id^="outbrain"]', '.OUTBRAIN', '[class*="dfp-"]', '[id*="_dfp_"]',
  ];
  const AD_HOST = /doubleclick\.net|googlesyndication|googleadservices|adnxs|criteo|rtbhouse|adform|smartadserver|teads|taboola|outbrain|adocean|gemius\.pl\/(?!gstream)|amazon-adsystem|pubmatic|rubiconproject|openx|yieldbird|onetads|ocdn\.eu\/ads|adservice|ads\.|\/ads\//i;
  const LABEL_RE = /^(reklama|reklamy|sponsorowane|sponsorowany|materiał sponsorowany|materiał promocyjny|materiał partnera|advertisement|sponsored|ad|anzeige|publicidad)\s*[:·•|]?$/i;
  const seen = new Set();
  const adEls = [];
  for (const sel of AD_SEL) {
    let list = [];
    try { list = document.querySelectorAll(sel); } catch { continue; }
    for (const el of list) {
      if (seen.has(el) || !vis(el) || !big(el)) continue;
      if ([...seen].some((s) => s.contains(el) || el.contains(s))) { seen.add(el); continue; }
      seen.add(el);
      adEls.push(desc(el));
    }
  }
  const adFrames = [...document.querySelectorAll('iframe')].filter((f) => vis(f) && big(f, 50) && AD_HOST.test(f.src || '')).map((f) => { try { return new URL(f.src).hostname; } catch { return '?'; } });
  let labels = 0;
  let emptySlots = 0;
  for (const el of document.body ? document.body.querySelectorAll('*') : []) {
    if (el.children.length > 2) continue;
    const t = (el.innerText || '').trim();
    if (!t || t.length > 30 || !LABEL_RE.test(t) || !vis(el)) continue;
    if ([...el.children].some((ch) => (ch.innerText || '').trim() === t)) continue;
    if (el.closest('footer, [role="contentinfo"], nav, [role="navigation"]')) continue;
    labels++;
    let c = el.parentElement;
    for (let i = 0; c && c !== document.body && i < 4; i++, c = c.parentElement) { const r = c.getBoundingClientRect(); if (r.width >= 120 && r.height >= 60) break; }
    if (c && c !== document.body && !c.querySelector('img,iframe,video,canvas,picture') && (c.innerText || '').trim().length - t.length < 5) emptySlots++;
  }
  // nakładki: stałe/przyklejone, duże, nad treścią
  const overlays = { cmp: false, antiAdblock: false, other: false, samples: [] };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    const area = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    if (area < 0.25 * vw * vh && !(r.width > 0.8 * vw && r.height > 0.15 * vh)) continue;
    if (el.closest('header') && r.top <= 0 && r.height < 0.3 * vh) continue;
    const t = (el.innerText || '').replace(/\s+/g, ' ').slice(0, 400);
    const kind = /ad ?block|adblock|blokad\w* reklam|bloker\w* reklam|blokujesz reklam|wyłącz\w* (?:bloker|blokad|adblock)|whitelist|disable your ad|turn off your ad/i.test(t) ? 'antiAdblock'
      : /cookie|ciasteczk|zgod[ay]|prywatno|RODO|consent|przetwarzani\w* danych/i.test(t) ? 'cmp' : 'other';
    overlays[kind] = true;
    if (overlays.samples.length < 3) overlays.samples.push(`${kind}: ${desc(el)} ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  const bodyText = (document.body && document.body.innerText) || '';
  const anti = /ad ?block|blokad\w* reklam|bloker\w* reklam|blokujesz reklam|wyłącz\w* (?:bloker|blokad|adblock)|disable your ad ?block|turn off your ad ?block/i.exec(bodyText);
  const cs = getComputedStyle(document.documentElement);
  const bs = document.body ? getComputedStyle(document.body) : cs;
  // menu, link do sprawdzenia nawigacji, wyszukiwarka, logowanie
  const sameSite = (href) => { try { const u = new URL(href, location.href); const a = location.hostname.split('.').slice(-2).join('.'); return /^https?:$/.test(u.protocol) && u.hostname.endsWith(a) && u.pathname.length > 1 && u.href.split('#')[0] !== location.href.split('#')[0]; } catch { return false; } };
  const navAnchors = [...document.querySelectorAll('nav a[href], header a[href], [role="navigation"] a[href]')].filter((a) => vis(a) && sameSite(a.href));
  const pick = navAnchors.find((a) => !/zaloguj|logowanie|login|sign ?in|konto|account|koszyk|cart|subskryp|premium/i.test(a.innerText + a.href));
  document.querySelectorAll('[data-cb-nav],[data-cb-search]').forEach((e) => { e.removeAttribute('data-cb-nav'); e.removeAttribute('data-cb-search'); });
  if (pick) pick.setAttribute('data-cb-nav', '1');
  const search = [...document.querySelectorAll('input[type="search"], form[role="search"] input[type="text"], input[name="q"], input[name="query"], input[name="search"], input[name="s"], input[placeholder*="szukaj" i], input[placeholder*="search" i], input[aria-label*="szukaj" i], input[aria-label*="search" i]')]
    .find((i) => vis(i) && !i.disabled && !i.readOnly);
  if (search) search.setAttribute('data-cb-search', '1');
  const login = [...document.querySelectorAll('a, button')].some((e) => vis(e) && /^(zaloguj( się)?|logowanie|moje konto|log ?in|sign ?in|konto)$/i.test((e.innerText || e.getAttribute('aria-label') || '').trim()));
  const videos = [...document.querySelectorAll('video')].filter(vis);
  return {
    title: document.title.slice(0, 120), url: location.href, textLength: bodyText.length,
    mainContent: !!document.querySelector('main, article, [role="main"]') && bodyText.length > 500,
    overflowX: document.documentElement.scrollWidth > vw + 60,
    scrollLocked: [cs.overflow, cs.overflowY, bs.overflow, bs.overflowY].includes('hidden') && document.documentElement.scrollHeight > vh * 1.5,
    ads: { elements: adEls.length, iframes: adFrames.length, labels, emptySlots, samples: [...adEls.slice(0, 4), ...adFrames.slice(0, 3).map((h) => `iframe ${h}`)] },
    overlays,
    antiAdblockText: anti ? bodyText.slice(Math.max(0, anti.index - 40), anti.index + 60).replace(/\s+/g, ' ').trim() : '',
    menuLinks: navAnchors.length, navHref: pick ? pick.href : null, hasSearch: !!search, hasLogin: login,
    videos: videos.length, videosPlaying: videos.filter((v) => !v.paused && v.currentTime > 0).length,
  };
}

async function evalIsolated(page, fn, arg) {
  const cdp = await page.context().newCDPSession(page);
  try {
    const { frameTree } = await cdp.send('Page.getFrameTree');
    const { executionContextId } = await cdp.send('Page.createIsolatedWorld', { frameId: frameTree.frame.id, worldName: 'apex-modes' });
    const r = await cdp.send('Runtime.evaluate', { expression: `(${fn})(${arg === undefined ? '' : JSON.stringify(arg)})`, contextId: executionContextId, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
    return r.result.value;
  } finally { await cdp.detach().catch(() => {}); }
}

const scrollFn = () => new Promise((done) => {
  let y = 0;
  const step = () => { y += innerHeight * 0.8; scrollTo(0, y); if (y < Math.min(document.documentElement.scrollHeight, innerHeight * 6)) setTimeout(step, 250); else { setTimeout(() => { scrollTo(0, 0); done(true); }, 600); } };
  step();
});

// ---------------------------------------------------------------------------------------------
// Przebieg

async function visitSite(context, site, { shotPath = null } = {}) {
  const page = await context.newPage();
  const net = { total: 0, thirdParty: 0, blocked: 0, failed: 0 };
  let pageErrors = 0;
  const own = siteOf(site.host.replace(/^www\./, ''));
  page.on('request', (r) => { net.total++; if (siteOf(hostOf(r.url())) !== own) net.thirdParty++; });
  page.on('requestfailed', (r) => { const e = (r.failure() && r.failure().errorText) || ''; if (/ERR_BLOCKED_BY_CLIENT/.test(e)) net.blocked++; else net.failed++; });
  page.on('pageerror', () => { pageErrors++; });
  const out = { url: site.url };
  const t0 = Date.now();
  try {
    const resp = await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    out.status = resp ? resp.status() : null;
    await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(SETTLE_MS);
    await evalIsolated(page, scrollFn).catch(() => {});
    await page.waitForTimeout(1500);
    Object.assign(out, await evalIsolated(page, collectInPage));
    out.loadMs = Date.now() - t0;
    if (shotPath) await page.screenshot({ path: shotPath, type: 'jpeg', quality: 55 }).then(() => { out.screenshot = shotPath; }).catch(() => {});
    // wyszukiwarka: wpisanie tekstu bez wysyłania
    out.search = { present: out.hasSearch, ok: null };
    if (out.hasSearch) out.search.ok = await page.locator('[data-cb-search="1"]').first().fill('test', { timeout: 4000 }).then(() => true).catch(() => false);
    // jeden link z menu → czy strona docelowa się ładuje
    out.nav = { href: out.navHref, ok: null };
    if (out.navHref) {
      try {
        const r2 = await page.goto(out.navHref, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(1500);
        const len = await evalIsolated(page, () => (document.body && document.body.innerText.length) || 0).catch(() => 0);
        out.nav.ok = !!r2 && r2.status() < 400 && len > 200;
        if (!out.nav.ok) out.nav.error = `status ${r2 ? r2.status() : '?'}, treść ${len}`;
      } catch (e) { out.nav.ok = false; out.nav.error = String(e.message || e).split('\n')[0].slice(0, 120); }
    }
  } catch (e) {
    out.error = networkErrorOf(e) || String(e.message || e).split('\n')[0].slice(0, 160);
  } finally {
    out.requests = net;
    out.pageErrors = pageErrors;
    await page.close().catch(() => {});
  }
  return out;
}

async function youtubeCheck(context, url, { call = null } = {}) {
  const page = await context.newPage();
  const out = { url };
  try {
    const skip = await openYouTube(page, url, true);
    if (skip) { out.skip = skip; return out; }
    await ensurePlaying(page, 'watch');
    const samples = await samplePlayer(page, 'watch', 8);
    out.progressS = progressOf(samples);
    out.playing = out.progressS >= 3;
    const last = samples[samples.length - 1] || {};
    out.playerError = !!last.error;
    out.adShowing = samples.some((s) => s.adShowing || (s.adElements || []).length);
    out.antiAdblock = samples.some((s) => s.antiAdblock);
  } catch (e) {
    out.error = String(e.message || e).split('\n')[0].slice(0, 160);
  } finally { await page.close().catch(() => {}); }
  if (call) {
    const h = await call({ type: 'health:get' }).catch(() => null);
    const y = h && h.youtube;
    out.protection = y ? { status: y.status, compat: y.compat ? `${y.compat.supported}/${y.compat.total}` : '?', gatePass: !!(y.compat && y.compat.supported === y.compat.total && !(y.compat.newGaps || []).length) } : null;
  }
  return out;
}

function copyExtension(dest, sourceDir) {
  if (sourceDir) { fs.cpSync(sourceDir, dest, { recursive: true }); return; }
  for (const entry of EXTENSION_ENTRIES) {
    const src = path.join(ROOT, entry);
    if (fs.existsSync(src)) fs.cpSync(src, path.join(dest, entry), { recursive: true });
  }
}

/** Jedna konfiguracja: świeży profil, (rozszerzenie + tryb), wszystkie strony, YouTube. */
async function runConfig(chromium, config, { sites, youtube, opts, tmp, shotsDir, log }) {
  const ext = config === 'none' ? null : path.join(tmp, 'ext');
  if (ext && !fs.existsSync(ext)) { fs.mkdirSync(ext); copyExtension(ext, opts.extensionDir); }
  const context = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(tmp, `profile-${config}-`)), {
    headless: opts.headless, channel: 'chromium', viewport: { width: 1366, height: 800 }, locale: 'pl-PL', args: browserArgs(ext),
  });
  const info = { config, mode: null, startupMs: null, error: null };
  const results = {};
  let call = null;
  try {
    if (ext) {
      let [sw] = context.serviceWorkers();
      if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 60000 });
      const id = new URL(sw.url()).host;
      const opt = await context.newPage();
      await opt.goto(`chrome-extension://${id}/popup/popup.html`);
      call = (msg) => opt.evaluate((m) => chrome.runtime.sendMessage(m), msg);
      for (let i = 0; i < 300; i++) {
        const p = await sw.evaluate(() => chrome.storage.session.get('startupProfile').then((x) => x.startupProfile || null)).catch(() => null);
        if (p && p.totalMs != null) { info.startupMs = p.totalMs; break; }
        await new Promise((r) => setTimeout(r, 200));
      }
      const r = await call({ type: 'options:setProtectionMode', mode: config });
      if (!r || !r.ok) throw new Error(`nie udało się ustawić trybu ${config}: ${(r && r.error) || '?'}`);
      info.mode = (await call({ type: 'options:get' })).protectionMode;
      if (info.mode !== config) throw new Error(`tryb po ustawieniu: ${info.mode} (oczekiwano ${config})`);
      for (const p of context.pages()) if (/welcome\/welcome\.html/.test(p.url())) await p.close().catch(() => {});
    }
    for (const [i, site] of sites.entries()) {
      const shot = shotsDir ? path.join(shotsDir, `${String(i + 1).padStart(2, '0')}-${site.host.replace(/[^a-z0-9.-]/gi, '_')}-${config}.jpg`) : null;
      const t = Date.now();
      results[site.url] = await visitSite(context, site, { shotPath: shot });
      const m = results[site.url];
      log(`  [${CONFIG_LABEL[config]}] ${String(i + 1).padStart(2)}/${sites.length} ${site.host.padEnd(28)} ${m.error ? `BŁĄD: ${m.error}` : `treść ${m.textLength}, reklamy ${adScore(m)}, zablokowane ${m.requests.blocked}`} (${Math.round((Date.now() - t) / 1000)} s)`);
    }
    if (youtube && opts.youtube) {
      info.youtube = await youtubeCheck(context, youtube.watch, { call });
      log(`  [${CONFIG_LABEL[config]}] YouTube: ${info.youtube.skip || info.youtube.error || `odtwarzanie ${info.youtube.playing ? 'działa' : 'NIE startuje'} (+${info.youtube.progressS} s)`}${info.youtube.protection ? `; Protection ${info.youtube.protection.status}, zgodność ${info.youtube.protection.compat}` : ''}`);
    }
  } catch (e) {
    info.error = String(e.message || e).split('\n')[0];
    log(`  [${CONFIG_LABEL[config]}] przerwano: ${info.error}`);
  } finally {
    await context.close().catch(() => {});
  }
  return { info, results };
}

export async function runModesSites(opts) {
  const { log = console.log } = opts;
  const chromium = await loadPlaywright();
  const { sites, youtube } = loadSites(opts.sitesFile, opts);
  const outDir = path.join(opts.resultsDir, 'modes');
  const shotsDir = opts.screenshots ? path.join(outDir, 'shots') : null;
  fs.rmSync(path.join(outDir, 'shots'), { recursive: true, force: true });
  if (shotsDir) fs.mkdirSync(shotsDir, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-modes-'));
  const started = new Date();
  const configs = {};
  const raw = {};
  try {
    for (const config of opts.configs) {
      log(`\n${CONFIG_LABEL[config]} – ${sites.length} stron${opts.youtube && youtube ? ' + YouTube' : ''}…`);
      const r = await runConfig(chromium, config, { sites, youtube, opts, tmp, shotsDir, log });
      configs[config] = r.info;
      raw[config] = r.results;
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const rows = sites.map((s) => {
    const results = Object.fromEntries(opts.configs.map((c) => [c, raw[c] && raw[c][s.url]]).filter(([, v]) => v));
    const verdicts = Object.fromEntries(Object.entries(results).filter(([c]) => c !== 'none').map(([c, m]) => [c, classifySite(m, results.none)]));
    return { ...s, results, verdicts };
  });
  const report = {
    kind: 'apex-protection-modes-sites', version: 1,
    startedAt: started.toISOString(), finishedAt: new Date().toISOString(),
    environment: { os: `${os.type()} ${os.release()}`, node: process.version, headless: opts.headless },
    configs, sites: rows,
    summary: Object.fromEntries(opts.configs.map((c) => [c, summarizeConfig(rows, c)])),
    note: 'Wyniki automatyczne to podejrzenia, nie werdykt. Ostateczną ocenę wpisuje człowiek w latest.html.',
  };
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'latest.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'latest.txt'), formatTxt(report));
  fs.writeFileSync(path.join(outDir, 'latest.html'), formatHtml(report, outDir));
  return { report, outDir };
}

// ---------------------------------------------------------------------------------------------
// Raporty

export function formatTxt(r) {
  const L = [];
  const cfgs = Object.keys(r.summary);
  L.push('Apex AdBlocker – porównanie trybów ochrony na stronach', '='.repeat(64));
  L.push(`Start: ${r.startedAt} · koniec: ${r.finishedAt} · ${r.environment.os} · Node ${r.environment.node}`);
  L.push(r.note, '');
  L.push('Podsumowanie (automatycznie):');
  L.push(`  ${'Konfiguracja'.padEnd(18)} ${'strony'.padStart(7)} ${'zablok. żądania'.padStart(16)} ${'sygnały reklam'.padStart(15)} ${'redukcja'.padStart(9)} ${'OK'.padStart(4)} ${'reklama?'.padStart(9)} ${'breakage?'.padStart(10)} ${'anti-ab?'.padStart(9)} ${'ręcznie'.padStart(8)} ${'cookies'.padStart(8)} ${'inne nakł.'.padStart(11)}`);
  for (const c of cfgs) {
    const s = r.summary[c];
    L.push(`  ${CONFIG_LABEL[c].padEnd(18)} ${`${s.loaded}/${s.sites}`.padStart(7)} ${String(s.blockedRequests).padStart(16)} ${String(s.adSignals).padStart(15)} ${(s.adSignalsReductionPct === null ? '—' : `${String(s.adSignalsReductionPct).replace('.', ',')}%`).padStart(9)} ${(c === 'none' ? '—' : String(s.auto.ok)).padStart(4)} ${(c === 'none' ? '—' : String(s.auto.ad)).padStart(9)} ${(c === 'none' ? '—' : String(s.auto.breakage)).padStart(10)} ${(c === 'none' ? '—' : String(s.auto.antiAdblock)).padStart(9)} ${(c === 'none' ? '—' : String(s.auto.manual)).padStart(8)} ${String(s.cmpVisible).padStart(8)} ${String(s.otherOverlays).padStart(11)}`);
  }
  L.push('  (cookies = strony z widoczną nakładką zgody na cookies; redukcja = spadek sygnałów reklam względem przebiegu bez rozszerzenia)');
  L.push('', 'YouTube:');
  for (const c of cfgs) {
    const y = r.configs[c] && r.configs[c].youtube;
    if (!y) { L.push(`  ${CONFIG_LABEL[c].padEnd(18)} —`); continue; }
    L.push(`  ${CONFIG_LABEL[c].padEnd(18)} ${y.skip || y.error || `odtwarzanie ${y.playing ? 'działa' : 'NIE startuje'} (+${y.progressS} s), błąd playera: ${y.playerError ? 'tak' : 'nie'}, reklama w playerze: ${y.adShowing ? 'tak' : 'nie'}, anti-adblock: ${y.antiAdblock ? 'tak' : 'nie'}`}${y.protection ? `; YouTube Protection ${y.protection.status}, zgodność ${y.protection.compat}` : ''}`);
  }
  for (const c of cfgs) if (r.configs[c] && r.configs[c].error) L.push(`  ${CONFIG_LABEL[c]}: przerwano – ${r.configs[c].error}`);
  L.push('', 'Strony (automatycznie; szczegóły i ręczna ocena: latest.html):');
  for (const s of r.sites) {
    L.push(`- ${s.host} [${s.category}]`);
    for (const [c, m] of Object.entries(s.results)) {
      const v = s.verdicts[c];
      L.push(`    ${CONFIG_LABEL[c].padEnd(16)} ${m.error ? `BŁĄD: ${m.error}` : `treść ${m.textLength}, reklamy ${adScore(m)}, zablokowane ${m.requests.blocked}/${m.requests.total}, błędy JS ${m.pageErrors}, menu ${m.menuLinks}, link ${m.nav.ok === null ? '—' : m.nav.ok ? 'OK' : 'BŁĄD'}, szukaj ${m.search.ok === null ? '—' : m.search.ok ? 'OK' : 'BŁĄD'}, cookies ${m.overlays.cmp ? 'tak' : 'nie'}`}${v ? ` → ${v.auto}: ${v.reasons.join('; ')}` : ''}`);
    }
  }
  return L.join('\n') + '\n';
}

const esc = (s) => String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function formatHtml(r, outDir) {
  const cfgs = Object.keys(r.summary);
  const modeCfgs = cfgs.filter((c) => c !== 'none');
  const rel = (p) => (p ? path.relative(outDir, p).split(path.sep).join('/') : '');
  const cell = (s, c) => {
    const m = s.results[c];
    if (!m) return '<td class="na">—</td>';
    const v = s.verdicts[c];
    const cls = !v ? 'ctrl' : v.auto === AUTO.OK ? 'ok' : v.auto === AUTO.AD ? 'ad' : v.auto === AUTO.BREAK ? 'brk' : v.auto === AUTO.ANTI ? 'anti' : 'man';
    const facts = m.error ? `Błąd: ${esc(m.error)}` : `treść ${m.textLength} · reklamy ${adScore(m)} · zablok. ${m.requests.blocked} · JS ${m.pageErrors}${m.overlays.cmp ? ' · cookies' : ''}${m.overlays.other ? ' · nakładka' : ''}`;
    const sel = v ? `<select data-key="${esc(s.url)}|${c}"><option value="">ręczna ocena…</option>${MANUAL_VERDICTS.map((x) => `<option>${esc(x)}</option>`).join('')}</select>` : '';
    return `<td class="${cls}">${v ? `<b>${esc(v.auto)}</b><br><small>${esc(v.reasons.join('; '))}</small><br>` : '<b>kontrola</b><br>'}<small>${facts}</small>${m.screenshot ? `<br><a href="${esc(rel(m.screenshot))}" target="_blank">zrzut</a>` : ''}${sel ? `<br>${sel}` : ''}</td>`;
  };
  const sumRows = cfgs.map((c) => { const s = r.summary[c]; return `<tr><th>${CONFIG_LABEL[c]}</th><td>${s.loaded}/${s.sites}</td><td>${s.blockedRequests}</td><td>${s.adSignals}</td><td>${s.adSignalsReductionPct === null ? '—' : s.adSignalsReductionPct + '%'}</td><td>${c === 'none' ? '—' : s.auto.ok}</td><td>${c === 'none' ? '—' : s.auto.ad}</td><td>${c === 'none' ? '—' : s.auto.breakage}</td><td>${c === 'none' ? '—' : s.auto.antiAdblock}</td><td>${s.cmpVisible}</td></tr>`; }).join('');
  const ytRows = cfgs.map((c) => { const y = r.configs[c] && r.configs[c].youtube; return `<tr><th>${CONFIG_LABEL[c]}</th><td>${y ? esc(y.skip || y.error || `${y.playing ? 'odtwarzanie działa' : 'odtwarzanie NIE startuje'} (+${y.progressS} s); reklama w playerze: ${y.adShowing ? 'tak' : 'nie'}; anti-adblock: ${y.antiAdblock ? 'tak' : 'nie'}`) : '—'}</td><td>${y && y.protection ? esc(`${y.protection.status}, zgodność ${y.protection.compat}`) : '—'}</td></tr>`; }).join('');
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Apex AdBlocker – tryby ochrony</title>
<style>
:root{--bg:#fff;--fg:#1d1d22;--mut:#66666e;--line:#ddd;--ok:#e3f6e8;--ad:#fff4d6;--brk:#fde2e2;--anti:#efe3fd;--man:#eee}
@media (prefers-color-scheme:dark){:root{--bg:#17171b;--fg:#ececf1;--mut:#a0a0aa;--line:#33333a;--ok:#16351f;--ad:#3a3214;--brk:#3d1d1d;--anti:#2c2140;--man:#2a2a30}}
body{background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,sans-serif;margin:16px}h1{font-size:20px}h2{font-size:16px;margin-top:24px}
table{border-collapse:collapse;width:100%;margin:8px 0}th,td{border:1px solid var(--line);padding:6px;vertical-align:top;text-align:left}small{color:var(--mut)}
td.ok{background:var(--ok)}td.ad{background:var(--ad)}td.brk{background:var(--brk)}td.anti{background:var(--anti)}td.man{background:var(--man)}
.note{color:var(--mut)}button{font:inherit;padding:6px 12px;margin-right:8px}.wrap{overflow-x:auto}
</style></head><body>
<h1>Apex AdBlocker – porównanie trybów ochrony na stronach</h1>
<p class="note">${esc(r.startedAt)} – ${esc(r.finishedAt)} · ${esc(r.environment.os)}. ${esc(r.note)} Oceny zapisują się w tej przeglądarce; „Eksportuj oceny” zapisuje plik JSON.</p>
<h2>Podsumowanie (automatycznie)</h2>
<div class="wrap"><table><tr><th>Konfiguracja</th><th>Załadowane</th><th>Zablokowane żądania</th><th>Sygnały reklam</th><th>Redukcja vs bez rozszerzenia</th><th>OK (auto)</th><th>reklama?</th><th>breakage?</th><th>anti-adblock?</th><th>Nakładka cookies</th></tr>${sumRows}</table></div>
<h2>YouTube</h2><div class="wrap"><table><tr><th>Konfiguracja</th><th>Odtwarzacz</th><th>YouTube Protection</th></tr>${ytRows}</table></div>
<h2>Ręczna ocena – podsumowanie</h2><div id="manualSummary" class="wrap"></div>
<p><button id="export">Eksportuj oceny (JSON)</button><button id="clear">Wyczyść oceny</button></p>
<h2>Strony</h2>
<div class="wrap"><table><tr><th>Strona</th>${cfgs.map((c) => `<th>${CONFIG_LABEL[c]}</th>`).join('')}</tr>
${r.sites.map((s) => `<tr><th><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.host)}</a><br><small>${esc(s.category)}</small></th>${cfgs.map((c) => cell(s, c)).join('')}</tr>`).join('\n')}
</table></div>
<script>
const KEY = 'apex-modes-' + ${JSON.stringify(r.startedAt)};
const MODES = ${JSON.stringify(modeCfgs)};
const LABEL = ${JSON.stringify(CONFIG_LABEL)};
const VERDICTS = ${JSON.stringify(MANUAL_VERDICTS)};
let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { saved = {}; }
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} };
function renderSummary() {
  const head = '<tr><th>Tryb</th>' + VERDICTS.map((v) => '<th>' + v + '</th>').join('') + '<th>bez oceny</th></tr>';
  const rows = MODES.map((m) => {
    const sels = [...document.querySelectorAll('select[data-key$="|' + m + '"]')];
    const n = (v) => sels.filter((s) => s.value === v).length;
    return '<tr><th>' + LABEL[m] + '</th>' + VERDICTS.map((v) => '<td>' + n(v) + '</td>').join('') + '<td>' + n('') + '</td></tr>';
  }).join('');
  document.getElementById('manualSummary').innerHTML = '<table>' + head + rows + '</table>';
}
for (const s of document.querySelectorAll('select[data-key]')) {
  if (saved[s.dataset.key]) s.value = saved[s.dataset.key];
  s.addEventListener('change', () => { saved[s.dataset.key] = s.value; persist(); renderSummary(); });
}
renderSummary();
document.getElementById('export').addEventListener('click', () => {
  const data = { kind: 'apex-protection-modes-manual', run: ${JSON.stringify(r.startedAt)}, verdicts: saved };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'oceny-trybow.json';
  a.click();
});
document.getElementById('clear').addEventListener('click', () => { saved = {}; persist(); for (const s of document.querySelectorAll('select[data-key]')) s.value = ''; renderSummary(); });
</script></body></html>
`;
}

export const LEGACY_NOTICE = 'Tester trybów ochrony jest historyczny: Apex AdBlocker nie ma już trybów (stały zestaw list). '
  + 'Ostatnia działająca wersja: git switch legacy/protection-modes-tester';

export async function main(argv = process.argv.slice(2)) {
  if (!argv.includes('--legacy-force')) {
    console.log(LEGACY_NOTICE);
    return 2;
  }
  const opts = parseModesArgs(argv);
  if (opts.extensionDir && !fs.existsSync(path.join(opts.extensionDir, 'manifest.json'))) {
    console.log(`Brak manifest.json w ${opts.extensionDir}`);
    return 2;
  }
  console.log('Apex AdBlocker – porównanie trybów ochrony na prawdziwych stronach (tymczasowe profile, bez Twoich danych).');
  console.log(`Konfiguracje: ${opts.configs.map((c) => CONFIG_LABEL[c]).join(', ')}. To potrwa (ok. 15 s na stronę na konfigurację).`);
  const { report, outDir } = await runModesSites({ ...opts, log: console.log });
  console.log('\n' + formatTxt(report).split('\nStrony (automatycznie')[0]);
  console.log(`Raport: ${path.join(outDir, 'latest.html')} (ręczna ocena), latest.txt, latest.json`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().then((code) => { process.exitCode = code; }).catch((e) => { console.error(e); process.exitCode = 2; });
}
