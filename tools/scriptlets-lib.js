// Tarcza – biblioteka scriptletów (kompatybilna składniowo z uBlock Origin).
// Ten kod jest wklejany przez build.mjs do scriptlets/<lista>.js i uruchamiany
// w świecie MAIN strony na document_start, zanim wykonają się skrypty strony.
// Wszystko jest zamknięte w IIFE – nic nie wycieka do globalnego zakresu strony.

const win = window;
const doc = document;
const nativeToString = Function.prototype.toString;
const fnText = (fn) => { try { return typeof fn === 'function' ? nativeToString.call(fn) : String(fn); } catch { return ''; } };
const safeReflect = Reflect;
const ObjectDefineProperty = Object.defineProperty;
const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const magic = 'tarcza' + Math.random().toString(36).slice(2);

win.addEventListener('error', (ev) => {
  if (ev && typeof ev.message === 'string' && ev.message.includes(magic)) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }
}, true);

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** Wzorzec uBO: "/regex/flagi" albo dosłowny podciąg. Pusty → dopasowuje wszystko. */
function toRegex(pattern, flags = '') {
  if (pattern === undefined || pattern === '') return /^/;
  const m = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
  if (m) { try { return new RegExp(m[1], m[2] || flags); } catch { return /(?!)/; } }
  return new RegExp(escapeRe(pattern), flags);
}

/** Argumenty nazwane w stylu uBO: ..., 'nazwa', 'wartość', ... */
function namedArgs(args) {
  const out = {};
  for (let i = 0; i + 1 < args.length; i += 2) out[args[i]] = args[i + 1];
  return out;
}

function abort() { throw new ReferenceError(magic); }

/**
 * Przechodzi po łańcuchu właściwości "a.b.c". Gdy pośredni obiekt jeszcze nie
 * istnieje, zakłada pułapkę, która dokończy przejście po jego przypisaniu.
 * onFinal(owner, prop) wywoływane jest dla ostatniego ogniwa.
 */
function trapChain(root, chain, onFinal) {
  const walk = (owner, path) => {
    const dot = path.indexOf('.');
    if (dot === -1) { onFinal(owner, path); return; }
    const prop = path.slice(0, dot);
    const rest = path.slice(dot + 1);
    let value;
    try { value = owner[prop]; } catch { return; }
    if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
      walk(value, rest);
      return;
    }
    const desc = ObjectGetOwnPropertyDescriptor(owner, prop);
    if (desc && desc.configurable === false) return;
    let current = value;
    try {
      ObjectDefineProperty(owner, prop, {
        configurable: true,
        enumerable: true,
        get() { return current; },
        set(v) {
          current = v;
          if (v !== null && (typeof v === 'object' || typeof v === 'function')) walk(v, rest);
        },
      });
    } catch { /* ignoruj */ }
  };
  walk(root, chain);
}

const REMOVE = Symbol('remove');

function constantValue(raw, trusted) {
  switch (raw) {
    case 'undefined': return { v: undefined };
    case 'false': return { v: false };
    case 'true': return { v: true };
    case 'null': return { v: null };
    case "''": case '""': case 'emptyStr': case '': return { v: '' };
    case '[]': case 'emptyArr': return { v: [] };
    case '{}': case 'emptyObj': return { v: {} };
    case 'noopFunc': return { v: function () {} };
    case 'noopCallbackFunc': return { v: function () { return function () {}; } };
    case 'trueFunc': return { v: function () { return true; } };
    case 'falseFunc': return { v: function () { return false; } };
    case 'throwFunc': return { v: function () { throw new Error(magic); } };
    case 'noopPromiseResolve': return { v: function () { return Promise.resolve(); } };
    case 'noopPromiseReject': return { v: function () { return Promise.reject(); } };
    case 'yes': case 'no': case 'on': case 'off': return { v: raw };
    case '$remove$': return { v: REMOVE };
  }
  if (/^-?\d+$/.test(raw)) {
    const n = parseInt(raw, 10);
    if (Math.abs(n) <= 0x7FFF || trusted) return { v: n };
    return null;
  }
  if (/^-?\d*\.\d+$/.test(raw) && trusted) return { v: parseFloat(raw) };
  if (trusted && raw.startsWith('json:')) {
    try { return { v: JSON.parse(raw.slice(5)) }; } catch { return null; }
  }
  if (trusted) {
    try { return { v: JSON.parse(raw) }; } catch { return { v: raw }; }
  }
  return null;
}

