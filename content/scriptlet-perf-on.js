// ChromeBlock – włącza profiler scriptletów w tej ramce (świat MAIN, document_start).
// Rejestrowany przez service worker przed plikami scriptletów TYLKO wtedy, gdy w opcjach
// włączono „Pomiary wydajności”. Bez tego pliku scriptlety działają bez żadnych pomiarów.
(() => {
  try { Object.defineProperty(globalThis, Symbol.for('chromeblock.scriptletPerf'), { value: true }); } catch { /* */ }
})();
