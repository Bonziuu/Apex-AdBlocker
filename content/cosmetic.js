// Apex AdBlocker – skrypt treści (świat izolowany, document_start, wszystkie ramki).
// 1) prosi service worker o CSS dla tej strony (filtry kosmetyczne),
// 2) zbiera klasy/identyfikatory elementów i dociąga pasujące ogólne filtry,
// 3) stosuje filtry proceduralne (:has-text, :upward, :remove, ...).
//
// Diagnostyka wydajności (opcje → Diagnostyka) jest domyślnie WYŁĄCZONA; gdy
// włączona, liczniki są wysyłane wyłącznie do service workera tego rozszerzenia.

(() => {
  if (window.__apexCosmetic) return;
  window.__apexCosmetic = true;

  const url = location.href;
  let hideAttr = 'data-apex-hide';

  const send = (msg) => {
    try { return chrome.runtime.sendMessage(msg); } catch { return Promise.resolve(null); }
  };
  const request = async (msg) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await send(msg).catch(() => null);
      if (response && !response.error && response.ok !== false) return response;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
    return null;
  };
  // Frame scriptlets need the worker's top-level site guard before entering MAIN.
  // This request is independent of cosmetic initialization and never blocks it.
  if (window !== window.top) void request({ type: 'scriptlets:init' });

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
      // Pomiary scriptletów ze świata MAIN (patrz tools/scriptlets-lib.js, „Profiler scriptletów”).
      // Przekazujemy surowy tekst – service worker go waliduje (tylko nazwy i liczby).
      document.addEventListener('apex:scriptlet-perf', (e) => {
        if (typeof e.detail === 'string' && e.detail.length <= 50000) send({ type: 'perf:scriptlets', data: e.detail });
      });
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
    const pending = new Set();
    let timer = 0;
    let first = true;
    let flushing = false;
    let failures = 0;

    const addToken = (t) => {
      if (t.length > 1 && t.length < 80 && !seen.has(t)) pending.add(t);
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
    const flush = async () => {
      timer = 0;
      if (flushing) return;
      flushing = true;
      try {
        while (pending.size) {
          // The worker accepts at most 2,000 tokens per message. Only acknowledged
          // tokens become seen, so a temporary message failure does not lose them.
          const tokens = [...pending].slice(0, 2000);
          const r = await send({ type: 'cosmetic:tokens', tokens, url }).catch(() => null);
          if (!r || r.error) { failures++; break; }
          for (const token of tokens) { pending.delete(token); seen.add(token); }
          failures = 0;
          bump('tokensSent', tokens.length);
          if (r.selectors) bump('selectorsApplied', r.selectors);
        }
      } finally {
        flushing = false;
        if (pending.size && failures < 3) schedule(1000);
      }
    };
    const schedule = (delay) => {
      if (timer || flushing || !pending.size) return;
      timer = setTimeout(flush, delay ?? (first ? 1 : 150));
      first = false;
    };

    if (document.documentElement) measure('genericMs', () => collectTree(document.documentElement));
    schedule();

    const mo = new MutationObserver((records) => {
      failures = 0;
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
        for (const n of nodes) {
          const parent = n.parentElement;
          if (!parent) continue;
          // Anchor the complete relative selector at this node, so continuations
          // such as "+ .wrapper .banner" return the banner, not the wrapper.
          const index = Array.prototype.indexOf.call(parent.children, n) + 1;
          for (const e of parent.querySelectorAll(`:scope > :nth-child(${index}) ${css}`)) out.add(e);
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
      if (!s.op && s.css !== undefined) { nodes = cssStep(nodes, s.css); continue; }
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
    const hidden = new Set();
    const styled = new Map();
    const declarations = new Map();
    for (const steps of compiled) for (const s of steps) {
      if (s.op !== 'style' || declarations.has(s.css)) continue;
      const style = document.createElement('span').style;
      style.cssText = s.css;
      declarations.set(s.css, [...style].map((name) => [name, { value: style.getPropertyValue(name), priority: style.getPropertyPriority(name) }]));
    }
    const same = (a, b) => a.value === b.value && a.priority === b.priority;
    const readStyle = (node, name) => ({ value: node.style.getPropertyValue(name), priority: node.style.getPropertyPriority(name) });
    const writeStyle = (node, name, value) => {
      if (same(readStyle(node, name), value)) return;
      if (value.value) node.style.setProperty(name, value.value, value.priority);
      else node.style.removeProperty(name);
    };
    const apply = () => {
      bump('proceduralRuns');
      measure('proceduralMs', () => {
        const nextHidden = new Set();
        const nextStyles = new Map();
        for (const steps of compiled) {
          const { nodes, action } = run(steps);
          for (const n of nodes) {
            if (action.type === 'remove') { n.remove(); continue; }
            if (action.type === 'style') {
              if (!nextStyles.has(n)) nextStyles.set(n, new Map());
              const wanted = nextStyles.get(n);
              for (const [name, value] of declarations.get(action.css) || []) {
                if (wanted.get(name)?.priority === 'important' && !value.priority) continue;
                wanted.set(name, value);
              }
              continue;
            }
            nextHidden.add(n);
          }
        }
        for (const node of hidden) if (!nextHidden.has(node)) { node.removeAttribute(hideAttr); hidden.delete(node); }
        for (const node of nextHidden) if (!node.hasAttribute(hideAttr)) { node.setAttribute(hideAttr, ''); hidden.add(node); }
        // Restore only properties still carrying our value; preserve changes made
        // by the page while the rule was active and apply all matching styles.
        for (const [node, properties] of styled) {
          const wanted = nextStyles.get(node);
          for (const [name, record] of properties) if (!wanted?.has(name)) {
            if (same(readStyle(node, name), record.applied)) writeStyle(node, name, record.original);
            properties.delete(name);
          }
          if (!properties.size) styled.delete(node);
        }
        for (const [node, wanted] of nextStyles) {
          if (!styled.has(node)) styled.set(node, new Map());
          const properties = styled.get(node);
          for (const [name, value] of wanted) {
            const current = readStyle(node, name);
            let record = properties.get(name);
            if (!record) { record = { original: current, applied: value }; properties.set(name, record); }
            else if (!same(current, record.applied)) record.original = current;
            writeStyle(node, name, value);
            record.applied = value;
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
      new MutationObserver((records) => {
        if (records.some((r) => r.type !== 'attributes' || r.attributeName !== hideAttr)) schedule();
      }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: textDependent });
      window.addEventListener('popstate', schedule);
      window.navigation?.addEventListener('currententrychange', schedule);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', begin, { once: true });
    else begin();
  }

  // ------------------------------------------------------------------- start

  request({ type: 'cosmetic:init', url }).then((resp) => {
    if (!resp || resp.off) return;
    if (resp.attr) hideAttr = resp.attr;
    if (resp.selectors) bump('selectorsApplied', resp.selectors);
    if (resp.generic) startGeneric();
    if (resp.proc && resp.proc.length) startProcedural(resp.proc);
  }, () => {});
})();
