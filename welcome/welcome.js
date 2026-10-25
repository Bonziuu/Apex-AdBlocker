// ChromeBlock – strona powitalna (tylko po świeżej instalacji).
// Wybór trybu stosowany przez istniejącą ścieżkę: options:setProtectionMode (presety z shared/protection-modes.js).
// Bez telemetrii i bez zapisywania dodatkowych danych.

import { WELCOME_DEFAULT, welcomeOptions, welcomeResult } from './welcome-model.js';

const $ = (id) => document.getElementById(id);

const box = $('modes');
for (const o of welcomeOptions(WELCOME_DEFAULT)) {
  const label = document.createElement('label');
  label.className = 'mode';
  label.innerHTML = '<input type="radio" name="mode"><div><div class="name"></div><div class="desc"></div></div>';
  const input = label.querySelector('input');
  input.value = o.mode;
  input.checked = o.checked;
  label.querySelector('.name').textContent = o.label;
  label.querySelector('.desc').textContent = o.desc;
  box.appendChild(label);
}

const setBusy = (busy) => {
  $('start').disabled = busy;
  for (const i of box.querySelectorAll('input')) i.disabled = busy;
};

function showStatus(text, ok) {
  const s = $('status');
  s.textContent = text;
  s.className = `status ${ok ? 'ok' : 'err'}`;
  s.hidden = false;
}

async function closeTab() {
  try {
    const tab = await chrome.tabs.getCurrent();
    if (tab && tab.id !== undefined) { await chrome.tabs.remove(tab.id); return; }
  } catch { /* */ }
  window.close();
}

$('start').addEventListener('click', async () => {
  const mode = (box.querySelector('input:checked') || {}).value || WELCOME_DEFAULT;
  setBusy(true);
  $('status').hidden = true;
  let res;
  try { res = await chrome.runtime.sendMessage({ type: 'options:setProtectionMode', mode }); } catch (e) { res = { ok: false, error: String((e && e.message) || e) }; }
  const r = welcomeResult(res, mode);
  showStatus(r.message, r.done);
  if (r.close) setTimeout(closeTab, 1500);
  else setBusy(false);
});

$('openOptions').addEventListener('click', () => { chrome.runtime.openOptionsPage(); });
