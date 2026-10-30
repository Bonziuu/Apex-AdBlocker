// Rejestracja scriptletów: mniej UTRWALANYCH wzorców (koszt w Chrome ~kwadratowy), ten sam zbiór
// adresów, na których wykonuje się każdy plik. Pomiar: tools/perf/startup-perf.mjs.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { hostPatterns, splitShardMatches } from '../../tools/build.mjs';
import { ROOT } from '../../tools/lists-config.mjs';

const DEFAULT_LISTS = ['ads', 'privacy', 'security'];
const meta = (id) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', `${id}.scriptlets.json`), 'utf8'));
const hostsOf = (file) => Object.keys(JSON.parse(/const HOSTS = (\{.*\});/.exec(fs.readFileSync(path.join(ROOT, file), 'utf8'))[1]));

/** Dopasowanie hosta do wzorca jak w Chrome (`*://*.host/*` obejmuje host i subdomeny). */
function hostMatches(pattern, host) {
  const m = /^\*:\/\/(\*\.)?([^/]+)\/\*$/.exec(pattern);
  if (!m) return false;
  return host === m[2] || (!!m[1] && host.endsWith('.' + m[2]));
}

test('splitShardMatches: rozłączne części, ten sam zbiór adresów co jedna lista wzorców', () => {
  const hosts = ['example.com', 'www.example.com', 'foo.*', 'foo.com', 'sub.bar.com', 'bar.*', 'a.b.baz.*', 'baz.com', '1.2.3.4'];
  const { matches, sessionMatches } = splitShardMatches(hosts);
  assert.ok(matches.includes('*://*.foo.com/*') && !sessionMatches.includes('*://*.foo.com/*'), 'wspólny wzorzec tylko w części utrwalanej');
  assert.ok(!matches.includes('*://*.sub.bar.com/*'), 'wzorzec pokryty przez encję obsługuje część sesyjna');
  assert.ok(!sessionMatches.includes('*://*.a.b.baz.com/*'), 'encja pokryta przez host zwykły zostaje w części utrwalanej');
  const old = hosts.flatMap(hostPatterns);
  for (const h of ['example.com', 'x.www.example.com', 'foo.net', 'foo.com', 'sub.bar.com', 'q.sub.bar.com', 'bar.io', 'a.b.baz.com', 'a.b.baz.de', '1.2.3.4', 'foo.ru', 'other.org', 'notexample.com']) {
    const before = old.some((p) => hostMatches(p, h));
    const inP = matches.some((p) => hostMatches(p, h));
    const inS = sessionMatches.some((p) => hostMatches(p, h));
    assert.equal(inP || inS, before, h);
    assert.ok(!(inP && inS), `${h}: plik nie może być wstrzyknięty dwa razy`);
  }
});

test('domyślne listy: utrwalanych wzorców < 40% dotychczasowych; razem ten sam zbiór adresów', () => {
  let persisted = 0;
  let session = 0;
  let old = 0;
  for (const id of DEFAULT_LISTS) {
    for (const f of meta(id)) {
      const hosts = hostsOf(f.file);
      const oldPatterns = [...new Set(hosts.flatMap(hostPatterns))];
      old += oldPatterns.length;
      persisted += f.matches.length;
      session += f.sessionMatches.length;
      const all = new Set([...f.matches, ...f.sessionMatches]);
      // każdy nowy wzorzec pochodzi ze starego zbioru…
      for (const p of all) assert.ok(oldPatterns.includes(p), `${f.file}: nowy wzorzec ${p}`);
      // …a każdy usunięty jest pokryty przez pozostawiony (ten sam zbiór adresów)
      for (const p of oldPatterns) {
        if (all.has(p)) continue;
        const host = /^\*:\/\/(?:\*\.)?([^/]+)\/\*$/.exec(p)[1];
        assert.ok([...all].some((q) => hostMatches(q, host)), `${f.file}: ${p} nie jest pokryty`);
      }
    }
  }
  assert.ok(old > 50000, `dotychczas ${old}`);
  assert.ok(persisted < old * 0.4, `utrwalane: ${persisted} z ${old}`);
  assert.equal(persisted + session <= old, true);
});

test('domyślne listy: części utrwalana i sesyjna są rozłączne (bez podwójnego wstrzyknięcia)', () => {
  for (const id of DEFAULT_LISTS) {
    for (const f of meta(id)) {
      const pHosts = f.matches.map((p) => /^\*:\/\/(?:\*\.)?([^/]+)\/\*$/.exec(p)[1]);
      const sIndex = new Set(f.sessionMatches.map((p) => /^\*:\/\/(?:\*\.)?([^/]+)\/\*$/.exec(p)[1]));
      for (const h of pHosts) {
        // host zwykły (i jego subdomeny) nie może pasować do żadnego wzorca sesyjnego
        const labels = h.split('.');
        for (let i = 0; i < labels.length - 1; i++) assert.ok(!sIndex.has(labels.slice(i).join('.')), `${f.file}: ${h}`);
      }
      for (const s of sIndex) {
        const labels = s.split('.');
        for (let i = 0; i < labels.length - 1; i++) assert.ok(!f.matches.includes(`*://*.${labels.slice(i).join('.')}/*`), `${f.file}: ${s}`);
      }
    }
  }
});

test('YouTube: wszystkie wzorce YouTube w części utrwalanej (ochrona od razu po starcie przeglądarki)', () => {
  const yt = ['*://*.youtube.com/*', '*://*.www.youtube.com/*', '*://*.m.youtube.com/*', '*://*.music.youtube.com/*', '*://*.youtube-nocookie.com/*'];
  const persisted = new Set(DEFAULT_LISTS.flatMap((id) => meta(id).flatMap((f) => f.matches)));
  const session = new Set(DEFAULT_LISTS.flatMap((id) => meta(id).flatMap((f) => f.sessionMatches)));
  assert.ok(persisted.has('*://*.youtube.com/*'));
  for (const p of yt) assert.ok(!session.has(p), p);
  for (const h of ['www.youtube.com', 'm.youtube.com', 'music.youtube.com']) {
    assert.ok(![...session].some((p) => hostMatches(p, h)), `${h} nie zależy od części sesyjnej`);
  }
});

test('strony niezwiązane z filtrami nie dostają żadnego pliku scriptletów', () => {
  const all = DEFAULT_LISTS.flatMap((id) => meta(id).flatMap((f) => [...f.matches, ...f.sessionMatches]));
  for (const h of ['example.org', 'www.wikipedia.org', 'en.wikipedia.org', 'docs.python.org', 'apex-unrelated-test.dev']) {
    assert.ok(!all.some((p) => hostMatches(p, h)), h);
  }
});
