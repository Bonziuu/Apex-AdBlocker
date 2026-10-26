#!/usr/bin/env node
// ChromeBlock – lokalny tester regresyjny (Windows: test-chromeblock.cmd, wszędzie: npm run test:local).
//
// Uruchamia Playwright Chromium z bieżącą wersją ChromeBlock w JEDNORAZOWYM profilu (katalog
// tymczasowy, usuwany po teście – bez historii, loginów, cookies i danych konta; prywatny profil
// Chrome nie jest używany) i sprawdza: ładowanie, service worker, health, start, rejestrację
// scriptletów, popup i tryby ochrony, zwykłą stronę oraz YouTube (watch, odtwarzanie, seek, Shorts).
//
// Wyniki: tests/local/results/latest.json i latest.txt (+ screenshot tylko przy FAIL).
// Brak sieci / YouTube niedostępny / ekran weryfikacji → SKIP (INCONCLUSIVE), nigdy PASS.
// Blokowanie reklam NIE jest ogłaszane jako PASS bez dowodu (patrz tests/e2e/lib/classify.mjs).
//
// Opcje:
//   --dir <katalog>   testuj gotową paczkę (np. dist/ChromeBlock) zamiast repozytorium
//   --headless        bez okna przeglądarki (domyślnie okno na Windows/macOS)
//   --video <id>      film do testu watch/seek (domyślnie Big Buck Bunny)
//   --shorts <url>    konkretny adres Shorts (domyślnie https://www.youtube.com/shorts/)
//   --no-youtube      pomiń YouTube (SKIP)
//   --no-consent      nie klikaj „Odrzuć wszystko” na ekranie zgody (wtedy YouTube → SKIP)
//   --results <kat.>  katalog wyników (domyślnie tests/local/results)
//   --modes           zamiast testu regresyjnego: porównanie trybów Basic / Balanced / Strict na ~50
//                     prawdziwych stronach (tests/local/protection-modes-sites.mjs, raport w <results>/modes/)
//
// Kod wyjścia: 0 – PASS, 1 – FAIL, 2 – błąd uruchomienia testera, 3 – INCONCLUSIVE (są SKIP).
// Działa też z rozpakowanej paczki download/ChromeBlock-dev.zip (folder tester/, bez Gita).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlaywright, EXTENSION_ENTRIES, COMPONENTS, syncFinished } from '../../tools/chromium-smoke.mjs';
import { analyzeAdState, analyzePlayback, adFieldsInPlayerResponse, mergeTriState, classifyAds, progressOf, OUTCOME } from '../e2e/lib/classify.mjs';
import { pageSample, pagePlayerResponseSummary, watchRawResponses, detectGate, handleConsent, ensurePlaying, samplePlayer, seekForward } from '../e2e/lib/youtube-page.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const RESULTS_DIR = path.join(ROOT, 'tests', 'local', 'results');
export const DEFAULT_VIDEO = 'aqz-KE-bpKQ'; // Big Buck Bunny (~10 min, publiczny)
export const DEFAULT_SHORTS = 'https://www.youtube.com/shorts/';
export const COMPONENT_LABEL = { network: 'Network', cosmetic: 'Cosmetic', scriptlets: 'Scriptlets', filters: 'Filters', youtube: 'YouTube' };
const MODE_LABEL = { basic: 'Basic', balanced: 'Balanced', strict: 'Strict', custom: 'Własny' };
const MODE_LISTS = {
  basic: ['ads', 'privacy', 'security'],
  balanced: ['ads', 'privacy', 'security', 'cookies'],
  strict: ['ads', 'privacy', 'security', 'cookies', 'annoyances'],
};

// ---------------------------------------------------------------------------
// Czysta logika (testy: tests/tools/local-tester.test.mjs)

/** Wynik zbiorczy: FAIL > INCONCLUSIVE (są SKIP) > PASS. Brak testów → SKIP. */
export function overallStatus(checks) {
  if (!checks.length) return 'SKIP';
  if (checks.some((c) => c.status === 'FAIL')) return 'FAIL';
  if (checks.some((c) => c.status === 'SKIP')) return 'INCONCLUSIVE';
  return 'PASS';
}

export const EXIT = Object.freeze({ PASS: 0, FAIL: 1, ERROR: 2, INCONCLUSIVE: 3 });

/** Kod wyjścia: PASS 0, FAIL 1, błąd uruchomienia 2, INCONCLUSIVE 3 (CI nie pomyli go z PASS). */
export function exitCodeFor(r) {
  if (!r || (r.fatal && !(r.checks || []).length)) return EXIT.ERROR;
  if (r.overall === 'PASS') return EXIT.PASS;
  if (r.overall === 'FAIL') return EXIT.FAIL;
  if (r.overall === 'INCONCLUSIVE') return EXIT.INCONCLUSIVE;
  return EXIT.ERROR;
}

export function counts(checks) {
  const n = { PASS: 0, FAIL: 0, SKIP: 0 };
  for (const c of checks) n[c.status] = (n[c.status] || 0) + 1;
  return n;
}

/** Czy błąd z konsoli / strony pochodzi z ChromeBlock (kod rozszerzenia lub jego komunikaty). */
export function isChromeBlockError({ text = '', url = '', stack = '' }, extensionId) {
  const own = extensionId ? `chrome-extension://${extensionId}/` : '\0';
  return String(url).startsWith(own) || String(stack).includes(own) || /chromeblock/i.test(String(text));
}

/** Błąd nawigacji wynikający z braku sieci / niedostępności strony (→ SKIP, nie FAIL). */
export function networkErrorOf(err) {
  const m = /net::ERR_[A-Z_]+/.exec(String((err && err.message) || err));
  return m ? m[0] : null;
}

export const SEEK_DELTA_S = 60;          // o ile przewijamy
export const SEEK_MIN_JUMP = 0.75;        // przeskok uznany za wykonany: ≥ 75% żądanej odległości (45 s)
export const SEEK_RESUME_WAIT_S = 25;     // ile czekamy na wznowienie odtwarzania po seek (buforowanie)
export const SEEK_RESUME_PROGRESS_S = 2;  // wznowienie = przyrost czasu ≥ 2 s po przeskoku

/**
 * Ocena seek (czysta logika). Rozdziela SAM seek (pozycja przeskoczyła) od wznowienia odtwarzania.
 * @param {{before:number|null, delta?:number, samples:Array<{currentTime:number|null, error?:boolean, spinner?:boolean}>, videoError?:number}} o
 *   samples – próbki co 1 s od chwili seek (do SEEK_RESUME_WAIT_S)
 * @returns {{seek:{status,detail}, resume:{status,detail}, jumpedTo:number|null}}
 */
export function classifySeek({ before, delta = SEEK_DELTA_S, samples = [], videoError = 0 }) {
  const times = samples.map((x) => x.currentTime).filter((t) => typeof t === 'number');
  const tail = samples.slice(-3);
  const playerError = videoError ? `błąd elementu video (kod ${videoError})`
    : (tail.length >= 3 && tail.every((x) => x.error) ? 'trwały komunikat błędu odtwarzacza (.ytp-error)' : '');
  if (before == null || !times.length) {
    return { seek: { status: 'FAIL', detail: 'brak elementu video podczas seek' }, resume: { status: 'SKIP', detail: 'INCONCLUSIVE – brak seek' }, jumpedTo: null };
  }
  const need = before + delta * SEEK_MIN_JUMP;
  const jumpIdx = samples.findIndex((x) => typeof x.currentTime === 'number' && x.currentTime >= need);
  const maxSeen = Math.max(...times);
  if (jumpIdx < 0) {
    const detail = `pozycja nie przeskoczyła: ${Math.round(before)} s → maks. ${Math.round(maxSeen)} s (wymagane ≥ ${Math.round(need)} s)`;
    return { seek: { status: 'FAIL', detail: playerError ? `${detail}; ${playerError}` : detail }, resume: { status: 'SKIP', detail: 'INCONCLUSIVE – seek się nie wykonał' }, jumpedTo: null };
  }
  const jumpedTo = samples[jumpIdx].currentTime;
  const afterJump = samples.slice(jumpIdx);
  // pozycja wróciła wyraźnie przed punkt seek (np. odtwarzacz zresetował film) → jednoznaczna awaria
  const fellBack = afterJump.some((x) => typeof x.currentTime === 'number' && x.currentTime < need - 10);
  if (playerError || fellBack) {
    const why = [playerError, fellBack && 'pozycja cofnęła się przed punkt seek'].filter(Boolean).join('; ');
    return { seek: { status: 'FAIL', detail: `${Math.round(before)} s → ${Math.round(jumpedTo)} s, ale: ${why}` }, resume: { status: 'FAIL', detail: why }, jumpedTo };
  }
  const seek = { status: 'PASS', detail: `${Math.round(before)} s → ${Math.round(jumpedTo)} s` };
  const progress = progressOf(afterJump);
  if (progress >= SEEK_RESUME_PROGRESS_S) {
    // ile sekund minęło do pierwszego przyrostu czasu (buforowanie po seek)
    let waitS = 0;
    for (let i = 1; i < afterJump.length; i++) { if (afterJump[i].currentTime > afterJump[i - 1].currentTime) { waitS = jumpIdx + i; break; } }
    return { seek, resume: { status: 'PASS', detail: `wznowione po ok. ${waitS} s, postęp ${progress} s` }, jumpedTo };
  }
  const buffering = afterJump.filter((x) => x.spinner).length;
  return {
    seek,
    resume: { status: 'SKIP', detail: `INCONCLUSIVE – po ${samples.length} s odtwarzanie się nie wznowiło (postęp ${progress} s${buffering ? `, buforowanie przez ${buffering} s` : ''}); bez błędu playera` },
    jumpedTo,
  };
}

