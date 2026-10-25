# ChromeBlock – gotowość do Chrome Web Store

| | |
|---|---|
| Stan kodu | `main` @ `cffd9d36145b9b41619713ab2c3cfeb77e4cec7c` (0.3.4-dev), audyt na branchu `release-license-audit` |
| Data | 2026-10-25 |
| Zakres | Uprawnienia, prywatność, zdalny kod, single purpose, skład paczki, szkic odpowiedzi do zakładki Privacy |
| Charakter | Audyt kodu. **Nic nie zostało zmienione ani opublikowane.** Kwestie licencyjne są w [third-party-license-audit.md](third-party-license-audit.md) |

Metoda: przegląd `manifest.json` i całego kodu, który trafia do paczki (`background.js`, `background/`, `content/`, `popup/`, `options/`, `welcome/`, `youtube/`, `shared/`, `web_accessible_resources/`, wygenerowane `scriptlets/`). Wywołania API wyszukano `grep` i sprawdzono w kontekście. Numery linii dotyczą `background.js` na podanym commicie.

---

## 1. PERMISSIONS

Manifest deklaruje:

- `permissions`: `declarativeNetRequest`, `declarativeNetRequestFeedback`, `scripting`, `storage`, `webNavigation`;
- `host_permissions`: `<all_urls>`;
- content scripts: `content/cosmetic.js` na `<all_urls>`, `youtube/health.js` i `youtube/focus.js` na YouTube;
- `web_accessible_resources`: `web_accessible_resources/*` dla `<all_urls>`;
- 5 statycznych zestawów reguł DNR.

Ten audyt nie zmieniał uprawnień.

**Aktualizacja (branch `release-permissions-v1`, commit `00b8fea`, jeszcze niezmergowany do `main`):** `declarativeNetRequestFeedback` zastąpione przez `activeTab`. Szczegóły w punkcie o `declarativeNetRequestFeedback` niżej. Pozostałe uprawnienia bez zmian.

### `declarativeNetRequest`

| | |
|---|---|
| Gdzie | `updateEnabledRulesets` / `getEnabledRulesets` (l. 306, 308): włączanie list; `updateStaticRules` (l. 295): wyłączanie reguł `$badfilter` między listami; `getDynamicRules` / `updateDynamicRules` (l. 335–336, 1050): wyłączone strony (`allowAllRequests`, `SITE_RULE_ID`) i filtry sieciowe użytkownika; `setExtensionActionOptions({displayActionCountAsBadgeText:true})` (l. 670): licznik na ikonie; `getAvailableStaticRuleCount` (l. 1052): Opcje → Diagnostyka. Do tego `declarative_net_request.rule_resources` w manifeście |
| Funkcja | Rdzeń blokowania sieciowego: reklamy, śledzenie, złośliwe strony, listy, tryby ochrony, wyłączanie ochrony dla strony, własne filtry |
| Wymagane dla podstawowego działania | **TAK** |
| Ograniczenie / optional | Nie da się. Bez tego uprawnienia nie ma blokowania sieciowego |
| Konsekwencje | Rozszerzenie przestaje być blokerem |

### `declarativeNetRequestFeedback` → `activeTab`: **RESOLVED**

Status: **RESOLVED** na branchu `release-permissions-v1` (commit `00b8fea`). Do `main` trafi po merge.

