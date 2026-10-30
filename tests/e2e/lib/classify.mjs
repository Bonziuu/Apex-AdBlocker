// Apex AdBlocker E2E – klasyfikacja wyników testów YouTube (czysta logika, bez przeglądarki).
// Testowana jednostkowo w tests/youtube/e2e-classify.test.mjs.
//
// Kategorie wyniku przypadku:
//   PLAYBACK_OK          – odtwarzanie działa; reklama: brak okazji (INCONCLUSIVE)
//   AD_BLOCKING_OBSERVED – odtwarzanie działa i jest DOWÓD, że reklama była przydzielona,
//                          a Apex AdBlocker ją usunął (np. surowa odpowiedź miała pola reklam,
//                          a odpowiedź widoczna dla strony już nie)
//   INCONCLUSIVE         – werdykt reklamowy: brak okazji reklamowej (nie „reklamy zablokowane”)
//   AD_VISIBLE_FAILURE   – odtwarzacz był w stanie reklamy przez ≥ progu kolejnych sekund (FAIL)
//   PLAYER_FAILURE       – brak postępu odtwarzania, trwały spinner/błąd, ostrzeżenie anti-adblock,
//                          nieudany seek lub przejście do kolejnego filmu (FAIL)

export const AD_THRESHOLD_SECONDS = 3;
export const SPINNER_THRESHOLD_SECONDS = 10;
export const OUTCOME = Object.freeze({
  PLAYBACK_OK: 'PLAYBACK_OK',
  AD_BLOCKING_OBSERVED: 'AD_BLOCKING_OBSERVED',
  INCONCLUSIVE: 'INCONCLUSIVE',
  AD_VISIBLE_FAILURE: 'AD_VISIBLE_FAILURE',
  PLAYER_FAILURE: 'PLAYER_FAILURE',
});

/** Czy próbka wskazuje stan reklamy i które sygnały to wykryły. */
export function adSignals(sample) {
  const out = [];
  if (sample.adShowing) out.push('movie_player.ad-showing');
  for (const e of sample.adElements || []) out.push(`element:${e}`);
  return out;
}

function longestRun(samples, pred) {
  let best = { length: 0, start: -1 };
  let cur = 0;
  for (let i = 0; i < samples.length; i++) {
    if (pred(samples[i])) {
      cur++;
      if (cur > best.length) best = { length: cur, start: i - cur + 1 };
    } else cur = 0;
  }
  return best;
}

/**
 * Analiza stanu reklamy w próbkach pobieranych co intervalSec sekund.
 * Krótka zmiana DOM (krótsza niż próg) NIE jest traktowana jako awaria.
 */
export function analyzeAdState(samples, { intervalSec = 1, thresholdSec = AD_THRESHOLD_SECONDS } = {}) {
  const isAd = (s) => adSignals(s).length > 0;
  const run = longestRun(samples, isAd);
  const signals = new Set();
  for (const s of samples) if (isAd(s)) for (const sig of adSignals(s)) signals.add(sig);
  const adSeconds = run.length * intervalSec;
  let lastAd = -1;
  samples.forEach((s, i) => { if (isAd(s)) lastAd = i; });
  let mainVideoStartedAfter = null;
  if (lastAd >= 0) {
    const after = samples.slice(lastAd + 1).filter((s) => !isAd(s));
    mainVideoStartedAfter = progressOf(after) >= 1;
  }
  return {
    anyAd: lastAd >= 0,
    adSeconds,
    persistent: adSeconds >= thresholdSec,
    signals: [...signals].sort(),
    mainVideoStartedAfter,
  };
}

/** Łączy oddzielne okna (np. seek), nie skleja czasu reklamy ponad przerwą pomiaru. */
export function mergeAdStates(states) {
  return {
    anyAd: states.some((s) => s.anyAd),
    adSeconds: Math.max(0, ...states.map((s) => s.adSeconds)),
    persistent: states.some((s) => s.persistent),
    signals: [...new Set(states.flatMap((s) => s.signals))].sort(),
    mainVideoStartedAfter: states.findLast((s) => s.anyAd)?.mainVideoStartedAfter ?? null,
  };
}

/** Suma przyrostów currentTime między kolejnymi próbkami (bez skoków > maxStep, np. seek). */
export function progressOf(samples, { maxStep = 5 } = {}) {
  let total = 0;
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1].currentTime;
    const b = samples[i].currentTime;
    if (typeof a !== 'number' || typeof b !== 'number') continue;
    const d = b - a;
    if (d > 0 && d <= maxStep) total += d;
  }
  return Math.round(total * 10) / 10;
}

/**
 * Analiza odtwarzania głównego filmu (próbki w stanie reklamy są pomijane).
 * Wymaga: element video, readyState ≥ 2, przyrost currentTime ≥ minProgress,
 * brak trwałego spinnera, brak trwałego błędu, brak ostrzeżenia anti-adblock.
 */
export function analyzePlayback(samples, { minProgress = 3, intervalSec = 1, spinnerSec = SPINNER_THRESHOLD_SECONDS } = {}) {
  const main = samples.filter((s) => adSignals(s).length === 0);
  const reasons = [];
  const hasVideo = samples.some((s) => s.hasVideo);
  const readyOk = main.some((s) => s.readyState >= 2);
  const progress = progressOf(main);
  const spinnerRun = longestRun(samples, (s) => s.spinner).length * intervalSec;
  const tail = samples.slice(-3);
  const permanentError = tail.length > 0 && tail.every((s) => s.error);
  const antiAdblock = samples.some((s) => s.antiAdblock);
  if (!hasVideo) reasons.push('brak elementu video');
  if (!readyOk) reasons.push('readyState nie osiągnął HAVE_CURRENT_DATA');
  if (progress < minProgress) reasons.push(`postęp odtwarzania ${progress} s < ${minProgress} s`);
  if (spinnerRun >= spinnerSec) reasons.push(`spinner przez ${spinnerRun} s`);
  if (permanentError) reasons.push('trwały błąd odtwarzacza');
  if (antiAdblock) reasons.push('ostrzeżenie anti-adblock YouTube');
  return { ok: reasons.length === 0, progress, readyOk, hasVideo, spinnerSeconds: spinnerRun, permanentError, antiAdblock, reasons };
}

