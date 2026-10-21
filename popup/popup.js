const $ = (id) => document.getElementById(id);

const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

function render(info) {
  if (!info || !info.canRun) {
    $('main').hidden = true;
    $('unsupported').hidden = false;
    return;
  }
  $('host').textContent = info.host.replace(/^www\./, '');
  const on = !info.disabled;
  $('power').setAttribute('aria-pressed', String(on));
  $('status').textContent = on ? 'Ochrona włączona' : 'Ochrona wyłączona na tej stronie';
  $('sub').textContent = on ? 'Kliknij, aby wyłączyć na tej stronie' : 'Kliknij, aby ponownie włączyć';
  $('blocked').textContent = info.blocked === null ? '—' : info.blocked.toLocaleString('pl-PL');
  $('picker').disabled = !on;
}

let info = tab ? await chrome.runtime.sendMessage({ type: 'popup:get', tabId: tab.id }) : null;
render(info);

$('power').addEventListener('click', async () => {
  if (!info) return;
  $('power').disabled = true;
  const res = await chrome.runtime.sendMessage({ type: 'site:toggle', host: info.host, tabId: tab.id });
  if (res && res.ok) {
    info = { ...info, disabled: res.disabled, blocked: 0 };
    render(info);
  }
  $('power').disabled = false;
});

$('picker').addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'picker:start', tabId: tab.id });
  window.close();
});

$('settings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});
