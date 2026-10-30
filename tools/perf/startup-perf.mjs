#!/usr/bin/env node
// Apex AdBlocker – benchmark startu rozszerzenia w prawdziwym Chromium.
//
//   node tools/perf/startup-perf.mjs [--runs 3] [--tabs 4] [--out wynik.json] [--root katalog-rozszerzenia]
//
// Scenariusze (każdy przebieg w świeżym, tymczasowym profilu):
//   A. świeże załadowanie rozpakowanego rozszerzenia (onInstalled: install)
//   B. przeładowanie rozszerzenia przy otwartych kartach (↻ w chrome://extensions → onInstalled: update)
//   C. ponowny start przeglądarki z już zarejestrowanymi scriptletami (onStartup)
//
// Mierzone:
//   - czas do uruchomienia service workera,
//   - czas do aktywnego DNR (karta-sonda co 50 ms wysyła żądanie do domeny reklamowej;
//     „gotowy” = żądanie zablokowane przez Apex AdBlocker),
//   - czas do pełnego health OK i całkowity czas startu (profil etapów z service workera),
//   - wpływ na przeglądarkę: maks. i łączne opóźnienie pętli zdarzeń w otwartych kartach,
//   - łączny czas CPU wszystkich procesów Chromium w oknie startu (Linux: /proc).
// Bez dostępu do sieci: strony są serwowane lokalnie, pozostałe żądania przerywane.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, EXTENSION_ENTRIES, ROOT } from '../chromium-smoke.mjs';

const arg = (name, def) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : def; };
const RUNS = Number(arg('--runs', 3));
const TABS = Number(arg('--tabs', 4));
const OUT = arg('--out', '');
// --root <katalog>: inne drzewo rozszerzenia (np. wersja „przed” do porównania)
const SRC = path.resolve(arg('--root', ROOT));
const BLOCKED_PROBE = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

const PROBE_HTML = `<!doctype html><meta charset="utf-8"><title>probe</title><body>
<div id="x"></div>
<script>
  // opóźnienie pętli zdarzeń (miarą „zawieszenia” przeglądarki dla tej karty)
  window.__lag = { max: 0, total: 0, samples: 0 };
  let last = performance.now();
  setInterval(() => {
    const t = performance.now(); const lag = Math.max(0, t - last - 20); last = t;
    __lag.samples++; __lag.total += lag; if (lag > __lag.max) __lag.max = lag;
    document.getElementById('x').textContent = String(__lag.samples);
  }, 20);
  window.__resetLag = () => { __lag = { max: 0, total: 0, samples: 0 }; last = performance.now(); };
  // sonda DNR: kiedy żądanie do domeny reklamowej zaczyna być blokowane
  window.__dnr = { blockedAt: null, start: performance.now() };
  window.__startDnrProbe = () => {
    __dnr = { blockedAt: null, start: performance.now() };
    const tick = () => fetch('${BLOCKED_PROBE}?t=' + Math.random(), { cache: 'no-store', mode: 'no-cors' })
      .then(() => setTimeout(tick, 50), () => { if (__dnr.blockedAt === null) __dnr.blockedAt = performance.now(); });
    tick();
  };
</script>`;

function chromeCpuMs(marker) {
  if (process.platform !== 'linux') return null;
  const tck = 100; // USER_HZ
  let total = 0;
  for (const pid of fs.readdirSync('/proc').filter((d) => /^\d+$/.test(d))) {
    try {
      const cmd = fs.readFileSync(`/proc/${pid}/cmdline`, 'utf8');
      if (!cmd.includes(marker)) continue;
      const f = fs.readFileSync(`/proc/${pid}/stat`, 'utf8').split(') ')[1].split(' ');
      total += (Number(f[11]) + Number(f[12])) * (1000 / tck);
    } catch { /* proces zakończony */ }
  }
  return total;
}

function copyExtension(dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(SRC, e))) fs.cpSync(path.join(SRC, e), path.join(dest, e), { recursive: true });
}

async function launch(chromium, tmp) {
  const ext = path.join(tmp, 'extension');
  const context = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true,
    channel: 'chromium',
    ignoreDefaultArgs: ['--disable-extensions'],
    args: [`--load-extension=${ext}`, '--no-first-run',
      '--disable-component-update', '--disable-background-networking', '--disable-sync'],
  });
  await context.route(/^(https?|wss?):/, (route) => {
    const u = new URL(route.request().url());
    if (u.hostname.endsWith('.probe.test')) return route.fulfill({ contentType: 'text/html', body: PROBE_HTML });
    if (u.hostname === 'pagead2.googlesyndication.com') return route.fulfill({ contentType: 'text/javascript', body: '//' });
    return route.abort();
  });
  return context;
}

