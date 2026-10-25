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
import { PlayerReportStore } from './youtube/player-reports.js';
import { buildDiagnosticsReport } from './background/diagnostics-report.js';
import { ScriptletPerfStore, parseReport } from './background/scriptlet-perf.js';
import { createStartupProfiler, formatStartupProfile } from './background/startup-profile.js';
import { PROTECTION_MODES, isPresetMode, listsForMode, modeForLists } from './shared/protection-modes.js';
import { FOCUS_STORAGE_KEY, FOCUS_DEFAULTS, normalizeFocus, focusCss, activeFocusOptions, isFocusHost } from './shared/youtube-focus.js';
import { STATS_KEY, normalizeStats, applyMatches, statsView, recordTabHost, hostAt } from './background/stats.js';

// Pomiar etapów startu (czas od uruchomienia service workera). Ostatni zakończony pomiar
// trafia do chrome.storage.session i do Diagnostyki.
const startup = createStartupProfiler();
startup.mark('service worker: moduł wczytany');
const STARTUP_PROFILE_KEY = 'startupProfile';
async function finishStartupProfile() {
  startup.finish();
  try { if (chrome.storage.session) await chrome.storage.session.set({ [STARTUP_PROFILE_KEY]: startup.snapshot() }); } catch { /* */ }
}
async function lastStartupProfile() {
  const cur = startup.snapshot();
  if (cur.totalMs !== null) return cur;
  try { return (chrome.storage.session && (await chrome.storage.session.get(STARTUP_PROFILE_KEY))[STARTUP_PROFILE_KEY]) || null; } catch { return null; }
}

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
// Generacja cache hostów: zwiększana przy każdym czyszczeniu. Wynik obliczony na podstawie
// stanu sprzed zmiany list/ustawień nie jest zapisywany do cache (inaczej strona dostawałaby
// stare filtry aż do następnej zmiany).
let cacheGeneration = 0;
function clearHostCaches() {
  hostCache.clear();
  gunhideCache = null;
  cacheGeneration++;
}
let state = null;               // { enabledLists, disabledSites, userFilters }
let user = null;                // skompilowane własne filtry
const playerReports = new PlayerReportStore(); // tabId → frameId → raport odtwarzacza (TTL 60 s)
const perfReports = [];          // raporty wydajności (tylko gdy włączone w opcjach)
// Pomiary scriptletów (tylko przy włączonych pomiarach). Trzymane w chrome.storage.session
// (pamięć przeglądarki, bez zapisu na dysk), żeby przetrwały uśpienie service workera.
const scriptletPerf = new ScriptletPerfStore();
const SCRIPTLET_PERF_KEY = 'scriptletPerf';
const sessionStore = () => (chrome.storage && chrome.storage.session) || null;
const scriptletPerfLoaded = (async () => {
  try {
    const st = sessionStore();
    if (st) scriptletPerf.load((await st.get(SCRIPTLET_PERF_KEY))[SCRIPTLET_PERF_KEY]);
  } catch { /* brak danych */ }
})();
let scriptletPerfSaveTimer = 0;
const saveScriptletPerf = () => {
  if (scriptletPerfSaveTimer) return;
  scriptletPerfSaveTimer = setTimeout(async () => {
    scriptletPerfSaveTimer = 0;
    try { const st = sessionStore(); if (st) await st.set({ [SCRIPTLET_PERF_KEY]: scriptletPerf.toJSON() }); } catch { /* */ }
  }, 1000);
};
async function resetScriptletPerf() {
  await scriptletPerfLoaded;
  scriptletPerf.reset();
  try { const st = sessionStore(); if (st) await st.remove(SCRIPTLET_PERF_KEY); } catch { /* */ }
}
/** Plik włączający profiler scriptletów (rejestrowany przed scriptletami tylko przy pomiarach). */
const SCRIPTLET_PERF_FLAG_FILE = 'content/scriptlet-perf-on.js';

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
      listsMeta = await startup.time('metadane list (lists.json)', () => fetchJSON('data/lists.json'));
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
  const stored = await startup.time('getState / storage', () => chrome.storage.local.get(['enabledLists', 'disabledSites', 'userFilters', 'protectionMode']));
  state = {
    enabledLists: Array.isArray(stored.enabledLists)
      ? stored.enabledLists.filter((id) => meta.some((m) => m.id === id))
      : meta.filter((m) => m.enabledByDefault).map((m) => m.id),
    disabledSites: Array.isArray(stored.disabledSites) ? stored.disabledSites : [],
    userFilters: typeof stored.userFilters === 'string' ? stored.userFilters : '',
  };
  // Tryb ochrony zawsze odpowiada faktycznie włączonym listom (zapisany tryb niezgodny z listami,
  // np. po ręcznej zmianie w starszej wersji, jest wyliczany od nowa).
  state.protectionMode = modeForLists(state.enabledLists);
  user = compileUserFilters(state.userFilters);
  return state;
}

