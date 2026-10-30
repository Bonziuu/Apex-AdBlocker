// Small event/DOM harness for extension controllers. Browser tests separately
// verify layout and Chrome integration; this harness exercises async UI actions.
export function uiDocument(html) {
  const nodes = new Map();
  const doc = { activeElement: null };
  function element(tag = 'div', attrs = '') {
    const node = {
      tagName: tag.toUpperCase(), children: [], listeners: new Map(), dataset: {}, attributes: {},
      hidden: false, disabled: false, checked: false, value: '', tabIndex: 0,
      setAttribute(name, value) { this.attributes[name] = String(value); },
      getAttribute(name) { return this.attributes[name] ?? null; },
      addEventListener(type, listener) { this.listeners.set(type, [...(this.listeners.get(type) || []), listener]); },
      async dispatch(type, event = {}) { for (const listener of this.listeners.get(type) || []) await listener({ target: this, ...event }); },
      click() { return this.disabled ? Promise.resolve() : this.dispatch('click'); },
      focus() { doc.activeElement = this; },
      scrollIntoView() {}, select() {}, remove() {},
      appendChild(child) { this.children.push(child); return child; },
      querySelector(selector) {
        const match = (e) => selector.startsWith('.') ? e.className?.split(/\s+/).includes(selector.slice(1)) : e.tagName === selector.toUpperCase();
        return this.children.find(match) || this.children.map((e) => e.querySelector(selector)).find(Boolean) || null;
      },
    };
    let text = '', markup = '';
    Object.defineProperty(node, 'textContent', {
      get() { return text + this.children.map((e) => e.textContent).join(''); },
      set(value) { text = String(value); this.children = []; },
    });
    Object.defineProperty(node, 'innerHTML', {
      get() { return markup; },
      set(value) {
        markup = String(value); text = ''; this.children = [];
        for (const child of markup.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) this.children.push(element(child[1], child[2]));
      },
    });
    for (const attr of attrs.matchAll(/([\w-]+)(?:="([^"]*)")?/g)) {
      const [ , name, value = '' ] = attr;
      node.setAttribute(name, value);
      if (name === 'id') { node.id = value; nodes.set(value, node); }
      if (name === 'class') node.className = value;
      if (['hidden', 'disabled', 'checked'].includes(name)) node[name] = true;
      if (name.startsWith('data-')) node.dataset[name.slice(5)] = value;
      if (name === 'tabindex') node.tabIndex = Number(value);
    }
    return node;
  }
  for (const match of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) element(match[1], match[2]);
  doc.getElementById = (id) => { if (!nodes.has(id)) throw new Error(`Missing test element: ${id}`); return nodes.get(id); };
  doc.querySelectorAll = (selector) => [...nodes.values()].filter((e) => selector.startsWith('.') && e.className?.split(/\s+/).includes(selector.slice(1)));
  doc.createElement = (tag) => element(tag);
  doc.addEventListener = () => {};
  doc.body = element('body');
  return doc;
}

export function uiWindow() {
  const location = { hash: '' };
  const listeners = new Map();
  return {
    location,
    history: { replaceState(_state, _title, hash) { location.hash = hash; } },
    navigator: { clipboard: { writeText: async () => {} } },
    addEventListener(type, listener) { listeners.set(type, listener); },
    dispatch(type) { return listeners.get(type)?.(); },
    close() {},
  };
}

export function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
