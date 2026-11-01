<p align="center">
  <img src="brand/apex-logo.svg" alt="" width="96">
</p>

<h1 align="center">Apex AdBlocker</h1>

<p align="center">
  <b>Polski, bezpłatny adblocker o otwartym kodzie dla Google Chrome.<br>Blokuje reklamy i mechanizmy śledzące bez konta i bez telemetrii Apex.</b>
</p>

<p align="center">
  <a href="https://github.com/Bonziuu/Apex-AdBlocker/releases/latest/download/Apex-AdBlocker.zip"><b>⬇ Pobierz Apex AdBlocker (ZIP)</b></a>
  &nbsp;·&nbsp; <a href="#instalacja">Instrukcja instalacji</a>
  &nbsp;·&nbsp; <a href="https://apexsoftware.app/pl/adblocker/">Strona produktu</a>
  &nbsp;·&nbsp; <a href="#eng">English ↓</a>
</p>

<p align="center">
  <a href="https://github.com/Bonziuu/Apex-AdBlocker/releases/latest"><img src="https://img.shields.io/github/v/release/Bonziuu/Apex-AdBlocker?label=wersja&color=0f7f8c" alt="Najnowsza wersja"></a>
  <a href="https://github.com/Bonziuu/Apex-AdBlocker/releases/latest"><img src="https://img.shields.io/github/release-date/Bonziuu/Apex-AdBlocker?label=wydano&color=0f7f8c" alt="Data wydania"></a>
  <a href="LICENSING.md"><img src="https://img.shields.io/badge/kod%20Apex-MIT-0f7f8c" alt="Kod Apex: licencja MIT; listy filtrów na własnych licencjach"></a>
</p>

