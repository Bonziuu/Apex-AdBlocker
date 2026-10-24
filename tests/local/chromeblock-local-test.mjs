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
      channel: 'chromium',
      viewport: { width: 1280, height: 800 },
      args: [
        `--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`,
        '--no-first-run', '--no-default-browser-check', '--disable-sync', '--disable-default-apps',
        '--disable-component-update', '--autoplay-policy=no-user-gesture-required', '--mute-audio',
      ],
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

    // 4. zwykła strona (lokalna) + popup + tryby
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
      ['yt-seek', 'YouTube: seek'], ['yt-player-error', 'YouTube: brak błędu playera'], ['yt-ads', 'YouTube: reklamy (tylko z dowodem)'], ['yt-shorts', 'YouTube: Shorts']];
    if (!youtube) await skipRest(YT, 'pominięto (--no-youtube)');
    else if (!online) await skipRest(YT, 'INCONCLUSIVE – brak dostępu do internetu');
    else await runYouTube({ context, add, skipRest, YT, video, shortsUrl, consent, setCurrent: (pg) => { current = pg; }, notes });

    // 7. health po testach
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

async function runYouTube({ context, add, skipRest, YT, video, shortsUrl, consent, setCurrent, notes }) {
  const page = await context.newPage();
  setCurrent(page);
  const raw = watchRawResponses(page);
  const open = async (url) => {
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
    // zgoda jako okno na stronie (w jednorazowym profilu: „Odrzuć wszystko”)
    if (consent) {
      const btn = page.locator('ytd-consent-bump-v2-lightbox button').filter({ hasText: /odrzuć|reject|ablehnen|refuser|rechazar/i }).first();
      if (await btn.count().catch(() => 0)) await btn.click().catch(() => {});
    }
    return null;
  };

  const watchSkip = await open(`https://www.youtube.com/watch?v=${encodeURIComponent(video)}`);
  if (watchSkip) { await skipRest(YT, watchSkip); await page.close(); return; }

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
  await add('yt-play', 'YouTube: odtwarzanie startuje', playback.ok ? 'PASS' : 'FAIL', playback.ok ? `postęp ${playback.progress} s w 15 s` : playback.reasons.join('; '));

  if (playback.ok) {
    const before = await seekForward(page, 60);
    await page.waitForTimeout(2000);
    const after = await samplePlayer(page, 'player', 6);
    const jumped = before != null && typeof after[0].currentTime === 'number' && after[0].currentTime >= before + 45;
    const grew = progressOf(after) >= 2;
    await add('yt-seek', 'YouTube: seek', jumped && grew ? 'PASS' : 'FAIL',
      jumped && grew ? `${Math.round(before)} s → ${Math.round(after[0].currentTime)} s, odtwarzanie trwa` : [!jumped && 'pozycja nie przeskoczyła o ≥ 45 s', !grew && 'czas nie rośnie po seek'].filter(Boolean).join('; '));
    samples.push(...after);
  } else {
    await add('yt-seek', 'YouTube: seek', 'SKIP', 'INCONCLUSIVE – odtwarzanie nie wystartowało');
  }

  const videoError = await page.evaluate(() => { const v = document.querySelector('#movie_player video'); return v && v.error ? v.error.code : 0; }).catch(() => 0);
  const playerErr = samples.some((s) => s.error) || videoError;
  const antiAdblock = samples.some((s) => s.antiAdblock);
  await add('yt-player-error', 'YouTube: brak błędu playera', playerErr || antiAdblock ? 'FAIL' : 'PASS',
    [playerErr && `błąd odtwarzacza${videoError ? ` (video.error ${videoError})` : ''}`, antiAdblock && 'ostrzeżenie anti-adblock'].filter(Boolean).join('; ') || 'brak .ytp-error, brak video.error');

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