| | |
|---|---|
| Było | `declarativeNetRequestFeedback`, potrzebne tylko do `chrome.declarativeNetRequest.getMatchedRules({ tabId })` w handlerze `popup:get` (dokładny licznik w popupie) |
| Jest | **`activeTab`** zamiast `declarativeNetRequestFeedback`. Według dokumentacji Chrome `getMatchedRules()` jest dostępne przy `declarativeNetRequestFeedback` **albo** przy `activeTab` przyznanym dla podanego `tabId` |
| Jak działa `activeTab` | Chrome przyznaje tymczasowy dostęp do karty, gdy użytkownik **świadomie kliknie ikonę ChromeBlock** i otworzy popup. Popup wysyła `popup:get` z `tabId` tej karty, a service worker wywołuje `getMatchedRules({ tabId })`. Dostęp dotyczy tylko tej karty i wygasa przy nawigacji lub zamknięciu karty. Nic nie jest wysyłane poza przeglądarkę |
| Licznik | Sposób liczenia bez zmian: reguły `allow` z list (`data/<lista>.allow.json`), wyjątki użytkownika (`@@`) i reguła „ochrona wyłączona na stronie” nie są liczone |
| Fallback | Bez zmian: gdy Chrome odmówi dostępu (np. popup otwarty jako zwykła strona albo karta bez przyznanego `activeTab`), `popup:get` czyta tekst plakietki (`chrome.action.getBadgeText`). Plakietkę ustawia `setExtensionActionOptions({ displayActionCountAsBadgeText: true })`, które nie wymaga `declarativeNetRequestFeedback` |
| Testy | `tests/popup/active-tab.test.mjs`: manifest bez feedback i z `activeTab`; licznik z `getMatchedRules` przy dostępie; fallback przy odmowie; zwykła strona i YouTube. `tests/popup/active-tab-live.test.mjs` (Chromium): bez przyznanego `activeTab` Chrome odrzuca `getMatchedRules`, a `popup:get` i popup działają przez fallback na zwykłej stronie i YouTube. Przyznania `activeTab` kliknięciem ikony nie da się wywołać z Playwright, więc tę ścieżkę pokrywają testy jednostkowe; warto ją sprawdzić ręcznie w Chrome |
| Wymagane dla podstawowego działania | **NIE** (tylko dokładność licznika w popupie) |
| Efekt dla recenzji | Mniej wrażliwe uprawnienie. `activeTab` nie dodaje ostrzeżenia przy instalacji. Brzmienie ostrzeżeń dla całego zestawu (z `<all_urls>` i `webNavigation`) warto sprawdzić przy instalacji paczki: `NEEDS HUMAN CONFIRMATION` |

### `scripting`

| | |
|---|---|
| Gdzie | `registerContentScripts` / `unregisterContentScripts` / `getRegisteredContentScripts` (l. 456–501, 812): rejestracja plików `scriptlets/*.js` w świecie `MAIN` (l. 387–388) dla domen z list; `insertCSS` (l. 792): CSS filtrów kosmetycznych dla ramki zgłoszonej przez `content/cosmetic.js`; `executeScript` (l. 1178): wstrzyknięcie `content/picker.js` po kliknięciu „Ukryj element”; `insertCSS` (l. 1192): natychmiastowe ukrycie wskazanego elementu |
| Funkcja | Scriptlety (m.in. YouTube Protection, anty-anty-adblock), ukrywanie elementów, picker |
| Wymagane dla podstawowego działania | **TAK**: scriptlety i ukrywanie elementów są częścią domyślnej ochrony |
| Ograniczenie / optional | Nie bez utraty funkcji. Sam picker mógłby działać na `activeTab`, ale `scripting` jest i tak potrzebne dla scriptletów i CSS |
| Konsekwencje | Brak ukrywania pustych miejsc po reklamach, brak YouTube Protection i scriptletów |

### `storage`

| | |
|---|---|
| Gdzie | `chrome.storage.local`: ustawienia (`enabledLists`, `disabledSites`, `userFilters`, `protectionMode`, l. 116, 134), Focus Mode (`FOCUS_STORAGE_KEY`, l. 194, 1074, 1130), flaga `devPerf` (l. 461, 889–974; `content/cosmetic.js` l. 36), dziennik zdrowia (`health`, `background/health.js`). `chrome.storage.session`: profil startu (l. 28, 33), znacznik rejestracji scriptletów (l. 467, 484, 519), agregat pomiarów scriptletów (`SCRIPTLET_PERF_KEY`). Opcje i popup nie używają storage bezpośrednio, tylko przez wiadomości do service workera |
| Funkcja | Zapamiętanie ustawień, diagnostyka |
| Wymagane dla podstawowego działania | **TAK** |
| Ograniczenie / optional | Nie |
| Konsekwencje | Ustawienia nie przetrwałyby restartu service workera ani przeglądarki |

### `webNavigation`

