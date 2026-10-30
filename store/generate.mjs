#!/usr/bin/env node
// Apex AdBlocker – zrzuty ekranu (1280×800) i kafelek promocyjny (440×280) do Chrome Web Store.
//
//   npm run package:dev && node store/generate.mjs
//
// 1. Zrzuty prawdziwego rozszerzenia z dist/Apex-AdBlocker na fikcyjnej stronie demo (store/tools/).
// 2. Kompozycja z nagłówkami w języku wpisu (en, pl) → store/screenshots/<lang>/, store/promo/.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { capture } from './tools/capture.mjs';
import { launch, sleep } from './tools/harness.mjs';

const STORE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(STORE, '..');
const EXT = path.join(ROOT, 'dist', 'Apex-AdBlocker');
if (!fs.existsSync(path.join(EXT, 'manifest.json'))) { console.error('Brak dist/Apex-AdBlocker – uruchom najpierw: npm run package:dev'); process.exit(2); }

const RAW = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-store-raw-'));
await capture(EXT, RAW, (...a) => console.log('  ', ...a));
const raw = (name) => 'data:image/png;base64,' + fs.readFileSync(path.join(RAW, name)).toString('base64');
const logo = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(ROOT, 'icons', 'logo.svg')).toString('base64');
const icon32 = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'icons', 'icon32.png')).toString('base64');

const TEXT = {
  en: {
    s1: ['Blocks ads and trackers.', 'No setup needed.', 'Protection starts the moment you install it – one trusted set of filter lists, nothing to configure.'],
    before: 'Without Apex AdBlocker', after: 'With Apex AdBlocker',
    s2: ['Protection status', 'at a glance.', 'See what was blocked on the current tab and turn protection off for a site with one click.'],
    s3: ['Hide anything', 'in two clicks.', 'Point at a leftover banner or annoying box, click – and it stays hidden, even after reloading.'],
    s4: ['Simple settings.', 'No accounts.', 'Ads, tracking and malicious sites are always covered. Add your own filters or back up your settings.'],
    s5: ['Private by design.', 'Everything stays local.', 'No servers, no telemetry, no remote code. Your settings never leave your browser.'],
    chips: ['No telemetry', 'No accounts', 'No remote code', 'Free'],
    tile: ['Apex AdBlocker', 'Blocks ads & trackers', 'No setup · No telemetry'],
  },
  pl: {
    s1: ['Blokuje reklamy i śledzenie.', 'Bez konfiguracji.', 'Ochrona działa od chwili instalacji – jeden zestaw sprawdzonych list, nic do ustawiania.'],
    before: 'Bez Apex AdBlocker', after: 'Z Apex AdBlocker',
    s2: ['Stan ochrony', 'w jednym spojrzeniu.', 'Zobacz, co zostało zablokowane na karcie, i jednym kliknięciem wyłącz ochronę na stronie.'],
    s3: ['Ukryj wszystko', 'w dwa kliknięcia.', 'Wskaż pozostały baner albo irytujące okienko, kliknij – i zniknie na stałe, także po odświeżeniu.'],
    s4: ['Proste ustawienia.', 'Bez kont.', 'Reklamy, śledzenie i złośliwe strony są zawsze blokowane. Dodaj własne filtry albo zrób kopię ustawień.'],
    s5: ['Prywatność od podstaw.', 'Wszystko zostaje lokalnie.', 'Bez serwerów, telemetrii i zdalnego kodu. Twoje ustawienia nie opuszczają przeglądarki.'],
    chips: ['Bez telemetrii', 'Bez kont', 'Bez zdalnego kodu', 'Za darmo'],
    tile: ['Apex AdBlocker', 'Blokuje reklamy i śledzenie', 'Bez konfiguracji · Bez telemetrii'],
  },
};

