// Apex AdBlocker – zrzuty do Chrome Web Store: lokalny serwer strony demo, Chrome z rozszerzeniem
// (albo bez) i API DevTools. Odpowiedzi demonstracyjne są lokalnie podstawiane przez
// Playwright; żaden serwer reklamowy nie jest odwiedzany i żadne API rozszerzenia nie jest mockowane.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { loadPlaywright, COMPONENTS, SYNC_STEPS } from '../../tools/chromium-smoke.mjs';

const AD_HOSTS = ['pagead2.googlesyndication.com', 'securepubads.g.doubleclick.net', 'www.googletagservices.com', 'static.criteo.net', 'www.google-analytics.com', 'connect.facebook.net', 'cdn.taboola.com'];
export const DEMO_HOST = 'dailynews.example';

// ── serwer: strona demo + „prawdziwe” skrypty reklamowe ───────────────────────
const adBanner = (w, h, label, c1, c2) => `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="46%" fill="#fff" font-family="Arial" font-weight="700" font-size="${Math.min(w / label.length * 1.5, h / 3.2)}" text-anchor="middle">${label}</text><text x="50%" y="70%" fill="#fff" opacity=".85" font-family="Arial" font-size="${Math.min(w, h) / 10}" text-anchor="middle">Kliknij teraz! · Click now!</text><rect x="${w - 18}" y="2" width="16" height="14" fill="#fff" opacity=".9"/><text x="${w - 10}" y="13" font-size="10" font-family="Arial" text-anchor="middle" fill="#333">i</text></svg>`).toString('base64')}`;
const ADS_JS = `(function(){var B=${JSON.stringify({ top: adBanner(728, 90, 'MEGA SALE −70%', '#ff3d6e', '#ff9f1c'), side: adBanner(300, 250, 'WIN AN iPHONE', '#7b2ff7', '#f107a3'), mid: adBanner(728, 90, 'CRYPTO 1000%', '#00b4d8', '#0077b6') })};
document.querySelectorAll('ins.adsbygoogle').forEach(function(ins){var k=ins.getAttribute('data-slot')||'top';var i=new Image();i.src=B[k];i.style.cssText='display:block;width:100%;height:100%;border-radius:4px';ins.appendChild(i);ins.setAttribute('data-ad-status','filled');});})();`;
const TRACK_JS = 'window.__tracked = (window.__tracked||0)+1;';
const POPUP_AD_JS = `(function(){function go(){var d=document.createElement('div');d.id='cookie-ad-overlay';d.className='sponsored-popup';d.style.cssText='position:fixed;right:24px;bottom:24px;width:300px;padding:18px;background:#111;color:#fff;border-radius:12px;font:14px Arial;box-shadow:0 10px 30px #0006;z-index:9';d.innerHTML='<b style="font-size:16px">🎰 Casino Bonus!</b><br>Odbierz 500 zł bez depozytu · Claim your bonus now';document.body.appendChild(d);}document.body?go():addEventListener('DOMContentLoaded',go);})();`;

export function demoPage(lang) {
  const L = lang === 'pl'
    ? { brand: 'Daily News', nav: ['Kraj', 'Świat', 'Technologia', 'Sport', 'Kultura'], h1: 'Nowe badania: miasta coraz szybciej przechodzą na zieloną energię', lead: 'Raport pokazuje, że w ostatnim roku liczba instalacji fotowoltaicznych na budynkach publicznych wzrosła niemal dwukrotnie.', p: ['Autorzy raportu przeanalizowali dane z ponad stu miast. Największe zmiany widać w transporcie publicznym oraz w ogrzewaniu budynków, gdzie nowe technologie pozwalają znacząco obniżyć koszty.', 'Eksperci podkreślają, że tempo zmian zależy przede wszystkim od lokalnych inwestycji i współpracy z mieszkańcami. W wielu miejscach pilotażowe programy przerodziły się w stałe rozwiązania.', 'W kolejnych latach miasta planują dalszą rozbudowę sieci ładowania pojazdów elektrycznych oraz modernizację oświetlenia ulicznego.'], side: 'Najczęściej czytane', items: ['Jak oszczędzać energię zimą', 'Nowa linia tramwajowa otwarta', 'Pogoda na weekend', 'Festiwal nauki już w sobotę'] }
    : { brand: 'Daily News', nav: ['Local', 'World', 'Tech', 'Sport', 'Culture'], h1: 'New study: cities are switching to green energy faster than ever', lead: 'The report shows that solar installations on public buildings nearly doubled over the past year.', p: ['The authors analysed data from more than a hundred cities. The biggest changes are in public transport and building heating, where new technology is cutting costs significantly.', 'Experts stress that the pace of change depends mostly on local investment and working together with residents. In many places pilot programmes have become permanent.', 'In the coming years cities plan to expand electric vehicle charging networks and modernise street lighting.'], side: 'Most read', items: ['How to save energy in winter', 'New tram line opens', 'Weekend weather', 'Science festival this Saturday'] };
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${L.brand}</title>
<style>body{margin:0;font:16px/1.6 Georgia,serif;color:#1d1d1f;background:#f6f5f2}header{background:#fff;border-bottom:1px solid #e5e2db}
.top{max-width:1100px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:28px}.logo{font:700 26px Georgia;letter-spacing:-.5px}
nav{display:flex;gap:18px;font:600 14px Arial;color:#555}.wrap{max-width:1100px;margin:0 auto;padding:18px 24px;display:grid;grid-template-columns:1fr 300px;gap:28px}
ins.adsbygoogle{display:block;background:#eee;border-radius:4px}.leader{max-width:1052px;margin:16px auto 0;height:90px}
h1{font-size:34px;line-height:1.2;margin:8px 0 10px}.lead{font-size:19px;color:#444}.photo{height:220px;border-radius:8px;background:linear-gradient(135deg,#9bd3ae,#3d8b6e 60%,#1f5f4a);margin:14px 0}
aside h3{font:700 15px Arial;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid #1d1d1f;padding-bottom:6px}aside li{font:15px Arial;margin:10px 0}
.box{height:250px;margin-bottom:22px}</style>
<script async src="http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<script src="http://www.google-analytics.com/analytics.js"></script>
<script src="http://cdn.taboola.com/libtrc/loader.js"></script>
<script src="http://connect.facebook.net/en_US/fbevents.js"></script>
<script async src="http://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
<script async src="http://static.criteo.net/js/ld/publishertag.js"></script>
<script src="http://www.googletagservices.com/tag/js/gpt.js"></script>
</head><body><header><div class="top"><div class="logo">${L.brand}</div><nav>${L.nav.map((n) => `<span>${n}</span>`).join('')}</nav></div></header>
<ins class="adsbygoogle leader" data-slot="top" data-ad-client="ca-pub-123"></ins>
<div class="wrap"><main><h1>${L.h1}</h1><p class="lead">${L.lead}</p><div class="photo"></div><p>${L.p[0]}</p>
<ins class="adsbygoogle" data-slot="mid" style="height:90px;margin:18px 0" data-ad-client="ca-pub-123"></ins><p>${L.p[1]}</p><p>${L.p[2]}</p></main>
<aside><ins class="adsbygoogle box" data-slot="side" data-ad-client="ca-pub-123"></ins><h3>${L.side}</h3><ul>${L.items.map((i) => `<li>${i}</li>`).join('')}</ul></aside></div>
<script>setTimeout(function(){var s=document.createElement('script');s.src='http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?fill';document.body.appendChild(s);},50)</script>
</body></html>`;
}

