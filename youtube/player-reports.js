// Apex AdBlocker – magazyn raportów YouTube Playback Health (service worker).
//
// Model: tabId → frameId → raport. Raport z ramki (iframe) NIE nadpisuje
// raportu głównego dokumentu. Zasady agregacji dla karty:
//   1. Świeży raport ramki głównej (frameId 0, top) ma pierwszeństwo.
//   2. Raport iframe nigdy nie zastępuje statusu ramki głównej.
//   3. Gdy brak raportu ramki głównej (np. YouTube osadzony na innej stronie),
//      używany jest raport właściwego iframe z odtwarzaczem.
//   4. Raporty starsze niż TTL są ignorowane i usuwane.
//   5. Zamknięcie karty i główna nawigacja usuwają raporty karty.
// Wszystko w pamięci; żadnych adresów URL ani identyfikatorów filmów.

export const PLAYER_REPORT_TTL_MS = 60_000;
const STATUSES = ['healthy', 'degraded', 'error', 'unknown'];
// kolejność ważności przy wyborze spośród kilku iframe
const SEVERITY = { error: 3, degraded: 2, healthy: 1, unknown: 0 };

export class PlayerReportStore {
  constructor({ ttlMs = PLAYER_REPORT_TTL_MS, now = () => Date.now() } = {}) {
    this.ttlMs = ttlMs;
    this.now = now;
    this.tabs = new Map(); // tabId → Map(frameId → report)
  }

  /** Zapisuje raport (z oczyszczeniem pól). Zwraca zapisany raport. */
  set(tabId, frameId, input) {
    const report = {
      tabId,
      frameId,
      frame: frameId === 0 ? 'top' : 'frame',
      page: typeof input.page === 'string' ? input.page.slice(0, 16) : '',
      status: STATUSES.includes(input.status) ? input.status : 'unknown',
      reasons: Array.isArray(input.reasons) ? input.reasons.slice(0, 5).map((r) => String(r).slice(0, 120)) : [],
      at: this.now(),
    };
    let frames = this.tabs.get(tabId);
    if (!frames) { frames = new Map(); this.tabs.set(tabId, frames); }
    frames.set(frameId, report);
    return report;
  }

  clearTab(tabId) { this.tabs.delete(tabId); }

  /** Główna nawigacja karty: poprzednie raporty są nieaktualne. */
  onMainFrameNavigation(tabId) { this.tabs.delete(tabId); }

  /** Usuwa przeterminowane raporty. */
  prune() {
    const limit = this.now() - this.ttlMs;
    for (const [tabId, frames] of this.tabs) {
      for (const [frameId, r] of frames) if (r.at < limit) frames.delete(frameId);
      if (frames.size === 0) this.tabs.delete(tabId);
    }
  }

  /** Zagregowany stan odtwarzacza dla karty albo null. */
  aggregate(tabId) {
    this.prune();
    const frames = this.tabs.get(tabId);
    if (!frames) return null;
    const top = frames.get(0);
    if (top) return { ...top, source: 'top' };
    // brak raportu ramki głównej → iframe z odtwarzaczem (page != '')
    const candidates = [...frames.values()].filter((r) => r.page);
    if (!candidates.length) return null;
    candidates.sort((a, b) => (SEVERITY[b.status] - SEVERITY[a.status]) || (b.at - a.at));
    return { ...candidates[0], source: 'frame' };
  }

  /** Najświeższy zagregowany stan spośród wszystkich kart (do diagnostyki). */
  latest() {
    this.prune();
    let best = null;
    for (const tabId of this.tabs.keys()) {
      const a = this.aggregate(tabId);
      if (a && (!best || a.at > best.at)) best = a;
    }
    return best;
  }
}
