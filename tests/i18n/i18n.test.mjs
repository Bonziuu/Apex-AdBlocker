// Wersja angielska i polska: _locales aktualne względem tools/i18n-messages.mjs, każdy klucz użyty
// w HTML/JS istnieje w obu językach, manifest korzysta z tłumaczeń, a widok popupu i odmiana
// liczebników działają w obu językach.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, LOCALES, DEFAULT_LOCALE, localeFile } from '../../tools/build-i18n.mjs';
import { MESSAGES } from '../../tools/i18n-messages.mjs';
import { installI18n, loadMessages } from '../helpers/i18n-mock.mjs';

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

test('_locales/{pl,en}/messages.json aktualne (npm run i18n) i z tymi samymi kluczami', () => {
  for (const lang of LOCALES) assert.equal(read(`_locales/${lang}/messages.json`), localeFile(lang), `${lang}: uruchom npm run i18n`);
  assert.deepEqual(Object.keys(loadMessages('pl')).sort(), Object.keys(loadMessages('en')).sort());
});

test('źródło tekstów: każdy wpis ma oba języki, te same wstawki $1…$9 i znaczniki tylko z html: true', () => {
  for (const [key, e] of Object.entries(MESSAGES)) {
    const subs = (s) => [...s.matchAll(/\$(\d)/g)].map((m) => m[1]).sort().join(',');
    assert.equal(subs(e.pl), subs(e.en), `${key}: różne wstawki`);
    for (const lang of ['pl', 'en']) {
      if (!e.html) assert.doesNotMatch(e[lang], /<[a-z]/i, `${key}/${lang}: znaczniki bez html: true`);
    }
  }
});

test('każdy klucz z HTML (data-i18n*) i JS (t/tPlural/T) istnieje w tłumaczeniach', () => {
  const keys = new Set(Object.keys(MESSAGES));
  const used = new Set();
  for (const f of ['popup/popup.html', 'options/options.html', 'welcome/welcome.html']) {
    for (const m of read(f).matchAll(/data-i18n(?:-html|-placeholder|-title|-aria-label)?="([^"]+)"/g)) used.add(m[1]);
  }
  for (const f of ['popup/popup.js', 'popup/view-model.js', 'options/options.js', 'welcome/welcome.js', 'content/picker.js']) {
    for (const m of read(f).matchAll(/\b(?:t|T)\('([a-zA-Z0-9_]+)'/g)) used.add(m[1]);
  }
  for (const k of used) assert.ok(keys.has(k), `brak tłumaczenia: ${k}`);
  // klucze budowane dynamicznie
  for (const base of ['popup_blocked', 'rules', 'picker_match']) for (const f of ['one', 'few', 'many']) assert.ok(keys.has(`${base}_${f}`), `${base}_${f}`);
  for (const id of JSON.parse(read('data/lists.json')).map((l) => l.id)) {
    assert.ok(keys.has(`list_${id}_name`) && keys.has(`list_${id}_desc`), `lista ${id}`);
  }
  for (const k of ['invalid', 'rolledBack', 'incomplete']) assert.ok(keys.has(`import_${k}`));
});

test('manifest: opis z tłumaczeń, default_locale en, opisy w limicie 132 znaków', () => {
  const m = JSON.parse(read('manifest.json'));
  assert.equal(m.default_locale, DEFAULT_LOCALE);
  assert.equal(m.description, '__MSG_extDescription__');
  for (const lang of LOCALES) {
    const d = loadMessages(lang).extDescription.message;
    assert.ok(d.length > 0 && d.length <= 132, `${lang}: ${d.length} znaków`);
  }
});

test('popup po angielsku: status, licznik z odmianą, problemy silnika', async () => {
  installI18n('en');
  try {
    const { viewModel, blockedLabel } = await import('../../popup/view-model.js');
    const vm = viewModel({ host: 'www.example.com', disabled: false, blocked: 1234, canRun: true, problems: ['cosmetic'], youtube: { status: 'ok', detail: '' } });
    assert.equal(vm.status, 'Protection on');
    assert.equal(vm.blocked, '1,234');
    assert.equal(vm.problems, 'Engine problem: cosmetic filters – open diagnostics');
    assert.equal(vm.youtube.label, 'Active');
    assert.equal(blockedLabel(1), 'blocked request on this tab');
    for (const n of [0, 2, 5, 22]) assert.equal(blockedLabel(n), 'blocked requests on this tab', String(n));
    assert.equal(viewModel({ host: 'a.pl', disabled: true, blocked: 0, canRun: true }).status, 'Protection off');
  } finally { installI18n('pl'); }
});

test('popup po polsku: te same teksty co przed tłumaczeniem', async () => {
  installI18n('pl');
  const { viewModel } = await import('../../popup/view-model.js');
  const vm = viewModel({ host: 'example.com', disabled: false, blocked: 1234, canRun: true, problems: ['network'] });
  assert.equal(vm.status, 'Ochrona aktywna');
  assert.equal(vm.blocked, (1234).toLocaleString('pl-PL'));
  assert.equal(vm.problems, 'Problem z silnikiem: sieć – otwórz diagnostykę');
});

test('odmiana: polska (1 / 2–4 / 5+, 12–14) i angielska (1 / reszta)', async () => {
  const { pluralForm } = await import('../../shared/i18n.js');
  assert.equal(pluralForm(1, 'pl'), 'one');
  for (const n of [2, 3, 4, 22, 104]) assert.equal(pluralForm(n, 'pl'), 'few', String(n));
  for (const n of [0, 5, 11, 12, 13, 14, 25, 112]) assert.equal(pluralForm(n, 'pl'), 'many', String(n));
  assert.equal(pluralForm(1, 'en'), 'one');
  for (const n of [0, 2, 3, 12]) assert.equal(pluralForm(n, 'en'), 'many', String(n));
});

test('„Ukryj element”: teksty z chrome.i18n z polskim zapasem, paleta morska zamiast fioletu', () => {
  const src = read('content/picker.js');
  assert.match(src, /chrome\.i18n\.getMessage/);
  assert.doesNotMatch(src, /#5b5bd6|#4c4cc4|91,91,214/i, 'resztki fioletowej palety');
  assert.match(src, /picker_match_\$\{f\}/, 'odmiana liczby pasujących elementów');
});
