// ChromeBlock – silnik zapytań JSONPath w dialekcie używanym przez listy uBO.
//
// Implementacja własna ChromeBlock. Odwzorowuje zachowanie opisane w
// dokumentacji „uBO-flavored JSONPath” oraz zachowanie wariantu legacy
// (bez prefiksu "v2:"), którego używają aktualne filtry YouTube.
//
// Obsługiwane:
//   $  @  .klucz  ..klucz  .*  [*]  ["klucz"]  ['klucz']  [0]  [-1]  ["a","b"]
//   ./regex/   [?.ścieżka]   [?!.ścieżka]   [?.a.b==JSON] (== != < <= > >= ^= $= *=)
//   [?.a=/regex/i]   łańcuchy ";$" i kwantyfikatory "{x}", "{x,}", "{,y}", "{x,y}"
//   przypisania: =JSON   +={obiekt}   =repl({"regex"|"pattern":…,"replacement":…})
//   "${now}" w wartości tekstowej (pierwsze wystąpienie → Date.now())
// Celowo NIEobsługiwane (zapytanie jest wtedy niepoprawne):
//   =call(...) – wywoływanie dowolnych funkcji strony.
//
// Plik jest modułem ES (testy, build) i jest też wklejany do scriptletów
// (build usuwa słowo "export").

export class ChromeBlockJSONPath {
  static compileQuery(query) {
    const p = new ChromeBlockJSONPath();
    p.compile(query);
    return p;
  }

  constructor() {
    this.compiled = null;
    this.error = '';
  }

  get valid() { return this.compiled !== null; }
  get hasAssignment() { return this.compiled !== null && this.compiled.rval !== undefined; }
  get modifier() { return this.compiled ? this.compiled.modify : undefined; }

