// Paczka developerska (npm run package:dev) i instalator Windows.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
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

test('package:dev: czysty dist/ChromeBlock tylko z plikami rozszerzenia + ZIP zgodny z katalogiem', () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-dist-'));
  try {
    fs.writeFileSync(path.join(outDir, 'stary-plik.txt'), 'x'); // ma zniknąć (czysty build)
    const r = packageDev({ outDir });
    assert.ok(!fs.existsSync(path.join(outDir, 'stary-plik.txt')));
    assert.deepEqual(validatePackage(r.extDir), []);
    const files = listFiles(r.extDir);
    assert.ok(files.includes('manifest.json') && files.includes('background.js'));
    for (const f of files) assert.ok(!/^(tools|tests|docs|node_modules|installer|dist|_metadata)\//.test(f) && !/^(package\.json|README\.md)$/.test(f), f);
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
    assert.equal(r.version, manifest.version_name);

    const zip = readZip(fs.readFileSync(path.join(outDir, ZIP_NAME)));
    const extras = ['install-chromeblock.cmd', 'update-chromeblock.cmd', 'INSTALL.md', 'test-chromeblock.cmd', 'test-sites.cmd'];
    const tester = ['tester/package.json', 'tester/tests/local/chromeblock-local-test.mjs', 'tester/tests/local/single-blocker-sites.mjs',
      'tester/tests/local/sites-single-blocker.json', 'tester/tools/chromium-smoke.mjs',
      'tester/tests/e2e/lib/classify.mjs', 'tester/tests/e2e/lib/youtube-page.mjs'];
    for (const n of [...extras, ...tester]) assert.ok(zip.has(n), n);
    for (const f of files) assert.ok(zip.get(`${PACKAGE_NAME}/${f}`).equals(fs.readFileSync(path.join(r.extDir, f))), f);
    assert.equal(zip.size, files.length + extras.length + tester.length, 'nic poza rozszerzeniem, skryptami .cmd, INSTALL.md i minimalnym testerem');
  } finally { fs.rmSync(outDir, { recursive: true, force: true }); }
});

const cmd = (name) => fs.readFileSync(path.join(ROOT, 'installer', name), 'utf8');

test('instalator: stały katalog, chrome://extensions, ścieżka w schowku, 3 kroki', () => {
  const s = cmd('install-chromeblock.cmd');
  assert.match(s, /set "DEST=%LOCALAPPDATA%\\ChromeBlock"/);
  assert.match(s, /"chrome:\/\/extensions"/);
  assert.match(s, /set \/p "=%DEST%" \| clip/);
  assert.match(s, /1\. Wlacz "Tryb dewelopera"/);
  assert.match(s, /2\. Kliknij "Załaduj rozpakowane"/);
  assert.match(s, /3\. Wklej skopiowana sciezke/);
});

test('aktualizacja: podmienia pliki w tym samym katalogu', () => {
  const s = cmd('update-chromeblock.cmd');
  assert.match(s, /set "DEST=%LOCALAPPDATA%\\ChromeBlock"/);
  assert.match(s, /robocopy "%SRC%" "%DEST%" \/MIR/);
  assert.match(s, /install-chromeblock\.cmd/, 'bez instalacji odsyła do instalatora');
});

test('instalator nie zmienia polityk, rejestru ani nie instaluje rozszerzenia samodzielnie', () => {
  for (const name of ['install-chromeblock.cmd', 'update-chromeblock.cmd']) {
    const code = cmd(name).split(/\r?\n/).filter((l) => !/^\s*rem\b/i.test(l)).join('\n');
    assert.ok(!/\breg(\.exe)?\s+(add|delete|import|load)\b/i.test(code), `${name}: rejestr`);
    assert.ok(!/HKLM|HKCU|HKEY_|Policies|ExtensionInstallForcelist|ExtensionInstallAllowlist/i.test(code), `${name}: polityki`);
    assert.ok(!/--load-extension|--disable-extensions-except|External Extensions|\.crx\b|gpupdate|Set-ItemProperty|powershell/i.test(code), `${name}: instalacja bez wiedzy użytkownika`);
    assert.match(cmd(name), /\r\n/, `${name}: końce linii CRLF`);
  }
});
