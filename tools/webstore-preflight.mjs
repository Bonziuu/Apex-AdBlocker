#!/usr/bin/env node
// Offline technical checks. This tool does not run browser tests, submit the
// extension, verify publisher identity, or guarantee Chrome Web Store approval.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { ROOT, createZip, listFiles, validatePackage, manifestReferences, crc32 } from './package-dev.mjs';
import { EXTENSION_ENTRIES } from './chromium-smoke.mjs';

export function pngDimensions(bytes) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (bytes.length < 45 || !bytes.subarray(0, 8).equals(signature)) throw new Error('not a PNG');
  let offset = 8;
  let dimensions;
  let imageData = false;
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) throw new Error('truncated PNG chunk');
    const kind = bytes.toString('ascii', offset + 4, offset + 8);
    const body = bytes.subarray(offset + 4, offset + 8 + length);
    if (crc32(body) !== bytes.readUInt32BE(offset + 8 + length)) throw new Error('PNG CRC mismatch');
    if (!dimensions) {
      if (kind !== 'IHDR' || length !== 13) throw new Error('missing PNG IHDR');
      dimensions = { width: bytes.readUInt32BE(offset + 8), height: bytes.readUInt32BE(offset + 12) };
      if (!dimensions.width || !dimensions.height) throw new Error('invalid PNG dimensions');
    }
    if (kind === 'IDAT') imageData = true;
    if (kind === 'IEND') {
      if (length || !imageData || end !== bytes.length) throw new Error('invalid PNG ending');
      return dimensions;
    }
    offset = end;
  }
  throw new Error('missing PNG IEND');
}

function localFile(root, file) {
  if (typeof file !== 'string' || !file || file.includes('\\') || path.isAbsolute(file)) throw new Error(`unsafe package path: ${String(file)}`);
  const target = path.resolve(root, file);
  const relative = path.relative(path.resolve(root), target);
  if (relative.startsWith('..' + path.sep) || relative === '..') throw new Error(`unsafe package path: ${file}`);
  const real = fs.realpathSync(target);
  const resolved = path.relative(fs.realpathSync(root), real);
  if (resolved.startsWith('..' + path.sep) || resolved === '..') throw new Error(`package path escapes through symlink: ${file}`);
  if (!fs.statSync(real).isFile()) throw new Error(`not a package file: ${file}`);
  return real;
}
function rejectSymlinks(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`symlink is not a self-contained package file: ${entry.name}`);
    if (entry.isDirectory()) rejectSymlinks(path.join(dir, entry.name));
  }
}
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const versionValid = (version) => typeof version === 'string' && /^(0|[1-9]\d*)(\.(0|[1-9]\d*)){0,3}$/.test(version)
  && version.split('.').every((n) => Number(n) <= 65535) && version.split('.').some((n) => Number(n) > 0);
const sameSet = (a = [], b = []) => JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort());
const isSha256 = (value) => typeof value === 'string' && /^[a-f\d]{64}$/.test(value);
function contentsHash(dir) {
  const hash = crypto.createHash('sha256');
  for (const file of listFiles(dir)) hash.update(file).update('\0').update(fs.readFileSync(localFile(dir, file))).update('\0');
  return hash.digest('hex');
}

