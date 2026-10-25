// Kopia ustawień (eksport / import): format, prywatność, pełna walidacja, atomowość z rollbackiem.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BACKUP_FORMAT, BACKUP_VERSION, BACKUP_SETTINGS_KEYS, buildBackup, backupFileName, parseBackup, validateBackup, summarizeSettings, rulesWord,
} from '../../shared/settings-backup.js';
import { FOCUS_DEFAULTS, focusCss } from '../../shared/youtube-focus.js';
import { loadBackground, sender } from '../helpers/chrome-mock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const LISTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/lists.json'), 'utf8'));
const KNOWN = (Array.isArray(LISTS) ? LISTS : LISTS.lists).map((l) => l.id);
const sorted = (a) => [...a].sort();
const FOCUS_ON = { enabled: true, shorts: true, recommendations: false, comments: true, endscreen: true };

function backupText(settings, extra = {}) {
  return JSON.stringify({
    format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: '2026-10-25T12:00:00.000Z', extensionVersion: '0.3.2-dev',
    settings: {
      enabledLists: ['ads', 'privacy', 'security', 'cookies'],
      disabledSites: ['bank.example', 'www.shop.example'],
      userFilters: '! moje\n||ads.example^\nexample.com##.reklama\n',
      protectionMode: 'balanced',
      youtubeFocus: FOCUS_ON,
      ...settings,
    },
    ...extra,
  });
}

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

test('eksport: format wersjonowany, tylko 5 ustawień użytkownika, wartości z bieżącego stanu', async () => {
  const bg = await loadBackground({ local: { ...TECH, youtubeFocus: FOCUS_ON } });
  try {
    await bg.install();
    await bg.send({ type: 'options:setDisabledSites', sites: ['bank.example', 'www.Shop.example'] });
    await bg.send({ type: 'options:setUserFilters', text: '||ads.example^\n' });
    const r = await bg.send({ type: 'settings:export' });
    assert.equal(r.ok, true);
    assert.match(r.fileName, /^chromeblock-ustawienia-\d{4}-\d{2}-\d{2}\.json$/);
    const b = r.backup;
    assert.equal(b.format, 'chromeblock-settings');
    assert.equal(b.version, 1);
    assert.deepEqual(Object.keys(b).sort(), ['exportedAt', 'extensionVersion', 'format', 'settings', 'version']);
    assert.deepEqual(Object.keys(b.settings).sort(), [...BACKUP_SETTINGS_KEYS].sort());
    assert.deepEqual(sorted(b.settings.enabledLists), ['ads', 'privacy', 'security']);
    assert.equal(b.settings.protectionMode, 'basic');
    assert.deepEqual(b.settings.disabledSites, ['bank.example', 'shop.example']);
    assert.equal(b.settings.userFilters, '||ads.example^\n');
    assert.deepEqual(b.settings.youtubeFocus, FOCUS_ON);
    // eksport → import tego samego pliku przechodzi walidację
    assert.equal(parseBackup(JSON.stringify(b), { knownLists: KNOWN }).ok, true);
  } finally { bg.restore(); }
});

test('eksport: brak danych technicznych i prywatnych (health, diagnostyka, cache, sesja, statystyki, karty, URL)', async () => {
  const bg = await loadBackground({ local: { ...TECH } });
  try {
    await bg.install();
    await bg.send({ type: 'youtubeFocus:css' }, sender('https://www.youtube.com/watch?v=SECRETVID01'));
    bg.session.statsTabs = { 7: [{ host: 'news.example', since: 1 }] };
    const text = JSON.stringify((await bg.send({ type: 'settings:export' })).backup);
    for (const bad of ['health', 'startupProfile', 'devPerf', 'scriptletPerf', 'stats', 'hostCache', 'statsTabs', 'sessionScriptletsOk', 'tabId', 'SECRETVID01', 'token', 'https://', 'http://', 'news.example']) {
      assert.ok(!text.includes(bad), `kopia zawiera „${bad}”`);
    }
  } finally { bg.restore(); }
  // tylko dozwolone pola nawet z „brudnych” danych wejściowych
  const b = buildBackup({ enabledLists: ['ads'], disabledSites: [], userFilters: '', protectionMode: 'custom', youtubeFocus: { ...FOCUS_DEFAULTS, evil: 'x' }, stats: 1, health: 2 });
  assert.deepEqual(Object.keys(b.settings).sort(), [...BACKUP_SETTINGS_KEYS].sort());
  assert.deepEqual(Object.keys(b.settings.youtubeFocus).sort(), Object.keys(FOCUS_DEFAULTS).sort());
});

