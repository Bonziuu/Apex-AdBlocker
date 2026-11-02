# Privacy Policy — Apex AdBlocker

Publisher: **Konrad Woźniak**
Privacy contact: **support@apexsoftware.app**
Last updated: **2 November 2026**

This policy describes Apex AdBlocker version 1.0.0. Its single main purpose is blocking advertisements, tracking mechanisms and selected malicious sites while browsing websites. The extension operates in the browser, requires no account, and has no publisher-operated backend or telemetry.

## Data needed for the extension to work

The Chrome Web Store asks extensions to disclose the user data they handle, even when it is processed only on the user's device. Apex AdBlocker handles the categories below locally and only to provide its single purpose. None of this data is automatically sent to Apex Software or to anyone else.

**Web browsing activity.** The extension locally accesses the addresses and domains of open pages and their frames, including the page path and query where a filter requires it, to apply site-specific filters and site exceptions and to show the protection status. Chrome's declarativeNetRequest engine matches the network requests made by pages against the blocking rules; the extension does not receive the request addresses, only the number of matched rules for the tab where the user opens the popup. The extension does not keep a list of visited pages.

**Website content.** The extension inspects selected page elements, including CSS selectors, class names, element identifiers and text, to hide advertisements. Selected bundled filters can locally modify page-script behavior and network responses. They may also read, set or remove cookies and localStorage/sessionStorage entries accessible to the website when a filter requires this. These operations support filtering and page compatibility. The extension does not use this information to create an advertising profile or send it to the publisher. It does not use Chrome's separate browsing-history or cookies API to read browser-wide history or all cookies.

**User activity (Hide element).** The element picker runs only after the user starts it from the popup. While it is open, it temporarily processes the mouse pointer position, clicks, scrolling and the Escape key, only so that the user can point at the element to hide. These events are not logged, stored or sent. The pointer, click, keyboard and scroll listeners are removed when the tool closes. The only thing saved is the filter the user chooses to create: the site's domain and the element's CSS selector, added to the user's own filters.

Apex AdBlocker has no feature that collects passwords, payment information or account details for a publisher service. Page-content access is used to apply filters, not to conduct user analytics.

## Information retained in the browser

The browser profile stores settings, primarily domains where protection is disabled, custom filter text and the automatic-page-reload preference. Custom filters may contain domains, URLs or other information the user enters.

