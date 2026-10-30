# Polityka prywatności Apex AdBlocker — projekt do publikacji

**Status: projekt do przeglądu wydawcy i opublikowania pod publicznym adresem HTTPS.**

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
