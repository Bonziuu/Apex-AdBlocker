/* Apex AdBlocker – scriptlety listy "Reklamy" (część 2/23). Plik generowany przez tools/build.mjs.
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
const shardKey = "scriptlets/ads-1.js:c2d2ee9b501bf3481a5a679e6efcbba2cbd4f980a686c2933d1b7c06f375ef33";
if (installed.has(shardKey)) return;
installed.add(shardKey);
const CALLS = [["trusted-replace-xhr-response","\"adPlacements\"","\"no_ads\"","/playlist\\?list=|\\/player(?:\\?.+)?$|watch\\?[tv]=/"],["set-constant","ytInitialPlayerResponse.playerAds","undefined"],["set-constant","ytInitialPlayerResponse.adPlacements","undefined"],["set-constant","ytInitialPlayerResponse.adSlots","undefined"],["set-constant","playerResponse.adPlacements","undefined"],["json-prune-fetch-response","reelWatchSequenceResponse.entries.[-].command.reelWatchEndpoint.adClientParams.isAd entries.[-].command.reelWatchEndpoint.adClientParams.isAd","","propsToMatch","url:/reel_watch_sequence?"],["json-prune","entries.[-].command.reelWatchEndpoint.adClientParams.isAd"],["trusted-replace-xhr-response","/\"adPlacements.*?([A-Z]\"\\}|\"\\}{2,4})\\}\\],/","","/playlist\\?list=|\\/player(?:\\?.+)?$|watch\\?[tv]=/"],["trusted-replace-xhr-response","/\"adPlacements.*?(\"adSlots\"|\"adBreakHeartbeatParams\")/gms","$1","/\\/player(?:\\?.+)?$/"],["trusted-replace-fetch-response","\"adPlacements\"","\"no_ads\"","player?"],["trusted-replace-fetch-response","\"adSlots\"","\"no_ads\"","player?"],["trusted-replace-node-text","script","/(\\(function serverContract\\(\\)|^if \\(window\\.ytcsi)/","(()=>{if(\"YOUTUBE_PREMIUM_LOGO\"===window.ytInitialData?.topbar?.desktopTopbarRenderer?.logo?.topbarLogoRenderer?.iconImage?.iconType||\"YOUTUBE_PREMIUM_LOGO\"===document.getElementById(\"masthead\")?.attributes?.[\"logo-type\"]?.value||location.href.startsWith(\"https://www.youtube.com/tv#/\"))return;const e=window.ytcfg.data_.INNERTUBE_CONTEXT.client.userAgent,t=[\"channel\",\"lactmilli\",\"yahi\",\"inline\"];let r=!1,o=t;const n=t=>{if(t){let r=e?.match?.(/Mozilla\\/5\\.0 \\([^)]+/)?.[0];window.ytcfg.data_.INNERTUBE_CONTEXT.client.userAgent=r?e.replace?.(r,r+\"; \"+t):e}else window.ytcfg.data_.INNERTUBE_CONTEXT.client.userAgent=e},a=()=>{let e=document.getElementById(\"movie_player\");return{player:e,response:e?.getPlayerResponse?.(),stats:e?.getStatsForNerds?.(),progress:e?.getProgressState?.(),buffer:e?.getPlayerStateObject?.()?.isBuffering}},l=(e,t,r)=>e&&\"0.00 s\"===t?.buffer_health_seconds&&\"0x0\"===t?.resolution&&r.length>0,s=()=>{let{player:e,response:t,stats:n,buffer:s}=a();e&&l(s,n,o)&&(t?.playbackTracking?.videostatsPlaybackUrl?.baseUrl?.includes?.(\"reloadxhr\")&&(o=o.slice(1)),r=!0)};document.addEventListener(\"DOMContentLoaded\",(function(){const e=()=>{let e,s,{player:i,response:d,stats:c,progress:p,buffer:y}=a();if(i&&(window.location.href.includes(\"/watch?\")||window.location.href.includes(\"/embed/\"))){if(p&&p.duration>0&&(p.loaded<p.duration||p.duration-p.current>1)||d?.videoDetails?.isLive){if(c&&!c?.debug_info?.startsWith?.(\"SSAP, AD\")){const t=new URLSearchParams(window.location.search),a=d.videoDetails?.videoId,u=d.playerConfig?.playbackStartConfig?.startSeconds||parseInt(t.get(\"t\"),10)||0,g=d.playabilityStatus?.errorScreen,w=JSON.stringify(g?.playerErrorMessageRenderer?.subreason?.runs||g?.playerInterstitialRenderer?.content?.interstitialViewModel?.description?.commandRuns);return void(\"UNPLAYABLE\"===d?.playabilityStatus?.status&&!g?.playerErrorMessageRenderer?.playerCaptchaViewModel&&w?.includes?.(\"WEB_PAGE_TYPE_UNKNOWN\")&&w?.includes?.(\"https://support.google.com/youtube/answer/3037019\")?(o=o.slice(1),o.length>0?n(o[0]):n(\"\"),r=!1,i.loadVideoById(a,u)):0===o.length?(r=!1,n(\"\")):l(y,c,o)&&r?(n(o[0]),r=!1,i.loadVideoById(a,u)):!r&&p.current-u>.1&&p.current-u<5&&location.href.includes(\"&list=\")&&null===i.getPlaylistId?.()&&(e=document.querySelector(\"yt-playlist-manager\"),s=e?.getPlaylistData?.(),s&&(e.setPlaylistData?.(s),e.setPlayerPlaybackControlData?.({playlistPanelRenderer:s}))))}c&&p.duration>0&&i.seekTo?.(p.duration)}}else o=t};e(),new MutationObserver((()=>{e()})).observe(document,{childList:!0,subtree:!0})})),window.Map.prototype.has=new Proxy(window.Map.prototype.has,{apply:(e,t,o)=>(\"onSnackbarMessage\"!==o?.[0]||r||s(),Reflect.apply(e,t,o))}),window.Array.prototype.push=new Proxy(window.Array.prototype.push,{apply:(e,t,r)=>{let o=r?.[0];return!o||\"object\"!=typeof o||\"Uint8Array\"!==o.constructor.name||o.buffer?.byteLength!==o.length||105!==o.length&&104!==o.length||(console.log(o),s()),Reflect.apply(e,t,r)}});const i={apply:(e,t,r)=>{const o=r[0];return\"function\"==typeof o&&o.toString().includes(\"onAbnormalityDetected\")&&(r[0]=function(){}),Reflect.apply(e,t,r)}};window.Promise.prototype.then=new Proxy(window.Promise.prototype.then,i)})();$1","sedCount","1","excludes","MutationObserver","condition","/serverContract|js_ld/"],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent*=\"channel\"].context.client[?.clientName==\"WEB\"]+={\"clientScreen\":\"CHANNEL\"}"],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent*=\"lactmilli\"]+={\"params\":\"8AUB\"}"],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent*=\"yahi\"]+={\"params\":\"YAHI\"}"],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent*=\"inline\"].playbackContext.contentPlaybackContext+={\"isInlinePlaybackNoAd\":true}"],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent=/channel|lactmilli|inline/].playbackContext.contentPlaybackContext.lactMilliseconds=\"${now}\""],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent=/adunit|channel|lactmilli|inline|yahi|eafg|yaf4/].playbackContext.contentPlaybackContext.referer=repl({\"regex\":\"(?:#reloadxhr)?$\",\"replacement\":\"#reloadxhr\"})"],["trusted-edit-inbound-object","JSON.stringify","0","[?.createCommentParams].context.client.userAgent=repl({\"regex\":\"/; (adunit|channel|lactmilli|inline|yahi|eafg|yaf4)\\b/\",\"replacement\":\"\"})"],["adjust-setTimeout","[native code]","17000","0.001"],["json-prune-fetch-response","adPlacements adSlots playerResponse.adPlacements playerResponse.adSlots [].playerResponse.adPlacements [].playerResponse.adSlots","","propsToMatch","/\\/player(\\?|$)/"],["json-prune-fetch-response","adPlacements adSlots playerResponse.adPlacements playerResponse.adSlots","","propsToMatch","/playlist?"],["json-prune-fetch-response","endpoint.watchEndpoint.unserializedPrefetchData.playerResponse.playerAds endpoint.watchEndpoint.unserializedPrefetchData.playerResponse.adPlacements endpoint.watchEndpoint.unserializedPrefetchData.playerResponse.adSlots","","propsToMatch","/resolve_url?"],["json-prune-xhr-response","adPlacements adSlots playerResponse.adPlacements playerResponse.adSlots [].playerResponse.adPlacements [].playerResponse.adSlots","","propsToMatch","/\\/player(?:\\?.+)?$/"],["trusted-replace-fetch-response","\"adSlots\"","\"no_ads\"","/^\\W+$/"],["remove-node-text","script","window,\"fetch\""],["trusted-prevent-dom-bypass","Node.prototype.appendChild","fetch"],["trusted-prevent-dom-bypass","Node.prototype.appendChild","Request"],["trusted-replace-fetch-response","\"adSlots\"","\"no_ads\"","/get_watch?"],["json-prune","playerResponse.adPlacements playerResponse.playerAds playerResponse.adSlots adPlacements playerAds adSlots important"],["json-edit-fetch-response","..itemSectionRenderer.contents.*[?.adSlotRenderer]","propsToMatch","/get_watch"],["abort-on-property-read","_sp_._networkListenerData"],["remove-node-text","script","DisplayAcceptableAdIfAdblocked"],["prevent-setTimeout","(null)","10"],["abort-on-property-write","_sp_"],["set-constant","adLight","true"],["remove-node-text","script","document.write"],["abort-on-property-read","jQuery.hello"],["abort-on-property-read","document.dispatchEvent"],["prevent-setTimeout","checkPub","6000"],["prevent-xhr","/\\/VisitorAPI\\.js|\\/AppMeasurement\\.js/"],["abort-current-script","btoa","BOOTLOADER_LOADED"],["remove-node-text","script","/__adblocker|html-load/","excludes","self.__next"],["abort-on-property-read","ExoLoader.serve"],["prevent-addEventListener","","_blank"],["abort-current-script","document.querySelectorAll","popMagic"],["abort-current-script","$","azar"],["set-constant","blurred","false"],["abort-on-property-read","_0x32d5"],["remove-node-text","script","antiAdBlockerHandler"],["abort-current-script","decodeURI","decodeURIComponent"],["abort-on-property-read","adbackDebug"],["remove-node-text","script","/HTMLIFrameElement|JSON\\[/","excludes","self.__next"],["abort-on-property-read","__eiPb"],["abort-on-property-read","AaDetector"],["prevent-window-open"],["set-constant","Date.now","noopFunc"],["abort-on-property-read","googletag"],["remove-node-text","script","/__adblocker|html-load/"],["prevent-fetch","googlesyndication","method:HEAD"],["abort-on-property-write","adBlockDetected"],["abort-current-script","document.getElementById","blocker_div"],["abort-current-script","document.getElementById","undefined"],["prevent-fetch","ads"],["noeval-if","/chp_?ad/"],["prevent-setTimeout","showPopup"],["set-constant","checkadBlock","noopFunc"],["prevent-addEventListener","DOMContentLoaded","adlinkfly"],["remove-node-text","script","/h=decodeURIComponent|popundersPerIP/"],["prevent-setTimeout","innerHTML"],["set-constant","google_tag_data","noopFunc"],["abort-current-script","eval","replace"],["prevent-setTimeout","show"],["abort-on-property-read","popit"],["prevent-addEventListener","popstate","noPop"],["abort-on-property-read","exoJsPop101"],["prevent-addEventListener","DOMContentLoaded","compupaste"],["abort-on-property-read","redirectURL"],["abort-on-property-read","alert"],["noeval"],["set-constant","CnnXt.Event.fire","noopFunc"],["abort-current-script","Date","='\\x"],["abort-current-script","document.head.appendChild","='\\x"],["set-constant","pr_okvalida","true"],["prevent-setTimeout","sub"],["abort-current-script","enlace"],["abort-on-property-write","downloadJSAtOnload"],["set-constant","firefaucet","true"],["abort-current-script","$","AdBlock"],["prevent-addEventListener","DOMContentLoaded","adsBlocked"],["abort-on-property-read","decodeURI"],["abort-on-property-read","ExoLoader.addZone"],["abort-on-property-read","loadTool"],["abort-on-property-read","exoNoExternalUI38djdkjDDJsio96"],["abort-current-script","document.getElementById","adsrefresh"],["prevent-setTimeout","","1"],["prevent-addEventListener","","bi()"],["remove-node-text","script","ExoLoader"],["abort-on-property-read","jwplayer.utils.Timer"],["abort-current-script","jQuery","adblock"],["set-constant","blockAdBlock","trueFunc"],["abort-current-script","$","setTimeout"],["prevent-addEventListener","","adb"],["prevent-addEventListener","load","nextFunction"],["abort-on-property-read","open"],["abort-on-property-read","adsanity_ad_block_vars"],["prevent-setTimeout","offsetWidth"],["prevent-addEventListener","","show"],["remove-node-text","script","admiral","excludes",",\\\""],["abort-current-script","$",".test"],["json-prune","data","data.availableProductCount"],["abort-on-property-read","adblockDetector"],["abort-on-property-read","googlefc"],["set-constant","fake_ad","true"],["prevent-setTimeout","native"],["adjust-setInterval","countdown","*","0.001"],["remove-node-text","script","random"],["prevent-setTimeout",".call(null)","10"],["abort-current-script","document.createElement","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/="],["remove-node-text","script","/==undefined.*body/"],["json-prune","video.channel"],["abort-on-property-read","u_cfg"],["prevent-addEventListener","","break;case $."],["remove-node-text","script","/WebAssembly|forceunder/"],["prevent-setInterval","adblock"],["abort-on-property-read","Adcash"],["adjust-setTimeout","counter"],["abort-on-property-write","decodeURI"],["abort-current-script","document.createElement","l.parentNode.insertBefore(s"],["abort-on-property-read","popns"],["prevent-addEventListener","mouseup","decodeURIComponent"],["set-cookie","downloadbypass","1"],["abort-current-script","WebAssembly","atob"],["abort-on-property-write","_pop"],["abort-current-script","navigator","FingerprintJS"],["remove-node-text","script","Exo"],["prevent-addEventListener","getexoloader"],["remove-attr","href","a[href*=\"torrentico.top/sim/go.php\"]"],["prevent-addEventListener","","pop"],["set-constant","open","undefined"],["prevent-addEventListener","click","fireAd"],["remove-node-text","script","ai_adb"],["remove-node-text","script","/popunder|contextmenu/"],["abort-current-script","pop_init"],["abort-on-property-read","Aloader.serve"],["abort-on-property-read","ExoLoader"],["prevent-setTimeout","/loadMomoVip|loadExo|includeSpecial/"],["abort-current-script","document.dispatchEvent","myEl"],["prevent-setTimeout","appendChild"],["prevent-setTimeout","Adb"],["prevent-setTimeout","offsetWidth","2000"],["trusted-replace-node-text","script","adv_","no_adv_","condition","kt_player.swf","sedCount","10"],["prevent-setTimeout","innerText","2000"],["remove-node-text","script",";}}};break;case $."],["abort-current-script","EventTarget.prototype.addEventListener","delete window"],["remove-node-text","script","FingerprintJS"],["abort-current-script","Math","zfgloaded"],["abort-on-property-read","String.fromCharCode"],["abort-current-script","JSON.parse","break;case $."],["abort-current-script","parseInt","break;case $."],["abort-current-script","document.documentElement","break;case $."],["abort-current-script","Math","break;case $."],["abort-current-script","String.fromCharCode","/btoa|break/"],["prevent-window-open","!vidsrc."],["abort-current-script","addEventListener","HTMLAllCollection"],["remove-node-text","script","wpadmngr.com"],["remove-node-text","script","adserverDomain"],["abort-on-property-write","ai_front"],["prevent-addEventListener","/click|mouse/","[native code]","elements","document"],["set-constant","PlayerConfig.trusted","true"],["set-constant","PlayerConfig.config.AffiliateAdViewLevel","3"],["abort-on-property-read","console.clear"],["adjust-setInterval","timer"],["prevent-window-open","!/prcf.fiyar|themes|pixsense|.jpg/"],["abort-current-script","document.addEventListener","google_ad_client"],["prevent-setTimeout","displayMessage","2000"],["abort-on-property-read","b2a"],["prevent-xhr","adsbygoogle"],["remove-node-text","script","html-load.com"],["adjust-setInterval","timer","*","0.001"],["prevent-setTimeout","ai_adb"],["prevent-xhr","googlesyndication"],["abort-current-script","b2a","ai_adb"],["prevent-addEventListener","load","abDetectorPro"],["prevent-fetch","/googlesyndication|doubleclick/","length:10","{\"type\": \"cors\"}"],["prevent-xhr","/googlesyndication|doubleclick/","length:10"],["abort-current-script","document.createElement","admiral"],["set-constant","admiral","noopFunc"],["remove-node-text","script","/\"v4ac1eiZr0\"|\"\"\\)\\.split\\(\",\"\\)\\[4\\]|(\\.localStorage\\)|JSON\\.parse\\(\\w)\\.getItem\\(\"|[\"']_aQS0\\w+[\"']|decodeURI\\(decodeURI\\(\"|<a href=\"https:\\/\\/getad%|\"cmp\\.updated\"/"],["remove-node-text","script","admiral","excludes","/,\\\\\"|self\\.__next|pageProps/"],["remove-node-text","script","adblockerDisabled","excludes",",\\\""],["remove-node-text","script","/HTMLIFrameElement|JSON\\[/"],["remove-attr","onerror","script[id][onerror]","asap","quitAfter","10"],["remove-node-text","script","/\\(async\\s*\\(\\)\\s*=>\\s*\\{\\s*try\\s*\\{\\s*(const|var)/"],["remove-node-text","script",").join(String.fromCharCode"],["remove-node-text","script","/window\\.admiral|adblockerDisabled/","excludes",",\\\""],["remove-node-text","script","/\\(\\)=>eval|html-load\\.com|await eval|:window/"],["set-constant","Object.prototype.adService.initialize","noopFunc"],["remove-node-text","script","/admiral|\\[\\]\\)\\.push\\(arguments\\)/","excludes",",\\\""],["remove-node-text","script","[]).push(arguments)","excludes",",\\\""],["remove-node-text","script","[]).push(arguments)","excludes","/,\\\\\"|self\\.__next|pageProps/"],["set-constant","gnt.x.uam","undefined","runAt","interactive"],["remove-node-text","script","/:window,|\\)\\.join\\(String\\.fromCharCode/"],["remove-node-text","script","/html-load\\.com|:\\[?window,/"],["remove-node-text","script","/:\\[?window,/"],["trusted-replace-node-text","script","var localize =","/*start*/(function(){document.querySelectorAll(\"script[wp-data]\").forEach(element=>{const html=new DOMParser().parseFromString(atob(element.getAttribute(\"wp-data\")),\"text/html\");html.querySelectorAll(\"link:not([as])\").forEach(linkEl=>{element.after(linkEl)});element.parentElement.removeChild(element);})})();document.currentScript.textContent=document.currentScript.textContent.replace(/\\/\\*start\\*\\/(.*)\\/\\*end\\*\\//g,\"\");/*end*/var localize =","sedCount","1"],["remove-node-text","script","adrecover.com"],["remove-node-text","script","()=>eval"],["remove-node-text","script","/:\\\"length\\\"\\}\\);$/"],["adjust-setInterval"],["remove-node-text","script","\"data-sdk\""],["prevent-setTimeout","[native code]","500"],["remove-node-text","script","await eval"],["remove-node-text","script","/\\)\\.join\\(String\\.fromCharCode|html-load\\.com/"],["remove-node-text","script","AdBlocker"],["set-constant","__INITIAL_STATE__.config.theme.ads.isAdBlockerEnabled","false"],["adjust-setInterval","generalTimeLeft","*","0.001"],["set-constant","console.clear","undefined"],["abort-current-script","globalThis","break;case"],["remove-attr","style","#over"],["prevent-window-open","/^/","1"],["set-constant","document.ontouchend","null"],["set-constant","document.onclick","null"],["trusted-replace-node-text","script","(isNoAds)","(true)"],["prevent-setTimeout","window.open"],["trusted-replace-node-text","script","/openNewTab\\(\".*?\"\\)/g","null"],["set-constant","playID","1"],["remove-node-text","script","/h=decodeURIComponent|popundersPerIP|dtnoppu|adserverDomain/"],["remove-node-text","script","/detectAdblock|WebAssembly|pop1stp|popMagic/i"],["prevent-fetch","adsbygoogle"],["prevent-addEventListener","click","popMagic"],["abort-on-property-read","__Y"],["prevent-addEventListener","load","detect"],["prevent-addEventListener","click","pop_"],["trusted-replace-node-text","script","/manageAds\\(video_urls\\[activeItem\\], video_seconds\\[activeItem\\], ad_urls\\[activeItem],true\\);/","playVideo();","condition","playAdd"],["trusted-replace-node-text","script","prerollEnabled:true","prerollEnabled:false"],["prevent-addEventListener","click","document.createElement"],["trusted-set-session-storage-item","popup-ads-last-shown","$now$"],["abort-on-property-read","adBlockDetected"],["prevent-setInterval","visibility","1000"],["set-constant","ads_blocked","false"],["set-constant","samDetected","false"],["abort-current-script","Math.floor","document.write"],["set-constant","adBlockDetected","noopFunc"],["abort-current-script","document.querySelector","adb"],["abort-current-script","addEventListener","nextFunction"],["prevent-addEventListener","load","block"],["abort-current-script","eval","ignielAdBlock"],["prevent-setTimeout","_0x"],["remove-node-text","script","var Data"],["abort-current-script","addEventListener","google_ad_client"],["abort-on-property-write","atOptions"],["abort-on-property-write","smrtSB"],["abort-on-property-read","wpsite_clickable_data"],["json-prune","meta.advertise"],["prevent-setTimeout","css_class.scroll"],["abort-current-script","String.fromCharCode","atob"],["prevent-setTimeout","bADBlock"],["remove-node-text","script","__unfair"],["prevent-fetch","googlesyndication"],["abort-on-property-read","adBlockerDetected"],["set-constant","isAdBlockActive","false"],["abort-on-property-read","adp"],["abort-current-script","document.createElement","script"],["set-constant","adb","0"],["adjust-setInterval","seconds"],["set-constant","flashvars.adv_pause_html"],["abort-on-property-write","afScript"],["prevent-setTimeout","getComputedStyle"],["abort-on-property-read","google_jobrunner"],["abort-on-property-read","mm"],["abort-current-script","document.addEventListener","nextFunction"],["prevent-setInterval","daadb"],["set-constant","google_unique_id","6"],["prevent-setTimeout","adb"],["prevent-addEventListener","load","player"],["prevent-setTimeout","/adb/i"],["prevent-xhr","ad"],["abort-current-script","$","test"],["prevent-setTimeout","document.createElement"],["prevent-addEventListener","scroll"],["set-cookie","popunder","1"],["set-constant","Object.prototype.isNoAds","{}"],["set-constant","tv3Cmp.ConsentGiven","true"],["adjust-setInterval","distance"],["prevent-fetch","googlesyndication","length:10","{\"type\":\"cors\"}"],["abort-on-property-read","XMLHttpRequest"],["trusted-replace-node-text","script","const PerformanceTracker","aiptag.cmd.display.push=a=>{},aiptag.cmd.player.push=a=>a(),aipPlayer=class{constructor(a){this.o=a}startPreRoll(a,s){this.o.AIP_REWARDEDCOMPLETE()}},aipAPItag={sdkBlocked:!1};const PerformanceTracker"],["prevent-setTimeout","getComputedStyle","250"],["abort-on-property-read","adsRedirectPopups"],["set-constant","canGetAds","true"],["prevent-fetch","method:/head/i"],["set-local-storage-item","ewrc_ad_signal","$remove$"],["abort-current-script","$","onload"],["remove-node-text","script","/adScript|adsBlocked/"],["prevent-setTimeout","display"],["remove-node-text","script","deblocker"],["set-attr",".lazy","src","[data-sco-src]"],["prevent-setTimeout","showModal"],["prevent-addEventListener","","showModal"],["remove-class","download-font-button2",".download-font-button"],["set-constant","adblockstatus","false"],["json-prune","props.sponsoredAlternative"],["adjust-setInterval","consoleLoaded?clearInterval"],["prevent-addEventListener","DOMContentLoaded","adlinkfly_url"],["noeval-if","ads"],["abort-current-script","$","window.open"],["abort-current-script","document.createElement","adblock"],["prevent-setInterval","analytics.initialized"],["remove-node-text","script","adblock"],["json-prune","playerResponse.adPlacements playerResponse.playerAds adPlacements playerAds"],["set-constant","di.app.WebplayerApp.Ads.Adblocks.app.AdBlockDetectApp.startWithParent","false"],["prevent-window-open","_blank"],["remove-node-text","script","/offsetHeight|popup/i"],["adjust-setInterval","countDown"],["remove-node-text","script","detect"],["set-cookie","ts_popunder","true","","reload","1"],["trusted-replace-node-text","script","popunder","","condition","popunder","stay","1"],["prevent-addEventListener","click","[native code]","elements",".main-wrap"],["abort-current-script","document.createElement","window.ts"],["remove-node-text","script","bannerRight"],["remove-cookie","video_view_count"],["prevent-setTimeout","readyWait"],["abort-current-script","jQuery","this"],["adjust-setTimeout","download","1000","0.001"],["set-constant","sandDetect","noopFunc"],["abort-current-script","document.readyState","mdpDeblocker"],["prevent-setTimeout","getComputedStyle(el)"],["prevent-addEventListener","DOMContentLoaded","document.documentElement.lang.toLowerCase"],["remove-attr","onclick","[onclick*=\"_blank\"]","complete"],["prevent-addEventListener","click","overlay"],["remove-node-text","script","popundersPerIP"],["prevent-addEventListener","click","PopUnder"],["abort-current-script","document.addEventListener","location.href"],["remove-node-text","script","mdpDeblocker"],["abort-current-script","showTav"],["prevent-addEventListener","/click|mouse|touch/","_0x"],["set-constant","puOverlay","noopFunc"],["abort-on-property-write","opopnso"],["abort-on-property-write","c0ZZ"],["set-constant","countDown","0"],["remove-node-text","script","/adb/i"],["abort-on-property-read","LieDetector"],["prevent-addEventListener","DOMContentLoaded","anchor.href"],["prevent-fetch","mode:no-cors"],["remove-node-text","script","/dismissAdBlock|533092QTEErr/"],["prevent-setTimeout","googlesyndication"],["prevent-xhr","/googletagmanager|ip-api/"],["set-constant","dclm_ajax_var.disclaimer_redirect_url"],["prevent-setInterval","EFFECTIVE_APPS_GCB_BLOCKED_MESSAGE"],["set-cookie","garb","1"],["prevent-addEventListener","click","location"],["prevent-window-open","!addons.mozilla.org"],["json-prune","*","rot_url"],["noeval-if","innerHTML"],["remove-cookie","/abd/"],["json-edit","..searchResults.*[?.isAd==true]"],["json-edit","..mainContentComponentsListProps.*[?.isAd==true]"],["json-edit-fetch-response","..mainContentComponentsListProps.*[?.isAd==true]","propsToMatch","/search/snippet?"],["abort-current-script","$","vglnk"],["noeval-if","Adblock"],["json-prune-xhr-response","source.ads","","propsToMatch","/player"],["trusted-set-local-storage-item","sc_last_pop","$now$"],["remove-node-text","script","/detect/i"],["remove-node-text","script","/adblock/i"],["trusted-replace-node-text","script","/AdblockDialogContainer/i"],["remove-node-text","script","VK_DIRECT_AD"],["json-prune","web_share_ads_adsterra_config wap_short_link_middle_page_ad wap_short_link_middle_page_show_time data.ads_cpm_info"],["adjust-setTimeout","value","*"],["adjust-setInterval","clearInterval","*"],["prevent-setTimeout","/window\\.location\\.href|n/","8000"],["set-cookie","__gads","1"],["abort-on-property-write","window.onload"],["abort-on-property-read","bypass_url"],["set-constant","document.hasFocus","trueFunc"],["remove-node-text","script","catch"],["trusted-replace-node-text","script","timeLeft = duration","timeLeft = 1"],["prevent-addEventListener","","history.go"],["prevent-xhr","method:HEAD"],["set-constant","Element.prototype.closest","falseFunc"],["prevent-addEventListener","click","rel"],["set-constant","document.hidden","false"],["prevent-addEventListener","click","adForm"],["prevent-window-open","","10","obj"],["adjust-setInterval","/seconds--|timeLeft--/","*"],["set-constant","document.hidden","true"],["trusted-replace-node-text","script","false","true","condition","opened"],["set-constant","HTMLScriptElement.prototype.onerror","undefined"],["prevent-fetch","/pub\\.clickadu|bing\\.com/"],["remove-node-text","script","\"+\"","excludes","/self\\.__next|recaptcha|document|window|const|var|let/"],["abort-current-script","RegExp.prototype.exec.constructor","\"+\""],["abort-current-script","Function.prototype.constructor","\"+\""],["set-constant","HTMLElement.prototype.click.call","noopFunc"],["set-constant","HTMLElement.prototype.click.apply","noopFunc"],["prevent-addEventListener","click","/document.createElement|window.open/"],["prevent-window-open",".cfd"],["remove-node-text","script","/\"\\+\"g|\"\\+\"'a|self\\.__next.*?,typeof document|self\\.__next&&|\\|\\|self\\.__next,\\(|\\(\"\\+\"t|'\\+'F|0\\|\\|window|\\}\\)\\(\\),typeof|'\\+'s|this\\['F.*\\('\\+'\"|\\)\\)\"'\\)\\(\\);\\(\\(\\)\\=>/g","excludes","/^self\\.__next_f\\.push/"],["prevent-xhr","/^https:\\/\\/pagead2\\.googlesyndication\\.com\\/pagead\\/js\\/adsbygoogle\\.js\\?client=ca-pub-3497863494706299$/"],["trusted-set-attr","ins.adsbygoogle:has(> #aswift_0_host)","data-ad-status","unfilled"],["trusted-set-attr","ins.adsbygoogle.nitro-body","data-ad-status","unfill-optimized"],["remove-attr","data-instype","ins.adsbygoogle:has(> div#aswift_0_host)","stay"],["trusted-set-attr","ins.adsbygoogle.nitro-side,ins.adsbygoogle.nitro-banner","data-ad-status","filled"],["prevent-fetch","url:https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-3497863494706299 method:HEAD mode:no-cors","","","throttle","121"],["trusted-replace-node-text","script","var menuSlideProtection","/*start*/!function(){\"use strict\";const t=Function.prototype.toString,e=new WeakMap;let n=0;const o=(t,n)=>{if(\"function\"==typeof t&&(e.set(t,`function ${n}() { [native code] }`),n))try{Object.defineProperty(t,\"name\",{value:n,configurable:!0})}catch(t){}return t},r=window.MessageChannel;window.MessageChannel=o((function(){return new r}),\"MessageChannel\");[\"A1\",\"A6\"].forEach((t=>{try{Object.defineProperty(window,t,{get:()=>!1,set:()=>{},configurable:!0})}catch(t){}}));const i=window.Date,c=i.now,s=window.performance.now.bind(window.performance);window.Date=o(class extends i{constructor(...t){return super(...t)}static now(){return c()}},\"Date\"),window.performance.now=o((()=>s()+n),\"now\");const a=t=>{try{const e=Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype,\"contentWindow\").get;Object.defineProperty(t,\"contentWindow\",{get:function(){const t=e.apply(this);return t&&t.Function&&t.Function.prototype.toString!==window.Function.prototype.toString&&(t.Function.prototype.toString=window.Function.prototype.toString),t},configurable:!0})}catch(t){}},p=document.createElement;document.createElement=o((function(t){const e=p.apply(this,arguments);return t&&\"iframe\"===t.toLowerCase()&&a(e),e}),\"createElement\");const u=Element.prototype.appendChild;Element.prototype.appendChild=o((function(t){return t&&\"IFRAME\"===t.tagName&&a(t),u.apply(this,arguments)}),\"appendChild\"),window.addEventListener(\"load\",(()=>{const t=()=>document.querySelectorAll(\"iframe\").forEach((t=>{const e=t.getAttribute(\"src\");if(e&&e.includes(\"lmt=\")){const n=e.replace(/([?&]lmt=)\\d+/,`$1${Math.floor(Date.now()/1e3)}`);e!==n&&t.setAttribute(\"src\",n)}}));setTimeout(t,150),setTimeout(t,1e3)}));const d=window.performance,l=d.getEntriesByType,g=(t,e,n)=>{const o=window.PerformanceResourceTiming?window.PerformanceResourceTiming.prototype:Object.prototype,r=Object.create(o),i={name:t,entryType:\"resource\",initiatorType:e,startTime:n,duration:45,redirectStart:0,redirectEnd:0,fetchStart:n,domainLookupStart:n,domainLookupEnd:n+2,connectStart:n+2,connectEnd:n+5,secureConnectionStart:0,requestStart:n+5,responseStart:n+20,responseEnd:n+45,transferSize:1200,encodedBodySize:900,decodedBodySize:900,serverTiming:[]};return Object.keys(i).forEach((t=>{Object.defineProperty(r,t,{value:i[t],writable:!0,enumerable:!0,configurable:!0})})),r.toJSON=function(){return i},r},y=o((function(t){let e=[];try{e=l.call(d,t)||[]}catch(t){e=[]}if(\"resource\"===t){const t=Array.from(e),n=g(\"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3497863494706299\",\"script\",120.5),o=g(\"https://pagead2.googlesyndication.com/pagead/managed/js/adsense/m202608260101/show_ads_impl_fy2021.js\",\"script\",240.8),r=g(\"https://googleads.g.doubleclick.net/pagead/html/r20260825/r20190131/zrt_lookup_fy2021.html\",\"iframe\",310.2),i=g(\"https://ep1.adtrafficquality.google/getconfig/sodar\",\"xmlhttprequest\",400),c=g(\"https://pagead2.googlesyndication.com/pagead/ping?e=1\",\"fetch\",450),s=g(\"https://pagead2.googlesyndication.com/pagead/gen_204\",\"other\",500);return t.push(n,o,r,i,c,s),t}return e}),\"getEntriesByType\");try{Object.defineProperty(d,\"getEntriesByType\",{value:y,configurable:!0,writable:!0})}catch(t){d.getEntriesByType=y}const f=Array.prototype.push;Array.prototype.push=o((function(...t){if((t=>{if(!t)return!1;const e=t.split(\"\\n\").length-1;return e>=4&&e<=6&&(t.includes(\"_executeCallback\")||/at\\s+([0-9A-Z_a-z]{1,3}|<anonymous>)\\s+\\(/.test(t))})((new Error).stack)){const e=t.filter((t=>![\"fetch\",\"XMLHttpRequest\"].includes(t)));return 0===e.length&&t.length>0?this.length:f.apply(this,e)}return f.apply(this,t)}),\"push\");const w=window.XMLHttpRequest;window.XMLHttpRequest=o((function(){return new w(...arguments)}),\"XMLHttpRequest\"),window.XMLHttpRequest.prototype=w.prototype,Object.setPrototypeOf(window.XMLHttpRequest,w),Function.prototype.toString=o((function(){if(e.has(this))return e.get(this);return[\"XMLHttpRequest\",\"fetch\",\"querySelectorAll\",\"bind\",\"push\",\"toString\",\"addEventListener\",\"now\",\"Date\",\"match\",\"createElement\",\"getEntriesByType\",\"setTimeout\",\"MessageChannel\",\"postMessage\"].includes(this.name)?`function ${this.name}() { [native code] }`:t.apply(this,arguments)}),\"toString\");const h=window.fetch;window.fetch=o((function(t){return\"string\"==typeof t&&t.includes(\"googleads\")?h.apply(this,arguments).then((t=>(n+=40,t))):h.apply(this,arguments)}),\"fetch\");const m=window.setTimeout;window.setTimeout=o((function(t,e){if(\"function\"==typeof t){const e=t.toString().replace(/\\s+/g,\"\");if(e.length<50&&/[$0-9A-Z_a-z]+&&[$0-9A-Z_a-z]+\\(\\)/i.test(e))return}return m.apply(this,arguments)}),\"setTimeout\")}();document.currentScript.textContent=document.currentScript.textContent.replace(/\\/\\*start\\*\\/(.*)\\/\\*end\\*\\//,\"\");/*end*/var menuSlideProtection","sedCount","1"],["trusted-set-attr","ins.adsbygoogle","data-adsbygoogle-status","done"],["abort-on-property-read","Worker.prototype.postMessage"],["set-constant","akamaiDisableServerIpLookup","noopFunc"],["set-constant","ga","noopFunc"],["trusted-replace-node-text","script","WB.defer","window.wbads={public:{getDailymotionAdsParamsForScript:function(a,b){b(\"\")},setTargetingOnPosition:function(a,b){return}}};WB.defer","condition","wbads.public.setTargetingOnPosition"],["set-constant","_satellite","{}"],["set-constant","_satellite.track","noopFunc"],["set-constant","gform.utils","noopFunc"],["set-constant","gform.utils.trigger","noopFunc"],["set-constant","fingerprint","{}"],["set-constant","get_fingerprint","noopFunc"]];
const HOSTS = {"tv.youtube.com":[0,1,2,3,4,5,6],"www.youtube.com":[7,8,9,10,1,2,3,4,5,6,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],"m.youtube.com":[1,2,3,4,29,5,6,30,22],"music.youtube.com":[1,2,3,4,29,5,6],"chefkoch.de":[31,32,33],"bordertelegraph.com":[34,35],"yts.mx":[36],"dailygeekshow.com":[37],"teensark.com":[38],"nationalgeographic.fr":[39,40],"dryscalpgone.com":[41,42],"thelovenerds.com":[41],"bdsmstreak.com":[43,44,45],"bestialitytaboo.tv":[46],"loptelink.com":[47],"gsm-solution.com":[48,49],"xrares.com":[50],"icy-veins.com":[51,52],"badgehungry.com":[53],"senmanga.com":[54],"veekyforums.com":[55],"leitesculinaria.com":[56,57,58],"muyinteresante.es":[59],"practicequiz.com":[60],"homebooster.de":[61],"appstore-discounts.com":[62],"mylivewallpapers.com":[63,64],"aiailah.com":[60],"bintangplus.com":[60],"duplichecker.com":[65],"temp-mail.org":[66],"mkv-pastes.com":[67,68],"keywestharborwebcam.com":[69],"mahobeachcam.com":[69],"portstthomaswebcam.com":[69],"hqtv.biz":[70],"freecoursesite.com":[71,72],"asianporn.sexy":[73,74],"fuckfuq.com":[73,74],"lingeriefuckvideo.com":[73,74],"pig-fuck.com":[73,74],"teensexass.com":[73,74],"voyeurpornsex.com":[73,74],"bdsmporn.cc":[50,75,45],"compucalitv.com":[76,77],"m4maths.com":[78],"444.coffee":[79],"sbsun.com":[80],"barefeetonthedashboard.com":[81,82,53],"republicain-lorrain.fr":[81,82,53],"utahsweetsavings.com":[81,82,53],"laprovincia.es":[83,84],"pivigames.blog":[85],"hotgameplus.com":[86],"firefaucet.win":[87],"interfans.org":[88,89],"ucptt.com":[55,68],"69teentube.com":[38],"pussyspot.net":[45,90],"rabbitsfun.com":[91,92,93],"jumboporn.xyz":[92],"secretsdujeu.com":[94],"lowellsun.com":[95],"gottanut.com":[38],"uiporn.com":[38],"xcafe.com":[38,96],"sexo5k.com":[97],"shameless.com":[91,93,98],"technews.tw":[99],"baylorbears.com":[100],"dbusports.com":[100],"gophersports.com":[100],"iuhoosiers.com":[100],"omavs.com":[100],"umterps.com":[100],"pirateblue.com":[100],"pirateblue.net":[100],"pirateblue.org":[100],"gomacsports.com":[100],"uncpbraves.com":[100],"alaskananooks.com":[100],"collegefootballplayoff.com":[100],"gobearcats.com":[100],"ksusports.com":[100],"utsports.com":[100],"softwaresblue.com":[101],"drrtyr.mx":[102],"adshrink.it":[103,104],"nzpocketguide.com":[105,58],"webcamsdolls.com":[106],"porngo.com":[54,55],"daily-times.com":[31],"echodnia.eu":[107],"strefaagro.pl":[107,108],"spaziogames.it":[109,110],"convert-case.softbaba.com":[111],"sandiegouniontribune.com":[112],"newsmax.com":[113],"acdriftingpro.com":[114,115],"mavanimes.co":[54],"braflix.uk":[116],"autotrader.nl":[117],"gartenlexikon.de":[117],"gifhorner-rundschau.de":[117],"gruenderlexikon.de":[117],"hifi-forum.de":[117],"jpgames.de":[117],"levif.be":[117],"mactechnews.de":[117,32],"mein-kummerkasten.de":[117],"motor-talk.de":[117,118],"nn.de":[117],"nrz.de":[117],"prosiebenmaxx.de":[117],"rhein-main-presse.de":[117],"rp-online.de":[117],"szene38.de":[117],"wiesbadener-kurier.de":[117],"wolfsburger-nachrichten.de":[117],"100percentfedup.com":[119],"conservativefiringline.com":[119],"populist.press":[119],"livinggospeldaily.com":[119],"welovetrump.com":[119],"clashdaily.com":[119],"videogamesblogger.com":[119],"transtxxx.com":[120],"1bit.space":[68,121],"akuma.moe":[68],"anime-loads.org":[68],"asialiveaction.com":[68],"gettapeads.com":[68,122,123,124,55,125,126],"bokepnya.com":[68],"buzter.xyz":[68],"downloadrips.com":[68],"freepornhdonlinegay.com":[68,45,127],"fsharetv.cc":[68],"gayfor.us":[68,45,128,129],"gaypornhdfree.com":[68,45,64],"haho.moe":[68,130],"hqcelebcorner.net":[68],"jiofiles.org":[68],"monaskuliner.ac.id":[68],"new-fs.eu":[68],"newtorrentgame.com":[68],"nudebabesin3d.com":[68],"o2tvseries.com":[68,131],"pinayscandalz.com":[68],"piratehaven.xyz":[68,128],"pornobr.club":[68],"pornobr.ninja":[68],"rsoccerlink.site":[68],"thaihotmodels.com":[68,45],"torrage.info":[68],"uniqueten.net":[68,45],"vfxmed.com":[68],"vladrustov.sx":[68],"xvip.lat":[68],"xxxfree.watch":[68,132],"fsx.monster":[133],"allafricangirls.net":[45,38],"arcjav.com":[45,134],"asianteenagefucking.com":[45],"darknessporn.com":[45,135,136],"escortconrecensione.com":[45],"filmpornoitaliano.org":[45],"fuckingsession.com":[45],"gayteam.club":[45,54],"hentaibros.com":[45],"iceporn.tv":[45],"javheroine.com":[45],"longporn.xyz":[45,55,92],"mamochki.info":[45],"mrjav.net":[45],"nangiphotos.com":[45],"needgayporn.com":[45,43],"porn3dx.com":[45],"porngayclips.com":[45],"pornomanoir.com":[45],"pornrusskoe.com":[45],"raccontivietati.com":[45],"severeporn.com":[45],"sex-torrent.net":[45,137],"sextubeset.com":[45],"shelovesporn.com":[45],"short.croclix.me":[45],"submissive-wife.net":[45],"thefantazy.com":[45],"tubexo.tv":[45],"viralxvideos.es":[45],"wannafreeporn.com":[45,138],"xkeezmovies.com":[45],"yporn.tv":[45],"momxxxsex.com":[139],"braflix.win":[128,140],"chikianimation.org":[128],"isekaitube.com":[128,141,142],"kfapfakes.com":[128,90],"nlcosplay.com":[128,129,132,64],"poapan.xyz":[128,132,64],"sexpin.net":[128],"xhamster.fm":[128,143],"entertubeporn.com":[79,144],"freesexvideos24.com":[79,144],"hindiporno.pro":[79,144],"callfuck.com":[79,144],"kittyfuckstube.com":[79,144],"asianporntube69.com":[38],"bdsmwaytube.com":[38],"hd-tube-porn.com":[38],"stepsisterfuck.me":[91],"pornhub-sexfilme.net":[145,146],"herzporno.net":[146],"18girlssex.com":[147,90],"milffabrik.com":[136,148,104,149],"porn-monkey.com":[136,148,104],"fyxxr.to":[150,151,152],"esportivos.site":[153],"foreverwallpapers.com":[153],"goku.sx":[153,154],"nxbrew.com":[153],"userscloud.com":[153,155],"movieloversworld.com":[156],"nensaysubs.net":[156],"saveshared.com":[156,157],"filmovi.ws":[158],"kumascans.com":[158],"stream.pkayprek.com":[158],"thingstomen.com":[158],"dtmaga.com":[159],"elevationmap.net":[159],"mp3fusion.net":[159,160],"stopstreamtv.net":[159],"downloadmusic.info":[122],"embed.scdn.to":[122],"manhuascan.com":[122],"superapk.org":[122,104],"tvonlinesports.com":[122,104],"watchmovies2.com":[122,104],"animehay.tv":[161],"o2tvseries.website":[162],"10starhub.com":[160],"9goals.live":[160],"aflizmovies.com":[160],"film4e.com":[160],"freemoviesfull.com":[160],"shortenlinks.top":[160],"ate60vs7zcjhsjo5qgv8.com":[154,163],"braflix.tube":[154],"nmac.to":[154],"snowmtl.ru":[154],"vidora.stream":[154,164],"zjet7.com":[154],"asianporn.li":[132],"movieffm.net":[132],"natomanga.com":[132,55],"rpmplay.online":[132,55],"vipserije.com":[132],"mym-db.com":[165],"ugreen.autos":[125],"istreameast.app":[166],"mc-hacks.net":[134,167],"8phim1.net":[164],"nekolink.site":[168,169,170],"picbcxvxa.sbs":[171,172,173],"laurasia.info":[174],"mmo69.com":[174],"skorpion-horoskop.com":[175],"adisann.com":[64],"bibliotecadecorte.com":[64],"blogk.com":[64],"boundlessnecromancer.com":[64],"carryflix.icu":[64,176],"cashkar.in":[64],"celebritablog.com":[64],"cinepiroca.com":[64],"cookni.net":[64,177],"demonyslowianskie.pl":[64],"design4months.com":[64],"dobletecno.com":[64],"erotikclub35.pw":[64],"ervik.as":[64],"foodiesjoy.com":[64],"gorating.in":[64],"hivetoon.com":[64],"hojii.net":[64],"inlovingmemoriesnews.com":[64],"insider-gaming.com":[64,178,42],"itz-fast.com":[64],"jcutrer.com":[64],"kgs-invest.com":[64],"kh-pokemon-mc.com":[64],"koreanbeauty.club":[64],"leechyscripts.net":[64],"legionscans.com":[64],"marimo-info.net":[64],"nichetechy.com":[64],"nulledmug.com":[64],"oracleerpappsguide.com":[64],"pcgameszone.com":[64],"petitestef.com":[64],"pflege-info.net":[64],"portaldoaz.org":[64],"postazap.com":[64,47,179,180,181],"praveeneditz.com":[64],"ribbelmonster.de":[64],"schildempire.com":[64,182],"scripcheck.great-site.net":[64],"sharphindi.in":[64],"sim-kichi.monster":[64],"sivackidrum.net":[64],"south-park-tv.biz":[64],"sundberg.ws":[64],"tamilanzone.com":[64],"testious.com":[64],"thesleak.com":[64],"tutorialsduniya.com":[64],"usahealthandlifestyle.com":[64],"ustimz.com":[64],"utilidades.ecuadjsradiocorp.com":[64],"villettt.kitchen":[64],"vmorecloud.com":[64],"wholenotism.com":[64],"yazilidayim.net":[64],"zdrz.xyz":[64],"shinobijawi.id":[181],"toursetlist.com":[141],"ctrmarketingsolutions.com":[183,181],"grsprotection.com":[183,181],"onezoo.net":[184,185],"visualcapitalist.com":[57,58],"audizine.com":[186],"videogamer.com":[187],"boredpanda.com":[188,42],"dailydot.com":[188],"eldiariony.com":[188],"frogsandsnailsandpuppydogtail.com":[188],"funtasticlife.com":[188],"yourcountdown.to":[188],"followfollow.com":[189],"deadline.com":[190,191,192,193,194],"thegrowthop.com":[195,196,197],"fox43.com":[198],"kens5.com":[198],"kusi.com":[198],"kwbq.com":[198],"whlt.com":[198],"wrbl.com":[198],"wsavcw.com":[198],"cristotarjetas.com":[199],"oneplace.com":[199],"myupnow.com":[190],"naszahistoria.pl":[108],"mcclatchydc.com":[200],"azcentral.com":[201],"enterprisenews.com":[201],"htrnews.com":[201],"lincolncourier.com":[201],"petoskeynews.com":[201],"publicopiniononline.com":[201],"southcoasttoday.com":[201],"sturgisjournal.com":[201],"timesrecordnews.com":[201],"mavericktruckclub.com":[192,202],"bikeperfect.com":[192,203],"fitandwell.com":[192,203],"laptopmag.com":[192,203],"livingetc.com":[192,203],"theweek.com":[192,203],"wallpaper.com":[192,203],"autotrader.pl":[192,204],"gameknot.com":[52],"honkailab.com":[205],"jutarnji.hr":[206],"oeffnungszeitenbuch.de":[207,178],"thingiverse.com":[208,209],"fxstreet-id.com":[178],"grapee.jp":[178],"horairesdouverture24.fr":[178],"ib-game.jp":[178],"jigsawexplorer.com":[178,58],"listentotaxman.com":[178],"meteo60.fr":[178],"niketalk.com":[178],"sotolover.com":[178],"statecollege.com":[178],"verkaufsoffener-sonntag.com":[178],"webdesignledger.com":[178],"yutura.net":[178],"anihatsu.com":[178],"football-2ch.com":[178],"world-fusigi.net":[178],"heygrillhey.com":[178,42],"practicalselfreliance.com":[178,42],"thefoodcharlatan.com":[178,42],"dodgersway.com":[210,211],"fansided.com":[210,211],"lombardiave.com":[210,211],"stormininnorman.com":[210,211],"tv3.lt":[178],"tipsandtrickskorea.com":[212],"mytuner-radio.com":[213],"radio-danmark.dk":[213],"radio-espana.es":[213],"radios-argentinas.org":[213],"a-love-of-rottweilers.com":[42],"acharmingescape.com":[42],"afk.global":[42],"airfried.com":[42],"allaboutjazz.com":[42],"allnurses.com":[42],"alxnow.com":[42],"americanwx.com":[42],"areinventedmom.com":[42],"ashbaber.com":[42],"askmormongirl.com":[42],"aviationa2z.com":[42],"avirtualvegan.com":[42],"ball-pythons.net":[42],"barbarabakes.com":[42],"barefeetinthekitchen.com":[42],"batteryequivalents.com":[42],"beautymasterlist.com":[42],"bestboatreport.com":[42],"beyerbeware.net":[42],"bibliolifestyle.com":[42],"binkysculinarycarnival.com":[42],"bitesofberi.com":[42],"blessherheartyall.com":[42],"bluebowlrecipes.com":[42],"booboosbakery.com":[42],"bottledprices.com":[42],"brightgreenrecipes.com":[42],"broncoraptorforum.com":[42],"buildingwithkinfolk.com":[42],"busycooks.com":[42],"butfirstwebrunch.com":[42],"cafehailee.com":[42],"cakebycourtney.com":[42],"cakemehometonight.com":[42],"californiathroughmylens.com":[42],"campersmarts.com":[42],"casamiacooking.com":[42],"champsorchumps.us":[42],"charactercounter.com":[42],"chascrazycreations.com":[42],"chazhound.com":[42],"code9media.com":[42],"coffeeatthree.com":[42],"comicyears.com":[42],"condolencemessages.com":[42],"cookilicious.com":[42],"cookitrealgood.com":[42],"copykat.com":[42],"cottageandvine.net":[42],"couponingtodisney.com":[42],"craftingagreenworld.com":[42],"cravinghomecooked.com":[42],"crazybusymama.com":[42],"crockpotladies.com":[42],"deesweets.com":[42],"devotedgrandma.com":[42],"diaryofafitmommy.com":[42],"diffen.com":[42],"discusscooking.com":[42],"disneytouristblog.com":[42],"domesticatedtom.com":[42],"draftsim.com":[42],"dramabeans.com":[42],"duoplanet.com":[42],"dwellbymichelle.com":[42],"easydrawingguides.com":[58],"easygayoven.com":[58],"eatpicks.com":[58],"electronicshub.org":[58],"eletric-vehicles.com":[58],"emmacruises.com":[58],"endomondo.com":[58],"erynwhalenonline.com":[58],"everylittlecrumb.com":[58],"fadeawayworld.net":[42],"familysavvy.com":[42],"familytreemagazine.com":[42],"fashionbeans.com":[42],"fatgirlhedonist.com":[42],"feelinfabulouswithkayla.com":[42],"firstquarterfinance.com":[42],"flavormosaic.com":[42],"food-bites.com":[42],"foxfarmhome.com":[42],"gamedayculture.com":[42],"geekspin.co":[42],"germanyfootsteps.com":[42],"giadzy.com":[42],"girlwiththeironcast.com":[42],"gitnux.org":[42],"goldenlucycrafts.com":[42],"greenbeautymama.com":[42],"gurlgonegreen.com":[42],"happyfamilyrecipes.com":[42],"hardrockforums.com":[42],"healthygirlkitchen.com":[42],"healthykitchen101.com":[42],"herepup.com":[42],"hisugarplum.com":[42],"houseofdebt.org":[42],"houseofroseblog.com":[42],"houseofturquoise.com":[42],"howtobuildit.org":[42],"hunker.com":[42],"husaberg.org":[42],"ifanzine.com":[42],"ih8mud.com":[42],"instrupix.com":[42],"internet-access-guide.com":[42],"iowagirleats.com":[42],"iphoneforums.net":[42],"itechguides.com":[42],"jackfruitful.com":[58],"japanesecooking101.com":[58],"jenwoodhouse.com":[58],"kathrynskitchenblog.com":[58],"keepinspiring.me":[58],"keepthescore.com":[58],"ketokarma.com":[58],"ketovale.com":[58],"kimberdawnco.com":[58],"krissysoverthemountaincrochet.com":[58],"kylieminteriors.ca":[58],"laraclevenger.com":[58],"lateralmovements.com":[58],"laurenfromscratch.com":[58],"laurenslighthouse.com":[58],"lcarecipes.com":[58],"leasehackr.com":[58],"lillychilders.com":[58],"listendata.com":[58,214],"littlehousebigalaska.com":[58],"lizmarieblog.com":[58],"loaids.com":[58],"loveandlemons.com":[58],"lovefilipinofood.com":[58],"lovelifeyarn.com":[58],"mamacheaps.com":[42],"marcandangel.com":[42],"mexicanfoodjournal.com":[42],"michellemorfett.com":[42],"mindfulzen.co":[42],"miniaturehorsetalk.com":[42],"momsdish.com":[42],"monologueblogger.com":[42],"motorandwheels.com":[42],"mut.gg":[42],"mychemicalfreehouse.net":[42],"mycrazygoodlife.com":[42],"myincrediblerecipes.com":[42],"navylookout.com":[58],"nbadraftroom.com":[58],"nextlevelgents.com":[58],"ninersdaily.com":[58],"ninjacue.com":[58],"ofbatteranddough.com":[58],"officerassignments.com":[58],"ohiofestivals.net":[58],"onceuponaprintable.com":[58],"onecrazyhouse.com":[58],"onepotrecipes.com":[58],"ootrandomizer.com":[58],"ourhappymess.com":[58],"parksavers.com":[42],"persnicketyplates.com":[42],"personalitymax.com":[42],"pewterreport.com":[42],"pinchmeimeating.com":[42],"planneratheart.com":[42],"platedcravings.com":[42],"pokemontcgzone.com":[42],"prettyprovidence.com":[42],"princesscruisesblog.com":[42],"printerknowledge.com":[42],"ps4storage.com":[42],"ragerampage.com":[58],"random.country":[58],"realestateinfoguide.com":[58],"recipesfromeurope.com":[58],"recipesfromleftovers.com":[58],"remodelaholic.com":[58],"rockyourhomeschool.net":[58],"rotinrice.com":[58],"runeatrepeat.com":[58],"runninginaskirt.com":[58],"rusticpassionbyallieblog.com":[58],"saltbuttersmoke.com":[42],"sarahsfitfood.com":[42],"sarahtitus.com":[42],"sarcasticmommy.com":[42],"scientificallysweet.com":[42],"screendynamite.com":[42],"sewingmachinetalk.com":[42],"shadowverse.gg":[42],"sharingkindergarten.com":[42],"shorebeat.com":[42],"shotkit.com":[42],"simplicityandastarter.com":[42],"simplylowcal.com":[42],"smartschoolhouse.com":[42],"somethingborrowedpdx.com":[42],"soulfoodcooking101.com":[42],"southcarolinavoyager.com":[42],"southerncastiron.com":[42],"spanishmama.com":[42],"sporttrac.org":[42],"sqlserverguides.com":[42],"stitch11.com":[42],"stuckonsweet.com":[42],"succulentcity.com":[42],"sunnydayfamily.com":[42],"survivalsullivan.com":[42],"sweetkitchencravings.com":[42],"teakandthyme.com":[42],"thatoregonlife.com":[42],"thatspicychick.com":[42],"thebetteredblondie.com":[42],"theburntbuttertable.com":[42],"thecottagemarket.com":[42],"thecraftedsparrow.com":[42],"thecravetraveler.com":[42],"theendlessappetite.com":[42],"thefedoralounge.com":[42],"theforkedspoon.com":[42],"thefrugalchicken.com":[42],"thehappypuppysite.com":[42],"theheirloompantry.co":[42],"thehoneyhome.com":[42],"thehyundaiforums.com":[42],"themarblekitchen.com":[42],"thenewbaguette.com":[42],"theoldhouselife.com":[42],"thepetiteplanner.com":[42],"thepinningmama.com":[42],"thepurpleponcho.com":[42],"therealfooddietitians.com":[42],"therecipecritic.com":[42],"theresearchedtraveler.com":[42],"thermo.kitchen":[42],"thesecretofthetarot.com":[42],"thesewingloftblog.com":[42],"theshabbycreekcottage.com":[42],"theslimmingfoodie.com":[42],"thesouthernladycooks.com":[42],"thestressfreechristmas.com":[42],"thetastytravelers.com":[42],"thetinylife.com":[42],"theturquoisehome.com":[42],"theunsealed.com":[42],"theveglife.com":[42],"thewordcounter.com":[42],"thishealthykitchen.com":[42],"tiffinandteaofficial.com":[42],"todaysgardener.com":[42],"trashschedules.com":[42],"travelfashiongirl.com":[42],"tripmemos.com":[42],"truckmodcentral.com":[42],"trumpexcel.com":[42],"twoluckyspoons.com":[42],"twosisterscrafting.com":[42],"usadventurer.com":[58],"vanillaandbean.com":[58],"veenaazmanov.com":[58],"veganfamilyrecipes.com":[58],"veggiesociety.com":[58],"voyageaustin.com":[58],"whateatly.com":[58],"whiskeywatch.com":[58],"whitekitchenredwine.com":[58],"whofacts.com":[58],"wholesomelicious.com":[58],"wholesomelymorgan.com":[58],"whycalculator.com":[58],"winsipedia.com":[58],"wordcollectanswers.com":[58],"wrestling-world.com":[58],"4runner-forums.com":[178],"arizonahuntingforums.com":[178],"bc4x4.com":[178],"californiaevforum.com":[178],"challengertalk.com":[178],"club4g.org":[178],"clubarmada.com":[178],"ctx700forum.com":[178],"desertxforum.com":[178],"discoverysport.net":[178],"dodgetalk.com":[178],"dogfoodchat.com":[178],"e-tronforum.com":[178],"equinoxevforum.com":[178],"esportbike.com":[178],"everestowners.com":[178],"fiestafaction.com":[178],"fordforumsonline.com":[178],"fz07oc.com":[178],"gamefishin.com":[178],"gopitbull.com":[178],"heresy-online.net":[178],"i5talk.com":[178],"k4owners.com":[178],"kawasakimotorcycle.org":[178],"kawasakiz650.com":[178],"kawieriders.com":[178],"mazda3forums.com":[178],"mazda6club.com":[178],"newnissanz.com":[178],"oceanforums.com":[178],"ourbeagleworld.com":[178],"piloteers.org":[178],"planetisuzoo.com":[178],"planetminis.com":[178],"plumbingzone.com":[178],"prowlerforums.net":[178],"ramforumz.com":[178],"rimfirecentral.com":[178],"saxontheweb.net":[178],"snackfora.com":[178],"snowmobilefanatics.com":[178],"speedwake.com":[178],"starlinktalk.com":[178],"talkaboutmarriage.com":[178],"techsupportforum.com":[178],"thedieselgarage.com":[178],"thegoatspot.net":[178],"titantalk.com":[178],"uberpeople.net":[178],"varminthunters.com":[178],"zdxowners.com":[178],"zx-10r.net":[178],"zx25rforum.com":[178],"dipsnp.com":[49],"games.pressdemocrat.com":[215,216],"puzzles.sunjournal.com":[215,216],"jessicayeahcatch.com":[55,217,218,132],"playhydrax.com":[217,219,220,221,222,223],"javggvideo.xyz":[55,224,225],"trailerhg.xyz":[55,224,225],"turtleviplay.xyz":[226,55],"mixdrop23.net":[227,55],"rpmplay.xyz":[104],"gofile.download":[228,229,230],"xn-----0b4asja7ccgu2b4b0gd0edbjm2jpa1b1e9zva7a0347s4da2797e8qri.xn--1ck2e1b":[231,153],"multicanaistt.space":[232],"comeumamao.monster":[233],"dizipal1554.com":[234],"dizipal1583.com":[234],"macizletaraftarium.online":[235],"inattv1286.xyz":[235],"inattv1306.xyz":[235],"inattv1335.xyz":[235],"motphimr.io":[236,237],"verteleseriesonline.com":[238,239],"ohmybrush.com":[240],"talkceltic.net":[241],"linfoweb.com":[242],"haddoz.net":[243],"hollywoodpq.com":[244],"larvelfaucet.com":[245,239,246],"rumahit.id":[247],"ad-doge.com":[248],"freewebcart.com":[249,180],"4allprograms.me":[180],"gomaainfo.com":[250],"descarga.xyz":[54,251,252],"sportbet.gr":[253],"tautasdziesmas.lv":[253],"vlive.tv":[254],"baddiehub.com":[255],"chochox.com":[256],"kitchennovel.com":[72],"cesenatoday.it":[257,258],"milanotoday.it":[257,258],"parmatoday.it":[257,258],"riminitoday.it":[257,258],"romatoday.it":[257,258],"aquiyahorajuegos.net":[238,55,259],"imag-r.com":[260],"eropaste.net":[261],"miamibeachradio.com":[262],"radioamericalatina.com":[262],"couponsuniverse.com":[263],"hentaicomics.pro":[264,55],"momvids.com":[90],"elektrikmen.com":[176],"i-bits.io":[265],"mizugigurabia.com":[174],"gayck.com":[266],"khsm.io":[267,268,239],"baikin.net":[269],"sbrity.com":[231,270],"devotag.com":[271],"openculture.com":[272],"khsn1230.com":[273],"everyeye.it":[274],"titantv.com":[275],"askpaccosi.com":[276,79,259,181,277],"onlytech.com":[278,71,279],"mommysucks.com":[50],"apkandroidhub.in":[259],"javleaked.com":[231],"m.liputan6.com":[280],"xcity.org":[92,281],"play.tv3.ee":[282],"play.tv3.lt":[282],"play.tv3.lv":[282,283],"redirect.dafontvn.com":[284],"poki-gdn.com":[78],"firmwarex.net":[181,285],"unblocksite.pw":[286,104],"sex-amateur-clips.com":[45,136],"eggfacts.fun":[287],"eggtown.org":[287],"turbo1.co":[288],"vebo1.com":[289],"ewrc-results.com":[290,291,292],"vkprime.com":[209],"nullscripts.net":[72],"hilites.today":[293,294,181],"afk.guide":[295],"karanpc.com":[296],"rocketnews24.com":[297],"weadown.com":[298,299,47],"bestfonts.pro":[300],"link4rev.site":[47],"goo.st":[301],"alternativeto.net":[302],"zona-leros.com":[149],"pudelek.pl":[303],"mathsstudio.com":[259],"vtbe.net":[55],"h-game18.xyz":[304,181],"player.gayfor.us":[55],"toramemoblog.com":[176,305,174],"filerice.com":[306],"cuevana8.com":[55],"dafontvn.com":[307],"dvm360.com":[308],"miniwebtool.com":[309],"eu-proxy.startpage.com":[310,1,2,4],"jazzradio.com":[311],"dzapk.com":[312,313],"studyinghuman6js.shop":[314],"unite-guide.com":[315],"metrolagu.cam":[55,259],"xhopen.com":[316,317,318,319,320,321],"xhreal2.com":[316,317,318,319,320,321],"xhwebsite.com":[316,317,318,319,320,321],"mercurynews.com":[80],"supertelevisionhd.com":[54],"richtoscan.com":[64],"dramathical.stream":[154,322,55],"rupertisdivingintoocean.com":[154,322,55],"imagetranslator.io":[259],"deano.me":[323],"voltupload.com":[324],"esportivos.fun":[325],"asia.5ivttv.vip":[326],"raidrush.net":[327],"aipebel.com":[296,328],"tokuzilla.net":[329,312,330],"ripplestream4u.shop":[125],"ultrastreamlinks.xyz":[331],"ronorp.net":[232],"videovak.com":[332,333],"kimcilonlyofc.com":[334,55],"fileplanet.com":[335],"blogx.almontsf.com":[174],"powcloud.org":[336,337,338,339],"wcoanimesub.tv":[261],"gofile.to":[340],"animeflix.ltd":[55],"hdmp4mania2.com":[131],"nxbrew.net":[341],"bigconv.com":[55],"pagalfree.com":[342,343],"tubtic.com":[344],"south-park-tv.fr":[281],"mmsmasala.com":[345],"nepalieducate.com":[346],"neilpatel.com":[347],"hardcorelesbian.xyz":[348],"policesecurity.com":[349],"greatandhra.com":[350],"myplexi.fr":[351],"temp-mail.lol":[291],"goplay.su":[352,353,354,355],"goplay.ml":[353],"yelp.com":[356,357,358],"freeforums.net":[359],"softdevelopp.com":[360],"play.1188.lv":[361],"stirr.com":[315],"starcima.com":[312,362],"carryflix.com":[344],"cloudorchestranova.com":[312],"temp-mail.africa":[363],"xboxdynasty.de":[364],"tnlive.sk":[365],"video1exa.live":[366],"terabox.fun":[367,368,369],"vijviral.com":[370],"dopomininfo.com":[371,372,181,373,374],"enagato.com":[104,47],"iconicblogger.com":[375],"ikramlar.online":[64,259],"posterify.net":[64,376],"katdrive.link":[377],"guidetechly.com":[378,379,380,381],"hypershort.com":[382,377],"torupload.com":[383,384,385,386,387,388,389,390,391,392,393,379,394,395,396],"dodi-repacks.site":[389,390,391,392,393,379,394,395,396],"youtube.com":[6],"pvpoke-re.com":[397,398,399,400,401,402,403,404,405],"br.de":[406],"pewresearch.org":[407],"ozap.com":[408],"lumens.com":[409,410],"bikeportland.org":[411,412],"geiriadur.ac.uk":[413,414],"welsh-dictionary.ac.uk":[413,414]};
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
