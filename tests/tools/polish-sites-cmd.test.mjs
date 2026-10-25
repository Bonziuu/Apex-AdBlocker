// Wrappery Windows dla test:polish-sites: test-polish-sites.cmd i test-polish-sites-headed.cmd.
// (Nie da się ich uruchomić na Linuksie – sprawdzamy treść, a sprawdzenie zależności z CMD
// wykonujemy tym samym poleceniem node.)

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from '../../tools/lists-config.mjs';
import { parseArgs } from '../../tools/polish-sites/test-polish-sites.mjs';

const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const MAIN = 'test-polish-sites.cmd';
const HEADED = 'test-polish-sites-headed.cmd';

test('pliki CMD w katalogu głównym, CRLF, eol=crlf w .gitattributes', () => {
  for (const f of [MAIN, HEADED]) {
    const raw = fs.readFileSync(path.join(ROOT, f));
    const text = raw.toString('utf8');
    assert.ok(text.startsWith('@echo off'), f);
    assert.equal(text.split('\n').length - 1, (text.match(/\r\n/g) || []).length, `${f}: wszystkie końce linii CRLF`);
  }
  assert.match(read('.gitattributes'), /^\*\.cmd text eol=crlf$/m);
});

test('test-polish-sites.cmd: katalog repo, nagłówek, gap-mode przez npm, raport, pause, kod wyjścia', () => {
  const t = read(MAIN);
  assert.match(t, /^cd \/d "%~dp0"\r?$/m, 'uruchamia się względem własnego katalogu');
  assert.match(t, /^echo ChromeBlock – test polskich stron \(GAP mode\)\r?$/m);
  assert.match(t, /^chcp 65001 >nul\r?$/m, 'UTF-8 przed wypisaniem myślnika');
  assert.ok(t.indexOf('chcp 65001') < t.indexOf('echo ChromeBlock – test'), 'chcp przed nagłówkiem');
  assert.match(t, /^call npm run test:polish-sites -- --gap-mode %\*\r?$/m);
  assert.match(t, /^set "RC=%ERRORLEVEL%"\r?$/m, 'kod wyjścia testera zapisany zaraz po teście');
  const after = t.slice(t.indexOf('call npm run test:polish-sites'));
  assert.ok(after.indexOf('set "RC=%ERRORLEVEL%"') < after.indexOf('\n', after.indexOf('set "RC=')) + 1);
  assert.match(t, /tests\\polish-sites\\results\\latest\.txt/);
  assert.match(t, /^:end\r?\necho\.\r?\npause\r?\nexit \/b %RC%\r?\n?$/m, 'na końcu pause i exit /b z kodem testera');
  assert.match(t, /^set "RC=2"\r?$/m, 'błąd wymagań → kod 2 (błąd narzędzia)');
  // brak wymagań: czytelne komunikaty, bez instalacji
  assert.match(t, /where node/);
  assert.match(t, /where npm/);
  assert.match(t, /Brak Node\.js/);
  assert.match(t, /Brak npm/);
  assert.match(t, /Brak pakietu Playwright/);
  assert.match(t, /Brak przegladarki Chromium/);
  assert.doesNotMatch(t.replace(/^\s*echo .*$/gm, ''), /npm (install|i |ci)|npx playwright install|winget|choco/i, 'niczego nie instaluje (polecenia tylko w komunikatach)');
  // każde wyjście przy błędzie prowadzi do :end (pause)
  assert.doesNotMatch(t, /^\s*exit\b(?! \/b %RC%)/m, 'jedyne exit to na końcu');
  // nie zmienia ChromeBlocka ani list
  const commands = t.split(/\r?\n/).filter((l) => !/^\s*(rem\b|echo\b|title\b|$)/i.test(l)).join('\n');
  assert.doesNotMatch(commands, /npm run (build|update-lists|package)|tools\\build|tools\\lists|tools\/lists/i);
});

