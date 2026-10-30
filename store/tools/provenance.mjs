import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { listFiles } from '../../tools/package-dev.mjs';
import { EXTENSION_ENTRIES } from '../../tools/chromium-smoke.mjs';

export const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export function contentsHash(dir, runtimeOnly = false) {
  const hash = crypto.createHash('sha256');
  const files = runtimeOnly ? [...EXTENSION_ENTRIES].sort((a,b) => a.localeCompare(b)).flatMap(entry => {
    const source = path.join(dir,entry);
    if (!fs.existsSync(source)) return [];
    return fs.statSync(source).isDirectory() ? listFiles(source).map(file => `${entry}/${file}`) : [entry];
  }) : listFiles(dir);
  for (const file of files) {
    hash.update(file).update('\0').update(fs.readFileSync(path.join(dir,file))).update('\0');
  }
  return hash.digest('hex');
}

export function captureMetadata({ extensionDir, outputDir, details }) {
  if (details?.mockedChromeApi !== false) throw new Error('Capture must use the actual, unmodified Chrome APIs');
  const manifest = JSON.parse(fs.readFileSync(path.join(extensionDir,'manifest.json'),'utf8'));
  return {
    ...details,
    generator:'store/generate.mjs', status:'captured', generatedAt:new Date().toISOString(),
    extensionVersion:manifest.version, sourceContentsSha256:contentsHash(extensionDir),
    provenance:'actual-extension-on-controlled-demo-with-marketing-composition',
    mockedChromeApi:false, externalSitesVisited:false,
    images:listFiles(outputDir).filter(file => file.endsWith('.png')).map(file => ({
      file, sha256:sha256(fs.readFileSync(path.join(outputDir,file))),
    })),
    scope:'Controlled demonstration and extension UI, not real-site effectiveness evidence.',
  };
}

/** Replace files only after the complete batch succeeds; retain originals on failure. */
export function publishAssets({ stagedDir, destinationDir, backupDir, rename = fs.renameSync }) {
  const files = listFiles(stagedDir);
  const changed = [];
  fs.mkdirSync(backupDir,{recursive:true});
  try {
    for (const file of files) {
      const target = path.join(destinationDir,file);
      const previous = path.join(backupDir,file);
      const existed = fs.existsSync(target);
      if (existed) {
        if (!fs.lstatSync(target).isFile()) throw new Error(`Refusing to replace non-file: ${target}`);
        fs.mkdirSync(path.dirname(previous),{recursive:true});
        fs.copyFileSync(target,previous);
      }
      fs.mkdirSync(path.dirname(target),{recursive:true});
      const next = `${target}.tmp-${crypto.randomUUID()}`;
      try { fs.copyFileSync(path.join(stagedDir,file),next); rename(next,target); }
      finally { fs.rmSync(next,{force:true}); }
      changed.push({target,previous,existed});
    }
  } catch (error) {
    const failures = [];
    for (const file of changed.reverse()) {
      try { if (file.existed) fs.copyFileSync(file.previous,file.target); else fs.rmSync(file.target,{force:true}); }
      catch (rollback) { failures.push(rollback.message); }
    }
    if (failures.length) {
      const failure = new Error(`Could not restore all marketing assets. Original files remain at ${backupDir}: ${failures.join('; ')}`,{cause:error});
      failure.retainedBackup = backupDir;
      throw failure;
    }
    throw error;
  }
}