/** Czy obiekt odpowiedzi odtwarzacza zawiera NIEPUSTE dane reklam (yes/no/unknown). */
export function adFieldsInPlayerResponse(summary) {
  if (!summary || typeof summary !== 'object') return 'unknown';
  const counts = [summary.adPlacements, summary.adSlots, summary.playerAds].filter((n) => typeof n === 'number');
  if (!counts.length) return 'unknown';
  return counts.some((n) => n > 0) ? 'yes' : 'no';
}

/** Czy surowa treść odpowiedzi (sieć, przed scriptletami strony) zawiera dane reklam. */
export function adFieldsInRawText(text) {
  if (typeof text !== 'string') return 'unknown';
  return /"(adPlacements|adSlots|playerAds)"\s*:\s*\[\s*\{/.test(text) ? 'yes' : 'no';
}

/** Łączy wyniki kilku obserwacji yes/no/unknown: yes > no > unknown. */
export function mergeTriState(values) {
  if (values.includes('yes')) return 'yes';
  if (values.includes('no')) return 'no';
  return 'unknown';
}

/**
 * Werdykt reklamowy.
 * metadata.raw    – surowe odpowiedzi sieciowe zawierały dane reklam (yes/no/unknown)
 * metadata.visible– odpowiedź odtwarzacza widoczna dla strony zawiera dane reklam (yes/no/unknown)
 */
export function classifyAds(adState, metadata = {}) {
  const raw = metadata.raw || 'unknown';
  const visible = metadata.visible || 'unknown';
  const notes = [];
  if (visible === 'yes') notes.push('UWAGA: odpowiedź odtwarzacza po ochronie nadal zawiera dane reklam');
  if (adState.persistent) {
    return { verdict: OUTCOME.AD_VISIBLE_FAILURE, evidence: adState.signals, notes: [...notes, `stan reklamy przez ${adState.adSeconds} s`] };
  }
  if (adState.anyAd) notes.push(`krótki stan reklamy (${adState.adSeconds} s) – poniżej progu ${AD_THRESHOLD_SECONDS} s`);
  if (raw === 'yes' && visible === 'no' && !adState.anyAd) {
    return { verdict: OUTCOME.AD_BLOCKING_OBSERVED, evidence: ['surowa odpowiedź zawierała adPlacements/adSlots/playerAds, odpowiedź widoczna dla strony – nie'], notes };
  }
  return { verdict: OUTCOME.INCONCLUSIVE, evidence: [], notes: [...notes, 'INCONCLUSIVE — no ad opportunity observed'] };
}

/**
 * Wynik całego przypadku.
 * @param {{playback, ads, seek?, next?, midroll?}} r
 * @returns {{outcome:string, failed:boolean, playback:'PASS'|'FAIL', adVerdict:string, reasons:string[]}}
 */
export function classifyCase({ playback, ads, seek = null, next = null, midroll = null }) {
  const reasons = [];
  if (!playback.ok) reasons.push(...playback.reasons);
  if (seek && !seek.ok) reasons.push(`seek: ${seek.reasons.join(', ')}`);
  if (next && !next.ok) reasons.push(`następny film: ${next.reasons.join(', ')}`);
  if (midroll && !midroll.ok) reasons.push(`dłuższe odtwarzanie: ${midroll.reasons.join(', ')}`);
  const playbackOk = reasons.length === 0;
  let outcome;
  if (ads.verdict === OUTCOME.AD_VISIBLE_FAILURE) outcome = OUTCOME.AD_VISIBLE_FAILURE;
  else if (!playbackOk) outcome = OUTCOME.PLAYER_FAILURE;
  else if (ads.verdict === OUTCOME.AD_BLOCKING_OBSERVED) outcome = OUTCOME.AD_BLOCKING_OBSERVED;
  else outcome = OUTCOME.PLAYBACK_OK;
  return {
    outcome,
    failed: outcome === OUTCOME.AD_VISIBLE_FAILURE || outcome === OUTCOME.PLAYER_FAILURE,
    playback: playbackOk ? 'PASS' : 'FAIL',
    adVerdict: ads.verdict,
    reasons: [...reasons, ...ads.notes],
  };
}

/** Podsumowanie wielu przypadków (do raportu końcowego). */
export function summarize(results) {
  const s = { total: results.length, PASS: 0, FAIL: 0, SKIP: 0, INCONCLUSIVE: 0, AD_BLOCKING_OBSERVED: 0, adSeen: false, antiAdblockSeen: false };
  for (const r of results) {
    if (r.skipped) { s.SKIP++; continue; }
    if (r.failed) s.FAIL++; else s.PASS++;
    if (r.adVerdict === OUTCOME.INCONCLUSIVE) s.INCONCLUSIVE++;
    if (r.adVerdict === OUTCOME.AD_BLOCKING_OBSERVED) s.AD_BLOCKING_OBSERVED++;
    if (r.adState && r.adState.anyAd) s.adSeen = true;
    if (r.playbackDetail && r.playbackDetail.antiAdblock) s.antiAdblockSeen = true;
  }
  return s;
}
