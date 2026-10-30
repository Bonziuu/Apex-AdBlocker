# Privacy Policy — Apex AdBlocker

Publisher: **Konrad Woźniak**
Privacy contact: **konrad.wozniak.1996@gmail.com**
Last updated: **30 October 2026**

This policy describes Apex AdBlocker version 1.0.0. Its single main purpose is blocking advertisements and tracking mechanisms while browsing websites. The extension operates in the browser, requires no account, and has no publisher-operated backend or telemetry.

## Data needed for the extension to work

The extension locally accesses the addresses and domains of open pages and network-request information needed to apply blocking rules and display protection status. It also inspects selected page elements, including CSS selectors, class names, element identifiers and text, to hide advertisements. The element picker uses the element selected by the user to create a filter.

Selected bundled filters can locally modify page-script behavior and network responses. They may also read, set or remove cookies and localStorage/sessionStorage entries accessible to the website when a filter requires this. These operations support filtering and page compatibility. The extension does not use this information to create an advertising profile or send it to the publisher. It does not use Chrome's separate browsing-history or cookies API to read browser-wide history or all cookies.

Apex AdBlocker has no feature that collects passwords, payment information or account details for a publisher service. Page-content access is used to apply filters, not to conduct user analytics.

## Information retained in the browser

The browser profile stores settings, primarily domains where protection is disabled, custom filter text and the automatic-page-reload preference. Custom filters may contain domains, URLs or other information the user enters.

The extension also keeps local component status and a bounded log of up to 50 errors, including timestamps, component names and messages. This information helps diagnose extension failures. It does not maintain a separate record of browsing history.

YouTube diagnostics temporarily retain playback status, page type and short problem reasons in memory. Reports do not retain the full video URL or video identifier. They are associated with a tab and frame, expire after 60 seconds without an update, and are removed on relevant navigation or tab closure.

Optional performance measurements are disabled by default. When enabled, local measurements can include the page domain, frame identifier, counters and timings. The current list is limited to 30 reports. Aggregated scriptlet measurements and a startup profile can be held in browser-session memory. Turning performance measurements off clears the accumulated performance reports in the extension.

## Transmission and sharing

Apex AdBlocker does not transmit the information described above to the publisher. It has no integrated analytics or publisher service storing user data. It does not sell data or share it with advertisers.

Websites can still communicate with their own servers and third parties. The blocker does not guarantee that every such connection is blocked. Websites and browser services are governed by their respective providers' policies.

Filter lists and executable extension code are included in the extension package. Developer tools may download updated lists before preparing a release; this is not transmission of browsing data by the installed extension.

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

**activeTab** — Enables actions and available blocking statistics for the tab selected by the user when opening the popup.

**Access to all sites (<all_urls>)** — Allows local filtering across supported pages and frames. Protected browser pages remain subject to Chrome restrictions.

## Changes and contact

This policy should be updated when data-handling behavior changes, especially before introducing communication with a publisher service. Privacy questions can be sent to the contact address above.

---

# Polityka prywatności Apex AdBlocker

Wydawca: **Konrad Woźniak**
Kontakt w sprawach prywatności: **konrad.wozniak.1996@gmail.com**
Data aktualizacji: **30 października 2026 r.**

Ta polityka opisuje rozszerzenie Apex AdBlocker w wersji 1.0.0. Jego głównym celem jest blokowanie reklam i mechanizmów śledzących podczas przeglądania stron. Rozszerzenie działa w przeglądarce, nie wymaga konta i nie ma własnego backendu ani telemetrii.

## Dane potrzebne do działania

Rozszerzenie uzyskuje lokalny dostęp do adresów i domen otwartych stron oraz do informacji o żądaniach sieciowych potrzebnych do zastosowania reguł blokowania i pokazania stanu ochrony. Sprawdza również wybrane elementy treści strony, takie jak selektory CSS, nazwy klas, identyfikatory i tekst elementów, aby ukrywać reklamy. Picker „Ukryj element” korzysta z elementu wskazanego przez użytkownika do utworzenia filtra.

