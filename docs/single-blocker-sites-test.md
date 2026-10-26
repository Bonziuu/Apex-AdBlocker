# Test jednego blockera na prawdziwych stronach

Porównuje **bez ChromeBlock** (kontrola) i **z ChromeBlock** (stały zestaw list ads, privacy, security) na 53 stronach i osobno na YouTube. Wymaga internetu, więc uruchamia się lokalnie (Windows/Chrome). Zastępuje historyczny test trybów (`docs/protection-modes-test.md`), którego wyniki nie są wiarygodnym benchmarkiem: tryby zostawiały stronę w różnym stanie zgody na cookies.

## Uruchomienie

- **Windows, dwuklik:** `test-sites.cmd` (skrót do `test-chromeblock.cmd --sites`).
- **Repozytorium:** `npm run test:sites`

| Opcja | Działanie |
|---|---|
| `--limit 10` | tylko 10 pierwszych stron |
| `--only onet.pl,wp.pl` | tylko wybrane strony |
| `--no-youtube` | bez YouTube |
| `--no-screenshots` | bez zrzutów |
| `--headless` | bez okna przeglądarki |

Dwie przeglądarki Playwright Chromium w jednorazowych profilach, okno 1366×800, `pl-PL`. Każda strona jest otwierana zaraz po sobie w obu konfiguracjach. Corpus: `tests/local/sites-single-blocker.json` (ten sam co w historycznym testerze, plus `knownCases`).

## Zgoda na cookies (CMP)

Przed pomiarem ta sama procedura w obu konfiguracjach:

1. Wykryj widoczny baner zgody: znane kontenery (OneTrust, Cookiebot, Funding Choices, Quantcast, Didomi, Sourcepoint, `role=dialog`, `aria-modal`…) albo duża stała warstwa z tekstem o cookies/zgodzie/RODO. Sprawdzane są też ramki CMP.
2. Jest bezpośrednie odrzucenie → kliknij je. Tylko pełne, jednoznaczne teksty: „Odrzuć”, „Odrzuć wszystko”, „Odrzucam”, „Odrzucam i chcę dowiedzieć się więcej” (WP, o2), „Nie zgadzam się”, „Tylko niezbędne”, „Reject all”, „Decline”, „Only necessary”… – bez dopasowania „zawiera słowo odrzuć”.
3. Brak odrzucenia, ale **wewnątrz kontenera CMP** jest jednoznaczny przycisk ustawień z whitelisty → kliknij go: „Ustawienia zaawansowane”, „Ustawienia prywatności”, „Ustawienia preferencji”, „Ustawienia cookies”, „Zarządzaj ustawieniami/preferencjami/opcjami”, „Pokaż cele”, „Manage options/preferences/settings”, „Privacy settings”, „Cookie settings”. Takie same teksty poza banerem nie są klikane.
4. Wykryj baner ponownie i szukaj odrzucenia. Łącznie maksymalnie 3 kliknięcia.
5. Brak bezpiecznej ścieżki → `unresolved`.

Nigdy nie klikamy: akceptacji („Akceptuję”, „Akceptuję wszystko”), „Przejdź do serwisu” (może oznaczać zgodę), „Kontynuuj”, logowania, rejestracji, subskrypcji, płatności ani linków nawigujących.

Dla `unresolved` wynik zawiera krótką diagnostykę (`consent.diagnostics`): teksty widocznych akcji w CMP (do 12), czy było bezpośrednie odrzucenie, czy był krok ustawień, wykonane kroki, ramka (`main` / `iframe:host`) i powód, np. „po otwarciu ustawień brak bezpiecznego odrzucenia”.

Stan: `none` (brak banera), `rejected` (odrzucono), `unresolved` (tylko akceptacja, brak odrzucenia albo baner nie znika). Do automatycznego porównania reklam kwalifikuje się tylko ten sam stan w obu konfiguracjach: `none` + `none` albo `rejected` + `rejected`. Różny stan (`none` vs `rejected`, w dowolnej kolejności) albo `unresolved` w którejkolwiek konfiguracji → **CONSENT_INCONCLUSIVE** (nie breakage) i strona nie wchodzi do zbiorczych metryk reklam (np. „różny stan zgody: none vs rejected – reklamy nie są porównywane”). Baner zgody nie jest liczony jako reklama ani anti-adblock.

