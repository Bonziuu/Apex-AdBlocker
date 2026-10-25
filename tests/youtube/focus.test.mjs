// YouTube Focus Mode (fundament v0.3): model ustawień, storage, generowanie reguł kosmetycznych.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FOCUS_STORAGE_KEY, FOCUS_OPTIONS, FOCUS_DEFAULTS, FOCUS_LABELS, FOCUS_SELECTORS,
  normalizeFocus, activeFocusOptions, focusSelectors, focusCss, focusCosmeticFilters,
} from '../../shared/youtube-focus.js';
import { loadBackground, sender } from '../helpers/chrome-mock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ALL_ON = { enabled: true, shorts: true, recommendations: true, comments: true, endscreen: true };

// --- model -------------------------------------------------------------------

test('domyślnie: Focus Mode OFF, cztery opcje ON, nic nie jest ukrywane', () => {
  assert.deepEqual({ ...FOCUS_DEFAULTS }, { enabled: false, shorts: true, recommendations: true, comments: true, endscreen: true });
  assert.deepEqual(FOCUS_OPTIONS, ['shorts', 'recommendations', 'comments', 'endscreen']);
  assert.deepEqual(normalizeFocus(undefined), { ...FOCUS_DEFAULTS });
  assert.deepEqual(activeFocusOptions(undefined), []);
  assert.equal(focusCss(undefined), '');
  assert.equal(focusCss(FOCUS_DEFAULTS), '', 'opcje ON, ale master OFF → brak CSS');
  assert.deepEqual(focusCosmeticFilters(FOCUS_DEFAULTS), []);
});

test('etykiety w opcjach', () => {
  assert.equal(FOCUS_LABELS.enabled, 'Włącz Focus Mode');
  assert.equal(FOCUS_LABELS.shorts, 'Ukryj Shorts');
  assert.equal(FOCUS_LABELS.recommendations, 'Ukryj rekomendacje');
  assert.equal(FOCUS_LABELS.comments, 'Ukryj komentarze');
  assert.equal(FOCUS_LABELS.endscreen, 'Ukryj sugestie na końcu filmu');
});

test('normalizacja: zły typ / brak klucza → domyślne; nieznane klucze pomijane', () => {
  assert.deepEqual(normalizeFocus({ enabled: 'tak', shorts: 0, comments: false, evil: true }),
    { enabled: false, shorts: true, recommendations: true, comments: false, endscreen: true });
  assert.deepEqual(normalizeFocus([true]), { ...FOCUS_DEFAULTS });
  assert.deepEqual(normalizeFocus(null), { ...FOCUS_DEFAULTS });
  assert.ok(!('evil' in normalizeFocus({ evil: true })));
});

// --- reguły kosmetyczne ------------------------------------------------------

test('reguły: każda opcja dodaje tylko swoje selektory; jedna reguła CSS na selektor', () => {
  for (const k of FOCUS_OPTIONS) {
    const only = { enabled: true, shorts: false, recommendations: false, comments: false, endscreen: false, [k]: true };
    assert.deepEqual(activeFocusOptions(only), [k]);
    assert.deepEqual(focusSelectors(only), [...FOCUS_SELECTORS[k]]);
    const css = focusCss(only);
    const rules = css.split('\n').filter((l) => l.includes('{'));
    assert.equal(rules.length, FOCUS_SELECTORS[k].length, k);
    for (const r of rules) assert.match(r, /^[^{}]+ \{ display: none !important; \}$/, r);
  }
  const all = focusCss(ALL_ON);
  for (const k of FOCUS_OPTIONS) for (const sel of FOCUS_SELECTORS[k]) assert.ok(all.includes(`${sel} { display: none !important; }`), sel);
  assert.equal(focusCss({ ...ALL_ON, shorts: false, recommendations: false, comments: false, endscreen: false }), '', 'master ON, wszystkie opcje OFF → brak CSS');
});

