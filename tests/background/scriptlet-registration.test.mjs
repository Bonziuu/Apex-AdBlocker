// Kontrakt modułu background/scriptlet-registration.js (opis rejestracji scriptletów i porównanie z zarejestrowanymi)
// – bez Chrome i bez Playwrighta.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  scriptletRegistrations, sameScriptletRegistrations, SESSION_SUFFIX, SCRIPTLET_PERF_FLAG_FILE,
} from '../../background/scriptlet-registration.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const FILE = { id: 'sl-ads-0', file: 'scriptlets/ads-0.js' };
const regs = (f, o = {}) => scriptletRegistrations({ ...FILE, ...f }, { devPerf: false, excludeMatches: [], ...o });
const COMMON = { runAt: 'document_start', allFrames: true, world: 'MAIN' };

test('stałe: sufiks sesyjny i plik-flaga profilera', () => {
  assert.equal(SESSION_SUFFIX, '-s');
  assert.equal(SCRIPTLET_PERF_FLAG_FILE, 'content/scriptlet-perf-on.js');
});

test('tylko matches → jedna rejestracja utrwalana', () => {
  assert.deepEqual(regs({ matches: ['*://*.a.com/*'] }), [
    { id: 'sl-ads-0', js: ['scriptlets/ads-0.js'], ...COMMON, matches: ['*://*.a.com/*'], persistAcrossSessions: true },
  ]);
});

test('tylko sessionMatches → jedna rejestracja sesyjna z sufiksem -s', () => {
  assert.deepEqual(regs({ sessionMatches: ['*://*.example.*/*'] }), [
    { id: 'sl-ads-0-s', js: ['scriptlets/ads-0.js'], ...COMMON, matches: ['*://*.example.*/*'], persistAcrossSessions: false },
  ]);
});

test('oba rodzaje → dwie rejestracje (najpierw utrwalana); brak obu → pusta lista', () => {
  const r = regs({ matches: ['*://*.a.com/*'], sessionMatches: ['*://*.b.*/*'] });
  assert.deepEqual(r.map((x) => [x.id, x.persistAcrossSessions, x.matches]), [['sl-ads-0', true, ['*://*.a.com/*']], ['sl-ads-0-s', false, ['*://*.b.*/*']]]);
  assert.deepEqual(regs({}), []);
  assert.deepEqual(regs({ matches: [], sessionMatches: [] }), []);
});

test('devPerf: false → tylko scriptlet; true → najpierw plik-flaga, potem scriptlet (w obu rejestracjach)', () => {
  assert.deepEqual(regs({ matches: ['*://*.a.com/*'] }, { devPerf: false })[0].js, ['scriptlets/ads-0.js']);
  for (const r of regs({ matches: ['*://*.a.com/*'], sessionMatches: ['*://*.b.*/*'] }, { devPerf: true })) {
    assert.deepEqual(r.js, ['content/scriptlet-perf-on.js', 'scriptlets/ads-0.js'], r.id);
  }
});

test('excludeMatches kopiowane do obu rodzajów; puste → brak pola', () => {
  const ex = ['*://*.bank.example/*'];
  for (const r of regs({ matches: ['*://*.a.com/*'], sessionMatches: ['*://*.b.*/*'] }, { excludeMatches: ex })) assert.deepEqual(r.excludeMatches, ex, r.id);
  for (const r of regs({ matches: ['*://*.a.com/*'], sessionMatches: ['*://*.b.*/*'] })) assert.equal('excludeMatches' in r, false, r.id);
});

test('sameScriptletRegistrations: identyczne zestawy → true; kolejność hostów bez znaczenia', () => {
  const wanted = regs({ matches: ['*://*.a.com/*', '*://*.b.com/*'], sessionMatches: ['*://*.c.*/*'] }, { excludeMatches: ['*://*.x.com/*', '*://*.y.com/*'] });
  assert.equal(sameScriptletRegistrations(structuredClone(wanted), wanted), true);
  const shuffled = structuredClone(wanted).map((r) => ({ ...r, matches: [...r.matches].reverse(), excludeMatches: [...r.excludeMatches].reverse() }));
  assert.equal(sameScriptletRegistrations(shuffled, wanted), true);
  // Chrome może pominąć pola domyślne – liczy się wartość domyślna (persistAcrossSessions !== false)
  const p = regs({ matches: ['*://*.a.com/*'] });
  const fromChrome = [{ ...p[0] }];
  delete fromChrome[0].persistAcrossSessions;
  assert.equal(sameScriptletRegistrations(fromChrome, p), true);
});

test('sameScriptletRegistrations: różnica id, js, runAt, allFrames, world, utrwalania, matches lub liczby → false', () => {
  const wanted = regs({ matches: ['*://*.a.com/*'] }, { excludeMatches: ['*://*.x.com/*'] });
  const variants = {
    id: { id: 'sl-ads-1' },
    js: { js: ['content/scriptlet-perf-on.js', 'scriptlets/ads-0.js'] },
    runAt: { runAt: 'document_end' },
    runAtDefault: { runAt: undefined }, // brak → document_idle
    allFrames: { allFrames: false },
    world: { world: 'ISOLATED' },
    worldDefault: { world: undefined }, // brak → ISOLATED
    persistence: { persistAcrossSessions: false },
    matches: { matches: ['*://*.other.com/*'] },
    excludeMatches: { excludeMatches: [] },
  };
  for (const [name, patch] of Object.entries(variants)) {
    assert.equal(sameScriptletRegistrations([{ ...wanted[0], ...patch }], wanted), false, name);
  }
  assert.equal(sameScriptletRegistrations([], wanted), false);
  assert.equal(sameScriptletRegistrations([...wanted, ...wanted], wanted), false);
  // kolejność rejestracji ma znaczenie (porównanie pozycyjne)
  const two = regs({ matches: ['*://*.a.com/*'], sessionMatches: ['*://*.b.*/*'] });
  assert.equal(sameScriptletRegistrations([...two].reverse(), two), false);
});

test('moduł czysty: bez importów, Chrome API, I/O, await i stanu; background.js go importuje', () => {
  const raw = fs.readFileSync(path.join(ROOT, 'background/scriptlet-registration.js'), 'utf8');
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''); // bez komentarzy
  assert.doesNotMatch(src, /^import /m);
  assert.doesNotMatch(src, /\bchrome\.|\bfetch\(|import\(|\bawait\b|\basync\b|globalThis/);
  assert.doesNotMatch(src, /^(let|var) /m, 'brak zmiennego stanu modułu');
  assert.deepEqual([...src.matchAll(/^export (const|function) (\w+)/gm)].map((m) => m[2]).sort(),
    ['SCRIPTLET_PERF_FLAG_FILE', 'SESSION_SUFFIX', 'sameScriptletRegistrations', 'scriptletRegistrations']);
  const bg = fs.readFileSync(path.join(ROOT, 'background.js'), 'utf8');
  assert.match(bg, /^import \{ scriptletRegistrations, sameScriptletRegistrations \} from '\.\/background\/scriptlet-registration\.js';$/m);
  assert.doesNotMatch(bg, /function scriptletRegistrations|function sameScriptletRegistrations|SESSION_SUFFIX|SCRIPTLET_PERF_FLAG_FILE/);
  assert.match(bg, /const SESSION_SCRIPTLETS_KEY = 'sessionScriptletsOk';/);
});
