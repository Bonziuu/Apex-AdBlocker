// Testy buildu na syntetycznych listach: izolacja wyjątków między listami
// (#@#, $badfilter, #@#+js) oraz pomijanie nieobsługiwanych scriptletów.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildAll } from '../../tools/build.mjs';

function makeLists(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-lists-'));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

const LISTS = [
  { id: 'ads', name: 'Ads', desc: '', enabled: true, sources: [{ file: 'ads.txt', trusted: true }] },
  { id: 'annoyances', name: 'Annoyances', desc: '', enabled: false, sources: [{ file: 'annoyances.txt', trusted: true }] },
];

function build(files) {
  const listsDir = makeLists(files);
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-out-'));
  const res = buildAll({ lists: LISTS, listsDir, outDir, updateManifest: false });
  const read = (p) => JSON.parse(fs.readFileSync(path.join(outDir, p), 'utf8'));
  return { res, read, outDir };
}

test('regresja: #@# z wyłączonej listy NIE usuwa selektora z innej listy w czasie buildu', () => {
  const { read } = build({
    'ads.txt': '##.example-ad\n##.only-ads\n',
    'annoyances.txt': '#@#.example-ad\n##.annoying\n',
  });
  const ads = read('data/ads.json');
  const sels = ads.sel;
  assert.ok(sels.includes('.example-ad'), 'selektor ADS zostaje');
  assert.ok(ads.gen['.example-ad'], 'i jest w indeksie ogólnym');
  const ann = read('data/annoyances.json');
  assert.deepEqual(ann.gunhide, ['.example-ad'], 'wyjątek jest zapisany przy swojej liście (stosowany w czasie działania)');
});

test('#@# w tej samej liście jest stosowany od razu', () => {
  const { read } = build({ 'ads.txt': '##.x\n#@#.x\n##.y\n', 'annoyances.txt': '' });
  const ads = read('data/ads.json');
  assert.equal(ads.gen['.x'], undefined);
  assert.ok(ads.gen['.y']);
});

test('regresja: $badfilter z innej listy nie usuwa reguły w buildzie – reguła jest osobna i wyłączana w czasie działania', () => {
  const { read, res } = build({
    'ads.txt': '||tracker.example^\n||other.example^\n',
    'annoyances.txt': '||tracker.example^$badfilter\n',
  });
  const rules = read('rules/ads.json');
  const target = rules.find((r) => r.condition.requestDomains && r.condition.requestDomains.length === 1 && r.condition.requestDomains[0] === 'tracker.example');
  assert.ok(target, 'reguła istnieje jako osobna reguła');
  assert.deepEqual(read('data/badfilter-cross.json'), [{ source: 'annoyances', target: 'ads', ruleIds: [target.id] }]);
  assert.equal(res.badfilterCross.length, 1);
});

test('$badfilter w tej samej liście usuwa filtr w buildzie', () => {
  const { read } = build({ 'ads.txt': '||a.example^\n||a.example^$badfilter\n||b.example^\n', 'annoyances.txt': '' });
  const domains = read('rules/ads.json').flatMap((r) => r.condition.requestDomains || []);
  assert.ok(!domains.includes('a.example'));
  assert.ok(domains.includes('b.example'));
});

test('nieobsługiwane scriptlety nie trafiają do plików scriptletów', () => {
  const { read, outDir } = build({
    'ads.txt': [
      'example.com##+js(set, a, true)',
      'example.com##+js(href-sanitizer, a, ?x)',
      'example.com##+js(rpnt, script, a, b, bogus, 1)',
      'example.com##+js(aost, a, b)',
    ].join('\n'),
    'annoyances.txt': '',
  });
  const files = read('data/ads.scriptlets.json');
  assert.equal(files.length, 1);
  const js = fs.readFileSync(path.join(outDir, files[0].file), 'utf8');
  const calls = JSON.parse(/const CALLS = (.*);\n/.exec(js)[1]);
  assert.deepEqual(calls, [['set-constant', 'a', 'true']]);
  assert.equal(read('data/lists.json')[0].scriptletRejected, 3);
});

test('wyjątki scriptletów z innej listy są zliczane (nie stosowane w buildzie)', () => {
  const { read, outDir } = build({
    'ads.txt': 'example.com##+js(set, a, true)\n',
    'annoyances.txt': 'example.com#@#+js(set, a, true)\nexample.com#@#+js(set, nieistniejacy, 1)\n',
  });
  const summary = read('data/lists.json');
  const ann = summary.find((x) => x.id === 'annoyances');
  assert.equal(ann.crossListScriptletExceptions, 1, 'tylko wyjątek wskazujący scriptlet innej listy');
  assert.equal(ann.unmatchedScriptletExceptions, 2);
  const files = read('data/ads.scriptlets.json');
  const js = fs.readFileSync(path.join(outDir, files[0].file), 'utf8');
  assert.deepEqual(JSON.parse(/const CALLS = (.*);\n/.exec(js)[1]), [['set-constant', 'a', 'true']], 'scriptlet ADS nietknięty');
});

test('tryb strict YouTube: nowy nieobsługiwany filtr YouTube jest wykrywany jako newGap', async () => {
  const { validateCompatibility } = await import('../../tools/build.mjs');
  const listsDir = makeLists({
    'ads.txt': [
      'www.youtube.com##+js(set, ytInitialPlayerResponse.adPlacements, undefined)',
      'www.youtube.com##+js(trusted-replace-argument, JSON.parse, 0, repl:/a/b/)',
      'www.youtube.com##+js(rpnt, script, a, b, newOption, 1)',
      'example.com##+js(href-sanitizer, a, ?x)',
    ].join('\n'),
  });
  const lists = [{ id: 'ads', name: 'Ads', desc: '', enabled: true, sources: [{ file: 'ads.txt', trusted: true }] }];
  const { youtube } = validateCompatibility({ write: false, lists, listsDir, baseline: { gaps: [] } });
  assert.equal(youtube.total, 3, 'tylko filtry YouTube (href-sanitizer dla example.com nie jest krytyczny)');
  assert.equal(youtube.supported, 1);
  assert.deepEqual(youtube.newGaps.map((g) => g.scriptlet).sort(), ['rpnt', 'trusted-replace-argument']);
  const withBaseline = validateCompatibility({ write: false, lists, listsDir,
    baseline: { gaps: youtube.newGaps.map((g) => ({ filter: g.filter })) } }).youtube;
  assert.equal(withBaseline.newGaps.length, 0, 'znane braki nie przerywają buildu');
  assert.equal(withBaseline.knownGaps.length, 2);
});
