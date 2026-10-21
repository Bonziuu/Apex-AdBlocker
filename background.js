// ChromeBlock – service worker.
// Odpowiada za: włączanie list (zestawy reguł DNR), wyłączanie ochrony na
// wybranych stronach, własne filtry użytkownika, rejestrację scriptletów,
// wstrzykiwanie CSS (filtry kosmetyczne), stan zdrowia silników i YouTube Protection.
// Wszystko działa lokalnie – brak telemetrii i zdalnego kodu.

import {
  classifyLine, parseNetworkFilter, parseCosmeticFilter, validateRule,
  splitSelectorList, hostKeys, PRIORITY,
} from './shared/parser.js';
import { createHealth, runSyncSteps, componentStatusFromSync } from './background/health.js';
import { evaluateYouTubeProtection, coversYouTube } from './youtube/protection.js';

const SITE_RULE_ID = 1;
const USER_RULE_BASE = 1000;
const MAX_USER_RULES = 5000;
const HIDE_ATTR = 'data-chromeblock-hide';

// ---------------------------------------------------------------------------
// Stan

let listsMeta = null;           // data/lists.json
const listData = new Map();     // id → dane kosmetyczne (leniwie)
const hostCache = new Map();    // host → wynik dla stron (czyszczony przy zmianach)
const allowIds = new Map();     // id listy → Set identyfikatorów reguł typu allow
let gunhideCache = null;        // ogólne wyjątki #@# włączonych list
let state = null;               // { enabledLists, disabledSites, userFilters }
let user = null;                // skompilowane własne filtry
const youtubePlayer = new Map(); // tabId → ostatni raport odtwarzacza
const perfReports = [];          // raporty wydajności (tylko gdy włączone w opcjach)

const health = createHealth({
  get: async (key) => (await chrome.storage.local.get(key))[key],
  set: (key, value) => chrome.storage.local.set({ [key]: value }),
});

async function fetchJSON(path) {
  const r = await fetch(chrome.runtime.getURL(path));
  if (!r.ok) throw new Error(`nie można wczytać ${path} (HTTP ${r.status})`);
  return r.json();
}

async function getListsMeta() {
  if (!listsMeta) {
    try {
      listsMeta = await fetchJSON('data/lists.json');
    } catch (e) {
      await health.setComponent('filters', 'error', String(e.message || e));
      await health.error('filters', e);
      throw e;
    }
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
  gunhideCache = null;
}

function toSet(obj) {
  obj.ghideSet = new Set(obj.ghide || []);
  obj.ehideSet = new Set(obj.ehide || []);
  obj.docAllowSet = new Set(obj.docAllow || []);
  return obj;
}

async function getListData(id) {
  let d = listData.get(id);
  if (!d) {
    d = fetchJSON(`data/${id}.json`).then(toSet).catch(async (e) => {
      listData.delete(id);
      await health.setComponent('cosmetic', 'error', `lista ${id}: ${e.message || e}`);
      await health.error('cosmetic', `dane listy ${id}: ${e.message || e}`);
      // pusta struktura – reszta list działa dalej
      return toSet({ sel: [], gen: {}, genC: [], spec: {}, unhide: {}, style: {}, proc: {}, gunhide: [], failed: true });
    });
    listData.set(id, d);
  }
  return d;
}

/** Ogólne wyjątki #@# wszystkich WŁĄCZONYCH list (działają między listami). */
async function getGlobalUnhide() {
  if (gunhideCache) return gunhideCache;
  const s = await getState();
  const set = new Set();
  for (const d of await Promise.all(s.enabledLists.map(getListData))) for (const sel of d.gunhide || []) set.add(sel);
  gunhideCache = set;
  return set;
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
    const f = parseCosmeticFilter(c, { trusted: false });
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

/** $badfilter z jednej listy wyłącza reguły innej listy tylko wtedy, gdy obie są włączone. */
async function syncCrossBadfilters(enabled) {
  const cross = await fetchJSON('data/badfilter-cross.json');
  const byTarget = new Map();
  for (const { source, target, ruleIds } of cross) {
    if (!byTarget.has(target)) byTarget.set(target, { disable: new Set(), all: new Set() });
    const t = byTarget.get(target);
    for (const id of ruleIds) {
      t.all.add(id);
      if (enabled.has(source)) t.disable.add(id);
    }
  }
  let disabledCount = 0;
  for (const [target, t] of byTarget) {
    const disableRuleIds = [...t.disable];
    const enableRuleIds = [...t.all].filter((id) => !t.disable.has(id));
    disabledCount += disableRuleIds.length;
    await chrome.declarativeNetRequest.updateStaticRules({ rulesetId: target, disableRuleIds, enableRuleIds });
  }
  return disabledCount;
}

async function syncRulesets() {
  const s = await getState();
  const meta = await getListsMeta();
  const enable = meta.filter((m) => s.enabledLists.includes(m.id)).map((m) => m.id);
  const disable = meta.filter((m) => !s.enabledLists.includes(m.id)).map((m) => m.id);
  await chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: enable, disableRulesetIds: disable });
  // weryfikacja: Chrome faktycznie włączył to, o co prosiliśmy
  const actual = new Set(await chrome.declarativeNetRequest.getEnabledRulesets());
  const missing = enable.filter((id) => !actual.has(id));
  const extra = disable.filter((id) => actual.has(id));
  if (missing.length || extra.length) {
    throw new Error(`stan zestawów reguł niezgodny (brak: ${missing.join(',') || '-'}, nadmiarowe: ${extra.join(',') || '-'})`);
  }
  const crossDisabled = await syncCrossBadfilters(new Set(enable));
  await health.setComponent('filters', 'ok', `włączone listy: ${enable.join(', ') || 'brak'}`);
  return `włączone: ${enable.join(', ') || 'brak'}; $badfilter między listami: ${crossDisabled}`;
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
  return `reguły dynamiczne: ${rules.length}`;
}