/**
 * Fakty o jednym przebiegu seek (do porównania A/B i raportu).
 * @returns {{before, target, afterSeek, jumpedTo, lastTime, ytpErrorSeen, ytpErrorPersistent, videoErrorCode,
 *            fellBack, jumped, resumed, seekStatus, resumeStatus, finalUrl}}
 */
export function seekFacts({ before, delta = SEEK_DELTA_S, samples = [], videoError = 0, finalUrl = '' }) {
  const r = classifySeek({ before, delta, samples, videoError });
  const times = samples.map((x) => x.currentTime).filter((t) => typeof t === 'number');
  const tail = samples.slice(-3);
  const need = before == null ? null : before + delta * SEEK_MIN_JUMP;
  const jumpIdx = need == null ? -1 : samples.findIndex((x) => typeof x.currentTime === 'number' && x.currentTime >= need);
  const r1 = (x) => (typeof x === 'number' ? Math.round(x * 10) / 10 : null);
  return {
    before: r1(before),
    target: before == null ? null : r1(before + delta),
    afterSeek: r1(times.length ? times[0] : null),
    jumpedTo: r1(r.jumpedTo),
    lastTime: r1(times.length ? times[times.length - 1] : null),
    ytpErrorSeen: samples.some((x) => x.error),
    ytpErrorPersistent: tail.length >= 3 && tail.every((x) => x.error),
    videoErrorCode: videoError || 0,
    fellBack: jumpIdx >= 0 && samples.slice(jumpIdx).some((x) => typeof x.currentTime === 'number' && x.currentTime < need - 10),
    jumped: jumpIdx >= 0,
    resumed: r.resume.status === 'PASS',
    seekStatus: r.seek.status,
    resumeStatus: r.resume.status,
    finalUrl,
  };
}

/** Rodzaje awarii seek (do porównania „ten sam błąd”). 'not-resumed' nie jest błędem samym w sobie. */
export function seekFailureKinds(f) {
  if (!f) return [];
  const k = [];
  if (!f.jumped) k.push('no-jump');
  if (f.videoErrorCode) k.push('video-error');
  if (f.ytpErrorPersistent) k.push('ytp-error');
  if (f.fellBack) k.push('fell-back');
  if (!f.resumed) k.push('not-resumed');
  return k;
}

export const AB = Object.freeze({
  CONTROL_ALSO_FAILS: 'CONTROL ALSO FAILS',
  CHROMEBLOCK_SPECIFIC: 'CHROMEBLOCK-SPECIFIC FAIL',
  INCONCLUSIVE: 'INCONCLUSIVE',
});

/**
 * Porównanie A/B: przebieg Z ChromeBlock vs kontrola BEZ ChromeBlock (świeży profil, ten sam film).
 * @param {object} withF    seekFacts() z ChromeBlock
 * @param {object|{skipped:string}|null} controlF seekFacts() kontroli albo {skipped: powód}
 */
export const HARD_SEEK_FAILURES = Object.freeze(['no-jump', 'video-error', 'ytp-error', 'fell-back']);

/** Twarde awarie seek ('not-resumed' samo w sobie nie jest twardą awarią). */
export function hardSeekFailures(f) {
  return seekFailureKinds(f).filter((k) => HARD_SEEK_FAILURES.includes(k));
}

export function classifyAB(withF, controlF) {
  if (!controlF || controlF.skipped) {
    return { verdict: AB.INCONCLUSIVE, detail: `kontrola bez ChromeBlock nie wykonała się${controlF && controlF.skipped ? `: ${controlF.skipped}` : ''}` };
  }
  const w = hardSeekFailures(withF);
  const c = hardSeekFailures(controlF);
  const wAll = seekFailureKinds(withF);
  const cAll = seekFailureKinds(controlF);
  if (!wAll.length) return { verdict: AB.INCONCLUSIVE, detail: 'przebieg z ChromeBlock nie ma awarii seek – porównanie niepotrzebne' };
  // kontrola czysta: seek działa, odtwarzanie się wznawia, brak twardych awarii
  const controlClean = !cAll.length;
  if (w.length) {
    const missing = w.filter((k) => !c.includes(k));
    if (!missing.length) return { verdict: AB.CONTROL_ALSO_FAILS, detail: `kontrola bez ChromeBlock odtwarza wszystkie twarde błędy (${w.join(', ')}) – nie obwiniać ChromeBlock` };
    if (controlClean) return { verdict: AB.CHROMEBLOCK_SPECIFIC, detail: `bez ChromeBlock seek i odtwarzanie działają; z ChromeBlock: ${w.join(', ')}` };
    if (c.some((k) => w.includes(k))) {
      return { verdict: AB.INCONCLUSIVE, detail: `kontrola odtwarza tylko część błędów: ${w.filter((k) => c.includes(k)).join(', ')}; brak w kontroli: ${missing.join(', ')}` };
    }
    if (!c.length) return { verdict: AB.INCONCLUSIVE, detail: `kontrola bez twardych błędów, ale odtwarzanie się nie wznowiło; z ChromeBlock: ${w.join(', ')}` };
    return { verdict: AB.INCONCLUSIVE, detail: `kontrola ma inne błędy (${c.join(', ')}) niż przebieg z ChromeBlock (${w.join(', ')})` };
  }
  // z ChromeBlock tylko brak wznowienia (bez twardych błędów)
  if (controlClean) return { verdict: AB.CHROMEBLOCK_SPECIFIC, detail: 'bez ChromeBlock odtwarzanie po seek się wznawia; z ChromeBlock: not-resumed' };
  if (!c.length) return { verdict: AB.CONTROL_ALSO_FAILS, detail: 'kontrola bez ChromeBlock również nie wznawia odtwarzania po seek – nie obwiniać ChromeBlock' };
  return { verdict: AB.INCONCLUSIVE, detail: `kontrola ma twarde błędy (${c.join(', ')}), których nie ma z ChromeBlock` };
}

/** Wiersze tabeli A/B do raportu. */
export function formatSeekAB(ab) {
  if (!ab) return [];
  const yes = (b) => (b ? 'TAK' : 'nie');
  const col = (f, key) => {
    if (!f) return '—';
    if (f.skipped) return key === 'before' ? `(nie wykonano: ${f.skipped})` : '';
    return {
      before: `${f.before ?? '—'} s`, target: `${f.target ?? '—'} s`, afterSeek: `${f.afterSeek ?? '—'} s`, lastTime: `${f.lastTime ?? '—'} s`,
      ytp: f.ytpErrorPersistent ? 'TAK (trwały)' : yes(f.ytpErrorSeen), video: String(f.videoErrorCode || 0), fellBack: yes(f.fellBack),
      resumed: yes(f.resumed), url: f.finalUrl || '—',
    }[key];
  };
  const rows = [['before', 'before'], ['seek target', 'target'], ['currentTime po seek', 'afterSeek'], ['currentTime na końcu', 'lastTime'],
    ['.ytp-error', 'ytp'], ['video.error.code', 'video'], ['pozycja się cofnęła', 'fellBack'], ['odtwarzanie wznowione', 'resumed'], ['końcowy URL', 'url']];
  const L = [`Diagnostyka A/B seek: ${ab.verdict}`, `  ${ab.detail}`, `  ${''.padEnd(22)}  ${'Z ChromeBlock'.padEnd(26)}  BEZ ChromeBlock (kontrola)`];
  for (const [label, key] of rows) L.push(`  ${label.padEnd(22)}  ${String(col(ab.with, key)).padEnd(26)}  ${col(ab.without, key)}`);
  return L;
}

/** Czytelny raport tekstowy. */
export function formatReport(r) {
  const n = counts(r.checks);
  const L = [];
  L.push('ChromeBlock – lokalny test regresyjny');
  L.push('='.repeat(44));
  L.push(`WYNIK:        ${r.overall}   (PASS ${n.PASS} · FAIL ${n.FAIL} · SKIP ${n.SKIP})`);
  L.push(`Wersja:       ${r.version || '?'}`);
  L.push(`Data:         ${r.finishedAt}`);
  L.push(`Czas testu:   ${Math.round((r.durationMs || 0) / 1000)} s`);
  L.push(`Przeglądarka: ${r.browser || '?'}${r.headless ? ' (headless)' : ''}`);
  if (r.startup) {
    L.push(`Startup:      ${r.startup.totalMs ?? '—'} ms (${r.startup.reason || '?'}); registerContentScripts: ${r.startup.registerMs ?? '—'} ms${r.startup.registerCalls ? ` (${r.startup.registerCalls}× wywołanie)` : ''}`);
  }
  if (r.fatal) L.push(`Błąd testera: ${r.fatal}`);
  L.push('');
  L.push('Testy:');
  const w = Math.max(...r.checks.map((c) => c.name.length), 10);
  for (const c of r.checks) {
    const tag = c.status === 'SKIP' ? 'SKIP*' : c.status;
    L.push(`  [${tag.padEnd(5)}] ${c.name.padEnd(w)}  ${c.detail || ''}`.trimEnd());
  }
  if (r.checks.some((c) => c.status === 'SKIP')) L.push('  * SKIP = INCONCLUSIVE: nie dało się wiarygodnie sprawdzić (to NIE jest PASS).');
  if (r.seekAB) { L.push(''); L.push(...formatSeekAB(r.seekAB)); }
  if (r.consentDiagnostics) {
    const d = r.consentDiagnostics;
    L.push('', 'Diagnostyka okna zgody YouTube:', `  nagłówek: „${d.heading || '—'}”`, '  widoczne przyciski w oknie i okolicy:');
    for (const b of d.buttons.length ? d.buttons : ['(brak)']) L.push(`    - ${b}`);
  }
  const fails = r.checks.filter((c) => c.status === 'FAIL');
  L.push('');
  L.push('Błędy:');
  if (!fails.length && !(r.errors || []).length) L.push('  brak');
  for (const c of fails) L.push(`  - ${c.name}: ${c.detail}${c.screenshot ? `  [screenshot: ${c.screenshot}]` : ''}`);
  for (const e of r.errors || []) L.push(`  - ${e}`);
  if ((r.notes || []).length) {
    L.push('');
    L.push('Uwagi:');
    for (const x of r.notes) L.push(`  · ${x}`);
  }
  L.push('');
  L.push('Blokowanie reklam: oceniane tylko na podstawie dowodu (reklama widoczna → FAIL; dane reklam usunięte');
  L.push('z odpowiedzi → PASS); bez okazji reklamowej wynik to SKIP (INCONCLUSIVE).');
  L.push('Profil przeglądarki był tymczasowy i został usunięty (bez historii, loginów i cookies).');
  return L.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// Przeglądarka

/** Lokalna „zwykła strona” (127.0.0.1) – do popupu i trybów, działa bez internetu. */
function startLocalSite() {
  const html = '<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>ChromeBlock – strona testowa</title></head>'
    + '<body><h1 id="ok">Strona testowa ChromeBlock</h1><p>Zwykła treść strony.</p></body></html>';
  const server = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html); });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}/` })));
}

function copyExtension(dest, sourceDir) {
  if (sourceDir) { fs.cpSync(sourceDir, dest, { recursive: true }); return; }
  for (const entry of EXTENSION_ENTRIES) {
    const src = path.join(ROOT, entry);
    if (fs.existsSync(src)) fs.cpSync(src, path.join(dest, entry), { recursive: true });
  }
}

/** Argumenty Chromium; extDir = null → kontrola BEZ rozszerzenia. */
export function browserArgs(extDir) {
  return [
    ...(extDir ? [`--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`] : []),
    '--no-first-run', '--no-default-browser-check', '--disable-sync', '--disable-default-apps',
    '--disable-component-update', '--autoplay-policy=no-user-gesture-required', '--mute-audio',
  ];
}

const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${what}: przekroczono ${Math.round(ms / 1000)} s`)), ms).unref())]);