// --- import ------------------------------------------------------------------------

test('import poprawny: zapis, synchronizacja list / filtrów / scriptletów, Focus Mode, podsumowanie', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const r = await bg.send({ type: 'settings:import', text: backupText({}) });
    assert.equal(r.ok, true, JSON.stringify(r.errors));
    assert.deepEqual(sorted(bg.store.enabledLists), ['ads', 'cookies', 'privacy', 'security']);
    assert.deepEqual(sorted(bg.state.enabledRulesets), ['ads', 'cookies', 'privacy', 'security'], 'Chrome: zestawy reguł zsynchronizowane');
    assert.deepEqual(bg.store.disabledSites, ['bank.example', 'shop.example']);
    assert.equal(bg.store.userFilters, '! moje\n||ads.example^\nexample.com##.reklama\n');
    assert.ok(bg.state.dynamic.length > 0, 'reguły dynamiczne (moje filtry / wyłączone strony) zsynchronizowane');
    assert.ok(bg.state.registered.some((x) => x.id.startsWith('sl-cookies')), 'scriptlety nowej listy zarejestrowane');
    assert.deepEqual(bg.store.youtubeFocus, FOCUS_ON);
    const o = await bg.send({ type: 'options:get' });
    assert.equal(o.protectionMode, 'balanced');
    assert.deepEqual(o.youtubeFocus, FOCUS_ON);
    assert.ok(r.summary.some((l) => /Tryb ochrony: Balanced/.test(l)));
    assert.ok(r.summary.some((l) => /Wyłączone strony: 2/.test(l)));
    assert.ok(r.summary.some((l) => /Moje filtry: 2 reguły/.test(l)));
    assert.ok(r.summary.some((l) => /Focus Mode: włączony \(opcje włączone: 3\/4\)/.test(l)));
  } finally { bg.restore(); }
});

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
      [JSON.stringify({ format: 'ublock-backup', version: 1, settings: {} }), /nieznany format/],
      [backupText({}, { version: 2 }), /nieobsługiwana wersja/],
      [backupText({}, { version: '1' }), /nieobsługiwana wersja/],
      [JSON.stringify({ format: BACKUP_FORMAT, version: 1 }), /brak sekcji „settings”/],
      [JSON.stringify({ format: BACKUP_FORMAT, version: 1, settings: { enabledLists: ['ads'] } }), /brak pola settings\.disabledSites/],
      [backupText({ enabledLists: ['ads', 'nieistniejaca'] }), /nieznane listy filtrów: nieistniejaca/],
      [backupText({ enabledLists: ['ads', 'ads'] }), /powtórzenia/],
      [backupText({ enabledLists: 'ads' }), /enabledLists musi być listą/],
      [backupText({ disabledSites: ['https://bank.example/konto?id=1'] }), /niepoprawne domeny/],
      [backupText({ userFilters: 42 }), /userFilters musi być tekstem/],
      [backupText({ protectionMode: 'turbo' }), /nieznany tryb ochrony/],
      [backupText({ youtubeFocus: { enabled: 'tak' } }), /youtubeFocus\.enabled musi być true\/false/],
      [backupText({ youtubeFocus: [] }), /youtubeFocus musi być obiektem/],
    ];
    for (const [text, re] of cases) {
      const r = await bg.send({ type: 'settings:import', text });
      assert.equal(r.ok, false, text.slice(0, 80));
      assert.ok(r.errors.some((e) => re.test(e)), `${re}: ${r.errors.join(' | ')}`);
    }
    // błąd w jednym polu blokuje całość, mimo poprawnych pozostałych
    const mixed = await bg.send({ type: 'settings:import', text: backupText({ disabledSites: ['ok.example', 'zła domena'], youtubeFocus: { enabled: 1 } }) });
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
    const text = backupText(
      { stats: { total: 999 }, health: { x: 1 }, devPerf: true, youtubeFocus: { ...FOCUS_ON, autoplay: false } },
      { comment: 'z innego komputera', storage: { evil: 1 } },
    );
    const r = await bg.send({ type: 'settings:import', text });
    assert.equal(r.ok, true, JSON.stringify(r.errors));
    assert.deepEqual(sorted(r.ignored), sorted(['comment', 'storage', 'settings.stats', 'settings.health', 'settings.devPerf', 'settings.youtubeFocus.autoplay']));
    const added = Object.keys(bg.store).filter((k) => !keysBefore.includes(k));
    for (const k of added) assert.ok(['enabledLists', 'disabledSites', 'userFilters', 'protectionMode', 'youtubeFocus'].includes(k), `nowy klucz w storage: ${k}`);
    for (const k of ['stats', 'comment', 'storage', 'evil']) assert.ok(!(k in bg.store), `z pliku do storage trafiło: ${k}`);
    assert.notDeepEqual(bg.store.health, { x: 1 }, 'health z pliku nie nadpisał stanu rozszerzenia');
    assert.notEqual(bg.store.devPerf, true, 'devPerf z pliku zignorowany');
    assert.ok(!('autoplay' in bg.store.youtubeFocus));
  } finally { bg.restore(); }
});

