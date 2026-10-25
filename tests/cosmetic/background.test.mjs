// Testy service workera na atrapie Chrome: filtry kosmetyczne, wyjątki między
// listami w czasie działania, przycisk zasilania, własne filtry, picker,
// obsługa błędów synchronizacji.

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBackground, sender } from '../helpers/chrome-mock.mjs';

const listsJson = (ids) => ids.map((id) => ({ id, name: id, desc: '', enabledByDefault: id === 'ads', networkFilters: 0, cosmeticFilters: 0 }));
const emptyList = (extra = {}) => ({ sel: [], gen: {}, genC: [], spec: {}, unhide: {}, style: {}, proc: {}, ghide: [], ehide: [], docAllow: [], gunhide: [], ...extra });

test('instalacja: włącza domyślne listy, rejestruje scriptlety i zapisuje wynik każdego kroku', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    assert.deepEqual([...bg.state.enabledRulesets].sort(), ['ads', 'privacy', 'security']);
    assert.ok(bg.state.registered.length > 0);
    assert.ok(bg.state.registered.every((s) => s.world === 'MAIN' && s.runAt === 'document_start'));
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.sync.rulesets.status, 'ok');
    assert.equal(h.sync.dynamicRules.status, 'ok');
    assert.equal(h.sync.scriptlets.status, 'ok');
    assert.equal(h.components.network.status, 'ok');
    assert.equal(h.components.scriptlets.status, 'ok');
    assert.equal(h.components.youtube.status, 'ok', JSON.stringify(h.youtube && h.youtube.checks));
    assert.equal(h.components.cosmetic.status, 'ok');
    assert.equal(h.components.filters.status, 'ok');
    // $badfilter z ADS wyłącza reguły PRIVACY (ADS włączone)
    const upd = bg.state.staticRuleUpdates.find((u) => u.rulesetId === 'privacy');
    assert.ok(upd && upd.disableRuleIds.length > 0);
  } finally { bg.restore(); }
});

test('regresja: błąd syncScriptlets() NIE jest przemilczany (status ERROR, dziennik z czasem i komponentem)', async () => {
  const bg = await loadBackground({ failRegister: (id) => id === 'sl-ads-3' });
  try {
    await bg.install();
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.sync.scriptlets.status, 'error');
    assert.match(h.sync.scriptlets.message, /sl-ads-3/);
    assert.equal(h.components.scriptlets.status, 'error');
    const e = h.errors.find((x) => x.component === 'scriptlets');
    assert.ok(e && typeof e.timestamp === 'number' && /sl-ads-3/.test(e.message));
    assert.equal(h.sync.rulesets.status, 'ok', 'inne kroki niezależne');
    const popup = await bg.send({ type: 'popup:get', tabId: 7 });
    assert.ok(popup.problems.includes('scriptlets'), 'okienko pokazuje problem');
  } finally { bg.restore(); }
});

test('błąd syncRulesets() → status ERROR dla network i filters', async () => {
  const bg = await loadBackground({ failRulesets: true });
  try {
    await bg.install();
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.sync.rulesets.status, 'error');
    assert.equal(h.components.network.status, 'error');
    assert.equal(h.components.filters.status, 'error');
  } finally { bg.restore(); }
});

