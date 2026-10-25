// ChromeBlock – popup. Odczyt stanu (popup:get) i akcje: włączenie/wyłączenie ochrony na stronie,
// tryb ochrony (options:setProtectionMode – bez przeładowania karty), „Ukryj element”, ustawienia, diagnostyka.

import { viewModel } from './view-model.js';
import { createModeController } from '../shared/protection-mode-ui.js';

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

  $('focus').hidden = !vm.focus;
  if (vm.focus) renderFocus(vm.focus.enabled);
}

// --- YouTube Focus Mode (tylko na youtube.com) ---
let focusBusy = false;
function renderFocus(enabled) {
  $('focusToggle').setAttribute('aria-checked', String(enabled));
  $('focusToggle').disabled = focusBusy;
}

let info = null;
if (tab) {
  try { info = await chrome.runtime.sendMessage({ type: 'popup:get', tabId: tab.id }); } catch { info = null; }
}
render(info);

// --- tryb ochrony ---
function renderMode(st) {
  const box = $('mode');
  box.dataset.busy = String(st.busy);
  $('modeCurrent').textContent = st.busy ? 'Zmieniam…' : st.label;
  $('modeDesc').textContent = st.short;
  $('modeEdit').hidden = !st.isCustom;
  $('modeErr').hidden = !st.error;
  $('modeErr').textContent = st.error;
  for (const b of $('modeSeg').querySelectorAll('.seg-btn')) {
    const m = b.dataset.mode;
    b.setAttribute('aria-checked', String(!st.busy && m === st.mode));
    b.dataset.pending = String(st.pending === m);
    b.disabled = st.busy;
    b.tabIndex = (m === st.mode || (st.isCustom && m === 'basic')) ? 0 : -1;
  }
}
const modes = createModeController({
  send: (msg) => chrome.runtime.sendMessage(msg),
  initial: info && info.canRun ? info.protectionMode : undefined,
  onChange: renderMode,
});
if (info && info.canRun) {
  renderMode(modes.state);
  $('modeSeg').addEventListener('click', (e) => {
    const b = e.target.closest('.seg-btn');
    if (b) modes.select(b.dataset.mode);
  });
  $('modeSeg').addEventListener('keydown', (e) => {
    const order = ['basic', 'balanced', 'strict'];
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d || modes.state.busy) return;
    e.preventDefault();
    const cur = modes.state.isCustom ? (d > 0 ? -1 : order.length) : order.indexOf(modes.state.mode);
    const next = order[Math.max(0, Math.min(order.length - 1, cur + d))];
    modes.select(next).then(() => $('modeSeg').querySelector(`[data-mode="${modes.state.mode}"]`)?.focus());
  });
  $('modeEdit').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html#lists') });
    window.close();
  });
} else {
  $('mode').hidden = true;
}

$('toggle').addEventListener('click', async () => {
  if (!info || !info.canRun) return;
  $('toggle').disabled = true;
  const res = await chrome.runtime.sendMessage({ type: 'site:toggle', host: info.host, tabId: tab.id }).catch(() => null);
  if (res && res.ok) info = { ...info, disabled: res.disabled, blocked: 0 };
  render(info);
});

$('focusToggle').addEventListener('click', async () => {
  if (focusBusy || !info || !info.youtubeFocus) return;
  const previous = !!info.youtubeFocus.enabled;
  const next = !previous;
  focusBusy = true;
  $('focusErr').hidden = true;
  renderFocus(next);
  let res = null;
  try { res = await chrome.runtime.sendMessage({ type: 'options:setYouTubeFocus', settings: { enabled: next } }); } catch { res = null; }
  focusBusy = false;
  if (res && res.ok) info = { ...info, youtubeFocus: { enabled: !!res.youtubeFocus.enabled } };
  else { $('focusErr').textContent = 'Nie udało się zmienić Focus Mode.'; $('focusErr').hidden = false; }
  renderFocus(!!info.youtubeFocus.enabled);
});

$('focusCustomize').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html#youtube') });
  window.close();
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
