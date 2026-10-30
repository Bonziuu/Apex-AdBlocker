#!/usr/bin/env node
// Apex AdBlocker – powtarzalny baseline rozmiaru i wydajności (narzędzie developerskie, NIE trafia do paczki).
//
//   npm run perf:baseline                     pełny pomiar (rozmiar + startup + runtime), raport w perf/results/
//   npm run perf:baseline -- --size-only      tylko rozmiar paczki (deterministyczny, bez Chromium)
//   npm run perf:baseline -- --runs 20        liczba mierzonych powtórzeń startupu (domyślnie 15, +1 rozgrzewka)
//   npm run perf:baseline -- --write-baseline zapisuje mały plik perf/baseline.json (świadomie, do commita)
//
// Metryki (szczegóły: docs/perf-baseline.md):
//   1. Rozmiar: dokładnie pliki z paczki rozszerzenia (packageDev → <tmp>/Apex AdBlocker), ZIP samego
//      rozszerzenia tą samą metodą co paczka (deflate poziom 9, stała data).
//   2A. Internal SW init: profiler z background.js (performance.now() w service workerze, czyli od
//       timeOrigin workera) do finishStartupProfile() przy świeżej instalacji (onInstalled: install,
//       z pierwszą synchronizacją). Restartu przeglądarki (onStartup) nie da się tu zmierzyć:
//       Chromium z --load-extension instaluje rozszerzenie od nowa przy każdym uruchomieniu.
//   2B. Fresh install → extension ready: zegar ścienny w Node od uruchomienia Chromium do chwili,
//       gdy profiler zapisał zakończony start. Obejmuje start przeglądarki, ładowanie unpacked
//       extension, instalację i Playwright – to NIE jest czas samego workera.
//   2C. Wybudzenie SW (eksperymentalne, zegar ścienny ze strony rozszerzenia): worker zatrzymany przez
//       CDP ServiceWorker.stopAllWorkers, potem pierwsza wiadomość; osobno options:get i cosmetic:init.
//   4. Runtime: stan po instalacji (rulesety, reguły, zarejestrowane scriptlety, dopasowanie content
//      scriptów do adresów). RAM nie jest mierzony (brak wiarygodnej metody dla SW w Playwright).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { packageDev, listFiles, createZip, PACKAGE_NAME } from './package-dev.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const BASELINE_FILE = 'perf/baseline.json';
export const RESULTS_DIR = 'perf/results';
export const DEFAULT_RUNS = 15;
export const SAMPLE_URLS = Object.freeze({ zwykła: 'https://example.com/artykul', youtube: 'https://www.youtube.com/watch?v=perfBaseline' });

// --- 1. Rozmiar ---------------------------------------------------------------------------------

/** Kategoria pliku paczki (rozłączne – suma kategorii = cała paczka). */
export function categoryOf(file) {
  const top = file.split('/')[0];
  if (top === 'rules') return 'rules/ (rulesety DNR)';
  if (top === 'data') return 'data/ (kosmetyka, scriptlety, metadane)';
  if (top === 'scriptlets') return 'scriptlets/ (wygenerowane scriptlety)';
  if (file === 'background.js' || ['background', 'shared', 'content', 'youtube'].includes(top)) return 'JS rozszerzenia (SW, content scripts, shared)';
  if (['popup', 'options', 'welcome'].includes(top)) return 'UI (popup, opcje, powitanie)';
  return 'ikony / zasoby / manifest';
}

const deflated = (buf) => zlib.deflateRawSync(buf, { level: 9 }).length;

