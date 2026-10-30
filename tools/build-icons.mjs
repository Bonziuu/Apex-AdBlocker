#!/usr/bin/env node
// Apex AdBlocker – ikony rozszerzenia. Jedno źródło (iconSvg) → tools/icons/*.svg i icons/icon{16,32,48,128}[-off].png.
//
//   npm run icons                     generuje SVG i PNG (render w Chromium z Playwright, przezroczyste tło)
//   npm run icons -- --concept=A      inna koncepcja (A „Szczyt”, B „Tarcza z A” – domyślna, C „Kafelek”)
//
// Zasady wspólne dla wszystkich koncepcji (podgląd: docs/icons.md):
//   • włączone = znak wypełniony kolorem marki, wyłączone = znak pusty/przekreślony w szarości –
//     stan widać po KSZTAŁCIE, nie tylko po kolorze (daltonizm, ciemny pasek, 16 px),
//   • kolory z kontrastem ≥ 3:1 na jasnym i ciemnym pasku Chrome,
//   • 16/32 px: uproszczona litera z grubszymi nogami i większym otworem,
//   • 128 px (Chrome Web Store): grafika ~96 px + 16 px przezroczystego marginesu,
//   • zamiast przekreślonego kółka – tarcza (z ptaszkiem w koncepcji A) = „ochrona działa”.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SIZES = Object.freeze([16, 32, 48, 128]);
export const PALETTE = Object.freeze({
  on: ['#14a39f', '#0b8f9a'], // gradient marki (≥ 3:1 na #ffffff i #35363a)
  deep: '#08707a',            // ciemny akcent badge'a
  off: ['#7f848d'],           // stan wyłączony (≥ 3:1 na obu motywach)
});
export const ICON_CONCEPT = 'B';

// Litera „A” (szczyt) – zewnętrzny obrys + trójkątny otwór nad poprzeczką.
const A_OUTER = 'M64 8 L120 116 H92 L83 92 H45 L36 116 H8 Z';
const A_HOLE = 'M64 42 L75.4 72 H52.6 Z';
const A_PATH = `${A_OUTER} ${A_HOLE}`;
// Wersja 16/32 px: grubsze nogi i większy otwór, żeby nie zlał się w kropkę.
const A_SMALL = 'M64 4 L124 122 H90 L81 100 H47 L38 122 H4 Z M64 40 L77 76 H51 Z';

const SHIELD = 'M64 6 L112 22 V60 C112 92 92 112 64 124 C36 112 16 92 16 60 V22 Z';
const CHECK = 'M44 66 L58 80 L86 50';

const grad = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${PALETTE.on[0]}"/><stop offset="1" stop-color="${PALETTE.on[1]}"/></linearGradient>`;

