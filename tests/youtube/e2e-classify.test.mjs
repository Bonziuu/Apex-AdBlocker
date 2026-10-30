// Klasyfikacja wyników E2E YouTube (tests/e2e/lib/classify.mjs) – bez przeglądarki.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  adSignals, analyzeAdState, mergeAdStates, progressOf, analyzePlayback, adFieldsInPlayerResponse,
  adFieldsInRawText, mergeTriState, classifyAds, classifyCase, summarize, OUTCOME, AD_THRESHOLD_SECONDS,
} from '../e2e/lib/classify.mjs';

/** Próbka odtwarzania (co 1 s). */
const play = (t, extra = {}) => ({ hasVideo: true, readyState: 4, currentTime: t, adShowing: false, adElements: [], spinner: false, error: false, antiAdblock: false, ...extra });
const ad = (t = 0, extra = {}) => play(t, { adShowing: true, ...extra });
const seq = (n, start = 0) => Array.from({ length: n }, (_, i) => play(start + i));

test('adSignals: klasa ad-showing i widoczne elementy reklamy', () => {
  assert.deepEqual(adSignals(play(0)), []);
  assert.deepEqual(adSignals(ad(0, { adElements: ['ad-badge'] })), ['movie_player.ad-showing', 'element:ad-badge']);
});

test('stan reklamy przez ≥ 3 kolejne sekundy ⇒ AD_VISIBLE_FAILURE z sekundami, sygnałem i startem filmu', () => {
  assert.equal(AD_THRESHOLD_SECONDS, 3);
  const samples = [ad(0), ad(1), ad(2), ad(3, { adElements: ['ad-skip-ui'] }), ...seq(6, 0)];
  const st = analyzeAdState(samples);
  assert.equal(st.adSeconds, 4);
  assert.equal(st.persistent, true);
  assert.deepEqual(st.signals, ['element:ad-skip-ui', 'movie_player.ad-showing']);
  assert.equal(st.mainVideoStartedAfter, true);
  const ads = classifyAds(st, { raw: 'yes', visible: 'no' });
  assert.equal(ads.verdict, OUTCOME.AD_VISIBLE_FAILURE);
  const c = classifyCase({ playback: analyzePlayback(samples), ads });
  assert.equal(c.outcome, OUTCOME.AD_VISIBLE_FAILURE);
  assert.equal(c.failed, true);
});

test('reklama bez startu filmu głównego: mainVideoStartedAfter = false', () => {
  const st = analyzeAdState([play(0), ad(0), ad(0), ad(0), play(0), play(0)]);
  assert.equal(st.persistent, true);
  assert.equal(st.mainVideoStartedAfter, false);
});

test('krótka zmiana DOM (< 3 s) nie jest awarią', () => {
  const samples = [...seq(4), ad(4), ad(4), ...seq(6, 4)];
  const st = analyzeAdState(samples);
  assert.equal(st.adSeconds, 2);
  assert.equal(st.persistent, false);
  const ads = classifyAds(st, {});
  assert.equal(ads.verdict, OUTCOME.INCONCLUSIVE);
  assert.ok(ads.notes.some((n) => /krótki stan reklamy/.test(n)));
  assert.equal(classifyCase({ playback: analyzePlayback(samples), ads }).failed, false);
});

test('reklama po seek lub po zmianie filmu nadal powoduje AD_VISIBLE_FAILURE', () => {
  const initial = analyzeAdState(seq(20));
  const afterSeek = analyzeAdState([ad(0), ad(1), ad(2), ...seq(5)]);
  const merged = mergeAdStates([initial, afterSeek]);
  assert.equal(merged.persistent, true);
  assert.equal(merged.adSeconds, 3);
  assert.equal(classifyCase({ playback: analyzePlayback(seq(20)), ads: classifyAds(merged) }).outcome, OUTCOME.AD_VISIBLE_FAILURE);
});