/** Validate rendered manifest text in every packaged locale, including fallback. */
function validateLocalizedMetadata(extensionDir, manifest) {
  const fields = { name: 75, description: 132 };
  const messages = new Map();
  const localeDir = path.join(extensionDir, '_locales');
  if (fs.existsSync(localeDir)) {
    for (const entry of fs.readdirSync(localeDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) throw new Error(`invalid locale entry: ${entry.name}`);
      const json = readJson(localFile(extensionDir, `_locales/${entry.name}/messages.json`));
      if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error(`invalid messages for ${entry.name}`);
      messages.set(entry.name, new Map(Object.entries(json).map(([key, value]) => [key.toLowerCase(), value])));
    }
  }
  const localized = Object.keys(fields).some((field) => typeof manifest[field] === 'string' && manifest[field].includes('__MSG_'));
  if (localized || messages.size || manifest.default_locale !== undefined) {
    if (typeof manifest.default_locale !== 'string' || !messages.has(manifest.default_locale)) throw new Error('missing packaged default_locale messages');
  }
  const defaultMessages = messages.get(manifest.default_locale);
  const render = (raw, locale) => {
    if (typeof raw !== 'string') throw new Error('metadata must be text');
    const value = raw.replace(/__MSG_([a-z\d_@]+)__/gi, (_, key) => {
      const entry = messages.get(locale)?.get(key.toLowerCase()) ?? defaultMessages?.get(key.toLowerCase());
      if (!entry || typeof entry.message !== 'string') throw new Error(`unresolved localized message ${key} (${locale})`);
      return entry.message;
    });
    if (/__MSG_/i.test(value)) throw new Error(`unresolved localized metadata (${locale || 'default'})`);
    return value;
  };
  const rendered = {};
  for (const locale of messages.size ? messages.keys() : [undefined]) {
    for (const [field, max] of Object.entries(fields)) {
      const value = render(manifest[field], locale);
      if (!value.trim() || value.length > max) throw new Error(`invalid ${field} in ${locale || 'manifest'} (1–${max} characters)`);
      if (locale === manifest.default_locale || !messages.size) rendered[field] = value;
    }
  }
  return rendered;
}

