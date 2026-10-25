// npm run test:polish-sites: analiza (jednostkowo) i przebieg w Chromium w trybie fixture (bez sieci).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { isAdLabel, observationsFor, pageVerdict, siteUrl, isThirdParty, topHosts, formatReport, falsePositiveReasons } from '../../tools/polish-sites/analyze.mjs';
import os from 'node:os';
import path from 'node:path';
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

test('false positive: stopka, kontener na całą stronę, nienaturalny rozmiar – oznaczone, nie usunięte', () => {
  const vp = { w: 1366, h: 900 };
  const page = { w: 1366, h: 6000 };
  const base = { label: 'reklama', el: 'span', viewport: vp, page };
  assert.deepEqual(falsePositiveReasons({ ...base, container: { w: 300, h: 250 } }), []);
  assert.deepEqual(falsePositiveReasons({ ...base, inFooter: true, container: { w: 1366, h: 80 } }), ['w stopce (footer)']);
  assert.ok(falsePositiveReasons({ ...base, container: { w: 1366, h: 5800 } }).includes('obejmuje prawie całą stronę'));
  assert.ok(falsePositiveReasons({ ...base, container: { w: 1366, h: 2000 } }).includes('nienaturalnie duży względem okna'));
  assert.deepEqual(falsePositiveReasons({ ...base, container: { w: 1200, h: 600 } }), [], 'duży, ale typowy boks');
  const snap = { labels: [
    { ...base, container: { desc: 'div#a', w: 300, h: 250, media: false, otherText: 0 } },
    { ...base, inFooter: true, container: { desc: 'footer', w: 1366, h: 80, media: false, otherText: 30 } },
  ], frames: [] };
  const o = observationsFor('strona.pl', snap);
  assert.equal(o.length, 2, 'wpis false positive zostaje');
  assert.deepEqual(o.map((x) => [x.labelIndex, x.likely_false_positive]), [[0, false], [1, true]]);
  assert.deepEqual(o[1].false_positive_reasons, ['w stopce (footer)']);
  const txt = formatReport({ date: 'd', version: 'v', sites: [{ domain: 'strona.pl', verdict: { status: 'OK', reason: '' }, requests: { total: 1, thirdParty: 0, blocked: 0 }, jsErrors: { count: 0, samples: [] }, consoleErrors: 0, unblockedThirdPartyHosts: [], observations: o.map((x, i) => ({ ...x, evidence: i ? undefined : { element: 'evidence/strona.pl-1.png', context: 'evidence/strona.pl-1-context.png' } })) }] });
  assert.match(txt, /etykiety reklam\/sponsorowanych: 1; puste kontenery reklamowe: 1; prawdopodobne false positive: 1/);
  assert.match(txt, /\[likely_false_positive: w stopce \(footer\)\]/);
  assert.match(txt, /dowód: evidence\/strona\.pl-1\.png \+ evidence\/strona\.pl-1-context\.png/);
  assert.equal(parseArgs(['--evidence', 'onet.pl']).evidence, true);
  assert.equal(parseArgs([]).evidence, false);
});

