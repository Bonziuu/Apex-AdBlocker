// Apex AdBlocker – konfiguracja list filtrów i ich wczytywanie (z obsługą !#include i !#if).
// Wspólne dla build.mjs, audit-scriptlets.mjs, update-lists.mjs i testów.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LISTS_DIR = path.join(ROOT, 'tools', 'lists');

/**
 * Licencje katalogów źródłowych w tools/lists/ (provenance). Każdy plik listy, także dołączany
 * przez !#include, leży w katalogu swojego upstreamu. Wartości to identyfikatory SPDX.
 * EasyList / EasyPrivacy są podwójnie licencjonowane; Apex korzysta z opcji GPL-3.0-or-later.
 * Połączone z uBlock filters (GPL-3.0-only) dają w wynikowych plikach ads / privacy GPL-3.0-only.
 */
export const SOURCE_LICENSES = Object.freeze({
  easylist: { spdx: 'GPL-3.0-or-later OR CC-BY-SA-3.0', used: 'GPL-3.0-or-later', upstream: 'EasyList', url: 'https://easylist.to/' },
  ubo: { spdx: 'GPL-3.0-only', used: 'GPL-3.0-only', upstream: 'uBlock filters (uBlockOrigin/uAssets)', url: 'https://github.com/uBlockOrigin/uAssets' },
  pl: { spdx: 'CC-BY-NC-SA-4.0', used: 'CC-BY-NC-SA-4.0', upstream: 'Oficjalne Polskie Filtry (Certyficate IT)', url: 'https://github.com/MajkiIT/polish-ads-filter' },
});

/** Katalog upstreamu dla ścieżki źródła względnej do tools/lists/ (np. 'ubo/filters.txt' → 'ubo'). */
export function sourceFamily(file) {
  return String(file).split(/[\\/]/)[0];
}

/**
 * Listy używane przez Apex AdBlocker – stały zestaw (shared/core-lists.js: CORE_LISTS). Bez list
 * cookies / annoyances (nie są częścią produktu 1.0 i nie trafiają do paczki).
 * "trusted" = źródło uBlock filters (uAssets), któremu wolno używać scriptletów zaufanych
 * (trusted-*), tak jak w uBO.
 *
 * Zasada licencyjna: wszystkie źródła jednej listy mają tę samą licencję wynikową (`license`),
 * więc żaden wygenerowany plik (rules/<id>.json, data/<id>*.json, scriptlets/<id>-*.js) nie łączy
 * danych na licencjach GPL i CC BY-NC-SA. Polskie Filtry tworzą osobną listę `pl`.
 * Pilnują tego tests/build/license-separation.test.mjs.
 */
export const LISTS = [
  {
    id: 'ads',
    name: 'Reklamy',
    desc: 'EasyList i uBlock filters',
    enabled: true,
    license: 'GPL-3.0-only',
    sources: [
      { file: 'easylist/easylist.txt' },
      { file: 'ubo/filters.txt', trusted: true },
      { file: 'ubo/quick-fixes.txt', trusted: true },
      { file: 'ubo/unbreak.txt', trusted: true },
    ],
  },
  {
    id: 'privacy',
    name: 'Śledzenie i prywatność',
    desc: 'EasyPrivacy i uBlock filters – Privacy',
    enabled: true,
    license: 'GPL-3.0-only',
    sources: [
      { file: 'easylist/easyprivacy.txt' },
      { file: 'ubo/privacy.txt', trusted: true },
    ],
  },
  {
    id: 'security',
    name: 'Złośliwe strony',
    desc: 'uBlock filters – Badware risks (oszustwa, malware)',
    enabled: true,
    license: 'GPL-3.0-only',
    sources: [{ file: 'ubo/badware.txt', trusted: true }],
  },
  {
    id: 'pl',
    name: 'Polskie Filtry',
    desc: 'Oficjalne Polskie Filtry (Certyficate IT) – reklamy na polskich stronach',
    enabled: true,
    license: 'CC-BY-NC-SA-4.0',
    sources: [{ file: 'pl/adblock.txt' }],
  },
];

/**
 * Wszystkie pliki (ścieżki względne do tools/lists/) wczytywane dla listy, łącznie z plikami
 * dołączanymi przez !#include w aktywnych gałęziach !#if.
 */
export function listSourceFiles(list, { dir = LISTS_DIR } = {}) {
  const seen = new Set();
  for (const src of list.sources) loadListLines(src.file, { dir, seen });
  return [...seen].map((abs) => path.relative(dir, abs).split(path.sep).join('/')).sort();
}

// Środowisko dla dyrektyw !#if – Apex AdBlocker zachowuje się jak uBO Lite (MV3) w Chromium.
export const ENV = {
  env_chromium: true, env_mv3: true, ext_ubol: true, ext_ublock: true,
  cap_html_filtering: false, cap_user_stylesheet: true, cap_ipaddress: false,
  env_firefox: false, env_safari: false, env_mobile: false, env_edge: false,
  adguard: false, adguard_ext_firefox: false, adguard_ext_chromium: false, ext_abp: false,
  ext_devbuild: false, false: false, true: true,
};

export function evalCondition(expr, env = ENV) {
  const tokens = expr.match(/!|&&|\|\||\(|\)|[A-Za-z0-9_]+/g) || [];
  let pos = 0;
  const parseOr = () => { let v = parseAnd(); while (tokens[pos] === '||') { pos++; v = parseAnd() || v; } return v; };
  const parseAnd = () => { let v = parseNot(); while (tokens[pos] === '&&') { pos++; v = parseNot() && v; } return v; };
  const parseNot = () => {
    if (tokens[pos] === '!') { pos++; return !parseNot(); }
    if (tokens[pos] === '(') { pos++; const v = parseOr(); pos++; return v; }
    return env[tokens[pos++]] === true;
  };
  return parseOr();
}

/** Wczytuje plik listy z rozwinięciem !#include i obsługą !#if/!#else/!#endif. */
export function loadListLines(file, { dir = LISTS_DIR, seen = new Set() } = {}) {
  const abs = path.join(dir, file);
  if (seen.has(abs) || !fs.existsSync(abs)) return [];
  seen.add(abs);
  const out = [];
  const stack = [];
  for (const line of fs.readFileSync(abs, 'utf8').split(/\r?\n/)) {
    if (line.startsWith('!#if ')) { stack.push(evalCondition(line.slice(5))); continue; }
    if (line.startsWith('!#else')) { if (stack.length) stack[stack.length - 1] = !stack[stack.length - 1]; continue; }
    if (line.startsWith('!#endif')) { stack.pop(); continue; }
    if (!stack.every(Boolean)) continue;
    if (line.startsWith('!#include ')) {
      out.push(...loadListLines(path.join(path.dirname(file), line.slice(10).trim()), { dir, seen }));
      continue;
    }
    out.push(line);
  }
  return out;
}

/** Wszystkie linie listy jako {line, trusted, source}. */
export function loadList(list, opts = {}) {
  const out = [];
  for (const src of list.sources) {
    for (const line of loadListLines(src.file, opts)) out.push({ line: line.trim(), trusted: !!src.trusted, source: src.file });
  }
  return out;
}