export const PORT = Number(process.env.APEX_SHOTS_PORT || 18765);

export function startServer(port = PORT) {
  const server = http.createServer((req, res) => {
    const host = (req.headers.host || '').split(':')[0];
    if (host === DEMO_HOST) {
      const lang = new URL(req.url, 'http://x').searchParams.get('lang') || 'en';
      res.setHeader('content-type', 'text/html; charset=utf-8');
      return res.end(demoPage(lang));
    }
    res.setHeader('content-type', 'text/javascript');
    if (req.url.includes('adsbygoogle')) return res.end(ADS_JS);
    if (req.url.includes('loader.js')) return res.end(POPUP_AD_JS);
    return res.end(TRACK_JS);
  });
  return new Promise((r) => server.listen(port, '127.0.0.1', () => r(server)));
}

// ── Playwright + CDP: also works on the supported Node 20 runtime. ──────────
export async function launch({ ext = null, lang = 'en', width = 1280, height = 800 } = {}) {
  const chromium = await loadPlaywright();
  if (!chromium || !fs.existsSync(chromium.executablePath())) {
    const error = new Error('Chromium Playwright is unavailable; install it before capturing genuine extension images.');
    error.code = 'BROWSER_UNAVAILABLE';
    throw error;
  }
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-shot-'));
  let context;
  try {
    context = await chromium.launchPersistentContext(prof, {
      headless: true, channel: 'chromium', locale: lang, viewport: { width, height },
      args: [
        '--no-first-run', '--hide-scrollbars', '--disable-component-update',
        '--disable-background-networking', '--disable-sync',
        ...(ext ? [`--load-extension=${ext}`, `--disable-extensions-except=${ext}`] : ['--disable-extensions']),
      ],
    });
    // Fulfil only the controlled demo. No external website is contacted.
    await context.route(/^(?:https?|wss?):/, async (route) => {
      const url = new URL(route.request().url());
      if (url.protocol !== 'http:') return route.abort();
      if (url.hostname === DEMO_HOST) return route.fulfill({
        contentType: 'text/html; charset=utf-8', body: demoPage(url.searchParams.get('lang') || lang),
      });
      if (!AD_HOSTS.includes(url.hostname)) return route.abort();
      return route.fulfill({ contentType: 'text/javascript', body:
        url.pathname.includes('adsbygoogle') ? ADS_JS : url.pathname.includes('loader.js') ? POPUP_AD_JS : TRACK_JS });
    });
    const browser = await context.browser().newBrowserCDPSession();
    let id = null;
    if (ext) {
      let worker = context.serviceWorkers().find(w => w.url().endsWith('/background.js'));
      if (!worker) worker = await context.waitForEvent('serviceworker', { predicate: w => w.url().endsWith('/background.js'), timeout: 30_000 });
      if (await worker.evaluate(() => chrome.runtime.getManifest().name) !== 'Apex AdBlocker') throw new Error('Unexpected extension service worker');
      id = new URL(worker.url()).host;
      const check = await context.newPage();
      await check.goto('chrome://extensions');
      const loaded = await check.evaluate(async (extensionId) => {
        const e = (await chrome.developerPrivate.getExtensionsInfo()).find(item => item.id === extensionId);
        return e && { state: e.state, errors: [...(e.manifestErrors || []), ...(e.runtimeErrors || [])].map(error => error.message) };
      }, id);
      if (!loaded || loaded.state !== 'ENABLED' || loaded.errors.length) throw new Error('Chromium did not accept the actual extension without errors');
      await check.goto(`chrome-extension://${id}/options/options.html`);
      let ready = false;
      const deadline = Date.now() + 180_000;
      while (Date.now() < deadline) {
        const health = await check.evaluate(() => chrome.runtime.sendMessage({ type: 'health:get' }));
        if (SYNC_STEPS.some(step => health.sync?.[step]?.status === 'error')
          || COMPONENTS.some(component => health.components?.[component]?.status === 'error')) throw new Error('Extension health reports an error');
        if (SYNC_STEPS.every(step => health.sync?.[step]?.status === 'ok')) { ready = true; break; }
        await sleep(250);
      }
      if (!ready) throw new Error('Extension synchronization did not finish');
      await check.close();
    }
    async function newPage(url, { w = width, h = height, scale = 1 } = {}) {
      const actual = await context.newPage();
      const session = await context.newCDPSession(actual);
      const events = [];
      for (const method of ['Network.loadingFailed', 'Network.requestWillBeSent']) session.on(method, params => events.push({ method, params }));
      await session.send('Page.enable');
      await session.send('Runtime.enable');
      await session.send('Emulation.setDeviceMetricsOverride', { width:w, height:h, deviceScaleFactor:scale, mobile:false });
      const { targetInfo } = await session.send('Target.getTargetInfo');
      const page = {
        targetId: targetInfo.targetId, events, send: (method, params = {}) => session.send(method, params),
        goto: async (u, wait = 1500) => { await actual.goto(u); await sleep(wait); },
        eval: async expression => {
          const result = await session.send('Runtime.evaluate', { expression, awaitPromise:true, returnByValue:true });
          if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails).slice(0,400));
          return result.result.value;
        },
        shot: async clip => Buffer.from((await session.send('Page.captureScreenshot', { format:'png', ...(clip ? { clip:{...clip, scale:1} } : {}) })).data, 'base64'),
      };
      if (url) await page.goto(url);
      return page;
    }
    return { id, newPage, browser, close: async () => {
      try { await context.close(); } finally { fs.rmSync(prof, { recursive:true,force:true }); }
    } };
  } catch (error) {
    await context?.close().catch(() => {});
    fs.rmSync(prof, { recursive:true,force:true });
    throw error;
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
