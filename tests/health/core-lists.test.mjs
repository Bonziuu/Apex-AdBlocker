// Apex AdBlocker 1.0: jeden stały zestaw list (ads, privacy, security) – bez trybów ochrony i bez
// list cookies / annoyances. Instalacja, migracja starszych konfiguracji, dane użytkownika, paczka.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CORE_LISTS, isCoreSet } from '../../shared/core-lists.js';
import { LISTS } from '../../tools/lists-config.mjs';
import { loadBackground } from '../helpers/chrome-mock.mjs';
import { packageDev, listFiles } from '../../tools/package-dev.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const sorted = (a) => [...a].sort();
const CORE = sorted(CORE_LISTS);
const scriptletLists = (bg) => sorted(new Set(bg.state.registered.filter((r) => r.id.startsWith('sl-')).map((r) => r.id.split('-')[1])));
const enabledIn = (o) => sorted(o.lists.filter((l) => l.enabled).map((l) => l.id));
const REMOVED = ['cookies', 'annoyances'];

test('stały zestaw: CORE_LISTS = ads, privacy, security; build i metadane list dokładnie tym zestawem', () => {
  assert.deepEqual([...CORE_LISTS], ['ads', 'privacy', 'security']);
  assert.ok(Object.isFrozen(CORE_LISTS));
  assert.deepEqual(LISTS.map((l) => l.id), [...CORE_LISTS], 'tools/lists-config.mjs');
  const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/lists.json'), 'utf8'));
  assert.deepEqual(meta.map((m) => m.id), [...CORE_LISTS], 'data/lists.json');
  assert.equal(isCoreSet(['security', 'ads', 'privacy']), true);
  for (const bad of [['ads', 'privacy'], ['ads', 'privacy', 'security', 'cookies'], [], null]) assert.equal(isCoreSet(bad), false, JSON.stringify(bad));
});

test('świeża instalacja: tylko ads/privacy/security w DNR i scriptletach; bez zapisu list ani trybu', async () => {
  const bg = await loadBackground();
  try {
    await bg.state.listeners.installed({ reason: 'install' });
    assert.deepEqual(sorted(bg.state.enabledRulesets), CORE, 'rulesety DNR');
    assert.deepEqual(scriptletLists(bg), CORE, 'scriptlety');
    const o = await bg.send({ type: 'options:get' });
    assert.deepEqual(enabledIn(o), CORE);
    assert.equal(o.lists.length, 3, 'w opcjach tylko 3 listy (bez przełączników)');
    assert.ok(!('protectionMode' in o) && !('protectionModes' in o), 'brak trybów w odpowiedzi');
    for (const k of ['enabledLists', 'protectionMode', 'youtubeFocus']) assert.ok(!(k in bg.store), `storage: ${k}`);
    const p = await bg.send({ type: 'popup:get', tabId: 1 });
    assert.ok(!('protectionMode' in p), 'popup bez trybu');
    const h = await bg.send({ type: 'health:get' });
    for (const c of ['network', 'scriptlets', 'filters', 'youtube']) assert.equal(h.components[c].status, 'ok', c);
  } finally { bg.restore(); }
});

// Stan po starszej wersji: zapisany tryb + listy, dane użytkownika, zarejestrowane scriptlety usuniętych list.
const OLD = {
  basic: ['ads', 'privacy', 'security'],
  balanced: ['ads', 'privacy', 'security', 'cookies'],
  strict: ['ads', 'privacy', 'security', 'cookies', 'annoyances'],
  custom: ['ads', 'cookies'],
};
const oldRegistered = (lists) => lists.filter((id) => REMOVED.includes(id)).map((id) => ({
  id: `sl-${id}-0`, js: [`scriptlets/${id}-0.js`], matches: ['*://*.example.com/*'], runAt: 'document_start', world: 'MAIN', persistAcrossSessions: true,
}));