/** Raport rozmiaru katalogu rozszerzenia. */
export function sizeReport(extDir, { top = 20 } = {}) {
  const files = listFiles(extDir).map((f) => {
    const data = fs.readFileSync(path.join(extDir, f));
    return { file: f, bytes: data.length, deflated: Math.min(deflated(data), data.length), category: categoryOf(f), sha: crypto.createHash('sha256').update(f).update('\0').update(data).digest() };
  });
  const total = files.reduce((n, f) => n + f.bytes, 0);
  const pct = (b) => Math.round((b / total) * 1000) / 10;
  const categories = {};
  for (const f of files) {
    const c = (categories[f.category] ||= { files: 0, bytes: 0, deflatedBytes: 0 });
    c.files++; c.bytes += f.bytes; c.deflatedBytes += f.deflated;
  }
  for (const c of Object.values(categories)) c.percent = pct(c.bytes);
  const zip = createZip(files.map((f) => ({ name: `${PACKAGE_NAME}/${f.file}`, data: fs.readFileSync(path.join(extDir, f.file)) })));
  const hash = crypto.createHash('sha256');
  for (const f of files) hash.update(f.sha);
  return {
    files: files.length,
    unpackedBytes: total,
    zipBytes: zip.length,
    zipMethod: 'deflate raw, poziom 9, stała data (jak tools/package-dev.mjs), tylko pliki rozszerzenia',
    packageSha256: hash.digest('hex'),
    categories: Object.fromEntries(Object.entries(categories).sort((a, b) => b[1].bytes - a[1].bytes)),
    jsBytes: files.filter((f) => f.file.endsWith('.js')).reduce((n, f) => n + f.bytes, 0),
    top: [...files].sort((a, b) => b.bytes - a.bytes || a.file.localeCompare(b.file)).slice(0, top)
      .map((f) => ({ file: f.file, bytes: f.bytes, percent: pct(f.bytes), deflatedBytes: f.deflated })),
    list: files.map((f) => f.file),
  };
}

/** Pliki, które nie powinny być w paczce (narzędzia, testy, raporty, ZIP-y, dokumentacja). */
// THIRD_PARTY_NOTICES.md (tylko w katalogu głównym paczki) to część dystrybucji: autorzy, źródła i licencje list
export const PACKAGE_DOCS = Object.freeze(['THIRD_PARTY_NOTICES.md']);

export function unwantedFiles(list) {
  return list.filter((f) => !PACKAGE_DOCS.includes(f)).filter((f) => /(^|\/)(tests?|tools|docs|perf|node_modules|\.git|dist|download|installer|_metadata)(\/|$)/.test(f)
    || /\.(zip|md|mjs|map|log|cmd)$/i.test(f) || /(^|\/)package(-lock)?\.json$/.test(f));
}

// --- statystyka ---------------------------------------------------------------------------------

/** Mediana, p95 (nearest-rank), min, max; zaokrąglenie do 0,1 ms. */
export function stats(values) {
  const v = values.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const r = (x) => Math.round(x * 10) / 10;
  const rank = (p) => v[Math.min(v.length - 1, Math.max(0, Math.ceil((p / 100) * v.length) - 1))];
  const mid = v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
  return { n: v.length, median: r(mid), p95: r(rank(95)), min: r(v[0]), max: r(v[v.length - 1]) };
}

// --- dopasowanie wzorców content scriptów -------------------------------------------------------

