// Jedno źródło wersji produktu: manifest.json → version.
// Nie jest to globalny zakaz numerów 0.x.y – historyczne raporty, benchmarki i provenance mogą je zawierać.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../../tools/package-dev.mjs';

const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const manifest = JSON.parse(read('manifest.json'));

test('manifest.json: poprawne pole version, bez version_name', () => {
  assert.match(manifest.version, /^\d+(\.\d+){0,3}$/, 'format wersji Chrome');
  assert.equal(manifest.version_name, undefined);
});

test('package.json nie dubluje wersji produktu', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.private, true);
  assert.equal(pkg.version, undefined);
});

test('README: status bez wpisanego numeru wersji', () => {
  const status = read('README.md').split('\n').find((l) => /\*\*Status:/.test(l));
  assert.ok(status, 'linia statusu');
  assert.doesNotMatch(status, /\d+\.\d+\.\d+|-dev\b/);
});

test('wersja w UI, diagnostyce, kopii ustawień i paczce pochodzi z manifest.version', () => {
  for (const f of ['background.js', 'background/diagnostics-report.js', 'popup/popup.js', 'options/options.js', 'tools/package-dev.mjs', 'tests/local/chromeblock-local-test.mjs']) {
    assert.doesNotMatch(read(f), /version_name|versionName/, f);
  }
  assert.match(read('popup/popup.js'), /chrome\.runtime\.getManifest\(\)\.version\b/);
  assert.match(read('tools/package-dev.mjs'), /version: manifest\.version,/);
  const bg = read('background.js');
  assert.match(bg, /extensionVersion: chrome\.runtime\.getManifest\(\)\.version \}/);
  assert.match(bg, /version: chrome\.runtime\.getManifest\(\)\.version,/, 'options:get / popup:get');
  // bieżąca wersja nie jest wpisana na sztywno w kodzie rozszerzenia
  for (const f of ['background.js', 'background/diagnostics-report.js', 'popup/popup.js', 'popup/popup.html', 'options/options.js', 'options/options.html']) {
    assert.ok(!read(f).includes(manifest.version), `${f} zawiera ${manifest.version}`);
  }
});
