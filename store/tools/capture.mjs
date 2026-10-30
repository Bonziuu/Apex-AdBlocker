// Surowe zrzuty prawdziwego rozszerzenia (en/pl) – materiał do kompozycji w store/generate.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { launch, sleep, DEMO_HOST } from './harness.mjs';

export async function capture(EXT, OUT, log = console.log) {
fs.mkdirSync(OUT, { recursive: true });
const save = (name, buf) => fs.writeFileSync(path.join(OUT, name), buf);
const browsers = new Set();
const open = async (options) => { const browser = await launch(options); browsers.add(browser); return browser; };
try {

// strona demo bez rozszerzenia (przed)
for (const lang of ['en', 'pl']) {
  const b = await open({ lang });
  const p = await b.newPage(`http://${DEMO_HOST}/?lang=${lang}`);
  await sleep(1200);
  save(`demo-before-${lang}.png`, await p.shot());
  await b.close();
}

for (const lang of ['en', 'pl']) {
  const b = await open({ ext: EXT, lang });
  log(lang, 'id', b.id);
  // strona demo z rozszerzeniem (po)
  const demo = await b.newPage(null);
  await demo.send('Network.enable');
  await demo.goto(`http://${DEMO_HOST}/?lang=${lang}`, 2500);
  // prawdziwa liczba żądań zablokowanych (ERR_BLOCKED_BY_CLIENT) lub podmienionych na atrapę przez reguły
  const failed = demo.events.filter((e) => e.method === 'Network.loadingFailed' && /BLOCKED_BY_CLIENT/.test(e.params.errorText || '')).length;
  // unikalne żądania: z use_dynamic_url Chrome przekierowuje dwa razy (adres sesji → plik)
  const redirected = new Set(demo.events.filter((e) => e.method === 'Network.requestWillBeSent' && e.params.redirectResponse && /^https?:/.test(e.params.redirectResponse.url) && /^chrome-extension:/.test(e.params.request.url)).map((e) => e.params.requestId)).size;
  const realBlocked = failed + redirected;
  log(lang, 'zablokowane:', failed, 'podmienione:', redirected);
  save(`demo-after-${lang}.png`, await demo.shot());
  log(lang, 'licznik:', realBlocked, '| reklamy widoczne:', await demo.eval(`[...document.querySelectorAll('ins.adsbygoogle')].filter(e => e.offsetHeight > 0).length`),
    '| śledzenie:', await demo.eval('window.__tracked || 0'), '| nakładka:', await demo.eval(`!!document.getElementById('cookie-ad-overlay')`));

  // popup (aktywna karta = strona demo)
  const popup = await b.newPage(null, { w: 340, h: 600 });
  // Keep the real demo tab active. No Chrome API or statistics are replaced.
  await demo.send('Page.bringToFront');
  await popup.goto(`chrome-extension://${b.id}/popup/popup.html`, 1500);
  const ph = await popup.eval('Math.ceil(document.documentElement.getBoundingClientRect().height)');
  save(`popup-${lang}.png`, await popup.shot({ x: 0, y: 0, width: 340, height: ph }));
  log(lang, 'popup:', await popup.eval(`document.getElementById('status').textContent + ' | ' + document.getElementById('blocked').textContent + ' ' + document.getElementById('blockedLabel').textContent + ' | lang=' + document.documentElement.lang`));

  // „Ukryj element” na stronie demo
  await popup.eval(`chrome.tabs.query({ url: '*://${DEMO_HOST}/*' }).then(([t]) => chrome.runtime.sendMessage({ type: 'picker:start', tabId: t.id }))`);
  await sleep(800);
  const box = await demo.eval(`(() => { const r = document.querySelector('aside ul').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
  await demo.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x, y: box.y });
  await sleep(200);
  await demo.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  await demo.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  await sleep(500);
  save(`picker-${lang}.png`, await demo.shot());

  // Opcje i ekran powitalny
  const opt = await b.newPage(`chrome-extension://${b.id}/options/options.html`);
  await sleep(800);
  save(`options-${lang}.png`, await opt.shot());
  await opt.eval(`document.querySelector('.tab[data-tab="filters"]').click()`);
  await sleep(300);
  save(`options-filters-${lang}.png`, await opt.shot());
  await opt.eval(`document.querySelector('.tab[data-tab="more"]').click(); document.getElementById('about').open = true;`);
  await sleep(300);
  save(`options-about-${lang}.png`, await opt.shot());
  await opt.eval(`document.getElementById('about').open = false; document.getElementById('diag').open = true;`);
  await sleep(1200);
  save(`options-diag-${lang}.png`, await opt.shot());
  const wel = await b.newPage(`chrome-extension://${b.id}/welcome/welcome.html`);
  await sleep(600);
  save(`welcome-${lang}.png`, await wel.shot());
  await b.close();
}
return { mockedChromeApi:false, demoHost:DEMO_HOST, counterSource:'unmodified-extension-api' };
} finally {
  await Promise.allSettled([...browsers].map(browser => browser.close()));
}
}
