@echo off
rem ChromeBlock - test polskich stron (GAP mode): PIERWSZE URUCHOMIENIE na Windows. Uruchom dwuklikiem.
rem 1. sprawdza Node.js i npm (NIE instaluje Node.js - trzeba go miec: https://nodejs.org),
rem 2. gdy brakuje Playwright (node_modules) - automatycznie: npm install,
rem 3. gdy brakuje Chromium dla Playwright - automatycznie: npx playwright install chromium,
rem 4. uruchamia test-polish-sites.cmd (GAP mode; raport tests\polish-sites\results\latest.txt).
rem Dodatkowe opcje sa przekazywane dalej (np. --headed).
rem Kod wyjscia: kod testera; przy bledzie przygotowania - kod npm / npx albo 2.
setlocal
chcp 65001 >nul
title ChromeBlock - przygotowanie testu polskich stron
set "RC=2"
cd /d "%~dp0"

echo.
echo ChromeBlock – test polskich stron (GAP mode): przygotowanie
echo ============================================================

if not exist "test-polish-sites.cmd" (
  echo Nie znaleziono test-polish-sites.cmd obok tego pliku.
  echo Rozpakuj CALE archiwum repozytorium i uruchom run-polish-test.cmd z rozpakowanego folderu.
  goto :end
)
if not exist "tools\polish-sites\test-polish-sites.mjs" (
  echo Nie znaleziono narzedzia tools\polish-sites\test-polish-sites.mjs.
  echo Rozpakuj CALE archiwum repozytorium i uruchom run-polish-test.cmd z rozpakowanego folderu.
  goto :end
)

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Brak Node.js. Zainstaluj Node.js 20 lub nowszy ze strony https://nodejs.org
  echo ^(wersja LTS, instalator dla Windows^), a potem uruchom ten plik ponownie.
  goto :end
)
where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo Brak npm ^(instalowany razem z Node.js^). Zainstaluj ponownie Node.js 20+ ze strony https://nodejs.org
  goto :end
)

if exist "node_modules\playwright\package.json" goto :chromium
echo.
echo [1/2] Instaluje zaleznosci ^(npm install, jednorazowo, wymaga internetu^)...
call npm install --no-audit --no-fund
set "RC=%ERRORLEVEL%"
if not "%RC%"=="0" (
  echo.
  echo Nie udalo sie zainstalowac zaleznosci ^(npm install, kod %RC%^).
  echo Sprawdz polaczenie z internetem i uruchom ten plik ponownie.
  goto :end
)
if not exist "node_modules\playwright\package.json" (
  set "RC=2"
  echo.
  echo Po npm install nadal brakuje pakietu Playwright ^(node_modules\playwright^).
  goto :end
)

:chromium
rem 0 = Chromium jest; 4 = brak Chromium; 3 = brak Playwright
node -e "import('./tools/chromium-smoke.mjs').then((m) => m.loadPlaywright()).then((c) => process.exit(require('fs').existsSync(c.executablePath()) ? 0 : 4), () => process.exit(3))"
set "DEP=%ERRORLEVEL%"
if "%DEP%"=="0" goto :run
if not "%DEP%"=="4" (
  set "RC=2"
  echo.
  echo Nie udalo sie zaladowac Playwright ^(kod %DEP%^). Usun folder node_modules i uruchom ten plik ponownie.
  goto :end
)
echo.
echo [2/2] Pobieram przegladarke testowa Chromium ^(npx playwright install chromium, jednorazowo, ok. 150 MB^)...
call npx playwright install chromium
set "RC=%ERRORLEVEL%"
if not "%RC%"=="0" (
  echo.
  echo Nie udalo sie pobrac Chromium ^(npx playwright install chromium, kod %RC%^).
  echo Sprawdz polaczenie z internetem i uruchom ten plik ponownie.
  goto :end
)
node -e "import('./tools/chromium-smoke.mjs').then((m) => m.loadPlaywright()).then((c) => process.exit(require('fs').existsSync(c.executablePath()) ? 0 : 4), () => process.exit(3))"
if errorlevel 1 (
  set "RC=2"
  echo.
  echo Po instalacji nadal brakuje Chromium dla Playwright.
  goto :end
)

:run
echo.
echo Gotowe. Uruchamiam test-polish-sites.cmd...
rem test-polish-sites.cmd sam pokazuje wynik, sciezke raportu i czeka na klawisz (pause)
call "%~dp0test-polish-sites.cmd" %*
exit /b %ERRORLEVEL%

:end
echo.
pause
exit /b %RC%
