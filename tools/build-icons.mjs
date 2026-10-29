#!/usr/bin/env node
// Apex AdBlocker – ikony marki „Apex A”, gradient morski (#22b8a8 → #0f7f8c).
// Jedno źródło (iconSvg) → tools/icons/*.svg (podgląd/edycja) i icons/icon{16,32,48,128}[-off].png.
//
//   npm run icons        generuje SVG i PNG (render w Chromium z Playwright, przezroczyste tło)
//
// Concept 1: stylizowane A / szczyt + czytelny symbol blokowania.
// Stan „wyłączony” zachowuje ten sam znak w szarym gradiencie.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SIZES = Object.freeze([16, 32, 48, 128]);
export const PALETTE = Object.freeze({
  on: ['#22b8a8', '#0f7f8c'],
  off: ['#b3b5bd', '#8d9099'],
});

/** SVG ikony „Apex A” w danym rozmiarze. */
export function iconSvg(size, off = false) {
  const [c1, c2] = off ? PALETTE.off : PALETTE.on;
  const id = off ? 'off' : 'on';
  const border = off ? '#dddddf' : '#d6ece9';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
  </defs>
  <rect x="7" y="7" width="114" height="114" rx="27" fill="#fff" stroke="${border}" stroke-width="2"/>
  <path fill="url(#g-${id})" fill-rule="evenodd" d="M64 17 108 103H87L64 57 40 103H19L64 17Zm0 31-10 21h20L64 48Z"/>
  <path d="M34 94C50 78 72 70 96 76" fill="none" stroke="url(#g-${id})" stroke-width="12" stroke-linecap="round"/>
  <circle cx="92" cy="84" r="18" fill="${c2}" fill-opacity="0.94" stroke="#fff" stroke-width="7"/>
  <path d="M79 71 105 97" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
</svg>
`;
}

/** Generuje SVG (tools/icons) i PNG (icons/). */
export async function buildIcons({ outDir = path.join(ROOT, 'icons'), svgDir = path.join(ROOT, 'tools', 'icons') } = {}) {
  const { loadPlaywright } = await import(pathToFileURL(path.join(ROOT, 'tools', 'chromium-smoke.mjs')).href);
  const chromium = await loadPlaywright();
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(svgDir, { recursive: true });
  fs.writeFileSync(path.join(svgDir, 'icon.svg'), iconSvg(128, false));
  fs.writeFileSync(path.join(svgDir, 'icon-off.svg'), iconSvg(128, true));
  const browser = await chromium.launch();
  const written = [];
  try {
    const page = await browser.newPage({ viewport: { width: 200, height: 200 }, deviceScaleFactor: 1 });
    for (const off of [false, true]) {
      for (const size of SIZES) {
        await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${iconSvg(size, off)}</body></html>`);
        const file = path.join(outDir, `icon${size}${off ? '-off' : ''}.png`);
        await page.screenshot({ path: file, clip: { x: 0, y: 0, width: size, height: size }, omitBackground: true });
        written.push(path.relative(ROOT, file));
      }
    }
  } finally { await browser.close(); }
  return written;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const files = await buildIcons();
  console.log(`✓ ikony Apex AdBlocker: ${files.join(', ')}`);
  console.log('✓ źródła SVG: tools/icons/icon.svg, tools/icons/icon-off.svg');
}
