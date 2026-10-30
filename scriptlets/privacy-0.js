/* Apex AdBlocker – scriptlety listy "Śledzenie i prywatność" (część 1/1). Plik generowany przez tools/build.mjs. */
(function () {
'use strict';

const installedKey = Symbol.for('ApexAdBlocker.scriptletShards.v1');
let installed = globalThis[installedKey];
if (!installed) {
  installed = new Set();
  Object.defineProperty(globalThis, installedKey, { value: installed, writable: false, configurable: false });
}
const shardKey = "scriptlets/privacy-0.js:5fbd7e06fb2a6fef582ac2f7835777e12d28309d529d69ef1d4dda4f7c728259";
if (installed.has(shardKey)) return;
installed.add(shardKey);
const CALLS = [["set-constant","Navigator.prototype.globalPrivacyControl","false"],["set-constant","navigator.globalPrivacyControl","false"],["remove-cookie","dns_cookie"],["remove-cookie","/sc_anonymous_id|sc_tracking_anonymous_id/","when","scroll keydown"],["set-local-storage-item","/sc_tracking_anonymous_id|statsig/","$remove$"],["abort-current-script","document.getElementsByTagName",".pubads"],["set-cookie","GPC","1","","reload","1"],["set-local-storage-item","browser-ids","$remove$"],["prevent-xhr","/i/api/1.1/flow/viewer.json"],["prevent-xhr","/i/api/1.1/flow/timeline.json"],["prevent-xhr","/i/api/1.1/graphql/viewer_context.json"],["abort-current-script","document.getElementsByTagName","gtm.js"],["set-constant","_hjSettings","undefined"],["set-constant","google_tag_manager","undefined"],["abort-current-script","document.createElement","__apNoHold"],["abort-current-script","document.createElement","admiral"],["remove-node-text","script","\"data-adm-url\""],["remove-node-text","script","\"v4ac1eiZr0\""],["remove-node-text","script","admiral"],["set-constant","admiral","noopFunc"],["prevent-setInterval","blogherads"],["remove-cookie","/articlesRead|previousPage/"],["json-prune","dataLayer.trackingId user.trackingId"],["set-session-storage-item","nxt_is_incognito","false"],["json-edit","..props.children.*[?.key==\"admiral-script\"]"],["remove-cookie","fly_vid","when","scroll keydown"],["set-local-storage-item","/fmscw_resp|intercom/","$remove$"],["set-session-storage-item","CBSNEWS.features.fms-params","$remove$"],["remove-cookie","/^blaize_/","when","scroll keydown"],["set-constant","gnt.x.adm"],["set-local-storage-item","fdx_enable_new_detail_page","true"],["abort-current-script","document.createElement","keen-tracking"],["prevent-fetch","stella"],["prevent-xhr","stella"],["remove-node-text","script","NREUM"],["set-local-storage-item","plausible_ignore","true"],["set-constant","ncbi.sg","{}"],["set-constant","ncbi.sg.ping","noopFunc"],["set-constant","OfflineAudioContext","undefined"],["set-constant","navigator.bluetooth","undefined"],["prevent-addEventListener","mouseup","sendClickEvent"],["json-prune","data.*.elements.edges.[].node.outboundLink"],["json-prune","data.children.[].data.outbound_link"],["prevent-xhr","method:POST url:/logImpressions"],["abort-current-script","document.createElement",".js"],["abort-on-property-read","_oEa"],["abort-current-script","document.createElement","script"],["abort-on-property-write","ADMITAD"],["prevent-fetch","body:browser"],["remove-node-text","script","/^Function\\(\\\"/"],["remove-node-text","script","/join\\(\\'\\'\\)/"],["remove-node-text","script","/join\\(\\\"\\\"\\)/"],["remove-node-text","script","api.dataunlocker.com"],["set-local-storage-item","adshield-analytics-uuid","$remove$"],["set-local-storage-item","/_fa_bGFzdF9iZmFfYXQ=$/","$remove$"],["set-local-storage-item","/_fa_dXVpZA==$/","$remove$"],["set-local-storage-item","/_fa_Y2FjaGVfaXNfYmxvY2tpbmdfYWNjZXB0YWJsZV9hZHM=$/","$remove$"],["set-local-storage-item","/_fa_Y2FjaGVfaXNfYmxvY2tpbmdfYWRz$/","$remove$"],["set-local-storage-item","/_fa_Y2FjaGVfYWRibG9ja19jaXJjdW12ZW50X3Njb3Jl$/","$remove$"],["prevent-setTimeout","error-report.com"],["remove-node-text","script","error-report.com"],["noeval-if","/07c225f3\\.online|content-loader\\.com|css-load\\.com|html-load\\.com/"],["remove-node-text","script","KCgpPT57bGV0IGU"],["set-constant","bmak.js_post","false"],["prevent-xhr","method:POST"],["abort-on-property-read","dataLayer"],["prevent-xhr","utreon.com/pl/api/event method:POST"],["prevent-xhr","log-sdk.ksapisrv.com/rest/wd/common/log/collect method:POST"],["remove-cookie","_ALGOLIA","when","scroll keydown"],["set-local-storage-item","segmentDeviceId","$remove$"],["set-constant","firebase.analytics","noopFunc"],["json-prune","require.0.3.0.__bbox.define.[].2.is_linkshim_supported"],["set-local-storage-item","/^rt_/","$remove$"],["prevent-addEventListener","","/(ping|score)Url"],["set-constant","Object.prototype.updateModifiedCommerceUrl","noopFunc"],["prevent-addEventListener","","redirect"],["prevent-xhr","fingerprintjs-pro-react"],["remove-cookie","realm.cookiesAndJavascript"],["set-constant","flashvars.event_reporting"],["remove-cookie","kt_qparams"],["remove-cookie","kt_referer"],["remove-cookie","kt_ips"],["remove-cookie","vmidv1"],["set-local-storage-item","csg_uid","$remove$"],["remove-cookie","akaclientip"],["remove-cookie","hive_geoloc"],["remove-cookie","MicrosoftApplicationsTelemetryDeviceId","when","scroll keydown"],["trusted-set-cookie","MicrosoftApplicationsTelemetryDeviceId","","0"],["remove-cookie","MicrosoftApplicationsTelemetryFirstLaunchTime"],["set-cookie","Geo","OK"],["set-cookie","bitmovin_analytics_uuid","OK"],["set-constant","Object.prototype.has_opted_out_tracking","trueFunc"],["remove-cookie","_boundless_tracking_id"],["remove-cookie","/LithiumVisitor|ValueSurveyVisitorCount|VISITOR_BEACON/"],["remove-cookie","/^(_pc|cX_)/","when","scroll keydown"],["remove-cookie","/^AMCVS?_/"],["remove-cookie","/_pcid|_pctx|amp_|cX|incap/","when","scroll keydown"],["set-local-storage-item","/amplitude|lastUtms|gaAccount|cX|_ls_ttl/","$remove$"],["set-session-storage-item","_cX_S","$remove$"],["set-local-storage-item","/^(pe-|sndp-laneitem-impressions)/","$remove$"],["remove-cookie","disqus_unique","when","scroll keydown"],["trusted-set-cookie","disqus_unique","0","","","domain","disqus.com"],["remove-cookie","/_shopify_(y|sa_)/","when","scroll keydown"],["trusted-set-cookie","_sharedid","","0","","domain",".naszemiasto.pl"],["remove-cookie","/ana_client_session_id|wshh_uid/"],["remove-cookie","/^(ev|vocuser)_/","when","scroll keydown"],["remove-cookie","gtagSessionId"],["set-local-storage-item","uuid","$remove$"],["remove-cookie","/^_pubcid|sbgtvNonce|SUID/"],["set-local-storage-item","/^uw-/","$remove$"],["remove-cookie","ajs_anonymous_id","when","scroll keydown"],["prevent-xhr","/eventhub\\.\\w+\\.miro\\.com\\/api\\/stream/"],["remove-cookie","/_HFID|mosb/"],["remove-cookie","/ppid$/"],["remove-cookie","/ph_phc|remark_lead/","when","scroll keydown"],["set-local-storage-item","remark_lead","$remove$"],["set-session-storage-item","/^ph_phc/","$remove$"],["remove-cookie","/incap_|s_fid/","when","scroll keydown"],["remove-cookie","/^_pubcid/","when","scroll keydown"],["set-local-storage-item","youbora.youboraDeviceUUID","$remove$"],["remove-cookie","anonymous_user_id"],["remove-cookie","rdsTracking","when","scroll keydown"],["set-local-storage-item","bp-analytics","$remove$"],["remove-cookie","/^\\.(b|s|xp|ub\\.)id/","when","scroll keydown"],["remove-cookie","/^ig-|ph_phc_/","when","scroll keydown"],["set-local-storage-item","/^ph_phc_/","$remove$"],["set-session-storage-item","/^ph_phc_/","$remove$"],["remove-cookie","X-XAct-ID"],["remove-cookie","/^fosp_|orig_aid/"],["set-local-storage-item","/^fosp_|orig_aid/","$remove$"],["set-local-storage-item","/^recommendation_uuid/","$remove$"],["set-local-storage-item","optimizely-vuid","$remove$"],["trusted-set-cookie","fw_se","","0","","domain",".hpplus.jp"],["trusted-set-cookie","fw_uid","","0","","domain",".hpplus.jp"],["set-local-storage-item","/^fw_/","$remove$"],["remove-cookie","dvid","when","scroll keydown"],["set-local-storage-item","marketingCloudVisitorID","$remove$"],["set-local-storage-item","PERSONAL_FLIGHT_emperiaResponse","$remove$"],["remove-cookie","device_id"],["prevent-xhr","s73cloud.com/metrics/"],["remove-cookie","kim-tracker-uid"],["remove-cookie","/swym-|yotpo_/","when","scroll keydown"],["set-local-storage-item","/^boostSD/","$remove$"],["remove-cookie","/bitmovin_analytics_uuid|sbgtvNonce|SUID/","when","scroll keydown"],["set-local-storage-item","/sales-ninja|snj/","$remove$"],["set-local-storage-item","etx-settings","$remove$"],["set-local-storage-item","/__anon_id|browserId/","$remove$"],["remove-cookie","/_pk_id|hk01_annonymous_id/","when","scroll keydown"],["remove-cookie","ga_store_user_id"],["remove-cookie","/^_pk_id./","when","scroll keydown"],["remove-cookie","/_sharedid|_lc2_fpi/"],["set-local-storage-item","/_li_duid|_lc2_fpi/","$remove$"],["set-constant","process","{}"],["set-constant","process.env","{}"],["remove-cookie","/__ta_|_shopify_y/","when","scroll keydown"],["remove-cookie","_pkc","when","scroll keydown"],["trusted-set-cookie","trk","","0","","domain",".4game.com"],["set-local-storage-item","/fingerprint|trackingEvents/","$remove$"],["trusted-set-cookie","trk","","0","","domain",".4game.ru"],["remove-cookie","/sstk_anonymous_id|htjs_anonymous_id/","when","scroll keydown"],["set-local-storage-item","/htjs_|stck_|statsig/","$remove$"],["set-local-storage-item","/mixpanel/","$remove$"],["trusted-set-cookie","inudid","","0","","domain",".investing.com"],["trusted-set-cookie","udid","","0","","domain",".investing.com"],["trusted-set-cookie","smd","","0","","domain",".investing.com"],["trusted-set-cookie","attribution_user_id","","0","","domain",".typeform.com"],["set-local-storage-item","ld:$anonUserId","$remove$"],["set-local-storage-item","/_user_id$/","$remove$"],["set-local-storage-item","uw-uid","$remove$"],["set-local-storage-item","RC_PLAYER_USER_ID","$remove$"],["remove-cookie","_shopify_y","when","scroll keydown"],["set-local-storage-item","/lc_anon_user_id|_constructorio_search_client_id/","$remove$"],["remove-cookie","/^_sp_id/","when","scroll keydown"],["set-local-storage-item","/builderVisitorId|snowplowOutQueue_cf/","$remove$"],["remove-cookie","bunsar_visitor_id","when","scroll keydown"],["set-local-storage-item","/__anon_id|efl-uuid/","$remove$"],["set-local-storage-item","_gal1","$remove$"],["prevent-xhr","/VisitorAPI|AppMeasurement/"],["set-constant","Visitor","{}"],["prevent-xhr","analytics/bulk-pixel"],["set-local-storage-item","IIElevenLabsDubbingResult","$remove$"],["remove-node-text","script","vglnk"],["prevent-fetch","eventing"],["trusted-replace-fetch-response","/#rcmrclid=[a-zA-Z0-9]+/g","","rcm.rambler.ru"],["remove-cookie","ahoy_visitor"],["remove-cookie","ahoy_visit"],["remove-cookie","/_alooma/"],["prevent-fetch","method:POST body:zaraz"],["remove-attr","onclick|oncontextmenu|onmouseover","a[href][onclick*=\"this.href\"]","stay"],["prevent-xhr","cmp.inmobi.com/geoip"],["trusted-set-cookie","_sharedid","","0","","domain",".mirror.co.uk"],["remove-cookie","/_vf|mantisid|pbjs_/"],["set-local-storage-item","/_analytics|ppid/","$remove$"],["prevent-xhr","method:POST url:pfanalytics.bentasker.co.uk"],["prevent-xhr","discord.com/api/v9/science"],["remove-cookie","/^DEVICEFP/"],["trusted-set-cookie","DEVICEFP","00000000000","","","domain",".hoyoverse.com"],["trusted-set-cookie","DEVICEFP_SEED_ID","","0","","domain",".hoyoverse.com"],["trusted-set-cookie","DEVICEFP_SEED_TIME","","0","","domain",".hoyoverse.com"],["trusted-set-cookie","DEVICEFP","00000000000","","","domain",".hoyolab.com"],["trusted-set-cookie","DEVICEFP_SEED_ID","","0","","domain",".hoyolab.com"],["trusted-set-cookie","DEVICEFP_SEED_TIME","","0","","domain",".hoyolab.com"],["set-local-storage-item","APMPLUS1000165","$remove$"],["remove-cookie","/^_pk_/"],["remove-attr","onclick","a[onclick=\"fire_download_click_tracking();\"]","complete"],["remove-cookie","_pc_private"],["remove-node-text","script","/detect|FingerprintJS/"],["remove-cookie","_vid_t"],["set-local-storage-item","/^_vid_(lr|t)$/","$remove$"],["remove-cookie","/^(_tccl_|_scc_session|fpfid)/"],["set-local-storage-item","/adthrive|ccuid|at_sticky_data|geo-location|OPTABLE_/","$remove$"],["set-session-storage-item","/previous/","$remove$"],["set-constant","adthrive._components.start","noopFunc"],["set-local-storage-item","/cnc_alien_invasion_code|pixelsLastFired/","$remove$"],["prevent-fetch","method:POST body:/content_view|impression|page_view/"],["set-local-storage-item","/^avoinspector/","$remove$"],["remove-cookie","/^AMP_/"],["set-session-storage-item","VR-INJECTOR-INSTANCES-MAP","$remove$"],["remove-cookie","/_shopify_y|yotpo_pixel/","when","scroll keydown"],["abort-on-property-write","ftr__startScriptLoad"],["set-constant","data","true"],["prevent-fetch","url:/undefined method:POST"],["remove-cookie","/cX_P|_pc/"],["set-local-storage-item","/^_cX_/","$remove$"],["set-constant","linkfire.tracking","{}"],["prevent-fetch","method:POST body:/pageview|engagement/"],["prevent-xhr","body:pageview method:POST"],["prevent-xhr","svc.webex.com/metrics"],["prevent-fetch","faro.civitai.com"],["prevent-xhr","method:POST body:/\"track\"|adblock/"],["prevent-fetch","method:POST body:tracker"],["abort-on-property-write","decodeURIComponent"],["abort-on-property-read","WebAssembly"],["abort-on-property-read","miner"],["nowebrtc"],["prevent-xhr","/(trace|beacon)\\.qq\\.com/"],["prevent-fetch","splunkcloud.com/services/collector"],["prevent-fetch","event-router.olympics.com"],["prevent-fetch","hostingcloud.racing"],["prevent-fetch","tvid.in/log/"],["prevent-xhr","excess.duolingo.com/batch"],["prevent-xhr","/eventLog.ajax"],["prevent-xhr","t.wayfair.com/b.php?"],["set-constant","navigator.sendBeacon","noopFunc"],["prevent-fetch","segment.io"],["prevent-fetch","mparticle.com"],["prevent-xhr","ceros.com/a?data"],["prevent-fetch","pluto.smallpdf.com"],["prevent-fetch","method:/post/i url:/\\/\\/chatgpt\\.com\\/ces\\/v1\\/[a-z]$/"],["prevent-fetch","method:/post/i url:ab.chatgpt.com/v1/rgstr"],["prevent-fetch","method:HEAD"],["prevent-fetch","logs.netflix.com"],["remove-node-text","script","sendFakeRequest"],["prevent-setInterval","fetch"],["prevent-setInterval","location.reload"],["remove-node-text","script","loadTaboola"],["prevent-xhr","igniteseurope.com/stats/"],["prevent-setTimeout","_startBeaconSending"],["prevent-fetch","litix.io"],["prevent-xhr","/hpyjmp|marzaent/"],["prevent-fetch","/hpyjmp|marzaent/"],["prevent-xhr","brightline.tv"]];
const HOSTS = {"accuweather.com":[0,1],"acmemarkets.com":[0,1],"aiskillsnavigator.microsoft.com":[0,1],"boston.com":[0,1],"capezio.com":[0,1],"chime.com":[0,1],"costco.com":[0,1],"crunchyroll.com":[0,1],"deezer.com":[0,1],"delta.com":[0,1],"dnb.co.uk":[0,1],"dnb.com":[0,1],"dollargeneral.com":[0,1],"engadget.com":[0,1],"espn.com":[0,1],"eventbrite.com":[0,1],"filson.com":[0,1],"flyfrontier.com":[0,1],"formula1.com":[0,1],"geizhals.de":[0,1],"gladiatorgarageworks.com":[0,1],"harborfreight.com":[0,1],"hopwtr.com":[0,1],"jdsports.com":[0,1],"kkrt.com":[0,1],"lenscrafters.com":[0,1],"livewithkellyandmark.com":[0,1],"madewell.com":[0,1,2],"mail.yahoo.com":[0,1],"mazdausa.com":[0,1],"michaels.com":[0,1],"milesplit.live":[0,1],"monsterenergy.com":[0,1],"newyorker.com":[0,1],"norton.com":[0,1],"pandora.com":[0,1],"payment.nba.com":[0,1],"porsche.com":[0,1],"qobuz.com":[0,1],"rivals.com":[0,1],"soundcloud.com":[0,1,3,4],"spotify.com":[0,1],"subway.com":[0,1],"techcrunch.com":[0,1,5],"tidal.com":[0,1],"tirerack.com":[0,1],"twitter.com":[0,1],"uber.com":[0,1],"ubereats.com":[0,1],"usaa.com":[0,1,6],"vimeo.com":[0,1],"visible.com":[0,1,7],"weather.com":[0,1,5],"wunderground.com":[0,1],"www.yahoo.com":[0,1],"x.com":[0,1,8,9,10],"bolighub.dk":[11,12,13],"iphoneincanada.ca":[14],"247sports.com":[15,16],"al.com":[15,5,17],"arstechnica.com":[15],"bringmethenews.com":[15],"cattime.com":[15,17],"cbr.com":[15,17],"cheatsheet.com":[15,18],"collider.com":[15,17],"comingsoon.net":[15,17],"crooksandliars.com":[15,5],"cwtv.com":[15],"dogtime.com":[15,17],"esportstales.com":[15],"forums.hfboards.com":[15],"freep.com":[15],"fresnobee.com":[15],"gamerant.com":[15,17],"gbatemp.net":[15,19],"golfdigest.com":[15,5],"grabify.link":[15],"hancinema.net":[15],"hemmings.com":[15],"howtogeek.com":[15,17],"ijr.com":[15],"informazionefiscale.it":[15],"inquirer.net":[15],"insider-gaming.com":[15,17],"knowyourmeme.com":[15,20],"magesypro.pro":[15],"makeuseof.com":[15,17,21],"mlive.com":[15,5,17],"money.it":[15],"motorbiscuit.com":[15],"movieweb.com":[15,17,21],"nationalreview.com":[15,17],"nbcnews.com":[15],"neopets.com":[15],"nofilmschool.com":[15],"nypost.com":[15,16,22],"omg.blog":[15],"order-order.com":[15],"oregonlive.com":[15,5],"pcwelt.de":[15,18],"pennlive.com":[15,16,17],"playstationlifestyle.net":[15],"pwinsider.com":[15,18],"savvytime.com":[15],"screenrant.com":[15,17],"siliconera.com":[15],"simpleflying.com":[15,17],"sporcle.com":[15],"stealthoptional.com":[15],"techlicious.com":[15],"technicpack.net":[15],"thedraftnetwork.com":[15],"thefashionspot.com":[15,17],"thegamer.com":[15,17],"thelayoff.com":[15],"thenerdstash.com":[15],"theprovince.com":[15],"titantv.com":[15],"topspeed.com":[15,17],"twinfinite.net":[15,5],"videogamer.com":[15],"webmail.wiki":[15],"wnd.com":[15],"worldpopulationreview.com":[15],"wral.com":[15],"wrestlezone.com":[15],"wrestlinginc.com":[15],"xda-developers.com":[15,21],"10tv.com":[5],"11alive.com":[5],"12news.com":[5],"12newsnow.com":[5],"13newsnow.com":[5],"13wmaz.com":[5],"5newsonline.com":[5],"9news.com":[5],"abc10.com":[5],"aol.com":[5],"apnews.com":[5],"artforum.com":[5,17],"artnews.com":[5,17],"billboard.com":[5],"birdsandblooms.com":[5],"calgaryherald.com":[5],"calgarysun.com":[5],"cbs19.tv":[5],"cbs8.com":[5],"cleveland.com":[5],"deadline.com":[5],"dpreview.com":[5],"driving.ca":[5],"edmontonjournal.com":[5],"edmontonsun.com":[5],"familyhandyman.com":[5],"financialpost.com":[5],"firstcoastnews.com":[5],"fox43.com":[5],"fox61.com":[5],"futbin.com":[5],"goldderby.com":[5],"gulflive.com":[5,17],"hollywoodreporter.com":[5],"indiewire.com":[5,16],"kare11.com":[5],"kcentv.com":[5],"kens5.com":[5],"kgw.com":[5],"khou.com":[5],"kiiitv.com":[5],"king5.com":[5],"komonews.com":[5],"krem.com":[5],"ktvb.com":[5],"kvue.com":[5],"lehighvalleylive.com":[5,17],"lfpress.com":[5],"localmemphis.com":[5],"masslive.com":[5],"myfoxzone.com":[5],"nationalpost.com":[5],"nbcsports.com":[5],"news.com.au":[5],"newscentermaine.com":[5],"newswest9.com":[5],"nj.com":[5,17],"nydailynews.com":[5,23],"ottawacitizen.com":[5],"ottawasun.com":[5],"rd.com":[5],"robbreport.com":[5,17],"rollingstone.com":[5],"sherdog.com":[5,17],"sidereel.com":[5,17],"superherohype.com":[5,17],"syracuse.com":[5],"tasteofhome.com":[5],"thehealthy.com":[5],"thv11.com":[5],"torontosun.com":[5],"vancouversun.com":[5],"variety.com":[5],"vibe.com":[5],"wbir.com":[5],"wcnc.com":[5],"weareiowa.com":[5],"wfaa.com":[5],"wfmynews2.com":[5],"wgrz.com":[5],"whas11.com":[5],"windsorstar.com":[5],"wkyc.com":[5],"wltx.com":[5],"wnep.com":[5],"wqad.com":[5],"wthr.com":[5],"wtol.com":[5],"wtsp.com":[5],"wusa9.com":[5],"wwd.com":[5],"wwltv.com":[5],"wzzm13.com":[5],"mensjournal.com":[24],"cbsnews.com":[16,25,26,27],"cbssports.com":[16,19],"pagesix.com":[16,17,22,28],"abc17news.com":[17],"awkward.com":[17],"awkwardmom.com":[17],"bailiwickexpress.com":[17],"barnsleychronicle.com":[17],"becomingpeculiar.com":[17],"bethcakes.com":[17],"blogher.com":[17],"bluegraygal.com":[17],"briefeguru.de":[17],"carmagazine.co.uk":[17],"chaptercheats.com":[17],"commercialobserver.com":[17],"competentedigitale.ro":[17],"crafty.house":[17],"dailyvoice.com":[17],"decider.com":[17],"didyouknowfacts.com":[17],"dualshockers.com":[17],"dustyoldthing.com":[17],"faithhub.net":[17],"femestella.com":[17],"footwearnews.com":[17],"freeconvert.com":[17],"frogsandsnailsandpuppydogtail.com":[17],"fsm-media.com":[17],"funtasticlife.com":[17],"fwmadebycarli.com":[17],"gfinityesports.com":[17],"givemesport.com":[17],"helloflo.com":[17],"homeglowdesign.com":[17],"honeygirlsworld.com":[17],"hotcars.com":[17],"insurancejournal.com":[17],"jasminemaria.com":[17],"kion546.com":[17],"lettyskitchen.com":[17],"lifeinleggings.com":[17],"liveandletsfly.com":[17],"lizzieinlace.com":[17],"localnews8.com":[17],"lonestarlive.com":[17],"madeeveryday.com":[17],"maidenhead-advertiser.co.uk":[17],"mardomreport.net":[17],"melangery.com":[17],"milestomemories.com":[17],"modernmom.com":[17],"momtastic.com":[17],"mostlymorgan.com":[17],"motherwellmag.com":[17],"muddybootsanddiamonds.com":[17],"musicfeeds.com.au":[17],"nordot.app":[17],"nothingbutnewcastle.com":[17],"nsjonline.com":[17],"oakvillenews.org":[17],"observer.com":[17],"pinkonthecheek.com":[17],"predic.ro":[17],"puckermom.com":[17],"qtoptens.com":[17],"realgm.com":[17],"royalmailchat.co.uk":[17],"samchui.com":[17],"sandrarose.com":[17],"sheknows.com":[17],"sloughexpress.co.uk":[17],"spacenews.com":[17],"sportsgamblingpodcast.com":[17],"spotofteadesigns.com":[17],"ssnewstelegram.com":[17],"stacysrandomthoughts.com":[17],"tablelifeblog.com":[17],"thebeautysection.com":[17],"thecelticblog.com":[17],"thecurvyfashionista.com":[17],"thenerdyme.com":[17],"thenonconsumeradvocate.com":[17],"thethings.com":[17],"timesnews.net":[17],"toyotaklub.org.pl":[17],"travelingformiles.com":[17],"tvline.com":[17],"baeldung.com":[18],"usatoday.com":[19,29],"fedex.com":[30],"mwed.jp":[31],"nicovideo.jp":[32,33],"abema.tv":[34],"coomer.st":[35],"kemono.cr":[35],"official.coomer.com.co":[35],"ncbi.nlm.nih.gov":[36,37],"aliexpress.com":[38,39],"aliexpress.ru":[38,39],"aliexpress.us":[38,39],"search.rakuten.co.jp":[40],"www.reddit.com":[41,42],"docs.google.com":[43],"liberation.fr":[44],"officedepot.fr":[44],"oui.sncf":[44],"sfr.fr":[45],"brillen.de":[46],"frogogo.ru":[47],"search.brave.com":[48],"dataunlocker.com":[12,13,49],"comicleaks.com":[50],"ping.gg":[50],"nookgaming.com":[50],"creatordrop.com":[50],"bitdomain.biz":[50],"fort-shop.kiev.ua":[50],"accuretawealth.com":[50],"tracktheta.com":[50],"adaptive.marketing":[50],"camberlion.com":[50],"segops.madisonspecs.com":[50],"stresshelden-coaching.de":[50],"controlconceptsusa.com":[50],"ryaktive.com":[50],"tip.etip-staging.etip.io":[50],"furucombo.app":[51],"intercity.technology":[52],"freelancer.taxmachine.be":[52],"adria.gg":[52],"fjlaboratories.com":[52],"abhijith.page":[52],"helpmonks.com":[52],"373news.com":[53,54,55,56,57,58],"aikatu.jp":[53,54,55,56,57,58,59],"aniroleplay.com":[53,54,55,56,57,58],"ap7am.com":[53,54,55,56,57,58],"areaconnect.com":[53,54,55,56,57,58],"as-web.jp":[53,54,55,56,57,58],"aucfree.com":[53,54,55,56,57,58],"autoby.jp":[53,54,55,56,57,58],"autoc-one.jp":[53,54,55,56,57,58],"autofrage.net":[53,54,55,56,57,58],"automobile-catalog.com":[53,54,55,56,57,58],"bab.la":[53,54,55,56,57,58],"badmouth1.com":[53,54,55,56,57,58],"bamgosu.site":[53,54,55,56,57,58],"bg-mania.jp":[53,54,55,56,57,58],"bien.hu":[53,54,55,56,57,58],"bleepingcomputer.com":[53,54,55,56,57,58],"blogmura.com":[53,54,55,56,57,58],"buzzfeed.com":[53,54,55,56,57,58],"buzzfeednews.com":[53,54,55,56,57,58],"cesoirtv.com":[53,54,55,56,57,58],"chanto.jp.net":[53,54,55,56,57,58],"cinema.com.my":[53,54,55,56,57,58],"cinetrafic.fr":[53,54,55,56,57,58],"cocokara-next.com":[53,54,55,56,57,58],"collinsdictionary.com":[53,54,55,56,57,58],"computerfrage.net":[53,54,55,56,57,58],"convertcase.net":[53,54,55,56,57,58,60],"cool-style.com.tw":[53,54,55,56,57,58,59],"crosswordsolver.com":[53,54,55,56,57,58],"cruciverba.it":[53,54,55,56,57,58],"cults3d.com":[53,54,55,56,57,58],"daily.co.jp":[53,54,55,56,57,58],"dailynewshungary.com":[53,54,55,56,57,58],"dayspedia.com":[53,54,55,56,57,58],"dictionary.cambridge.org":[53,54,55,56,57,58],"dnevno.hr":[53,54,55,56,57,58],"dogdrip.net":[53,54,55,56,57,58],"dolldivine.com":[53,54,55,56,57,58],"donbalon.com":[53,54,55,56,57,58],"dramabeans.com":[53,54,55,56,57,58,60],"dropgame.jp":[53,54,55,56,57,58,60],"dziennik.pl":[53,54,55,56,57,58],"economictimes.com":[53,54,55,56,57,58],"economist.co.kr":[53,54,55,56,57,58],"edaily.co.kr":[53,54,55,56,57,58],"etoday.co.kr":[53,54,55,56,57,58],"etoland.co.kr":[53,54,55,56,57,58],"eurointegration.com.ua":[53,54,55,56,57,58],"ev-times.com":[53,54,55,56,57,58],"filmibeat.com":[53,54,55,56,57,58],"flatpanelshd.com":[53,54,55,56,57,58],"fntimes.com":[53,54,55,56,57,58],"footballtransfer.com.ua":[53,54,55,56,57,58],"footballtransfer.ru":[53,54,55,56,57,58],"forsal.pl":[53,54,55,56,57,58],"freemcserver.net":[53,54,55,56,57,58],"fxstreet-id.com":[53,54,55,56,57,58],"fxstreet-vn.com":[53,54,55,56,57,58],"gazetaprawna.pl":[53,54,55,56,57,58],"genialetricks.de":[53,54,55,56,57,58],"giornalone.it":[53,54,55,56,57,58],"globalrph.com":[53,54,55,56,57,58],"gloria.hr":[53,54,55,56,57,58],"golf-live.at":[53,54,55,56,57,58],"goodreturns.in":[53,54,55,56,57,58],"hb-nippon.com":[53,54,55,56,57,58],"heureka.cz":[53,54,55,56,57,58],"hometownstation.com":[53,54,55,56,57,58],"honkailab.com":[53,54,55,56,57,58],"horairesdouverture24.fr":[53,54,55,56,57,58],"hotcopper.com.au":[53,54,55,56,57,58],"idokep.hu":[53,54,55,56,57,58],"infinityfree.com":[53,54,55,56,57,58],"iplocation.net":[53,54,55,56,57,58],"islamicfinder.org":[53,54,55,56,57,58,60],"isplus.com":[53,54,55,56,57,58],"issuya.com":[53,54,55,56,57,58],"iusm.co.kr":[53,54,55,56,57,58],"j-cast.com":[53,54,55,56,57,58],"j-town.net":[53,54,55,56,57,58],"j7p.jp":[53,54,55,56,57,58],"jablickar.cz":[53,54,55,56,57,58],"jamaicaobserver.com":[53,54,55,56,57,58],"javatpoint.com":[53,54,55,56,57,58],"jawapos.com":[53,54,55,56,57,58],"jmty.jp":[53,54,55,56,57,58],"joemonster.org":[53,54,55,56,57,58],"judgehype.com":[53,54,55,56,57,58],"jutarnji.hr":[53,54,55,56,57,58],"kinmaweb.jp":[53,54,55,56,57,58],"km77.com":[53,54,55,56,57,58],"knowt.com":[53,54,55,56,57,58],"kobe-journal.com":[53,54,55,56,57,58],"kompasiana.com":[53,54,55,56,57,58],"kreuzwortraetsel.de":[53,54,55,56,57,58],"kurashinista.jp":[53,54,55,56,57,58],"kurashiru.com":[53,54,55,56,57,58],"kyoteibiyori.com":[53,54,55,56,57,58],"lacuarta.com":[53,54,55,56,57,58],"lakeshowlife.com":[53,54,55,56,57,58],"laleggepertutti.it":[53,54,55,56,57,58],"lamire.jp":[53,54,55,56,57,58],"ldoceonline.com":[53,54,55,56,57,58],"leckerschmecker.me":[53,54,55,56,57,58],"lifehacker.jp":[53,54,55,56,57,58],"listentotaxman.com":[53,54,55,56,57,58],"livenewschat.eu":[53,54,55,56,57,58],"loawa.com":[53,54,55,56,57,58],"logicieleducatif.fr":[53,54,55,56,57,58],"mahjongchest.com":[53,54,55,56,57,58],"maketecheasier.com":[53,54,55,56,57,58],"malaymail.com":[53,54,55,56,57,58],"mamastar.jp":[53,54,55,56,57,58],"manta.com":[53,54,55,56,57,58,60],"mathplayzone.com":[53,54,55,56,57,58],"mediaindonesia.com":[53,54,55,56,57,58],"mentalfloss.com":[53,54,55,56,57,58],"meteo60.fr":[53,54,55,56,57,58],"midhudsonnews.com":[53,54,55,56,57,58],"minesweeperquest.com":[53,54,55,56,57,58],"minkou.jp":[53,54,55,56,57,58],"missyusa.com":[53,54,55,56,57,58],"mlbpark.donga.com":[53,54,55,56,57,58],"moin.de":[53,54,55,56,57,58],"motor-talk.de":[53,54,55,56,57,58],"motscroises.fr":[53,54,55,56,57,58],"muragon.com":[53,54,55,56,57,58],"mykhel.com":[53,54,55,56,57,58,59],"mynet.com":[53,54,55,56,57,58,59],"nana-press.com":[53,54,55,56,57,58],"nationaltoday.com":[53,54,55,56,57,58],"nbadraft.net":[53,54,55,56,57,58],"netzwelt.de":[53,54,55,56,57,58],"newsinlevels.com":[53,54,55,56,57,58],"newsweekjapan.jp":[53,54,55,56,57,58],"niice-woker.com":[53,54,55,56,57,58],"niketalk.com":[53,54,55,56,57,58],"nouvelobs.com":[53,54,55,56,57,58],"oeffnungszeitenbuch.de":[53,54,55,56,57,58],"ondemandkorea.com":[53,54,55,56,57,58],"onlineradiobox.com":[53,54,55,56,57,58],"optionsprofitcalculator.com":[53,54,55,56,57,58],"oraridiapertura24.it":[53,54,55,56,57,58],"oxfordlearnersdictionaries.com":[53,54,55,56,57,58],"palabr.as":[53,54,55,56,57,58],"pashplus.jp":[53,54,55,56,57,58],"persoenlich.com":[53,54,55,56,57,58],"petitfute.com":[53,54,55,56,57,58],"picksandparlays.net":[53,54,55,56,57,58],"picrew.me":[53,54,55,56,57,58],"powerpyx.com":[53,54,55,56,57,58],"pptvhd36.com":[53,54,55,56,57,58],"pravda.com.ua":[53,54,55,56,57,58],"pressian.com":[53,54,55,56,57,58],"profitline.hu":[53,54,55,56,57,58],"puzzlegarage.com":[53,54,55,56,57,58],"quefaire.be":[53,54,55,56,57,58],"radio-australia.org":[53,54,55,56,57,58],"radio-osterreich.at":[53,54,55,56,57,58],"raenonx.cc":[53,54,55,56,57,58],"raetsel-hilfe.de":[53,54,55,56,57,58],"references.be":[53,54,55,56,57,58],"relevantmagazine.com":[53,54,55,56,57,58],"reportera.co.kr":[53,54,55,56,57,58],"roleplayer.me":[53,54,55,56,57,58],"rostercon.com":[53,54,55,56,57,58],"samsungmagazine.eu":[53,54,55,56,57,58],"scribens.com":[53,54,55,56,57,58],"scribens.fr":[53,54,55,56,57,58],"slashdot.org":[53,54,55,56,57,58],"slobodnadalmacija.hr":[53,54,55,56,57,58],"smsonline.cloud":[53,54,55,56,57,58],"soccerdigestweb.com":[53,54,55,56,57,58],"solitairehut.com":[53,54,55,56,57,58],"sourceforge.net":[53,54,55,56,57,58],"southhemitv.com":[53,54,55,56,57,58],"sportalkorea.com":[53,54,55,56,57,58],"sportanalytic.com":[53,54,55,56,57,58],"sportsrec.com":[53,54,55,56,57,58],"sportsseoul.com":[53,54,55,56,57,58],"szamoldki.hu":[53,54,55,56,57,58],"talkwithstranger.com":[53,54,55,56,57,58],"tasty.co":[53,54,55,56,57,58],"tbsradio.jp":[53,54,55,56,57,58],"text-compare.com":[53,54,55,56,57,58],"thatgossip.com":[53,54,55,56,57,58],"the-crossword-solver.com":[53,54,55,56,57,58],"thedigestweb.com":[53,54,55,56,57,58],"thefreebieguy.com":[53,54,55,56,57,58],"tportal.hr":[53,54,55,56,57,58,60],"traicy.com":[53,54,55,56,57,58],"transparentcalifornia.com":[53,54,55,56,57,58],"transparentnevada.com":[53,54,55,56,57,58],"tunebat.com":[53,54,55,56,57,58],"tvtv.ca":[53,54,55,56,57,58],"tvtv.us":[53,54,55,56,57,58],"tweaktown.com":[53,54,55,56,57,58],"twn.hu":[53,54,55,56,57,58],"tyda.se":[53,54,55,56,57,58],"tz.de":[53,54,55,56,57,58],"ufret.jp":[53,54,55,56,57,58],"upmedia.mg":[53,54,55,56,57,58],"verkaufsoffener-sonntag.com":[53,54,55,56,57,58],"w.grapps.me":[53,54,55,56,57,58],"watchdocumentaries.com":[53,54,55,56,57,58],"webdesignledger.com":[53,54,55,56,57,58],"welt.de":[53,54,55,56,57,58],"wfmz.com":[53,54,55,56,57,58],"winfuture.de":[53,54,55,56,57,58],"word-grabber.com":[53,54,55,56,57,58],"worldhistory.org":[53,54,55,56,57,58],"worldjournal.com":[53,54,55,56,57,58],"wort-suchen.de":[53,54,55,56,57,58],"yakkun.com":[53,54,55,56,57,58],"ygosu.com":[53,54,55,56,57,58],"yutura.net":[53,54,55,56,57,58],"zagreb.info":[53,54,55,56,57,58],"zakzak.co.jp":[53,54,55,56,57,58],"2chblog.jp":[53,54,55,56,57,58],"2monkeys.jp":[53,54,55,56,57,58],"46matome.net":[53,54,55,56,57,58],"akb48glabo.com":[53,54,55,56,57,58],"akb48matomemory.com":[53,54,55,56,57,58],"alfalfalfa.com":[53,54,55,56,57,58],"all-nationz.com":[53,54,55,56,57,58],"anihatsu.com":[53,54,55,56,57,58],"aqua2ch.net":[53,54,55,56,57,58],"blog.esuteru.com":[53,54,55,56,57,58],"blog.livedoor.jp":[53,54,55,56,57,58],"blog.jp":[53,54,55,56,57,58],"blogo.jp":[53,54,55,56,57,58],"chaos2ch.com":[53,54,55,56,57,58],"choco0202.work":[53,54,55,56,57,58],"crx7601.com":[53,54,55,56,57,58],"danseisama.com":[53,54,55,56,57,58],"dareda.net":[53,54,55,56,57,58],"digital-thread.com":[53,54,55,56,57,58],"doorblog.jp":[53,54,55,56,57,58],"exawarosu.net":[53,54,55,56,57,58],"fgochaldeas.com":[53,54,55,56,57,58],"football-2ch.com":[53,54,55,56,57,58],"gekiyaku.com":[53,54,55,56,57,58],"golog.jp":[53,54,55,56,57,58],"hacchaka.net":[53,54,55,56,57,58],"heartlife-matome.com":[53,54,55,56,57,58],"liblo.jp":[53,54,55,56,57,58],"fesoku.net":[53,54,55,56,57,58],"fiveslot777.com":[53,54,55,56,57,58],"gamejksokuhou.com":[53,54,55,56,57,58],"girlsreport.net":[53,54,55,56,57,58],"girlsvip-matome.com":[53,54,55,56,57,58],"grasoku.com":[53,54,55,56,57,58],"gundamlog.com":[53,54,55,56,57,58],"honyaku-channel.net":[53,54,55,56,57,58],"ikarishintou.com":[53,54,55,56,57,58],"imas-cg.net":[53,54,55,56,57,58],"imihu.net":[53,54,55,56,57,58],"inutomo11.com":[53,54,55,56,57,58],"itainews.com":[53,54,55,56,57,58],"itaishinja.com":[53,54,55,56,57,58],"jin115.com":[53,54,55,56,57,58],"jisaka.com":[53,54,55,56,57,58],"jnews1.com":[53,54,55,56,57,58],"jumpsokuhou.com":[53,54,55,56,57,58],"jyoseisama.com":[53,54,55,56,57,58],"keyakizaka46matomemory.net":[53,54,55,56,57,58],"kidan-m.com":[53,54,55,56,57,58],"kijoden.com":[53,54,55,56,57,58],"kijolariat.net":[53,54,55,56,57,58],"kijolifehack.com":[53,54,55,56,57,58],"kijomatomelog.com":[53,54,55,56,57,58],"kijyokatu.com":[53,54,55,56,57,58],"kijyomatome.com":[53,54,55,56,57,58],"kijyomatome-ch.com":[53,54,55,56,57,58],"kijyomita.com":[53,54,55,56,57,58],"kirarafan.com":[53,54,55,56,57,58],"kitimama-matome.net":[53,54,55,56,57,58],"kitizawa.com":[53,54,55,56,57,58],"konoyubitomare.jp":[53,54,55,56,57,58],"kotaro269.com":[53,54,55,56,57,58],"kyousoku.net":[53,54,55,56,57,58],"ldblog.jp":[53,54,55,56,57,58],"livedoor.biz":[53,54,55,56,57,58],"livedoor.blog":[53,54,55,56,57,58],"majikichi.com":[53,54,55,56,57,58],"matacoco.com":[53,54,55,56,57,58],"matomeblade.com":[53,54,55,56,57,58],"matomelotte.com":[53,54,55,56,57,58],"matometemitatta.com":[53,54,55,56,57,58],"mojomojo-licarca.com":[53,54,55,56,57,58],"morikinoko.com":[53,54,55,56,57,58],"nandemo-uketori.com":[53,54,55,56,57,58],"netatama.net":[53,54,55,56,57,58],"news-buzz1.com":[53,54,55,56,57,58],"news30over.com":[53,54,55,56,57,58],"nmb48-mtm.com":[53,54,55,56,57,58],"norisoku.com":[53,54,55,56,57,58],"npb-news.com":[53,54,55,56,57,58],"ocsoku.com":[53,54,55,56,57,58],"okusama-kijyo.com":[53,54,55,56,57,58],"onihimechan.com":[53,54,55,56,57,58],"orusoku.com":[53,54,55,56,57,58],"otakomu.jp":[53,54,55,56,57,58],"otoko-honne.com":[53,54,55,56,57,58],"oumaga-times.com":[53,54,55,56,57,58],"outdoormatome.com":[53,54,55,56,57,58],"pachinkopachisro.com":[53,54,55,56,57,58],"paranormal-ch.com":[53,54,55,56,57,58],"recosoku.com":[53,54,55,56,57,58],"s2-log.com":[53,54,55,56,57,58],"saikyo-jump.com":[53,54,55,56,57,58],"shuraba-matome.com":[53,54,55,56,57,58],"ske48matome.net":[53,54,55,56,57,58],"squallchannel.com":[53,54,55,56,57,58],"sukattojapan.com":[53,54,55,56,57,58],"sumaburayasan.com":[53,54,55,56,57,58],"sutekinakijo.com":[53,54,55,56,57,58],"usi32.com":[53,54,55,56,57,58],"uwakich.com":[53,54,55,56,57,58],"uwakitaiken.com":[53,54,55,56,57,58],"vault76.info":[53,54,55,56,57,58],"vipnews.jp":[53,54,55,56,57,58],"vippers.jp":[53,54,55,56,57,58],"vipsister23.com":[53,54,55,56,57,58],"vtubernews.jp":[53,54,55,56,57,58],"watarukiti.com":[53,54,55,56,57,58],"world-fusigi.net":[53,54,55,56,57,58],"zakuzaku911.com":[53,54,55,56,57,58],"zch-vip.com":[53,54,55,56,57,58],"meconomynews.com":[61,62],"brandbrief.co.kr":[61,62],"motorgraph.com":[61,62],"topstarnews.net":[61,60],"secure-signup.net":[60],"tvtropes.org":[60],"ark-unity.com":[59],"doanhnghiepvn.vn":[59],"tacobell.com":[63],"endbasic.dev":[64],"jmmv.dev":[64],"ericdraken.com":[65],"utreon.com":[66],"zhihu.com":[67],"androidauthority.com":[68],"mindbodygreen.com":[69],"fingerprint.com":[64],"zefoy.com":[70],"threads.com":[71],"threads.net":[71],"musescore.com":[72],"idnes.cz":[73],"lidovky.cz":[73],"cnet.com":[74],"f6s.com":[75],"intellischool.id":[76],"beaumontenterprise.com":[77],"chron.com":[77],"ctinsider.com":[77],"ctpost.com":[77],"expressnews.com":[77],"houstonchronicle.com":[77],"lmtonline.com":[77],"middletownpress.com":[77],"mrt.com":[77],"newstimes.com":[77],"nhregister.com":[77],"registercitizen.com":[77],"sfchronicle.com":[77],"stamfordadvocate.com":[77],"thehour.com":[77],"timesunion.com":[77],"heavyfetish.com":[78,79,80,81],"columbian.com":[28],"theverge.com":[28,82,83],"factable.com":[84,85],"bing.com":[86],"microsoft.com":[86,87],"msn.com":[86],"web.skype.com":[86,88],"fandom.com":[89],"clickorlando.com":[90],"imgur.com":[91],"boundless.com":[92],"community.fortinet.com":[93],"camhub.cc":[81],"severeporn.com":[81],"shemale6.com":[81],"watchporn.to":[81],"bizjournals.com":[94,95],"businessinsider.de":[94],"computerbild.de":[94],"elconfidencial.com":[96,97,98],"journaldemontreal.com":[96,97,98],"aamulehti.fi":[99],"disqus.com":[100,101],"ozlosleep.com":[102],"naszemiasto.pl":[103],"worldstar.com":[104],"diariovasco.com":[105],"lifehacker.com":[106],"680thefan.com":[107],"katu.com":[108,109],"miro.com":[110,111],"popularmechanics.com":[112],"businessinsider.jp":[113],"darntough.com":[114,115,116],"swissotel.com":[117],"danslescoulisses.com":[118],"mais.sbt.com.br":[119],"pixabay.com":[120],"redis.io":[121],"boredpanda.com":[122],"galaxus.de":[123],"healf.com":[124,125,126],"terra.com.br":[127],"vnexpress.net":[128,129],"briefly.co.za":[130],"carparts.com":[131],"hpplus.jp":[132,133,134],"makemytrip.com":[135,136,137],"lared.cl":[138,139],"kimbino.bg":[140],"kimbino.ro":[140],"shoebacca.com":[141,142],"wpde.com":[143],"sky.pro":[144],"lexpress.fr":[145],"aihumanizer.ai":[146],"humbot.ai":[146],"hk01.com":[147],"oilprice.com":[148],"buildtheearth.net":[149],"allrecipes.com":[150,151],"trendyol.com":[152,153],"trendyol-milla.com":[152,153],"bostonscally.com":[154],"4gamers.com.tw":[155],"4game.com":[156,157],"4game.ru":[158,157],"shutterstock.com":[159,160],"mobalytics.gg":[161],"investing.com":[162,163,164],"form.typeform.com":[165],"hopper.com":[166],"mumuplayer.com":[167],"goodcar.com":[168],"ici.radio-canada.ca":[169],"mykitsch.com":[170,171],"huntress.com":[172,173],"flo.com.tr":[174,175],"gala.com":[176],"natgeotv.com":[177,178],"androidpolice.com":[21],"airtel.in":[179],"elevenlabs.io":[180],"proboards.com":[181],"winclassic.net":[181],"coursera.org":[182],"gazeta.press":[183],"gazeta.ru":[183],"rambler.ru":[183],"dev.to":[184,185],"advocate-news.com":[23],"akronnewsreporter.com":[23],"bocopreps.com":[23],"bostonherald.com":[23],"broomfieldenterprise.com":[23],"brushnewstribune.com":[23],"buffzone.com":[23],"burlington-record.com":[23],"canoncitydailyrecord.com":[23],"chicagotribune.com":[23],"chicoer.com":[23],"coloradodaily.com":[23],"coloradohometownweekly.com":[23],"courant.com":[23],"dailybreeze.com":[23],"dailybulletin.com":[23],"dailycamera.com":[23],"dailydemocrat.com":[23],"dailyfreeman.com":[23],"dailylocal.com":[23],"dailynews.com":[23],"dailypress.com":[23],"dailytribune.com":[23],"delcotimes.com":[23],"denverpost.com":[23],"eastbaytimes.com":[23],"eptrail.com":[23],"excelsiorcalifornia.com":[23],"fortmorgantimes.com":[23],"greeleytribune.com":[23],"journal-advocate.com":[23],"julesburgadvocate.com":[23],"lamarledger.com":[23],"lowellsun.com":[23],"macombdaily.com":[23],"mainlinemedianews.com":[23],"marinij.com":[23],"mcall.com":[23],"mendocinobeacon.com":[23],"mercurynews.com":[23],"montereyherald.com":[23],"morningjournal.com":[23],"nashobavalleyvoice.com":[23],"news-herald.com":[23],"ocregister.com":[23],"oneidadispatch.com":[23],"orlandosentinel.com":[23],"orovillemr.com":[23],"paradisepost.com":[23],"pasadenastarnews.com":[23],"pilotonline.com":[23],"pottsmerc.com":[23],"pressandguide.com":[23],"pressenterprise.com":[23],"presstelegram.com":[23],"readingeagle.com":[23],"record-bee.com":[23],"redbluffdailynews.com":[23],"redlandsdailyfacts.com":[23],"reporterherald.com":[23],"sandiegouniontribune.com":[23],"santacruzsentinel.com":[23],"saratogian.com":[23],"sbsun.com":[23],"sentinelandenterprise.com":[23],"sgvtribune.com":[23],"siliconvalley.com":[23],"southplattesentinel.com":[23],"sun-sentinel.com":[23],"themorningsun.com":[23],"thenewsherald.com":[23],"theoaklandpress.com":[23],"thereporter.com":[23],"thereporteronline.com":[23],"times-standard.com":[23],"timescall.com":[23],"timesherald.com":[23],"timesheraldonline.com":[23],"trentonian.com":[23],"troyrecord.com":[23],"twincities.com":[23],"ukiahdailyjournal.com":[23],"voicenews.com":[23],"whittierdailynews.com":[23],"willitsnews.com":[23],"vpnmentor.com":[186],"blog.cloudflare.com":[187],"www.cloudflare.com":[187],"forum.blu-ray.com":[188],"dailystar.co.uk":[189],"mirror.co.uk":[189,190,191,192],"bentasker.co.uk":[193],"discord.com":[194],"www.hoyolab.com":[195],"www.hoyoverse.com":[195],"hoyoverse.com":[196,197,198],"hoyolab.com":[199,200,201,202],"liquipedia.net":[203],"videezy.com":[204],"thehindu.com":[205],"farmersjournal.ie":[206,207,208],"souq-design.com":[209],"laurelberninteriors.com":[210,211,212],"evropa2.cz":[213],"myanimelist.net":[214],"vogue.com":[215],"abs-cbn.com":[216,217],"edikted.com":[218],"mediamarkt.de":[219],"linklog.tiagorangel.com":[220],"dailydot.com":[221],"itmedia.co.jp":[222,223],"smarturl.it":[224],"fileditchfiles.me":[225],"pooembed.eu":[226],"webex.com":[227],"vaughn.live":[187],"civitai.com":[228],"adhs-zentrum.de":[229],"okteve.com":[230],"oklivetv.com":[230],"tasma.ru":[231],"shrink-service.it":[232],"djs.sk":[233],"bilibili.com":[234],"dandanzan.top":[234],"v.qq.com":[234],"meeting.tencent.com":[235],"notion.so":[236],"olympics.com":[237],"ceramic.or.kr":[238],"timesofindia.indiatimes.com":[239],"duolingo.com":[240],"study.com":[241],"wayfair.com":[242,243],"pandadoc.com":[244],"shahid.mbc.net":[245],"view.ceros.com":[246],"smallpdf.com":[247],"chatgpt.com":[248,249],"barstoolsports.com":[250],"netflix.com":[251],"jxoplay.xyz":[252],"zorroplay.xyz":[252],"archive.fo":[253],"archive.is":[253],"archive.li":[253],"archive.md":[253],"archive.ph":[253],"archive.today":[253],"archive.vn":[253],"btdig.com":[253],"climaaovivo.com.br":[254],"israelnationalnews.com":[255],"igniteseurope.com":[256],"kick.com":[257,258],"xhamster.com":[259,260],"cnn.com":[261,258],"play.discoveryplus.com":[261,258],"play.hbomax.com":[261,258]};
const EXCEPT = {"dev.fingerprint.com":["prevent-xhr\u0001method:POST"],"docs.fingerprint.com":["prevent-xhr\u0001method:POST"],"www.hoyoverse.com":["trusted-set-cookie\u0001DEVICEFP\u000100000000000\u0001\u0001\u0001domain\u0001.hoyoverse.com","trusted-set-cookie\u0001DEVICEFP_SEED_ID\u0001\u00010\u0001\u0001domain\u0001.hoyoverse.com","trusted-set-cookie\u0001DEVICEFP_SEED_TIME\u0001\u00010\u0001\u0001domain\u0001.hoyoverse.com"],"www.hoyolab.com":["trusted-set-cookie\u0001DEVICEFP\u000100000000000\u0001\u0001\u0001domain\u0001.hoyolab.com","trusted-set-cookie\u0001DEVICEFP_SEED_ID\u0001\u00010\u0001\u0001domain\u0001.hoyolab.com","trusted-set-cookie\u0001DEVICEFP_SEED_TIME\u0001\u00010\u0001\u0001domain\u0001.hoyolab.com"]};
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
