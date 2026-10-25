@echo off
rem ChromeBlock - retest partii 1 ChromeBlock Polish Supplement (Windows). Uruchom dwuklikiem.
rem Wywoluje istniejacy run-polish-test.cmd (sprawdzenie Node.js, w razie potrzeby npm install
rem i npx playwright install chromium) z argumentami:
rem   --evidence bankier.pl businessinsider.com.pl gazeta.pl
rem czyli: npm run test:polish-sites -- --gap-mode --evidence bankier.pl businessinsider.com.pl gazeta.pl
rem Raport: tests\polish-sites\results\latest.txt
rem Zrzuty: tests\polish-sites\results\evidence\
rem Niczego nie zmienia w listach filtrow. Kod wyjscia jak run-polish-test.cmd.
setlocal
call "%~dp0run-polish-test.cmd" --evidence bankier.pl businessinsider.com.pl gazeta.pl %*
exit /b %ERRORLEVEL%
