# Audyt licencji – listy filtrów i inne dane stron trzecich

| | |
|---|---|
| Stan kodu | `main` @ `cffd9d36145b9b41619713ab2c3cfeb77e4cec7c` (ChromeBlock 0.3.4-dev) |
| Data audytu | 2026-10-25 |
| Cel | Ustalić, co dokładnie dystrybuujemy i jakie obowiązki licencyjne deklarują źródła przed publicznym wydaniem w Chrome Web Store |
| Charakter | Inwentaryzacja faktów i deklaracji upstream. **To nie jest opinia prawna.** Punkty niejasne oznaczono `REQUIRES LEGAL/UPSTREAM CONFIRMATION` |

## 1. Co dokładnie dystrybuujemy

ChromeBlock jest rozpowszechniany na dwa sposoby. Każdy zawiera inną postać danych stron trzecich.

| Kanał | Co zawiera | Postać list filtrów |
|---|---|---|
| **Repozytorium GitHub** (`Bonziuu/Chromeblock`, obecnie **prywatne**) | `tools/lists/**` – 25 plików tekstowych list | **Kopie surowe**, pobrane przez `tools/update-lists.mjs` i zapisane bez zmian (od pierwszego commita `a2091e2` nie było żadnych ręcznych edycji). Zgodności bajtowej z bieżącym upstream nie dało się sprawdzić w tej sesji, bo sieć była ograniczona. |
| | `rules/*.json`, `data/*.json`, `scriptlets/*.js` | **Postać przetworzona** (wynik `npm run build`) |
| **Paczka rozszerzenia** (`download/ChromeBlock-dev.zip`, w przyszłości paczka w Chrome Web Store) | `rules/`, `data/`, `scriptlets/`, `web_accessible_resources/` | **Tylko postać przetworzona.** Surowych list (`tools/lists/`) w paczce nie ma |

Przetwarzanie w `tools/build.mjs` polega na tym, że:

- dyrektywy `!#if` / `!#include` są rozwiązywane w środowisku „uBO Lite / Chromium” (np. `adblock_adguard.txt` i `filters-mobile.txt` zostają pominięte);
- komentarze, w tym **nagłówki z licencją i prawami autorskimi**, są usuwane;
- filtry nieobsługiwane w MV3 lub przez silnik ChromeBlock są odrzucane;
- filtry sieciowe trafiają do reguł `declarativeNetRequest` (`rules/<lista>.json`, deduplikacja, priorytety, nowe `id`);
- filtry kosmetyczne i wyjątki trafiają do `data/<lista>.json`;
- argumenty scriptletów trafiają do `scriptlets/<lista>-<n>.js` razem z biblioteką scriptletów ChromeBlock (`tools/scriptlets-lib.js`, `shared/jsonpath.js`).
- **Filtry z różnych źródeł są łączone w jednym pliku wyjściowym.** Na przykład lista „Reklamy” (`ads`) łączy EasyList, uBlock filters i Polskie Filtry w `rules/ads.json`, `data/ads.json` i `scriptlets/ads-*.js`.

W paczce rozszerzenia **nie ma** tekstów licencji, plików NOTICE ani nagłówków list. Repozytorium **nie ma pliku `LICENSE`** dla samego kodu ChromeBlock.

**Widoczność repozytorium.** Stan na 2026-10-25 według GitHub API: `private`. Surowe listy, narzędzia buildu i informacje o licencjach są więc dziś dostępne tylko dla właściciela repozytorium. Nie można na nich polegać jako na publicznym źródle ani publicznej nocie dla użytkowników paczki. Przed publiczną dystrybucją trzeba ustalić, jak udostępnić wymagane źródła i noty, jeśli wynika to z wybranych licencji. Możliwe sposoby to m.in. upublicznienie repozytorium, osobne publiczne repozytorium lub archiwum źródeł, albo dołączenie not i tekstów licencji do paczki. To `REQUIRES LEGAL/UPSTREAM CONFIRMATION`, bo zakres obowiązku zależy od rozstrzygnięć z sekcji 3.