test('oddzielne krótkie reklamy nie sumują się przez przerwę seek; dowód reklamy nie ginie', () => {
  const merged = mergeAdStates([
    analyzeAdState([ad(0), ad(1), ...seq(4)]),
    analyzeAdState([play(20), ad(0), ad(1), ...seq(4)]),
  ]);
  assert.equal(merged.anyAd, true);
  assert.equal(merged.persistent, false);
  assert.equal(merged.adSeconds, 2);
  assert.equal(classifyAds(merged, { raw: 'yes', visible: 'no' }).verdict, OUTCOME.INCONCLUSIVE);
});

test('ciągłe dłuższe próbkowanie wykrywa reklamę na granicy początkowego i mid-roll okna', () => {
  const initial = [...seq(19), ad(0)];
  const extended = [ad(1), ad(2), ...seq(20)];
  assert.equal(analyzeAdState(initial).persistent, false);
  assert.equal(analyzeAdState(extended).persistent, false);
  assert.equal(analyzeAdState(initial.concat(extended)).persistent, true);
  const goodStart = analyzePlayback(seq(20));
  const stalled = analyzePlayback(Array.from({ length: 20 }, () => play(20)));
  const verdict = classifyCase({ playback: goodStart, ads: classifyAds(analyzeAdState(seq(20))), midroll: stalled });
  assert.equal(verdict.outcome, OUTCOME.PLAYER_FAILURE, 'dobry początek nie ukrywa awarii w dłuższym oknie');
});

test('brak reklamy i brak dowodu ⇒ INCONCLUSIVE — no ad opportunity observed (nie „zablokowano”)', () => {
  const samples = seq(10);
  const ads = classifyAds(analyzeAdState(samples), { raw: 'no', visible: 'no' });
  assert.equal(ads.verdict, OUTCOME.INCONCLUSIVE);
  assert.ok(ads.notes.includes('INCONCLUSIVE — no ad opportunity observed'));
  const c = classifyCase({ playback: analyzePlayback(samples), ads });
  assert.equal(c.outcome, OUTCOME.PLAYBACK_OK);
  assert.equal(c.adVerdict, OUTCOME.INCONCLUSIVE);
  assert.equal(classifyAds(analyzeAdState(samples), {}).verdict, OUTCOME.INCONCLUSIVE, 'nieznane metadane też INCONCLUSIVE');
});

test('surowa odpowiedź z reklamami, widoczna bez reklam, brak stanu reklamy ⇒ AD_BLOCKING_OBSERVED', () => {
  const samples = seq(10);
  const ads = classifyAds(analyzeAdState(samples), { raw: 'yes', visible: 'no' });
  assert.equal(ads.verdict, OUTCOME.AD_BLOCKING_OBSERVED);
  assert.equal(classifyCase({ playback: analyzePlayback(samples), ads }).outcome, OUTCOME.AD_BLOCKING_OBSERVED);
});

test('dane reklam pozostały w odpowiedzi widocznej dla strony ⇒ ostrzeżenie, nie AD_BLOCKING_OBSERVED', () => {
  const ads = classifyAds(analyzeAdState(seq(5)), { raw: 'yes', visible: 'yes' });
  assert.equal(ads.verdict, OUTCOME.INCONCLUSIVE);
  assert.ok(ads.notes.some((n) => /nadal zawiera dane reklam/.test(n)));
});

test('progressOf: ignoruje skoki (seek) i cofnięcia', () => {
  assert.equal(progressOf([play(0), play(1), play(30), play(31), play(10), play(11)]), 3);
  assert.equal(progressOf([play(0), { currentTime: null }, play(2)]), 0);
});

test('analyzePlayback: prawdziwe odtwarzanie ⇒ ok', () => {
  const r = analyzePlayback(seq(8));
  assert.equal(r.ok, true);
  assert.equal(r.progress, 7);
});

