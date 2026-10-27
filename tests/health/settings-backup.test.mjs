// Kopia ustawień (eksport / import): format v2 (tylko wyłączone strony i własne filtry), import kopii
// v1 ze starszych wersji, prywatność, pełna walidacja, atomowość z rollbackiem.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BACKUP_FORMAT, BACKUP_VERSION, SUPPORTED_BACKUP_VERSIONS, BACKUP_SETTINGS_KEYS, LEGACY_BACKUP_KEYS,
  buildBackup, backupFileName, parseBackup, validateBackup, summarizeSettings, rulesWord, importFailureMessage, IMPORT_MSG,
} from '../../shared/settings-backup.js';
import { CORE_LISTS } from '../../shared/core-lists.js';
import { loadBackground } from '../helpers/chrome-mock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const sorted = (a) => [...a].sort();
const CORE = sorted(CORE_LISTS);
const SITES = ['bank.example', 'www.shop.example'];
const FILTERS = '! moje\n||ads.example^\nexample.com##.reklama\n';

/** Kopia v2 (bieżący format). */
function backupText(settings = {}, extra = {}) {
  return JSON.stringify({
    format: BACKUP_FORMAT, version: 2, exportedAt: '2026-10-26T12:00:00.000Z', extensionVersion: '0.3.4-dev',
    settings: { disabledSites: SITES, userFilters: FILTERS, ...settings },
    ...extra,
  });
}
/** Kopia v1 ze starszej wersji ChromeBlock (z listami, trybem i Focus Mode). */
function backupV1(enabledLists, protectionMode, more = {}) {
  return JSON.stringify({
    format: BACKUP_FORMAT, version: 1, exportedAt: '2026-10-20T12:00:00.000Z', extensionVersion: '0.3.2-dev',
    settings: { enabledLists, disabledSites: SITES, userFilters: FILTERS, protectionMode, ...more },
  });
}
const enabledNow = async (bg) => sorted((await bg.send({ type: 'options:get' })).lists.filter((l) => l.enabled).map((l) => l.id));

/** Dane, które NIE mogą trafić do kopii (health, diagnostyka, cache, sesja, statystyki, karty, URL). */
const TECH = {
  health: { components: { network: { status: 'ok' } } },
  startupProfile: { totalMs: 700 },
  devPerf: true,
  scriptletPerf: { rows: [['https://www.youtube.com/watch?v=SECRETVID01', 1]] },
  stats: { total: 5, sites: { 'news.example': { n: 5, last: 1 } } },
  hostCache: { 'https://private.example/path?token=abc': 1 },
};

// --- eksport ---------------------------------------------------------------------

test('eksport v2: tylko wyłączone strony i własne filtry (bez list, trybu, Focus Mode), wartości z bieżącego stanu', async () => {
  const bg = await loadBackground({ local: { ...TECH, enabledLists: ['ads', 'cookies'], protectionMode: 'custom', youtubeFocus: { enabled: true } } });
  try {
    await bg.install();
    await bg.send({ type: 'options:setDisabledSites', sites: ['bank.example', 'www.Shop.example'] });
    await bg.send({ type: 'options:setUserFilters', text: '||ads.example^\n' });
    const r = await bg.send({ type: 'settings:export' });
    assert.equal(r.ok, true);
    assert.match(r.fileName, /^chromeblock-ustawienia-\d{4}-\d{2}-\d{2}\.json$/);
    const b = r.backup;
    assert.equal(b.format, 'chromeblock-settings');
    assert.equal(b.version, 2);
    assert.equal(BACKUP_VERSION, 2);
    assert.deepEqual(Object.keys(b).sort(), ['exportedAt', 'extensionVersion', 'format', 'settings', 'version']);
    assert.deepEqual(Object.keys(b.settings).sort(), ['disabledSites', 'userFilters']);
    assert.deepEqual([...BACKUP_SETTINGS_KEYS], ['disabledSites', 'userFilters']);
    for (const k of ['enabledLists', 'protectionMode', 'youtubeFocus']) assert.ok(!(k in b.settings), k);
    assert.deepEqual(b.settings.disabledSites, ['bank.example', 'shop.example']);
    assert.equal(b.settings.userFilters, '||ads.example^\n');
    assert.equal(parseBackup(JSON.stringify(b)).ok, true, 'eksport → import tego samego pliku');
  } finally { bg.restore(); }
});