function setConstantImpl(chain, rawValue, trusted, extra) {
  if (!chain) return;
  const cv = constantValue(rawValue === undefined ? 'undefined' : rawValue, trusted);
  if (!cv) return;
  let value = cv.v;
  const wrap = extra && extra[0];
  if (wrap === 'asFunction') { const v = value; value = function () { return v; }; }
  else if (wrap === 'asCallback') { const v = value; value = function () { return function () { return v; }; }; }
  else if (wrap === 'asResolved') { const v = value; value = Promise.resolve(v); }
  else if (wrap === 'asRejected') { const v = value; value = Promise.reject(v); }
  trapChain(win, chain, (owner, prop) => {
    const desc = ObjectGetOwnPropertyDescriptor(owner, prop);
    if (desc && desc.configurable === false) {
      if (desc.writable && value !== REMOVE) { try { owner[prop] = value; } catch {} }
      return;
    }
    if (value === REMOVE) {
      try {
        ObjectDefineProperty(owner, prop, { configurable: true, get() { return undefined; }, set() {} });
      } catch {}
      return;
    }
    try {
      ObjectDefineProperty(owner, prop, {
        configurable: false,
        enumerable: desc ? desc.enumerable : true,
        get() { return value; },
        set() { /* strona nie może nadpisać */ },
      });
    } catch {}
  });
}

function wrapAccessor(chain, validate) {
  trapChain(win, chain, (owner, prop) => {
    const desc = ObjectGetOwnPropertyDescriptor(owner, prop);
    if (desc && desc.configurable === false) return;
    let value = desc ? desc.value : undefined;
    const getter = desc && desc.get;
    const setter = desc && desc.set;
    try {
      ObjectDefineProperty(owner, prop, {
        configurable: true,
        enumerable: desc ? desc.enumerable : true,
        get() { validate(); return getter ? getter.call(this) : value; },
        set(v) { validate(); if (setter) setter.call(this, v); else value = v; },
      });
    } catch {}
  });
}

function getScriptText(el) {
  let text = el.textContent || '';
  if (el.src) text = el.src + '\n' + text;
  return text;
}

function matchesNumber(rawDelay, delay) {
  if (rawDelay === undefined || rawDelay === '' || rawDelay === '*') return true;
  const not = rawDelay.startsWith('!');
  const n = parseInt(not ? rawDelay.slice(1) : rawDelay, 10);
  return (Number(delay) === n) !== not;
}

function timerDefuser(name, needle = '', rawDelay) {
  const not = needle.startsWith('!');
  const re = toRegex(not ? needle.slice(1) : needle);
  const orig = win[name];
  win[name] = new Proxy(orig, {
    apply(target, thisArg, args) {
      const [cb, delay] = args;
      const text = fnText(cb);
      if (re.test(text) !== not && matchesNumber(rawDelay, delay)) {
        args[0] = function () {};
      }
      return safeReflect.apply(target, thisArg, args);
    },
  });
}

function timerBooster(name, needle = '', rawDelay = '1000', rawBoost = '0.05') {
  const re = toRegex(needle);
  const delay = rawDelay === '*' ? -1 : parseInt(rawDelay, 10) || 1000;
  let boost = parseFloat(rawBoost);
  if (!isFinite(boost)) boost = 0.05;
  boost = Math.min(50, Math.max(0.001, boost));
  const orig = win[name];
  win[name] = new Proxy(orig, {
    apply(target, thisArg, args) {
      const [cb, d] = args;
      if ((delay === -1 || Number(d) === delay) && re.test(fnText(cb))) args[1] = (Number(d) || 0) * boost;
      return safeReflect.apply(target, thisArg, args);
    },
  });
}

