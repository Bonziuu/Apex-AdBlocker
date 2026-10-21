// ChromeBlock – YouTube Playback Health (skrypt treści, świat izolowany).
//
// Lekka diagnostyka odtwarzacza YouTube. Działa lokalnie: sprawdza tylko DOM
// odtwarzacza co kilka sekund i wysyła do service workera status
// (healthy | degraded | error | unknown) wyłącznie przy zmianie stanu.
// Nie zapisuje adresów filmów, nie wysyła niczego poza rozszerzenie, nie
// próbuje automatycznie naprawiać odtwarzacza.

(() => {
  const NS = {
    /** Rodzaj strony YouTube z odtwarzaczem (albo '' gdy brak). */
    pageKind(loc) {
      const p = loc.pathname || '';
      if (p.startsWith('/watch')) return 'watch';
      if (p.startsWith('/shorts/')) return 'shorts';
      if (p.startsWith('/embed/')) return 'embed';
      if (p.startsWith('/live/')) return 'live';
      return '';
    },

    /**
     * Klasyfikacja stanu odtwarzacza na podstawie migawki DOM.
     * snapshot: {kind, elapsedMs, hasPlayer, hasVideo, videoError, errorVisible,
     *            spinnerMs, readyState, paused, advanced}
     */
    classify(s) {
      if (!s.kind) return { status: 'unknown', reasons: ['brak odtwarzacza na tej stronie'] };
      if (s.videoError) return { status: 'error', reasons: [`błąd elementu video (kod ${s.videoError})`] };
      if (s.errorVisible) return { status: 'error', reasons: ['komunikat błędu odtwarzacza'] };
      const canStart = s.hasVideo && (s.readyState >= 2 || s.advanced || (s.readyState >= 1 && s.paused && s.spinnerMs === 0));
      if (canStart && s.spinnerMs < 15000) return { status: 'healthy', reasons: [] };
      if (s.spinnerMs >= 15000) return { status: 'degraded', reasons: [`ładowanie trwa ${Math.round(s.spinnerMs / 1000)} s`] };
      if (!s.hasPlayer) {
        if (s.elapsedMs >= 10000 && s.kind !== 'embed') return { status: 'degraded', reasons: ['brak elementu movie_player'] };
        return { status: 'unknown', reasons: ['odtwarzacz jeszcze się nie pojawił'] };
      }
      if (!s.hasVideo) {
        // osadzony odtwarzacz tworzy <video> dopiero po kliknięciu – to nie jest błąd
        if (s.kind === 'embed' || s.elapsedMs < 20000) return { status: 'unknown', reasons: ['brak elementu video (jeszcze)'] };
        return { status: 'degraded', reasons: ['odtwarzacz bez elementu video'] };
      }
      if (s.elapsedMs < 15000) return { status: 'unknown', reasons: ['trwa uruchamianie'] };
      return { status: 'degraded', reasons: [`video nie jest gotowe (readyState ${s.readyState})`] };
    },
  };

  if (typeof globalThis.__chromeblockTest === 'object') { globalThis.__chromeblockTest.youtubeHealth = NS; return; }
  if (window.__chromeblockYouTubeHealth) return;
  window.__chromeblockYouTubeHealth = true;

  const visible = (el) => !!el && (typeof el.checkVisibility === 'function'
    ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true })
    : el.offsetParent !== null);

  let pageStart = Date.now();
  let lastPath = location.pathname;
  let spinnerSince = 0;
  let lastTime = -1;
  let lastSent = '';

  const sample = () => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      pageStart = Date.now();
      spinnerSince = 0;
      lastTime = -1;
    }
    const kind = NS.pageKind(location);
    const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    const video = (player && player.querySelector('video')) || document.querySelector('video.html5-main-video');
    const spinner = player && player.querySelector('.ytp-spinner');
    const spinning = visible(spinner);
    if (spinning && !spinnerSince) spinnerSince = Date.now();
    if (!spinning) spinnerSince = 0;
    const error = player && player.querySelector('.ytp-error');
    let advanced = false;
    if (video) {
      if (lastTime >= 0 && video.currentTime > lastTime) advanced = true;
      lastTime = video.currentTime;
    }
    return NS.classify({
      kind,
      elapsedMs: Date.now() - pageStart,
      hasPlayer: !!player,
      hasVideo: !!video,
      videoError: video && video.error ? video.error.code : 0,
      errorVisible: visible(error),
      spinnerMs: spinnerSince ? Date.now() - spinnerSince : 0,
      readyState: video ? video.readyState : 0,
      paused: video ? video.paused : true,
      advanced,
    });
  };

  const tick = () => {
    if (document.visibilityState !== 'visible') return;
    let result;
    try { result = sample(); } catch { return; }
    const kind = NS.pageKind(location);
    const key = `${kind}|${result.status}|${result.reasons.join(',')}`;
    if (key === lastSent) return;
    lastSent = key;
    try {
      chrome.runtime.sendMessage({ type: 'youtube:health', status: result.status, reasons: result.reasons, page: kind, frame: window === window.top ? 'top' : 'frame' }).catch(() => {});
    } catch { /* rozszerzenie przeładowane */ }
  };

  setInterval(tick, 3000);
  tick();
})();
