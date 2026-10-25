// test:polish-sites --gap-mode: build testowy bez Polskich Filtrów (MajkiIT / Certyficate IT),
// wyłącznie w katalogu tymczasowym; pozostałe listy i ChromeBlock Polish Supplement bez zmian.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { LISTS, LISTS_DIR, ROOT } from '../../tools/lists-config.mjs';
import { EXTENSION_ENTRIES, loadPlaywright } from '../../tools/chromium-smoke.mjs';
import { gapLists, buildGapExtension, parseArgs, run, GAP_MODE_LABEL, UPSTREAM_POLISH_SOURCE } from '../../tools/polish-sites/test-polish-sites.mjs';
import { formatReport } from '../../tools/polish-sites/analyze.mjs';

const hash = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const repoFiles = () => ['manifest.json', 'data/lists.json', ...LISTS.map((l) => `rules/${l.id}.json`), ...LISTS.map((l) => `data/${l.id}.json`)];
const snapshotRepo = () => Object.fromEntries(repoFiles().map((f) => [f, hash(path.join(ROOT, f))]));

test('gapLists: ads bez źródeł MajkiIT; EasyList, uBO i ChromeBlock Polish Supplement obecne; inne listy bez zmian', () => {
  const normal = LISTS.find((l) => l.id === 'ads');
  const gap = gapLists().find((l) => l.id === 'ads');
  const files = gap.sources.map((s) => s.file);
  assert.ok(normal.sources.some((s) => UPSTREAM_POLISH_SOURCE.test(s.file)), 'normalny build nadal ma Polskie Filtry');
  assert.ok(!files.some((f) => UPSTREAM_POLISH_SOURCE.test(f)), 'GAP: brak pl/*');
  assert.deepEqual(files, normal.sources.filter((s) => !s.file.startsWith('pl/')).map((s) => s.file), 'pozostałe źródła ads w tej samej kolejności');
  for (const f of ['easylist/easylist.txt', 'ubo/filters.txt', 'ubo/quick-fixes.txt', 'ubo/unbreak.txt', 'chromeblock-polish/chromeblock-polish.txt']) assert.ok(files.includes(f), f);
  assert.deepEqual(gap.sources.filter((s) => s.trusted).map((s) => s.file), normal.sources.filter((s) => s.trusted).map((s) => s.file), 'flagi trusted bez zmian');
  for (const l of LISTS.filter((x) => x.id !== 'ads')) assert.equal(gapLists().find((x) => x.id === l.id), l, `${l.id} bez zmian`);
  assert.match(gap.desc, /GAP/);
  assert.ok(LISTS.find((l) => l.id === 'ads').sources.some((s) => s.file === 'pl/adblock.txt'), 'konfiguracja produkcyjna nie została zmieniona');
});

test('argumenty: --gap-mode', () => {
  assert.equal(parseArgs(['--gap-mode']).gap, true);
  assert.equal(parseArgs([]).gap, false);
  assert.match(formatReport({ date: 'd', version: 'v', modeLabel: GAP_MODE_LABEL, adsSources: ['easylist/easylist.txt'], sites: [] }), /^MODE: GAP — without MajkiIT Polish Filters$/m);
  assert.equal(GAP_MODE_LABEL, 'GAP — without MajkiIT Polish Filters');
});

test('build GAP: tylko katalog tymczasowy, działa BEZ plików pl/ (nie są wczytywane), inne listy identyczne z repo', { timeout: 600_000 }, () => {
  const before = snapshotRepo();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-gap-test-'));
  try {
    // katalog list BEZ pl/ – gdyby build GAP sięgał po Polskie Filtry, nie dałby takiego samego wyniku
    const lists = path.join(tmp, 'lists');
    fs.mkdirSync(lists);
    for (const d of fs.readdirSync(LISTS_DIR)) if (d !== 'pl') fs.symlinkSync(path.join(LISTS_DIR, d), path.join(lists, d));
    const ext = path.join(tmp, 'ext');
    fs.mkdirSync(ext);
    for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
    const sources = buildGapExtension(ext, { listsDir: lists });
    assert.ok(!sources.some((f) => f.startsWith('pl/')));
    assert.ok(sources.includes('chromeblock-polish/chromeblock-polish.txt'));
    const meta = JSON.parse(fs.readFileSync(path.join(ext, 'data/lists.json'), 'utf8'));
    const normalMeta = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/lists.json'), 'utf8'));
    const ads = meta.find((m) => m.id === 'ads');
    const adsNormal = normalMeta.find((m) => m.id === 'ads');
    assert.match(ads.desc, /GAP/);
    assert.ok(ads.networkFilters < adsNormal.networkFilters && ads.cosmeticFilters < adsNormal.cosmeticFilters, 'ads w GAP mniejsze niż w normalnym buildzie');
    assert.ok(ads.networkFilters > 0.9 * adsNormal.networkFilters, 'EasyList i uBO nadal w ads');
    for (const l of LISTS.filter((x) => x.id !== 'ads')) {
      assert.equal(hash(path.join(ext, `rules/${l.id}.json`)), hash(path.join(ROOT, `rules/${l.id}.json`)), `rules/${l.id}.json identyczne`);
      assert.equal(hash(path.join(ext, `data/${l.id}.json`)), hash(path.join(ROOT, `data/${l.id}.json`)), `data/${l.id}.json identyczne`);
    }
    assert.notEqual(hash(path.join(ext, 'rules/ads.json')), hash(path.join(ROOT, 'rules/ads.json')));
    assert.throws(() => buildGapExtension(ROOT), /nie może nadpisać repozytorium/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  assert.deepEqual(snapshotRepo(), before, 'pliki repozytorium bez zmian');
});

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

test('Chromium (fixture) --gap-mode: raport MODE GAP, ChromeBlock działa, katalog tymczasowy usunięty, repo bez zmian', { skip, timeout: 600_000 }, async () => {
  const before = snapshotRepo();
  const r = await run({ fixture: true, gap: true, write: false, log: () => {}, domains: ['fixture-a.example', 'fixture-b.example'] });
  assert.equal(r.mode, 'gap');
  assert.equal(r.modeLabel, GAP_MODE_LABEL);
  assert.match(formatReport(r), /^MODE: GAP — without MajkiIT Polish Filters$/m);
  assert.ok(!r.adsSources.some((f) => f.startsWith('pl/')));
  assert.ok(r.adsSources.includes('chromeblock-polish/chromeblock-polish.txt'));
  const [a, b] = r.sites;
  assert.equal(a.verdict.status, 'OK');
  assert.ok(a.requests.blocked >= 1, 'EasyList / uBO nadal blokują');
  assert.deepEqual(a.observations.map((o) => o.kind), ['empty-ad-container', 'ad-label']);
  assert.deepEqual(a.unblockedThirdPartyHosts, []);
  assert.equal(b.jsErrors.count, 1);
  assert.equal(fs.existsSync(r.extDir), false, 'tymczasowe rozszerzenie usunięte');
  assert.deepEqual(snapshotRepo(), before, 'pliki repozytorium bez zmian');
});
