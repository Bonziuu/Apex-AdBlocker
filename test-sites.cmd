@echo off
rem Apex AdBlocker - test JEDNEGO blockera na prawdziwych stronach (Windows). Uruchom dwuklikiem.
rem Porownuje kazda strone BEZ Apex AdBlocker i Z Apex AdBlocker (tymczasowe profile, bez Twoich danych).
rem Raport: zrzuty obok siebie + reczna ocena (sites\latest.html). Trwa ok. 30-45 min.
rem Opcje: --limit N  --only onet.pl,wp.pl  --no-youtube  --no-screenshots  --headless
rem Uzywa starego aliasu tylko dla zgodnosci z historycznym toolingiem testowym.
call "%~dp0test-chromeblock.cmd" --sites %*