/** Oczekiwane pliki scriptletów dla włączonych list. */
async function expectedScriptlets() {
  const s = await getState();
  const meta = await getListsMeta();
  const out = [];
  for (const m of meta) {
    if (!s.enabledLists.includes(m.id)) continue;
    const files = await fetchJSON(`data/${m.id}.scriptlets.json`);
    files.forEach((f, n) => out.push({ id: `sl-${m.id}-${n}`, list: m.id, ...f }));
  }
  return out;
}

async function syncScriptlets() {
  const s = await getState();
  const registered = await chrome.scripting.getRegisteredContentScripts();
  const ours = registered.filter((r) => r.id.startsWith('sl-'));
  if (ours.length) await chrome.scripting.unregisterContentScripts({ ids: ours.map((r) => r.id) });

  const excludeMatches = s.disabledSites.flatMap(sitePatterns);
  const expected = await expectedScriptlets();
  const failures = [];
  for (const f of expected) {
    const script = {
      id: f.id,
      js: [f.file],
      matches: f.matches,
      runAt: 'document_start',
      allFrames: true,
      world: 'MAIN',
      persistAcrossSessions: true,
    };
    if (excludeMatches.length) script.excludeMatches = excludeMatches;
    try {
      await chrome.scripting.registerContentScripts([script]);
    } catch (e) {
      failures.push(`${f.id}: ${e.message || e}`);
    }
  }
  const after = new Set((await chrome.scripting.getRegisteredContentScripts()).map((r) => r.id));
  const notRegistered = expected.filter((f) => !after.has(f.id)).map((f) => f.id);
  if (failures.length || notRegistered.length) {
    throw new Error(`zarejestrowano ${expected.length - notRegistered.length}/${expected.length} plików scriptletów; ${failures.slice(0, 3).join('; ') || notRegistered.slice(0, 5).join(', ')}`);
  }
  return `zarejestrowano ${expected.length} plików scriptletów`;
}