function parsePropsToMatch(raw, urlKey = 'url') {
  const out = {};
  if (!raw) return out;
  for (const part of raw.split(/\s+/)) {
    if (!part) continue;
    const m = /^([a-zA-Z]+):(.*)$/.exec(part);
    if (m) out[m[1]] = toRegex(m[2]);
    else out[urlKey] = toRegex(part);
  }
  return out;
}

function propsMatch(props, details) {
  for (const k of Object.keys(props)) {
    const v = details[k];
    if (v === undefined || !props[k].test(String(v))) return false;
  }
  return true;
}

function fakeBody(raw) {
  if (raw === 'emptyObj') return '{}';
  if (raw === 'emptyArr') return '[]';
  if (raw === 'true') return Math.random().toString(36).slice(2, 12);
  return '';
}

// ----- JSON ----------------------------------------------------------------

function pathTokens(p) { return p.split('.'); }

function findOwners(obj, tokens, out) {
  if (obj === null || typeof obj !== 'object') return;
  if (tokens.length === 1) { out.push([obj, tokens[0]]); return; }
  const [head, ...rest] = tokens;
  if (head === '[]' || head === '*') {
    for (const k of Object.keys(obj)) findOwners(obj[k], rest, out);
    return;
  }
  if (Object.prototype.hasOwnProperty.call(obj, head)) findOwners(obj[head], rest, out);
}

function hasPath(obj, p) {
  const owners = [];
  findOwners(obj, pathTokens(p), owners);
  return owners.some(([o, k]) => {
    if (k === '[]' || k === '*') return Object.keys(o).length > 0;
    return Object.prototype.hasOwnProperty.call(o, k);
  });
}

function makePruner(rawPrune = '', rawNeedle = '') {
  const prunePaths = rawPrune.split(/ +/).filter(Boolean);
  const needlePaths = rawNeedle.split(/ +/).filter(Boolean);
  const removeElements = (obj, p) => {
    // "a.[-].b.c" – usuń z tablicy a elementy, które mają ścieżkę b.c
    const at = p.indexOf('[-]');
    const prefix = p.slice(0, at).replace(/\.$/, '');
    const rest = p.slice(at + 3).replace(/^\./, '');
    const holders = [];
    if (prefix) findOwners(obj, pathTokens(prefix), holders);
    const arrays = prefix ? holders.map(([o, k]) => o[k]) : [obj];
    let changed = false;
    for (const arr of arrays) {
      if (!Array.isArray(arr)) continue;
      for (let i = arr.length - 1; i >= 0; i--) {
        if (!rest || hasPath(arr[i], rest)) { arr.splice(i, 1); changed = true; }
      }
    }
    return changed;
  };
  return function prune(obj) {
    if (!prunePaths.length || obj === null || typeof obj !== 'object') return false;
    if (needlePaths.length && !needlePaths.every((p) => hasPath(obj, p))) return false;
    let changed = false;
    for (const p of prunePaths) {
      if (p.includes('[-]')) { if (removeElements(obj, p)) changed = true; continue; }
      const owners = [];
      findOwners(obj, pathTokens(p), owners);
      for (const [o, k] of owners) {
        if (k === '[]' || k === '*') {
          if (Array.isArray(o)) { if (o.length) { o.length = 0; changed = true; } }
          else for (const kk of Object.keys(o)) { delete o[kk]; changed = true; }
        } else if (Object.prototype.hasOwnProperty.call(o, k)) {
          delete o[k];
          changed = true;
        }
      }
    }
    return changed;
  };
}

// ----- DOM -----------------------------------------------------------------

function onDomChange(fn, stay) {
  fn();
  let pending = false;
  const run = () => { pending = false; fn(); };
  const mo = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    (win.requestAnimationFrame || setTimeout)(run);
  });
  const start = () => mo.observe(doc.documentElement || doc, { childList: true, subtree: true, attributes: true });
  start();
  if (!stay) {
    const stop = () => setTimeout(() => mo.disconnect(), 2000);
    if (doc.readyState === 'complete') stop();
    else win.addEventListener('load', stop, { once: true });
  }
  doc.addEventListener('DOMContentLoaded', fn, { once: true });
}

