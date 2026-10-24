// Testy zachowania ogólnych scriptletów (wejście → oczekiwane zachowanie),
// w tym testy regresyjne dla błędów naprawionych w v0.2.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createEnv, runScriptlets, run as runRaw, plain, tick } from '../helpers/scriptlet-env.mjs';

const safePlain = (v) => { if (!v || typeof v !== 'object') return v; try { return plain(v); } catch { return v; } };
const run = (ctx, code) => { const v = runRaw(ctx, code); return v && typeof v.then === 'function' ? v.then(safePlain) : safePlain(v); };
const env = (calls, host = 'example.com', before) => { const ctx = createEnv(host); if (before) before(ctx); runScriptlets(ctx, calls); return ctx; };

// ------------------------------------------------------------ set-constant

test('set-constant: łańcuch definiowany później przez stronę', () => {
  const ctx = env([['set-constant', 'ads.config.enabled', 'false']]);
  run(ctx, 'window.ads = { config: { enabled: true, other: 5 } }; ads.config.enabled = true;');
  assert.equal(run(ctx, 'ads.config.enabled'), false);
  assert.equal(run(ctx, 'ads.config.other'), 5);
});

test('regresja: set-constant wycofuje się, gdy strona przypisze wartość innego typu (jak uBO)', () => {
  const ctx = env([['set-constant', 'canRunAds', 'true']]);
  run(ctx, 'window.canRunAds = "tekst";');
  assert.equal(run(ctx, 'canRunAds'), 'tekst');
  const ctx2 = env([['set-constant', 'canRunAds', 'true']]);
  run(ctx2, 'window.canRunAds = false;');
  assert.equal(run(ctx2, 'canRunAds'), true, 'ten sam typ – stała zostaje');
});

test('trusted-set-constant: nie wycofuje się i obsługuje json:', () => {
  const ctx = env([['trusted-set-constant', 'cfg', 'json:{"a":[1,2]}']]);
  run(ctx, 'window.cfg = "zmiana";');
  assert.deepEqual(run(ctx, 'cfg'), { a: [1, 2] });
});

test('regresja: set-constant "as, function" (vararg uBO) zwraca funkcję', () => {
  const ctx = env([['set-constant', 'isAdblock', 'false', 'as', 'function']]);
  assert.equal(run(ctx, 'typeof isAdblock'), 'function');
  assert.equal(run(ctx, 'isAdblock()'), false);
});

// ---------------------------------------------------------- abort-on-*

test('abort-on-property-read: odczyt rzuca wyjątek', () => {
  const ctx = env([['abort-on-property-read', 'detector.check']]);
  run(ctx, 'window.detector = { check: 1 };');
  assert.throws(() => run(ctx, 'detector.check'));
});

test('abort-on-property-write: zapis rzuca wyjątek', () => {
  const ctx = env([['abort-on-property-write', 'adblockWarning']]);
  assert.throws(() => run(ctx, 'window.adblockWarning = 1;'));
});

test('regresja: abort-current-script dopasowuje TREŚĆ skryptu, a nie jego adres; context = src', () => {
  const ctx = env([['abort-current-script', 'document.write', 'adblock']]);
  run(ctx, 'document.write = function () { return "ok"; };');
  run(ctx, 'document.currentScript = new HTMLScriptElement("", "https://cdn.example/adblock.js");');
  assert.equal(run(ctx, 'document.write()'), 'ok', 'adres URL nie jest treścią – brak przerwania');
  run(ctx, 'document.currentScript = new HTMLScriptElement("if (adblock) document.write(1)");');
  assert.throws(() => run(ctx, 'document.write'));

  const ctx2 = env([['abort-current-script', 'atob', '', '/ads\\.js$/']]);
  run(ctx2, 'document.currentScript = new HTMLScriptElement("x", "https://site/app.js");');
  assert.equal(run(ctx2, 'typeof atob'), 'function');
  run(ctx2, 'document.currentScript = new HTMLScriptElement("x", "https://site/ads.js");');
  assert.throws(() => run(ctx2, 'atob'));
});

