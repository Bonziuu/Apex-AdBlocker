# Jak zainstalować ChromeBlock (Windows, bez Gita i terminala)

ChromeBlock to wersja testowa, więc nie ma go jeszcze w Chrome Web Store.
Instalacja zajmuje ok. 2 minuty.

## Instalacja

1. Pobierz plik **ChromeBlock-dev.zip**: [kliknij tutaj, aby pobrać](https://github.com/Bonziuu/Chromeblock/raw/main/download/ChromeBlock-dev.zip).
2. Kliknij go prawym przyciskiem → **Wyodrębnij wszystkie…** → **Wyodrębnij**.
3. W rozpakowanym folderze kliknij dwukrotnie **install-chromeblock.cmd**.
   - Jeśli Windows pokaże „System Windows ochronił ten komputer”, kliknij **Więcej informacji** → **Uruchom mimo to**.
   - Jeśli pojawi się „Ostrzeżenie o zabezpieczeniach”, kliknij **Uruchom**.
4. Otworzy się Chrome na stronie rozszerzeń, a w czarnym okienku zobaczysz instrukcję. W Chrome:
   1. Włącz **Tryb dewelopera** (przełącznik w prawym górnym rogu).
   2. Kliknij **Załaduj rozpakowane**.
   3. W oknie wyboru folderu kliknij pasek adresu u góry, wklej ścieżkę (**Ctrl+V**), naciśnij **Enter** i kliknij **Wybierz folder**.
5. Gotowe: ChromeBlock pojawi się na liście rozszerzeń. Przypnij go ikoną puzzla 🧩 na pasku Chrome.

ChromeBlock jest instalowany do folderu `%LOCALAPPDATA%\ChromeBlock`. **Nie usuwaj tego folderu**, bo Chrome wczytuje rozszerzenie właśnie z niego.

## Aktualizacja

1. Pobierz i rozpakuj nowy **ChromeBlock-dev.zip**.
2. Kliknij dwukrotnie **update-chromeblock.cmd**.
3. W Chrome, na stronie `chrome://extensions`, na karcie ChromeBlock kliknij ikonę odświeżania ↻.

Ustawienia i Twoje filtry zostają zachowane.

## Automatyczny test (opcjonalnie)

W rozpakowanym folderze kliknij dwukrotnie **test-chromeblock.cmd**. Wymaga [Node.js](https://nodejs.org) w wersji 20 lub nowszej (Git nie jest potrzebny).

- Przy pierwszym uruchomieniu tester pobiera Playwright i przeglądarkę testową Chromium (ok. 150 MB).
- Test działa w osobnej, tymczasowej przeglądarce. Nie używa Twojego Chrome ani Twoich danych (bez historii, loginów i cookies).
- Testowana jest wersja z folderu `ChromeBlock` obok pliku `.cmd`.
- Wynik pojawi się w oknie (**PASS**, **FAIL** albo **INCONCLUSIVE**), a raport w `wyniki-testu\latest.txt`.
- **INCONCLUSIVE** oznacza, że części testów nie dało się sprawdzić (np. brak internetu albo YouTube niedostępny). To nie jest PASS.

## Odinstalowanie

1. W `chrome://extensions` kliknij **Usuń** na karcie ChromeBlock.
2. Usuń folder `%LOCALAPPDATA%\ChromeBlock` (wklej tę ścieżkę w pasek adresu Eksploratora plików).

## Co robi instalator

Instalator **tylko kopiuje pliki** do `%LOCALAPPDATA%\ChromeBlock`, otwiera stronę rozszerzeń Chrome i kopiuje ścieżkę do schowka.
- Nie zmienia ustawień ani polityk Chrome.
- Nie modyfikuje rejestru.
- Nie instaluje niczego bez Twojej wiedzy.

Rozszerzenie włączasz sam, przyciskiem „Załaduj rozpakowane”.
