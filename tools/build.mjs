#!/usr/bin/env node
// Apex AdBlocker – budowanie reguł z list filtrów (tools/lists/).
//
//   node tools/build.mjs              pełny build + walidacja YouTube (strict)
//   node tools/build.mjs --no-strict  build bez przerywania przy nowych brakach YouTube
//
// Wynik: rules/*.json (declarativeNetRequest), data/*.json (filtry kosmetyczne,
// diagnostyka zgodności), scriptlets/*.js (scriptlety), aktualizacja manifest.json.
//
// Zasada izolacji list: wyjątki (#@#, $badfilter, #@#+js) z listy X NIGDY nie
// zmieniają w czasie buildu danych innej listy. Wyjątki działające między listami
// są stosowane w czasie działania, i tylko gdy obie listy są włączone.

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import {
  classifyLine, parseNetworkFilter, parseCosmeticFilter, validateRule,
  splitSelectorList, genericToken, scriptletKey,
} from '../shared/parser.js';
import { LISTS, ROOT, LISTS_DIR, loadList } from './lists-config.mjs';
import { runAudit, readBaseline } from './audit-scriptlets.mjs';

// Chrome match patterns cannot express an entity such as google.*. Those hosts
// are handled by a separate guarded shard instead of an incomplete TLD list.
export function hostPatterns(h) {
  if (!/^[a-z0-9.\-]+$/.test(h) || h.startsWith('.') || h.startsWith('-')) return [];
  return [/^\d+\.\d+\.\d+\.\d+$/.test(h) ? `*://${h}/*` : `*://*.${h}/*`];
}

/**
 * Ordinary host shards use targeted, persistent registration. Entity shards
 * are constructed separately, with one broad registration per list and an early
 * hostname guard. Keep the metadata's sessionMatches field for compatibility.
 */
export function splitShardMatches(hostList) {
  return { matches: [...new Set(hostList.flatMap(hostPatterns))].sort(), sessionMatches: [] };
}

export function normalizeForBadfilter(text) {
  const t = text.trim();
  const idx = t.lastIndexOf('$');
  if (idx === -1) return t;
  const opts = t.slice(idx + 1).split(',').filter((o) => o !== 'badfilter').sort().join(',');
  return t.slice(0, idx) + (opts ? '$' + opts : '');
}

const isBadfilter = (line) => /\$(.*,)?badfilter(,|$)/.test(line);

/**
 * Pierwsze przejście po wszystkich listach: wyjątki należące do każdej listy.
 * Zwraca { perList: {id: {badfilters:Set, gunhide:Set}}, crossBadfilter: {targetId: Map(normText → Set(sourceId))} }
 */
export function collectExceptions(listLines) {
  const perList = {};
  for (const [id, lines] of Object.entries(listLines)) {
    const badfilters = new Set();
    const gunhide = new Set();
    for (const { line } of lines) {
      if (isBadfilter(line)) badfilters.add(normalizeForBadfilter(line));
      const m = /^#@#(.+)$/.exec(line);
      if (m && !m[1].startsWith('+js(')) for (const s of splitSelectorList(m[1])) gunhide.add(s);
    }
    perList[id] = { badfilters, gunhide };
  }
  // $badfilter z listy A, który dotyczy filtra w liście B (B ≠ A)
  const crossBadfilter = {};
  for (const [target, lines] of Object.entries(listLines)) {
    const map = new Map();
    for (const { line } of lines) {
      if (!line || isBadfilter(line)) continue;
      const norm = normalizeForBadfilter(line);
      for (const [source, ex] of Object.entries(perList)) {
        if (source === target || !ex.badfilters.has(norm)) continue;
        if (!map.has(norm)) map.set(norm, new Set());
        map.get(norm).add(source);
      }
    }
    crossBadfilter[target] = map;
  }
  return { perList, crossBadfilter };
}

