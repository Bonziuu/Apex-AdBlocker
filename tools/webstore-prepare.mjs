#!/usr/bin/env node
// Prepare offline store artifacts and record actual command outcomes. Never
// convert missing browser/live-site evidence or synthetic images into a PASS.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ROOT, listFiles } from './package-dev.mjs';
import { packageStore } from './package-store.mjs';
import { captureScreenshots, GENERATOR as SCREENSHOT_GENERATOR } from './webstore-screenshots.mjs';
import { runPreflight, pngDimensions } from './webstore-preflight.mjs';

export const GENERATOR = 'tools/webstore-prepare.mjs';
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const relative = (root, file) => path.relative(root, file).split(path.sep).join('/');
function contentsHash(dir) {
  const h = crypto.createHash('sha256');
  for (const file of listFiles(dir)) h.update(file).update('\0').update(fs.readFileSync(path.join(dir, file))).update('\0');
  return h.digest('hex');
}
function save(file, value, runDir, backupName) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    if (!fs.lstatSync(file).isFile()) throw new Error(`Refusing to replace a non-file output: ${file}`);
    // Keep even a user-edited previous report, rather than silently losing it.
    fs.copyFileSync(file, path.join(runDir, backupName));
  }
  const tmp = `${file}.tmp-${crypto.randomUUID()}`;
  try { fs.writeFileSync(tmp, value); fs.renameSync(tmp, file); }
  finally { fs.rmSync(tmp, { force: true }); }
}
const json = (value) => JSON.stringify(value, null, 2) + '\n';

