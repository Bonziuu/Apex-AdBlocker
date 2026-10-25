# Migracja polskich filtrów: Polskie Filtry Reklamowe → EasyList Polish

| | |
|---|---|
| Branch | `replace-polish-filters` (od `main` @ `5e590748c9befb10c1b0a7b15a762584c6983009`) |
| Data | 2026-10-25 |
| Powód | Polskie Filtry Reklamowe (MajkiIT / Certyficate IT) mają licencję CC BY-NC-SA 4.0 z otwartymi pytaniami o NonCommercial i ShareAlike przy dystrybucji w Chrome Web Store (zob. audyt licencji na branchu `release-license-audit`). EasyList Polish odsyła do licencji EasyList |
| Zakres | Tylko zmiana źródła w liście „Reklamy” (`ads`). Parser, semantyka filtrowania, uprawnienia, wersja i paczka bez zmian. Bez własnych filtrów ChromeBlock |

Dokument podaje wyłącznie liczby. Nie zawiera fragmentów żadnej z list. **Liczba reguł nie mówi, która lista jest „lepsza”**, bo zależy od stylu list, deduplikacji i pokrycia przez EasyList / uBlock filters.

## 1. Źródła

| | Przed | Po |
|---|---|---|
| Lista | Oficjalne Polskie Filtry (AdBlock / uBO / AdGuard), Certyficate IT / MajkiIT | **EasyList Polish** |
| Upstream | `github.com/MajkiIT/polish-ads-filter` | `github.com/easylistpolish/easylistpolish` |
| Pobierane (`tools/update-lists.mjs`) | `adblock.txt`, `adblock_suplement.txt`, `adblock_ublock.txt`, `adblock_adguard.txt` | `https://easylist-downloads.adblockplus.org/easylistpolish.txt` |
| Plik w repo | `tools/lists/pl/*.txt` (4 pliki): **usunięte** | `tools/lists/easylist/easylistpolish.txt` |
| Licencja deklarowana | CC BY-NC-SA 4.0 | `https://easylist.to/pages/licence.html` (nagłówek oficjalnej listy) |
| Zaufana (`trusted-*` scriptlety) | nie | nie |

**Pochodzenie pliku w tym commicie.** Oficjalnego pliku `easylistpolish.txt` nie dało się pobrać w środowisku budowania: serwery `easylist-downloads.adblockplus.org` i `easylist.to` są niedostępne z tego środowiska, a odczyt przez WebFetch blokuje robots.txt. Dlatego plik złożono z plików źródłowych oficjalnego repozytorium `github.com/easylistpolish/easylistpolish` (commit `ea95582ab2f546db98f8d8d7257ac80ef7a781ed`, 2026-10-24).

Sposób złożenia:

- 23 pliki z `easylistpolish/` i `easylistpolish_adult/`, w kolejności sekcji EasyList, z markerami `! *** easylistpolish:… ***`;
- treść filtrów bez zmian: 3325 linii filtrów, identyczne z plikami upstream (sprawdzone sumą kontrolną);
- nagłówek opisuje to pochodzenie.

`npm run update-lists` pobiera oficjalny plik z adresu powyżej i zastępuje złożony plik.

## 2. Porównanie list (każda kompilowana osobno przez build ChromeBlock)

Metoda: dla każdej listy osobno `loadListLines` (rozwinięcie `!#include` i `!#if` w środowisku ChromeBlock), następnie `compileList` z buildu, bez innych list. Polskie Filtry liczone z `adblock.txt` wraz z dołączanymi `adblock_suplement.txt` i `adblock_ublock.txt` (`adblock_adguard.txt` jest pomijany przez `!#if adguard`, jak w dotychczasowym buildzie).