Wybrane, wbudowane filtry mogą lokalnie modyfikować działanie skryptów strony i jej odpowiedzi sieciowych. Mogą również odczytywać, ustawiać lub usuwać dostępne dla danej strony pliki cookies i wpisy localStorage/sessionStorage, jeżeli wymaga tego filtr. Służy to realizacji filtrowania i zachowaniu zgodności strony. Rozszerzenie nie tworzy z tych danych profilu reklamowego ani nie przekazuje ich wydawcy. Nie korzysta z osobnego API Chrome do odczytywania historii przeglądania lub wszystkich plików cookies.

Apex AdBlocker nie ma funkcji zbierania haseł, danych płatniczych lub danych kont na potrzeby własnej usługi. Dostęp do zawartości stron jest wykorzystywany do działania filtrów, a nie do prowadzenia analityki użytkownika.

## Co pozostaje w przeglądarce

W profilu przeglądarki zapisywane są ustawienia, przede wszystkim domeny z wyłączoną ochroną, własne filtry oraz preferencja automatycznego odświeżania strony. Własne filtry mogą zawierać domeny, adresy lub inne informacje, które użytkownik sam wpisze.

Rozszerzenie przechowuje także lokalny stan komponentów i ograniczony dziennik do 50 błędów, zawierający czas, nazwę komponentu i komunikat. Dane pomagają wykrywać problemy z działaniem rozszerzenia. Nie jest prowadzony osobny dziennik historii odwiedzanych stron.

Diagnostyka YouTube zapisuje przejściowo w pamięci status odtwarzacza, rodzaj strony i krótkie powody problemów. Raporty nie zapisują pełnego adresu filmu ani jego identyfikatora. Są przypisane do karty i ramki; wygasają po 60 sekundach bez odświeżenia oraz są usuwane przy odpowiedniej nawigacji lub zamknięciu karty.

Opcjonalne pomiary wydajności są domyślnie wyłączone. Po ich włączeniu lokalne dane mogą obejmować domenę strony, identyfikator ramki, liczniki i czasy wykonania. Bieżąca lista takich raportów jest ograniczona do 30 wpisów. Zagregowane pomiary scriptletów i profil startu mogą być przechowywane w pamięci sesji przeglądarki. Wyłączenie pomiarów usuwa zgromadzone raporty wydajności w rozszerzeniu.

## Wysyłanie i udostępnianie danych

Apex AdBlocker nie wysyła opisanych danych do wydawcy, nie ma zintegrowanej analityki ani własnej usługi przechowującej dane użytkowników. Rozszerzenie nie sprzedaje danych i nie udostępnia ich reklamodawcom.

Strony internetowe nadal mogą komunikować się ze swoimi serwerami i podmiotami trzecimi. Bloker nie gwarantuje zablokowania wszystkich takich połączeń. Działanie samych stron oraz usług przeglądarki jest objęte zasadami ich dostawców.

Listy filtrów i kod wykonywany przez rozszerzenie znajdują się w jego paczce. Narzędzia deweloperskie mogą pobierać nowe listy przed przygotowaniem wydania; nie jest to przekazywanie danych z przeglądania przez zainstalowane rozszerzenie.

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

**activeTab** — Umożliwia działania i dostępne statystyki blokowania dla karty wskazanej przez użytkownika przy otwarciu popupu.

**Dostęp do wszystkich stron (<all_urls>)** — Umożliwia lokalne filtrowanie obsługiwanych stron i ramek. Chronione strony przeglądarki nadal podlegają ograniczeniom Chrome.

## Zmiany i kontakt

Polityka powinna być aktualizowana przy zmianach sposobu przetwarzania danych, w szczególności przed dodaniem jakiejkolwiek komunikacji z usługą wydawcy. Pytania dotyczące prywatności można kierować na podany wyżej adres kontaktowy.
