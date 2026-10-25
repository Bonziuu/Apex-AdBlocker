// Licznik blokad w popupie przy uprawnieniu activeTab (zamiast declarativeNetRequestFeedback).
// Chrome udostępnia getMatchedRules({ tabId }) dla karty, na której użytkownik otworzył popup
// (activeTab). Gdy dostępu nie ma, API rzuca błąd – popup:get używa wtedy tekstu plakietki.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadBackground } from '../helpers/chrome-mock.mjs';
import { ROOT } from '../../tools/lists-config.mjs';

const manifest = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

// komunikat Chrome przy braku activeTab / declarativeNetRequestFeedback dla danej karty
const NO_ACCESS = new Error('The extension must have the declarativeNetRequestFeedback permission or have activeTab granted for the specified tab ID in order to call this function.');

const match = (rulesetId, ruleId) => ({ rule: { rulesetId, ruleId }, tabId: 7, timeStamp: 1 });

test('manifest: activeTab zamiast declarativeNetRequestFeedback', () => {
  const m = manifest();
  assert.ok(!m.permissions.includes('declarativeNetRequestFeedback'), 'brak declarativeNetRequestFeedback');
  assert.ok(m.permissions.includes('activeTab'), 'jest activeTab');
  assert.deepEqual([...m.permissions].sort(), ['activeTab', 'declarativeNetRequest', 'scripting', 'storage']);
  assert.deepEqual(m.host_permissions, ['<all_urls>']);
  assert.equal(m.optional_permissions, undefined);
  assert.equal(m.optional_host_permissions, undefined);
  // licznik na plakietce nie wymaga feedback – nadal włączany przy instalacji
  const src = fs.readFileSync(path.join(ROOT, 'background.js'), 'utf8');
  assert.match(src, /setExtensionActionOptions\(\{ displayActionCountAsBadgeText: true \}\)/);
});

test('popup:get z przyznanym activeTab: dokładny licznik przez getMatchedRules (allow i wyjątki użytkownika nie są liczone)', async () => {
  const bg = await loadBackground({
    files: { 'data/ads.allow.json': [100], 'data/privacy.allow.json': [] },
    local: { userFilters: '||ads.example^\n@@||ok.example^\n' },
    matchedRules: ({ tabId }) => {
      if (tabId !== 7) throw NO_ACCESS; // dostęp tylko do karty z activeTab
      return {
        rulesMatchedInfo: [
          match('ads', 1), match('ads', 2), // blokady z listy
          match('ads', 100), // reguła allow z listy – nie liczy się
          match('privacy', 5), // blokada z innej listy
          match('_dynamic', 1000), // filtr użytkownika (blokujący)
          match('_dynamic', 1001), // wyjątek użytkownika (@@) – nie liczy się
          match('_dynamic', 1), // reguła „ochrona wyłączona na stronie” – nie liczy się
        ],
      };
    },
    badgeText: '99',
  });
  try {
    await bg.install();
    const r = await bg.send({ type: 'popup:get', tabId: 7 });
    assert.deepEqual(bg.state.matchedRulesCalls, [{ tabId: 7 }], 'getMatchedRules tylko dla karty popupu');
    assert.equal(r.blocked, 4, 'licznik z getMatchedRules, nie z plakietki (99)');
    assert.equal(r.host, 'www.example.com');
  } finally { bg.restore(); }
});

test('popup:get bez dostępu (brak activeTab dla karty): fallback do tekstu plakietki', async () => {
  for (const [badge, expected] of [['12', 12], ['', 0], ['1.2k', 1]]) {
    const bg = await loadBackground({ matchedRules: () => { throw NO_ACCESS; }, badgeText: badge });
    try {
      await bg.install();
      const r = await bg.send({ type: 'popup:get', tabId: 7 });
      assert.equal(bg.state.matchedRulesCalls.length, 1, 'najpierw próba getMatchedRules');
      assert.equal(r.blocked, expected, `plakietka "${badge}"`);
      assert.equal(r.host, 'www.example.com', 'reszta popupu bez zmian');
      assert.equal(r.canRun, true);
    } finally { bg.restore(); }
  }
});

test('popup:get na YouTube z activeTab: licznik + wiersz YouTube Protection + Focus Mode', async () => {
  const bg = await loadBackground({
    tabUrl: 'https://www.youtube.com/watch?v=abc',
    files: { 'data/ads.allow.json': [] },
    matchedRules: () => ({ rulesMatchedInfo: [match('ads', 3), match('ads', 4)] }),
  });
  try {
    await bg.install();
    const r = await bg.send({ type: 'popup:get', tabId: 7 });
    assert.equal(r.blocked, 2);
    assert.equal(r.host, 'www.youtube.com');
    assert.equal(r.youtube.status, 'ok');
    assert.deepEqual(r.youtubeFocus, { enabled: false });
  } finally { bg.restore(); }
});

test('popup:get na YouTube bez dostępu: fallback, wiersze YouTube bez zmian', async () => {
  const bg = await loadBackground({
    tabUrl: 'https://www.youtube.com/watch?v=abc',
    matchedRules: () => { throw NO_ACCESS; },
    badgeText: '5',
  });
  try {
    await bg.install();
    const r = await bg.send({ type: 'popup:get', tabId: 7 });
    assert.equal(r.blocked, 5);
    assert.equal(r.youtube.status, 'ok');
    assert.deepEqual(r.youtubeFocus, { enabled: false });
  } finally { bg.restore(); }
});
