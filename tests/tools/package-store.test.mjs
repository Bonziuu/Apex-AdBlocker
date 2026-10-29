import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { crc32 } from '../../tools/package-dev.mjs';
import { packageStore } from '../../tools/package-store.mjs';

function readZip(buf) {
  const end = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  assert.ok(end >= 0, 'ZIP: brak EOCD');
  const count = buf.readUInt16LE(end + 10);
  let p = buf.readUInt32LE(end + 16);
  const out = new Map();
  for (let i = 0; i < count; i++) {
    assert.equal(buf.readUInt32LE(p), 0x02014b50);
    const method = buf.readUInt16LE(p + 10);
    const crc = buf.readUInt32LE(p + 16);
    const csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28);
    const off = buf.readUInt32LE(p + 42);
    const name = buf.subarray(p + 46, p + 46 + nlen).toString('utf8');
    const lnlen = buf.readUInt16LE(off + 26);
    const body = buf.subarray(off + 30 + lnlen, off + 30 + lnlen + csize);
    const data = method === 8 ? zlib.inflateRawSync(body) : Buffer.from(body);
    assert.equal(crc32(data), crc, `CRC ${name}`);
    out.set(name, data);
    p += 46 + nlen;
  }
  return out;
}

test('package:store: ZIP ma manifest.json w root i tylko pliki rozszerzenia', () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-store-'));
  try {
    const r = packageStore({ outDir });
    assert.equal(r.zipName, `Apex-AdBlocker-WebStore-${r.version}.zip`);
    assert.ok(fs.existsSync(r.zipPath));
    assert.ok(!fs.existsSync(path.join(outDir, 'Apex-AdBlocker-dev.zip')));

    const zip = readZip(fs.readFileSync(r.zipPath));
    assert.ok(zip.has('manifest.json'), 'manifest.json musi być w katalogu głównym ZIP-a');
    assert.ok(zip.has('THIRD_PARTY_NOTICES.md'));
    assert.ok(!zip.has('START-HERE.txt'));
    assert.ok(![...zip.keys()].some((name) => name.startsWith('Apex-AdBlocker/')));

    for (const name of zip.keys()) {
      assert.doesNotMatch(name, /(^|\/)(tools|tests|docs|node_modules|\.git|dist)(\/|$)/, name);
    }

    const manifest = JSON.parse(zip.get('manifest.json').toString('utf8'));
    assert.equal(manifest.name, 'Apex AdBlocker');
    assert.equal(manifest.version, r.version);
    assert.equal(manifest.manifest_version, 3);
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test('package:store: build jest deterministyczny', () => {
  const a = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-store-a-'));
  const b = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-store-b-'));
  try {
    const ra = packageStore({ outDir: a });
    const rb = packageStore({ outDir: b });
    assert.ok(fs.readFileSync(ra.zipPath).equals(fs.readFileSync(rb.zipPath)));
  } finally {
    fs.rmSync(a, { recursive: true, force: true });
    fs.rmSync(b, { recursive: true, force: true });
  }
});
