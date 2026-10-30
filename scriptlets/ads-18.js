/* Apex AdBlocker – scriptlety listy "Reklamy" (część 19/23). Plik generowany przez tools/build.mjs. */
(function () {
'use strict';
if (typeof globalThis[Symbol.for('ApexAdBlocker.entityHostKeys.v1')] !== 'function') return;
const installedKey = Symbol.for('ApexAdBlocker.scriptletShards.v1');
let installed = globalThis[installedKey];
if (!installed) {
  installed = new Set();
  Object.defineProperty(globalThis, installedKey, { value: installed, writable: false, configurable: false });
}
const shardKey = "scriptlets/ads-18.js:091bc407b25bc8f8386952a4670c17c76d00eb9f7e8ab5556315e59d14fd5f25";
if (installed.has(shardKey)) return;
installed.add(shardKey);
const CALLS = [["set-constant","ytInitialPlayerResponse.playerAds","undefined"],["set-constant","ytInitialPlayerResponse.adPlacements","undefined"],["set-constant","ytInitialPlayerResponse.adSlots","undefined"],["set-constant","playerResponse.adPlacements","undefined"],["json-prune","playerResponse.adPlacements playerResponse.playerAds playerResponse.adSlots adPlacements playerAds adSlots important"],["json-prune-fetch-response","reelWatchSequenceResponse.entries.[-].command.reelWatchEndpoint.adClientParams.isAd entries.[-].command.reelWatchEndpoint.adClientParams.isAd","","propsToMatch","url:/reel_watch_sequence?"],["json-prune","entries.[-].command.reelWatchEndpoint.adClientParams.isAd"],["abort-on-property-read","_sp_._networkListenerData"],["remove-node-text","script","/adblockerDisabled|\\.cmd\\.unshift|admiral/","excludes",",\\\""],["abort-on-property-write","Fingerprint2"],["abort-on-property-read","ExoLoader"],["prevent-window-open"],["prevent-setTimeout","disableDeveloper"],["remove-node-text","script","html-load.com"],["prevent-addEventListener","load","creativeLoaded-"],["prevent-addEventListener","/^load[A-Za-z]{12,}/"],["prevent-setTimeout","tick","1000"],["set-constant","registerLazyExo","noopFunc"],["abort-on-property-read","__Y"],["noeval-if","ExoLoader"],["set-constant","flashvars.adv_pause_html"],["abort-current-script","btoa","BOOTLOADER_LOADED"],["remove-node-text","script","/\"v4ac1eiZr0\"|\"\"\\)\\.split\\(\",\"\\)\\[4\\]|(\\.localStorage\\)|JSON\\.parse\\(\\w)\\.getItem\\(\"|[\"']_aQS0\\w+[\"']|decodeURI\\(decodeURI\\(\"|<a href=\"https:\\/\\/getad%|\"cmp\\.updated\"/"],["set-constant","caca","noopFunc"],["set-constant","page_params.holiday_promo","true"],["prevent-xhr","/googlesyndication|outbrain/"],["abort-on-property-write","adsBlocked"],["abort-on-property-read","__eiPb"],["set-constant","CnnXt.Event.fire","noopFunc"],["set-constant","GNCA_Ad_Support","true"],["set-constant","VMG.Components.Adblock","false"],["abort-current-script","crakPopInParams"],["abort-on-property-read","console.log"],["abort-on-property-read","decodeURI"],["prevent-setTimeout","keep-ads","2000"],["abort-current-script","$","#pageWrapper"],["abort-on-property-write","adBlockDetected"],["abort-on-property-read","NativeAd"],["abort-on-property-read","popit"],["prevent-addEventListener","popstate","noPop"],["abort-current-script","document.createElement","script"],["abort-current-script","puShown","/doOpen|popundr/"],["abort-on-property-read","ExoLoader.serve"],["abort-on-property-read","document.dispatchEvent"],["abort-current-script","decodeURI","decodeURIComponent"],["abort-on-property-read","exoJsPop101"],["abort-current-script","document.querySelectorAll","popMagic"],["set-constant","nlf.custom.userCapabilities","false"],["prevent-addEventListener","load","nextFunction"],["abort-current-script","atob","encodeURIComponent"],["abort-current-script","JSON","_0x"],["remove-node-text","script","/h=decodeURIComponent|popundersPerIP/"],["set-constant","closeBlockerModal","false"],["adjust-setTimeout"],["abort-current-script","setTimeout","bait.css"],["set-constant","adblockEnabled","false"],["abort-current-script","document.getElementById","alert"],["remove-node-text","script","/__adblocker|html-load/","excludes","self.__next"],["abort-on-property-read","adBlockDetected"],["abort-current-script","document.addEventListener","nextFunction"],["abort-on-property-read","app_vars.force_disable_adblock"],["noeval"],["set-constant","blurred","false"],["prevent-window-open","/^/","1"],["remove-node-text","script","/DName|#iframe_id|AdscoreSignatureLoaded/"],["abort-current-script","Date","='\\x"],["abort-current-script","document.head.appendChild","='\\x"],["remove-node-text","script","/__adblocker|html-load/"],["abort-on-property-write","popup_ads"],["set-constant","pr_okvalida","true"],["abort-on-property-read","exoNoExternalUI38djdkjDDJsio96"],["abort-on-property-read","detectAdBlock"],["abort-on-property-read","loadTool"],["abort-on-property-read","ExoLoader.addZone"],["abort-current-script","loadTool","popping"],["prevent-addEventListener","load","onload"],["adjust-setInterval","/SplashScreen|BannerAd/"],["adjust-setTimeout","/SplashScreen|BannerAd/"],["prevent-addEventListener","load","adb"],["abort-on-property-read","b2a"],["set-constant","blockAdBlock","trueFunc"],["remove-node-text","script","adblock"],["trusted-replace-node-text","script","useAdBlockDefend: true","useAdBlockDefend: false"],["prevent-setTimeout",".call(null)","10"],["remove-node-text","script","DisplayAcceptableAdIfAdblocked"],["abort-current-script","$","detected"],["trusted-replace-node-text","script","/if \\([a-z0-9]{10} === [a-z0-9]{10}/","if(true"],["prevent-addEventListener","load","undefined"],["abort-on-property-read","dataPopUnder"],["abort-current-script","onload"],["prevent-addEventListener","","show"],["prevent-setTimeout","show"],["prevent-addEventListener","load","antiblock"],["abort-on-property-read","onload"],["prevent-setTimeout","Delay"],["remove-node-text","script","/==undefined.*body/"],["abort-on-property-read","open"],["remove-node-text","script","wpadmngr.com"],["noeval-if","/chp_?ad/"],["set-constant","chp_adblock_browser","noopFunc"],["prevent-addEventListener","DOMContentLoaded",".clientHeight"],["prevent-setTimeout","ads"],["abort-on-property-read","document.write"],["remove-node-text","script","ads-blocked"],["abort-current-script","parseInt","break;case $."],["set-constant","blockAdBlock._options.baitClass","null"],["remove-node-text","script","/popMagic|pop1stp/"],["abort-current-script","document.documentElement","break;case $."],["abort-current-script","document.createElement","l.parentNode.insertBefore(s"],["prevent-fetch","/googlesyndication|doubleclick/","length:10","{\"type\": \"cors\"}"],["prevent-xhr","/googlesyndication|doubleclick/","length:10"],["abort-current-script","decodeURIComponent","'shift'"],["remove-node-text","script","adserverDomain"],["remove-node-text","script","/WebAssembly|forceunder/"],["prevent-setInterval","adblock"],["abort-on-property-read","Adcash"],["adjust-setTimeout","counter"],["set-constant","flashvars.protect_block"],["prevent-addEventListener","","popMagic"],["abort-current-script","WebAssembly","atob"],["prevent-addEventListener","click","popMagic"],["abort-current-script","addEventListener","-0x"],["prevent-window-open","_blank"],["abort-current-script","EventTarget.prototype.addEventListener","delete window"],["set-constant","detectSandbox","noopFunc"],["prevent-addEventListener","DOMContentLoaded","Promise"],["prevent-setTimeout","push"],["abort-on-property-read","popns"],["abort-current-script","document.createElement","target.appendChild(s"],["prevent-setTimeout","no-referrer-when-downgrade"],["abort-current-script","document.createElement","l.parentNode.insertBefore(s","/^data:/"],["abort-current-script","b2a","ai_adb","/^data:/"],["prevent-addEventListener","click","openPopunder"],["prevent-setTimeout","openPopunder"],["prevent-addEventListener","load",".getComputedStyle"],["abort-current-script","eval","replace"],["abort-current-script","document.addEventListener","google_ad_client"],["prevent-setTimeout","adbl"],["set-constant","detectAdBlock","noopFunc"],["prevent-addEventListener","","STORAGE2"],["prevent-addEventListener","DOMContentLoaded","app_advert"],["abort-on-property-read","Aloader.serve"],["remove-node-text","script",";}}};break;case $."],["prevent-addEventListener","","break;case $."],["abort-current-script","Math","zfgloaded"],["abort-current-script","JSON.parse","break;case $."],["abort-on-property-read","SmartPopunder.make"],["abort-current-script","Math","break;case $."],["abort-current-script","globalThis","break;case"],["abort-current-script","navigator","break;case $."],["remove-node-text","script","/adserverDomain|\\);break;case /"],["abort-current-script","addEventListener","HTMLAllCollection"],["trusted-replace-node-text","script","/\\$\\(['\"]\\.play-overlay['\"]\\)\\.click.+/s","document.getElementById(\"mainvideo\").src=srclink;player.currentTrack=0;})})","condition","srclink"],["remove-node-text","script","/adblock|popunder|openedPop|WebAssembly|wpadmngr/"],["abort-on-property-read","__aaZoneid"],["abort-on-property-write","DoodPop"],["remove-node-text","script","{delete window["],["remove-node-text","script","adbWarn"],["prevent-setTimeout","afterOpen"],["abort-on-property-read","console.clear"],["adjust-setInterval","timer"],["prevent-window-open","!/prcf.fiyar|themes|pixsense|.jpg/"],["prevent-setTimeout","displayMessage","2000"],["remove-node-text","script","/AdClasses|bait/i"],["adjust-setInterval","timer","1000","0.001"],["set-constant","count","0"],["abort-current-script","document.querySelectorAll","localStorage"],["remove-node-text","script","/adblock|abd/i"],["prevent-addEventListener","click","window.open"],["prevent-addEventListener","scroll","start"],["prevent-setTimeout","start"],["remove-node-text","script","ai_adb"],["remove-node-text","script","baits.push"],["remove-node-text","script","onerror"],["prevent-addEventListener","load","[native code]"],["prevent-addEventListener","DOMContentLoaded","document.documentElement.lang.toLowerCase"],["set-constant","checkAdsStatus","noopFunc"],["noeval-if","deblocker"],["prevent-fetch","googlesyndication"],["prevent-setTimeout",".redirect"],["prevent-addEventListener","load","document.querySelectorAll"],["prevent-xhr","adsbygoogle"],["noeval-if","js_func_decode_base_64"],["abort-current-script","document.createElement","js_func_decode_base_64"],["abort-on-property-read","adsBlocked"],["prevent-setTimeout","css_class.show"],["abort-on-property-write","ai_front"],["prevent-addEventListener","load","abDetectorPro"],["prevent-xhr","googlesyndication"],["abort-on-property-read","googletag"],["abort-current-script","String.prototype.match","__adblocker","/^data:/"],["remove-node-text","script","/admiral|\\[\\]\\)\\.push\\(arguments\\)/","excludes",",\\\""],["remove-node-text","script","[]).push(arguments)","excludes",",\\\""],["remove-node-text","script","AdBlockEnabled"],["remove-node-text","script",".cmd.unshift","excludes",",\\\""],["remove-node-text","script","admiral","excludes",",\\\""],["set-constant","gnt.x.uam","undefined","runAt","interactive"],["abort-current-script","admiral"],["prevent-setTimeout","loader.min.js"],["remove-node-text","script","KCgpPT57bGV0IGU"],["prevent-setTimeout","content-loader.com"],["remove-attr","onerror","script[id][onerror]","asap","quitAfter","10"],["remove-node-text","script","/\\(\\)=>eval|&&window\\}/"],["remove-node-text","script","/:window,|\\)\\.join\\(String\\.fromCharCode/"],["remove-node-text","script","/html-load\\.com|:\\[?window,/"],["set-constant","loadShield","noopFunc"],["json-edit",".scriptLoader.*[?.id==\"ad_stack_split_provider\"]"],["adjust-setInterval"],["set-constant","cmgpbjs","false"],["set-constant","displayAdblockOverlay","false"],["set-constant","google","false"],["set-constant","start_full_screen_without_ad","false"],["set-constant","drupalSettings.coolmath.hide_preroll_ads","true"],["set-constant","network_user_id"],["set-constant","adLight","true"],["remove-node-text","script","/:\\[?window,/"],["remove-node-text","script","/\\(async\\s*\\(\\)\\s*=>\\s*\\{\\s*try\\s*\\{\\s*(const|var)/"],["remove-node-text","script","await eval"],["remove-node-text","script","\"data-sdk\""],["prevent-setTimeout","[native code]","500"],["remove-node-text","script","/\\)\\.join\\(String\\.fromCharCode|html-load\\.com/"],["remove-node-text","script",").join(String.fromCharCode"],["remove-node-text","script","__adblocker","excludes","self.__next"],["prevent-setTimeout","offsetHeight"],["abort-current-script","document.createElement","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/="],["remove-node-text","script","/\"__adblocker\"|\"data-sdk\"/"],["remove-node-text","script","antiAdBlockerHandler"],["set-constant","__INITIAL_STATE__.config.theme.ads.isAdBlockerEnabled","false"],["adjust-setInterval","generalTimeLeft","*","0.001"],["set-constant","console.clear","undefined"],["prevent-addEventListener","np.detect"],["prevent-setTimeout","getComputedStyle"],["set-constant","__ninjaAdMaxAbdLoaded","true"],["prevent-fetch","ads"],["prevent-setTimeout","checkAdblockUser"],["trusted-replace-node-text","script","/manageAds\\(video_urls\\[activeItem\\], video_seconds\\[activeItem\\], ad_urls\\[activeItem],true\\);/","playVideo();","condition","playAdd"],["trusted-replace-node-text","script","prerollEnabled:true","prerollEnabled:false"],["abort-current-script","document.addEventListener","Popunder"],["adjust-setTimeout","downloadbtn"],["abort-on-property-read","videootv"],["nowebrtc"],["abort-current-script","onload","adb"],["prevent-setTimeout","check"],["prevent-setTimeout","ad-block-popup"],["prevent-setTimeout","innerHTML.replace"],["remove-node-text","script","deblocker"],["prevent-setInterval","visibility","1000"],["abort-on-property-read","wpsite_clickable_data"],["prevent-setTimeout","bADBlock"],["noeval-if","window.open"],["abort-current-script","pop_init"],["set-constant","flashvars.adv_pre_vast"],["abort-on-property-write","__spotSettings"],["prevent-addEventListener","/click|mousedown/","catch"],["prevent-setInterval","document.getElementById","10000"],["abort-on-property-read","isAdBlockActive"],["abort-on-property-read","Element.prototype.attachShadow"],["prevent-setTimeout","ai"],["abort-on-property-read","blockAdBlock"],["abort-on-property-read","evolokParams.adblock"],["trusted-replace-node-text","style","visibility: visible !important;","display: none !important;"],["set-constant","google_unique_id","6"],["set-cookie","downloadbypass","1"],["adjust-setInterval","timercounter"],["adjust-setInterval","#timer"],["abort-on-property-read","mm"],["prevent-fetch","method:HEAD"],["set-constant","starPop","1"],["abort-on-property-read","puShown"],["abort-current-script","decodeURIComponent","ai_"],["abort-current-script","jQuery","No"],["prevent-fetch","doubleclick"],["prevent-xhr","doubleclick"],["prevent-fetch","dqst.pl"],["set-constant","canRunAds","true"],["set-constant","noAdBlock","noopFunc"],["abort-on-property-write","afStorage"],["abort-current-script","addEventListener","blocker"],["abort-current-script","document.createElement","AdBlock"],["abort-current-script","JSON.parse","htmlSectionsEncoded"],["set-constant","displayAds","0"],["set-constant","td_ad_background_click_link","undefined"],["prevent-setInterval","_0x"],["prevent-setTimeout","location.href","3000"],["prevent-fetch","/cloudfront|thaudray\\.com/"],["remove-attr","disabled","#gotolink"],["set-cookie","unlock_chapter_guest","1"],["abort-current-script","jQuery","modal"],["prevent-setTimeout","open"],["adjust-setInterval","consoleLoaded?clearInterval"],["set-constant","Object.prototype.adBlocked","false"],["abort-current-script","$","blockAdBlock"],["prevent-setTimeout","displayMessage"],["abort-current-script","document.addEventListener","openPopup"],["remove-node-text","#text","スポンサーリンク"],["prevent-setTimeout","adb"],["abort-current-script","document.createElement","appendChild"],["prevent-setTimeout","onDetected"],["set-constant","showAds","true"],["abort-on-property-read","my_pop"],["set-constant","S_Popup","10"],["set-constant","document.hasFocus","trueFunc"],["prevent-addEventListener","DOMContentLoaded","history.go"],["abort-on-property-read","app_vars.please_disable_adblock"],["prevent-fetch","/scorecardresearch\\.com|outbrain\\.com|taboola\\.com|criteo\\.net|rubiconproject\\.com|adform\\.net|casalemedia\\.com|adservice\\.google\\.com/","","{\"type\": \"opaque\"}"],["abort-on-property-write","popName"],["remove-node-text","script","Exo"],["prevent-addEventListener","getexoloader"],["noeval-if","ads"],["abort-current-script","fetch","adblock"],["adjust-setInterval","","1000","0.001"],["abort-current-script","Math","localStorage['\\x"],["adjust-setTimeout","0x","*"],["prevent-xhr","/\\/ad\\/g\\/1/"],["json-prune","adverts.breaks"],["abort-on-property-read","document.body.style.backgroundPosition"],["set-constant","tmDetectAdBlocker","falseFunc"],["remove-node-text","script","mega-enlace.com/ext.php?o="],["json-prune","data.searchClassifiedFeed.searchResultView.0.searchResultItemsV2.edges.[-].node.item.content.creative.clickThroughEvent.adsTrackingMetadata.metadata.adRequestId"],["json-prune","data.me.personalizedFeed.feedItems.[-].promo.creative.clickThroughUrl.adsTrackingMetadata.metadata.adRequestId"],["json-prune","data.me.rhrFeed.feedItems.[-].promo.creative.clickThroughUrl.adsTrackingMetadata.metadata.sponsor"],["remove-node-text","script","adblocker"],["json-prune-fetch-response","itemList.[-].ad_info.ad_id","","propsToMatch","url:api/recommend/item_list/"],["prevent-setTimeout","ad_block_detector"],["remove-node-text","script","popundersPerIP"],["prevent-window-open","/aff|jump/"],["set-constant","Object.prototype.ads.nopreroll_","true"],["abort-on-property-write","_pop"],["abort-on-property-read","antiAdBlockerHandler"],["set-constant","ADS.isBannersEnabled","false"],["trusted-set-constant","ADS.STATUS_ERROR","json:\"COMPLETE\""],["prevent-fetch","method:GET"],["remove-node-text","script","blocking"],["set-constant","cRAds","false"],["abort-on-property-write","showADBOverlay"],["trusted-replace-node-text","script","vid.vast","//vid.vast"],["trusted-prevent-fetch","imasdk","ad.doubleclick.net bid.g.doubleclick.net ggpht.com google.co.uk google.com googleads.g.doubleclick.net googleads4.g.doubleclick.net googleadservices.com googlesyndication.com googleusercontent.com gstatic.com gvt1.com prod.google.com pubads.g.doubleclick.net s0.2mdn.net static.doubleclick.net surveys.g.doubleclick.net youtube.com ytimg.com"],["set-constant","isAdBlockActive","false"],["prevent-setTimeout","google_jobrunner"],["trusted-set-constant","__NEXT_DATA__.props.pageProps.broadcastData.remainingWatchDuration","json:9999999999"],["trusted-replace-fetch-response","/\"remainingWatchDuration\":\\d+/","\"remainingWatchDuration\":9999999999","/stream"],["trusted-replace-fetch-response","/\"midTierRemainingAdWatchCount\":\\d+,\"showAds\":(false|true)/","\"midTierRemainingAdWatchCount\":0,\"showAds\":false","/stream"],["remove-node-text","script","#adbd"],["remove-node-text","script","/adbl/i"],["set-constant","isAdBlocked","noopFunc"],["prevent-fetch","mode:no-cors"],["remove-node-text","script","/window\\[\\'open\\'\\]/"],["remove-node-text","script","/andbox|adBlock|data-zone|histats|contextmenu|ConsoleBan/"],["adjust-setInterval","()=>{var c=Kb","1000","0.2"],["set-cookie","pum-32600","true"],["set-cookie","pum-44957","true"],["trusted-replace-node-text","script","isVipUser = false","isVipUser = true"],["prevent-window-open","/go/out"],["prevent-addEventListener","DOMContentLoaded","Popunder"],["set-constant","uas","[]"],["noeval-if","googlesyndication"],["prevent-fetch","widgets.outbrain.com"],["prevent-addEventListener","load","adblock"],["json-prune","bannerad sidebar ti_sidebar"],["set-constant","dclm_ajax_var.disclaimer_redirect_url"],["prevent-setTimeout","sub"],["prevent-addEventListener","click","adId"],["abort-current-script","$","open"],["prevent-setTimeout","TNCMS.DMP"],["remove-node-text","script","AD_URL"],["remove-node-text","script","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"],["prevent-setTimeout","()=>","1000"],["trusted-json-edit-fetch-response",".metadata.hideAds=true","propsToMatch","a2d.tv/play/"],["prevent-setTimeout","checkAdblockUser","1000"],["remove-node-text","script","/pirate/i"],["prevent-setTimeout","doubleclick"],["set-constant","HTMLScriptElement.prototype.onerror","undefined"],["remove-node-text","script","\"hidden\""],["set-constant","Object.prototype.adblockPlugin","undefined"],["adjust-setTimeout","resumeGame","5000","0.001"],["adjust-setTimeout","t++","500"],["trusted-set-session-storage-item","lastAdTime","$now$"],["json-prune-fetch-response","data.promotions","","propsToMatch","/graphql"],["prevent-setTimeout","detectAdBlock"],["trusted-replace-fetch-response","/\"features\":\\[/","\"features\":[\"ads-shutdown-nativeAds\",\"ads-shutdown-displayAds\",","/\\/owa\\/startupdata\\.ashx/"],["set-constant","VVADS","undefined"],["set-constant","FVPOA","undefined"],["trusted-replace-node-text","script","4000","10"],["prevent-addEventListener","load","bypass"],["prevent-setTimeout","displayAdBlockerMessage"],["prevent-fetch","doubleclick","","{\"type\": \"opaque\"}"],["prevent-addEventListener","DOMContentLoaded","open"],["remove-node-text","script","onpopstate"],["remove-node-text","script","showBannerAdBlock"],["trusted-replace-node-text","script","state.shown >= redirectUrls.length","true"],["prevent-fetch","pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"],["prevent-fetch","googletagservices"],["prevent-addEventListener","","history.go"],["abort-current-script","fetch","Math.random"],["prevent-setInterval","?key="],["remove-node-text","script","'+'","excludes","/^\\(self\\.__next/"],["prevent-fetch","pagead2.googlesyndication.com/pagead/js/adsbygoogle.js method:HEAD","emptyStr"],["prevent-addEventListener","/click|load/","/document\\.location|pop\\.|exo|cookie|\\.php/"],["prevent-window-open","/ok_|pemsrv\\.com|window\\.location\\.href/"],["set-constant","doAdRedirect","noopFunc"],["prevent-fetch","/piwik-"],["set-constant","ramp","undefined"],["set-constant","baMet.register","noopFunc"],["prevent-setTimeout","bioEp.showPopup"],["remove-attr","scrolling","iframe#sg-iframe[scrolling=\"no\"]","stay"],["adjust-setTimeout","#iwa_source=timeout","15000","0.02"],["abort-current-script","jQuery","#sdWelcomeScreen"],["adjust-setInterval","redirectId"]];
const HOSTS = {"youtubekids.com":[0,1,2,3,4,5,6],"denofgeek.com":[7,8],"downsub.com":[9],"picturelol.com":[10,11],"globalrph.com":[12,13],"pussyspace.com":[14,15,16,17],"pussyspace.net":[14,15,16,17],"sfastwish.com":[18],"3movs.com":[19,20],"thecelticblog.com":[21,22,13],"finofilipino.org":[23],"insuredhome.org":[24],"zigforums.com":[25,26],"the-military-guide.com":[27],"santacruzsentinel.com":[28],"globalnews.ca":[29],"dallasobserver.com":[30],"houstonpress.com":[30],"camwhoria.com":[31,32],"camseek.tv":[33],"sholah.net":[34],"labelandnarrowweb.com":[35],"hagalil.com":[36],"piazzagallura.org":[36],"wikifeet.com":[37],"animesexclip.com":[38,39],"daddyfuckmovies.com":[38,39],"exclusiveasianporn.com":[38,39],"hentaisexfilms.com":[38,39],"popularasianxxx.com":[38,39],"wowyoungsex.com":[38,39],"pandamovies.pw":[40,41,42,11,43],"porntube18.cc":[44,45,46],"nibelungen-kurier.de":[47],"hanimesubth.com":[48],"ciudadgamer.com":[49],"ovagames.com":[50,51],"modelisme.com":[52],"juegoviejo.com":[53],"m.kuku.lu":[54],"thuglink.com":[55],"typinggames.zone":[56,57],"faresgame.com":[58],"fc.lc":[59,58,60,61,62,63,64],"fc-lc.com":[59],"losporn.org":[42,11],"katiescucina.com":[65,66,27,67],"tastefullyeclectic.com":[65,66,27],"turtleboysports.com":[65,66,27],"acefile.co":[68,51],"diarioinformacion.com":[69],"pandamovies.me":[70,11],"juba-get.com":[71],"madchensex.com":[10],"boobgirlz.com":[72],"sexybabes.club":[73,74],"javaguides.net":[75],"gamearter.com":[76,77],"lavozdegalicia.es":[78],"allusione.org":[79],"bgsufalcons.com":[80],"conferenceusa.com":[80],"fgcuathletics.com":[80],"goetbutigers.com":[80],"mascac.org":[80],"lycomingathletics.com":[80],"roadrunnersathletics.com":[80],"stoutbluedevils.com":[80],"osubeavers.com":[80],"arizonawildcats.com":[80],"cuse.com":[80],"syracusecrunch.com":[80],"theshedend.com":[81],"sport.de":[82,83,84],"xiaomi-miui.gr":[85],"forum.release-apk.com":[86],"thelanb.com":[87],"dirtyship.com":[88,89],"cyberstumble.com":[79],"kurierlubelski.pl":[90],"hobby-machinist.com":[91],"brandstofprijzen.info":[92],"trendsderzukunft.de":[93,94],"4fansites.de":[83],"9monate.de":[83],"abendblatt.de":[83],"bafoeg-aktuell.de":[83],"boerse.de":[83],"brieffreunde.de":[83],"finanznachrichten.de":[83],"fremdwort.de":[83],"hftg.co":[83],"iban-rechner.de":[83],"kamelle.de":[83],"naumburger-tageblatt.de":[83],"neuepresse.de":[83],"noz-cdn.de":[83],"paradisi.de":[83],"sn.at":[83],"techstage.de":[83],"weihnachten.me":[83],"funnyand.com":[95],"theblacksphere.net":[95],"politicalsignal.com":[95],"pornj.com":[96],"aiblog.tv":[51,97],"androidadult.com":[51,98,99,100,101,102,103],"anidl.org":[51,104],"asianclipdedhd.net":[51],"blackporncrazy.com":[51],"blkom.com":[51,105],"brokensilenze.net":[51,98,106],"crackstreamshd.click":[51,107],"djmaza.my":[51,11],"fapptime.com":[51],"favoyeurtube.net":[51,108],"itsuseful.site":[51],"javleak.com":[51],"mixi-xxx.cc":[51],"mrskin.live":[51],"naughtypiss.com":[51],"netfuck.net":[51,46,109,110],"nicekkk.com":[51,111],"okanime.xyz":[51],"readhunters.xyz":[51,98],"seir-sanduk.com":[51,112],"sgpics.net":[51,97],"shahiid-anime.net":[51],"tapenoads.com":[51,107,113,114,11,115,116],"tokyocafe.org":[51],"watchfamilyguyonline.com":[51],"zitss.xyz":[51],"akatsuki-no-yona.com":[46],"banglachoti-story.com":[46],"dirtygangbangs.com":[46],"dumpz.net":[46],"erogarga.com":[46],"eroticteensphoto.net":[46],"fapset.com":[46],"freehdvideos.xxx":[46],"hentai-for.net":[46],"hentaila.com":[46],"hentaila.tv":[46],"hentaitube1.lol":[46],"hentaiyes.com":[46],"javcensored.net":[46],"javmilf.xyz":[46],"javmobile.net":[46],"javraveclub.com":[46],"komikstation.com":[46],"kropic.com":[46],"lovelynudez.com":[46,43,38],"mangadass.com":[46],"manhwaus.net":[46],"maturepornjungle.com":[46],"momxxx.video":[46],"nude-beach-tube.com":[46,61],"nude-teen-18.com":[46,43],"nyaatorrent.com":[46],"pervertium.com":[46],"porn-sexypics.com":[46],"pornissimo.org":[46,117],"pornken.com":[46],"pornmom.net":[46],"pornzone.com":[46],"redgay.net":[46],"saint.to":[46],"somulhergostosa.com":[46],"thematurexxx.com":[46],"viewmature.com":[46],"watchfreejavonline.co":[46],"xhamsterteen.com":[46],"xszav.club":[46],"amateurebonypics.com":[118],"desimmshd.com":[118,43],"frauporno.com":[118],"javideo.net":[118,119],"qqxnxx.com":[118],"subtaboo.com":[118],"zetporn.com":[120,42,121],"dojing.net":[108,97],"manhuatop.org":[108,122],"pandamovies.org":[108,11],"sharinghubs.com":[108],"spotidownloader.com":[108],"streamup.ws":[108,123,124,125,126],"transflix.net":[108,106],"justthegays.tv":[127],"mangayy.org":[127],"tunemovie.fun":[128],"fireflix.pages.dev":[129],"daemon-hentai.com":[130,131,122,132,133,134,81],"daemonanime.net":[130,135,136,137,138,122,139,140],"maturepussies.pro":[61,141],"xxxblowjob.pro":[61,141],"glamourxxx-online.com":[61,141],"sextubedot.com":[61,141],"bangyourwife.com":[43],"dawntube.com":[43],"exclusiveindianporn.com":[43],"freshbbw.com":[43],"collegeteentube.com":[42],"eroxia.com":[10],"flexyhit.com":[142,143],"ylink.bid":[142],"watchtrailerparkboys.com":[144],"keepv.id":[145,11],"pirlotv.mx":[145],"projectfreetv2.com":[145],"veryfastdownload.pw":[145,146],"123movies.net":[104],"canonprintersdrivers.com":[104],"ccnworldtech.com":[104],"gogoplay2.com":[104],"warezsite.net":[143,96],"hostxy.com":[147],"techrecur.com":[147],"drop.download":[148,123,136],"exee.app":[148,107],"vadbam.com":[149],"futemax.zip":[107],"mcrypto.club":[107],"moviestowatch.tv":[107],"playgo1.cc":[107],"tnhitsda.net":[107],"vadbam.net":[107],"crackstreamsfree.com":[123],"htsport.org":[123],"joyousplay.xyz":[123,150,115],"moviesapi.to":[123,151],"streamta.site":[123,152],"vcloud.lol":[123],"vidply.com":[123,153,154,155,44,11],"wmovies.xyz":[123],"mostream.us":[156],"anonmp4.help":[119],"g-streaming.com":[119,11],"play.playkrx18.site":[119],"dartsstreams.com":[112],"rugbystreams.me":[112],"rcostation.xyz":[151,157],"vidguardto.xyz":[158,11],"imgair.net":[159,160,161],"imgbvdf.sbs":[159,160,161],"mini.surveyenquete.net":[136],"virgo-horoscopes.com":[162],"4gousya.net":[98],"adnan-tech.com":[98],"anime-torrent.com":[98],"anodee.com":[98],"apkdink.com":[98],"asiansexdiarys.com":[98],"blog24.me":[98],"boxaoffrir.com":[98],"chachocool.com":[98],"chatgbt.one":[98],"cheese-cake.net":[98],"coingraph.us":[98],"demooh.com":[98],"downloadbatch.me":[98],"edjerba.com":[98],"ewybory.eu":[98,163],"fapfapgames.com":[98],"filmypoints.in":[98,164,165],"fitnesshealtharticles.com":[98],"funeralmemorialnews.com":[98],"funztv.com":[98],"girlydrop.com":[98],"goodriviu.com":[98],"harbigol.com":[98],"hostingreviews24.com":[98],"ikarianews.gr":[98],"inprogrammer.com":[98],"itdmusicy.com":[98],"itmaniatv.com":[98],"kacengeng.com":[98],"karaoke4download.com":[98],"lawweekcolorado.com":[98],"lebois-racing.com":[98],"leeapk.com":[98,166,167,168,169,170],"luciferdonghua.in":[98,171,172],"marketing-business-revenus-internet.fr":[98],"msonglyrics.com":[98,173],"mtech4you.com":[98],"mxpacgroup.com":[98],"myicloud.info":[98],"newscard24.com":[98],"officialpanda.com":[98],"stablediffusionxl.com":[98],"surgicaltechie.com":[98],"techedubyte.com":[98,174,175,176,177,178,179,180],"techprakash.com":[98],"tecnoscann.com":[98],"theprofoundreport.com":[98],"toorco.com":[98],"voidtruth.com":[98],"webcras.com":[98],"yakyufan-asobiba.com":[98],"bedavahesap.org":[181],"vipotv.com":[182],"hardwaretimes.com":[183],"eliobenedetto.it":[184],"livenewsof.com":[184,185],"photoshopvideotutorial.com":[184],"spa.center.ivof.com":[186],"comtasq.ca":[187,188],"sat.technology":[187,178],"cybermania.ws":[109,110],"kasvekuvvet.net":[189],"bethcakes.com":[22],"chaptercheats.com":[22],"gulflive.com":[22],"pauladeen.com":[22],"sneakernews.com":[22],"thenerdstash.com":[22,57,190],"11alive.com":[191],"2822news.com":[191],"daytonscw.com":[191],"everythinglubbock.com":[191],"firstcoastnews.com":[191],"gulfcoastcw.com":[191],"wgntv.com":[191],"wzzm13.com":[191],"christianheadlines.com":[192,193],"surf-forecast.com":[194,192],"cracked.com":[8],"melmagazine.com":[8],"nekrologi.net":[195],"goerie.com":[196],"greenbaypressgazette.com":[196],"lenconnect.com":[196],"lohud.com":[196],"norwichbulletin.com":[196],"mtv.com":[197],"maketecheasier.com":[198,199,13,57],"mlbpark.donga.com":[200,199],"femmeactuelle.fr":[201,202],"jeepgladiatorforum.com":[201,203],"jlwranglerforums.com":[201,203],"ranger6g.com":[201,203],"guitarplayer.com":[201,204],"realhomes.com":[201,204],"whattowatch.com":[201,204],"hometalkpaid.com":[205],"coolmathgames.com":[206,207,208,209,210,211,212,213],"barrheadnews.com":[214],"sport.pl":[201,215],"tips-and-tricks.co":[216,217],"hang.hu":[13],"mathplayzone.com":[13],"ranking.net":[13],"reptilesmagazine.com":[13],"syosetu.com":[13],"traicy.com":[13],"transparentnevada.com":[13],"wordhippo.com":[13],"young-machine.com":[13],"zagreb.info":[13],"dareda.net":[13],"doorblog.jp":[13],"gamejksokuhou.com":[13],"kijyomita.com":[13],"zakuzaku911.com":[13],"mrmakeithappen.com":[13,57],"beargoggleson.com":[218,219],"dairylandexpress.com":[218,219],"hailfloridahail.com":[218,219],"newcastleworld.com":[217],"radio-norge.org":[220],"radio-ua.com":[220],"radiosdelperu.pe":[220],"merkmal-biz.jp":[221],"fakt.pl":[222,223],"medonet.pl":[222],"plejada.pl":[222,223],"slickdeals.net":[224],"101dogbreeds.com":[67],"24bite.com":[67],"368chickens.com":[67],"aboutamom.com":[57],"abrotherabroad.com":[57],"adabofgluewilldo.com":[57],"adamantkitchen.com":[57],"adamtheautomator.com":[57],"adimesaved.com":[57],"alandacraft.com":[57],"alidaskitchen.com":[57],"allairfryerrecipes.com":[57],"allhomerobotics.com":[57],"alliecarte.com":[57],"allthingswithpurpose.com":[57],"altdriver.com":[57],"amiraspantry.com":[57],"amodernhomestead.com":[57],"amyinthekitchen.com":[57],"ana-white.com":[57],"animalnerdz.com":[57],"aquariustraveller.com":[57],"arrmaforum.com":[57],"athomewiththebarkers.com":[57],"atqa005.com":[57],"atshq.org":[57],"attractiondiary.com":[57],"ayurvedawithrebecca.com":[57],"bakedlean.com":[57],"baking4happiness.com":[57],"beatsperminuteonline.com":[57],"beautyandbedlam.com":[57],"beautytidbits.com":[57],"becomebetty.com":[57],"bikeexif.com":[57],"bootspy.com":[57],"braveryandbelonging.com":[57],"breederbest.com":[57],"brokenovenbaking.com":[57],"cakescottage.com":[57],"careercontessa.com":[57],"carrowaycrochet.com":[57],"centslessdeals.com":[57],"cinderstravels.com":[57],"citefast.com":[57],"classiccountrymusic.com":[57],"cockroachzone.com":[57],"codycrosssolutions.com":[57],"collective.world":[57],"combotarot.com":[57],"comfyliving.net":[57],"comicsands.com":[57],"confessionsofaserialdiyer.com":[57],"cookedandloved.com":[57],"cookerofdeliciousness.com":[57],"cookiesfordays.com":[57],"cowboyszone.com":[57],"cozycornercharm.com":[57],"crackberry.com":[57],"craftsbyamanda.com":[57],"crazymonkeygames.com":[57],"createprintables.com":[57],"creativehomekeeper.com":[57],"crochetncrafts.com":[57],"cruisersforum.com":[57],"cryptoprofitcalculator.com":[57],"crystaldigest.com":[57],"cycletraveloverload.com":[57],"dabblesandbabbles.com":[57],"deltiasgaming.com":[57],"desertislanddishes.co":[57],"dietmenus.com":[57],"dimitrasdishes.com":[57],"dimplesandtangles.com":[57],"dinnerthendessert.com":[57],"discovertheburgh.com":[57],"discussingfilm.net":[57],"dollopofdough.com":[57],"domestically-speaking.com":[57],"domesticheights.com":[57],"drivenbydecor.com":[57],"dubaitravelplanner.com":[57],"eatbetterrecipes.com":[67],"eatfigsnotpigs.com":[67],"eatthegains.com":[67],"ebicycles.com":[67],"enjoysharepoint.com":[67],"erinobrien.life":[67],"errorfixer.co":[67],"everydaythrifty.com":[67],"expeditionforum.com":[67],"familystylefood.com":[57],"feastingathome.com":[57],"feedgrump.com":[57],"feelgoodfoodie.net":[57],"financialpanther.com":[57],"findingtimetofly.com":[57],"foodbanjo.com":[57],"foodsharingvegan.com":[57],"forevertwentysomethings.com":[57],"forthefrills.com":[57],"fullofplants.com":[57],"funlearningforkids.com":[57],"gamingsmart.com":[57],"gardenersyards.com":[57],"gardenholic.com":[57],"gatorenvy.com":[57],"genxfinance.com":[57],"getbusygardening.com":[57],"ginabnutrition.com":[57],"gingerdivine.com":[57],"glutenfreeonashoestring.com":[57],"godownsize.com":[57],"goldrefiningforum.com":[57],"graceelkus.com":[57],"gracefullittlehoneybee.com":[57],"greatgrubdelicioustreats.com":[57],"greenesportszone.com":[57],"growagoodlife.com":[57],"grumpyrecipes.com":[57],"handsthatbless.com":[225],"happyhomefairy.com":[225],"hawaii-guide.com":[225],"healthygreenkitchen.com":[225],"heandsheeatclean.com":[225],"heatherchristo.com":[225],"heightcomparison.com":[225],"hertoolbelt.com":[225],"homeautomation.forum":[225],"homecookingadventure.com":[225],"homegrail.com":[225],"hometheaterreview.com":[225],"hotpankitchen.com":[225],"idownloadblog.com":[57],"iheartorganizing.com":[57],"imamother.com":[57],"inmamamaggieskitchen.com":[57],"intentionallyeat.com":[57],"intoxicatedonlife.com":[57],"ireadlabelsforyou.com":[57],"jamjarkitchen.com":[67],"jesshuff.com":[67],"jessicagavin.com":[67],"jototheworld.com":[67],"joyofmotioncrochet.com":[67],"kelseyinlondon.com":[67],"kitchenwhisperers.com":[67],"krogerkrazy.com":[67],"ladypeartree.com":[67],"largefamilytable.com":[67],"laurenmcbrideblog.com":[67],"leahingram.com":[67],"legiongolife.com":[67],"life-in-the-lofthouse.com":[67],"lifeyourway.net":[67],"littleworldofwhimsy.com":[67],"loveablelemons.com":[67],"lowcarbingamongfriends.com":[67],"lowkickmma.com":[67],"luxeluminous.com":[67],"madetobeamomma.com":[57],"mailboxlocate.com":[57],"mallorythedietitian.com":[57],"manhaircuts.com":[57],"manhattan-nest.com":[57],"mapleandthyme.com":[57],"marlameridith.com":[57],"martysmusings.net":[57],"math-salamanders.com":[57],"meladorascreations.com":[57],"metal-building-homes.com":[57],"michaelfairmantv.com":[57],"momlovesbest.com":[57],"mommafitlyndsey.com":[57],"mommyshomecooking.com":[57],"mrandmrshowe.com":[57],"mspoweruser.com":[57],"myminichefs.com":[57],"mysuburbankitchen.com":[57],"mysweetsavannah.com":[57],"mytastycurry.com":[57],"nedandmimi.com":[67],"nestingwithgrace.com":[67],"nickskitchen.com":[67],"nikkisplate.com":[67],"noracooks.com":[67],"nutritionfor.us":[67],"nutritiousdeliciousness.com":[67],"nyssaskitchen.com":[67],"offbeatwed.com":[67],"oilburners.net":[67],"oldest.org":[67],"onecreativemommy.com":[67],"orangebloods.com":[67],"ourhomemadeeasy.com":[67],"paleomg.com":[57],"parentingstronger.com":[57],"parentpreviews.com":[57],"pastrybysaloni.com":[57],"peanutbutterrunner.com":[57],"pickledplum.com":[57],"piratesandprincesses.net":[57],"pocus101.com":[57],"porsche-mania.com":[57],"practical-golf.com":[57],"pregnancyfoodchecker.com":[57],"premeditatedleftovers.com":[57],"prettyprudent.com":[57],"prodigygamers.com":[57],"productmint.com":[57],"properlyrooted.com":[57],"prudentpennypincher.com":[57],"puttingmetogether.com":[57],"puzzleseveryday.com":[57],"queersapphic.com":[67],"rabbitcaretips.com":[67],"ramforum.com":[67],"rebeccataig.com":[67],"recipeswithessentialoils.com":[67],"recipetineats.com":[67],"reheardle.com":[67],"retiredom.net":[67],"rmkshoes.com":[67],"rvlife.com":[67],"sawdustgirl.com":[57],"scratchandstitch.com":[57],"seahawks.net":[57],"selftattoo.com":[57],"shoutoutsocal.com":[57],"silkroadrecipes.com":[57],"simguided.com":[57],"simplehealthykitchen.com":[57],"simshomekitchen.com":[57],"singaporeanmalaysianrecipes.com":[57],"smartdoglover.com":[57],"sneakerfiles.com":[57],"snowest.com":[57],"soapoperadigest.com":[57],"societyofrock.com":[57],"soulsisterstravel.com":[57],"southernladymagazine.com":[57],"spatuladesserts.com":[57],"spiceupthecurry.com":[57],"spinachandbacon.com":[57],"stageagent.com":[57],"studio73designsnb.com":[57],"stylishcurves.com":[57],"sugarandcharm.com":[57],"suitsexpert.com":[57],"superwestsports.com":[57],"surfacetip.com":[57],"sweetteaandthyme.com":[57],"swgoh.gg":[57],"tampabayparenting.com":[57],"tarateaspoon.com":[57],"tbirdforum.com":[57],"tcdb.com":[57],"teaching2and3yearolds.com":[57],"textfixer.com":[57],"the-digital-picture.com":[57],"thecafesucrefarine.com":[57],"thecrafttrain.com":[57],"thedailyview.com":[57],"thedaringkitchen.com":[57],"thediyvillage.com":[57],"theeverylastdetail.com":[57],"thefilmbandit.com":[57],"thefpsreview.com":[57],"thegrapepursuit.com":[57],"theimpulsivebuy.com":[57],"themodestmomblog.com":[57],"thesassybarn.com":[57],"thestayathomechef.com":[57],"thetwobiteclub.com":[57],"thezag.com":[57],"thoughtcard.com":[57],"thoughtcatalog.com":[57],"tiaclara.com":[57],"timothyplivingston.com":[57],"tolstoytherapy.com":[57],"toolsofmen.com":[57],"topdogtips.com":[57],"toptreehouses.com":[57],"tortoiseforum.org":[57],"treasuredtips.com":[57],"treasurie.com":[57],"tuner.ninja":[57],"tuppennysfireplace.com":[57],"unixmen.com":[67],"urbantastebud.com":[67],"vincenzosplate.com":[67],"visitdowntownnashville.com":[67],"vivifytribe.com":[67],"voyagedenver.com":[67],"wandercooks.com":[67],"wanderlustingk.com":[67],"waternitylab.com":[67],"wendypolisi.com":[67],"windowsreport.com":[67],"word-crossy.com":[67],"yummiestfood.com":[67],"zenaskitchen.com":[67],"zestfulkitchen.com":[67],"123easy4me.com":[13],"3dshoots.com":[13],"6thgenram.com":[13],"acemanforum.com":[13],"adxtalk.com":[13],"applefitnessforum.com":[13],"arteonforums.com":[13],"basset.net":[13],"bcaquaria.com":[13],"buceesfans.com":[13],"buelltalk.com":[13],"buickevforum.com":[13],"canadianmoneyforum.com":[13],"cbr250.com":[13],"cbr250.net":[13],"deerhuntersclub.com":[13],"dodgedartforumz.com":[13],"ebikerforums.com":[13],"ex90forum.com":[13],"fjcforums.com":[13],"furyforums.com":[13],"grecaleforum.com":[13],"hardcoresledder.com":[13],"hornetowners.com":[13],"insterevforum.com":[13],"k900forum.com":[13],"kanyetothe.com":[13],"lakestclair.net":[13],"lexusrcowners.com":[13],"lucid-forum.com":[13],"metrisforum.com":[13],"motorcycletherapy.net":[13],"mudinmyblood.net":[13],"mx30forum.com":[13],"newbrunswickfishing.com":[13],"newcelica.org":[13],"nissan-navara.net":[13],"ohiosportsman.com":[13],"palisadeforum.com":[13],"pearforum.com":[13],"pigeons.biz":[13],"pioneerforums.com":[13],"preludeonline.com":[13],"r1200gs.info":[13],"r9riders.com":[13],"ramrebelforum.com":[13],"raptorforum.com":[13],"rinconriders.com":[13],"roadtripliving.com":[13],"rswarrior.com":[13],"rubiconownersforum.com":[13],"shootersforum.com":[13],"sparktalk.com":[13],"ssforums.com":[13],"stevesnovasite.com":[13],"stratolinerdeluxe.com":[13],"swedespeed.com":[13],"teryxhq.com":[13],"teslabottalk.com":[13],"titanxdforum.com":[13],"trailvoy.com":[13],"traverseforum.com":[13],"tsxclub.com":[13],"venuedrivers.com":[13],"vtcafe.com":[13],"vweosclub.com":[13],"worldseafishing.com":[13],"yariscrossclub.com":[13],"yourpatientvoice.com":[13],"z06vette.com":[13],"serial4.com":[226],"arena.gamesforthebrain.com":[227,228],"games.get.tv":[227,228],"games.modbee.com":[227,228],"games.puzzles.ca":[227,228],"kristiesoundsimply.com":[11,229,148,119],"luluvido.com":[11],"minecraft.buzz":[230],"kiaclub.cz":[231],"monte-carlo-lab.pages.dev":[232],"wrzesnia.info.pl":[233],"elamigosgamez.net":[234],"dizipal1546.com":[235],"dizipal1575.com":[235],"trgoals1537.xyz":[236],"inattv1278.xyz":[236],"inattv1280.xyz":[236],"inattv1300.xyz":[236],"inattv1327.xyz":[236],"vozer.io":[237],"vozer.vn":[237],"uploadking.net":[238],"lagacetadesalamanca.es":[239],"sms-anonyme.net":[240],"artesacro.org":[241],"theproxy.app":[11],"tricksplit.io":[80],"brawlhalla.fr":[242],"hypebeast.com":[243],"catholic.com":[244],"nulleb.com":[245],"4cash.me":[60,62],"weviral.org":[246],"dailygrindonline.net":[247],"thetoneking.com":[247],"livornotoday.it":[248],"veneziatoday.it":[248],"xdld.pages.dev":[249],"sikwap.xyz":[72,250],"amateur8.com":[251,252,253],"sunhope.it":[254],"textovisia.com":[255],"hotcleaner.com":[256],"charbelnemnom.com":[257],"rodude.com":[89],"hayamimi-gunpla.com":[136],"civilenggforall.com":[258],"nation.africa":[259],"demonoid.is":[260],"eductin.com":[91],"kelaam.com":[261],"tvshows4mobile.org":[262],"rincondelsazon.com":[263],"nylondolls.com":[43],"yifysub.net":[264],"rtilinks.com":[135],"moddedguru.com":[135],"toxicwap.us":[265],"riazor.org":[266],"sexgames.xxx":[267],"dirp.me":[268],"alluretube.com":[44],"suzihaza.com":[18],"rocklink.in":[62],"dev2qa.com":[269],"niftyfutures.org":[270],"noithatmyphu.vn":[178],"shortx.net":[48,62],"journaldemontreal.com":[271,272],"forsal.pl":[273],"teen-hd-sex.com":[70],"camvideoshub.com":[274],"nevcoins.club":[275],"rosasidan.ws":[138],"leaknud.com":[276],"course-downloader.com":[277],"rlxtech24h.com":[278],"sexjobs.es":[279],"laptechinfo.com":[91],"linkspy.cc":[280],"airsoftmilsimnews.com":[281],"theusaposts.com":[178],"woffxxx.com":[11],"ipacrack.com":[282,283,284],"proappapk.com":[285],"love4u.net":[286,11],"financialjuice.com":[287],"examword.com":[288],"worldofiptv.com":[91],"o2.pl":[289],"staige.tv":[290],"photooxy.com":[291],"aeroxplorer.com":[101],"hdrez.com":[292,293],"gametohkenranbu.sakuraweb.com":[294],"eska.pl":[295],"hentaibatch.com":[296],"faucetbravo.fun":[184],"merlininkazani.com":[297],"isekaipalace.com":[298],"moviesapi.club":[299,11,178,300],"solution-hub.com":[11],"exego.app":[62,301,302,223,303,304],"pureleaks.net":[305],"xanimu.com":[306,307],"cl1ca.com":[265,62],"newzjunky.com":[308],"tomarnarede.pt":[245],"cryptoclicks.net":[309],"apkprime.org":[310],"a-b-c-d-e-f9jeats0w5hf22jbbxcrpnq37qq6nbxjwypsy.fun":[11,311],"thehouseofportable.com":[312],"channel4.com":[313,314],"counterstrike-hack.leforum.eu":[315],"modcombo.com":[207],"civitai.red":[178],"civitai.com":[178],"civitai.green":[178],"custommapposter.com":[178],"jazbaat.in":[245],"tmailor.com":[316],"fiuxy2.co":[317],"nextdoor.com":[318,319,320],"vinstartheme.com":[178],"schoolgirls-asia.org":[72],"remixsearch.net":[321],"remixsearch.es":[321],"www.tiktok.com":[322],"spambox.xyz":[323],"webmaal.cfd":[324],"tennis.stream":[325],"givemesport.com":[326,178],"pocketnow.com":[326,178],"educ4m.com":[324],"pak-mcqs.net":[327],"zeeplayer.pages.dev":[328],"littlebigsnake.com":[329,330],"ruidrive.com":[331],"secondhandsongs.com":[332],"filmy4wap.uno":[11],"rubyvidhub.com":[97,333,334,119],"dfbplay.tv":[178],"cdn.tiesraides.lv":[335],"seahawks.com":[336],"wcoforever.net":[337,338],"rooter.gg":[339,340,341],"iplayerhls.com":[342],"mahajobwala.in":[343],"blog-dnz.com":[344],"dropzy.io":[11],"sport.es":[345],"zilla-xr.xyz":[11],"abyssplay.pages.dev":[122],"series9movies.com":[346,11],"stickers.gg":[181],"live4all.net":[347],"safeframe.googlesyndication.com":[348],"adultgamescollector.com":[11],"thelinuxcode.com":[349,350],"download.yasir252.com":[351,352],"rlxoff.com":[353],"javindosub.site":[354],"nobledicion.yoveo.xyz":[355],"bigbuttshubvideos.com":[356,345],"myperfectweather.com":[357],"windowsonarm.org":[271],"criticker.com":[358],"flexxporn.com":[359],"elperiodicoextremadura.com":[360],"embed4me.com":[361,122],"4meplayer.com":[122],"amindi.org":[362],"hdvideo9.com":[11],"meteolive.it":[181],"loudountimes.com":[363],"talksport.com":[364,365,366],"mtv.fi":[367],"elamigosgamez.com":[368],"seoschmiede.at":[369],"atalantini.online":[370],"moenime.com":[371],"youboxtv.com":[372],"alphatv.gr":[373],"brainzaps.tv":[122],"abcya.com":[374,375],"zxcprime.icu":[376,11],"printables.com":[377],"nosubapp.com":[378],"outlook.live.com":[379],"virtuavixen.com":[380,381],"babylinks.in":[382],"go.babylinks.in":[62],"admediaflex.com":[233,383],"pranarevitalize.com":[98,165],"shortencash.click":[384],"quins.us":[385,301],"krakenfiles.com":[11,386,302,387,388,389,390,391,371],"360news4u.net":[392],"theuser.cloud":[393],"fileguard.cc":[394],"gamedrive.org":[395],"chzzkban.xyz":[396],"pdftoshokan.com":[397,398,399],"flygbussarna.se":[400],"iogames.space":[401],"ridge.com":[402],"pl.vpnmentor.com":[403],"www.interia.pl":[404,405],"hdtvpolska.com":[406],"runners-world.pl":[407]};
const EXCEPT = {"uii.io":["noeval"],"pingit.com":["abort-on-property-read\u0001AaDetector","abort-on-property-read\u0001open","abort-on-property-read\u0001rmVideoPlay","abort-on-property-read\u0001_pop","abort-on-property-write\u0001Fingerprint2","set-constant\u0001blurred\u0001false"],"vr.pornhat.*":["abort-on-property-read\u0001document.dispatchEvent"],"vidsrc.*":["abort-current-script\u0001EventTarget.prototype.addEventListener\u0001delete window"],"astral.sh":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"brew.sh":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"christitus.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"community-scripts.org":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"datadoghq.*":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"deno.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"devaccellabs.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"jetbrains.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"massgrave.dev":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"natfrp.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"ntriver.org":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"reaclassical.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"runpane.com":["prevent-clipboard-write\u0001/^ms(hta|iexec)(\\.exe)? |^(bash <<<|curl -kfsSL) \\$\\(echo .+? base64 -d\\b|^cmd \\/c .*?\\bcurl .+?(\\.exe|\\.bat)\\b|^cmd .*?\\bfor \\/f .*?\\bdelims .*?\\bpow |(^|\\\\)powershell(\\.exe)? .*?-w(indowStyle)? h(idden)?\\b|(^|\\\\)powershell(\\.exe)? .*?-w[a-z]* m[a-z]* |(^|\\\\)powershell(\\.exe)? .*?-NoP\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? b(ypass)?\\b|(^|\\\\)powershell(\\.exe)? .*?-e(xecution)?p(olicy)? u(nrestricted)?\\b|(^|\\\\)powershell(\\.exe)? .*?\\biex\\(|(^|\\\\)powershell(\\.exe)? .*?Invoke-Expression|(^|\\\\)powershell.+?Invoke-WebRequest|(^|\\\\)powershell.+?-UseBasicParsing|^cmd .*?\\/c .+? -nop .+? iex\\b|^(cmd|powershell)\\b.+?recaptcha|^(cmd|powershell)\\b.+?#(Verification|     )|^(cmd|powershell)\\b.+?     #|^osascript .+?\\bcurl http|^curl -s\\b.+?\\| (bash|sh|zsh)\\b|^\\/bin\\/(bash|sh|zsh) -c\\b.+?\\bcurl|^bash -c\\b.+?\\$\\(curl|^python3? -c\\b.+?\\b(exec|urllib|subprocess)\\b|^echo .+?base64 .+?\\b(bash|osascript|z?sh)\\b|openssl base64 -d|^curl\\b .+?chmod \\+x.+?&&|^(bash|sh|osascript)\\b.+?recaptcha|^(bash|sh|osascript)\\b.+?#(Verification|     )|^(bash|sh|osascript)\\b.+?     #|^wget .+?\\| (bash|sh)\\b|^curl\\b.+?-o\\b.+?\\/tmp\\/.+?&&|^nc .+?-e \\/bin\\/(bash|sh)\\b|^\\/tmp\\/.+?chmod \\+x.+?&&|^wget -q.+?\\.(sh|py|bin|elf)\\b|^cmd .+?\\bcertutil .+?\\b(\\.exe|\\.bat)\\b|(^|\\\\)powershell(\\.exe)? .+?\\birm .+?\\.[a-z]+\\/.+?powershell|\\bpcalua(\\.exe)? .*?\\b(curl|powershell|saps|cmd)\\b|^cmd .+?\\bcmdkey .+?\\bschtasks|^Invoke-Command .+?Base64String|^c(onhost|md) .*?--headless |^iex\\(i(rm|wr) |^\\(?irm .+?\\biex\\b|^%COMSPEC% .*?\\bstart .*?\\/min\\b|^cmd .*?\\/c .*?%TEMP%.*?\\.bat\\b|^cmd .*?\\/c .*?\\bCMDCMDLINE\\b|^cmd \\/v:on \\/q \\/c |\\bconvert\\b.*?\\$env:ComSpec\\b|^<#Verification|^Invoke-WebRequest .+?\\bwscript(\\.exe)?\\b|^\\$url\\b.+?\\n\\$filename\\b.+?\\.exe\\b/msi\u0001domAlert\u0001Beware, uBlock Origin blocked a potential ClickFix attack: ${text}\u0001excludeMatches\u0001/Maintainer|Contributor|^\\{|^http|^(git|import|require|use) /i"],"bilibili.com":["json-prune-fetch-response\u0001data.item.[-].business_info.ad_desc\u0001\u0001/feed/rcmd"],"titulky.com":["set-constant\u0001xmxalr"],"idnes.cz":["abort-current-script\u0001HTMLIFrameElement.prototype.contentWindow"],"notube.com":["prevent-window-open"],"oxy.edu":["abort-current-script\u0001$\u0001window.open","prevent-setInterval\u0001.hide","abort-current-script\u0001$\u0001localStorage"],"money.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad","set-constant\u0001Object.prototype.rekids\u0001undefined","set-constant\u0001Object.prototype.gafSlot\u0001undefined","set-constant\u0001Object.prototype.advViewability\u0001undefined"],"kobieta.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"gadzetomania.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"fotoblogia.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"komorkomania.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wiadomosci.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"tech.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"dom.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"facet.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"film.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"finanse.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"gry.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"gwiazdy.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"ksiazki.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"kuchnia.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"moto.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"opinie.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"pogoda.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"teleshow.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"turystyka.wp.pl":["prevent-setTimeout\u0001detected\u0001300"],"wideo.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wawalove.wp.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"autokult.pl":["prevent-setTimeout\u0001detected\u0001300","abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"horoskop.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"tv.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"twojeip.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"sportowefakty.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","set-constant\u0001Object.prototype.loadBunch\u0001noopFunc","abort-on-property-read\u0001Object.prototype.bodyCode","abort-on-property-read\u0001WP.inline"],"fitness.wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad"],"wp.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","abort-on-property-read\u0001WP.inline","prevent-setTimeout\u0001/getComputedStyle[\\s\\S]*?style\\.display=\"none\"[\\s\\S]*?styleBlocked[\\s\\S]*?detected/"],"www.wp.pl":["abort-on-property-read\u0001__headpayload","abort-on-stack-trace\u0001WP\u0001r https","set-constant\u0001WP.gaf.loadBunch\u0001noopFunc"],"southpark.*":["google-ima"],"southpark.cc.com":["google-ima"],"southparkstudios.*":["google-ima"],"games.dailymail.co.uk":["abort-on-property-read\u0001Notification"],"games.dailymail.com":["abort-on-property-read\u0001Notification"],"platform.twitter.com":["json-prune-xhr-response\u0001data.home.home_timeline_urt.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/Home","json-prune-xhr-response\u0001data.search_by_raw_query.search_timeline.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/SearchTimeline","json-prune-xhr-response\u0001data.threaded_conversation_with_injections_v2.instructions.[].entries.[-].content.items.[].item.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/TweetDetail","json-prune-xhr-response\u0001data.user.result.timeline_v2.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/UserTweets","json-prune-xhr-response\u0001data.immersiveMedia.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata\u0001\u0001propsToMatch\u0001url:/ImmersiveMedia"],"filmweb.pl":["abort-current-script\u0001decodeURIComponent\u0001newAdblockBoardDisplayed"],"linkneverdie.net":["prevent-setTimeout\u0001t"],"dziennik.pl":["abort-current-script\u0001parseInt\u0001adblock"],"gunauc.net":["prevent-fetch\u0001pagead2.googlesyndication.com"],"daddylive.link":["abort-on-property-read\u0001require"],"player.pl":["json-prune\u0001movie.advertising.ad_server"],"lookmovie.studio":["set-constant\u0001Yii2App.playbackTimeout\u00010"],"jobzhub.store":["trusted-replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"fitdynamos.com":["trusted-replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"labgame.io":["trusted-replace-node-text\u0001script\u0001/initialTimeSeconds = \\d+/\u0001initialTimeSeconds = 7","adjust-setInterval\u0001tid\u0001*\u00010.02"],"sayphotobooth.com":["adjust-setInterval\u0001tp-time\u0001*\u00010.001"],"encurtador.postazap.com":["adjust-setInterval\u0001timer\u0001*\u00010.001"],"intercelestial.com":["adjust-setTimeout\u0001\u0001*\u00010.1"],"hubdrive.com":["prevent-window-open","prevent-addEventListener\u0001\u0001history.go"],"hubdrive.de":["prevent-window-open","prevent-addEventListener\u0001\u0001history.go"],"dziennikbaltycki.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dzienniklodzki.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dziennikpolski24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"dziennikzachodni.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"echodnia.eu":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"expressbydgoski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"expressilustrowany.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetakrakowska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetalubuska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gazetawroclawska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gk24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gloswielkopolski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gol24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gp24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gra.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"gs24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"kurierlubelski.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"motofakty.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"naszemiasto.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nowiny24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nowosci.com.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"nto.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"polskatimes.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"pomorska.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"poranny.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"sportowy24.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"strefaagro.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"strefabiznesu.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"stronakobiet.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"telemagazyn.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"to.com.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"wspolczesna.pl":["set-constant\u0001pp_adblock_is_off\u0001trueFunc"],"abczdrowie.pl":["abort-on-stack-trace\u0001WP.prebid\u0001onLoad","prevent-setTimeout\u0001visibility\u00010"],"job.mt.de":["prevent-setTimeout\u0001.call(null)\u000110"],"job.nw.de":["prevent-setTimeout\u0001.call(null)\u000110"],"uqload.co":["abort-current-script\u0001document.createElement\u0001break;case $."],"yandex.*":["abort-on-property-read\u0001Object.prototype.renderDirect):matches-path(/\\/(?:weather\\/|pogoda\\/|hava\\/)/"],"pilot.wp.pl":["abort-on-property-read\u0001WP.inline"],"poczta.wp.pl":["abort-on-property-read\u0001WP.inline"],"open.fm":["set-constant\u0001Object.prototype.gafSlot\u0001undefined"],"dobreprogramy.pl":["abort-on-property-read\u0001wp_consent_color"]};
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
runForHost(CALLS, HOSTS, EXCEPT);
})();
