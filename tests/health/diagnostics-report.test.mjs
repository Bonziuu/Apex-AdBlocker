// Raport diagnostyczny (Opcje → Diagnostyka → „Kopiuj raport diagnostyczny”): sanityzacja i zawartość.

import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeText, buildDiagnosticsReport } from '../../background/diagnostics-report.js';

test('sanitizeText: usuwa pełne adresy URL', () => {
  const s = sanitizeText('błąd w https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10 oraz http://a.b/c');
  assert.ok(!/https?:/.test(s));
  assert.ok(!s.includes('dQw4w9WgXcQ'));
  assert.match(s, /\[url\]/);
});

test('sanitizeText: usuwa ID filmów w ścieżkach i parametrach', () => {
  for (const input of ['youtu.be/dQw4w9WgXcQ', '/shorts/AbCdEfGhIjK', '/embed/aqz-KE-bpKQ', 'param v=9bZkp7q19f0', '?list=PL1234567890abc']) {
    const s = sanitizeText(input);
    for (const id of ['dQw4w9WgXcQ', 'AbCdEfGhIjK', 'aqz-KE-bpKQ', '9bZkp7q19f0', 'PL1234567890abc']) assert.ok(!s.includes(id), `${input} → ${s}`);
  }
});

test('sanitizeText: usuwa cookies, tokeny, loginy i e-maile', () => {
  const s = sanitizeText('Cookie: SID=abc; HSID=def\nAuthorization Bearer eyJhbGciOi.payload.sig token=xyz123 password=hunter2 user=jan jan.kowalski@example.com');
  for (const secret of ['SID=abc', 'HSID=def', 'eyJhbGciOi', 'xyz123', 'hunter2', 'user=jan', 'jan.kowalski', 'example.com']) {
    assert.ok(!s.includes(secret), `wyciekło: ${secret} w ${s}`);
  }
});

test('sanitizeText: usuwa nazwy hostów i długie tokeny, ogranicza długość', () => {
  const s = sanitizeText(`blocked on ads.example.net and music.youtube.com ${'A'.repeat(40)}`);
  assert.ok(!s.includes('example.net') && !s.includes('youtube.com'));
  assert.ok(!s.includes('A'.repeat(40)));
  assert.ok(sanitizeText('x'.repeat(1000)).length <= 300);
  assert.equal(sanitizeText(null), '');
});

test('sanitizeText: zachowuje zwykłe komunikaty techniczne', () => {
  assert.equal(sanitizeText('dynamicRules: limit reguł'), 'dynamicRules: limit reguł');
});

const fullInput = () => ({
  version: '0.2.1',
  versionName: '0.2.1-dev',
  manifestVersion: 3,
  now: Date.UTC(2026, 9, 21, 12),
  enabledLists: ['ads', 'privacy', 'evil/<x>'],
  health: {
    components: {
      network: { status: 'ok', detail: '' },
      cosmetic: { status: 'warning', detail: 'brak danych dla https://shop.example.com/cart?session=abc' },
      youtube: { status: 'ok', detail: 'ochrona aktywna' },
    },
    sync: { rulesets: { status: 'ok', at: Date.UTC(2026, 9, 21, 11), message: 'ok' } },
    errors: Array.from({ length: 15 }, (_, i) => ({ timestamp: Date.UTC(2026, 9, 21, 10, i), component: 'cosmetic', message: `e${i} na https://site${i}.example.org/` })),
  },
  youtubeCompat: { total: 30, supported: 30, partial: 0, unsupported: 0, knownGaps: [], newGaps: [] },
  scriptletCompat: { summary: { total: 100, supported: 90, partial: 5, unsupported: 5 } },
  player: { tabId: 7, frameId: 0, frame: 'top', page: 'watch', status: 'healthy', reasons: [], at: Date.UTC(2026, 9, 21, 11, 59) },
  devPerf: false,
});

test('buildDiagnosticsReport: zawiera dozwolone dane', () => {
  const { data, text } = buildDiagnosticsReport(fullInput());
  assert.match(text, /^ChromeBlock Diagnostics/);
  assert.match(text, /Version: 0\.2\.1-dev \(manifest v3\)/);
  assert.match(text, /Network: OK/);
  assert.match(text, /Cosmetic: WARNING/);
  assert.match(text, /YouTube compatibility:\n {2}30 \/ 30/);
  assert.match(text, /Scriptlet compatibility:\n {2}90 \/ 100/);
  assert.match(text, /Player:\n {2}healthy \(watch, top\)/);
  assert.match(text, /Perf diagnostics: disabled/);
  assert.deepEqual(data.enabledLists, ['ads', 'privacy', 'evilx']);
  assert.equal(data.recentErrors.length, 10, 'tylko 10 ostatnich błędów');
  assert.equal(data.generatedAt, '2026-10-21T12:00:00.000Z');
});

test('buildDiagnosticsReport: nie zawiera URL, hostów, sesji ani identyfikatorów karty', () => {
  const { data, text } = buildDiagnosticsReport(fullInput());
  const all = text + JSON.stringify(data);
  assert.ok(!/https?:\/\//.test(all));
  assert.ok(!all.includes('example.com') && !all.includes('example.org'));
  assert.ok(!all.includes('session=abc'));
  assert.ok(!('tabId' in data.player) && !('frameId' in data.player), 'bez identyfikatorów kart');
});

test('buildDiagnosticsReport: nieznany typ strony odtwarzacza → "other"; brak danych → unknown/none', () => {
  const input = fullInput();
  input.player.page = 'watch?v=dQw4w9WgXcQ';
  assert.equal(buildDiagnosticsReport(input).data.player.page, 'other');
  const { text } = buildDiagnosticsReport({ version: '0.2.1', manifestVersion: 3, now: 0 });
  assert.match(text, /YouTube compatibility:\n {2}unknown/);
  assert.match(text, /Player:\n {2}no recent report/);
  assert.match(text, /Recent ChromeBlock errors:\n {2}none/);
});
