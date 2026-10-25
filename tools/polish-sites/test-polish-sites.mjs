#!/usr/bin/env node
// ChromeBlock – test polskich stron z załadowanym ChromeBlock (podstawa ChromeBlock Polish Supplement).
//
//   npm run test:polish-sites                       domyślna próbka (tools/polish-sites/sites.json, maks. 20)
//   npm run test:polish-sites -- onet.pl wp.pl      wybrane domeny
//   npm run test:polish-sites -- --headed           z widocznym oknem przeglądarki
//   npm run test:polish-sites -- --fixture          tryb offline na stronach testowych (samosprawdzenie narzędzia)
//   npm run test:polish-sites -- --gap-mode         GAP: tymczasowy build BEZ Polskich Filtrów (MajkiIT / Certyficate IT)
//   npm run test:polish-sites -- --evidence         zrzuty ekranu obserwacji: tests/polish-sites/results/evidence/<domena>-<nr>.png
//                                                   (+ <domena>-<nr>-context.png z otoczeniem); bez HTML strony i cookies
//
// --gap-mode buduje rozszerzenie testowe w katalogu tymczasowym z konfiguracji list, z której
// usunięte są wyłącznie źródła pl/ (pliki Polskich Filtrów nie są nawet wczytywane). EasyList,
// uBlock filters, EasyPrivacy, pozostałe listy i ChromeBlock Polish Supplement – bez zmian.
// Normalny build i pliki w repozytorium nie są zmieniane; katalog tymczasowy jest usuwany po teście.
//
// Dla każdej strony: liczba żądań zablokowanych przez ChromeBlock, widoczne etykiety reklam /
// treści sponsorowanej, puste kontenery z taką etykietą, puste ramki po zablokowanych żądaniach,
// błędy JS, czy strona się wyświetla. Wynik: tests/polish-sites/results/latest.{txt,json}.
//
// Narzędzie NIE generuje reguł i NIE klika okien zgody. Profil przeglądarki jest tymczasowy
// (bez historii, loginów i cookies użytkownika) i usuwany po teście.
// Kody wyjścia: 0 – test wykonany; 2 – błąd narzędzia; 3 – żadna strona nie była osiągalna.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, EXTENSION_ENTRIES } from '../chromium-smoke.mjs';
import { observationsFor, pageVerdict, topHosts, formatReport, isThirdParty, hostOf, siteUrl, AD_LABELS } from './analyze.mjs';
import { LISTS } from '../lists-config.mjs';
import { buildAll } from '../build.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const MAX_SITES = 20;

/** Źródła Polskich Filtrów (MajkiIT / Certyficate IT) – wyłączane w trybie GAP. */
export const UPSTREAM_POLISH_SOURCE = /^pl\//;
export const GAP_MODE_LABEL = 'GAP — without MajkiIT Polish Filters';

/** Konfiguracja list dla trybu GAP: jak normalna, bez źródeł pl/ (tylko w buildzie testowym). */
export function gapLists(lists = LISTS) {
  return lists.map((l) => {
    const sources = l.sources.filter((s) => !UPSTREAM_POLISH_SOURCE.test(s.file));
    if (sources.length === l.sources.length) return l;
    return { ...l, desc: `${l.desc} [GAP: bez Polskich Filtrów]`, sources };
  });
}

/** Buduje reguły/dane/scriptlety trybu GAP do katalogu rozszerzenia testowego (nie do repozytorium). */
export function buildGapExtension(extDir, { lists = gapLists(), listsDir } = {}) {
  if (path.resolve(extDir) === path.resolve(ROOT)) throw new Error('build GAP nie może nadpisać repozytorium');
  buildAll({ root: ROOT, outDir: extDir, lists, listsDir, log: () => {} });
  return lists.find((l) => l.id === 'ads').sources.map((s) => s.file);
}

