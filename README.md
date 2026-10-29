# ChromeBlock

<img src="icons/icon128.png" alt="ChromeBlock" width="96">

**ChromeBlock** to bloker reklam i śledzenia dla Google Chrome oparty o Manifest V3 i własny silnik filtrów.

> **Status:** stabilne wydanie. Źródłem numeru wersji jest `manifest.json`.

## Najważniejsze funkcje

- blokowanie żądań sieciowych przez `declarativeNetRequest`,
- filtry kosmetyczne i proceduralne,
- własna warstwa zgodności scriptletów uBO z zasadą *fail closed*,
- YouTube Protection z kontrolą zgodności filtrów podczas buildu,
- wyłączanie ochrony per strona i opcjonalne automatyczne odświeżenie,
- „Ukryj element” i własne filtry użytkownika,
- lokalna diagnostyka bez telemetrii, kont i backendu,
- jasny i ciemny motyw interfejsu.

ChromeBlock używa jednego stałego zestawu ochrony: reklamy, prywatność/śledzenie i bezpieczeństwo. Produkt nie ma płatnych funkcji, kont ani subskrypcji.

## Instalacja lokalna

```bash
git clone https://github.com/Bonziuu/Chromeblock.git
```

Następnie:

1. otwórz `chrome://extensions`,
2. włącz **Tryb dewelopera**,
3. wybierz **Załaduj rozpakowane**,
4. wskaż katalog repozytorium zawierający `manifest.json`.

Po `git pull` przy wersji rozpakowanej trzeba kliknąć **Odśwież** przy ChromeBlock w `chrome://extensions`, aby przeładować również service workera.

## Jak to działa

| Warstwa | Rola |
|---|---|
| `background.js`, `background/` | service worker, stan ochrony, DNR, rejestracja scriptletów, diagnostyka |
| `shared/parser.js` | parser obsługiwanego podzbioru składni ABP/uBO |
| `content/cosmetic.js` | ukrywanie elementów i filtry proceduralne |
| `content/picker.js` | interaktywny tryb „Ukryj element” |
| `youtube/` | zgodność filtrów i lokalna diagnostyka odtwarzacza |
| `rules/`, `data/`, `scriptlets/` | wygenerowane artefakty wykorzystywane przez rozszerzenie |
| `tools/` | build, audyty, aktualizacja list i packaging |
| `tests/` | testy jednostkowe, integracyjne, Chromium i E2E |

Bardziej szczegółowy opis architektury i ograniczeń: [docs/technical-overview.md](docs/technical-overview.md).

## Jakość i testy

Projekt ma automatyczny pipeline GitHub Actions oraz testy uruchamiane w Node.js i prawdziwym Chromium.

```bash
npm test
npm run check
npm run package:dev
```

`npm run check` sprawdza m.in. aktualność wygenerowanych artefaktów, zgodność krytycznych filtrów YouTube, audyt scriptletów, testy oraz smoke test rozszerzenia w Chromium.

Dodatkowe materiały:

- [baseline wydajności](docs/perf-baseline.md),
- [tester prawdziwych stron](docs/single-blocker-sites-test.md),
- [ręczny test YouTube](docs/manual-youtube-test.md),
- [pochodzenie i licencje list filtrów](docs/filter-provenance.md).

## Prywatność

ChromeBlock nie ma telemetrii, analityki, kont ani własnego backendu. Ustawienia i diagnostyka są przechowywane lokalnie. Rozszerzenie nie pobiera ani nie wykonuje zdalnego kodu.

Raport diagnostyczny jest sanityzowany i nie powinien zawierać historii, pełnych URL-i, identyfikatorów filmów, cookies, tokenów ani danych logowania.

## AI-assisted development

Projekt był rozwijany w workflow **AI-assisted**. Korzystałem z narzędzi AI, w tym Claude Code i ChatGPT, przy implementacji, refaktoryzacji, analizie błędów i tworzeniu testów.

Po mojej stronie pozostawały wymagania produktu, decyzje funkcjonalne i architektoniczne, testy ręczne, ocena rezultatów oraz decyzje o przyjmowaniu zmian. Użycia AI nie traktuję jako czegoś do ukrywania — jest ono częścią procesu tworzenia tego projektu.

## Ograniczenia

ChromeBlock nie jest uBlock Origin i nie implementuje całej składni uBO/ABP. Nieobsługiwane konstrukcje są pomijane zamiast wykonywane częściowo. Manifest V3 nakłada też ograniczenia, których rozszerzenie nie próbuje obchodzić.

Strony mogą wykrywać blokowanie reklam, a skuteczność filtrów zależy również od zmian po stronie serwisów i aktualności upstreamowych list.

## Źródła filtrów i licencje

Wbudowane listy filtrów pochodzą m.in. z EasyList/EasyPrivacy, uAssets oraz Polskich Filtrów i zachowują własne warunki licencyjne. Szczegóły, źródła i stan audytu znajdują się w [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) i [docs/filter-provenance.md](docs/filter-provenance.md).

Repozytorium nie deklaruje obecnie jednej licencji obejmującej cały projekt i wszystkie dane third-party.

## Development

Wymagany Node.js 20+.

```bash
npm install
npm test
npm run check
npm run audit:scriptlets
npm run update-lists
npm run build
```

`npm run package:dev` tworzy czystą paczkę rozszerzenia w `dist/`; narzędzia developerskie i testy nie są do niej kopiowane.

---

ChromeBlock jest projektem niezależnym i nie jest powiązany z Google, uBlock Origin ani autorami upstreamowych list filtrów.
