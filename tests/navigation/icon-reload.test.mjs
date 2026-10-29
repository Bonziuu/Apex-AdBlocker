import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBackground, sender } from '../helpers/chrome-mock.mjs';

const tick = () => new Promise((resolve) => setTimeout(resolve, 25));

test('F5 na wyłączonej stronie przywraca szarą ikonę bez traktowania reloadu jako zmiany URL', async () => {
  const bg = await loadBackground({ tabUrl: 'https://example.com/page' });
  try {
    await bg.install();
    await bg.send({ type: 'options:setDisabledSites', sites: ['example.com'] });
    bg.state.icons.length = 0;
    bg.state.listeners.tabUpdated(7, { status: 'loading' }, { id: 7, url: 'https://example.com/page' });
    await tick();
    assert.equal(bg.state.icons.length, 1);
    assert.equal(bg.state.icons[0].tabId, 7);
    assert.match(bg.state.icons[0].path[16], /-off\.png$/);
  } finally { bg.restore(); }
});

test('reload aktywnej strony nie wymusza setIcon, a raport YouTube nie jest czyszczony', async () => {
  const url = 'https://www.youtube.com/watch?v=A';
  const bg = await loadBackground({ tabUrl: url });
  try {
    await bg.install();
    await bg.send({ type: 'youtube:health', status: 'error', reasons: ['test'], page: 'watch' }, sender(url));
    bg.state.icons.length = 0;
    bg.state.tabMessages.length = 0;
    bg.state.listeners.tabUpdated(7, { status: 'loading' }, { id: 7, url });
    await tick();
    assert.equal(bg.state.icons.length, 0);
    assert.equal(bg.state.tabMessages.length, 0);
    assert.equal((await bg.send({ type: 'health:get' })).youtube.player.status, 'error');
  } finally { bg.restore(); }
});
