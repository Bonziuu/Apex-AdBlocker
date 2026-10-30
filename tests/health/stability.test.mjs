// Audyt stabilności (v0.2.6): wyścigi, uśpienie service workera, spójność stanu i diagnostyki.
// Każdy test odpowiada konkretnemu znalezionemu błędowi.

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBackground, sender } from '../helpers/chrome-mock.mjs';

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function installedState(opts = {}) {
  const bg = await loadBackground(opts);
  try {
    await bg.install();
    return { registered: structuredClone(bg.state.registered), local: structuredClone(bg.store) };
  } finally { bg.restore(); }
}

test('bug 1: synchronizacja samych reguł dynamicznych nie ukrywa wcześniejszego błędu syncRulesets (fałszywe OK)', async () => {
  const bg = await loadBackground({ failRulesets: true });
  try {
    await bg.install();
    let h = await bg.send({ type: 'health:get' });
    assert.equal(h.components.network.status, 'error', 'zestawy reguł nie włączone');
    // zmiana własnych filtrów → runStep('dynamicRules') kończy się sukcesem
    const r = await bg.send({ type: 'options:setUserFilters', text: '||ads.example^' });
    assert.equal(r.ok, true);
    h = await bg.send({ type: 'health:get' });
    assert.equal(h.components.network.status, 'error', 'błąd zestawów reguł nadal widoczny');
    assert.match(h.components.network.detail, /rulesets/);
  } finally { bg.restore(); }
});

test('bug 2: po wybudzeniu SW Chrome odrzuca rulesety – zestaw list zostaje stały, nic nie jest nadpisywane', async () => {
  const { registered, local } = await installedState();
  assert.deepEqual(local.enabledLists, undefined, 'listy nie są zapisywane (stały zestaw)');
  // nowy service worker (stan nie wczytany), Chrome odrzuca zmianę zestawów reguł
  const bg = await loadBackground({ registered, local, failRulesets: true });
  try {
    await bg.state.listeners.installed({ reason: 'update' });
    const o = await bg.send({ type: 'options:get' });
    assert.deepEqual(o.lists.filter((l) => l.enabled).map((l) => l.id), ['ads', 'privacy', 'security']);
    assert.equal(bg.store.enabledLists, undefined, 'błąd Chrome nie zapisuje pustego ani innego zestawu');
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.components.network.status, 'error', 'błąd widoczny w diagnostyce');
  } finally { bg.restore(); }
});

test('bug 3: równoczesne zmiany (podwójne kliknięcie, zapis opcji) nie zderzają się na id reguł dynamicznych', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const [a, b] = await Promise.all([
      bg.send({ type: 'site:toggle', host: 'a.example' }),
      bg.send({ type: 'site:toggle', host: 'b.example' }),
    ]);
    assert.equal(a.ok, true, a.error);
    assert.equal(b.ok, true, b.error);
    const rule = bg.state.dynamic.find((r) => r.id === 1);
    assert.deepEqual([...rule.condition.requestDomains].sort(), ['a.example', 'b.example']);
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.components.network.status, 'ok');
    assert.equal(h.errors.length, 0, JSON.stringify(h.errors));
  } finally { bg.restore(); }
});

test('bug 3: równoczesna zmiana własnych filtrów i wyłączenie strony – obie zmiany w regułach dynamicznych', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const [f, t] = await Promise.all([
      bg.send({ type: 'options:setUserFilters', text: '||tracker.example^' }),
      bg.send({ type: 'site:toggle', host: 'a.example' }),
    ]);
    assert.equal(f.ok, true, f.error);
    assert.equal(t.ok, true, t.error);
    assert.ok(bg.state.dynamic.some((r) => r.id === 1), 'reguła wyłączonej strony');
    assert.ok(bg.state.dynamic.some((r) => r.id >= 1000), 'reguła własnego filtra');
  } finally { bg.restore(); }
});

test('odrzucone pomiary przywracają poprzednią flagę i działające rejestracje', async () => {
  const bg = await loadBackground({ failRegister: (_, script) => script.js.includes('content/scriptlet-perf-on.js') });
  try {
    await bg.install();
    const previous = structuredClone(bg.state.registered);
    const result = await bg.send({ type: 'options:setDevPerf', enabled: true });
    assert.equal(result.ok, false);
    assert.equal(result.rolledBack, true, JSON.stringify(result));
    assert.equal(bg.store.devPerf, false);
    assert.deepEqual(bg.state.registered, previous);
    assert.equal(bg.session.sessionScriptletsOk, true);
  } finally { bg.restore(); }
});

test('bug 4: znacznik sesji zdjęty na czas pełnej rejestracji (przerwanie SW w trakcie nie zostawia „OK”)', async () => {
  let observed;
  const bg = await loadBackground();
  try {
    await bg.install();
    const orig = chrome.scripting.registerContentScripts;
    chrome.scripting.registerContentScripts = async (arr) => { observed = bg.session.sessionScriptletsOk; return orig(arr); };
    await bg.send({ type: 'options:setDevPerf', enabled: true });
    assert.notEqual(observed, true, 'w trakcie rejestracji znacznik zdjęty');
    assert.equal(bg.session.sessionScriptletsOk, true, 'po sukcesie ustawiony ponownie');
  } finally { bg.restore(); }
});

