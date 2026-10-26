# Third-party notices – listy filtrów

ChromeBlock kompiluje do swoich plików (`rules/`, `data/`, `scriptlets/`) poniższe listy filtrów stron trzecich. Szczegóły pochodzenia, wersje snapshotów, hashe i otwarte kwestie: [`docs/filter-provenance.md`](docs/filter-provenance.md). Ten plik nie jest opinią prawną.

## EasyList, EasyPrivacy

- Autorzy: The EasyList authors (https://easylist.to/)
- Źródło: https://easylist.to/easylist/easylist.txt, https://easylist.to/easylist/easyprivacy.txt (repozytorium: https://github.com/easylist/easylist)
- Licencja: do wyboru GNU General Public License v3.0 or later **albo** Creative Commons Attribution-ShareAlike 3.0 Unported or later – https://easylist.to/pages/licence.html
- Używane w listach ChromeBlock: `ads` (EasyList), `privacy` (EasyPrivacy)

## uBlock filters (uAssets)

- Projekt: uBlock Origin – uAssets, https://github.com/uBlockOrigin/uAssets
- Źródło: https://ublockorigin.github.io/uAssets/filters/ (filters, quick-fixes, unbreak, privacy, badware wraz z plikami dołączanymi przez `!#include`)
- Licencja: GNU General Public License v3.0 – https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE
- Używane w listach ChromeBlock: `ads`, `privacy`, `security`

## Polskie Filtry (Official Polish Filters for AdBlock, uBlock Origin & AdGuard)

- Autorzy: Certyficate IT / MajkiIT i współpracownicy (nagłówek listy: „Copyright © 2026 Certyficate IT”), https://www.certyficate.it
- Źródło: https://github.com/MajkiIT/polish-ads-filter (`polish-adblock-filters/adblock.txt` z plikami dołączanymi)
- Licencja: **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** – https://creativecommons.org/licenses/by-nc-sa/4.0/
- Zmiany: filtry są przekształcane do formatu ChromeBlock (reguły `declarativeNetRequest`, filtry kosmetyczne, scriptlety) i łączone z innymi listami w liście `ads`.
- Uwaga: licencja zawiera klauzulę **NonCommercial** – status `NEEDS LEGAL REVIEW` w `docs/filter-provenance.md`.
- Używane w liście ChromeBlock: `ads`
