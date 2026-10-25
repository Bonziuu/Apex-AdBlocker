// Tryby ochrony (fundament v0.3): Basic / Balanced / Strict / Custom.

import test from 'node:test';
import assert from 'node:assert/strict';
import { PROTECTION_MODES, MODE_IDS, isPresetMode, listsForMode, modeForLists } from '../../shared/protection-modes.js';
import { loadBackground } from '../helpers/chrome-mock.mjs';

const EXPECTED = {
  basic: ['ads', 'privacy', 'security'],
  balanced: ['ads', 'privacy', 'security', 'cookies'],
  strict: ['ads', 'privacy', 'security', 'cookies', 'annoyances'],
};
const sorted = (a) => [...a].sort();
const scriptletLists = (bg) => sorted(new Set(bg.state.registered.filter((r) => r.id.startsWith('sl-')).map((r) => r.id.split('-')[1])));

test('model: dokładne listy każdego trybu; custom nie jest presetem', () => {
  assert.deepEqual(MODE_IDS, ['basic', 'balanced', 'strict', 'custom']);
  for (const [m, lists] of Object.entries(EXPECTED)) {
    assert.deepEqual([...PROTECTION_MODES[m]], lists);
    assert.deepEqual(listsForMode(m), lists);
    assert.equal(modeForLists(lists), m);
    assert.equal(modeForLists([...lists].reverse()), m, 'kolejność bez znaczenia');
    assert.ok(lists.includes('ads'), 'YouTube Protection (lista „Reklamy”) w każdym trybie');
  }
  assert.equal(isPresetMode('custom'), false);
  assert.equal(listsForMode('custom'), null);
  assert.equal(modeForLists(['ads', 'security']), 'custom');
  assert.equal(modeForLists([]), 'custom');
  assert.equal(modeForLists(['ads', 'privacy', 'security', 'annoyances']), 'custom');
});

test('domyślna instalacja: tryb Basic', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const o = await bg.send({ type: 'options:get' });
    assert.equal(o.protectionMode, 'basic');
    assert.deepEqual(sorted(bg.state.enabledRulesets), sorted(EXPECTED.basic));
  } finally { bg.restore(); }
});

for (const mode of ['basic', 'balanced', 'strict']) {
  test(`tryb ${mode}: właściwe listy w DNR, scriptletach i zapisie; YouTube Protection działa`, async () => {
    const bg = await loadBackground();
    try {
      await bg.install();
      if (mode === 'basic') await bg.send({ type: 'options:setProtectionMode', mode: 'strict' });
      const r = await bg.send({ type: 'options:setProtectionMode', mode });
      assert.equal(r.ok, true, r.error);
      assert.equal(r.protectionMode, mode);
      assert.deepEqual(sorted(bg.state.enabledRulesets), sorted(EXPECTED[mode]), 'zestawy reguł DNR');
      assert.deepEqual(scriptletLists(bg), sorted(EXPECTED[mode]), 'pliki scriptletów');
      assert.deepEqual(sorted(bg.store.enabledLists), sorted(EXPECTED[mode]));
      assert.equal(bg.store.protectionMode, mode);
      const h = await bg.send({ type: 'health:get' });
      assert.equal(h.components.youtube.status, 'ok');
      assert.equal(h.components.network.status, 'ok');
      assert.equal(h.components.scriptlets.status, 'ok');
    } finally { bg.restore(); }
  });
}

test('ręczna zmiana list niepasująca do żadnego presetu → Custom; pasująca → odpowiedni tryb', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    let r = await bg.send({ type: 'options:setLists', enabledLists: ['ads', 'security'] });
    assert.equal(r.ok, true);
    assert.equal(r.protectionMode, 'custom');
    assert.equal(bg.store.protectionMode, 'custom');
    assert.equal((await bg.send({ type: 'options:get' })).protectionMode, 'custom');
    r = await bg.send({ type: 'options:setLists', enabledLists: ['cookies', 'ads', 'security', 'privacy'] });
    assert.equal(r.protectionMode, 'balanced');
    assert.equal((await bg.send({ type: 'popup:get', tabId: 7 })).protectionMode, 'balanced');
  } finally { bg.restore(); }
});

