// Tarcza – service worker.
// Odpowiada za: włączanie list (zestawy reguł DNR), wyłączanie ochrony na
// wybranych stronach, własne filtry użytkownika, rejestrację scriptletów oraz
// wstrzykiwanie CSS ukrywającego reklamy (filtry kosmetyczne).

import {
  classifyLine, parseNetworkFilter, parseCosmeticFilter, validateRule,
  splitSelectorList, hostKeys, PRIORITY,
} from './shared/parser.js';

const SITE_RULE_ID = 1;
const USER_RULE_BASE = 1000;
const MAX_USER_RULES = 5000;
const HIDE_ATTR = 'data-tarcza-hide';

// ---------------------------------------------------------------------------
// Stan

let listsMeta = null;           // data/lists.json
const listData = new Map();     // id → dane kosmetyczne (leniwie)
const hostCache = new Map();    // host → wynik dla stron (czyszczony przy zmianach)
const allowIds = new Map();     // id listy → Set identyfikatorów reguł typu allow
let state = null;               // { enabledLists, disabledSites, userFilters }
let user = null;                // skompilowane własne filtry

async function getListsMeta() {
  if (!listsMeta) {
    const r = await fetch(chrome.runtime.getURL('data/lists.json'));
    listsMeta = await r.json();
  }
  return listsMeta;
}

async function getState() {
  if (state) return state;
  const meta = await getListsMeta();
  const stored = await chrome.storage.local.get(['enabledLists', 'disabledSites', 'userFilters']);
  state = {
    enabledLists: Array.isArray(stored.enabledLists)
      ? stored.enabledLists.filter((id) => meta.some((m) => m.id === id))
      : meta.filter((m) => m.enabledByDefault).map((m) => m.id),
    disabledSites: Array.isArray(stored.disabledSites) ? stored.disabledSites : [],
    userFilters: typeof stored.userFilters === 'string' ? stored.userFilters : '',
  };
  user = compileUserFilters(state.userFilters);
  return state;
}

async function saveState(patch) {
  const s = await getState();
  Object.assign(s, patch);
  await chrome.storage.local.set(patch);
  if ('userFilters' in patch) user = compileUserFilters(s.userFilters);
  hostCache.clear();
}

function toSet(obj) {
  // zamienia tablice hostów na zbiory dla szybkiego sprawdzania
  obj.ghideSet = new Set(obj.ghide || []);
  obj.ehideSet = new Set(obj.ehide || []);
  obj.docAllowSet = new Set(obj.docAllow || []);
  return obj;
}

async function getListData(id) {
  let d = listData.get(id);
  if (!d) {
    d = fetch(chrome.runtime.getURL(`data/${id}.json`)).then((r) => r.json()).then(toSet);
    listData.set(id, d);
  }
  return d;
}

// ---------------------------------------------------------------------------
// Pomocnicze

export function normalizeHost(h) {
  return String(h || '').toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
}

function hostOf(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return u.hostname.replace(/\.$/, '');
  } catch { return ''; }
}

function isSiteDisabled(host, s) {
  if (!host) return false;
  const keys = hostKeys(host);
  return s.disabledSites.some((d) => keys.includes(d));
}

function sitePatterns(host) {
  return [`*://*.${host}/*`];
}

// ---------------------------------------------------------------------------
// Własne filtry

function compileUserFilters(text) {
  const out = {
    rules: [],
    spec: {}, unhide: {}, style: {}, proc: {}, genC: [],
    errors: [], count: 0,
  };
  const lines = String(text || '').split(/\r?\n/);
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    const c = classifyLine(line);
    if (c.kind === 'comment') return;
    if (c.kind === 'network') {
      const res = parseNetworkFilter(c.text, { trusted: true });
      if (!res || (!res.rule && !res.cosmeticHosts)) { out.errors.push({ line: i + 1, text: line, reason: 'nieobsługiwany filtr sieciowy' }); return; }
      if (res.rule) {
        if (!validateRule(res.rule)) { out.errors.push({ line: i + 1, text: line, reason: 'niepoprawna reguła' }); return; }
        res.rule.priority += PRIORITY.user - 1;
        out.rules.push(res.rule);
      }
      out.count++;
      return;
    }
    const f = parseCosmeticFilter(c);
    if (!f) { out.errors.push({ line: i + 1, text: line, reason: 'nieobsługiwany filtr kosmetyczny' }); return; }
    const add = (obj, h, v) => { (obj[h] ||= []).push(v); };
    switch (f.type) {
      case 'hide':
        for (const sel of splitSelectorList(f.selector)) {
          if (f.include.length) for (const h of f.include) add(out.spec, h, sel);
          else out.genC.push(sel);
          for (const h of f.exclude) add(out.unhide, h, sel);
        }
        break;
      case 'unhide':
        for (const sel of splitSelectorList(f.selector)) for (const h of f.include) add(out.unhide, h, sel);
        break;
      case 'style':
        for (const h of f.include) add(out.style, h, [f.selector, f.css]);
        break;
      case 'procedural':
        for (const h of f.include) add(out.proc, h, f.tasks);
        break;
      default:
        out.errors.push({ line: i + 1, text: line, reason: 'scriptlety (+js) nie są dostępne w moich filtrach' });
        return;
    }
    out.count++;
  });
  return out;
}

