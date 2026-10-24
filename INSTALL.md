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

## Odinstalowanie

1. W `chrome://extensions` kliknij **Usuń** na karcie ChromeBlock.
2. Usuń folder `%LOCALAPPDATA%\ChromeBlock` (wklej tę ścieżkę w pasek adresu Eksploratora plików).

## Co robi instalator

Instalator **tylko kopiuje pliki** do `%LOCALAPPDATA%\ChromeBlock`, otwiera stronę rozszerzeń Chrome i kopiuje ścieżkę do schowka.
- Nie zmienia ustawień ani polityk Chrome.
- Nie modyfikuje rejestru.
- Nie instaluje niczego bez Twojej wiedzy.

Rozszerzenie włączasz sam, przyciskiem „Załaduj rozpakowane”.
