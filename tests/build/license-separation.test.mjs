// Rozdzielenie licencji list filtrów (provenance, nie porównywanie tekstu reguł):
//  1. konfiguracja: każda lista łączy wyłącznie źródła jednej rodziny licencji; Polskie Filtry
//     (CC BY-NC-SA 4.0) są tylko w liście `pl`, a `pl` nie ma żadnego źródła GPL;
//  2. wygenerowane pliki listy są funkcją WYŁĄCZNIE jej źródeł: build samej listy (z pozostałych list
//     tylko linie $badfilter, które nie tworzą reguł) daje bajtowo te same pliki co pełny build;
//  3. metadane (data/lists.json), manifest i pliki wyjątków między listami zgadzają się z konfiguracją.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { LISTS, LISTS_DIR, ROOT, SOURCE_LICENSES, sourceFamily, listSourceFiles, loadList } from '../../tools/lists-config.mjs';
import { buildAll } from '../../tools/build.mjs';

const GPL = new Set(['GPL-3.0-only', 'GPL-3.0-or-later']);
const CC_NC_SA = new Set(['CC-BY-NC-SA-4.0']);
const group = (spdx) => (GPL.has(spdx) ? 'GPL' : CC_NC_SA.has(spdx) ? 'CC-BY-NC-SA' : `other:${spdx}`);
const byId = Object.fromEntries(LISTS.map((l) => [l.id, l]));
const read = (rel, root = ROOT) => fs.readFileSync(path.join(root, rel));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out); else out.push(full);
  }
  return out;
}

/** Pliki wygenerowane dla listy (bez plików wyjątków między listami, sprawdzanych osobno). */
function outputsOf(id, root = ROOT) {
  const shards = fs.readdirSync(path.join(root, 'scriptlets'))
    .filter((f) => f.startsWith(`${id}-`) && !f.includes('-x-')).map((f) => `scriptlets/${f}`);
  return [`rules/${id}.json`, `data/${id}.json`, `data/${id}.allow.json`, `data/${id}.scriptlets.json`, ...shards.sort()];
}

