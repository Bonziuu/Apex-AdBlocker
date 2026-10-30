# Połączenie poprawek z aktualnym main

Zmiana oparta na `89faf4e4e9d8f9cd283288fc4d744a837b69d8a6` zachowuje dodatki aktualnego main i przenosi potrzebne wcześniejsze lokalne naprawy. Zachowano interfejs PL/EN i jego generator, weryfikację nadawców, branding, dynamiczne adresy zasobów, materiały sklepu i automaty na GitHubie.

| Obszar | Wynik |
|---|---|
| Parser i zakresy | Bezpieczne odrzucanie strict-party, przecięcie `$to`, encje według PSL, wykluczenia przypisane do konkretnej reguły |
| Scriptlety | Pełne URL i regexy z dwukropkami, unieważnianie XHR cache po wczesnym null i reopen, stabilne regexy globalne, remove-attr stay |
| Ustawienia | Kompilacja przed zapisem, wspólne ładowanie stanu, transakcje i sprawdzany rollback, jawny limit 5000 |
| Rejestracja | Przywracanie poprzedniego zestawu po błędzie, bez utraty ochrony przy nieudanych pomiarach |
| Ramki | Autoryzacja przez worker według strony nadrzędnej i konkretnego dokumentu, bez nowych uprawnień |
| Kosmetyka | Odwracalne style i ukrycia, zmiany atrybutów/SPA, paczki tokenów z potwierdzeniem i retry |
| Picker i UI | Brak ukrywania po nieudanym zapisie, retry i cleanup, obsługa błędów formularzy/importu, prawdziwy wynik reloadu, etykiety i komunikaty PL/EN |
| YouTube | Heartbeat raportów i reset po zmianie filmu, poprawne warunki benchmarku i klasyfikacja dalszych faz E2E |
| Listy i wydania | Atomowe aktualizacje, odrzucanie HTML/błędów pobrań, wspólny rygorystyczny check, lockfile i npm ci |
| Prywatność | Rzeczywisty zakres lokalnych pomiarów, ostrożne deklaracje sanityzacji, kontakt autora w polityce |
| Materiały sklepu | Świeże paczki, metadane wersji/hash obrazów, zachowane starsze grafiki oznaczone jako pending |

Wyjaśnienie czasu działania scriptletów w ramkach: [technical-overview.md](technical-overview.md). Autoryzacja opóźnia start w ramce o komunikację z workerem; główny dokument zachowuje `document_start`. Testy z atrapami Chrome nie potwierdzają skuteczności na rzeczywistych serwisach.

Weryfikacja:

```bash
npm ci
node tools/build-entity-hosts.mjs
npm run i18n
npm run build
npm run check -- --require-browser
npm run webstore:prepare
```

`APEX_DOM_TEST_BROWSER=/usr/bin/chromium` może uruchomić lokalne fixture DOM. Nie zastępuje przeglądarki Playwright wymaganej do testów całego rozszerzenia. Nieukończona walidacja przeglądarkowa oraz testy rzeczywistych stron nie są uznawane za zaliczone.

Licencja własnego projektu pozostaje poza zakresem tej zmiany. Nie wykonano publikacji ani zgłoszenia do Chrome Web Store.

## Wynik końcowy

Z połączonego kodu zbudowano artefakty i uruchomiono rygorystyczny check: **596 testów, 576 PASS, 0 FAIL, 20 SKIP**, bez TODO i anulowanych. Testy DOM wykonały się w systemowym Chromium. Smoke całego rozszerzenia ma wynik **SKIP**, ponieważ brakuje Chromium Playwright. Check zakończył się kodem 1 z powodu pominięć, a automat przygotowania kodem 2, oznaczając pozostałe wymagania zamiast deklarować gotowość. Wszystkie 6 kontroli technicznych paczki przeszło.

SHA-256 aktualnego ZIP-a sklepu (z danymi autora): 9bd2d6f8501fc4c226b50d91817b080eca304ccd38b105aecaf465028e33ca8a. Raport i dokładne wyniki: [readiness-report.json](webstore/readiness-report.json), [validation-evidence.json](webstore/validation-evidence.json). Nie wykonano testów rzeczywistych stron ani nowych zrzutów z bieżącego pełnego rozszerzenia. Starsze grafiki pozostają zachowane i oznaczone jako pending.

Stan publikacji kodu i polityki prywatności opisuje [final-release-status.json](webstore/final-release-status.json). Publikacja w repozytorium GitHub jest osobnym krokiem od zgłoszenia rozszerzenia do Chrome Web Store.
