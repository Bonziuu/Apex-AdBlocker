@echo off
rem ChromeBlock - bezpieczna aktualizacja repozytorium (Windows). Uruchom dwuklikiem.
rem Tylko dla repozytorium sklonowanego przez Git, na branchu chromeblock-polish-foundation.
rem Kroki: sprawdzenie git, repo, brancha i lokalnych zmian; git fetch origin;
rem git pull --ff-only origin chromeblock-polish-foundation; pokazanie HEAD.
rem NIGDY: force, reset --hard, stash, przelaczanie branchy ani kasowanie zmian.
rem Opcja --no-pause: bez pause na koncu (uzywane przez update-and-test-polish.cmd).
rem Kod wyjscia: 0 OK, 1 brak git, 2 poza repozytorium, 3 inny branch, 4 lokalne zmiany,
rem              5 blad git fetch, 6 blad git pull --ff-only.
setlocal
chcp 65001 >nul
set "BRANCH=chromeblock-polish-foundation"
set "RC=0"
cd /d "%~dp0"

echo.
echo ChromeBlock – aktualizacja repozytorium ^(%BRANCH%^)
echo ============================================================

where git >nul 2>nul
if errorlevel 1 (
  set "RC=1"
  echo Brak programu git. Zainstaluj Git for Windows: https://git-scm.com/download/win
  goto :end
)

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  set "RC=2"
  echo Ten folder nie jest repozytorium Git.
  echo Sklonuj repozytorium: git clone -b %BRANCH% https://github.com/Bonziuu/Chromeblock.git
  goto :end
)

set "CUR="
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "CUR=%%b"
if not "%CUR%"=="%BRANCH%" (
  set "RC=3"
  echo Aktualny branch to "%CUR%", a wymagany jest "%BRANCH%".
  echo Nic nie zmieniono. Przelacz branch recznie: git switch %BRANCH%
  goto :end
)

set "DIRTY="
for /f "delims=" %%l in ('git status --porcelain') do set "DIRTY=1"
if defined DIRTY (
  set "RC=4"
  echo W repozytorium sa lokalne, niezacommitowane zmiany:
  git status --short
  echo.
  echo Aktualizacja NIE zostala wykonana. Najpierw zachowaj ^(commit^) albo usun te zmiany,
  echo a potem uruchom ten plik ponownie. Nic nie zostalo skasowane.
  goto :end
)

for /f "delims=" %%h in ('git rev-parse HEAD') do set "OLDHEAD=%%h"
echo Pobieram zmiany: git fetch origin
git fetch origin
if errorlevel 1 (
  set "RC=5"
  echo Nie udalo sie wykonac git fetch origin. Sprawdz internet i dostep do GitHub.
  goto :end
)
echo Aktualizuje: git pull --ff-only origin %BRANCH%
git pull --ff-only origin %BRANCH%
if errorlevel 1 (
  set "RC=6"
  echo Nie udalo sie zaktualizowac bez scalania ^(git pull --ff-only^).
  echo Lokalna historia rozni sie od GitHub - nic nie zostalo nadpisane.
  goto :end
)
for /f "delims=" %%h in ('git rev-parse HEAD') do set "NEWHEAD=%%h"
echo.
echo HEAD: %NEWHEAD%
if "%OLDHEAD%"=="%NEWHEAD%" (echo Repozytorium bylo juz aktualne.) else (echo Zaktualizowano: %OLDHEAD% -^> %NEWHEAD%)

:end
echo.
if /i not "%~1"=="--no-pause" pause
exit /b %RC%