test('reguły w składni filtrów kosmetycznych ChromeBlock (tylko www.youtube.com)', () => {
  const f = focusCosmeticFilters({ ...ALL_ON, recommendations: false, comments: false, endscreen: false });
  assert.equal(f.length, FOCUS_SELECTORS.shorts.length);
  for (const line of f) assert.match(line, /^www\.youtube\.com##\S/);
});

test('reguły nie ukrywają odtwarzacza ani odtwarzacza Shorts', () => {
  const sels = focusSelectors(ALL_ON);
  for (const sel of sels) {
    assert.doesNotMatch(sel, /(^|[\s>,])(video|#movie_player|ytd-player|#shorts-player|ytd-reel-video-renderer|ytd-shorts)(\b|$)/, sel);
    assert.doesNotMatch(sel, /[{};]/, `selektor bez wstrzyknięć CSS: ${sel}`);
  }
  // rekomendacje: tylko #related, nie cały #secondary (lista odtwarzania i czat zostają)
  assert.ok(!FOCUS_SELECTORS.recommendations.some((s) => /#secondary\b/.test(s)));
  // sugestie końcowe tylko wewnątrz odtwarzacza
  for (const s of FOCUS_SELECTORS.endscreen) assert.match(s, /^\.html5-video-player /);
});

// --- tło: storage i wiadomości -----------------------------------------------

const yt = () => sender('https://www.youtube.com/watch?v=abc');

test('tło: options:get zwraca domyślny Focus Mode; brak CSS na YouTube', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const o = await bg.send({ type: 'options:get' });
    assert.deepEqual(o.youtubeFocus, { ...FOCUS_DEFAULTS });
    const r = await bg.send({ type: 'youtubeFocus:css' }, yt());
    assert.equal(r.css, '');
    assert.deepEqual(r.active, []);
    assert.equal(bg.store[FOCUS_STORAGE_KEY], undefined, 'nic nie zapisano bez zmiany ustawień');
  } finally { bg.restore(); }
});

test('tło: zapis lokalny (chrome.storage.local), częściowa zmiana, złe wartości ignorowane', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    let r = await bg.send({ type: 'options:setYouTubeFocus', settings: { enabled: true } });
    assert.equal(r.ok, true);
    assert.deepEqual(r.youtubeFocus, { ...FOCUS_DEFAULTS, enabled: true });
    assert.deepEqual(bg.store[FOCUS_STORAGE_KEY], { ...FOCUS_DEFAULTS, enabled: true });
    r = await bg.send({ type: 'options:setYouTubeFocus', settings: { comments: false, shorts: 'nie', evil: true } });
    assert.deepEqual(r.youtubeFocus, { ...FOCUS_DEFAULTS, enabled: true, comments: false });
    assert.deepEqual(bg.store[FOCUS_STORAGE_KEY], { ...FOCUS_DEFAULTS, enabled: true, comments: false });
    assert.deepEqual((await bg.send({ type: 'options:get' })).youtubeFocus, { ...FOCUS_DEFAULTS, enabled: true, comments: false });
    assert.equal((await bg.send({ type: 'options:setYouTubeFocus' })).ok, false);
    assert.equal((await bg.send({ type: 'options:setYouTubeFocus', settings: 'x' })).ok, false);
  } finally { bg.restore(); }
});

test('tło: ustawienia przetrwają restart (odczyt z zapisanego storage)', async () => {
  const bg = await loadBackground({ local: { [FOCUS_STORAGE_KEY]: { enabled: true, shorts: false, recommendations: true, comments: true, endscreen: false } } });
  try {
    const r = await bg.send({ type: 'youtubeFocus:css' }, yt());
    assert.deepEqual(r.active, ['recommendations', 'comments']);
    assert.equal(r.css, focusCss({ enabled: true, shorts: false, recommendations: true, comments: true, endscreen: false }));
  } finally { bg.restore(); }
});

test('tło: CSS tylko dla kart YouTube i tylko gdy ochrona strony jest włączona', async () => {
  const bg = await loadBackground({ local: { [FOCUS_STORAGE_KEY]: ALL_ON } });
  try {
    await bg.install();
    assert.equal((await bg.send({ type: 'youtubeFocus:css' }, yt())).css, focusCss(ALL_ON));
    assert.equal((await bg.send({ type: 'youtubeFocus:css' }, sender('https://news.example/'))).css, '');
    assert.equal((await bg.send({ type: 'youtubeFocus:css' }, {})).css, '');
    await bg.send({ type: 'options:setDisabledSites', sites: ['youtube.com'] });
    assert.equal((await bg.send({ type: 'youtubeFocus:css' }, yt())).css, '', 'ChromeBlock wyłączony na youtube.com → Focus Mode też');
  } finally { bg.restore(); }
});

test('tło: szybkie zmiany są serializowane (ostatnia wygrywa, nic nie ginie)', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    await Promise.all([
      bg.send({ type: 'options:setYouTubeFocus', settings: { enabled: true } }),
      bg.send({ type: 'options:setYouTubeFocus', settings: { shorts: false } }),
      bg.send({ type: 'options:setYouTubeFocus', settings: { comments: false } }),
    ]);
    assert.deepEqual(bg.store[FOCUS_STORAGE_KEY], { ...FOCUS_DEFAULTS, enabled: true, shorts: false, comments: false });
  } finally { bg.restore(); }
});

