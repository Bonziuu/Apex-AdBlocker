import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { captureScreenshots, GENERATOR, parseArgs } from '../../tools/webstore-screenshots.mjs';

test('screenshots: locale selects English or Polish explicitly and rejects unsupported languages', async () => {
  assert.equal(parseArgs([]).locale, 'pl');
  assert.equal(parseArgs(['--locale', 'en']).locale, 'en');
  assert.throws(() => parseArgs(['--locale', 'de']), /Locale/);
  await assert.rejects(captureScreenshots({ locale: 'de' }), /Locale/);
});

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-shot-test-'));
  const extensionDir = path.join(root, 'extension');
  const outDir = path.join(root, 'screenshots');
  fs.mkdirSync(extensionDir);
  fs.writeFileSync(path.join(extensionDir, 'manifest.json'), JSON.stringify({ manifest_version: 3, name: 'Fixture', version: '1.0.0' }));
  fs.mkdirSync(outDir);
  fs.writeFileSync(path.join(outDir, 'metadata.json'), JSON.stringify({ generator: GENERATOR, images: [{ file: 'existing.txt' }] }));
  fs.writeFileSync(path.join(outDir, 'existing.txt'), 'existing user-reviewed captures');
  return { root, extensionDir, outDir, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}

test('screenshots: missing browser cannot replace existing captures or produce placeholder images', async () => {
  const f = fixture();
  try {
    await assert.rejects(captureScreenshots({ ...f, browserType: null }), (e) => e.code === 'BROWSER_UNAVAILABLE');
    assert.equal(fs.readFileSync(path.join(f.outDir, 'existing.txt'), 'utf8'), 'existing user-reviewed captures');
    assert.deepEqual(fs.readdirSync(f.root).sort(), ['extension', 'screenshots']);
    assert.equal(fs.readdirSync(f.outDir).filter((name) => name.endsWith('.png')).length, 0);
  } finally { f.cleanup(); }
});

test('screenshots: partial browser startup failure closes the context and preserves prior output atomically', async () => {
  const f = fixture();
  let closed = false;
  const browserType = {
    executablePath: () => process.execPath,
    launchPersistentContext: async (_profile, options) => {
      assert.equal(options.locale, 'en-US');
      assert.equal(options.env.LANGUAGE, 'en');
      assert.ok(options.args.includes('--lang=en'));
      return {
      route: async () => {},
      serviceWorkers: () => [{ url: () => 'chrome-extension://fixture/background.js' }],
      newPage: async () => { throw new Error('browser startup interrupted'); },
      close: async () => { closed = true; },
      };
    },
  };
  try {
    await assert.rejects(captureScreenshots({ ...f, browserType, locale: 'en' }), /startup interrupted/);
    assert.equal(closed, true);
    assert.equal(fs.readFileSync(path.join(f.outDir, 'existing.txt'), 'utf8'), 'existing user-reviewed captures');
    assert.deepEqual(fs.readdirSync(f.root).sort(), ['extension', 'screenshots']);
  } finally { f.cleanup(); }
});

test('screenshots: an output directory without generator ownership is never overwritten', async () => {
  const f = fixture();
  fs.rmSync(path.join(f.outDir, 'metadata.json'));
  try {
    await assert.rejects(captureScreenshots({ ...f, browserType: null }), /własne pliki użytkownika/);
    assert.equal(fs.readFileSync(path.join(f.outDir, 'existing.txt'), 'utf8'), 'existing user-reviewed captures');
  } finally { f.cleanup(); }
});

test('screenshots: user additions to an owned output directory are not deleted', async () => {
  const f = fixture();
  fs.writeFileSync(path.join(f.outDir, 'user-notes.md'), 'keep these notes');
  try {
    await assert.rejects(captureScreenshots({ ...f, browserType: null }), /spoza poprzednich wyników/);
    assert.equal(fs.readFileSync(path.join(f.outDir, 'user-notes.md'), 'utf8'), 'keep these notes');
  } finally { f.cleanup(); }
});

// ---------------------------------------------------------------------------------------------
// Integralność kopii paczki: Chrome zapisuje w katalogu rozszerzenia rozpakowanego zindeksowane
// rulesety DNR (_metadata/generated_indexed_rulesets/_rulesetN). Tylko one są dozwolone.

