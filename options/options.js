import { importFailureMessage } from '../shared/settings-backup.js';
import { resolveRoute, MORE_SECTIONS } from './routing.js';
import { t, tPlural, localizeDocument, numberLocale } from '../shared/i18n.js';

const $ = (id) => document.getElementById(id);
const send = (msg) => chrome.runtime.sendMessage(msg);
const fmt = (n) => Number(n || 0).toLocaleString(numberLocale());

localizeDocument();

// zakładki: Ochrona, Moje filtry, Wyłączone strony, Więcej (z sekcjami backup / diag / about)
function selectTab(id) {
  for (const t of document.querySelectorAll('.tab')) t.setAttribute('aria-selected', String(t.dataset.tab === id));
  for (const p of document.querySelectorAll('.panel')) p.hidden = p.id !== id;
}
for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => {
    selectTab(tab.dataset.tab);
    history.replaceState(null, '', '#' + tab.dataset.tab);
  });
}
/** Przejście do zakładki/sekcji (deep link #diag, #backup, #about i zwykłe zakładki). */
function route(hash) {
  const r = resolveRoute(hash);
  selectTab(r.tab);
  if (r.section) {
    const d = $(r.section);
    d.open = true;
    d.scrollIntoView({ block: 'start' });
  }
}
selectTab(resolveRoute(location.hash).tab); // od razu właściwa zakładka; sekcja otwiera się na końcu skryptu
for (const id of MORE_SECTIONS) {
  $(id).addEventListener('toggle', () => { if ($(id).open) history.replaceState(null, '', '#' + id); });
}

let data = await send({ type: 'options:get' });