/**
 * Wykonuje funkcję w IZOLOWANYM świecie strony (CDP Page.createIsolatedWorld), a nie w świecie strony.
 *
 * Dlaczego nie page.evaluate: Playwright wykonuje page.evaluate w świecie strony przez
 * `globalThis.eval(expression)`. Jeśli strona (albo scriptlet, np. noeval) podmieni window.eval,
 * page.evaluate kończy się „TypeError: result is not a function”, a analiza się nie wykonuje.
 * Izolowany świat ma własne obiekty globalne (podmiany strony go nie dotyczą), ale ten sam DOM.
 * fn musi być samodzielna (bez domknięć); arg – wartość serializowalna do JSON.
 */
export async function evaluateIsolated(page, fn, arg) {
  const cdp = await page.context().newCDPSession(page);
  try {
    const { frameTree } = await cdp.send('Page.getFrameTree');
    const { executionContextId } = await cdp.send('Page.createIsolatedWorld', { frameId: frameTree.frame.id, worldName: 'chromeblock-polish-sites' });
    const expression = `(${fn.toString()})(${arg === undefined ? '' : JSON.stringify(arg)})`;
    const r = await cdp.send('Runtime.evaluate', { expression, contextId: executionContextId, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      throw new Error(`analiza w stronie: ${(d.exception && d.exception.description) || d.text || 'wyjątek'}`.split('\n')[0]);
    }
    return r.result.value;
  } finally {
    await cdp.detach().catch(() => {});
  }
}

/** Zbieranie danych w stronie (bez kopiowania treści: tylko etykieta, opis elementu, rozmiar). */
export function collectInPage(labels) {
  const LABELS = new Set(labels);
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase().replace(/[:·•|]+$/, '').trim();
  const visible = (el) => {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05;
  };
  const desc = (el) => {
    if (!el || el.nodeType !== 1) return '';
    let s = el.tagName.toLowerCase();
    if (el.id) s += `#${el.id.slice(0, 40)}`;
    const cls = [...el.classList].slice(0, 3).map((c) => c.slice(0, 30));
    if (cls.length) s += `.${cls.join('.')}`;
    return s;
  };
  const path3 = (el) => { const parts = []; let e = el; for (let i = 0; e && e.nodeType === 1 && i < 3; i++, e = e.parentElement) parts.unshift(desc(e)); return parts.join(' > '); };
  const mediaIn = (el) => [...el.querySelectorAll('img,iframe,video,canvas,picture,svg')].some((m) => { const r = m.getBoundingClientRect(); return r.width > 30 && r.height > 30 && visible(m); });
  const out = { labels: [], frames: [], title: document.title || '', textLength: (document.body && document.body.innerText || '').length, consentDialog: false };
  // etykiety: element, którego CAŁY widoczny tekst to etykieta reklamy
  const all = document.body ? document.body.querySelectorAll('*') : [];
  for (const el of all) {
    if (out.labels.length >= 40) break;
    if (el.children.length > 2) continue;
    const t = el.innerText;
    if (!t || t.length > 40) continue;
    const n = norm(t);
    if (!LABELS.has(n) || !visible(el)) continue;
    if ([...el.children].some((ch) => norm(ch.innerText) === n)) continue; // ten sam tekst niżej – bierzemy najniższy element
    // kontener: najbliższy przodek o rozmiarze typowego boksu (nie cała strona)
    let c = el.parentElement;
    for (let i = 0; c && c !== document.body && i < 5; i++, c = c.parentElement) { const r = c.getBoundingClientRect(); if (r.width >= 120 && r.height >= 50) break; }
    if (!c || c === document.body || c === document.documentElement) c = el;
    const r = c.getBoundingClientRect();
    const otherText = Math.max(0, norm(c.innerText).length - n.length);
    // znaczniki tylko do zrzutu ekranu dowodu (tryb --evidence); nic nie jest zapisywane ze strony
    const idx = out.labels.length;
    el.setAttribute('data-cb-evidence-label', String(idx));
    c.setAttribute('data-cb-evidence-c', `${c.getAttribute('data-cb-evidence-c') || ''} ${idx}`.trim());
    out.labels.push({
      label: n, el: path3(el),
      container: { desc: path3(c), w: r.width, h: r.height, media: mediaIn(c), otherText },
      inFooter: !!el.closest('footer, [role="contentinfo"]'),
      viewport: { w: window.innerWidth, h: window.innerHeight },
      page: { w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight },
    });
  }
  for (const f of document.querySelectorAll('iframe')) {
    const r = f.getBoundingClientRect();
    if (r.width < 50 || r.height < 50 || !visible(f)) continue;
    out.frames.push({ desc: path3(f), w: r.width, h: r.height, src: f.src || '' });
    if (out.frames.length >= 40) break;
  }
  for (const d of document.querySelectorAll('[role="dialog"],[role="alertdialog"],dialog[open],[id*="cmp" i],[class*="consent" i]')) {
    if (visible(d) && /zgod|cookie|prywatno|consent|RODO/i.test(d.innerText || '')) { out.consentDialog = true; break; }
  }
  return out;
}

async function testSite(context, domain, { timeout, log, evidenceDir = null }) {
  const url = siteUrl(domain);
  const page = await context.newPage();
  const requests = [];
  const blocked = new Set();
  const jsErrors = [];
  let consoleErrors = 0;
  page.on('request', (r) => requests.push(r.url()));
  page.on('requestfailed', (r) => { if (/ERR_BLOCKED_BY_CLIENT/.test((r.failure() || {}).errorText || '')) blocked.add(r.url()); });
  page.on('pageerror', (e) => jsErrors.push(String((e && e.message) || e).split('\n')[0].slice(0, 120)));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors++; });
  let gotoError = null;
  let analysisError = null;
  let status = 0;
  let snap = { labels: [], frames: [], title: '', textLength: 0, consentDialog: false };
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    status = resp ? resp.status() : 0;
  } catch (e) {
    gotoError = String((e && e.message) || e).split('\n')[0];
  }
  if (!gotoError) {
    // analiza w izolowanym świecie – odporna na podmianę window.eval itp. przez stronę
    try {
      await page.waitForLoadState('load', { timeout: Math.min(timeout, 20000) }).catch(() => {});
      // przewinięcie – reklamy ładowane leniwie
      for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 1200).catch(() => {}); await page.waitForTimeout(700); }
      await evaluateIsolated(page, () => window.scrollTo(0, 0)).catch(() => {});
      await page.waitForTimeout(1500);
      snap = await evaluateIsolated(page, collectInPage, AD_LABELS);
    } catch (e) {
      analysisError = String((e && e.message) || e).split('\n')[0];
    }
  }
  const pageHost = hostOf(url);
  const third = requests.filter((u) => /^https?:/.test(u) && isThirdParty(u, pageHost));
  const verdict = pageVerdict({ gotoError, analysisError, status, textLength: snap.textLength, title: snap.title });
  const result = {
    domain, url, verdict,
    requests: { total: requests.length, thirdParty: third.length, blocked: blocked.size },
    blockedHosts: topHosts([...blocked], 10),
    unblockedThirdPartyHosts: topHosts(third.filter((u) => !blocked.has(u)), 10),
    jsErrors: { count: jsErrors.length, samples: jsErrors.slice(0, 3) },
    consoleErrors,
    consentDialog: !!snap.consentDialog,
    observations: gotoError || analysisError ? [] : observationsFor(domain, snap, blocked),
  };
  if (evidenceDir && !gotoError && !analysisError) await captureEvidence(page, result.observations, evidenceDir);
  log(`  ${verdict.status.padEnd(11)} ${domain}: zablokowane ${blocked.size}/${requests.length}, obserwacje ${result.observations.length}, błędy JS ${jsErrors.length}`);
  await page.close().catch(() => {});
  return result;
}

