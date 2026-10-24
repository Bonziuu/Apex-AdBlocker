// ChromeBlock – popup. Tylko odczyt stanu (popup:get) i dotychczasowe akcje:
// włączenie/wyłączenie ochrony na stronie, „Ukryj element”, ustawienia, diagnostyka.

import { viewModel } from './view-model.js';

const $ = (id) => document.getElementById(id);

try { $('version').textContent = chrome.runtime.getManifest().version_name || chrome.runtime.getManifest().version; } catch { /* */ }

const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

function render(info) {
  const vm = viewModel(info);
  $('main').setAttribute('aria-busy', 'false');
  if (!vm.supported) {
    $('main').hidden = true;
    $('unsupported').hidden = false;
    $('picker').disabled = true;
    return;
  }
  $('host').textContent = vm.host;
  $('host').title = vm.host;
  $('site').dataset.state = vm.on ? 'on' : 'off';
  $('status').textContent = vm.status;
  $('toggle').setAttribute('aria-checked', String(vm.on));
  $('toggle').disabled = false;
  $('blocked').textContent = vm.blocked;
  $('blockedLabel').textContent = vm.blockedLabel;
  $('picker').disabled = !vm.pickerEnabled;

  $('problems').hidden = !vm.problems;
  $('problemsText').textContent = vm.problems;

  $('youtube').hidden = !vm.youtube;
  if (vm.youtube) {
    const pill = $('youtubeStatus');
    pill.textContent = vm.youtube.label;
    pill.dataset.status = vm.youtube.status;
    $('youtube').title = vm.youtube.detail;
  }
}

let info = null;
if (tab) {
  try { info = await chrome.runtime.sendMessage({ type: 'popup:get', tabId: tab.id }); } catch { info = null; }
}
render(info);

$('toggle').addEventListener('click', async () => {
  if (!info || !info.canRun) return;
  $('toggle').disabled = true;
  const res = await chrome.runtime.sendMessage({ type: 'site:toggle', host: info.host, tabId: tab.id }).catch(() => null);
  if (res && res.ok) info = { ...info, disabled: res.disabled, blocked: 0 };
  render(info);
});

$('picker').addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'picker:start', tabId: tab.id });
  window.close();
});

$('settings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});

$('problems').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html#diag') });
  window.close();
});
