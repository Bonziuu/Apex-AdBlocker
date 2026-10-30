import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { initializeOptions } from '../../options/options.js';
import { compileUserFilters } from '../../background/user-filters.js';
import { uiDocument, uiWindow, deferred } from '../helpers/ui-dom.mjs';
import { MESSAGES } from '../../tools/i18n-messages.mjs';
import { i18nFor } from '../helpers/i18n-mock.mjs';

const html = fs.readFileSync(new URL('../../options/options.html', import.meta.url), 'utf8');
const settings = { version: '1.0.0', lists: [], disabledSites: ['example.com'], userFilters: '##.ads', userErrors: [], userCount: 1 };
const health = { components: {}, sync: {}, errors: [], youtube: null, devPerf: false, perf: [] };
async function options(send) {
  const document = uiDocument(html), window = uiWindow(), calls = [];
  await initializeOptions({ document, window, chrome: { runtime: { sendMessage(msg) { calls.push(msg); return send(msg); } } } });
  return { get: (id) => document.getElementById(id), document, window, calls };
}

test('options: initial error keeps diagnostic actions usable and retry restores the form', async () => {
  let fail = true;
  const ui = await options(async (msg) => msg.type === 'options:get'
    ? fail ? { ok: false, error: 'state unavailable' } : { ...settings }
    : health);
  assert.equal(ui.get('loadError').hidden, false);
  assert.match(ui.get('loadErrorMessage').textContent, /state unavailable/);
  assert.equal(ui.get('saveFilters').disabled, true);
  ui.window.location.hash = '#diag';
  ui.window.dispatch('hashchange');
  assert.equal(ui.get('more').hidden, false);
  assert.equal(ui.get('diag').open, true);
  await ui.get('refreshDiag').click();
  assert.ok(ui.calls.some((m) => m.type === 'health:get'));
  fail = false;
  await ui.get('retryOptions').click();
  assert.equal(ui.get('loadError').hidden, true);
  assert.equal(ui.get('saveFilters').disabled, false);
  assert.equal(ui.get('userFilters').value, '##.ads');
});

test('options: rejected saves preserve text, show the error, and allow a successful retry', async () => {
  let fail = true;
  const ui = await options(async (msg) => {
    if (msg.type === 'options:get') return { ...settings };
    if (fail) throw new Error('worker disconnected');
    return msg.type === 'options:setUserFilters' ? { ok: true, errors: [], count: 1 } : { ok: true, disabledSites: ['new.example'] };
  });
  ui.get('userFilters').value = '##.new-ad';
  await ui.get('saveFilters').click();
  assert.match(ui.get('filtersMsg').textContent, /worker disconnected/);
  assert.equal(ui.get('userFilters').value, '##.new-ad');
  assert.equal(ui.get('saveFilters').disabled, false);
  assert.equal(ui.get('userFilters').disabled, false);
  ui.get('disabledSites').value = 'new.example';
  await ui.get('saveSites').click();
  assert.match(ui.get('sitesMsg').textContent, /worker disconnected/);
  assert.equal(ui.get('saveSites').disabled, false);
  fail = false;
  await ui.get('saveFilters').click();
  await ui.get('saveSites').click();
  assert.match(ui.get('filtersMsg').textContent, /Zapisano/);
  assert.equal(ui.get('disabledSites').value, 'new.example');
  assert.match(ui.get('sitesMsg').textContent, /Zapisano/);
});

test('options: a pending save prevents conflicting import/edits and releases controls on failure', async () => {
  const saving = deferred();
  const ui = await options(async (msg) => msg.type === 'options:get' ? { ...settings } : saving.promise);
  const pending = ui.get('saveFilters').click();
  assert.equal(ui.get('saveSites').disabled, true);
  assert.equal(ui.get('importSettings').disabled, true);
  assert.equal(ui.get('disabledSites').disabled, true);
  saving.reject(new Error('save rejected'));
  await pending;
  assert.equal(ui.get('importSettings').disabled, false);
  assert.equal(ui.get('saveSites').disabled, false);
});

