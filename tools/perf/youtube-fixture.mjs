// ChromeBlock – syntetyczna strona „YouTube” do pomiarów wydajności (tools/perf/youtube-perf.mjs).
//
// Strona jest serwowana przez Playwright pod https://www.youtube.com/watch?v=…, więc ChromeBlock
// wstrzykuje do niej te same skrypty (cosmetic, health, scriptlety), co na prawdziwym YouTube.
// Obciążenie naśladuje wzorce YouTube: render Polymer (appendChild), timery, logowanie
// (JSON.stringify), parsowanie odpowiedzi (JSON.parse), fetch/XHR do /youtubei/v1/*,
// aktualizacje tekstu w odtwarzaczu, przełączanie klas i nawigację SPA.
// Nie zawiera kodu ani treści YouTube.

/** Deterministyczny „player response” z polami reklam (ok. `kb` KB). */
export function playerResponse(kb = 400) {
  const filler = (n) => Array.from({ length: n }, (_, i) => ({ itag: i, url: `https://example.invalid/videoplayback?id=${i}&x=${'a'.repeat(40)}`, bitrate: 1000 + i, mimeType: 'video/mp4; codecs="avc1.4d401f"' }));
  const ad = (i) => ({ adPlacementRenderer: { config: { adPlacementConfig: { kind: 'AD_PLACEMENT_KIND_START', adTimeOffset: { offsetStartMilliseconds: String(i * 1000) } } }, renderer: { linearAdSequenceRenderer: { linearAds: filler(8) } } } });
  const base = {
    responseContext: { serviceTrackingParams: filler(4) },
    playabilityStatus: { status: 'OK' },
    streamingData: { expiresInSeconds: '21540', formats: filler(10), adaptiveFormats: [] },
    playerAds: [{ playerLegacyDesktopWatchAdsRenderer: { playerAdParams: { enabledEngageTypes: '3,6,4,5,17,1' } } }],
    adPlacements: [ad(0), ad(1), ad(2)],
    adSlots: [{ adSlotRenderer: { adSlotMetadata: { slotId: 'x', slotType: 'SLOT_TYPE_PLAYER_BYTES' } } }],
    videoDetails: { videoId: 'perfTest01', title: 'Perf', lengthSeconds: '600' },
  };
  const target = kb * 1024;
  while (JSON.stringify(base).length < target) base.streamingData.adaptiveFormats.push(...filler(20));
  return base;
}

/** Odpowiedź „next” (rekomendacje, komentarze) ok. `kb` KB, bez reklam. */
export function nextResponse(kb = 200) {
  const items = [];
  const out = { contents: { twoColumnWatchNextResults: { secondaryResults: { results: items } } } };
  let i = 0;
  while (JSON.stringify(out).length < kb * 1024) {
    items.push({ compactVideoRenderer: { videoId: `v${i}`, title: { simpleText: `Film ${i} ${'t'.repeat(30)}` }, viewCountText: { simpleText: `${i * 37} wyświetleń` }, thumbnail: { thumbnails: [{ url: `https://example.invalid/vi/${i}/hq.jpg`, width: 168, height: 94 }] } } });
    i++;
  }
  return out;
}

