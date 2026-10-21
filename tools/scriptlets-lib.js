// ChromeBlock – biblioteka scriptletów (implementacja własna).
//
// Wklejana przez tools/build.mjs do scriptlets/<lista>-<n>.js i uruchamiana
// w świecie MAIN strony na document_start. Wszystko jest zamknięte w IIFE.
//
// Każdy scriptlet ma odtwarzać semantykę, której oczekują filtry list uBO.
// Które warianty argumentów są obsługiwane, decyduje shared/scriptlet-specs.js
// (filtry z nieobsługiwanymi wariantami w ogóle nie trafiają do tego pliku).
//
// Przed tym kodem build wkleja klasę ChromeBlockJSONPath (shared/jsonpath.js).

const win = window;
const doc = document;
const nativeFnToString = Function.prototype.toString;
const NativeRegExp = RegExp;
const reflectApply = Reflect.apply;
const defineProperty = Object.defineProperty;
const getOwnDesc = Object.getOwnPropertyDescriptor;
const textContentGetter = getOwnDesc(Node.prototype, 'textContent').get;
// Natywne JSON.parse/JSON.stringify przechwycone RAZ, zanim jakikolwiek scriptlet je opakuje
// (jak „safe” w uBO). Kod scriptletów używa ich wewnętrznie. Wcześniej każdy kolejny wrapper
// (np. 6× trusted-edit-inbound-object na JSON.stringify na YouTube) klonował argument przez
// już opakowaną funkcję, więc koszt jednego wywołania rósł jak 2^n.
const nativeJSONParse = JSON.parse;
const nativeJSONStringify = JSON.stringify;

// --------------------------------------------------------------------------
// Profiler scriptletów (Opcje → Diagnostyka → Pomiary wydajności; domyślnie WYŁĄCZONY).
// Flagę ustawia content/scriptlet-perf-on.js, który service worker rejestruje przed plikami
// scriptletów TYLKO przy włączonych pomiarach. Flaga jest sprawdzana raz, tutaj: przy
// wyłączonym profilerze żaden wrapper nie jest owijany pomiarem (te same ścieżki kodu).
// Zbierane wyłącznie: nazwa scriptletu, przechwycona funkcja, liczba wywołań i czasy (ms).
// Mierzony jest czas własny ChromeBlock – bez czasu oryginalnej funkcji strony.
const PERF_EVENT = 'chromeblock:scriptlet-perf';
const perf = (() => {
  let on = false;
  try { on = win[Symbol.for('chromeblock.scriptletPerf')] === true; } catch { /* */ }
  if (!on) return null;
  const now = performance.now.bind(performance);
  const nativeSetTimeout = win.setTimeout.bind(win);
  const NativeCustomEvent = win.CustomEvent;
  const dispatch = EventTarget.prototype.dispatchEvent;
  const stats = new Map();
  let timer = 0;
  const flush = () => {
    timer = 0;
    if (stats.size === 0) return;
    const rows = [];
    for (const [label, st] of stats) rows.push([label, st.count, st.total, st.max]);
    stats.clear();
    try {
      reflectApply(dispatch, doc, [new NativeCustomEvent(PERF_EVENT, { detail: nativeJSONStringify({ v: 1, rows }) })]);
    } catch { /* */ }
  };
  try { win.addEventListener('pagehide', flush, true); } catch { /* */ }
  return {
    now,
    record(label, ms) {
      let st = stats.get(label);
      if (!st) { st = { count: 0, total: 0, max: 0 }; stats.set(label, st); }
      st.count++;
      st.total += ms;
      if (ms > st.max) st.max = ms;
      if (!timer) timer = nativeSetTimeout(flush, 2000);
    },
  };
})();
let currentScriptlet = '';
const perfLabel = (target) => `${currentScriptlet} · ${target}`;
/** Przy włączonym profilerze mierzy wywołania fn; przy wyłączonym zwraca fn bez zmian. */
function perfWrap(label, fn) {
  if (perf === null) return fn;
  return function (...args) {
    const t0 = perf.now();
    try { return reflectApply(fn, this, args); } finally { perf.record(label, perf.now() - t0); }
  };
}
/** Pułapka apply dla Proxy: przy profilerze mierzy czas własny (bez czasu oryginalnej funkcji). */
function makeApplyTrap(label, run) {
  if (perf === null) return (target, thisArg, args) => run(target, thisArg, args, () => reflectApply(target, thisArg, args));
  return (target, thisArg, args) => {
    let inner = 0;
    const reflect = () => {
      const t = perf.now();
      try { return reflectApply(target, thisArg, args); } finally { inner += perf.now() - t; }
    };
    const t0 = perf.now();
    try { return run(target, thisArg, args, reflect); } finally { perf.record(label, perf.now() - t0 - inner); }
  };
}
const exceptionToken = 'cb' + Math.random().toString(36).slice(2);

// Wyjątki rzucane celowo przez scriptlety nie są zgłaszane jako błędy strony.
(() => {
  const previous = win.onerror;
  win.onerror = function (msg, ...rest) {
    if (typeof msg === 'string' && msg.includes(exceptionToken)) return true;
    if (previous instanceof Function) return previous.call(this, msg, ...rest);
    return undefined;
  };
})();