test('options: incomplete rollback is explicit and refreshes both settings forms', async () => {
  for (const [button, field, value, type] of [
    ['saveFilters', 'userFilters', '##.requested', 'options:setUserFilters'],
    ['saveSites', 'disabledSites', 'requested.example', 'options:setDisabledSites'],
  ]) {
    let changed = false;
    const current = { ...settings, userFilters: '##.persisted', disabledSites: ['persisted.example'] };
    const ui = await options(async (msg) => {
      if (msg.type === 'options:get') return { ...(changed ? current : settings) };
      assert.equal(msg.type, type);
      changed = true;
      return { ok: false, error: 'scriptlets failed', rolledBack: false, rollbackErrors: ['storage unavailable'] };
    });
    ui.get(field).value = value;
    await ui.get(button).click();
    const message = ui.get(button === 'saveFilters' ? 'filtersMsg' : 'sitesMsg').textContent;
    assert.match(message, /Nie udało się w pełni przywrócić poprzednich ustawień/);
    assert.match(message, /Odczytano aktualne zapisane ustawienia/);
    assert.match(message, /Otwórz diagnostykę/);
    assert.equal(ui.get('userFilters').value, current.userFilters);
    assert.equal(ui.get('disabledSites').value, 'persisted.example');
    assert.equal(ui.get('saveFilters').disabled, false);
    assert.equal(ui.get('saveSites').disabled, false);
  }
});

test('options: incomplete rollback plus failed refresh keeps stale forms read-only until retry', async () => {
  let reads = 0;
  const ui = await options(async (msg) => {
    if (msg.type === 'options:get') {
      if (++reads === 2) throw new Error('refresh unavailable');
      return { ...settings };
    }
    return { ok: false, error: 'DNR failed', rolledBack: false, rollbackErrors: ['rollback failed'] };
  });
  ui.get('userFilters').value = '##.requested';
  await ui.get('saveFilters').click();
  assert.match(ui.get('filtersMsg').textContent, /Nie udało się w pełni przywrócić/);
  assert.match(ui.get('filtersMsg').textContent, /spróbuj ponownie odczytać/);
  assert.equal(ui.get('loadError').hidden, false);
  assert.equal(ui.get('saveFilters').disabled, true);
  assert.equal(ui.get('saveSites').disabled, true);
  await ui.get('retryOptions').click();
  assert.equal(ui.get('loadError').hidden, true);
  assert.equal(ui.get('userFilters').value, settings.userFilters);
  assert.equal(ui.get('saveFilters').disabled, false);
});

test('options: resync rejection releases the button and reports its failure', async () => {
  const ui = await options(async (msg) => {
    if (msg.type === 'options:get') return { ...settings };
    throw new Error('resync unavailable');
  });
  await ui.get('resync').click();
  assert.equal(ui.get('resync').disabled, false);
  assert.match(ui.get('diagMsg').textContent, /resync unavailable/);
});

test('options: successful import with a failed refresh is reported as restored, not an invalid file', async () => {
  let imported = false;
  const ui = await options(async (msg) => {
    if (msg.type === 'options:get') {
      if (imported) throw new Error('refresh disconnected');
      return { ...settings };
    }
    imported = true;
    return { ok: true, summary: ['Wyłączone strony: 1'] };
  });
  ui.get('importFile').files = [{ size: 2, text: async () => '{}' }];
  await ui.get('importFile').dispatch('change');
  assert.equal(ui.get('importSummary').hidden, false);
  assert.equal(ui.get('importErrors').hidden, true);
  assert.match(ui.get('backupMsg').textContent, /Ustawienia przywrócone.*nie udało się odświeżyć/);
  assert.equal(ui.get('loadError').hidden, false);
  assert.equal(ui.get('saveFilters').disabled, true, 'stale settings remain read-only until a retry');
});

test('options: arrow, Home and End navigate the accessible tab list and move focus', async () => {
  const ui = await options(async () => ({ ...settings }));
  let prevented = 0;
  await ui.get('tab-protection').dispatch('keydown', { key: 'ArrowRight', preventDefault() { prevented++; } });
  assert.equal(ui.document.activeElement, ui.get('tab-filters'));
  assert.equal(ui.get('filters').hidden, false);
  assert.equal(ui.get('tab-protection').tabIndex, -1);
  assert.equal(ui.get('tab-filters').tabIndex, 0);
  assert.equal(ui.get('tab-filters').getAttribute('aria-selected'), 'true');
  await ui.get('tab-filters').dispatch('keydown', { key: 'End', preventDefault() { prevented++; } });
  assert.equal(ui.document.activeElement, ui.get('tab-more'));
  await ui.get('tab-more').dispatch('keydown', { key: 'Home', preventDefault() { prevented++; } });
  assert.equal(ui.document.activeElement, ui.get('tab-protection'));
  assert.equal(prevented, 3);
  assert.equal(ui.get('filters').getAttribute('aria-labelledby'), 'tab-filters');
});

