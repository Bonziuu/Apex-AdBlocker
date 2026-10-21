/* Tarcza – scriptlety listy "Reklamy" (część 4/24). Plik generowany przez tools/build.mjs. */
(function () {
'use strict';
const CALLS = [["set-constant","ytInitialPlayerResponse.playerAds","undefined"],["set-constant","ytInitialPlayerResponse.adPlacements","undefined"],["set-constant","ytInitialPlayerResponse.adSlots","undefined"],["set-constant","playerResponse.adPlacements","undefined"],["json-prune","playerResponse.adPlacements playerResponse.playerAds playerResponse.adSlots adPlacements playerAds adSlots important"],["json-prune-fetch-response","reelWatchSequenceResponse.entries.[-].command.reelWatchEndpoint.adClientParams.isAd entries.[-].command.reelWatchEndpoint.adClientParams.isAd","","propsToMatch","url:/reel_watch_sequence?"],["json-prune","entries.[-].command.reelWatchEndpoint.adClientParams.isAd"],["replace-node-text","script","/(\\(function serverContract\\(\\)|^if \\(window\\.ytcsi)/","(()=>{if(\"YOUTUBE_PREMIUM_LOGO\"===window.ytInitialData?.topbar?.desktopTopbarRenderer?.logo?.topbarLogoRenderer?.iconImage?.iconType||\"YOUTUBE_PREMIUM_LOGO\"===document.getElementById(\"masthead\")?.attributes?.[\"logo-type\"]?.value||location.href.startsWith(\"https://www.youtube.com/tv#/\"))return;const e=window.ytcfg.data_.INNERTUBE_CONTEXT.client.userAgent,t=[\"channel\",\"lactmilli\",\"inline\",\"yahi\"];let r=!1,o=t;const n=t=>{if(t){let r=e?.match?.(/Mozilla\\/5\\.0 \\([^)]+/)?.[0];window.ytcfg.data_.INNERTUBE_CONTEXT.client.userAgent=r?e.replace?.(r,r+\"; \"+t):e}else window.ytcfg.data_.INNERTUBE_CONTEXT.client.userAgent=e},a=()=>{let e=document.getElementById(\"movie_player\");return{player:e,response:e?.getPlayerResponse?.(),stats:e?.getStatsForNerds?.(),progress:e?.getProgressState?.(),buffer:e?.getPlayerStateObject?.()?.isBuffering}},l=(e,t,r)=>e&&\"0.00 s\"===t?.buffer_health_seconds&&\"0x0\"===t?.resolution&&r.length>0,s=()=>{let{player:e,response:t,stats:n,buffer:s}=a();e&&l(s,n,o)&&(t?.playbackTracking?.videostatsPlaybackUrl?.baseUrl?.includes?.(\"reloadxhr\")&&(o=o.slice(1)),r=!0)};document.addEventListener(\"DOMContentLoaded\",(function(){const e=()=>{let e,s,{player:i,response:d,stats:c,progress:p,buffer:y}=a();if(i&&(window.location.href.includes(\"/watch?\")||window.location.href.includes(\"/embed/\"))){if(p&&p.duration>0&&(p.loaded<p.duration||p.duration-p.current>1)||d?.videoDetails?.isLive){if(c&&!c?.debug_info?.startsWith?.(\"SSAP, AD\")){const t=new URLSearchParams(window.location.search),a=d.videoDetails?.videoId,u=d.playerConfig?.playbackStartConfig?.startSeconds||parseInt(t.get(\"t\"),10)||0,g=d.playabilityStatus?.errorScreen,w=JSON.stringify(g?.playerErrorMessageRenderer?.subreason?.runs||g?.playerInterstitialRenderer?.content?.interstitialViewModel?.description?.commandRuns);return void(\"UNPLAYABLE\"===d?.playabilityStatus?.status&&!g?.playerErrorMessageRenderer?.playerCaptchaViewModel&&w?.includes?.(\"WEB_PAGE_TYPE_UNKNOWN\")&&w?.includes?.(\"https://support.google.com/youtube/answer/3037019\")?(o=o.slice(1),o.length>0?n(o[0]):n(\"\"),r=!1,i.loadVideoById(a,u)):0===o.length?(r=!1,n(\"\")):l(y,c,o)&&r?(n(o[0]),r=!1,i.loadVideoById(a,u)):!r&&p.current-u>.1&&p.current-u<5&&location.href.includes(\"&list=\")&&null===i.getPlaylistId?.()&&(e=document.querySelector(\"yt-playlist-manager\"),s=e?.getPlaylistData?.(),s&&(e.setPlaylistData?.(s),e.setPlayerPlaybackControlData?.({playlistPanelRenderer:s}))))}c&&p.duration>0&&i.seekTo?.(p.duration)}}else o=t};e(),new MutationObserver((()=>{e()})).observe(document,{childList:!0,subtree:!0})})),window.Map.prototype.has=new Proxy(window.Map.prototype.has,{apply:(e,t,o)=>(\"onSnackbarMessage\"!==o?.[0]||r||s(),Reflect.apply(e,t,o))}),window.Array.prototype.push=new Proxy(window.Array.prototype.push,{apply:(e,t,r)=>{let o=r?.[0];return!o||\"object\"!=typeof o||\"Uint8Array\"!==o.constructor.name||o.buffer?.byteLength!==o.length||105!==o.length&&104!==o.length||(console.log(o),s()),Reflect.apply(e,t,r)}});const i={apply:(e,t,r)=>{const o=r[0];return\"function\"==typeof o&&o.toString().includes(\"onAbnormalityDetected\")&&(r[0]=function(){}),Reflect.apply(e,t,r)}};window.Promise.prototype.then=new Proxy(window.Promise.prototype.then,i)})();$1","sedCount","1","excludes","MutationObserver","condition","/serverContract|js_ld/"],["adjust-setTimeout","[native code]","17000","0.001"],["json-prune-fetch-response","adPlacements adSlots playerResponse.adPlacements playerResponse.adSlots [].playerResponse.adPlacements [].playerResponse.adSlots","","propsToMatch","/\\/player(\\?|$)/"],["json-prune-fetch-response","adPlacements adSlots playerResponse.adPlacements playerResponse.adSlots","","propsToMatch","/playlist?"],["json-prune-xhr-response","adPlacements adSlots playerResponse.adPlacements playerResponse.adSlots [].playerResponse.adPlacements [].playerResponse.adSlots","","propsToMatch","/\\/player(?:\\?.+)?$/"],["remove-node-text","script","window,\"fetch\""],["nowebrtc"],["abort-on-property-read","_sp_._networkListenerData"],["abort-on-property-write","_sp_"],["abort-on-property-write","yafaIt"],["abort-on-property-read","_sp_.mms.startMsg"],["abort-on-property-write","Fingerprint2"],["abort-on-property-read","stop"],["abort-current-script","decodeURI","decodeURIComponent"],["abort-on-property-read","Date.prototype.toUTCString"],["no-window-open-if"],["set-constant","String.prototype.charAt","trueFunc"],["abort-current-script","$","ltvModal"],["set-constant","luxuretv.config"],["abort-on-property-read","popns"],["abort-current-script","__ADX_URL_U"],["adjust-setInterval","myTimer","1500"],["addEventListener-defuser","load","advertising"],["addEventListener-defuser","click","popMagic"],["abort-current-script","btoa","BOOTLOADER_LOADED"],["remove-node-text","script","/__adblocker|html-load/","excludes","self.__next"],["set-constant","isAdBlocked","false"],["no-xhr-if","/enthusiastgaming|googleoptimize|googletagmanager/"],["abort-current-script","decodeURI","getScriptFromCss"],["no-xhr-if","ad_"],["set-constant","page_params.holiday_promo","true"],["no-setInterval-if","adblockerModal","1000"],["no-setTimeout-if","nextFunction","2000"],["set-constant","CaptchmeState.adb","undefined"],["abort-on-property-read","__eiPb"],["noeval-if","/chp_?ad/"],["addEventListener-defuser","load","2000"],["abort-current-script","Math","='\\x"],["abort-on-property-read","ExoLoader.serve"],["abort-on-property-read","loadTool"],["abort-on-property-read","open"],["abort-on-property-read","document.dispatchEvent"],["abort-current-script","document.querySelectorAll","popMagic"],["abort-on-property-write","adBlockDetected"],["abort-current-script","$","#pageWrapper"],["set-constant","blurred","false"],["adjust-setInterval","time"],["set-constant","sec","0"],["no-setTimeout-if","adFilled","2500"],["abort-on-property-write","decodeURI"],["abort-current-script","JSON.parse","break;case $."],["abort-on-property-write","phtData"],["set-constant","adBlocker","false"],["no-setTimeout-if","innerHTML"],["abort-on-stack-trace","String.prototype.charCodeAt","ai_"],["abort-on-property-read","ExoLoader"],["abort-on-property-read","_pop"],["abort-on-property-read","popit"],["addEventListener-defuser","popstate","noPop"],["addEventListener-defuser","click","native code"],["abort-on-property-read","exoJsPop101"],["addEventListener-defuser","load","onload"],["abort-current-script","document.documentElement","break;case $."],["set-constant","Math.pow","noopFunc"],["abort-current-script","document.createElement","l.parentNode.insertBefore(s"],["addEventListener-defuser","mousedown","!!{});"],["adjust-setTimeout"],["no-setTimeout-if","/$|adBlock/"],["abort-on-property-read","AaDetector"],["set-constant","flashvars.adv_pause_html"],["set-constant","flashvars.adv_start_html"],["abort-on-property-read","ExoLoader.addZone"],["abort-on-property-read","decodeURI"],["abort-current-script","String.fromCharCode","shift"],["set-constant","blockAdBlock","trueFunc"],["set-constant","google_jobrunner","true"],["json-prune","enabled","force_disabled"],["no-setTimeout-if",".call(null)","10"],["set-constant","ov.advertising.tisoomi.loadScript","noopFunc"],["set-constant","initializeslideshow","noopFunc"],["set-constant","adblock","false"],["addEventListener-defuser","load","0x"],["abort-current-script","globalThis","break;case"],["remove-node-text","script","/h=decodeURIComponent|popundersPerIP/"],["set-constant","is_adblocked","false"],["remove-node-text","script","popUnderUrl"],["remove-attr","data-popunder-url"],["abort-current-script","document.createElement","adblock"],["abort-current-script","document.getElementById","block"],["set-constant","chp_adblock_browser","noopFunc"],["addEventListener-defuser","DOMContentLoaded",".clientHeight"],["no-setTimeout-if","ads"],["abort-on-property-read","document.write"],["remove-node-text","script","ads-blocked"],["set-constant","blockAdBlock._options.baitClass","null"],["set-constant","CloudflareApps.installs.Ik7rmQ4t95Qk.options.measureDomain","undefined"],["noeval-if","adsbygoogle"],["remove-node-text","script","/popMagic|pop1stp/"],["abort-current-script","WebAssembly","atob"],["abort-on-stack-trace","atob","/HTMLDocument|blob/"],["no-fetch-if","/doubleclick|googlesyndication/","length:10","{\"type\":\"cors\"}"],["no-xhr-if","/doubleclick|googlesyndication/"],["abort-current-script","parseInt","break;case $."],["abort-on-property-write","atOptions"],["addEventListener-defuser","","break;case $."],["abort-current-script","Math","break;case $."],["abort-current-script","JSON.parse","Promise"],["remove-node-text","script","/WebAssembly|forceunder/"],["no-setInterval-if","adblock"],["abort-on-property-read","Adcash"],["remove-attr","target","#downloadvideo"],["adjust-setTimeout","counter"],["abort-on-property-write","_pop"],["addEventListener-defuser","","_blank"],["set-cookie","inter","1","","reload","1"],["noeval"],["abort-on-property-read","exoNoExternalUI38djdkjDDJsio96"],["addEventListener-defuser","","popMagic"],["no-fetch-if","popunder"],["abort-current-script","EventTarget.prototype.addEventListener","delete window"],["remove-attr","onclick","button#download","complete"],["no-window-open-if","_blank"],["set-constant","detectSandbox","noopFunc"],["addEventListener-defuser","DOMContentLoaded","Promise"],["no-setTimeout-if","push"],["remove-node-text","script","/popns|\\)\\.substr/"],["abort-current-script","document.createElement","appendTo:"],["no-xhr-if","googlesyndication"],["set-constant","globalThis","null"],["abort-current-script","WebAssembly","Promise"],["noeval-if","ads"],["abort-on-property-read","Aloader.serve"],["no-setTimeout-if","innerText","2000"],["set-constant","flashvars.mlogo"],["addEventListener-defuser","getexoloader"],["remove-node-text","script","/shown_at|WebAssembly/"],["no-setTimeout-if","offsetWidth","2000"],["replace-node-text","script","adv_","no_adv_","condition","kt_player.swf","sedCount","10"],["set-constant","flashvars.popunder_url"],["abort-on-property-read","LieDetector"],["abort-on-property-read","afScript"],["remove-node-text","script",";}}};break;case $."],["remove-node-text","script","{delete window["],["remove-node-text","script","popundersPerIP"],["no-setInterval-if","visibility","1000"],["abort-on-property-read","app_vars.force_disable_adblock"],["remove-node-text","script","FingerprintJS"],["abort-current-script","addEventListener","HTMLAllCollection"],["no-setInterval-if","/0x|sandCheck/"],["abort-on-property-read","__Y"],["remove-node-text","script","adserverDomain"],["remove-node-text","script","popunder"],["abort-current-script","Math","zfgloaded"],["abort-on-property-read","mm"],["abort-current-script","String.fromCharCode","/btoa|break/"],["abort-current-script","navigator","break;case $."],["no-xhr-if","/vast.php?"],["no-xhr-if","/click\\.com|preroll|native_render\\.js|acscdn/","length:10001"],["no-xhr-if","162.252.214.4","true"],["no-xhr-if","c.adsco.re"],["no-xhr-if","adsco.re:2087"],["remove-node-text","script","/h=decodeURIComponent|popundersPerIP|dtnoppu|adserverDomain/"],["adjust-setInterval"],["abort-current-script","Promise","JSON.parse"],["no-setTimeout-if","/[a-z]\\(!0\\)/","800"],["addEventListener-defuser","click","popunder"],["abort-on-stack-trace","document.createElement","displayLayer"],["no-fetch-if","="],["set-constant","initializeNtvxSheet","noopFunc"],["abort-current-script","adcashMacros"],["no-setTimeout-if","afterOpen"],["set-constant","PlayerConfig.config.CustomAdSetting","[]"],["set-constant","univresalP","noopFunc"],["abort-on-property-read","console.clear"],["adjust-setInterval","timer"],["no-window-open-if","!/prcf.fiyar|themes|pixsense|.jpg/"],["abort-current-script","document.addEventListener","google_ad_client"],["no-setTimeout-if","displayMessage","2000"],["no-setTimeout-if","nextFunction"],["set-constant","adsClasses","undefined"],["set-constant","gsecs","0"],["remove-node-text","script","ai_adb"],["abort-on-property-read","antiAdBlockerHandler"],["addEventListener-defuser","DOMContentLoaded","history.go"],["remove-node-text","style","min-height:300px"],["addEventListener-defuser","load","abDetectorPro"],["no-fetch-if","/googlesyndication|doubleclick/","length:10","{\"type\": \"cors\"}"],["no-xhr-if","/googlesyndication|doubleclick/","length:10"],["remove-node-text","script","/\"v4ac1eiZr0\"|\"\"\\)\\.split\\(\",\"\\)\\[4\\]|(\\.localStorage\\)|JSON\\.parse\\(\\w)\\.getItem\\(\"|[\"']_aQS0\\w+[\"']|decodeURI\\(decodeURI\\(\"|<a href=\"https:\\/\\/getad%|\"cmp\\.updated\"/"],["remove-node-text","script","adblockerDisabled","excludes",",\\\""],["addEventListener-defuser","error",".indexOf"],["addEventListener-defuser","load",".indexOf"],["no-setTimeout-if",".indexOf"],["abort-current-script","String.prototype.match","__adblocker","/^data:/"],["remove-node-text","script","/admiral|\\[\\]\\)\\.push\\(arguments\\)/","excludes",",\\\""],["remove-node-text","script","[]).push(arguments)","excludes",",\\\""],["remove-node-text","script","AdBlockEnabled"],["remove-node-text","script","adblockerDisabled"],["remove-node-text","script","admiral","excludes",",\\\""],["set-constant","gnt.x.uam","undefined","runAt","interactive"],["abort-current-script","admiral"],["remove-attr","onerror","script[id][onerror]","asap","quitAfter","10"],["remove-node-text","script","/:window,|\\)\\.join\\(String\\.fromCharCode/"],["remove-node-text","script","/html-load\\.com|:\\[?window,/"],["set-constant","adLight","true"],["replace-node-text","script","window.dataLayer =","/*start*/(function(){let link=document.createElement(\"link\");link.rel=\"stylesheet\";link.href=\"/wp-content/themes/hts_v2/style.css\";document.head.appendChild(link)})();document.currentScript.textContent=document.currentScript.textContent.replace(/\\/\\*start\\*\\/(.*)\\/\\*end\\*\\//g,\"\");/*end*/window.dataLayer ="],["replace-node-text","script","window.dataLayer =","/*start*/(function(){let link=document.createElement(\"link\");link.rel=\"stylesheet\";link.href=\"/_css/css.css\";document.head.appendChild(link)})();document.currentScript.textContent=document.currentScript.textContent.replace(/\\/\\*start\\*\\/(.*)\\/\\*end\\*\\//g,\"\");/*end*/window.dataLayer ="],["remove-node-text","script","html-load.com"],["noeval-if","/content-loader\\.com|css-load\\.com|html-load\\.com/"],["remove-node-text","script","KCgpPT57bGV0IGU"],["remove-node-text","script",").join(String.fromCharCode"],["remove-node-text","script","adrecover.com"],["remove-node-text","script","/\\(async\\s*\\(\\)\\s*=>\\s*\\{\\s*try\\s*\\{\\s*(const|var)/"],["set-constant","Object.prototype.enableInterstitial","false"],["remove-node-text","script","await eval"],["remove-node-text","script","() => eval"],["remove-node-text","script",",window]"],["remove-node-text","script","/__adblocker|html-load/"],["remove-node-text","script","\"data-sdk\""],["no-setTimeout-if","[native code]","500"],["set-constant","Object.prototype._adsDisabled","true"],["remove-node-text","script","/\"__adblocker\"|\"data-sdk\"/"],["no-xhr-if","prebid"],["remove-cookie","PageCount"],["set-local-storage-item","PageCount","$remove$"],["trusted-set-constant","asc","json:{\"cmd\": [null], \"que\": [null], \"wrapperVersion\": \"6.19.0\", \"refreshQue\": {\"waitDelay\": 3000, \"que\": []}, \"isLoaded\": true, \"bidderSettings\": {}, \"libLoaded\": true, \"version\": \"v9.20.0\", \"installedModules\": [], \"adUnits\": [], \"aliasRegistry\": {}, \"medianetGlobals\": {}}"],["trusted-set-constant","google_tag_manager","json:{ \"G-Z8CH48V654\": { \"_spx\": false, \"bootstrap\": 1704067200000, \"dataLayer\": { \"name\": \"dataLayer\" } }, \"SANDBOXED_JS_SEMAPHORE\": 0, \"dataLayer\": { \"gtmDom\": true, \"gtmLoad\": true, \"subscribers\": 1 }, \"sequence\": 1 }"],["remove-node-text","script","antiAdBlockerHandler"],["set-constant","__INITIAL_STATE__.config.theme.ads.isAdBlockerEnabled","false"],["adjust-setInterval","generalTimeLeft","*","0.001"],["set-constant","Adv_ab","false"],["remove-node-text","script","/adblock|popunder|openedPop|WebAssembly|wpadmngr/"],["abort-on-property-read","__aaZoneid"],["abort-on-property-write","DoodPop"],["set-constant","console.clear","undefined"],["trusted-set-constant","premium","'1'"],["no-setTimeout-if","window.open"],["replace-node-text","script","/openNewTab\\(\".*?\"\\)/g","null"],["abort-current-script","document.write","unescape"],["remove-node-text","script","/detect/i"],["remove-node-text","script","/detectAdblock|WebAssembly|pop1stp|popMagic/i"],["remove-node-text","script","pingUrl"],["addEventListener-defuser","/click|mouse/","/scoreUrl|pingUrl/"],["remove-node-text","script",":visible"],["no-setTimeout-if","checkAdblockUser"],["remove-node-text","script","\"+\"","excludes","/self\\.__next|recaptcha|document|window|const|var|let/"],["abort-current-script","RegExp.prototype.exec.constructor","\"+\""],["abort-current-script","Function.prototype.constructor","\"+\""],["abort-on-stack-trace","document.addEventListener","anonymous@https"],["abort-on-stack-trace","Document.prototype.addEventListener.call","anonymous@https"],["set-constant","HTMLElement.prototype.click.call","noopFunc"],["set-constant","HTMLElement.prototype.click.apply","noopFunc"],["set-constant","Element.prototype.closest","falseFunc"],["addEventListener-defuser","click","/document.createElement|window.open/"],["no-window-open-if",".cfd"],["remove-node-text","script","/\"\\+\"g|\"\\+\"'a|self\\.__next.*?,typeof document|self\\.__next&&|\\|\\|self\\.__next,\\(|\\(\"\\+\"t|'\\+'F|0\\|\\|window|\\}\\)\\(\\),typeof|'\\+'s/g","excludes","/^self\\.__next_f\\.push/"],["replace-node-text","script","/manageAds\\(video_urls\\[activeItem\\], video_seconds\\[activeItem\\], ad_urls\\[activeItem],true\\);/","playVideo();","condition","playAdd"],["replace-node-text","script","prerollEnabled:true","prerollEnabled:false"],["remove-node-text","script","shopeeLinks"],["addEventListener-defuser","click","shopeeLinks"],["no-setTimeout-if","google_jobrunner"],["abort-on-property-read","adBlockDetected"],["abort-on-stack-trace","$","/(?=^(?!.*(https)))/"],["abort-on-stack-trace","$ado","/ado/i"],["abort-on-stack-trace","document.createElement","app.js"],["adjust-setInterval","counter","*"],["set-constant","uBlockOriginDetected","false"],["no-fetch-if","doubleclick"],["abort-current-script","$","_ads"],["abort-current-script","Math","adthrive"],["set-constant","btoa","null"],["set-constant","openWindow","noopFunc"],["abort-on-property-read","wpsite_clickable_data"],["abort-on-property-read","b2a"],["no-setTimeout-if","showModal"],["abort-current-script","eval","replace"],["remove-node-text","script","var Data"],["addEventListener-defuser","DOMContentLoaded","/atob|overlay/"],["abort-on-property-read","doSecondPop"],["remove-node-text","script","parentNode.removeChild"],["abort-current-script","atob","parentNode.removeChild"],["remove-node-text","script","globalThis.innerWidth"],["no-setTimeout-if","bADBlock"],["abort-on-property-read","adBlockerDetected"],["no-setTimeout-if","/out.php"],["abort-current-script","pop_init"],["abort-current-script","document.createElement","script"],["addEventListener-defuser","","adb"],["remove-node-text","style","text-decoration"],["abort-on-property-write","ospen"],["set-constant","flashvars.adv_pre_vast"],["abort-on-property-write","__spotSettings"],["abort-on-property-write","adcashMacros"],["no-setTimeout-if","brave_load_popup"],["adjust-setInterval","timer.remove"],["abort-current-script","addEventListener","nextFunction"],["abort-current-script","document.addEventListener","offsetHeight"],["set-constant","console.clear","noopFunc"],["no-setTimeout-if","debugger"],["remove-attr","href",".button[href^=\"javascript\"]"],["abort-current-script","Math.floor","ExoLoader"],["no-setTimeout-if","google_ad"],["adjust-setInterval","timercounter"],["no-fetch-if","method:HEAD"],["remove-node-text","script","/adb/i"],["abort-current-script","document.getElementById","stop"],["no-xhr-if","/analytics|livestats/"],["abort-on-stack-trace","console","onload"],["remove-attr","onclick"],["abort-current-script","jQuery","No"],["abort-on-stack-trace","Math","_0x"],["no-setTimeout-if","ai_"],["set-cookie","popunder","1"],["adjust-setTimeout","remaining","1000","0.001"],["remove-node-text","script","deblocker"],["abort-current-script","$","adsBlocked"],["no-setTimeout-if","/show|document\\.createElement/"],["addEventListener-defuser","DOMContentLoaded","atob"],["set-constant","popped","true"],["replace-node-text","script","const PerformanceTracker","aiptag.cmd.display.push=a=>{},aiptag.cmd.player.push=a=>a(),aipPlayer=class{constructor(a){this.o=a}startPreRoll(a,s){this.o.AIP_REWARDEDCOMPLETE()}},aipAPItag={sdkBlocked:!1};const PerformanceTracker"],["set-constant","passthetest","true"],["no-setTimeout-if","adblock"],["abort-on-property-read","BetterJsPop"],["no-window-open-if","","10"],["set-constant","distance","0"],["remove-attr","disabled","button#getlink"],["remove-attr","disabled","button#gotolink"],["no-fetch-if","googlesyndication"],["no-setTimeout-if","show"],["set-constant","init_welcome_ad","noopFunc"],["set-constant","detectadsbocker","false"],["no-setTimeout-if","Ads"],["set-constant","smartLoaded","true"],["no-setTimeout-if","sadbl"],["abort-on-property-read","adsBlocked"],["abort-on-property-write","__aaZoneid"],["no-setTimeout-if","data?"],["addEventListener-defuser","load","popunder"],["abort-on-property-write","DOMAssistant"],["abort-on-property-write","rotator"],["remove-node-text","script","popUnder"],["no-setTimeout-if","fetch"],["remove-node-text","script","leave_recommend"],["set-constant","empire.pop","undefined"],["set-constant","empire.direct","undefined"],["set-constant","empire.directHideAds","undefined"],["replace-node-text","script","/data: \\[.*\\],/","data: [],","condition","ads_num"],["set-constant","document.hidden","true"],["adjust-setTimeout","(!1)","*"],["no-xhr-if","pagead2.googlesyndication.com"],["set-constant","empire.mediaData.advisorMovie","1"],["set-constant","empire.mediaData.advisorSerie","1"],["set-constant","pandaAdviewValidate","true"],["abort-on-property-read","eazy_ad_unblocker_dialog_opener"],["remove-node-text","script","open"],["remove-node-text","script","wwads"],["remove-node-text","script","onerror"],["remove-node-text","script","googlesyndication"],["no-setInterval-if","daadb"],["abort-current-script","addEventListener","smartpop"],["set-constant","hasAdBlocker","false"],["no-setTimeout-if","contrformpub"],["set-cookie","ts_popunder","true","","reload","1"],["replace-node-text","script","popunder","","condition","popunder","stay","1"],["addEventListener-defuser","click","[native code]","elements",".main-wrap"],["abort-current-script","document.createElement","window.ts"],["remove-node-text","script","bannerRight"],["remove-cookie","video_view_count"],["no-setTimeout-if","trigger","0"],["abort-on-property-read","__brn_private_mode"],["abort-on-property-write","smrtSB"],["abort-current-script","atob","decodeURIComponent"],["set-constant","notifyMe","noopFunc"],["abort-current-script","$","alertmsg"],["addEventListener-defuser","click","location.href"],["abort-current-script","Math","/window\\['(?:\\\\x[0-9a-f]{2}){2}/"],["no-setTimeout-if","readyWait"],["no-fetch-if","google-analytics"],["remove-node-text","script","antiAdBlock"],["set-session-storage-item","realm.Oidc.3pc","$remove$"],["abort-current-script","$","btoa"],["abort-on-property-write","probeScript"],["set-constant","GEMG.GPT.Interstitial","noopFunc"],["abort-on-property-write","Adcash"],["adjust-setInterval","counter"],["no-window-open-if","shutterstock.com"],["abort-current-script","Math","localStorage['\\x"],["set-constant","Object.prototype.adUrl"],["replace-node-text","script","playVideo();","loadEmbedVideo();"],["no-fetch-if","imasdk"],["no-window-open-if","/aff|jump/"],["set-constant","Object.prototype.ads.nopreroll_","true"],["abort-on-property-read","checkAdsStatus"],["addEventListener-defuser","click","_blank"],["replace-node-text","script","vid.vast","//vid.vast"],["addEventListener-defuser","load","popMagic"],["remove-node-text","script","/key in document|popundersPerIP|var FingerprintJS|adserverDomain|globalThis;break;case|ai_adb|adContainer/"],["abort-on-property-read","aclib"],["abort-current-script","document.createElement","jsc.mgid.com"],["set-constant","isAdBlockActive","false"],["remove-cookie","PHPSESSID"],["remove-node-text","script","/google_jobrunner|AdBlock|pubadx|embed\\.html/i"],["set-constant","flashvars.mlogo_link"],["set-constant","flashvars.logo_text"],["no-setTimeout-if","/adbl/i"],["replace-node-text","script","/vastSource.*?,/","vastSource:'',"],["replace-node-text","script","/window.location.href[^?]+this[^?]+;/"],["addEventListener-defuser","click","window.open"],["remove-node-text","script","adbl"],["addEventListener-defuser","click","popupInterval"],["replace-node-text","script","isVipUser = false","isVipUser = true"],["no-window-open-if","/go/out"],["no-fetch-if","adsbygoogle"],["replace-node-text","script",",availableAds:[",",availableAds:[],noAds:[","sedCount","1"],["set-constant","dclm_ajax_var.disclaimer_redirect_url"],["replace-node-text","script","function OptanonWrapper() {}","/*start*/(()=>{const o={apply:(o,t,e)=>(\"ads\"===e[0]&&\"object\"==typeof t&&null!==t&&(t.ads=()=>{}),Reflect.apply(o,t,e))};window.Object.prototype.hasOwnProperty=new Proxy(window.Object.prototype.hasOwnProperty,o)})();document.currentScript.textContent=document.currentScript.textContent.replace(/\\/\\*start\\*\\/(.*)\\/\\*end\\*\\//g,\"\");/*end*/function OptanonWrapper() {}"],["remove-node-text","script","/adblock/i"],["addEventListener-defuser","click","href"],["no-window-open-if","/pop?"],["no-setTimeout-if","doubleclick"],["set-constant","prads","[]"],["abort-current-script","onload"],["addEventListener-defuser","","Pop"],["abort-on-property-read","_wm"],["remove-node-text","script","/^/gms","excludes","__INITIAL_STATE__"],["replace-node-text","script","/$/gms","(()=>{const url=__INITIAL_STATE__.page.clickthroughPageData.url;if(url){window.location.href=url}})();","condition","__INITIAL_STATE__"],["remove-node-text","script","popup"],["no-fetch-if","ads_"],["no-xhr-if","ads_"],["remove-node-text","script",".onerror"],["remove-node-text","script","/_0x|'innerHTML'/"],["json-prune","messages.*.ads messages.*.renderedAdsHtml"],["json-prune-xhr-response","data.initPlaybackSession.adScenarios data.initPlaybackSession.adExperience.adExperienceTypes","","propsToMatch","/graphql"],["no-window-open-if","!youtu"],["trusted-set-local-storage-item","_ad_last","$now$"],["remove-cookie","__adblocker"],["no-fetch-if","adsbygoogle","war:googlesyndication_adsbygoogle.js"],["set-constant","timeSec","0"],["adjust-setTimeout","getlink","*","0.001"],["noeval-if","replace"],["set-constant","Object.prototype.isAllAdClose","true"],["replace-node-text","script","/func.*justDetect.*warnarea.*?;/gm"],["remove-node-text","script","getComputedStyle(el"],["replace-node-text","script","/\\d{4}/gms","10"],["no-setTimeout-if","/window\\.location\\.href|n/","8000"],["set-constant","showadas","true"],["abort-on-property-read","SMart1"],["noeval-if","chp_ad"],["addEventListener-defuser","DOMContentLoaded","document.documentElement.lang.toLowerCase"],["adjust-setInterval","countdown","1000","0.001"],["replace-node-text","script","/#Intent.*?end/"],["replace-node-text","script","intent","https"],["no-setTimeout-if","location.href"],["replace-node-text","script","/(['\"])https?:\\/\\/[^'\"]+\\1/","$1$1","condition","/addEventListener|adUrl|open/"],["replace-node-text","script","_blank","_self","condition","href"],["replace-node-text","script","e.preventDefault();"],["no-fetch-if","/doubleclick|googlesyndication/"],["replace-node-text","script","/10;|6;/","1;","condition","progress"],["set-local-storage-item","BLOCKED_FLAG_KEY","$remove$"],["abort-on-stack-trace","document.querySelectorAll","security.js"],["json-prune","html"],["no-fetch-if","method:POST"],["remove-node-text","script","/adsby|console|data-ad|modal|requestAnimationFrame|srcdoc|tagName|text\\/html|userAgent|visibility|zucks|^[\\S\\s]{3200,}$|\\\\u00|ブロッカ/"],["abort-on-property-read","Keen"],["set-constant","nads.createAd","trueFunc"],["set-constant","ga","noopFunc"],["set-constant","newPageViewSpeedtest","noopFunc"],["adjust-setTimeout","/TDELAY|EzoIvent/","*","0.001"],["no-fetch-if","/piwik-"],["set-constant","ttd_dom_ready","noopFunc"],["abort-current-script","Math.random"]];
const HOSTS = {"m.youtube.com":[0,1,2,3,4,5,6],"music.youtube.com":[0,1,2,3,4,5,6],"tv.youtube.com":[0,1,2,3,5,6],"www.youtube.com":[0,1,2,3,5,6,7,8,9,10,11,12],"ddlvalley.me":[13],"fluvore.com":[13],"livingathome.de":[14],"mymotherlode.com":[15],"eurogamer.net":[16,17],"eurogamer.de":[17],"eurogamer.es":[17],"eurogamer.it":[17],"eurogamer.pt":[17],"macserial.com":[18],"grubstreet.com":[19],"biqle.*":[20,21],"porn.com":[22,23],"luxuretv.com":[24,25,26],"feet9.com":[27],"freepdf-books.com":[28],"mimaletadepeliculas.*":[29],"mejortorrent.*":[13,30],"webdesigndev.com":[22],"mp3guild.*":[18],"tasteandtellblog.com":[31,32],"thesimsresource.com":[33,34],"pornfay.*":[22],"ddlvalley.*":[35,18],"frkn64modding.com":[36],"vidd.se":[37],"hulkshare.com":[38],"mp3fy.com":[39],"e-monsite.com":[40],"culture-informatique.net":[41,42],"disneyfashionista.com":[41],"visionias.net":[43],"tribunnews.com":[44],"prostoporno.*":[45],"babesxworld.com":[46,47,48,49],"ridvanmau.com":[50],"printedelectronicsnow.com":[51],"aiailah.com":[50],"dicariguru.com":[50],"indofirmware.site":[50],"icutlink.com":[47,52,53,54],"pandafreegames.*":[55],"multporn.net":[48,49],"myegy.*":[56,57],"hotdreamsxxx.com":[58],"veedi.com":[59],"paradiseislandcam.com":[60],"portnassauwebcam.com":[60],"gaypornwave.com":[61,62,63],"animepornfilm.com":[64,65],"originalindianporn.com":[64,65],"teenextrem.com":[64,65],"totalmaturefuck.com":[64,65],"xxxanimefuck.com":[64,65],"xxxmovies.*":[64,65],"mlbstream.tv":[20],"celeb.gate.cc":[66],"cocoporn.net":[20,67],"links-url.*":[68],"hdfriday.*":[47,69],"audiofanzine.com":[70],"teleriumtv.*":[22],"hdfull.*":[71,72,73],"dictionnaire-medical.net":[39],"proplanta.de":[74],"watchgameofthrones.*":[75],"bravoerotica.com":[45],"bravoerotica.net":[76,77],"collegehdsex.com":[48],"nakedgirlsroom.com":[78],"kinoz.*":[13,75,79],"tamilyogi.*":[80],"gocards.com":[81],"golobos.com":[81],"gozags.com":[81],"hamptonpirates.com":[81],"nuhuskies.com":[81],"themw.com":[81],"gomcpanthers.com":[81],"quinnipiacbobcats.com":[81],"gseagles.com":[81],"kstatefootball.net":[81],"kstatefootball.org":[81],"wsucougars.com":[81],"karanapk.com":[82],"kicker.de":[83,84,85,86],"cinemaxxl.de":[87],"cracking-dz.com":[88],"upstream.to":[47,89,90],"jacquieetmichel.net":[91,92,93],"almezoryae.com":[94],"isminiunuttum.com":[95],"porncomics.me":[47],"about-drinks.com":[84],"ariva.de":[84],"fehmarn24.de":[84],"gamepro.de":[84],"musiker-board.de":[84],"notebookchat.com":[84],"peiner-nachrichten.de":[84],"readmore.de":[84],"safelist.eu":[84],"sat1gold.de":[84],"sn.at":[84],"unicum.de":[84],"androidadult.com":[90,42,96,97,98,99,100],"animeblkom.net":[90,101,102],"bellezashot.com":[90,71,42,103,104],"bhaai.*":[90],"doods.cam":[90],"dsvplay.com":[90,49,105,22],"gaypornhot.com":[90,49,106,107,108],"gledajcrtace.xyz":[90],"gocast2.com":[90,69],"hoodsite.com":[90],"hqcelebcorner.net":[90],"linkebr.com":[90],"masahub.com":[90],"masahub.net":[90],"messitv.net":[90,109,110],"mlbstream.*":[90,57,109,111,112],"nlegs.com":[90],"stream25.xyz":[90],"strtape.*":[90,113,114,115,22,116,117,118],"swatchseries.*":[90,69],"tokusatsuindo.com":[90],"turbovid.me":[90],"vidorg.net":[90],"vstorrent.org":[90],"watchfamilyguyonline.com":[90],"wpdeployit.com":[90],"xxxdominicana.com":[90],"canna.to":[119],"amazon-love.com":[49],"arabxforum.com":[49],"bcmanga.com":[49],"blackchubbymovies.com":[49],"cat3movie.org":[49,105],"czechsex.net":[49],"dikgames.com":[49],"fatwhitebutt.com":[49,22,120],"femjoybabes.com":[49],"hentai.tv":[49,121],"ibecamethewifeofthemalelead.com":[49],"imgflare.com":[49],"javbee.vip":[49],"javgrab.com":[49],"javhd.*":[49,71,105],"javpool.com":[49],"jotea.cl":[49],"kaoskrew.org":[49],"mainporno.com":[49],"nudismteens.com":[49,122,123],"porn00.org":[49,71,22],"porncomics.*":[49],"pornmoms.org":[49],"sexpuss.org":[49],"tubexo.tv":[49],"waploaded.com":[49,109],"webtoonscan.com":[49],"xsportshd.com":[49],"givemeaporn.com":[124],"camarchive.tv":[30,125],"ansuko.net":[71],"javdoe.sh":[71,105],"mangaraw18.net":[71],"poapan.xyz":[71,105,42],"pornosubtitula2.com":[71,42],"rebahin.pw":[71],"safefileku.com":[71,89,126,127,128],"streamup.ws":[71,126,129,130,131],"letsporn.com":[132],"mitaku.net":[133,134,135,136,137],"massagefreetube.com":[122,138],"xxxblowjob.pro":[122,138],"xxxtubegain.com":[122,138],"whitexxxtube.com":[122,138],"pornuploaded.net":[48],"bobs-tube.com":[48,139,140],"sexiestpicture.com":[79,22],"hentaihere.com":[141,142],"hentai-moon.com":[143,144,145],"fastream.to":[146,147],"11xmovies.*":[148,69,126,149],"3kmovies.*":[148,69],"aliezstream.pro":[148,69,150],"crazyblog.in":[148,112,151,152,22,52],"filmeserialeonline.org":[148,69],"flexyhit.com":[148,111],"mp4moviez.*":[148,22],"playertv.net":[148],"tamilarasan.*":[148,109],"tnmusic.in":[148],"vidsrc.*":[148,57,69,126,153,154,155,22,156,75,116,157],"watchdoctorwhoonline.com":[148,109],"watchomovies.*":[148,109,69,158],"3sk.*":[159],"biqle.com":[159],"exyi.net":[159],"buffstream.*":[57,160],"comandotorrenthd.org":[57],"fulltube.*":[57],"losmovies.*":[57],"mettablog.com":[57,61],"pelisstar.com":[57],"123movies-official.net":[109],"anime4up.*":[109,22],"gameslay.net":[109],"katlinks.*":[109],"moviefreak.*":[109],"okamimiost.com":[109],"pelismarthd.com":[109],"redowlanalytics.com":[109],"roms-hub.com":[109],"0gomovies.*":[111],"2madrasdub.*":[111],"animeonlinefree.org":[111],"brmovies.*":[111],"cima4u.*":[111],"dopebox.to":[111,154],"gocast123.me":[111],"gooplay.net":[111],"mangasite.org":[111,47],"pksmovies.*":[111],"bollyshare.*":[112],"comandotorrentshds.org":[112],"youtubeai.com":[112],"zplayer.live":[112],"flvto.biz":[161],"exee.app":[89,69],"hdmovies2.org":[162],"5moviess.com":[69],"9anime.pe":[69],"doods.pro":[69],"reddit-soccerstreams.com":[69],"soap2day-online.com":[69],"temp.modpro.co":[69],"1mov.lol":[126],"9anime.vip":[126],"alphatron.tv":[126],"animenexus.in":[126,128],"doods.to":[126,22,163,164,165,166,167],"m1xdrop.*":[126,168,22],"messitv.org":[126],"mh.baxoi.buzz":[126,42],"streamingcommunityz.*":[126],"streamingunity.to":[126],"telepisodes.org":[126,169],"tous-sports.ru":[126,116],"veplay.top":[126],"fojik.*":[149],"egydead.*":[170],"18comic-gquu.vip":[105],"hentaipaw.com":[105,171],"javpas.com":[105],"novelcrow.com":[105],"player4me.online":[105,172,173],"turbovid.*":[105],"flixrave.me":[157,174],"ntvs.cx":[157,175,22],"torrentdownloads.*":[154,13,176],"vembed.*":[177,22,178],"torrentkitty.one":[179],"imgmffmv.sbs":[180,181,182],"pixdfdjkkr.shop":[180,181,182],"imgjmgfgm.shop":[180,181,182],"cintateknologi.com":[183],"gemini-horoscopes.com":[184],"krebs-horoskop.com":[184],"adnan-tech.com":[42],"altselection.com":[42],"audiotrip.org":[42],"bdsomadhan.com":[42],"bidersnotu.com":[42],"canzoni-per-bambini.it":[42],"clockskin.us":[42],"coin-profits.xyz":[42,185],"daij1n.info":[42],"destinationsjourney.com":[42],"detikbangka.com":[42],"dobletecno.com":[42],"drublood.com":[42],"easytodoit.com":[42],"electricalstudent.com":[42],"esportsmonk.com":[42],"fcportables.com":[42,186,187,188],"foodiesjoy.com":[42],"gamerxyt.com":[42,189,190],"glo-n.online":[42],"globelempire.com":[42],"happy-otalife.com":[42],"hdhub4one.pics":[42],"hojii.net":[42],"infocycles.com":[42],"juventusfc.hu":[42],"kali.wiki":[42],"kenkou-maintenance.com":[42],"kgs-invest.com":[42],"kotanopan.com":[42],"learnmany.in":[42],"lgcnews.com":[42],"liddread.com":[42,191],"linuxexplain.com":[42],"mhscans.com":[42],"modele-facture.com":[42],"motofan-r.com":[42],"negative.tboys.ro":[42],"nhvnovels.com":[42],"pc-guru.it":[42],"reeell.com":[42],"the-mystery.org":[42],"thewambugu.com":[42],"underground.tboys.ro":[42],"utaitebu.com":[42],"virabux.com":[42],"vpzserver.com":[42],"weebee.me":[42],"wikitechy.com":[42],"writeprofit.org":[42],"xvipp.com":[42],"yakisurume.com":[42],"mygardening411.com":[61],"gendatabase.com":[192,134],"inmatefindcalifornia.com":[192,134],"readingpage.fun":[193,194],"allaboutthetea.com":[195],"funtasticlife.com":[195],"intouchweekly.com":[195],"lifeinleggings.com":[195],"techcrunch.com":[195,196,197,198,199],"thenerdstash.com":[195,32,200],"5newsonline.com":[201],"8newsnow.com":[201],"fox2now.com":[201],"fox51.com":[201],"fox56news.com":[201],"kcentv.com":[201],"krqe.com":[201],"ktsm.com":[201],"ibelieve.com":[202,203],"liveoutdoors.com":[196],"momtastic.com":[196],"news8000.com":[196],"queerty.com":[204],"stronakuchni.pl":[205],"buckscountycouriertimes.com":[206],"caller.com":[206],"cheboygannews.com":[206],"portclintonnewsherald.com":[206],"starcourier.com":[206],"zdnet.com":[207],"mavericktruckclub.com":[208,209],"golfmonthly.com":[208,210],"guitarplayer.com":[208,210],"homesandgardens.com":[208,210],"thenational.scot":[211],"hometownstation.com":[212],"sportalkorea.com":[213,214],"viva100.com":[215,216],"sms24.me":[208,217],"jutarnji.hr":[218],"hollywoodlife.com":[219,220],"dictionnaire.lerobert.com":[221,214],"motorradfrage.net":[221,214],"reisefrage.net":[221,214],"buchstaben.com":[222,214],"skinmc.net":[223],"aucfree.com":[214],"chef-in-training.com":[214,32],"convertcase.net":[214],"driveteslacanada.ca":[214,32],"j7p.jp":[214],"kyoteibiyori.com":[214],"modhub.us":[214],"motor-fan.jp":[214],"soxprospects.com":[214],"twn.hu":[214],"vimm.net":[214],"aqua2ch.net":[214],"girlsreport.net":[214],"imas-cg.net":[214],"jisaka.com":[214],"kidan-m.com":[214],"onecall2ch.com":[214],"loveinmyoven.com":[214,224],"plainchicken.com":[214,32],"12thmanrising.com":[225,226],"catcrave.com":[225,226],"gigemgazette.com":[225,226],"southsideshowdown.com":[225,226],"thejetpress.com":[225,226],"bristolworld.com":[221],"100daysofrealfood.com":[224],"10fragrances.com":[224],"1500days.com":[224],"16powers.com":[224],"31daily.com":[224],"368chickens.com":[224],"40plusstyle.com":[224],"4pics1-word.com":[224],"abnormalreturns.com":[32],"adayinthekitchen.com":[32],"adishofdailylife.com":[32],"aeclectic.net":[32],"aglassofbovino.com":[32],"alandacraft.com":[32],"allcakeprices.com":[32],"allwritealright.com":[32],"aquariumadvice.com":[32],"aquietrefuge.com":[32],"arabahjoy.com":[32],"arrestyourdebt.com":[32],"artsy-traveler.com":[32],"asweetpeachef.com":[32],"authority.pub":[32],"bahaiforums.com":[32],"bakingmehungry.com":[32],"believeintherun.com":[32],"bestchristmasdesserts.com":[32],"bestiefy.com":[32],"bramblewinecottage.com":[32],"brasshero.com":[32],"braveryandbelonging.com":[32],"bromabakery.com":[32],"buildingelements.com":[32],"businesschronicler.com":[32],"butfirstwebrunch.com":[32],"buythiscookthat.com":[32],"campgrilleat.com":[32],"cat-world.com":[32],"chambanamoms.com":[32],"charactercounter.com":[32],"cheneetoday.com":[32],"chordsworld.com":[32],"citefast.com":[32],"classicnerd.com":[32],"codex.gg":[32],"codycrosssolutions.com":[32],"coffeelevels.com":[32],"comicyears.com":[32],"cookingclassy.com":[32],"cookingforpeanuts.com":[32],"cookinwithmima.com":[32],"coopcancook.com":[32],"cosascaseras.com":[32],"cosplayadvice.com":[32],"countrydiaries.com":[32],"crazytogether.com":[32],"crochettoplay.com":[32],"cruisersforum.com":[32],"cubesnjuliennes.com":[32],"curlygirlkitchen.com":[32],"cyndispivey.com":[32],"dailywritingtips.com":[32],"damndelicious.net":[32,41,227],"delightfuladventures.com":[32],"discoveringmontana.com":[32],"dishbydish.net":[32],"divaliciousrecipes.com":[32],"diy-forums.com":[32],"easycheesyvegetarian.com":[224],"easydrawingguides.com":[224],"eatsomethingvegan.com":[224],"ecstatichappiness.com":[224],"edibleperspective.com":[224],"educationlibrary.org":[224],"eleganceechoes.com":[224],"elliott.org":[224],"episodehive.com":[224],"essentialketo.com":[224],"exploreessaouira.com":[224],"facilycasero.com":[32],"familyfelicity.com":[32],"fantasycalc.com":[32],"fastingwithlaura.com":[32],"feedingthefrasers.com":[32],"findcatnames.com":[32],"findtherun.com":[32],"fivehearthome.com":[32],"floorcritics.com":[32],"flooringforum.com":[32],"foodstruct.com":[32],"forbusybees.com":[32],"fordfullsize.com":[32],"freeslp.com":[32],"freshcoasteats.com":[32],"fuelly.com":[32],"gluedtomycraftsblog.com":[32],"goldenlucycrafts.com":[32],"goodfooddiscoveries.com":[32],"gopresstimes.com":[32],"grayingwithgrace.com":[32],"happyfoodhealthylife.com":[228],"happysimpleliving.com":[228],"hawaii.com":[228],"hazyandhoppy.com":[228],"healthyelizabeth.com":[228],"healthygirlkitchen.com":[228],"heartandsoulhomeschooling.com":[228],"heretocook.com":[228],"herviewfromhome.com":[228],"hobbyhelp.com":[228],"homecookedroots.com":[228],"homegrownhappiness.com":[228],"homemadelovely.com":[228],"homeschool.com":[228],"honeywerehome.com":[228],"housefur.com":[228],"housekeen.com":[228],"idownloadblog.com":[32],"ih8mud.com":[32],"infarrantlycreative.net":[32],"isavea2z.com":[32],"jellymemos.com":[224],"jennaburger.com":[224],"jenniferrizzo.com":[224],"jetpunk.com":[224,229,230,231,232,233],"joyofmotioncrochet.com":[224],"junky-traveler.com":[224],"justinweather.com":[224],"justonecookbook.com":[224],"justsotasty.com":[224],"kiddingaroundcharlotte.com":[224],"kingshotdata.com":[224],"kitchentreaty.com":[224],"knifeinformer.com":[224],"knotions.com":[224],"laurafuentes.com":[224],"lebernard.ca":[224],"lemonsandzest.com":[224],"littlebitsof.com":[224],"littlehouseliving.com":[224],"lowcarbquick.com":[224],"machiningdoctor.com":[32],"makingthymeforhealth.com":[32],"mandysrecipeboxblog.com":[32],"mangoful.com":[32],"mariashriversundaypaper.com":[32],"maryswholelife.com":[32],"maximumridesharingprofits.com":[32],"mechanicguides.com":[32],"mediatakeout.com":[32],"meganvskitchen.com":[32],"messylittlemonster.com":[32],"mjandhungryman.com":[32],"monkeyandmekitchenadventures.com":[32],"mortadellahead.com":[32],"mybartender.com":[32],"mygoodfoodworld.com":[32],"mymundaneandmiraculouslife.com":[32],"myoutlanderphev.com":[32],"mywordgames.com":[32],"naturalbabylife.com":[224],"naturalbeachliving.com":[224],"nerdsandscoundrels.com":[224],"nhltraderumor.com":[224],"noracooks.com":[224],"nywoodsandwater.com":[224],"oldhousecalling.com":[224],"oldhousetonewhome.net":[224],"oldsaltfarm.com":[224],"ourbestbites.com":[224],"outagescope.com":[224],"peakbagger.com":[32],"pennymediallc.com":[32],"pestleanalysis.com":[32,101],"petiteinparis.com":[32],"pitcherlist.com":[32],"pizzamaking.com":[32],"pokemap.net":[32],"pokemoncard.io":[32],"populationpyramid.net":[32],"poultryshowcentral.com":[32],"prayerist.com":[32],"preciouscore.com":[32],"pricescope.com":[32],"prologuetalk.com":[32],"puzzles-to-print.com":[32],"pythonguides.com":[32],"rachelteodoro.com":[224],"randomstreetview.com":[224],"realgreekrecipes.com":[224],"realmenrealstyle.com":[224],"respiratorytherapyzone.com":[224],"restonnow.com":[224],"rogerebert.com":[224],"routesnorth.com":[224],"saltinmycoffee.com":[32],"sarahremmer.com":[32],"savortheflavour.com":[32],"seasonedhomemaker.com":[32],"shiplapandshells.com":[32],"shooting.org":[32],"shorebeat.com":[32],"shoutoutarizona.com":[32],"shoutoutsouthcarolina.com":[32],"silverhomestead.com":[32],"simpleshowing.com":[32],"simplyhealthyfamily.org":[32],"sleeping.guide":[32],"slopitchcentral.com":[32],"smarttereachday.com":[32],"southcarolinavoyager.com":[32],"spacechatter.com":[32],"spicebangla.com":[32],"spreadsheetpage.com":[32],"stayfitmom.com":[32],"stetted.com":[32],"streamersplaybook.com":[32],"sugarmaplefarmhouse.com":[32],"supercheats.com":[32],"superdutydiesel.com":[32],"surfhungry.com":[32],"sustainmycrafthabit.com":[32],"svgnation.com":[32],"sweetandsavorymeals.com":[32],"swoonhub.com":[32],"talkbass.com":[32],"tanningsalonsnearme.com":[32],"tasteslovely.com":[32],"tastesoflizzyt.com":[32],"teamfight.lol":[32],"teds-list.com":[32],"thai-foodie.com":[32],"the-bella-vita.com":[32],"thebakeologie.com":[32],"thebalancednutritionist.com":[32],"thebensonstreet.com":[32],"thebestketorecipes.com":[32],"thebutteryfairytale.com":[32],"theclevercarrot.com":[32],"theclevermeal.com":[32],"thecookiedoughdiaries.com":[32],"thecookingfoodie.com":[32],"thegardeningdad.com":[32],"thehappychickencoop.com":[32],"theharperhouse.com":[32],"thehouseoffancy.com":[32],"thehyundaiforums.com":[32],"thelabradoodlesite.com":[32],"thematbakh.com":[32],"themilitarywifeandmom.com":[32],"thenaturalnurturer.com":[32],"thenavagepatch.com":[32],"thenwewalked.com":[32],"theoi.com":[32],"thepalatablelife.com":[32],"thepragmaticparent.com":[32],"therecipecritic.com":[32],"thesavorychopstick.com":[32],"thespeckledpalate.com":[32],"thetrendspotter.net":[32],"theunconventionalroute.com":[32],"theveglife.com":[32],"thevgnway.com":[32],"thislittlehome.com":[32],"thunderboltlaptop.com":[32],"traversewithtaylor.com":[32],"truemoneysaver.com":[32],"tuppennysfireplace.com":[32],"vegrecipesofindia.com":[224],"visitdowntownnashville.com":[224],"vmaxforum.net":[224],"voyagemichigan.com":[224],"voyageraleigh.com":[224],"wdio.com":[224],"west-games.com":[224],"wheatbythewayside.com":[224],"whiskeyriff.com":[224],"whiskeywatch.com":[224],"wichitabyeb.com":[224],"wifemamafoodie.com":[224],"wildernesstoday.com":[224],"worksheets-to-print.com":[224],"youbrewmytea.com":[224],"yourastrologyreading.com":[224],"yourguidesabroad.com":[224],"yuzubakes.com":[224],"4runner-forums.com":[214],"718forum.com":[214],"avsforum.com":[214],"buceesfans.com":[214],"c-classforum.com":[214],"cadenzaforum.com":[214],"catfish1.com":[214],"catforum.com":[214],"chevyblazer.org":[214],"clubfrontier.org":[214],"dieseljeeps.com":[214],"dodgetalk.com":[214],"elantraxd.com":[214],"etransitforum.com":[214],"f800riders.org":[214],"ferrari296forum.com":[214],"fiskerbuzz.com":[214],"fordstnation.com":[214],"frugalvillage.com":[214],"goldwingowners.com":[214],"grandhighlanderforum.com":[214],"jeepforum.com":[214],"kfx450central.com":[214],"lawnsite.com":[214],"marlinowners.com":[214],"mg-rover.org":[214],"moddedmustangs.com":[214],"nationalgunforum.com":[214],"ncgunowners.com":[214],"newbrunswickhunting.com":[214],"panigalev4club.com":[214],"pavementsucks.com":[214],"paw-talk.net":[214],"personalitycafe.com":[214],"plowsite.com":[214],"prowlertalk.net":[214],"r1-forum.com":[214],"rangerraptorowners.com":[214],"raptorforum.com":[214],"routerforums.com":[214],"runeriders.com":[214],"seltosforum.com":[214],"stingrayforums.com":[214],"taosforums.com":[214],"taurusarmed.net":[214],"thebassholes.com":[214],"theworldofarchitecture.com":[214],"trailsportforum.com":[214],"viperalley.com":[214],"volvo-forums.com":[214],"vtcafe.com":[214],"wolverineforums.com":[214],"zrvforum.com":[214],"h-donghua.com":[234],"husseinezzat.com":[234],"unblockedgamesgplus.gitlab.io":[234],"games.everythingzoomer.com":[235,236],"games.startribune.com":[235,236],"arkadiumhosted.com":[237],"doods.*":[238,239,240,20,22],"jennifereconomicgive.com":[22,241,89,105],"jeremyparticipantanything.com":[22,241,89,105],"jilliandescribecompany.com":[22,241,89,105],"mmtv01.xyz":[242,22,243,244],"turbovid.vip":[242,22,243,244],"m1xdrop.com":[168,22],"m1xdrop.net":[168,22],"lulust.com":[90,136,245,246],"javbee.*":[247],"expres.cz":[248,249],"cg-gamespc.net":[250,251,252,253,254,255,256,257,258,259,260,261,262],"dizipal1566.com":[263],"dizipal1599.com":[263],"inattv1288.xyz":[264],"inattv1291.xyz":[264],"inattv1318.xyz":[264],"inattv1321.xyz":[264],"voznovel.com":[265,266],"ilmeteo.it":[267],"eoreuni.com":[268],"myuploadedpremium.de":[269],"sms24.*":[270,271],"jncojeans.com":[272],"nguyenvanbao.com":[272],"ctrlv.*":[273,274],"eddiekidiw.com":[275],"swift4claim.com":[151],"linuxhint.com":[276],"infomaniakos.*":[277],"sexetag.com":[79],"netnaijas.com":[278],"batterypoweronline.com":[279],"myvalley.it":[279],"freemagazines.top":[280,281,282,283,108,284],"vapley.*":[22,285],"thesun.ie":[286,287,288],"chietitoday.it":[289],"forlitoday.it":[289],"quicomo.it":[289],"panel.skynode.pro":[290],"hd21.*":[22],"mobilesexgamesx.com":[291],"sexgamescc.com":[291],"foxtube.com":[22],"123strippoker.com":[46],"erotic-beauties.com":[292],"hardsex.cc":[292],"tube18.sexy":[292],"istanbulescortnetworks.com":[293],"pinoyalbums.com":[294],"kickass.*":[295,111,296],"kickassgo.*":[111,296],"ebony8.com":[297,298],"gadgetguideonline.com":[61],"extratorrents.*":[299],"courseboat.com":[300],"romhustler.org":[301],"addonbiz.com":[302],"sbchip.*":[156,160],"sbplay.*":[156,160,303,304],"sbrity.com":[156,160],"m2list.com":[305,116],"buyjiocoin.*":[22],"18tube.sex":[141],"waploaded.*":[67,306],"imslp.org":[181],"fapnado.*":[307],"beingtek.com":[152,52],"q1003.com":[308],"rincondelsazon.com":[309],"riazor.org":[310],"bfclive.com":[22,311],"lootup.me":[312],"goduke.com":[313],"publicflashing.me":[314],"alluretube.com":[20],"lovefap.com":[20],"mzansinudes.com":[20],"sexavgo.com":[20],"pornoborshch.com":[315],"h-flash.com":[22],"spfutures.org":[316],"boombj.com":[317],"mobilanyheter.net":[318],"xcity.org":[46,319],"xubster.com":[320],"ghior.com":[321],"watchseries9.*":[160],"babia.to":[322,323],"freepreset.net":[324],"lusttaboo.com":[325,145],"biologyclass.club":[326],"avpgalaxy.net":[327],"moonmov.pro":[22],"gewinde-normen.de":[39],"schaken-mods.com":[328],"player.hdgay.net":[329],"hdgay.net":[330],"cloudcomputingtopics.net":[331],"adzz.in":[332,333],"rendimentibtp.it":[334],"tvnet.lv":[328],"spigotunlocked.*":[335],"fedscoop.com":[336],"imagetotext.info":[337],"deezer.com":[338,339],"footyhunter.lol":[340],"arbweb.info":[341],"lucagrassetti.com":[342],"watchonlyfoolsandhorses.com":[22],"nammakalvi.com":[343],"diendancauduong.com":[344,345,346,234],"aeroxplorer.com":[98],"vidello.net":[22,347],"freebnbcoin.com":[348],"nft-media.net":[349],"empire-anime.*":[350,351,352,353,354,355,356,357,358],"empire-anime.com":[350,351,352,354,355,356],"pandasnovel.com":[359],"ruyashoujo.com":[360],"m.4khd.com":[361],"vxetable.cn":[362],"crotpedia.net":[137],"client.pylexnodes.net":[363],"hackerranksolution.in":[364],"mastaklomods.com":[282],"kawarthanow.com":[365],"yt-downloaderz.com":[334],"whoreshub.com":[366],"rollstroll.com":[365],"sabornutritivo.com":[334],"player.bestrapeporn.com":[22],"paramountplus.com":[367],"ville-ideale.fr":[368],"xhamster12.*":[369,370,371,372,373,374],"xhwebsite.com":[369,370,371,372,373,374],"brainly.*":[375,376],"eodev.com":[375],"megawarez.org":[377],"itv.com":[22],"a2zapk.*":[378,75,379,380],"a2zapk.io":[381],"vidsrc.click":[382],"bysejikuar.com":[126,383,22],"envato-downloader.com":[384],"sharedrive.*":[22],"visnalize.com":[334],"treasl.com":[385],"expressnews.com":[386],"lewdcorner.com":[387],"sex-empire.org":[22],"overtake.gg":[388],"technofino.in":[334],"nextgov.com":[389],"onloop.pro":[390],"gamingbeasts.com":[391],"seeklogo.com":[392],"oaaxpgp3.xyz":[22,393],"player.vidplus.pro":[394],"vidplus.pro":[395],"wvv-fmovies.com":[22],"svetatnazdraveto.bg":[134,334,396],"tennis.stream":[397],"givemesport.com":[398,334],"serviceemmc.com":[399],"4edtcixl.xyz":[22],"javplayers.com":[22],"desi.upn.bio":[400],"0ochi8hp.com":[22,126],"cdn.tiesraides.lv":[401],"animelatinohd.com":[402],"dlstreams.*":[403,404],"wcostream.*":[405,22],"watchanimesub.net":[406],"embed.wcostream.com":[407,408],"boobsradar.com":[409,140,410],"pourcesoir.in":[411],"pienovels.com":[103],"lewdgames.to":[412],"flixhouse.com":[413],"adbypass.org":[116],"hi0ti780.fun":[22,393],"gamehub.cam":[126,414],"hwbusters.com":[415],"pornproxy.art":[22,146],"pornproxy.app":[22,146],"vip-box.app":[192],"pornharlot.net":[416],"download.yasir252.com":[417,418],"remotejobzone.online":[419],"ditjesendatjes.nl":[420],"coolporno.net":[421],"sommerporno.com":[421],"tv.onefootball.com":[422],"mediamarkt.be":[310],"marinetraffic.live":[423],"weights.com":[419],"pelismkvhd.com":[424],"xmorex.com":[425],"atalantini.online":[426],"fastpeoplesearch.com":[427],"player4me.vip":[22],"camwhorestv.*":[428,429,430,46,22],"c.newsnow.com":[431,432],"cima4u.forum":[433],"oxxfile.*":[434,435],"planetrugby.com":[436,437],"chatgpt.com":[438],"mlb.com":[439],"damitv.live":[440,441],"scmp.com":[134,442],"tieulam.info":[443],"spotsaver.net":[22],"vocalley.com":[444,445,446],"nephobox.com":[447],"fawzy.xyz":[448,449,433,450],"vijviral.com":[451],"lifesurance.info":[452],"azsoft.*":[453,454,455],"4khd.com":[49,456],"arolinks.com":[457,458,459,460,461,52,462],"tulink.org":[463],"bgmiconfig.ink":[464],"youtube.com":[6],"0cbcq8mu.com":[22,393],"openchat-review.me":[465,466],"yamiisoku.com":[467,468,469],"pythonjobshq.com":[470],"pasteboard.co":[471],"theinventory.com":[472],"verizon.com":[473],"tierlists.com":[474],"flygbussarna.se":[475],"sterkinekor.com":[476],"eurogamer.pl":[16],"ekino-tv.pl":[73],"otube.pl":[477]};
const EXCEPT = {"uii.io":["noeval"],"pingit.com":["abort-on-property-read\u0001AaDetector","abort-on-property-read\u0001open","abort-on-property-read\u0001rmVideoPlay","abort-on-property-read\u0001_pop","abort-on-property-write\u0001Fingerprint2","set-constant\u0001blurred\u0001false"],"vr.pornhat.*":["abort-on-property-read\u0001document.dispatchEvent"],"vidsrc.*":["abort-current-script\u0001EventTarget.prototype.addEventListener\u0001delete window"],"bilibili.com":["json-prune-fetch-response\u0001data.item.[-].business_info.ad_desc\u0001\u0001/feed/rcmd"],"titulky.com":["set-constant\u0001xmxalr"],"idnes.cz":["abort-current-script\u0001HTMLIFrameElement.prototype.contentWindow"],"notube.com":["no-window-open-if"],"oxy.edu":["abort-current-script\u0001$\u0001window.open","no-setInterval-if\u0001.hide","abort-current-script\u0001$\u0001localStorage"],"money.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad","set-constant\u0001Object.prototype.rekids\u0001undefined","set-constant\u0001Object.prototype.gafSlot\u0001undefined","set-constant\u0001Object.prototype.advViewability\u0001undefined"],"kobieta.wp.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"gadzetomania.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"fotoblogia.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"komorkomania.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wiadomosci.wp.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"tech.wp.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"dom.wp.pl":["no-setTimeout-if\u0001detected\u0001300"],"facet.wp.pl":["no-setTimeout-if\u0001detected\u0001300"],"film.wp.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"finanse.wp.pl":["no-setTimeout-if\u0001detected\u0001300"],"gry.wp.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"gwiazdy.wp.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"ksiazki.wp.pl":["no-setTimeout-if\u0001detected\u0001300"],"kuchnia.wp.pl":["no-setTimeout-if\u0001detected\u0001300"],"moto.wp.pl":["no-setTimeout-if\u0001detected\u0001300"],"opinie.wp.pl":["no-setTimeout-if\u0001detected\u0001300"],"pogoda.wp.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"teleshow.wp.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"turystyka.wp.pl":["no-setTimeout-if\u0001detected\u0001300"],"wideo.wp.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wawalove.wp.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"autokult.pl":["no-setTimeout-if\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"horoskop.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"tv.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"twojeip.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"sportowefakty.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","set-constant\u0001Object.prototype.loadBunch\u0001noopFunc","abort-on-property-read\u0001Object.prototype.bodyCode","abort-on-property-read\u0001WP.inline"],"fitness.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","abort-on-property-read\u0001WP.inline","no-setTimeout-if\u0001/getComputedStyle[\\s\\S]*?style\\.display=\"none\"[\\s\\S]*?styleBlocked[\\s\\S]*?detected/"],"www.wp.pl":["abort-on-property-read\u0001__headpayload","abort-on-stack-trace\u0001WP\u0001r https","set-constant\u0001WP.gaf.loadBunch\u0001noopFunc"],"games.dailymail.co.uk":["abort-on-property-read\u0001Notification"],"games.dailymail.com":["abort-on-property-read\u0001Notification"],"platform.twitter.com":["json-prune-xhr-response\u0001data.home.home_timeline_urt.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/Home","json-prune-xhr-response\u0001data.search_by_raw_query.search_timeline.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/SearchTimeline","json-prune-xhr-response\u0001data.threaded_conversation_with_injections_v2.instructions.[].entries.[-].content.items.[].item.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/TweetDetail","json-prune-xhr-response\u0001data.user.result.timeline_v2.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/UserTweets","json-prune-xhr-response\u0001data.immersiveMedia.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/ImmersiveMedia"],"filmweb.pl":["abort-current-script\u0001decodeURIComponent\u0001newAdblockBoardDisplayed"],"linkneverdie.net":["no-setTimeout-if\u0001t"],"dziennik.pl":["abort-current-script\u0001parseInt\u0001adblock"],"gunauc.net":["no-fetch-if\u0001pagead2.googlesyndication.com"],"daddylive.link":["abort-on-property-read\u0001require"],"player.pl":["json-prune\u0001movie.advertising.ad_server"],"lookmovie.studio":["set-constant\u0001Yii2App.playbackTimeout\u00010"],"jobzhub.store":["replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"fitdynamos.com":["replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"labgame.io":["replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"sayphotobooth.com":["adjust-setInterval\u0001tp-time\u0001*\u00010.001"],"encurtador.postazap.com":["adjust-setInterval\u0001timer\u0001*\u00010.001"],"intercelestial.com":["adjust-setTimeout\u0001\u0001*\u00010.1"],"hubdrive.com":["no-window-open-if","addEventListener-defuser\u0001\u0001history.go"],"hubdrive.de":["no-window-open-if","addEventListener-defuser\u0001\u0001history.go"],"dziennikbaltycki.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dzienniklodzki.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dziennikpolski24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dziennikzachodni.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"echodnia.eu":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"expressbydgoski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"expressilustrowany.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetakrakowska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetalubuska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetawroclawska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gk24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gloswielkopolski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gol24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gp24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gra.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gs24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"kurierlubelski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"motofakty.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"naszemiasto.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nowiny24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nowosci.com.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nto.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"polskatimes.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"pomorska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"poranny.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"sportowy24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"strefaagro.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"strefabiznesu.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"stronakobiet.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"telemagazyn.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"to.com.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"wspolczesna.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"abczdrowie.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","no-setTimeout-if\u0001visibility\u00010"],"job.mt.de":["no-setTimeout-if\u0001.call(null)\u000110"],"job.nw.de":["no-setTimeout-if\u0001.call(null)\u000110"],"uqload.co":["abort-current-script\u0001document.createElement\u0001break;case $."],"yandex.*":["abort-on-property-read\u0001Object.prototype.renderDirect):matches-path(/\\/(?:weather\\/|pogoda\\/|hava\\/)/"],"pilot.wp.pl":["abort-on-property-read\u0001WP.inline"],"poczta.wp.pl":["abort-on-property-read\u0001WP.inline"],"open.fm":["set-constant\u0001Object.prototype.gafSlot\u0001undefined"],"dobreprogramy.pl":["abort-on-property-read\u0001wp_consent_color"]};
// Tarcza – biblioteka scriptletów (kompatybilna składniowo z uBlock Origin).
// Ten kod jest wklejany przez build.mjs do scriptlets/<lista>.js i uruchamiany
// w świecie MAIN strony na document_start, zanim wykonają się skrypty strony.
// Wszystko jest zamknięte w IIFE – nic nie wycieka do globalnego zakresu strony.

const win = window;
const doc = document;
const nativeToString = Function.prototype.toString;
const fnText = (fn) => { try { return typeof fn === 'function' ? nativeToString.call(fn) : String(fn); } catch { return ''; } };
const safeReflect = Reflect;
const ObjectDefineProperty = Object.defineProperty;
const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const magic = 'tarcza' + Math.random().toString(36).slice(2);

win.addEventListener('error', (ev) => {
  if (ev && typeof ev.message === 'string' && ev.message.includes(magic)) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }
}, true);

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** Wzorzec uBO: "/regex/flagi" albo dosłowny podciąg. Pusty → dopasowuje wszystko. */
function toRegex(pattern, flags = '') {
  if (pattern === undefined || pattern === '') return /^/;
  const m = /^\/(.+)\/([gimsu]*)$/.exec(pattern);
  if (m) { try { return new RegExp(m[1], m[2] || flags); } catch { return /(?!)/; } }
  return new RegExp(escapeRe(pattern), flags);
}

/** Argumenty nazwane w stylu uBO: ..., 'nazwa', 'wartość', ... */
function namedArgs(args) {
  const out = {};
  for (let i = 0; i + 1 < args.length; i += 2) out[args[i]] = args[i + 1];
  return out;
}

function abort() { throw new ReferenceError(magic); }

/**
 * Przechodzi po łańcuchu właściwości "a.b.c". Gdy pośredni obiekt jeszcze nie
 * istnieje, zakłada pułapkę, która dokończy przejście po jego przypisaniu.
 * onFinal(owner, prop) wywoływane jest dla ostatniego ogniwa.
 */
function trapChain(root, chain, onFinal) {
  const walk = (owner, path) => {
    const dot = path.indexOf('.');
    if (dot === -1) { onFinal(owner, path); return; }
    const prop = path.slice(0, dot);
    const rest = path.slice(dot + 1);
    let value;
    try { value = owner[prop]; } catch { return; }
    if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
      walk(value, rest);
      return;
    }
    const desc = ObjectGetOwnPropertyDescriptor(owner, prop);
    if (desc && desc.configurable === false) return;
    let current = value;
    try {
      ObjectDefineProperty(owner, prop, {
        configurable: true,
        enumerable: true,
        get() { return current; },
        set(v) {
          current = v;
          if (v !== null && (typeof v === 'object' || typeof v === 'function')) walk(v, rest);
        },
      });
    } catch { /* ignoruj */ }
  };
  walk(root, chain);
}

const REMOVE = Symbol('remove');

function constantValue(raw, trusted) {
  switch (raw) {
    case 'undefined': return { v: undefined };
    case 'false': return { v: false };
    case 'true': return { v: true };
    case 'null': return { v: null };
    case "''": case '""': case 'emptyStr': case '': return { v: '' };
    case '[]': case 'emptyArr': return { v: [] };
    case '{}': case 'emptyObj': return { v: {} };
    case 'noopFunc': return { v: function () {} };
    case 'noopCallbackFunc': return { v: function () { return function () {}; } };
    case 'trueFunc': return { v: function () { return true; } };
    case 'falseFunc': return { v: function () { return false; } };
    case 'throwFunc': return { v: function () { throw new Error(magic); } };
    case 'noopPromiseResolve': return { v: function () { return Promise.resolve(); } };
    case 'noopPromiseReject': return { v: function () { return Promise.reject(); } };
    case 'yes': case 'no': case 'on': case 'off': return { v: raw };
    case '$remove$': return { v: REMOVE };
  }
  if (/^-?\d+$/.test(raw)) {
    const n = parseInt(raw, 10);
    if (Math.abs(n) <= 0x7FFF || trusted) return { v: n };
    return null;
  }
  if (/^-?\d*\.\d+$/.test(raw) && trusted) return { v: parseFloat(raw) };
  if (trusted && raw.startsWith('json:')) {
    try { return { v: JSON.parse(raw.slice(5)) }; } catch { return null; }
  }
  if (trusted) {
    try { return { v: JSON.parse(raw) }; } catch { return { v: raw }; }
  }
  return null;
}

function setConstantImpl(chain, rawValue, trusted, extra) {
  if (!chain) return;
  const cv = constantValue(rawValue === undefined ? 'undefined' : rawValue, trusted);
  if (!cv) return;
  let value = cv.v;
  const wrap = extra && extra[0];
  if (wrap === 'asFunction') { const v = value; value = function () { return v; }; }
  else if (wrap === 'asCallback') { const v = value; value = function () { return function () { return v; }; }; }
  else if (wrap === 'asResolved') { const v = value; value = Promise.resolve(v); }
  else if (wrap === 'asRejected') { const v = value; value = Promise.reject(v); }
  trapChain(win, chain, (owner, prop) => {
    const desc = ObjectGetOwnPropertyDescriptor(owner, prop);
    if (desc && desc.configurable === false) {
      if (desc.writable && value !== REMOVE) { try { owner[prop] = value; } catch {} }
      return;
    }
    if (value === REMOVE) {
      try {
        ObjectDefineProperty(owner, prop, { configurable: true, get() { return undefined; }, set() {} });
      } catch {}
      return;
    }
    try {
      ObjectDefineProperty(owner, prop, {
        configurable: false,
        enumerable: desc ? desc.enumerable : true,
        get() { return value; },
        set() { /* strona nie może nadpisać */ },
      });
    } catch {}
  });
}

function wrapAccessor(chain, validate) {
  trapChain(win, chain, (owner, prop) => {
    const desc = ObjectGetOwnPropertyDescriptor(owner, prop);
    if (desc && desc.configurable === false) return;
    let value = desc ? desc.value : undefined;
    const getter = desc && desc.get;
    const setter = desc && desc.set;
    try {
      ObjectDefineProperty(owner, prop, {
        configurable: true,
        enumerable: desc ? desc.enumerable : true,
        get() { validate(); return getter ? getter.call(this) : value; },
        set(v) { validate(); if (setter) setter.call(this, v); else value = v; },
      });
    } catch {}
  });
}

function getScriptText(el) {
  let text = el.textContent || '';
  if (el.src) text = el.src + '\n' + text;
  return text;
}

function matchesNumber(rawDelay, delay) {
  if (rawDelay === undefined || rawDelay === '' || rawDelay === '*') return true;
  const not = rawDelay.startsWith('!');
  const n = parseInt(not ? rawDelay.slice(1) : rawDelay, 10);
  return (Number(delay) === n) !== not;
}

function timerDefuser(name, needle = '', rawDelay) {
  const not = needle.startsWith('!');
  const re = toRegex(not ? needle.slice(1) : needle);
  const orig = win[name];
  win[name] = new Proxy(orig, {
    apply(target, thisArg, args) {
      const [cb, delay] = args;
      const text = fnText(cb);
      if (re.test(text) !== not && matchesNumber(rawDelay, delay)) {
        args[0] = function () {};
      }
      return safeReflect.apply(target, thisArg, args);
    },
  });
}

function timerBooster(name, needle = '', rawDelay = '1000', rawBoost = '0.05') {
  const re = toRegex(needle);
  const delay = rawDelay === '*' ? -1 : parseInt(rawDelay, 10) || 1000;
  let boost = parseFloat(rawBoost);
  if (!isFinite(boost)) boost = 0.05;
  boost = Math.min(50, Math.max(0.001, boost));
  const orig = win[name];
  win[name] = new Proxy(orig, {
    apply(target, thisArg, args) {
      const [cb, d] = args;
      if ((delay === -1 || Number(d) === delay) && re.test(fnText(cb))) args[1] = (Number(d) || 0) * boost;
      return safeReflect.apply(target, thisArg, args);
    },
  });
}

function parsePropsToMatch(raw, urlKey = 'url') {
  const out = {};
  if (!raw) return out;
  for (const part of raw.split(/\s+/)) {
    if (!part) continue;
    const m = /^([a-zA-Z]+):(.*)$/.exec(part);
    if (m) out[m[1]] = toRegex(m[2]);
    else out[urlKey] = toRegex(part);
  }
  return out;
}

function propsMatch(props, details) {
  for (const k of Object.keys(props)) {
    const v = details[k];
    if (v === undefined || !props[k].test(String(v))) return false;
  }
  return true;
}

function fakeBody(raw) {
  if (raw === 'emptyObj') return '{}';
  if (raw === 'emptyArr') return '[]';
  if (raw === 'true') return Math.random().toString(36).slice(2, 12);
  return '';
}

// ----- JSON ----------------------------------------------------------------

function pathTokens(p) { return p.split('.'); }

function findOwners(obj, tokens, out) {
  if (obj === null || typeof obj !== 'object') return;
  if (tokens.length === 1) { out.push([obj, tokens[0]]); return; }
  const [head, ...rest] = tokens;
  if (head === '[]' || head === '*') {
    for (const k of Object.keys(obj)) findOwners(obj[k], rest, out);
    return;
  }
  if (Object.prototype.hasOwnProperty.call(obj, head)) findOwners(obj[head], rest, out);
}

function hasPath(obj, p) {
  const owners = [];
  findOwners(obj, pathTokens(p), owners);
  return owners.some(([o, k]) => {
    if (k === '[]' || k === '*') return Object.keys(o).length > 0;
    return Object.prototype.hasOwnProperty.call(o, k);
  });
}

function makePruner(rawPrune = '', rawNeedle = '') {
  const prunePaths = rawPrune.split(/ +/).filter(Boolean);
  const needlePaths = rawNeedle.split(/ +/).filter(Boolean);
  const removeElements = (obj, p) => {
    // "a.[-].b.c" – usuń z tablicy a elementy, które mają ścieżkę b.c
    const at = p.indexOf('[-]');
    const prefix = p.slice(0, at).replace(/\.$/, '');
    const rest = p.slice(at + 3).replace(/^\./, '');
    const holders = [];
    if (prefix) findOwners(obj, pathTokens(prefix), holders);
    const arrays = prefix ? holders.map(([o, k]) => o[k]) : [obj];
    let changed = false;
    for (const arr of arrays) {
      if (!Array.isArray(arr)) continue;
      for (let i = arr.length - 1; i >= 0; i--) {
        if (!rest || hasPath(arr[i], rest)) { arr.splice(i, 1); changed = true; }
      }
    }
    return changed;
  };
  return function prune(obj) {
    if (!prunePaths.length || obj === null || typeof obj !== 'object') return false;
    if (needlePaths.length && !needlePaths.every((p) => hasPath(obj, p))) return false;
    let changed = false;
    for (const p of prunePaths) {
      if (p.includes('[-]')) { if (removeElements(obj, p)) changed = true; continue; }
      const owners = [];
      findOwners(obj, pathTokens(p), owners);
      for (const [o, k] of owners) {
        if (k === '[]' || k === '*') {
          if (Array.isArray(o)) { if (o.length) { o.length = 0; changed = true; } }
          else for (const kk of Object.keys(o)) { delete o[kk]; changed = true; }
        } else if (Object.prototype.hasOwnProperty.call(o, k)) {
          delete o[k];
          changed = true;
        }
      }
    }
    return changed;
  };
}

// ----- DOM -----------------------------------------------------------------

function onDomChange(fn, stay) {
  fn();
  let pending = false;
  const run = () => { pending = false; fn(); };
  const mo = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    (win.requestAnimationFrame || setTimeout)(run);
  });
  const start = () => mo.observe(doc.documentElement || doc, { childList: true, subtree: true, attributes: true });
  start();
  if (!stay) {
    const stop = () => setTimeout(() => mo.disconnect(), 2000);
    if (doc.readyState === 'complete') stop();
    else win.addEventListener('load', stop, { once: true });
  }
  doc.addEventListener('DOMContentLoaded', fn, { once: true });
}

