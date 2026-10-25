// ChromeBlock – YouTube Focus Mode (fundament v0.3): model ustawień i własne reguły kosmetyczne.
//
// Focus Mode tylko UKRYWA elementy interfejsu YouTube własnym CSS ChromeBlock (display:none).
// Nie zmienia silnika reklam, DNR, parsera ani scriptletów YouTube Protection, nie blokuje
// żądań sieciowych i nie dotyka odtwarzacza (#movie_player / <video>).
// Stan: chrome.storage.local['youtubeFocus']. Domyślnie Focus Mode jest WYŁĄCZONY;
// cztery opcje są domyślnie włączone, ale nic nie jest ukrywane, dopóki główny przełącznik = OFF.

export const FOCUS_STORAGE_KEY = 'youtubeFocus';
export const FOCUS_OPTIONS = Object.freeze(['shorts', 'recommendations', 'comments', 'endscreen']);

export const FOCUS_DEFAULTS = Object.freeze({
  enabled: false,
  shorts: true,
  recommendations: true,
  comments: true,
  endscreen: true,
});

export const FOCUS_LABELS = Object.freeze({
  enabled: 'Włącz Focus Mode',
  shorts: 'Ukryj Shorts',
  recommendations: 'Ukryj rekomendacje',
  comments: 'Ukryj komentarze',
  endscreen: 'Ukryj sugestie na końcu filmu',
});

export const FOCUS_DESCRIPTIONS = Object.freeze({
  shorts: 'Półki i kafelki Shorts w kanale, wynikach wyszukiwania i obok filmu, zakładka Shorts w menu. Otwarty bezpośrednio film Shorts nadal działa.',
  recommendations: 'Kolumna proponowanych filmów obok odtwarzacza i kanał rekomendacji na stronie głównej. Lista odtwarzania i czat na żywo zostają.',
  comments: 'Sekcja komentarzy pod filmem i panel komentarzy w Shorts.',
  endscreen: 'Kafelki z propozycjami na końcu filmu i karty końcowe w odtwarzaczu.',
});

/**
 * Selektory (desktop www.youtube.com). Każdy selektor trafia do OSOBNEJ reguły CSS, więc selektor
 * nieobsługiwany w danej wersji Chrome nie unieważnia pozostałych.
 * Nie ma tu odtwarzacza (#movie_player, video) ani odtwarzacza Shorts (ytd-reel-video-renderer, #shorts-player).
 */
export const FOCUS_SELECTORS = Object.freeze({
  shorts: Object.freeze([
    'ytd-reel-shelf-renderer',
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
    'grid-shelf-view-model:has(ytm-shorts-lockup-view-model)',
    'grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2)',
    'ytd-rich-item-renderer:has(ytm-shorts-lockup-view-model)',
    'ytd-rich-item-renderer:has(ytm-shorts-lockup-view-model-v2)',
    'ytd-rich-item-renderer:has(a[href^="/shorts/"])',
    'ytd-video-renderer:has(a[href^="/shorts/"])',
    'ytd-grid-video-renderer:has(a[href^="/shorts/"])',
    'ytd-compact-video-renderer:has(a[href^="/shorts/"])',
    'ytd-guide-entry-renderer:has(a[title="Shorts"])',
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    'yt-tab-shape[tab-title="Shorts"]',
  ]),
  recommendations: Object.freeze([
    'ytd-watch-flexy #related',
    'ytd-watch-next-secondary-results-renderer',
    'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer',
  ]),
  comments: Object.freeze([
    'ytd-watch-flexy ytd-comments#comments',
    'ytd-comments#comments',
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]',
  ]),
  endscreen: Object.freeze([
    '.html5-video-player .ytp-endscreen-content',
    '.html5-video-player .html5-endscreen',
    '.html5-video-player .ytp-ce-element',
    '.html5-video-player .ytp-fullscreen-grid',
    '.html5-video-player .ytp-pause-overlay',
  ]),
});

/** Strony, na których działa Focus Mode (skrypt youtube/focus.js: www.youtube.com; youtube.com przekierowuje na www). */
export function isFocusHost(host) {
  return host === 'www.youtube.com' || host === 'youtube.com';
}

/** Ustawienia z dowolnej wartości: brak / zły typ → wartość domyślna; nieznane klucze są pomijane. */
export function normalizeFocus(value) {
  const v = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const out = {};
  for (const k of Object.keys(FOCUS_DEFAULTS)) out[k] = typeof v[k] === 'boolean' ? v[k] : FOCUS_DEFAULTS[k];
  return out;
}

/** Które grupy są faktycznie ukrywane (pusta lista, gdy Focus Mode = OFF). */
export function activeFocusOptions(settings) {
  const s = normalizeFocus(settings);
  if (!s.enabled) return [];
  return FOCUS_OPTIONS.filter((k) => s[k]);
}

/** Selektory do ukrycia dla danych ustawień. */
export function focusSelectors(settings) {
  return activeFocusOptions(settings).flatMap((k) => FOCUS_SELECTORS[k]);
}

/** Reguły w składni filtrów kosmetycznych ChromeBlock (www.youtube.com##selektor) – do diagnostyki. */
export function focusCosmeticFilters(settings) {
  return focusSelectors(settings).map((sel) => `www.youtube.com##${sel}`);
}

/** CSS do wstrzyknięcia na www.youtube.com ('' gdy nic nie jest ukrywane). Jedna reguła na selektor. */
export function focusCss(settings) {
  const sels = focusSelectors(settings);
  if (!sels.length) return '';
  return '/* ChromeBlock – YouTube Focus Mode */\n' + sels.map((sel) => `${sel} { display: none !important; }`).join('\n') + '\n';
}