test('options: the complete help block compiles into six working example filters', () => {
  const examples = html.match(/<pre\b[^>]*>([\s\S]*?)<\/pre>/)[1];
  const compiled = compileUserFilters(examples);
  assert.deepEqual(compiled.errors, []);
  assert.equal(compiled.count, 6);
  assert.equal(compiled.rules.length, 3);
  assert.deepEqual(compiled.genC, ['.sponsorowane']);
  assert.deepEqual(compiled.spec['example.com'], ['.reklama']);
  assert.deepEqual(compiled.proc['example.com'], [[{ css: 'div' }, { op: 'has-text', arg: 'Reklama' }]]);
});


test('options: incomplete import reloads the persisted state, and a failed reload disables stale edits', async () => {
  for (const failRefresh of [false, true]) {
    let imported = false;
    const current = { ...settings, userFilters: '##.persisted', disabledSites: ['persisted.example'] };
    const ui = await options(async (msg) => {
      if (msg.type === 'options:get') {
        if (imported && failRefresh) throw new Error('refresh unavailable');
        return { ...(imported ? current : settings) };
      }
      assert.equal(msg.type, 'settings:import');
      imported = true;
      return { ok: false, rolledBack: false, errors: ['sync failed'], rollbackErrors: ['storage unavailable'] };
    });
    ui.get('importFile').files = [{ size: 2, text: async () => '{}' }];
    await ui.get('importFile').dispatch('change');
    assert.equal(ui.calls.filter((msg) => msg.type === 'options:get').length, 2);
    assert.equal(ui.get('importErrors').hidden, false);
    assert.match(ui.get('importErrors').textContent, /nie udało się w pełni przywrócić/);
    assert.equal(ui.get('saveFilters').disabled, failRefresh);
    assert.equal(ui.get('loadError').hidden, !failRefresh);
    if (!failRefresh) {
      assert.equal(ui.get('userFilters').value, current.userFilters);
      assert.equal(ui.get('disabledSites').value, 'persisted.example');
    }
  }
});

test('options: import with a lost response reloads settings and describes the outcome as unconfirmed', async () => {
  let imported = false;
  const ui = await options(async (msg) => {
    if (msg.type === 'options:get') return { ...settings, userFilters: imported ? '##.imported' : settings.userFilters };
    imported = true;
    throw new Error('worker disconnected');
  });
  ui.get('importFile').files = [{ size: 2, text: async () => '{}' }];
  await ui.get('importFile').dispatch('change');
  assert.equal(ui.get('userFilters').value, '##.imported');
  assert.match(ui.get('backupMsg').textContent, /potwierdzić importu.*worker disconnected/);
  assert.equal(ui.get('importErrors').hidden, true);
});

test('options: localized help in both languages compiles into six working filters', () => {
  for (const lang of ['pl', 'en']) {
    const compiled = compileUserFilters(MESSAGES.filters_examplesBody[lang]);
    assert.deepEqual(compiled.errors, [], lang);
    assert.equal(compiled.count, 6, lang);
    assert.equal(compiled.rules.length, 3, lang);
    assert.equal(compiled.genC.length, 1, lang);
    assert.equal(compiled.spec['example.com'].length, 1, lang);
    assert.equal(compiled.proc['example.com'].length, 1, lang);
  }
});

test('options: recovery feedback is translated for an English browser', async () => {
  const saved = globalThis.chrome;
  globalThis.chrome = { i18n: i18nFor('en') };
  try {
    const ui = await options(async (msg) => {
      if (msg.type === 'options:get') return { ...settings };
      throw new Error('worker disconnected');
    });
    await ui.get('saveFilters').click();
    assert.equal(ui.get('filtersMsg').textContent, 'Error: worker disconnected');
    assert.equal(ui.get('saveFilters').disabled, false);
  } finally { globalThis.chrome = saved; }
});
