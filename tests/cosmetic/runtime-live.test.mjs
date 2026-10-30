// Actual DOM execution of the content runtime; Chrome API is a controlled local
// fixture. No extension installation or external website is involved.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadPlaywright, ROOT } from '../../tools/chromium-smoke.mjs';
import { classifyLine, parseCosmeticFilter } from '../../shared/parser.js';

const chromium = await loadPlaywright();
// A system browser can run these DOM-only fixtures even when its managed policy
// disallows unpacked extensions. This override is deliberately limited to them.
const executablePath = process.env.APEX_DOM_TEST_BROWSER || chromium?.executablePath();
const skip = !chromium || !executablePath || !fs.existsSync(executablePath) ? 'Chromium DOM fixture unavailable' : false;
let browser;
test.before(async () => { if (!skip) browser = await chromium.launch({ headless: true, executablePath }); });
test.after(async () => { await browser?.close(); });
const source = fs.readFileSync(path.join(ROOT, 'content/cosmetic.js'), 'utf8');
const picker = fs.readFileSync(path.join(ROOT, 'content/picker.js'), 'utf8');
const tasks = (filter) => {
  const parsed = parseCosmeticFilter(classifyLine(`example.test##${filter}`), { trusted: false });
  assert.equal(parsed.type, 'procedural');
  return parsed.tasks;
};
async function fixture(html, filters = [], { generic = false, failures = 0, initFailures = 0, scriptletFailures = 0 } = {}) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.route('https://example.test/**', (route) => route.fulfill({ contentType: 'text/html', body: html }));
  await page.addInitScript(({ proc, generic, failures, initFailures, scriptletFailures }) => {
    window.__batches = [];
    window.__attempts = 0;
    window.__messages = [];
    window.chrome = {
      storage: { local: { get: async () => ({}) } },
      runtime: { sendMessage: async (message) => {
        window.__messages.push(message);
        if (message.type === 'scriptlets:init') {
          if (scriptletFailures-- > 0) throw new Error('temporary frame worker failure');
          return { ok: true, injected: 0 };
        }
        if (message.type === 'cosmetic:init') {
          if (initFailures-- > 0) throw new Error('temporary initialization failure');
          return { proc, generic, attr: 'data-apex-hide' };
        }
        if (message.type === 'cosmetic:tokens') {
          window.__attempts++;
          if (failures-- > 0) throw new Error('temporary worker failure');
          window.__batches.push(message.tokens);
          return { selectors: 0 };
        }
        return {};
      } },
    };
  }, { proc: filters.map(tasks), generic, failures, initFailures, scriptletFailures });
  await page.goto('https://example.test/');
  await page.addScriptTag({ content: source });
  return { page, close: () => context.close() };
}

test('DOM: procedural style applies all matching rules and restores original properties', { skip }, async () => {
  const f = await fixture('<div id="card" style="color:blue; padding:2px">Sponsored</div>', [
    '#card:has-text(Sponsored):style(color:red!important)',
    '#card:has-text(Sponsored):style(background-color:yellow)',
  ]);
  try {
    await f.page.waitForFunction(() => document.querySelector('#card').style.color === 'red');
    assert.equal(await f.page.$eval('#card', n => n.style.getPropertyPriority('color')), 'important');
    assert.equal(await f.page.$eval('#card', n => n.style.backgroundColor), 'yellow');
    await f.page.$eval('#card', n => { n.firstChild.data = 'Ordinary article'; });
    await f.page.waitForFunction(() => document.querySelector('#card').style.color === 'blue');
    assert.equal(await f.page.$eval('#card', n => n.style.backgroundColor), '');
    assert.equal(await f.page.$eval('#card', n => n.style.padding), '2px');
  } finally { await f.close(); }
});

test('DOM: page changes to an active style survive when the filter no longer matches', { skip }, async () => {
  const f = await fixture('<div id="card" style="color:blue">Sponsored</div>', ['#card:has-text(Sponsored):style(color:red)']);
  try {
    await f.page.waitForFunction(() => document.querySelector('#card').style.color === 'red');
    await f.page.$eval('#card', n => { n.style.color = 'green'; });
    await f.page.waitForTimeout(250);
    await f.page.$eval('#card', n => { n.firstChild.data = 'Article'; });
    await f.page.waitForFunction(() => document.querySelector('#card').style.color === 'green');
  } finally { await f.close(); }
});