| | |
|---|---|
| Gdzie | Tylko `chrome.webNavigation.onCommitted.addListener` (l. 848): dla ramki głównej (`frameId === 0`) wywołuje `playerReports.onMainFrameNavigation(tabId)` (czyszczenie raportu odtwarzacza YouTube z poprzedniej strony) i `updateIcon(tabId, url)` (szara ikona na stronach z wyłączoną ochroną) |
| Funkcja | Wskaźnik „ochrona wyłączona na tej stronie” na ikonie; aktualność statusu YouTube Protection |
| Wymagane dla podstawowego działania | **NIE.** Blokowanie działa bez niego |
| Ograniczenie / optional | **Możliwe.** Te same zdarzenia daje `chrome.tabs.onUpdated` (z `url`, bo rozszerzenie ma już `<all_urls>`), bez osobnego uprawnienia `webNavigation`. Alternatywnie można zrezygnować z per-kartowej ikony |
| Konsekwencje | Zmiana kodu (osobne zadanie) i ponowne testy ikony i YouTube Protection. Mniejszy zakres uprawnień w recenzji |

### `<all_urls>` (host permissions + content script + web_accessible_resources)

| | |
|---|---|
| Gdzie | Content script `content/cosmetic.js` na każdej stronie i ramce (`document_start`, `all_frames`, `match_about_blank`); `scripting.insertCSS` / `registerContentScripts` / `executeScript` na dowolnych stronach (wymagają dostępu do hosta); reguły DNR typu `redirect` do lokalnych atrap (`rules/ads.json`: 559, `privacy.json`: 112, `annoyances.json`: 22, `security.json`: 2), które według DNR wymagają uprawnień do hosta żądania; dostępność `web_accessible_resources/*` jako celu przekierowań; `chrome.tabs.get(...).url` w popupie (host bieżącej karty) |
| Funkcja | Ukrywanie elementów i scriptlety na wszystkich stronach, przekierowania do atrap, wyłączanie ochrony dla strony |
| Wymagane dla podstawowego działania | **TAK** dla blokera działającego na wszystkich stronach |
| Ograniczenie / optional | Teoretycznie `optional_host_permissions` z prośbą o dostęp per strona. Statyczne reguły `block` działałyby bez tego, ale filtry kosmetyczne, scriptlety i przekierowania nie |
| Konsekwencje | Bez `<all_urls>` skuteczność spadłaby drastycznie, a UX wymagałby zgód per witryna. Ostrzeżenie „odczyt i zmiana wszystkich danych na stronach” zostaje i wymaga dobrego uzasadnienia w dashboardzie |

### Podsumowanie uprawnień

| Uprawnienie | Wymagane | Można ograniczyć |
|---|---|---|
| `declarativeNetRequest` | TAK | NIE |
| ~~`declarativeNetRequestFeedback`~~ → `activeTab` | NIE | **RESOLVED**: zastąpione przez `activeTab` (`release-permissions-v1`) |
| `scripting` | TAK | NIE |
| `storage` | TAK | NIE |
| `webNavigation` | NIE | **TAK** (`tabs.onUpdated`) |
| `<all_urls>` | TAK | tylko kosztem głównej funkcji |

Szkice uzasadnień do dashboardu („Permission justification”) są w sekcji 6.4.

---

## 2. DATA / PRIVACY

### 2.1 Ruch sieciowy z kodu rozszerzenia

Przeszukano kod paczki pod kątem `fetch(`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `EventSource`, `import(`, `importScripts`.

| Wywołanie | Plik | Cel | Wynik |
|---|---|---|---|
| `fetch(chrome.runtime.getURL(path))` | `background.js:95` (`fetchJSON`) | wczytanie plików paczki: `data/*.json`, `data/badfilter-cross.json`, `data/youtube-compat.json`, `data/scriptlet-compat.json`, `data/<lista>.allow.json` | **lokalnie (`chrome-extension://`)** |
| `fetch(chrome.runtime.getURL('data/<id>.json'), { method: 'HEAD' })` | `background.js:574` | sprawdzenie, czy pliki list są w paczce | **lokalnie** |

