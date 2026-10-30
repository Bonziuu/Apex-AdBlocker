# Chrome Web Store — cel, uprawnienia i deklaracje prywatności

Materiały do przepisania do panelu wydawcy po sprawdzeniu aktualnych pól. Opierają się na kodzie wersji 1.0.0. Nie są potwierdzeniem akceptacji przez sklep. Formularz i zasady Chrome Web Store trzeba sprawdzić w dniu zgłoszenia; podanych niżej stron nie zweryfikowano na żywo podczas przygotowania tego dokumentu.

## Jeden główny cel / Single purpose

**PL:** Blokowanie reklam i mechanizmów śledzących podczas przeglądania stron, z lokalnymi regułami sieciowymi, ukrywaniem elementów reklamowych i możliwością wyłączenia ochrony dla wybranych domen.

**EN:** Blocking advertisements and tracking mechanisms while browsing websites, using local network rules, cosmetic filtering and per-domain protection controls.

Pozostałe funkcje — własne filtry, picker, diagnostyka, backup — służą temu celowi. Nie opisuj produktu jako antywirusa ani gwarancji bezpieczeństwa lub usunięcia wszystkich reklam.

## Uzasadnienia uprawnień

| Uprawnienie | Tekst PL | Tekst EN |
|---|---|---|
| `declarativeNetRequest` | Umożliwia przeglądarce stosowanie dołączonych reguł blokujących reklamy i śledzenie oraz reguł własnych i wyjątków ustawionych przez użytkownika. | Allows the browser to apply bundled ad/tracker-blocking rules, custom user rules and protection exceptions. |
| `scripting` | Służy do wstrzykiwania CSS ukrywającego elementy reklamowe, rejestrowania dołączonych scriptletów oraz uruchamiania pickera po działaniu użytkownika. | Inserts cosmetic CSS, registers packaged filtering scriptlets and starts the element picker after the user's action. |
| `storage` | Zapisuje lokalnie ustawienia, własne filtry i domeny z wyłączoną ochroną, a także ograniczony stan diagnostyczny. Rozszerzenie nie korzysta z `storage.sync`. | Stores settings, custom filters, disabled domains and bounded diagnostic state locally. The extension does not use `storage.sync`. |
| `activeTab` | Umożliwia działanie funkcji okienka na karcie wskazanej przez użytkownika, w tym wyświetlanie dostępnych statystyk dopasowanych reguł oraz obsługę działań na bieżącej stronie. | Supports popup functions on the tab selected by the user, including available matched-rule statistics and actions for the current page. |
| Dostęp do witryn: `<all_urls>` | Reklamy i śledzenie występują na wielu witrynach. Stały dostęp do obsługiwanych stron pozwala filtrować dokumenty i ramki oraz stosować filtry użytkownika. Scriptlety w głównym dokumencie startują na początku ładowania; w ramkach po sprawdzeniu stanu ochrony strony nadrzędnej. Przetwarzanie odbywa się lokalnie; adresy i treści stron nie są przekazywane wydawcy. | Ads and trackers appear across many websites. Persistent site access enables document and frame filtering and custom filters. Main-document scriptlets run at document start; frame scriptlets run after checking protection for the top-level site. Processing is local; page addresses and content are not sent to the publisher. |

`<all_urls>` nie oznacza obejścia ograniczeń Chrome: strony wewnętrzne i inne chronione lokalizacje nadal podlegają ograniczeniom przeglądarki. Samo `activeTab` nie zastąpi działania blokera przed kliknięciem ikony.

## Kod zdalny / Remote code

**PL:** Wszystkie skrypty wykonywane przez rozszerzenie są dołączone do paczki. Rozszerzenie nie pobiera z serwera kodu JavaScript do wykonania. Listy tekstowe są aktualizowane narzędziem deweloperskim i kompilowane przed utworzeniem nowej paczki; zainstalowana wersja korzysta z zawartych w niej artefaktów. Nie używa zdalnych skryptów ani fontów do interfejsu.

**EN:** All executable extension scripts are packaged with the extension. The installed extension does not download JavaScript for execution. Text filter lists are refreshed by developer tooling and compiled before building a new package; the installed version uses its bundled artifacts. The interface does not load remote scripts or fonts.

W formularzu dotyczącym kodu zdalnego opisz powyższe działanie. Nie utożsamiaj samej nazwy „scriptlet” ze zdalnym kodem. Po zmianie mechanizmu aktualizacji lub ładowania skryptów ponownie sprawdź deklarację.

## Dane: lokalny dostęp a przekazanie poza urządzenie

Brak telemetrii nie oznacza braku dostępu do danych. **Nie zaznaczaj automatycznie „brak danych” tylko dlatego, że rozszerzenie nie ma backendu.** Odpowiedź zależy od aktualnej definicji zbierania i używania danych w formularzu sklepu. Przejrzyj w nim wszystkie kategorie i ujawnij lokalne użycie, jeżeli pole tego wymaga.