async function syncAll(reason = '') {
  try {
    await getState();
  } catch (e) {
    await health.error('filters', `nie można wczytać stanu: ${e.message || e}`);
    return null;
  }
  const results = await runSyncSteps({ rulesets: syncRulesets, dynamicRules: syncDynamicRules, scriptlets: syncScriptlets }, health);
  const comp = componentStatusFromSync(results);
  for (const [c, v] of Object.entries(comp)) await health.setComponent(c, v.status, v.detail);
  if (!results.rulesets.ok) await health.setComponent('filters', 'error', results.rulesets.message);
  await checkCosmeticData();
  await refreshYouTubeStatus();
  console.info('ChromeBlock sync', reason, results);
  return results;
}

/** Sprawdza, czy dane kosmetyczne włączonych list wczytują się poprawnie. */
async function checkCosmeticData() {
  const s = await getState();
  listData.clear();
  const lists = await Promise.all(s.enabledLists.map(getListData));
  const failed = s.enabledLists.filter((id, i) => lists[i].failed);
  if (failed.length) return; // błąd został już zapisany przez getListData
  const selectors = lists.reduce((n, d) => n + d.sel.length, 0);
  await health.setComponent('cosmetic', 'ok', `${selectors} selektorów w ${lists.length} listach`);
}

/** Wykonuje jeden krok synchronizacji i zapisuje jego wynik (np. po zmianie ustawień). */
async function runStep(step, fn) {
  const results = await runSyncSteps({ [step]: fn }, health);
  const comp = componentStatusFromSync(results);
  for (const [c, v] of Object.entries(comp)) await health.setComponent(c, v.status, v.detail);
  return results[step];
}

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.declarativeNetRequest.setExtensionActionOptions({ displayActionCountAsBadgeText: true });
    await chrome.action.setBadgeBackgroundColor({ color: '#5b5bd6' });
    try { await chrome.action.setBadgeTextColor({ color: '#ffffff' }); } catch { /* starszy Chrome */ }
  } catch (e) {
    await health.error('network', `ustawienia plakietki: ${e.message || e}`);
  }
  await syncAll('install/update');
});

chrome.runtime.onStartup.addListener(async () => {
  const registered = await chrome.scripting.getRegisteredContentScripts();
  if (!registered.some((r) => r.id.startsWith('sl-'))) {
    await runStep('scriptlets', syncScriptlets);
  }
  await refreshYouTubeStatus();
});

// ---------------------------------------------------------------------------
// Filtry kosmetyczne

async function cosmeticFor(host) {
  const cached = hostCache.get(host);
  if (cached) return cached;
  const s = await getState();
  const keys = hostKeys(host);
  const lists = await Promise.all(s.enabledLists.map(getListData));
  const gunhide = await getGlobalUnhide();

  let ghide = false;
  let ehide = false;
  const unhide = new Set(gunhide);
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

  const result = { css, proc, generic: !ghide && !ehide, unhide, selectorCount: selectors.size + styles.length };
  if (hostCache.size > 300) hostCache.delete(hostCache.keys().next().value);
  hostCache.set(host, result);
  return result;
}

async function genericFor(host, tokens) {
  const s = await getState();
  const lists = await Promise.all(s.enabledLists.map(getListData));
  const info = await cosmeticFor(host);
  if (!info.generic) return { css: '', count: 0 };
  let css = '';
  let count = 0;
  for (const d of lists) {
    for (const t of tokens) {
      const idx = d.gen[t];
      if (!idx) continue;
      for (const i of idx) {
        const sel = d.sel[i];
        if (info.unhide.has(sel)) continue;
        css += `${sel}{display:none!important}\n`;
        count++;
      }
    }
  }
  return { css, count };
}

function frameHost(sender, url) {
  const h = hostOf(url) || hostOf(sender.url);
  if (h) return h;
  return sender.tab ? hostOf(sender.tab.url) : '';
}

const BENIGN_INSERT_ERRORS = /No tab with id|No frame with id|Frame with ID|Cannot access|cannot be scripted|The tab was closed|Missing host permission/i;