// Ikona 128 px (Chrome Web Store, chrome://extensions): grafika ~96 px + 16 px marginesu.
const storePad = (size, body) => (size === 128 ? `<g transform="translate(16 16) scale(0.75)">${body}</g>` : body);
const svg = (size, defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128"><defs>${defs}</defs>${storePad(size, body)}</svg>`;

/** Mała tarcza z ptaszkiem = „ochrona działa” (zastępuje przekreślone kółko). */
function shieldBadge(cx, cy, r) {
  const s = r / 52; // tarcza 128 → promień badge'a
  return `<g transform="translate(${cx - 64 * s} ${cy - 66 * s}) scale(${s})">
    <path d="${SHIELD}" fill="${PALETTE.deep}"/>
    <path d="${CHECK}" fill="none" stroke="#fff" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;
}

// ─── Koncepcja A: „Szczyt” – ewolucja obecnego znaku ───────────────────────────
// Samo „A” bez fali. Włączone od 48 px: badge z tarczą i ptaszkiem („chroni”).
// Wyłączone: szare „A” przecięte ukośną kreską (kształt, nie tylko kolor).
export function conceptA(size, off) {
  const small = size <= 32;
  const glyph = small ? A_SMALL : A_PATH;
  const letter = `<path d="${glyph}" fill="${off ? PALETTE.off[0] : 'url(#g)'}" fill-rule="evenodd"/>`;
  // wyłączone: ukośne nacięcie przez literę (przezroczysta szczelina) – uniwersalny znak „wyłączone”
  const slash = off
    ? `<mask id="sl" maskUnits="userSpaceOnUse" x="0" y="0" width="128" height="128"><rect width="128" height="128" fill="#fff"/><path d="M20 16 L112 108" stroke="#000" stroke-width="${small ? 30 : 18}" stroke-linecap="round"/></mask>`
    : '';
  const slashLine = off ? `<path d="M20 16 L112 108" stroke="${PALETTE.off[0]}" stroke-width="${small ? 12 : 7}" stroke-linecap="round"/>` : '';
  if (small || off) return svg(size, (off ? '' : grad('g')) + slash, `<g${off ? ' mask="url(#sl)"' : ''}>${letter}</g>${slashLine}`);
  // włączone, od 48 px: tarcza z ptaszkiem, odcięta od litery przezroczystą szczeliną
  const [cx, cy, r] = [97, 95, 27];
  const mask = `<mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="128" height="128"><rect width="128" height="128" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="${r + 7}" fill="#000"/></mask>`;
  return svg(size, grad('g') + mask, `<g mask="url(#cut)">${letter}</g>${shieldBadge(cx, cy, r)}`);
}

// ─── Koncepcja B: „Tarcza z A” – od razu mówi „ochrona” ───────────────────────
// Tarcza (uniwersalny symbol blokera) z wyciętym białym „A”. Wyłączone: pusta tarcza.
export function conceptB(size, off) {
  const small = size <= 32;
  const glyph = small ? A_SMALL : A_PATH;
  const k = small ? 0.56 : 0.5;
  const a = `<g transform="translate(${64 - 64 * k} ${small ? 30 : 32}) scale(${k})"><path d="${glyph}" fill-rule="evenodd" fill="${off ? PALETTE.off[0] : '#fff'}"/></g>`;
  const shieldSw = small ? 20 : 12; // obrys przycięty do środka → widoczna połowa
  const body = off
    ? `<path d="${SHIELD}" fill="none" stroke="${PALETTE.off[0]}" stroke-width="${shieldSw}" stroke-linejoin="round" clip-path="url(#sc)"/>${a}`
    : `<path d="${SHIELD}" fill="url(#g)"/>${a}`;
  return svg(size, (off ? '' : grad('g')) + `<clipPath id="sc"><path d="${SHIELD}"/></clipPath>`, body);
}

// ─── Koncepcja C: „Kafelek” – styl ikony aplikacji ─────────────────────────────
// Zaokrąglony kafelek w kolorze marki z białym „A”: najwyższa czytelność na obu motywach.
// Wyłączone: pusty kafelek (kontur) i szare „A”.
export function conceptC(size, off) {
  const small = size <= 32;
  const glyph = small ? A_SMALL : A_PATH;
  const k = small ? 0.6 : 0.56;
  const a = `<g transform="translate(${64 - 64 * k} ${64 - 63 * k}) scale(${k})"><path d="${glyph}" fill-rule="evenodd" fill="${off ? PALETTE.off[0] : '#fff'}"/></g>`;
  const tile = 'M36 6 H92 A30 30 0 0 1 122 36 V92 A30 30 0 0 1 92 122 H36 A30 30 0 0 1 6 92 V36 A30 30 0 0 1 36 6 Z';
  const sw = small ? 20 : 12; // obrys przycięty do środka → widoczna połowa
  const body = off
    ? `<path d="${tile}" fill="none" stroke="${PALETTE.off[0]}" stroke-width="${sw}" clip-path="url(#tc)"/>${a}`
    : `<path d="${tile}" fill="url(#g)"/>${a}`;
  return svg(size, (off ? '' : grad('g')) + `<clipPath id="tc"><path d="${tile}"/></clipPath>`, body);
}


export const CONCEPTS = Object.freeze({ A: conceptA, B: conceptB, C: conceptC });

/** SVG ikony w danym rozmiarze i stanie (domyślnie koncepcja ICON_CONCEPT). */
export function iconSvg(size, off = false, concept = ICON_CONCEPT) {
  const fn = CONCEPTS[concept];
  if (!fn) throw new Error(`nieznana koncepcja ikon: ${concept} (dostępne: ${Object.keys(CONCEPTS).join(', ')})`);
  return fn(size, off) + '\n';
}

/** Generuje SVG (tools/icons) i PNG (icons/). */
export async function buildIcons({ outDir = path.join(ROOT, 'icons'), svgDir = path.join(ROOT, 'tools', 'icons'), concept = ICON_CONCEPT } = {}) {
  const { loadPlaywright } = await import(pathToFileURL(path.join(ROOT, 'tools', 'chromium-smoke.mjs')).href);
  const chromium = await loadPlaywright();
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(svgDir, { recursive: true });
  fs.writeFileSync(path.join(svgDir, 'icon.svg'), iconSvg(128, false, concept));
  fs.writeFileSync(path.join(svgDir, 'icon-off.svg'), iconSvg(128, true, concept));
  const browser = await chromium.launch();
  const written = [];
  try {
    const page = await browser.newPage({ viewport: { width: 200, height: 200 }, deviceScaleFactor: 1 });
    for (const off of [false, true]) {
      for (const size of SIZES) {
        await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${iconSvg(size, off, concept)}</body></html>`);
        const file = path.join(outDir, `icon${size}${off ? '-off' : ''}.png`);
        await page.screenshot({ path: file, clip: { x: 0, y: 0, width: size, height: size }, omitBackground: true });
        written.push(path.relative(ROOT, file));
      }
    }
  } finally { await browser.close(); }
  return written;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const arg = process.argv.find((a) => a.startsWith('--concept='));
  const files = await buildIcons({ concept: arg ? arg.slice('--concept='.length).toUpperCase() : ICON_CONCEPT });
  console.log(`✓ ikony Apex AdBlocker: ${files.join(', ')}`);
  console.log('✓ źródła SVG: tools/icons/icon.svg, tools/icons/icon-off.svg');
}