/**
 * Uruchamia wszystkie testy. Zwraca obiekt wyniku (bez zapisu plików).
 * opts.onContext(context) – hak dla testów samego testera (np. strona-atrapa).
 */
export async function runLocalTests(opts = {}) {
  const {
    extensionDir = null, headless = false, video = DEFAULT_VIDEO, shortsUrl = DEFAULT_SHORTS,
    youtube = true, consent = true, log = console.log, onContext = null, screenshotDir = null,
    syncTimeoutMs = 240_000,
  } = opts;
  const t0 = Date.now();
  const checks = [];
  const errors = [];
  const notes = [];
  const result = { overall: 'SKIP', version: null, browser: null, headless, startup: null, checks, errors, notes, startedAt: new Date(t0).toISOString() };
  const finish = () => Object.assign(result, { overall: overallStatus(checks), finishedAt: new Date().toISOString(), durationMs: Date.now() - t0 });

  let current = null; // strona do screenshotu przy FAIL
  const add = async (id, name, status, detail = '', data) => {
    const c = { id, name, status, detail };
    if (data !== undefined) c.data = data;
    if (status === 'FAIL' && screenshotDir && current && !current.isClosed()) {
      try {
        const file = path.join(screenshotDir, `fail-${id}.png`);
        await current.screenshot({ path: file, timeout: 10000 });
        c.screenshot = path.basename(file);
      } catch { /* bez screenshotu */ }
    }
    checks.push(c);
    log(`  [${status === 'SKIP' ? 'SKIP*' : status}] ${name}${detail ? ` – ${detail}` : ''}`);
    return c;
  };
  const skipRest = async (items, why) => { for (const [id, name] of items) await add(id, name, 'SKIP', why); };

  const chromium = await loadPlaywright();
  if (!chromium) { result.fatal = 'Playwright nie jest zainstalowany (npm install, potem npx playwright install chromium)'; return finish(); }
  let exe = '';
  try { exe = chromium.executablePath(); } catch { /* */ }
  if (!exe || !fs.existsSync(exe)) { result.fatal = 'Chromium dla Playwright nie jest zainstalowany (npx playwright install chromium)'; return finish(); }
  result.browser = path.basename(path.dirname(path.dirname(exe))) || 'chromium';

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-local-'));
  const extDir = path.join(tmp, 'extension');
  fs.mkdirSync(extDir);
  copyExtension(extDir, extensionDir);
  try { result.version = JSON.parse(fs.readFileSync(path.join(extDir, 'manifest.json'), 'utf8')).version_name || null; } catch { /* */ }

  const site = await startLocalSite();
  let context = null;
  let extId = null;
  const cbErrors = [];
  const noteError = (src, e) => { if (isChromeBlockError(e, extId)) cbErrors.push(`${src}: ${String(e.text).split('\n')[0].slice(0, 300)}`); };

  try {
    log(`Uruchamiam Chromium z ChromeBlock ${result.version || ''}…`);
    context = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
      headless,
      acceptDownloads: true, // eksport kopii ustawień (plik trafia do katalogu tymczasowego)
      channel: 'chromium',
      viewport: { width: 1280, height: 800 },
      args: browserArgs(extDir),
    });
    if (onContext) await onContext(context);
    context.on('console', (m) => {
      if (m.type() !== 'error') return;
      const loc = (m.location && m.location()) || {};
      noteError('konsola', { text: m.text(), url: loc.url || '' });
    });
    context.on('weberror', (we) => {
      const e = we.error();
      noteError('wyjątek strony', { text: String((e && e.message) || e), stack: String((e && e.stack) || '') });
    });

    // 1. ładowanie + service worker
    let [sw] = context.serviceWorkers();
    if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 30000 }).catch(() => null);
    extId = sw ? new URL(sw.url()).host : null;

    const ext = await context.newPage();
    current = ext;
    await ext.goto('chrome://extensions');
    const info = await ext.evaluate(async () => {
      try { await chrome.developerPrivate.updateProfileConfiguration({ inDeveloperMode: true }); } catch { /* */ }
      const e = (await chrome.developerPrivate.getExtensionsInfo()).find((x) => x.name === 'ChromeBlock');
      return e ? { state: e.state, manifestErrors: (e.manifestErrors || []).map((m) => m.message) } : null;
    }).catch(() => null);
    if (info && info.state === 'ENABLED' && !info.manifestErrors.length) await add('load', 'Rozszerzenie się ładuje', 'PASS', 'ENABLED');
    else await add('load', 'Rozszerzenie się ładuje', 'FAIL', info ? `stan ${info.state}; ${info.manifestErrors.join('; ')}` : 'brak ChromeBlock w chrome://extensions');
    if (!extId) {
      await add('sw', 'Service worker działa', 'FAIL', 'brak service workera');
      throw new Error('brak service workera – dalsze testy niemożliwe');
    }
    await add('sw', 'Service worker działa', 'PASS', '');

    const opt = await context.newPage();
    current = opt;
    await opt.goto(`chrome-extension://${extId}/options/options.html`);
    const call = (msg) => opt.evaluate((m) => chrome.runtime.sendMessage(m), msg);

    // 2. health po pierwszej synchronizacji
    log('Czekam na pierwszą synchronizację…');
    let h = null;
    const deadline = Date.now() + syncTimeoutMs;
    do {
      h = await call({ type: 'health:get' }).catch(() => null);
      if (syncFinished(h) && h.startupProfile && h.startupProfile.totalMs != null) break;
      await opt.waitForTimeout(1500);
    } while (Date.now() < deadline);
    if (!syncFinished(h)) notes.push('pierwsza synchronizacja nie zakończyła się w limicie czasu');
    const healthChecks = async (suffix, idSuffix) => {
      for (const c of COMPONENTS) {
        const s = h && h.components && h.components[c];
        const name = `Health: ${COMPONENT_LABEL[c]}${suffix}`;
        if (!s) await add(`health-${c}${idSuffix}`, name, 'FAIL', 'brak statusu');
        else if (s.status === 'error') await add(`health-${c}${idSuffix}`, name, 'FAIL', `ERROR – ${s.detail}`);
        else await add(`health-${c}${idSuffix}`, name, 'PASS', `${String(s.status).toUpperCase()}${s.status !== 'ok' && s.detail ? ` – ${s.detail}` : ''}`);
      }
    };
    await healthChecks('', '');

    // 3. start + registerContentScripts
    const p = h && h.startupProfile;
    const stage = (name) => (p && p.stages || []).find((s) => s.name === name);
    const reg = stage('scriptlety: registerContentScripts');
    result.startup = p ? { totalMs: p.totalMs, reason: p.reason, registerMs: reg ? reg.totalMs : null, registerCalls: reg ? reg.count : 0, stages: p.stages } : null;
    if (p && p.totalMs != null) await add('startup', 'Startup total', 'PASS', `${p.totalMs} ms (${p.reason || '?'})`);
    else await add('startup', 'Startup total', 'FAIL', 'brak pomiaru startu');
    const registered = await opt.evaluate(() => chrome.scripting.getRegisteredContentScripts().then((r) => r.length)).catch(() => 0);
    if (reg && registered > 0) await add('register', 'registerContentScripts', 'PASS', `${reg.totalMs} ms, ${reg.count}× wywołanie, ${registered} zarejestrowanych skryptów`);
    else await add('register', 'registerContentScripts', 'FAIL', `pomiar: ${reg ? `${reg.totalMs} ms` : 'brak'}; zarejestrowanych: ${registered}`);

    // 4. onboarding (świeży profil = świeża instalacja) – przed popupem i trybami, kończy w trybie Basic
    await runOnboarding({ context, add, call, setCurrent: (pg) => { current = pg; } });

    // 5. zwykła strona (lokalna) + popup + tryby
    const local = await context.newPage();
    current = local;
    await local.goto(site.url);
    const tabId = await opt.evaluate((u) => chrome.tabs.query({}).then((t) => (t.find((x) => (x.url || '').startsWith(u)) || {}).id), site.url);

    const popupErrors = [];
    const openPopup = async () => {
      const pp = await context.newPage();
      await pp.setViewportSize({ width: 340, height: 600 });
      pp.on('pageerror', (e) => popupErrors.push(String((e && e.message) || e)));
      pp.on('console', (m) => { if (m.type() === 'error') popupErrors.push(m.text()); });
      await pp.addInitScript((tid) => { chrome.tabs.query = async () => [{ id: tid, active: true }]; }, tabId);
      await pp.goto(`chrome-extension://${extId}/popup/popup.html`);
      await pp.waitForFunction(() => document.getElementById('main').getAttribute('aria-busy') === 'false', null, { timeout: 15000 });
      return pp;
    };
    const popupState = (pp) => pp.evaluate(() => ({
      host: document.getElementById('host').textContent,
      unsupported: !document.getElementById('unsupported').hidden,
      modeVisible: !document.getElementById('mode').hidden,
      current: document.getElementById('modeCurrent').textContent,
      checked: [...document.querySelectorAll('#modeSeg .seg-btn')].filter((b) => b.getAttribute('aria-checked') === 'true').map((b) => b.dataset.mode),
      busy: document.getElementById('mode').dataset.busy,
      error: document.getElementById('modeErr').hidden ? '' : document.getElementById('modeErr').textContent,
    }));

    let popup = null;
    try {
      popup = await openPopup();
      current = popup;
      const st = await popupState(popup);
      if (st.unsupported || !st.modeVisible || popupErrors.length) await add('popup', 'Popup otwiera się bez błędów', 'FAIL', popupErrors[0] || (st.unsupported ? 'strona oznaczona jako nieobsługiwana' : 'brak sekcji trybu'));
      else await add('popup', 'Popup otwiera się bez błędów', 'PASS', `domena ${st.host}, tryb ${st.current}`);
    } catch (e) {
      await add('popup', 'Popup otwiera się bez błędów', 'FAIL', String(e.message || e).split('\n')[0]);
    }

    const reopenOk = [];
    for (const [from, to] of [['basic', 'balanced'], ['balanced', 'strict'], ['strict', 'basic']]) {
      const id = `mode-${from}-${to}`;
      const name = `Tryb ${MODE_LABEL[from]} → ${MODE_LABEL[to]}`;
      if (!popup) { await add(id, name, 'FAIL', 'popup się nie otworzył'); continue; }
      try {
        current = popup;
        const t = Date.now();
        await popup.click(`#modeSeg [data-mode="${to}"]`);
        await popup.waitForFunction(() => document.getElementById('mode').dataset.busy === 'false', null, { timeout: 90000 });
        const ms = Date.now() - t;
        const st = await popupState(popup);
        const be = await call({ type: 'options:get' });
        const lists = [...(be.lists || []).filter((l) => l.enabled).map((l) => l.id)].sort();
        const problems = [];
        if (st.error) problems.push(`komunikat błędu: ${st.error}`);
        if (st.current !== MODE_LABEL[to] || st.checked.join() !== to) problems.push(`popup pokazuje ${st.current} [${st.checked.join()}]`);
        if (be.protectionMode !== to) problems.push(`backend: ${be.protectionMode}`);
        if (lists.join() !== [...MODE_LISTS[to]].sort().join()) problems.push(`listy: ${lists.join(',')}`);
        await add(id, name, problems.length ? 'FAIL' : 'PASS', problems.join('; ') || `${(ms / 1000).toFixed(1)} s, listy ${lists.join(', ')}`);
        // stan popupu po ponownym otwarciu
        const again = await openPopup();
        const st2 = await popupState(again);
        reopenOk.push({ mode: to, ok: st2.current === MODE_LABEL[to] && st2.checked.join() === to, shown: st2.current });
        await again.close();
      } catch (e) {
        await add(id, name, 'FAIL', String(e.message || e).split('\n')[0]);
      }
    }
    const bad = reopenOk.filter((x) => !x.ok);
    if (reopenOk.length === 3 && !bad.length) await add('popup-state', 'Stan popupu = wybrany tryb', 'PASS', 'po ponownym otwarciu: Balanced, Strict, Basic');
    else await add('popup-state', 'Stan popupu = wybrany tryb', 'FAIL', bad.map((x) => `oczekiwano ${MODE_LABEL[x.mode]}, jest ${x.shown}`).join('; ') || 'nie sprawdzono wszystkich trybów');
    if (popup) await popup.close().catch(() => {});

    const localOk = await local.evaluate(() => document.getElementById('ok') && document.getElementById('ok').textContent).catch(() => null);

    // 5. zwykła strona z internetu
    const web = await context.newPage();
    current = web;
    let online = true;
    try {
      const resp = await web.goto('https://example.com/', { waitUntil: 'load', timeout: 30000 });
      const title = await web.title();
      if (resp && resp.ok() && /example/i.test(title) && localOk) await add('page', 'Zwykła strona ładuje się', 'PASS', `example.com (HTTP ${resp.status()}) i strona lokalna`);
      else await add('page', 'Zwykła strona ładuje się', 'FAIL', `HTTP ${resp ? resp.status() : '?'}, tytuł „${title}”${localOk ? '' : ', strona lokalna bez treści'}`);
    } catch (e) {
      const net = networkErrorOf(e);
      if (!net) throw e;
      online = false;
      if (localOk) await add('page', 'Zwykła strona ładuje się', 'SKIP', `brak internetu (${net}); strona lokalna działa`);
      else await add('page', 'Zwykła strona ładuje się', 'FAIL', 'strona lokalna nie wczytała treści');
    }
    await web.close();

    // 6. YouTube
    const YT = [['yt-watch', 'YouTube: strona watch'], ['yt-video', 'YouTube: element video'], ['yt-play', 'YouTube: odtwarzanie startuje'],
      ['yt-seek', 'YouTube: seek'], ['yt-seek-resume', 'YouTube: odtwarzanie po seek'], ['yt-player-error', 'YouTube: brak błędu playera'], ['yt-ads', 'YouTube: reklamy (tylko z dowodem)'], ['yt-shorts', 'YouTube: Shorts']];
    if (!youtube) await skipRest(YT, 'pominięto (--no-youtube)');
    else if (!online) await skipRest(YT, 'INCONCLUSIVE – brak dostępu do internetu');
    else {
      const runControl = () => runControlSeek({ chromium, headless, video, consent, onContext, log });
      result.seekAB = await runYouTube({ context, add, skipRest, YT, video, shortsUrl, consent, setCurrent: (pg) => { current = pg; }, notes, runControl, log, onConsentDiagnostics: (d) => { result.consentDiagnostics = d; } });
    }

    // 7. kopia ustawień (eksport / import przez UI Opcji) – zawsze z przywróceniem stanu początkowego
    await runBackup({ context, add, extId, opt, dir: path.join(tmp, 'backup'), setCurrent: (pg) => { current = pg; } });

    // 8. health po testach
    current = opt;
    h = await call({ type: 'health:get' }).catch(() => null);
    const errs = [];
    for (const c of COMPONENTS) {
      const s = h && h.components && h.components[c];
      if (!s || s.status === 'error') errs.push(`${COMPONENT_LABEL[c]}: ${s ? s.detail : 'brak'}`);
    }
    await add('health-after', 'Health po wszystkich testach', errs.length ? 'FAIL' : 'PASS', errs.join('; ') || 'bez ERROR');

    // 8. błędy JS ChromeBlock (strony + service worker z chrome://extensions)
    current = null; // screenshot chrome://extensions nic nie wnosi
    await ext.goto('chrome://extensions');
    const rt = await ext.evaluate(async () => {
      const e = (await chrome.developerPrivate.getExtensionsInfo()).find((x) => x.name === 'ChromeBlock');
      return e ? (e.runtimeErrors || []).map((m) => `${m.source || ''}: ${m.message}`) : [];
    }).catch(() => []);
    const all = [...new Set([...rt.map((x) => `service worker/rozszerzenie – ${x}`), ...cbErrors, ...popupErrors.map((x) => `popup: ${x}`)])];
    if (all.length) errors.push(...all.slice(0, 20));
    await add('js-errors', 'Brak błędów JS ChromeBlock w konsoli', all.length ? 'FAIL' : 'PASS', all.length ? `liczba błędów: ${all.length} (lista w „Błędy”)` : '0 błędów');
  } catch (e) {
    result.fatal = String((e && e.message) || e).split('\n')[0];
    errors.push(`przerwano: ${result.fatal}`);
    if (!checks.some((c) => c.status === 'FAIL')) await add('tester', 'Przebieg testu', 'FAIL', result.fatal);
  } finally {
    if (context) await context.close().catch(() => {});
    site.server.close();
    fs.rmSync(tmp, { recursive: true, force: true }); // profil + kopia rozszerzenia
  }
  return finish();
}

