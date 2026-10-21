#!/usr/bin/env node
// Pobiera najnowsze wersje list filtrów do tools/lists/, po czym trzeba uruchomić build:
//   node tools/update-lists.mjs && node tools/build.mjs
// Wymaga Node 18+ (wbudowany fetch).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'lists');

const UBO = 'https://ublockorigin.github.io/uAssets/filters/';
const PL = 'https://raw.githubusercontent.com/MajkiIT/polish-ads-filter/master/polish-adblock-filters/';

const FILES = {
  'easylist/easylist.txt': 'https://easylist.to/easylist/easylist.txt',
  'easylist/easyprivacy.txt': 'https://easylist.to/easylist/easyprivacy.txt',
  'easylist/fanboy-annoyance.txt': 'https://secure.fanboy.co.nz/fanboy-annoyance.txt',
  'pl/adblock.txt': PL + 'adblock.txt',
  'pl/adblock_adguard.txt': PL + 'adblock_adguard.txt',
  'pl/adblock_suplement.txt': PL + 'adblock_suplement.txt',
  'pl/adblock_ublock.txt': PL + 'adblock_ublock.txt',
};
for (const name of [
  'filters', 'filters-2020', 'filters-2021', 'filters-2022', 'filters-2023', 'filters-2024', 'filters-2025',
  'filters-2026', 'filters-general', 'filters-mobile', 'resource-abuse', 'ubo-link-shorteners', 'privacy',
  'badware', 'quick-fixes', 'unbreak', 'annoyances-cookies', 'annoyances-others',
]) FILES[`ubo/${name}.txt`] = UBO + name + '.txt';

let failed = 0;
for (const [file, url] of Object.entries(FILES)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    if (text.length < 100) throw new Error('podejrzanie mały plik');
    fs.mkdirSync(path.dirname(path.join(DIR, file)), { recursive: true });
    fs.writeFileSync(path.join(DIR, file), text);
    console.log('✓', file, `(${Math.round(text.length / 1024)} KB)`);
  } catch (e) {
    failed++;
    console.warn('✗', file, '–', e.message, '(zostaje poprzednia wersja)');
  }
}
console.log(failed ? `\nGotowe, ${failed} plików nie udało się pobrać.` : '\nGotowe. Teraz uruchom: node tools/build.mjs');
