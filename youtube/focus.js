// ChromeBlock – YouTube Focus Mode (skrypt treści, świat izolowany, www.youtube.com).
//
// Nakłada WŁASNY arkusz CSS ChromeBlock (<style id="chromeblock-youtube-focus">), który tylko ukrywa
// wybrane elementy interfejsu (Shorts, rekomendacje, komentarze, sugestie na końcu filmu).
// CSS liczy service worker (shared/youtube-focus.js). Zmiana ustawień w opcjach działa od razu
// na otwartych kartach (chrome.storage.onChanged) – bez przeładowania strony i rozszerzenia.
// Nie dotyka odtwarzacza ani YouTube Protection; nie wysyła niczego poza rozszerzenie.

(() => {
  if (window.__chromeblockYouTubeFocus) return;
  window.__chromeblockYouTubeFocus = true;

  const STYLE_ID = 'chromeblock-youtube-focus';
  let style = null;
  let seq = 0;

  const apply = (css) => {
    if (!css) {
      if (style) style.remove();
      style = null;
      return;
    }
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
    }
    if (style.textContent !== css) style.textContent = css;
    if (!style.isConnected) (document.head || document.documentElement).appendChild(style);
  };

  const refresh = () => {
    const my = ++seq; // przy szybkich zmianach wygrywa najnowsza odpowiedź
    try {
      chrome.runtime.sendMessage({ type: 'youtubeFocus:css' }).then((r) => {
        if (my === seq) apply(r && typeof r.css === 'string' ? r.css : '');
      }, () => {});
    } catch { /* rozszerzenie przeładowane */ }
  };

  refresh();
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && (changes.youtubeFocus || changes.disabledSites)) refresh();
    });
  } catch { /* brak dostępu do storage */ }
})();
