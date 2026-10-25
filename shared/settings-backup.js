// ChromeBlock – kopia ustawień (eksport / import). Czysta logika: format, pełna walidacja, podsumowanie.
//
// Kopia zawiera WYŁĄCZNIE ustawienia użytkownika: enabledLists, disabledSites, userFilters,
// protectionMode, youtubeFocus. Bez health, diagnostyki, cache, danych sesji, statystyk,
// identyfikatorów kart i adresów odwiedzanych stron (disabledSites to same nazwy hostów).
//
// Import: najpierw walidacja CAŁEGO pliku – jeśli cokolwiek jest niepoprawne, nic nie jest zapisywane.
// Nieznane pola są ignorowane (nie trafiają do storage). protectionMode jest przeliczany z list.

import { FOCUS_DEFAULTS } from './youtube-focus.js';
import { MODE_IDS, modeForLists } from './protection-modes.js';

export const BACKUP_FORMAT = 'chromeblock-settings';
export const BACKUP_VERSION = 1;
export const BACKUP_SETTINGS_KEYS = Object.freeze(['enabledLists', 'disabledSites', 'userFilters', 'protectionMode', 'youtubeFocus']);
export const BACKUP_LIMITS = Object.freeze({
  maxFileBytes: 2 * 1024 * 1024,   // cały plik
  maxUserFiltersChars: 1_000_000,
  maxDisabledSites: 5000,
});

const HOST_RE = /^[a-z0-9.-]+\.[a-z0-9-]+$/; // jak w options:setDisabledSites (po normalizacji)

/** Obiekt kopii z bieżących ustawień (tylko dozwolone pola). */
export function buildBackup(settings, { extensionVersion = '', exportedAt = new Date().toISOString() } = {}) {
  const focus = {};
  for (const k of Object.keys(FOCUS_DEFAULTS)) focus[k] = !!(settings.youtubeFocus || {})[k];
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt,
    extensionVersion: String(extensionVersion || ''),
    settings: {
      enabledLists: [...settings.enabledLists],
      disabledSites: [...settings.disabledSites],
      userFilters: String(settings.userFilters || ''),
      protectionMode: settings.protectionMode,
      youtubeFocus: focus,
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
 * @param {{knownLists: string[]}} o  identyfikatory list dostępnych w tej wersji
 * @returns {{ok:true, settings:object, ignored:string[]} | {ok:false, errors:string[]}}
 */
export function parseBackup(text, { knownLists }) {
  if (typeof text !== 'string') return { ok: false, errors: ['brak zawartości pliku'] };
  if (text.length > BACKUP_LIMITS.maxFileBytes) return { ok: false, errors: ['plik jest za duży (maks. 2 MB)'] };
  let data;
  try { data = JSON.parse(text); } catch { return { ok: false, errors: ['plik nie jest poprawnym JSON'] }; }
  return validateBackup(data, { knownLists });
}

/** Walidacja obiektu kopii (wszystkie błędy naraz). */
export function validateBackup(data, { knownLists }) {
  const errors = [];
  const ignored = [];
  if (!isPlainObject(data)) return { ok: false, errors: ['plik nie zawiera obiektu kopii ustawień'] };
  if (data.format !== BACKUP_FORMAT) errors.push(`nieznany format pliku (oczekiwano „${BACKUP_FORMAT}”)`);
  if (data.version !== BACKUP_VERSION) errors.push(`nieobsługiwana wersja kopii: ${JSON.stringify(data.version)} (obsługiwana: ${BACKUP_VERSION})`);
  for (const k of Object.keys(data)) if (!['format', 'version', 'exportedAt', 'extensionVersion', 'settings'].includes(k)) ignored.push(k);
  const s = data.settings;
  if (!isPlainObject(s)) {
    errors.push('brak sekcji „settings”');
    return { ok: false, errors };
  }
  for (const k of Object.keys(s)) if (!BACKUP_SETTINGS_KEYS.includes(k)) ignored.push(`settings.${k}`);
  for (const k of BACKUP_SETTINGS_KEYS) if (!(k in s)) errors.push(`brak pola settings.${k}`);

  const out = {};
  // enabledLists
  if ('enabledLists' in s) {
    const v = s.enabledLists;
    if (!Array.isArray(v) || !v.every((x) => typeof x === 'string')) errors.push('settings.enabledLists musi być listą identyfikatorów');
    else {
      const unknown = v.filter((x) => !knownLists.includes(x));
      if (unknown.length) errors.push(`nieznane listy filtrów: ${unknown.slice(0, 5).join(', ')}`);
      if (new Set(v).size !== v.length) errors.push('settings.enabledLists zawiera powtórzenia');
      out.enabledLists = knownLists.filter((id) => v.includes(id)); // kolejność jak w rozszerzeniu
    }
  }
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
  // protectionMode (sprawdzany, ale przy imporcie i tak przeliczany z list)
  if ('protectionMode' in s && !MODE_IDS.includes(s.protectionMode)) errors.push(`nieznany tryb ochrony: ${JSON.stringify(s.protectionMode)}`);
  // youtubeFocus (znane klucze muszą być boolean; brak klucza → domyślna; nieznane ignorowane)
  if ('youtubeFocus' in s) {
    const f = s.youtubeFocus;
    if (!isPlainObject(f)) errors.push('settings.youtubeFocus musi być obiektem');
    else {
      out.youtubeFocus = {};
      for (const k of Object.keys(FOCUS_DEFAULTS)) {
        if (!(k in f)) out.youtubeFocus[k] = FOCUS_DEFAULTS[k];
        else if (typeof f[k] !== 'boolean') errors.push(`settings.youtubeFocus.${k} musi być true/false`);
        else out.youtubeFocus[k] = f[k];
      }
      for (const k of Object.keys(f)) if (!(k in FOCUS_DEFAULTS)) ignored.push(`settings.youtubeFocus.${k}`);
    }
  }
  if (errors.length) return { ok: false, errors };
  out.protectionMode = modeForLists(out.enabledLists);
  return { ok: true, settings: out, ignored };
}

/** Odmiana: 1 reguła, 2–4 reguły (bez 12–14), pozostałe reguł. */
export function rulesWord(n) {
  if (n === 1) return 'reguła';
  const u = n % 10;
  const t = n % 100;
  return u >= 2 && u <= 4 && !(t >= 12 && t <= 14) ? 'reguły' : 'reguł';
}

const MODE_PL = { basic: 'Basic', balanced: 'Balanced', strict: 'Strict', custom: 'Własny' };

/** Krótkie podsumowanie przywróconych ustawień (lista linii). */
export function summarizeSettings(settings, { listNames = {} } = {}) {
  const lines = (settings.userFilters || '').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('!')).length;
  const f = settings.youtubeFocus || {};
  const on = ['shorts', 'recommendations', 'comments', 'endscreen'].filter((k) => f[k]).length;
  return [
    `Tryb ochrony: ${MODE_PL[settings.protectionMode] || settings.protectionMode}`,
    `Listy filtrów (${settings.enabledLists.length}): ${settings.enabledLists.map((id) => listNames[id] || id).join(', ') || 'brak'}`,
    `Wyłączone strony: ${settings.disabledSites.length}`,
    `Moje filtry: ${lines} ${rulesWord(lines)}`,
    `Focus Mode: ${f.enabled ? 'włączony' : 'wyłączony'} (opcje włączone: ${on}/4)`,
  ];
}