// --- zgoda YouTube (okno na youtube.com, np. „Zanim przejdziesz do YouTube”) --------------------
// W JEDNORAZOWYM profilu testowym tester wybiera „Odrzuć wszystko” – zwykłe kliknięcie przez Playwright.
// CAPTCHA i logowanie nie są obchodzone (→ SKIP).
export const CONSENT_HEADING_RE = /zanim przejdziesz do youtube|before you continue to youtube|bevor sie zu youtube weitergehen|avant d['’]accéder à youtube|antes de (?:ir|continuar) a youtube/i;
export const CONSENT_REJECT_RE = /^\s*(?:odrzuć wszystko|reject all|alle ablehnen|tout refuser|rechazar todo)\s*$/i;
// nigdy nie klikamy niczego, co akceptuje (PL/EN/DE/FR/ES)
export const CONSENT_ACCEPT_RE = /zaakceptuj|akceptuj|accept|akzeptier|annehmen|accepter|aceptar/i;
export const CONSENT_CLICKABLE_SEL = 'button, [role="button"], a[href], tp-yt-paper-button, yt-button-shape, ytd-button-renderer, [tabindex]';
export const CONSENT_DIALOG_SEL = 'ytd-consent-bump-v2-lightbox, tp-yt-paper-dialog, [role="dialog"], [role="alertdialog"], dialog[open]';

const visible = (loc) => loc.isVisible().catch(() => false);

/** Widoczne okno zgody YouTube na stronie: {root} albo null. */
export async function findConsentModal(page) {
  try {
    const dialogs = page.locator(CONSENT_DIALOG_SEL);
    const byHeading = dialogs.filter({ hasText: CONSENT_HEADING_RE });
    const n = await byHeading.count();
    for (let i = n - 1; i >= 0; i--) if (await visible(byHeading.nth(i))) return { root: byHeading.nth(i) };
    const byButton = dialogs.filter({ has: page.getByRole('button', { name: CONSENT_REJECT_RE }) });
    const m = await byButton.count();
    for (let i = m - 1; i >= 0; i--) if (await visible(byButton.nth(i))) return { root: byButton.nth(i) };
    // nagłówek widoczny poza znanym kontenerem okna → szukamy przycisku na całej stronie
    if (await visible(page.getByText(CONSENT_HEADING_RE).first())) return { root: page.locator('body') };
  } catch { /* nawigacja w trakcie sprawdzania */ }
  return null;
}

/**
 * Zakresy wyszukiwania przycisku: okno → kolejne większe kontenery (do 4 poziomów, nigdy powyżej
 * elementu bezpośrednio pod <body>) → cała strona.
 */
export async function consentSearchScopes(page, root) {
  const scopes = [{ name: 'okno zgody', loc: root }];
  const depth = await root.evaluate((el) => {
    let d = 0;
    while (el.parentElement && el.parentElement !== document.body && el.parentElement !== document.documentElement) { el = el.parentElement; d++; }
    return d;
  }).catch(() => 0);
  let cur = root;
  for (let i = 1; i <= Math.min(4, depth); i++) { cur = cur.locator('xpath=..'); scopes.push({ name: `kontener okna (+${i})`, loc: cur }); }
  scopes.push({ name: 'cała strona', loc: page.locator('body') });
  return scopes;
}

/** Czy element (lub jego przycisk-przodek) wygląda na akceptację – wtedy NIE klikamy. */
const looksLikeAccept = (loc) => loc.evaluate((el, src) => {
  const re = new RegExp(src, 'i');
  const host = el.closest('button, [role="button"], a, tp-yt-paper-button, yt-button-shape, ytd-button-renderer') || el;
  const texts = [el.innerText, el.getAttribute('aria-label'), host.innerText, host.getAttribute('aria-label')];
  return texts.some((t) => t && re.test(t));
}, CONSENT_ACCEPT_RE.source).catch(() => true);

/**
 * Szuka przycisku „Odrzuć wszystko” (i odpowiedników): kolejno w oknie zgody, w większych kontenerach,
 * na całej stronie; button / [role=button] / element klikalny z DOKŁADNYM tekstem. Pomija akceptację.
 * @returns {Promise<{loc, scope:string, how:string}|null>}
 */
export async function findRejectButton(page, root) {
  for (const sc of await consentSearchScopes(page, root)) {
    const kinds = [
      ['rola button', sc.loc.getByRole('button', { name: CONSENT_REJECT_RE })],
      ['element klikalny', sc.loc.locator(CONSENT_CLICKABLE_SEL).filter({ hasText: CONSENT_REJECT_RE })],
      ['dokładny tekst', sc.loc.getByText(CONSENT_REJECT_RE)],
    ];
    for (const [how, list] of kinds) {
      const n = Math.min(await list.count().catch(() => 0), 10);
      for (let i = 0; i < n; i++) {
        const c = list.nth(i);
        if (!(await visible(c))) continue;
        if (await looksLikeAccept(c)) continue;
        return { loc: c, scope: sc.name, how };
      }
    }
  }
  return null;
}

/** Diagnostyka (bez danych użytkownika): tekst nagłówka zgody i widoczne nazwy przycisków w oknie i okolicy. */
export async function consentDiagnostics(page, root) {
  const heading = await page.getByText(CONSENT_HEADING_RE).first().innerText({ timeout: 2000 }).catch(() => '');
  const scopes = await consentSearchScopes(page, root);
  const area = scopes[Math.max(0, scopes.length - 2)].loc; // największy kontener okna (bez całej strony)
  const buttons = await area.evaluate((el, sel) => {
    const vis = (e) => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none'; };
    const out = [];
    for (const e of el.querySelectorAll(sel)) {
      if (!vis(e)) continue;
      const name = (e.getAttribute('aria-label') || e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      if (!name) continue;
      const kind = `${e.tagName.toLowerCase()}${e.getAttribute('role') ? `[role=${e.getAttribute('role')}]` : ''}`;
      const item = `${kind}: „${name}”`;
      if (!out.includes(item)) out.push(item);
      if (out.length >= 25) break;
    }
    return out;
  }, CONSENT_CLICKABLE_SEL).catch(() => []);
  return { heading: heading.replace(/\s+/g, ' ').trim().slice(0, 120), buttons };
}

/**
 * Zamyka okno zgody YouTube przyciskiem „Odrzuć wszystko” (przewija okno, jeśli przycisk jest niżej)
 * i POTWIERDZA, że okno zniknęło.
 * @returns {Promise<{state:'none'|'dismissed'|'failed'|'present', reason?:string}>}
 *   present – okno jest, ale klikanie wyłączone (--no-consent)
 */
export async function dismissConsentModal(page, { click = true, appearMs = 8000, closeMs = 10000 } = {}) {
  let modal = null;
  const t0 = Date.now();
  while (Date.now() - t0 < appearMs) {
    modal = await findConsentModal(page);
    if (modal) break;
    // film już się odtwarza → okna nie ma (nie czekamy dłużej)
    const playing = await page.evaluate(() => { const v = document.querySelector('#movie_player video') || document.querySelector('video'); return !!v && !v.paused && v.currentTime > 0.5; }).catch(() => false);
    if (playing) return { state: 'none' };
    await page.waitForTimeout(500);
  }
  if (!modal) return { state: 'none' };
  if (!click) return { state: 'present', reason: 'okno zgody YouTube (uruchom bez --no-consent)' };
  const found = await findRejectButton(page, modal.root);
  if (!found) {
    return { state: 'failed', reason: 'nie znaleziono przycisku „Odrzuć wszystko” (okno, okolica, cała strona)', diagnostics: await consentDiagnostics(page, modal.root) };
  }
  const btn = found.loc;
  try {
    await btn.scrollIntoViewIfNeeded({ timeout: 5000 }); // przycisk może być niżej / poza viewportem
    await btn.click({ timeout: 10000 });
  } catch (e) {
    return { state: 'failed', reason: `nie udało się kliknąć „Odrzuć wszystko” (${String((e && e.message) || e).split('\n')[0]})` };
  }
  const t1 = Date.now();
  while (Date.now() - t1 < closeMs) {
    await page.waitForTimeout(500);
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    if (!(await findConsentModal(page))) return { state: 'dismissed', found: { scope: found.scope, how: found.how } };
  }
  return { state: 'failed', reason: 'okno zgody nie zniknęło po kliknięciu „Odrzuć wszystko”', diagnostics: await consentDiagnostics(page, modal.root) };
}

// --- Onboarding (strona powitalna po świeżej instalacji) -------------------------------------------
export const ONBOARDING_CHECKS = Object.freeze([
  ['onb-open', 'Onboarding: otwarcie'],
  ['onb-default', 'Onboarding: domyślny tryb'],
  ['onb-start', 'Onboarding: start'],
  ['onb-errors', 'Onboarding: bez błędów'],
]);
const isWelcomePage = (pg) => /^chrome-extension:\/\/[^/]+\/welcome\/welcome\.html/.test(pg.url());

async function runOnboarding({ context, add, call, setCurrent }) {
  const name = (id) => ONBOARDING_CHECKS.find(([k]) => k === id)[1];
  const done = new Set();
  const report = async (id, status, detail) => { done.add(id); await add(id, name(id), status, detail); };
  const errors = [];
  let seen = false;
  const watch = (pg) => {
    seen = true;
    pg.on('pageerror', (e) => errors.push(String((e && e.message) || e).split('\n')[0]));
    pg.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().split('\n')[0]); });
  };
  try {
    // 1. dokładnie jedna karta powitalna po świeżej instalacji
    let welcome = context.pages().find(isWelcomePage);
    if (!welcome) welcome = await context.waitForEvent('page', { predicate: isWelcomePage, timeout: 15000 }).catch(() => null);
    const count = context.pages().filter(isWelcomePage).length;
    if (!welcome) throw new Error('strona powitalna nie otworzyła się po instalacji');
    watch(welcome);
    setCurrent(welcome);
    await report('onb-open', count === 1 ? 'PASS' : 'FAIL', count === 1 ? 'jedna karta welcome/welcome.html po świeżej instalacji' : `kart powitalnych: ${count}`);

    // 2. Basic zaznaczony; widoczne Basic / Balanced / Strict
    await welcome.waitForSelector('#modes input', { timeout: 15000 });
    const names = await welcome.$$eval('#modes .name', (n) => n.filter((x) => x.offsetParent !== null).map((x) => x.textContent.trim()));
    const checked = await welcome.$eval('#modes input:checked', (i) => i.value).catch(() => null);
    const okDefault = checked === 'basic' && JSON.stringify(names) === JSON.stringify(['Basic', 'Balanced', 'Strict']);
    await report('onb-default', okDefault ? 'PASS' : 'FAIL', okDefault ? 'Basic zaznaczony; widoczne Basic, Balanced, Strict' : `zaznaczony: ${checked}; widoczne: ${names.join(', ')}`);

    // 3. „Zacznij korzystać” bez zmiany Basic → sukces, karta się zamyka, Basic = istniejący preset
    await welcome.bringToFront();
    const closed = welcome.waitForEvent('close', { timeout: 30000 }).then(() => true).catch(() => false);
    await welcome.click('#start');
    const success = await welcome.waitForSelector('#status.ok', { timeout: 60000 }).then(() => true).catch(() => false);
    const msg = welcome.isClosed() ? '' : ((await welcome.textContent('#status').catch(() => '')) || '');
    const wasClosed = await closed;
    const o = await call({ type: 'options:get' }).catch(() => null);
    const lists = o ? o.lists.filter((l) => l.enabled).map((l) => l.id).sort() : [];
    const preset = o && o.protectionModes && o.protectionModes.basic ? [...o.protectionModes.basic].sort() : null;
    const problems = [];
    if (!success) problems.push(`brak komunikatu sukcesu${msg ? ` (${msg.trim().slice(0, 120)})` : ''}`);
    if (!wasClosed) problems.push('karta powitalna się nie zamknęła');
    if (!o || o.protectionMode !== 'basic') problems.push(`protectionMode: ${o && o.protectionMode}`);
    if (!preset || JSON.stringify(lists) !== JSON.stringify(preset)) problems.push(`listy ${lists.join(',')} ≠ preset Basic ${preset ? preset.join(',') : '—'}`);
    await report('onb-start', problems.length ? 'FAIL' : 'PASS', problems.join('; ') || `„Gotowe” → karta zamknięta; protectionMode = basic; listy = preset Basic (${lists.join(', ')})`);
  } catch (e) {
    const why = `przerwano: ${String((e && e.message) || e).split('\n')[0]}`;
    for (const [id] of ONBOARDING_CHECKS) if (id !== 'onb-errors' && !done.has(id)) await report(id, 'FAIL', why);
  } finally {
    // 4. błędy JS strony powitalnej
    if (!seen) await report('onb-errors', 'SKIP', 'INCONCLUSIVE – strona powitalna się nie otworzyła');
    else await report('onb-errors', errors.length ? 'FAIL' : 'PASS', errors.length ? `błędy JS: ${errors.slice(0, 3).join(' | ')}` : '0 błędów JS na stronie powitalnej');
  }
}

