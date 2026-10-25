# ChromeBlock

Bloker reklam i śledzenia dla Chrome (Manifest V3) z własnym silnikiem filtrów.

> **Status: wersja developerska 0.2.7-dev / engine baseline** – prywatny build do własnego użytku, nie wydanie stabilne.

## Instalacja (rozpakowane rozszerzenie)

1. Pobierz repozytorium: `git clone https://github.com/Bonziuu/Chromeblock.git` (albo **Code → Download ZIP** i rozpakuj).
2. Otwórz w Chrome `chrome://extensions` i włącz **Tryb dewelopera**.
3. Kliknij **Załaduj rozpakowane** i wskaż folder repozytorium (ten, w którym jest `manifest.json`).
4. Przypnij ikonę ChromeBlock na pasku.

Chrome ładuje rozszerzenie bezpośrednio z tego folderu – nie przenoś go po instalacji.

## Co robi

| Mechanizm | Opis |
|---|---|
| Blokowanie sieciowe | ~131 tys. filtrów z EasyList, EasyPrivacy, uBlock filters i Polskich Filtrów zamienionych na reguły `declarativeNetRequest` |
| Ukrywanie elementów | ~97 tys. filtrów kosmetycznych wstrzykiwanych jako arkusz stylów użytkownika |
| Filtry proceduralne | `:has-text()`, `:upward()`, `:remove()`, `:style()`, `:matches-path()`, `:min-text-length()` |
| Scriptlety | Własne implementacje scriptletów uBO (lista i warianty – sekcja Compatibility) |
| YouTube Protection | Domyślnie włączona; kontrola zgodności filtrów YouTube przy buildzie i lokalna diagnostyka odtwarzacza |
| Przycisk zasilania | Wyłącza ochronę na bieżącej stronie |
| Ukryj element | Tworzy własny filtr kosmetyczny po wskazaniu elementu |
| Moje filtry | Własne reguły w składni ABP/uBO (bez scriptletów) |
| Diagnostyka | Stan silników, wyniki synchronizacji, dziennik błędów, pomiary wydajności (opcje → Diagnostyka) |

## Compatibility

ChromeBlock **nie jest** uBlock Origin i **nie ma pełnej zgodności** z uBO.

- Używa **własnego silnika** (parser, generator reguł DNR, silnik kosmetyczny, biblioteka scriptletów, silnik JSONPath). Kod uBO nie jest kopiowany.
- Obsługuje **określony podzbiór** składni ABP/uBO. Filtrów, których nie da się poprawnie wyrazić, ChromeBlock nie wykonuje – zasada **fail closed**:
  - scriptlet jest wykonywany tylko wtedy, gdy ChromeBlock zna jego semantykę **dla dokładnie tego wariantu argumentów**,
  - nieznany scriptlet, nieznany parametr, niesparowany vararg albo nieobsługiwana wartość oznaczają, że filtr jest pomijany (nie „częściowo wykonywany”).
- **Build kontroluje zgodność kluczowych filtrów YouTube** (youtube.com, www/m/music.youtube.com, youtube-nocookie.com) w listach domyślnie włączonych. Jeśli pojawi się filtr YouTube, którego ChromeBlock nie obsługuje, `npm run build` kończy się błędem `CRITICAL YOUTUBE COMPATIBILITY FAILURE`. Wyjątkiem są braki świadomie wpisane do `youtube/known-gaps.json`.

Stan przy obecnych listach (`npm run audit:scriptlets`):

| | liczba | |
|---|---|---|
| Filtry scriptletów | 14 598 | |
| W pełni obsługiwane | 13 818 | 94,7% |
| Częściowo (znany scriptlet, nieobsługiwany wariant – **niewykonywane**) | 84 | 0,6% |
| Nieobsługiwane (**niewykonywane**) | 696 | 4,8% |
| **Krytyczne reguły YouTube** | **30** | **30 obsługiwanych, 0 braków** |

