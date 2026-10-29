#!/usr/bin/env node
// Apex AdBlocker – paczka do uploadu w Chrome Web Store.
//
//   npm run package:store
//
// Tworzy w dist/:
//   Apex-AdBlocker/                         czysty katalog rozszerzenia do smoke testu
//   Apex-AdBlocker-WebStore-<version>.zip  ZIP z manifest.json w katalogu głównym
//
// Bez START-HERE.txt i bez nadrzędnego folderu Apex-AdBlocker/ w ZIP-ie.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  ROOT,
  ZIP_NAME as DEV_ZIP_NAME,
  createZip,
  listFiles,
  packageDev,
} from './package-dev.mjs';

/** Buduje ZIP gotowy do uploadu w Chrome Web Store. */
export function packageStore({ root = ROOT, outDir = path.join(root, 'dist') } = {}) {
  const dev = packageDev({ root, outDir });
  const files = listFiles(dev.extDir);
  const zipName = `Apex-AdBlocker-WebStore-${dev.version}.zip`;
  const zipPath = path.join(outDir, zipName);

  const entries = files.map((file) => ({
    name: file,
    data: fs.readFileSync(path.join(dev.extDir, file)),
  }));

  fs.writeFileSync(zipPath, createZip(entries));
  fs.rmSync(path.join(outDir, DEV_ZIP_NAME), { force: true });

  return {
    ...dev,
    zipName,
    zipPath,
    zipBytes: fs.statSync(zipPath).size,
  };
}

function main() {
  const r = packageStore();
  const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
  console.log(`✓ Apex AdBlocker ${r.version}: paczka Chrome Web Store gotowa`);
  console.log(`  ${rel(r.zipPath)} (${(r.zipBytes / 1024 / 1024).toFixed(1)} MB)`);
  console.log('  manifest.json znajduje się w katalogu głównym ZIP-a');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
