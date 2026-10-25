// Lokalne statystyki (fundament v0.3): increment, deduplikacja, reset dnia, per domena,
// limit/sprzątanie, brak URL w storage, trwałość po restarcie, dane w popup:get.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  STATS_KEY, STATS_LIMITS, emptyStats, dayKey, siteKey, matchKey, normalizeStats, pruneSites,
  applyMatches, statsView, recordTabHost, hostAt,
} from '../../background/stats.js';
import { loadBackground } from '../helpers/chrome-mock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ALLOW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ads.allow.json'), 'utf8'));
const allowSet = new Set(ALLOW);
const BLOCK_ID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].find((id) => !allowSet.has(id));
const ALLOW_ID = ALLOW[0];

const T0 = new Date(2026, 9, 25, 12, 0, 0).getTime(); // 25.10.2026 12:00 (czas lokalny)
const m = (tabId, ruleId, ts, rulesetId = 'ads') => ({ tabId, rule: { rulesetId, ruleId }, timeStamp: ts });
const host = (h) => () => h;

// --- czysta logika ---------------------------------------------------------------

test('increment: łącznie, dzisiaj i per domena', () => {
  const { stats, added } = applyMatches(emptyStats(), [m(1, 1, T0), m(1, 2, T0 + 1), m(1, 3, T0 + 2)], { now: T0, hostFor: host('www.Example.com') });
  assert.equal(added, 3);
  assert.equal(stats.total, 3);
  assert.deepEqual(stats.today, { day: '2026-10-25', count: 3 });
  assert.deepEqual(stats.sites, { 'example.com': { n: 3, last: T0 + 2 } });
  assert.deepEqual(statsView(stats, 'www.example.com', T0 + 5), { totalBlocked: 3, todayBlocked: 3, siteBlocked: 3 });
  assert.deepEqual(statsView(stats, 'other.org', T0), { totalBlocked: 3, todayBlocked: 3, siteBlocked: 0 });
  assert.deepEqual(statsView(undefined, '', T0), { totalBlocked: 0, todayBlocked: 0, siteBlocked: 0 });
});

test('deduplikacja: to samo dopasowanie w kolejnych odczytach liczone raz', () => {
  const batch = [m(1, 1, T0), m(1, 2, T0 + 1)];
  let { stats } = applyMatches(emptyStats(), batch, { now: T0, hostFor: host('a.com') });
  // ten sam odczyt jeszcze raz + jedno nowe dopasowanie
  const r = applyMatches(stats, [...batch, m(1, 3, T0 + 2)], { now: T0, hostFor: host('a.com') });
  assert.equal(r.added, 1);
  assert.equal(r.stats.total, 3);
  // trzeci raz identycznie → nic
  const r2 = applyMatches(r.stats, [...batch, m(1, 3, T0 + 2)], { now: T0, hostFor: host('a.com') });
  assert.equal(r2.added, 0);
  assert.equal(r2.stats.total, 3);
  // ta sama reguła o innej porze lub w innej karcie to osobne zablokowania
  const r3 = applyMatches(r2.stats, [m(1, 3, T0 + 50), m(2, 3, T0 + 2)], { now: T0, hostFor: host('a.com') });
  assert.equal(r3.added, 2);
  // dopasowania starsze niż okno deduplikacji (już policzone) są pomijane
  stats = r3.stats;
  const old = applyMatches(stats, [m(9, 9, stats.cursor.ts - STATS_LIMITS.dedupWindowMs - 1)], { now: T0, hostFor: host('a.com') });
  assert.equal(old.added, 0);
  assert.equal(matchKey(m(1, 2, 3)), '1|ads|2|3');
});

test('deduplikacja przetrwa restart (kursor i klucze w zapisanym stanie)', () => {
  const batch = [m(1, 1, T0), m(1, 2, T0 + 1)];
  const first = applyMatches(emptyStats(), batch, { now: T0, hostFor: host('a.com') }).stats;
  const restored = normalizeStats(JSON.parse(JSON.stringify(first))); // zapis/odczyt storage
  const again = applyMatches(restored, batch, { now: T0, hostFor: host('a.com') });
  assert.equal(again.added, 0);
  assert.equal(again.stats.total, 2);
});

