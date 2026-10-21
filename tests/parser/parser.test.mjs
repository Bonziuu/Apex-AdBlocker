// Testy parsera filtrów na PRAWDZIWYCH przykładach z aktywnych list.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyLine, parseNetworkFilter, parseCosmeticFilter, parseDomainList, splitSelectorList,
  genericToken, parseProcedural, PRIORITY,
} from '../../shared/parser.js';
import { findLine } from '../helpers/lists.mjs';

const net = (line, trusted = false) => parseNetworkFilter(classifyLine(line).text, { trusted });
const cos = (line, trusted = false) => parseCosmeticFilter(classifyLine(line), { trusted });

// ------------------------------------------------------------- sieciowe

test('block: "||doubleclick.net^" (EasyList) → requestDomains', () => {
  const hit = findLine(/^\|\|doubleclick\.net\^$/);
  assert.deepEqual(net(hit.line).rule, { priority: PRIORITY.block, action: { type: 'block' }, condition: { requestDomains: ['doubleclick.net'] } });
});

test('allow: "@@||…^$…" z aktywnych list → reguła allow z wyższym priorytetem', () => {
  const hit = findLine(/^@@\|\|[a-z0-9.-]+\^\$(script|xmlhttprequest)(,|$)/);
  const r = net(hit.line).rule;
  assert.equal(r.action.type, 'allow');
  assert.equal(r.priority, PRIORITY.allow);
  assert.ok(r.condition.resourceTypes.length >= 1);
});

test('domain restrictions: $domain=a|~b → initiatorDomains / excludedInitiatorDomains', () => {
  const hit = findLine(/\$.*domain=[a-z0-9.-]+\|~[a-z0-9.-]+/);
  const r = net(hit.line).rule;
  assert.ok(r.condition.initiatorDomains.length >= 1);
  assert.ok(r.condition.excludedInitiatorDomains.length >= 1);
});

test('resource types: $script,third-party', () => {
  const r = net('||ads.example.com/x.js$script,third-party').rule;
  assert.deepEqual(r.condition.resourceTypes, ['script']);
  assert.equal(r.condition.domainType, 'thirdParty');
  const neg = net('||ads.example.com^$~script,~image').rule;
  assert.deepEqual(neg.condition.excludedResourceTypes.sort(), ['image', 'main_frame', 'script']);
});

test('important: priorytet wyższy niż allow', () => {
  const hit = findLine(/^\|\|[^$]+\$.*\bimportant\b/);
  const r = net(hit.line).rule;
  assert.ok(r.priority > PRIORITY.allow);
});

test('redirect: redirect=noopjs → przekierowanie na zasób rozszerzenia', () => {
  const hit = findLine(/\$.*redirect=(noopjs|noop\.js)(,|$)/);
  const r = net(hit.line, hit.trusted).rule;
  assert.equal(r.action.type, 'redirect');
  assert.equal(r.action.redirect.extensionPath, '/web_accessible_resources/noop.js');
  assert.ok(r.priority > PRIORITY.block, 'przekierowanie wygrywa z blokadą');
});

test('removeparam: usuwanie parametru zapytania', () => {
  const r = net('||example.com^$removeparam=fbclid').rule;
  assert.deepEqual(r.action.redirect.transform.queryTransform.removeParams, ['fbclid']);
  assert.equal(net('$removeparam=/^utm_/'), null, 'regex w removeparam nie jest obsługiwany → pominięty');
});

test('regex: /…/ → regexFilter; nieobsługiwane konstrukcje RE2 są pomijane', () => {
  assert.equal(net('/banner[0-9]+\\.gif/$image').rule.condition.regexFilter, 'banner[0-9]+\\.gif');
  assert.equal(net('/ad(?=s)/$image'), null);
});

test('nieobsługiwane opcje MV3 ($csp, $popup) → filtr pominięty', () => {
  assert.equal(net('||example.com^$csp=script-src'), null);
  assert.equal(net('||example.com^$popup'), null);
});

test('regresja: $domain z samymi nieczytelnymi domenami pozytywnymi nie staje się filtrem ogólnym', () => {
  assert.equal(net('||ads.example^$domain=/regex/|~ok.com'), null);
});

// ---------------------------------------------------------- kosmetyczne

