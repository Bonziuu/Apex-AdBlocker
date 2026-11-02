# Licencjonowanie Apex AdBlocker

## Kod Apex AdBlocker – MIT

Własny kod i dokumentacja Konrada Woźniaka: MIT, © 2026 Konrad Woźniak
(zobacz LICENSE). MIT pozwala na dobrowolne wsparcie autora, darowizny oraz
zastosowania komercyjne tego kodu. Nie nakłada obowiązku zapłaty.

Licencja MIT nie obejmuje cudzych list filtrów, danych Public Suffix List,
zdjęć stron trzecich ani ich przetworzonych postaci w wygenerowanych plikach.
Pole license pakietu odsyła do tego rozdzielenia, a nie do jednolitej licencji
całej dystrybucji.

## Dane list filtrów – licencje według listy

Każda lista ma osobne pliki wynikowe (`rules/<lista>.json`,
`data/<lista>*.json`, `scriptlets/<lista>-*.js`). Pliki jednej listy zawierają
dane tylko jednej rodziny licencji:

| Lista | Źródła | Licencja wygenerowanych danych |
|---|---|---|
| `ads` | EasyList, uBlock filters | GPL-3.0-only |
| `privacy` | EasyPrivacy, uBlock filters – Privacy | GPL-3.0-only |
| `security` | uBlock filters – Badware risks | GPL-3.0-only |
| `pl` | Oficjalne Polskie Filtry (Certyficate IT) | CC BY-NC-SA 4.0 |

Pełna mapa „plik wynikowy → źródła → licencja”, opis zmian (konwersji do
formatu Apex), daty i uznanie autorstwa: THIRD_PARTY_NOTICES.md. Konfiguracja
źródeł i ich licencji: tools/lists-config.mjs (LISTS, SOURCE_LICENSES).
Rozdzielenie pilnuje test tests/build/license-separation.test.mjs: pliki każdej
listy są budowane wyłącznie z jej źródeł.

## Polskie Filtry i Chrome Web Store

Polskie Filtry są dystrybuowane na warunkach CC BY-NC-SA 4.0 (klauzule
NonCommercial i ShareAlike).

## Opcjonalne wsparcie autora

Licencja własnego kodu nie zabrania umieszczenia w przyszłości dobrowolnego
linku wsparcia. Nie jest to jednak zgoda właścicieli Polskich Filtrów na
komercyjne używanie ich materiałów. CC BY-NC-SA 4.0 ocenia charakter użycia;
samo słowo „darowizna” ani bezpłatna instalacja nie rozstrzygają tej oceny.
Nie dodano linku płatności ani obietnicy zgodności takiego przyszłego modelu.
Przed jego uruchomieniem należy ustalić, czy konkretny model dystrybucji
i wsparcia mieści się w NonCommercial. Jeżeli wykracza poza udzielone prawa
albo nie można potwierdzić odpowiedniego uprawnienia, należy uzyskać zgodę
uprawnionych autorów lub zastąpić listy materiałami o odpowiednich warunkach.

## Kwestie otwarte

Wydzielenie Polskich Filtrów usuwa łączenie danych GPL i CC BY-NC-SA w tych
samych wygenerowanych plikach. Nie rozstrzyga ono, czy dystrybucja w Chrome Web
Store mieści się w NonCommercial (zob. wyżej), ani zakresu obowiązków GPL
dotyczących wygenerowanych artefaktów. Ten dokument nie jest opinią prawną.
Szczegóły: docs/filter-provenance.md, sekcja 5.

## Teksty licencji i źródła

Pełny tekst GPLv3 znajduje się w LICENSES/GPL-3.0.txt, a MPL 2.0 w
shared/public-suffix-LICENSE.txt. Adresy licencji Creative Commons są podane
w THIRD_PARTY_NOTICES.md.

Źródła reguł i instrukcje odtworzenia są w repozytorium
https://github.com/Bonziuu/Apex-AdBlocker — tools/lists/, tools/, shared/ oraz
pozostałe źródła rozszerzenia. Dla wydania X.Y.Z źródłem jest tag vX.Y.Z
(https://github.com/Bonziuu/Apex-AdBlocker/tree/vX.Y.Z) i archiwum
„Source code” przy wydaniu. Dla innego ZIP-a trzeba używać dokładnie commita
wskazanego przy jego udostępnieniu, bez aktualizacji list.
Polecenia: npm ci, node tools/build-entity-hosts.mjs, npm run build,
npm run check -- --require-browser, npm run package:store (Node.js >=20).
Nie jest to stwierdzenie zgodności całej dystrybucji z GPL ani zgoda na
komercyjne użycie materiałów CC BY-NC-SA.
