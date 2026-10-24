// ChromeBlock – YouTube Protection: ocena stanu ochrony (service worker).
//
// Nie duplikuje silnika filtrów. Sprawdza, czy wspólne mechanizmy (DNR,
// kosmetyka, scriptlety) są gotowe do ochrony YouTube, i łączy to z lokalną
// diagnostyką odtwarzacza (youtube/health.js). YouTube Protection jest
// domyślnie włączone i działa zawsze, gdy działa lista "Reklamy".

export const YOUTUBE_HOST_PATTERNS = ['*://*.youtube.com/*', '*://*.www.youtube.com/*', '*://*.m.youtube.com/*',
  '*://*.music.youtube.com/*', '*://*.youtube-nocookie.com/*'];

/** Czy którykolwiek wzorzec pliku scriptletów dotyczy YouTube. */
export function coversYouTube(matches) {
  return (matches || []).some((m) => YOUTUBE_HOST_PATTERNS.includes(m));
}

/**
 * @param {object} input
 * @param {boolean} input.siteDisabled        użytkownik wyłączył ochronę na youtube.com
 * @param {boolean} input.adsEnabled          czy lista "Reklamy" jest włączona
 * @param {{total:number,supported:number,partial:number,unsupported:number,knownGaps:any[],newGaps:any[]}|null} input.compat
 * @param {string[]} input.expectedScripts    id plików scriptletów z regułami YouTube (dla włączonych list)
 * @param {string[]} input.registeredScripts  id faktycznie zarejestrowanych skryptów
 * @param {{status:string, reasons?:string[], at?:number}|null} input.player  ostatni raport odtwarzacza
 * @param {boolean} [input.syncing]           trwa synchronizacja (np. po instalacji) – brakujące
 *                                            scriptlety to stan przejściowy (WARNING), nie ERROR
 */
export function evaluateYouTubeProtection(input) {
  const checks = [];
  const add = (id, ok, message, severity = 'error') => checks.push({ id, ok, message, severity: ok ? 'ok' : severity });

  if (input.siteDisabled) {
    return { status: 'disabled', checks: [{ id: 'site', ok: false, severity: 'warning', message: 'Ochrona wyłączona przez użytkownika na youtube.com' }], player: input.player || null };
  }
  add('ads-list', !!input.adsEnabled, input.adsEnabled ? 'Lista „Reklamy” włączona' : 'Lista „Reklamy” jest wyłączona – brak ochrony YouTube');

  const compat = input.compat;
  if (!compat) {
    add('compat', false, 'Brak danych zgodności (data/youtube-compat.json)', 'warning');
  } else {
    const notExecuted = compat.partial + compat.unsupported;
    add('compat', notExecuted === 0,
      notExecuted === 0
        ? `Wszystkie krytyczne reguły YouTube obsługiwane (${compat.supported}/${compat.total})`
        : `${notExecuted} z ${compat.total} krytycznych reguł YouTube nie jest wykonywanych`,
      compat.newGaps && compat.newGaps.length ? 'error' : 'warning');
  }

  const registered = new Set(input.registeredScripts || []);
  const missing = (input.expectedScripts || []).filter((id) => !registered.has(id));
  if ((input.expectedScripts || []).length === 0) {
    add('scriptlets', false, 'Brak plików scriptletów YouTube dla włączonych list');
  } else {
    let message = `Scriptlety YouTube zarejestrowane (${input.expectedScripts.length} plików)`;
    if (missing.length) {
      message = input.syncing
        ? `Synchronizacja w toku – zarejestrowano ${input.expectedScripts.length - missing.length} z ${input.expectedScripts.length} plików scriptletów YouTube`
        : `Nie zarejestrowano: ${missing.join(', ')}`;
    }
    add('scriptlets', missing.length === 0, message, input.syncing ? 'warning' : 'error');
  }

  const player = input.player || null;
  if (player) {
    if (player.status === 'error') add('player', false, `Odtwarzacz: błąd (${(player.reasons || []).join(', ')})`, 'warning');
    else if (player.status === 'degraded') add('player', false, `Odtwarzacz: problem (${(player.reasons || []).join(', ')})`, 'warning');
    else if (player.status === 'healthy') add('player', true, 'Odtwarzacz: odtwarzanie możliwe');
  }

  let status = 'ok';
  if (checks.some((c) => c.severity === 'error')) status = 'error';
  else if (checks.some((c) => c.severity === 'warning')) status = 'warning';
  return { status, checks, player };
}