/** Wzorzec dopasowania Chrome (match pattern) → czy pasuje do adresu. */
export function matchesPattern(pattern, url) {
  if (pattern === '<all_urls>') return /^(https?|wss?|ftp|file|data):/.test(url);
  const m = /^(\*|https?|wss?|file|ftp|urn):\/\/([^/]*)(\/.*)$/.exec(pattern);
  if (!m) return false;
  let u;
  try { u = new URL(url); } catch { return false; }
  const scheme = u.protocol.slice(0, -1);
  if (m[1] === '*' ? !['http', 'https'].includes(scheme) : m[1] !== scheme) return false;
  const host = m[2];
  if (host !== '*') {
    if (host.startsWith('*.')) { const base = host.slice(2); if (u.hostname !== base && !u.hostname.endsWith('.' + base)) return false; } else if (u.hostname !== host) return false;
  }
  const re = new RegExp('^' + m[3].split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
  return re.test(u.pathname + u.search);
}

/** Content scripty (statyczne z manifestu + zarejestrowane) pasujące do adresu. */
export function scriptsFor(url, manifest, registered = []) {
  const all = [
    ...(manifest.content_scripts || []).map((c, i) => ({ id: `manifest#${i}`, matches: c.matches, excludeMatches: c.exclude_matches || [], js: c.js || [], allFrames: !!c.all_frames, runAt: c.run_at })),
    ...registered.map((r) => ({ id: r.id, matches: r.matches || [], excludeMatches: r.excludeMatches || [], js: r.js || [], allFrames: !!r.allFrames, runAt: r.runAt })),
  ];
  return all.filter((s) => s.matches.some((p) => matchesPattern(p, url)) && !s.excludeMatches.some((p) => matchesPattern(p, url)));
}

// --- 2/4. Chromium ------------------------------------------------------------------------------

async function launch(chromium, extDir, profile) {
  return chromium.launchPersistentContext(profile, {
    headless: true, channel: 'chromium',
    args: [`--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`, '--no-first-run', '--disable-component-update'],
  });
}

/** Czeka, aż profiler zapisze zakończony start (chrome.storage.session) – odczyt z poziomu SW, bez otwierania stron. */
async function waitForProfile(sw, reason, timeoutMs = 120000) {
  const t0 = Date.now();
  for (;;) {
    const p = await sw.evaluate(() => chrome.storage.session.get('startupProfile').then((x) => x.startupProfile || null)).catch(() => null);
    if (p && p.totalMs !== null && p.totalMs !== undefined && String(p.reason).startsWith(reason)) return p;
    if (Date.now() - t0 > timeoutMs) throw new Error(`brak zakończonego profilu startu (${reason}) w ${timeoutMs} ms`);
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function swOf(ctx) {
  let [sw] = ctx.serviceWorkers();
  if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 60000 });
  return sw;
}

/** Stan runtime po instalacji (odczyt z SW). */
async function runtimeSnapshot(sw) {
  return sw.evaluate(async () => {
    const dnr = chrome.declarativeNetRequest;
    const enabled = await dnr.getEnabledRulesets();
    const disabled = {};
    for (const id of enabled) { try { disabled[id] = (await dnr.getDisabledRuleIds({ rulesetId: id })).length; } catch { disabled[id] = null; } }
    const registered = (await chrome.scripting.getRegisteredContentScripts())
      .map((r) => ({ id: r.id, matches: r.matches, excludeMatches: r.excludeMatches, js: r.js, allFrames: r.allFrames, runAt: r.runAt, world: r.world }));
    return {
      enabledRulesets: enabled,
      disabledStaticRules: disabled,
      availableStaticRuleCount: await dnr.getAvailableStaticRuleCount().catch(() => null),
      dynamicRules: (await dnr.getDynamicRules()).length,
      sessionRules: (await dnr.getSessionRules()).length,
      registered,
    };
  });
}

/** Jeden pomiar: świeży profil → instalacja → gotowość (opcjonalnie: stan runtime i wybudzenia SW). */
async function measureOnce(chromium, extDir, dir, { withRuntime = false, wakeRuns = 0 } = {}) {
  const profile = fs.mkdtempSync(path.join(dir, 'profile-'));
  const out = {};
  // 2B + 2A: świeża instalacja
  const t0 = performance.now();
  const ctx = await launch(chromium, extDir, profile);
  const tLaunched = performance.now();
  try {
    await ctx.route(/^https?:/, (r) => r.fulfill({ status: 204, body: '' }));
    const sw = await swOf(ctx);
    const tSw = performance.now();
    const install = await waitForProfile(sw, 'onInstalled');
    const tReady = performance.now();
    out.install = install;
    out.freshInstall = { launchMs: tLaunched - t0, serviceWorkerVisibleMs: tSw - t0, readyMs: tReady - t0 };
    if (withRuntime) out.runtime = await runtimeSnapshot(sw);
    if (wakeRuns) out.wake = await measureWake(ctx, sw, wakeRuns);
  } finally {
    await ctx.close().catch(() => {});
    fs.rmSync(profile, { recursive: true, force: true });
  }
  return out;
}

/**
 * Wybudzenie SW: zatrzymanie przez CDP (ServiceWorker.stopAllWorkers), potwierdzenie, że cel
 * service_worker zniknął, potem pierwsza wiadomość ze strony rozszerzenia (zegar ścienny w stronie).
 *   wakeMinimal  – options:get (wybudzenie + wczytanie modułu + prosty handler),
 *   wakeCosmetic – cosmetic:init dla nowego hosta (wybudzenie + dane kosmetyczne list, jak pierwsza strona po uśpieniu),
 *   warmCosmetic – cosmetic:init dla nowego hosta przy działającym SW (dane już w pamięci).
 */
async function measureWake(ctx, sw, runs) {
  const id = new URL(sw.url()).host;
  const page = await ctx.newPage();
  await page.goto(`chrome-extension://${id}/popup/popup.html`);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('ServiceWorker.enable');
  const swTargets = async () => (await cdp.send('Target.getTargets')).targetInfos.filter((t) => t.type === 'service_worker' && t.url.startsWith(`chrome-extension://${id}/`)).length;
  // zatrzymanie może się opóźnić, gdy worker kończy pracę w tle – do 3 prób, każda do 3 s
  const stop = async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      await cdp.send('ServiceWorker.stopAllWorkers');
      for (let i = 0; i < 150 && (await swTargets()); i++) await new Promise((r) => setTimeout(r, 20));
      if (!(await swTargets())) return;
    }
    throw new Error('service worker nie zatrzymał się (3 próby)');
  };
  const timed = (msg) => page.evaluate(async (m) => { const t = performance.now(); const r = await chrome.runtime.sendMessage(m); return { ms: performance.now() - t, ok: !!r }; }, msg);
  const out = { wakeMinimal: [], wakeCosmetic: [], warmCosmetic: [] };
  for (let i = 0; i < runs; i++) {
    await stop();
    out.wakeMinimal.push((await timed({ type: 'options:get' })).ms);
    await stop();
    const cold = await timed({ type: 'cosmetic:init', url: `https://wake${i}.perf.example/` });
    if (!cold.ok) throw new Error('cosmetic:init bez odpowiedzi');
    out.wakeCosmetic.push(cold.ms);
    out.warmCosmetic.push((await timed({ type: 'cosmetic:init', url: `https://warm${i}.perf.example/` })).ms);
  }
  await page.close();
  return out;
}