/**
 * Kompiluje jedną listę. Czysta funkcja (bez zapisu na dysk).
 * @param {string} listId
 * @param {Array<{line:string, trusted:boolean}>} lines
 * @param {{badfilters:Set, gunhide:Set}} own wyjątki tej listy
 * @param {Map<string, Set<string>>} crossTargets filtry tej listy wyłączane przez $badfilter z innych list
 */
export function compileList(listId, lines, own, crossTargets = new Map()) {
  const ruleMap = new Map();
  const hostGroups = new Map();
  const individual = []; // reguły, które muszą mieć własne id (cele $badfilter z innych list)
  const selTable = [];
  const selIndex = new Map();
  const sel = (s) => { let i = selIndex.get(s); if (i === undefined) { i = selTable.length; selTable.push(s); selIndex.set(s, i); } return i; };
  const gen = Object.create(null);
  const genC = new Set();
  const spec = Object.create(null);
  const unhide = Object.create(null);
  const style = Object.create(null);
  const proc = Object.create(null);
  // Keep exclusions attached to their own filter. A value-wide exception would
  // incorrectly cancel a separate rule that explicitly includes the same host.
  const scopedStyle = Object.create(null);
  const scopedProc = Object.create(null);
  const scopedHide = Object.create(null);
  const scopedGen = Object.create(null);
  const ghide = new Set();
  const ehide = new Set();
  const docAllow = new Set();
  const calls = [];
  const callIndex = new Map();
  const scriptHosts = Object.create(null);
  const scriptExcept = Object.create(null);
  const stats = { network: 0, skippedNetwork: 0, cosmetic: 0, skippedCosmetic: 0, scriptletRejected: 0, regex: 0, ownBadfiltered: 0 };
  const add = (obj, host, v) => { (obj[host] ||= []).push(v); };

  for (const { line, trusted } of lines) {
    if (!line) continue;
    const c = classifyLine(line);
    if (c.kind === 'comment') continue;

    if (c.kind === 'network') {
      if (isBadfilter(line)) continue;
      const norm = normalizeForBadfilter(line);
      if (own.badfilters.has(norm)) { stats.ownBadfiltered++; continue; }
      const res = parseNetworkFilter(c.text, { trusted });
      if (!res) { stats.skippedNetwork++; continue; }
      if (res.cosmeticHosts) {
        for (const h of res.cosmeticHosts.ghide || []) ghide.add(h);
        for (const h of res.cosmeticHosts.ehide || []) ehide.add(h);
        for (const h of res.cosmeticHosts.docAllow || []) docAllow.add(h);
      }
      if (!res.rule) continue;
      const rule = res.rule;
      if (!validateRule(rule)) { stats.skippedNetwork++; continue; }
      if (rule.condition.regexFilter) {
        if (stats.regex >= 900) { stats.skippedNetwork++; continue; }
        stats.regex++;
      }
      stats.network++;
      if (crossTargets.has(norm)) {
        individual.push({ rule, norm, sources: [...crossTargets.get(norm)] });
        continue;
      }
      const cond = rule.condition;
      if (cond.requestDomains && !cond.urlFilter && !cond.regexFilter) {
        const { requestDomains, ...rest } = cond;
        const key = JSON.stringify({ p: rule.priority, a: rule.action, c: rest });
        let g = hostGroups.get(key);
        if (!g) { g = { priority: rule.priority, action: rule.action, rest, domains: new Set() }; hostGroups.set(key, g); }
        for (const d of requestDomains) g.domains.add(d);
      } else {
        const key = JSON.stringify(rule);
        if (!ruleMap.has(key)) ruleMap.set(key, rule);
      }
      continue;
    }

    const f = parseCosmeticFilter(c, { trusted });
    if (!f) { stats.skippedCosmetic++; continue; }
    if (f.type === 'scriptlet-rejected') { stats.scriptletRejected++; continue; }
    stats.cosmetic++;
    switch (f.type) {
      case 'hide':
        for (const s of splitSelectorList(f.selector)) {
          if (f.exclude.length) {
            const scoped = { value: s, exclude: f.exclude };
            if (f.include.length) for (const h of f.include) add(scopedHide, h, scoped);
            else if (!own.gunhide.has(s)) add(scopedGen, genericToken(s) || '*', scoped);
            continue;
          }
          if (f.include.length) {
            const i = sel(s);
            for (const h of f.include) add(spec, h, i);
          } else {
            // ogólne #@# tej samej listy stosujemy od razu; z innych list – w czasie działania
            if (own.gunhide.has(s)) continue;
            const tok = genericToken(s);
            const i = sel(s);
            if (tok) add(gen, tok, i); else genC.add(i);
          }
        }
        break;
      case 'unhide':
        for (const s of splitSelectorList(f.selector)) for (const h of f.include) add(unhide, h, s);
        break;
      case 'style':
        for (const h of f.include) {
          if (f.exclude.length) add(scopedStyle, h, { value: [f.selector, f.css], exclude: f.exclude });
          else add(style, h, [f.selector, f.css]);
        }
        break;
      case 'procedural':
        for (const h of f.include) {
          if (f.exclude.length) add(scopedProc, h, { value: f.tasks, exclude: f.exclude });
          else add(proc, h, f.tasks);
        }
        break;
      case 'scriptlet': {
        const key = scriptletKey(f.call);
        let i = callIndex.get(key);
        if (i === undefined) { i = calls.length; calls.push(f.call); callIndex.set(key, i); }
        for (const h of f.include) add(scriptHosts, h, i);
        for (const h of f.exclude) add(scriptExcept, h, key);
        break;
      }
      case 'unscriptlet':
        for (const h of f.include) add(scriptExcept, h, f.key);
        break;
      default:
        break;
    }
  }

  // Reguły DNR: zwykłe, zgrupowane po domenach, a na końcu indywidualne cele $badfilter
  const rules = [...ruleMap.values()];
  for (const g of hostGroups.values()) {
    const domains = [...g.domains].sort();
    for (let i = 0; i < domains.length; i += 5000) {
      rules.push({ priority: g.priority, action: g.action, condition: { requestDomains: domains.slice(i, i + 5000), ...g.rest } });
    }
  }
  const crossRuleIds = {}; // źródło → [id reguł do wyłączenia, gdy źródło włączone]
  for (const ind of individual) {
    rules.push(ind.rule);
    const id = rules.length;
    for (const src of ind.sources) (crossRuleIds[src] ||= []).push(id);
  }
  const ordered = rules.map((r, i) => ({ id: i + 1, priority: r.priority, action: r.action, condition: r.condition }));

  const uniq = (obj) => { for (const k of Object.keys(obj)) obj[k] = [...new Set(obj[k])]; return obj; };
  const uniqJSON = (obj) => {
    for (const k of Object.keys(obj)) {
      const seen = new Set();
      obj[k] = obj[k].filter((v) => { const j = JSON.stringify(v); if (seen.has(j)) return false; seen.add(j); return true; });
    }
    return obj;
  };
  const cosmetic = {
    sel: selTable,
    gen: uniq(gen),
    genC: [...genC],
    spec: uniq(spec),
    unhide: uniq(unhide),
    style: uniqJSON(style),
    proc: uniqJSON(proc),
    scopedStyle: uniqJSON(scopedStyle),
    scopedProc: uniqJSON(scopedProc),
    scopedHide: uniqJSON(scopedHide),
    scopedGen: uniqJSON(scopedGen),
    ghide: [...ghide],
    ehide: [...ehide],
    docAllow: [...docAllow],
    // ogólne wyjątki #@# tej listy – stosowane w czasie działania do WSZYSTKICH włączonych list
    gunhide: [...own.gunhide].sort(),
  };

  uniq(scriptHosts);
  uniq(scriptExcept);
  // wyjątki #@#+js, które nie wskazują żadnego WYKONYWANEGO scriptletu tej listy
  const ownKeys = new Set(calls.map(scriptletKey));
  const unmatchedExceptionKeys = new Set();
  for (const keys of Object.values(scriptExcept)) for (const k of keys) if (k !== '*' && !ownKeys.has(k)) unmatchedExceptionKeys.add(k);
  stats.unmatchedScriptletExceptions = unmatchedExceptionKeys.size;

  return { rules: ordered, cosmetic, calls, scriptHosts, scriptExcept, crossRuleIds, stats, unmatchedExceptionKeys };
}

