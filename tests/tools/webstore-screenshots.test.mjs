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
