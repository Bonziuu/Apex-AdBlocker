// Środowisko testowe dla biblioteki scriptletów: minimalna atrapa przeglądarki
// uruchamiana w node:vm. Atrapy są definiowane WEWNĄTRZ kontekstu, żeby obiekty
// i klasy pochodziły z tej samej „przestrzeni” co kod scriptletów (jak w Chrome).

import vm from 'node:vm';
import fs from 'node:fs';
import { loadScriptletLibrary } from '../../tools/build.mjs';

const ENTITY_HELPER = fs.readFileSync(new URL('../../shared/entity-hosts.js', import.meta.url), 'utf8');

const PRELUDE = String.raw`
var window = globalThis; var self = globalThis;
var __nativeParse = JSON.parse; // Response.json() w przeglądarce nie woła JSON.parse strony
var __listeners = {};
function __on(target, type, fn) { (target.__l ||= {}); (target.__l[type] ||= []).push(fn); }
function __off(target, type, fn) { const l = target.__l && target.__l[type]; if (l) { const i = l.indexOf(fn); if (i >= 0) l.splice(i, 1); } }
function __fire(target, type, ev = { type }) { const l = (target.__l && target.__l[type]) || []; for (const fn of l.slice()) { if (typeof fn === 'function') fn.call(target, ev); else if (fn && typeof fn.handleEvent === 'function') fn.handleEvent(ev); } }

class Node {
  constructor(nodeName, text = '', children = []) {
    this.nodeName = nodeName; this._text = text; this.childNodes = [];
    this.nodeType = nodeName === '#text' ? 3 : 1;
    for (const c of children) this.appendChild(c);
  }
  appendChild(c) { c.parentNode = this; this.childNodes.push(c); return c; }
  get textContent() { return this.childNodes.length ? this.childNodes.map((c) => c.textContent).join('') : this._text; }
  set textContent(v) { this._text = String(v); this.childNodes = []; }
}
class Element extends Node {}
class HTMLElement extends Element {}
class HTMLScriptElement extends HTMLElement {
  constructor(text = '', src = '') { super('SCRIPT', text); this.src = src; }
}
class HTMLIFrameElement extends HTMLElement {
  constructor(contentWindow) { super('IFRAME'); this.contentWindow = contentWindow; }
}
var NodeFilter = { SHOW_ELEMENT: 1, SHOW_TEXT: 4 };

var __observers = [];
globalThis.MutationObserver = class MutationObserver {
  constructor(cb) { this.cb = cb; this.active = false; }
  observe(target, options = {}) { this.active = true; this.options = options; if (!__observers.includes(this)) __observers.push(this); }
  disconnect() { this.active = false; }
  takeRecords() { return []; }
}
function __mutate(addedNodes) {
  for (const o of __observers.slice()) if (o.active) o.cb([{ type: 'childList', addedNodes, removedNodes: [] }], o);
}
function __mutateAttribute(target, attributeName) {
  for (const o of __observers.slice()) {
    if (!o.active || !o.options.attributes) continue;
    if (o.options.attributeFilter && !o.options.attributeFilter.includes(attributeName)) continue;
    o.cb([{ type: 'attributes', target, attributeName, addedNodes: [], removedNodes: [] }], o);
  }
}

var __cookies = new Map();
var document = {
  currentScript: null,
  readyState: 'loading',
  documentElement: new Node('HTML'),
  baseURI: 'https://' + __HOST__ + '/',
  domain: __HOST__,
  body: null,
  addEventListener(type, fn) { __on(this, type, fn); },
  removeEventListener(type, fn) { __off(this, type, fn); },
  createTreeWalker(root) {
    const list = [];
    const walk = (n) => { for (const c of n.childNodes) { list.push(c); walk(c); } };
    walk(root);
    let i = 0;
    return { nextNode: () => (i < list.length ? list[i++] : null) };
  },
  querySelectorAll() { return []; },
  get cookie() { return [...__cookies].map(([k, v]) => k + '=' + v).join('; '); },
  set cookie(str) {
    const parts = String(str).split(';').map((s) => s.trim());
    const [nv, ...attrs] = parts;
    const pos = nv.indexOf('=');
    const name = nv.slice(0, pos);
    const value = nv.slice(pos + 1);
    const expired = attrs.some((a) => /^max-age=-/i.test(a) || /^expires=Thu, 01 Jan 1970/i.test(a));
    if (expired) __cookies.delete(name); else __cookies.set(name, value);
  },
};
function __setReadyState(s) { document.readyState = s; __fire(document, 'readystatechange'); }

class FakeStorage {
  constructor() { this.m = new Map(); }
  get length() { return this.m.size; }
  key(i) { return [...this.m.keys()][i] ?? null; }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(String(k), String(v)); }
  removeItem(k) { this.m.delete(k); }
}
var localStorage = new FakeStorage();
var sessionStorage = new FakeStorage();

globalThis.Headers = class Headers { constructor(h) { this.h = h || {}; } }
globalThis.Response = class Response {
  constructor(body, init = {}) {
    this._body = body == null ? '' : String(body);
    this.status = init.status ?? 200;
    this.statusText = init.statusText ?? '';
    this.headers = init.headers ?? {};
    this.ok = this.status >= 200 && this.status < 300;
    this.type = 'basic'; this.url = ''; this.redirected = false;
  }
  clone() { const r = new Response(this._body, this); r.url = this.url; r.type = this.type; return r; }
  text() { return Promise.resolve(this._body); }
  json() { return Promise.resolve().then(() => __nativeParse(this._body)); }
  static json(o, init) { return new Response(JSON.stringify(o), init); }
}
globalThis.Request = class Request {
  constructor(url, init = {}) { this.url = String(url); this.method = init.method || 'GET'; }
  clone() { return new Request(this.url, this); }
  get [Symbol.toStringTag]() { return 'Request'; }
}
var __fetchLog = [];
var __respond = () => ({ body: '' });
function fetch(resource, init) {
  const url = typeof resource === 'object' && resource.url ? resource.url : String(resource);
  __fetchLog.push(url);
  const r = __respond(url, init);
  const resp = new Response(r.body, { status: r.status || 200 });
  resp.url = url;
  return Promise.resolve(resp);
}

var __xhrRespond = () => '';
globalThis.XMLHttpRequest = class XMLHttpRequest {
  constructor() { this.readyState = 0; this.responseType = ''; this._text = ''; this._jsonResponse = undefined; this.sent = false; }
  open(method, url) { this._method = method; this._url = String(url); this._text = ''; this._jsonResponse = undefined; this._status = 0; this.sent = false; this.readyState = 1; }
  send() { this.sent = true; this._text = __xhrRespond(this._method, this._url); this.readyState = 4; this._status = 200; this.dispatchEvent({ type: 'load' }); }
  get response() {
    if (this.responseType !== 'json') return this.readyState < 3 ? '' : this._text;
    if (this.readyState !== 4) return null;
    if (this._jsonResponse === undefined) {
      try { this._jsonResponse = __nativeParse(this._text); } catch { this._jsonResponse = null; }
    }
    return this._jsonResponse;
  }
  get responseText() { return this._text; }
  get responseXML() { return null; }
  get status() { return this._status || 0; }
  addEventListener(t, f) { __on(this, t, f); }
  dispatchEvent(e) { __fire(this, e.type, e); return true; }
  getResponseHeader() { return null; }
  getAllResponseHeaders() { return ''; }
}

globalThis.EventTarget = class EventTarget {
  addEventListener(type, fn) { __on(this, type, fn); }
  removeEventListener(type, fn) { __off(this, type, fn); }
  dispatchEvent(ev) { __fire(this, ev.type, ev); return true; }
}
globalThis.Event = class Event { constructor(type) { this.type = type; } }
window.addEventListener = function (t, f) { __on(window, t, f); };
window.removeEventListener = function (t, f) { __off(window, t, f); };

var CSS = { escape: (s) => String(s).replace(/[^\w-]/g, (c) => '\\' + c) };
var requestAnimationFrame = (fn) => setTimeout(fn, 0);
var requestIdleCallback = (fn) => setTimeout(fn, 0);
var cancelIdleCallback = (id) => clearTimeout(id);
var __opened = [];
function open(...args) { __opened.push(args); return { closed: false, real: true }; }
var atob = (s) => Buffer.from(s, 'base64').toString('binary');
// W przeglądarce klasy DOM są właściwościami obiektu globalnego – tu też.
Object.assign(globalThis, { Node, Element, HTMLElement, HTMLScriptElement, HTMLIFrameElement, FakeStorage });
`;

