import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { hostKeys } from '../../shared/parser.js';
import { entityHelperSource } from '../../tools/build-entity-hosts.mjs';
const source = fs.readFileSync(new URL('../../shared/entity-hosts.js', import.meta.url), 'utf8');

test('entity scope uses the full PSL boundary, including private, wildcard and exception rules', () => {
  for (const host of ['google.fr', 'www.google.fr', 'www.google.co.jp', 'www.google.brandnewtld', 'google.blogspot.com', 'www.google.k12.ca.us', 'www.google.s3.us-west-2.amazonaws.com']) {
    assert.ok(hostKeys(host).includes('google.*'), host);
  }
  for (const host of ['google.attacker.com', 'www.google.attacker.com', 'www.google.attacker.co.jp', 'google.attacker.blogspot.com']) {
    assert.ok(!hostKeys(host).includes('google.*'), host);
  }
  assert.ok(hostKeys('www.example.city.kawasaki.jp').includes('city.*'), 'PSL exception city.kawasaki.jp');
  assert.ok(!hostKeys('www.example.foo.kawasaki.jp').includes('foo.*'), 'wildcard makes foo.kawasaki.jp a suffix');
  assert.ok(hostKeys('www.example.foo.kawasaki.jp').includes('example.*'));
  assert.ok(!hostKeys('127.0.0.1').some((x) => x.endsWith('.*')));
  assert.ok(!hostKeys('localhost').some((x) => x.endsWith('.*')));
});

test('shared classic helper is generated reproducibly and safe to load repeatedly', () => {
  assert.equal(source, entityHelperSource());
  const context = vm.createContext({});
  vm.runInContext(source, context);
  const first = vm.runInContext("globalThis[Symbol.for('ApexAdBlocker.entityHostKeys.v1')]", context);
  vm.runInContext(source, context);
  assert.equal(vm.runInContext("globalThis[Symbol.for('ApexAdBlocker.entityHostKeys.v1')]", context), first);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(vm.runInContext("Object.getOwnPropertyDescriptor(globalThis,Symbol.for('ApexAdBlocker.entityHostKeys.v1')).writable", context), false);
  assert.deepEqual(JSON.parse(vm.runInContext("JSON.stringify(globalThis[Symbol.for('ApexAdBlocker.entityHostKeys.v1')]('www.google.co.jp'))", context)), hostKeys('www.google.co.jp'));
});


test('without the shared prerequisite, an entity exception cannot be dropped', async () => {
  const { loadScriptletLibrary } = await import('../../tools/build.mjs');
  const context = vm.createContext({ location: { hostname: 'www.google.fr' } });
  // Fail closed before accessing browser primitives used by the library itself.
  // The runForHost behavior is separately extracted without changing its code.
  const body = /function runForHost\([\s\S]*$/.exec(loadScriptletLibrary())[0];
  vm.runInContext(body + "\nrunForHost([],{'www.google.fr':[]},{'www.google.*':['*']});", context);
  assert.equal(context.marker, undefined);
});