**Brak innych wywołań sieciowych.** Brak XHR, WebSocket, `sendBeacon` i dynamicznego `import()` w kodzie rozszerzenia. Brak adresów `http(s)://` w kodzie stron rozszerzenia; jedyny to namespace XML `http://www.iab.net/videosuite/vmap` w `web_accessible_resources/noop-vmap1.xml`, który nie jest żądaniem.

W `scriptlets/*.js` są ciągi `navigator.sendBeacon` i `new Function(`, ale to **argumenty filtrów** (np. `["set-constant","navigator.sendBeacon","noopFunc"]` w `scriptlets/privacy-0.js`, `["abort-current-script","atob","new Function(atob("]` w `scriptlets/security-0.js`). Scriptlety neutralizują te wywołania na stronach. Same niczego nie wysyłają.

### 2.2 Kategorie danych

| Kategoria | Wynik | Dowód |
|---|---|---|
| Telemetria / analityka | **brak** | brak wywołań sieciowych (2.1); `background/health.js`: „wyłącznie lokalnie, bez telemetrii” |
| Zewnętrzne API | **brak** | 2.1 |
| Wysyłanie URL odwiedzanych stron poza przeglądarkę | **brak** | 2.1 |
| Dane formularzy | **nie są czytane** | brak odczytu pól formularzy stron w `content/*.js`; jedyne `input.value` w `content/picker.js` to własne pole selektora pickera, a zapisywany jest tylko selektor CSS |
| Historia (`chrome.history`) | **nie używana** | brak wywołań `chrome.history` |
| Cookies (`chrome.cookies`) | **nie używane** | brak wywołań `chrome.cookies`; scriptlety z list (np. `set-cookie`) ustawiają ciasteczka zgód na stronie lokalnie, zgodnie z filtrem |
| Loginy / hasła / dane konta | **nie są czytane** | brak takiego kodu; ChromeBlock nie ma kont |
| Dane osobowe | **nie zbierane celowo** | lokalnie zapisane są hosty wybrane przez użytkownika (2.3) |
| Synchronizacja do chmury (`chrome.storage.sync`) | **nie używana** | brak `storage.sync`; tylko `local` i `session` |

### 2.3 Podział danych

**A. Przetwarzane tylko lokalnie, w pamięci, bez zapisu**

- URL / host karty i ramki: `content/cosmetic.js` wysyła `location.href` do własnego service workera (`cosmetic:init`), żeby dobrać CSS dla hosta (`frameHost`, l. 781). Popup pobiera `chrome.tabs.get(tabId).url` → host. `webNavigation.onCommitted` daje URL do zmiany ikony.
- Klasy i identyfikatory elementów strony (`content/cosmetic.js`, filtry ogólne). Nie są zapisywane.
- Raporty odtwarzacza YouTube (`youtube/health.js` → `youtube:health`: status, powody, typ strony; bez URL i ID filmu), trzymane w pamięci w `PlayerReportStore` per karta. Czyszczone przy nawigacji i zamknięciu karty.
- Raporty wydajności `perf:report` (host ramki i liczniki), **tylko przy włączonych „Pomiarach wydajności”** (`devPerf`, domyślnie wyłączone). Maks. 30 wpisów w pamięci (`perfReports`, l. 61, 888–898).
- Liczba dopasowanych reguł (`getMatchedRules`) dla popupu.

**B. Zapisywane w `chrome.storage` (na urządzeniu)**

