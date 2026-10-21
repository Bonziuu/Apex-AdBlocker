// Narzędzie pomiaru wydajności YouTube: przypisanie czasu profilu CPU do komponentów.

import test from 'node:test';
import assert from 'node:assert/strict';
import { attributeProfile } from '../../tools/perf/youtube-perf.mjs';
import { fixtureHtml, playerResponse } from '../../tools/perf/youtube-fixture.mjs';

const EXT = 'chrome-extension://abcdefghijklmnop';
const node = (id, url, functionName, children = [], lineNumber = 0) => ({ id, callFrame: { url, functionName, lineNumber }, children });

test('attributeProfile: natywne wywołania dziedziczą właściciela; powrót do kodu strony zmienia właściciela', () => {
  const profile = {
    nodes: [
      node(1, '', '(root)', [2, 7, 8]),
      node(2, 'https://www.youtube.com/s/app.js', 'render', [3]),
      node(3, `${EXT}/scriptlets/ads-3.js`, 'apply', [4, 5], 490),
      node(4, '', 'stringify'),                         // natywne pod scriptletem → scriptlety
      node(5, 'https://www.youtube.com/s/app.js', 'cb', [6]), // callback strony → strona
      node(6, '', 'appendChild'),                       // natywne pod stroną → strona
      node(7, `${EXT}/content/cosmetic.js`, 'apply', []),
      node(8, '', '(idle)'),
    ],
    samples: [2, 3, 4, 4, 5, 6, 7, 8],
    timeDeltas: [1000, 1000, 1000, 1000, 1000, 1000, 2000, 5000],
  };
  const { totals, top } = attributeProfile(profile);
  assert.equal(totals.page, 3);
  assert.equal(totals.scriptlets, 3);
  assert.equal(totals.cosmetic, 2);
  assert.equal(totals.idle, 5);
  assert.ok(top.some((t) => t.fn === 'scriptlets→native stringify' && t.ms === 2));
  assert.ok(top.some((t) => t.fn.startsWith('scriptlets:ads-3.js:491 apply')));
});

test('fixture: strona bez treści YouTube, z obciążeniem i polami reklam w odpowiedzi', () => {
  const html = fixtureHtml();
  assert.match(html, /window\.__runWorkload/);
  assert.match(html, /id="movie_player"/);
  const r = playerResponse(50);
  assert.ok(Array.isArray(r.adPlacements) && r.adPlacements.length > 0);
  assert.ok(JSON.stringify(r).length >= 50 * 1024);
});