async function saveState(patch) {
  const s = await getState();
  Object.assign(s, patch);
  await chrome.storage.local.set(patch);
  if ('userFilters' in patch) user = compileUserFilters(s.userFilters);
  clearHostCaches();
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
    d = startup.time('dane kosmetyczne: wczytanie JSON', () => fetchJSON(`data/${id}.json`).then(toSet)).catch(async (e) => {
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
  const gen = cacheGeneration;
  const s = await getState();
  const set = new Set();
  for (const d of await Promise.all(s.enabledLists.map(getListData))) for (const sel of d.gunhide || []) set.add(sel);
  if (gen === cacheGeneration) gunhideCache = set;
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

/** Czy host należy do YouTube (strony, na których działa YouTube Protection). */
export function isYouTubeHost(host) {
  return /(^|\.)(youtube\.com|youtube-nocookie\.com)$/.test(String(host || ''));
}

// YouTube Focus Mode – ustawienia w chrome.storage.local (niezależne od YouTube Protection)
async function getFocus() {
  const stored = await chrome.storage.local.get(FOCUS_STORAGE_KEY);
  return normalizeFocus(stored[FOCUS_STORAGE_KEY]);
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

// Operacje na regułach DNR (zestawy, reguły dynamiczne) wykonujemy jedna po drugiej:
// równoczesne syncDynamicRules czytały te same istniejące reguły i dodawały te same id
// („Rule with id 1 does not have a unique ID”).
let dnrQueue = Promise.resolve();
function serialDnr(fn) {
  return () => {
    const run = dnrQueue.then(fn, fn);
    dnrQueue = run.catch(() => {});
    return run;
  };
}

/** $badfilter z jednej listy wyłącza reguły innej listy tylko wtedy, gdy obie są włączone. */
async function syncCrossBadfilters(enabled) {
  const cross = await startup.time('syncCrossBadfilters: badfilter-cross.json', () => fetchJSON('data/badfilter-cross.json'));
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
    await startup.time('syncCrossBadfilters: updateStaticRules', () => chrome.declarativeNetRequest.updateStaticRules({ rulesetId: target, disableRuleIds, enableRuleIds }));
  }
  return disabledCount;
}

const syncRulesets = serialDnr(syncRulesetsNow);
async function syncRulesetsNow() {
  const s = await getState();
  const meta = await getListsMeta();
  const enable = meta.filter((m) => s.enabledLists.includes(m.id)).map((m) => m.id);
  const disable = meta.filter((m) => !s.enabledLists.includes(m.id)).map((m) => m.id);
  await startup.time('syncRulesets: updateEnabledRulesets', () => chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: enable, disableRulesetIds: disable }));
  // weryfikacja: Chrome faktycznie włączył to, o co prosiliśmy
  const actual = new Set(await startup.time('syncRulesets: getEnabledRulesets', () => chrome.declarativeNetRequest.getEnabledRulesets()));
  const missing = enable.filter((id) => !actual.has(id));
  const extra = disable.filter((id) => actual.has(id));
  if (missing.length || extra.length) {
    throw new Error(`stan zestawów reguł niezgodny (brak: ${missing.join(',') || '-'}, nadmiarowe: ${extra.join(',') || '-'})`);
  }
  const crossDisabled = await startup.time('syncCrossBadfilters', () => syncCrossBadfilters(new Set(enable)));
  startup.mark('DNR gotowy');
  await health.setComponent('filters', 'ok', `włączone listy: ${enable.join(', ') || 'brak'}`);
  return `włączone: ${enable.join(', ') || 'brak'}; $badfilter między listami: ${crossDisabled}`;
}

const syncDynamicRules = serialDnr(syncDynamicRulesNow);
async function syncDynamicRulesNow() {
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
  await startup.time('syncDynamicRules: updateDynamicRules', () => chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((r) => r.id),
    addRules: rules,
  }));
  return `reguły dynamiczne: ${rules.length}`;
}

// Metadane plików scriptletów (data/<lista>.scriptlets.json, do 1,5 MB) nie zmieniają się w trakcie
// działania rozszerzenia – parsujemy je raz na życie service workera, nie przy każdym sprawdzeniu.
const scriptletMetaCache = new Map();
function scriptletMeta(id) {
  let p = scriptletMetaCache.get(id);
  if (!p) {
    p = startup.time('scriptlety: przygotowanie (scriptlets.json)', () => fetchJSON(`data/${id}.scriptlets.json`));
    p.catch(() => scriptletMetaCache.delete(id));
    scriptletMetaCache.set(id, p);
  }
  return p;
}

/** Oczekiwane pliki scriptletów dla włączonych list. */
async function expectedScriptlets() {
  const s = await getState();
  const meta = await getListsMeta();
  const out = [];
  for (const m of meta) {
    if (!s.enabledLists.includes(m.id)) continue;
    const files = await scriptletMeta(m.id);
    files.forEach((f, n) => out.push({ id: `sl-${m.id}-${n}`, list: m.id, ...f }));
  }
  return out;
}

