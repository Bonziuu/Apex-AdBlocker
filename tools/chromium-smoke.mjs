#!/usr/bin/env node
// ChromeBlock – opcjonalny smoke test: prawdziwe załadowanie rozszerzenia w Chromium.
//
// Sprawdza: czy Chromium przyjął rozszerzenie (manifest/reguły nie odrzucone),
// czy działa service worker i czy po pierwszej synchronizacji health nie ma ERROR.
// NIE otwiera YouTube ani żadnej zewnętrznej strony – tylko strony chrome-extension://
// i chrome://extensions. Używa tymczasowej kopii rozszerzenia i tymczasowego profilu,
// które są usuwane po teście.
//
// Wynik: PASS / FAIL / SKIP (brak Playwright lub Chromium → SKIP, kod 0).
//   node tools/chromium-smoke.mjs
//   node tools/chromium-smoke.mjs --dir dist/ChromeBlock   (gotowa paczka)
//   CHROMEBLOCK_SMOKE=0 – pomija test

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SKIP_MESSAGE = 'SKIP: Chromium smoke test unavailable';
export const SYNC_STEPS = ['rulesets', 'dynamicRules', 'scriptlets'];
export const COMPONENTS = ['network', 'cosmetic', 'scriptlets', 'filters', 'youtube'];
// pliki potrzebne rozszerzeniu (bez tools/, tests/, docs/, node_modules/)
export const EXTENSION_ENTRIES = ['manifest.json', 'background.js', 'background', 'shared', 'content', 'youtube',
  'popup', 'options', 'welcome', 'icons', 'rules', 'data', 'scriptlets', 'web_accessible_resources', '_locales',
  'THIRD_PARTY_NOTICES.md'];

/** Wyciąga komunikaty Chromium o odrzuceniu rozszerzenia z logów przeglądarki. */
export function extractLoadErrors(lines) {
  return lines
    .map((l) => /(?:Extension error: )?(Failed to load extension from: .*)$/.exec(String(l)))
    .filter(Boolean)
    .map((m) => m[1].trim());
}

/** Czy pierwsza synchronizacja zapisała wynik każdego kroku. */
export function syncFinished(health) {
  return !!health && !!health.sync && SYNC_STEPS.every((k) => health.sync[k] && health.sync[k].status !== 'unknown');
}

/**
 * Ocena wyniku smoke testu (czysta logika).
 * @param {object} o
 * @param {string|null} o.unavailable powód braku Playwright/Chromium
 * @param {string[]} o.loadErrors     komunikaty Chromium o odrzuceniu rozszerzenia
 * @param {object|null} o.extension   wpis z chrome://extensions ({state, manifestErrors, installWarnings, runtimeErrors})
 * @param {string|null} o.serviceWorkerUrl
 * @param {object|null} o.health      wynik health:get
 * @param {string|null} o.error       wyjątek podczas testu
 * @returns {{status:'PASS'|'FAIL'|'SKIP', reasons:string[], notes:string[]}}
 */
export function evaluateSmoke(o) {
  if (o.unavailable) return { status: 'SKIP', reasons: [o.unavailable], notes: [] };
  const reasons = [];
  const notes = [];
  for (const e of o.loadErrors || []) reasons.push(`Chromium odrzucił rozszerzenie: ${e}`);
  if (o.error) reasons.push(`błąd testu: ${o.error}`);
  const ext = o.extension;
  if (!ext) reasons.push('rozszerzenie nie jest widoczne w chrome://extensions');
  else {
    if (ext.state !== 'ENABLED') reasons.push(`stan rozszerzenia: ${ext.state}`);
    for (const m of ext.manifestErrors || []) reasons.push(`błąd manifestu: ${m}`);
    for (const m of ext.runtimeErrors || []) reasons.push(`błąd działania: ${m}`);
    for (const m of ext.installWarnings || []) notes.push(`ostrzeżenie instalacji: ${m}`);
  }
  if (!o.serviceWorkerUrl) reasons.push('brak service workera rozszerzenia');
  const h = o.health;
  if (o.serviceWorkerUrl && !h) reasons.push('brak odpowiedzi health:get');
  if (h) {
    if (!syncFinished(h)) reasons.push('pierwsza synchronizacja nie zakończyła się w limicie czasu');
    for (const k of SYNC_STEPS) {
      const s = h.sync && h.sync[k];
      if (s && s.status === 'error') reasons.push(`sync ${k}: ERROR – ${s.message}`);
    }
    for (const c of COMPONENTS) {
      const s = h.components && h.components[c];
      if (s && s.status === 'error') reasons.push(`${c}: ERROR – ${s.detail}`);
      else if (s && s.status === 'warning') notes.push(`${c}: WARNING – ${s.detail}`);
    }
    for (const e of (h.errors || []).slice(-5)) notes.push(`dziennik błędów [${e.component}]: ${e.message}`);
  }
  return { status: reasons.length ? 'FAIL' : 'PASS', reasons, notes };
}