/** Inspect actual package bytes. No files are created or changed. */
export function validateStorePackage({ extensionDir, sourceDir, zipPath } = {}) {
  const issues = [], checks = [];
  let manifest, renderedMetadata;
  const check = (name, action) => {
    try { action(); checks.push({ name, status: 'PASS' }); }
    catch (error) { issues.push(`${name}: ${error.message}`); checks.push({ name, status: 'FAIL', detail: error.message }); }
  };
  check('package contents and manifest references', () => {
    if (!extensionDir || !fs.existsSync(extensionDir)) throw new Error('extension directory is missing');
    rejectSymlinks(extensionDir);
    const problems = validatePackage(extensionDir);
    if (problems.length) throw new Error(problems.join('; '));
    // Validate every file, including non-manifest data/prerequisites, for path escape.
    for (const file of listFiles(extensionDir)) localFile(extensionDir, file);
    manifest = readJson(path.join(extensionDir, 'manifest.json'));
    for (const ref of manifestReferences(manifest)) localFile(extensionDir, ref);
  });
  if (!manifest) return { ok: false, issues, checks, packageSha256: null, sourceContentsSha256: null };
  check('Manifest V3 and metadata', () => {
    if (manifest.manifest_version !== 3) throw new Error('Manifest V3 required');
    renderedMetadata = validateLocalizedMetadata(extensionDir, manifest);
    if (!versionValid(manifest.version)) throw new Error('invalid Chrome extension version');
    if (manifest.background?.type !== 'module' || !manifest.background?.service_worker) throw new Error('expected MV3 module service worker');
  });
  check('128px store icon bytes', () => {
    const icon = localFile(extensionDir, manifest.icons?.['128']);
    const dimensions = pngDimensions(fs.readFileSync(icon));
    if (dimensions.width !== 128 || dimensions.height !== 128) throw new Error(`expected 128×128 PNG, got ${dimensions.width}×${dimensions.height}`);
  });
  check('scriptlet metadata and prerequisite files', () => {
    const rulesets = manifest.declarative_net_request?.rule_resources;
    if (!Array.isArray(rulesets) || !rulesets.length) throw new Error('missing DNR rulesets');
    for (const ruleset of rulesets) {
      const metadata = readJson(localFile(extensionDir, `data/${ruleset.id}.scriptlets.json`));
      if (!Array.isArray(metadata)) throw new Error(`invalid metadata for ${ruleset.id}`);
      for (const shard of metadata) {
        localFile(extensionDir, shard.file);
        if (shard.jsBefore !== undefined && !Array.isArray(shard.jsBefore)) throw new Error(`invalid jsBefore in ${shard.file}`);
        for (const prerequisite of shard.jsBefore || []) localFile(extensionDir, prerequisite);
      }
    }
  });
  if (sourceDir) check('source version, permission declarations and extension bytes', () => {
    const source = readJson(path.join(sourceDir, 'manifest.json'));
    if (source.version !== manifest.version) throw new Error('source/package version mismatch');
    for (const key of ['permissions', 'host_permissions', 'optional_permissions', 'optional_host_permissions']) {
      if (!sameSet(source[key], manifest[key])) throw new Error(`source/package ${key} mismatch`);
    }
    const expectedFiles = EXTENSION_ENTRIES.flatMap((entry) => {
      const original = path.join(sourceDir, entry);
      if (!fs.existsSync(original)) return [];
      return fs.statSync(original).isDirectory() ? listFiles(original).map((file) => `${entry}/${file}`) : [entry];
    });
    if (!sameSet(expectedFiles, listFiles(extensionDir))) throw new Error('source/package runtime file sets differ');
    for (const file of listFiles(extensionDir)) {
      const built = fs.readFileSync(localFile(extensionDir, file));
      const original = fs.readFileSync(localFile(sourceDir, file));
      if (!original.equals(built)) throw new Error(`stale or modified package file: ${file}`);
    }
  });
  let packageSha256 = null;
  if (zipPath) check('store ZIP has exact current extension contents and root manifest', () => {
    const entries = listFiles(extensionDir).map((file) => ({ name: file, data: fs.readFileSync(localFile(extensionDir, file)) }));
    const expected = createZip(entries);
    const actual = fs.readFileSync(zipPath);
    packageSha256 = sha256(actual);
    // Byte equality also checks the deterministic ZIP's headers, root paths,
    // compressed data and CRCs. An old or differently packaged ZIP is rejected.
    if (!actual.equals(expected)) throw new Error('ZIP differs from deterministic store package; rebuild package:store');
  });
  let sourceContentsSha256 = null;
  try { sourceContentsSha256 = contentsHash(extensionDir); }
  catch (error) { issues.push(`extension contents hash: ${error.message}`); }
  return { ok: issues.length === 0, issues, checks, version: manifest.version, name: renderedMetadata?.name || manifest.name,
    permissions: manifest.permissions || [], hostPermissions: manifest.host_permissions || [], packageSha256, sourceContentsSha256 };
}

function publicHttps(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !!u.hostname && !['localhost', '127.0.0.1', '[::1]'].includes(u.hostname)
      && !u.username && !u.password && !u.hostname.endsWith('.localhost')
      && !['example.com','example.org','example.net'].some((host) => u.hostname === host || u.hostname.endsWith('.' + host))
      && !u.hostname.endsWith('.example') && !u.hostname.endsWith('.test');
  } catch { return false; }
}