/** Statystyki etapów profilera (suma czasu etapu w danym starcie) i znaczników. */
export function profileStats(profiles) {
  const totals = stats(profiles.map((p) => p.totalMs));
  const stageNames = [...new Set(profiles.flatMap((p) => (p.stages || []).map((s) => s.name)))];
  const stages = stageNames.map((name) => {
    const vals = profiles.map((p) => ((p.stages || []).find((s) => s.name === name) || {}).totalMs).filter((x) => x !== undefined);
    return { name, runsWithStage: vals.length, ...stats(vals) };
  }).sort((a, b) => b.median - a.median);
  const markNames = [...new Set(profiles.flatMap((p) => Object.keys(p.marks || {})))];
  const marks = Object.fromEntries(markNames.map((m) => [m, stats(profiles.map((p) => (p.marks || {})[m]))]));
  return { totalMs: totals, reason: profiles[0] && profiles[0].reason, stages, marks };
}

function environment() {
  let commit = '';
  let dirty = false;
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
    dirty = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).trim().length > 0;
  } catch { /* poza repozytorium */ }
  const cpus = os.cpus();
  return {
    commit, workingTreeDirty: dirty,
    node: process.version, os: `${os.type()} ${os.release()} ${os.arch()}`,
    cpu: cpus[0] ? `${cpus[0].model.trim()} ×${cpus.length}` : '?', memGB: Math.round(os.totalmem() / 1e9),
    chromium: '', headless: true, ci: !!process.env.CI,
  };
}

// --- raport -------------------------------------------------------------------------------------

const kb = (b) => `${(b / 1024).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} KB`;
const mb = (b) => `${(b / 1024 / 1024).toLocaleString('pl-PL', { maximumFractionDigits: 2 })} MB`;
const pc = (x) => `${String(x).replace('.', ',')}%`;
const num = (x) => Number(x).toLocaleString('pl-PL', { maximumFractionDigits: 1 });
const ms = (s) => (s ? `mediana ${num(s.median)} ms · p95 ${num(s.p95)} · min ${num(s.min)} · max ${num(s.max)} (n=${s.n})` : '—');
/** Odmiana: 1 plik, 2–4 pliki, 5 plików (forms: [1, 2–4, 5+]). */
export const plural = (n, [one, few, many]) => (n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14) ? few : many);
const pl = (n, forms) => `${n} ${plural(n, forms)}`;
const WPIS = ['wpis', 'wpisy', 'wpisów'];
const PLIK = ['plik', 'pliki', 'plików'];