async function insertCss(sender, css) {
  if (!css || !sender.tab) return;
  try {
    await chrome.scripting.insertCSS({
      target: { tabId: sender.tab.id, frameIds: [sender.frameId || 0] },
      css,
      origin: 'USER',
    });
  } catch (e) {
    const message = String(e && e.message || e);
    if (!BENIGN_INSERT_ERRORS.test(message)) await health.error('cosmetic', `insertCSS: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// YouTube Protection

async function refreshYouTubeStatus() {
  try {
    const s = await getState();
    let compat = null;
    try { compat = await fetchJSON('data/youtube-compat.json'); } catch { /* brak pliku → ostrzeżenie */ }
    const expected = (await expectedScriptlets()).filter((f) => coversYouTube(f.matches)).map((f) => f.id);
    const registered = (await chrome.scripting.getRegisteredContentScripts()).map((r) => r.id);
    const lastPlayer = [...youtubePlayer.values()].sort((a, b) => b.at - a.at)[0] || null;
    const result = evaluateYouTubeProtection({
      siteDisabled: isSiteDisabled('www.youtube.com', s),
      adsEnabled: s.enabledLists.includes('ads'),
      compat,
      expectedScripts: expected,
      registeredScripts: registered,
      player: lastPlayer,
    });
    const status = result.status === 'ok' ? 'ok' : result.status;
    await health.setComponent('youtube', status, result.checks.filter((c) => !c.ok).map((c) => c.message).join('; ') || 'ochrona aktywna');
    return { ...result, compat };
  } catch (e) {
    await health.setComponent('youtube', 'error', String(e.message || e));
    await health.error('youtube', e);
    return null;
  }
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
  } catch { /* karta zamknięta */ }
}

chrome.webNavigation.onCommitted.addListener((d) => {
  if (d.frameId === 0) updateIcon(d.tabId, d.url);
});

chrome.tabs.onRemoved.addListener((tabId) => { youtubePlayer.delete(tabId); });

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
    return { proc: info.proc, generic: info.generic, attr: HIDE_ATTR, selectors: info.selectorCount };
  },

  async 'cosmetic:tokens'(msg, sender) {
    const host = frameHost(sender, msg.url);
    if (!host || !Array.isArray(msg.tokens)) return { selectors: 0 };
    const { css, count } = await genericFor(host, msg.tokens.slice(0, 2000));
    await insertCss(sender, css);
    return { selectors: count };
  },

  async 'youtube:health'(msg, sender) {
    if (!sender.tab) return {};
    const allowed = ['healthy', 'degraded', 'error', 'unknown'];
    const report = {
      status: allowed.includes(msg.status) ? msg.status : 'unknown',
      reasons: Array.isArray(msg.reasons) ? msg.reasons.slice(0, 5).map(String) : [],
      page: String(msg.page || ''),
      frame: msg.frame === 'frame' ? 'frame' : 'top',
      at: Date.now(),
    };
    if (report.status === 'unknown' && report.page === '') { youtubePlayer.delete(sender.tab.id); return {}; }
    youtubePlayer.set(sender.tab.id, report);
    await refreshYouTubeStatus();
    return {};
  },

  async 'perf:report'(msg, sender) {
    const { devPerf } = await chrome.storage.local.get('devPerf');
    if (!devPerf) return {};
    perfReports.push({
      at: Date.now(),
      host: frameHost(sender, msg.url),
      frame: sender.frameId || 0,
      stats: msg.stats || {},
    });
    if (perfReports.length > 30) perfReports.splice(0, perfReports.length - 30);
    return {};
  },

  async 'health:get'() {
    const youtube = await refreshYouTubeStatus();
    const snap = await health.snapshot();
    let scriptletCompat = null;
    try { scriptletCompat = await fetchJSON('data/scriptlet-compat.json'); } catch { /* brak pliku */ }
    const { devPerf } = await chrome.storage.local.get('devPerf');
    return {
      ...snap,
      youtube,
      scriptletCompat,
      devPerf: !!devPerf,
      perf: perfReports.slice().reverse(),
      version: chrome.runtime.getManifest().version,
    };
  },

  async 'health:resync'() {
    const results = await syncAll('ręcznie z opcji');
    return { ok: !!results && Object.values(results).every((r) => r.ok), results };
  },

  async 'health:clearErrors'() {
    await health.clearErrors();
    return { ok: true };
  },

  async 'options:setDevPerf'(msg) {
    await chrome.storage.local.set({ devPerf: !!msg.enabled });
    if (!msg.enabled) perfReports.length = 0;
    return { ok: true };
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
          allowIds.set(rulesetId, fetchJSON(`data/${rulesetId}.allow.json`).then((ids) => new Set(ids)).catch(() => new Set()));
        }
        if (!(await allowIds.get(rulesetId)).has(ruleId)) n++;
      }
      blocked = n;
    } catch {
      try { blocked = parseInt(await chrome.action.getBadgeText({ tabId: msg.tabId }), 10) || 0; } catch { /* */ }
    }
    const snap = await health.snapshot();
    const problems = Object.entries(snap.components).filter(([, v]) => v.status === 'error').map(([k]) => k);
    return {
      host,
      disabled: isSiteDisabled(host, s),
      blocked,
      canRun: !!host,
      problems,
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
    const dyn = await runStep('dynamicRules', syncDynamicRules);
    const sl = await runStep('scriptlets', syncScriptlets);
    await refreshYouTubeStatus();
    if (msg.tabId) {
      const tab = await chrome.tabs.get(msg.tabId).catch(() => null);
      if (tab) await updateIcon(tab.id, tab.url);
      chrome.tabs.reload(msg.tabId);
    }
    return { ok: dyn.ok && sl.ok, disabled: isSiteDisabled(host, state), error: [dyn, sl].filter((r) => !r.ok).map((r) => r.message).join('; ') };
  },

  async 'options:get'() {
    const s = await getState();
    const meta = await getListsMeta();
    const dyn = await chrome.declarativeNetRequest.getDynamicRules();
    let available = null;
    try { available = await chrome.declarativeNetRequest.getAvailableStaticRuleCount(); } catch { /* */ }
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
    const r = await runStep('rulesets', syncRulesets);
    if (!r.ok) {
      await saveState({ enabledLists: previous });
      await runStep('rulesets', syncRulesets);
      return { ok: false, error: 'Chrome nie pozwolił zmienić list: ' + r.message };
    }
    const sl = await runStep('scriptlets', syncScriptlets);
    await checkCosmeticData();
    await refreshYouTubeStatus();
    return sl.ok ? { ok: true } : { ok: false, error: 'Listy zmienione, ale scriptlety nie zarejestrowały się: ' + sl.message };
  },

  async 'options:setUserFilters'(msg) {
    await saveState({ userFilters: String(msg.text || '') });
    const r = await runStep('dynamicRules', syncDynamicRules);
    if (!r.ok) return { ok: false, error: r.message, errors: user.errors, count: user.count };
    return { ok: true, errors: user.errors, count: user.count };
  },

  async 'options:setDisabledSites'(msg) {
    const disabledSites = [...new Set(msg.sites.map(normalizeHost).filter((h) => /^[a-z0-9.\-]+\.[a-z0-9\-]+$/.test(h)))];
    await saveState({ disabledSites });
    const dyn = await runStep('dynamicRules', syncDynamicRules);
    const sl = await runStep('scriptlets', syncScriptlets);
    await refreshYouTubeStatus();
    return { ok: dyn.ok && sl.ok, disabledSites, error: [dyn, sl].filter((x) => !x.ok).map((x) => x.message).join('; ') };
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
    } catch { /* strona mogła zostać zamknięta */ }
    return { ok: true, line };
  },
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const h = msg && handlers[msg.type];
  if (!h) return false;
  h(msg, sender).then(sendResponse, async (e) => {
    const component = msg.type.startsWith('cosmetic') ? 'cosmetic' : msg.type.startsWith('youtube') ? 'youtube' : 'filters';
    await health.error(component, `${msg.type}: ${e && e.message || e}`).catch(() => {});
    sendResponse({ ok: false, error: String(e && e.message || e) });
  });
  return true;
});