function safeValue(raw) {
  const allowed = ['accept', 'reject', 'yes', 'no', 'y', 'n', 'true', 'false', 'ok', 'on', 'off', 'allow',
    'deny', 'allowed', 'denied', 'necessary', 'required', 'approved', 'disapproved', 'hide', 'hidden',
    'essential', 'nonessential', 'checked', 'unchecked', 'forbidden', 'forever', 'dismiss', 'dismissed',
    'done', 'closed', 'disabled', 'enabled', 'agree', 'agreed', '', 'null', 'undefined', 'emptyObj', 'emptyArr'];
  if (allowed.includes(String(raw).toLowerCase())) {
    if (raw === 'emptyObj') return '{}';
    if (raw === 'emptyArr') return '[]';
    if (raw === 'null' || raw === 'undefined') return raw;
    return raw;
  }
  if (/^\d{1,5}$/.test(raw) && parseInt(raw, 10) <= 32767) return raw;
  return null;
}

function setStorageItem(storageName, key, raw, trusted) {
  if (!key) return;
  let storage;
  try { storage = win[storageName]; } catch { return; }
  if (!storage) return;
  try {
    if (raw === '$remove$') { storage.removeItem(key); return; }
    let value = trusted ? raw : safeValue(raw);
    if (value === null) return;
    if (trusted) {
      if (raw === '$now$') value = String(Date.now());
      else if (raw === '$currentDate$') value = String(new Date());
      else if (raw === '$currentISODate$') value = new Date().toISOString();
    }
    if (storage.getItem(key) === value) return;
    storage.setItem(key, value);
  } catch {}
}

function setCookieImpl(name, value, path, maxAgeSec) {
  if (!name) return;
  const existing = doc.cookie.split(/;\s*/).find((c) => c.startsWith(encodeURIComponent(name) + '='));
  if (existing && existing.slice(existing.indexOf('=') + 1) === value) return;
  let cookie = `${encodeURIComponent(name)}=${value}; path=${path || '/'}`;
  if (maxAgeSec) cookie += `; max-age=${maxAgeSec}`;
  try { doc.cookie = cookie; } catch {}
}

// ----- Scriptlety ----------------------------------------------------------

