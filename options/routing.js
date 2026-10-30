// Apex AdBlocker – routing Opcji (czysta funkcja, testowana offline).
// Główne zakładki: protection, filters, sites, more. Sekcje „Więcej” (zwijane): backup, diag, about.
// Stare deep linki (#diag z popupu, #backup, #about) otwierają zakładkę „Więcej” z rozwiniętą sekcją.

export const TABS = Object.freeze(['protection', 'filters', 'sites', 'more']);
export const MORE_SECTIONS = Object.freeze(['backup', 'diag', 'about']);

/** '#diag' / 'diag' → { tab: 'more', section: 'diag' }; nieznany lub pusty → zakładka Ochrona. */
export function resolveRoute(hash) {
  const id = String(hash || '').replace(/^#/, '');
  if (MORE_SECTIONS.includes(id)) return { tab: 'more', section: id };
  if (TABS.includes(id)) return { tab: id, section: null };
  return { tab: 'protection', section: null };
}
