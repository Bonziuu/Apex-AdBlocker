// Lokalny tester (tests/local/chromeblock-local-test.mjs) – czysta logika, bez przeglądarki.
// Sam tester uruchamia się tylko przez `npm run test:local` / test-chromeblock.cmd.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  overallStatus, counts, isChromeBlockError, networkErrorOf, formatReport, parseArgs, writeResults, ROOT,
} from '../local/chromeblock-local-test.mjs';

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
