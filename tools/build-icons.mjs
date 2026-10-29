#!/usr/bin/env node
// Ikony ChromeBlock: tarcza przecięta białym skosem, gradient „morski” (#22b8a8 → #0f7f8c).
// Jedno źródło (iconSvg) → tools/icons/*.svg (podgląd/edycja) i icons/icon{16,32,48,128}[-off].png.
//
//   npm run icons        generuje SVG i PNG (render w Chromium z Playwright, przezroczyste tło)
//
// Rozmiary:
//   128 px – grafika ok. 96 px z przezroczystym marginesem (zalecenie Chrome Web Store),
//   48 px  – grafika ok. 46 px,
//   32/16 px – grafika prawie na cały kwadrat i grubszy skos, żeby był czytelny na pasku narzędzi.
// Stan „wyłączony” (ochrona wyłączona na stronie): ta sama tarcza w szarym gradiencie.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SIZES = Object.freeze([16, 32, 48, 128]);
export const PALETTE = Object.freeze({
  on: ['#22b8a8', '#0f7f8c'], // paleta 4 („morski”)
  off: ['#b3b5bd', '#8d9099'],
});

// tarcza w układzie 128 (x 18–110, y 8–120)
const SHIELD = 'M64 8 L110 24 V60 C110 88 90 108 64 120 C38 108 18 88 18 60 V24 Z';
const SHIELD_BOX = { x: 18, y: 8, w: 92, h: 112 };
// wysokość grafiki w pikselach dla danego rozmiaru ikony
const ART_HEIGHT = { 16: 15.5, 32: 31, 48: 46, 128: 96 };

/** Skos: pas o kierunku (1,-1); `shift` = przesunięcie drugiej krawędzi (szerokość pasa ≈ shift·√2). */
function cut(shift) {
  return `M14 112 L106 20 L${106 + shift} ${20 + shift} L${14 + shift} ${112 + shift} Z`;
}

/** SVG ikony w danym rozmiarze. */
export function iconSvg(size, off = false) {
  const art = ART_HEIGHT[size] || size * 0.75;
  const units = (SHIELD_BOX.h * size) / art; // bok kwadratu w jednostkach układu tarczy
  const x0 = SHIELD_BOX.x - (units - SHIELD_BOX.w) / 2;
  const y0 = SHIELD_BOX.y - (units - SHIELD_BOX.h) / 2;
  const [c1, c2] = off ? PALETTE.off : PALETTE.on;
  const shift = size <= 32 ? 15 : 12; // w małych rozmiarach szerszy skos
  const id = off ? 'off' : 'on';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${round(x0)} ${round(y0)} ${round(units)} ${round(units)}">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <clipPath id="c-${id}"><path d="${SHIELD}"/></clipPath>
  </defs>
  <path d="${SHIELD}" fill="url(#g-${id})"/>
  <g clip-path="url(#c-${id})"><path d="${cut(shift)}" fill="#fff"/></g>
</svg>
`;
}

const round = (n) => Math.round(n * 100) / 100;

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
  console.log(`✓ ikony: ${files.join(', ')}`);
  console.log('✓ źródła SVG: tools/icons/icon.svg, tools/icons/icon-off.svg');
}
