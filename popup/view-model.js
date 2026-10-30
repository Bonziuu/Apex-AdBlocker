// Apex AdBlocker – model widoku popupu (czysta logika; testy: tests/popup/popup.test.mjs).
// Teksty z chrome.i18n (shared/i18n.js) – polski albo angielski według języka przeglądarki.

import { t, tPlural, numberLocale } from '../shared/i18n.js';

const COMPONENTS = ['network', 'cosmetic', 'scriptlets', 'filters', 'youtube'];
const YT_STATUSES = ['ok', 'warning', 'error', 'disabled', 'unknown'];

/** Opis licznika z odmianą (pl: 1 żądanie, 2–4 żądania, 0/5+ żądań; en: request/requests). */
export function blockedLabel(n) {
  const k = Number(n);
  return tPlural('popup_blocked', n === null || n === undefined || !Number.isFinite(k) ? NaN : k);
}

const componentName = (c) => (COMPONENTS.includes(c) ? t(`component_${c}`) : c);
const ytStatusLabel = (s) => (YT_STATUSES.includes(s) ? t(`ytStatus_${s}`) : s);

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
    status: on ? t('popup_statusOn') : t('popup_statusOff'),
    blocked: info.blocked === null || info.blocked === undefined ? '—' : Number(info.blocked).toLocaleString(numberLocale()),
    blockedLabel: blockedLabel(info.blocked),
    pickerEnabled: on,
    problems: problems.length ? t('popup_problems', problems.map(componentName).join(', ')) : '',
    youtube: yt ? { status: yt.status, label: ytStatusLabel(yt.status), detail: yt.detail || '' } : null,
  };
}
