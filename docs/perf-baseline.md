# Baseline rozmiaru i wydajności

Cel: każda przyszła optymalizacja ma liczby przed/po. Ten etap niczego nie optymalizuje.

```
npm run perf:baseline                       # pełny pomiar (~3 min): rozmiar + startup + wybudzenia SW + runtime
npm run perf:baseline -- --size-only        # tylko rozmiar (deterministyczny, bez Chromium)
npm run perf:baseline -- --runs 20          # liczba mierzonych powtórzeń (domyślnie 15, plus 1 rozgrzewka)
npm run perf:baseline -- --write-baseline   # zapisuje perf/baseline.json (świadomie, do commita)
```

Raport trafia do `perf/results/latest.txt` i `latest.json` (w `.gitignore`, nie commitujemy). Do repozytorium trafia tylko mały `perf/baseline.json` ze stabilnymi metrykami.

Narzędzie (`tools/perf-baseline.mjs`) nie trafia do paczki rozszerzenia: paczka zawiera tylko `EXTENSION_ENTRIES` (`tools/`, `perf/`, `tests/`, `docs/` są poza nią), co pilnuje test `tests/tools/perf-baseline.test.mjs`.

## 1. Rozmiar

- Pliki: dokładnie te, które buduje `npm run package:dev` (`packageDev()` → katalog `ChromeBlock/`), budowane w katalogu tymczasowym. `dist/` i `download/` nie są ruszane.
- ZIP: tylko pliki rozszerzenia, ta sama metoda co paczka (`createZip`: deflate raw poziom 9, stała data), więc wynik jest powtarzalny. Uwaga: wcześniejsze liczby z `zip -9` (narzędzie systemowe) różnią się o kilkadziesiąt KB, bo to inna implementacja deflate.
- Kategorie są rozłączne (suma = cała paczka): `rules/`, `data/`, `scriptlets/`, JS rozszerzenia (`background*`, `shared/`, `content/`, `youtube/`), UI (`popup/`, `options/`, `welcome/`), ikony/zasoby/manifest. Dla każdej: bajty rozpakowane i po deflate.
- Hash SHA-256 zawartości paczki (ścieżki + treść): identyczny hash = identyczny produkt.

## 2. Startup – trzy różne metryki

**2A. Internal service-worker init** (najważniejsza dla kodu ChromeBlock)
Profiler z `background.js`: `performance.now()` w service workerze, czyli czas od `timeOrigin` workera, do `finishStartupProfile()`. Odczyt z `chrome.storage.session` przez `worker.evaluate` (bez otwierania stron). Scenariusz: świeża instalacja (`onInstalled: install`), czyli razem z pierwszą synchronizacją rulesetów, reguł dynamicznych i scriptletów. Raport pokazuje znaczniki (ms od startu SW) i etapy profilera.
- `syncRulesets`, `syncDynamicRules` i `syncScriptlets` startują równolegle (`Promise.allSettled`), więc ich czasy się nakładają i nie wolno ich sumować.
- Restart przeglądarki (`onStartup`) nie jest tu mierzalny: Chromium z `--load-extension` instaluje rozszerzenie od nowa przy każdym uruchomieniu.

**2B. Fresh install → extension ready** (zegar ścienny w Node)
Od wywołania `launchPersistentContext` do chwili, gdy profiler zapisał zakończony start (odpytywanie co 20 ms). Obejmuje start Chromium, załadowanie unpacked extension, instalację i Playwright. To nie jest czas samego workera.

**2C. Wybudzenie service workera** (eksperymentalne)
W MV3 Chrome usypia nieaktywny worker i budzi go przy zdarzeniu. Worker jest zatrzymywany przez CDP `ServiceWorker.stopAllWorkers` (sprawdzane: cel `service_worker` znika), potem mierzona jest pierwsza wiadomość ze strony rozszerzenia:
- `options:get`: wybudzenie, wczytanie modułu i prosty handler,
- `cosmetic:init` dla nowego hosta: jak pierwsza strona po uśpieniu (wczytanie danych kosmetycznych list),
- to samo przy działającym workerze (dla porównania).

Profiler nie kończy pomiaru przy wybudzeniu (nie ma `onInstalled` ani `onStartup`), dlatego ta metryka to zegar ścienny ze strony.

## 3. Metodologia czasu

- 1 run rozgrzewkowy (odrzucony), potem N mierzonych (domyślnie 15, baseline: 20).
- Każda świeża instalacja: osobny, nowy profil. Sieć zablokowana (`route` → 204), więc brak wpływu internetu.
- Raport: mediana, p95 (nearest-rank), min, max i n. Nie wyciągamy wniosków z pojedynczego runu.
- Wyniki zależą od maszyny. Porównuj tylko pomiary z tego samego środowiska (zapisane w raporcie i w `baseline.json`).

## 4. Runtime

Stan po świeżej instalacji w domyślnym trybie: włączone rulesety, aktywne reguły statyczne (reguły w plikach minus wyłączone przez `$badfilter`), `getAvailableStaticRuleCount`, reguły dynamiczne i sesyjne, zarejestrowane scriptlety (wpisy, pliki, bajty). Content scripty dla przykładowej zwykłej strony i YouTube liczone są z wzorców dopasowania (manifest i `getRegisteredContentScripts`, z `excludeMatches`).

RAM nie jest mierzony: Playwright/headless nie daje wiarygodnego pomiaru pamięci service workera.

## 5. Budżety

Twardych limitów czasu jeszcze nie ma; ustalimy je po kilku pomiarach. Deterministyczne strażniki (`npm test`):
- brak niechcianych plików w paczce (narzędzia, testy, raporty, ZIP-y, dokumentacja, `package.json`),
- brak nagłego przyrostu paczki: maks. +10% i maks. +2 MB względem `perf/baseline.json`. Zamierzona zmiana (np. aktualizacja list) wymaga świadomej aktualizacji baseline (`--write-baseline`).

## 6. Porównanie trybów (historyczne)

Do commita `0e3fe92` narzędzie miało opcję `--modes` (Basic / Balanced / Strict). Po przejściu na jeden stały zestaw list (ads, privacy, security) opcja została usunięta. Wyniki z tamtego pomiaru: rejestracja scriptletów Basic ~2,5 s, Balanced ~3,4 s, Strict ~3,8 s (szczegóły w historii PR #13).

## 7. Ocena każdej optymalizacji

Bajty dodane/usunięte (rozmiar i ZIP) · internal startup (2A) · wybudzenie/runtime (2C, 4) · skuteczność blokowania · ryzyko breakage. Krótszy kod sam w sobie nie jest optymalizacją.