test('eksport: brak danych technicznych i prywatnych (health, diagnostyka, cache, sesja, statystyki, karty, URL)', async () => {
  const bg = await loadBackground({ local: { ...TECH } });
  try {
    await bg.install();
    bg.session.statsTabs = { 7: [{ host: 'news.example', since: 1 }] };
    const text = JSON.stringify((await bg.send({ type: 'settings:export' })).backup);
    for (const bad of ['health', 'startupProfile', 'devPerf', 'scriptletPerf', 'stats', 'hostCache', 'statsTabs', 'sessionScriptletsOk', 'tabId', 'SECRETVID01', 'token', 'https://', 'http://', 'news.example']) {
      assert.ok(!text.includes(bad), `kopia zawiera „${bad}”`);
    }
  } finally { bg.restore(); }
  // tylko dozwolone pola nawet z „brudnych” danych wejściowych
  const b = buildBackup({ enabledLists: ['ads'], disabledSites: [], userFilters: '', protectionMode: 'custom', youtubeFocus: {}, stats: 1, health: 2 });
  assert.deepEqual(Object.keys(b.settings).sort(), ['disabledSites', 'userFilters']);
});

// --- import v2 ---------------------------------------------------------------------

test('import v2: zapis, synchronizacja reguł dynamicznych i scriptletów, podsumowanie; listy dalej stałe', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const r = await bg.send({ type: 'settings:import', text: backupText() });
    assert.equal(r.ok, true, JSON.stringify(r.errors));
    assert.deepEqual(bg.store.disabledSites, ['bank.example', 'shop.example']);
    assert.equal(bg.store.userFilters, FILTERS);
    assert.ok(bg.state.dynamic.some((r2) => r2.action.type === 'allowAllRequests'), 'reguła wyłączonych stron');
    assert.ok(bg.state.registered.some((x) => x.id.startsWith('sl-') && (x.excludeMatches || []).some((m) => m.includes('bank.example'))), 'scriptlety pomijają wyłączone strony');
    assert.deepEqual(sorted(bg.state.enabledRulesets), CORE);
    assert.deepEqual(await enabledNow(bg), CORE);
    for (const k of ['enabledLists', 'protectionMode']) assert.ok(!(k in bg.store), k);
    assert.deepEqual(r.summary, ['Wyłączone strony: 2', 'Moje filtry: 2 reguły']);
    assert.deepEqual(r.ignored, []);
  } finally { bg.restore(); }
});

// --- import v1 (kopie ze starszych wersji) -----------------------------------------

const V1 = {
  basic: ['ads', 'privacy', 'security'],
  balanced: ['ads', 'privacy', 'security', 'cookies'],
  strict: ['ads', 'privacy', 'security', 'cookies', 'annoyances'],
  custom: ['ads', 'cookies'],
};
for (const [mode, lists] of Object.entries(V1)) {
  test(`import v1 (${mode}): przywraca wyłączone strony i własne filtry; listy/tryb/Focus Mode ignorowane; ochrona zostaje ads/privacy/security`, async () => {
    const bg = await loadBackground();
    try {
      await bg.install();
      const r = await bg.send({ type: 'settings:import', text: backupV1(lists, mode, { youtubeFocus: { enabled: true } }) });
      assert.equal(r.ok, true, JSON.stringify(r.errors));
      assert.deepEqual(sorted(r.ignored), ['settings.enabledLists', 'settings.protectionMode', 'settings.youtubeFocus']);
      assert.deepEqual(bg.store.disabledSites, ['bank.example', 'shop.example']);
      assert.equal(bg.store.userFilters, FILTERS);
      assert.deepEqual(sorted(bg.state.enabledRulesets), CORE, 'rulesety');
      assert.deepEqual(await enabledNow(bg), CORE);
      assert.ok(!bg.state.registered.some((x) => /^sl-(cookies|annoyances)-/.test(x.id)));
      for (const k of ['enabledLists', 'protectionMode', 'youtubeFocus']) assert.ok(!(k in bg.store), `storage: ${k}`);
    } finally { bg.restore(); }
  });
}

