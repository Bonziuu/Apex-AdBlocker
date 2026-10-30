# Lokalny tester Apex AdBlocker

**Windows:** dwuklik `test-apex-adblocker.cmd` w głównym folderze repozytorium.
**Inne systemy / terminal:** `npm run test:local` (opcje: `-- --headless`, `--no-youtube`, `--dir dist/Apex AdBlocker`, `--video <id>`, `--shorts <adres>`, `--no-consent`).

Pierwsze uruchomienie instaluje Playwright (`npm install`) i pobiera Chromium (`npx playwright install chromium`, ok. 150 MB).

Tester uruchamia Playwright Chromium z bieżącą wersją Apex AdBlocker w **tymczasowym profilu** (usuwanym po teście). Nie używa Twojego profilu Chrome i nie zapisuje historii, loginów, cookies ani danych konta. Na ekranie zgody YouTube w tym jednorazowym profilu klika „Odrzuć wszystko” (`--no-consent` wyłącza to; YouTube będzie wtedy SKIP).

Wyniki (poza gitem): `tests/local/results/latest.txt`, `latest.json` oraz `fail-*.png` (screenshot tylko przy FAIL).

| Wynik | Znaczenie |
| --- | --- |
| PASS | wszystkie testy przeszły |
| FAIL | co najmniej jeden test nie przeszedł (kod wyjścia 1) |
| INCONCLUSIVE | brak FAIL, ale część testów to SKIP (np. brak sieci, YouTube niedostępny, CAPTCHA) – to **nie** jest PASS |

Blokowanie reklam nie jest ogłaszane jako PASS bez dowodu: reklama widoczna ≥ 3 s → FAIL, dane reklam usunięte z odpowiedzi odtwarzacza → PASS, brak okazji reklamowej → SKIP (INCONCLUSIVE).

Tester nie uruchamia się w `npm test`.

## Diagnostyka A/B seek

Gdy test „YouTube: seek” albo „odtwarzanie po seek” kończy się FAIL, tester automatycznie powtarza ten sam film i ten sam seek w **świeżym tymczasowym profilu bez Apex AdBlocker** i porównuje oba przebiegi (before, cel seek, currentTime po seek, `.ytp-error`, `video.error.code`, cofnięcie pozycji, wznowienie, końcowy URL). Tabela trafia do `latest.txt`, a pełne dane do `latest.json` (`seekAB`).

| Werdykt | Znaczenie | Wynik testów seek |
| --- | --- | --- |
| CONTROL ALSO FAILS | kontrola odtwarza **wszystkie** twarde błędy z Apex AdBlocker – nie obwiniać rozszerzenia | SKIP (INCONCLUSIVE) |
| APEX-SPECIFIC FAIL | kontrola czysta (seek działa, odtwarzanie się wznawia, brak twardych błędów), z Apex AdBlocker nie | FAIL |
| INCONCLUSIVE | kontrola nie mogła się wykonać, odtwarza tylko część błędów albo ma inne błędy | FAIL seek zostaje, A/B = SKIP |

Twarde błędy seek: `no-jump`, `video-error`, `ytp-error` (trwały), `fell-back`. Brak wznowienia odtwarzania (`not-resumed`) sam w sobie nie jest twardym błędem.