export function formatReport(r) {
  const L = [];
  L.push('Apex AdBlocker – baseline rozmiaru i wydajności', '='.repeat(64));
  L.push(`Data: ${r.date}`, `Commit: ${r.env.commit}${r.env.workingTreeDirty ? ' (+ niezacommitowane zmiany)' : ''}`,
    `Środowisko: ${r.env.os}; ${r.env.cpu}; ${r.env.memGB} GB RAM; Node ${r.env.node}; Chromium ${r.env.chromium || 'nie uruchamiany'}; headless${r.env.ci ? '; CI' : ''}`);
  const s = r.size;
  L.push('', '1. ROZMIAR PACZKI ROZSZERZENIA', '-'.repeat(64));
  L.push(`Pliki: ${s.files} · rozpakowane: ${s.unpackedBytes.toLocaleString('pl-PL')} B (${mb(s.unpackedBytes)}) · ZIP: ${s.zipBytes.toLocaleString('pl-PL')} B (${mb(s.zipBytes)})`);
  L.push(`ZIP: ${s.zipMethod}`, `Hash zawartości paczki (SHA-256): ${s.packageSha256}`, `Wszystkie pliki .js w paczce: ${kb(s.jsBytes)}`);
  L.push('', 'Kategorie (rozpakowane / po deflate / % paczki / pliki):');
  for (const [k, c] of Object.entries(s.categories)) L.push(`  ${k.padEnd(48)} ${kb(c.bytes).padStart(12)}  ${kb(c.deflatedBytes).padStart(11)}  ${pc(c.percent).padStart(6)}  ${c.files}`);
  L.push('', `Top ${s.top.length} największych plików (rozpakowane / % paczki / po deflate):`);
  s.top.forEach((f, i) => L.push(`  ${String(i + 1).padStart(2)}. ${f.file.padEnd(36)} ${kb(f.bytes).padStart(12)}  ${pc(f.percent).padStart(6)}  ${kb(f.deflatedBytes).padStart(11)}`));
  L.push('', `Niechciane pliki w paczce: ${s.unwanted.length ? s.unwanted.join(', ') : 'brak'}`);
  if (r.startup) {
    const st = r.startup;
    L.push('', '2A. INTERNAL SERVICE-WORKER INIT (profiler w background.js)', '-'.repeat(64));
    L.push(`Pomiar: performance.now() w SW (od timeOrigin workera) do finishStartupProfile(). Rozgrzewka: ${st.warmup} run odrzucony; mierzone: ${st.runs}.`);
    for (const [label, p] of [['Świeża instalacja (onInstalled: install, z pierwszą synchronizacją)', st.install]]) {
      L.push('', `${label}:`, `  total: ${ms(p.totalMs)}`, '  znaczniki (ms od startu SW):');
      for (const [m, v] of Object.entries(p.marks)) L.push(`    ${m.padEnd(40)} ${ms(v)}`);
      L.push('  etapy (czas etapu; „X: …” to część etapu X). UWAGA: syncRulesets, syncDynamicRules i syncScriptlets');
      L.push('  startują równolegle (Promise.allSettled) – ich czasy się nakładają, nie sumuj ich:');
      for (const g of p.stages) L.push(`    ${g.name.padEnd(56)} ${ms(g)}${g.runsWithStage < st.runs ? ` [w ${g.runsWithStage}/${st.runs} runach]` : ''}`);
    }
    L.push('', 'Restart przeglądarki (onStartup): niemierzalny w tym środowisku – Chromium z --load-extension instaluje rozszerzenie od nowa przy każdym starcie.');
    L.push('', '2B. FRESH INSTALL → EXTENSION READY (zegar ścienny w Node)', '-'.repeat(64));
    L.push('Obejmuje: start Chromium, ładowanie unpacked extension, instalację, init SW i odpytywanie Playwright (co 20 ms). To NIE jest czas samego workera.');
    L.push(`  launchPersistentContext:        ${ms(st.freshInstall.launchMs)}`);
    L.push(`  service worker widoczny:        ${ms(st.freshInstall.serviceWorkerVisibleMs)}`);
    L.push(`  ready (profil startu zakończony): ${ms(st.freshInstall.readyMs)}`);
    L.push('', '2C. WYBUDZENIE SERVICE WORKERA (eksperymentalne, zegar ścienny ze strony rozszerzenia)', '-'.repeat(64));
    L.push('SW zatrzymany przez CDP ServiceWorker.stopAllWorkers (sprawdzone: cel service_worker znika), potem pierwsza wiadomość. Obejmuje IPC, start procesu workera, wczytanie modułu i handler.');
    L.push(`  wybudzenie → options:get:                         ${ms(st.wake.wakeMinimal)}`);
    L.push(`  wybudzenie → cosmetic:init (pierwsza strona):     ${ms(st.wake.wakeCosmetic)}`);
    L.push(`  działający SW → cosmetic:init (nowy host):        ${ms(st.wake.warmCosmetic)}`);
  }
  if (r.runtime) {
    const rt = r.runtime;
    L.push('', '4. RUNTIME (stan po świeżej instalacji, domyślny tryb)', '-'.repeat(64));
    L.push(`Rulesety włączone: ${rt.enabledRulesets.join(', ')}`);
    L.push(`Reguły statyczne aktywne: ${rt.staticRulesActive.toLocaleString('pl-PL')} (w plikach: ${rt.staticRulesInFiles.toLocaleString('pl-PL')}; wyłączone przez badfilter: ${rt.staticRulesDisabled})`);
    L.push(`Wolne miejsce na reguły statyczne (getAvailableStaticRuleCount): ${rt.availableStaticRuleCount === null ? '?' : rt.availableStaticRuleCount.toLocaleString('pl-PL')}`);
    L.push(`Reguły dynamiczne: ${rt.dynamicRules} · sesyjne: ${rt.sessionRules}`);
    L.push(`Zarejestrowane scriptlety (registerContentScripts): ${pl(rt.registeredScripts, WPIS)}, ${pl(rt.registeredJsFiles, PLIK)} JS, ${kb(rt.registeredJsBytes)}`);
    L.push('Content scripty na stronie (manifest + zarejestrowane, wg wzorców dopasowania; wpis = jedna rejestracja):');
    for (const [name, c] of Object.entries(rt.contentScripts)) L.push(`  ${name} (${c.url}): ${pl(c.entries, WPIS)}, ${pl(c.jsFiles, PLIK)} JS (${kb(c.jsBytes)}): ${c.files.join(', ')}`);
    if (rt.syncInstall) {
      const s = rt.syncInstall;
      L.push('Synchronizacja przy instalacji (mediana, ms od startu SW):');
      L.push(`  DNR gotowy (rulesety + badfilter, blokowanie sieci aktywne): ${num(s.dnrReadyMark)} ms`);
      L.push(`  scriptlety gotowe: ${num(s.scriptletsReadyMark)} ms (w tym registerContentScripts: ${num(s.registerContentScripts)} ms)`);
      L.push(`  reguły dynamiczne – updateDynamicRules: ${num(s.updateDynamicRules)} ms`);
    }
    L.push('RAM: nie mierzony – brak wiarygodnej metody pomiaru pamięci service workera w Playwright/headless.');
  }
  return L.join('\n') + '\n';
}

