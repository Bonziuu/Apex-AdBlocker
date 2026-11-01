// Aktualizacja v1.0.0 → wersja z osobną listą `pl` (Polskie Filtry).
// v1.0.0 miała 3 rulesety (ads z Polskimi Filtrami, privacy, security). Zestaw list nie jest zapisywany
// w storage (CORE_LISTS), więc migracja stanu nie jest potrzebna – ten test to potwierdza: po aktualizacji
// użytkownik zachowuje wyjątki stron, własne filtry i ustawienia, a `pl` działa od razu.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBackground } from '../helpers/chrome-mock.mjs';
import { buildBackup } from '../../shared/settings-backup.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const json = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const sorted = (a) => [...a].sort();

// Metadane w kształcie v1.0.0: trzy listy, scriptlety bez crossBefore, $badfilter tylko ads → privacy.
const V100_FILES = {
  'data/lists.json': json('data/lists.json').filter((m) => m.id !== 'pl').map(({ license, sources, ...m }) => m),
  'data/ads.scriptlets.json': json('data/ads.scriptlets.json').map(({ crossBefore, ...f }) => f),
  'data/privacy.scriptlets.json': json('data/privacy.scriptlets.json').map(({ crossBefore, ...f }) => f),
  'data/security.scriptlets.json': json('data/security.scriptlets.json').map(({ crossBefore, ...f }) => f),
  'data/badfilter-cross.json': json('data/badfilter-cross.json').filter((b) => b.target !== 'pl'),
};

// Ustawienia użytkownika v1.0.0 (wszystkie klucze, które ta wersja zapisuje w chrome.storage.local).
const USER = {
  disabledSites: ['bank.example', 'sklep.example.pl'],
  userFilters: '||reklamy.example^\nexample.com##.baner\nexample.org#@#.sponsor\n',
  autoReloadOnToggle: false,
  devPerf: true,
};

async function stateAfterV100Install() {
  const bg = await loadBackground({ files: V100_FILES, local: USER });
  try {
    await bg.state.listeners.installed({ reason: 'install' });
    assert.deepEqual(sorted(bg.state.enabledRulesets), ['ads', 'privacy', 'security'], 'v1.0.0: 3 rulesety');
    return { registered: structuredClone(bg.state.registered), local: structuredClone(bg.store), dynamic: structuredClone(bg.state.dynamic) };
  } finally { bg.restore(); }
}

test('aktualizacja 1.0.0 → pl: wyjątki stron, własne filtry i preferencje zachowane; pl włączona od razu', async () => {
  const before = await stateAfterV100Install();
  const bg = await loadBackground({ registered: before.registered, local: before.local });
  try {
    await bg.state.listeners.installed({ reason: 'update', previousVersion: '1.0.0' });
    // dane użytkownika bez zmian
    for (const [k, v] of Object.entries(USER)) assert.deepEqual(bg.store[k], v, `storage.${k}`);
    const o = await bg.send({ type: 'options:get' });
    assert.deepEqual(o.disabledSites, USER.disabledSites);
    assert.equal(o.userFilters, USER.userFilters);
    assert.deepEqual(o.lists.filter((l) => l.enabled).map((l) => l.id), ['ads', 'privacy', 'security', 'pl']);
    // silnik: te same reguły dynamiczne (wyjątki stron + własne filtry) co w v1.0.0
    const norm = (rules) => sorted(rules.map((r) => JSON.stringify({ ...r, id: 0 })));
    assert.deepEqual(norm(bg.state.dynamic), norm(before.dynamic), 'reguły dynamiczne jak w v1.0.0');
    assert.ok(bg.state.dynamic.some((r) => r.action.type === 'allowAllRequests' && r.condition.requestDomains.includes('bank.example')));
    // rulesety: pl dołączona; $badfilter uBO dla reguł pl wyłączony w czasie działania (jak usunięcie w v1.0.0)
    assert.deepEqual(sorted(bg.state.enabledRulesets), ['ads', 'pl', 'privacy', 'security']);
    const plUpdate = bg.state.staticRuleUpdates.filter((u) => u.rulesetId === 'pl').at(-1);
    assert.deepEqual(plUpdate.disableRuleIds, json('data/badfilter-cross.json').find((b) => b.target === 'pl').ruleIds);
    // scriptlety: nowe rejestracje pl, bez starych plików i bez odwołań do nieistniejących plików
    const ours = bg.state.registered.filter((r) => r.id.startsWith('sl-'));
    assert.ok(ours.some((r) => r.id === 'sl-pl-0'), 'scriptlety pl zarejestrowane');
    for (const r of ours) for (const f of r.js) assert.ok(fs.existsSync(path.join(ROOT, f)), `${r.id}: ${f}`);
    const pl = ours.find((r) => r.id === 'sl-pl-0');
    assert.deepEqual(pl.js.slice(-2), ['scriptlets/ads-x-pl.js', 'scriptlets/pl-0.js'], 'wyjątki uBO przed scriptletami pl');
    // tylko rejestracje list z bieżącego zestawu (bez osieroconych wpisów v1.0.0)
    assert.deepEqual(sorted(new Set(ours.map((r) => r.id.split('-')[1]))), ['ads', 'pl', 'privacy', 'security']);
    const h = await bg.send({ type: 'health:get' });
    for (const c of ['network', 'scriptlets', 'filters']) assert.equal(h.components[c].status, 'ok', c);
    // ponowne uruchomienie przeglądarki po aktualizacji: nic do poprawiania
    const registerCalls = bg.state.calls.register;
    await bg.state.listeners.startup();
    assert.equal(bg.state.calls.register, registerCalls, 'po aktualizacji rejestracje są kompletne');
  } finally { bg.restore(); }
});

test('kopia ustawień wyeksportowana w v1.0.0 importuje się bez zmian (zestaw list nie jest częścią kopii)', async () => {
  const backup = buildBackup(USER, { extensionVersion: '1.0.0', exportedAt: '2026-10-28T10:00:00.000Z' });
  // starsze kopie (v1) mogły zawierać enabledLists – są ignorowane, nie wyłączają pl
  backup.settings.enabledLists = ['ads', 'privacy', 'security'];
  const bg = await loadBackground();
  try {
    await bg.install();
    const r = await bg.send({ type: 'settings:import', text: JSON.stringify(backup) });
    assert.equal(r.ok, true, JSON.stringify(r));
    assert.ok(r.ignored.includes('settings.enabledLists'));
    const o = await bg.send({ type: 'options:get' });
    assert.deepEqual(o.disabledSites, USER.disabledSites);
    assert.equal(o.userFilters, USER.userFilters);
    assert.deepEqual(o.lists.filter((l) => l.enabled).map((l) => l.id), ['ads', 'privacy', 'security', 'pl']);
    assert.deepEqual(sorted(bg.state.enabledRulesets), ['ads', 'pl', 'privacy', 'security']);
  } finally { bg.restore(); }
});
