// Apex AdBlocker – polityka nadawców wiadomości service workera (czysta logika, bez stanu).
//
// Skrypty treści działają w każdej ramce każdej strony WWW, więc mogą wysyłać tylko wiadomości
// potrzebne do kosmetyki, YouTube Playback Health, pomiarów i „Ukryj element”. Wszystkie pozostałe
// zmieniają ustawienia albo zwracają diagnostykę – przyjmujemy je wyłącznie ze stron rozszerzenia
// (popup, Opcje, strona powitalna). To obrona w głąb na wypadek przejętego procesu renderera.

/** Typy wiadomości dozwolone ze skryptów treści. */
export const CONTENT_SCRIPT_MESSAGES = Object.freeze(new Set([
  'cosmetic:init', 'cosmetic:tokens', 'youtube:health', 'perf:report', 'perf:scriptlets', 'picker:add',
]));

/**
 * Czy wiadomość wysłała strona samego rozszerzenia (a nie skrypt treści na stronie WWW).
 * `extensionBaseUrl` = chrome.runtime.getURL('') (np. "chrome-extension://<id>/").
 */
export function isExtensionPageSender(sender, extensionBaseUrl) {
  const url = sender && typeof sender.url === 'string' ? sender.url : '';
  return Boolean(extensionBaseUrl) && url.startsWith(extensionBaseUrl);
}

/** Czy nadawca może wywołać dany typ wiadomości. */
export function senderAllowed(type, sender, extensionBaseUrl) {
  return CONTENT_SCRIPT_MESSAGES.has(type) || isExtensionPageSender(sender, extensionBaseUrl);
}

/** Handler dla typu wiadomości – tylko własne klucze rejestru (bez `constructor`, `__proto__` itd.). */
export function handlerFor(handlers, msg) {
  const type = msg && typeof msg.type === 'string' ? msg.type : '';
  return type && Object.hasOwn(handlers, type) ? handlers[type] : null;
}
