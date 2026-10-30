#!/usr/bin/env node
// Apex AdBlocker – pomiar kosztu wydajności na (syntetycznym) YouTube w prawdziwym Chromium.
//
//   node tools/perf/youtube-perf.mjs [--runs 3] [--seconds 20] [--out wynik.json] [--dev-perf]
//
// Konfiguracje (każda w świeżym, tymczasowym profilu):
//   baseline      – Chromium bez rozszerzenia
//   apex   – Apex AdBlocker (domyślne listy)
//   no-scriptlets – Apex AdBlocker z wyrejestrowanymi scriptletami (izoluje ich koszt)
//
// Strona testowa jest serwowana lokalnie przez Playwright pod adresem www.youtube.com
// (bez dostępu do sieci; każde inne żądanie jest przerywane). Mierzone:
//   - Performance.getMetrics: ScriptDuration, TaskDuration, RecalcStyle, Layout,
//   - profil CPU (CDP) z przypisaniem czasu do: scriptlety / cosmetic.js / health.js / strona,
//   - liczniki diagnostyki Apex AdBlocker (MutationObserver, przebiegi filtrów proceduralnych),
//   - mikropomiar kosztu jednego wywołania: appendChild, setTimeout, JSON.stringify, JSON.parse.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, EXTENSION_ENTRIES, syncFinished, SYNC_STEPS, COMPONENTS, ROOT } from '../chromium-smoke.mjs';
import { fixtureHtml, playerResponse, nextResponse } from './youtube-fixture.mjs';

const arg = (name, def) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : def; };
const RUNS = Number(arg('--runs', 3));
const SECONDS = Number(arg('--seconds', 20));
const OUT = arg('--out', '');
const CONFIGS = (arg('--configs', 'baseline,apex,no-scriptlets')).split(',');
// --dev-perf: włącza „Pomiary wydajności” Apex AdBlocker (liczniki cosmetic + profiler scriptletów).
// Domyślnie wyłączone, bo profiler sam dodaje narzut i zaburzyłby porównanie.
const DEV_PERF = process.argv.includes('--dev-perf');

const PLAYER_JSON = JSON.stringify(playerResponse(400));
const NEXT_JSON = JSON.stringify(nextResponse(200));
const HTML = fixtureHtml();

/** Nie zapisuj benchmarku nieaktywnej ochrony jako niskiego narzutu rozszerzenia. */
export async function waitForProtectionReady(options, { timeoutMs = 180_000, now = () => Date.now() } = {}) {
  const deadline = now() + timeoutMs;
  for (;;) {
    const h = await options.evaluate(() => chrome.runtime.sendMessage({ type: 'health:get' })).catch(() => null);
    const failures = [
      ...SYNC_STEPS.filter((k) => h?.sync?.[k]?.status === 'error').map((k) => `${k}: ${h.sync[k].message || 'ERROR'}`),
      ...COMPONENTS.filter((k) => h?.components?.[k]?.status === 'error').map((k) => `${k}: ${h.components[k].detail || 'ERROR'}`),
    ];
    if (failures.length) throw new Error(`Benchmark invalid: extension protection failed (${failures.join('; ')})`);
    if (syncFinished(h)
      && SYNC_STEPS.every((k) => h.sync[k].status === 'ok')
      && COMPONENTS.every((k) => ['ok', 'warning'].includes(h.components?.[k]?.status))) return h;
    if (now() >= deadline) throw new Error('Benchmark invalid: extension protection did not become ready before timeout');
    await options.waitForTimeout(Math.min(2000, Math.max(0, deadline - now())));
  }
}

/** Przypisuje czas próbek profilu do właściciela: najbliższa ramka rozszerzenia albo strony. */
export function attributeProfile(profile) {
  const byId = new Map(profile.nodes.map((n) => [n.id, n]));
  const self = new Map();
  for (let i = 0; i < profile.samples.length; i++) {
    const id = profile.samples[i];
    self.set(id, (self.get(id) || 0) + (profile.timeDeltas[i] || 0));
  }
  const bucketOf = (url) => {
    if (!url) return null;
    if (url.startsWith('chrome-extension://')) {
      const p = new URL(url).pathname;
      if (p.startsWith('/scriptlets/')) return 'scriptlets';
      if (p === '/content/cosmetic.js') return 'cosmetic';
      if (p === '/youtube/health.js') return 'health';
      return 'extension-other';
    }
    return 'page';
  };
  const totals = {};
  const hot = new Map();
  const walk = (node, owner) => {
    const cf = node.callFrame;
    let own = owner;
    const b = bucketOf(cf.url);
    if (b) own = b;
    if (cf.functionName === '(garbage collector)') own = owner === 'page' || !owner ? 'gc' : owner;
    if (cf.functionName === '(idle)') own = 'idle';
    if (cf.functionName === '(program)') own = 'program';
    const t = (self.get(node.id) || 0) / 1000;
    totals[own || 'native'] = (totals[own || 'native'] || 0) + t;
    if (b && b !== 'page' && t > 0) {
      const key = `${b}:${new URL(cf.url).pathname.split('/').pop()}:${cf.lineNumber + 1} ${cf.functionName || '(anonymous)'}`;
      hot.set(key, (hot.get(key) || 0) + t);
    } else if (!b && own && own !== 'page' && t > 0 && cf.functionName) {
      const key = `${own}→native ${cf.functionName}`;
      hot.set(key, (hot.get(key) || 0) + t);
    }
    for (const c of node.children || []) walk(byId.get(c), own);
  };
  walk(profile.nodes[0], null);
  for (const k of Object.keys(totals)) totals[k] = Math.round(totals[k]);
  const top = [...hot.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, v]) => ({ fn: k, ms: Math.round(v * 10) / 10 }));
  return { totals, top };
}

