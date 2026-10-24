# Lokalny tester ChromeBlock

**Windows:** dwuklik `test-chromeblock.cmd` w głównym folderze repozytorium.
**Inne systemy / terminal:** `npm run test:local` (opcje: `-- --headless`, `--no-youtube`, `--dir dist/ChromeBlock`, `--video <id>`, `--shorts <adres>`, `--no-consent`).

Pierwsze uruchomienie instaluje Playwright (`npm install`) i pobiera Chromium (`npx playwright install chromium`, ok. 150 MB).

Tester uruchamia Playwright Chromium z bieżącą wersją ChromeBlock w **tymczasowym profilu** (usuwanym po teście). Nie używa Twojego profilu Chrome i nie zapisuje historii, loginów, cookies ani danych konta. Na ekranie zgody YouTube w tym jednorazowym profilu klika „Odrzuć wszystko” (`--no-consent` wyłącza to; YouTube będzie wtedy SKIP).

Wyniki (poza gitem): `tests/local/results/latest.txt`, `latest.json` oraz `fail-*.png` (screenshot tylko przy FAIL).

| Wynik | Znaczenie |
| --- | --- |
| PASS | wszystkie testy przeszły |
| FAIL | co najmniej jeden test nie przeszedł (kod wyjścia 1) |
| INCONCLUSIVE | brak FAIL, ale część testów to SKIP (np. brak sieci, YouTube niedostępny, CAPTCHA) – to **nie** jest PASS |

Blokowanie reklam nie jest ogłaszane jako PASS bez dowodu: reklama widoczna ≥ 3 s → FAIL, dane reklam usunięte z odpowiedzi odtwarzacza → PASS, brak okazji reklamowej → SKIP (INCONCLUSIVE).

Tester nie uruchamia się w `npm test`.
