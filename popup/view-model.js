// ChromeBlock – model widoku popupu (czysta logika; testy: tests/popup/popup.test.mjs).

import { modeDisplay } from '../shared/protection-mode-ui.js';

export const COMPONENT_PL = { network: 'sieć', cosmetic: 'filtry kosmetyczne', scriptlets: 'scriptlety', filters: 'listy filtrów', youtube: 'YouTube' };
export const STATUS_PL = { ok: 'Aktywna', warning: 'Ostrzeżenie', error: 'Błąd', disabled: 'Wyłączona', unknown: 'Nieznany' };


/** Polska odmiana opisu licznika: 1 żądanie, 2–4 żądania, 0/5+ żądań (12–14 → żądań). */
export function blockedLabel(n) {
  const k = Number(n);
  if (!Number.isFinite(k)) return 'zablokowanych żądań na tej karcie';
  const t = k % 100;
  const u = k % 10;
  if (k === 1) return 'zablokowane żądanie na tej karcie';
  if (u >= 2 && u <= 4 && !(t >= 12 && t <= 14)) return 'zablokowane żądania na tej karcie';
  return 'zablokowanych żądań na tej karcie';
}

/** Stan widoku na podstawie odpowiedzi popup:get (czysta funkcja – testowana). */
export function viewModel(info) {
  if (!info || !info.canRun) return { supported: false };
  const on = !info.disabled;
  const problems = info.problems || [];
  const yt = info.youtube || null;
  return {
    supported: true,
    host: String(info.host || '').replace(/^www\./, ''),
    on,
    status: on ? 'Ochrona aktywna' : 'Ochrona wyłączona',
    blocked: info.blocked === null || info.blocked === undefined ? '—' : Number(info.blocked).toLocaleString('pl-PL'),
    blockedLabel: blockedLabel(info.blocked),
    pickerEnabled: on,
    problems: problems.length
      ? `Problem z silnikiem: ${problems.map((p) => COMPONENT_PL[p] || p).join(', ')} – otwórz diagnostykę`
      : '',
    protectionMode: modeDisplay(info.protectionMode).mode,
    focus: info.youtubeFocus ? { enabled: !!info.youtubeFocus.enabled } : null,
    youtube: yt ? { status: yt.status, label: STATUS_PL[yt.status] || yt.status, detail: yt.detail || '' } : null,
  };
}