test('rollback: błąd synchronizacji list → poprzednie ustawienia przywrócone (także Focus Mode)', async () => {
  const opts = { local: { youtubeFocus: { ...FOCUS_DEFAULTS } } };
  const bg = await loadBackground(opts);
  try {
    await bg.install();
    await bg.send({ type: 'options:setUserFilters', text: '||stare.example^\n' });
    const enabledNow = async () => sorted((await bg.send({ type: 'options:get' })).lists.filter((l) => l.enabled).map((l) => l.id));
    const before = { lists: await enabledNow(), sites: bg.store.disabledSites ? [...bg.store.disabledSites] : [], filters: bg.store.userFilters, focus: structuredClone(bg.store.youtubeFocus) };
    const rulesetsBefore = sorted(bg.state.enabledRulesets);
    opts.failRulesets = true;
    const r = await bg.send({ type: 'settings:import', text: backupText({}) });
    opts.failRulesets = false;
    assert.equal(r.ok, false);
    assert.equal(r.rolledBack, true);
    assert.ok(r.errors.some((e) => /listy filtrów/.test(e)));
    assert.deepEqual(await enabledNow(), before.lists);
    assert.deepEqual(bg.store.disabledSites || [], before.sites);
    assert.equal(bg.store.userFilters, before.filters);
    assert.deepEqual(bg.store.youtubeFocus, before.focus);
    assert.deepEqual(sorted(bg.state.enabledRulesets), rulesetsBefore);
    assert.equal((await bg.send({ type: 'options:get' })).protectionMode, 'basic');
  } finally { bg.restore(); }
});

test('rollback: błąd rejestracji scriptletów → poprzednie ustawienia; brak Focus Mode w storage przed importem → usunięty', async () => {
  const opts = { failRegister: () => false };
  const bg = await loadBackground(opts);
  try {
    await bg.install();
    assert.ok(!('youtubeFocus' in bg.store));
    const listsBefore = sorted(bg.store.enabledLists || ['ads', 'privacy', 'security']);
    opts.failRegister = (id) => id.startsWith('sl-cookies');
    const r = await bg.send({ type: 'settings:import', text: backupText({}) });
    opts.failRegister = () => false;
    assert.equal(r.ok, false);
    assert.equal(r.rolledBack, true);
    assert.ok(r.errors.some((e) => /scriptlety/.test(e)));
    assert.deepEqual(sorted(bg.store.enabledLists), listsBefore);
    assert.ok(!('youtubeFocus' in bg.store), 'Focus Mode jak przed importem (brak zapisu)');
    assert.equal(bg.store.userFilters || '', '');
  } finally { bg.restore(); }
});

