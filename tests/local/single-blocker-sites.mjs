#!/usr/bin/env node
// Apex AdBlocker 1.0 – test JEDNEGO blockera na prawdziwych stronach (lokalnie, Windows/Chrome).
//
//   test-sites.cmd                     (Windows, dwuklik; skrót do: test-apex-adblocker.cmd --sites)
//   npm run test:local -- --sites      (repozytorium)
//
// Porównuje dwie konfiguracje, każda w jednorazowym profilu Playwright Chromium:
//   none        – bez rozszerzenia (kontrola),
//   apex – aktualny Apex AdBlocker (stały zestaw list).
// Każda strona jest otwierana w obu konfiguracjach zaraz po sobie (ten sam moment, podobna rotacja reklam).
//
// Consent/CMP: przed pomiarem w OBU konfiguracjach ta sama procedura – wykryj widoczny baner zgody
// i kliknij wyłącznie przycisk odrzucenia („Odrzuć wszystko”, „Tylko niezbędne”, „Reject all”…).
// Nigdy: akceptacji, logowania, subskrypcji, płatności, formularzy. Gdy nie da się odrzucić w którejś
// konfiguracji, strona dostaje CONSENT_INCONCLUSIVE i nie jest używana do porównania reklam.
// Baner zgody nie jest liczony jako reklama.
//
// Wynik automatyczny to WSKAZÓWKA (nie ręczna ocena): PASS, REAL_AD, EMPTY_AD_SLOT, BREAKAGE,
// ANTI_ADBLOCK, BOT_CHALLENGE, SITE_ERROR, CONSENT_INCONCLUSIVE, MANUAL_REVIEW. Reklamy są
// klasyfikowane osobno: REAL_AD, EMPTY_AD_SLOT, LABEL_ONLY, SITE_PROMO, UNKNOWN. Błędy JS nie są breakage.
// Raport: <results>/sites/latest.html (zrzuty obok siebie + ręczna ocena + eksport JSON), latest.txt,
// latest.json, shots/ – lokalnie, nie commitujemy.
//
// Opcje: --limit N, --only host[,host], --sites plik, --no-youtube, --no-screenshots, --headless,
//        --dir <rozszerzenie>, --results <katalog>

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlaywright, EXTENSION_ENTRIES } from '../../tools/chromium-smoke.mjs';
import { ensurePlaying, samplePlayer, seekForward } from '../e2e/lib/youtube-page.mjs';
import { progressOf } from '../e2e/lib/classify.mjs';
import { RESULTS_DIR, DEFAULT_SHORTS, browserArgs, openYouTube, networkErrorOf } from './apex-local-test.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..');
export const SITES_FILE = path.join(HERE, 'sites-single-blocker.json');
export const CONFIGS = Object.freeze(['none', 'apex']);
export const CONFIG_LABEL = Object.freeze({ none: 'BEZ Apex AdBlocker', apex: 'Z Apex AdBlocker' });
export const STATUS = Object.freeze({
  PASS: 'PASS', REAL_AD: 'REAL_AD', EMPTY_AD_SLOT: 'EMPTY_AD_SLOT', BREAKAGE: 'BREAKAGE', ANTI_ADBLOCK: 'ANTI_ADBLOCK',
  BOT_CHALLENGE: 'BOT_CHALLENGE', SITE_ERROR: 'SITE_ERROR', CONSENT_INCONCLUSIVE: 'CONSENT_INCONCLUSIVE', MANUAL_REVIEW: 'MANUAL_REVIEW',
});
export const AD_CLASSES = Object.freeze(['REAL_AD', 'EMPTY_AD_SLOT', 'LABEL_ONLY', 'SITE_PROMO', 'UNKNOWN']);
export const CONSENT_STATES = Object.freeze({ NONE: 'none', REJECTED: 'rejected', UNRESOLVED: 'unresolved' });
const SETTLE_MS = 3000;

// ---------------------------------------------------------------------------------------------
// Konfiguracja i lista stron

