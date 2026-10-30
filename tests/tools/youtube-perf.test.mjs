// Narzędzie pomiaru wydajności YouTube: przypisanie czasu profilu CPU do komponentów.

import test from 'node:test';
import assert from 'node:assert/strict';
import { attributeProfile, waitForProtectionReady } from '../../tools/perf/youtube-perf.mjs';
import { fixtureHtml, playerResponse } from '../../tools/perf/youtube-fixture.mjs';

const EXT = 'chrome-extension://abcdefghijklmnop';
const node = (id, url, functionName, children = [], lineNumber = 0) => ({ id, callFrame: { url, functionName, lineNumber }, children });
const health = () => ({
  sync: Object.fromEntries(['rulesets', 'dynamicRules', 'scriptlets'].map((k) => [k, { status: 'ok' }])),
  components: Object.fromEntries(['network', 'cosmetic', 'scriptlets', 'filters', 'youtube'].map((k) => [k, { status: 'ok' }])),
});

test('benchmark czeka na gotową ochronę; błąd synchronizacji lub komponentu unieważnia pomiar', async () => {
  let now = 0;
  const ready = health();
  const pending = health();
  pending.sync.scriptlets.status = 'unknown';
  const queue = [pending, ready];
  const options = { evaluate: async () => queue.shift(), waitForTimeout: async (ms) => { now += ms; } };
  assert.equal(await waitForProtectionReady(options, { now: () => now }), ready);
  assert.equal(now, 2000);
  const broken = health();
  broken.sync.scriptlets = { status: 'error', message: 'registration failed' };
  await assert.rejects(waitForProtectionReady({ evaluate: async () => broken }), /Benchmark invalid.*registration failed/);
  const componentError = health();
  componentError.components.scriptlets = { status: 'error', detail: 'missing scripts' };
  await assert.rejects(waitForProtectionReady({ evaluate: async () => componentError }), /Benchmark invalid.*missing scripts/);
});

test('benchmark nie mierzy rozszerzenia po timeout ani bez gotowych komponentów', async () => {
  for (const snapshot of [null, health()]) {
    if (snapshot) snapshot.components.youtube.status = 'unknown';
    let now = 0;
    const options = { evaluate: async () => snapshot, waitForTimeout: async (ms) => { now += ms; } };
    await assert.rejects(waitForProtectionReady(options, { timeoutMs: 2500, now: () => now }), /Benchmark invalid.*timeout/);
    assert.equal(now, 2500);
  }
});

test('attributeProfile: natywne wywołania dziedziczą właściciela; powrót do kodu strony zmienia właściciela', () => {
  const profile = {
    nodes: [
      node(1, '', '(root)', [2, 7, 8]),
      node(2, 'https://www.youtube.com/s/app.js', 'render', [3]),
      node(3, `${EXT}/scriptlets/ads-3.js`, 'apply', [4, 5], 490),
      node(4, '', 'stringify'),                         // natywne pod scriptletem → scriptlety
      node(5, 'https://www.youtube.com/s/app.js', 'cb', [6]), // callback strony → strona
      node(6, '', 'appendChild'),                       // natywne pod stroną → strona
      node(7, `${EXT}/content/cosmetic.js`, 'apply', []),
      node(8, '', '(idle)'),
    ],
    samples: [2, 3, 4, 4, 5, 6, 7, 8],
    timeDeltas: [1000, 1000, 1000, 1000, 1000, 1000, 2000, 5000],
  };
  const { totals, top } = attributeProfile(profile);
  assert.equal(totals.page, 3);
  assert.equal(totals.scriptlets, 3);
  assert.equal(totals.cosmetic, 2);
  assert.equal(totals.idle, 5);
  assert.ok(top.some((t) => t.fn === 'scriptlets→native stringify' && t.ms === 2));
  assert.ok(top.some((t) => t.fn.startsWith('scriptlets:ads-3.js:491 apply')));
});

test('fixture: strona bez treści YouTube, z obciążeniem i polami reklam w odpowiedzi', () => {
  const html = fixtureHtml();
  assert.match(html, /window\.__runWorkload/);
  assert.match(html, /id="movie_player"/);
  const r = playerResponse(50);
  assert.ok(Array.isArray(r.adPlacements) && r.adPlacements.length > 0);
  assert.ok(JSON.stringify(r).length >= 50 * 1024);
});
