#!/usr/bin/env node
// Apex AdBlocker – zestaw zrzutów do Chrome Web Store: 5 PL + 5 EN, PNG 1280×800.
//
//   node store/cws-screenshots.mjs --zip Apex-AdBlocker-WebStore-1.0.0.zip [--out docs/webstore/cws-screenshots] [--locale pl|en|all]
//
// Źródłem jest wyłącznie opublikowana paczka sklepu (ZIP o przypiętym SHA-256), nie bieżący kod repozytorium.
// Każdy element interfejsu to rzeczywisty zrzut tej paczki działającej w Chromium Playwright:
// okienko otwierane akcją rozszerzenia (jak kliknięcie ikony), narzędzie „Ukryj element”, ustawienia.
// Strona demonstracyjna i jej zasoby reklamowe są podstawiane lokalnie; żadna zewnętrzna witryna nie jest
// odwiedzana, API Chrome nie jest podmieniane, a licznik pochodzi z rozszerzenia. Kompozycja dodaje tylko
// nagłówek, jedno zdanie, logo i tło – nie zmienia tekstu interfejsu rozszerzenia.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ROOT, SYNC_STEPS, COMPONENTS, loadPlaywright } from '../tools/chromium-smoke.mjs';
import { listFiles, validatePackage } from '../tools/package-dev.mjs';
import { VIEWPORT, snapshotTree, compareSnapshots, compareRuntimeSnapshot } from '../tools/webstore-screenshots.mjs';
import { demoPage, DEMO_HOST } from './tools/harness.mjs';

export const GENERATOR = 'store/cws-screenshots.mjs';
/** Opublikowana wersja 1.0.0 (kod commitu fa1045a). Inny plik jest odrzucany przed uruchomieniem Chromium. */
export const PUBLIC_PACKAGE = Object.freeze({
  file: 'Apex-AdBlocker-WebStore-1.0.0.zip',
  version: '1.0.0',
  sha256: 'f58affb6dc6f3bbaa866ac5a81cf923ba106eb92e029b66da9b3980358589588',
  sourceCommit: 'fa1045a',
});
export const LOCALES = Object.freeze(['pl', 'en']);
export const SCENES = Object.freeze(['01-protection', '02-before-after', '03-hide-element', '04-site-toggle', '05-custom-filters']);
/** Mniejsze okno dla „Ukryj element”: zaznaczony blok i panel narzędzia mieszczą się w jednym kadrze. */
export const PICKER_VIEWPORT = Object.freeze({ width: 820, height: 600 });
export const fileName = (scene, locale) => `${scene}-${locale}.png`;

/** Teksty grafik: nagłówek [część ciemna, część w kolorze marki] i najwyżej jedno krótkie zdanie. */
export const TEXT = Object.freeze({
  pl: {
    '01-protection': { h: ['Blokuj reklamy', 'i śledzenie'], sub: 'Działa od razu po instalacji.' },
    '02-before-after': { h: ['Mniej reklam.', 'Więcej treści.'], before: 'Bez Apex AdBlocker', after: 'Z Apex AdBlocker' },
    '03-hide-element': { h: ['Ukryj to, czego', 'nie chcesz widzieć'], sub: 'Wskaż element i dodaj własny filtr.' },
    '04-site-toggle': { h: ['Ty decydujesz,', 'gdzie działa ochrona'], sub: 'Wyłącz ją dla wybranej strony jednym kliknięciem.' },
    '05-custom-filters': { h: ['Dostosuj ochronę', 'do siebie'], sub: 'Dodawaj własne filtry i zarządzaj ustawieniami.' },
  },
  en: {
    '01-protection': { h: ['Block ads', 'and tracking'], sub: 'Works right after installation.' },
    '02-before-after': { h: ['Fewer ads.', 'More content.'], before: 'Without Apex AdBlocker', after: 'With Apex AdBlocker' },
    '03-hide-element': { h: ['Hide what you', 'don’t want to see'], sub: 'Pick an element and create your own filter.' },
    '04-site-toggle': { h: ['You decide where', 'protection runs'], sub: 'Turn it off for a selected site with one click.' },
    '05-custom-filters': { h: ['Customize', 'your protection'], sub: 'Add custom filters and manage your settings.' },
  },
});