/** Sufiks id rejestracji sesyjnej (wzorce encji „nazwa.*”, bez utrwalania w Chrome). */
const SESSION_SUFFIX = '-s';
/** Klucz w chrome.storage.session: część sesyjna zarejestrowana w tej sesji przeglądarki. */
const SESSION_SCRIPTLETS_KEY = 'sessionScriptletsOk';

/**
 * Rejestracje jednego pliku scriptletów (0–2):
 *   `sl-<lista>-<n>`   – wzorce hostów zwykłych, utrwalane (działają od razu po starcie przeglądarki),
 *   `sl-<lista>-<n>-s` – wzorce encji „nazwa.*”, persistAcrossSessions: false.
 * Wydajność: utrwalanie w Chrome kosztuje ~kwadratowo względem liczby wzorców (60 tys. ≈ 2,8 s
 * zawieszenia całej przeglądarki przy każdej aktualizacji/przeładowaniu), a encje to ~60% wzorców.
 * Oba zbiory są rozłączne (build), więc plik nigdy nie jest wstrzykiwany dwa razy na tę samą stronę.
 */
function scriptletRegistrations(f, { devPerf, excludeMatches }) {
  const base = {
    // przy pomiarach wydajności najpierw plik-flaga (ta sama rejestracja → gwarantowana kolejność)
    js: devPerf ? [SCRIPTLET_PERF_FLAG_FILE, f.file] : [f.file],
    runAt: 'document_start',
    allFrames: true,
    world: 'MAIN',
  };
  if (excludeMatches.length) base.excludeMatches = excludeMatches;
  const out = [];
  if (f.matches && f.matches.length) out.push({ id: f.id, ...base, matches: f.matches, persistAcrossSessions: true });
  if (f.sessionMatches && f.sessionMatches.length) out.push({ id: f.id + SESSION_SUFFIX, ...base, matches: f.sessionMatches, persistAcrossSessions: false });
  return out;
}

/** Czy zarejestrowany zestaw scriptletów jest dokładnie taki, jak oczekiwany (te same id, kolejność i parametry). */
export function sameScriptletRegistrations(registered, wanted) {
  if (registered.length !== wanted.length) return false;
  const norm = (a) => [...(a || [])].sort().join('\n');
  for (let i = 0; i < wanted.length; i++) {
    const r = registered[i];
    const w = wanted[i];
    if (r.id !== w.id) return false;
    if ((r.js || []).join('\n') !== w.js.join('\n')) return false;
    if (norm(r.matches) !== norm(w.matches)) return false;
    if (norm(r.excludeMatches) !== norm(w.excludeMatches)) return false;
    if ((r.runAt || 'document_idle') !== w.runAt || !!r.allFrames !== w.allFrames || (r.world || 'ISOLATED') !== w.world) return false;
    if ((r.persistAcrossSessions !== false) !== (w.persistAcrossSessions !== false)) return false;
  }
  return true;
}

// Synchronizacje scriptletów wykonujemy jedna po drugiej (zmiany ustawień/list, ręczna synchronizacja).
// Profil startu rozróżnia czas oczekiwania w kolejce od faktycznego wykonania.
let scriptletSyncQueue = Promise.resolve();
function syncScriptlets() {
  const queuedAt = performance.now();
  const exec = () => {
    startup.add('syncScriptlets: oczekiwanie w kolejce', performance.now() - queuedAt);
    return startup.time('syncScriptlets', syncScriptletsNow);
  };
  const run = scriptletSyncQueue.then(exec, exec);
  scriptletSyncQueue = run.catch(() => {});
  return run;
}

// Inicjalna synchronizacja scriptletów ma JEDNEGO właściciela na życie service workera.
// Przy instalacji/aktualizacji/przeładowaniu Chrome czyści chrome.storage.session, więc zarówno
// sprawdzenie przy starcie SW, jak i onInstalled (oraz onStartup po restarcie przeglądarki)
// chcą zsynchronizować scriptlety. Wcześniej uruchamiały dwie synchronizacje (druga czekała
// w kolejce i robiła ponowne porównanie). Teraz wszystkie dołączają do jednej (single-flight);
// po błędzie kolejne wywołanie spróbuje ponownie.
let initialScriptletSyncPromise = null;
function initialScriptletSync() {
  if (initialScriptletSyncPromise) {
    startup.add('syncScriptlets: dołączenie do trwającej/wykonanej synchronizacji', 0);
    return initialScriptletSyncPromise;
  }
  initialScriptletSyncPromise = syncScriptlets();
  initialScriptletSyncPromise.catch(() => { initialScriptletSyncPromise = null; });
  return initialScriptletSyncPromise;
}

