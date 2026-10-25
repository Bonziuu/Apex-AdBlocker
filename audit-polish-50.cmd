@echo off
rem ChromeBlock - audyt pokrycia 50 polskich stron (Windows). Uruchom dwuklikiem.
rem Wywoluje istniejacy run-polish-test.cmd (sprawdzenie Node.js, w razie potrzeby npm install
rem i npx playwright install chromium) z argumentami:
rem   --evidence --audit-50
rem czyli: npm run test:polish-sites -- --gap-mode --evidence --audit-50
rem Zestaw domen: tools\polish-sites\sites-audit-50.json. Tymczasowy build GAP (bez Polskich Filtrow).
rem Nie generuje regul. Czas: zwykle kilkadziesiat minut.
rem Raport: tests\polish-sites\results\latest.txt (na koncu podsumowanie)
rem Zrzuty: tests\polish-sites\results\evidence\
rem Kod wyjscia jak run-polish-test.cmd.
setlocal
call "%~dp0run-polish-test.cmd" --evidence --audit-50 %*
exit /b %ERRORLEVEL%
