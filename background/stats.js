// ChromeBlock – lokalne statystyki zablokowanych żądań (fundament v0.3). Czysta logika, bez chrome.*.
//
// Źródło: chrome.declarativeNetRequest.getMatchedRules() – Chrome zwraca tylko {tabId, rule{rulesetId,
// ruleId}, timeStamp}, BEZ adresów. Domena strony (hostname) pochodzi z nawigacji karty.
// Dane wyłącznie lokalnie (chrome.storage.local['stats']), bez telemetrii, bez pełnych URL.
//
// Model:
//   total                 – zablokowane łącznie
//   today {day, count}    – zablokowane dzisiaj (dzień lokalny 'RRRR-MM-DD'; nowy dzień → licznik od zera)
//   sites {host: {n, last}} – per domena (hostname), limit MAX_SITES, wpisy starsze niż SITE_TTL_DAYS usuwane
//   cursor {ts, keys}     – deduplikacja: znacznik czasu ostatniego dopasowania + klucze z okna DEDUP_WINDOW_MS

export const STATS_KEY = 'stats';
export const STATS_VERSION = 1;
export const STATS_LIMITS = Object.freeze({
  maxSites: 500,          // maks. liczba domen
  siteTtlDays: 90,        // domena nieaktywna dłużej → usunięta
  dedupWindowMs: 10_000,  // okno, w którym pamiętamy klucze już policzonych dopasowań
  maxDedupKeys: 5000,
});
const DAY_MS = 24 * 3600 * 1000;

export function emptyStats() {
  return { v: STATS_VERSION, total: 0, today: { day: '', count: 0 }, sites: {}, cursor: { ts: 0, keys: [] } };
}

/** Dzień lokalny 'RRRR-MM-DD' dla znacznika czasu (ms). */
export function dayKey(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Klucz domeny: sam hostname (małe litery, bez „www.” i kropki na końcu) albo '' gdy to nie hostname. */
export function siteKey(host) {
  const h = String(host || '').toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
  if (!h || h.length > 253) return '';
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*$/.test(h)) return ''; // bez schematu, portu, ścieżki, zapytania
  return h;
}

/** Klucz jednego dopasowania reguły (bez URL). */
export function matchKey(m) {
  return `${m.tabId}|${m.rule.rulesetId}|${m.rule.ruleId}|${m.timeStamp}`;
}

const nonNeg = (x) => (Number.isFinite(x) && x >= 0 ? Math.floor(x) : 0);

/** Odczyt z storage: złe / brakujące dane → wartości bezpieczne; tylko poprawne hostname'y. */
export function normalizeStats(x) {
  const s = emptyStats();
  if (!x || typeof x !== 'object') return s;
  s.total = nonNeg(x.total);
  if (x.today && typeof x.today.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x.today.day)) s.today = { day: x.today.day, count: nonNeg(x.today.count) };
  if (x.sites && typeof x.sites === 'object') {
    for (const [h, v] of Object.entries(x.sites)) {
      const k = siteKey(h);
      if (k && k === h && v && typeof v === 'object') s.sites[k] = { n: nonNeg(v.n), last: nonNeg(v.last) };
    }
  }
  if (x.cursor && typeof x.cursor === 'object') {
    s.cursor.ts = nonNeg(x.cursor.ts);
    s.cursor.keys = Array.isArray(x.cursor.keys) ? x.cursor.keys.filter((k) => typeof k === 'string' && /^-?\d+\|[^|]+\|\d+\|\d+(\.\d+)?$/.test(k)).slice(-STATS_LIMITS.maxDedupKeys) : [];
  }
  return s;
}

/** Usuwa domeny nieaktywne dłużej niż TTL i przycina do maxSites (zostają ostatnio aktywne). */
export function pruneSites(sites, now, limits = STATS_LIMITS) {
  const minLast = now - limits.siteTtlDays * DAY_MS;
  let entries = Object.entries(sites).filter(([, v]) => v.last >= minLast);
  if (entries.length > limits.maxSites) entries = entries.sort((a, b) => b[1].last - a[1].last || b[1].n - a[1].n).slice(0, limits.maxSites);
  return Object.fromEntries(entries);
}