/** Service worker rozszerzenia: zdarzenie albo odpytywanie (SW mógł wystartować przed nasłuchem). */
async function waitServiceWorker(context, timeout = 60000) {
  const end = Date.now() + timeout;
  for (;;) {
    const [sw] = context.serviceWorkers();
    if (sw) return sw;
    if (Date.now() > end) throw new Error('service worker rozszerzenia nie wystartował');
    await Promise.race([context.waitForEvent('serviceworker', { timeout: 250 }).catch(() => null), new Promise((r) => setTimeout(r, 250))]);
  }
}

const optionsUrl = (id) => `chrome-extension://${id}/options/options.html`;

async function waitProfile(page, { reason, timeout = 240000 }) {
  const end = Date.now() + timeout;
  for (;;) {
    const r = await page.evaluate(() => chrome.runtime.sendMessage({ type: 'startup:profile' })).catch(() => null);
    const p = r && r.profile;
    if (p && p.totalMs !== null && (!reason || p.reason.includes(reason))) return p;
    if (Date.now() > end) return p || null;
    await page.waitForTimeout(250);
  }
}

async function openProbeTabs(context, n) {
  const tabs = [];
  for (let i = 0; i < n; i++) {
    const p = await context.newPage();
    await p.goto(`https://site${i}.probe.test/`);
    tabs.push(p);
  }
  return tabs;
}

async function lagOf(tabs) {
  const all = await Promise.all(tabs.map((t) => t.evaluate(() => ({ ...window.__lag })).catch(() => null)));
  const ok = all.filter(Boolean);
  return { maxMs: Math.round(Math.max(0, ...ok.map((l) => l.max))), totalMs: Math.round(ok.reduce((s, l) => s + l.total, 0)) };
}

async function scenario(chromium) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-startup-'));
  const marker = path.join(tmp, 'profile');
  const result = {};
  try {
    copyExtension(path.join(tmp, 'extension'));

    // ---- A: świeża instalacja
    let t0 = Date.now();
    let context = await launch(chromium, tmp);
    const sw = await waitServiceWorker(context);
    const swMs = Date.now() - t0;
    const id = new URL(sw.url()).host;
    const tabs = await openProbeTabs(context, TABS);
    await tabs[0].evaluate(() => window.__startDnrProbe());
    const opt = await context.newPage();
    await opt.goto(optionsUrl(id));
    const pA = await waitProfile(opt, { reason: 'install' });
    // D: ponowna synchronizacja bez zmian konfiguracji (np. zmiana ustawień, wybudzenie) –
    // zarejestrowany zestaw jest zgodny, więc nie powinno być żadnej rejestracji
    const tD = Date.now();
    const resync = await opt.evaluate(() => chrome.runtime.sendMessage({ type: 'health:resync' }));
    result.D = { resyncMs: Date.now() - tD, scriptlets: resync && resync.results && resync.results.scriptlets };
    // jak u użytkownika: tryb dewelopera włączony, przeładowanie przyciskiem ↻ w chrome://extensions
    const extPage = await context.newPage();
    await extPage.goto('chrome://extensions', { waitUntil: 'domcontentloaded' });
    await extPage.evaluate(() => chrome.developerPrivate.updateProfileConfiguration({ inDeveloperMode: true }));
    const dnrA = await tabs[0].evaluate(() => window.__dnr.blockedAt !== null);
    result.A = { swReadyMs: swMs, dnrBlocking: dnrA, profile: pA, wallMs: Date.now() - t0 };
    await opt.waitForTimeout(3000); // wyciszenie

    // ---- B: przeładowanie rozszerzenia przy otwartych kartach
    await Promise.all(tabs.map((t) => t.evaluate(() => window.__resetLag())));
    await tabs[0].evaluate(() => window.__startDnrProbe());
    const cpu0 = chromeCpuMs(marker);
    t0 = Date.now();
    const swNext = context.waitForEvent('serviceworker', { timeout: 60000 }).catch(() => null);
    await extPage.evaluate((i) => chrome.developerPrivate.reload(i, { failQuietly: true }), id);
    const sw2 = await swNext;
    const swB = sw2 ? Date.now() - t0 : null;
    const opt2 = await context.newPage();
    for (let i = 0; i < 100; i++) { try { await opt2.goto(optionsUrl(id)); break; } catch { await opt2.waitForTimeout(100); } }
    const pB = await waitProfile(opt2, { reason: 'update' });
    const wallB = Date.now() - t0;
    const lagB = await lagOf(tabs);
    const cpuB = cpu0 === null ? null : Math.round(chromeCpuMs(marker) - cpu0);
    const dnrB = await tabs[0].evaluate(() => (window.__dnr.blockedAt === null ? null : Math.round(window.__dnr.blockedAt - window.__dnr.start)));
    result.B = { swReadyMs: swB, dnrBlockingAfterMs: dnrB, profile: pB, wallMs: wallB, lag: lagB, chromeCpuMs: cpuB };
    await context.close();

    // ---- C: ponowny start przeglądarki (scriptlety już zarejestrowane)
    t0 = Date.now();
    context = await launch(chromium, tmp);
    // service worker może wystartować (onStartup) zanim Playwright podłączy się do zdarzeń –
    // gotowość mierzymy pierwszą odpowiedzią na wiadomość ze strony opcji
    const opt3 = await context.newPage();
    for (let i = 0; i < 300; i++) { try { await opt3.goto(optionsUrl(id)); break; } catch { await opt3.waitForTimeout(100); } }
    await opt3.evaluate(() => chrome.runtime.sendMessage({ type: 'startup:profile' }));
    const swC = Date.now() - t0;
    // Uwaga: Chrome uruchomiony z --load-extension zgłasza przy restarcie onInstalled: update
    // (rozszerzenie z wiersza poleceń jest wczytywane od nowa). Przy rozszerzeniu wczytanym
    // przez „Załaduj rozpakowane” restart to onStartup – ten przypadek sprawdza test jednostkowy.
    const pC = await waitProfile(opt3, { timeout: 240000 });
    result.C = { swReadyMs: swC, profile: pC, wallMs: Date.now() - t0 };
    await context.close();
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  return result;
}