function fnToString(fn) {
  try { return nativeFnToString.call(fn); } catch { return ''; }
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** "/re/flagi" → RegExp (flagi z argumentu ignorowane), tekst → RegExp dosłowny. */
function patternToRegex(pattern, flags, verbatim = false) {
  if (pattern === undefined || pattern === '') return /^/;
  const m = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
  if (m === null) {
    const re = escapeRe(pattern);
    return new NativeRegExp(verbatim ? `^${re}$` : re, flags);
  }
  try { return new NativeRegExp(m[1], m[2] || undefined); } catch { return /(?!)/; }
}

/** Wzorzec z opcjonalną negacją "!" i trybem "dopasuj wszystko" dla pustego. */
function initPattern(pattern, { canNegate = false, flags } = {}) {
  if (pattern === undefined || pattern === '') return { matchAll: true, expect: true };
  let p = pattern;
  const expect = !(canNegate && p.startsWith('!'));
  if (!expect) p = p.slice(1);
  const m = /^\/(.+)\/([gimsu]*)$/.exec(p);
  if (m) {
    try { return { re: new NativeRegExp(m[1], m[2] || flags), expect }; } catch { return { re: /(?!)/, expect }; }
  }
  if (flags !== undefined) return { re: new NativeRegExp(escapeRe(p), flags), expect };
  return { text: p, expect };
}

function testPattern(details, haystack) {
  if (details.matchAll) return true;
  if (details.re) return details.re.test(haystack) === details.expect;
  return haystack.includes(details.text) === details.expect;
}

/** Varargi "nazwa, wartość, ..." → obiekt; wartości liczbowe są zamieniane na liczby. */
function parseVarargs(arr) {
  const out = {};
  for (let i = 0; i + 1 < arr.length; i += 2) {
    const v = arr[i + 1];
    out[arr[i]] = /^\d+$/.test(v) ? parseInt(v, 10) : v;
  }
  return out;
}

const READY_STATE = { loading: 1, asap: 1, interactive: 2, end: 2, 2: 2, complete: 3, idle: 3, 3: 3 };
function readyLevel(tokens) {
  for (const t of (Array.isArray(tokens) ? tokens : [tokens])) {
    const k = `${t}`;
    if (Object.prototype.hasOwnProperty.call(READY_STATE, k)) return READY_STATE[k];
  }
  return 0;
}

/** Uruchom fn, gdy dokument osiągnie wskazany stan (domyślnie od razu). */
function runAt(fn, when) {
  const target = readyLevel(when);
  if (readyLevel(doc.readyState) >= target) { fn(); return; }
  const onChange = () => {
    if (readyLevel(doc.readyState) < target) return;
    doc.removeEventListener('readystatechange', onChange, true);
    fn();
  };
  doc.addEventListener('readystatechange', onChange, true);
}

function runAtHtmlElement(fn) {
  if (doc.documentElement) { fn(); return; }
  const mo = new MutationObserver(() => { mo.disconnect(); fn(); });
  mo.observe(doc, { childList: true });
}

function onIdle(fn, options) {
  if (win.requestIdleCallback) return win.requestIdleCallback(fn, options);
  return win.requestAnimationFrame(fn);
}

/** Zastępuje metodę wskazaną łańcuchem ("Node.prototype.appendChild") pośrednikiem. */
function proxyApply(chain, handler) {
  let context = globalThis;
  let prop = chain;
  for (;;) {
    const pos = prop.indexOf('.');
    if (pos === -1) break;
    context = context[prop.slice(0, pos)];
    if (!(context instanceof Object)) return;
    prop = prop.slice(pos + 1);
  }
  const fn = context[prop];
  if (typeof fn !== 'function') return;
  if (perf === null) {
    context[prop] = new Proxy(fn, {
      apply(target, thisArg, args) {
        return handler({
          thisArg,
          callArgs: args,
          reflect: () => reflectApply(target, thisArg, args),
        });
      },
    });
    return;
  }
  const trap = makeApplyTrap(perfLabel(chain), (target, thisArg, args, reflect) => handler({ thisArg, callArgs: args, reflect }));
  context[prop] = new Proxy(fn, { apply: trap });
}

// --------------------------------------------------------------------------
// Dopasowanie właściwości żądań (propsToMatch)

function parsePropsToMatch(propsToMatch, implicit = '') {
  const needles = new Map();
  if (propsToMatch === undefined || propsToMatch === '') return needles;
  for (const needle of String(propsToMatch).split(/\s+/)) {
    let [prop, pattern] = needle.split(':');
    if (prop === '') continue;
    if (pattern !== undefined && /[^$\w -]/.test(prop)) {
      prop = `${prop}:${pattern}`;
      pattern = undefined;
    }
    if (pattern !== undefined) needles.set(prop, initPattern(pattern, { canNegate: true }));
    else if (implicit !== '') needles.set(implicit, initPattern(prop, { canNegate: true }));
  }
  return needles;
}

/**
 * Zwraca listę dopasowanych właściwości albo undefined, gdy któraś nie pasuje.
 * Właściwości nieobecne w obiekcie są pomijane (jak w uBO).
 */
function matchObjectProps(needles, ...objs) {
  const matched = [];
  for (const obj of objs) {
    if (!(obj instanceof Object)) continue;
    for (const [prop, details] of needles) {
      let value = obj[prop];
      if (value === undefined) continue;
      if (typeof value !== 'string') {
        try { value = nativeJSONStringify(value); } catch { /* */ }
        if (typeof value !== 'string') continue;
      }
      if (!testPattern(details, value)) return undefined;
      matched.push(prop);
    }
  }
  return matched;
}

const FETCH_PROPS = ['body', 'cache', 'credentials', 'duplex', 'headers', 'integrity', 'keepalive',
  'method', 'mode', 'priority', 'redirect', 'referrer', 'referrerPolicy', 'url'];

function collateFetchArgs(resource, options) {
  const out = {};
  const copy = (src) => { for (const p of FETCH_PROPS) if (src[p] !== undefined) out[p] = src[p]; };
  if (typeof resource !== 'object' || Object.prototype.toString.call(resource) !== '[object Request]') {
    out.url = `${resource}`;
  } else {
    let clone;
    try { clone = resource.clone(); } catch { /* */ }
    copy(clone || resource);
  }
  if (typeof options === 'object' && options !== null) copy(options);
  return out;
}

function respondLike(before, body) {
  const after = new Response(body, { status: before.status, statusText: before.statusText, headers: before.headers });
  try {
    Object.defineProperties(after, {
      ok: { value: before.ok },
      redirected: { value: before.redirected },
      type: { value: before.type },
      url: { value: before.url },
    });
  } catch { /* */ }
  return after;
}

function randomText(len) {
  const chunks = [];
  let size = 0;
  do { const s = Math.random().toString(36).slice(2); chunks.push(s); size += s.length; } while (size < len);
  return chunks.join(' ').slice(0, len);
}

/** Treść zastępcza dla prevent-fetch/prevent-xhr. */
function generateContent(trusted, directive) {
  if (directive === 'true') return randomText(10);
  if (directive === 'emptyObj') return '{}';
  if (directive === 'emptyArr') return '[]';
  if (directive === 'emptyStr') return '';
  if (directive.startsWith('length:')) {
    const m = /^length:(\d+)(?:-(\d+))?$/.exec(directive);
    if (!m) return '';
    const min = parseInt(m[1], 10);
    const extent = Math.max(parseInt(m[2], 10) || 0, min) - min;
    return randomText(Math.min(min + extent * Math.random(), 500000) | 0);
  }
  return trusted ? directive : '';
}

// --------------------------------------------------------------------------
// Przycinanie obiektów (json-prune i pochodne)

/**
 * Szuka ścieżki "a.b.c" (z tokenami [] {} * [-] {-}) w obiekcie.
 * prune=false: czy ścieżka istnieje; prune=true: usuwa wskazane właściwości.
 */
function findOwner(root, path, prune = false) {
  let owner = root;
  let chain = path;
  for (;;) {
    if (typeof owner !== 'object' || owner === null) return false;
    const pos = chain.indexOf('.');
    if (pos === -1) {
      if (!prune) return Object.prototype.hasOwnProperty.call(owner, chain);
      let modified = false;
      if (chain === '*') {
        for (const key in owner) {
          if (!Object.prototype.hasOwnProperty.call(owner, key)) continue;
          delete owner[key];
          modified = true;
        }
      } else if (Object.prototype.hasOwnProperty.call(owner, chain)) {
        delete owner[chain];
        modified = true;
      }
      return modified;
    }
    const prop = chain.slice(0, pos);
    const next = chain.slice(pos + 1);
    let found = false;
    if (prop === '[-]' && Array.isArray(owner)) {
      for (let i = owner.length - 1; i >= 0; i--) {
        if (findOwner(owner[i], next) === false) continue;
        owner.splice(i, 1);
        found = true;
      }
      return found;
    }
    if (prop === '{-}' && owner instanceof Object) {
      for (const key of Object.keys(owner)) {
        if (findOwner(owner[key], next) === false) continue;
        delete owner[key];
        found = true;
      }
      return found;
    }
    if ((prop === '[]' && Array.isArray(owner)) || ((prop === '{}' || prop === '*') && owner instanceof Object)) {
      for (const key of Object.keys(owner)) {
        if (findOwner(owner[key], next, prune) === false) continue;
        found = true;
      }
      return found;
    }
    if (!Object.prototype.hasOwnProperty.call(owner, prop)) return false;
    owner = owner[prop];
    chain = next;
  }
}

/** Zwraca obiekt, gdy coś usunięto, w przeciwnym razie undefined. */
function pruneObject(obj, rawPrune, rawNeedle) {
  if (typeof rawPrune !== 'string' || rawPrune === '') return undefined;
  const prunePaths = rawPrune.split(/ +/);
  const needlePaths = rawNeedle ? rawNeedle.split(/ +/) : [];
  for (const p of needlePaths) if (findOwner(obj, p) === false) return undefined;
  let matched = false;
  for (const p of prunePaths) if (findOwner(obj, p, true)) matched = true;
  return matched ? obj : undefined;
}

// --------------------------------------------------------------------------
// Pułapki na właściwości

/** Pułapka z obsługą wielu procedur (jak przy kilku filtrach acs na tej samej właściwości). */
const trapDb = new WeakMap();
function trapProperty(chain, handler, options = {}) {
  let owner = win;
  let prop = chain;
  for (;;) {
    const pos = prop.indexOf('.');
    if (pos === -1) break;
    owner = owner[prop.slice(0, pos)];
    if (!(owner instanceof Object)) return undefined;
    prop = prop.slice(pos + 1);
  }
  let handlers = trapDb.get(owner);
  if (!handlers) { handlers = new Map(); trapDb.set(owner, handlers); }
  let entry = handlers.get(prop);
  if (entry) { entry.stack.push(handler); return entry.value; }
  entry = { value: owner[prop], stack: [handler], canThrow: !!options.canThrow };
  handlers.set(prop, entry);
  const desc = getOwnDesc(owner, prop);
  if (desc instanceof Object && (desc.get || desc.set)) entry.stack.push(desc);
  try {
    defineProperty(owner, prop, {
      get() {
        let r = entry.value;
        for (const d of entry.stack) {
          try { r = d.get(); } catch (e) { if (entry.canThrow) throw e; }
        }
        return r;
      },
      set(value) {
        entry.value = value;
        for (const d of entry.stack) {
          try { d.set(value); } catch (e) { if (entry.canThrow) throw e; }
        }
      },
    });
  } catch { /* */ }
  return entry.value;
}

function validateConstant(trusted, raw, extra) {
  let value;
  let ok = true;
  if (raw === 'undefined') value = undefined;
  else if (raw === 'false') value = false;
  else if (raw === 'true') value = true;
  else if (raw === 'null') value = null;
  else if (raw === "''" || raw === '') value = '';
  else if (raw === '[]' || raw === 'emptyArr') value = [];
  else if (raw === '{}' || raw === 'emptyObj') value = {};
  else if (raw === 'noopFunc') value = function () {};
  else if (raw === 'trueFunc') value = function () { return true; };
  else if (raw === 'falseFunc') value = function () { return false; };
  else if (raw === 'throwFunc') value = function () { throw ''; };
  else if (/^-?\d+$/.test(raw)) {
    value = parseInt(raw, 10);
    if (Math.abs(value) > 0x7FFF) ok = false;
  } else if (trusted && raw.startsWith('json:')) {
    try { value = JSON.parse(raw.slice(5)); } catch { ok = false; }
  } else if (trusted && raw.startsWith('{') && raw.endsWith('}')) {
    try { value = JSON.parse(raw).value; } catch { ok = false; }
  } else ok = false;
  if (!ok) return { ok: false };
  if (extra.as === 'function') return { ok, value: () => value };
  if (extra.as === 'callback') return { ok, value: () => (() => value) };
  if (extra.as === 'resolved') return { ok, value: Promise.resolve(value) };
  if (extra.as === 'rejected') return { ok, value: Promise.reject(value) };
  return { ok, value };
}

function setConstantImpl(trusted, chain = '', rawValue = '', ...varargs) {
  if (chain === '') return;
  const extra = parseVarargs(varargs);
  runAt(() => {
    const checked = validateConstant(trusted, rawValue, extra);
    if (!checked.ok) return;
    let normalValue = checked.value;
    // Odczyty z kodu samego scriptletu (nigdy nie zachodzą w ChromeBlock) – wartownik.
    const thisScript = doc.currentScript || {};
    let aborted = false;
    // Wersja niezaufana: jeśli strona przypisze wartość innego typu, pułapka się wycofuje.
    const mustAbort = (v) => {
      if (trusted) return false;
      if (aborted) return true;
      aborted = v !== undefined && v !== null && normalValue !== undefined && normalValue !== null
        && typeof v !== typeof normalValue;
      return aborted;
    };
    const trapProp = (owner, prop, configurable, handler) => {
      if (handler.init(configurable ? owner[prop] : normalValue) === false) return;
      const odesc = getOwnDesc(owner, prop);
      let prevGetter;
      let prevSetter;
      if (odesc instanceof Object) {
        try { owner[prop] = normalValue; } catch { /* */ }
        if (odesc.get instanceof Function) prevGetter = odesc.get;
        if (odesc.set instanceof Function) prevSetter = odesc.set;
      }
      try {
        defineProperty(owner, prop, {
          configurable,
          get() { if (prevGetter !== undefined) prevGetter(); return handler.getter(); },
          set(a) { if (prevSetter !== undefined) prevSetter(a); handler.setter(a); },
        });
      } catch { /* */ }
    };
    const trapChain = (owner, path) => {
      const pos = path.indexOf('.');
      if (pos === -1) {
        trapProp(owner, path, false, {
          v: undefined,
          init(v) { if (mustAbort(v)) return false; this.v = v; return true; },
          getter() { return doc.currentScript === thisScript ? this.v : normalValue; },
          setter(a) { if (mustAbort(a) === false) return; normalValue = a; },
        });
        return;
      }
      const prop = path.slice(0, pos);
      const rest = path.slice(pos + 1);
      const v = owner[prop];
      if (v instanceof Object || (typeof v === 'object' && v !== null)) { trapChain(v, rest); return; }
      trapProp(owner, prop, true, {
        v: undefined,
        init(x) { this.v = x; return true; },
        getter() { return this.v; },
        setter(a) { this.v = a; if (a instanceof Object) trapChain(a, rest); },
      });
    };
    trapChain(win, chain);
  }, extra.runAt);
}

// --------------------------------------------------------------------------
// Tekst węzłów DOM

function replaceNodeTextImpl(nodeName = '', pattern = '', replacement = '', ...varargs) {
  const reNodeName = patternToRegex(nodeName, 'i', true);
  const rePattern = patternToRegex(pattern, 'gms');
  const extra = parseVarargs(varargs);
  const reIncludes = extra.includes || extra.condition
    ? patternToRegex(extra.includes || extra.condition, 'ms') : null;
  const reExcludes = extra.excludes ? patternToRegex(extra.excludes, 'ms') : null;
  // Trusted Types: tekst skryptu musi przejść przez politykę, gdy strona ją wymusza.
  const textFactory = (() => {
    const plain = { createScript: (s) => s };
    const tt = win.trustedTypes;
    try {
      if (tt instanceof Object && typeof tt.getPropertyType === 'function'
          && tt.getPropertyType('script', 'textContent') === 'TrustedScript') {
        return tt.createPolicy('chromeblock-' + Math.random().toString(36).slice(2), plain);
      }
    } catch { /* */ }
    return plain;
  })();
  let sedCount = extra.sedCount !== undefined ? extra.sedCount : Number.MAX_SAFE_INTEGER;
  const handleNode = (node) => {
    const before = textContentGetter.call(node);
    if (reIncludes) { reIncludes.lastIndex = 0; if (!reIncludes.test(before)) return; }
    if (reExcludes) { reExcludes.lastIndex = 0; if (reExcludes.test(before)) return; }
    rePattern.lastIndex = 0;
    if (!rePattern.test(before)) return;
    rePattern.lastIndex = 0;
    const after = pattern !== '' ? before.replace(rePattern, replacement) : replacement;
    node.textContent = node.nodeName === 'SCRIPT' ? textFactory.createScript(after) : after;
    sedCount -= 1;
  };
  const handleTree = (root) => {
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    const { currentScript } = doc;
    for (;;) {
      const node = walker.nextNode();
      if (node === null) break;
      if (node === currentScript) continue;
      if (reNodeName.test(node.nodeName)) handleNode(node);
      else if (node.nodeName === 'TEMPLATE') handleTree(node.content);
      else continue;
      if (sedCount === 0) break;
    }
  };
  if (doc.documentElement) handleTree(doc.documentElement);
  const stay = Boolean(extra.stay);
  if (sedCount === 0 && !stay) return;
  let observer;
  const handleMutations = (mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (reNodeName.test(node.nodeName)) handleNode(node);
        else if (node.nodeName === 'TEMPLATE') handleTree(node.content);
        else continue;
        if (sedCount === 0) { stop(false); return; }
      }
    }
  };
  const stop = (takeRecords = true) => {
    const pending = takeRecords ? observer.takeRecords() : [];
    observer.disconnect();
    handleMutations(pending);
  };
  observer = new MutationObserver(perfWrap(perfLabel('MutationObserver'), handleMutations));
  observer.observe(doc, { childList: true, subtree: true });
  if (stay) return;
  runAt(() => {
    const quitAfter = extra.quitAfter || 0;
    if (quitAfter === 0) { stop(); return; }
    setTimeout(() => stop(), quitAfter);
  }, 'interactive');
}