// --- Kopia ustawień (Backup / Restore) przez prawdziwy UI Opcji ------------------------------------
export const BACKUP_CHECKS = Object.freeze([
  ['backup-export', 'Backup: eksport'],
  ['backup-privacy', 'Backup: prywatność'],
  ['backup-import', 'Backup: import'],
  ['backup-match', 'Backup: zgodność ustawień'],
  ['backup-badfile', 'Backup: błędny plik'],
  ['backup-final', 'Backup: stan po teście'],
]);
const BACKUP_KEYS = ['enabledLists', 'disabledSites', 'userFilters', 'protectionMode'];
const BACKUP_TEST_HOST = 'chromeblock-backup-test.example';
// w kopii nie może być: health, diagnostyki, danych sesji, statystyk, kart, adresów
const BACKUP_FORBIDDEN = ['"health"', 'startupProfile', 'devPerf', 'scriptletPerf', 'statsTabs', 'statsRt', 'sessionScriptletsOk', 'tabId', '"errors"', 'http://', 'https://'];

/** Ustawienia w postaci porównywalnej (z options:get). */
export function settingsView(o) {
  if (!o) return null;
  return {
    enabledLists: (o.lists || []).filter((l) => l.enabled).map((l) => l.id).sort(),
    protectionMode: o.protectionMode,
    disabledSites: [...(o.disabledSites || [])].sort(),
    userFilters: o.userFilters || '',
  };
}

