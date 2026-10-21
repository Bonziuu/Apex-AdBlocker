// Tarcza – tryb wskazywania elementu do ukrycia (wstrzykiwany na żądanie z okienka).

(() => {
  if (window.__tarczaPicker) { window.__tarczaPicker.focus(); return; }

  const host = document.createElement('tarcza-picker');
  host.style.cssText = 'all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
  const root = host.attachShadow({ mode: 'closed' });
  root.innerHTML = `
<style>
  :host { all: initial; }
  .box { position: fixed; pointer-events: none; background: rgba(91,91,214,.18); outline: 2px solid #5b5bd6;
         border-radius: 2px; transition: all .06s ease-out; }
  .match { position: fixed; pointer-events: none; outline: 1px dashed #5b5bd6; background: rgba(91,91,214,.08); }
  .panel { position: fixed; right: 16px; bottom: 16px; width: 360px; max-width: calc(100vw - 32px);
           pointer-events: auto; background: #18181b; color: #f4f4f5; border-radius: 12px;
           box-shadow: 0 10px 40px rgba(0,0,0,.45); font: 13px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
           padding: 14px; box-sizing: border-box; }
  .panel * { box-sizing: border-box; }
  .title { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .hint { color: #a1a1aa; margin-bottom: 10px; }
  textarea { width: 100%; min-height: 58px; resize: vertical; background: #27272a; color: #f4f4f5; border: 1px solid #3f3f46;
             border-radius: 8px; padding: 8px; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  textarea:focus { outline: 2px solid #5b5bd6; border-color: transparent; }
  .count { color: #a1a1aa; margin: 6px 0 10px; font-size: 12px; }
  .row { display: flex; gap: 6px; flex-wrap: wrap; }
  button { font: inherit; border: 0; border-radius: 8px; padding: 8px 10px; cursor: pointer; background: #27272a; color: #f4f4f5; }
  button:hover { background: #3f3f46; }
  button.primary { background: #5b5bd6; color: #fff; margin-left: auto; }
  button.primary:hover { background: #4c4cc4; }
  button:disabled { opacity: .45; cursor: default; }
  .done { color: #86efac; }
</style>
<div class="box" hidden></div>
<div class="matches"></div>
<div class="panel">
  <div class="title">🛡️ Ukryj element</div>
  <div class="hint">Kliknij element na stronie, który chcesz ukryć. Esc – anuluj.</div>
  <textarea spellcheck="false" placeholder="Selektor CSS pojawi się po kliknięciu"></textarea>
  <div class="count">Nic nie wybrano</div>
  <div class="row">
    <button data-act="up" title="Zaznacz element nadrzędny" disabled>↑ Szerzej</button>
    <button data-act="down" title="Wróć do węższego elementu" disabled>↓ Węziej</button>
    <button data-act="cancel">Anuluj</button>
    <button data-act="save" class="primary" disabled>Ukryj na stałe</button>
  </div>
</div>`;
  (document.documentElement || document.body).appendChild(host);

  const box = root.querySelector('.box');
  const matchesLayer = root.querySelector('.matches');
  const panel = root.querySelector('.panel');
  const input = root.querySelector('textarea');
  const countEl = root.querySelector('.count');
  const btn = (a) => root.querySelector(`[data-act="${a}"]`);

  let picking = true;
  let chain = [];          // [wybrany, rodzic, dziadek...] do przycisków szerzej/węziej
  let level = 0;

  const isOurs = (el) => el === host;

  function elementAt(x, y) {
    host.style.display = 'none';
    const el = document.elementFromPoint(x, y);
    host.style.display = '';
    return el;
  }

  function place(el, div) {
    const r = el.getBoundingClientRect();
    div.style.left = r.left + 'px';
    div.style.top = r.top + 'px';
    div.style.width = r.width + 'px';
    div.style.height = r.height + 'px';
  }

  function goodClass(c) {
    return c.length < 40 && !/\d{3,}/.test(c) && !/^(active|hover|focus|selected|open|show|visible|is-|js-)/i.test(c)
      && /^[A-Za-z_][\w-]*$/.test(c);
  }
  function goodId(id) { return /^[A-Za-z][\w-]{1,50}$/.test(id) && !/\d{4,}/.test(id); }

  function uniqueSelector(el) {
    if (el.id && goodId(el.id) && document.querySelectorAll('#' + CSS.escape(el.id)).length === 1) {
      return '#' + CSS.escape(el.id);
    }
    const parts = [];
    let cur = el;
    while (cur && cur.nodeType === 1 && cur !== document.documentElement && parts.length < 6) {
      if (cur !== el && cur.id && goodId(cur.id)) { parts.unshift('#' + CSS.escape(cur.id)); break; }
      let part = cur.localName;
      const classes = [...cur.classList].filter(goodClass).slice(0, 2);
      if (classes.length) part += classes.map((c) => '.' + CSS.escape(c)).join('');
      const parent = cur.parentElement;
      if (parent) {
        const same = [...parent.children].filter((c) => { try { return c.matches(part); } catch { return false; } });
        if (same.length > 1) {
          const idx = [...parent.children].filter((c) => c.localName === cur.localName).indexOf(cur) + 1;
          part += `:nth-of-type(${idx})`;
        }
      }
      parts.unshift(part);
      const sel = parts.join(' > ');
      try { if (document.querySelectorAll(sel).length === 1) return sel; } catch {}
      if (cur === document.body) break;
      cur = parent;
    }
    return parts.join(' > ');
  }

  function preview() {
    matchesLayer.textContent = '';
    const sel = input.value.trim();
    if (!sel) { countEl.textContent = 'Nic nie wybrano'; btn('save').disabled = true; return; }
    let found = [];
    try { found = [...document.querySelectorAll(sel)].filter((e) => !isOurs(e)); }
    catch { countEl.textContent = 'Niepoprawny selektor'; btn('save').disabled = true; return; }
    countEl.textContent = found.length === 1 ? 'Pasuje: 1 element' : `Pasuje: ${found.length} elementów`;
    btn('save').disabled = found.length === 0;
    for (const e of found.slice(0, 50)) {
      const d = document.createElement('div');
      d.className = 'match';
      place(e, d);
      matchesLayer.appendChild(d);
    }
  }

  function select(el) {
    chain = [];
    let cur = el;
    while (cur && cur !== document.documentElement) { chain.push(cur); cur = cur.parentElement; }
    level = 0;
    applyLevel();
  }

  function applyLevel() {
    const el = chain[level];
    if (!el) return;
    picking = false;
    box.hidden = false;
    place(el, box);
    input.value = uniqueSelector(el);
    btn('up').disabled = level >= chain.length - 1 || chain[level + 1] === document.body;
    btn('down').disabled = level === 0;
    preview();
  }

  function onMove(e) {
    if (!picking) return;
    const el = elementAt(e.clientX, e.clientY);
    if (!el || isOurs(el) || el === document.documentElement || el === document.body) { box.hidden = true; return; }
    box.hidden = false;
    place(el, box);
  }

  function onClick(e) {
    if (e.composedPath().includes(host)) return; // klik w panel narzędzia
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.type !== 'click') return;
    const el = elementAt(e.clientX, e.clientY);
    if (el && !isOurs(el) && el !== document.documentElement && el !== document.body) select(el);
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); stop(); }
  }

  function stop() {
    window.removeEventListener('mousemove', onMove, true);
    for (const t of ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup']) window.removeEventListener(t, onClick, true);
    window.removeEventListener('keydown', onKey, true);
    host.remove();
    delete window.__tarczaPicker;
  }

  window.addEventListener('mousemove', onMove, true);
  for (const t of ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup']) window.addEventListener(t, onClick, true);
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('scroll', () => { if (!picking) { const el = chain[level]; if (el) place(el, box); preview(); } }, { passive: true });

  input.addEventListener('input', preview);
  btn('up').addEventListener('click', () => { if (level < chain.length - 1) { level++; applyLevel(); } });
  btn('down').addEventListener('click', () => { if (level > 0) { level--; applyLevel(); } });
  btn('cancel').addEventListener('click', stop);
  btn('save').addEventListener('click', async () => {
    const selector = input.value.trim();
    if (!selector) return;
    btn('save').disabled = true;
    try {
      for (const e of document.querySelectorAll(selector)) if (!isOurs(e)) e.style.setProperty('display', 'none', 'important');
    } catch {}
    try {
      const res = await chrome.runtime.sendMessage({ type: 'picker:add', selector });
      if (res && res.ok) {
        countEl.innerHTML = '<span class="done">Zapisano w „Moich filtrach”. Element zostanie ukryty także po odświeżeniu.</span>';
        setTimeout(stop, 1400);
        return;
      }
    } catch {}
    countEl.textContent = 'Nie udało się zapisać filtra.';
  });

  window.__tarczaPicker = { focus() { input.focus(); } };
})();
