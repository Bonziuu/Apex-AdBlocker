# Instalacja Apex AdBlocker

Apex AdBlocker nie jest jeszcze publikowany w Chrome Web Store, dlatego obecnie instaluje się go jako rozszerzenie rozpakowane.

## Najprostsza instalacja

1. Wejdź na stronę [Releases](https://github.com/Bonziuu/Chromeblock/releases/latest).
2. W sekcji **Assets** pobierz plik `Apex-AdBlocker-<wersja>.zip`.
3. Rozpakuj ZIP do **stałego miejsca na dysku**, np. `Dokumenty/Apex-AdBlocker`.
4. Otwórz w Chrome adres `chrome://extensions`.
5. Włącz **Tryb dewelopera** w prawym górnym rogu.
6. Kliknij **Załaduj rozpakowane**.
7. Wskaż folder `Apex-AdBlocker` z rozpakowanej paczki.

Po chwili ikona Apex AdBlocker powinna pojawić się na liście rozszerzeń. Możesz przypiąć ją do paska narzędzi z menu rozszerzeń Chrome.

> **Ważne:** nie usuwaj ani nie przenoś folderu `Apex-AdBlocker` po instalacji. Chrome korzysta z niego podczas działania rozszerzenia.

## Aktualizacja

Dopóki Apex AdBlocker jest instalowany jako rozszerzenie rozpakowane, aktualizacje są ręczne:

1. pobierz nowszą paczkę z Releases,
2. zamknij popup Apex AdBlocker, jeśli jest otwarty,
3. zastąp zawartość dotychczasowego folderu `Apex-AdBlocker` plikami z nowej paczki, zachowując tę samą ścieżkę folderu,
4. otwórz `chrome://extensions`,
5. kliknij **Odśwież** przy Apex AdBlocker.

Zachowanie tej samej ścieżki jest wygodne, bo nie trzeba ponownie wskazywać rozszerzenia w Chrome.

## Usuwanie

1. Otwórz `chrome://extensions`.
2. Kliknij **Usuń** przy Apex AdBlocker.
3. Po usunięciu rozszerzenia możesz skasować folder `Apex-AdBlocker` z dysku.

## Weryfikacja pobranego pliku

Do paczki release generowany jest plik `SHA256SUMS.txt`. Możesz sprawdzić sumę SHA-256 pobranego ZIP-a, np. w Windows PowerShell:

```powershell
Get-FileHash .\Apex-AdBlocker.zip -Algorithm SHA256
```

Wartość powinna być zgodna z odpowiednim wpisem w `SHA256SUMS.txt` dołączonym do wydania.

## Dla deweloperów

Jeżeli rozwijasz Apex AdBlocker lokalnie, zamiast paczki Release możesz sklonować repozytorium:

```bash
git clone https://github.com/Bonziuu/Chromeblock.git
```

Następnie wskaż katalog repozytorium w **Załaduj rozpakowane**. Po `git pull` kliknij **Odśwież** przy rozszerzeniu w `chrome://extensions`, aby Chrome przeładował także service workera.

Do przygotowania czystych paczek służą:

```bash
npm run package:dev
npm run package:release
npm run package:store
```

`package:release` tworzy wersjonowany ZIP dla użytkownika, stały plik `Apex-AdBlocker.zip` oraz `SHA256SUMS.txt`.

`package:store` tworzy `Apex-AdBlocker-WebStore-<wersja>.zip` z `manifest.json` bezpośrednio w katalogu głównym archiwum — gotowy do uploadu w Chrome Web Store.
