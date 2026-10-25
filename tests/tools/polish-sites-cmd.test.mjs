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
