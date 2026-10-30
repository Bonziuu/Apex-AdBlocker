// Ikony i kolorystyka Apex AdBlocker: paleta „morski” (#22b8a8 → #0f7f8c) w ikonach (źródło: tools/build-icons.mjs)
// i ten sam akcent w popupie, Opcjach i ekranie powitalnym. Offline, bez renderowania.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SIZES, PALETTE, iconSvg, logoFiles } from '../../tools/build-icons.mjs';

/** Wymiary z nagłówka IHDR pliku PNG. */
function pngSize(file) {
  const b = fs.readFileSync(file);
  assert.equal(b.toString('latin1', 1, 4), 'PNG', `${file}: to nie PNG`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

test('ikony: wszystkie rozmiary z manifestu i wersje „off” istnieją i mają właściwe wymiary', () => {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  const refs = new Map([...Object.entries(m.icons), ...Object.entries(m.action.default_icon)]);
  for (const [size, rel] of refs) assert.deepEqual(pngSize(path.join(ROOT, rel)), [+size, +size], rel);
  // stan „ochrona wyłączona na stronie” (background.js: updateIcon → icon{16,32,48}-off.png)
  for (const size of SIZES) {
    assert.deepEqual(pngSize(path.join(ROOT, 'icons', `icon${size}.png`)), [size, size]);
    assert.deepEqual(pngSize(path.join(ROOT, 'icons', `icon${size}-off.png`)), [size, size]);
  }
});

test('ikony: źródło SVG w repozytorium (poza paczką) i paleta „morski”', () => {
  assert.deepEqual(PALETTE.on, ['#22b8a8', '#0f7f8c']);
  for (const f of ['icon.svg', 'icon-off.svg']) assert.ok(fs.existsSync(path.join(ROOT, 'tools', 'icons', f)), f);
  assert.equal(fs.readFileSync(path.join(ROOT, 'tools', 'icons', 'icon.svg'), 'utf8'), iconSvg(128, false), 'tools/icons/icon.svg aktualny (npm run icons)');
  assert.equal(fs.readFileSync(path.join(ROOT, 'tools', 'icons', 'icon-off.svg'), 'utf8'), iconSvg(128, true), 'tools/icons/icon-off.svg aktualny (npm run icons)');
  for (const size of SIZES) {
    const on = iconSvg(size, false);
    const off = iconSvg(size, true);
    assert.match(on, new RegExp(`width="${size}" height="${size}"`));
    for (const c of PALETTE.on) { assert.ok(on.includes(c), `${size}: ${c}`); assert.ok(!off.includes(c), `${size} off: bez ${c}`); }
    for (const c of PALETTE.off) assert.ok(off.includes(c), `${size} off: ${c}`);
  }
});

test('logo marki (brand/): sam znak bez badge\'a, pliki aktualne i poza paczką rozszerzenia', async () => {
  for (const [name, svg] of logoFiles()) {
    const file = path.join(ROOT, 'brand', name);
    assert.ok(fs.existsSync(file), `brand/${name} (npm run icons)`);
    assert.doesNotMatch(svg, /<circle|<rect/, `${name}: bez badge'a stanu`);
    if (name.endsWith('.svg')) assert.equal(fs.readFileSync(file, 'utf8'), svg, `brand/${name} aktualny`);
    else { const n = Number(/(\d+)\.png$/.exec(name)[1]); assert.deepEqual(pngSize(file), [n, n], name); }
  }
  const { EXTENSION_ENTRIES } = await import('../../tools/chromium-smoke.mjs');
  assert.ok(!EXTENSION_ENTRIES.includes('brand'), 'logo nie trafia do paczki rozszerzenia');
});

test('kolorystyka: ten sam akcent w popupie, Opcjach i ekranie powitalnym (jasny i ciemny motyw)', () => {
  for (const f of ['popup/popup.css', 'options/options.css', 'welcome/welcome.css']) {
    const css = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const [light, dark] = css.split(/@media \(prefers-color-scheme: dark\)/);
    assert.ok(dark, `${f}: motyw ciemny`);
    assert.match(light, /--accent: #0f7f8c;/, `${f}: akcent jasny`);
    assert.match(dark, /--accent: #22b8a8;/, `${f}: akcent ciemny`);
    // dawna paleta fioletowa nie zostaje nigdzie w UI
    assert.doesNotMatch(css, /#5b5bd6|#8b8bf0|#a3a3f5|#ececfd|#2a2a48|#4b4bc4|#4c4cc4/i, `${f}: resztki fioletu`);
    // tekst na przyciskach z tłem akcentu: kolor z motywu (ciemny napis w ciemnym motywie – kontrast)
    if (/background: var\(--accent\)/.test(css)) {
      assert.doesNotMatch(css, /background: var\(--accent\); color: #fff/, `${f}: biały napis na akcencie w obu motywach`);
      assert.match(light, /--on-accent: #ffffff;/, f);
      assert.match(dark, /--on-accent: #0b1d20;/, f);
    }
  }
});
