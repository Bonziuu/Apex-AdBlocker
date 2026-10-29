import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { crc32 } from '../../tools/package-dev.mjs';
import {
  CHECKSUMS_NAME,
  LATEST_ZIP_NAME,
  packageRelease,
  startHereText,
} from '../../tools/package-release.mjs';

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

test('package:release: gotowy ZIP użytkownika + stała nazwa + SHA256', () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-release-'));
  try {
    const r = packageRelease({ outDir });
    const versioned = fs.readFileSync(r.versionedZipPath);
    const latest = fs.readFileSync(r.latestZipPath);

    assert.equal(r.versionedZipName, `ChromeBlock-${r.version}.zip`);
    assert.equal(path.basename(r.latestZipPath), LATEST_ZIP_NAME);
    assert.ok(versioned.equals(latest), 'wersjonowany ZIP i ChromeBlock.zip są identyczne');
    assert.ok(!fs.existsSync(path.join(outDir, 'ChromeBlock-dev.zip')), 'brak deweloperskiego ZIP-a');

    const zip = readZip(versioned);
    assert.ok(zip.has('START-HERE.txt'));
    assert.ok(zip.has('ChromeBlock/manifest.json'));
    assert.ok(zip.has('ChromeBlock/THIRD_PARTY_NOTICES.md'));
    assert.match(zip.get('START-HERE.txt').toString('utf8'), /chrome:\/\/extensions/);
    assert.match(zip.get('START-HERE.txt').toString('utf8'), /nie usuwaj ani nie przenoś folderu ChromeBlock/i);
    assert.equal(zip.get('START-HERE.txt').toString('utf8'), startHereText(r.version));

    for (const name of zip.keys()) {
      if (name === 'START-HERE.txt') continue;
      assert.ok(name.startsWith('ChromeBlock/'), name);
      assert.doesNotMatch(name, /(^|\/)(tools|tests|docs|node_modules|\.git)(\/|$)/, name);
    }

    const digest = crypto.createHash('sha256').update(versioned).digest('hex');
    assert.equal(r.sha256, digest);
    const sums = fs.readFileSync(path.join(outDir, CHECKSUMS_NAME), 'utf8');
    assert.match(sums, new RegExp(`^${digest}  ChromeBlock-${r.version.replace(/\./g, '\\.') }\\.zip$`, 'm'));
    assert.match(sums, new RegExp(`^${digest}  ChromeBlock\\.zip$`, 'm'));
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test('README prowadzi użytkownika do Releases, a szczegóły są w docs/INSTALLATION.md', () => {
  const root = path.resolve(import.meta.dirname, '../..');
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const install = fs.readFileSync(path.join(root, 'docs', 'INSTALLATION.md'), 'utf8');
  assert.match(readme, /releases\/latest/);
  assert.match(readme, /Załaduj rozpakowane/);
  assert.match(readme, /docs\/INSTALLATION\.md/);
  assert.match(install, /nie usuwaj ani nie przenoś folderu `ChromeBlock`/i);
  assert.match(install, /SHA256SUMS\.txt/);
});
