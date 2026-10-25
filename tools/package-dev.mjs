#!/usr/bin/env node
// ChromeBlock – paczka developerska dla osób bez Gita i terminala.
//
//   npm run package:dev
//
// Tworzy:
//   dist/ChromeBlock/            tylko pliki potrzebne rozszerzeniu (do „Załaduj rozpakowane”)
//   dist/install-chromeblock.cmd instalator Windows (kopiuje do %LOCALAPPDATA%\ChromeBlock)
//   dist/update-chromeblock.cmd  aktualizacja istniejącej instalacji (ten sam katalog)
//   dist/INSTALL.md              instrukcja dla osoby nietechnicznej
//   dist/test-chromeblock.cmd    lokalny test regresyjny (Node.js 20+, bez Gita)
//   dist/tester/                 minimalne pliki testera + package.json (zależność: playwright)
//   dist/ChromeBlock-dev.zip     wszystko powyżej w jednym pliku ZIP
//
// Bez zależności: ZIP jest zapisywany przez node:zlib. Paczka niczego nie instaluje sama –
// użytkownik ładuje rozszerzenie w Chrome własnoręcznie (Tryb dewelopera → Załaduj rozpakowane).

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { EXTENSION_ENTRIES } from './chromium-smoke.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PACKAGE_NAME = 'ChromeBlock';
export const ZIP_NAME = 'ChromeBlock-dev.zip';
export const EXTRA_FILES = [
  ['installer/install-chromeblock.cmd', 'install-chromeblock.cmd'],
  ['installer/update-chromeblock.cmd', 'update-chromeblock.cmd'],
  ['INSTALL.md', 'INSTALL.md'],
  ['test-chromeblock.cmd', 'test-chromeblock.cmd'],
];
export const TESTER_DIR = 'tester';
// minimalny zestaw plików testera – ten sam układ katalogów co w repozytorium (importy względne bez zmian)
export const TESTER_FILES = [
  'tests/local/chromeblock-local-test.mjs',
  'tools/chromium-smoke.mjs',
  'tests/e2e/lib/classify.mjs',
  'tests/e2e/lib/youtube-page.mjs',
];

/** package.json testera: tylko Playwright (wersja jak w repozytorium). */
export function testerPackageJson(rootPkg) {
  return {
    name: 'chromeblock-local-tester',
    private: true,
    description: 'ChromeBlock – lokalny test regresyjny (uruchom test-chromeblock.cmd)',
    type: 'module',
    engines: { node: '>=20' },
    dependencies: { playwright: rootPkg.devDependencies.playwright },
  };
}

/** Względne importy plików .mjs, które nie należą do zestawu (puste = zestaw domknięty). */
export function missingTesterImports(root = ROOT, files = TESTER_FILES) {
  const set = new Set(files);
  const missing = [];
  for (const f of files) {
    const src = fs.readFileSync(path.join(root, f), 'utf8');
    for (const m of src.matchAll(/(?:^|\n)\s*import\s[^;]*?from\s+['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(f), m[1]));
      if (!set.has(target)) missing.push(`${f} → ${target}`);
    }
  }
  return missing;
}
// stała data w ZIP → powtarzalna paczka
const ZIP_DATE = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));

/** Wszystkie pliki w katalogu (ścieżki względne z „/”, posortowane). */
export function listFiles(dir, base = dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(full, base));
    else if (e.isFile()) out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}