const stage = (p, name) => { const s = p && p.stages.find((x) => x.name === name); return s ? s.totalMs : null; };
const calls = (p, name) => { const s = p && p.stages.find((x) => x.name === name); return s ? s.count : 0; };
const mark = (p, name) => (p && p.marks ? p.marks[name] ?? null : null);

export function summarizeRun(r) {
  const row = (key) => {
    const x = r[key];
    const p = x.profile;
    return {
      swReadyMs: x.swReadyMs,
      startupTotalMs: p ? p.totalMs : null,
      dnrReadyMs: mark(p, 'DNR gotowy'),
      scriptletsReadyMs: mark(p, 'scriptlety gotowe'),
      healthOkMs: mark(p, 'health OK'),
      syncScriptletsCalls: calls(p, 'syncScriptlets'),
      syncScriptletsMs: stage(p, 'syncScriptlets'),
      queueWaitMs: stage(p, 'syncScriptlets: oczekiwanie w kolejce'),
      registerCalls: calls(p, 'scriptlety: registerContentScripts'),
      getRegisteredCalls: calls(p, 'scriptlety: getRegisteredContentScripts'),
      register: stage(p, 'scriptlety: registerContentScripts'),
      unregister: stage(p, 'scriptlety: unregisterContentScripts'),
      cosmetic: stage(p, 'checkCosmeticData'),
      ...(x.lag ? { tabLagMaxMs: x.lag.maxMs, tabLagTotalMs: x.lag.totalMs } : {}),
      ...(x.chromeCpuMs !== undefined ? { chromeCpuMs: x.chromeCpuMs } : {}),
      ...(x.dnrBlockingAfterMs !== undefined ? { dnrBlockingAfterMs: x.dnrBlockingAfterMs } : {}),
    };
  };
  return { A: row('A'), B: row('B'), C: row('C'), D: { resyncMs: r.D ? r.D.resyncMs : null } };
}

const median = (xs) => { const s = xs.filter((x) => typeof x === 'number').sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };

async function main() {
  const chromium = await loadPlaywright();
  if (!chromium) { console.log('SKIP: Playwright/Chromium niedostępny'); return; }
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    process.stdout.write(`przebieg ${i + 1}/${RUNS}… `);
    const r = await scenario(chromium);
    runs.push(r);
    console.log('ok');
  }
  const sums = runs.map(summarizeRun);
  const med = {};
  for (const k of ['A', 'B', 'C', 'D']) {
    med[k] = {};
    for (const f of Object.keys(sums[0][k])) med[k][f] = median(sums.map((s) => s[k][f]));
  }
  console.log(JSON.stringify(med, null, 2));
  console.log('\nProfil etapów (ostatni przebieg, B: przeładowanie):');
  for (const s of runs.at(-1).B.profile ? runs.at(-1).B.profile.stages : []) console.log(`  ${s.name}: ${s.totalMs} ms${s.count > 1 ? ` (${s.count}×, maks. ${s.maxMs})` : ''}`);
  console.log('\nD (ponowna synchronizacja):', JSON.stringify(runs.at(-1).D));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ at: new Date().toISOString(), tabs: TABS, median: med, runs }, null, 2));
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) await main();