// ---------------------------------------------------------------------------
// Synchronizacja z Chrome

async function syncRulesets() {
  const s = await getState();
  const meta = await getListsMeta();
  const enable = meta.filter((m) => s.enabledLists.includes(m.id)).map((m) => m.id);
  const disable = meta.filter((m) => !s.enabledLists.includes(m.id)).map((m) => m.id);
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: enable,
    disableRulesetIds: disable,
  });
}

async function syncDynamicRules() {
  const s = await getState();
  const rules = [];
  if (s.disabledSites.length) {
    rules.push({
      id: SITE_RULE_ID,
      priority: PRIORITY.siteDisabled,
      action: { type: 'allowAllRequests' },
      condition: { requestDomains: s.disabledSites, resourceTypes: ['main_frame'] },
    });
  }
  user.rules.slice(0, MAX_USER_RULES).forEach((r, i) => {
    rules.push({ ...r, id: USER_RULE_BASE + i });
  });
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((r) => r.id),
    addRules: rules,
  });
}

async function syncScriptlets() {
  const s = await getState();
  const meta = await getListsMeta();
  const registered = await chrome.scripting.getRegisteredContentScripts();
  const ours = registered.filter((r) => r.id.startsWith('sl-'));
  if (ours.length) await chrome.scripting.unregisterContentScripts({ ids: ours.map((r) => r.id) });

  const excludeMatches = s.disabledSites.flatMap(sitePatterns);
  const scripts = [];
  for (const m of meta) {
    if (!s.enabledLists.includes(m.id)) continue;
    const r = await fetch(chrome.runtime.getURL(`data/${m.id}.scriptlets.json`));
    const files = await r.json();
    files.forEach((f, n) => {
      scripts.push({
        id: `sl-${m.id}-${n}`,
        js: [f.file],
        matches: f.matches,
        excludeMatches: excludeMatches.length ? excludeMatches : undefined,
        runAt: 'document_start',
        allFrames: true,
        world: 'MAIN',
        persistAcrossSessions: true,
      });
    });
  }
  for (const sc of scripts) {
    if (!sc.excludeMatches) delete sc.excludeMatches;
    try {
      await chrome.scripting.registerContentScripts([sc]);
    } catch (e) {
      console.warn('Tarcza: nie udało się zarejestrować', sc.id, e);
    }
  }
}

async function syncAll() {
  await getState();
  await Promise.allSettled([syncRulesets(), syncDynamicRules(), syncScriptlets()]);
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.declarativeNetRequest.setExtensionActionOptions({ displayActionCountAsBadgeText: true });
  await chrome.action.setBadgeBackgroundColor({ color: '#5b5bd6' });
  try { await chrome.action.setBadgeTextColor({ color: '#ffffff' }); } catch {}
  await syncAll();
});

chrome.runtime.onStartup.addListener(async () => {
  const registered = await chrome.scripting.getRegisteredContentScripts();
  if (!registered.some((r) => r.id.startsWith('sl-'))) await syncScriptlets();
});

// ---------------------------------------------------------------------------
// Filtry kosmetyczne

