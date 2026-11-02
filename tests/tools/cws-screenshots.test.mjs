import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  EXAMPLE_FILTERS, GENERATOR, LOCALES, PUBLIC_PACKAGE, SCENES, TEXT,
  demoHtml, extractPublicPackage, fileName, generateCwsScreenshots, parseArgs, sceneHtml,
} from '../../store/cws-screenshots.mjs';
import { ROOT } from '../../tools/chromium-smoke.mjs';

const OUT = path.join(ROOT, 'docs/webstore/cws-screenshots');

test('cws screenshots: source is pinned to the published 1.0.0 package, not the repository code', () => {
  assert.deepEqual({ ...PUBLIC_PACKAGE }, {
    file: 'Apex-AdBlocker-WebStore-1.0.0.zip',
    version: '1.0.0',
    sha256: 'f58affb6dc6f3bbaa866ac5a81cf923ba106eb92e029b66da9b3980358589588',
    sourceCommit: 'fa1045a',
  });
});

test('cws screenshots: a ZIP with a different hash is rejected before anything is extracted or launched', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-cws-test-'));
  try {
    const zip = path.join(dir, PUBLIC_PACKAGE.file);
    fs.writeFileSync(zip, 'not the published package');
    assert.throws(() => extractPublicPackage(zip, path.join(dir, 'x')), /To nie jest opublikowana paczka 1\.0\.0/);
    assert.equal(fs.existsSync(path.join(dir, 'x')), false);
    assert.throws(() => extractPublicPackage(path.join(dir, 'missing.zip'), path.join(dir, 'x')), /Brak paczki ZIP/);
    assert.throws(() => extractPublicPackage('', path.join(dir, 'x')), /nie podano --zip/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('cws screenshots: arguments select pl, en or both and reject anything else', () => {
  assert.deepEqual(parseArgs([]).locales, ['pl', 'en']);
  assert.deepEqual(parseArgs(['--locale', 'en']).locales, ['en']);
  assert.deepEqual(parseArgs(['--locale', 'all']).locales, ['pl', 'en']);
  assert.throws(() => parseArgs(['--locale', 'de']), /Locale/);
  assert.throws(() => parseArgs(['--zip']), /Niepoprawny argument/);
  assert.throws(() => parseArgs(['--dir', 'x']), /Niepoprawny argument/);
  assert.equal(parseArgs(['--zip', 'a.zip']).zip, path.resolve('a.zip'));
});

test('cws screenshots: five scenes per language with order, language and feature in the file name', () => {
  assert.deepEqual([...LOCALES], ['pl', 'en']);
  assert.deepEqual([...SCENES], ['01-protection', '02-before-after', '03-hide-element', '04-site-toggle', '05-custom-filters']);
  assert.equal(fileName('01-protection', 'pl'), '01-protection-pl.png');
});

test('cws screenshots: approved copy only – one headline, at most one sentence, no statistics or endorsements', () => {
  const expected = {
    pl: ['Blokuj reklamy i śledzenie', 'Mniej reklam. Więcej treści.', 'Ukryj to, czego nie chcesz widzieć', 'Ty decydujesz, gdzie działa ochrona', 'Dostosuj ochronę do siebie'],
    en: ['Block ads and tracking', 'Fewer ads. More content.', 'Hide what you don’t want to see', 'You decide where protection runs', 'Customize your protection'],
  };
  const subs = {
    pl: ['Działa od razu po instalacji.', undefined, 'Wskaż element i dodaj własny filtr.', 'Wyłącz ją dla wybranej strony jednym kliknięciem.', 'Dodawaj własne filtry i zarządzaj ustawieniami.'],
    en: ['Works right after installation.', undefined, 'Pick an element and create your own filter.', 'Turn it off for a selected site with one click.', 'Add custom filters and manage your settings.'],
  };
  for (const lang of LOCALES) {
    assert.deepEqual(SCENES.map((s) => TEXT[lang][s].h.join(' ')), expected[lang]);
    assert.deepEqual(SCENES.map((s) => TEXT[lang][s].sub), subs[lang]);
    const all = SCENES.flatMap((s) => Object.values(TEXT[lang][s]).flat()).join(" | ");
    assert.doesNotMatch(all, /\d|%|Google|Chrome|approved|zatwierdz|recommended|polecan/i);
  }
  // bez mieszania języków: angielskie teksty nie zawierają polskich znaków
  assert.doesNotMatch(SCENES.flatMap((s) => Object.values(TEXT.en[s]).flat()).join(" "), /[ąćęłńóśźż]/i);
});

const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const fakeCapture = () => Object.fromEntries(['before', 'after', 'popupOn', 'picker', 'offPage', 'popupOff', 'filters'].map((k) => [k, { image: PIXEL }]));
const assets = { logo: 'data:image/svg+xml;base64,PHN2Zy8+', icon: `data:image/png;base64,${PIXEL.toString('base64')}` };

test('cws screenshots: compositions embed only captured images and differ in layout', () => {
  for (const lang of LOCALES) {
    const layouts = new Set();
    for (const scene of SCENES) {
      const html = sceneHtml(scene, lang, fakeCapture(), assets);
      assert.match(html, new RegExp(`<html lang="${lang}">`));
      assert.doesNotMatch(html, /\b(?:src|href)="(?!data:)/, 'no external resources');
      assert.doesNotMatch(html, /<script/i, 'composition does not run code over captures');
      assert.match(html, /class="brand"/, 'same Apex logo placement in every scene');
      assert.ok(html.includes(TEXT[lang][scene].h[1]));
      layouts.add(html.replace(/data:[^"]+/g, '').replace(/>[^<]*</g, '><'));
    }
    assert.equal(layouts.size, SCENES.length);
  }
});

test('cws screenshots: demo page and example filters are explicit test data', () => {
  for (const lang of LOCALES) {
    const html = demoHtml(lang);
    assert.match(html, /class="dn-signup"/);
    assert.match(html, /class="dn-most-read"/);
    assert.match(EXAMPLE_FILTERS[lang], /^! .*(przykład|example)/);
    assert.match(EXAMPLE_FILTERS[lang], /dailynews\.example##\.dn-signup/);
  }
});

test('cws screenshots: missing browser leaves no images and an unowned output directory is never replaced', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-cws-test-'));
  try {
    const out = path.join(dir, 'out');
    await assert.rejects(generateCwsScreenshots({ zip: path.join(dir, 'x.zip'), outDir: out, browserType: null }), (e) => e.code === 'BROWSER_UNAVAILABLE');
    assert.equal(fs.existsSync(out), false);
    fs.mkdirSync(out);
    fs.writeFileSync(path.join(out, 'notes.md'), 'user file');
    await assert.rejects(generateCwsScreenshots({ zip: path.join(dir, 'x.zip'), outDir: out, browserType: null }), /własne pliki użytkownika/);
    assert.equal(fs.readFileSync(path.join(out, 'notes.md'), 'utf8'), 'user file');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('cws screenshots: committed set matches its metadata – published 1.0.0, 1280×800, PL and EN, real counter', () => {
  const metadata = JSON.parse(fs.readFileSync(path.join(OUT, 'metadata.json'), 'utf8'));
  assert.equal(metadata.generator, GENERATOR);
  assert.equal(metadata.extensionVersion, '1.0.0');
  assert.equal(metadata.package.sha256, PUBLIC_PACKAGE.sha256);
  assert.equal(metadata.package.sourceCommit, 'fa1045a');
  assert.equal(metadata.mockedChromeApi, false);
  assert.equal(metadata.externalSitesVisited, false);
  assert.equal(metadata.integrity.status, 'PASS');
  assert.deepEqual(metadata.integrity.allowedRuntimeArtifacts, ['_metadata/generated_indexed_rulesets/_ruleset1', '_metadata/generated_indexed_rulesets/_ruleset2', '_metadata/generated_indexed_rulesets/_ruleset3']);
  const expectedFiles = LOCALES.flatMap((lang) => SCENES.map((scene) => `${lang}/${fileName(scene, lang)}`));
  assert.deepEqual(metadata.images.map((i) => i.file), expectedFiles);
  const onDisk = fs.readdirSync(OUT, { recursive: true }).filter((f) => f.endsWith('.png')).map((f) => f.split(path.sep).join('/')).sort();
  assert.deepEqual(onDisk, [...expectedFiles].sort());
  for (const image of metadata.images) {
    const bytes = fs.readFileSync(path.join(OUT, image.file));
    assert.equal(bytes.readUInt32BE(16), 1280, image.file);
    assert.equal(bytes.readUInt32BE(20), 800, image.file);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), image.sha256, image.file);
  }
  const ui = { pl: ['Ochrona aktywna', 'Ochrona wyłączona'], en: ['Protection on', 'Protection off'] };
  for (const lang of LOCALES) {
    const o = metadata.observed[lang];
    assert.deepEqual([o.popupOn.status, o.popupOff.status], ui[lang]);
    assert.equal(Number(o.popupOn.blocked), o.after.blockedRequests, 'counter = requests blocked on the demo page');
    assert.ok(o.after.blockedRequests > 0);
    assert.equal(o.popupOff.blocked, '0');
    assert.equal(o.after.adsVisible, 0);
    assert.ok(o.before.adsVisible > 0);
  }
});