test('reset dnia: nowy dzień liczy od zera, łącznie rośnie dalej; „dzisiaj” = 0 po północy bez nowych blokad', () => {
  const before = new Date(2026, 9, 25, 23, 59, 58).getTime();
  const after = new Date(2026, 9, 26, 0, 0, 2).getTime();
  let { stats } = applyMatches(emptyStats(), [m(1, 1, before), m(1, 2, before + 1)], { now: before, hostFor: host('a.com') });
  assert.deepEqual(stats.today, { day: '2026-10-25', count: 2 });
  // po północy, bez nowych blokad
  assert.equal(statsView(stats, 'a.com', after).todayBlocked, 0);
  assert.equal(statsView(stats, 'a.com', after).totalBlocked, 2);
  // pierwsza blokada nowego dnia
  stats = applyMatches(stats, [m(1, 3, after)], { now: after, hostFor: host('a.com') }).stats;
  assert.deepEqual(stats.today, { day: '2026-10-26', count: 1 });
  assert.equal(stats.total, 3);
  // spóźnione dopasowanie z poprzedniego dnia (w oknie odczytu): tylko do łącznej liczby
  stats = applyMatches(stats, [m(2, 4, before + 2)], { now: after, hostFor: host('a.com') }).stats;
  assert.deepEqual(stats.today, { day: '2026-10-26', count: 1 });
  assert.equal(stats.total, 4);
  assert.equal(dayKey(new Date(2026, 0, 5, 1, 2).getTime()), '2026-01-05');
});

test('per domena: domena karty w chwili dopasowania (nawigacje karty)', () => {
  let tabs = {};
  tabs = recordTabHost(tabs, 7, 'www.news.example', T0);
  tabs = recordTabHost(tabs, 7, 'video.example', T0 + 1000);
  tabs = recordTabHost(tabs, 8, 'shop.example', T0);
  const matches = [m(7, 1, T0 + 10), m(7, 2, T0 + 20), m(7, 3, T0 + 1500), m(8, 4, T0 + 30), m(-1, 5, T0 + 40), m(9, 6, T0 + 50)];
  const { stats } = applyMatches(emptyStats(), matches, { now: T0, hostFor: (x) => hostAt(tabs, x.tabId, x.timeStamp) });
  assert.deepEqual(Object.fromEntries(Object.entries(stats.sites).map(([h, v]) => [h, v.n])), { 'news.example': 2, 'video.example': 1, 'shop.example': 1 });
  assert.equal(stats.total, 6, 'żądania spoza karty (tabId -1) i nieznanych kart liczą się do łącznej sumy');
  assert.equal(hostAt(tabs, 7, T0 - 5), '', 'dopasowanie sprzed znanej nawigacji – bez przypisania do domeny');
  assert.equal(hostAt({}, 3, T0, 'fallback.example'), 'fallback.example');
  // historia karty jest krótka
  let t = {};
  for (let i = 0; i < 10; i++) t = recordTabHost(t, 1, `s${i}.example`, T0 + i);
  assert.equal(t[1].length, 4);
});

test('limit i sprzątanie: maks. 500 domen (zostają ostatnio aktywne), wpisy > 90 dni usuwane', () => {
  const sites = {};
  for (let i = 0; i < 600; i++) sites[`s${i}.example`] = { n: 1, last: T0 - i * 1000 };
  sites['old.example'] = { n: 99, last: T0 - 91 * 24 * 3600 * 1000 };
  const p = pruneSites(sites, T0);
  assert.equal(Object.keys(p).length, STATS_LIMITS.maxSites);
  assert.ok(!('old.example' in p), 'starsze niż 90 dni');
  assert.ok('s0.example' in p && 's499.example' in p && !('s500.example' in p), 'zostają ostatnio aktywne');
  // applyMatches sprząta przy każdym zapisie
  const big = { ...emptyStats(), sites };
  const { stats } = applyMatches(big, [m(1, 1, T0)], { now: T0, hostFor: host('new.example') });
  assert.ok(Object.keys(stats.sites).length <= STATS_LIMITS.maxSites);
  assert.ok('new.example' in stats.sites);
  // klucze deduplikacji też mają limit
  const many = Array.from({ length: STATS_LIMITS.maxDedupKeys + 500 }, (_, i) => m(1, i + 1, T0));
  assert.ok(applyMatches(emptyStats(), many, { now: T0 }).stats.cursor.keys.length <= STATS_LIMITS.maxDedupKeys);
});