test('DOM: procedural hiding is reversible, unions rules, and reacts to class changes', { skip }, async () => {
  const f = await fixture('<div id="card" class="ad">Sponsored</div>', ['.ad:has-text(Sponsored)', '#card:has-text(Keep)']);
  try {
    await f.page.waitForFunction(() => document.querySelector('#card').hasAttribute('data-apex-hide'));
    await f.page.$eval('#card', n => { n.firstChild.data = 'Keep'; n.className = 'article'; });
    await f.page.waitForTimeout(250);
    assert.equal(await f.page.$eval('#card', n => n.hasAttribute('data-apex-hide')), true);
    await f.page.$eval('#card', n => { n.firstChild.data = 'Article'; });
    await f.page.waitForFunction(() => !document.querySelector('#card').hasAttribute('data-apex-hide'));
    await f.page.$eval('#card', n => { n.firstChild.data = 'Sponsored'; });
    await f.page.waitForTimeout(200);
    assert.equal(await f.page.$eval('#card', n => n.hasAttribute('data-apex-hide')), false);
    await f.page.$eval('#card', n => { n.className = 'ad'; });
    await f.page.waitForFunction(() => document.querySelector('#card').hasAttribute('data-apex-hide'));
  } finally { await f.close(); }
});

test('DOM: generic discovery delivers every token in acknowledged batches of at most 2000', { skip }, async () => {
  const html = Array.from({ length: 2501 }, (_, i) => `<div class="token${i}"></div>`).join('');
  const f = await fixture(html, [], { generic: true });
  try {
    await f.page.waitForFunction(() => window.__batches.flat().includes('.token2500'));
    const batches = await f.page.evaluate(() => window.__batches);
    assert.ok(batches.every(x => x.length <= 2000));
    assert.equal(new Set(batches.flat()).size, 2501);
    await f.page.evaluate(() => document.body.append(Object.assign(document.createElement('div'), { className: 'token2500' })));
    await f.page.waitForTimeout(250);
    assert.equal(await f.page.evaluate(() => window.__batches.flat().filter(x => x === '.token2500').length), 1);
  } finally { await f.close(); }
});

test('DOM: tokens remain pending until a failed worker message is retried successfully', { skip }, async () => {
  const f = await fixture('<div class="retry-ad"></div>', [], { generic: true, failures: 1 });
  try {
    await f.page.waitForFunction(() => window.__batches.flat().includes('.retry-ad'));
    assert.equal(await f.page.evaluate(() => window.__attempts), 2);
  } finally { await f.close(); }
});

test('DOM: cosmetic initialization recovers after a transient worker failure', { skip }, async () => {
  const f = await fixture('<div id="card">Sponsored</div>', ['#card:has-text(Sponsored)'], { initFailures: 1 });
  try {
    await f.page.waitForFunction(() => document.querySelector('#card').hasAttribute('data-apex-hide'));
    assert.equal(await f.page.evaluate(() => window.__messages.filter(m => m.type === 'cosmetic:init').length), 2);
  } finally { await f.close(); }
});

test('DOM: iframe requests scriptlet authorization independently and retries a transient failure', { skip }, async () => {
  const f = await fixture('<div id="card">Sponsored</div>', ['#card:has-text(Sponsored)'], { scriptletFailures: 1 });
  try {
    assert.equal(await f.page.evaluate(() => window.__messages.some(m => m.type === 'scriptlets:init')), false, 'top frame uses its registered document_start script');
    await f.page.evaluate(() => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://example.test/frame';
      document.body.append(iframe);
    });
    const handle = await f.page.waitForSelector('iframe');
    const frame = await handle.contentFrame();
    await frame.waitForLoadState('load');
    await frame.addScriptTag({ content: source });
    await frame.waitForFunction(() => window.__messages.filter(m => m.type === 'scriptlets:init').length === 2);
    assert.equal(await frame.$eval('#card', n => n.hasAttribute('data-apex-hide')), true, 'cosmetic startup did not wait for the frame retry');
    assert.equal(await frame.evaluate(() => window.__messages.filter(m => m.type === 'cosmetic:init').length), 1);
  } finally { await f.close(); }
});

test('DOM: relative sibling continuations return descendants and later siblings', { skip }, async () => {
  const f = await fixture('<div class="label">Sponsored</div><section class="wrap"><div id="adjacent">Ad</div></section><aside class="later"><span id="later">Ad</span></aside>', [
    '.label:has-text(Sponsored) + .wrap > div',
    '.label:has-text(Sponsored) ~ .later span',
  ]);
  try {
    await f.page.waitForFunction(() => ['adjacent', 'later'].every(id => document.getElementById(id).hasAttribute('data-apex-hide')));
    assert.equal(await f.page.$eval('.wrap', n => n.hasAttribute('data-apex-hide')), false);
    assert.equal(await f.page.$eval('.later', n => n.hasAttribute('data-apex-hide')), false);
  } finally { await f.close(); }
});