test('restart Chrome (nowy service worker) zachowuje wybrany tryb i listy', async () => {
  let saved;
  const bg = await loadBackground();
  try {
    await bg.install();
    await bg.send({ type: 'options:setProtectionMode', mode: 'strict' });
    saved = { registered: structuredClone(bg.state.registered.filter((r) => r.persistAcrossSessions !== false)), local: structuredClone(bg.store) };
  } finally { bg.restore(); }
  const bg2 = await loadBackground(saved);
  try {
    await bg2.state.listeners.startup();
    const o = await bg2.send({ type: 'options:get' });
    assert.equal(o.protectionMode, 'strict');
    assert.deepEqual(sorted(o.lists.filter((l) => l.enabled).map((l) => l.id)), sorted(EXPECTED.strict));
    assert.deepEqual(scriptletLists(bg2), sorted(EXPECTED.strict), 'scriptlety odtworzone dla trybu Strict');
  } finally { bg2.restore(); }
});

test('zapisany tryb niezgodny z listami (np. starsza wersja) → tryb wyliczony z faktycznych list', async () => {
  const bg = await loadBackground({ local: { enabledLists: ['ads', 'privacy', 'security', 'cookies'], protectionMode: 'basic' } });
  try {
    assert.equal((await bg.send({ type: 'options:get' })).protectionMode, 'balanced');
  } finally { bg.restore(); }
});

test('szybka zmiana trybów (równoległe wiadomości): wykonane po kolei, stan końcowy = ostatni tryb, bez błędów', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const order = ['strict', 'basic', 'balanced', 'strict', 'balanced'];
    const results = await Promise.all(order.map((mode) => bg.send({ type: 'options:setProtectionMode', mode })));
    assert.deepEqual(results.map((r) => r.ok), order.map(() => true), JSON.stringify(results.filter((r) => !r.ok)));
    assert.deepEqual(results.map((r) => r.protectionMode), order, 'każda zmiana zastosowana w kolejności wysłania');
    assert.equal(bg.store.protectionMode, 'balanced');
    assert.deepEqual(sorted(bg.state.enabledRulesets), sorted(EXPECTED.balanced));
    assert.deepEqual(scriptletLists(bg), sorted(EXPECTED.balanced));
    const ids = bg.state.registered.map((r) => r.id);
    assert.equal(new Set(ids).size, ids.length, 'bez zdublowanych rejestracji');
    const h = await bg.send({ type: 'health:get' });
    assert.deepEqual(h.errors, []);
    for (const c of ['network', 'scriptlets', 'filters', 'youtube']) assert.equal(h.components[c].status, 'ok', c);
  } finally { bg.restore(); }
});

test('nieprawidłowy tryb (custom, nieznany) jest odrzucany bez zmian', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    for (const mode of ['custom', 'ultra', undefined]) {
      const r = await bg.send({ type: 'options:setProtectionMode', mode });
      assert.equal(r.ok, false);
    }
    assert.equal((await bg.send({ type: 'options:get' })).protectionMode, 'basic');
    assert.deepEqual(sorted(bg.state.enabledRulesets), sorted(EXPECTED.basic));
  } finally { bg.restore(); }
});

test('Chrome odrzuca zmianę zestawów reguł → przywrócone poprzednie listy i tryb', async () => {
  const { local, registered } = await (async () => {
    const bg = await loadBackground();
    try { await bg.install(); await bg.send({ type: 'options:setProtectionMode', mode: 'balanced' }); return { local: structuredClone(bg.store), registered: structuredClone(bg.state.registered) }; } finally { bg.restore(); }
  })();
  const bg = await loadBackground({ local, registered, failRulesets: true });
  try {
    const r = await bg.send({ type: 'options:setProtectionMode', mode: 'strict' });
    assert.equal(r.ok, false);
    assert.equal(r.protectionMode, 'balanced');
    assert.equal(bg.store.protectionMode, 'balanced');
    assert.deepEqual(sorted(bg.store.enabledLists), sorted(EXPECTED.balanced));
  } finally { bg.restore(); }
});