## 2. Źródła – zestawienie

Legenda: TAK / NIE / `?` = `REQUIRES LEGAL/UPSTREAM CONFIRMATION`.

| # | Źródło | Licencja deklarowana | Attribution | Tekst licencji | ShareAlike | NonCommercial | Kopia w repo / w paczce |
|---|---|---|---|---|---|---|---|
| 1 | EasyList | GPL-3.0-or-later **lub** CC BY-SA 3.0 Unported or later (podwójna, do wyboru) | TAK | TAK lub URI (zależnie od wybranej licencji) | TAK | NIE | niezmodyfikowana / przetworzona |
| 2 | EasyPrivacy | jak wyżej | TAK | jak wyżej | TAK | NIE | niezmodyfikowana / przetworzona |
| 3 | Fanboy's Annoyance List | jak wyżej, przez nagłówek `Licence: easylist.to/pages/licence.html` | TAK | jak wyżej | TAK | NIE | niezmodyfikowana / przetworzona (`?` źródło pobrania: `secure.fanboy.co.nz`) |
| 4 | uBlock filters (uAssets) – 18 plików | GPL-3.0 (plik `LICENSE` w uAssets) | TAK (zachowanie informacji) | TAK | TAK (copyleft) | NIE | niezmodyfikowana / przetworzona |
| 5 | **Polskie Filtry Reklamowe** (Certyficate IT / MajkiIT) – 4 pliki | **CC BY-NC-SA 4.0** | TAK | TAK lub URI | **TAK** | **TAK** | niezmodyfikowana / przetworzona |
| 6 | Zasoby `web_accessible_resources/` (atrapy skryptów, puste obrazy i pliki) | brak – kod własny ChromeBlock | – | – | – | – | własne |
| 7 | Biblioteka scriptletów i JSONPath (`tools/scriptlets-lib.js`, `shared/jsonpath.js`) | brak – kod własny („implementacja własna”) | – | – | – | – | własne (`?` pochodzenie, zob. 3.6) |
| 8 | Playwright (zależność testera) | Apache-2.0 | – | – | NIE | NIE | **nie jest dołączany** (instalowany przez `npm` u użytkownika testera) |

## 3. Szczegóły źródeł

### 3.1 EasyList, EasyPrivacy, Fanboy's Annoyance List