/** Różnice między dwoma widokami ustawień (lista nazw pól). */
export function settingsDiff(a, b) {
  if (!a || !b) return ['brak danych'];
  return BACKUP_KEYS.filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
}

/** Kontrola kopii (czysta logika): format, dokładnie 4 pola, zgodność ze snapshotem, prywatność. */
export function checkBackupFile(text, snapshot) {
  const out = { export: [], privacy: [], data: null };
  let b;
  try { b = JSON.parse(text); } catch { out.export.push('pobrany plik nie jest poprawnym JSON'); return out; }
  out.data = b;
  if (b.format !== 'chromeblock-settings') out.export.push(`format: ${JSON.stringify(b.format)}`);
  if (b.version !== 1) out.export.push(`version: ${JSON.stringify(b.version)}`);
  const keys = b.settings && typeof b.settings === 'object' ? Object.keys(b.settings).sort() : [];
  if (JSON.stringify(keys) !== JSON.stringify([...BACKUP_KEYS].sort())) out.export.push(`pola ustawień: ${keys.join(', ') || 'brak'} (oczekiwano dokładnie ${BACKUP_KEYS.length})`);
  if (snapshot && b.settings) {
    const v = { ...b.settings, enabledLists: [...(b.settings.enabledLists || [])].sort(), disabledSites: [...(b.settings.disabledSites || [])].sort() };
    const diff = settingsDiff(v, snapshot);
    if (diff.length) out.export.push(`kopia różni się od bieżących ustawień: ${diff.join(', ')}`);
  }
  const extraTop = Object.keys(b).filter((k) => !['format', 'version', 'exportedAt', 'extensionVersion', 'settings'].includes(k));
  if (extraTop.length) out.privacy.push(`dodatkowe pola: ${extraTop.join(', ')}`);
  // treść własnych filtrów użytkownika pomijamy (to jego ustawienie, może zawierać adresy)
  const scan = JSON.stringify({ ...b, settings: { ...(b.settings || {}), userFilters: '' } });
  const found = BACKUP_FORBIDDEN.filter((w) => scan.includes(w));
  if (found.length) out.privacy.push(`w kopii: ${found.join(', ')}`);
  return out;
}

