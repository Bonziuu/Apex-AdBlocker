// Wyjątki jednej listy działające na dane INNEJ listy (np. uBlock filters w `ads` dla Polskich Filtrów w `pl`).
// Do v1.0.0 obie listy były kompilowane razem, więc takie wyjątki działały już w buildzie. Po wydzieleniu `pl`
// dane nie mogą być mieszane w jednym pliku, więc są stosowane w czasie działania, gdy lista źródłowa jest włączona:
//  - #@#+js: osobny plik listy źródłowej (scriptlets/<źródło>-x-<cel>.js), wstrzykiwany przed scriptletami celu,
//  - $badfilter dla wyjątków stron ($elemhide/$generichide/$document): pole crossHide w data/<cel>.json,
//  - $badfilter dla reguł DNR: data/badfilter-cross.json (tests/network/rules.test.mjs).

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAll, crossScriptletExceptions, crossScriptletExceptionFile, compileList, CROSS_EXCEPTIONS_SYMBOL } from '../../tools/build.mjs';
import { withCrossExceptionFiles, scriptletRegistrations } from '../../background/scriptlet-registration.js';
import { scriptletFilesForFrame } from '../../background/frame-scriptlets.js';
import { createEnv, run } from '../helpers/scriptlet-env.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (rel, root = ROOT) => fs.readFileSync(path.join(root, rel), 'utf8');

function buildSynthetic(files, lists) {
  const listsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-xlists-'));
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-xout-'));
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(listsDir, name), content);
  const result = buildAll({ lists, listsDir, outDir, updateManifest: false });
  return { ...result, outDir, cleanup: () => { fs.rmSync(listsDir, { recursive: true, force: true }); fs.rmSync(outDir, { recursive: true, force: true }); } };
}

const SYNTH_LISTS = [
  { id: 'gpl', name: 'GPL', desc: '', enabled: true, license: 'GPL-3.0-only', sources: [{ file: 'gpl.txt', trusted: true }] },
  { id: 'cc', name: 'CC', desc: '', enabled: true, license: 'CC-BY-NC-SA-4.0', sources: [{ file: 'cc.txt' }] },
];
const SYNTH_FILES = {
  'gpl.txt': [
    'news.example#@#+js(set-constant, adBlock, false)',
    'off.example#@#+js()',
    'gpl.example##+js(set-constant, gplFlag, true)',
    'unrelated.example#@#+js(set-constant, notInCc, true)',
  ].join('\n'),
  'cc.txt': [
    'news.example,off.example,keep.example##+js(set-constant, adBlock, false)',
    'news.example##+js(set-constant, ccOther, true)',
  ].join('\n'),
};

function pageRun(outDir, host, files) {
  const ctx = createEnv(host);
  for (const f of files) run(ctx, fs.readFileSync(path.join(outDir, f), 'utf8'));
  return ctx;
}

test('build: osobny plik wyjątków listy źródłowej, tylko klucze scriptletów listy docelowej (albo „*”)', () => {
  const b = buildSynthetic(SYNTH_FILES, SYNTH_LISTS);
  try {
    const ccMeta = JSON.parse(read('data/cc.scriptlets.json', b.outDir));
    const gplMeta = JSON.parse(read('data/gpl.scriptlets.json', b.outDir));
    assert.deepEqual(ccMeta.map((f) => f.crossBefore), [[{ list: 'gpl', file: 'scriptlets/gpl-x-cc.js' }]]);
    assert.deepEqual(gplMeta.map((f) => f.crossBefore), [[]], 'lista cc nie ma wyjątków dla gpl');
    assert.equal(fs.existsSync(path.join(b.outDir, 'scriptlets/cc-x-gpl.js')), false);
    const js = read('scriptlets/gpl-x-cc.js', b.outDir);
    const data = JSON.parse(/const DATA = (.*);\n/.exec(js)[1]);
    assert.deepEqual(data, {
      'news.example': ['set-constant\u0001adBlock\u0001false'],
      'off.example': ['*'],
    }, 'bez wyjątku dla scriptletu, którego lista docelowa nie ma (notInCc)');
    assert.match(js, /licencja GPL-3\.0-only/, 'plik dziedziczy licencję listy źródłowej');
    assert.doesNotMatch(js, /ccOther|keep\.example/, 'żadnych danych listy docelowej');
    // pliki listy cc nie zawierają danych gpl i odwrotnie
    assert.doesNotMatch(read('scriptlets/cc-0.js', b.outDir), /gplFlag|notInCc/);
    assert.doesNotMatch(read('scriptlets/gpl-0.js', b.outDir), /ccOther|keep\.example/);
    const meta = JSON.parse(read('data/lists.json', b.outDir));
    // statystyka liczy wyjątki z argumentami pasujące do scriptletów innych list (bez „*”)
    assert.equal(meta.find((m) => m.id === 'gpl').crossListScriptletExceptions, 1);
  } finally { b.cleanup(); }
});

