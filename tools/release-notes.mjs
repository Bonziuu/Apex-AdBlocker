#!/usr/bin/env node
// Apex AdBlocker – opis wydania na GitHubie (.github/workflows/release.yml).
//
//   node tools/release-notes.mjs v1.2.0 > notes.md
//
// Układ: kafelek, link do pobrania, zrzut porównania, instalacja, „Co nowego” z CHANGELOG.md –
// po polsku, a niżej to samo po angielsku pod nagłówkiem ENG. Obrazki ze store/github/
// przypięte do tagu (opis się nie zmieni, gdy zrzuty zostaną kiedyś wygenerowane na nowo).
// Wyłącznie HTML – odporny na wklejanie i zawsze tak samo renderowany przez GitHub.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REPO = 'Bonziuu/Apex-AdBlocker';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** `kod` i **pogrubienie** z punktów CHANGELOG → HTML (reszta jako zwykły tekst). */
const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

/** Punkty z CHANGELOG.md dla wersji: { pl: [...], en: [...] } (puste, gdy brak sekcji). */
export function changelogFor(version, text = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8')) {
  const start = text.search(new RegExp(`^## ${version.replace(/\./g, '\\.')}\\s*$`, 'm'));
  if (start < 0) return { pl: [], en: [] };
  const rest = text.slice(start).split('\n').slice(1);
  const end = rest.findIndex((l) => /^## /.test(l));
  const section = (end < 0 ? rest : rest.slice(0, end)).join('\n');
  const items = (lang) => {
    const m = new RegExp(`^### ${lang}\\s*\\n([\\s\\S]*?)(?=^### |$(?![\\s\\S]))`, 'm').exec(section);
    return m ? m[1].split('\n').filter((l) => /^[-*] /.test(l)).map((l) => l.slice(2).trim()) : [];
  };
  return { pl: items('PL'), en: items('ENG') };
}

export function releaseNotes(tag, { changes = changelogFor(tag.replace(/^v/, '')) } = {}) {
  const version = tag.replace(/^v/, '');
  const raw = `https://raw.githubusercontent.com/${REPO}/${tag}/store/github`;
  const zip = `Apex-AdBlocker-${version}.zip`;
  const download = `https://github.com/${REPO}/releases/download/${tag}/${zip}`;
  const privacy = `https://github.com/${REPO}/blob/main/PRIVACY.md`;
  const list = (items, fallback) => (items.length
    ? `<ul>\n${items.map((i) => `  <li>${inline(i)}</li>`).join('\n')}\n</ul>`
    : `<p>${fallback}</p>`);
  const part = (L) => `<p align="center"><img src="${raw}/${L.tile}" alt="${L.tileAlt}" width="440"></p>

<p align="center"><a href="${download}"><b>⬇ ${L.download} ${zip}</b></a></p>

<p align="center"><img src="${raw}/${L.shot}" alt="${L.shotAlt}" width="760"></p>

<h3>${L.installTitle}</h3>
<ol>
  <li>${L.step1(zip)}</li>
  <li>${L.step2}</li>
  <li>${L.step3}</li>
</ol>

<h3>${L.newTitle}</h3>
${list(L.items, L.noItems)}

<p>${L.privacy} – <a href="${privacy}">${L.privacyLink}</a>.</p>`;

  const pl = part({
    tile: 'tile-pl.png', tileAlt: 'Apex AdBlocker – blokuje reklamy i śledzenie', download: 'Pobierz',
    shot: 'ads-blocked-pl.png', shotAlt: 'Strona bez rozszerzenia i z Apex AdBlocker',
    installTitle: 'Instalacja',
    step1: (z) => `Pobierz <b>${z}</b> (link powyżej) i rozpakuj w stałym miejscu.`,
    step2: 'Otwórz <code>chrome://extensions</code> i włącz <b>Tryb dewelopera</b>.',
    step3: 'Kliknij <b>Załaduj rozpakowane</b> i wskaż folder <code>Apex-AdBlocker</code>.',
    newTitle: 'Co nowego', items: changes.pl, noItems: 'Poprawki i aktualizacja list filtrów.',
    privacy: 'Bez telemetrii, kont i serwera', privacyLink: 'polityka prywatności',
  });
  const en = part({
    tile: 'tile-en.png', tileAlt: 'Apex AdBlocker – blocks ads and trackers', download: 'Download',
    shot: 'ads-blocked-en.png', shotAlt: 'A page without and with Apex AdBlocker',
    installTitle: 'Installation',
    step1: (z) => `Download <b>${z}</b> (link above) and extract it to a permanent location.`,
    step2: 'Open <code>chrome://extensions</code> and turn on <b>Developer mode</b>.',
    step3: 'Click <b>Load unpacked</b> and select the <code>Apex-AdBlocker</code> folder.',
    newTitle: 'What’s new', items: changes.en, noItems: 'Fixes and filter list updates.',
    privacy: 'No telemetry, accounts or servers', privacyLink: 'privacy policy',
  });
  return `${pl}\n\n<hr>\n\n<h2>ENG</h2>\n\n${en}\n`;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const tag = process.argv[2];
  if (!/^v\d+\.\d+\.\d+$/.test(tag || '')) { console.error('Użycie: node tools/release-notes.mjs vX.Y.Z'); process.exit(2); }
  process.stdout.write(releaseNotes(tag));
}
