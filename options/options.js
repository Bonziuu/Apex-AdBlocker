import { PRESETS, MODE_LABEL, MODE_CONTENTS, MODE_ERROR, modeDisplay } from '../shared/protection-mode-ui.js';
import { FOCUS_OPTIONS, FOCUS_LABELS, FOCUS_DESCRIPTIONS, normalizeFocus } from '../shared/youtube-focus.js';
import { importFailureMessage } from '../shared/settings-backup.js';

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

// jedna zmiana list / trybu naraz – blokada całej sekcji na czas operacji
let listsBusy = false;
function lockLists(on) {
  listsBusy = on;
  for (const i of $('lists').querySelectorAll('input')) i.disabled = on;
  $('lists').setAttribute('aria-busy', String(on));
}

function renderMode(pendingMode = null) {
  const box = $('modeCards');
  const current = modeDisplay(data.protectionMode);
  box.textContent = '';
  for (const m of PRESETS) {
    const card = document.createElement('label');
    card.className = 'card mode-card';
    card.dataset.mode = m;
    card.innerHTML = `
      <input type="radio" name="protectionMode">
      <div class="text">
        <div class="name"></div>
        <div class="desc"></div>
      </div>
      <span class="mode-state" aria-hidden="true"></span>`;
    card.querySelector('.name').textContent = MODE_LABEL[m];
    card.querySelector('.desc').textContent = MODE_CONTENTS[m];
    const input = card.querySelector('input');
    input.value = m;
    input.checked = m === current.mode;
    input.disabled = listsBusy;
    if (pendingMode === m) card.querySelector('.mode-state').textContent = 'Zmieniam…';
    input.addEventListener('change', () => { if (input.checked) setMode(m); });
    box.appendChild(card);
  }
  $('modeCustom').hidden = !current.isCustom;
}

