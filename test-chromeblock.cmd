@echo off
rem ChromeBlock - lokalny test regresyjny (Windows). Uruchom dwuklikiem.
rem Dziala z rozpakowanej paczki ChromeBlock-dev.zip (foldery ChromeBlock i tester obok)
rem albo z repozytorium. Wymaga tylko Node.js 20+ (bez Gita).
rem Startuje Playwright Chromium z ChromeBlock w TYMCZASOWYM profilu
rem (nie uzywa Twojego profilu Chrome, nie zapisuje historii, loginow ani cookies).
rem Opcje (z wiersza polecen): --headless  --no-youtube
rem Kod wyjscia: 0 PASS, 1 FAIL, 2 blad uruchomienia, 3 INCONCLUSIVE.
setlocal
chcp 65001 >nul
title ChromeBlock - test lokalny
set "RC=2"
set "BASE=%~dp0"

if exist "%BASE%tester\tests\local\chromeblock-local-test.mjs" goto :package
rem --- repozytorium ---
set "PKG=0"
set "TDIR=%BASE%."
set "RES=%BASE%tests\local\results"
goto :prepare

:package
set "PKG=1"
set "TDIR=%BASE%tester"
set "RES=%BASE%wyniki-testu"
if not exist "%BASE%ChromeBlock\manifest.json" (
  echo.
  echo Nie znaleziono folderu "ChromeBlock" obok tego pliku.
  echo Rozpakuj CALE archiwum ChromeBlock-dev.zip i uruchom test-chromeblock.cmd z rozpakowanego folderu.
  goto :end
)

:prepare
cd /d "%TDIR%"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Brak Node.js. Zainstaluj Node.js 20 lub nowszy: https://nodejs.org
  echo a potem uruchom ten plik ponownie.
  goto :end
)

if not exist "node_modules\playwright\package.json" (
  echo Pierwsze uruchomienie: instaluje Playwright ^(jednorazowo^)...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo Nie udalo sie zainstalowac Playwright ^(npm install^). Sprawdz polaczenie z internetem.
    goto :end
  )
)

echo Sprawdzam przegladarke testowa Chromium ^(pierwsze pobranie ok. 150 MB^)...
call npx playwright install chromium
if errorlevel 1 (
  echo.
  echo Nie udalo sie pobrac Chromium dla Playwright ^(npx playwright install chromium^).
  goto :end
)

echo.
if "%PKG%"=="1" (
  node tests\local\chromeblock-local-test.mjs --dir "%BASE%ChromeBlock" --results "%RES%" %*
) else (
  node tests\local\chromeblock-local-test.mjs --results "%RES%" %*
)
set "RC=%ERRORLEVEL%"

echo.
echo ============================================================
if "%RC%"=="0" echo   WYNIK: PASS - wszystkie testy przeszly.
if "%RC%"=="1" echo   WYNIK: FAIL - co najmniej jeden test nie przeszedl ^(zobacz raport i fail-*.png^).
if "%RC%"=="2" echo   WYNIK: BLAD URUCHOMIENIA - test nie mogl sie wykonac ^(zobacz raport^).
if "%RC%"=="3" echo   WYNIK: INCONCLUSIVE - brak bledow, ale czesci nie dalo sie sprawdzic ^(np. brak sieci, YouTube^). To NIE jest PASS.
echo ============================================================
echo.
echo Raport:  %RES%\latest.txt
echo JSON:    %RES%\latest.json

:end
echo.
pause
exit /b %RC%
