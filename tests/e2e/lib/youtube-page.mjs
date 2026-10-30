// Apex AdBlocker E2E – sondy strony YouTube (Playwright). Tylko OBSERWACJA:
// test nie modyfikuje obiektów odtwarzacza ani odpowiedzi, nie klika „Pomiń reklamę”.
// Dozwolone interakcje: zwykłe uruchomienie filmu (przycisk play / video.play()),
// seek, przejście do kolejnego filmu playlisty przez API odtwarzacza.

import { adFieldsInRawText } from './classify.mjs';

/** Funkcja wykonywana na stronie: migawka stanu odtwarzacza. */
export function pageSample(kind) {
  const vis = (el) => !!el && (typeof el.checkVisibility === 'function'
    ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true })
    : el.offsetParent !== null);
  let player;
  let video;
  if (kind === 'shorts') {
    const active = document.querySelector('ytd-reel-video-renderer[is-active]') || document;
    player = active.querySelector('#shorts-player, .html5-video-player') || document.querySelector('#shorts-player');
    video = (player && player.querySelector('video')) || active.querySelector('video');
  } else {
    player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    video = (player && player.querySelector('video')) || document.querySelector('video');
  }
  const scope = player || document;
  const adSelectors = {
    'ad-overlay': '.ytp-ad-player-overlay, .ytp-ad-player-overlay-layout',
    'ad-skip-ui': '.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern',
    'ad-badge': '.ytp-ad-badge, .ytp-ad-simple-ad-badge',
    'ad-text': '.ytp-ad-text, .ytp-ad-preview-container',
    'ad-survey': '.ytp-ad-survey',
  };
  const adElements = Object.entries(adSelectors)
    .filter(([, sel]) => Array.from(scope.querySelectorAll(sel)).some(vis))
    .map(([name]) => name);
  return {
    hasPlayer: !!player,
    hasVideo: !!video,
    adShowing: !!(player && player.classList.contains('ad-showing')),
    adElements,
    currentTime: video ? Math.round(video.currentTime * 10) / 10 : null,
    duration: video && Number.isFinite(video.duration) ? Math.round(video.duration) : null,
    readyState: video ? video.readyState : 0,
    paused: video ? video.paused : true,
    spinner: vis(player && player.querySelector('.ytp-spinner')),
    error: vis(document.querySelector('.ytp-error')),
    antiAdblock: vis(document.querySelector('ytd-enforcement-message-view-model, tp-yt-paper-dialog ytd-enforcement-message-view-model')),
  };
}

/** Funkcja wykonywana na stronie: liczby elementów danych reklam w odpowiedzi odtwarzacza. */
export function pagePlayerResponseSummary() {
  let r = null;
  let source = '';
  try {
    const p = document.getElementById('movie_player');
    if (p && typeof p.getPlayerResponse === 'function') { r = p.getPlayerResponse(); source = 'movie_player.getPlayerResponse()'; }
  } catch { /* brak API */ }
  if (!r) {
    try { if (window.ytInitialPlayerResponse) { r = window.ytInitialPlayerResponse; source = 'ytInitialPlayerResponse'; } } catch { /* */ }
  }
  if (!r || typeof r !== 'object') return null;
  const len = (x) => (Array.isArray(x) ? x.length : (x == null ? 0 : 1));
  return { source, adPlacements: len(r.adPlacements), adSlots: len(r.adSlots), playerAds: len(r.playerAds) };
}

/** Rejestruje obserwację surowych odpowiedzi (dokument + /youtubei/v1/player). */
export function watchRawResponses(page) {
  const seen = [];
  page.on('response', async (resp) => {
    try {
      const type = resp.request().resourceType();
      const url = resp.url();
      if (!['document', 'xhr', 'fetch'].includes(type)) return;
      if (!/youtube\.com\/(watch|embed\/|shorts\/|youtubei\/v1\/(player|reel))/.test(url)) return;
      const text = await resp.text();
      seen.push(adFieldsInRawText(text));
    } catch { /* odpowiedź niedostępna (np. przekierowanie) */ }
  });
  return seen;
}

