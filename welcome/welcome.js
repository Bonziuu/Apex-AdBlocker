// Apex AdBlocker – strona powitalna (tylko po świeżej instalacji). Ochrona działa od razu
// (stały zestaw list) – strona tylko informuje. Bez telemetrii i bez zapisywania danych.

import { localizeDocument } from '../shared/i18n.js';

const $ = (id) => document.getElementById(id);

localizeDocument();

async function closeTab() {
  try {
    const tab = await chrome.tabs.getCurrent();
    if (tab && tab.id !== undefined) { await chrome.tabs.remove(tab.id); return; }
  } catch { /* */ }
  window.close();
}

$('start').addEventListener('click', closeTab);
$('openOptions').addEventListener('click', () => { chrome.runtime.openOptionsPage(); });
