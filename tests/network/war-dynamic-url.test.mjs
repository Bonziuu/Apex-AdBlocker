// Ochrona przed wykrywaniem: pliki zastępcze (web_accessible_resources) są dostępne tylko pod
// losowym adresem sesji (use_dynamic_url). Bez tego każda strona mogła sprawdzić, czy Apex AdBlocker
// jest zainstalowany, pobierając chrome-extension://<stałe id>/web_accessible_resources/noop.js.
// Sprawdzone w Chrome: przekierowania DNR (extensionPath) i wiadomości ze stron rozszerzenia działają.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

test('web_accessible_resources: wszystkie wpisy tylko pod dynamicznym adresem (use_dynamic_url)', () => {
  assert.ok(manifest.web_accessible_resources.length > 0);
  for (const w of manifest.web_accessible_resources) assert.equal(w.use_dynamic_url, true, JSON.stringify(w.resources));
});

test('use_dynamic_url wymaga Chrome 119+ – minimum_chrome_version to pokrywa', () => {
  assert.ok(Number(manifest.minimum_chrome_version) >= 119, manifest.minimum_chrome_version);
});
