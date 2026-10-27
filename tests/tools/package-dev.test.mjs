// Czysta paczka rozszerzenia (npm run package:dev): dist/ChromeBlock + ZIP tylko z rozszerzeniem.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { EXTENSION_ENTRIES } from '../../tools/chromium-smoke.mjs';
import {
  packageDev, validatePackage, manifestReferences, listFiles, createZip, crc32, ROOT, ZIP_NAME, PACKAGE_NAME,
} from '../../tools/package-dev.mjs';

/** Minimalny czytnik ZIP (katalog centralny) do weryfikacji. */
function readZip(buf) {
  const end = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
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

test('crc32: znany wektor', () => {
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
});

test('createZip: archiwum odczytywalne, nazwy UTF-8, deflate i store', () => {
  const entries = [
    { name: 'a.txt', data: Buffer.from('x'.repeat(1000)) },
    { name: 'ChromeBlock/ł.json', data: Buffer.from('{}') },
  ];
  const files = readZip(createZip(entries));
  assert.deepEqual([...files.keys()], ['a.txt', 'ChromeBlock/ł.json']);
  assert.equal(files.get('a.txt').toString(), 'x'.repeat(1000));
});

test('manifestReferences: wszystkie pliki wskazane w manifeście', () => {
  const refs = manifestReferences({
    background: { service_worker: 'background.js' },
    icons: { 16: 'icons/a.png' },
    action: { default_popup: 'popup/p.html' },
    options_page: 'options/o.html',
    content_scripts: [{ js: ['content/c.js'], css: ['content/c.css'] }],
    declarative_net_request: { rule_resources: [{ path: 'rules/ads.json' }] },
    web_accessible_resources: [{ resources: ['war/*', 'war/x.js'] }],
  });
  assert.deepEqual(refs, ['background.js', 'content/c.css', 'content/c.js', 'icons/a.png', 'options/o.html', 'popup/p.html', 'rules/ads.json', 'war/x.js']);
});

test('validatePackage: brak pliku z manifestu i pliki deweloperskie są wykrywane', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-pkg-'));
  try {
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ manifest_version: 3, background: { service_worker: 'background.js' } }));
    fs.mkdirSync(path.join(dir, 'tools'));
    fs.writeFileSync(path.join(dir, 'tools', 'build.mjs'), '');
    const p = validatePackage(dir);
    assert.ok(p.includes('brak pliku z manifestu: background.js'));
    assert.ok(p.includes('zbędny plik w paczce: tools/build.mjs'));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('package:dev: czysty dist/ChromeBlock tylko z plikami rozszerzenia + ZIP wyłącznie z rozszerzeniem', () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-dist-'));
  try {
    fs.writeFileSync(path.join(outDir, 'stary-plik.txt'), 'x'); // ma zniknąć (czysty build)
    const r = packageDev({ outDir });
    assert.ok(!fs.existsSync(path.join(outDir, 'stary-plik.txt')));
    assert.deepEqual(fs.readdirSync(outDir).sort(), [PACKAGE_NAME, ZIP_NAME].sort(), 'w dist/ tylko rozszerzenie i ZIP');
    assert.deepEqual(validatePackage(r.extDir), []);
    const files = listFiles(r.extDir);
    assert.ok(files.includes('manifest.json') && files.includes('background.js'));
    for (const f of files) {
      assert.ok(EXTENSION_ENTRIES.includes(f.split('/')[0]), `spoza EXTENSION_ENTRIES: ${f}`);
      assert.ok(!/^(tools|tests|docs|node_modules|installer|download|tester|dist|_metadata|\.git)\//.test(f) && !/^(package\.json|README\.md|INSTALL\.md)$/.test(f), f);
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
    assert.equal(r.version, manifest.version);

    // ZIP: dokładnie pliki rozszerzenia w folderze ChromeBlock/, bajt w bajt
    const buf = fs.readFileSync(path.join(outDir, ZIP_NAME));
    const zip = readZip(buf);
    assert.deepEqual([...zip.keys()].sort(), files.map((f) => `${PACKAGE_NAME}/${f}`).sort());
    for (const f of files) assert.ok(zip.get(`${PACKAGE_NAME}/${f}`).equals(fs.readFileSync(path.join(r.extDir, f))), f);
    for (const n of zip.keys()) {
      assert.ok(n.startsWith(`${PACKAGE_NAME}/`), n);
      assert.doesNotMatch(n, /\.cmd$|INSTALL\.md|(^|\/)tester\/|node_modules|(^|\/)\.git(\/|$)|^ChromeBlock\/(tools|tests|docs)\//, n);
    }
    assert.equal(r.zipBytes, buf.length);

    // deterministyczny: drugi build daje identyczny ZIP
    const outDir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-dist-'));
    try {
      packageDev({ outDir: outDir2 });
      assert.ok(fs.readFileSync(path.join(outDir2, ZIP_NAME)).equals(buf), 'ZIP bajt w bajt taki sam');
    } finally { fs.rmSync(outDir2, { recursive: true, force: true }); }
  } finally { fs.rmSync(outDir, { recursive: true, force: true }); }
});

test('repozytorium: bez commitowanego ZIP-a, instalatora i INSTALL.md', () => {
  for (const f of ['download/ChromeBlock-dev.zip', 'installer/install-chromeblock.cmd', 'installer/update-chromeblock.cmd', 'INSTALL.md']) {
    assert.ok(!fs.existsSync(path.join(ROOT, f)), f);
  }
  const ignore = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
  assert.match(ignore, /^\*\.zip$/m);
  assert.match(ignore, /^dist\/$/m);
  assert.doesNotMatch(ignore, /^!.*\.zip$/m, 'bez wyjątku dla ZIP-a');
});