/** Parse final anchored TAP totals and the check command's actual smoke line. */
export function parseCheckEvidence(result) {
  const stdout = String(result.stdout || '').replace(/\u001b\[[0-9;]*m/g, '');
  const totals = {};
  for (const [tap, field] of Object.entries({ tests:'tests', pass:'passed', fail:'failed', skipped:'skipped', cancelled:'cancelled', todo:'todo' })) {
    const matches = [...stdout.matchAll(new RegExp(`^# ${tap} (\\d+)\\s*$`, 'gm'))];
    totals[field] = matches.length ? Number(matches.at(-1)[1]) : null;
  }
  const smokeLines = stdout.split(/\r?\n/).filter((line) =>
    /^✓ Apex AdBlocker załadowany w Chromium: service worker działa, health bez ERROR$/.test(line)
    || /^SKIP: Chromium smoke test unavailable(?: \(.*\))?$/.test(line)
    || /^✗ Chromium smoke test: FAIL$/.test(line));
  const smokeLine = smokeLines.at(-1);
  const smoke = !smokeLine ? 'NOT_RUN' : smokeLine.startsWith('✓') ? 'PASS' : smokeLine.startsWith('SKIP:') ? 'SKIP' : 'FAIL';
  const failures = [...stdout.matchAll(/^✗ Niepowodzenie: (.+)$/gm)].at(-1)?.[1].split(',').map((s) => s.trim()) || [];
  const completed = Object.values(totals).every(Number.isInteger) && totals.tests > 0
    && totals.passed + totals.failed + totals.skipped + totals.cancelled + totals.todo === totals.tests;
  // Node's TODO tests can also be included in pass/fail on some versions. They
  // still block readiness; only completed zero-TODO runs can be full passes.
  const summaryPresent = Object.values(totals).every(Number.isInteger) && totals.tests > 0;
  const completePass = summaryPresent && totals.passed === totals.tests && totals.failed === 0 && totals.skipped === 0
    && totals.cancelled === 0 && totals.todo === 0 && smoke === 'PASS' && result.status === 0 && !result.error;
  const actualFailure = !!result.error || !summaryPresent || (totals.todo === 0 && !completed) || result.status === null || smoke === 'FAIL' || smoke === 'NOT_RUN'
    || totals.failed > 0 || totals.cancelled > 0 || failures.some((name) => !['tests','chromium-smoke-required'].includes(name))
    || (result.status !== 0 && totals.skipped === 0 && totals.todo === 0 && smoke !== 'SKIP');
  return { ...totals, smoke, checkExitCode: result.status ?? null, summaryPresent, completed, completePass,
    failureGroups: failures, ...(result.error ? { error: String(result.error) } : {}), actualFailure };
}

export function runStrictCheck({ root = ROOT } = {}) {
  return new Promise((resolve) => {
    let stdout = '', stderr = '', error;
    const child = spawn(process.execPath, [path.join(root, 'tools/check.mjs'), '--require-browser'], {
      cwd: root, stdio: ['ignore','pipe','pipe'], timeout: 30 * 60_000,
    });
    child.stdout.on('data', (part) => { stdout += part; });
    child.stderr.on('data', (part) => { stderr += part; });
    child.on('error', (e) => { error = e.message; });
    child.on('close', (status, signal) => resolve({ status, signal, stdout, stderr, ...(error ? { error } : {}) }));
  });
}

/** Accept only metadata produced from the same actual extension package. */
export function verifiedScreenshotEntries(metadata, { extensionDir, outDir, root = ROOT, version }) {
  if (metadata?.generator !== SCREENSHOT_GENERATOR || metadata.provenance !== 'actual-extension-in-temporary-profile'
    || metadata.mockedChromeApi !== false || metadata.extensionVersion !== version
    || metadata.sourceContentsSha256 !== contentsHash(extensionDir) || !Array.isArray(metadata.images) || !metadata.images.length) {
    throw new Error('Screenshot metadata does not prove a genuine capture of this package');
  }
  return metadata.images.map((image) => {
    if (typeof image.file !== 'string' || ['.','..'].includes(image.file) || path.basename(image.file) !== image.file) throw new Error('Unsafe screenshot filename');
    const file = path.join(outDir, image.file);
    const bytes = fs.readFileSync(file);
    const dimensions = pngDimensions(bytes);
    if (hash(bytes) !== image.sha256 || dimensions.width !== image.width || dimensions.height !== image.height
      || dimensions.width !== 1280 || dimensions.height !== 800) throw new Error(`Invalid captured image: ${image.file}`);
    return { path: relative(root, file), actualExtensionCapture: true, sha256: image.sha256,
      captureMetadata: relative(root, path.join(outDir, 'metadata.json')) };
  });
}

/** Default flow performs no network/live-site requests and uploads nothing. */
export async function prepareStore({
  root = ROOT,
  submissionPath = path.join(root, 'docs/webstore/submission.json'),
  evidencePath = path.join(root, 'docs/webstore/validation-evidence.json'),
  reportPath = path.join(root, 'docs/webstore/readiness-report.json'),
  screenshotsDir = path.join(root, 'docs/webstore/screenshots'),
  reuseLiveEvidencePath,
  runCheck = runStrictCheck,
  capture = captureScreenshots,
} = {}) {
  const submission = readJson(submissionPath);
  const dist = path.join(root, 'dist');
  fs.mkdirSync(dist, { recursive: true });
  // packageStore clears its target. Give it a new private run directory, never
  // dist/ or an existing user's output directory.
  const runDir = fs.mkdtempSync(path.join(dist, 'webstore-prepare-'));
  const pkg = packageStore({ root, outDir: path.join(runDir, 'package') });
  const packageSha256 = hash(fs.readFileSync(pkg.zipPath));
  const checkLog = path.join(dist, 'webstore-validation/check.log');
  let checked;
  try { checked = await runCheck({ root }); }
  catch (error) { checked = { status:null,stdout:'',stderr:'',error:error.message }; }
  save(checkLog, `$ node tools/check.mjs --require-browser\n${checked.stdout || ''}${checked.stderr || ''}${checked.error ? `\nRunner error: ${checked.error}\n` : ''}`, runDir, 'previous-check.log');
  const browser = parseCheckEvidence(checked);
  const workflowIssues = [];
  let liveSites = { status:'not_run',tested:0,failed:0,reason:'Real-site tests are not run by this offline preparation command.' };
  if (reuseLiveEvidencePath) {
    const previous = readJson(reuseLiveEvidencePath);
    if (previous.packageSha256 !== packageSha256 || previous.liveSites?.status !== 'PASS'
      || !Number.isInteger(previous.liveSites.tested) || previous.liveSites.tested <= 0 || previous.liveSites.failed !== 0) {
      workflowIssues.push('Explicit live-site evidence is incomplete or belongs to another ZIP');
    } else liveSites = { ...previous.liveSites, reusedFrom:relative(root,reuseLiveEvidencePath) };
  }
  const evidence = { generator:GENERATOR,generatedAt:new Date().toISOString(),packageSha256,
    packagePath:relative(root,pkg.zipPath),checkLog:relative(root,checkLog),
    command:'node tools/check.mjs --require-browser',browser,liveSites };
  save(evidencePath, json(evidence), runDir, 'previous-validation-evidence.json');
  let screenshots = { status:'NOT_RUN',reason:`Extension smoke result is ${browser.smoke}; genuine captures require PASS.` };
  if (browser.smoke === 'PASS') {
    try {
      const metadata = await capture({ extensionDir:pkg.extDir,outDir:screenshotsDir });
      const entries = verifiedScreenshotEntries(metadata, { extensionDir:pkg.extDir,outDir:screenshotsDir,root,version:pkg.version });
      const next = { ...submission,materials:{ ...(submission.materials || {}),screenshots:entries } };
      save(submissionPath,json(next),runDir,'previous-submission.json');
      screenshots = { status:'PASS',images:entries.length,metadata:relative(root,path.join(screenshotsDir,'metadata.json')) };
    } catch (error) {
      screenshots = { status:'FAIL',error:error.message };
      workflowIssues.push(`Genuine screenshot capture failed: ${error.message}`);
    }
  }
  const preflight = runPreflight({ extensionDir:pkg.extDir,sourceDir:root,zipPath:pkg.zipPath,
    submissionPath,evidencePath,materialsRoot:root });
  if (!browser.completePass) workflowIssues.push(`Strict check is incomplete or failed (exit ${browser.checkExitCode}, smoke ${browser.smoke})`);
  const publicationReady = preflight.publicationReady && workflowIssues.length === 0;
  const exitCode = !preflight.technical.ok || browser.actualFailure ? 1 : publicationReady ? 0 : 2;
  const report = { generator:GENERATOR,generatedAt:new Date().toISOString(),
    scope:'Offline preparation, actual strict-check outcomes and genuine captures only; no submission or Chrome Web Store approval.',
    package:{ version:pkg.version,path:relative(root,pkg.zipPath),extensionDir:relative(root,pkg.extDir),sha256:packageSha256 },
    evidenceFile:relative(root,evidencePath),checkLog:relative(root,checkLog),screenshots,
    technical:preflight.technical,publicationReady,blockers:[...preflight.blockers,...workflowIssues],exitCode,
    previousOutputsBackupDir:relative(root,runDir) };
  save(reportPath,json(report),runDir,'previous-readiness-report.json');
  return report;
}

export function parseArgs(argv) {
  const out = {};
  const fields = { '--root':'root','--submission':'submissionPath','--evidence':'evidencePath','--report':'reportPath',
    '--screenshots':'screenshotsDir','--reuse-live-evidence':'reuseLiveEvidencePath' };
  for (let i=0;i<argv.length;i++) {
    if (argv[i] === '--help') return { help:true };
    const field=fields[argv[i]];
    if (!field || !argv[i+1] || argv[i+1].startsWith('--')) throw new Error(`Unknown/incomplete option: ${argv[i]}`);
    out[field]=path.resolve(argv[++i]);
  }
  return out;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const options=parseArgs(process.argv.slice(2));
    if (options.help) console.log('node tools/webstore-prepare.mjs [--root DIR] [--submission JSON] [--evidence JSON] [--report JSON] [--screenshots DIR] [--reuse-live-evidence JSON]\nBuilds a fresh store package, runs actual strict checks, writes evidence/readiness, and captures only after extension smoke PASS. No upload or live-site requests. Exit0=complete,1=technical failure,2=prerequisites pending. Previous outputs are backed up in the unique dist/webstore-prepare-* run directory.');
    else { const report=await prepareStore(options); console.log(JSON.stringify(report,null,2)); process.exitCode=report.exitCode; }
  } catch(error) { console.error(error.message); process.exitCode=1; }
}