/** Szuka Playwright: lokalnie (node_modules), potem w globalnym npm. */
export async function loadPlaywright({ root = ROOT } = {}) {
  const candidates = [];
  try { candidates.push(createRequire(path.join(root, 'package.json')).resolve('playwright')); } catch { /* brak lokalnie */ }
  try {
    const g = execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['root', '-g'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: process.platform === 'win32', timeout: 15000 }).trim();
    candidates.push(createRequire(path.join(g, 'noop.js')).resolve('playwright'));
  } catch { /* brak globalnie */ }
  for (const c of candidates) {
    try {
      const mod = await import(pathToFileURL(c).href);
      const chromium = mod.chromium || (mod.default && mod.default.chromium);
      if (chromium) return chromium;
    } catch { /* spróbuj kolejny */ }
  }
  return null;
}

function copyExtension(dest, sourceDir = null) {
  // gotowa paczka (np. dist/ChromeBlock) – kopiujemy ją w całości
  if (sourceDir) { fs.cpSync(sourceDir, dest, { recursive: true }); return; }
  for (const entry of EXTENSION_ENTRIES) {
    const src = path.join(ROOT, entry);
    if (fs.existsSync(src)) fs.cpSync(src, path.join(dest, entry), { recursive: true });
  }
}

/** Krótko uruchamia Chromium z logowaniem na stderr i zwraca linie logu (bez stron zewnętrznych). */
function chromiumLoadLog(exe, extDir, profileDir, ms = 8000) {
  return new Promise((resolve) => {
    const args = ['--headless=new', `--user-data-dir=${profileDir}`, `--disable-extensions-except=${extDir}`,
      `--load-extension=${extDir}`, '--enable-logging=stderr', '--no-first-run', '--disable-component-update',
      '--disable-background-networking', '--remote-debugging-port=0', 'about:blank'];
    if (process.platform === 'linux' && process.getuid && process.getuid() === 0) args.unshift('--no-sandbox');
    let out = '';
    let child;
    try { child = spawn(exe, args, { stdio: ['ignore', 'ignore', 'pipe'] }); } catch { resolve([]); return; }
    child.stderr.on('data', (d) => { out += d; });
    const timer = setTimeout(() => child.kill('SIGKILL'), ms);
    child.on('error', () => { clearTimeout(timer); resolve([]); });
    child.on('exit', () => { clearTimeout(timer); resolve(out.split('\n')); });
  });
}