test('regresja: ogólny #@# z wyłączonej listy nie wpływa na inne listy; z włączonej – działa między listami', async () => {
  const files = {
    'data/lists.json': listsJson(['ads', 'annoyances']),
    'data/ads.json': emptyList({ sel: ['.example-ad', '.other'], gen: { '.example-ad': [0], '.other': [1] } }),
    'data/annoyances.json': emptyList({ gunhide: ['.example-ad'] }),
    'data/ads.scriptlets.json': [], 'data/annoyances.scriptlets.json': [],
  };
  const bg = await loadBackground({ files });
  try {
    await bg.install();
    await bg.send({ type: 'cosmetic:tokens', tokens: ['.example-ad', '.other'], url: 'https://site.test/' }, sender('https://site.test/'));
    let css = bg.state.css.at(-1).css;
    assert.match(css, /\.example-ad\{display:none!important\}/, 'annoyances wyłączone – selektor ukrywa');
    await bg.send({ type: 'options:setLists', enabledLists: ['ads', 'annoyances'] });
    bg.state.css.length = 0;
    await bg.send({ type: 'cosmetic:tokens', tokens: ['.example-ad', '.other'], url: 'https://site.test/' }, sender('https://site.test/'));
    css = bg.state.css.at(-1).css;
    assert.doesNotMatch(css, /\.example-ad\{/, 'annoyances włączone – wyjątek działa');
    assert.match(css, /\.other\{/);
  } finally { bg.restore(); }
});

test('filtry specyficzne, wyjątki hosta i $generichide', async () => {
  const files = {
    'data/lists.json': listsJson(['ads']),
    'data/ads.json': emptyList({
      sel: ['.banner', '.generic-complex', '.ok'],
      spec: { 'news.test': [0, 2] },
      genC: [1],
      unhide: { 'sub.news.test': ['.banner'] },
      ghide: ['nogeneric.test'],
    }),
    'data/ads.scriptlets.json': [],
  };
  const bg = await loadBackground({ files });
  try {
    await bg.install();
    await bg.send({ type: 'cosmetic:init', url: 'https://www.news.test/' }, sender('https://www.news.test/'));
    let css = bg.state.css.at(-1).css;
    assert.match(css, /\.banner\{display:none!important\}/);
    assert.match(css, /\.generic-complex\{/);
    await bg.send({ type: 'cosmetic:init', url: 'https://sub.news.test/' }, sender('https://sub.news.test/'));
    css = bg.state.css.at(-1).css;
    assert.doesNotMatch(css, /\.banner\{/, 'wyjątek dla subdomeny');
    const r = await bg.send({ type: 'cosmetic:init', url: 'https://nogeneric.test/' }, sender('https://nogeneric.test/'));
    assert.equal(r.generic, false);
    assert.doesNotMatch(bg.state.css.at(-1).css, /generic-complex/);
  } finally { bg.restore(); }
});

test('przycisk zasilania: wyłączenie strony → reguła allowAllRequests, excludeMatches dla scriptletów, brak CSS', async () => {
  const bg = await loadBackground({ tabUrl: 'https://www.onet.pl/' });
  try {
    await bg.install();
    const r = await bg.send({ type: 'site:toggle', host: 'www.onet.pl', tabId: 7 });
    assert.equal(r.ok, true);
    assert.equal(r.disabled, true);
    const rule = bg.state.dynamic.find((x) => x.id === 1);
    assert.deepEqual(rule.condition.requestDomains, ['onet.pl']);
    assert.equal(rule.action.type, 'allowAllRequests');
    assert.ok(bg.state.registered.every((s) => (s.excludeMatches || []).includes('*://*.onet.pl/*')));
    assert.deepEqual(await bg.send({ type: 'cosmetic:init', url: 'https://sport.onet.pl/' }, sender('https://sport.onet.pl/', 0, 'https://sport.onet.pl/')), { off: true });
    assert.deepEqual(bg.state.reloads, [7]);
    const back = await bg.send({ type: 'site:toggle', host: 'onet.pl', tabId: 7 });
    assert.equal(back.disabled, false);
    assert.equal(bg.state.dynamic.find((x) => x.id === 1), undefined);
  } finally { bg.restore(); }
});

test('YouTube Protection: wyłączenie ochrony na youtube.com → status "disabled"', async () => {
  const bg = await loadBackground({ tabUrl: 'https://www.youtube.com/watch?v=1' });
  try {
    await bg.install();
    await bg.send({ type: 'site:toggle', host: 'youtube.com', tabId: 7 });
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.components.youtube.status, 'disabled');
  } finally { bg.restore(); }
});

test('własne filtry: sieciowe → reguły dynamiczne, kosmetyczne → CSS, scriptlety → błąd z opisem', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const r = await bg.send({ type: 'options:setUserFilters', text: '! k\n||reklamy.example.com^\nexample.org##.moja\n@@||example.org^$script\nexample.org##+js(set, a, 1)' });
    assert.equal(r.ok, true);
    assert.equal(r.count, 3);
    assert.equal(r.errors.length, 1);
    assert.match(r.errors[0].reason, /scriptlety/);
    assert.ok(bg.state.dynamic.some((x) => x.id >= 1000 && x.condition.requestDomains && x.condition.requestDomains[0] === 'reklamy.example.com'));
    await bg.send({ type: 'cosmetic:init', url: 'https://example.org/' }, sender('https://example.org/'));
    assert.match(bg.state.css.at(-1).css, /\.moja\{display:none!important\}/);
  } finally { bg.restore(); }
});

test('picker: zapisuje filtr do moich filtrów i od razu wstrzykuje CSS', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const r = await bg.send({ type: 'picker:add', selector: 'div.banner-top' }, sender('https://www.example.com/a'));
    assert.deepEqual(r, { ok: true, line: 'example.com##div.banner-top' });
    assert.match(bg.store.userFilters, /example\.com##div\.banner-top/);
    assert.equal(bg.state.css.at(-1).css, 'div.banner-top{display:none!important}');
  } finally { bg.restore(); }
});

test('raport YouTube z odtwarzacza trafia do diagnostyki (bez adresu filmu)', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    await bg.send({ type: 'youtube:health', status: 'degraded', reasons: ['ładowanie trwa 20 s'], page: 'watch' }, sender('https://www.youtube.com/watch?v=SECRET'));
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.youtube.player.status, 'degraded');
    assert.equal(h.components.youtube.status, 'warning');
    assert.ok(!JSON.stringify(h).includes('SECRET'), 'adres filmu nie jest przechowywany');
  } finally { bg.restore(); }
});

