# Tarcza – bloker reklam dla Chrome (Manifest V3)

Wtyczka blokująca reklamy, śledzenie i złośliwe strony, zbudowana na tych samych listach filtrów co uBlock Origin i działająca w obecnym Chrome.

## Instalacja

1. Pobierz repozytorium: `git clone https://github.com/Bonziuu/Chromeblock.git` (albo zielony przycisk **Code → Download ZIP** i rozpakuj).
2. Otwórz w Chrome adres `chrome://extensions`.
3. Włącz **Tryb dewelopera** (przełącznik w prawym górnym rogu).
4. Kliknij **Załaduj rozpakowane** i wskaż folder `Chromeblock` (ten, w którym jest `manifest.json`).
5. Przypnij ikonę tarczy na pasku (ikona puzzla → pinezka).

Nie usuwaj ani nie przenoś folderu po instalacji – Chrome ładuje wtyczkę bezpośrednio z niego.

## Co potrafi

| Funkcja | Jak działa |
|---|---|
| Blokowanie reklam i trackerów | ~131 tys. filtrów z EasyList, EasyPrivacy, uBlock filters i Polskich Filtrów, zamienionych na reguły `declarativeNetRequest` |
| Ukrywanie pustych miejsc po reklamach | ~97 tys. filtrów kosmetycznych, wstrzykiwanych jako arkusz stylów użytkownika (strona nie może go nadpisać) |
| Strony z wykrywaniem adblocka, YouTube | Scriptlety zgodne z uBlock Origin: `set-constant`, `json-prune`, `abort-current-script`, `no-fetch-if` itd. – uruchamiane, zanim wykona się kod strony |
| Filtry proceduralne | `:has-text()`, `:upward()`, `:remove()`, `:style()`, `:matches-path()`, `:min-text-length()` |
| Wyłączanie na stronie | Przycisk zasilania w okienku wtyczki (strona jest od razu przeładowana) |
| Ukryj element | Wskazujesz element myszką, wtyczka tworzy filtr i zapamiętuje go |
| Moje filtry | Własne reguły w składni uBlock Origin / Adblock Plus |
| Dodatkowe listy | Komunikaty o cookies i elementy irytujące – do włączenia w ustawieniach |

Domyślnie włączone listy mają łącznie ~21,7 tys. reguł Chrome, a wszystkie razem ~25 tys. Mieści się to w gwarantowanym przez Chrome limicie 30 tys. reguł, więc każda kombinacja list zawsze się włączy.

## Odświeżanie list filtrów

Listy są wbudowane we wtyczkę. Raz na jakiś czas możesz je zaktualizować (potrzebny Node.js 18+):

```bash
cd Chromeblock
node tools/update-lists.mjs   # pobiera najnowsze listy
node tools/build.mjs          # przebudowuje reguły
```

Potem w `chrome://extensions` kliknij ikonę odświeżenia przy Tarczy.

## Struktura

```
manifest.json            definicja rozszerzenia (MV3)
background.js            service worker: listy, własne filtry, scriptlety, CSS
shared/parser.js         parser filtrów ABP/uBO → reguły Chrome (używany też przez build)
content/cosmetic.js      ukrywanie elementów, filtry ogólne i proceduralne
content/picker.js        tryb „Ukryj element”
popup/, options/         interfejs
rules/*.json             wygenerowane reguły declarativeNetRequest
data/*.json              wygenerowane filtry kosmetyczne
scriptlets/*.js          wygenerowane scriptlety (świat MAIN strony)
web_accessible_resources atrapy skryptów reklamowych (gpt.js, analytics.js…) dla filtrów redirect=
tools/                   build, aktualizacja list, biblioteka scriptletów, źródłowe listy
```

## Ograniczenia (wynikające z Manifest V3)

- Nie da się filtrować kodu HTML przed jego wyrenderowaniem (`##^`), zmieniać nagłówków CSP ani blokować wyskakujących okien filtrami `$popup`.
- Około 3% filtrów sieciowych i 1% kosmetycznych jest pomijanych jako niemożliwe do wyrażenia w MV3. Na większości stron nie widać różnicy, ale na pojedynczych może się coś prześlizgnąć.
- Licznik w okienku korzysta z `getMatchedRules`, które Chrome ogranicza do ok. 20 odczytów na 10 minut. Potem pokazywana jest wartość z plakietki na ikonie.

## Licencje list filtrów

EasyList, EasyPrivacy, Fanboy Annoyances © The EasyList authors (GPLv3 / CC BY-SA 3.0) · uBlock filters © Raymond Hill i współtwórcy (GPLv3) · Polskie Filtry Reklamowe © MajkiIT (CC BY-NC-SA 4.0 – bez użytku komercyjnego). Wtyczka do użytku prywatnego może je zawierać bez ograniczeń. Jeśli chcesz ją publikować w Chrome Web Store, sprawdź warunki tych licencji.