test('test-polish-sites-headed.cmd: ten sam wrapper z --headed, kod wyjścia przekazany', () => {
  const t = read(HEADED);
  assert.match(t, /^call "%~dp0test-polish-sites\.cmd" --headed %\*\r?$/m);
  assert.match(t, /^exit \/b %ERRORLEVEL%\r?$/m);
  assert.match(t, /npm run test:polish-sites -- --gap-mode --headed/, 'opis polecenia');
  const o = parseArgs(['--gap-mode', '--headed']);
  assert.equal(o.gap, true);
  assert.equal(o.headed, true);
  assert.equal(JSON.parse(read('package.json')).scripts['test:polish-sites'], 'node tools/polish-sites/test-polish-sites.mjs');
});

test('sprawdzenie Playwright/Chromium z CMD: poprawny JS, kod 0 gdy dostępne, 4 gdy brak Chromium', () => {
  const m = /^node -e "(.+)"\r?$/m.exec(read(MAIN));
  assert.ok(m, 'polecenie node -e w CMD');
  assert.doesNotMatch(m[1], /"/, 'bez cudzysłowów wewnątrz (bezpieczne w CMD)');
  const ok = spawnSync(process.execPath, ['-e', m[1]], { cwd: ROOT, encoding: 'utf8', timeout: 60000 });
  assert.ok([0, 3, 4].includes(ok.status), `kod ${ok.status}: ${ok.stderr}`);
  if (ok.status === 0) {
    const noChromium = spawnSync(process.execPath, ['-e', m[1]], { cwd: ROOT, encoding: 'utf8', timeout: 60000, env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: path.join(ROOT, 'brak-chromium-test') } });
    assert.equal(noChromium.status, 4, 'brak Chromium → komunikat "Brak przegladarki Chromium"');
  }
});

// --- run-polish-test.cmd: pierwsze uruchomienie (przygotowanie + test) ------------------------------

const RUN = 'run-polish-test.cmd';
/** Polecenia (bez rem/echo/title i pustych linii) – do sprawdzeń, które nie mogą łapać komunikatów. */
const commandsOf = (t) => t.split(/\r?\n/).filter((l) => !/^\s*(rem\b|echo\b|echo\.|title\b|$)/i.test(l)).join('\n');

test('run-polish-test.cmd: CRLF, własny katalog, Node/npm bez instalacji Node', () => {
  const raw = read(RUN);
  assert.ok(raw.startsWith('@echo off'));
  assert.equal(raw.split('\n').length - 1, (raw.match(/\r\n/g) || []).length, 'wszystkie końce linii CRLF');
  assert.match(raw, /^cd \/d "%~dp0"\r?$/m);
  assert.match(raw, /where node/);
  assert.match(raw, /where npm/);
  assert.match(raw, /Brak Node\.js\. Zainstaluj Node\.js 20/);
  assert.doesNotMatch(commandsOf(raw), /winget|choco|msiexec|nodejs\.org|Invoke-WebRequest|curl|bitsadmin/i, 'nie instaluje Node.js');
});

