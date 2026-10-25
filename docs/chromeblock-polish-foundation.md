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