/** Kontrolowane dane testowe: element do ukrycia na stronie demo i przykładowe własne filtry. */
const SIGNUP = {
  pl: { title: 'Newsletter Daily News', text: 'Najważniejsze wiadomości prosto na Twoją skrzynkę.', button: 'Zapisz się' },
  en: { title: 'Daily News newsletter', text: 'The top stories delivered straight to your inbox.', button: 'Sign up' },
};
export const EXAMPLE_FILTERS = {
  pl: `! Moje filtry (przykład dla strony demonstracyjnej)\n${DEMO_HOST}##.dn-signup\n${DEMO_HOST}##.dn-most-read\n||tracker.example^\n`,
  en: `! My filters (example for the demo page)\n${DEMO_HOST}##.dn-signup\n${DEMO_HOST}##.dn-most-read\n||tracker.example^\n`,
};
/** Neutralne reklamy demonstracyjne: bez marek, kwot i obietnic; ładowane wyłącznie przez skrypty z sieci reklamowych. */
const AD_HOSTS = ['pagead2.googlesyndication.com', 'securepubads.g.doubleclick.net', 'www.googletagservices.com', 'static.criteo.net', 'www.google-analytics.com', 'connect.facebook.net', 'cdn.taboola.com'];
const adCreative = (w, h, c1, c2, label) => `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="56%" fill="#fff" font-family="Arial" font-weight="700" font-size="${Math.round(Math.min(h / 3.4, 34))}" text-anchor="middle">${label}</text><rect x="${w - 18}" y="2" width="16" height="14" fill="#fff" opacity=".9"/><text x="${w - 10}" y="13" font-size="10" font-family="Arial" text-anchor="middle" fill="#333">i</text></svg>`).toString('base64')}`;
const adsScript = (lang) => {
  const label = lang === 'pl' ? 'REKLAMA' : 'ADVERTISEMENT';
  const creatives = { top: adCreative(728, 90, '#ff6b6b', '#f59f00', label), side: adCreative(300, 250, '#7048e8', '#d6336c', label), mid: adCreative(728, 90, '#1c7ed6', '#15aabf', label) };
  return `(function(){var B=${JSON.stringify(creatives)};document.querySelectorAll('ins.adsbygoogle').forEach(function(ins){if(ins.getAttribute('data-ad-status'))return;var i=new Image();i.src=B[ins.getAttribute('data-slot')||'top'];i.style.cssText='display:block;width:100%;height:100%;border-radius:4px';ins.appendChild(i);ins.setAttribute('data-ad-status','filled');});})();`;
};
const overlayScript = (lang) => `(function(){function go(){var d=document.createElement('div');d.className='sponsored-popup';d.style.cssText='position:fixed;right:24px;bottom:24px;width:300px;padding:18px;background:#212529;color:#fff;border-radius:12px;font:15px/1.4 Arial;box-shadow:0 10px 30px #0006;z-index:9';d.innerHTML=${JSON.stringify(lang === 'pl' ? '<b style="font-size:16px">Treść sponsorowana</b><br>Reklama wyświetlana nad artykułem.' : '<b style="font-size:16px">Sponsored content</b><br>An advertisement shown over the article.')};document.body.appendChild(d);}document.body?go():addEventListener('DOMContentLoaded',go);})();`;
const TRACK_JS = 'window.__tracked = (window.__tracked || 0) + 1;';

/** Strona demo z harness.mjs, z dwoma oznaczonymi klasami blokami bocznymi (cel narzędzia „Ukryj element”). */
export function demoHtml(lang) {
  const s = SIGNUP[lang];
  const signup = `<div class="dn-signup" style="background:#fff;border:1px solid #e5e2db;border-radius:10px;padding:16px 18px;margin-bottom:22px;font:15px/1.45 Arial">`
    + `<div style="font-weight:700;font-size:17px;margin-bottom:6px">✉ ${s.title}</div><div style="color:#555;margin-bottom:12px">${s.text}</div>`
    + `<span style="display:inline-block;background:#1d1d1f;color:#fff;border-radius:6px;padding:7px 14px;font-weight:700">${s.button}</span></div>`;
  const html = demoPage(lang)
    .replace('</ins><h3>', `</ins>${signup}<div class="dn-most-read"><h3>`)
    .replace('</ul></aside>', '</ul></div></aside>');
  if (!html.includes('class="dn-signup"') || !html.includes('class="dn-most-read"')) throw new Error('Strona demo ma nieoczekiwany układ.');
  return html;
}

export function parseArgs(args) {
  const options = { zip: '', outDir: path.join(ROOT, 'docs/webstore/cws-screenshots'), locales: [...LOCALES] };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help') return { help: true };
    const value = args[i + 1];
    if (!value || value.startsWith('--')) throw new Error(`Niepoprawny argument: ${args[i]}`);
    if (args[i] === '--zip') options.zip = path.resolve(value);
    else if (args[i] === '--out') options.outDir = path.resolve(value);
    else if (args[i] === '--locale') {
      if (![...LOCALES, 'all'].includes(value)) throw new Error('Locale must be pl, en or all');
      options.locales = value === 'all' ? [...LOCALES] : [value];
    } else throw new Error(`Niepoprawny argument: ${args[i]}`);
    i++;
  }
  return options;
}

export const sha256File = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

/** ZIP musi być bajtowo opublikowaną paczką; po rozpakowaniu lista plików musi odpowiadać archiwum. */
export function extractPublicPackage(zip, dir, expected = PUBLIC_PACKAGE) {
  if (!zip || !fs.existsSync(zip) || !fs.statSync(zip).isFile()) throw new Error(`Brak paczki ZIP: ${zip || '(nie podano --zip)'}`);
  const zipSha256 = sha256File(zip);
  if (zipSha256 !== expected.sha256) throw new Error(`To nie jest opublikowana paczka ${expected.version}: SHA-256 ${zipSha256} ≠ ${expected.sha256}`);
  const listed = execFileSync('unzip', ['-Z1', zip], { encoding: 'utf8' }).split('\n').filter((f) => f && !f.endsWith('/'));
  if (listed.some((f) => f.startsWith('/') || f.split('/').includes('..'))) throw new Error('Paczka zawiera niebezpieczne ścieżki.');
  fs.mkdirSync(dir, { recursive: true });
  execFileSync('unzip', ['-q', zip, '-d', dir]);
  const files = listFiles(dir);
  if (JSON.stringify([...files].sort()) !== JSON.stringify([...listed].sort())) throw new Error('Rozpakowane pliki nie odpowiadają zawartości ZIP-a.');
  const problems = validatePackage(dir);
  if (problems.length) throw new Error(`Niepoprawna paczka: ${problems.join('; ')}`);
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  if (manifest.version !== expected.version) throw new Error(`Paczka ma wersję ${manifest.version}, oczekiwano ${expected.version}.`);
  return { zipSha256, manifest, files: files.length };
}

function outputIsOwned(outDir) {
  if (!fs.existsSync(outDir)) return;
  if (!fs.lstatSync(outDir).isDirectory()) throw new Error(`Odmowa zastąpienia ścieżki: ${outDir}`);
  let previous;
  try { previous = JSON.parse(fs.readFileSync(path.join(outDir, 'metadata.json'), 'utf8')); } catch { /* unowned output */ }
  if (previous?.generator !== GENERATOR) throw new Error(`Katalog zawiera własne pliki użytkownika: ${outDir}. Wybierz nowy --out.`);
  const owned = new Set(['metadata.json', 'README.md', ...LOCALES, ...(previous.images || []).map((image) => image.file)]);
  for (const rel of listFiles(outDir)) {
    if (!owned.has(rel)) throw new Error(`Katalog zawiera plik spoza poprzednich wyników generatora: ${rel}. Wybierz nowy --out.`);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Minimalny klient CDP (sesje „flatten”): Playwright nie udostępnia okienka akcji rozszerzenia jako strony. */
async function connectCdp(profileDir) {
  let port = '';
  let wsPath = '';
  for (let i = 0; i < 100 && !port; i++) {
    try { [port, wsPath] = fs.readFileSync(path.join(profileDir, 'DevToolsActivePort'), 'utf8').split('\n'); } catch { await sleep(100); }
  }
  if (!port) throw new Error('Chromium nie udostępnił portu DevTools.');
  const ws = new WebSocket(`ws://127.0.0.1:${port}${wsPath}`);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  let next = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (!msg.id || !pending.has(msg.id)) return;
    const { resolve, reject, method } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(`${method}: ${msg.error.message}`)); else resolve(msg.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++next;
    pending.set(id, { resolve, reject, method });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  return { send, close: () => ws.close() };
}

