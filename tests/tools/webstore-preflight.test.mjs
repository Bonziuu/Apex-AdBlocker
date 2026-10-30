import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { createZip, listFiles, crc32 } from '../../tools/package-dev.mjs';
import { pngDimensions, validateStorePackage, publicationBlockers, runPreflight } from '../../tools/webstore-preflight.mjs';

function png(width = 128, height = 128) {
  const chunk = (name, data) => {
    const body = Buffer.concat([Buffer.from(name), data]);
    const result = Buffer.alloc(12 + data.length);
    result.writeUInt32BE(data.length);
    body.copy(result, 4);
    result.writeUInt32BE(crc32(body), 8 + data.length);
    return result;
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(Buffer.alloc((width * 4 + 1) * height))), chunk('IEND', Buffer.alloc(0))]);
}
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-store-preflight-'));
  const sourceDir = path.join(root, 'source');
  const extensionDir = path.join(root, 'extension');
  for (const dir of ['icons','data','rules','scriptlets','shared']) fs.mkdirSync(path.join(sourceDir, dir), { recursive: true });
  const manifest = {
    manifest_version: 3, name: 'Apex fixture', description: 'Local test fixture', version: '1.0.0',
    permissions: ['storage','scripting'], host_permissions: ['<all_urls>'],
    background: { type: 'module', service_worker: 'background.js' }, icons: { 128: 'icons/icon128.png' },
    declarative_net_request: { rule_resources: [{ id: 'ads', enabled: true, path: 'rules/ads.json' }] },
  };
  fs.writeFileSync(path.join(sourceDir, 'manifest.json'), JSON.stringify(manifest));
  fs.writeFileSync(path.join(sourceDir, 'background.js'), '// worker\n');
  fs.writeFileSync(path.join(sourceDir, 'icons/icon128.png'), png());
  fs.writeFileSync(path.join(sourceDir, 'rules/ads.json'), '[]');
  fs.writeFileSync(path.join(sourceDir, 'data/ads.scriptlets.json'), JSON.stringify([{ file: 'scriptlets/ads-0.js', jsBefore: ['shared/helper.js'] }]));
  fs.writeFileSync(path.join(sourceDir, 'scriptlets/ads-0.js'), '// scriptlet\n');
  fs.writeFileSync(path.join(sourceDir, 'shared/helper.js'), '// prerequisite\n');
  fs.cpSync(sourceDir, extensionDir, { recursive: true });
  const zipPath = path.join(root, 'store.zip');
  const zip = () => fs.writeFileSync(zipPath, createZip(listFiles(extensionDir).map(file => ({ name: file, data: fs.readFileSync(path.join(extensionDir, file)) }))));
  zip();
  return { root, sourceDir, extensionDir, zipPath, manifest, zip, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}
const writeManifest = (f, patch) => fs.writeFileSync(path.join(f.extensionDir, 'manifest.json'), JSON.stringify({ ...f.manifest, ...patch }));
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
function readyFixture(f) {
  fs.writeFileSync(path.join(f.root, 'listing.md'), 'Actual listing');
  fs.writeFileSync(path.join(f.root, 'shot.png'), png(1280,800));
  fs.writeFileSync(path.join(f.root, 'promo.png'), png(440,280));
  const technical = validateStorePackage(f);
  const screenshotHash = hash(fs.readFileSync(path.join(f.root, 'shot.png')));
  const metadata = { generator: 'tools/webstore-screenshots.mjs', provenance: 'actual-extension-in-temporary-profile',
    mockedChromeApi: false, extensionVersion: technical.version, sourceContentsSha256: technical.sourceContentsSha256,
    images: [{ file: 'shot.png', width: 1280, height: 800, sha256: screenshotHash }] };
  fs.writeFileSync(path.join(f.root, 'metadata.json'), JSON.stringify(metadata));
  const submission = { publisher: { name: 'Publisher', contactEmail: 'support@publisher.dev', privacyPolicyUrl: 'https://publisher.dev/privacy' },
    materials: { listings: ['listing.md'], promotionalImage: 'promo.png', screenshots: [{ path: 'shot.png', actualExtensionCapture: true,
      sha256: screenshotHash, captureMetadata: 'metadata.json' }] } };
  const evidence = { packageSha256: technical.packageSha256,
    browser: { tests: 5, passed: 5, failed: 0, skipped: 0, todo: 0, cancelled: 0, smoke: 'PASS', checkExitCode: 0,
      completePass: true, actualFailure: false, summaryPresent: true, completed: true, failureGroups: [] },
    liveSites: { status: 'PASS', tested: 3, failed: 0 } };
  return { technical, submission, evidence, materialsRoot: f.root, metadata };
}