/** Mały plik baseline (stabilne metryki, bez logów). */
export function baselineOf(r) {
  const b = {
    schema: 1,
    measuredAt: r.date,
    commit: r.env.commit,
    environment: { os: r.env.os, cpu: r.env.cpu, memGB: r.env.memGB, node: r.env.node, chromium: r.env.chromium, headless: true },
    size: {
      packageSha256: r.size.packageSha256,
      files: r.size.files,
      unpackedBytes: r.size.unpackedBytes,
      zipBytes: r.size.zipBytes,
      categories: Object.fromEntries(Object.entries(r.size.categories).map(([k, c]) => [k, { files: c.files, bytes: c.bytes }])),
    },
  };
  if (r.startup) {
    const pick = (s) => s && { median: s.median, p95: s.p95, min: s.min, max: s.max, n: s.n };
    b.startup = {
      note: 'internalInstall = profiler SW (timeOrigin workera → finishStartupProfile, świeża instalacja); freshInstallToReady = zegar ścienny z uruchomieniem Chromium; wake* = eksperymentalne, zegar ścienny ze strony rozszerzenia',
      internalInstallMs: pick(r.startup.install.totalMs),
      registerContentScriptsMs: pick((r.startup.install.stages || []).find((s) => s.name === 'scriptlety: registerContentScripts')),
      dnrReadyMs: pick((r.startup.install.marks || {})['DNR gotowy']),
      freshInstallToReadyMs: pick(r.startup.freshInstall.readyMs),
      wakeMinimalMs: pick(r.startup.wake.wakeMinimal),
      wakeCosmeticMs: pick(r.startup.wake.wakeCosmetic),
      warmCosmeticMs: pick(r.startup.wake.warmCosmetic),
    };
  }
  if (r.runtime) {
    b.runtime = {
      enabledRulesets: r.runtime.enabledRulesets, staticRulesActive: r.runtime.staticRulesActive,
      registeredScripts: r.runtime.registeredScripts,
      registeredJsFiles: r.runtime.registeredJsFiles,
      registeredJsBytes: r.runtime.registeredJsBytes,
      dynamicRules: r.runtime.dynamicRules,
      sessionRules: r.runtime.sessionRules,
      contentScriptJsFiles: Object.fromEntries(Object.entries(r.runtime.contentScripts).map(([k, c]) => [k, c.jsFiles])),
    };
  }
  return b;
}

