#!/usr/bin/env node
// Apex AdBlocker – obrazki do README i opisów wydań na GitHubie: kafelki i zrzuty ze store/
// z zaokrąglonymi, przezroczystymi rogami i delikatną obwódką. Na ciemnym motywie GitHuba wyglądają
// jak karty zamiast białych prostokątów (GitHub nie pozwala zaokrąglić obrazka stylem).
// Zrzuty do Chrome Web Store zostają bez zmian.
//
//   node store/github-images.mjs      (po node store/generate.mjs)

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launch } from './tools/harness.mjs';

const STORE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(STORE, 'github');

export const GITHUB_IMAGES = Object.freeze([
  // [źródło w store/, plik w store/github/, promień rogów]
  ['promo/small-tile-440x280-pl.png', 'tile-pl.png', 22],
  ['promo/small-tile-440x280.png', 'tile-en.png', 22],
  ['screenshots/pl/1-ads-blocked.png', 'ads-blocked-pl.png', 26],
  ['screenshots/en/1-ads-blocked.png', 'ads-blocked-en.png', 26],
  ['screenshots/pl/2-popup.png', 'popup-pl.png', 26],
  ['screenshots/pl/3-hide-element.png', 'hide-element-pl.png', 26],
]);

const pngSize = (file) => { const b = fs.readFileSync(file); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

export async function buildGithubImages({ storeDir = STORE, outDir = path.join(storeDir, 'github') } = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-gh-img-'));
  const b = await launch({ lang: 'en' });
  try {
    for (const [src, dst, r] of GITHUB_IMAGES) {
      const file = path.join(storeDir, src);
      const [w, h] = pngSize(file);
      const html = `<!doctype html><html><head><style>html,body{margin:0;background:transparent}
        .c{width:${w}px;height:${h}px;border-radius:${r}px;overflow:hidden;position:relative}
        .c img{display:block;width:${w}px;height:${h}px}
        .c::after{content:"";position:absolute;inset:0;border-radius:${r}px;box-shadow:inset 0 0 0 1px rgba(13,43,46,.14)}</style></head>
        <body><div class="c"><img src="data:image/png;base64,${fs.readFileSync(file).toString('base64')}"></div></body></html>`;
      const page = path.join(tmp, 'p.html');
      fs.writeFileSync(page, html);
      const p = await b.newPage(null, { w, h });
      await p.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
      await p.goto(pathToFileURL(page).href, 800);
      fs.writeFileSync(path.join(outDir, dst), await p.shot({ x: 0, y: 0, width: w, height: h }));
      await b.browser.send('Target.closeTarget', { targetId: p.targetId }).catch(() => {});
      console.log('✓', `store/github/${dst}`);
    }
  } finally {
    await b.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await buildGithubImages();
