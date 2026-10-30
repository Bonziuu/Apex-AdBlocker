#!/usr/bin/env node
// Apex AdBlocker – ikony marki „Apex A”, gradient morski (#22b8a8 → #0f7f8c).
// Responsive mark: 16/32 px = uproszczone „A” na przezroczystym tle,
// 48/128 px = znak marki z badge'em stanu: ✓ w kółku (ochrona działa) / pauza (ochrona wyłączona).
// Jedno źródło (iconSvg) → tools/icons/*.svg (podgląd/edycja) i icons/icon{16,32,48,128}[-off].png.
//
//   npm run icons        generuje SVG i PNG (render w Chromium z Playwright, przezroczyste tło)
//
// Małe rozmiary celowo nie mają białego kafelka ani drobnego badge'a – mają być czytelne
// na jasnym i ciemnym pasku Chrome. Stan „wyłączony” zachowuje ten sam znak w szarości.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SIZES = Object.freeze([16, 32, 48, 128]);
export const PALETTE = Object.freeze({
  on: ['#22b8a8', '#0f7f8c'],
  off: ['#c2c4ca', '#777b85'],
});

function gradient(id, c1, c2, x2 = '0.42') {
  return `<linearGradient id="g-${id}" x1="0" y1="0" x2="${x2}" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
}

// Symbol w badge'u (zastępuje dawne przekreślone kółko, które było nieczytelne i pokazywało
// „blokuję” także przy wyłączonej ochronie): ptaszek = ochrona działa, pauza = ochrona wyłączona.
const CHECK = '<path d="M84 88.5 91 95.5 104.5 81" fill="none" stroke="#fff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>';
const PAUSE = '<rect x="85.5" y="78" width="6" height="20" rx="2" fill="#fff"/><rect x="96.5" y="78" width="6" height="20" rx="2" fill="#fff"/>';

/** SVG ikony „Apex A” w danym rozmiarze. */
export function iconSvg(size, off = false) {
  const [c1, c2] = off ? PALETTE.off : PALETTE.on;
  const id = off ? 'off' : 'on';

  if (size <= 32) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
  <defs>
    ${gradient(id, c1, c2, '0.45')}
  </defs>
  <path fill="url(#g-${id})" fill-rule="evenodd" d="M64 5 121 120H92L64 64 35 120H7L64 5ZM64 47 54 69H74L64 47Z"/>
</svg>
`;
  }

  const ring = off ? '#696d76' : '#0b6670';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
  <defs>
    ${gradient(id, c1, c2)}
  </defs>
  <path fill="url(#g-${id})" fill-rule="evenodd" d="M64 7 116 112H91L64 59 37 112H12L64 7Zm0 34-12 25h24L64 41Z"/>
  <circle cx="94" cy="88" r="19" fill="${c2}" fill-opacity="0.98" stroke="${ring}" stroke-width="4"/>
  ${off ? PAUSE : CHECK}
</svg>
`;
}

/** Rozmiary dużego logo marki (brand/, poza paczką rozszerzenia). */
export const LOGO_SIZES = Object.freeze([512, 1024]);

/**
 * Duże logo marki: sam znak „Apex A” bez badge'a stanu (Chrome Web Store, strona, materiały).
 * `padding` = przezroczysty margines w jednostkach viewBox 128 (16 = wytyczne ikony 128 px w Chrome Web Store).
 */
export function logoSvg(size, { padding = 0 } = {}) {
  const k = (128 - 2 * padding) / 128;
  const mark = '<path fill="url(#g-logo)" fill-rule="evenodd" d="M64 7 116 112H91L64 59 37 112H12L64 7Zm0 34-12 25h24L64 41Z"/>';
  // znak zajmuje y 7–112 (środek 59,5) – przesuwamy o 4,5, żeby był wyśrodkowany w pionie
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
  <defs>
    ${gradient('logo', ...PALETTE.on)}
  </defs>
  <g transform="translate(${padding} ${padding + 4.5 * k}) scale(${k})">${mark}</g>
</svg>
`;
}

/** Pliki logo: [ścieżka względna w brand/, SVG]. */
export function logoFiles() {
  return [
    ['apex-logo.svg', logoSvg(1024)],
    ...LOGO_SIZES.map((s) => [`apex-logo-${s}.png`, logoSvg(s)]),
    ['apex-store-icon-128.png', logoSvg(128, { padding: 16 })],
  ];
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
    // duże logo marki (brand/): PNG renderowane w rozmiarze docelowym
    const brandDir = path.join(ROOT, 'brand');
    fs.mkdirSync(brandDir, { recursive: true });
    for (const [name, svg] of logoFiles()) {
      const file = path.join(brandDir, name);
      if (name.endsWith('.svg')) { fs.writeFileSync(file, svg); written.push(path.relative(ROOT, file)); continue; }
      const size = Number(/(\d+)\.png$/.exec(name)[1]);
      await page.setViewportSize({ width: size, height: size });
      await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${svg}</body></html>`);
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: size, height: size }, omitBackground: true });
      written.push(path.relative(ROOT, file));
    }
  } finally { await browser.close(); }
  return written;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const files = await buildIcons();
  console.log(`✓ ikony Apex AdBlocker: ${files.join(', ')}`);
  console.log('✓ źródła SVG: tools/icons/icon.svg, tools/icons/icon-off.svg');
}
