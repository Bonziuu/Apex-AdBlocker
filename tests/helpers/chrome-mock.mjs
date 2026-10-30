// Atrapa API Chrome dla testów service workera (background.js).

import { i18nFor } from './i18n-mock.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../../tools/lists-config.mjs';

let counter = 0;

/**
 * Tworzy atrapę chrome.* i ładuje świeżą kopię background.js.
 * opts.failRegister(id, script) → true, aby rejestracja danego skryptu się nie powiodła
 * opts.failRulesets → true, aby updateEnabledRulesets rzucało błąd
 * opts.failDynamic → true (albo funkcja zwracająca true), aby updateDynamicRules rzucało błąd
 * opts.files → podmiana plików rozszerzenia (ścieżka → obiekt JSON)
 * opts.registered → skrypty zarejestrowane przed startem service workera (np. utrwalone przez Chrome)
 * opts.local → początkowa zawartość chrome.storage.local
 * opts.fetchDelay(path) → opóźnienie (ms) odczytu pliku rozszerzenia (wyścigi)
 * opts.matchedRules(filter) → wynik getMatchedRules (albo rzuca błąd, jak Chrome bez activeTab)
 * opts.badgeText → tekst plakietki zwracany przez chrome.action.getBadgeText
 * opts.tabSendMessage(tabId, msg) → wynik chrome.tabs.sendMessage (może rzucić / odrzucić, jak bez odbiorcy)
 */
