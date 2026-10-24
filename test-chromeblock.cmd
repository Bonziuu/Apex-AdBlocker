@echo off
rem ChromeBlock - lokalny test regresyjny (Windows). Uruchom dwuklikiem.
rem Startuje Playwright Chromium z biezaca wersja ChromeBlock w TYMCZASOWYM profilu
rem (nie uzywa Twojego profilu Chrome, nie zapisuje historii, loginow ani cookies)
rem i zapisuje wynik w tests\local\results\latest.txt oraz latest.json.
rem Opcje (z wiersza polecen): --headless  --no-youtube  --dir dist\ChromeBlock
setlocal
chcp 65001 >nul
title ChromeBlock - test lokalny
cd /d "%~dp0"
set "RC=2"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Brak Node.js. Zainstaluj Node.js 20 lub nowszy: https://nodejs.org
  echo a potem uruchom ten plik ponownie.
  goto :end
)

if not exist "node_modules\playwright\package.json" (
  echo Pierwsze uruchomienie: instaluje Playwright w folderze projektu ^(jednorazowo^)...
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
node tests\local\chromeblock-local-test.mjs %*
set "RC=%ERRORLEVEL%"

echo.
if "%RC%"=="0" echo Test zakonczony: PASS lub INCONCLUSIVE ^(szczegoly w raporcie^).
if "%RC%"=="1" echo Test zakonczony: FAIL - zobacz raport i screenshoty fail-*.png.
if "%RC%"=="2" echo Test nie mogl sie uruchomic - zobacz raport.
echo.
echo Raport:  %~dp0tests\local\results\latest.txt
echo JSON:    %~dp0tests\local\results\latest.json

:end
echo.
pause
exit /b %RC%