test('brak URL: tylko hostname (bez schematu, portu, ścieżki, zapytania); złe wpisy odrzucane przy odczycie', () => {
  assert.equal(siteKey('WWW.Example.COM.'), 'example.com');
  for (const bad of ['https://example.com/', 'example.com/path', 'example.com:8080', 'example.com?q=1', 'user@example.com', '', 'a b.com', 'x'.repeat(300)]) assert.equal(siteKey(bad), '', bad);
  const { stats } = applyMatches(emptyStats(), [m(1, 1, T0)], { now: T0, hostFor: host('https://evil.example/secret?token=1') });
  assert.deepEqual(stats.sites, {}, 'adres zamiast hostname nie jest zapisywany');
  const n = normalizeStats({ total: 5, sites: { 'https://x.com/a': { n: 1, last: 1 }, 'ok.example': { n: 2, last: 3 } }, cursor: { ts: 1, keys: ['1|ads|2|1', 'https://x.com|a|1|1'] } });
  assert.deepEqual(Object.keys(n.sites), ['ok.example']);
  assert.deepEqual(n.cursor.keys, ['1|ads|2|1']);
  assert.deepEqual(normalizeStats({ total: -3, today: { day: 'jutro', count: 'x' } }).total, 0);
});

// --- tło: storage, popup:get, restart ----------------------------------------------

function withMatches(bg, list) {
  globalThis.chrome.declarativeNetRequest.getMatchedRules = async (filter = {}) => ({
    rulesMatchedInfo: list.filter((x) => (filter.tabId === undefined || x.tabId === filter.tabId) && (!filter.minTimeStamp || x.timeStamp >= filter.minTimeStamp)),
  });
}

test('popup:get zwraca totalBlocked / todayBlocked / siteBlocked; reguły allow nie są liczone; licznik karty bez zmian', async () => {
  const now = Date.now();
  const bg = await loadBackground({ tabUrl: 'https://www.news.example/artykul?id=SECRET' });
  try {
    await bg.install();
    withMatches(bg, [m(1, BLOCK_ID, now - 3000), m(1, BLOCK_ID, now - 2000), m(1, ALLOW_ID, now - 1000), m(-1, BLOCK_ID, now - 500)]);
    const p = await bg.send({ type: 'popup:get', tabId: 1 });
    assert.equal(p.totalBlocked, 3, 'reguła allow pominięta, żądanie spoza karty liczone');
    assert.equal(p.todayBlocked, 3);
    assert.equal(p.siteBlocked, 2, 'domena bieżącej karty');
    assert.equal(p.blocked, 2, 'dotychczasowy licznik karty bez zmian');
    // nic poza liczbami i hostname
    const saved = JSON.stringify(bg.store[STATS_KEY]);
    assert.doesNotMatch(saved, /https?:|\/|\?|SECRET|artykul/);
    assert.deepEqual(Object.keys(bg.store[STATS_KEY].sites), ['news.example']);
    assert.doesNotMatch(JSON.stringify(bg.session), /https?:|SECRET|artykul/, 'także w storage.session');
  } finally { bg.restore(); }
});

test('trwałość po restarcie: statystyki z storage.local; te same dopasowania nie są liczone drugi raz', async () => {
  const now = Date.now();
  const matches = [m(1, BLOCK_ID, now - 3000), m(1, BLOCK_ID, now - 2000)];
  const bg1 = await loadBackground({ tabUrl: 'https://news.example/' });
  let store;
  try {
    await bg1.install();
    withMatches(bg1, matches);
    assert.equal((await bg1.send({ type: 'popup:get', tabId: 1 })).totalBlocked, 2);
    store = structuredClone(bg1.store);
  } finally { bg1.restore(); }
  // „restart” service workera / przeglądarki: nowa instancja, ten sam storage.local, Chrome nadal zwraca te same dopasowania
  const bg2 = await loadBackground({ tabUrl: 'https://news.example/', local: store });
  try {
    withMatches(bg2, [...matches, m(1, BLOCK_ID, now - 1000)]);
    const p = await bg2.send({ type: 'popup:get', tabId: 1 });
    assert.equal(p.totalBlocked, 3, 'stare 2 + 1 nowe – bez podwójnego liczenia');
    assert.equal(p.siteBlocked, 3);
    assert.equal(p.todayBlocked, 3);
  } finally { bg2.restore(); }
});

