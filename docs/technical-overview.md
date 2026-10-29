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