// Wydajność: każde wywołanie registerContentScripts/unregisterContentScripts powoduje, że Chrome
// zapisuje i rozsyła do WSZYSTKICH procesów kart pełny zestaw zarejestrowanych skryptów. Dlatego:
//   1. gdy zarejestrowany zestaw jest identyczny z oczekiwanym – nic nie robimy,
//   2. gdy brakuje tylko części sesyjnej (start przeglądarki, ponowne włączenie rozszerzenia) –
//      jedno register z samymi rejestracjami sesyjnymi (bez utrwalania, kilkadziesiąt ms),
//   3. w przeciwnym razie: jedno unregister i JEDNO register z całą listą,
//   4. tylko gdy cała paczka zostanie odrzucona – rejestracja pojedyncza, żeby wskazać błędny plik.
// Kolejność rejestracji: najpierw wszystkie utrwalane, potem wszystkie sesyjne – taka sama
// po instalacji i po starcie przeglądarki.
async function syncScriptletsNow() {
  const s = await getState();
  const registered = await startup.time('scriptlety: getRegisteredContentScripts', () => chrome.scripting.getRegisteredContentScripts());
  const ours = registered.filter((r) => r.id.startsWith('sl-'));

  const excludeMatches = s.disabledSites.flatMap(sitePatterns);
  const expected = await expectedScriptlets();
  const { devPerf } = await chrome.storage.local.get('devPerf');
  const regs = expected.flatMap((f) => scriptletRegistrations(f, { devPerf: !!devPerf, excludeMatches }));
  const persistent = regs.filter((r) => r.persistAcrossSessions);
  const session = regs.filter((r) => !r.persistAcrossSessions);
  const wanted = [...persistent, ...session];
  const markSessionOk = async () => {
    try { if (chrome.storage.session) await chrome.storage.session.set({ [SESSION_SCRIPTLETS_KEY]: true }); } catch { /* */ }
  };

  if (sameScriptletRegistrations(ours, wanted)) {
    await markSessionOk();
    startup.mark('scriptlety gotowe');
    return `zarejestrowano ${expected.length} plików scriptletów (bez zmian)`;
  }

  let toRegister = wanted;
  let mode = 'pełna rejestracja';
  if (session.length && sameScriptletRegistrations(ours, persistent)) {
    toRegister = session;
    mode = 'dorejestrowano część sesyjną';
  } else if (ours.length) {
    // Znacznik „zarejestrowane w tej sesji” zdejmujemy PRZED zmianą: gdy rejestracja się nie
    // uda albo service worker zostanie przerwany w trakcie, następny start SW sprawdzi i naprawi.
    try { if (chrome.storage.session) await chrome.storage.session.remove(SESSION_SCRIPTLETS_KEY); } catch { /* */ }
    await startup.time('scriptlety: unregisterContentScripts', () => chrome.scripting.unregisterContentScripts({ ids: ours.map((r) => r.id) }));
  }
  const failures = [];
  try {
    if (toRegister.length) await startup.time('scriptlety: registerContentScripts', () => chrome.scripting.registerContentScripts(toRegister));
  } catch (batchError) {
    // paczka jest atomowa – ustalamy, który plik jest błędny, i rejestrujemy pozostałe
    for (const script of toRegister) {
      try {
        await startup.time('scriptlety: registerContentScripts (pojedynczo po błędzie)', () => chrome.scripting.registerContentScripts([script]));
      } catch (e) {
        failures.push(`${script.id}: ${e.message || e}`);
      }
    }
    if (!failures.length) failures.push(String(batchError.message || batchError));
  }
  const after = new Set((await startup.time('scriptlety: weryfikacja', () => chrome.scripting.getRegisteredContentScripts())).map((r) => r.id));
  const notRegistered = wanted.filter((r) => !after.has(r.id)).map((r) => r.id);
  if (notRegistered.length) {
    const files = new Set(notRegistered.map((id) => id.replace(/-s$/, '')));
    throw new Error(`zarejestrowano ${expected.length - files.size}/${expected.length} plików scriptletów; ${failures.slice(0, 3).join('; ') || notRegistered.slice(0, 5).join(', ')}`);
  }
  await markSessionOk();
  startup.mark('scriptlety gotowe');
  return `zarejestrowano ${expected.length} plików scriptletów (${mode})`;
}

// Część sesyjna (bez utrwalania) znika po restarcie przeglądarki oraz po wyłączeniu i ponownym
// włączeniu rozszerzenia. chrome.storage.session jest czyszczone w tych samych sytuacjach,
// więc brak znacznika = trzeba sprawdzić i dorejestrować. Sprawdzamy od razu przy starcie
// service workera (zanim strony poproszą o filtry), a nie dopiero po zdarzeniu onStartup.
(async () => {
  try {
    if (!chrome.storage.session) return;
    const { [SESSION_SCRIPTLETS_KEY]: ok } = await chrome.storage.session.get(SESSION_SCRIPTLETS_KEY);
    if (ok) return;
    await runStep('scriptlets', initialScriptletSync);
  } catch { /* stan zapisany w Diagnostyce przez runStep */ }
})();

// > 0, gdy trwa synchronizacja: brakujące scriptlety YouTube są wtedy stanem przejściowym
let syncInProgress = 0;

/**
 * Pełna synchronizacja. `initial: true` (onInstalled) – scriptlety przez initialScriptletSync,
 * czyli razem z ewentualnym sprawdzeniem przy starcie SW, a nie drugi raz.
 */
