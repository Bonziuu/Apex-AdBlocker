// Lokalny tester (tests/local/chromeblock-local-test.mjs) – czysta logika, bez przeglądarki.
// Sam tester uruchamia się tylko przez `npm run test:local` / test-chromeblock.cmd.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  overallStatus, counts, isChromeBlockError, networkErrorOf, formatReport, parseArgs, writeResults, ROOT, exitCodeFor, EXIT, classifySeek, SEEK_RESUME_WAIT_S,
  seekFacts, seekFailureKinds, classifyAB, formatSeekAB, browserArgs, AB,
} from '../local/chromeblock-local-test.mjs';
import { packageDev, missingTesterImports, TESTER_FILES, testerPackageJson } from '../../tools/package-dev.mjs';
import { createRequire } from 'node:module';

const c = (status, name = 'x') => ({ id: name, name, status, detail: '' });

test('wynik zbiorczy: FAIL > INCONCLUSIVE (SKIP) > PASS; SKIP nigdy nie daje PASS', () => {
  assert.equal(overallStatus([c('PASS'), c('PASS')]), 'PASS');
  assert.equal(overallStatus([c('PASS'), c('SKIP')]), 'INCONCLUSIVE');
  assert.equal(overallStatus([c('SKIP'), c('FAIL'), c('PASS')]), 'FAIL');
  assert.equal(overallStatus([]), 'SKIP');
  assert.deepEqual(counts([c('PASS'), c('SKIP'), c('SKIP'), c('FAIL')]), { PASS: 1, FAIL: 1, SKIP: 2 });
});

test('błędy JS: tylko pochodzące z ChromeBlock', () => {
  const id = 'abcdefghijklmnopabcdefghijklmnop';
  assert.ok(isChromeBlockError({ text: 'x', url: `chrome-extension://${id}/popup/popup.js` }, id));
  assert.ok(isChromeBlockError({ text: 'TypeError', stack: `at f (chrome-extension://${id}/scriptlets/ads-1.js:3:1)` }, id));
  assert.ok(isChromeBlockError({ text: '[ChromeBlock] scriptlet failed' }, id));
  assert.ok(!isChromeBlockError({ text: 'Uncaught TypeError', url: 'https://www.youtube.com/s/player/base.js' }, id));
  assert.ok(!isChromeBlockError({ text: 'x', url: 'chrome-extension://innerozszerzenie/x.js' }, id));
});

test('brak sieci → kod net::ERR (SKIP), inne błędy → null', () => {
  assert.equal(networkErrorOf(new Error('page.goto: net::ERR_NAME_NOT_RESOLVED at https://www.youtube.com/')), 'net::ERR_NAME_NOT_RESOLVED');
  assert.equal(networkErrorOf(new Error('Timeout 30000ms exceeded')), null);
});

test('raport: wersja, startup, wyniki, błędy, oznaczenie SKIP jako INCONCLUSIVE', () => {
  const r = {
    overall: 'INCONCLUSIVE', version: '0.3.1-dev', finishedAt: '2026-10-25T00:00:00Z', durationMs: 61000, browser: 'chromium-1194',
    startup: { totalMs: 750, reason: 'onStartup', registerMs: 640, registerCalls: 1 },
    checks: [{ ...c('PASS', 'Popup otwiera się bez błędów'), detail: 'ok' }, { ...c('SKIP', 'YouTube: seek'), detail: 'INCONCLUSIVE – brak sieci' },
      { ...c('FAIL', 'Tryb Basic → Balanced'), detail: 'backend: basic', screenshot: 'tests/local/results/fail-mode.png' }],
    errors: ['konsola: ChromeBlock: x'], notes: [],
  };
  const t = formatReport(r);
  assert.match(t, /WYNIK:\s+INCONCLUSIVE\s+\(PASS 1 · FAIL 1 · SKIP 1\)/);
  assert.match(t, /Wersja:\s+0\.3\.1-dev/);
  assert.match(t, /Startup:\s+750 ms \(onStartup\); registerContentScripts: 640 ms/);
  assert.match(t, /\[SKIP\*\] YouTube: seek/);
  assert.match(t, /SKIP = INCONCLUSIVE/);
  assert.match(t, /- Tryb Basic → Balanced: backend: basic\s+\[screenshot: tests\/local\/results\/fail-mode\.png\]/);
  assert.match(t, /- konsola: ChromeBlock: x/);
  assert.doesNotMatch(t, /ad blocking PASS|reklamy zablokowane/i);
});