test('konfiguracja: każdy katalog źródeł ma licencję, każdy plik w tools/lists/ należy do znanego upstreamu', () => {
  for (const f of walk(LISTS_DIR).map((a) => path.relative(LISTS_DIR, a).split(path.sep).join('/'))) {
    assert.ok(SOURCE_LICENSES[sourceFamily(f)], `brak licencji dla ${f}`);
  }
  for (const [family, lic] of Object.entries(SOURCE_LICENSES)) {
    assert.ok(lic.used && lic.upstream && /^https:\/\//.test(lic.url), family);
    assert.ok(lic.spdx.split(' OR ').includes(lic.used), `${family}: używana licencja jest jedną z licencji upstreamu`);
  }
});

const licenseGroups = (list) => new Set(listSourceFiles(list).map((f) => group(SOURCE_LICENSES[sourceFamily(f)].used)));

test('kontrola wykrywa pomyłkę: Polskie Filtry dopisane z powrotem do `ads` dają dwie rodziny licencji', () => {
  const mixed = { ...byId.ads, sources: [...byId.ads.sources, { file: 'pl/adblock.txt' }] };
  assert.deepEqual([...licenseGroups(mixed)].sort(), ['CC-BY-NC-SA', 'GPL']);
});

test('konfiguracja: żadna lista nie łączy GPL i CC BY-NC-SA; licencja listy = licencja jej źródeł', () => {
  for (const list of LISTS) {
    const files = listSourceFiles(list);
    assert.ok(files.length > 0, list.id);
    const groups = licenseGroups(list);
    assert.equal(groups.size, 1, `${list.id}: ${[...groups].join(' + ')}`);
    assert.equal(group(list.license), [...groups][0], `${list.id}: pole license`);
    // GPL-3.0-or-later połączone z GPL-3.0-only daje GPL-3.0-only
    const used = new Set(files.map((f) => SOURCE_LICENSES[sourceFamily(f)].used));
    if (used.has('GPL-3.0-only')) assert.equal(list.license, 'GPL-3.0-only', list.id);
  }
});

test('konfiguracja: Polskie Filtry wyłącznie w `pl`, `pl` wyłącznie z Polskich Filtrów', () => {
  assert.ok(byId.pl, 'lista pl istnieje');
  assert.equal(byId.pl.enabled, true, 'pl domyślnie włączona (zachowanie v1.0.0)');
  assert.equal(byId.pl.license, 'CC-BY-NC-SA-4.0');
  assert.deepEqual([...new Set(listSourceFiles(byId.pl).map(sourceFamily))], ['pl']);
  assert.deepEqual(listSourceFiles(byId.pl), ['pl/adblock.txt', 'pl/adblock_suplement.txt', 'pl/adblock_ublock.txt']);
  for (const list of LISTS.filter((l) => l.id !== 'pl')) {
    assert.ok(!listSourceFiles(list).some((f) => sourceFamily(f) === 'pl'), `${list.id} nie zawiera Polskich Filtrów`);
  }
  assert.deepEqual([...new Set(listSourceFiles(byId.ads).map(sourceFamily))].sort(), ['easylist', 'ubo']);
});

test('metadane i manifest: pl jako osobny, domyślnie włączony ruleset; provenance w data/lists.json', () => {
  const meta = JSON.parse(read('data/lists.json'));
  assert.deepEqual(meta.map((m) => m.id), LISTS.map((l) => l.id));
  for (const m of meta) {
    assert.equal(m.license, byId[m.id].license, `${m.id}.license`);
    assert.deepEqual(m.sources, listSourceFiles(byId[m.id]), `${m.id}.sources`);
  }
  const manifest = JSON.parse(read('manifest.json'));
  const resources = manifest.declarative_net_request.rule_resources;
  assert.deepEqual(resources.find((r) => r.id === 'pl'), { id: 'pl', enabled: true, path: 'rules/pl.json' });
  for (const r of resources) assert.ok(fs.existsSync(path.join(ROOT, r.path)), r.path);
  // limity MV3: ≤ 50 włączonych / 100 statycznych rulesetów, ≥ 30 000 gwarantowanych reguł, ≤ 1000 regex
  assert.ok(resources.length <= 50);
  const rules = resources.map((r) => JSON.parse(read(r.path)));
  const total = rules.reduce((n, r) => n + r.length, 0);
  const regex = rules.reduce((n, r) => n + r.filter((x) => x.condition.regexFilter).length, 0);
  assert.ok(total <= 30000, `reguły statyczne: ${total}`);
  assert.ok(regex <= 1000, `reguły regex: ${regex}`);
  assert.ok(JSON.parse(read('rules/pl.json')).length > 0, 'pl ma reguły DNR');
  for (const id of ['pl']) for (const f of outputsOf(id)) assert.ok(fs.existsSync(path.join(ROOT, f)), f);
});

/**
 * Linie $badfilter INNYCH list. Jedyny wpływ innej listy na pliki listy X: reguły X wskazane przez
 * $badfilter innej listy są wydzielane do osobnych ID i wyłączane w czasie działania
 * (data/badfilter-cross.json), tak jak w v1.0.0 były usuwane przy wspólnym buildzie. Same linie
 * $badfilter nie tworzą reguł, więc nie wnoszą do plików X żadnych danych innej listy.
 */
function badfilterLines(list) {
  return loadList(list).map(({ line }) => line).filter((line) => /^[^#!]*\$(?:.*,)?badfilter\b/.test(line));
}

// Pełny build listy w izolacji (bez treści pozostałych list) – bajtowe porównanie z repozytorium.
function buildAlone(list) {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), `apex-alone-${list.id}-`));
  const bfDir = fs.mkdtempSync(path.join(os.tmpdir(), `apex-bf-${list.id}-`));
  try {
    // pozostałe listy zastąpione listami o tych samych id, zawierającymi wyłącznie ich linie $badfilter
    let bfCount = 0;
    const lists = LISTS.map((other) => {
      if (other.id === list.id) return list;
      const lines = badfilterLines(other);
      bfCount += lines.length;
      const file = path.join(bfDir, `${other.id}.txt`);
      fs.writeFileSync(file, lines.join('\n'));
      return { ...other, sources: [{ file: path.relative(LISTS_DIR, file) }] };
    });
    const { results } = buildAll({ lists, outDir, updateManifest: false });
    for (const other of LISTS) if (other.id !== list.id) assert.equal(results[other.id].rules.length, 0, `${other.id}: linie $badfilter nie tworzą reguł`);
    const same = [];
    for (const f of outputsOf(list.id)) {
      if (f === `data/${list.id}.scriptlets.json`) {
        // crossBefore wskazuje pliki INNYCH list (ich nie ma w tym buildzie); reszta identyczna
        const strip = (buf) => JSON.parse(buf).map(({ crossBefore, ...rest }) => rest);
        assert.deepEqual(strip(read(f, outDir)), strip(read(f)), `${list.id}: ${f}`);
      } else {
        assert.ok(fs.existsSync(path.join(outDir, f)), `${list.id}: ${f} w buildzie samej listy`);
        assert.ok(read(f, outDir).equals(read(f)), `${list.id}: ${f} zależy od treści innej listy`);
      }
      same.push(f);
    }
    assert.deepEqual(outputsOf(list.id, outDir), outputsOf(list.id), `${list.id}: te same pliki scriptletów`);
    return { files: same, badfilters: bfCount };
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.rmSync(bfDir, { recursive: true, force: true });
  }
}

