// Entity domains cannot be represented by Chrome match patterns. Keep normal
// shards targeted and verify the early guard of the single broad entity shard.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { hostPatterns, splitShardMatches, compileList, shardScriptlets, loadScriptletLibrary } from '../../tools/build.mjs';
import { ROOT } from '../../tools/lists-config.mjs';
import { createEnv, run } from '../helpers/scriptlet-env.mjs';

const DEFAULT_LISTS = ['ads', 'privacy', 'security'];
const meta = (id) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', `${id}.scriptlets.json`), 'utf8'));
const source = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const hostsOf = (file) => Object.keys(JSON.parse(/const HOSTS = (\{.*\});/.exec(source(file))[1]));
function hostMatches(pattern, host) {
  if (pattern === '*://*/*') return true;
  const m = /^\*:\/\/(\*\.)?([^/]+)\/\*$/.exec(pattern);
  return !!m && (host === m[2] || (!!m[1] && host.endsWith('.' + m[2])));
}
function fixture(lines, lib = loadScriptletLibrary()) {
  const compiled = compileList('test', lines.map((line) => ({ line, trusted: true })), { badfilters: new Set(), gunhide: new Set() });
  return shardScriptlets('test', 'Test', compiled, lib);
}
function inject(files, ctx, host = ctx.location.hostname) {
  for (const f of files) if ([...f.matches, ...f.sessionMatches].some((p) => hostMatches(p, host))) {
    for (const prerequisite of f.jsBefore || []) run(ctx, source(prerequisite));
    run(ctx, f.js);
  }
}

test('ordinary host patterns stay targeted; entities require their guarded shard', () => {
  assert.deepEqual(hostPatterns('google.*'), [], 'never pretend a short TLD expansion covers an entity');
  assert.deepEqual(hostPatterns('example.com'), ['*://*.example.com/*']);
  assert.deepEqual(hostPatterns('1.2.3.4'), ['*://1.2.3.4/*']);
  const split = splitShardMatches(['example.com', 'example.com', 'sub.example.com', 'google.*']);
  assert.deepEqual(split, { matches: ['*://*.example.com/*', '*://*.sub.example.com/*'], sessionMatches: [] });
  assert.ok(!split.matches.some((p) => hostMatches(p, 'unrelated.example')));
});

test('entity scriptlets execute on regional and previously unknown suffixes', () => {
  const files = fixture(['www.google.*##+js(set, rwt, noopFunc)']);
  assert.equal(files.length, 1);
  assert.deepEqual(files[0].matches, ['*://*/*']);
  assert.deepEqual(files[0].sessionMatches, [], 'one persistent registration works after browser restart');
  for (const host of ['www.google.fr', 'www.google.it', 'www.google.es', 'www.google.co.jp', 'www.google.pl', 'sub.www.google.newtld', 'www.google.k12.ca.us', 'www.google.s3.us-west-2.amazonaws.com']) {
    const ctx = createEnv(host);
    inject(files, ctx);
    assert.equal(run(ctx, 'typeof rwt'), 'function', host);
    assert.equal(run(ctx, 'rwt()'), undefined, host);
  }
});

test('unrelated domains return before library initialization or page hooks', () => {
  const [file] = fixture(['www.google.*##+js(set, rwt, noopFunc)'], 'throw new Error("Library was initialized on an unrelated host");');
  for (const host of ['example.org', 'www.wikipedia.org', 'www.notgoogle.fr', 'www.google.fr.attacker.example', 'www.google.attacker.com', 'www.google.attacker.co.jp']) {
    const context = vm.createContext({ location: { hostname: host } });
    for (const prerequisite of file.jsBefore || []) vm.runInContext(source(prerequisite), context);
    assert.doesNotThrow(() => vm.runInContext(file.js, context), host);
  }
});

