// Onboarding (strona powitalna): kiedy się otwiera, ochrona od razu (bez wyboru trybu), uprawnienia.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBackground } from '../helpers/chrome-mock.mjs';
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

test('strona powitalna: ochrona od razu – opis blokowania, bez wyboru trybu i bez zmiany ustawień', () => {
  const html = fs.readFileSync(path.join(ROOT, 'welcome/welcome.html'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'welcome/welcome.js'), 'utf8');
  assert.match(html, /Ochrona jest już włączona/);
  assert.equal((html.match(/<li>/g) || []).length, 3, 'reklamy, śledzenie, złośliwe strony');
  assert.doesNotMatch(html + js, /Basic|Balanced|Strict|tryb ochrony|name="mode"|id="modes"/i);
  assert.doesNotMatch(js, /sendMessage|options:set|chrome\.storage/, '„Zacznij korzystać” niczego nie zapisuje');
  assert.match(js, /\$\('start'\)\.addEventListener\('click', closeTab\)/);
  assert.ok(!fs.existsSync(path.join(ROOT, 'welcome/welcome-model.js')));
});

test('instalacja: strona powitalna nie zmienia stałego zestawu list', async () => {
  const bg = await loadBackground();
  try {
    await bg.state.listeners.installed({ reason: 'install' });
    assert.deepEqual(sorted(bg.state.enabledRulesets), ['ads', 'privacy', 'security']);
    assert.ok(!('enabledLists' in bg.store) && !('protectionMode' in bg.store));
  } finally { bg.restore(); }
});

test('brak nowych uprawnień; strona w paczce; bez telemetrii i bez dodatkowego profilu użytkownika', () => {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  // onboarding nie dodaje uprawnień: zestaw jest stały (późniejsze zmiany: declarativeNetRequestFeedback → activeTab, bez webNavigation)
  assert.deepEqual(m.permissions, ['activeTab', 'declarativeNetRequest', 'scripting', 'storage']);
  assert.deepEqual(m.host_permissions, ['<all_urls>']);
  assert.equal(m.optional_permissions, undefined);
  assert.ok(EXTENSION_ENTRIES.includes('welcome'), 'katalog welcome w paczce');
  const src = fs.readFileSync(path.join(ROOT, 'welcome/welcome.js'), 'utf8');
  assert.doesNotMatch(src, /fetch\(|XMLHttpRequest|sendBeacon|WebSocket|chrome\.storage/);
  const html = fs.readFileSync(path.join(ROOT, 'welcome/welcome.html'), 'utf8');
  assert.doesNotMatch(html, /<script[^>]+src="https?:|<link[^>]+href="https?:/, 'bez zasobów z sieci');
  for (const t of ['ChromeBlock', 'lokalnie', 'Zacznij korzystać', 'Otwórz ustawienia', 'wyłącz na niej ochronę']) assert.match(html, new RegExp(t), t);
  assert.match(html, /ChromeBlock nie wysyła Twoich danych ani telemetrii\./, 'precyzyjne sformułowanie o danych');
  assert.doesNotMatch(html, /niczego nie wysyła|żadnych danych/, 'bez zbyt absolutnych sformułowań');
  assert.doesNotMatch(html, /\b(Pro|Premium|subskrypcj|licencj|zaloguj|konto)\b/i, 'bez płatnych funkcji i kont');
});