/** Czy strona jest bramką zgody/CAPTCHA (nie obchodzimy jej). */
export async function detectGate(page) {
  const url = page.url();
  if (/\/sorry\//.test(url) || await page.locator('iframe[src*="recaptcha"]').count()) return 'captcha';
  if (/consent\.(youtube|google)\./.test(url)) return 'consent';
  return null;
}

/**
 * Opcjonalnie (E2E_HANDLE_CONSENT=1): normalna interakcja z ekranem zgody w JEDNORAZOWYM
 * profilu testowym – wybór „odrzuć wszystkie” (formularz z set_eom=true).
 */
export async function handleConsent(page) {
  const button = page.locator('form:has(input[name="set_eom"][value="true"]) button').first();
  if (!(await button.count())) return false;
  await Promise.all([page.waitForNavigation({ timeout: 20000 }).catch(() => {}), button.click()]);
  return !(await detectGate(page));
}

/** Czeka na odtwarzacz i – jeśli przeglądarka zablokowała autoplay – zwyczajnie uruchamia film. */
export async function ensurePlaying(page, kind) {
  await page.waitForFunction((k) => {
    const sel = k === 'shorts' ? 'ytd-reel-video-renderer[is-active] video, #shorts-player video' : '#movie_player video, video';
    return !!document.querySelector(sel);
  }, kind, { timeout: 25000, polling: 500 }).catch(() => {});
  await page.waitForTimeout(3000);
  const s = await page.evaluate(pageSample, kind);
  if (s.hasVideo && s.paused && !s.adShowing) {
    const big = page.locator('.ytp-large-play-button:visible, .ytp-play-button:visible').first();
    if (await big.count()) await big.click().catch(() => {});
    await page.waitForTimeout(1000);
    const again = await page.evaluate(pageSample, kind);
    if (again.paused) {
      await page.evaluate((k) => {
        const v = k === 'shorts'
          ? document.querySelector('ytd-reel-video-renderer[is-active] video, #shorts-player video')
          : (document.querySelector('#movie_player video') || document.querySelector('video'));
        if (v) return v.play().catch(() => {});
        return undefined;
      }, kind);
    }
  }
}

/** Próbkuje stan odtwarzacza co 1 s przez `seconds` sekund. */
export async function samplePlayer(page, kind, seconds) {
  const samples = [];
  for (let i = 0; i < seconds; i++) {
    samples.push({ t: i, ...(await page.evaluate(pageSample, kind)) });
    await page.waitForTimeout(1000);
  }
  return samples;
}

/** Seek o `delta` sekund do przodu przez API odtwarzacza (albo element video). */
export async function seekForward(page, delta = 15) {
  return page.evaluate((d) => {
    const p = document.getElementById('movie_player');
    const v = (p && p.querySelector('video')) || document.querySelector('video');
    if (!v) return null;
    const before = v.currentTime;
    if (p && typeof p.seekTo === 'function') p.seekTo(before + d, true);
    else v.currentTime = before + d;
    return before;
  }, delta);
}

/** Przejście do kolejnego filmu playlisty przez API odtwarzacza (niezależne od języka UI). */
export async function nextPlaylistItem(page) {
  const before = new URL(page.url()).searchParams.get('v');
  const called = await page.evaluate(() => {
    const p = document.getElementById('movie_player');
    if (p && typeof p.nextVideo === 'function') { p.nextVideo(); return true; }
    return false;
  });
  if (!called) return { ok: false, reason: 'API nextVideo() niedostępne' };
  try {
    await page.waitForFunction((b) => new URL(location.href).searchParams.get('v') !== b, before, { timeout: 15000 });
  } catch {
    return { ok: false, reason: 'adres filmu nie zmienił się w ciągu 15 s' };
  }
  return { ok: true };
}