test('działanie: wyjątek z innej listy wyłącza scriptlet tylko, gdy plik wyjątków jest wstrzyknięty', () => {
  const b = buildSynthetic(SYNTH_FILES, SYNTH_LISTS);
  try {
    const entity = 'shared/entity-hosts.js';
    fs.mkdirSync(path.join(b.outDir, 'shared'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, entity), path.join(b.outDir, entity));
    const [cc] = JSON.parse(read('data/cc.scriptlets.json', b.outDir));
    const filesFor = (enabled) => { const e = withCrossExceptionFiles(cc, enabled); return [...e.jsBefore, e.file]; };

    // obie listy włączone (jak v1.0.0): wyjątek uBO wyłącza scriptlet Polskich Filtrów
    let ctx = pageRun(b.outDir, 'news.example', filesFor(['gpl', 'cc']));
    assert.equal(run(ctx, 'typeof window.adBlock'), 'undefined', 'wyjątek z listy gpl');
    assert.equal(run(ctx, 'window.ccOther'), true, 'inne scriptlety listy cc działają');
    // „#@#+js()” bez argumentów z innej listy wyłącza wszystkie scriptlety listy cc na hoście
    ctx = pageRun(b.outDir, 'off.example', filesFor(['gpl', 'cc']));
    assert.equal(run(ctx, 'typeof window.adBlock'), 'undefined');
    // host bez wyjątku
    ctx = pageRun(b.outDir, 'keep.example', filesFor(['gpl', 'cc']));
    assert.equal(run(ctx, 'window.adBlock'), false);
    // lista źródłowa wyłączona: jej wyjątki nie są stosowane
    ctx = pageRun(b.outDir, 'news.example', filesFor(['cc']));
    assert.equal(run(ctx, 'window.adBlock'), false);
    // plik wyjątków wstrzyknięty wielokrotnie (kilka shardów / ramki): bez zmian
    ctx = pageRun(b.outDir, 'news.example', [...filesFor(['gpl', 'cc']).slice(0, -1), ...filesFor(['gpl', 'cc'])]);
    assert.equal(run(ctx, 'typeof window.adBlock'), 'undefined');
    assert.deepEqual(JSON.parse(run(ctx, `JSON.stringify(globalThis[Symbol.for(${JSON.stringify(CROSS_EXCEPTIONS_SYMBOL)})].cc['news.example'])`)), ['set-constant\u0001adBlock\u0001false']);
  } finally { b.cleanup(); }
});

