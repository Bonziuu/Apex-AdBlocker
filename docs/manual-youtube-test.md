# ChromeBlock – ręczny test YouTube

Cel: potwierdzić w prawdziwym Chrome, że ochrona YouTube działa i nie psuje odtwarzania.
Test **nie** polega na klikaniu „Pomiń reklamę” ani na obchodzeniu CAPTCHA czy logowania.
Jeśli YouTube pokaże CAPTCHA, `/sorry/` albo weryfikację konta – przerwij dany krok i zapisz to w uwagach.

Czas: ok. 15–20 minut.

---

## A. Przygotowanie

1. Zamknij inne blokery reklam (uBlock Origin Lite, AdGuard, Adblock Plus itp.) albo użyj **nowego profilu Chrome** (Menu → Profil → Dodaj). Inne blokery zafałszują wynik.
2. Pobierz repozytorium i przełącz się na gałąź testową:
   ```bash
   git clone https://github.com/Bonziuu/Chromeblock.git
   cd Chromeblock
   git checkout engine-hardening-youtube-v02
   ```
3. Otwórz `chrome://extensions`, włącz **Tryb dewelopera**, kliknij **Załaduj rozpakowane** i wskaż katalog repozytorium.
4. Sprawdź, czy karta rozszerzenia pokazuje **ChromeBlock** w najnowszej wersji (np. `0.2.7-dev`) i nie ma przycisku „Błędy”.
5. Otwórz opcje ChromeBlock → **Diagnostyka**. Wszystkie komponenty (Network, Cosmetic, Scriptlets, Filters, YouTube) powinny mieć status **OK**. Jeśli któryś ma ERROR – zanotuj to i przejdź do części E.
6. Zalecane: test wykonaj **bez logowania** do YouTube (okno w nowym profilu). Jeśli jesteś zalogowany, zaznacz to w uwagach – reklamy zależą od konta, regionu i testów A/B.

## B. Filmy /watch

Wykonaj dla co najmniej **3 różnych filmów**, w tym jednego dłuższego (> 10 min).

1. Otwórz film `https://www.youtube.com/watch?v=…` w nowej karcie.
2. Jeśli pojawi się ekran zgody na cookies – wybierz opcję zgodnie ze swoją wolą (to zwykła interakcja, nie obejście).
3. Obserwuj pierwsze **20 sekund**:
   - Czy pojawiła się reklama (żółty pasek postępu, napis „Reklama”/„Sponsorowane”, odliczanie, przycisk „Pomiń”)? **Nie klikaj „Pomiń”.** Zanotuj, ile sekund trwał stan reklamy.
   - Czy film główny ruszył i czas rośnie?
   - Czy kółko ładowania (spinner) kręci się dłużej niż 10 s?
   - Czy pojawił się komunikat YouTube o blokerach reklam (anti-adblock)?
4. **Seek:** kliknij na pasku postępu ok. 15–20 s dalej (albo naciśnij `L` lub strzałkę w prawo kilka razy). Czy odtwarzanie wznawia się i czas rośnie?
5. **Pauza/wznowienie:** spacja dwukrotnie – czy film wznawia się bez błędu?

## C. Playlista, Shorts, embed, YouTube Music

1. **Playlista:** otwórz dowolną playlistę (`…/watch?v=…&list=…`). Poczekaj, aż film ruszy, potem naciśnij `Shift+N` (następny film). Czy kolejny film się ładuje i odtwarza?
2. **Shorts:** otwórz `https://www.youtube.com/shorts/…`. Czy short się odtwarza? Przewiń do następnego (strzałka w dół) – czy kolejny też się odtwarza? Czy między shortami pojawiają się reklamy?
3. **Embed:** otwórz stronę z osadzonym filmem YouTube (np. artykuł z odtwarzaczem YouTube) albo bezpośrednio `https://www.youtube.com/embed/…`. Kliknij „odtwórz” – czy film się odtwarza?
4. **YouTube Music:** otwórz `https://music.youtube.com/watch?v=…`. Czy utwór się odtwarza? Czy pojawiają się reklamy audio/wideo?

## D. Diagnostyka

1. Po teście **na otwartej karcie z filmem** otwórz opcje ChromeBlock → **Diagnostyka** → odśwież.
2. Zanotuj status komponentu **YouTube** i stan odtwarzacza (`healthy` / `degraded` / `error` / `unknown`).
3. Kliknij **Kopiuj raport diagnostyczny**. Wklej raport do notatnika i sprawdź, że **nie zawiera** adresów stron, ID filmów, nazwy konta ani e-maila. Jeśli coś takiego zawiera – to błąd, zgłoś go (bez wklejania tych danych).
4. Raport dołącz do formularza w części E.

## E. Gdy coś nie działa

1. Zanotuj dokładnie, co widzisz (reklama / spinner / czarny ekran / komunikat anti-adblock / błąd odtwarzacza) i na jakim typie strony (watch / playlista / Shorts / embed / Music).
2. Sprawdź, czy problem znika po **wyłączeniu ChromeBlock na youtube.com** (popup → przycisk zasilania) i odświeżeniu strony:
   - znika → problem prawdopodobnie po stronie ChromeBlock,
   - nie znika → problem po stronie YouTube / sieci / konta.
3. Włącz ochronę z powrotem.
4. W `chrome://extensions` sprawdź, czy przy ChromeBlock pojawił się przycisk **Błędy** – jeśli tak, przepisz komunikat (bez adresów stron).
5. Skopiuj raport diagnostyczny (część D) i wypełnij formularz poniżej.
6. Nie próbuj obchodzić CAPTCHA ani komunikatów YouTube – zapisz je w uwagach.

---

## Formularz raportu

Wypełnij jeden formularz na każdy testowany typ strony.

```
ChromeBlock:            (wersja z chrome://extensions, np. 0.2.7-dev)
Chrome:                 (chrome://version, np. 141.0.xxxx.xx)
OS:                     (np. Windows 11 / macOS 15 / Ubuntu 24.04)
URL type:               watch / playlist / shorts / embed / music
Ads visible:            nie / tak – ile sekund: __ / krótki błysk < 3 s
Anti-adblock warning:   nie / tak
Playback started:       tak / nie
Persistent spinner:     nie / tak (> 10 s)
Seek works:             tak / nie / nie testowano
Next video:             tak / nie / nie dotyczy
Diagnostics status:     YouTube: OK / WARNING / ERROR; odtwarzacz: healthy / degraded / error / unknown
Notes:                  (zalogowany? region? CAPTCHA? co pomogło? raport diagnostyczny w załączniku)
```