test('DOM: procedural matches-path reacts to SPA navigation and restores visibility', { skip }, async () => {
  const f = await fixture('<div id="card">Ad</div>', [':matches-path(/sponsored/) #card']);
  try {
    assert.equal(await f.page.$eval('#card', n => n.hasAttribute('data-apex-hide')), false);
    await f.page.evaluate(() => history.pushState({}, '', '/sponsored'));
    await f.page.waitForFunction(() => document.querySelector('#card').hasAttribute('data-apex-hide'));
    await f.page.evaluate(() => history.pushState({}, '', '/article'));
    await f.page.waitForFunction(() => !document.querySelector('#card').hasAttribute('data-apex-hide'));
  } finally { await f.close(); }
});

test('DOM: picker preserves the page on failed saves and allows retrying the same selector', { skip }, async () => {
  const f = await fixture('<div id="article" style="display:block!important">Article</div>');
  try {
    await f.page.evaluate(() => {
      const attach = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function(options) { return window.__pickerRoot = attach.call(this, options); };
      window.__pickerAttempts = 0;
      chrome.runtime.sendMessage = async () => ++window.__pickerAttempts === 1 ? { ok: false, error: 'storage failed' } : { ok: true };
    });
    await f.page.addScriptTag({ content: picker });
    await f.page.evaluate(() => {
      const root = window.__pickerRoot;
      const input = root.querySelector('textarea');
      input.value = '#article';
      input.dispatchEvent(new Event('input'));
      root.querySelector('[data-act="save"]').click();
    });
    await f.page.waitForFunction(() => !window.__pickerRoot.querySelector('[data-act="save"]').disabled);
    assert.equal(await f.page.$eval('#article', n => n.style.display), 'block');
    assert.match(await f.page.evaluate(() => window.__pickerRoot.querySelector('.count').textContent), /Nie udało się/);
    await f.page.evaluate(() => window.__pickerRoot.querySelector('[data-act="save"]').click());
    await f.page.waitForFunction(() => document.querySelector('#article').style.display === 'none');
    assert.equal(await f.page.evaluate(() => window.__pickerAttempts), 2);
    await f.page.keyboard.press('Escape');
  } finally { await f.close(); }
});

test('DOM: canceling the picker during a failed save leaves the original page unchanged', { skip }, async () => {
  const f = await fixture('<div id="article" style="display:inline">Article</div>');
  try {
    await f.page.evaluate(() => {
      const attach = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function(options) { return window.__pickerRoot = attach.call(this, options); };
      chrome.runtime.sendMessage = () => new Promise(resolve => { window.__completePicker = resolve; });
    });
    await f.page.addScriptTag({ content: picker });
    await f.page.evaluate(() => {
      const root = window.__pickerRoot;
      const input = root.querySelector('textarea');
      input.value = '#article';
      input.dispatchEvent(new Event('input'));
      root.querySelector('[data-act="save"]').click();
      root.querySelector('[data-act="cancel"]').click();
      window.__completePicker({ ok: false, error: 'not saved' });
    });
    assert.equal(await f.page.$eval('#article', n => n.style.display), 'inline');
    assert.equal(await f.page.locator('apex-picker').count(), 0);
  } finally { await f.close(); }
});

test('DOM: closing and reopening the picker releases its scroll listener', { skip }, async () => {
  const f = await fixture('<div id="article">Article</div>');
  try {
    await f.page.evaluate(() => {
      window.__scrollListeners = new Set();
      const add = window.addEventListener.bind(window);
      const remove = window.removeEventListener.bind(window);
      window.addEventListener = (type, listener, options) => { if (type === 'scroll') window.__scrollListeners.add(listener); return add(type, listener, options); };
      window.removeEventListener = (type, listener, options) => { if (type === 'scroll') window.__scrollListeners.delete(listener); return remove(type, listener, options); };
    });
    for (let i = 0; i < 3; i++) {
      await f.page.addScriptTag({ content: picker });
      assert.equal(await f.page.evaluate(() => window.__scrollListeners.size), 1);
      await f.page.keyboard.press('Escape');
      assert.equal(await f.page.evaluate(() => window.__scrollListeners.size), 0);
      assert.equal(await f.page.locator('apex-picker').count(), 0);
    }
  } finally { await f.close(); }
});
