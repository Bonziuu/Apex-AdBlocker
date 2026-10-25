// ChromeBlock Polish Supplement – analiza wyników test:polish-sites (czyste funkcje, bez przeglądarki).
//
// Zasada: obserwacja = DOWÓD na stronie, nie zgadywanie po nazwach klas. Kandydat do przyszłej reguły
// powstaje tylko z:
//   - widocznej etykiety reklamy / treści sponsorowanej (dokładny, krótki tekst etykiety),
//   - pustego kontenera z taką etykietą,
//   - widocznej, pustej ramki, której żądanie zablokował ChromeBlock.
// Nazwa klasy / id zawierająca „ad” NIE jest dowodem. Narzędzie NIE generuje reguł.

/** Krótkie etykiety oznaczające reklamę / treść sponsorowaną (porównanie całego tekstu elementu). */
export const AD_LABELS = [
  'reklama', 'reklamy', 'sponsorowane', 'sponsorowany', 'artykuł sponsorowany', 'materiał sponsorowany',
  'treść sponsorowana', 'materiał partnera', 'materiał promocyjny', 'wpis sponsorowany', 'advertisement', 'sponsored',
];
const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
export const isAdLabel = (text) => AD_LABELS.includes(norm(text).replace(/[:·•|]+$/, '').trim());

export function hostOf(url) {
  try { return new URL(url).hostname.toLowerCase(); } catch { return ''; }
}
export function siteOf(host) {
  const parts = String(host).split('.');
  const two = ['com.pl', 'net.pl', 'org.pl', 'co.uk', 'com.au'];
  const last2 = parts.slice(-2).join('.');
  return two.includes(last2) ? parts.slice(-3).join('.') : last2;
}
export const isThirdParty = (reqUrl, pageHost) => {
  const h = hostOf(reqUrl);
  return !!h && siteOf(h) !== siteOf(pageHost);
};

/** Domena z wejścia użytkownika → URL strony głównej. */
export function siteUrl(input) {
  const s = String(input || '').trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(s)) return null;
  return `https://${s.startsWith('www.') ? s : `www.${s}`}/`;
}

const short = (s, n = 120) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);

/**
 * Obserwacje dla jednej strony.
 * snapshot (z przeglądarki): { labels:[{label, el, container:{desc,w,h,media,otherText}}], frames:[{desc,w,h,src}], ... }
 * blockedUrls: Set adresów zablokowanych przez ChromeBlock (ERR_BLOCKED_BY_CLIENT)
 */
/**
 * Ewidentne false positive etykiety (np. link „Reklama” w stopce = informacja o reklamie w serwisie).
 * Wpis NIE jest usuwany – dostaje likely_false_positive: true i powody.
 */
export function falsePositiveReasons(l) {
  const reasons = [];
  const c = l.container || {};
  const vp = l.viewport || {};
  const pg = l.page || {};
  if (l.inFooter) reasons.push('w stopce (footer)');
  if (pg.w > 0 && pg.h > 0 && c.w * c.h >= 0.5 * pg.w * pg.h) reasons.push('obejmuje prawie całą stronę');
  if (vp.w > 0 && vp.h > 0 && (c.h > 2 * vp.h || c.w > 1.2 * vp.w || c.w * c.h > 1.5 * vp.w * vp.h)) reasons.push('nienaturalnie duży względem okna');
  return reasons;
}

export function observationsFor(domain, snapshot, blockedUrls = new Set()) {
  const out = [];
  let n = 0;
  const id = () => `${domain}#${++n}`;
  for (const [labelIndex, l] of (snapshot.labels || []).entries()) {
    if (!isAdLabel(l.label)) continue; // tylko prawdziwe etykiety
    const c = l.container || {};
    const empty = !c.media && (c.otherText || 0) < 5;
    const fp = falsePositiveReasons(l);
    out.push({
      id: id(), domain, labelIndex,
      likely_false_positive: fp.length > 0,
      ...(fp.length ? { false_positive_reasons: fp } : {}),
      kind: empty ? 'empty-ad-container' : 'ad-label',
      label: norm(l.label),
      element: short(l.el, 160),
      container: short(c.desc, 160),
      size: c.w && c.h ? `${Math.round(c.w)}x${Math.round(c.h)}` : '',
      note: empty ? 'widoczna etykieta reklamy, kontener bez treści/mediów' : 'widoczna etykieta reklamy obok treści/mediów (reklama nie została usunięta)',
    });
  }
  for (const f of snapshot.frames || []) {
    if (!f.src || !blockedUrls.has(f.src)) continue;
    out.push({
      id: id(), domain, kind: 'blocked-frame-space', likely_false_positive: false,
      element: short(f.desc, 160), frameHost: hostOf(f.src),
      size: `${Math.round(f.w)}x${Math.round(f.h)}`,
      note: 'widoczna ramka, której żądanie zablokował ChromeBlock (puste miejsce)',
    });
  }
  return out;
}

