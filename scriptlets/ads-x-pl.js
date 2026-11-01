/* Apex AdBlocker – wyjątki scriptletów listy "Reklamy" dla listy "pl". Plik generowany przez tools/build.mjs.
   Dane: wyjątki #@#+js listy "Reklamy" przetworzone do formatu Apex AdBlocker, licencja GPL-3.0-only. Źródła i licencje: THIRD_PARTY_NOTICES.md. */
(function () {
'use strict';
const key = Symbol.for("ApexAdBlocker.crossListScriptletExceptions.v1");
let registry = globalThis[key];
if (!registry || typeof registry !== 'object') {
  registry = Object.create(null);
  try { Object.defineProperty(globalThis, key, { value: registry, writable: false, configurable: false }); } catch { return; }
}
const target = registry["pl"] || (registry["pl"] = Object.create(null));
const DATA = {"filmweb.pl":["abort-current-script\u0001decodeURIComponent\u0001newAdblockBoardDisplayed"],"hubdrive.com":["prevent-window-open"],"hubdrive.de":["prevent-window-open"],"money.pl":["set-constant\u0001Object.prototype.advViewability\u0001undefined","set-constant\u0001Object.prototype.gafSlot\u0001undefined","set-constant\u0001Object.prototype.rekids\u0001undefined"],"notube.com":["prevent-window-open"],"sportowefakty.wp.pl":["abort-on-property-read\u0001Object.prototype.bodyCode","set-constant\u0001Object.prototype.loadBunch\u0001noopFunc"],"uii.io":["noeval"],"wp.pl":["abort-on-property-read\u0001WP.inline","prevent-setTimeout\u0001/getComputedStyle[\\s\\S]*?style\\.display=\"none\"[\\s\\S]*?styleBlocked[\\s\\S]*?detected/"],"www.wp.pl":["abort-on-property-read\u0001__headpayload","set-constant\u0001WP.gaf.loadBunch\u0001noopFunc"]};
for (const host of Object.keys(DATA)) {
  const list = target[host] || (target[host] = []);
  for (const k of DATA[host]) if (!list.includes(k)) list.push(k);
}
})();