// --- tryb --evidence: zrzuty ekranu obserwacji ----------------------------------------------------
export const EVIDENCE_KINDS = ['ad-label', 'empty-ad-container'];
const CONTEXT_MARGIN = 120;

/** Zrzut elementu + zrzut z niewielkim otoczeniem dla obserwacji ad-label / empty-ad-container. */
export async function captureEvidence(page, observations, evidenceDir) {
  fs.mkdirSync(evidenceDir, { recursive: true });
  for (const o of observations) {
    if (!EVIDENCE_KINDS.includes(o.kind) || o.labelIndex === undefined) continue;
    const n = o.id.split('#').pop();
    const base = `${o.domain}-${n}`;
    // dla podejrzanych (ogromnych) kontenerów zrzut samej etykiety – nie całej strony
    const huge = (o.false_positive_reasons || []).some((r) => /stron|duży/.test(r));
    const target = page.locator(huge ? `[data-cb-evidence-label="${o.labelIndex}"]` : `[data-cb-evidence-c~="${o.labelIndex}"]`).first();
    const ev = { element: null, context: null };
    try {
      await target.scrollIntoViewIfNeeded({ timeout: 5000 });
      await target.screenshot({ path: path.join(evidenceDir, `${base}.png`), timeout: 10000 });
      ev.element = `evidence/${base}.png`;
    } catch (e) { ev.error = `zrzut elementu: ${String((e && e.message) || e).split('\n')[0].slice(0, 120)}`; }
    try {
      const box = await target.boundingBox();
      const vp = page.viewportSize() || { width: 1366, height: 900 };
      if (box) {
        const x = Math.max(0, box.x - CONTEXT_MARGIN);
        const y = Math.max(0, box.y - CONTEXT_MARGIN);
        const w = Math.min(vp.width - x, box.width + 2 * CONTEXT_MARGIN);
        const h = Math.min(vp.height - y, box.height + 2 * CONTEXT_MARGIN);
        if (w > 0 && h > 0) {
          await page.screenshot({ path: path.join(evidenceDir, `${base}-context.png`), clip: { x, y, width: w, height: h }, timeout: 10000 });
          ev.context = `evidence/${base}-context.png`;
        }
      }
    } catch (e) { ev.error = `${ev.error ? `${ev.error}; ` : ''}zrzut otoczenia: ${String((e && e.message) || e).split('\n')[0].slice(0, 120)}`; }
    o.evidence = ev;
  }
}

