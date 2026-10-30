// Apex AdBlocker – pomiar etapów uruchomienia service workera (instalacja, aktualizacja, przeładowanie,
// start przeglądarki). Tylko czasy i nazwy etapów – bez adresów ani danych użytkownika.
// Wynik ostatniego startu: Opcje → Diagnostyka → „Start rozszerzenia” i raport diagnostyczny.

export function createStartupProfiler({ now = () => performance.now(), origin = 0 } = {}) {
  const stages = new Map(); // nazwa → { count, totalMs, maxMs, firstStartMs }
  const marks = {};         // nazwa → ms od startu service workera
  let reason = '';
  let finishedAt = null;
  const rel = () => Math.round((now() - origin) * 10) / 10;

  const record = (name, ms, startedAt) => {
    let s = stages.get(name);
    if (!s) { s = { count: 0, totalMs: 0, maxMs: 0, firstStartMs: startedAt }; stages.set(name, s); }
    s.count++;
    s.totalMs += ms;
    if (ms > s.maxMs) s.maxMs = ms;
  };

  return {
    /** Mierzy czas funkcji (synchronicznej lub async) jako etap `name`. */
    async time(name, fn) {
      const startedAt = rel();
      const t0 = now();
      try { return await fn(); } finally { record(name, now() - t0, startedAt); }
    },
    /** Dopisuje zmierzony gdzie indziej czas do etapu `name` (np. oczekiwanie w kolejce). */
    add(name, ms) { record(name, ms, rel()); },
    mark(name) { if (!(name in marks)) marks[name] = rel(); },
    setReason(r) { reason = r; },
    finish() { finishedAt = rel(); },
    snapshot() {
      const r1 = (x) => Math.round(x * 10) / 10;
      return {
        reason,
        totalMs: finishedAt,
        marks: { ...marks },
        stages: [...stages.entries()].map(([name, s]) => ({
          name, count: s.count, totalMs: r1(s.totalMs), maxMs: r1(s.maxMs), startMs: s.firstStartMs,
        })),
      };
    },
  };
}

/** Tekst raportu (diagnostyka / benchmark). */
export function formatStartupProfile(p) {
  if (!p) return 'Start rozszerzenia: brak pomiaru';
  const lines = [`Startup total: ${p.totalMs === null ? 'w toku' : `${p.totalMs} ms`} (${p.reason || '?'})`];
  for (const [k, v] of Object.entries(p.marks || {})) lines.push(`  ${k}: ${v} ms od startu`);
  for (const s of p.stages || []) lines.push(`  ${s.name}: ${s.totalMs} ms${s.count > 1 ? ` (${s.count}×, maks. ${s.maxMs} ms)` : ''}`);
  return lines.join('\n');
}
