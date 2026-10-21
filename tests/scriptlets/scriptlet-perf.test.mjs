// Profiler scriptletów (tools/scriptlets-lib.js): domyślnie wyłączony, bez wpływu na działanie filtrów,
// bez adresów i treści w danych; czas własny ChromeBlock bez czasu oryginalnej funkcji strony.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createEnv, runScriptlets, run, tick } from '../helpers/scriptlet-env.mjs';
import { allLines, scriptletCallFromLine } from '../helpers/lists.mjs';
import { LABEL_RE, parseReport } from '../../background/scriptlet-perf.js';

/** Obsługiwane scriptlety dla youtube.com / www.youtube.com z prawdziwych list. */
const ytCalls = () => allLines()
  .filter((l) => /^(?:[^#]*,)?(?:www\.)?youtube\.com(?:,[^#]*)?##\+js\(/.test(l.line))
  .map((l) => { try { return scriptletCallFromLine(l); } catch { return null; } })
  .filter(Boolean)
  .filter((c) => !['trusted-click-element', 'remove-node-text', 'trusted-replace-node-text'].includes(c[0]));

/**
 * Środowisko z kontrolowanym zegarem: performance.now() zwraca __clock; natywne appendChild
 * i JSON.parse „trwają” 100 ms (przesuwają zegar), kod ChromeBlock – 0 ms.
 */
function env({ profiler }) {
  const ctx = createEnv('www.youtube.com');
  run(ctx, `
    globalThis.__clock = 0; globalThis.__nowCalls = 0; globalThis.__events = [];
    globalThis.performance = { now() { __nowCalls++; return __clock; } };
    globalThis.CustomEvent = class CustomEvent { constructor(type, init) { this.type = type; this.detail = init && init.detail; } };
    document.addEventListener('chromeblock:scriptlet-perf', (e) => __events.push(e.detail));
    const nativeAppend = Node.prototype.appendChild;
    Node.prototype.appendChild = function appendChild(c) { __clock += 100; return nativeAppend.call(this, c); };
    const np = JSON.parse;
    JSON.parse = function parse(...a) { __clock += 100; return np.apply(this, a); };
    Date.now = () => 1700000000000;
    globalThis.fetch = async (url) => new Response(JSON.stringify({ adPlacements: [1], adSlots: [2], videoDetails: { videoId: 'dQw4w9WgXcQ' } }));
    ${profiler ? "Object.defineProperty(globalThis, Symbol.for('chromeblock.scriptletPerf'), { value: true });" : ''}
  `);
  runScriptlets(ctx, ytCalls());
  return ctx;
}

const workload = `(() => {
  const host = new HTMLElement('DIV');
  for (let i = 0; i < 10; i++) host.appendChild(new HTMLElement('SPAN'));
  const a = JSON.stringify({ attestationRequest: {}, context: { client: { clientName: 'WEB', userAgent: 'Mozilla channel lactmilli' } },
    playbackContext: { contentPlaybackContext: { referer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } } });
  const b = JSON.stringify({ context: { client: { clientName: 'WEB' } }, list: [1, 2] });
  const c = JSON.stringify(JSON.parse('{"entries":[{"command":{"reelWatchEndpoint":{"adClientParams":{"isAd":true}}}}],"x":1}'));
  return [a, b, c];
})()`;

const flushEvents = (ctx) => { run(ctx, `__fire(window, 'pagehide')`); return run(ctx, '__events.slice()'); };

test('profiler wyłączony (domyślnie): brak pomiarów, brak zdarzeń, ani jednego wywołania performance.now()', async () => {
  const ctx = env({ profiler: false });
  run(ctx, workload);
  await run(ctx, `fetch('https://www.youtube.com/youtubei/v1/player?key=1').then((r) => r.json())`);
  await tick(5);
  assert.equal(run(ctx, '__nowCalls'), 0, 'zero narzutu pomiarowego');
  assert.deepEqual([...flushEvents(ctx)], []);
});

test('profiler nie zmienia działania filtrów: identyczne wyniki z pomiarami i bez', async () => {
  const off = env({ profiler: false });
  const on = env({ profiler: true });
  assert.deepEqual([...run(on, workload)], [...run(off, workload)]);
  const fetchOut = (ctx) => run(ctx, `fetch('https://www.youtube.com/youtubei/v1/player?key=1').then((r) => r.text())`);
  assert.equal(await fetchOut(on), await fetchOut(off));
  assert.ok(!(await fetchOut(on)).includes('adPlacements'), 'reklamy nadal usuwane');
});

test('profiler włączony: liczba wywołań, łączny/średni/maks. czas dla każdego typu scriptletu', async () => {
  const ctx = env({ profiler: true });
  run(ctx, workload);
  await run(ctx, `fetch('https://www.youtube.com/youtubei/v1/player?key=1').then((r) => r.json())`);
  await tick(5);
  const events = flushEvents(ctx);
  assert.equal(events.length, 1);
  const rows = parseReport(events[0]);
  assert.ok(rows.length >= 4);
  const by = Object.fromEntries(rows.map(([label, count, total, max]) => [label, { count, total, max }]));
  // 3 filtry trusted-prevent-dom-bypass × 10 wywołań; czas natywnego appendChild (100 ms) NIE jest liczony
  const dom = by['trusted-prevent-dom-bypass · Node.prototype.appendChild'];
  assert.equal(dom.count, 30);
  assert.equal(dom.total, 0, 'czas oryginalnej funkcji strony jest odejmowany');
  assert.ok(by['trusted-edit-inbound-object · JSON.stringify'].count >= 6 * 3, 'każdy z filtrów edit-inbound liczony osobno');
  assert.ok(by['json-prune · JSON.parse'].count >= 1);
  assert.ok(Object.keys(by).some((l) => /^(json-prune-fetch-response|trusted-replace-fetch-response) · fetch$/.test(l)), 'przechwycenie fetch');
  assert.ok(Object.keys(by).some((l) => / · fetch:response$/.test(l)), 'przetwarzanie odpowiedzi fetch');
  // edit-inbound klonuje argument natywnym JSON.parse (100 ms) – to jest koszt ChromeBlock
  assert.ok(by['trusted-edit-inbound-object · JSON.stringify'].total > 0);
  for (const r of Object.values(by)) assert.ok(r.max <= r.total);
});

test('profiler: dane bez adresów, ID filmów i treści – tylko nazwy scriptletów i liczby', async () => {
  const ctx = env({ profiler: true });
  run(ctx, workload);
  await run(ctx, `fetch('https://www.youtube.com/youtubei/v1/player?key=1&v=dQw4w9WgXcQ').then((r) => r.json())`);
  await tick(5);
  const [detail] = flushEvents(ctx);
  assert.ok(!/youtube|https?:|dQw4w9WgXcQ|attestation|adPlacements|player\?/.test(detail), detail);
  const data = JSON.parse(detail);
  for (const [label, ...nums] of data.rows) {
    assert.match(label, LABEL_RE);
    for (const n of nums) assert.equal(typeof n, 'number');
  }
});

test('profiler: XHR i adjust-setTimeout mierzone pod własnymi etykietami', () => {
  const ctx = env({ profiler: true });
  run(ctx, `__xhrResponses = { '/youtubei/v1/player': '{"adPlacements":[{"a":1}],"adSlots":[]}' };`);
  run(ctx, `(() => { const x = new XMLHttpRequest(); x.open('GET', 'https://www.youtube.com/youtubei/v1/player?alt=json'); x.send(); return x.responseText; })()`);
  run(ctx, `setTimeout(() => {}, 5)`);
  const raw = flushEvents(ctx)[0];
  const labels = parseReport(raw).map((r) => r[0]);
  assert.ok(labels.some((l) => / · XMLHttpRequest:response$/.test(l)), labels.join(', '));
  assert.ok(labels.includes('adjust-setTimeout · setTimeout'), labels.join(', '));
});
