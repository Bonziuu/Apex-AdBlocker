@echo off
rem ChromeBlock - test GAP + evidence tylko dla onet.pl (Windows). Uruchom dwuklikiem.
rem Wywoluje istniejacy run-polish-test.cmd (sprawdzenie Node.js, w razie potrzeby npm install
rem i npx playwright install chromium) z argumentami:
rem   --evidence onet.pl
rem czyli: npm run test:polish-sites -- --gap-mode --evidence onet.pl
rem Dla elementow znikajacych z DOM tester robi zrzut zapasowy z zapamietanego prostokata.
rem Raport: tests\polish-sites\results\latest.txt
rem Zrzuty: tests\polish-sites\results\evidence\
rem Niczego nie zmienia w listach filtrow. Kod wyjscia jak run-polish-test.cmd.
setlocal
call "%~dp0run-polish-test.cmd" --evidence onet.pl %*
exit /b %ERRORLEVEL%
