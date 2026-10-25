#!/usr/bin/env node
// ChromeBlock – pobiera najnowsze wersje list filtrów do tools/lists/ i od razu
// sprawdza, czy zmieniły się filtry YouTube oraz czy pojawiły się scriptlety
// (lub warianty parametrów), których ChromeBlock nie obsługuje.
//
//   node tools/update-lists.mjs && npm run build && npm run check
//
// Wymaga Node 18+ (wbudowany fetch). Pobierane są wyłącznie listy filtrów
// (tekst) – żaden kod nie jest pobierany ani wykonywany.

import fs from 'node:fs';
import path from 'node:path';
import { LISTS_DIR } from './lists-config.mjs';
import { collectScriptletFilters, readBaseline } from './audit-scriptlets.mjs';
import { YOUTUBE_STRICT_LISTS, compareWithBaseline } from '../youtube/compatibility.js';

const UBO = 'https://ublockorigin.github.io/uAssets/filters/';

const FILES = {
  'easylist/easylist.txt': 'https://easylist.to/easylist/easylist.txt',
  'easylist/easyprivacy.txt': 'https://easylist.to/easylist/easyprivacy.txt',
  'easylist/fanboy-annoyance.txt': 'https://secure.fanboy.co.nz/fanboy-annoyance.txt',
  // EasyList Polish – oficjalna lista (licencja: https://easylist.to/pages/licence.html)
  'easylist/easylistpolish.txt': 'https://easylist-downloads.adblockplus.org/easylistpolish.txt',
};
for (const name of [
  'filters', 'filters-2020', 'filters-2021', 'filters-2022', 'filters-2023', 'filters-2024', 'filters-2025',
  'filters-2026', 'filters-general', 'filters-mobile', 'resource-abuse', 'ubo-link-shorteners', 'privacy',
  'badware', 'quick-fixes', 'unbreak', 'annoyances-cookies', 'annoyances-others',
]) FILES[`ubo/${name}.txt`] = UBO + name + '.txt';

function youtubeSnapshot() {
  const entries = collectScriptletFilters().filter((e) => e.youtube.length && YOUTUBE_STRICT_LISTS.includes(e.list));
  const unique = new Map();
  for (const e of entries) unique.set(e.line, e);
  return unique;
}

const before = youtubeSnapshot();

let failed = 0;
for (const [file, url] of Object.entries(FILES)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    if (text.length < 100) throw new Error('podejrzanie mały plik');
    fs.mkdirSync(path.dirname(path.join(LISTS_DIR, file)), { recursive: true });
    fs.writeFileSync(path.join(LISTS_DIR, file), text);
    console.log('✓', file, `(${Math.round(text.length / 1024)} KB)`);
  } catch (e) {
    failed++;
    console.warn('✗', file, '–', e.message, '(zostaje poprzednia wersja)');
  }
}
console.log(failed ? `\n${failed} plików nie udało się pobrać.` : '\nListy pobrane.');

// --- Kontrola filtrów YouTube ------------------------------------------------
const after = youtubeSnapshot();
const added = [...after.keys()].filter((k) => !before.has(k));
const removed = [...before.keys()].filter((k) => !after.has(k));
if (added.length || removed.length) {
  console.log(`\nYouTube filters changed. (+${added.length} / -${removed.length})`);
  for (const k of added) console.log(`  + [${after.get(k).status}] ${k.slice(0, 180)}`);
  for (const k of removed) console.log(`  - ${k.slice(0, 180)}`);
} else {
  console.log('\nFiltry YouTube bez zmian.');
}
const cmp = compareWithBaseline([...after.values()], readBaseline());
if (cmp.newGaps.length) {
  console.log(`\nNew unsupported scriptlet detected. (${cmp.newGaps.length})`);
  for (const g of cmp.newGaps) console.log(`  ✗ ${g.name}: ${g.reason}\n    ${g.line.slice(0, 180)}`);
  console.log('\nBuild w trybie strict zakończy się błędem, dopóki braki nie zostaną zaimplementowane');
  console.log('albo świadomie wpisane do youtube/known-gaps.json.');
  process.exitCode = 2;
}
console.log('\nDalej: npm run build && npm run check');
