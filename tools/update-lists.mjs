#!/usr/bin/env node
// Apex AdBlocker – pobiera kompletny snapshot list, sprawdza zgodność i dopiero
// wtedy zastępuje poprzedni zestaw. Niepełna aktualizacja nigdy nie jest sukcesem.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { LISTS_DIR } from './lists-config.mjs';
import { collectScriptletFilters, readBaseline } from './audit-scriptlets.mjs';
import { YOUTUBE_STRICT_LISTS, compareWithBaseline } from '../youtube/compatibility.js';
import { classifyLine, parseNetworkFilter, parseCosmeticFilter } from '../shared/parser.js';

const UBO = 'https://ublockorigin.github.io/uAssets/filters/';
const PL = 'https://raw.githubusercontent.com/MajkiIT/polish-ads-filter/master/polish-adblock-filters/';
export const FILES = {
  'easylist/easylist.txt': 'https://easylist.to/easylist/easylist.txt',
  'easylist/easyprivacy.txt': 'https://easylist.to/easylist/easyprivacy.txt',
  'pl/adblock.txt': PL + 'adblock.txt',
  'pl/adblock_adguard.txt': PL + 'adblock_adguard.txt',
  'pl/adblock_suplement.txt': PL + 'adblock_suplement.txt',
  'pl/adblock_ublock.txt': PL + 'adblock_ublock.txt',
};
for (const name of [
  'filters', 'filters-2020', 'filters-2021', 'filters-2022', 'filters-2023', 'filters-2024', 'filters-2025',
  'filters-2026', 'filters-general', 'filters-mobile', 'resource-abuse', 'ubo-link-shorteners', 'privacy',
  'badware', 'quick-fixes', 'unbreak',
]) FILES[`ubo/${name}.txt`] = UBO + name + '.txt';

function youtubeSnapshot(dir) {
  const entries = collectScriptletFilters(undefined, { dir }).filter((e) => e.youtube.length && YOUTUBE_STRICT_LISTS.includes(e.list));
  return new Map(entries.map((e) => [e.line, e]));
}

/** Reject error pages and non-list payloads before they can replace an active snapshot. */
export function validateDownloadedList(text, contentType = '') {
  if (typeof text !== 'string' || text.length < 100) throw new Error('podejrzanie mały plik');
  if (/\b(?:text\/html|application\/(?:xhtml\+xml|json))\b/i.test(contentType)
    || /(?:^|\n)\s*<(?:!doctype\b|\/?(?:html|head|body|title|meta|script|div)\b)/i.test(text)
    || text.includes('\0')) throw new Error('odpowiedź nie jest tekstową listą filtrów');
  // uAssets fragments may have section comments or preprocessing directives
  // instead of a standalone subscription title. They still need actual filters.
  if (!/^\s*(?:\[Adblock(?: Plus)?[^\]]*\]|!\s*(?:Title|Description|SECTION):|!#(?:include|if)\s+\S)/im.test(text)) {
    throw new Error('brak nagłówka listy filtrów');
  }
  for (const line of text.split(/\r?\n/)) {
    const c = classifyLine(line);
    if ((c.kind === 'network' && parseNetworkFilter(c.text ?? c.raw ?? line, { trusted: true }))
      || (c.kind === 'cosmetic' && parseCosmeticFilter(c, { trusted: true }))) return;
  }
  throw new Error('lista nie zawiera rozpoznawalnych filtrów');
}

/** Stage on the same filesystem; preserve unused snapshots and roll back a failed swap. */
export async function updateLists({
  dir = LISTS_DIR, files = FILES, fetchImpl = globalThis.fetch,
  snapshot = youtubeSnapshot, baseline = readBaseline(), log = console.log,
  rename = fs.renameSync,
} = {}) {
  const before = snapshot(dir);
  const work = fs.mkdtempSync(path.join(path.dirname(dir), '.lists-update-'));
  const staged = path.join(work, 'next');
  const backup = path.join(work, 'previous');
  let retainedBackup = false;
  try {
    fs.cpSync(dir, staged, { recursive: true });
    const failed = [];
    for (const [file, url] of Object.entries(files)) {
      try {
        const res = await fetchImpl(url, { signal: AbortSignal.timeout(60_000) });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        validateDownloadedList(text, res.headers?.get?.('content-type') || '');
        fs.mkdirSync(path.dirname(path.join(staged, file)), { recursive: true });
        fs.writeFileSync(path.join(staged, file), text);
        log('✓', file, `(${Math.round(text.length / 1024)} KB, staging)`);
      } catch (e) {
        failed.push(file);
        log('✗', file, '–', e.message);
      }
    }
    if (failed.length) throw new Error(`${failed.length} plików nie udało się pobrać. Poprzedni snapshot pozostaje bez zmian.`);
    const after = snapshot(staged);
    const added = [...after.keys()].filter((k) => !before.has(k));
    const removed = [...before.keys()].filter((k) => !after.has(k));
    log(`YouTube filters changed: +${added.length} / -${removed.length}`);
    const cmp = compareWithBaseline([...after.values()], baseline);
    if (cmp.newGaps.length) {
      const error = new Error(`Nowe nieobsługiwane krytyczne filtry YouTube: ${cmp.newGaps.length}. Poprzedni snapshot pozostaje bez zmian.`);
      error.exitCode = 2;
      for (const g of cmp.newGaps) log(`✗ ${g.name}: ${g.reason}\n  ${g.line.slice(0, 180)}`);
      throw error;
    }
    rename(dir, backup);
    try {
      rename(staged, dir);
    } catch (error) {
      try { rename(backup, dir); } catch (rollback) {
        retainedBackup = true;
        throw new Error(`Nie udało się przywrócić snapshotu. Zachowana kopia: ${backup}`, { cause: rollback });
      }
      throw error;
    }
    log('Listy pobrane i zweryfikowane. Dalej: npm run build && npm run check -- --require-browser');
    return { files: Object.keys(files).length, added: added.length, removed: removed.length };
  } finally {
    if (!retainedBackup) fs.rmSync(work, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { await updateLists(); } catch (error) {
    console.error(error.message);
    process.exitCode = error.exitCode || 1;
  }
}
