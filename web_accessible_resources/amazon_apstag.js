// Apex AdBlocker – atrapa Amazon Publisher Services (apstag)
(function () {
  'use strict';
  const noop = function () {};
  const old = window.apstag;
  window.apstag = {
    debug: noop, deleteId: noop, init: noop, punt: noop, renderImp: noop, renewId: noop, rpa: noop,
    setDisplayBids: noop, targetingKeys() { return []; }, updateId: noop, upa: noop,
    fetchBids(cfg, cb) { if (typeof cb === 'function') { try { cb([]); } catch (e) {} } },
    _Q: [],
  };
  if (old && Array.isArray(old._Q)) {
    for (const [name, args] of old._Q) {
      const fn = window.apstag[name];
      if (typeof fn === 'function') { try { fn(...(args || [])); } catch (e) {} }
    }
  }
})();