// ------------------------------------------------------- addEventListener

test('regresja: prevent-addEventListener – typ dopasowany dosłownie i w całości (nie jako podciąg)', () => {
  const ctx = env([['prevent-addEventListener', 'click', 'popup']]);
  const log = run(ctx, `(() => { const t = new EventTarget(); const log = [];
    t.addEventListener('dblclick', function popup() { log.push('dbl'); });
    t.addEventListener('click', function popup() { log.push('click'); });
    t.dispatchEvent(new Event('dblclick')); t.dispatchEvent(new Event('click')); return log; })()`);
  assert.deepEqual(log, ['dbl']);
});

test('regresja: prevent-addEventListener – obiekty z handleEvent', () => {
  const ctx = env([['prevent-addEventListener', '', 'adblockDetected']]);
  const log = run(ctx, `(() => { const t = new EventTarget(); const log = [];
    t.addEventListener('load', { handleEvent() { log.push('adblockDetected'); } });
    t.addEventListener('load', { handleEvent() { log.push('ok'); } });
    t.dispatchEvent(new Event('load')); return log; })()`);
  assert.deepEqual(log, ['ok']);
});

// --------------------------------------------------------------- timery

test('regresja: prevent-setTimeout – zakresy opóźnień ("1000-2000", "!500")', () => {
  const ctx = createEnv();
  const ran = [];
  ctx.setTimeout = (fn, d) => { fn(); return d; };
  runScriptlets(ctx, [['prevent-setTimeout', 'block', '1000-2000'], ['prevent-setTimeout', 'notThis', '!500']]);
  ctx.log = (x) => ran.push(x);
  run(ctx, `setTimeout(function block() { log('a'); }, 1500);
    setTimeout(function block() { log('b'); }, 2500);
    setTimeout(function notThis() { log('c'); }, 500);
    setTimeout(function notThis() { log('d'); }, 700);`);
  assert.deepEqual(ran, ['b', 'c']);
});

test('prevent-setTimeout: negacja wzorca "!"', () => {
  const ctx = createEnv();
  const ran = [];
  ctx.setTimeout = (fn) => { fn(); return 1; };
  runScriptlets(ctx, [['prevent-setTimeout', '!keep', '']]);
  ctx.log = (x) => ran.push(x);
  run(ctx, `setTimeout(function keep() { log('keep'); }, 1); setTimeout(function other() { log('other'); }, 1);`);
  assert.deepEqual(ran, ['keep']);
});

// --------------------------------------------------------- window.open

test('regresja: prevent-window-open bez opóźnienia zwraca null (nie atrapę okna)', () => {
  const ctx = env([['prevent-window-open', 'ads']]);
  assert.equal(run(ctx, `open('https://ads.example/x')`), null);
  assert.deepEqual(run(ctx, `open('https://ok.example/')`), { closed: false, real: true });
});

test('prevent-window-open: negacja "!" blokuje wszystko poza wzorcem', () => {
  const ctx = env([['prevent-window-open', '!example.com']]);
  assert.equal(run(ctx, `open('https://evil.test/')`), null);
  assert.ok(run(ctx, `open('https://example.com/a')`).real);
});

// ----------------------------------------------------------- fetch / xhr

test('regresja: prevent-fetch – brakujące właściwości są pomijane, odpowiedź ma statusText OK', async () => {
  const ctx = env([['prevent-fetch', 'pagead2 method:POST']]);
  run(ctx, `__respond = () => ({ body: 'prawdziwa' });`);
  const r = await run(ctx, `fetch('https://pagead2.googlesyndication.com/x').then(async r => ({ text: await r.text(), statusText: r.statusText, url: r.url }))`);
  assert.deepEqual(r, { text: '', statusText: 'OK', url: 'https://pagead2.googlesyndication.com/x' });
  const real = await run(ctx, `fetch('https://site.example/api').then(r => r.text())`);
  assert.equal(real, 'prawdziwa');
});