// --- tryb fixture: strony testowe bez sieci ------------------------------------------------------
export const FIXTURE_SITES = ['fixture-a.example', 'fixture-b.example', 'fixture-c.example', 'fixture-d.example'];
const FIXTURE_HTML = {
  'www.fixture-a.example': `<!doctype html><title>Fixture A</title><body>
    <p>${'Treść artykułu testowego. '.repeat(20)}</p>
    <div id="slot1" style="width:300px;height:250px"><span>REKLAMA</span></div>
    <div class="promo-box" style="width:300px;height:120px"><span>Sponsorowane</span><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="200" height="80"></div>
    <div class="ad-slot ad-banner" style="width:300px;height:100px">zwykły blok bez etykiety</div>
    <iframe src="https://ads.doubleclick.net/fixture-frame" width="300" height="250"></iframe>
  </body>`,
  'www.fixture-b.example': `<!doctype html><title>Fixture B</title><body><p>${'Druga strona testowa. '.repeat(20)}</p>
    <script>throw new Error('fixture-js-error')</script></body>`,
  // typowe false positive: link „Reklama” w stopce i etykieta w ogromnym kontenerze
  'www.fixture-c.example': `<!doctype html><title>Fixture C</title><body>
    <p>${'Trzecia strona testowa. '.repeat(20)}</p>
    <div id="huge" style="width:100%;height:4000px"><span>Reklama</span></div>
    <footer style="height:80px"><span>Reklama</span> | <span>Kontakt</span> | <span>Regulamin</span></footer>
  </body>`,
  // strona podmieniająca window.eval (jak scriptlet noeval / skrypty anty-adblock) – page.evaluate
  // Playwright kończy się wtedy „TypeError: result is not a function”; analiza musi nadal działać
  'www.fixture-d.example': `<!doctype html><title>Fixture D</title><body>
    <script>window.eval = function () { return undefined; };</script>
    <p>${'Czwarta strona testowa. '.repeat(20)}</p>
    <div id="slot-d" style="width:300px;height:250px"><span>Reklama</span></div>
  </body>`,
};

