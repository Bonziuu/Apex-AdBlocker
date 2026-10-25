// ChromeBlock Polish Supplement – walidacja listy i provenance.json (clean room).
//
// Każda reguła listy musi mieć dokładnie jeden wpis pochodzenia (domena, typ, data, krótki własny
// opis obserwacji, metoda) i nie może być identyczna z linią innej listy wbudowanej w ChromeBlock
// (zabezpieczenie przed przypadkowym skopiowaniem / duplikatem).

import { classifyLine, parseNetworkFilter, parseCosmeticFilter } from '../../shared/parser.js';

export const TYPES = ['network', 'cosmetic', 'scriptlet'];
export const METHODS = ['manual', 'automated-browser'];
export const MAX_OBSERVATION = 200;

/** Linie reguł (bez komentarzy i nagłówka). */
export function ruleLines(text) {
  return String(text).split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('!') && !(l.startsWith('[') && l.endsWith(']')));
}

/** Typ reguły wg składni (network / cosmetic / scriptlet) albo null, gdy ChromeBlock jej nie obsłuży. */
export function ruleType(line) {
  const c = classifyLine(line);
  if (c.kind === 'network') {
    const r = parseNetworkFilter(c.text, { trusted: false });
    return r && (r.rule || r.cosmeticHosts) ? 'network' : null;
  }
  if (c.kind === 'cosmetic') {
    const f = parseCosmeticFilter(c, { trusted: false });
    if (!f) return null;
    if (f.type === 'scriptlet') return 'scriptlet';
    if (f.type === 'scriptlet-rejected' || f.type === 'unscriptlet') return null;
    return 'cosmetic';
  }
  return null;
}

/**
 * @param {string} listText treść chromeblock-polish.txt
 * @param {object} prov provenance.json
 * @param {Set<string>} otherLines linie innych list wbudowanych w ChromeBlock
 * @returns {string[]} lista problemów (pusta = OK)
 */
export function validateList(listText, prov, otherLines = new Set()) {
  const problems = [];
  const head = String(listText).split(/\r?\n/).slice(0, 15).join('\n');
  if (!/^! Title: ChromeBlock Polish Supplement$/m.test(head)) problems.push('nagłówek: brak "! Title: ChromeBlock Polish Supplement"');
  if (!/niezależnie/i.test(head)) problems.push('nagłówek: brak informacji o niezależnym tworzeniu reguł');
  if (!/^! Last modified: \d{4}-\d{2}-\d{2}$/m.test(head)) problems.push('nagłówek: brak "! Last modified: RRRR-MM-DD"');
  if (!/^! License: TBD$/m.test(head)) problems.push('nagłówek: licencja ma być "TBD" do czasu decyzji');
  if (!prov || prov.schema !== 1 || !Array.isArray(prov.rules)) return [...problems, 'provenance.json: niepoprawny format (schema 1, rules[])'];

  const rules = ruleLines(listText);
  const seen = new Map();
  for (const r of rules) seen.set(r, (seen.get(r) || 0) + 1);
  for (const [r, n] of seen) if (n > 1) problems.push(`reguła powtórzona ${n}×: ${r}`);

  const byRule = new Map();
  for (const [i, e] of prov.rules.entries()) {
    const where = `provenance[${i}]`;
    if (!e || typeof e !== 'object') { problems.push(`${where}: nie jest obiektem`); continue; }
    if (byRule.has(e.rule)) problems.push(`${where}: drugi wpis dla reguły ${e.rule}`);
    byRule.set(e.rule, e);
    if (!rules.includes(e.rule)) problems.push(`${where}: reguły nie ma na liście: ${e.rule}`);
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(String(e.domain || ''))) problems.push(`${where}: niepoprawna domena`);
    if (!TYPES.includes(e.type)) problems.push(`${where}: typ musi być jednym z ${TYPES.join('/')}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(e.date || ''))) problems.push(`${where}: data RRRR-MM-DD`);
    if (!METHODS.includes(e.method)) problems.push(`${where}: metoda musi być jedną z ${METHODS.join('/')}`);
    const obs = String(e.observation || '').trim();
    if (obs.length < 10) problems.push(`${where}: brak opisu obserwacji`);
    if (obs.length > MAX_OBSERVATION) problems.push(`${where}: opis obserwacji dłuższy niż ${MAX_OBSERVATION} znaków (bez kopiowania treści strony)`);
    if (/<[a-z][^>]*>|function\s*\(|=>/i.test(obs)) problems.push(`${where}: opis obserwacji wygląda na kod strony`);
  }
  for (const r of rules) {
    const e = byRule.get(r);
    if (!e) { problems.push(`brak wpisu w provenance.json dla reguły: ${r}`); continue; }
    const t = ruleType(r);
    if (!t) problems.push(`reguła nieobsługiwana przez ChromeBlock: ${r}`);
    else if (t !== e.type) problems.push(`typ w provenance (${e.type}) ≠ typ reguły (${t}): ${r}`);
    if (otherLines.has(r)) problems.push(`reguła identyczna z linią innej wbudowanej listy (nie kopiujemy): ${r}`);
  }
  return problems;
}