| Klucz | Obszar | Zawartość | Dane potencjalnie osobowe |
|---|---|---|---|
| `enabledLists`, `protectionMode` | local | włączone listy, tryb | nie |
| `disabledSites` | local | **hosty, na których użytkownik wyłączył ochronę** | tak (świadomie wybrane przez użytkownika domeny) |
| `userFilters` | local | **własne filtry użytkownika, w tym linie z pickera `host##selektor`** | tak (domeny) |
| `youtubeFocus` (`FOCUS_STORAGE_KEY`) | local | ustawienia Focus Mode | nie |
| `devPerf` | local | flaga pomiarów wydajności | nie |
| `health` | local | stan komponentów i dziennik do 50 błędów (komunikaty techniczne) | `NEEDS HUMAN CONFIRMATION`: komunikaty błędów nie są sanityzowane przy zapisie (dopiero w raporcie diagnostycznym). Teoretycznie mogą zawierać fragmenty komunikatów Chrome z adresem |
| profil startu (`STARTUP_PROFILE_KEY`) | session | czasy etapów startu | nie |
| znacznik scriptletów (`SESSION_SCRIPTLETS_KEY`) | session | flaga | nie |
| agregat pomiarów scriptletów (`SCRIPTLET_PERF_KEY`) | session | etykiety „scriptlet · funkcja”, liczby i czasy; walidacja `LABEL_RE` wyklucza URL i ID (`background/scriptlet-perf.js`) | nie |

**C. Opuszczające przeglądarkę**

- **Automatycznie: nic.** Kod nie wysyła żadnych danych poza przeglądarkę (2.1).
- **Wyłącznie z inicjatywy użytkownika, lokalnie:**
  - Opcje → Kopia ustawień → „Eksportuj”: plik JSON zapisany na dysku przez `Blob` / `URL.createObjectURL` / `a.download` (`options/options.js:178–182`). Zawiera `enabledLists`, `protectionMode`, `disabledSites`, `userFilters`, `youtubeFocus`, bez health, diagnostyki, kart i adresów (sprawdzone testem w tej wersji).
  - Opcje → Diagnostyka → „Kopiuj raport”: tekst do schowka (`navigator.clipboard.writeText`, `options/options.js:375`). Raport jest sanityzowany (`background/diagnostics-report.js`: usuwa URL, hosty, e-maile, tokeny, ID filmów).
  - Co użytkownik dalej zrobi z plikiem lub schowkiem, jest poza rozszerzeniem.

---

## 3. REMOTE CODE

| Sprawdzenie | Wynik | Dowód |
|---|---|---|
| Zdalne skrypty / CDN | brak | strony rozszerzenia ładują tylko pliki lokalne (`popup.html`, `options.html`, `welcome.html`: `<script src="*.js">`, `<link href="*.css">`); brak `http(s)://` w `src` / `href` / `@import` / `url()` |
| Dynamiczny import z sieci | brak | brak `import(` i `importScripts` |
| `eval` / `new Function` / `setTimeout("…")` | brak w kodzie rozszerzenia i w `tools/scriptlets-lib.js` | `grep`; trafienia w `scriptlets/*.js` to tylko argumenty filtrów (2.1) |
| Pobieranie kodu wykonywalnego | brak | jedyne `fetch` są lokalne (2.1); listy filtrów są wbudowywane podczas buildu (`tools/update-lists.mjs` to narzędzie deweloperskie, nie część paczki) |
| Zewnętrzne zasoby HTML/JS/CSS | brak | jw.; `web_accessible_resources/*` to lokalne atrapy |

Uwagi dla recenzji (kod jest w paczce, nie zdalny):

- Scriptlety (`scriptlets/*.js`) działają w świecie `MAIN` stron i modyfikują ich zachowanie, tak jak w uBlock Origin.
- Filtry „trusted” z uBlock filters zawierają **fragmenty JavaScriptu wpisane w argumenty**. Przykład: zminifikowany kod w `trusted-rpnt` z `quick-fixes.txt`, który trafia do `scriptlets/ads-17.js` i podmienia treść skryptu strony.
- To kod statyczny, dołączony do paczki, ale **zminifikowany i pochodzący od stron trzecich**. Może wymagać wyjaśnienia recenzentom w kontekście zasad o czytelności kodu: `NEEDS HUMAN CONFIRMATION`, czy zostawić filtry z wbudowanym kodem w wydaniu publicznym.

**REMOTE CODE: PASS.** Brak zdalnego kodu. Do opisu w recenzji: scriptlety w świecie `MAIN` i zminifikowany kod z filtrów „trusted”, oba wbudowane w paczkę.

---

## 4. SINGLE PURPOSE

**Proponowane zdanie (PL):**

