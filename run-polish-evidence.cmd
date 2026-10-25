@echo off
rem ChromeBlock - dowody do ChromeBlock Polish Supplement (Windows). Uruchom dwuklikiem.
rem Uruchamia (przez run-polish-test.cmd: sprawdzenie Node.js, w razie potrzeby npm install
rem i npx playwright install chromium) test GAP + evidence dla 9 stron:
rem   npm run test:polish-sites -- --gap-mode --evidence onet.pl wp.pl interia.pl o2.pl gazeta.pl wykop.pl businessinsider.com.pl se.pl bankier.pl
rem Zrzuty ekranu obserwacji: tests\polish-sites\results\evidence\ (bez HTML stron i cookies).
rem Profil przegladarki tymczasowy. Niczego nie dodaje do list filtrow. Kod wyjscia jak run-polish-test.cmd.
setlocal
call "%~dp0run-polish-test.cmd" --evidence onet.pl wp.pl interia.pl o2.pl gazeta.pl wykop.pl businessinsider.com.pl se.pl bankier.pl %*
exit /b %ERRORLEVEL%