/** Readiness statements are supplied evidence, not tests performed by this tool. */
export function publicationBlockers({ technical, submission = {}, evidence = {}, materialsRoot = ROOT } = {}) {
  const blockers = [...(!technical?.ok ? ['technical package checks failed'] : [])];
  const publisher = submission.publisher || {};
  if (typeof publisher.name !== 'string' || !publisher.name.trim()) blockers.push('publisher name is missing');
  if (typeof publisher.contactEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(publisher.contactEmail)
    || /@(example\.(com|org|net)|.*\.(example|test))$/i.test(publisher.contactEmail)) blockers.push('public publisher contact email is missing or a placeholder');
  if (!publicHttps(publisher.privacyPolicyUrl)) blockers.push('public HTTPS privacy policy URL is missing or a placeholder');
  const listings = submission.materials?.listings;
  if (!Array.isArray(listings) || !listings.length || !listings.every((file) => {
    try { return fs.readFileSync(localFile(materialsRoot, file), 'utf8').trim().length > 0; } catch { return false; }
  })) blockers.push('listing draft files are missing');
  const shots = submission.materials?.screenshots;
  const genuineShots = Array.isArray(shots) && shots.length >= 1 && shots.length <= 5 && shots.every((shot) => {
    if (shot?.actualExtensionCapture !== true || !isSha256(shot.sha256) || !isSha256(technical?.sourceContentsSha256)
      || !versionValid(technical?.version)) return false;
    try {
      const screenshot = localFile(materialsRoot, shot.path);
      const bytes = fs.readFileSync(screenshot);
      const d = pngDimensions(bytes);
      if (!((d.width === 1280 && d.height === 800) || (d.width === 640 && d.height === 400)) || sha256(bytes) !== shot.sha256) return false;
      const metadataFile = localFile(materialsRoot, shot.captureMetadata);
      const metadata = readJson(metadataFile);
      if (metadata?.generator !== 'tools/webstore-screenshots.mjs' || metadata.provenance !== 'actual-extension-in-temporary-profile'
        || metadata.mockedChromeApi !== false || metadata.extensionVersion !== technical.version
        || metadata.sourceContentsSha256 !== technical.sourceContentsSha256 || !Array.isArray(metadata.images)) return false;
      return metadata.images.some((image) => {
        if (typeof image?.file !== 'string' || ['.', '..'].includes(image.file) || image.file.includes('\\')
          || path.basename(image.file) !== image.file || image.sha256 !== shot.sha256 || image.width !== d.width || image.height !== d.height) return false;
        return fs.realpathSync(path.join(path.dirname(metadataFile), image.file)) === screenshot;
      });
    } catch { return false; }
  });
  if (!genuineShots) blockers.push('1–5 genuine extension screenshots at 1280×800 or 640×400 are missing (UI fixtures do not qualify)');
  let promotionalImage = false;
  try {
    const d = pngDimensions(fs.readFileSync(localFile(materialsRoot, submission.materials?.promotionalImage)));
    promotionalImage = d.width === 440 && d.height === 280;
  } catch { /* reported below */ }
  if (!promotionalImage) blockers.push('small promotional brand image at 440×280 is missing');
  const b = evidence.browser || {};
  if (!Number.isInteger(b.tests) || b.tests <= 0 || b.passed !== b.tests || b.failed !== 0 || b.skipped !== 0
    || b.cancelled !== 0 || b.todo !== 0 || b.smoke !== 'PASS' || b.checkExitCode !== 0 || b.completePass !== true
    || b.actualFailure !== false || b.summaryPresent !== true || b.completed !== true || b.error
    || !Array.isArray(b.failureGroups) || b.failureGroups.length !== 0) blockers.push('complete browser test evidence and extension smoke PASS are missing');
  if (!technical?.packageSha256 || evidence.packageSha256 !== technical.packageSha256) blockers.push('validation evidence does not identify this exact ZIP SHA-256');
  const live = evidence.liveSites || {};
  if (live.status !== 'PASS' || !Number.isInteger(live.tested) || live.tested <= 0 || live.failed !== 0) blockers.push('representative real-site validation evidence is missing');
  return blockers;
}

