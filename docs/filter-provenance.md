# Pochodzenie i licencje list filtrów (audyt provenance)

Stan na: 2026-10-26, `main` = `07ffd5eec4849f727f122b04bf712a379971f7ea`.

Ten dokument opisuje fakty ustalone z repozytorium i z upstreamów. **Nie jest opinią prawną.** Pozycje oznaczone `NEEDS LEGAL REVIEW` wymagają oceny prawnika przed publicznym wydaniem. Skrócona lista uznań autorstwa jest w [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md).

Statusy:
- `VERIFIED` – źródło, licencja i wersja snapshotu potwierdzone w upstreamie (dowody niżej);
- `UNKNOWN` – nie da się ustalić z dostępnych danych;
- `NEEDS LEGAL REVIEW` – fakty są znane, ale skutki prawne (np. utwór zależny, share-alike, NonCommercial) wymagają oceny prawnika.

## 1. Jak listy trafiają do ChromeBlock

1. `tools/update-lists.mjs` pobiera listy (tekst) z URL-i upstreamu do `tools/lists/` (snapshoty są w repozytorium).
2. `tools/build.mjs` wczytuje źródła z `tools/lists-config.mjs` (`LISTS`), rozwija `!#include` i `!#if` (środowisko jak uBO Lite / MV3: `ext_ublock`, `ext_ubol` = prawda; `env_mobile`, `adguard` = fałsz) i kompiluje je do plików rozszerzenia.
3. Paczka (`tools/package-dev.mjs`) zawiera **tylko wygenerowane pliki**, nie surowe listy (`tools/` nie wchodzi do paczki).

Wygenerowane pliki na listę ChromeBlock (`<id>` = `ads`, `privacy`, `security`):

| Plik | Zawartość |
|---|---|
| `rules/<id>.json` | reguły `declarativeNetRequest` z filtrów sieciowych |
| `data/<id>.json` | filtry kosmetyczne (selektory, procedury) |
| `data/<id>.allow.json` | wyjątki |
| `data/<id>.scriptlets.json` + `scriptlets/<id>-N.js` | scriptlety: własna biblioteka ChromeBlock (`tools/scriptlets-lib.js`) + argumenty filtrów `##+js(...)` z list |
| `data/lists.json`, `data/badfilter-cross.json`, `data/scriptlet-compat.json`, `data/youtube-compat.json` | statystyki i metadane kompilacji (liczby, ID reguł; bez treści filtrów) |

**Łączenie źródeł w jednym artefakcie** (każdy plik powyżej dla danej listy zawiera wszystkie jej źródła razem):

| Lista ChromeBlock | Źródła połączone w jednym zestawie plików | Licencje w jednym artefakcie |
|---|---|---|
| `ads` | EasyList + uBlock filters (filters, quick-fixes, unbreak) + Polskie Filtry | GPL-3.0+ / CC BY-SA 3.0+ (wybór) + GPL-3.0 + **CC BY-NC-SA 4.0** |
| `privacy` | EasyPrivacy + uBlock filters – Privacy (z Resource abuse) | GPL-3.0+ / CC BY-SA 3.0+ (wybór) + GPL-3.0 |
| `security` | uBlock filters – Badware risks | GPL-3.0 |

## 2. Źródła używane przez build

### 2.1 EasyList i EasyPrivacy – `VERIFIED`

