// Apex AdBlocker – popup. Controls share a pending state so protection changes
// cannot race with the reload preference. The worker reports whether it reloaded.
import { viewModel } from './view-model.js';
import { t, localizeDocument } from '../shared/i18n.js';

export async function initializePopup({ chrome = globalThis.chrome, document = globalThis.document, window = globalThis.window } = {}) {
  localizeDocument(document);
  const $ = (id) => document.getElementById(id);
  let tab = null;
  let info = null;
  let busy = false;
  let loadFailed = false;
  try { $('version').textContent = chrome.runtime.getManifest().version; } catch { /* */ }

  function message(text = '') {
    $('operationMessage').textContent = text;
    $('operationMessage').hidden = !text;
  }

  function render() {
    const vm = viewModel(info);
    $('main').setAttribute('aria-busy', String(busy));
    $('main').hidden = !vm.supported;
    $('unsupported').hidden = loadFailed || !info || vm.supported;
    $('retry').hidden = !loadFailed;
    $('retry').disabled = busy;
    $('toggle').disabled = busy || loadFailed || !vm.supported;
    $('autoReload').disabled = busy || loadFailed || !vm.supported;
    $('picker').disabled = busy || loadFailed || !vm.pickerEnabled;
    if (!vm.supported) return;
    $('host').textContent = vm.host;
    $('host').title = vm.host;
    $('site').dataset.state = vm.on ? 'on' : 'off';
    $('status').textContent = vm.status;
    $('toggle').setAttribute('aria-checked', String(vm.on));
    $('blocked').textContent = vm.blocked;
    $('blockedLabel').textContent = vm.blockedLabel;
    const autoReload = info.autoReloadOnToggle !== false;
    $('autoReload').checked = autoReload;
    $('toggleHint').textContent = t(autoReload ? 'popup_toggleHintReload' : 'popup_toggleHintNoReload');
    $('problems').hidden = !vm.problems;
    $('problemsText').textContent = vm.problems;
    $('youtube').hidden = !vm.youtube;
    if (vm.youtube) {
      $('youtubeStatus').textContent = vm.youtube.label;
      $('youtubeStatus').dataset.status = vm.youtube.status;
      $('youtube').title = vm.youtube.detail;
    }
  }

  async function refresh() {
    try {
      if (!tab) [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error(t('ui_noActiveTab'));
      const next = await chrome.runtime.sendMessage({ type: 'popup:get', tabId: tab.id });
      if (!next || typeof next.canRun !== 'boolean') throw new Error(next?.error || t('ui_noResponse'));
      info = next;
      loadFailed = false;
      return true;
    } catch (error) {
      loadFailed = true;
      message(t('ui_popupReadFailed', error.message || error));
      return false;
    }
  }

  $('toggle').addEventListener('click', async () => {
    if (busy || loadFailed || !info?.canRun) return;
    busy = true;
    message();
    render();
    try {
      const res = await chrome.runtime.sendMessage({ type: 'site:toggle', host: info.host, tabId: tab.id });
      const current = await refresh();
      if (!current) return;
      if (res?.ok) {
        $('reloadNotice').hidden = res.reloaded === true;
        if (res.reloadError) message(t('ui_reloadFailed', res.reloadError));
      } else {
        const rollback = res?.rolledBack === true ? t('ui_popupRolledBack')
          : res?.rolledBack === false ? t('ui_popupRollbackIncomplete') : '';
        message(t('ui_protectionFailed', [res?.error || t('ui_noResponse'), rollback]));
      }
    } catch (error) {
      const current = await refresh();
      if (current) message(t('ui_protectionUnconfirmed', error.message || error));
    } finally {
      busy = false;
      render();
    }
  });

  $('autoReload').addEventListener('change', async () => {
    if (busy || loadFailed || !info?.canRun) { render(); return; }
    const enabled = $('autoReload').checked;
    busy = true;
    message();
    render();
    try {
      const res = await chrome.runtime.sendMessage({ type: 'popup:setAutoReload', enabled });
      if (!res?.ok) throw new Error(res?.error || t('ui_noResponse'));
      await refresh();
    } catch (error) {
      if (await refresh()) message(t('ui_reloadPreferenceFailed', error.message || error));
    } finally {
      busy = false;
      render();
    }
  });

  $('picker').addEventListener('click', async () => {
    if (busy || loadFailed || !info?.canRun || info.disabled) return;
    try {
      const res = await chrome.runtime.sendMessage({ type: 'picker:start', tabId: tab.id });
      if (!res?.ok) throw new Error(res?.error || t('ui_noResponse'));
      window.close();
    } catch (error) { message(t('ui_pickerStartFailed', error.message || error)); }
  });
  $('settings').addEventListener('click', () => { chrome.runtime.openOptionsPage(); window.close(); });
  $('problems').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html#diag') });
    window.close();
  });
  async function reloadState() {
    if (busy) return;
    busy = true;
    message();
    render();
    try { await refresh(); } finally { busy = false; render(); }
  }
  $('retry').addEventListener('click', reloadState);
  await reloadState();
}

if (globalThis.document && globalThis.chrome) await initializePopup();
