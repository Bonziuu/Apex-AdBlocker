const $ = (id) => document.getElementById(id);
const send = (msg) => chrome.runtime.sendMessage(msg);
const fmt = (n) => Number(n || 0).toLocaleString('pl-PL');

// zakładki
for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => {
    for (const t of document.querySelectorAll('.tab')) t.setAttribute('aria-selected', String(t === tab));
    for (const p of document.querySelectorAll('.panel')) p.hidden = p.id !== tab.dataset.tab;
    history.replaceState(null, '', '#' + tab.dataset.tab);
  });
}
const initial = location.hash.slice(1);
if (initial) document.querySelector(`.tab[data-tab="${initial}"]`)?.click();

let data = await send({ type: 'options:get' });

function renderLists() {
  const box = $('listContainer');
  box.textContent = '';
  for (const l of data.lists) {
    const card = document.createElement('label');
    card.className = 'card';
    card.innerHTML = `
      <div class="text">
        <div class="name"></div>
        <div class="desc"></div>
        <div class="count"></div>
      </div>
      <span class="switch"><input type="checkbox"><span></span></span>`;
    card.querySelector('.name').textContent = l.name;
    card.querySelector('.desc').textContent = l.desc;
    card.querySelector('.count').textContent =
      `${fmt(l.networkFilters)} filtrów sieciowych · ${fmt(l.cosmeticFilters)} kosmetycznych i scriptletów`;
    const input = card.querySelector('input');
    input.checked = l.enabled;
    input.addEventListener('change', async () => {
      const enabled = data.lists.filter((x) => (x.id === l.id ? input.checked : x.enabled)).map((x) => x.id);
      for (const i of box.querySelectorAll('input')) i.disabled = true;
      const res = await send({ type: 'options:setLists', enabledLists: enabled });
      data = await send({ type: 'options:get' });
      renderLists();
      const msg = $('listMsg');
      if (res && !res.ok) { msg.textContent = res.error; msg.hidden = false; } else msg.hidden = true;
    });
    box.appendChild(card);
  }
}

function renderErrors(errors) {
  const ul = $('filterErrors');
  ul.textContent = '';
  for (const e of errors || []) {
    const li = document.createElement('li');
    li.innerHTML = `Linia ${e.line}: <code></code> – <span></span>`;
    li.querySelector('code').textContent = e.text;
    li.querySelector('span').textContent = e.reason;
    ul.appendChild(li);
  }
}

function flash(el, text, cls) {
  el.textContent = text;
  el.className = 'msg-inline ' + (cls || '');
}

function renderAll() {
  $('version').textContent = data.version;
  renderLists();
  $('userFilters').value = data.userFilters;
  renderErrors(data.userErrors);
  $('disabledSites').value = data.disabledSites.join('\n');
  const enabled = data.lists.filter((l) => l.enabled);
  $('stats').textContent = `Aktywne: ${fmt(enabled.reduce((n, l) => n + l.networkFilters, 0))} filtrów sieciowych, `
    + `${fmt(enabled.reduce((n, l) => n + l.cosmeticFilters, 0))} kosmetycznych i scriptletów, `
    + `${fmt(data.userCount)} własnych.`;
}
renderAll();

$('saveFilters').addEventListener('click', async () => {
  $('saveFilters').disabled = true;
  const res = await send({ type: 'options:setUserFilters', text: $('userFilters').value });
  $('saveFilters').disabled = false;
  renderErrors(res.errors);
  if (res.ok) flash($('filtersMsg'), `Zapisano · aktywnych filtrów: ${fmt(res.count)}`, 'ok');
  else flash($('filtersMsg'), 'Błąd: ' + res.error, 'err');
});

$('saveSites').addEventListener('click', async () => {
  $('saveSites').disabled = true;
  const sites = $('disabledSites').value.split(/[\s,]+/).filter(Boolean)
    .map((s) => { try { return new URL(s.includes('://') ? s : 'http://' + s).hostname; } catch { return s; } });
  const res = await send({ type: 'options:setDisabledSites', sites });
  $('saveSites').disabled = false;
  if (res.ok) {
    $('disabledSites').value = res.disabledSites.join('\n');
    flash($('sitesMsg'), 'Zapisano', 'ok');
  } else flash($('sitesMsg'), 'Błąd: ' + res.error, 'err');
});

// Ctrl+S zapisuje bieżącą zakładkę
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (!$('filters').hidden) $('saveFilters').click();
    if (!$('sites').hidden) $('saveSites').click();
  }
});
