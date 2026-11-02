# Licencje list filtrów – stan zgód

Ten katalog zapisuje stan **dodatkowych zgód** autorów list filtrów. Nie zawiera ani nie zastępuje odpowiedzi autorów i nie jest opinią prawną.

Mapa „plik wynikowy → źródła → licencja” jest w [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md), szczegóły wersji i hashe snapshotów w [`docs/filter-provenance.md`](../filter-provenance.md), zakres licencji kodu Apex w [`LICENSING.md`](../../LICENSING.md).

## Polskie Filtry (`pl`)

| | |
|---|---|
| Lista Apex AdBlocker | `pl` (osobny ruleset i osobne pliki, bez danych GPL) |
| Upstream | Oficjalne Polskie Filtry, © Certyficate IT i współtwórcy – https://github.com/MajkiIT/polish-ads-filter |
| Licencja | CC BY-NC-SA 4.0 – https://creativecommons.org/licenses/by-nc-sa/4.0/ |
| Dodatkowa zgoda na Chrome Web Store | niewymagana – status `not-required` w [`permissions.json`](permissions.json) |

- Polskie Filtry są dystrybuowane w Apex AdBlocker na warunkach CC BY-NC-SA 4.0 (NonCommercial, ShareAlike), z uznaniem autorstwa w `THIRD_PARTY_NOTICES.md` i w zakładce „O wtyczce”;
- projekt nie wymaga dla tej listy osobnego zapisu dodatkowej zgody na dystrybucję w Chrome Web Store, więc `npm run webstore:preflight` / `webstore:prepare` nie zgłasza dla niej blokady.

## Statusy w `permissions.json`

| Status | Znaczenie dla `webstore:preflight` (listy NonCommercial) |
|---|---|
| `not-required` | projekt nie wymaga osobnej zgody dla tego zakresu – bez blokady, bez pliku `record` |
| `granted` + `record` | zgoda autorów zapisana w pliku `record` – bez blokady |
| `granted` bez `record`, `pending`, `declined`, brak wpisu | blokada publikacji |

Lista o nieznanej licencji blokuje publikację niezależnie od rejestru.

## Jak zapisać odpowiedź autorów

1. Zapisz w tym katalogu dokładną treść otrzymanej odpowiedzi (np. `polish-filters-<data>.md`: nadawca, data, kanał, pełny tekst, zakres zgody). Nie parafrazuj i nie dopisuj warunków, których nie ma w odpowiedzi.
2. W `permissions.json` zmień `status` na `granted` (albo `declined`) i ustaw `record` na ścieżkę tego pliku względem katalogu głównego repozytorium.
3. Zaktualizuj ten plik oraz sekcję danej listy w `THIRD_PARTY_NOTICES.md` zgodnie z rzeczywistym zakresem zgody.

Bez kroku 1 nie zmieniaj statusu.
