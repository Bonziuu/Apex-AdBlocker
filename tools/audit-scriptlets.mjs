#!/usr/bin/env node
// ChromeBlock – audyt zgodności scriptletów (+js) z aktualnymi listami filtrów.
//
//   node tools/audit-scriptlets.mjs                 raport tekstowy
//   node tools/audit-scriptlets.mjs --json          raport JSON (stdout)
//   node tools/audit-scriptlets.mjs --update-youtube-baseline
//        zapisuje aktualne braki YouTube do youtube/known-gaps.json (świadoma decyzja!)
//
// Raport jest deterministyczny (stała kolejność sortowania).

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { classifyLine, parseCosmeticFilter } from '../shared/parser.js';
import { canonicalScriptletName } from '../shared/scriptlet-specs.js';
import { LISTS, ROOT, loadList } from './lists-config.mjs';
import {
  YOUTUBE_STRICT_LISTS, youtubeHostsAffected, compareWithBaseline,
} from '../youtube/compatibility.js';

export const BASELINE_PATH = path.join(ROOT, 'youtube', 'known-gaps.json');

export function readBaseline() {
  try { return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8')); } catch { return { gaps: [] }; }
}

/**
 * Analizuje wszystkie filtry +js(...) we wskazanych listach.
 * Zwraca listę wpisów: {list, line, source, name, canonical, status, reason, domains, youtube[]}.
 */
export function collectScriptletFilters(lists = LISTS, opts = {}) {
  const entries = [];
  for (const list of lists) {
    const seen = new Set();
    for (const { line, trusted, source } of loadList(list, opts)) {
      if (!line || seen.has(line)) continue;
      const c = classifyLine(line);
      if (c.kind !== 'cosmetic' || c.sep.includes('@')) continue;
      if (!c.body.trim().startsWith('+js(')) continue;
      seen.add(line);
      const f = parseCosmeticFilter(c, { trusted });
      const base = { list: list.id, listEnabledByDefault: list.enabled, line, source };
      if (!f) {
        const name = rawNameOf(c.body);
        entries.push({ ...base, name, canonical: canonicalScriptletName(name), status: 'unsupported',
          reason: 'nieobsługiwane domeny filtra (np. "domena>>", regex)', domains: [], youtube: [] });
        continue;
      }
      const support = f.support;
      entries.push({
        ...base,
        name: support.name,
        canonical: support.canonical,
        status: support.status,
        reason: support.reason,
        domains: f.include,
        youtube: youtubeHostsAffected(f.include, f.exclude),
      });
    }
  }
  return entries;
}

function rawNameOf(body) {
  const m = /^\+js\(\s*['"`]?([^,'"`)]+)/.exec(body.trim());
  return m ? m[1].trim().replace(/\.js$/, '') : '?';
}

function summarize(entries) {
  const s = { total: entries.length, supported: 0, partial: 0, unsupported: 0 };
  for (const e of entries) s[e.status]++;
  return s;
}

/** Grupuje wpisy według scriptletu (nazwa kanoniczna albo surowa). */
export function groupByScriptlet(entries) {
  const groups = new Map();
  for (const e of entries) {
    const key = e.canonical || e.name;
    let g = groups.get(key);
    if (!g) {
      g = { scriptlet: key, aliases: new Set(), total: 0, supported: 0, partial: 0, unsupported: 0,
        youtube: 0, domains: new Map(), reasons: new Map(), examples: {} };
      groups.set(key, g);
    }
    g.aliases.add(e.name);
    g.total++;
    g[e.status]++;
    if (e.youtube.length) g.youtube++;
    for (const d of e.domains.slice(0, 3)) g.domains.set(d, (g.domains.get(d) || 0) + 1);
    if (e.status !== 'supported') g.reasons.set(e.reason, (g.reasons.get(e.reason) || 0) + 1);
    if (!g.examples[e.status]) g.examples[e.status] = e.line;
  }
  return [...groups.values()]
    .map((g) => ({
      scriptlet: g.scriptlet,
      aliases: [...g.aliases].sort(),
      total: g.total,
      supported: g.supported,
      partial: g.partial,
      unsupported: g.unsupported,
      youtube: g.youtube,
      status: g.supported === g.total ? 'supported' : g.supported === 0 && g.partial === 0 ? 'unsupported' : 'partial',
      topDomains: [...g.domains.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 5),
      reasons: [...g.reasons.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
      examples: g.examples,
    }))
    .sort((a, b) => b.total - a.total || a.scriptlet.localeCompare(b.scriptlet));
}

export function youtubeReport(entries, baseline = readBaseline()) {
  const critical = entries.filter((e) => e.youtube.length && YOUTUBE_STRICT_LISTS.includes(e.list));
  // ten sam filtr może wystąpić w kilku plikach – liczymy unikalne linie
  const unique = [];
  const seen = new Set();
  for (const e of critical) if (!seen.has(e.line)) { seen.add(e.line); unique.push(e); }
  const other = entries.filter((e) => e.youtube.length && !YOUTUBE_STRICT_LISTS.includes(e.list));
  const cmp = compareWithBaseline(unique, baseline);
  return { critical: unique, summary: summarize(unique), other, otherSummary: summarize(other), ...cmp };
}

export function runAudit(opts = {}) {
  const entries = collectScriptletFilters(opts.lists || LISTS, opts);
  return {
    summary: summarize(entries),
    byList: Object.fromEntries((opts.lists || LISTS).map((l) => [l.id, summarize(entries.filter((e) => e.list === l.id))])),
    groups: groupByScriptlet(entries),
    general: summarize(entries.filter((e) => !e.youtube.length)),
    youtube: youtubeReport(entries, opts.baseline),
    entries,
  };
}

// ---------------------------------------------------------------------------

function pct(n, total) { return total ? `${((n / total) * 100).toFixed(1)}%` : '0%'; }
function cut(s, n = 160) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }

export function formatReport(r) {
  const out = [];
  const s = r.summary;
  out.push('SCRIPTLET COMPATIBILITY', '');
  out.push(`Total scriptlet filters: ${s.total}`);
  out.push(`Fully supported:         ${s.supported} (${pct(s.supported, s.total)})`);
  out.push(`Partially supported:     ${s.partial} (${pct(s.partial, s.total)})  ← znany scriptlet, nieobsługiwany wariant – NIE wykonywany`);
  out.push(`Unsupported:             ${s.unsupported} (${pct(s.unsupported, s.total)})  ← NIE wykonywany`);
  out.push('');
  out.push('Per list:');
  for (const [id, v] of Object.entries(r.byList)) {
    out.push(`  ${id.padEnd(11)} total ${String(v.total).padStart(5)}  supported ${String(v.supported).padStart(5)}  partial ${String(v.partial).padStart(4)}  unsupported ${String(v.unsupported).padStart(4)}`);
  }

  const y = r.youtube;
  out.push('', '='.repeat(72), 'YouTube critical filters', '='.repeat(72));
  out.push(`Listy: domyślnie włączone (strict). Hosty: youtube.com, www/m/music.youtube.com, youtube-nocookie.com`);
  out.push(`YouTube compatibility:`);
  out.push(`  ${y.summary.total} scriptlet rules`);
  out.push(`  ${y.summary.supported} supported`);
  out.push(`  ${y.summary.partial} partial (not executed)`);
  out.push(`  ${y.summary.unsupported} unsupported (not executed)`);
  if (y.unsupported.length) {
    out.push('', 'Braki:');
    for (const e of y.unsupported) {
      const tag = y.newGaps.includes(e) ? 'NEW ' : 'KNOWN';
      out.push(`  [${tag}] ${e.status.toUpperCase()} ${e.name}: ${e.reason}`);
      out.push(`         ${cut(e.line)}`);
    }
  }
  if (y.newGaps.length) out.push('', `!!! ${y.newGaps.length} nowych nieobsługiwanych krytycznych filtrów YouTube (brak w youtube/known-gaps.json)`);
  if (y.resolved.length) out.push('', `Info: ${y.resolved.length} wpisów w known-gaps.json jest już nieaktualnych (filtr obsługiwany lub usunięty z list).`);
  out.push('', `Filtry YouTube w listach domyślnie wyłączonych (informacyjnie): ${y.otherSummary.total} (supported ${y.otherSummary.supported}, partial ${y.otherSummary.partial}, unsupported ${y.otherSummary.unsupported})`);

  out.push('', '='.repeat(72), 'General filters (poza YouTube)', '='.repeat(72));
  const g = r.general;
  out.push(`  total ${g.total}, supported ${g.supported} (${pct(g.supported, g.total)}), partial ${g.partial}, unsupported ${g.unsupported}`);

  out.push('', '='.repeat(72), 'Scriptlets', '='.repeat(72));
  out.push(`${'scriptlet'.padEnd(34)} ${'occ.'.padStart(6)} ${'ok'.padStart(6)} ${'part.'.padStart(6)} ${'unsup.'.padStart(6)}  status`);
  for (const gr of r.groups) {
    out.push(`${cut(gr.scriptlet, 34).padEnd(34)} ${String(gr.total).padStart(6)} ${String(gr.supported).padStart(6)} ${String(gr.partial).padStart(6)} ${String(gr.unsupported).padStart(6)}  ${gr.status}`);
  }

  const problems = r.groups.filter((gr) => gr.status !== 'supported');
  out.push('', '='.repeat(72), 'UNSUPPORTED / PARTIAL – szczegóły', '='.repeat(72));
  for (const gr of problems) {
    out.push('', `${gr.status === 'unsupported' ? 'UNSUPPORTED' : 'PARTIAL'}: ${gr.scriptlet}${gr.aliases.length > 1 || gr.aliases[0] !== gr.scriptlet ? ` (${gr.aliases.join(', ')})` : ''}`);
    out.push(`  occurrences: ${gr.total} (not executed: ${gr.partial + gr.unsupported})${gr.youtube ? `, YouTube: ${gr.youtube}` : ''}`);
    if (gr.topDomains.length) out.push(`  domains: ${gr.topDomains.map(([d, n]) => `${d}: ${n}`).join(', ')}`);
    for (const [reason, n] of gr.reasons.slice(0, 4)) out.push(`  reason (${n}): ${reason}`);
    const ex = gr.examples.partial || gr.examples.unsupported;
    if (ex) out.push(`  example: ${cut(ex)}`);
  }
  return out.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  const report = runAudit();
  if (args.includes('--update-youtube-baseline')) {
    const gaps = report.youtube.unsupported.map((e) => ({ filter: e.line, scriptlet: e.name, status: e.status, reason: e.reason }));
    fs.writeFileSync(BASELINE_PATH, JSON.stringify({
      note: 'Krytyczne filtry YouTube, o których wiadomo, że ChromeBlock ich NIE wykonuje. Build i testy zgłaszają błąd tylko dla braków spoza tej listy. Aktualizuj świadomie: node tools/audit-scriptlets.mjs --update-youtube-baseline',
      gaps,
    }, null, 2) + '\n');
    console.log(`Zapisano ${gaps.length} znanych braków do youtube/known-gaps.json`);
    return;
  }
  if (args.includes('--json')) {
    const { entries, ...rest } = report;
    process.stdout.write(JSON.stringify(rest, null, 2) + '\n');
    return;
  }
  console.log(formatReport(report));
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main();