async function setMode(mode) {
  if (listsBusy) return;
  const previous = data.protectionMode;
  lockLists(true);
  renderMode(mode);
  let res;
  try { res = await send({ type: 'options:setProtectionMode', mode }); } catch (e) { res = { ok: false, error: String(e) }; }
  try { data = await send({ type: 'options:get' }); } catch { data = { ...data, protectionMode: previous }; }
  lockLists(false);
  renderMode();
  renderLists();
  const msg = $('modeMsg');
  if (res && res.ok) msg.hidden = true;
  else { msg.textContent = MODE_ERROR + (res && res.error ? ` (${res.error})` : ''); msg.hidden = false; }
}

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
    input.disabled = listsBusy;
    input.addEventListener('change', async () => {
      if (listsBusy) return;
      const enabled = data.lists.filter((x) => (x.id === l.id ? input.checked : x.enabled)).map((x) => x.id);
      lockLists(true);
      const res = await send({ type: 'options:setLists', enabledLists: enabled }).catch((e) => ({ ok: false, error: String(e) }));
      data = await send({ type: 'options:get' });
      lockLists(false);
      renderMode();
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

// --- YouTube Focus Mode -----------------------------------------------------
let focusBusy = false;

function renderFocus() {
  const f = normalizeFocus(data.youtubeFocus);
  $('focusEnabled').checked = f.enabled;
  $('focusEnabled').disabled = focusBusy;
  const box = $('focusOptions');
  box.classList.toggle('focus-off', !f.enabled);
  box.textContent = '';
  for (const key of FOCUS_OPTIONS) {
    const card = document.createElement('label');
    card.className = 'card';
    card.innerHTML = `
      <div class="text">
        <div class="name"></div>
        <div class="desc"></div>
      </div>
      <span class="switch"><input type="checkbox"><span></span></span>`;
    card.querySelector('.name').textContent = FOCUS_LABELS[key];
    card.querySelector('.desc').textContent = FOCUS_DESCRIPTIONS[key] + (f.enabled ? '' : ' Zadziała po włączeniu Focus Mode.');
    const input = card.querySelector('input');
    input.dataset.key = key;
    input.checked = f[key];
    input.disabled = focusBusy;
    input.addEventListener('change', () => setFocus({ [key]: input.checked }));
    box.appendChild(card);
  }
}

async function setFocus(patch) {
  if (focusBusy) return;
  const previous = normalizeFocus(data.youtubeFocus);
  focusBusy = true;
  data.youtubeFocus = { ...previous, ...patch };
  renderFocus();
  let res;
  try { res = await send({ type: 'options:setYouTubeFocus', settings: patch }); } catch (e) { res = { ok: false, error: String(e) }; }
  focusBusy = false;
  const msg = $('focusMsg');
  if (res && res.ok) { data.youtubeFocus = res.youtubeFocus; msg.hidden = true; }
  else { data.youtubeFocus = previous; msg.textContent = `Nie udało się zapisać ustawień Focus Mode${res && res.error ? ` (${res.error})` : ''}.`; msg.hidden = false; }
  renderFocus();
}

$('focusEnabled').addEventListener('change', () => setFocus({ enabled: $('focusEnabled').checked }));

// --- Kopia ustawień ------------------------------------------------------------
$('exportSettings').addEventListener('click', async () => {
  const r = await send({ type: 'settings:export' }).catch(() => null);
  if (!r || !r.ok) { flash($('backupMsg'), 'Nie udało się przygotować kopii', 'err'); return; }
  const blob = new Blob([JSON.stringify(r.backup, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = r.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  flash($('backupMsg'), `Zapisano plik ${r.fileName}`, 'ok');
});

$('importSettings').addEventListener('click', () => { $('importFile').value = ''; $('importFile').click(); });

$('importFile').addEventListener('change', async () => {
  const file = $('importFile').files && $('importFile').files[0];
  if (!file) return;
  $('importSummary').hidden = true;
  $('importErrors').hidden = true;
  if (file.size > 2 * 1024 * 1024) { showImportErrors({ ok: false, errors: ['plik jest za duży (maks. 2 MB)'] }); return; }
  $('importSettings').disabled = true;
  $('exportSettings').disabled = true;
  flash($('backupMsg'), 'Importowanie…', '');
  let r;
  try { r = await send({ type: 'settings:import', text: await file.text() }); } catch (e) { r = { ok: false, errors: [String(e)] }; }
  $('importSettings').disabled = false;
  $('exportSettings').disabled = false;
  if (r && r.ok) {
    data = await send({ type: 'options:get' });
    renderAll();
    const ul = $('importSummaryList');
    ul.textContent = '';
    for (const line of r.summary) { const li = document.createElement('li'); li.textContent = line; ul.appendChild(li); }
    $('importSummary').hidden = false;
    flash($('backupMsg'), 'Ustawienia przywrócone', 'ok');
  } else {
    showImportErrors(r);
  }
});

function showImportErrors(result) {
  const m = importFailureMessage(result);
  const box = $('importErrors');
  box.textContent = '';
  const title = document.createElement('div');
  title.className = 'import-title';
  title.textContent = m.title;
  box.appendChild(title);
  const ul = document.createElement('ul');
  for (const e of m.items) { const li = document.createElement('li'); li.textContent = e; ul.appendChild(li); }
  box.appendChild(ul);
  if (m.diagnostics) {
    const b = document.createElement('button');
    b.className = 'secondary';
    b.id = 'openDiag';
    b.textContent = 'Otwórz Diagnostykę';
    b.addEventListener('click', () => document.querySelector('.tab[data-tab="diag"]').click());
    box.appendChild(b);
  }
  box.hidden = false;
  flash($('backupMsg'), '', '');
}

function renderAll() {
  $('version').textContent = data.version;
  renderMode();
  renderLists();
  renderFocus();
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

  const st = h.startupProfile;
  $('startupProfile').innerHTML = st && st.totalMs !== null
    ? `<tr><th>Etap</th><th>Czas [ms]</th><th>Wywołania</th></tr><tr><td><b>Startup total</b> <span class="muted">(${esc(st.reason)})</span></td><td><b>${fmt(Math.round(st.totalMs))}</b></td><td></td></tr>`
      + Object.entries(st.marks || {}).map(([k, v]) => `<tr><td class="muted">${esc(k)}</td><td class="muted">po ${fmt(Math.round(v))}</td><td></td></tr>`).join('')
      + st.stages.slice().sort((a, b) => b.totalMs - a.totalMs).map((x) => `<tr><td class="mono">${esc(x.name)}</td><td>${fmt(Math.round(x.totalMs))}</td><td>${x.count}</td></tr>`).join('')
    : '<tr><td class="muted">Brak pomiaru – pojawi się po instalacji, aktualizacji lub przeładowaniu rozszerzenia.</td></tr>';

  const sp = h.scriptletPerf || [];
  const ms = (v) => v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  $('scriptletPerf').innerHTML = h.devPerf && sp.length
    ? '<tr><th>Scriptlet</th><th>Przechwycona funkcja</th><th>Wywołania</th><th>Łącznie [ms]</th><th>Średnio [ms]</th><th>Maks. [ms]</th></tr>'
      + sp.map((r) => `<tr><td class="mono">${esc(r.scriptlet)}</td><td class="mono">${esc(r.target)}</td><td>${fmt(r.calls)}</td><td>${ms(r.totalMs)}</td><td>${ms(r.avgMs)}</td><td>${ms(r.maxMs)}</td></tr>`).join('')
    : `<tr><td class="muted">${h.devPerf ? 'Brak pomiarów scriptletów – przeładuj kartę (np. YouTube) i odtwórz film.' : 'Pomiary wyłączone.'}</td></tr>`;
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
$('resetPerf').addEventListener('click', async () => { await send({ type: 'perf:reset' }); flash($('diagMsg'), 'Pomiary wyzerowane', 'ok'); renderDiag(); });
document.querySelector('.tab[data-tab="diag"]').addEventListener('click', renderDiag);
if (initial === 'diag') renderDiag();

$('copyReport').addEventListener('click', async () => {
  const r = await send({ type: 'diagnostics:export' });
  if (!r || !r.text) { flash($('diagMsg'), 'Nie udało się zbudować raportu', 'err'); return; }
  const preview = $('reportPreview');
  preview.value = r.text;
  preview.hidden = false;
  try {
    await navigator.clipboard.writeText(r.text);
    flash($('diagMsg'), 'Raport skopiowany do schowka (nic nie zostało wysłane)', 'ok');
  } catch {
    preview.select();
    flash($('diagMsg'), 'Zaznaczono raport – skopiuj go ręcznie (Ctrl+C)', '');
  }
});
