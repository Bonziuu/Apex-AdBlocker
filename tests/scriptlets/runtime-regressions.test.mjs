import test from 'node:test';
import assert from 'node:assert/strict';
import { createEnv, runScriptlets, run, plain, tick } from '../helpers/scriptlet-env.mjs';
import { findLine, scriptletCallFromLine } from '../helpers/lists.mjs';

test('bundled no-fetch-if preserves the complete URL and leaves unrelated HTTPS requests alone', async () => {
  const call = scriptletCallFromLine(findLine(/^pvpoke-re\.com##\+js\(no-fetch-if,/));
  const ctx = createEnv('pvpoke-re.com');
  run(ctx, "__respond = () => ({ body: 'REAL' });");
  runScriptlets(ctx, [call]);
  assert.equal(await run(ctx, "fetch('https://pvpoke-re.com/api/data').then(r => r.text())"), 'REAL');
  const target = call[1].split(' ')[0].slice('url:'.length);
  ctx.targetUrl = target;
  assert.equal(await run(ctx, 'fetch(targetUrl, { method: "HEAD", mode: "no-cors" }).then(r => r.text())'), '');
  assert.deepEqual(plain(run(ctx, '__fetchLog')), ['https://pvpoke-re.com/api/data']);
});

test('fetch matching preserves colons in explicit URL patterns and implicit regular expressions', async () => {
  for (const pattern of [
    'url:https://ads.example:8443/track',
    String.raw`url:/^https?:\/\/ads\.example:8443\/track/`,
    String.raw`/^https?:\/\/ads\.example:8443\/track/`,
  ]) {
    const ctx = createEnv();
    run(ctx, "__respond = () => ({ body: 'REAL' });");
    runScriptlets(ctx, [['prevent-fetch', pattern]]);
    assert.equal(await run(ctx, "fetch('https://ordinary.example:8443/track').then(r => r.text())"), 'REAL', pattern);
    assert.equal(await run(ctx, "fetch('https://ads.example:8443/track').then(r => r.text())"), '', pattern);
  }
});

test('global matching expressions give the same result on repeated fetches and timers', async () => {
  const ctx = createEnv();
  const timerCalls = [];
  ctx.setTimeout = (fn) => { fn(); return 1; };
  ctx.recordTimer = (value) => timerCalls.push(value);
  run(ctx, "__respond = () => ({ body: 'REAL' });");
  runScriptlets(ctx, [['prevent-fetch', '/ads/g'], ['prevent-setTimeout', '/adTask/g', '10']]);
  const responses = await run(ctx, "Promise.all([0, 1, 2].map(() => fetch('https://ads.example/').then(r => r.text())))");
  assert.deepEqual(plain(responses), ['', '', '']);
  run(ctx, `for (let i = 0; i < 3; i++) setTimeout(function adTask() { recordTimer('blocked'); }, 10);
    setTimeout(function ordinaryTask() { recordTimer('allowed'); }, 10);`);
  assert.deepEqual(timerCalls, ['allowed']);
});

test('JSON XHR transforms invalidate an early null response and reset on reopen', () => {
  const ctx = createEnv();
  run(ctx, "__xhrRespond = () => '{\"ad\":1,\"content\":\"first\"}';");
  runScriptlets(ctx, [['json-prune-xhr-response', 'ad', '', 'propsToMatch', '/player']]);
  assert.equal(run(ctx, `var x = new XMLHttpRequest(); x.open('GET', '/player'); x.responseType = 'json'; x.response;`), null);
  run(ctx, 'x.send();');
  assert.deepEqual(plain(run(ctx, 'x.response')), { content: 'first' });
  assert.equal(run(ctx, 'x.response === x.response'), true, 'completed JSON response remains stable');
  run(ctx, "__xhrRespond = () => '{\"ad\":2,\"content\":\"second\"}'; x.open('GET', '/player');");
  assert.equal(run(ctx, 'x.response'), null, 'reopening resets the native response');
  run(ctx, 'x.send();');
  assert.deepEqual(plain(run(ctx, 'x.response')), { content: 'second' });
  run(ctx, "x.open('GET', '/other'); x.send();");
  assert.deepEqual(plain(run(ctx, 'x.response')), { ad: 2, content: 'second' }, 'nonmatching request is not transformed');
});

test('JSON XHR native parsing does not run a JSON.parse scriptlet', () => {
  const ctx = createEnv();
  run(ctx, "__xhrRespond = () => '{\"ad\":1,\"content\":\"ok\"}';");
  runScriptlets(ctx, [['json-prune', 'ad']]);
  assert.deepEqual(plain(run(ctx, `var x = new XMLHttpRequest(); x.open('GET', '/api'); x.responseType = 'json'; x.send(); x.response;`)), { ad: 1, content: 'ok' });
});

function attributeEnv(behavior) {
  const ctx = createEnv();
  run(ctx, `var element = {
    attrs: { onclick: 'track()' },
    hasAttribute(name) { return Object.hasOwn(this.attrs, name); },
    removeAttribute(name) { delete this.attrs[name]; },
    matches() { return this.hasAttribute('onclick'); },
  };
  document.querySelectorAll = () => element.hasAttribute('onclick') ? [element] : [];`);
  runScriptlets(ctx, [['remove-attr', 'onclick', 'button', behavior]]);
  return ctx;
}

test('remove-attr stay removes an attribute restored on an existing element, including asap mode', async () => {
  for (const behavior of ['stay', 'asap stay']) {
    const ctx = attributeEnv(behavior);
    assert.equal(run(ctx, 'element.hasAttribute("onclick")'), false, behavior);
    for (let i = 0; i < 2; i++) {
      run(ctx, "element.attrs.onclick = 'track()'; __mutateAttribute(element, 'onclick');");
      await tick(5);
      assert.equal(run(ctx, 'element.hasAttribute("onclick")'), false, behavior);
    }
  }
});

test('remove-attr without stay remains a one-time change', async () => {
  const ctx = attributeEnv('');
  assert.equal(run(ctx, 'element.hasAttribute("onclick")'), false);
  run(ctx, "element.attrs.onclick = 'track()'; __mutateAttribute(element, 'onclick');");
  await tick(5);
  assert.equal(run(ctx, 'element.hasAttribute("onclick")'), true);
});
