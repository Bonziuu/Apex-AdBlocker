# Apex AdBlocker — technical overview

Ten dokument opisuje techniczne założenia Apex AdBlocker bez wchodzenia w historię kolejnych eksperymentów produktu.

## Architektura

Apex AdBlocker jest rozszerzeniem Manifest V3. Główne warstwy:

- `background.js`, `background/` — service worker, stan rozszerzenia, synchronizacja reguł i diagnostyka,
- `shared/parser.js` — parser obsługiwanego podzbioru składni ABP/uBO,
- `content/cosmetic.js` — filtry kosmetyczne, ogólne i proceduralne,
- `content/picker.js` — interaktywny picker elementów,
- `youtube/` — zgodność i lokalna diagnostyka odtwarzacza,
- `rules/`, `data/`, `scriptlets/` — artefakty generowane podczas buildu,
- `tools/` — build, update list, audyty, packaging i test tooling.

## Blokowanie sieciowe

Filtry sieciowe są kompilowane do reguł `declarativeNetRequest`.

Parser obsługuje tylko semantykę, którą Apex AdBlocker potrafi odwzorować poprawnie w MV3. Konstrukcje nieobsługiwane są pomijane zamiast wykonywane częściowo.

To samo podejście jest stosowane w scriptletach: nieznany scriptlet albo nieobsługiwany wariant argumentów nie jest uruchamiany.

Część reguł nie blokuje żądania, tylko podmienia je na nieszkodliwą atrapę z `web_accessible_resources/` (np. `adsbygoogle.js`), żeby strona nie przestała działać. Te pliki są dostępne wyłącznie pod losowym adresem sesji (`use_dynamic_url`), więc strona nie może wykryć rozszerzenia, odpytując stały adres `chrome-extension://<id>/...`. Przekierowania reguł działają bez zmian (sprawdzone w Chrome; test: `tests/network/war-dynamic-url.test.mjs`).

## Kosmetyka

Warstwa kosmetyczna obsługuje klasyczne selektory CSS oraz wybrany podzbiór filtrów proceduralnych, m.in.:

- `:has-text()`,
- `:upward()`,
- `:remove()`,
- `:style()`,
- `:matches-path()`,
- `:min-text-length()`.

Ogólne selektory są dobierane na podstawie tokenów z aktualnego DOM, zamiast ładowania wszystkich możliwych reguł na każdej stronie.

## Scriptlety

Apex AdBlocker ma własne implementacje wybranych scriptletów używanych przez upstreamowe listy filtrów.

Build generuje raport zgodności:

```bash
npm run audit:scriptlets
```

Filtry dzielą się na:

- obsługiwane,
- częściowo rozpoznane, ale niewykonywane dla nieobsługiwanego wariantu,
- nieobsługiwane i niewykonywane.

Celem nie jest pełna kompatybilność z uBlock Origin, tylko przewidywalne i testowalne zachowanie w ramach wspieranego podzbioru.

## YouTube Protection

YouTube korzysta z tego samego silnika DNR, kosmetyki i scriptletów co pozostałe strony.

Dodatkowa warstwa `youtube/` odpowiada za:

- wykrywanie krytycznych filtrów YouTube podczas buildu,
- kontrolę, czy ich semantyka jest obsługiwana,
- ocenę stanu rejestracji scriptletów,
- lokalną diagnostykę odtwarzacza,
- raporty per karta/ramka z wygasaniem i czyszczeniem po nawigacji.

Jeżeli po aktualizacji list pojawi się nowy krytyczny filtr YouTube, którego Apex AdBlocker nie rozumie, build może zostać zatrzymany zamiast wypuścić niezweryfikowaną zmianę.

## Prywatność i diagnostyka

Apex AdBlocker nie ma telemetrii ani backendu.

Stan diagnostyczny jest lokalny. Raport eksportowany przez użytkownika jest sanityzowany z danych takich jak pełne URL-e, cookies, tokeny, adresy e-mail i identyfikatory filmów.

Service worker przyjmuje od skryptów treści (działających na każdej stronie) tylko wiadomości kosmetyki, YouTube, pomiarów i „Ukryj element”. Zmiana ustawień, import kopii i diagnostyka są dostępne wyłącznie ze stron rozszerzenia (`background/message-policy.js`). Pełna polityka prywatności: [PRIVACY.md](../PRIVACY.md).

## Języki

Interfejs jest po polsku i po angielsku (`chrome.i18n`): polska przeglądarka → polski, każda inna → angielski (`default_locale: en`). Jedynym źródłem tekstów jest `tools/i18n-messages.mjs`; `npm run i18n` generuje z niego `_locales/{pl,en}/messages.json`. Strony HTML mają polski tekst jako zapas, a `shared/i18n.js` podmienia go na tłumaczenie. Komunikaty Diagnostyki (stan silników, synchronizacja, kontrole YouTube Protection, błędy importu) też są tłumaczone; service worker zapisuje je w chwili zdarzenia, więc po zmianie języka przeglądarki stare wpisy zostają w poprzednim języku do kolejnej synchronizacji. Kod uruchamiany bez `chrome.i18n` (testy w Node) korzysta z polskiego zapasu `shared/messages-pl.js`, generowanego razem z `_locales`.

## Testy

Główne komendy:

```bash
npm test
npm run check
npm run package:dev
npm run package:store
```

Projekt korzysta z:

- `node:test`,
- testów integracyjnych service workera z mockiem Chrome API,
- Playwright/Chromium do smoke i testów live,
- testów E2E YouTube,
- testera rzeczywistych stron,
- baseline'u rozmiaru i wydajności,
- GitHub Actions.

Szczegóły:

- [perf-baseline.md](perf-baseline.md),
- [single-blocker-sites-test.md](single-blocker-sites-test.md),
- [manual-youtube-test.md](manual-youtube-test.md).

## Packaging

`npm run package:dev` tworzy paczkę zawierającą wyłącznie pliki potrzebne przez rozszerzenie. Testy, dokumentacja developerska, lokalne wrappery i inne narzędzia nie trafiają do ZIP-a.

`npm run package:store` tworzy osobny ZIP pod Chrome Web Store z `manifest.json` w katalogu głównym.

## Znane ograniczenia

- Manifest V3 nie daje tych samych możliwości co klasyczne rozszerzenia oparte o `webRequest` blocking.
- Apex AdBlocker nie implementuje całego uBO/ABP.
- część zaawansowanych filtrów proceduralnych i scriptletów nie jest wspierana,
- filtrowanie HTML i niektóre modyfikacje nagłówków nie są dostępne w obecnej architekturze,
- strony mogą wykrywać obecność blokera,
- skuteczność zależy również od zmian w serwisach i aktualności list filtrów.

## Listy filtrów

Informacje o upstreamach, snapshotach i licencjach są utrzymywane osobno:

- [../THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md),
- [filter-provenance.md](filter-provenance.md).

Dokumentacja provenance jest opisem technicznym pochodzenia danych, a nie opinią prawną.
