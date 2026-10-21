// ChromeBlock – atrapa starego Google Analytics (ga.js)
(function () {
  'use strict';
  const noop = function () {};
  const Tracker = function () {};
  const p = Tracker.prototype;
  for (const m of ['_addIgnoredOrganic', '_addIgnoredRef', '_addItem', '_addOrganic', '_addTrans', '_clearIgnoredOrganic',
    '_clearIgnoredRef', '_clearOrganic', '_cookiePathCopy', '_deleteCustomVar', '_initData', '_link', '_linkByPost',
    '_setAllowAnchor', '_setAllowHash', '_setAllowLinker', '_setCampContentKey', '_setCampMediumKey', '_setCampNameKey',
    '_setCampNOKey', '_setCampSourceKey', '_setCampTermKey', '_setCampaignCookieTimeout', '_setCampaignTrack',
    '_setClientInfo', '_setCookiePath', '_setCookiePersistence', '_setCookieTimeout', '_setCustomVar', '_setDetectFlash',
    '_setDetectTitle', '_setDomainName', '_setLocalGifPath', '_setLocalRemoteServerMode', '_setLocalServerMode',
    '_setReferrerOverride', '_setRemoteServerMode', '_setSampleRate', '_setSessionTimeout', '_setSiteSpeedSampleRate',
    '_setSessionCookieTimeout', '_setVar', '_setVisitorCookieTimeout', '_trackEvent', '_trackPageLoadTime',
    '_trackPageview', '_trackSocial', '_trackTiming', '_trackTrans', '_visitCode']) p[m] = noop;
  p._getLinkerUrl = function (a) { return a; };
  p._getName = p._getVersion = function () { return ''; };
  p._getAccount = function () { return ''; };
  p._getVisitorCustomVar = function () { return ''; };
  const gat = {
    _anonymizeIP: noop, _createTracker() { return new Tracker(); }, _forceSSL: noop,
    _getPlugin: noop, _getTracker() { return new Tracker(); }, _getTrackerByName() { return new Tracker(); },
    _getTrackers: noop, aa: noop, ab: noop, hb: noop, la: noop, oa: noop, pa: noop, u: noop,
  };
  const gaq = {
    Na: noop, O: noop, Sa: noop, Ta: noop, Va: noop, _createAsyncTracker: noop, _getAsyncTracker: noop,
    _getPlugin: noop,
    push(a) { if (typeof a === 'function') { try { a(); } catch (e) {} return; } if (!Array.isArray(a)) return;
      if (typeof a[0] === 'string' && /(^|\.)_link$/.test(a[0]) && typeof a[1] === 'string') { try { location.assign(a[1]); } catch (e) {} }
      if (a[0] === '_set' && a[1] === 'hitCallback' && typeof a[2] === 'function') { try { a[2](); } catch (e) {} } },
  };
  const old = window._gaq;
  window._gat = gat;
  window._gaq = gaq;
  if (Array.isArray(old)) for (const a of old) gaq.push(a);
})();