test('zapis wyników: latest.json + latest.txt', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-local-'));
  try {
    const f = writeResults({ overall: 'PASS', version: 'v', checks: [c('PASS')], errors: [], notes: [], finishedAt: 'x', durationMs: 1 }, dir);
    assert.equal(JSON.parse(fs.readFileSync(f.json, 'utf8')).overall, 'PASS');
    assert.match(fs.readFileSync(f.txt, 'utf8'), /WYNIK:\s+PASS/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('opcje, npm run test:local, .cmd i izolacja od npm test', () => {
  const o = parseArgs(['--headless', '--no-youtube', '--video', 'abc']);
  assert.equal(o.headless, true);
  assert.equal(o.youtube, false);
  assert.equal(o.video, 'abc');
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['test:local'], 'node tests/local/chromeblock-local-test.mjs');
  assert.doesNotMatch(pkg.scripts.test, /local/);
  const cmd = fs.readFileSync(path.join(ROOT, 'test-chromeblock.cmd'), 'utf8');
  assert.match(cmd, /\r\n/, 'CRLF');
  assert.match(cmd, /node tests\\local\\chromeblock-local-test\.mjs/);
  assert.match(cmd, /latest\.txt/);
  assert.match(cmd, /\r\npause\r\n/, 'okno zostaje otwarte');
  assert.doesNotMatch(cmd, /--user-data-dir|reg |HKLM|HKCU|Policies/i, 'bez prywatnego profilu i rejestru');
  assert.match(fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8'), /^tests\/local\/results\/$/m);
});

test('kody wyjścia: PASS 0, FAIL 1, błąd uruchomienia 2, INCONCLUSIVE 3', () => {
  assert.deepEqual({ ...EXIT }, { PASS: 0, FAIL: 1, ERROR: 2, INCONCLUSIVE: 3 });
  assert.equal(exitCodeFor({ overall: 'PASS', checks: [c('PASS')] }), 0);
  assert.equal(exitCodeFor({ overall: 'FAIL', checks: [c('FAIL')] }), 1);
  assert.equal(exitCodeFor({ overall: 'INCONCLUSIVE', checks: [c('PASS'), c('SKIP')] }), 3);
  assert.equal(exitCodeFor({ overall: 'SKIP', checks: [], fatal: 'Playwright nie jest zainstalowany' }), 2);
  assert.equal(exitCodeFor(null), 2);
  assert.equal(exitCodeFor({ overall: 'FAIL', checks: [c('PASS'), c('FAIL')], fatal: 'przerwano' }), 1, 'przerwany test z wynikami → FAIL');
  const cmd = fs.readFileSync(path.join(ROOT, 'test-chromeblock.cmd'), 'utf8');
  for (const [code, word] of [[0, 'PASS'], [1, 'FAIL'], [2, 'BLAD URUCHOMIENIA'], [3, 'INCONCLUSIVE']]) {
    assert.match(cmd, new RegExp(`if "%RC%"=="${code}" echo\\s+WYNIK: ${word}`), `.cmd opisuje kod ${code} słownie`);
  }
  assert.equal(parseArgs(['--results', 'x']).resultsDir, path.resolve('x'));
});

test('paczka: test-chromeblock.cmd + minimalny tester (domknięte importy), bez repozytorium', () => {
  assert.deepEqual(missingTesterImports(), []);
  assert.ok(missingTesterImports(ROOT, TESTER_FILES.filter((f) => !f.endsWith('classify.mjs'))).length > 0, 'wykrywa brakujący import');
  const pkg = testerPackageJson(JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')));
  assert.deepEqual(Object.keys(pkg.dependencies), ['playwright']);
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-pkg-'));
  try {
    const r = packageDev({ outDir: out });
    assert.ok(fs.existsSync(path.join(out, 'test-chromeblock.cmd')));
    assert.ok(fs.existsSync(path.join(out, 'update-chromeblock.cmd')));
    assert.deepEqual(r.testerFiles.sort(), [...TESTER_FILES, 'package.json'].sort());
    // pliki testera ładują się z rozpakowanej paczki (bez Gita i bez repozytorium)
    const req = createRequire(import.meta.url);
    assert.ok(req.resolve(path.join(out, 'tester', 'tests', 'local', 'chromeblock-local-test.mjs')));
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

test('paczka: tester importuje się poza repozytorium', async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-pkg-'));
  try {
    packageDev({ outDir: out });
    const m = await import(new URL(`file://${path.join(out, 'tester', 'tests', 'local', 'chromeblock-local-test.mjs')}`).href);
    assert.equal(typeof m.runLocalTests, 'function');
    assert.equal(m.ROOT, path.join(out, 'tester'));
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

// --- seek -----------------------------------------------------------------
// próbki co 1 s od chwili seek; t = currentTime, b = spinner (buforowanie)
const S = (list) => list.map(([t, b = false, error = false]) => ({ currentTime: t, spinner: b, error }));
const progressOld = (xs) => { let n = 0; for (let i = 1; i < xs.length; i++) { const d = xs[i].currentTime - xs[i - 1].currentTime; if (d > 0 && d <= 5) n += d; } return n; };

test('REGRESJA: seek wykonany poprawnie + chwilowe buforowanie → seek PASS, wznowienie PASS', () => {
  // prawdziwy przypadek z Windows: 18 s → 78 s, ok. 9 s buforowania, potem odtwarzanie rusza
  const samples = S([[78, true], [78, true], [78, true], [78, true], [78, true], [78, true], [78, true], [78, true], [78, true], [79], [80], [81]]);
  // stara logika (2 s przerwy + 6 próbek, wymagany postęp ≥ 2 s) dawała tu fałszywy FAIL
  assert.ok(progressOld(samples.slice(2, 8)) < 2, 'stara logika: „czas nie rośnie po seek”');
  const r = classifySeek({ before: 18, samples });
  assert.equal(r.seek.status, 'PASS');
  assert.match(r.seek.detail, /18 s → 78 s/);
  assert.equal(r.resume.status, 'PASS');
  assert.match(r.resume.detail, /wznowione po ok\. \d+ s/);
});

test('seek poprawny, ale buforowanie przez całe okno → seek PASS, wznowienie SKIP (INCONCLUSIVE), nie FAIL', () => {
  const samples = S(Array.from({ length: SEEK_RESUME_WAIT_S }, () => [78, true]));
  const r = classifySeek({ before: 18, samples });
  assert.equal(r.seek.status, 'PASS');
  assert.equal(r.resume.status, 'SKIP');
  assert.match(r.resume.detail, /INCONCLUSIVE.*nie wznowiło.*buforowanie przez 25 s.*bez błędu playera/);
});

test('seek: FAIL tylko przy jednoznacznym dowodzie', () => {
  // pozycja nie przeskoczyła
  let r = classifySeek({ before: 18, samples: S([[19], [20], [21], [22]]) });
  assert.equal(r.seek.status, 'FAIL');
  assert.match(r.seek.detail, /nie przeskoczyła.*wymagane ≥ 63 s/);
  // przeskok za mały (30 s zamiast ~60 s)
  assert.equal(classifySeek({ before: 18, samples: S([[48], [49], [50]]) }).seek.status, 'FAIL');
  // przeskoczyła, ale błąd elementu video
  r = classifySeek({ before: 18, samples: S([[78], [78], [78]]), videoError: 3 });
  assert.equal(r.seek.status, 'FAIL');
  assert.match(r.seek.detail, /video \(kod 3\)/);
  // przeskoczyła, ale trwały komunikat błędu odtwarzacza
  r = classifySeek({ before: 18, samples: S([[78, false, true], [78, false, true], [78, false, true]]) });
  assert.equal(r.seek.status, 'FAIL');
  assert.equal(r.resume.status, 'FAIL');
  // przeskoczyła, a potem odtwarzacz zresetował film
  r = classifySeek({ before: 18, samples: S([[78], [0], [1], [2]]) });
  assert.equal(r.seek.status, 'FAIL');
  assert.match(r.seek.detail, /cofnęła się/);
  // chwilowy .ytp-error w trakcie (nie trwały) przy poprawnym seek → nie FAIL
  r = classifySeek({ before: 18, samples: S([[78, true, true], [78], [79], [80], [81]]) });
  assert.equal(r.seek.status, 'PASS');
  assert.equal(r.resume.status, 'PASS');
  // brak video
  assert.equal(classifySeek({ before: null, samples: [] }).seek.status, 'FAIL');
});

test('seek: przeskok widoczny dopiero po chwili (pozycja aktualizuje się z opóźnieniem) → PASS', () => {
  const r = classifySeek({ before: 18, samples: S([[18], [18, true], [78, true], [78], [79], [80]]) });
  assert.equal(r.seek.status, 'PASS');
  assert.equal(r.resume.status, 'PASS');
});

// --- A/B seek (kontrola bez ChromeBlock) --------------------------------------
const URL_W = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';
// prawdziwy przypadek z Windows: 16 s → 76 s, potem trwały .ytp-error i cofnięcie pozycji
const brokenSeek = () => seekFacts({ before: 16, samples: S([[76], [76, true], [76, false, true], [0, false, true], [0, false, true], [0, false, true]]), videoError: 0, finalUrl: URL_W });
const goodSeek = () => seekFacts({ before: 14, samples: S([[74, true], [74, true], [75], [76], [77]]), finalUrl: URL_W });

test('A/B: fakty seek do raportu (przypadek z Windows)', () => {
  const f = brokenSeek();
  assert.equal(f.before, 16);
  assert.equal(f.target, 76);
  assert.equal(f.afterSeek, 76);
  assert.equal(f.jumpedTo, 76);
  assert.equal(f.ytpErrorPersistent, true);
  assert.equal(f.videoErrorCode, 0);
  assert.equal(f.fellBack, true);
  assert.equal(f.resumed, false);
  assert.equal(f.finalUrl, URL_W);
  assert.deepEqual(seekFailureKinds(f), ['ytp-error', 'fell-back', 'not-resumed']);
  assert.deepEqual(seekFailureKinds(goodSeek()), []);
});

test('A/B: ten sam błąd także bez ChromeBlock → CONTROL ALSO FAILS (nie obwiniamy ChromeBlock)', () => {
  const r = classifyAB(brokenSeek(), brokenSeek());
  assert.equal(r.verdict, AB.CONTROL_ALSO_FAILS);
  assert.match(r.detail, /ytp-error, fell-back/);
  // częściowa zgodność też wystarcza (np. kontrola: tylko trwały .ytp-error + video.error)
  const control = seekFacts({ before: 15, samples: S([[75, false, true], [75, false, true], [75, false, true]]), videoError: 2, finalUrl: URL_W });
  assert.equal(classifyAB(brokenSeek(), control).verdict, AB.CONTROL_ALSO_FAILS);
});

test('A/B: bez ChromeBlock działa, z ChromeBlock nie → CHROMEBLOCK-SPECIFIC FAIL', () => {
  const r = classifyAB(brokenSeek(), goodSeek());
  assert.equal(r.verdict, AB.CHROMEBLOCK_SPECIFIC);
  assert.match(r.detail, /bez ChromeBlock seek i odtwarzanie działają/);
});

test('A/B: kontrola nie może się wykonać → INCONCLUSIVE', () => {
  for (const c of [null, { skipped: 'INCONCLUSIVE – YouTube niedostępny (net::ERR_NAME_NOT_RESOLVED)' }, { skipped: 'odtwarzanie w kontroli nie wystartowało' }]) {
    assert.equal(classifyAB(brokenSeek(), c).verdict, AB.INCONCLUSIVE);
  }
  assert.match(classifyAB(brokenSeek(), { skipped: 'CAPTCHA' }).detail, /nie wykonała się: CAPTCHA/);
});

test('A/B: kontrola z innym błędem albo tylko bez wznowienia → INCONCLUSIVE', () => {
  const noJump = seekFacts({ before: 14, samples: S([[15], [16], [17]]), finalUrl: URL_W }); // inny błąd: brak przeskoku
  assert.equal(classifyAB(brokenSeek(), noJump).verdict, AB.INCONCLUSIVE);
  const stalled = seekFacts({ before: 14, samples: S(Array.from({ length: 25 }, () => [74, true])), finalUrl: URL_W }); // bez błędu, tylko buforuje
  const r = classifyAB(brokenSeek(), stalled);
  assert.equal(r.verdict, AB.INCONCLUSIVE);
  assert.match(r.detail, /bez błędu playera, ale odtwarzanie się nie wznowiło/);
});

test('A/B: raport zawiera before / target / po seek / .ytp-error / video.error.code / cofnięcie / wznowienie / URL dla obu przebiegów', () => {
  const ab = { ...classifyAB(brokenSeek(), goodSeek()), with: brokenSeek(), without: goodSeek() };
  const t = formatSeekAB(ab).join('\n');
  assert.match(t, /Diagnostyka A\/B seek: CHROMEBLOCK-SPECIFIC FAIL/);
  for (const row of ['before', 'seek target', 'currentTime po seek', '.ytp-error', 'video.error.code', 'pozycja się cofnęła', 'odtwarzanie wznowione', 'końcowy URL']) assert.match(t, new RegExp(row.replace('.', '\\.')));
  assert.match(t, /Z ChromeBlock\s+BEZ ChromeBlock/);
  assert.match(t, /\.ytp-error\s+TAK \(trwały\)\s+nie/);
  assert.match(t, /pozycja się cofnęła\s+TAK\s+nie/);
  assert.match(t, /odtwarzanie wznowione\s+nie\s+TAK/);
  const skipped = formatSeekAB({ ...classifyAB(brokenSeek(), { skipped: 'brak sieci' }), with: brokenSeek(), without: { skipped: 'brak sieci' } }).join('\n');
  assert.match(skipped, /INCONCLUSIVE/);
  assert.match(skipped, /nie wykonano: brak sieci/);
  // sekcja w pełnym raporcie
  const full = formatReport({ overall: 'FAIL', version: 'v', checks: [c('FAIL', 'YouTube: seek A/B (kontrola bez ChromeBlock)')], errors: [], notes: [], finishedAt: 'x', durationMs: 1, seekAB: ab });
  assert.match(full, /Diagnostyka A\/B seek/);
});

test('A/B: kontrola uruchamiana BEZ rozszerzenia, z tymi samymi flagami odtwarzania', () => {
  const without = browserArgs(null);
  const withExt = browserArgs('/tmp/ext');
  assert.ok(!without.some((a) => a.includes('load-extension') || a.includes('disable-extensions-except')));
  assert.ok(withExt.includes('--load-extension=/tmp/ext'));
  assert.deepEqual(withExt.filter((a) => !a.includes('extension')), without);
});
