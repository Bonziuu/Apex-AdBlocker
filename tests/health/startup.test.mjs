// Wydajność startu (instalacja, aktualizacja, przeładowanie, start przeglądarki).
// Pomiar: tools/perf/startup-perf.mjs. Główny koszt: każde registerContentScripts rozsyła
// pełny zestaw skryptów do wszystkich procesów kart – stąd jedna rejestracja i brak zbędnych.

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBackground } from '../helpers/chrome-mock.mjs';
import { createStartupProfiler, formatStartupProfile } from '../../background/startup-profile.js';

const ourScripts = (bg) => bg.state.registered.filter((r) => r.id.startsWith('sl-'));

test('instalacja: wszystkie pliki scriptletów w JEDNYM registerContentScripts (było: 26 wywołań)', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const n = ourScripts(bg).length;
    assert.ok(n >= 20, `oczekiwano ok. 26 plików, jest ${n}`);
    assert.equal(bg.state.calls.register, 1);
    assert.deepEqual(bg.state.calls.registeredInCalls, [n]);
    assert.equal(bg.state.calls.unregister, 0, 'nic do wyrejestrowania przy świeżej instalacji');
    // kolejność jak w danych (sl-<lista>-0, -1, …)
    const ids = ourScripts(bg).map((r) => r.id);
    assert.equal(ids[0], 'sl-ads-0');
    assert.ok(ids.indexOf('sl-ads-1') === 1);
  } finally { bg.restore(); }
});

test('start przeglądarki (onStartup) z poprawnie zarejestrowanymi scriptletami: zero rejestracji', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const before = structuredClone(bg.state.calls);
    await bg.state.listeners.startup();
    assert.equal(bg.state.calls.register, before.register, 'brak registerContentScripts');
    assert.equal(bg.state.calls.unregister, before.unregister, 'brak unregisterContentScripts');
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.sync.scriptlets.status, 'ok');
    assert.match(h.sync.scriptlets.message, /bez zmian/);
  } finally { bg.restore(); }
});

test('ponowna synchronizacja bez zmian: zero rejestracji; po zmianie ustawień: 1 unregister + 1 register', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    let before = structuredClone(bg.state.calls);
    const r = await bg.send({ type: 'health:resync' });
    assert.equal(r.ok, true);
    assert.equal(bg.state.calls.register, before.register);
    assert.equal(bg.state.calls.unregister, before.unregister);
    // zmiana wymagająca innej rejestracji (pomiary wydajności → plik-flaga przed scriptletami)
    before = structuredClone(bg.state.calls);
    await bg.send({ type: 'options:setDevPerf', enabled: true });
    assert.equal(bg.state.calls.unregister - before.unregister, 1);
    assert.equal(bg.state.calls.register - before.register, 1);
    assert.ok(ourScripts(bg).every((x) => x.js[0] === 'content/scriptlet-perf-on.js'));
  } finally { bg.restore(); }
});

test('brak pliku jednego scriptletu w paczce: pozostałe zarejestrowane, błąd zgłoszony (rejestracja zastępcza)', async () => {
  const bg = await loadBackground({ failRegister: (id) => id === 'sl-ads-3' });
  try {
    await bg.install();
    const ids = ourScripts(bg).map((r) => r.id);
    assert.ok(!ids.includes('sl-ads-3'));
    assert.ok(ids.includes('sl-ads-0') && ids.includes('sl-privacy-0'));
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.sync.scriptlets.status, 'error');
    assert.match(h.sync.scriptlets.message, /sl-ads-3/);
  } finally { bg.restore(); }
});

test('start: dane kosmetyczne (kilka MB JSON) NIE są parsowane tylko po to, żeby pokazać status OK', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const parsed = bg.state.fetches.filter((f) => /^data\/(ads|privacy|security)\.json$/.test(f.path) && f.method === 'GET');
    assert.deepEqual(parsed, [], 'bez GET + JSON.parse danych kosmetycznych podczas instalacji');
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.components.cosmetic.status, 'ok');
    // dane wczytują się, gdy potrzebuje ich strona
    await bg.send({ type: 'cosmetic:init', url: 'https://www.example.com/' }, { tab: { id: 1, url: 'https://www.example.com/' }, frameId: 0, url: 'https://www.example.com/' });
    assert.ok(bg.state.fetches.some((f) => f.path === 'data/ads.json' && f.method === 'GET'));
  } finally { bg.restore(); }
});

test('start: metadane scriptletów (scriptlets.json, do 1,5 MB) parsowane raz na życie service workera', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    await bg.send({ type: 'health:resync' });
    await bg.send({ type: 'health:get' });
    const n = bg.state.fetches.filter((f) => f.path === 'data/ads.scriptlets.json').length;
    assert.equal(n, 1);
  } finally { bg.restore(); }
});

test('profil startu: etapy, liczba wywołań, znaczniki i raport tekstowy', async () => {
  let t = 0;
  const p = createStartupProfiler({ now: () => t });
  p.setReason('onInstalled: update');
  p.mark('service worker: moduł wczytany');
  await p.time('scriptlety: registerContentScripts', async () => { t += 120; });
  await p.time('scriptlety: registerContentScripts', async () => { t += 30; });
  p.mark('scriptlety gotowe');
  p.finish();
  const s = p.snapshot();
  assert.equal(s.totalMs, 150);
  assert.deepEqual(s.marks, { 'service worker: moduł wczytany': 0, 'scriptlety gotowe': 150 });
  assert.deepEqual(s.stages[0], { name: 'scriptlety: registerContentScripts', count: 2, totalMs: 150, maxMs: 120, startMs: 0 });
  const text = formatStartupProfile(s);
  assert.match(text, /^Startup total: 150 ms \(onInstalled: update\)/);
  assert.match(text, /registerContentScripts: 150 ms \(2×, maks\. 120 ms\)/);
  assert.equal(formatStartupProfile(null), 'Start rozszerzenia: brak pomiaru');
});

test('profil startu jest dostępny w Diagnostyce (health:get) i przez startup:profile', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const h = await bg.send({ type: 'health:get' });
    assert.ok(h.startupProfile && h.startupProfile.totalMs !== null);
    assert.match(h.startupProfile.reason, /onInstalled/);
    const r = await bg.send({ type: 'startup:profile' });
    assert.match(r.text, /^Startup total: /);
    assert.ok(r.profile.marks['DNR gotowy'] !== undefined);
  } finally { bg.restore(); }
});
