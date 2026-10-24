// ChromeBlock – raport diagnostyczny do skopiowania (opcje → Diagnostyka).
//
// Raport jest budowany lokalnie i NIGDZIE nie jest wysyłany. Celowo NIE zawiera:
// adresów stron, historii, identyfikatorów filmów, ciasteczek, tokenów, loginów,
// danych konta ani treści stron. Każdy tekst przechodzi przez sanitizeText().

const URL_RE = /\b(?:https?|wss?|ftp|chrome-extension|file):\/\/[^\s"'<>]+/gi;
const QUERY_SECRET_RE = /([?&;\s]|^)(v|list|token|access_token|id_token|key|api_key|apikey|auth|authorization|sid|ssid|session|sessionid|code|password|pass|pwd|email|user|login)=([^&\s;"']+)/gi;
const COOKIE_PAIR_RE = /\b(cookie|set-cookie)\s*[:=]\s*[^\n]*/gi;
const BEARER_RE = /\bbearer\s+[A-Za-z0-9._\-~+/]+=*/gi;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const VIDEO_PATH_RE = /(\/(?:watch\/|shorts\/|embed\/|live\/|v\/)|youtu\.be\/)[A-Za-z0-9_-]{6,}/gi;
const HOST_RE = /\b(?:[a-z0-9-]+\.)+(?:com|net|org|pl|io|tv|de|uk|eu|info|biz|co|me|ru|fr|it|es|nl|be|cz|sk|xyz|app|dev|be|ch|at|us|ca|jp|br)\b/gi;
const LONG_TOKEN_RE = /\b[A-Za-z0-9_\-+/]{32,}={0,2}/g;

/** Usuwa z tekstu wszystko, co może identyfikować użytkownika lub odwiedzane strony. */
export function sanitizeText(value) {
  return String(value ?? '')
    .replace(URL_RE, '[url]')
    .replace(COOKIE_PAIR_RE, '$1=[redacted]')
    .replace(BEARER_RE, 'Bearer [redacted]')
    .replace(QUERY_SECRET_RE, (m, pre, k) => `${pre}${k}=[redacted]`)
    .replace(EMAIL_RE, '[email]')
    .replace(VIDEO_PATH_RE, '$1[video]')
    .replace(HOST_RE, '[host]')
    .replace(LONG_TOKEN_RE, '[token]')
    .slice(0, 300);
}

const STATUS_LABEL = { ok: 'OK', warning: 'WARNING', error: 'ERROR', unknown: 'UNKNOWN', disabled: 'DISABLED' };
const COMPONENT_LABEL = { network: 'Network', cosmetic: 'Cosmetic', scriptlets: 'Scriptlets', filters: 'Filters', youtube: 'YouTube' };
const iso = (t) => (typeof t === 'number' && Number.isFinite(t) ? new Date(t).toISOString() : null);

/**
 * Buduje raport (obiekt + tekst).
 * @param {object} input
 * @param {string} input.version        np. "0.2.1"
 * @param {string} input.versionName    np. "0.2.1-dev"
 * @param {number} input.manifestVersion
 * @param {number} input.now
 * @param {string[]} input.enabledLists
 * @param {{components:object, sync:object, errors:Array}} input.health
 * @param {object|null} input.youtubeCompat   data/youtube-compat.json
 * @param {object|null} input.scriptletCompat data/scriptlet-compat.json
 * @param {object|null} input.player          zagregowany raport odtwarzacza
 * @param {boolean} input.devPerf
 */
export function buildDiagnosticsReport(input) {
  const h = input.health || { components: {}, sync: {}, errors: [] };
  const components = {};
  for (const [k, v] of Object.entries(h.components || {})) {
    components[k] = { status: v.status, detail: sanitizeText(v.detail) };
  }
  const sync = {};
  for (const [k, v] of Object.entries(h.sync || {})) {
    sync[k] = { status: v.status, at: iso(v.at), message: sanitizeText(v.message) };
  }
  const errors = (h.errors || []).slice(-10).map((e) => ({
    at: iso(e.timestamp),
    component: String(e.component || ''),
    message: sanitizeText(e.message),
  }));
  const yc = input.youtubeCompat;
  const youtubeCompat = yc ? {
    total: yc.total, supported: yc.supported, partial: yc.partial, unsupported: yc.unsupported,
    knownGaps: (yc.knownGaps || []).length, newGaps: (yc.newGaps || []).length,
  } : null;
  const sc = input.scriptletCompat && input.scriptletCompat.summary;
  const p = input.player;
  const player = p ? {
    status: p.status,
    reasons: (p.reasons || []).map(sanitizeText),
    page: ['watch', 'shorts', 'embed', 'live', ''].includes(p.page) ? p.page : 'other',
    frame: p.frame === 'frame' ? 'frame' : 'top',
    at: iso(p.at),
  } : null;

  const data = {
    product: 'ChromeBlock',
    version: String(input.version || ''),
    versionName: String(input.versionName || ''),
    manifestVersion: input.manifestVersion,
    generatedAt: iso(input.now),
    enabledLists: (input.enabledLists || []).map((x) => String(x).replace(/[^\w-]/g, '')),
    components,
    sync,
    youtubeCompatibility: youtubeCompat,
    scriptletCompatibility: sc ? { total: sc.total, supported: sc.supported, partial: sc.partial, unsupported: sc.unsupported } : null,
    player,
    recentErrors: errors,
    perfDiagnosticsEnabled: !!input.devPerf,
    startup: input.startupProfile && input.startupProfile.totalMs !== null && input.startupProfile.totalMs !== undefined ? {
      reason: sanitizeText(input.startupProfile.reason),
      totalMs: Math.round(input.startupProfile.totalMs),
      marks: Object.fromEntries(Object.entries(input.startupProfile.marks || {}).map(([k, v]) => [sanitizeText(k), Math.round(v)])),
      stages: (input.startupProfile.stages || []).map((x) => ({ name: sanitizeText(x.name), count: x.count, totalMs: Math.round(x.totalMs) })),
    } : null,
  };

  const lines = [];
  lines.push('ChromeBlock Diagnostics');
  lines.push(`Version: ${data.versionName || data.version} (manifest v${data.manifestVersion})`);
  lines.push(`Generated: ${data.generatedAt}`);
  lines.push(`Enabled lists: ${data.enabledLists.join(', ') || 'none'}`);
  lines.push('');
  for (const k of ['network', 'cosmetic', 'scriptlets', 'filters', 'youtube']) {
    const c = components[k];
    if (!c) continue;
    lines.push(`${COMPONENT_LABEL[k]}: ${STATUS_LABEL[c.status] || c.status}${c.detail ? ` – ${c.detail}` : ''}`);
  }
  lines.push('');
  lines.push('Sync:');
  for (const [k, v] of Object.entries(sync)) lines.push(`  ${k}: ${STATUS_LABEL[v.status] || v.status}${v.message ? ` – ${v.message}` : ''}`);
  lines.push('');
  lines.push('YouTube compatibility:');
  lines.push(youtubeCompat ? `  ${youtubeCompat.supported} / ${youtubeCompat.total} (partial ${youtubeCompat.partial}, unsupported ${youtubeCompat.unsupported}, known gaps ${youtubeCompat.knownGaps})` : '  unknown');
  lines.push('');
  lines.push('Scriptlet compatibility:');
  lines.push(data.scriptletCompatibility
    ? `  ${data.scriptletCompatibility.supported} / ${data.scriptletCompatibility.total} supported (partial ${data.scriptletCompatibility.partial}, unsupported ${data.scriptletCompatibility.unsupported})`
    : '  unknown');
  lines.push('');
  lines.push('Player:');
  lines.push(player ? `  ${player.status}${player.page ? ` (${player.page}, ${player.frame})` : ''}${player.reasons.length ? ` – ${player.reasons.join('; ')}` : ''}` : '  no recent report');
  lines.push('');
  lines.push('Recent ChromeBlock errors:');
  if (!errors.length) lines.push('  none');
  for (const e of errors) lines.push(`  ${e.at} [${e.component}] ${e.message}`);
  lines.push('');
  lines.push(`Perf diagnostics: ${data.perfDiagnosticsEnabled ? 'enabled' : 'disabled'}`);
  lines.push('');
  if (data.startup) {
    lines.push(`Startup total: ${data.startup.totalMs} ms (${data.startup.reason})`);
    for (const x of data.startup.stages.slice().sort((a, b) => b.totalMs - a.totalMs).slice(0, 12)) {
      lines.push(`  ${x.name}: ${x.totalMs} ms${x.count > 1 ? ` (${x.count}×)` : ''}`);
    }
  } else lines.push('Startup: no measurement');
  lines.push('');
  lines.push('JSON:');
  lines.push(JSON.stringify(data, null, 2));
  return { data, text: lines.join('\n') };
}
