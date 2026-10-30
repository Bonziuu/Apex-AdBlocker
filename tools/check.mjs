#!/usr/bin/env node
// Apex AdBlocker – pełna kontrola przed commitem / po aktualizacji list:
//   1. walidacja buildu: czy wygenerowane pliki (rules/, data/, scriptlets/,
//      manifest) odpowiadają aktualnym listom i kodowi,
//   2. walidacja zgodności YouTube (strict),
//   3. raport audytu scriptletów (podsumowanie),
//   4. testy (node:test),
//   5. opcjonalnie: smoke test prawdziwego załadowania w Chromium (SKIP bez Playwright/Chromium).
// Kończy się kodem != 0, jeśli którykolwiek krok się nie powiódł.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './lists-config.mjs';
import { buildAll, validateCompatibility } from './build.mjs';
import { runSmoke, SKIP_MESSAGE } from './chromium-smoke.mjs';

const failures = [];
const step = (name) => console.log(`\n━━ ${name} ${'━'.repeat(Math.max(0, 60 - name.length))}`);

// 1. Build w katalogu tymczasowym i porównanie z repozytorium
step('Walidacja buildu');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-adblocker-check-'));
fs.copyFileSync(path.join(ROOT, 'manifest.json'), path.join(tmp, 'manifest.json'));
buildAll({ outDir: tmp });
validateCompatibility({ outDir: tmp });
const stale = [];
for (const dir of ['rules', 'data', 'scriptlets']) {
  const fresh = new Set(fs.readdirSync(path.join(tmp, dir)));
  const current = new Set(fs.existsSync(path.join(ROOT, dir)) ? fs.readdirSync(path.join(ROOT, dir)) : []);
  for (const f of new Set([...fresh, ...current])) {
    const a = fresh.has(f) ? fs.readFileSync(path.join(tmp, dir, f)) : null;
    const b = current.has(f) ? fs.readFileSync(path.join(ROOT, dir, f)) : null;
    if (!a || !b || !a.equals(b)) stale.push(`${dir}/${f}`);
  }
}
const mFresh = JSON.parse(fs.readFileSync(path.join(tmp, 'manifest.json'), 'utf8'));
const mCurrent = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
if (JSON.stringify(mFresh.declarative_net_request) !== JSON.stringify(mCurrent.declarative_net_request)) stale.push('manifest.json (declarative_net_request)');
fs.rmSync(tmp, { recursive: true, force: true });
if (stale.length) {
  failures.push('build');
  console.log(`✗ Wygenerowane pliki są nieaktualne (${stale.length}): ${stale.slice(0, 8).join(', ')}${stale.length > 8 ? ', …' : ''}`);
  console.log('  Uruchom: npm run build');
} else {
  console.log('✓ Wygenerowane pliki są aktualne');
}

// 2. YouTube (strict)
step('Zgodność YouTube (strict)');
const { youtube, audit } = validateCompatibility({ write: false, log: (...a) => console.log(...a) });
if (youtube.newGaps.length) failures.push('youtube');
else console.log(`✓ Brak nowych nieobsługiwanych krytycznych reguł YouTube (znane braki: ${youtube.knownGaps.length})`);

// 3. Audyt scriptletów (podsumowanie)
step('Audyt scriptletów');
const s = audit.summary;
console.log(`Filtry scriptletów: ${s.total} · w pełni obsługiwane: ${s.supported} · częściowo (niewykonywane): ${s.partial} · nieobsługiwane: ${s.unsupported}`);
console.log('Pełny raport: npm run audit:scriptlets');

// 4. Testy
step('Testy');
// Node 20 nie rozwija globów w `node --test` – pliki wyszukuje tools/run-tests.mjs (bez E2E).
const r = spawnSync(process.execPath, ['tools/run-tests.mjs', '--test-reporter=dot'], { cwd: ROOT, stdio: 'inherit' });
if (r.status !== 0) failures.push('tests');

// 5. Chromium smoke test (opcjonalny; bez stron zewnętrznych)
step('Chromium smoke test');
if (process.env.APEX_SMOKE === '0') {
  console.log(`${SKIP_MESSAGE} (APEX_SMOKE=0)`);
} else {
  const smoke = await runSmoke();
  if (smoke.status === 'SKIP') console.log(`${SKIP_MESSAGE} (${smoke.reasons.join('; ')})`);
  else if (smoke.status === 'PASS') console.log('✓ Apex AdBlocker załadowany w Chromium: service worker działa, health bez ERROR');
  else {
    failures.push('chromium-smoke');
    console.log('✗ Chromium smoke test: FAIL');
    for (const r of smoke.reasons) console.log(`  - ${r}`);
  }
  for (const n of smoke.notes) console.log(`  · ${n}`);
}

step('Wynik');
if (failures.length) {
  console.log(`✗ Niepowodzenie: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('✓ Wszystkie kontrole zakończone powodzeniem');
