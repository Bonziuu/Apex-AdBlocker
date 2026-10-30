import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { initializePopup } from '../../popup/popup.js';
import { uiDocument, uiWindow, deferred } from '../helpers/ui-dom.mjs';
import { i18nFor } from '../helpers/i18n-mock.mjs';

const html = fs.readFileSync(new URL('../../popup/popup.html', import.meta.url), 'utf8');
const base = { host: 'example.com', disabled: false, canRun: true, blocked: 12, autoReloadOnToggle: true, problems: [], youtube: null };
async function popup(send) {
  const document = uiDocument(html), window = uiWindow(), calls = [];
  const chrome = { tabs: { query: async () => [{ id: 7 }], create() {} }, runtime: {
    getManifest: () => ({ version: '1.0.0' }),
    sendMessage(msg) { calls.push(msg); return send(msg); },
    openOptionsPage() {}, getURL: (url) => url,
  } };
  await initializePopup({ chrome, document, window });
  return { get: (id) => document.getElementById(id), calls };
}

test('popup: failed initial read offers retry instead of calling an ordinary page unsupported', async () => {
  let fail = true;
  const ui = await popup(async () => { if (fail) throw new Error('worker unavailable'); return { ...base }; });
  assert.equal(ui.get('unsupported').hidden, true);
  assert.equal(ui.get('retry').hidden, false);
  assert.match(ui.get('operationMessage').textContent, /worker unavailable/);
  assert.equal(ui.get('toggle').disabled, true);
  fail = false;
  await ui.get('retry').click();
  assert.equal(ui.get('main').hidden, false);
  assert.equal(ui.get('retry').hidden, true);
  assert.equal(ui.get('toggle').disabled, false);
  assert.equal(ui.get('operationMessage').hidden, true);
});

test('popup: failed toggle reports rollback and displays fresh worker state and errors', async () => {
  let reads = 0;
  const ui = await popup(async (msg) => msg.type === 'popup:get'
    ? { ...base, blocked: ++reads === 1 ? 12 : 3, problems: reads === 1 ? [] : ['network'] }
    : { ok: false, disabled: false, rolledBack: true, error: 'DNR rejected' });
  await ui.get('toggle').click();
  assert.equal(reads, 2);
  assert.equal(ui.get('blocked').textContent, '3');
  assert.equal(ui.get('problems').hidden, false);
  assert.match(ui.get('operationMessage').textContent, /DNR rejected.*Przywrócono poprzednie ustawienia/s);
  assert.equal(ui.get('toggle').disabled, false);
});

test('popup: reload preference blocks conflicting toggle and actual reload result controls the notice', async () => {
  const setting = deferred();
  let autoReload = true;
  const ui = await popup(async (msg) => {
    if (msg.type === 'popup:get') return { ...base, autoReloadOnToggle: autoReload };
    if (msg.type === 'popup:setAutoReload') { await setting.promise; autoReload = false; return { ok: true }; }
    return { ok: true, disabled: true, reloaded: false };
  });
  ui.get('autoReload').checked = false;
  const pending = ui.get('autoReload').dispatch('change');
  assert.equal(ui.get('toggle').disabled, true);
  assert.equal(ui.get('autoReload').disabled, true);
  await ui.get('toggle').click();
  assert.equal(ui.calls.filter((m) => m.type === 'site:toggle').length, 0);
  setting.resolve(); await pending;
  assert.equal(ui.get('autoReload').checked, false);
  await ui.get('toggle').click();
  assert.equal(ui.get('reloadNotice').hidden, false);
  assert.equal(ui.get('blocked').textContent, '12', 'a non-reloaded page keeps the real count');
});

test('popup: reload failure is distinct from a successful protection change', async () => {
  const ui = await popup(async (msg) => msg.type === 'popup:get' ? { ...base }
    : { ok: true, reloaded: false, reloadError: 'tab discarded' });
  await ui.get('toggle').click();
  assert.equal(ui.get('reloadNotice').hidden, false);
  assert.match(ui.get('operationMessage').textContent, /Ochrona została zmieniona.*tab discarded.*ręcznie/s);
});


test('popup: rejected mutation refreshes the result and releases both controls', async () => {
  let reads = 0;
  const ui = await popup(async (msg) => {
    if (msg.type === 'popup:get') return { ...base, disabled: ++reads > 1 };
    throw new Error('worker disconnected');
  });
  await ui.get('toggle').click();
  assert.equal(ui.get('toggle').getAttribute('aria-checked'), 'false', 'show the fresh disabled protection state');
  assert.match(ui.get('operationMessage').textContent, /potwierdzić zmiany.*worker disconnected/s);
  assert.equal(ui.get('toggle').disabled, false);
  assert.equal(ui.get('autoReload').disabled, false);
});


test('popup: English recovery uses translations and shows reload failures explicitly', async () => {
  const saved = globalThis.chrome;
  globalThis.chrome = { i18n: i18nFor('en') };
  try {
    const ui = await popup(async (msg) => msg.type === 'popup:get' ? { ...base }
      : { ok: true, reloaded: false, reloadError: 'tab discarded' });
    await ui.get('toggle').click();
    assert.match(ui.get('operationMessage').textContent, /Protection was changed.*tab discarded.*manually/);
    assert.equal(ui.get('reloadNotice').hidden, false);
  } finally { globalThis.chrome = saved; }
});
