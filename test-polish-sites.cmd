@echo off
rem ChromeBlock - test polskich stron w trybie GAP (Windows). Uruchom dwuklikiem.
rem Uruchamia: npm run test:polish-sites -- --gap-mode
rem GAP = tymczasowy build testowy BEZ Polskich Filtrow (MajkiIT / Certyficate IT).
rem Normalny ChromeBlock i pliki repozytorium nie sa zmieniane; katalog tymczasowy jest usuwany.
rem Profil przegladarki jest tymczasowy (bez historii, loginow i cookies).
rem Niczego nie instaluje automatycznie.
rem Dodatkowe opcje sa przekazywane dalej (np. --headed, domeny: onet.pl wp.pl).
rem Kod wyjscia jak tester: 0 test wykonany, 2 blad narzedzia / brak wymagan, 3 zadna strona nieosiagalna.
setlocal
chcp 65001 >nul
title ChromeBlock - test polskich stron (GAP mode)
set "RC=2"
cd /d "%~dp0"

echo.
echo ChromeBlock – test polskich stron (GAP mode)
echo ============================================================
echo Build testowy bez Polskich Filtrow; normalny ChromeBlock bez zmian.
if not "%~1"=="" echo Opcje: %*
echo.

if not exist "tools\polish-sites\test-polish-sites.mjs" (
  echo Nie znaleziono narzedzia tools\polish-sites\test-polish-sites.mjs.
  echo Uruchom ten plik z glownego katalogu repozytorium ChromeBlock.
  goto :end
)

where node >nul 2>nul
if errorlevel 1 (
  echo Brak Node.js. Zainstaluj Node.js 20 lub nowszy: https://nodejs.org
  echo a potem uruchom ten plik ponownie.
  goto :end
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Brak npm ^(instalowany razem z Node.js^). Zainstaluj ponownie Node.js 20+: https://nodejs.org
  goto :end
)

rem Playwright i Chromium: tylko sprawdzenie, bez instalacji.
node -e "import('./tools/chromium-smoke.mjs').then((m) => m.loadPlaywright()).then((c) => process.exit(require('fs').existsSync(c.executablePath()) ? 0 : 4), () => process.exit(3))"
set "DEP=%ERRORLEVEL%"
if "%DEP%"=="3" (
  echo Brak pakietu Playwright.
  echo W katalogu repozytorium uruchom raz:  npm install
  echo a potem ponownie ten plik.
  goto :end
)
if "%DEP%"=="4" (
  echo Brak przegladarki Chromium dla Playwright.
  echo W katalogu repozytorium uruchom raz:  npx playwright install chromium
  echo a potem ponownie ten plik.
  goto :end
)
if not "%DEP%"=="0" (
  echo Nie udalo sie sprawdzic Playwright ^(kod %DEP%^).
  goto :end
)

call npm run test:polish-sites -- --gap-mode %*
set "RC=%ERRORLEVEL%"

echo.
echo ============================================================
if "%RC%"=="0" echo   WYNIK: test wykonany. Obserwacje to NIE reguly - przejrzyj raport.
if "%RC%"=="2" echo   WYNIK: BLAD NARZEDZIA - test nie mogl sie wykonac ^(zobacz komunikaty powyzej^).
if "%RC%"=="3" echo   WYNIK: zadna strona nie byla osiagalna ^(brak internetu?^).
echo ============================================================
echo.
echo Raport:  tests\polish-sites\results\latest.txt
echo JSON:    tests\polish-sites\results\latest.json
echo Pelna sciezka: %CD%\tests\polish-sites\results\latest.txt

:end
echo.
pause
exit /b %RC%
