// Tarcza – parser filtrów w składni Adblock Plus / uBlock Origin.
// Wspólny moduł: używany przez tools/build.mjs (Node) i przez service worker
// (własne filtry użytkownika). Nie zależy od żadnych API Node ani przeglądarki
// poza standardowym URL.

export const PRIORITY = {
  block: 1,
  redirect: 2,
  allow: 3,
  importantBlock: 4,
  importantRedirect: 5,
  user: 100,          // własne filtry użytkownika
  userAllow: 101,
  siteDisabled: 1000, // strona wyłączona przez użytkownika
};

const TYPE_MAP = {
  script: ['script'],
  image: ['image'],
  stylesheet: ['stylesheet'],
  css: ['stylesheet'],
  object: ['object'],
  'object-subrequest': ['object'],
  xmlhttprequest: ['xmlhttprequest'],
  xhr: ['xmlhttprequest'],
  subdocument: ['sub_frame'],
  frame: ['sub_frame'],
  ping: ['ping'],
  beacon: ['ping'],
  media: ['media'],
  font: ['font'],
  websocket: ['websocket'],
  other: ['other'],
  document: ['main_frame'],
  doc: ['main_frame'],
};

const ALL_TYPES = [
  'main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object',
  'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'webtransport',
  'webbundle', 'other',
];

