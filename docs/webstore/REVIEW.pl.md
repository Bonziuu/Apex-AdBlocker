# Kontrola paczki 1.0.0

ZIP: `dist/Apex-AdBlocker-WebStore-1.0.0.zip`

SHA-256: `f58affb6dc6f3bbaa866ac5a81cf923ba106eb92e029b66da9b3980358589588`

Przeprowadzono ponownie kontrolę ścisłą z `APEX_DOM_TEST_BROWSER=/usr/bin/chromium`:
597 testów, 577 zaliczonych, 0 błędów, 20 pominiętych. Smoke rozszerzenia: SKIP.
Kod wyjścia kontroli: 1. `webstore:prepare`: 2 (brakujące przesłanki zgłoszenia).
Systemowy Chromium uruchomił 12 testów DOM; polityka zarządzanej przeglądarki
blokuje instalowanie rozszerzeń. Nie użyto go jako dowodu działania rozszerzenia.
Playwright Chromium wymaga zastosowania zapisanych domen sieciowych.

Walidacja struktury ZIP, odwołań manifestu, plików scriptletów i zgodności
bajtów z bieżącym checkoutem: PASS. Build sprawdzony w katalogu tymczasowym;
artefakty aktualne. Pełny log: `dist/webstore-validation/check.log`.

Własny kod: MIT. Pełny tekst GPLv3 dołączony obok istniejącego MPL.
Licencje GPL / CC BY-NC-SA w mieszanych artefaktach pozostają nierozstrzygnięte.
Dobrowolne wsparcie nie jest zakazane przez MIT; trzeba ocenić konkretny model
w świetle licencji cudzych filtrów. Nie dodano funkcji płatności.

Dziesięć zrzutów od autora ma właściwy format. Oryginały zachowano bez zmian.
Nie potwierdzono, że pokazują aktualny ZIP. Nadal wymagają doprecyzowania
podzbioru składni filtrów i oznaczenia rozmycia reklam lub zastąpienia go
rzeczywistymi przechwyceniami. Nie przypisano im fałszywej metadanej generatora.

Nie wykonano testów zewnętrznych stron ani pełnego uruchomienia rozszerzenia.
Przegląd wybranych ścieżek kodu nie wykazał nowego konkretnego błędu runtime;
nie stanowi pełnego audytu bezpieczeństwa.

Paczka jest do sprawdzenia i przygotowania wpisu roboczego.
Nie uznano jej za gotową do wysłania do oceny Chrome Web Store.
Raporty readiness/evidence pochodzą z bieżącego rzeczywistego przebiegu;
ścieżki webstore-prepare-* wskazują lokalne pliki tego przebiegu. W nowym
checkoutcie odtwórz je przez `npm ci` i `npm run webstore:prepare` po instalacji
Playwright Chromium. Użyj źródeł z tego samego commita co ZIP i nie aktualizuj list.