> ChromeBlock blokuje reklamy, elementy śledzące i inne niechciane treści na stronach internetowych, lokalnie w przeglądarce.

**Wersja EN** (pole w dashboardzie):

> ChromeBlock blocks ads, trackers and other unwanted content on web pages, locally in the browser.

| Funkcja | Związek z celem | Ocena |
|---|---|---|
| Blokowanie reklam | rdzeń | ✅ |
| Ochrona prywatności (EasyPrivacy, uBO Privacy) | blokowanie elementów śledzących | ✅ |
| Security lists (uBO Badware) | blokowanie niechcianych / złośliwych treści | ✅ |
| Protection Modes (Basic / Balanced / Strict) | konfiguracja zakresu blokowania (presety list) | ✅ |
| Picker („Ukryj element”) | ręczne ukrywanie niechcianego elementu (filtr kosmetyczny) | ✅ |
| YouTube Protection | blokowanie reklam na YouTube + diagnostyka skuteczności | ✅ |
| Backup / Restore | zarządzanie ustawieniami blokera | ✅ (funkcja pomocnicza) |
| **Focus Mode** (ukrywa Shorts, rekomendacje, komentarze, sugestie na końcu filmu) | ukrywanie „niechcianych treści” wybranych przez użytkownika; domyślnie OFF | ⚠️ `NEEDS HUMAN CONFIRMATION`: mieści się w celu tylko przy szerszym rozumieniu „niechcianych treści” (jak listy „annoyances”). Jeśli recenzja uzna to za osobny cel („narzędzie produktywności YouTube”), opcje to: opisać jako ukrywanie elementów rozpraszających w ramach blokera, przenieść do osobnego rozszerzenia albo wyłączyć w wydaniu publicznym |
| Diagnostyka / Health | wsparcie działania blokera | ✅ (pomocnicza) |
| Onboarding (wybór trybu) | konfiguracja blokera | ✅ |

---

## 5. PRODUCTION PACKAGE

Obecny `npm run package:dev` (`tools/package-dev.mjs`) tworzy `dist/ChromeBlock-dev.zip` z:

- `ChromeBlock/`, czyli katalogami z `EXTENSION_ENTRIES` (`tools/chromium-smoke.mjs`): `manifest.json`, `background.js`, `background/`, `shared/`, `content/`, `youtube/`, `popup/`, `options/`, `welcome/`, `icons/`, `rules/`, `data/`, `scriptlets/`, `web_accessible_resources/` (`_locales` nie istnieje);
- `EXTRA_FILES` w katalogu głównym ZIP-a: `install-chromeblock.cmd`, `update-chromeblock.cmd`, `INSTALL.md`, `test-chromeblock.cmd`;
- `tester/`: `package.json` (zależność Playwright), `tests/local/chromeblock-local-test.mjs`, `tools/chromium-smoke.mjs`, `tests/e2e/lib/*.mjs`, `shared/youtube-focus.js`.

Chrome Web Store przyjmuje ZIP z `manifest.json` **w katalogu głównym**. Dzisiejszy ZIP ma manifest w `ChromeBlock/`, więc nie nadaje się do wysłania bez zmian.

**Proponowany skład `package:release` (do implementacji osobno):**

| Element | W paczce CWS? | Uzasadnienie |
|---|---|---|
| `tester/` | **NIE** | narzędzie deweloperskie, Playwright, testy |
| `install-chromeblock.cmd`, `update-chromeblock.cmd`, `test-chromeblock.cmd` | **NIE** | instalacja „rozpakowanego” rozszerzenia / testy na Windows |
| `INSTALL.md` | **NIE** | instrukcja trybu deweloperskiego |
| `youtube/compatibility.js` | **NIE** (do potwierdzenia) | nie jest importowany przez kod uruchomieniowy; używają go tylko `tools/build.mjs`, `tools/update-lists.mjs`, `tools/audit-scriptlets.mjs`, testy |
| `youtube/known-gaps.json` | **NIE** (do potwierdzenia) | baza znanych braków dla buildu i audytu, nieczytana w czasie działania |
| `content/scriptlet-perf-on.js` | decyzja | plik-flaga profilera scriptletów (Opcje → Diagnostyka → Pomiary wydajności, domyślnie OFF); zostaje, jeśli funkcja ma być w wydaniu |
| `data/scriptlet-compat.json`, `data/youtube-compat.json` | TAK | czytane w czasie działania (Diagnostyka, YouTube Protection) |
| `tools/`, `tests/`, `docs/`, `dist/`, `download/`, `node_modules/`, `package.json`, `README.md`, `.git*` | **NIE** | już dziś poza `ChromeBlock/`; należy utrzymać |
| Pliki licencji / `THIRD-PARTY-NOTICES` | **TAK (do dodania)** | zob. audyt licencji |

