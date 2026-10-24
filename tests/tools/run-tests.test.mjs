// Przenośny runner testów (Node 20 nie rozwija globów w `node --test`).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { findTestFiles } from '../../tools/run-tests.mjs';

test('npm test: tylko tests/**/*.test.mjs, bez E2E', () => {
  const files = findTestFiles();
  assert.ok(files.length > 5);
  assert.ok(files.every((f) => f.endsWith('.test.mjs') && !f.startsWith('tests/e2e/')));
  assert.ok(files.includes('tests/tools/run-tests.test.mjs'));
  assert.deepEqual(files, [...files].sort((a, b) => a.localeCompare(b)), 'kolejność deterministyczna');
});

test('npm run test:e2e: wyłącznie tests/e2e/**/*.e2e.mjs', () => {
  const files = findTestFiles({ e2e: true });
  assert.deepEqual(files, ['tests/e2e/youtube.e2e.mjs']);
});

test('package.json: skrypty bez globów, test nie uruchamia E2E', () => {
  const pkg = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts.test, 'node tools/run-tests.mjs');
  assert.equal(pkg.scripts['test:e2e'], 'node tools/run-tests.mjs --e2e');
  for (const s of Object.values(pkg.scripts)) assert.ok(!/\*/.test(s), `glob w skrypcie: ${s}`);
});
