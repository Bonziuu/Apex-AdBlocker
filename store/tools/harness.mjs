// Apex AdBlocker – zrzuty do Chrome Web Store: lokalny serwer strony demo, Chrome z rozszerzeniem
// (albo bez) i proste API DevTools. Domeny reklam i strona demo trafiają przez --host-resolver-rules
// na lokalny serwer (adresy bez portu, więc reguły filtrów działają jak na prawdziwych stronach).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';

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

// ── Chrome + CDP ──────────────────────────────────────────────────────────────
export async function launch({ ext = null, lang = 'en', width = 1280, height = 800 } = {}) {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'apex-shot-'));
  const args = ['--headless=new', ...(process.getuid && process.getuid() === 0 ? ['--no-sandbox'] : []), '--no-first-run', '--no-proxy-server', '--hide-scrollbars', `--user-data-dir=${prof}`,
    '--remote-debugging-port=0', `--lang=${lang}`, `--window-size=${width},${height}`, '--disable-features=HttpsUpgrades,HttpsFirstBalancedModeAutoEnable',
    `--host-resolver-rules=${[DEMO_HOST, ...AD_HOSTS].map((h) => `MAP ${h} 127.0.0.1:${PORT}`).join(', ')}`];
  if (ext) args.push(`--load-extension=${ext}`, `--disable-extensions-except=${ext}`);
  else args.push('--disable-extensions');
  const proc = spawn(chromePath(), [...args, 'about:blank'], { stdio: 'ignore', env: { ...process.env, LANGUAGE: lang, LANG: lang === 'pl' ? 'pl_PL.UTF-8' : 'en_US.UTF-8' } });
  let port;
  for (let i = 0; i < 150 && !port; i++) { await sleep(100); try { port = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch { /* */ } }
  const json = async (p = '') => (await fetch(`http://127.0.0.1:${port}/json${p}`)).json();
  const version = await json('/version');
  const browser = await connect(version.webSocketDebuggerUrl);
  let id = null;
  if (ext) {
    for (let i = 0; i < 100 && !id; i++) {
      await sleep(200);
      for (const t of (await json()).filter((x) => x.type === 'service_worker' && x.url.endsWith('/background.js'))) {
        const c = await connect(t.webSocketDebuggerUrl);
        const r = await c.send('Runtime.evaluate', { expression: 'chrome.runtime.getManifest().name', returnByValue: true }).catch(() => null);
        c.close();
        if (r && r.result && r.result.value === 'Apex AdBlocker') { id = new URL(t.url).host; break; }
      }
    }
    await sleep(3000); // reguły DNR
  }
  async function newPage(url, { w = width, h = height, scale = 1 } = {}) {
    const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
    const t = (await json()).find((x) => x.id === targetId);
    const page = await connect(t.webSocketDebuggerUrl);
    page.targetId = targetId;
    await page.send('Page.enable');
    await page.send('Runtime.enable');
    await page.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: scale, mobile: false });
    page.goto = async (u, wait = 1500) => { await page.send('Page.navigate', { url: u }); await sleep(wait); };
    page.eval = async (expr) => { const r = await page.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400)); return r.result.value; };
    page.shot = async (clip) => Buffer.from((await page.send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) })).data, 'base64');
    if (url) await page.goto(url);
    return page;
  }
  async function close() { try { browser.close(); } catch { /* */ } proc.kill(); }
  return { id, newPage, close, json, browser };
}

/** Ścieżka do Chrome: APEX_CHROME, potem typowe lokalizacje. */
export function chromePath() {
  const list = [process.env.APEX_CHROME, '/opt/google/chrome/chrome', '/usr/bin/google-chrome', '/usr/bin/chromium',
    'C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
  const found = list.find((p) => fs.existsSync(p));
  if (!found) throw new Error('Nie znaleziono Chrome – ustaw zmienną APEX_CHROME');
  return found;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((r, j) => { ws.addEventListener('open', r, { once: true }); ws.addEventListener('error', j, { once: true }); });
  let seq = 0;
  const pend = new Map();
  const events = [];
  ws.addEventListener('message', (e) => { const d = JSON.parse(e.data); if (!d.id && d.method) events.push(d); if (d.id && pend.has(d.id)) { const [res, rej] = pend.get(d.id); pend.delete(d.id); d.error ? rej(new Error(d.error.message)) : res(d.result); } });
  return {
    send: (method, params = {}) => new Promise((res, rej) => { const i = ++seq; pend.set(i, [res, rej]); ws.send(JSON.stringify({ id: i, method, params })); }),
    close: () => ws.close(),
    events,
  };
}