test('store preflight validates actual PNG dimensions and catches corrupt/truncated bytes', () => {
  assert.deepEqual(pngDimensions(png()), { width: 128, height: 128 });
  const corrupt = png(); corrupt[40] ^= 1;
  assert.throws(() => pngDimensions(corrupt), /CRC/);
  assert.throws(() => pngDimensions(png().subarray(0, 30)), /PNG/);
});

test('store preflight accepts current MV3 package with exact ZIP and source files', () => {
  const f = fixture();
  try {
    const result = validateStorePackage(f);
    assert.equal(result.ok, true, result.issues.join('\n'));
    assert.equal(result.checks.length, 6);
    assert.match(result.packageSha256, /^[a-f\d]{64}$/);
    const contents = crypto.createHash('sha256');
    for (const file of listFiles(f.extensionDir)) contents.update(file).update('\0').update(fs.readFileSync(path.join(f.extensionDir,file))).update('\0');
    assert.equal(result.sourceContentsSha256, contents.digest('hex'), 'same path/NUL/bytes/NUL hash as screenshot captures');
    assert.deepEqual(result.permissions, ['storage','scripting']);
    const preparedReportPath = path.join(f.root, 'prepared.json');
    fs.writeFileSync(preparedReportPath, JSON.stringify({ generator:'tools/webstore-prepare.mjs',
      package:{ path:'store.zip', extensionDir:'extension' } }));
    const prepared = runPreflight({ ...f, extensionDir:path.join(f.root,'stale'), zipPath:path.join(f.root,'stale.zip'),
      preparedReportPath, materialsRoot:f.root, technicalOnly:true });
    assert.equal(prepared.technical.ok,true);
    assert.equal(prepared.exitCode,0);
    fs.writeFileSync(preparedReportPath, JSON.stringify({ generator:'tools/webstore-prepare.mjs',
      package:{ path:'../outside.zip', extensionDir:'extension' } }));
    assert.throws(() => runPreflight({ ...f, preparedReportPath, materialsRoot:f.root }), /unsafe package path/);
  } finally { f.cleanup(); }
});

test('store preflight rejects malformed Chrome versions and incorrect store icon dimensions', () => {
  const f = fixture();
  try {
    for (const version of ['0.0.0', '01.2', '1.65536', '1.2.3.4.5', '1.beta']) {
      writeManifest(f, { version });
      assert.ok(validateStorePackage({ extensionDir: f.extensionDir }).issues.some(x => /version/.test(x)), version);
    }
    writeManifest(f, {});
    fs.writeFileSync(path.join(f.extensionDir, 'icons/icon128.png'), png(64,64));
    assert.ok(validateStorePackage({ extensionDir: f.extensionDir }).issues.some(x => /128×128/.test(x)));
  } finally { f.cleanup(); }
});

test('store preflight rejects stale permissions/source bytes or missing runtime source files', () => {
  const f = fixture();
  try {
    writeManifest(f, { permissions: ['storage','tabs'] });
    assert.ok(validateStorePackage(f).issues.some(x => /permissions mismatch/.test(x)));
    writeManifest(f, {});
    fs.writeFileSync(path.join(f.extensionDir, 'background.js'), '// stale worker');
    assert.ok(validateStorePackage(f).issues.some(x => /stale or modified/.test(x)));
    fs.writeFileSync(path.join(f.extensionDir, 'background.js'), '// worker\n');
    fs.writeFileSync(path.join(f.sourceDir, 'shared/new-helper.js'), '// newly added');
    assert.ok(validateStorePackage(f).issues.some(x => /file sets differ/.test(x)));
  } finally { f.cleanup(); }
});