export function parseSitesArgs(argv) {
  const o = {
    limit: 0, only: [], sitesFile: SITES_FILE, youtube: true, screenshots: true,
    headless: process.platform === 'linux' && !process.env.DISPLAY, extensionDir: null, resultsDir: RESULTS_DIR,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--sites') continue;
    if (a === '--limit') o.limit = Math.max(0, parseInt(argv[++i], 10) || 0);
    else if (a === '--only') o.only = String(argv[++i] || '').split(',').map((s) => bare(s.trim().toLowerCase())).filter(Boolean);
    else if (a === '--sites-file') o.sitesFile = path.resolve(argv[++i]);
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
const bare = (h) => String(h).replace(/^(www|edition)\./, '');

/** Strony z pliku: [{url, host, category, knownCase}], z filtrami --only / --limit. */
export function loadSites(file = SITES_FILE, { only = [], limit = 0 } = {}) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const known = data.knownCases || {};
  let sites = Object.entries(data.categories || {}).flatMap(([category, urls]) => urls.map((url) => {
    const host = hostOf(url);
    return { url, host, category, knownCase: known[bare(host)] || null };
  }));
  if (only.length) sites = sites.filter((s) => only.includes(bare(s.host)));
  if (limit) sites = sites.slice(0, limit);
  return { sites, youtube: data.youtube || null };
}

/**
 * Domena „rejestrowalna” (przybliżenie bez PSL) – do rozróżnienia linków tej samej strony i obcych.
 * JEDYNA logika domeny w testerze: ta sama funkcja jest wstrzykiwana do stron przez evalIsolated
 * (musi być samowystarczalna – bez odwołań do zmiennych modułu).
 */
export function siteOf(host) {
  const parts = String(host).split('.');
  const two = ['com.pl', 'net.pl', 'org.pl', 'co.uk', 'com.au', 'co.jp'];
  return parts.length > 2 && two.includes(parts.slice(-2).join('.')) ? parts.slice(-3).join('.') : parts.slice(-2).join('.');
}

// Wzorce (źródłem prawdy są stringi – używane i w Node, i w stronie)
export const PATTERNS = Object.freeze({
  adHost: 'doubleclick\\.net|googlesyndication|googleadservices|adnxs|criteo|rtbhouse|adform|smartadserver|teads|taboola|outbrain|adocean|amazon-adsystem|pubmatic|rubiconproject|openx|yieldbird|onetads|ocdn\\.eu\\/ads|adservice|\\bads\\.|\\/ads\\/',
  // bezpośrednie odrzucenie: tylko pełne, jednoznaczne teksty (zakotwiczone) – bez fuzzy „zawiera słowo odrzuć”
  reject: '^(odrzuć( wszystk\\w*)?|odrzucam( wszystk\\w*)?|odrzucam i chcę dowiedzieć się więcej|odrzuć i (zamknij|chcę dowiedzieć się więcej)|nie zgadzam się|nie akceptuję|nie wyrażam zgody|tylko (niezbędne|wymagane|konieczne)( pliki cookies?)?|(zaakceptuj|akceptuj|zezwól na|zapisz) tylko (niezbędne|wymagane|konieczne)( pliki cookies?)?|odmów|kontynuuj bez akceptacji|reject( all)?|decline( all)?|deny( all)?|refuse( all)?|only (necessary|essential)( cookies)?|necessary (cookies )?only|use necessary cookies only|continue without (accepting|agreeing))$',
  // krok „ustawienia CMP” (otwiera panel z odrzuceniem) – klikany WYŁĄCZNIE wewnątrz wykrytego kontenera CMP
  settings: '^(ustawienia (zaawansowane|prywatności|preferencji|cookies?|plików cookies?)|zarządzaj (ustawieniami|preferencjami|opcjami)|pokaż cele|manage (options|preferences|settings)|privacy settings|cookie settings)$',
  // nigdy nie klikamy (zgoda / niejednoznaczne zamknięcie) – tylko do diagnostyki i acceptOnly
  accept: 'akceptuj|zaakceptuj|zgadzam|zgoda|przejdź do serwisu|kontynuuj|accept|agree|allow all|zezwól|got it',
  forbidden: 'zaloguj|logowanie|login|log in|sign in|zarejestruj|subskryb|subscribe|kup|zapłać|płatn|premium|abonament|newsletter|pay',
  cmpText: 'cookie|ciasteczk|zgod[ayęo]|prywatno|RODO|consent|przetwarzani\\w* (twoich )?danych|personaliz|partner(zy|ów)? (reklamow|zaufan)|your data|we value your privacy',
  challenge: 'nie jestem robotem|i\'?m not a robot|verify you are (a )?human|potwierdź, że jesteś człowiekiem|weryfikacja bezpieczeństwa|security check|checking your browser|just a moment|attention required|access denied|unusual traffic|nietypowy ruch|are you a robot|human verification|captcha',
  antiAdblock: 'ad ?block|blokad\\w* reklam|bloker\\w* reklam|blokujesz reklam|wyłącz\\w* (bloker|blokad|adblock)|dodaj\\w* (nas |stronę |serwis )?do (wyjątków|białej listy)|disable your ad ?block|turn off your ad ?block|whitelist (us|this site)|ad blocker detected|wykryli\\w* .{0,30}blok',
  adLabel: '^(reklama|reklamy|advertisement|advertising|sponsored|ad|anzeige|publicidad)\\s*[:·•|]?$',
  promoLabel: '^(materiał (promocyjny|partnera|sponsorowany)|artykuł sponsorowany|sponsorowane|sponsorowany|treść sponsorowana|partner content|sponsored content|paid content|promoted)\\s*[:·•|]?$',
});
const re = (k) => new RegExp(PATTERNS[k], 'i');

// ---------------------------------------------------------------------------------------------
// Ocena strony (czysta logika; testy: tests/tools/single-blocker-sites.test.mjs)

const adCount = (m, cls) => (m && !m.error && m.ads && m.ads.counts ? m.ads.counts[cls] || 0 : 0);
const consentState = (m) => (!!m && !m.error && m.consent ? m.consent.state : null);

/**
 * Czy reklamy można porównać automatycznie: ten sam stan zgody w obu konfiguracjach –
 * none + none albo rejected + rejected. none + rejected (w dowolnej kolejności) i unresolved → nie.
 */
export function consentComparable(none, cb) {
  const a = consentState(none);
  const b = consentState(cb);
  return a === b && (a === CONSENT_STATES.NONE || a === CONSENT_STATES.REJECTED);
}

/** Różnice none → Apex AdBlocker (do raportu). */
export function diffOf(none, cb) {
  const ok = (m) => m && !m.error;
  const d = { ads: {}, comparable: consentComparable(none, cb) };
  for (const c of AD_CLASSES) d.ads[c] = { none: adCount(none, c), apex: adCount(cb, c) };
  if (ok(none) && ok(cb)) {
    d.textRatio = none.textLength ? Math.round((cb.textLength / none.textLength) * 100) / 100 : null;
    d.blockedRequests = cb.requests.blocked - none.requests.blocked;
    d.adHostLoaded = { none: none.requests.adHostLoaded, apex: cb.requests.adHostLoaded };
    d.pageErrors = { none: none.pageErrors, apex: cb.pageErrors };
  }
  return d;
}

/**
 * Wskazówka automatyczna dla strony (none = kontrola, cb = Apex AdBlocker). Kolejność:
 * SITE_ERROR > BOT_CHALLENGE > BREAKAGE > ANTI_ADBLOCK > CONSENT_INCONCLUSIVE > REAL_AD > EMPTY_AD_SLOT > MANUAL_REVIEW > PASS.
 * Błędy JS nie są breakage (tylko informacja).
 */
export function classifySite(none, cb) {
  const r = (status, reasons, extra = {}) => ({ status, reasons, ...extra });
  const nErr = !none || none.error || (none.status && none.status >= 400);
  const cErr = !cb || cb.error || (cb.status && cb.status >= 400);
  const errText = (m) => (!m ? 'brak danych' : m.error || `HTTP ${m.status}`);
  if (nErr && cErr) return r(STATUS.SITE_ERROR, [`strona nie działa w obu konfiguracjach (bez: ${errText(none)}; z: ${errText(cb)})`]);
  if (nErr) return r(STATUS.SITE_ERROR, [`kontrola bez rozszerzenia nie załadowała się (${errText(none)}) – brak porównania`]);
  // challenge
  if (cb.challenge || none.challenge) {
    if (cb.challenge && none.challenge) return r(STATUS.BOT_CHALLENGE, [`challenge także BEZ Apex AdBlocker – nie przypisujemy rozszerzeniu („${cb.challenge}”)`], { scope: 'both' });
    if (cb.challenge) return r(STATUS.BOT_CHALLENGE, [`challenge tylko Z Apex AdBlocker („${cb.challenge}”) – sprawdź ręcznie, czy się powtarza`], { scope: 'apex' });
    return r(STATUS.MANUAL_REVIEW, [`challenge tylko w kontroli („${none.challenge}”) – brak porównania`], { scope: 'none' });
  }
  if (cErr) return r(STATUS.BREAKAGE, [`z Apex AdBlocker nie załadowała się (${errText(cb)}), bez rozszerzenia działa`]);
  // breakage (bez błędów JS)
  const brk = [];
  if (cb.blank && !none.blank) brk.push(`pusta strona (treść ${cb.textLength} znaków, bez ${none.textLength})`);
  if (none.textLength > 1000 && cb.textLength < 0.3 * none.textLength) brk.push(`duży spadek treści: ${cb.textLength} vs ${none.textLength} znaków`);
  if (none.mainContent && !cb.mainContent) brk.push('zniknęła główna treść (main/article)');
  if (none.menuLinks >= 3 && cb.menuLinks === 0) brk.push('zniknęło menu');
  if (none.nav.ok === true && cb.nav.ok === false) brk.push(`link z menu nie działa (${cb.nav.error || cb.nav.href})`);
  if (none.search.ok === true && cb.search.ok === false) brk.push('wyszukiwarka nie przyjmuje tekstu');
  if (none.videos > 0 && cb.videos === 0) brk.push(`zniknął odtwarzacz wideo (bez: ${none.videos})`);
  if (cb.overflowX && !none.overflowX) brk.push('rozjechany układ (poziome przewijanie)');
  if (cb.scrollLocked && !none.scrollLocked && !(cb.consent && cb.consent.state === CONSENT_STATES.UNRESOLVED)) brk.push('zablokowane przewijanie strony');
  if (brk.length) return r(STATUS.BREAKAGE, brk);
  if (cb.antiAdblock && !none.antiAdblock) return r(STATUS.ANTI_ADBLOCK, [`komunikat anti-adblock tylko z Apex AdBlocker („${cb.antiAdblock}”)`]);
  const info = [];
  if (cb.antiAdblock && none.antiAdblock) info.push('tekst podobny do anti-adblock także bez rozszerzenia');
  if (cb.pageErrors > none.pageErrors + 5) info.push(`więcej błędów JS z Apex AdBlocker (${cb.pageErrors} vs ${none.pageErrors}) – tylko informacja, nie breakage`);
  if (!consentComparable(none, cb)) {
    const st = (m) => (m.consent ? `${m.consent.state}${m.consent.reason ? ` – ${m.consent.reason}` : ''}` : '?');
    const a = consentState(none);
    const b = consentState(cb);
    const why = a !== CONSENT_STATES.UNRESOLVED && b !== CONSENT_STATES.UNRESOLVED && a !== b
      ? `różny stan zgody: ${a} vs ${b} (bez → z) – reklamy nie są porównywane`
      : `zgoda bez: ${st(none)}; z: ${st(cb)} – reklamy nie są porównywane`;
    return r(STATUS.CONSENT_INCONCLUSIVE, [why, ...info]);
  }
  const ads = (c) => adCount(cb, c);
  const delta = (c) => `${adCount(none, c)} → ${ads(c)}`;
  if (ads('REAL_AD')) return r(STATUS.REAL_AD, [`widoczne reklamy z Apex AdBlocker: ${delta('REAL_AD')} (bez → z)`, ...info]);
  if (ads('EMPTY_AD_SLOT')) return r(STATUS.EMPTY_AD_SLOT, [`puste sloty po reklamach: ${delta('EMPTY_AD_SLOT')}`, ...info]);
  if (ads('UNKNOWN')) return r(STATUS.MANUAL_REVIEW, [`elementy reklamowe nie do sklasyfikowania: ${delta('UNKNOWN')}`, ...info]);
  const extra = [];
  if (ads('LABEL_ONLY')) extra.push(`same etykiety bez slotu: ${delta('LABEL_ONLY')}`);
  if (ads('SITE_PROMO')) extra.push(`materiały promocyjne strony: ${delta('SITE_PROMO')}`);
  return r(STATUS.PASS, [`reklamy bez → z: ${delta('REAL_AD')}`, ...extra, ...info, 'brak automatycznych sygnałów problemu – to wskazówka, nie gwarancja']);
}

/** Podsumowanie całego przebiegu. */
export function summarize(rows) {
  const by = {};
  for (const s of Object.values(STATUS)) by[s] = 0;
  for (const r of rows) by[r.verdict.status]++;
  const comparable = rows.filter((r) => r.diff.comparable);
  const ads = {};
  for (const c of AD_CLASSES) ads[c] = { none: 0, apex: 0 };
  for (const r of comparable) for (const c of AD_CLASSES) { ads[c].none += r.diff.ads[c].none; ads[c].apex += r.diff.ads[c].apex; }
  const real = ads.REAL_AD;
  return {
    sites: rows.length, comparableSites: comparable.length, status: by,
    challenge: { both: rows.filter((r) => r.verdict.scope === 'both').length, apexOnly: rows.filter((r) => r.verdict.scope === 'apex').length, controlOnly: rows.filter((r) => r.verdict.scope === 'none').length },
    ads,
    realAdReductionPct: real.none ? Math.round(((real.none - real.apex) / real.none) * 1000) / 10 : null,
    sitesWithRealAds: { none: comparable.filter((r) => r.diff.ads.REAL_AD.none > 0).length, apex: comparable.filter((r) => r.diff.ads.REAL_AD.apex > 0).length },
    blockedRequests: rows.reduce((n, r) => n + (r.results.apex && !r.results.apex.error ? r.results.apex.requests.blocked : 0), 0),
  };
}

// ---------------------------------------------------------------------------------------------
// Funkcje wykonywane w stronie (świat izolowany; bez domknięć – wzorce przychodzą w argumencie)

/** Wykrycie banera zgody i oznaczenie przycisków odrzucenia (data-cb-consent). */
export function detectConsentInPage(arg) {
  const P = arg.patterns;
  const cmpRe = new RegExp(P.cmpText, 'i');
  const rejectRe = new RegExp(P.reject, 'i');
  const settingsRe = new RegExp(P.settings, 'i');
  const acceptRe = new RegExp(P.accept, 'i');
  const forbiddenRe = new RegExp(P.forbidden, 'i');
  const vis = (el) => {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05;
  };
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  document.querySelectorAll('[data-cb-consent],[data-cb-settings]').forEach((e) => { e.removeAttribute('data-cb-consent'); e.removeAttribute('data-cb-settings'); });
  const KNOWN = '#onetrust-banner-sdk, #onetrust-consent-sdk, #CybotCookiebotDialog, .fc-consent-root, #qc-cmp2-ui, .qc-cmp2-container, #didomi-host, #didomi-popup, [id^="sp_message_container"], #cmpbox, .cmp-root, [class*="cookie-consent"], [id*="cookie-consent"], [class*="cookiebanner"], [id*="cookie-banner"], [class*="cookie-banner"], [class*="consent-banner"], [id*="consent"], [class*="gdpr"], [id*="gdpr"], [class*="rodo"], [id*="rodo"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], dialog[open]';
  const containers = new Set();
  if (arg.wholeDocument) {
    if (document.body && vis(document.body) && cmpRe.test(norm(document.body.innerText).slice(0, 3000))) containers.add(document.body);
  } else {
    for (const el of document.querySelectorAll(KNOWN)) {
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 250 || r.height < 60) continue; // mały pływający przycisk „Ustawienia cookies” to nie baner
      if (cmpRe.test(norm(el.innerText).slice(0, 3000))) containers.add(el);
    }
    // ogólnie: duże stałe/przyklejone warstwy z tekstem o zgodzie
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width * r.height < 0.08 * innerWidth * innerHeight) continue;
      if (cmpRe.test(norm(el.innerText).slice(0, 3000))) containers.add(el);
    }
  }
  // tylko zewnętrzne kontenery
  const list = [...containers].filter((c) => ![...containers].some((o) => o !== c && o.contains(c)));
  const candidates = [];
  const settings = [];
  const actions = [];
  let acceptOnly = false;
  for (const c of list) {
    const clickable = [...c.querySelectorAll('button, [role="button"], a, input[type="button"], input[type="submit"]')].filter(vis);
    for (const b of clickable) {
      const t = norm(b.innerText || b.value || b.getAttribute('aria-label') || '');
      if (t && actions.length < 12 && !actions.includes(t.slice(0, 60))) actions.push(t.slice(0, 60)); // diagnostyka: tylko teksty akcji
      if (!t || t.length > 60 || forbiddenRe.test(t)) continue;
      if (b.tagName === 'A') {
        const href = b.getAttribute('href') || '';
        if (href && !href.startsWith('#') && !/^javascript:/i.test(href)) continue; // linki nawigujące – nie klikamy
      }
      if (rejectRe.test(t)) candidates.push({ el: b, text: t, prio: /wszystk|all/i.test(t) ? 0 : 1 });
      else if (settingsRe.test(t)) settings.push({ el: b, text: t });
      else if (acceptRe.test(t)) acceptOnly = true;
    }
  }
  candidates.sort((a, b) => a.prio - b.prio);
  candidates.forEach((c, i) => c.el.setAttribute('data-cb-consent', String(i)));
  settings.forEach((c, i) => c.el.setAttribute('data-cb-settings', String(i)));
  if (list.length) list.forEach((c) => c.setAttribute('data-cb-cmp', '1'));
  return {
    present: list.length > 0, containers: list.length, reject: candidates.map((c) => c.text), settings: settings.map((c) => c.text),
    actions, acceptOnly: acceptOnly && !candidates.length && !settings.length,
  };
}

