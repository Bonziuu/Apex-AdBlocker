// Apex AdBlocker – testy E2E YouTube w prawdziwej przeglądarce (Playwright + Chromium
// z załadowanym rozszerzeniem). Uruchamiane WYŁĄCZNIE przez `npm run test:e2e`.
//
//   npm install
//   npx playwright install chromium
//   npm run test:e2e
//
// Zmienne środowiskowe:
//   YOUTUBE_WATCH_URLS   lista adresów /watch rozdzielona przecinkami (domyślnie 3 filmy, w tym 1 dłuższy)
//   YOUTUBE_PLAYLIST_URL adres playlisty (domyślnie /watch_videos z 3 filmów)
//   YOUTUBE_SHORTS_URL   adres Shorts (bez niego przypadek: SKIP — no stable Shorts URL configured)
//   YOUTUBE_EMBED_URL    adres embed (domyślnie /embed/<dłuższy film>)
//   YOUTUBE_MUSIC_URL    adres music.youtube.com/watch
//   E2E_HANDLE_CONSENT=1 zwykła interakcja z ekranem zgody w jednorazowym profilu (domyślnie: nic nie klikamy)
//   E2E_HEADLESS=1       tryb headless (rozszerzenia działają tylko w nowym trybie headless)
//   E2E_SAMPLE_SECONDS   długość próbkowania odtwarzania (domyślnie 20)
//
// Zasady (z założeń sprintu):
//  - test NIE klika „Pomiń reklamę” i NIE modyfikuje obiektów odtwarzacza – tylko obserwuje,
//  - CAPTCHA, /sorry/, logowanie, weryfikacja konta → SKIP, bez obchodzenia,
//  - brak okazji reklamowej → „INCONCLUSIVE — no ad opportunity observed”, nigdy „reklamy zablokowane”,
//  - stan reklamy przez ≥ 3 kolejne sekundy → FAIL (AD_VISIBLE_FAILURE).

import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { ROOT } from '../../tools/lists-config.mjs';
import {
  analyzeAdState, analyzePlayback, adFieldsInPlayerResponse, mergeTriState,
  classifyAds, classifyCase, summarize, progressOf, OUTCOME,
} from './lib/classify.mjs';
import {
  pageSample, pagePlayerResponseSummary, watchRawResponses, detectGate, handleConsent,
  ensurePlaying, samplePlayer, seekForward, nextPlaylistItem,
} from './lib/youtube-page.mjs';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  chromium = null;
}

const env = process.env;
const SAMPLE_SECONDS = Number(env.E2E_SAMPLE_SECONDS) || 20;
const LONG_VIDEO = 'aqz-KE-bpKQ'; // Big Buck Bunny (~10 min)
const WATCH_URLS = (env.YOUTUBE_WATCH_URLS || [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=9bZkp7q19f0',
  `https://www.youtube.com/watch?v=${LONG_VIDEO}`,
].join(',')).split(',').map((s) => s.trim()).filter(Boolean);
const PLAYLIST_URL = env.YOUTUBE_PLAYLIST_URL || `https://www.youtube.com/watch_videos?video_ids=${LONG_VIDEO},dQw4w9WgXcQ,9bZkp7q19f0`;
const EMBED_URL = env.YOUTUBE_EMBED_URL || `https://www.youtube.com/embed/${LONG_VIDEO}?autoplay=1&mute=1`;
const MUSIC_URL = env.YOUTUBE_MUSIC_URL || 'https://music.youtube.com/watch?v=dQw4w9WgXcQ';
const SHORTS_URL = env.YOUTUBE_SHORTS_URL || '';

/** Etykieta przypadku bez identyfikatora filmu (do raportu). */
const label = (kind, i) => `${kind}${i != null ? ` #${i + 1}` : ''}`;

const CASES = [
  ...WATCH_URLS.map((url, i) => ({ name: label('watch', i), kind: 'watch', url, seek: true })),
  { name: 'playlist', kind: 'playlist', url: PLAYLIST_URL, next: true },
  { name: 'embed', kind: 'embed', url: EMBED_URL },
  { name: 'music', kind: 'music', url: MUSIC_URL },
  { name: 'shorts', kind: 'shorts', url: SHORTS_URL, skip: SHORTS_URL ? false : 'SKIP — no stable Shorts URL configured' },
];

