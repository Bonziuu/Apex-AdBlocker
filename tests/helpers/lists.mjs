// Pomocnicze funkcje testów: wyszukiwanie PRAWDZIWYCH filtrów z aktualnych list.

import { LISTS, loadList } from '../../tools/lists-config.mjs';
import { classifyLine, parseCosmeticFilter } from '../../shared/parser.js';

let cache = null;

/** Wszystkie linie wszystkich list: [{list, line, trusted}]. */
export function allLines() {
  if (cache) return cache;
  cache = [];
  for (const list of LISTS) for (const l of loadList(list)) cache.push({ list: list.id, ...l });
  return cache;
}

/** Pierwszy filtr pasujący do wyrażenia (rzuca, gdy brak – test ma wtedy wskazać zmianę list). */
export function findLine(re, { list } = {}) {
  const hit = allLines().find((l) => (!list || l.list === list) && re.test(l.line));
  if (!hit) throw new Error(`W aktualnych listach nie ma filtra pasującego do ${re} – listy się zmieniły, zaktualizuj test`);
  return hit;
}

/** Parsuje prawdziwy filtr scriptletu i zwraca wywołanie [nazwa kanoniczna, ...args]. */
export function scriptletCallFromLine(hit) {
  const c = classifyLine(hit.line);
  const f = parseCosmeticFilter(c, { trusted: hit.trusted });
  if (!f || f.type !== 'scriptlet') {
    throw new Error(`Filtr nie jest obsługiwanym scriptletem: ${hit.line} → ${f ? f.type + ' ' + JSON.stringify(f.support) : 'null'}`);
  }
  return f.call;
}