test('import v1: stare pola nie są walidowane (np. nieznane listy, zły tryb) – nie blokują przywrócenia danych', () => {
  for (const [lists, mode] of [[['cookies', 'nieistniejaca'], 'turbo'], ['ads', 42], [[], undefined]]) {
    const r = parseBackup(backupV1(lists, mode, { youtubeFocus: [] }));
    assert.equal(r.ok, true, JSON.stringify(r.errors));
    assert.equal(r.version, 1);
    assert.deepEqual(Object.keys(r.settings).sort(), ['disabledSites', 'userFilters']);
  }
  assert.deepEqual([...SUPPORTED_BACKUP_VERSIONS], [1, 2]);
  assert.deepEqual([...LEGACY_BACKUP_KEYS], ['enabledLists', 'protectionMode', 'youtubeFocus']);
});

// --- walidacja -------------------------------------------------------------------

test('uszkodzony JSON: nic nie jest zapisywane', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const before = structuredClone(bg.store);
    for (const text of ['{"format": "chromeblock-settings", ', '', 'null', '[]', '"tekst"', undefined]) {
      const r = await bg.send({ type: 'settings:import', text });
      assert.equal(r.ok, false, String(text));
      assert.ok(r.errors.length);
    }
    assert.deepEqual(bg.store, before);
  } finally { bg.restore(); }
});

test('zły format / wersja / brak pól / złe typy: odrzucone w całości, z listą błędów', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const before = structuredClone(bg.store);
    const cases = [
      [JSON.stringify({ format: 'ublock-backup', version: 2, settings: {} }), /nieznany format/],
      [backupText({}, { version: 3 }), /nieobsługiwana wersja/],
      [backupText({}, { version: '2' }), /nieobsługiwana wersja/],
      [JSON.stringify({ format: BACKUP_FORMAT, version: 2 }), /brak sekcji „settings”/],
      [JSON.stringify({ format: BACKUP_FORMAT, version: 2, settings: { userFilters: '' } }), /brak pola settings\.disabledSites/],
      [JSON.stringify({ format: BACKUP_FORMAT, version: 1, settings: { enabledLists: ['ads'], protectionMode: 'basic' } }), /brak pola settings\.disabledSites/],
      [backupText({ disabledSites: ['https://bank.example/konto?id=1'] }), /niepoprawne domeny/],
      [backupText({ disabledSites: 'bank.example' }), /disabledSites musi być listą/],
      [backupText({ userFilters: 42 }), /userFilters musi być tekstem/],
    ];
    for (const [text, re] of cases) {
      const r = await bg.send({ type: 'settings:import', text });
      assert.equal(r.ok, false, text.slice(0, 80));
      assert.ok(r.errors.some((e) => re.test(e)), `${re}: ${r.errors.join(' | ')}`);
    }
    // błąd w jednym polu blokuje całość
    const mixed = await bg.send({ type: 'settings:import', text: backupText({ disabledSites: ['ok.example', 'zła domena'], userFilters: 1 }) });
    assert.equal(mixed.ok, false);
    assert.equal(mixed.errors.length, 2, 'wszystkie błędy naraz');
    assert.deepEqual(bg.store, before, 'nic nie zapisano');
  } finally { bg.restore(); }
});