Zmiany w manifeście potrzebne do wydania (nie wykonano):

- `description` zawiera „Wersja developerska”;
- `version_name` = `0.3.4-dev`;
- brak `_locales` (opis tylko po polsku), więc trzeba zdecydować o językach listingu.

---

## 6. STORE PRIVACY DRAFT

Szkic odpowiedzi do Developer Dashboard → Privacy. **Nic nie zostało wysłane.**

Oznaczenia:

- **[VERIFIED FROM CODE]**: potwierdzone przeglądem kodu w commicie podanym w nagłówku;
- **[NEEDS HUMAN CONFIRMATION]**: decyzja, zobowiązanie albo interpretacja definicji Google, której kod nie rozstrzyga.

### 6.1 Jakie dane ChromeBlock obsługuje

- [VERIFIED FROM CODE] Odczytuje adres (host) strony i ramki, żeby zastosować właściwe filtry, przełączyć ikonę i pokazać stan w popupie. Nie zapisuje historii odwiedzin.
- [VERIFIED FROM CODE] Odczytuje strukturę strony (klasy, identyfikatory, tekst elementów dla filtrów proceduralnych), żeby ukrywać reklamy. Nie zapisuje treści stron.
- [VERIFIED FROM CODE] Zapisuje lokalnie (`chrome.storage.local`) ustawienia użytkownika, w tym listę domen z wyłączoną ochroną i własne filtry (mogą zawierać domeny).
- [VERIFIED FROM CODE] Nie odczytuje formularzy, haseł, ciasteczek (API `cookies`), historii (API `history`) ani danych logowania.
- [NEEDS HUMAN CONFIRMATION] Które pola formularza „Data usage” zaznaczyć. Według definicji Google „zbieranie” może obejmować przetwarzanie lokalne. Rozważyć zaznaczenie „Web history” / „Website content” z adnotacją, że dane są tylko przetwarzane lokalnie, albo żadnej kategorii. Wymaga decyzji po lekturze aktualnych zasad CWS.

### 6.2 Czy dane opuszczają urządzenie

- [VERIFIED FROM CODE] Nie. Rozszerzenie nie wykonuje żadnych żądań sieciowych poza wczytaniem własnych plików (`chrome-extension://`).
- [VERIFIED FROM CODE] Brak `chrome.storage.sync`, więc ustawienia nie są synchronizowane przez konto Google.
- [VERIFIED FROM CODE] Eksport ustawień (plik) i kopiowanie raportu diagnostycznego (schowek) odbywają się wyłącznie na żądanie użytkownika, lokalnie.
- [NEEDS HUMAN CONFIRMATION] Zobowiązanie, że przyszłe wersje też nie będą wysyłać danych, np. przy dodaniu linków „Wesprzyj rozwój” / „GitHub”. Linki otwierane kliknięciem nie przekazują danych z rozszerzenia (zgodnie z `docs/product-direction.md`), ale to deklaracja produktowa.

### 6.3 Do czego są używane / sprzedaż / reklamy / profilowanie