import { snapshotTree, expectedRuntimeArtifacts, compareRuntimeSnapshot, INDEXED_RULESETS_DIR } from '../../tools/webstore-screenshots.mjs';
import { EXTENSION_ENTRIES, ROOT } from '../../tools/chromium-smoke.mjs';

const MANIFEST_4 = { declarative_net_request: { rule_resources: ['ads', 'privacy', 'security', 'pl'].map((id) => ({ id, enabled: true, path: `rules/${id}.json` })) } };
function packageDir() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-shot-integrity-'));
  const dir = path.join(root, 'extension');
  fs.mkdirSync(path.join(dir, 'rules'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(MANIFEST_4));
  for (const id of ['ads', 'privacy', 'security', 'pl']) fs.writeFileSync(path.join(dir, `rules/${id}.json`), '[]');
  fs.writeFileSync(path.join(dir, 'background.js'), '// worker\n');
  return { dir, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}
const write = (dir, rel, content = 'x') => { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.writeFileSync(path.join(dir, rel), content); };
function runtimeCheck(mutate) {
  const p = packageDir();
  try {
    const before = snapshotTree(p.dir);
    mutate(p.dir);
    return compareRuntimeSnapshot(before, snapshotTree(p.dir), MANIFEST_4);
  } finally { p.cleanup(); }
}

test('integralność: dozwolone pliki to _rulesetN dla rulesetów z manifestu (liczba z manifestu, nie stała)', () => {
  assert.deepEqual([...expectedRuntimeArtifacts(MANIFEST_4)], [1, 2, 3, 4].map((n) => `${INDEXED_RULESETS_DIR}/_ruleset${n}`));
  assert.deepEqual([...expectedRuntimeArtifacts({ declarative_net_request: { rule_resources: [{ id: 'a' }, { id: 'b' }] } })], [`${INDEXED_RULESETS_DIR}/_ruleset1`, `${INDEXED_RULESETS_DIR}/_ruleset2`]);
  assert.equal(expectedRuntimeArtifacts({}).size, 0);
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  assert.equal(expectedRuntimeArtifacts(manifest).size, manifest.declarative_net_request.rule_resources.length);
});

test('integralność PASS: Chrome dodaje wyłącznie prawidłowe _metadata/generated_indexed_rulesets/_rulesetN', () => {
  const all = runtimeCheck((dir) => { for (const n of [1, 2, 3, 4]) write(dir, `${INDEXED_RULESETS_DIR}/_ruleset${n}`, `indexed ${n}`); });
  assert.deepEqual(all.problems, []);
  assert.deepEqual(all.artifacts, [1, 2, 3, 4].map((n) => `${INDEXED_RULESETS_DIR}/_ruleset${n}`));
  const some = runtimeCheck((dir) => write(dir, `${INDEXED_RULESETS_DIR}/_ruleset2`));
  assert.deepEqual(some.problems, [], 'podzbiór rulesetów (np. tylko włączone) też jest poprawny');
  assert.deepEqual(runtimeCheck(() => {}).problems, [], 'bez zmian');
});

test('integralność FAIL: nowy plik poza _metadata (unexpected.txt)', () => {
  const r = runtimeCheck((dir) => { write(dir, `${INDEXED_RULESETS_DIR}/_ruleset1`); write(dir, 'unexpected.txt'); });
  assert.deepEqual(r.problems, ['nieoczekiwany nowy wpis: unexpected.txt']);
});

test('integralność FAIL: zmieniony istniejący plik rozszerzenia', () => {
  const r = runtimeCheck((dir) => fs.appendFileSync(path.join(dir, 'background.js'), 'tampered();\n'));
  assert.deepEqual(r.problems, ['zmieniono: background.js']);
  // także zastąpienie pliku katalogiem albo dowiązaniem
  assert.deepEqual(runtimeCheck((dir) => { fs.rmSync(path.join(dir, 'background.js')); fs.symlinkSync('manifest.json', path.join(dir, 'background.js')); }).problems, ['zmieniono: background.js']);
});

test('integralność FAIL: usunięty istniejący plik', () => {
  assert.deepEqual(runtimeCheck((dir) => fs.rmSync(path.join(dir, 'rules/pl.json'))).problems, ['usunięto: rules/pl.json']);
});

test('integralność FAIL: dodatkowy nieoczekiwany plik w _metadata', () => {
  for (const rel of ['_metadata/computed_hashes.json', `${INDEXED_RULESETS_DIR}/_ruleset1.tmp`, `${INDEXED_RULESETS_DIR}/nested/_ruleset1`, '_metadata/verified_contents.json']) {
    const r = runtimeCheck((dir) => write(dir, rel));
    assert.ok(r.problems.some((p) => p.includes(rel)), `${rel}: ${r.problems}`);
  }
  // _rulesetN jako katalog albo dowiązanie (nie zwykły plik)
  assert.ok(runtimeCheck((dir) => fs.mkdirSync(path.join(dir, `${INDEXED_RULESETS_DIR}/_ruleset1`), { recursive: true })).problems.length);
  assert.ok(runtimeCheck((dir) => { fs.mkdirSync(path.join(dir, INDEXED_RULESETS_DIR), { recursive: true }); fs.symlinkSync('../../manifest.json', path.join(dir, `${INDEXED_RULESETS_DIR}/_ruleset1`)); }).problems.length);
});

test('integralność FAIL: _rulesetN, którego manifest nie przewiduje', () => {
  for (const name of ['_ruleset5', '_ruleset0', '_ruleset01', '_ruleset_ads']) {
    const r = runtimeCheck((dir) => write(dir, `${INDEXED_RULESETS_DIR}/${name}`));
    assert.deepEqual(r.problems, [`nieoczekiwany nowy wpis: ${INDEXED_RULESETS_DIR}/${name}`], name);
  }
});

// Przebieg generatora z atrapą przeglądarki: „Chrome” zapisuje pliki w załadowanej kopii rozszerzenia.
const PNG_1280x800 = (() => { const b = Buffer.alloc(33); Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(b); b.writeUInt32BE(13, 8); b.write('IHDR', 12); b.writeUInt32BE(1280, 16); b.writeUInt32BE(800, 20); return b; })();
function fakeChromium(chromeWrites) {
  const state = { filters: '', closed: false };
  return {
    executablePath: () => process.execPath,
    launchPersistentContext: async (_profile, options) => {
      const extDir = options.args.find((a) => a.startsWith('--load-extension=')).slice('--load-extension='.length);
      chromeWrites(extDir);
      const page = {
        goto: async () => {},
        waitForFunction: async () => {},
        waitForTimeout: async () => {},
        screenshot: async ({ path: file }) => fs.writeFileSync(file, PNG_1280x800),
        locator: () => ({ click: async () => {}, waitFor: async () => {}, fill: async (v) => { state.filters = v; } }),
        evaluate: async (fn) => {
          const src = String(fn);
          if (src.includes('getExtensionsInfo')) return { state: 'ENABLED', errors: [] };
          if (src.includes('documentElement.lang')) return 'pl';
          if (src.includes("'health:get'")) return { sync: { rulesets: { status: 'ok' }, dynamicRules: { status: 'ok' }, scriptlets: { status: 'ok' } }, components: {} };
          if (src.includes("'options:get'")) return { userFilters: state.filters, userErrors: [] };
          return undefined;
        },
      };
      return {
        route: async () => {},
        serviceWorkers: () => [{ url: () => 'chrome-extension://fixtureid/background.js' }],
        newPage: async () => page,
        close: async () => { state.closed = true; },
      };
    },
  };
}
function realPackageCopy() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-shot-run-'));
  const extensionDir = path.join(root, 'package');
  for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(extensionDir, e), { recursive: true });
  const outDir = path.join(root, 'screenshots');
  return { root, extensionDir, outDir, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}