function safeValue(raw) {
  const allowed = ['accept', 'reject', 'yes', 'no', 'y', 'n', 'true', 'false', 'ok', 'on', 'off', 'allow',
    'deny', 'allowed', 'denied', 'necessary', 'required', 'approved', 'disapproved', 'hide', 'hidden',
    'essential', 'nonessential', 'checked', 'unchecked', 'forbidden', 'forever', 'dismiss', 'dismissed',
    'done', 'closed', 'disabled', 'enabled', 'agree', 'agreed', '', 'null', 'undefined', 'emptyObj', 'emptyArr'];
  if (allowed.includes(String(raw).toLowerCase())) {
    if (raw === 'emptyObj') return '{}';
    if (raw === 'emptyArr') return '[]';
    if (raw === 'null' || raw === 'undefined') return raw;
    return raw;
  }
  if (/^\d{1,5}$/.test(raw) && parseInt(raw, 10) <= 32767) return raw;
  return null;
}

function setStorageItem(storageName, key, raw, trusted) {
  if (!key) return;
  let storage;
  try { storage = win[storageName]; } catch { return; }
  if (!storage) return;
  try {
    if (raw === '$remove$') { storage.removeItem(key); return; }
    let value = trusted ? raw : safeValue(raw);
    if (value === null) return;
    if (trusted) {
      if (raw === '$now$') value = String(Date.now());
      else if (raw === '$currentDate$') value = String(new Date());
      else if (raw === '$currentISODate$') value = new Date().toISOString();
    }
    if (storage.getItem(key) === value) return;
    storage.setItem(key, value);
  } catch {}
}