test('run-polish-test.cmd: npm install gdy brak Playwright, npx playwright install chromium gdy brak Chromium, potem test-polish-sites.cmd', () => {
  const t = read(RUN);
  const c = commandsOf(t);
  // npm install tylko gdy brak node_modules\playwright
  assert.match(t, /^if exist "node_modules\\playwright\\package\.json" goto :chromium\r?$/m);
  assert.match(c, /^call npm install --no-audit --no-fund\r?$/m);
  assert.ok(t.indexOf('goto :chromium') < t.indexOf('call npm install'), 'npm install pomijane, gdy Playwright jest');
  // Chromium: ta sama detekcja co w test-polish-sites.cmd, instalacja tylko przy kodzie 4
  const detect = /^node -e "(.+)"\r?$/m.exec(read(MAIN))[1];
  assert.ok(t.includes(`node -e "${detect}"`), 'ta sama detekcja Playwright/Chromium');
  assert.match(t, /^if "%DEP%"=="0" goto :run\r?$/m);
  assert.match(c, /^call npx playwright install chromium\r?$/m);
  assert.ok(t.indexOf('if "%DEP%"=="0" goto :run') < t.indexOf('call npx playwright install chromium'), 'instalacja Chromium pomijana, gdy jest');
  // start testu: istniejący wrapper (sam robi pause i raport), kod wyjścia testera zachowany
  assert.match(t, /^:run\r?$/m);
  assert.match(t, /^call "%~dp0test-polish-sites\.cmd" %\*\r?\nexit \/b %ERRORLEVEL%\r?$/m);
  // npm install i npx w kolejności: zależności → Chromium → test
  assert.ok(t.indexOf('call npm install') < t.indexOf('call npx playwright install chromium'));
  assert.ok(t.indexOf('call npx playwright install chromium') < t.indexOf('call "%~dp0test-polish-sites.cmd"'));
});

test('run-polish-test.cmd: błąd instalacji → komunikat, kod błędu zachowany, pause', () => {
  const t = read(RUN);
  // kod npm / npx zapisany zaraz po wywołaniu i zwracany przez :end
  assert.match(t, /^call npm install --no-audit --no-fund\r?\nset "RC=%ERRORLEVEL%"\r?$/m);
  assert.match(t, /^call npx playwright install chromium\r?\nset "RC=%ERRORLEVEL%"\r?$/m);
  assert.match(t, /Nie udalo sie zainstalowac zaleznosci \^\(npm install, kod %RC%\^\)/);
  assert.match(t, /Nie udalo sie pobrac Chromium \^\(npx playwright install chromium, kod %RC%\^\)/);
  assert.match(t, /^:end\r?\necho\.\r?\npause\r?\nexit \/b %RC%\r?\n?$/m);
  // każdy błąd przygotowania kończy się na :end (pause); jedyne inne wyjście to po teście
  const exits = [...t.matchAll(/^\s*exit \/b (.+?)\r?$/gm)].map((m) => m[1]);
  assert.deepEqual(exits, ['%ERRORLEVEL%', '%RC%']);
  // w blokach if ( … ) nawiasy w komunikatach są escapowane (inaczej CMD zamknąłby blok)
  let depth = 0;
  for (const line of t.split(/\r?\n/)) {
    const code = line.replace(/\^[()]/g, '').replace(/"[^"]*"/g, '');
    if (/^\s*rem\b/i.test(line)) continue;
    if (depth > 0 && /^\s*echo\b/i.test(line)) assert.doesNotMatch(code.replace(/^\s*echo/i, ''), /[()]/, `nieescapowany nawias w bloku: ${line}`);
    depth += (code.match(/\(/g) || []).length - (code.match(/\)/g) || []).length;
    assert.ok(depth >= 0 && depth <= 1, `zagnieżdżenie bloków: ${line}`);
  }
  assert.equal(depth, 0, 'bloki domknięte');
});

test('istniejące wrappery bez zmian w zachowaniu; README wspomina pierwsze uruchomienie', () => {
  assert.match(read(MAIN), /^call npm run test:polish-sites -- --gap-mode %\*\r?$/m);
  assert.doesNotMatch(commandsOf(read(MAIN)), /npm install|npx playwright install/, 'test-polish-sites.cmd nadal niczego nie instaluje');
  assert.match(read(HEADED), /^call "%~dp0test-polish-sites\.cmd" --headed %\*\r?$/m);
  assert.match(read('README.md'), /Pierwsze uruchomienie Windows: `?run-polish-test\.cmd`?/);
});

// --- run-polish-evidence.cmd: GAP + evidence dla 9 stron ---------------------------------------------

const EVIDENCE_SITES = ['onet.pl', 'wp.pl', 'interia.pl', 'o2.pl', 'gazeta.pl', 'wykop.pl', 'businessinsider.com.pl', 'se.pl', 'bankier.pl'];