for (const [mode, lists] of Object.entries(OLD)) {
  test(`migracja ${mode} → stały zestaw; cookies/annoyances znikają; wyłączone strony i własne filtry zachowane; idempotentna`, async () => {
    const local = {
      enabledLists: lists, protectionMode: mode, youtubeFocus: { enabled: true },
      disabledSites: ['bank.example'], userFilters: '||reklamy.example^\nexample.com##.baner\n',
    };
    const bg = await loadBackground({ local, registered: oldRegistered(lists) });
    try {
      for (let round = 1; round <= 2; round++) {
        await bg.state.listeners.installed({ reason: 'update', previousVersion: '0.3.4' });
        assert.deepEqual(sorted(bg.state.enabledRulesets), CORE, `runda ${round}: rulesety`);
        assert.deepEqual(scriptletLists(bg), CORE, `runda ${round}: scriptlety bez ${REMOVED.join('/')}`);
        assert.ok(!bg.state.registered.some((r) => /^sl-(cookies|annoyances)-/.test(r.id)), 'stare rejestracje usunięte');
        for (const k of ['enabledLists', 'protectionMode', 'youtubeFocus']) assert.ok(!(k in bg.store), `runda ${round}: martwy klucz ${k}`);
        assert.deepEqual(bg.store.disabledSites, ['bank.example'], 'wyłączone strony zachowane');
        assert.equal(bg.store.userFilters, local.userFilters, 'własne filtry zachowane');
        const o = await bg.send({ type: 'options:get' });
        assert.deepEqual(enabledIn(o), CORE);
        assert.deepEqual(o.disabledSites, ['bank.example']);
        // whitelist i własne filtry nadal działają w silniku (reguły dynamiczne)
        const site = bg.state.dynamic.find((r) => r.action.type === 'allowAllRequests');
        assert.deepEqual(site && site.condition.requestDomains, ['bank.example'], 'reguła wyłączonej strony');
        assert.ok(bg.state.dynamic.some((r) => r.action.type === 'block' && JSON.stringify(r.condition).includes('reklamy.example')), 'własny filtr sieciowy');
      }
    } finally { bg.restore(); }
  });
}

test('stare zapisane listy są ignorowane także bez aktualizacji (np. nieudane usunięcie klucza)', async () => {
  const bg = await loadBackground({ local: { enabledLists: ['ads'], protectionMode: 'custom' } });
  try {
    await bg.install(); // mock: onInstalled bez reason – klucze zostają, ale nie mają wpływu
    assert.deepEqual(sorted(bg.state.enabledRulesets), CORE);
    assert.deepEqual(enabledIn(await bg.send({ type: 'options:get' })), CORE);
  } finally { bg.restore(); }
});

test('produkt nie ma już wyboru trybu ani list: brak komunikatów, modułów i UI', () => {
  const bgSrc = fs.readFileSync(path.join(ROOT, 'background.js'), 'utf8');
  for (const msg of ['options:setProtectionMode', 'options:setLists']) assert.ok(!bgSrc.includes(`'${msg}'`), `background.js: ${msg}`);
  for (const f of ['shared/protection-modes.js', 'shared/protection-mode-ui.js', 'welcome/welcome-model.js']) assert.ok(!fs.existsSync(path.join(ROOT, f)), f);
  const ui = ['popup/popup.html', 'popup/popup.js', 'options/options.html', 'options/options.js', 'welcome/welcome.html', 'welcome/welcome.js']
    .map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  assert.doesNotMatch(ui, /Basic|Balanced|Strict|protectionMode|setProtectionMode|setLists|data-mode|modeSeg|type="checkbox"[^>]*list/i);
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'options/options.js'), 'utf8'), /<span class="switch"><input type="checkbox">/, 'listy bez przełączników');
});

test('paczka (package:dev): brak danych cookies/annoyances, rulesety tylko z zestawu, scriptlety tylko ads/privacy/security', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-core-pkg-'));
  try {
    const { extDir } = packageDev({ outDir: path.join(tmp, 'dist') });
    const files = listFiles(extDir);
    const bad = files.filter((f) => /(^|\/)(cookies|annoyances)[.-]/.test(f));
    assert.deepEqual(bad, [], 'pliki cookies/annoyances w paczce');
    for (const f of ['rules/cookies.json', 'rules/annoyances.json', 'data/cookies.json', 'data/annoyances.json', 'data/cookies.scriptlets.json', 'data/annoyances.scriptlets.json']) assert.ok(!files.includes(f), f);
    const shards = files.filter((f) => f.startsWith('scriptlets/'));
    assert.ok(shards.length > 0 && shards.every((f) => /^scriptlets\/(ads|privacy|security)-\d+\.js$/.test(f)), `scriptlety: ${shards.filter((f) => !/^scriptlets\/(ads|privacy|security)-/.test(f)).join(', ')}`);
    assert.deepEqual(files.filter((f) => f.startsWith('rules/')), ['rules/ads.json', 'rules/privacy.json', 'rules/security.json']);
    const manifest = JSON.parse(fs.readFileSync(path.join(extDir, 'manifest.json'), 'utf8'));
    assert.deepEqual(manifest.declarative_net_request.rule_resources.map((r) => [r.id, r.enabled]), CORE_LISTS.map((id) => [id, true]));
    const compat = fs.readFileSync(path.join(extDir, 'data/scriptlet-compat.json'), 'utf8');
    assert.doesNotMatch(compat, /"(cookies|annoyances)"/, 'raport zgodności scriptletów bez usuniętych list');
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});