test('Focus Mode nie zmienia YouTube Protection ani listy filtrów', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const before = await bg.send({ type: 'options:get' });
    const regBefore = bg.state.registered.map((r) => r.id).sort();
    await bg.send({ type: 'options:setYouTubeFocus', settings: ALL_ON });
    const after = await bg.send({ type: 'options:get' });
    assert.deepEqual(after.lists.map((l) => [l.id, l.enabled]), before.lists.map((l) => [l.id, l.enabled]));
    assert.equal(after.protectionMode, before.protectionMode);
    assert.deepEqual(bg.state.registered.map((r) => r.id).sort(), regBefore, 'scriptlety bez zmian');
  } finally { bg.restore(); }
});

// --- manifest / skrypt treści / opcje --------------------------------------

test('manifest: osobny skrypt Focus Mode tylko dla www.youtube.com; youtube/health.js bez zmian', () => {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  const focus = m.content_scripts.find((c) => c.js.includes('youtube/focus.js'));
  assert.deepEqual(focus, { matches: ['*://www.youtube.com/*'], js: ['youtube/focus.js'], run_at: 'document_start', all_frames: false });
  const health = m.content_scripts.find((c) => c.js.includes('youtube/health.js'));
  assert.deepEqual(health.js, ['youtube/health.js']);
  assert.deepEqual(m.permissions, ['activeTab', 'declarativeNetRequest', 'scripting', 'storage', 'webNavigation'], 'bez nowych uprawnień');
  const src = fs.readFileSync(path.join(ROOT, 'youtube/focus.js'), 'utf8');
  assert.match(src, /chrome\.storage\.onChanged\.addListener/);
  assert.match(src, /youtubeFocus:css/);
  assert.doesNotMatch(src, /fetch\(|XMLHttpRequest|location\.reload/);
});

test('opcje: zakładka YouTube z sekcją Focus Mode i przełącznikiem głównym', () => {
  const html = fs.readFileSync(path.join(ROOT, 'options/options.html'), 'utf8');
  assert.match(html, /data-tab="youtube">YouTube</);
  const sec = html.slice(html.indexOf('id="youtube"'));
  assert.match(sec, /Focus Mode/);
  assert.match(sec, /Włącz Focus Mode/);
  assert.match(sec, /id="focusEnabled"/);
  assert.match(sec, /id="focusOptions"/);
  const js = fs.readFileSync(path.join(ROOT, 'options/options.js'), 'utf8');
  assert.match(js, /options:setYouTubeFocus/);
});

// --- popup ---------------------------------------------------------------------

test('popup:get: stan Focus Mode tylko na youtube.com (poza YouTube – null)', async () => {
  for (const [url, expected] of [
    ['https://www.youtube.com/watch?v=abc', { enabled: false }],
    ['https://youtube.com/', { enabled: false }],
    ['https://news.example/', null],
    ['https://music.youtube.com/', null],
  ]) {
    const bg = await loadBackground({ tabUrl: url });
    try {
      await bg.install();
      assert.deepEqual((await bg.send({ type: 'popup:get', tabId: 1 })).youtubeFocus, expected, url);
    } finally { bg.restore(); }
  }
  const bg = await loadBackground({ tabUrl: 'https://www.youtube.com/', local: { [FOCUS_STORAGE_KEY]: { ...ALL_ON } } });
  try {
    await bg.install();
    const p = await bg.send({ type: 'popup:get', tabId: 1 });
    assert.deepEqual(p.youtubeFocus, { enabled: true }, 'popup pokazuje tylko główny przełącznik, nie cztery opcje');
    assert.ok(p.youtube, 'YouTube Protection nadal osobno');
  } finally { bg.restore(); }
});

test('popup.html: wiersz Focus Mode (ukryty domyślnie), przełącznik i „Dostosuj”; YouTube Protection osobno', () => {
  const html = fs.readFileSync(path.join(ROOT, 'popup/popup.html'), 'utf8');
  const row = html.slice(html.indexOf('id="focus"'), html.indexOf('id="focusErr"'));
  assert.match(html, /<div class="row focus-row" id="focus" hidden>/);
  assert.match(row, /Focus Mode/);
  assert.match(row, /id="focusToggle"[^>]*role="switch"/);
  assert.match(row, />Dostosuj</);
  assert.equal((row.match(/role="switch"/g) || []).length, 1, 'tylko główny przełącznik – bez szczegółowych opcji');
  assert.doesNotMatch(row, /type="checkbox"|data-key=|Ukryj (Shorts|rekomendacje|komentarze)/, 'bez czterech szczegółowych opcji');
  assert.ok(html.indexOf('id="youtube"') < html.indexOf('id="focus"'), 'YouTube Protection to osobny wiersz');
  const js = fs.readFileSync(path.join(ROOT, 'popup/popup.js'), 'utf8');
  assert.match(js, /options:setYouTubeFocus/);
  assert.match(js, /options\/options\.html#youtube/);
  assert.doesNotMatch(js.slice(js.indexOf('// --- YouTube Focus Mode')), /tabs\.reload/, 'bez przeładowania karty');
});