> **Status:** stabilne wydanie. Najnowszą wersję, listę zmian i sumy SHA-256 znajdziesz w [Releases](https://github.com/Bonziuu/Apex-AdBlocker/releases/latest) · [Co nowego](CHANGELOG.md)

- 🛡️ Blokowanie reklam i trackerów
- 🔒 Bez konta i telemetrii Apex
- 🧩 Manifest V3
- 🖱️ Ukrywanie elementów i własne filtry
- 🌍 Interfejs PL / EN
- 💻 Chrome 121+ na komputerze
- 🔓 Open source
- 🇵🇱 Rozwijany w Polsce

<p align="center">
  <img src="https://apexsoftware.app/assets/screens/pl/after.webp" alt="Strona demonstracyjna z Apex AdBlocker: artykuł bez reklam i bez wyskakującego okienka" width="560">
  <img src="https://apexsoftware.app/assets/screens/pl/popup.webp" alt="Okienko Apex AdBlocker: ochrona aktywna, 8 zablokowanych żądań na tej karcie" width="250">
</p>
<p align="center"><sub>Prawdziwe zrzuty wersji 1.0.0 na lokalnej stronie demonstracyjnej. To nie jest pomiar skuteczności na rzeczywistych serwisach.</sub></p>

## Dlaczego Apex AdBlocker

- **Działa od razu.** Wbudowane listy filtrów zaczynają działać po instalacji. Nie wybierasz poziomów ochrony i niczego nie konfigurujesz.
- **Twoje przeglądanie zostaje u Ciebie.** Rozszerzenie nie ma konta, backendu Apex ani telemetrii. Filtrowanie i ustawienia działają lokalnie w przeglądarce.
- **Masz kontrolę.** Wyłączasz ochronę dla wybranej strony jednym kliknięciem, ukrywasz elementy i dodajesz własne filtry.
- **Otwarte zasady.** Kod jest publiczny, wydania mają sumy SHA-256, a zmiany są opisane w changelogu.

## Funkcje

| | |
|---|---|
| **Blokowanie reklam** | Ogranicza reklamy i elementy reklamowe. Filtry kosmetyczne ukrywają miejsca po reklamach. |
| **Ochrona przed śledzeniem** | Wbudowane listy ograniczają połączenia ze znanymi mechanizmami śledzącymi. |
| **Wybrane zagrożenia** | Lista ryzykownych stron ogranicza wybrane oszustwa i strony z malware. Nie zastępuje programu antywirusowego. |
| **Wyjątki jednym kliknięciem** | Wyłączenie ochrony dla wybranej strony w okienku rozszerzenia; lista wyjątków w ustawieniach. |
| **Ukryj element** | Wskazujesz element strony, a Apex tworzy dla niego filtr. |
| **Własne filtry** | Edytor reguł w obsługiwanym podzbiorze składni Adblock Plus i uBlock Origin. |
| **Kontrola ustawień** | Eksport i import ustawień do pliku oraz lokalna diagnostyka, którą udostępniasz tylko sam. |
| **YouTube Protection** | Dodatkowe filtry i lokalna diagnostyka odtwarzacza. Nie gwarantujemy zablokowania każdej reklamy. |

Wbudowane listy: EasyList, EasyPrivacy, uBlock filters i Polskie Filtry. Skuteczność zależy od list filtrów, zmian na stronach i ograniczeń Chrome.

## Prywatność

- **Bez konta** — nie ma rejestracji ani logowania.
- **Bez telemetrii Apex** — rozszerzenie nie wysyła autorowi historii przeglądania ani statystyk użytkowania.
- **Bez backendu Apex** — ustawienia i diagnostyka pozostają w profilu przeglądarki.
- **Open source** — każdy może sprawdzić, jak działa rozszerzenie.

Uprawnienia: `declarativeNetRequest`, `scripting`, `storage`, `activeTab` oraz dostęp do wszystkich stron (`<all_urls>`). Rozszerzenie potrzebuje dostępu do stron, aby rozpoznawać i blokować żądania reklamowe i trackery oraz ukrywać wybrane elementy; przetwarzanie odbywa się lokalnie. Szczegóły, w tym co pozostaje w przeglądarce i co robią wybrane filtry: [polityka prywatności](PRIVACY.md).

## Instalacja

Apex AdBlocker nie jest jeszcze dostępny w Chrome Web Store. Obecnie instalujesz go ręcznie jako rozszerzenie rozpakowane:

1. Pobierz `Apex-AdBlocker-<wersja>.zip` z [najnowszego wydania](https://github.com/Bonziuu/Apex-AdBlocker/releases/latest) (sekcja **Assets**).
2. Rozpakuj ZIP w stałym miejscu na dysku, np. `Dokumenty/Apex-AdBlocker`.
3. Otwórz w Chrome `chrome://extensions`.
4. Włącz **Tryb dewelopera** w prawym górnym rogu.
5. Kliknij **Załaduj rozpakowane**.
6. Wskaż folder `Apex-AdBlocker`.

Nie usuwaj ani nie przenoś folderu po instalacji — Chrome korzysta z niego podczas działania rozszerzenia. Pełna instrukcja, w tym usuwanie: [docs/INSTALLATION.md](docs/INSTALLATION.md).

**Weryfikacja pobranego pliku:** porównaj sumę SHA-256 ZIP-a z wpisem w [`SHA256SUMS.txt`](https://github.com/Bonziuu/Apex-AdBlocker/releases/latest/download/SHA256SUMS.txt) z tego samego wydania, np. `Get-FileHash .\Apex-AdBlocker-<wersja>.zip -Algorithm SHA256` (Windows) lub `shasum -a 256 Apex-AdBlocker-<wersja>.zip` (macOS, Linux).

## Aktualizacja

Wersja rozpakowana aktualizuje się ręcznie: pobierz nową paczkę z [Releases](https://github.com/Bonziuu/Apex-AdBlocker/releases), zastąp pliki w tym samym folderze i kliknij **Odśwież** przy Apex AdBlocker w `chrome://extensions`. Ustawienia zostają w profilu przeglądarki.

## Wymagania

- Google Chrome 121 lub nowszy na komputerze (Windows, macOS, Linux).
- Mobilny Chrome na Androidzie i iOS nie obsługuje instalowania tego rozszerzenia.

## Zrzuty ekranu

<p align="center">
  <img src="https://apexsoftware.app/assets/screens/pl/popup-off.webp" alt="Okienko po wyłączeniu ochrony dla strony" width="270">
  <img src="https://apexsoftware.app/assets/screens/pl/picker.webp" alt="Narzędzie Ukryj element na stronie demonstracyjnej" width="540">
</p>
<p align="center">
  <img src="https://apexsoftware.app/assets/screens/pl/options.webp" alt="Ustawienia: wbudowane listy filtrów" width="405">
  <img src="https://apexsoftware.app/assets/screens/pl/filters.webp" alt="Ustawienia: edytor własnych filtrów" width="405">
</p>

Wyjątek dla strony, „Ukryj element”, wbudowane listy filtrów i edytor własnych filtrów — prawdziwy interfejs wersji 1.0.0 na lokalnej stronie demonstracyjnej. To nie jest pomiar skuteczności na rzeczywistych serwisach.

## Open source

Kod źródłowy, wydania i historia zmian są publiczne w tym repozytorium. Każdy push i pull request uruchamia automatyczne testy w GitHub Actions. Wydania na GitHubie zawierają paczkę dla użytkownika, paczkę źródłową i `SHA256SUMS.txt`.

## Dla programistów

```bash
npm ci && npm test                  # testy (Node.js 20+)
npm run check -- --require-browser  # komplet testów bez SKIP oraz smoke Chromium
npm run package:release             # paczka dla użytkownika
```

Architektura, testy, packaging i ograniczenia: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) · [opis techniczny](docs/technical-overview.md) · [pochodzenie filtrów](docs/filter-provenance.md) · [materiały do Chrome Web Store](store/README.md)

## Changelog

Zmiany w każdej wersji: [CHANGELOG.md](CHANGELOG.md) oraz opisy [wydań](https://github.com/Bonziuu/Apex-AdBlocker/releases).

## Wsparcie

- Problem z rozszerzeniem: [zgłoś na GitHubie](https://github.com/Bonziuu/Apex-AdBlocker/issues) — opisz kroki odtworzenia i podaj wersję Chrome. Raport diagnostyczny przejrzyj przed udostępnieniem.
- Strona działa niepoprawnie: wyłącz ochronę dla tej strony w okienku Apex i odśwież kartę.
- Kontakt z autorem: konrad.wozniak.1996@gmail.com

## Licencja

Własny kod i dokumentacja: MIT, © 2026 Konrad Woźniak ([LICENSE](LICENSE)). Listy filtrów stron trzecich zachowują swoje licencje. Zakres i warunki: [LICENSING.md](LICENSING.md).

## Third-party notices

EasyList, EasyPrivacy, uBlock filters i Polskie Filtry są używane na warunkach ich licencji — [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Apex AdBlocker jest projektem niepowiązanym z Google, uBlock Origin ani autorami list.

---

<a id="eng"></a>

<h2 align="center">Apex AdBlocker — English</h2>

<p align="center">
  <b>A free ad blocker for Google Chrome with publicly available source code.<br>Blocks ads and tracking with no account and no Apex telemetry.</b>
</p>

<p align="center">
  <a href="https://github.com/Bonziuu/Apex-AdBlocker/releases/latest/download/Apex-AdBlocker.zip"><b>⬇ Download Apex AdBlocker (ZIP)</b></a>
  &nbsp;·&nbsp; <a href="#install-en">Installation guide</a>
  &nbsp;·&nbsp; <a href="https://apexsoftware.app/en/adblocker/">Product page</a>
</p>

> **Status:** stable release. Get the latest version, release notes and SHA-256 checksums from [Releases](https://github.com/Bonziuu/Apex-AdBlocker/releases/latest) · [What’s new](CHANGELOG.md)

- 🛡️ Blocks ads and trackers
- 🔒 No account, no Apex telemetry
- 🧩 Manifest V3
- 🖱️ Hide elements and use your own filters
- 🌍 English and Polish interface
- 💻 Chrome 121+ on desktop
- 🔓 Open source

<p align="center">
  <img src="https://apexsoftware.app/assets/screens/en/after.webp" alt="Demo page with Apex AdBlocker: the article without ads or pop-ups" width="560">
  <img src="https://apexsoftware.app/assets/screens/en/popup.webp" alt="Apex AdBlocker popup: protection on, 8 blocked requests on this tab" width="250">
</p>
<p align="center"><sub>Real screenshots of version 1.0.0 on a local demo page. Not a measurement of effectiveness on real websites.</sub></p>

### Why Apex AdBlocker

- **Works right away.** Built-in filter lists start working after installation — no protection levels, nothing to configure.
- **Your browsing stays with you.** No account, no Apex backend, no telemetry. Filtering and settings work locally in your browser.
- **You stay in control.** Turn protection off for a site with one click, hide elements and add your own filters.
- **Open rules.** Public code, releases with SHA-256 checksums and a documented changelog.

### Features

- **Ad blocking** — reduces ads and ad elements; cosmetic filters hide the space they leave.
- **Tracking protection** — built-in lists limit connections to known tracking mechanisms.
- **Selected threats** — a list of risky sites limits selected scams and malware sites. It does not replace antivirus software.
- **One-click exceptions** — turn protection off for a site in the popup; manage exceptions in settings.
- **Hide element** — point at a page element and Apex creates a filter for it.
- **Your own filters** — a rule editor for the supported subset of Adblock Plus and uBlock Origin syntax.
- **Settings control** — settings export and import, and local diagnostics you share only yourself.
- **YouTube Protection** — extra filters and local player diagnostics. Blocking every ad is not guaranteed.

Built-in lists: EasyList, EasyPrivacy, uBlock filters and the Polish Filters list. Effectiveness depends on filter lists, website changes and Chrome’s limits.

### Privacy

No account, no Apex telemetry and no Apex backend: the extension does not send your browsing history or usage statistics to the author, and settings stay in your browser profile. Permissions: `declarativeNetRequest`, `scripting`, `storage`, `activeTab` and access to all sites (`<all_urls>`), which lets the extension recognise and block ad and tracker requests and hide selected elements locally. Details: [privacy policy](PRIVACY.md).

<a id="install-en"></a>

### Installation

Apex AdBlocker is not yet available in the Chrome Web Store. For now you install it manually as an unpacked extension:

1. Download `Apex-AdBlocker-<version>.zip` from the [latest release](https://github.com/Bonziuu/Apex-AdBlocker/releases/latest) (**Assets** section).
2. Extract the ZIP to a permanent location, e.g. `Documents/Apex-AdBlocker`.
3. Open `chrome://extensions` in Chrome.
4. Turn on **Developer mode** in the top-right corner.
5. Click **Load unpacked**.
6. Select the `Apex-AdBlocker` folder.

Don’t delete or move the folder after installation — Chrome uses it while the extension runs. To remove the extension, click **Remove** next to Apex AdBlocker in `chrome://extensions` and then delete the folder.

<a id="verify-en"></a>

**Verify the download:** compare the ZIP’s SHA-256 checksum with the entry in [`SHA256SUMS.txt`](https://github.com/Bonziuu/Apex-AdBlocker/releases/latest/download/SHA256SUMS.txt) from the same release, e.g. `Get-FileHash .\Apex-AdBlocker-<version>.zip -Algorithm SHA256` (Windows) or `shasum -a 256 Apex-AdBlocker-<version>.zip` (macOS, Linux).

### Updating

The unpacked version is updated manually: download the new package from [Releases](https://github.com/Bonziuu/Apex-AdBlocker/releases), replace the files in the same folder and click **Reload** next to Apex AdBlocker in `chrome://extensions`. Your settings stay in the browser profile.

### Requirements

Google Chrome 121 or later on desktop (Windows, macOS, Linux). Mobile Chrome on Android and iOS does not support installing this extension.

### Screenshots

<p align="center">
  <img src="https://apexsoftware.app/assets/screens/en/popup-off.webp" alt="Popup after turning protection off for a site" width="270">
  <img src="https://apexsoftware.app/assets/screens/en/picker.webp" alt="Hide element tool on the demo page" width="540">
</p>
<p align="center">
  <img src="https://apexsoftware.app/assets/screens/en/options.webp" alt="Settings: built-in filter lists" width="405">
  <img src="https://apexsoftware.app/assets/screens/en/filters.webp" alt="Settings: custom filter editor" width="405">
</p>

Site exception, “Hide element”, built-in filter lists and the custom filter editor — the real 1.0.0 interface on a local demo page. Not a measurement of effectiveness on real websites.

### Open source and development

Source code, releases and history are public in this repository, and every push and pull request runs automated tests in GitHub Actions. Developer commands and documentation are in [For developers](#dla-programistów) above and in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

### Changelog, support and licence

- Changes: [CHANGELOG.md](CHANGELOG.md) and the [release notes](https://github.com/Bonziuu/Apex-AdBlocker/releases).
- Problems: [open an issue](https://github.com/Bonziuu/Apex-AdBlocker/issues) with the steps to reproduce and your Chrome version. Review a diagnostics report before sharing it.
- Contact: konrad.wozniak.1996@gmail.com
- Licence: own code and documentation under MIT, © 2026 Konrad Woźniak ([LICENSE](LICENSE)); third-party filter lists keep their licences ([LICENSING.md](LICENSING.md), [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)). Apex AdBlocker is not affiliated with Google, uBlock Origin or the list authors.
