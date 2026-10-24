// Testy wygenerowanych reguł declarativeNetRequest (rules/*.json) – żeby Chrome
// przyjął zestawy reguł i żeby rozszerzenie nadal ładowało się jako MV3.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../../tools/lists-config.mjs';
import { validateRule, PRIORITY } from '../../shared/parser.js';

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
const TYPES = new Set(['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'webtransport', 'webbundle', 'other']);
const COND_KEYS = new Set(['urlFilter', 'regexFilter', 'isUrlFilterCaseSensitive', 'initiatorDomains', 'excludedInitiatorDomains',
  'requestDomains', 'excludedRequestDomains', 'resourceTypes', 'excludedResourceTypes', 'requestMethods', 'excludedRequestMethods', 'domainType']);

test('manifest: MV3, wersja developerska 0.3.1, wymagane pliki istnieją', () => {
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.version, '0.3.1');
  assert.equal(manifest.version_name, '0.3.1-dev');
  assert.equal(manifest.name, 'ChromeBlock');
  const files = [manifest.background.service_worker, manifest.action.default_popup, manifest.options_page,
    ...manifest.content_scripts.flatMap((c) => c.js), ...Object.values(manifest.icons)];
  for (const f of files) assert.ok(fs.existsSync(path.join(ROOT, f)), f);
});

test('manifest: brak zdalnego kodu i telemetrii (tylko lokalne zasoby)', () => {
  assert.ok(!manifest.content_security_policy, 'domyślna polityka CSP MV3 (bez zdalnych skryptów)');
  const sources = ['background.js', 'background/health.js', 'content/cosmetic.js', 'youtube/health.js', 'popup/popup.js', 'options/options.js'];
  for (const f of sources) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.ok(!/https?:\/\/(?!www\.youtube\.com|support\.google)[a-z0-9.-]+\//i.test(src.replace(/\/\/.*$/gm, '')), `${f}: brak adresów zewnętrznych`);
    assert.ok(!/\beval\(|new Function\(/.test(src), `${f}: brak eval`);
  }
});

for (const rr of manifest.declarative_net_request.rule_resources) {
  test(`zestaw reguł "${rr.id}": poprawne reguły DNR`, () => {
    const rules = JSON.parse(fs.readFileSync(path.join(ROOT, rr.path), 'utf8'));
    const ids = new Set();
    let regex = 0;
    for (const r of rules) {
      assert.ok(Number.isInteger(r.id) && r.id > 0 && !ids.has(r.id), `id ${r.id}`);
      ids.add(r.id);
      assert.ok(validateRule(r), JSON.stringify(r).slice(0, 200));
      for (const k of Object.keys(r.condition)) assert.ok(COND_KEYS.has(k), k);
      for (const t of [...(r.condition.resourceTypes || []), ...(r.condition.excludedResourceTypes || [])]) assert.ok(TYPES.has(t), t);
      if (r.condition.regexFilter) { regex++; new RegExp(r.condition.regexFilter); }
      if (r.action.type === 'redirect' && r.action.redirect.extensionPath) {
        assert.ok(fs.existsSync(path.join(ROOT, r.action.redirect.extensionPath)), r.action.redirect.extensionPath);
      }
      assert.ok(r.condition.urlFilter || r.condition.regexFilter || r.condition.requestDomains || r.condition.initiatorDomains, 'reguła nie może dotyczyć wszystkiego');
    }
    assert.ok(regex <= 1000, `regex: ${regex}`);
  });
}

test('suma reguł domyślnie włączonych list mieści się w gwarantowanym limicie Chrome (30 000)', () => {
  let total = 0;
  for (const rr of manifest.declarative_net_request.rule_resources) {
    total += JSON.parse(fs.readFileSync(path.join(ROOT, rr.path), 'utf8')).length;
  }
  assert.ok(total <= 30000, `wszystkie listy: ${total}`);
});

test('kolejność priorytetów: block < redirect < allow < important < własne < wyłączenie strony', () => {
  assert.ok(PRIORITY.block < PRIORITY.redirect);
  assert.ok(PRIORITY.redirect < PRIORITY.allow);
  assert.ok(PRIORITY.allow < PRIORITY.importantBlock);
  assert.ok(PRIORITY.importantRedirect < PRIORITY.user);
  assert.ok(PRIORITY.userAllow < PRIORITY.siteDisabled);
});

test('$badfilter między listami wskazuje istniejące reguły docelowe', () => {
  const cross = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/badfilter-cross.json'), 'utf8'));
  for (const { target, ruleIds } of cross) {
    const rules = JSON.parse(fs.readFileSync(path.join(ROOT, 'rules', `${target}.json`), 'utf8'));
    const ids = new Set(rules.map((r) => r.id));
    for (const id of ruleIds) assert.ok(ids.has(id), `${target}#${id}`);
  }
});

test('pliki scriptletów zawierają wyłącznie obsługiwane wywołania', async () => {
  const { SCRIPTLET_SPECS } = await import('../../shared/scriptlet-specs.js');
  for (const f of fs.readdirSync(path.join(ROOT, 'scriptlets'))) {
    const js = fs.readFileSync(path.join(ROOT, 'scriptlets', f), 'utf8');
    const calls = JSON.parse(/const CALLS = (.*);\n/.exec(js)[1]);
    for (const c of calls) {
      const spec = SCRIPTLET_SPECS[c[0]];
      assert.ok(spec && spec.implemented !== false, `${f}: ${c[0]}`);
      assert.equal(spec.validate(c.slice(1)), null, `${f}: ${JSON.stringify(c).slice(0, 160)}`);
    }
  }
});
