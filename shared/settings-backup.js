// ChromeBlock – kopia ustawień (eksport / import). Czysta logika: format, pełna walidacja, podsumowanie.
//
// Kopia zawiera WYŁĄCZNIE ustawienia, które użytkownik nadal może zmienić: disabledSites i
// userFilters (wersja 2). Listy ochrony są stałe (shared/core-lists.js), więc nie trafiają do kopii.
// Bez health, diagnostyki, cache, danych sesji, statystyk, identyfikatorów kart i adresów
// odwiedzanych stron (disabledSites to same nazwy hostów).
//
// Import: najpierw walidacja CAŁEGO pliku – jeśli cokolwiek jest niepoprawne, nic nie jest zapisywane.
// Nieznane pola są ignorowane (nie trafiają do storage).
// Kopie wersji 1 (starsze wersje ChromeBlock) nadal się importują: przywracane są disabledSites
// i userFilters, a enabledLists, protectionMode i youtubeFocus są ignorowane (nie są walidowane
// i nie wpływają na stały zestaw list).

export const BACKUP_FORMAT = 'chromeblock-settings';
export const BACKUP_VERSION = 2;
export const SUPPORTED_BACKUP_VERSIONS = Object.freeze([1, 2]);
export const BACKUP_SETTINGS_KEYS = Object.freeze(['disabledSites', 'userFilters']);
/** Pola kopii v1, które nie są już ustawieniami (ignorowane przy imporcie). */
export const LEGACY_BACKUP_KEYS = Object.freeze(['enabledLists', 'protectionMode', 'youtubeFocus']);
export const BACKUP_LIMITS = Object.freeze({
  maxFileBytes: 2 * 1024 * 1024,   // cały plik
  maxUserFiltersChars: 1_000_000,
  maxDisabledSites: 5000,
});

const HOST_RE = /^[a-z0-9.-]+\.[a-z0-9-]+$/; // jak w options:setDisabledSites (po normalizacji)

/** Obiekt kopii z bieżących ustawień (tylko dozwolone pola). */
export function buildBackup(settings, { extensionVersion = '', exportedAt = new Date().toISOString() } = {}) {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt,
    extensionVersion: String(extensionVersion || ''),
    settings: {
      disabledSites: [...settings.disabledSites],
      userFilters: String(settings.userFilters || ''),
    },
  };
}

/** Nazwa pliku eksportu (data lokalna). */
export function backupFileName(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `chromeblock-ustawienia-${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}.json`;
}

const isPlainObject = (x) => !!x && typeof x === 'object' && !Array.isArray(x);

/**
 * Pełna walidacja tekstu pliku kopii.
 * @param {string} text  zawartość pliku
 * @returns {{ok:true, settings:{disabledSites:string[], userFilters:string}, ignored:string[], version:number} | {ok:false, errors:string[]}}
 */
export function parseBackup(text) {
  if (typeof text !== 'string') return { ok: false, errors: ['brak zawartości pliku'] };
  if (text.length > BACKUP_LIMITS.maxFileBytes) return { ok: false, errors: ['plik jest za duży (maks. 2 MB)'] };
  let data;
  try { data = JSON.parse(text); } catch { return { ok: false, errors: ['plik nie jest poprawnym JSON'] }; }
  return validateBackup(data);
}

