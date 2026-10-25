// UI trybów ochrony (v0.3.1): popup + opcje. Logika kontrolera i integracja z tłem (bez DOM).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PRESETS, MODE_LABEL, MODE_SHORT, MODE_CONTENTS, MODE_ERROR, modeDisplay, createModeController,
} from '../../shared/protection-mode-ui.js';
import { viewModel } from '../../popup/view-model.js';
import { loadBackground } from '../helpers/chrome-mock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

/** send z ręcznym rozwiązywaniem – do testów stanu „w trakcie”. */
function deferredSend() {
  const calls = [];
  const send = (msg) => new Promise((resolve, reject) => calls.push({ msg, resolve, reject }));
  return { calls, send };
}

test('popup pokazuje Basic, Balanced, Strict i Własny', () => {
  assert.deepEqual(PRESETS, ['basic', 'balanced', 'strict']);
  assert.equal(modeDisplay('basic').label, 'Basic');
  assert.equal(modeDisplay('balanced').label, 'Balanced');
  assert.equal(modeDisplay('strict').label, 'Strict');
  assert.equal(modeDisplay('custom').label, 'Własny');
  assert.equal(modeDisplay('custom').isCustom, true);
  assert.equal(modeDisplay(undefined).label, 'Własny', 'nieznany stan nie udaje presetu');
  assert.equal(MODE_SHORT.basic, 'Reklamy, śledzenie i złośliwe strony');
  assert.equal(MODE_SHORT.balanced, '+ komunikaty o cookies');
  assert.equal(MODE_SHORT.strict, '+ elementy irytujące');
  for (const m of ['basic', 'balanced', 'strict', 'custom']) {
    assert.equal(viewModel({ canRun: true, host: 'a.pl', protectionMode: m, blocked: 0 }).protectionMode, m);
  }
});

