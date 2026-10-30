#!/usr/bin/env node
// Apex AdBlocker – paczka dystrybucyjna dla użytkownika.
//
//   npm run package:release
//
// Tworzy w dist/:
//   Apex-AdBlocker/                 czysty katalog rozszerzenia
//   Apex-AdBlocker-<version>.zip    wersjonowana paczka dla GitHub Releases
//   Apex-AdBlocker.zip              stała nazwa do linku „latest/download/Apex-AdBlocker.zip”
//   SHA256SUMS.txt                  sumy kontrolne obu ZIP-ów
//
// ZIP zawiera START-HERE.txt oraz folder Apex-AdBlocker/ gotowy do wskazania
// przez „Załaduj rozpakowane” w chrome://extensions.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  ROOT,
  PACKAGE_NAME,
  ZIP_NAME as DEV_ZIP_NAME,
  createZip,
  listFiles,
  packageDev,
} from './package-dev.mjs';

export const LATEST_ZIP_NAME = 'Apex-AdBlocker.zip';
export const CHECKSUMS_NAME = 'SHA256SUMS.txt';

export function startHereText(version) {
  return `Apex AdBlocker ${version}\r\n\r\n` +
    'INSTALACJA W GOOGLE CHROME\r\n\r\n' +
    '1. Rozpakuj to archiwum do stałego miejsca na dysku.\r\n' +
    '2. Otwórz w Chrome: chrome://extensions\r\n' +
    '3. Włącz „Tryb dewelopera” w prawym górnym rogu.\r\n' +
    '4. Kliknij „Załaduj rozpakowane”.\r\n' +
    '5. Wskaż folder „Apex-AdBlocker” znajdujący się obok tego pliku.\r\n\r\n' +
    'WAŻNE: po instalacji nie usuwaj ani nie przenoś folderu Apex-AdBlocker.\r\n' +
    'Chrome korzysta z tego folderu podczas działania rozszerzenia.\r\n\r\n' +
    'AKTUALIZACJA\r\n\r\n' +
    'Pobierz nowszą paczkę, zastąp pliki w tym samym folderze Apex-AdBlocker,\r\n' +
    'a następnie kliknij „Odśwież” przy Apex AdBlocker w chrome://extensions.\r\n\r\n' +
    'Szczegółowa instrukcja: https://github.com/Bonziuu/Apex-AdBlocker/blob/main/docs/INSTALLATION.md\r\n\r\n' +
    '--------------------------------------------------------------------\r\n\r\n' +
    'INSTALLING IN GOOGLE CHROME\r\n\r\n' +
    '1. Extract this archive to a permanent location on your disk.\r\n' +
    '2. Open in Chrome: chrome://extensions\r\n' +
    '3. Turn on "Developer mode" in the top right corner.\r\n' +
    '4. Click "Load unpacked".\r\n' +
    '5. Select the "Apex-AdBlocker" folder next to this file.\r\n\r\n' +
    'IMPORTANT: do not delete or move the Apex-AdBlocker folder after installing.\r\n' +
    'Chrome uses this folder while the extension is running.\r\n\r\n' +
    'UPDATING\r\n\r\n' +
    'Download a newer package, replace the files in the same Apex-AdBlocker folder,\r\n' +
    'then click "Reload" next to Apex AdBlocker in chrome://extensions.\r\n';
}

/** Buduje gotową paczkę do publikacji w GitHub Releases. */
export function packageRelease({ root = ROOT, outDir = path.join(root, 'dist') } = {}) {
  const dev = packageDev({ root, outDir });
  const files = listFiles(dev.extDir);
  const versionedZipName = `Apex-AdBlocker-${dev.version}.zip`;
  const versionedZipPath = path.join(outDir, versionedZipName);
  const latestZipPath = path.join(outDir, LATEST_ZIP_NAME);
  const checksumsPath = path.join(outDir, CHECKSUMS_NAME);

  const entries = [
    { name: 'START-HERE.txt', data: Buffer.from(startHereText(dev.version), 'utf8') },
    ...files.map((file) => ({
      name: `${PACKAGE_NAME}/${file}`,
      data: fs.readFileSync(path.join(dev.extDir, file)),
    })),
  ];

  const zip = createZip(entries);
  fs.writeFileSync(versionedZipPath, zip);
  fs.writeFileSync(latestZipPath, zip);
  fs.rmSync(path.join(outDir, DEV_ZIP_NAME), { force: true });

  const digest = crypto.createHash('sha256').update(zip).digest('hex');
  fs.writeFileSync(
    checksumsPath,
    `${digest}  ${versionedZipName}\n${digest}  ${LATEST_ZIP_NAME}\n`,
    'utf8',
  );

  return {
    ...dev,
    versionedZipName,
    versionedZipPath,
    latestZipPath,
    checksumsPath,
    sha256: digest,
    zipBytes: zip.length,
  };
}

function main() {
  const r = packageRelease();
  const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
  console.log(`✓ Apex AdBlocker ${r.version}: paczka użytkownika gotowa`);
  console.log(`  ${rel(r.versionedZipPath)} (${(r.zipBytes / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`  ${rel(r.latestZipPath)} (stała nazwa dla linku latest)`);
  console.log(`  ${rel(r.checksumsPath)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