async function cosmeticFor(host) {
  const cached = hostCache.get(host);
  if (cached) return cached;
  const s = await getState();
  const keys = hostKeys(host);
  const lists = await Promise.all(s.enabledLists.map(getListData));

  let ghide = false;
  let ehide = false;
  const unhide = new Set();
  for (const d of lists) {
    for (const k of keys) {
      if (d.ehideSet.has(k) || d.docAllowSet.has(k)) ehide = true;
      if (d.ghideSet.has(k)) ghide = true;
      const u = d.unhide[k];
      if (u) for (const sel of u) unhide.add(sel);
    }
  }
  for (const k of keys) {
    const u = user.unhide[k];
    if (u) for (const sel of u) unhide.add(sel);
  }

  const selectors = new Set();
  const styles = [];
  const proc = [];
  if (!ehide) {
    for (const d of lists) {
      for (const k of keys) {
        const sp = d.spec[k];
        if (sp) for (const i of sp) selectors.add(d.sel[i]);
        const st = d.style[k];
        if (st) styles.push(...st);
        const pr = d.proc[k];
        if (pr) proc.push(...pr);
      }
      if (!ghide) for (const i of d.genC) selectors.add(d.sel[i]);
    }
  }
  // własne filtry działają zawsze (także przy $generichide list)
  for (const k of keys) {
    const sp = user.spec[k];
    if (sp) for (const sel of sp) selectors.add(sel);
    const st = user.style[k];
    if (st) styles.push(...st);
    const pr = user.proc[k];
    if (pr) proc.push(...pr);
  }
  for (const sel of user.genC) selectors.add(sel);
  for (const sel of unhide) selectors.delete(sel);

  let css = `[${HIDE_ATTR}]{display:none!important}\n`;
  for (const sel of selectors) css += `${sel}{display:none!important}\n`;
  for (const [sel, decl] of styles) if (!unhide.has(sel)) css += `${sel}{${decl}}\n`;

  const result = { css, proc, generic: !ghide && !ehide, unhide, selectorCount: selectors.size };
  if (hostCache.size > 300) hostCache.delete(hostCache.keys().next().value);
  hostCache.set(host, result);
  return result;
}

async function genericFor(host, tokens) {
  const s = await getState();
  const lists = await Promise.all(s.enabledLists.map(getListData));
  const info = await cosmeticFor(host);
  if (!info.generic) return '';
  let css = '';
  for (const d of lists) {
    for (const t of tokens) {
      const idx = d.gen[t];
      if (!idx) continue;
      for (const i of idx) {
        const sel = d.sel[i];
        if (!info.unhide.has(sel)) css += `${sel}{display:none!important}\n`;
      }
    }
  }
  return css;
}

function frameHost(sender, url) {
  const h = hostOf(url) || hostOf(sender.url);
  if (h) return h;
  return sender.tab ? hostOf(sender.tab.url) : '';
}

async function insertCss(sender, css) {
  if (!css || !sender.tab) return;
  try {
    await chrome.scripting.insertCSS({
      target: { tabId: sender.tab.id, frameIds: [sender.frameId || 0] },
      css,
      origin: 'USER',
    });
  } catch { /* karta mogła zostać zamknięta */ }
}

// ---------------------------------------------------------------------------
// Ikona dla stron z wyłączoną ochroną

async function updateIcon(tabId, url) {
  const s = await getState();
  const off = isSiteDisabled(hostOf(url), s);
  const suffix = off ? '-off' : '';
  try {
    await chrome.action.setIcon({
      tabId,
      path: { 16: `icons/icon16${suffix}.png`, 32: `icons/icon32${suffix}.png`, 48: `icons/icon48${suffix}.png` },
    });
  } catch {}
}

chrome.webNavigation.onCommitted.addListener((d) => {
  if (d.frameId === 0) updateIcon(d.tabId, d.url);
});

// ---------------------------------------------------------------------------
// Wiadomości