/**
 * Dodaje dopasowania reguł BLOKUJĄCYCH (już przefiltrowane) do statystyk.
 * Każde dopasowanie jest liczone dokładnie raz (klucz tabId|rulesetId|ruleId|timeStamp + kursor czasu).
 * @param {object} stats       normalizeStats()
 * @param {Array<{tabId:number, rule:{rulesetId:string, ruleId:number}, timeStamp:number}>} matches
 * @param {{now:number, hostFor:(m)=>string, limits?:object}} o
 * @returns {{stats:object, added:number}}
 */
export function applyMatches(stats, matches, { now, hostFor = () => '', limits = STATS_LIMITS }) {
  const s = normalizeStats(stats);
  const seen = new Set(s.cursor.keys);
  const floor = s.cursor.ts - limits.dedupWindowMs;
  let added = 0;
  let maxTs = s.cursor.ts;
  const sorted = [...matches].filter((m) => m && m.rule && Number.isFinite(m.timeStamp)).sort((a, b) => a.timeStamp - b.timeStamp);
  for (const m of sorted) {
    if (m.timeStamp < floor) continue;             // starsze niż okno – policzone już wcześniej
    const key = matchKey(m);
    if (seen.has(key)) continue;                    // to samo dopasowanie w kolejnym odczycie
    seen.add(key);
    added++;
    s.total++;
    const day = dayKey(m.timeStamp);
    if (s.today.day === day) s.today.count++;
    else if (!s.today.day || day > s.today.day) s.today = { day, count: 1 }; // nowy dzień → od zera
    // dopasowanie z dnia wcześniejszego niż zapisany „dziś” liczy się tylko do total
    const host = siteKey(hostFor(m));
    if (host) {
      const cur = s.sites[host] || { n: 0, last: 0 };
      s.sites[host] = { n: cur.n + 1, last: Math.max(cur.last, m.timeStamp) };
    }
    if (m.timeStamp > maxTs) maxTs = m.timeStamp;
  }
  s.cursor.ts = maxTs;
  const keep = maxTs - limits.dedupWindowMs;
  s.cursor.keys = [...seen].filter((k) => Number(k.slice(k.lastIndexOf('|') + 1)) >= keep).slice(-limits.maxDedupKeys);
  s.sites = pruneSites(s.sites, now, limits);
  return { stats: s, added };
}

/** Dane dla popupu: łącznie, dzisiaj (0 po zmianie dnia), dla domeny bieżącej karty. */
export function statsView(stats, host, now) {
  const s = normalizeStats(stats);
  const k = siteKey(host);
  return {
    totalBlocked: s.total,
    todayBlocked: s.today.day === dayKey(now) ? s.today.count : 0,
    siteBlocked: k && s.sites[k] ? s.sites[k].n : 0,
  };
}

// --- domena karty w czasie (z nawigacji głównej ramki; sam hostname) ---

export const TAB_HISTORY = 4; // ostatnie nawigacje karty

/** Dopisuje nawigację karty: {tabId: [{host, since}]} (najnowsze na końcu, maks. TAB_HISTORY). */
export function recordTabHost(tabs, tabId, host, since) {
  const out = { ...tabs };
  const k = siteKey(host);
  const list = (out[tabId] || []).filter((e) => e.since <= since);
  list.push({ host: k, since });
  out[tabId] = list.slice(-TAB_HISTORY);
  return out;
}

/** Domena karty w chwili dopasowania (ostatnia nawigacja przed timeStamp) albo fallback. */
export function hostAt(tabs, tabId, ts, fallback = '') {
  const list = tabs[tabId] || [];
  let best = '';
  for (const e of list) if (e.since <= ts) best = e.host;
  return best || (list.length ? '' : fallback);
}
