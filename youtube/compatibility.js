// ChromeBlock – YouTube Protection: zgodność filtrów.
//
// YouTube nie ma osobnego silnika: korzysta ze wspólnego DNR, silnika
// kosmetycznego i scriptletów. Ten moduł określa, które filtry są KRYTYCZNE
// dla YouTube, i sprawdza, czy ChromeBlock potrafi je poprawnie wykonać.
// Używany przez build (tryb strict), audyt, testy i aktualizację list.

import { hostKeys } from '../shared/parser.js';

/** Hosty, dla których filtry są krytyczne. */
export const YOUTUBE_CRITICAL_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'music.youtube.com',
  'm.youtube.com',
  'youtube-nocookie.com',
];

/** Listy, których filtry YouTube są sprawdzane w trybie strict (domyślnie włączone). */
export const YOUTUBE_STRICT_LISTS = ['ads', 'privacy', 'security'];

/**
 * Czy filtr (po parsowaniu domen) dotyczy któregoś z krytycznych hostów YouTube.
 * include/exclude – listy domen filtra (mogą zawierać encje "x.*").
 */
export function youtubeHostsAffected(include, exclude) {
  const hit = [];
  for (const host of YOUTUBE_CRITICAL_HOSTS) {
    const keys = hostKeys(host);
    if (!include.some((d) => keys.includes(d))) continue;
    if (exclude.some((d) => keys.includes(d))) continue;
    hit.push(host);
  }
  return hit;
}

/** Normalizowany klucz filtra do porównań z bazą znanych braków. */
export function filterKey(line) {
  return String(line).trim();
}

/**
 * Porównuje wynik analizy z bazą znanych braków (youtube/known-gaps.json).
 * @param {Array<{line:string,status:string}>} critical – krytyczne filtry YouTube
 * @param {{gaps:Array<{filter:string}>}} baseline
 */
export function compareWithBaseline(critical, baseline) {
  const known = new Set((baseline.gaps || []).map((g) => filterKey(g.filter)));
  const unsupported = critical.filter((c) => c.status !== 'supported');
  const newGaps = unsupported.filter((c) => !known.has(filterKey(c.line)));
  const knownGaps = unsupported.filter((c) => known.has(filterKey(c.line)));
  const present = new Set(critical.map((c) => filterKey(c.line)));
  const resolved = [...known].filter((k) => !present.has(k) || critical.find((c) => filterKey(c.line) === k && c.status === 'supported'));
  return { unsupported, newGaps, knownGaps, resolved };
}
