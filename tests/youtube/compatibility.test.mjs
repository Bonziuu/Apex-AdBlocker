// Zgodność AKTUALNYCH filtrów YouTube z tools/lists/ (uBlock filters itd.).
// Ten test ma zadziałać jak alarm po `node tools/update-lists.mjs`: jeśli
// listy dodadzą scriptlet lub wariant parametrów, którego Apex AdBlocker nie
// obsługuje, test zakończy się błędem z czytelnym opisem.

import test from 'node:test';
import assert from 'node:assert/strict';
import { runAudit, readBaseline } from '../../tools/audit-scriptlets.mjs';
import { youtubeHostsAffected, compareWithBaseline, YOUTUBE_CRITICAL_HOSTS } from '../../youtube/compatibility.js';

const audit = runAudit();
const yt = audit.youtube;

test('listy zawierają krytyczne filtry YouTube (sanity check)', () => {
  assert.ok(yt.critical.length >= 10, `znaleziono ${yt.critical.length} krytycznych filtrów YouTube`);
});

test('każdy krytyczny filtr YouTube jest obsługiwany albo jawnie wpisany jako znany brak', () => {
  if (yt.newGaps.length) {
    const details = yt.newGaps.map((g) => `  - [${g.status}] ${g.name}: ${g.reason}\n    ${g.line.slice(0, 200)}`).join('\n');
    assert.fail(`YouTube filters changed. New unsupported scriptlet detected.\n${details}\n`
      + 'Zaimplementuj semantykę albo – po świadomej decyzji – uruchom: node tools/audit-scriptlets.mjs --update-youtube-baseline');
  }
});

test('baza znanych braków nie zawiera nieaktualnych wpisów', () => {
  assert.deepEqual(yt.resolved, [], 'usuń z youtube/known-gaps.json wpisy, które są już obsługiwane lub zniknęły z list');
});

test('raport zgodności YouTube: supported + partial + unsupported = total', () => {
  const s = yt.summary;
  assert.equal(s.supported + s.partial + s.unsupported, s.total);
});

test('wykrywanie nowych braków: nieobsługiwany wariant spoza bazy jest zgłaszany', () => {
  const critical = [
    { line: 'www.youtube.com##+js(json-prune, a)', status: 'supported' },
    { line: 'www.youtube.com##+js(new-scriptlet, x)', status: 'unsupported' },
    { line: 'www.youtube.com##+js(rpnt, script, a, b, newOption, 1)', status: 'partial' },
  ];
  const r = compareWithBaseline(critical, { gaps: [{ filter: 'www.youtube.com##+js(rpnt, script, a, b, newOption, 1)' }] });
  assert.deepEqual(r.newGaps.map((g) => g.line), ['www.youtube.com##+js(new-scriptlet, x)']);
  assert.equal(r.knownGaps.length, 1);
});

test('które hosty są krytyczne', () => {
  assert.deepEqual(YOUTUBE_CRITICAL_HOSTS, ['youtube.com', 'www.youtube.com', 'music.youtube.com', 'm.youtube.com', 'youtube-nocookie.com']);
  assert.deepEqual(youtubeHostsAffected(['youtube.com'], []), ['youtube.com', 'www.youtube.com', 'music.youtube.com', 'm.youtube.com']);
  assert.deepEqual(youtubeHostsAffected(['youtube.*'], ['m.youtube.com']), ['youtube.com', 'www.youtube.com', 'music.youtube.com']);
  assert.deepEqual(youtubeHostsAffected(['tv.youtube.com'], []), []);
  assert.deepEqual(youtubeHostsAffected(['example.com'], []), []);
});

test('baza znanych braków ma poprawny format', () => {
  const b = readBaseline();
  assert.ok(Array.isArray(b.gaps));
  for (const g of b.gaps) assert.equal(typeof g.filter, 'string');
});
