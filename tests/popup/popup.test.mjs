// Popup (v0.3): model widoku i dane z popup:get.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { viewModel } from '../../popup/view-model.js';
import { loadBackground } from '../helpers/chrome-mock.mjs';
import { ROOT } from '../../tools/lists-config.mjs';

const base = { host: 'www.example.com', disabled: false, blocked: 12, canRun: true, problems: [], youtube: null };

test('widok: ochrona aktywna / wyłączona, licznik, „Ukryj element” tylko przy aktywnej ochronie', () => {
  const on = viewModel(base);
  assert.equal(on.status, 'Ochrona aktywna');
  assert.equal(on.on, true);
  assert.equal(on.host, 'example.com');
  assert.equal(on.blocked, '12');
  assert.equal(on.pickerEnabled, true);
  const off = viewModel({ ...base, disabled: true });
  assert.equal(off.status, 'Ochrona wyłączona');
  assert.equal(off.on, false);
  assert.equal(off.pickerEnabled, false);
  assert.equal(viewModel({ ...base, blocked: null }).blocked, '—');
});

test('widok: strona nieobsługiwana (chrome://, brak danych)', () => {
  assert.deepEqual(viewModel(null), { supported: false });
  assert.deepEqual(viewModel({ ...base, canRun: false }), { supported: false });
});

test('widok: błąd komponentu → wyraźne ostrzeżenie (bez fałszywego „wszystko OK”)', () => {
  assert.equal(viewModel(base).problems, '');
  const vm = viewModel({ ...base, problems: ['network', 'scriptlets'] });
  assert.match(vm.problems, /Problem z silnikiem: sieć, scriptlety/);
  assert.match(vm.problems, /diagnostyk/);
});

test('widok: wiersz YouTube Protection tylko gdy popup:get go zwraca', () => {
  assert.equal(viewModel(base).youtube, null);
  assert.deepEqual(viewModel({ ...base, youtube: { status: 'ok', detail: 'ochrona aktywna' } }).youtube, { status: 'ok', label: 'Aktywna', detail: 'ochrona aktywna' });
  assert.equal(viewModel({ ...base, youtube: { status: 'error', detail: 'x' } }).youtube.label, 'Błąd');
  assert.equal(viewModel({ ...base, youtube: { status: 'warning', detail: '' } }).youtube.label, 'Ostrzeżenie');
});

test('popup:get: na YouTube zwraca stan YouTube Protection (tylko odczyt, bez synchronizacji)', async () => {
  const bg = await loadBackground({ tabUrl: 'https://www.youtube.com/watch?v=abc' });
  try {
    await bg.install();
    const before = structuredClone(bg.state.calls);
    const fetchesBefore = bg.state.fetches.length;
    const r = await bg.send({ type: 'popup:get', tabId: 7 });
    assert.equal(r.host, 'www.youtube.com');
    assert.deepEqual(Object.keys(r.youtube), ['status', 'detail']);
    assert.equal(r.youtube.status, 'ok');
    assert.equal(bg.state.calls.register, before.register, 'bez rejestracji');
    assert.equal(bg.state.calls.unregister, before.unregister);
    assert.ok(!bg.state.fetches.slice(fetchesBefore).some((f) => /scriptlets\.json|youtube-compat/.test(f.path)), 'bez synchronizacji / sprawdzania YouTube');
  } finally { bg.restore(); }
});

test('popup:get: poza YouTube bez wiersza YouTube; błąd komponentu w problems', async () => {
  const bg = await loadBackground({ tabUrl: 'https://news.example/', failRulesets: true });
  try {
    await bg.install();
    const r = await bg.send({ type: 'popup:get', tabId: 7 });
    assert.equal(r.youtube, null);
    assert.ok(r.problems.includes('network'));
  } finally { bg.restore(); }
});

test('popup: bez zewnętrznych zasobów, z dostępnością (switch, aria), szerokość 330–350 px', () => {
  const html = fs.readFileSync(path.join(ROOT, 'popup', 'popup.html'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'popup', 'popup.css'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'popup', 'popup.js'), 'utf8') + fs.readFileSync(path.join(ROOT, 'popup', 'view-model.js'), 'utf8');
  assert.ok(!/https?:\/\//.test(html + css + js.replace(/\/\/.*$/gm, '')), 'bez zdalnych fontów, ikon i skryptów');
  assert.match(html, /role="switch"[^>]*aria-checked/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /id="picker"[^>]*>[\s\S]*Ukryj element/);
  assert.match(html, /id="settings"[^>]*>[\s\S]*Ustawienia/);
  assert.match(css, /prefers-color-scheme: dark/);
  const w = Number(/body\s*{[^}]*width:\s*(\d+)px/.exec(css)[1]);
  assert.ok(w >= 330 && w <= 350, `szerokość ${w}`);
  assert.match(css, /--accent: #5b5bd6/, 'kolor przewodni ChromeBlock');
});

test('manifest: brak nowych uprawnień', () => {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  // dokładnie te same uprawnienia co w v0.2.7 (main)
  assert.deepEqual([...m.permissions].sort(), ['declarativeNetRequest', 'declarativeNetRequestFeedback', 'scripting', 'storage', 'webNavigation']);
  assert.deepEqual(m.host_permissions, ['<all_urls>']);
  assert.equal(m.optional_permissions, undefined);
  assert.equal(m.version_name, '0.3.4-dev');
});

test('widok: polska odmiana licznika', async () => {
  const { blockedLabel } = await import('../../popup/view-model.js');
  const word = (n) => blockedLabel(n).split(' ').slice(0, 2).join(' ');
  assert.equal(word(0), 'zablokowanych żądań');
  assert.equal(word(1), 'zablokowane żądanie');
  for (const n of [2, 3, 4, 22, 104]) assert.equal(word(n), 'zablokowane żądania', String(n));
  for (const n of [5, 11, 12, 13, 14, 25, 112]) assert.equal(word(n), 'zablokowanych żądań', String(n));
  assert.equal(word(null), 'zablokowanych żądań');
});

test('popup: ukryte elementy naprawdę ukryte (atrybut hidden ma pierwszeństwo przed display)', () => {
  const css = fs.readFileSync(path.join(ROOT, 'popup', 'popup.css'), 'utf8');
  assert.match(css, /\[hidden\]\s*{\s*display:\s*none\s*!important;?\s*}/);
});