test('run-polish-evidence.cmd: przez run-polish-test.cmd, --evidence, dokładnie 9 stron, kod wyjścia przekazany', () => {
  const raw = read('run-polish-evidence.cmd');
  assert.ok(raw.startsWith('@echo off'));
  assert.equal(raw.split('\n').length - 1, (raw.match(/\r\n/g) || []).length, 'CRLF');
  const m = /^call "%~dp0run-polish-test\.cmd" (.+) %\*\r?$/m.exec(raw);
  assert.ok(m, 'wywołuje run-polish-test.cmd (przygotowanie + GAP)');
  const args = m[1].split(/\s+/);
  assert.equal(args[0], '--evidence');
  assert.deepEqual(args.slice(1), EVIDENCE_SITES);
  assert.match(raw, /^exit \/b %ERRORLEVEL%\r?$/m);
  // run-polish-test.cmd → test-polish-sites.cmd dodaje --gap-mode; argumenty trafiają do testera
  const o = parseArgs(['--gap-mode', ...args]);
  assert.equal(o.gap, true);
  assert.equal(o.evidence, true);
  assert.deepEqual(o.domains, EVIDENCE_SITES);
  assert.doesNotMatch(commandsOf(raw), /npm install|npx playwright install|chromeblock-polish\.txt|provenance/i, 'bez instalacji i bez zmian list');
});

// --- retest-polish-batch1.cmd: retest partii 1 na 3 domenach -------------------------------------------

test('retest-polish-batch1.cmd: run-polish-test.cmd --evidence bankier.pl businessinsider.com.pl gazeta.pl, kod wyjścia przekazany', () => {
  const raw = read('retest-polish-batch1.cmd');
  assert.ok(raw.startsWith('@echo off'));
  assert.equal(raw.split('\n').length - 1, (raw.match(/\r\n/g) || []).length, 'CRLF');
  const m = /^call "%~dp0run-polish-test\.cmd" (.+) %\*\r?$/m.exec(raw);
  assert.ok(m, 'wywołuje istniejący run-polish-test.cmd');
  assert.deepEqual(m[1].split(/\s+/), ['--evidence', 'bankier.pl', 'businessinsider.com.pl', 'gazeta.pl']);
  assert.match(raw, /^exit \/b %ERRORLEVEL%\r?$/m);
  assert.match(raw, /tests\\polish-sites\\results\\latest\.txt/);
  assert.match(raw, /tests\\polish-sites\\results\\evidence\\/);
  const cmds = commandsOf(raw);
  assert.doesNotMatch(cmds, /npm |npx |where node|playwright install/i, 'bez duplikowania przygotowania');
  assert.equal((cmds.match(/^\s*call /gim) || []).length, 1, 'jedno wywołanie');
  const o = parseArgs(['--gap-mode', ...m[1].split(/\s+/)]);
  assert.deepEqual([o.gap, o.evidence, o.domains], [true, true, ['bankier.pl', 'businessinsider.com.pl', 'gazeta.pl']]);
});

// --- test-polish-batch2.cmd: evidence dla partii 2 -----------------------------------------------------

