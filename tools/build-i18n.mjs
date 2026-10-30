#!/usr/bin/env node
// Apex AdBlocker – generuje _locales/{pl,en}/messages.json z tools/i18n-messages.mjs.
//
//   npm run i18n
//
// $1…$9 w źródle → nazwane placeholdery Chrome ($P1$ → "content": "$1"); inny „$” → „$$”.
// Dodatkowo shared/messages-pl.js – polskie teksty jako zapas dla kodu bez chrome.i18n
// (testy w Node, moduły współdzielone przez service worker i testy).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MESSAGES } from './i18n-messages.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LOCALES = Object.freeze(['pl', 'en']);
export const DEFAULT_LOCALE = 'en';

/** messages.json dla jednego języka (obiekt gotowy do JSON.stringify). */
export function localeMessages(lang) {
  const out = {};
  for (const [key, entry] of Object.entries(MESSAGES)) {
    const text = entry[lang];
    if (typeof text !== 'string' || !text) throw new Error(`brak tekstu „${lang}” dla ${key}`);
    const nums = [...new Set([...text.matchAll(/\$(\d)/g)].map((m) => m[1]))].sort();
    const msg = { message: text.replace(/\$(?!\d)/g, '$$$$').replace(/\$(\d)/g, (_, n) => `$P${n}$`) };
    if (nums.length) msg.placeholders = Object.fromEntries(nums.map((n) => [`p${n}`, { content: `$${n}` }]));
    out[key] = msg;
  }
  return out;
}

/** Zawartość pliku messages.json (z końcowym znakiem nowej linii). */
export function localeFile(lang) {
  return JSON.stringify(localeMessages(lang), null, 2) + '\n';
}

/** Zawartość shared/messages-pl.js (polski zapas dla shared/i18n.js). */
export function fallbackModule() {
  const pl = Object.fromEntries(Object.entries(MESSAGES).map(([k, e]) => [k, e.pl]));
  return '// Apex AdBlocker – polskie teksty jako zapas dla shared/i18n.js, gdy chrome.i18n jest niedostępne\n'
    + '// (testy w Node). Plik generowany przez tools/build-i18n.mjs (npm run i18n) – nie edytuj ręcznie.\n\n'
    + `export const MESSAGES_PL = Object.freeze(${JSON.stringify(pl, null, 2)});\n`;
}

export function buildI18n(root = ROOT) {
  const written = [];
  fs.writeFileSync(path.join(root, 'shared', 'messages-pl.js'), fallbackModule());
  written.push('shared/messages-pl.js');
  for (const lang of LOCALES) {
    const file = path.join(root, '_locales', lang, 'messages.json');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, localeFile(lang));
    written.push(path.relative(root, file));
  }
  return written;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  console.log(`✓ teksty interfejsu: ${buildI18n().join(', ')}`);
}
