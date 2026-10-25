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
//   src {since, lastRead, gaps} – metadane źródła: od kiedy liczymy, ostatni udany odczyt, wykryte luki
//
// Źródło jest jawnie raportowane (statsCapability): available / source / exact.
// getMatchedRules to źródło developerskie / best-effort (uprawnienie declarativeNetRequestFeedback,
// limit wywołań Chrome, dopasowania nieaktywnych dokumentów znikają po ~5 min) – exact = false.
// Licznik akcji DNR (badge) NIE jest źródłem: liczy też przekierowania i usuwanie parametrów.

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
  return { v: STATS_VERSION, total: 0, today: { day: '', count: 0 }, sites: {}, cursor: { ts: 0, keys: [] }, src: { since: 0, lastRead: 0, gaps: 0 } };
}

export const STATS_SOURCE = Object.freeze({ MATCHED_RULES: 'getMatchedRules', NONE: 'none' });
/** Chrome nie zwraca dopasowań dokumentów nieaktywnych dłużej niż ~5 min (zamknięta karta, nowa strona). */
export const MATCH_RETENTION_MS = 5 * 60 * 1000;
/** Budżet odczytów getMatchedRules (limit Chrome: 20 / 10 min; reszta dla licznika karty w popupie). */
export const READ_BUDGET = Object.freeze({ maxCalls: 12, windowMs: 10 * 60 * 1000, backgroundSpacingMs: 50_000 });

/** Rodzaj błędu odczytu: 'quota' | 'permission' | 'unavailable' | 'error'. */
export function classifyReadError(err) {
  const msg = String((err && err.message) || err || '');
  if (/quota|MAX_GETMATCHEDRULES/i.test(msg)) return 'quota';
  if (/permission|declarativeNetRequestFeedback|activeTab/i.test(msg)) return 'permission';
  if (/not a function|undefined|unavailable/i.test(msg)) return 'unavailable';
  return 'error';
}

/**
 * Zapis udanego odczytu: since (pierwszy odczyt), lastRead, luka – gdy dokument stał się nieaktywny
 * (nawigacja / zamknięcie karty) dawniej niż MATCH_RETENTION_MS przed tym odczytem (Chrome mógł już
 * zapomnieć jego dopasowania; nie zgadujemy ich).
 */
export function recordRead(stats, now, pendingInactive = 0) {
  const s = normalizeStats(stats);
  if (!s.src.since) s.src.since = now;
  if (pendingInactive && now - pendingInactive > MATCH_RETENTION_MS) s.src.gaps++;
  s.src.lastRead = now;
  return s;
}

/** Budżet odczytów: czy wolno teraz czytać (popup – tylko limit; tło – limit + odstęp). */
export function budgetAllows(reads, lastRead, now, { popup = false, budget = READ_BUDGET } = {}) {
  const recent = (reads || []).filter((t) => t > now - budget.windowMs);
  if (recent.length >= budget.maxCalls) return { ok: false, reason: 'budget', reads: recent };
  if (!popup && lastRead && now - lastRead < budget.backgroundSpacingMs) return { ok: false, reason: 'spacing', reads: recent };
  return { ok: true, reads: [...recent, now] };
}

/**
 * Jawne metadane źródła dla popupu / opcji.
 * @param {{status?:{available:boolean, source:string, reason?:string}, stats?:object, fresh?:boolean}} o
 */
export function statsCapability({ status, stats, fresh = false } = {}) {
  const s = normalizeStats(stats);
  const st = status || { available: false, source: STATS_SOURCE.NONE, reason: 'not-checked' };
  return {
    available: !!st.available,
    source: st.source || STATS_SOURCE.NONE,
    exact: false, // getMatchedRules jest best-effort; brak źródła dokładnego
    reason: st.reason || '',
    fresh: !!(st.available && fresh),
    since: s.src.since || null,
    lastRead: s.src.lastRead || null,
    gaps: s.src.gaps,
  };
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
  if (x.src && typeof x.src === 'object') s.src = { since: nonNeg(x.src.since), lastRead: nonNeg(x.src.lastRead), gaps: nonNeg(x.src.gaps) };
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

/**
 * Dane dla popupu: łącznie, dzisiaj (0 po zmianie dnia), dla domeny bieżącej karty.
 * Gdy źródło jest niedostępne (available=false) – null zamiast liczb (bez zmyślonych danych).
 */
export function statsView(stats, host, now, { available = true } = {}) {
  if (!available) return { totalBlocked: null, todayBlocked: null, siteBlocked: null };
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
