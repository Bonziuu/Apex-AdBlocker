import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { compileList, shardScriptlets, loadScriptletLibrary } from '../../tools/build.mjs';
import { createEnv, run } from '../helpers/scriptlet-env.mjs';

const helper = fs.readFileSync(new URL('../../shared/entity-hosts.js', import.meta.url), 'utf8');
const library = loadScriptletLibrary();
const marker = "globalThis[Symbol.for('ApexAdBlocker.scriptletShards.v1')]";

function fixture(lines, listId = 'test') {
  const compiled = compileList(listId, lines.map((line) => ({ line, trusted: true })), { badfilters: new Set(), gunhide: new Set() });
  return shardScriptlets(listId, 'Test', compiled, library);
}
function page(host, { withHelper = true } = {}) {
  if (withHelper) {
    const ctx = createEnv(host);
    run(ctx, 'var delays = []; window.setTimeout = function(fn, ms) { delays.push(ms); return 1; };');
    return ctx;
  }
  // A real MAIN-world shard needs only these DOM primitives for timer hooks.
  // Omit the PSL helper deliberately, then load its actual packaged source later.
  const ctx = vm.createContext({ location: { hostname: host }, URL });
  run(ctx, `var window = globalThis; var document = {};
    class Node { get textContent() { return ''; } }
    var delays = []; window.setTimeout = function(fn, ms) { delays.push(ms); return 1; };`);
  return ctx;
}
function callTimer(ctx, name = 'adCallback') {
  run(ctx, `setTimeout(function ${name}() {}, 1000)`);
  return run(ctx, 'delays[delays.length - 1]');
}

test('an actual generated shard installs its timer hook once despite a lost reply and worker retry', () => {
  const [file] = fixture(['video.example##+js(adjust-setTimeout, adCallback, *, 0.5)']);
  const ctx = page('video.example');
  run(ctx, file.js);
  assert.equal(callTimer(ctx), 500);
  run(ctx, file.js); // Same document after the worker's in-memory map was lost.
  assert.equal(callTimer(ctx), 500, 'a duplicate hook would multiply twice and produce 250');
  assert.equal(run(ctx, `${marker}.size`), 1);
});

test('each new document gets its own installation and distinct shards retain their own hooks', () => {
  const [ads] = fixture(['video.example##+js(adjust-setTimeout, adCallback, *, 0.5)'], 'ads');
  const [privacy] = fixture(['video.example##+js(adjust-setTimeout, trackerCallback, *, 0.25)'], 'privacy');
  for (let document = 0; document < 2; document++) {
    const ctx = page('video.example');
    for (const file of [ads, privacy, ads, privacy]) run(ctx, file.js);
    assert.equal(callTimer(ctx), 500);
    assert.equal(callTimer(ctx, 'trackerCallback'), 250);
    assert.equal(run(ctx, `${marker}.size`), 2);
  }
});

test('a changed packaged shard can run while retries of that source remain idempotent', () => {
  const [before] = fixture(['video.example##+js(adjust-setTimeout, adCallback, *, 0.5)']);
  const [after] = fixture(['video.example##+js(adjust-setTimeout, trackerCallback, *, 0.25)']);
  assert.equal(before.file, after.file, 'the file ID is reused across packaged revisions');
  const ctx = page('video.example');
  for (const file of [before, after, before, after]) run(ctx, file.js);
  assert.equal(callTimer(ctx), 500);
  assert.equal(callTimer(ctx, 'trackerCallback'), 250);
  assert.equal(run(ctx, `${marker}.size`), 2);
});

test('a missing helper does not consume the ordinary shard marker when entity exceptions need it', () => {
  const [file] = fixture([
    'video.example##+js(adjust-setTimeout, adCallback, *, 0.5)',
    'excluded.*#@#+js(adjust-setTimeout, adCallback, *, 0.5)',
  ]);
  const ctx = page('video.example', { withHelper: false });
  run(ctx, file.js);
  assert.equal(callTimer(ctx), 1000);
  assert.equal(run(ctx, `typeof ${marker}`), 'undefined');
  run(ctx, helper);
  run(ctx, file.js);
  run(ctx, file.js);
  assert.equal(callTimer(ctx), 500, 'the retry with its prerequisite now installs exactly once');
});

test('entity early guards stay cheap and a missing helper allows a later successful retry', () => {
  const [file] = fixture(['video.*##+js(adjust-setTimeout, adCallback, *, 0.5)']);
  const unrelated = vm.createContext({ location: { hostname: 'unrelated.example' } });
  assert.doesNotThrow(() => run(unrelated, file.js), 'an unrelated page needs no DOM/library primitives');
  assert.equal(run(unrelated, `typeof ${marker}`), 'undefined');

  const ctx = page('video.com', { withHelper: false });
  run(ctx, file.js);
  assert.equal(callTimer(ctx), 1000);
  assert.equal(run(ctx, `typeof ${marker}`), 'undefined');
  run(ctx, helper);
  run(ctx, file.js);
  run(ctx, file.js);
  assert.equal(callTimer(ctx), 500);
  assert.equal(run(ctx, `${marker}.size`), 1);
});
