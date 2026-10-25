// Źródła list: lista „Reklamy” używa EasyList Polish; Polskie Filtry (MajkiIT / Certyficate IT)
// nie są pobierane, wbudowywane ani podawane w attribution.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { LISTS, LISTS_DIR, ROOT, loadListLines } from '../../tools/lists-config.mjs';

const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const OLD = /MajkiIT|polish-ads-filter|Certyficate|certyficate\.it|Polskie Filtry|pl\/adblock/i;

test('lista ads: EasyList + uBlock filters + EasyList Polish; bez plików pl/', () => {
  const ads = LISTS.find((l) => l.id === 'ads');
  const files = ads.sources.map((s) => s.file);
  assert.ok(files.includes('easylist/easylist.txt'));
  assert.ok(files.includes('ubo/filters.txt'));
  assert.ok(files.includes('easylist/easylistpolish.txt'), 'EasyList Polish w liście ads');
  assert.equal(ads.sources.find((s) => s.file === 'easylist/easylistpolish.txt').trusted, undefined, 'EasyList Polish nie jest listą zaufaną (bez trusted-* scriptletów)');
  for (const l of LISTS) for (const s of l.sources) assert.doesNotMatch(s.file, /^pl\//, `${l.id}: ${s.file}`);
  assert.match(ads.desc, /EasyList Polish/);
  assert.doesNotMatch(ads.desc, OLD);
  assert.equal(fs.existsSync(path.join(LISTS_DIR, 'pl')), false, 'brak katalogu tools/lists/pl');
});

test('update-lists: oficjalny URL EasyList Polish, bez polish-ads-filter', () => {
  const src = read('tools/update-lists.mjs');
  assert.match(src, /'easylist\/easylistpolish\.txt': 'https:\/\/easylist-downloads\.adblockplus\.org\/easylistpolish\.txt'/);
  assert.doesNotMatch(src, OLD);
  assert.doesNotMatch(src, /adblock_(suplement|ublock|adguard)|['"]pl\//);
});

test('EasyList Polish w repo: nagłówek z licencją EasyList i źródłem; same filtry, bez !#include', () => {
  const text = read('tools/lists/easylist/easylistpolish.txt');
  assert.match(text, /^\[Adblock Plus 2\.0\]/);
  assert.match(text, /^! Title: EasyList Polish$/m);
  assert.match(text, /^! Licence: https:\/\/easylist\.to\/pages\/licence\.html$/m);
  assert.match(text, /easylistpolish\/easylistpolish/);
  assert.doesNotMatch(text, /^!#include/m);
  assert.doesNotMatch(text, OLD);
  const filters = loadListLines('easylist/easylistpolish.txt').filter((l) => l.trim() && !l.startsWith('!') && !l.startsWith('['));
  assert.ok(filters.length > 1000, `filtrów: ${filters.length}`);
});

test('attribution: README i Opcje podają EasyList Polish z licencją; bez Polskich Filtrów MajkiIT', () => {
  for (const f of ['README.md', 'options/options.html']) {
    const t = read(f);
    assert.match(t, /EasyList Polish/, f);
    assert.match(t, /https:\/\/easylist\.to\/pages\/licence\.html/, `${f}: link do licencji`);
    assert.match(t, /github\.com\/easylistpolish\/easylistpolish/, `${f}: upstream`);
    assert.match(t, /przetwarzan/, `${f}: informacja o przetwarzaniu przez build`);
    assert.doesNotMatch(t, /MajkiIT|Certyficate|Polskie Filtry|BY-NC-SA/, f);
  }
  assert.doesNotMatch(JSON.stringify(JSON.parse(read('data/lists.json'))), OLD, 'opis list w paczce');
});