test('Chromium (fixture) --evidence: zrzuty elementu i otoczenia, ścieżki w latest.json, false positive oznaczone, bez HTML', { skip, timeout: 300_000 }, async () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-evidence-'));
  try {
    const r = await run({ fixture: true, evidence: true, log: () => {}, outDir, domains: ['fixture-a.example', 'fixture-c.example'] });
    assert.equal(r.evidence, true);
    const [a, c] = r.sites;
    for (const o of a.observations) {
      assert.equal(o.likely_false_positive, false);
      const n = o.id.split('#').pop();
      assert.deepEqual(o.evidence, { element: `evidence/fixture-a.example-${n}.png`, context: `evidence/fixture-a.example-${n}-context.png` });
      for (const f of [o.evidence.element, o.evidence.context]) {
        const buf = fs.readFileSync(path.join(outDir, f));
        assert.equal(buf.subarray(1, 4).toString(), 'PNG', `${f} to PNG`);
      }
    }
    assert.deepEqual(c.observations.map((o) => [o.kind, o.likely_false_positive]), [['empty-ad-container', true], ['ad-label', true]]);
    assert.ok(c.observations[0].false_positive_reasons.includes('obejmuje prawie całą stronę'));
    assert.deepEqual(c.observations[1].false_positive_reasons, ['w stopce (footer)']);
    assert.ok(c.observations.every((o) => o.evidence && o.evidence.element), 'dowód także dla oznaczonych (do oceny przez człowieka)');
    // latest.json zawiera ścieżki; w folderze evidence tylko PNG (bez HTML, cookies, profilu)
    const latest = JSON.parse(fs.readFileSync(path.join(outDir, 'latest.json'), 'utf8'));
    assert.equal(latest.sites[0].observations[0].evidence.element, 'evidence/fixture-a.example-1.png');
    assert.ok(fs.readdirSync(path.join(outDir, 'evidence')).every((f) => f.endsWith('.png')));
    assert.ok(!fs.readdirSync(outDir).some((f) => /\.html?$|cookie|profile/i.test(f)));
    assert.equal(fs.existsSync(r.extDir), false, 'tymczasowe rozszerzenie i profil usunięte');
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test('werdykt: błąd analizy po załadowaniu strony = ERROR (nie OK, nie UNREACHABLE)', () => {
  const v = pageVerdict({ analysisError: 'TypeError: result is not a function', status: 200, textLength: 5000, title: 'x' });
  assert.equal(v.status, 'ERROR');
  assert.match(v.reason, /analiza nie wykonała się: TypeError: result is not a function/);
  assert.equal(pageVerdict({ gotoError: 'net::ERR_X', analysisError: 'y' }).status, 'UNREACHABLE', 'błąd wejścia na stronę ma pierwszeństwo');
  assert.match(formatReport({ date: 'd', version: 'v', sites: [] }), /ERROR 0\)/);
});

test('Chromium: strona podmieniająca window.eval – page.evaluate pada („result is not a function”), evaluateIsolated działa', { skip, timeout: 120_000 }, async () => {
  const { evaluateIsolated } = await import('../../tools/polish-sites/test-polish-sites.mjs');
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent('<p id="x">treść</p><script>window.eval = function () { return undefined; };</script>');
    // odtworzenie błędu z realnego testu jbzd.com.pl
    await assert.rejects(page.evaluate(() => 1), /result is not a function/);
    // izolowany świat: ten sam DOM, własne obiekty globalne
    assert.equal(await evaluateIsolated(page, (sel) => document.querySelector(sel).textContent, '#x'), 'treść');
    assert.equal(await evaluateIsolated(page, () => typeof window.eval('1')), 'number', 'eval strony nie wpływa na izolowany świat');
    await assert.rejects(evaluateIsolated(page, () => { throw new Error('boom'); }), /analiza w stronie: Error: boom/);
  } finally {
    await browser.close();
  }
});

test('Chromium (fixture-d): analiza i evidence działają mimo podmienionego window.eval', { skip, timeout: 300_000 }, async () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-evald-'));
  try {
    const r = await run({ fixture: true, gap: true, evidence: true, log: () => {}, outDir, domains: ['fixture-d.example'] });
    const [d] = r.sites;
    assert.equal(d.verdict.status, 'OK', JSON.stringify(d.verdict));
    assert.deepEqual(d.observations.map((o) => [o.kind, o.label]), [['empty-ad-container', 'reklama']]);
    assert.equal(d.observations[0].size, '300x250');
    assert.equal(d.observations[0].evidence.element, 'evidence/fixture-d.example-1.png');
    assert.ok(fs.existsSync(path.join(outDir, 'evidence', 'fixture-d.example-1.png')));
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});
