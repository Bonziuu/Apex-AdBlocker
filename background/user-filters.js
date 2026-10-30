// Apex AdBlocker – kompilacja własnych filtrów użytkownika („Moje filtry”).
// Czysty moduł: bez Chrome API, bez I/O i bez stanu – tekst filtrów → reguły DNR, kosmetyka, błędy, liczba.
// Wynik trafia do background.js (reguły dynamiczne, dane kosmetyczne, komunikaty w Opcjach).

import {
  classifyLine, parseNetworkFilter, parseCosmeticFilter, validateRule,
  splitSelectorList, PRIORITY,
} from '../shared/parser.js';

export function compileUserFilters(text) {
  const out = {
    rules: [],
    spec: {}, unhide: {}, style: {}, proc: {}, genC: [],
    errors: [], count: 0,
  };
  const lines = String(text || '').split(/\r?\n/);
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    const c = classifyLine(line);
    if (c.kind === 'comment') return;
    if (c.kind === 'network') {
      const res = parseNetworkFilter(c.text, { trusted: true });
      if (!res || (!res.rule && !res.cosmeticHosts)) { out.errors.push({ line: i + 1, text: line, reason: 'nieobsługiwany filtr sieciowy' }); return; }
      if (res.rule) {
        if (!validateRule(res.rule)) { out.errors.push({ line: i + 1, text: line, reason: 'niepoprawna reguła' }); return; }
        res.rule.priority += PRIORITY.user - 1;
        out.rules.push(res.rule);
      }
      out.count++;
      return;
    }
    const f = parseCosmeticFilter(c, { trusted: false });
    if (!f) { out.errors.push({ line: i + 1, text: line, reason: 'nieobsługiwany filtr kosmetyczny' }); return; }
    const add = (obj, h, v) => { (obj[h] ||= []).push(v); };
    switch (f.type) {
      case 'hide':
        for (const sel of splitSelectorList(f.selector)) {
          if (f.include.length) for (const h of f.include) add(out.spec, h, sel);
          else out.genC.push(sel);
          for (const h of f.exclude) add(out.unhide, h, sel);
        }
        break;
      case 'unhide':
        for (const sel of splitSelectorList(f.selector)) for (const h of f.include) add(out.unhide, h, sel);
        break;
      case 'style':
        for (const h of f.include) add(out.style, h, [f.selector, f.css]);
        break;
      case 'procedural':
        for (const h of f.include) add(out.proc, h, f.tasks);
        break;
      default:
        out.errors.push({ line: i + 1, text: line, reason: 'scriptlety (+js) nie są dostępne w moich filtrach' });
        return;
    }
    out.count++;
  });
  return out;
}