/** Uruchamia smoke test. Zwraca wynik evaluateSmoke() oraz czy Chromium wystartował. */
export async function runSmoke({ log = console.log, syncTimeoutMs = 180_000, extensionDir = null } = {}) {
  const chromium = await loadPlaywright();
  if (!chromium) return { ...evaluateSmoke({ unavailable: 'Playwright nie jest zainstalowany' }), launched: false };
  let exe = '';
  try { exe = chromium.executablePath(); } catch { /* brak */ }
  if (!exe || !fs.existsSync(exe)) return { ...evaluateSmoke({ unavailable: 'Chromium nie jest zainstalowany (npx playwright install chromium)' }), launched: false };

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-smoke-'));
  const extDir = path.join(tmp, 'extension');
  const profileDir = path.join(tmp, 'profile');
  fs.mkdirSync(extDir);
  copyExtension(extDir, extensionDir);
  const input = { loadErrors: [], extension: null, serviceWorkerUrl: null, health: null, error: null };
  let context = null;
  let launched = false;
  try {
    context = await chromium.launchPersistentContext(profileDir, {
      headless: process.env.CHROMEBLOCK_SMOKE_HEADED !== '1',
      channel: 'chromium', // rozszerzenia wymagają pełnego Chromium (nowy headless)
      args: [
        `--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`,
        '--no-first-run', '--no-default-browser-check', '--disable-component-update',
        '--disable-background-networking', '--disable-sync', '--disable-default-apps',
      ],
    });
    launched = true;
    log(`Chromium uruchomiony: ${exe}`);
    // żadnych zewnętrznych stron
    await context.route(/^(https?|wss?):/, (route) => route.abort());

    let [sw] = context.serviceWorkers();
    if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 20000 }).catch(() => null);
    input.serviceWorkerUrl = sw ? sw.url() : null;

    const page = await context.newPage();
    await page.goto('chrome://extensions');
    input.extension = await page.evaluate(async () => {
      const list = await chrome.developerPrivate.getExtensionsInfo();
      const e = list.find((x) => x.name === 'ChromeBlock');
      return e ? {
        state: e.state,
        manifestErrors: (e.manifestErrors || []).map((m) => m.message),
        runtimeErrors: (e.runtimeErrors || []).map((m) => m.message),
        installWarnings: e.installWarnings || [],
      } : null;
    }).catch(() => null);

    if (input.serviceWorkerUrl) {
      const id = new URL(input.serviceWorkerUrl).host;
      await page.goto(`chrome-extension://${id}/options/options.html`);
      const deadline = Date.now() + syncTimeoutMs;
      do {
        input.health = await page.evaluate(() => chrome.runtime.sendMessage({ type: 'health:get' })).catch(() => null);
        if (syncFinished(input.health)) break;
        await page.waitForTimeout(2000);
      } while (Date.now() < deadline);
    }
  } catch (e) {
    input.error = String((e && e.message) || e).split('\n')[0];
  } finally {
    if (context) await context.close().catch(() => {});
    // rozszerzenie nie wstało → odczytaj powód odrzucenia z logu Chromium (tylko about:blank)
    if (launched && (!input.extension || !input.serviceWorkerUrl)) {
      input.loadErrors = extractLoadErrors(await chromiumLoadLog(exe, extDir, path.join(tmp, 'profile-diag')));
    }
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  return { ...evaluateSmoke(input), launched };
}

async function main() {
  if (process.env.CHROMEBLOCK_SMOKE === '0') { console.log(`${SKIP_MESSAGE} (CHROMEBLOCK_SMOKE=0)`); return; }
  // --dir <katalog>: test gotowej paczki (np. dist/ChromeBlock) zamiast repozytorium
  const i = process.argv.indexOf('--dir');
  const extensionDir = i > 0 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : null;
  if (extensionDir && !fs.existsSync(path.join(extensionDir, 'manifest.json'))) {
    console.log(`✗ Brak manifest.json w ${extensionDir}`);
    process.exitCode = 1;
    return;
  }
  if (extensionDir) console.log(`Paczka: ${extensionDir}`);
  const r = await runSmoke({ extensionDir });
  if (r.status === 'SKIP') console.log(`${SKIP_MESSAGE} (${r.reasons.join('; ')})`);
  else console.log(`${r.status === 'PASS' ? '✓' : '✗'} Chromium smoke test: ${r.status}`);
  for (const x of r.status === 'FAIL' ? r.reasons : []) console.log(`  - ${x}`);
  for (const n of r.notes) console.log(`  · ${n}`);
  process.exitCode = r.status === 'FAIL' ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