Najważniejsze scriptlety bez implementacji: `abort-on-stack-trace` (221 filtrów; ChromeBlock nie odtwarza normalizacji stosu wywołań uBO), `trusted-replace-argument` (93), `href-sanitizer` (74), `trusted-suppress-native-method`, `nobab`, `nofab`, `trusted-create-html`, `xml-prune`, `m3u-prune`, `trusted-replace-outbound-text`, `refresh-defuser`, `prevent-innerHTML`, `spoof-css` i inne. Pełna lista z liczbą wystąpień, przykładowymi domenami i powodem jest w raporcie audytu.

Inne ograniczenia:
- Manifest V3 nie pozwala na filtrowanie HTML (`##^`), modyfikację nagłówków CSP ani blokowanie popupów filtrami `$popup`; ok. 3% filtrów sieciowych i 1% kosmetycznych jest pomijanych.
- Zagnieżdżone operatory proceduralne (np. `:has(... :has-text())`) nie są obsługiwane.
- `trusted-click-element` z `>>>` (zamknięty shadow DOM) i warunkiem `localStorage:` nie jest wykonywany.
- Wyjątki `#@#+js(...)` działają tylko w obrębie własnej listy. Build zlicza wyjątki wskazujące scriptlety innej listy – przy obecnych listach jest ich 0.
- **ChromeBlock nie obiecuje niewykrywalności.** Strony mogą wykryć, że reklamy są blokowane.

## YouTube Protection

YouTube korzysta ze wspólnego silnika (DNR, kosmetyka, scriptlety). Moduł `youtube/` odpowiada za:

- `youtube/compatibility.js` – które filtry są krytyczne i czy są obsługiwane (build, audyt, testy, aktualizacja list),
- `youtube/protection.js` – ocenę stanu ochrony w service workerze: lista „Reklamy” włączona, scriptlety YouTube zarejestrowane, zgodność filtrów, stan odtwarzacza,
- `youtube/health.js` – lekką, lokalną diagnostykę odtwarzacza: czy istnieje `movie_player` i element `video`, czy odtwarzacz pokazuje błąd, czy ładowanie trwa podejrzanie długo, czy odtwarzanie może się rozpocząć. Statusy: `healthy`, `degraded`, `error`, `unknown`. Diagnostyka nie zapisuje adresów filmów i niczego nie naprawia automatycznie.
- `youtube/player-reports.js` – model raportów `tabId → frameId → raport` w service workerze: raport ramki głównej ma pierwszeństwo, iframe nie może go nadpisać, YouTube osadzony na innej stronie (brak raportu top) korzysta z raportu iframe, raporty wygasają po ok. 60 s, a zamknięcie karty i główna nawigacja je usuwają.

### Raport diagnostyczny

Opcje → Diagnostyka → **Kopiuj raport diagnostyczny** kopiuje do schowka lokalny raport tekstowy + JSON: wersja, manifest, czas, włączone listy, stan silników i synchronizacji, zgodność YouTube i scriptletów, zagregowany stan odtwarzacza, ostatnie błędy ChromeBlock, flaga diagnostyki wydajności. Raport **nie zawiera** adresów stron, historii, ID filmów, cookies, tokenów, loginów, danych konta ani treści stron (`background/diagnostics-report.js`). Nic nie jest wysyłane automatycznie.

## Prywatność

Brak telemetrii, analityki, kont i backendu. Diagnostyka (stan silników, dziennik błędów, pomiary wydajności) jest przechowywana wyłącznie lokalnie w `chrome.storage`. Rozszerzenie nie pobiera ani nie wykonuje zdalnego kodu. Scriptlety pochodzą z list wbudowanych podczas buildu. Zaufane filtry uBlock filters mogą zawierać fragmenty kodu wstrzykiwane do stron, tak jak w uBO.

## Development

```bash
npm install          # tylko Playwright do testów E2E; npm test nie wymaga zależności
npm test             # testy jednostkowe i integracyjne (node:test), BEZ E2E
npm run check        # walidacja buildu + zgodność YouTube (strict) + audyt + testy
```

