# Automatyczne zrzuty do Chrome Web Store

Najprościej uruchomić `npm run webstore:prepare`: po pomyślnym smoke generator użyje świeżo przygotowanej paczki. Do osobnego uruchomienia podaj aktualny `package.extensionDir` z `readiness-report.json`, zamiast przypadkowej starszej zawartości `dist/`. Nazwy pól i wymagania obrazów należy sprawdzić w bieżącym panelu sklepu.

```bash
export PLAYWRIGHT_BROWSERS_PATH=/workspace/apex-cloud-setup/browsers
npx --no-install playwright install chromium
node tools/webstore-screenshots.mjs --dir dist/Apex-AdBlocker --out docs/webstore/screenshots-pl --locale pl
node tools/webstore-screenshots.mjs --dir dist/Apex-AdBlocker --out docs/webstore/screenshots-en --locale en
```

Skrypt uruchamia rzeczywiste rozszerzenie w tymczasowym, pustym profilu Chromium Playwright. Sprawdza, czy Chrome przyjął rozszerzenie oraz czy synchronizacja rzeczywiście się powiodła i silniki nie zgłaszają błędów. Nie odwiedza zewnętrznych witryn i nie podmienia API Chrome.

Po sukcesie powstają trzy obrazy PNG **1280×800**, bez późniejszego przerabiania obrazu:

1. `01-protection.png` — strona ochrony, rzeczywiste listy i domyślne ustawienia;
2. `02-user-filters.png` — edytor z jawnie oznaczonym przykładem dla fikcyjnej domeny `example.com`, zapisanym przez prawdziwy interfejs rozszerzenia;
3. `03-settings-backup.png` — rzeczywisty interfejs eksportu i importu ustawień.

`metadata.json` zapisuje wersję rozszerzenia, hash użytej zawartości, rozmiary i SHA-256 obrazów oraz pochodzenie z rzeczywistego rozszerzenia. Zrzuty pokazują interfejs, nie dowodzą skuteczności blokowania reklam na zewnętrznych stronach. Przed przesłaniem należy obejrzeć obrazy i sprawdzić aktualne wymagania materiałów sklepu.

Do zgłoszenia wybierz tylko pliki wskazane jako aktualne w `submission.json` i powiązane metadanymi z wydawaną paczką. Nie dołączaj `metadata.json` jako obrazu i nie zmieniaj w nim ręcznie statusu lub hasha. Jeśli dodajesz wpis sklepu w drugim języku, obrazy powinny odpowiadać temu językowi; generator domyślnie wybiera polski. Wersję angielską wykonaj z `--locale en` i osobnym katalogiem `--out`. Narzędzie wymusza język Chrome i sprawdza faktyczny język strony przed zapisaniem obrazu.

Starsze pliki `store/screenshots/en/` i `store/screenshots/pl/` to zachowane kompozycje demonstracyjne. Ich stan opisuje `store/capture-metadata.json`; przy `status: pending` nie używaj ich jako potwierdzonych przechwyceń bieżącej paczki. Generator `node store/generate.mjs` może przygotować nowy komplet po uruchomieniu rzeczywistego rozszerzenia, lecz te kompozycje nadal nie są testem zewnętrznych serwisów.

Dotychczasowe wyniki generatora są zastępowane dopiero po pomyślnym przygotowaniu całego zestawu. Katalog bez `metadata.json` tego generatora lub zawierający dodatkowe pliki użytkownika spoza metadanych nie jest nadpisywany; trzeba wybrać nowy `--out`.

**Brak przeglądarki:** narzędzie zgłasza brak Chromium Playwright kodem 2 i nie wytwarza makiet ani zastępczych zrzutów. Systemowe Chromium z polityką administratora blokującą rozszerzenia nie zastępuje tej walidacji. Bieżący stan przechwyceń odczytaj z `readiness-report.json`; sam plik instrukcji nie potwierdza, że wykonano nową serię.
