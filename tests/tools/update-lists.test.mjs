import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { updateLists, validateDownloadedList, FILES as UPSTREAM_FILES } from '../../tools/update-lists.mjs';

const FILES = { 'a.txt': 'https://lists.example/a', 'nested/b.txt': 'https://lists.example/b' };
const TEXT = '! Title: Test filter list\n' + '||ads.example^\n'.repeat(12);
const noSnapshot = () => new Map();
function fixture() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-update-test-'));
  const dir = path.join(tmp, 'lists');
  fs.mkdirSync(path.join(dir, 'nested'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'a.txt'), 'old A');
  fs.writeFileSync(path.join(dir, 'nested/b.txt'), 'old B');
  fs.writeFileSync(path.join(dir, 'unused.txt'), 'retained');
  return { tmp, dir, cleanup: () => fs.rmSync(tmp, { recursive: true, force: true }) };
}
const defaults = { files: FILES, snapshot: noSnapshot, baseline: { gaps: [] }, log: () => {} };
function assertOriginal(dir) {
  assert.equal(fs.readFileSync(path.join(dir, 'a.txt'), 'utf8'), 'old A');
  assert.equal(fs.readFileSync(path.join(dir, 'nested/b.txt'), 'utf8'), 'old B');
}

test('update: all or partial download failure preserves the complete prior snapshot', async () => {
  for (const allFail of [false, true]) {
    const f = fixture();
    try {
      await assert.rejects(updateLists({ ...defaults, dir: f.dir, fetchImpl: async (url) => {
        if (allFail || url.endsWith('/b')) throw new Error('network unavailable');
        return { ok: true, text: async () => TEXT };
      } }), /Poprzedni snapshot pozostaje bez zmian/);
      assertOriginal(f.dir);
      assert.deepEqual(fs.readdirSync(f.tmp), ['lists'], 'staging cleaned up');
    } finally { f.cleanup(); }
  }
});

test('update: a complete valid batch replaces both files and preserves unrelated snapshots', async () => {
  const f = fixture();
  try {
    const r = await updateLists({ ...defaults, dir: f.dir, fetchImpl: async (url) => ({ ok: true, text: async () => TEXT + url }) });
    assert.equal(r.files, 2);
    assert.equal(fs.readFileSync(path.join(f.dir, 'a.txt'), 'utf8'), TEXT + FILES['a.txt']);
    assert.equal(fs.readFileSync(path.join(f.dir, 'nested/b.txt'), 'utf8'), TEXT + FILES['nested/b.txt']);
    assert.equal(fs.readFileSync(path.join(f.dir, 'unused.txt'), 'utf8'), 'retained');
    assert.deepEqual(fs.readdirSync(f.tmp), ['lists']);
  } finally { f.cleanup(); }
});

test('update: new incompatible YouTube filters are rejected before replacing snapshots', async () => {
  const f = fixture();
  try {
    await assert.rejects(updateLists({ ...defaults, dir: f.dir,
      fetchImpl: async () => ({ ok: true, text: async () => TEXT }),
      snapshot: (dir) => dir === f.dir ? new Map() : new Map([['new filter', { line: 'new filter', status: 'unsupported', name: 'new', reason: 'unsupported' }]]),
    }), (e) => e.exitCode === 2);
    assertOriginal(f.dir);
  } finally { f.cleanup(); }
});

test('update: short/HTTP-invalid responses cannot replace a snapshot', async () => {
  for (const res of [{ ok: false, status: 503 }, { ok: true, text: async () => 'oops' },
    {ok:true,text:async()=>'<html>'+('Server unavailable'.repeat(20))+'</html>'},
    {ok:true,headers:{get:()=> 'text/html; charset=utf-8'},text:async()=>TEXT},
    {ok:true,text:async()=> '! Title: Empty list\n'+('! comment only\n'.repeat(20))},
    {ok:true,text:async()=> '! SECTION: Error response\n<html>'+('Server unavailable'.repeat(20))+'</html>'},
    {ok:true,text:async()=> '!#if !ext_ubol\n'+('! comment only\n'.repeat(20))+'!#endif\n'},
    {ok:true,text:async()=> 'Temporary failure. '.repeat(20)},
  ]) {
    const f = fixture();
    try {
      await assert.rejects(updateLists({ ...defaults, dir: f.dir, fetchImpl: async () => res }));
      assertOriginal(f.dir);
    } finally { f.cleanup(); }
  }
});

test('update: every configured bundled upstream snapshot passes content validation without network requests', () => {
  const root = new URL('../../tools/lists/',import.meta.url);
  for (const file of Object.keys(UPSTREAM_FILES)) {
    assert.doesNotThrow(()=>validateDownloadedList(fs.readFileSync(new URL(file,root),'utf8'),'text/plain'),file);
  }
});

test('update: uAssets fragments with section comments or preprocessing directives need real filters', () => {
  const filters='||ads.example^\n'.repeat(12);
  for (const header of ['! SECTION: Popular revolving adservers\n', '!#include common.txt\n', '!#if !ext_ubol\n']) {
    assert.doesNotThrow(()=>validateDownloadedList(header+filters));
    assert.throws(()=>validateDownloadedList(header+'! still no filters\n'.repeat(12)),/rozpoznawalnych filtrów/);
    assert.throws(()=>validateDownloadedList(header+'<html>Temporary error</html>\n'+filters),/nie jest tekstową listą/);
  }
});

test('update: failure promoting staging restores the old directory', async () => {
  const f = fixture();
  try {
    let n = 0;
    await assert.rejects(updateLists({ ...defaults, dir: f.dir,
      fetchImpl: async () => ({ ok: true, text: async () => TEXT }),
      rename: (from, to) => { if (++n === 2) throw new Error('promotion failed'); fs.renameSync(from, to); },
    }), /promotion failed/);
    assertOriginal(f.dir);
    assert.deepEqual(fs.readdirSync(f.tmp), ['lists']);
  } finally { f.cleanup(); }
});