test('prevent-fetch: responseType {"type":"cors"} i treść emptyObj', async () => {
  const ctx = env([['prevent-fetch', 'doubleclick', 'emptyObj', '{"type":"cors"}']]);
  const r = await run(ctx, `fetch('https://doubleclick.net/a').then(async r => ({ text: await r.text(), type: r.type }))`);
  assert.deepEqual(r, { text: '{}', type: 'cors' });
});

test('prevent-xhr: żądanie nie jest wysyłane, zdarzenia load/loadend przychodzą', async () => {
  const ctx = env([['prevent-xhr', 'adsbygoogle']]);
  run(ctx, `var x = new XMLHttpRequest(); var events = []; x.addEventListener('load', () => events.push('load'));
    x.addEventListener('loadend', () => events.push('loadend')); x.open('GET', 'https://pagead2.googlesyndication.com/adsbygoogle.js'); x.send();`);
  await tick(5);
  assert.equal(run(ctx, 'x.sent'), false);
  assert.equal(run(ctx, 'x.readyState'), 4);
  assert.equal(run(ctx, 'x.responseText'), '');
  assert.deepEqual(run(ctx, 'events'), ['load', 'loadend']);
});

// ------------------------------------------------------------- json-prune

test('json-prune: ścieżki potrzebne (needle) muszą istnieć', () => {
  const ctx = env([['json-prune', 'ad', 'required']]);
  assert.deepEqual(run(ctx, `JSON.parse('{"ad":1}')`), { ad: 1 });
  assert.deepEqual(run(ctx, `JSON.parse('{"ad":1,"required":true}')`), { required: true });
});

test('regresja: json-prune – "*" na końcu czyści obiekt, "[]" na końcu jest zwykłym kluczem', () => {
  const ctx = env([['json-prune', 'a.*'], ['json-prune', 'b.[]']]);
  const out = run(ctx, `JSON.parse('{"a":{"x":1,"y":2},"b":[1,2],"c":1}')`);
  assert.deepEqual(out, { a: {}, b: [1, 2], c: 1 });
});

test('json-prune: {-} usuwa właściwości, których zawartość pasuje', () => {
  const ctx = env([['json-prune', 'slots.{-}.isAd']]);
  assert.deepEqual(run(ctx, `JSON.parse('{"slots":{"a":{"isAd":1},"b":{"v":1}}}')`), { slots: { b: { v: 1 } } });
});

test('regresja: json-prune nie przechwytuje Response.json() (tylko JSON.parse, jak uBO)', async () => {
  const ctx = env([['json-prune', 'ad']]);
  run(ctx, `__respond = () => ({ body: '{"ad":1}' });`);
  assert.deepEqual(await run(ctx, `new Response('{"ad":1}').json()`), { ad: 1 });
});

// ----------------------------------------------------------------- tekst

test('regresja: trusted-replace-node-text – regex bez flag zamienia tylko pierwsze wystąpienie', () => {
  const ctx = createEnv();
  run(ctx, `var s = new HTMLScriptElement('ad(); ad();'); document.documentElement = new Node('HTML', '', [s]);`);
  runScriptlets(ctx, [['trusted-replace-node-text', 'script', '/ad\\(\\);/', 'x();']]);
  assert.equal(run(ctx, 's.textContent'), 'x(); ad();');
});

test('trusted-replace-node-text – tekst dosłowny zamienia wszystkie wystąpienia (flagi gms)', () => {
  const ctx = createEnv();
  run(ctx, `var s = new HTMLScriptElement('ad(); ad();'); document.documentElement = new Node('HTML', '', [s]);`);
  runScriptlets(ctx, [['trusted-replace-node-text', 'script', 'ad();', 'x();']]);
  assert.equal(run(ctx, 's.textContent'), 'x(); x();');
});

