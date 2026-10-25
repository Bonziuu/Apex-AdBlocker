@echo off
rem ChromeBlock - zbieranie evidence dla partii 2 ChromeBlock Polish Supplement (Windows). Uruchom dwuklikiem.
rem Wywoluje istniejacy run-polish-test.cmd (sprawdzenie Node.js, w razie potrzeby npm install
rem i npx playwright install chromium) z argumentami:
rem   --evidence wykop.pl wp.pl o2.pl onet.pl interia.pl se.pl jbzd.com.pl
rem czyli: npm run test:polish-sites -- --gap-mode --evidence wykop.pl wp.pl o2.pl onet.pl interia.pl se.pl jbzd.com.pl
rem jbzd.com.pl: tylko zebranie evidence (brak reguly ChromeBlock Polish dla tej domeny).
rem Raport: tests\polish-sites\results\latest.txt
rem Zrzuty: tests\polish-sites\results\evidence\
rem Niczego nie zmienia w listach filtrow. Kod wyjscia jak run-polish-test.cmd.
setlocal
call "%~dp0run-polish-test.cmd" --evidence wykop.pl wp.pl o2.pl onet.pl interia.pl se.pl jbzd.com.pl %*
exit /b %ERRORLEVEL%
