#!/usr/bin/env node
// Buduje reguły rozszerzenia z list filtrów w tools/lists/.
// Użycie:  node tools/build.mjs
// Wynik:   rules/*.json (declarativeNetRequest), data/*.json (filtry kosmetyczne),
//          scriptlets/*.js (scriptlety), data/lists.json, aktualizacja manifest.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  classifyLine, parseNetworkFilter, parseCosmeticFilter, validateRule,
  splitSelectorList, genericToken, scriptletKey, TRUSTED_SCRIPTLETS,
} from '../shared/parser.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LISTS_DIR = path.join(ROOT, 'tools', 'lists');

export const LISTS = [
  {
    id: 'ads',
    name: 'Reklamy',
    desc: 'EasyList, uBlock filters i Polskie Filtry Reklamowe',
    enabled: true,
    sources: [
      { file: 'easylist/easylist.txt' },
      { file: 'ubo/filters.txt', trusted: true },
      { file: 'ubo/quick-fixes.txt', trusted: true },
      { file: 'ubo/unbreak.txt', trusted: true },
      { file: 'pl/adblock.txt' },
    ],
  },
  {
    id: 'privacy',
    name: 'Śledzenie i prywatność',
    desc: 'EasyPrivacy i uBlock filters – Privacy',
    enabled: true,
    sources: [
      { file: 'easylist/easyprivacy.txt' },
      { file: 'ubo/privacy.txt', trusted: true },
    ],
  },
  {
    id: 'security',
    name: 'Złośliwe strony',
    desc: 'uBlock filters – Badware risks (oszustwa, malware)',
    enabled: true,
    sources: [{ file: 'ubo/badware.txt', trusted: true }],
  },
  {
    id: 'cookies',
    name: 'Komunikaty o cookies',
    desc: 'uBlock filters – Cookie Notices',
    enabled: false,
    sources: [{ file: 'ubo/annoyances-cookies.txt', trusted: true }],
  },
  {
    id: 'annoyances',
    name: 'Elementy irytujące',
    desc: 'Fanboy Annoyances i uBlock filters – Annoyances (wyskakujące okna, newslettery, przyciski społecznościowe)',
    enabled: false,
    sources: [
      { file: 'easylist/fanboy-annoyance.txt' },
      { file: 'ubo/annoyances-others.txt', trusted: true },
    ],
  },
];

// Środowisko dla dyrektyw !#if – zachowujemy się jak uBO Lite (MV3) w Chromium.
const ENV = {
  env_chromium: true, env_mv3: true, ext_ubol: true, ext_ublock: true,
  cap_html_filtering: false, cap_user_stylesheet: true, cap_ipaddress: false,
  env_firefox: false, env_safari: false, env_mobile: false, env_edge: false,
  adguard: false, adguard_ext_firefox: false, adguard_ext_chromium: false, ext_abp: false,
  ext_devbuild: false, false: false, true: true,
};

function evalCondition(expr) {
  const tokens = expr.match(/!|&&|\|\||\(|\)|[A-Za-z0-9_]+/g) || [];
  let pos = 0;
  const parseOr = () => { let v = parseAnd(); while (tokens[pos] === '||') { pos++; v = parseAnd() || v; } return v; };
  const parseAnd = () => { let v = parseNot(); while (tokens[pos] === '&&') { pos++; v = parseNot() && v; } return v; };
  const parseNot = () => {
    if (tokens[pos] === '!') { pos++; return !parseNot(); }
    if (tokens[pos] === '(') { pos++; const v = parseOr(); pos++; return v; }
    const t = tokens[pos++];
    return ENV[t] === true;
  };
  return parseOr();
}

