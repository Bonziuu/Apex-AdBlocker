// YouTube Playback Health: klasyfikacja stanu odtwarzacza (healthy/degraded/error/unknown)
// oraz ocena YouTube Protection w service workerze.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { ROOT } from '../../tools/lists-config.mjs';
import { evaluateYouTubeProtection, coversYouTube } from '../../youtube/protection.js';

function loadHealth() {
  const ctx = { __chromeblockTest: {} };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'youtube', 'health.js'), 'utf8'), ctx);
  return ctx.__chromeblockTest.youtubeHealth;
}
const H = loadHealth();
const base = { kind: 'watch', elapsedMs: 5000, hasPlayer: true, hasVideo: true, videoError: 0, errorVisible: false, spinnerMs: 0, readyState: 4, paused: false, advanced: true };

test('rodzaj strony: watch, shorts, embed, live; inne → brak odtwarzacza', () => {
  assert.equal(H.pageKind({ pathname: '/watch' }), 'watch');
  assert.equal(H.pageKind({ pathname: '/shorts/abc' }), 'shorts');
  assert.equal(H.pageKind({ pathname: '/embed/abc' }), 'embed');
  assert.equal(H.pageKind({ pathname: '/live/abc' }), 'live');
  assert.equal(H.pageKind({ pathname: '/' }), '');
  assert.equal(H.pageKind({ pathname: '/results' }), '');
});

test('healthy: video gotowe lub odtwarzanie postępuje', () => {
  assert.equal(H.classify(base).status, 'healthy');
  assert.equal(H.classify({ ...base, readyState: 1, paused: true, advanced: false }).status, 'healthy', 'zatrzymany, ale gotowy do startu');
});

test('error: błąd elementu video albo widoczny komunikat błędu odtwarzacza', () => {
  assert.equal(H.classify({ ...base, videoError: 4 }).status, 'error');
  assert.equal(H.classify({ ...base, errorVisible: true }).status, 'error');
});

test('degraded: długi spinner, brak movie_player, odtwarzacz bez video', () => {
  assert.equal(H.classify({ ...base, spinnerMs: 16000, readyState: 1, advanced: false }).status, 'degraded');
  assert.equal(H.classify({ ...base, hasPlayer: false, hasVideo: false, elapsedMs: 12000 }).status, 'degraded');
  assert.equal(H.classify({ ...base, hasVideo: false, elapsedMs: 25000 }).status, 'degraded');
});

test('unknown: brak odtwarzacza na stronie, trwa ładowanie, osadzony odtwarzacz przed kliknięciem', () => {
  assert.equal(H.classify({ ...base, kind: '' }).status, 'unknown');
  assert.equal(H.classify({ ...base, hasPlayer: false, hasVideo: false, elapsedMs: 2000 }).status, 'unknown');
  assert.equal(H.classify({ ...base, kind: 'embed', hasVideo: false, elapsedMs: 60000 }).status, 'unknown');
});

test('YouTube Protection: wszystko działa → ok', () => {
  const r = evaluateYouTubeProtection({
    siteDisabled: false, adsEnabled: true,
    compat: { total: 30, supported: 30, partial: 0, unsupported: 0, knownGaps: [], newGaps: [] },
    expectedScripts: ['sl-ads-3'], registeredScripts: ['sl-ads-3', 'sl-ads-4'], player: { status: 'healthy', reasons: [] },
  });
  assert.equal(r.status, 'ok');
});

test('YouTube Protection: znane braki → warning; brak rejestracji scriptletów → error', () => {
  const compat = { total: 30, supported: 28, partial: 1, unsupported: 1, knownGaps: [{}, {}], newGaps: [] };
  assert.equal(evaluateYouTubeProtection({ adsEnabled: true, compat, expectedScripts: ['a'], registeredScripts: ['a'] }).status, 'warning');
  const r = evaluateYouTubeProtection({ adsEnabled: true, compat: { ...compat, partial: 0, unsupported: 0, supported: 30 }, expectedScripts: ['a', 'b'], registeredScripts: ['a'] });
  assert.equal(r.status, 'error');
  assert.match(r.checks.find((c) => c.id === 'scriptlets').message, /b/);
});

test('YouTube Protection: lista Reklamy wyłączona → error; ochrona wyłączona na stronie → disabled', () => {
  const compat = { total: 1, supported: 1, partial: 0, unsupported: 0, knownGaps: [], newGaps: [] };
  assert.equal(evaluateYouTubeProtection({ adsEnabled: false, compat, expectedScripts: [], registeredScripts: [] }).status, 'error');
  assert.equal(evaluateYouTubeProtection({ siteDisabled: true }).status, 'disabled');
});

test('YouTube Protection: problem odtwarzacza obniża status do warning', () => {
  const compat = { total: 1, supported: 1, partial: 0, unsupported: 0, knownGaps: [], newGaps: [] };
  const r = evaluateYouTubeProtection({ adsEnabled: true, compat, expectedScripts: ['a'], registeredScripts: ['a'], player: { status: 'error', reasons: ['x'] } });
  assert.equal(r.status, 'warning');
});

test('wzorce plików scriptletów obejmujące YouTube', () => {
  assert.equal(coversYouTube(['*://*.www.youtube.com/*']), true);
  assert.equal(coversYouTube(['*://*.example.com/*']), false);
  // w aktualnym buildzie co najmniej jeden plik scriptletów listy "ads" obejmuje YouTube
  const files = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'ads.scriptlets.json'), 'utf8'));
  assert.ok(files.some((f) => coversYouTube(f.matches)));
});
