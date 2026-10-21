// Pomiary scriptletów w service workerze: walidacja, agregacja, tabela „Najdroższe scriptlety”, reset.

import test from 'node:test';
import assert from 'node:assert/strict';
import { parseReport, ScriptletPerfStore, validLabel } from '../../background/scriptlet-perf.js';
import { loadBackground, sender } from '../helpers/chrome-mock.mjs';

const report = (rows) => JSON.stringify({ v: 1, rows });

test('parseReport: przyjmuje tylko znane scriptlety i liczby; odrzuca adresy, ID i treść', () => {
  const rows = parseReport(report([
    ['trusted-edit-inbound-object · JSON.stringify', 10, 5.5, 1.2],
    ['adjust-setTimeout · setTimeout', 3, 0.3, 0.2],
    ['json-prune-fetch-response · fetch:response', 1, 2, 2],
    ['trusted-edit-inbound-object · https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 1, 1],
    ['dQw4w9WgXcQ · fetch', 1, 1, 1],
    ['nieznany-scriptlet · fetch', 1, 1, 1],
    ['json-prune · JSON.parse {"adPlacements":1}', 1, 1, 1],
    ['json-prune · JSON.parse', -1, 1, 1],
    ['json-prune · JSON.parse', 1, Infinity, 1],
    ['json-prune · JSON.parse', 0, 1, 1],
    ['json-prune · JSON.parse', 1.5, 1, 1],
    'zły wiersz',
  ]));
  assert.deepEqual(rows.map((r) => r[0]), [
    'trusted-edit-inbound-object · JSON.stringify', 'adjust-setTimeout · setTimeout', 'json-prune-fetch-response · fetch:response',
  ]);
  assert.deepEqual(parseReport('nie json'), []);
  assert.deepEqual(parseReport(JSON.stringify({ v: 2, rows: [] })), []);
  assert.deepEqual(parseReport({ v: 1 }), []);
  assert.equal(parseReport(report([['json-prune · JSON.parse', 1, 1, 5]]))[0][3], 1, 'max ≤ łączny');
  assert.equal(validLabel('trusted-prevent-dom-bypass · Node.prototype.appendChild'), true);
});

test('ScriptletPerfStore: liczba wywołań, łączny, średni i maks. czas; sortowanie po łącznym czasie', () => {
  const s = new ScriptletPerfStore();
  s.add([['json-prune · JSON.parse', 4, 2, 1], ['trusted-edit-inbound-object · JSON.stringify', 10, 30, 9]]);
  s.add([['json-prune · JSON.parse', 6, 3, 2.5], ['adjust-setTimeout · setTimeout', 100, 1, 0.1]]);
  assert.deepEqual(s.rows(), [
    { scriptlet: 'trusted-edit-inbound-object', target: 'JSON.stringify', calls: 10, totalMs: 30, avgMs: 3, maxMs: 9 },
    { scriptlet: 'json-prune', target: 'JSON.parse', calls: 10, totalMs: 5, avgMs: 0.5, maxMs: 2.5 },
    { scriptlet: 'adjust-setTimeout', target: 'setTimeout', calls: 100, totalMs: 1, avgMs: 0.01, maxMs: 0.1 },
  ]);
  assert.equal(s.rows(1).length, 1);
  const copy = new ScriptletPerfStore();
  copy.load(JSON.parse(JSON.stringify(s.toJSON())));
  assert.deepEqual(copy.rows(), s.rows(), 'zapis/odczyt (storage.session)');
  s.reset();
  assert.deepEqual(s.rows(), []);
});

test('service worker: pomiary domyślnie wyłączone – scriptlety bez pliku-flagi, raporty ignorowane', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    assert.ok(bg.state.registered.length > 0);
    for (const r of bg.state.registered.filter((x) => x.id.startsWith('sl-'))) assert.equal(r.js.length, 1, r.id);
    const r = await bg.send({ type: 'perf:scriptlets', data: report([['json-prune · JSON.parse', 1, 1, 1]]) }, sender('https://www.youtube.com/'));
    assert.equal(r.accepted, 0);
    assert.deepEqual((await bg.send({ type: 'health:get' })).scriptletPerf, []);
  } finally { bg.restore(); }
});

test('service worker: włączenie pomiarów → plik-flaga przed każdym plikiem scriptletów; tabela, reset, wyłączenie', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    assert.deepEqual(await bg.send({ type: 'options:setDevPerf', enabled: true }), { ok: true });
    const sl = bg.state.registered.filter((x) => x.id.startsWith('sl-'));
    assert.ok(sl.length > 0);
    for (const r of sl) {
      assert.equal(r.js[0], 'content/scriptlet-perf-on.js', r.id);
      assert.equal(r.js.length, 2);
      assert.equal(r.world, 'MAIN');
    }
    const yt = sender('https://www.youtube.com/watch?v=SECRETVID01');
    await bg.send({ type: 'perf:scriptlets', data: report([['trusted-edit-inbound-object · JSON.stringify', 5, 10, 4], ['json-prune · JSON.parse', 5, 1, 0.5]]) }, yt);
    await bg.send({ type: 'perf:scriptlets', data: report([['trusted-edit-inbound-object · JSON.stringify', 5, 10, 6]]) }, yt);
    const h = await bg.send({ type: 'health:get' });
    assert.deepEqual(h.scriptletPerf[0], { scriptlet: 'trusted-edit-inbound-object', target: 'JSON.stringify', calls: 10, totalMs: 20, avgMs: 2, maxMs: 6 });
    assert.equal(h.scriptletPerf[1].scriptlet, 'json-prune');
    assert.ok(!JSON.stringify(h.scriptletPerf).includes('SECRETVID01'), 'bez adresu karty');
    await new Promise((r) => setTimeout(r, 1100));
    assert.ok(bg.session.scriptletPerf, 'zapis w chrome.storage.session');

    assert.deepEqual(await bg.send({ type: 'perf:reset' }), { ok: true });
    assert.deepEqual((await bg.send({ type: 'health:get' })).scriptletPerf, []);
    assert.equal(bg.session.scriptletPerf, undefined);

    await bg.send({ type: 'perf:scriptlets', data: report([['json-prune · JSON.parse', 1, 1, 1]]) }, yt);
    await bg.send({ type: 'options:setDevPerf', enabled: false });
    for (const r of bg.state.registered.filter((x) => x.id.startsWith('sl-'))) assert.equal(r.js.length, 1, 'po wyłączeniu bez pliku-flagi');
    const off = await bg.send({ type: 'health:get' });
    assert.equal(off.devPerf, false);
    assert.deepEqual(off.scriptletPerf, []);
  } finally { bg.restore(); }
});