test('store preflight rejects missing/escaping prerequisites and package symlinks', () => {
  const f = fixture();
  try {
    fs.rmSync(path.join(f.extensionDir, 'shared/helper.js'));
    assert.ok(validateStorePackage({ extensionDir: f.extensionDir }).issues.some(x => /prerequisite/.test(x)));
    fs.writeFileSync(path.join(f.extensionDir, 'data/ads.scriptlets.json'), JSON.stringify([{ file: '../outside.js' }]));
    assert.ok(validateStorePackage({ extensionDir: f.extensionDir }).issues.some(x => /unsafe package path/.test(x)));
    fs.symlinkSync(path.join(f.sourceDir, 'background.js'), path.join(f.extensionDir, 'shared/linked.js'));
    assert.ok(validateStorePackage({ extensionDir: f.extensionDir }).issues.some(x => /symlink/.test(x)));
  } finally { f.cleanup(); }
});

test('store preflight rejects root-folder, stale or corrupt ZIP instead of merely trusting its name', () => {
  const f = fixture();
  try {
    fs.writeFileSync(f.zipPath, createZip([{ name: 'Apex-AdBlocker/manifest.json', data: Buffer.from('{}') }]));
    assert.ok(validateStorePackage(f).issues.some(x => /ZIP differs/.test(x)));
    f.zip();
    const bytes=fs.readFileSync(f.zipPath); bytes[35]^=1; fs.writeFileSync(f.zipPath,bytes);
    assert.ok(validateStorePackage(f).issues.some(x => /ZIP differs/.test(x)));
  } finally { f.cleanup(); }
});

test('readiness never turns skipped tests, fixture screenshots or stale evidence into publication approval', () => {
  const f = fixture();
  try {
    const technical = validateStorePackage(f);
    const blockers = publicationBlockers({ technical, evidence: {
      packageSha256: 'old-hash', browser: { tests:511, passed:491, failed:0, skipped:20, todo:0,cancelled:0,smoke:'SKIP' },
    } });
    assert.ok(blockers.some(x=>/browser/.test(x)));
    assert.ok(blockers.some(x=>/exact ZIP/.test(x)));
    assert.ok(blockers.some(x=>/genuine/.test(x)));
    assert.ok(blockers.some(x=>/real-site/.test(x)));
    const result = runPreflight({ ...f, technicalOnly:true, materialsRoot:f.root });
    assert.equal(result.exitCode,0);
    assert.equal(result.technical.ok,true);
    assert.equal(result.publicationReady,false);
    const pending = runPreflight({ ...f, materialsRoot:f.root,
      submissionPath:path.join(f.root,'missing-submission.json'), evidencePath:path.join(f.root,'missing-evidence.json') });
    assert.equal(pending.exitCode,2);
    assert.equal(pending.technical.ok,true);
  } finally { f.cleanup(); }
});

test('readiness can clear only when required publisher fields, actual images and matching complete evidence are supplied', () => {
  const f = fixture();
  try {
    const { technical, submission, evidence } = readyFixture(f);
    assert.deepEqual(publicationBlockers({technical,submission,evidence,materialsRoot:f.root}),[]);
    fs.writeFileSync(path.join(f.root,'promo.png'),png(440,281));
    assert.ok(publicationBlockers({technical,submission,evidence,materialsRoot:f.root}).some(x=>/promotional/.test(x)));
    fs.writeFileSync(path.join(f.root,'promo.png'),png(440,280));
    submission.publisher.privacyPolicyUrl='https://example.com/privacy';
    assert.ok(publicationBlockers({technical,submission,evidence,materialsRoot:f.root}).some(x=>/privacy policy URL/.test(x)));
    submission.publisher.privacyPolicyUrl='https://publisher.dev/privacy';
    submission.materials.screenshots[0].actualExtensionCapture=false;
    assert.ok(publicationBlockers({technical,submission,evidence,materialsRoot:f.root}).some(x=>/genuine/.test(x)));
  } finally { f.cleanup(); }
});

test('all test counts PASS cannot hide a failed build, failed check command or incomplete summary', () => {
  const f = fixture();
  try {
    const ready = readyFixture(f);
    assert.deepEqual(publicationBlockers(ready), []);
    for (const patch of [
      { checkExitCode: 1 }, { completePass: false }, { actualFailure: true },
      { failureGroups: ['build'] }, { failureGroups: undefined }, { summaryPresent: false },
      { completed: false }, { error: 'build process failed' },
    ]) {
      const evidence = { ...ready.evidence, browser: { ...ready.evidence.browser, ...patch } };
      assert.ok(publicationBlockers({ ...ready, evidence }).some(x => /browser/.test(x)), JSON.stringify(patch));
    }
  } finally { f.cleanup(); }
});

