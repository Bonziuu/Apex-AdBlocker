// Provenance list filtrów: każde skonfigurowane źródło (z plikami !#include) i każdy snapshot w tools/lists/
// musi być opisany w docs/filter-provenance.md, a licencje źródeł – wymienione w THIRD_PARTY_NOTICES.md.
// Test jest tani i deterministyczny (bez sieci). Nie ocenia licencji – pilnuje tylko kompletności dokumentacji.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { LISTS, LISTS_DIR, ROOT } from '../../tools/lists-config.mjs';

const DOC = fs.readFileSync(path.join(ROOT, 'docs', 'filter-provenance.md'), 'utf8');
const NOTICES = fs.readFileSync(path.join(ROOT, 'THIRD_PARTY_NOTICES.md'), 'utf8');

/** Plik + wszystkie pliki z !#include (niezależnie od !#if – dokumentujemy także warunkowe). */
function withIncludes(file, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);
  const abs = path.join(LISTS_DIR, file);
  if (!fs.existsSync(abs)) return seen;
  for (const line of fs.readFileSync(abs, 'utf8').split(/\r?\n/)) {
    if (line.startsWith('!#include ')) withIncludes(path.posix.join(path.posix.dirname(file), line.slice(10).trim()), seen);
  }
  return seen;
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const documented = (file) => {
  const [dir, name] = file.split('/');
  // w tabelach plik występuje jako „<dir>/<name>” albo jako `<name>` w sekcji katalogu tools/lists/<dir>/
  return DOC.includes(`${dir}/${name}`) || (DOC.includes(`tools/lists/${dir}/`) && DOC.includes(`\`${name}\``));
};

test('provenance: każde źródło z LISTS (z !#include) jest opisane', () => {
  const files = new Set(LISTS.flatMap((l) => l.sources.flatMap((s) => [...withIncludes(s.file)])));
  assert.ok(files.size >= 20, `źródeł: ${files.size}`);
  for (const f of files) {
    assert.ok(fs.existsSync(path.join(LISTS_DIR, f)), `brak snapshotu ${f}`);
    assert.ok(documented(f), `brak provenance dla ${f} w docs/filter-provenance.md`);
  }
});

test('provenance: każdy snapshot w tools/lists/ (także nieużywany) jest opisany', () => {
  const files = walk(LISTS_DIR).map((f) => path.relative(LISTS_DIR, f).split(path.sep).join('/'));
  assert.ok(files.length > 0);
  for (const f of files) assert.ok(documented(f), `brak provenance dla ${f}`);
});

test('provenance: licencje i statusy są w dokumentach; NonCommercial wyraźnie oznaczone', () => {
  for (const s of ['EasyList', 'EasyPrivacy', 'uBlock filters', 'Polskie Filtry']) {
    assert.match(NOTICES, new RegExp(s), s);
    assert.match(DOC, new RegExp(s), s);
  }
  assert.match(NOTICES, /https:\/\/easylist\.to\/pages\/licence\.html/);
  assert.match(NOTICES, /https:\/\/github\.com\/uBlockOrigin\/uAssets\/blob\/master\/LICENSE/);
  assert.match(NOTICES, /CC BY-NC-SA 4\.0/);
  assert.match(NOTICES, /NonCommercial/);
  assert.match(DOC, /NEEDS LEGAL REVIEW/);
  // każda lista ChromeBlock ma wiersz w tabeli łączenia źródeł
  for (const l of LISTS) assert.match(DOC, new RegExp(`\\| \`${l.id}\` \\|`), l.id);
});
