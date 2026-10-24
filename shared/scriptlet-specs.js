// ChromeBlock – rejestr scriptletów i walidacja ich argumentów.
//
// Zasada: FAIL CLOSED. Filtr +js(...) jest wykonywany tylko wtedy, gdy
// ChromeBlock zna scriptlet ORAZ rozumie semantykę dokładnie tego wariantu
// argumentów, którego używa filtr. Każdy nieznany parametr, nieznany token
// vararg albo nieobsługiwana wartość oznacza, że filtr NIE jest wykonywany.
//
// Wynik analizy:
//   status 'supported'   – wykonywany, semantyka zgodna z oczekiwaniami filtra
//   status 'partial'     – scriptlet jest zaimplementowany, ale TEN wariant
//                          argumentów nie jest obsługiwany → NIE jest wykonywany
//   status 'unsupported' – brak implementacji / scriptlet zaufany z niezaufanej
//                          listy / filtr bez efektu (tryb logowania)
//
// Moduł jest używany przez parser, build, audyt i testy.

import { ChromeBlockJSONPath } from './jsonpath.js';

// --------------------------------------------------------------------------
// Aliasy (nazwy z list → nazwa kanoniczna)

const ALIAS_GROUPS = {
  'set-constant': ['set'],
  'trusted-set-constant': ['trusted-set'],
  'abort-on-property-read': ['aopr'],
  'abort-on-property-write': ['aopw'],
  'abort-current-script': ['acs', 'acis', 'abort-current-inline-script'],
  'abort-on-stack-trace': ['aost'],
  'prevent-addEventListener': ['aeld', 'addEventListener-defuser'],
  'prevent-setTimeout': ['nostif', 'no-setTimeout-if', 'setTimeout-defuser'],
  'prevent-setInterval': ['nosiif', 'no-setInterval-if', 'setInterval-defuser'],
  'adjust-setTimeout': ['nano-stb', 'nano-setTimeout-booster'],
  'adjust-setInterval': ['nano-sib', 'nano-setInterval-booster'],
  'prevent-window-open': ['nowoif', 'no-window-open-if', 'window.open-defuser'],
  'prevent-fetch': ['no-fetch-if'],
  'trusted-prevent-fetch': [],
  'prevent-xhr': ['no-xhr-if'],
  'trusted-prevent-xhr': [],
  'remove-attr': ['ra'],
  'remove-class': ['rc'],
  'set-attr': [],
  'trusted-set-attr': [],
  'remove-node-text': ['rmnt'],
  'trusted-replace-node-text': ['trusted-rpnt', 'replace-node-text', 'rpnt'],
  'json-prune': [],
  'json-prune-fetch-response': [],
  'json-prune-xhr-response': [],
  'trusted-replace-fetch-response': ['trusted-rpfr'],
  'trusted-replace-xhr-response': [],
  'json-edit': [],
  'trusted-json-edit': [],
  'json-edit-fetch-response': [],
  'trusted-json-edit-fetch-response': [],
  'json-edit-xhr-response': [],
  'trusted-json-edit-xhr-response': [],
  'edit-inbound-object': [],
  'trusted-edit-inbound-object': [],
  'trusted-prevent-dom-bypass': [],
  'set-cookie': [],
  'set-cookie-reload': [],
  'trusted-set-cookie': [],
  'trusted-set-cookie-reload': [],
  'remove-cookie': ['cookie-remover'],
  'set-local-storage-item': [],
  'set-session-storage-item': [],
  'trusted-set-local-storage-item': [],
  'trusted-set-session-storage-item': [],
  'noeval': [],
  'noeval-silent': ['silent-noeval'],
  'noeval-if': ['prevent-eval-if'],
  'nowebrtc': [],
  'trusted-click-element': [],
};

export const SCRIPTLET_ALIASES = {};
for (const [canonical, aliases] of Object.entries(ALIAS_GROUPS)) {
  SCRIPTLET_ALIASES[canonical] = canonical;
  for (const a of aliases) SCRIPTLET_ALIASES[a] = canonical;
}

/** Nazwa kanoniczna albo null, jeśli ChromeBlock jej nie zna. */
export function canonicalScriptletName(raw) {
  const name = String(raw || '').trim().replace(/\.js$/, '');
  return SCRIPTLET_ALIASES[name] || null;
}

// --------------------------------------------------------------------------
// Pomocnicze walidatory