  compile(query) {
    this.compiled = null;
    this.error = '';
    let q = String(query);
    const v2 = q.startsWith('v2:');
    if (v2) q = q.slice(3);
    this.v2 = v2;
    const r = this._steps(q, 0);
    if (!r) { this.error = 'błąd składni zapytania'; return; }
    const out = { steps: r.steps, v2, modify: undefined, rval: undefined };
    if (r.i !== q.length) {
      const rest = q.slice(r.i);
      let raw;
      if (rest.startsWith('+=')) {
        out.modify = '+';
        raw = rest.slice(2);
      } else if (rest.startsWith('=')) {
        const fn = /^=([a-z]+)\((.+)\)$/.exec(rest);
        if (fn) {
          if (fn[1] !== 'repl') { this.error = `nieobsługiwany modyfikator =${fn[1]}()`; return; }
          out.modify = 'repl';
          raw = fn[2];
        } else {
          raw = rest.slice(1);
        }
      } else {
        this.error = 'nieoczekiwane znaki na końcu zapytania';
        return;
      }
      try { out.rval = JSON.parse(raw); } catch { this.error = 'wartość przypisania nie jest poprawnym JSON'; return; }
      if (out.modify === 'repl') {
        const v = out.rval;
        if (!v || typeof v !== 'object' || typeof v.replacement !== 'string'
            || (typeof v.regex !== 'string' && typeof v.pattern !== 'string')) {
          this.error = 'niepoprawne repl()';
          return;
        }
        try {
          out.re = typeof v.regex === 'string'
            ? new RegExp(v.regex, v.flags)
            : new RegExp(v.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        } catch { this.error = 'niepoprawne wyrażenie w repl()'; return; }
      }
    }
    this.compiled = out;
  }

  // --- kompilacja -----------------------------------------------------------

  _steps(q, start) {
    if (q.length === 0) return null;
    const steps = [];
    let i = start;
    if (q[i] === '$') { steps.push({ mv: 'root' }); i++; }
    else if (q[i] === '@') { steps.push({ mv: 'current' }); i++; }
    else steps.push({ mv: start === 0 ? 'root' : 'current' });
    let mv = null;
    while (i < q.length) {
      const c = q[i];
      if (c === ' ') { i++; continue; }
      if (c === '.') {
        if (mv !== null) return null;
        if (q.startsWith('..', i)) { mv = 'descendants'; i += 2; } else { mv = 'children'; i += 1; }
        continue;
      }
      if (c === ';') {
        if (!q.startsWith(';$', i)) return null;
        steps.push({ mv: 'quantifier', min: 1, max: 1e6 }, { mv: 'root' });
        i += 2;
        mv = null;
        continue;
      }
      if (c === '{') {
        const m = /^\{(\d+|\d+,\d+|\d+,|,\d+)\};\$/.exec(q.slice(i));
        if (!m) return null;
        let min;
        let max;
        const comma = m[1].indexOf(',');
        if (comma === -1) { min = max = parseInt(m[1], 10); }
        else { min = parseInt(m[1].slice(0, comma), 10) || 0; max = parseInt(m[1].slice(comma + 1), 10) || 1e6; }
        steps.push({ mv: 'quantifier', min, max }, { mv: 'root' });
        i += m[0].length;
        mv = null;
        continue;
      }
      if (c !== '[') {
        if (mv === null) {
          // wyrażenie porównania dla ostatniego kroku (np. ".a.b*="x"]")
          const last = steps[steps.length - 1];
          const j = this._expr(q, last, i);
          if (j === null) return null;
          if (j !== undefined) i = j;
          break;
        }
        const r = this._unquoted(q, i);
        if (!r) return null;
        steps.push({ mv, k: r.s });
        i = r.i;
        mv = null;
        continue;
      }
      // składnia nawiasowa
      if (mv === 'children') return null;
      if (q.startsWith('[?', i)) {
        const not = q[i + 2] === '!';
        const r = this._steps(q, i + 2 + (not ? 1 : 0));
        if (!r || q[r.i] !== ']') return null;
        if (not) r.steps[r.steps.length - 1].not = true;
        steps.push({ mv: mv || 'children', filter: r.steps });
        i = r.i + 1;
        mv = null;
        continue;
      }
      if (q.startsWith('[*]', i)) {
        steps.push({ mv: mv || 'children', k: '*' });
        i += 3;
        mv = null;
        continue;
      }
      const r = this._bracket(q, i + 1);
      if (!r) return null;
      steps.push({ mv: mv || 'children', k: r.s });
      i = r.i + 1;
      mv = null;
    }
    if (mv !== null) return null;
    return { steps, i };
  }

  // Zwraca: indeks po wyrażeniu, undefined gdy brak wyrażenia, null gdy błąd.
  _expr(q, step, i) {
    if (q.startsWith('=/', i)) {
      const r = this._until(q, '/', i + 2);
      if (!r) return i;
      let end = r.i;
      let flags;
      if (q[end] === 'i') { flags = 'i'; end++; }
      try { step.rval = new RegExp(r.s, flags); } catch { return null; }
      step.op = 're';
      return end;
    }
    const m = /^\s*([!=^$*]=|[<>]=?)\s*(.+?)\]/.exec(q.slice(i));
    if (!m) return undefined;
    const op = m[1];
    const raw = m[2];
    if (raw[0] === "'") {
      const r = this._until(raw, "'", 1);
      if (!r) return null;
      step.rval = r.s;
    } else {
      try { step.rval = JSON.parse(raw); } catch { return null; }
    }
    step.op = op;
    return i + m[0].length - 1;
  }

  _unquoted(q, i) {
    if (q[i] === '/') {
      const r = this._until(q, '/', i + 1);
      if (!r) return null;
      try { return { s: new RegExp(r.s), i: r.i }; } catch { return null; }
    }
    const m = /^[A-Za-z_][\w]*|^\*/.exec(q.slice(i));
    if (!m) return null;
    return { s: m[0], i: i + m[0].length };
  }

