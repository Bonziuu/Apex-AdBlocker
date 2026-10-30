# Apex AdBlocker – dla programistów

Szczegóły techniczne przeniesione z README. Instrukcja dla użytkowników: [INSTALLATION.md](INSTALLATION.md).

## Jak to działa

| Warstwa | Rola |
|---|---|
| `background.js`, `background/` | service worker, stan ochrony, DNR, rejestracja scriptletów, diagnostyka |
| `shared/parser.js` | parser obsługiwanego podzbioru składni ABP/uBO |
| `content/cosmetic.js` | ukrywanie elementów i filtry proceduralne |
| `content/picker.js` | interaktywny tryb „Ukryj element” |
| `_locales/`, `shared/i18n.js` | tłumaczenia interfejsu (pl, en); źródło tekstów: `tools/i18n-messages.mjs` |
| `youtube/` | zgodność filtrów i lokalna diagnostyka odtwarzacza |
| `rules/`, `data/`, `scriptlets/` | wygenerowane artefakty wykorzystywane przez rozszerzenie |
| `tools/` | build, audyty, aktualizacja list i packaging |
| `tests/` | testy jednostkowe, integracyjne, Chromium i E2E |

Bardziej szczegółowy opis architektury i ograniczeń: [docs/technical-overview.md](technical-overview.md).

Logo marki: [brand/](../brand/README.md). Materiały do Chrome Web Store (teksty, uzasadnienia uprawnień, zrzuty ekranu): [store/](../store/README.md).

## Jakość i testy

Projekt ma automatyczny pipeline GitHub Actions oraz testy uruchamiane w Node.js i prawdziwym Chromium.

```bash
npm test
npm run check
npm run package:dev
npm run package:release
npm run package:store
```

`npm run check` sprawdza m.in. aktualność wygenerowanych artefaktów, zgodność krytycznych filtrów YouTube, audyt scriptletów, testy oraz smoke test rozszerzenia w Chromium.

`npm run package:release` tworzy paczkę dla użytkownika z plikiem `START-HERE.txt`, wersjonowanym ZIP-em, stałą kopią `Apex-AdBlocker.zip` i sumami SHA-256.

`npm run package:store` tworzy osobny `Apex-AdBlocker-WebStore-<wersja>.zip` gotowy do uploadu w Chrome Web Store: `manifest.json` znajduje się bezpośrednio w katalogu głównym archiwum, bez folderu nadrzędnego i bez plików instalacyjnych.

Dodatkowe materiały:

- [instrukcja instalacji](INSTALLATION.md),
- [baseline wydajności](perf-baseline.md),
- [tester prawdziwych stron](single-blocker-sites-test.md),
- [ręczny test YouTube](manual-youtube-test.md),
- [pochodzenie i licencje list filtrów](filter-provenance.md).

## Prywatność

Apex AdBlocker nie ma telemetrii, analityki, kont ani własnego backendu. Ustawienia i diagnostyka są przechowywane lokalnie. Rozszerzenie nie pobiera ani nie wykonuje zdalnego kodu.

Raport diagnostyczny jest sanityzowany i nie powinien zawierać historii, pełnych URL-i, identyfikatorów filmów, cookies, tokenów ani danych logowania.

Pełna polityka prywatności (EN/PL): [PRIVACY.md](../PRIVACY.md).

## AI-assisted development

Projekt był rozwijany w workflow **AI-assisted**. Korzystałem z narzędzi AI, w tym Claude Code i ChatGPT, przy implementacji, refaktoryzacji, analizie błędów i tworzeniu testów.

Po mojej stronie pozostawały wymagania produktu, decyzje funkcjonalne i architektoniczne, testy ręczne, ocena rezultatów oraz decyzje o przyjmowaniu zmian. Użycia AI nie traktuję jako czegoś do ukrywania — jest ono częścią procesu tworzenia tego projektu.

## Ograniczenia

Apex AdBlocker nie jest uBlock Origin i nie implementuje całej składni uBO/ABP. Nieobsługiwane konstrukcje są pomijane zamiast wykonywane częściowo. Manifest V3 nakłada też ograniczenia, których rozszerzenie nie próbuje obchodzić.

Strony mogą wykrywać blokowanie reklam, a skuteczność filtrów zależy również od zmian po stronie serwisów i aktualności upstreamowych list.

## Źródła filtrów i licencje

Wbudowane listy filtrów pochodzą m.in. z EasyList/EasyPrivacy, uAssets oraz Polskich Filtrów i zachowują własne warunki licencyjne. Szczegóły i źródła znajdują się w [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) i [docs/filter-provenance.md](filter-provenance.md).

Repozytorium nie deklaruje obecnie jednej licencji obejmującej cały projekt i wszystkie dane third-party.

## Development

Wymagany Node.js 20+.

```bash
git clone https://github.com/Bonziuu/Apex-AdBlocker.git
cd Apex-AdBlocker
npm install
npm test
npm run check
npm run audit:scriptlets
npm run update-lists
npm run build
```

Do lokalnego testowania jako rozszerzenie rozpakowane można wskazać katalog repozytorium zawierający `manifest.json`. Po `git pull` trzeba kliknąć **Odśwież** przy Apex AdBlocker w `chrome://extensions`, aby przeładować również service workera.

`npm run package:dev` tworzy czystą paczkę developerską w `dist/`. `npm run package:release` tworzy gotowy bundle dla użytkownika, a `npm run package:store` tworzy ZIP do Chrome Web Store; narzędzia developerskie i testy nie trafiają do dystrybucji.

---

Apex AdBlocker jest projektem niezależnym i nie jest powiązany z Google, uBlock Origin ani autorami upstreamowych list filtrów.

## Automaty na GitHubie

| Workflow | Kiedy | Co robi |
|---|---|---|
| `ci.yml` | każdy push i PR | testy, `npm run check`, paczka do Chrome Web Store jako artefakt |
| `update-lists.yml` | co poniedziałek (i ręcznie: Actions → *Aktualizacja list filtrów* → *Run workflow*) | pobiera listy, buduje reguły, `npm run check`, otwiera PR `auto/update-lists` do akceptacji (szkic, gdy kontrola nie przeszła) |
| `release.yml` | tag `vX.Y.Z` | sprawdza zgodność z `manifest.json`, `npm run check`, buduje paczki i publikuje wydanie z opisem z `tools/release-notes.mjs` |

**Nowe wydanie:** podbij `version` w `manifest.json`, dopisz sekcję `## X.Y.Z` (z `### PL` i `### ENG`) do [CHANGELOG.md](../CHANGELOG.md), wypchnij na `main`, a potem:

```bash
git tag v1.0.1 && git push origin v1.0.1
```

**Jednorazowe ustawienie repo** (dla PR z aktualizacją list): Settings → Actions → General → Workflow permissions → zaznacz *Allow GitHub Actions to create and approve pull requests*.
