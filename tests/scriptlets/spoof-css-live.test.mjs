// spoof-css w prawdziwym Chromium, bez internetu: atrapa strony w stylu wykop.pl (ctx.route).
// Strona ukrywa slot reklamowy prawdziwym CSS (position:absolute; top:-4000px; visibility:hidden),
// a jej skrypt sprawdza getComputedStyle(slot) i – gdy wykryje ukrycie – wstawia .reinjected-ad.
//   bez rozszerzenia: strona widzi ukrycie → .reinjected-ad się pojawia,
//   z ChromeBlock (filtr uBlock filters: wykop.pl##+js(spoof-css, .pub-slot-wrapper, visibility, visible, top, 0px)):
//     kod strony widzi visibility: visible i top: 0px → .reinjected-ad się NIE pojawia,
//     a rzeczywisty rendering (świat izolowany, getBoundingClientRect) pozostaje ukryty.
// Brak Playwright/Chromium → SKIP.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPlaywright, EXTENSION_ENTRIES, ROOT } from '../../tools/chromium-smoke.mjs';
import { evalIsolated } from '../local/single-blocker-sites.mjs';

let chromium = null;
try { chromium = await loadPlaywright(); } catch { chromium = null; }
let exe = '';
try { exe = chromium ? chromium.executablePath() : ''; } catch { /* */ }
const skip = !chromium || !exe || !fs.existsSync(exe) ? 'Playwright/Chromium niedostępne' : false;

const PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>Atrapa</title>
<style>.pub-slot-wrapper{position:absolute;top:-4000px;visibility:hidden;pointer-events:none}</style></head>
<body><main><h1>Wykopalisko</h1><p>Treść strony.</p>
<div class="pub-slot-wrapper" id="slot"><img src="/a.png" width="300" height="250" alt=""></div>
<div class="other" id="other" style="visibility:hidden;position:absolute;top:-10px">x</div></main>
<script>
window.__checks = [];
function check(when) {
  const slot = document.getElementById('slot');
  const cs = getComputedStyle(slot);
  const r = {
    when, visibility: cs.visibility, top: cs.top, gpvVisibility: cs.getPropertyValue('visibility'), gpvTop: cs.getPropertyValue('top'),
    dashedKey: cs['top'], position: cs.position, gpvPosition: cs.getPropertyValue('position'), pointerEvents: cs.pointerEvents,
    priority: cs.getPropertyPriority('visibility'), item0: typeof cs.item(0), length: cs.length > 0, isDecl: cs instanceof CSSStyleDeclaration,
    other: getComputedStyle(document.getElementById('other')).visibility, otherTop: getComputedStyle(document.getElementById('other')).top,
    pseudo: getComputedStyle(slot, '::before').visibility, rectTop: Math.round(slot.getBoundingClientRect().top),
    // introspekcja (porównywana z przebiegiem bez rozszerzenia)
    descVisibility: (() => { const d = Object.getOwnPropertyDescriptor(cs, 'visibility'); return d ? ('value' in d ? d.value : 'accessor') : null; })(),
    descTop: (() => { const d = Object.getOwnPropertyDescriptor(cs, 'top'); return d ? ('value' in d ? d.value : 'accessor') : null; })(),
    introspect: {
      gpvToString: cs.getPropertyValue.toString(), gpvFnToString: Function.prototype.toString.call(cs.getPropertyValue),
      names: [cs.getPropertyValue.name, cs.item.name, cs.getPropertyPriority.name, cs.getPropertyValue.length, cs.item.length],
      itemToString: Function.prototype.toString.call(cs.item),
      gcsToString: getComputedStyle.toString(), gcsFnToString: Function.prototype.toString.call(getComputedStyle), gcsName: getComputedStyle.name, gcsLength: getComputedStyle.length,
      fpToString: Function.prototype.toString.toString(), fpToStringName: Function.prototype.toString.name,
      bcrToString: Function.prototype.toString.call(Element.prototype.getBoundingClientRect), bcrName: Element.prototype.getBoundingClientRect.name,
      tag: Object.prototype.toString.call(cs), otherDesc: JSON.stringify(Object.getOwnPropertyDescriptor(getComputedStyle(document.getElementById('other')), 'visibility') || null),
      ownKeys: Object.keys(cs).length > 0,
    },
    rect: (() => { const r = slot.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round); })(),
    otherRect: (() => { const r = document.getElementById('other').getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round); })(),
  };
  if ((r.visibility === 'hidden' || r.top === '-4000px') && !document.querySelector('.reinjected-ad')) {
    const ad = document.createElement('div'); ad.className = 'reinjected-ad'; ad.textContent = 'REKLAMA'; document.body.appendChild(ad);
  }
  window.__checks.push(r);
}
document.addEventListener('DOMContentLoaded', () => check('dcl'));
addEventListener('load', () => { check('load'); setTimeout(() => check('300ms'), 300); setTimeout(() => check('1s'), 1000); });
</script></body></html>`;
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

async function run(withExt) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromeblock-spoofcss-'));
  let ext = null;
  if (withExt) {
    ext = path.join(tmp, 'ext');
    fs.mkdirSync(ext);
    for (const e of EXTENSION_ENTRIES) if (fs.existsSync(path.join(ROOT, e))) fs.cpSync(path.join(ROOT, e), path.join(ext, e), { recursive: true });
  }
  const ctx = await chromium.launchPersistentContext(path.join(tmp, 'profile'), {
    headless: true, channel: 'chromium',
    args: ext ? [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-first-run', '--disable-component-update'] : ['--no-first-run'],
  });
  try {
    await ctx.route(/^https?:/, (r) => {
      const u = new URL(r.request().url());
      if (u.pathname.endsWith('.png')) return r.fulfill({ status: 200, contentType: 'image/png', body: PNG });
      return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: PAGE });
    });
    if (ext) {
      let [sw] = ctx.serviceWorkers();
      if (!sw) sw = await ctx.waitForEvent('serviceworker', { timeout: 60000 });
      // czekamy, aż scriptlety zostaną zarejestrowane (rejestracja jest asynchroniczna po instalacji)
      for (let i = 0; i < 300; i++) {
        const ok = await sw.evaluate(() => chrome.scripting.getRegisteredContentScripts().then((r) => r.some((x) => x.matches.includes('*://*.wykop.pl/*')))).catch(() => false);
        if (ok) break;
        await new Promise((res) => setTimeout(res, 200));
      }
    }
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('https://wykop.pl/', { waitUntil: 'load' });
    await page.waitForFunction(() => window.__checks.some((c) => c.when === '1s'), null, { timeout: 15000 });
    const checks = await page.evaluate(() => window.__checks);
    const reinjected = await page.locator('.reinjected-ad').count();
    // prawdziwy stan (świat izolowany ma natywne getComputedStyle)
    const real = await evalIsolated(page, () => { const s = getComputedStyle(document.getElementById('slot')); return { visibility: s.visibility, top: s.top, position: s.position }; });
    const realRects = await evalIsolated(page, () => ['slot', 'other'].map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round); }));
    return { checks, reinjected, real, realRects, errors };
  } finally {
    await ctx.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

test('spoof-css (wykop.pl): bez rozszerzenia strona wykrywa ukrycie i wstawia reklamę; z ChromeBlock – nie', { skip, timeout: 240_000 }, async () => {
  const none = await run(false);
  assert.ok(none.reinjected > 0, 'kontrola: strona wykrywa ukryty slot');
  assert.equal(none.checks.at(-1).visibility, 'hidden');
  assert.equal(none.checks.at(-1).top, '-4000px');

  const cb = await run(true);
  assert.deepEqual(cb.errors, []);
  assert.equal(cb.reinjected, 0, `z ChromeBlock strona nie widzi ukrycia: ${JSON.stringify(cb.checks)}`);
  for (const c of cb.checks) {
    // podmienione właściwości – przez nazwę, nazwę z myślnikiem i getPropertyValue
    assert.equal(c.visibility, 'visible', c.when);
    assert.equal(c.top, '0px', c.when);
    assert.equal(c.gpvVisibility, 'visible', c.when);
    assert.equal(c.gpvTop, '0px', c.when);
    assert.equal(c.dashedKey, '0px', c.when);
    // pozostałe właściwości i metody – prawdziwe, z właściwym this
    assert.equal(c.position, 'absolute', c.when);
    assert.equal(c.gpvPosition, 'absolute', c.when);
    assert.equal(c.pointerEvents, 'none', c.when);
    assert.equal(c.priority, '', c.when);
    assert.equal(c.item0, 'string', c.when);
    assert.equal(c.length, true, c.when);
    assert.equal(c.isDecl, true, c.when);
    // inne elementy i pseudo-elementy – natywnie
    assert.equal(c.other, 'hidden', c.when);
    assert.equal(c.otherTop, '-10px', c.when);
    assert.equal(c.pseudo, 'hidden', c.when);
    // getBoundingClientRect nie jest podmieniany – rzeczywiste położenie
    assert.ok(c.rectTop < -3000, `${c.when}: rect.top ${c.rectTop}`);
  }
  // rzeczywisty styl elementu bez zmian (scriptlet tylko „kłamie” kodowi strony)
  assert.deepEqual(cb.real, { visibility: 'hidden', top: '-4000px', position: 'absolute' });

  const last = cb.checks.at(-1);
  const ctrl = none.checks.at(-1);
  // deskryptory nie ujawniają prawdziwej wartości: brak własnej właściwości jak natywnie albo wartość podmieniona
  for (const k of ['descVisibility', 'descTop']) {
    assert.notEqual(last[k], k === 'descVisibility' ? 'hidden' : '-4000px', k);
    if (ctrl[k] === null) assert.equal(last[k], null, `${k}: jak natywnie`);
    else assert.equal(last[k], k === 'descVisibility' ? 'visible' : '0px', k);
  }
  // metody deklaracji, getComputedStyle, Function.prototype.toString i getBoundingClientRect wyglądają jak natywne
  assert.deepEqual(last.introspect, ctrl.introspect);
  assert.equal(last.introspect.gpvToString, 'function getPropertyValue() { [native code] }');
  assert.equal(last.introspect.gcsFnToString, 'function getComputedStyle() { [native code] }');
  assert.equal(last.introspect.fpToString, 'function toString() { [native code] }');
  assert.equal(last.introspect.bcrToString, 'function getBoundingClientRect() { [native code] }');
  assert.deepEqual(last.introspect.names.slice(0, 3), ['getPropertyValue', 'item', 'getPropertyPriority']);
  // getBoundingClientRect przezroczysty: jak natywny (świat izolowany) i jak bez rozszerzenia
  assert.deepEqual([last.rect, last.otherRect], cb.realRects);
  assert.deepEqual([last.rect, last.otherRect], [ctrl.rect, ctrl.otherRect]);
});
