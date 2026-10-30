# Synchronizacja wydania 1.0.0 z paczką przekazaną do Chrome Web Store

Punkt odniesienia: ZIP udostępniony autorowi w tej rozmowie, commit
`eb6657b1fb0c47186cc7a954bdadfea1570a4119`, SHA-256:
`f58affb6dc6f3bbaa866ac5a81cf923ba106eb92e029b66da9b3980358589588`.
Nie pobierano paczki z panelu Chrome Web Store; sprawdzenie dotyczy pliku
przekazanego do uploadu, który autor następnie zgłosił jako wersję 1.0.0.

## Wynik porównania istniejącego wydania GitHuba

Oba dotychczasowe ZIP-y z release v1.0.0 mają identyczną zawartość i hash
`c388abe51cef5100d28e8a6475ff1312471cdf7121f3b501f92512a106c96a0d`.
Zawierają 107 plików rozszerzenia; względem paczki CWS brakuje 10 plików,
1 plik jest dodatkowy, a 63 mają inną zawartość. Szczegóły:
`comparison-before.json`.

## Przygotowane załączniki

- `Apex-AdBlocker-1.0.0.zip` i `Apex-AdBlocker.zip`: dla ręcznej instalacji,
  folder Apex-AdBlocker/ oraz START-HERE.txt. Każdy ze 116 plików rozszerzenia
  jest identyczny z referencyjną paczką CWS.
- `Apex-AdBlocker-WebStore-1.0.0.zip`: dokładna kopia paczki przekazanej do CWS.
- `Apex-AdBlocker-Source-1.0.0.zip`: źródła wyeksportowane przez git archive
  z commita eb6657b (z uwzględnieniem .gitattributes).
- `SHA256SUMS.txt`: sumy wszystkich czterech ZIP-ów.

Zestaw przygotowano i zweryfikowano lokalnie. Zapisanie go na gałęzi NIE
aktualizuje automatycznie załączników release. Próba odczytu release przez
GitHub API została zablokowana przez politykę sieciową środowiska; wymagane
hosty api.github.com oraz uploads.github.com dodano do szkicu konfiguracji,
ale trzeba zastosować zmiany w środowisku przed podmianą assetów.

Nie przesunięto tagu v1.0.0. Automatyczne archiwa „Source code” GitHuba nadal
wskazują wcześniejszy tag; odpowiadające przygotowanym paczkom źródła są
w osobnym ZIP-ie i powyższym commicie. Przy aktualizacji release należy
zachować stary opis i dopisać tę informację o źródłach oraz synchronizacji.

Jest to synchronizacja istniejącej wersji, a nie potwierdzenie zaliczenia
brakujących testów przeglądarkowych lub rozstrzygnięcia licencji filtrów.