/** Pomiar strony: treść, reklamy (klasy), nakładki, challenge, menu, wyszukiwarka, wideo. */
export function collectInPage(arg) {
  const P = arg.patterns;
  const vw = innerWidth;
  const vh = innerHeight;
  const vis = (el) => {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05;
  };
  const size = (el) => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; };
  const desc = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id.slice(0, 40) : ''}${[...el.classList].slice(0, 2).map((c) => '.' + c.slice(0, 30)).join('')}`;
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  const adHostRe = new RegExp(P.adHost, 'i');
  const adLabelRe = new RegExp(P.adLabel, 'i');
  const promoRe = new RegExp(P.promoLabel, 'i');
  const inCmp = (el) => !!el.closest('[data-cb-cmp]');
  // siteOf – wstrzyknięta przez evalIsolated (ta sama funkcja co w Node)
  const site = siteOf(location.hostname);
  const hasMedia = (el) => (el.tagName === 'IFRAME' || el.tagName === 'IMG' || el.tagName === 'VIDEO')
    || [...el.querySelectorAll('img, iframe, video, canvas, picture, svg, object, embed')].some((m) => { const s = size(m); return vis(m) && s.w >= 30 && s.h >= 30; });
  const adFrame = (el) => [el, ...el.querySelectorAll('iframe')].some((f) => f.tagName === 'IFRAME' && adHostRe.test(f.src || ''));
  const links = (el) => [el.closest('a'), ...el.querySelectorAll('a[href]')].filter(Boolean).map((a) => { try { return new URL(a.href, location.href).hostname; } catch { return ''; } }).filter(Boolean);
  // kandydaci na sloty reklamowe
  const AD_SEL = 'ins.adsbygoogle, [id^="google_ads_iframe"], [id^="div-gpt-ad"], [data-google-query-id], [id*="gpt-ad"], [data-ad-slot], [data-adunit], [data-ad-unit], [id^="adocean"], .adslot, .ad-slot, .ad-container, .advertisement, [class^="ad-banner"], [id^="ad-banner"], [class*="teads"], [id^="taboola"], .trc_rbox_container, [id^="outbrain"], .OUTBRAIN, [class*="dfp-"], [id*="_dfp_"]';
  const slots = new Map(); // element → {label}
  for (const el of document.querySelectorAll(AD_SEL)) if (vis(el) && !inCmp(el)) slots.set(el, { label: '' });
  for (const f of document.querySelectorAll('iframe')) if (vis(f) && !inCmp(f) && adHostRe.test(f.src || '')) slots.set(f, { label: '' });
  // etykiety „Reklama” / „Materiał promocyjny” → kontener
  const labelOnly = [];
  const labelEls = new Set();
  if (document.body) {
    // węzły tekstowe (tanio) zamiast innerText każdego elementu
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = norm(n.nodeValue);
      if (t && t.length <= 40 && (adLabelRe.test(t) || promoRe.test(t)) && n.parentElement) labelEls.add(n.parentElement);
    }
    // etykiety z CSS ::before/::after (np. content: "Reklama")
    for (const el of document.body.querySelectorAll('[class*="ad"], [id*="ad"], [class*="reklam"], [class*="sponsor"]')) {
      for (const pseudo of ['::before', '::after']) {
        const c = getComputedStyle(el, pseudo).content;
        if (c && c !== 'none' && c !== 'normal' && adLabelRe.test(norm(c.replace(/^["']|["']$/g, '')))) labelEls.add(el);
      }
    }
  }
  for (const el of labelEls) {
    const own = norm(el.innerText);
    const pseudo = (() => { for (const ps of ['::before', '::after']) { const c = getComputedStyle(el, ps).content; if (c && c !== 'none' && c !== 'normal') return norm(c.replace(/^["']|["']$/g, '')); } return ''; })();
    const t = own && own.length <= 40 && (adLabelRe.test(own) || promoRe.test(own)) ? own : pseudo;
    if (!t || !(adLabelRe.test(t) || promoRe.test(t)) || !vis(el) || inCmp(el)) continue;
    if (el.closest('footer, [role="contentinfo"], nav, [role="navigation"], header')) continue; // link „Reklama” w stopce/menu to nie reklama
    let c = el.parentElement;
    for (let i = 0; c && c !== document.body && i < 4; i++, c = c.parentElement) { const s = size(c); if (s.w >= 120 && s.h >= 50) break; }
    if (!c || c === document.body || c === document.documentElement) { labelOnly.push({ el, t }); continue; }
    const s = size(c);
    if (s.w < 120 || s.h < 50) { labelOnly.push({ el, t }); continue; }
    // sama etykieta nie może awansować kontenera strony do slotu reklamowego (fałszywe REAL_AD od zdjęć w treści):
    // html/body/main/[role=main], kontener zawierający main, albo lokalny kontener wyższy niż 3 ekrany
    // (billboard ~250–300 px, halfpage ~600 px – daleko poniżej). Wtedy zostaje LABEL_ONLY.
    if (c.matches('html, body, main, [role="main"]') || c.querySelector('main, [role="main"]') || s.h > 3 * vh) { labelOnly.push({ el, t }); continue; }
    if (![...slots.keys()].some((k) => k.contains(c) || c.contains(k))) slots.set(c, { label: t });
    else for (const [k, v] of slots) if (k.contains(c) || c.contains(k)) v.label = v.label || t;
  }
  // tylko zewnętrzne sloty
  const outer = [...slots.keys()].filter((k) => ![...slots.keys()].some((o) => o !== k && o.contains(k)));
  const counts = { REAL_AD: 0, EMPTY_AD_SLOT: 0, LABEL_ONLY: 0, SITE_PROMO: 0, UNKNOWN: 0 };
  const samples = { REAL_AD: [], EMPTY_AD_SLOT: [], LABEL_ONLY: [], SITE_PROMO: [], UNKNOWN: [] };
  const add = (cls, info) => { counts[cls]++; if (samples[cls].length < 5) samples[cls].push(info); };
  for (const el of outer) {
    const s = size(el);
    if (s.w < 30 || s.h < 30) continue; // zwinięty slot = niewidoczny
    const label = slots.get(el).label;
    const media = hasMedia(el);
    const text = Math.max(0, norm(el.innerText).length - label.length);
    const hosts = links(el);
    const sameSite = hosts.length > 0 && hosts.every((h) => siteOf(h) === site);
    const promo = promoRe.test(label);
    const info = `${desc(el)} ${s.w}x${s.h}${label ? ` „${label}”` : ''}${el.tagName === 'IFRAME' ? ` ${(() => { try { return new URL(el.src).hostname; } catch { return ''; } })()}` : ''}`;
    let cls;
    if (promo && sameSite) cls = 'SITE_PROMO';
    else if (adFrame(el) || (media && !promo)) cls = 'REAL_AD';
    else if (promo && text > 20) cls = 'SITE_PROMO';
    else if (!media && text < 20 && s.w >= 50 && s.h >= 50) cls = 'EMPTY_AD_SLOT';
    else cls = 'UNKNOWN';
    add(cls, info);
  }
  for (const l of labelOnly) add('LABEL_ONLY', `${desc(l.el)} „${l.t}”`);
  // challenge i anti-adblock (bez banera zgody)
  const bodyText = norm(document.body ? document.body.innerText : '');
  // tylko widoczny tekst (innerText: bez skryptów i ukrytych elementów), bez tekstu banera zgody
  const textNoCmp = (() => { let t = bodyText; for (const c of document.querySelectorAll('[data-cb-cmp]')) { const x = norm(c.innerText); if (x) t = t.split(x).join(' '); } return norm(t); })();
  const chRe = new RegExp(P.challenge, 'i');
  const chFrame = [...document.querySelectorAll('iframe')].some((f) => vis(f) && /recaptcha|hcaptcha|challenges\.cloudflare|turnstile|captcha-delivery|geo\.captcha/i.test(f.src || ''));
  const chText = chRe.exec(document.title + ' ' + textNoCmp.slice(0, 2000));
  const challenge = chFrame ? 'ramka CAPTCHA/challenge' : chText && textNoCmp.length < 3000 ? chText[0] : '';
  const abRe = new RegExp(P.antiAdblock, 'i');
  const ab = abRe.exec(textNoCmp);
  // menu, link do sprawdzenia nawigacji, wyszukiwarka, logowanie
  const sameHost = (href) => { try { const u = new URL(href, location.href); return /^https?:$/.test(u.protocol) && siteOf(u.hostname) === site && u.pathname.length > 1 && u.href.split('#')[0] !== location.href.split('#')[0]; } catch { return false; } };
  const navAnchors = [...document.querySelectorAll('nav a[href], header a[href], [role="navigation"] a[href]')].filter((a) => vis(a) && !inCmp(a) && sameHost(a.href));
  const forbidden = new RegExp(P.forbidden, 'i');
  const pick = navAnchors.find((a) => !forbidden.test(norm(a.innerText) + ' ' + a.href) && !/koszyk|cart|konto|account/i.test(a.href));
  document.querySelectorAll('[data-cb-nav],[data-cb-search]').forEach((e) => { e.removeAttribute('data-cb-nav'); e.removeAttribute('data-cb-search'); });
  if (pick) pick.setAttribute('data-cb-nav', '1');
  const search = [...document.querySelectorAll('input[type="search"], form[role="search"] input[type="text"], input[name="q"], input[name="query"], input[name="search"], input[name="s"], input[placeholder*="szukaj" i], input[placeholder*="search" i], input[aria-label*="szukaj" i], input[aria-label*="search" i]')]
    .find((i) => vis(i) && !i.disabled && !i.readOnly && !inCmp(i));
  if (search) search.setAttribute('data-cb-search', '1');
  const videos = [...document.querySelectorAll('video')].filter(vis);
  const de = getComputedStyle(document.documentElement);
  const bs = document.body ? getComputedStyle(document.body) : de;
  return {
    title: document.title.slice(0, 120), url: location.href, textLength: bodyText.length,
    blank: bodyText.length < 100 && !document.querySelector('img, video, canvas, iframe'),
    mainContent: !!document.querySelector('main, article, [role="main"]') && bodyText.length > 500,
    overflowX: document.documentElement.scrollWidth > vw + 60,
    scrollLocked: [de.overflow, de.overflowY, bs.overflow, bs.overflowY].includes('hidden') && document.documentElement.scrollHeight > vh * 1.5,
    ads: { counts, samples },
    challenge,
    antiAdblock: ab ? textNoCmp.slice(Math.max(0, ab.index - 40), ab.index + 60) : '',
    menuLinks: navAnchors.length, navHref: pick ? pick.href : null, hasSearch: !!search,
    videos: videos.length, videosPlaying: videos.filter((v) => !v.paused && v.currentTime > 0).length,
  };
}

const scrollFn = () => new Promise((done) => {
  let y = 0;
  const step = () => { y += innerHeight * 0.8; scrollTo(0, y); if (y < Math.min(document.documentElement.scrollHeight, innerHeight * 6)) setTimeout(step, 250); else setTimeout(() => { scrollTo(0, 0); done(true); }, 600); };
  step();
});

export async function evalIsolated(page, fn, arg) {
  const cdp = await page.context().newCDPSession(page);
  try {
    const { frameTree } = await cdp.send('Page.getFrameTree');
    const { executionContextId } = await cdp.send('Page.createIsolatedWorld', { frameId: frameTree.frame.id, worldName: 'apex-sites' });
    // pomocnicza siteOf jest wstrzykiwana do zakresu funkcji – jedna logika domeny w Node i w stronie
    const expression = `(() => { const siteOf = ${siteOf}; return (${fn})(${arg === undefined ? '' : JSON.stringify(arg)}); })()`;
    const r = await cdp.send('Runtime.evaluate', { expression, contextId: executionContextId, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
    return r.result.value;
  } finally { await cdp.detach().catch(() => {}); }
}

// ---------------------------------------------------------------------------------------------
// Przebieg

/**
 * Ta sama procedura w obu konfiguracjach (maks. 3 kliknięcia łącznie):
 *   1. wykryj baner zgody (strona główna + ramki CMP),
 *   2. jest bezpośrednie odrzucenie → kliknij je,
 *   3. brak odrzucenia, ale jest jednoznaczny przycisk ustawień CMP (whitelista, tylko w kontenerze CMP) → kliknij go,
 *   4. wykryj ponownie i szukaj odrzucenia,
 *   5. brak bezpiecznej ścieżki → unresolved (z diagnostyką). Akceptacji nigdy nie klikamy.
 */
export const CONSENT_MAX_STEPS = 3;

async function findConsent(page, arg) {
  const found = [];
  const main = await evalIsolated(page, detectConsentInPage, arg).catch(() => null);
  if (main && main.present) found.push({ frame: page.mainFrame(), where: 'main', det: main });
  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue;
    if (!/consent|cmp|privacy|sourcepoint|sp-prod|didomi|onetrust|cookiebot|quantcast|consensu|usercentrics|trustarc|fundingchoices|gdpr|rodo/i.test(f.url())) continue;
    const d = await f.evaluate(detectConsentInPage, { ...arg, wholeDocument: true }).catch(() => null);
    if (d && d.present) found.push({ frame: f, where: `iframe:${hostOf(f.url())}`, det: d });
  }
  return found.find((x) => x.det.reject.length) || found.find((x) => x.det.settings.length) || found[0] || null;
}

export async function handleConsent(page) {
  const arg = { patterns: PATTERNS };
  const out = { state: CONSENT_STATES.NONE, clicked: [], reason: '' };
  const steps = [];
  let last = null;
  const unresolved = (reason) => {
    out.state = CONSENT_STATES.UNRESOLVED;
    out.reason = reason;
    out.diagnostics = {
      frame: last ? last.where : null,
      visibleActions: last ? last.det.actions.slice(0, 12) : [],
      directReject: !!(last && last.det.reject.length),
      settingsStep: steps.some((x) => x.kind === 'settings') || !!(last && last.det.settings.length),
      steps,
      reason,
    };
    return out;
  };
  for (let step = 0; step <= CONSENT_MAX_STEPS; step++) {
    const found = await findConsent(page, arg);
    if (!found) {
      if (!steps.length) return out; // brak banera
      if (steps[steps.length - 1].kind === 'reject') { out.state = CONSENT_STATES.REJECTED; return out; }
      return unresolved('baner zniknął po otwarciu ustawień, bez odrzucenia');
    }
    last = found;
    if (step === CONSENT_MAX_STEPS) return unresolved(`baner zgody nadal widoczny po ${CONSENT_MAX_STEPS} krokach`);
    let kind;
    let text;
    let sel;
    if (found.det.reject.length) { kind = 'reject'; text = found.det.reject[0]; sel = '[data-cb-consent="0"]'; }
    else if (found.det.settings.length && !steps.some((x) => x.kind === 'settings' && x.text === found.det.settings[0])) { kind = 'settings'; text = found.det.settings[0]; sel = '[data-cb-settings="0"]'; }
    else if (steps.some((x) => x.kind === 'settings')) return unresolved('po otwarciu ustawień brak bezpiecznego odrzucenia');
    else return unresolved(found.det.acceptOnly ? 'tylko przycisk akceptacji (nie klikamy)' : 'brak przycisku odrzucenia ani ustawień CMP');
    const ok = await found.frame.locator(sel).first().click({ timeout: 4000 }).then(() => true).catch(() => false);
    if (!ok) return unresolved(`nie udało się kliknąć „${text}”`);
    steps.push({ kind, text, frame: found.where });
    out.clicked.push(text);
    await page.waitForTimeout(kind === 'settings' ? 1500 : 2000);
  }
  return unresolved('przekroczono limit kroków');
}

async function visitSite(context, site, { shotPath = null, settleMs = SETTLE_MS } = {}) {
  const page = await context.newPage();
  const adHostRe = re('adHost');
  const net = { total: 0, blocked: 0, failed: 0, adHostRequests: 0, adHostLoaded: 0, adHosts: {} };
  let pageErrors = 0;
  page.on('request', (r) => { net.total++; if (adHostRe.test(r.url())) { net.adHostRequests++; const h = hostOf(r.url()); net.adHosts[h] = (net.adHosts[h] || 0) + 1; } });
  page.on('requestfinished', (r) => { if (adHostRe.test(r.url())) net.adHostLoaded++; });
  page.on('requestfailed', (r) => { const e = (r.failure() && r.failure().errorText) || ''; if (/ERR_BLOCKED_BY_CLIENT/.test(e)) net.blocked++; else net.failed++; });
  page.on('pageerror', () => { pageErrors++; });
  const out = { url: site.url };
  const t0 = Date.now();
  try {
    const resp = await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    out.status = resp ? resp.status() : null;
    await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(settleMs);
    out.consent = await handleConsent(page);
    await page.waitForTimeout(1000);
    await evalIsolated(page, scrollFn).catch(() => {});
    await page.waitForTimeout(1000);
    // ponownie oznacz baner (po przewinięciu), żeby nie liczyć go jako reklamy
    await evalIsolated(page, detectConsentInPage, { patterns: PATTERNS }).catch(() => {});
    Object.assign(out, await evalIsolated(page, collectInPage, { patterns: PATTERNS }));
    out.loadMs = Date.now() - t0;
    if (shotPath) await page.screenshot({ path: shotPath, type: 'jpeg', quality: 60 }).then(() => { out.screenshot = shotPath; }).catch(() => {});
    out.search = { present: out.hasSearch, ok: null };
    if (out.hasSearch) out.search.ok = await page.locator('[data-cb-search="1"]').first().fill('test', { timeout: 4000 }).then(() => true).catch(() => false);
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

/** YouTube w jednej konfiguracji: watch (odtwarzanie, seek), Shorts, reklama w playerze, anti-adblock. */
async function youtubeRun(context, yt, call) {
  const out = {};
  const page = await context.newPage();
  try {
    const skip = await openYouTube(page, yt.watch, true);
    if (skip) out.skip = skip;
    else {
      await ensurePlaying(page, 'watch');
      const s1 = await samplePlayer(page, 'watch', 8);
      const last = s1[s1.length - 1] || {};
      out.player = !!last.hasPlayer;
      out.video = !!last.hasVideo;
      out.progressS = progressOf(s1);
      out.playing = out.progressS >= 3;
      out.adSeen = s1.some((s) => s.adShowing || (s.adElements || []).length);
      out.antiAdblock = s1.some((s) => s.antiAdblock);
      const before = last.currentTime || 0;
      await seekForward(page, 60).catch(() => {});
      const s2 = await samplePlayer(page, 'watch', 8);
      const after = s2.map((s) => s.currentTime).filter((x) => typeof x === 'number');
      out.seek = { jumped: after.some((t) => t >= before + 45), progressS: progressOf(s2), playerError: s2.some((s) => s.error) };
      out.seek.ok = out.seek.jumped && out.seek.progressS >= 2 && !out.seek.playerError;
      out.adSeen = out.adSeen || s2.some((s) => s.adShowing || (s.adElements || []).length);
    }
  } catch (e) {
    out.error = String(e.message || e).split('\n')[0].slice(0, 160);
  } finally { await page.close().catch(() => {}); }
  if (yt.shorts && !out.skip) {
    const sp = await context.newPage();
    try {
      await sp.goto(yt.shorts, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await ensurePlaying(sp, 'shorts');
      out.shorts = { progressS: progressOf(await samplePlayer(sp, 'shorts', 6)) };
      out.shorts.ok = out.shorts.progressS >= 2;
    } catch (e) { out.shorts = { ok: false, error: String(e.message || e).split('\n')[0].slice(0, 120) }; } finally { await sp.close().catch(() => {}); }
  }
  if (call) {
    const h = await call({ type: 'health:get' }).catch(() => null);
    const y = h && h.youtube;
    out.protection = y ? { status: y.status, compat: y.compat ? `${y.compat.supported}/${y.compat.total}` : '?', gate: !!(y.compat && y.compat.supported === y.compat.total && !(y.compat.newGaps || []).length) } : null;
  }
  return out;
}

/** Ocena YouTube względem kontroli (seek A/B). INCONCLUSIVE, gdy nie da się ocenić – nigdy PASS bez dowodu. */
export function classifyYouTube(none, cb) {
  const res = [];
  const add = (id, status, detail) => res.push({ id, status, detail });
  if (!cb || cb.skip || cb.error) { add('yt', 'INCONCLUSIVE', (cb && (cb.skip || cb.error)) || 'brak danych'); return res; }
  const ctrl = none && !none.skip && !none.error ? none : null;
  if (cb.playing) add('yt-player', 'PASS', `player i wideo, odtwarzanie +${cb.progressS} s`);
  else if (ctrl && !ctrl.playing) add('yt-player', 'INCONCLUSIVE', `nie startuje także bez Apex AdBlocker (+${cb.progressS} s)`);
  else add('yt-player', 'BREAKAGE', `odtwarzanie nie postępuje z Apex AdBlocker (+${cb.progressS} s)${ctrl ? `, bez: +${ctrl.progressS} s` : ''}`);
  const seekCb = cb.seek && cb.seek.ok;
  const seekCtrl = ctrl && ctrl.seek && ctrl.seek.ok;
  if (seekCb) add('yt-seek', 'PASS', 'seek +60 s i wznowienie');
  else if (ctrl && !seekCtrl) add('yt-seek', 'INCONCLUSIVE', 'seek nie działa także bez Apex AdBlocker – nie przypisujemy rozszerzeniu');
  else if (!ctrl) add('yt-seek', 'INCONCLUSIVE', 'brak kontroli A/B');
  else add('yt-seek', 'BREAKAGE', 'seek nie działa tylko z Apex AdBlocker');
  if (cb.shorts) {
    if (cb.shorts.ok) add('yt-shorts', 'PASS', `Shorts +${cb.shorts.progressS} s`);
    else if (ctrl && ctrl.shorts && !ctrl.shorts.ok) add('yt-shorts', 'INCONCLUSIVE', 'Shorts nie działa także bez Apex AdBlocker');
    else add('yt-shorts', 'BREAKAGE', `Shorts nie odtwarza z Apex AdBlocker${cb.shorts.error ? ` (${cb.shorts.error})` : ''}`);
  }
  if (cb.adSeen) add('yt-ads', 'REAL_AD', 'reklama w playerze z Apex AdBlocker');
  else if (ctrl && ctrl.adSeen) add('yt-ads', 'PASS', 'reklama była bez Apex AdBlocker, z Apex AdBlocker nie');
  else add('yt-ads', 'INCONCLUSIVE', 'brak okazji reklamowej w tym przebiegu (to nie jest PASS)');
  if (cb.antiAdblock && !(ctrl && ctrl.antiAdblock)) add('yt-antiadblock', 'ANTI_ADBLOCK', 'komunikat anti-adblock YouTube tylko z Apex AdBlocker');
  else if (cb.antiAdblock) add('yt-antiadblock', 'INCONCLUSIVE', 'komunikat anti-adblock także bez Apex AdBlocker');
  else add('yt-antiadblock', 'PASS', 'brak komunikatu anti-adblock');
  if (cb.protection) add('yt-protection', cb.protection.status === 'ok' && cb.protection.gate ? 'PASS' : 'MANUAL_REVIEW', `YouTube Protection: ${cb.protection.status}, zgodność ${cb.protection.compat}`);
  return res;
}

function copyExtension(dest, sourceDir) {
  if (sourceDir) { fs.cpSync(sourceDir, dest, { recursive: true }); return; }
  for (const entry of EXTENSION_ENTRIES) {
    const src = path.join(ROOT, entry);
    if (fs.existsSync(src)) fs.cpSync(src, path.join(dest, entry), { recursive: true });
  }
}

async function launch(chromium, tmp, config, opts) {
  const ext = config === 'apex' ? path.join(tmp, 'ext') : null;
  if (ext && !fs.existsSync(ext)) { fs.mkdirSync(ext); copyExtension(ext, opts.extensionDir); }
  const context = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(tmp, `profile-${config}-`)), {
    headless: opts.headless, channel: 'chromium', viewport: { width: 1366, height: 800 }, locale: 'pl-PL', args: browserArgs(ext),
  });
  if (opts.onContext) await opts.onContext(context, config);
  let call = null;
  const info = { config };
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
    const o = await call({ type: 'options:get' });
    info.lists = o.lists.filter((l) => l.enabled).map((l) => l.id);
    info.version = o.version;
    for (const p of context.pages()) if (/welcome\/welcome\.html/.test(p.url())) await p.close().catch(() => {});
  }
  return { context, call, info };
}

export async function runSitesTest(opts) {
  const { log = console.log } = opts;
  const chromium = await loadPlaywright();
  const { sites, youtube } = loadSites(opts.sitesFile, opts);
  const outDir = path.join(opts.resultsDir, 'sites');
  const shotsDir = opts.screenshots ? path.join(outDir, 'shots') : null;
  fs.rmSync(path.join(outDir, 'shots'), { recursive: true, force: true });
  if (shotsDir) fs.mkdirSync(shotsDir, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-sites-'));
  const started = new Date();
  const rows = [];
  const runs = {};
  let yt = null;
  try {
    for (const c of CONFIGS) runs[c] = await launch(chromium, tmp, c, opts);
    for (const [i, site] of sites.entries()) {
      const results = {};
      for (const c of CONFIGS) {
        const shot = shotsDir ? path.join(shotsDir, `${String(i + 1).padStart(2, '0')}-${site.host.replace(/[^a-z0-9.-]/gi, '_')}-${c}.jpg`) : null;
        results[c] = await visitSite(runs[c].context, site, { shotPath: shot, settleMs: opts.settleMs });
      }
      const verdict = classifySite(results.none, results.apex);
      rows.push({ ...site, results, verdict, diff: diffOf(results.none, results.apex) });
      log(`  ${String(i + 1).padStart(2)}/${sites.length} ${site.host.padEnd(28)} ${verdict.status.padEnd(20)} ${verdict.reasons[0] || ''}`);
    }
    if (youtube && opts.youtube) {
      const none = await youtubeRun(runs.none.context, youtube, null);
      const cb = await youtubeRun(runs.apex.context, youtube, runs.apex.call);
      yt = { none, apex: cb, checks: classifyYouTube(none, cb) };
      for (const c of yt.checks) log(`  YouTube ${c.id.padEnd(15)} ${c.status.padEnd(14)} ${c.detail}`);
    }
  } finally {
    for (const r of Object.values(runs)) await r.context.close().catch(() => {});
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const report = {
    kind: 'apex-single-blocker-sites', version: 1,
    startedAt: started.toISOString(), finishedAt: new Date().toISOString(),
    environment: { os: `${os.type()} ${os.release()}`, node: process.version, headless: opts.headless },
    extension: runs.apex ? runs.apex.info : null,
    sites: rows, youtube: yt, summary: summarize(rows),
    note: 'Wynik automatyczny to wskazówka, nie ręczna ocena. Ostateczną ocenę wpisuje człowiek w latest.html.',
  };
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'latest.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'latest.txt'), formatTxt(report));
  fs.writeFileSync(path.join(outDir, 'latest.html'), formatHtml(report, outDir));
  return { report, outDir };
}

// ---------------------------------------------------------------------------------------------
// Raporty

const pct = (x) => (x === null || x === undefined ? '—' : `${String(x).replace('.', ',')}%`);

export function formatTxt(r) {
  const s = r.summary;
  const L = [];
  L.push('Apex AdBlocker – test jednego blockera na stronach (bez → z Apex AdBlocker)', '='.repeat(64));
  L.push(`Start: ${r.startedAt} · koniec: ${r.finishedAt} · ${r.environment.os} · Node ${r.environment.node}`);
  if (r.extension) L.push(`Apex AdBlocker ${r.extension.version || '?'} · listy: ${(r.extension.lists || []).join(', ')}`);
  L.push(r.note, '');
  L.push(`Strony: ${s.sites} · porównywalne (zgoda: brak banera albo odrzucona w obu): ${s.comparableSites}`);
  L.push('Wskazówki: ' + Object.entries(s.status).filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).join(' · '));
  L.push(`Reklamy (strony porównywalne, bez → z): ${AD_CLASSES.map((c) => `${c} ${s.ads[c].none} → ${s.ads[c].apex}`).join(' · ')}`);
  L.push(`Redukcja REAL_AD: ${pct(s.realAdReductionPct)} · strony z REAL_AD: ${s.sitesWithRealAds.none} → ${s.sitesWithRealAds.apex} · zablokowane żądania (z Apex AdBlocker): ${s.blockedRequests}`);
  L.push(`Challenge: także bez Apex AdBlocker ${s.challenge.both} · tylko z Apex AdBlocker ${s.challenge.apexOnly} · tylko w kontroli ${s.challenge.controlOnly}`);
  if (r.youtube) {
    L.push('', 'YouTube:');
    for (const c of r.youtube.checks) L.push(`  ${c.id.padEnd(15)} ${c.status.padEnd(14)} ${c.detail}`);
  }
  L.push('', 'Strony (wskazówka automatyczna; ręczna ocena: latest.html):');
  for (const row of r.sites) {
    L.push(`- ${row.host} [${row.category}] → ${row.verdict.status}: ${row.verdict.reasons.join('; ')}`);
    for (const c of CONFIGS) {
      const m = row.results[c];
      L.push(`    ${CONFIG_LABEL[c].padEnd(16)} ${!m ? '—' : m.error ? `BŁĄD: ${m.error}` : `HTTP ${m.status}, treść ${m.textLength}, zgoda ${m.consent ? m.consent.state : '?'}${m.consent && m.consent.clicked.length ? ` („${m.consent.clicked.join('”, „')}”)` : ''}, reklamy ${AD_CLASSES.map((k) => `${k}:${m.ads.counts[k]}`).join(' ')}, zablokowane ${m.requests.blocked}, hosty reklamowe ${m.requests.adHostLoaded}/${m.requests.adHostRequests}, JS ${m.pageErrors}${m.challenge ? `, challenge „${m.challenge}”` : ''}`}`);
    }
    if (row.knownCase) L.push(`    znany przypadek: ${row.knownCase}`);
  }
  return L.join('\n') + '\n';
}

const esc = (s) => String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function formatHtml(r, outDir) {
  const s = r.summary;
  const rel = (p) => (p ? path.relative(outDir, p).split(path.sep).join('/') : '');
  const statuses = Object.values(STATUS);
  const facts = (m) => {
    if (!m) return '—';
    if (m.error) return `<b>Błąd:</b> ${esc(m.error)}`;
    const ads = AD_CLASSES.filter((k) => m.ads.counts[k]).map((k) => `${k} ${m.ads.counts[k]}`).join(', ') || 'brak';
    return `HTTP ${esc(m.status)} · treść ${m.textLength} · zgoda: <b>${esc(m.consent && m.consent.state)}</b>${m.consent && m.consent.clicked.length ? ` (${esc(m.consent.clicked.join(', '))})` : ''}${m.consent && m.consent.reason ? ` – ${esc(m.consent.reason)}` : ''}<br>reklamy: ${esc(ads)}<br>zablokowane: ${m.requests.blocked} · hosty reklamowe: ${m.requests.adHostLoaded}/${m.requests.adHostRequests} · JS: ${m.pageErrors}${m.challenge ? `<br><b>challenge:</b> ${esc(m.challenge)}` : ''}${m.antiAdblock ? `<br><b>anti-adblock:</b> ${esc(m.antiAdblock)}` : ''}${AD_CLASSES.some((k) => m.ads.samples[k].length) ? `<details><summary>elementy</summary><small>${AD_CLASSES.flatMap((k) => m.ads.samples[k].map((x) => `${k}: ${esc(x)}`)).join('<br>')}</small></details>` : ''}`;
  };
  const shot = (m) => (m && m.screenshot ? `<a href="${esc(rel(m.screenshot))}" target="_blank"><img src="${esc(rel(m.screenshot))}" alt="" loading="lazy"></a>` : '<div class="noshot">brak zrzutu</div>');
  const rows = r.sites.map((row) => {
    const key = esc(row.url);
    return `<section class="site st-${esc(row.verdict.status)}">
