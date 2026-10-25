# ChromeBlock Polish Supplement – fundament

| | |
|---|---|
| Branch | `chromeblock-polish-foundation` (od `main` @ `5e590748c9befb10c1b0a7b15a762584c6983009`) |
| Data | 2026-10-25 |
| Cel | Własna, niezależna lista uzupełniająca dla polskich stron, tworzona w trybie clean room |
| Stan | Struktura listy, provenance, narzędzie testowe. **0 reguł** (pierwsza próbka nie została jeszcze wykonana: zob. 4) |

Polskie Filtry Reklamowe zostają na razie w `main` (lista `ads`). Eksperyment z EasyList Polish (branch `replace-polish-filters`, commit `bf92745`) nie jest używany.

## 1. Zasady clean room

Reguły ChromeBlock Polish mogą powstać **wyłącznie** na podstawie:

- własnej obserwacji stron w przeglądarce (DOM, elementy oznaczone jako reklama / sponsorowane);
- ruchu sieciowego obserwowanego z załadowanym ChromeBlock;
- własnych testów ChromeBlock (`npm run test:polish-sites`, testy ręczne).

**Nie wolno:**

- kopiować reguł Polskich Filtrów (MajkiIT / Certyficate IT), EasyList Polish ani innych list;
- porównywać DOM z regułami innych list w celu ich odtworzenia;
- przepisywać ani przekształcać cudzych reguł;
- automatycznie generować reguł z cudzej listy;
- tworzyć reguły tylko dlatego, że klasa lub id zawiera słowo „ad”. Kandydat musi mieć dowód obserwacji.

Zabezpieczenia w repo:

- **`provenance.json`:** każda reguła ma jeden wpis pochodzenia (domena, typ network / cosmetic / scriptlet, data, krótki własny opis obserwacji do 200 znaków bez kodu strony, metoda `manual` / `automated-browser`).
- **Test `tests/polish/chromeblock-polish-list.test.mjs`** pilnuje, żeby:
  - każda reguła miała wpis w provenance, a typ we wpisie zgadzał się ze składnią reguły;
  - reguła była obsługiwana przez ChromeBlock;
  - żadna reguła nie była identyczna z linią innej listy wbudowanej w ChromeBlock (zabezpieczenie przed przypadkowym skopiowaniem i duplikatem);
  - nagłówek miał licencję `TBD`;
  - pierwsza partia miała co najwyżej 20 reguł.
- **Test identyczności nie służy do tworzenia reguł.** Sprawdza tylko gotową regułę dopisaną przez człowieka.

## 2. Struktura

| Plik | Zawartość |
|---|---|
| `tools/lists/chromeblock-polish/chromeblock-polish.txt` | Lista: nagłówek (`Title: ChromeBlock Polish Supplement`, reguły tworzone niezależnie, `Last modified`, `License: TBD`), na razie bez reguł |
| `tools/lists/chromeblock-polish/provenance.json` | Pochodzenie reguł (`schema: 1`, opis pól, `rules: []`) |
| `tools/lists-config.mjs` | Lista dodana do kategorii `ads` (nie jest „trusted”: bez `trusted-*` scriptletów) |
| `tools/update-lists.mjs` | Bez zmian w pobieraniu: własna lista nie jest pobierana ani nadpisywana |
| `tools/polish-sites/` | Narzędzie testowe (`test-polish-sites.mjs`), analiza (`analyze.mjs`), walidacja provenance (`provenance.mjs`), domyślna próbka (`sites.json`, 20 domen) |

Build z pustą listą: reguły i dane listy `ads` bez zmian (10 302 reguły DNR, 46 323 filtry kosmetyczne, 4 550 scriptletów). Zmienił się tylko opis listy w `data/lists.json`.

## 3. Narzędzie `npm run test:polish-sites`