/** Walidacja obiektu kopii (wszystkie błędy naraz). */
export function validateBackup(data) {
  const errors = [];
  const ignored = [];
  if (!isPlainObject(data)) return { ok: false, errors: ['plik nie zawiera obiektu kopii ustawień'] };
  if (data.format !== BACKUP_FORMAT) errors.push(`nieznany format pliku (oczekiwano „${BACKUP_FORMAT}”)`);
  if (!SUPPORTED_BACKUP_VERSIONS.includes(data.version)) errors.push(`nieobsługiwana wersja kopii: ${JSON.stringify(data.version)} (obsługiwane: ${SUPPORTED_BACKUP_VERSIONS.join(', ')})`);
  for (const k of Object.keys(data)) if (!['format', 'version', 'exportedAt', 'extensionVersion', 'settings'].includes(k)) ignored.push(k);
  const s = data.settings;
  if (!isPlainObject(s)) {
    errors.push('brak sekcji „settings”');
    return { ok: false, errors };
  }
  // pola v1 (enabledLists, protectionMode, youtubeFocus) i nieznane: ignorowane, bez walidacji
  for (const k of Object.keys(s)) if (!BACKUP_SETTINGS_KEYS.includes(k)) ignored.push(`settings.${k}`);
  for (const k of BACKUP_SETTINGS_KEYS) if (!(k in s)) errors.push(`brak pola settings.${k}`);

  const out = {};
  // disabledSites (same hostname'y)
  if ('disabledSites' in s) {
    const v = s.disabledSites;
    if (!Array.isArray(v) || !v.every((x) => typeof x === 'string')) errors.push('settings.disabledSites musi być listą domen');
    else if (v.length > BACKUP_LIMITS.maxDisabledSites) errors.push(`za dużo wyłączonych stron (maks. ${BACKUP_LIMITS.maxDisabledSites})`);
    else {
      const norm = v.map((h) => h.toLowerCase().replace(/^www\./, '').replace(/\.$/, ''));
      const bad = v.filter((_, i) => !HOST_RE.test(norm[i]));
      if (bad.length) errors.push(`niepoprawne domeny w wyłączonych stronach: ${bad.slice(0, 3).map((x) => JSON.stringify(x.slice(0, 60))).join(', ')}`);
      out.disabledSites = [...new Set(norm)];
    }
  }
  // userFilters
  if ('userFilters' in s) {
    if (typeof s.userFilters !== 'string') errors.push('settings.userFilters musi być tekstem');
    else if (s.userFilters.length > BACKUP_LIMITS.maxUserFiltersChars) errors.push('settings.userFilters jest za długie');
    else out.userFilters = s.userFilters;
  }
  if (errors.length) return { ok: false, errors };
  return { ok: true, settings: out, ignored, version: data.version };
}

/** Odmiana: 1 reguła, 2–4 reguły (bez 12–14), pozostałe reguł. */
export function rulesWord(n) {
  if (n === 1) return 'reguła';
  const u = n % 10;
  const t = n % 100;
  return u >= 2 && u <= 4 && !(t >= 12 && t <= 14) ? 'reguły' : 'reguł';
}

export const IMPORT_MSG = Object.freeze({
  invalid: 'Nie zaimportowano – plik jest niepoprawny (ustawienia bez zmian):',
  rolledBack: 'Chrome nie przyjął zmian – przywrócono poprzednie ustawienia:',
  incomplete: 'Import nie powiódł się i nie udało się w pełni przywrócić poprzedniego stanu. Otwórz Diagnostykę.',
});

/**
 * Komunikat dla nieudanego importu: {title, items, diagnostics}.
 * Twierdzi „przywrócono” TYLKO przy rolledBack === true (rollback sprawdzony w całości).
 */
export function importFailureMessage(r) {
  const res = r || {};
  const errors = Array.isArray(res.errors) ? res.errors : [];
  if (res.rolledBack === true) return { title: IMPORT_MSG.rolledBack, items: errors, diagnostics: false };
  if (res.rolledBack === false || Array.isArray(res.rollbackErrors)) {
    return { title: IMPORT_MSG.incomplete, items: [...errors, ...(res.rollbackErrors || []).map((e) => `przywracanie: ${e}`)], diagnostics: true };
  }
  return { title: IMPORT_MSG.invalid, items: errors.length ? errors : ['nieznany błąd'], diagnostics: false };
}

/** Krótkie podsumowanie przywróconych ustawień (lista linii). */
export function summarizeSettings(settings) {
  const lines = (settings.userFilters || '').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('!')).length;
  return [
    `Wyłączone strony: ${settings.disabledSites.length}`,
    `Moje filtry: ${lines} ${rulesWord(lines)}`,
  ];
}