test('wygenerowane pliki `pl` pochodzą wyłącznie z Polskich Filtrów (build samej listy = pełny build)', () => {
  const { files } = buildAlone(byId.pl);
  assert.ok(files.includes('rules/pl.json') && files.includes('data/pl.json') && files.some((f) => f.startsWith('scriptlets/pl-')));
});

for (const id of ['ads', 'privacy', 'security']) {
  test(`wygenerowane pliki \`${id}\` pochodzą wyłącznie z list GPL tej listy (bez Polskich Filtrów)`, { timeout: 600000 }, () => {
    buildAlone(byId[id]);
  });
}

test('pliki wyjątków między listami: tylko dane listy źródłowej, jej licencja; wyjątki GPL nie trafiają do plików pl', () => {
  const cross = fs.readdirSync(path.join(ROOT, 'scriptlets')).filter((f) => f.includes('-x-'));
  for (const f of cross) {
    const [, source, target] = /^(\w+)-x-(\w+)\.js$/.exec(f);
    assert.ok(byId[source] && byId[target] && source !== target, f);
    const js = read(`scriptlets/${f}`).toString();
    assert.match(js, new RegExp(`licencja ${byId[source].license.replace(/[.-]/g, '\\$&')}`), `${f}: licencja listy źródłowej`);
    const data = JSON.parse(/const DATA = (.*);\n/.exec(js)[1]);
    // każda para host → klucz pochodzi z wyjątków #@#+js listy źródłowej (build samej listy źródłowej)
    const alone = buildAll({ lists: [byId[source]], write: false }).results[source].scriptExcept;
    for (const [host, keys] of Object.entries(data)) {
      for (const k of keys) assert.ok(alone[host]?.includes(k), `${f}: ${host} ${k.replace(/\u0001/g, ',')} nie pochodzi z listy ${source}`);
    }
  }
  // dane list pl nigdy nie są przenoszone do plików innych list w drugą stronę bez licencji pl
  for (const f of cross.filter((x) => x.startsWith('pl-x-'))) assert.match(read(`scriptlets/${f}`).toString(), /licencja CC-BY-NC-SA-4\.0/);
});
