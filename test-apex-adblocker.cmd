@echo off
rem Apex AdBlocker - lokalny test regresyjny (Windows). Uruchom dwuklikiem w folderze repozytorium.
rem Wymaga Node.js 20+.
rem Startuje Playwright Chromium z Apex AdBlocker w TYMCZASOWYM profilu
rem (nie uzywa Twojego profilu Chrome, nie zapisuje historii, loginow ani cookies).
rem Opcje (z wiersza polecen): --headless  --no-youtube
rem Test stron (bez / z Apex AdBlocker, ok. 30-45 min): test-apex-adblocker.cmd --sites  (albo test-sites.cmd)
rem Kod wyjscia: 0 PASS, 1 FAIL, 2 blad uruchomienia, 3 INCONCLUSIVE.
setlocal
chcp 65001 >nul
title Apex AdBlocker - test lokalny
set "RC=2"
set "BASE=%~dp0"
set "RES=%BASE%tests\local\results"

cd /d "%BASE%"
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
set "SCRIPT=tests\local\chromeblock-local-test.mjs"
if /i "%~1"=="--sites" set "SCRIPT=tests\local\single-blocker-sites.mjs"
node %SCRIPT% --results "%RES%" %*
set "RC=%ERRORLEVEL%"
if /i "%~1"=="--sites" goto :sites

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
goto :end

:sites
echo.
echo ============================================================
if "%RC%"=="0" echo   Test stron zakonczony. Wynik automatyczny to tylko WSKAZOWKA.
if "%RC%"=="0" echo   Otworz raport i ocen strony recznie ^(zrzuty BEZ / Z Apex AdBlocker obok siebie^).
if not "%RC%"=="0" echo   WYNIK: BLAD URUCHOMIENIA - test stron nie mogl sie wykonac.
echo ============================================================
echo.
echo Raport:  %RES%\sites\latest.html
echo Tekst:   %RES%\sites\latest.txt

:end
echo.
pause
exit /b %RC%