export async function run({ domains, headed = false, fixture = false, gap = false, evidence = false, timeout = 45000, log = console.log, outDir = path.join(ROOT, 'tests', 'polish-sites', 'results'), write = true } = {}) {
  const chromium = await loadPlaywright({ root: ROOT });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-polish-'));
  const ext = path.join(tmp, 'ext');
  fs.mkdirSync(ext);
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  let adsSources = LISTS.find((l) => l.id === 'ads').sources.map((s) => s.file);
  if (gap) {
    try { adsSources = buildGapExtension(ext); } catch (e) { fs.rmSync(tmp, { recursive: true, force: true }); throw e; }
    log(`MODE: ${GAP_MODE_LABEL} (ads: ${adsSources.join(', ')})`);
  }
  const context = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: !headed, channel: 'chromium', viewport: { width: 1366, height: 900 }, locale: 'pl-PL',
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'],
  });
  try {
    if (fixture) {
      await context.route(/^https?:/, (r) => {
        const h = hostOf(r.request().url());
        return FIXTURE_HTML[h] ? r.fulfill({ contentType: 'text/html; charset=utf-8', body: FIXTURE_HTML[h] }) : r.fulfill({ status: 204, body: '' });
      });
    }
    let [sw] = context.serviceWorkers();
    if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 30000 });
    // zamknij kartę powitalną (świeży profil = świeża instalacja) i poczekaj na gotowość reguł
    await new Promise((r) => setTimeout(r, 1500));
    for (const p of context.pages()) if (/welcome\/welcome\.html/.test(p.url())) await p.close().catch(() => {});
    const sites = [];
    const evidenceDir = evidence ? path.join(outDir, 'evidence') : null;
    if (evidenceDir) {
      // poprzednie zrzuty (te same nazwy plików) – tylko *.png w folderze evidence
      fs.mkdirSync(evidenceDir, { recursive: true });
      for (const f of fs.readdirSync(evidenceDir)) if (f.endsWith('.png')) fs.rmSync(path.join(evidenceDir, f));
    }
    for (const d of domains) sites.push(await testSite(context, d, { timeout, log, evidenceDir }));
    const result = { date: new Date().toISOString(), version: manifest.version_name || manifest.version, fixture, mode: gap ? 'gap' : 'normal', modeLabel: gap ? GAP_MODE_LABEL : 'NORMAL — all lists (with MajkiIT Polish Filters)', adsSources, evidence: !!evidence, evidenceDir, extDir: ext, sites };
    if (write) {
      fs.mkdirSync(outDir, { recursive: true });
      const stamp = result.date.replace(/[:.]/g, '-');
      fs.writeFileSync(path.join(outDir, 'latest.json'), JSON.stringify(result, null, 2));
      fs.writeFileSync(path.join(outDir, `polish-sites-${stamp}.json`), JSON.stringify(result, null, 2));
      fs.writeFileSync(path.join(outDir, 'latest.txt'), formatReport(result) + '\n');
    }
    return result;
  } finally {
    await context.close().catch(() => {});
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

export function parseArgs(argv) {
  const o = { domains: [], headed: false, fixture: false, gap: false, evidence: false };
  for (const a of argv) {
    if (a === '--headed') o.headed = true;
    else if (a === '--fixture') o.fixture = true;
    else if (a === '--gap-mode') o.gap = true;
    else if (a === '--evidence') o.evidence = true;
    else if (!a.startsWith('--')) o.domains.push(a.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, ''));
  }
  if (o.fixture) o.domains = FIXTURE_SITES.slice();
  if (!o.domains.length) o.domains = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'polish-sites', 'sites.json'), 'utf8')).sites;
  o.domains = [...new Set(o.domains)].filter((d) => siteUrl(d)).slice(0, MAX_SITES);
  return o;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const opts = parseArgs(process.argv.slice(2));
  console.log(`ChromeBlock – test polskich stron: ${opts.domains.length} ${opts.fixture ? '(fixture)' : ''}${opts.gap ? ` [${GAP_MODE_LABEL}]` : ''}`);
  run(opts).then((r) => {
    console.log('\n' + formatReport(r));
    console.log('\nRaport: tests/polish-sites/results/latest.txt');
    process.exit(r.sites.some((s) => s.verdict.status !== 'UNREACHABLE') ? 0 : 3);
  }, (e) => { console.error('Błąd narzędzia:', e && e.stack || e); process.exit(2); });
}
