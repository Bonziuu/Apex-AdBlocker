# Licencjonowanie Apex AdBlocker

Własny kod i dokumentacja Konrada Woźniaka: MIT, © 2026 Konrad Woźniak
(zobacz LICENSE). MIT pozwala na dobrowolne wsparcie autora, darowizny oraz
zastosowania komercyjne tego kodu. Nie nakłada obowiązku zapłaty.

Licencja MIT nie obejmuje cudzych list filtrów, danych Public Suffix List,
zdjęć stron trzecich ani ich przetworzonych postaci w wygenerowanych plikach.
Licencje tych materiałów i autorów opisuje THIRD_PARTY_NOTICES.md.
Pole license pakietu odsyła do tego rozdzielenia, a nie do jednolitej licencji
całej dystrybucji.

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

## Otwarte warunki dystrybucji

MIT własnego kodu nie usuwa istniejącej kwestii łączenia GPL i CC BY-NC-SA
w tych samych wygenerowanych artefaktach. Nie należy oznaczać tych plików jako
MIT ani uznawać niniejszego dokumentu za potwierdzenie zgodności całej paczki.
Przed publikacją trzeba rozstrzygnąć obowiązki dotyczące tych artefaktów,
licencji share-alike oraz udostępnienia odpowiadających im źródeł.
Szczegóły: docs/filter-provenance.md, sekcja 5.

## Teksty licencji i źródła

Pełny tekst GPLv3 znajduje się w LICENSES/GPL-3.0.txt, a MPL 2.0 w
shared/public-suffix-LICENSE.txt. Adresy licencji Creative Commons są podane
w THIRD_PARTY_NOTICES.md. Dołączenie tych tekstów nie usuwa kwestii mieszanych
artefaktów opisanej powyżej.

Źródła reguł i instrukcje odtworzenia są w repozytorium
https://github.com/Bonziuu/Apex-AdBlocker — tools/lists/, tools/, shared/ oraz
pozostałe źródła rozszerzenia. Dla konkretnego ZIP-a trzeba używać dokładnie
commita wskazanego przy jego udostępnieniu, bez aktualizacji list.
Polecenia: npm ci, node tools/build-entity-hosts.mjs, npm run build,
npm run check -- --require-browser, npm run package:store (Node.js >=20).
Nie jest to stwierdzenie zgodności całej dystrybucji z GPL ani zgoda na
komercyjne użycie materiałów CC BY-NC-SA.
