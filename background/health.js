// ChromeBlock – stan zdrowia silników (wyłącznie lokalnie, bez telemetrii).
//
// Komponenty: network, cosmetic, scriptlets, filters, youtube.
// Statusy: ok | warning | error | unknown | disabled.
// Każdy błąd ma: timestamp, component, message. Dziennik jest ograniczony
// do MAX_ERRORS wpisów i zapisywany w chrome.storage.local (klucz "health").

export const COMPONENTS = ['network', 'cosmetic', 'scriptlets', 'filters', 'youtube'];
export const SYNC_STEPS = ['rulesets', 'dynamicRules', 'scriptlets'];
export const MAX_ERRORS = 50;

export function emptyHealth() {
  const components = {};
  for (const c of COMPONENTS) components[c] = { status: 'unknown', detail: '', updatedAt: null };
  const sync = {};
  for (const s of SYNC_STEPS) sync[s] = { status: 'unknown', at: null, message: '' };
  return { components, sync, errors: [] };
}

/**
 * @param {{get: (key:string)=>Promise<any>, set: (key:string, value:any)=>Promise<void>}} store
 * @param {{now?: ()=>number, log?: (...a:any[])=>void}} opts
 */
export function createHealth(store, opts = {}) {
  const now = opts.now || (() => Date.now());
  const log = opts.log || ((...a) => console.error(...a));
  let state = null;
  let saving = Promise.resolve();

  async function load() {
    if (state) return state;
    const stored = await store.get('health').catch(() => null);
    const base = emptyHealth();
    if (stored && typeof stored === 'object') {
      for (const c of COMPONENTS) if (stored.components && stored.components[c]) base.components[c] = stored.components[c];
      for (const s of SYNC_STEPS) if (stored.sync && stored.sync[s]) base.sync[s] = stored.sync[s];
      if (Array.isArray(stored.errors)) base.errors = stored.errors.slice(-MAX_ERRORS);
    }
    state = base;
    return state;
  }

  function persist() {
    const snapshot = JSON.parse(JSON.stringify(state));
    saving = saving.then(() => store.set('health', snapshot)).catch(() => {});
    return saving;
  }

  async function setComponent(component, status, detail = '') {
    await load();
    state.components[component] = { status, detail, updatedAt: now() };
    return persist();
  }

  async function error(component, err) {
    await load();
    const message = String((err && err.message) || err);
    const entry = { timestamp: now(), component, message };
    state.errors.push(entry);
    if (state.errors.length > MAX_ERRORS) state.errors.splice(0, state.errors.length - MAX_ERRORS);
    log(`ChromeBlock [${component}]`, message);
    return persist();
  }

  async function syncResult(step, ok, message = '') {
    await load();
    state.sync[step] = { status: ok ? 'ok' : 'error', at: now(), message };
    return persist();
  }

  async function snapshot() {
    await load();
    return JSON.parse(JSON.stringify(state));
  }

  async function clearErrors() {
    await load();
    state.errors = [];
    return persist();
  }

  return { load, setComponent, error, syncResult, snapshot, clearErrors, flush: () => saving };
}

/**
 * Uruchamia kroki synchronizacji niezależnie od siebie i zapisuje wynik KAŻDEGO.
 * Żaden błąd nie jest przemilczany: trafia do dziennika i do statusu kroku.
 * @param {Record<string, () => Promise<any>>} steps np. {rulesets: syncRulesets, ...}
 * @param {ReturnType<typeof createHealth>} health
 * @returns {Promise<Record<string, {ok:boolean, message:string}>>}
 */
export async function runSyncSteps(steps, health) {
  const names = Object.keys(steps);
  const results = await Promise.allSettled(names.map((n) => steps[n]()));
  const out = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const r = results[i];
    if (r.status === 'fulfilled') {
      out[name] = { ok: true, message: typeof r.value === 'string' ? r.value : '' };
      await health.syncResult(name, true, out[name].message);
    } else {
      const message = String((r.reason && r.reason.message) || r.reason);
      out[name] = { ok: false, message };
      await health.syncResult(name, false, message);
      await health.error(SYNC_COMPONENT[name] || name, `${name}: ${message}`);
    }
  }
  return out;
}

export const SYNC_COMPONENT = { rulesets: 'network', dynamicRules: 'network', scriptlets: 'scriptlets' };

/** Status komponentu na podstawie wyników synchronizacji. */
export function componentStatusFromSync(results) {
  const net = ['rulesets', 'dynamicRules'].filter((k) => results[k]);
  const out = {};
  if (net.length) {
    const failed = net.filter((k) => !results[k].ok);
    out.network = failed.length
      ? { status: 'error', detail: failed.map((k) => `${k}: ${results[k].message}`).join('; ') }
      : { status: 'ok', detail: results.rulesets ? results.rulesets.message : '' };
  }
  if (results.scriptlets) {
    out.scriptlets = results.scriptlets.ok
      ? { status: 'ok', detail: results.scriptlets.message }
      : { status: 'error', detail: results.scriptlets.message };
  }
  return out;
}
