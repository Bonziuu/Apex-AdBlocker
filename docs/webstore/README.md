# Przygotowanie Apex AdBlocker do Chrome Web Store

Wydawca i autor: **Konrad Woźniak**. Publiczny kontakt: **konrad.wozniak.1996@gmail.com**. [Profil autora na LinkedIn](https://www.linkedin.com/in/konrad-woźniak-23a5b831a). Licencje są poza zakresem tego etapu.

Zakładasz konto wydawcy po raz pierwszy? Zacznij od [krótkiej checklisty zgłoszenia](SUBMISSION-CHECKLIST.pl.md): wskazuje właściwy ZIP, obrazy i teksty do panelu. Ten katalog zawiera materiały do zgłoszenia; nie stanowi potwierdzenia przyjęcia rozszerzenia do sklepu.

## Publikacja na GitHubie

Przygotowany kod, testy i materiały opublikowano na `main` w commicie [9249597](https://github.com/Bonziuu/Apex-AdBlocker/commit/92495979052cbe051318708ed0bd711252ac9540). Poprawiona [polityka prywatności](https://github.com/Bonziuu/Apex-AdBlocker/blob/main/PRIVACY.md) jest dostępna publicznie; jej treść sprawdzono po publikacji. Dokładny stan paczki i pozostałych warunków zgłoszenia opisuje [final-release-status.json](final-release-status.json). Publikacja w Chrome Web Store wymaga osobnego zgłoszenia z konta wydawcy.

## Gotowe materiały

- [Polski opis sklepu](listing-pl.md) i [opis angielski](listing-en.md). Interfejs aplikacji jest dostępny po polsku i po angielsku.
- [Cel aplikacji, uprawnienia i deklaracje prywatności](permissions-and-privacy.md).
- [Projekt polityki PL](privacy-policy-pl.md) i [EN](privacy-policy-en.md).
- Gotowe statyczne strony do umieszczenia na hostingu: [polityka PL](public/privacy.html) i [EN](public/privacy-en.html). Działają bez JavaScriptu, fontów zewnętrznych i analityki.
- [Grafika promocyjna 440×280](assets/promo-small-440x280.png), złożona z istniejącego znaku i nazwy marki. Nie jest zrzutem ani dowodem skuteczności.
- Ikona sklepu zgodna z manifestem: `icons/logo128.png` (128×128), także `brand/apex-store-icon-128.png`. `icons/icon128.png` jest innym wariantem znaku i nie jest ikoną 128 wskazaną w obecnym manifeście.
- [Generator prawdziwych zrzutów](screenshots.md) — trzy obrazy 1280×800 po uruchomieniu rzeczywistego rozszerzenia.

## Jeden automatyczny przebieg techniczny

```bash
npm ci
npm run webstore:prepare
```

Przebieg tworzy osobną paczkę w `dist/`, wykonuje rygorystyczny `check`, zapisuje faktyczne wyniki i hash ZIP-a, a po udanym smoke uruchamia generator zrzutów. Nie usuwa całej zawartości `dist/`. Wynik oddziela poprawność paczki od gotowości zgłoszenia. Nie publikuje ani nie wysyła rozszerzenia.

Wyniki:

- `validation-evidence.json` — rzeczywiste liczby testów, smoke i tożsamość ZIP-a;
- `readiness-report.json` — kontrole techniczne i pozostałe blokady;
- `dist/webstore-validation/check.log` — pełny zapis kontroli;
- `submission.json` — dane wydawcy i lokalizacje materiałów. URL polityki wskazuje opublikowany `PRIVACY.md` na GitHubie. Przed zgłoszeniem sprawdź, czy nadal odpowiada wysyłanej wersji.

Do wysłania wybierz plik `package.path` z najnowszego `readiness-report.json`; w tej paczce `manifest.json` znajduje się w katalogu głównym ZIP-a. Sama nazwa `Apex-AdBlocker-WebStore-1.0.0.zip` nie odróżnia wcześniejszej paczki od aktualnej — sprawdź też jej ścieżkę i hash. Po zmianie kodu przygotuj paczkę ponownie.

Kody wyjścia: **0** oznacza spełnienie sprawdzanych przesłanek, **1** błąd techniczny, **2** brakujące warunki zgłoszenia. Żaden z nich nie jest decyzją Chrome Web Store. Skrypt nie uznaje pominiętych testów za zaliczone i nie wytwarza zastępczych zrzutów.

Dodatkowe komendy:

```bash
npm run webstore:materials
npm run webstore:screenshots -- --dir dist/Apex-AdBlocker
npm run webstore:preflight
```

`webstore:materials` odtwarza strony HTML i grafikę marki. Do samej grafiki można wskazać lokalną przeglądarkę przez `APEX_ASSET_BROWSER`; nie umożliwia to uruchamiania rozszerzenia. `webstore:screenshots` wymaga Chromium Playwright i działającego rozszerzenia. Jeśli korzystasz z paczki utworzonej przez `webstore:prepare`, użyj ścieżki z jego raportu.

## Pozostałe kroki

1. Zapewnić dostęp do Chromium Playwright. Gdy pobieranie blokuje polityka środowiska, wymagane domeny to `cdn.playwright.dev`, `storage.googleapis.com`, `playwright.download.prss.microsoft.com`; dostęp trzeba potwierdzić w aktualnie zastosowanej konfiguracji.
2. Zainstalować przeglądarkę i ponowić automat:

   ```bash
   export PLAYWRIGHT_BROWSERS_PATH=/workspace/apex-cloud-setup/browsers
   npx --no-install playwright install chromium
   npm run webstore:prepare
   ```

3. Wykonać reprezentatywne testy prawdziwych stron przy odpowiednio skonfigurowanym dostępie sieciowym. Istniejące narzędzia: `npm run test:sites` i `npm run test:e2e`. Dłuższe próbkowanie YouTube opisano w `../manual-youtube-test.md`. Kontrole powinny obejmować normalne funkcje strony, wyłączenia i ramki. Wynik niejednoznaczny nie jest dowodem zablokowania reklamy. Automat nie dopisuje samodzielnie PASS dla niewykonanych testów zewnętrznych.
4. Sprawdzić aktualność opublikowanej polityki `PRIVACY.md` pod publicznym adresem GitHuba. Po późniejszych zmianach działania aplikacji zaktualizować także politykę. Alternatywnie można opublikować pliki z `public/` na hostingu HTTPS bez logowania i zaktualizować `submission.json`. Lokalne wygenerowanie HTML nie aktywuje hostingu.
5. Obejrzeć prawdziwe zrzuty, zalogować się do konta deweloperskiego, uzupełnić deklaracje według aktualnych pól panelu i dopiero wtedy wysłać właściwy ZIP do oceny. Dane konta i weryfikację wykonuje właściciel konta.

## Informacja od autora a wyniki testów

Autor zgłosił, że po kilku dniach używania aplikacja „działa bardzo dobrze”. To cenna informacja z codziennego używania. Nie towarzyszy jej identyfikacja ZIP-a, zestaw stron i przypadków testowych ani log wyników, dlatego nie jest zapisywana jako maszynowy wynik `PASS`. Aktualne dowody konkretnej paczki znajdują się w raportach wymienionych wyżej; pominięte testy i brak aktualnych przechwyceń UI pozostają jawne.

## Źródła wymiarów i procesu

Punkty odniesienia Google: [materiały graficzne](https://developer.chrome.com/docs/webstore/images/) i [publikowanie](https://developer.chrome.com/docs/webstore/publish/). Odczytano także ich źródła w oficjalnym repozytorium `GoogleChrome/developer.chrome.com`: dokument obrazów z datą aktualizacji 2021-08-13 oraz publikowania z datą 2023-10-05. Te starsze źródła opisują ikonę 128×128, małą grafikę 440×280 i zrzuty 1280×800 albo 640×400. Nie są potwierdzeniem aktualności całego regulaminu ani interfejsu panelu w 2026 roku; ostateczne pola należy sprawdzić przy zgłoszeniu.
