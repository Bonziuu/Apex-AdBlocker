// YouTube Playback Health: model tabId → frameId → raport i zasady agregacji.

import test from 'node:test';
import assert from 'node:assert/strict';
import { PlayerReportStore, PLAYER_REPORT_TTL_MS } from '../../youtube/player-reports.js';

const clock = (t = 1_000_000) => { const c = { t, now: () => c.t }; return c; };
const TOP = 0;
const IFRAME = 5;

test('TTL domyślnie ok. 60 s', () => {
  assert.equal(PLAYER_REPORT_TTL_MS, 60_000);
});

test('raport zawiera tabId, frameId, top/frame, typ strony, status, powody i czas', () => {
  const c = clock();
  const s = new PlayerReportStore({ now: c.now });
  const r = s.set(7, IFRAME, { status: 'degraded', reasons: ['spinner'], page: 'embed' });
  assert.deepEqual(r, { tabId: 7, frameId: IFRAME, frame: 'frame', page: 'embed', status: 'degraded', reasons: ['spinner'], at: c.t });
  assert.equal(s.set(7, TOP, { status: 'nonsense' }).status, 'unknown', 'nieznany status → unknown');
  assert.equal(s.set(7, TOP, { status: 'healthy' }).frame, 'top');
});

test('top healthy + iframe unknown ⇒ healthy', () => {
  const s = new PlayerReportStore({ now: clock().now });
  s.set(7, TOP, { status: 'healthy', page: 'watch' });
  s.set(7, IFRAME, { status: 'unknown', page: '' });
  const a = s.aggregate(7);
  assert.equal(a.status, 'healthy');
  assert.equal(a.source, 'top');
});

test('top healthy + iframe degraded ⇒ healthy (iframe nie nadpisuje top)', () => {
  const c = clock();
  const s = new PlayerReportStore({ now: c.now });
  s.set(7, TOP, { status: 'healthy', page: 'watch' });
  c.t += 1000; // iframe nowszy – nadal nie wygrywa
  s.set(7, IFRAME, { status: 'degraded', reasons: ['spinner'], page: 'embed' });
  assert.equal(s.aggregate(7).status, 'healthy');
});

test('top error + iframe healthy ⇒ error', () => {
  const c = clock();
  const s = new PlayerReportStore({ now: c.now });
  s.set(7, TOP, { status: 'error', reasons: ['brak postępu'], page: 'watch' });
  c.t += 1000;
  s.set(7, IFRAME, { status: 'healthy', page: 'embed' });
  const a = s.aggregate(7);
  assert.equal(a.status, 'error');
  assert.deepEqual(a.reasons, ['brak postępu']);
});

test('brak top + embed healthy ⇒ healthy (raport z iframe)', () => {
  const s = new PlayerReportStore({ now: clock().now });
  s.set(7, IFRAME, { status: 'healthy', page: 'embed' });
  s.set(7, 9, { status: 'unknown', page: '' }); // ramka bez odtwarzacza jest pomijana
  const a = s.aggregate(7);
  assert.equal(a.status, 'healthy');
  assert.equal(a.source, 'frame');
  assert.equal(a.frameId, IFRAME);
});

test('brak top, kilka odtwarzaczy w iframe ⇒ najpoważniejszy stan', () => {
  const s = new PlayerReportStore({ now: clock().now });
  s.set(7, 3, { status: 'healthy', page: 'embed' });
  s.set(7, 4, { status: 'degraded', page: 'embed' });
  assert.equal(s.aggregate(7).status, 'degraded');
});

test('raport starszy niż TTL ⇒ ignorowany i usuwany', () => {
  const c = clock();
  const s = new PlayerReportStore({ now: c.now });
  s.set(7, TOP, { status: 'error', page: 'watch' });
  c.t += PLAYER_REPORT_TTL_MS - 1;
  assert.equal(s.aggregate(7).status, 'error', 'jeszcze świeży');
  c.t += 2;
  assert.equal(s.aggregate(7), null);
  assert.equal(s.latest(), null);
  assert.equal(s.tabs.size, 0, 'usunięty z pamięci');
});

test('przeterminowany top nie blokuje świeżego iframe', () => {
  const c = clock();
  const s = new PlayerReportStore({ now: c.now });
  s.set(7, TOP, { status: 'error', page: 'watch' });
  c.t += PLAYER_REPORT_TTL_MS + 1;
  s.set(7, IFRAME, { status: 'healthy', page: 'embed' });
  assert.equal(s.aggregate(7).status, 'healthy');
});

test('nawigacja ramki głównej ⇒ poprzedni raport usunięty', () => {
  const s = new PlayerReportStore({ now: clock().now });
  s.set(7, TOP, { status: 'error', page: 'watch' });
  s.set(7, IFRAME, { status: 'degraded', page: 'embed' });
  s.set(8, TOP, { status: 'healthy', page: 'watch' });
  s.onMainFrameNavigation(7);
  assert.equal(s.aggregate(7), null);
  assert.equal(s.aggregate(8).status, 'healthy', 'inne karty bez zmian');
});

test('zamknięcie karty ⇒ raporty karty usunięte', () => {
  const s = new PlayerReportStore({ now: clock().now });
  s.set(7, TOP, { status: 'error', page: 'watch' });
  s.clearTab(7);
  assert.equal(s.aggregate(7), null);
  assert.equal(s.latest(), null);
});

test('latest(): najświeższy stan zagregowany spośród kart', () => {
  const c = clock();
  const s = new PlayerReportStore({ now: c.now });
  s.set(7, TOP, { status: 'error', page: 'watch' });
  c.t += 10;
  s.set(8, TOP, { status: 'healthy', page: 'shorts' });
  assert.equal(s.latest().tabId, 8);
});
