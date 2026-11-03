/* Apex AdBlocker – scriptlety listy "Reklamy" (część 20/23). Plik generowany przez tools/build.mjs.
   Dane CALLS/HOSTS/EXCEPT: filtry listy "Reklamy" przetworzone do formatu Apex AdBlocker, licencja GPL-3.0-only. Kod biblioteki scriptletów: Apex AdBlocker, MIT. Źródła i licencje: THIRD_PARTY_NOTICES.md. */
(function () {
'use strict';
if (typeof globalThis[Symbol.for('ApexAdBlocker.entityHostKeys.v1')] !== 'function') return;
const installedKey = Symbol.for('ApexAdBlocker.scriptletShards.v1');
let installed = globalThis[installedKey];
if (!installed) {
  installed = new Set();
  Object.defineProperty(globalThis, installedKey, { value: installed, writable: false, configurable: false });
}
const shardKey = "scriptlets/ads-19.js:e29d0c3acb17898f60e897ea899168fd3789277c67c79ee9f8a2c8f303917b67";
if (installed.has(shardKey)) return;
installed.add(shardKey);
const CALLS = [["set-constant","ytInitialPlayerResponse.playerAds","undefined"],["set-constant","ytInitialPlayerResponse.adPlacements","undefined"],["set-constant","ytInitialPlayerResponse.adSlots","undefined"],["set-constant","playerResponse.adPlacements","undefined"],["json-prune","playerResponse.adPlacements playerResponse.playerAds playerResponse.adSlots adPlacements playerAds adSlots important"],["json-prune-fetch-response","reelWatchSequenceResponse.entries.[-].command.reelWatchEndpoint.adClientParams.isAd entries.[-].command.reelWatchEndpoint.adClientParams.isAd","","propsToMatch","url:/reel_watch_sequence?"],["json-prune","entries.[-].command.reelWatchEndpoint.adClientParams.isAd"],["abort-on-property-read","AntiAd.check"],["abort-on-property-write","_sp_"],["abort-on-property-read","_sp_._networkListenerData"],["prevent-addEventListener","load","PrivateMode"],["remove-node-text","script","adblockerDisabled","excludes",",\\\""],["remove-node-text","script","fundingChoicesCalled"],["abort-current-script","admiral"],["prevent-fetch","doubleclick"],["adjust-setTimeout","isPeriodic","2200","0.001"],["adjust-setTimeout","isPeriodic","2300","0.001"],["abort-on-property-read","ExoLoader"],["abort-on-property-write","ads_priv"],["abort-on-property-write","sc_adv_out"],["abort-on-property-read","btoa"],["abort-on-property-read","open"],["abort-on-property-read","Math.floor"],["set-constant","blockAdBlock","true"],["abort-current-script","$","ltvModal"],["set-constant","luxuretv.config"],["abort-on-property-read","popns"],["set-constant","can_run_ads","true"],["prevent-setTimeout","test","0"],["abort-current-script","setTimeout","1000"],["nowebrtc"],["set-constant","blurred","false"],["abort-current-script","ExoLoader"],["abort-on-property-write","encodeURIComponent"],["adjust-setInterval"],["adjust-setInterval","countdown","2000"],["adjust-setTimeout"],["noeval"],["prevent-window-open"],["abort-current-script","Math","zfgloaded"],["prevent-setTimeout","clientHeight"],["abort-current-script","btoa","BOOTLOADER_LOADED"],["remove-node-text","script","/__adblocker|html-load/","excludes","self.__next"],["prevent-addEventListener","","/adbl/i"],["prevent-setTimeout","/adbl/i"],["prevent-addEventListener","error","","elements","[src]"],["abort-on-property-read","SmartWallSDK"],["remove-node-text","script","/\\(async\\s*\\(\\)\\s*=>\\s*\\{\\s*try\\s*\\{\\s*(const|var)/"],["set-constant","cxStartDetectionProcess","noopFunc"],["set-constant","isAdBlocked","false"],["prevent-xhr","/enthusiastgaming|googleoptimize|googletagmanager/"],["remove-node-text","script","/HTMLIFrameElement|JSON\\[/","excludes","self.__next"],["prevent-xhr","/doubleclick|googlesyndication/"],["abort-current-script","$","blockAds"],["remove-node-text","script","html-load.com"],["abort-on-property-read","registerSlideshowAd"],["abort-on-property-read","_sp_"],["abort-on-property-read","Aloader.serve"],["prevent-setTimeout","nextFunction","2000"],["set-constant","sp_ad","true"],["adjust-setInterval","timeLeft"],["set-constant","UhasAB","false"],["abort-on-property-read","__eiPb"],["abort-on-property-read","performance"],["set-constant","frg","1"],["prevent-setTimeout","adblock"],["set-constant","CnnXt.Event.fire","noopFunc"],["abort-on-property-read","ReviveBannerInterstitial"],["set-constant","adblockDetector","trueFunc"],["abort-on-property-write","adBlockDetected"],["abort-on-property-read","adblock"],["abort-on-property-write","check"],["prevent-addEventListener","load","isBlanketFound"],["prevent-setTimeout","()","2500"],["set-constant","jQuery.adblock","false"],["prevent-setTimeout","()","1000"],["prevent-setTimeout","innerHTML"],["abort-on-property-read","popit"],["prevent-addEventListener","popstate","noPop"],["adjust-setTimeout","","","0.02"],["abort-current-script","decodeURI","decodeURIComponent"],["abort-on-property-read","exoJsPop101"],["abort-on-property-read","nombre_dominio"],["prevent-setTimeout","nextFunction","250"],["set-constant","Adblock","false"],["prevent-setTimeout","pum-open"],["abort-current-script","document.createElement","script"],["abort-on-property-read","Date.prototype.toGMTString"],["abort-on-property-read","ExoLoader.serve"],["abort-on-property-read","initPu"],["abort-on-property-read","jsUnda"],["prevent-addEventListener","getexoloader"],["prevent-addEventListener","","_0x"],["abort-current-script","Date","='\\x"],["abort-current-script","document.head.appendChild","='\\x"],["set-constant","pr_okvalida","true"],["prevent-setTimeout","sub"],["prevent-addEventListener","load","2000"],["abort-on-property-read","exoNoExternalUI38djdkjDDJsio96"],["abort-current-script","$","adblock"],["abort-on-property-read","document.dispatchEvent"],["prevent-addEventListener","click","my_inter_listen"],["remove-node-text","script","myreadCookie"],["abort-on-property-read","AaDetector"],["abort-current-script","loadTool","popping"],["abort-current-script","document.getElementsByTagName","script"],["prevent-addEventListener","","checkTarget"],["prevent-setTimeout","blocker"],["set-constant","blockAdBlock","trueFunc"],["prevent-addEventListener","scroll","getElementById"],["abort-on-property-read","_sp_.mms.startMsg"],["abort-current-script","document.createElement","adblock"],["abort-on-property-write","daCheckManager"],["abort-on-property-read","adblockDetect"],["prevent-addEventListener","","show"],["prevent-setInterval","adsbygoogle"],["abort-current-script","jQuery","ai_adb"],["abort-current-script","decodeURIComponent","ai_"],["abort-current-script","addEventListener","nextFunction"],["prevent-addEventListener","DOMContentLoaded","AdBlock"],["abort-on-property-read","pareAdblock"],["prevent-setTimeout",".call(null)","10"],["remove-node-text","script","DisplayAcceptableAdIfAdblocked"],["abort-on-property-read","Notification"],["prevent-setTimeout","error-report.com"],["prevent-addEventListener","load","error-report.com"],["json-prune","adtagparameter","enabled"],["remove-node-text","script","/==undefined.*body/"],["remove-node-text","script","/h=decodeURIComponent|popundersPerIP/"],["prevent-addEventListener","","popMagic"],["abort-current-script","document.createElement","l.parentNode.insertBefore(s","/^data:/"],["prevent-addEventListener","click","popMagic"],["prevent-fetch","googlesyndication"],["abort-on-property-read","checkCookieClick"],["abort-current-script","document.querySelectorAll","popMagic"],["abort-current-script","EventTarget.prototype.addEventListener","delete window"],["abort-current-script","WebAssembly","atob"],["prevent-setTimeout","getComputedStyle"],["abort-current-script","document.documentElement","break;case $."],["abort-current-script","document.createElement","shift"],["noeval-if","/chp_?ad/"],["remove-node-text","script","window.open"],["abort-current-script","document.createElement","l.parentNode.insertBefore(s"],["remove-node-text","script","Exo"],["prevent-setInterval","visibility","1000"],["abort-current-script","document.dispatchEvent","myEl"],["abort-on-property-read","decodeURI"],["prevent-addEventListener","click","clickCount"],["prevent-addEventListener","play","openPopunder"],["abort-on-property-read","loadTool"],["prevent-setTimeout","appendChild"],["prevent-setTimeout","offsetWidth","2000"],["trusted-replace-node-text","script","adv_","no_adv_","condition","kt_player.swf","sedCount","10"],["set-constant","flashvars.popunder_url"],["remove-node-text","script",";}}};break;case $."],["remove-node-text","script","wpadmngr.com"],["remove-node-text","script","/WebAssembly|forceunder/"],["prevent-setInterval","adblock"],["abort-on-property-read","Adcash"],["adjust-setTimeout","counter"],["abort-current-script","JSON.parse","break;case $."],["abort-current-script","parseInt","break;case $."],["prevent-addEventListener","","break;case $."],["remove-attr","onload","[onload^=\"window.open\"]"],["abort-current-script","navigator","break;case $."],["abort-current-script","Math","break;case $."],["abort-current-script","String.fromCharCode","/btoa|break/"],["abort-current-script","JSON.parse","atob"],["remove-node-text","script","/adblock|popunder|openedPop|WebAssembly|wpadmngr/"],["abort-on-property-read","__aaZoneid"],["abort-on-property-write","DoodPop"],["abort-on-property-write","Adcash"],["abort-current-script","navigator","FingerprintJS"],["trusted-prevent-xhr","outbrain.com","outbrain"],["trusted-prevent-xhr","s4.cdnpc.net/front/css/style.min.css","slider--features"],["trusted-prevent-xhr","s4.cdnpc.net/vite-bundle/main.css","data-v-d23a26c8"],["trusted-prevent-xhr","cdn.taboola.com/libtrc/san1go-network/loader.js","feOffset"],["abort-on-property-read","adsBlocked"],["abort-current-script","Math","zfgcodeloaded"],["prevent-addEventListener","DOMContentLoaded","history.go"],["remove-node-text","script","popunder"],["prevent-xhr","outbrain"],["prevent-addEventListener","load","puTSstrpcht"],["remove-node-text","script","adserverDomain"],["abort-current-script","addEventListener","aclib"],["abort-current-script","fetch","break;case"],["abort-current-script","addEventListener","HTMLAllCollection"],["abort-on-property-read","console.clear"],["adjust-setInterval","timer"],["prevent-window-open","!/prcf.fiyar|themes|pixsense|.jpg/"],["prevent-setTimeout","offsetWidth"],["set-constant","PreRollAd.timeCounter","0"],["prevent-setTimeout","show"],["prevent-addEventListener","load","htmls"],["remove-attr","href",".MyAd > a[target=\"_blank\"]"],["prevent-addEventListener","DOMContentLoaded","antiAdBlockerHandler"],["prevent-addEventListener","DOMContentLoaded","location.href"],["abort-current-script","document.createElement","onerror"],["prevent-setTimeout","_0x","500"],["abort-on-property-write","onScriptError"],["abort-on-property-read","localStorage"],["trusted-replace-node-text","script","'IFRAME'","'BODY'"],["noeval-if","js_func_decode_base_64"],["prevent-addEventListener","load","abDetectorPro"],["prevent-xhr","googlesyndication"],["prevent-fetch","/googlesyndication|doubleclick/","length:10","{\"type\": \"cors\"}"],["prevent-xhr","/googlesyndication|doubleclick/","length:10"],["remove-node-text","script","Datafadace"],["remove-node-text","script","deblocker"],["prevent-setTimeout","bait"],["abort-on-property-read","googletag"],["set-constant","admiral","noopFunc"],["remove-node-text","script","/__adblocker|html-load/"],["remove-node-text","script","/\"v4ac1eiZr0\"|\"\"\\)\\.split\\(\",\"\\)\\[4\\]|(\\.localStorage\\)|JSON\\.parse\\(\\w)\\.getItem\\(\"|[\"']_aQS0\\w+[\"']|decodeURI\\(decodeURI\\(\"|<a href=\"https:\\/\\/getad%|\"cmp\\.updated\"/"],["trusted-replace-node-text","script","/^/","(()=>{window.admiral=function(d,a,b){if(\"function\"==typeof b)try{b({})}catch(a){}}})();","sedCount","1"],["set-constant","__INITIAL_DATA__.siteData.admiralScript"],["set-constant","ADBLOCKED","false"],["set-cookie","WHITELISTED_CLOSED","1"],["set-constant","Object.prototype.adsEnabled","false"],["remove-node-text","script","parentNode.removeChild"],["abort-current-script","atob","parentNode.removeChild"],["remove-node-text","script","/admiral|\\[\\]\\)\\.push\\(arguments\\)/","excludes",",\\\""],["remove-node-text","script","[]).push(arguments)","excludes",",\\\""],["remove-node-text","script","admiral","excludes",",\\\""],["set-constant","gnt.x.uam","undefined","runAt","interactive"],["set-constant","Object.prototype.ads.nopreroll_","true"],["json-edit","..props.children.*[?.key==\"admiral-script\"]"],["trusted-json-edit","..props.config.ad.enabled=false"],["trusted-json-edit","..Admiral.isEnabled=false"],["trusted-json-edit","..admiral=false"],["trusted-json-edit","..AdShield.isEnabled=false"],["remove-node-text","script","Ad-Shield"],["remove-attr","onerror","script[id][onerror]","asap","quitAfter","10"],["remove-node-text","script","/\\(\\)=>eval|&&window\\}/"],["remove-node-text","script","/:window,|\\)\\.join\\(String\\.fromCharCode/"],["remove-node-text","script","/html-load\\.com|:\\[?window,/"],["set-constant","loadShield","noopFunc"],["set-constant","adLight","true"],["remove-node-text","script",").join(String.fromCharCode"],["remove-node-text","script","/:\\[?window,/"],["json-prune","RT-1562-AdShield-script-on-Huffpost"],["set-constant","disableAdShield","true"],["set-constant","HP_Scout.adBlocked","false"],["remove-node-text","script","error-report.com"],["remove-node-text","script","adrecover.com"],["remove-node-text","script","void 0||window,"],["remove-node-text","script","()=>eval"],["remove-node-text","script","html-load.cc"],["remove-node-text","script","\"data-sdk\""],["prevent-setTimeout","[native code]","500"],["remove-node-text","script","await eval"],["remove-node-text","script","/\\)\\.join\\(String\\.fromCharCode|html-load\\.com/"],["remove-node-text","script","\"nowprocket\""],["remove-node-text","script","__adblocker","excludes","self.__next"],["abort-current-script","document.createElement","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/="],["remove-node-text","script","/HTMLIFrameElement|JSON\\[/"],["prevent-addEventListener","DOMContentLoaded","leaderboardAd"],["abort-current-script","document.addEventListener","#leaderboardAd"],["set-constant","setupSkin","noopFunc"],["set-constant","console.clear","undefined"],["abort-current-script","globalThis","break;case"],["abort-current-script","addEventListener","adserverDomain"],["remove-node-text","script","/h=decodeURIComponent|popundersPerIP|popup|\\.onerror|WebAssembly/i"],["json-prune","ads playerAds"],["remove-node-text","script","/detectAdblock|WebAssembly|pop1stp|popMagic/i"],["abort-current-script","setTimeout","adblock"],["prevent-addEventListener","click","_0x"],["trusted-replace-node-text","script","/manageAds\\(video_urls\\[activeItem\\], video_seconds\\[activeItem\\], ad_urls\\[activeItem],true\\);/","playVideo();","condition","playAdd"],["trusted-replace-node-text","script","prerollEnabled:true","prerollEnabled:false"],["set-constant","googlefc","undefined"],["abort-current-script","atob","decodeURIComponent"],["abort-on-property-read","LieDetector"],["abort-on-property-write","Fingerprint2"],["prevent-addEventListener","load","script"],["noeval-if","popUnderStage"],["adjust-setInterval","counter","*"],["set-constant","canRunAds","true"],["prevent-setTimeout","bADBlock"],["prevent-setTimeout","eabpDialog"],["abort-current-script","document.addEventListener","initBCPopunder"],["abort-current-script","readCookieDelit"],["abort-current-script","onload","puHref"],["set-constant","flashvars.adv_pre_vast"],["set-constant","flashvars.adv_postpause_vast"],["abort-current-script","Math","adthrive"],["prevent-setTimeout","check"],["set-constant","koddostu_com_adblock_yok","null"],["prevent-setTimeout","google_jobrunner"],["set-constant","openWindow","noopFunc"],["abort-on-property-read","wpsite_clickable_data"],["abort-on-property-read","adBlockDetected"],["abort-current-script","document.addEventListener","adsBlocked"],["json-prune","data.attributes.ssaiInfo.forecastTimeline data.attributes.ssaiInfo.vendorAttributes.nonLinearAds data.attributes.ssaiInfo.vendorAttributes.videoView data.attributes.ssaiInfo.vendorAttributes.breaks.[].ads.[].adMetadata data.attributes.ssaiInfo.vendorAttributes.breaks.[].ads.[].adParameters data.attributes.ssaiInfo.vendorAttributes.breaks.[].timeOffset"],["prevent-fetch","adsbygoogle.js"],["remove-attr","onclick","a[href][onclick^=\"getFullStory\"]"],["abort-on-property-read","rccbase_styles"],["abort-on-property-read","adp"],["abort-current-script","puShown","/doOpen|popundr/"],["prevent-setTimeout","window.location.href"],["set-constant","flashvars.protect_block"],["prevent-addEventListener","DOMContentLoaded","adsBlocked"],["prevent-addEventListener","","adb"],["adjust-setTimeout","download","1100"],["prevent-setTimeout","disableDeveloperTools"],["prevent-addEventListener","load","crakPopInParams"],["json-prune","cuepoints","cuepoints.[].start cuepoints.[].end cuepoints.[].start_float cuepoints.[].end_float"],["prevent-fetch","/ads/banner"],["set-constant","moatPrebidApi","{}"],["set-constant","moatPrebidApi.getMoatTargetingForPage","noopFunc"],["prevent-setTimeout","Adb"],["abort-on-property-read","SPHMoverlay"],["abort-on-property-read","__Y"],["abort-on-property-read","mm"],["prevent-addEventListener","click","popundr"],["abort-current-script","eval","replace"],["prevent-addEventListener","scroll","innerHeight"],["prevent-setTimeout","showModal"],["prevent-fetch","method:HEAD"],["abort-on-property-read","inhumanity_pop_var_name"],["set-constant","timeleft","0"],["noeval-if","replace"],["prevent-xhr","adsbygoogle"],["prevent-xhr","ads"],["abort-on-property-read","mz"],["adjust-setTimeout","() => n(t)","*"],["adjust-setTimeout","() => t()","*"],["set-constant","D4zz","noopFunc"],["abort-on-property-write","detector_launch"],["set-constant","time","0"],["abort-current-script","confirm","location"],["set-cookie","modal_cookie","yes"],["prevent-xhr","doubleclick"],["abort-on-property-read","BetterJsPop"],["prevent-setTimeout","","500"],["prevent-fetch","adsbygoogle"],["abort-current-script","Script_Manager"],["prevent-addEventListener","load","XMLHttpRequest"],["prevent-setTimeout","refresh"],["set-constant","detectadsbocker","false"],["set-cookie","unlock_chapter_guest","1"],["prevent-setTimeout","Delay"],["remove-class","unclickable","","stay"],["noeval-if","AdBlock"],["adjust-setInterval","current-=1","*","0.001"],["trusted-json-edit-xhr-response",".access=true","propsToMatch","/no_ads/config"],["abort-on-property-read","b2a"],["set-constant","go_popup","{}"],["remove-attr","href","a[href*=\"torrentico.top/sim/go.php\"]"],["set-constant","penci_adlbock.ad_blocker_detector","0"],["prevent-addEventListener","load","autoRecov"],["prevent-setTimeout","open"],["remove-node-text","script","closeAd"],["prevent-setTimeout","adBlockDetected"],["remove-node-text","script","open"],["abort-on-property-read","checkAds"],["set-constant","detectAdBlock","noopFunc"],["trusted-replace-fetch-response","/#EXTINF:[^\\n]+\\nhttps:\\/\\/redirector\\.googlevideo\\.com[^\\n]+/gms","/\\/ondemand\\/.+\\.m3u8/"],["set-constant","di.app.WebplayerApp.Ads.Adblocks.app.AdBlockDetectApp.startWithParent","false"],["prevent-fetch","/ads|googletagmanager/"],["set-constant","sharedController.adblockDetector","noopFunc"],["remove-node-text","script","/adblock/i"],["set-constant","google.ima.OmidVerificationVendor","{}"],["json-prune","adease adeaseBlob vmap","adease"],["trusted-replace-node-text","P","/\\.[^.]+(1Password password manager|download 1Password)[^.]+/"],["json-prune-fetch-response","plugins.adService"],["json-prune","plugins.adService"],["adjust-setInterval","countDown"],["prevent-setTimeout","/native|\\{n\\(\\)/"],["remove-attr","style","[style^=\"background\"]","stay"],["remove-attr","href","[target^=\"_\"]","stay"],["adjust-setTimeout","-1","*","0.001"],["set-cookie","ts_popunder","true","","reload","1"],["trusted-replace-node-text","script","popunder","","condition","popunder","stay","1"],["prevent-addEventListener","click","[native code]","elements",".main-wrap"],["abort-current-script","document.createElement","window.ts"],["remove-node-text","script","bannerRight"],["remove-cookie","video_view_count"],["prevent-xhr","/googlesyndication|googima\\.js|imasdk/"],["prevent-fetch","/googlesyndication|googima\\.js|imasdk/"],["noeval-if","debugger"],["set-constant","PlayerLogic.prototype.detectADB","noopFunc"],["prevent-fetch","ads-twitter.com"],["json-prune","*","all"],["prevent-fetch","havenclick"],["abort-on-property-write","Script_Manager"],["set-constant","dvsize","52"],["abort-current-script","eval","_0x"],["prevent-setTimeout","readyWait"],["abort-on-property-read","document.body.style.backgroundPosition"],["remove-node-text","script","/fetch|adb/i"],["abort-current-script","$","popup"],["prevent-setInterval","daadb"],["adjust-setInterval","downloadTimer"],["prevent-setTimeout","nextFunction"],["prevent-addEventListener","load","detect-modal"],["adjust-setInterval","/attachonce == false/","800","0.001"],["set-constant","gadb","false"],["prevent-addEventListener","load","nextFunction"],["abort-on-property-read","popUrl"],["trusted-replace-xhr-response","/#EXTINF:[^\\n]+\\n[^\\n]+?\\/preroll\\/[^\\n]+/gms","",".m3u8"],["abort-current-script","gtag","adblock"],["abort-on-property-write","detectedAdblock"],["set-constant","Object.prototype.adUrl"],["trusted-replace-node-text","script","playVideo();","loadEmbedVideo();"],["abort-current-script","document.getElementById","fakeElement"],["prevent-fetch","imasdk"],["remove-node-text","script","onerror"],["set-constant","playerEnhancedConfig.run","throwFunc"],["set-constant","elimina_profilazione","1"],["set-constant","elimina_pubblicita","1"],["adjust-setInterval","adv","*"],["trusted-set-cookie","_ym_uid","$now$"],["prevent-setTimeout","","4000-"],["trusted-replace-fetch-response","/#EXT-X-KEY:METHOD=NONE\\n#EXT(?:INF:[^\\n]+|-X-DISCONTINUITY)\\n.+?(?=#EXT-X-KEY)/gms","","/media.m3u8"],["prevent-setTimeout","hasAdblock"],["set-cookie","BetterJsPop0","1"],["abort-on-property-write","window.onload"],["prevent-xhr","/redirector\\.googlevideo\\.com\\/videoplayback[\\s\\S]*?dclk_video_ads/"],["json-prune","ads breaks cuepoints times"],["remove-class","ad-controls",".bitmovinplayer-container.ad-controls"],["json-prune-fetch-response","streamProviders.[].adPlaylist streamProviders.[].ads","","propsToMatch","playback."],["abort-on-property-read","odabd"],["trusted-prevent-xhr","pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?ord=","b.google_reactive_tag_first"],["trusted-prevent-xhr","sbs.demdex.net/dest5.html?d_nsid=0&ord=","Demdex.canSetThirdPartyCookies"],["trusted-prevent-xhr","securepubads.g.doubleclick.net/pagead/ima_ppub_config?ippd=https%3A%2F%2Fwww.sbs.com.au%2Fondemand%2F&ord=","[\"4117\"]"],["trusted-prevent-fetch","imasdk","ad.doubleclick.net bid.g.doubleclick.net ggpht.com google.co.uk google.com googleads.g.doubleclick.net googleads4.g.doubleclick.net googleadservices.com googlesyndication.com googleusercontent.com gstatic.com gvt1.com prod.google.com pubads.g.doubleclick.net s0.2mdn.net static.doubleclick.net surveys.g.doubleclick.net youtube.com ytimg.com"],["abort-current-script","$","cdgPops"],["trusted-set-constant","document.referrer","json:\"1\""],["set-constant","showModal","noopFunc"],["noeval-if","adsbygoogle"],["set-constant","aaw","{}"],["set-constant","aaw.processAdsOnPage","noopFunc"],["set-local-storage-item","adblock_warning_pages_count","$remove$"],["set-constant","CAD.pageblockerWarning","noopFunc"],["remove-node-text","script","/adsBlocked|\"popundersPerIP\"/"],["set-constant","HTMLImageElement.prototype.onerror","undefined"],["abort-current-script","document.write","insertAd"],["remove-node-text","script","/delete window|popundersPerIP|var FingerprintJS|adserverDomain|globalThis;break;case|ai_adb|adContainer/"],["abort-current-script","setTimeout","window.open"],["trusted-replace-node-text","script","window.location.replace(urlRandom);"],["remove-node-text","script","/adb|ta_session_id/i"],["set-constant","__venatusLoaderInit","true"],["set-session-storage-item","/^ta_/","$remove$"],["trusted-replace-node-text","script","window.dataLayer =","(()=>{document.querySelectorAll(`form:has(> input[value$=\".mp3\"])`).forEach(el=>{let url=el.querySelector(\"input\").getAttribute(\"value\");el.setAttribute(\"action\",url)})})();window.dataLayer =","sedCount","1"],["set-constant","dclm_ajax_var.disclaimer_redirect_url"],["prevent-window-open","_blank"],["prevent-setTimeout","/createElement|addEventListener|clientHeight/"],["prevent-setInterval","childNodes"],["prevent-window-open","?key="],["trusted-json-edit-fetch-response",".result.PlayAds=false","propsToMatch","/api/get-urls"],["prevent-setTimeout","googlesyndication"],["prevent-setTimeout","TNCMS.DMP"],["prevent-addEventListener","click","link.click"],["abort-current-script","addEventListener","fallback"],["set-constant","HTMLScriptElement.prototype.onerror","undefined"],["trusted-replace-node-text","script",":{content:","no:{content:"],["set-constant","clicked","2"],["remove-node-text","script","\"+\"","excludes","/self\\.__next|recaptcha|document|window|const|var|let/"],["abort-current-script","RegExp.prototype.exec.constructor","\"+\""],["abort-current-script","Function.prototype.constructor","\"+\""],["set-constant","HTMLElement.prototype.click.call","noopFunc"],["set-constant","HTMLElement.prototype.click.apply","noopFunc"],["set-constant","Element.prototype.closest","falseFunc"],["prevent-addEventListener","click","/document.createElement|window.open/"],["prevent-window-open",".cfd"],["remove-node-text","script","/\"\\+\"g|\"\\+\"'a|self\\.__next.*?,typeof document|self\\.__next&&|\\|\\|self\\.__next,\\(|\\(\"\\+\"t|'\\+'F|0\\|\\|window|\\}\\)\\(\\),typeof|'\\+'s|this\\['F.*\\('\\+'\"|\\)\\)\"'\\)\\(\\);\\(\\(\\)\\=>/g","excludes","/^self\\.__next_f\\.push/"],["prevent-addEventListener","DOMContentLoaded","adlinkfly"],["prevent-setInterval","getComputedStyle"],["prevent-setTimeout","/\\{[a-z]+\\(\\)\\}/"],["prevent-setInterval",".value||"],["prevent-addEventListener","visibilitychange",".value&&"],["prevent-setTimeout","OzB.adb"],["prevent-setTimeout","/adblock|Error|getComputedStyle/"],["trusted-json-edit-fetch-response","$..durationInSeconds=0","propsToMatch","-ssai-vod-"],["prevent-setTimeout",".showModal"],["trusted-replace-node-text","script","/func.*justDetect.*warnarea.*?;/gm"],["remove-node-text","script","getComputedStyle(el"],["remove-node-text","script","popup"],["trusted-replace-node-text","script","/\\d{4}/gms","10"],["prevent-setTimeout","documentElement.innerHTML"],["prevent-fetch","doubleclick","","{\"type\": \"opaque\"}"],["trusted-replace-node-text","script","/^([^{])/","document.addEventListener('DOMContentLoaded',()=>{const i=document.createElement('iframe');i.style='height:0;width:0;border:0';i.id='aswift_0';document.body.appendChild(i);i.focus();const f=document.createElement('div');f.id='9JJFp';document.body.appendChild(f);});$1","sedCount","2"],["set-constant","document.hasFocus","trueFunc"],["abort-on-property-read","xmlhttp"],["remove-attr","data-ppcnt_ads|onclick","#main"],["prevent-setTimeout","/window\\.location\\.href|n/","8000"],["prevent-fetch","ads"],["prevent-addEventListener","load","bypass"],["remove-node-text","script","/adb_detected|AdBlockCheck|;break;case \\$\\./i"],["prevent-xhr","/pagead2\\.googlesyndication\\.com|inklinkor\\.com/"],["prevent-addEventListener","DOMContentLoaded","/checkAdblockUser|bypOnSyntheticClick/"],["prevent-setTimeout","checkAdblock"],["trusted-replace-node-text","script","offsetHeight","offsetHeight+100"],["set-cookie","__gads","1"],["abort-on-property-read","bypass_url"],["adjust-setInterval","timer","*","0.001"],["abort-on-property-read","app_vars.force_disable_adblock"],["abort-on-property-read","AdBDetected"],["trusted-replace-node-text","script","timeLeft = duration","timeLeft = 0"],["prevent-xhr","method:HEAD"],["prevent-addEventListener","click","rel"],["set-constant","document.hidden","false"],["trusted-replace-node-text","script","isadblock = 1;","isadblock = 0;"],["trusted-replace-node-text","script","\"#sdl\"","\"#dln\""],["remove-node-text","script","DisableDevtool"],["prevent-window-open","!devuploads.com"],["adjust-setInterval","","*","0.02"],["adjust-setTimeout","","*","0.02"],["abort-current-script","document.addEventListener","google_ad_client"],["prevent-addEventListener","DOMContentLoaded","checkMockObjects"],["adjust-setInterval","countdown","1000","0.001"],["trusted-replace-node-text","script","/#Intent.*?end/"],["trusted-replace-node-text","script","intent","https"],["prevent-setTimeout","location.href"],["trusted-replace-node-text","script","/(['\"])https?:\\/\\/[^'\"]+\\1/","$1$1","condition","/addEventListener|adUrl|open/"],["trusted-replace-node-text","script","_blank","_self","condition","href"],["trusted-replace-node-text","script","e.preventDefault();"],["remove-node-text","script","/adScriptURL|eval/"],["trusted-replace-node-text","script","typeof window.adsbygoogle === \"undefined\"","false"],["abort-current-script","document.createElement","adsBlocked"],["remove-node-text","script",".onerror"],["trusted-replace-node-text","script","/window\\.location\\.href.*/"],["trusted-replace-node-text","script","_blank","_self"],["trusted-replace-node-text","script","/30000/gm","10"],["adjust-setTimeout","/.?/","*","0.001"],["adjust-setInterval","/.?/","*","0.001"],["trusted-replace-node-text","script","/\\d{5}\\);/gms","10);"],["trusted-replace-node-text","script","/\\d{4}\\);/gms","10);"],["trusted-replace-node-text","script","spinner.classList","readylink.classList"],["trusted-replace-node-text","script","getNowButton.classList","downloadButton.classList"],["trusted-replace-node-text","script","*Opens in new tab"],["json-prune-fetch-response","endpoint.watchEndpoint.unserializedPrefetchData.playerResponse.playerAds endpoint.watchEndpoint.unserializedPrefetchData.playerResponse.adPlacements endpoint.watchEndpoint.unserializedPrefetchData.playerResponse.adSlots","","propsToMatch","/resolve_url?"],["set-constant","DTM.trackAsyncPV","noopFunc"],["set-constant","pa","{}"],["set-constant","Object.prototype.setConfigurations","noopFunc"],["prevent-xhr","/gtm.js"],["set-constant","Object.prototype.bk_addPageCtx","noopFunc"],["set-constant","Object.prototype.bk_doJSTag","noopFunc"],["set-constant","_gsq","{}"],["set-constant","_gsq.push","noopFunc"],["set-constant","_gsDevice"],["set-constant","google.ima.settings.setDisableFlashAds","noopFunc"],["set-constant","populateClientData4RBA","noopFunc"],["set-constant","YT.ImaManager","noopFunc"],["set-constant","UOLPD","{}"],["set-constant","UOLPD.dataLayer","{}"],["set-constant","__configuredDFPTags","{}"],["set-constant","URL_VAST_YOUTUBE","{}"],["set-constant","initializeNewRelic","noopFunc"],["trusted-replace-node-text","script","!function","setTimeout((()=>{document.querySelectorAll(\"a[href]\").forEach((e=>{Object.keys(e).forEach((t=>{t.startsWith(\"__reactProps\")&&\"function\"==typeof e[t].onClick&&e[t].onClick.toString().includes(\"preventDefault\")&&(e[t].onClick=void 0)}))}))}),3e3);!function"],["set-constant","ShowRewards","noopFunc"],["prevent-fetch","cloudflare.com/cdn-cgi/trace"],["set-constant","_vwo_code","{}"],["set-constant","gtag","noopFunc"],["set-constant","_taboola","{}"],["set-constant","_taboola.push","noopFunc"],["set-constant","gtm","{}"],["set-constant","gtm.trackEvent","noopFunc"],["set-constant","WURFL","{}"],["set-constant","Adkit","noopFunc"],["prevent-addEventListener","click","","elements",".dropdown-menu a[href]"],["set-constant","executaGoogleAnalytics3","noopFunc"],["set-constant","RISKX","{}"],["set-constant","RISKX.go","noopFunc"],["set-constant","RISKX.setSid","noopFunc"],["set-constant","Object.prototype.componentInScreen","noopFunc"],["set-constant","Sentry","{}"],["set-constant","Sentry.onLoad","noopFunc"]];
const HOSTS = {"youtube-nocookie.com":[0,1,2,3,4,5,6],"gamer.com.tw":[7],"autobytel.com":[8],"pennlive.com":[9,10,11],"electrek.co":[12],"wunderground.com":[8,13,14,15,16],"4tube.com":[17,18],"taroot-rangi.com":[19],"1337x.unblock2.xyz":[20,21,22],"noticias.gospelmais.com.br":[23],"luxuretv.com":[24,25,26],"webcheats.com.br":[27,28],"onlinetv.planetfools.com":[29],"planetfools.com":[30],"linx.cc":[31],"eroprofile.com":[32],"boysfood.com":[33],"iiv.pl":[34],"themeslide.com":[35,36],"vidoza.net":[37,38,39],"thewebflash.com":[40],"pageflutter.com":[41,42],"psychologyjunkie.com":[41,42],"slate.com":[43,44,45],"lejdd.fr":[46,47],"foxsports.com.au":[48],"thesimsresource.com":[49,50,51],"gnomio.com":[52],"hotcopper.com.au":[53,54],"inhabitat.com":[55],"speedtest.net":[56],"hd-analporn.com":[57,37],"xxxtubenote.com":[57,37],"lebensmittelpraxis.de":[58],"ojogos.com.br":[59],"goto.com.np":[21,60],"freiepresse.de":[61],"anallievent.com":[62],"disneyfashionista.com":[62],"heresyoursavings.com":[62],"lovegrowswild.com":[62],"alcasthq.com":[63],"duellinksmeta.com":[37],"pornve.com":[64,38],"maxcheaters.com":[65],"dailybulletin.com":[66],"tampabay.com":[66],"salamanca24horas.com":[67],"canberratimes.com.au":[48],"nowtv.com.tr":[68],"diminimalis.com":[69],"worldaide.fr":[70],"ohorse.com":[71],"bracontece.com.br":[69],"indofirmware.site":[69],"oportaln10.com.br":[69],"fatgirlskinny.net":[72],"pandajogosgratis.com.br":[73],"linkspaid.com":[74,75],"portnywebcam.com":[76],"candyteenporn.com":[77,78],"japansex.me":[77,78],"redsexhub.com":[77,78],"wetasiancreampie.com":[77,78],"twister.porn":[21],"dokumen.tips":[79],"movstube.net":[80,81],"clasicotas.org":[82,38],"daizurin.com":[83],"thehindu.com":[84],"streamhentaimovies.com":[85],"bharian.com.my":[46],"watchfreexxx.net":[86,87,17,88,89,90,91],"shemalepower.xyz":[38],"letmejerk.com":[17,92],"blwideas.com":[93,94,62],"fanatik.com.tr":[93,94,62],"milliyet.com.tr":[93,94,62],"theavtimes.com":[93,94,62],"thisisourbliss.com":[93,94,62],"diaridegirona.cat":[95,96],"ktmx.pro":[97],"netflixporno.net":[98,38],"watchfreexxx.pw":[98,38],"pipocamoderna.com.br":[69],"reverso.net":[99],"yumstories.com":[100],"gosexpod.com":[101,100,102],"thousandbabes.com":[103],"cherrynudes.com":[104],"imagetwist.com":[105,106],"nilopolisonline.com.br":[107],"friars.com":[108],"olemisssports.com":[108],"tulsahurricane.com":[108],"goutsa.com":[108],"wkutickets.com":[108],"ksuowls.com":[108],"midwestconference.org":[108],"rmacsports.org":[108],"uclabruins.com":[108],"calbears.com":[108],"insidekstatesports.com":[108],"insidekstatesports.info":[108],"insidekstatesports.net":[108],"insidekstatesports.org":[108],"k-statefootball.net":[108],"k-statefootball.org":[108],"ukathletics.com":[108],"news18.com":[109],"femina.ch":[110],"vttpi.com":[111],"shop123.com.tw":[112],"warps.club":[113],"nowosci.com.pl":[114],"to.com.pl":[114],"thgss.com":[115],"watchallchannels.com":[116],"semuanyabola.com":[117],"jumpmanclubbrasil.com.br":[118],"qpython.club":[119],"paginadanoticia.com.br":[120],"aachener-nachrichten.de":[121],"autoextrem.de":[121],"autorevue.at":[121],"einfachschoen.me":[121],"fanfiktion.de":[121,122],"funandnews.de":[121],"geniale-tricks.com":[121],"ikz-online.de":[121],"landwirt.com":[121],"laut.de":[121],"lustaufsleben.at":[121],"lustich.de":[121],"manager-magazin.de":[121],"och.to":[121],"profil.at":[121],"promobil.de":[121],"radio.at":[121],"radio.de":[121],"radio.dk":[121],"radio.es":[121],"radio.fr":[121],"radio.it":[121],"radio.net":[121],"radio.pl":[121],"radio.pt":[121],"radio.se":[121],"sozialversicherung-kompetent.de":[121],"tagesspiegel.de":[121,123],"taschenhirn.de":[121],"winfuture.de":[121,124,125,54,126],"wunderweib.de":[121],"ze.tt":[121],"thehayride.com":[127],"b9good.co":[128],"brilian-news.id":[128],"cell47.com":[128],"cuevana3.fan":[128],"everia.club":[128,129,130],"fsicomics.com":[128,131,132],"gemstreams.com":[128],"hentais.tube":[128,133],"hitprn.com":[128,134],"javhun.com":[128,134],"krussdomi.com":[128],"movieswbb.com":[128],"moviewatch.com.pk":[128],"myonvideo.com":[128],"myvidplay.com":[128,135,136,38],"nu6i-bg-net.com":[128,137],"pornez.net":[128],"pornotorrent.com.br":[128],"shinden.pl":[128,138,139],"softairbay.com":[128],"thesexcloud.com":[128],"tvpclive.com":[128,138],"uns.bio":[128,38],"watchbrooklynnine-nine.com":[128],"watchkobestreams.info":[128],"watchlostonline.net":[128,38],"yabai.si":[128],"adultporn.com.es":[134],"algodaodocescan.com.br":[134,138,140],"aoashimanga.com":[134],"bbw.com.es":[134],"bestsextoons.com":[134],"bigboobs.com.es":[134],"bigwank.com":[134],"bokepxv.com":[134],"bollywoodx.org":[134],"bucetaspeludas.com.br":[134],"centralboyssp.com.br":[134],"comicsvalley.com":[134],"dirtytamil.com":[134],"filmyporno.tv":[134],"gayforfans.com":[134,91,141],"gayvideo.me":[134],"ghettopearls.com":[134],"hentaiasmr.moe":[134,142],"hentaiblue.net":[134],"hentaihaven.com":[134],"hentaihaven.red":[134],"japanfuck.com.es":[134],"javxxx.me":[134],"justsexpictures.com":[134],"kvador.com":[134],"migliori-escort.com":[134],"mommyporntube.com":[134],"nightlifeporn.com":[134],"onlyfanvideo.com":[134],"porntry.com":[134],"punishworld.com":[134,143,91],"rubias19.com":[134],"scatnetwork.com":[134],"shemalemovies.us":[134],"thotslife.com":[134],"tokyo-ghoul.online":[134],"vkrovatku.com":[134],"voyeurblog.net":[134],"xanimehub.com":[134,144],"xxxlesvianas.com":[134],"xxxshut.com":[134,140],"youngleak.com":[134,91,145,88],"yuvideos.com":[134],"m-hentai.net":[131],"x-fetish.tube":[131,136],"xxxvideohd.net":[131],"homemoviestube.com":[142,136,146,147],"leakav.com":[142],"mangaraw1001.cc":[142],"pantieshub.net":[142,148],"pelimeli.com":[142],"pornosubtitula2.com":[142,140],"agedtubeporn.com":[37,57],"do-xxx.com":[37,57],"nakedbbw-sex.com":[37,57],"pornonote.pro":[37,57],"sexhardtubes.com":[37,57],"dailyangels.com":[100],"nakedneighbour.com":[149],"filmpornofrancais.fr":[91],"porndrake.com":[91,150,21],"hentai-moon.com":[151,152,153],"moviesda9.co":[154],"share.filesh.site":[154,138],"tapeadsenjoyer.com":[154,138,155,156,157,38,158,159],"tutlehd4.com":[154],"streaming-one.com":[39],"streamloverx.com":[39],"airportseirosafar.com":[160],"jewelry.com.my":[160,161,162],"anime-sanka.com":[161],"fboxtv.com":[161],"hikarinoakari.com":[161],"jockantv.com":[161,138,21,163],"lustholic.com":[161],"modsfire.com":[161,54],"traveldesearch.com":[161],"vbox7-mp3.info":[161],"warefree01.com":[161],"androidapks.biz":[162,21],"cloudy.pk":[162,135],"embed.meomeo.pw":[162],"emulatorsite.com":[162,21],"linksdegrupos.com.br":[162],"movies-watch.com.pk":[162],"seriezloaded.com.ng":[162,164],"sitepdf.com":[162,21],"softwaresite.net":[162,21],"beammeup.com.au":[165],"nbch.com.ar":[165],"multifaucet.org":[166],"antenasports.ru":[138,167],"d000d.com":[138,168,169,170,80,38],"engvideo.net":[138],"filmyhitt.com.in":[138],"isaidub6.net":[138],"itopmusic.com":[138,140],"linkedmoviehub.top":[138],"movielinkhub.xyz":[138],"naijachoice.com.ng":[138],"nowsportv.nl":[138],"tennisonline.me":[138,171,172],"uupbom.com":[138,38],"viidshar.com":[138],"1mov.lol":[135],"26efp.com":[135],"animeyabu.org":[135,173,174,175,176],"aniwatchtv.to":[135],"fastdownload.top":[135],"medeberiya.site":[135,140,177],"movieku.ink":[135],"tinyzonetv.cc":[135],"ups2up.fun":[135,178,136,155,179,180],"video-seed.xyz":[135],"file4go.net":[181],"jav.direct":[136,182],"jav.si":[136],"thefappening.pro":[136],"1stream.eu":[183,38],"audioz.download":[183],"eurekaddl.baby":[183],"ext.to":[183],"motogpstream.me":[183],"brobokep.org":[184],"glodls.to":[172,185],"manhwalist.com":[172],"embed.nextgencloudtools.com":[186],"watch-movies.com.pk":[186],"picngt.shop":[187,188,189],"51sec.org":[140],"adsy.pw":[140,190,177,191],"amtil.com.au":[140],"animesonlineshd.com":[140],"anmup.com.np":[140],"autoindustry.ro":[140],"azrom.net":[140,192,114],"bearchasingart.com":[140],"bibliotecahermetica.com.br":[140],"bitzite.com":[140,177,193,194,195,196,197,198,199,200,201],"cimbusinessevents.com.au":[140],"code-source.net":[140],"codeandkey.com":[140],"codeastro.com":[140],"dipprofit.com":[140],"doumura.com":[140],"edivaldobrito.com.br":[140],"egram.com.ng":[140],"empleo.com.uy":[140],"eramuslim.com":[140],"financeyogi.net":[140],"forex-yours.com":[140],"freefireupdate.com":[140],"freemedicalbooks.org":[140],"freshersgold.com":[140],"gadgetxplore.com":[140],"games-manuals.com":[140],"giuseppegravante.com":[140],"gogetapast.com.br":[140],"hellenism.net":[140],"highdefdiscnews.com":[140],"hotspringsofbc.ca":[140],"indratranslations.com":[140],"inertz.org":[140],"informatudo.com.br":[140],"isabihowto.com.ng":[140],"jobsibe.com":[140],"jrlinks.in":[140],"juninhoscripts.com.br":[140],"kobitacocktail.com":[140],"kodaika.com":[140],"korogashi-san.org":[140],"latinlucha.es":[140],"letrasgratis.com.ar":[140],"librasol.com.br":[140],"lotus-tours.com.hk":[140],"lucrebem.com.br":[140],"maps4study.com.br":[140],"marketrevolution.eu":[140],"medeberiya1.com":[140,177],"midis.com.ar":[140],"mixmods.com.br":[140],"mmoovvfr.cloudfree.jp":[140],"mmorpgplay.com.br":[140],"multimovies.tech":[140],"nocsummer.com.br":[140],"piximfix.com":[140],"protestia.com":[140],"ranjeet.best":[140],"rbscripts.net":[140],"revistaapolice.com.br":[140],"rv-ecommerce.com":[140],"ryansharich.com":[140],"samurai.rzword.xyz":[140],"savegame.pro":[140],"sullacollina.it":[140],"talentstareducation.com":[140],"thiagorossi.com.br":[140],"tsubasatr.org":[140],"udemyking.com":[140],"uur-tech.net":[140],"viciante.com.br":[140],"visortecno.com":[140],"vpzserver.com":[140],"worthitorwoke.com":[140],"ziminvestors.com":[140],"whentostream.com":[202],"childrenslibrarylady.com":[203,204],"gruporafa.com.br":[203,204],"short1ink.com":[203,204],"mangacrab.org":[205,206,207],"shemaleraw.com":[208],"animenew.com.br":[209],"minutemirror.com.pk":[209],"fallbrook247.com":[210],"sanangelolive.com":[210],"wrestlinginc.com":[211,212],"247sports.com":[213,214,215],"didyouknowfacts.com":[213],"fark.com":[213],"imgur.com":[213,216,217,218],"lettyskitchen.com":[213],"musicfeeds.com.au":[213],"news.com.au":[213],"nordot.app":[213],"pagesix.com":[213,219,220],"sheknows.com":[213],"worldsurfleague.com":[213],"wyborkierowcow.pl":[213],"10tv.com":[221],"binghamtonhomepage.com":[221],"fox21news.com":[221],"kare11.com":[221],"krqe.com":[221],"localmemphis.com":[221],"phl17.com":[221],"wearegreenbay.com":[221],"wfaa.com":[221],"wlns.com":[221],"christianity.com":[222],"liveoutdoors.com":[11],"theaustralian.com.au":[223,222],"thehealthy.com":[222],"augustachronicle.com":[224],"battlecreekenquirer.com":[224],"beaconjournal.com":[224],"fayobserver.com":[224],"jacksonsun.com":[224],"jconline.com":[224],"savannahnow.com":[224],"staugustine.com":[224],"tauntongazette.com":[224],"thenews-messenger.com":[224],"dualshockers.com":[13,225,132],"surfer.com":[226,227,228,229,230],"travelhost.com":[226,227,228,229,230],"eurointegration.com.ua":[124],"footballtransfer.com.ua":[124],"pravda.com.ua":[124,231],"sportanalytic.com":[124],"sportsseoul.com":[124],"capital.fr":[232,233],"uppercutmma.com":[232,233],"mustang6g.com":[232,234],"pcgamer.com":[232,235,9],"tomshardware.com":[232,235],"rvguide.com":[236],"in-cumbria.com":[237],"packhacker.com":[232,238],"plotek.pl":[232,239],"huffpost.com":[240,241,242],"forum.mobilism.me":[243],"jaysbrickblog.com":[54,212],"euronews.com":[232,239],"cinema.com.my":[244],"giornalone.it":[244],"doviz.com":[47,245],"songfacts.com":[47],"kreuzwortraetsel.de":[246,54],"adrenaline.com.br":[239],"sparkchess.com":[247],"hvac-talk.com":[54],"lacuarta.com":[54],"nouvelobs.com":[54],"popdaily.com.tw":[54],"powerpyx.com":[54],"tunebat.com":[54],"universalis.fr":[54],"v8sleuth.com.au":[54],"kirarafan.com":[54],"kyousoku.net":[54],"shuraba-matome.com":[54],"modernhoney.com":[54,42],"boltbeat.com":[248,249],"lakeshowlife.com":[248,249],"nflspinzone.com":[248,249],"phinphanatic.com":[248,249],"ripcityproject.com":[248,249],"southsideshowdown.com":[248,249],"expressandstar.com":[250],"sekunde.lt":[54],"fizzlefakten.de":[250],"emisoras-puertorico.com":[251],"emisorascolombianas.co":[251],"radio-belgie.be":[251],"radio-canada-online.com":[251],"radio-philippines.com":[251],"radioindia.in":[251],"radios-venezuela.com":[251],"ladbible.com":[252],"businessinsider.com.pl":[253],"cpu-monkey.com":[254],"picks.my":[254],"reneweconomy.com.au":[254,255],"smithsonianmag.com":[254,256,257],"vclock.com":[255],"saabcentral.com":[254,54],"16powers.com":[212],"2xkofire.com":[212],"abnormalreturns.com":[42],"acrylgiessen.com":[42],"adayinourshoes.com":[42],"adishofdailylife.com":[42],"agirlandagluegun.com":[42],"aimlief.com":[42],"alexjessicamills.com":[42],"allaboutplanners.com.au":[42],"allears.net":[42],"allthedifferences.com":[42],"allthehealthythings.com":[42],"allthingsjewelryy.com":[42],"alwaysusebutter.com":[42],"amandacooksandstyles.com":[42],"amybakesbread.com":[42],"anewwayforward.org":[42],"apaigeofpositivity.com":[42],"apetogentleman.com":[42],"aroundtheworldpluskids.com.au":[42],"asweetpeachef.com":[42],"autismforums.com":[42],"avirtuouswoman.org":[42],"backyarddigs.com":[42],"bakingmehungry.com":[42],"beatofhawaii.com":[42],"bellybelly.com.au":[42],"bemorewithless.com":[42],"benandme.com":[42],"bitesofwellness.com":[42],"blackgirlnerds.com":[42],"blissfullylowcarb.com":[42],"bookanalysis.com":[42],"boothfindernyc.com":[42],"boxingdaily.com":[42],"breedingbusiness.com":[42],"brisbanekids.com.au":[42],"browneyedbaker.com":[42],"bulbagarden.net":[42,258],"butterbeready.com":[42],"buythiscookthat.com":[42],"by-pink.com":[42],"calculateme.com":[42],"castironrecipes.com":[42],"castleinthemountains.com":[42],"charlottefashionplate.com":[42],"chocolatewithgrace.com":[42],"chopstickchronicles.com":[42],"chordsworld.com":[42],"christinascucina.com":[42],"cinenerdle2.app":[42],"clashguideswithdusk.net":[42],"cleanandscentsible.com":[42],"confettiandbliss.com":[42],"contexturesblog.com":[42],"convertbinary.com":[42],"cookiesandcups.com":[42],"cookingbride.com":[42],"cookwithdana.com":[42],"couponsandfreebiesmom.com":[42],"cozinhalegal.com.br":[42],"cozydiyhome.com":[42],"craftylittlegnome.com":[42],"cre8tioncrochet.com":[42],"dayhikesneardenver.com":[42],"deliacreates.com":[42],"detroitsportsforum.com":[42],"dimsimlim.com":[42],"dinnersdonequick.com":[42],"dishingupthedirt.com":[42],"divaliciousrecipes.com":[42],"diycandy.com":[42],"earth911.com":[212],"easyhomemadelife.com":[212],"eatthebite.com":[212],"eatwithcarmen.com":[212],"edibleperspective.com":[212],"eggsallways.com":[212],"electricians.forum":[212],"electricteeth.com":[212],"englishbulldognews.com":[212],"enzasquailhollowkitchen.com":[212],"errenskitchen.com":[212],"etiquetteschoolofamerica.com":[212],"exclusivepumping.com":[212],"expedition33.gg":[212],"famivita.com.br":[42],"fantasyfootballreports.com":[42],"fatforweightloss.com.au":[42],"fillingandfabulous.com":[42],"flightaware.com":[42],"flighthacks.com.au":[42],"floridatravelwithkids.com":[42],"foodieandwine.com":[42],"fordauthority.com":[42],"fromicecreamtosteak.com":[42],"frugalfun4boys.com":[42],"frvr.com":[42],"fuelly.com":[42],"funmoneymom.com":[42],"funwithoutfodmaps.com":[42],"gedpracticequestions.com":[42],"getinspiredeveryday.com":[42],"giftofhospitality.com":[42],"goldengracekitchen.com":[42],"golfergeeks.com":[42],"gopresstimes.com":[42],"greaterlongisland.com":[42],"greatschools.org":[42],"greedygirlgourmet.com":[42],"greencoast.org":[42],"greenvalleykitchen.com":[42],"greenweddingshoes.com":[42],"greetingcardpoet.com":[42],"gsowners.com":[42],"guitarstrive.com":[42],"halicopteraway.com":[42],"happyorganizedlife.com":[42],"hauteandhealthyliving.com":[42],"hawaii.com":[42],"healthtoempower.com":[42],"healthyfloflo.com":[42],"healthykitchen.com":[42],"healthynibblesandbits.com":[42],"herpackinglist.com":[42],"highheelsandgrills.com":[42],"hobbyhelp.com":[42],"hollywoodhomestead.com":[42],"homefortheharvest.com":[42],"homemadehome.com":[42],"homemadehooplah.com":[42],"homesteadingfamily.com":[42],"housekeen.com":[42],"houseofhepworths.com":[42],"houstonherald.com":[42],"huddle.today":[42],"hungryrunnergirl.com":[42],"ikneadtoeat.com":[42],"imafoodie.com.au":[42],"infinite-fusion.net":[42],"intoindiegames.com":[42],"irv2.com":[42],"isavea2z.com":[42],"ishouldbemoppingthefloor.com":[42],"italianchef.com":[42],"itsalwaysautumn.com":[42],"jessifearon.com":[212],"jupiter.recipes":[212],"jz-eats.com":[212],"kidgredients.com.au":[212],"killingthyme.net":[212],"kinsta.cloud":[212],"kitchen335co.com":[212],"kitchenconfidante.com":[212],"knittingwithchopsticks.com":[212],"kosheronabudget.com":[212],"kwokspots.com":[212],"laughingplace.com":[212],"laughingspatula.com":[212],"leafyplace.com":[212],"learnmetrics.com":[212],"leelalicious.com":[212],"lifecurrentsblog.com":[212],"lifeinmini.com":[212],"lifeisaparty.ca":[212],"liftvault.com":[212],"littlecoffeefox.com":[212],"livingwellforseniors.com":[212],"lowcalicious.com":[212],"magicalclan.com":[42],"mamaofminis.com":[42],"mamaslaundrytalk.com":[42],"marlybird.com":[42],"mathwarehouse.com":[42],"merrillfotonews.com":[42],"mirlandraskitchen.com":[42],"mittengirl.com":[42],"mjsoffthehookdesigns.com":[42],"modernfarmhouseeats.com":[42],"mommyhatescooking.com":[42],"mostcraft.com":[42],"motorbiscuit.com":[42],"mychoiceschools.com.au":[42],"myjoyfilledlife.com":[42],"mykitchenescapades.com":[42],"mykitchenserenity.com":[42],"myspicetrunk.com":[42],"naturalbeachliving.com":[212],"naturallysavvy.com":[212],"ninahendrick.com":[212],"nishkitchen.com":[212],"nobakerecipes.com":[212],"nonamehiding.com":[212],"nremtpracticetest.com":[212],"nutrient-matters.com":[212],"ohsobeautifulpaper.com":[212],"onceuponachef.com":[212],"onohawaiianrecipes.com":[212],"onsuttonplace.com":[212],"orlandodatenightguide.com":[212],"ourcraftycocktails.com":[212],"outgrilling.com":[212],"overthebigmoon.com":[212],"panlasangpinoy.com":[42],"pbfingers.com":[42],"perchancetocook.com":[42],"periodnirvana.com":[42],"phlebotomypracticetest.net":[42],"pieladybakes.com":[42],"pistolsfiringblog.com":[42],"poshplate.us":[42],"powershellfaqs.com":[42],"practicallyhomemade.com":[42],"pressurecookingtoday.com":[42],"printablesforlife.com":[42],"prodigalpieces.com":[42],"protoolreviews.com":[42],"putacupinit.com":[42],"rachelcooksthai.com":[212],"radiokorea.com":[212],"ram-rho.com":[212],"randomstreetview.com":[212],"ratrelief.com":[212],"rdr2.org":[212],"readingmiddlegrade.com":[212],"reallifeathome.com":[212],"recetatipica.com":[212],"recetatipica.net":[212],"recipesthatcrock.com":[212],"redcurrantbakery.com":[212],"relationshipculture.com":[212],"resplendentkitchen.com":[212],"returnpolicyguide.com":[212],"richlyrooted.com":[212],"roadbikerider.com":[212],"rocketryforum.com":[212],"rockguitaruniverse.com":[212],"runeterrafire.com":[212],"runtoradiance.com":[212],"sailorbailey.com":[42],"saltandwind.com":[42],"saltedplains.com":[42],"samoaobserver.ws":[42],"sarahjoyblog.com":[42],"savedbylovecreations.com":[42],"savvygardening.com":[42],"sayyes.com":[42],"scrappygeek.com":[42],"seaofknowledge.org":[42],"seasonedhomemaker.com":[42],"seniortailwaggers.com":[42],"shadesofsummr.com":[42],"shakedrinkrepeat.com":[42],"shapinguptobeamom.com":[42],"shoutoutarizona.com":[42],"simplesidedishes.com":[42],"simplesimonandco.com":[42],"simplyrebekah.com":[42],"soberjulie.com":[42],"soho.com.au":[42],"southernmadesimple.com":[42],"spanishsabores.com":[42],"spoonforkbacon.com":[42],"sportsmansparadiseonline.com":[42],"squeaksandnibbles.com":[42],"startdesigngroup.com":[42],"statz.gg":[42],"sticktothemodel.com":[42],"stylinbysarita.com":[42],"stylishcelebrations.com":[42],"sugarandsparrow.com":[42],"survivingateacherssalary.com":[42],"suzyssitcom.com":[42],"sweetcreekpatterns.com":[42],"sweetestmenu.com":[42],"tarotforum.net":[42],"tecmint.com":[42],"thatonepointofview.com":[42],"thebestmods.com":[42],"theclassroomcreative.com":[42],"thecookingcollective.com.au":[42],"thecraftathomefamily.com":[42],"thedizzycook.com":[42],"thefreshcooky.com":[42],"thehivelaw.com":[42],"thehomecookskitchen.com":[42],"thehomeedit.com":[42],"thehomeschoolscientist.com":[42],"thehungrybites.com":[42],"theincrediblebulks.com":[42],"theletteredcottage.net":[42],"thelittleepicurean.com":[42],"themamahandbook.com":[42],"thematbakh.com":[42],"themontessoritwinmama.com":[42],"theorganisedhousewife.com.au":[42],"thespeckledpalate.com":[42],"theunbox.com":[42],"theworkathomewife.com":[42],"theworkathomewoman.com":[42],"theyummylife.com":[42],"thirtyhandmadedays.com":[42],"thisevergreenhome.com":[42],"thriving-glutenfree.com":[42],"thunderboltlaptop.com":[42],"toddlerdietitiantiff.com":[42],"togetherasfamily.com":[42],"topweddingsites.com":[42],"tornadopath.com":[42],"tortoiseknowledge.com":[42],"traegerforum.com":[42],"traveltomerida.com":[42],"traveltooaxaca.com":[42],"twobrokewatchsnobs.com":[42],"twomonkeystravelgroup.com":[42],"twoofwands.com":[42],"tysonsreporter.com":[42],"unscramble.me":[212],"unscramble.org":[212],"veteranslawblog.org":[212],"vickypham.com":[212],"vtcoa.com":[212],"weeatatlast.com":[212],"wellfedbaker.com":[212],"wellnourished.com.au":[212],"welovedoodles.com":[212],"whatscookinchicago.com":[212],"wifemamafoodie.com":[212],"wisforwebsite.com":[212],"wordsofdeliciousness.com":[212],"wyseguide.com":[212],"ytravelblog.com":[212],"7thgenhonda.com":[54],"altimaforums.net":[54],"aussieexotics.com":[54],"austinbassfishing.com":[54],"bcfishingreports.com":[54],"blazerevforum.com":[54],"c10trucks.com":[54],"can-amtalk.com":[54],"classic-jdm.com":[54],"coloradofisherman.com":[54],"contractortalk.com":[54],"ct200hforum.com":[54],"cycleforums.com":[54],"dootalk.com":[54],"dpselfhelp.com":[54],"driveaccord.net":[54],"duramaxforum.com":[54],"eliminatorforum.com":[54],"explorertalk.com":[54],"fjrowners.com":[54],"floridaconcealedcarry.com":[54],"fordgt500.com":[54],"gamingfora.com":[54],"gunboards.com":[54],"gunco.net":[54],"harley-davidsonforums.com":[54],"hdstreetforums.com":[54],"horseforum.com":[54],"i-paceforum.com":[54],"infinitijxforum.com":[54],"infinitiq30.org":[54],"infinitiqx50.org":[54],"justlabradors.com":[54],"kiaevforums.com":[54],"librarium-online.com":[54],"lotustalk.com":[54],"m14forum.com":[54],"magnumforumz.com":[54],"mainehuntingforums.com":[54],"manitobahuntingforum.com":[54],"morels.com":[54],"mymbonline.com":[54],"nissanversaforums.com":[54],"nv200forum.com":[54],"plantedtank.net":[54],"preservationtalk.com":[54],"r125forum.com":[54],"rangerforums.net":[54],"robloxforum.com":[54],"rollsroyceforums.com":[54],"rzforums.com":[54],"s10forum.com":[54],"santafeforums.com":[54],"savanaforum.com":[54],"slateownersforum.com":[54],"smartevforum.com":[54],"smokinvette.com":[54],"talonsxsforum.com":[54],"teslaownersonline.com":[54],"thebassbarn.com":[54],"tlxforums.com":[54],"transalpowners.com":[54],"triumphrat.net":[54],"vikingforum.net":[54],"vikingforum.org":[54],"washingtonflyfishing.com":[54],"wethearmed.com":[54],"woodworkingtalk.com":[54],"xc100forum.com":[54],"xdforum.com":[54],"yfzcentral.com":[54],"yxztalk.com":[54],"y2tube.pro":[38],"christopheruntilpoint.com":[38,259,260,136],"jeanprofessorcentral.com":[38,259,260,136],"jilliandescribecompany.com":[38,259,260,136],"richardquestionbuilding.com":[38,259,260,136],"miixdrop.net":[261],"dstyladsg.com":[262],"streamcasthub.store":[263],"javring.com":[264],"porn-pig.com":[264],"pkproject.net":[265],"googleapis.com.de":[266],"googleapis.com.do":[266],"dizipal1547.com":[267],"dizipal1576.com":[267],"trgoals1538.xyz":[268],"trgoals1540.xyz":[268],"inattv1279.xyz":[268],"inattv1281.xyz":[268],"inattv1301.xyz":[268],"inattv1328.xyz":[268],"inattv1330.xyz":[268],"kanald.com.tr":[269],"livegore.com":[270,271],"souqsky.net":[272],"hentaistream.com":[273,274],"fidlarmusic.com":[275],"creatur.io":[276],"trentotoday.it":[277],"techinferno.com":[278],"javbangers.com":[279,280,281,282,283],"linuxhint.com":[284],"androidtunado.com.br":[144],"tecnobillo.com":[285],"siz.tv":[286],"comprovendolibri.it":[287],"9jarock.org":[288],"aegeanews.gr":[289],"dynastyseries.com":[289],"hidefninja.com":[290,291],"watch.foodnetwork.com":[292],"share1223.com":[290],"hindustantimes.com":[293,294],"cachevalleydaily.com":[295],"sshconect.com.br":[118],"radionylive.com":[296],"absolugirl.com":[100],"super-games.cz":[149],"hentaianimedownloads.com":[297],"tubsxxx.com":[298],"camlovers.tv":[299],"kisahdunia.com":[300],"deviants.com":[146],"pinoyalbums.com":[301],"tyler-brown.com":[302,134],"infofuge.com":[303],"foxhq.com":[304],"10.com.au":[305,306,307,308],"10play.com.au":[305,307,308],"pornohans.com":[309],"hardwarezone.com.sg":[310],"kitabmarkaz.xyz":[311],"sbchill.com":[311,312],"pussy-hub.com":[313],"switch520.com":[314],"alueviesti.fi":[315],"olutposti.fi":[315],"straatosphere.com":[316],"dealsfinders.blog":[317,192],"inhumanity.com":[318],"uploady.io":[319,38,320],"iimanga.com":[300],"karaokegratis.com.ar":[317],"boainformacao.com.br":[321],"globfone.com":[322],"italianporn.com.es":[80],"mrgay.com":[323,38],"media.cms.nova.cz":[324],"mediatn.cms.nova.cz":[325],"hostmath.com":[276,132],"eroticity.net":[149],"acervodaputaria.com.br":[80],"ghior.com":[208],"obutecodanet.ig.com.br":[204],"sdefx.cloud":[326],"apkmagic.com.ar":[322,314],"agrarwetter.net":[327],"nosteam.com.ro":[38],"coolrom.com.au":[328,329,330],"minhaconexao.com.br":[276,331],"tamarindoyam.com":[192],"koreanbj.club":[332],"mangacrab.com":[333],"visalist.io":[321,334],"liveru.sx":[146],"gezegenforum.com":[192],"iptvapps.net":[192],"fembed9hd.com":[38,311],"hentaihaven.vip":[335],"dlpanda.com":[336],"yesdownloader.com":[34],"ilsole24ore.com":[337],"imagetotext.info":[338],"nihonkuni.com":[339,38],"nurparatodos.com.ar":[316],"javhahaha.us":[311],"lostineu.eu":[340],"falatron.com":[341],"globlenews.in":[132],"tabele-kalorii.pl":[342],"thewebsitesbridge.com":[132],"busuu.com":[343,344],"7daystodiemods.com":[345],"windowslite.net":[31,346],"telenovelas-turcas.com.es":[332,38],"xxxrip.net":[347],"steamcrackedgames.com":[38],"chromeready.com":[348],"capital.de":[349],"sempreupdate.com.br":[350],"jovemnerd.com.br":[351],"bangpremier.com":[352],"45.86.86.235":[314],"m.4khd.com":[353],"tobys.dk":[354],"texturecan.com":[355],"play.aetv.com":[356],"radiotunes.com":[357],"getthit.com":[358,359],"toolxox.com":[360,132],"manoramamax.com":[361],"foxtel.com.au":[362],"haveibeenpwned.com":[363],"iprima.cz":[364,365],"ironwinter6m.shop":[366],"karaoketexty.cz":[367,368,369],"storefront.com.ng":[192],"infidrive.net":[204,370],"9animes.ru":[204],"tinyzonetv.se":[38],"vidsrc-embed.ru":[38,158],"xhspot.com":[371,372,373,374,375,376],"play.nova.bg":[377,378],"hentaihaven.xxx":[379,38,380,381,382,383,384],"emurom.net":[385],"megane.com.pl":[132],"m.akkxs.net":[386],"bysesayeveum.com":[135,387,38],"ajt.xooit.org":[388],"onlyfaucet.com":[389],"timesnewsgroup.com.au":[390],"blisseyhusbands.com":[208],"radio.zone":[391],"vanillatweaks.net":[392],"wohnmobilforum.de":[393],"hivelr.com":[394],"dragontea.ink":[395],"texteditor.nsspot.net":[396],"eurotruck2.com.br":[397],"fansubseries.com.br":[398],"flvto.com.co":[38],"mais.sbt.com.br":[399],"sport890.com.uy":[400],"popcdn.day":[401],"player.vidplus.pro":[402],"vidplus.pro":[403],"careersatcouncil.com.au":[404],"btvplus.bg":[204,132,405,406,407],"3bmeteo.com":[408,409,410],"gecmisi.com.tr":[411,412],"carnewz.site":[179],"canela.tv":[413],"animedao.com.ru":[204],"animeyabu.net":[173,174,175,176,135],"caroloportunidades.com.br":[173,174,175,176,135,414],"file4go.com":[173,174,175,176,135],"meuanime.info":[173,174,175,176,135],"coempregos.com.br":[414],"feed2all.org":[26,415],"pngitem.com":[416],"sbs.com.au":[417,418,419,420,421,422,423,424],"chiefs.com":[425],"comdotgame.com":[426,427],"reporterpb.com.br":[428],"bypass.link":[132],"moovitapp.com":[14],"pienovels.com":[429],"colnect.com":[430,431,432,433],"rebajagratis.com":[434],"tv.latinlucha.es":[434],"bgmiupdate.com.in":[435],"bypass.city":[158],"flixbaba.com":[14],"jav.sb":[436],"mmastream.me":[437],"uindex.org":[438],"zeenews.india.com":[334],"1337x.fyi":[439],"1337x.pro":[439],"brawlify.com":[440,441,442],"gadgetbond.com":[334],"discover-sharm.com":[334],"pendujatt.com.se":[443],"deepswapnude.com":[444],"fileq.games":[445],"4tube.live":[38,446],"gniewkowo.eu":[447],"vdl.np-downloader.com":[448],"litv.tv":[449],"tsz.com.np":[450],"tdtnews.com":[451],"pics-view.com":[452],"myhentaicomics.com":[453,454],"streami.su":[455],"fileq.net":[38,456,457,458,459,460,461,462,463,464,465],"zlpaste.net":[466],"livetv.moviebite.cc":[137,467],"vidbox.dev":[137,317,445],"vidbox.vc":[137,317,445],"lineup11.net":[468,469,470],"ozbargain.com.au":[471],"bergwelten.com":[472],"play.mercadolivre.com.br":[473],"newsammo.com":[474,334],"crizyman.online":[475,476,477,478],"antonimos.de":[479,480,481,482],"tiktokrealtime.com":[479,480,481,482],"shtms.co":[483,34,484],"heqviral.com":[485],"aduzz.com":[486,487],"clksz.com":[488,38,132,489,135,490,491,31,492],"gknutshell.com":[493,416,204,494,482],"financebolo.com":[495,38],"adsfly.in":[38],"shrinkforearn.in":[496,31],"djpunjab2.in":[132],"main.sportswordz.com":[497,498],"digiztechno.com":[499,462,500,501],"tournguide.com":[499,462,500,501],"gujjukhabar.in":[502,503,504,505,506,507],"flycutlink.com":[508,134,31,38,346,509],"4khd.com":[134,510],"arolinks.com":[511,512,513,514,515,31,516],"foodtechnos.in":[517,518,519,520,521,522,523,524,525,526,527,528,529,530],"www.youtube-nocookie.com":[531],"caracol.com.co":[132,532],"cerbahealthcare.it":[533,534],"securegames.iwin.com":[535],"tiendaenlinea.claro.com.ni":[536,537],"epson.com.cn":[538,539,540],"wcvb.com":[541],"citibank.com.sg":[542],"uol.com.br":[543,544,545,546,547],"socket.pearsoned.com":[548],"reclameaqui.com.br":[549],"clickjogos.com.br":[550],"premio.io":[551],"tatacommunications.com":[552],"suamusica.com.br":[553,554,555],"eservice.directauto.com":[556,557],"smartcharts.net":[558],"9now.nine.com.au":[559],"dukeofed.org":[560],"ebc.com.br":[561],"book.trivago.com":[562,563,564],"hktvmall.com":[565],"roaringapps.com":[566,567]};
const EXCEPT = {"uii.io":["noeval"],"pingit.com":["abort-on-property-read\u0001AaDetector","abort-on-property-read\u0001open","abort-on-property-read\u0001rmVideoPlay","abort-on-property-read\u0001_pop","abort-on-property-write\u0001Fingerprint2","set-constant\u0001blurred\u0001false"],"vr.pornhat.*":["abort-on-property-read\u0001document.dispatchEvent"],"vidsrc.*":["abort-current-script\u0001EventTarget.prototype.addEventListener\u0001delete window"],"astral.sh":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"autosettings.win":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"brew.sh":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"christitus.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"community-scripts.org":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"datadoghq.*":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"deno.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"devaccellabs.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"getwink.dev":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"jetbrains.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"massgrave.dev":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"natfrp.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"ntriver.org":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"reaclassical.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"runpane.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"translate.zolatau.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl(\\.exe)? .+?\\.(exe|bat|ps1)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/(v:on|d) \\/q \\/c |^cmd .*?\\/q \\/c .*?\\bfor |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"bilibili.com":["json-prune-fetch-response\u0001data.item.[-].business_info.ad_desc\u0001\u0001/feed/rcmd"],"titulky.com":["set-constant\u0001xmxalr"],"idnes.cz":["abort-current-script\u0001HTMLIFrameElement.prototype.contentWindow"],"notube.com":["prevent-window-open"],"oxy.edu":["abort-current-script\u0001$\u0001window.open","prevent-setInterval\u0001.hide","abort-current-script\u0001$\u0001localStorage"],"money.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad","set-constant\u0001Object.prototype.rekids\u0001undefined","set-constant\u0001Object.prototype.gafSlot\u0001undefined","set-constant\u0001Object.prototype.advViewability\u0001undefined"],"kobieta.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"gadzetomania.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"fotoblogia.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"komorkomania.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wiadomosci.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"tech.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"dom.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"facet.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"film.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"finanse.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"gry.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"gwiazdy.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"ksiazki.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"kuchnia.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"moto.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"opinie.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"pogoda.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"teleshow.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"turystyka.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"wideo.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wawalove.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"autokult.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"horoskop.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"tv.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"twojeip.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"sportowefakty.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","set-constant\u0001Object.prototype.loadBunch\u0001noopFunc","abort-on-property-read\u0001Object.prototype.bodyCode"],"fitness.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","abort-on-property-read\u0001WP.inline","prevent-setTimeout\u0001/getComputedStyle[\\s\\S]*?style\\.display=\"none\"[\\s\\S]*?styleBlocked[\\s\\S]*?detected/"],"www.wp.pl":["abort-on-property-read\u0001__headpayload","abort-on-stack-trace\u0001WP\u0001r https","set-constant\u0001WP.gaf.loadBunch\u0001noopFunc"],"southpark.*":["google-ima"],"southpark.cc.com":["google-ima"],"southparkstudios.*":["google-ima"],"games.dailymail.co.uk":["abort-on-property-read\u0001Notification"],"games.dailymail.com":["abort-on-property-read\u0001Notification"],"platform.twitter.com":["json-prune-xhr-response\u0001data.home.home_timeline_urt.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/Home","json-prune-xhr-response\u0001data.search_by_raw_query.search_timeline.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/SearchTimeline","json-prune-xhr-response\u0001data.threaded_conversation_with_injections_v2.instructions.[].entries.[-].content.items.[].item.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/TweetDetail","json-prune-xhr-response\u0001data.user.result.timeline_v2.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/UserTweets","json-prune-xhr-response\u0001data.immersiveMedia.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/ImmersiveMedia"],"filmweb.pl":["abort-current-script\u0001decodeURIComponent\u0001newAdblockBoardDisplayed"],"linkneverdie.net":["prevent-setTimeout\u0001t"],"dziennik.pl":["abort-current-script\u0001parseInt\u0001adblock"],"gunauc.net":["prevent-fetch\u0001pagead2.googlesyndication.com"],"daddylive.link":["abort-on-property-read\u0001require"],"player.pl":["json-prune\u0001movie.advertising.ad_server"],"lookmovie.studio":["set-constant\u0001Yii2App.playbackTimeout\u00010"],"jobzhub.store":["trusted-replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"fitdynamos.com":["trusted-replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"labgame.io":["trusted-replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"sayphotobooth.com":["adjust-setInterval\u0001tp-time\u0001*\u00010.001"],"encurtador.postazap.com":["adjust-setInterval\u0001timer\u0001*\u00010.001"],"intercelestial.com":["adjust-setTimeout\u0001\u0001*\u00010.1"],"hubdrive.com":["prevent-window-open","prevent-addEventListener\u0001\u0001history.go"],"hubdrive.de":["prevent-window-open","prevent-addEventListener\u0001\u0001history.go"],"dziennikbaltycki.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dzienniklodzki.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dziennikpolski24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dziennikzachodni.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"echodnia.eu":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"expressbydgoski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"expressilustrowany.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetakrakowska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetalubuska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetawroclawska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gk24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gloswielkopolski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gol24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gp24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gra.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gs24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"kurierlubelski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"motofakty.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"naszemiasto.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nowiny24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nowosci.com.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nto.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"polskatimes.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"pomorska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"poranny.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"sportowy24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"strefaagro.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"strefabiznesu.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"stronakobiet.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"telemagazyn.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"to.com.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"wspolczesna.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"abczdrowie.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"job.mt.de":["prevent-setTimeout\u0001.call(null)\u000110"],"job.nw.de":["prevent-setTimeout\u0001.call(null)\u000110"],"uqload.co":["abort-current-script\u0001document.createElement\u0001break;case $."],"yandex.*":["abort-on-property-read\u0001Object.prototype.renderDirect):matches-path(/\\/(?:weather\\/|pogoda\\/|hava\\/)/"]};
class ApexJSONPath {
static compileQuery(query) {
const p = new ApexJSONPath();
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
const win = window;
const doc = document;
const nativeFnToString = Function.prototype.toString;
const NativeRegExp = RegExp;
const reflectApply = Reflect.apply;
const defineProperty = Object.defineProperty;
const getOwnDesc = Object.getOwnPropertyDescriptor;
const textContentGetter = getOwnDesc(Node.prototype, 'textContent').get;
const nativeJSONParse = JSON.parse;
const nativeJSONStringify = JSON.stringify;
const PERF_EVENT = 'apex:scriptlet-perf';
const perf = (() => {
let on = false;
try { on = win[Symbol.for('apex.scriptletPerf')] === true; } catch { /* */ }
if (!on) return null;
const now = performance.now.bind(performance);
const nativeSetTimeout = win.setTimeout.bind(win);
const NativeCustomEvent = win.CustomEvent;
const dispatch = EventTarget.prototype.dispatchEvent;
const stats = new Map();
let timer = 0;
const flush = () => {
timer = 0;
if (stats.size === 0) return;
const rows = [];
for (const [label, st] of stats) rows.push([label, st.count, st.total, st.max]);
stats.clear();
try {
reflectApply(dispatch, doc, [new NativeCustomEvent(PERF_EVENT, { detail: nativeJSONStringify({ v: 1, rows }) })]);
} catch { /* */ }
};
try { win.addEventListener('pagehide', flush, true); } catch { /* */ }
return {
now,
record(label, ms) {
let st = stats.get(label);
if (!st) { st = { count: 0, total: 0, max: 0 }; stats.set(label, st); }
st.count++;
st.total += ms;
if (ms > st.max) st.max = ms;
if (!timer) timer = nativeSetTimeout(flush, 2000);
},
};
})();
let currentScriptlet = '';
const perfLabel = (target) => `${currentScriptlet} · ${target}`;
/** Przy włączonym profilerze mierzy wywołania fn; przy wyłączonym zwraca fn bez zmian. */
function perfWrap(label, fn) {
if (perf === null) return fn;
return function (...args) {
const t0 = perf.now();
try { return reflectApply(fn, this, args); } finally { perf.record(label, perf.now() - t0); }
};
}
/** Pułapka apply dla Proxy: przy profilerze mierzy czas własny (bez czasu oryginalnej funkcji). */
function makeApplyTrap(label, run) {
if (perf === null) return (target, thisArg, args) => run(target, thisArg, args, () => reflectApply(target, thisArg, args));
return (target, thisArg, args) => {
let inner = 0;
const reflect = () => {
const t = perf.now();
try { return reflectApply(target, thisArg, args); } finally { inner += perf.now() - t; }
};
const t0 = perf.now();
try { return run(target, thisArg, args, reflect); } finally { perf.record(label, perf.now() - t0 - inner); }
};
}
const exceptionToken = 'cb' + Math.random().toString(36).slice(2);
(() => {
const previous = win.onerror;
win.onerror = function (msg, ...rest) {
if (typeof msg === 'string' && msg.includes(exceptionToken)) return true;
if (previous instanceof Function) return previous.call(this, msg, ...rest);
return undefined;
};
})();
function fnToString(fn) {
try { return nativeFnToString.call(fn); } catch { return ''; }
}
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
/** "/re/flagi" → RegExp (flagi z argumentu ignorowane), tekst → RegExp dosłowny. */
function patternToRegex(pattern, flags, verbatim = false) {
if (pattern === undefined || pattern === '') return /^/;
const m = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
if (m === null) {
const re = escapeRe(pattern);
return new NativeRegExp(verbatim ? `^${re}$` : re, flags);
}
try { return new NativeRegExp(m[1], m[2] || undefined); } catch { return /(?!)/; }
}
/** Wzorzec z opcjonalną negacją "!" i trybem "dopasuj wszystko" dla pustego. */
function initPattern(pattern, { canNegate = false, flags } = {}) {
if (pattern === undefined || pattern === '') return { matchAll: true, expect: true };
let p = pattern;
const expect = !(canNegate && p.startsWith('!'));
if (!expect) p = p.slice(1);
const m = /^\/(.+)\/([gimsu]*)$/.exec(p);
if (m) {
try { return { re: new NativeRegExp(m[1], m[2] || flags), expect }; } catch { return { re: /(?!)/, expect }; }
}
if (flags !== undefined) return { re: new NativeRegExp(escapeRe(p), flags), expect };
return { text: p, expect };
}
function testPattern(details, haystack) {
if (details.matchAll) return true;
if (details.re) return regexMatches(details.re, haystack) === details.expect;
return haystack.includes(details.text) === details.expect;
}
/** Matching is independent of earlier calls, including patterns carrying /g. */
function regexMatches(re, value) {
re.lastIndex = 0;
return re.test(value);
}
/** Varargi "nazwa, wartość, ..." → obiekt; wartości liczbowe są zamieniane na liczby. */
function parseVarargs(arr) {
const out = {};
for (let i = 0; i + 1 < arr.length; i += 2) {
const v = arr[i + 1];
out[arr[i]] = /^\d+$/.test(v) ? parseInt(v, 10) : v;
}
return out;
}
const READY_STATE = { loading: 1, asap: 1, interactive: 2, end: 2, 2: 2, complete: 3, idle: 3, 3: 3 };
function readyLevel(tokens) {
for (const t of (Array.isArray(tokens) ? tokens : [tokens])) {
const k = `${t}`;
if (Object.prototype.hasOwnProperty.call(READY_STATE, k)) return READY_STATE[k];
}
return 0;
}
/** Uruchom fn, gdy dokument osiągnie wskazany stan (domyślnie od razu). */
function runAt(fn, when) {
const target = readyLevel(when);
if (readyLevel(doc.readyState) >= target) { fn(); return; }
const onChange = () => {
if (readyLevel(doc.readyState) < target) return;
doc.removeEventListener('readystatechange', onChange, true);
fn();
};
doc.addEventListener('readystatechange', onChange, true);
}
function runAtHtmlElement(fn) {
if (doc.documentElement) { fn(); return; }
const mo = new MutationObserver(() => { mo.disconnect(); fn(); });
mo.observe(doc, { childList: true });
}
function onIdle(fn, options) {
if (win.requestIdleCallback) return win.requestIdleCallback(fn, options);
return win.requestAnimationFrame(fn);
}
/** Zastępuje metodę wskazaną łańcuchem ("Node.prototype.appendChild") pośrednikiem. */
function proxyApply(chain, handler) {
let context = globalThis;
let prop = chain;
for (;;) {
const pos = prop.indexOf('.');
if (pos === -1) break;
context = context[prop.slice(0, pos)];
if (!(context instanceof Object)) return;
prop = prop.slice(pos + 1);
}
const fn = context[prop];
if (typeof fn !== 'function') return;
if (perf === null) {
context[prop] = new Proxy(fn, {
apply(target, thisArg, args) {
return handler({
thisArg,
callArgs: args,
reflect: () => reflectApply(target, thisArg, args),
});
},
});
return;
}
const trap = makeApplyTrap(perfLabel(chain), (target, thisArg, args, reflect) => handler({ thisArg, callArgs: args, reflect }));
context[prop] = new Proxy(fn, { apply: trap });
}
const arraySlice = Array.prototype.slice;
const chainedHooks = new Map(); // łańcuch → { owner, prop, proxy, handlers }
/**
* Jak proxyApply, ale kolejne filtry na TĘ SAMĄ funkcję dopisują handler do jednego wrappera
* zamiast zakładać kolejny Proxy (Proxy(Proxy(Proxy(fn))) → jeden Proxy + lista handlerów).
* Semantyka jak przy zagnieżdżeniu: ostatnio dodany handler działa pierwszy, a jego reflect()
* wywołuje poprzedni (z kopią argumentów, jak Reflect.apply na kolejnym Proxy), aż do oryginału.
* Jeśli funkcję owinął w międzyczasie ktoś inny, powstaje nowa warstwa – kolejność zostaje zachowana.
* Używane (na razie) dla: JSON.stringify / trusted-edit-inbound-object
* i Node.prototype.appendChild / trusted-prevent-dom-bypass.
*/
function proxyApplyChained(chain, handler) {
let context = globalThis;
let prop = chain;
for (;;) {
const pos = prop.indexOf('.');
if (pos === -1) break;
context = context[prop.slice(0, pos)];
if (!(context instanceof Object)) return;
prop = prop.slice(pos + 1);
}
const fn = context[prop];
if (typeof fn !== 'function') return;
const entry = { handler, label: perf === null ? '' : perfLabel(chain) };
const hook = chainedHooks.get(chain);
if (hook && hook.owner === context && hook.prop === prop && context[prop] === hook.proxy) {
hook.handlers.push(entry);
return;
}
const handlers = [entry];
const invoke = (i, thisArg, args) => {
if (i < 0) return reflectApply(fn, thisArg, args);
const h = handlers[i];
const next = () => invoke(i - 1, thisArg, reflectApply(arraySlice, args, []));
if (perf === null) return h.handler({ thisArg, callArgs: args, reflect: next });
let inner = 0;
const reflect = () => {
const t = perf.now();
try { return next(); } finally { inner += perf.now() - t; }
};
const t0 = perf.now();
try { return h.handler({ thisArg, callArgs: args, reflect }); } finally { perf.record(h.label, perf.now() - t0 - inner); }
};
const proxy = new Proxy(fn, {
apply(target, thisArg, args) { return invoke(handlers.length - 1, thisArg, args); },
});
context[prop] = proxy;
chainedHooks.set(chain, { owner: context, prop, proxy, handlers });
}
function parsePropsToMatch(propsToMatch, implicit = '') {
const needles = new Map();
if (propsToMatch === undefined || propsToMatch === '') return needles;
for (const needle of String(propsToMatch).split(/\s+/)) {
const separator = needle.indexOf(':');
let prop = separator === -1 ? needle : needle.slice(0, separator);
let pattern = separator === -1 ? undefined : needle.slice(separator + 1);
if (prop === '') continue;
if (pattern !== undefined && /[^$\w -]/.test(prop)) {
prop = needle;
pattern = undefined;
}
if (pattern !== undefined) needles.set(prop, initPattern(pattern, { canNegate: true }));
else if (implicit !== '') needles.set(implicit, initPattern(prop, { canNegate: true }));
}
return needles;
}
/**
* Zwraca listę dopasowanych właściwości albo undefined, gdy któraś nie pasuje.
* Właściwości nieobecne w obiekcie są pomijane (jak w uBO).
*/
function matchObjectProps(needles, ...objs) {
const matched = [];
for (const obj of objs) {
if (!(obj instanceof Object)) continue;
for (const [prop, details] of needles) {
let value = obj[prop];
if (value === undefined) continue;
if (typeof value !== 'string') {
try { value = nativeJSONStringify(value); } catch { /* */ }
if (typeof value !== 'string') continue;
}
if (!testPattern(details, value)) return undefined;
matched.push(prop);
}
}
return matched;
}
const FETCH_PROPS = ['body', 'cache', 'credentials', 'duplex', 'headers', 'integrity', 'keepalive',
'method', 'mode', 'priority', 'redirect', 'referrer', 'referrerPolicy', 'url'];
function collateFetchArgs(resource, options) {
const out = {};
const copy = (src) => { for (const p of FETCH_PROPS) if (src[p] !== undefined) out[p] = src[p]; };
if (typeof resource !== 'object' || Object.prototype.toString.call(resource) !== '[object Request]') {
out.url = `${resource}`;
} else {
let clone;
try { clone = resource.clone(); } catch { /* */ }
copy(clone || resource);
}
if (typeof options === 'object' && options !== null) copy(options);
return out;
}
function respondLike(before, body) {
const after = new Response(body, { status: before.status, statusText: before.statusText, headers: before.headers });
try {
Object.defineProperties(after, {
ok: { value: before.ok },
redirected: { value: before.redirected },
type: { value: before.type },
url: { value: before.url },
});
} catch { /* */ }
return after;
}
function randomText(len) {
const chunks = [];
let size = 0;
do { const s = Math.random().toString(36).slice(2); chunks.push(s); size += s.length; } while (size < len);
return chunks.join(' ').slice(0, len);
}
/** Treść zastępcza dla prevent-fetch/prevent-xhr. */
function generateContent(trusted, directive) {
if (directive === 'true') return randomText(10);
if (directive === 'emptyObj') return '{}';
if (directive === 'emptyArr') return '[]';
if (directive === 'emptyStr') return '';
if (directive.startsWith('length:')) {
const m = /^length:(\d+)(?:-(\d+))?$/.exec(directive);
if (!m) return '';
const min = parseInt(m[1], 10);
const extent = Math.max(parseInt(m[2], 10) || 0, min) - min;
return randomText(Math.min(min + extent * Math.random(), 500000) | 0);
}
return trusted ? directive : '';
}
/**
* Szuka ścieżki "a.b.c" (z tokenami [] {} * [-] {-}) w obiekcie.
* prune=false: czy ścieżka istnieje; prune=true: usuwa wskazane właściwości.
*/
function findOwner(root, path, prune = false) {
let owner = root;
let chain = path;
for (;;) {
if (typeof owner !== 'object' || owner === null) return false;
const pos = chain.indexOf('.');
if (pos === -1) {
if (!prune) return Object.prototype.hasOwnProperty.call(owner, chain);
let modified = false;
if (chain === '*') {
for (const key in owner) {
if (!Object.prototype.hasOwnProperty.call(owner, key)) continue;
delete owner[key];
modified = true;
}
} else if (Object.prototype.hasOwnProperty.call(owner, chain)) {
delete owner[chain];
modified = true;
}
return modified;
}
const prop = chain.slice(0, pos);
const next = chain.slice(pos + 1);
let found = false;
if (prop === '[-]' && Array.isArray(owner)) {
for (let i = owner.length - 1; i >= 0; i--) {
if (findOwner(owner[i], next) === false) continue;
owner.splice(i, 1);
found = true;
}
return found;
}
if (prop === '{-}' && owner instanceof Object) {
for (const key of Object.keys(owner)) {
if (findOwner(owner[key], next) === false) continue;
delete owner[key];
found = true;
}
return found;
}
if ((prop === '[]' && Array.isArray(owner)) || ((prop === '{}' || prop === '*') && owner instanceof Object)) {
for (const key of Object.keys(owner)) {
if (findOwner(owner[key], next, prune) === false) continue;
found = true;
}
return found;
}
if (!Object.prototype.hasOwnProperty.call(owner, prop)) return false;
owner = owner[prop];
chain = next;
}
}
/** Zwraca obiekt, gdy coś usunięto, w przeciwnym razie undefined. */
function pruneObject(obj, rawPrune, rawNeedle) {
if (typeof rawPrune !== 'string' || rawPrune === '') return undefined;
const prunePaths = rawPrune.split(/ +/);
const needlePaths = rawNeedle ? rawNeedle.split(/ +/) : [];
for (const p of needlePaths) if (findOwner(obj, p) === false) return undefined;
let matched = false;
for (const p of prunePaths) if (findOwner(obj, p, true)) matched = true;
return matched ? obj : undefined;
}
/** Pułapka z obsługą wielu procedur (jak przy kilku filtrach acs na tej samej właściwości). */
const trapDb = new WeakMap();
function trapProperty(chain, handler, options = {}) {
let owner = win;
let prop = chain;
for (;;) {
const pos = prop.indexOf('.');
if (pos === -1) break;
owner = owner[prop.slice(0, pos)];
if (!(owner instanceof Object)) return undefined;
prop = prop.slice(pos + 1);
}
let handlers = trapDb.get(owner);
if (!handlers) { handlers = new Map(); trapDb.set(owner, handlers); }
let entry = handlers.get(prop);
if (entry) { entry.stack.push(handler); return entry.value; }
entry = { value: owner[prop], stack: [handler], canThrow: !!options.canThrow };
handlers.set(prop, entry);
const desc = getOwnDesc(owner, prop);
if (desc instanceof Object && (desc.get || desc.set)) entry.stack.push(desc);
try {
defineProperty(owner, prop, {
get() {
let r = entry.value;
for (const d of entry.stack) {
try { r = d.get(); } catch (e) { if (entry.canThrow) throw e; }
}
return r;
},
set(value) {
entry.value = value;
for (const d of entry.stack) {
try { d.set(value); } catch (e) { if (entry.canThrow) throw e; }
}
},
});
} catch { /* */ }
return entry.value;
}
function validateConstant(trusted, raw, extra) {
let value;
let ok = true;
if (raw === 'undefined') value = undefined;
else if (raw === 'false') value = false;
else if (raw === 'true') value = true;
else if (raw === 'null') value = null;
else if (raw === "''" || raw === '') value = '';
else if (raw === '[]' || raw === 'emptyArr') value = [];
else if (raw === '{}' || raw === 'emptyObj') value = {};
else if (raw === 'noopFunc') value = function () {};
else if (raw === 'trueFunc') value = function () { return true; };
else if (raw === 'falseFunc') value = function () { return false; };
else if (raw === 'throwFunc') value = function () { throw ''; };
else if (/^-?\d+$/.test(raw)) {
value = parseInt(raw, 10);
if (Math.abs(value) > 0x7FFF) ok = false;
} else if (trusted && raw.startsWith('json:')) {
try { value = JSON.parse(raw.slice(5)); } catch { ok = false; }
} else if (trusted && raw.startsWith('{') && raw.endsWith('}')) {
try { value = JSON.parse(raw).value; } catch { ok = false; }
} else ok = false;
if (!ok) return { ok: false };
if (extra.as === 'function') return { ok, value: () => value };
if (extra.as === 'callback') return { ok, value: () => (() => value) };
if (extra.as === 'resolved') return { ok, value: Promise.resolve(value) };
if (extra.as === 'rejected') return { ok, value: Promise.reject(value) };
return { ok, value };
}
function setConstantImpl(trusted, chain = '', rawValue = '', ...varargs) {
if (chain === '') return;
const extra = parseVarargs(varargs);
runAt(() => {
const checked = validateConstant(trusted, rawValue, extra);
if (!checked.ok) return;
let normalValue = checked.value;
const thisScript = doc.currentScript || {};
let aborted = false;
const mustAbort = (v) => {
if (trusted) return false;
if (aborted) return true;
aborted = v !== undefined && v !== null && normalValue !== undefined && normalValue !== null
&& typeof v !== typeof normalValue;
return aborted;
};
const trapProp = (owner, prop, configurable, handler) => {
if (handler.init(configurable ? owner[prop] : normalValue) === false) return;
const odesc = getOwnDesc(owner, prop);
let prevGetter;
let prevSetter;
if (odesc instanceof Object) {
try { owner[prop] = normalValue; } catch { /* */ }
if (odesc.get instanceof Function) prevGetter = odesc.get;
if (odesc.set instanceof Function) prevSetter = odesc.set;
}
try {
defineProperty(owner, prop, {
configurable,
get() { if (prevGetter !== undefined) prevGetter(); return handler.getter(); },
set(a) { if (prevSetter !== undefined) prevSetter(a); handler.setter(a); },
});
} catch { /* */ }
};
const trapChain = (owner, path) => {
const pos = path.indexOf('.');
if (pos === -1) {
trapProp(owner, path, false, {
v: undefined,
init(v) { if (mustAbort(v)) return false; this.v = v; return true; },
getter() { return doc.currentScript === thisScript ? this.v : normalValue; },
setter(a) { if (mustAbort(a) === false) return; normalValue = a; },
});
return;
}
const prop = path.slice(0, pos);
const rest = path.slice(pos + 1);
const v = owner[prop];
if (v instanceof Object || (typeof v === 'object' && v !== null)) { trapChain(v, rest); return; }
trapProp(owner, prop, true, {
v: undefined,
init(x) { this.v = x; return true; },
getter() { return this.v; },
setter(a) { this.v = a; if (a instanceof Object) trapChain(a, rest); },
});
};
trapChain(win, chain);
}, extra.runAt);
}
function replaceNodeTextImpl(nodeName = '', pattern = '', replacement = '', ...varargs) {
const reNodeName = patternToRegex(nodeName, 'i', true);
const rePattern = patternToRegex(pattern, 'gms');
const extra = parseVarargs(varargs);
const reIncludes = extra.includes || extra.condition
? patternToRegex(extra.includes || extra.condition, 'ms') : null;
const reExcludes = extra.excludes ? patternToRegex(extra.excludes, 'ms') : null;
const textFactory = (() => {
const plain = { createScript: (s) => s };
const tt = win.trustedTypes;
try {
if (tt instanceof Object && typeof tt.getPropertyType === 'function'
&& tt.getPropertyType('script', 'textContent') === 'TrustedScript') {
return tt.createPolicy('apex-' + Math.random().toString(36).slice(2), plain);
}
} catch { /* */ }
return plain;
})();
let sedCount = extra.sedCount !== undefined ? extra.sedCount : Number.MAX_SAFE_INTEGER;
const handleNode = (node) => {
const before = textContentGetter.call(node);
if (reIncludes && !regexMatches(reIncludes, before)) return;
if (reExcludes && regexMatches(reExcludes, before)) return;
if (!regexMatches(rePattern, before)) return;
rePattern.lastIndex = 0;
const after = pattern !== '' ? before.replace(rePattern, replacement) : replacement;
node.textContent = node.nodeName === 'SCRIPT' ? textFactory.createScript(after) : after;
sedCount -= 1;
};
const handleTree = (root) => {
const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
const { currentScript } = doc;
for (;;) {
const node = walker.nextNode();
if (node === null) break;
if (node === currentScript) continue;
if (regexMatches(reNodeName, node.nodeName)) handleNode(node);
else if (node.nodeName === 'TEMPLATE') handleTree(node.content);
else continue;
if (sedCount === 0) break;
}
};
if (doc.documentElement) handleTree(doc.documentElement);
const stay = Boolean(extra.stay);
if (sedCount === 0 && !stay) return;
let observer;
const handleMutations = (mutations) => {
for (const m of mutations) {
for (const node of m.addedNodes) {
if (regexMatches(reNodeName, node.nodeName)) handleNode(node);
else if (node.nodeName === 'TEMPLATE') handleTree(node.content);
else continue;
if (sedCount === 0) { stop(false); return; }
}
}
};
const stop = (takeRecords = true) => {
const pending = takeRecords ? observer.takeRecords() : [];
observer.disconnect();
handleMutations(pending);
};
observer = new MutationObserver(perfWrap(perfLabel('MutationObserver'), handleMutations));
observer.observe(doc, { childList: true, subtree: true });
if (stay) return;
runAt(() => {
const quitAfter = extra.quitAfter || 0;
if (quitAfter === 0) { stop(); return; }
setTimeout(() => stop(), quitAfter);
}, 'interactive');
}
function getCookie(name) {
for (const s of doc.cookie.split(/\s*;\s*/)) {
const pos = s.indexOf('=');
if (pos === -1) continue;
if (s.slice(0, pos) !== name) continue;
return s.slice(pos + 1).trim();
}
return undefined;
}
function setCookieImpl(trusted, name = '', value = '', expires = '', path = '', options = {}) {
let n = name;
let v = value;
if (!trusted && /[^!#$%&'*+\-.0-9A-Z[\]^_`a-z|~]/.test(n)) n = encodeURIComponent(n);
if (/[^ -:<-[\]-~]/.test(v)) v = encodeURIComponent(v);
const before = getCookie(n);
if (before !== undefined && options.dontOverwrite) return false;
if (before === v && options.reload) return false;
const parts = [n, '=', v];
if (expires !== '') parts.push('; expires=', expires);
let p = path;
if (p === '') p = '/';
else if (p === 'none') p = '';
if (p !== '' && p !== '/') return false;
if (p === '/') parts.push('; path=/');
if (trusted) {
if (options.domain) {
let domain = options.domain;
if (/^\/.+\//.test(domain)) {
const m = new NativeRegExp(domain.slice(1, -1)).exec(new URL(doc.baseURI).hostname);
domain = m ? m[0] : undefined;
}
if (domain) parts.push(`; domain=${domain}`);
}
parts.push('; Secure');
} else if (/^__(Host|Secure)-/.test(n)) {
parts.push('; Secure');
}
try { doc.cookie = parts.join(''); } catch { /* */ }
const done = getCookie(n) === v;
if (done && options.reload) win.location.reload();
return done;
}
function setStorageImpl(which, trusted, key = '', value = '', options = {}) {
if (key === '') return;
let v = value;
if (v === 'emptyArr') v = '[]';
else if (v === 'emptyObj') v = '{}';
if (trusted) {
if (v.includes('$now$')) v = v.replaceAll('$now$', Date.now());
if (v.includes('$currentDate$')) v = v.replaceAll('$currentDate$', `${Date()}`);
if (v.includes('$currentISODate$')) v = v.replaceAll('$currentISODate$', new Date().toISOString());
}
let modified = false;
try {
const storage = win[`${which}Storage`];
if (v === '$remove$') {
const re = patternToRegex(key, undefined, true);
const toRemove = [];
for (let i = 0, n = storage.length; i < n; i++) {
const k = storage.key(i);
if (regexMatches(re, k)) toRemove.push(k);
}
modified = toRemove.length !== 0;
for (const k of toRemove) storage.removeItem(k);
} else {
const before = storage.getItem(key);
const after = `${v}`;
modified = after !== before;
if (modified) storage.setItem(key, after);
}
} catch { /* */ }
if (modified && typeof options.reload === 'number') setTimeout(() => win.location.reload(), options.reload);
}
function fetchPrevent(trusted, propsToMatch = '', responseBody = '', responseType = '', ...varargs) {
const extra = parseVarargs(varargs);
const needles = parsePropsToMatch(propsToMatch, 'url');
const responseProps = { statusText: { value: 'OK' } };
const responseHeaders = {};
const validProps = {
ok: [false, true], status: [403], statusText: ['', 'Not Found'], type: ['basic', 'cors', 'default', 'error', 'opaque'],
};
if (/^\{.*\}$/.test(responseType)) {
try {
for (const [p, v] of Object.entries(JSON.parse(responseType))) {
if (p === 'headers' && trusted) { Object.assign(responseHeaders, v); continue; }
if (validProps[p] === undefined || !validProps[p].includes(v)) continue;
responseProps[p] = { value: v };
}
} catch { /* */ }
} else if (responseType !== '' && validProps.type.includes(responseType)) {
responseProps.type = { value: responseType };
}
const nativeSetTimeout = win.setTimeout;
proxyApply('fetch', (ctx) => {
if (propsToMatch === '' && responseBody === '') return ctx.reflect();
const details = collateFetchArgs(...ctx.callArgs);
const matched = matchObjectProps(needles, details);
if (matched === undefined || matched.length === 0) return ctx.reflect();
return Promise.resolve(generateContent(trusted, responseBody)).then((text) => {
const headers = Object.assign({}, responseHeaders);
if (headers['content-length'] === undefined) headers['content-length'] = text.length;
const response = new Response(text, { headers });
try { Object.defineProperties(response, { url: { value: details.url }, ...responseProps }); } catch { /* */ }
if (extra.throttle) return new Promise((resolve) => nativeSetTimeout(() => resolve(response), extra.throttle));
return response;
});
});
}
function xhrPrevent(trusted, propsToMatch = '', directive = '') {
const instances = new WeakMap();
const needles = parsePropsToMatch(propsToMatch, 'url');
const dispatch = (xhr, type) => { try { xhr.dispatchEvent(new Event(type)); } catch { /* */ } };
proxyApply('XMLHttpRequest.prototype.open', (ctx) => {
const { thisArg, callArgs } = ctx;
instances.delete(thisArg);
const [method, url, ...rest] = callArgs;
if (propsToMatch === '' && directive === '') return ctx.reflect();
const haystack = { method, url };
if (matchObjectProps(needles, haystack)) {
instances.set(thisArg, {
xhr: thisArg,
url,
defer: rest.length === 0 || !!rest[0],
directive,
headers: { date: '', 'content-type': '', 'content-length': '' },
props: { response: { value: '' }, responseText: { value: '' }, responseXML: { value: null } },
});
}
return ctx.reflect();
});
proxyApply('XMLHttpRequest.prototype.send', (ctx) => {
const d = instances.get(ctx.thisArg);
if (d === undefined) return ctx.reflect();
d.headers.date = new Date().toUTCString();
switch (ctx.thisArg.responseType) {
case 'arraybuffer':
d.props.response.value = new ArrayBuffer(0);
d.headers['content-type'] = 'application/octet-stream';
break;
case 'blob':
d.props.response.value = new Blob([]);
d.headers['content-type'] = 'application/octet-stream';
break;
case 'document': {
const parsed = new DOMParser().parseFromString('', 'text/html');
d.props.response.value = parsed;
d.props.responseXML.value = parsed;
d.headers['content-type'] = 'text/html';
break;
}
case 'json':
d.props.response.value = {};
d.props.responseText.value = '{}';
d.headers['content-type'] = 'application/json';
break;
default: {
if (directive === '') break;
const text = generateContent(trusted, d.directive);
d.props.response.value = text;
d.props.responseText.value = text;
d.headers['content-type'] = 'text/plain';
break;
}
}
if (d.defer === false) {
d.headers['content-length'] = `${d.props.response.value}`.length;
Object.defineProperties(d.xhr, {
readyState: { value: 4 }, responseURL: { value: d.url }, status: { value: 200 }, statusText: { value: 'OK' },
});
Object.defineProperties(d.xhr, d.props);
return undefined;
}
Promise.resolve().then(() => {
Object.defineProperties(d.xhr, { readyState: { value: 1, configurable: true }, responseURL: { value: d.url } });
dispatch(d.xhr, 'readystatechange');
}).then(() => {
d.headers['content-length'] = `${d.props.response.value}`.length;
Object.defineProperties(d.xhr, { readyState: { value: 2, configurable: true }, status: { value: 200 }, statusText: { value: 'OK' } });
dispatch(d.xhr, 'readystatechange');
}).then(() => {
Object.defineProperties(d.xhr, { readyState: { value: 3, configurable: true } });
Object.defineProperties(d.xhr, d.props);
dispatch(d.xhr, 'readystatechange');
}).then(() => {
Object.defineProperties(d.xhr, { readyState: { value: 4 } });
dispatch(d.xhr, 'readystatechange');
dispatch(d.xhr, 'load');
dispatch(d.xhr, 'loadend');
});
return undefined;
});
proxyApply('XMLHttpRequest.prototype.getResponseHeader', (ctx) => {
const d = instances.get(ctx.thisArg);
if (d === undefined || ctx.thisArg.readyState < 2) return ctx.reflect();
const value = d.headers[`${ctx.callArgs[0]}`.toLowerCase()];
return value !== undefined && value !== '' ? value : null;
});
proxyApply('XMLHttpRequest.prototype.getAllResponseHeaders', (ctx) => {
const d = instances.get(ctx.thisArg);
if (d === undefined || ctx.thisArg.readyState < 2) return ctx.reflect();
const out = [];
for (const [name, value] of Object.entries(d.headers)) if (value) out.push(`${name}: ${value}`);
if (out.length) out.push('');
return out.join('\r\n');
});
}
/**
* Podklasa XMLHttpRequest, która podmienia odpowiedź (tekstową lub JSON) dla
* żądań pasujących do propsToMatch. transform(innerResponse) → nowa odpowiedź.
*/
function installXhrResponseTransform(needles, rawTransform) {
const transform = perfWrap(perfLabel('XMLHttpRequest:response'), rawTransform);
const instances = new WeakMap();
const Native = win.XMLHttpRequest;
win.XMLHttpRequest = class XMLHttpRequest extends Native {
open(method, url, ...rest) {
const details = { method, url };
if (needles.size === 0 || matchObjectProps(needles, details) !== undefined) instances.set(this, details);
else instances.delete(this);
return super.open(method, url, ...rest);
}
get response() {
const inner = super.response;
const d = instances.get(this);
if (d === undefined) return inner;
if (!d.cached || d.lastResponse !== inner) {
d.lastResponse = inner;
d.response = transform(inner);
d.cached = true;
}
return d.response;
}
get responseText() {
const r = this.response;
return typeof r !== 'string' ? super.responseText : r;
}
};
}
const SCRIPTLETS = {
'set-constant'(...args) { setConstantImpl(false, ...args); },
'trusted-set-constant'(...args) { setConstantImpl(true, ...args); },
'abort-on-property-read'(chain = '') {
if (chain === '') return;
const abort = () => { throw new ReferenceError(exceptionToken); };
const makeProxy = (owner, path) => {
const pos = path.indexOf('.');
if (pos === -1) {
const desc = getOwnDesc(owner, path);
if (!desc || desc.get !== abort) {
try { defineProperty(owner, path, { get: abort, set() {} }); } catch { /* */ }
}
return;
}
const prop = path.slice(0, pos);
let v = owner[prop];
const rest = path.slice(pos + 1);
if (v) { try { makeProxy(v, rest); } catch { /* */ } return; }
const desc = getOwnDesc(owner, prop);
if (desc && desc.set !== undefined) return;
try {
defineProperty(owner, prop, {
get() { return v; },
set(a) { v = a; if (a instanceof Object) makeProxy(a, rest); },
});
} catch { /* */ }
};
makeProxy(win, chain);
},
'abort-on-property-write'(prop = '') {
if (prop === '') return;
let owner = win;
let p = prop;
for (;;) {
const pos = p.indexOf('.');
if (pos === -1) break;
owner = owner[p.slice(0, pos)];
if (!(owner instanceof Object)) return;
p = p.slice(pos + 1);
}
try {
delete owner[p];
defineProperty(owner, p, { set() { throw new ReferenceError(exceptionToken); } });
} catch { /* */ }
},
'abort-current-script'(target = '', needle = '', context = '') {
if (target === '') return;
runAtHtmlElement(() => {
const reNeedle = patternToRegex(needle);
const reContext = patternToRegex(context);
const thisScript = doc.currentScript;
const decoded = new WeakMap();
const scriptText = (el) => {
let text = textContentGetter.call(el);
if (text.trim() !== '') return text;
if (decoded.has(el)) return decoded.get(el);
const [, mime, content] = /^data:([^,]*),(.+)$/.exec(el.src.trim()) || ['', '', ''];
try { text = mime.endsWith(';base64') ? win.atob(content) : win.decodeURIComponent(content); } catch { /* */ }
decoded.set(el, text);
return text;
};
const validate = () => {
const e = doc.currentScript;
if (!(e instanceof HTMLScriptElement)) return;
if (e === thisScript) return;
if (context !== '' && regexMatches(reContext, e.src) === false) return;
if (regexMatches(reNeedle, scriptText(e)) === false) return;
throw new ReferenceError(exceptionToken);
};
let current = trapProperty(target, {
get() { validate(); return current; },
set(a) { validate(); current = a; },
}, { canThrow: true });
});
},
'prevent-addEventListener'(type = '', pattern = '', ...varargs) {
const extra = parseVarargs(varargs);
const reType = patternToRegex(type, undefined, true);
const rePattern = patternToRegex(pattern);
const targetSelector = extra.elements || undefined;
const elementMatches = (el) => {
if (targetSelector === 'window') return el === win;
if (targetSelector === 'document') return el === doc;
try {
if (el && el.matches && el.matches(targetSelector)) return true;
return Array.from(doc.querySelectorAll(targetSelector)).includes(el);
} catch { return false; }
};
const shouldPrevent = (thisArg, t, h) => {
const both = regexMatches(reType, t) && regexMatches(rePattern, h);
if (both && targetSelector !== undefined && !elementMatches(thisArg)) return false;
return both;
};
const handler = (ctx) => {
const { callArgs, thisArg } = ctx;
let t;
let h;
try {
t = String(callArgs[0]);
if (typeof callArgs[1] === 'function') h = String(fnToString(callArgs[1]));
else if (typeof callArgs[1] === 'object' && callArgs[1] !== null) {
if (typeof callArgs[1].handleEvent === 'function') h = String(fnToString(callArgs[1].handleEvent));
} else h = String(callArgs[1]);
} catch { /* */ }
if ((type !== '' || pattern !== '') && shouldPrevent(thisArg, t, h)) return undefined;
return ctx.reflect();
};
const protect = (owner) => {
const { addEventListener } = owner;
try { defineProperty(owner, 'addEventListener', { set() {}, get() { return addEventListener; } }); } catch { /* */ }
};
runAt(() => {
proxyApply('EventTarget.prototype.addEventListener', handler);
if (extra.protect) protect(EventTarget.prototype);
if (Object.prototype.hasOwnProperty.call(doc, 'addEventListener')) {
proxyApply('document.addEventListener', handler);
if (extra.protect) protect(doc);
}
if (Object.prototype.hasOwnProperty.call(win, 'addEventListener')) {
proxyApply('window.addEventListener', handler);
if (extra.protect) protect(win);
}
}, extra.runAt);
},
'prevent-setTimeout'(needle = '', delay = '') { timerPrevent('setTimeout', needle, delay); },
'prevent-setInterval'(needle = '', delay = '') { timerPrevent('setInterval', needle, delay); },
'adjust-setTimeout'(needle = '', delay = '', boost = '') { timerAdjust('setTimeout', needle, delay, boost); },
'adjust-setInterval'(needle = '', delay = '', boost = '') { timerAdjust('setInterval', needle, delay, boost); },
'prevent-window-open'(pattern = '', delay = '', decoy = '') {
const expect = !pattern.startsWith('!');
const rePattern = patternToRegex(expect ? pattern : pattern.slice(1));
const autoRemoveAfter = (parseFloat(delay) || 0) * 1000;
const nativeSetTimeout = win.setTimeout;
const createDecoy = (tag, urlProp, url) => {
const el = doc.createElement(tag);
el[urlProp] = url;
el.style.setProperty('height', '1px', 'important');
el.style.setProperty('position', 'fixed', 'important');
el.style.setProperty('top', '-1px', 'important');
el.style.setProperty('width', '1px', 'important');
doc.body.appendChild(el);
nativeSetTimeout(() => el.remove(), autoRemoveAfter);
return el;
};
const noop = function () {};
proxyApply('open', (ctx) => {
const { callArgs } = ctx;
if (regexMatches(rePattern, callArgs.join(' ')) !== expect) return ctx.reflect();
if (delay === '') return null;
if (decoy === 'blank') {
callArgs[0] = 'about:blank';
const r = ctx.reflect();
nativeSetTimeout(() => { try { r.close(); } catch { /* */ } }, autoRemoveAfter);
return r;
}
const el = decoy === 'obj' ? createDecoy('object', 'data', ...callArgs) : createDecoy('iframe', 'src', ...callArgs);
let popup = el.contentWindow;
if (typeof popup === 'object' && popup !== null) {
try { defineProperty(popup, 'closed', { value: false }); } catch { /* */ }
} else {
popup = new Proxy(win, {
get(target, prop, ...rest) {
if (prop === 'closed') return false;
const r = Reflect.get(target, prop, ...rest);
return typeof r === 'function' ? noop : r;
},
set(...rest) { return Reflect.set(...rest); },
});
}
return popup;
});
},
'prevent-fetch'(...args) { fetchPrevent(false, ...args); },
'trusted-prevent-fetch'(...args) { fetchPrevent(true, ...args); },
'prevent-xhr'(...args) { xhrPrevent(false, ...args); },
'trusted-prevent-xhr'(...args) { xhrPrevent(true, ...args); },
'remove-attr'(rawToken = '', rawSelector = '', behavior = '', ...varargs) {
if (rawToken === '') return;
const tokens = rawToken.split(/\s*\|\s*/);
const selector = tokens.map((a) => {
const b = CSS.escape(a);
return rawSelector.includes(`[${b}]`) ? rawSelector : `${rawSelector}[${b}]`;
}).join(',');
const lazily = !/\basap\b/.test(behavior);
const options = parseVarargs(varargs);
const fromNode = (node) => { for (const a of tokens) if (node.hasAttribute(a)) node.removeAttribute(a); };
const removeAll = (nodes) => {
try { for (const node of nodes || doc.querySelectorAll(selector)) fromNode(node); } catch { /* */ }
};
let timer;
const lazy = () => {
if (timer !== undefined) return;
timer = onIdle(() => { timer = undefined; removeAll(); }, { timeout: 17 });
};
let observer;
const onMutations = (mutations) => {
for (const { type, target, addedNodes, removedNodes } of mutations) {
if (type === 'attributes') {
if (lazily) { lazy(); return; }
try { if (target.matches(selector)) fromNode(target); } catch { /* */ }
continue;
}
for (const node of addedNodes) {
if (node.nodeType !== 1) continue;
if (lazily) { lazy(); return; }
try {
if (node.matches(selector)) fromNode(node);
if (node.childElementCount) removeAll(node.querySelectorAll(selector));
} catch { /* */ }
}
if (lazily) return;
for (const node of removedNodes) {
if (node.nodeType !== 1) continue;
try { if (node.matches(selector)) fromNode(node); } catch { /* */ }
}
}
};
const start = () => {
removeAll();
if (!/\bstay\b/.test(behavior) && options.quitAfter === undefined) return;
observer = new MutationObserver(onMutations);
observer.observe(doc, { attributes: true, attributeFilter: tokens, childList: true, subtree: true });
if (options.quitAfter) setTimeout(() => observer.disconnect(), options.quitAfter * 1000);
};
runAt(start, behavior.split(/\s+/));
},
'remove-class'(rawToken = '', rawSelector = '', behavior = '') {
if (rawToken === '') return;
const tokens = rawToken.split(/\s*\|\s*/);
const selector = tokens.map((a) => `${rawSelector}.${CSS.escape(a)}`).join(',');
const mustStay = /\bstay\b/.test(behavior);
let timer;
let observer;
const removeAll = () => {
timer = undefined;
try { for (const node of doc.querySelectorAll(selector)) node.classList.remove(...tokens); } catch { /* */ }
if (mustStay) return;
if (doc.readyState !== 'complete') return;
observer.disconnect();
};
const onMutations = (mutations) => {
if (timer !== undefined) return;
let skip = true;
for (let i = 0; i < mutations.length && skip; i++) {
const { type, addedNodes, removedNodes } = mutations[i];
if (type === 'attributes') skip = false;
for (let j = 0; j < addedNodes.length && skip; j++) if (addedNodes[j].nodeType === 1) skip = false;
for (let j = 0; j < removedNodes.length && skip; j++) if (removedNodes[j].nodeType === 1) skip = false;
}
if (skip) return;
timer = onIdle(removeAll, { timeout: 67 });
};
observer = new MutationObserver(onMutations);
runAt(() => {
removeAll();
observer.observe(doc, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
}, /\bcomplete\b/.test(behavior) ? 'idle' : 'loading');
},
'set-attr'(selector = '', attr = '', value = '', ...varargs) {
let v = value;
if (!['', 'false', 'true'].includes(v.toLowerCase()) && /^\d+$/.test(v)) v = `${parseInt(v, 10)}`;
setAttrImpl(false, selector, attr, v, parseVarargs(varargs));
},
'trusted-set-attr'(selector = '', attr = '', value = '', ...varargs) {
setAttrImpl(true, selector, attr, value, parseVarargs(varargs));
},
'remove-node-text'(nodeName = '', includes = '', ...varargs) {
replaceNodeTextImpl(nodeName, '', '', 'includes', includes || '', ...varargs);
},
'trusted-replace-node-text'(nodeName = '', pattern = '', replacement = '', ...varargs) {
replaceNodeTextImpl(nodeName, pattern, replacement, ...varargs);
},
'json-prune'(rawPrune = '', rawNeedle = '') {
proxyApply('JSON.parse', (ctx) => {
const before = ctx.reflect();
const after = pruneObject(before, rawPrune, rawNeedle);
return after === undefined ? before : after;
});
},
'json-prune-fetch-response'(rawPrune = '', rawNeedle = '', ...varargs) {
const extra = parseVarargs(varargs);
const needles = parsePropsToMatch(extra.propsToMatch, 'url');
const respLabel = perfLabel('fetch:response');
proxyApply('fetch', (ctx) => {
const fetchPromise = ctx.reflect();
if (needles.size !== 0 && matchObjectProps(needles, collateFetchArgs(...ctx.callArgs)) === undefined) return fetchPromise;
return fetchPromise.then((before) => before.clone().json().then(perfWrap(respLabel, (obj) => {
if (typeof obj !== 'object') return before;
const after = pruneObject(obj, rawPrune, rawNeedle);
if (typeof after !== 'object') return before;
return respondLike(before, nativeJSONStringify(after));
})).catch(() => before)).catch(() => fetchPromise);
});
},
'json-prune-xhr-response'(rawPrune = '', rawNeedle = '', ...varargs) {
const extra = parseVarargs(varargs);
installXhrResponseTransform(parsePropsToMatch(extra.propsToMatch, 'url'), (inner) => {
let obj;
if (typeof inner === 'object') obj = inner;
else if (typeof inner === 'string') { try { obj = nativeJSONParse(inner); } catch { /* */ } }
if (typeof obj !== 'object') return inner;
const after = pruneObject(obj, rawPrune, rawNeedle);
if (typeof after !== 'object') return inner;
return typeof inner === 'string' ? nativeJSONStringify(after) : after;
});
},
'trusted-replace-fetch-response'(pattern = '', replacement = '', propsToMatch = '', ...varargs) {
const rePattern = patternToRegex(pattern);
const needles = parsePropsToMatch(propsToMatch, 'url');
const extra = parseVarargs(varargs);
const reIncludes = extra.includes ? patternToRegex(extra.includes) : null;
const respLabel = perfLabel('fetch:response');
proxyApply('fetch', (ctx) => {
const fetchPromise = ctx.reflect();
if (pattern === '') return fetchPromise;
if (needles.size !== 0 && matchObjectProps(needles, collateFetchArgs(...ctx.callArgs)) === undefined) return fetchPromise;
return fetchPromise.then((before) => before.clone().text().then(perfWrap(respLabel, (textBefore) => {
if (reIncludes && regexMatches(reIncludes, textBefore) === false) return before;
const textAfter = textBefore.replace(rePattern, replacement);
if (textAfter === textBefore) return before;
return respondLike(before, textAfter);
})).catch(() => before)).catch(() => fetchPromise);
});
},
'trusted-replace-xhr-response'(pattern = '', replacement = '', propsToMatch = '', ...varargs) {
const rePattern = patternToRegex(pattern);
const extra = parseVarargs(varargs);
const reIncludes = extra.includes ? patternToRegex(extra.includes) : null;
installXhrResponseTransform(parsePropsToMatch(propsToMatch, 'url'), (inner) => {
if (typeof inner !== 'string') return inner;
if (reIncludes && regexMatches(reIncludes, inner) === false) return inner;
return inner.replace(rePattern, replacement);
});
},
'json-edit'(q = '', ...varargs) { jsonEditParse(false, q, ...varargs); },
'trusted-json-edit'(q = '', ...varargs) { jsonEditParse(true, q, ...varargs); },
'json-edit-fetch-response'(q = '', ...varargs) { jsonEditFetch(false, q, ...varargs); },
'trusted-json-edit-fetch-response'(q = '', ...varargs) { jsonEditFetch(true, q, ...varargs); },
'json-edit-xhr-response'(q = '', ...varargs) { jsonEditXhr(false, q, ...varargs); },
'trusted-json-edit-xhr-response'(q = '', ...varargs) { jsonEditXhr(true, q, ...varargs); },
'edit-inbound-object'(chain = '', pos = '', q = '') { editInbound(false, chain, pos, q); },
'trusted-edit-inbound-object'(chain = '', pos = '', q = '') { editInbound(true, chain, pos, q); },
'trusted-prevent-dom-bypass'(methodPath = '', targetProp = '') {
if (methodPath === '') return;
const install = methodPath === 'Node.prototype.appendChild' ? proxyApplyChained : proxyApply;
install(methodPath, (ctx) => {
const args = ctx.callArgs;
let elems = null;
for (let i = 0; i < args.length; i++) {
const e = args[i];
if (e instanceof HTMLElement && 'contentWindow' in e) (elems || (elems = new Set())).add(e);
}
if (elems === null) return ctx.reflect();
const r = ctx.reflect();
for (const el of elems) {
try {
if (`${el.contentWindow}` !== '[object Window]') continue;
const href = el.contentWindow.location.href;
if (href !== 'about:blank' && href !== win.location.href) continue;
if (targetProp !== '') {
let me = win;
let it = el.contentWindow;
let chain = targetProp;
for (;;) {
const pos = chain.indexOf('.');
if (pos === -1) break;
const prop = chain.slice(0, pos);
me = me[prop];
it = it[prop];
chain = chain.slice(pos + 1);
}
it[chain] = me[chain];
} else {
defineProperty(el, 'contentWindow', { value: win });
}
} catch { /* */ }
}
return r;
});
},
'set-cookie'(name = '', value = '', path = '', ...varargs) {
if (name === '') return;
setCookieImpl(false, name, value, '', path, parseVarargs(varargs));
},
'set-cookie-reload'(name = '', value = '', path = '') {
if (name === '') return;
setCookieImpl(false, name, value, '', path, { reload: 1 });
},
'trusted-set-cookie'(name = '', value = '', offset = '', path = '', ...varargs) {
trustedSetCookie(name, value, offset, path, parseVarargs(varargs));
},
'trusted-set-cookie-reload'(name = '', value = '', offset = '', path = '') {
trustedSetCookie(name, value, offset, path, { reload: 1 });
},
'remove-cookie'(needle = '', ...varargs) {
const reName = patternToRegex(needle);
const extra = parseVarargs(varargs);
const baseURL = new URL(doc.baseURI);
let targetDomain = extra.domain;
if (targetDomain && /^\/.+\//.test(targetDomain)) {
const m = new NativeRegExp(targetDomain.slice(1, -1)).exec(baseURL.hostname);
targetDomain = m ? m[0] : undefined;
}
let throttleTimer;
const throttle = (fn, ms = 500) => {
if (throttleTimer !== undefined) return;
throttleTimer = setTimeout(() => { throttleTimer = undefined; fn(); }, ms);
};
const remove = () => {
doc.cookie.split(';').forEach((cookieStr) => {
const pos = cookieStr.indexOf('=');
if (pos === -1) return;
const name = cookieStr.slice(0, pos).trim();
if (!regexMatches(reName, name)) return;
const p1 = name + '=';
const p2a = `; domain=${baseURL.hostname}`;
const p2b = `; domain=.${baseURL.hostname}`;
let p2c;
let p2d;
if (targetDomain) {
p2c = `; domain=${targetDomain}`;
p2d = `; domain=.${targetDomain}`;
} else if (doc.domain) {
const domain = doc.domain;
if (domain !== baseURL.hostname) p2c = `; domain=.${domain}`;
if (domain.startsWith('www.')) p2d = `; domain=${domain.replace('www', '')}`;
}
const p3 = '; path=/';
const p4 = '; Max-Age=-1000; expires=Thu, 01 Jan 1970 00:00:00 GMT';
doc.cookie = p1 + p4;
doc.cookie = p1 + p2a + p4;
doc.cookie = p1 + p2b + p4;
doc.cookie = p1 + p3 + p4;
doc.cookie = p1 + p2a + p3 + p4;
doc.cookie = p1 + p2b + p3 + p4;
if (p2c !== undefined) doc.cookie = p1 + p2c + p3 + p4;
if (p2d !== undefined) doc.cookie = p1 + p2d + p3 + p4;
});
};
remove();
win.addEventListener('beforeunload', remove);
if (typeof extra.when !== 'string') return;
for (const type of extra.when.split(/\s/)) {
if (!['scroll', 'keydown'].includes(type)) continue;
doc.addEventListener(type, () => throttle(remove), { passive: true });
}
},
'set-local-storage-item'(key = '', value = '', ...varargs) { setStorageImpl('local', false, key, value, parseVarargs(varargs)); },
'set-session-storage-item'(key = '', value = '', ...varargs) { setStorageImpl('session', false, key, value, parseVarargs(varargs)); },
'trusted-set-local-storage-item'(key = '', value = '', ...varargs) { setStorageImpl('local', true, key, value, parseVarargs(varargs)); },
'trusted-set-session-storage-item'(key = '', value = '', ...varargs) { setStorageImpl('session', true, key, value, parseVarargs(varargs)); },
'noeval'() { proxyApply('eval', () => undefined); },
'noeval-silent'() { proxyApply('eval', () => undefined); },
'noeval-if'(needle = '') {
const reNeedle = patternToRegex(needle);
proxyApply('eval', (ctx) => {
if (needle !== '' && regexMatches(reNeedle, String(ctx.callArgs[0]))) return undefined;
return ctx.reflect();
});
},
'nowebrtc'() {
const rtcName = win.RTCPeerConnection ? 'RTCPeerConnection'
: (win.webkitRTCPeerConnection ? 'webkitRTCPeerConnection' : '');
if (rtcName === '') return;
const noop = function () {};
const pc = function () {};
pc.prototype = {
close: noop, createDataChannel: noop, createOffer: noop, setRemoteDescription: noop,
toString() { return '[object RTCPeerConnection]'; },
};
const original = win[rtcName];
win[rtcName] = pc.bind(win);
if (original.prototype) {
original.prototype.createDataChannel = function () { return { close() {}, send() {} }; }.bind(null);
}
},
'trusted-click-element'(selectors = '', extraMatch = '', delay = '') {
if (extraMatch !== '') {
const assertions = extraMatch.split(',').map((s) => {
const pos1 = s.indexOf(':');
const s1 = pos1 !== -1 ? s.slice(0, pos1) : s;
const not = s1.startsWith('!');
const type = not ? s1.slice(1) : s1;
const s2 = pos1 !== -1 ? s.slice(pos1 + 1).trim() : '';
if (s2 === '') return undefined;
const out = { not, type };
const m = /^\/(.+)\/(i?)$/.exec(s2);
if (m !== null) { out.re = new NativeRegExp(m[1], m[2] || undefined); return out; }
const pos2 = s2.indexOf('=');
const key = pos2 !== -1 ? s2.slice(0, pos2).trim() : s2;
const value = pos2 !== -1 ? s2.slice(pos2 + 1).trim() : '';
out.re = new NativeRegExp(`^${escapeRe(key)}=${escapeRe(value)}`);
return out;
}).filter((d) => d !== undefined);
const cookies = assertions.some((o) => o.type === 'cookie')
? doc.cookie.split(/\s*;\s*/).map((s) => {
const pos = s.indexOf('=');
if (pos === 0) return undefined;
if (pos === -1) return { key: s.trim(), value: '' };
return { key: s.slice(0, pos).trim(), value: s.slice(pos + 1).trim() };
}).filter(Boolean)
: [];
const has = (haystack, needle) => haystack.some(({ key, value }) => regexMatches(needle, `${key}=${value}`));
for (const { not, type, re } of assertions) {
if (type === 'cookie' && has(cookies, re) === not) return;
}
}
const steps = (/^[;|]/.test(selectors) ? selectors.slice(1).split(selectors.charAt(0)) : selectors.split(','))
.map((a) => { const t = a.trim(); return /^\d+$/.test(t) ? parseInt(t, 10) : t; });
if (steps.length === 0) return;
const clickDelay = parseInt(delay, 10) || 1;
for (let i = steps.length - 1; i > 0; i--) {
if (typeof steps[i] !== 'string' || typeof steps[i - 1] !== 'string') continue;
steps.splice(i, 0, clickDelay);
}
if (steps.length === 1 && delay !== '') steps.unshift(clickDelay);
if (typeof steps[steps.length - 1] !== 'number') steps.push(11000);
const timeout = steps.pop();
const lookup = (directive) => {
const visible = directive.startsWith('when-visible:');
const selector = visible ? directive.slice(13) : directive;
let elems;
if (selector.startsWith('xpath:')) {
elems = [];
const res = doc.evaluate(selector.slice(6), doc, null, 7, null);
for (let i = 0; i < res.snapshotLength; i++) elems.push(res.snapshotItem(i));
} else {
try { elems = Array.from(doc.querySelectorAll(selector)); } catch { elems = []; }
}
return visible ? elems.filter((a) => a.checkVisibility({ opacityProperty: true, visibilityProperty: true })) : elems;
};
const waitForElement = (directive) => new Promise((resolve) => {
const until = Date.now() + timeout;
let observer;
let timer;
const check = () => {
const elems = lookup(directive);
if (elems.length || Date.now() >= until) {
if (observer) observer.disconnect();
if (timer) (win.cancelIdleCallback || win.cancelAnimationFrame)(timer);
resolve(elems);
return;
}
if (!observer) {
observer = new MutationObserver(check);
observer.observe(doc, { attributes: true, childList: true, subtree: true });
}
if (!timer) timer = onIdle(() => { timer = undefined; check(); }, { timeout: 151 });
};
check();
}).then((elems) => {
if (elems.length === 0) return false;
elems[0].click();
return true;
});
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const run = async () => {
while (steps.length !== 0) {
const step = steps.shift();
if (step === undefined) break;
if (typeof step === 'number') { await wait(step); continue; }
if (step.startsWith('!')) continue;
if (!(await waitForElement(step))) break;
}
};
runAtHtmlElement(run);
},
};
function timerPrevent(name, needleRaw, delayRaw) {
const not = needleRaw.charAt(0) === '!';
const reNeedle = patternToRegex(not ? needleRaw.slice(1) : needleRaw);
const range = parseRange(delayRaw);
proxyApply(name, (ctx) => {
const { callArgs } = ctx;
const a = callArgs[0] instanceof Function ? String(fnToString(callArgs[0])) : String(callArgs[0]);
if (needleRaw === '' && range.unbound) return ctx.reflect();
if (regexMatches(reNeedle, a) !== not && range.test(callArgs[1])) callArgs[0] = function () {};
return ctx.reflect();
});
}
/** Zakres opóźnienia: "", "100", "!100", "100-200", "-200", "100-". */
function parseRange(raw) {
let s = raw;
const not = s.charAt(0) === '!';
if (not) s = s.slice(1);
let min;
let max;
if (s !== '') {
const pos = s.indexOf('-');
if (pos !== 0) min = max = parseInt(s, 10) || 0;
if (pos !== -1) max = parseInt(s.slice(pos + 1), 10) || Number.MAX_SAFE_INTEGER;
}
return {
unbound: min === undefined && max === undefined,
test(v) {
const n = Math.min(Math.max(Number(v) || 0, 0), Number.MAX_SAFE_INTEGER);
if (min === max) return (min === undefined || n === min) !== not;
if (min === undefined) return (n <= max) !== not;
if (max === undefined) return (n >= min) !== not;
return (n >= min && n <= max) !== not;
},
};
}
function timerAdjust(name, needleArg, delayArg, boostArg) {
const reNeedle = patternToRegex(needleArg);
let delay = delayArg !== '*' ? parseInt(delayArg, 10) : -1;
if (Number.isNaN(delay) || !Number.isFinite(delay)) delay = 1000;
let boost = parseFloat(boostArg);
boost = !Number.isNaN(boost) && Number.isFinite(boost) ? Math.min(Math.max(boost, 0.001), 50) : 0.05;
if (perf === null) {
win[name] = new Proxy(win[name], {
apply(target, thisArg, args) {
const [a, b] = args;
if ((delay === -1 || b === delay) && regexMatches(reNeedle, a.toString())) args[1] = b * boost;
return target.apply(thisArg, args);
},
});
return;
}
win[name] = new Proxy(win[name], {
apply: makeApplyTrap(perfLabel(name), (target, thisArg, args, reflect) => {
const [a, b] = args;
if ((delay === -1 || b === delay) && regexMatches(reNeedle, a.toString())) args[1] = b * boost;
return reflect();
}),
});
}
function setAttrImpl(trusted, selector, attr, value, options) {
if (selector === '' || attr === '') return;
const copyFrom = !trusted && /^\[.+\]$/.test(value) ? value.slice(1, -1) : '';
const extract = (el) => (copyFrom !== '' ? el.getAttribute(copyFrom) || '' : value);
const apply = () => {
let elems;
try { elems = doc.querySelectorAll(selector); } catch { return false; }
for (const el of elems) {
const before = el.getAttribute(attr);
const after = extract(el);
if (after === before) continue;
if (after !== '' && /^on/i.test(attr) && attr.toLowerCase() in el) continue;
el.setAttribute(attr, after);
}
return true;
};
let timer;
const onChanged = (mutations) => {
if (timer !== undefined) return;
const work = mutations.some((m) => Array.from(m.addedNodes).some((n) => n.nodeType === 1));
if (!work) return;
timer = win.requestAnimationFrame(() => { timer = undefined; apply(); });
};
runAt(() => {
if (apply() === false) return;
const root = doc.documentElement;
if (!(root instanceof win.Node)) return;
new MutationObserver(onChanged).observe(root, { subtree: true, childList: true });
}, options.runAt || 'idle');
}
function trustedSetCookie(name, value, offset, path, options) {
if (name === '') return;
const time = new Date();
let v = value;
if (v.includes('$now$')) v = v.replaceAll('$now$', time.getTime());
if (v.includes('$currentDate$')) v = v.replaceAll('$currentDate$', time.toUTCString());
if (v.includes('$currentISODate$')) v = v.replaceAll('$currentISODate$', time.toISOString());
let expires = '';
if (offset !== '') {
if (offset === '1day') time.setDate(time.getDate() + 1);
else if (offset === '1year') time.setFullYear(time.getFullYear() + 1);
else {
if (!/^\d+$/.test(offset)) return;
time.setSeconds(time.getSeconds() + parseInt(offset, 10));
}
expires = time.toUTCString();
}
setCookieImpl(true, name, v, expires, path, options);
}
function compileJsonPath(trusted, q) {
const jsonp = ApexJSONPath.compileQuery(q);
if (!jsonp.valid) return null;
if (jsonp.hasAssignment && !trusted) return null;
return jsonp;
}
function jsonEditParse(trusted, q, ...varargs) {
const jsonp = compileJsonPath(trusted, q);
if (!jsonp) return;
const extra = parseVarargs(varargs);
const pattern = extra.matches ? initPattern(extra.matches) : null;
proxyApply('JSON.parse', (ctx) => {
const json = ctx.callArgs[0];
const obj = ctx.reflect();
if (pattern && testPattern(pattern, json) === false) return obj;
const after = jsonp.apply(obj);
return after === undefined ? obj : after;
});
}
function jsonEditFetch(trusted, q, ...varargs) {
const jsonp = compileJsonPath(trusted, q);
if (!jsonp) return;
const extra = parseVarargs(varargs);
const needles = parsePropsToMatch(extra.propsToMatch, 'url');
const respLabel = perfLabel('fetch:response');
proxyApply('fetch', (ctx) => {
const fetchPromise = ctx.reflect();
if (needles.size !== 0 && matchObjectProps(needles, collateFetchArgs(...ctx.callArgs)) === undefined) return fetchPromise;
return fetchPromise.then((before) => before.clone().json().then(perfWrap(respLabel, (obj) => {
if (typeof obj !== 'object') return before;
const after = jsonp.apply(obj);
if (after === undefined) return before;
return respondLike(before, nativeJSONStringify(after));
})).catch(() => before)).catch(() => fetchPromise);
});
}
function jsonEditXhr(trusted, q, ...varargs) {
const jsonp = compileJsonPath(trusted, q);
if (!jsonp) return;
const extra = parseVarargs(varargs);
installXhrResponseTransform(parsePropsToMatch(extra.propsToMatch, 'url'), (inner) => {
let obj;
if (typeof inner === 'object') obj = inner;
else if (typeof inner === 'string') { try { obj = nativeJSONParse(inner); } catch { /* */ } }
if (typeof obj !== 'object' || obj === null) return inner;
const after = jsonp.apply(obj);
if (after === undefined) return inner;
return typeof inner === 'string' ? nativeJSONStringify(after).replace(/\//g, '\\/') : after;
});
}
function editInbound(trusted, chain, argPosRaw, q) {
if (chain === '') return;
const jsonp = compileJsonPath(trusted, q);
if (!jsonp) return;
const argPos = parseInt(argPosRaw, 10);
if (Number.isNaN(argPos)) return;
const index = (args) => {
if (!Array.isArray(args)) return undefined;
if (argPos >= 0) return args.length <= argPos ? undefined : argPos;
return args.length < -argPos ? undefined : args.length + argPos;
};
const nativeParse = nativeJSONParse;
const nativeStringify = nativeJSONStringify;
const install = chain === 'JSON.stringify' ? proxyApplyChained : proxyApply;
install(chain, (ctx) => {
const i = index(ctx.callArgs);
if (i !== undefined) {
let clone;
try { clone = nativeParse(nativeStringify(ctx.callArgs[i])); } catch { /* */ }
if (typeof clone === 'object' && clone !== null) {
const after = jsonp.apply(clone);
if (after) ctx.callArgs[i] = after;
}
}
return ctx.reflect();
});
}
/** Ustala, które scriptlety dotyczą bieżącego hosta, i je uruchamia. */
function hostCandidates(hostname) {
const resolve = globalThis[Symbol.for('ApexAdBlocker.entityHostKeys.v1')];
if (typeof resolve === 'function') return resolve(hostname);
return hostname.split('.').map((_, i, labels) => labels.slice(i).join('.'));
}
/**
* Dołącza wyjątki #@#+js zarejestrowane przez INNE włączone listy (pliki scriptlets/<lista>-x-<id>.js,
* wstrzykiwane przed plikami tej listy). Dane pozostają w plikach listy źródłowej – tu są tylko łączone
* w pamięci strony. Brak rejestru = brak wyjątków z innych list.
*/
function withCrossListExceptions(except, listId) {
let extra;
try { extra = globalThis[Symbol.for('ApexAdBlocker.crossListScriptletExceptions.v1')]?.[listId]; } catch { /* */ }
if (!extra || typeof extra !== 'object') return except;
const merged = Object.assign(Object.create(null), except);
for (const host of Object.keys(extra)) {
const keys = extra[host];
if (!Array.isArray(keys)) continue;
merged[host] = merged[host] ? [...merged[host], ...keys] : [...keys];
}
return merged;
}
function runForHost(calls, hosts, except) {
if (typeof globalThis[Symbol.for('ApexAdBlocker.entityHostKeys.v1')] !== 'function'
&& [...Object.keys(hosts), ...Object.keys(except)].some((h) => h.endsWith('.*'))) return;
let hostname = '';
try { hostname = location.hostname; } catch { /* */ }
if (!hostname) {
try { hostname = new URL(location.ancestorOrigins[0]).hostname; } catch { return; }
}
const selected = new Set();
const excluded = new Set();
for (const h of hostCandidates(hostname)) {
const list = hosts[h];
if (list) for (const i of list) selected.add(i);
const ex = except[h];
if (ex) for (const k of ex) excluded.add(k);
}
if (excluded.has('*')) return;
for (const i of selected) {
const call = calls[i];
if (excluded.has(call.join('\u0001'))) continue;
const fn = SCRIPTLETS[call[0]];
if (!fn) continue;
currentScriptlet = call[0];
try { fn(...call.slice(1)); } catch { /* scriptlet nie może zepsuć strony */ }
}
}
runForHost(CALLS, HOSTS, withCrossListExceptions(EXCEPT, "ads"));
})();
