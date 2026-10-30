# Apex AdBlocker – materiały do Chrome Web Store

Wszystko, co trzeba wkleić lub wgrać w [panelu dewelopera Chrome Web Store](https://chrome.google.com/webstore/devconsole). Folder `store/` nie trafia do paczki rozszerzenia.

**Paczka do wgrania:** `npm run package:store` → `dist/Apex-AdBlocker-WebStore-<wersja>.zip`

---

## 1. Karta „Store listing”

| Pole | Wartość |
|---|---|
| Język główny | English (wersja polska jako dodatkowe tłumaczenie wpisu) |
| Kategoria | Privacy & Security (jeśli niedostępna: Productivity) |
| Ikona sklepu | `brand/apex-store-icon-128.png` (z paczki pobierana jest też `icons/logo128.png`) |
| Zrzuty ekranu | `store/screenshots/en/*.png` (EN) i `store/screenshots/pl/*.png` (PL), 1280×800 |
| Mały kafelek promocyjny | `store/promo/small-tile-440x280.png` (EN) / `small-tile-440x280-pl.png` (PL) |
| Strona domowa | https://github.com/Bonziuu/Apex-AdBlocker |
| Strona pomocy | https://github.com/Bonziuu/Apex-AdBlocker/issues |

Nazwa i krótki opis (summary) pochodzą z manifestu i `_locales` – nie wpisuje się ich ręcznie.

### Opis (English)

```
Apex AdBlocker blocks ads, trackers and malicious sites – with no setup, no accounts and no telemetry.

Protection works right after installation, with one fixed set of trusted filter lists. There are no protection levels to choose and nothing to configure.

WHAT IT BLOCKS
• Ads – banners, pop-ups and video ads, including YouTube Protection
• Tracking – tracking scripts and pixels that follow you across sites
• Malicious sites – known scams and malware

HOW IT WORKS
• Network blocking with Chrome's built-in declarativeNetRequest engine – fast and light on resources
• Cosmetic filtering hides the empty frames and leftovers ads leave behind
• Scriptlets neutralise anti-adblock scripts and ads woven into video players
• A built-in check verifies that the YouTube filters are supported before each release

SIMPLE CONTROLS
• Turn protection off for a site with one click if something doesn't work
• "Hide element" – click anything on a page to hide it permanently
• Add your own filters in uBlock Origin / Adblock Plus syntax
• Back up and restore your settings

PRIVATE BY DESIGN
Apex AdBlocker works entirely in your browser. It has no server, sends no data and contains no remote code. Settings and diagnostics are stored only locally.

Filter lists: EasyList, EasyPrivacy, uBlock filters and Polish Ad Filters, used under their respective licences.

Apex AdBlocker is free, with no paid features or subscriptions.
```

### Opis (polski)

```
Apex AdBlocker blokuje reklamy, śledzenie i złośliwe strony – bez konfiguracji, bez kont i bez telemetrii.

Ochrona działa od razu po instalacji, z jednym stałym zestawem sprawdzonych list filtrów. Nie trzeba wybierać poziomu ochrony ani niczego ustawiać.

CO BLOKUJE
• Reklamy – banery, wyskakujące okna i reklamy wideo, w tym YouTube Protection
• Śledzenie – skrypty i piksele śledzące Cię między stronami
• Złośliwe strony – znane oszustwa i malware

JAK DZIAŁA
• Blokowanie sieci przez wbudowany w Chrome silnik declarativeNetRequest – szybko i oszczędnie
• Filtry kosmetyczne ukrywają puste ramki i pozostałości po reklamach
• Scriptlety neutralizują skrypty anty-adblock i reklamy wplecione w odtwarzacze wideo
• Wbudowana kontrola sprawdza przed każdym wydaniem, czy filtry YouTube są obsługiwane

PROSTA OBSŁUGA
• Jednym kliknięciem wyłączysz ochronę na stronie, jeśli coś nie działa
• „Ukryj element” – kliknij cokolwiek na stronie, żeby ukryć to na stałe
• Własne filtry w składni uBlock Origin / Adblock Plus
• Kopia zapasowa i przywracanie ustawień

PRYWATNOŚĆ PRZEDE WSZYSTKIM
Apex AdBlocker działa w całości w Twojej przeglądarce. Nie ma serwera, nie wysyła danych i nie zawiera zdalnego kodu. Ustawienia i diagnostyka są przechowywane wyłącznie lokalnie.

Listy filtrów: EasyList, EasyPrivacy, uBlock filters i Polskie Filtry Reklamowe, na warunkach ich licencji.

Apex AdBlocker jest darmowy – bez płatnych funkcji i subskrypcji.
```

---

## 2. Karta „Privacy practices”

### Single purpose (jedno przeznaczenie)

```
Apex AdBlocker blocks ads, trackers and malicious sites on the web pages the user visits.
```

### Uzasadnienia uprawnień

**declarativeNetRequest**
```
Used to block requests to ad, tracking and malware domains with the extension's built-in static filter rules, and to apply the user's own filters and per-site exceptions as dynamic rules. This is the core ad-blocking function of the extension.
```

**scripting**
```
Used to hide ad elements left on pages (cosmetic filtering), to register blocking scripts (scriptlets) that neutralise anti-adblock code and in-player video ads on the sites that need them, and to inject the "Hide element" tool when the user starts it from the popup. All scripts are bundled in the extension package; no remote code is executed.
```

**storage**
```
Used to save the user's settings locally (sites where protection is turned off, the user's own filters, the page-reload preference) and a local diagnostics log shown in the extension's settings. Nothing is synced or sent anywhere.
```

**activeTab**
```
Used to show the number of requests blocked on the current tab when the user opens the extension popup (chrome.declarativeNetRequest.getMatchedRules for that tab).
```

**Host permission (<all_urls>)**
```
An ad blocker must be able to act on every site the user visits: to apply cosmetic filters and blocking scripts in page frames, to apply site-specific filters and to redirect blocked ad scripts to harmless built-in placeholders. Page data is processed only locally in the browser and is never collected or transmitted.
```

### Remote code

```
No, I am not using remote code.
```
Uzasadnienie (jeśli pole jest wymagane):
```
All JavaScript, filter rules and resources are included in the extension package. The extension makes no network requests of its own.
```

### Data usage (wykorzystanie danych)

Nie zaznaczaj **żadnej** kategorii danych – rozszerzenie nie zbiera i nie przesyła danych użytkownika (dane stron są przetwarzane wyłącznie lokalnie).

Zaznacz wszystkie trzy oświadczenia:
- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

### Privacy policy URL

```
https://github.com/Bonziuu/Apex-AdBlocker/blob/main/PRIVACY.md
```

---

## 3. Uwagi do weryfikacji

- Rozszerzenia z dostępem do wszystkich stron przechodzą dłuższą weryfikację – to normalne.
- Zrzuty ekranu pokazują prawdziwe rozszerzenie na fikcyjnej stronie demo („Daily News”) z lokalnie podstawionymi reklamami – zrzuty z tą stroną mają o tym podpis. Ramka przeglądarki jest neutralną makietą (bez elementów konkretnego systemu), a nagłówki opisują tylko to, co rozszerzenie faktycznie robi (np. „Ukryj element” wymaga kilku kliknięć, więc nie obiecujemy „dwóch”). Liczba zablokowanych żądań w popupie to faktyczna liczba żądań zablokowanych na tej stronie (automat nie może kliknąć ikony, więc Chrome nie przyznaje uprawnienia `activeTab` – liczba pochodzi z dziennika sieci tej samej strony).
- Zrzuty generuje `node store/generate.mjs` (wymaga Chrome i paczki `npm run package:dev`).