- [VERIFIED FROM CODE] Dane są używane wyłącznie do działania funkcji blokowania i diagnostyki lokalnej.
- [VERIFIED FROM CODE] Brak mechanizmu przekazywania danych stronom trzecim (brak ruchu sieciowego).
- [NEEDS HUMAN CONFIRMATION] Oświadczenia certyfikacyjne: „not sold to third parties”, „not used or transferred for purposes unrelated to the item's single purpose”, „not used or transferred to determine creditworthiness or for lending purposes”. Kod jest z nimi zgodny, ale to zobowiązanie wydawcy.
- [NEEDS HUMAN CONFIRMATION] Brak użycia do reklam spersonalizowanych i profilowania (zobowiązanie wydawcy; kod nie ma takiego mechanizmu: [VERIFIED FROM CODE]).
- [NEEDS HUMAN CONFIRMATION] **Polityka prywatności (URL)**: repozytorium nie ma polityki prywatności ani publicznej strony, na której można by ją umieścić, a repo jest prywatne. Prawdopodobnie wymagana przy uprawnieniach takich jak `<all_urls>`.

### 6.4 Szkice uzasadnień uprawnień

| Pole | Szkic | Oznaczenie |
|---|---|---|
| Single purpose | „ChromeBlock blocks ads, trackers and other unwanted content on web pages, locally in the browser.” | [NEEDS HUMAN CONFIRMATION] (zakres Focus Mode, sekcja 4) |
| `declarativeNetRequest` | Blocks ad, tracking and malicious network requests using built-in filter lists; allows the user to disable protection per site and add own filters. | [VERIFIED FROM CODE] |
| `activeTab` (zamiast `declarativeNetRequestFeedback`) | When the user clicks the ChromeBlock icon, shows the exact number of blocked requests for that tab in the popup (`declarativeNetRequest.getMatchedRules`). | [VERIFIED FROM CODE] (`release-permissions-v1`) |
| `scripting` | Applies cosmetic filters (hides empty ad containers), registers filter-list scriptlets that neutralise anti-adblock and in-player ads, and runs the user-invoked element picker. | [VERIFIED FROM CODE] |
| `storage` | Stores the user's settings (enabled lists, protection mode, disabled sites, own filters, Focus Mode) and local diagnostics on the device. | [VERIFIED FROM CODE] |
| `webNavigation` | Updates the toolbar icon when protection is disabled for the visited site and resets YouTube player diagnostics on navigation. | [VERIFIED FROM CODE]; [NEEDS HUMAN CONFIRMATION], czy zostawić (sekcja 1) |
| Host permission `<all_urls>` | Ad blocking must work on any website: cosmetic filtering and scriptlets need access to pages, and redirect rules replace ad scripts with local no-op resources. No page data leaves the browser. | [VERIFIED FROM CODE] |
| Remote code | „No, I am not using remote code.” All JavaScript is included in the package; filter lists are compiled at build time. | [VERIFIED FROM CODE] |

---

## 7. Blokery i otwarte decyzje przed wysłaniem do Chrome Web Store

| # | Blokada | Typ |
|---|---|---|
| 1 | Licencje list (Polskie Filtry NC/SA, brak `THIRD-PARTY-NOTICES`, brak licencji ChromeBlock, prywatne repo wobec obowiązków udostępnienia źródeł): zob. [third-party-license-audit.md](third-party-license-audit.md) | **BLOCKER** |
| 2 | Brak paczki produkcyjnej: dzisiejszy ZIP ma manifest w podkatalogu oraz tester, `.cmd` i `INSTALL.md` | **BLOCKER** (do zrobienia: `package:release`) |
| 3 | Manifest oznaczony jako developerski (`description`: „Wersja developerska”, `version_name`: `-dev`) | **BLOCKER** |
| 4 | Brak polityki prywatności i miejsca na jej publikację (repo prywatne) | **BLOCKER** `NEEDS HUMAN CONFIRMATION` (czy wymagana) |
| 5 | Zakres single purpose wobec Focus Mode | decyzja |
| 6 | Opcjonalne zawężenie uprawnień: `declarativeNetRequestFeedback` → `activeTab` **RESOLVED** (`release-permissions-v1`); `webNavigation` do decyzji | decyzja (nie blokuje) |
| 7 | Filtry „trusted” z wbudowanym zminifikowanym kodem: wyjaśnienie w recenzji | decyzja |
| 8 | Elementy listingu (zrzuty ekranu, opis, kategoria, język, ewentualnie `_locales`): nie były przedmiotem audytu | do przygotowania |
