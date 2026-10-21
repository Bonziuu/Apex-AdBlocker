// ChromeBlock – atrapa Google Publisher Tag (gpt.js)
(function () {
  'use strict';
  const noop = function () {};
  const noopThis = function () { return this; };
  const noopNull = function () { return null; };
  const noopArr = function () { return []; };
  const noopStr = function () { return ''; };

  const companionAdsService = { addEventListener: noopThis, enableSyncLoading: noop, setRefreshUnfilledSlots: noop };
  const contentService = { addEventListener: noopThis, setContent: noop };

  function PassbackSlot() {}
  Object.assign(PassbackSlot.prototype, {
    display: noop, get: noopNull, set: noopThis, setClickUrl: noopThis, setTagForChildDirectedTreatment: noopThis,
    setTargeting: noopThis, updateTargetingFromMap: noopThis,
  });

  function SizeMappingBuilder() {}
  Object.assign(SizeMappingBuilder.prototype, {
    addSize: noopThis,
    build: noopArr,
  });

  function Slot(adUnitPath, size, divId) {
    this.adUnitPath = adUnitPath;
    this.size = size;
    this.divId = divId;
  }
  Object.assign(Slot.prototype, {
    addService: noopThis, clearCategoryExclusions: noopThis, clearTargeting: noopThis, defineSizeMapping: noopThis,
    get: noopNull, getAdUnitPath() { return this.adUnitPath; }, getAttributeKeys: noopArr, getCategoryExclusions: noopArr,
    getDomId() { return this.divId; }, getResponseInformation: noopNull, getSlotElementId() { return this.divId; },
    getSlotId: noopThis, getTargeting: noopArr, getTargetingKeys: noopArr, getConfig: noopNull, set: noopThis,
    setCategoryExclusion: noopThis, setClickUrl: noopThis, setCollapseEmptyDiv: noopThis, setConfig: noop,
    setForceSafeFrame: noopThis, setSafeFrameConfig: noopThis, setTargeting: noopThis, updateTargetingFromMap: noopThis,
    getEscapedQemQueryId: noopStr, getHtml: noopStr, getName() { return this.adUnitPath; }, getSizes() { return []; },
  });

  const listeners = new Map();
  const pubAdsService = {
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(fn); return this; },
    removeEventListener: noop, clear: noop, clearCategoryExclusions: noopThis, clearTagForChildDirectedTreatment: noopThis,
    clearTargeting: noopThis, collapseEmptyDivs: noop, defineOutOfPagePassback() { return new PassbackSlot(); },
    definePassback() { return new PassbackSlot(); }, disableInitialLoad: noop, display: noop, enableAsyncRendering: noop,
    enableLazyLoad: noop, enableSingleRequest: noop, enableSyncRendering: noop, enableVideoAds: noop, get: noopNull,
    getAttributeKeys: noopArr, getTargeting: noopArr, getTargetingKeys: noopArr, getSlots: noopArr, isInitialLoadDisabled() { return true; },
    refresh: noop, set: noopThis, setCategoryExclusion: noopThis, setCentering: noop, setCookieOptions: noopThis,
    setForceSafeFrame: noopThis, setLocation: noopThis, setPrivacySettings: noopThis, setPublisherProvidedId: noopThis,
    setRequestNonPersonalizedAds: noopThis, setSafeFrameConfig: noopThis, setTagForChildDirectedTreatment: noopThis,
    setTargeting: noopThis, setVideoContent: noopThis, updateCorrelator: noop,
  };

  const gt = window.googletag || {};
  const cmd = gt.cmd || [];
  gt.apiReady = true;
  gt.pubadsReady = true;
  gt.cmd = [];
  gt.cmd.push = function (fn) { try { fn(); } catch (e) {} return 1; };
  Object.assign(gt, {
    companionAds() { return companionAdsService; },
    content() { return contentService; },
    defineOutOfPageSlot(path, id) { return new Slot(path, [1, 1], id); },
    defineSlot(path, size, id) { return new Slot(path, size, id); },
    destroySlots: noop, disablePublisherConsole: noop, display: noop, enableServices: noop,
    getVersion: noopStr, pubads() { return pubAdsService; }, setAdIframeTitle: noop, setConfig: noop,
    sizeMapping() { return new SizeMappingBuilder(); },
    secureSignalProviders: { clearAllCache: noop, push: noop },
  });
  window.googletag = gt;
  for (const fn of cmd) { try { fn(); } catch (e) {} }
})();