const skipAll = chromium ? false : 'Playwright nie jest zainstalowany (npm install && npx playwright install chromium)';
const results = [];
let diagnostics = null;

async function launch() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-e2e-')); // jednorazowy profil
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: env.E2E_HEADLESS === '1',
    // rozszerzenia działają tylko w pełnym Chromium (nowy headless), nie w chromium-headless-shell
    channel: 'chromium',
    args: [`--disable-extensions-except=${ROOT}`, `--load-extension=${ROOT}`, '--autoplay-policy=no-user-gesture-required'],
  });
  let [sw] = context.serviceWorkers();
  if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 15000 });
  return { context, userDataDir, extensionId: new URL(sw.url()).host };
}

async function extensionCall(context, extensionId, msg) {
  const page = await context.newPage();
  try {
    await page.goto(`chrome-extension://${extensionId}/options/options.html`);
    return await page.evaluate((m) => chrome.runtime.sendMessage(m), msg);
  } finally {
    await page.close();
  }
}

/** Otwiera adres; zwraca powód pominięcia (bramka zgody/CAPTCHA) albo null. */
async function open(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  } catch (e) {
    const m = /net::ERR_[A-Z_]+/.exec(String(e && e.message));
    if (m) return `SKIP — strona niedostępna z tego środowiska (${m[0]}); to nie jest wynik odtwarzania`;
    throw e;
  }
  let gate = await detectGate(page);
  if (gate === 'consent' && env.E2E_HANDLE_CONSENT === '1') {
    if (await handleConsent(page)) gate = await detectGate(page);
  }
  if (gate === 'captcha') return 'SKIP — Google wymaga weryfikacji (CAPTCHA, /sorry/) – bez obchodzenia';
  if (gate === 'consent') return 'SKIP — ekran zgody na cookies (ustaw E2E_HANDLE_CONSENT=1, aby wykonać zwykłą interakcję w jednorazowym profilu)';
  if (/accounts\.google\.com|ServiceLogin|signin/.test(page.url())) return 'SKIP — wymagane logowanie / weryfikacja konta';
  return null;
}

/** Jeden przypadek: otwarcie, uruchomienie, próbkowanie co 1 s, opcjonalnie seek / następny film. */
async function runCase(context, c, t) {
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e && e.message || e)));
  const raw = watchRawResponses(page);
  const record = { name: c.name, kind: c.kind };
  try {
    const skip = await open(page, c.url);
    if (skip) { record.skipped = skip; t.skip(skip); return record; }

    const sampleKind = c.kind === 'shorts' ? 'shorts' : 'player';
    await ensurePlaying(page, sampleKind);
    const samples = await samplePlayer(page, sampleKind, SAMPLE_SECONDS);
    const adState = analyzeAdState(samples);
    const playback = analyzePlayback(samples);
    const visibleSummary = await page.evaluate(pagePlayerResponseSummary).catch(() => null);
    const metadata = { raw: mergeTriState(raw), visible: adFieldsInPlayerResponse(visibleSummary) };
    const ads = classifyAds(adState, metadata);

    let seek = null;
    if (c.seek && playback.ok) {
      const before = await seekForward(page, 15);
      await page.waitForTimeout(1500);
      const after = await samplePlayer(page, sampleKind, 8);
      const jumped = before != null && typeof after[0].currentTime === 'number' && after[0].currentTime >= before + 10;
      const grew = progressOf(after) >= 3;
      seek = { ok: jumped && grew, reasons: [!jumped && 'pozycja nie przeskoczyła o ≥ 10 s', !grew && 'czas nie rośnie po seek'].filter(Boolean) };
    }

    let next = null;
    if (c.next && playback.ok) {
      const n = await nextPlaylistItem(page);
      if (!n.ok) next = { ok: false, reasons: [n.reason] };
      else {
        await ensurePlaying(page, sampleKind);
        const s2 = await samplePlayer(page, sampleKind, 10);
        const p2 = analyzePlayback(s2);
        next = { ok: p2.ok, reasons: p2.reasons };
        const a2 = analyzeAdState(s2);
        if (a2.persistent) Object.assign(adState, a2);
      }
    }

    const verdict = classifyCase({ playback, ads: classifyAds(adState, metadata), seek, next });
    const extErrors = pageErrors.filter((e) => /apex|scriptlet/i.test(e));
    if (extErrors.length) { verdict.failed = true; verdict.outcome = OUTCOME.PLAYER_FAILURE; verdict.reasons.push(`błędy rozszerzenia na stronie: ${extErrors.length}`); }

    Object.assign(record, {
      outcome: verdict.outcome,
      failed: verdict.failed,
      playback: verdict.playback,
      adVerdict: verdict.adVerdict,
      reasons: verdict.reasons,
      adState,
      adMetadataDetected: metadata.visible,
      adMetadataRaw: metadata.raw,
      playbackDetail: { progress: playback.progress, readyOk: playback.readyOk, spinnerSeconds: playback.spinnerSeconds, permanentError: playback.permanentError, antiAdblock: playback.antiAdblock },
      seek: seek && seek.ok, next: next && next.ok,
      lastSample: samples.at(-1),
    });
    t.diagnostic(`${c.name}: ${verdict.outcome} · playback ${verdict.playback} · ad metadata detected: ${metadata.visible} (raw: ${metadata.raw})`);
    if (adState.anyAd) t.diagnostic(`  stan reklamy: ${adState.adSeconds} s, sygnały: ${adState.signals.join(', ')}, film główny ruszył po reklamie: ${adState.mainVideoStartedAfter}`);
    for (const r of verdict.reasons) t.diagnostic(`  ${r}`);
    return record;
  } finally {
    await page.close().catch(() => {});
  }
}