const RE_LITERAL = /^\/(.+)\/([gimsu]*)$/;

/** Wzorzec uBO: pusty, dosłowny tekst albo /regex/flagi (musi się kompilować). */
function badPattern(p, { negatable = false } = {}) {
  let s = String(p);
  if (negatable && s.startsWith('!')) s = s.slice(1);
  const m = RE_LITERAL.exec(s);
  if (!m) return null;
  try { new RegExp(m[1], m[2] || undefined); } catch { return `niepoprawne wyrażenie regularne: ${p}`; }
  return null;
}

/** Varargi: pary nazwa,wartość; tylko dozwolone nazwy. */
function parseVarargs(args, allowed) {
  if (args.length % 2 !== 0) return { error: `niesparowany vararg "${args[args.length - 1]}"` };
  const out = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    if (!Object.prototype.hasOwnProperty.call(allowed, key)) return { error: `nieobsługiwany parametr "${key}"` };
    const check = allowed[key];
    const err = check ? check(args[i + 1]) : null;
    if (err) return { error: `parametr "${key}": ${err}` };
    out[key] = args[i + 1];
  }
  return { values: out };
}

const RUN_AT_TOKENS = ['loading', 'asap', 'interactive', 'end', '2', 'complete', 'idle', '3'];
const vRunAt = (v) => (RUN_AT_TOKENS.includes(v) ? null : `nieznany moment "${v}"`);
const vInt = (v) => (/^\d+$/.test(v) ? null : 'oczekiwano liczby całkowitej');
const vPattern = (v) => badPattern(v);
const vNegPattern = (v) => badPattern(v, { negatable: true });
const vAny = () => null;
const vLogOnly = () => null; // parametry wyłącznie diagnostyczne w uBO (nie zmieniają działania)

function vPropsToMatch(v) {
  if (v === undefined || v === '') return null;
  for (const needle of String(v).split(/\s+/)) {
    if (!needle) continue;
    const parts = needle.split(':');
    let pattern = parts.length > 1 ? parts[1] : needle;
    if (parts.length > 1 && /[^$\w -]/.test(parts[0])) pattern = needle;
    const err = badPattern(pattern, { negatable: true });
    if (err) return err;
  }
  return null;
}

const SAFE_COOKIE_VALUES = [
  'accept', 'reject', 'accepted', 'rejected', 'notaccepted', 'allow', 'disallow', 'deny',
  'allowed', 'denied', 'approved', 'disapproved', 'checked', 'unchecked', 'dismiss', 'dismissed',
  'enable', 'disable', 'enabled', 'disabled', 'essential', 'nonessential', 'forbidden', 'forever',
  'hide', 'hidden', 'necessary', 'required', 'ok', 'on', 'off', 'true', 't', 'false', 'f',
  'yes', 'y', 'no', 'n', 'all', 'none', 'functional', 'granted', 'done', 'decline', 'declined',
  'closed', 'next', 'mandatory', 'disagree', 'agree', 'set', 'unset', 'given',
];
export { SAFE_COOKIE_VALUES };

