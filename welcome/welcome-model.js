// ChromeBlock – onboarding (strona powitalna). Czysta logika, bez DOM.
// Opisy trybów i lista presetów pochodzą z istniejących modułów (bez kopiowania mapowania list).

import { PRESETS, MODE_LABEL, MODE_CONTENTS } from '../shared/protection-mode-ui.js';
import { DEFAULT_MODE } from '../shared/protection-modes.js';

export const WELCOME_DEFAULT = DEFAULT_MODE; // 'basic'

/** Tryby do wyboru: {mode, label, desc, checked}. */
export function welcomeOptions(selected = WELCOME_DEFAULT) {
  return PRESETS.map((mode) => ({ mode, label: MODE_LABEL[mode], desc: MODE_CONTENTS[mode], checked: mode === selected }));
}

/**
 * Wynik zastosowania trybu (odpowiedź options:setProtectionMode).
 * „Gotowe” TYLKO przy ok === true i trybie zgodnym z wybranym; inaczej błąd i brak zamykania karty.
 */
export function welcomeResult(res, mode) {
  if (res && res.ok === true && res.protectionMode === mode) {
    return { done: true, close: true, message: `Gotowe – włączono tryb ${MODE_LABEL[mode]}. Możesz go zmienić w każdej chwili w ustawieniach.` };
  }
  const why = res && res.error ? ` (${res.error})` : '';
  return { done: false, close: false, message: `Nie udało się zastosować trybu ${MODE_LABEL[mode] || mode}${why}. Spróbuj ponownie albo zmień tryb później w ustawieniach.` };
}
