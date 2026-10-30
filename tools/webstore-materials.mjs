#!/usr/bin/env node
// Assemble publication drafts from the real text and existing vector brand.
// This renders a promotional tile, never a simulated screenshot of the extension.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, loadPlaywright } from './chromium-smoke.mjs';
const GENERATOR = 'Apex AdBlocker store materials';
const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function inline(text) {
  return escape(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
}
export function policyHtml(markdown, language) {
  if (!['pl', 'en'].includes(language)) throw new Error('Unsupported policy language');
  const text = markdown.replace(/^# ([^\n]+?)(?: — projekt do publikacji| — publication draft)\s*$/m, '# $1')
    .replace(/^\*\*Status:.*\*\*\s*$/m, '');
  const body = text.trim().split(/\n\s*\n/).map((block) => {
    const heading = /^(#{1,2}) (.+)$/.exec(block);
    if (heading) return `<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`;
    return `<p>${block.split('\n').map((line) => inline(line.trim())).join('<br>')}</p>`;
  }).join('\n');
  const title = language === 'pl' ? 'Polityka prywatności Apex AdBlocker' : 'Apex AdBlocker Privacy Policy';
  return `<!doctype html>
<html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="${GENERATOR}"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>${title}</title><style>html{color-scheme:light dark}body{max-width:820px;margin:40px auto;padding:0 24px;font:17px/1.65 system-ui,sans-serif}h1{line-height:1.2;font-size:2rem}h2{font-size:1.3rem;margin-top:2rem}a{color:#0f7f8c}code{font-size:.9em;overflow-wrap:anywhere}nav{margin-bottom:2rem}p{overflow-wrap:anywhere}</style></head>
<body><nav><a href="${language === 'pl' ? 'privacy-en.html' : 'privacy.html'}">${language === 'pl' ? 'English' : 'Polski'}</a></nav><main>${body}</main></body></html>\n`;
}
function writeOwned(file, contents) {
  if (fs.existsSync(file) && !fs.readFileSync(file, 'utf8').includes(GENERATOR)) throw new Error(`Refusing to replace unowned file: ${file}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}
export async function buildMaterials({ htmlOnly = false, executablePath = process.env.APEX_ASSET_BROWSER } = {}) {
  const dir = path.join(ROOT, 'docs/webstore');
  for (const lang of ['pl','en']) {
    const markdown = fs.readFileSync(path.join(dir, `privacy-policy-${lang}.md`), 'utf8');
    writeOwned(path.join(dir, 'public', lang === 'pl' ? 'privacy.html' : 'privacy-en.html'), policyHtml(markdown, lang));
  }
  // Neutral brand artwork, no ad-blocking statistics or fabricated browser UI.
  const logo = fs.readFileSync(path.join(ROOT, 'brand/apex-logo.svg'), 'utf8');
  const artwork = `<!doctype html><meta charset="utf-8"><meta name="generator" content="${GENERATOR}"><style>html,body{margin:0;width:440px;height:280px;overflow:hidden}body{display:grid;place-content:center;justify-items:center;gap:18px;background:#062f35;font-family:Arial,sans-serif;color:#f5fcfc}svg{width:108px;height:108px}h1{font-size:30px;font-weight:600;letter-spacing:-.6px;margin:0}</style>${logo}<h1>Apex AdBlocker</h1>`;
  const html = path.join(dir, 'assets/promo-small.html');
  writeOwned(html, artwork);
  if (htmlOnly) return { publicPolicies: true, promo: 'HTML source only' };
  const chromium = await loadPlaywright();
  if (!chromium) throw new Error('Playwright is unavailable');
  const output = path.join(dir, 'assets/promo-small-440x280.png');
  const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 440, height: 280 }, deviceScaleFactor: 1 });
    await page.route(/^(https?|wss?):/, (route) => route.abort());
    await page.setContent(artwork);
    await page.evaluate(() => document.fonts.ready);
    const bytes = await page.screenshot({ type: 'png', animations: 'disabled' });
    if (bytes.readUInt32BE(16) !== 440 || bytes.readUInt32BE(20) !== 280) throw new Error('Wrong promotional image dimensions');
    fs.writeFileSync(output, bytes);
  } finally { await browser.close(); }
  return { publicPolicies: true, promo: output, dimensions: '440x280' };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== '--html-only')) { console.error('Usage: node tools/webstore-materials.mjs [--html-only]'); process.exitCode = 1; }
  else try { console.log(JSON.stringify(await buildMaterials({ htmlOnly: args.includes('--html-only') }), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