test('rejestracja: plik wyjątków przed plikiem scriptletów, tylko dla włączonej listy źródłowej; ramki tak samo', () => {
  const entry = { id: 'sl-pl-0', file: 'scriptlets/pl-0.js', matches: ['*://*.wp.pl/*'], sessionMatches: [], jsBefore: ['shared/entity-hosts.js'], crossBefore: [{ list: 'ads', file: 'scriptlets/ads-x-pl.js' }] };
  const on = withCrossExceptionFiles(entry, ['ads', 'privacy', 'security', 'pl']);
  assert.deepEqual(on.jsBefore, ['shared/entity-hosts.js', 'scriptlets/ads-x-pl.js']);
  assert.equal('crossBefore' in on, false, 'bez pola crossBefore w rejestracji');
  assert.deepEqual(scriptletRegistrations(on, { devPerf: false, excludeMatches: [] })[0].js, ['shared/entity-hosts.js', 'scriptlets/ads-x-pl.js', 'scriptlets/pl-0.js']);
  assert.deepEqual(withCrossExceptionFiles(entry, ['pl']).jsBefore, ['shared/entity-hosts.js']);
  assert.deepEqual(withCrossExceptionFiles({ file: 'scriptlets/ads-0.js', matches: [] }, ['ads']).jsBefore, [], 'starsze metadane bez jsBefore/crossBefore');
  assert.deepEqual(scriptletFilesForFrame([on], 'https://www.wp.pl/'), ['shared/entity-hosts.js', 'scriptlets/ads-x-pl.js', 'scriptlets/pl-0.js']);
  // pusty rejestr = brak zmian (np. stary shard bez nowej funkcji nie istnieje w paczce)
  const merged = crossScriptletExceptions(
    compileList('a', [{ line: 'x.example#@#+js(noeval)' }], { badfilters: new Set(), gunhide: new Set() }),
    compileList('b', [{ line: 'x.example##+js(noeval)' }], { badfilters: new Set(), gunhide: new Set() }),
  );
  assert.deepEqual(merged, { 'x.example': ['noeval'] });
  assert.match(crossScriptletExceptionFile('a', 'A', 'b', merged).file, /^scriptlets\/a-x-b\.js$/);
});

test('rzeczywiste listy: wyjątki uBlock filters dla Polskich Filtrów (wp.pl, money.pl, filmweb.pl) działają jak w v1.0.0', () => {
  const js = read('scriptlets/ads-x-pl.js');
  const data = JSON.parse(/const DATA = (.*);\n/.exec(js)[1]);
  for (const host of ['wp.pl', 'www.wp.pl', 'money.pl', 'sportowefakty.wp.pl', 'filmweb.pl']) assert.ok(data[host]?.length, host);
  const plMeta = JSON.parse(read('data/pl.scriptlets.json'));
  assert.ok(plMeta.length > 0 && plMeta.every((f) => f.crossBefore.some((c) => c.list === 'ads' && c.file === 'scriptlets/ads-x-pl.js')));
  // brak plików wyjątków, które nie są wskazane w metadanych (np. po zmianie list)
  const referenced = new Set(fs.readdirSync(path.join(ROOT, 'data')).filter((f) => f.endsWith('.scriptlets.json'))
    .flatMap((f) => JSON.parse(read(`data/${f}`)).flatMap((e) => (e.crossBefore || []).map((c) => c.file))));
  const onDisk = fs.readdirSync(path.join(ROOT, 'scriptlets')).filter((f) => /-x-/.test(f)).map((f) => `scriptlets/${f}`);
  assert.deepEqual(onDisk.sort(), [...referenced].sort());
  // w działaniu: scriptlet Polskich Filtrów wyłączony przez uBO na www.wp.pl, gdy ads jest włączona
  const keyCall = data['www.wp.pl'][0].split('\u0001');
  const pl = withCrossExceptionFiles(plMeta[0], ['ads', 'pl']);
  const ctx = createEnv('www.wp.pl');
  for (const f of [...pl.jsBefore, pl.file]) run(ctx, read(f));
  const registry = JSON.parse(run(ctx, `JSON.stringify(globalThis[Symbol.for(${JSON.stringify(CROSS_EXCEPTIONS_SYMBOL)})].pl['www.wp.pl'])`));
  assert.ok(registry.includes(keyCall.join('\u0001')));
  // abort-on-property-read __headpayload (Polskie Filtry) – uBO ma na www.wp.pl wyjątek dla tego wywołania
  assert.deepEqual(keyCall, ['abort-on-property-read', '__headpayload']);
  assert.equal(run(ctx, "Object.getOwnPropertyDescriptor(globalThis, '__headpayload') === undefined"), true, 'wyjątek uBO zastosowany');
  const plOnly = withCrossExceptionFiles(plMeta[0], ['pl']);
  const ctx2 = createEnv('www.wp.pl');
  for (const f of [...plOnly.jsBefore, plOnly.file]) run(ctx2, read(f));
  assert.equal(run(ctx2, "typeof Object.getOwnPropertyDescriptor(globalThis, '__headpayload')?.get"), 'function', 'bez listy ads scriptlet Polskich Filtrów działa');
});

