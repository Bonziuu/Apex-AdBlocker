@echo off
rem ChromeBlock - aktualizacja repozytorium + evidence dla partii 3B ChromeBlock Polish (Windows). Uruchom dwuklikiem.
rem 1. update-only.cmd --no-pause: bezpieczna aktualizacja (git fetch + git pull --ff-only,
rem    bez force, reset --hard i stash; odmowa przy lokalnych zmianach lub innym branchu),
rem 2. run-polish-test.cmd --evidence newsweek.pl radiozet.pl spidersweb.pl epoznan.pl strefainwestorow.pl (GAP + evidence)
rem    Tylko zebranie evidence - bez nowych regul.
rem    (przygotowanie Node/npm/Playwright robi run-polish-test.cmd).
rem Kod wyjscia: kod testu; przy bledzie aktualizacji - kod update-only.cmd (test nie startuje).
setlocal
chcp 65001 >nul
title ChromeBlock - aktualizacja i evidence partii 3B
set "RC=0"
cd /d "%~dp0"

set "OLDHEAD="
for /f "delims=" %%h in ('git rev-parse HEAD 2^>nul') do set "OLDHEAD=%%h"
call "%~dp0update-only.cmd" --no-pause
set "UPD=%ERRORLEVEL%"
if not "%UPD%"=="0" (
  set "RC=%UPD%"
  echo.
  echo Aktualizacja nie powiodla sie ^(kod %UPD%^) - test NIE zostal uruchomiony.
  goto :end
)
set "NEWHEAD="
for /f "delims=" %%h in ('git rev-parse HEAD') do set "NEWHEAD=%%h"
set "UPDATED=nie ^(bylo aktualne^)"
if not "%OLDHEAD%"=="%NEWHEAD%" set "UPDATED=tak ^(%OLDHEAD% -^> %NEWHEAD%^)"

echo.
echo Uruchamiam evidence partii 3B: run-polish-test.cmd --evidence newsweek.pl radiozet.pl spidersweb.pl epoznan.pl strefainwestorow.pl
rem wejscie z nul: wewnetrzne pause testu nie zatrzymuja – jedno pause na koncu tego pliku
call "%~dp0run-polish-test.cmd" --evidence newsweek.pl radiozet.pl spidersweb.pl epoznan.pl strefainwestorow.pl < nul
set "RC=%ERRORLEVEL%"

echo.
echo ============================================================
echo   HEAD:           %NEWHEAD%
echo   Zaktualizowano: %UPDATED%
echo   Kod wyjscia testu: %RC%
echo   Raport:  %CD%\tests\polish-sites\results\latest.txt
echo   Zrzuty:  %CD%\tests\polish-sites\results\evidence\
echo ============================================================

:end
echo.
pause
exit /b %RC%
