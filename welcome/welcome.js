// ChromeBlock – strona powitalna (tylko po świeżej instalacji). Ochrona działa od razu
// (stały zestaw list) – strona tylko informuje. Bez telemetrii i bez zapisywania danych.

const $ = (id) => document.getElementById(id);

async function closeTab() {
  try {
    const tab = await chrome.tabs.getCurrent();
    if (tab && tab.id !== undefined) { await chrome.tabs.remove(tab.id); return; }
  } catch { /* */ }
  window.close();
}

$('start').addEventListener('click', closeTab);
$('openOptions').addEventListener('click', () => { chrome.runtime.openOptionsPage(); });
