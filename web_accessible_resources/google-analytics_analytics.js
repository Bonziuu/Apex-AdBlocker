// Tarcza – atrapa Google Analytics (analytics.js / gtm.js): wywołuje callbacki, nic nie wysyła
(function () {
  'use strict';
  const noop = function () {};
  const tracker = { get() {}, set() {}, send() {} };
  const name = window.GoogleAnalyticsObject || 'ga';
  const queue = window[name] && window[name].q;
  const ga = function () {
    const len = arguments.length;
    if (len === 0) return;
    const args = Array.from(arguments);
    let fn;
    const last = args[len - 1];
    if (last instanceof Object && typeof last.hitCallback === 'function') fn = last.hitCallback;
    else if (typeof last === 'function') fn = () => last(tracker);
    else {
      const pos = args.indexOf('hitCallback');
      if (pos !== -1 && typeof args[pos + 1] === 'function') fn = args[pos + 1];
    }
    if (typeof fn === 'function') { try { fn(); } catch (e) {} }
  };
  ga.create = function () { return tracker; };
  ga.getByName = function () { return tracker; };
  ga.getAll = function () { return [tracker]; };
  ga.remove = noop;
  ga.loaded = true;
  window[name] = ga;
  if (Array.isArray(queue)) for (const args of queue) ga(...args);

  // gtag / dataLayer
  const dl = window.dataLayer;
  if (dl instanceof Object) {
    if (dl.hide instanceof Object && typeof dl.hide.end === 'function') { dl.hide.end(); dl.hide.end = noop; }
    if (typeof dl.push === 'function') {
      const callCb = (o) => { if (o instanceof Object && typeof o.eventCallback === 'function') setTimeout(o.eventCallback, 1); };
      dl.push = function (o) { callCb(o); return 0; };
      if (Array.isArray(dl)) for (const o of dl) callCb(o);
    }
  }
  if (typeof window.gtag !== 'function') window.gtag = noop;
})();