  _bracket(q, i) {
    const keys = [];
    let need = true;
    while (i < q.length) {
      const c = q[i];
      if (c === ']') break;
      if (c === ' ') { i++; continue; }
      if (c === ',') {
        if (need) return null;
        need = true;
        i++;
        continue;
      }
      if (c === '"' || c === "'") {
        const r = this._until(q, c, i + 1);
        if (!r) return null;
        keys.push(r.s);
        i = r.i;
        need = false;
        continue;
      }
      if (c === '-' || (c >= '0' && c <= '9')) {
        const m = /^-?\d+/.exec(q.slice(i));
        if (!m) return null;
        keys.push(parseInt(m[0], 10));
        i += m[0].length;
        need = false;
        continue;
      }
      // Identyfikator bez cudzysłowu w nawiasie – w dialekcie uBO zawsze kończy się
      // niepoprawnym zapytaniem (nie ustawia "need = false"). Odwzorowujemy to.
      if (this.v2) return null;
      const r = this._unquoted(q, i);
      if (!r) return null;
      keys.push(r.s);
      i = r.i;
    }
    if (need) return null;
    return { s: keys.length === 1 ? keys[0] : keys, i };
  }

  _until(q, target, i) {
    let out = '';
    let j = i;
    for (;;) {
      if (j >= q.length) return null;
      const c = q[j];
      if (c === target) return { s: out, i: j + 1 };
      if (c === '\\' && q[j + 1] === target) { out += target; j += 2; continue; }
      out += c;
      j++;
    }
  }

  // --- wykonanie ------------------------------------------------------------

  evaluate(root) {
    if (!this.valid) return [];
    this._root = { $: root };
    const paths = this._run(this.compiled.steps, []);
    this._root = null;
    return paths;
  }

  /**
   * Stosuje zapytanie do obiektu (modyfikuje go w miejscu).
   * Zwraca obiekt po edycji albo undefined, gdy zapytanie nic nie dopasowało.
   */
  apply(root) {
    if (!this.valid) return undefined;
    this._root = { $: root };
    const paths = this._run(this.compiled.steps, []);
    if (paths.length === 0) { this._root = null; return undefined; }
    for (let n = paths.length - 1; n >= 0; n--) {
      const { obj, key } = this._resolve(paths[n]);
      if (obj === undefined) continue;
      if (this.compiled.rval !== undefined) this._modify(obj, key);
      else if (Array.isArray(obj) && typeof key === 'number') obj.splice(key, 1);
      else delete obj[key];
    }
    const result = this._root.$ === undefined ? null : this._root.$;
    this._root = null;
    return result;
  }

  _run(steps, pathin) {
    let set = [];
    for (const step of steps) {
      if (step.mv === 'root') { set = [['$']]; continue; }
      if (step.mv === 'current') {
        if (step.op) {
          const { obj, key } = this._resolve(pathin);
          if (obj === undefined) return [];
          if (this._test(step, obj, key) !== true) continue;
        }
        set = [pathin];
        continue;
      }
      if (step.mv === 'quantifier') {
        if (set.length < step.min || set.length > step.max) return [];
        set = [];
        continue;
      }
      // children / descendants
      if (set.length === 0) continue;
      set = this._matches(set, step);
    }
    return set;
  }

  _matches(listin, step) {
    const out = [];
    for (const pathin of listin) {
      const owner = this._resolve(pathin).value;
      if (owner === undefined) continue;
      if (step.filter) { this._filterMatches(pathin, step, owner, out); continue; }
      const keys = this._expand(owner, step.k);
      if (keys) for (const k of keys) if (this._test(step, owner, k) === true) out.push([...pathin, k]);
      if (step.mv !== 'descendants') continue;
      for (const d of this._descendants(owner, true)) {
        const holder = d.obj[d.key];
        const ks = this._expand(holder, step.k);
        if (!ks) continue;
        for (const k of ks) if (this._test(step, holder, k) === true) out.push([...pathin, ...d.path, k]);
      }
    }
    return out;
  }

