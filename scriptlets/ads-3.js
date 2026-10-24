/* ChromeBlock – scriptlety listy "Reklamy" (część 4/24). Plik generowany przez tools/build.mjs. */
(function () {
'use strict';
const CALLS = [["trusted-replace-xhr-response","\"adPlacements\"","\"no_ads\"","/playlist\\?list=|\\/player(?:\\?.+)?$|watch\\?[tv]=/"],["set-constant","ytInitialPlayerResponse.playerAds","undefined"],["set-constant","ytInitialPlayerResponse.adPlacements","undefined"],["set-constant","ytInitialPlayerResponse.adSlots","undefined"],["set-constant","playerResponse.adPlacements","undefined"],["json-prune-fetch-response","reelWatchSequenceResponse.entries.[-].command.reelWatchEndpoint.adClientParams.isAd entries.[-].command.reelWatchEndpoint.adClientParams.isAd","","propsToMatch","url:/reel_watch_sequence?"],["json-prune","entries.[-].command.reelWatchEndpoint.adClientParams.isAd"],["trusted-replace-xhr-response","/\"adPlacements.*?([A-Z]\"\\}|\"\\}{2,4})\\}\\],/","","/playlist\\?list=|\\/player(?:\\?.+)?$|watch\\?[tv]=/"],["trusted-replace-xhr-response","/\"adPlacements.*?(\"adSlots\"|\"adBreakHeartbeatParams\")/gms","$1","/\\/player(?:\\?.+)?$/"],["trusted-replace-fetch-response","\"adPlacements\"","\"no_ads\"","player?"],["trusted-replace-fetch-response","\"adSlots\"","\"no_ads\"","player?"],["trusted-replace-node-text","script","/(\\(function serverContract\\(\\)|^if \\(window\\.ytcsi)/","(()=>{if(\"YOUTUBE_PREMIUM_LOGO\"===window.ytInitialData?.topbar?.desktopTopbarRenderer?.logo?.topbarLogoRenderer?.iconImage?.iconType||\"YOUTUBE_PREMIUM_LOGO\"===document.getElementById(\"masthead\")?.attributes?.[\"logo-type\"]?.value||location.href.startsWith(\"https://www.youtube.com/tv#/\"))return;const e=window.ytcfg.data_.INNERTUBE_CONTEXT.client.userAgent,t=[\"channel\",\"lactmilli\",\"inline\",\"yahi\"];let r=!1,o=t;const n=t=>{if(t){let r=e?.match?.(/Mozilla\\/5\\.0 \\([^)]+/)?.[0];window.ytcfg.data_.INNERTUBE_CONTEXT.client.userAgent=r?e.replace?.(r,r+\"; \"+t):e}else window.ytcfg.data_.INNERTUBE_CONTEXT.client.userAgent=e},a=()=>{let e=document.getElementById(\"movie_player\");return{player:e,response:e?.getPlayerResponse?.(),stats:e?.getStatsForNerds?.(),progress:e?.getProgressState?.(),buffer:e?.getPlayerStateObject?.()?.isBuffering}},l=(e,t,r)=>e&&\"0.00 s\"===t?.buffer_health_seconds&&\"0x0\"===t?.resolution&&r.length>0,s=()=>{let{player:e,response:t,stats:n,buffer:s}=a();e&&l(s,n,o)&&(t?.playbackTracking?.videostatsPlaybackUrl?.baseUrl?.includes?.(\"reloadxhr\")&&(o=o.slice(1)),r=!0)};document.addEventListener(\"DOMContentLoaded\",(function(){const e=()=>{let e,s,{player:i,response:d,stats:c,progress:p,buffer:y}=a();if(i&&(window.location.href.includes(\"/watch?\")||window.location.href.includes(\"/embed/\"))){if(p&&p.duration>0&&(p.loaded<p.duration||p.duration-p.current>1)||d?.videoDetails?.isLive){if(c&&!c?.debug_info?.startsWith?.(\"SSAP, AD\")){const t=new URLSearchParams(window.location.search),a=d.videoDetails?.videoId,u=d.playerConfig?.playbackStartConfig?.startSeconds||parseInt(t.get(\"t\"),10)||0,g=d.playabilityStatus?.errorScreen,w=JSON.stringify(g?.playerErrorMessageRenderer?.subreason?.runs||g?.playerInterstitialRenderer?.content?.interstitialViewModel?.description?.commandRuns);return void(\"UNPLAYABLE\"===d?.playabilityStatus?.status&&!g?.playerErrorMessageRenderer?.playerCaptchaViewModel&&w?.includes?.(\"WEB_PAGE_TYPE_UNKNOWN\")&&w?.includes?.(\"https://support.google.com/youtube/answer/3037019\")?(o=o.slice(1),o.length>0?n(o[0]):n(\"\"),r=!1,i.loadVideoById(a,u)):0===o.length?(r=!1,n(\"\")):l(y,c,o)&&r?(n(o[0]),r=!1,i.loadVideoById(a,u)):!r&&p.current-u>.1&&p.current-u<5&&location.href.includes(\"&list=\")&&null===i.getPlaylistId?.()&&(e=document.querySelector(\"yt-playlist-manager\"),s=e?.getPlaylistData?.(),s&&(e.setPlaylistData?.(s),e.setPlayerPlaybackControlData?.({playlistPanelRenderer:s}))))}c&&p.duration>0&&i.seekTo?.(p.duration)}}else o=t};e(),new MutationObserver((()=>{e()})).observe(document,{childList:!0,subtree:!0})})),window.Map.prototype.has=new Proxy(window.Map.prototype.has,{apply:(e,t,o)=>(\"onSnackbarMessage\"!==o?.[0]||r||s(),Reflect.apply(e,t,o))}),window.Array.prototype.push=new Proxy(window.Array.prototype.push,{apply:(e,t,r)=>{let o=r?.[0];return!o||\"object\"!=typeof o||\"Uint8Array\"!==o.constructor.name||o.buffer?.byteLength!==o.length||105!==o.length&&104!==o.length||(console.log(o),s()),Reflect.apply(e,t,r)}});const i={apply:(e,t,r)=>{const o=r[0];return\"function\"==typeof o&&o.toString().includes(\"onAbnormalityDetected\")&&(r[0]=function(){}),Reflect.apply(e,t,r)}};window.Promise.prototype.then=new Proxy(window.Promise.prototype.then,i)})();$1","sedCount","1","excludes","MutationObserver","condition","/serverContract|js_ld/"],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent*=\"channel\"].context.client[?.clientName==\"WEB\"]+={\"clientScreen\":\"CHANNEL\"}"],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent*=\"lactmilli\"]+={\"params\":\"8AUB\"}"],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent*=\"yahi\"]+={\"params\":\"YAHI\"}"],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent*=\"instream\"].playbackContext[?.contentPlaybackContext]+={\"adPlaybackContext\":{\"adType\":\"AD_TYPE_INSTREAM\"}}"],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent=/channel|lactmilli|instream/].playbackContext.contentPlaybackContext.lactMilliseconds=\"${now}\""],["trusted-edit-inbound-object","JSON.stringify","0","[?.attestationRequest][?.context.client.userAgent=/adunit|channel|lactmilli|instream|inline|yahi|eafg/].playbackContext.contentPlaybackContext.referer=repl({\"regex\":\"(?:#reloadxhr)?$\",\"replacement\":\"#reloadxhr\"})"],["adjust-setTimeout","[native code]","17000","0.001"],["json-prune-fetch-response","adPlacements adSlots playerResponse.adPlacements playerResponse.adSlots [].playerResponse.adPlacements [].playerResponse.adSlots","","propsToMatch","/\\/player(\\?|$)/"],["json-prune-fetch-response","adPlacements adSlots playerResponse.adPlacements playerResponse.adSlots","","propsToMatch","/playlist?"],["json-prune-xhr-response","adPlacements adSlots playerResponse.adPlacements playerResponse.adSlots [].playerResponse.adPlacements [].playerResponse.adSlots","","propsToMatch","/\\/player(?:\\?.+)?$/"],["trusted-replace-fetch-response","\"adSlots\"","\"no_ads\"","/^\\W+$/"],["remove-node-text","script","window,\"fetch\""],["trusted-prevent-dom-bypass","Node.prototype.appendChild","fetch"],["trusted-prevent-dom-bypass","Node.prototype.appendChild","Request"],["trusted-prevent-dom-bypass","Node.prototype.appendChild","JSON.parse"],["trusted-replace-fetch-response","\"adSlots\"","\"no_ads\"","/get_watch?"],["json-prune","playerResponse.adPlacements playerResponse.playerAds playerResponse.adSlots adPlacements playerAds adSlots important"],["json-edit-fetch-response","..itemSectionRenderer.contents.*[?.adSlotRenderer]","propsToMatch","/get_watch"],["nowebrtc"],["abort-on-property-read","_sp_._networkListenerData"],["abort-on-property-write","_sp_"],["abort-on-property-write","yafaIt"],["abort-on-property-read","_sp_.mms.startMsg"],["abort-on-property-write","Fingerprint2"],["abort-on-property-read","stop"],["abort-current-script","decodeURI","decodeURIComponent"],["abort-on-property-read","Date.prototype.toUTCString"],["prevent-window-open"],["set-constant","String.prototype.charAt","trueFunc"],["abort-current-script","$","ltvModal"],["set-constant","luxuretv.config"],["abort-on-property-read","popns"],["abort-current-script","__ADX_URL_U"],["adjust-setInterval","myTimer","1500"],["prevent-addEventListener","load","advertising"],["prevent-addEventListener","click","popMagic"],["abort-current-script","btoa","BOOTLOADER_LOADED"],["remove-node-text","script","/__adblocker|html-load/","excludes","self.__next"],["set-constant","isAdBlocked","false"],["prevent-xhr","/enthusiastgaming|googleoptimize|googletagmanager/"],["abort-current-script","decodeURI","getScriptFromCss"],["prevent-xhr","ad_"],["set-constant","page_params.holiday_promo","true"],["prevent-setInterval","adblockerModal","1000"],["prevent-setTimeout","nextFunction","2000"],["set-constant","CaptchmeState.adb","undefined"],["abort-on-property-read","__eiPb"],["noeval-if","/chp_?ad/"],["prevent-addEventListener","load","2000"],["abort-current-script","Math","='\\x"],["abort-on-property-read","ExoLoader.serve"],["abort-on-property-read","loadTool"],["abort-on-property-read","open"],["abort-on-property-read","document.dispatchEvent"],["abort-current-script","document.querySelectorAll","popMagic"],["abort-on-property-write","adBlockDetected"],["abort-current-script","$","#pageWrapper"],["set-constant","blurred","false"],["adjust-setInterval","time"],["set-constant","sec","0"],["prevent-setTimeout","adFilled","2500"],["abort-on-property-write","decodeURI"],["abort-current-script","JSON.parse","break;case $."],["abort-on-property-write","phtData"],["set-constant","adBlocker","false"],["prevent-setTimeout","innerHTML"],["abort-on-property-read","ExoLoader"],["abort-on-property-read","_pop"],["abort-on-property-read","popit"],["prevent-addEventListener","popstate","noPop"],["prevent-addEventListener","click","native code"],["abort-on-property-read","exoJsPop101"],["prevent-addEventListener","load","onload"],["abort-current-script","document.documentElement","break;case $."],["set-constant","Math.pow","noopFunc"],["abort-current-script","document.createElement","l.parentNode.insertBefore(s"],["prevent-addEventListener","mousedown","!!{});"],["adjust-setTimeout"],["prevent-setTimeout","/$|adBlock/"],["abort-on-property-read","AaDetector"],["set-constant","flashvars.adv_pause_html"],["set-constant","flashvars.adv_start_html"],["abort-on-property-read","ExoLoader.addZone"],["abort-on-property-read","decodeURI"],["abort-current-script","String.fromCharCode","shift"],["set-constant","blockAdBlock","trueFunc"],["set-constant","google_jobrunner","true"],["json-prune","enabled","force_disabled"],["prevent-setTimeout",".call(null)","10"],["set-constant","ov.advertising.tisoomi.loadScript","noopFunc"],["set-constant","initializeslideshow","noopFunc"],["set-constant","adblock","false"],["prevent-addEventListener","load","0x"],["abort-current-script","globalThis","break;case"],["remove-node-text","script","/h=decodeURIComponent|popundersPerIP/"],["set-constant","is_adblocked","false"],["remove-node-text","script","popUnderUrl"],["remove-attr","data-popunder-url"],["abort-current-script","document.createElement","adblock"],["abort-current-script","document.getElementById","block"],["set-constant","chp_adblock_browser","noopFunc"],["prevent-addEventListener","DOMContentLoaded",".clientHeight"],["prevent-setTimeout","ads"],["abort-on-property-read","document.write"],["remove-node-text","script","ads-blocked"],["set-constant","blockAdBlock._options.baitClass","null"],["set-constant","CloudflareApps.installs.Ik7rmQ4t95Qk.options.measureDomain","undefined"],["noeval-if","adsbygoogle"],["remove-node-text","script","/popMagic|pop1stp/"],["abort-current-script","WebAssembly","atob"],["prevent-fetch","/doubleclick|googlesyndication/","length:10","{\"type\":\"cors\"}"],["prevent-xhr","/doubleclick|googlesyndication/"],["abort-current-script","parseInt","break;case $."],["abort-on-property-write","atOptions"],["prevent-addEventListener","","break;case $."],["abort-current-script","Math","break;case $."],["abort-current-script","JSON.parse","Promise"],["remove-node-text","script","/WebAssembly|forceunder/"],["prevent-setInterval","adblock"],["abort-on-property-read","Adcash"],["remove-attr","target","#downloadvideo"],["adjust-setTimeout","counter"],["abort-on-property-write","_pop"],["prevent-addEventListener","","_blank"],["set-cookie","inter","1","","reload","1"],["noeval"],["abort-on-property-read","exoNoExternalUI38djdkjDDJsio96"],["prevent-addEventListener","","popMagic"],["prevent-fetch","popunder"],["abort-current-script","EventTarget.prototype.addEventListener","delete window"],["remove-attr","onclick","button#download","complete"],["prevent-window-open","_blank"],["set-constant","detectSandbox","noopFunc"],["prevent-addEventListener","DOMContentLoaded","Promise"],["prevent-setTimeout","push"],["remove-node-text","script","/popns|\\)\\.substr/"],["abort-current-script","document.createElement","appendTo:"],["prevent-xhr","googlesyndication"],["set-constant","globalThis","null"],["abort-current-script","WebAssembly","Promise"],["noeval-if","ads"],["abort-on-property-read","Aloader.serve"],["prevent-setTimeout","innerText","2000"],["set-constant","flashvars.mlogo"],["prevent-addEventListener","getexoloader"],["remove-node-text","script","/shown_at|WebAssembly/"],["prevent-setTimeout","offsetWidth","2000"],["trusted-replace-node-text","script","adv_","no_adv_","condition","kt_player.swf","sedCount","10"],["set-constant","flashvars.popunder_url"],["abort-on-property-read","LieDetector"],["abort-on-property-read","afScript"],["remove-node-text","script",";}}};break;case $."],["remove-node-text","script","{delete window["],["remove-node-text","script","popundersPerIP"],["prevent-setInterval","visibility","1000"],["abort-on-property-read","app_vars.force_disable_adblock"],["remove-node-text","script","FingerprintJS"],["abort-current-script","addEventListener","HTMLAllCollection"],["prevent-setInterval","/0x|sandCheck/"],["abort-on-property-read","__Y"],["remove-node-text","script","adserverDomain"],["remove-node-text","script","popunder"],["abort-current-script","Math","zfgloaded"],["abort-on-property-read","mm"],["abort-current-script","String.fromCharCode","/btoa|break/"],["abort-current-script","navigator","break;case $."],["prevent-xhr","/vast.php?"],["prevent-xhr","/click\\.com|preroll|native_render\\.js|acscdn/","length:10001"],["prevent-xhr","162.252.214.4","true"],["prevent-xhr","c.adsco.re"],["prevent-xhr","adsco.re:2087"],["remove-node-text","script","/h=decodeURIComponent|popundersPerIP|dtnoppu|adserverDomain/"],["adjust-setInterval"],["abort-current-script","Promise","JSON.parse"],["prevent-setTimeout","/[a-z]\\(!0\\)/","800"],["prevent-addEventListener","click","popunder"],["prevent-fetch","="],["set-constant","initializeNtvxSheet","noopFunc"],["abort-current-script","adcashMacros"],["prevent-setTimeout","afterOpen"],["set-constant","PlayerConfig.config.CustomAdSetting","[]"],["set-constant","univresalP","noopFunc"],["abort-on-property-read","console.clear"],["adjust-setInterval","timer"],["prevent-window-open","!/prcf.fiyar|themes|pixsense|.jpg/"],["abort-current-script","document.addEventListener","google_ad_client"],["prevent-setTimeout","displayMessage","2000"],["prevent-setTimeout","nextFunction"],["set-constant","adsClasses","undefined"],["set-constant","gsecs","0"],["remove-node-text","script","ai_adb"],["abort-on-property-read","antiAdBlockerHandler"],["prevent-addEventListener","DOMContentLoaded","history.go"],["remove-node-text","style","min-height:300px"],["prevent-addEventListener","load","abDetectorPro"],["prevent-fetch","/googlesyndication|doubleclick/","length:10","{\"type\": \"cors\"}"],["prevent-xhr","/googlesyndication|doubleclick/","length:10"],["remove-node-text","script","/\"v4ac1eiZr0\"|\"\"\\)\\.split\\(\",\"\\)\\[4\\]|(\\.localStorage\\)|JSON\\.parse\\(\\w)\\.getItem\\(\"|[\"']_aQS0\\w+[\"']|decodeURI\\(decodeURI\\(\"|<a href=\"https:\\/\\/getad%|\"cmp\\.updated\"/"],["remove-node-text","script","adblockerDisabled","excludes",",\\\""],["prevent-addEventListener","error",".indexOf"],["prevent-addEventListener","load",".indexOf"],["prevent-setTimeout",".indexOf"],["abort-current-script","String.prototype.match","__adblocker","/^data:/"],["remove-node-text","script","/admiral|\\[\\]\\)\\.push\\(arguments\\)/","excludes",",\\\""],["remove-node-text","script","[]).push(arguments)","excludes",",\\\""],["remove-node-text","script","AdBlockEnabled"],["remove-node-text","script","adblockerDisabled"],["remove-node-text","script","admiral","excludes",",\\\""],["set-constant","gnt.x.uam","undefined","runAt","interactive"],["abort-current-script","admiral"],["json-edit","..props.children.*[?.key==\"admiral-script\"]"],["trusted-json-edit","..props.config.ad.enabled=false"],["trusted-json-edit","..Admiral.isEnabled=false"],["trusted-json-edit","..admiral=false"],["trusted-json-edit","..AdShield.isEnabled=false"],["remove-attr","onerror","script[id][onerror]","asap","quitAfter","10"],["remove-node-text","script","/:window,|\\)\\.join\\(String\\.fromCharCode/"],["remove-node-text","script","/html-load\\.com|:\\[?window,/"],["set-constant","adLight","true"],["trusted-replace-node-text","script","window.dataLayer =","/*start*/(function(){let link=document.createElement(\"link\");link.rel=\"stylesheet\";link.href=\"/wp-content/themes/hts_v2/style.css\";document.head.appendChild(link)})();document.currentScript.textContent=document.currentScript.textContent.replace(/\\/\\*start\\*\\/(.*)\\/\\*end\\*\\//g,\"\");/*end*/window.dataLayer ="],["trusted-replace-node-text","script","window.dataLayer =","/*start*/(function(){let link=document.createElement(\"link\");link.rel=\"stylesheet\";link.href=\"/_css/css.css\";document.head.appendChild(link)})();document.currentScript.textContent=document.currentScript.textContent.replace(/\\/\\*start\\*\\/(.*)\\/\\*end\\*\\//g,\"\");/*end*/window.dataLayer ="],["remove-node-text","script","html-load.com"],["noeval-if","/content-loader\\.com|css-load\\.com|html-load\\.com/"],["remove-node-text","script","KCgpPT57bGV0IGU"],["remove-node-text","script",").join(String.fromCharCode"],["remove-node-text","script","adrecover.com"],["remove-node-text","script","/\\(async\\s*\\(\\)\\s*=>\\s*\\{\\s*try\\s*\\{\\s*(const|var)/"],["set-constant","Object.prototype.enableInterstitial","false"],["remove-node-text","script","await eval"],["remove-node-text","script","() => eval"],["remove-node-text","script",",window]"],["remove-node-text","script","/__adblocker|html-load/"],["remove-node-text","script","\"data-sdk\""],["prevent-setTimeout","[native code]","500"],["set-constant","Object.prototype._adsDisabled","true"],["remove-node-text","script","/\"__adblocker\"|\"data-sdk\"/"],["prevent-xhr","prebid"],["remove-cookie","PageCount"],["set-local-storage-item","PageCount","$remove$"],["trusted-set-constant","asc","json:{\"cmd\": [null], \"que\": [null], \"wrapperVersion\": \"6.19.0\", \"refreshQue\": {\"waitDelay\": 3000, \"que\": []}, \"isLoaded\": true, \"bidderSettings\": {}, \"libLoaded\": true, \"version\": \"v9.20.0\", \"installedModules\": [], \"adUnits\": [], \"aliasRegistry\": {}, \"medianetGlobals\": {}}"],["trusted-set-constant","google_tag_manager","json:{ \"G-Z8CH48V654\": { \"_spx\": false, \"bootstrap\": 1704067200000, \"dataLayer\": { \"name\": \"dataLayer\" } }, \"SANDBOXED_JS_SEMAPHORE\": 0, \"dataLayer\": { \"gtmDom\": true, \"gtmLoad\": true, \"subscribers\": 1 }, \"sequence\": 1 }"],["remove-node-text","script","antiAdBlockerHandler"],["set-constant","__INITIAL_STATE__.config.theme.ads.isAdBlockerEnabled","false"],["adjust-setInterval","generalTimeLeft","*","0.001"],["set-constant","Adv_ab","false"],["remove-node-text","script","/adblock|popunder|openedPop|WebAssembly|wpadmngr/"],["abort-on-property-read","__aaZoneid"],["abort-on-property-write","DoodPop"],["set-constant","console.clear","undefined"],["prevent-setTimeout","window.open"],["trusted-replace-node-text","script","/openNewTab\\(\".*?\"\\)/g","null"],["abort-current-script","document.write","unescape"],["remove-node-text","script","/detect/i"],["remove-node-text","script","/detectAdblock|WebAssembly|pop1stp|popMagic/i"],["remove-node-text","script","pingUrl"],["prevent-addEventListener","/click|mouse/","/scoreUrl|pingUrl/"],["remove-node-text","script",":visible"],["prevent-setTimeout","checkAdblockUser"],["remove-node-text","script","\"+\"","excludes","/self\\.__next|recaptcha|document|window|const|var|let/"],["abort-current-script","RegExp.prototype.exec.constructor","\"+\""],["abort-current-script","Function.prototype.constructor","\"+\""],["set-constant","HTMLElement.prototype.click.call","noopFunc"],["set-constant","HTMLElement.prototype.click.apply","noopFunc"],["set-constant","Element.prototype.closest","falseFunc"],["prevent-addEventListener","click","/document.createElement|window.open/"],["prevent-window-open",".cfd"],["remove-node-text","script","/\"\\+\"g|\"\\+\"'a|self\\.__next.*?,typeof document|self\\.__next&&|\\|\\|self\\.__next,\\(|\\(\"\\+\"t|'\\+'F|0\\|\\|window|\\}\\)\\(\\),typeof|'\\+'s/g","excludes","/^self\\.__next_f\\.push/"],["trusted-replace-node-text","script","/manageAds\\(video_urls\\[activeItem\\], video_seconds\\[activeItem\\], ad_urls\\[activeItem],true\\);/","playVideo();","condition","playAdd"],["trusted-replace-node-text","script","prerollEnabled:true","prerollEnabled:false"],["remove-node-text","script","shopeeLinks"],["prevent-addEventListener","click","shopeeLinks"],["prevent-setTimeout","google_jobrunner"],["abort-on-property-read","adBlockDetected"],["adjust-setInterval","counter","*"],["set-constant","uBlockOriginDetected","false"],["prevent-fetch","doubleclick"],["abort-current-script","$","_ads"],["abort-current-script","Math","adthrive"],["set-constant","btoa","null"],["set-constant","openWindow","noopFunc"],["abort-on-property-read","wpsite_clickable_data"],["abort-on-property-read","b2a"],["prevent-setTimeout","showModal"],["abort-current-script","eval","replace"],["remove-node-text","script","var Data"],["prevent-addEventListener","DOMContentLoaded","/atob|overlay/"],["abort-on-property-read","doSecondPop"],["remove-node-text","script","parentNode.removeChild"],["abort-current-script","atob","parentNode.removeChild"],["remove-node-text","script","globalThis.innerWidth"],["prevent-setTimeout","bADBlock"],["abort-on-property-read","adBlockerDetected"],["prevent-setTimeout","/out.php"],["abort-current-script","pop_init"],["abort-current-script","document.createElement","script"],["prevent-addEventListener","","adb"],["remove-node-text","style","text-decoration"],["abort-on-property-write","ospen"],["set-constant","flashvars.adv_pre_vast"],["abort-on-property-write","__spotSettings"],["abort-on-property-write","adcashMacros"],["prevent-setTimeout","brave_load_popup"],["adjust-setInterval","timer.remove"],["abort-current-script","addEventListener","nextFunction"],["abort-current-script","document.addEventListener","offsetHeight"],["set-constant","console.clear","noopFunc"],["prevent-setTimeout","debugger"],["remove-attr","href",".button[href^=\"javascript\"]"],["abort-current-script","Math.floor","ExoLoader"],["prevent-setTimeout","google_ad"],["adjust-setInterval","timercounter"],["prevent-fetch","method:HEAD"],["remove-node-text","script","/adb/i"],["abort-current-script","document.getElementById","stop"],["prevent-xhr","/analytics|livestats/"],["remove-attr","onclick"],["abort-current-script","jQuery","No"],["prevent-setTimeout","ai_"],["set-cookie","popunder","1"],["adjust-setTimeout","remaining","1000","0.001"],["remove-node-text","script","deblocker"],["abort-current-script","$","adsBlocked"],["prevent-setTimeout","/show|document\\.createElement/"],["prevent-addEventListener","DOMContentLoaded","atob"],["set-constant","popped","true"],["trusted-replace-node-text","script","const PerformanceTracker","aiptag.cmd.display.push=a=>{},aiptag.cmd.player.push=a=>a(),aipPlayer=class{constructor(a){this.o=a}startPreRoll(a,s){this.o.AIP_REWARDEDCOMPLETE()}},aipAPItag={sdkBlocked:!1};const PerformanceTracker"],["set-constant","passthetest","true"],["prevent-setTimeout","adblock"],["abort-on-property-read","BetterJsPop"],["prevent-window-open","","10"],["set-constant","distance","0"],["remove-attr","disabled","button#getlink"],["remove-attr","disabled","button#gotolink"],["prevent-fetch","googlesyndication"],["prevent-setTimeout","show"],["set-constant","init_welcome_ad","noopFunc"],["set-constant","detectadsbocker","false"],["trusted-replace-fetch-response","/<VAST version.+VAST>/","<VAST version=\\\"4.0\\\"></VAST>","deezer.getAudiobreak"],["prevent-setTimeout","Ads"],["set-constant","smartLoaded","true"],["trusted-json-edit","..ads_audio=false"],["prevent-setTimeout","sadbl"],["abort-on-property-read","adsBlocked"],["abort-on-property-write","__aaZoneid"],["prevent-setTimeout","data?"],["prevent-addEventListener","load","popunder"],["abort-on-property-write","DOMAssistant"],["abort-on-property-write","rotator"],["remove-node-text","script","popUnder"],["prevent-setTimeout","fetch"],["remove-node-text","script","leave_recommend"],["set-constant","empire.pop","undefined"],["set-constant","empire.direct","undefined"],["set-constant","empire.directHideAds","undefined"],["trusted-replace-node-text","script","/data: \\[.*\\],/","data: [],","condition","ads_num"],["set-constant","document.hidden","true"],["adjust-setTimeout","(!1)","*"],["prevent-xhr","pagead2.googlesyndication.com"],["set-constant","empire.mediaData.advisorMovie","1"],["set-constant","empire.mediaData.advisorSerie","1"],["set-constant","pandaAdviewValidate","true"],["abort-on-property-read","eazy_ad_unblocker_dialog_opener"],["remove-node-text","script","open"],["remove-node-text","script","wwads"],["remove-node-text","script","onerror"],["trusted-replace-xhr-response","\"ads_disabled\":false","\"ads_disabled\":true","payments"],["remove-node-text","script","googlesyndication"],["prevent-setInterval","daadb"],["abort-current-script","addEventListener","smartpop"],["set-constant","hasAdBlocker","false"],["prevent-setTimeout","contrformpub"],["set-cookie","ts_popunder","true","","reload","1"],["trusted-replace-node-text","script","popunder","","condition","popunder","stay","1"],["prevent-addEventListener","click","[native code]","elements",".main-wrap"],["abort-current-script","document.createElement","window.ts"],["remove-node-text","script","bannerRight"],["remove-cookie","video_view_count"],["prevent-setTimeout","trigger","0"],["abort-on-property-read","__brn_private_mode"],["abort-on-property-write","smrtSB"],["abort-current-script","atob","decodeURIComponent"],["set-constant","notifyMe","noopFunc"],["abort-current-script","$","alertmsg"],["prevent-addEventListener","click","location.href"],["abort-current-script","Math","/window\\['(?:\\\\x[0-9a-f]{2}){2}/"],["prevent-setTimeout","readyWait"],["prevent-fetch","google-analytics"],["remove-node-text","script","antiAdBlock"],["set-session-storage-item","realm.Oidc.3pc","$remove$"],["abort-current-script","$","btoa"],["abort-on-property-write","probeScript"],["set-constant","GEMG.GPT.Interstitial","noopFunc"],["abort-on-property-write","Adcash"],["adjust-setInterval","counter"],["prevent-window-open","shutterstock.com"],["abort-current-script","Math","localStorage['\\x"],["set-constant","Object.prototype.adUrl"],["trusted-replace-node-text","script","playVideo();","loadEmbedVideo();"],["prevent-fetch","imasdk"],["prevent-window-open","/aff|jump/"],["set-constant","Object.prototype.ads.nopreroll_","true"],["abort-on-property-read","checkAdsStatus"],["trusted-set-attr","ins.adsbygoogle","data-ad-status","unfill-optimize"],["prevent-addEventListener","click","_blank"],["trusted-replace-node-text","script","vid.vast","//vid.vast"],["prevent-addEventListener","load","popMagic"],["remove-node-text","script","/key in document|popundersPerIP|var FingerprintJS|adserverDomain|globalThis;break;case|ai_adb|adContainer/"],["abort-on-property-read","aclib"],["trusted-prevent-fetch","imasdk","ad.doubleclick.net bid.g.doubleclick.net ggpht.com google.co.uk google.com googleads.g.doubleclick.net googleads4.g.doubleclick.net googleadservices.com googlesyndication.com googleusercontent.com gstatic.com gvt1.com prod.google.com pubads.g.doubleclick.net s0.2mdn.net static.doubleclick.net surveys.g.doubleclick.net youtube.com ytimg.com"],["abort-current-script","document.createElement","jsc.mgid.com"],["set-constant","isAdBlockActive","false"],["remove-cookie","PHPSESSID"],["remove-node-text","script","/google_jobrunner|AdBlock|pubadx|embed\\.html/i"],["set-constant","flashvars.mlogo_link"],["set-constant","flashvars.logo_text"],["prevent-setTimeout","/adbl/i"],["trusted-replace-node-text","script","/vastSource.*?,/","vastSource:'',"],["trusted-replace-node-text","script","/window.location.href[^?]+this[^?]+;/"],["prevent-addEventListener","click","window.open"],["remove-node-text","script","adbl"],["prevent-addEventListener","click","popupInterval"],["trusted-replace-node-text","script","isVipUser = false","isVipUser = true"],["prevent-window-open","/go/out"],["prevent-fetch","adsbygoogle"],["trusted-replace-node-text","script",",availableAds:[",",availableAds:[],noAds:[","sedCount","1"],["set-constant","dclm_ajax_var.disclaimer_redirect_url"],["trusted-replace-node-text","script","function OptanonWrapper() {}","/*start*/(()=>{const o={apply:(o,t,e)=>(\"ads\"===e[0]&&\"object\"==typeof t&&null!==t&&(t.ads=()=>{}),Reflect.apply(o,t,e))};window.Object.prototype.hasOwnProperty=new Proxy(window.Object.prototype.hasOwnProperty,o)})();document.currentScript.textContent=document.currentScript.textContent.replace(/\\/\\*start\\*\\/(.*)\\/\\*end\\*\\//g,\"\");/*end*/function OptanonWrapper() {}"],["remove-node-text","script","/adblock/i"],["prevent-addEventListener","click","href"],["prevent-window-open","/pop?"],["prevent-setTimeout","doubleclick"],["set-constant","prads","[]"],["abort-current-script","onload"],["prevent-addEventListener","","Pop"],["abort-on-property-read","_wm"],["remove-node-text","script","/^/gms","excludes","__INITIAL_STATE__"],["trusted-replace-node-text","script","/$/gms","(()=>{const url=__INITIAL_STATE__.page.clickthroughPageData.url;if(url){window.location.href=url}})();","condition","__INITIAL_STATE__"],["remove-node-text","script","popup"],["prevent-fetch","ads_"],["prevent-xhr","ads_"],["remove-node-text","script",".onerror"],["remove-node-text","script","/_0x|'innerHTML'/"],["trusted-json-edit","[?.type==\"ads\"].visibility.status=\"hidden\""],["trusted-json-edit","..suppress_ads=true"],["json-prune","messages.*.ads messages.*.renderedAdsHtml"],["json-prune-xhr-response","data.initPlaybackSession.adScenarios data.initPlaybackSession.adExperience.adExperienceTypes","","propsToMatch","/graphql"],["trusted-json-edit-xhr-response",".data.initPlaybackSession.adExperience.adsEnabled=false","propsToMatch","/graphql"],["prevent-window-open","!youtu"],["trusted-set-local-storage-item","_ad_last","$now$"],["remove-cookie","__adblocker"],["trusted-json-edit",".vast=0"],["trusted-json-edit",".prerolls=0"],["set-constant","timeSec","0"],["adjust-setTimeout","getlink","*","0.001"],["noeval-if","replace"],["set-constant","Object.prototype.isAllAdClose","true"],["trusted-replace-node-text","script","/func.*justDetect.*warnarea.*?;/gm"],["remove-node-text","script","getComputedStyle(el"],["trusted-replace-node-text","script","/\\d{4}/gms","10"],["prevent-setTimeout","/window\\.location\\.href|n/","8000"],["set-constant","showadas","true"],["abort-on-property-read","SMart1"],["noeval-if","chp_ad"],["prevent-addEventListener","DOMContentLoaded","document.documentElement.lang.toLowerCase"],["adjust-setInterval","countdown","1000","0.001"],["trusted-replace-node-text","script","/#Intent.*?end/"],["trusted-replace-node-text","script","intent","https"],["prevent-setTimeout","location.href"],["trusted-replace-node-text","script","/(['\"])https?:\\/\\/[^'\"]+\\1/","$1$1","condition","/addEventListener|adUrl|open/"],["trusted-replace-node-text","script","_blank","_self","condition","href"],["trusted-replace-node-text","script","e.preventDefault();"],["prevent-fetch","/doubleclick|googlesyndication/"],["trusted-replace-node-text","script","/10;|6;/","1;","condition","progress"],["set-local-storage-item","BLOCKED_FLAG_KEY","$remove$"],["json-prune","html"],["prevent-fetch","method:POST"],["remove-node-text","script","/adsby|console|data-ad|modal|requestAnimationFrame|srcdoc|tagName|text\\/html|userAgent|visibility|zucks|^[\\S\\s]{3200,}$|\\\\u00|ブロッカ/"],["abort-on-property-read","Keen"],["set-constant","nads.createAd","trueFunc"],["set-constant","ga","noopFunc"],["set-constant","newPageViewSpeedtest","noopFunc"],["adjust-setTimeout","/TDELAY|EzoIvent/","*","0.001"],["prevent-fetch","/piwik-"],["set-constant","ttd_dom_ready","noopFunc"],["abort-current-script","Math.random"]];
const HOSTS = {"tv.youtube.com":[0,1,2,3,4,5,6],"www.youtube.com":[7,8,9,10,1,2,3,4,5,6,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],"m.youtube.com":[1,2,3,4,28,5,6,29],"music.youtube.com":[1,2,3,4,28,5,6],"ddlvalley.me":[30],"fluvore.com":[30],"livingathome.de":[31],"mymotherlode.com":[32],"eurogamer.net":[33,34],"eurogamer.de":[34],"eurogamer.es":[34],"eurogamer.it":[34],"eurogamer.pt":[34],"macserial.com":[35],"grubstreet.com":[36],"biqle.*":[37,38],"porn.com":[39,40],"luxuretv.com":[41,42,43],"feet9.com":[44],"freepdf-books.com":[45],"mimaletadepeliculas.*":[46],"mejortorrent.*":[30,47],"webdesigndev.com":[39],"mp3guild.*":[35],"tasteandtellblog.com":[48,49],"thesimsresource.com":[50,51],"pornfay.*":[39],"ddlvalley.*":[52,35],"frkn64modding.com":[53],"vidd.se":[54],"hulkshare.com":[55],"mp3fy.com":[56],"e-monsite.com":[57],"culture-informatique.net":[58,59],"disneyfashionista.com":[58],"visionias.net":[60],"tribunnews.com":[61],"prostoporno.*":[62],"babesxworld.com":[63,64,65,66],"ridvanmau.com":[67],"printedelectronicsnow.com":[68],"aiailah.com":[67],"dicariguru.com":[67],"indofirmware.site":[67],"icutlink.com":[64,69,70,71],"pandafreegames.*":[72],"multporn.net":[65,66],"myegy.*":[73,74],"hotdreamsxxx.com":[75],"veedi.com":[76],"paradiseislandcam.com":[77],"portnassauwebcam.com":[77],"gaypornwave.com":[78,79],"animepornfilm.com":[80,81],"originalindianporn.com":[80,81],"teenextrem.com":[80,81],"totalmaturefuck.com":[80,81],"xxxanimefuck.com":[80,81],"xxxmovies.*":[80,81],"mlbstream.tv":[37],"celeb.gate.cc":[82],"cocoporn.net":[37,83],"links-url.*":[84],"hdfriday.*":[64,85],"audiofanzine.com":[86],"teleriumtv.*":[39],"hdfull.*":[87,88,89],"dictionnaire-medical.net":[56],"proplanta.de":[90],"watchgameofthrones.*":[91],"bravoerotica.com":[62],"bravoerotica.net":[92,93],"collegehdsex.com":[65],"nakedgirlsroom.com":[94],"kinoz.*":[30,91,95],"tamilyogi.*":[96],"gocards.com":[97],"golobos.com":[97],"gozags.com":[97],"hamptonpirates.com":[97],"nuhuskies.com":[97],"themw.com":[97],"gomcpanthers.com":[97],"quinnipiacbobcats.com":[97],"gseagles.com":[97],"kstatefootball.net":[97],"kstatefootball.org":[97],"wsucougars.com":[97],"karanapk.com":[98],"kicker.de":[99,100,101,102],"cinemaxxl.de":[103],"cracking-dz.com":[104],"upstream.to":[64,105,106],"jacquieetmichel.net":[107,108,109],"almezoryae.com":[110],"isminiunuttum.com":[111],"porncomics.me":[64],"about-drinks.com":[100],"ariva.de":[100],"fehmarn24.de":[100],"gamepro.de":[100],"musiker-board.de":[100],"notebookchat.com":[100],"peiner-nachrichten.de":[100],"readmore.de":[100],"safelist.eu":[100],"sat1gold.de":[100],"sn.at":[100],"unicum.de":[100],"androidadult.com":[106,59,112,113,114,115,116],"animeblkom.net":[106,117,118],"bellezashot.com":[106,87,59,119,120],"bhaai.*":[106],"doods.cam":[106],"dsvplay.com":[106,66,121,39],"gaypornhot.com":[106,66,122,123],"gledajcrtace.xyz":[106],"gocast2.com":[106,85],"hoodsite.com":[106],"hqcelebcorner.net":[106],"linkebr.com":[106],"masahub.com":[106],"masahub.net":[106],"messitv.net":[106,124,125],"mlbstream.*":[106,74,124,126,127],"nlegs.com":[106],"stream25.xyz":[106],"strtape.*":[106,128,129,130,39,131,132,133],"swatchseries.*":[106,85],"tokusatsuindo.com":[106],"turbovid.me":[106],"vidorg.net":[106],"vstorrent.org":[106],"watchfamilyguyonline.com":[106],"wpdeployit.com":[106],"xxxdominicana.com":[106],"canna.to":[134],"amazon-love.com":[66],"arabxforum.com":[66],"bcmanga.com":[66],"blackchubbymovies.com":[66],"cat3movie.org":[66,121],"czechsex.net":[66],"dikgames.com":[66],"fatwhitebutt.com":[66,39,135],"femjoybabes.com":[66],"hentai.tv":[66,136],"ibecamethewifeofthemalelead.com":[66],"imgflare.com":[66],"javbee.vip":[66],"javgrab.com":[66],"javhd.*":[66,87,121],"javpool.com":[66],"jotea.cl":[66],"kaoskrew.org":[66],"mainporno.com":[66],"nudismteens.com":[66,137,138],"porn00.org":[66,87,39],"porncomics.*":[66],"pornmoms.org":[66],"sexpuss.org":[66],"tubexo.tv":[66],"waploaded.com":[66,124],"webtoonscan.com":[66],"xsportshd.com":[66],"givemeaporn.com":[139],"camarchive.tv":[47,140],"ansuko.net":[87],"javdoe.sh":[87,121],"mangaraw18.net":[87],"poapan.xyz":[87,121,59],"pornosubtitula2.com":[87,59],"rebahin.pw":[87],"safefileku.com":[87,105,141,142,143],"streamup.ws":[87,141,144,145,146],"letsporn.com":[147],"mitaku.net":[148,149,150,151,152],"massagefreetube.com":[137,153],"xxxblowjob.pro":[137,153],"xxxtubegain.com":[137,153],"whitexxxtube.com":[137,153],"pornuploaded.net":[65],"bobs-tube.com":[65,154,155],"sexiestpicture.com":[95,39],"hentaihere.com":[156,157],"hentai-moon.com":[158,159,160],"fastream.to":[161,162],"11xmovies.*":[163,85,141,164],"3kmovies.*":[163,85],"aliezstream.pro":[163,85,165],"crazyblog.in":[163,127,166,167,39,69],"filmeserialeonline.org":[163,85],"flexyhit.com":[163,126],"mp4moviez.*":[163,39],"playertv.net":[163],"tamilarasan.*":[163,124],"tnmusic.in":[163],"vidsrc.*":[163,74,85,141,168,169,170,39,171,91,131,172],"watchdoctorwhoonline.com":[163,124],"watchomovies.*":[163,124,85,173],"3sk.*":[174],"biqle.com":[174],"exyi.net":[174],"buffstream.*":[74,175],"comandotorrenthd.org":[74],"fulltube.*":[74],"losmovies.*":[74],"mettablog.com":[74],"pelisstar.com":[74],"123movies-official.net":[124],"anime4up.*":[124,39],"gameslay.net":[124],"katlinks.*":[124],"moviefreak.*":[124],"okamimiost.com":[124],"pelismarthd.com":[124],"redowlanalytics.com":[124],"roms-hub.com":[124],"0gomovies.*":[126],"2madrasdub.*":[126],"animeonlinefree.org":[126],"brmovies.*":[126],"cima4u.*":[126],"dopebox.to":[126,169],"gocast123.me":[126],"gooplay.net":[126],"mangasite.org":[126,64],"pksmovies.*":[126],"bollyshare.*":[127],"comandotorrentshds.org":[127],"youtubeai.com":[127],"zplayer.live":[127],"flvto.biz":[176],"exee.app":[105,85],"hdmovies2.org":[177],"5moviess.com":[85],"9anime.pe":[85],"doods.pro":[85],"reddit-soccerstreams.com":[85],"soap2day-online.com":[85],"temp.modpro.co":[85],"1mov.lol":[141],"9anime.vip":[141],"alphatron.tv":[141],"animenexus.in":[141,143],"doods.to":[141,39,178,179,180,181,182],"m1xdrop.*":[141,183,39],"messitv.org":[141],"mh.baxoi.buzz":[141,59],"streamingcommunityz.*":[141],"streamingunity.to":[141],"telepisodes.org":[141,184],"tous-sports.ru":[141,131],"veplay.top":[141],"fojik.*":[164],"egydead.*":[185],"18comic-gquu.vip":[121],"hentaipaw.com":[121,186],"javpas.com":[121],"novelcrow.com":[121],"player4me.online":[121,187],"turbovid.*":[121],"flixrave.me":[172,188],"ntvs.cx":[172,189,39],"torrentdownloads.*":[169,30,190],"vembed.*":[191,39,192],"torrentkitty.one":[193],"imgmffmv.sbs":[194,195,196],"pixdfdjkkr.shop":[194,195,196],"imgjmgfgm.shop":[194,195,196],"cintateknologi.com":[197],"gemini-horoscopes.com":[198],"krebs-horoskop.com":[198],"adnan-tech.com":[59],"altselection.com":[59],"audiotrip.org":[59],"bdsomadhan.com":[59],"bidersnotu.com":[59],"canzoni-per-bambini.it":[59],"clockskin.us":[59],"coin-profits.xyz":[59,199],"daij1n.info":[59],"destinationsjourney.com":[59],"detikbangka.com":[59],"dobletecno.com":[59],"drublood.com":[59],"easytodoit.com":[59],"electricalstudent.com":[59],"esportsmonk.com":[59],"fcportables.com":[59,200,201,202],"foodiesjoy.com":[59],"gamerxyt.com":[59,203,204],"glo-n.online":[59],"globelempire.com":[59],"happy-otalife.com":[59],"hdhub4one.pics":[59],"hojii.net":[59],"infocycles.com":[59],"juventusfc.hu":[59],"kali.wiki":[59],"kenkou-maintenance.com":[59],"kgs-invest.com":[59],"kotanopan.com":[59],"learnmany.in":[59],"lgcnews.com":[59],"liddread.com":[59,205],"linuxexplain.com":[59],"mhscans.com":[59],"modele-facture.com":[59],"motofan-r.com":[59],"negative.tboys.ro":[59],"nhvnovels.com":[59],"pc-guru.it":[59],"reeell.com":[59],"the-mystery.org":[59],"thewambugu.com":[59],"underground.tboys.ro":[59],"utaitebu.com":[59],"virabux.com":[59],"vpzserver.com":[59],"weebee.me":[59],"wikitechy.com":[59],"writeprofit.org":[59],"xvipp.com":[59],"yakisurume.com":[59],"gendatabase.com":[206,149],"inmatefindcalifornia.com":[206,149],"readingpage.fun":[207,208],"allaboutthetea.com":[209],"funtasticlife.com":[209],"intouchweekly.com":[209],"lifeinleggings.com":[209],"techcrunch.com":[209,210,211,212,213],"thenerdstash.com":[209,49,214],"5newsonline.com":[215],"8newsnow.com":[215],"fox2now.com":[215],"fox51.com":[215],"fox56news.com":[215],"kcentv.com":[215],"krqe.com":[215],"ktsm.com":[215],"ibelieve.com":[216,217],"liveoutdoors.com":[210],"momtastic.com":[210],"news8000.com":[210],"queerty.com":[218],"stronakuchni.pl":[219],"buckscountycouriertimes.com":[220],"caller.com":[220],"cheboygannews.com":[220],"portclintonnewsherald.com":[220],"starcourier.com":[220],"zdnet.com":[221],"mensfitness.com":[222,223,224,225,226],"surfer.com":[222,223,224,225,226],"mavericktruckclub.com":[227,228],"golfmonthly.com":[227,229],"guitarplayer.com":[227,229],"homesandgardens.com":[227,229],"thenational.scot":[230],"hometownstation.com":[231],"sportalkorea.com":[232,233],"viva100.com":[234,235],"sms24.me":[227,236],"jutarnji.hr":[237],"hollywoodlife.com":[238,239],"dictionnaire.lerobert.com":[240,233],"motorradfrage.net":[240,233],"reisefrage.net":[240,233],"buchstaben.com":[241,233],"skinmc.net":[242],"aucfree.com":[233],"chef-in-training.com":[233,49],"convertcase.net":[233],"driveteslacanada.ca":[233,49],"j7p.jp":[233],"kyoteibiyori.com":[233],"modhub.us":[233],"motor-fan.jp":[233],"soxprospects.com":[233],"twn.hu":[233],"vimm.net":[233],"aqua2ch.net":[233],"girlsreport.net":[233],"imas-cg.net":[233],"jisaka.com":[233],"kidan-m.com":[233],"onecall2ch.com":[233],"loveinmyoven.com":[233,243],"plainchicken.com":[233,49],"12thmanrising.com":[244,245],"catcrave.com":[244,245],"gigemgazette.com":[244,245],"southsideshowdown.com":[244,245],"thejetpress.com":[244,245],"bristolworld.com":[240],"100daysofrealfood.com":[243],"10fragrances.com":[243],"1500days.com":[243],"16powers.com":[243],"31daily.com":[243],"368chickens.com":[243],"40plusstyle.com":[243],"4pics1-word.com":[243],"abnormalreturns.com":[49],"adayinthekitchen.com":[49],"adishofdailylife.com":[49],"aeclectic.net":[49],"aglassofbovino.com":[49],"alandacraft.com":[49],"allcakeprices.com":[49],"allwritealright.com":[49],"aquariumadvice.com":[49],"aquietrefuge.com":[49],"arabahjoy.com":[49],"arrestyourdebt.com":[49],"artsy-traveler.com":[49],"asweetpeachef.com":[49],"authority.pub":[49],"bahaiforums.com":[49],"bakingmehungry.com":[49],"believeintherun.com":[49],"bestchristmasdesserts.com":[49],"bestiefy.com":[49],"bramblewinecottage.com":[49],"brasshero.com":[49],"braveryandbelonging.com":[49],"bromabakery.com":[49],"buildingelements.com":[49],"businesschronicler.com":[49],"butfirstwebrunch.com":[49],"buythiscookthat.com":[49],"campgrilleat.com":[49],"cat-world.com":[49],"chambanamoms.com":[49],"charactercounter.com":[49],"cheneetoday.com":[49],"chordsworld.com":[49],"citefast.com":[49],"classicnerd.com":[49],"codex.gg":[49],"codycrosssolutions.com":[49],"coffeelevels.com":[49],"comicyears.com":[49],"cookingclassy.com":[49],"cookingforpeanuts.com":[49],"cookinwithmima.com":[49],"coopcancook.com":[49],"cosascaseras.com":[49],"cosplayadvice.com":[49],"countrydiaries.com":[49],"crazytogether.com":[49],"crochettoplay.com":[49],"cruisersforum.com":[49],"cubesnjuliennes.com":[49],"curlygirlkitchen.com":[49],"cyndispivey.com":[49],"dailywritingtips.com":[49],"damndelicious.net":[49,58,246],"delightfuladventures.com":[49],"discoveringmontana.com":[49],"dishbydish.net":[49],"divaliciousrecipes.com":[49],"diy-forums.com":[49],"easycheesyvegetarian.com":[243],"easydrawingguides.com":[243],"eatsomethingvegan.com":[243],"ecstatichappiness.com":[243],"edibleperspective.com":[243],"educationlibrary.org":[243],"eleganceechoes.com":[243],"elliott.org":[243],"episodehive.com":[243],"essentialketo.com":[243],"exploreessaouira.com":[243],"facilycasero.com":[49],"familyfelicity.com":[49],"fantasycalc.com":[49],"fastingwithlaura.com":[49],"feedingthefrasers.com":[49],"findcatnames.com":[49],"findtherun.com":[49],"fivehearthome.com":[49],"floorcritics.com":[49],"flooringforum.com":[49],"foodstruct.com":[49],"forbusybees.com":[49],"fordfullsize.com":[49],"freeslp.com":[49],"freshcoasteats.com":[49],"fuelly.com":[49],"gluedtomycraftsblog.com":[49],"goldenlucycrafts.com":[49],"goodfooddiscoveries.com":[49],"gopresstimes.com":[49],"grayingwithgrace.com":[49],"happyfoodhealthylife.com":[247],"happysimpleliving.com":[247],"hawaii.com":[247],"hazyandhoppy.com":[247],"healthyelizabeth.com":[247],"healthygirlkitchen.com":[247],"heartandsoulhomeschooling.com":[247],"heretocook.com":[247],"herviewfromhome.com":[247],"hobbyhelp.com":[247],"homecookedroots.com":[247],"homegrownhappiness.com":[247],"homemadelovely.com":[247],"homeschool.com":[247],"honeywerehome.com":[247],"housefur.com":[247],"housekeen.com":[247],"idownloadblog.com":[49],"ih8mud.com":[49],"infarrantlycreative.net":[49],"isavea2z.com":[49],"jellymemos.com":[243],"jennaburger.com":[243],"jenniferrizzo.com":[243],"jetpunk.com":[243,248,249,250,251,252],"joyofmotioncrochet.com":[243],"junky-traveler.com":[243],"justinweather.com":[243],"justonecookbook.com":[243],"justsotasty.com":[243],"kiddingaroundcharlotte.com":[243],"kingshotdata.com":[243],"kitchentreaty.com":[243],"knifeinformer.com":[243],"knotions.com":[243],"laurafuentes.com":[243],"lebernard.ca":[243],"lemonsandzest.com":[243],"littlebitsof.com":[243],"littlehouseliving.com":[243],"lowcarbquick.com":[243],"machiningdoctor.com":[49],"makingthymeforhealth.com":[49],"mandysrecipeboxblog.com":[49],"mangoful.com":[49],"mariashriversundaypaper.com":[49],"maryswholelife.com":[49],"maximumridesharingprofits.com":[49],"mechanicguides.com":[49],"mediatakeout.com":[49],"meganvskitchen.com":[49],"messylittlemonster.com":[49],"mjandhungryman.com":[49],"monkeyandmekitchenadventures.com":[49],"mortadellahead.com":[49],"mybartender.com":[49],"mygoodfoodworld.com":[49],"mymundaneandmiraculouslife.com":[49],"myoutlanderphev.com":[49],"mywordgames.com":[49],"naturalbabylife.com":[243],"naturalbeachliving.com":[243],"nerdsandscoundrels.com":[243],"nhltraderumor.com":[243],"noracooks.com":[243],"nywoodsandwater.com":[243],"oldhousecalling.com":[243],"oldhousetonewhome.net":[243],"oldsaltfarm.com":[243],"ourbestbites.com":[243],"outagescope.com":[243],"peakbagger.com":[49],"pennymediallc.com":[49],"pestleanalysis.com":[49,117],"petiteinparis.com":[49],"pitcherlist.com":[49],"pizzamaking.com":[49],"pokemap.net":[49],"pokemoncard.io":[49],"populationpyramid.net":[49],"poultryshowcentral.com":[49],"prayerist.com":[49],"preciouscore.com":[49],"pricescope.com":[49],"prologuetalk.com":[49],"puzzles-to-print.com":[49],"pythonguides.com":[49],"rachelteodoro.com":[243],"randomstreetview.com":[243],"realgreekrecipes.com":[243],"realmenrealstyle.com":[243],"respiratorytherapyzone.com":[243],"restonnow.com":[243],"rogerebert.com":[243],"routesnorth.com":[243],"saltinmycoffee.com":[49],"sarahremmer.com":[49],"savortheflavour.com":[49],"seasonedhomemaker.com":[49],"shiplapandshells.com":[49],"shooting.org":[49],"shorebeat.com":[49],"shoutoutarizona.com":[49],"shoutoutsouthcarolina.com":[49],"silverhomestead.com":[49],"simpleshowing.com":[49],"simplyhealthyfamily.org":[49],"sleeping.guide":[49],"slopitchcentral.com":[49],"smarttereachday.com":[49],"southcarolinavoyager.com":[49],"spacechatter.com":[49],"spicebangla.com":[49],"spreadsheetpage.com":[49],"stayfitmom.com":[49],"stetted.com":[49],"streamersplaybook.com":[49],"sugarmaplefarmhouse.com":[49],"supercheats.com":[49],"superdutydiesel.com":[49],"surfhungry.com":[49],"sustainmycrafthabit.com":[49],"svgnation.com":[49],"sweetandsavorymeals.com":[49],"swoonhub.com":[49],"talkbass.com":[49],"tanningsalonsnearme.com":[49],"tasteslovely.com":[49],"tastesoflizzyt.com":[49],"teamfight.lol":[49],"teds-list.com":[49],"thai-foodie.com":[49],"the-bella-vita.com":[49],"thebakeologie.com":[49],"thebalancednutritionist.com":[49],"thebensonstreet.com":[49],"thebestketorecipes.com":[49],"thebutteryfairytale.com":[49],"theclevercarrot.com":[49],"theclevermeal.com":[49],"thecookiedoughdiaries.com":[49],"thecookingfoodie.com":[49],"thegardeningdad.com":[49],"thehappychickencoop.com":[49],"theharperhouse.com":[49],"thehouseoffancy.com":[49],"thehyundaiforums.com":[49],"thelabradoodlesite.com":[49],"thematbakh.com":[49],"themilitarywifeandmom.com":[49],"thenaturalnurturer.com":[49],"thenavagepatch.com":[49],"thenwewalked.com":[49],"theoi.com":[49],"thepalatablelife.com":[49],"thepragmaticparent.com":[49],"therecipecritic.com":[49],"thesavorychopstick.com":[49],"thespeckledpalate.com":[49],"thetrendspotter.net":[49],"theunconventionalroute.com":[49],"theveglife.com":[49],"thevgnway.com":[49],"thislittlehome.com":[49],"thunderboltlaptop.com":[49],"traversewithtaylor.com":[49],"truemoneysaver.com":[49],"tuppennysfireplace.com":[49],"vegrecipesofindia.com":[243],"visitdowntownnashville.com":[243],"vmaxforum.net":[243],"voyagemichigan.com":[243],"voyageraleigh.com":[243],"wdio.com":[243],"west-games.com":[243],"wheatbythewayside.com":[243],"whiskeyriff.com":[243],"whiskeywatch.com":[243],"wichitabyeb.com":[243],"wifemamafoodie.com":[243],"wildernesstoday.com":[243],"worksheets-to-print.com":[243],"youbrewmytea.com":[243],"yourastrologyreading.com":[243],"yourguidesabroad.com":[243],"yuzubakes.com":[243],"4runner-forums.com":[233],"718forum.com":[233],"avsforum.com":[233],"buceesfans.com":[233],"c-classforum.com":[233],"cadenzaforum.com":[233],"catfish1.com":[233],"catforum.com":[233],"chevyblazer.org":[233],"clubfrontier.org":[233],"dieseljeeps.com":[233],"dodgetalk.com":[233],"elantraxd.com":[233],"etransitforum.com":[233],"f800riders.org":[233],"ferrari296forum.com":[233],"fiskerbuzz.com":[233],"fordstnation.com":[233],"frugalvillage.com":[233],"goldwingowners.com":[233],"grandhighlanderforum.com":[233],"jeepforum.com":[233],"kfx450central.com":[233],"lawnsite.com":[233],"marlinowners.com":[233],"mg-rover.org":[233],"moddedmustangs.com":[233],"nationalgunforum.com":[233],"ncgunowners.com":[233],"newbrunswickhunting.com":[233],"panigalev4club.com":[233],"pavementsucks.com":[233],"paw-talk.net":[233],"personalitycafe.com":[233],"plowsite.com":[233],"prowlertalk.net":[233],"r1-forum.com":[233],"rangerraptorowners.com":[233],"raptorforum.com":[233],"routerforums.com":[233],"runeriders.com":[233],"seltosforum.com":[233],"stingrayforums.com":[233],"taosforums.com":[233],"taurusarmed.net":[233],"thebassholes.com":[233],"theworldofarchitecture.com":[233],"trailsportforum.com":[233],"viperalley.com":[233],"volvo-forums.com":[233],"vtcafe.com":[233],"wolverineforums.com":[233],"zrvforum.com":[233],"h-donghua.com":[253],"husseinezzat.com":[253],"unblockedgamesgplus.gitlab.io":[253],"games.everythingzoomer.com":[254,255],"games.startribune.com":[254,255],"arkadiumhosted.com":[256],"doods.*":[257,258,259,37,39],"jennifereconomicgive.com":[39,260,105,121],"jeremyparticipantanything.com":[39,260,105,121],"jilliandescribecompany.com":[39,260,105,121],"mmtv01.xyz":[39,261,262],"turbovid.vip":[39,261,262],"m1xdrop.com":[183,39],"m1xdrop.net":[183,39],"lulust.com":[106,151,263,264],"javbee.*":[265],"expres.cz":[266,267],"cg-gamespc.net":[268,269,270,271,272,273,274,275,276,277,278],"dizipal1566.com":[279],"dizipal1599.com":[279],"inattv1288.xyz":[280],"inattv1291.xyz":[280],"inattv1318.xyz":[280],"inattv1321.xyz":[280],"voznovel.com":[281,282],"ilmeteo.it":[283],"eoreuni.com":[284],"jncojeans.com":[285],"nguyenvanbao.com":[285],"ctrlv.*":[286,287],"eddiekidiw.com":[288],"swift4claim.com":[166],"linuxhint.com":[289],"infomaniakos.*":[290],"sexetag.com":[95],"netnaijas.com":[291],"batterypoweronline.com":[292],"myvalley.it":[292],"freemagazines.top":[293,294,295,296,123,297],"vapley.*":[39,298],"thesun.ie":[299,300,301],"chietitoday.it":[302],"forlitoday.it":[302],"quicomo.it":[302],"panel.skynode.pro":[303],"hd21.*":[39],"mobilesexgamesx.com":[304],"sexgamescc.com":[304],"foxtube.com":[39],"123strippoker.com":[63],"erotic-beauties.com":[305],"hardsex.cc":[305],"tube18.sexy":[305],"istanbulescortnetworks.com":[306],"pinoyalbums.com":[307],"kickass.*":[308,126,309],"kickassgo.*":[126,309],"ebony8.com":[310,311],"extratorrents.*":[312],"courseboat.com":[313],"romhustler.org":[314],"addonbiz.com":[315],"sbchip.*":[171,175],"sbplay.*":[171,175,316,317],"sbrity.com":[171,175],"m2list.com":[318,131],"buyjiocoin.*":[39],"18tube.sex":[156],"waploaded.*":[83,319],"imslp.org":[195],"fapnado.*":[320],"beingtek.com":[167,69],"q1003.com":[321],"rincondelsazon.com":[322],"riazor.org":[323],"bfclive.com":[39,324],"lootup.me":[325],"goduke.com":[326],"alluretube.com":[37],"lovefap.com":[37],"mzansinudes.com":[37],"sexavgo.com":[37],"pornoborshch.com":[327],"h-flash.com":[39],"spfutures.org":[328],"mobilanyheter.net":[329],"xcity.org":[63,330],"xubster.com":[331],"ghior.com":[332],"watchseries9.*":[175],"babia.to":[333,334],"freepreset.net":[335],"lusttaboo.com":[336,160],"biologyclass.club":[337],"avpgalaxy.net":[338],"moonmov.pro":[39],"gewinde-normen.de":[56],"schaken-mods.com":[339],"player.hdgay.net":[340],"hdgay.net":[341],"cloudcomputingtopics.net":[342],"adzz.in":[343,344],"rendimentibtp.it":[345],"tvnet.lv":[339],"spigotunlocked.*":[346],"fedscoop.com":[347],"imagetotext.info":[348],"deezer.com":[349,350,351,352],"footyhunter.lol":[353],"arbweb.info":[354],"lucagrassetti.com":[355],"watchonlyfoolsandhorses.com":[39],"nammakalvi.com":[356],"diendancauduong.com":[357,358,359,253],"aeroxplorer.com":[114],"vidello.net":[39,360],"freebnbcoin.com":[361],"nft-media.net":[362],"empire-anime.*":[363,364,365,366,367,368,369,370,371],"empire-anime.com":[363,364,365,367,368,369],"pandasnovel.com":[372],"ruyashoujo.com":[373],"m.4khd.com":[374],"vxetable.cn":[375],"crotpedia.net":[152],"client.pylexnodes.net":[376],"app.vaia.com":[377],"hackerranksolution.in":[378],"mastaklomods.com":[295],"kawarthanow.com":[379],"yt-downloaderz.com":[345],"whoreshub.com":[380],"rollstroll.com":[379],"sabornutritivo.com":[345],"player.bestrapeporn.com":[39],"paramountplus.com":[381],"ville-ideale.fr":[382],"xhamster12.*":[383,384,385,386,387,388],"xhwebsite.com":[383,384,385,386,387,388],"brainly.*":[389,390],"eodev.com":[389],"megawarez.org":[391],"itv.com":[39],"a2zapk.*":[392,91,393,394],"a2zapk.io":[395],"vidsrc.click":[396],"bysejikuar.com":[141,397,39],"envato-downloader.com":[398],"sharedrive.*":[39],"visnalize.com":[345],"treasl.com":[399],"expressnews.com":[400],"lewdcorner.com":[401],"sex-empire.org":[39],"overtake.gg":[402],"technofino.in":[345],"nextgov.com":[403],"onloop.pro":[404],"gamingbeasts.com":[405],"seeklogo.com":[406],"oaaxpgp3.xyz":[39,407],"player.vidplus.pro":[408],"vidplus.pro":[409],"wvv-fmovies.com":[39],"svetatnazdraveto.bg":[149,345,410],"tennis.stream":[411],"givemesport.com":[412,345],"serviceemmc.com":[413],"4edtcixl.xyz":[39],"tempmail.ninja":[414],"javplayers.com":[39],"desi.upn.bio":[415],"0ochi8hp.com":[39,141],"cdn.tiesraides.lv":[416],"animelatinohd.com":[417],"dlstreams.*":[418,419],"buffalobills.com":[420],"dallascowboys.com":[420],"wcostream.*":[421,39],"watchanimesub.net":[422],"embed.wcostream.com":[423,424],"boobsradar.com":[425,155,426],"pourcesoir.in":[427],"pienovels.com":[119],"lewdgames.to":[428],"flixhouse.com":[429],"adbypass.org":[131],"hi0ti780.fun":[39,407],"gamehub.cam":[141,430],"hwbusters.com":[431],"pornproxy.art":[39,161],"pornproxy.app":[39,161],"vip-box.app":[206],"pornharlot.net":[432],"download.yasir252.com":[433,434],"remotejobzone.online":[435],"ditjesendatjes.nl":[436],"coolporno.net":[437],"sommerporno.com":[437],"tv.onefootball.com":[438],"mediamarkt.be":[323],"marinetraffic.live":[439],"weights.com":[435],"pelismkvhd.com":[440],"xmorex.com":[441],"atalantini.online":[442],"fastpeoplesearch.com":[443],"player4me.vip":[39],"camwhorestv.*":[444,445,446,63,39],"c.newsnow.com":[447,448],"cima4u.forum":[449],"oxxfile.*":[450,451],"planetrugby.com":[452,453],"chatgpt.com":[454,455,456],"mlb.com":[457,458],"damitv.live":[459,460],"scmp.com":[149,461],"spotsaver.net":[39],"kinob.net":[462,463],"vocalley.com":[464,465,466],"nephobox.com":[467],"fawzy.xyz":[468,469,449,470],"vijviral.com":[471],"lifesurance.info":[472],"azsoft.*":[473,474,475],"4khd.com":[66,476],"arolinks.com":[477,478,479,480,481,69,482],"tulink.org":[483],"bgmiconfig.ink":[484],"youtube.com":[6],"0cbcq8mu.com":[39,407],"openchat-review.me":[485],"yamiisoku.com":[486,487,488],"pythonjobshq.com":[489],"pasteboard.co":[490],"theinventory.com":[491],"verizon.com":[492],"tierlists.com":[493],"flygbussarna.se":[494],"sterkinekor.com":[495],"eurogamer.pl":[33],"ekino-tv.pl":[89],"otube.pl":[496]};
const EXCEPT = {"uii.io":["noeval"],"pingit.com":["abort-on-property-read\u0001AaDetector","abort-on-property-read\u0001open","abort-on-property-read\u0001rmVideoPlay","abort-on-property-read\u0001_pop","abort-on-property-write\u0001Fingerprint2","set-constant\u0001blurred\u0001false"],"vr.pornhat.*":["abort-on-property-read\u0001document.dispatchEvent"],"vidsrc.*":["abort-current-script\u0001EventTarget.prototype.addEventListener\u0001delete window"],"astral.sh":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"brew.sh":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"christitus.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"community-scripts.org":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"datadoghq.*":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"deno.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"devaccellabs.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"jetbrains.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"massgrave.dev":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"natfrp.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"ntriver.org":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"reaclassical.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"runpane.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"bilibili.com":["json-prune-fetch-response\u0001data.item.[-].business_info.ad_desc\u0001\u0001/feed/rcmd"],"titulky.com":["set-constant\u0001xmxalr"],"idnes.cz":["abort-current-script\u0001HTMLIFrameElement.prototype.contentWindow"],"notube.com":["prevent-window-open"],"oxy.edu":["abort-current-script\u0001$\u0001window.open","prevent-setInterval\u0001.hide","abort-current-script\u0001$\u0001localStorage"],"money.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad","set-constant\u0001Object.prototype.rekids\u0001undefined","set-constant\u0001Object.prototype.gafSlot\u0001undefined","set-constant\u0001Object.prototype.advViewability\u0001undefined"],"kobieta.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"gadzetomania.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"fotoblogia.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"komorkomania.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wiadomosci.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"tech.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"dom.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"facet.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"film.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"finanse.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"gry.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"gwiazdy.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"ksiazki.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"kuchnia.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"moto.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"opinie.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"pogoda.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"teleshow.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"turystyka.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"wideo.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wawalove.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"autokult.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"horoskop.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"tv.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"twojeip.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"sportowefakty.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","set-constant\u0001Object.prototype.loadBunch\u0001noopFunc","abort-on-property-read\u0001Object.prototype.bodyCode","abort-on-property-read\u0001WP.inline"],"fitness.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","abort-on-property-read\u0001WP.inline","prevent-setTimeout\u0001/getComputedStyle[\\s\\S]*?style\\.display=\"none\"[\\s\\S]*?styleBlocked[\\s\\S]*?detected/"],"www.wp.pl":["abort-on-property-read\u0001__headpayload","abort-on-stack-trace\u0001WP\u0001r https","set-constant\u0001WP.gaf.loadBunch\u0001noopFunc"],"southpark.*":["google-ima"],"southpark.cc.com":["google-ima"],"southparkstudios.*":["google-ima"],"games.dailymail.co.uk":["abort-on-property-read\u0001Notification"],"games.dailymail.com":["abort-on-property-read\u0001Notification"],"platform.twitter.com":["json-prune-xhr-response\u0001data.home.home_timeline_urt.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/Home","json-prune-xhr-response\u0001data.search_by_raw_query.search_timeline.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/SearchTimeline","json-prune-xhr-response\u0001data.threaded_conversation_with_injections_v2.instructions.[].entries.[-].content.items.[].item.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/TweetDetail","json-prune-xhr-response\u0001data.user.result.timeline_v2.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/UserTweets","json-prune-xhr-response\u0001data.immersiveMedia.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/ImmersiveMedia"],"filmweb.pl":["abort-current-script\u0001decodeURIComponent\u0001newAdblockBoardDisplayed"],"linkneverdie.net":["prevent-setTimeout\u0001t"],"dziennik.pl":["abort-current-script\u0001parseInt\u0001adblock"],"gunauc.net":["prevent-fetch\u0001pagead2.googlesyndication.com"],"daddylive.link":["abort-on-property-read\u0001require"],"player.pl":["json-prune\u0001movie.advertising.ad_server"],"lookmovie.studio":["set-constant\u0001Yii2App.playbackTimeout\u00010"],"jobzhub.store":["trusted-replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"fitdynamos.com":["trusted-replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"labgame.io":["trusted-replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"sayphotobooth.com":["adjust-setInterval\u0001tp-time\u0001*\u00010.001"],"encurtador.postazap.com":["adjust-setInterval\u0001timer\u0001*\u00010.001"],"intercelestial.com":["adjust-setTimeout\u0001\u0001*\u00010.1"],"hubdrive.com":["prevent-window-open","prevent-addEventListener\u0001\u0001history.go"],"hubdrive.de":["prevent-window-open","prevent-addEventListener\u0001\u0001history.go"],"dziennikbaltycki.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dzienniklodzki.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dziennikpolski24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dziennikzachodni.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"echodnia.eu":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"expressbydgoski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"expressilustrowany.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetakrakowska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetalubuska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetawroclawska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gk24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gloswielkopolski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gol24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gp24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gra.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gs24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"kurierlubelski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"motofakty.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"naszemiasto.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nowiny24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nowosci.com.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nto.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"polskatimes.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"pomorska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"poranny.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"sportowy24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"strefaagro.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"strefabiznesu.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"stronakobiet.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"telemagazyn.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"to.com.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"wspolczesna.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"abczdrowie.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","prevent-setTimeout\u0001visibility\u00010"],"job.mt.de":["prevent-setTimeout\u0001.call(null)\u000110"],"job.nw.de":["prevent-setTimeout\u0001.call(null)\u000110"],"uqload.co":["abort-current-script\u0001document.createElement\u0001break;case $."],"yandex.*":["abort-on-property-read\u0001Object.prototype.renderDirect):matches-path(/\\/(?:weather\\/|pogoda\\/|hava\\/)/"],"pilot.wp.pl":["abort-on-property-read\u0001WP.inline"],"poczta.wp.pl":["abort-on-property-read\u0001WP.inline"],"open.fm":["set-constant\u0001Object.prototype.gafSlot\u0001undefined"],"dobreprogramy.pl":["abort-on-property-read\u0001wp_consent_color"]};
class ChromeBlockJSONPath {
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
const PERF_EVENT = 'chromeblock:scriptlet-perf';
const perf = (() => {
let on = false;
try { on = win[Symbol.for('chromeblock.scriptletPerf')] === true; } catch { /* */ }
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
if (details.re) return details.re.test(haystack) === details.expect;
return haystack.includes(details.text) === details.expect;
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
let [prop, pattern] = needle.split(':');
if (prop === '') continue;
if (pattern !== undefined && /[^$\w -]/.test(prop)) {
prop = `${prop}:${pattern}`;
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
return tt.createPolicy('chromeblock-' + Math.random().toString(36).slice(2), plain);
}
} catch { /* */ }
return plain;
})();
let sedCount = extra.sedCount !== undefined ? extra.sedCount : Number.MAX_SAFE_INTEGER;
const handleNode = (node) => {
const before = textContentGetter.call(node);
if (reIncludes) { reIncludes.lastIndex = 0; if (!reIncludes.test(before)) return; }
if (reExcludes) { reExcludes.lastIndex = 0; if (reExcludes.test(before)) return; }
rePattern.lastIndex = 0;
if (!rePattern.test(before)) return;
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
if (reNodeName.test(node.nodeName)) handleNode(node);
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
if (reNodeName.test(node.nodeName)) handleNode(node);
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
if (re.test(k)) toRemove.push(k);
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
const len = typeof inner === 'string' ? inner.length : undefined;
if (d.lastLength !== len) { d.response = undefined; d.lastLength = len; }
if (d.response !== undefined) return d.response;
d.response = transform(inner);
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
if (context !== '' && reContext.test(e.src) === false) return;
if (reNeedle.test(scriptText(e)) === false) return;
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
const both = reType.test(t) && rePattern.test(h);
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
if (rePattern.test(callArgs.join(' ')) !== expect) return ctx.reflect();
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
for (const { addedNodes, removedNodes } of mutations) {
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
if (reIncludes && reIncludes.test(textBefore) === false) return before;
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
if (reIncludes && reIncludes.test(inner) === false) return inner;
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
if (!reName.test(name)) return;
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
if (needle !== '' && reNeedle.test(String(ctx.callArgs[0]))) return undefined;
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
const has = (haystack, needle) => haystack.some(({ key, value }) => needle.test(`${key}=${value}`));
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
if (reNeedle.test(a) !== not && range.test(callArgs[1])) callArgs[0] = function () {};
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
if ((delay === -1 || b === delay) && reNeedle.test(a.toString())) args[1] = b * boost;
return target.apply(thisArg, args);
},
});
return;
}
win[name] = new Proxy(win[name], {
apply: makeApplyTrap(perfLabel(name), (target, thisArg, args, reflect) => {
const [a, b] = args;
if ((delay === -1 || b === delay) && reNeedle.test(a.toString())) args[1] = b * boost;
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
const jsonp = ChromeBlockJSONPath.compileQuery(q);
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
runForHost(CALLS, HOSTS, EXCEPT);
})();
