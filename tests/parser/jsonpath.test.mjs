// Testy silnika JSONPath (dialekt uBO, w tym legacy używany przez YouTube).

import test from 'node:test';
import assert from 'node:assert/strict';
import { ApexJSONPath as JP } from '../../shared/jsonpath.js';

const apply = (q, obj) => JP.compileQuery(q).apply(obj);

test('usuwanie: .a.b, ..klucz, .*', () => {
  assert.deepEqual(apply('.a.b', { a: { b: 1, c: 2 } }), { a: { c: 2 } });
  assert.deepEqual(apply('..ad', { x: { ad: 1, y: [{ ad: 2, z: 1 }] } }), { x: { y: [{ z: 1 }] } });
  assert.deepEqual(apply('$.list.*', { list: [1, 2, 3] }), { list: [] });
});

test('brak dopasowania → undefined (obiekt niezmieniony)', () => {
  const o = { a: 1 };
  assert.equal(apply('.b', o), undefined);
  assert.deepEqual(o, { a: 1 });
});

test('filtr legacy [?.x] na tablicy: usuwa elementy posiadające właściwość', () => {
  assert.deepEqual(apply('.items[?.ad]', { items: [{ v: 1 }, { ad: 1 }, { v: 2 }] }), { items: [{ v: 1 }, { v: 2 }] });
});

test('filtr legacy [?.x] na obiekcie: działa jak warunek dla bieżącego węzła', () => {
  const q = '[?.attestationRequest].context.client.screen="X"';
  assert.deepEqual(apply(q, { attestationRequest: {}, context: { client: { screen: 'A' } } }), { attestationRequest: {}, context: { client: { screen: 'X' } } });
  assert.equal(apply(q, { context: { client: { screen: 'A' } } }), undefined);
  // jak w uBO: przypisanie nie tworzy nieistniejących kluczy
  assert.equal(apply(q, { attestationRequest: {}, context: { client: {} } }), undefined);
});

test('operatory porównania i regex', () => {
  const o = () => ({ a: [{ n: 1, s: 'abc' }, { n: 5, s: 'xyz' }] });
  assert.deepEqual(apply('.a[?.n>3]', o()), { a: [{ n: 1, s: 'abc' }] });
  assert.deepEqual(apply('.a[?.s^="ab"]', o()), { a: [{ n: 5, s: 'xyz' }] });
  assert.deepEqual(apply('.a[?.s*="y"]', o()), { a: [{ n: 1, s: 'abc' }] });
  assert.deepEqual(apply('.a[?.s=/^x/]', o()), { a: [{ n: 1, s: 'abc' }] });
  assert.deepEqual(apply('.a[?.n=="1"]', o()), undefined, '== porównuje ściśle');
});

test('negacja [?!.x]', () => {
  assert.deepEqual(apply('.a[?!.keep]', { a: [{ keep: 1 }, { drop: 1 }] }), { a: [{ keep: 1 }] });
});

test('przypisania: =JSON, +={...}, =repl(...), ${now}', () => {
  assert.deepEqual(apply('.a.b=0', { a: { b: 5 } }), { a: { b: 0 } });
  assert.deepEqual(apply('.a+={"x":1}', { a: { y: 2 } }), { a: { y: 2, x: 1 } });
  assert.deepEqual(apply('.u=repl({"regex":"(?:#r)?$","replacement":"#r"})', { u: 'p' }), { u: 'p#r' });
  assert.deepEqual(apply('.u=repl({"pattern":".","replacement":"!"})', { u: 'a.b.c' }), { u: 'a!b.c' }, 'pattern = dosłownie, pierwsze wystąpienie');
  const t = Number(apply('.t="${now}"', { t: 0 }).t);
  assert.ok(Math.abs(t - Date.now()) < 5000);
});

test('łańcuchy ;$ i kwantyfikatory', () => {
  assert.deepEqual(apply('v2:$.flag{1};$.ad', { flag: 1, ad: 1 }), { flag: 1 });
  assert.equal(apply('v2:$.flag{1};$.ad', { ad: 1 }), undefined);
  assert.deepEqual(apply('v2:$.flag{0};$.ad', { ad: 1 }), {});
});

test('nawiasy: ["klucz"], indeksy, lista kluczy', () => {
  assert.deepEqual(apply('$["a b"]', { 'a b': 1, c: 2 }), { c: 2 });
  assert.deepEqual(apply('$.l[-1]', { l: [1, 2, 3] }), { l: [1, 2] });
  assert.deepEqual(apply('$["a","b"]', { a: 1, b: 2, c: 3 }), { c: 3 });
});

test('niepoprawne zapytania i =call() są odrzucane', () => {
  for (const q of ['', '.a.', '$[foo]', '.a=nie-json', '.a=call(["${obj}","x"])', '.a[?.b']) {
    assert.equal(JP.compileQuery(q).valid, false, q);
  }
});

test('YouTube: ..itemSectionRenderer.contents.*[?.adSlotRenderer]', () => {
  const o = { r: { itemSectionRenderer: { contents: [{ v: 1 }, { adSlotRenderer: {} }] } } };
  assert.deepEqual(apply('..itemSectionRenderer.contents.*[?.adSlotRenderer]', o), { r: { itemSectionRenderer: { contents: [{ v: 1 }] } } });
});