const METHODS = new Set(['connect', 'delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'other']);

// Opcje, przy których filtra nie da się poprawnie wyrazić w MV3 – pomijamy go.
const UNSUPPORTED_OPTIONS = new Set([
  'csp', 'replace', 'header', 'permissions', 'urltransform', 'uritransform',
  'redirect-rule', 'popunder', 'cname', 'inline-script', 'inline-font', 'webrtc',
  'rewrite', 'stealth', 'cookie', 'hls', 'jsonprune', 'network', 'app', 'extension',
  'content', 'sitekey', 'ipaddress', 'responseheader', 'urlskip', 'genericblock',
  'reason',
]);

// Zasoby zastępcze dostępne w web_accessible_resources/.
export const REDIRECT_RESOURCES = {
  'noopjs': 'noop.js', 'noop.js': 'noop.js', 'abp-resource:blank-js': 'noop.js', 'blank-js': 'noop.js',
  'nooptext': 'noop.txt', 'noop.txt': 'noop.txt', 'blank-text': 'noop.txt',
  'noopframe': 'noop.html', 'noop.html': 'noop.html', 'blank-html': 'noop.html',
  'noopcss': 'noop.css', 'noop.css': 'noop.css', 'blank-css': 'noop.css',
  'noopjson': 'noop.json', 'noop.json': 'noop.json',
  '1x1.gif': '1x1.gif', '1x1-transparent.gif': '1x1.gif', 'abp-resource:1x1-transparent-gif': '1x1.gif',
  '2x2.png': '2x2.png', '2x2-transparent.png': '2x2.png', 'abp-resource:2x2-transparent-png': '2x2.png',
  '3x2.png': '3x2.png', '3x2-transparent.png': '3x2.png', 'abp-resource:3x2-transparent-png': '3x2.png',
  '32x32.png': '32x32.png', '32x32-transparent.png': '32x32.png', 'abp-resource:32x32-transparent-png': '32x32.png',
  'noopvast-2.0': 'noop-vast2.xml', 'noop-vast2.xml': 'noop-vast2.xml',
  'noopvast-3.0': 'noop-vast3.xml', 'noop-vast3.xml': 'noop-vast3.xml',
  'noopvast-4.0': 'noop-vast4.xml', 'noop-vast4.xml': 'noop-vast4.xml',
  'noopvmap-1.0': 'noop-vmap1.xml', 'noop-vmap1.xml': 'noop-vmap1.xml', 'noop-vmap1.0.xml': 'noop-vmap1.xml',
  'googlesyndication_adsbygoogle.js': 'googlesyndication_adsbygoogle.js',
  'googlesyndication.com/adsbygoogle.js': 'googlesyndication_adsbygoogle.js',
  'googletagservices_gpt.js': 'googletagservices_gpt.js',
  'googletagservices.com/gpt.js': 'googletagservices_gpt.js',
  'google-analytics_analytics.js': 'google-analytics_analytics.js',
  'google-analytics.com/analytics.js': 'google-analytics_analytics.js',
  'googletagmanager_gtm.js': 'google-analytics_analytics.js',
  'googletagmanager.com/gtm.js': 'google-analytics_analytics.js',
  'google-analytics_ga.js': 'google-analytics_ga.js',
  'google-analytics.com/ga.js': 'google-analytics_ga.js',
  'google-analytics_inpage_linkid.js': 'noop.js',
  'google-analytics_cx_api.js': 'noop.js',
  'amazon_apstag.js': 'amazon_apstag.js',
  'amazon-adsystem.com/aax2/amzn_ads.js': 'noop.js',
  'empty': 'noop.txt',
};

// Najpopularniejsze domeny najwyższego poziomu – do rozwijania zapisu "google.*".
export const ENTITY_TLDS = [
  'com', 'net', 'org', 'pl', 'com.pl', 'de', 'fr', 'it', 'es', 'co.uk', 'uk', 'ru', 'nl', 'be',
  'at', 'ch', 'cz', 'sk', 'se', 'no', 'dk', 'fi', 'pt', 'br', 'com.br', 'ca', 'com.au', 'co.jp',
  'jp', 'in', 'co.in', 'info', 'io', 'tv', 'me', 'cc', 'to', 'eu', 'us', 'co', 'biz', 'xyz',
  'lt', 'lv', 'ee', 'hu', 'ro', 'gr', 'tr', 'com.tr', 'ua', 'mx', 'com.mx', 'ar', 'com.ar',
  'cl', 'ie', 'nz', 'co.nz', 'za', 'co.za', 'kr', 'co.kr', 'tw', 'com.tw', 'hk', 'sg', 'ws',
  'la', 'is', 'si', 'hr', 'rs', 'bg', 'by', 'kz', 'cx', 'su', 'online', 'site', 'club', 'top',
];

// ---------------------------------------------------------------------------
// Domeny

function toAsciiHost(d) {
  if (/^[a-z0-9.\-_]+$/.test(d)) return d;
  try {
    const h = new URL('http://' + d + '/').hostname;
    return /^[a-z0-9.\-_]+$/.test(h) ? h : null;
  } catch {
    return null;
  }
}

/**
 * Zamienia jedną domenę z filtra na listę hostów ASCII.
 * Encje "x.*" są rozwijane na popularne TLD albo – gdy keepEntities – zostają jako "x.*".
 */
export function normalizeDomain(raw, keepEntities = false) {
  let d = raw.trim().toLowerCase();
  if (!d || d.startsWith('/')) return [];      // domeny-wyrażenia regularne – pomijamy
  if (d.endsWith('.*')) {
    const base = toAsciiHost(d.slice(0, -2));
    if (!base || base.includes('*')) return [];
    if (keepEntities) return [base + '.*'];
    return ENTITY_TLDS.map((t) => base + '.' + t);
  }
  if (d.includes('*')) return [];
  if (d.startsWith('.')) d = d.slice(1);
  const h = toAsciiHost(d);
  if (!h || h.startsWith('.') || h.endsWith('.') || h.includes('..')) return [];
  return [h];
}

/** Lista "a.com|~b.com" (sep='|') lub "a.com,~b.com" (sep=',') → {include, exclude}. */
export function parseDomainList(str, sep, keepEntities = false) {
  const include = [];
  const exclude = [];
  for (const part of str.split(sep)) {
    const p = part.trim();
    if (!p) continue;
    if (p.startsWith('~')) exclude.push(...normalizeDomain(p.slice(1), keepEntities));
    else include.push(...normalizeDomain(p, keepEntities));
  }
  return { include: [...new Set(include)], exclude: [...new Set(exclude)] };
}

// ---------------------------------------------------------------------------
// Klasyfikacja linii

const COSMETIC_SEPARATORS = [
  '#@$?#', '#@?#', '#@$#', '#@%#', '#@#', '#$?#', '#?#', '#$#', '#%#', '##',
];

/**
 * Rozpoznaje linię: zwraca {kind:'comment'|'network'|'cosmetic', ...}.
 */
export function classifyLine(line) {
  const t = line.trim();
  if (!t || t.startsWith('!') || (t.startsWith('[') && t.endsWith(']'))) return { kind: 'comment' };
  // Szukamy pierwszego separatora kosmetycznego.
  const hashAt = t.indexOf('#');
  if (hashAt !== -1) {
    for (let i = hashAt; i < t.length; i++) {
      if (t[i] !== '#') continue;
      for (const sep of COSMETIC_SEPARATORS) {
        if (t.startsWith(sep, i)) {
          const domains = t.slice(0, i);
          if (/[\/|^$\s]/.test(domains)) {
            return { kind: 'network', text: t };
          }
          return { kind: 'cosmetic', domains, sep, body: t.slice(i + sep.length) };
        }
      }
    }
  }
  if (t.includes('$$') || t.includes('$@$')) return { kind: 'comment' }; // filtry HTML AdGuard
  return { kind: 'network', text: t };
}

// ---------------------------------------------------------------------------
// Filtry sieciowe → reguły declarativeNetRequest

function splitOptions(str) {
  const out = [];
  let cur = '';
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '\\' && str[i + 1] === ',') { cur += ','; i++; continue; }
    if (c === ',') { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

/** Dzieli filtr sieciowy na wzorzec i opcje. */
function splitPatternOptions(text) {
  // Wyrażenie regularne /.../ z opcjonalnymi opcjami po "/$"
  if (text.startsWith('/') || text.startsWith('@@/')) {
    const start = text.startsWith('@@') ? 2 : 0;
    const idx = text.lastIndexOf('/$');
    if (idx > start && /^[\w~\-=|,.*:;\/%\[\]()^$+?\\]*$/.test(text.slice(idx + 2)) && looksLikeOptions(text.slice(idx + 2))) {
      return { pattern: text.slice(0, idx + 1), options: text.slice(idx + 2) };
    }
    if (text.endsWith('/') && text.length > start + 2) return { pattern: text, options: '' };
  }
  const idx = text.lastIndexOf('$');
  if (idx !== -1 && looksLikeOptions(text.slice(idx + 1))) {
    return { pattern: text.slice(0, idx), options: text.slice(idx + 1) };
  }
  return { pattern: text, options: '' };
}

function looksLikeOptions(s) {
  if (!s) return false;
  const first = splitOptions(s)[0] || '';
  return /^~?[a-z0-9\-_]+(=|$)/i.test(first);
}

const UNSUPPORTED_REGEX = /\(\?[=!<]|\\[1-9]|\(\?[a-z]*[A-Z]|\\[pPkK]\{?|[*+?}]\+|\\[cuxX]\{|\(\?>|\\[zG]/;

function convertRegex(src) {
  // src: zawartość między ukośnikami
  if (src.length > 2000) return null;
  if (UNSUPPORTED_REGEX.test(src)) return null;
  try { new RegExp(src); } catch { return null; }
  // RE2 nie obsługuje niektórych klas w JS – drobna normalizacja
  if (/[^\x20-\x7e]/.test(src)) return null;
  return src;
}

function convertUrlFilter(pattern) {
  let p = pattern;
  if (p === '' || p === '*') return { urlFilter: null };
  // Usuń zbędne gwiazdki na końcach (DNR i tak dopasowuje podciągi)
  if (!p.startsWith('|')) p = p.replace(/^\*+/, '');
  if (!p.endsWith('|')) p = p.replace(/\*+$/, '');
  if (p.startsWith('||*')) p = p.slice(3).replace(/^\*+/, '');
  if (p === '' || p === '|' || p === '||') return { urlFilter: null };
  // Znaki nie-ASCII → zakoduj jak w URL
  if (/[^\x20-\x7e]/.test(p)) {
    try {
      p = p.replace(/[^\x20-\x7e]+/g, (m) => encodeURIComponent(m));
    } catch { return null; }
  }
  if (/\s/.test(p)) return null;
  // "|" może być tylko na początku ("|" lub "||") i na końcu
  const inner = p.replace(/^\|\|?/, '').replace(/\|$/, '');
  if (inner.includes('|')) return null;
  if (inner === '' || inner === '*') return { urlFilter: null };
  return { urlFilter: p };
}

/**
 * Konwertuje filtr sieciowy na regułę DNR (bez id).
 * Zwraca:
 *   { rule }                                   – zwykła reguła
 *   { cosmeticHosts: {ghide:[], ehide:[], docAllow:[]} } – dodatkowo / zamiast
 *   null                                       – nieobsługiwany
 */
export function parseNetworkFilter(text, { trusted = false } = {}) {
  let t = text.trim();
  let allow = false;
  if (t.startsWith('@@')) { allow = true; t = t.slice(2); }
  const { pattern, options } = splitPatternOptions(t);

  const positiveTypes = new Set();
  const negativeTypes = new Set();
  let domainType = null;
  let initiator = null;
  let request = null;
  let excludedRequest = [];
  let important = false;
  let matchCase = false;
  let redirect = null;
  let removeparam = null;
  let methods = null;
  let excludedMethods = null;
  let documentOpt = false;
  let allTypes = false;
  let popupOnly = false;
  const cosmetic = { ghide: false, ehide: false, shide: false };

  for (const rawOpt of splitOptions(options)) {
    let opt = rawOpt;
    let neg = false;
    if (opt.startsWith('~')) { neg = true; opt = opt.slice(1); }
    const eq = opt.indexOf('=');
    const name = (eq === -1 ? opt : opt.slice(0, eq)).toLowerCase();
    const value = eq === -1 ? '' : opt.slice(eq + 1);

    if (TYPE_MAP[name] && !(name === 'document' || name === 'doc')) {
      (neg ? negativeTypes : positiveTypes).add(...TYPE_MAP[name]);
      continue;
    }
    switch (name) {
      case 'document': case 'doc':
        if (neg) return null;
        documentOpt = true;
        break;
      case 'all':
        allTypes = true;
        break;
      case 'popup':
        popupOnly = true;
        break;
      case 'third-party': case '3p': case 'strict3p': case 'strict-third-party':
        domainType = neg ? 'firstParty' : 'thirdParty';
        break;
      case 'first-party': case '1p': case 'strict1p': case 'strict-first-party':
        domainType = neg ? 'thirdParty' : 'firstParty';
        break;
      case 'domain': case 'from':
        initiator = parseDomainList(value, '|');
        if (initiator.include.length === 0 && initiator.exclude.length === 0) return null;
        break;
      case 'to':
        request = parseDomainList(value, '|');
        if (request.include.length === 0 && request.exclude.length === 0) return null;
        break;
      case 'denyallow':
        excludedRequest = parseDomainList(value, '|').include;
        break;
      case 'important':
        important = true;
        break;
      case 'match-case':
        matchCase = true;
        break;
      case 'redirect': case 'rewrite-abp': {
        const res = value.replace(/:\d+$/, '');
        redirect = REDIRECT_RESOURCES[res] || 'block';
        break;
      }
      case 'removeparam': case 'queryprune':
        if (!/^[\w.\-\[\]%]+$/.test(value)) return null;
        removeparam = value;
        break;
      case 'method': {
        for (const m of value.split('|')) {
          const mm = m.trim().toLowerCase();
          if (mm.startsWith('~')) {
            if (!METHODS.has(mm.slice(1))) return null;
            (excludedMethods ||= []).push(mm.slice(1));
          } else {
            if (!METHODS.has(mm)) return null;
            (methods ||= []).push(mm);
          }
        }
        break;
      }
      case 'generichide': case 'ghide':
        cosmetic.ghide = true;
        break;
      case 'elemhide': case 'ehide':
        cosmetic.ehide = true;
        break;
      case 'specifichide': case 'shide':
        cosmetic.shide = true;
        break;
      case 'empty': case 'mp4':
        if (name === 'mp4') positiveTypes.add('media');
        break;
      case 'badfilter':
        return null;
      case 'xhr': case 'websocket':
        break;
      default:
        if (UNSUPPORTED_OPTIONS.has(name)) return null;
        return null; // nieznana opcja – lepiej pominąć niż blokować za dużo
    }
  }

  const result = {};

  // Wyjątki kosmetyczne (@@...$generichide itp.)
  if (cosmetic.ghide || cosmetic.ehide || cosmetic.shide) {
    if (!allow) return null;
    const hosts = hostsFromPattern(pattern, initiator);
    if (hosts.length) {
      result.cosmeticHosts = {
        ghide: cosmetic.ghide || cosmetic.ehide ? hosts : [],
        ehide: cosmetic.ehide ? hosts : [],
      };
    }
    // jeśli poza tym nie ma typów – nie tworzymy reguły sieciowej
    if (positiveTypes.size === 0 && !documentOpt && !allTypes) return result.cosmeticHosts ? result : null;
  }

  if (popupOnly && positiveTypes.size === 0 && !documentOpt && !allTypes) {
    return null; // blokowanie wyskakujących okien nie jest dostępne w MV3
  }

  // Wzorzec
  const condition = {};
  if (pattern.length > 2 && pattern.startsWith('/') && pattern.endsWith('/')) {
    const re = convertRegex(pattern.slice(1, -1));
    if (!re) return null;
    condition.regexFilter = re;
  } else {
    const u = convertUrlFilter(pattern);
    if (!u) return null;
    if (u.urlFilter) {
      const hostOnly = /^\|\|([a-z0-9.\-_]+)\^\|?$/i.exec(u.urlFilter);
      if (hostOnly && !hostOnly[1].startsWith('.') && hostOnly[1].includes('.')) {
        condition.requestDomains = [hostOnly[1].toLowerCase()];
      } else {
        condition.urlFilter = u.urlFilter;
      }
    }
  }
  if (matchCase && (condition.urlFilter || condition.regexFilter)) condition.isUrlFilterCaseSensitive = true;

  if (initiator) {
    if (initiator.include.length) condition.initiatorDomains = initiator.include;
    if (initiator.exclude.length) condition.excludedInitiatorDomains = initiator.exclude;
    if (!initiator.include.length && !initiator.exclude.length) return null;
  }
  if (request) {
    if (request.include.length) {
      if (condition.requestDomains) {
        // przecięcie – rzadkie, upraszczamy: zostaw domenę z wzorca
      } else condition.requestDomains = request.include;
    }
    if (request.exclude.length) condition.excludedRequestDomains = request.exclude;
  }
  if (excludedRequest.length) {
    condition.excludedRequestDomains = [...new Set([...(condition.excludedRequestDomains || []), ...excludedRequest])];
  }
  if (domainType) condition.domainType = domainType;
  if (methods) condition.requestMethods = [...new Set(methods)];
  if (excludedMethods) condition.excludedRequestMethods = [...new Set(excludedMethods)];

  // Typy zasobów
  let action;
  let priority;
  if (allow && documentOpt) {
    action = { type: 'allowAllRequests' };
    condition.resourceTypes = ['main_frame', 'sub_frame'];
    priority = PRIORITY.allow;
    result.cosmeticHosts = {
      ...(result.cosmeticHosts || {}),
      docAllow: hostsFromPattern(pattern, initiator),
    };
  } else {
    if (allTypes) {
      condition.resourceTypes = ALL_TYPES.slice();
    } else if (positiveTypes.size || documentOpt) {
      const types = new Set(positiveTypes);
      if (documentOpt) types.add('main_frame');
      for (const n of negativeTypes) types.delete(n);
      if (types.size === 0) return null;
      condition.resourceTypes = [...types];
    } else if (negativeTypes.size) {
      condition.excludedResourceTypes = [...new Set([...negativeTypes, 'main_frame'])];
    }

    if (removeparam) {
      if (allow) return null;
      action = { type: 'redirect', redirect: { transform: { queryTransform: { removeParams: [removeparam] } } } };
      if (!condition.resourceTypes) {
        delete condition.excludedResourceTypes;
        condition.resourceTypes = ['main_frame', 'sub_frame', 'xmlhttprequest'];
      }
      priority = important ? PRIORITY.importantRedirect : PRIORITY.redirect;
    } else if (allow) {
      action = { type: 'allow' };
      priority = PRIORITY.allow;
    } else if (redirect && redirect !== 'block') {
      action = { type: 'redirect', redirect: { extensionPath: '/web_accessible_resources/' + redirect } };
      priority = important ? PRIORITY.importantRedirect : PRIORITY.redirect;
      if (!condition.resourceTypes) {
        // przekierowanie musi mieć określony typ zasobu
        const ext = redirect.split('.').pop();
        condition.resourceTypes = ext === 'js' ? ['script']
          : (ext === 'gif' || ext === 'png') ? ['image']
          : ext === 'html' ? ['sub_frame']
          : ext === 'css' ? ['stylesheet']
          : ext === 'xml' ? ['xmlhttprequest', 'media', 'other']
          : ['xmlhttprequest', 'other'];
        delete condition.excludedResourceTypes;
      }
    } else {
      action = { type: 'block' };
      priority = important ? PRIORITY.importantBlock : PRIORITY.block;
    }
  }

  // Zabezpieczenie: nie twórz reguły blokującej "wszystko"
  const hasScope = condition.urlFilter || condition.regexFilter || condition.requestDomains
    || condition.initiatorDomains;
  if (!hasScope) {
    return result.cosmeticHosts ? result : null;
  }
  // Zbyt krótkie, ogólne wzorce bez ograniczeń są ryzykowne
  if (condition.urlFilter && !condition.initiatorDomains && !condition.requestDomains
      && condition.urlFilter.replace(/[|^*]/g, '').length < 3) return null;

  result.rule = { priority, action, condition };
  return result;
}

function hostsFromPattern(pattern, initiator) {
  if (initiator && initiator.include.length) return initiator.include;
  const m = /^\|\|([a-z0-9.\-_]+)\^?\|?$/i.exec(pattern) || /^\|https?:\/\/([a-z0-9.\-_]+)\/?\^?\|?$/i.exec(pattern);
  if (m) return [m[1].toLowerCase()];
  return [];
}

// ---------------------------------------------------------------------------
// Walidacja reguły DNR (żeby Chrome nie odrzucił zestawu reguł)

const HOST_RE = /^[a-z0-9.\-_]+$/;

export function validateRule(rule) {
  const c = rule.condition;
  if (!c || !rule.action) return false;
  if (c.urlFilter !== undefined) {
    if (typeof c.urlFilter !== 'string' || !c.urlFilter.length) return false;
    if (/[^\x20-\x7e]/.test(c.urlFilter)) return false;
    if (c.urlFilter.startsWith('||*')) return false;
  }
  if (c.urlFilter && c.regexFilter) return false;
  for (const key of ['requestDomains', 'excludedRequestDomains', 'initiatorDomains', 'excludedInitiatorDomains']) {
    if (c[key] !== undefined) {
      if (!Array.isArray(c[key]) || c[key].length === 0) return false;
      if (!c[key].every((d) => HOST_RE.test(d))) return false;
    }
  }
  if (c.resourceTypes && c.excludedResourceTypes) return false;
  if (c.resourceTypes && c.resourceTypes.length === 0) return false;
  if (rule.action.type === 'allowAllRequests') {
    if (!c.resourceTypes || !c.resourceTypes.every((t) => t === 'main_frame' || t === 'sub_frame')) return false;
  }
  if (c.requestMethods && c.excludedRequestMethods) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Filtry kosmetyczne

const PROCEDURAL_OPS = [
  'has-text', 'contains', '-abp-contains', 'upward', 'remove', 'style', 'matches-path',
  'min-text-length', 'xpath', 'matches-css', 'matches-css-before', 'matches-css-after',
  'watch-attr', 'others', 'if', 'if-not', 'matches-attr', 'matches-prop', 'remove-attr',
  'remove-class', 'matches-media', 'nth-ancestor', '-abp-properties', 'spath', 'shadow',
];
const SUPPORTED_PROCEDURAL = new Set(['has-text', 'contains', '-abp-contains', 'upward', 'remove', 'style', 'matches-path', 'min-text-length', 'nth-ancestor']);
const PROC_RE = new RegExp(':(' + PROCEDURAL_OPS.map((s) => s.replace(/[-]/g, '\\-')).join('|') + ')\\(');

function balanced(s) {
  let depth = 0;
  let sq = 0;
  let quote = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\') { i++; continue; }
    if (quote) { if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'") { quote = c; continue; }
    if (c === '(') depth++;
    else if (c === ')') { depth--; if (depth < 0) return false; }
    else if (c === '[') sq++;
    else if (c === ']') { sq--; if (sq < 0) return false; }
  }
  return depth === 0 && sq === 0 && !quote;
}

/** Podstawowa kontrola poprawności selektora CSS (bez DOM). */
export function plausibleSelector(sel) {
  if (!sel || sel.length > 2000) return false;
  if (/[{}]/.test(sel)) return false;
  if (/^[\s>+~,]/.test(sel) && !sel.startsWith(':')) return false;
  if (/\/\*/.test(sel)) return false;
  return balanced(sel);
}

/** Dzieli selektor po przecinkach najwyższego poziomu. */
export function splitSelectorList(sel) {
  const out = [];
  let depth = 0;
  let quote = null;
  let cur = '';
  for (let i = 0; i < sel.length; i++) {
    const c = sel[i];
    if (c === '\\') { cur += c + (sel[i + 1] || ''); i++; continue; }
    if (quote) { cur += c; if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'") { quote = c; cur += c; continue; }
    if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    if (c === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Token do indeksu ogólnych filtrów: ".klasa" lub "#id" albo null. */
export function genericToken(sel) {
  const m = /^([.#])([A-Za-z0-9_\-]+)(?=$|[\s>+~.#:\[])/.exec(sel);
  if (!m) return null;
  return m[1] + m[2];
}

/**
 * Parsuje selektor proceduralny (uBO) na listę zadań:
 *   [{css:"..."}, {op:"has-text", arg:"..."}, {css:" > div"}, ...]
 * Zwraca null, jeśli zawiera nieobsługiwane operatory albo operator jest zagnieżdżony.
 */
export function parseProcedural(sel) {
  let s = sel
    .replace(/:-abp-has\(/g, ':has(')
    .replace(/:-abp-contains\(/g, ':has-text(')
    .replace(/:contains\(/g, ':has-text(');
  const tasks = [];
  let i = 0;
  let cssBuf = '';
  let depth = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '\\') { cssBuf += c + (s[i + 1] || ''); i += 2; continue; }
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ':' && depth === 0) {
      const m = /^:([a-z\-]+)\(/.exec(s.slice(i));
      if (m && PROCEDURAL_OPS.includes(m[1])) {
        if (!SUPPORTED_PROCEDURAL.has(m[1])) return null;
        // znajdź pasujący nawias zamykający
        let j = i + m[0].length;
        let d = 1;
        let quote = null;
        let arg = '';
        while (j < s.length && d > 0) {
          const ch = s[j];
          if (ch === '\\') { arg += ch + (s[j + 1] || ''); j += 2; continue; }
          if (quote) { if (ch === quote) quote = null; }
          else if (ch === '"' || ch === "'") quote = ch;
          else if (ch === '(') d++;
          else if (ch === ')') { d--; if (d === 0) break; }
          arg += ch;
          j++;
        }
        if (d !== 0) return null;
        if (cssBuf.trim() || (tasks.length === 0 && cssBuf)) tasks.push({ css: cssBuf });
        cssBuf = '';
        const op = m[1] === 'contains' || m[1] === '-abp-contains' ? 'has-text'
          : m[1] === 'nth-ancestor' ? 'upward' : m[1];
        const quoted = arg.length >= 2 && (arg[0] === '"' || arg[0] === "'") && arg[arg.length - 1] === arg[0];
        tasks.push({ op, arg: quoted ? arg.slice(1, -1) : arg });
        i = j + 1;
        continue;
      }
    }
    cssBuf += c;
    i++;
  }
  if (cssBuf.trim()) tasks.push({ css: cssBuf });
  // Nie pozwalamy na zagnieżdżone operatory proceduralne w :has()/:not()
  for (const t of tasks) {
    if (t.css !== undefined && PROC_RE.test(t.css)) return null;
    if (t.css !== undefined && !plausibleSelector(t.css.trim().replace(/^[>+~]\s*/, 'a ')) && t.css.trim()) return null;
  }
  if (!tasks.length) return null;
  // matches-path tylko na początku
  for (let k = 1; k < tasks.length; k++) if (tasks[k].op === 'matches-path') return null;
  // style/remove tylko na końcu
  for (let k = 0; k < tasks.length - 1; k++) if (tasks[k].op === 'style' || tasks[k].op === 'remove') return null;
  return tasks;
}

/** Czy selektor wymaga silnika proceduralnego. */
export function isProcedural(sel) {
  return PROC_RE.test(sel.replace(/:-abp-has\(/g, ':has('));
}

/**
 * Przetwarza filtr kosmetyczny.
 * Zwraca jeden z obiektów:
 *  {type:'hide', include:[hosts], exclude:[hosts], selector}
 *  {type:'unhide', include:[hosts], selector}           (#@#)
 *  {type:'style', include, exclude, selector, css}       (:style() → CSS)
 *  {type:'procedural', include, exclude, tasks, key}
 *  {type:'scriptlet', include, exclude, call:[name,...args]}
 *  {type:'unscriptlet', include, key}                    (#@#+js)
 *  null
 */
export function parseCosmeticFilter(c) {
  const { domains, sep, body } = c;
  const { include, exclude } = domains ? parseDomainList(domains, ',', true) : { include: [], exclude: [] };
  if (domains && include.length === 0 && exclude.length === 0) return null; // tylko nieobsługiwane domeny
  const isException = sep.includes('@');
  const isExtended = sep.includes('?');
  if (sep.includes('$') || sep.includes('%')) return null; // ABP snippets / AdGuard CSS-JS
  const b = body.trim();
  if (!b) return null;

  if (b.startsWith('+js(')) {
    if (!b.endsWith(')')) return null;
    const inner = b.slice(4, -1);
    if (isException) {
      if (!include.length) return null;
      if (inner.trim() === '') return { type: 'unscriptlet', include, key: '*' };
      const call = parseScriptletArgs(inner);
      if (!call) return null;
      return { type: 'unscriptlet', include, key: scriptletKey(call) };
    }
    if (!include.length) return null; // ogólne scriptlety nie są wspierane
    const call = parseScriptletArgs(inner);
    if (!call) return null;
    return { type: 'scriptlet', include, exclude, call };
  }
  if (b.startsWith('^') || b.startsWith('+')) return null; // filtrowanie HTML

  if (isException) {
    if (isProcedural(b)) return null;
    return { type: 'unhide', include, selector: b };
  }

  if (isExtended || isProcedural(b)) {
    // :style() na zwykłym selektorze → zwykły CSS
    const styleM = /^(.*):style\((.*)\)$/.exec(b);
    if (styleM && !isProcedural(styleM[1]) && plausibleSelector(styleM[1]) && !/[{}<>]|url\(|expression|@import/i.test(styleM[2])) {
      if (!include.length) return null;
      return { type: 'style', include, exclude, selector: styleM[1], css: styleM[2] };
    }
    if (!include.length) return null; // ogólne filtry proceduralne – pomijamy
    const tasks = parseProcedural(b);
    if (!tasks) return null;
    if (tasks.length === 1 && tasks[0].css !== undefined) {
      return { type: 'hide', include, exclude, selector: tasks[0].css.trim() };
    }
    for (const t of tasks) if (t.op === 'style' && /[{}<>]|url\(|expression|@import/i.test(t.arg)) return null;
    return { type: 'procedural', include, exclude, tasks, key: b };
  }

  if (!plausibleSelector(b)) return null;
  return { type: 'hide', include, exclude, selector: b };
}

// ---------------------------------------------------------------------------
// Scriptlety

export const SCRIPTLET_ALIASES = {
  'set': 'set-constant', 'set-constant': 'set-constant',
  'trusted-set': 'trusted-set-constant', 'trusted-set-constant': 'trusted-set-constant',
  'aopr': 'abort-on-property-read', 'abort-on-property-read': 'abort-on-property-read',
  'aopw': 'abort-on-property-write', 'abort-on-property-write': 'abort-on-property-write',
  'acs': 'abort-current-script', 'acis': 'abort-current-script', 'abort-current-script': 'abort-current-script',
  'abort-current-inline-script': 'abort-current-script',
  'aost': 'abort-on-stack-trace', 'abort-on-stack-trace': 'abort-on-stack-trace',
  'aeld': 'addEventListener-defuser', 'addEventListener-defuser': 'addEventListener-defuser',
  'prevent-addEventListener': 'addEventListener-defuser',
  'nostif': 'no-setTimeout-if', 'no-setTimeout-if': 'no-setTimeout-if',
  'prevent-setTimeout': 'no-setTimeout-if', 'setTimeout-defuser': 'no-setTimeout-if',
  'nosiif': 'no-setInterval-if', 'no-setInterval-if': 'no-setInterval-if',
  'prevent-setInterval': 'no-setInterval-if', 'setInterval-defuser': 'no-setInterval-if',
  'nano-stb': 'adjust-setTimeout', 'nano-setTimeout-booster': 'adjust-setTimeout', 'adjust-setTimeout': 'adjust-setTimeout',
  'nano-sib': 'adjust-setInterval', 'nano-setInterval-booster': 'adjust-setInterval', 'adjust-setInterval': 'adjust-setInterval',
  'nowoif': 'no-window-open-if', 'no-window-open-if': 'no-window-open-if',
  'prevent-window-open': 'no-window-open-if', 'window.open-defuser': 'no-window-open-if',
  'no-fetch-if': 'no-fetch-if', 'prevent-fetch': 'no-fetch-if',
  'no-xhr-if': 'no-xhr-if', 'prevent-xhr': 'no-xhr-if',
  'ra': 'remove-attr', 'remove-attr': 'remove-attr',
  'rc': 'remove-class', 'remove-class': 'remove-class',
  'rmnt': 'remove-node-text', 'remove-node-text': 'remove-node-text',
  'rpnt': 'replace-node-text', 'replace-node-text': 'replace-node-text',
  'trusted-rpnt': 'replace-node-text', 'trusted-replace-node-text': 'replace-node-text',
  'json-prune': 'json-prune',
  'json-prune-fetch-response': 'json-prune-fetch-response',
  'json-prune-xhr-response': 'json-prune-xhr-response',
  'set-cookie': 'set-cookie',
  'remove-cookie': 'remove-cookie', 'cookie-remover': 'remove-cookie',
  'set-local-storage-item': 'set-local-storage-item',
  'set-session-storage-item': 'set-session-storage-item',
  'noeval': 'noeval', 'silent-noeval': 'noeval',
  'noeval-if': 'noeval-if', 'prevent-eval-if': 'noeval-if',
  'nowebrtc': 'nowebrtc',
  'set-attr': 'set-attr',
  'trusted-click-element': 'trusted-click-element',
  'trusted-set-cookie': 'trusted-set-cookie',
  'trusted-set-local-storage-item': 'trusted-set-local-storage-item',
  'trusted-set-session-storage-item': 'trusted-set-session-storage-item',
};

// Scriptlety, które mogą pochodzić wyłącznie z zaufanych list (uBlock filters).
export const TRUSTED_SCRIPTLETS = new Set([
  'trusted-set-constant', 'replace-node-text', 'trusted-click-element',
  'trusted-set-cookie', 'trusted-set-local-storage-item', 'trusted-set-session-storage-item',
]);

function parseScriptletArgs(inner) {
  const args = [];
  let cur = '';
  let i = 0;
  const s = inner;
  // obsługa argumentów w cudzysłowach oraz "\,"
  while (i <= s.length) {
    // pomiń spacje na początku argumentu
    while (cur === '' && (s[i] === ' ' || s[i] === '\t')) i++;
    const q = s[i];
    if (cur === '' && (q === '"' || q === "'" || q === '`')) {
      let j = i + 1;
      let val = '';
      while (j < s.length && s[j] !== q) {
        if (s[j] === '\\' && s[j + 1] === q) { val += q; j += 2; continue; }
        val += s[j];
        j++;
      }
      // za zamykającym cudzysłowem oczekujemy przecinka lub końca
      let k = j + 1;
      while (s[k] === ' ') k++;
      if (k >= s.length || s[k] === ',') {
        args.push(val);
        i = k + 1;
        if (k >= s.length) break;
        continue;
      }
    }
    if (i >= s.length) { args.push(cur.trim()); break; }
    const c = s[i];
    if (c === '\\' && s[i + 1] === ',') { cur += ','; i += 2; continue; }
    if (c === ',') { args.push(cur.trim()); cur = ''; i++; if (i >= s.length) { args.push(''); break; } continue; }
    cur += c;
    i++;
  }
  if (!args.length || !args[0]) return null;
  let name = args[0].replace(/\.js$/, '');
  const canonical = SCRIPTLET_ALIASES[name];
  if (!canonical) return null;
  // usuń puste argumenty z końca
  const rest = args.slice(1);
  while (rest.length && rest[rest.length - 1] === '') rest.pop();
  return [canonical, ...rest];
}

export function scriptletKey(call) {
  return call.join('\u0001');
}

/**
 * Klucze, pod którymi szukamy filtrów dla danego hosta: sam host, domeny nadrzędne
 * oraz formy encji ("example.*" pasuje do example.com, example.pl, example.co.uk...).
 */
export function hostKeys(hostname) {
  const labels = hostname.split('.');
  const out = [];
  for (let i = 0; i < labels.length; i++) {
    const suffix = labels.slice(i);
    out.push(suffix.join('.'));
    if (suffix.length >= 2) out.push(suffix.slice(0, -1).join('.') + '.*');
    if (suffix.length >= 3) out.push(suffix.slice(0, -2).join('.') + '.*');
  }
  return out;
}