| | Polskie Filtry | EasyList Polish |
|---|---:|---:|
| Linie po rozwinięciu include / if | 6 692 | 3 361 |
| Komentarze | 455 | 35 |
| **Linie filtrów (wejście)** | **6 234** | **3 325** |
| Filtry sieciowe blokujące | 1 030 | 676 |
| Wyjątki sieciowe (`@@`) | 158 | 19 |
| Filtry kosmetyczne (`##`) | 4 761 | 2 621 |
| Wyjątki kosmetyczne (`#@#`) | 31 | 0 |
| Filtry rozszerzone (`#?#`) | 187 | 9 |
| Scriptlety (`##+js`) | 58 | 0 |
| Wyjątki scriptletów (`#@#+js`) | 3 | 0 |
| ABP snippets / AdGuard CSS-JS (`#$#`, `#$?#`) | 6 | 0 |
| Filtrowanie HTML (`##^`, `$$`) | 2 | 0 |

### Wynik kompilacji (standalone)

| | Polskie Filtry | EasyList Polish |
|---|---:|---:|
| Filtry sieciowe **obsłużone** | 1 149 | 690 |
| Filtry sieciowe **pominięte** | 34 | 4 |
| Reguły DNR (po scaleniu i deduplikacji) | 857 | 657 |
| Reguły z `regexFilter` | 42 | 0 |
| Filtry kosmetyczne **obsłużone** | 4 980 | 2 628 |
| Filtry kosmetyczne **pominięte** | 57 | 2 |
| Scriptlety wykonywane | 47 | 0 |
| Scriptlety odrzucone (nieobsługiwane) | 9 | 0 |

### Typy nieobsługiwanych reguł

| Typ | Polskie Filtry | EasyList Polish |
|---|---:|---:|
| Sieciowe `$popup` (brak odpowiednika w DNR) | 25 | 4 |
| Sieciowe `$popunder` | 1 | 0 |
| Sieciowe `$rewrite` | 1 | 0 |
| Sieciowe regex (nieobsługiwany w DNR / zbyt złożony) | 7 | 0 |
| Kosmetyczne: nieobsługiwany wariant pseudo-klasy proceduralnej | 44 | 2 |
| Kosmetyczne: selektor nieobsługiwany | 4 | 0 |
| Kosmetyczne: filtrowanie HTML `##^` | 2 | 0 |
| Kosmetyczne: ABP snippets / AdGuard CSS-JS (`#$#`, `#$?#`) | 6 | 0 |
| Kosmetyczne: `:style()` w nieobsługiwanym wariancie | 1 | 0 |
| Scriptlety bez implementacji (`nano-remove-elements-onready`, `abort-on-stack-trace`, `ape`, `ac`) | 7 | 0 |
| Scriptlety z nieobsługiwanym wariantem argumentów (`prevent-setInterval`, `remove-node-text`) | 2 | 0 |

**Pominięte w EasyList Polish łącznie: 6 z 3 325 linii filtrów** (4 sieciowe `$popup`, 2 kosmetyczne z nieobsługiwaną pseudo-klasą). Parsera ani semantyki nie zmieniano.

### Pokrycie witryn (bez list domen)

Witryny z co najmniej jednym filtrem specyficznym dla strony: kosmetycznym, proceduralnym, `:style`, scriptletem albo regułą sieciową z `initiatorDomains`.

| | Polskie Filtry | EasyList Polish |
|---|---:|---:|
| Witryny z filtrami specyficznymi | 3 712 | 2 837 |
| w tym `.pl` | 2 936 | 2 161 |
| Witryny z filtrami kosmetycznymi | 3 373 | 2 365 |
| Domeny blokowane w całości (`||domena^`) | 318 | 57 |
| Witryny ze scriptletami | 61 | 0 |
| Ogólne filtry kosmetyczne (bez domeny) | 118 | 20 |

Wspólne witryny obu list: **1 600**. Tylko w Polskich Filtrach: 2 112. Tylko w EasyList Polish: 1 237.

Z 2 112 witryn obecnych tylko w Polskich Filtrach 118 ma nadal filtry specyficzne w EasyList lub uBlock filters. **1 994 witryny (w tym 1 556 `.pl`) nie mają już żadnego filtra specyficznego** w liście „Reklamy”. Działają tam nadal filtry ogólne i sieciowe EasyList, uBlock filters i EasyList Polish. To liczba witryn, a nie ocena skuteczności. Faktyczny efekt na tych stronach wymaga testu ręcznego.

## 3. Wpływ na listę „Reklamy” (`ads`, pełny build)