/** Ocena działania strony (nie ocenia ChromeBlock – tylko czy strona się wyświetla). */
export function pageVerdict({ gotoError, analysisError, status, textLength, title }) {
  if (gotoError) return { status: 'UNREACHABLE', reason: short(gotoError, 160) };
  // strona się załadowała, ale analiza się nie wykonała – NIE jest to OK ani brak sieci
  if (analysisError) return { status: 'ERROR', reason: `analiza nie wykonała się: ${short(analysisError, 140)}` };
  if (status && status >= 400) return { status: 'BROKEN', reason: `HTTP ${status}` };
  if ((textLength || 0) < 200) return { status: 'BROKEN', reason: `mało treści (${textLength || 0} znaków)` };
  return { status: 'OK', reason: short(title, 80) };
}

/** Zestawienie hostów (bez ścieżek) – do ręcznego przeglądu, nie jako kandydaci. */
export function topHosts(urls, limit = 10) {
  const m = new Map();
  for (const u of urls) { const h = hostOf(u); if (h) m.set(h, (m.get(h) || 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([host, count]) => ({ host, count }));
}

/** Raport tekstowy. */
export function formatReport(run) {
  const L = [];
  L.push('ChromeBlock – test polskich stron (ChromeBlock Polish Supplement)');
  L.push('='.repeat(64));
  L.push(`Data:          ${run.date}`);
  L.push(`Wersja:        ${run.version}`);
  L.push(`MODE: ${run.modeLabel || 'NORMAL — all lists (with MajkiIT Polish Filters)'}`);
  if (run.adsSources) L.push(`Źródła ads:    ${run.adsSources.join(', ')}`);
  L.push(`Tryb:          ${run.fixture ? 'fixture (offline, strony testowe)' : 'prawdziwe strony'}${run.evidence ? ' + evidence (zrzuty: tests/polish-sites/results/evidence/)' : ''}`);
  L.push(`Strony:        ${run.sites.length} (OK ${run.sites.filter((s) => s.verdict.status === 'OK').length}, BROKEN ${run.sites.filter((s) => s.verdict.status === 'BROKEN').length}, UNREACHABLE ${run.sites.filter((s) => s.verdict.status === 'UNREACHABLE').length}, ERROR ${run.sites.filter((s) => s.verdict.status === 'ERROR').length})`);
  L.push(`Obserwacje:    ${run.sites.reduce((n, s) => n + s.observations.length, 0)}`);
  L.push('');
  for (const s of run.sites) {
    L.push(`[${s.verdict.status.padEnd(11)}] ${s.domain}  ${s.verdict.reason}`);
    if (s.verdict.status === 'UNREACHABLE') continue;
    L.push(`    żądania: ${s.requests.total} (3rd-party ${s.requests.thirdParty}), zablokowane przez ChromeBlock: ${s.requests.blocked}`);
    L.push(`    błędy JS: ${s.jsErrors.count}${s.jsErrors.samples.length ? ` – ${s.jsErrors.samples.join(' | ')}` : ''}; błędy konsoli: ${s.consoleErrors}`);
    if (s.consentDialog) L.push('    okno zgody (CMP) widoczne – niczego nie klikano; część reklam może się nie załadować');
    const real = s.observations.filter((o) => !o.likely_false_positive);
    const labels = real.filter((o) => o.kind === 'ad-label' || o.kind === 'empty-ad-container').length;
    const empty = real.filter((o) => o.kind === 'empty-ad-container' || o.kind === 'blocked-frame-space').length;
    const fpCount = s.observations.length - real.length;
    L.push(`    etykiety reklam/sponsorowanych: ${labels}; puste kontenery reklamowe: ${empty}${fpCount ? `; prawdopodobne false positive: ${fpCount}` : ''}`);
    for (const o of s.observations) {
      L.push(`    • ${o.id} ${o.kind}${o.label ? ` „${o.label}”` : ''}${o.frameHost ? ` ramka ${o.frameHost}` : ''} ${o.size} – ${o.container || o.element}${o.likely_false_positive ? ` [likely_false_positive: ${o.false_positive_reasons.join(', ')}]` : ''}`);
      if (o.evidence) L.push(`      dowód: ${[o.evidence.element, o.evidence.context].filter(Boolean).join(' + ') || '—'}${o.evidence.error ? ` (${o.evidence.error})` : ''}`);
    }
    L.push(`    niezablokowane hosty 3rd-party (do ręcznego przeglądu): ${s.unblockedThirdPartyHosts.length ? s.unblockedThirdPartyHosts.map((h) => `${h.host}×${h.count}`).join(', ') : 'brak'}`);
  }
  L.push('');
  L.push('Obserwacja NIE jest regułą. Regułę dodaje człowiek po sprawdzeniu dowodu, z wpisem w provenance.json.');
  return L.join('\n');
}
