// Testy zachowania scriptletów używanych przez aktualne filtry YouTube.
// Filtry są czytane z PRAWDZIWYCH list (tools/lists/ubo), a wejście/wyjście
// to realistyczne fragmenty odpowiedzi odtwarzacza YouTube.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createEnv, runScriptlets, run as runRaw } from '../helpers/scriptlet-env.mjs';
import { plain } from '../helpers/scriptlet-env.mjs';

const safePlain = (v) => { if (!v || typeof v !== 'object') return v; try { return plain(v); } catch { return v; } };
const run = (ctx, code) => {
  const v = runRaw(ctx, code);
  return v && typeof v.then === 'function' ? v.then(safePlain) : safePlain(v);
};
import { findLine, scriptletCallFromLine } from '../helpers/lists.mjs';

const ytCall = (re) => scriptletCallFromLine(findLine(re));

test('set-constant: ytInitialPlayerResponse.adPlacements → undefined, reszta odpowiedzi nietknięta', () => {
  const call = ytCall(/youtube\.com.*##\+js\(set, ytInitialPlayerResponse\.adPlacements, undefined\)/);
  const ctx = createEnv('www.youtube.com');
  runScriptlets(ctx, [call]);
  run(ctx, 'window.ytInitialPlayerResponse = { adPlacements: [{ ad: 1 }], videoDetails: { videoId: "abc" } };');
  assert.equal(run(ctx, 'ytInitialPlayerResponse.adPlacements'), undefined);
  assert.equal(run(ctx, 'ytInitialPlayerResponse.videoDetails.videoId'), 'abc');
});

test('json-prune (YouTube): usuwa reklamy z JSON.parse odpowiedzi odtwarzacza', () => {
  const call = ytCall(/##\+js\(json-prune, playerResponse\.adPlacements playerResponse\.playerAds/);
  const ctx = createEnv('m.youtube.com');
  runScriptlets(ctx, [call]);
  const out = run(ctx, `JSON.parse(JSON.stringify({
    playerResponse: { adPlacements: [1], playerAds: [2], adSlots: [3], streamingData: { formats: [1] } },
    adPlacements: [4], playerAds: [5], responseContext: {}
  }))`);
  assert.deepEqual(Object.keys(out.playerResponse), ['streamingData']);
  assert.equal(out.adPlacements, undefined);
  assert.equal(out.playerAds, undefined);
  assert.ok(out.responseContext);
});

test('json-prune [-] (Shorts): usuwa wpisy reklamowe z sekwencji Shorts', () => {
  const call = ytCall(/youtube\.com##\+js\(json-prune, entries\.\[-\]\.command\.reelWatchEndpoint\.adClientParams\.isAd\)/);
  const ctx = createEnv('www.youtube.com');
  runScriptlets(ctx, [call], { host: 'youtube.com' });
  const out = run(ctx, `JSON.parse(JSON.stringify({ entries: [
    { command: { reelWatchEndpoint: { videoId: 'a' } } },
    { command: { reelWatchEndpoint: { adClientParams: { isAd: true } } } },
    { command: { reelWatchEndpoint: { videoId: 'b' } } }
  ] }))`);
  assert.deepEqual(out.entries.map((e) => e.command.reelWatchEndpoint.videoId), ['a', 'b']);
});

test('json-prune-fetch-response: przycina tylko żądania pasujące do propsToMatch', async () => {
  const call = ytCall(/##\+js\(json-prune-fetch-response, reelWatchSequenceResponse\.entries\.\[-\]/);
  const ctx = createEnv('www.youtube.com');
  run(ctx, `__respond = () => ({ body: JSON.stringify({ entries: [
    { command: { reelWatchEndpoint: { adClientParams: { isAd: true } } } },
    { command: { reelWatchEndpoint: { videoId: 'x' } } }] }) });`);
  runScriptlets(ctx, [call]);
  const matched = await run(ctx, `fetch('https://www.youtube.com/youtubei/v1/reel/reel_watch_sequence?prettyPrint=false').then(r => r.json())`);
  assert.equal(matched.entries.length, 1);
  const other = await run(ctx, `fetch('https://www.youtube.com/youtubei/v1/next').then(r => r.json())`);
  assert.equal(other.entries.length, 2, 'inne żądania bez zmian');
});

test('json-prune-fetch-response (/player): obsługuje tablicę w korzeniu ("[].playerResponse...")', async () => {
  const call = ytCall(/www\.youtube\.com##\+js\(json-prune-fetch-response, adPlacements adSlots playerResponse\.adPlacements playerResponse\.adSlots \[\]\.playerResponse\.adPlacements/);
  const ctx = createEnv('www.youtube.com');
  run(ctx, `__respond = () => ({ body: JSON.stringify([{ playerResponse: { adPlacements: [1], adSlots: [2], videoDetails: {} } }]) });`);
  runScriptlets(ctx, [call]);
  const out = await run(ctx, `fetch('https://www.youtube.com/youtubei/v1/player?key=1').then(r => r.json())`);
  assert.deepEqual(Object.keys(out[0].playerResponse), ['videoDetails']);
});

test('json-prune-xhr-response (/player): przycina odpowiedź XHR i zachowuje responseText spójny', () => {
  const call = ytCall(/www\.youtube\.com##\+js\(json-prune-xhr-response, adPlacements adSlots/);
  const ctx = createEnv('www.youtube.com');
  run(ctx, `__xhrRespond = () => JSON.stringify({ adPlacements: [1], adSlots: [2], videoDetails: { videoId: 'v' } });`);
  runScriptlets(ctx, [call]);
  const r = run(ctx, `(() => { const x = new XMLHttpRequest(); x.open('POST', 'https://www.youtube.com/youtubei/v1/player'); x.send(); return [x.response, x.responseText]; })()`);
  assert.deepEqual(JSON.parse(r[0]), { videoDetails: { videoId: 'v' } });
  assert.equal(r[0], r[1]);
  const other = run(ctx, `(() => { const x = new XMLHttpRequest(); x.open('POST', 'https://www.youtube.com/youtubei/v1/next'); x.send(); return x.response; })()`);
  assert.ok(JSON.parse(other).adPlacements, 'inne adresy bez zmian');
});

test('trusted-replace-xhr-response: regex z flagami gms i $1 (YouTube /player)', () => {
  const call = ytCall(/www\.youtube\.com##\+js\(trusted-replace-xhr-response, \/"adPlacements\.\*\?\("adSlots"\|"adBreakHeartbeatParams"\)\/gms, \$1/);
  const ctx = createEnv('www.youtube.com');
  run(ctx, `__xhrRespond = () => '{"adPlacements":[{"x":1}],"adSlots":[],"videoDetails":{}}';`);
  runScriptlets(ctx, [call]);
  const text = run(ctx, `(() => { const x = new XMLHttpRequest(); x.open('POST', 'https://www.youtube.com/youtubei/v1/player'); x.send(); return x.responseText; })()`);
  assert.equal(text, '{"adSlots":[],"videoDetails":{}}');
});

test('trusted-replace-xhr-response: tekst dosłowny zastępuje tylko pierwsze wystąpienie (semantyka uBO)', () => {
  const ctx = createEnv('tv.youtube.com');
  run(ctx, `__xhrRespond = () => '{"adPlacements":1,"x":{"adPlacements":2}}';`);
  runScriptlets(ctx, [['trusted-replace-xhr-response', '"adPlacements"', '"no_ads"', '/player']]);
  const text = run(ctx, `(() => { const x = new XMLHttpRequest(); x.open('GET', 'https://tv.youtube.com/youtubei/v1/player'); x.send(); return x.response; })()`);
  assert.equal(text, '{"no_ads":1,"x":{"adPlacements":2}}');
});

test('trusted-replace-fetch-response (trusted-rpfr): zamienia tekst w odpowiedzi fetch dla "player?"', async () => {
  const call = ytCall(/www\.youtube\.com##\+js\(trusted-rpfr, '"adPlacements"', '"no_ads"', player\?\)/);
  const ctx = createEnv('www.youtube.com');
  run(ctx, `__respond = () => ({ body: '{"adPlacements":[1],"videoDetails":{}}' });`);
  runScriptlets(ctx, [call]);
  const changed = await run(ctx, `fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false').then(r => r.text())`);
  assert.equal(changed, '{"no_ads":[1],"videoDetails":{}}');
  const untouched = await run(ctx, `fetch('https://www.youtube.com/youtubei/v1/next').then(r => r.text())`);
  assert.equal(untouched, '{"adPlacements":[1],"videoDetails":{}}');
});

test('json-edit-fetch-response (m.youtube): usuwa elementy z adSlotRenderer z itemSectionRenderer.contents', async () => {
  const call = ytCall(/m\.youtube\.com##\+js\(json-edit-fetch-response, \.\.itemSectionRenderer\.contents\.\*\[\?\.adSlotRenderer\]/);
  const ctx = createEnv('m.youtube.com');
  run(ctx, `__respond = () => ({ body: JSON.stringify({ contents: { a: { itemSectionRenderer: { contents: [
    { videoRenderer: { id: 1 } }, { adSlotRenderer: { ad: true } }, { videoRenderer: { id: 2 } }, { adSlotRenderer: {} } ] } } } }) });`);
  runScriptlets(ctx, [call]);
  const out = await run(ctx, `fetch('https://m.youtube.com/youtubei/v1/get_watch?x=1').then(r => r.json())`);
  assert.deepEqual(out.contents.a.itemSectionRenderer.contents, [{ videoRenderer: { id: 1 } }, { videoRenderer: { id: 2 } }]);
  const other = await run(ctx, `fetch('https://m.youtube.com/youtubei/v1/browse').then(r => r.json())`);
  assert.equal(other.contents.a.itemSectionRenderer.contents.length, 4);
});

test('trusted-edit-inbound-object (JSON.stringify): dopisuje clientScreen dla userAgent z "channel"', () => {
  const call = ytCall(/www\.youtube\.com##\+js\(trusted-edit-inbound-object, JSON\.stringify, 0, \[\?\.attestationRequest\]\[\?\.context\.client\.userAgent\*="channel"\]/);
  const ctx = createEnv('www.youtube.com');
  runScriptlets(ctx, [call]);
  const withMarker = JSON.parse(run(ctx, `JSON.stringify({ attestationRequest: {}, context: { client: { userAgent: 'Mozilla/5.0 (X11; channel', clientName: 'WEB' } } })`));
  assert.equal(withMarker.context.client.clientScreen, 'CHANNEL');
  const noMarker = JSON.parse(run(ctx, `JSON.stringify({ attestationRequest: {}, context: { client: { userAgent: 'Mozilla/5.0', clientName: 'WEB' } } })`));
  assert.equal(noMarker.context.client.clientScreen, undefined);
  const noAttestation = JSON.parse(run(ctx, `JSON.stringify({ context: { client: { userAgent: 'x channel', clientName: 'WEB' } } })`));
  assert.equal(noAttestation.context.client.clientScreen, undefined, 'bez attestationRequest – bez zmian');
  const otherClient = JSON.parse(run(ctx, `JSON.stringify({ attestationRequest: {}, context: { client: { userAgent: 'x channel', clientName: 'MWEB' } } })`));
  assert.equal(otherClient.context.client.clientScreen, undefined, 'tylko clientName == "WEB"');
});

test('trusted-edit-inbound-object: lactMilliseconds="${now}" i referer=repl(...) (YouTube)', () => {
  const now = ytCall(/trusted-edit-inbound-object, JSON\.stringify, 0, .*lactMilliseconds="\$\{now\}"/);
  const repl = ytCall(/trusted-edit-inbound-object, JSON\.stringify, 0, .*referer=repl\(/);
  const ctx = createEnv('www.youtube.com');
  runScriptlets(ctx, [now, repl]);
  const before = Date.now();
  const out = JSON.parse(run(ctx, `JSON.stringify({ attestationRequest: {}, context: { client: { userAgent: 'UA lactmilli' } },
    playbackContext: { contentPlaybackContext: { lactMilliseconds: '0', referer: 'https://www.youtube.com/watch?v=1' } } })`));
  const lact = Number(out.playbackContext.contentPlaybackContext.lactMilliseconds);
  assert.ok(lact >= before && lact <= Date.now(), 'lactMilliseconds = bieżący czas');
  assert.equal(out.playbackContext.contentPlaybackContext.referer, 'https://www.youtube.com/watch?v=1#reloadxhr');
  // ponowne zastosowanie nie dubluje znacznika
  const again = JSON.parse(run(ctx, `JSON.stringify(${JSON.stringify(out)})`));
  assert.equal(again.playbackContext.contentPlaybackContext.referer, 'https://www.youtube.com/watch?v=1#reloadxhr');
});

test('trusted-prevent-dom-bypass: świeża ramka about:blank dostaje fetch strony (nie natywny)', () => {
  const call = ytCall(/www\.youtube\.com##\+js\(trusted-prevent-dom-bypass, Node\.prototype\.appendChild, fetch\)/);
  const ctx = createEnv('www.youtube.com');
  runScriptlets(ctx, [call]);
  const same = run(ctx, `(() => {
    const frameWin = { location: { href: 'about:blank' }, fetch: function nativeFetch() {}, [Symbol.toStringTag]: 'Window' };
    const host = new HTMLElement('DIV');
    host.appendChild(new HTMLIFrameElement(frameWin));
    return frameWin.fetch === window.fetch;
  })()`);
  assert.equal(same, true);
  const otherOrigin = run(ctx, `(() => {
    const native = function nativeFetch() {};
    const frameWin = { location: { href: 'https://ads.example/' }, fetch: native, [Symbol.toStringTag]: 'Window' };
    new HTMLElement('DIV').appendChild(new HTMLIFrameElement(frameWin));
    return frameWin.fetch === native;
  })()`);
  assert.equal(otherOrigin, true, 'ramki z innym adresem są pomijane');
});

test('adjust-setTimeout (nano-stb "[native code]", 17000, 0.001): skraca tylko opóźnienia funkcji natywnych', () => {
  const call = ytCall(/www\.youtube\.com##\+js\(nano-stb, \[native code\], 17000, 0\.001\)/);
  const ctx = createEnv('www.youtube.com');
  const delays = [];
  ctx.setTimeout = (fn, d) => { delays.push(d); return 1; };
  runScriptlets(ctx, [call]);
  run(ctx, `setTimeout(Math.max.bind(null), 17000); setTimeout(function page() {}, 17000); setTimeout(Math.min.bind(null), 1000);`);
  assert.deepEqual(delays, [17, 17000, 1000]);
});

test('trusted-replace-node-text (serverContract, sedCount/excludes/condition): podmienia tylko pierwszy pasujący skrypt', () => {
  const call = ytCall(/www\.youtube\.com##\+js\(rpnt, script, \/\(\\\(function serverContract/);
  assert.ok(call.includes('sedCount') && call.includes('excludes') && call.includes('condition'));
  const ctx = createEnv('www.youtube.com');
  run(ctx, `
    var s1 = new HTMLScriptElement('var a = 1; MutationObserver; (function serverContract() { return 1; })();');
    var s2 = new HTMLScriptElement('(function serverContract() { return 2; })();');
    var s3 = new HTMLScriptElement('if (window.ytcsi) { tick(); } js_ld');
    var s4 = new HTMLScriptElement('console.log("bez związku")');
    document.documentElement = new Node('HTML', '', [new Node('HEAD', '', [s1, s2, s3, s4])]);
  `);
  runScriptlets(ctx, [call]);
  const texts = run(ctx, '[s1, s2, s3, s4].map((s) => s.textContent)');
  assert.ok(texts[0].includes('MutationObserver;') && !texts[0].includes('YOUTUBE_PREMIUM_LOGO'), 'excludes: skrypt z MutationObserver pominięty');
  assert.ok(texts[1].startsWith('(()=>{if("YOUTUBE_PREMIUM_LOGO"'), 'pierwszy pasujący skrypt dostał wstrzyknięty kod');
  assert.ok(texts[1].endsWith('(function serverContract() { return 2; })();'), '$1 zachowuje oryginalny początek');
  assert.ok(!texts[2].includes('YOUTUBE_PREMIUM_LOGO'), 'sedCount=1: drugi pasujący skrypt nietknięty');
  assert.equal(texts[3], 'console.log("bez związku")');
});

test('remove-node-text (rmnt script, window,"fetch"): opróżnia treść skryptu, nie usuwa węzła', () => {
  const call = ytCall(/www\.youtube\.com##\+js\(rmnt, script, window\\,"fetch"\)/);
  const ctx = createEnv('www.youtube.com');
  run(ctx, `
    var a = new HTMLScriptElement('const f = Reflect.get(window,"fetch");');
    var b = new HTMLScriptElement('normalny kod');
    document.documentElement = new Node('HTML', '', [a, b]);`);
  runScriptlets(ctx, [call]);
  assert.equal(run(ctx, 'a.textContent'), '');
  assert.equal(run(ctx, 'a.parentNode === document.documentElement'), true, 'węzeł pozostaje w drzewie');
  assert.equal(run(ctx, 'b.textContent'), 'normalny kod');
  // skrypty dodawane później (MutationObserver) też są obsługiwane do etapu "interactive"
  run(ctx, `var c = new HTMLScriptElement('x = window,"fetch"'); __mutate([c]);`);
  assert.equal(run(ctx, 'c.textContent'), '');
});

test('prevent-addEventListener (m.youtube visibilitychange)', () => {
  const call = ytCall(/m\.youtube\.com##\+js\(aeld, visibilitychange, /);
  const ctx = createEnv('m.youtube.com');
  runScriptlets(ctx, [call]);
  const fired = run(ctx, `(() => {
    const t = new EventTarget(); const log = [];
    t.addEventListener('visibilitychange', function () { log.push(this.getVisibilityState()); });
    t.addEventListener('visibilitychange', function keep() { log.push('ok'); });
    t.getVisibilityState = () => 'x';
    t.dispatchEvent(new Event('visibilitychange'));
    return log;
  })()`);
  assert.deepEqual(fired, ['ok']);
});

test('trusted-set-constant json:"visible" (m.youtube document.visibilityState)', () => {
  const call = ytCall(/m\.youtube\.com##\+js\(trusted-set, document\.visibilityState, json:"visible"\)/);
  const ctx = createEnv('m.youtube.com');
  run(ctx, 'document.visibilityState = "hidden";');
  runScriptlets(ctx, [call]);
  assert.equal(run(ctx, 'document.visibilityState'), 'visible');
});