test('popup.html: 3 przyciski presetów w radiogroup, Własny niewybieralny, link do ustawień', () => {
  const html = read('popup/popup.html');
  assert.match(html, /role="radiogroup"/);
  const modes = [...html.matchAll(/class="seg-btn" data-mode="(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(modes, ['basic', 'balanced', 'strict']);
  assert.doesNotMatch(html, /data-mode="custom"/);
  assert.match(html, /Edytuj w ustawieniach/);
  assert.match(read('popup/popup.js'), /options:setProtectionMode|createModeController/);
  assert.doesNotMatch(read('popup/popup.js').split('// --- tryb ochrony ---')[1].split("$('toggle')")[0], /tabs\.reload/,
    'zmiana trybu nie przeładowuje karty');
});

test('opcje: sekcja „Tryb ochrony” nad listami, opisy presetów bez wartościowania', () => {
  const html = read('options/options.html');
  const lists = html.slice(html.indexOf('id="lists"'));
  assert.ok(lists.indexOf('modeCards') < lists.indexOf('listContainer'), 'tryb na górze zakładki');
  assert.match(lists, /Własny/);
  assert.equal(MODE_CONTENTS.basic, 'Reklamy, śledzenie i złośliwe strony');
  assert.match(MODE_CONTENTS.balanced, /cookies/);
  assert.match(MODE_CONTENTS.strict, /irytujące/);
  const words = /najlepsz|zalecan|polecan|rekomend|maksymaln/i;
  for (const t of [...Object.values(MODE_LABEL), ...Object.values(MODE_SHORT), ...Object.values(MODE_CONTENTS), html, read('popup/popup.html')]) {
    assert.doesNotMatch(t, words, 'Strict nie jest przedstawiany jako „najlepszy”');
  }
});

test('zmiana Basic → Balanced → Strict: blokada w trakcie, potem nowy tryb', async () => {
  const d = deferredSend();
  const states = [];
  const c = createModeController({ send: d.send, initial: 'basic', onChange: (s) => states.push(s) });
  const p1 = c.select('balanced');
  assert.equal(c.state.busy, true);
  assert.equal(c.state.pending, 'balanced');
  assert.equal(c.state.mode, 'basic', 'do potwierdzenia pokazujemy stary tryb jako bieżący');
  assert.deepEqual(d.calls[0].msg, { type: 'options:setProtectionMode', mode: 'balanced' });
  d.calls[0].resolve({ ok: true, protectionMode: 'balanced' });
  await p1;
  assert.equal(c.state.mode, 'balanced');
  assert.equal(c.state.busy, false);
  assert.equal(c.state.error, '');

  const p2 = c.select('strict');
  d.calls[1].resolve({ ok: true, protectionMode: 'strict' });
  await p2;
  assert.equal(c.state.mode, 'strict');
  assert.equal(c.state.label, 'Strict');
  assert.ok(states.some((s) => s.busy), 'emitowany stan ładowania');
});

test('błąd backendu → powrót do poprzedniego trybu i komunikat', async () => {
  for (const fail of [{ ok: false, error: 'x' }, null, 'throw']) {
    const d = deferredSend();
    const c = createModeController({ send: d.send, initial: 'balanced' });
    const p = c.select('strict');
    if (fail === 'throw') d.calls[0].reject(new Error('port zamknięty')); else d.calls[0].resolve(fail);
    await p;
    assert.equal(c.state.mode, 'balanced');
    assert.equal(c.state.busy, false);
    assert.equal(c.state.error, MODE_ERROR);
  }
  // kolejna udana zmiana czyści komunikat
  const c = createModeController({ send: async () => ({ ok: true, protectionMode: 'strict' }), initial: 'basic' });
  await c.select('strict');
  assert.equal(c.state.error, '');
});

test('szybkie kliknięcia → jedna wysyłka, brak wyścigu', async () => {
  const d = deferredSend();
  const c = createModeController({ send: d.send, initial: 'basic' });
  const p = c.select('balanced');
  const r2 = await c.select('strict');
  const r3 = await c.select('basic');
  assert.deepEqual(r2, { ignored: true });
  assert.deepEqual(r3, { ignored: true });
  assert.equal(d.calls.length, 1);
  d.calls[0].resolve({ ok: true, protectionMode: 'balanced' });
  await p;
  assert.equal(c.state.mode, 'balanced');
  assert.deepEqual(await c.select('balanced'), { ignored: true }, 'ten sam tryb – bez wysyłki');
  assert.deepEqual(await c.select('custom'), { ignored: true }, 'Własny nie jest wybieralny');
  assert.equal(d.calls.length, 1);
  c.sync('strict');
  assert.equal(c.state.mode, 'strict');
});

test('Własny: kontroler nie konwertuje go sam na preset', async () => {
  let sent = 0;
  const c = createModeController({ send: async () => { sent++; return { ok: true }; }, initial: 'custom' });
  assert.equal(c.state.isCustom, true);
  assert.equal(c.state.label, 'Własny');
  assert.equal(sent, 0);
});

test('integracja: popup zmienia tryb przez tło; ręczna zmiana list → Własny, zgodna z presetem → preset', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const popup = () => bg.send({ type: 'popup:get', tabId: 1 });
    assert.equal((await popup()).protectionMode, 'basic');

    const c = createModeController({ send: (m) => bg.send(m), initial: (await popup()).protectionMode });
    await c.select('balanced');
    assert.equal(c.state.mode, 'balanced');
    assert.equal((await popup()).protectionMode, 'balanced');
    await c.select('strict');
    assert.equal((await popup()).protectionMode, 'strict');

    // ręcznie: bez privacy i annoyances → Własny
    await bg.send({ type: 'options:setLists', enabledLists: ['ads', 'security', 'cookies'] });
    assert.equal((await popup()).protectionMode, 'custom');
    assert.equal((await bg.send({ type: 'options:get' })).protectionMode, 'custom');

    // ręcznie ustawione identycznie jak Balanced → Balanced
    await bg.send({ type: 'options:setLists', enabledLists: ['cookies', 'security', 'privacy', 'ads'] });
    assert.equal((await popup()).protectionMode, 'balanced');
  } finally { bg.restore(); }
});

test('integracja: błąd Chrome przy zmianie trybu → UI wraca do poprzedniego', async () => {
  const opts = {};
  const bg = await loadBackground(opts);
  try {
    await bg.install();
    opts.failRulesets = true;
    const c = createModeController({ send: (m) => bg.send(m), initial: 'basic' });
    await c.select('strict');
    assert.equal(c.state.mode, 'basic');
    assert.equal(c.state.error, MODE_ERROR);
    opts.failRulesets = false;
    assert.equal((await bg.send({ type: 'popup:get', tabId: 1 })).protectionMode, 'basic');
  } finally { bg.restore(); }
});
