// Kontrakt modułu background/user-filters.js (kompilacja „Moich filtrów”) – bez Chrome i bez Playwrighta.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileUserFilters, MAX_USER_RULES } from '../../background/user-filters.js';
import { PRIORITY } from '../../shared/parser.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dict = (entries = {}) => Object.assign(Object.create(null), entries);
const empty = () => ({ rules: [], spec: dict(), unhide: dict(), style: dict(), proc: dict(), genC: [], scopedStyle: dict(), scopedProc: dict(), scopedHide: dict(), gunhide: [], ghide: [], ehide: [], docAllow: [], errors: [], count: 0 });

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
  assert.deepEqual(r.spec, dict({ 'example.com': ['.a', '.b'] }));
  assert.equal(r.count, 1);
  // A negative scope belongs to this rule and cannot cancel an independent rule.
  const ex = compileUserFilters('~bank.example##.promo');
  assert.deepEqual(ex.genC, []);
  assert.deepEqual(ex.unhide, dict());
  assert.deepEqual(ex.scopedHide, dict({ '*': [{ value: '.promo', exclude: ['bank.example'] }] }));
});

test('wyjątek #@# → unhide', () => {
  const r = compileUserFilters('example.com#@#.baner');
  assert.deepEqual(r.unhide, dict({ 'example.com': ['.baner'] }));
  assert.equal(r.count, 1);
});

test(':style(...) → style', () => {
  const r = compileUserFilters('example.com##.box:style(display: none !important)');
  assert.deepEqual(r.style, dict({ 'example.com': [['.box', 'display: none !important']] }));
  assert.equal(r.count, 1);
});

test('filtr proceduralny :has-text() → proc', () => {
  const r = compileUserFilters('example.com##div:has-text(Reklama)');
  assert.deepEqual(r.proc, dict({ 'example.com': [[{ css: 'div' }, { op: 'has-text', arg: 'Reklama' }]] }));
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
  assert.deepEqual([r.genC, r.spec, r.unhide], [['.reklama'], dict({ 'example.com': ['.baner'] }), dict({ 'example.com': ['.baner'] })]);
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
  assert.match(bg, /^import \{[^}]*\bcompileUserFilters\b[^}]*\} from '\.\/background\/user-filters\.js';$/m);
  assert.doesNotMatch(bg, /function compileUserFilters/);
});


test('własne wyjątki: globalne #@# oraz generichide/elemhide/document zachowują zakres', () => {
  const r = compileUserFilters('#@#.ad\n@@||example.com^$generichide\n@@||bank.example^$elemhide\n@@||docs.example^$document');
  assert.deepEqual(r.gunhide, ['.ad']);
  assert.deepEqual(r.ghide, ['example.com', 'bank.example']);
  assert.deepEqual(r.ehide, ['bank.example']);
  assert.deepEqual(r.docAllow, ['docs.example']);
  assert.deepEqual(r.errors, []);
});

test('wyjątki #@# z wykluczeniem domeny nie stają się wyjątkami globalnymi ani dla całego rodzica', () => {
  const r = compileUserFilters('~safe.example#@#.ad\nexample.com,~safe.example.com#@#.promo');
  assert.equal(r.count, 0);
  assert.deepEqual(r.gunhide, []);
  assert.deepEqual(r.unhide, dict());
  assert.deepEqual(r.errors.map((e) => e.line), [1, 2]);
  assert.ok(r.errors.every((e) => /nieobsługiwany filtr kosmetyczny/.test(e.reason)));
});

test('hosty kolidujące z Object.prototype są zwykłymi kluczami filtrów', () => {
  const r = compileUserFilters('constructor##.ad\n__proto__##.promo');
  assert.equal(Object.getPrototypeOf(r.spec), null);
  assert.deepEqual(r.spec.constructor, ['.ad']);
  assert.deepEqual(r.spec.__proto__, ['.promo']);
  assert.deepEqual(r.errors, []);
});

test('limit własnych reguł sieciowych zgłasza konkretną pominiętą linię', () => {
  const text = Array.from({ length: MAX_USER_RULES + 1 }, (_, i) => `||ads${i}.example^`).join('\n');
  const r = compileUserFilters(text);
  assert.equal(r.rules.length, MAX_USER_RULES);
  assert.equal(r.limitExceeded, true);
  assert.equal(r.errors[0].line, MAX_USER_RULES + 1);
  assert.match(r.errors[0].reason, /maks. 5000/);
});

test('wyłączenia style i proceduralnych pozostają związane z konkretnym filtrem', () => {
  const r = compileUserFilters('example.com,~safe.example.com##body:style(color:red)\nexample.com,~safe.example.com##div:has-text(ad)');
  assert.deepEqual(r.scopedStyle['example.com'], [{ value: ['body', 'color:red'], exclude: ['safe.example.com'] }]);
  assert.deepEqual(r.scopedProc['example.com'], [{ value: [{css:'div'}, {op:'has-text',arg:'ad'}], exclude: ['safe.example.com'] }]);
});

test('hide exclusions do not create global unhide or cancel a separate included selector', () => {
  const r = compileUserFilters('example.com,~safe.example.com##.ad\nsafe.example.com##.ad\n~bank.example##.promo\nbank.example##.promo');
  assert.deepEqual(r.unhide, dict());
  assert.deepEqual(r.scopedHide, dict({
    'example.com': [{ value: '.ad', exclude: ['safe.example.com'] }],
    '*': [{ value: '.promo', exclude: ['bank.example'] }],
  }));
  assert.deepEqual(r.spec, dict({ 'safe.example.com': ['.ad'], 'bank.example': ['.promo'] }));
  assert.equal(r.count, 4);
});