test('cosmetic: selektor ogólny z EasyList', () => {
  const hit = findLine(/^##\.ad-container--top$/);
  assert.deepEqual(cos(hit.line), { type: 'hide', include: [], exclude: [], selector: '.ad-container--top' });
  assert.equal(genericToken('.ad-container--top'), '.ad-container--top');
  assert.equal(genericToken('[id^="div-gpt-ad"]'), null);
});

test('cosmetic: selektor specyficzny z wieloma domenami i wyjątkami', () => {
  const f = cos('example.com,~sub.example.com##div.sponsored');
  assert.deepEqual(f.include, ['example.com']);
  assert.deepEqual(f.exclude, ['sub.example.com']);
});

test('cosmetic: encje "google.*" zostają encjami (dopasowanie w czasie działania)', () => {
  assert.deepEqual(cos('google.*##.commercial-unit').include, ['google.*']);
});

test('cosmetic: wyjątek #@#', () => {
  assert.deepEqual(cos('example.com#@#.ad-box'), { type: 'unhide', include: ['example.com'], selector: '.ad-box' });
});

test('cosmetic: listy selektorów rozdzielane po przecinkach najwyższego poziomu', () => {
  assert.deepEqual(splitSelectorList('.a, div:not(.b, .c), [x="1,2"]'), ['.a', 'div:not(.b, .c)', '[x="1,2"]']);
});

test('procedural: has-text + upward z aktywnej listy', () => {
  const hit = findLine(/^[a-z0-9.-]+##[^#]*:has-text\([^)]*\):upward\(\d+\)$/);
  const f = cos(hit.line);
  assert.equal(f.type, 'procedural');
  assert.ok(f.tasks.some((t) => t.op === 'has-text'));
  assert.ok(f.tasks.some((t) => t.op === 'upward'));
});

test('procedural: :style() na zwykłym selektorze → CSS', () => {
  assert.deepEqual(cos('example.com##body:style(overflow: auto !important)'),
    { type: 'style', include: ['example.com'], exclude: [], selector: 'body', css: 'overflow: auto !important' });
});

test('procedural: zagnieżdżone operatory proceduralne są odrzucane (nieobsługiwane)', () => {
  assert.equal(parseProcedural('.post:has(> .label:has-text(Sponsored))'), null);
});

test('regresja: domeny "x>>" nie mogą zamienić filtra w ogólny', () => {
  assert.equal(cos('pcgamer.com>>,~youtube.com##.ad'), null);
  assert.equal(cos('pcgamer.com>>,~youtube.com##+js(nowoif)'), null);
  const mixed = cos('pcgamer.com>>,example.com##.ad');
  assert.deepEqual(mixed.include, ['example.com'], 'czytelne domeny pozytywne zostają');
  const dl = parseDomainList('a.com>>,~b.com', ',', true);
  assert.equal(dl.droppedInclude, 1);
});

test('filtrowanie HTML (##^) i snippety ABP (#$#) są pomijane', () => {
  assert.equal(cos('example.com##^script:has-text(ad)'), null);
  assert.equal(cos('example.com#$#abort-on-property-read x'), null);
});

// ------------------------------------------------------------- scriptlety

test('scriptlet parsing: prawdziwy filtr YouTube z cudzysłowami', () => {
  const hit = findLine(/www\.youtube\.com##\+js\(trusted-rpfr, '"adPlacements"', '"no_ads"', player\?\)/);
  const f = cos(hit.line, hit.trusted);
  assert.equal(f.type, 'scriptlet');
  assert.deepEqual(f.call, ['trusted-replace-fetch-response', '"adPlacements"', '"no_ads"', 'player?']);
});

test('scriptlet parsing: escapowany przecinek "\\," w argumencie', () => {
  const hit = findLine(/www\.youtube\.com##\+js\(rmnt, script, window\\,"fetch"\)/);
  assert.deepEqual(cos(hit.line, hit.trusted).call, ['remove-node-text', 'script', 'window,"fetch"']);
});

test('scriptlet: aliasy są zamieniane na nazwy kanoniczne', () => {
  assert.deepEqual(cos('example.com##+js(nostif, adb, 1000)').call, ['prevent-setTimeout', 'adb', '1000']);
  assert.deepEqual(cos('example.com##+js(aopr, foo)').call, ['abort-on-property-read', 'foo']);
});

test('unsupported scriptlet: brak implementacji → scriptlet-rejected (NIE wykonywany)', () => {
  const f = cos('example.com##+js(href-sanitizer, a[href], ?url)', true);
  assert.equal(f.type, 'scriptlet-rejected');
  assert.equal(f.support.status, 'unsupported');
  assert.match(f.support.reason, /brak implementacji/);
});

test('unsupported scriptlet arguments: znany scriptlet z nieznanym parametrem → partial (NIE wykonywany)', () => {
  const f = cos('example.com##+js(rpnt, script, a, b, unknownOption, 1)', true);
  assert.equal(f.type, 'scriptlet-rejected');
  assert.equal(f.support.status, 'partial');
  assert.match(f.support.reason, /unknownOption/);
  const stack = cos('example.com##+js(json-prune, ads, , /stack/)');
  assert.equal(stack.support.status, 'partial');
  assert.match(stack.support.reason, /stack/);
});

test('scriptlet zaufany z niezaufanej listy → odrzucony', () => {
  const f = cos('example.com##+js(trusted-set-cookie, a, b)', false);
  assert.equal(f.type, 'scriptlet-rejected');
  assert.match(f.support.reason, /zaufany/);
});

test('ogólny scriptlet (bez domeny) → odrzucony', () => {
  assert.equal(cos('##+js(nowebrtc)').type, 'scriptlet-rejected');
});

test('wyjątki scriptletów #@#+js(...) używają nazwy kanonicznej', () => {
  const f = cos('example.com#@#+js(nostif, adb)');
  assert.equal(f.type, 'unscriptlet');
  assert.equal(f.key, ['prevent-setTimeout', 'adb'].join('\u0001'));
  assert.equal(cos('example.com#@#+js()').key, '*');
});

test('regresja (prawdziwy Chromium): regexFilter z licznikiem powtórzeń > 1000 jest odrzucany (RE2)', async () => {
  const { maxRegexRepeat, RE2_MAX_REPEAT } = await import('../../shared/parser.js');
  assert.equal(RE2_MAX_REPEAT, 1000);
  // filtr z EasyList, przez który Chrome odmawiał załadowania całego rozszerzenia
  const bad = '/^https?:\\/\\/[-a-z]{5,13}\\.[a-z]{3,6}\\/[0-9a-h]{1,17}\\?[0-9a-zA-Z]{1,22}=[%0-9a-zA-Z]{200,1300}/$xmlhttprequest,3p,match-case';
  assert.equal(parseNetworkFilter(bad), null);
  assert.ok(parseNetworkFilter('/^https?:\\/\\/[a-z]{3,8}\\.example\\/[0-9]{1000}/$script').rule.condition.regexFilter, 'dokładnie 1000 – dozwolone');
  assert.equal(maxRegexRepeat('a{1001}'), 1001);
  assert.equal(maxRegexRepeat('(a{100}){20}'), 2000, 'iloczyn zagnieżdżonych liczników');
  assert.equal(maxRegexRepeat('(?:ab{30}){40}'), 1200);
  assert.equal(maxRegexRepeat('(a{10}){10}'), 100);
  assert.equal(maxRegexRepeat('[{]{5}x\\{2000}'), 5, 'nawiasy w klasie i escapowane nie są licznikami');
  assert.equal(maxRegexRepeat('x{2,}'), 2);
  assert.equal(maxRegexRepeat('(a'), Infinity, 'niezamknięta grupa → odrzucenie');
});

test('regresja (prawdziwy Chromium): żaden wygenerowany regexFilter nie przekracza limitu RE2', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const { maxRegexRepeat, RE2_MAX_REPEAT } = await import('../../shared/parser.js');
  const dir = new URL('../../rules/', import.meta.url);
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    for (const r of JSON.parse(fs.readFileSync(new URL(f, dir), 'utf8'))) {
      const re = r.condition.regexFilter;
      if (re) assert.ok(maxRegexRepeat(re) <= RE2_MAX_REPEAT, `${path.basename(f)} reguła ${r.id}: ${re}`);
    }
  }
});