- **Upstream:** https://easylist.to/, https://github.com/easylist/easylist
- **Pliki w repo:**
  - `tools/lists/easylist/easylist.txt` (EasyList, `Version: 202610211530`, URL: `https://easylist.to/easylist/easylist.txt`);
  - `tools/lists/easylist/easyprivacy.txt` (EasyPrivacy, `https://easylist.to/easylist/easyprivacy.txt`);
  - `tools/lists/easylist/fanboy-annoyance.txt` (Fanboy's Annoyance List, `https://secure.fanboy.co.nz/fanboy-annoyance.txt`).
- **Trafiają do:**
  - EasyList → `ads` (`rules/ads.json`, `data/ads*.json`, `scriptlets/ads-*.js`);
  - EasyPrivacy → `privacy`;
  - Fanboy → `annoyances`.
- **Nagłówek każdej listy:** `! Licence: https://easylist.to/pages/licence.html`
- **Deklaracja upstream** (easylist.to/pages/licence.html, odczyt 2026-10-25):
  - Zawartość repozytorium EasyList jest licencjonowana podwójnie, „unless otherwise noted”: GNU GPL v3 „or (at your option) any later version” oraz Creative Commons Attribution-ShareAlike 3.0 Unported „or (at your option) any later version”.
  - Można korzystać z plików „as permitted by either licence”.
  - Wymóg uznania autorstwa: „The EasyList authors (https://easylist.to/) should be attributed as the source of the material.”
  - Zastrzeżenie: pliki „hosted externally and referenced in the repository … may be available under other conditions”.
- **Obowiązki deklarowane w licencjach** (zależnie od wybranej licencji):
  - GPLv3: zachowanie informacji o prawach autorskich, dołączenie tekstu GPL, udostępnienie „Corresponding Source” przy przekazywaniu postaci nie-źródłowej, oznaczenie modyfikacji.
  - CC BY-SA 3.0: uznanie autorstwa, URI licencji, ta sama lub kompatybilna licencja dla utworów zależnych, zakaz środków technicznych ograniczających prawa licencji.
- **Gdzie podajemy attribution teraz:**
  - README → „Źródła list i licencje”;
  - Opcje → „Jak to działa” → „Listy filtrów”.
  - Treść w obu miejscach: „© The EasyList authors (GPLv3 / CC BY-SA 3.0)”, bez linku do licencji i bez „or later”.
- **Otwarte punkty:**
  - `?` Która z dwóch licencji jest wybierana dla dystrybucji w paczce oraz czy przetworzone reguły DNR (`rules/*.json`) to „object code” lub utwór zależny w rozumieniu GPLv3 / „Adaptation” w rozumieniu CC BY-SA 3.0 (wpływa na wymagane pliki i udostępnianie źródła).
  - `?` Fanboy's Annoyance List pobierana jest z `secure.fanboy.co.nz`, czyli spoza `easylist.to`. Nagłówek odsyła do licencji EasyList, a upstream zastrzega, że pliki hostowane zewnętrznie mogą mieć inne warunki. Ten plik należy do repozytorium EasyList (`fanboy-addon`), ale trzeba to potwierdzić.

### 3.2 uBlock filters (uAssets)

- **Upstream:** https://github.com/uBlockOrigin/uAssets (pobierane z `https://ublockorigin.github.io/uAssets/filters/`)
- **Pliki w repo** (`tools/lists/ubo/`):
  - `filters.txt`, `filters-general.txt`, `filters-2020.txt` … `filters-2026.txt`, `filters-mobile.txt`, `ubo-link-shorteners.txt`, `quick-fixes.txt`, `unbreak.txt` → `ads`;
  - `privacy.txt`, `resource-abuse.txt` → `privacy`;
  - `badware.txt` → `security`;
  - `annoyances-cookies.txt` → `cookies`;
  - `annoyances-others.txt` → `annoyances`.
  - `filters-mobile.txt` jest w repo, ale build go pomija (`!#if env_mobile`).
- **Nagłówek:** `! License: https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE`. Nagłówki nie podają imiennie posiadacza praw.
- **Deklarowana licencja:** GPLv3. Według mirrora uAssets (SourceForge): „GNU General Public License version 3.0 (GPLv3)”. Pliku `LICENSE` nie udało się pobrać w tej sesji (sieć ograniczona).
- **Uwaga – kod w filtrach:**
  - Filtry „trusted” (np. `trusted-rpnt` w `quick-fixes.txt`) zawierają **fragmenty JavaScriptu wstrzykiwane do stron**.
  - Po buildzie ten kod jest wklejany do `scriptlets/ads-*.js` (np. `scriptlets/ads-17.js`) **w jednym pliku z kodem ChromeBlock**.
- **Obowiązki deklarowane w GPLv3:** zachowanie informacji o prawach autorskich i licencji, dołączenie tekstu GPL, udostępnienie „Corresponding Source” przy przekazywaniu postaci nie-źródłowej, oznaczenie modyfikacji, przekazywanie dalej na tej samej licencji.
- **Gdzie podajemy attribution teraz:**
  - README i Opcje: „uBlock filters (© Raymond Hill i współtwórcy, GPLv3)”;
  - bez linku do licencji i bez tekstu GPL w paczce.
- **Otwarte punkty:**
  - `?` Poprawna nota o prawach autorskich. W nagłówkach list nie ma imiennego posiadacza praw, a formuła „© Raymond Hill i współtwórcy” pochodzi od nas.
  - `?` Czy wklejenie kodu z filtrów GPL do `scriptlets/*.js` razem z kodem ChromeBlock tworzy utwór łączny, który wymaga licencji zgodnej z GPLv3 dla całości pliku lub rozszerzenia.
  - `?` ChromeBlock nie ma zadeklarowanej licencji (brak `LICENSE`).

### 3.3 Polskie Filtry Reklamowe – CC BY-NC-SA 4.0 (szczegółowo)

**Upstream**

- Repozytorium: https://github.com/MajkiIT/polish-ads-filter
- Strona: https://www.certyficate.it, https://majkiit.github.io/polish-ads-filter/
- Pobierane z: `https://raw.githubusercontent.com/MajkiIT/polish-ads-filter/master/polish-adblock-filters/`

**Pliki w repo** (`tools/lists/pl/`)

| Plik | Wersja | Nagłówek „Copyright” | Czy wchodzi do buildu |
|---|---|---|---|
| `adblock.txt` | 20261012001 | `Copyright © 2026 Certyficate IT` | TAK → `ads` |
| `adblock_suplement.txt` | 2026041301 | `Copyright © 2026 Certyficate IT` | TAK (`!#include`) → `ads` |
| `adblock_ublock.txt` | 2026081501 | `Copyright © 2025 Certyficate IT` | TAK (`!#if ext_ublock` = true) → `ads` |
| `adblock_adguard.txt` | 2026012501 | `Copyright © 2025 Certyficate IT` | NIE (`!#if adguard` = false), ale **jest w repo** |

**Nagłówek każdego pliku**

- `! License: https://creativecommons.org/licenses/by-nc-sa/4.0/`
- Lista współtwórców (`Collaborators:`, w `adblock.txt` 23 osoby).
- Klauzula „Używanie Oficjalnych Polskich Filtrów jest jednoznaczne ze świadomością co do ich zawartości … twórcy nie ponoszą odpowiedzialności za niewiedzę użytkownika”.

**Gdzie trafiają w paczce**

Filtry są wymieszane z EasyList i uBlock filters w plikach listy „Reklamy” (`rules/ads.json`, `data/ads.json`, `data/ads.allow.json`, `data/ads.scriptlets.json`, `scriptlets/ads-*.js`). Lista „Reklamy” jest **domyślnie włączona** we wszystkich trybach (Basic/Balanced/Strict). Polskie filtry nie są w paczce oznaczone ani oddzielone.

**Warunki CC BY-NC-SA 4.0** (Legal Code, cytaty za SPDX `CC-BY-NC-SA-4.0`, odczyt 2026-10-25)

- **NonCommercial** (sekcja 1(k)): „NonCommercial means not primarily intended for or directed towards commercial advantage or monetary compensation.”
- **Attribution** (sekcja 3(a)(1)): przy udostępnianiu trzeba zachować, jeśli licencjodawca je dostarczył:
  - „identification of the creator(s) of the Licensed Material and any others designated to receive attribution”;
  - „a copyright notice”;
  - „a notice that refers to this Public License”;
  - „a notice that refers to the disclaimer of warranties”.
- Trzeba też:
  - „indicate if You modified the Licensed Material and retain an indication of any previous modifications” (3(a)(1)(B));
  - „indicate the Licensed Material is licensed under this Public License” (3(a)(1)(C)).
- Według 3(a)(2) można to zrobić „in any reasonable manner”, np. przez URI / hiperłącze do zasobu z wymaganymi informacjami.
- **ShareAlike** (3(b)): „The Adapter's License You apply must be a Creative Commons license with the same License Elements, this version or later, or a BY-NC-SA Compatible License.”
- **Brak dodatkowych ograniczeń** (2(a)(5)(C)): nie wolno nakładać dodatkowych warunków ani stosować „Effective Technological Measures”, jeśli ogranicza to korzystanie z praw licencji.

**Ustalenia i rozbieżności**

1. **Posiadacz praw.** Nagłówki list podają „Certyficate IT”, a my w README i Opcjach piszemy „© MajkiIT”. Nasza nota nie odpowiada nocie upstream.
2. **Licencja repozytorium.** Licencję potwierdzają nagłówki plików i plik archiwalny `adblock_test.txt` w repo upstream (`License: …by-nc-sa/4.0/`, `Copyright (C) 2021 Certyficate IT`). Strona GitHub pliku nie pokazuje licencji repozytorium w panelu bocznym. Pliku `LICENSE` w repo upstream nie udało się w tej sesji odczytać (sieć ograniczona).
3. **Strona projektu ma inną stopkę.** Na majkiit.github.io/polish-ads-filter stopka mówi „CC BY 4.0” obok „Wszelkie prawa zastrzeżone” i „2020–2026 MajkiIT”. Nie wyjaśnia, czego dotyczy. Może chodzić o samą stronę, a nie o listy.
4. **STATEMENT.md** w repo upstream mówi m.in.: „Nie możemy odpowiadać za sposób w jaki rozszerzenia blokujące reklamy korzystają z naszych list”. Nie ma tam wprost zgody ani zakazu dla osadzania list w innych rozszerzeniach i nie ma informacji o licencjonowaniu komercyjnym.
5. **Kontakt upstream:**
   - `errorsfilters@certyficate.it` (nagłówek `adblock.txt`);
   - `errors@certyficate.it` (starszy plik);
   - GitHub Issues: https://github.com/MajkiIT/polish-ads-filter/issues.
   - Nie znaleziono osobnego kanału do spraw licencji.

**Kwestie `REQUIRES LEGAL/UPSTREAM CONFIRMATION`**

- `?` **NonCommercial a Chrome Web Store.** Ustalić, czy dystrybucja darmowego rozszerzenia przez Chrome Web Store mieści się w „NonCommercial”. Dotyczy to też planowanych opcjonalnych linków „Wesprzyj rozwój” z `docs/product-direction.md`, bo licencja mówi o „monetary compensation”.
- `?` **ShareAlike a łączenie z GPL.** Polskie filtry trafiają po przetworzeniu do tych samych plików co filtry na GPLv3 (EasyList w wariancie GPL, uBlock filters). Ustalić:
  - czy powstaje „Adapted Material”;
  - jaką licencję musiałby mieć wynikowy plik;
  - czy BY-NC-SA 4.0 i GPLv3 dają się w nim pogodzić.
  - Licencja dopuszcza dla adaptacji tylko licencję CC z tymi samymi elementami albo „BY-NC-SA Compatible License”.
- `?` **Effective Technological Measures.** Ustalić, czy podpisywanie i dystrybucja paczki przez Chrome Web Store podpada pod 2(a)(5)(C).
- `?` **Oznaczenie modyfikacji.** Przetworzenie (usunięcie nagłówków, konwersja do DNR, odrzucenie części filtrów) to modyfikacja. Trzeba ją oznaczyć, a dziś nigdzie tego nie robimy.
- `?` **Właściwy posiadacz praw i forma attribution:** Certyficate IT, MajkiIT czy lista współtwórców.
- `?` **Ewentualna zgoda upstream** na dystrybucję w Chrome Web Store (np. odrębna licencja albo wyjątek). Wymaga kontaktu z autorami.

**Gdzie podajemy attribution teraz**

- README → „Źródła list i licencje”;
- Opcje → „Listy filtrów”.
- Treść: „Polskie Filtry Reklamowe (© MajkiIT, CC BY-NC-SA 4.0)”, bez linku do licencji, bez informacji o modyfikacji i bez noty o wyłączeniu gwarancji.

### 3.4 Zasoby przekierowań (`web_accessible_resources/`)

- **Pliki:**
  - `1x1.gif`, `2x2.png`, `3x2.png`, `32x32.png`;
  - `noop.{css,html,js,json,txt}`, `noop-vast{2,3,4}.xml`, `noop-vmap1.xml`;
  - `amazon_apstag.js`, `google-analytics_analytics.js`, `google-analytics_ga.js`, `googlesyndication_adsbygoogle.js`, `googletagservices_gpt.js`.
- Pliki JS mają nagłówek „ChromeBlock – atrapa …” i są oznaczone jako kod własny. Pliki binarne i XML są trywialne (puste lub 1 piksel).
- Nazwy plików odpowiadają nazwom zasobów `$redirect` używanym w listach uBO, żeby filtry działały.
- `?` Potwierdzić (autor / historia), że implementacje atrap powstały niezależnie, a nie jako kopia zasobów uBlock Origin (GPLv3).

### 3.5 Ikony (`icons/`)

- `icon{16,32,48,128}.png` i warianty `-off`.
- W repo nie ma informacji o pochodzeniu ani licencji ikon. Dodano je w commicie `a2091e2`.
- `?` Potwierdzić, że są własne.

### 3.6 Biblioteka scriptletów i JSONPath

- `tools/scriptlets-lib.js` to „implementacja własna”, której celem jest „odtwarzać semantykę, której oczekują filtry list uBO”.
- `shared/jsonpath.js` to „implementacja własna … odwzorowuje zachowanie opisane w dokumentacji »uBO-flavored JSONPath«”.
- Obie są dołączane do każdego `scriptlets/*.js`.
- `?` Potwierdzić, że kod nie jest kopią ani pochodną kodu uBlock Origin (GPLv3). Jeśli jest, obowiązki GPLv3 objęłyby też tę część.

### 3.7 Playwright (tylko lokalny tester)

- Paczka zawiera `tester/package.json` z zależnością `playwright ^1.49.0` (Apache-2.0, zgodnie z `package.json` pakietu 1.56.0). Sam Playwright i Chromium **nie są dołączane**. Instaluje je `npm` na komputerze testującego.
- Tester nie jest częścią rozszerzenia.
- `?` Zdecydować, czy paczka do Chrome Web Store ma w ogóle zawierać folder `tester/`. Dziś `download/ChromeBlock-dev.zip` zawiera go obok folderu `ChromeBlock/`.

## 4. Gdzie dziś podajemy attribution / licencje

| Miejsce | Treść | Czego brakuje |
|---|---|---|
| `README.md` → „Źródła list i licencje” | nazwy list, „©” i skrót licencji; zdanie „Pełny audyt licencyjny zostanie wykonany przed ewentualnym publicznym wydaniem” | linki do licencji, teksty licencji, oznaczenie modyfikacji, poprawny posiadacz praw dla Polskich Filtrów („Certyficate IT” w nagłówkach), „or later” dla EasyList |
| `options/options.html` → „Jak to działa” → „Listy filtrów” (jest w paczce) | ta sama treść | jak wyżej |
| `docs/product-direction.md` | odesłanie do README | – |
| Paczka rozszerzenia (ZIP) | brak plików licencji i NOTICE; nagłówki list są usuwane przez build | teksty / URI licencji, noty o prawach autorskich, informacja o modyfikacjach, wskazanie źródła dla przetworzonych danych (repozytorium jest obecnie prywatne, więc nie spełnia tej roli) |
| Kod ChromeBlock | brak pliku `LICENSE` | deklaracja licencji projektu |

## 5. Podsumowanie

| Kategoria | Źródła |
|---|---|
| **Sources (danych stron trzecich)** | 5 źródeł list (EasyList, EasyPrivacy, Fanboy's Annoyance, uBlock filters, Polskie Filtry Reklamowe) w 25 plikach, plus Playwright jako niedołączana zależność testera |
| **Clear** (licencja jednoznacznie zadeklarowana i potwierdzona przez upstream) | EasyList, EasyPrivacy (GPL-3.0+ / CC BY-SA 3.0+); uBlock filters (GPL-3.0); Playwright (Apache-2.0, nie dystrybuowany) |
| **Requires notice** (wymagają attribution i noty licencyjnej w dystrybucji) | EasyList, EasyPrivacy, Fanboy, uBlock filters, Polskie Filtry. Dziś nota jest niepełna we wszystkich, a w paczce brak tekstów licencji |
| **NonCommercial** | Polskie Filtry Reklamowe (4 pliki; 3 trafiają do domyślnie włączonej listy „Reklamy”) |
| **Unclear** | NC i ShareAlike Polskich Filtrów przy dystrybucji w Chrome Web Store i łączeniu z GPL; posiadacz praw Polskich Filtrów; status przetworzonych reguł wobec GPLv3 / CC BY-SA (object code / adaptacja); kod GPL z filtrów „trusted” w `scriptlets/*.js`; licencja Fanboy (pobierana spoza easylist.to); nota o prawach uBlock filters; brak licencji ChromeBlock; pochodzenie atrap, ikon i biblioteki scriptletów |

## 6. Rekomendowane kroki przed publicznym wydaniem

Lista do decyzji. Żadna z tych zmian nie została wykonana w ramach audytu.

1. **Polskie Filtry Reklamowe:** przed wydaniem w Chrome Web Store uzyskać pisemne stanowisko upstream albo opinię prawną w sprawie NC, ShareAlike i łączenia z GPL. Gotowa wiadomość do autorów: [docs/polish-filters-upstream-question.md](polish-filters-upstream-question.md), jeszcze niewysłana. Warianty wydania są w sekcji 7.
2. **Wybrać i dodać licencję ChromeBlock** (`LICENSE`), sprawdzając jej zgodność z GPLv3 dla plików, w których kod łączy się z danymi i kodem z list GPL. `?`
3. **Dodać do paczki plik `THIRD-PARTY-NOTICES`** (lub `licenses/`) z:
   - nazwą każdego źródła, upstream URL, wersją, posiadaczem praw zgodnym z nagłówkiem upstream;
   - licencją i jej tekstem lub URI;
   - informacją, że dane zostały przetworzone (konwersja do DNR, usunięte komentarze, odrzucone filtry);
   - wskazaniem, gdzie dostępne są surowe listy i narzędzie buildu. Repozytorium jest dziś **prywatne**, więc najpierw trzeba ustalić sposób publicznego udostępnienia źródeł i not, jeśli wymagają tego wybrane licencje (zob. sekcja 1).
4. **Poprawić attribution w README i Opcjach:**
   - „Certyficate IT” zamiast lub obok „MajkiIT” (do potwierdzenia, zob. 3.3);
   - linki do licencji;
   - „or later” dla EasyList;
   - informacja o modyfikacji.
5. **Potwierdzić pochodzenie i opisać kod własny:** atrapy w `web_accessible_resources/`, ikony, biblioteka scriptletów i JSONPath.
6. **Ustalić skład paczki do Chrome Web Store** (bez `tester/` i instalatorów `.cmd`?).
7. Po zmianach ponowić ten audyt na nowym `main` i zaktualizować zdanie w README o „pełnym audycie”.

## 7. Release recommendation

Dwa warianty do decyzji właściciela projektu. Audyt **nie wybiera** żadnego z nich i nie rozstrzyga kwestii prawnych z sekcji 3. Obie ścieżki wymagają też kroków 2–6 z sekcji 6 (licencja ChromeBlock, `THIRD-PARTY-NOTICES`, poprawione attribution, sposób udostępnienia źródeł przy prywatnym repozytorium).

### A. `SAFE DEFAULT`

Publiczny build 1.0 (Chrome Web Store) **bez Polskich Filtrów Reklamowych** do czasu pisemnego potwierdzenia od upstream.

- Do publicznej paczki nie trafiają `pl/adblock.txt`, `pl/adblock_suplement.txt`, `pl/adblock_ublock.txt` ani wynikające z nich reguły, filtry kosmetyczne i scriptlety.
- Listy zostają w repozytorium i w buildzie deweloperskim. Wariant A nie wymaga ich usuwania z repo.
- Po uzyskaniu jasnej zgody lub wyjaśnienia można przejść do wariantu B w kolejnym wydaniu.
- Skutki do oceny przed wyborem:
  - słabsze blokowanie na polskich stronach;
  - potrzebny osobny wariant buildu lub konfiguracji list dla wydania publicznego (zmiana do zaplanowania osobno, nie w ramach audytu);
  - ponowny test regresyjny.
- Nadal obowiązują noty i licencje pozostałych źródeł (EasyList, EasyPrivacy, Fanboy, uBlock filters) oraz otwarte punkty dotyczące GPLv3 i CC BY-SA 3.0 z sekcji 3.1–3.2.

### B. `WITH UPSTREAM CONFIRMATION`

Polskie Filtry Reklamowe **pozostają** w publicznym buildzie, ale tylko gdy łącznie spełnione są warunki:

1. jest jasna, pisemna odpowiedź autorów (np. w GitHub Issues lub e-mailu) na pytania z [docs/polish-filters-upstream-question.md](polish-filters-upstream-question.md): zgoda na taką dystrybucję, stanowisko w sprawie NonCommercial i opcjonalnego wsparcia, wymagane attribution, dopuszczalność postaci przetworzonej, obowiązująca licencja;
2. ewentualne pozostałe wątpliwości (np. ShareAlike i łączenie z GPL w jednym pliku wyjściowym) są wyjaśnione przez upstream lub w opinii prawnej;
3. wymagane noty są wdrożone dokładnie w formie wskazanej przez autorów: `THIRD-PARTY-NOTICES`, attribution w Opcjach i README, informacja o modyfikacji;
4. odpowiedź upstream jest zarchiwizowana, np. link lub kopia w `docs/`.

Do czasu spełnienia warunków 1–4 wariant B nie jest gotowy do wydania.

## 8. Źródła informacji (odczyt 2026-10-25)

- Widoczność repozytorium `Bonziuu/Chromeblock`: GitHub API (`private: true`).
- Nagłówki plików w `tools/lists/**` (stan repozytorium jak wyżej).
- EasyList Repository Licences: https://easylist.to/pages/licence.html
- CC BY-NC-SA 4.0 Legal Code (SPDX): https://spdx.org/licenses/CC-BY-NC-SA-4.0
- uAssets – licencja wg mirrora: https://sourceforge.net/projects/uassets.mirror/
- Debian, pakiet `ublock-origin`, plik copyright (EasyList w uAssets: „GPL-3+ or CC-BY-SA-3.0+”): https://metadata.ftp-master.debian.org/changelogs/main/u/ublock-origin/stable_copyright
- Polskie Filtry – STATEMENT.md: https://github.com/MajkiIT/polish-ads-filter/blob/master/STATEMENT.md
- Polskie Filtry – plik archiwalny z nagłówkiem licencji: https://github.com/MajkiIT/polish-ads-filter/blob/master/polish-adblock-filters/adblock_test.txt
- Polskie Filtry – strona projektu: https://majkiit.github.io/polish-ads-filter/
- Playwright: `package.json` pakietu (`"license": "Apache-2.0"`).

Ograniczenie audytu: w tej sesji nie dało się pobrać bezpośrednio plików `LICENSE` z repozytoriów uAssets i polish-ads-filter ani porównać bajtowo lokalnych list z bieżącym upstream. Te punkty są oznaczone wyżej.
