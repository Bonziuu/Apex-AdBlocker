// ChromeBlock – tryby ochrony (fundament v0.3; UI w kolejnym etapie).
//
// Tryb to wyłącznie nazwany zestaw istniejących list. Nie zmienia parsera, scriptletów,
// silnika DNR ani filtrów. YouTube Protection jest włączone we wszystkich trybach
// (działa razem z listą „Reklamy”, która jest w każdym trybie).
//
//   basic    – ads, privacy, security
//   balanced – ads, privacy, security, cookies
//   strict   – ads, privacy, security, cookies, annoyances
//   custom   – dowolny inny zestaw ustawiony ręcznie

export const PROTECTION_MODES = Object.freeze({
  basic: Object.freeze(['ads', 'privacy', 'security']),
  balanced: Object.freeze(['ads', 'privacy', 'security', 'cookies']),
  strict: Object.freeze(['ads', 'privacy', 'security', 'cookies', 'annoyances']),
});

export const MODE_IDS = Object.freeze(['basic', 'balanced', 'strict', 'custom']);
export const DEFAULT_MODE = 'basic';

/** Czy tryb jest presetem, który można wybrać (custom powstaje tylko z ręcznej zmiany list). */
export function isPresetMode(mode) {
  return Object.prototype.hasOwnProperty.call(PROTECTION_MODES, mode);
}

/** Listy włączone w danym trybie (kopia) albo null dla nieznanego trybu / custom. */
export function listsForMode(mode) {
  return isPresetMode(mode) ? [...PROTECTION_MODES[mode]] : null;
}

/** Tryb odpowiadający zestawowi list (kolejność bez znaczenia); inaczej 'custom'. */
export function modeForLists(enabledLists) {
  const set = new Set(Array.isArray(enabledLists) ? enabledLists : []);
  for (const [mode, lists] of Object.entries(PROTECTION_MODES)) {
    if (lists.length === set.size && lists.every((id) => set.has(id))) return mode;
  }
  return 'custom';
}
