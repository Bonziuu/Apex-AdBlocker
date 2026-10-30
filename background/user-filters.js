// Apex AdBlocker – kompilacja własnych filtrów użytkownika („Moje filtry”).
// Czysty moduł: bez Chrome API, bez I/O i bez stanu – tekst filtrów → reguły DNR, kosmetyka, błędy, liczba.
// Wynik trafia do background.js (reguły dynamiczne, dane kosmetyczne, komunikaty w Opcjach).

import {
  classifyLine, parseNetworkFilter, parseCosmeticFilter, validateRule,
  splitSelectorList, PRIORITY,
} from '../shared/parser.js';

export const MAX_USER_RULES = 5000;

export function compileUserFilters(text) {
  const dict = () => Object.create(null);
  const out = {
    rules: [],
    spec: dict(), unhide: dict(), style: dict(), proc: dict(), genC: [],
    scopedStyle: dict(), scopedProc: dict(),
    scopedHide: dict(),
    gunhide: [], ghide: [], ehide: [], docAllow: [],
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
        if (out.rules.length >= MAX_USER_RULES) {
          out.limitExceeded = true;
          out.errors.push({ line: i + 1, text: line, reason: `za dużo własnych reguł sieciowych (maks. ${MAX_USER_RULES})` });
          return;
        }
        res.rule.priority += PRIORITY.user - 1;
        out.rules.push(res.rule);
      }
      for (const key of ['ghide', 'ehide', 'docAllow']) out[key].push(...(res.cosmeticHosts?.[key] || []));
      out.count++;
      return;
    }
    const f = parseCosmeticFilter(c, { trusted: false });
    if (!f) { out.errors.push({ line: i + 1, text: line, reason: 'nieobsługiwany filtr kosmetyczny' }); return; }
    const add = (obj, h, v) => { (obj[h] ||= []).push(v); };
    switch (f.type) {
      case 'hide':
        for (const sel of splitSelectorList(f.selector)) {
          if (f.exclude.length) {
            for (const h of f.include.length ? f.include : ['*']) add(out.scopedHide, h, { value: sel, exclude: f.exclude });
            continue;
          }
          if (f.include.length) for (const h of f.include) add(out.spec, h, sel);
          else out.genC.push(sel);
        }
        break;
      case 'unhide':
        for (const sel of splitSelectorList(f.selector)) {
          if (f.include.length) for (const h of f.include) add(out.unhide, h, sel);
          else out.gunhide.push(sel);
        }
        break;
      case 'style':
        for (const h of f.include) {
          const value = [f.selector, f.css];
          if (f.exclude.length) add(out.scopedStyle, h, { value, exclude: f.exclude });
          else add(out.style, h, value);
        }
        break;
      case 'procedural':
        for (const h of f.include) {
          if (f.exclude.length) add(out.scopedProc, h, { value: f.tasks, exclude: f.exclude });
          else add(out.proc, h, f.tasks);
        }
        break;
      default:
        out.errors.push({ line: i + 1, text: line, reason: 'scriptlety (+js) nie są dostępne w moich filtrach' });
        return;
    }
    out.count++;
  });
  return out;
}
