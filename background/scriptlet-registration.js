// Apex AdBlocker – czysta logika rejestracji scriptletów: opis rejestracji dla chrome.scripting
// i porównanie z zestawem już zarejestrowanym. Bez Chrome API, I/O i stanu – synchronizacja
// (kolejka, wywołania chrome.scripting, cache, health, profil startu) zostaje w background.js.

/** Plik włączający profiler scriptletów (rejestrowany przed scriptletami tylko przy pomiarach). */
export const SCRIPTLET_PERF_FLAG_FILE = 'content/scriptlet-perf-on.js';

/** Sufiks id rejestracji sesyjnej (wzorce encji „nazwa.*”, bez utrwalania w Chrome). */
export const SESSION_SUFFIX = '-s';

/**
 * Rejestracje jednego pliku scriptletów (0–2):
 *   `sl-<lista>-<n>`   – wzorce hostów zwykłych, utrwalane (działają od razu po starcie przeglądarki),
 *   `sl-<lista>-<n>-s` – wzorce encji „nazwa.*”, persistAcrossSessions: false.
 * Wydajność: utrwalanie w Chrome kosztuje ~kwadratowo względem liczby wzorców (60 tys. ≈ 2,8 s
 * zawieszenia całej przeglądarki przy każdej aktualizacji/przeładowaniu), a encje to ~60% wzorców.
 * Oba zbiory są rozłączne (build), więc plik nigdy nie jest wstrzykiwany dwa razy na tę samą stronę.
 */
export function scriptletRegistrations(f, { devPerf, excludeMatches }) {
  const base = {
    // przy pomiarach wydajności najpierw plik-flaga (ta sama rejestracja → gwarantowana kolejność)
    js: devPerf ? [SCRIPTLET_PERF_FLAG_FILE, f.file] : [f.file],
    runAt: 'document_start',
    allFrames: true,
    world: 'MAIN',
  };
  if (excludeMatches.length) base.excludeMatches = excludeMatches;
  const out = [];
  if (f.matches && f.matches.length) out.push({ id: f.id, ...base, matches: f.matches, persistAcrossSessions: true });
  if (f.sessionMatches && f.sessionMatches.length) out.push({ id: f.id + SESSION_SUFFIX, ...base, matches: f.sessionMatches, persistAcrossSessions: false });
  return out;
}

/** Czy zarejestrowany zestaw scriptletów jest dokładnie taki, jak oczekiwany (te same id, kolejność i parametry). */
export function sameScriptletRegistrations(registered, wanted) {
  if (registered.length !== wanted.length) return false;
  const norm = (a) => [...(a || [])].sort().join('\n');
  for (let i = 0; i < wanted.length; i++) {
    const r = registered[i];
    const w = wanted[i];
    if (r.id !== w.id) return false;
    if ((r.js || []).join('\n') !== w.js.join('\n')) return false;
    if (norm(r.matches) !== norm(w.matches)) return false;
    if (norm(r.excludeMatches) !== norm(w.excludeMatches)) return false;
    if ((r.runAt || 'document_idle') !== w.runAt || !!r.allFrames !== w.allFrames || (r.world || 'ISOLATED') !== w.world) return false;
    if ((r.persistAcrossSessions !== false) !== (w.persistAcrossSessions !== false)) return false;
  }
  return true;
}
