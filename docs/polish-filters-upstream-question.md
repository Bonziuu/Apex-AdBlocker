# Pytanie do autorów Polskich Filtrów Reklamowych – projekt wiadomości

> **Status: NIE WYSŁANO.** To tylko projekt, który zostaje w repozytorium. Zanim właściciel projektu wyśle wiadomość, powinien ją przejrzeć i uzupełnić pola `[…]`.
>
> Możliwe kanały (z nagłówków list i repozytorium upstream):
> - GitHub Issues: https://github.com/MajkiIT/polish-ads-filter/issues
> - e-mail: `errorsfilters@certyficate.it` (adres z nagłówka `adblock.txt`, przeznaczony głównie do zgłoszeń błędów w filtrach)
>
> Kontekst: [third-party-license-audit.md](third-party-license-audit.md), sekcje 3.3 i 7.
>
> Odpowiedź autorów warto zarchiwizować (link lub kopia w `docs/`). Jest ona warunkiem wariantu B `WITH UPSTREAM CONFIRMATION`.

---

**Temat:** Pytanie o licencję Polskich Filtrów w darmowym rozszerzeniu do Chrome (ChromeBlock)

Dzień dobry,

piszę jako autor ChromeBlock, darmowego rozszerzenia do Chrome, które blokuje reklamy (Manifest V3). Od początku korzystamy z Oficjalnych Polskich Filtrów i bardzo dziękujemy za Waszą pracę. To dzięki niej blokowanie na polskich stronach działa tak dobrze.

Przed publicznym wydaniem chcę się upewnić, że korzystamy z Waszych list zgodnie z Waszymi oczekiwaniami i z licencją. Dlatego zanim cokolwiek opublikujemy, chciałbym zapytać o kilka rzeczy.

**Czym jest ChromeBlock i jak chcemy go rozpowszechniać**

- ChromeBlock jest **w pełni darmowy**. Nie ma płatnych funkcji, wersji Pro, kont użytkowników, subskrypcji, kluczy licencyjnych ani reklam.
- Rozszerzenie nie zbiera danych ani telemetrii.
- Planujemy dystrybucję przez **Chrome Web Store**.
- W przyszłości w rozszerzeniu lub na stronie projektu może się pojawić **opcjonalny link „Wesprzyj rozwój”** do dobrowolnego wsparcia autora. Nie odblokowywałby żadnych funkcji, a wszystkie funkcje pozostałyby darmowe dla wszystkich.

**Jak używamy Waszych list**

- Korzystamy z plików `adblock.txt`, `adblock_suplement.txt` i `adblock_ublock.txt` (`adblock_adguard.txt` jest pomijany).
- Listy nie są pobierane przez rozszerzenie z sieci. Są **przetwarzane lokalnie podczas budowania rozszerzenia**:
  - filtry sieciowe trafiają do reguł `declarativeNetRequest` (DNR);
  - filtry kosmetyczne trafiają do danych ukrywania elementów;
  - filtry scriptletów trafiają do plików scriptletów.
- Część filtrów, których nie da się wyrazić w Manifest V3, jest pomijana.
- W wynikowych plikach Wasze filtry są połączone z filtrami z innych list, czyli EasyList (GPLv3 / CC BY-SA 3.0) i uBlock filters (GPLv3).
- **Uczciwie przyznaję**, że obecnie nagłówki źródłowe list (w tym informacje o licencji i prawach autorskich) **nie trafiają do wygenerowanych plików**. Autorstwo i licencję podajemy tylko skrótowo na stronie ustawień i w README.
- Przed publicznym wydaniem planujemy to naprawić:
  - **pełne uznanie autorstwa**;
  - plik **THIRD-PARTY-NOTICES** dołączony do rozszerzenia (źródło, wersja, prawa autorskie, licencja, informacja o przetworzeniu);
  - wyraźną informację w ustawieniach rozszerzenia.

**Pytania**

1. **Czy zezwalacie na opisaną dystrybucję** Waszych list jako części darmowego rozszerzenia publikowanego w Chrome Web Store?
2. **Czy opcjonalny, dobrowolny link „Wesprzyj rozwój”** (bez żadnych płatnych funkcji) jest zgodny z Waszym rozumieniem warunku **NonCommercial** licencji CC BY-NC-SA 4.0? Jeśli nie, czy dopuszczacie dystrybucję bez takiego linku?
3. **Jakie dokładnie uznanie autorstwa i notę o prawach autorskich chcecie widzieć?** W nagłówkach list jest „Copyright © Certyficate IT”, a w README mamy dziś „© MajkiIT”. Prosimy o dokładne brzmienie, np. czy podawać Certyficate IT, MajkiIT, listę współtwórców i link do strony lub repozytorium.
4. **Czy przetworzona postać filtrów** (reguły DNR, dane kosmetyczne i scriptlety, połączone z filtrami z innych list i bez oryginalnych nagłówków) **może być dystrybuowana w paczce rozszerzenia**? Jeśli tak, na jakich warunkach, np. czy ShareAlike obejmuje całe wynikowe pliki?
5. **Czy dla plików list obowiązuje CC BY-NC-SA 4.0?** Nagłówki list wskazują `https://creativecommons.org/licenses/by-nc-sa/4.0/`, ale w stopce strony https://majkiit.github.io/polish-ads-filter/ jest „CC BY 4.0” i „Wszelkie prawa zastrzeżone”. Która informacja dotyczy samych list filtrów?

Jeśli wolicie, żebyśmy na razie nie dołączali Waszych list do publicznej wersji, uszanujemy to. Wtedy wydamy rozszerzenie bez nich i wrócimy do tematu po Waszej odpowiedzi.

Z góry dziękuję za odpowiedź i za całą pracę nad filtrami.

Pozdrawiam
[imię i nazwisko / nick]
ChromeBlock – [link do projektu, jeśli będzie publiczny]
[kontakt zwrotny]
