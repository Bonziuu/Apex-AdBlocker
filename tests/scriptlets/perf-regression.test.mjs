// Regresje wydajności scriptletów YouTube (pomiar: tools/perf/youtube-perf.mjs).
// Filtry pochodzą z PRAWDZIWYCH list; sprawdzamy liczbę kosztownych operacji na jedno wywołanie.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createEnv, runScriptlets, run } from '../helpers/scriptlet-env.mjs';
import { allLines, scriptletCallFromLine } from '../helpers/lists.mjs';

const ytInbound = () => allLines()
  .filter((l) => /^www\.youtube\.com##\+js\(trusted-edit-inbound-object, JSON\.stringify, /.test(l.line))
  .map(scriptletCallFromLine);

/** Środowisko z licznikiem wywołań natywnego JSON.stringify/JSON.parse (instalowanym PRZED scriptletami). */
function countingEnv() {
  const ctx = createEnv('www.youtube.com');
  run(ctx, `
    globalThis.__count = { stringify: 0, parse: 0 };
    const ns = JSON.stringify; const np = JSON.parse;
    JSON.stringify = function stringify(...a) { __count.stringify++; return ns.apply(this, a); };
    JSON.parse = function parse(...a) { __count.parse++; return np.apply(this, a); };
  `);
  return ctx;
}

test('regresja wydajności: 6× trusted-edit-inbound-object na JSON.stringify – koszt liniowy, nie 2^n', () => {
  const calls = ytInbound();
  assert.ok(calls.length >= 6, `oczekiwano ≥ 6 filtrów YouTube, jest ${calls.length}`);
  const ctx = countingEnv();
  runScriptlets(ctx, calls);
  run(ctx, '__count.stringify = 0; __count.parse = 0;');
  run(ctx, `JSON.stringify({ context: { client: { clientName: 'WEB', userAgent: 'Mozilla/5.0' } }, events: [1, 2, 3] })`);
  const n = run(ctx, '({ ...__count })');
  // każdy wrapper klonuje argument raz (stringify + parse), plus jedno właściwe wywołanie
  assert.equal(n.stringify, calls.length + 1, `natywny JSON.stringify: ${n.stringify} wywołań (przed poprawką: ${2 ** calls.length})`);
  assert.equal(n.parse, calls.length);
});

test('regresja wydajności: zachowanie edycji bez zmian – wszystkie edycje YouTube stosowane dokładnie raz', () => {
  const ctx = createEnv('www.youtube.com');
  runScriptlets(ctx, ytInbound());
  const before = Date.now();
  const out = JSON.parse(run(ctx, `JSON.stringify({ attestationRequest: {}, context: { client: { clientName: 'WEB',
      userAgent: 'Mozilla/5.0 channel lactmilli yahi instream' } },
    playbackContext: { contentPlaybackContext: { lactMilliseconds: '0', referer: 'https://www.youtube.com/watch?v=1' } } })`));
  assert.equal(out.context.client.clientScreen, 'CHANNEL');
  assert.equal(out.params, '8AUB', 'kolejność edycji jak przed optymalizacją (zewnętrzny wrapper najpierw)');
  assert.deepEqual(out.playbackContext.adPlaybackContext, { adType: 'AD_TYPE_INSTREAM' });
  assert.ok(Number(out.playbackContext.contentPlaybackContext.lactMilliseconds) >= before);
  assert.equal(out.playbackContext.contentPlaybackContext.referer, 'https://www.youtube.com/watch?v=1#reloadxhr');
  // obiekt bez attestationRequest – bez zmian
  const plain = { context: { client: { clientName: 'WEB', userAgent: 'channel' } }, a: [1, { b: 2 }] };
  assert.equal(run(ctx, `JSON.stringify(${JSON.stringify(plain)})`), JSON.stringify(plain));
  // oryginalny argument nie jest modyfikowany
  assert.equal(run(ctx, `(() => { const o = { attestationRequest: {}, context: { client: { clientName: 'WEB', userAgent: 'channel' } } }; JSON.stringify(o); return o.context.client.clientScreen; })()`), undefined);
});

test('regresja wydajności: wewnętrzne JSON.stringify scriptletów nie przechodzi przez wrappery strony', async () => {
  const prune = allLines().find((l) => /^www\.youtube\.com##\+js\(json-prune-fetch-response, adPlacements adSlots playerResponse\.adPlacements/.test(l.line));
  const calls = [...ytInbound(), scriptletCallFromLine(prune)];
  const ctx = countingEnv();
  run(ctx, `globalThis.fetch = async (url) => ({ url, status: 200, statusText: 'OK', headers: new Map(), type: 'basic', redirected: false,
    clone() { return this; }, json: async () => ({ adPlacements: [1], adSlots: [2], videoDetails: { videoId: 'x' } }) });
    globalThis.Response = class Response { constructor(body) { this.body = body; } };`);
  runScriptlets(ctx, calls);
  run(ctx, '__count.stringify = 0;');
  await run(ctx, `fetch('https://www.youtube.com/youtubei/v1/player?key=1')`);
  // jedno natywne JSON.stringify na wynik (przed poprawką: przechodziło przez 6 wrapperów → 127 wywołań)
  assert.equal(run(ctx, '__count.stringify'), 1);
});

const ytDomBypass = () => allLines()
  .filter((l) => /^www\.youtube\.com##\+js\(trusted-prevent-dom-bypass, Node\.prototype\.appendChild, /.test(l.line))
  .map(scriptletCallFromLine);

test('regresja wydajności: trusted-prevent-dom-bypass – zwykłe elementy bez alokacji na każde appendChild', () => {
  const calls = ytDomBypass();
  assert.ok(calls.length >= 3, `oczekiwano ≥ 3 filtrów YouTube, jest ${calls.length}`);
  const ctx = createEnv('www.youtube.com');
  runScriptlets(ctx, calls);
  run(ctx, `globalThis.__sets = 0; const NS = Set;
    globalThis.Set = class CountingSet extends NS { constructor(...a) { super(...a); __sets++; } };`);
  run(ctx, `const host = new HTMLElement('DIV'); for (let i = 0; i < 1000; i++) host.appendChild(new HTMLElement('SPAN'));`);
  assert.equal(run(ctx, '__sets'), 0, 'brak alokacji Set dla elementów bez contentWindow');
  assert.equal(run(ctx, 'host.childNodes.length'), 1000, 'appendChild nadal działa');
  // ramka about:blank – zachowanie bez zmian: dostaje funkcje strony
  const same = run(ctx, `(() => {
    const frameWin = { location: { href: 'about:blank' }, fetch: function nativeFetch() {}, Request: function R() {},
      JSON: { parse: function p() {} }, [Symbol.toStringTag]: 'Window' };
    new HTMLElement('DIV').appendChild(new HTMLIFrameElement(frameWin));
    return [frameWin.fetch === window.fetch, frameWin.Request === window.Request, frameWin.JSON.parse === window.JSON.parse];
  })()`);
  assert.deepEqual([...same], [true, true, true]);
  assert.ok(run(ctx, '__sets') > 0, 'ramka nadal przechodzi przez pełną ścieżkę');
});

/** Środowisko liczące, ile Proxy powstało na każdą funkcję (po nazwie celu). */
function proxyCountingEnv() {
  const ctx = createEnv('www.youtube.com');
  run(ctx, `globalThis.__proxied = {}; const NP = Proxy;
    globalThis.Proxy = new NP(NP, { construct(t, a) { const n = (a[0] && a[0].name) || '?'; __proxied[n] = (__proxied[n] || 0) + 1; return Reflect.construct(t, a); } });`);
  return ctx;
}

test('jeden wrapper: 6 filtrów trusted-edit-inbound-object na JSON.stringify → dokładnie jeden Proxy', () => {
  const calls = ytInbound();
  assert.ok(calls.length >= 6);
  const ctx = proxyCountingEnv();
  runScriptlets(ctx, calls);
  assert.equal(run(ctx, '__proxied.stringify'), 1);
});

test('jeden wrapper: 3 filtry trusted-prevent-dom-bypass na Node.prototype.appendChild → dokładnie jeden Proxy', () => {
  const calls = ytDomBypass();
  assert.ok(calls.length >= 3);
  const ctx = proxyCountingEnv();
  runScriptlets(ctx, calls);
  assert.equal(run(ctx, '__proxied.appendChild'), 1);
  // zachowanie bez zmian: ramka about:blank dostaje fetch, Request i JSON.parse strony
  const r = run(ctx, `(() => { const w = { location: { href: 'about:blank' }, fetch: function f() {}, Request: function R() {},
    JSON: { parse: function p() {} }, [Symbol.toStringTag]: 'Window' };
    new HTMLElement('DIV').appendChild(new HTMLIFrameElement(w)); return [w.fetch === window.fetch, w.Request === window.Request, w.JSON.parse === window.JSON.parse]; })()`);
  assert.deepEqual([...r], [true, true, true]);
});

test('jeden wrapper: kolejność handlerów, kopia argumentów, wyniki i wyjątki jak przy zagnieżdżonych Proxy', () => {
  const ctx = createEnv('www.youtube.com');
  runScriptlets(ctx, ytInbound());
  // kolejność edycji jak przed zmianą (zewnętrzny – ostatnio dodany – najpierw): params = 8AUB
  const out = JSON.parse(run(ctx, `JSON.stringify({ attestationRequest: {}, context: { client: { clientName: 'WEB', userAgent: 'channel lactmilli yahi' } } })`));
  assert.equal(out.params, '8AUB');
  assert.equal(out.context.client.clientScreen, 'CHANNEL');
  // pozostałe argumenty (replacer, space) przekazane bez zmian
  assert.equal(run(ctx, `JSON.stringify({ a: 1, b: 2 }, ['a'], 1)`), '{\n "a": 1\n}');
  // wyjątki przechodzą bez zmian
  assert.equal(run(ctx, `(() => { const o = {}; o.o = o; try { JSON.stringify(o); return 'ok'; } catch (e) { return e instanceof TypeError; } })()`), true);
  // właściwości funkcji jak oryginału
  assert.equal(run(ctx, 'JSON.stringify.name + JSON.stringify.length'), 'stringify3');
});

test('jeden wrapper: gdy inny kod owinie funkcję między filtrami, powstaje nowa warstwa (kolejność zachowana)', () => {
  const calls = ytInbound();
  const ctx = createEnv('www.youtube.com');
  run(ctx, 'globalThis.__order = [];');
  runScriptlets(ctx, calls.slice(0, 2));
  // obcy wrapper strony/innego scriptletu pomiędzy
  run(ctx, `const prev = JSON.stringify; JSON.stringify = function stringify(...a) { __order.push('obcy'); return prev.apply(this, a); };`);
  runScriptlets(ctx, calls.slice(2, 3));
  const out = JSON.parse(run(ctx, `JSON.stringify({ attestationRequest: {}, context: { client: { clientName: 'WEB', userAgent: 'channel lactmilli yahi' } } })`));
  assert.ok(run(ctx, '__order.length') >= 1, 'obcy wrapper nadal wywoływany');
  assert.equal(out.context.client.clientScreen, 'CHANNEL');
});