async function syncAll(reason = '', { initial = false } = {}) {
  try {
    await getState();
  } catch (e) {
    await health.error('filters', `nie można wczytać stanu: ${e.message || e}`);
    return null;
  }
  syncInProgress++;
  let results;
  try {
    results = await runSyncSteps({
      rulesets: () => startup.time('syncRulesets', syncRulesets),
      dynamicRules: () => startup.time('syncDynamicRules', syncDynamicRules),
      scriptlets: initial ? initialScriptletSync : syncScriptlets,
    }, health);
  } finally {
    syncInProgress--;
  }
  const comp = componentStatusFromSync(results);
  for (const [c, v] of Object.entries(comp)) await health.setComponent(c, v.status, v.detail);
  if (!results.rulesets.ok) await health.setComponent('filters', 'error', results.rulesets.message);
  await startup.time('checkCosmeticData', checkCosmeticData);
  await startup.time('refreshYouTubeStatus', refreshYouTubeStatus);
  startup.mark('health OK');
  console.info('ChromeBlock sync', reason, results);
  return results;
}

/**
 * Sprawdza dane kosmetyczne włączonych list BEZ ich parsowania (wydajność startu: pliki mają
 * po kilka MB). Poprawność zawartości sprawdza build/check; tutaj tylko, czy pliki istnieją.
 * Dane są wczytywane leniwie – przy pierwszej stronie, która ich potrzebuje (getListData);
 * błąd wczytania jest wtedy zgłaszany w Diagnostyce.
 */
async function checkCosmeticData() {
  const s = await getState();
  const meta = await getListsMeta();
  listData.clear();
  clearHostCaches();
  const missing = [];
  await Promise.all(s.enabledLists.map(async (id) => {
    try {
      const r = await fetch(chrome.runtime.getURL(`data/${id}.json`), { method: 'HEAD' });
      if (!r.ok) missing.push(`${id} (HTTP ${r.status})`);
    } catch (e) { missing.push(`${id} (${e.message || e})`); }
  }));
  if (missing.length) {
    await health.setComponent('cosmetic', 'error', `brak danych list: ${missing.join(', ')}`);
    await health.error('cosmetic', `brak danych list: ${missing.join(', ')}`);
    return;
  }
  const filters = meta.filter((m) => s.enabledLists.includes(m.id)).reduce((n, m) => n + (m.cosmeticFilters || 0), 0);
  await health.setComponent('cosmetic', 'ok', `${filters} filtrów w ${s.enabledLists.length} listach (wczytywane przy pierwszej stronie)`);
}

/**
 * Zmienia włączone listy (ręcznie albo przez tryb ochrony) i synchronizuje je z Chrome.
 * Tryb ochrony jest wyliczany z list: preset albo 'custom'. Gdy Chrome odrzuci zmianę
 * zestawów reguł, przywracane są poprzednie listy i tryb.
 */
async function applyEnabledLists(enabledLists) {
  const prev = await getState();
  const previous = prev.enabledLists.slice();
  await saveState({ enabledLists, protectionMode: modeForLists(enabledLists) });
  const r = await runStep('rulesets', syncRulesets);
  if (!r.ok) {
    await saveState({ enabledLists: previous, protectionMode: modeForLists(previous) });
    await runStep('rulesets', syncRulesets);
    return { ok: false, error: 'Chrome nie pozwolił zmienić list: ' + r.message, protectionMode: state.protectionMode };
  }
  const sl = await runStep('scriptlets', syncScriptlets);
  await checkCosmeticData();
  await refreshYouTubeStatus();
  return sl.ok
    ? { ok: true, protectionMode: state.protectionMode, enabledLists: state.enabledLists.slice() }
    : { ok: false, error: 'Listy zmienione, ale scriptlety nie zarejestrowały się: ' + sl.message, protectionMode: state.protectionMode };
}

/** Wykonuje jeden krok synchronizacji i zapisuje jego wynik (np. po zmianie ustawień). */
async function runStep(step, fn) {
  const results = await runSyncSteps({ [step]: fn }, health);
  // Status „network” zależy od rulesets ORAZ dynamicRules. Udany jeden krok nie może ukryć
  // ostatniego błędu drugiego (fałszywe OK) – dokładamy jego ostatni zapisany wynik.
  const merged = { ...results };
  if (step === 'rulesets' || step === 'dynamicRules') {
    const snap = await health.snapshot();
    for (const k of ['rulesets', 'dynamicRules']) {
      const last = snap.sync && snap.sync[k];
      if (!merged[k] && last && (last.status === 'ok' || last.status === 'error')) merged[k] = { ok: last.status === 'ok', message: last.message || '' };
    }
  }
  const comp = componentStatusFromSync(merged);
  for (const [c, v] of Object.entries(comp)) await health.setComponent(c, v.status, v.detail);
  return results[step];
}