/** Prawdziwy embed: odtwarzacz YouTube w iframe na lokalnej stronie testowej. */
async function runIframeEmbed(context, t) {
  const page = await context.newPage();
  const record = { name: 'embed (iframe)', kind: 'embed-iframe' };
  try {
    const src = EMBED_URL;
    await page.route('https://apex-e2e.test/**', (route) => route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><title>embed</title><iframe id="yt" width="640" height="360" allow="autoplay; encrypted-media" src="${src}"></iframe>`,
    }));
    await page.goto('https://apex-e2e.test/', { waitUntil: 'domcontentloaded' });
    const handle = await page.waitForSelector('#yt', { timeout: 15000 });
    const frame = await handle.contentFrame();
    try {
      await frame.waitForSelector('.html5-video-player', { timeout: 30000 });
    } catch (e) {
      if (/^chrome-error:/.test(frame.url())) {
        record.skipped = 'SKIP — iframe YouTube niedostępny z tego środowiska (błąd sieci); to nie jest wynik odtwarzania';
        t.skip(record.skipped);
        return record;
      }
      throw e;
    }
    // embed może wymagać zwykłego kliknięcia „odtwórz”
    const big = frame.locator('.ytp-large-play-button:visible').first();
    if (await big.count()) await big.click().catch(() => {});
    await page.waitForTimeout(3000);
    const samples = [];
    for (let i = 0; i < SAMPLE_SECONDS; i++) { samples.push(await frame.evaluate(pageSample, 'player')); await page.waitForTimeout(1000); }
    if (samples.every((s) => !s.hasVideo)) {
      record.skipped = 'SKIP — odtwarzacz embed niedostępny (logowanie/ograniczenia)'; t.skip(record.skipped); return record;
    }
    const adState = analyzeAdState(samples);
    const playback = analyzePlayback(samples);
    const verdict = classifyCase({ playback, ads: classifyAds(adState, {}) });
    Object.assign(record, { outcome: verdict.outcome, failed: verdict.failed, playback: verdict.playback, adVerdict: verdict.adVerdict, reasons: verdict.reasons, adState, playbackDetail: { progress: playback.progress, antiAdblock: playback.antiAdblock } });
    t.diagnostic(`embed (iframe): ${verdict.outcome} · playback ${verdict.playback}`);
    return record;
  } finally {
    await page.close().catch(() => {});
  }
}

test('Apex AdBlocker E2E – YouTube (prawdziwa przeglądarka)', { skip: skipAll, timeout: 30 * 60 * 1000 }, async (t) => {
  const { context, userDataDir, extensionId } = await launch();
  try {
    // instalacja: czekamy, aż pierwsza synchronizacja zapisze wynik każdego kroku
    // (na wolnej maszynie trwa to kilkadziesiąt sekund)
    let h0;
    const deadline = Date.now() + 180_000;
    do {
      h0 = await extensionCall(context, extensionId, { type: 'health:get' });
      if (['rulesets', 'dynamicRules', 'scriptlets'].every((k) => h0.sync[k] && h0.sync[k].status !== 'unknown')) break;
      await new Promise((r) => setTimeout(r, 2000));
    } while (Date.now() < deadline);
    t.diagnostic(`silniki: ${Object.entries(h0.components).map(([k, v]) => `${k}=${v.status}`).join(', ')}`);
    await t.test('stan silników po instalacji', () => {
      assert.equal(h0.sync.rulesets.status, 'ok', 'syncRulesets');
      assert.equal(h0.sync.dynamicRules.status, 'ok', 'syncDynamicRules');
      assert.equal(h0.sync.scriptlets.status, 'ok', 'syncScriptlets');
      for (const c of ['network', 'cosmetic', 'scriptlets', 'filters', 'youtube']) {
        assert.equal(h0.components[c].status, 'ok', `${c}: ${h0.components[c].detail}`);
      }
      assert.deepEqual(h0.errors, [], 'brak błędów Apex AdBlocker po instalacji');
    });

    for (const c of CASES) {
      await t.test(c.name, { skip: c.skip || false }, async (st) => {
        const r = await runCase(context, c, st);
        results.push(r);
        if (!r.skipped) assert.ok(!r.failed, `${c.name}: ${r.outcome} – ${r.reasons.join('; ')}`);
      });
      if (c.skip) results.push({ name: c.name, kind: c.kind, skipped: c.skip });
    }

    await t.test('embed w iframe', async (st) => {
      const r = await runIframeEmbed(context, st);
      results.push(r);
      if (!r.skipped) assert.ok(!r.failed, `embed (iframe): ${r.outcome} – ${r.reasons.join('; ')}`);
    });

    // Diagnostyka rozszerzenia po przejściu przez YouTube (raport lokalny, bez URL)
    const diag = await extensionCall(context, extensionId, { type: 'diagnostics:export' });
    await t.test('raport diagnostyczny nie zawiera adresów ani ID filmów', () => {
      assert.ok(!/https?:\/\//.test(diag.text));
      for (const u of [...WATCH_URLS, PLAYLIST_URL]) {
        const id = new URL(u).searchParams.get('v');
        if (id) assert.ok(!diag.text.includes(id));
      }
    });
    diagnostics = diag.data;
  } finally {
    await context.close().catch(() => {});
    fs.rmSync(userDataDir, { recursive: true, force: true });
    const summary = summarize(results);
    const out = path.join(ROOT, 'tests', 'e2e', 'results');
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'last-run.json'), JSON.stringify({ at: new Date().toISOString(), summary, results, diagnostics }, null, 2));
    console.log('\nApex AdBlocker E2E – podsumowanie');
    console.log(`  przypadki: ${summary.total} · PASS ${summary.PASS} · FAIL ${summary.FAIL} · SKIP ${summary.SKIP} · INCONCLUSIVE (reklamy) ${summary.INCONCLUSIVE} · AD_BLOCKING_OBSERVED ${summary.AD_BLOCKING_OBSERVED}`);
    console.log(`  widoczna reklama: ${summary.adSeen ? 'TAK' : 'nie'} · ostrzeżenie anti-adblock: ${summary.antiAdblockSeen ? 'TAK' : 'nie'}`);
    for (const r of results) console.log(`  - ${r.name}: ${r.skipped ? r.skipped : `${r.outcome} (playback ${r.playback}, reklama: ${r.adVerdict})`}`);
    console.log('  wyniki: tests/e2e/results/last-run.json');
  }
});