<header><a href="${esc(row.url)}" target="_blank" rel="noopener"><b>${esc(row.host)}</b></a> <small>${esc(row.category)}</small> <span class="badge">${esc(row.verdict.status)}</span>
<select data-key="${key}"><option value="">ręczna ocena…</option>${statuses.map((x) => `<option>${x}</option>`).join('')}</select></header>
<p class="why">${esc(row.verdict.reasons.join(' · '))}</p>${row.knownCase ? `<p class="known">Znany przypadek: ${esc(row.knownCase)}</p>` : ''}
<div class="pair"><figure><figcaption>${CONFIG_LABEL.none}</figcaption>${shot(row.results.none)}<div class="facts">${facts(row.results.none)}</div></figure>
<figure><figcaption>${CONFIG_LABEL.apex}</figcaption>${shot(row.results.apex)}<div class="facts">${facts(row.results.apex)}</div></figure></div>
<input class="note" data-note="${key}" placeholder="notatka (opcjonalnie)">
</section>`;
  }).join('\n');
  const yt = r.youtube ? `<table><tr><th>Sprawdzenie</th><th>Wskazówka</th><th>Szczegóły</th></tr>${r.youtube.checks.map((c) => `<tr><td>${esc(c.id)}</td><td>${esc(c.status)}</td><td>${esc(c.detail)}</td></tr>`).join('')}</table>` : '<p>Pominięto.</p>';
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Apex AdBlocker – test stron</title>
<style>
:root{--bg:#fff;--fg:#1d1d22;--mut:#66666e;--line:#ddd;--card:#fafafa;--ok:#1f9d55;--bad:#d14343;--warn:#b7791f}
@media (prefers-color-scheme:dark){:root{--bg:#17171b;--fg:#ececf1;--mut:#a0a0aa;--line:#33333a;--card:#1f1f25;--ok:#4cc785;--bad:#ff7a7a;--warn:#e0b050}}
body{background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,sans-serif;margin:16px;max-width:1500px}h1{font-size:20px}h2{font-size:16px;margin-top:24px}
table{border-collapse:collapse;margin:8px 0}th,td{border:1px solid var(--line);padding:5px 8px;text-align:left;vertical-align:top}small,.mut{color:var(--mut)}
.site{border:1px solid var(--line);border-radius:10px;padding:10px;margin:14px 0;background:var(--card)}.site header{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.badge{font-weight:700;padding:2px 8px;border-radius:999px;border:1px solid var(--line)}.st-PASS .badge{color:var(--ok)}.st-REAL_AD .badge,.st-BREAKAGE .badge,.st-ANTI_ADBLOCK .badge{color:var(--bad)}.st-EMPTY_AD_SLOT .badge,.st-BOT_CHALLENGE .badge,.st-CONSENT_INCONCLUSIVE .badge,.st-MANUAL_REVIEW .badge,.st-SITE_ERROR .badge{color:var(--warn)}
.why{margin:6px 0}.known{margin:4px 0;color:var(--warn)}.pair{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media (max-width:800px){.pair{grid-template-columns:1fr}}
figure{margin:0}figcaption{font-weight:600;margin-bottom:4px}img{width:100%;border:1px solid var(--line);border-radius:6px}.noshot{padding:40px;text-align:center;border:1px dashed var(--line)}
.facts{font-size:12.5px;margin-top:4px}.note{width:100%;margin-top:6px;font:inherit;padding:4px}button,select{font:inherit}button{padding:6px 12px;margin-right:8px}
</style></head><body>
<h1>Apex AdBlocker – test jednego blockera na stronach</h1>
<p class="mut">${esc(r.startedAt)} – ${esc(r.finishedAt)} · ${esc(r.environment.os)}${r.extension ? ` · Apex AdBlocker ${esc(r.extension.version)} (${esc((r.extension.lists || []).join(', '))})` : ''}. ${esc(r.note)} Oceny i notatki zapisują się w tej przeglądarce; „Eksportuj oceny” zapisuje plik JSON.</p>
<h2>Podsumowanie (bez → z Apex AdBlocker)</h2>
<table><tr><th>Strony</th><td>${s.sites} (porównywalne pod względem zgody: ${s.comparableSites})</td></tr>
<tr><th>Wskazówki</th><td>${Object.entries(s.status).filter(([, n]) => n).map(([k, n]) => `${k}: ${n}`).join(' · ')}</td></tr>
${AD_CLASSES.map((c) => `<tr><th>${c}</th><td>${s.ads[c].none} → ${s.ads[c].apex}</td></tr>`).join('')}
<tr><th>Redukcja REAL_AD</th><td>${pct(s.realAdReductionPct)} · strony z REAL_AD: ${s.sitesWithRealAds.none} → ${s.sitesWithRealAds.apex}</td></tr>
<tr><th>Challenge</th><td>także bez Apex AdBlocker: ${s.challenge.both} · tylko z Apex AdBlocker: ${s.challenge.apexOnly} · tylko w kontroli: ${s.challenge.controlOnly}</td></tr></table>
<h2>Ręczna ocena</h2><div id="manual"></div><p><button id="export">Eksportuj oceny (JSON)</button><button id="clear">Wyczyść oceny</button></p>
<h2>YouTube</h2>${yt}
<h2>Strony</h2>
${rows}
<script>
const KEY = 'apex-sites-' + ${JSON.stringify(r.startedAt)};
const STATUSES = ${JSON.stringify(statuses)};
let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { saved = {}; }
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} };
const sels = [...document.querySelectorAll('select[data-key]')];
const notes = [...document.querySelectorAll('input[data-note]')];
function renderManual() {
  const n = (v) => sels.filter((s) => s.value === v).length;
  document.getElementById('manual').innerHTML = '<table><tr>' + STATUSES.map((v) => '<th>' + v + '</th>').join('') + '<th>bez oceny</th></tr><tr>' + STATUSES.map((v) => '<td>' + n(v) + '</td>').join('') + '<td>' + n('') + '</td></tr></table>';
}
for (const s of sels) { const v = (saved[s.dataset.key] || {}).verdict; if (v) s.value = v; s.addEventListener('change', () => { (saved[s.dataset.key] ||= {}).verdict = s.value; persist(); renderManual(); }); }
for (const i of notes) { const v = (saved[i.dataset.note] || {}).note; if (v) i.value = v; i.addEventListener('input', () => { (saved[i.dataset.note] ||= {}).note = i.value; persist(); }); }
renderManual();
document.getElementById('export').addEventListener('click', () => {
  const data = { kind: 'apex-sites-manual', run: ${JSON.stringify(r.startedAt)}, verdicts: saved };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'oceny-stron.json';
  a.click();
});
document.getElementById('clear').addEventListener('click', () => { saved = {}; persist(); sels.forEach((s) => { s.value = ''; }); notes.forEach((i) => { i.value = ''; }); renderManual(); });
</script></body></html>
`;
}

export async function main(argv = process.argv.slice(2)) {
  const opts = parseSitesArgs(argv);
  if (opts.extensionDir && !fs.existsSync(path.join(opts.extensionDir, 'manifest.json'))) {
    console.log(`Brak manifest.json w ${opts.extensionDir}`);
    return 2;
  }
  console.log('Apex AdBlocker – test jednego blockera na prawdziwych stronach (bez → z Apex AdBlocker; tymczasowe profile, bez Twoich danych).');
  console.log('To potrwa ok. 30–45 min (dwie przeglądarki, każda strona po kolei w obu).');
  const { report, outDir } = await runSitesTest({ ...opts, log: console.log });
  console.log('\n' + formatTxt(report).split('\nStrony (wskazówka')[0]);
  console.log(`Raport: ${path.join(outDir, 'latest.html')} (zrzuty obok siebie + ręczna ocena), latest.txt, latest.json`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().then((code) => { process.exitCode = code; }).catch((e) => { console.error(e); process.exitCode = 2; });
}
