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
    await page.waitForFunction(() => document.querySelectorAll('#listContainer .card').length === 3);
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
      sourceContentsSha256: hashPackage(extDir), viewport: VIEWPORT, locale: browserLocale, colorScheme: 'light',
      exampleUserFilter: exampleFilter, sync: Object.fromEntries(SYNC_STEPS.map((step) => [step, health.sync[step].status])), images,
      scope: 'Screenshots document the actual extension UI. They do not prove advertising effectiveness on external websites.',
    };
    fs.writeFileSync(path.join(staged, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n');
    await context.close();
    context = null;
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