function setCookieImpl(name, value, path, maxAgeSec) {
  if (!name) return;
  const existing = doc.cookie.split(/;\s*/).find((c) => c.startsWith(encodeURIComponent(name) + '='));
  if (existing && existing.slice(existing.indexOf('=') + 1) === value) return;
  let cookie = `${encodeURIComponent(name)}=${value}; path=${path || '/'}`;
  if (maxAgeSec) cookie += `; max-age=${maxAgeSec}`;
  try { doc.cookie = cookie; } catch {}
}

// ----- Scriptlety ----------------------------------------------------------

const S = {
  'set-constant'(chain, value, ...extra) { setConstantImpl(chain, value, false, extra); },
  'trusted-set-constant'(chain, value, ...extra) { setConstantImpl(chain, value, true, extra); },

  'abort-on-property-read'(chain) {
    if (!chain) return;
    trapChain(win, chain, (owner, prop) => {
      try { ObjectDefineProperty(owner, prop, { configurable: true, get: abort, set() {} }); } catch {}
    });
  },

  'abort-on-property-write'(chain) {
    if (!chain) return;
    trapChain(win, chain, (owner, prop) => {
      try { ObjectDefineProperty(owner, prop, { configurable: true, get() { return undefined; }, set: abort }); } catch {}
    });
  },

  'abort-current-script'(chain, needle = '') {
    if (!chain) return;
    const re = needle ? toRegex(needle) : null;
    const self = doc.currentScript;
    wrapAccessor(chain, () => {
      const el = doc.currentScript;
      if (!(el instanceof HTMLScriptElement) || el === self) return;
      if (re && !re.test(getScriptText(el))) return;
      abort();
    });
  },

  'abort-on-stack-trace'(chain, needle = '') {
    if (!chain || !needle) return;
    const re = toRegex(needle === 'inlineScript' || needle === 'injectedScript'
      ? escapeRe(location.href.split('#')[0]) : needle);
    wrapAccessor(chain, () => {
      const stack = new Error().stack || '';
      if (re.test(stack.split('\n').slice(2).join('\n'))) abort();
    });
  },

  'addEventListener-defuser'(type = '', handler = '') {
    if (!type && !handler) return;
    const reType = toRegex(type);
    const reHandler = toRegex(handler);
    const proto = EventTarget.prototype;
    proto.addEventListener = new Proxy(proto.addEventListener, {
      apply(target, thisArg, args) {
        let t = '';
        let h = '';
        try { t = String(args[0]); h = fnText(args[1]); } catch {}
        if (reType.test(t) && reHandler.test(h)) return undefined;
        return safeReflect.apply(target, thisArg, args);
      },
    });
  },

  'no-setTimeout-if'(needle, delay) { timerDefuser('setTimeout', needle, delay); },
  'no-setInterval-if'(needle, delay) { timerDefuser('setInterval', needle, delay); },
  'adjust-setTimeout'(needle, delay, boost) { timerBooster('setTimeout', needle, delay, boost); },
  'adjust-setInterval'(needle, delay, boost) { timerBooster('setInterval', needle, delay, boost); },

  'no-window-open-if'(pattern = '', delay = '', decoy = '') {
    const not = pattern.startsWith('!');
    const re = toRegex(not ? pattern.slice(1) : pattern);
    win.open = new Proxy(win.open, {
      apply(target, thisArg, args) {
        const url = String(args[0] === undefined ? '' : args[0]);
        if (re.test(url) === not) return safeReflect.apply(target, thisArg, args);
        if (decoy === 'obj' || decoy === 'blank') {
          // atrapa okna
        }
        const fake = new Proxy({}, {
          get(t, p) {
            if (p === 'closed') return false;
            if (p === 'opener') return win;
            if (p === 'document') return doc.implementation.createHTMLDocument('');
            if (p === 'location') return { href: url, assign() {}, replace() {} };
            if (p === 'window' || p === 'self') return fake;
            return function () {};
          },
          set() { return true; },
        });
        return fake;
      },
    });
  },

  'no-fetch-if'(rawProps = '', responseBody = '') {
    if (!rawProps) return;
    const props = parsePropsToMatch(rawProps);
    const origFetch = win.fetch;
    if (typeof origFetch !== 'function') return;
    win.fetch = new Proxy(origFetch, {
      apply(target, thisArg, args) {
        const details = {};
        try {
          const [res, init] = args;
          if (res instanceof Request) {
            for (const k of ['url', 'method', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'integrity']) details[k] = res[k];
          } else {
            details.url = String(res);
          }
          if (init && typeof init === 'object') {
            for (const k of Object.keys(init)) { const v = init[k]; details[k] = typeof v === 'string' ? v : (k === 'body' ? String(v) : JSON.stringify(v)); }
          }
          if (!details.method) details.method = 'GET';
        } catch {}
        if (!propsMatch(props, details)) return safeReflect.apply(target, thisArg, args);
        const response = new Response(fakeBody(responseBody), { status: 200, statusText: 'OK' });
        try {
          ObjectDefineProperty(response, 'url', { value: details.url || '' });
          ObjectDefineProperty(response, 'type', { value: 'basic' });
        } catch {}
        return Promise.resolve(response);
      },
    });
  },

  'no-xhr-if'(rawProps = '', directive = '') {
    if (!rawProps) return;
    const props = parsePropsToMatch(rawProps);
    const Native = win.XMLHttpRequest;
    if (!Native) return;
    const fakes = new WeakMap();
    win.XMLHttpRequest = class extends Native {
      open(method, url, ...rest) {
        const details = { method: String(method).toUpperCase(), url: String(url) };
        if (propsMatch(props, details)) fakes.set(this, details);
        else fakes.delete(this);
        return super.open(method, url, ...rest);
      }
      send(...args) {
        const d = fakes.get(this);
        if (!d) return super.send(...args);
        const body = fakeBody(directive);
        try {
          ObjectDefineProperties(this, body);
        } catch {}
        setTimeout(() => {
          for (const type of ['readystatechange', 'load', 'loadend']) {
            try { this.dispatchEvent(new Event(type)); } catch {}
          }
        }, 1);
        function ObjectDefineProperties(xhr, text) {
          const v = (value) => ({ value, configurable: true });
          Object.defineProperties(xhr, {
            readyState: v(4), status: v(200), statusText: v('OK'),
            response: v(xhr.responseType === 'json' ? (text ? JSON.parse(text) : null) : text),
            responseText: v(text), responseURL: v(d.url),
          });
        }
        return undefined;
      }
    };
  },

  'remove-attr'(rawAttrs = '', selector = '', behavior = '') {
    const attrs = rawAttrs.split(/\s*\|\s*/).filter(Boolean);
    if (!attrs.length) return;
    const sel = selector || attrs.map((a) => `[${CSS.escape(a)}]`).join(',');
    const run = () => {
      try {
        for (const el of doc.querySelectorAll(sel)) for (const a of attrs) el.removeAttribute(a);
      } catch {}
    };
    onDomChange(run, behavior.includes('stay'));
  },

  'remove-class'(rawClasses = '', selector = '', behavior = '') {
    const classes = rawClasses.split(/\s*\|\s*/).filter(Boolean);
    if (!classes.length) return;
    const sel = selector || classes.map((c) => '.' + CSS.escape(c)).join(',');
    const run = () => {
      try {
        for (const el of doc.querySelectorAll(sel)) el.classList.remove(...classes);
      } catch {}
    };
    onDomChange(run, behavior.includes('stay'));
  },

  'set-attr'(selector = '', attr = '', value = '') {
    if (!selector || !attr) return;
    if (!/^(|true|false|-?\d{1,5}|\[[\w-]+\])$/.test(value)) return;
    const run = () => {
      try {
        for (const el of doc.querySelectorAll(selector)) {
          const v = value.startsWith('[') ? (el.getAttribute(value.slice(1, -1)) || '') : value;
          if (el.getAttribute(attr) !== v) el.setAttribute(attr, v);
        }
      } catch {}
    };
    onDomChange(run, true);
  },

  'remove-node-text'(nodeName = '', pattern = '') {
    if (!nodeName) return;
    const reName = toRegex(nodeName.startsWith('/') ? nodeName : '^' + escapeRe(nodeName) + '$');
    const reText = toRegex(pattern);
    const check = (node) => {
      if (!reName.test(node.nodeName.toLowerCase())) return;
      const text = node.textContent || '';
      if (pattern && !reText.test(text)) return;
      if (node.nodeType === 3) node.textContent = '';
      else if (node.parentNode) node.textContent = '', node.remove();
    };
    const mo = new MutationObserver((records) => {
      for (const r of records) for (const n of r.addedNodes) { check(n); if (n.nodeType === 1 && n.nodeName === 'SCRIPT') {} }
    });
    mo.observe(doc, { childList: true, subtree: true });
    doc.addEventListener('DOMContentLoaded', () => setTimeout(() => mo.disconnect(), 5000), { once: true });
  },

  'replace-node-text'(nodeName = '', pattern = '', replacement = '') {
    if (!nodeName || !pattern) return;
    const reName = toRegex(nodeName.startsWith('/') ? nodeName : '^' + escapeRe(nodeName) + '$');
    const rePattern = toRegex(pattern, 'g');
    const check = (node) => {
      if (!reName.test(node.nodeName.toLowerCase())) return;
      const text = node.textContent || '';
      rePattern.lastIndex = 0;
      if (!rePattern.test(text)) return;
      rePattern.lastIndex = 0;
      node.textContent = text.replace(rePattern, replacement);
    };
    const mo = new MutationObserver((records) => {
      for (const r of records) for (const n of r.addedNodes) check(n);
    });
    mo.observe(doc, { childList: true, subtree: true });
    doc.addEventListener('DOMContentLoaded', () => setTimeout(() => mo.disconnect(), 5000), { once: true });
  },

  'json-prune'(rawPrune = '', rawNeedle = '') {
    const prune = makePruner(rawPrune, rawNeedle);
    JSON.parse = new Proxy(JSON.parse, {
      apply(target, thisArg, args) {
        const r = safeReflect.apply(target, thisArg, args);
        try { prune(r); } catch {}
        return r;
      },
    });
    Response.prototype.json = new Proxy(Response.prototype.json, {
      apply(target, thisArg, args) {
        return safeReflect.apply(target, thisArg, args).then((o) => { try { prune(o); } catch {} return o; });
      },
    });
  },

  'json-prune-fetch-response'(rawPrune = '', rawNeedle = '', ...rest) {
    const extra = namedArgs(rest);
    const props = parsePropsToMatch(extra.propsToMatch || '');
    const prune = makePruner(rawPrune, rawNeedle);
    const origFetch = win.fetch;
    if (typeof origFetch !== 'function') return;
    win.fetch = new Proxy(origFetch, {
      apply(target, thisArg, args) {
        const p = safeReflect.apply(target, thisArg, args);
        let details;
        try {
          const [res, init] = args;
          details = res instanceof Request ? { url: res.url, method: res.method } : { url: String(res), method: (init && init.method) || 'GET' };
        } catch { return p; }
        if (!propsMatch(props, details)) return p;
        return p.then((resp) => resp.clone().json().then((obj) => {
          if (!prune(obj)) return resp;
          const out = new Response(JSON.stringify(obj), { status: resp.status, statusText: resp.statusText, headers: resp.headers });
          try {
            ObjectDefineProperty(out, 'url', { value: resp.url });
            ObjectDefineProperty(out, 'type', { value: resp.type });
            ObjectDefineProperty(out, 'redirected', { value: resp.redirected });
          } catch {}
          return out;
        }).catch(() => resp));
      },
    });
  },

  'json-prune-xhr-response'(rawPrune = '', rawNeedle = '', ...rest) {
    const extra = namedArgs(rest);
    const props = parsePropsToMatch(extra.propsToMatch || '');
    const prune = makePruner(rawPrune, rawNeedle);
    const Native = win.XMLHttpRequest;
    if (!Native) return;
    const urls = new WeakMap();
    const cache = new WeakMap();
    const responseDesc = ObjectGetOwnPropertyDescriptor(Native.prototype, 'response');
    const textDesc = ObjectGetOwnPropertyDescriptor(Native.prototype, 'responseText');
    const compute = (xhr) => {
      if (cache.has(xhr)) return cache.get(xhr);
      const raw = responseDesc.get.call(xhr);
      let result = { response: raw, text: null };
      try {
        if (xhr.readyState === 4) {
          const type = xhr.responseType;
          let obj = null;
          if (type === 'json') obj = raw;
          else if (type === '' || type === 'text') obj = JSON.parse(raw);
          if (obj && prune(obj)) {
            const text = JSON.stringify(obj);
            result = { response: type === 'json' ? obj : text, text };
          }
          cache.set(xhr, result);
        }
      } catch { if (xhr.readyState === 4) cache.set(xhr, result); }
      return result;
    };
    win.XMLHttpRequest = class extends Native {
      open(method, url, ...r) {
        cache.delete(this);
        urls.set(this, propsMatch(props, { method: String(method).toUpperCase(), url: String(url) }));
        return super.open(method, url, ...r);
      }
      get response() {
        if (!urls.get(this)) return responseDesc.get.call(this);
        return compute(this).response;
      }
      get responseText() {
        if (!urls.get(this)) return textDesc.get.call(this);
        const r = compute(this);
        return r.text !== null ? r.text : textDesc.get.call(this);
      }
    };
  },

  'set-cookie'(name = '', value = '', path = '') {
    const v = safeValue(value);
    if (v === null) return;
    setCookieImpl(name, encodeURIComponent(v), path === 'none' ? '' : path);
  },

  'trusted-set-cookie'(name = '', value = '', offset = '', path = '') {
    let v = value;
    if (v === '$now$') v = String(Date.now());
    else if (v === '$currentDate$') v = String(new Date());
    else if (v === '$currentISODate$') v = new Date().toISOString();
    let maxAge = 0;
    if (offset === '1day') maxAge = 86400;
    else if (offset === '1year') maxAge = 31536000;
    else if (/^\d+$/.test(offset)) maxAge = parseInt(offset, 10);
    setCookieImpl(name, encodeURIComponent(v), path === 'none' ? '' : path, maxAge);
  },

  'remove-cookie'(needle = '') {
    const re = toRegex(needle);
    const remove = () => {
      for (const c of doc.cookie.split(/;\s*/)) {
        const name = c.split('=')[0];
        if (!name || !re.test(name)) continue;
        const parts = location.hostname.split('.');
        const expire = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        for (let i = 0; i < parts.length - 1; i++) {
          const domain = parts.slice(i).join('.');
          doc.cookie = `${name}${expire}; path=/; domain=${domain}`;
          doc.cookie = `${name}${expire}; path=/; domain=.${domain}`;
        }
        doc.cookie = `${name}${expire}; path=/`;
        doc.cookie = `${name}${expire}`;
      }
    };
    remove();
    win.addEventListener('beforeunload', remove);
    doc.addEventListener('visibilitychange', remove);
  },

  'set-local-storage-item'(key, value) { setStorageItem('localStorage', key, value, false); },
  'set-session-storage-item'(key, value) { setStorageItem('sessionStorage', key, value, false); },
  'trusted-set-local-storage-item'(key, value) { setStorageItem('localStorage', key, value, true); },
  'trusted-set-session-storage-item'(key, value) { setStorageItem('sessionStorage', key, value, true); },

  'noeval'() {
    win.eval = new Proxy(win.eval, { apply() { return undefined; } });
  },

  'noeval-if'(needle = '') {
    const re = toRegex(needle);
    win.eval = new Proxy(win.eval, {
      apply(target, thisArg, args) {
        if (re.test(String(args[0]))) return undefined;
        return safeReflect.apply(target, thisArg, args);
      },
    });
  },

  'nowebrtc'() {
    const names = ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection'];
    const Fake = function () {
      return {
        close() {}, createDataChannel() { return { close() {} }; }, createOffer() { return Promise.resolve(); },
        createAnswer() { return Promise.resolve(); }, setLocalDescription() { return Promise.resolve(); },
        setRemoteDescription() { return Promise.resolve(); }, addIceCandidate() { return Promise.resolve(); },
        addEventListener() {}, removeEventListener() {}, getStats() { return Promise.resolve(new Map()); },
      };
    };
    for (const n of names) if (n in win) { try { win[n] = Fake; } catch {} }
  },

  'trusted-click-element'(rawSelectors = '', extraMatch = '', rawDelay = '') {
    const selectors = rawSelectors.split(/\s*,\s+/).map((s) => s.trim()).filter(Boolean);
    if (!selectors.length) return;
    // dodatkowe warunki: cookie:nazwa / localStorage:klucz (+ opcjonalnie !negacja)
    if (extraMatch) {
      for (const cond of extraMatch.split(/\s*,\s*/)) {
        const m = /^(!)?(cookie|localStorage):(.+)$/.exec(cond);
        if (!m) continue;
        const [, not, kind, key] = m;
        const re = toRegex(key);
        let present = false;
        try {
          present = kind === 'cookie'
            ? doc.cookie.split(/;\s*/).some((c) => re.test(c.split('=')[0]))
            : Object.keys(localStorage).some((k) => re.test(k));
        } catch {}
        if (present === !!not) return;
      }
    }
    const delay = Math.max(1, parseInt(rawDelay, 10) || 1);
    const deadline = Date.now() + 10000;
    let index = 0;
    const query = (s) => {
      // obsługa "a >>> b" (shadow DOM)
      const parts = s.split(/\s*>>>\s*/);
      let root = doc;
      let el = null;
      for (const p of parts) {
        el = root.querySelector(p);
        if (!el) return null;
        root = el.shadowRoot || el;
      }
      return el;
    };
    const step = () => {
      if (index >= selectors.length || Date.now() > deadline) { mo.disconnect(); return; }
      const el = query(selectors[index]);
      if (!el) return;
      index++;
      setTimeout(() => { try { el.click(); } catch {} step(); }, delay);
    };
    const mo = new MutationObserver(() => step());
    const start = () => { mo.observe(doc.documentElement || doc, { childList: true, subtree: true }); step(); };
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start, { once: true }); else start();
    setTimeout(() => mo.disconnect(), 10000);
  },
};

function hostCandidates(hostname) {
  const labels = hostname.split('.');
  const out = [];
  for (let i = 0; i < labels.length; i++) {
    const suffix = labels.slice(i);
    out.push(suffix.join('.'));
    if (suffix.length >= 2) out.push(suffix.slice(0, -1).join('.') + '.*');
    if (suffix.length >= 3) out.push(suffix.slice(0, -2).join('.') + '.*');
  }
  return out;
}

function runForHost(calls, hosts, except) {
  let hostname = '';
  try { hostname = location.hostname; } catch {}
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
    const fn = S[call[0]];
    if (!fn) continue;
    try { fn(...call.slice(1)); } catch { /* scriptlet nie może zepsuć strony */ }
  }
}

runForHost(CALLS, HOSTS, EXCEPT);
})();
