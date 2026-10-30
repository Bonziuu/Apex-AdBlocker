# Zgłoszenie Apex AdBlocker do Chrome Web Store

Instrukcja dla Konrada Woźniaka. Nazwy sekcji są orientacyjne: sprawdź aktualny panel Google. Nie zakłada ona konkretnej opłaty, czasu oceny ani dostępności określonej kategorii. Nie wykonano zgłoszenia ani publikacji w Chrome Web Store.

## 1. Konto wydawcy

Otwórz oficjalny [panel dewelopera Chrome Web Store](https://chrome.google.com/webstore/devconsole) na swoim koncie Google i przejdź rejestrację wydawcy. Wymagane przez Google dane konta oraz weryfikacje uzupełnij osobiście. Publiczne dane projektu:

| Pole | Wartość |
|---|---|
| Autor / publiczna nazwa wydawcy | Konrad Woźniak |
| Kontakt pomocy i prywatności | konrad.wozniak.1996@gmail.com |
| Profil autora — opcjonalny odnośnik | https://www.linkedin.com/in/konrad-woźniak-23a5b831a |
| Strona projektu | https://github.com/Bonziuu/Apex-AdBlocker |
| Zgłoszenia błędów | https://github.com/Bonziuu/Apex-AdBlocker/issues |

## 2. Utwórz wpis i wybierz właściwy ZIP

W panelu wybierz utworzenie nowego elementu i wgraj **`Apex-AdBlocker-WebStore-1.0.0.zip` z najnowszego przygotowanego zestawu**. Dokładna ścieżka i SHA-256 są w [readiness-report.json](readiness-report.json), w sekcji `package`.

W środku tego ZIP-a `manifest.json` powinien być bezpośrednio w katalogu głównym. ZIP `Apex-AdBlocker.zip`, wersja `-dev.zip` i cały zestaw materiałów nie są plikiem do tego pola. Jeżeli kod zmienił się po przygotowaniu paczki, potrzebny jest nowy ZIP i nowy raport.

## 3. Opisy i obrazy

| Pole / materiał | Co wybrać lub wkleić |
|---|---|
| Nazwa | Apex AdBlocker |
| Opis PL | Bloki z [listing-pl.md](listing-pl.md) |
| Opis EN | Bloki z [listing-en.md](listing-en.md) |
| Języki | Aplikacja ma interfejs EN i PL. Domyślna lokalizacja manifestu to EN; dodaj polskie tłumaczenie wpisu zgodnie z panelem. |
| Kategoria | Wybierz z dostępnych opcji tę, która odpowiada blokowaniu reklam i ochronie prywatności. |
| Ikona 128×128 | `icons/logo128.png` — zgodna z manifestem; kopia: `brand/apex-store-icon-128.png` |
| Mała grafika promocyjna 440×280 | `docs/webstore/assets/promo-small-440x280.png` |
| Zrzuty aplikacji | Aktualne PNG wskazane w `submission.json`, z metadanymi odpowiadającymi tej paczce; [instrukcja](screenshots.md). Nie wysyłaj JSON-a jako obrazu. |

Sprawdź krótki opis wyświetlony przez panel: może być pobierany z lokalizacji manifestu. Nie twórz rozbieżnych opisów. Obejrzyj zrzuty przed wysłaniem; nie powinny zawierać prywatnych danych. Starszych obrazów `store/screenshots/` ze statusem `pending` nie zastępuj ręcznie flagą potwierdzonego przechwycenia.

## 4. Prywatność i uprawnienia

Publiczny URL polityki:

```text
https://github.com/Bonziuu/Apex-AdBlocker/blob/main/PRIVACY.md
```

Otwórz go bez logowania i sprawdź, czy zawiera poprawioną treść, aktualne dane kontaktowe i opis rzeczywistego działania aplikacji. Lokalna kopia dokumentu nie aktualizuje publicznej strony.

Tekst jednego głównego celu oraz uzasadnienia **`activeTab`, `declarativeNetRequest`, `scripting`, `storage` i dostępu `<all_urls>`** znajdziesz po polsku i angielsku w [permissions-and-privacy.md](permissions-and-privacy.md). Kod i reguły są dołączone do paczki; runtime nie pobiera skryptów do wykonania.

Przejrzyj definicje danych w aktualnym formularzu. Aplikacja korzysta lokalnie z adresów, treści stron i wybranej pamięci witryn oraz przechowuje ustawienia i ograniczoną diagnostykę. **Brak backendu nie uzasadnia automatycznego zaznaczenia „brak danych”.** Wypełnij pola na podstawie przygotowanego zakresu danych i rzeczywistych praktyk autora.

## 5. Przed wysłaniem do oceny

- [ ] Wgrany ZIP jest tym samym plikiem, którego dotyczy najnowszy raport; wersja i materiały są spójne.
- [ ] Ukończono testy całego rozszerzenia i smoke w Chrome/Chromium, a pominięte testy nie zostały uznane za zaliczone.
- [ ] Sprawdzono reprezentatywne prawdziwe strony, normalne funkcje stron, wyłączenia ochrony i ramki.
- [ ] Zrzuty pochodzą z wydawanej paczki; obejrzano ich treść i sprawdzono wymagania panelu.
- [ ] Publiczna polityka jest aktualna, a dane wydawcy i deklaracje w panelu odpowiadają aplikacji.

Autor przekazał, że aplikacja po kilku dniach używania „działa bardzo dobrze”. To informacja z codziennego używania, bez wskazania hasha paczki, konkretnych serwisów i scenariuszy. Nie zamienia brakujących testów w wynik automatyczny `PASS`.

Po uzupełnieniu wymaganych pól panelu i sprawdzeniu listy można wysłać element do oceny Google. Decyzję o dopuszczeniu podejmuje Chrome Web Store. Aktualne nieukończone kroki wskazuje pole `blockers` w raporcie; gotowy technicznie ZIP nie oznacza ich automatycznego wykonania.
