// YouTube Playback Health po zmianie adresu SPA: service worker najpierw usuwa raport starego
// filmu, potem prosi youtube/health.js o ponowny raport – także przy identycznym stanie odtwarzacza.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { loadBackground, sender } from '../helpers/chrome-mock.mjs';
import { ROOT } from '../../tools/lists-config.mjs';
import { PlayerReportStore, PLAYER_REPORT_TTL_MS } from '../../youtube/player-reports.js';

const REFRESH = { type: 'youtube:health-refresh' };
const pageOf = (url) => {
  const p = new URL(url).pathname;
  return p.startsWith('/watch') ? 'watch' : p.startsWith('/shorts/') ? 'shorts' : '';
};

/**
 * Tło, w którym „skrypt treści” odpowiada na prośbę o raport tak jak youtube/health.js:
 * wysyła youtube:health dla aktualnego adresu karty (ten sam status co poprzednio).
 */
async function backgroundWithContentScript(currentUrl) {
  let bg = null;
  const ctx = { url: currentUrl };
  bg = await loadBackground({
    tabSendMessage: (tabId, msg) => {
      if (msg.type !== REFRESH.type) return Promise.resolve();
      return new Promise((resolve) => bg.state.listeners.message(
        { type: 'youtube:health', status: 'healthy', reasons: [], page: pageOf(ctx.url) },
        { tab: { id: tabId, url: ctx.url }, frameId: 0, url: ctx.url },
        resolve,
      ));
    },
  });
  return { bg, ctx };
}

const navigate = async (bg, ctx, tabId, url) => {
  ctx.url = url;
  bg.state.listeners.tabUpdated(tabId, { url }, { id: tabId, url });
  await new Promise((r) => setTimeout(r, 20));
};

test('watch A → watch B (identyczny stan odtwarzacza): stary raport usunięty, przychodzi świeży raport B', async () => {
  const { bg, ctx } = await backgroundWithContentScript('https://www.youtube.com/watch?v=A');
  try {
    await bg.install();
    await bg.send({ type: 'youtube:health', status: 'healthy', reasons: [], page: 'watch' }, sender('https://www.youtube.com/watch?v=A'));
    const before = (await bg.send({ type: 'health:get' })).youtube.player;
    await new Promise((r) => setTimeout(r, 5));
    await navigate(bg, ctx, 7, 'https://www.youtube.com/watch?v=B');
    assert.deepEqual(bg.state.tabMessages, [{ tabId: 7, msg: REFRESH }], 'jedna prośba do karty 7');
    const after = (await bg.send({ type: 'health:get' })).youtube.player;
    assert.ok(after, 'jest raport po zmianie URL (prośba wysłana PO wyczyszczeniu – inaczej zostałby skasowany)');
    assert.equal(after.page, 'watch');
    assert.ok(after.at > before.at, 'raport jest świeży (nowy), nie stary raport A');
  } finally { bg.restore(); }
});

test('watch → Shorts i Shorts → watch: prośba o raport i nowy raport z właściwym typem strony', async () => {
  const { bg, ctx } = await backgroundWithContentScript('https://www.youtube.com/watch?v=A');
  try {
    await bg.install();
    await bg.send({ type: 'youtube:health', status: 'error', reasons: ['stary'], page: 'watch' }, sender('https://www.youtube.com/watch?v=A'));
    await navigate(bg, ctx, 7, 'https://www.youtube.com/shorts/S');
    let p = (await bg.send({ type: 'health:get' })).youtube.player;
    assert.equal(p.page, 'shorts');
    assert.equal(p.status, 'healthy', 'błąd starego filmu nie został');
    await navigate(bg, ctx, 7, 'https://www.youtube.com/watch?v=W');
    p = (await bg.send({ type: 'health:get' })).youtube.player;
    assert.equal(p.page, 'watch');
    assert.equal(bg.state.tabMessages.length, 2);
  } finally { bg.restore(); }
});

test('raport innej karty pozostaje; prośba trafia tylko do karty, która zmieniła adres', async () => {
  const { bg, ctx } = await backgroundWithContentScript('https://www.youtube.com/watch?v=Z');
  try {
    await bg.install();
    await bg.send({ type: 'youtube:health', status: 'degraded', reasons: ['x'], page: 'watch' }, { tab: { id: 9, url: 'https://www.youtube.com/watch?v=X' }, frameId: 0, url: 'https://www.youtube.com/watch?v=X' });
    await navigate(bg, ctx, 7, 'https://www.youtube.com/watch?v=Z');
    assert.deepEqual(bg.state.tabMessages.map((m) => m.tabId), [7]);
    // karta 9 nadal ma swój raport (latest() wybiera najświeższy – sprawdzamy przez zamknięcie karty 7)
    bg.state.listeners.tabRemoved(7);
    const p = (await bg.send({ type: 'health:get' })).youtube.player;
    assert.equal(p.status, 'degraded', 'raport karty 9 pozostał');
  } finally { bg.restore(); }
});

