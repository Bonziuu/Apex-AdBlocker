@echo off
rem ChromeBlock - test GAP + evidence tylko dla jbzd.com.pl (Windows). Uruchom dwuklikiem.
rem Wywoluje istniejacy run-polish-test.cmd (sprawdzenie Node.js, w razie potrzeby npm install
rem i npx playwright install chromium) z argumentami:
rem   --evidence jbzd.com.pl
rem czyli: npm run test:polish-sites -- --gap-mode --evidence jbzd.com.pl
rem Tylko zebranie evidence - brak reguly ChromeBlock Polish dla tej domeny.
rem Raport: tests\polish-sites\results\latest.txt
rem Zrzuty: tests\polish-sites\results\evidence\
rem Kod wyjscia jak run-polish-test.cmd.
setlocal
call "%~dp0run-polish-test.cmd" --evidence jbzd.com.pl %*
exit /b %ERRORLEVEL%
