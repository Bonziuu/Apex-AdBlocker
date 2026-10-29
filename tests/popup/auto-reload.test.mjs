import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadBackground } from '../helpers/chrome-mock.mjs';
import { ROOT } from '../../tools/lists-config.mjs';

test('auto reload: brak klucza = true i site:toggle przeładowuje kartę', async () => {
  const bg = await loadBackground({ tabUrl: 'https://www.example.com/' });
  try {
    await bg.install();
    const info = await bg.send({ type: 'popup:get', tabId: 7 });
    assert.equal(info.autoReloadOnToggle, true);
    bg.state.reloads.length = 0;
    const r = await bg.send({ type: 'site:toggle', host: 'example.com', tabId: 7 });
    assert.equal(r.ok, true);
    assert.equal(r.disabled, true);
    assert.deepEqual(bg.state.reloads, [7]);
  } finally { bg.restore(); }
});

test('auto reload: false zapisuje preferencję i nie przeładowuje, ale synchronizuje stan i ikonę', async () => {
  const bg = await loadBackground({ tabUrl: 'https://www.example.com/', local: { autoReloadOnToggle: false } });
  try {
    await bg.install();
    bg.state.reloads.length = 0;
    bg.state.icons.length = 0;
    const r = await bg.send({ type: 'site:toggle', host: 'example.com', tabId: 7 });
    assert.equal(r.ok, true);
    assert.equal(r.disabled, true);
    assert.equal(bg.state.reloads.length, 0);
    assert.ok(bg.state.dynamic.some((x) => x.id === 1 && x.condition.requestDomains.includes('example.com')));
    assert.match(bg.state.icons.at(-1).path[16], /-off\.png$/);
  } finally { bg.restore(); }
});

test('popup:setAutoReload zapisuje globalną preferencję i popup:get ją zwraca', async () => {
  const bg = await loadBackground({ tabUrl: 'https://www.example.com/' });
  try {
    await bg.install();
    const set = await bg.send({ type: 'popup:setAutoReload', enabled: false });
    assert.deepEqual(set, { ok: true, autoReloadOnToggle: false });
    assert.equal(bg.store.autoReloadOnToggle, false);
    assert.equal((await bg.send({ type: 'popup:get', tabId: 7 })).autoReloadOnToggle, false);
    await bg.send({ type: 'popup:setAutoReload', enabled: true });
    assert.equal(bg.store.autoReloadOnToggle, true);
  } finally { bg.restore(); }
});

test('popup: ma dostępny checkbox, dynamiczny hint i łagodną informację o ręcznym odświeżeniu', () => {
  const html = fs.readFileSync(path.join(ROOT, 'popup', 'popup.html'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'popup', 'popup.js'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'popup', 'popup.css'), 'utf8');
  assert.match(html, /id="autoReload"/);
  assert.match(html, /Odświeżaj stronę po zmianie ochrony/);
  assert.match(html, /id="reloadNotice"[^>]*aria-live="polite"/);
  assert.match(js, /popup:setAutoReload/);
  assert.match(js, /bez automatycznego przeładowania/);
  assert.match(js, /reloadNotice/);
  assert.match(css, /accent-color:\s*var\(--accent\)/);
});

test('badge używa palety morskiej, bez starego fioletu', () => {
  const src = fs.readFileSync(path.join(ROOT, 'background.js'), 'utf8');
  assert.match(src, /setBadgeBackgroundColor\(\{ color: '#0f7f8c' \}\)/);
  assert.doesNotMatch(src, /#5b5bd6/i);
});