| Komenda | Działanie |
|---|---|
| `npm run build` | Buduje `rules/`, `data/`, `scriptlets/` z `tools/lists/`; strict dla YouTube |
| `npm run audit:scriptlets` | Raport zgodności scriptletów (supported / partial / unsupported, YouTube) |
| `npm run update-lists` | Pobiera listy i od razu pokazuje zmiany filtrów YouTube i nowe nieobsługiwane scriptlety |
| `npm run check` | Wszystkie kontrole; kod ≠ 0 przy błędzie. Jeśli dostępny jest Playwright + Chromium, dodatkowo ładuje rozszerzenie w Chromium (tymczasowy profil, bez stron zewnętrznych); inaczej `SKIP: Chromium smoke test unavailable`. `CHROMEBLOCK_SMOKE=0` pomija ten krok |
| `npm run package:dev` | Paczka dla osób bez Gita: `dist/ChromeBlock/` (tylko pliki rozszerzenia) + `dist/ChromeBlock-dev.zip` z instalatorem Windows (`install-chromeblock.cmd`, `update-chromeblock.cmd`) i [INSTALL.md](INSTALL.md). Test paczki: `node tools/chromium-smoke.mjs --dir dist/ChromeBlock` |
| `npm run test:e2e` | Testy E2E YouTube w prawdziwym Chromium (wymagają `npx playwright install chromium`) |
| `npm run test:polish-sites` | Test polskich stron z załadowanym ChromeBlock (maks. 20 domen; domyślnie `tools/polish-sites/sites.json`): żądania zablokowane, widoczne etykiety reklam / treści sponsorowanej, puste kontenery, błędy JS, czy strona działa. Raport: `tests/polish-sites/results/latest.txt`. Nie generuje reguł. `--fixture` = tryb offline; `--gap-mode` = tymczasowy build testowy bez Polskich Filtrów (repozytorium bez zmian). Windows: dwuklik `test-polish-sites.cmd` (GAP) lub `test-polish-sites-headed.cmd` (GAP z widocznym oknem) |

Pierwsze uruchomienie Windows: `run-polish-test.cmd` – po rozpakowaniu ZIP-a repozytorium wystarczy dwuklik. Wymaga zainstalowanego Node.js 20+; brakujące zależności (`npm install`) i Chromium dla Playwright (`npx playwright install chromium`) pobiera sam, potem uruchamia `test-polish-sites.cmd` (GAP mode).

Dowody (zrzuty ekranu obserwacji) dla 9 stron: dwuklik `run-polish-evidence.cmd` (GAP + `--evidence`: onet.pl, wp.pl, interia.pl, o2.pl, gazeta.pl, wykop.pl, businessinsider.com.pl, se.pl, bankier.pl). Zrzuty: `tests/polish-sites/results/evidence/<domena>-<nr>.png` i `<domena>-<nr>-context.png`.

Retest partii 1 ChromeBlock Polish (bankier.pl, businessinsider.com.pl, gazeta.pl): dwuklik `retest-polish-batch1.cmd`. Evidence dla partii 2 (wykop.pl, wp.pl, o2.pl, onet.pl, interia.pl, se.pl, jbzd.com.pl): dwuklik `test-polish-batch2.cmd`.

Aktualizacja list:

```bash
npm run update-lists   # pokaże: "YouTube filters changed" / "New unsupported scriptlet detected"
npm run build
npm run check
```

Jeśli nowy filtr YouTube nie jest obsługiwany, masz dwie drogi: zaimplementować semantykę (rejestr `shared/scriptlet-specs.js` + `tools/scriptlets-lib.js` + test) albo świadomie zaakceptować brak: `node tools/audit-scriptlets.mjs --update-youtube-baseline`.

Testy są wyszukiwane przez `tools/run-tests.mjs` (jawna lista plików, bez globów – działa w Node 20+). `npm test` uruchamia `tests/**/*.test.mjs` z pominięciem `tests/e2e/`; E2E uruchamia się wyłącznie przez `npm run test:e2e`.

### Testy E2E YouTube

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Chromium startuje z jednorazowym profilem i załadowanym rozszerzeniem. Przypadki: 3 filmy `/watch` (w tym jeden dłuższy, z testem seek +15 s), playlista (przejście do kolejnego filmu przez API odtwarzacza), embed (adres `/embed/` i iframe na stronie testowej), `music.youtube.com/watch`, Shorts (tylko z `YOUTUBE_SHORTS_URL`). Stan odtwarzacza jest próbkowany co 1 s.

