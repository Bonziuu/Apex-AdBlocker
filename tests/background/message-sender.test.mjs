// Weryfikacja nadawcy wiadomości w service workerze: skrypty treści (każda strona WWW) mogą
// wysyłać tylko wiadomości kosmetyki / YouTube / pomiarów / „Ukryj element”. Zmiana ustawień,
// import kopii i diagnostyka są dostępne wyłącznie ze stron rozszerzenia.

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBackground, sender, extensionSender } from '../helpers/chrome-mock.mjs';

const PAGE = sender('https://evil.example/');

test('skrypt treści nie może wyłączyć ochrony strony ani zmienić ustawień', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    // dziennik diagnostyki (health) celowo notuje odrzucone wiadomości – porównujemy resztę stanu
    const settings = () => { const { health, ...rest } = bg.store; return JSON.stringify(rest); };
    const before = settings();
    for (const msg of [
      { type: 'site:toggle', host: 'evil.example' },
      { type: 'options:setDisabledSites', sites: ['evil.example'] },
      { type: 'options:setUserFilters', text: '@@||evil.example^' },
      { type: 'settings:import', text: '{}' },
      { type: 'popup:setAutoReload', value: true },
      { type: 'options:setDevPerf', value: true },
      { type: 'health:resync' },
    ]) {
      assert.deepEqual(await bg.send(msg, PAGE), { ok: false, error: 'forbidden' }, msg.type);
    }
    assert.equal(settings(), before);
    const h = await bg.send({ type: 'health:get' });
    assert.ok(h.errors.some((e) => /site:toggle: odrzucono/.test(e.message)), 'odrzucenie widać w diagnostyce');
  } finally { bg.restore(); }
});

test('skrypt treści nie może odczytać diagnostyki ani eksportu ustawień', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    for (const type of ['health:get', 'diagnostics:export', 'settings:export', 'options:get', 'popup:get', 'startup:profile']) {
      assert.deepEqual(await bg.send({ type }, PAGE), { ok: false, error: 'forbidden' }, type);
    }
  } finally { bg.restore(); }
});

test('strona rozszerzenia nadal zmienia ustawienia; skrypt treści nadal dodaje filtr z „Ukryj element”', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const r = await bg.send({ type: 'site:toggle', host: 'example.com' }, extensionSender('popup/popup.html'));
    assert.notEqual(r && r.error, 'forbidden');
    const p = await bg.send({ type: 'picker:add', selector: 'div.ad' }, sender('https://www.example.org/'));
    assert.deepEqual(p, { ok: true, line: 'example.org##div.ad' });
  } finally { bg.restore(); }
});

test('typy spoza rejestru handlerów (np. z prototypu obiektu) są ignorowane', async () => {
  const bg = await loadBackground();
  try {
    for (const type of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
      const handled = bg.state.listeners.message({ type }, extensionSender(), () => {});
      assert.equal(handled, false, type);
    }
  } finally { bg.restore(); }
});

test('polityka nadawców: czyste funkcje modułu background/message-policy.js', async () => {
  const { senderAllowed, isExtensionPageSender, handlerFor } = await import('../../background/message-policy.js');
  const base = 'chrome-extension://abc/';
  assert.ok(isExtensionPageSender({ url: base + 'popup/popup.html' }, base));
  assert.ok(!isExtensionPageSender({ url: 'https://abc.example/chrome-extension://abc/' }, base));
  assert.ok(!isExtensionPageSender({ url: base }, ''));
  assert.ok(!isExtensionPageSender(undefined, base));
  assert.ok(senderAllowed('picker:add', { url: 'https://a.test/' }, base));
  assert.ok(!senderAllowed('settings:import', { url: 'https://a.test/' }, base));
  assert.ok(senderAllowed('settings:import', { url: base + 'options/options.html', tab: { id: 3 } }, base));
  const handlers = { 'popup:get': () => 1 };
  assert.equal(typeof handlerFor(handlers, { type: 'popup:get' }), 'function');
  assert.equal(handlerFor(handlers, { type: 'constructor' }), null);
  assert.equal(handlerFor(handlers, { type: 42 }), null);
  assert.equal(handlerFor(handlers, null), null);
});
