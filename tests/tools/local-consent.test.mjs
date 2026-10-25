// Lokalny tester – okno zgody YouTube bezpośrednio na youtube.com („Zanim przejdziesz do YouTube”).
// Test w prawdziwym Chromium (Playwright) na stronie-atrapie pod https://www.youtube.com/ – bez sieci,
// bez rozszerzenia, bez treści YouTube. Brak Playwright/Chromium → SKIP.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadPlaywright } from '../../tools/chromium-smoke.mjs';
import {
  openYouTube, dismissConsentModal, findConsentModal, CONSENT_HEADING_RE, CONSENT_REJECT_RE,
} from '../local/chromeblock-local-test.mjs';
import { ensurePlaying, samplePlayer } from '../e2e/lib/youtube-page.mjs';
import { progressOf } from '../e2e/lib/classify.mjs';

const WATCH = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';

/**
 * Atrapa strony watch z oknem zgody.
 * o.delayMs   – okno pojawia się po chwili (jak na prawdziwym YouTube)
 * o.broken    – przycisk nie zamyka okna
 * o.noModal   – bez okna
 * o.container – 'paper' (tp-yt-paper-dialog) | 'div' (zwykły div bez roli)
 */
function watchPage({ delayMs = 1200, broken = false, noModal = false, container = 'paper' } = {}) {
  const tag = container === 'paper' ? 'tp-yt-paper-dialog' : 'div';
  const filler = Array.from({ length: 30 }, (_, i) => `<p>Akapit informacji o plikach cookie nr ${i + 1}.</p>`).join('');
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>YouTube</title>
<style>#cm{position:fixed;inset:60px 25%;background:#fff;border:1px solid #888;display:flex;flex-direction:column}
#cm .scroll{overflow:auto;flex:1;padding:12px}</style></head><body>
<div id="movie_player" class="html5-video-player"><video class="html5-main-video" muted width="320" height="180"></video></div>
<canvas id="cv" width="64" height="36" hidden></canvas>
<script>
const v = document.querySelector('video');
const cv = document.getElementById('cv'); const g = cv.getContext('2d');
let f = 0; setInterval(() => { g.fillStyle = f++ % 2 ? '#123' : '#456'; g.fillRect(0, 0, 64, 36); }, 50);
v.srcObject = cv.captureStream(20);
let modalOpen = ${noModal ? 'false' : 'true'};
const realPlay = v.play.bind(v);
v.play = () => (modalOpen ? Promise.reject(new DOMException('zablokowane przez okno zgody', 'NotAllowedError')) : realPlay());
${noModal ? 'realPlay();' : `setTimeout(() => {
  const m = document.createElement('${tag}');
  m.id = 'cm';
  m.innerHTML = '<div class="scroll"><h2>Zanim przejdziesz do YouTube</h2>${filler}'
    + '<div><button id="acc" aria-label="Zaakceptuj wszystko">Zaakceptuj wszystko</button> '
    + '<button id="rej" aria-label="Odrzuć wszystko"><span>Odrzuć wszystko</span></button></div></div>';
  document.body.appendChild(m);
  const sc = m.querySelector('.scroll');
  window.__rejectInitiallyHidden = m.querySelector('#rej').getBoundingClientRect().top > sc.getBoundingClientRect().bottom;
  m.querySelector('#rej').addEventListener('click', () => {
    window.__rejectClicked = true;
    ${broken ? '' : 'm.remove(); modalOpen = false; realPlay();'}
  });
  m.querySelector('#acc').addEventListener('click', () => { window.__acceptClicked = true; });
}, ${delayMs});`}
</script></body></html>`;
}

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

let browser = null;
test.before(async () => { if (!skip) browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] }); });
test.after(async () => { if (browser) await browser.close(); });

async function pageWith(opts) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await context.route(/^https?:/, (r) => (new URL(r.request().url()).hostname === 'www.youtube.com'
    ? r.fulfill({ contentType: 'text/html; charset=utf-8', body: watchPage(opts) })
    : r.fulfill({ status: 204, body: '' })));
  return { context, page: await context.newPage() };
}

test('teksty okna zgody: nagłówek i „Odrzuć wszystko” (z odpowiednikami językowymi)', () => {
  for (const h of ['Zanim przejdziesz do YouTube', 'Before you continue to YouTube', 'Bevor Sie zu YouTube weitergehen', 'Avant d’accéder à YouTube', 'Antes de ir a YouTube']) assert.match(h, CONSENT_HEADING_RE, h);
  for (const b of ['Odrzuć wszystko', 'Reject all', 'Alle ablehnen', 'Tout refuser', 'Rechazar todo']) assert.match(b, CONSENT_REJECT_RE, b);
  for (const b of ['Zaakceptuj wszystko', 'Accept all', 'Więcej opcji']) assert.doesNotMatch(b, CONSENT_REJECT_RE, b);
});

test('REGRESJA: „Zanim przejdziesz do YouTube” na youtube.com → „Odrzuć wszystko” (niżej w przewijanym oknie) → okno znika → odtwarzanie startuje', { skip }, async () => {
  const { context, page } = await pageWith({ delayMs: 1200 });
  try {
    const reason = await openYouTube(page, WATCH, true);
    assert.equal(reason, null, `openYouTube: ${reason}`);
    assert.equal(await page.evaluate(() => window.__rejectInitiallyHidden), true, 'przycisk był poza widokiem przewijanego okna');
    assert.equal(await page.evaluate(() => window.__rejectClicked), true, 'kliknięto „Odrzuć wszystko”');
    assert.notEqual(await page.evaluate(() => window.__acceptClicked), true, 'nie kliknięto „Zaakceptuj wszystko”');
    assert.equal(await findConsentModal(page), null, 'okno zgody zniknęło przed testem odtwarzania');
    assert.equal(await page.locator('#cm').count(), 0);
    await ensurePlaying(page, 'player');
    const s = await samplePlayer(page, 'player', 4);
    assert.ok(progressOf(s) >= 1.5, `odtwarzanie po zamknięciu zgody: postęp ${progressOf(s)} s`);
  } finally { await context.close(); }
});

test('PRZYCZYNA: stare jednorazowe sprawdzenie zaraz po wczytaniu nie widzi okna, które pojawia się później', { skip }, async () => {
  const { context, page } = await pageWith({ delayMs: 1200 });
  try {
    await page.goto(WATCH, { waitUntil: 'domcontentloaded' });
    // dawna logika: jeden odczyt ytd-consent-bump-v2-lightbox tuż po domcontentloaded
    assert.equal(await page.locator('ytd-consent-bump-v2-lightbox button').count(), 0);
    await page.waitForTimeout(1500);
    assert.ok(await findConsentModal(page), 'okno zgody pojawiło się później i zostałoby otwarte');
  } finally { await context.close(); }
});

test('okno zgody jako zwykły div (bez roli dialog) – rozpoznane po nagłówku i zamknięte', { skip }, async () => {
  const { context, page } = await pageWith({ container: 'div', delayMs: 600 });
  try {
    assert.equal(await openYouTube(page, WATCH, true), null);
    assert.equal(await findConsentModal(page), null);
  } finally { await context.close(); }
});

test('okna zgody nie da się zamknąć → INCONCLUSIVE (nie FAIL ChromeBlock)', { skip }, async () => {
  const { context, page } = await pageWith({ broken: true, delayMs: 300 });
  try {
    await page.goto(WATCH);
    const r = await dismissConsentModal(page, { closeMs: 2000 });
    assert.equal(r.state, 'failed');
    assert.match(r.reason, /nie zniknęło/);
    const { context: c2, page: p2 } = await pageWith({ broken: true, delayMs: 300 });
    try {
      const reason = await openYouTube(p2, WATCH, true);
      assert.match(reason, /^INCONCLUSIVE – okno zgody nie zniknęło.*nie jest błąd ChromeBlock/);
    } finally { await c2.close(); }
  } finally { await context.close(); }
});

test('--no-consent: okno zgody → INCONCLUSIVE bez klikania', { skip }, async () => {
  const { context, page } = await pageWith({ delayMs: 300 });
  try {
    const reason = await openYouTube(page, WATCH, false);
    assert.match(reason, /^INCONCLUSIVE – okno zgody YouTube \(uruchom bez --no-consent\)/);
    assert.notEqual(await page.evaluate(() => window.__rejectClicked), true);
  } finally { await context.close(); }
});

test('bez okna zgody: brak opóźnienia, gdy film już się odtwarza', { skip }, async () => {
  const { context, page } = await pageWith({ noModal: true });
  try {
    const t = Date.now();
    assert.equal(await openYouTube(page, WATCH, true), null);
    assert.ok(Date.now() - t < 6000, `czas ${Date.now() - t} ms`);
  } finally { await context.close(); }
});
