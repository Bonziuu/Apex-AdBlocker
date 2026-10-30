// Apex AdBlocker – stały zestaw list ochrony (jedno źródło prawdy).
//
// Apex AdBlocker 1.0 nie ma trybów ochrony ani wyboru list: zawsze działają te trzy listy.
// Użytkownik konfiguruje tylko wyłączone strony i własne filtry (oraz „Ukryj element”).
// Budowanie (tools/lists-config.mjs) i działanie rozszerzenia (background.js) korzystają z tej stałej.

export const CORE_LISTS = Object.freeze(['ads', 'privacy', 'security']);

/** Czy zestaw list (kolejność bez znaczenia) to dokładnie stały zestaw. */
export function isCoreSet(lists) {
  const set = new Set(Array.isArray(lists) ? lists : []);
  return set.size === CORE_LISTS.length && CORE_LISTS.every((id) => set.has(id));
}
