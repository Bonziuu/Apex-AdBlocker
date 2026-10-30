#!/usr/bin/env node
// Apex AdBlocker – opis Pull Requesta z cotygodniowej aktualizacji list filtrów
// (.github/workflows/update-lists.yml). Pierwsza linia to tytuł PR.
//
//   node tools/update-lists-pr.mjs <katalog z update.log, build.log, check.log>
//
// Kody wyjścia kroków: LISTS_CODE, BUILD_CODE, CHECK_CODE (zmienne środowiskowe).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const read = (dir, name) => { try { return fs.readFileSync(path.join(dir, name), 'utf8'); } catch { return ''; } };
const fmt = (n) => Number(n || 0).toLocaleString('pl-PL');

/** Liczby reguł i filtrów per lista (data/lists.json). */
function listStats(json) {
  try { return Object.fromEntries(JSON.parse(json).map((l) => [l.id, l])); } catch { return {}; }
}

/** Wiersze tabeli „przed → po” dla każdej listy. */
export function statsTable(beforeJson, afterJson) {
  const before = listStats(beforeJson);
  const after = listStats(afterJson);
  const delta = (a, b) => { const d = (b || 0) - (a || 0); return d === 0 ? '' : ` (${d > 0 ? '+' : ''}${fmt(d)})`; };
  const rows = Object.keys(after).map((id) => {
    // brak danych „przed” (nowa lista albo brak historii) – same liczby, bez różnic
    const a = before[id] || after[id];
    const b = after[id];
    return `| ${b.name} | ${fmt(b.networkRules)}${delta(a.networkRules, b.networkRules)} | ${fmt(b.cosmeticFilters)}${delta(a.cosmeticFilters, b.cosmeticFilters)} | ${fmt(b.scriptletFilters)}${delta(a.scriptletFilters, b.scriptletFilters)} |`;
  });
  return ['| Lista | Reguły sieciowe | Filtry kosmetyczne | Scriptlety |', '|---|---|---|---|', ...rows].join('\n');
}

/** Fragment logu między znacznikami (ostatnie linie, bez kodów ANSI). */
const tail = (text, n) => text.replace(/\x1b\[[0-9;]*m/g, '').trim().split('\n').slice(-n).join('\n');

export function prBody({ dir, codes, date = new Date(), beforeJson, afterJson }) {
  const update = read(dir, 'update.log');
  const check = read(dir, 'check.log');
  const ok = (c) => c === '0';
  const listsLine = ok(codes.lists)
    ? '✅ Listy pobrane'
    : codes.lists === '2'
      ? '⚠️ Listy pobrane, ale pojawiły się **nowe nieobsługiwane scriptlety YouTube** (szczegóły niżej)'
      : `⚠️ Pobieranie zakończone kodem ${codes.lists}`;
  const failedDownloads = update.split('\n').filter((l) => l.startsWith('✗')).map((l) => `- ${l.slice(2)}`);
  const youtube = update.includes('YouTube filters changed') ? tail(update.slice(update.indexOf('YouTube filters changed')), 40) : 'Filtry YouTube bez zmian.';
  const allOk = ok(codes.build) && ok(codes.check);
  const day = date.toISOString().slice(0, 10);
  return `# Aktualizacja list filtrów (${day})${allOk ? '' : ' – wymaga sprawdzenia'}

Automatyczna cotygodniowa aktualizacja list filtrów. **Przejrzyj i zatwierdź**, aby trafiła do kolejnego wydania.

| Krok | Wynik |
|---|---|
| Pobranie list | ${listsLine} |
| Build reguł | ${ok(codes.build) ? '✅ OK' : `❌ błąd (kod ${codes.build})`} |
| Pełna kontrola (\`npm run check\`) | ${ok(codes.check) ? '✅ wszystkie kontrole i testy przeszły' : `❌ błąd (kod ${codes.check}) – zobacz log niżej`} |
${failedDownloads.length ? `\n**Nie udało się pobrać** (zostały poprzednie wersje):\n${failedDownloads.join('\n')}\n` : ''}
## Listy po aktualizacji

${statsTable(beforeJson, afterJson)}

## Filtry YouTube

\`\`\`
${youtube}
\`\`\`
${allOk ? '' : `
## Log kontroli (koniec)

\`\`\`
${tail(check, 60)}
\`\`\`
`}
---
*Po zatwierdzeniu: listy wejdą do kolejnego wydania (podbij wersję w \`manifest.json\` i utwórz tag \`vX.Y.Z\`).*
`;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const dir = process.argv[2] || '.';
  let beforeJson = '';
  try { beforeJson = execFileSync('git', ['show', 'HEAD:data/lists.json'], { cwd: ROOT, encoding: 'utf8' }); } catch { /* */ }
  const afterJson = fs.readFileSync(path.join(ROOT, 'data', 'lists.json'), 'utf8');
  process.stdout.write(prBody({
    dir,
    codes: { lists: process.env.LISTS_CODE || '0', build: process.env.BUILD_CODE || '0', check: process.env.CHECK_CODE || '0' },
    beforeJson,
    afterJson,
  }));
}