test('nieznane pola: ignorowane, nie trafiają do storage', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const keysBefore = Object.keys(bg.store);
    const r = await bg.send({ type: 'settings:import', text: backupText({ stats: { total: 999 }, health: { x: 1 }, devPerf: true }, { comment: 'z innego komputera', storage: { evil: 1 } }) });
    assert.equal(r.ok, true, JSON.stringify(r.errors));
    assert.deepEqual(sorted(r.ignored), sorted(['comment', 'storage', 'settings.stats', 'settings.health', 'settings.devPerf']));
    const added = Object.keys(bg.store).filter((k) => !keysBefore.includes(k));
    for (const k of added) assert.ok(['disabledSites', 'userFilters'].includes(k), `nowy klucz w storage: ${k}`);
    for (const k of ['stats', 'comment', 'storage', 'evil']) assert.ok(!(k in bg.store), `z pliku do storage trafiło: ${k}`);
    assert.notDeepEqual(bg.store.health, { x: 1 });
    assert.notEqual(bg.store.devPerf, true);
  } finally { bg.restore(); }
});

// --- martwe dane po starszych wersjach -----------------------------------------------

test('aktualizacja usuwa martwe klucze (Focus Mode, listy, tryb); świeża instalacja i zwykła praca ich nie tworzą', async () => {
  const bg = await loadBackground({ local: { youtubeFocus: { enabled: true }, enabledLists: ['ads'], protectionMode: 'custom', userFilters: '||zostaje.example^\n' } });
  try {
    await bg.install(); // mock: onInstalled bez szczegółów (nie „update”) – nic nie usuwa
    assert.ok('youtubeFocus' in bg.store && 'enabledLists' in bg.store);
    await bg.state.listeners.installed({ reason: 'update' });
    for (const k of ['youtubeFocus', 'enabledLists', 'protectionMode']) assert.ok(!(k in bg.store), k);
    assert.equal(bg.store.userFilters, '||zostaje.example^\n', 'pozostałe ustawienia bez zmian');
    assert.deepEqual([...bg.mod.LEGACY_STORAGE_KEYS], ['youtubeFocus', 'enabledLists', 'protectionMode']);
  } finally { bg.restore(); }
  const fresh = await loadBackground();
  try {
    await fresh.install();
    await fresh.send({ type: 'options:get' });
    await fresh.send({ type: 'settings:export' });
    await fresh.send({ type: 'settings:import', text: backupV1(['ads', 'cookies'], 'custom', { youtubeFocus: { enabled: true } }) });
    for (const k of ['youtubeFocus', 'enabledLists', 'protectionMode']) assert.ok(!(k in fresh.store), k);
  } finally { fresh.restore(); }
});

// --- czysta logika i UI ------------------------------------------------------------

test('czysta logika: nazwa pliku, podsumowanie, odmiana, limit rozmiaru', () => {
  assert.equal(backupFileName(new Date(2026, 0, 5)), 'chromeblock-ustawienia-2026-01-05.json');
  assert.deepEqual([1, 2, 4, 5, 12, 22, 25].map(rulesWord), ['reguła', 'reguły', 'reguły', 'reguł', 'reguł', 'reguły', 'reguł']);
  assert.deepEqual(summarizeSettings({ disabledSites: [], userFilters: '' }), ['Wyłączone strony: 0', 'Moje filtry: 0 reguł']);
  assert.match(parseBackup('x'.repeat(2 * 1024 * 1024 + 1)).errors[0], /za duży/);
  assert.deepEqual(validateBackup(JSON.parse(backupText())).settings, { disabledSites: ['bank.example', 'shop.example'], userFilters: FILTERS });
});

