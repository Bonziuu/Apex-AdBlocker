// ChromeBlock – logika interfejsu trybów ochrony (popup i opcje). Bez DOM – testowana jednostkowo.
//
// Nazwy trybów opisują zakres ingerencji w strony, nie jakość ochrony.
// „Własny” (custom) nie jest wybierany ręcznie – wynika z ręcznie ustawionych list.

export const PRESETS = Object.freeze(['basic', 'balanced', 'strict']);

export const MODE_LABEL = Object.freeze({ basic: 'Basic', balanced: 'Balanced', strict: 'Strict', custom: 'Własny' });

/** Krótki opis w popupie (różnica względem poprzedniego trybu). */
export const MODE_SHORT = Object.freeze({
  basic: 'Reklamy, śledzenie i złośliwe strony',
  balanced: '+ komunikaty o cookies',
  strict: '+ elementy irytujące',
  custom: 'Listy wybrane ręcznie',
});

/** Opis w opcjach: co zawiera tryb. */
export const MODE_CONTENTS = Object.freeze({
  basic: 'Reklamy, śledzenie i złośliwe strony',
  balanced: 'Basic + komunikaty o cookies',
  strict: 'Balanced + elementy irytujące',
});

/** Dane do wyświetlenia trybu. Nieznany / brak → custom (nigdy nie udajemy presetu). */
export function modeDisplay(mode) {
  const m = PRESETS.includes(mode) ? mode : 'custom';
  return { mode: m, label: MODE_LABEL[m], short: MODE_SHORT[m], isCustom: m === 'custom' };
}

export const MODE_ERROR = 'Nie udało się zmienić trybu. Przywrócono poprzedni.';

/**
 * Kontroler zmiany trybu: jedna zmiana naraz (kolejne kliknięcia w trakcie są ignorowane),
 * stan ładowania, po błędzie powrót do poprzedniego trybu i komunikat.
 * @param {{ send: (msg) => Promise<any>, initial: string, onChange?: (state) => void }} o
 */
export function createModeController({ send, initial, onChange = () => {} }) {
  let mode = modeDisplay(initial).mode;
  let pending = null;
  let error = '';
  let applied = false;
  const state = () => ({ ...modeDisplay(mode), pending, error, applied, busy: pending !== null });
  return {
    get state() { return state(); },
    /** Ustawia tryb z zewnątrz (np. po ręcznej zmianie list w opcjach). */
    sync(next) {
      if (pending) return;
      mode = modeDisplay(next).mode;
      error = '';
      applied = false;
      onChange(state());
    },
    async select(next) {
      if (pending !== null || !PRESETS.includes(next) || next === mode) return { ignored: true };
      const previous = mode;
      pending = next;
      error = '';
      applied = false;
      onChange(state());
      let res;
      try {
        res = await send({ type: 'options:setProtectionMode', mode: next });
      } catch (e) {
        res = { ok: false, error: String((e && e.message) || e) };
      }
      pending = null;
      if (res && res.ok) {
        mode = modeDisplay(res.protectionMode || next).mode;
        applied = true;
      } else {
        mode = previous;
        error = MODE_ERROR;
      }
      onChange(state());
      return res;
    },
  };
}