async function runBackup({ context, add, extId, opt, dir, setCurrent }) {
  fs.mkdirSync(dir, { recursive: true });
  const call = (msg) => opt.evaluate((m) => chrome.runtime.sendMessage(m), msg);
  const view = async () => settingsView(await call({ type: 'options:get' }).catch(() => null));
  const done = new Set();
  const report = async (id, status, detail) => {
    done.add(id);
    await add(id, BACKUP_CHECKS.find(([k]) => k === id)[1], status, detail);
  };
  const snapshot = await view();
  let page = null;
  try {
    if (!snapshot) throw new Error('nie można odczytać ustawień (options:get)');
    page = await context.newPage();
    setCurrent(page);
    await page.goto(`chrome-extension://${extId}/options/options.html#backup`);
    await page.waitForSelector('#exportSettings', { timeout: 15000 });
    await page.waitForFunction(() => document.querySelectorAll('#listContainer input').length > 0, null, { timeout: 30000 });

    // 1. eksport przez UI
    const [download] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), page.click('#exportSettings')]);
    const file = path.join(dir, 'kopia.json');
    await download.saveAs(file);
    const name = download.suggestedFilename();
    const chk = checkBackupFile(fs.readFileSync(file, 'utf8'), snapshot);
    if (!/^chromeblock-ustawienia-\d{4}-\d{2}-\d{2}\.json$/.test(name)) chk.export.push(`nazwa pliku: ${name}`);
    await report('backup-export', chk.export.length ? 'FAIL' : 'PASS', chk.export.join('; ') || `${name}: format chromeblock-settings v1, 4 pola zgodne z ustawieniami`);
    await report('backup-privacy', chk.privacy.length ? 'FAIL' : 'PASS', chk.privacy.join('; ') || 'bez health, diagnostyki, sesji, statystyk, kart i adresów');
    if (chk.export.length) throw new Error('eksport niepoprawny – import pominięty');

    // 2. zmiana wszystkich ustawień (istniejące API Opcji)
    await call({ type: 'options:setProtectionMode', mode: snapshot.protectionMode === 'strict' ? 'basic' : 'strict' });
    await call({ type: 'options:setDisabledSites', sites: [...snapshot.disabledSites, BACKUP_TEST_HOST] });
    await call({ type: 'options:setUserFilters', text: `${snapshot.userFilters}${snapshot.userFilters && !snapshot.userFilters.endsWith('\n') ? '\n' : ''}||${BACKUP_TEST_HOST}^\n` });
    const changed = settingsDiff(await view(), snapshot);
    const dynBefore = await opt.evaluate(() => chrome.declarativeNetRequest.getDynamicRules()).catch(() => []);
    const testRulesBefore = JSON.stringify(dynBefore).includes(BACKUP_TEST_HOST);
    if (changed.length < 4) throw new Error(`nie udało się zmienić ustawień przed importem (zmienione: ${changed.join(', ')})`);

    // 3. import wcześniej wyeksportowanego pliku przez UI
    const importStart = await opt.evaluate(() => Date.now());
    await page.reload();
    await page.waitForSelector('#importSettings');
    await page.bringToFront(); // np. karta powitalna po instalacji mogła przejąć fokus – okno wyboru pliku wymaga aktywnej karty
    const [chooser] = await Promise.all([page.waitForEvent('filechooser', { timeout: 15000 }), page.click('#importSettings')]);
    await chooser.setFiles(file);
    await page.waitForSelector('#importSummary:not([hidden]), #importErrors:not([hidden])', { timeout: 120000 });
    const okUi = await page.isVisible('#importSummary');
    const uiText = ((await page.textContent(okUi ? '#importSummary' : '#importErrors')) || '').replace(/\s+/g, ' ').trim();

    // stan silnika po imporcie
    const after = await view();
    const h = await call({ type: 'health:get' }).catch(() => null);
    const eng = await opt.evaluate(async () => {
      const rulesets = (await chrome.declarativeNetRequest.getEnabledRulesets()).sort();
      const dyn = await chrome.declarativeNetRequest.getDynamicRules();
      const reg = await chrome.scripting.getRegisteredContentScripts();
      return { rulesets, dyn, regLists: [...new Set(reg.filter((r) => r.id.startsWith('sl-')).map((r) => r.id.split('-')[1]))].sort() };
    }).catch((e) => ({ error: String(e) }));
    const withScriptlets = [];
    for (const id of after ? after.enabledLists : []) {
      const files = await opt.evaluate((x) => fetch(chrome.runtime.getURL(`data/${x}.scriptlets.json`)).then((r) => r.json()).catch(() => []), id);
      if (files.length) withScriptlets.push(id);
    }
    const problems = [];
    if (!okUi) problems.push(`UI: ${uiText.slice(0, 200)}`);
    for (const c of COMPONENTS) if (h && h.components && h.components[c] && h.components[c].status === 'error') problems.push(`health ${COMPONENT_LABEL[c]}: ERROR`);
    for (const step of ['rulesets', 'dynamicRules', 'scriptlets']) {
      const r = h && h.sync && h.sync[step];
      if (!r || r.status !== 'ok' || !(r.at >= importStart)) problems.push(`synchronizacja ${step}: ${r ? `${r.status}${r.at >= importStart ? '' : ' (sprzed importu)'}` : 'brak'}`);
    }
    if (eng.error) problems.push(`odczyt stanu Chrome: ${eng.error}`);
    else if (after) {
      if (JSON.stringify(eng.rulesets) !== JSON.stringify(after.enabledLists)) problems.push(`zestawy reguł Chrome (${eng.rulesets.join(',')}) ≠ listy (${after.enabledLists.join(',')})`);
      const site = eng.dyn.find((r) => r.id === 1);
      const siteDomains = site ? [...(site.condition.requestDomains || [])].sort() : [];
      if (JSON.stringify(siteDomains) !== JSON.stringify(after.disabledSites)) problems.push('reguła wyłączonych stron ≠ ustawienia');
      if (!testRulesBefore) problems.push('przed importem brak testowych reguł dynamicznych (zmiana nie dotarła do Chrome)');
      if (JSON.stringify(eng.dyn).includes(BACKUP_TEST_HOST)) problems.push('po imporcie zostały testowe reguły dynamiczne');
      if (JSON.stringify(eng.regLists) !== JSON.stringify(withScriptlets.sort())) problems.push(`scriptlety zarejestrowane dla: ${eng.regLists.join(',') || '—'}; oczekiwano: ${withScriptlets.join(',') || '—'}`);
    }
    await report('backup-import', problems.length ? 'FAIL' : 'PASS', problems.join('; ') || `przez UI; podsumowanie widoczne; health bez ERROR; listy, reguły dynamiczne i scriptlety zsynchronizowane`);
    const diff = settingsDiff(after, snapshot);
    await report('backup-match', diff.length ? 'FAIL' : 'PASS', diff.length ? `nie wróciły: ${diff.join(', ')}` : 'enabledLists, protectionMode, disabledSites, userFilters = snapshot');

    // 4. błędny plik → odrzucony, bez zmian
    const bad = path.join(dir, 'uszkodzony.json');
    fs.writeFileSync(bad, '{"format": "chromeblock-settings", "version": 1, "settings": {');
    const beforeBad = await view();
    await page.bringToFront();
    const [chooser2] = await Promise.all([page.waitForEvent('filechooser', { timeout: 15000 }), page.click('#importSettings')]);
    await chooser2.setFiles(bad);
    const rejected = await page.waitForSelector('#importErrors:not([hidden])', { timeout: 30000 }).then(() => true).catch(() => false);
    const errText = rejected ? ((await page.textContent('#importErrors')) || '') : '';
    const badDiff = settingsDiff(await view(), beforeBad);
    const okBad = rejected && /niepoprawny/.test(errText) && !badDiff.length;
    await report('backup-badfile', okBad ? 'PASS' : 'FAIL', okBad ? 'odrzucony („plik jest niepoprawny”), żadne ustawienie się nie zmieniło'
      : [!rejected && 'brak komunikatu o odrzuceniu', rejected && !/niepoprawny/.test(errText) && `komunikat: ${errText.slice(0, 120)}`, badDiff.length && `zmieniono: ${badDiff.join(', ')}`].filter(Boolean).join('; '));
  } catch (e) {
    const why = `przerwano: ${String((e && e.message) || e).split('\n')[0]}`;
    for (const [id] of BACKUP_CHECKS) if (id !== 'backup-final' && !done.has(id)) await report(id, 'FAIL', why);
  } finally {
    // 5. zawsze przywróć stan początkowy (także po FAIL)
    let detail = '';
    let ok = false;
    try {
      if (!snapshot) throw new Error('brak snapshotu');
      let diff = settingsDiff(await view(), snapshot);
      if (diff.length) {
        await call({ type: 'options:setLists', enabledLists: snapshot.enabledLists });
        await call({ type: 'options:setDisabledSites', sites: snapshot.disabledSites });
        await call({ type: 'options:setUserFilters', text: snapshot.userFilters });
        diff = settingsDiff(await view(), snapshot);
        detail = diff.length ? `nie udało się przywrócić: ${diff.join(', ')}` : 'przywrócono stan początkowy po teście';
      } else detail = 'ustawienia jak przed testem';
      ok = !diff.length;
    } catch (e) {
      detail = `błąd przywracania: ${String((e && e.message) || e).split('\n')[0]}`;
    }
    await report('backup-final', ok ? 'PASS' : 'FAIL', detail);
    if (page) await page.close().catch(() => {});
  }
}

/** Otwiera adres YouTube; zwraca powód pominięcia (sieć, zgoda, CAPTCHA, logowanie) albo null. */
export async function openYouTube(page, url, consent, { onConsentDiagnostics = null } = {}) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  } catch (e) {
    const net = networkErrorOf(e);
    if (net) return `INCONCLUSIVE – YouTube niedostępny (${net})`;
    throw e;
  }
  let gate = await detectGate(page);
  if (gate === 'consent' && consent) { if (await handleConsent(page)) gate = await detectGate(page); }
  if (gate === 'consent') return 'INCONCLUSIVE – ekran zgody na cookies (uruchom bez --no-consent)';
  if (gate === 'captcha') return 'INCONCLUSIVE – Google wymaga weryfikacji (CAPTCHA) – bez obchodzenia';
  if (/accounts\.google\.com|ServiceLogin|signin/.test(page.url())) return 'INCONCLUSIVE – YouTube wymaga logowania';
  // okno zgody bezpośrednio na youtube.com (pojawia się po chwili – czekamy, zamykamy i potwierdzamy)
  const c = await dismissConsentModal(page, { click: consent });
  if (c.diagnostics && onConsentDiagnostics) onConsentDiagnostics(c.diagnostics);
  if (c.state === 'present' || c.state === 'failed') return `INCONCLUSIVE – ${c.reason}; nie da się wiarygodnie sprawdzić odtwarzania (to nie jest błąd ChromeBlock)`;
  if (/\/sorry\//.test(page.url())) return 'INCONCLUSIVE – Google wymaga weryfikacji (CAPTCHA) – bez obchodzenia';
  return null;
}

const readVideoError = (page) => page.evaluate(() => { const v = document.querySelector('#movie_player video'); return v && v.error ? v.error.code : 0; }).catch(() => 0);

/** Seek o SEEK_DELTA_S i próbkowanie do SEEK_RESUME_WAIT_S (wspólne dla przebiegu z ChromeBlock i kontroli). */
async function probeSeek(page) {
  const before = await seekForward(page, SEEK_DELTA_S);
  const after = [];
  for (let i = 0; i < SEEK_RESUME_WAIT_S; i++) {
    await page.waitForTimeout(1000);
    after.push(await page.evaluate(pageSample, 'player'));
    const r = classifySeek({ before, samples: after });
    if (r.seek.status === 'PASS' && r.resume.status === 'PASS') break;
  }
  const videoError = await readVideoError(page);
  return { before, after, videoError, facts: seekFacts({ before, samples: after, videoError, finalUrl: page.url() }), result: classifySeek({ before, samples: after, videoError }) };
}

/**
 * Kontrola A/B: ten sam film i ten sam seek w ŚWIEŻYM tymczasowym profilu BEZ ChromeBlock.
 * Zwraca seekFacts() albo {skipped: powód}. Profil jest usuwany po teście.
 */
