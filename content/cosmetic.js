// ChromeBlock – skrypt treści (świat izolowany, document_start, wszystkie ramki).
// 1) prosi service worker o CSS dla tej strony (filtry kosmetyczne),
// 2) zbiera klasy/identyfikatory elementów i dociąga pasujące ogólne filtry,
// 3) stosuje filtry proceduralne (:has-text, :upward, :remove, ...).
//
// Diagnostyka wydajności (opcje → Diagnostyka) jest domyślnie WYŁĄCZONA; gdy
// włączona, liczniki są wysyłane wyłącznie do service workera tego rozszerzenia.

(() => {
  if (window.__chromeblockCosmetic) return;
  window.__chromeblockCosmetic = true;

  const url = location.href;
  let hideAttr = 'data-chromeblock-hide';

  const send = (msg) => {
    try { return chrome.runtime.sendMessage(msg); } catch { return Promise.resolve(null); }
  };

  // ------------------------------------------------------------ diagnostyka

  const perf = {
    enabled: false,
    stats: { mutationBatches: 0, genericMs: 0, proceduralMs: 0, proceduralRuns: 0, tokensSent: 0, selectorsApplied: 0 },
    dirty: false,
    timer: 0,
  };
  const now = () => performance.now();
  const measure = (key, fn) => {
    if (!perf.enabled) return fn();
    const t0 = now();
    try { return fn(); } finally { perf.stats[key] += now() - t0; perf.dirty = true; }
  };
  const bump = (key, n = 1) => { if (perf.enabled) { perf.stats[key] += n; perf.dirty = true; } };
  try {
    chrome.storage.local.get('devPerf').then(({ devPerf }) => {
      if (!devPerf) return;
      perf.enabled = true;
      perf.timer = setInterval(() => {
        if (!perf.dirty) return;
        perf.dirty = false;
        const stats = { ...perf.stats, genericMs: Math.round(perf.stats.genericMs * 10) / 10, proceduralMs: Math.round(perf.stats.proceduralMs * 10) / 10 };
        send({ type: 'perf:report', url, stats });
      }, 5000);
    }, () => {});
  } catch { /* brak dostępu do storage */ }

  // ------------------------------------------------------------------ ogólne

  function startGeneric() {
    const seen = new Set();
    let pending = new Set();
    let timer = 0;
    let first = true;

    const addToken = (t) => {
      if (t.length > 1 && t.length < 80 && !seen.has(t)) { seen.add(t); pending.add(t); }
    };
    const collectEl = (el) => {
      const id = el.id;
      if (id && typeof id === 'string') addToken('#' + id);
      const cl = el.classList;
      if (cl) for (let i = 0; i < cl.length; i++) addToken('.' + cl[i]);
    };
    const collectTree = (root) => {
      if (root.nodeType !== 1) return;
      collectEl(root);
      const list = root.querySelectorAll('[id],[class]');
      for (let i = 0; i < list.length; i++) collectEl(list[i]);
    };
    const flush = () => {
      timer = 0;
      if (!pending.size) return;
      const tokens = [...pending];
      pending = new Set();
      bump('tokensSent', tokens.length);
      send({ type: 'cosmetic:tokens', tokens, url }).then((r) => { if (r && r.selectors) bump('selectorsApplied', r.selectors); }, () => {});
    };
    const schedule = () => {
      if (timer || !pending.size) return;
      timer = setTimeout(flush, first ? 1 : 150);
      first = false;
    };

    if (document.documentElement) measure('genericMs', () => collectTree(document.documentElement));
    schedule();

    const mo = new MutationObserver((records) => {
      bump('mutationBatches');
      measure('genericMs', () => {
        for (const r of records) {
          if (r.type === 'attributes') { collectEl(r.target); continue; }
          for (const n of r.addedNodes) collectTree(n);
        }
      });
      schedule();
    });
    const observe = () => mo.observe(document.documentElement, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['id', 'class'],
    });
    if (document.documentElement) observe();
    else document.addEventListener('readystatechange', observe, { once: true });
  }

  // ------------------------------------------------------------ proceduralne

  function toRegex(arg) {
    const m = /^\/(.+)\/([imsu]*)$/.exec(arg);
    if (m) { try { return new RegExp(m[1], m[2]); } catch { return null; } }
    return new RegExp(arg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  }

  function compile(tasks) {
    const steps = [];
    for (const t of tasks) {
      if (t.css !== undefined) { steps.push({ css: t.css }); continue; }
      switch (t.op) {
        case 'has-text': { const re = toRegex(t.arg); if (!re) return null; steps.push({ op: 'has-text', re }); break; }
        case 'min-text-length': steps.push({ op: 'min-text-length', n: parseInt(t.arg, 10) || 0 }); break;
        case 'upward': steps.push({ op: 'upward', arg: t.arg.trim() }); break;
        case 'matches-path': { const re = toRegex(t.arg); if (!re) return null; steps.push({ op: 'matches-path', re }); break; }
        case 'remove': steps.push({ op: 'remove' }); break;
        case 'style': steps.push({ op: 'style', css: t.arg }); break;
        default: return null;
      }
    }
    return steps;
  }

  function cssStep(nodes, raw) {
    const css = raw.trim();
    if (!css) return nodes;
    if (nodes === null) {
      try { return Array.from(document.querySelectorAll(css)); } catch { return []; }
    }
    const out = new Set();
    try {
      if (css[0] === '+' || css[0] === '~') {
        const rest = css.slice(1).trim();
        for (const n of nodes) {
          let s = n.nextElementSibling;
          while (s) {
            if (s.matches(rest)) out.add(s);
            if (css[0] === '+') break;
            s = s.nextElementSibling;
          }
        }
      } else if (css[0] === '>' || /^\s/.test(raw)) {
        for (const n of nodes) for (const e of n.querySelectorAll(':scope ' + css)) out.add(e);
      } else {
        for (const n of nodes) if (n.matches(css)) out.add(n);
      }
    } catch { return []; }
    return Array.from(out);
  }

  function run(steps) {
    let nodes = null;
    let action = { type: 'hide' };
    for (const s of steps) {
      if (s.css !== undefined) { nodes = cssStep(nodes, s.css); continue; }
      switch (s.op) {
        case 'matches-path':
          if (!s.re.test(location.pathname + location.search)) return { nodes: [], action };
          break;
        case 'has-text':
          nodes = (nodes || []).filter((n) => s.re.test(n.textContent || ''));
          break;
        case 'min-text-length':
          nodes = (nodes || []).filter((n) => (n.textContent || '').length >= s.n);
          break;
        case 'upward': {
          const out = new Set();
          const num = /^\d+$/.test(s.arg) ? parseInt(s.arg, 10) : 0;
          for (const n of nodes || []) {
            let p = n;
            if (num) {
              for (let i = 0; i < num && p; i++) p = p.parentElement;
            } else {
              try { p = n.parentElement && n.parentElement.closest(s.arg); } catch { p = null; }
            }
            if (p && p !== document.documentElement && p !== document.body) out.add(p);
          }
          nodes = Array.from(out);
          break;
        }
        case 'remove': action = { type: 'remove' }; break;
        case 'style': action = { type: 'style', css: s.css }; break;
        default: break;
      }
      if (nodes && !nodes.length) break;
    }
    return { nodes: nodes || [], action };
  }

  function startProcedural(list) {
    const compiled = list.map(compile).filter(Boolean);
    if (!compiled.length) return;
    // Zmiany samego tekstu (characterData) obserwujemy tylko, gdy jakiś filtr od niego zależy.
    const textDependent = compiled.some((steps) => steps.some((s) => s.op === 'has-text' || s.op === 'min-text-length'));
    const styled = new WeakSet();
    const apply = () => {
      bump('proceduralRuns');
      measure('proceduralMs', () => {
        for (const steps of compiled) {
          const { nodes, action } = run(steps);
          for (const n of nodes) {
            if (action.type === 'remove') { n.remove(); continue; }
            if (action.type === 'style') {
              if (styled.has(n)) continue;
              styled.add(n);
              n.setAttribute('style', (n.getAttribute('style') || '') + ';' + action.css);
              continue;
            }
            if (!n.hasAttribute(hideAttr)) n.setAttribute(hideAttr, '');
          }
        }
      });
    };
    let timer = 0;
    const schedule = () => {
      bump('mutationBatches');
      if (!timer) timer = setTimeout(() => { timer = 0; apply(); }, 100);
    };
    const begin = () => {
      apply();
      new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true, characterData: textDependent });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', begin, { once: true });
    else begin();
  }

  // ------------------------------------------------------------------- start

  send({ type: 'cosmetic:init', url }).then((resp) => {
    if (!resp || resp.off) return;
    if (resp.attr) hideAttr = resp.attr;
    if (resp.selectors) bump('selectorsApplied', resp.selectors);
    if (resp.generic) startGeneric();
    if (resp.proc && resp.proc.length) startProcedural(resp.proc);
  }, () => {});
})();
