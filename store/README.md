# Apex AdBlocker — materiały do Chrome Web Store

Wydawca: **Konrad Woźniak** · kontakt: **konrad.wozniak.1996@gmail.com** · [LinkedIn autora](https://www.linkedin.com/in/konrad-woźniak-23a5b831a).

Zacznij od [checklisty zgłoszenia](../docs/webstore/SUBMISSION-CHECKLIST.pl.md). Folder `store/` zawiera także zachowane grafiki marketingowe i narzędzia ich przygotowania; nie trafia do ZIP-a rozszerzenia.

## Teksty i pola panelu

| Materiał | Plik lub adres |
|---|---|
| Nazwa, opis krótki i pełny PL | [listing-pl.md](../docs/webstore/listing-pl.md) |
| Nazwa, opis krótki i pełny EN | [listing-en.md](../docs/webstore/listing-en.md) |
| Jedno przeznaczenie, uprawnienia, kod zdalny i użycie danych | [permissions-and-privacy.md](../docs/webstore/permissions-and-privacy.md) |
| Publiczny URL polityki | https://github.com/Bonziuu/Apex-AdBlocker/blob/main/PRIVACY.md |
| Strona produktu | https://github.com/Bonziuu/Apex-AdBlocker |
| Pomoc | konrad.wozniak.1996@gmail.com lub https://github.com/Bonziuu/Apex-AdBlocker/issues |

Publiczna polityka musi zawierać aktualną, przejrzaną treść; lokalna zmiana `PRIVACY.md` nie aktualizuje strony na GitHubie. Nazwy pól i kategorię wybierz według bieżącego panelu. Jego układu ani wymagań regulaminowych na 2026 rok nie potwierdzono na żywo.

Żądane uprawnienia mają uzasadnienia PL/EN w podlinkowanym dokumencie:

- **declarativeNetRequest** — stosowanie dołączonych reguł, własnych filtrów i wyjątków.
- **scripting** — dołączone skrypty filtrujące, kosmetyczny CSS i narzędzie wskazywania elementu.
- **storage** — lokalne ustawienia i ograniczona diagnostyka.
- **activeTab** — działania i dostępne statystyki dla karty wskazanej przez użytkownika.
- **Dostęp do witryn `<all_urls>`** — filtrowanie obsługiwanych stron i ramek, z zachowaniem ograniczeń Chrome.

Brak telemetrii lub backendu nie oznacza braku lokalnego dostępu do danych. W formularzu prywatności uwzględnij adresy, DOM, używane przez filtry cookies/pamięć witryn, ustawienia i opcjonalną diagnostykę zgodnie z aktualnymi definicjami pól. Oświadczenia wydawcy powinny odpowiadać rzeczywistym praktykom; nie zaznaczaj ich automatycznie na podstawie samej instrukcji.

## Właściwe pliki do wgrania

- ZIP rozszerzenia: `Apex-AdBlocker-WebStore-1.0.0.zip` wskazany przez najnowszy `docs/webstore/readiness-report.json` w `package.path`. Nie wybieraj ZIP-a użytkownika z plikiem `START-HERE.txt`, paczki `-dev.zip` ani całego zestawu materiałów.
- Ikona sklepu: `icons/logo128.png`, zgodna z obecnym manifestem; ta sama grafika znajduje się w `brand/apex-store-icon-128.png`.
- Grafika promocyjna: `docs/webstore/assets/promo-small-440x280.png` (440×280). To grafika marki, nie zrzut aplikacji.
- Zrzuty: aktualne PNG wskazane przez `docs/webstore/submission.json` i powiązane metadanymi z daną paczką. Procedura: [screenshots.md](../docs/webstore/screenshots.md).

Zachowane `screenshots/en/`, `screenshots/pl/`, `promo/` i `github/` służą także prezentacji projektu. Dotychczasowe kompozycje pokazują lokalną stronę demonstracyjną, a `capture-metadata.json` określa, czy potwierdzono ich źródło dla bieżącej paczki. Przy statusie `pending` nie przedstawiaj ich jako aktualnych, zweryfikowanych przechwyceń. Nie dowodzą skuteczności na rzeczywistych portalach.

## Odtworzenie materiałów

`node store/generate.mjs` tworzy świeżą paczkę w katalogu tymczasowym, uruchamia rzeczywiste rozszerzenie w Chromium Playwright, przygotowuje komplet obrazów w stagingu i zapisuje wersję oraz hashe. Generator nie podmienia API Chrome ani licznika blokowania. Brak przeglądarki lub błąd przechwycenia zachowuje starsze pliki.

Automat `npm run webstore:prepare` tworzy paczkę zgłoszeniową, sprawdza kod i zapisuje stan walidacji. [Instrukcja przygotowania](../docs/webstore/README.md) wyjaśnia pozostałe kroki. Niczego nie publikuje ani nie zastępuje decyzji sklepu.