test('opcje: sekcja „Kopia ustawień” (w „Więcej”) z przyciskami eksportu i importu; opis bez list i trybu', () => {
  const html = fs.readFileSync(path.join(ROOT, 'options/options.html'), 'utf8');
  assert.match(html, /<details id="backup" class="more-section">\s*<summary><h2>Kopia ustawień<\/h2><\/summary>/);
  const sec = html.slice(html.indexOf('id="backup"'), html.indexOf('id="diag"'));
  assert.match(sec, /<h2[^>]*>Kopia ustawień<\/h2>/);
  assert.match(sec, /id="exportSettings"[^>]*>Eksportuj ustawienia</);
  assert.match(sec, /id="importSettings"[^>]*>Importuj ustawienia</);
  assert.match(sec, /type="file" id="importFile"/);
  assert.match(sec, /id="importSummary"/);
  assert.match(sec, /wyłączone strony \(same nazwy domen\) i Moje filtry/);
  assert.doesNotMatch(sec, /tryb ochrony|włączone listy/i);
  const js = fs.readFileSync(path.join(ROOT, 'options/options.js'), 'utf8');
  assert.match(js, /settings:export/);
  assert.match(js, /settings:import/);
  assert.doesNotMatch(js.slice(js.indexOf('// --- Kopia ustawień')), /fetch\(|sendBeacon|XMLHttpRequest/, 'nic nie jest wysyłane');
});

// --- wiarygodność rollbacku ----------------------------------------------------------

/** Stan przed importem: stały zestaw, 1 własny filtr, bez wyłączonych stron. */
async function prepared(opts) {
  const bg = await loadBackground(opts);
  await bg.install();
  await bg.send({ type: 'options:setUserFilters', text: '||stare.example^\n' });
  return { bg, before: { filters: bg.store.userFilters, sites: [...(bg.store.disabledSites || [])] } };
}
const healthErrors = async (bg) => ((await bg.send({ type: 'health:get' })).errors || []).filter((e) => /import ustawień/.test(e.message));
const once = () => { let n = 0; return () => n++ === 0; };

test('rollback: jednorazowy błąd reguł dynamicznych przy imporcie → poprzednie ustawienia przywrócone (rolledBack=true)', async () => {
  const opts = {};
  const { bg, before } = await prepared(opts);
  try {
    opts.failDynamic = once();
    const r = await bg.send({ type: 'settings:import', text: backupText() });
    opts.failDynamic = false;
    assert.equal(r.ok, false);
    assert.equal(r.rolledBack, true, JSON.stringify(r.rollbackErrors));
    assert.equal(r.rollbackErrors, undefined);
    assert.ok(r.errors.some((e) => /moje filtry \/ wyłączone strony/.test(e)));
    assert.equal(bg.store.userFilters, before.filters);
    assert.deepEqual(bg.store.disabledSites || [], before.sites);
    assert.deepEqual(sorted(bg.state.enabledRulesets), CORE);
    assert.deepEqual(await healthErrors(bg), [], 'pełny rollback – bez wpisu o niepełnym przywróceniu');
  } finally { bg.restore(); }
});

test('rollback: błąd rejestracji scriptletów przy imporcie → poprzednie ustawienia przywrócone', async () => {
  const opts = { failRegister: () => false };
  const { bg, before } = await prepared(opts);
  try {
    // Chrome odrzuca tylko rejestracje ze stanu po imporcie (z wyłączoną stroną bank.example)
    opts.failRegister = (id, s) => (s.excludeMatches || []).some((m) => m.includes('bank.example'));
    const r = await bg.send({ type: 'settings:import', text: backupText() });
    opts.failRegister = () => false;
    assert.equal(r.ok, false);
    assert.equal(r.rolledBack, true, JSON.stringify(r.rollbackErrors));
    assert.ok(r.errors.some((e) => /scriptlety/.test(e)));
    assert.equal(bg.store.userFilters, before.filters);
    assert.deepEqual(bg.store.disabledSites || [], before.sites);
  } finally { bg.restore(); }
});

test('rollback niepełny: synchronizacja list (rulesets) poprzedniego stanu nie powiodła się → rolledBack=false + rollbackErrors + dziennik błędów', async () => {
  const opts = {};
  const { bg } = await prepared(opts);
  try {
    opts.failRulesets = true; // Chrome odrzuca zmiany zestawów reguł – także przy przywracaniu
    const r = await bg.send({ type: 'settings:import', text: backupText() });
    opts.failRulesets = false;
    assert.equal(r.ok, false);
    assert.equal(r.rolledBack, false);
    assert.ok(r.rollbackErrors.some((e) => /synchronizacja \(listy filtrów\)/.test(e)), r.rollbackErrors.join(' | '));
    const logged = await healthErrors(bg);
    assert.equal(logged.length, 1);
    assert.equal(logged[0].component, 'filters');
    assert.match(logged[0].message, /przywrócenie poprzedniego stanu jest niepełne/);
  } finally { bg.restore(); }
});

test('rollback niepełny: synchronizacja reguł dynamicznych poprzedniego stanu nie powiodła się', async () => {
  const opts = { failRegister: () => false };
  const { bg } = await prepared(opts);
  try {
    // import: scriptlety się nie rejestrują; od tej chwili Chrome odrzuca reguły dynamiczne (przywracanie)
    opts.failRegister = () => { opts.failDynamic = true; return true; };
    const r = await bg.send({ type: 'settings:import', text: backupText() });
    opts.failDynamic = false;
    opts.failRegister = () => false;
    assert.equal(r.ok, false);
    assert.equal(r.rolledBack, false);
    assert.ok(r.rollbackErrors.some((e) => /synchronizacja \(moje filtry \/ wyłączone strony\)/.test(e)), r.rollbackErrors.join(' | '));
    assert.equal((await healthErrors(bg)).length, 1);
  } finally { bg.restore(); }
});

test('rollback niepełny: rejestracja scriptletów poprzedniego stanu nie powiodła się', async () => {
  const opts = { failRegister: () => false };
  const { bg } = await prepared(opts);
  try {
    // import: reguły dynamiczne odrzucone raz; od tej chwili Chrome odrzuca każdą rejestrację scriptletów
    opts.failDynamic = () => { opts.failDynamic = false; opts.failRegister = () => true; return true; };
    const r = await bg.send({ type: 'settings:import', text: backupText() });
    opts.failRegister = () => false;
    assert.equal(r.ok, false);
    assert.equal(r.rolledBack, false);
    assert.ok(r.rollbackErrors.some((e) => /synchronizacja \(scriptlety\)/.test(e)), r.rollbackErrors.join(' | '));
    assert.ok(!r.rollbackErrors.some((e) => /listy filtrów|moje filtry/.test(e)), 'pozostałe kroki przywracania OK');
    assert.equal((await healthErrors(bg)).length, 1);
  } finally { bg.restore(); }
});

test('komunikat UI: „przywrócono” tylko przy rolledBack=true; niepełny rollback → wyraźne ostrzeżenie + Diagnostyka', () => {
  const ok = importFailureMessage({ ok: false, rolledBack: true, errors: ['listy filtrów: x'] });
  assert.equal(ok.title, IMPORT_MSG.rolledBack);
  assert.equal(ok.diagnostics, false);
  const bad = importFailureMessage({ ok: false, rolledBack: false, errors: ['scriptlety: x'], rollbackErrors: ['synchronizacja (listy filtrów): y'] });
  assert.equal(bad.title, 'Import nie powiódł się i nie udało się w pełni przywrócić poprzedniego stanu. Otwórz Diagnostykę.');
  assert.doesNotMatch(bad.title, /przywrócono poprzednie/);
  assert.deepEqual(bad.items, ['scriptlety: x', 'przywracanie: synchronizacja (listy filtrów): y']);
  assert.equal(bad.diagnostics, true);
  assert.equal(importFailureMessage({ ok: false, errors: ['plik nie jest poprawnym JSON'] }).title, IMPORT_MSG.invalid);
  assert.equal(importFailureMessage({ ok: false, rollbackErrors: ['z'] }).title, IMPORT_MSG.incomplete);
});