chrome.runtime.onInstalled.addListener(async (details) => {
  startup.setReason(`onInstalled: ${(details && details.reason) || '?'}`);
  startup.mark('onInstalled');
  await startup.time('ustawienia plakietki', async () => {
    try {
      await chrome.declarativeNetRequest.setExtensionActionOptions({ displayActionCountAsBadgeText: true });
      await chrome.action.setBadgeBackgroundColor({ color: '#5b5bd6' });
      try { await chrome.action.setBadgeTextColor({ color: '#ffffff' }); } catch { /* starszy Chrome */ }
    } catch (e) {
      await health.error('network', `ustawienia plakietki: ${e.message || e}`);
    }
  });
  await syncAll('install/update', { initial: true });
  await finishStartupProfile();
});

chrome.runtime.onStartup.addListener(async () => {
  startup.setReason('onStartup');
  startup.mark('onStartup');
  // porównanie z oczekiwanym zestawem; gdy zgodny – bez żadnej rejestracji;
  // wspólne z ewentualnym sprawdzeniem przy starcie SW (jedna synchronizacja)
  await runStep('scriptlets', initialScriptletSync);
  await startup.time('refreshYouTubeStatus', refreshYouTubeStatus);
  startup.mark('health OK');
  await finishStartupProfile();
});

// ---------------------------------------------------------------------------
// Filtry kosmetyczne