| | EasyList | EasyPrivacy |
|---|---|---|
| Projekt upstream | EasyList (https://easylist.to/, https://github.com/easylist/easylist) | jw. |
| URL źródłowy (`tools/update-lists.mjs`) | `https://easylist.to/easylist/easylist.txt` | `https://easylist.to/easylist/easyprivacy.txt` |
| Snapshot w repo | `tools/lists/easylist/easylist.txt` | `tools/lists/easylist/easyprivacy.txt` |
| Lista ChromeBlock | `ads` | `privacy` |
| Wersja (nagłówek pliku) | `Version: 202610211530`, `Last modified: 21 Oct 2026 15:30 UTC`, `Commit: 9f43d878caa40512c8ad2fd1bd6a64163f3dc4db` | identycznie |
| Revision upstream | commit `9f43d878caa40512c8ad2fd1bd6a64163f3dc4db` istnieje w `easylist/easylist` (2026-10-22 04:29:42 +1300 = 2026-10-21 15:29 UTC, „M: Update”) | jw. |
| SHA-256 snapshotu | `5750a60c7af11a209d09d0b2a989c1a3cc9309758b556ee41b0703e43256b808` | `f2a2aeea3b1dac02a95a04e17e9b360a346836d3c4ffc66a92df4db00dd140fb` |
| Licencja | podwójna: GPL-3.0-or-later **albo** CC BY-SA 3.0 Unported or later | jw. |
| Źródło licencji | nagłówek listy: `Licence: https://easylist.to/pages/licence.html`; README repo: „Visit easylist.to/pages/licence.html” | jw. |
| Wymagane uznanie autorstwa | wg strony licencji: „The EasyList authors (https://easylist.to/)” | jw. |

Dowody:
- Strona https://easylist.to/pages/licence.html: zawartość repozytorium „is dual licensed under the GNU General Public License version 3 of the License, or (at your option) any later version” oraz „Creative Commons Attribution-ShareAlike 3.0 Unported, or (at your option) any later version”; atrybucja: „The EasyList authors (https://easylist.to/)”; pliki z zewnętrznych źródeł „may be available under other conditions”.
- Niezależne potwierdzenie: Debian `ublock-origin` copyright – `Files: uAssets/thirdparties/easylist/*`, `License: GPL-3+ or CC-BY-SA-3.0+`.
- Plik listy jest artefaktem budowanym z szablonów repozytorium (nie leży w repo upstreamu jako plik), więc bajtowej zgodności z commitem nie da się sprawdzić; commit i znacznik czasu w nagłówku zgadzają się z historią upstreamu.

### 2.2 uBlock filters (uAssets) – `VERIFIED`

| | |
|---|---|
| Projekt upstream | uBlock Origin – uAssets, https://github.com/uBlockOrigin/uAssets |
| URL źródłowy | `https://ublockorigin.github.io/uAssets/filters/<nazwa>.txt` |
| Licencja | GPL-3.0 (plik `LICENSE` w repozytorium: „GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007”) |
| Źródło licencji | nagłówek każdej listy: `License: https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE`; blob `LICENSE` = `9cecc1d4669ee8af2ca727a5d8cde10cd8b2d7cc`, identyczny w commicie snapshotu i w `master` z 2026-10-26 |
| Uznanie autorstwa | upstream nie podaje formuły; nagłówki list nie zawierają linii Copyright. README/Opcje ChromeBlock piszą „© Raymond Hill i współtwórcy” – to opis ChromeBlock, nie tekst upstreamu |
| Obowiązki licencji | GPL-3.0: m.in. dołączenie tekstu licencji i dostęp do źródła przy dystrybucji (zob. sekcja 5) |

Nagłówki `Last modified: %timestamp%` nie zawierają daty. Wersję ustalono porównaniem hashy: `git hash-object` każdego snapshotu jest **bajtowo identyczny** z blobem w historii `uBlockOrigin/uAssets` (`master`, ścieżka `filters/<nazwa>.txt`). Kolumna „commit” = najstarszy commit, w którym ta treść pojawiła się w upstreamie.

| Snapshot (`tools/lists/ubo/`) | Rola w buildzie | Lista ChromeBlock | Git blob | Commit upstream (treść identyczna od) | SHA-256 |
|---|---|---|---|---|---|
| `filters.txt` | źródło | `ads` | `febbadee85966cfae5409bb5125defe3c93f9a6d` | `794263c7392c4edc54afda88af7b56e853750562` (2026-10-20) | `758e1160aa051f1a0b095a5e8a899f4d66aef9d2f7ac9e3b00241d3074f4b852` |
| `filters-general.txt` | `!#include` z `filters.txt` | `ads` | `ea9e1970323739a73138d86ed0309cc4e131ba4f` | `61c6653485766202845083aaa3706f88e0be88d3` (2026-10-21) | `9ea476e66140b8bb7d24a3dfb7dd4f732f0a60c122da5998765d0efe1f7603ef` |
| `filters-2020.txt` | `!#include` | `ads` | `6ce278327ab568fe0f9d7ee4fb20208bed6fee90` | `11500ceb8c9e1e40588a02804289b238f7b9a805` (2026-10-14) | `2bf0991064d5d4c4628504ce1c8aecf884f5ee1e7f4fe7b09bb362e95d9667d0` |
| `filters-2021.txt` | `!#include` | `ads` | `842ebc572af8b3a2eecc68045eee4cbf4c131db6` | `e3833004c7f7d417244d786d1eb869cba8906d94` (2026-10-21) | `f8e8dbea4f3f516ff1844528ab48031ffc348f90eca40aef5bfe1c0840000f89` |
| `filters-2022.txt` | `!#include` | `ads` | `8947c204685f712e4fccf297199013cc9f66cff4` | `40ae52a08ed4ffb10af7dca3d9572daba540d2d9` (2026-10-14) | `21ca4be14e23e107eecd4dc4982dc14b9c78536f778a99d02def5a01480bf920` |
| `filters-2023.txt` | `!#include` | `ads` | `e672011da71d5a2be723a7c7c3ede6f2e6a73691` | `6b05d1fe035523461af9f51f948b57debed52b3c` (2026-10-17) | `03f6d30d6a1768f196974d675fd847400e1a65b8eacbc504a41145058c7bafe7` |
| `filters-2024.txt` | `!#include` | `ads` | `2f22504d1ad631969eef2859a2f24f226a861601` | `a86fc6601640f50a397b3991b3f4142c895fdf19` (2026-10-19) | `36d34d0b29a107b206986ea546de8b07d483e7ec5fd53f6140ebe3a68f38495a` |
| `filters-2025.txt` | `!#include` | `ads` | `5bdf21f1738cdeaa369013c6befcdc42ea2a469d` | `3717011d37e010f3f099f0ac5bfa8f1dc26b9725` (2026-10-15) | `22a52f8a04def6aaed8453ec4d94a8d193d7b3dcc9ed921c9b69eda50420df17` |
| `filters-2026.txt` | `!#include` | `ads` | `8f140bab540bbd3850694c808987813b4a8a2192` | `f48b599f166f4e8914ddc77c8f4dbcd68932c2a7` (2026-10-21) | `f70eee4887b8b3f6e551e62d1381eff5bffb4aa921461ae543894832ec79547d` |
| `ubo-link-shorteners.txt` | `!#include` | `ads` | `625121b24da38905a373f1a7d5a253901c6399ce` | `f18f45a46f912f933b8114804633c67f41314014` (2026-10-19) | `97d06797f23d945715ea7a2d74acaf4f91b85fc5f12b7d4c98841b5b570ed440` |
| `filters-mobile.txt` | `!#include` pod `!#if env_mobile` – **nie kompilowany** | – | `1bfe8f2f9dc805d475fdd5c0c167a054b18e5989` | `c974253afeb73e0dc26f5292dc96f8aca173a40b` (2026-09-29) | `d47b240a3305d4ff5d401dbe13297cac4500cb60c4758b46e33cc118e6cbe81e` |
| `quick-fixes.txt` | źródło | `ads` | `aa73645c5caba31f17ecc81157d21c2bc302ab0f` | `077058ac6340f4bf1f41a8c070cbe29d0e817b09` (2026-10-21) | `b6d020a9712ed2ce87f3bd6ef5e2b2568bc29ef54baa8fb84dcb40a57ec79187` |
| `unbreak.txt` | źródło | `ads` | `fb3c799956fdbee27eec8279a3ec0fe8b0771395` | `328cbf1a6f839ee5f59c49fda0690ef96c4f05d0` (2026-10-20) | `3a3ccd5eef22b0f37f801cacd48953aa9c7099fcd26a3a121c007de88847eb54` |
| `privacy.txt` | źródło | `privacy` | `1cf61356aea5c01370f37d73faf0160e53438cce` | `36e06e6750f2d2eb23ecc0dfff941afb33bf8714` (2026-10-18) | `13db98de1f6775fbfd08fdbe9a76d8f37e3914b17c75b7deb9e4c0e74a676428` |
| `resource-abuse.txt` | `!#include` z `privacy.txt` | `privacy` | `8f8a0bc7d2c324daf6b63114e587e03fd2a30c15` | `85e4437cee2620e16e21d0f376d1505024203688` (2026-10-02) | `26758d49f533218b559207724a3d294d1fa74e36cdce080999bc1b7f96ad552a` |
| `badware.txt` | źródło | `security` | `c6524abd40fa01f4bbacfb6144bad3771af3b6d9` | `323a2939963b099ef14f7f2ab678b49c70c0e0b6` (2026-10-21) | `55a5c5405e4806832bd6f470810564b7a5816c518085f87cbfb2059823151f0a` |

Uwagi:
- Filtry „trusted” (`trusted: true` w `lists-config.mjs`) mogą zawierać fragmenty kodu JS w argumentach scriptletów – też są treścią tych list (GPL-3.0).
- Lista „security” to wyłącznie uBlock filters – Badware risks. Żadne inne listy malware (np. URLhaus) nie są używane.

### 2.3 Polskie Filtry (Official Polish Filters, MajkiIT / Certyficate IT) – `NEEDS LEGAL REVIEW`

> **Klauzula NonCommercial.** Licencja CC BY-NC-SA 4.0 zabrania korzystania w celach komercyjnych i wymaga share-alike dla materiału adaptowanego. Te dane są wkompilowane w artefakty listy `ads` razem z treściami GPL-3.0.

| | |
|---|---|
| Projekt upstream | https://github.com/MajkiIT/polish-ads-filter (strona: https://www.certyficate.it) |
| URL źródłowy | `https://raw.githubusercontent.com/MajkiIT/polish-ads-filter/master/polish-adblock-filters/<plik>` |
| Licencja | **CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International) |
| Źródło licencji | nagłówek `adblock.txt`: `License: https://creativecommons.org/licenses/by-nc-sa/4.0/`; plik `LICENSE` w repo: „Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License” (blob `72afcdcc6032e2e6018b4543383422f6836b77b4`, ten sam w commicie snapshotu i w `master` z 2026-10-26) |
| Linia copyright (nagłówek `adblock.txt`) | `Copyright © 2026 Certyficate IT` |
| Wymagane informacje (CC BY-NC-SA 4.0, §3) | identyfikacja twórcy, informacja o prawach autorskich, o licencji i o wyłączeniu gwarancji, URI materiału; wskazanie modyfikacji; materiał adaptowany pod tą samą lub zgodną licencją (BY-NC-SA) |

| Snapshot (`tools/lists/pl/`) | Rola w buildzie | Lista ChromeBlock | Wersja (nagłówek) | Git blob | Commit upstream (treść identyczna od) | SHA-256 |
|---|---|---|---|---|---|---|
| `adblock.txt` | źródło | `ads` | `Version: 20261012001`; `Last modified: 20 November 2026` (sic) | `a87d2107f8e615a046d45c3e3357e7c6262c6356` | `b5eb4000fb6b0d297d7abd05203db07e9877b2fe` (2026-10-20) | `15a72737099f9335c4129f6b36318ce18ebd02a41ce27e65d5ead1de953880ad` |
| `adblock_suplement.txt` | `!#include` (bezwarunkowo) | `ads` | `Version: 2026041301` | `4e9923b178f10aaa86b8284caf4947bf066c9f8f` | `9d42f99a95eb13e2c525d0f2284f9c4dd89b8f3d` (2026-07-20) | `8744c5ba3e8587ef0ab7c1c4a09eec2ec7bbf2dd1724a2900b9936fc4d067ea5` |
| `adblock_ublock.txt` | `!#include` pod `!#if ext_ublock` (prawda) | `ads` | `Version: 2026081501` | `f49cc6403f52dcdc3c5a59234c11ebbfc4b75327` | `99ae8ae93d3db9276e00faff40ccf658b677219f` (2026-09-20) | `844a87639f3b05be48cdcaef987f6b26129de4efa5fcf00ee3aeffbf106c56a3` |
| `adblock_adguard.txt` | `!#include` pod `!#if adguard` (fałsz) – **nie kompilowany** | – | `Version: 2026012501` | `63d74d7b80cfd0326a544f40ea235e9d71cc6bb2` | `9d42f99a95eb13e2c525d0f2284f9c4dd89b8f3d` (2026-07-20) | `d6319c00e7e417784fbdecb476e37cd1ea7e9b5a14022ba8713a7fe4ad2a92e5` |

Uwagi:
- Nagłówek `adblock.txt` podaje `Last modified: 20 November 2026`, a `Version: 20261012001` i linia „aktualizacja: wt, 20 pazdziernika 2026”. Daty są niespójne w samym upstreamie; zapisane dosłownie.
- README i strona Opcji ChromeBlock piszą „© MajkiIT”, a nagłówek listy „Copyright © 2026 Certyficate IT”. Do ujednolicenia po przeglądzie prawnym (zmiana tekstu UI nie jest częścią tego audytu).
- Audyt odczytał wyłącznie nagłówek, `LICENSE`, `README.md` i `STATEMENT.md` upstreamu oraz hashe plików (bez czytania reguł) – zgodnie z zasadą clean room dla własnej listy uzupełniającej.

## 3. Snapshoty w repozytorium, których build nie używa

Są w `tools/lists/` (git), nie są w `LISTS` ani pobierane przez `update-lists.mjs`, nie trafiają do aktualnie budowanych plików. Pozostałość po usuniętych listach `cookies` / `annoyances` (wersja 1.0 ich nie ma).

| Snapshot | Projekt / licencja | Wersja | Git blob / commit upstream | Status |
|---|---|---|---|---|
| `easylist/fanboy-annoyance.txt` | EasyList (Fanboy's Annoyance List), GPL-3.0+ / CC BY-SA 3.0+ (`Licence: https://easylist.to/pages/licence.html`) | `Version: 202610211530`, `Commit: 9f43d878…` | blob `1be3b4b59b44bce5068e06eacc431bc91d6b3ed4` | `VERIFIED` |
| `ubo/annoyances-cookies.txt` | uBlock filters – Cookie Notices, GPL-3.0 | `%timestamp%` | blob `2163219a2cbcf772f3cb7c5682928d60c2ac1159`, commit `7c9092b3a97670535a1736a9efb351e2022b43b9` (2026-10-19) | `VERIFIED` |
| `ubo/annoyances-others.txt` | uBlock filters – Other Annoyances, GPL-3.0 | `%timestamp%` | blob `a25d3c1756722f66c06153de8ee26be0fb6a3fb5`, commit `a9a7f558568926fa8377f12e62488ca1c8039b19` (2026-10-21) | `VERIFIED` |

Te pliki są nadal redystrybuowane w repozytorium (obecnie prywatnym).

## 4. Elementy niebędące listami (dla pełności)

- `tools/scriptlets-lib.js`, `shared/jsonpath.js`, `web_accessible_resources/*.js` (atrapy `adsbygoogle`, `gpt`, `apstag`, Google Analytics) – w nagłówkach oznaczone jako implementacja własna ChromeBlock; nazwy plików odpowiadają nazwom zasobów `redirect=` z list uBO (zgodność składni). W repozytorium nie znaleziono nagłówków copyright ani licencji osób trzecich. Pochodzenie kodu nie było przedmiotem tego audytu (dotyczy list).
- Testy (`tests/**`) zawierają pojedyncze linie filtrów jako dane testowe; nie ustalono, które pochodzą z list upstream – `UNKNOWN` (nie trafiają do paczki).

## 5. Pozycje `UNKNOWN` i `NEEDS LEGAL REVIEW`

`NEEDS LEGAL REVIEW`:
1. **Polskie Filtry – CC BY-NC-SA 4.0 (NonCommercial + ShareAlike).** Czy darmowa dystrybucja ChromeBlock (ewentualnie w Chrome Web Store) mieści się w „NonCommercial”, oraz czy skompilowane reguły DNR / kosmetyka / argumenty scriptletów to „Adapted Material” podlegający share-alike.
2. **Mieszanie licencji w jednym artefakcie listy `ads`:** EasyList (GPL-3.0+ albo CC BY-SA 3.0+), uBlock filters (GPL-3.0) i Polskie Filtry (CC BY-NC-SA 4.0) w tych samych plikach `rules/ads.json`, `data/ads*.json`, `scriptlets/ads-*.js`. CC BY-NC-SA 4.0 nie jest wymieniona jako zgodna z GPL-3.0; skutki wymagają oceny.
3. **Obowiązki GPL-3.0 / CC BY-SA przy dystrybucji paczki:** paczka nie zawiera tekstów licencji ani informacji o dostępie do źródeł list; uznanie autorstwa jest tylko w zakładce „O wtyczce” w Opcjach. Do ustalenia: czy i w jakiej formie dołączyć teksty licencji / notice / źródło.
4. **Licencja kodu ChromeBlock:** repozytorium nie ma pliku licencji. Audyt niczego nie dodaje; skutki połączenia z treściami GPL-3.0 (scriptlety łączą własny kod z argumentami filtrów w jednym pliku) do oceny prawnika.
5. **Commitowana paczka `download/ChromeBlock-dev.zip` jest nieaktualna** (0.3.4-dev z 2026-10-25): nadal zawiera artefakty list `cookies` i `annoyances` (uBlock filters – Cookie Notices, Fanboy's Annoyance, uBlock filters – Other Annoyances). Nie zmieniona w tym audycie (bez budowania ZIP).

`UNKNOWN`:
1. Dokładna wersja EasyList/EasyPrivacy jako pliku: commit źródłowy znany (`9f43d878…`), ale bajtowej zgodności pliku zbudowanego przez EasyList nie da się sprawdzić (plik nie jest przechowywany w repo upstreamu).
2. Pochodzenie pojedynczych linii filtrów w testach (sekcja 4).

## 6. Aktualizacja tego dokumentu

Po `node tools/update-lists.mjs` zaktualizuj wersje, hashe i commity w sekcjach 2–3. `tests/tools/filter-provenance.test.mjs` pilnuje, żeby każde źródło skonfigurowane w `LISTS` (wraz z plikami dołączanymi przez `!#include`) i każdy plik w `tools/lists/` był tu opisany, a licencje były wymienione w `THIRD_PARTY_NOTICES.md`.
