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

// ------------------------------------------------------------- diagnostyka

const STATUS_PL = { ok: 'OK', warning: 'ostrzeżenie', error: 'BŁĄD', unknown: 'nieznany', disabled: 'wyłączone', healthy: 'sprawny', degraded: 'problem' };
const COMPONENT_PL = { network: 'Silnik sieciowy (DNR)', cosmetic: 'Silnik kosmetyczny', scriptlets: 'Silnik scriptletów', filters: 'Listy filtrów', youtube: 'YouTube Protection' };
const SYNC_PL = { rulesets: 'syncRulesets()', dynamicRules: 'syncDynamicRules()', scriptlets: 'syncScriptlets()' };
const time = (t) => (t ? new Date(t).toLocaleString('pl-PL') : '—');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const badge = (st) => `<span class="status ${esc(st)}">${esc(STATUS_PL[st] || st)}</span>`;

async function renderDiag() {
  const h = await send({ type: 'health:get' });
  if (!h) return;
  $('components').innerHTML = '<tr><th>Komponent</th><th>Status</th><th>Szczegóły</th><th>Aktualizacja</th></tr>'
    + Object.entries(h.components).map(([k, v]) => `<tr><td>${esc(COMPONENT_PL[k] || k)}</td><td>${badge(v.status)}</td><td>${esc(v.detail)}</td><td>${time(v.updatedAt)}</td></tr>`).join('');
  $('sync').innerHTML = '<tr><th>Krok</th><th>Wynik</th><th>Komunikat</th><th>Czas</th></tr>'
    + Object.entries(h.sync).map(([k, v]) => `<tr><td class="mono">${esc(SYNC_PL[k] || k)}</td><td>${badge(v.status)}</td><td>${esc(v.message)}</td><td>${time(v.at)}</td></tr>`).join('');

  const y = h.youtube;
  if (y) {
    const c = y.compat;
    const lines = [];
    lines.push(`<p>Status: ${badge(y.status)}</p><ul>`);
    for (const ch of y.checks) lines.push(`<li>${ch.ok ? '✓' : '✗'} ${esc(ch.message)}</li>`);
    lines.push('</ul>');
    if (c) {
      lines.push(`<p>Krytyczne reguły YouTube (scriptlety): <b>${c.total}</b> · obsługiwane: <b>${c.supported}</b> · nieobsługiwane: <b>${c.partial + c.unsupported}</b></p>`);
      const gaps = [...(c.knownGaps || []), ...(c.newGaps || [])];
      if (gaps.length) {
        lines.push('<p>Niewykonywane reguły:</p><ul>');
        for (const g of gaps) lines.push(`<li><b>${esc(g.scriptlet)}</b>: ${esc(g.reason)}<br><span class="mono">${esc(g.filter.slice(0, 220))}</span></li>`);
        lines.push('</ul>');
      }
    }
    if (y.player) lines.push(`<p>Ostatni stan odtwarzacza (${esc(y.player.page || '?')}): ${badge(y.player.status)} ${esc((y.player.reasons || []).join(', '))} · ${time(y.player.at)}</p>`);
    else lines.push('<p class="muted">Brak raportu odtwarzacza – otwórz film na YouTube.</p>');
    $('youtube').innerHTML = lines.join('');
  }

  const sc = h.scriptletCompat;
  $('scriptletCompat').innerHTML = sc
    ? `Filtry scriptletów w listach: ${fmt(sc.summary.total)} · w pełni obsługiwane: ${fmt(sc.summary.supported)} · częściowo (niewykonywane): ${fmt(sc.summary.partial)} · nieobsługiwane: ${fmt(sc.summary.unsupported)}`
    : 'Brak danych (uruchom build).';

  $('errors').innerHTML = h.errors.length
    ? '<tr><th>Czas</th><th>Komponent</th><th>Komunikat</th></tr>' + h.errors.slice().reverse().map((e) => `<tr><td>${time(e.timestamp)}</td><td>${esc(COMPONENT_PL[e.component] || e.component)}</td><td>${esc(e.message)}</td></tr>`).join('')
    : '<tr><td class="muted">Brak błędów.</td></tr>';

  $('devPerf').checked = h.devPerf;
  $('perf').innerHTML = h.devPerf && h.perf.length
    ? '<tr><th>Czas</th><th>Host</th><th>Partie mutacji</th><th>Ogólne [ms]</th><th>Proceduralne [ms] / uruchomień</th><th>Selektory</th></tr>'
      + h.perf.map((p) => `<tr><td>${time(p.at)}</td><td class="mono">${esc(p.host)}${p.frame ? ` (ramka ${p.frame})` : ''}</td><td>${p.stats.mutationBatches}</td><td>${p.stats.genericMs}</td><td>${p.stats.proceduralMs} / ${p.stats.proceduralRuns}</td><td>${p.stats.selectorsApplied}</td></tr>`).join('')
    : `<tr><td class="muted">${h.devPerf ? 'Brak pomiarów – przeładuj kilka stron.' : 'Pomiary wyłączone.'}</td></tr>`;
}

$('refreshDiag').addEventListener('click', renderDiag);
$('resync').addEventListener('click', async () => {
  $('resync').disabled = true;
  const r = await send({ type: 'health:resync' });
  $('resync').disabled = false;
  flash($('diagMsg'), r && r.ok ? 'Synchronizacja zakończona' : 'Synchronizacja zakończona z błędami – zobacz tabelę', r && r.ok ? 'ok' : 'err');
  renderDiag();
});
$('clearErrors').addEventListener('click', async () => { await send({ type: 'health:clearErrors' }); renderDiag(); });
$('devPerf').addEventListener('change', async () => { await send({ type: 'options:setDevPerf', enabled: $('devPerf').checked }); renderDiag(); });
document.querySelector('.tab[data-tab="diag"]').addEventListener('click', renderDiag);
if (initial === 'diag') renderDiag();
