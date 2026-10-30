import test from 'node:test';
import assert from 'node:assert/strict';
import { policyHtml } from '../../tools/webstore-materials.mjs';

test('public policy: retains real policy details, escapes HTML, and removes preparation labels', () => {
  const html = policyHtml('# Apex policy — publication draft\n\n**Status: draft for review.**\n\n## Contact\n\n**Konrad Woźniak**\nkonrad.wozniak.1996@gmail.com\n\n<script>alert(1)</script>\n\nUse `localStorage`.', 'en');
  assert.match(html, /<h1>Apex policy<\/h1>/);
  assert.match(html, /<strong>Konrad Woźniak<\/strong>/);
  assert.match(html, /konrad.wozniak.1996@gmail.com/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /<code>localStorage<\/code>/);
  assert.doesNotMatch(html, /publication draft|Status: draft|<script>/);
  assert.match(html, /default-src 'none'/);
  assert.match(html, /href="privacy.html"/);
  assert.throws(() => policyHtml('text', 'invalid'), /language/);
});