const HELP = `Usage: node tools/webstore-preflight.mjs [--dir DIR] [--zip ZIP] [--source DIR]
  [--submission JSON] [--evidence JSON] [--prepared JSON] [--materials-root DIR] [--technical-only]

Default dir: dist/Apex-AdBlocker; default source: repository root.
Default ZIP: dist/Apex-AdBlocker-WebStore-<manifest.version>.zip.
The JSON report goes to stdout; exit 0 = requested checks passed, 1 = technical
failure, 2 = publication prerequisites remain. --technical-only checks only ZIP.
--prepared reads package paths from a webstore-prepare report inside materials-root.

Submission schema:
{"publisher":{"name":null,"contactEmail":null,"privacyPolicyUrl":null},
 "materials":{"listings":["docs/webstore/listing-pl.md"],"promotionalImage":"docs/webstore/assets/promo-small-440x280.png",
 "screenshots":[{"path":"docs/webstore/screenshots/01.png","actualExtensionCapture":true,"sha256":"...",
 "captureMetadata":"docs/webstore/screenshots/metadata.json"}]}}
Evidence schema (reported outcomes must come from actual runs):
{"packageSha256":"...","browser":{"tests":1,"passed":1,"failed":0,
 "skipped":0,"cancelled":0,"todo":0,"smoke":"PASS","checkExitCode":0,
 "completePass":true,"actualFailure":false,"summaryPresent":true,"completed":true,"failureGroups":[]},
 "liveSites":{"status":"PASS","tested":1,"failed":0}}
No license checks are performed. No upload or policy approval is performed.
`;

function args(argv) {
  const out = { extensionDir: path.join(ROOT, 'dist/Apex-AdBlocker'), sourceDir: ROOT, materialsRoot: ROOT };
  const flags = { '--dir': 'extensionDir', '--zip': 'zipPath', '--source': 'sourceDir', '--submission': 'submissionPath', '--evidence': 'evidencePath', '--prepared': 'preparedReportPath', '--materials-root': 'materialsRoot' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--help') return { help: true };
    if (argv[i] === '--technical-only') { out.technicalOnly = true; continue; }
    const key = flags[argv[i]];
    if (!key || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`Unknown or incomplete option: ${argv[i]}`);
    out[key] = path.resolve(argv[++i]);
  }
  return out;
}
export function runPreflight(options) {
  const opts = { ...options };
  if (opts.preparedReportPath) {
    const prepared = readJson(opts.preparedReportPath);
    if (prepared.generator !== 'tools/webstore-prepare.mjs') throw new Error('Not a webstore-prepare report; run webstore:prepare first');
    const root = opts.materialsRoot || ROOT;
    const file = localFile(root, prepared.package?.path);
    const directory = prepared.package?.extensionDir;
    if (typeof directory !== 'string' || path.isAbsolute(directory) || directory.includes('\\')) throw new Error('Unsafe prepared extension path');
    const resolved = fs.realpathSync(path.resolve(root, directory));
    const rel = path.relative(fs.realpathSync(root), resolved);
    if (rel === '..' || rel.startsWith('..' + path.sep) || !fs.statSync(resolved).isDirectory()) throw new Error('Unsafe prepared extension path');
    opts.extensionDir = resolved;
    opts.zipPath = file;
  }
  if (!opts.zipPath) {
    try { opts.zipPath = path.join(path.dirname(opts.extensionDir), `Apex-AdBlocker-WebStore-${readJson(path.join(opts.extensionDir, 'manifest.json')).version}.zip`); }
    catch { /* validateStorePackage reports a missing package */ }
  }
  const technical = validateStorePackage(opts);
  // Missing preparation files mean pending readiness, not a broken package.
  // Existing malformed JSON still raises an error rather than being ignored.
  const submission = opts.submissionPath && fs.existsSync(opts.submissionPath) ? readJson(opts.submissionPath) : {};
  const evidence = opts.evidencePath && fs.existsSync(opts.evidencePath) ? readJson(opts.evidencePath) : {};
  const blockers = publicationBlockers({ technical, submission, evidence, materialsRoot: opts.materialsRoot });
  return { scope: 'offline technical package checks and supplied readiness evidence; not Chrome Web Store approval',
    technical, publicationReady: blockers.length === 0, blockers,
    evidenceFile: opts.evidencePath || null, submissionFile: opts.submissionPath || null,
    exitCode: !technical.ok ? 1 : opts.technicalOnly || blockers.length === 0 ? 0 : 2 };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const options = args(process.argv.slice(2));
    if (options.help) console.log(HELP);
    else { const report = runPreflight(options); console.log(JSON.stringify(report, null, 2)); process.exitCode = report.exitCode; }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