const S = {
  'set-constant'(chain, value, ...extra) { setConstantImpl(chain, value, false, extra); },
  'trusted-set-constant'(chain, value, ...extra) { setConstantImpl(chain, value, true, extra); },

  'abort-on-property-read'(chain) {
    if (!chain) return;
    trapChain(win, chain, (owner, prop) => {
      try { ObjectDefineProperty(owner, prop, { configurable: true, get: abort, set() {} }); } catch {}
    });
  },

  'abort-on-property-write'(chain) {
    if (!chain) return;
    trapChain(win, chain, (owner, prop) => {
      try { ObjectDefineProperty(owner, prop, { configurable: true, get() { return undefined; }, set: abort }); } catch {}
    });
  },

  'abort-current-script'(chain, needle = '') {
    if (!chain) return;
    const re = needle ? toRegex(needle) : null;
    const self = doc.currentScript;
    wrapAccessor(chain, () => {
      const el = doc.currentScript;
      if (!(el instanceof HTMLScriptElement) || el === self) return;
      if (re && !re.test(getScriptText(el))) return;
      abort();
    });
  },

  'abort-on-stack-trace'(chain, needle = '') {
    if (!chain || !needle) return;
    const re = toRegex(needle === 'inlineScript' || needle === 'injectedScript'
      ? escapeRe(location.href.split('#')[0]) : needle);
    wrapAccessor(chain, () => {
      const stack = new Error().stack || '';
      if (re.test(stack.split('\n').slice(2).join('\n'))) abort();
    });
  },

  'addEventListener-defuser'(type = '', handler = '') {
    if (!type && !handler) return;
    const reType = toRegex(type);
    const reHandler = toRegex(handler);
    const proto = EventTarget.prototype;
    proto.addEventListener = new Proxy(proto.addEventListener, {
      apply(target, thisArg, args) {
        let t = '';
        let h = '';
        try { t = String(args[0]); h = fnText(args[1]); } catch {}
        if (reType.test(t) && reHandler.test(h)) return undefined;
        return safeReflect.apply(target, thisArg, args);
      },
    });
  },

  'no-setTimeout-if'(needle, delay) { timerDefuser('setTimeout', needle, delay); },
  'no-setInterval-if'(needle, delay) { timerDefuser('setInterval', needle, delay); },
  'adjust-setTimeout'(needle, delay, boost) { timerBooster('setTimeout', needle, delay, boost); },
  'adjust-setInterval'(needle, delay, boost) { timerBooster('setInterval', needle, delay, boost); },

  'no-window-open-if'(pattern = '', delay = '', decoy = '') {
    const not = pattern.startsWith('!');
    const re = toRegex(not ? pattern.slice(1) : pattern);
    win.open = new Proxy(win.open, {
      apply(target, thisArg, args) {
        const url = String(args[0] === undefined ? '' : args[0]);
        if (re.test(url) === not) return safeReflect.apply(target, thisArg, args);
        if (decoy === 'obj' || decoy === 'blank') {
          // atrapa okna
        }
        const fake = new Proxy({}, {
          get(t, p) {
            if (p === 'closed') return false;
            if (p === 'opener') return win;
            if (p === 'document') return doc.implementation.createHTMLDocument('');
            if (p === 'location') return { href: url, assign() {}, replace() {} };
            if (p === 'window' || p === 'self') return fake;
            return function () {};
          },
          set() { return true; },
        });
        return fake;
      },
    });
  },

  'no-fetch-if'(rawProps = '', responseBody = '') {
    if (!rawProps) return;
    const props = parsePropsToMatch(rawProps);
    const origFetch = win.fetch;
    if (typeof origFetch !== 'function') return;
    win.fetch = new Proxy(origFetch, {
      apply(target, thisArg, args) {
        const details = {};
        try {
          const [res, init] = args;
          if (res instanceof Request) {
            for (const k of ['url', 'method', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'integrity']) details[k] = res[k];
          } else {
            details.url = String(res);
          }
          if (init && typeof init === 'object') {
            for (const k of Object.keys(init)) { const v = init[k]; details[k] = typeof v === 'string' ? v : (k === 'body' ? String(v) : JSON.stringify(v)); }
          }
          if (!details.method) details.method = 'GET';
        } catch {}
        if (!propsMatch(props, details)) return safeReflect.apply(target, thisArg, args);
        const response = new Response(fakeBody(responseBody), { status: 200, statusText: 'OK' });
        try {
          ObjectDefineProperty(response, 'url', { value: details.url || '' });
          ObjectDefineProperty(response, 'type', { value: 'basic' });
        } catch {}
        return Promise.resolve(response);
      },
    });
  },

  'no-xhr-if'(rawProps = '', directive = '') {
    if (!rawProps) return;
    const props = parsePropsToMatch(rawProps);
    const Native = win.XMLHttpRequest;
    if (!Native) return;
    const fakes = new WeakMap();
    win.XMLHttpRequest = class extends Native {
      open(method, url, ...rest) {
        const details = { method: String(method).toUpperCase(), url: String(url) };
        if (propsMatch(props, details)) fakes.set(this, details);
        else fakes.delete(this);
        return super.open(method, url, ...rest);
      }
      send(...args) {
        const d = fakes.get(this);
        if (!d) return super.send(...args);
        const body = fakeBody(directive);
        try {
          ObjectDefineProperties(this, body);
        } catch {}
        setTimeout(() => {
          for (const type of ['readystatechange', 'load', 'loadend']) {
            try { this.dispatchEvent(new Event(type)); } catch {}
          }
        }, 1);
        function ObjectDefineProperties(xhr, text) {
          const v = (value) => ({ value, configurable: true });
          Object.defineProperties(xhr, {
            readyState: v(4), status: v(200), statusText: v('OK'),
            response: v(xhr.responseType === 'json' ? (text ? JSON.parse(text) : null) : text),
            responseText: v(text), responseURL: v(d.url),
          });
        }
        return undefined;
      }
    };
  },

  'remove-attr'(rawAttrs = '', selector = '', behavior = '') {
    const attrs = rawAttrs.split(/\s*\|\s*/).filter(Boolean);
    if (!attrs.length) return;
    const sel = selector || attrs.map((a) => `[${CSS.escape(a)}]`).join(',');
    const run = () => {
      try {
        for (const el of doc.querySelectorAll(sel)) for (const a of attrs) el.removeAttribute(a);
      } catch {}
    };
    onDomChange(run, behavior.includes('stay'));
  },

  'remove-class'(rawClasses = '', selector = '', behavior = '') {
    const classes = rawClasses.split(/\s*\|\s*/).filter(Boolean);
    if (!classes.length) return;
    const sel = selector || classes.map((c) => '.' + CSS.escape(c)).join(',');
    const run = () => {
      try {
        for (const el of doc.querySelectorAll(sel)) el.classList.remove(...classes);
      } catch {}
    };
    onDomChange(run, behavior.includes('stay'));
  },

  'set-attr'(selector = '', attr = '', value = '') {
    if (!selector || !attr) return;
    if (!/^(|true|false|-?\d{1,5}|\[[\w-]+\])$/.test(value)) return;
    const run = () => {
      try {
        for (const el of doc.querySelectorAll(selector)) {
          const v = value.startsWith('[') ? (el.getAttribute(value.slice(1, -1)) || '') : value;
          if (el.getAttribute(attr) !== v) el.setAttribute(attr, v);
        }
      } catch {}
    };
    onDomChange(run, true);
  },

  'remove-node-text'(nodeName = '', pattern = '') {
    if (!nodeName) return;
    const reName = toRegex(nodeName.startsWith('/') ? nodeName : '^' + escapeRe(nodeName) + '$');
    const reText = toRegex(pattern);
    const check = (node) => {
      if (!reName.test(node.nodeName.toLowerCase())) return;
      const text = node.textContent || '';
      if (pattern && !reText.test(text)) return;
      if (node.nodeType === 3) node.textContent = '';
      else if (node.parentNode) node.textContent = '', node.remove();
    };
    const mo = new MutationObserver((records) => {
      for (const r of records) for (const n of r.addedNodes) { check(n); if (n.nodeType === 1 && n.nodeName === 'SCRIPT') {} }
    });
    mo.observe(doc, { childList: true, subtree: true });
    doc.addEventListener('DOMContentLoaded', () => setTimeout(() => mo.disconnect(), 5000), { once: true });
  },

  'replace-node-text'(nodeName = '', pattern = '', replacement = '') {
    if (!nodeName || !pattern) return;
    const reName = toRegex(nodeName.startsWith('/') ? nodeName : '^' + escapeRe(nodeName) + '$');
    const rePattern = toRegex(pattern, 'g');
    const check = (node) => {
      if (!reName.test(node.nodeName.toLowerCase())) return;
      const text = node.textContent || '';
      rePattern.lastIndex = 0;
      if (!rePattern.test(text)) return;
      rePattern.lastIndex = 0;
      node.textContent = text.replace(rePattern, replacement);
    };
    const mo = new MutationObserver((records) => {
      for (const r of records) for (const n of r.addedNodes) check(n);
    });
    mo.observe(doc, { childList: true, subtree: true });
    doc.addEventListener('DOMContentLoaded', () => setTimeout(() => mo.disconnect(), 5000), { once: true });
  },

  'json-prune'(rawPrune = '', rawNeedle = '') {
    const prune = makePruner(rawPrune, rawNeedle);
    JSON.parse = new Proxy(JSON.parse, {
      apply(target, thisArg, args) {
        const r = safeReflect.apply(target, thisArg, args);
        try { prune(r); } catch {}
        return r;
      },
    });
    Response.prototype.json = new Proxy(Response.prototype.json, {
      apply(target, thisArg, args) {
        return safeReflect.apply(target, thisArg, args).then((o) => { try { prune(o); } catch {} return o; });
      },
    });
  },

  'json-prune-fetch-response'(rawPrune = '', rawNeedle = '', ...rest) {
    const extra = namedArgs(rest);
    const props = parsePropsToMatch(extra.propsToMatch || '');
    const prune = makePruner(rawPrune, rawNeedle);
    const origFetch = win.fetch;
    if (typeof origFetch !== 'function') return;
    win.fetch = new Proxy(origFetch, {
      apply(target, thisArg, args) {
        const p = safeReflect.apply(target, thisArg, args);
        let details;
        try {
          const [res, init] = args;
          details = res instanceof Request ? { url: res.url, method: res.method } : { url: String(res), method: (init && init.method) || 'GET' };
        } catch { return p; }
        if (!propsMatch(props, details)) return p;
        return p.then((resp) => resp.clone().json().then((obj) => {
          if (!prune(obj)) return resp;
          const out = new Response(JSON.stringify(obj), { status: resp.status, statusText: resp.statusText, headers: resp.headers });
          try {
            ObjectDefineProperty(out, 'url', { value: resp.url });
            ObjectDefineProperty(out, 'type', { value: resp.type });
            ObjectDefineProperty(out, 'redirected', { value: resp.redirected });
          } catch {}
          return out;
        }).catch(() => resp));
      },
    });
  },

  'json-prune-xhr-response'(rawPrune = '', rawNeedle = '', ...rest) {
    const extra = namedArgs(rest);
    const props = parsePropsToMatch(extra.propsToMatch || '');
    const prune = makePruner(rawPrune, rawNeedle);
    const Native = win.XMLHttpRequest;
    if (!Native) return;
    const urls = new WeakMap();
    const cache = new WeakMap();
    const responseDesc = ObjectGetOwnPropertyDescriptor(Native.prototype, 'response');
    const textDesc = ObjectGetOwnPropertyDescriptor(Native.prototype, 'responseText');
    const compute = (xhr) => {
      if (cache.has(xhr)) return cache.get(xhr);
      const raw = responseDesc.get.call(xhr);
      let result = { response: raw, text: null };
      try {
        if (xhr.readyState === 4) {
          const type = xhr.responseType;
          let obj = null;
          if (type === 'json') obj = raw;
          else if (type === '' || type === 'text') obj = JSON.parse(raw);
          if (obj && prune(obj)) {
            const text = JSON.stringify(obj);
            result = { response: type === 'json' ? obj : text, text };
          }
          cache.set(xhr, result);
        }
      } catch { if (xhr.readyState === 4) cache.set(xhr, result); }
      return result;
    };
    win.XMLHttpRequest = class extends Native {
      open(method, url, ...r) {
        cache.delete(this);
        urls.set(this, propsMatch(props, { method: String(method).toUpperCase(), url: String(url) }));
        return super.open(method, url, ...r);
      }
      get response() {
        if (!urls.get(this)) return responseDesc.get.call(this);
        return compute(this).response;
      }
      get responseText() {
        if (!urls.get(this)) return textDesc.get.call(this);
        const r = compute(this);
        return r.text !== null ? r.text : textDesc.get.call(this);
      }
    };
  },

  'set-cookie'(name = '', value = '', path = '') {
    const v = safeValue(value);
    if (v === null) return;
    setCookieImpl(name, encodeURIComponent(v), path === 'none' ? '' : path);
  },

  'trusted-set-cookie'(name = '', value = '', offset = '', path = '') {
    let v = value;
    if (v === '$now$') v = String(Date.now());
    else if (v === '$currentDate$') v = String(new Date());
    else if (v === '$currentISODate$') v = new Date().toISOString();
    let maxAge = 0;
    if (offset === '1day') maxAge = 86400;
    else if (offset === '1year') maxAge = 31536000;
    else if (/^\d+$/.test(offset)) maxAge = parseInt(offset, 10);
    setCookieImpl(name, encodeURIComponent(v), path === 'none' ? '' : path, maxAge);
  },

  'remove-cookie'(needle = '') {
    const re = toRegex(needle);
    const remove = () => {
      for (const c of doc.cookie.split(/;\s*/)) {
        const name = c.split('=')[0];
        if (!name || !re.test(name)) continue;
        const parts = location.hostname.split('.');
        const expire = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        for (let i = 0; i < parts.length - 1; i++) {
          const domain = parts.slice(i).join('.');
          doc.cookie = `${name}${expire}; path=/; domain=${domain}`;
          doc.cookie = `${name}${expire}; path=/; domain=.${domain}`;
        }
        doc.cookie = `${name}${expire}; path=/`;
        doc.cookie = `${name}${expire}`;
      }
    };
    remove();
    win.addEventListener('beforeunload', remove);
    doc.addEventListener('visibilitychange', remove);
  },

  'set-local-storage-item'(key, value) { setStorageItem('localStorage', key, value, false); },
  'set-session-storage-item'(key, value) { setStorageItem('sessionStorage', key, value, false); },
  'trusted-set-local-storage-item'(key, value) { setStorageItem('localStorage', key, value, true); },
  'trusted-set-session-storage-item'(key, value) { setStorageItem('sessionStorage', key, value, true); },

  'noeval'() {
    win.eval = new Proxy(win.eval, { apply() { return undefined; } });
  },

  'noeval-if'(needle = '') {
    const re = toRegex(needle);
    win.eval = new Proxy(win.eval, {
      apply(target, thisArg, args) {
        if (re.test(String(args[0]))) return undefined;
        return safeReflect.apply(target, thisArg, args);
      },
    });
  },

  'nowebrtc'() {
    const names = ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection'];
    const Fake = function () {
      return {
        close() {}, createDataChannel() { return { close() {} }; }, createOffer() { return Promise.resolve(); },
        createAnswer() { return Promise.resolve(); }, setLocalDescription() { return Promise.resolve(); },
        setRemoteDescription() { return Promise.resolve(); }, addIceCandidate() { return Promise.resolve(); },
        addEventListener() {}, removeEventListener() {}, getStats() { return Promise.resolve(new Map()); },
      };
    };
    for (const n of names) if (n in win) { try { win[n] = Fake; } catch {} }
  },

  'trusted-click-element'(rawSelectors = '', extraMatch = '', rawDelay = '') {
    const selectors = rawSelectors.split(/\s*,\s+/).map((s) => s.trim()).filter(Boolean);
    if (!selectors.length) return;
    // dodatkowe warunki: cookie:nazwa / localStorage:klucz (+ opcjonalnie !negacja)
    if (extraMatch) {
      for (const cond of extraMatch.split(/\s*,\s*/)) {
        const m = /^(!)?(cookie|localStorage):(.+)$/.exec(cond);
        if (!m) continue;
        const [, not, kind, key] = m;
        const re = toRegex(key);
        let present = false;
        try {
          present = kind === 'cookie'
            ? doc.cookie.split(/;\s*/).some((c) => re.test(c.split('=')[0]))
            : Object.keys(localStorage).some((k) => re.test(k));
        } catch {}
        if (present === !!not) return;
      }
    }
    const delay = Math.max(1, parseInt(rawDelay, 10) || 1);
    const deadline = Date.now() + 10000;
    let index = 0;
    const query = (s) => {
      // obsługa "a >>> b" (shadow DOM)
      const parts = s.split(/\s*>>>\s*/);
      let root = doc;
      let el = null;
      for (const p of parts) {
        el = root.querySelector(p);
        if (!el) return null;
        root = el.shadowRoot || el;
      }
      return el;
    };
    const step = () => {
      if (index >= selectors.length || Date.now() > deadline) { mo.disconnect(); return; }
      const el = query(selectors[index]);
      if (!el) return;
      index++;
      setTimeout(() => { try { el.click(); } catch {} step(); }, delay);
    };
    const mo = new MutationObserver(() => step());
    const start = () => { mo.observe(doc.documentElement || doc, { childList: true, subtree: true }); step(); };
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start, { once: true }); else start();
    setTimeout(() => mo.disconnect(), 10000);
  },
};

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
  try { hostname = location.hostname; } catch {}
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
    const fn = S[call[0]];
    if (!fn) continue;
    try { fn(...call.slice(1)); } catch { /* scriptlet nie może zepsuć strony */ }
  }
}
