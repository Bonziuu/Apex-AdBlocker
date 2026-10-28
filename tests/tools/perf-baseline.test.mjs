// Narzędzie perf:baseline – czysta logika i deterministyczne strażniki paczki (bez pomiarów czasu).
// Twardych limitów czasu celowo nie ma: najpierw zbieramy baseline (docs/perf-baseline.md).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  ROOT, BASELINE_FILE, categoryOf, sizeReport, unwantedFiles, stats, matchesPattern, scriptsFor, parseArgs, baselineOf, formatReport, plural,
} from '../../tools/perf-baseline.mjs';
import { packageDev } from '../../tools/package-dev.mjs';
import { EXTENSION_ENTRIES } from '../../tools/chromium-smoke.mjs';

// strażnik rozmiaru: nagły przyrost paczki ponad baseline (np. przypadkowo dołączone dane) = błąd
export const SIZE_GUARD = Object.freeze({ maxGrowthRatio: 1.10, maxGrowthBytes: 2 * 1024 * 1024 });

test('kategorie: rozłączne i pokrywają całą paczkę', () => {
  assert.equal(categoryOf('rules/ads.json'), 'rules/ (rulesety DNR)');
  assert.equal(categoryOf('data/ads.json'), 'data/ (kosmetyka, scriptlety, metadane)');
  assert.equal(categoryOf('scriptlets/ads-0.js'), 'scriptlets/ (wygenerowane scriptlety)');
  for (const f of ['background.js', 'background/health.js', 'shared/parser.js', 'content/cosmetic.js', 'youtube/health.js']) assert.equal(categoryOf(f), 'JS rozszerzenia (SW, content scripts, shared)', f);
  for (const f of ['popup/popup.html', 'options/options.js', 'welcome/welcome.css']) assert.equal(categoryOf(f), 'UI (popup, opcje, powitanie)', f);
  for (const f of ['manifest.json', 'icons/icon16.png', 'web_accessible_resources/noop.js', '_locales/pl/messages.json']) assert.equal(categoryOf(f), 'ikony / zasoby / manifest', f);
});

test('statystyka: mediana, p95 (nearest-rank), min, max', () => {
  assert.deepEqual(stats([5, 1, 3]), { n: 3, median: 3, p95: 5, min: 1, max: 5 });
  assert.deepEqual(stats([1, 2, 3, 4]), { n: 4, median: 2.5, p95: 4, min: 1, max: 4 });
  const twenty = Array.from({ length: 20 }, (_, i) => i + 1);
  assert.equal(stats(twenty).p95, 19);
  assert.equal(stats([]), null);
  assert.equal(stats([null, undefined, NaN]), null);
  assert.deepEqual([1, 2, 5, 12, 22, 25].map((n) => plural(n, ['plik', 'pliki', 'plików'])), ['plik', 'pliki', 'plików', 'plików', 'pliki', 'plików']);
});

test('wzorce dopasowania content scriptów (jak w Chrome)', () => {
  assert.equal(matchesPattern('<all_urls>', 'https://example.com/'), true);
  assert.equal(matchesPattern('<all_urls>', 'chrome://settings/'), false);
  assert.equal(matchesPattern('*://*.youtube.com/*', 'https://www.youtube.com/watch?v=x'), true);
  assert.equal(matchesPattern('*://*.youtube.com/*', 'https://youtube.com/'), true);
  assert.equal(matchesPattern('*://*.youtube.com/*', 'https://notyoutube.com/'), false);
  assert.equal(matchesPattern('*://*.youtube.com/*', 'ftp://www.youtube.com/'), false);
  assert.equal(matchesPattern('https://example.com/a/*', 'https://example.com/a/b?c=1'), true);
  assert.equal(matchesPattern('https://example.com/a/*', 'https://example.com/b'), false);
  const manifest = { content_scripts: [{ matches: ['<all_urls>'], js: ['content/cosmetic.js'] }, { matches: ['*://*.youtube.com/*'], js: ['youtube/health.js'] }] };
  const registered = [{ id: 'sl-1', matches: ['*://*.youtube.com/*'], excludeMatches: ['*://music.youtube.com/*'], js: ['scriptlets/ads-3.js'] }];
  assert.deepEqual(scriptsFor('https://example.com/', manifest, registered).flatMap((s) => s.js), ['content/cosmetic.js']);
  assert.deepEqual(scriptsFor('https://www.youtube.com/', manifest, registered).flatMap((s) => s.js), ['content/cosmetic.js', 'youtube/health.js', 'scriptlets/ads-3.js']);
  assert.deepEqual(scriptsFor('https://music.youtube.com/', manifest, registered).flatMap((s) => s.js), ['content/cosmetic.js', 'youtube/health.js'], 'excludeMatches');
});

