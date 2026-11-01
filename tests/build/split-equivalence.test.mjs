// Skuteczność po wydzieleniu Polskich Filtrów: ten sam efekt co wspólna lista z v1.0.0.
// Build porównuje bieżące listy `ads` + `pl` z jedną listą złożoną z tych samych źródeł (konfiguracja v1.0.0)
// na poziomie znaczenia, nie tekstu plików:
//  - DNR: każdy warunek reguły (requestDomains rozbite na pojedyncze domeny) ze wspólnej listy jest w ads ∪ pl;
//    nadmiarowe są tylko duplikaty (filtr obecny w obu upstreamach) i reguły pl wyłączane przez $badfilter z ads,
//  - kosmetyka: te same wpisy (selektory per host, ogólne, wyjątki, style, procedury, wyjątki stron),
//  - scriptlety: te same pary host × wywołanie oraz te same wyjątki (własne + z pliku ads-x-pl).

import test from 'node:test';
import assert from 'node:assert/strict';
import { LISTS } from '../../tools/lists-config.mjs';
import { buildAll, crossScriptletExceptions } from '../../tools/build.mjs';

const byId = Object.fromEntries(LISTS.map((l) => [l.id, l]));
const merged = { ...byId.ads, id: 'ads', sources: [...byId.ads.sources, ...byId.pl.sources] }; // v1.0.0
const ms = (arr) => { const m = new Map(); for (const x of arr) m.set(x, (m.get(x) || 0) + 1); return m; };
const atoms = (rules) => rules.flatMap(({ id, ...r }) => (r.condition.requestDomains
  ? r.condition.requestDomains.map((d) => JSON.stringify({ ...r, condition: { ...r.condition, requestDomains: [d] } }))
  : [JSON.stringify(r)]));

function cosmeticEntries(d, enabled) {
  const s = new Set();
  for (const [h, ix] of Object.entries(d.spec)) for (const i of ix) s.add(`spec ${h} ${d.sel[i]}`);
  for (const ix of Object.values(d.gen)) for (const i of ix) s.add(`gen ${d.sel[i]}`);
  for (const i of d.genC) s.add(`genC ${d.sel[i]}`);
  for (const [h, v] of Object.entries(d.unhide)) for (const x of v) s.add(`unhide ${h} ${x}`);
  for (const k of ['style', 'proc', 'scopedStyle', 'scopedProc', 'scopedHide', 'scopedGen']) {
    for (const [h, v] of Object.entries(d[k])) for (const x of v) s.add(`${k} ${h} ${JSON.stringify(x)}`);
  }
  for (const k of ['ghide', 'ehide', 'docAllow', 'gunhide']) for (const x of d[k]) s.add(`${k} ${x}`);
  // wyjątki stron wyłączane przez $badfilter włączonej listy źródłowej nie działają
  for (const e of d.crossHide || []) if (!e.sources.some((x) => enabled.includes(x))) for (const k of ['ghide', 'ehide', 'docAllow']) for (const x of e[k]) s.add(`${k} ${x}`);
  return s;
}
const scriptletPairs = (r) => new Set(Object.entries(r.scriptHosts).flatMap(([h, ix]) => ix.map((i) => `${h} ${r.calls[i].join(',')}`)));
const exceptionPairs = (except) => new Set(Object.entries(except).flatMap(([h, keys]) => keys.map((k) => `${h} ${k}`)));

test('ads + pl działa jak wspólna lista v1.0.0 (DNR, kosmetyka, scriptlety)', { timeout: 600_000 }, () => {
  const before = buildAll({ lists: [merged], write: false }).results.ads;
  const { results, badfilterCross } = buildAll({ lists: [byId.ads, byId.pl], write: false });
  const { ads, pl } = results;

  // DNR
  const disabled = new Set(badfilterCross.filter((b) => b.target === 'pl' && b.source === 'ads').flatMap((b) => b.ruleIds));
  const old = ms(atoms(before.rules));
  const now = ms(atoms([...ads.rules, ...pl.rules.filter((r) => !disabled.has(r.id))]));
  const missing = [...old].filter(([k, n]) => (now.get(k) || 0) < n).map(([k]) => k);
  assert.deepEqual(missing, [], 'warunki DNR z v1.0.0 nieobecne po rozdzieleniu');
  const extra = [...now].filter(([k, n]) => n > (old.get(k) || 0));
  assert.ok(extra.every(([k]) => old.has(k)), 'nadmiarowe są wyłącznie duplikaty istniejących warunków');
  assert.ok(disabled.size > 0 && disabled.size < 20, `reguły pl wyłączane przez $badfilter z ads: ${disabled.size}`);

  // kosmetyka
  const enabled = ['ads', 'pl'];
  const cosOld = cosmeticEntries(before.cosmetic, ['ads']);
  const cosNow = new Set([...cosmeticEntries(ads.cosmetic, enabled), ...cosmeticEntries(pl.cosmetic, enabled)]);
  assert.deepEqual([...cosOld].filter((x) => !cosNow.has(x)), [], 'kosmetyka: brakujące wpisy');
  assert.deepEqual([...cosNow].filter((x) => !cosOld.has(x)), [], 'kosmetyka: nowe wpisy');

  // scriptlety
  const slOld = scriptletPairs(before);
  const slNow = new Set([...scriptletPairs(ads), ...scriptletPairs(pl)]);
  assert.deepEqual([...slOld].filter((x) => !slNow.has(x)), [], 'scriptlety: brakujące');
  assert.deepEqual([...slNow].filter((x) => !slOld.has(x)), [], 'scriptlety: nowe');
  // wyjątki #@#+js: wspólna lista miała je w jednym miejscu; teraz własne + przeniesione do pl z ads-x-pl
  const exOld = exceptionPairs(before.scriptExcept);
  const exNow = new Set([...exceptionPairs(ads.scriptExcept), ...exceptionPairs(pl.scriptExcept)]);
  assert.deepEqual([...exOld].filter((x) => !exNow.has(x)), [], 'wyjątki scriptletów: brakujące');
  const cross = exceptionPairs(crossScriptletExceptions(ads, pl));
  assert.ok(cross.size >= 10, `wyjątki ads dla scriptletów pl: ${cross.size}`);
  for (const x of cross) assert.ok(exOld.has(x), x);
});
