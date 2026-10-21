// Smoke test Chromium (tools/chromium-smoke.mjs): logika PASS / FAIL / SKIP bez przeglądarki.

import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSmoke, extractLoadErrors, syncFinished, SKIP_MESSAGE } from '../../tools/chromium-smoke.mjs';

const okHealth = () => ({
  sync: { rulesets: { status: 'ok', message: '' }, dynamicRules: { status: 'ok', message: '' }, scriptlets: { status: 'ok', message: '' } },
  components: Object.fromEntries(['network', 'cosmetic', 'scriptlets', 'filters', 'youtube'].map((c) => [c, { status: 'ok', detail: '' }])),
  errors: [],
});
const okInput = () => ({
  loadErrors: [],
  extension: { state: 'ENABLED', manifestErrors: [], runtimeErrors: [], installWarnings: [] },
  serviceWorkerUrl: 'chrome-extension://abc/background.js',
  health: okHealth(),
  error: null,
});

test('komunikat SKIP zgodny z wymaganiem', () => {
  assert.equal(SKIP_MESSAGE, 'SKIP: Chromium smoke test unavailable');
});

test('brak Playwright/Chromium ⇒ SKIP (check może przejść)', () => {
  const r = evaluateSmoke({ unavailable: 'Playwright nie jest zainstalowany' });
  assert.equal(r.status, 'SKIP');
  assert.deepEqual(r.reasons, ['Playwright nie jest zainstalowany']);
});

test('rozszerzenie załadowane, service worker, sync OK, brak ERROR ⇒ PASS', () => {
  assert.deepEqual(evaluateSmoke(okInput()), { status: 'PASS', reasons: [], notes: [] });
});

test('WARNING i wpisy dziennika to uwagi, nie FAIL', () => {
  const i = okInput();
  i.health.components.youtube = { status: 'warning', detail: 'znane braki' };
  i.health.errors = [{ component: 'cosmetic', message: 'x' }];
  i.extension.installWarnings = ['w'];
  const r = evaluateSmoke(i);
  assert.equal(r.status, 'PASS');
  assert.equal(r.notes.length, 3);
});

test('manifest odrzucony przez Chromium ⇒ FAIL z dokładnym komunikatem', () => {
  const r = evaluateSmoke({
    loadErrors: ['Failed to load extension from: /tmp/x. ads.json: Rule with id 4803 specifies an incorrect value for the "regexFilter" key.'],
    extension: null, serviceWorkerUrl: null, health: null, error: null,
  });
  assert.equal(r.status, 'FAIL');
  assert.match(r.reasons[0], /Rule with id 4803/);
  assert.ok(r.reasons.includes('brak service workera rozszerzenia'));
  assert.ok(r.reasons.includes('rozszerzenie nie jest widoczne w chrome://extensions'));
});

test('rozszerzenie wyłączone, błąd manifestu lub działania ⇒ FAIL', () => {
  for (const patch of [{ state: 'DISABLED' }, { manifestErrors: ['zły klucz'] }, { runtimeErrors: ['TypeError'] }]) {
    const i = okInput();
    Object.assign(i.extension, patch);
    assert.equal(evaluateSmoke(i).status, 'FAIL', JSON.stringify(patch));
  }
});

test('krytyczny ERROR w health po synchronizacji ⇒ FAIL', () => {
  const i = okInput();
  i.health.components.scriptlets = { status: 'error', detail: 'Invalid match pattern' };
  assert.match(evaluateSmoke(i).reasons.join(), /scriptlets: ERROR – Invalid match pattern/);
  const j = okInput();
  j.health.sync.rulesets = { status: 'error', message: 'rule count exceeded' };
  assert.equal(evaluateSmoke(j).status, 'FAIL');
});

test('synchronizacja niezakończona, brak odpowiedzi health lub wyjątek ⇒ FAIL', () => {
  const i = okInput();
  i.health.sync.scriptlets = { status: 'unknown', message: '' };
  assert.match(evaluateSmoke(i).reasons.join(), /nie zakończyła się/);
  assert.match(evaluateSmoke({ ...okInput(), health: null }).reasons.join(), /brak odpowiedzi health:get/);
  assert.equal(evaluateSmoke({ ...okInput(), error: 'Timeout' }).status, 'FAIL');
});

test('syncFinished i extractLoadErrors', () => {
  assert.equal(syncFinished(okHealth()), true);
  assert.equal(syncFinished(null), false);
  assert.equal(syncFinished({ sync: { rulesets: { status: 'ok' } } }), false);
  const lines = [
    '[1:1:WARNING:load_error_reporter.cc(72)] Extension error: Failed to load extension from: /tmp/e. Manifest file is missing or unreadable',
    '[1:1:ERROR:dbus/bus.cc:408] Failed to connect to the bus',
  ];
  assert.deepEqual(extractLoadErrors(lines), ['Failed to load extension from: /tmp/e. Manifest file is missing or unreadable']);
  assert.deepEqual(extractLoadErrors([]), []);
});
