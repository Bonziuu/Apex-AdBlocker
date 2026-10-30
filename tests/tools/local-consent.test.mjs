// Lokalny tester – okno zgody YouTube bezpośrednio na youtube.com („Zanim przejdziesz do YouTube”).
// Test w prawdziwym Chromium (Playwright) na stronie-atrapie pod https://www.youtube.com/ – bez sieci,
// bez rozszerzenia, bez treści YouTube. Brak Playwright/Chromium → SKIP.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadPlaywright } from '../../tools/chromium-smoke.mjs';
import {
  openYouTube, dismissConsentModal, findConsentModal, findRejectButton, formatReport, CONSENT_HEADING_RE, CONSENT_REJECT_RE, CONSENT_ACCEPT_RE,
} from '../local/apex-local-test.mjs';
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

/**
 * Atrapa: nagłówek w jednym kontenerze ([role=dialog]), a stopka z przyciskami jest jego RODZEŃSTWEM
 * (poza kontenerem z nagłówkiem), niżej w przewijanym oknie – poza viewportem.
 * o.reject: 'button' | 'role' (div[role=button]) | 'plain' (element klikalny bez roli, tylko tekst) | 'none'
 */
function siblingPage({ reject = 'button' } = {}) {
  const filler = Array.from({ length: 40 }, (_, i) => `<p>Informacja o plikach cookie nr ${i + 1}.</p>`).join('');
  const rej = {
    button: '<button id="rej"><span>Odrzuć wszystko</span></button>',
    role: '<div id="rej" role="button" tabindex="0">Odrzuć wszystko</div>',
    plain: '<yt-button-shape id="rej"><span class="lbl">Odrzuć wszystko</span></yt-button-shape>',
    none: '<button id="more">Więcej opcji</button>',
  }[reject];
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>YouTube</title>
<style>#cm{position:fixed;top:40px;left:25%;width:50%;height:400px;overflow:auto;background:#fff;border:1px solid #888}
yt-button-shape{display:inline-block;padding:4px;cursor:pointer}</style></head><body>
<div id="movie_player" class="html5-video-player"><video class="html5-main-video" muted width="320" height="180"></video></div>
<canvas id="cv" width="64" height="36" hidden></canvas>
<script>
const v = document.querySelector('video');
const cv = document.getElementById('cv'); const g = cv.getContext('2d');
let f = 0; setInterval(() => { g.fillStyle = f++ % 2 ? '#123' : '#456'; g.fillRect(0, 0, 64, 36); }, 50);
v.srcObject = cv.captureStream(20);
let modalOpen = true;
const realPlay = v.play.bind(v);
v.play = () => (modalOpen ? Promise.reject(new DOMException('zablokowane', 'NotAllowedError')) : realPlay());
setTimeout(() => {
  const m = document.createElement('div');
  m.id = 'cm';
  m.innerHTML = '<div id="head" role="dialog" aria-label="Zgoda"><h2>Zanim przejdziesz do YouTube</h2>${filler}</div>'
    + '<div id="foot"><button id="acc" aria-label="Zaakceptuj wszystko">Zaakceptuj wszystko</button> ${rej}</div>';
  document.body.appendChild(m);
  const r = m.querySelector('#rej');
  window.__rejectOutOfView = !!r && r.getBoundingClientRect().top > m.getBoundingClientRect().bottom;
  if (r) r.addEventListener('click', () => { window.__rejectClicked = true; m.remove(); modalOpen = false; realPlay(); });
  m.querySelector('#acc').addEventListener('click', () => { window.__acceptClicked = true; });
}, 600);
</script></body></html>`;
}

async function pageWith(opts, html = watchPage) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await context.route(/^https?:/, (r) => (new URL(r.request().url()).hostname === 'www.youtube.com'
    ? r.fulfill({ contentType: 'text/html; charset=utf-8', body: html(opts) })
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

test('okna zgody nie da się zamknąć → INCONCLUSIVE (nie FAIL Apex AdBlocker)', { skip }, async () => {
  const { context, page } = await pageWith({ broken: true, delayMs: 300 });
  try {
    await page.goto(WATCH);
    const r = await dismissConsentModal(page, { closeMs: 2000 });
    assert.equal(r.state, 'failed');
    assert.match(r.reason, /nie zniknęło/);
    const { context: c2, page: p2 } = await pageWith({ broken: true, delayMs: 300 });
    try {
      const reason = await openYouTube(p2, WATCH, true);
      assert.match(reason, /^INCONCLUSIVE – okno zgody nie zniknęło.*nie jest błąd Apex AdBlocker/);
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

// --- przycisk w stopce będącej rodzeństwem kontenera z nagłówkiem -----------------------------

test('PRZYCZYNA: kontener z nagłówkiem nie zawiera stopki z „Odrzuć wszystko” (stara logika szukała tylko w nim)', { skip }, async () => {
  const { context, page } = await pageWith({ reject: 'button' }, siblingPage);
  try {
    await page.goto(WATCH);
    await page.waitForSelector('#cm');
    const modal = await findConsentModal(page);
    assert.ok(modal, 'okno zgody rozpoznane');
    assert.equal(await modal.root.getAttribute('id'), 'head', 'rozpoznany kontener to ten z nagłówkiem');
    assert.equal(await modal.root.getByRole('button', { name: CONSENT_REJECT_RE }).count(), 0, 'w nim nie ma przycisku – stąd „nie ma przycisku”');
    const found = await findRejectButton(page, modal.root);
    assert.ok(found, 'nowe wyszukiwanie znajduje przycisk');
    assert.match(found.scope, /kontener okna \(\+1\)/);
  } finally { await context.close(); }
});

for (const [variant, label] of [['button', '<button>'], ['role', '[role="button"]'], ['plain', 'element klikalny z dokładnym tekstem']]) {
  test(`REGRESJA: nagłówek w jednym kontenerze, stopka z „Odrzuć wszystko” (${label}) jako rodzeństwo, poza viewportem → kliknięte, okno znika, odtwarzanie startuje`, { skip }, async () => {
    const { context, page } = await pageWith({ reject: variant }, siblingPage);
    try {
      const reason = await openYouTube(page, WATCH, true);
      assert.equal(reason, null, `openYouTube: ${reason}`);
      assert.equal(await page.evaluate(() => window.__rejectOutOfView), true, 'przycisk był poza widokiem');
      assert.equal(await page.evaluate(() => window.__rejectClicked), true, 'kliknięto „Odrzuć wszystko”');
      assert.notEqual(await page.evaluate(() => window.__acceptClicked), true, 'NIE kliknięto „Zaakceptuj wszystko”');
      assert.equal(await findConsentModal(page), null, 'okno zgody zniknęło');
      await ensurePlaying(page, 'player');
      const s = await samplePlayer(page, 'player', 4);
      assert.ok(progressOf(s) >= 1.5, `postęp ${progressOf(s)} s`);
    } finally { await context.close(); }
  });
}

test('brak „Odrzuć wszystko” → diagnostyka: nagłówek i widoczne przyciski; „Zaakceptuj” nie jest klikane', { skip }, async () => {
  const { context, page } = await pageWith({ reject: 'none' }, siblingPage);
  try {
    let diag = null;
    const reason = await openYouTube(page, WATCH, true, { onConsentDiagnostics: (d) => { diag = d; } });
    assert.match(reason, /^INCONCLUSIVE – nie znaleziono przycisku „Odrzuć wszystko”/);
    assert.notEqual(await page.evaluate(() => window.__acceptClicked), true);
    assert.ok(diag);
    assert.equal(diag.heading, 'Zanim przejdziesz do YouTube');
    assert.ok(diag.buttons.some((b) => /„Zaakceptuj wszystko”/.test(b)), diag.buttons.join(' | '));
    assert.ok(diag.buttons.some((b) => /„Więcej opcji”/.test(b)), diag.buttons.join(' | '));
    const t = formatReport({ overall: 'INCONCLUSIVE', version: 'v', checks: [], errors: [], notes: [], finishedAt: 'x', durationMs: 1, consentDiagnostics: diag });
    assert.match(t, /Diagnostyka okna zgody YouTube:\n  nagłówek: „Zanim przejdziesz do YouTube”/);
    assert.match(t, /- button.*„Zaakceptuj wszystko”/);
  } finally { await context.close(); }
});

test('akceptacja nigdy nie pasuje do wzorca odrzucenia', () => {
  for (const a of ['Zaakceptuj wszystko', 'Accept all', 'Alle akzeptieren', 'Alle annehmen', 'Tout accepter', 'Aceptar todo']) {
    assert.match(a, CONSENT_ACCEPT_RE, a);
    assert.doesNotMatch(a, CONSENT_REJECT_RE, a);
  }
});
