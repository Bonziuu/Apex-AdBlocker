// npm run test:polish-sites: analiza (jednostkowo) i przebieg w Chromium w trybie fixture (bez sieci).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { isAdLabel, observationsFor, pageVerdict, siteUrl, isThirdParty, topHosts, formatReport } from '../../tools/polish-sites/analyze.mjs';
import { parseArgs, run, MAX_SITES } from '../../tools/polish-sites/test-polish-sites.mjs';
import { loadPlaywright } from '../../tools/chromium-smoke.mjs';

test('etykiety: tylko pełny, krótki tekst etykiety reklamy', () => {
  for (const t of ['REKLAMA', 'Reklama', ' reklama: ', 'Sponsorowane', 'Artykuł sponsorowany', 'Materiał partnera', 'Advertisement']) assert.ok(isAdLabel(t), t);
  for (const t of ['Reklama dźwignią handlu – artykuł', 'ad', 'Ads', 'Partner', 'Promocja', 'reklamacja', '']) assert.ok(!isAdLabel(t), t);
});

test('obserwacje: etykieta / pusty kontener / pusta ramka po blokadzie; nazwa klasy z „ad” nie jest dowodem', () => {
  const snap = {
    labels: [
      { label: 'reklama', el: 'div#a > span', container: { desc: 'div#a', w: 300, h: 250, media: false, otherText: 0 } },
      { label: 'sponsorowane', el: 'div.b > span', container: { desc: 'div.b', w: 300, h: 120, media: true, otherText: 40 } },
      { label: 'ad', el: 'div.ad-slot', container: { desc: 'div.ad-slot', w: 300, h: 100, media: false, otherText: 0 } },
    ],
    frames: [
      { desc: 'iframe#x', w: 300, h: 250, src: 'https://ads.example/f' },
      { desc: 'iframe#y', w: 300, h: 250, src: 'https://player.example/f' },
    ],
  };
  const o = observationsFor('strona.pl', snap, new Set(['https://ads.example/f']));
  assert.deepEqual(o.map((x) => x.kind), ['empty-ad-container', 'ad-label', 'blocked-frame-space']);
  assert.equal(o[2].frameHost, 'ads.example');
  assert.ok(o.every((x) => x.id.startsWith('strona.pl#')));
  assert.deepEqual(observationsFor('strona.pl', { labels: [], frames: [] }), []);
});

test('werdykt strony, URL, 3rd-party, hosty, argumenty', () => {
  assert.equal(pageVerdict({ gotoError: 'net::ERR_NAME_NOT_RESOLVED' }).status, 'UNREACHABLE');
  assert.equal(pageVerdict({ status: 503, textLength: 5000 }).status, 'BROKEN');
  assert.equal(pageVerdict({ status: 200, textLength: 50 }).status, 'BROKEN');
  assert.equal(pageVerdict({ status: 200, textLength: 5000, title: 'Onet' }).status, 'OK');
  assert.equal(siteUrl('onet.pl'), 'https://www.onet.pl/');
  assert.equal(siteUrl('www.wp.pl'), 'https://www.wp.pl/');
  assert.equal(siteUrl('nie domena'), null);
  assert.ok(isThirdParty('https://ads.example.com/x', 'www.onet.pl'));
  assert.ok(!isThirdParty('https://ocdn.onet.pl/x', 'www.onet.pl'));
  assert.ok(!isThirdParty('https://a.businessinsider.com.pl/x', 'www.businessinsider.com.pl'));
  assert.deepEqual(topHosts(['https://a.x/1', 'https://a.x/2', 'https://b.x/1']), [{ host: 'a.x', count: 2 }, { host: 'b.x', count: 1 }]);
  const many = Array.from({ length: 30 }, (_, i) => `strona${i}.pl`);
  assert.equal(parseArgs(many).domains.length, MAX_SITES, 'maks. 20 stron');
  assert.deepEqual(parseArgs(['https://www.onet.pl/x', 'onet.pl', 'wp.pl']).domains, ['onet.pl', 'wp.pl']);
  assert.ok(parseArgs([]).domains.length > 0 && parseArgs([]).domains.length <= MAX_SITES, 'domyślna próbka');
  assert.match(formatReport({ date: 'd', version: 'v', fixture: true, sites: [] }), /Obserwacja NIE jest regułą/);
});

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

test('Chromium (fixture, bez sieci): blokady, etykiety, pusty kontener, błąd JS; „ad” w klasie ignorowane', { skip, timeout: 240_000 }, async () => {
  const r = await run({ fixture: true, write: false, log: () => {}, domains: ['fixture-a.example', 'fixture-b.example'] });
  const [a, b] = r.sites;
  assert.equal(a.verdict.status, 'OK');
  assert.ok(a.requests.blocked >= 1, 'ChromeBlock zablokował żądanie reklamowe');
  assert.deepEqual(a.observations.map((o) => [o.kind, o.label]), [['empty-ad-container', 'reklama'], ['ad-label', 'sponsorowane']]);
  assert.match(a.observations[0].container, /div#slot1$/);
  assert.equal(a.observations[0].size, '300x250');
  assert.ok(!a.observations.some((o) => /ad-slot/.test(o.container + o.element)), 'blok z klasą ad-slot bez etykiety nie jest obserwacją');
  assert.equal(b.verdict.status, 'OK');
  assert.equal(b.jsErrors.count, 1);
  assert.deepEqual(b.observations, []);
});
