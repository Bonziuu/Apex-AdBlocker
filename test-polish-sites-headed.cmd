@echo off
rem ChromeBlock - test polskich stron w trybie GAP z WIDOCZNYM oknem przegladarki. Uruchom dwuklikiem.
rem Uruchamia: npm run test:polish-sites -- --gap-mode --headed
rem (przez test-polish-sites.cmd: te same sprawdzenia, raport i pause; kod wyjscia testera zachowany)
setlocal
call "%~dp0test-polish-sites.cmd" --headed %*
exit /b %ERRORLEVEL%
