# Licencje list filtrów – stan zgód

Ten katalog zapisuje stan **dodatkowych zgód** autorów list filtrów. Nie zawiera ani nie zastępuje odpowiedzi autorów i nie jest opinią prawną.

Mapa „plik wynikowy → źródła → licencja” jest w [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md), szczegóły wersji i hashe snapshotów w [`docs/filter-provenance.md`](../filter-provenance.md), zakres licencji kodu Apex w [`LICENSING.md`](../../LICENSING.md).

## Polskie Filtry (`pl`)

| | |
|---|---|
| Lista Apex AdBlocker | `pl` (osobny ruleset i osobne pliki, bez danych GPL) |
| Upstream | Oficjalne Polskie Filtry, © Certyficate IT i współtwórcy – https://github.com/MajkiIT/polish-ads-filter |
| Licencja | CC BY-NC-SA 4.0 – https://creativecommons.org/licenses/by-nc-sa/4.0/ |
| Prośba o dodatkową zgodę | wysłana przez autora Apex AdBlocker; odpowiedź nie została jeszcze otrzymana |

**TODO:** Additional distribution permission for Chrome Web Store: pending upstream response.

Do czasu odpowiedzi:

- Polskie Filtry są dystrybuowane w Apex AdBlocker wyłącznie na warunkach CC BY-NC-SA 4.0;
- [`permissions.json`](permissions.json) ma status `pending`, a `npm run webstore:preflight` / `webstore:prepare` zgłasza to jako blokadę publikacji w Chrome Web Store.

## Jak zapisać odpowiedź autorów

1. Zapisz w tym katalogu dokładną treść otrzymanej odpowiedzi (np. `polish-filters-<data>.md`: nadawca, data, kanał, pełny tekst, zakres zgody). Nie parafrazuj i nie dopisuj warunków, których nie ma w odpowiedzi.
2. W `permissions.json` zmień `status` na `granted` (albo `declined`) i ustaw `record` na ścieżkę tego pliku względem katalogu głównego repozytorium.
3. Zaktualizuj ten plik oraz sekcję Polskich Filtrów w `THIRD_PARTY_NOTICES.md` zgodnie z rzeczywistym zakresem zgody.

Bez kroku 1 nie zmieniaj statusu.
