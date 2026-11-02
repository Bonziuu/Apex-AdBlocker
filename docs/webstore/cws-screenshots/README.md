# Zrzuty do Chrome Web Store (1.0.0)

Pięć zrzutów PL i pięć EN, PNG RGB **1280×800**. Wygenerował je `store/cws-screenshots.mjs` z opublikowanej paczki
`Apex-AdBlocker-WebStore-1.0.0.zip` (SHA-256 `f58affb6dc6f3bbaa866ac5a81cf923ba106eb92e029b66da9b3980358589588`,
kod commitu `fa1045a`), a nie z bieżącego kodu repozytorium. Hashe obrazów, paczki i zaobserwowane wartości są w `metadata.json`.

| Plik | Funkcja | Rzeczywisty interfejs na zrzucie |
|---|---|---|
| `01-protection-<lang>.png` | Ochrona działa | okienko rozszerzenia nad stroną demo: ochrona aktywna, licznik zablokowanych żądań tej karty |
| `02-before-after-<lang>.png` | Przed / po | ta sama strona demo bez rozszerzenia i z rozszerzeniem |
| `03-hide-element-<lang>.png` | Ukryj element | narzędzie „Ukryj element” z zaznaczonym blokiem (bez zapisu filtra) |
| `04-site-toggle-<lang>.png` | Wyłączenie dla strony | okienko po wyłączeniu ochrony przełącznikiem na stronie demo |
| `05-custom-filters-<lang>.png` | Własne filtry | karta „Moje filtry” z przykładowymi filtrami zapisanymi przez interfejs |

Zestaw `pl/` ma polski interfejs i polskie teksty, `en/` — angielski. Kompozycja dodaje wyłącznie tło, logo, nagłówek
i najwyżej jedno zdanie; tekstów interfejsu rozszerzenia nie zmieniano.

## Jak powstają

```bash
node store/cws-screenshots.mjs --zip /ścieżka/Apex-AdBlocker-WebStore-1.0.0.zip
```

- ZIP o innym SHA-256 jest odrzucany. Rozpakowane pliki muszą odpowiadać liście w archiwum i przejść `validatePackage`.
- Każdy język ładuje osobną kopię paczki w pustym profilu Chromium Playwright. Kopia jest porównywana bajtowo przed
  i po uruchomieniu; dozwolone są tylko zindeksowane rulesety DNR (`_metadata/generated_indexed_rulesets/_rulesetN`).
  Po zakończeniu sprawdzany jest ponownie hash ZIP-a i stan rozpakowanej paczki.
- Okienko otwiera akcja rozszerzenia na karcie demo (CDP `Extensions.triggerAction`, jak kliknięcie ikony, z `activeTab`).
  Licznik musi być równy liczbie żądań strony demo zatrzymanych przez reguły; inaczej generator przerywa pracę.
- Strona `dailynews.example` i skrypty sieci reklamowych są podstawiane lokalnie przez Playwright, z neutralnymi reklamami
  bez marek, kwot i obietnic. Żadna zewnętrzna witryna nie jest odwiedzana, API Chrome nie jest podmieniane.
- Chromium pracuje w oknie (gęstość 2× dla ostrości), więc potrzebny jest ekran X: istniejący `DISPLAY` albo `Xvfb`,
  który generator uruchamia sam na czas pracy. Bez przeglądarki lub ekranu kończy się kodem 2 bez zastępczych obrazów.
- `APEX_CWS_RAW=katalog` dodatkowo zapisuje surowe przechwycenia do przeglądu.

Obrazy pokazują interfejs na kontrolowanej stronie demonstracyjnej. Nie są pomiarem skuteczności na prawdziwych witrynach.
Ten katalog nie zmienia `submission.json` ani materiałów w sklepie; wybór plików do wgrania należy do właściciela.