// --- main ---------------------------------------------------------------------------------------

export function parseArgs(argv) {
  const o = { runs: DEFAULT_RUNS, sizeOnly: false, writeBaseline: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--size-only') o.sizeOnly = true;
    else if (a === '--write-baseline') o.writeBaseline = true;
    else if (a === '--runs') o.runs = Math.max(1, parseInt(argv[++i], 10) || DEFAULT_RUNS);
    else throw new Error(`nieznany argument: ${a}`);
  }
  return o;
}

/** Pomiar paczki: rozgrzewka, N świeżych instalacji, wybudzenia SW. */
async function measureConfig(chromium, extDir, tmp, { runs, log }) {
  const warm = await measureOnce(chromium, extDir, tmp, { withRuntime: true });
  const samples = [];
  for (let i = 0; i < runs; i++) {
    samples.push(await measureOnce(chromium, extDir, tmp));
    log(`  run ${i + 1}/${runs}: internal install ${samples[i].install.totalMs} ms · fresh install→ready ${Math.round(samples[i].freshInstall.readyMs)} ms`);
  }
  // wybudzenia: osobna świeża instalacja; pierwszy pomiar = rozgrzewka (odrzucony)
  const extra = await measureOnce(chromium, extDir, tmp, { wakeRuns: runs + 1 });
  const dropFirst = (a) => a.slice(1);
  log(`  wybudzenia SW: ${runs} (+1 rozgrzewka)`);
  const startup = {
    warmup: 1, runs,
    install: profileStats(samples.map((s) => s.install)),
    wake: Object.fromEntries(Object.entries(extra.wake).map(([k, v]) => [k, stats(dropFirst(v))])),
    freshInstall: Object.fromEntries(['launchMs', 'serviceWorkerVisibleMs', 'readyMs'].map((k) => [k, stats(samples.map((s) => s.freshInstall[k]))])),
  };
  return { startup, rawRuntime: warm.runtime };
}