async function launch(chromium, config, tmp) {
  const profileDir = path.join(tmp, 'profile');
  const args = ['--no-first-run', '--disable-component-update', '--disable-background-networking', '--disable-sync'];
  let extDir = null;
  if (config !== 'baseline') {
    extDir = path.join(tmp, 'extension');
    fs.mkdirSync(extDir);
    for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(extDir, e), { recursive: true });
    args.push(`--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`);
  }
  const context = await chromium.launchPersistentContext(profileDir, { headless: true, channel: 'chromium', args, viewport: { width: 1280, height: 900 } });
  await context.route(/^(https?|wss?):/, async (route) => {
    const u = new URL(route.request().url());
    if (u.hostname !== 'www.youtube.com') return route.abort();
    if (u.pathname === '/watch' || u.pathname === '/') return route.fulfill({ contentType: 'text/html; charset=utf-8', body: HTML });
    if (u.pathname.startsWith('/youtubei/v1/player')) return route.fulfill({ contentType: 'application/json', body: PLAYER_JSON });
    if (u.pathname.startsWith('/youtubei/v1/next')) return route.fulfill({ contentType: 'application/json', body: NEXT_JSON });
    if (u.pathname.startsWith('/youtubei/v1/')) return route.fulfill({ contentType: 'application/json', body: '{}' });
    return route.abort();
  });
  let options = null;
  try {
    if (extDir) {
      let [sw] = context.serviceWorkers();
      if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 20000 });
      const id = new URL(sw.url()).host;
      options = await context.newPage();
      await options.goto(`chrome-extension://${id}/options/options.html`);
      await waitForProtectionReady(options);
      if (DEV_PERF) await options.evaluate(() => chrome.runtime.sendMessage({ type: 'options:setDevPerf', enabled: true }));
      if (config === 'no-scriptlets') {
        await options.evaluate(async () => {
          const ids = (await chrome.scripting.getRegisteredContentScripts()).map((s) => s.id);
          if (ids.length) await chrome.scripting.unregisterContentScripts({ ids });
        });
      }
    }
    return { context, options };
  } catch (e) {
    await context.close().catch(() => {});
    throw e;
  }
}

async function runOnce(chromium, config) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-perf-'));
  let context = null;
  try {
    const launched = await launch(chromium, config, tmp);
    context = launched.context;
    const { options } = launched;
    const page = await context.newPage();
    await page.goto('https://www.youtube.com/watch?v=perfTest01', { waitUntil: 'load' });
    await page.waitForFunction(() => window.__perfReady === true, null, { timeout: 30000 });
    await page.waitForTimeout(2000);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Performance.enable');
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
    const metric = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
    const m0 = await metric();
    await cdp.send('Profiler.start');
    const work = await page.evaluate((s) => window.__runWorkload(s), SECONDS);
    const { profile } = await cdp.send('Profiler.stop');
    const m1 = await metric();
    const micro = await page.evaluate(() => window.__micro());
    const d = (k) => Math.round((m1[k] - m0[k]) * 1000);
    let cosmetic = null;
    if (options && DEV_PERF) {
      await page.waitForTimeout(5500); // raport diagnostyki jest wysyłany co 5 s
      const h = await options.evaluate(() => chrome.runtime.sendMessage({ type: 'health:get' }));
      const r = (h.perf || []).find((p) => p.host === 'www.youtube.com' && p.frame === 0);
      cosmetic = r ? r.stats : null;
    }
    return {
      config,
      metricsMs: { script: d('ScriptDuration'), task: d('TaskDuration'), recalcStyle: d('RecalcStyleDuration'), layout: d('LayoutDuration') },
      longTasks: work.longTasks,
      longTaskMs: work.longTaskMs,
      counts: work.counts,
      profile: attributeProfile(profile),
      micro,
      cosmetic,
    };
  } finally {
    if (context) await context.close().catch(() => {});
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

function summarize(runs) {
  const pick = (f) => median(runs.map(f));
  const keys = new Set(runs.flatMap((r) => Object.keys(r.profile.totals)));
  return {
    config: runs[0].config,
    runs: runs.length,
    scriptMs: pick((r) => r.metricsMs.script),
    taskMs: pick((r) => r.metricsMs.task),
    recalcStyleMs: pick((r) => r.metricsMs.recalcStyle),
    layoutMs: pick((r) => r.metricsMs.layout),
    longTasks: pick((r) => r.longTasks),
    profileMs: Object.fromEntries([...keys].map((k) => [k, pick((r) => r.profile.totals[k] || 0)])),
    micro: Object.fromEntries(Object.keys(runs[0].micro).map((k) => [k, pick((r) => r.micro[k])])),
    cosmetic: runs[runs.length - 1].cosmetic,
    hot: runs[runs.length - 1].profile.top,
    counts: runs[0].counts,
  };
}

async function main() {
  const chromium = await loadPlaywright();
  if (!chromium) { console.log('SKIP: Playwright/Chromium niedostępny'); return; }
  const results = {};
  for (const config of CONFIGS) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      process.stdout.write(`${config} #${i + 1}… `);
      runs.push(await runOnce(chromium, config));
      console.log(`script ${runs.at(-1).metricsMs.script} ms`);
    }
    results[config] = summarize(runs);
  }
  console.log(JSON.stringify(results, null, 2));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ at: new Date().toISOString(), seconds: SECONDS, results }, null, 2));
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) await main();