test('screenshot readiness rejects tampering, stale package metadata and unrelated capture images', () => {
  const f = fixture();
  try {
    const ready = readyFixture(f);
    const writeMetadata = (value) => fs.writeFileSync(path.join(f.root, 'metadata.json'), JSON.stringify(value));
    const blocked = () => publicationBlockers(ready).some(x => /genuine/.test(x));
    fs.writeFileSync(path.join(f.root, 'shot.png'), png(640,400));
    assert.equal(blocked(), true, 'valid PNG replacement still fails its original image SHA-256');
    fs.writeFileSync(path.join(f.root, 'shot.png'), png(1280,800));
    assert.equal(blocked(), false);
    for (const patch of [
      { generator: 'mock-ui-renderer' }, { provenance: 'fixture' }, { mockedChromeApi: true },
      { extensionVersion: '0.0.1' }, { sourceContentsSha256: '0'.repeat(64) },
      { images: [{ ...ready.metadata.images[0], sha256: '0'.repeat(64) }] },
      { images: [{ ...ready.metadata.images[0], width: 640 }] },
      { images: [{ ...ready.metadata.images[0], file: 'different.png' }] },
      { images: [{ ...ready.metadata.images[0], file: '../shot.png' }] },
    ]) {
      writeMetadata({ ...ready.metadata, ...patch });
      assert.equal(blocked(), true, JSON.stringify(patch));
    }
    writeMetadata(ready.metadata);
    const shot = ready.submission.materials.screenshots[0];
    delete shot.captureMetadata;
    assert.equal(blocked(), true, 'a boolean flag cannot replace capture metadata');
    shot.captureMetadata = 'metadata.json';
    shot.sha256 = '0'.repeat(64);
    assert.equal(blocked(), true, 'submission image hash must also match');
    shot.sha256 = ready.metadata.images[0].sha256;
    fs.writeFileSync(path.join(f.extensionDir, 'background.js'), '// changed after capture');
    const technical = validateStorePackage({ extensionDir: f.extensionDir });
    assert.notEqual(technical.sourceContentsSha256, ready.technical.sourceContentsSha256);
    assert.ok(publicationBlockers({ ...ready, technical }).some(x => /genuine/.test(x)), 'capture belongs to a different runtime package');
  } finally { f.cleanup(); }
});

test('localized manifest metadata validates rendered name and description for every packaged locale', () => {
  const f = fixture();
  try {
    const messages = (locale, entries) => {
      const dir = path.join(f.extensionDir, '_locales', locale);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'messages.json'), JSON.stringify(entries));
    };
    const en = { extName: { message: 'Apex fixture' }, extDescription: { message: 'Actual English description' } };
    const pl = { extDescription: { message: 'Rzeczywisty polski opis' } };
    messages('en', en); messages('pl', pl);
    const patch = { name: '__MSG_extName__', description: '__MSG_extDescription__', default_locale: 'en' };
    writeManifest(f, patch);
    const valid = validateStorePackage({ extensionDir: f.extensionDir });
    assert.equal(valid.ok, true, valid.issues.join('\n'));
    assert.equal(valid.name, 'Apex fixture', 'report uses rendered default name, not a marker');
    messages('pl', { ...pl, extDescription: { message: 'x'.repeat(133) } });
    assert.ok(validateStorePackage({ extensionDir: f.extensionDir }).issues.some(x => /description in pl/.test(x)));
    messages('pl', pl);
    messages('en', { ...en, extName: { message: 'x'.repeat(76) } });
    assert.ok(validateStorePackage({ extensionDir: f.extensionDir }).issues.some(x => /name in en/.test(x)));
    messages('en', { extName: en.extName });
    assert.ok(validateStorePackage({ extensionDir: f.extensionDir }).issues.some(x => /unresolved localized message extDescription/.test(x)));
    messages('en', en);
    writeManifest(f, { ...patch, default_locale: undefined });
    assert.ok(validateStorePackage({ extensionDir: f.extensionDir }).issues.some(x => /default_locale/.test(x)));
  } finally { f.cleanup(); }
});