export async function loadBackground(opts = {}) {
  const store = opts.local ? structuredClone(opts.local) : {};
  const session = {};
  const state = {
    enabledRulesets: new Set(),
    dynamic: [],
    registered: opts.registered ? structuredClone(opts.registered) : [],
    css: [],
    executed: [],
    staticRuleUpdates: [],
    reloads: [],
    tabsCreated: [],
    calls: { register: 0, unregister: 0, registeredInCalls: [] },
    fetches: [],
    matchedRulesCalls: [],
    icons: [],
    tabMessages: [],
    listeners: {},
  };
  const ev = (name) => ({ addListener(fn) { state.listeners[name] = fn; } });
  globalThis.fetch = async (url, init = {}) => {
    const rel = String(url).replace('ext://', '');
    state.fetches.push({ path: rel, method: init.method || 'GET' });
    const delay = opts.fetchDelay ? opts.fetchDelay(rel) : 0;
    if (delay) await new Promise((r) => setTimeout(r, delay));
    if (opts.files && rel in opts.files) {
      const v = opts.files[rel];
      if (v instanceof Error) return { ok: false, status: 404, json: async () => { throw v; } };
      return { ok: true, status: 200, json: async () => JSON.parse(JSON.stringify(v)) };
    }
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) return { ok: false, status: 404, json: async () => { throw new Error('404'); } };
    return { ok: true, status: 200, json: async () => JSON.parse(fs.readFileSync(p, 'utf8')) };
  };
  globalThis.chrome = {
    i18n: i18nFor('pl'),
    runtime: {
      getURL: (p) => 'ext://' + p,
      onInstalled: ev('installed'),
      onStartup: ev('startup'),
      onMessage: ev('message'),
      getManifest: () => ({ version: '0.3.4', manifest_version: 3 }),
    },
    storage: {
      session: {
        get: async (keys) => {
          const list = typeof keys === 'string' ? [keys] : keys;
          return Object.fromEntries(list.filter((k) => k in session).map((k) => [k, structuredClone(session[k])]));
        },
        set: async (o) => { Object.assign(session, structuredClone(o)); },
        remove: async (k) => { for (const key of [].concat(k)) delete session[key]; },
      },
      local: {
        get: async (keys) => {
          const list = typeof keys === 'string' ? [keys] : keys;
          const snapshot = Object.fromEntries(list.filter((k) => k in store).map((k) => [k, structuredClone(store[k])]));
          if (opts.storageGetDelay) await new Promise((r) => setTimeout(r, opts.storageGetDelay(list)));
          return snapshot;
        },
        set: async (o) => {
          if (opts.failStorageSet?.(o)) throw new Error('QUOTA_BYTES quota exceeded');
          Object.assign(store, structuredClone(o));
        },
        remove: async (k) => { for (const key of [].concat(k)) delete store[key]; },
      },
    },
    declarativeNetRequest: {
      setExtensionActionOptions: async () => {},
      updateEnabledRulesets: async ({ enableRulesetIds = [], disableRulesetIds = [] }) => {
        if (opts.failRulesets) throw new Error('Internal error: rule count exceeded');
        for (const id of enableRulesetIds) state.enabledRulesets.add(id);
        for (const id of disableRulesetIds) state.enabledRulesets.delete(id);
      },
      getEnabledRulesets: async () => [...state.enabledRulesets],
      updateStaticRules: async (o) => { state.staticRuleUpdates.push(o); },
      getDynamicRules: async () => structuredClone(state.dynamic),
      // jak w Chrome: atomowo; dodanie reguły o istniejącym (nieusuwanym) id to błąd
      updateDynamicRules: async ({ removeRuleIds = [], addRules = [] }) => {
        if (typeof opts.failDynamic === 'function' ? opts.failDynamic() : opts.failDynamic) throw new Error('Internal error: dynamic rule count exceeded');
        await new Promise((r) => setTimeout(r, 1));
        const kept = state.dynamic.filter((r) => !removeRuleIds.includes(r.id));
        const ids = new Set(kept.map((r) => r.id));
        for (const r of addRules) {
          if (ids.has(r.id)) throw new Error(`Rule with id ${r.id} does not have a unique ID.`);
          ids.add(r.id);
        }
        state.dynamic = kept.concat(addRules);
      },
      getMatchedRules: async (filter) => {
        state.matchedRulesCalls.push(structuredClone(filter));
        return opts.matchedRules ? opts.matchedRules(filter) : { rulesMatchedInfo: [] };
      },
      getAvailableStaticRuleCount: async () => 300000,
    },
    scripting: {
      getRegisteredContentScripts: async () => state.registered.slice(),
      unregisterContentScripts: async ({ ids }) => {
        state.calls.unregister++;
        state.registered = state.registered.filter((r) => !ids.includes(r.id));
      },
      // jak w Chrome: wywołanie jest atomowe – jeden błędny skrypt odrzuca całą paczkę
      registerContentScripts: async (arr) => {
        state.calls.register++;
        state.calls.registeredInCalls.push(arr.length);
        for (const s of arr) {
          if (opts.failRegister && opts.failRegister(s.id, s)) throw new Error(`Invalid match pattern in ${s.id}`);
        }
        for (const s of arr) state.registered.push(structuredClone(s));
      },
      insertCSS: async (o) => { state.css.push(o); },
      executeScript: async (o) => {
        if (opts.failExecute?.(o)) throw new Error('No document with id');
        state.executed.push(structuredClone(o));
        return [];
      },
    },
    action: { setBadgeBackgroundColor: async () => {}, setBadgeTextColor: async () => {}, setIcon: async (o) => { state.icons.push(structuredClone(o)); }, getBadgeText: async () => (opts.badgeText ?? '') },
    tabs: {
      get: async (id) => ({ id, url: opts.tabUrl || 'https://www.example.com/' }),
      reload: async (id) => {
        if (opts.failReload) throw new Error('The tab was closed');
        state.reloads.push(id);
      },
      onRemoved: ev('tabRemoved'),
      onUpdated: ev('tabUpdated'),
      sendMessage: (tabId, msg) => {
        // w chwili wysłania zapamiętujemy też stan raportów (kolejność: najpierw czyszczenie, potem prośba)
        state.tabMessages.push({ tabId, msg: structuredClone(msg) });
        return opts.tabSendMessage ? opts.tabSendMessage(tabId, msg) : Promise.resolve(undefined);
      },
      create: async (o) => { state.tabsCreated.push(o); return { id: 900 + state.tabsCreated.length, ...o }; },
    },
  };
  const origError = console.error;
  const origInfo = console.info;
  console.error = () => {};
  console.info = () => {};
  const mod = await import(pathToFileURL(path.join(ROOT, 'background.js')).href + `?test=${++counter}`);
  // domyślny nadawca: strona rozszerzenia (popup/Opcje); skrypty treści – helper sender()
  const send = (msg, sender = extensionSender()) => new Promise((resolve) => state.listeners.message(msg, sender, resolve));
  const restore = () => { console.error = origError; console.info = origInfo; };
  return { mod, state, store, session, send, restore, install: () => state.listeners.installed() };
}

export const sender = (url, frameId = 0, tabUrl = url) => ({ tab: { id: 7, url: tabUrl }, frameId, url });

/** Nadawca będący stroną rozszerzenia (zgodny z runtime.getURL z mocka). */
export const extensionSender = (page = 'options/options.html') => ({ id: 'apex-test', url: 'ext://' + page });
