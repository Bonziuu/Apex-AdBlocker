#!/usr/bin/env node
// Genuine extension UI screenshots only. Never substitute a mocked Chrome API
// or a managed system browser when extension execution is unavailable.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { ROOT, EXTENSION_ENTRIES, SYNC_STEPS, COMPONENTS, loadPlaywright } from './chromium-smoke.mjs';
import { listFiles, validatePackage } from './package-dev.mjs';

export const GENERATOR = 'tools/webstore-screenshots.mjs';
export const VIEWPORT = Object.freeze({ width: 1280, height: 800 });
const EXAMPLE_FILTERS = {
  pl: '! Przykładowy filtr dla fikcyjnej domeny example.com\nexample.com##.reklama\n',
  en: '! Example filter for the fictional domain example.com\nexample.com##.advertisement\n',
};

export function parseArgs(args) {
  const options = { extensionDir: ROOT, outDir: path.join(ROOT, 'docs/webstore/screenshots'), locale: 'pl' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help') return { help: true };
    if (args[i] === '--locale') {
      if (!['pl', 'en'].includes(args[i + 1])) throw new Error('Locale must be pl or en');
      options.locale = args[++i];
      continue;
    }
    const field = { '--dir': 'extensionDir', '--out': 'outDir' }[args[i]];
    if (!field || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Niepoprawny argument: ${args[i]}`);
    options[field] = path.resolve(args[++i]);
  }
  return options;
}

function hashPackage(dir) {
  const hash = crypto.createHash('sha256');
  for (const file of listFiles(dir)) hash.update(file).update('\0').update(fs.readFileSync(path.join(dir, file))).update('\0');
  return hash.digest('hex');
}

/**
 * Stan katalogu: ścieżka względna → rodzaj i zawartość (plik: SHA-256, link: cel, katalog).
 * Obejmuje każdy wpis (także puste katalogi i dowiązania), żeby wykryć każdą zmianę.
 */
export function snapshotTree(dir, entries = null) {
  const out = new Map();
  const walk = (abs, rel) => {
    const st = fs.lstatSync(abs);
    if (st.isSymbolicLink()) out.set(rel, `symlink:${fs.readlinkSync(abs)}`);
    else if (st.isDirectory()) {
      if (rel) out.set(rel, 'dir');
      for (const name of fs.readdirSync(abs).sort()) walk(path.join(abs, name), rel ? `${rel}/${name}` : name);
    } else if (st.isFile()) out.set(rel, `file:${crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex')}`);
    else out.set(rel, 'other');
  };
  if (entries) { for (const e of entries) if (fs.existsSync(path.join(dir, e))) walk(path.join(dir, e), e); }
  else walk(dir, '');
  return out;
}

/** Katalog, w którym Chrome zapisuje zindeksowane rulesety DNR rozszerzenia rozpakowanego. */
export const INDEXED_RULESETS_DIR = '_metadata/generated_indexed_rulesets';

/**
 * Jedyne pliki, które Chrome może utworzyć w kopii rozszerzenia podczas zrzutów: zindeksowane statyczne
 * rulesety DNR `_rulesetN`, N = 1…liczba rulesetów w manifeście (kolejność rule_resources).
 */
export function expectedRuntimeArtifacts(manifest) {
  const resources = manifest?.declarative_net_request?.rule_resources;
  const count = Array.isArray(resources) ? resources.length : 0;
  return new Set(Array.from({ length: count }, (_, i) => `${INDEXED_RULESETS_DIR}/_ruleset${i + 1}`));
}

/**
 * Porównuje stan kopii rozszerzenia po działaniu Chromium z migawką sprzed uruchomienia.
 * Dozwolone są tylko nowe zwykłe pliki z expectedRuntimeArtifacts() i ich katalogi nadrzędne.
 * Każda zmiana, usunięcie lub inny nowy wpis to błąd. Zwraca listę problemów i znalezione artefakty.
 */
export function compareRuntimeSnapshot(before, after, manifest) {
  return compareSnapshots(before, after, expectedRuntimeArtifacts(manifest));
}

/** Ścisłe porównanie migawek; `allowed` – pliki, które wolno dodać (domyślnie żadne). */
export function compareSnapshots(before, after, allowed = new Set()) {
  const allowedDirs = new Set(allowed.size ? ['_metadata', INDEXED_RULESETS_DIR] : []);
  const problems = [];
  const artifacts = [];
  for (const [rel, state] of before) {
    if (!after.has(rel)) problems.push(`usunięto: ${rel}`);
    else if (after.get(rel) !== state) problems.push(`zmieniono: ${rel}`);
  }
  for (const [rel, state] of after) {
    if (before.has(rel)) continue;
    if (allowed.has(rel) && state.startsWith('file:')) artifacts.push(rel);
    else if (allowedDirs.has(rel) && state === 'dir') continue;
    else problems.push(`nieoczekiwany nowy wpis: ${rel}`);
  }
  return { problems, artifacts: artifacts.sort() };
}

function outputIsOwned(outDir) {
  if (!fs.existsSync(outDir)) return;
  if (!fs.lstatSync(outDir).isDirectory()) throw new Error(`Odmowa zastąpienia ścieżki: ${outDir}`);
  let previous;
  try { previous = JSON.parse(fs.readFileSync(path.join(outDir, 'metadata.json'), 'utf8')); } catch { /* unowned output */ }
  if (previous?.generator !== GENERATOR) throw new Error(`Katalog zawiera własne pliki użytkownika: ${outDir}. Wybierz nowy --out.`);
  const owned = new Set(['metadata.json', ...(previous.images || []).map((image) => image.file)]);
  for (const entry of fs.readdirSync(outDir)) {
    const file = path.join(outDir, entry);
    if (!owned.has(entry) || !fs.lstatSync(file).isFile()) throw new Error(`Katalog zawiera plik spoza poprzednich wyników generatora: ${file}. Wybierz nowy --out.`);
  }
}

async function waitForHealth(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  do {
    const health = await page.evaluate(() => chrome.runtime.sendMessage({ type: 'health:get' })).catch(() => null);
    if (health) {
      const failed = [
        ...SYNC_STEPS.filter((step) => health.sync?.[step]?.status === 'error').map((step) => `sync ${step}`),
        ...COMPONENTS.filter((component) => health.components?.[component]?.status === 'error').map((component) => `component ${component}`),
      ];
      if (failed.length) throw new Error(`Rozszerzenie zgłosiło błąd: ${failed.join(', ')}`);
      if (SYNC_STEPS.every((step) => health.sync?.[step]?.status === 'ok')) return health;
    }
    await page.waitForTimeout(500);
  } while (Date.now() < deadline);
  throw new Error('Synchronizacja rozszerzenia nie zakończyła się; zrzuty nie zostały zapisane.');
}

/** Copies the actual extension to an empty profile; replaces only owned outputs after every capture succeeds. */
export async function captureScreenshots({
  extensionDir = ROOT,
  outDir = path.join(ROOT, 'docs/webstore/screenshots'),
  browserType,
  locale = 'pl',
  syncTimeoutMs = 180_000,
} = {}) {
  if (!['pl', 'en'].includes(locale)) throw new Error('Locale must be pl or en');
  const browserLocale = locale === 'pl' ? 'pl-PL' : 'en-US';
  const exampleFilter = EXAMPLE_FILTERS[locale];
  extensionDir = path.resolve(extensionDir);
  outDir = path.resolve(outDir);
  outputIsOwned(outDir);
  const chromium = browserType === undefined ? await loadPlaywright() : browserType;
  let executable = '';
  try { executable = chromium?.executablePath() || ''; } catch { /* reported below */ }
  if (!chromium || !executable || !fs.existsSync(executable)) {
    const error = new Error('Brak przeglądarki Playwright. Uruchom npx --no-install playwright install chromium po zastosowaniu wymaganych domen sieciowych. Nie utworzono zastępczych obrazów.');
    error.code = 'BROWSER_UNAVAILABLE';
    throw error;
  }
  if (!fs.existsSync(path.join(extensionDir, 'manifest.json'))) throw new Error('Brak manifest.json w katalogu rozszerzenia.');
  fs.mkdirSync(path.dirname(outDir), { recursive: true });
  const work = fs.mkdtempSync(path.join(path.dirname(outDir), '.webstore-screenshots-'));
  const extDir = path.join(work, 'extension');
  const staged = path.join(work, 'next');
  const backup = path.join(work, 'previous');
  let context;
  let keepBackup = false;
  try {
    fs.mkdirSync(extDir);
    fs.mkdirSync(staged);
    for (const entry of EXTENSION_ENTRIES) {
      const src = path.join(extensionDir, entry);
      if (fs.existsSync(src)) fs.cpSync(src, path.join(extDir, entry), { recursive: true });
    }
    const problems = validatePackage(extDir);
    if (problems.length) throw new Error(`Niepoprawna paczka: ${problems.join('; ')}`);
    const manifest = JSON.parse(fs.readFileSync(path.join(extDir, 'manifest.json'), 'utf8'));
    // Przed uruchomieniem Chromium: kopia musi być bajtowo zgodna ze źródłem (te same wpisy paczki).
    const sourceBefore = snapshotTree(extensionDir, EXTENSION_ENTRIES);
    const copyBefore = snapshotTree(extDir);
    const copyMismatch = compareSnapshots(sourceBefore, copyBefore).problems;
    if (copyMismatch.length) throw new Error(`Kopia paczki różni się od źródła: ${copyMismatch.slice(0, 5).join('; ')}`);
    const sourceContentsSha256 = hashPackage(extDir);
    context = await chromium.launchPersistentContext(path.join(work, 'profile'), {
      headless: true, channel: 'chromium', viewport: VIEWPORT, deviceScaleFactor: 1, locale: browserLocale, colorScheme: 'light',
      env: { ...process.env, LANGUAGE: locale, LANG: locale === 'pl' ? 'pl_PL.UTF-8' : 'en_US.UTF-8' },
      args: [
        `--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`,
        `--lang=${locale}`,
        '--no-first-run', '--no-default-browser-check', '--disable-component-update',
        '--disable-background-networking', '--disable-sync', '--disable-default-apps',
      ],
    });
    await context.route(/^(https?|wss?):/, (route) => route.abort());
    let worker = context.serviceWorkers().find((w) => w.url().startsWith('chrome-extension://') && w.url().endsWith('/background.js'));
    if (!worker) worker = await context.waitForEvent('serviceworker', { predicate: (w) => w.url().startsWith('chrome-extension://') && w.url().endsWith('/background.js'), timeout: 30_000 });
    const id = new URL(worker.url()).host;
    const page = await context.newPage();
    await page.goto('chrome://extensions');
    const loaded = await page.evaluate(async (extensionId) => {
      const all = await chrome.developerPrivate.getExtensionsInfo();
      const extension = all.find((item) => item.id === extensionId);
      return extension ? {
        state: extension.state,
        errors: [...(extension.manifestErrors || []), ...(extension.runtimeErrors || [])].map((e) => e.message),
      } : null;
    }, id);
    if (!loaded || loaded.state !== 'ENABLED' || loaded.errors.length) throw new Error('Chromium nie zaakceptował rozszerzenia bez błędów.');
    const base = `chrome-extension://${id}/options/options.html`;
    await page.goto(base);
    if (await page.evaluate(() => document.documentElement.lang) !== locale) throw new Error(`Chrome did not select the requested UI language: ${locale}`);
    // jedna karta na każdą wbudowaną listę (ruleset w manifeście)
    await page.waitForFunction(() => document.querySelectorAll('#listContainer .card').length === chrome.runtime.getManifest().declarative_net_request.rule_resources.length);
    const health = await waitForHealth(page, syncTimeoutMs);
    const images = [];
    const capture = async (file, title) => {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.evaluate(async () => { await document.fonts.ready; });
      const destination = path.join(staged, file);
      await page.screenshot({ path: destination, type: 'png', fullPage: false, animations: 'disabled' });
      const bytes = fs.readFileSync(destination);
      if (bytes.readUInt32BE(16) !== VIEWPORT.width || bytes.readUInt32BE(20) !== VIEWPORT.height) throw new Error(`Niepoprawny rozmiar PNG: ${file}`);
      images.push({ file, title, width: VIEWPORT.width, height: VIEWPORT.height, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
    };
    await page.locator('[role="tab"][data-tab="protection"]').click();
    await capture('01-protection.png', 'Ochrona — rzeczywiste ustawienia świeżego profilu');
    await page.locator('[role="tab"][data-tab="filters"]').click();
    await page.locator('#userFilters:not([disabled])').fill(exampleFilter);
    await page.locator('#saveFilters').click();
    await page.waitForFunction(() => document.getElementById('filtersMsg').textContent.trim().length > 0);
    const saved = await page.evaluate(() => chrome.runtime.sendMessage({ type: 'options:get' }));
    if (saved.userFilters !== exampleFilter || saved.userErrors?.length) throw new Error('Przykładowy filtr nie został poprawnie zapisany w rozszerzeniu.');
    await capture('02-user-filters.png', 'Moje filtry — jawnie oznaczony przykład dla example.com');
    await page.goto(base + '#backup');
    await page.locator('#backup[open]').waitFor();
    await page.locator('#exportSettings:not([disabled])').waitFor();
    await waitForHealth(page, syncTimeoutMs);
    await capture('03-settings-backup.png', 'Kopia ustawień — rzeczywisty interfejs eksportu i importu');
    const metadata = {
      generator: GENERATOR, generatedAt: new Date().toISOString(), product: manifest.name, extensionVersion: manifest.version,
      provenance: 'actual-extension-in-temporary-profile', mockedChromeApi: false, externalSitesVisited: false,
      sourceContentsSha256, viewport: VIEWPORT, locale: browserLocale, colorScheme: 'light',
      exampleUserFilter: exampleFilter, sync: Object.fromEntries(SYNC_STEPS.map((step) => [step, health.sync[step].status])), images,
      scope: 'Screenshots document the actual extension UI. They do not prove advertising effectiveness on external websites.',
    };
    await context.close();
    context = null;
    // Po zamknięciu Chromium: w kopii wolno pojawić się wyłącznie zindeksowanym rulesetom DNR z manifestu.
    const integrity = compareRuntimeSnapshot(copyBefore, snapshotTree(extDir), manifest);
    if (integrity.problems.length) throw new Error(`Kontrola integralności paczki nie przeszła: ${integrity.problems.slice(0, 10).join('; ')}`);
    const sourceChanges = compareSnapshots(sourceBefore, snapshotTree(extensionDir, EXTENSION_ENTRIES)).problems;
    if (sourceChanges.length) throw new Error(`Źródłowa paczka zmieniła się podczas zrzutów: ${sourceChanges.slice(0, 5).join('; ')}`);
    metadata.integrity = { status: 'PASS', checked: 'byte-for-byte snapshot before and after Chromium', allowedRuntimeArtifacts: integrity.artifacts };
    fs.writeFileSync(path.join(staged, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n');
    if (fs.existsSync(outDir)) fs.renameSync(outDir, backup);
    try { fs.renameSync(staged, outDir); } catch (error) {
      if (fs.existsSync(backup)) {
        try { fs.renameSync(backup, outDir); } catch { keepBackup = true; throw new Error(`Nie udało się przywrócić zrzutów; zachowana kopia: ${backup}`, { cause: error }); }
      }
      throw error;
    }
    return { outDir, ...metadata };
  } finally {
    await context?.close().catch(() => {});
    if (!keepBackup) fs.rmSync(work, { recursive: true, force: true });
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log('node tools/webstore-screenshots.mjs [--dir katalog-rozszerzenia] [--out katalog-zrzutów] [--locale pl|en]\nTworzy 3 prawdziwe zrzuty UI 1280×800 i metadata.json. Wymaga działającego Chromium Playwright oraz rzeczywistego rozszerzenia. Bez zastępczych/makietowych obrazów.');
    return;
  }
  const result = await captureScreenshots(options);
  console.log(`Zapisano ${result.images.length} rzeczywiste zrzuty: ${result.outDir}`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { await main(); } catch (error) { console.error(error.message); process.exitCode = error.code === 'BROWSER_UNAVAILABLE' ? 2 : 1; }
}