// --------------------------------------------------------------------------
// Ciasteczka i pamięć

function getCookie(name) {
  for (const s of doc.cookie.split(/\s*;\s*/)) {
    const pos = s.indexOf('=');
    if (pos === -1) continue;
    if (s.slice(0, pos) !== name) continue;
    return s.slice(pos + 1).trim();
  }
  return undefined;
}

function setCookieImpl(trusted, name = '', value = '', expires = '', path = '', options = {}) {
  let n = name;
  let v = value;
  if (!trusted && /[^!#$%&'*+\-.0-9A-Z[\]^_`a-z|~]/.test(n)) n = encodeURIComponent(n);
  if (/[^ -:<-[\]-~]/.test(v)) v = encodeURIComponent(v);
  const before = getCookie(n);
  if (before !== undefined && options.dontOverwrite) return false;
  if (before === v && options.reload) return false;
  const parts = [n, '=', v];
  if (expires !== '') parts.push('; expires=', expires);
  let p = path;
  if (p === '') p = '/';
  else if (p === 'none') p = '';
  if (p !== '' && p !== '/') return false;
  if (p === '/') parts.push('; path=/');
  if (trusted) {
    if (options.domain) {
      let domain = options.domain;
      if (/^\/.+\//.test(domain)) {
        const m = new NativeRegExp(domain.slice(1, -1)).exec(new URL(doc.baseURI).hostname);
        domain = m ? m[0] : undefined;
      }
      if (domain) parts.push(`; domain=${domain}`);
    }
    parts.push('; Secure');
  } else if (/^__(Host|Secure)-/.test(n)) {
    parts.push('; Secure');
  }
  try { doc.cookie = parts.join(''); } catch { /* */ }
  const done = getCookie(n) === v;
  if (done && options.reload) win.location.reload();
  return done;
}

function setStorageImpl(which, trusted, key = '', value = '', options = {}) {
  if (key === '') return;
  let v = value;
  if (v === 'emptyArr') v = '[]';
  else if (v === 'emptyObj') v = '{}';
  if (trusted) {
    if (v.includes('$now$')) v = v.replaceAll('$now$', Date.now());
    if (v.includes('$currentDate$')) v = v.replaceAll('$currentDate$', `${Date()}`);
    if (v.includes('$currentISODate$')) v = v.replaceAll('$currentISODate$', new Date().toISOString());
  }
  let modified = false;
  try {
    const storage = win[`${which}Storage`];
    if (v === '$remove$') {
      const re = patternToRegex(key, undefined, true);
      const toRemove = [];
      for (let i = 0, n = storage.length; i < n; i++) {
        const k = storage.key(i);
        if (re.test(k)) toRemove.push(k);
      }
      modified = toRemove.length !== 0;
      for (const k of toRemove) storage.removeItem(k);
    } else {
      const before = storage.getItem(key);
      const after = `${v}`;
      modified = after !== before;
      if (modified) storage.setItem(key, after);
    }
  } catch { /* */ }
  if (modified && typeof options.reload === 'number') setTimeout(() => win.location.reload(), options.reload);
}

// --------------------------------------------------------------------------
// Odpowiedzi sieciowe

function fetchPrevent(trusted, propsToMatch = '', responseBody = '', responseType = '', ...varargs) {
  const extra = parseVarargs(varargs);
  const needles = parsePropsToMatch(propsToMatch, 'url');
  const responseProps = { statusText: { value: 'OK' } };
  const responseHeaders = {};
  const validProps = {
    ok: [false, true], status: [403], statusText: ['', 'Not Found'], type: ['basic', 'cors', 'default', 'error', 'opaque'],
  };
  if (/^\{.*\}$/.test(responseType)) {
    try {
      for (const [p, v] of Object.entries(JSON.parse(responseType))) {
        if (p === 'headers' && trusted) { Object.assign(responseHeaders, v); continue; }
        if (validProps[p] === undefined || !validProps[p].includes(v)) continue;
        responseProps[p] = { value: v };
      }
    } catch { /* */ }
  } else if (responseType !== '' && validProps.type.includes(responseType)) {
    responseProps.type = { value: responseType };
  }
  const nativeSetTimeout = win.setTimeout;
  proxyApply('fetch', (ctx) => {
    if (propsToMatch === '' && responseBody === '') return ctx.reflect();
    const details = collateFetchArgs(...ctx.callArgs);
    const matched = matchObjectProps(needles, details);
    if (matched === undefined || matched.length === 0) return ctx.reflect();
    return Promise.resolve(generateContent(trusted, responseBody)).then((text) => {
      const headers = Object.assign({}, responseHeaders);
      if (headers['content-length'] === undefined) headers['content-length'] = text.length;
      const response = new Response(text, { headers });
      try { Object.defineProperties(response, { url: { value: details.url }, ...responseProps }); } catch { /* */ }
      if (extra.throttle) return new Promise((resolve) => nativeSetTimeout(() => resolve(response), extra.throttle));
      return response;
    });
  });
}

function xhrPrevent(trusted, propsToMatch = '', directive = '') {
  const instances = new WeakMap();
  const needles = parsePropsToMatch(propsToMatch, 'url');
  const dispatch = (xhr, type) => { try { xhr.dispatchEvent(new Event(type)); } catch { /* */ } };
  proxyApply('XMLHttpRequest.prototype.open', (ctx) => {
    const { thisArg, callArgs } = ctx;
    instances.delete(thisArg);
    const [method, url, ...rest] = callArgs;
    if (propsToMatch === '' && directive === '') return ctx.reflect();
    const haystack = { method, url };
    if (matchObjectProps(needles, haystack)) {
      instances.set(thisArg, {
        xhr: thisArg,
        url,
        defer: rest.length === 0 || !!rest[0],
        directive,
        headers: { date: '', 'content-type': '', 'content-length': '' },
        props: { response: { value: '' }, responseText: { value: '' }, responseXML: { value: null } },
      });
    }
    return ctx.reflect();
  });
  proxyApply('XMLHttpRequest.prototype.send', (ctx) => {
    const d = instances.get(ctx.thisArg);
    if (d === undefined) return ctx.reflect();
    d.headers.date = new Date().toUTCString();
    switch (ctx.thisArg.responseType) {
      case 'arraybuffer':
        d.props.response.value = new ArrayBuffer(0);
        d.headers['content-type'] = 'application/octet-stream';
        break;
      case 'blob':
        d.props.response.value = new Blob([]);
        d.headers['content-type'] = 'application/octet-stream';
        break;
      case 'document': {
        const parsed = new DOMParser().parseFromString('', 'text/html');
        d.props.response.value = parsed;
        d.props.responseXML.value = parsed;
        d.headers['content-type'] = 'text/html';
        break;
      }
      case 'json':
        d.props.response.value = {};
        d.props.responseText.value = '{}';
        d.headers['content-type'] = 'application/json';
        break;
      default: {
        if (directive === '') break;
        const text = generateContent(trusted, d.directive);
        d.props.response.value = text;
        d.props.responseText.value = text;
        d.headers['content-type'] = 'text/plain';
        break;
      }
    }
    if (d.defer === false) {
      d.headers['content-length'] = `${d.props.response.value}`.length;
      Object.defineProperties(d.xhr, {
        readyState: { value: 4 }, responseURL: { value: d.url }, status: { value: 200 }, statusText: { value: 'OK' },
      });
      Object.defineProperties(d.xhr, d.props);
      return undefined;
    }
    Promise.resolve().then(() => {
      Object.defineProperties(d.xhr, { readyState: { value: 1, configurable: true }, responseURL: { value: d.url } });
      dispatch(d.xhr, 'readystatechange');
    }).then(() => {
      d.headers['content-length'] = `${d.props.response.value}`.length;
      Object.defineProperties(d.xhr, { readyState: { value: 2, configurable: true }, status: { value: 200 }, statusText: { value: 'OK' } });
      dispatch(d.xhr, 'readystatechange');
    }).then(() => {
      Object.defineProperties(d.xhr, { readyState: { value: 3, configurable: true } });
      Object.defineProperties(d.xhr, d.props);
      dispatch(d.xhr, 'readystatechange');
    }).then(() => {
      Object.defineProperties(d.xhr, { readyState: { value: 4 } });
      dispatch(d.xhr, 'readystatechange');
      dispatch(d.xhr, 'load');
      dispatch(d.xhr, 'loadend');
    });
    return undefined;
  });
  proxyApply('XMLHttpRequest.prototype.getResponseHeader', (ctx) => {
    const d = instances.get(ctx.thisArg);
    if (d === undefined || ctx.thisArg.readyState < 2) return ctx.reflect();
    const value = d.headers[`${ctx.callArgs[0]}`.toLowerCase()];
    return value !== undefined && value !== '' ? value : null;
  });
  proxyApply('XMLHttpRequest.prototype.getAllResponseHeaders', (ctx) => {
    const d = instances.get(ctx.thisArg);
    if (d === undefined || ctx.thisArg.readyState < 2) return ctx.reflect();
    const out = [];
    for (const [name, value] of Object.entries(d.headers)) if (value) out.push(`${name}: ${value}`);
    if (out.length) out.push('');
    return out.join('\r\n');
  });
}

/**
 * Podklasa XMLHttpRequest, która podmienia odpowiedź (tekstową lub JSON) dla
 * żądań pasujących do propsToMatch. transform(innerResponse) → nowa odpowiedź.
 */
function installXhrResponseTransform(needles, rawTransform) {
  const transform = perfWrap(perfLabel('XMLHttpRequest:response'), rawTransform);
  const instances = new WeakMap();
  const Native = win.XMLHttpRequest;
  win.XMLHttpRequest = class XMLHttpRequest extends Native {
    open(method, url, ...rest) {
      const details = { method, url };
      if (needles.size === 0 || matchObjectProps(needles, details) !== undefined) instances.set(this, details);
      else instances.delete(this);
      return super.open(method, url, ...rest);
    }

    get response() {
      const inner = super.response;
      const d = instances.get(this);
      if (d === undefined) return inner;
      const len = typeof inner === 'string' ? inner.length : undefined;
      if (d.lastLength !== len) { d.response = undefined; d.lastLength = len; }
      if (d.response !== undefined) return d.response;
      d.response = transform(inner);
      return d.response;
    }

    get responseText() {
      const r = this.response;
      return typeof r !== 'string' ? super.responseText : r;
    }
  };
}

// --------------------------------------------------------------------------
// Scriptlety

const SCRIPTLETS = {
  'set-constant'(...args) { setConstantImpl(false, ...args); },
  'trusted-set-constant'(...args) { setConstantImpl(true, ...args); },

  'abort-on-property-read'(chain = '') {
    if (chain === '') return;
    const abort = () => { throw new ReferenceError(exceptionToken); };
    const makeProxy = (owner, path) => {
      const pos = path.indexOf('.');
      if (pos === -1) {
        const desc = getOwnDesc(owner, path);
        if (!desc || desc.get !== abort) {
          try { defineProperty(owner, path, { get: abort, set() {} }); } catch { /* */ }
        }
        return;
      }
      const prop = path.slice(0, pos);
      let v = owner[prop];
      const rest = path.slice(pos + 1);
      if (v) { try { makeProxy(v, rest); } catch { /* */ } return; }
      const desc = getOwnDesc(owner, prop);
      if (desc && desc.set !== undefined) return;
      try {
        defineProperty(owner, prop, {
          get() { return v; },
          set(a) { v = a; if (a instanceof Object) makeProxy(a, rest); },
        });
      } catch { /* */ }
    };
    makeProxy(win, chain);
  },

  'abort-on-property-write'(prop = '') {
    if (prop === '') return;
    let owner = win;
    let p = prop;
    for (;;) {
      const pos = p.indexOf('.');
      if (pos === -1) break;
      owner = owner[p.slice(0, pos)];
      if (!(owner instanceof Object)) return;
      p = p.slice(pos + 1);
    }
    try {
      delete owner[p];
      defineProperty(owner, p, { set() { throw new ReferenceError(exceptionToken); } });
    } catch { /* */ }
  },

  'abort-current-script'(target = '', needle = '', context = '') {
    if (target === '') return;
    runAtHtmlElement(() => {
      const reNeedle = patternToRegex(needle);
      const reContext = patternToRegex(context);
      const thisScript = doc.currentScript;
      const decoded = new WeakMap();
      const scriptText = (el) => {
        let text = textContentGetter.call(el);
        if (text.trim() !== '') return text;
        if (decoded.has(el)) return decoded.get(el);
        const [, mime, content] = /^data:([^,]*),(.+)$/.exec(el.src.trim()) || ['', '', ''];
        try { text = mime.endsWith(';base64') ? win.atob(content) : win.decodeURIComponent(content); } catch { /* */ }
        decoded.set(el, text);
        return text;
      };
      const validate = () => {
        const e = doc.currentScript;
        if (!(e instanceof HTMLScriptElement)) return;
        if (e === thisScript) return;
        if (context !== '' && reContext.test(e.src) === false) return;
        if (reNeedle.test(scriptText(e)) === false) return;
        throw new ReferenceError(exceptionToken);
      };
      let current = trapProperty(target, {
        get() { validate(); return current; },
        set(a) { validate(); current = a; },
      }, { canThrow: true });
    });
  },

  'prevent-addEventListener'(type = '', pattern = '', ...varargs) {
    const extra = parseVarargs(varargs);
    const reType = patternToRegex(type, undefined, true);
    const rePattern = patternToRegex(pattern);
    const targetSelector = extra.elements || undefined;
    const elementMatches = (el) => {
      if (targetSelector === 'window') return el === win;
      if (targetSelector === 'document') return el === doc;
      try {
        if (el && el.matches && el.matches(targetSelector)) return true;
        return Array.from(doc.querySelectorAll(targetSelector)).includes(el);
      } catch { return false; }
    };
    const shouldPrevent = (thisArg, t, h) => {
      const both = reType.test(t) && rePattern.test(h);
      if (both && targetSelector !== undefined && !elementMatches(thisArg)) return false;
      return both;
    };
    const handler = (ctx) => {
      const { callArgs, thisArg } = ctx;
      let t;
      let h;
      try {
        t = String(callArgs[0]);
        if (typeof callArgs[1] === 'function') h = String(fnToString(callArgs[1]));
        else if (typeof callArgs[1] === 'object' && callArgs[1] !== null) {
          if (typeof callArgs[1].handleEvent === 'function') h = String(fnToString(callArgs[1].handleEvent));
        } else h = String(callArgs[1]);
      } catch { /* */ }
      if ((type !== '' || pattern !== '') && shouldPrevent(thisArg, t, h)) return undefined;
      return ctx.reflect();
    };
    const protect = (owner) => {
      const { addEventListener } = owner;
      try { defineProperty(owner, 'addEventListener', { set() {}, get() { return addEventListener; } }); } catch { /* */ }
    };
    runAt(() => {
      proxyApply('EventTarget.prototype.addEventListener', handler);
      if (extra.protect) protect(EventTarget.prototype);
      if (Object.prototype.hasOwnProperty.call(doc, 'addEventListener')) {
        proxyApply('document.addEventListener', handler);
        if (extra.protect) protect(doc);
      }
      if (Object.prototype.hasOwnProperty.call(win, 'addEventListener')) {
        proxyApply('window.addEventListener', handler);
        if (extra.protect) protect(win);
      }
    }, extra.runAt);
  },

  'prevent-setTimeout'(needle = '', delay = '') { timerPrevent('setTimeout', needle, delay); },
  'prevent-setInterval'(needle = '', delay = '') { timerPrevent('setInterval', needle, delay); },
  'adjust-setTimeout'(needle = '', delay = '', boost = '') { timerAdjust('setTimeout', needle, delay, boost); },
  'adjust-setInterval'(needle = '', delay = '', boost = '') { timerAdjust('setInterval', needle, delay, boost); },

  'prevent-window-open'(pattern = '', delay = '', decoy = '') {
    const expect = !pattern.startsWith('!');
    const rePattern = patternToRegex(expect ? pattern : pattern.slice(1));
    const autoRemoveAfter = (parseFloat(delay) || 0) * 1000;
    const nativeSetTimeout = win.setTimeout;
    const createDecoy = (tag, urlProp, url) => {
      const el = doc.createElement(tag);
      el[urlProp] = url;
      el.style.setProperty('height', '1px', 'important');
      el.style.setProperty('position', 'fixed', 'important');
      el.style.setProperty('top', '-1px', 'important');
      el.style.setProperty('width', '1px', 'important');
      doc.body.appendChild(el);
      nativeSetTimeout(() => el.remove(), autoRemoveAfter);
      return el;
    };
    const noop = function () {};
    proxyApply('open', (ctx) => {
      const { callArgs } = ctx;
      if (rePattern.test(callArgs.join(' ')) !== expect) return ctx.reflect();
      if (delay === '') return null;
      if (decoy === 'blank') {
        callArgs[0] = 'about:blank';
        const r = ctx.reflect();
        nativeSetTimeout(() => { try { r.close(); } catch { /* */ } }, autoRemoveAfter);
        return r;
      }
      const el = decoy === 'obj' ? createDecoy('object', 'data', ...callArgs) : createDecoy('iframe', 'src', ...callArgs);
      let popup = el.contentWindow;
      if (typeof popup === 'object' && popup !== null) {
        try { defineProperty(popup, 'closed', { value: false }); } catch { /* */ }
      } else {
        popup = new Proxy(win, {
          get(target, prop, ...rest) {
            if (prop === 'closed') return false;
            const r = Reflect.get(target, prop, ...rest);
            return typeof r === 'function' ? noop : r;
          },
          set(...rest) { return Reflect.set(...rest); },
        });
      }
      return popup;
    });
  },

  'prevent-fetch'(...args) { fetchPrevent(false, ...args); },
  'trusted-prevent-fetch'(...args) { fetchPrevent(true, ...args); },
  'prevent-xhr'(...args) { xhrPrevent(false, ...args); },
  'trusted-prevent-xhr'(...args) { xhrPrevent(true, ...args); },

  'remove-attr'(rawToken = '', rawSelector = '', behavior = '', ...varargs) {
    if (rawToken === '') return;
    const tokens = rawToken.split(/\s*\|\s*/);
    const selector = tokens.map((a) => {
      const b = CSS.escape(a);
      return rawSelector.includes(`[${b}]`) ? rawSelector : `${rawSelector}[${b}]`;
    }).join(',');
    const lazily = !/\basap\b/.test(behavior);
    const options = parseVarargs(varargs);
    const fromNode = (node) => { for (const a of tokens) if (node.hasAttribute(a)) node.removeAttribute(a); };
    const removeAll = (nodes) => {
      try { for (const node of nodes || doc.querySelectorAll(selector)) fromNode(node); } catch { /* */ }
    };
    let timer;
    const lazy = () => {
      if (timer !== undefined) return;
      timer = onIdle(() => { timer = undefined; removeAll(); }, { timeout: 17 });
    };
    let observer;
    const onMutations = (mutations) => {
      for (const { addedNodes, removedNodes } of mutations) {
        for (const node of addedNodes) {
          if (node.nodeType !== 1) continue;
          if (lazily) { lazy(); return; }
          try {
            if (node.matches(selector)) fromNode(node);
            if (node.childElementCount) removeAll(node.querySelectorAll(selector));
          } catch { /* */ }
        }
        if (lazily) return;
        for (const node of removedNodes) {
          if (node.nodeType !== 1) continue;
          try { if (node.matches(selector)) fromNode(node); } catch { /* */ }
        }
      }
    };
    const start = () => {
      removeAll();
      if (!/\bstay\b/.test(behavior) && options.quitAfter === undefined) return;
      observer = new MutationObserver(onMutations);
      observer.observe(doc, { attributes: true, attributeFilter: tokens, childList: true, subtree: true });
      if (options.quitAfter) setTimeout(() => observer.disconnect(), options.quitAfter * 1000);
    };
    runAt(start, behavior.split(/\s+/));
  },

  'remove-class'(rawToken = '', rawSelector = '', behavior = '') {
    if (rawToken === '') return;
    const tokens = rawToken.split(/\s*\|\s*/);
    const selector = tokens.map((a) => `${rawSelector}.${CSS.escape(a)}`).join(',');
    const mustStay = /\bstay\b/.test(behavior);
    let timer;
    let observer;
    const removeAll = () => {
      timer = undefined;
      try { for (const node of doc.querySelectorAll(selector)) node.classList.remove(...tokens); } catch { /* */ }
      if (mustStay) return;
      if (doc.readyState !== 'complete') return;
      observer.disconnect();
    };
    const onMutations = (mutations) => {
      if (timer !== undefined) return;
      let skip = true;
      for (let i = 0; i < mutations.length && skip; i++) {
        const { type, addedNodes, removedNodes } = mutations[i];
        if (type === 'attributes') skip = false;
        for (let j = 0; j < addedNodes.length && skip; j++) if (addedNodes[j].nodeType === 1) skip = false;
        for (let j = 0; j < removedNodes.length && skip; j++) if (removedNodes[j].nodeType === 1) skip = false;
      }
      if (skip) return;
      timer = onIdle(removeAll, { timeout: 67 });
    };
    observer = new MutationObserver(onMutations);
    runAt(() => {
      removeAll();
      observer.observe(doc, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
    }, /\bcomplete\b/.test(behavior) ? 'idle' : 'loading');
  },

  'set-attr'(selector = '', attr = '', value = '', ...varargs) {
    let v = value;
    if (!['', 'false', 'true'].includes(v.toLowerCase()) && /^\d+$/.test(v)) v = `${parseInt(v, 10)}`;
    setAttrImpl(false, selector, attr, v, parseVarargs(varargs));
  },
  'trusted-set-attr'(selector = '', attr = '', value = '', ...varargs) {
    setAttrImpl(true, selector, attr, value, parseVarargs(varargs));
  },

  'remove-node-text'(nodeName = '', includes = '', ...varargs) {
    replaceNodeTextImpl(nodeName, '', '', 'includes', includes || '', ...varargs);
  },
  'trusted-replace-node-text'(nodeName = '', pattern = '', replacement = '', ...varargs) {
    replaceNodeTextImpl(nodeName, pattern, replacement, ...varargs);
  },

  'json-prune'(rawPrune = '', rawNeedle = '') {
    proxyApply('JSON.parse', (ctx) => {
      const before = ctx.reflect();
      const after = pruneObject(before, rawPrune, rawNeedle);
      return after === undefined ? before : after;
    });
  },

  'json-prune-fetch-response'(rawPrune = '', rawNeedle = '', ...varargs) {
    const extra = parseVarargs(varargs);
    const needles = parsePropsToMatch(extra.propsToMatch, 'url');
    const respLabel = perfLabel('fetch:response');
    proxyApply('fetch', (ctx) => {
      const fetchPromise = ctx.reflect();
      if (needles.size !== 0 && matchObjectProps(needles, collateFetchArgs(...ctx.callArgs)) === undefined) return fetchPromise;
      return fetchPromise.then((before) => before.clone().json().then(perfWrap(respLabel, (obj) => {
        if (typeof obj !== 'object') return before;
        const after = pruneObject(obj, rawPrune, rawNeedle);
        if (typeof after !== 'object') return before;
        return respondLike(before, nativeJSONStringify(after));
      })).catch(() => before)).catch(() => fetchPromise);
    });
  },

  'json-prune-xhr-response'(rawPrune = '', rawNeedle = '', ...varargs) {
    const extra = parseVarargs(varargs);
    installXhrResponseTransform(parsePropsToMatch(extra.propsToMatch, 'url'), (inner) => {
      let obj;
      if (typeof inner === 'object') obj = inner;
      else if (typeof inner === 'string') { try { obj = nativeJSONParse(inner); } catch { /* */ } }
      if (typeof obj !== 'object') return inner;
      const after = pruneObject(obj, rawPrune, rawNeedle);
      if (typeof after !== 'object') return inner;
      return typeof inner === 'string' ? nativeJSONStringify(after) : after;
    });
  },

  'trusted-replace-fetch-response'(pattern = '', replacement = '', propsToMatch = '', ...varargs) {
    const rePattern = patternToRegex(pattern);
    const needles = parsePropsToMatch(propsToMatch, 'url');
    const extra = parseVarargs(varargs);
    const reIncludes = extra.includes ? patternToRegex(extra.includes) : null;
    const respLabel = perfLabel('fetch:response');
    proxyApply('fetch', (ctx) => {
      const fetchPromise = ctx.reflect();
      if (pattern === '') return fetchPromise;
      if (needles.size !== 0 && matchObjectProps(needles, collateFetchArgs(...ctx.callArgs)) === undefined) return fetchPromise;
      return fetchPromise.then((before) => before.clone().text().then(perfWrap(respLabel, (textBefore) => {
        if (reIncludes && reIncludes.test(textBefore) === false) return before;
        const textAfter = textBefore.replace(rePattern, replacement);
        if (textAfter === textBefore) return before;
        return respondLike(before, textAfter);
      })).catch(() => before)).catch(() => fetchPromise);
    });
  },

  'trusted-replace-xhr-response'(pattern = '', replacement = '', propsToMatch = '', ...varargs) {
    const rePattern = patternToRegex(pattern);
    const extra = parseVarargs(varargs);
    const reIncludes = extra.includes ? patternToRegex(extra.includes) : null;
    installXhrResponseTransform(parsePropsToMatch(propsToMatch, 'url'), (inner) => {
      if (typeof inner !== 'string') return inner;
      if (reIncludes && reIncludes.test(inner) === false) return inner;
      return inner.replace(rePattern, replacement);
    });
  },

  'json-edit'(q = '', ...varargs) { jsonEditParse(false, q, ...varargs); },
  'trusted-json-edit'(q = '', ...varargs) { jsonEditParse(true, q, ...varargs); },
  'json-edit-fetch-response'(q = '', ...varargs) { jsonEditFetch(false, q, ...varargs); },
  'trusted-json-edit-fetch-response'(q = '', ...varargs) { jsonEditFetch(true, q, ...varargs); },
  'json-edit-xhr-response'(q = '', ...varargs) { jsonEditXhr(false, q, ...varargs); },
  'trusted-json-edit-xhr-response'(q = '', ...varargs) { jsonEditXhr(true, q, ...varargs); },
  'edit-inbound-object'(chain = '', pos = '', q = '') { editInbound(false, chain, pos, q); },
  'trusted-edit-inbound-object'(chain = '', pos = '', q = '') { editInbound(true, chain, pos, q); },

  'trusted-prevent-dom-bypass'(methodPath = '', targetProp = '') {
    if (methodPath === '') return;
    proxyApply(methodPath, (ctx) => {
      // Szybka ścieżka (wydajność): element bez właściwości contentWindow (div, span, …) daje
      // `${el.contentWindow}` === 'undefined' i zawsze był pomijany – nie alokujemy tablicy ani Set
      // przy każdym appendChild (na YouTube tysiące wywołań na sekundę, 3 takie filtry).
      const args = ctx.callArgs;
      let elems = null;
      for (let i = 0; i < args.length; i++) {
        const e = args[i];
        if (e instanceof HTMLElement && 'contentWindow' in e) (elems || (elems = new Set())).add(e);
      }
      if (elems === null) return ctx.reflect();
      const r = ctx.reflect();
      for (const el of elems) {
        try {
          if (`${el.contentWindow}` !== '[object Window]') continue;
          const href = el.contentWindow.location.href;
          if (href !== 'about:blank' && href !== win.location.href) continue;
          if (targetProp !== '') {
            let me = win;
            let it = el.contentWindow;
            let chain = targetProp;
            for (;;) {
              const pos = chain.indexOf('.');
              if (pos === -1) break;
              const prop = chain.slice(0, pos);
              me = me[prop];
              it = it[prop];
              chain = chain.slice(pos + 1);
            }
            it[chain] = me[chain];
          } else {
            defineProperty(el, 'contentWindow', { value: win });
          }
        } catch { /* */ }
      }
      return r;
    });
  },

  'set-cookie'(name = '', value = '', path = '', ...varargs) {
    if (name === '') return;
    setCookieImpl(false, name, value, '', path, parseVarargs(varargs));
  },
  'set-cookie-reload'(name = '', value = '', path = '') {
    if (name === '') return;
    setCookieImpl(false, name, value, '', path, { reload: 1 });
  },
  'trusted-set-cookie'(name = '', value = '', offset = '', path = '', ...varargs) {
    trustedSetCookie(name, value, offset, path, parseVarargs(varargs));
  },
  'trusted-set-cookie-reload'(name = '', value = '', offset = '', path = '') {
    trustedSetCookie(name, value, offset, path, { reload: 1 });
  },

  'remove-cookie'(needle = '', ...varargs) {
    const reName = patternToRegex(needle);
    const extra = parseVarargs(varargs);
    const baseURL = new URL(doc.baseURI);
    let targetDomain = extra.domain;
    if (targetDomain && /^\/.+\//.test(targetDomain)) {
      const m = new NativeRegExp(targetDomain.slice(1, -1)).exec(baseURL.hostname);
      targetDomain = m ? m[0] : undefined;
    }
    let throttleTimer;
    const throttle = (fn, ms = 500) => {
      if (throttleTimer !== undefined) return;
      throttleTimer = setTimeout(() => { throttleTimer = undefined; fn(); }, ms);
    };
    const remove = () => {
      doc.cookie.split(';').forEach((cookieStr) => {
        const pos = cookieStr.indexOf('=');
        if (pos === -1) return;
        const name = cookieStr.slice(0, pos).trim();
        if (!reName.test(name)) return;
        const p1 = name + '=';
        const p2a = `; domain=${baseURL.hostname}`;
        const p2b = `; domain=.${baseURL.hostname}`;
        let p2c;
        let p2d;
        if (targetDomain) {
          p2c = `; domain=${targetDomain}`;
          p2d = `; domain=.${targetDomain}`;
        } else if (doc.domain) {
          const domain = doc.domain;
          if (domain !== baseURL.hostname) p2c = `; domain=.${domain}`;
          if (domain.startsWith('www.')) p2d = `; domain=${domain.replace('www', '')}`;
        }
        const p3 = '; path=/';
        const p4 = '; Max-Age=-1000; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        doc.cookie = p1 + p4;
        doc.cookie = p1 + p2a + p4;
        doc.cookie = p1 + p2b + p4;
        doc.cookie = p1 + p3 + p4;
        doc.cookie = p1 + p2a + p3 + p4;
        doc.cookie = p1 + p2b + p3 + p4;
        if (p2c !== undefined) doc.cookie = p1 + p2c + p3 + p4;
        if (p2d !== undefined) doc.cookie = p1 + p2d + p3 + p4;
      });
    };
    remove();
    win.addEventListener('beforeunload', remove);
    if (typeof extra.when !== 'string') return;
    for (const type of extra.when.split(/\s/)) {
      if (!['scroll', 'keydown'].includes(type)) continue;
      doc.addEventListener(type, () => throttle(remove), { passive: true });
    }
  },

  'set-local-storage-item'(key = '', value = '', ...varargs) { setStorageImpl('local', false, key, value, parseVarargs(varargs)); },
  'set-session-storage-item'(key = '', value = '', ...varargs) { setStorageImpl('session', false, key, value, parseVarargs(varargs)); },
  'trusted-set-local-storage-item'(key = '', value = '', ...varargs) { setStorageImpl('local', true, key, value, parseVarargs(varargs)); },
  'trusted-set-session-storage-item'(key = '', value = '', ...varargs) { setStorageImpl('session', true, key, value, parseVarargs(varargs)); },

  'noeval'() { proxyApply('eval', () => undefined); },
  'noeval-silent'() { proxyApply('eval', () => undefined); },
  'noeval-if'(needle = '') {
    const reNeedle = patternToRegex(needle);
    proxyApply('eval', (ctx) => {
      if (needle !== '' && reNeedle.test(String(ctx.callArgs[0]))) return undefined;
      return ctx.reflect();
    });
  },

  'nowebrtc'() {
    const rtcName = win.RTCPeerConnection ? 'RTCPeerConnection'
      : (win.webkitRTCPeerConnection ? 'webkitRTCPeerConnection' : '');
    if (rtcName === '') return;
    const noop = function () {};
    const pc = function () {};
    pc.prototype = {
      close: noop, createDataChannel: noop, createOffer: noop, setRemoteDescription: noop,
      toString() { return '[object RTCPeerConnection]'; },
    };
    const original = win[rtcName];
    win[rtcName] = pc.bind(win);
    if (original.prototype) {
      original.prototype.createDataChannel = function () { return { close() {}, send() {} }; }.bind(null);
    }
  },

  'trusted-click-element'(selectors = '', extraMatch = '', delay = '') {
    if (extraMatch !== '') {
      const assertions = extraMatch.split(',').map((s) => {
        const pos1 = s.indexOf(':');
        const s1 = pos1 !== -1 ? s.slice(0, pos1) : s;
        const not = s1.startsWith('!');
        const type = not ? s1.slice(1) : s1;
        const s2 = pos1 !== -1 ? s.slice(pos1 + 1).trim() : '';
        if (s2 === '') return undefined;
        const out = { not, type };
        const m = /^\/(.+)\/(i?)$/.exec(s2);
        if (m !== null) { out.re = new NativeRegExp(m[1], m[2] || undefined); return out; }
        const pos2 = s2.indexOf('=');
        const key = pos2 !== -1 ? s2.slice(0, pos2).trim() : s2;
        const value = pos2 !== -1 ? s2.slice(pos2 + 1).trim() : '';
        out.re = new NativeRegExp(`^${escapeRe(key)}=${escapeRe(value)}`);
        return out;
      }).filter((d) => d !== undefined);
      const cookies = assertions.some((o) => o.type === 'cookie')
        ? doc.cookie.split(/\s*;\s*/).map((s) => {
          const pos = s.indexOf('=');
          if (pos === 0) return undefined;
          if (pos === -1) return { key: s.trim(), value: '' };
          return { key: s.slice(0, pos).trim(), value: s.slice(pos + 1).trim() };
        }).filter(Boolean)
        : [];
      const has = (haystack, needle) => haystack.some(({ key, value }) => needle.test(`${key}=${value}`));
      for (const { not, type, re } of assertions) {
        if (type === 'cookie' && has(cookies, re) === not) return;
      }
    }
    const steps = (/^[;|]/.test(selectors) ? selectors.slice(1).split(selectors.charAt(0)) : selectors.split(','))
      .map((a) => { const t = a.trim(); return /^\d+$/.test(t) ? parseInt(t, 10) : t; });
    if (steps.length === 0) return;
    const clickDelay = parseInt(delay, 10) || 1;
    for (let i = steps.length - 1; i > 0; i--) {
      if (typeof steps[i] !== 'string' || typeof steps[i - 1] !== 'string') continue;
      steps.splice(i, 0, clickDelay);
    }
    if (steps.length === 1 && delay !== '') steps.unshift(clickDelay);
    if (typeof steps[steps.length - 1] !== 'number') steps.push(11000);
    const timeout = steps.pop();
    const lookup = (directive) => {
      const visible = directive.startsWith('when-visible:');
      const selector = visible ? directive.slice(13) : directive;
      let elems;
      if (selector.startsWith('xpath:')) {
        elems = [];
        const res = doc.evaluate(selector.slice(6), doc, null, 7, null);
        for (let i = 0; i < res.snapshotLength; i++) elems.push(res.snapshotItem(i));
      } else {
        try { elems = Array.from(doc.querySelectorAll(selector)); } catch { elems = []; }
      }
      return visible ? elems.filter((a) => a.checkVisibility({ opacityProperty: true, visibilityProperty: true })) : elems;
    };
    const waitForElement = (directive) => new Promise((resolve) => {
      const until = Date.now() + timeout;
      let observer;
      let timer;
      const check = () => {
        const elems = lookup(directive);
        if (elems.length || Date.now() >= until) {
          if (observer) observer.disconnect();
          if (timer) (win.cancelIdleCallback || win.cancelAnimationFrame)(timer);
          resolve(elems);
          return;
        }
        if (!observer) {
          observer = new MutationObserver(check);
          observer.observe(doc, { attributes: true, childList: true, subtree: true });
        }
        if (!timer) timer = onIdle(() => { timer = undefined; check(); }, { timeout: 151 });
      };
      check();
    }).then((elems) => {
      if (elems.length === 0) return false;
      elems[0].click();
      return true;
    });
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const run = async () => {
      while (steps.length !== 0) {
        const step = steps.shift();
        if (step === undefined) break;
        if (typeof step === 'number') { await wait(step); continue; }
        if (step.startsWith('!')) continue;
        if (!(await waitForElement(step))) break;
      }
    };
    runAtHtmlElement(run);
  },
};

function timerPrevent(name, needleRaw, delayRaw) {
  const not = needleRaw.charAt(0) === '!';
  const reNeedle = patternToRegex(not ? needleRaw.slice(1) : needleRaw);
  const range = parseRange(delayRaw);
  proxyApply(name, (ctx) => {
    const { callArgs } = ctx;
    const a = callArgs[0] instanceof Function ? String(fnToString(callArgs[0])) : String(callArgs[0]);
    if (needleRaw === '' && range.unbound) return ctx.reflect();
    if (reNeedle.test(a) !== not && range.test(callArgs[1])) callArgs[0] = function () {};
    return ctx.reflect();
  });
}

/** Zakres opóźnienia: "", "100", "!100", "100-200", "-200", "100-". */
function parseRange(raw) {
  let s = raw;
  const not = s.charAt(0) === '!';
  if (not) s = s.slice(1);
  let min;
  let max;
  if (s !== '') {
    const pos = s.indexOf('-');
    if (pos !== 0) min = max = parseInt(s, 10) || 0;
    if (pos !== -1) max = parseInt(s.slice(pos + 1), 10) || Number.MAX_SAFE_INTEGER;
  }
  return {
    unbound: min === undefined && max === undefined,
    test(v) {
      const n = Math.min(Math.max(Number(v) || 0, 0), Number.MAX_SAFE_INTEGER);
      if (min === max) return (min === undefined || n === min) !== not;
      if (min === undefined) return (n <= max) !== not;
      if (max === undefined) return (n >= min) !== not;
      return (n >= min && n <= max) !== not;
    },
  };
}

function timerAdjust(name, needleArg, delayArg, boostArg) {
  const reNeedle = patternToRegex(needleArg);
  let delay = delayArg !== '*' ? parseInt(delayArg, 10) : -1;
  if (Number.isNaN(delay) || !Number.isFinite(delay)) delay = 1000;
  let boost = parseFloat(boostArg);
  boost = !Number.isNaN(boost) && Number.isFinite(boost) ? Math.min(Math.max(boost, 0.001), 50) : 0.05;
  if (perf === null) {
    win[name] = new Proxy(win[name], {
      apply(target, thisArg, args) {
        const [a, b] = args;
        // Jak w uBO: porównanie ścisłe i zwykłe a.toString().
        if ((delay === -1 || b === delay) && reNeedle.test(a.toString())) args[1] = b * boost;
        return target.apply(thisArg, args);
      },
    });
    return;
  }
  win[name] = new Proxy(win[name], {
    apply: makeApplyTrap(perfLabel(name), (target, thisArg, args, reflect) => {
      const [a, b] = args;
      if ((delay === -1 || b === delay) && reNeedle.test(a.toString())) args[1] = b * boost;
      return reflect();
    }),
  });
}

function setAttrImpl(trusted, selector, attr, value, options) {
  if (selector === '' || attr === '') return;
  const copyFrom = !trusted && /^\[.+\]$/.test(value) ? value.slice(1, -1) : '';
  const extract = (el) => (copyFrom !== '' ? el.getAttribute(copyFrom) || '' : value);
  const apply = () => {
    let elems;
    try { elems = doc.querySelectorAll(selector); } catch { return false; }
    for (const el of elems) {
      const before = el.getAttribute(attr);
      const after = extract(el);
      if (after === before) continue;
      if (after !== '' && /^on/i.test(attr) && attr.toLowerCase() in el) continue;
      el.setAttribute(attr, after);
    }
    return true;
  };
  let timer;
  const onChanged = (mutations) => {
    if (timer !== undefined) return;
    const work = mutations.some((m) => Array.from(m.addedNodes).some((n) => n.nodeType === 1));
    if (!work) return;
    timer = win.requestAnimationFrame(() => { timer = undefined; apply(); });
  };
  runAt(() => {
    if (apply() === false) return;
    const root = doc.documentElement;
    if (!(root instanceof win.Node)) return;
    new MutationObserver(onChanged).observe(root, { subtree: true, childList: true });
  }, options.runAt || 'idle');
}

function trustedSetCookie(name, value, offset, path, options) {
  if (name === '') return;
  const time = new Date();
  let v = value;
  if (v.includes('$now$')) v = v.replaceAll('$now$', time.getTime());
  if (v.includes('$currentDate$')) v = v.replaceAll('$currentDate$', time.toUTCString());
  if (v.includes('$currentISODate$')) v = v.replaceAll('$currentISODate$', time.toISOString());
  let expires = '';
  if (offset !== '') {
    if (offset === '1day') time.setDate(time.getDate() + 1);
    else if (offset === '1year') time.setFullYear(time.getFullYear() + 1);
    else {
      if (!/^\d+$/.test(offset)) return;
      time.setSeconds(time.getSeconds() + parseInt(offset, 10));
    }
    expires = time.toUTCString();
  }
  setCookieImpl(true, name, v, expires, path, options);
}

function compileJsonPath(trusted, q) {
  const jsonp = ChromeBlockJSONPath.compileQuery(q);
  if (!jsonp.valid) return null;
  if (jsonp.hasAssignment && !trusted) return null;
  return jsonp;
}

function jsonEditParse(trusted, q, ...varargs) {
  const jsonp = compileJsonPath(trusted, q);
  if (!jsonp) return;
  const extra = parseVarargs(varargs);
  const pattern = extra.matches ? initPattern(extra.matches) : null;
  proxyApply('JSON.parse', (ctx) => {
    const json = ctx.callArgs[0];
    const obj = ctx.reflect();
    if (pattern && testPattern(pattern, json) === false) return obj;
    const after = jsonp.apply(obj);
    return after === undefined ? obj : after;
  });
}

function jsonEditFetch(trusted, q, ...varargs) {
  const jsonp = compileJsonPath(trusted, q);
  if (!jsonp) return;
  const extra = parseVarargs(varargs);
  const needles = parsePropsToMatch(extra.propsToMatch, 'url');
  const respLabel = perfLabel('fetch:response');
  proxyApply('fetch', (ctx) => {
    const fetchPromise = ctx.reflect();
    if (needles.size !== 0 && matchObjectProps(needles, collateFetchArgs(...ctx.callArgs)) === undefined) return fetchPromise;
    return fetchPromise.then((before) => before.clone().json().then(perfWrap(respLabel, (obj) => {
      if (typeof obj !== 'object') return before;
      const after = jsonp.apply(obj);
      if (after === undefined) return before;
      return respondLike(before, nativeJSONStringify(after));
    })).catch(() => before)).catch(() => fetchPromise);
  });
}

function jsonEditXhr(trusted, q, ...varargs) {
  const jsonp = compileJsonPath(trusted, q);
  if (!jsonp) return;
  const extra = parseVarargs(varargs);
  installXhrResponseTransform(parsePropsToMatch(extra.propsToMatch, 'url'), (inner) => {
    let obj;
    if (typeof inner === 'object') obj = inner;
    else if (typeof inner === 'string') { try { obj = nativeJSONParse(inner); } catch { /* */ } }
    if (typeof obj !== 'object' || obj === null) return inner;
    const after = jsonp.apply(obj);
    if (after === undefined) return inner;
    // Jak w uBO: ponowna serializacja zamienia "/" na "\/".
    return typeof inner === 'string' ? nativeJSONStringify(after).replace(/\//g, '\\/') : after;
  });
}

function editInbound(trusted, chain, argPosRaw, q) {
  if (chain === '') return;
  const jsonp = compileJsonPath(trusted, q);
  if (!jsonp) return;
  const argPos = parseInt(argPosRaw, 10);
  if (Number.isNaN(argPos)) return;
  const index = (args) => {
    if (!Array.isArray(args)) return undefined;
    if (argPos >= 0) return args.length <= argPos ? undefined : argPos;
    return args.length < -argPos ? undefined : args.length + argPos;
  };
  const nativeParse = nativeJSONParse;
  const nativeStringify = nativeJSONStringify;
  proxyApply(chain, (ctx) => {
    const i = index(ctx.callArgs);
    if (i !== undefined) {
      let clone;
      try { clone = nativeParse(nativeStringify(ctx.callArgs[i])); } catch { /* */ }
      if (typeof clone === 'object' && clone !== null) {
        const after = jsonp.apply(clone);
        if (after) ctx.callArgs[i] = after;
      }
    }
    return ctx.reflect();
  });
}

/** Ustala, które scriptlety dotyczą bieżącego hosta, i je uruchamia. */
function hostCandidates(hostname) {
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

function runForHost(calls, hosts, except) {
  let hostname = '';
  try { hostname = location.hostname; } catch { /* */ }
  if (!hostname) {
    try { hostname = new URL(location.ancestorOrigins[0]).hostname; } catch { return; }
  }
  const selected = new Set();
  const excluded = new Set();
  for (const h of hostCandidates(hostname)) {
    const list = hosts[h];
    if (list) for (const i of list) selected.add(i);
    const ex = except[h];
    if (ex) for (const k of ex) excluded.add(k);
  }
  if (excluded.has('*')) return;
  for (const i of selected) {
    const call = calls[i];
    if (excluded.has(call.join('\u0001'))) continue;
    const fn = SCRIPTLETS[call[0]];
    if (!fn) continue;
    currentScriptlet = call[0];
    try { fn(...call.slice(1)); } catch { /* scriptlet nie może zepsuć strony */ }
  }
}
