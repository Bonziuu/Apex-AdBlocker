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

test('bug 1: i odwrotnie – udane syncRulesets nie ukrywa błędu reguł dynamicznych', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    // błąd reguł dynamicznych
    const orig = chrome.declarativeNetRequest.updateDynamicRules;
    chrome.declarativeNetRequest.updateDynamicRules = async () => { throw new Error('limit reguł'); };
    await bg.send({ type: 'options:setUserFilters', text: '||ads.example^' });
    chrome.declarativeNetRequest.updateDynamicRules = orig;
    // zmiana list → runStep('rulesets') kończy się sukcesem
    const r = await bg.send({ type: 'options:setLists', enabledLists: ['ads', 'privacy', 'security'] });
    assert.equal(r.ok, true);
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.components.network.status, 'error');
    assert.match(h.components.network.detail, /dynamicRules: limit reguł/);
  } finally { bg.restore(); }
});

test('bug 2: zmiana list zaraz po wybudzeniu SW – odrzucona przez Chrome nie wyłącza wszystkich list', async () => {
  const { registered, local } = await installedState();
  assert.deepEqual(local.enabledLists, undefined, 'domyślne listy (bez zapisu)');
  const before = ['ads', 'privacy', 'security'];
  // nowy service worker (stan nie wczytany), Chrome odrzuca zmianę zestawów reguł
  const bg = await loadBackground({ registered, local: { ...local, enabledLists: before }, failRulesets: true });
  try {
    const r = await bg.send({ type: 'options:setLists', enabledLists: ['ads', 'cookies'] });
    assert.equal(r.ok, false);
    assert.deepEqual(bg.store.enabledLists, before, 'przywrócone poprzednie listy, nie []');
    const o = await bg.send({ type: 'options:get' });
    assert.deepEqual(o.lists.filter((l) => l.enabled).map((l) => l.id), before);
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

test('bug 4: nieudana pełna ponowna rejestracja kasuje znacznik sesji – następny start SW naprawia scriptlety', async () => {
  let failing = false;
  const bg = await loadBackground({ failRegister: () => failing });
  try {
    await bg.install();
    assert.equal(bg.session.sessionScriptletsOk, true);
    failing = true; // np. SW przerwany / Chrome odrzuca w trakcie pełnej rejestracji
    await bg.send({ type: 'options:setDevPerf', enabled: true });
    assert.equal(bg.state.registered.filter((r) => r.id.startsWith('sl-')).length, 0, 'scriptlety wyrejestrowane, nowe niezarejestrowane');
    assert.notEqual(bg.session.sessionScriptletsOk, true, 'znacznik sesji nie może twierdzić, że stan jest poprawny');
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

test('bug 5: wynik liczony w trakcie zmiany list nie trafia do cache hostów (brak nieaktualnego CSS)', async () => {
  let slow = false;
  const bg = await loadBackground({ fetchDelay: (p) => (slow && p === 'data/ads.json' ? 60 : 0) });
  try {
    await bg.install();
    const s = sender('https://news.example/');
    slow = true;
    // strona ładuje się (CSS z listą „ads”), w tym czasie użytkownik wyłącza „ads”
    const pending = bg.send({ type: 'cosmetic:init', url: 'https://news.example/' }, s);
    await tick(5);
    const r = await bg.send({ type: 'options:setLists', enabledLists: ['privacy', 'security'] });
    assert.equal(r.ok, true);
    await pending;
    slow = false;
    const cssBefore = bg.state.css.length;
    await bg.send({ type: 'cosmetic:init', url: 'https://news.example/' }, s);
    const css = bg.state.css.slice(cssBefore).map((c) => c.css).join('');
    const withAds = (await (async () => {
      const bg2 = await loadBackground();
      try {
        await bg2.install();
        await bg2.send({ type: 'cosmetic:init', url: 'https://news.example/' }, s);
        return bg2.state.css.at(-1).css;
      } finally { bg2.restore(); }
    })());
    assert.ok(css.length < withAds.length / 2, `CSS po wyłączeniu „ads” nie może pochodzić ze starego cache (${css.length} vs ${withAds.length})`);
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

test('wyłączenie strony i zmiana list: część utrwalona i sesyjna zawsze w tym samym, poprawnym stanie', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    await bg.send({ type: 'site:toggle', host: 'news.example' });
    let ours = bg.state.registered.filter((r) => r.id.startsWith('sl-'));
    assert.ok(ours.some((r) => r.persistAcrossSessions === false) && ours.some((r) => r.persistAcrossSessions === true));
    for (const r of ours) assert.deepEqual(r.excludeMatches, ['*://*.news.example/*'], r.id);
    await bg.send({ type: 'options:setLists', enabledLists: ['ads', 'privacy', 'security', 'cookies'] });
    ours = bg.state.registered.filter((r) => r.id.startsWith('sl-'));
    assert.ok(ours.some((r) => r.id.startsWith('sl-cookies-')));
    for (const r of ours) assert.deepEqual(r.excludeMatches, ['*://*.news.example/*'], r.id);
    assert.equal(new Set(ours.map((r) => r.id)).size, ours.length, 'bez duplikatów id');
    await bg.send({ type: 'site:toggle', host: 'news.example' });
    ours = bg.state.registered.filter((r) => r.id.startsWith('sl-'));
    for (const r of ours) assert.equal(r.excludeMatches, undefined, r.id);
    assert.equal(bg.session.sessionScriptletsOk, true);
    const h = await bg.send({ type: 'health:get' });
    for (const c of ['network', 'scriptlets', 'filters', 'youtube']) assert.equal(h.components[c].status, 'ok', c);
  } finally { bg.restore(); }
});