test('nawigacja karty zapisuje sam hostname (storage.session) i przypisuje blokady do właściwej domeny', async () => {
  const now = Date.now();
  const bg = await loadBackground({ tabUrl: 'https://second.example/' });
  try {
    await bg.install();
    bg.state.listeners.committed({ tabId: 1, frameId: 0, url: 'https://first.example/a?q=secret', timeStamp: now - 10_000 });
    bg.state.listeners.committed({ tabId: 1, frameId: 0, url: 'https://second.example/b', timeStamp: now - 5_000 });
    bg.state.listeners.committed({ tabId: 1, frameId: 3, url: 'https://ads.frame.example/', timeStamp: now - 4_000 }); // ramka – ignorowana
    await new Promise((r) => setTimeout(r, 50));
    withMatches(bg, [m(1, BLOCK_ID, now - 9_000), m(1, BLOCK_ID, now - 8_000), m(1, BLOCK_ID, now - 1_000)]);
    const p = await bg.send({ type: 'popup:get', tabId: 1 });
    assert.equal(p.siteBlocked, 1, 'second.example');
    assert.deepEqual(Object.fromEntries(Object.entries(bg.store[STATS_KEY].sites).map(([h, v]) => [h, v.n])), { 'first.example': 2, 'second.example': 1 });
    assert.doesNotMatch(JSON.stringify(bg.session), /https?:|secret|\/a|\/b/);
  } finally { bg.restore(); }
});

test('statystyki nie wysyłają danych: moduł i tło bez fetch na zewnątrz', () => {
  const code = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  assert.doesNotMatch(code('background/stats.js'), /fetch\(|XMLHttpRequest|sendBeacon|WebSocket|chrome\./, 'czysta logika, bez API przeglądarki');
  const bgSrc = fs.readFileSync(path.join(ROOT, 'background.js'), 'utf8');
  const block = bgSrc.slice(bgSrc.indexOf('// Lokalne statystyki'), bgSrc.indexOf('chrome.tabs.onRemoved.addListener'));
  assert.doesNotMatch(block, /fetch\(|sendBeacon|WebSocket|XMLHttpRequest/);
});

test('REGRESJA: wiele szybkich nawigacji naraz – żadna domena karty nie ginie (zapisy mapy kart po kolei)', async () => {
  const bg = await loadBackground({ tabUrl: 'https://x.example/' });
  try {
    await bg.install();
    const now = Date.now();
    for (let t = 1; t <= 8; t++) bg.state.listeners.committed({ tabId: t, frameId: 0, url: `https://site${t}.example/p`, timeStamp: now - 1000 });
    await new Promise((r) => setTimeout(r, 150));
    const tabs = bg.session.statsTabs;
    assert.deepEqual(Object.keys(tabs).map(Number).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8]);
    for (let t = 1; t <= 8; t++) assert.equal(tabs[t].at(-1).host, `site${t}.example`);
  } finally { bg.restore(); }
});

test('limit wywołań getMatchedRules: po wyczerpaniu popup:get działa i zwraca zapisane statystyki', async () => {
  const now = Date.now();
  const bg = await loadBackground({ tabUrl: 'https://news.example/' });
  try {
    await bg.install();
    let calls = 0;
    globalThis.chrome.declarativeNetRequest.getMatchedRules = async (f = {}) => {
      if (f.tabId === undefined) calls++;
      return { rulesMatchedInfo: [m(1, BLOCK_ID, now - 1000)].filter((x) => f.tabId === undefined || x.tabId === f.tabId) };
    };
    let last;
    for (let i = 0; i < 20; i++) last = await bg.send({ type: 'popup:get', tabId: 1 });
    assert.ok(calls <= 12, `odczyty statystyk: ${calls} (limit 12 / 10 min)`);
    assert.equal(last.totalBlocked, 1, 'wynik z zapisanego stanu, bez podwójnego liczenia');
    assert.equal(last.siteBlocked, 1);
  } finally { bg.restore(); }
});