test('bug 5: wynik liczony w trakcie zmiany ustawień nie trafia do cache hostów (brak nieaktualnego CSS)', async () => {
  let slow = false;
  const bg = await loadBackground({ fetchDelay: (p) => (slow && p === 'data/ads.json' ? 60 : 0) });
  try {
    await bg.install();
    const s = sender('https://news.example/');
    slow = true;
    // strona ładuje się (CSS liczony z wolno wczytywanych danych), w tym czasie użytkownik dodaje własny filtr
    const pending = bg.send({ type: 'cosmetic:init', url: 'https://news.example/' }, s);
    await tick(5);
    const r = await bg.send({ type: 'options:setUserFilters', text: 'news.example##.cb-nowy-selektor\n' });
    assert.equal(r.ok, true);
    await pending;
    slow = false;
    const cssBefore = bg.state.css.length;
    await bg.send({ type: 'cosmetic:init', url: 'https://news.example/' }, s);
    const css = bg.state.css.slice(cssBefore).map((c) => c.css).join('');
    assert.match(css, /\.cb-nowy-selektor\{display:none!important\}/, 'CSS po zmianie nie pochodzi ze starego cache');
  } finally { bg.restore(); }
});

test('bug 3: dwa szybkie „Ukryj element” – oba filtry zapisane (bez utraconej aktualizacji)', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const s = sender('https://news.example/');
    const [a, b] = await Promise.all([
      bg.send({ type: 'picker:add', selector: 'div.ad-a' }, s),
      bg.send({ type: 'picker:add', selector: 'div.ad-b' }, s),
    ]);
    assert.equal(a.ok && b.ok, true);
    assert.match(bg.store.userFilters, /news\.example##div\.ad-a/);
    assert.match(bg.store.userFilters, /news\.example##div\.ad-b/);
  } finally { bg.restore(); }
});

test('wyłączenie strony i pełna ponowna rejestracja zachowują komplet utrwalonych shardów i helpery encji', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const installed = bg.state.registered.filter((r) => r.id.startsWith('sl-'));
    const installedIds = installed.map((r) => r.id).sort();
    assert.ok(installedIds.length > 0);
    assert.ok(installed.some((r) => r.js.at(-1).endsWith('-entities.js')), 'zestaw zawiera strzeżone encje');
    const assertCompleteSet = (registrations, measuring) => {
      assert.deepEqual(registrations.map((r) => r.id).sort(), installedIds, 'bez utraconych ani nadmiarowych shardów');
      for (const registration of registrations) {
        assert.equal(registration.persistAcrossSessions, true, registration.id);
        assert.equal(registration.allFrames, false, registration.id);
        assert.equal(registration.runAt, 'document_start', registration.id);
        assert.equal(registration.world, 'MAIN', registration.id);
        const helperIndex = registration.js.indexOf('shared/entity-hosts.js');
        assert.equal(helperIndex, measuring ? 1 : 0, registration.id);
        assert.ok(helperIndex < registration.js.length - 1, 'helper musi poprzedzać shard');
        assert.equal(registration.js.includes('content/scriptlet-perf-on.js'), measuring, registration.id);
        if (measuring) assert.equal(registration.js[0], 'content/scriptlet-perf-on.js', registration.id);
      }
    };
    await bg.send({ type: 'site:toggle', host: 'news.example' });
    let ours = bg.state.registered.filter((r) => r.id.startsWith('sl-'));
    assertCompleteSet(ours, false);
    for (const r of ours) assert.deepEqual(r.excludeMatches, ['*://*.news.example/*'], r.id);
    // pełna ponowna rejestracja (zmiana zestawu rejestracji) – wyłączona strona zostaje wykluczona
    await bg.send({ type: 'options:setDevPerf', enabled: true });
    ours = bg.state.registered.filter((r) => r.id.startsWith('sl-'));
    assertCompleteSet(ours, true);
    assert.deepEqual([...new Set(ours.map((r) => r.id.split('-')[1]))].sort(), ['ads', 'privacy', 'security']);
    for (const r of ours) assert.deepEqual(r.excludeMatches, ['*://*.news.example/*'], r.id);
    assert.equal(new Set(ours.map((r) => r.id)).size, ours.length, 'bez duplikatów id');
    await bg.send({ type: 'site:toggle', host: 'news.example' });
    ours = bg.state.registered.filter((r) => r.id.startsWith('sl-'));
    assertCompleteSet(ours, true);
    for (const r of ours) assert.equal(r.excludeMatches, undefined, r.id);
    assert.equal(bg.session.sessionScriptletsOk, true);
    const h = await bg.send({ type: 'health:get' });
    for (const c of ['network', 'scriptlets', 'filters', 'youtube']) assert.equal(h.components[c].status, 'ok', c);
  } finally { bg.restore(); }
});