test('test-polish-batch2.cmd: run-polish-test.cmd --evidence wykop.pl wp.pl o2.pl onet.pl interia.pl se.pl jbzd.com.pl, kod wyjścia przekazany', () => {
  const raw = read('test-polish-batch2.cmd');
  assert.ok(raw.startsWith('@echo off'));
  assert.equal(raw.split('\n').length - 1, (raw.match(/\r\n/g) || []).length, 'CRLF');
  const m = /^call "%~dp0run-polish-test\.cmd" (.+) %\*\r?$/m.exec(raw);
  assert.ok(m, 'wywołuje istniejący run-polish-test.cmd');
  const args = m[1].split(/\s+/);
  assert.deepEqual(args, ['--evidence', 'wykop.pl', 'wp.pl', 'o2.pl', 'onet.pl', 'interia.pl', 'se.pl', 'jbzd.com.pl']);
  // jbzd.com.pl: tylko evidence – brak reguły i wpisu provenance na tym etapie
  const list = fs.readFileSync(path.join(ROOT, 'tools/lists/chromeblock-polish/chromeblock-polish.txt'), 'utf8');
  const prov = fs.readFileSync(path.join(ROOT, 'tools/lists/chromeblock-polish/provenance.json'), 'utf8');
  assert.doesNotMatch(list, /jbzd/i, 'brak reguły dla jbzd.com.pl');
  assert.doesNotMatch(prov, /jbzd/i, 'brak wpisu provenance dla jbzd.com.pl');
  assert.match(raw, /^exit \/b %ERRORLEVEL%\r?$/m);
  const cmds = commandsOf(raw);
  assert.doesNotMatch(cmds, /npm |npx |where node|playwright install/i, 'bez duplikowania przygotowania');
  assert.equal((cmds.match(/^\s*call /gim) || []).length, 1);
  const o = parseArgs(['--gap-mode', ...args]);
  assert.deepEqual([o.gap, o.evidence, o.domains], [true, true, args.slice(1)]);
});

// --- test-jbzd.cmd: GAP + evidence tylko dla jbzd.com.pl ------------------------------------------------

test('test-jbzd.cmd: run-polish-test.cmd --evidence jbzd.com.pl; batch2 nadal obejmuje jbzd.com.pl', () => {
  const raw = read('test-jbzd.cmd');
  assert.ok(raw.startsWith('@echo off'));
  assert.equal(raw.split('\n').length - 1, (raw.match(/\r\n/g) || []).length, 'CRLF');
  const m = /^call "%~dp0run-polish-test\.cmd" (.+) %\*\r?$/m.exec(raw);
  assert.ok(m, 'wywołuje istniejący run-polish-test.cmd');
  assert.deepEqual(m[1].split(/\s+/), ['--evidence', 'jbzd.com.pl']);
  assert.match(raw, /^exit \/b %ERRORLEVEL%\r?$/m);
  const cmds = commandsOf(raw);
  assert.doesNotMatch(cmds, /npm |npx |where node|playwright install/i);
  assert.equal((cmds.match(/^\s*call /gim) || []).length, 1);
  const o = parseArgs(['--gap-mode', ...m[1].split(/\s+/)]);
  assert.deepEqual([o.gap, o.evidence, o.domains], [true, true, ['jbzd.com.pl']]);
  assert.match(read('test-polish-batch2.cmd'), /^call "%~dp0run-polish-test\.cmd" --evidence .*\bjbzd\.com\.pl %\*\r?$/m);
});

// --- test-onet-evidence.cmd: GAP + evidence tylko dla onet.pl ------------------------------------------

test('test-onet-evidence.cmd: run-polish-test.cmd --evidence onet.pl, kod wyjścia przekazany', () => {
  const raw = read('test-onet-evidence.cmd');
  assert.ok(raw.startsWith('@echo off'));
  assert.equal(raw.split('\n').length - 1, (raw.match(/\r\n/g) || []).length, 'CRLF');
  const m = /^call "%~dp0run-polish-test\.cmd" (.+) %\*\r?$/m.exec(raw);
  assert.ok(m, 'wywołuje istniejący run-polish-test.cmd');
  assert.deepEqual(m[1].split(/\s+/), ['--evidence', 'onet.pl']);
  assert.match(raw, /^exit \/b %ERRORLEVEL%\r?$/m);
  const cmds = commandsOf(raw);
  assert.doesNotMatch(cmds, /npm |npx |where node|playwright install/i);
  assert.equal((cmds.match(/^\s*call /gim) || []).length, 1);
  const o = parseArgs(['--gap-mode', ...m[1].split(/\s+/)]);
  assert.deepEqual([o.gap, o.evidence, o.domains], [true, true, ['onet.pl']]);
});
