// Apex AdBlocker – agregacja pomiarów scriptletów (Opcje → Diagnostyka → „Najdroższe scriptlety”).
//
// Dane przychodzą ze stron (świat MAIN → content/cosmetic.js → service worker) tylko przy
// włączonych „Pomiarach wydajności”. Ponieważ strona może wysłać dowolne zdarzenie, wejście jest
// ściśle walidowane: etykieta to wyłącznie „nazwa-scriptletu · przechwycona.funkcja” (znaki ASCII
// bez „/”, „?”, „=”, spacji poza separatorem) – nie da się w niej przemycić adresu, ID filmu ani
// treści danych. Przechowywane: etykieta, liczba wywołań, łączny i maksymalny czas.

import { SCRIPTLET_SPECS } from '../shared/scriptlet-specs.js';

export const LABEL_RE = /^[a-z][A-Za-z0-9-]{1,60} · [A-Za-z][A-Za-z0-9._:]{0,60}$/;
// Etykieta musi zaczynać się od nazwy scriptletu z rejestru Apex AdBlocker (nie od dowolnego tekstu strony).
const KNOWN = new Set(Object.keys(SCRIPTLET_SPECS));
export const validLabel = (label) => typeof label === 'string' && LABEL_RE.test(label) && KNOWN.has(label.slice(0, label.indexOf(' · ')));
export const MAX_LABELS = 200;
const MAX_ROWS_PER_REPORT = 200;
const MAX_MS = 1e7;
const MAX_COUNT = 1e9;

const num = (v, max) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max ? v : null);

/**
 * Parsuje i waliduje raport ze strony. Zwraca listę wierszy [label, count, totalMs, maxMs]
 * (odrzuca niepoprawne wiersze).
 */
export function parseReport(raw) {
  if (typeof raw !== 'string' || raw.length > 50_000) return [];
  let data;
  try { data = JSON.parse(raw); } catch { return []; }
  if (!data || data.v !== 1 || !Array.isArray(data.rows)) return [];
  const out = [];
  for (const row of data.rows.slice(0, MAX_ROWS_PER_REPORT)) {
    if (!Array.isArray(row) || row.length !== 4) continue;
    const [label, count, total, max] = row;
    if (!validLabel(label)) continue;
    const c = num(count, MAX_COUNT);
    const t = num(total, MAX_MS);
    const m = num(max, MAX_MS);
    if (c === null || t === null || m === null || !Number.isInteger(c) || c === 0) continue;
    out.push([label, c, t, Math.min(m, t)]);
  }
  return out;
}

export class ScriptletPerfStore {
  constructor() { this.stats = new Map(); }

  /** Dodaje zwalidowane wiersze. Zwraca liczbę przyjętych wierszy. */
  add(rows) {
    let n = 0;
    for (const [label, count, total, max] of rows) {
      let s = this.stats.get(label);
      if (!s) {
        if (this.stats.size >= MAX_LABELS) continue;
        s = { count: 0, totalMs: 0, maxMs: 0 };
        this.stats.set(label, s);
      }
      s.count += count;
      s.totalMs += total;
      if (max > s.maxMs) s.maxMs = max;
      n++;
    }
    return n;
  }

  reset() { this.stats.clear(); }

  /** Wiersze tabeli posortowane po łącznym czasie malejąco. */
  rows(limit = 50) {
    const r2 = (x) => Math.round(x * 100) / 100;
    return [...this.stats.entries()]
      .map(([label, s]) => {
        const sep = label.indexOf(' · ');
        return {
          scriptlet: label.slice(0, sep),
          target: label.slice(sep + 3),
          calls: s.count,
          totalMs: r2(s.totalMs),
          avgMs: r2(s.totalMs / s.count),
          maxMs: r2(s.maxMs),
        };
      })
      .sort((a, b) => b.totalMs - a.totalMs || b.calls - a.calls)
      .slice(0, limit);
  }

  toJSON() { return [...this.stats.entries()]; }

  load(entries) {
    this.stats.clear();
    if (!Array.isArray(entries)) return;
    for (const e of entries.slice(0, MAX_LABELS)) {
      if (!Array.isArray(e) || !validLabel(e[0]) || !e[1]) continue;
      const { count, totalMs, maxMs } = e[1];
      if ([count, totalMs, maxMs].every((v) => typeof v === 'number' && Number.isFinite(v)) && count > 0) {
        this.stats.set(e[0], { count, totalMs, maxMs });
      }
    }
  }
}