const rulesetCount = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8')).declarative_net_request.rule_resources.length;
const chromeIndexes = (extDir) => { for (let n = 1; n <= rulesetCount; n++) write(extDir, `${INDEXED_RULESETS_DIR}/_ruleset${n}`, `indexed ruleset ${n}`); };

test('generator: indeksowane rulesety Chrome przechodzą, metadata opisuje kontrolę; źródło i wynik bez _metadata', async () => {
  const f = realPackageCopy();
  try {
    const sourceBefore = snapshotTree(f.extensionDir);
    const r = await captureScreenshots({ extensionDir: f.extensionDir, outDir: f.outDir, browserType: fakeChromium(chromeIndexes) });
    assert.equal(r.images.length, 3);
    assert.equal(r.integrity.status, 'PASS');
    assert.deepEqual(r.integrity.allowedRuntimeArtifacts, Array.from({ length: rulesetCount }, (_, i) => `${INDEXED_RULESETS_DIR}/_ruleset${i + 1}`));
    const metadata = JSON.parse(fs.readFileSync(path.join(f.outDir, 'metadata.json'), 'utf8'));
    assert.deepEqual(metadata.integrity, r.integrity);
    assert.deepEqual(compareRuntimeSnapshot(sourceBefore, snapshotTree(f.extensionDir), {}).problems, [], 'źródłowa paczka bez zmian');
    assert.ok(!fs.existsSync(path.join(f.extensionDir, '_metadata')));
    assert.deepEqual(fs.readdirSync(f.root).sort(), ['package', 'screenshots'], 'tymczasowa kopia usunięta');
  } finally { f.cleanup(); }
});