/** Ścieżki plików, na które wskazuje manifest (muszą istnieć w paczce). */
export function manifestReferences(manifest) {
  const refs = new Set();
  const add = (p) => { if (typeof p === 'string' && p && !p.includes('*')) refs.add(p.replace(/^\//, '')); };
  add(manifest.background && manifest.background.service_worker);
  for (const v of Object.values(manifest.icons || {})) add(v);
  const action = manifest.action || {};
  add(action.default_popup);
  for (const v of Object.values(action.default_icon || {})) add(v);
  add(manifest.options_page);
  add(manifest.options_ui && manifest.options_ui.page);
  for (const cs of manifest.content_scripts || []) { for (const f of cs.js || []) add(f); for (const f of cs.css || []) add(f); }
  for (const r of (manifest.declarative_net_request && manifest.declarative_net_request.rule_resources) || []) add(r.path);
  for (const w of manifest.web_accessible_resources || []) for (const f of w.resources || []) add(f);
  return [...refs].sort();
}

/** Sprawdza paczkę: manifest, odwołania i brak plików deweloperskich. Zwraca listę problemów. */
export function validatePackage(dir) {
  const problems = [];
  const mPath = path.join(dir, 'manifest.json');
  if (!fs.existsSync(mPath)) return ['brak manifest.json'];
  let manifest;
  try { manifest = JSON.parse(fs.readFileSync(mPath, 'utf8')); } catch (e) { return [`manifest.json: ${e.message}`]; }
  if (manifest.manifest_version !== 3) problems.push('manifest_version ≠ 3');
  for (const ref of manifestReferences(manifest)) {
    if (!fs.existsSync(path.join(dir, ref))) problems.push(`brak pliku z manifestu: ${ref}`);
  }
  for (const f of listFiles(dir)) {
    const top = f.split('/')[0];
    if (!EXTENSION_ENTRIES.includes(top)) problems.push(`zbędny plik w paczce: ${f}`);
    if (/(^|\/)(node_modules|\.git|_metadata)(\/|$)/.test(f)) problems.push(`zbędny plik w paczce: ${f}`);
  }
  return problems;
}

// --- ZIP (deflate, nazwy UTF-8) ---------------------------------------------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosDateTime(d) {
  const time = (d.getUTCHours() << 11) | (d.getUTCMinutes() << 5) | Math.floor(d.getUTCSeconds() / 2);
  const date = ((d.getUTCFullYear() - 1980) << 9) | ((d.getUTCMonth() + 1) << 5) | d.getUTCDate();
  return { time, date };
}

/**
 * Tworzy archiwum ZIP z listy wpisów.
 * @param {{name:string, data:Buffer}[]} entries
 * @returns {Buffer}
 */
export function createZip(entries) {
  const { time, date } = dosDateTime(ZIP_DATE);
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name, 'utf8');
    const deflated = zlib.deflateRawSync(e.data, { level: 9 });
    const useDeflate = deflated.length < e.data.length;
    const body = useDeflate ? deflated : e.data;
    const crc = crc32(e.data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);              // wersja do rozpakowania
    local.writeUInt16LE(0x0800, 6);          // flaga: nazwy w UTF-8
    local.writeUInt16LE(useDeflate ? 8 : 0, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(e.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, name, body);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(useDeflate ? 8 : 0, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20);
    central.writeUInt32LE(e.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);
    offset += local.length + name.length + body.length;
  }
  const centralSize = centrals.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

// --- Paczka -------------------------------------------------------------------

/** Buduje dist/ (czysty) i ZIP. Zwraca opis paczki. */
export function packageDev({ root = ROOT, outDir = path.join(root, 'dist') } = {}) {
  fs.rmSync(outDir, { recursive: true, force: true });
  const extDir = path.join(outDir, PACKAGE_NAME);
  fs.mkdirSync(extDir, { recursive: true });
  for (const entry of EXTENSION_ENTRIES) {
    const src = path.join(root, entry);
    if (fs.existsSync(src)) fs.cpSync(src, path.join(extDir, entry), { recursive: true });
  }
  const problems = validatePackage(extDir);
  if (problems.length) throw new Error(`Paczka niepoprawna:\n  - ${problems.join('\n  - ')}`);
  for (const [src, dest] of EXTRA_FILES) fs.copyFileSync(path.join(root, src), path.join(outDir, dest));

  // tester
  const missing = missingTesterImports(root);
  if (missing.length) throw new Error(`Tester: brakujące importy w paczce:\n  - ${missing.join('\n  - ')}`);
  const testerDir = path.join(outDir, TESTER_DIR);
  for (const f of TESTER_FILES) {
    fs.mkdirSync(path.dirname(path.join(testerDir, f)), { recursive: true });
    fs.copyFileSync(path.join(root, f), path.join(testerDir, f));
  }
  const rootPkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  fs.writeFileSync(path.join(testerDir, 'package.json'), JSON.stringify(testerPackageJson(rootPkg), null, 2) + '\n');
  const testerFiles = listFiles(testerDir);

  const files = listFiles(extDir);
  const entries = [
    ...EXTRA_FILES.map(([, dest]) => ({ name: dest, data: fs.readFileSync(path.join(outDir, dest)) })),
    ...testerFiles.map((f) => ({ name: `${TESTER_DIR}/${f}`, data: fs.readFileSync(path.join(testerDir, f)) })),
    ...files.map((f) => ({ name: `${PACKAGE_NAME}/${f}`, data: fs.readFileSync(path.join(extDir, f)) })),
  ];
  const zipPath = path.join(outDir, ZIP_NAME);
  fs.writeFileSync(zipPath, createZip(entries));
  const manifest = JSON.parse(fs.readFileSync(path.join(extDir, 'manifest.json'), 'utf8'));
  return { outDir, extDir, testerDir, testerFiles, zipPath, files: files.length, version: manifest.version_name || manifest.version, zipBytes: fs.statSync(zipPath).size };
}

function main() {
  const r = packageDev();
  const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
  console.log(`✓ ChromeBlock ${r.version}: ${r.files} plików rozszerzenia`);
  console.log(`  ${rel(r.extDir)}/`);
  for (const [, dest] of EXTRA_FILES) console.log(`  ${rel(path.join(r.outDir, dest))}`);
  console.log(`  ${rel(r.testerDir)}/ (${r.testerFiles.length} plików testera)`);
  console.log(`  ${rel(r.zipPath)} (${(r.zipBytes / 1024 / 1024).toFixed(1)} MB)`);
  console.log('Sprawdzenie w Chromium: node tools/chromium-smoke.mjs --dir dist/ChromeBlock');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