```
npm run test:polish-sites                     # domyślna próbka (tools/polish-sites/sites.json)
npm run test:polish-sites -- onet.pl wp.pl    # wybrane domeny (maks. 20)
npm run test:polish-sites -- --headed         # z widocznym oknem
npm run test:polish-sites -- --fixture        # offline, strony testowe (samosprawdzenie)
npm run test:polish-sites -- --gap-mode       # GAP: build testowy bez Polskich Filtrów
```

**`--gap-mode`** pokazuje, czego brakuje bez Polskich Filtrów, czyli gdzie ChromeBlock Polish Supplement ma największy sens.

- Narzędzie buduje rozszerzenie testowe **wyłącznie w katalogu tymczasowym** z konfiguracji list, z której usunięte są tylko źródła `pl/` (Polskie Filtry MajkiIT / Certyficate IT).
- EasyList, uBlock filters, EasyPrivacy, pozostałe listy i ChromeBlock Polish Supplement zostają bez zmian.
- Pliki Polskich Filtrów nie są w tym trybie wczytywane ani analizowane. Test buduje GAP z katalogu list bez folderu `pl/` i dostaje ten sam wynik.
- Normalny build, `main` i pliki w repozytorium nie są zmieniane. Katalog tymczasowy jest usuwany po teście.
- Raport zaczyna się od `MODE: GAP — without MajkiIT Polish Filters` i podaje źródła listy `ads`.

Uruchamia Chromium z ChromeBlock w tymczasowym profilu (bez historii, loginów i cookies, usuwany po teście). Dla każdej strony sprawdza:

| Sprawdzenie | Jak |
|---|---|
| Żądania zablokowane przez ChromeBlock | `requestfailed` z `ERR_BLOCKED_BY_CLIENT`, liczba i hosty |
| Elementy oznaczone jako reklama / sponsorowane | widoczny element, którego **cały** tekst to etykieta (np. „Reklama”, „Sponsorowane”, „Artykuł sponsorowany”, „Materiał partnera”); zapisywana jest etykieta, opis elementu (tag#id.klasy) i rozmiar, bez treści strony |
| Puste kontenery reklamowe | kontener etykiety bez innego tekstu i bez widocznych mediów; widoczna ramka, której żądanie zablokował ChromeBlock |
| Błędy JS | `pageerror` (liczba + do 3 pierwszych komunikatów), błędy konsoli |
| Czy strona działa | status HTTP < 400 i co najmniej 200 znaków treści; inaczej BROKEN / UNREACHABLE |

- Dodatkowo raport wypisuje niezablokowane hosty zewnętrzne (tylko nazwy hostów). Służą do ręcznego przeglądu i nie są kandydatami do reguł.
- Okien zgody (CMP) narzędzie nie klika. Raport tylko odnotowuje, że okno było widoczne.
- Raport trafia do `tests/polish-sites/results/latest.txt` / `.json` (poza repozytorium). Raport podaje tryb (`MODE: NORMAL …` / `MODE: GAP …`), a dla każdej domeny: czy strona działa, liczbę żądań zablokowanych, liczbę etykiet reklam / sponsorowanych, puste kontenery, niezablokowane hosty zewnętrzne i błędy JS.
- **Narzędzie nie generuje reguł.** Obserwacja to dowód do ręcznej oceny.

Testy narzędzia (`tests/polish/polish-sites.test.mjs`):

- analiza jednostkowo: pełne etykiety tak, „ad”, „Partner”, „Promocja” i „reklamacja” nie; klasa `ad-slot` nie jest dowodem;
- przebieg w prawdziwym Chromium na stronach testowych: blokada żądania reklamowego, pusty kontener 300×250 z etykietą, etykieta obok treści, błąd JS wykryty.

## 4. Pierwsza próbka: wynik

| | |
|---|---|
| Domeny w próbce | 20: onet.pl, wp.pl, interia.pl, o2.pl, gazeta.pl, tvn24.pl, money.pl, pudelek.pl, rmf24.pl, polsatnews.pl, sport.pl, wykop.pl, filmweb.pl, natemat.pl, gry-online.pl, businessinsider.com.pl, plotek.pl, fakt.pl, se.pl, bankier.pl |
| Przetestowane | **0**. Chromium w środowisku budowania nie ma dostępu do internetu (`net::ERR_TUNNEL_CONNECTION_FAILED` także dla example.com) |
| Znalezione problemy | 0 (brak obserwacji) |
| Dodane reguły | **0** (network 0, cosmetic 0, scriptlet 0) |
| Ryzyko false positive | brak (lista pusta) |

**Nie dodano żadnej reguły**, bo bez obserwacji nie ma dowodu. Zgodnie z zasadami nie dodano też reguł „na zapas” ani na podstawie nazw klas.

**Wymagają sprawdzenia: wszystkie 20 stron.** Pierwszą próbkę trzeba uruchomić na komputerze z dostępem do internetu:

```
npm run test:polish-sites -- --gap-mode
```

Na Windows wystarczy dwuklik na `test-polish-sites.cmd` w katalogu repozytorium (to samo polecenie). Wersja z widocznym oknem przeglądarki to `test-polish-sites-headed.cmd`. Wrappery niczego nie instalują: przy braku Node.js, npm, Playwright (`npm install`) albo Chromium (`npx playwright install chromium`) pokazują komunikat i czekają na klawisz.

**`--evidence`** zapisuje zrzut ekranu dla każdej obserwacji `ad-label` i `empty-ad-container`:

- `tests/polish-sites/results/evidence/<domena>-<nr>.png`: sam element (kontener etykiety);
- `<domena>-<nr>-context.png`: element z otoczeniem ok. 120 px.

Ścieżki trafiają do `latest.json` (pole `evidence` obserwacji). Pełny HTML strony, cookies i dane profilu nie są zapisywane, a profil pozostaje tymczasowy. Na Windows dla 9 stron (onet.pl, wp.pl, interia.pl, o2.pl, gazeta.pl, wykop.pl, businessinsider.com.pl, se.pl, bankier.pl): dwuklik `run-polish-evidence.cmd` (GAP + evidence, z przygotowaniem jak `run-polish-test.cmd`).

**Filtr ewidentnych false positive.** Samo słowo „reklama” nie wystarcza. Obserwacja dostaje `likely_false_positive: true` i powody (`false_positive_reasons`), gdy:

- etykieta jest w `footer` / `[role=contentinfo]` (np. link „Reklama” do cennika reklam serwisu);
- kontener obejmuje co najmniej połowę powierzchni strony;
- kontener jest nienaturalnie duży względem okna: wyższy niż 2× okno, szerszy niż 1,2× okno albo o powierzchni większej niż 1,5× okno.

Takie wpisy **nie są usuwane**. Raport liczy je osobno, a dla dużych kontenerów zrzut obejmuje samą etykietę.

Następnie przejrzeć `tests/polish-sites/results/latest.txt` i, przy stronach z obserwacjami, otworzyć je ręcznie (`--headed`).

## 5. Jak dodać regułę (następne partie)

1. Obserwacja na stronie: raport `test:polish-sites` i ręczne sprawdzenie w przeglądarce z ChromeBlock.
2. Reguła napisana samodzielnie na podstawie tej obserwacji: możliwie wąska (domena strony, konkretny kontener), niskie ryzyko.
3. Wpis w `provenance.json`: `rule`, `domain`, `type`, `date`, `observation` (własne słowa, maks. 200 znaków), `method`, opcjonalnie `evidence` (np. `polish-sites-<data>.json#onet.pl#2`).
4. Aktualizacja `! Last modified` w nagłówku listy.
5. `npm run build`, `node --test tests/polish/*.test.mjs`, ponowny `test:polish-sites` dla tej domeny: strona działa, obserwacja zniknęła, brak nowych błędów JS.

## 6. Partia 1 (2026-10-25)

Źródło: raport użytkownika z `npm run test:polish-sites -- --gap-mode --evidence`, czyli obserwacje i zrzuty własnego testu. Reguł nie porównywano z Polskimi Filtrami ani z EasyList Polish. Test duplikatów w `tests/polish/chromeblock-polish-list.test.mjs` nie wczytuje plików `pl/`.

| Domena | Dowód | Reguła (typ) | Zakres |
|---|---|---|---|
| bankier.pl | `bankier.pl#1` | `bankier.pl##div#n2b-ad-r2.n2b-ad-container` (cosmetic) | jeden slot (id + klasa); `#2` i `#3` = false positive (cała strona / footer), pominięte |
| businessinsider.com.pl | `businessinsider.com.pl#1` | `flat-ad-wrapper#flat-natleft-2 *:has-text(/^\s*materiał promocyjny\s*$/i):upward(flat-ad-wrapper)` (cosmetic, proceduralna) | slot `flat-natleft-2` tylko z elementem o dokładnej etykiecie |
| businessinsider.com.pl | `businessinsider.com.pl#2` | `.ods-c-card-wrapper *:has-text(/^\s*materiał promocyjny\s*$/i):upward(.ods-c-card-wrapper)` (cosmetic, proceduralna) | tylko karta z elementem o dokładnej etykiecie, nie wszystkie `.ods-c-card-wrapper` |
| gazeta.pl | `gazeta.pl#1`–`#19` | `article.tile *:has-text(/^\s*materiał promocyjny\s*$/i):upward(article.tile)` (cosmetic, proceduralna) | jedna reguła zamiast 19; tylko kafel `article.tile` z elementem o dokładnej etykiecie; `#20` (footer) pominięty |

Razem: **4 reguły kosmetyczne** (1 zwykła, 3 proceduralne), 0 sieciowych, 0 scriptletów. Każda ma wpis w `provenance.json` (metoda `automated-browser`, pole `evidence`).

**Dokładna etykieta.** `:has-text(/^\s*materiał promocyjny\s*$/i)` dopasowuje tylko element, którego cały tekst to „materiał promocyjny” (dowolna wielkość liter, także „Ł”). Tytuł zawierający te słowa („Materiał promocyjny – recenzja…”) nie pasuje.

**Ryzyko false positive: niskie, do potwierdzenia retestem.**

- bankier.pl: reguła dotyczy jednego slotu po id.
- gazeta.pl i businessinsider.com.pl ukrywają kafel tylko z dokładną etykietą, ale:
  - jeśli `.ods-c-card-wrapper` obejmuje więcej niż jedną kartę (np. cały rząd), ukryje się cały rząd. Do sprawdzenia na zrzucie po reteście;
  - kafle gazeta.pl, które nie są `article.tile` (z 19 obserwacji „większość” jest `article.tile`), zostaną nieukryte. Retest pokaże, czy coś zostało.
- Reguły proceduralne działają w skrypcie treści, po wczytaniu strony, a nie przez CSS od startu: kafel może mignąć przed ukryciem.

**Test mechaniki** (`tests/polish/chromeblock-polish-rules-live.test.mjs`): Chromium z rozszerzeniem, w którym lista „Reklamy” ma wyłącznie ChromeBlock Polish Supplement, na lokalnych stronach testowych o opisanej strukturze.

- Ukryte: `#n2b-ad-r2`, `#flat-natleft-2`, karta z etykietą, kafle z etykietą.
- Widoczne: `#n2b-ad-r3`, inne sloty i karty, kafel z tymi słowami w tytule, stopka.

**Retest na prawdziwych stronach: WYMAGANY u użytkownika.** W środowisku budowania wszystkie 3 domeny mają status UNREACHABLE (`net::ERR_TUNNEL_CONNECTION_FAILED`), więc retestu stąd nie ma.

### Poprawki po reteście użytkownika (2026-10-25, `retest-polish-batch1.cmd`)

| Domena | Wynik retestu | Zmiana |
|---|---|---|
| bankier.pl | reguła działa; pozostałe 2 obserwacje to false positive | bez zmian |
| businessinsider.com.pl | dwie stare reguły nie trafiały w aktualny DOM; nowe obserwacje `#2`, `#3`: karty `div.section-list_mosaic-3elem > a.list-item.item--m.item--m--img-right` z dokładną etykietą (jedna z `#slot-flat-natleft-2`); `#1` (menu w `header > nav`) = false positive | 2 stare reguły usunięte. Jedna nowa: `div.section-list_mosaic-3elem > a.list-item.item--m.item--m--img-right *:has-text(/^\s*materiał promocyjny\s*$/i):upward(a.list-item.item--m.item--m--img-right)`. Ukrywa tylko kartę z dokładną etykietą, nie całą mozaikę ani karty poza nią |
| gazeta.pl | reguła `article.tile` usunęła wcześniejsze kafle; nowa obserwacja `#1`: `div.salesModule.salesModule--fourColumn > a.salesModule__article` z dokładną etykietą; `#2` (stopka) = false positive | reguła `article.tile` zostaje. Druga reguła: `div.salesModule.salesModule--fourColumn > a.salesModule__article *:has-text(/^\s*materiał promocyjny\s*$/i):upward(a.salesModule__article)` |

Stan listy: **4 reguły kosmetyczne** (bankier.pl 1, businessinsider.com.pl 1, gazeta.pl 2). `provenance.json` odpowiada dokładnie tym regułom: dowody `bankier.pl#1`, `businessinsider.com.pl#2-#3`, `gazeta.pl#1-#19` (pierwszy test) i `gazeta.pl#1` (retest).

Test mechaniki w Chromium (lokalne strony o strukturze z retestu):

- ukryte: karty z etykietą w mozaice, w tym `#slot-flat-natleft-2`, oraz `a.salesModule__article` z etykietą;
- widoczne: mozaika, karta z tymi słowami w tytule, karta z etykietą poza mozaiką, pozycja menu w nagłówku, moduł `salesModule`, link bez etykiety, stopka.

Kolejny retest na prawdziwych stronach: wymagany u użytkownika.

### Business Insider: dwa warianty DOM (kolejny retest, 2026-10-25)

Najnowszy retest użytkownika pokazał na businessinsider.com.pl inny DOM niż poprzedni. Strona serwuje **co najmniej dwa warianty**, więc reguły dla obu są utrzymywane równolegle. Każda ukrywa tylko element z dokładną etykietą „materiał promocyjny”; nie ma jednej szerokiej reguły na cały serwis.

| Wariant | Struktura | Reguła | Dowód |
|---|---|---|---|
| A | `div.section-list_mosaic-3elem > a.list-item.item--m.item--m--img-right` | `div.section-list_mosaic-3elem > a.list-item.item--m.item--m--img-right *:has-text(/^\s*materiał promocyjny\s*$/i):upward(a.list-item.item--m.item--m--img-right)` | `businessinsider.com.pl#2-#3` (poprzedni retest) |
| B | `flat-ad-wrapper#flat-natleft-2` | `flat-ad-wrapper#flat-natleft-2 *:has-text(/^\s*materiał promocyjny\s*$/i):upward(flat-ad-wrapper)` (przywrócona) | `businessinsider.com.pl#1` (najnowszy retest) |
| B | `.ods-c-card-wrapper` | `.ods-c-card-wrapper *:has-text(/^\s*materiał promocyjny\s*$/i):upward(.ods-c-card-wrapper)` (przywrócona) | `businessinsider.com.pl#2` (najnowszy retest) |

Stan listy: **6 reguł kosmetycznych** (bankier.pl 1, businessinsider.com.pl 3, gazeta.pl 2). `provenance.json` ma 6 wpisów, po jednym na regułę.

Test mechaniki w Chromium obejmuje oba warianty BI na osobnych stronach testowych. W obu wariantach:

- karty i sloty z etykietą są ukryte;
- karty bez etykiety, także te z tymi słowami w tytule, są widoczne;
- pozycja menu w nagłówku jest widoczna;
- kontener nadrzędny (mozaika / sekcja) jest widoczny.

## 7. Partia 2A (2026-10-25)

Źródło: obserwacje z realnego testu `test-polish-batch2.cmd` (GAP + evidence) przekazane przez użytkownika. Reguł nie porównywano z Polskimi Filtrami ani z EasyList Polish.

| Domena | Dowód | Reguła | Zakres |
|---|---|---|---|
| wykop.pl | `wykop.pl#1` (pusty `li.ad` ok. 250×36, etykieta „reklama”) | `wykop.pl##div.content > ul > li.ad` (zwykła) | tylko element `li.ad` listy w `div.content`; `#2` (stopka) pominięty |
| wp.pl | `wp.pl#1` (`div.mt-5.flex.w-full > div.w-[300px] > a.wp-teaser-regular`, etykieta „SPONSOROWANE”) | `wp.pl##a.wp-teaser-regular *:has-text(/^\s*sponsorowane\s*$/i):upward(a.wp-teaser-regular)` | tylko teaser z elementem o dokładnej etykiecie; bez dynamicznego ID; `#2` (stopka) pominięty |
| o2.pl | `o2.pl#1` (ta sama struktura co wp.pl) | `o2.pl##a.wp-teaser-regular *:has-text(/^\s*sponsorowane\s*$/i):upward(a.wp-teaser-regular)` | jw. dla o2.pl |
| onet.pl | `onet.pl#1-#6` (karty `article.StandardCard…` w `StandardLeftFeed`, etykieta „MATERIAŁ PROMOCYJNY”) | `onet.pl##[class*="StandardLeftFeed"] article[class*="StandardCard"] *:has-text(/^\s*materiał promocyjny\s*$/i):upward(article[class*="StandardCard"])` | pojedyncza karta z dokładną etykietą; stabilny fragment nazwy klasy zamiast hasha; feed nieukrywany |

Decyzje:

- **WP/O2:** w selektorze nie ma klasy `w-[300px]` (nawiasy kwadratowe wymagałyby escapowania w CSS). Zakres zawęża sama etykieta. Reguła działa na domenie i jej subdomenach (np. `*.wp.pl`).
- **Onet:** `[class*="StandardCard"]` i `[class*="StandardLeftFeed"]` zamiast pełnych nazw klas z hashem, które mogą się zmieniać przy wdrożeniach.
- **Pominięte:** `onet.pl#7`, `#8` (brak zrzutu evidence), interia.pl i se.pl (partia 2B), jbzd.com.pl (tylko zbieranie evidence w `test-polish-batch2.cmd`, bez reguły).

Stan listy: **10 reguł kosmetycznych**: partia 1 (6) bez zmian, partia 2A (4). `provenance.json` ma 10 wpisów.

Test mechaniki w Chromium:

| Domena | Ukryte | Widoczne |
|---|---|---|
| wykop.pl | `li.ad` | zwykłe `li`, kontener, stopka |
| wp.pl / o2.pl | teaser z osobną etykietą (z liczbowym ID, którego reguła nie używa) | zwykły teaser, teaser ze słowem „sponsorowane” tylko w tytule, wiersz, stopka |
| onet.pl | karta z etykietą | zwykła karta, karta z „materiał promocyjny” tylko w tytule, cały feed |

Retest na prawdziwych stronach: wymagany u użytkownika (`test-polish-batch2.cmd`, obejmuje też jbzd.com.pl).
