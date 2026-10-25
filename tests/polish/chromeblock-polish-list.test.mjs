// ChromeBlock Polish Supplement: struktura listy, provenance i clean room.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { LISTS, LISTS_DIR, ROOT, loadListLines } from '../../tools/lists-config.mjs';
import { validateList, ruleLines, ruleType } from '../../tools/polish-sites/provenance.mjs';

const LIST_FILE = 'chromeblock-polish/chromeblock-polish.txt';
const listText = () => fs.readFileSync(path.join(LISTS_DIR, LIST_FILE), 'utf8');
const prov = () => JSON.parse(fs.readFileSync(path.join(LISTS_DIR, 'chromeblock-polish', 'provenance.json'), 'utf8'));

/** Linie wszystkich innych list wbudowanych w ChromeBlock (z rozwinięciem !#include). */
function otherBundledLines() {
  const set = new Set();
  for (const l of LISTS) for (const s of l.sources) {
    if (s.file === LIST_FILE) continue;
    for (const line of loadListLines(s.file)) set.add(line.trim());
  }
  return set;
}

test('lista w kategorii ads (nie zaufana), Polskie Filtry nadal w main', () => {
  const ads = LISTS.find((l) => l.id === 'ads');
  const src = ads.sources.find((s) => s.file === LIST_FILE);
  assert.ok(src, 'ChromeBlock Polish Supplement w liście ads');
  assert.ok(!src.trusted, 'bez trusted-* scriptletów');
  assert.ok(ads.sources.some((s) => s.file === 'pl/adblock.txt'), 'Polskie Filtry nie są usuwane na tym etapie');
  assert.match(ads.desc, /ChromeBlock Polish Supplement/);
  // update-lists nie pobiera ani nie nadpisuje własnej listy
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'tools/update-lists.mjs'), 'utf8'), /'chromeblock-polish\//);
});

test('nagłówek: nazwa, niezależne reguły, data aktualizacji, License: TBD', () => {
  const t = listText();
  assert.match(t, /^\[Adblock Plus 2\.0\]/);
  assert.match(t, /^! Title: ChromeBlock Polish Supplement$/m);
  assert.match(t, /tworzone niezależnie przez projekt ChromeBlock/);
  assert.match(t, /^! Last modified: \d{4}-\d{2}-\d{2}$/m);
  assert.match(t, /^! License: TBD$/m);
  assert.doesNotMatch(t, /^!#include/m);
});

test('provenance: każda reguła ma wpis, typ zgodny, brak kopii innych list (aktualny stan)', () => {
  const problems = validateList(listText(), prov(), otherBundledLines());
  assert.deepEqual(problems, []);
  assert.ok(ruleLines(listText()).length <= 20, 'pierwsza partia: maks. 20 reguł');
});

test('walidator nie jest pusty: wykrywa brak provenance, zły typ, duplikat innej listy i długi opis', () => {
  const head = '[Adblock Plus 2.0]\n! Title: ChromeBlock Polish Supplement\n! Description: reguły tworzone niezależnie\n! Last modified: 2026-10-25\n! License: TBD\n';
  const others = new Set(['example.pl##.skopiowana']);
  const ok = { schema: 1, rules: [
    { rule: 'strona.pl##.boks-testowy', domain: 'strona.pl', type: 'cosmetic', date: '2026-10-25', observation: 'Pusty boks z etykietą REKLAMA pod artykułem (300x250).', method: 'manual' },
    { rule: '||reklamy-test.pl^$third-party', domain: 'strona.pl', type: 'network', date: '2026-10-25', observation: 'Skrypt reklamowy ładowany z hosta reklamowego, widoczny baner.', method: 'automated-browser' },
  ] };
  assert.deepEqual(validateList(head + 'strona.pl##.boks-testowy\n||reklamy-test.pl^$third-party\n', ok, others), []);
  // brak wpisu
  assert.ok(validateList(head + 'strona.pl##.inny\n', { schema: 1, rules: [] }).some((p) => /brak wpisu/.test(p)));
  // typ niezgodny
  const bad = structuredClone(ok); bad.rules[0].type = 'network';
  assert.ok(validateList(head + 'strona.pl##.boks-testowy\n||reklamy-test.pl^$third-party\n', bad).some((p) => /typ w provenance/.test(p)));
  // identyczna z inną listą
  const dup = { schema: 1, rules: [{ ...ok.rules[0], rule: 'example.pl##.skopiowana', domain: 'example.pl' }] };
  assert.ok(validateList(head + 'example.pl##.skopiowana\n', dup, others).some((p) => /identyczna z linią innej/.test(p)));
  // opis zbyt długi / kod strony
  const long = structuredClone(ok); long.rules[0].observation = 'x'.repeat(201);
  assert.ok(validateList(head + 'strona.pl##.boks-testowy\n||reklamy-test.pl^$third-party\n', long).some((p) => /dłuższy niż/.test(p)));
  const code = structuredClone(ok); code.rules[0].observation = '<div class="ad">kod strony</div> skopiowany';
  assert.ok(validateList(head + 'strona.pl##.boks-testowy\n||reklamy-test.pl^$third-party\n', code).some((p) => /kod strony/.test(p)));
  // zła metoda, licencja inna niż TBD
  const meth = structuredClone(ok); meth.rules[1].method = 'copied';
  assert.ok(validateList(head + 'strona.pl##.boks-testowy\n||reklamy-test.pl^$third-party\n', meth).some((p) => /metoda/.test(p)));
  assert.ok(validateList(head.replace('License: TBD', 'License: MIT') + 'strona.pl##.boks-testowy\n||reklamy-test.pl^$third-party\n', ok).some((p) => /TBD/.test(p)));
  assert.equal(ruleType('strona.pl##+js(set-constant, a, 1)'), 'scriptlet');
  assert.equal(ruleType('##+js(set-constant, a, 1)'), null, 'ogólny scriptlet nie jest wykonywany');
});
