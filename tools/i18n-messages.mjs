// Apex AdBlocker – źródło wszystkich tekstów interfejsu (polski i angielski).
// `npm run i18n` generuje z niego _locales/{pl,en}/messages.json. Edytuj TYLKO ten plik.
//
// $1…$9 – wartości wstawiane w kodzie (chrome.i18n.getMessage(key, [..])).
// html: true – tekst zawiera znaczniki (<b>, <strong>) i trafia do innerHTML; to stałe teksty
// rozszerzenia, nigdy dane ze stron.

export const MESSAGES = {
  // ── manifest ────────────────────────────────────────────────────────────────
  extDescription: {
    pl: 'Lekki bloker reklam i śledzenia dla Chrome (Manifest V3) z własnym silnikiem filtrów i kontrolą zgodności filtrów YouTube.',
    en: 'Lightweight ad and tracker blocker for Chrome (Manifest V3) with its own filter engine and YouTube filter compatibility checks.',
  },

  // ── wspólne ─────────────────────────────────────────────────────────────────
  common_save: { pl: 'Zapisz', en: 'Save' },
  common_saved: { pl: 'Zapisano', en: 'Saved' },
  common_error: { pl: 'Błąd: $1', en: 'Error: $1' },
  rules_one: { pl: 'reguła', en: 'rule' },
  rules_few: { pl: 'reguły', en: 'rules' },
  rules_many: { pl: 'reguł', en: 'rules' },

  // ── popup ───────────────────────────────────────────────────────────────────
  popup_checking: { pl: 'Sprawdzanie…', en: 'Checking…' },
  popup_autoReload: { pl: 'Odświeżaj stronę po zmianie ochrony', en: 'Reload the page after changing protection' },
  popup_reloadNotice: { pl: 'Odśwież stronę, aby w pełni zastosować zmianę.', en: 'Reload the page to fully apply the change.' },
  popup_toggleHintReload: {
    pl: 'Włącza lub wyłącza ochronę Apex AdBlocker na tej stronie. Karta zostanie przeładowana.',
    en: 'Turns Apex AdBlocker protection on or off for this site. The tab will reload.',
  },
  popup_toggleHintNoReload: {
    pl: 'Włącza lub wyłącza ochronę Apex AdBlocker na tej stronie bez automatycznego przeładowania.',
    en: 'Turns Apex AdBlocker protection on or off for this site without reloading the tab.',
  },
  popup_blocked_one: { pl: 'zablokowane żądanie na tej karcie', en: 'blocked request on this tab' },
  popup_blocked_few: { pl: 'zablokowane żądania na tej karcie', en: 'blocked requests on this tab' },
  popup_blocked_many: { pl: 'zablokowanych żądań na tej karcie', en: 'blocked requests on this tab' },
  popup_unsupportedTitle: { pl: 'Ta strona nie jest obsługiwana', en: 'This page isn’t supported' },
  popup_unsupportedText: {
    pl: 'Apex AdBlocker nie działa na stronach wewnętrznych przeglądarki (np. chrome://, Chrome Web Store).',
    en: 'Apex AdBlocker doesn’t run on internal browser pages (such as chrome:// or the Chrome Web Store).',
  },
  popup_picker: { pl: 'Ukryj element', en: 'Hide element' },
  popup_settings: { pl: 'Ustawienia', en: 'Settings' },
  popup_statusOn: { pl: 'Ochrona aktywna', en: 'Protection on' },
  popup_statusOff: { pl: 'Ochrona wyłączona', en: 'Protection off' },
  popup_problems: { pl: 'Problem z silnikiem: $1 – otwórz diagnostykę', en: 'Engine problem: $1 – open diagnostics' },
  component_network: { pl: 'sieć', en: 'network' },
  component_cosmetic: { pl: 'filtry kosmetyczne', en: 'cosmetic filters' },
  component_scriptlets: { pl: 'scriptlety', en: 'scriptlets' },
  component_filters: { pl: 'listy filtrów', en: 'filter lists' },
  component_youtube: { pl: 'YouTube', en: 'YouTube' },
  ytStatus_ok: { pl: 'Aktywna', en: 'Active' },
  ytStatus_warning: { pl: 'Ostrzeżenie', en: 'Warning' },
  ytStatus_error: { pl: 'Błąd', en: 'Error' },
  ytStatus_disabled: { pl: 'Wyłączona', en: 'Off' },
  ytStatus_unknown: { pl: 'Nieznany', en: 'Unknown' },

  // ── „Ukryj element” (content/picker.js) ─────────────────────────────────────
  picker_title: { pl: 'Ukryj element', en: 'Hide element' },
  picker_hint: { pl: 'Kliknij element na stronie, który chcesz ukryć. Esc – anuluj.', en: 'Click the element on the page you want to hide. Esc – cancel.' },
  picker_placeholder: { pl: 'Selektor CSS pojawi się po kliknięciu', en: 'The CSS selector will appear after you click' },
  picker_none: { pl: 'Nic nie wybrano', en: 'Nothing selected' },
  picker_invalid: { pl: 'Niepoprawny selektor', en: 'Invalid selector' },
  picker_match_one: { pl: 'Pasuje: 1 element', en: 'Matches: 1 element' },
  picker_match_few: { pl: 'Pasuje: $1 elementy', en: 'Matches: $1 elements' },
  picker_match_many: { pl: 'Pasuje: $1 elementów', en: 'Matches: $1 elements' },
  picker_upTitle: { pl: 'Zaznacz element nadrzędny', en: 'Select the parent element' },
  picker_up: { pl: '↑ Szerzej', en: '↑ Wider' },
  picker_downTitle: { pl: 'Wróć do węższego elementu', en: 'Go back to the narrower element' },
  picker_down: { pl: '↓ Węziej', en: '↓ Narrower' },
  picker_cancel: { pl: 'Anuluj', en: 'Cancel' },
  picker_save: { pl: 'Ukryj na stałe', en: 'Hide permanently' },
  picker_saved: { pl: 'Zapisano w „Moich filtrach”. Element zostanie ukryty także po odświeżeniu.', en: 'Saved to “My filters”. The element will stay hidden after reloading too.' },
  picker_saveFailed: { pl: 'Nie udało się zapisać filtra.', en: 'Couldn’t save the filter.' },

  // ── ekran powitalny ─────────────────────────────────────────────────────────
  welcome_pageTitle: { pl: 'Witaj w Apex AdBlocker', en: 'Welcome to Apex AdBlocker' },
  welcome_title: { pl: 'Witaj w Apex AdBlocker', en: 'Welcome to Apex AdBlocker' },
  welcome_tagline: { pl: 'Lekki bloker reklam dla Chrome', en: 'Lightweight ad blocker for Chrome' },
  welcome_lead: {
    pl: 'Apex AdBlocker działa lokalnie w Twojej przeglądarce: blokuje reklamy, śledzenie i złośliwe strony na podstawie list filtrów zapisanych w rozszerzeniu. Apex AdBlocker nie wysyła Twoich danych ani telemetrii.',
    en: 'Apex AdBlocker works locally in your browser: it blocks ads, tracking and malicious sites using filter lists built into the extension. Apex AdBlocker doesn’t send your data or any telemetry.',
  },
  welcome_onTitle: { pl: 'Ochrona jest już włączona', en: 'Protection is already on' },
  welcome_noSetup: { pl: 'Nie musisz niczego wybierać ani konfigurować.', en: 'There’s nothing to choose or set up.' },
  welcome_featAds: { pl: '<strong>Reklamy</strong> – w tym YouTube Protection', en: '<strong>Ads</strong> – including YouTube Protection', html: true },
  welcome_featTracking: { pl: '<strong>Śledzenie</strong> – skrypty i piksele śledzące', en: '<strong>Tracking</strong> – tracking scripts and pixels', html: true },
  welcome_featMalware: { pl: '<strong>Złośliwe strony</strong> – znane oszustwa i malware', en: '<strong>Malicious sites</strong> – known scams and malware', html: true },
  welcome_brokenSite: {
    pl: 'Jeśli jakaś strona działa źle, wyłącz na niej ochronę przyciskiem w okienku rozszerzenia.',
    en: 'If a site doesn’t work properly, turn protection off for it with the button in the extension popup.',
  },
  welcome_start: { pl: 'Zacznij korzystać', en: 'Get started' },
  welcome_openOptions: { pl: 'Otwórz ustawienia', en: 'Open settings' },

  // ── Opcje: nagłówek i zakładki ──────────────────────────────────────────────
  opt_pageTitle: { pl: 'Apex AdBlocker – ustawienia', en: 'Apex AdBlocker – settings' },
  opt_tagline: { pl: 'Bloker reklam dla Chrome · wersja', en: 'Ad blocker for Chrome · version' },
  tab_protection: { pl: 'Ochrona', en: 'Protection' },
  tab_filters: { pl: 'Moje filtry', en: 'My filters' },
  tab_sites: { pl: 'Wyłączone strony', en: 'Disabled sites' },
  tab_more: { pl: 'Więcej', en: 'More' },

  // ── Opcje: Ochrona ──────────────────────────────────────────────────────────
  prot_title: { pl: 'Ochrona', en: 'Protection' },
  prot_desc: {
    pl: 'Apex AdBlocker blokuje reklamy, śledzenie i złośliwe strony – zawsze tym samym zestawem list, bez wybierania poziomu ochrony. YouTube Protection działa razem z listą reklam. Na wybranych stronach ochronę wyłączysz przyciskiem w okienku wtyczki albo w zakładce „Wyłączone strony”.',
    en: 'Apex AdBlocker blocks ads, tracking and malicious sites – always with the same set of lists, with no protection levels to choose from. YouTube Protection works together with the ads list. You can turn protection off for selected sites with the button in the extension popup or on the “Disabled sites” tab.',
  },
  list_ads_name: { pl: 'Reklamy', en: 'Ads' },
  list_ads_desc: { pl: 'EasyList, uBlock filters i Polskie Filtry Reklamowe', en: 'EasyList, uBlock filters and Polish Ad Filters' },
  list_privacy_name: { pl: 'Śledzenie i prywatność', en: 'Tracking and privacy' },
  list_privacy_desc: { pl: 'EasyPrivacy i uBlock filters – Privacy', en: 'EasyPrivacy and uBlock filters – Privacy' },
  list_security_name: { pl: 'Złośliwe strony', en: 'Malicious sites' },
  list_security_desc: { pl: 'uBlock filters – Badware risks (oszustwa, malware)', en: 'uBlock filters – Badware risks (scams, malware)' },
  list_counts: { pl: '$1 filtrów sieciowych · $2 kosmetycznych · $3 scriptletów', en: '$1 network filters · $2 cosmetic · $3 scriptlet' },

  // ── Opcje: Moje filtry ──────────────────────────────────────────────────────
  filters_desc: {
    pl: 'Własne filtry w składni uBlock Origin / Adblock Plus, po jednym w linii. Filtry dodane przyciskiem „Ukryj element” trafiają tutaj.',
    en: 'Your own filters in uBlock Origin / Adblock Plus syntax, one per line. Filters added with the “Hide element” button end up here.',
  },
  filters_examples: { pl: 'Przykłady', en: 'Examples' },
  filters_examplesBody: {
    pl: '! komentarz\n||reklamy.example.com^            blokuj domenę\n||example.com/banner/*$image      blokuj obrazki z tej ścieżki\n@@||example.com^$script           zezwól na skrypty z domeny\nexample.com##.reklama              ukryj element na example.com\n##.sponsorowane                    ukryj na wszystkich stronach\nexample.com##div:has-text(Reklama) ukryj element zawierający tekst',
    en: '! comment\n||ads.example.com^                block a domain\n||example.com/banner/*$image      block images from this path\n@@||example.com^$script           allow scripts from a domain\nexample.com##.ad                   hide an element on example.com\n##.sponsored                       hide on all sites\nexample.com##div:has-text(Advert)  hide an element containing text',
  },
  filters_placeholder: { pl: 'np. ||ads.example.com^', en: 'e.g. ||ads.example.com^' },
  filters_line: { pl: 'Linia $1:', en: 'Line $1:' },
  filters_saved: { pl: 'Zapisano · aktywnych filtrów: $1', en: 'Saved · active filters: $1' },

  // ── Opcje: Wyłączone strony ─────────────────────────────────────────────────
  sites_desc: {
    pl: 'Na tych stronach (i ich subdomenach) Apex AdBlocker nic nie blokuje. Jedna domena w linii. Najprościej dodawać je przyciskiem zasilania w okienku wtyczki.',
    en: 'Apex AdBlocker doesn’t block anything on these sites (or their subdomains). One domain per line. The easiest way to add them is the power button in the extension popup.',
  },
  sites_placeholder: { pl: 'np. example.com', en: 'e.g. example.com' },

  // ── Opcje: Kopia ustawień ───────────────────────────────────────────────────
  backup_title: { pl: 'Kopia ustawień', en: 'Settings backup' },
  backup_desc: {
    pl: 'Zapisz ustawienia Apex AdBlocker do pliku JSON i przywróć je później (np. po ponownej instalacji). Plik zawiera tylko: wyłączone strony (same nazwy domen) i Moje filtry – listy ochrony są stałe. Kopie ze starszych wersji Apex AdBlocker też da się zaimportować. Nie zawiera historii, statystyk ani danych diagnostycznych. Nic nie jest wysyłane.',
    en: 'Save your Apex AdBlocker settings to a JSON file and restore them later (e.g. after reinstalling). The file contains only disabled sites (domain names only) and My filters – the protection lists are fixed. Backups from older Apex AdBlocker versions can be imported too. It contains no history, statistics or diagnostic data. Nothing is sent anywhere.',
  },
  backup_export: { pl: 'Eksportuj ustawienia', en: 'Export settings' },
  backup_import: { pl: 'Importuj ustawienia', en: 'Import settings' },
  backup_note: {
    pl: 'Import zastępuje obecne ustawienia. Jeśli plik jest niepoprawny albo Chrome nie przyjmie zmian, ustawienia pozostaną bez zmian.',
    en: 'Importing replaces your current settings. If the file is invalid or Chrome doesn’t accept the changes, your settings stay as they were.',
  },
  backup_restored: { pl: 'Przywrócono:', en: 'Restored:' },
  backup_exportFailed: { pl: 'Nie udało się przygotować kopii', en: 'Couldn’t prepare the backup' },
  backup_savedFile: { pl: 'Zapisano plik $1', en: 'Saved file $1' },
  backup_tooLarge: { pl: 'plik jest za duży (maks. 2 MB)', en: 'the file is too large (max 2 MB)' },
  backup_importing: { pl: 'Importowanie…', en: 'Importing…' },
  backup_done: { pl: 'Ustawienia przywrócone', en: 'Settings restored' },
  backup_summarySites: { pl: 'Wyłączone strony: $1', en: 'Disabled sites: $1' },
  backup_summaryFilters: { pl: 'Moje filtry: $1 $2', en: 'My filters: $1 $2' },
  import_invalid: { pl: 'Nie zaimportowano – plik jest niepoprawny (ustawienia bez zmian):', en: 'Not imported – the file is invalid (settings unchanged):' },
  import_rolledBack: { pl: 'Chrome nie przyjął zmian – przywrócono poprzednie ustawienia:', en: 'Chrome didn’t accept the changes – your previous settings were restored:' },
  import_incomplete: {
    pl: 'Import nie powiódł się i nie udało się w pełni przywrócić poprzedniego stanu. Otwórz Diagnostykę.',
    en: 'The import failed and the previous state couldn’t be fully restored. Open Diagnostics.',
  },
  import_openDiag: { pl: 'Otwórz Diagnostykę', en: 'Open Diagnostics' },

  // ── Opcje: Diagnostyka ──────────────────────────────────────────────────────
  diag_title: { pl: 'Diagnostyka', en: 'Diagnostics' },
  diag_desc: {
    pl: 'Stan silników Apex AdBlocker. Wszystkie dane są zbierane i przechowywane wyłącznie lokalnie, w tej przeglądarce. Raport diagnostyczny nie zawiera adresów stron, identyfikatorów filmów, ciasteczek ani danych konta – możesz go bezpiecznie wkleić do rozmowy.',
    en: 'Status of the Apex AdBlocker engines. All data is collected and stored only locally, in this browser. The diagnostic report contains no page addresses, video IDs, cookies or account data – you can safely paste it into a conversation.',
  },
  diag_refresh: { pl: 'Odśwież', en: 'Refresh' },
  diag_resync: { pl: 'Synchronizuj ponownie', en: 'Resync' },
  diag_copyReport: { pl: 'Kopiuj raport diagnostyczny', en: 'Copy diagnostic report' },
  diag_engines: { pl: 'Silniki', en: 'Engines' },
  diag_lastSync: { pl: 'Ostatnia synchronizacja', en: 'Last sync' },
  diag_errorLog: { pl: 'Dziennik błędów', en: 'Error log' },
  diag_clearLog: { pl: 'Wyczyść dziennik', en: 'Clear log' },
  diag_devData: { pl: 'Dane deweloperskie', en: 'Developer data' },
  diag_scriptletCompat: { pl: 'Zgodność scriptletów', en: 'Scriptlet compatibility' },
  diag_startup: { pl: 'Start rozszerzenia', en: 'Extension startup' },
  diag_startupDesc: {
    pl: 'Czas etapów ostatniej instalacji, aktualizacji lub przeładowania Apex AdBlocker (od uruchomienia service workera).',
    en: 'Timing of the stages of the last Apex AdBlocker install, update or reload (from service worker start).',
  },
  diag_perf: { pl: 'Pomiary wydajności', en: 'Performance measurements' },
  diag_perfToggle: {
    pl: 'Mierz pracę filtrów kosmetycznych i scriptletów na stronach (domyślnie wyłączone)',
    en: 'Measure the work of cosmetic filters and scriptlets on pages (off by default)',
  },
  diag_perfDesc: {
    pl: 'Zbierane: liczba partii mutacji DOM, czas filtrowania ogólnego i proceduralnego, liczba zastosowanych selektorów oraz – dla każdego scriptletu – liczba wywołań i czas pracy kodu Apex AdBlocker (bez czasu oryginalnej funkcji strony). Bez adresów stron, ID filmów i treści danych. Dane pozostają w tej przeglądarce i znikają po jej zamknięciu. Po włączeniu przeładuj karty.',
    en: 'Collected: number of DOM mutation batches, generic and procedural filtering time, number of applied selectors and – for each scriptlet – number of calls and time spent in Apex AdBlocker code (excluding the page’s original function). No page addresses, video IDs or data contents. The data stays in this browser and is cleared when it closes. Reload your tabs after turning this on.',
  },
  diag_resetPerf: { pl: 'Resetuj pomiary', en: 'Reset measurements' },
  diag_topScriptlets: { pl: 'Najdroższe scriptlety', en: 'Most expensive scriptlets' },
  dstatus_ok: { pl: 'OK', en: 'OK' },
  dstatus_warning: { pl: 'ostrzeżenie', en: 'warning' },
  dstatus_error: { pl: 'BŁĄD', en: 'ERROR' },
  dstatus_unknown: { pl: 'nieznany', en: 'unknown' },
  dstatus_disabled: { pl: 'wyłączone', en: 'off' },
  dstatus_healthy: { pl: 'sprawny', en: 'healthy' },
  dstatus_degraded: { pl: 'problem', en: 'problem' },
  dcomp_network: { pl: 'Silnik sieciowy (DNR)', en: 'Network engine (DNR)' },
  dcomp_cosmetic: { pl: 'Silnik kosmetyczny', en: 'Cosmetic engine' },
  dcomp_scriptlets: { pl: 'Silnik scriptletów', en: 'Scriptlet engine' },
  dcomp_filters: { pl: 'Listy filtrów', en: 'Filter lists' },
  dcomp_youtube: { pl: 'YouTube Protection', en: 'YouTube Protection' },
  dcol_component: { pl: 'Komponent', en: 'Component' },
  dcol_status: { pl: 'Status', en: 'Status' },
  dcol_details: { pl: 'Szczegóły', en: 'Details' },
  dcol_updated: { pl: 'Aktualizacja', en: 'Updated' },
  dcol_step: { pl: 'Krok', en: 'Step' },
  dcol_result: { pl: 'Wynik', en: 'Result' },
  dcol_message: { pl: 'Komunikat', en: 'Message' },
  dcol_time: { pl: 'Czas', en: 'Time' },
  dcol_host: { pl: 'Host', en: 'Host' },
  dcol_mutations: { pl: 'Partie mutacji', en: 'Mutation batches' },
  dcol_generic: { pl: 'Ogólne [ms]', en: 'Generic [ms]' },
  dcol_procedural: { pl: 'Proceduralne [ms] / uruchomień', en: 'Procedural [ms] / runs' },
  dcol_selectors: { pl: 'Selektory', en: 'Selectors' },
  dcol_stage: { pl: 'Etap', en: 'Stage' },
  dcol_timeMs: { pl: 'Czas [ms]', en: 'Time [ms]' },
  dcol_calls: { pl: 'Wywołania', en: 'Calls' },
  dcol_scriptlet: { pl: 'Scriptlet', en: 'Scriptlet' },
  dcol_target: { pl: 'Przechwycona funkcja', en: 'Intercepted function' },
  dcol_totalMs: { pl: 'Łącznie [ms]', en: 'Total [ms]' },
  dcol_avgMs: { pl: 'Średnio [ms]', en: 'Average [ms]' },
  dcol_maxMs: { pl: 'Maks. [ms]', en: 'Max [ms]' },
  diag_ytStatus: { pl: 'Status:', en: 'Status:' },
  diag_ytCritical: {
    pl: 'Krytyczne reguły YouTube (scriptlety): <b>$1</b> · obsługiwane: <b>$2</b> · nieobsługiwane: <b>$3</b>',
    en: 'Critical YouTube rules (scriptlets): <b>$1</b> · supported: <b>$2</b> · unsupported: <b>$3</b>',
    html: true,
  },
  diag_ytGaps: { pl: 'Niewykonywane reguły:', en: 'Rules not executed:' },
  diag_ytPlayer: { pl: 'Ostatni stan odtwarzacza ($1):', en: 'Last player state ($1):' },
  diag_ytNoPlayer: { pl: 'Brak raportu odtwarzacza – otwórz film na YouTube.', en: 'No player report yet – open a video on YouTube.' },
  diag_compatLine: {
    pl: 'Filtry scriptletów w listach: $1 · w pełni obsługiwane: $2 · częściowo (niewykonywane): $3 · nieobsługiwane: $4',
    en: 'Scriptlet filters in the lists: $1 · fully supported: $2 · partial (not executed): $3 · unsupported: $4',
  },
  diag_noCompat: { pl: 'Brak danych (uruchom build).', en: 'No data (run the build).' },
  diag_noErrors: { pl: 'Brak błędów.', en: 'No errors.' },
  diag_frame: { pl: ' (ramka $1)', en: ' (frame $1)' },
  diag_noPerf: { pl: 'Brak pomiarów – przeładuj kilka stron.', en: 'No measurements – reload a few pages.' },
  diag_perfOff: { pl: 'Pomiary wyłączone.', en: 'Measurements are off.' },
  diag_after: { pl: 'po $1', en: 'after $1' },
  diag_noStartup: {
    pl: 'Brak pomiaru – pojawi się po instalacji, aktualizacji lub przeładowaniu rozszerzenia.',
    en: 'No measurement – it appears after the extension is installed, updated or reloaded.',
  },
  diag_noScriptletPerf: {
    pl: 'Brak pomiarów scriptletów – przeładuj kartę (np. YouTube) i odtwórz film.',
    en: 'No scriptlet measurements – reload a tab (e.g. YouTube) and play a video.',
  },
  diag_syncOk: { pl: 'Synchronizacja zakończona', en: 'Sync finished' },
  diag_syncErr: { pl: 'Synchronizacja zakończona z błędami – zobacz tabelę', en: 'Sync finished with errors – see the table' },
  diag_perfReset: { pl: 'Pomiary wyzerowane', en: 'Measurements reset' },
  diag_reportFailed: { pl: 'Nie udało się zbudować raportu', en: 'Couldn’t build the report' },
  diag_reportCopied: { pl: 'Raport skopiowany do schowka (nic nie zostało wysłane)', en: 'Report copied to the clipboard (nothing was sent)' },
  diag_reportSelect: { pl: 'Zaznaczono raport – skopiuj go ręcznie (Ctrl+C)', en: 'Report selected – copy it manually (Ctrl+C)' },

  // ── Opcje: O wtyczce ────────────────────────────────────────────────────────
  about_title: { pl: 'O wtyczce', en: 'About' },
  about_intro: { pl: 'Apex AdBlocker działa w Manifest V3 (MV3) i blokuje na trzech poziomach:', en: 'Apex AdBlocker runs on Manifest V3 (MV3) and blocks on three levels:' },
  about_network: {
    pl: '<b>Sieć</b> – żądania reklam i skryptów śledzących są blokowane regułami declarativeNetRequest.',
    en: '<b>Network</b> – requests for ads and tracking scripts are blocked with declarativeNetRequest rules.',
    html: true,
  },
  about_cosmetic: {
    pl: '<b>Ukrywanie elementów</b> – puste ramki i kontenery po reklamach są ukrywane kosmetycznie (arkusze stylów).',
    en: '<b>Element hiding</b> – empty frames and leftover ad containers are hidden cosmetically (style sheets).',
    html: true,
  },
  about_scriptlets: {
    pl: '<b>Scriptlety</b> – na stronach, które wykrywają blokery lub wplatają reklamy w odtwarzacz, Apex AdBlocker wykonuje tylko obsługiwane warianty scriptletów; pozostałe pomija.',
    en: '<b>Scriptlets</b> – on sites that detect blockers or weave ads into the player, Apex AdBlocker runs only supported scriptlet variants and skips the rest.',
    html: true,
  },
  about_limitsTitle: { pl: 'Ograniczenia', en: 'Limitations' },
  about_limits: {
    pl: 'Apex AdBlocker obsługuje podzbiór składni filtrów uBO/ABP. Części filtrów nie da się wyrazić w MV3 (np. filtrowanie HTML, nagłówki CSP, blokowanie wyskakujących okien przez sieć), a część scriptletów nie ma implementacji, więc na niektórych stronach skuteczność może być niższa niż w uBlock Origin. Apex AdBlocker nie obiecuje niewykrywalności przez strony.',
    en: 'Apex AdBlocker supports a subset of the uBO/ABP filter syntax. Some filters can’t be expressed in MV3 (e.g. HTML filtering, CSP headers, blocking pop-ups over the network) and some scriptlets aren’t implemented, so on some sites blocking may be less effective than in uBlock Origin. Apex AdBlocker doesn’t promise to be undetectable by sites.',
  },
  about_listsTitle: { pl: 'Listy filtrów', en: 'Filter lists' },
  about_lists: {
    pl: 'EasyList, EasyPrivacy (© The EasyList authors, GPLv3 / CC BY-SA 3.0), uBlock filters (© Raymond Hill i współtwórcy, GPLv3), Polskie Filtry Reklamowe (© MajkiIT, CC BY-NC-SA 4.0). Listy są wbudowane we wtyczkę – aby je odświeżyć, zobacz plik README.',
    en: 'EasyList, EasyPrivacy (© The EasyList authors, GPLv3 / CC BY-SA 3.0), uBlock filters (© Raymond Hill and contributors, GPLv3), Polish Ad Filters (© MajkiIT, CC BY-NC-SA 4.0). The lists are built into the extension – to refresh them, see the README file.',
  },
  about_stats: {
    pl: 'Aktywne: $1 filtrów sieciowych, $2 kosmetycznych, $3 scriptletów, $4 własnych.',
    en: 'Active: $1 network filters, $2 cosmetic, $3 scriptlet, $4 custom.',
  },
};