test('niechciane pliki: narzędzia, testy, raporty, ZIP-y, dokumentacja, package.json', () => {
  assert.deepEqual(unwantedFiles(['manifest.json', 'background.js', 'rules/ads.json', 'icons/a.png']), []);
  // notices w katalogu głównym – dozwolone; ten sam plik głębiej albo inne .md – nie
  assert.deepEqual(unwantedFiles(['THIRD_PARTY_NOTICES.md', 'docs/THIRD_PARTY_NOTICES.md', 'x/THIRD_PARTY_NOTICES.md', 'NOTES.md']), ['docs/THIRD_PARTY_NOTICES.md', 'x/THIRD_PARTY_NOTICES.md', 'NOTES.md']);
  assert.deepEqual(unwantedFiles(['tools/perf-baseline.mjs', 'tests/x.test.mjs', 'perf/baseline.json', 'perf/results/latest.txt', 'download/ChromeBlock-dev.zip', 'README.md', 'package.json', 'node_modules/a.js', 'x/report.log']),
    ['tools/perf-baseline.mjs', 'tests/x.test.mjs', 'perf/baseline.json', 'perf/results/latest.txt', 'download/ChromeBlock-dev.zip', 'README.md', 'package.json', 'node_modules/a.js', 'x/report.log']);
});