const CSS = `
*{box-sizing:border-box}body{margin:0;width:1280px;height:800px;overflow:hidden;font-family:"Segoe UI",Inter,system-ui,-apple-system,sans-serif;color:#0d2b2e;
background:radial-gradient(1200px 700px at 100% 0%,#d7f3ef 0%,rgba(215,243,239,0) 60%),linear-gradient(160deg,#f4fbfa 0%,#ffffff 55%,#eef8f7 100%)}
.head{position:absolute;left:72px;top:64px;width:430px}.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:18px;color:#0f7f8c;margin-bottom:34px}
.brand img{width:30px;height:30px}h1{margin:0;font-size:46px;line-height:1.08;letter-spacing:-1px;font-weight:800}h1 span{display:block;color:#0f7f8c}
p.sub{margin:22px 0 0;font-size:19px;line-height:1.5;color:#3b5759}
.frame{position:absolute;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 30px 70px rgba(13,43,46,.22),0 2px 6px rgba(13,43,46,.08)}
.bar{height:38px;background:#eef1f3;display:flex;align-items:center;gap:7px;padding:0 14px;border-bottom:1px solid #dde3e6}
.dot{width:11px;height:11px;border-radius:50%;background:#ff5f57}.dot:nth-child(2){background:#febc2e}.dot:nth-child(3){background:#28c840}
.url{margin-left:14px;flex:1;height:24px;border-radius:12px;background:#fff;font-size:12.5px;color:#56676a;display:flex;align-items:center;padding:0 12px}
.ext{width:22px;height:22px;margin-left:8px;border-radius:6px;display:flex;align-items:center;justify-content:center}.ext.on{background:#d6efec}
.ext img{width:16px;height:16px}.shot{display:block;width:100%}
.label{position:absolute;top:-34px;left:0;font-weight:700;font-size:15px;padding:5px 12px;border-radius:20px}
.label.bad{background:#ffe2e2;color:#b42318}.label.good{background:#d6f5ef;color:#0b6b5f}
.popup{position:absolute;border-radius:12px;overflow:hidden;box-shadow:0 22px 50px rgba(13,43,46,.35),0 0 0 1px rgba(13,43,46,.08);background:#fff}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.chip{background:#fff;border:1.5px solid #bfe7e1;color:#0b6b5f;font-weight:700;font-size:15px;padding:8px 14px;border-radius:22px}
`;
// region: fragment zrzutu 1280×800 { sx, sy, sw } pokazany na całej szerokości ramki
const frame = ({ x, y, w, src, url, label, cls, iconOn = true, cropH, region }) => {
  const k = region ? w / region.sw : w / 1280;
  const img = region
    ? `<img src="${src}" style="display:block;width:${1280 * k}px;margin:${-region.sy * k}px 0 0 ${-region.sx * k}px">`
    : `<img class="shot" src="${src}">`;
  return `<div class="frame" style="left:${x}px;top:${y}px;width:${w}px;overflow:visible">
${label ? `<div class="label ${cls}">${label}</div>` : ''}<div style="border-radius:14px;overflow:hidden"><div class="bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><div class="url">${url}</div>
<div class="ext ${iconOn ? 'on' : ''}"><img src="${icon32}"></div></div>
<div style="${cropH ? `height:${cropH}px;overflow:hidden` : ''}">${img}</div></div></div>`;
};
const head = (t, extra = '') => `<div class="head"><div class="brand"><img src="${logo}">Apex AdBlocker</div><h1>${t[0]}<span>${t[1]}</span></h1><p class="sub">${t[2]}</p>${extra}</div>`;
const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`;

function screens(lang) {
  const T = TEXT[lang];
  const site = 'dailynews.example';
  return {
    '1-ads-blocked': page(`${head(T.s1)}
      ${frame({ x: 545, y: 120, w: 640, src: raw(`demo-before-${lang}.png`), url: site, label: T.before, cls: 'bad', iconOn: false, cropH: 400 })}
      ${frame({ x: 600, y: 420, w: 640, src: raw(`demo-after-${lang}.png`), url: site, label: T.after, cls: 'good', cropH: 330 })}`),
    '2-popup': page(`${head(T.s2)}
      ${frame({ x: 545, y: 80, w: 700, src: raw(`demo-after-${lang}.png`), url: site, cropH: 600, region: { sx: 40, sy: 0, sw: 780 } })}
      <div class="popup" style="left:880px;top:128px;width:340px"><img src="${raw(`popup-${lang}.png`)}" style="display:block;width:340px"></div>`),
    '3-hide-element': page(`${head(T.s3)}
      ${frame({ x: 545, y: 80, w: 700, src: raw(`picker-${lang}.png`), url: site, cropH: 600, region: { sx: 400, sy: 45, sw: 880 } })}`),
    '4-settings': page(`${head(T.s4)}
      ${frame({ x: 545, y: 80, w: 700, src: raw(`options-${lang}.png`), url: 'Apex AdBlocker', cropH: 600, region: { sx: 250, sy: 0, sw: 780 } })}`),
    '5-privacy': page(`${head(T.s5, `<div class="chips">${T.chips.map((c) => `<span class="chip">✓ ${c}</span>`).join('')}</div>`)}
      ${frame({ x: 545, y: 80, w: 700, src: raw(`welcome-${lang}.png`), url: 'Apex AdBlocker', cropH: 600, region: { sx: 290, sy: 0, sw: 700 } })}`),
  };
}

const tile = (lang) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:440px;height:280px;overflow:hidden;font-family:"Segoe UI",Inter,system-ui,sans-serif;
background:radial-gradient(420px 300px at 100% 0%,#cdeee9 0%,rgba(205,238,233,0) 70%),linear-gradient(150deg,#f3fbfa,#ffffff 60%,#e8f6f4);display:flex;align-items:center;gap:22px;padding:0 34px}
img{width:118px;height:118px;flex:none}h1{margin:0;font-size:31px;letter-spacing:-.6px;color:#0d2b2e;font-weight:800}
.t{font-size:18px;font-weight:700;color:#0f7f8c;margin-top:8px;line-height:1.25}.s{font-size:13.5px;color:#4b6466;margin-top:10px}
</style></head><body><img src="${logo}"><div><h1>${TEXT[lang].tile[0]}</h1><div class="t">${TEXT[lang].tile[1]}</div><div class="s">${TEXT[lang].tile[2]}</div></div></body></html>`;

const b = await launch({ lang: 'en' });
const render = async (html, file, w, h) => {
  const tmp = path.join(RAW, 'page.html');
  fs.writeFileSync(tmp, html);
  const p = await b.newPage(null, { w, h });
  await p.goto('file://' + tmp, 1200);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, await p.shot({ x: 0, y: 0, width: w, height: h }));
  await p.send('Target.closeTarget', { targetId: p.targetId }).catch(() => {});
  await b.browser.send('Target.closeTarget', { targetId: p.targetId }).catch(() => {});
  console.log('✓', path.relative(ROOT, file));
};
for (const lang of ['en', 'pl']) {
  for (const [name, html] of Object.entries(screens(lang))) await render(html, path.join(STORE, 'screenshots', lang, `${name}.png`), 1280, 800);
  await render(tile(lang), path.join(STORE, 'promo', `small-tile-440x280${lang === 'en' ? '' : '-pl'}.png`), 440, 280);
}
await sleep(100);
await b.close();
fs.rmSync(RAW, { recursive: true, force: true });
