@echo off
rem ChromeBlock - porownanie trybow ochrony (Basic / Balanced / Strict) na ok. 50 prawdziwych stronach.
rem Uruchom dwuklikiem. To tylko skrot do: test-chromeblock.cmd --modes
rem Tymczasowe profile (bez Twojego profilu Chrome), raport HTML do recznej oceny.
rem Opcje dodatkowe przekazywane dalej, np.: --configs basic,strict  --limit 10  --only onet.pl,wp.pl
call "%~dp0test-chromeblock.cmd" --modes %*
exit /b %ERRORLEVEL%
