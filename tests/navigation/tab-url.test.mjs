// Nawigacja bez uprawnienia webNavigation: chrome.tabs.onUpdated z changeInfo.url
// (pełna nawigacja i SPA) aktualizuje ikonę i czyści raport odtwarzacza YouTube.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadBackground, sender } from '../helpers/chrome-mock.mjs';
import { ROOT } from '../../tools/lists-config.mjs';

const tick = () => new Promise((r) => setTimeout(r, 20));
const iconSuffix = (o) => (/-off\.png$/.test(o.path[16]) ? 'off' : 'on');

test('manifest: bez webNavigation i bez tabs; zestaw uprawnień = activeTab, declarativeNetRequest, scripting, storage', () => {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  assert.ok(!m.permissions.includes('webNavigation'), 'brak webNavigation');
  assert.ok(!m.permissions.includes('tabs'), 'brak tabs');
  assert.deepEqual(m.permissions, ['activeTab', 'declarativeNetRequest', 'scripting', 'storage']);
  assert.deepEqual(m.host_permissions, ['<all_urls>']);
  assert.equal(m.optional_permissions, undefined);
  const src = fs.readFileSync(path.join(ROOT, 'background.js'), 'utf8');
  assert.doesNotMatch(src, /chrome\.webNavigation/, 'kod nie używa webNavigation');
  assert.match(src, /chrome\.tabs\.onUpdated\.addListener/);
});

test('tabs.onUpdated z changeInfo.url aktualizuje ikonę karty', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    bg.state.icons.length = 0;
    bg.state.listeners.tabUpdated(7, { url: 'https://news.example/a' }, { id: 7 });
    await tick();
    assert.equal(bg.state.icons.length, 1);
    assert.equal(bg.state.icons[0].tabId, 7);
    assert.equal(iconSuffix(bg.state.icons[0]), 'on');
  } finally { bg.restore(); }
});

test('tabs.onUpdated bez url (status, title, favIconUrl, audible, discarded) nic nie robi', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    await bg.send({ type: 'youtube:health', status: 'error', reasons: ['x'], page: 'watch' }, sender('https://www.youtube.com/watch?v=A'));
    bg.state.icons.length = 0;
    for (const changeInfo of [{ status: 'loading' }, { status: 'complete' }, { title: 'Film' }, { favIconUrl: 'https://www.youtube.com/favicon.ico' }, { audible: true }, { discarded: false }, {}]) {
      bg.state.listeners.tabUpdated(7, changeInfo, { id: 7, url: 'https://www.youtube.com/watch?v=A' });
    }
    await tick();
    assert.equal(bg.state.icons.length, 0, 'bez setIcon');
    assert.equal((await bg.send({ type: 'health:get' })).youtube.player.status, 'error', 'raport zostaje');
    assert.equal(bg.mod.onTabUrlChanged(7, { status: 'complete' }), false);
    assert.equal(bg.mod.onTabUrlChanged(7, null), false);
  } finally { bg.restore(); }
});

test('zmiana URL (SPA) czyści raport YouTube: watch → inny watch, watch → Shorts, Shorts → watch, zwykła strona', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const steps = [
      ['https://www.youtube.com/watch?v=A', 'watch', 'https://www.youtube.com/watch?v=B'],
      ['https://www.youtube.com/watch?v=B', 'watch', 'https://www.youtube.com/shorts/C'],
      ['https://www.youtube.com/shorts/C', 'shorts', 'https://www.youtube.com/watch?v=D'],
      ['https://www.youtube.com/watch?v=D', 'watch', 'https://news.example/'],
    ];
    for (const [from, page, to] of steps) {
      await bg.send({ type: 'youtube:health', status: 'error', reasons: ['stary film'], page }, sender(from));
      assert.equal((await bg.send({ type: 'health:get' })).youtube.player.status, 'error', `raport dla ${from}`);
      bg.state.listeners.tabUpdated(7, { url: to }, { id: 7, url: to });
      const h = await bg.send({ type: 'health:get' });
      assert.ok(!h.youtube.player, `${from} → ${to}: raport poprzedniego filmu usunięty`);
      assert.notEqual(h.components.youtube.status, 'error');
    }
  } finally { bg.restore(); }
});

test('zmiana URL w jednej karcie nie czyści raportu innej karty', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    await bg.send({ type: 'youtube:health', status: 'degraded', reasons: ['x'], page: 'watch' }, sender('https://www.youtube.com/watch?v=A'));
    bg.state.listeners.tabUpdated(8, { url: 'https://www.youtube.com/watch?v=Z' }, { id: 8 });
    assert.equal((await bg.send({ type: 'health:get' })).youtube.player.status, 'degraded');
  } finally { bg.restore(); }
});

test('ochrona wyłączona dla strony: poprawna ikona po nawigacji (także SPA i subdomena), normalna po wyjściu', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const r = await bg.send({ type: 'options:setDisabledSites', sites: ['example.com'] });
    assert.deepEqual(r.disabledSites, ['example.com']);
    const nav = async (url) => {
      bg.state.icons.length = 0;
      bg.state.listeners.tabUpdated(7, { url }, { id: 7, url });
      await tick();
      assert.equal(bg.state.icons.length, 1, url);
      return iconSuffix(bg.state.icons[0]);
    };
    assert.equal(await nav('https://example.com/'), 'off');
    assert.equal(await nav('https://example.com/page#section'), 'off', 'SPA / zmiana fragmentu');
    assert.equal(await nav('https://www.example.com/x'), 'off', 'subdomena');
    assert.equal(await nav('https://other.example/'), 'on', 'inna strona');
    // ponowne włączenie ochrony
    await bg.send({ type: 'options:setDisabledSites', sites: [] });
    assert.equal(await nav('https://example.com/'), 'on');
  } finally { bg.restore(); }
});