Wyniki: `PLAYBACK_OK`, `AD_BLOCKING_OBSERVED` (jest dowód: surowa odpowiedź zawierała dane reklam, a odpowiedź widoczna dla strony – nie), `INCONCLUSIVE — no ad opportunity observed`, `AD_VISIBLE_FAILURE` (stan reklamy ≥ 3 kolejne sekundy), `PLAYER_FAILURE`. Test nie klika „Pomiń reklamę”, nie modyfikuje obiektów odtwarzacza i nie obchodzi CAPTCHA, `/sorry/` ani logowania – takie przypadki są pomijane (SKIP). Wyniki zapisują się w `tests/e2e/results/last-run.json`.

| Zmienna | Znaczenie |
|---|---|
| `YOUTUBE_WATCH_URLS` | adresy `/watch` rozdzielone przecinkami |
| `YOUTUBE_PLAYLIST_URL` | adres playlisty |
| `YOUTUBE_SHORTS_URL` | adres Shorts (bez niej: `SKIP — no stable Shorts URL configured`) |
| `YOUTUBE_EMBED_URL`, `YOUTUBE_MUSIC_URL` | własne adresy embed / YouTube Music |
| `E2E_HANDLE_CONSENT=1` | zwykła interakcja z ekranem zgody w jednorazowym profilu (domyślnie test nic nie klika) |
| `E2E_HEADLESS=1` | tryb headless |
| `E2E_SAMPLE_SECONDS` | długość próbkowania (domyślnie 20 s) |

Ręczny test w prawdziwym Chrome: [docs/manual-youtube-test.md](docs/manual-youtube-test.md).

### Struktura

```
manifest.json              definicja rozszerzenia (MV3)
background.js              service worker: listy, własne filtry, scriptlety, CSS, diagnostyka
background/health.js       stan zdrowia silników i dziennik błędów
background/diagnostics-report.js  lokalny raport diagnostyczny (sanityzacja)
shared/parser.js           parser filtrów ABP/uBO → reguły DNR, filtry kosmetyczne
shared/scriptlet-specs.js  rejestr scriptletów i walidacja argumentów (fail closed)
shared/jsonpath.js         silnik JSONPath (dialekt uBO, także legacy)
content/cosmetic.js        ukrywanie elementów, filtry ogólne i proceduralne, pomiary
content/picker.js          tryb „Ukryj element”
youtube/                   YouTube Protection (zgodność, ocena, diagnostyka odtwarzacza, known-gaps.json)
popup/, options/           interfejs (opcje → Diagnostyka)
rules/ data/ scriptlets/   pliki generowane przez build (commitowane)
tools/                     build, audyt, check, runner testów, aktualizacja list, biblioteka scriptletów, listy źródłowe
tests/                     parser, network, cosmetic, scriptlets, build, youtube, health, tools, e2e
docs/                      ręczny test YouTube
```

## Kierunek produktu

ChromeBlock jest w 100% darmowy – bez wersji Pro, płatnych funkcji, paywalla, kont, subskrypcji, systemu płatnych licencji i kluczy aktywacyjnych; żadna funkcja nie jest ograniczana licencją. Warunki licencyjne kodu i list filtrów stron trzecich obowiązują bez zmian (zob. „Źródła list i licencje”). Szczegóły: [docs/product-direction.md](docs/product-direction.md).

## Źródła list i licencje

EasyList, EasyPrivacy, Fanboy Annoyances © The EasyList authors (GPLv3 / CC BY-SA 3.0) · uBlock filters © Raymond Hill i współtwórcy (GPLv3) · Polskie Filtry Reklamowe © MajkiIT (CC BY-NC-SA 4.0). Listy są wbudowane w repozytorium (`tools/lists/`).

**ChromeBlock Polish Supplement** (`tools/lists/chromeblock-polish/`) – własna lista projektu, tworzona niezależnie (clean room: tylko własna obserwacja stron i testy ChromeBlock, bez kopiowania innych list), z pochodzeniem każdej reguły w `provenance.json`. Licencja: do ustalenia (TBD). Zob. [docs/chromeblock-polish-foundation.md](docs/chromeblock-polish-foundation.md).

Pełny audyt licencyjny zostanie wykonany przed ewentualnym publicznym wydaniem.
