// Ikony i kolorystyka Apex AdBlocker: paleta „morski” w ikonach (źródło: tools/build-icons.mjs, koncepcje A/B/C)
// i akcent w popupie, Opcjach i ekranie powitalnym. Offline, bez renderowania.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SIZES, PALETTE, CONCEPTS, ICON_CONCEPT, iconSvg } from '../../tools/build-icons.mjs';

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
  assert.deepEqual(PALETTE.on, ['#14a39f', '#0b8f9a']);
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

/** Kontrast WCAG między dwoma kolorami #rrggbb. */
function contrast(a, b) {
  const lum = (h) => {
    const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

test('ikony: kolory znaku mają kontrast ≥ 3:1 na jasnym i ciemnym pasku Chrome', () => {
  for (const c of [...PALETTE.on, ...PALETTE.off]) {
    for (const bar of ['#ffffff', '#35363a']) assert.ok(contrast(c, bar) >= 3, `${c} na ${bar}: ${contrast(c, bar).toFixed(2)}`);
  }
});

test('ikony: każda koncepcja ma wszystkie rozmiary, wyłączone bez kolorów marki, 128 px z marginesem', () => {
  assert.ok(Object.hasOwn(CONCEPTS, ICON_CONCEPT), 'domyślna koncepcja istnieje');
  for (const concept of Object.keys(CONCEPTS)) {
    for (const size of SIZES) {
      const on = iconSvg(size, false, concept);
      const off = iconSvg(size, true, concept);
      assert.ok(on.includes(PALETTE.on[0]), `${concept}/${size}: kolor marki`);
      for (const c of PALETTE.on) assert.ok(!off.includes(c), `${concept}/${size} off: bez ${c}`);
      assert.ok(off.includes(PALETTE.off[0]), `${concept}/${size} off: szary`);
      assert.notEqual(on.replace(/#[0-9a-f]{6}|url\(#g\)/gi, ''), off.replace(/#[0-9a-f]{6}|url\(#g\)/gi, ''), `${concept}/${size}: stan wyłączony różni się kształtem, nie tylko kolorem`);
      assert.equal(/translate\(16 16\) scale\(0\.75\)/.test(on), size === 128, `${concept}/${size}: margines tylko w 128 px`);
    }
  }
  assert.throws(() => iconSvg(16, false, 'Z'), /nieznana koncepcja/);
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
