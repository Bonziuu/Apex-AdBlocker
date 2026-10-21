// Stan zdrowia silników: zapis wyników synchronizacji i dziennik błędów.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHealth, runSyncSteps, componentStatusFromSync, emptyHealth, MAX_ERRORS } from '../../background/health.js';

const memoryStore = () => { const m = {}; return { m, get: async (k) => m[k], set: async (k, v) => { m[k] = v; } }; };

test('runSyncSteps: każdy krok ma wynik OK/ERROR z czasem; błąd trafia do dziennika', async () => {
  const store = memoryStore();
  const h = createHealth(store, { now: () => 1000, log: () => {} });
  const res = await runSyncSteps({
    rulesets: async () => 'ok',
    dynamicRules: async () => { throw new Error('limit reguł'); },
    scriptlets: async () => 'zarejestrowano 3',
  }, h);
  assert.deepEqual(res.dynamicRules, { ok: false, message: 'limit reguł' });
  const snap = await h.snapshot();
  assert.deepEqual(snap.sync.rulesets, { status: 'ok', at: 1000, message: 'ok' });
  assert.equal(snap.sync.dynamicRules.status, 'error');
  assert.deepEqual(snap.errors, [{ timestamp: 1000, component: 'network', message: 'dynamicRules: limit reguł' }]);
  await h.flush();
  assert.ok(store.m.health, 'zapisane lokalnie');
});

test('componentStatusFromSync: błąd dowolnego kroku sieciowego → network error', () => {
  const c = componentStatusFromSync({ rulesets: { ok: true, message: '' }, dynamicRules: { ok: false, message: 'x' }, scriptlets: { ok: true, message: '' } });
  assert.equal(c.network.status, 'error');
  assert.equal(c.scriptlets.status, 'ok');
});

test('dziennik błędów jest ograniczony i trwały między restartami service workera', async () => {
  const store = memoryStore();
  const h = createHealth(store, { log: () => {} });
  for (let i = 0; i < MAX_ERRORS + 10; i++) await h.error('cosmetic', `e${i}`);
  await h.flush();
  const h2 = createHealth(store, { log: () => {} });
  const snap = await h2.snapshot();
  assert.equal(snap.errors.length, MAX_ERRORS);
  assert.equal(snap.errors.at(-1).message, `e${MAX_ERRORS + 9}`);
  await h2.clearErrors();
  assert.equal((await h2.snapshot()).errors.length, 0);
});

test('stan początkowy: wszystkie komponenty "unknown"', () => {
  const e = emptyHealth();
  assert.deepEqual(Object.keys(e.components), ['network', 'cosmetic', 'scriptlets', 'filters', 'youtube']);
  assert.ok(Object.values(e.components).every((c) => c.status === 'unknown'));
});