function loadList(file, seen = new Set()) {
  const abs = path.join(LISTS_DIR, file);
  if (seen.has(abs) || !fs.existsSync(abs)) return [];
  seen.add(abs);
  const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/);
  const out = [];
  const stack = []; // aktywność bloków !#if
  const active = () => stack.every(Boolean);
  for (const line of lines) {
    if (line.startsWith('!#if ')) { stack.push(evalCondition(line.slice(5))); continue; }
    if (line.startsWith('!#else')) { if (stack.length) stack[stack.length - 1] = !stack[stack.length - 1]; continue; }
    if (line.startsWith('!#endif')) { stack.pop(); continue; }
    if (!active()) continue;
    if (line.startsWith('!#include ')) {
      const inc = path.join(path.dirname(file), line.slice(10).trim());
      out.push(...loadList(inc, seen));
      continue;
    }
    out.push(line);
  }
  return out;
}

function normalizeForBadfilter(text) {
  const t = text.trim();
  const idx = t.lastIndexOf('$');
  if (idx === -1) return t;
  const opts = t.slice(idx + 1).split(',').filter((o) => o !== 'badfilter').sort().join(',');
  return t.slice(0, idx) + (opts ? '$' + opts : '');
}

// TLD, na które rozwijamy encje "x.*" przy rejestracji scriptletów (dopasowanie
// i tak jest sprawdzane w czasie działania, więc to tylko lista adresów, gdzie plik się ładuje).
const REG_TLDS = ['com', 'net', 'org', 'pl', 'com.pl', 'de', 'co.uk', 'io', 'tv', 'me', 'cc', 'to',
  'co', 'info', 'xyz', 'online', 'site', 'top', 'ws', 'la', 'is', 'sx', 'one', 'lol'];

function hostPatterns(h) {
  if (!/^[a-z0-9.\-]+(\.\*)?$/.test(h) || h.startsWith('.') || h.startsWith('-')) return [];
  if (h.endsWith('.*')) {
    const base = h.slice(0, -2);
    return REG_TLDS.map((t) => `*://*.${base}.${t}/*`);
  }
  return [/^\d+\.\d+\.\d+\.\d+$/.test(h) ? `*://${h}/*` : `*://*.${h}/*`];
}