async function runControlSeek({ chromium, headless, video, consent, onContext, log }) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-control-'));
  let context = null;
  try {
    log('  Kontrola A/B: ten sam seek w świeżym profilu BEZ ChromeBlock…');
    context = await chromium.launchPersistentContext(path.join(tmp, 'profile'), { headless, channel: 'chromium', viewport: { width: 1280, height: 800 }, args: browserArgs(null) });
    if (onContext) await onContext(context);
    const page = await context.newPage();
    const skip = await openYouTube(page, `https://www.youtube.com/watch?v=${encodeURIComponent(video)}`, consent);
    if (skip) return { skipped: skip };
    if (!(await page.waitForSelector('#movie_player', { timeout: 30000 }).then(() => true).catch(() => false))) return { skipped: 'brak odtwarzacza w kontroli' };
    await ensurePlaying(page, 'player');
    const pre = await samplePlayer(page, 'player', 10);
    const playback = analyzePlayback(pre, { minProgress: 2 });
    if (!playback.ok) return { skipped: `odtwarzanie w kontroli nie wystartowało (${playback.reasons.join('; ')})` };
    return (await probeSeek(page)).facts;
  } catch (e) {
    return { skipped: `błąd kontroli: ${String((e && e.message) || e).split('\n')[0]}` };
  } finally {
    if (context) await context.close().catch(() => {});
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

async function runYouTube({ context, add, skipRest, YT, video, shortsUrl, consent, setCurrent, notes, runControl, log = () => {}, onConsentDiagnostics = null }) {
  const page = await context.newPage();
  setCurrent(page);
  const raw = watchRawResponses(page);
  const open = (url) => openYouTube(page, url, consent, { onConsentDiagnostics });

  const watchSkip = await open(`https://www.youtube.com/watch?v=${encodeURIComponent(video)}`);
  if (watchSkip) { await skipRest(YT, watchSkip); await page.close(); return null; }

  const hasPlayer = await page.waitForSelector('#movie_player', { timeout: 30000 }).then(() => true).catch(() => false);
  if (/\/watch/.test(new URL(page.url()).pathname) && hasPlayer) await add('yt-watch', 'YouTube: strona watch', 'PASS', 'odtwarzacz obecny');
  else {
    await add('yt-watch', 'YouTube: strona watch', 'FAIL', hasPlayer ? 'adres nie jest /watch' : 'brak odtwarzacza (#movie_player) w 30 s');
  }

  await ensurePlaying(page, 'player');
  const samples = await samplePlayer(page, 'player', 15);
  const hasVideo = samples.some((s) => s.hasVideo);
  await add('yt-video', 'YouTube: element video', hasVideo ? 'PASS' : 'FAIL', hasVideo ? '' : 'brak <video> w odtwarzaczu');

  const playback = analyzePlayback(samples);
  const adState = analyzeAdState(samples);
  if (!playback.ok && await findConsentModal(page)) {
    const why = 'INCONCLUSIVE – okno zgody YouTube zasłania odtwarzacz i nie zostało zamknięte (to nie jest błąd ChromeBlock)';
    await skipRest(YT.filter(([id]) => !['yt-watch', 'yt-video'].includes(id)), why);
    await page.close();
    return null;
  }
  await add('yt-play', 'YouTube: odtwarzanie startuje', playback.ok ? 'PASS' : 'FAIL', playback.ok ? `postęp ${playback.progress} s w 15 s` : playback.reasons.join('; '));

  let seekAB = null;
  let controlAlsoFails = false;
  const preSeekError = samples.some((x) => x.error);
  if (playback.ok) {
    const probe = await probeSeek(page);
    let { seek, resume } = probe.result;
    // FAIL seek → kontrola A/B bez ChromeBlock (bez obejść, tylko diagnostyka)
    if ((seek.status === 'FAIL' || resume.status === 'FAIL') && runControl) {
      const control = await runControl();
      const ab = classifyAB(probe.facts, control);
      seekAB = { ...ab, with: probe.facts, without: control };
      log(`  A/B seek: ${ab.verdict} – ${ab.detail}`);
      if (ab.verdict === AB.CONTROL_ALSO_FAILS) {
        controlAlsoFails = true;
        const pre = 'CONTROL ALSO FAILS (ten sam błąd bez ChromeBlock) – ';
        if (seek.status === 'FAIL') seek = { status: 'SKIP', detail: pre + seek.detail };
        if (resume.status === 'FAIL') resume = { status: 'SKIP', detail: pre + resume.detail };
      }
    }
    await add('yt-seek', 'YouTube: seek', seek.status, seek.detail);
    await add('yt-seek-resume', 'YouTube: odtwarzanie po seek', resume.status, resume.detail);
    if (seekAB) {
      const st = seekAB.verdict === AB.CHROMEBLOCK_SPECIFIC ? 'FAIL' : 'SKIP';
      await add('yt-seek-ab', 'YouTube: seek A/B (kontrola bez ChromeBlock)', st, `${seekAB.verdict} – ${seekAB.detail}`);
    }
    samples.push(...probe.after);
  } else {
    await add('yt-seek', 'YouTube: seek', 'SKIP', 'INCONCLUSIVE – odtwarzanie nie wystartowało');
    await add('yt-seek-resume', 'YouTube: odtwarzanie po seek', 'SKIP', 'INCONCLUSIVE – odtwarzanie nie wystartowało');
  }

  const videoError = await readVideoError(page);
  const playerErr = samples.some((x) => x.error) || videoError;
  const antiAdblock = samples.some((x) => x.antiAdblock);
  const errDetail = [playerErr && `błąd odtwarzacza${videoError ? ` (video.error ${videoError})` : ''}`, antiAdblock && 'ostrzeżenie anti-adblock'].filter(Boolean).join('; ');
  if (!playerErr && !antiAdblock) await add('yt-player-error', 'YouTube: brak błędu playera', 'PASS', 'brak .ytp-error, brak video.error');
  else if (controlAlsoFails && !preSeekError && !antiAdblock) await add('yt-player-error', 'YouTube: brak błędu playera', 'SKIP', `CONTROL ALSO FAILS (ten sam błąd po seek bez ChromeBlock) – ${errDetail}`);
  else await add('yt-player-error', 'YouTube: brak błędu playera', 'FAIL', errDetail);

  const visibleSummary = await page.evaluate(pagePlayerResponseSummary).catch(() => null);
  const ads = classifyAds(adState, { raw: mergeTriState(raw), visible: adFieldsInPlayerResponse(visibleSummary) });
  if (ads.verdict === OUTCOME.AD_VISIBLE_FAILURE) await add('yt-ads', 'YouTube: reklamy (tylko z dowodem)', 'FAIL', `reklama widoczna (${ads.evidence.join(', ')}); ${ads.notes.join('; ')}`);
  else if (ads.verdict === OUTCOME.AD_BLOCKING_OBSERVED) await add('yt-ads', 'YouTube: reklamy (tylko z dowodem)', 'PASS', `usunięcie danych reklam zaobserwowane: ${ads.evidence.join('; ')}`);
  else await add('yt-ads', 'YouTube: reklamy (tylko z dowodem)', 'SKIP', 'INCONCLUSIVE – nie zaobserwowano okazji reklamowej');
  for (const n of ads.notes) if (!/INCONCLUSIVE/.test(n)) notes.push(`YouTube: ${n}`);

  // Shorts
  const shortsSkip = await open(shortsUrl);
  if (shortsSkip) await add('yt-shorts', 'YouTube: Shorts', 'SKIP', shortsSkip);
  else {
    const gotId = await page.waitForURL(/\/shorts\/[\w-]{5,}/, { timeout: 25000 }).then(() => true).catch(() => false);
    if (!gotId) await add('yt-shorts', 'YouTube: Shorts', 'SKIP', 'INCONCLUSIVE – YouTube nie otworzył konkretnego Shorts (podaj --shorts <adres>)');
    else {
      await ensurePlaying(page, 'shorts');
      const s = await samplePlayer(page, 'shorts', 8);
      const ok = s.some((x) => x.hasVideo) && progressOf(s) >= 2 && !s.slice(-3).every((x) => x.error);
      await add('yt-shorts', 'YouTube: Shorts', ok ? 'PASS' : 'FAIL', ok ? `odtwarza (postęp ${progressOf(s)} s)` : (s.some((x) => x.hasVideo) ? 'video nie odtwarza się' : 'brak elementu video'));
    }
  }
  await page.close();
  return seekAB;
}

// ---------------------------------------------------------------------------

export function parseArgs(argv) {
  const o = { headless: process.platform === 'linux' && !process.env.DISPLAY, youtube: true, consent: true, extensionDir: null, video: DEFAULT_VIDEO, shortsUrl: DEFAULT_SHORTS, resultsDir: RESULTS_DIR };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--headless') o.headless = true;
    else if (a === '--headed') o.headless = false;
    else if (a === '--no-youtube') o.youtube = false;
    else if (a === '--no-consent') o.consent = false;
    else if (a === '--dir') o.extensionDir = path.resolve(argv[++i]);
    else if (a === '--video') o.video = argv[++i];
    else if (a === '--shorts') o.shortsUrl = argv[++i];
    else if (a === '--results') o.resultsDir = path.resolve(argv[++i]);
  }
  return o;
}

export function writeResults(result, dir = RESULTS_DIR) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'latest.json'), JSON.stringify(result, null, 2) + '\n');
  fs.writeFileSync(path.join(dir, 'latest.txt'), formatReport(result));
  return { json: path.join(dir, 'latest.json'), txt: path.join(dir, 'latest.txt') };
}

async function main() {
  if (process.argv.includes('--modes')) {
    const modes = await import('./protection-modes-sites.mjs');
    process.exitCode = await modes.main(process.argv.slice(2));
    return;
  }
  const o = parseArgs(process.argv.slice(2));
  if (o.extensionDir && !fs.existsSync(path.join(o.extensionDir, 'manifest.json'))) {
    console.log(`Brak manifest.json w ${o.extensionDir}`);
    process.exitCode = EXIT.ERROR;
    return;
  }
  fs.mkdirSync(o.resultsDir, { recursive: true });
  for (const f of fs.readdirSync(o.resultsDir)) if (/^fail-.*\.png$/.test(f)) fs.rmSync(path.join(o.resultsDir, f));
  console.log('ChromeBlock – lokalny test regresyjny (tymczasowy profil, bez Twoich danych)\n');
  const r = await withTimeout(runLocalTests({ ...o, screenshotDir: o.resultsDir }), 20 * 60_000, 'cały test');
  r.exitCode = exitCodeFor(r);
  const files = writeResults(r, o.resultsDir);
  console.log('\n' + formatReport(r));
  console.log(`Raport: ${files.txt}`);
  process.exitCode = r.exitCode;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((e) => {
    const r = { overall: 'FAIL', version: null, checks: [], errors: [String((e && e.stack) || e)], notes: [], fatal: String((e && e.message) || e), finishedAt: new Date().toISOString(), durationMs: 0 };
    r.exitCode = EXIT.ERROR;
    try { const f = writeResults(r, parseArgs(process.argv.slice(2)).resultsDir); console.log(formatReport(r)); console.log(`Raport: ${f.txt}`); } catch { console.error(e); }
    process.exitCode = EXIT.ERROR;
  });
}