/** Podsumowanie runtime (stan po instalacji – deterministyczny dla danej konfiguracji). */
function runtimeSummary(rt, install, extDir) {
  const manifest = JSON.parse(fs.readFileSync(path.join(extDir, 'manifest.json'), 'utf8'));
  const ruleCount = (id) => { const f = path.join(extDir, 'rules', `${id}.json`); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).length : 0; };
  const inFiles = rt.enabledRulesets.reduce((n, id) => n + ruleCount(id), 0);
  const disabledN = Object.values(rt.disabledStaticRules).reduce((n, x) => n + (x || 0), 0);
  const fileBytes = (f) => { try { return fs.statSync(path.join(extDir, f)).size; } catch { return 0; } };
  const regJs = rt.registered.flatMap((r) => r.js || []);
  const stageMedian = (p, name) => { const s = p.stages.find((x) => x.name === name); return s ? s.median : null; };
  return {
    enabledRulesets: rt.enabledRulesets,
    staticRulesInFiles: inFiles, staticRulesDisabled: disabledN, staticRulesActive: inFiles - disabledN,
    availableStaticRuleCount: rt.availableStaticRuleCount, dynamicRules: rt.dynamicRules, sessionRules: rt.sessionRules,
    registeredScripts: rt.registered.length, registeredJsFiles: new Set(regJs).size,
    registeredJsBytes: [...new Set(regJs)].reduce((n, f) => n + fileBytes(f), 0),
    contentScripts: Object.fromEntries(Object.entries(SAMPLE_URLS).map(([name, url]) => {
      const list = scriptsFor(url, manifest, rt.registered);
      const files = [...new Set(list.flatMap((s) => s.js))];
      return [name, { url, entries: list.length, jsFiles: files.length, jsBytes: files.reduce((n, f) => n + fileBytes(f), 0), files }];
    })),
    syncInstall: {
      dnrReadyMark: install.marks['DNR gotowy'] && install.marks['DNR gotowy'].median,
      scriptletsReadyMark: install.marks['scriptlety gotowe'] && install.marks['scriptlety gotowe'].median,
      registerContentScripts: stageMedian(install, 'scriptlety: registerContentScripts'),
      updateDynamicRules: stageMedian(install, 'syncDynamicRules: updateDynamicRules'),
    },
  };
}

async function chromiumVersion(chromium) {
  try { const b = await chromium.launch({ headless: true }); const v = b.version(); await b.close(); return v; } catch { return ''; }
}

export async function run({ runs = DEFAULT_RUNS, sizeOnly = false, log = console.log } = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-perf-'));
  try {
    // paczka budowana tą samą funkcją co npm run package:dev, ale w katalogu tymczasowym
    const pkg = packageDev({ outDir: path.join(tmp, 'dist') });
    const size = sizeReport(pkg.extDir);
    size.unwanted = unwantedFiles(size.list);
    delete size.list;
    const report = { date: new Date().toISOString(), size };
    let chromium = null;
    if (!sizeOnly) {
      const { loadPlaywright } = await import('./chromium-smoke.mjs');
      chromium = await loadPlaywright();
      log(`Rozgrzewka (1 run, odrzucony), potem ${runs} mierzonych świeżych instalacji, potem ${runs} wybudzeń SW…`);
      const m = await measureConfig(chromium, pkg.extDir, tmp, { runs, log });
      report.startup = m.startup;
      report.runtime = runtimeSummary(m.rawRuntime, m.startup.install, pkg.extDir);
    }
    report.env = environment();
    if (chromium) report.env.chromium = await chromiumVersion(chromium);
    return report;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  const outDir = path.join(ROOT, RESULTS_DIR);
  fs.mkdirSync(outDir, { recursive: true });
  const report = await run(o);
  const txt = formatReport(report);
  fs.writeFileSync(path.join(outDir, 'latest.txt'), txt);
  fs.writeFileSync(path.join(outDir, 'latest.json'), JSON.stringify(report, null, 2) + '\n');
  process.stdout.write('\n' + txt);
  console.log(`Raport: ${RESULTS_DIR}/latest.txt i latest.json (niecommitowane)`);
  if (o.writeBaseline) {
    fs.mkdirSync(path.dirname(path.join(ROOT, BASELINE_FILE)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, BASELINE_FILE), JSON.stringify(baselineOf(report), null, 2) + '\n');
    console.log(`Zapisano ${BASELINE_FILE}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