/** Zrzuty w gęstości 2× (także okienko akcji, którego Playwright nie emuluje), kompozycja w 1280×800. */
export const CAPTURE_SCALE = 2;
function launchOptions(profileLocale, extDir, display) {
  return {
    // Okno z ekranem (Xvfb): bez niego Chromium headless źle wymiaruje okienko akcji przy gęstości 2×.
    headless: false, channel: 'chromium', viewport: VIEWPORT, deviceScaleFactor: CAPTURE_SCALE, colorScheme: 'light',
    locale: profileLocale === 'pl' ? 'pl-PL' : 'en-US',
    env: { ...process.env, DISPLAY: display, LANGUAGE: profileLocale, LANG: profileLocale === 'pl' ? 'pl_PL.UTF-8' : 'en_US.UTF-8' },
    args: [
      `--lang=${profileLocale}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--disable-component-update',
      '--disable-background-networking', '--disable-sync', '--disable-default-apps', '--remote-debugging-port=0', `--force-device-scale-factor=${CAPTURE_SCALE}`,
      ...(extDir ? [`--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`] : ['--disable-extensions']),
    ],
  };
}

/** Odpowiada tylko lokalnie: strona demo i skrypty sieci reklamowych; pozostałe żądania są przerywane. */
async function routeDemo(context, lang) {
  await context.route(/^(?:https?|wss?):/, (route) => {
    const url = new URL(route.request().url());
    if (url.protocol !== 'http:') return route.abort();
    if (url.hostname === DEMO_HOST) return url.pathname === '/' ? route.fulfill({ contentType: 'text/html; charset=utf-8', body: demoHtml(lang) }) : route.abort();
    if (!AD_HOSTS.includes(url.hostname)) return route.abort();
    const body = url.pathname.includes('adsbygoogle') ? adsScript(lang) : url.pathname.includes('loader.js') ? overlayScript(lang) : TRACK_JS;
    return route.fulfill({ contentType: 'text/javascript', body });
  });
}

async function shot(cdpSession, clip) {
  const { data } = await cdpSession.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, ...(clip ? { clip: { ...clip, scale: 1 } } : {}) });
  return Buffer.from(data, 'base64');
}

/** Stan strony demo widoczny dla użytkownika: wypełnione reklamy, nakładka, skrypty śledzące. */
const pageState = (page) => page.evaluate(() => ({
  adsVisible: [...document.querySelectorAll('ins.adsbygoogle')].filter((e) => e.offsetHeight > 0 && e.querySelector('img')).length,
  sponsoredOverlay: !!document.querySelector('.sponsored-popup'),
  trackers: window.__tracked || 0,
}));

/** Strona demo bez rozszerzenia – stan „przed”. */
async function captureBefore(chromium, work, lang, display) {
  const profile = path.join(work, `profile-before-${lang}`);
  const context = await chromium.launchPersistentContext(profile, launchOptions(lang, null, display));
  try {
    await routeDemo(context, lang);
    const page = await context.newPage();
    await page.goto(`http://${DEMO_HOST}/`);
    await page.waitForFunction(() => [...document.querySelectorAll('ins.adsbygoogle')].every((ins) => ins.querySelector('img')?.complete) && document.querySelector('.sponsored-popup'));
    await page.evaluate(async () => { await document.fonts.ready; });
    await sleep(300);
    const session = await context.newCDPSession(page);
    return { image: await shot(session), state: await pageState(page) };
  } finally { await context.close(); }
}

/** Rzeczywiste rozszerzenie z paczki: okienko akcji, „Ukryj element”, wyłączenie na stronie, Moje filtry. */
async function captureExtension(chromium, work, extDir, lang, syncTimeoutMs, display) {
  const profile = path.join(work, `profile-${lang}`);
  const context = await chromium.launchPersistentContext(profile, launchOptions(lang, extDir, display));
  let cdp;
  try {
    await routeDemo(context, lang);
    let worker = context.serviceWorkers().find((w) => w.url().endsWith('/background.js'));
    if (!worker) worker = await context.waitForEvent('serviceworker', { predicate: (w) => w.url().endsWith('/background.js'), timeout: 30_000 });
    const id = new URL(worker.url()).host;
    const options = await context.newPage();
    await options.goto('chrome://extensions');
    const loaded = await options.evaluate(async (extensionId) => {
      const e = (await chrome.developerPrivate.getExtensionsInfo()).find((item) => item.id === extensionId);
      return e && { state: e.state, version: e.version, errors: [...(e.manifestErrors || []), ...(e.runtimeErrors || [])].map((x) => x.message) };
    }, id);
    if (!loaded || loaded.state !== 'ENABLED' || loaded.errors.length) throw new Error('Chromium nie zaakceptował rozszerzenia bez błędów.');
    await options.goto(`chrome-extension://${id}/options/options.html`);
    if (await options.evaluate(() => document.documentElement.lang) !== lang) throw new Error(`Chrome nie wybrał języka interfejsu: ${lang}`);
    await options.waitForFunction(() => document.querySelectorAll('#listContainer .card').length === chrome.runtime.getManifest().declarative_net_request.rule_resources.length);
    const deadline = Date.now() + syncTimeoutMs;
    for (;;) {
      const health = await options.evaluate(() => chrome.runtime.sendMessage({ type: 'health:get' })).catch(() => null);
      const failed = health && [...SYNC_STEPS.filter((s) => health.sync?.[s]?.status === 'error'), ...COMPONENTS.filter((c) => health.components?.[c]?.status === 'error')];
      if (failed?.length) throw new Error(`Rozszerzenie zgłosiło błąd: ${failed.join(', ')}`);
      if (health && SYNC_STEPS.every((s) => health.sync?.[s]?.status === 'ok')) break;
      if (Date.now() > deadline) throw new Error('Synchronizacja rozszerzenia nie zakończyła się.');
      await sleep(500);
    }

    cdp = await connectCdp(profile);
    const demo = await context.newPage();
    const demoSession = await context.newCDPSession(demo);
    // Żądania strony demo zatrzymane przez reguły (ERR_BLOCKED_BY_CLIENT) albo podmienione na zasób rozszerzenia,
    // liczone od ostatniego wczytania dokumentu – do porównania z licznikiem w okienku.
    let blockedOnPage = new Set();
    demo.on('framenavigated', (frame) => { if (frame === demo.mainFrame()) blockedOnPage = new Set(); });
    demo.on('requestfailed', (request) => { if (/BLOCKED_BY_CLIENT/.test(request.failure()?.errorText || '')) blockedOnPage.add(request); });
    demo.on('request', (request) => { if (request.url().startsWith('chrome-extension://') && request.redirectedFrom()) blockedOnPage.add(request.redirectedFrom()); });
    const loadDemo = async () => {
      await demo.goto(`http://${DEMO_HOST}/`);
      await demo.waitForLoadState('load');
      await demo.evaluate(async () => { await document.fonts.ready; });
      await sleep(2500);
    };
    await loadDemo();
    await demo.bringToFront();
    const after = { image: await shot(demoSession), state: { ...await pageState(demo), blockedRequests: blockedOnPage.size } };
    const demoTab = async () => {
      const { targetInfos } = await cdp.send('Target.getTargets', { filter: [{ type: 'tab' }] });
      const tab = targetInfos.find((t) => t.url.startsWith(`http://${DEMO_HOST}/`));
      if (!tab) throw new Error('Brak karty strony demo.');
      return tab.targetId;
    };
    // Okienko otwierane akcją rozszerzenia na karcie demo – ten sam mechanizm co kliknięcie ikony (activeTab).
    const openPopup = async () => {
      await demo.bringToFront();
      await cdp.send('Extensions.triggerAction', { id, targetId: await demoTab() });
      let target;
      for (let i = 0; i < 50 && !target; i++) {
        await sleep(100);
        target = (await cdp.send('Target.getTargets')).targetInfos.find((t) => t.url === `chrome-extension://${id}/popup/popup.html`);
      }
      if (!target) throw new Error('Okienko rozszerzenia się nie otworzyło.');
      const { sessionId } = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
      const session = { send: (method, params) => cdp.send(method, params, sessionId) };
      const evaluate = async (expression) => {
        const r = await session.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        if (r.exceptionDetails) throw new Error(`Okienko: ${r.exceptionDetails.text}`);
        return r.result.value;
      };
      const readState = () => evaluate(`({ lang: document.documentElement.lang, busy: document.getElementById('main').getAttribute('aria-busy'),
        site: document.getElementById('site').dataset.state, host: document.getElementById('host').textContent.trim(),
        status: document.getElementById('status').textContent.trim(), blocked: document.getElementById('blocked').textContent.trim(),
        blockedLabel: document.getElementById('blockedLabel').textContent.trim(), toggle: document.getElementById('toggle').getAttribute('aria-checked'),
        message: document.getElementById('operationMessage').hidden ? '' : document.getElementById('operationMessage').textContent.trim(),
        width: innerWidth, height: innerHeight, contentHeight: Math.ceil(document.documentElement.getBoundingClientRect().height) })`);
      let state;
      for (let i = 0; i < 60; i++) {
        state = await readState();
        if (state.busy === 'false' && state.site !== 'loading' && /^\d+$/.test(state.blocked)) break;
        await sleep(100);
      }
      for (let i = 0; i < 40; i++) {
        const { width, height } = await shot(session).then((b) => ({ width: b.readUInt32BE(16), height: b.readUInt32BE(20) }));
        if (width === state.width * CAPTURE_SCALE && height === state.height * CAPTURE_SCALE) break;
        await sleep(250);
        state = await readState();
      }
      if (state.lang !== lang) throw new Error(`Okienko nie jest w języku ${lang}.`);
      if (state.host !== DEMO_HOST || state.message) throw new Error(`Okienko nie pokazuje karty demo: ${JSON.stringify(state)}`);
      await evaluate('document.fonts.ready.then(() => true)');
      const click = async (selector) => {
        const box = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
        for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
          await session.send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: 1 });
        }
      };
      return {
        state, readState, click,
        capture: async () => {
          // okno akcji przyjmuje rozmiar treści z opóźnieniem: zrzut dopiero przy stabilnym rozmiarze 2× treści
          for (let i = 0; i < 40; i++) {
            await sleep(250);
            const s = await readState();
            const image = await shot(session);
            if (image.readUInt32BE(16) === s.width * CAPTURE_SCALE && image.readUInt32BE(20) === s.height * CAPTURE_SCALE) return { image, state: s };
          }
          throw new Error('Okienko nie ustaliło rozmiaru (oczekiwano zrzutu 2× treści).');
        },
        close: () => cdp.send('Target.closeTarget', { targetId: target.targetId }).catch(() => {}),
      };
    };

    // 1. Ochrona aktywna: rzeczywisty licznik zablokowanych żądań karty demo.
    let popup = await openPopup();
    const popupOn = await popup.capture();
    if (popupOn.state.toggle !== 'true') throw new Error('Ochrona nie jest aktywna na stronie demo.');
    if (Number(popupOn.state.blocked) !== blockedOnPage.size || !blockedOnPage.size) throw new Error(`Licznik w okienku (${popupOn.state.blocked}) ≠ zablokowane żądania strony demo (${blockedOnPage.size}).`);

    // 3. „Ukryj element”: przycisk w okienku, potem prawdziwe zdarzenia myszy na stronie demo; bez zapisu.
    await popup.click('#picker');
    await demo.bringToFront();
    await demo.waitForSelector('apex-picker', { state: 'attached', timeout: 10_000 });
    await demo.setViewportSize(PICKER_VIEWPORT);
    await sleep(400);
    const target = await demo.locator('.dn-signup').boundingBox();
    if (!target) throw new Error('Brak elementu do ukrycia na stronie demo.');
    // punkt w wewnętrznym marginesie ramki: wybrany zostaje cały blok newslettera
    const point = { x: target.x + 8, y: target.y + target.height / 2 };
    await demo.mouse.move(point.x, point.y);
    await sleep(150);
    await demo.mouse.click(point.x, point.y);
    await sleep(600);
    const picker = { image: await shot(demoSession, { x: 0, y: 0, ...PICKER_VIEWPORT }) };
    await demo.keyboard.press('Escape');
    await demo.waitForSelector('apex-picker', { state: 'detached', timeout: 10_000 });
    await demo.setViewportSize(VIEWPORT);
    const afterPicker = await options.evaluate(() => chrome.runtime.sendMessage({ type: 'options:get' }));
    if (afterPicker.userFilters?.trim()) throw new Error('Narzędzie „Ukryj element” zapisało filtr mimo anulowania.');

    // 4. Wyłączenie ochrony na stronie przełącznikiem w okienku (karta przeładowuje się sama).
    popup = await openPopup();
    await popup.click('#toggle');
    for (let i = 0; i < 60; i++) { const s = await popup.readState(); if (s.toggle === 'false' && s.busy === 'false') break; await sleep(100); }
    await popup.close();
    await demo.waitForLoadState('load');
    await sleep(2500);
    const offPage = { image: await shot(demoSession), state: { ...await pageState(demo), blockedRequests: blockedOnPage.size } };
    popup = await openPopup();
    const popupOff = await popup.capture();
    if (popupOff.state.toggle !== 'false') throw new Error('Ochrona nie została wyłączona na stronie demo.');
    if (Number(popupOff.state.blocked) !== blockedOnPage.size) throw new Error(`Licznik po wyłączeniu (${popupOff.state.blocked}) ≠ zablokowane żądania (${blockedOnPage.size}).`);
    await popup.close();

    // 5. Moje filtry: przykładowe filtry zapisane przez interfejs ustawień.
    await options.bringToFront();
    await options.goto(`chrome-extension://${id}/options/options.html`);
    await options.locator('[role="tab"][data-tab="filters"]').click();
    await options.locator('#userFilters:not([disabled])').fill(EXAMPLE_FILTERS[lang]);
    await options.locator('#saveFilters').click();
    await options.waitForFunction(() => document.getElementById('filtersMsg').textContent.trim().length > 0);
    const saved = await options.evaluate(() => chrome.runtime.sendMessage({ type: 'options:get' }));
    if (saved.userFilters !== EXAMPLE_FILTERS[lang] || saved.userErrors?.length) throw new Error('Przykładowe filtry nie zostały poprawnie zapisane.');
    await options.evaluate(async () => { window.scrollTo(0, 0); await document.fonts.ready; });
    const optionsSession = await context.newCDPSession(options);
    const filters = { image: await shot(optionsSession), message: await options.locator('#filtersMsg').textContent() };
    return { id, version: loaded.version, after, popupOn, picker, offPage, popupOff, filters };
  } finally {
    cdp?.close();
    await context.close();
  }
}