async function cosmeticFor(host) {
  const cached = hostCache.get(host);
  if (cached) return cached;
  const gen = cacheGeneration;
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
  if (gen !== cacheGeneration) return result; // listy/ustawienia zmieniły się w trakcie – bez cache
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
    const lastPlayer = playerReports.latest();
    const result = evaluateYouTubeProtection({
      siteDisabled: isSiteDisabled('www.youtube.com', s),
      adsEnabled: s.enabledLists.includes('ads'),
      compat,
      expectedScripts: expected,
      registeredScripts: registered,
      player: lastPlayer,
      syncing: syncInProgress > 0,
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

// ---------------------------------------------------------------------------
// Dopasowania reguł, które BLOKUJĄ (bez reguł allow) – wspólne dla licznika karty i statystyk

function userAllowIds() {
  return new Set(user.rules.map((r, i) => (r.action.type.startsWith('allow') ? USER_RULE_BASE + i : -1)));
}

async function isBlockingMatch(rule, userAllow) {
  const { rulesetId, ruleId } = rule;
  if (rulesetId === '_dynamic') return ruleId >= USER_RULE_BASE && !userAllow.has(ruleId);
  if (!allowIds.has(rulesetId)) {
    allowIds.set(rulesetId, fetchJSON(`data/${rulesetId}.allow.json`).then((ids) => new Set(ids)).catch(() => new Set()));
  }
  return !(await allowIds.get(rulesetId)).has(ruleId);
}

// ---------------------------------------------------------------------------
// Lokalne statystyki (background/stats.js): tylko liczby i hostname, bez URL, bez telemetrii.
// Źródło: getMatchedRules() (tabId, reguła, czas). Chrome ogranicza liczbę wywołań, więc odczyty są
// rzadkie: po nawigacji / zamknięciu karty (najwyżej co STATS_MIN_INTERVAL_MS) i przy otwarciu popupu.

const STATS_TABS_KEY = 'statsTabs';           // chrome.storage.session: {tabId: [{host, since}]}
const STATS_MIN_INTERVAL_MS = 45_000;
const STATS_MAX_CALLS = 12;                    // na 10 min (limit Chrome: 20 / 10 min)
const statsCalls = [];
let statsLastPoll = 0;
let statsQueue = Promise.resolve();
let statsTimer = 0;
let statsTabsQueue = Promise.resolve(); // zmiany mapy kart → domen kolejno (bez nadpisywania)

function updateStatsTabs(fn) {
  const run = statsTabsQueue.then(async () => setStatsTabs(fn(await getStatsTabs())));
  statsTabsQueue = run.catch(() => {});
  return run;
}

async function getStatsTabs() {
  try { return (await chrome.storage.session.get(STATS_TABS_KEY))[STATS_TABS_KEY] || {}; } catch { return {}; }
}
async function setStatsTabs(tabs) {
  try { await chrome.storage.session.set({ [STATS_TABS_KEY]: tabs }); } catch { /* */ }
}

/** Jeden odczyt getMatchedRules → statystyki (szeregowo; limit wywołań). */
function pollStats({ popup = false } = {}) {
  const run = statsQueue.then(async () => {
    const now = Date.now();
    while (statsCalls.length && statsCalls[0] < now - 600_000) statsCalls.shift();
    if (statsCalls.length >= STATS_MAX_CALLS) return { skipped: 'quota' };
    // popup (gest użytkownika) zawsze odczytuje świeże dane – obowiązuje tylko limit wywołań
    if (!popup && now - statsLastPoll < STATS_MIN_INTERVAL_MS) {
      scheduleStats();
      return { skipped: 'interval' };
    }
    statsCalls.push(now);
    statsLastPoll = now;
    const stored = await chrome.storage.local.get(STATS_KEY);
    const stats = normalizeStats(stored[STATS_KEY]);
    let info;
    try {
      info = await chrome.declarativeNetRequest.getMatchedRules({ minTimeStamp: Math.max(0, stats.cursor.ts - 10_000) });
    } catch { return { skipped: 'error' }; }
    const userAllow = userAllowIds();
    const blocking = [];
    for (const m of (info && info.rulesMatchedInfo) || []) if (m && m.rule && await isBlockingMatch(m.rule, userAllow)) blocking.push(m);
    await statsTabsQueue;
    let tabs = await getStatsTabs();
    // karty bez znanej nawigacji (np. po restarcie service workera) – bieżąca domena karty
    for (const tabId of new Set(blocking.map((m) => m.tabId).filter((id) => id >= 0 && !tabs[id]))) {
      const t = await chrome.tabs.get(tabId).catch(() => null);
      if (t) tabs = recordTabHost(tabs, tabId, normalizeHost(hostOf(t.url)), 0);
    }
    const { stats: next, added } = applyMatches(stats, blocking, { now, hostFor: (m) => hostAt(tabs, m.tabId, m.timeStamp) });
    await chrome.storage.local.set({ [STATS_KEY]: next });
    return { added };
  });
  statsQueue = run.catch(() => {});
  return run.catch(() => ({ skipped: 'error' }));
}

/** Statystyki dla popupu (świeży odczyt, jeśli pozwala limit wywołań). */
async function popupStats(host) {
  await pollStats({ popup: true });
  const stored = await chrome.storage.local.get(STATS_KEY);
  return statsView(stored[STATS_KEY], host, Date.now());
}

function scheduleStats() {
  if (statsTimer) return;
  const wait = Math.max(1000, STATS_MIN_INTERVAL_MS - (Date.now() - statsLastPoll));
  statsTimer = setTimeout(() => { statsTimer = 0; pollStats(); }, wait);
}

chrome.webNavigation.onCommitted.addListener((d) => {
  if (d.frameId !== 0) return;
  // statystyki: domena karty od tej chwili (sam hostname), odczyt dopasowań poprzedniej strony
  if (d.tabId >= 0) {
    const host = normalizeHost(hostOf(d.url));
    const since = d.timeStamp || Date.now();
    updateStatsTabs((tabs) => recordTabHost(tabs, d.tabId, host, since)).then(() => pollStats());
  }
  // główna nawigacja karty: raporty odtwarzacza z poprzedniej strony są nieaktualne
  playerReports.onMainFrameNavigation(d.tabId);
  updateIcon(d.tabId, d.url);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  playerReports.clearTab(tabId);
  // statystyki: najpierw policz dopasowania zamykanej karty, potem zapomnij jej domenę
  pollStats().finally(() => updateStatsTabs((tabs) => { const t = { ...tabs }; delete t[tabId]; return t; }));
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
    // frameId pochodzi od Chrome (sender), nie z treści wiadomości
    playerReports.set(sender.tab.id, sender.frameId || 0, { status: msg.status, reasons: msg.reasons, page: msg.page });
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

  async 'perf:scriptlets'(msg) {
    const { devPerf } = await chrome.storage.local.get('devPerf');
    if (!devPerf) return { accepted: 0 };
    await scriptletPerfLoaded;
    const accepted = scriptletPerf.add(parseReport(msg.data));
    if (accepted) saveScriptletPerf();
    return { accepted };
  },

  async 'perf:reset'() {
    perfReports.length = 0;
    await resetScriptletPerf();
    return { ok: true };
  },

  async 'startup:profile'() {
    const p = await lastStartupProfile();
    return { profile: p, text: formatStartupProfile(p) };
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
      scriptletPerf: devPerf ? (await scriptletPerfLoaded, scriptletPerf.rows(50)) : [],
      startupProfile: await lastStartupProfile(),
      version: chrome.runtime.getManifest().version,
    };
  },

  async 'diagnostics:export'() {
    const s = await getState();
    const snap = await health.snapshot();
    let youtubeCompat = null;
    let scriptletCompat = null;
    try { youtubeCompat = await fetchJSON('data/youtube-compat.json'); } catch { /* brak pliku */ }
    try { scriptletCompat = await fetchJSON('data/scriptlet-compat.json'); } catch { /* brak pliku */ }
    const { devPerf } = await chrome.storage.local.get('devPerf');
    const manifest = chrome.runtime.getManifest();
    return buildDiagnosticsReport({
      version: manifest.version,
      versionName: manifest.version_name,
      manifestVersion: manifest.manifest_version,
      now: Date.now(),
      enabledLists: s.enabledLists,
      health: snap,
      youtubeCompat,
      scriptletCompat,
      player: playerReports.latest(),
      startupProfile: await lastStartupProfile(),
      devPerf: !!devPerf,
    });
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
    if (!msg.enabled) { perfReports.length = 0; await resetScriptletPerf(); }
    // ponowna rejestracja scriptletów: z plikiem-flagą profilera albo bez niego
    const r = await runStep('scriptlets', syncScriptlets);
    return { ok: !!r && r.ok };
  },

  async 'popup:get'(msg) {
    const s = await getState();
    const tab = await chrome.tabs.get(msg.tabId).catch(() => null);
    const host = tab ? hostOf(tab.url) : '';
    let blocked = null;
    try {
      const info = await chrome.declarativeNetRequest.getMatchedRules({ tabId: msg.tabId });
      const userAllow = userAllowIds();
      let n = 0;
      for (const m of info.rulesMatchedInfo) if (await isBlockingMatch(m.rule, userAllow)) n++;
      blocked = n;
    } catch {
      try { blocked = parseInt(await chrome.action.getBadgeText({ tabId: msg.tabId }), 10) || 0; } catch { /* */ }
    }
    const snap = await health.snapshot();
    const problems = Object.entries(snap.components).filter(([, v]) => v.status === 'error').map(([k]) => k);
    // Na YouTube popup pokazuje stan YouTube Protection – tylko odczyt zapisanego stanu (bez synchronizacji)
    const yt = isYouTubeHost(host) && snap.components.youtube
      ? { status: snap.components.youtube.status, detail: snap.components.youtube.detail || '' }
      : null;
    return {
      host,
      disabled: isSiteDisabled(host, s),
      blocked,
      canRun: !!host,
      problems,
      youtube: yt,
      // Focus Mode: tylko na youtube.com (osobno od YouTube Protection)
      youtubeFocus: isFocusHost(host) ? { enabled: (await getFocus()).enabled } : null,
      protectionMode: s.protectionMode,
      ...(await popupStats(host)),
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
      protectionMode: s.protectionMode,
      protectionModes: Object.fromEntries(Object.entries(PROTECTION_MODES).map(([k, v]) => [k, [...v]])),
      userFilters: s.userFilters,
      userErrors: user.errors,
      userCount: user.count,
      dynamicRules: dyn.length,
      availableStaticRules: available,
      youtubeFocus: await getFocus(),
      version: chrome.runtime.getManifest().version,
    };
  },

  /** Zmiana ustawień Focus Mode: tylko znane klucze z wartością boolean; reszta bez zmian. */
  async 'options:setYouTubeFocus'(msg) {
    const patch = msg && msg.settings && typeof msg.settings === 'object' ? msg.settings : null;
    if (!patch) return { ok: false, error: 'brak ustawień Focus Mode' };
    const next = await getFocus();
    for (const k of Object.keys(FOCUS_DEFAULTS)) if (typeof patch[k] === 'boolean') next[k] = patch[k];
    await chrome.storage.local.set({ [FOCUS_STORAGE_KEY]: next });
    return { ok: true, youtubeFocus: next };
  },

  /** CSS Focus Mode dla karty YouTube (skrypt youtube/focus.js); '' gdy wyłączony lub ochrona strony wyłączona. */
  async 'youtubeFocus:css'(msg, sender) {
    const host = sender && sender.tab ? hostOf(sender.tab.url) : '';
    if (!isYouTubeHost(host)) return { css: '', active: [] };
    const s = await getState();
    if (isSiteDisabled(host, s)) return { css: '', active: [] };
    const focus = await getFocus();
    return { css: focusCss(focus), active: activeFocusOptions(focus) };
  },

  async 'options:setLists'(msg) {
    const meta = await getListsMeta();
    const enabledLists = msg.enabledLists.filter((id) => meta.some((m) => m.id === id));
    return applyEnabledLists(enabledLists);
  },

  // Tryb ochrony: nazwany zestaw list, stosowany tą samą drogą co ręczna zmiana list.
  async 'options:setProtectionMode'(msg) {
    if (!isPresetMode(msg.mode)) return { ok: false, error: `nieznany tryb ochrony: ${String(msg.mode)}` };
    const meta = await getListsMeta();
    const enabledLists = listsForMode(msg.mode).filter((id) => meta.some((m) => m.id === id));
    return applyEnabledLists(enabledLists);
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

// Wiadomości zmieniające ustawienia wykonujemy jedna po drugiej. Każda czyta stan, modyfikuje go
// i synchronizuje z Chrome; równoległe wykonanie gubiło zmiany (np. dwa szybkie przełączenia
// stron albo dwa „Ukryj element” – druga zapisywała stan bez pierwszej).
const MUTATING = new Set(['site:toggle', 'options:setLists', 'options:setProtectionMode', 'options:setYouTubeFocus', 'options:setUserFilters', 'options:setDisabledSites',
  'options:setDevPerf', 'picker:add', 'health:resync']);
let settingsQueue = Promise.resolve();
function runHandler(h, msg, sender) {
  if (!MUTATING.has(msg.type)) return h(msg, sender);
  const run = settingsQueue.then(() => h(msg, sender));
  settingsQueue = run.catch(() => {});
  return run;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const h = msg && handlers[msg.type];
  if (!h) return false;
  runHandler(h, msg, sender).then(sendResponse, async (e) => {
    const component = msg.type.startsWith('cosmetic') ? 'cosmetic' : msg.type.startsWith('youtube') ? 'youtube' : 'filters';
    await health.error(component, `${msg.type}: ${e && e.message || e}`).catch(() => {});
    sendResponse({ ok: false, error: String(e && e.message || e) });
  });
  return true;
});