for (const [name, mutate, message] of [
  ['nowy plik unexpected.txt', (d) => { chromeIndexes(d); write(d, 'unexpected.txt'); }, /nieoczekiwany nowy wpis: unexpected\.txt/],
  ['zmieniony plik rozszerzenia', (d) => { chromeIndexes(d); fs.appendFileSync(path.join(d, 'background.js'), '\n// x'); }, /zmieniono: background\.js/],
  ['usunięty plik rozszerzenia', (d) => { chromeIndexes(d); fs.rmSync(path.join(d, 'rules/pl.json')); }, /usunięto: rules\/pl\.json/],
  ['dodatkowy plik w _metadata', (d) => { chromeIndexes(d); write(d, '_metadata/computed_hashes.json'); }, /_metadata\/computed_hashes\.json/],
  ['ruleset spoza manifestu', (d) => { chromeIndexes(d); write(d, `${INDEXED_RULESETS_DIR}/_ruleset${rulesetCount + 1}`); }, new RegExp(`_ruleset${rulesetCount + 1}`)],
]) {
  test(`generator FAIL (${name}): brak nowych zrzutów, poprzednie wyniki zachowane`, async () => {
    const f = realPackageCopy();
    fs.mkdirSync(f.outDir);
    fs.writeFileSync(path.join(f.outDir, 'metadata.json'), JSON.stringify({ generator: GENERATOR, images: [{ file: 'existing.png' }] }));
    fs.writeFileSync(path.join(f.outDir, 'existing.png'), 'previous capture');
    try {
      await assert.rejects(captureScreenshots({ extensionDir: f.extensionDir, outDir: f.outDir, browserType: fakeChromium(mutate) }), (e) => /integralności/.test(e.message) && message.test(e.message));
      assert.deepEqual(fs.readdirSync(f.outDir).sort(), ['existing.png', 'metadata.json']);
      assert.equal(fs.readFileSync(path.join(f.outDir, 'existing.png'), 'utf8'), 'previous capture');
      assert.deepEqual(fs.readdirSync(f.root).sort(), ['package', 'screenshots']);
    } finally { f.cleanup(); }
  });
}

test('generator FAIL: zmiana źródłowej paczki w trakcie zrzutów (kopia nie jest już zgodna ze źródłem)', async () => {
  const f = realPackageCopy();
  try {
    const touchSource = (extDir) => { chromeIndexes(extDir); fs.appendFileSync(path.join(f.extensionDir, 'manifest.json'), ' '); };
    await assert.rejects(captureScreenshots({ extensionDir: f.extensionDir, outDir: f.outDir, browserType: fakeChromium(touchSource) }), /Źródłowa paczka zmieniła się podczas zrzutów: zmieniono: manifest\.json/);
    assert.ok(!fs.existsSync(f.outDir), 'bez wyników');
  } finally { f.cleanup(); }
});

test('generator FAIL: źródło z artefaktami _metadata nie jest akceptowane jako paczka', async () => {
  const f = realPackageCopy();
  try {
    // EXTENSION_ENTRIES nie obejmuje _metadata, ale plik runtime wewnątrz katalogu paczki jest wykrywany
    write(f.extensionDir, `data/_metadata/generated_indexed_rulesets/_ruleset1`);
    await assert.rejects(captureScreenshots({ extensionDir: f.extensionDir, outDir: f.outDir, browserType: fakeChromium(chromeIndexes) }), /Niepoprawna paczka/);
  } finally { f.cleanup(); }
});