test('zwykła strona nie dostaje prośby o raport YouTube; zdarzenia bez url też nie', async () => {
  const { bg, ctx } = await backgroundWithContentScript('https://news.example/');
  try {
    await bg.install();
    await navigate(bg, ctx, 7, 'https://news.example/a');
    await navigate(bg, ctx, 7, 'https://notyoutube.com/watch?v=A');
    bg.state.listeners.tabUpdated(7, { status: 'complete' }, { id: 7 });
    bg.state.listeners.tabUpdated(7, { title: 'YouTube' }, { id: 7 });
    assert.deepEqual(bg.state.tabMessages, []);
    // m.youtube.com i youtube-nocookie.com są YouTube
    await navigate(bg, ctx, 7, 'https://m.youtube.com/watch?v=A');
    await navigate(bg, ctx, 7, 'https://www.youtube-nocookie.com/embed/A');
    assert.equal(bg.state.tabMessages.length, 2);
  } finally { bg.restore(); }
});

test('brak skryptu treści: odrzucona obietnica i wyjątek sendMessage są ignorowane', async () => {
  for (const tabSendMessage of [
    () => Promise.reject(new Error('Could not establish connection. Receiving end does not exist.')),
    () => { throw new Error('No tab with id: 7.'); },
  ]) {
    const bg = await loadBackground({ tabSendMessage });
    const unhandled = [];
    const onUnhandled = (e) => unhandled.push(e);
    process.on('unhandledRejection', onUnhandled);
    try {
      await bg.install();
      await bg.send({ type: 'youtube:health', status: 'error', reasons: ['x'], page: 'watch' }, sender('https://www.youtube.com/watch?v=A'));
      assert.doesNotThrow(() => bg.state.listeners.tabUpdated(7, { url: 'https://www.youtube.com/watch?v=B' }, { id: 7 }));
      await new Promise((r) => setTimeout(r, 30));
      assert.deepEqual(unhandled, [], 'bez nieobsłużonych błędów');
      assert.ok(!(await bg.send({ type: 'health:get' })).youtube.player, 'stary raport i tak usunięty');
      const snap = await bg.send({ type: 'health:get' });
      assert.ok(!snap.errors.some((e) => /Receiving end|No tab/.test(e.message)), 'bez wpisu w dzienniku błędów');
    } finally {
      process.off('unhandledRejection', onUnhandled);
      bg.restore();
    }
  }
});

// --- youtube/health.js: obsługa prośby o ponowny raport -------------------------------------

function loadContentScript(pathname, options = {}) {
  const sent = [];
  const listeners = [];
  let intervalFn = null;
  const player = options.player || { querySelector: () => null };
  const ctx = {
    window: {},
    location: { pathname, search: options.search || '' },
    document: {
      visibilityState: 'visible',
      getElementById: (id) => (id === 'movie_player' ? player : null),
      querySelector: () => null,
    },
    chrome: {
      runtime: {
        sendMessage: (m) => { sent.push(m); return options.sendMessage ? options.sendMessage(m) : Promise.resolve(); },
        onMessage: { addListener: (fn) => listeners.push(fn) },
      },
    },
    setInterval: (fn) => { intervalFn = fn; return 1; },
    Date: options.now ? { now: options.now } : Date,
  };
  ctx.window.top = ctx.window;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  // w skrypcie `window === window.top` i `window.__…` odnoszą się do ctx.window
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'youtube', 'health.js'), 'utf8'), ctx);
  return { sent, listeners, interval: () => intervalFn(), ctx };
}