## Co jest mierzone

- **Ładowanie:** status HTTP, błąd/timeout nawigacji, ilość widocznej treści, `main`/`article`, pusta strona.
- **Reklamy** (klasy osobno): `REAL_AD` (widoczny slot z obrazem/wideo/iframe z hosta reklamowego), `EMPTY_AD_SLOT` (slot z etykietą lub selektorem reklamowym bez treści), `LABEL_ONLY` (sama etykieta „Reklama” bez slotu), `SITE_PROMO` („Materiał partnera” linkujący do tej samej strony), `UNKNOWN`. „Ta sama strona” = ta sama domena rejestrowalna (`siteOf`, z sufiksami `com.pl`, `net.pl`, `org.pl`, `co.uk`, `com.au`, `co.jp`) – jedna funkcja w Node i w stronie. Plus żądania do hostów reklamowych (wczytane/wszystkie) i żądania zablokowane (`ERR_BLOCKED_BY_CLIENT`). Link „Reklama” w stopce/menu się nie liczy.
- **Breakage względem kontroli:** pusta strona, treść < 30% kontroli, zniknięcie `main`, menu, niedziałający link z menu, wyszukiwarka, zniknięcie odtwarzacza, poziome przewijanie, blokada przewijania. **Błędy JS same w sobie nie są breakage** – w raporcie tylko jako informacja (Filmweb, Guardian).
- **Challenge** (CAPTCHA, „nie jestem robotem”, Cloudflare): w obu konfiguracjach – nie przypisujemy ChromeBlock (Allegro); tylko z ChromeBlock – do ręcznego sprawdzenia, czy się powtarza (Forbes).
- **Anti-adblock:** komunikat widoczny tylko z ChromeBlock.

## Statusy (wskazówka, nie ręczna ocena)

Kolejność: `SITE_ERROR` > `BOT_CHALLENGE` > `BREAKAGE` > `ANTI_ADBLOCK` > `CONSENT_INCONCLUSIVE` > `REAL_AD` > `EMPTY_AD_SLOT` > `MANUAL_REVIEW` > `PASS`.

YouTube (obie konfiguracje): player i wideo, postęp odtwarzania, Shorts, seek A/B z kontrolą, reklama w playerze, anti-adblock, YouTube Protection i bramka zgodności 30/30. Brak okazji reklamowej → `INCONCLUSIVE`, nie PASS. Seek zepsuty także bez ChromeBlock → `INCONCLUSIVE`.

## Raport

`tests/local/results/sites/` (paczka: `wyniki-testu\sites\`):

- `latest.html` – podsumowanie none → ChromeBlock, zrzuty **BEZ ChromeBlock | Z ChromeBlock** obok siebie, dane obu konfiguracji, znane przypadki, ręczna ocena (zapamiętywana w przeglądarce) i **Eksportuj oceny (JSON)**;
- `latest.txt`, `latest.json`;
- `shots/` – zrzuty JPEG 1366×800 (`NN-host-none.jpg`, `NN-host-chromeblock.jpg`).

Wyniki zostają lokalnie i nie są commitowane.

## Testy w CI (bez internetu)

`tests/tools/single-blocker-sites.test.mjs`: logika ocen oraz pełny przebieg w Chromium na lokalnych atrapach (`ctx.route`): reklama, reklama w iframe, pusty slot, materiał promocyjny, CMP z odrzuceniem i tylko z akceptacją (akceptacja nigdy nie jest klikana), anti-adblock, pusta strona, challenge w obu i tylko z ChromeBlock, błąd 503, menu/wyszukiwarka/main z błędami JS, raport HTML/TXT/JSON i zrzuty.