// $badfilter jednej listy dla wyjątku strony innej listy ($generichide / $elemhide / $document): w v1.0.0
// (wspólny build) wyjątek był usuwany; teraz zostaje w danych listy docelowej i jest pomijany w czasie
// działania, gdy lista źródłowa jest włączona. Przykład z list: uBO `@@||kobieta.wp.pl^$ehide,badfilter`.
test('build: $badfilter innej listy dla $elemhide/$generichide trafia do crossHide listy docelowej', () => {
  const b = buildSynthetic({
    'gpl.txt': '@@||kobieta.example^$ehide,badfilter\n@@||other.example^$ghide\n',
    'cc.txt': '@@||kobieta.example^$ehide\n@@||keep.example^$ghide\nkobieta.example##.cc-ad\n',
  }, SYNTH_LISTS);
  try {
    const cc = JSON.parse(read('data/cc.json', b.outDir));
    assert.deepEqual(cc.crossHide, [{ sources: ['gpl'], ghide: ['kobieta.example'], ehide: ['kobieta.example'], docAllow: [] }]);
    assert.ok(!cc.ehide.includes('kobieta.example') && !cc.ghide.includes('kobieta.example'));
    assert.ok(cc.ghide.includes('keep.example'), 'zwykłe wyjątki bez zmian');
    assert.deepEqual(JSON.parse(read('data/gpl.json', b.outDir)).crossHide, []);
  } finally { b.cleanup(); }
  const pl = JSON.parse(read('data/pl.json'));
  assert.deepEqual(pl.crossHide, [{ sources: ['ads'], ghide: ['kobieta.wp.pl'], ehide: ['kobieta.wp.pl'], docAllow: [] }]);
});

test('działanie: wyjątek strony z crossHide pomijany, gdy lista źródłowa jest włączona (jak v1.0.0)', async () => {
  const { loadBackground, sender } = await import('../helpers/chrome-mock.mjs');
  const meta = (ids) => ids.map((id) => ({ id, name: id, desc: '', enabledByDefault: true, networkFilters: 0, cosmeticFilters: 0 }));
  const empty = (extra = {}) => ({ sel: [], gen: {}, genC: [], spec: {}, unhide: {}, style: {}, proc: {}, ghide: [], ehide: [], docAllow: [], gunhide: [], ...extra });
  const plData = empty({ sel: ['.pl-ad'], spec: { 'kobieta.wp.pl': [0] }, crossHide: [{ sources: ['ads'], ghide: ['kobieta.wp.pl'], ehide: ['kobieta.wp.pl'], docAllow: [] }] });
  const files = (ids) => ({
    'data/lists.json': meta(ids), 'data/ads.json': empty({ sel: ['.generic-complex'], genC: [0] }), 'data/pl.json': plData,
    'data/ads.scriptlets.json': [], 'data/pl.scriptlets.json': [], 'data/badfilter-cross.json': [],
  });
  for (const [ids, expectHidden] of [[['ads', 'pl'], true], [['pl'], false]]) {
    const bg = await loadBackground({ files: files(ids) });
    try {
      await bg.install();
      const r = await bg.send({ type: 'cosmetic:init', url: 'https://kobieta.wp.pl/' }, sender('https://kobieta.wp.pl/'));
      const css = bg.state.css.at(-1)?.css || '';
      assert.equal(/\.pl-ad\{display:none!important\}/.test(css), expectHidden, `${ids}: ${css.slice(0, 120)}`);
      assert.equal(r.generic, expectHidden, `${ids}: filtry ogólne`);
    } finally { bg.restore(); }
  }
});
