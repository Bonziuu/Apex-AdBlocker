// Apex AdBlocker – tłumaczenia interfejsu (chrome.i18n, teksty w _locales/, źródło: tools/i18n-messages.mjs).
//
// Język wybiera Chrome według języka przeglądarki: polski → pl, każdy inny → en (default_locale).
// Strony HTML mają polski tekst jako wartość zapasową; localizeDocument() podmienia go na tłumaczenie.

const api = () => (globalThis.chrome && globalThis.chrome.i18n) || null;

/** Tłumaczenie klucza; gdy brak (np. testy bez chrome.i18n) – `fallback` albo sam klucz. */
export function t(key, subs, fallback) {
  const i18n = api();
  let m = '';
  try { m = i18n ? i18n.getMessage(key, subs === undefined ? undefined : [].concat(subs).map(String)) : ''; } catch { m = ''; }
  return m || (fallback !== undefined ? fallback : key);
}

/** Język interfejsu wybrany przez Chrome: 'pl' albo 'en'. */
export function uiLang() {
  const i18n = api();
  let lang = '';
  try { lang = (i18n && (i18n.getMessage('@@ui_locale') || i18n.getUILanguage())) || ''; } catch { lang = ''; }
  return String(lang).toLowerCase().startsWith('pl') ? 'pl' : (lang ? 'en' : 'pl');
}

/** Locale do formatowania liczb i dat. */
export const numberLocale = () => (uiLang() === 'pl' ? 'pl-PL' : 'en-US');

/**
 * Forma liczby: 'one' | 'few' | 'many'. Polski: 1 → one, 2–4 (bez 12–14) → few, reszta → many.
 * Angielski: 1 → one, reszta → many.
 */
export function pluralForm(n, lang = uiLang()) {
  const k = Math.abs(Number(n));
  if (!Number.isFinite(k)) return 'many';
  if (k === 1) return 'one';
  if (lang !== 'pl') return 'many';
  const u = k % 10;
  const tt = k % 100;
  return u >= 2 && u <= 4 && !(tt >= 12 && tt <= 14) ? 'few' : 'many';
}

/** Tekst z odmianą: klucze `${base}_one|_few|_many`. */
export function tPlural(base, n, subs) {
  return t(`${base}_${pluralForm(n)}`, subs);
}

/**
 * Tłumaczy dokument: [data-i18n] → textContent, [data-i18n-html] → innerHTML (stałe teksty
 * rozszerzenia), [data-i18n-placeholder|-title|-aria-label] → atrybuty. Brak tłumaczenia
 * zostawia tekst z HTML. Ustawia <html lang>.
 */
export function localizeDocument(root = document) {
  const apply = (attr, set) => {
    for (const el of root.querySelectorAll(`[${attr}]`)) {
      const key = el.getAttribute(attr);
      const m = t(key, undefined, '');
      if (m) set(el, m);
    }
  };
  apply('data-i18n', (el, m) => { el.textContent = m; });
  apply('data-i18n-html', (el, m) => { el.innerHTML = m; });
  apply('data-i18n-placeholder', (el, m) => { el.setAttribute('placeholder', m); });
  apply('data-i18n-title', (el, m) => { el.setAttribute('title', m); });
  apply('data-i18n-aria-label', (el, m) => { el.setAttribute('aria-label', m); });
  if (root.documentElement) root.documentElement.lang = uiLang();
}