/**
 * The worker can restart after executeScript succeeds but before its reply arrives.
 * Keep the installation marker in the document's MAIN world, where it outlives
 * that worker, and include the source digest so a new packaged revision can run.
 * Scope/prerequisite guards must run before this marker is recorded.
 */
function oncePerDocument(file, source) {
  const key = `${file}:${createHash('sha256').update(source).digest('hex')}`;
  return `const installedKey = Symbol.for('ApexAdBlocker.scriptletShards.v1');
let installed = globalThis[installedKey];
if (!installed) {
  installed = new Set();
  Object.defineProperty(globalThis, installedKey, { value: installed, writable: false, configurable: false });
}
const shardKey = ${JSON.stringify(key)};
if (installed.has(shardKey)) return;
installed.add(shardKey);`;
}

/** Dzieli scriptlety na pliki według domeny, żeby strona ładowała tylko małą część danych. */
export function shardScriptlets(listId, listName, compiled, scriptletLib) {
  const { calls, scriptHosts, scriptExcept } = compiled;
  const hosts = Object.keys(scriptHosts).filter((h) => !h.endsWith('.*'));
  const entityHosts = Object.keys(scriptHosts).filter((h) => h.endsWith('.*'));
  const shardCount = Math.max(1, Math.min(32, Math.ceil(hosts.length / 1000)));
  const makeShard = () => ({ hosts: Object.create(null), calls: [], callMap: new Map() });
  const shards = Array.from({ length: shardCount }, makeShard);
  const addHost = (shard, h) => {
    shard.hosts[h] = scriptHosts[h].map((i) => {
      let j = shard.callMap.get(i);
      if (j === undefined) { j = shard.calls.length; shard.calls.push(calls[i]); shard.callMap.set(i, j); }
      return j;
    });
  };
  const hash = (str) => { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; };
  for (const h of hosts) {
    const base = h.split('.').slice(-2, -1)[0] || h;
    addHost(shards[hash(base) % shardCount], h);
  }
  const files = [];
  const body = (shard, except) => `const CALLS = ${JSON.stringify(shard.calls)};
const HOSTS = ${JSON.stringify(shard.hosts)};
const EXCEPT = ${JSON.stringify(except)};
${scriptletLib}
runForHost(CALLS, HOSTS, EXCEPT);`;
  shards.forEach((shard, n) => {
    const shardHosts = Object.keys(shard.hosts);
    if (!shardHosts.length) return;
    const { matches, sessionMatches } = splitShardMatches(shardHosts);
    const file = `scriptlets/${listId}-${n}.js`;
    const source = body(shard, scriptExcept);
    // runForHost fails closed when an entity exception needs the PSL helper.
    // Do not mark such an early return as installed: a later authorized retry
    // with the prerequisite must still be able to apply the ordinary hooks.
    const prerequisiteGuard = Object.keys(scriptExcept).some((h) => h.endsWith('.*'))
      ? "if (typeof globalThis[Symbol.for('ApexAdBlocker.entityHostKeys.v1')] !== 'function') return;"
      : '';
    const js = `/* Apex AdBlocker – scriptlety listy "${listName}" (część ${n + 1}/${shardCount}). Plik generowany przez tools/build.mjs. */
(function () {
'use strict';
${prerequisiteGuard}
${oncePerDocument(file, prerequisiteGuard + source)}
${source}
})();
`;
    files.push({ file, matches, sessionMatches, js, jsBefore: ['shared/entity-hosts.js'] });
  });

  if (entityHosts.length) {
    const entity = makeShard();
    for (const h of entityHosts) addHost(entity, h);
    const entityCalls = new Set(entity.callMap.keys());
    const except = Object.create(null);
    for (const [h, keys] of Object.entries(scriptExcept)) except[h] = keys.slice();
    // Ordinary host shards own overlapping calls, regardless of injection order.
    // Avoid installing the same hook twice when both google.* and google.fr match.
    for (const h of hosts) {
      const keys = scriptHosts[h].filter((i) => entityCalls.has(i)).map((i) => scriptletKey(calls[i]));
      if (keys.length) except[h] = [...new Set([...(except[h] || []), ...keys])];
    }
    const file = `scriptlets/${listId}-entities.js`;
    const source = body(entity, except);
    // One broad registration per list trades a small hostname check on unrelated
    // pages for complete entity coverage. Keep CALLS and the library in an inner
    // function so they are not initialized on pages rejected by the early guard.
    const js = `/* Apex AdBlocker – entity scriptlets for "${listName}". Generated by tools/build.mjs. */
(function () {
'use strict';
let hostname = '';
try { hostname = location.hostname; } catch { /* inaccessible location */ }
if (!hostname) {
  try { hostname = new URL(location.ancestorOrigins[0]).hostname; } catch { return; }
}
const ENTITIES = new Set(${JSON.stringify(entityHosts)});
const labels = hostname.split('.');
let applies = false;
for (let i = 0; i < labels.length && !applies; i++) {
  for (let end = i + 1; end < labels.length; end++) {
    if (ENTITIES.has(labels.slice(i, end).join('.') + '.*')) { applies = true; break; }
  }
}
if (!applies) return;
const resolve = globalThis[Symbol.for('ApexAdBlocker.entityHostKeys.v1')];
if (typeof resolve !== 'function' || !resolve(hostname).some((key) => ENTITIES.has(key))) return;
(function () {
${oncePerDocument(file, source)}
${source}
})();
})();
`;
    files.push({ file, matches: ['*://*/*'], sessionMatches: [], js, jsBefore: ['shared/entity-hosts.js'] });
  }
  return files;
}