  _filterMatches(pathin, step, owner, out) {
    const recursive = step.mv === 'descendants';
    const perChild = this.compiled.v2 || recursive || Array.isArray(owner);
    for (const d of this._descendants(owner, recursive)) {
      const q = perChild ? [...pathin, ...d.path] : pathin;
      const r = this._run(step.filter, q);
      if (!r || r.length === 0) continue;
      out.push(q);
      if (!perChild) break;
    }
  }

  _expand(owner, k) {
    if (typeof owner !== 'object' || owner === null) return undefined;
    if (Array.isArray(k)) {
      const out = [];
      for (const a of k) { const ks = this._expand(owner, a); if (ks) out.push(...ks); }
      return out;
    }
    if (typeof k === 'number') {
      if (!Array.isArray(owner)) return undefined;
      return [k >= 0 ? k : owner.length + k];
    }
    if (k === '*') return Array.isArray(owner) ? [...owner.keys()] : Object.keys(owner);
    if (k instanceof RegExp) return Object.keys(owner).filter((key) => k.test(key));
    return [k];
  }

  // Przejście w głąb (pre-order). Ścieżki są względne wobec "v".
  * _descendants(v, recursive) {
    if (typeof v !== 'object' || v === null) return;
    const stack = [{ obj: v, keys: Array.isArray(v) ? [...v.keys()] : Object.keys(v), at: 0 }];
    const path = [];
    while (stack.length) {
      const top = stack[stack.length - 1];
      if (top.at >= top.keys.length) { stack.pop(); path.pop(); continue; }
      const key = top.keys[top.at++];
      path[stack.length - 1] = key;
      path.length = stack.length;
      yield { obj: top.obj, key, path: path.slice() };
      const child = top.obj[key];
      if (recursive && typeof child === 'object' && child !== null) {
        stack.push({ obj: child, keys: Array.isArray(child) ? [...child.keys()] : Object.keys(child), at: 0 });
      }
    }
  }

  _resolve(path) {
    if (path.length === 0) return { value: this._root };
    let obj = this._root;
    for (let n = 0; n < path.length - 1; n++) {
      obj = obj[path[n]];
      if (!(obj instanceof Object)) return {};
    }
    const key = path[path.length - 1];
    return { obj, key, value: obj[key] };
  }

  _test(step, owner, k) {
    if (owner === undefined || owner === null) return undefined;
    const has = owner[k] !== undefined || Object.prototype.hasOwnProperty.call(owner, k);
    if (step.op !== undefined && !has) return undefined;
    const expect = step.not !== true;
    const v = owner[k];
    switch (step.op) {
      case '==': return (v === step.rval) === expect;
      case '!=': return (v !== step.rval) === expect;
      case '<': return (v < step.rval) === expect;
      case '<=': return (v <= step.rval) === expect;
      case '>': return (v > step.rval) === expect;
      case '>=': return (v >= step.rval) === expect;
      case '^=': return `${v}`.startsWith(step.rval) === expect;
      case '$=': return `${v}`.endsWith(step.rval) === expect;
      case '*=': return `${v}`.includes(step.rval) === expect;
      // Zgodnie z dialektem uBO negacja nie dotyczy operatora regex.
      case 're': return step.rval.test(`${v}`);
      default: return has === expect;
    }
  }

  _modify(obj, key) {
    let { modify, rval } = this.compiled;
    if (typeof rval === 'string') rval = rval.replace('${now}', `${Date.now()}`);
    if (modify === undefined) { obj[key] = rval; return; }
    if (modify === '+') {
      if (!(rval instanceof Object)) return;
      const lval = obj[key];
      if (!(lval instanceof Object) || Array.isArray(lval)) return;
      for (const [k, v] of Object.entries(rval)) lval[k] = v;
      return;
    }
    if (modify === 'repl') {
      const lval = obj[key];
      if (typeof lval !== 'string') return;
      obj[key] = lval.replace(this.compiled.re, rval.replacement);
    }
  }
}
