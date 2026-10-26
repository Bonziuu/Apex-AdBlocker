# Test trybów ochrony na prawdziwych stronach

Porównanie Basic / Balanced / Strict na około 50 stronach. Wymaga internetu, dlatego uruchamia się lokalnie (Windows/Chrome); środowisko Claude Code nie ma dostępu do stron.

## Uruchomienie

- **Windows, dwuklik:** `test-protection-modes.cmd` (skrót do `test-chromeblock.cmd --modes`). Przygotowanie Node, Playwright i Chromium jest takie samo jak w `test-chromeblock.cmd`.
- **Repozytorium:** `npm run test:local -- --modes`

Domyślnie 4 konfiguracje: **bez rozszerzenia** (kontrola), Basic, Balanced, Strict. Każda w osobnym, jednorazowym profilu (bez Twojego profilu Chrome). Czas: około 15 s na stronę na konfigurację, łącznie 45–60 min.

Opcje (dopisz w wierszu polecenia po nazwie pliku `.cmd`):

| Opcja | Działanie |
|---|---|
| `--configs basic,strict` | tylko wybrane konfiguracje (`none`, `basic`, `balanced`, `strict`) |
| `--limit 10` | tylko 10 pierwszych stron |
| `--only onet.pl,wp.pl` | tylko wybrane strony |
| `--no-youtube` | bez testu YouTube |
| `--no-screenshots` | bez zrzutów ekranu |

Lista stron: `tests/local/sites-protection-modes.json` (kategorie: portale, finanse, sport, technologie, video, sklepy, fora, rozrywka z ciężkimi reklamami, regionalne, zagraniczne). YouTube ma osobny test.

## Co jest sprawdzane automatycznie

Dla każdej strony i konfiguracji:
- czy strona się ładuje i ile ma treści; czy jest główna treść (`main`/`article`);
- błędy JS strony; nieudane żądania i żądania zablokowane przez rozszerzenie (`net::ERR_BLOCKED_BY_CLIENT`);
- widoczne elementy o typowych selektorach reklamowych, ramki z hostów reklamowych, etykiety „Reklama/Sponsorowane” (bez stopki i menu), puste sloty z etykietą;
- duże nakładki: zgoda na cookies, anti-adblock, inne; zablokowane przewijanie;
- menu (linki w `nav`/`header`), otwarcie jednego linku z menu, wpisanie tekstu w wyszukiwarkę (bez wysyłania), obecność wejścia do logowania;
- rozjechany układ (poziome przewijanie).

YouTube, osobno w każdej konfiguracji: czy odtwarzacz startuje (postęp ≥ 3 s), błąd playera, widoczna reklama w playerze, komunikat anti-adblock, a z rozszerzeniem także status YouTube Protection i bramka zgodności (np. 30/30).

## Jak czytać wyniki

Automat porównuje każdy tryb z przebiegiem **bez rozszerzenia** i daje tylko **podejrzenie**: `OK (automatycznie)`, `reklama?`, `breakage?`, `anti-adblock?`, `wymaga ręcznego sprawdzenia`. Nigdy nie ogłasza „PASS”. Automatyczne OK nie znaczy, że strona jest w 100% poprawna.

Ostateczna ocena jest ręczna, w `latest.html`: przy każdej stronie i trybie wybierasz PASS / reklama pozostała / breakage / anti-adblock / wymaga ręcznego sprawdzenia. Do pomocy są zrzuty ekranu i fakty z automatu. Oceny zapisują się w przeglądarce, a przycisk „Eksportuj oceny” zapisuje plik JSON, który można mi przesłać.

Wyniki (`latest.html`, `latest.txt`, `latest.json`, `shots/`) są w `tests/local/results/modes/` w repozytorium albo w `wyniki-testu/modes/` w paczce. Nie są commitowane.

Ważne: lista „Reklamy” jest taka sama we wszystkich trybach. Tryby różnią się listą `cookies` (Balanced, Strict) i `annoyances` (Strict), więc różnice powinny dotyczyć głównie nakładek cookies, elementów irytujących i ryzyka breakage, a nie samych reklam.
