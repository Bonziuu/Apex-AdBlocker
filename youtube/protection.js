// Apex AdBlocker – YouTube Protection: ocena stanu ochrony (service worker).
//
// Nie duplikuje silnika filtrów. Sprawdza, czy wspólne mechanizmy (DNR,
// kosmetyka, scriptlety) są gotowe do ochrony YouTube, i łączy to z lokalną
// diagnostyką odtwarzacza (youtube/health.js). YouTube Protection jest
// domyślnie włączone i działa zawsze, gdy działa lista "Reklamy".

import { t } from '../shared/i18n.js';

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
    return { status: 'disabled', checks: [{ id: 'site', ok: false, severity: 'warning', message: t('yt_siteDisabled') }], player: input.player || null };
  }
  add('ads-list', !!input.adsEnabled, input.adsEnabled ? t('yt_adsOn') : t('yt_adsOff'));

  const compat = input.compat;
  if (!compat) {
    add('compat', false, t('yt_noCompat'), 'warning');
  } else {
    const notExecuted = compat.partial + compat.unsupported;
    add('compat', notExecuted === 0,
      notExecuted === 0
        ? t('yt_allSupported', [compat.supported, compat.total])
        : t('yt_notExecuted', [notExecuted, compat.total]),
      compat.newGaps && compat.newGaps.length ? 'error' : 'warning');
  }

  const registered = new Set(input.registeredScripts || []);
  const missing = (input.expectedScripts || []).filter((id) => !registered.has(id));
  if ((input.expectedScripts || []).length === 0) {
    add('scriptlets', false, t('yt_noScriptlets'));
  } else {
    let message = t('yt_scriptletsOk', input.expectedScripts.length);
    if (missing.length) {
      message = input.syncing
        ? t('yt_syncing', [input.expectedScripts.length - missing.length, input.expectedScripts.length])
        : t('yt_notRegistered', missing.join(', '));
    }
    add('scriptlets', missing.length === 0, message, input.syncing ? 'warning' : 'error');
  }

  const player = input.player || null;
  if (player) {
    if (player.status === 'error') add('player', false, t('yt_playerError', (player.reasons || []).join(', ')), 'warning');
    else if (player.status === 'degraded') add('player', false, t('yt_playerDegraded', (player.reasons || []).join(', ')), 'warning');
    else if (player.status === 'healthy') add('player', true, t('yt_playerOk'));
  }

  let status = 'ok';
  if (checks.some((c) => c.severity === 'error')) status = 'error';
  else if (checks.some((c) => c.severity === 'warning')) status = 'warning';
  return { status, checks, player };
}