/** Stały zestaw list – tylko informacja (bez przełączników). */
function renderLists() {
  const box = $('listContainer');
  box.textContent = '';
  for (const l of data.lists) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="text">
        <div class="name"></div>
        <div class="desc"></div>
        <div class="count"></div>
      </div>`;
    card.querySelector('.name').textContent = t(`list_${l.id}_name`, undefined, l.name);
    card.querySelector('.desc').textContent = t(`list_${l.id}_desc`, undefined, l.desc);
    card.querySelector('.count').textContent =
      t('list_counts', [fmt(l.networkFilters), fmt(l.cosmeticFilters), fmt(l.scriptletFilters)]);
    box.appendChild(card);
  }
}

function renderErrors(errors) {
  const ul = $('filterErrors');
  ul.textContent = '';
  for (const e of errors || []) {
    const li = document.createElement('li');
    li.innerHTML = '<span class="line"></span> <code></code> – <span class="reason"></span>';
    li.querySelector('.line').textContent = t('filters_line', e.line);
    li.querySelector('code').textContent = e.text;
    li.querySelector('.reason').textContent = e.reason;
    ul.appendChild(li);
  }
}

function flash(el, text, cls) {
  el.textContent = text;
  el.className = 'msg-inline ' + (cls || '');
}

// --- Kopia ustawień ------------------------------------------------------------
$('exportSettings').addEventListener('click', async () => {
  const r = await send({ type: 'settings:export' }).catch(() => null);
  if (!r || !r.ok) { flash($('backupMsg'), t('backup_exportFailed'), 'err'); return; }
  const blob = new Blob([JSON.stringify(r.backup, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = r.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  flash($('backupMsg'), t('backup_savedFile', r.fileName), 'ok');
});

$('importSettings').addEventListener('click', () => { $('importFile').value = ''; $('importFile').click(); });

$('importFile').addEventListener('change', async () => {
  const file = $('importFile').files && $('importFile').files[0];
  if (!file) return;
  $('importSummary').hidden = true;
  $('importErrors').hidden = true;
  if (file.size > 2 * 1024 * 1024) { showImportErrors({ ok: false, errors: [t('backup_tooLarge')] }); return; }
  $('importSettings').disabled = true;
  $('exportSettings').disabled = true;
  flash($('backupMsg'), t('backup_importing'), '');
  let r;
  try { r = await send({ type: 'settings:import', text: await file.text() }); } catch (e) { r = { ok: false, errors: [String(e)] }; }
  $('importSettings').disabled = false;
  $('exportSettings').disabled = false;
  if (r && r.ok) {
    data = await send({ type: 'options:get' });
    renderAll();
    const ul = $('importSummaryList');
    ul.textContent = '';
    for (const line of importSummary(r)) { const li = document.createElement('li'); li.textContent = line; ul.appendChild(li); }
    $('importSummary').hidden = false;
    flash($('backupMsg'), t('backup_done'), 'ok');
  } else {
    showImportErrors(r);
  }
});

/** Podsumowanie przywróconych ustawień w języku interfejsu (liczby z odpowiedzi tła). */
function importSummary(r) {
  if (!r.counts) return r.summary || [];
  const n = r.counts.userFilterRules;
  return [t('backup_summarySites', r.counts.disabledSites), t('backup_summaryFilters', [n, tPlural('rules', n)])];
}

function showImportErrors(result) {
  const m = importFailureMessage(result);
  const box = $('importErrors');
  box.textContent = '';
  const title = document.createElement('div');
  title.className = 'import-title';
  title.textContent = t(`import_${m.kind}`, undefined, m.title);
  box.appendChild(title);
  const ul = document.createElement('ul');
  for (const e of m.items) { const li = document.createElement('li'); li.textContent = e; ul.appendChild(li); }
  box.appendChild(ul);
  if (m.diagnostics) {
    const b = document.createElement('button');
    b.className = 'secondary';
    b.id = 'openDiag';
    b.textContent = t('import_openDiag');
    b.addEventListener('click', () => { route('diag'); history.replaceState(null, '', '#diag'); });
    box.appendChild(b);
  }
  box.hidden = false;
  flash($('backupMsg'), '', '');
}

function renderAll() {
  $('version').textContent = data.version;
  renderLists();
  $('userFilters').value = data.userFilters;
  renderErrors(data.userErrors);
  $('disabledSites').value = data.disabledSites.join('\n');
  const enabled = data.lists.filter((l) => l.enabled);
  $('stats').textContent = t('about_stats', [
    fmt(enabled.reduce((n, l) => n + l.networkFilters, 0)),
    fmt(enabled.reduce((n, l) => n + l.cosmeticFilters, 0)),
    fmt(enabled.reduce((n, l) => n + l.scriptletFilters, 0)),
    fmt(data.userCount),
  ]);
}
renderAll();

$('saveFilters').addEventListener('click', async () => {
  $('saveFilters').disabled = true;
  const res = await send({ type: 'options:setUserFilters', text: $('userFilters').value });
  $('saveFilters').disabled = false;
  renderErrors(res.errors);
  if (res.ok) flash($('filtersMsg'), t('filters_saved', fmt(res.count)), 'ok');
  else flash($('filtersMsg'), t('common_error', res.error), 'err');
});

$('saveSites').addEventListener('click', async () => {
  $('saveSites').disabled = true;
  const sites = $('disabledSites').value.split(/[\s,]+/).filter(Boolean)
    .map((s) => { try { return new URL(s.includes('://') ? s : 'http://' + s).hostname; } catch { return s; } });
  const res = await send({ type: 'options:setDisabledSites', sites });
  $('saveSites').disabled = false;
  if (res.ok) {
    $('disabledSites').value = res.disabledSites.join('\n');
    flash($('sitesMsg'), t('common_saved'), 'ok');
  } else flash($('sitesMsg'), t('common_error', res.error), 'err');
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

const STATUSES = ['ok', 'warning', 'error', 'unknown', 'disabled', 'healthy', 'degraded'];
const COMPONENTS = ['network', 'cosmetic', 'scriptlets', 'filters', 'youtube'];
const statusLabel = (st) => (STATUSES.includes(st) ? t(`dstatus_${st}`) : st);
const componentLabel = (c) => (COMPONENTS.includes(c) ? t(`dcomp_${c}`) : c);
const th = (...keys) => `<tr>${keys.map((k) => `<th>${esc(t(`dcol_${k}`))}</th>`).join('')}</tr>`;
const SYNC_PL = { rulesets: 'syncRulesets()', dynamicRules: 'syncDynamicRules()', scriptlets: 'syncScriptlets()' };
const time = (ts) => (ts ? new Date(ts).toLocaleString(numberLocale()) : '—');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const badge = (st) => `<span class="status ${esc(st)}">${esc(statusLabel(st))}</span>`;

async function renderDiag() {
  const h = await send({ type: 'health:get' });
  if (!h) return;
  $('components').innerHTML = th('component', 'status', 'details', 'updated')
    + Object.entries(h.components).map(([k, v]) => `<tr><td>${esc(componentLabel(k))}</td><td>${badge(v.status)}</td><td>${esc(v.detail)}</td><td>${time(v.updatedAt)}</td></tr>`).join('');
  $('sync').innerHTML = th('step', 'result', 'message', 'time')
    + Object.entries(h.sync).map(([k, v]) => `<tr><td class="mono">${esc(SYNC_PL[k] || k)}</td><td>${badge(v.status)}</td><td>${esc(v.message)}</td><td>${time(v.at)}</td></tr>`).join('');

  const y = h.youtube;
  if (y) {
    const c = y.compat;
    const lines = [];
    lines.push(`<p>${esc(t('diag_ytStatus'))} ${badge(y.status)}</p><ul>`);
    for (const ch of y.checks) lines.push(`<li>${ch.ok ? '✓' : '✗'} ${esc(ch.message)}</li>`);
    lines.push('</ul>');
    if (c) {
      lines.push(`<p>${t('diag_ytCritical', [Number(c.total), Number(c.supported), Number(c.partial + c.unsupported)])}</p>`);
      const gaps = [...(c.knownGaps || []), ...(c.newGaps || [])];
      if (gaps.length) {
        lines.push(`<p>${esc(t('diag_ytGaps'))}</p><ul>`);
        for (const g of gaps) lines.push(`<li><b>${esc(g.scriptlet)}</b>: ${esc(g.reason)}<br><span class="mono">${esc(g.filter.slice(0, 220))}</span></li>`);
        lines.push('</ul>');
      }
    }
    if (y.player) lines.push(`<p>${esc(t('diag_ytPlayer', y.player.page || '?'))} ${badge(y.player.status)} ${esc((y.player.reasons || []).join(', '))} · ${time(y.player.at)}</p>`);
    else lines.push(`<p class="muted">${esc(t('diag_ytNoPlayer'))}</p>`);
    $('youtubeDiag').innerHTML = lines.join('');
  }

  const sc = h.scriptletCompat;
  $('scriptletCompat').innerHTML = sc
    ? esc(t('diag_compatLine', [fmt(sc.summary.total), fmt(sc.summary.supported), fmt(sc.summary.partial), fmt(sc.summary.unsupported)]))
    : esc(t('diag_noCompat'));

  $('errors').innerHTML = h.errors.length
    ? th('time', 'component', 'message') + h.errors.slice().reverse().map((e) => `<tr><td>${time(e.timestamp)}</td><td>${esc(componentLabel(e.component))}</td><td>${esc(e.message)}</td></tr>`).join('')
    : `<tr><td class="muted">${esc(t('diag_noErrors'))}</td></tr>`;

  $('devPerf').checked = h.devPerf;
  $('perf').innerHTML = h.devPerf && h.perf.length
    ? th('time', 'host', 'mutations', 'generic', 'procedural', 'selectors')
      + h.perf.map((p) => `<tr><td>${time(p.at)}</td><td class="mono">${esc(p.host)}${p.frame ? esc(t('diag_frame', p.frame)) : ''}</td><td>${p.stats.mutationBatches}</td><td>${p.stats.genericMs}</td><td>${p.stats.proceduralMs} / ${p.stats.proceduralRuns}</td><td>${p.stats.selectorsApplied}</td></tr>`).join('')
    : `<tr><td class="muted">${esc(t(h.devPerf ? 'diag_noPerf' : 'diag_perfOff'))}</td></tr>`;

  const st = h.startupProfile;
  $('startupProfile').innerHTML = st && st.totalMs !== null
    ? `${th('stage', 'timeMs', 'calls')}<tr><td><b>Startup total</b> <span class="muted">(${esc(st.reason)})</span></td><td><b>${fmt(Math.round(st.totalMs))}</b></td><td></td></tr>`
      + Object.entries(st.marks || {}).map(([k, v]) => `<tr><td class="muted">${esc(k)}</td><td class="muted">${esc(t('diag_after', fmt(Math.round(v))))}</td><td></td></tr>`).join('')
      + st.stages.slice().sort((a, b) => b.totalMs - a.totalMs).map((x) => `<tr><td class="mono">${esc(x.name)}</td><td>${fmt(Math.round(x.totalMs))}</td><td>${x.count}</td></tr>`).join('')
    : `<tr><td class="muted">${esc(t('diag_noStartup'))}</td></tr>`;

  const sp = h.scriptletPerf || [];
  const ms = (v) => v.toLocaleString(numberLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  $('scriptletPerf').innerHTML = h.devPerf && sp.length
    ? th('scriptlet', 'target', 'calls', 'totalMs', 'avgMs', 'maxMs')
      + sp.map((r) => `<tr><td class="mono">${esc(r.scriptlet)}</td><td class="mono">${esc(r.target)}</td><td>${fmt(r.calls)}</td><td>${ms(r.totalMs)}</td><td>${ms(r.avgMs)}</td><td>${ms(r.maxMs)}</td></tr>`).join('')
    : `<tr><td class="muted">${esc(t(h.devPerf ? 'diag_noScriptletPerf' : 'diag_perfOff'))}</td></tr>`;
}

$('refreshDiag').addEventListener('click', renderDiag);
$('resync').addEventListener('click', async () => {
  $('resync').disabled = true;
  const r = await send({ type: 'health:resync' });
  $('resync').disabled = false;
  flash($('diagMsg'), t(r && r.ok ? 'diag_syncOk' : 'diag_syncErr'), r && r.ok ? 'ok' : 'err');
  renderDiag();
});
$('clearErrors').addEventListener('click', async () => { await send({ type: 'health:clearErrors' }); renderDiag(); });
$('devPerf').addEventListener('change', async () => { await send({ type: 'options:setDevPerf', enabled: $('devPerf').checked }); renderDiag(); });
$('resetPerf').addEventListener('click', async () => { await send({ type: 'perf:reset' }); flash($('diagMsg'), t('diag_perfReset'), 'ok'); renderDiag(); });
// Diagnostyka ładowana leniwie: health:get dopiero po rozwinięciu sekcji (także z deep linku #diag),
// przy każdym ponownym rozwinięciu odświeżana.
$('diag').addEventListener('toggle', () => { if ($('diag').open) renderDiag(); });

$('copyReport').addEventListener('click', async () => {
  const r = await send({ type: 'diagnostics:export' });
  if (!r || !r.text) { flash($('diagMsg'), t('diag_reportFailed'), 'err'); return; }
  const preview = $('reportPreview');
  preview.value = r.text;
  preview.hidden = false;
  try {
    await navigator.clipboard.writeText(r.text);
    flash($('diagMsg'), t('diag_reportCopied'), 'ok');
  } catch {
    preview.select();
    flash($('diagMsg'), t('diag_reportSelect'), '');
  }
});

// deep link na końcu – wszystkie obsługi (w tym leniwa diagnostyka) są już podpięte
route(location.hash);
window.addEventListener('hashchange', () => route(location.hash));