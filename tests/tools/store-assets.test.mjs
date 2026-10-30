// Materiały do Chrome Web Store (store/): wymiary zrzutów i kafelka, uzasadnienie dla każdego
// uprawnienia z manifestu, polityka prywatności, folder store/ poza paczką rozszerzenia.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../../tools/lists-config.mjs';
import { EXTENSION_ENTRIES } from '../../tools/chromium-smoke.mjs';

const pngSize = (file) => { const b = fs.readFileSync(file); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const STORE = path.join(ROOT, 'store');
const README = fs.readFileSync(path.join(STORE, 'README.md'), 'utf8');

test('zrzuty ekranu: po 5 w każdym języku, 1280×800', () => {
  for (const lang of ['en', 'pl']) {
    const dir = path.join(STORE, 'screenshots', lang);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png'));
    assert.equal(files.length, 5, lang);
    for (const f of files) assert.deepEqual(pngSize(path.join(dir, f)), [1280, 800], `${lang}/${f}`);
  }
});

test('mały kafelek promocyjny 440×280 (en i pl)', () => {
  for (const f of ['small-tile-440x280.png', 'small-tile-440x280-pl.png']) assert.deepEqual(pngSize(path.join(STORE, 'promo', f)), [440, 280], f);
});

test('store/README.md: uzasadnienie każdego uprawnienia z manifestu i link do polityki prywatności', () => {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  for (const p of m.permissions) assert.match(README, new RegExp(`\\*\\*${p}\\*\\*`), `brak uzasadnienia: ${p}`);
  for (const h of m.host_permissions) assert.ok(README.includes(h), `brak uzasadnienia: ${h}`);
  assert.match(README, /https:\/\/github\.com\/Bonziuu\/Apex-AdBlocker\/blob\/main\/PRIVACY\.md/);
  assert.ok(fs.existsSync(path.join(ROOT, 'PRIVACY.md')));
});

test('polityka prywatności: wersja angielska i polska, uprawnienia z manifestu opisane', () => {
  const policy = fs.readFileSync(path.join(ROOT, 'PRIVACY.md'), 'utf8');
  assert.match(policy, /^# Privacy Policy/m);
  assert.match(policy, /^# Polityka prywatności/m);
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  for (const p of m.permissions) assert.ok(policy.includes(`**${p}**`), p);
});

test('store/ nie trafia do paczki rozszerzenia', () => {
  assert.ok(!EXTENSION_ENTRIES.includes('store'));
});
