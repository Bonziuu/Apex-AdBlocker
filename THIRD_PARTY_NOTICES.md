# Third-party notices – listy filtrów

Ten plik jest dołączany do paczki Apex AdBlocker. Opisuje, z jakich list filtrów stron trzecich powstały pliki rozszerzenia, na jakich licencjach są udostępniane i jak zostały zmienione. Nie jest opinią prawną. Szczegóły wersji, hashe snapshotów i audyt: `docs/filter-provenance.md` w repozytorium źródłowym.

**Kod Apex AdBlocker** (własny kod i dokumentacja Konrada Woźniaka): MIT – plik `LICENSE`. Licencja MIT nie obejmuje danych list filtrów ani ich przetworzonych postaci opisanych niżej.

**Zasada rozdzielenia:** każda lista Apex AdBlocker ma osobny zestaw plików, a każdy z tych plików zawiera dane tylko jednej rodziny licencji. Listy `ads`, `privacy` i `security` zawierają wyłącznie dane na licencji GPL. Lista `pl` zawiera wyłącznie dane Polskich Filtrów na licencji CC BY-NC-SA 4.0. Żaden plik nie łączy danych GPL i CC BY-NC-SA.

## Mapa: plik wynikowy → źródła → licencja

| Pliki w paczce | Lista | Źródła (z plikami dołączanymi przez `!#include`) | Licencja danych |
|---|---|---|---|
| `rules/ads.json`, `data/ads.json`, `data/ads.allow.json`, `data/ads.scriptlets.json`, `scriptlets/ads-<n>.js`, `scriptlets/ads-entities.js` | `ads` (Reklamy) | EasyList (`easylist.txt`); uBlock filters: `filters.txt` (z `filters-2020.txt` … `filters-2026.txt`, `filters-general.txt`, `ubo-link-shorteners.txt`), `quick-fixes.txt`, `unbreak.txt` | GPL-3.0-only |
| `scriptlets/ads-x-pl.js` | `ads` – wyjątki `#@#+js` uBlock filters dla scriptletów listy `pl` | uBlock filters (jak wyżej) | GPL-3.0-only |
| `rules/privacy.json`, `data/privacy.json`, `data/privacy.allow.json`, `data/privacy.scriptlets.json`, `scriptlets/privacy-<n>.js`, `scriptlets/privacy-entities.js` | `privacy` (Śledzenie i prywatność) | EasyPrivacy (`easyprivacy.txt`); uBlock filters – Privacy (`privacy.txt` z `resource-abuse.txt`) | GPL-3.0-only |
| `rules/security.json`, `data/security.json`, `data/security.allow.json`, `data/security.scriptlets.json`, `scriptlets/security-<n>.js` | `security` (Złośliwe strony) | uBlock filters – Badware risks (`badware.txt`) | GPL-3.0-only |
| `rules/pl.json`, `data/pl.json`, `data/pl.allow.json`, `data/pl.scriptlets.json`, `scriptlets/pl-<n>.js` | `pl` (Polskie Filtry) | Oficjalne Polskie Filtry: `adblock.txt` (z `adblock_suplement.txt`, `adblock_ublock.txt`) | CC BY-NC-SA 4.0 |
| `shared/entity-hosts.js` | – | Public Suffix List | MPL-2.0 |
| `data/lists.json`, `data/badfilter-cross.json`, `data/scriptlet-compat.json`, `data/youtube-compat.json` | – | metadane kompilacji Apex AdBlocker: nazwy list, licencje, nazwy plików źródłowych, liczby, identyfikatory reguł; bez treści filtrów | MIT |

Uwagi:

- EasyList i EasyPrivacy są udostępniane do wyboru na GPL-3.0-or-later albo CC BY-SA 3.0. Apex AdBlocker korzysta z opcji **GPL-3.0-or-later**. Połączone w jednej liście z uBlock filters (GPL-3.0-only) dają pliki na **GPL-3.0-only**.
- Pliki `scriptlets/*.js` składają się z biblioteki scriptletów Apex AdBlocker (MIT) i danych jednej listy (`CALLS`, `HOSTS`, `EXCEPT`) na licencji tej listy. Licencja każdego pliku jest też podana w jego nagłówku.
- `scriptlets/ads-x-pl.js` zawiera wyłącznie wyjątki z uBlock filters (GPL-3.0-only). Jest wstrzykiwany przed scriptletami listy `pl` tylko wtedy, gdy lista `ads` jest włączona, tak jak przed wydzieleniem Polskich Filtrów. Nie zawiera danych Polskich Filtrów.
- `data/badfilter-cross.json` zawiera tylko identyfikatory reguł listy `pl` / `privacy`, które wyłącza `$badfilter` z listy `ads`; reguły pozostają w plikach swojej listy. Podobnie pole `crossHide` w `data/pl.json` oznacza wyjątki stron z Polskich Filtrów, które `$badfilter` z listy `ads` wyłącza w czasie działania.

## Zmiany wprowadzone przez Apex AdBlocker

