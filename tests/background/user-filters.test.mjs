// Kontrakt modułu background/user-filters.js (kompilacja „Moich filtrów”) – bez Chrome i bez Playwrighta.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileUserFilters } from '../../background/user-filters.js';
import { PRIORITY } from '../../shared/parser.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const empty = () => ({ rules: [], spec: {}, unhide: {}, style: {}, proc: {}, genC: [], errors: [], count: 0 });

test('pusty tekst, puste linie i komentarze → 0 filtrów, brak błędów', () => {
  for (const t of ['', null, undefined, '\n\n   \r\n', '! komentarz\n[Adblock Plus 2.0]\n  ! wcięty komentarz']) {
    assert.deepEqual(compileUserFilters(t), empty(), JSON.stringify(t));
  }
});

test('filtr sieciowy → reguła DNR z priorytetem własnych reguł, count', () => {
  const r = compileUserFilters('||ads.example.com^');
  assert.deepEqual(r.rules, [{ priority: PRIORITY.user, action: { type: 'block' }, condition: { requestDomains: ['ads.example.com'] } }]);
  assert.equal(r.count, 1);
  assert.deepEqual(r.errors, []);
  // wyjątek: priorytet allow przesunięty o tę samą wartość
  const a = compileUserFilters('@@||cdn.example.com^$script');
  assert.equal(a.rules[0].action.type, 'allow');
  assert.equal(a.rules[0].priority, PRIORITY.allow + PRIORITY.user - 1);
});

test('nieobsługiwany filtr sieciowy → błąd z numerem linii i dotychczasowym komunikatem', () => {
  const r = compileUserFilters('! a\n\n||x.example^$foobar');
  assert.deepEqual(r.errors, [{ line: 3, text: '||x.example^$foobar', reason: 'nieobsługiwany filtr sieciowy' }]);
  assert.equal(r.count, 0);
  assert.deepEqual(r.rules, []);
});

test('kosmetyka: globalny selektor → genC; dla domeny → spec (lista selektorów rozdzielona)', () => {
  assert.deepEqual(compileUserFilters('##.reklama').genC, ['.reklama']);
  const r = compileUserFilters('example.com##.a, .b');
  assert.deepEqual(r.spec, { 'example.com': ['.a', '.b'] });
  assert.equal(r.count, 1);
  // ~domena przy filtrze ogólnym → wyjątek (unhide) dla tej domeny
  const ex = compileUserFilters('~bank.example##.promo');
  assert.deepEqual([ex.genC, ex.unhide], [['.promo'], { 'bank.example': ['.promo'] }]);
});

test('wyjątek #@# → unhide', () => {
  const r = compileUserFilters('example.com#@#.baner');
  assert.deepEqual(r.unhide, { 'example.com': ['.baner'] });
  assert.equal(r.count, 1);
});

test(':style(...) → style', () => {
  const r = compileUserFilters('example.com##.box:style(display: none !important)');
  assert.deepEqual(r.style, { 'example.com': [['.box', 'display: none !important']] });
  assert.equal(r.count, 1);
});

test('filtr proceduralny :has-text() → proc', () => {
  const r = compileUserFilters('example.com##div:has-text(Reklama)');
  assert.deepEqual(r.proc, { 'example.com': [[{ css: 'div' }, { op: 'has-text', arg: 'Reklama' }]] });
  assert.equal(r.count, 1);
});

test('+js(...) → odrzucony z dotychczasowym komunikatem', () => {
  const r = compileUserFilters('example.com##+js(set-constant, a, true)');
  assert.deepEqual(r.errors, [{ line: 1, text: 'example.com##+js(set-constant, a, true)', reason: 'scriptlety (+js) nie są dostępne w moich filtrach' }]);
  assert.equal(r.count, 0);
});

test('kilka linii razem: count, kolejność i numery linii błędów (z wcięciami i CRLF)', () => {
  const text = ['! komentarz', '', '  ||ads.example.com^  ', '||x.example^$foobar', '##.reklama', 'example.com##.baner',
    'example.com#@#.baner', 'example.com##+js(set-constant, a, true)', 'example.com##div:has-text(Reklama)'].join('\r\n');
  const r = compileUserFilters(text);
  assert.equal(r.count, 5); // sieciowy, ##.reklama, ##.baner, #@#, :has-text
  assert.deepEqual(r.errors.map((e) => [e.line, e.text, e.reason]), [
    [4, '||x.example^$foobar', 'nieobsługiwany filtr sieciowy'],
    [8, 'example.com##+js(set-constant, a, true)', 'scriptlety (+js) nie są dostępne w moich filtrach'],
  ]);
  assert.equal(r.rules.length, 1);
  assert.deepEqual([r.genC, r.spec, r.unhide], [['.reklama'], { 'example.com': ['.baner'] }, { 'example.com': ['.baner'] }]);
  // wynik niezależny od poprzednich wywołań (brak stanu w module)
  assert.deepEqual(compileUserFilters(text), r);
});

test('moduł czysty: tylko import parsera, bez Chrome API, I/O i dynamicznego importu; background.js go importuje', () => {
  const src = fs.readFileSync(path.join(ROOT, 'background/user-filters.js'), 'utf8');
  const imports = [...src.matchAll(/^import[\s\S]*?from\s+'([^']+)'/gm)].map((m) => m[1]);
  assert.deepEqual(imports, ['../shared/parser.js']);
  assert.doesNotMatch(src, /\bchrome\.|\bfetch\(|import\(|\bawait\b|globalThis|self\./);
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'shared/parser.js'), 'utf8'), /background\//, 'brak cyklu');
  const bg = fs.readFileSync(path.join(ROOT, 'background.js'), 'utf8');
  assert.match(bg, /^import \{ compileUserFilters \} from '\.\/background\/user-filters\.js';$/m);
  assert.doesNotMatch(bg, /function compileUserFilters/);
});
