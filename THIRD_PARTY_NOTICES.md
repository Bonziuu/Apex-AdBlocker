# Third-party notices – listy filtrów

Ten dokument jest inwentarzem źródeł i notice audytowym dla Apex AdBlocker.

Apex AdBlocker kompiluje do swoich plików (`rules/`, `data/`, `scriptlets/`) poniższe listy filtrów stron trzecich. Ten plik jest dołączany do paczki rozszerzenia. Szczegóły pochodzenia, wersje snapshotów i hashe: `docs/filter-provenance.md` w repozytorium źródłowym Apex AdBlocker. Ten plik nie jest opinią prawną.

Listy są udostępniane przez ich autorów na warunkach podanych niżej licencji, łącznie z zawartymi w nich postanowieniami o wyłączeniu gwarancji (pełne teksty licencji pod podanymi adresami).

## EasyList, EasyPrivacy

- Autorzy: © The EasyList authors (https://easylist.to/)
- Źródło: https://easylist.to/easylist/easylist.txt, https://easylist.to/easylist/easyprivacy.txt (repozytorium: https://github.com/easylist/easylist)
- Licencja: do wyboru GNU General Public License v3.0 or later **albo** Creative Commons Attribution-ShareAlike 3.0 Unported or later – https://easylist.to/pages/licence.html
- Zmiany: filtry są przekształcane do formatu Apex AdBlocker (reguły `declarativeNetRequest`, filtry kosmetyczne) i łączone z innymi listami w listach `ads` i `privacy`.
- Używane w listach Apex AdBlocker: `ads` (EasyList), `privacy` (EasyPrivacy)

## uBlock filters (uAssets)

- Projekt: uBlock Origin – uAssets, © Raymond Hill i współtwórcy, https://github.com/uBlockOrigin/uAssets
- Źródło: https://ublockorigin.github.io/uAssets/filters/ (filters, quick-fixes, unbreak, privacy, badware wraz z plikami dołączanymi przez `!#include`)
- Licencja: GNU General Public License v3.0 – https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE
- Zmiany: filtry są przekształcane do formatu Apex AdBlocker (reguły `declarativeNetRequest`, filtry kosmetyczne, scriptlety) i łączone z innymi listami w listach `ads`, `privacy` i `security`.
- Używane w listach Apex AdBlocker: `ads`, `privacy`, `security`

## Polskie Filtry (Official Polish Filters for AdBlock, uBlock Origin & AdGuard)

- Autorzy: Certyficate IT / MajkiIT i współpracownicy (nagłówek listy: „Copyright © 2026 Certyficate IT”), https://www.certyficate.it
- Źródło: https://github.com/MajkiIT/polish-ads-filter (`polish-adblock-filters/adblock.txt` z plikami dołączanymi)
- Licencja: **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** – https://creativecommons.org/licenses/by-nc-sa/4.0/
- Zmiany: filtry są przekształcane do formatu Apex AdBlocker (reguły `declarativeNetRequest`, filtry kosmetyczne, scriptlety) i łączone z innymi listami w liście `ads`.
- Używane w liście Apex AdBlocker: `ads`

## Public Suffix List

- Źródło: https://github.com/publicsuffix/list/blob/master/public_suffix_list.dat
- Snapshot jest zachowany w `tools/public-suffix-list.dat`; jego SHA-256 widnieje w wygenerowanym `shared/entity-hosts.js`.
- Licencja: Mozilla Public License 2.0; pełny tekst: `shared/public-suffix-LICENSE.txt`.
- Zmiany: komentarze usunięto, nazwy domen zakodowano jako ASCII, dane osadzono w pomocniku dopasowania encji domen. Zawartość reguł ICANN i PRIVATE pozostaje zachowana.

## Dołączone teksty i źródła kompilacji

Pełny tekst GPLv3: `LICENSES/GPL-3.0.txt`. Pełny tekst MPL 2.0:
`shared/public-suffix-LICENSE.txt`. Adresy tekstów Creative Commons podano
powyżej. Źródła i sposób odtworzenia konkretnej paczki: `LICENSING.md`.
Licencja MIT własnego kodu nie obejmuje cudzych filtrów ani nie rozstrzyga
warunków dystrybucji mieszanych artefaktów GPL / CC BY-NC-SA.