| Obszar danych | Faktyczny zakres |
|---|---|
| Aktywność/adresy stron | Bieżące adresy i domeny są używane lokalnie do doboru filtrów, wyłączeń i stanu popupu. Nie ma API odczytu pełnej historii ani osobnego dziennika historii. |
| Zawartość witryn | Kosmetyka sprawdza wybrane elementy DOM, nazwy klas/id i tekst; picker używa wskazanego elementu; scriptlety mogą filtrować odpowiedzi i zachowanie kodu strony. |
| Cookies i pamięć witryny | Wybrane dołączone filtry mogą odczytywać lub modyfikować cookies dostępne dla strony oraz jej localStorage/sessionStorage. To lokalne działanie filtra; nie eksport do wydawcy. |
| Ustawienia | `disabledSites`, `userFilters`, preferencja reload i włączenie diagnostyki są lokalne. Tekst własnych filtrów może zawierać dane wpisane przez użytkownika. |
| Diagnostyka | Lokalny ograniczony dziennik błędów i stan komponentów; krótkotrwałe raporty YouTube; opcjonalne czasy/liczniki i domeny w pomiarach wydajności. |
| Eksport użytkownika | Plik backupu zawiera domeny i pełny tekst własnych filtrów. Kopiowany raport diagnostyczny jest sanityzowany, ale użytkownik powinien sprawdzić go przed ręcznym udostępnieniem. |
| Przekazanie do wydawcy | Brak automatycznej transmisji, backendu, kont i analityki w runtime. Dobrowolne wysłanie pliku przez użytkownika poza aplikacją jest odrębną czynnością. |

Deklaracje dotyczące sprzedaży danych i używania ich do reklam muszą odpowiadać rzeczywistym praktykom wydawcy, nie tylko kodowi. Przejrzany runtime takich funkcji nie zawiera. Nie deklaruj, że rozszerzenie nigdy nie odczytuje danych strony albo cookies.

## Polityka prywatności do opublikowania

Projekty tekstu: `privacy-policy-pl.md` i `privacy-policy-en.md`.

Wydawca wskazany przez autora: **Konrad Woźniak**. Publiczny kontakt: **konrad.wozniak.1996@gmail.com**. Profil autora: https://www.linkedin.com/in/konrad-woźniak-23a5b831a. W `submission.json` wskazano publiczny adres `https://github.com/Bonziuu/Apex-AdBlocker/blob/main/PRIVACY.md`. Poprawioną treść opublikowano na `main` i sprawdzono po publikacji. Wpisz ten adres do panelu sklepu i przed zgłoszeniem upewnij się, że polityka nadal odpowiada wysyłanej wersji. Lokalne zmiany Markdown lub HTML wymagają osobnego opublikowania, aby zmienić publiczną treść.

Jeśli przyszła witryna polityki będzie używać własnej analityki, formularzy lub cookies, trzeba opisać także sposób przetwarzania przez tę witrynę. Ten projekt dotyczy rozszerzenia, a nie nieistniejącego jeszcze serwisu wydawcy.

Link kontaktowy oraz profil autora są otwierane po kliknięciu użytkownika. Nie wysyłają automatycznie raportu diagnostycznego, filtrów ani informacji o przeglądanych stronach. Korzystanie z wybranej usługi poczty, GitHuba lub LinkedIn podlega zasadom tej usługi.

## Praktyczne przepisanie do formularza

1. Skopiuj jeden opis głównego celu z wybranej wersji językowej wpisu; nie przedstawiaj diagnostyki lub kontaktu jako odrębnej funkcji zbierania danych.
2. Dla każdego z czterech uprawnień i dostępu `<all_urls>` użyj odpowiedniego uzasadnienia z tabeli. Nie dodawaj uprawnień do paczki tylko dlatego, że panel pokazuje dodatkowe pola.
3. Dla pytania o kod zdalny opisz dołączony kod i listy kompilowane przed wydaniem. Aktualny runtime nie pobiera kodu do wykonania.
4. Przejdź przez bieżące definicje kategorii danych w panelu z powyższą tabelą zakresu użycia. Nie kopiuj ogólnej deklaracji „brak danych” w miejsce wymaganej informacji o lokalnym dostępie.
5. Oświadczenia o sprzedaży, przekazywaniu i celu wykorzystania danych zatwierdź zgodnie z rzeczywistymi praktykami autora oraz treścią polityki.

Komplet plików do wybrania w panelu opisano w [checkliście zgłoszenia](SUBMISSION-CHECKLIST.pl.md).

## Dowody w repozytorium

- `manifest.json`: żądane uprawnienia i host access.
- `background.js`: `fetchJSON()` korzysta z `chrome.runtime.getURL`; ustawienia, raporty, eksport i statystyki.
- `content/cosmetic.js`: lokalne pobieranie tokenów DOM i komunikacja wewnątrz rozszerzenia.
- `tools/scriptlets-lib.js`: kod dołączany do paczki, w tym lokalne operacje na cookies/pamięci stron.
- `background/health.js`: ograniczenie błędów do 50 wpisów.
- `youtube/player-reports.js`: TTL 60 sekund, tab/frame scope, brak pełnego URL i ID filmu w raporcie.
- `shared/settings-backup.js`: dokładny zakres backupu v2.
- `background/diagnostics-report.js`: ograniczony model raportu i sanityzacja tekstów.
- `options/options.js`: eksport pliku i kopiowanie raportu dopiero po działaniu użytkownika.

## Oficjalne punkty odniesienia

Sprawdź aktualną treść przed zgłoszeniem:

- [Chrome Web Store — program policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Chrome Web Store — user data policy](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq/)
- [Chrome Web Store — privacy practices](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/)
- [Chrome extensions — declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)
- [Manifest V3 — remotely hosted code](https://developer.chrome.com/docs/extensions/develop/migrate/remote-hosted-code)

Ten dokument nie dodaje nowych uprawnień, nie publikuje polityki i nie wysyła zgłoszenia do sklepu.