Dane z `data/lists.json` przed i po.

| | Przed | Po | Zmiana |
|---|---:|---:|---:|
| Reguły DNR | 10 302 | 10 111 | −191 |
| Filtry sieciowe (przyjęte) | 64 429 | 63 974 | −455 |
| Filtry kosmetyczne (przyjęte) | 46 323 | 43 971 | −2 352 |
| Scriptlety wykonywane | 4 550 | 4 510 | −40 |
| Scriptlety odrzucone | 513 | 504 | −9 |
| Pliki scriptletów | 24 | 24 | 0 |
| Wzorce rejestracji scriptletów (utrwalane) | 22 149 | 22 098 | −51 |
| Wzorce sesyjne | 36 931 | 36 931 | 0 |
| Wyjątki `#@#+js` bez pasującego scriptletu tej listy | 21 | 29 | +8 |

- Spadki są mniejsze niż wkład Polskich Filtrów liczony osobno, bo część ich filtrów pokrywała się z EasyList, uBlock filters albo EasyList Polish i była deduplikowana.
- Wzrost liczby wyjątków bez pasującego scriptletu (+8) oznacza, że wyjątki `#@#+js` z innych źródeł listy „Reklamy” dotyczyły scriptletów, które dodawały Polskie Filtry. Teraz nie mają czego wyłączać. To nie wpływa na działanie.
- Pozostałe listy (`privacy`, `security`, `cookies`, `annoyances`) bez zmian.
- Dane zgodności YouTube (`data/youtube-compat.json`) bez zmian: 30 reguł scriptletów YouTube, wszystkie obsługiwane.

## 4. Regresja: brak danych z plików MajkiIT

Sprawdzone skryptem jednorazowym (nie jest częścią repo). Elementy wyjściowe to:

- reguła DNR (z rozbiciem `requestDomains` na domeny);
- selektor ogólny lub specyficzny dla hosta;
- wyjątek, `:style`, filtr proceduralny;
- host z `generichide` / `elemhide` / `document`;
- para host + scriptlet.

| | |
|---|---:|
| Elementy wyjściowe Polskich Filtrów (kompilacja osobno) | 12 759 |
| …nieobecne w nowym `ads` | **12 168** |
| …obecne w nowym `ads` | 591 |
| w tym generowane także przez EasyList lub uBlock filters | 37 |
| w tym generowane także przez EasyList Polish | 554 |
| **bez innego źródła** | **0** |

- Wszystkie 591 elementów, które zostały, to reguły identyczne występujące niezależnie w innych źródłach listy. Nie oceniano, czy to „kopie”: identyczne pojedyncze reguły nie są takim dowodem.
- Pliki `rules/ads.json`, `data/ads.json`, `data/ads.allow.json`, `data/ads.scriptlets.json` i `scriptlets/ads-0…23.js` w repo są **bajtowo identyczne** ze świeżym buildem z obecnej konfiguracji, która nie ma żadnego pliku `pl/`.
- Konfiguracja (`tools/lists-config.mjs`), `tools/update-lists.mjs`, README, Opcje i `data/lists.json` nie zawierają odwołań do MajkiIT / Certyficate IT / Polskich Filtrów. Pilnuje tego test `tests/network/list-sources.test.mjs`.

## 5. Licencja i attribution

- README → „Źródła list i licencje” i Opcje → „Listy filtrów” podają teraz EasyList Polish: upstream, link do licencji EasyList i informację, że lista jest przetwarzana przez build ChromeBlock.
- Attribution Polskich Filtrów usunięto, bo ChromeBlock ich już nie dystrybuuje.
- Do potwierdzenia w ramach audytu licencji (bez rozstrzygania tutaj):
  - strona licencji EasyList opisuje zawartość repozytorium `github.com/easylist`, a EasyList Polish jest rozwijana w osobnym repozytorium `github.com/easylistpolish`. Nagłówek oficjalnej listy odsyła do tej licencji, a repo upstream nie ma własnego pliku `LICENSE`: `REQUIRES LEGAL/UPSTREAM CONFIRMATION`;
  - pełne `THIRD-PARTY-NOTICES`: nadal do zrobienia.