/**
 * Biblioteka scriptletów z wklejonym silnikiem JSONPath. Kopia trafia do każdego
 * pliku scriptletów, więc usuwamy z niej pełnoliniowe komentarze i puste linie
 * (kod pozostaje bez zmian; testy uruchamiają dokładnie ten wynik).
 */
export function loadScriptletLibrary(root = ROOT) {
  const jsonpath = fs.readFileSync(path.join(root, 'shared', 'jsonpath.js'), 'utf8').replace(/^export\s+/m, '');
  const lib = fs.readFileSync(path.join(root, 'tools', 'scriptlets-lib.js'), 'utf8');
  const strip = (src) => src.split('\n')
    .filter((line) => { const t = line.trim(); return t !== '' && !t.startsWith('//'); })
    .map((line) => line.replace(/^\s+/, ''))
    .join('\n');
  return strip(jsonpath) + '\n' + strip(lib);
}

/**
 * Pełny build.
 * @param {{root?:string, outDir?:string, lists?:Array, listsDir?:string, write?:boolean, log?:Function, updateManifest?:boolean}} opts
 */
export function buildAll(opts = {}) {
  const root = opts.root || ROOT;
  const outDir = opts.outDir || root;
  const lists = opts.lists || LISTS;
  const listsDir = opts.listsDir || LISTS_DIR;
  const write = opts.write !== false;
  const log = opts.log || (() => {});

  const listLines = {};
  for (const list of lists) listLines[list.id] = loadList(list, { dir: listsDir });
  const { perList, crossBadfilter } = collectExceptions(listLines);
  const scriptletLib = loadScriptletLibrary(root);

  if (write) for (const d of ['rules', 'data', 'scriptlets']) fs.mkdirSync(path.join(outDir, d), { recursive: true });
  if (write) {
    for (const f of fs.readdirSync(path.join(outDir, 'scriptlets'))) if (f.endsWith('.js')) fs.unlinkSync(path.join(outDir, 'scriptlets', f));
  }

  const summary = [];
  const ruleResources = [];
  const badfilterCross = [];
  const results = {};
  const totals = { network: 0, skippedNetwork: 0, cosmetic: 0, skippedCosmetic: 0, scriptletRejected: 0 };

  for (const list of lists) {
    const compiled = compileList(list.id, listLines[list.id], perList[list.id], crossBadfilter[list.id]);
    results[list.id] = compiled;
    const files = shardScriptlets(list.id, list.name, compiled, scriptletLib);
    for (const [source, ruleIds] of Object.entries(compiled.crossRuleIds)) badfilterCross.push({ source, target: list.id, ruleIds });
    for (const k of Object.keys(totals)) totals[k] += compiled.stats[k] || 0;
    const matchCount = files.reduce((n, f) => n + f.matches.length, 0);
    const sessionMatchCount = files.reduce((n, f) => n + f.sessionMatches.length, 0);

    if (write) {
      fs.writeFileSync(path.join(outDir, 'rules', `${list.id}.json`), JSON.stringify(compiled.rules));
      fs.writeFileSync(path.join(outDir, 'data', `${list.id}.allow.json`),
        JSON.stringify(compiled.rules.filter((r) => r.action.type.startsWith('allow')).map((r) => r.id)));
      fs.writeFileSync(path.join(outDir, 'data', `${list.id}.json`), JSON.stringify(compiled.cosmetic));
      for (const f of files) fs.writeFileSync(path.join(outDir, f.file), f.js);
      fs.writeFileSync(path.join(outDir, 'data', `${list.id}.scriptlets.json`), JSON.stringify(files.map(({ file, matches, sessionMatches, jsBefore }) => ({ file, matches, sessionMatches, jsBefore }))));
    }
    ruleResources.push({ id: list.id, enabled: list.enabled, path: `rules/${list.id}.json` });

    const s = compiled.stats;
    summary.push({
      id: list.id,
      name: list.name,
      desc: list.desc,
      enabledByDefault: list.enabled,
      networkRules: compiled.rules.length,
      networkFilters: s.network,
      cosmeticFilters: s.cosmetic,
      scriptletFilters: compiled.calls.length,
      scriptletRejected: s.scriptletRejected,
      scriptletFiles: files.length,
      scriptletPatterns: matchCount,
      scriptletSessionPatterns: sessionMatchCount,
      unmatchedScriptletExceptions: s.unmatchedScriptletExceptions,
    });
    log(`${list.id.padEnd(11)} reguły DNR: ${String(compiled.rules.length).padStart(6)} (regex: ${s.regex})  kosmetyczne: ${String(s.cosmetic).padStart(6)}  scriptlety: ${compiled.calls.length} (odrzucone: ${s.scriptletRejected}), ${files.length} plików, ${matchCount} wzorców (+ ${sessionMatchCount} sesyjnych)`);
  }

  // Wyjątki #@#+js z listy X, które dotyczą scriptletów wykonywanych przez INNĄ listę.
  // Nie są stosowane między listami (ograniczenie) – liczymy je, żeby było to widoczne.
  for (const item of summary) {
    const own = results[item.id];
    let cross = 0;
    for (const k of own.unmatchedExceptionKeys) {
      if (Object.entries(results).some(([id, r]) => id !== item.id && r.calls.some((c) => scriptletKey(c) === k))) cross++;
    }
    item.crossListScriptletExceptions = cross;
    if (cross) log(`Uwaga: ${item.id} – ${cross} wyjątków #@#+js dotyczy scriptletów z innych list (nie są stosowane między listami)`);
  }

  if (write) {
    fs.writeFileSync(path.join(outDir, 'data', 'lists.json'), JSON.stringify(summary, null, 1));
    fs.writeFileSync(path.join(outDir, 'data', 'badfilter-cross.json'), JSON.stringify(badfilterCross));
  }
  if (write && opts.updateManifest !== false) {
    const manifestPath = path.join(outDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.declarative_net_request = { rule_resources: ruleResources };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  }
  log(`\nFiltry sieciowe: ${totals.network} przyjęte, ${totals.skippedNetwork} pominięte (nieobsługiwane w MV3)`);
  log(`Filtry kosmetyczne: ${totals.cosmetic} przyjęte, ${totals.skippedCosmetic} pominięte; scriptlety odrzucone (nieobsługiwane): ${totals.scriptletRejected}`);
  if (badfilterCross.length) log(`$badfilter między listami: ${badfilterCross.reduce((n, b) => n + b.ruleIds.length, 0)} reguł (wyłączane w czasie działania, gdy lista źródłowa jest włączona)`);
  return { summary, results, badfilterCross, totals };
}

/** Walidacja YouTube (strict) + zapis danych diagnostycznych zgodności. */
export function validateCompatibility({ outDir = ROOT, write = true, log = () => {}, baseline = readBaseline(), lists, listsDir } = {}) {
  const audit = runAudit({ baseline, lists, dir: listsDir });
  const y = audit.youtube;
  const youtube = {
    total: y.summary.total,
    supported: y.summary.supported,
    partial: y.summary.partial,
    unsupported: y.summary.unsupported,
    knownGaps: y.knownGaps.map((e) => ({ filter: e.line, scriptlet: e.name, reason: e.reason })),
    newGaps: y.newGaps.map((e) => ({ filter: e.line, scriptlet: e.name, reason: e.reason })),
  };
  if (write) {
    fs.writeFileSync(path.join(outDir, 'data', 'youtube-compat.json'), JSON.stringify(youtube, null, 1));
    fs.writeFileSync(path.join(outDir, 'data', 'scriptlet-compat.json'), JSON.stringify({ summary: audit.summary, byList: audit.byList }, null, 1));
  }
  log('\nYouTube compatibility:');
  log(`  ${youtube.total} scriptlet rules`);
  log(`  ${youtube.supported} supported`);
  log(`  ${youtube.partial + youtube.unsupported} unsupported (partial: ${youtube.partial})`);
  if (youtube.knownGaps.length) {
    log(`  znane braki (youtube/known-gaps.json): ${youtube.knownGaps.length}`);
    for (const g of youtube.knownGaps) log(`    - ${g.scriptlet}: ${g.reason}`);
  }
  if (youtube.newGaps.length) {
    log('\nCRITICAL YOUTUBE COMPATIBILITY FAILURE');
    for (const g of youtube.newGaps) log(`  ${g.scriptlet}: ${g.reason}\n    ${g.filter.slice(0, 200)}`);
  }
  return { youtube, audit };
}

function main() {
  const strict = !process.argv.includes('--no-strict');
  const log = (...a) => console.log(...a);
  buildAll({ log });
  const { youtube } = validateCompatibility({ log });
  if (youtube.newGaps.length) {
    if (strict) {
      console.error(`\nBuild przerwany: ${youtube.newGaps.length} krytycznych filtrów YouTube nie jest obsługiwanych.`);
      console.error('Zaimplementuj brakującą semantykę albo – po świadomej decyzji – dopisz je do youtube/known-gaps.json');
      console.error('(node tools/audit-scriptlets.mjs --update-youtube-baseline).');
      process.exit(1);
    }
    console.warn('\nUWAGA: --no-strict – build kontynuowany mimo braków YouTube.');
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main();