test('protectionMode przeliczany z faktycznie włączonych list (wartość z pliku nie decyduje)', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    let r = await bg.send({ type: 'settings:import', text: backupText({ enabledLists: ['ads', 'privacy', 'security'], protectionMode: 'strict' }) });
    assert.equal(r.ok, true);
    assert.equal(bg.store.protectionMode, 'basic');
    assert.equal((await bg.send({ type: 'options:get' })).protectionMode, 'basic');
    r = await bg.send({ type: 'settings:import', text: backupText({ enabledLists: ['ads', 'security'], protectionMode: 'balanced' }) });
    assert.equal(r.ok, true);
    assert.equal(bg.store.protectionMode, 'custom');
    assert.ok(r.summary.some((l) => /Tryb ochrony: Własny/.test(l)));
    r = await bg.send({ type: 'settings:import', text: backupText({ enabledLists: ['ads', 'privacy', 'security', 'cookies', 'annoyances'], protectionMode: 'basic' }) });
    assert.equal(bg.store.protectionMode, 'strict');
  } finally { bg.restore(); }
});

test('Focus Mode przywrócony: zapis + CSS dla kart YouTube (otwarte karty odświeżają się przez storage.onChanged)', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    assert.equal((await bg.send({ type: 'youtubeFocus:css' }, sender('https://www.youtube.com/'))).css, '');
    const r = await bg.send({ type: 'settings:import', text: backupText({ youtubeFocus: FOCUS_ON }) });
    assert.equal(r.ok, true);
    assert.deepEqual(bg.store.youtubeFocus, FOCUS_ON);
    assert.equal((await bg.send({ type: 'youtubeFocus:css' }, sender('https://www.youtube.com/'))).css, focusCss(FOCUS_ON));
    // brak klucza w pliku → wartość domyślna
    const r2 = await bg.send({ type: 'settings:import', text: backupText({ youtubeFocus: { enabled: true } }) });
    assert.equal(r2.ok, true);
    assert.deepEqual(bg.store.youtubeFocus, { ...FOCUS_DEFAULTS, enabled: true });
    const src = fs.readFileSync(path.join(ROOT, 'youtube/focus.js'), 'utf8');
    assert.match(src, /changes\.youtubeFocus/);
  } finally { bg.restore(); }
});

// --- czysta logika i UI ------------------------------------------------------------

test('czysta logika: nazwa pliku, podsumowanie, odmiana, limit rozmiaru', () => {
  assert.equal(backupFileName(new Date(2026, 0, 5)), 'chromeblock-ustawienia-2026-01-05.json');
  assert.deepEqual([1, 2, 4, 5, 12, 22, 25].map(rulesWord), ['reguła', 'reguły', 'reguły', 'reguł', 'reguł', 'reguły', 'reguł']);
  const sum = summarizeSettings({ enabledLists: ['ads'], disabledSites: [], userFilters: '', protectionMode: 'custom', youtubeFocus: FOCUS_DEFAULTS }, { listNames: { ads: 'Reklamy' } });
  assert.deepEqual(sum, ['Tryb ochrony: Własny', 'Listy filtrów (1): Reklamy', 'Wyłączone strony: 0', 'Moje filtry: 0 reguł', 'Focus Mode: wyłączony (opcje włączone: 4/4)']);
  assert.match(parseBackup('x'.repeat(2 * 1024 * 1024 + 1), { knownLists: KNOWN }).errors[0], /za duży/);
  assert.equal(validateBackup(JSON.parse(backupText({})), { knownLists: KNOWN }).settings.protectionMode, 'balanced');
});

test('opcje: zakładka „Kopia ustawień” z przyciskami eksportu i importu', () => {
  const html = fs.readFileSync(path.join(ROOT, 'options/options.html'), 'utf8');
  assert.match(html, /data-tab="backup">Kopia ustawień</);
  const sec = html.slice(html.indexOf('id="backup"'), html.indexOf('id="diag"'));
  assert.match(sec, /<h2[^>]*>Kopia ustawień<\/h2>/);
  assert.match(sec, /id="exportSettings"[^>]*>Eksportuj ustawienia</);
  assert.match(sec, /id="importSettings"[^>]*>Importuj ustawienia</);
  assert.match(sec, /type="file" id="importFile"/);
  assert.match(sec, /id="importSummary"/);
  const js = fs.readFileSync(path.join(ROOT, 'options/options.js'), 'utf8');
  assert.match(js, /settings:export/);
  assert.match(js, /settings:import/);
  assert.doesNotMatch(js.slice(js.indexOf('// --- Kopia ustawień')), /fetch\(|sendBeacon|XMLHttpRequest/, 'nic nie jest wysyłane');
});
