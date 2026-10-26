@echo off
rem ChromeBlock - test JEDNEGO blockera na prawdziwych stronach (Windows). Uruchom dwuklikiem.
rem Porownuje kazda strone BEZ ChromeBlock i Z ChromeBlock (tymczasowe profile, bez Twoich danych).
rem Raport: zrzuty obok siebie + reczna ocena (sites\latest.html). Trwa ok. 30-45 min.
rem Opcje: --limit N  --only onet.pl,wp.pl  --no-youtube  --no-screenshots  --headless
call "%~dp0test-chromeblock.cmd" --sites %*