/**
 * Tworzy kontekst z atrapą przeglądarki.
 * @param {string} host hostname strony
 */
export function createEnv(host = 'example.com') {
  const ctx = {
    console, setTimeout, clearTimeout, setInterval, clearInterval, URL, Buffer,
    location: { hostname: host, href: `https://${host}/`, pathname: '/', search: '', ancestorOrigins: [] },
  };
  vm.createContext(ctx);
  vm.runInContext(PRELUDE.replaceAll('__HOST__', JSON.stringify(host)), ctx);
  vm.runInContext(ENTITY_HELPER, ctx);
  return ctx;
}

let libSource = null;

/** Ładuje bibliotekę scriptletów i uruchamia podane wywołania dla hosta. */
export function runScriptlets(ctx, calls, { host, except = {} } = {}) {
  if (!libSource) libSource = loadScriptletLibrary();
  const h = host || ctx.location.hostname;
  const hosts = { [h]: calls.map((_, i) => i) };
  const code = `(function(){const CALLS=${JSON.stringify(calls)};const HOSTS=${JSON.stringify(hosts)};const EXCEPT=${JSON.stringify(except)};\n${libSource}\nrunForHost(CALLS,HOSTS,EXCEPT);})();`;
  vm.runInContext(code, ctx);
  return ctx;
}

/** Skrót: nowe środowisko + uruchomienie scriptletów. */
export function withScriptlets(calls, host = 'example.com', opts = {}) {
  const ctx = createEnv(host);
  if (opts.before) opts.before(ctx);
  return runScriptlets(ctx, calls, { host, ...opts });
}

export const run = (ctx, code) => vm.runInContext(code, ctx);
export const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

/** Zamienia obiekty z kontekstu vm na zwykłe obiekty (do porównań deepStrictEqual). */
export const plain = (x) => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)));
