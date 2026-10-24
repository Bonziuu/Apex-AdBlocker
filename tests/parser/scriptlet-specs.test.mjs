// Testy rejestru scriptletów: walidacja argumentów (fail closed).

import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeScriptlet, splitScriptletArgs, canonicalScriptletName, SCRIPTLET_SPECS } from '../../shared/scriptlet-specs.js';

const a = (name, args, trusted = true) => analyzeScriptlet(name, args, { trusted });

test('splitScriptletArgs: cudzysłowy, escapowane przecinki, puste argumenty', () => {
  assert.deepEqual(splitScriptletArgs("x, '\"a\"', \"b, c\", d\\,e, , f"), ['x', '"a"', 'b, c', 'd,e', '', 'f']);
  assert.deepEqual(splitScriptletArgs('set, a.b, 1, '), ['set', 'a.b', '1'], 'puste argumenty na końcu pomijane');
  assert.deepEqual(splitScriptletArgs("x, 'it\\'s'"), ['x', "it's"]);
});

test('aliasy', () => {
  assert.equal(canonicalScriptletName('nano-stb.js'), 'adjust-setTimeout');
  assert.equal(canonicalScriptletName('rpnt'), 'trusted-replace-node-text');
  assert.equal(canonicalScriptletName('nie-istnieje'), null);
});

test('set-constant: dozwolone wartości uBO, inne → partial', () => {
  assert.equal(a('set', ['a.b', 'noopFunc']).status, 'supported');
  assert.equal(a('set', ['a.b', '32767']).status, 'supported');
  assert.equal(a('set', ['a.b', '40000']).status, 'partial');
  assert.equal(a('set', ['a.b', 'yes']).status, 'partial', 'uBO nie obsługuje "yes" w set-constant');
  assert.equal(a('set', ['a.b', 'true', 'as', 'function']).status, 'supported');
  assert.equal(a('set', ['a.b', 'true', 'as', 'banana']).status, 'partial');
  assert.equal(a('set', ['a.b', 'null', '3']).status, 'partial', 'stary pozycyjny runAt – niesparowany vararg');
});

test('json-prune: tryb logowania i stackNeedle nie są wykonywane', () => {
  assert.equal(a('json-prune', ['']).status, 'partial');
  assert.equal(a('json-prune', ['a', '', 'stack']).status, 'partial');
  assert.equal(a('json-prune', ['a b', 'c']).status, 'supported');
  assert.equal(a('json-prune-fetch-response', ['a', '', 'propsToMatch', 'url:/x']).status, 'supported');
  assert.equal(a('json-prune-fetch-response', ['a', '', 'stackToMatch', 'x']).status, 'partial');
  assert.equal(a('json-prune-fetch-response', ['a', '', 'propsToMatch']).status, 'partial', 'niesparowany vararg');
});

test('trusted-replace-*-response: "*" i pusty wzorzec nie są wykonywane', () => {
  assert.equal(a('trusted-rpfr', ['*', '']).status, 'partial');
  assert.equal(a('trusted-rpfr', ['', '']).status, 'partial');
  assert.equal(a('trusted-rpfr', ['/x/g', 'y', 'url:/player', 'includes', 'ad']).status, 'supported');
  assert.equal(a('trusted-rpfr', ['/x(/g', 'y']).status, 'partial', 'niepoprawny regex');
});

test('JSONPath: przypisanie tylko w wersji trusted; =call() nie jest obsługiwane', () => {
  assert.equal(a('json-edit-fetch-response', ['..a[?.b]', 'propsToMatch', '/x'], false).status, 'supported');
  assert.equal(a('json-edit-fetch-response', ['.a=1'], false).status, 'partial');
  assert.equal(a('trusted-json-edit-fetch-response', ['.a=1']).status, 'supported');
  assert.equal(a('trusted-json-edit', ['.a=call(["${obj}","alert"])']).status, 'partial');
});

test('trusted-click-element: ">>>" i warunek localStorage nie są wykonywane', () => {
  assert.equal(a('trusted-click-element', ['#a >>> button']).status, 'partial');
  assert.equal(a('trusted-click-element', ['#a', 'localStorage:x']).status, 'partial');
  assert.equal(a('trusted-click-element', ['#a, .b', 'cookie:consent', '500']).status, 'supported');
});

test('abort-on-stack-trace jest jawnie nieobsługiwany', () => {
  const r = a('aost', ['a', 'b']);
  assert.equal(r.status, 'unsupported');
  assert.match(r.reason, /stosu/);
});

test('każda specyfikacja ma walidator albo jest oznaczona jako niezaimplementowana', () => {
  for (const s of Object.values(SCRIPTLET_SPECS)) {
    assert.ok(typeof s.validate === 'function' || s.implemented === false, s.name);
  }
});