test('entity guard preserves ancestorOrigins fallback and list exceptions', () => {
  const files = fixture([
    'www.google.*##+js(set, marker, true)',
    'www.google.fr#@#+js(set, marker, true)',
  ]);
  const child = createEnv('');
  child.location.ancestorOrigins = ['https://www.google.it'];
  inject(files, child, 'www.google.it');
  assert.equal(run(child, 'marker'), true, 'about:blank child inherits the same host scope as runForHost');
  const excluded = createEnv('www.google.fr');
  inject(files, excluded);
  assert.equal(run(excluded, 'typeof marker'), 'undefined');
});

test('overlapping normal and entity scopes install each hook only once in either order', () => {
  const files = fixture([
    'www.google.*##+js(adjust-setTimeout, adCallback, *, 0.5)',
    'www.google.fr##+js(adjust-setTimeout, adCallback, *, 0.5)',
    'www.google.*##+js(set, entityOnly, true)',
    'www.google.fr##+js(set, normalOnly, true)',
  ]);
  assert.equal(files.filter((f) => f.file.endsWith('-entities.js')).length, 1);
  assert.ok(files.some((f) => f.matches.includes('*://*.www.google.fr/*')));
  for (const order of [files, [...files].reverse()]) {
    const ctx = createEnv('www.google.fr');
    run(ctx, 'var delays=[]; window.setTimeout = function(fn,ms) { delays.push(ms); };');
    inject(order, ctx);
    run(ctx, 'setTimeout(function adCallback() {}, 1000)');
    assert.equal(run(ctx, 'delays[0]'), 500, 'a duplicate hook would apply the multiplier twice (250)');
    assert.equal(run(ctx, 'entityOnly'), true);
    assert.equal(run(ctx, 'normalOnly'), true);
  }
});

test('saved artifacts: at most one guarded entity shard per list, ordinary shards remain targeted', () => {
  let ordinaryPatterns = 0;
  for (const id of DEFAULT_LISTS) {
    const files = meta(id);
    assert.ok(files.filter((f) => f.file.endsWith('-entities.js')).length <= 1, id);
    for (const f of files) {
      assert.deepEqual(f.sessionMatches, [], f.file);
      if (f.file.endsWith('-entities.js')) {
        assert.deepEqual(f.matches, ['*://*/*']);
        assert.ok(hostsOf(f.file).every((h) => h.endsWith('.*')));
        assert.ok(source(f.file).indexOf('if (!applies) return;') < source(f.file).indexOf('const CALLS = '));
      } else {
        const hosts = hostsOf(f.file);
        assert.ok(hosts.every((h) => !h.endsWith('.*')), f.file);
        assert.deepEqual(f.matches, [...new Set(hosts.flatMap(hostPatterns))].sort(), f.file);
        ordinaryPatterns += f.matches.length;
      }
    }
  }
  assert.ok(ordinaryPatterns < 25000, `persistent targeted patterns: ${ordinaryPatterns}; no large entity TLD expansion`);
});

test('YouTube ordinary scopes remain persistent and unrelated hosts only receive the guarded shard', () => {
  const files = DEFAULT_LISTS.flatMap(meta);
  const targeted = files.filter((f) => !f.file.endsWith('-entities.js'));
  assert.ok(targeted.some((f) => f.matches.includes('*://*.youtube.com/*')));
  for (const host of ['example.org', 'www.wikipedia.org', 'en.wikipedia.org', 'docs.python.org', 'chromeblock-unrelated-test.dev']) {
    assert.ok(!targeted.some((f) => f.matches.some((p) => hostMatches(p, host))), host);
    for (const f of files.filter((file) => file.file.endsWith('-entities.js'))) {
      // Without page/DOM primitives, reaching library initialization would throw.
      assert.doesNotThrow(() => vm.runInNewContext(source(f.file), { location: { hostname: host } }), `${f.file}: ${host}`);
    }
  }
});


test('entity guard fails closed when its explicit prerequisite is missing', () => {
  const [file] = fixture(['www.google.*##+js(set, marker, true)'], 'globalThis.libraryExecuted=true;');
  const context = vm.createContext({ location: { hostname: 'www.google.co.jp' } });
  vm.runInContext(file.js, context);
  assert.equal(context.libraryExecuted, undefined);
});