export async function generateCwsScreenshots({ zip, outDir = path.join(ROOT, 'docs/webstore/cws-screenshots'), locales = [...LOCALES], browserType, syncTimeoutMs = 180_000 } = {}) {
  outDir = path.resolve(outDir);
  outputIsOwned(outDir);
  const chromium = browserType === undefined ? await loadPlaywright() : browserType;
  let executable = '';
  try { executable = chromium?.executablePath() || ''; } catch { /* reported below */ }
  if (!chromium || !executable || !fs.existsSync(executable)) {
    const error = new Error('Brak przeglądarki Playwright. Nie utworzono zastępczych obrazów.');
    error.code = 'BROWSER_UNAVAILABLE';
    throw error;
  }
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-cws-shots-'));
  let screen;
  try {
    screen = await ensureDisplay();
    const source = path.join(work, 'package');
    const pkg = extractPublicPackage(zip, source);
    const sourceBefore = snapshotTree(source);
    const staged = path.join(work, 'next');
    const images = [];
    const captures = {};
    for (const lang of locales) {
      // Chrome zapisuje zindeksowane rulesety w katalogu rozszerzenia rozpakowanego – osobna kopia na język.
      const extDir = path.join(work, `extension-${lang}`);
      fs.cpSync(source, extDir, { recursive: true });
      const copyBefore = snapshotTree(extDir);
      const mismatch = compareSnapshots(sourceBefore, copyBefore).problems;
      if (mismatch.length) throw new Error(`Kopia paczki różni się od źródła: ${mismatch.slice(0, 5).join('; ')}`);
      const before = await captureBefore(chromium, work, lang, screen.display);
      const ext = await captureExtension(chromium, work, extDir, lang, syncTimeoutMs, screen.display);
      const integrity = compareRuntimeSnapshot(copyBefore, snapshotTree(extDir), pkg.manifest);
      if (integrity.problems.length) throw new Error(`Kontrola integralności paczki nie przeszła: ${integrity.problems.slice(0, 10).join('; ')}`);
      captures[lang] = { before, ...ext, integrity };
    }
    const asset = (file) => fs.readFileSync(path.join(source, file));
    const assets = { logo: `data:image/svg+xml;base64,${asset('icons/logo.svg').toString('base64')}`, icon: png(asset('icons/icon32.png')) };
    if (process.env.APEX_CWS_RAW) dumpRaw(process.env.APEX_CWS_RAW, captures, assets);
    const composed = await composeScenes(chromium, captures, assets);
    for (const lang of locales) {
      fs.mkdirSync(path.join(staged, lang), { recursive: true });
      for (const scene of SCENES) {
        const file = `${lang}/${fileName(scene, lang)}`;
        const bytes = composed[lang][scene];
        if (bytes.readUInt32BE(16) !== VIEWPORT.width || bytes.readUInt32BE(20) !== VIEWPORT.height) throw new Error(`Niepoprawny rozmiar PNG: ${file}`);
        fs.writeFileSync(path.join(staged, file), bytes);
        images.push({ file, locale: lang, scene, headline: TEXT[lang][scene].h.join(' '), width: VIEWPORT.width, height: VIEWPORT.height, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
      }
    }
    const sourceChanges = compareSnapshots(sourceBefore, snapshotTree(source)).problems;
    if (sourceChanges.length) throw new Error(`Rozpakowana paczka zmieniła się podczas zrzutów: ${sourceChanges.slice(0, 5).join('; ')}`);
    if (sha256File(zip) !== PUBLIC_PACKAGE.sha256) throw new Error('Plik ZIP zmienił się podczas zrzutów.');
    const metadata = {
      generator: GENERATOR, generatedAt: new Date().toISOString(), product: pkg.manifest.name, extensionVersion: pkg.manifest.version,
      package: { file: PUBLIC_PACKAGE.file, sha256: pkg.zipSha256, sourceCommit: PUBLIC_PACKAGE.sourceCommit, files: pkg.files },
      provenance: 'published-package-zip-in-temporary-profile', mockedChromeApi: false, externalSitesVisited: false,
      demo: { host: DEMO_HOST, served: 'locally by Playwright routing; neutral ad creatives without brands, prices or claims' },
      viewport: VIEWPORT, colorScheme: 'light',
      observed: Object.fromEntries(locales.map((lang) => {
        const c = captures[lang];
        const pick = ({ status, blocked, blockedLabel, toggle, host }) => ({ host, status, blocked, blockedLabel, toggle });
        return [lang, { before: c.before.state, after: c.after.state, protectionOffPage: c.offPage.state, popupOn: pick(c.popupOn.state), popupOff: pick(c.popupOff.state), filtersSaved: c.filters.message.trim() }];
      })),
      exampleUserFilters: Object.fromEntries(locales.map((lang) => [lang, EXAMPLE_FILTERS[lang]])),
      integrity: { status: 'PASS', checked: 'ZIP SHA-256 before and after; extracted files = ZIP listing; byte-for-byte snapshot of each loaded copy before and after Chromium', allowedRuntimeArtifacts: [...new Set(locales.flatMap((lang) => captures[lang].integrity.artifacts))] },
      images,
      scope: 'Real extension UI on a local demo page. The images do not measure blocking effectiveness on real websites.',
    };
    fs.writeFileSync(path.join(staged, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n');
    const backup = path.join(work, 'previous');
    fs.mkdirSync(path.dirname(outDir), { recursive: true });
    if (fs.existsSync(outDir)) fs.renameSync(outDir, backup);
    try { fs.renameSync(staged, outDir); } catch (error) {
      if (fs.existsSync(backup)) fs.renameSync(backup, outDir);
      throw error;
    }
    if (fs.existsSync(path.join(backup, 'README.md'))) fs.copyFileSync(path.join(backup, 'README.md'), path.join(outDir, 'README.md'));
    return { outDir, ...metadata };
  } finally {
    screen?.stop();
    fs.rmSync(work, { recursive: true, force: true });
  }
}

/** Ekran X dla okien Chromium: istniejący DISPLAY albo tymczasowy Xvfb uruchomiony tylko na czas generatora. */
async function ensureDisplay() {
  if (process.env.DISPLAY) return { display: process.env.DISPLAY, stop: () => {} };
  let xvfb = '';
  try { xvfb = execFileSync('sh', ['-c', 'command -v Xvfb'], { encoding: 'utf8' }).trim(); } catch { /* reported below */ }
  if (!xvfb) {
    const error = new Error('Brak ekranu X (DISPLAY) i programu Xvfb. Nie utworzono zastępczych obrazów.');
    error.code = 'BROWSER_UNAVAILABLE';
    throw error;
  }
  for (let n = 90; n < 110; n++) {
    if (fs.existsSync(`/tmp/.X11-unix/X${n}`) || fs.existsSync(`/tmp/.X${n}-lock`)) continue;
    const child = spawn(xvfb, [`:${n}`, '-screen', '0', '1920x1200x24', '-nolisten', 'tcp'], { stdio: 'ignore' });
    for (let i = 0; i < 50 && !fs.existsSync(`/tmp/.X11-unix/X${n}`) && child.exitCode === null; i++) await sleep(100);
    if (fs.existsSync(`/tmp/.X11-unix/X${n}`)) return { display: `:${n}`, stop: () => child.kill() };
    child.kill();
  }
  throw new Error('Nie udało się uruchomić Xvfb.');
}

// ── kompozycja ──────────────────────────────────────────────────────────────────────────────────────
const INK = '#0d2b2e';
const BRAND = '#0f7f8c';
const CSS = `
*{box-sizing:border-box}html,body{margin:0}
body{width:1280px;height:800px;overflow:hidden;position:relative;font-family:Inter,"Segoe UI",system-ui,sans-serif;color:${INK};
background:radial-gradient(1100px 680px at 100% 0%,#d4f1ec 0%,rgba(212,241,236,0) 62%),linear-gradient(160deg,#f3faf9 0%,#ffffff 55%,#edf7f6 100%)}
.brand{position:absolute;left:72px;top:52px;display:flex;align-items:center;gap:12px;font-weight:700;font-size:22px;color:${BRAND};letter-spacing:-.2px}
.brand img{width:36px;height:36px}
.text{position:absolute}
h1{margin:0;font-size:54px;line-height:1.08;letter-spacing:-1.5px;font-weight:800}
h1 span{color:${BRAND}}
.sub{margin:22px 0 0;font-size:24px;line-height:1.4;color:#36575a;font-weight:500}
.frame{position:absolute;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 28px 64px rgba(13,43,46,.20),0 2px 6px rgba(13,43,46,.08)}
.bar{height:40px;background:#eef1f3;display:flex;align-items:center;gap:8px;padding:0 14px;border-bottom:1px solid #dde3e6}
.nav{width:16px;height:16px;flex:none;color:#7a878a}
.url{margin-left:12px;flex:1;height:26px;border-radius:13px;background:#fff;font-size:14px;color:#56676a;display:flex;align-items:center;padding:0 14px}
.ext{width:26px;height:26px;margin-left:6px;border-radius:7px;display:flex;align-items:center;justify-content:center}.ext.on{background:#d3eeea}
.ext img{width:18px;height:18px}
.crop{overflow:hidden;position:relative}.crop img{display:block;position:absolute;left:0;top:0}
.ui{position:absolute;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 30px 70px rgba(13,43,46,.30),0 0 0 1px rgba(13,43,46,.08)}
.ui img{display:block;width:100%}
.pill{position:absolute;font-weight:700;font-size:20px;padding:8px 18px;border-radius:24px}
.pill.bad{background:#ffe3e3;color:#b42318}.pill.good{background:#d3f4ee;color:#0b6b5f}
.veil{position:absolute;inset:40px 0 0 0;background:rgba(255,255,255,.45)}
.fade{position:absolute;left:0;top:40px;bottom:0;width:40px;background:linear-gradient(90deg,#f6f5f2,rgba(246,245,242,0))}
`;
const NAV = ['M10 3 5 8l5 5', 'M6 3l5 5-5 5', 'M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.4h-2.4']
  .map((d) => `<svg class="nav" viewBox="0 0 16 16"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`).join('');
const png = (buffer) => `data:image/png;base64,${buffer.toString('base64')}`;
const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Fragment zrzutu: region { sx, sy, sw, sh } w pikselach CSS strony o szerokości pageWidth, pokazany w szerokości w. */
function crop(src, pageWidth, { sx, sy, sw, sh }, w) {
  const k = w / sw;
  return `<div class="crop" style="width:${w}px;height:${Math.round(sh * k)}px"><img src="${src}" style="width:${pageWidth * k}px;left:${-sx * k}px;top:${-sy * k}px"></div>`;
}
const frame = ({ x, y, w, url, icon, on = true, body, veil = false, fade = false }) => `<div class="frame" style="left:${x}px;top:${y}px;width:${w}px">
<div class="bar">${NAV}<div class="url">${esc(url)}</div><div class="ext ${on ? 'on' : ''}"><img src="${icon}"></div></div>${body}${veil ? '<div class="veil"></div>' : ''}${fade ? '<div class="fade"></div>' : ''}</div>`;
const headline = (t, style, align = 'left') => `<div class="text" style="${style};text-align:${align}"><h1>${esc(t.h[0])}${t.h[0].endsWith('.') ? ' ' : '<br>'}<span>${esc(t.h[1])}</span></h1>${t.sub ? `<p class="sub">${esc(t.sub)}</p>` : ''}</div>`;
const popupBox = (src, { x, y, scale }) => `<div class="ui" style="left:${x}px;top:${y}px;width:${340 * scale}px"><img src="${src}"></div>`;

/** Pięć różnych układów; każdy z jednym głównym elementem rzeczywistego interfejsu. */
export function sceneHtml(scene, lang, c, assets) {
  const t = TEXT[lang][scene];
  const brand = `<div class="brand"><img src="${assets.logo}">Apex AdBlocker</div>`;
  const page = (body) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${brand}${body}</body></html>`;
  const url = `${DEMO_HOST}`;
  switch (scene) {
    case '01-protection': // tekst po lewej; duże okienko nad przygaszoną stroną demo
      return page(`${headline(t, 'left:72px;top:268px;width:460px')}
        ${frame({ x: 548, y: 120, w: 680, url, icon: assets.icon, veil: true, body: crop(png(c.after.image), 1280, { sx: 80, sy: 0, sw: 1120, sh: 800 }, 680) })}
        ${popupBox(png(c.popupOn.image), { x: 614, y: 166, scale: 1.75 })}`);
    case '02-before-after': // nagłówek w jednej linii; dwie te same strony obok siebie
      return page(`${headline(t, 'left:72px;top:122px;width:1140px')}
        <div class="pill bad" style="left:64px;top:228px">${esc(t.before)}</div><div class="pill good" style="left:660px;top:228px">${esc(t.after)}</div>
        ${frame({ x: 64, y: 282, w: 556, url, icon: assets.icon, on: false, body: crop(png(c.before.image), 1280, { sx: 70, sy: 0, sw: 1140, sh: 800 }, 556) })}
        ${frame({ x: 660, y: 282, w: 556, url, icon: assets.icon, body: crop(png(c.after.image), 1280, { sx: 70, sy: 0, sw: 1140, sh: 800 }, 556) })}`);
    case '03-hide-element': // przybliżona strona z narzędziem po lewej; tekst po prawej
      return page(`${frame({ x: 64, y: 112, w: 620, url, icon: assets.icon, fade: true, body: crop(png(c.picker.image), PICKER_VIEWPORT.width, { sx: 296, sy: 48, sw: 524, sh: 538 }, 620) })}
        ${headline(t, 'left:740px;top:290px;width:490px')}`);
    case '04-site-toggle': // nagłówek wyśrodkowany; okienko z wyłączoną ochroną pośrodku
      return page(`${headline(t, 'left:0;top:122px;width:1280px', 'center')}
        ${popupBox(png(c.popupOff.image), { x: 640 - 170 * 1.6, y: 318, scale: 1.6 })}`);
    case '05-custom-filters': // tekst w lewym górnym rogu; fragment ustawień wychodzący poza kadr
      return page(`${headline(t, 'left:72px;top:250px;width:470px')}
        <div class="ui" style="left:572px;top:196px;width:760px;border-radius:16px">${crop(png(c.filters.image), 1280, { sx: 256, sy: 18, sw: 600, sh: 490 }, 760)}</div>`);
    default: throw new Error(`Nieznana scena: ${scene}`);
  }
}

/** Renderuje kompozycje w Chromium (1280×800, gęstość 1) i zwraca PNG dla każdej sceny i języka. */
export async function composeScenes(chromium, captures, assets) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 });
    await page.route(/^(?:https?|wss?):/, (route) => route.abort());
    const out = {};
    for (const [lang, c] of Object.entries(captures)) {
      out[lang] = {};
      for (const scene of SCENES) {
        const html = sceneHtml(scene, lang, c, assets);
        if (/\b(?:src|href)="(?!data:)/.test(html)) throw new Error('Kompozycja może używać tylko osadzonych obrazów.');
        await page.setContent(html, { waitUntil: 'load' });
        await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => i.decode())); });
        const overflow = await page.evaluate(() => [...document.querySelectorAll('.text')].some((e) => e.scrollWidth > e.clientWidth + 1));
        if (overflow) throw new Error(`Nagłówek nie mieści się w kadrze: ${scene}-${lang}`);
        out[lang][scene] = await page.screenshot({ type: 'png', fullPage: false });
      }
    }
    return out;
  } finally { await browser.close(); }
}

/** Tylko do przeglądu: surowe przechwycenia przed kompozycją (APEX_CWS_RAW=katalog). */
function dumpRaw(dir, captures, assets) {
  fs.mkdirSync(dir, { recursive: true });
  for (const [lang, c] of Object.entries(captures)) for (const k of ['before', 'after', 'popupOn', 'picker', 'offPage', 'popupOff', 'filters']) fs.writeFileSync(path.join(dir, `${k}-${lang}.png`), c[k].image);
  fs.writeFileSync(path.join(dir, 'assets.json'), JSON.stringify(assets));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log('node store/cws-screenshots.mjs --zip Apex-AdBlocker-WebStore-1.0.0.zip [--out katalog] [--locale pl|en|all]\nTworzy 5 zrzutów PL i 5 EN (1280×800) z opublikowanej paczki o przypiętym SHA-256. Bez makiet i zastępczych obrazów.');
    return;
  }
  const result = await generateCwsScreenshots(options);
  console.log(`Zapisano ${result.images.length} zrzutów: ${result.outDir}`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { await main(); } catch (error) { console.error(error.message); process.exitCode = error.code === 'BROWSER_UNAVAILABLE' ? 2 : 1; }
}
