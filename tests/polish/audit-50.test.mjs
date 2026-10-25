// Audyt pokrycia 50 polskich stron (--audit-50): zestaw domen, argumenty, podsumowanie, brak generowania reguł.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT } from '../../tools/lists-config.mjs';
import { parseArgs, MAX_SITES, MAX_AUDIT_SITES, AUDIT_50_FILE } from '../../tools/polish-sites/test-polish-sites.mjs';
import { summarize, formatReport, siteUrl } from '../../tools/polish-sites/analyze.mjs';

const audit = JSON.parse(fs.readFileSync(AUDIT_50_FILE, 'utf8'));
const DEFAULT_20 = ['onet.pl', 'wp.pl', 'interia.pl', 'o2.pl', 'gazeta.pl', 'tvn24.pl', 'money.pl', 'pudelek.pl', 'rmf24.pl', 'polsatnews.pl',
  'sport.pl', 'wykop.pl', 'filmweb.pl', 'natemat.pl', 'gry-online.pl', 'businessinsider.com.pl', 'plotek.pl', 'fakt.pl', 'se.pl', 'bankier.pl'];

test('sites-audit-50.json: dokładnie 50 unikalnych, poprawnych domen; kategorie pokrywają cały zestaw', () => {
  assert.equal(audit.sites.length, 50);
  assert.equal(new Set(audit.sites).size, 50, 'bez duplikatów');
  for (const d of audit.sites) assert.ok(siteUrl(d), `poprawna domena: ${d}`);
  for (const d of audit.sites) assert.match(d, /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, `${d}: sama domena`);
  // bez subdomen tego samego serwisu
  const base = (d) => d.split('.').slice(-2).join('.');
  const bases = audit.sites.map((d) => (/\.(com|net|org)\.pl$/.test(d) ? d.split('.').slice(-3).join('.') : base(d)));
  assert.equal(new Set(bases).size, 50, 'bez subdomen tego samego serwisu');
  const fromCats = Object.values(audit.categories).flat();
  assert.deepEqual([...fromCats].sort(), [...audit.sites].sort(), 'każda domena w dokładnie jednej kategorii');
  assert.ok(Object.keys(audit.categories).length >= 8, 'kilka kategorii');
  assert.equal(audit.sites.length, MAX_AUDIT_SITES);
});

test('dotychczasowe domeny audytu nadal obecne; domyślna próbka 20 stron bez zmian', () => {
  for (const d of [...DEFAULT_20, 'jbzd.com.pl']) assert.ok(audit.sites.includes(d), d);
  const def = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/polish-sites/sites.json'), 'utf8')).sites;
  assert.deepEqual(def, DEFAULT_20, 'sites.json bez zmian');
  assert.deepEqual(parseArgs([]).domains, DEFAULT_20);
});

test('--audit-50: dokładnie zestaw z pliku (kolejność, 50 domen); bez flagi limit 20', () => {
  const o = parseArgs(['--gap-mode', '--evidence', '--audit-50']);
  assert.deepEqual(o.domains, audit.sites);
  assert.deepEqual([o.gap, o.evidence, o.audit50], [true, true, true]);
  assert.deepEqual(parseArgs(['--audit-50', 'inna.pl']).domains, audit.sites, 'domeny obok flagi ignorowane');
  assert.equal(parseArgs(audit.sites).domains.length, MAX_SITES, 'domeny podane ręcznie: nadal maks. 20');
  assert.deepEqual(parseArgs(['--fixture', '--audit-50']).domains.length, 5, 'fixture ma pierwszeństwo (strony testowe)');
});

test('podsumowanie: statusy, obserwacje, likely_false_positive, domeny do przeglądu (bez decyzji o regułach)', () => {
  const site = (domain, status, obs) => ({ domain, verdict: { status, reason: '' }, requests: { total: 1, thirdParty: 0, blocked: 0 }, jsErrors: { count: 0, samples: [] }, consoleErrors: 0, unblockedThirdPartyHosts: [], observations: obs });
  const o = (fp) => ({ id: 'x#1', kind: 'ad-label', label: 'reklama', size: '1x1', container: 'div', likely_false_positive: fp, ...(fp ? { false_positive_reasons: ['w stopce (footer)'] } : {}) });
  const sites = [
    site('a.pl', 'OK', [o(false), o(true)]),
    site('b.pl', 'OK', [o(true)]),
    site('c.pl', 'BROKEN', []),
    site('d.pl', 'UNREACHABLE', []),
    site('e.pl', 'ERROR', []),
    site('f.pl', 'OK', [o(false)]),
  ];
  const s = summarize(sites);
  assert.deepEqual(s, { sites: 6, byStatus: { OK: 3, BROKEN: 1, UNREACHABLE: 1, ERROR: 1 }, observations: 4, likelyFalsePositive: 2, domainsToReview: ['a.pl', 'f.pl'] });
  const txt = formatReport({ date: 'd', version: 'v', sites, summary: s });
  assert.match(txt, /^Podsumowanie$/m);
  assert.match(txt, /^Strony: 6 – OK 3, BROKEN 1, UNREACHABLE 1, ERROR 1$/m);
  assert.match(txt, /^Obserwacje: 4 \(likely_false_positive: 2\)$/m);
  assert.match(txt, /^Domeny z co najmniej jedną obserwacją do przeglądu: 2 – a\.pl, f\.pl$/m);
  assert.doesNotMatch(txt, /reguła:|##|\+js\(/, 'raport nie proponuje reguł');
});

test('brak automatycznego generowania reguł: tester nie zapisuje listy ChromeBlock Polish ani provenance', () => {
  const src = ['tools/polish-sites/test-polish-sites.mjs', 'tools/polish-sites/analyze.mjs'].map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  assert.doesNotMatch(src, /fs\.\w+\([^)]*(chromeblock-polish|provenance)/, 'tester nie czyta ani nie zapisuje plików listy');
  assert.doesNotMatch(src, /tools[\/\\]lists|LISTS_DIR/, 'tester nie sięga do katalogu list');
  const writes = [...src.matchAll(/(writeFileSync|appendFileSync)\(([^,]+)/g)].map((m) => m[2]);
  for (const w of writes) assert.match(w, /outDir|path\.join\(outDir|evidenceDir/, `zapis tylko do katalogu wyników: ${w}`);
  const hash = (f) => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, f))).digest('hex');
  assert.ok(hash('tools/lists/chromeblock-polish/chromeblock-polish.txt') && hash('tools/lists/chromeblock-polish/provenance.json'));
});
