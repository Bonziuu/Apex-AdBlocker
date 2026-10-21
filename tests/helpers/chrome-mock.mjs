// Atrapa API Chrome dla testów service workera (background.js).

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../../tools/lists-config.mjs';

let counter = 0;

/**
 * Tworzy atrapę chrome.* i ładuje świeżą kopię background.js.
 * opts.failRegister(id) → true, aby rejestracja danego skryptu się nie powiodła
 * opts.failRulesets → true, aby updateEnabledRulesets rzucało błąd
 * opts.files → podmiana plików rozszerzenia (ścieżka → obiekt JSON)
 */
export async function loadBackground(opts = {}) {
  const store = {};
  const state = {
    enabledRulesets: new Set(),
    dynamic: [],
    registered: [],
    css: [],
    staticRuleUpdates: [],
    reloads: [],
    listeners: {},
  };
  const ev = (name) => ({ addListener(fn) { state.listeners[name] = fn; } });
  globalThis.fetch = async (url) => {
    const rel = String(url).replace('ext://', '');
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
    runtime: {
      getURL: (p) => 'ext://' + p,
      onInstalled: ev('installed'),
      onStartup: ev('startup'),
      onMessage: ev('message'),
      getManifest: () => ({ version: '0.2.1', version_name: '0.2.1-dev', manifest_version: 3 }),
    },
    storage: {
      local: {
        get: async (keys) => {
          const list = typeof keys === 'string' ? [keys] : keys;
          return Object.fromEntries(list.filter((k) => k in store).map((k) => [k, structuredClone(store[k])]));
        },
        set: async (o) => { Object.assign(store, structuredClone(o)); },
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
      getDynamicRules: async () => state.dynamic,
      updateDynamicRules: async ({ removeRuleIds = [], addRules = [] }) => {
        state.dynamic = state.dynamic.filter((r) => !removeRuleIds.includes(r.id)).concat(addRules);
      },
      getMatchedRules: async () => ({ rulesMatchedInfo: [] }),
      getAvailableStaticRuleCount: async () => 300000,
    },
    scripting: {
      getRegisteredContentScripts: async () => state.registered.slice(),
      unregisterContentScripts: async ({ ids }) => { state.registered = state.registered.filter((r) => !ids.includes(r.id)); },
      registerContentScripts: async (arr) => {
        for (const s of arr) {
          if (opts.failRegister && opts.failRegister(s.id)) throw new Error(`Invalid match pattern in ${s.id}`);
          state.registered.push(s);
        }
      },
      insertCSS: async (o) => { state.css.push(o); },
      executeScript: async () => {},
    },
    action: { setBadgeBackgroundColor: async () => {}, setBadgeTextColor: async () => {}, setIcon: async () => {}, getBadgeText: async () => '' },
    webNavigation: { onCommitted: ev('committed') },
    tabs: {
      get: async (id) => ({ id, url: opts.tabUrl || 'https://www.example.com/' }),
      reload: (id) => state.reloads.push(id),
      onRemoved: ev('tabRemoved'),
      create: async () => {},
    },
  };
  const origError = console.error;
  const origInfo = console.info;
  console.error = () => {};
  console.info = () => {};
  const mod = await import(pathToFileURL(path.join(ROOT, 'background.js')).href + `?test=${++counter}`);
  const send = (msg, sender = {}) => new Promise((resolve) => state.listeners.message(msg, sender, resolve));
  const restore = () => { console.error = origError; console.info = origInfo; };
  return { mod, state, store, send, restore, install: () => state.listeners.installed() };
}

export const sender = (url, frameId = 0, tabUrl = url) => ({ tab: { id: 7, url: tabUrl }, frameId, url });
