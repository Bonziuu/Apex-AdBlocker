@echo off
rem ChromeBlock - instalator developerski (Windows).
rem Kopiuje rozszerzenie do %LOCALAPPDATA%\ChromeBlock, otwiera chrome://extensions
rem i kopiuje sciezke do schowka. NIE zmienia polityk Chrome ani rejestru i NIE instaluje
rem rozszerzenia samodzielnie - wlaczasz je sam w Chrome (Tryb dewelopera -> Zaladuj rozpakowane).
setlocal
chcp 65001 >nul
title ChromeBlock - instalacja

set "SRC=%~dp0ChromeBlock"
set "DEST=%LOCALAPPDATA%\ChromeBlock"

if not exist "%SRC%\manifest.json" (
  echo.
  echo Nie znaleziono folderu "ChromeBlock" obok tego pliku.
  echo Najpierw rozpakuj CALE archiwum ChromeBlock-dev.zip ^(prawy przycisk - Wyodrebnij wszystkie^),
  echo a potem uruchom install-chromeblock.cmd z rozpakowanego folderu.
  echo.
  pause
  exit /b 1
)

if exist "%DEST%\manifest.json" (
  echo.
  echo ChromeBlock jest juz zainstalowany w:
  echo   %DEST%
  echo.
  echo Aby wgrac nowa wersje, uruchom update-chromeblock.cmd.
  echo.
  pause
  exit /b 0
)

echo Kopiowanie ChromeBlock do %DEST% ...
robocopy "%SRC%" "%DEST%" /E /R:1 /W:1 /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 (
  echo.
  echo Nie udalo sie skopiowac plikow do %DEST%.
  echo.
  pause
  exit /b 1
)

rem sciezka do schowka (bez znaku nowej linii)
<nul set /p "=%DEST%" | clip

rem otworz strone rozszerzen w Chrome (adresu chrome:// nie da sie otworzyc przez domyslna przegladarke)
set "CHROME="
for %%P in ("%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe") do (
  if not defined CHROME if exist "%%~P" set "CHROME=%%~P"
)
if defined CHROME (
  start "" "%CHROME%" "chrome://extensions"
) else (
  echo Nie znaleziono Chrome - otworz go recznie i wpisz w pasku adresu: chrome://extensions
)

echo.
echo ============================================================
echo  ChromeBlock skopiowany do:
echo    %DEST%
echo  Sciezka jest juz w schowku.
echo.
echo  W Chrome, na stronie chrome://extensions:
echo    1. Wlacz "Tryb dewelopera" (przelacznik w prawym gornym rogu)
echo    2. Kliknij "Załaduj rozpakowane" ("Load unpacked")
echo    3. Wklej skopiowana sciezke (Ctrl+V) i kliknij "Wybierz folder"
echo ============================================================
echo.
pause