function unquotedLower(v) {
  const normalized = String(v).toLowerCase();
  const m = /^("?)(.+)\1$/.exec(normalized);
  return (m && m[2]) || normalized;
}

function safeCookieValue(v) {
  const u = unquotedLower(v);
  if (SAFE_COOKIE_VALUES.includes(u)) return true;
  if (!/^-?\d+$/.test(u)) return false;
  const n = parseInt(v, 10) || 0;
  return n >= -32767 && n <= 32767;
}

function safeStorageValue(v) {
  let value = v;
  if (value === 'emptyArr') value = '[]';
  else if (value === 'emptyObj') value = '{}';
  const u = unquotedLower(value);
  if (['', 'undefined', 'null', '{}', '[]', '""', '$remove$', ...SAFE_COOKIE_VALUES].includes(u)) return true;
  if (!/^-?\d+$/.test(u)) return false;
  const n = parseInt(u, 10) || 0;
  return n >= -32767 && n <= 32767;
}

const CONSTANT_VALUES = ['undefined', 'false', 'true', 'null', "''", '', '[]', 'emptyArr', '{}', 'emptyObj',
  'noopFunc', 'trueFunc', 'falseFunc', 'throwFunc'];

function constantError(raw, trusted) {
  if (CONSTANT_VALUES.includes(raw)) return null;
  if (/^-?\d+$/.test(raw)) {
    return Math.abs(parseInt(raw, 10)) > 0x7FFF ? 'liczba poza zakresem ±32767' : null;
  }
  if (trusted) {
    if (raw.startsWith('json:')) {
      try { JSON.parse(raw.slice(5)); return null; } catch { return 'niepoprawny JSON po "json:"'; }
    }
    if (raw.startsWith('{') && raw.endsWith('}')) {
      try { JSON.parse(raw); return null; } catch { return 'niepoprawny obiekt JSON'; }
    }
  }
  return `wartość "${raw}" nie jest obsługiwana`;
}

// uBO dzieli łańcuch po kropkach i używa segmentów jako nazw właściwości (dowolnych).
const CHAIN_RE = /^[^\s.]+(\.[^\s.]+)*$/;
const vChain = (v) => (CHAIN_RE.test(v) ? null : `niepoprawny łańcuch właściwości "${v}"`);

function contentDirectiveError(d, trusted) {
  if (d === '' || d === 'true' || d === 'emptyObj' || d === 'emptyArr' || d === 'emptyStr') return null;
  if (/^length:\d+(-\d+)?$/.test(d)) return null;
  if (d.startsWith('war:') || d.startsWith('join:')) return `dyrektywa "${d.split(':')[0]}:" nie jest obsługiwana`;
  if (d.startsWith('length:')) return 'niepoprawna dyrektywa length:';
  if (trusted) return null; // zaufany scriptlet zwraca dowolny tekst
  return null; // uBO zwraca wtedy pusty tekst – ChromeBlock robi to samo
}

const RANGE_RE = /^!?(\d*)(-(\d*))?$/;

function jsonPathError(q, trusted) {
  if (!q) return 'puste zapytanie JSONPath';
  const p = ChromeBlockJSONPath.compileQuery(q);
  if (!p.valid) return `zapytanie JSONPath: ${p.error}`;
  if (p.hasAssignment && !trusted) return 'przypisanie wartości wymaga zaufanego scriptletu';
  return null;
}

function pruneArgsError(args, { positionalStack }) {
  const [prune = '', needle = '', third = ''] = args;
  if (prune === '') return 'tryb logowania (brak ścieżek do usunięcia) – bez efektu';
  if (positionalStack) {
    if (third !== '') return 'dopasowanie stosu wywołań (stackNeedle) nie jest obsługiwane';
    const v = parseVarargs(args.slice(3), { log: vLogOnly, logstack: vLogOnly });
    if (v.error) return v.error;
  } else {
    const v = parseVarargs(args.slice(2), { propsToMatch: vPropsToMatch, stackToMatch: vAny, log: vLogOnly, logstack: vLogOnly });
    if (v.error) return v.error;
    if (v.values.stackToMatch) return 'dopasowanie stosu wywołań (stackToMatch) nie jest obsługiwane';
  }
  if (prune.trim() === '') return 'puste ścieżki';
  void needle;
  return null;
}

// --------------------------------------------------------------------------
// Specyfikacje

const S = {};
const spec = (name, def) => { S[name] = { name, trusted: false, ...def }; };

spec('set-constant', {
  validate(a) {
    const [chain = '', value = 'undefined', ...rest] = a;
    if (!chain) return 'brak łańcucha właściwości';
    return vChain(chain) || constantError(value, false)
      || parseVarargs(rest, { as: (v) => (['function', 'callback', 'resolved', 'rejected'].includes(v) ? null : `nieznane as="${v}"`), runAt: vRunAt }).error || null;
  },
});
spec('trusted-set-constant', {
  trusted: true,
  validate(a) {
    const [chain = '', value = 'undefined', ...rest] = a;
    if (!chain) return 'brak łańcucha właściwości';
    return vChain(chain) || constantError(value, true)
      || parseVarargs(rest, { as: (v) => (['function', 'callback', 'resolved', 'rejected'].includes(v) ? null : `nieznane as="${v}"`), runAt: vRunAt }).error || null;
  },
});
spec('abort-on-property-read', {
  validate(a) { if (a.length !== 1) return a.length ? 'nadmiarowe argumenty' : 'brak właściwości'; return vChain(a[0]); },
});
spec('abort-on-property-write', {
  validate(a) { if (a.length !== 1) return a.length ? 'nadmiarowe argumenty' : 'brak właściwości'; return vChain(a[0]); },
});
spec('abort-current-script', {
  validate(a) {
    if (a.length === 0 || !a[0]) return 'brak właściwości';
    if (a.length > 3) return 'nadmiarowe argumenty';
    return vChain(a[0]) || badPattern(a[1] || '') || badPattern(a[2] || '');
  },
});
spec('abort-on-stack-trace', {
  implemented: false,
  reason: 'ChromeBlock nie odtwarza normalizacji stosu wywołań uBO (inlineScript/injectedScript/stackDepth)',
});
spec('prevent-addEventListener', {
  validate(a) {
    const [type = '', pattern = '', ...rest] = a;
    if (type === '' && pattern === '') return 'tryb logowania (brak typu i wzorca) – bez efektu';
    const v = parseVarargs(rest, { runAt: vRunAt, elements: vAny, protect: vAny });
    return badPattern(type) || badPattern(pattern) || v.error || null;
  },
});
for (const n of ['prevent-setTimeout', 'prevent-setInterval']) {
  spec(n, {
    validate(a) {
      const [needle = '', delay = ''] = a;
      if (a.length > 2) return 'nadmiarowe argumenty';
      if (!RANGE_RE.test(delay)) return `niepoprawny zakres opóźnienia "${delay}"`;
      if (needle === '' && delay.replace(/^!/, '') === '') return 'tryb logowania – bez efektu';
      return badPattern(needle, { negatable: true });
    },
  });
}
for (const n of ['adjust-setTimeout', 'adjust-setInterval']) {
  spec(n, {
    validate(a) {
      const [needle = '', delay = '', boost = ''] = a;
      if (a.length > 3) return 'nadmiarowe argumenty';
      if (delay !== '' && delay !== '*' && !/^\d+$/.test(delay)) return `niepoprawne opóźnienie "${delay}"`;
      if (boost !== '' && !/^\d*\.?\d+$/.test(boost)) return `niepoprawny mnożnik "${boost}"`;
      return badPattern(needle);
    },
  });
}
spec('prevent-window-open', {
  validate(a) {
    const [pattern = '', delay = '', decoy = ''] = a;
    if (a.length > 3) return 'nadmiarowe argumenty';
    if (pattern === 'debug') return 'tryb debugowania – bez efektu';
    if (delay !== '' && !/^\d*\.?\d+$/.test(delay)) return `niepoprawne opóźnienie "${delay}"`;
    if (!['', 'obj', 'blank'].includes(decoy)) return `nieznana atrapa "${decoy}"`;
    return badPattern(pattern, { negatable: true });
  },
});
function preventFetchValidate(trusted) {
  return (a) => {
    const [props = '', body = '', type = '', ...rest] = a;
    if (props === '' && body === '') return 'tryb logowania – bez efektu';
    const v = parseVarargs(rest, { throttle: vInt });
    if (v.error) return v.error;
    if (type !== '') {
      if (/^\{.*\}$/.test(type)) {
        let obj;
        try { obj = JSON.parse(type); } catch { return 'niepoprawny JSON responseType'; }
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return 'niepoprawny obiekt responseType';
        for (const k of Object.keys(obj)) {
          if (k === 'headers') { if (!trusted) return 'nagłówki odpowiedzi wymagają zaufanego scriptletu'; continue; }
          if (!['ok', 'status', 'statusText', 'type'].includes(k)) return `nieobsługiwana właściwość odpowiedzi "${k}"`;
        }
        return vPropsToMatch(props) || contentDirectiveError(body, trusted);
      }
      if (!['basic', 'cors', 'default', 'error', 'opaque'].includes(type)) return `nieznany typ odpowiedzi "${type}"`;
    }
    return vPropsToMatch(props) || contentDirectiveError(body, trusted);
  };
}
spec('prevent-fetch', { validate: preventFetchValidate(false) });
spec('trusted-prevent-fetch', { trusted: true, validate: preventFetchValidate(true) });
function preventXhrValidate(trusted) {
  return (a) => {
    const [props = '', directive = ''] = a;
    if (a.length > 2) return 'nadmiarowe argumenty';
    if (props === '' && directive === '') return 'tryb logowania – bez efektu';
    return vPropsToMatch(props) || contentDirectiveError(directive, trusted);
  };
}
spec('prevent-xhr', { validate: preventXhrValidate(false) });
spec('trusted-prevent-xhr', { trusted: true, validate: preventXhrValidate(true) });

const BEHAVIOR_RA = ['asap', 'stay', 'loading', 'interactive', 'end', 'complete', 'idle', '2', '3', ''];
spec('remove-attr', {
  validate(a) {
    const [tokens = '', , behavior = '', ...rest] = a;
    if (!tokens) return 'brak atrybutów';
    for (const t of behavior.split(/\s+/)) if (!BEHAVIOR_RA.includes(t)) return `nieznane zachowanie "${t}"`;
    return parseVarargs(rest, { quitAfter: vInt }).error || null;
  },
});
spec('remove-class', {
  validate(a) {
    const [tokens = '', , behavior = ''] = a;
    if (!tokens) return 'brak klas';
    if (a.length > 3) return 'nadmiarowe argumenty';
    for (const t of behavior.split(/\s+/)) if (!['', 'stay', 'complete'].includes(t)) return `nieznane zachowanie "${t}"`;
    return null;
  },
});
spec('set-attr', {
  validate(a) {
    const [selector = '', attr = '', value = '', ...rest] = a;
    if (!selector || !attr) return 'brak selektora lub atrybutu';
    if (!['', 'false', 'true'].includes(value.toLowerCase())) {
      if (/^\d+$/.test(value)) { if (parseInt(value, 10) >= 32768) return 'liczba poza zakresem'; }
      else if (!/^\[.+\]$/.test(value)) return `wartość "${value}" nie jest obsługiwana`;
    }
    return parseVarargs(rest, { runAt: vRunAt }).error || null;
  },
});
spec('trusted-set-attr', {
  trusted: true,
  validate(a) {
    const [selector = '', attr = '', , ...rest] = a;
    if (!selector || !attr) return 'brak selektora lub atrybutu';
    return parseVarargs(rest, { runAt: vRunAt }).error || null;
  },
});
const NODE_TEXT_VARARGS = { includes: vPattern, condition: vPattern, excludes: vPattern, sedCount: vInt, stay: vAny, quitAfter: vInt };
spec('remove-node-text', {
  validate(a) {
    const [nodeName = '', includes = '', ...rest] = a;
    if (!nodeName) return 'brak nazwy węzła';
    const v = parseVarargs(rest, NODE_TEXT_VARARGS);
    if (v.error) return v.error;
    if (v.values.includes !== undefined || v.values.condition !== undefined) return 'parametr includes/condition koliduje z argumentem pozycyjnym';
    return badPattern(nodeName) || badPattern(includes);
  },
});
spec('trusted-replace-node-text', {
  trusted: true,
  validate(a) {
    // Brak tekstu zastępującego = pusty tekst (jak w uBO).
    const [nodeName = '', pattern = '', , ...rest] = a;
    if (!nodeName) return 'brak nazwy węzła';
    const v = parseVarargs(rest, NODE_TEXT_VARARGS);
    if (v.error) return v.error;
    return badPattern(nodeName) || badPattern(pattern);
  },
});
spec('json-prune', { validate: (a) => pruneArgsError(a, { positionalStack: true }) });
spec('json-prune-fetch-response', { validate: (a) => pruneArgsError(a, { positionalStack: false }) });
spec('json-prune-xhr-response', { validate: (a) => pruneArgsError(a, { positionalStack: false }) });
for (const n of ['trusted-replace-fetch-response', 'trusted-replace-xhr-response']) {
  spec(n, {
    trusted: true,
    validate(a) {
      const [pattern = '', , props = '', ...rest] = a;
      if (pattern === '') return 'pusty wzorzec – bez efektu';
      if (pattern === '*') return 'wzorzec "*" ma w uBO niejednoznaczną semantykę';
      const v = parseVarargs(rest, { includes: vPattern });
      return v.error || badPattern(pattern) || vPropsToMatch(props) || null;
    },
  });
}
for (const [n, trusted] of [['json-edit', false], ['trusted-json-edit', true]]) {
  spec(n, {
    trusted,
    validate(a) {
      const [q = '', ...rest] = a;
      return jsonPathError(q, trusted) || parseVarargs(rest, { matches: vPattern }).error || null;
    },
  });
}
for (const [n, trusted] of [['json-edit-fetch-response', false], ['trusted-json-edit-fetch-response', true],
  ['json-edit-xhr-response', false], ['trusted-json-edit-xhr-response', true]]) {
  spec(n, {
    trusted,
    validate(a) {
      const [q = '', ...rest] = a;
      return jsonPathError(q, trusted) || parseVarargs(rest, { propsToMatch: vPropsToMatch }).error || null;
    },
  });
}
for (const [n, trusted] of [['edit-inbound-object', false], ['trusted-edit-inbound-object', true]]) {
  spec(n, {
    trusted,
    validate(a) {
      const [chain = '', pos = '', q = ''] = a;
      if (a.length > 3) return 'nadmiarowe argumenty';
      if (!chain) return 'brak metody';
      if (!/^-?\d+$/.test(pos)) return `niepoprawna pozycja argumentu "${pos}"`;
      return vChain(chain) || jsonPathError(q, trusted);
    },
  });
}
spec('trusted-prevent-dom-bypass', {
  trusted: true,
  validate(a) {
    const [method = '', target = ''] = a;
    if (a.length > 2) return 'nadmiarowe argumenty';
    if (!method) return 'brak metody';
    return vChain(method) || (target ? vChain(target) : null);
  },
});
const COOKIE_PATH = (p) => (['', '/', 'none'].includes(p) ? null : `ścieżka "${p}" nie jest obsługiwana`);
spec('set-cookie', {
  validate(a) {
    const [name = '', value = '', path = '', ...rest] = a;
    if (!name) return 'brak nazwy';
    if (!safeCookieValue(value)) return `wartość "${value}" nie jest dozwolona`;
    return COOKIE_PATH(path) || parseVarargs(rest, { dontOverwrite: vAny, reload: vAny }).error || null;
  },
});
spec('set-cookie-reload', {
  validate(a) {
    const [name = '', value = '', path = ''] = a;
    if (a.length > 3) return 'nadmiarowe argumenty';
    if (!name) return 'brak nazwy';
    if (!safeCookieValue(value)) return `wartość "${value}" nie jest dozwolona`;
    return COOKIE_PATH(path);
  },
});
for (const n of ['trusted-set-cookie', 'trusted-set-cookie-reload']) {
  spec(n, {
    trusted: true,
    validate(a) {
      const [name = '', , offset = '', path = '', ...rest] = a;
      if (!name) return 'brak nazwy';
      if (offset !== '' && offset !== '1day' && offset !== '1year' && !/^\d+$/.test(offset)) return `niepoprawny czas "${offset}"`;
      if (n.endsWith('-reload') && rest.length) return 'nadmiarowe argumenty';
      return COOKIE_PATH(path) || parseVarargs(rest, { domain: vAny, dontOverwrite: vAny, reload: vAny }).error || null;
    },
  });
}
spec('remove-cookie', {
  validate(a) {
    const [needle = '', ...rest] = a;
    const v = parseVarargs(rest, { domain: vAny, when: vAny });
    return v.error || badPattern(needle);
  },
});
for (const n of ['set-local-storage-item', 'set-session-storage-item']) {
  spec(n, {
    validate(a) {
      const [key = '', value = '', ...rest] = a;
      if (!key) return 'brak klucza';
      if (!safeStorageValue(value)) return `wartość "${value}" nie jest dozwolona`;
      return parseVarargs(rest, { reload: vInt }).error || null;
    },
  });
}
for (const n of ['trusted-set-local-storage-item', 'trusted-set-session-storage-item']) {
  spec(n, {
    trusted: true,
    validate(a) {
      const [key = '', , ...rest] = a;
      if (!key) return 'brak klucza';
      return parseVarargs(rest, { reload: vInt }).error || null;
    },
  });
}
spec('noeval', { validate: (a) => (a.length ? 'nadmiarowe argumenty' : null) });
spec('noeval-silent', { validate: (a) => (a.length ? 'nadmiarowe argumenty' : null) });
spec('noeval-if', {
  validate(a) {
    if (a.length > 1) return 'nadmiarowe argumenty';
    if (!a[0]) return 'tryb logowania – bez efektu';
    return badPattern(a[0]);
  },
});
spec('nowebrtc', { validate: (a) => (a.length ? 'nadmiarowe argumenty' : null) });
spec('trusted-click-element', {
  trusted: true,
  validate(a) {
    const [selectors = '', extraMatch = '', delay = ''] = a;
    if (a.length > 3) return 'nadmiarowe argumenty';
    if (!selectors) return 'brak selektorów';
    // opóźnienie: jak w uBO parseInt(delay) || 1
    if (selectors.includes('>>>')) return 'selektory w zamkniętym shadow DOM (>>>) nie są obsługiwane';
    if (extraMatch) {
      for (const cond of extraMatch.split(',')) {
        const pos = cond.indexOf(':');
        const type = (pos === -1 ? cond : cond.slice(0, pos)).trim().replace(/^!/, '');
        if (type === 'localStorage') return 'warunek localStorage: ma w uBO niejednoznaczną semantykę (nieobsługiwany)';
        if (type !== 'cookie') return `nieznany warunek "${type}"`;
        const val = pos === -1 ? '' : cond.slice(pos + 1).trim();
        const m = /^\/(.+)\/(i?)$/.exec(val);
        if (m) { try { new RegExp(m[1], m[2] || undefined); } catch { return 'niepoprawny regex warunku'; } }
      }
    }
    return null;
  },
});

export const SCRIPTLET_SPECS = S;

/** Lista nazw kanonicznych zaimplementowanych w ChromeBlock. */
export function implementedScriptlets() {
  return Object.values(S).filter((s) => s.implemented !== false).map((s) => s.name);
}

/**
 * Analizuje wywołanie scriptletu.
 * @param {string} rawName nazwa z filtra (może być aliasem, z ".js")
 * @param {string[]} args argumenty
 * @param {{trusted?: boolean}} ctx czy filtr pochodzi z zaufanej listy
 * @returns {{status:'supported'|'partial'|'unsupported', name:string, canonical:string|null, reason:string}}
 */
export function analyzeScriptlet(rawName, args, ctx = {}) {
  const name = String(rawName || '').trim().replace(/\.js$/, '');
  const canonical = canonicalScriptletName(name);
  if (!canonical) {
    return { status: 'unsupported', name, canonical: null, reason: 'brak implementacji w ChromeBlock' };
  }
  const s = S[canonical];
  if (s.implemented === false) {
    return { status: 'unsupported', name, canonical, reason: s.reason || 'brak implementacji w ChromeBlock' };
  }
  if (s.trusted && !ctx.trusted) {
    return { status: 'unsupported', name, canonical, reason: 'scriptlet zaufany użyty w niezaufanej liście' };
  }
  const err = s.validate ? s.validate(args.map(String)) : null;
  if (err) return { status: 'partial', name, canonical, reason: err };
  return { status: 'supported', name, canonical, reason: '' };
}

/**
 * Dzieli wnętrze "+js(...)" na nazwę i argumenty – zgodnie z zasadami list uBO:
 *  - argument może być ujęty w cudzysłów ", ' albo ` (wtedy przecinki w środku są tekstem),
 *  - w argumencie bez cudzysłowu przecinek poprzedzony "\" jest tekstem,
 *  - białe znaki na brzegach argumentów są usuwane, puste argumenty na końcu pomijane.
 */
export function splitScriptletArgs(inner) {
  const s = String(inner);
  const len = s.length;
  const out = [];
  const oddEscapes = (idx) => { let n = 0; for (let k = idx - 1; k >= 0 && s[k] === '\\'; k--) n++; return n % 2 === 1; };
  const findSep = (ch, from) => {
    let p = from;
    let escaped = false;
    for (;;) {
      const i = s.indexOf(ch, p);
      if (i === -1) return { end: len, escaped };
      if (!oddEscapes(i)) return { end: i, escaped };
      escaped = true;
      p = i + 1;
    }
  };
  const unescape = (arg, ch) => arg.replace(new RegExp('(\\\\+)' + ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    (m, bs) => (bs.length % 2 ? bs.slice(0, -1) : bs) + ch);
  let pos = 0;
  for (;;) {
    let start = pos;
    while (start < len && /\s/.test(s[start])) start++;
    const q = s[start];
    if (q === '"' || q === "'" || q === '`') {
      const { end, escaped } = findSep(q, start + 1);
      if (end !== len) {
        let after = end + 1;
        while (after < len && /\s/.test(s[after])) after++;
        if (after === len || s[after] === ',') {
          const raw = s.slice(start + 1, end);
          out.push(escaped ? unescape(raw, q) : raw);
          if (after === len) break;
          pos = after + 1;
          continue;
        }
      }
    }
    const { end, escaped } = findSep(',', start);
    const raw = s.slice(start, end).replace(/\s+$/, '');
    out.push(escaped ? unescape(raw, ',') : raw);
    if (end >= len) break;
    pos = end + 1;
  }
  while (out.length > 1 && out[out.length - 1] === '') out.pop();
  return out;
}
