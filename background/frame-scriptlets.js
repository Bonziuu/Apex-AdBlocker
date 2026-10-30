// Matching is based on Chrome's trusted sender URL; the message body never selects a host.
// Frame injection is authorized by the worker after checking the top-level site's settings.

function matchesPattern(pattern, url) {
  if (pattern === '<all_urls>') return true;
  const match = /^(\*|https?):\/\/([^/]+)(\/.*)$/.exec(pattern);
  if (!match) return false;
  const [, scheme, host, path] = match;
  if (scheme !== '*' && `${scheme}:` !== url.protocol) return false;
  if (host !== '*') {
    if (host.startsWith('*.')) {
      const suffix = host.slice(2);
      if (url.hostname !== suffix && !url.hostname.endsWith(`.${suffix}`)) return false;
    } else if (url.hostname !== host) return false;
  }
  const pathRE = new RegExp(`^${path.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`);
  return pathRE.test(url.pathname + url.search);
}

/** Ordered unique files for a real HTTP(S) frame URL. Host guards inside the files still apply. */
export function scriptletFilesForFrame(metadata, frameUrl, { devPerf = false } = {}) {
  let url;
  try { url = new URL(frameUrl); } catch { return []; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return [];
  const files = new Set();
  for (const entry of metadata) {
    if (![...(entry.matches || []), ...(entry.sessionMatches || [])].some((pattern) => matchesPattern(pattern, url))) continue;
    for (const file of [...(entry.jsBefore || []), entry.file]) files.add(file);
  }
  return [...(devPerf && files.size ? ['content/scriptlet-perf-on.js'] : []), ...files];
}