test('raport rozmiaru: sumy kategorii = całość, top N malejąco, procenty, powtarzalny hash i ZIP', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-perf-size-'));
  try {
    fs.mkdirSync(path.join(dir, 'rules'));
    fs.mkdirSync(path.join(dir, 'popup'));
    fs.writeFileSync(path.join(dir, 'manifest.json'), '{"manifest_version":3}');
    fs.writeFileSync(path.join(dir, 'rules/ads.json'), '[' + '{"id":1},'.repeat(500) + '{"id":2}]');
    fs.writeFileSync(path.join(dir, 'popup/popup.html'), '<p>x</p>');
    const r = sizeReport(dir, { top: 2 });
    assert.equal(r.files, 3);
    assert.equal(Object.values(r.categories).reduce((n, c) => n + c.bytes, 0), r.unpackedBytes);
    assert.equal(Object.values(r.categories).reduce((n, c) => n + c.files, 0), r.files);
    assert.deepEqual(r.top.map((f) => f.file), ['rules/ads.json', 'manifest.json']);
    assert.ok(r.top[0].percent > 90 && r.top[0].deflatedBytes < r.top[0].bytes);
    const again = sizeReport(dir, { top: 2 });
    assert.equal(again.packageSha256, r.packageSha256, 'hash powtarzalny');
    assert.equal(again.zipBytes, r.zipBytes, 'ZIP powtarzalny (stała data)');
    fs.writeFileSync(path.join(dir, 'popup/popup.html'), '<p>y</p>');
    assert.notEqual(sizeReport(dir).packageSha256, r.packageSha256, 'zmiana treści zmienia hash');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('argumenty i plik baseline: tylko stabilne metryki, bez logów i list plików', () => {
  assert.deepEqual(parseArgs([]), { runs: 15, sizeOnly: false, writeBaseline: false });
  assert.deepEqual(parseArgs(['--size-only', '--runs', '20', '--write-baseline']), { runs: 20, sizeOnly: true, writeBaseline: true });
  assert.throws(() => parseArgs(['--x']), /nieznany argument/);
  const size = { packageSha256: 'h', files: 2, unpackedBytes: 10, zipBytes: 5, categories: { a: { files: 2, bytes: 10, deflatedBytes: 5, percent: 100 } }, top: [{ file: 'x', bytes: 10 }], unwanted: [] };
  const b = baselineOf({ date: 'd', env: { commit: 'c', os: 'o', cpu: 'p', memGB: 8, node: 'n', chromium: 'ch' }, size });
  assert.deepEqual(Object.keys(b), ['schema', 'measuredAt', 'commit', 'environment', 'size']);
  assert.deepEqual(b.size.categories, { a: { files: 2, bytes: 10 } });
  assert.ok(!JSON.stringify(b).includes('"top"'));
  assert.match(formatReport({ date: 'd', env: { commit: 'c', os: 'o', cpu: 'p', memGB: 8, node: 'n', chromium: '' }, size: { ...size, zipMethod: 'm', jsBytes: 1 } }), /Niechciane pliki w paczce: brak/);
});

test('narzędzie benchmarkowe nie trafia do paczki rozszerzenia (0 B), wyniki nie są commitowane', () => {
  for (const top of ['tools', 'perf', 'tests', 'docs']) assert.ok(!EXTENSION_ENTRIES.includes(top), top);
  const ignore = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
  assert.match(ignore, /^perf\/results\/$/m);
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['perf:baseline'], 'node tools/perf-baseline.mjs');
});

test('strażnik paczki: brak niechcianych plików i brak nagłego przyrostu względem perf/baseline.json', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-perf-guard-'));
  try {
    const pkg = packageDev({ outDir: path.join(tmp, 'dist') });
    const r = sizeReport(pkg.extDir, { top: 0 });
    assert.deepEqual(unwantedFiles(r.list), [], 'niechciane pliki w paczce');
    assert.ok(!r.list.some((f) => /perf-baseline|baseline\.json/.test(f)), 'narzędzie i baseline poza paczką');
    const base = JSON.parse(fs.readFileSync(path.join(ROOT, BASELINE_FILE), 'utf8'));
    const limit = Math.min(base.size.unpackedBytes * SIZE_GUARD.maxGrowthRatio, base.size.unpackedBytes + SIZE_GUARD.maxGrowthBytes);
    assert.ok(r.unpackedBytes <= limit,
      `paczka urosła z ${base.size.unpackedBytes} B do ${r.unpackedBytes} B (limit ${Math.round(limit)} B). Jeśli to zamierzone (np. aktualizacja list), zaktualizuj baseline: npm run perf:baseline -- --write-baseline`);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});

test('baseline: zapisuje registerContentScripts, DNR gotowy, aktywne pliki/bajty scriptletów i reguły dynamiczne/sesyjne', () => {
  const s = (median) => ({ n: 20, median, p95: median + 1, min: median - 1, max: median + 2 });
  const r = {
    date: 'd', env: { commit: 'c', os: 'o', cpu: 'p', memGB: 8, node: 'n', chromium: 'ch' },
    size: { packageSha256: 'h', files: 1, unpackedBytes: 1, zipBytes: 1, categories: {} },
    startup: {
      install: { totalMs: s(2700), marks: { 'DNR gotowy': s(330) }, stages: [{ name: 'scriptlety: registerContentScripts', runsWithStage: 20, ...s(2400) }] },
      freshInstall: { readyMs: s(3600) }, wake: { wakeMinimal: s(27), wakeCosmetic: s(82), warmCosmetic: s(3) },
    },
    runtime: { enabledRulesets: ['ads'], staticRulesActive: 5, registeredScripts: 51, registeredJsFiles: 26, registeredJsBytes: 100, dynamicRules: 0, sessionRules: 0, contentScripts: { 'zwykła': { jsFiles: 1 } } },
  };
  const b = baselineOf(r);
  assert.deepEqual(b.startup.registerContentScriptsMs, { median: 2400, p95: 2401, min: 2399, max: 2402, n: 20 }, 'bez runsWithStage/name');
  assert.equal(b.startup.dnrReadyMs.median, 330);
  assert.deepEqual([b.runtime.registeredScripts, b.runtime.registeredJsFiles, b.runtime.registeredJsBytes, b.runtime.dynamicRules, b.runtime.sessionRules], [51, 26, 100, 0, 0]);
});

test('opcja --modes usunięta (produkt ma jeden stały zestaw list)', () => {
  assert.throws(() => parseArgs(['--modes', 'all']), /nieznany argument: --modes/);
});
