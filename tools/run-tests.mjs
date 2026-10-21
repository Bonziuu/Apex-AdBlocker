#!/usr/bin/env node
// ChromeBlock – przenośny runner testów (Node 20+).
//
// Node 20 nie rozwija wzorców glob w `node --test`, więc pliki są wyszukiwane
// tutaj (deterministycznie, posortowane) i przekazywane jako jawne ścieżki.
//
//   node tools/run-tests.mjs            testy jednostkowe/integracyjne: tests/**/*.test.mjs (bez tests/e2e)
//   node tools/run-tests.mjs --e2e      wyłącznie E2E: tests/e2e/**/*.e2e.mjs
//   node tools/run-tests.mjs --list     tylko wypisz pliki
//   pozostałe argumenty (np. --test-reporter=dot) są przekazywane do node --test

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Rekurencyjnie zbiera pliki z katalogu (posortowane, bez node_modules). */
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/**
 * @param {{e2e?: boolean, root?: string}} opts
 * @returns {string[]} ścieżki względne wobec root
 */
export function findTestFiles({ e2e = false, root = ROOT } = {}) {
  const testsDir = path.join(root, 'tests');
  return walk(testsDir)
    .map((f) => path.relative(root, f).split(path.sep).join('/'))
    .filter((f) => {
      const isE2eDir = f.startsWith('tests/e2e/');
      if (e2e) return isE2eDir && f.endsWith('.e2e.mjs');
      return !isE2eDir && f.endsWith('.test.mjs');
    });
}

function main() {
  const args = process.argv.slice(2);
  const e2e = args.includes('--e2e');
  const files = findTestFiles({ e2e });
  if (args.includes('--list')) { console.log(files.join('\n')); return; }
  if (!files.length) { console.error('Nie znaleziono plików testów.'); process.exit(1); }
  const passthrough = args.filter((a) => a !== '--e2e' && a !== '--list');
  const r = spawnSync(process.execPath, ['--test', ...passthrough, ...files], { cwd: ROOT, stdio: 'inherit' });
  process.exit(r.status === null ? 1 : r.status);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