function build() {
  // 1. Wczytaj wszystkie linie i zbierz $badfilter oraz globalne #@#
  const listLines = new Map();
  const badfilters = new Set();
  const globalUnhide = new Set();
  for (const list of LISTS) {
    const lines = [];
    for (const src of list.sources) {
      for (const line of loadList(src.file)) lines.push({ line: line.trim(), trusted: !!src.trusted });
    }
    listLines.set(list.id, lines);
    for (const { line } of lines) {
      if (/\$(.*,)?badfilter(,|$)/.test(line)) badfilters.add(normalizeForBadfilter(line));
      const m = /^#@#(.+)$/.exec(line);
      if (m && !m[1].startsWith('+js(')) for (const s of splitSelectorList(m[1])) globalUnhide.add(s);
    }
  }

  const scriptletLib = fs.readFileSync(path.join(ROOT, 'tools', 'scriptlets-lib.js'), 'utf8');
  const summary = [];
  const ruleResources = [];
  const stats = { network: 0, skippedNetwork: 0, cosmetic: 0, skippedCosmetic: 0 };

  fs.mkdirSync(path.join(ROOT, 'rules'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'scriptlets'), { recursive: true });

  for (const list of LISTS) {
    const lines = listLines.get(list.id);
    const ruleMap = new Map();          // klucz JSON → reguła
    const hostGroups = new Map();       // grupowanie reguł z requestDomains
    const selTable = [];
    const selIndex = new Map();
    const sel = (s) => { let i = selIndex.get(s); if (i === undefined) { i = selTable.length; selTable.push(s); selIndex.set(s, i); } return i; };
    const gen = {};
    const genC = new Set();
    const spec = {};
    const unhide = {};
    const style = {};
    const proc = {};
    const ghide = new Set();
    const ehide = new Set();
    const docAllow = new Set();
    const calls = [];
    const callIndex = new Map();
    const scriptHosts = {};
    const scriptExcept = {};
    let regexCount = 0;
    let cosmeticCount = 0;

    const add = (obj, host, v) => { (obj[host] ||= []).push(v); };

    for (const { line, trusted } of lines) {
      if (!line) continue;
      const c = classifyLine(line);
      if (c.kind === 'comment') continue;

      if (c.kind === 'network') {
        if (badfilters.has(normalizeForBadfilter(line)) || /(^|,|\$)badfilter(,|$)/.test(line)) continue;
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
          if (regexCount >= 900) { stats.skippedNetwork++; continue; }
          regexCount++;
        }
        // Grupuj reguły różniące się tylko requestDomains (np. "||domena^")
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
        stats.network++;
        continue;
      }

      // kosmetyczne
      const f = parseCosmeticFilter(c);
      if (!f) { stats.skippedCosmetic++; continue; }
      stats.cosmetic++;
      cosmeticCount++;
      switch (f.type) {
        case 'hide':
          for (const s of splitSelectorList(f.selector)) {
            if (f.include.length) {
              const i = sel(s);
              for (const h of f.include) add(spec, h, i);
            } else {
              if (globalUnhide.has(s)) continue;
              const tok = genericToken(s);
              const i = sel(s);
              if (tok) add(gen, tok, i); else genC.add(i);
            }
            for (const h of f.exclude) add(unhide, h, s);
          }
          break;
        case 'unhide':
          for (const s of splitSelectorList(f.selector)) for (const h of f.include) add(unhide, h, s);
          break;
        case 'style':
          for (const h of f.include) add(style, h, [f.selector, f.css]);
          break;
        case 'procedural':
          for (const h of f.include) add(proc, h, f.tasks);
          break;
        case 'scriptlet': {
          if (TRUSTED_SCRIPTLETS.has(f.call[0]) && !trusted) { stats.skippedCosmetic++; break; }
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
      }
    }

    // Reguły sieciowe → plik
    const rules = [...ruleMap.values()];
    for (const g of hostGroups.values()) {
      const domains = [...g.domains].sort();
      // dziel bardzo duże grupy, żeby pojedyncza reguła nie była ogromna
      for (let i = 0; i < domains.length; i += 5000) {
        rules.push({ priority: g.priority, action: g.action, condition: { requestDomains: domains.slice(i, i + 5000), ...g.rest } });
      }
    }
    rules.forEach((r, i) => { r.id = i + 1; });
    const ordered = rules.map((r) => ({ id: r.id, priority: r.priority, action: r.action, condition: r.condition }));
    fs.writeFileSync(path.join(ROOT, 'rules', `${list.id}.json`), JSON.stringify(ordered));
    // identyfikatory reguł "przepuszczających" – żeby licznik w okienku liczył tylko blokady
    fs.writeFileSync(path.join(ROOT, 'data', `${list.id}.allow.json`),
      JSON.stringify(ordered.filter((r) => r.action.type.startsWith('allow')).map((r) => r.id)));
    ruleResources.push({ id: list.id, enabled: list.enabled, path: `rules/${list.id}.json` });

    // Dane kosmetyczne → plik
    const uniq = (obj) => { for (const k of Object.keys(obj)) obj[k] = [...new Set(obj[k])]; return obj; };
    const uniqJSON = (obj) => {
      for (const k of Object.keys(obj)) {
        const seenK = new Set();
        obj[k] = obj[k].filter((v) => { const j = JSON.stringify(v); if (seenK.has(j)) return false; seenK.add(j); return true; });
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
      ghide: [...ghide],
      ehide: [...ehide],
      docAllow: [...docAllow],
    };
    fs.writeFileSync(path.join(ROOT, 'data', `${list.id}.json`), JSON.stringify(cosmetic));

    // Scriptlety → pliki JS uruchamiane w świecie MAIN. Dzielimy je na kawałki
    // według domeny, żeby na danej stronie ładowała się tylko mała część danych.
    for (const k of Object.keys(scriptHosts)) scriptHosts[k] = [...new Set(scriptHosts[k])];
    for (const k of Object.keys(scriptExcept)) scriptExcept[k] = [...new Set(scriptExcept[k])];
    const hosts = Object.keys(scriptHosts);
    for (const old of fs.readdirSync(path.join(ROOT, 'scriptlets'))) {
      if (old.startsWith(list.id + '-') || old === list.id + '.js') fs.unlinkSync(path.join(ROOT, 'scriptlets', old));
    }
    const shardCount = Math.max(1, Math.min(32, Math.ceil(hosts.length / 1000)));
    const shards = Array.from({ length: shardCount }, () => ({ hosts: {}, calls: [], callMap: new Map() }));
    const hash = (str) => { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; };
    for (const h of hosts) {
      const base = h.endsWith('.*') ? h.slice(0, -2).split('.').pop() : h.split('.').slice(-2, -1)[0] || h;
      const shard = shards[hash(base) % shardCount];
      shard.hosts[h] = scriptHosts[h].map((i) => {
        let j = shard.callMap.get(i);
        if (j === undefined) { j = shard.calls.length; shard.calls.push(calls[i]); shard.callMap.set(i, j); }
        return j;
      });
    }
    const scriptletFiles = [];
    let matchCount = 0;
    shards.forEach((shard, n) => {
      const shardHosts = Object.keys(shard.hosts);
      if (!shardHosts.length) return;
      const matches = [...new Set(shardHosts.flatMap(hostPatterns))].sort();
      matchCount += matches.length;
      const file = `scriptlets/${list.id}-${n}.js`;
      const js = `/* Tarcza – scriptlety listy "${list.name}" (część ${n + 1}/${shardCount}). Plik generowany przez tools/build.mjs. */
(function () {
'use strict';
const CALLS = ${JSON.stringify(shard.calls)};
const HOSTS = ${JSON.stringify(shard.hosts)};
const EXCEPT = ${JSON.stringify(scriptExcept)};
${scriptletLib}
runForHost(CALLS, HOSTS, EXCEPT);
})();
`;
      fs.writeFileSync(path.join(ROOT, file), js);
      scriptletFiles.push({ file, matches });
    });
    fs.writeFileSync(path.join(ROOT, 'data', `${list.id}.scriptlets.json`), JSON.stringify(scriptletFiles));
    const old = path.join(ROOT, 'data', `${list.id}.matches.json`);
    if (fs.existsSync(old)) fs.unlinkSync(old);

    summary.push({
      id: list.id,
      name: list.name,
      desc: list.desc,
      enabledByDefault: list.enabled,
      networkRules: ordered.length,
      networkFilters: [...hostGroups.values()].reduce((n, g) => n + g.domains.size, 0) + ruleMap.size,
      cosmeticFilters: cosmeticCount,
      scriptletFilters: calls.length,
      scriptletPatterns: matchCount,
    });
    console.log(`${list.id.padEnd(11)} reguły DNR: ${String(ordered.length).padStart(6)} (regex: ${regexCount})  kosmetyczne: ${String(cosmeticCount).padStart(6)}  scriptlety: ${calls.length} na ${hosts.length} domenach (${scriptletFiles.length} plików, ${matchCount} wzorców)`);
  }

  fs.writeFileSync(path.join(ROOT, 'data', 'lists.json'), JSON.stringify(summary, null, 1));

  // Uaktualnij manifest
  const manifestPath = path.join(ROOT, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.declarative_net_request = { rule_resources: ruleResources };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`\nFiltry sieciowe: ${stats.network} przyjęte, ${stats.skippedNetwork} pominięte (nieobsługiwane w MV3)`);
  console.log(`Filtry kosmetyczne/scriptlety: ${stats.cosmetic} przyjęte, ${stats.skippedCosmetic} pominięte`);
}

build();