test('PLAYER_FAILURE: brak video, brak postępu, spinner, trwały błąd, anti-adblock', () => {
  const cases = [
    [seq(8).map((s) => ({ ...s, hasVideo: false })), /brak elementu video/],
    [seq(8).map((s) => ({ ...s, currentTime: 5 })), /postęp odtwarzania 0 s/],
    [seq(8).map((s) => ({ ...s, readyState: 1 })), /readyState/],
    [Array.from({ length: 12 }, () => play(0, { spinner: true })), /spinner przez 12 s/],
    [[...seq(5), play(5, { error: true }), play(5, { error: true }), play(5, { error: true })], /trwały błąd/],
    [seq(8).map((s, i) => ({ ...s, antiAdblock: i === 4 })), /anti-adblock/],
  ];
  for (const [samples, re] of cases) {
    const playback = analyzePlayback(samples);
    assert.equal(playback.ok, false);
    assert.ok(playback.reasons.some((r) => re.test(r)), `${re} w ${playback.reasons}`);
    const c = classifyCase({ playback, ads: classifyAds(analyzeAdState(samples), {}) });
    assert.equal(c.outcome, OUTCOME.PLAYER_FAILURE);
    assert.equal(c.playback, 'FAIL');
    assert.equal(c.failed, true);
  }
});

test('analyzePlayback: próbki reklamy nie liczą się do postępu filmu głównego', () => {
  const r = analyzePlayback([ad(0), ad(1), ad(2), ad(3), ad(4), play(0), play(1)]);
  assert.equal(r.progress, 1);
  assert.equal(r.ok, false);
});

test('nieudany seek lub następny film ⇒ PLAYER_FAILURE', () => {
  const playback = analyzePlayback(seq(8));
  const ads = classifyAds(analyzeAdState(seq(8)), {});
  assert.equal(classifyCase({ playback, ads, seek: { ok: false, reasons: ['czas nie rośnie po seek'] } }).outcome, OUTCOME.PLAYER_FAILURE);
  const n = classifyCase({ playback, ads, next: { ok: false, reasons: ['API nextVideo() niedostępne'] } });
  assert.equal(n.outcome, OUTCOME.PLAYER_FAILURE);
  assert.ok(n.reasons.some((r) => /następny film/.test(r)));
  assert.equal(classifyCase({ playback, ads, seek: { ok: true, reasons: [] }, next: { ok: true, reasons: [] } }).outcome, OUTCOME.PLAYBACK_OK);
});

test('AD_VISIBLE_FAILURE ma pierwszeństwo przed PLAYER_FAILURE', () => {
  const samples = [ad(0), ad(0), ad(0), ad(0), ad(0)];
  const c = classifyCase({ playback: analyzePlayback(samples), ads: classifyAds(analyzeAdState(samples), {}) });
  assert.equal(c.outcome, OUTCOME.AD_VISIBLE_FAILURE);
});

test('metadane reklam: yes/no/unknown', () => {
  assert.equal(adFieldsInPlayerResponse(null), 'unknown');
  assert.equal(adFieldsInPlayerResponse({}), 'unknown');
  assert.equal(adFieldsInPlayerResponse({ adPlacements: 0, adSlots: 0, playerAds: 0 }), 'no');
  assert.equal(adFieldsInPlayerResponse({ adPlacements: 2, adSlots: 0, playerAds: 0 }), 'yes');
  assert.equal(adFieldsInRawText('{"adPlacements":[{"adPlacementRenderer":{}}]}'), 'yes');
  assert.equal(adFieldsInRawText('{"adPlacements":[]}'), 'no');
  assert.equal(adFieldsInRawText(undefined), 'unknown');
  assert.equal(mergeTriState(['no', 'yes']), 'yes');
  assert.equal(mergeTriState(['unknown', 'no']), 'no');
  assert.equal(mergeTriState([]), 'unknown');
});

test('summarize: liczniki PASS/FAIL/SKIP/INCONCLUSIVE i flagi reklamy/anti-adblock', () => {
  const s = summarize([
    { failed: false, adVerdict: OUTCOME.INCONCLUSIVE, adState: { anyAd: false } },
    { failed: false, adVerdict: OUTCOME.AD_BLOCKING_OBSERVED, adState: { anyAd: true } },
    { failed: true, adVerdict: OUTCOME.INCONCLUSIVE, playbackDetail: { antiAdblock: true } },
    { skipped: 'SKIP — no stable Shorts URL configured' },
  ]);
  assert.deepEqual(s, { total: 4, PASS: 2, FAIL: 1, SKIP: 1, INCONCLUSIVE: 2, AD_BLOCKING_OBSERVED: 1, adSeen: true, antiAdblockSeen: true });
});
