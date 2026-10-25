// CI (GitHub Actions): workflow uruchamia się na każdy push i PR, instaluje zależności
// i Chromium, uruchamia `npm test` i `npm run check` oraz nie dopuszcza pominiętych testów.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../../tools/run-tests.mjs';

const FILE = path.join(ROOT, '.github/workflows/ci.yml');

test('CI: push + pull_request, tylko odczyt repo, limit czasu', () => {
  const t = fs.readFileSync(FILE, 'utf8');
  assert.match(t, /^on:\n {2}push:\n {2}pull_request:\n/m, 'każdy push i każdy PR');
  assert.match(t, /^permissions:\n {2}contents: read$/m);
  assert.match(t, /timeout-minutes: \d+/);
  assert.doesNotMatch(t, /secrets\./, 'bez sekretów');
  assert.doesNotMatch(t, /git push|gh release|upload-artifact|package:dev/, 'CI nic nie publikuje');
});

test('CI: zależności, Chromium, npm test i npm run check w tej kolejności; Node zgodny z engines', () => {
  const t = fs.readFileSync(FILE, 'utf8');
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const minNode = /(\d+)/.exec(pkg.engines.node)[1];
  assert.match(t, new RegExp(`node-version: ${minNode}\\b`), `Node ${minNode} (minimum z engines)`);
  const steps = t.slice(t.indexOf('steps:')).split('\n').filter((l) => /^\s+(run:|npm |npx )/.test(l)).join('\n');
  const order = ['npm install', 'npx playwright install --with-deps chromium', 'npm test', 'npm run check'].map((s) => steps.indexOf(s));
  for (const i of order) assert.ok(i > 0);
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'kolejność kroków');
});

test('CI: pominięte testy i brak smoke testu w Chromium kończą job błędem', () => {
  const t = fs.readFileSync(FILE, 'utf8');
  assert.equal((t.match(/set -o pipefail/g) || []).length, 2, 'kod wyjścia npm nie ginie w tee');
  assert.match(t, /npm test -- --test-reporter=tap \| tee test\.log/);
  assert.match(t, /grep -Eq '\^# skipped 0\$' test\.log \|\| \{[^}]*exit 1; \}/);
  const smoke = fs.readFileSync(path.join(ROOT, 'tools/chromium-smoke.mjs'), 'utf8');
  const msg = /SKIP_MESSAGE = '([^']+)'/.exec(smoke)[1];
  assert.ok(t.includes(`grep -q '${msg}' check.log`), 'CI szuka dokładnego komunikatu SKIP smoke testu');
});