test('trusted-replace-node-text – brak tekstu zastępującego = usunięcie dopasowania', () => {
  const ctx = createEnv();
  run(ctx, `var s = new HTMLScriptElement('a,"homad",b'); document.documentElement = new Node('HTML', '', [s]);`);
  runScriptlets(ctx, [['trusted-replace-node-text', 'script', '/"homad",/']]);
  assert.equal(run(ctx, 's.textContent'), 'a,b');
});

test('remove-node-text: obserwacja kończy się na etapie "interactive"', () => {
  const ctx = createEnv();
  run(ctx, 'document.documentElement = new Node("HTML");');
  runScriptlets(ctx, [['remove-node-text', 'script', 'adblock']]);
  run(ctx, '__setReadyState("interactive"); var late = new HTMLScriptElement("adblock"); __mutate([late]);');
  assert.equal(run(ctx, 'late.textContent'), 'adblock');
});

// -------------------------------------------------------- ciasteczka itd.

test('set-cookie: dozwolone wartości są ustawiane z path=/', () => {
  const ctx = env([['set-cookie', 'consent', 'accept']]);
  assert.match(run(ctx, 'document.cookie'), /consent=accept/);
});

test('remove-cookie: usuwa pasujące ciasteczka', () => {
  const ctx = createEnv();
  run(ctx, 'document.cookie = "_ga=1"; document.cookie = "keep=1";');
  runScriptlets(ctx, [['remove-cookie', '/^_ga/']]);
  assert.equal(run(ctx, 'document.cookie'), 'keep=1');
});

test('set-local-storage-item i $remove$', () => {
  const ctx = env([['set-local-storage-item', 'adblock', 'false']]);
  assert.equal(run(ctx, 'localStorage.getItem("adblock")'), 'false');
  const ctx2 = createEnv();
  run(ctx2, 'localStorage.setItem("ads_1", "x"); localStorage.setItem("keep", "y");');
  runScriptlets(ctx2, [['set-local-storage-item', '/^ads_/', '$remove$']]);
  assert.equal(run(ctx2, 'localStorage.length'), 1);
});

test('noeval-if: blokuje tylko pasujący kod', () => {
  const ctx = env([['noeval-if', 'adblock']], 'example.com', (c) => { c.eval = undefined; });
  run(ctx, 'window.eval = (code) => "wykonano: " + code;');
  // proxy jest zakładane na eval w chwili uruchomienia – instalujemy ponownie po ustawieniu atrapy
  runScriptlets(ctx, [['noeval-if', 'adblock']]);
  assert.equal(run(ctx, 'eval("adblock()")'), undefined);
  assert.equal(run(ctx, 'eval("ok()")'), 'wykonano: ok()');
});

test('wyjątki #@#+js: wyłączenie konkretnego scriptletu i wszystkich ("*")', () => {
  const key = ['set-constant', 'x', '1'].join('\u0001');
  const ctx = createEnv('sub.example.com');
  runScriptlets(ctx, [['set-constant', 'x', '1']], { host: 'example.com', except: { 'sub.example.com': [key] } });
  assert.equal(run(ctx, 'typeof x'), 'undefined');
  const ctx2 = createEnv('sub.example.com');
  runScriptlets(ctx2, [['set-constant', 'y', '1']], { host: 'example.com', except: { 'example.com': ['*'] } });
  assert.equal(run(ctx2, 'typeof y'), 'undefined');
});

test('dopasowanie hosta: subdomeny i encje "nazwa.*"', () => {
  const ctx = createEnv('video.example.pl');
  runScriptlets(ctx, [['set-constant', 'z', '1']], { host: 'example.*' });
  assert.equal(run(ctx, 'z'), 1);
  const ctx2 = createEnv('other.com');
  runScriptlets(ctx2, [['set-constant', 'z', '1']], { host: 'example.com' });
  assert.equal(run(ctx2, 'typeof z'), 'undefined');
});
