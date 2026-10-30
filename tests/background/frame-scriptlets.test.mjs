import test from 'node:test';
import assert from 'node:assert/strict';
import { scriptletFilesForFrame } from '../../background/frame-scriptlets.js';
import { loadBackground, sender } from '../helpers/chrome-mock.mjs';

const files = {
  'data/lists.json': [{ id: 'ads', name: 'Ads' }],
  'data/ads.scriptlets.json': [
    { file: 'scriptlets/ads-0.js', jsBefore: ['shared/entity-hosts.js'], matches: ['*://*.video.example/*'] },
  ],
};
const frame = (documentId = 'frame-document-1') => ({
  ...sender('https://video.example/embed/video', 3, 'https://news.example/'), documentId,
});
const options = (extra = {}) => ({ files, tabUrl: 'https://news.example/', ...extra });

test('frame file selection respects origin, subdomain boundaries, paths and helper order', () => {
  const metadata = [
    { file: 'a.js', jsBefore: ['helper.js'], matches: ['https://*.video.example/embed/*'] },
    { file: 'b.js', jsBefore: ['helper.js'], matches: ['*://video.example/embed/*'] },
  ];
  assert.deepEqual(scriptletFilesForFrame(metadata, 'https://video.example/embed/a?x=1'), ['helper.js', 'a.js', 'b.js']);
  assert.deepEqual(scriptletFilesForFrame(metadata, 'https://sub.video.example/embed/a'), ['helper.js', 'a.js']);
  assert.deepEqual(scriptletFilesForFrame(metadata, 'http://video.example/embed/a'), ['helper.js', 'b.js']);
  for (const url of ['https://video.example.evil/embed/a', 'https://video.example/other', 'file:///video.example/embed/a', 'about:blank', 'invalid']) {
    assert.deepEqual(scriptletFilesForFrame(metadata, url), [], url);
  }
  assert.deepEqual(scriptletFilesForFrame(metadata, 'https://video.example/embed/a', { devPerf: true }),
    ['content/scriptlet-perf-on.js', 'helper.js', 'a.js', 'b.js']);
});

test('top-level hooks stay at document_start; allowed frames use trusted URL and document IDs once', async () => {
  const bg = await loadBackground(options());
  try {
    await bg.install();
    assert.ok(bg.state.registered.length > 0);
    assert.ok(bg.state.registered.every((registration) => !registration.allFrames && registration.runAt === 'document_start'));
    const message = { type: 'scriptlets:init', url: 'https://evil.example/' };
    const [a, b] = await Promise.all([bg.send(message, frame()), bg.send(message, frame())]);
    assert.deepEqual(a, { ok: true, injected: 2 });
    assert.deepEqual(b, a);
    assert.deepEqual(bg.state.executed, [{
      target: { tabId: 7, documentIds: ['frame-document-1'] },
      files: ['shared/entity-hosts.js', 'scriptlets/ads-0.js'], world: 'MAIN', injectImmediately: true,
    }]);
  } finally { bg.restore(); }
});

test('disabled top-level sites suppress cross-origin frame scriptlets and generic cosmetics', async () => {
  const bg = await loadBackground(options());
  try {
    await bg.install();
    await bg.send({ type: 'site:toggle', host: 'news.example' });
    assert.deepEqual(await bg.send({ type: 'scriptlets:init', url: 'https://allowed.example/' }, frame()), { ok: true, off: true });
    assert.deepEqual(await bg.send({ type: 'cosmetic:tokens', tokens: ['.ad'], url: 'https://video.example/' }, frame()), { selectors: 0, off: true });
    assert.equal(bg.state.executed.length, 0);
    assert.equal(bg.state.css.length, 0);
  } finally { bg.restore(); }
});

test('disabled frame origins are excluded even when their top-level site is enabled', async () => {
  const bg = await loadBackground(options());
  try {
    await bg.install();
    await bg.send({ type: 'site:toggle', host: 'video.example' });
    assert.deepEqual(await bg.send({ type: 'scriptlets:init' }, frame()), { ok: true, off: true });
    assert.equal(bg.state.executed.length, 0);
  } finally { bg.restore(); }
});

test('missing document identity, opaque URL, changed top-level origin and cached documents fail closed', async () => {
  const bg = await loadBackground(options());
  try {
    await bg.install();
    for (const invalid of [
      { ...frame(), documentId: undefined },
      { ...frame(), url: 'about:blank' },
      { ...frame(), tab: { id: 7, url: 'https://old.example/' } },
      { ...frame(), documentLifecycle: 'cached' },
    ]) {
      const result = await bg.send({ type: 'scriptlets:init', documentId: 'forged', url: 'https://video.example/' }, invalid);
      assert.equal(result.ok, false);
    }
    assert.equal(bg.state.executed.length, 0);
  } finally { bg.restore(); }
});

test('a stale document rejection never falls back to frameId; a new document can request injection', async () => {
  const opts = options({ failExecute: ({ target }) => target.documentIds.includes('stale-document') });
  const bg = await loadBackground(opts);
  try {
    await bg.install();
    const rejected = await bg.send({ type: 'scriptlets:init' }, frame('stale-document'));
    assert.equal(rejected.ok, false);
    assert.match(rejected.error, /No document/);
    assert.equal(bg.state.executed.length, 0);
    assert.deepEqual(await bg.send({ type: 'scriptlets:init' }, frame('current-document')), { ok: true, injected: 2 });
    assert.deepEqual(bg.state.executed[0].target, { tabId: 7, documentIds: ['current-document'] });
  } finally { bg.restore(); }
});