**Error log.** The extension keeps local component status and a log of up to 50 errors, each with a timestamp, component name and error message. Messages are stored as they occur and are not sanitized in the log, so a message can occasionally contain part of a page address. The log stays in the browser (errors are also printed to the extension's local developer console), helps diagnose extension failures, and can be cleared in Diagnostics. Sanitization is applied when the user creates a diagnostics report. The extension does not maintain a separate record of browsing history.

**YouTube diagnostics.** YouTube diagnostics temporarily retain playback status, page type and short problem reasons in memory. Reports do not retain the full video URL or video identifier. They are associated with a tab and frame, expire after 60 seconds without an update, and are removed on relevant navigation or tab closure.

**Performance measurements.** Optional performance measurements are disabled by default. When enabled, local measurements can include the domain of the page or frame, the frame identifier, counters and timings. The current list is limited to 30 reports kept in the extension's memory. Aggregated scriptlet measurements and a startup profile can be held in browser-session memory. These measurements stay in the browser and are not sent to Apex Software. Turning performance measurements off clears the accumulated performance reports in the extension.

## Transmission and sharing

Apex AdBlocker does not transmit the information described above to the publisher (Apex Software). It has no account system, no integrated analytics or telemetry, and no publisher service storing user data. It does not sell data or share it with advertisers.

Websites can still communicate with their own servers and third parties. The blocker does not guarantee that every such connection is blocked. Websites and browser services are governed by their respective providers' policies.

Filter lists and executable extension code are included in the extension package. The installed extension does not download or execute remote code. Developer tools may download updated lists before preparing a release; this is not transmission of browsing data by the installed extension.

## Chrome Web Store User Data Policy (Limited Use)

Apex AdBlocker’s use of information complies with the Chrome Web Store User Data Policy, including the Limited Use requirements. Data handled automatically by the extension is used only to provide its single purpose — blocking ads, trackers and malicious sites. The extension does not sell this data or automatically transfer it to Apex Software or third parties, and it is not used for advertising, creditworthiness or lending purposes. Humans do not read this data unless the user explicitly chooses to send a file, report or message.

## User-initiated exports

Settings export downloads a local file containing disabled domains and custom filter text, together with format, extension-version and export-time metadata. It can contain sensitive information if the user included it in custom filters. The user chooses where to keep the file and whether to share it.

A diagnostics report is generated locally and copied only at the user's request. It includes the extension version, component status, synchronization outcomes and a limited description of errors. Sanitization removes recognized addresses, tokens and other potentially identifying information from report text. Automatic sanitization cannot guarantee detection of every possible sensitive item; review the report before sharing it.

Neither export is automatically sent to the publisher. If the user independently shares a file or report outside the extension, the chosen recipient receives its contents. If the user independently emails the contact address, the publisher receives the message, sender details and any attachments in order to respond; this is not automatic extension telemetry.

## Data controls

Disabled domains and custom filters can be edited in Options. Error logs can be cleared, and performance measurements can be disabled or reset in Diagnostics. Extension data in the browser profile can be removed by uninstalling the extension or deleting the relevant browser-profile data. Previously exported files must be deleted separately.

The extension does not use `chrome.storage.sync` to transmit settings. Browser-profile or system backups made by the user or other software are outside the extension's control.

## Permissions

**declarativeNetRequest** — Chrome applies the packaged network rules, custom rules and site exceptions.

**scripting** — Runs packaged filtering scripts, inserts cosmetic CSS and starts the element picker.

**storage** — Saves user settings and bounded diagnostics locally; settings are not sent through storage.sync.

**activeTab** — For the tab where the user opens the popup, lets Chrome provide the number of matched blocking rules (shown as blocked requests) and allows actions such as starting the element picker. Chrome provides this count only for a tab granted through activeTab.

**Access to all sites (<all_urls>)** — Allows local filtering across supported pages and frames. Protected browser pages remain subject to Chrome restrictions.

## Changes and contact

This policy should be updated when data-handling behavior changes, especially before introducing communication with a publisher service. Privacy questions can be sent to the contact address above.

---

# Polityka prywatności Apex AdBlocker

Wydawca: **Konrad Woźniak**
Kontakt w sprawach prywatności: **support@apexsoftware.app**
Data aktualizacji: **2 listopada 2026 r.**

Ta polityka opisuje rozszerzenie Apex AdBlocker w wersji 1.0.0. Jego głównym celem jest blokowanie reklam, mechanizmów śledzących i wybranych złośliwych stron podczas przeglądania. Rozszerzenie działa w przeglądarce, nie wymaga konta i nie ma własnego backendu ani telemetrii.

## Dane potrzebne do działania

Chrome Web Store wymaga ujawnienia danych użytkownika, z których korzysta rozszerzenie, także wtedy, gdy są przetwarzane wyłącznie na urządzeniu użytkownika. Apex AdBlocker przetwarza poniższe kategorie lokalnie i wyłącznie w celu realizacji swojego jedynego celu. Żadne z tych danych nie są automatycznie wysyłane do Apex Software ani nikomu innemu.

**Historia online (aktywność w sieci).** Rozszerzenie uzyskuje lokalny dostęp do adresów i domen otwartych stron oraz ich ramek, w tym do ścieżki i parametrów adresu, jeżeli wymaga tego filtr, aby stosować filtry dla konkretnych stron, wyłączenia ochrony i pokazywać stan ochrony. Żądania sieciowe stron porównuje z regułami blokowania silnik declarativeNetRequest w Chrome; rozszerzenie nie otrzymuje adresów tych żądań, a jedynie liczbę dopasowanych reguł dla karty, na której użytkownik otwiera okienko rozszerzenia. Rozszerzenie nie prowadzi listy odwiedzonych stron.

**Treść witryny.** Rozszerzenie sprawdza wybrane elementy treści strony, takie jak selektory CSS, nazwy klas, identyfikatory i tekst elementów, aby ukrywać reklamy. Wybrane, wbudowane filtry mogą lokalnie modyfikować działanie skryptów strony i jej odpowiedzi sieciowych. Mogą również odczytywać, ustawiać lub usuwać dostępne dla danej strony pliki cookies i wpisy localStorage/sessionStorage, jeżeli wymaga tego filtr. Służy to realizacji filtrowania i zachowaniu zgodności strony. Rozszerzenie nie tworzy z tych danych profilu reklamowego ani nie przekazuje ich wydawcy. Nie korzysta z osobnego API Chrome do odczytywania historii przeglądania lub wszystkich plików cookies.

**Aktywność użytkownika („Ukryj element”).** Narzędzie „Ukryj element” działa wyłącznie po ręcznym uruchomieniu z okienka rozszerzenia. Gdy jest otwarte, chwilowo przetwarza pozycję kursora, kliknięcia, przewijanie i klawisz Escape — wyłącznie po to, aby użytkownik mógł wskazać element do ukrycia. Te zdarzenia nie są logowane, zapisywane ani wysyłane. Nasłuchy kursora, kliknięć, klawiatury i przewijania są usuwane po zamknięciu narzędzia. Zapisywany jest wyłącznie filtr, który użytkownik sam utworzy: domena strony i selektor CSS elementu, dodane do własnych filtrów.

Apex AdBlocker nie ma funkcji zbierania haseł, danych płatniczych lub danych kont na potrzeby własnej usługi. Dostęp do zawartości stron jest wykorzystywany do działania filtrów, a nie do prowadzenia analityki użytkownika.

## Co pozostaje w przeglądarce

W profilu przeglądarki zapisywane są ustawienia, przede wszystkim domeny z wyłączoną ochroną, własne filtry oraz preferencja automatycznego odświeżania strony. Własne filtry mogą zawierać domeny, adresy lub inne informacje, które użytkownik sam wpisze.

**Dziennik błędów.** Rozszerzenie przechowuje lokalny stan komponentów i dziennik do 50 błędów, z których każdy zawiera czas, nazwę komponentu i komunikat błędu. Komunikaty są zapisywane w chwili wystąpienia i nie są oczyszczane w dzienniku, dlatego komunikat może przypadkowo zawierać fragment adresu strony. Dziennik pozostaje w przeglądarce (błędy są też wypisywane w lokalnej konsoli deweloperskiej rozszerzenia), pomaga wykrywać problemy z działaniem rozszerzenia i można go wyczyścić w diagnostyce. Sanityzacja jest wykonywana przy tworzeniu raportu diagnostycznego przez użytkownika. Nie jest prowadzony osobny dziennik historii odwiedzanych stron.

**Diagnostyka YouTube.** Diagnostyka YouTube zapisuje przejściowo w pamięci status odtwarzacza, rodzaj strony i krótkie powody problemów. Raporty nie zapisują pełnego adresu filmu ani jego identyfikatora. Są przypisane do karty i ramki; wygasają po 60 sekundach bez odświeżenia oraz są usuwane przy odpowiedniej nawigacji lub zamknięciu karty.

**Pomiary wydajności.** Opcjonalne pomiary wydajności są domyślnie wyłączone. Po ich włączeniu lokalne dane mogą obejmować domenę strony lub ramki, identyfikator ramki, liczniki i czasy wykonania. Bieżąca lista takich raportów jest ograniczona do 30 wpisów przechowywanych w pamięci rozszerzenia. Zagregowane pomiary scriptletów i profil startu mogą być przechowywane w pamięci sesji przeglądarki. Pomiary pozostają w przeglądarce i nie są wysyłane do Apex Software. Wyłączenie pomiarów usuwa zgromadzone raporty wydajności w rozszerzeniu.

## Wysyłanie i udostępnianie danych

Apex AdBlocker nie wysyła opisanych danych do wydawcy (Apex Software). Nie ma kont użytkowników, zintegrowanej analityki ani telemetrii, ani własnej usługi przechowującej dane użytkowników. Rozszerzenie nie sprzedaje danych i nie udostępnia ich reklamodawcom.

Strony internetowe nadal mogą komunikować się ze swoimi serwerami i podmiotami trzecimi. Bloker nie gwarantuje zablokowania wszystkich takich połączeń. Działanie samych stron oraz usług przeglądarki jest objęte zasadami ich dostawców.

Listy filtrów i kod wykonywany przez rozszerzenie znajdują się w jego paczce. Zainstalowane rozszerzenie nie pobiera ani nie wykonuje zdalnego kodu. Narzędzia deweloperskie mogą pobierać nowe listy przed przygotowaniem wydania; nie jest to przekazywanie danych z przeglądania przez zainstalowane rozszerzenie.

## Zasady Chrome Web Store dotyczące danych użytkownika (Limited Use)

Sposób, w jaki Apex AdBlocker korzysta z informacji, jest zgodny z zasadami Chrome Web Store dotyczącymi danych użytkownika (Chrome Web Store User Data Policy), w tym z wymogami ograniczonego użytkowania (Limited Use). Dane automatycznie przetwarzane przez rozszerzenie służą wyłącznie realizacji jego jedynego celu — blokowaniu reklam, mechanizmów śledzących i złośliwych stron. Rozszerzenie nie sprzedaje tych danych ani nie przekazuje ich automatycznie Apex Software lub osobom trzecim i nie używa ich do reklam, oceny zdolności kredytowej ani w celach pożyczkowych. Ludzie nie odczytują tych danych, chyba że użytkownik sam zdecyduje się przesłać plik, raport lub wiadomość.

## Eksport wykonywany przez użytkownika

Eksport ustawień pobiera lokalny plik zawierający domeny z wyłączoną ochroną i treść własnych filtrów. Plik zawiera też informacje o formacie, wersji rozszerzenia i czasie eksportu. Może zawierać informacje wrażliwe, jeżeli użytkownik umieścił je we własnych filtrach. Użytkownik wybiera, gdzie przechowuje plik i komu go przekazuje.

Raport diagnostyczny jest tworzony lokalnie i kopiowany na żądanie użytkownika. Zawiera wersję rozszerzenia, stan komponentów, wyniki synchronizacji i ograniczony opis błędów. Mechanizm sanityzacji usuwa rozpoznawane adresy, tokeny i inne potencjalnie identyfikujące informacje z tekstu raportu. Automatyczne oczyszczanie nie daje gwarancji wykrycia każdej możliwej informacji, dlatego przed udostępnieniem należy przejrzeć treść raportu.

Żaden z tych eksportów nie jest automatycznie wysyłany do wydawcy. Jeżeli użytkownik sam udostępni plik lub raport poza rozszerzeniem, wybrany odbiorca otrzyma jego treść. Jeśli użytkownik sam napisze na podany adres kontaktowy, wydawca otrzyma wiadomość, dane nadawcy oraz przekazane załączniki, aby udzielić odpowiedzi; nie jest to automatyczna telemetria rozszerzenia.

## Kontrola danych

Domeny wyłączone z ochrony i własne filtry można edytować w opcjach. Dziennik błędów można wyczyścić, a pomiary wydajności wyłączyć lub wyzerować w diagnostyce. Dane rozszerzenia zapisane w profilu można usunąć przez usunięcie rozszerzenia lub odpowiednich danych profilu przeglądarki. Wyeksportowane wcześniej pliki trzeba usunąć osobno.

Rozszerzenie nie korzysta z `chrome.storage.sync` do przesyłania ustawień. Kopie profilu przeglądarki lub systemu utworzone przez użytkownika albo inne oprogramowanie pozostają poza kontrolą rozszerzenia.

## Uprawnienia

**declarativeNetRequest** — Chrome stosuje dołączone reguły sieciowe, reguły własne i wyłączenia stron.

**scripting** — Uruchamia dołączone skrypty filtrujące, wstawia kosmetyczny CSS i uruchamia picker elementów.

**storage** — Zapisuje lokalnie ustawienia i ograniczoną diagnostykę; ustawienia nie są przesyłane przez storage.sync.

**activeTab** — Dla karty, na której użytkownik otwiera okienko rozszerzenia, pozwala Chrome przekazać liczbę dopasowanych reguł blokowania (pokazywaną jako zablokowane żądania) i umożliwia działania, takie jak uruchomienie pickera elementów. Chrome udostępnia tę liczbę tylko dla karty z dostępem przyznanym przez activeTab.

**Dostęp do wszystkich stron (<all_urls>)** — Umożliwia lokalne filtrowanie obsługiwanych stron i ramek. Chronione strony przeglądarki nadal podlegają ograniczeniom Chrome.

## Zmiany i kontakt

Polityka powinna być aktualizowana przy zmianach sposobu przetwarzania danych, w szczególności przed dodaniem jakiejkolwiek komunikacji z usługą wydawcy. Pytania dotyczące prywatności można kierować na podany wyżej adres kontaktowy.