const handlers = {
  async 'cosmetic:init'(msg, sender) {
    const s = await getState();
    const topHost = sender.tab ? hostOf(sender.tab.url) : '';
    if (isSiteDisabled(topHost, s)) return { off: true };
    const host = frameHost(sender, msg.url);
    if (!host) return { off: true };
    const info = await cosmeticFor(host);
    await insertCss(sender, info.css);
    return { proc: info.proc, generic: info.generic, attr: HIDE_ATTR };
  },

  async 'cosmetic:tokens'(msg, sender) {
    const host = frameHost(sender, msg.url);
    if (!host || !Array.isArray(msg.tokens)) return {};
    const css = await genericFor(host, msg.tokens.slice(0, 2000));
    await insertCss(sender, css);
    return {};
  },

  async 'popup:get'(msg) {
    const s = await getState();
    const tab = await chrome.tabs.get(msg.tabId).catch(() => null);
    const host = tab ? hostOf(tab.url) : '';
    let blocked = null;
    try {
      const info = await chrome.declarativeNetRequest.getMatchedRules({ tabId: msg.tabId });
      const userAllow = new Set(user.rules.map((r, i) => (r.action.type.startsWith('allow') ? USER_RULE_BASE + i : -1)));
      let n = 0;
      for (const m of info.rulesMatchedInfo) {
        const { rulesetId, ruleId } = m.rule;
        if (rulesetId === '_dynamic') {
          if (ruleId >= USER_RULE_BASE && !userAllow.has(ruleId)) n++;
          continue;
        }
        if (!allowIds.has(rulesetId)) {
          allowIds.set(rulesetId, fetch(chrome.runtime.getURL(`data/${rulesetId}.allow.json`))
            .then((r) => r.json()).then((ids) => new Set(ids)).catch(() => new Set()));
        }
        if (!(await allowIds.get(rulesetId)).has(ruleId)) n++;
      }
      blocked = n;
    } catch {
      try { blocked = parseInt(await chrome.action.getBadgeText({ tabId: msg.tabId }), 10) || 0; } catch {}
    }
    return {
      host,
      disabled: isSiteDisabled(host, s),
      blocked,
      canRun: !!host,
    };
  },

  async 'site:toggle'(msg) {
    const s = await getState();
    const host = normalizeHost(msg.host);
    if (!host) return { ok: false };
    const keys = hostKeys(host);
    let disabledSites;
    if (isSiteDisabled(host, s)) {
      disabledSites = s.disabledSites.filter((d) => !keys.includes(d));
    } else {
      disabledSites = [...new Set([...s.disabledSites, host])];
    }
    await saveState({ disabledSites });
    await syncDynamicRules();
    await syncScriptlets();
    if (msg.tabId) {
      const tab = await chrome.tabs.get(msg.tabId).catch(() => null);
      if (tab) await updateIcon(tab.id, tab.url);
      chrome.tabs.reload(msg.tabId);
    }
    return { ok: true, disabled: isSiteDisabled(host, state) };
  },

  async 'options:get'() {
    const s = await getState();
    const meta = await getListsMeta();
    const dyn = await chrome.declarativeNetRequest.getDynamicRules();
    let available = null;
    try { available = await chrome.declarativeNetRequest.getAvailableStaticRuleCount(); } catch {}
    return {
      lists: meta.map((m) => ({ ...m, enabled: s.enabledLists.includes(m.id) })),
      disabledSites: s.disabledSites,
      userFilters: s.userFilters,
      userErrors: user.errors,
      userCount: user.count,
      dynamicRules: dyn.length,
      availableStaticRules: available,
      version: chrome.runtime.getManifest().version,
    };
  },

  async 'options:setLists'(msg) {
    const meta = await getListsMeta();
    const enabledLists = msg.enabledLists.filter((id) => meta.some((m) => m.id === id));
    const previous = state ? state.enabledLists.slice() : [];
    await saveState({ enabledLists });
    try {
      await syncRulesets();
    } catch (e) {
      await saveState({ enabledLists: previous });
      await syncRulesets().catch(() => {});
      return { ok: false, error: 'Chrome nie pozwolił włączyć tylu reguł naraz: ' + (e.message || e) };
    }
    await syncScriptlets();
    return { ok: true };
  },

  async 'options:setUserFilters'(msg) {
    await saveState({ userFilters: String(msg.text || '') });
    try {
      await syncDynamicRules();
    } catch (e) {
      return { ok: false, error: String(e.message || e), errors: user.errors, count: user.count };
    }
    return { ok: true, errors: user.errors, count: user.count };
  },

  async 'options:setDisabledSites'(msg) {
    const disabledSites = [...new Set(msg.sites.map(normalizeHost).filter((h) => /^[a-z0-9.\-]+\.[a-z0-9\-]+$/.test(h)))];
    await saveState({ disabledSites });
    await syncDynamicRules();
    await syncScriptlets();
    return { ok: true, disabledSites };
  },

  async 'picker:start'(msg) {
    await chrome.scripting.executeScript({ target: { tabId: msg.tabId }, files: ['content/picker.js'] });
    return { ok: true };
  },

  async 'picker:add'(msg, sender) {
    if (!sender.tab) return { ok: false };
    const host = normalizeHost(hostOf(sender.tab.url));
    const selector = String(msg.selector || '').trim();
    if (!host || !selector) return { ok: false };
    const s = await getState();
    const line = `${host}##${selector}`;
    const text = s.userFilters.trimEnd() + (s.userFilters.trim() ? '\n' : '') + line + '\n';
    await saveState({ userFilters: text });
    try {
      await chrome.scripting.insertCSS({
        target: { tabId: sender.tab.id, allFrames: true },
        css: `${selector}{display:none!important}`,
        origin: 'USER',
      });
    } catch {}
    return { ok: true, line };
  },
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const h = msg && handlers[msg.type];
  if (!h) return false;
  h(msg, sender).then(sendResponse, (e) => {
    console.error('Tarcza:', msg.type, e);
    sendResponse({ ok: false, error: String(e && e.message || e) });
  });
  return true;
});
