// Automaty na GitHubie: cotygodniowa aktualizacja list (Pull Request do akceptacji, nigdy push na main)
// i wydanie po tagu (zgodność z manifestem, pełna kontrola przed publikacją). Generatory opisów PR i wydania.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROOT } from '../../tools/run-tests.mjs';
import { releaseNotes, changelogFor } from '../../tools/release-notes.mjs';
import { prBody, statsTable } from '../../tools/update-lists-pr.mjs';

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const UPDATE = read('.github/workflows/update-lists.yml');
const RELEASE = read('.github/workflows/release.yml');
/** Tylko kroki workflow (bez komentarzy w nagłówku pliku). */
const stepsOf = (t) => t.slice(t.indexOf('    steps:'));

test('aktualizacja list: co tydzień i ręcznie, uprawnienia do PR, limit czasu', () => {
  assert.match(UPDATE, /schedule:\n\s+- cron: '[^']+'/);
  assert.match(UPDATE, /workflow_dispatch:/);
  assert.match(UPDATE, /permissions:\n {2}contents: write\n {2}pull-requests: write/);
  assert.match(UPDATE, /timeout-minutes: \d+/);
  assert.doesNotMatch(UPDATE, /secrets\./, 'tylko GITHUB_TOKEN');
});

test('aktualizacja list: pobranie → build → npm run check → PR; nigdy push na main ani scalanie', () => {
  const order = ['node tools/update-lists.mjs', 'node tools/build.mjs', 'npm run check', 'node tools/update-lists-pr.mjs', 'gh pr create'].map((s) => stepsOf(UPDATE).indexOf(s));
  for (const i of order) assert.ok(i > 0);
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'kolejność kroków');
  assert.match(UPDATE, /git push --force origin "\$BRANCH"/);
  assert.match(UPDATE, /BRANCH: auto\/update-lists/);
  assert.doesNotMatch(UPDATE, /git push[^\n]*\bmain\b/, 'bez pushowania na main');
  assert.doesNotMatch(UPDATE, /gh pr merge|--admin|gh release/, 'bez scalania i wydań');
  assert.match(UPDATE, /--draft/, 'nieudana kontrola → szkic PR');
  assert.match(UPDATE, /git diff --quiet -- tools\/lists/, 'bez zmian list – bez PR');
});

test('wydanie: tylko na tag vX.Y.Z, zgodność z manifestem, kontrola przed paczką i publikacją', () => {
  assert.match(RELEASE, /on:\n {2}push:\n {4}tags:\n {6}- 'v\*\.\*\.\*'/);
  assert.match(RELEASE, /permissions:\n {2}contents: write/);
  assert.match(RELEASE, /require\('\.\/manifest\.json'\)\.version/);
  const order = ['npm install', 'npx playwright install --with-deps chromium', 'npm run check', 'npm run package:release', 'node tools/release-notes.mjs', 'gh release create'].map((s) => stepsOf(RELEASE).indexOf(s));
  for (const i of order) assert.ok(i > 0);
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.match(RELEASE, /--verify-tag/);
  assert.match(RELEASE, /SKIP: Chromium smoke test unavailable/);
  assert.doesNotMatch(RELEASE, /chromewebstore|webstore.*publish/i, 'bez publikacji w Chrome Web Store');
  for (const f of ['dist/Apex-AdBlocker.zip', 'dist/SHA256SUMS.txt', 'Apex-AdBlocker-$VERSION.zip']) assert.ok(RELEASE.includes(f), f);
});

test('CHANGELOG.md: sekcja (PL i ENG) dla wersji z manifest.json', () => {
  const version = JSON.parse(read('manifest.json')).version;
  const c = changelogFor(version);
  assert.ok(c.pl.length > 0, `brak ### PL dla ${version}`);
  assert.ok(c.en.length > 0, `brak ### ENG dla ${version}`);
});

test('opis wydania: kafelki, link do pobrania, zrzut, instalacja, Co nowego – PL, potem ENG; tylko HTML', () => {
  const t = releaseNotes('v2.3.4', { changes: { pl: ['Nowość `kod`'], en: ['New **thing**'] } });
  assert.ok(t.indexOf('tile-pl.png') < t.indexOf('<h2>ENG</h2>') && t.indexOf('<h2>ENG</h2>') < t.indexOf('tile-en.png'));
  assert.match(t, /raw\.githubusercontent\.com\/Bonziuu\/Apex-AdBlocker\/v2\.3\.4\/store\/github\/ads-blocked-pl\.png/, 'obrazki przypięte do tagu');
  assert.match(t, /releases\/download\/v2\.3\.4\/Apex-AdBlocker-2\.3\.4\.zip/);
  assert.match(t, /<li>Nowość <code>kod<\/code><\/li>/);
  assert.match(t, /<li>New <b>thing<\/b><\/li>/);
  assert.doesNotMatch(t, /!\[|\]\(/, 'bez składni markdown');
  for (const f of ['tile-pl.png', 'tile-en.png', 'ads-blocked-pl.png', 'ads-blocked-en.png']) assert.ok(fs.existsSync(path.join(ROOT, 'store', 'github', f)), f);
  const empty = releaseNotes('v2.3.5', { changes: { pl: [], en: [] } });
  assert.match(empty, /Poprawki i aktualizacja list filtrów/);
  assert.match(empty, /Fixes and filter list updates/);
});

test('opis PR aktualizacji list: wyniki kroków, nieudane pobrania, zmiany liczby reguł, YouTube', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-pr-'));
  try {
    fs.writeFileSync(path.join(dir, 'update.log'), '✓ a.txt\n✗ pl/adblock.txt – HTTP 503\nYouTube filters changed. (+1 / -0)\n  + x\n');
    fs.writeFileSync(path.join(dir, 'check.log'), 'FAIL coś');
    const before = JSON.stringify([{ id: 'ads', name: 'Reklamy', networkRules: 100, cosmeticFilters: 50, scriptletFilters: 5 }]);
    const after = JSON.stringify([{ id: 'ads', name: 'Reklamy', networkRules: 120, cosmeticFilters: 50, scriptletFilters: 4 }]);
    const body = prBody({ dir, codes: { lists: '2', build: '0', check: '1' }, date: new Date('2026-11-02T04:17:00Z'), beforeJson: before, afterJson: after });
    assert.match(body.split('\n')[0], /^# Aktualizacja list filtrów \(2026-11-02\) – wymaga sprawdzenia$/);
    assert.match(body, /nowe nieobsługiwane scriptlety YouTube/);
    assert.match(body, /- pl\/adblock\.txt – HTTP 503/);
    assert.match(body, /\| Reklamy \| 120 \(\+20\) \| 50 \| 4 \(-1\) \|/);
    assert.match(body, /YouTube filters changed/);
    assert.match(body, /FAIL coś/);
    const okBody = prBody({ dir, codes: { lists: '0', build: '0', check: '0' }, beforeJson: before, afterJson: after });
    assert.doesNotMatch(okBody.split('\n')[0], /wymaga sprawdzenia/);
    assert.doesNotMatch(okBody, /Log kontroli/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  assert.match(statsTable('', JSON.stringify([{ id: 'x', name: 'X', networkRules: 1, cosmeticFilters: 2, scriptletFilters: 3 }])), /\| X \| 1 \| 2 \| 3 \|/);
});