test('zimny start: inicjalizacja stanu jest wspólna dla synchronizacji i pierwszej zmiany ustawień', async () => {
  let reads = 0;
  const bg = await loadBackground({
    fetchDelay: (p) => p === 'data/lists.json' ? 20 : 0,
    storageGetDelay: (keys) => keys.includes('disabledSites') && ++reads === 1 ? 80 : 0,
  });
  try {
    const r = await bg.send({ type: 'options:setDisabledSites', sites: ['example.com'] });
    assert.equal(r.ok, true);
    await tick(120);
    const options = await bg.send({ type: 'options:get' });
    assert.equal(reads, 1, 'jeden odczyt stanu przy równoległym starcie');
    assert.deepEqual(options.disabledSites, ['example.com']);
    assert.deepEqual(bg.store.disabledSites, options.disabledSites);
    assert.deepEqual(bg.state.dynamic.find((x) => x.id === 1).condition.requestDomains, options.disabledSites);
  } finally { bg.restore(); }
});

test('odrzucony zapis storage nie zmienia ustawień ani skompilowanych filtrów w pamięci', async () => {
  const opts = {};
  const bg = await loadBackground(opts);
  try {
    await bg.install();
    await bg.send({ type: 'options:setUserFilters', text: '||old.example^' });
    opts.failStorageSet = (patch) => 'userFilters' in patch || 'autoReloadOnToggle' in patch;
    const failed = await bg.send({ type: 'options:setUserFilters', text: '||new.example^\n##.new' });
    assert.equal(failed.ok, false);
    assert.match(failed.error, /quota/);
    const options = await bg.send({ type: 'options:get' });
    assert.equal(options.userFilters, '||old.example^');
    assert.equal(options.userCount, 1);
    assert.equal(bg.store.userFilters, options.userFilters);
    assert.deepEqual(bg.state.dynamic[0].condition.requestDomains, ['old.example']);
    const auto = await bg.send({ type: 'popup:setAutoReload', enabled: false });
    assert.equal(auto.ok, false);
    assert.equal((await bg.send({ type: 'popup:get', tabId: 7 })).autoReloadOnToggle, true);
  } finally { bg.restore(); }
});

test('odrzucona zmiana DNR przywraca stan strony i nie przeładowuje karty', async () => {
  const opts = {};
  const bg = await loadBackground(opts);
  try {
    await bg.install();
    let calls = 0;
    opts.failDynamic = () => calls++ === 0;
    const r = await bg.send({ type: 'site:toggle', host: 'example.com', tabId: 7 });
    assert.equal(r.ok, false);
    assert.equal(r.rolledBack, true, JSON.stringify(r));
    assert.equal(r.disabled, false);
    assert.equal(r.reloaded, false);
    assert.deepEqual(bg.store.disabledSites, []);
    assert.equal(bg.state.dynamic.some((x) => x.id === 1), false);
    assert.equal(bg.state.reloads.length, 0);
    assert.ok(bg.state.registered.every((x) => !x.excludeMatches));
  } finally { bg.restore(); }
});

test('odrzucona rejestracja scriptletów przywraca poprzednie DNR i wykluczenia', async () => {
  const opts = {};
  const bg = await loadBackground(opts);
  try {
    await bg.install();
    opts.failRegister = (_, script) => script.excludeMatches?.some((x) => x.includes('example.com'));
    const r = await bg.send({ type: 'options:setDisabledSites', sites: ['example.com'] });
    assert.equal(r.ok, false);
    assert.equal(r.rolledBack, true, JSON.stringify(r));
    assert.deepEqual(r.disabledSites, []);
    assert.equal(bg.state.dynamic.some((x) => x.id === 1), false);
    assert.ok(bg.state.registered.length > 0);
    assert.ok(bg.state.registered.every((x) => !x.excludeMatches));
  } finally { bg.restore(); }
});

test('ponad 5000 własnych reguł jest jawnie odrzucane bez zapisu i częściowego zastosowania', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const text = Array.from({ length: 5001 }, (_, i) => `||ad${i}.example^`).join('\n');
    const r = await bg.send({ type: 'options:setUserFilters', text });
    assert.equal(r.ok, false);
    assert.match(r.error, /5000/);
    assert.equal((await bg.send({ type: 'options:get' })).userFilters, '');
    assert.equal(bg.store.userFilters, undefined);
    assert.equal(bg.state.dynamic.length, 0);
  } finally { bg.restore(); }
});

test('host constructor we własnych filtrach nie uniemożliwia odczytu ustawień po starcie SW', async () => {
  const bg = await loadBackground({ local: { userFilters: 'constructor##.ad\n__proto__##.promo' } });
  try {
    const options = await bg.send({ type: 'options:get' });
    assert.equal(options.userCount, 2);
    assert.deepEqual(options.userErrors, []);
    assert.equal(options.userFilters, bg.store.userFilters);
  } finally { bg.restore(); }
});
