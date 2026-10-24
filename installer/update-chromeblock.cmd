@echo off
rem ChromeBlock - aktualizacja istniejacej instalacji (Windows).
rem Podmienia pliki w %LOCALAPPDATA%\ChromeBlock na nowa wersje. Katalog sie nie zmienia,
rem wiec Chrome zachowuje rozszerzenie i jego ustawienia. NIE zmienia polityk Chrome ani rejestru.
setlocal
chcp 65001 >nul
title ChromeBlock - aktualizacja

set "SRC=%~dp0ChromeBlock"
set "DEST=%LOCALAPPDATA%\ChromeBlock"

if not exist "%SRC%\manifest.json" (
  echo.
  echo Nie znaleziono folderu "ChromeBlock" obok tego pliku.
  echo Rozpakuj CALE nowe archiwum ChromeBlock-dev.zip i uruchom update-chromeblock.cmd z rozpakowanego folderu.
  echo.
  pause
  exit /b 1
)

if not exist "%DEST%\manifest.json" (
  echo.
  echo ChromeBlock nie jest jeszcze zainstalowany w %DEST%.
  echo Uruchom najpierw install-chromeblock.cmd.
  echo.
  pause
  exit /b 1
)

echo Aktualizowanie plikow w %DEST% ...
rem /MIR: dokladna kopia nowej wersji (usuwa pliki, ktorych nowa wersja juz nie ma)
robocopy "%SRC%" "%DEST%" /MIR /R:1 /W:1 /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 (
  echo.
  echo Nie udalo sie zaktualizowac plikow. Zamknij Chrome i sprobuj ponownie.
  echo.
  pause
  exit /b 1
)

set "CHROME="
for %%P in ("%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe") do (
  if not defined CHROME if exist "%%~P" set "CHROME=%%~P"
)
if defined CHROME start "" "%CHROME%" "chrome://extensions"

echo.
echo ============================================================
echo  Pliki ChromeBlock zostaly zaktualizowane.
echo.
echo  W Chrome, na stronie chrome://extensions:
echo    na karcie ChromeBlock kliknij ikone odswiezania (okragla strzalka).
echo  Ustawienia i Twoje filtry zostaja zachowane.
echo ============================================================
echo.
pause