test('youtube/health.js: prośba o raport wysyła aktualny stan ponownie, nawet bez zmiany stanu', () => {
  const cs = loadContentScript('/watch');
  assert.equal(cs.sent.length, 1, 'pierwszy raport po starcie');
  cs.interval();
  assert.equal(cs.sent.length, 1, 'bez zmiany stanu – zwykły tick nic nie wysyła');
  assert.equal(cs.listeners.length, 1, 'nasłuch prośby o raport');
  cs.listeners[0]({ type: 'youtube:health-refresh' }, {}, () => {});
  assert.equal(cs.sent.length, 2, 'prośba → ponowny raport');
  assert.deepEqual(JSON.parse(JSON.stringify(cs.sent[1])), JSON.parse(JSON.stringify(cs.sent[0])), 'ten sam pomiar (istniejąca logika)');
  assert.equal(cs.sent[1].type, 'youtube:health');
  cs.interval();
  assert.equal(cs.sent.length, 2, 'po raporcie znów tylko przy zmianie stanu');
  // inne wiadomości są ignorowane
  cs.listeners[0]({ type: 'cosmetic:init' }, {}, () => {});
  cs.listeners[0](null, {}, () => {});
  assert.equal(cs.sent.length, 2);
  // Shorts: typ strony z aktualnego adresu
  cs.ctx.location.pathname = '/shorts/abc';
  cs.listeners[0]({ type: 'youtube:health-refresh' }, {}, () => {});
  assert.equal(cs.sent.at(-1).page, 'shorts');
});

test('youtube/health.js: niewidoczna karta nie raportuje także po prośbie (bez zmian zachowania)', () => {
  const cs = loadContentScript('/watch');
  cs.ctx.document.visibilityState = 'hidden';
  cs.listeners[0]({ type: 'youtube:health-refresh' }, {}, () => {});
  assert.equal(cs.sent.length, 1);
});

test('heartbeat zachowuje stabilny raport ponad TTL i odtwarza go po restarcie workera', () => {
  for (const error of [null, { code: 4 }]) {
    let now = 1_000_000;
    let store = new PlayerReportStore({ now: () => now });
    const video = { currentTime: 0, readyState: 4, paused: false, error };
    const cs = loadContentScript('/watch', {
      now: () => now,
      player: { querySelector: (s) => s === 'video' ? video : null },
      sendMessage: (msg) => { store.set(7, 0, msg); return Promise.resolve(); },
    });
    const expected = error ? 'error' : 'healthy';
    for (let elapsed = 3000; elapsed <= PLAYER_REPORT_TTL_MS * 2; elapsed += 3000) {
      now += 3000;
      video.currentTime += 3;
      cs.interval();
      assert.equal(store.latest()?.status, expected, `raport nadal świeży po ${elapsed} ms`);
    }
    assert.ok(cs.sent.length >= 4, 'stabilny stan wysyła heartbeat');
    assert.ok(cs.sent.length <= 6, 'heartbeat nie wybudza workera co każde 3 s');

    store = new PlayerReportStore({ now: () => now }); // nowy worker: pusta pamięć
    assert.equal(store.latest(), null);
    for (let elapsed = 0; elapsed < 30_000; elapsed += 3000) { now += 3000; cs.interval(); }
    assert.equal(store.latest()?.status, expected, 'heartbeat odtwarza niezmieniony raport');
  }
});

test('po ukryciu dłuższym niż TTL widoczna karta natychmiast odnawia raport', () => {
  let now = 1_000_000;
  const cs = loadContentScript('/embed/x', { now: () => now });
  cs.ctx.document.visibilityState = 'hidden';
  now += PLAYER_REPORT_TTL_MS * 2;
  cs.interval();
  assert.equal(cs.sent.length, 1);
  cs.ctx.document.visibilityState = 'visible';
  cs.interval();
  assert.equal(cs.sent.length, 2);
});

test('watch A → watch B resetuje okres uruchamiania także przy tej samej ścieżce', () => {
  let now = 1_000_000;
  const cs = loadContentScript('/watch', { now: () => now, search: '?v=A' });
  now += 60_000;
  cs.interval();
  assert.equal(cs.sent.at(-1).status, 'degraded', 'stary odtwarzacz nadal bez video');
  cs.ctx.location.search = '?v=B';
  cs.listeners[0](REFRESH);
  assert.equal(cs.sent.at(-1).status, 'unknown', 'nowy film ma własny okres uruchamiania');
  now += 21_000;
  cs.interval();
  assert.equal(cs.sent.at(-1).status, 'degraded', 'brak video wykrywany po nowym okresie uruchamiania');
});

test('odrzucony raport jest ponawiany przy kolejnym ticku zamiast czekać na zmianę stanu', async () => {
  let attempts = 0;
  const cs = loadContentScript('/embed/x', {
    sendMessage: () => ++attempts === 1 ? Promise.reject(new Error('worker unavailable')) : Promise.resolve(),
  });
  await Promise.resolve();
  cs.interval();
  assert.equal(cs.sent.length, 2);
  await Promise.resolve();
  cs.interval();
  assert.equal(cs.sent.length, 2, 'udany raport znowu podlega deduplikacji');
});