/** HTML strony z obciążeniem; window.__runWorkload(seconds) i window.__micro(). */
export function fixtureHtml() {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>perf fixture</title>
<style>
  ytd-app, ytd-watch-flexy, #primary, #secondary, #contents { display: block }
  .item { display: flex; gap: 4px; padding: 2px } .thumb { width: 168px; height: 94px; background: #ddd }
  #movie_player { width: 640px; height: 360px; background: #000; position: relative }
  .ytp-progress { height: 3px; background: red; width: 0 }
</style></head>
<body>
<ytd-app id="app">
  <div id="masthead" class="style-scope ytd-app"><span id="logo" class="style-scope ytd-masthead">logo</span></div>
  <ytd-watch-flexy class="style-scope ytd-page-manager">
    <div id="primary" class="style-scope ytd-watch-flexy">
      <div id="movie_player" class="html5-video-player playing-mode ytp-autohide">
        <video class="html5-main-video" muted></video>
        <div class="ytp-spinner" style="display:none"></div>
        <div class="ytp-progress"></div>
        <span class="ytp-time-current">0:00</span>
      </div>
      <div id="below" class="style-scope ytd-watch-flexy"><h1 id="title">Perf</h1><div id="comments"></div></div>
    </div>
    <div id="secondary" class="style-scope ytd-watch-flexy"><div id="contents" class="style-scope ytd-item-section-renderer"></div></div>
  </ytd-watch-flexy>
</ytd-app>
<script>
(() => {
  const N = { appendChild: 0, setTimeout: 0, stringify: 0, parse: 0, fetch: 0, xhr: 0, text: 0, nav: 0 };
  const parseSample = JSON.stringify({ items: Array.from({ length: 300 }, (_, i) => ({ id: i, title: 'Tytuł ' + i, views: i * 13, badges: ['HD', 'CC'] })) });
  const logEvent = () => ({ context: { client: { clientName: 'WEB', clientVersion: '2.20261020', hl: 'pl', gl: 'PL', userAgent: navigator.userAgent, screenWidthPoints: 1280 } },
    events: Array.from({ length: 6 }, (_, i) => ({ eventTimeMs: Date.now() + i, payload: { csi: { name: 'tick', value: i, info: { a: 1, b: 'x'.repeat(40) } } } })) });
  let seq = 0;
  const item = () => {
    const root = document.createElement('ytd-compact-video-renderer');
    root.className = 'style-scope ytd-item-section-renderer item';
    const parts = ['thumb', 'details', 'meta', 'title', 'byline', 'views', 'badge', 'menu', 'overlay', 'progress', 'time', 'avatar', 'channel', 'text'];
    let parent = root;
    for (const p of parts) {
      const el = document.createElement(p === 'thumb' ? 'img' : 'div');
      el.className = 'style-scope ytd-compact-video-renderer ' + p;
      if (p === 'title' || p === 'views' || p === 'time') el.textContent = p + ' ' + (seq++);
      parent.appendChild(el); N.appendChild++;
      if (p === 'details') parent = el;
    }
    return root;
  };
  const contents = () => document.getElementById('contents');
  const addItems = (n) => {
    const c = contents();
    for (let i = 0; i < n; i++) { c.appendChild(item()); N.appendChild++; }
    while (c.childElementCount > 400) c.firstElementChild.remove();
  };
  const navigate = () => {
    N.nav++;
    history.pushState({}, '', '/watch?v=perfNav' + N.nav);
    const c = contents();
    c.textContent = '';
    addItems(100);
    document.getElementById('title').textContent = 'Film ' + N.nav;
    window.dispatchEvent(new Event('yt-navigate-finish'));
  };
  const xhr = (url, body) => new Promise((resolve) => {
    const r = new XMLHttpRequest();
    r.open(body ? 'POST' : 'GET', url);
    r.onloadend = () => { try { void r.responseText.length; } catch {} resolve(); };
    r.send(body || null); N.xhr++;
  });
  let tickNo = 0;
  const tick = async () => {
    tickNo++;
    addItems(10);
    for (let i = 0; i < 20; i++) { setTimeout(() => {}, 0); N.setTimeout++; }
    for (let i = 0; i < 5; i++) { JSON.stringify(logEvent()); N.stringify++; }
    for (let i = 0; i < 2; i++) { JSON.parse(parseSample); N.parse++; }
    const p = document.getElementById('movie_player');
    p.classList.toggle('ytp-autohide'); p.classList.toggle('ytp-hover');
    if (tickNo % 2 === 0) { document.querySelector('.ytp-time-current').textContent = '0:' + String(tickNo % 60).padStart(2, '0'); N.text++; }
    document.querySelector('.ytp-progress').style.width = (tickNo % 100) + '%';
    const tasks = [];
    if (tickNo % 20 === 0) {
      tasks.push(fetch('/youtubei/v1/next?key=x', { method: 'POST', body: JSON.stringify(logEvent()) }).then((r) => r.json()).then(() => {}, () => {}));
      tasks.push(xhr('/youtubei/v1/log_event?alt=json', JSON.stringify(logEvent())));
      N.fetch++;
    }
    if (tickNo % 50 === 0) {
      tasks.push(fetch('/youtubei/v1/player?key=x', { method: 'POST', body: JSON.stringify(logEvent()) }).then((r) => r.json()).then(() => {}, () => {}));
      tasks.push(xhr('/youtubei/v1/player?alt=json'));
      N.fetch++;
      navigate();
    }
    await Promise.all(tasks);
  };
  window.__runWorkload = async (seconds) => {
    const end = performance.now() + seconds * 1000;
    let long = 0;
    let longMs = 0;
    const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) { long++; longMs += e.duration; } });
    try { po.observe({ entryTypes: ['longtask'] }); } catch {}
    while (performance.now() < end) {
      const t0 = performance.now();
      await tick();
      const wait = 100 - (performance.now() - t0);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    }
    await new Promise((r) => setTimeout(r, 300));
    po.disconnect();
    return { counts: { ...N }, longTasks: long, longTaskMs: Math.round(longMs) };
  };
  // mikropomiar: koszt jednego wywołania gorących API (µs)
  window.__micro = () => {
    const per = (n, fn) => { fn(); const t0 = performance.now(); for (let i = 0; i < n; i++) fn(); return Math.round((performance.now() - t0) / n * 1000 * 100) / 100; };
    const host = document.createElement('div');
    document.body.appendChild(host);
    const res = {
      appendChild_us: per(20000, () => { host.appendChild(document.createElement('span')); if (host.childElementCount > 500) host.textContent = ''; }),
      setTimeout_us: per(5000, () => clearTimeout(setTimeout(() => {}, 1000))),
      stringify_log_us: per(3000, () => JSON.stringify(logEvent())),
      parse_30kb_us: per(500, () => JSON.parse(parseSample)),
    };
    host.remove();
    return res;
  };
  window.__perfReady = true;
})();
</script>
</body></html>`;
}
