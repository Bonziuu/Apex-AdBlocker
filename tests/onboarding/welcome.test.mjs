// Onboarding (strona powitalna): kiedy się otwiera, wybór trybu przez istniejące presety, błędy, uprawnienia.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBackground } from '../helpers/chrome-mock.mjs';
import { WELCOME_DEFAULT, welcomeOptions, welcomeResult } from '../../welcome/welcome-model.js';
import { PROTECTION_MODES } from '../../shared/protection-modes.js';
import { MODE_CONTENTS } from '../../shared/protection-mode-ui.js';
import { EXTENSION_ENTRIES } from '../../tools/chromium-smoke.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const WELCOME_URL = 'ext://welcome/welcome.html';
const welcomeTabs = (bg) => bg.state.tabsCreated.filter((t) => t.url === WELCOME_URL);
const sorted = (a) => [...a].sort();

test('install → strona powitalna otwarta dokładnie raz', async () => {
  const bg = await loadBackground();
  try {
    await bg.state.listeners.installed({ reason: 'install' });
    assert.equal(welcomeTabs(bg).length, 1);
    assert.equal(bg.state.tabsCreated.length, 1, 'żadnych innych kart');
    assert.equal(bg.mod.shouldOpenWelcome({ reason: 'install' }), true);
  } finally { bg.restore(); }
});

test('update / reload rozszerzenia → bez strony powitalnej', async () => {
  for (const details of [{ reason: 'update', previousVersion: '0.3.2' }, { reason: 'chrome_update' }, { reason: 'shared_module_update' }, undefined]) {
    const bg = await loadBackground();
    try {
      await bg.state.listeners.installed(details);
      assert.equal(welcomeTabs(bg).length, 0, JSON.stringify(details));
      assert.equal(bg.mod.shouldOpenWelcome(details), false);
    } finally { bg.restore(); }
  }
});

test('start Chrome → bez strony powitalnej', async () => {
  const bg = await loadBackground({ local: { enabledLists: ['ads', 'privacy', 'security'] } });
  try {
    await bg.state.listeners.startup();
    assert.equal(welcomeTabs(bg).length, 0);
  } finally { bg.restore(); }
});

test('wybór trybu: Basic domyślnie; opisy i presety z istniejących modułów (bez kopiowania mapowania)', () => {
  assert.equal(WELCOME_DEFAULT, 'basic');
  const opts = welcomeOptions();
  assert.deepEqual(opts.map((o) => o.mode), ['basic', 'balanced', 'strict']);
  assert.deepEqual(opts.map((o) => o.checked), [true, false, false]);
  for (const o of opts) assert.equal(o.desc, MODE_CONTENTS[o.mode]);
  const src = ['welcome/welcome.js', 'welcome/welcome-model.js', 'welcome/welcome.html'].map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  assert.doesNotMatch(src, /['"](ads|privacy|security|cookies|annoyances)['"]/, 'brak własnego mapowania list');
  assert.doesNotMatch(src, /options:setLists|enabledLists|updateEnabledRulesets/, 'brak nowej logiki list');
  assert.match(src, /options:setProtectionMode/, 'istniejąca ścieżka trybów');
});

test('Basic / Balanced / Strict przez istniejącą ścieżkę options:setProtectionMode → listy z presetów', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    for (const mode of ['balanced', 'strict', 'basic']) {
      const res = await bg.send({ type: 'options:setProtectionMode', mode });
      assert.equal(welcomeResult(res, mode).done, true, mode);
      assert.deepEqual(sorted(bg.store.enabledLists), sorted(PROTECTION_MODES[mode]));
      assert.deepEqual(sorted(bg.state.enabledRulesets), sorted(PROTECTION_MODES[mode]));
    }
  } finally { bg.restore(); }
});

test('błąd synchronizacji → onboarding nie twierdzi, że zakończono (karta zostaje, można ponowić)', async () => {
  const opts = {};
  const bg = await loadBackground(opts);
  try {
    await bg.install();
    opts.failRulesets = true;
    const res = await bg.send({ type: 'options:setProtectionMode', mode: 'strict' });
    opts.failRulesets = false;
    const r = welcomeResult(res, 'strict');
    assert.equal(r.done, false);
    assert.equal(r.close, false);
    assert.doesNotMatch(r.message, /Gotowe|włączono/);
    assert.match(r.message, /Nie udało się zastosować trybu Strict/);
  } finally { bg.restore(); }
  for (const res of [null, undefined, { ok: false, error: 'scriptlety' }, { ok: true, protectionMode: 'basic' }, { ok: true }]) {
    assert.equal(welcomeResult(res, 'strict').done, false, JSON.stringify(res));
  }
  assert.equal(welcomeResult({ ok: true, protectionMode: 'balanced' }, 'balanced').done, true);
});

test('brak nowych uprawnień; strona w paczce; bez telemetrii i bez dodatkowego profilu użytkownika', () => {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  // onboarding nie dodaje uprawnień: zestaw jest stały (późniejsze zmiany: declarativeNetRequestFeedback → activeTab, bez webNavigation)
  assert.deepEqual(m.permissions, ['activeTab', 'declarativeNetRequest', 'scripting', 'storage']);
  assert.deepEqual(m.host_permissions, ['<all_urls>']);
  assert.equal(m.optional_permissions, undefined);
  assert.ok(EXTENSION_ENTRIES.includes('welcome'), 'katalog welcome w paczce');
  const src = ['welcome/welcome.js', 'welcome/welcome-model.js'].map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  assert.doesNotMatch(src, /fetch\(|XMLHttpRequest|sendBeacon|WebSocket|chrome\.storage/);
  const html = fs.readFileSync(path.join(ROOT, 'welcome/welcome.html'), 'utf8');
  assert.doesNotMatch(html, /<script[^>]+src="https?:|<link[^>]+href="https?:/, 'bez zasobów z sieci');
  for (const t of ['ChromeBlock', 'lokalnie', 'Zacznij korzystać', 'Otwórz ustawienia', 'później zmienić']) assert.match(html, new RegExp(t), t);
  assert.match(html, /ChromeBlock nie wysyła Twoich danych ani telemetrii\./, 'precyzyjne sformułowanie o danych');
  assert.doesNotMatch(html, /niczego nie wysyła|żadnych danych/, 'bez zbyt absolutnych sformułowań');
  assert.doesNotMatch(html, /\b(Pro|Premium|subskrypcj|licencj|zaloguj|konto)\b/i, 'bez płatnych funkcji i kont');
});