test('diagnostyka wydajności jest domyślnie wyłączona i nie zbiera danych', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    await bg.send({ type: 'perf:report', url: 'https://a.test/', stats: { mutationBatches: 1 } }, sender('https://a.test/'));
    let h = await bg.send({ type: 'health:get' });
    assert.equal(h.devPerf, false);
    assert.equal(h.perf.length, 0);
    await bg.send({ type: 'options:setDevPerf', enabled: true });
    await bg.send({ type: 'perf:report', url: 'https://a.test/', stats: { mutationBatches: 3 } }, sender('https://a.test/'));
    h = await bg.send({ type: 'health:get' });
    assert.equal(h.perf[0].stats.mutationBatches, 3);
  } finally { bg.restore(); }
});

test('brak pliku danych listy → komponent cosmetic ERROR, pozostałe listy działają', async () => {
  const bg = await loadBackground({ files: { 'data/privacy.json': new Error('brak pliku') } });
  try {
    await bg.install();
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.components.cosmetic.status, 'error');
    assert.match(h.components.cosmetic.detail, /privacy/);
    assert.ok(h.errors.some((e) => e.component === 'cosmetic'));
    const r = await bg.send({ type: 'cosmetic:init', url: 'https://www.example.com/' }, sender('https://www.example.com/'));
    assert.equal(r.generic, true, 'silnik kosmetyczny działa dalej z pozostałymi listami');
  } finally { bg.restore(); }
});

test('playback health: iframe nie nadpisuje raportu ramki głównej w service workerze', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    await bg.send({ type: 'youtube:health', status: 'healthy', reasons: [], page: 'watch' }, sender('https://www.youtube.com/watch?v=A', 0));
    await bg.send({ type: 'youtube:health', status: 'error', reasons: ['x'], page: '' }, sender('https://www.youtube.com/embed/B', 4, 'https://www.youtube.com/watch?v=A'));
    const h = await bg.send({ type: 'health:get' });
    assert.equal(h.youtube.player.status, 'healthy');
    assert.equal(h.components.youtube.status, 'ok');
  } finally { bg.restore(); }
});

test('playback health: główna nawigacja i zamknięcie karty czyszczą raporty', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    const report = () => bg.send({ type: 'youtube:health', status: 'error', reasons: ['brak postępu'], page: 'watch' }, sender('https://www.youtube.com/watch?v=A'));
    await report();
    assert.equal((await bg.send({ type: 'health:get' })).youtube.player.status, 'error');
    // nawigacja w iframe NIE czyści raportu
    bg.state.listeners.committed({ tabId: 7, frameId: 3, url: 'https://ads.example/' });
    assert.equal((await bg.send({ type: 'health:get' })).youtube.player.status, 'error');
    bg.state.listeners.committed({ tabId: 7, frameId: 0, url: 'https://www.youtube.com/watch?v=C' });
    let h = await bg.send({ type: 'health:get' });
    assert.ok(!h.youtube.player, 'raport po nawigacji usunięty');
    assert.notEqual(h.components.youtube.status, 'error');
    await report();
    bg.state.listeners.tabRemoved(7);
    h = await bg.send({ type: 'health:get' });
    assert.ok(!h.youtube.player, 'raport po zamknięciu karty usunięty');
  } finally { bg.restore(); }
});

test('diagnostics:export: raport lokalny bez URL, ID filmów i danych strony', async () => {
  const bg = await loadBackground();
  try {
    await bg.install();
    await bg.send({ type: 'youtube:health', status: 'degraded', reasons: ['spinner na https://www.youtube.com/watch?v=SECRETID12'], page: 'watch' }, sender('https://www.youtube.com/watch?v=SECRETID12'));
    const r = await bg.send({ type: 'diagnostics:export' });
    assert.match(r.text, /^ChromeBlock Diagnostics/);
    assert.match(r.text, /0\.3\.4-dev/);
    assert.equal(r.data.manifestVersion, 3);
    assert.equal(r.data.player.status, 'degraded');
    assert.ok(Array.isArray(r.data.enabledLists) && r.data.enabledLists.includes('ads'));
    assert.ok(r.data.youtubeCompatibility && r.data.youtubeCompatibility.total > 0);
    const all = r.text + JSON.stringify(r.data);
    assert.ok(!all.includes('SECRETID12'), 'brak ID filmu');
    assert.ok(!/https?:\/\//.test(all), 'brak adresów URL');
    assert.ok(!all.includes('youtube.com'), 'brak nazw hostów');
  } finally { bg.restore(); }
});