Dotyczy wszystkich list poniżej. Pliki wynikowe są **zmodyfikowaną postacią** list upstream: `tools/build.mjs` wczytuje snapshot listy, rozwija `!#include` i `!#if` (środowisko jak uBlock Origin Lite w Chromium), pomija filtry nieobsługiwane w Manifest V3 i konwertuje pozostałe do formatu Apex AdBlocker: reguły `declarativeNetRequest` (JSON), dane filtrów kosmetycznych (JSON), wyjątki oraz wywołania scriptletów osadzone w plikach JavaScript. Kolejność, identyfikatory i postać reguł różnią się od oryginału; treść filtrów nie jest uzupełniana o dane z innych list.

- Data zmiany: data zbudowania danej wersji – podana przy wersji w `CHANGELOG.md` i w opisie wydania. Ostatnia zmiana sposobu przetwarzania list: 2026-11-01 (wydzielenie Polskich Filtrów do osobnej listy `pl`).
- Wersje snapshotów list: EasyList / EasyPrivacy `Version: 202610211530` (2026-10-21); uBlock filters – treść z commitów `uBlockOrigin/uAssets` z 2026-10-02 … 2026-10-21; Oficjalne Polskie Filtry `Version: 20261012001` (`adblock.txt`, aktualizacja z 2026-10-20). Pełna lista z hashami: `docs/filter-provenance.md`.
- Źródło odpowiadające paczce: https://github.com/Bonziuu/Apex-AdBlocker – dla wydania wersji X.Y.Z tag `vX.Y.Z` (https://github.com/Bonziuu/Apex-AdBlocker/tree/vX.Y.Z, archiwum „Source code” przy wydaniu w https://github.com/Bonziuu/Apex-AdBlocker/releases). Snapshoty list są w `tools/lists/`, generator w `tools/`. Sposób odtworzenia paczki: `LICENSING.md`.

Listy są udostępniane przez ich autorów na warunkach podanych niżej licencji, łącznie z zawartymi w nich postanowieniami o wyłączeniu gwarancji i ograniczeniu odpowiedzialności.

## EasyList, EasyPrivacy

- Autorzy: © The EasyList authors (https://easylist.to/)
- Źródło: https://easylist.to/easylist/easylist.txt, https://easylist.to/easylist/easyprivacy.txt (repozytorium: https://github.com/easylist/easylist)
- Licencja upstream: do wyboru GNU General Public License v3.0 or later **albo** Creative Commons Attribution-ShareAlike 3.0 Unported or later – https://easylist.to/pages/licence.html. Apex AdBlocker korzysta z GPL-3.0-or-later.
- Używane w listach Apex AdBlocker: `ads` (EasyList), `privacy` (EasyPrivacy). Pliki wynikowe: GPL-3.0-only (połączenie z uBlock filters).

## uBlock filters (uAssets)

- Projekt: uBlock Origin – uAssets, © Raymond Hill i współtwórcy, https://github.com/uBlockOrigin/uAssets
- Źródło: https://ublockorigin.github.io/uAssets/filters/ (filters, quick-fixes, unbreak, privacy, badware wraz z plikami dołączanymi przez `!#include`)
- Licencja: GNU General Public License v3.0 – https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE; pełny tekst w paczce: `LICENSES/GPL-3.0.txt`
- Używane w listach Apex AdBlocker: `ads`, `privacy`, `security`

## Polskie Filtry – Oficjalne Polskie Filtry do AdBlocka, uBlocka Origin i AdGuarda

- Tytuł upstream: „Official Polish Filters for AdBlock, uBlock Origin & AdGuard” / „Oficjalne Polskie Filtry do AdBlocka, uBlocka Origin i AdGuarda”
- Autorzy: Certyficate IT i współtwórcy listy (nagłówek listy: „Copyright © 2026 Certyficate IT”; lista współtwórców w nagłówku `adblock.txt`), https://www.certyficate.it
- Źródło: https://github.com/MajkiIT/polish-ads-filter (`polish-adblock-filters/adblock.txt` z plikami dołączanymi)
- Licencja: **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** – https://creativecommons.org/licenses/by-nc-sa/4.0/ (pełny tekst: https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)
- Zmiany: dane zostały przetworzone do formatu używanego przez Apex AdBlocker (opis wyżej). Pliki listy `pl` (mapa wyżej) są materiałem adaptowanym i są udostępniane na tej samej licencji, CC BY-NC-SA 4.0. Licencja zawiera klauzulę NonCommercial.
- Używane w liście Apex AdBlocker: `pl` (wyłącznie). Dane nie są łączone z listami GPL.
- Dystrybucja, także w Chrome Web Store, odbywa się na warunkach CC BY-NC-SA 4.0.

## Public Suffix List

- Źródło: https://github.com/publicsuffix/list/blob/master/public_suffix_list.dat
- Snapshot jest zachowany w `tools/public-suffix-list.dat`; jego SHA-256 widnieje w wygenerowanym `shared/entity-hosts.js`.
- Licencja: Mozilla Public License 2.0; pełny tekst: `shared/public-suffix-LICENSE.txt`.
- Zmiany: komentarze usunięto, nazwy domen zakodowano jako ASCII, dane osadzono w pomocniku dopasowania encji domen. Zawartość reguł ICANN i PRIVATE pozostaje zachowana.

## Dołączone teksty licencji

Pełny tekst GPLv3: `LICENSES/GPL-3.0.txt`. Pełny tekst MPL 2.0: `shared/public-suffix-LICENSE.txt`. Teksty licencji Creative Commons – pod adresami podanymi wyżej.
