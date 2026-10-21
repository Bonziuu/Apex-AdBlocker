/* ChromeBlock – scriptlety listy "Komunikaty o cookies" (część 1/5). Plik generowany przez tools/build.mjs. */
(function () {
'use strict';
const CALLS = [["trusted-click-element","[title=\"Manage Cookies\"]"],["trusted-click-element","[title=\"Reject All\"]","","1000"],["trusted-click-element","button.sp_choice_type_11"],["set-constant","flagTcfLoaded","true"],["trusted-set-local-storage-item","CMPList","$currentDate$"],["trusted-click-element",".sp_choice_type_12[title=\"Options\"]"],["trusted-click-element","[title=\"REJECT ALL\"]","","500"],["trusted-click-element","button[title=\"READ FOR FREE\"]","","1000"],["trusted-set-cookie","cookies","{\"system\":1,\"target\":0}"],["trusted-set-cookie","CookieControl","{\"interactedWith\":true,\"acceptedCategories\":[\"essentials\"]}"],["trusted-click-element","button.btn-reject-additional-cookies","","1000"],["trusted-set-cookie","CookieConsent","{stamp:%27Uv9YOAVP5djCBw71lxhE4rNAfTObaGck2Sn3rKWf9dPCYpqcWvAlpA==%27%2Cnecessary:true%2Cpreferences:false%2Cstatistics:false%2Cmarketing:false%2Cmethod:%27explicit%27%2Cver:2}","1year"],["trusted-set-cookie","CookieConsent","{stamp:%27Uv9YOAVP5djCBw71lxhE4rNAfTObaGck2Sn3rKWf9dPCYpqcWvAlpA==%27%2Cnecessary:true%2Cpreferences:false%2Cstatistics:false%2Cmarketing:false%2Cmethod:%27explicit%27%2Cver:3}","1year"],["trusted-set-cookie","CookieConsent","{stamp:%27IGA8uzBNs1DBQ0+vp/j0/Pjdqka8o6XzxQ05fqYJv31Y3xQgSRvliw==%27%2Cnecessary:true%2Cpreferences:false%2Cstatistics:false%2Cmarketing:false%2Cmethod:%27explicit%27%2Cver:1%2Cutc:1%2Cregion:%27null%27}","1year"],["trusted-set-cookie","CookieConsents","{\"StrictlyNecessary\":true,\"Analytical\":false,\"Performance\":false,\"AdvertisingAndTargeting\":false,\"timestamp\":\"\"}"],["trusted-set-local-storage-item","komoot_gdpr_data","{\"requestDone\":true,\"technicalAcceptedTrackers\":[],\"analyticsAcceptedTrackers\":[],\"profilingAcceptedTrackers\":[],\"lastAcceptedVersion\":1}"],["trusted-set-local-storage-item","cookies_settings","{\"json\":{\"state\":\"only-essential\"}}"],["trusted-set-cookie","mmc-cookie-consent","{\"Id\":\"c2457eddbecc20cbab3869374900e864\",\"CategoryID\":4}","1year"],["set-local-storage-item","gdpr-done","true"],["trusted-set-local-storage-item","cookiesSettings","{\"remarketing\":false,\"personalisation\":false,\"statistics\":false}"],["trusted-click-element","button[onclick=\"IMOK()\"]","","500"],["trusted-set-cookie","FCCDCF","%5Bnull%2Cnull%2Cnull%2C%5B%22CP2G1QAP2G1QAEsACDENAdEgAAAAAAAAAAwIAAAGfgAgGfAA%22%2C%221~%22%2C%22EA7F77A0-0F26-47A6-A8A4-74D65175A664%22%5D%2Cnull%2Cnull%2C%5B%5D%5D"],["trusted-set-local-storage-item","acceptConsent","{\"acceptAnalysis\":false,\"acceptMarketing\":false,\"showCookie\":1}"],["trusted-set-cookie","cookies-consent","agree"],["trusted-click-element","button[aria-label=\"close button\"]","","1000"],["trusted-click-element","button.iubenda-cs-customize-btn, button.iub-cmp-reject-btn, button#iubFooterBtn","","1000"],["trusted-set-cookie","cookie_preferences","{%22marketing%22:false%2C%22analytics%22:false}"],["set-local-storage-item","isTrackingAllowed","false"],["trusted-set-local-storage-item","trackingAllowedOrDeniedAt","$currentISODate$"],["trusted-set-cookie","cookie_preferences","{%22performance%22:false%2C%22marketing%22:false%2C%22necessary%22:true}"],["trusted-set-local-storage-item","cookie_consent","{\"consent\":true,\"necessary\":true,\"preference\":false,\"statistics\":false,\"marketing\":false}"],["trusted-set-cookie","sncc","P%3D8%3AV%3D77.0.0%26C%3DC01%26D%3Dtrue","","","domain","nature.com"],["trusted-set-local-storage-item","sddan:cmp","{\"tc\":\"CQdF08AQdF08ABcAKCENCLFgAAAAAEPgAAqIJNQAASagZgALgAcAB4AFQALgAcABAACQAFQAMoAaABqADwAJkAXABdADEAGgAN4AfAA_ACEgEQARIAw4BlAGWANEAc8A-wD9AIQARQAiwBGICOAI6ASYAq4BcwC8gGKANEAa8A2gB_wEegJiATSAocBTQC1AFzALzAYsAyQBpoDkwAA\",\"lp\":$now$}"],["trusted-set-cookie","euconsent-v2","CQdF08AQdF08ABcAKBENCLFgAAAAAEPgAAqIJNQAASagZgALgAcAB4AFQALgAcABAACQAFQAMoAaABqADwAJkAXABdADEAGgAN4AfAA_ACEgEQARIAw4BlAGWANEAc8A-wD9AIQARQAiwBGICOAI6ASYAq4BcwC8gGKANEAa8A2gB_wEegJiATSAocBTQC1AFzALzAYsAyQBpoDkwAA"],["set-cookie","cookieconsent_status","dismiss"],["set-local-storage-item","COOKIE_CONSENT_STATUS_4124","\"dismissed\""],["trusted-set-cookie","user-cookie-preferences","{%22necessary-cookies%22:true%2C%22marketing-advertising-cookies%22:false%2C%22functional-cookies%22:false%2C%22analytics-cookies%22:false}","","","domain","virgin.com"],["trusted-set-cookie","TVPtcs22","CQDpp0AQDpp0AFfADAENBCFgAAAAAAAAAB5YAAAUvAJMNCogDLIkJCDQMIIEAKgrCAigQAAAAkDRAQAmDAp2BgEusJEAIAUAAwQAgABRkACAAASABCIAIACgQAAQCBQABgAQDAQAMDAAGACwEAgABAdAhTAggUCwASMyIhTAhCASCAlsqEEgCBBXCEIs8CCAREwUAAAJABWAAICwWBxJICViQQJcQbQAAEACAQQAVCKTswBBAGbLUXiybRlaQFo-YLntMAwAAAAA.YAAAAAAABYAAAAAA"],["set-cookie","TVPtcs22ver","66"],["trusted-click-element","div.tvp-covl__ab","","1000"],["trusted-click-element","button.denyAll","","1000"],["set-cookie","cookieBasicConsent","accepted"],["trusted-set-cookie","cookiePolicyAcceptedDate","$currentISODate$"],["trusted-click-element","button[data-tracking-name=\"cookie-preferences-mloi-initial-opt-out\"]"],["trusted-click-element","button[data-tracking-name=\"cookie-preferences-sloo-opt-out\"]","","1000"],["trusted-set-cookie","ac","{\"essential\":true,\"functional\":false}"],["trusted-set-cookie","cookiesSettingsData","{\"1\":2,\"2\":0,\"3\":0,\"4\":0}"],["trusted-set-cookie","OptanonConsent","groups=C0003%3A0%2CC0004%3A0%2CC0002%3A0%2CC0001%3A1","","","domain","www.saal-digital.de"],["trusted-set-cookie","OptanonAlertBoxClosed","$currentDate$","","","domain","www.saal-digital.de"],["trusted-click-element","button.cassie-reject-all","","1000"],["trusted-set-cookie","gdpr","-ga-ads-fbp-htj-yt","2629743"],["trusted-set-local-storage-item","cookie-data","{\"version\":\"20210906\",\"value\":\"-ga-ads-fbp-htj-yt\"}"],["trusted-set-cookie","a9_cookie_control_prefs_v2","%255B%2522essential%2522%255D"],["trusted-set-cookie","ConsentChecked","{\"userHasSetCookies\":true,\"functionalityCookies\":false,\"statisticCookies\":false,\"marketingCookies\":false}"],["trusted-set-cookie","gcbca","","1day"],["trusted-set-cookie","gcbpl","p1|st1|pt1","1year"],["trusted-set-local-storage-item","cc_cookie","{\"categories\":[\"necessary\"],\"revision\":0,\"data\":null,\"consentTimestamp\":\"$currentISODate$\",\"consentId\":\"00000000-0000-0000-000-000000000000\",\"services\":{\"necessary\":[],\"analytics\":[],\"marketing\":[]},\"lastConsentTimestamp\":\"$currentISODate$\",\"expirationTime\":1779124118406}"],["trusted-set-cookie","euconsent-v2","CQULowAQULowAAHABBENBxFgAAAAAAAAAAiQAAAAAACkoAMAAQWrKQAYAAgtWOgAwABBashABgACC1YSADAAEFqw.YAAAAAAAAAAA","1year","","domain","filehippo.com"],["trusted-set-cookie","euconsent-v2","CQULowAQULowAAHABBENBxFgAAAAAAAAAAiQAAAAAACkoAMAAQWrKQAYAAgtWOgAwABBashABgACC1YSADAAEFqw.YAAAAAAAAAAA","1year","","domain","filehippo.de"],["trusted-set-cookie","euconsent-v2","CQULowAQULowAAHABBENBxFgAAAAAAAAAAiQAAAAAACkoAMAAQWrKQAYAAgtWOgAwABBashABgACC1YSADAAEFqw.YAAAAAAAAAAA","1year","","domain","filehippo.jp"],["trusted-set-cookie","euconsent-v2","CQULowAQULowAAHABBENBxFgAAAAAAAAAAiQAAAAAACkoAMAAQWrKQAYAAgtWOgAwABBashABgACC1YSADAAEFqw.YAAAAAAAAAAA","1year","","domain","filehippo.pl"],["trusted-set-cookie","website_cookies_bar","{\"required\": true, \"optional\": false}","1year"],["trusted-click-element","button[data-t=\"rejectAll\"]","","1000"],["trusted-click-element","#reject-cookies","","500"],["trusted-set-cookie","cookie_consent","1|0|0","1year"],["trusted-click-element","[data-ga-action=\"disallow_all_cookies\"]"],["trusted-click-element","button[data-cookies=\"disallow_all_cookies\"]"],["trusted-click-element","#didomi-notice-disagree-button"],["trusted-click-element",".b-cookie button[data-cookie-reject]","","500"],["trusted-click-element","button#CookieBoxSaveButton","","1000"],["trusted-set-cookie","isp_consent","{\"v\":1,\"ts\":$now$,\"f\":0,\"e\":0,\"m\":0,\"a\":0}"],["trusted-click-element","div[aria-labelledby=\"modal-title-cookieDisclaimerModal\"] button[class*=\"SecondaryButton\"]"],["trusted-click-element","when-visible:#reject-all-gdpr"],["trusted-click-element","button#tarteaucitronAllDenied2","","1600"],["trusted-set-cookie","cookie_consent","{\"method\":\"DENY\",\"groups\":[]}","","","reload","1","domain",".hailo-windsystems.com"],["trusted-click-element","button.brlbs-btn-accept-only-essential","","1000"],["trusted-click-element","button[aria-label=\"Essential only cookies\"]"],["trusted-set-local-storage-item","trackingConsent","not-granted"],["trusted-click-element","div[data-project=\"mol-fe-cmp\"] button[class*=\"consent\"]:not([class*=\"reject\"])"],["trusted-set-cookie","OptanonAlertBoxClosed","$currentDate$","1year"],["trusted-set-cookie","eupubconsent-v2","CP0tkXAP0tkXAAcABBENAXEwAAAAAAAAAAYgAAAAAAHBAHwAAQADQAOAA8ADIALAAjgBQACuAFsARYAlwBfQDUANUAc4A8gB8gEDAIOARwAn8BQwFFALsAZwA3gB6AD5AIbAReAj0BIoCSwErAJlgTYBNoClwFPgLCgWIBYoC6gF3ALyAYFAw8DEAGLQMhAyMBkwDPwGhANGAaYA1MBroDaAG3AN0AcEA6gB2ADuoHkgeUA96B8gHyhIHAACAAFwAUABUADkAHgAgABhADIANQAeABMACqAG8APQAhIBDAESAI4ASwAmgBSgDDAGWANkAd8A9gD4gH2AfoBAICLgIwARoAlIBQQCoAFXALmAYoA2gBuADiAJEATsAocBR4CkQFNgLYAXIAu8BeYDBgGGgMkAZOAzmBrAGsgN1AcmA5cB44YCgAAEAAwADgAKAAigBOAFgAMIAeAB6AEIAI4ATAAqABXgC2ALkAcwB3AEMAIkARYAlwBSACtAGcANSAbIBwADjAHOAPIAfgBAACMAEmAJ0AUUApcBXgFfALsAX4AzgBsgDbAG8AOOAc0A6gB2QD1AHyAP2AhIBDYCLwEdQJEAkUBJcCWgJeATYAnYBQkCkQKSAU2AsUBaIC5AF0ALuAXoAwIBh4DHoGRgZIAycBnIDPAGhANMga0BrsDcgN0AdQA7gB7wgCcAAEAAwADgAKAAigBOAFgAMIAeAB6AEIAI4ATAArgBbgDmAO4AhgBEgCLAEuAKQAVoAzgBqQDZAOAAcYA5wB5AD5AH4AQAAjABJgCdAFFAKXAV4BXwC7AF-AM4AagA2wBvADjgHNAOyAeoA-QB-wEJAIbAReAjuBIgEigJLgS0BLwCbAE7AKEAUkApuBYgFigLRAXIAugBdwC9AGBAMPAY8AyQBk4DOQGhANMga0BroDdAHUAO4Ae8KARgAigBUAFgAQgAmABcAEcAKQAZQA1ABwAEcAKLAV4BXwC7AF-AM4AbwA5oB-wEegJFAS8AmwBYoC0QFsALuAXoAw8BnIDPAGhQNaA14BuQD3hgCAAEUAKgAsACEAEwARwApABqADgAI4AUWArwCvgF2AL8AZwA3gBzQD9gI9ASKAl4BNgC0QFsALuAXoAw8BnIDPAGhQNaA10B7wD4hwF6AAwAEQAOAA8AC4AGQAWAA5AB8AEcAJoAUAArgBbAC-AGgAQgAiwBHACXAFIALIAXwAwoBmgGcANQAc4A7gB5AD5gIAAgcBBwEIAI4ATiAnwCfgFFAKWAVAArIBdgC9AGcAN4AccA6QB6AD5AIbAREAioBHoCRQElgJWATEAmWBNgE2gKQAUmApcBVQCxAFlALUAWzAugC6gF3AL6AYEAxABiYDFgGQgMmAZeAz8BoQDRoGmAaaA1OBroGwANoAbcA48BywDnwHWAOwAdxA8kDygHpAPeAfEA-UB9oD8R0EcABcAFAAVAA5AB8AIAAXQAwADUAHgATAAqwBcAF0AMQAZgA3gB6gEMARIAlgBNACjAFKAMMAZQA0QBsgDvAHtAPsA_QB_wEWARgAlIBQQCrgFiALmAXkAxQBtADcAHEAOoAi8BIgCVAEyAJ2AUOAo-BTQFNgLFAWwAuABcgC7QF3gLzAYMAw0BjwDJAGTgMqAZYAzkBogDVQGsAN1AcWA5MBy4DxwH1kAFwACAAMgAsACaAF8ANAApABZAC-AGcANQAc4BHACcAE-gKGAooBSwCsgFiALSAXYA3gBzQD0AI9ASLAmwCbQFJgLEgWyBbQC7gF5AMCAYlAzwDPwGhANTAa6A2ABtwDnwHRgOwgeSB5QD3gHxEIEAACwAKAAuABiAEwAKoAXAAxABvAD0AI4Ad4A_wCUgFBAKuAXMAxQBtADqAJUAU0AsUBaIC4AFyAMnAZyA0QBqoDgAHjkgGIABgAHAAXAAyACwAHIARwAmgBUAC-AGQANoAhABSACyAGdANQA1QB3AEAAI4AT6ApoCoAFZALSAXYA3gB8gEVAI6AR6AkUBKwCWoE2ATaApMBVICxAFlALuAYsAyyBngGfgNCAa6A2ABuQDsAHlAPeJQHQAEAALAAoAByAGAAYgA8ACYAFUALgAYoBDAESAI4AUYA2QB3gD8AKuAYoA6gCLwEiAKPAWKAtgBeYDJwGcgNYAcAUgYgALgAoACoAHIAPgBBADAANQAeABMACkAFUAMQAZoBDAESAKMAUoAygBogDZAHfAPwA_QCLAEYAJSAUEAq4BcwC8gGKANoAbgBF4CRAE7AKHAU2AsUBbAC4AFyALtAXmAw0BkgDJwGcwNYA1kBuoDkwHLgPHKAQAALgAZABYADkAI4ATQAqABfADIAG0AQgAiwBHACZAFIALIAXwAwgBnQDUANUAc4A7oB8gH2AQAAjgBPgChgFLgKyArYBYoC6gLsAa8A3gB2wD0AH_AR0Aj0BIoCSwExQJsAm0BSACnwFiALoAXcAvIBfQDAgGLAMmgZ4Bn4DQgGiQNSA1OBroGwAOCAdgA7gB5QD3gHxAPlAA.YAAAAAAAAAAA","1year"],["trusted-set-cookie","OptanonConsent","groups=C0001%3A1%2CC0002%3A0%2CC0005%3A0%2CC0004%3A0%2CC0048%3A1%2CC0030%3A1%2CC0046%3A1%2CC0032%3A1%2CC0033%3A1%2CC0057%3A1%2CC0054%3A1%2CC0056%3A1%2CC0043%3A1%2CC0029%3A1%2CC0055%3A1%2CC0026%3A1","1year"],["trusted-set-cookie","OptanonConsent","groups=1%3A1%2C2%3A0%2C3%3A1%2C4%3A0%2C5%3A1%2CBG57%3A0%2CBG58%3A0%2CBG59%3A0","1year"],["trusted-set-cookie","ladies-cookies-overlay","%7B%22cookie-category-essential%22%3Atrue%2C%22cookie-category-stats%22%3Afalse%2C%22cookie-category-map_services%22%3Atrue%7D","","","reload","1"],["trusted-set-cookie","opt_out","analyse,werbe"],["trusted-set-cookie","OptanonConsent","groups=C0001%3A1%2CC0009%3A0%2CC0002%3A0%2CC0003%3A1%2CC0004%3A1","1year"],["trusted-set-cookie","allowCookies","{\"uvc\":true,\"__cfduid\":true}"],["trusted-set-constant","dataLayer","{\"value\":[{\"signals\":[\"remixd\"]},{\"event\":\"remixd_gtm_fire\"}]}"],["set-cookie","cookieConsent","functional"],["trusted-set-cookie","je-cookieConsent","necessary","1year"],["trusted-set-cookie","customerCookieConsent","%5B%7B%22consentTypeId%22%3A103%2C%22consentTypeName%22%3A%22necessary%22%2C%22isAccepted%22%3Atrue%7D%2C%7B%22consentTypeId%22%3A104%2C%22consentTypeName%22%3A%22functional%22%2C%22isAccepted%22%3Atrue%7D%2C%7B%22consentTypeId%22%3A105%2C%22consentTypeName%22%3A%22analytical%22%2C%22isAccepted%22%3Afalse%7D%2C%7B%22consentTypeId%22%3A106%2C%22consentTypeName%22%3A%22personalized%22%2C%22isAccepted%22%3Afalse%7D%5D","1year"],["trusted-click-element","#onetrust-accept-btn-handler","","1000"],["trusted-set-cookie","d_prefs","MjoxLGNvbnNlbnRfdmVyc2lvbjoyLHRleHRfdmVyc2lvbjoxMDAw","2629743","","domain","x.com"],["trusted-set-cookie","euconsent-v2","CPxurkAPxurkAAHABBENDVCgAP8AAE4AAAiQIkNf_X_fb2vj-_p99_t0eY1P9_6_t6wzjheNk-8NyZ_X_J4Xp2M6rB34pqIKuR4kunLBIQdlHGHcTUgg4IkFoSPsYk2MizJKJ7JEmlMbE2dYGG9vn8TT-ZKY70__f__zvn-r___97oAAhCAABAAAAAgAAIAAAgAIAAAAAAAAAAAAAAAAAAAAAAAADA4tAsy0bqaFsHT0Lpo4igRGjCuJWoBQGUQCwtkBhmTPCnZHAR-wnUAAxAADBByGAFEaAICCIIAkKgIkEOBAqJAIdAACgAUIBAFRIgEoiLAQCAA0B8PAKKAJSLGDKhIidcCMKxIPu-QAAEAQAAIAAQAAAABAJCgAYAAiCgGgAwABEFARABgACIKAqADAAEQUBkAGAAIgoDwAMAARBQIQAYAAiCgTAAwABEFAqABgACIKAAAA.f-AACcAAAAAA","","","domain","mundodeportivo.com"],["trusted-click-element","[data-paywall-notifier=\"consent-agreetoall\"]","","1000"],["trusted-click-element","#didomi-notice-agree-button","","1000"],["trusted-set-cookie","ubs_cookie_settings_2.0.4","0-2-1"],["trusted-set-cookie","ConsentChecked","{\"userHasSetCookies\":true,\"functionalityCookies\":true,\"statisticCookies\":false,\"marketingCookies\":false}","","","reload","1"],["trusted-set-local-storage-item","appconsent","{\"consents\":{},\"i18n\":{},\"ui\":{},\"vendorlist\":{},\"CMP_VERSION\":10,\"xchange\":{},\"events\":[],\"client\":{\"externalIds\":{},\"floatingPurposes\":[{\"id\":\"\",\"version\":0}],\"floatingPurposesConsent\":[{\"extra_id\":\"\",\"type\":0,\"given_at\":null,\"version\":0}]},\"consentstring\":\"CPzBFAAPzBFAAACAKAFRDUCoAAAAAH_AAAqIIzNF_H_dSSNj8X5_Yft0eY1P5dAz7uQxBhaJg6QFyBLEsJwXwmAIIEnqAKgKGBIEskJAIQBlCAHABUEAYIEBISGMAEAQIQAAJiAEEEERAmJICBBJG4AgEAIQglgCABQAgAsESFsoQMhAAIAABUJAAAgggIABAgAIBDAAQAAAAAAAAgAAEAAAAAAAAAAEABBHYAkw1LiABsiAkJpAwigRAjCIICKBQAAACQMEAACQIAlBGASgwAQAgRQAEBAAAAFEAAAAAAIAEIAAgACBAABAIBAAAABAAAAAQAAAgAIAQAAAABADAEAABAAAAAAACAECEIAAIACAgAAgAEAIAAAAAAIBAIBAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAgAAAA.YAAAAAAAAAAA\",\"consentstringUpdatedAt\":{}}"],["trusted-set-local-storage-item","user_consent","{\"version\":1,\"consents\":{\"statistics\":false,\"videoIntegration\":true}}"],["trusted-set-cookie","hp__gdpr_consent","!demographics=false!googletagmanager=false!facebook=true!twitter=true!instagram=true!youtube=true!optimize=false!helphero=false!fbpixel=false!iterable=false!kayakWidget=false!vimeo=true!lastminute=false!apple=true!google=true!hotjar=false!getYourGuide=false!gad=false","1year","","reload","1"],["trusted-set-cookie","gdpr","{%22version%22:%221.0_tracking%22%2C%22options%22:{%22typo3%22:true%2C%22gdpr%22:true%2C%22openstreetmap%22:true%2C%22vimeo%22:true%2C%22youtube%22:true%2C%22recaptcha%22:true%2C%22googlemaps%22:true%2C%22tracking%22:false}}"],["trusted-click-element","button[name=\"decline-all\"]","","1000"],["trusted-set-cookie","CookieConsent","{necessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cmethod:%27explicit%27%2Cver:1}","1year","","reload","1"],["trusted-set-cookie","_x13eucookie","{\"1\":true,\"2\":false,\"3\":false,\"4\":false,\"5\":true,\"6\":false}"],["trusted-click-element","button.js-cookie-accept-all","","2000"],["trusted-click-element","button[data-label=\"accept-button\"]","","1000"],["trusted-click-element","button#pt-accept-all"],["trusted-set-cookie","vl-cookie-consent-cookie-consent-date","$now$"],["set-cookie","vl-cookie-consent-cookie-consent","true"],["set-cookie","vl-cookie-consent-functional","true"],["trusted-set-cookie","cookie_consent","custom-functional"],["trusted-click-element",".iubenda-cs-customize-btn, #iubFooterBtn"],["set-cookie","amcookie_allowed","0"],["trusted-set-local-storage-item","am-last-cookie-acceptance","$now$"],["trusted-set-cookie","CookieConsent","1.0.0.0.0"],["trusted-click-element","#cl-consent button[data-role=\"b_decline\"]"],["trusted-click-element",".privacy-popup > div > button","","2000"],["trusted-set-cookie","user","%7B%22necessary%22%3Atrue%2C%22preferences%22%3Afalse%2C%22statistics%22%3Afalse%2C%22marketing%22%3Afalse%7D"],["trusted-set-cookie","tarteaucitron","!tarteaucitron=true!website=true!analytics=false!regex_analytic=false!regex_ads=true!googletagmanager=false!facebookpixel=false!addtoanyshare=false!youtube=true","1year"],["trusted-click-element","#pubtech-cmp #pt-close"],["trusted-set-cookie","cookiesSettings","%7B%22necessary%22%3Atrue%2C%22preferential%22%3Atrue%7D","","","reload","1"],["trusted-set-cookie","wmm-visitor_token","4cb8860d-4194-4ab5-be04-10f9a26afaa8"],["trusted-click-element",".didomi-continue-without-agreeing","","1000"],["trusted-click-element","button[id=\"didomi-notice-disagree-button\"]","","1000"],["trusted-click-element","#didomi-notice-agree-button"],["trusted-set-cookie","_CookiesPolicyAccepted","[%22necessary%22]"],["trusted-set-cookie","wpsaurus_cookie_banner_plugin","functional"],["trusted-set-cookie","OptanonConsent","groups=C0001%3A1%2CC0002%3A0%2CC0003%3A1%2CC0004%3A0"],["set-cookie","DDCookiePolicyDialog","hide","","reload","1"],["set-cookie","DDCookiePolicy-consent-functional","false"],["set-cookie","DDCookiePolicy-consent-tracking","false"],["set-cookie","DDCookiePolicy-consent-statistics","false"],["trusted-set-cookie","CookieChoicesApr2021","%7B%22functionality%22%3Afalse%2C%22anonymousMeasurement%22%3Afalse%2C%22performance%22%3Afalse%2C%22advertising%22%3Afalse%7D"],["trusted-set-cookie","CookieChoicesApr2021","{\"functionality\":false,\"anonymousMeasurement\":false,\"performance\":false,\"advertising\":false}"],["trusted-set-cookie","CookieConsent","%7B%22Mode%22%3A0%7D","","","reload","1"],["trusted-set-cookie","aok_cookie_settings","{\"functional\":{\"key\":\"functional\",\"name\":\"Funktionale Cookies\",\"required\":true,\"approved\":true},\"comfort\":{\"key\":\"comfort\",\"name\":\"Komfort-Cookies\",\"required\":false,\"approved\":false},\"tracking\":{\"key\":\"tracking\",\"name\":\"Marketing-Cookies\",\"required\":false,\"approved\":false}}"],["trusted-set-cookie","user_cookie_settings","WyJwcC1mdW5jdGlvbmFsIl0=","","","reload","1"],["trusted-set-cookie","CookieConsentV2","YES%2CTOI","","","domain","matkahuolto.fi"],["trusted-set-local-storage-item","aw-thirds","{\"mode\":\"forced-choice\",\"google_analytics\":\"deny\",\"google_tag_manager\":\"deny\",\"facebook_pixel\":\"deny\",\"linkedin\":\"deny\",\"youtube\":\"allow\",\"google_maps\":\"allow\"}"],["trusted-set-cookie","consent-cookie-toggles","[{%22type%22:%22social%22%2C%22value%22:3}%2C{%22type%22:%22remaining%22%2C%22value%22:3}]"],["trusted-set-cookie","plenty-shop-cookie","{\"necessary\":{\"amazonPay\":true,\"consent\":true,\"consentActiveStatus\":true,\"externalId\":true,\"session\":true,\"csrf\":true,\"paypal-cookies\":true},\"tracking\":{\"googleanalytics\":false,\"bingads\":false},\"marketing\":{\"googleads\":false,\"facebookpixel\":false,\"pinterest\":false},\"media\":{\"reCaptcha\":true},\"convenience\":{\"languageDetection\":false}}"],["trusted-set-local-storage-item","partner-cookies","{\"value\":{\"isAnalyticsCookies\":false,\"isFunctionalCookies\":true}}"],["trusted-set-local-storage-item","consentMode","{\"ad_storage\":\"denied\",\"analytics_storage\":\"denied\",\"functionality_storage\":\"denied\"}"],["trusted-set-local-storage-item","partner-cookies","{\"value\":{\"isAnalyticsCookies\":false,\"isFunctionalCookies\":false},\"expireIn\":1868839599999}"],["trusted-click-element","button[onclick=\"Didomi.setUserAgreeToAll();\"]","","1800"],["trusted-click-element","button[title^=\"Alle akzeptieren\" i]","","1000"],["trusted-set-cookie","consentPreferences","{\"timestamp\":\"1\",\"version\":1,\"functional_storage\":\"granted\",\"analytics_storage\":\"denied\",\"personalization_storage\":\"denied\",\"ad_storage\":\"denied\",\"ad_user_data\":\"denied\",\"ad_personalization\":\"denied\"}"],["trusted-click-element","button[aria-label=\"I Accept\"]","","1000"],["trusted-set-cookie","CookieConsent","necessary:true%2C%20preference:true%2C%20statistics:false%2C%20marketing:false"],["trusted-set-cookie","UN_cookie_consent_v2","%7B%22marketing%22%3A0%2C%22statistics%22%3A0%2C%22personalization%22%3A0%2C%22time%22%3A1711880201%2C%22id%22%3A%221%22%7D","","","reload","1"],["trusted-set-cookie","cookie-consent","{\"required\":true,\"optional\":false,\"analytics\":false}"],["trusted-set-cookie","OptanonAlertBoxClosed","$currentDate$"],["trusted-set-cookie","OptanonConsent","groups=C1%3A1%2CC2%3A0%2CC3%3A0%2CC4%3A0%2CC5%3A0%2CC8%3A0%2CC9%3A0&hosts=H184%3A1%2CH108%3A1%2CH109%3A1%2CH36%3A1%2CH58%3A1%2CH159%3A1%2CH37%3A1%2CH112%3A1%2CH331%3A1%2CH39%3A1%2CH348%3A1%2CH67%3A1%2CH115%3A1%2CH306%3A1%2CH63%3A1%2CH117%3A1%2CH118%3A1%2CH119%3A1%2CH120%3A1%2CH121%3A1%2CH122%3A1%2CH66%3A1%2CH304%3A0%2CH338%3A0%2CH40%3A0%2CH43%3A0%2CH183%3A0%2CH60%3A0%2CH274%3A0%2CH97%3A0%2CH142%3A0%2CH48%3A0%2CH49%3A0%2CH149%3A0%2CH83%3A0%2CH38%3A0%2CH176%3A0%2CH150%3A0%2CH330%3A0%2CH85%3A0%2CH151%3A0%2CH324%3A0%2CH402%3A0%2CH272%3A0%2CH14%3A0%2CH275%3A0%2CH23%3A0%2CH41%3A0%2CH101%3A0%2CH153%3A0%2CH6%3A0%2CH283%3A0%2CH42%3A0%2CH32%3A0%2CH145%3A0%2CH15%3A0%2CH322%3A0%2CH148%3A0%2CH333%3A0%2CH104%3A0%2CH55%3A0%2CH143%3A0%2CH17%3A0%2CH18%3A0%2CH57%3A0%2CH359%3A0%2CH129%3A0","1year","","reload","1"],["trusted-click-element","button[id=\"ue-accept-notice-button\"]","","2000"],["trusted-set-cookie","CONSENTMGR","c1:0|c2:0|c3:0|c4:0|c5:0|c6:0|c7:0|c8:0|c9:0|c10:0|c11:0|c12:0|c13:0|c14:0|c15:0|ts:1717325114359|consent:false"],["trusted-set-cookie","CCP","{\"publicuser\":{\"cat2\":\"off\",\"cat3\":\"off\",\"cat4\":\"off\"}}"],["trusted-set-cookie","mml-cookie-agreed-version","1.0.0"],["set-cookie","mml-cookie-agreed","2"],["trusted-click-element",".as-oil__close-banner","","1000"],["trusted-set-cookie","consentUUID","ce12400a-9c73-4bf8-8098-9e756366f942_34_38"],["trusted-set-cookie","consentUUID","4faab741-5ce6-430f-b701-df2242b1ff3d_34_38"],["trusted-set-cookie","consentUUID","80144095-b83e-4810-8fa7-7f9099ca6339_34_38"],["trusted-set-cookie","consentUUID","de4972d9-e581-40c3-921b-296d6456fad0_34"],["trusted-click-element","button.iubenda-cs-accept-btn","","2000"],["set-constant","_iub.cs.options.callback.onConsentRejected","noopFunc"],["set-constant","_iub.cs.options.callback.onConsentFirstRejected","noopFunc"],["trusted-click-element","button.iubenda-cs-close-btn"],["trusted-click-element","button[title=\"Akzeptieren und weiter\"]","","1000"],["trusted-set-cookie","CONSENTMGR","c1:0|c6:0|c9:0|ts:1718751098255|consent:false|id:01902d7e715a00551abb1b4878180206f003606700fb9","","","domain",".tedbaker.com"],["trusted-click-element",".qc-cmp2-summary-buttons > button[mode=\"secondary\"]"],["trusted-click-element","[class^=\"qc-cmp2-buttons\"] > [data-tmdatatrack=\"privacy-other-save\"]","","1000"],["trusted-click-element","button[mode=\"primary\"][data-tmdatatrack=\"privacy-cookie\"]","","1000"],["trusted-click-element","button[class*=\"cipa-accept-btn\"]","","1000"],["trusted-set-cookie","OptanonConsent","groups=C0001%3A1%2CC0002%3A0%2CC0003%3A1","","","domain","www.redbullracing.com"],["trusted-set-cookie","OptanonAlertBoxClosed","$currentDate$","","","domain","www.redbullracing.com"],["trusted-click-element","button.textbutton--contained___YZbU6","","1000"],["trusted-set-cookie","wnet_vppa_assent","{\"choice\":\"decline\",\"expires\":1}"],["trusted-set-cookie","OptanonAlertBoxClosed","$currentISODate$"],["trusted-click-element","button[data-testid=\"granular-banner-button-decline-all\"]","","1000"],["trusted-click-element","button[title=\"Godkänn alla cookies\"]","","1000"],["trusted-set-cookie","orejime","{%22mandatory%22:true%2C%22matomo-tag-manager%22:false}"],["trusted-click-element","button[title=\"Accepter\"]","","1000"],["trusted-click-element","#CybotCookiebotDialogBodyButtonDecline","","1000"],["trusted-set-cookie","GDPR_CONSENT","ACCEPT_NECESSARY"],["set-local-storage-item","cookieConsent","denied"],["trusted-click-element","button#consent_wall_optin"],["trusted-set-cookie","CONSENTMGR","c1:0%7Cc10:0%7Cc11:0%7Cc12:0%7Cc13:0%7Cc14:0%7Cc15:0%7Cc2:0%7Cc3:0%7Cc4:0%7Cc5:0%7Cc6:0%7Cc7:0%7Cc8:1%7Cc9:0%7Cconsent:true%7Cts:$now$","","","domain","1und1.de"],["trusted-set-cookie","tv2reg_cookie_consent","{\"revision\":1,\"consent\":[{\"handle\":\"necessary\",\"value\":true},{\"handle\":\"functional\",\"value\":false},{\"handle\":\"statistics\",\"value\":false},{\"handle\":\"preferences\",\"value\":false},{\"handle\":\"marketing\",\"value\":true}]}"],["trusted-click-element","button[title=\"Akzeptieren\"]","","1000"],["trusted-set-cookie","GSK_CONSENTMGR","c1:0%7Cc2:1%7Cc3:0%7Cc4:0%7Cc5:0%7Cc6:1%7Cc7:0%7Cc8:0%7Cc9:0%7Cc10:0%7Cc11:0%7Cc12:1%7Cc13:1%7Cc14:0%7Cc15:0%7Cts:1726229678052%7Cconsent:true%7Cid:0191eb4d9db7005233a45cef34fc0406f001a06700f1c"],["trusted-click-element","button#btn-gdpr-accept","","1500"],["set-constant","Object.prototype.hasConsent","trueFunc"],["set-constant","cmp_autoreject","true"],["prevent-setTimeout","checkPURLayerMustBeShown"],["trusted-set-cookie","ck","bbc3afa1f99650a097dc655e829ea82db262c98c%7Ee452fcf3a43bf2d79554343150020333","","","reload","1"],["trusted-click-element","button[mode=\"primary\"]","","1000"],["trusted-click-element","#qc-cmp2-container button#accept-btn"],["trusted-click-element","a.cmptxt_btn_no","","1000"],["trusted-click-element","[target=\"_self\"][type=\"button\"][class=\"_10qqh8uq\"]","","1000"],["trusted-click-element","button[title=\"Einwilligen und weiter\"]","","1000"],["trusted-set-cookie","bw_cookie_banner","{\"1\":true,\"2\":false,\"3\":false,\"timestamp\":$now$}"],["trusted-set-cookie","wbdLTP","68e3a742"],["trusted-set-cookie","_pm_datenschutz_cookie","80ce7170aa:false;4b086eb24b:true;3a0521a8ad:false","","","reload","1"],["trusted-set-cookie","PRADACONSENT_V3","c1:0|c3:0|c6:0|c9:1|ts:1732678796088|consent:true|id:01936bb4433700035e746aa2453d0406f002006700995"],["trusted-click-element","button.refuseAll","","1000"],["trusted-click-element","button[id=\"teal-consent-prompt-submit\"]","","1000"],["trusted-click-element","button[id=\"consent_prompt_submit\"]","","1000"],["trusted-click-element","button[name=\"accept\"]","","1000"],["trusted-click-element","button[id=\"explicit-consent-prompt-reject\"]","","1000"],["trusted-click-element","button[data-testid=\"uc-button-decline\"]","","1000"],["trusted-set-cookie","UBI_PRIVACY_AA_OPTOUT","true","","","domain","ubi.com"],["trusted-set-cookie","UBI_PRIVACY_ADS_OPTOUT","true","","","domain","ubi.com"],["trusted-set-cookie","UBI_PRIVACY_CUSTOMIZATION_OPTOUT","true","","","domain","ubi.com"],["trusted-set-cookie","UBI_PRIVACY_POLICY_ACCEPTED","true","","","domain","ubi.com"],["trusted-set-cookie","UBI_PRIVACY_POLICY_VIEWED","true","","","domain","ubi.com"],["trusted-click-element","a.cmptxt_btn_yes"],["trusted-click-element","[data-testid=\"consent-necessary\"]"],["trusted-click-element","button[id=\"onetrust-reject-all-handler\"]","","1500"],["trusted-click-element","button.onetrust-close-btn-handler","","1000"],["trusted-click-element","div[class=\"t_cm_ec_reject_button\"]","","1000"],["trusted-click-element","div.t_cm_ec_reject_button","","1000"],["trusted-set-cookie","gdpr-consent","eyJnZHByQ29uc2VudCI6dHJ1ZSwiYWNjZXB0QW5hbHl0aWNzIjpmYWxzZX0%3D.2E%2Fad7KO%2BBCTIdGO5NrEBzs4AewsGSs%2BOSs7w88rg7o","","","reload","1"],["trusted-set-cookie","acceptedCookies","{\"strictlyNecessary\":true,\"marketingCookies\":false}"],["trusted-set-cookie","cookie_notice","eyJpdiI6InAvamFqQUdoTmhCajR0RWdyQmI2K2c9PSIsInZhbHVlIjoiZDFFdXdZNHkwOFltT0ZPYmVJWURpWXExMTJQQmRSQ1RndThac3lhMEwzRFhnTTIyVkVxcHVuQU83d1pWY2srd2dGTHI3MU9BYkg1Rmc4VzNBK0s0N3BuUDlkWXN3T21RNUJabVBsSEhESEtjYmQ3NmJZajZ6RlNMcXFqaFhsbHpVc281SFBUSzFWVEFSNUthMkhoRlhzVnljSmlvZkZsSklONlZSU3pIcFhYR3VORHlkN2wyZGZScHZzY0gxR2VwKytmNG8wU3FQR2JtSjY0NVpYS2JwNHhHVW5PZ1c1cHZaZDBVdWNnRVExSTlGTU1KYmk1Y1hRNWw2VHdKRWlaYXBUNVlXV3lMUklKWHZhSEVseUJpbHlENHpORjJBM05GN09WcXgzYzVRY29CL3ZOMXFFQ2d2c2RHRW1JcVlaUFVGM3k5dktTOVBYZUR4WmRTakZjVEdnPT0iLCJtYWMiOiJjYTFkZDJlMzhhNDVkMzI2MzE1NGQ5ODVkM2Y2MzM2MGE2ZmY3ZWU3MWFhZGFkODEwNjU3OTZiZmI2MzZhNTlkIiwidGFnIjoiIn0%3D","","","reload","1"],["trusted-set-cookie","omCookieConsent","group-1.1,group-2.0,group-3.0,dismiss"],["trusted-click-element","button[title=\"Agree\"]","","1500"],["trusted-click-element","a.cookie-permission--accept-button","","1600"],["trusted-set-cookie","cookiepolicy","1-1861875183477"],["trusted-click-element","button#cb-RejectAll","","1000"],["trusted-click-element","button.hi-cookie-btn-accept-necessary","","1000"],["trusted-click-element","a#cookies-consent-essential","","1000"],["trusted-click-element","button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll","","1000"],["trusted-click-element","a.hi-cookie-continue-without-accepting","","1500"],["trusted-set-cookie","cookie_consent_v1","reject_all"],["trusted-set-cookie","_pandectes_gdpr","eyJzdGF0dXMiOiJjdXN0b20iLCJ0aW1lc3RhbXAiOjE3MzQ3OTQ2MjQsInByZWZlcmVuY2VzIjo2LCJpZCI6IjY3NjZkZDgxY2VmNzg3NzE0ZjU4YzAxZSJ9","1year"],["trusted-click-element","button[aria-label=\"Close\"]","","1000"],["trusted-click-element","a.cc-btn.cc-allow","","1000"],["trusted-click-element","a[id=\"consent_prompt_decline\"]","","1000"],["trusted-click-element","button[id=\"cm-acceptNone\"]","","1000"],["trusted-click-element","button.brlbs-btn-save","","1000"],["trusted-click-element","button[id=\"fupi_decline_cookies_btn\"]","","1000"],["trusted-click-element","button[onclick=\"Didomi.setUserDisagreeToAll();\"]","","1000"],["trusted-set-cookie","cookie-optIn","{\"required\":true,\"statistics\":false,\"thirdParty\":true}"],["trusted-set-cookie","BRENGER_CM","{\"ad_storage\":\"denied\",\"ad_user_data\":\"denied\",\"ad_personalization\":\"denied\",\"analytics_storage\":\"denied\"}"],["trusted-click-element","button[title*=\"Zustimmen\" i]","","1000"],["trusted-click-element","button[id=\"userSelectAll\"]","","1000"],["trusted-set-cookie","cpc_en_ww","eyJhIjoxLCJtIjoxLCJ2IjoxLjl9"],["trusted-click-element","div#cookieCloseIcon","","1000"],["trusted-click-element","button[title=\"Consent and continue\"]","","1000"],["trusted-set-cookie","cookie_consent","{\"cookies-necessary\":true,\"cookies-preferences\":true,\"cookies-analytical\":false,\"cookies-marketing\":false,\"cookies-other\":false}"],["trusted-set-cookie","cookie_consent_status","[\"necessary\"]","","","reload","1"],["trusted-click-element","button[data-cookiefirst-action=\"reject\"]","","1000"],["trusted-click-element",".gdpr-modal .gdpr-btn--secondary, .gdpr-modal .gdpr-modal__box-bottom-dx > button.gdpr-btn--br:first-child"],["set-cookie","cookie_consent","1","","reload","1"],["trusted-set-cookie","cookie_policy","1718029577"],["trusted-click-element","button#ensRejectAll","","1500"],["trusted-click-element","button[aria-label=\"Accept All\"]","","1000"],["trusted-set-cookie","cookieConsent","{\"ad_storage\":\"denied\",\"analytics_storage\":\"denied\",\"ad_user_data\":\"denied\",\"ad_personalization\":\"denied\"}"],["set-cookie","sgp-cp-acceptance","true"],["trusted-set-local-storage-item","cookies-consent-674994311cb8576b78bbaad6","{\"functional\":true,\"performance\":false,\"marketing\":false}"],["trusted-click-element","a#CybotCookiebotDialogBodyButtonAcceptAll","","1000"],["trusted-click-element","button[title=\"Kun nødvendige\"]","","2500"],["trusted-click-element","button[aria-label=\"Accept functional cookies only\"]","","1000"],["trusted-set-cookie","orejime","{\"functional\":true,\"analytical\":false,\"marketing\":false,\"targeting\":false,\"analytical_and_marketing_and_targeting\":false}"],["trusted-click-element","button[onclick=\"CookieInformation.declineAllCategories()\"]","","1000"],["trusted-click-element","button#btn-reject-all","","1000"],["trusted-click-element","button[data-consent-trigger=\"1\"]","","1000"],["trusted-click-element","button.reject-btn","","1000"],["trusted-click-element","button.accept-btn","","1000"],["trusted-click-element","a.cookie-consent--reject-button","","1000"],["trusted-set-cookie","cookie_preferences","{\"allow_all\":0,\"google_analytics\":0,\"accepted\":1}","","","reload","1"],["trusted-click-element","button[data-test-id=\"customer-necessary-consents-button\"]","","1000"],["trusted-click-element","button.button-large.secondary","","800"],["trusted-click-element","button.button-large.primary-accent","","1300"],["trusted-set-cookie","tavex_cookie_consent","{\"necessary\":true,\"preference\":false,\"marketing\":false,\"statistic\":false}"],["trusted-set-cookie","cookie_settings","{\"necessary\":true,\"marketing\":false,\"analytics\":false,\"preferences\":false}"],["trusted-set-local-storage-item","flipdish-cookies-expiry","$now$"],["set-local-storage-item","flipdish-cookies-preferences","necessary"],["trusted-click-element","button.cm-btn-accept","","1000"],["trusted-click-element","button[data-dismiss=\"modal\"]","","1000"],["trusted-set-cookie","cookiesPolicy","{\"analytics\":false,\"marketing\":false,\"functional\":false,\"essential\":true}"],["trusted-click-element","button.ot-bnr-save-handler","","1000"],["trusted-click-element","button[data-cookie-layer-accept=\"selected\"]","","1000"],["trusted-set-cookie","cookie-processed-02","ck_1:true%2Cck_2:false"],["trusted-click-element","button[id=\"ketch-banner-button-secondary\"]","","1000"],["trusted-click-element","button.cmpt_customer--cookie--banner--continue","","1000"],["trusted-click-element","button.cookiesgdpr__rejectbtn","","1000"],["trusted-click-element","button.oax-cookie-consent-select-necessary","","1000"],["trusted-set-cookie","CONSENTMGR","c2:0%7Cc3:0%7Cts:1737578911415%7Cconsent:false"],["trusted-click-element","button.js-cookie-accept-all","","1000"],["trusted-click-element","button#footer_tc_privacy_button_2","","1000"],["trusted-set-cookie","maandag-cookie-consent","{\"functional\":true,\"analytics\":false,\"advertising\":false,\"personalisation\":false,\"maccepted\":1}","","","reload","1"],["trusted-click-element","input[name=\"pill-toggle-external-media\"]","","500"],["trusted-click-element","button.p-layer__button--selection","","750"],["trusted-set-cookie","cs-cookie-banner","|essential|"],["trusted-click-element","button.blp-cookie-notice__btn--reject","","1000"],["trusted-click-element","button.btn--white.l-border.cookie-notice__btn","","1000"],["trusted-set-cookie","consentmode2","{\"ads\":false,\"analytics\":false,\"functional\":true,\"personal\":true,\"security\":true}","","","reload","1"],["trusted-set-cookie","cookiesDisclaimerVegvisits","VegvisitsDisclaimer"],["set-cookie","allowNonNecessaryCookies","false"],["trusted-set-cookie","CookieConsent_ConsentMode","{\"ad_storage\":\"denied\",\"analytics_storage\":\"denied\",\"functionality_storage\":\"denied\",\"personalization_storage\":\"denied\",\"security_storage\":\"granted\"}"],["trusted-click-element","button.js-accept-cookies-button","","1000"],["trusted-set-cookie","cs_cookie_prefs","[\"essential\"]"],["trusted-click-element","button[title=\"Jag godkänner\"]","","1000"],["trusted-click-element","button.btn-accept-necessary","","1000"],["trusted-click-element","button#popin_tc_privacy_button","","1000"],["trusted-set-cookie","_uc","ad_storage=denied:analytics_storage=denied"],["trusted-click-element","button#saveCookieSelection","","1000"],["trusted-set-cookie","noticeCookie","{\"cookieNeeded\":true,\"cookiePerfomance\":true,\"cookieFunctionality\":false,\"cookieTargeted\":false,\"cookieSocial\":false}"],["trusted-set-cookie","polityka-prywatnosci-b4utxgfk","on_init","","","reload","1"],["trusted-set-cookie","privacy_settings","{\"analytics_storage\":\"denied\",\"ad_storage\":\"denied\",\"ad_user_data\":\"denied\",\"ad_personalization\":\"denied\",\"personalization_storage\":\"denied\"}"],["trusted-set-cookie","gsbbanner","closed"],["set-cookie","cmplz_rt_banner-status","dismissed"],["trusted-click-element","button[data-role=\"necessary\"]","","1000"],["trusted-set-cookie","gdpr_preferences","{\"consent\":false,\"pref\":{\"analytics\":0,\"targeting\":0,\"thirdparty\":0},\"ts\":1}"],["trusted-click-element","button[onclick=\"wsSetAcceptedCookies(this);\"]","","1000"],["trusted-set-cookie","CookieConsent","mandatory"],["trusted-click-element","button#popin-cookies-btn-refuse","","1000"],["trusted-click-element","button.AP_mdf-accept","","1500"],["trusted-click-element","button[data-cy=\"iUnderstand\"]","","1000"],["trusted-click-element","button.cky-btn-reject","","1000"],["trusted-click-element","button#consentDisagreeButton","","1000"],["trusted-set-cookie","cookie_consent","{\"required_cookies\":\"true\",\"permanent_cookies\":\"false\",\"statistics_cookies\":\"false\",\"marketing_cookies\":\"false\"}","","","reload","1"],["trusted-click-element","button.js-acceptNecessaryCookies","","1000"],["trusted-click-element","button.env-button--primary","","1000"],["trusted-set-cookie","cookieConsent","{\"essential\":1,\"statistics\":0,\"advertisement\":0}"],["trusted-click-element","button[value=\"essential\"]","","1000"],["trusted-click-element","button.manage-cookies","","500"],["trusted-click-element","button.save.primary-button","","750"],["trusted-click-element","button.ch2-deny-all-btn","","1500"],["trusted-set-cookie","cookies_consent","!gtag=false"],["trusted-set-cookie","bm-cookies-settings-v2","{\"basic\":true,\"functional\":false,\"analytic\":false}"],["trusted-click-element","button#shopify-pc__banner__btn-decline","","1000"],["trusted-set-cookie","COOKIE_CONSENT","ALLOW_REQUIRED","","","reload","1"],["trusted-click-element","button[data-testid=\"reject-all-cookies-button\"]","","1000"],["trusted-set-cookie","gdprconsent","{basic:true,useful:false,analytics:false,marketing:false}"],["trusted-set-cookie","cookiesConsent","{\"marketing\":false,\"analytic\":false,\"preferences\":false}","","","reload","1"],["trusted-set-cookie","cookiesjsr","{\"base\":false,\"analytics\":false}"],["trusted-set-cookie","COOKIES_SETTINGS_N","technicalallowed"],["trusted-set-cookie","cookie-consent","{\"functional\":false,\"marketing\":false}"],["trusted-click-element","button#cookie-custom","","1200"],["trusted-click-element","button#cookie-save","","1800"],["trusted-click-element","button.cm-btn-success","","1000"],["trusted-set-cookie","cookieconsent_status","!tarteaucitron=true!website=true!youtube=true!openstreetmap=true!matomo=false"],["trusted-set-cookie","consent_cookiespolicy","V2"],["trusted-set-cookie","consent_privacypolicy","V2"],["trusted-set-cookie","consent_termsofuse","V3"],["trusted-click-element","button#btn-accept-banner","","1000"],["trusted-click-element","a.disable-cookies","","1000"],["trusted-click-element","button.btn_cookie_savesettings","","500"],["trusted-click-element","button.btn_cookie_savesettings","","750"],["trusted-set-cookie","_x13eucookie","{\"1\":true,\"2\":false,\"3\":false,\"4\":false,\"5\":true}"],["trusted-click-element","span[data-qa-selector=\"gdpr-banner-configuration-button\"]","","300"],["trusted-click-element","span[data-qa-selector=\"gdpr-banner-accept-selected-button\"]","","500"],["trusted-click-element","button[data-cookies=\"disallow_all_cookies\"]","","1000"],["trusted-set-cookie","cookie_consent_consent","gived"],["trusted-set-local-storage-item","cookieformData","option0=1&analytical=0&performance=0&targeting=0&functional=0&marketing=0"],["trusted-set-cookie","_consentik_cookie","[{\"categoriesSelected\":[\"necessary\"]}]"],["trusted-click-element","a.cc-deny","","1000"],["trusted-click-element","button.cc-deny","","1000"],["trusted-click-element","button[aria-label=\"Accept selected cookies\"]","","1000"],["trusted-click-element","button.orejime-Modal-saveButton","","1000"],["trusted-click-element","button[data-test=\"button-customize\"]","","500"],["trusted-click-element","button[data-test=\"button-save\"]","","750"],["trusted-click-element","button.cc-decline","","1000"],["trusted-set-cookie","consent_cookie","{\"ad_storage\":\"denied\",\"analytics_storage\":\"denied\",\"ad_user_data\":\"denied\",\"ad_personalization\":\"denied\"}","","","reload","1"],["trusted-set-cookie","cookieBasic","$now$"],["trusted-set-cookie","nebo","{\"acceptance\":true,\"analytics\":false}"],["trusted-click-element","button[onclick=\"CookieConsent.apply(['ESSENTIAL'])\"]","","1000"],["trusted-set-local-storage-item","procookie-dismissed","$now$"],["trusted-set-local-storage-item","procookie-services","[\"cookie_notice\"]"],["trusted-set-cookie","consent","S.false-T.false"],["set-cookie","pcseucookie","true","","reload","1"],["trusted-set-cookie","privacySettings","%7B%22cookieTypes%22%3A%7B%22performance%22%3Afalse%2C%22komfort%22%3Afalse%2C%22marketing%22%3Afalse%7D%2C%22showBanner%22%3Afalse%7D"],["trusted-click-element","button.dp_accept","","1000"],["trusted-click-element","button.cookiebanner__buttons__deny","","1000"],["trusted-click-element","a[onclick=\"cmp_pv.cookie.saveConsent('onlyLI');\"]","","1000"],["trusted-click-element","button#cmCloseBanner","","1000"],["trusted-click-element","button#btn-accept-required-banner","","1000"],["trusted-set-cookie","dw_cookies_accepted","{\"other\":false,\"analytical\":false,\"advertising\":false,\"social_networks\":false}"],["trusted-click-element","button#popin_tc_privacy_button_2","","1800"],["trusted-click-element","button#popin_tc_privacy_button_3","","1000"],["trusted-click-element","[aria-label=\"allow cookies\"]","","1000"],["trusted-click-element","button[aria-label=\"allow cookies\"]","","1000"],["trusted-set-cookie","cookieConsent","{\"necessary\":\"1\",\"statistics\":\"0\",\"advertising\":\"0\"}","","","reload","1"],["trusted-set-cookie","GDPR_Consent","{\"essential\":true,\"functional\":true,\"analytical\":false,\"advertising\":false}"],["trusted-click-element","div.privacy-more-information","","600"],["trusted-click-element","div#preferences_prompt_submit","","750"],["trusted-click-element","button.swal2-cancel","","1000"],["trusted-click-element","button.fides-reject-all-button","","1000"],["trusted-set-local-storage-item","cookiesManager","{\"acceptedCategories\":[\"necessary\"]}"],["set-cookie","cookie-agreed","2"],["trusted-set-cookie","cookie-agreed-categories","[\"mandatory\"]"],["trusted-set-cookie","cookie-agreed-version","1.0.0"],["trusted-set-cookie","allow-cookies","essential-only"],["trusted-click-element","a#CookieBoxSaveButton","","1000"],["trusted-click-element","span[data-content=\"WEIGEREN\"]","","1000"],["trusted-set-cookie","VisitorCookieSettings","{\"functional\":true,\"advertising\":false,\"tracking\":false,\"timestamp\":1}"],["trusted-set-cookie","Consent_status","!youtube=true!matomo=false!tarteaucitron=true"],["trusted-set-cookie","cookieConsent","{\"preferences\":false,\"analytics\":false,\"marketing\":false}"],["trusted-set-local-storage-item","cookieMonster","war schon da"],["trusted-click-element","button.reject","","1000"],["trusted-click-element","button.cn-decline","","1000"],["trusted-click-element",".cvcm-cookie-consent-settings-basic__learn-more-button","","600"],["trusted-click-element",".cvcm-cookie-consent-settings-detail__footer-button","","750"],["set-cookie","cookieControl","true"],["trusted-set-cookie","cookieControlPrefs","[\"maps\"]"],["trusted-click-element","span.decline","","1500"],["trusted-set-cookie","evendo_privacysettings","{\"confirmed\":1,\"level\":2,\"state\":{\"t\":{\"accept\":1},\"p\":{\"accept\":0},\"s\":{\"accept\":0},\"k\":{\"accept\":0}}}"],["trusted-click-element","button[data-role=\"reject-rodo\"]","","2500"],["trusted-set-cookie","privacy","{\"cga\":0,\"cgc\":0,\"cfb\":0,\"cfb_share\":0,\"cvwo\":0}"],["trusted-click-element","button[data-stellar=\"Secondary-button\"]","","1500"],["set-cookie","cookieconsent_status","deny"],["trusted-set-cookie","cookieconsent_mode","[]"],["trusted-set-local-storage-item","cookieSettings","\"{\\\"necessary\\\":true,\\\"functional\\\":false,\\\"performance\\\":false,\\\"targeting\\\":false}\""],["trusted-set-cookie","orejime","{\"strictly_necessary\":1,\"tracking\":false}"],["trusted-set-cookie","orejime","{\"core\":true,\"analytics\":false,\"streaming\":false}"],["trusted-click-element","button#declineButton","","1000"],["trusted-click-element","a[fs-cc=\"deny\"]","","1000"],["trusted-click-element",".dsgvo-cookie-modal .content .dsgvo-cookie .cookie-permission--content .dsgvo-cookie--consent-manager .cookie-removal--inline-manager .cookie-consent--save .cookie-consent--save-button","","1000"],["trusted-set-cookie","gdprCookiesAccepted","bhWebsiteAccepted:true"],["trusted-set-cookie","vzs_consent_necessary","granted"],["trusted-click-element","button#consent_wall_optout","","1000"],["trusted-set-cookie","CookieScriptConsent","{\"action\":\"reject\",\"categories\":\"[]\"}"],["trusted-click-element","button#footer_tc_privacy_button_3","","1000"],["trusted-set-cookie","ols_cookieconsent","disagree"],["trusted-set-local-storage-item","cookieConsent","{\"functional\":true,\"statistical\":false,\"marketing\":false}"],["trusted-set-local-storage-item","cookiefirst-consent","{\"necessary\":true,\"performance\":false,\"functional\":false,\"advertising\":false,\"timestamp\":1,\"type\":\"category\",\"version\":\"1\"}"],["trusted-set-cookie","BokioDNT","DoNotTrack"],["trusted-click-element","div.agree-mandatory","","1000"],["trusted-set-cookie","COOKIE_CONSENT","functi-0|market-0"],["trusted-set-cookie","cookie-ag","{\"necessary\":1,\"functional\":0,\"performance\":0,\"marketing\":0}"],["trusted-click-element","button.modal-cookie-consent-btn-reject","","1000"],["trusted-set-cookie","toc_cookie_consent","strictly_necessary"],["trusted-set-cookie","cookiefirst-consent","%7B%22necessary%22%3Atrue%2C%22performance%22%3Afalse%2C%22functional%22%3Atrue%2C%22advertising%22%3Afalse%2C%22type%22%3A%22category%22%7D","1year"],["trusted-click-element","button.cookiesBtn__link","","1000"],["trusted-set-cookie","cookiesjsr","{\"what_are_cookies_\":true,\"analytical_cookies\":false,\"functional\":true,\"functional_cookies\":true}"],["trusted-click-element","button.button-tertiary","","600"],["trusted-click-element","button[class=\"focus:text-gray-500\"]","","1000"],["trusted-click-element",".cookie-overlay[style] .cookie-consent .cookie-button-group .cookie-buttons #cookie-deny","","1000"],["trusted-set-cookie","cookies-preferences","{\"functionalCookies\":true,\"analyticalCookies\":false,\"marketingCookies\":false}"],["trusted-set-cookie","cookiebar","{\"analytics_storage\":\"denied\",\"ad_storage\":\"denied\",\"personalization_storage\":\"denied\"}"],["trusted-set-cookie","thbcookies","{\"1\":0}"],["trusted-set-cookie","CMP","{\"categoryPreferences\":{\"essential\":true,\"analytics\":false,\"functional\":false,\"advertising\":false}}","","","reload","1"],["trusted-set-local-storage-item","consentMode","{\"functionality_storage\":\"granted\",\"security_storage\":\"granted\",\"analytics_storage\":\"denied\",\"personalization_storage\":\"granted\",\"ad_storage\":\"denied\",\"ad_user_data\":\"denied\",\"ad_personalization\":\"denied\"}"],["trusted-set-cookie","user_allowed_save_cookie_v2","%7B%224%22%3A1%7D","1year"],["trusted-set-cookie","user_allowed_save_cookie","%7B%224%22%3A1%7D","1year"],["trusted-click-element","button#denyBtn","","1000"],["trusted-click-element","button#accept-all-cookies","","1000"],["trusted-click-element","button[data-testid=\"zweiwegen-accept-button\"]","","1000"],["trusted-set-local-storage-item","cookies.consent","{\"chosen\":true,\"internal\":true,\"external\":false}"],["trusted-click-element","button.essential","","1000"],["trusted-set-cookie","cookie-consent","{\"functional\":true,\"analytics\":false,\"marketing\":false}","","","reload","1"],["trusted-set-cookie","gdpr","{\"types\":[\"ESSENTIAL\"],\"platform\":\"web\"}"],["trusted-set-cookie","cookies_and_content_security_policy","[]"],["trusted-click-element","button#cookie-accept","","1800"],["trusted-click-element","button[title=\"Close cookie notice without specifying preferences\"]","","1000"],["trusted-set-cookie","fyCcDecision","{\"ccStatistics\":false}"],["trusted-click-element","button#gr-btn-agree","","1000"],["trusted-set-cookie","gdpr_c","c","","","reload","1"],["trusted-set-local-storage-item","cookieSettings","{\"essential\":true,\"statistics\":false,\"thirdparty\":false,\"cookiesAccepted\":true}"],["trusted-click-element","button[onclick*=\"(()=>{ CassieWidgetLoader.Widget.rejectAll\"]","","1000"],["trusted-click-element","button.fig-consent-banner__accept","","1000"],["trusted-set-local-storage-item","user_anonymous_profile","{\"config\":{\"tracking\":false,\"userprofile\":false,\"youtube\":true,\"twitter\":true,\"facebook\":true,\"iframe\":true,\"video\":{\"useSubtitles\":true,\"useAudioDescription\":true}},\"votings\":[],\"msgflash\":[],\"history\":[]}"],["trusted-click-element","button#axeptio_btn_dismiss","","1000"],["trusted-set-cookie","userconsent","v2|"],["trusted-set-cookie","in2cookiemodal-selection","[%22essential%22]"],["trusted-click-element","button.cc-nb-reject","","1000"],["trusted-set-cookie","okosgazdi_gdpr_cookies_accepted_list","{\"0\":\"necessary\"}"],["set-cookie","okosgazdi_gdpr_cookies_state_agreed","1","","reload","1"],["trusted-click-element","button[aria-label=\"Only necessary\"]","","1000"],["trusted-set-cookie","mycookies_v2","{\"statistik\":false}"],["trusted-set-cookie","cc_cookie_accept","null"],["trusted-set-cookie","cc_cookie_decline","cc_cookie_decline"],["trusted-set-cookie","cookie-agreed","C0000"],["trusted-click-element","button#cookie-consent-decline","","1000"],["trusted-set-cookie","ac","{\"version\":\"1\",\"functional_storage\":\"denied\",\"analytics_storage\":\"denied\",\"ad_storage\":\"denied\"}","","","reload","1"],["trusted-set-cookie","ac","{\"version\":\"1\",\"functional_storage\":\"granted\",\"analytics_storage\":\"denied\",\"ad_storage\":\"denied\"}","1year","","reload","1"],["trusted-click-element","button.osano-cm-denyAll","","1000"],["trusted-click-element","button.bh-cookies-popup-save-selection","","1000"],["trusted-click-element","#cookiescript_reject","","500"],["trusted-click-element","._brlbs-refuse-btn > ._brlbs-cursor._brlbs-btn","","1000"],["trusted-click-element",".cookie-footer > button[type=\"submit\"]","","1000"],["trusted-set-cookie","tarteaucitron","!gtag=false!youtube=true"],["trusted-click-element","button.it-cc__button-decline","","1000"],["trusted-set-local-storage-item","accepted_tos","20241119"],["trusted-set-cookie","consentCookie","{\"necessary\":\"NO_CHOICE\",\"functional\":\"DENIED\",\"performance\":\"DENIED\",\"targeting\":\"DENIED\",\"social\":\"DENIED\"}"],["trusted-set-cookie","cookie_consent","{\"essential\":true,\"uid\":\"1\"}","","","reload","1"],["trusted-set-local-storage-item","btdm.cookies","[0,1]"],["trusted-set-local-storage-item","cookie-preferences","{\"analytics-cookies\":false,\"profiling-cookies\":false}"],["set-local-storage-item","cookie-notice-dismissed","true"],["set-local-storage-item","cookie-notice-accepted-version","1"],["set-local-storage-item","accepts-cookie-notice","true"],["trusted-click-element","#cookietoggle, input[id=\"CookieFunctional\"], [value=\"Hyväksy vain valitut\"]"],["trusted-set-cookie","_pandectes_gdpr","eyJzdGF0dXMiOiJjdXN0b20iLCJ0aW1lc3RhbXAiOjE3NDA0MjY0MjksInByZWZlcmVuY2VzIjo2LCJpZCI6IjY3YmNjY2JkYTNmMTg5MGNkMGQ1Mjk2YyJ9","1year"],["trusted-click-element","a.necessary_cookies","","1200"],["trusted-click-element","a.gdpr-cookie-notice-nav-item-decline","","1000"],["trusted-click-element",".show .modal-dialog .modal-content .modal-footer .s-cookie-transparency__btn-accept-all-and-close","","1000"],["trusted-click-element","button.gdpr-accept-all-btn","","1000"],["trusted-click-element","div[class=\"hylo-button\"][role=\"button\"]","","1000"],["trusted-click-element","a#emCookieBtnAccept","","1000"],["trusted-set-cookie","crgpd","UUID=1;CUSTOM_USER_ID=;USER_HAS_MADE_CHOICE=true;ANALYTICS_COOKIES=false;FUNCTIONAL_COOKIES=false;ADVERTISING_COOKIES=false"],["trusted-set-cookie","frank_cookie_settings_v2","{\"consents\":[\"functional\",\"personal\"],\"acceptedAt\":\"1\"}"],["trusted-set-cookie","cookie.setting","basic"],["trusted-click-element","button.btn-secondary","","1800"],["trusted-set-local-storage-item","cookie_policy","{\"data\":\"agreed\"}"],["trusted-click-element","a#alcaCookieKo","","1000"],["trusted-click-element","div[class]:has(a[href*=\"holding.wp.pl\"]) div[class]:only-child > button[class*=\" \"] + button:not([class*=\" \"])","","2300"],["trusted-click-element","body > div[class] > div[class] > div[class] > div[class][aria-label=\"Treść informacji\"][aria-live=\"polite\"] + div[class] > div[class]> button:last-child"],["trusted-click-element","div[class]:has(a[href*=\"holding.wp.pl\"]) div[class]:only-child > button[class*=\" \"]:not(#wp-article-save-button) + button:not([class*=\" \"])"],["trusted-click-element","body > div[class] > div[class] > div[class]:has(a[href*=\"holding.wp.pl\"]) > div[class] > div[class]:only-child > button:first-child"],["trusted-click-element","[id=\"CybotCookiebotDialogBodyButtonDecline\"]","","2000"],["set-cookie","_scw_rgpd_functional","true"],["trusted-click-element","button.cta-size-big.cta-outline"],["trusted-set-local-storage-item","cookie-consent","{\"name\":\"cookie-consent\",\"default\":false,\"date\":\"$currentDate$\",\"permissions\":{\"ad_personalization\":\"denied\",\"ad_storage\":\"denied\",\"ad_user_data\":\"denied\",\"analytics_storage\":\"denied\",\"personalization_storage\":\"denied\",\"functionality_storage\":\"granted\",\"security_storage\":\"granted\"}}"],["trusted-set-cookie","cookie-consent-v2","{\"necessary\":true,\"analytical\":false,\"marketing\":false,\"functional\":true}","1year"],["trusted-set-cookie","cookieConsent","[{\"name\":\"essenziell\",\"value\":\"on\"},{\"name\":\"komfort\",\"value\":\"off\"},{\"name\":\"marketing\",\"value\":\"off\"},{\"name\":\"statistik\",\"value\":\"off\"},{\"name\":\"speichern\",\"value\":\"on\"}]"],["trusted-set-cookie","sparda.privacySettings","[\"necessary\",\"\",\"\",\"\"]"],["trusted-set-cookie","cookie_info","all:0|req:1|track:1|marketing:0|social:0"],["trusted-click-element","div[data-project=\"mol-fe-cmp\"] button[class*=\"level1PrimaryButton-\"]:not([class*=\"reject\"])"],["trusted-set-local-storage-item","cookie_bar","manually closed"],["trusted-set-cookie","cookie_consent","{\"necessary\":true,\"targeting\":false,\"performance\":false,\"viewed\":true}"],["trusted-click-element",".cookie-banner--open button[data-variant=\"primary\"] + [data-variant=\"primary\"]","","1000"],["trusted-set-local-storage-item","cookie_consent","{\"essential\":true,\"analytics\":false}"],["trusted-click-element","button[data-hook=\"consent-banner-decline-all-button\""],["trusted-click-element","button#c-t-bn"],["trusted-set-cookie","CONSENTMGR","c1:1|c2:0|c3:0|c8:1|ts:$now$|consent:true"],["trusted-set-cookie","gds-consent-hash","0d7555b001c8bc3a6837585c5cebc0f6","1year"],["trusted-set-cookie","gds-consent","{\"consents\":{\"necessary\":true,\"preferences\":true,\"statistics\":false,\"marketing\":false}}","1year"],["trusted-set-cookie","cookie-consent-1","{\"1\":true,\"2\":false,\"3\":false,\"4\":false}"],["trusted-set-cookie","cookie_consent","%7B%22functionality_storage%22%3Atrue%2C%22statistics_storage%22%3Afalse%2C%22ad_storage%22%3Afalse%7D","1year","","reload","1"],["trusted-click-element","#CybotCookiebotDialog input#CybotCookiebotDialogBodyLevelButtonPreferences, #CybotCookiebotDialog input#CybotCookiebotDialogBodyLevelButtonStatistics, #CybotCookiebotDialog input#CybotCookiebotDialogBodyLevelButtonMarketing, #CybotCookiebotDialog button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection"],["trusted-click-element","[style] > [style] > s-button[data-testid=\"button--einstellungen-speichern\"] > button.s-button__button"],["set-cookie","consent_technical","ALLOW"],["set-cookie","consent_marketing","DENY"],["set-cookie","consent_functional","DENY"],["trusted-set-cookie","consent_version","2.8"],["trusted-click-element","button#disclaimer-reject_cookies-btn"],["trusted-click-element","[role=\"button\"][class*=\"366\"]"],["trusted-click-element","[id=\"qc-cmp2-ui\"] [mode=\"secondary\"]","","2000"],["trusted-click-element","[id=\"qc-cmp2-ui\"] button[class*=\"css-\"]:nth-of-type(1)","","3000"],["trusted-click-element","button.button.accept","","2000"],["trusted-set-local-storage-item","state/privacy/familyModeCookieConsentShown","{\"time\":$now$,\"value\":\"true\"}"],["trusted-set-local-storage-item","state/privacy/pokiAnalytics","{\"time\":$now$,\"value\":\"false\"}"],["trusted-click-element","#notice button[title=\"Godkänn alla\"]"],["trusted-set-cookie","starter-cookie-data","hasAckowledged"],["trusted-click-element","button.cky-btn-accept"],["trusted-click-element",".message-component button[aria-label=\"Reject\"]"],["trusted-set-local-storage-item","cookieConsent_1004","{\"essential\":true,\"analytics\":false,\"timestamp\":\"$currentISODate$\"}"],["trusted-click-element","#BorlabsCookieBox input#checkbox-external-media,100,#BorlabsCookieBox a#CookieBoxSaveButton"],["trusted-set-local-storage-item","cookie_consent","{\"necessary\":true,\"analytics\":false,\"marketing\":false}"]];
const HOSTS = {"sourcepointcmp.bloomberg.co.jp":[0,1,2],"express.co.uk":[3,4],"cmpv2.standard.co.uk":[5,6],"cmpv2.independent.co.uk":[7],"independent.co.uk":[2],"procvetok.*":[8],"stwater.co.uk":[9,10],"cineplex.de":[11],"egmont.com":[11],"euroatla.pt":[11],"finanzmarktwelt.de":[11],"hoyavision.com":[11],"wwf.fi":[11],"dasinvestment.com":[12],"fof.se":[12],"mein-grundeinkommen.de":[12],"rmg.co.uk":[13],"chase.co.uk":[14],"komoot.com":[15],"screen.studio":[16],"hwebber.co.uk":[17],"vivantis-shop.at":[18,19],"fplstatistics.co.uk":[20,21],"spv.no":[22],"aonsolutions.es":[23],"walmart.ca":[24],"m2o.it":[25],"what3words.com":[26],"auf1.tv":[27,28],"planningportal.co.uk":[29],"vadhander.kramfors.se":[30],"nature.com":[31],"kotaku.com":[32,33],"mic.eucast.org":[34],"hatch.co":[35],"virgin.com":[36],"tvpworld.com":[37,38,39],"mediamarktsaturn.com":[40],"vm.co.mz":[41,42],"uber.com":[43,44],"webnode.com":[45],"buywholefoodsonline.co.uk":[46],"www.saal-digital.de":[47,48],"lilly.com":[49],"veikkaus.fi":[50,51],"aimigo.coach":[52],"welcomestores.gr":[53],"gallup.com":[54,55],"imusic.*":[56],"filehippo.com":[57],"filehippo.de":[58],"filehippo.jp":[59],"filehippo.pl":[60],"bockscornerbrewery.com":[61],"mydealz.de":[62],"dealabs.com":[62],"vaasaevl.fi":[63],"spares2repair.co.uk":[64],"autodeler.co.no":[65,66],"buycarparts.co.uk":[65,66],"czesciauto24.pl":[65,66],"recambioscoches.es":[65,66],"theweathernetwork.com":[67],"mediaguru.cz":[68],"diamantrad.com":[69],"lpi.org":[69],"ispazio.net":[70],"schroders.com":[71],"ardushop.ro":[72],"groupeonepoint.com":[73],"lingvanex.com":[73],"hailo-windsystems.com":[74],"erneuerbare-energien-aktuell.de":[75],"hoerbert.com":[75],"oloid.de":[75],"straschu-ev.de":[75],"zahnspange-oelde.de":[75],"consent.formula1.com":[76],"platoapp.com":[77],"dailymail.co.uk":[78],"1001jocuri.ro":[79,80,81],"1001spiele.de":[79,80,81],"mtvuutiset.fi":[79,82],"avladies.de":[83],"badeladies.de":[83],"busenladies.de":[83],"dominanteladies.de":[83],"massierendeladies.de":[83],"orientladies.de":[83],"piercingladies.de":[83],"tsladies.de":[83],"1a-finanzmarkt.de":[84],"1a-immobilienmarkt.de":[84],"vogue.co.uk":[85],"jekabpils.lv":[86],"radiox.co.uk":[87],"just-eat.*":[88,89,90],"digi24.ro":[91],"nintendolife.com":[91],"theaa.ie":[91],"x.com":[92],"mundodeportivo.com":[93,94,95],"ubs.com":[96],"vicko.gr":[97],"lachainemeteo.com":[98],"noctua.at":[99],"viajerospiratas.es":[100],"go-e.com":[101,102],"goed.at":[103],"hiprom.pl":[104],"supportart.pl":[104],"chrono24.*":[105,106],"youmath.it":[107],"omgevingsloketinzage.omgeving.vlaanderen.be":[108,109,110],"nd.nl":[111],"mediaset.it":[112],"primor.eu":[113,114],"ab.gr":[115],"calciomercato.com":[116],"fortune.com":[117],"collectibles.mclaren.com":[118],"tobis.de":[119],"lanazione.it":[120],"lekarnaave.cz":[121],"mafu.de":[122],"raymond-weil.com":[123],"brut.media":[123],"decathlon.fr":[123,124],"jobijoba.*":[123],"lejdd.fr":[123,95],"lamontagne.fr":[123],"meteofrance.com":[123],"rmcbfmplay.com":[123,125],"andersiahotel.pl":[126],"advalvas.vu.nl":[127],"tredz.co.uk":[79,128],"krasa.cz":[18,19],"butterflyshop.dk":[129,130,131,132],"mishcon.com":[133,134],"wolfswinkel.*":[135],"www.aok.de":[136],"meine.aok.de":[137],"matkahuolto.fi":[138],"soprema.es":[139],"omroepwest.nl":[140],"stilord.com":[141],"stilord.pl":[141],"stilord.de":[141],"stilord.fr":[141],"21vek.by":[142,143,144],"allocine.fr":[145],"le10sport.com":[145],"cmp2.freiepresse.de":[146],"kosik.cz":[147],"blackpoolgazette.co.uk":[148],"lep.co.uk":[148],"northamptonchron.co.uk":[148],"scotsman.com":[148],"thestar.co.uk":[148],"portsmouth.co.uk":[148],"sunderlandecho.com":[148],"anguscountyworld.co.uk":[148],"banburyguardian.co.uk":[148],"bedfordtoday.co.uk":[148],"biggleswadetoday.co.uk":[148],"bucksherald.co.uk":[148],"buxtonadvertiser.co.uk":[148],"chad.co.uk":[148],"daventryexpress.co.uk":[148],"derbyshiretimes.co.uk":[148],"derbyworld.co.uk":[148],"dewsburyreporter.co.uk":[148],"doncasterfreepress.co.uk":[148],"falkirkherald.co.uk":[148],"fifetoday.co.uk":[148],"halifaxcourier.co.uk":[148],"harboroughmail.co.uk":[148],"harrogateadvertiser.co.uk":[148],"hartlepoolmail.co.uk":[148],"hemeltoday.co.uk":[148],"hucknalldispatch.co.uk":[148],"lancasterguardian.co.uk":[148],"leightonbuzzardonline.co.uk":[148],"lutontoday.co.uk":[148],"meltontimes.co.uk":[148],"miltonkeynes.co.uk":[148],"newcastleworld.com":[148],"newsletter.co.uk":[148],"northantstelegraph.co.uk":[148],"northumberlandgazette.co.uk":[148],"nottinghamworld.com":[148],"peterboroughtoday.co.uk":[148],"rotherhamadvertiser.co.uk":[148],"stornowaygazette.co.uk":[148],"surreyworld.co.uk":[148],"thescarboroughnews.co.uk":[148],"thesouthernreporter.co.uk":[148],"wakefieldexpress.co.uk":[148],"wigantoday.net":[148],"worksopguardian.co.uk":[148],"yorkshireeveningpost.co.uk":[148],"yorkshirepost.co.uk":[148],"leabank.no":[149],"tlkhorgaszaruhaz.hu":[150],"white.market":[151],"milwaukeetool.eu":[152,153],"elmundo.es":[154,125],"barclays.co.uk":[155],"home.barclays":[156],"maanmittauslaitos.fi":[157,158],"raiplay.it":[159],"chip.de":[160],"pcwelt.de":[161],"geo.de":[162],"lbc.co.uk":[163],"cdt.ch":[164],"multiplayer.it":[164],"skuola.net":[164],"today.it":[164],"ilsecoloxix.it":[165,166,167],"consent.desired.de":[168],"tedbaker.com":[169],"dailystar.co.uk":[170,171,172,173],"mirror.co.uk":[170,171,172,173],"redbullracing.com":[174,175],"ibellud.com":[95],"atresmediapublicidad.com":[95],"autopista.es":[95],"belfasttelegraph.co.uk":[95],"bemad.es":[95],"challenges.fr":[95],"decathlon.nl":[95],"decathlon.pl":[95],"di.se":[95],"diariocordoba.com":[95],"dn.se":[95],"dnevnik.hr":[95],"elcorreo.com":[95],"elperiodico.com":[95],"elplural.com":[95],"expressen.se":[95],"ghacks.net":[95],"lacoste.com":[95],"lanouvellerepublique.fr":[95],"lasprovincias.es":[95],"lavozdegalicia.es":[95],"ledauphine.com":[95],"libremercado.com":[95],"mediaset.es":[95],"nicematin.com":[95],"numerama.com":[95,176],"rankia.com":[95],"rtbf.be":[95,124],"techcrunch.com":[95],"telequebec.tv":[95],"tportal.hr":[125],"ivoox.com":[125],"mein-mmo.de":[125],"allarts.org":[177],"sportiva.shueisha.co.jp":[178],"wpb.shueisha.co.jp":[178],"americanexpress.com":[179],"cmp.omni.se":[180],"uliege.be":[181],"consent.geo.fr":[182],"mineralstech.com":[183],"shipping-portal.com":[184],"mundwerk-rottweil.de":[185],"1und1.de":[186,187],"tvsyd.dk":[188],"cmp.tvtoday.de":[189],"cmp.chip.de":[189],"gsk.com":[190],"yourweather.co.uk":[191],"winfuture.de":[192,193,194],"pekro.cz":[195],"dailypost.co.uk":[196],"dailyrecord.co.uk":[197],"stagatha-fachklinik.de":[198],"lz.de":[198],"otempo.pt":[199],"dnn.de":[200],"gnz.de":[200],"torgauerzeitung.de":[200],"airfrance.*":[201],"golfdigest.com":[202],"wavecon.de":[203],"prada.com":[204],"sinergy.ch":[205],"hsbcinnovationbanking.com":[206],"hsbc.co.uk":[207],"about.hsbc.co.uk":[208],"argos.co.uk":[209],"mobi24.es":[210],"mobi24.it":[210],"ubi.com":[211,212,213,214,215],"connect.de":[216],"insideparadeplatz.ch":[216],"verksamt.se":[217],"amtrak.com":[218],"centrum.sk":[218],"credit-suisse.com":[218],"ceskatelevize.cz":[218],"dunelm.com":[218],"fello.se":[218],"flightradar24.com":[218,124],"foodandwine.com":[218],"khanacademy.org":[218],"hellenicbank.com":[218],"nokia.com":[218],"oneweb.net":[218],"omnipod.com":[218],"parkside-diy.com":[218],"stenaline.co.uk":[218],"technologyfromsage.com":[218],"tntsports.co.uk":[218],"vinted.com":[218],"wickes.co.uk":[218],"incorez.com":[219],"tim.it":[219],"here.com":[220,221],"openbb.co":[222],"byutv.org":[223],"myjobquote.co.uk":[224],"marktforschung.de":[225],"consent.newsnow.co.uk":[226],"shop.schaette-pferd.de":[227],"ivass.it":[228,229],"espressocoffeeshop.com":[230],"cart-in.re":[231,232],"prestonpublishing.pl":[233],"character.ai":[234],"sportamore.com":[235],"zara.com":[236],"vu.lt":[237],"online.no":[238],"austrian.com":[239],"kontinenzzentrum.ch":[240],"pathe.nl":[124],"engelvoelkers.com":[124],"festo.com":[124],"francemediasmonde.com":[124],"geny.com":[124],"giphy.com":[124],"knipex.de":[124],"taxfix.de":[124],"telecinco.es":[124],"tribecawine.com":[241],"usinenouvelle.com":[242],"sbk.org":[243],"brenger.nl":[244],"brenger.be":[244],"baseendpoint.gala.de":[245],"regjeringen.no":[246],"pirelli.com":[247,248],"sp-manager-magazin-de.manager-magazin.de":[249],"mikolow.geoportal-krajowy.pl":[250],"bencebutor.hu":[251],"mbl.is":[252],"geopop.it":[253],"thomasmorris.co.uk":[254,255],"experian.co.uk":[256],"postoffice.co.uk":[256],"consent.fastcar.co.uk":[257],"sailgp.com":[258,259],"vivenu-tickets-usa.sailgp.com":[260],"dskdirect.bg":[261],"cmpv2.dba.dk":[262],"app.trakt.tv":[263],"hfm.com":[264],"ecco.com":[265],"chaingpt.org":[266],"bandenconcurrent.nl":[267],"metro-cc.hr":[268],"metro-cc.ru":[269],"akku-shop.nl":[270],"akkushop-b2b.de":[270],"ir.ung.edu":[271],"eobuv.sk":[272],"eschuhe.de":[272],"zapatos.es":[272],"eobuv.cz":[273,274],"tavexbullion.co.uk":[275],"arcadiafinance.co.za":[276],"nickosfishbar.co.uk":[277,278],"beckhoff.com":[279],"eltechno.dk":[280],"elavon.*":[281],"kijk.nl":[282],"dehn.*":[283,284],"chipotle.com":[285],"atida.fr":[286],"bbvauk.com":[287],"altenberg.de":[288],"tsb.co.uk":[289,290],"budni.de":[291],"maandag.com":[292],"teufel.de":[293,294],"malighting.com":[295],"bricklink.com":[296,297],"bazaarofmagic.eu":[298],"vegvisits.com":[299,300],"revolutionrace.*":[301],"greencell.global":[302],"ventilatieland.nl":[303],"consent.nsd.se":[304],"vias.be":[305],"diners.hr":[306],"jobagent.ch":[307],"architekturbuch.de":[308],"medienservice-holz.de":[308],"sumissura.com":[309],"analizy.pl":[310,311],"bfarm.de":[312],"huddle.today":[313],"fortuluz.es":[314],"elavon.ie":[281,315],"larca.de":[316],"teringredients.es":[317],"teruk.co.uk":[317],"tgvinoui.sncf":[318],"sklepy-odido.pl":[268],"l-bank.de":[319],"indigoneo.*":[320],"kripa.it":[321],"nextdaycatering.co.uk":[321],"safran-group.com":[321],"strato-hosting.co.uk":[322],"n-sport.net":[323],"stoertebeker-eph.com":[324],"kammarkollegiet.se":[325],"womex.com":[326],"nutsinbulk.co.uk":[327],"racshop.co.uk":[328,329],"sapien.io":[330],"cremadescalvosotelo.com":[331],"landespreis-bw.de":[332],"marin-milou.com":[333],"boerse-stuttgart.de":[334],"inovelli.com":[335],"skagenfunds.is":[336],"pemacz.cz":[337],"landshut.de":[338],"wwz.ch":[339],"elekta.com":[340],"kupbilecik.*":[341,342],"pamiatki.pl":[343],"gesundheit-nordhessen.de":[344],"bemmaisseguro.com":[345,346,347],"swisstph.ch":[348],"taxinstitute.ie":[349],"easyparts-recambios.es":[350,351],"store.godox.pl":[352],"wirkaufendeinauto.at":[353,354],"vikoberallebiler.dk":[353,354],"compramostucoche.es":[353,354],"auto-doc.fr":[355],"topautoosat.fi":[355],"onlinecarparts.co.uk":[355],"reservedeler24.co.no":[355],"recambioscoche.es":[355],"titancoop.sm":[356],"grabo-balloons.com":[356],"indennizzolegge210.it":[356],"fllifranchini.com":[356],"lapitagora.com":[356],"verdelab.it":[356],"agesc.it":[356],"amitek.it":[356],"maraverbena.com":[356],"attiva-mente.info":[356],"superwatchman.com":[357],"lanxshoes.com":[358],"borgomontecedrone.it":[359],"recaro-shop.com":[359],"fayn.com":[360],"gera.de":[361],"mfr.fr":[362],"theprotocol.it":[363,364],"lightandland.co.uk":[365],"futoncompany.co.uk":[366],"mbhbank.hu":[367],"nebo.app":[368],"wohnen-im-alter.de":[369],"ebz-business-school.de":[370,371],"pcspecialist.de":[372,373],"mazda-autohaus-grasdanner-holzkirchen.de":[374],"markushaenni.com":[375],"airbaltic.com":[376],"paruvendu.fr":[377],"holidayhypermarket.co.uk":[378],"unisg.ch":[379],"paulaschoice.nl":[380],"atu.de":[381],"atu-flottenloesungen.de":[381],"fortuneo.fr":[381],"dpdgroup.com":[382],"brauzz.com":[383],"hallmark.co.uk":[383,384],"paper-republic.com":[384],"breeam.nl":[385],"letec.be":[386],"beam.co.uk":[387,388],"krakow.pl":[389],"wufoo.com":[390],"wildernesshotels.fi":[391],"1und1.net":[392,393,394],"mojomortgages.com":[395],"ecmrecords.com":[396],"malaikaraiss.com":[396],"wefashion.com":[397],"bruns-grosse-groessen.de":[398],"miethke.com":[399],"pin-freunde.de":[399],"mega.io":[400],"pointomega.de":[401],"ajtix.co.uk":[402],"1xinternet.com":[403],"fmk-steuer.de":[403],"cornelsen.de":[404,405],"swd-darmstadt.de":[406,407],"belsat.eu":[39],"warnung.bund.de":[408],"panzerfux.de":[409],"czc.cz":[410],"bluelightcard.co.uk":[411],"mega-image.ro":[412],"bioquelle.at":[413,414],"passes.com":[415],"debatpublic.fr":[416],"blogs.pcsoft.fr":[417],"whiteaway.com":[418],"whiteaway.no":[418],"whiteaway.se":[418],"elkjop.no":[418],"elavon.co.uk":[315],"tandem.co.uk":[419],"hdt.de":[420],"betterhomes-international.com":[421],"mustijamirri.fi":[422],"bigsim.de":[423],"bildconnect.de":[423],"maxxim.de":[423],"unlimited24.de":[423],"programmes.uliege.be":[424],"cdiscount.com":[425],"ticket-onlineshop.com":[426],"slankmetlinda.nl":[427],"capaciteitentestoefenen.com":[427],"mcnetiq.nl":[427],"skinnyminds.nl":[427],"huispromotie.nl":[427],"evac.nl":[428],"bokio.co.uk":[429],"sap-press.com":[430],"pizzadelight-menu.co.uk":[278,277],"sparbankenikarlshamn.se":[431],"avsparbank.se":[431],"vadstenasparbank.se":[431],"valdemarsvikssparbank.se":[431],"sodradalarnassparbank.se":[431],"sparbankengotland.se":[431],"orustsparbank.se":[431],"markarydssparbank.se":[431],"leksandssparbank.se":[431],"kindaydresparbank.se":[431],"sparbankenskaraborg.se":[431],"sparbanken.se":[431],"haradssparbanken.se":[431],"fryksdalenssparbank.se":[431],"ekebysparbank.se":[431],"iwabijoux.cz":[432],"doprava-usti.cz":[432],"ispop.info":[432],"egrus.cz":[432],"kartum.cz":[432],"zbrane-slany.cz":[432],"chorvatsko.org":[432],"zszitomirska.info":[432],"whippets-dog.cz":[432],"artifica.fr":[433],"theoceancleanup.com":[434],"masku.com":[435],"verkkokauppatukku.fi":[435],"unihomes.co.uk":[436],"northernpowergrid.com":[437],"koempf24.ch":[438,439],"koempf24.de":[438,439],"blgwonen.nl":[440],"heckenpflanzen-heijnen.de":[441],"pqs.app":[442],"thbaker.co.uk":[443],"helloprint.co.uk":[444],"tavaratalohurrikaani.fi":[445,446,447],"kfzparts24.de":[448],"runnersneed.com":[449],"aachener-zeitung.de":[450],"versteigerungspool.de":[451],"parfuemerie-becker.de":[452],"vbtverhuurmakelaars.nl":[453],"shopstyle.co.uk":[454],"profpneumologia.it":[455],"sumoingenio.com":[455],"polifast.it":[455],"micropigmentacioncapilarbcn.com":[455],"grundschule-remagen.de":[455],"grafika-dtp-produkcia.sk":[455],"dosc.es":[455],"patronatpremia.cat":[455],"ad-particles.com":[455],"agiletalon.fr":[455],"aidaromero.com":[455],"anea.es":[455],"emalec.com":[455],"espaisperconviure.es":[455],"gestenaval.com":[455],"handelskammaren.com":[455],"helux.se":[455],"kupbilecik.pl":[456],"oxfordeconomics.com":[457],"routershop.nl":[232],"finya.de":[458],"rmf.fm":[459],"printsimple.eu":[460],"banja-tellig.de":[461],"global.abb":[462],"gala.fr":[463],"phoenix.de":[464],"welcometothejungle.com":[465],"yle.fi":[466],"oth-regensburg.de":[467],"puresurfcamps.com":[467],"bigmammagroup.com":[468],"okosgazdi.hu":[469,470],"chronext.co.uk":[471],"klinik-am-ring.de":[472],"onelottery.co.uk":[473,474],"yourschoollottery.co.uk":[473,474],"rainbowlottery.co.uk":[473,474],"ajbell.co.uk":[475],"stilord.*":[476],"reifenleader.de":[477,478],"everand.com":[479],"tiwag.at":[480],"swiss-sport.tv":[481],"online-physiotherapie.de":[482],"nltraining.nl":[483],"vendeeglobe.org":[484],"berlinale.de":[485],"archiveofourown.org":[486],"shop.mango.com":[487],"partsinmotion.co.uk":[488],"beststuff.hu":[489],"evernote.com":[490,491,492,493],"offistore.fi":[494],"chillamo.com":[495],"collinsaerospace.com":[496],"capristores.gr":[497],"autoczescizielonki.pl":[498],"novakid.pl":[499],"berlin-buehnen.de":[500],"educa2.madrid.org":[501],"ubaldi.com":[502],"frankenergy.*":[503],"inshared.nl":[504],"volkswagen-newsroom.com":[505],"zipair.net":[506],"pevgrow.com":[507],"forum.echirurgia.pl":[508,509,510,511],"pysznosci.pl":[508,509,510,511],"wirtualnemedia.pl":[511,509,510],"chinskiesamochody.pl":[509,510,511],"allani.pl":[509,510,511],"altibox.dk":[512],"altibox.no":[512],"scaleway.com":[513,514],"kabasakalonline.com":[515],"pointcool-service.fi":[516],"bernhauser-bank.de":[517],"dovoba.de":[517],"dvrb.de":[517],"elvb.de":[517],"genoba-weil.de":[517],"gestalterbank.de":[517],"gladbacher-bank.de":[517],"grafschafter-volksbank.de":[517],"hannoversche-volksbank.de":[517],"hdh-voba.de":[517],"kieler-volksbank.de":[517],"meine-vrbank.de":[517],"oberlandbank.de":[517],"oldenburger-volksbank.de":[517],"raiba-aindling.de":[517],"raiba-altschweier.de":[517],"raiba-bobingen.de":[517],"raiba-buett-gauk.de":[517],"raiba-grimma.de":[517],"raiba-mittenwald.de":[517],"raiba-neumarkt-opf.de":[517],"raiba-pfaffenhofen.dee":[517],"raiba-pfaffenwinkel.de":[517],"raiba-rastede.de":[517],"raiba-suedhardt.de":[517],"raibadirekt.de":[517],"raiffeisenbank-eifel.de":[517],"raiffeisenbank-erlenbach.de":[517],"raiffeisenbank-im-breisgau.de":[517],"raiffeisenbank-ottenbach.de":[517],"raiffeisenbank-regensburg.de":[517],"raiffeisenbank-regenstauf.de":[517],"raiffeisenbank-sinzing.dee":[517],"raiffeisenbank-wyhl.de":[517],"rb-bad-saulgau.de":[517],"rb-bechhofen.de":[517],"rb-dietersheim.de":[517],"rb-elln.de":[517],"rb-fuldaerland.de":[517],"rb-grabfeld.de":[517],"rb-graevenwiesbach.de":[517],"rb-gsd.de":[517],"rb-lechrain.de":[517],"rb-nahe.de":[517],"rb-niedere-alb.de":[517],"rb-oberaudorf.de":[517],"rb-opf-jura.de":[517],"rb-parkstetten.de":[517],"rb-schaafheim.de":[517],"rb-westeifel.de":[517],"rb-wuestenselbitz.de":[517],"rbbs.de":[517],"rbnl.de":[517],"rbok.de":[517],"rbrodenbach.de":[517],"rmbeg.de":[517],"rvb-hassberge.de":[517],"rvbankries.de":[517],"rvbfresena.de":[517],"skb-hammah.de":[517],"unsere-raiba.de":[517],"vb-bo.de":[517],"vb-brandoberndorf.de":[517],"vb-eg.de":[517],"vb-flein-talheim.de":[517],"vb-gescher.de":[517],"vb-heimbach.de":[517],"vb-iw.de":[517],"vb-muensterland.de":[517],"vb-niers.de":[517],"vb-ue-saw.de":[517],"vb-vso.de":[517],"vb-westerstede.de":[517],"vbank.de":[517],"vbbraunlage.de":[517],"vbdessau.de":[517],"vbeutin.de":[517],"vbgebhardshain.de":[517],"vbidr.de":[517],"vbnh.de":[517],"vbol.de":[517],"vboyten.de":[517],"vbraesfeldunderle.de":[517],"vbrn.de":[517],"vbvechta.de":[517],"vbwinsenermarsch.de":[517],"voba-aw.de":[517],"voba-bl.de":[517],"voba-glm.de":[517],"voba-hoba.de":[517],"voba-kw.de":[517],"voba-moeckmuehl.de":[517],"voba-niedergrafschaft.de":[517],"voba-ober-moerlen.de":[517],"voba-owd.de":[517],"voba-rhein-erft-koeln.de":[517],"voba-rll.de":[517],"vobadhk.de":[517],"vobawhv.de":[517],"volksbank-adelebsen.de":[517],"volksbank-albstadt.de":[517],"volksbank-anroechte.de":[517],"volksbank-backnang.de":[517],"volksbank-erft.de":[517],"volksbank-kassel-goettingen.de":[517],"volksbank-kierspe.de":[517],"volksbank-lahr.de":[517],"volksbank-luebeck.de":[517],"volksbank-muensingen.de":[517],"volksbank-plochingen.de":[517],"volksbank-rhein-ruhr.de":[517],"volksbank-riesa.de":[517],"volksbank-trier-eifel.de":[517],"volksbank-ulm-biberach.de":[517],"volksbank-wittgenstein.de":[517],"vr-bank-freudenberg-niederfischbach.de":[517],"vr-bank-nordrhoen.de":[517],"vr-banknordeifel.de":[517],"vr-bayernmitte.de":[517],"vr-lif-ebn.de":[517],"vr-obm.de":[517],"vr-rheinahreifel.de":[517],"vrb-meinebank.de":[517],"vrb-niederschlesien.de":[517],"vrb-spangenberg.de":[517],"vrbank-alsheim.de":[517],"vrbank-eg.de":[517],"vrbank-ellwangen.de":[517],"vrbank-mittelhaardt.de":[517],"vrbank-osnordland.de":[517],"vrbankgl.de":[517],"vrbankmecklenburg.de":[517],"vrbanknord.de":[517],"vrkt.de":[517],"vrsta.de":[517],"wvb.de":[517],"sparda-sw.de":[517],"sparda.de":[518],"sparda-n.de":[518],"sparda.at":[519],"edekabank.de":[517],"pax-bkc.de":[517],"psd-braunschweig.de":[517],"psd-hannover.de":[517],"psd-muenchen.de":[517],"psdbank-ht.de":[517],"metro.co.uk":[520],"supreme.com":[521],"mrcrayfish.com":[522],"avinor.no":[523],"efset.org":[524],"accursia-capital.de":[525],"oeq.org":[526],"firstchoice.co.uk":[527],"gorans.fi":[528,529],"akt.no":[530],"auctionet.com":[531],"vcg.de":[532],"huk24.de":[533,534,535,536,537],"xnxx.com":[538],"anvelopelider.ro":[478],"dackleader.se":[478],"elastikaleader.gr":[478],"pneumaticileader.it":[478],"reifenleader.at":[478],"reifenleader.ch":[478],"riepulideris.lv":[478],"tyreleader.co.uk":[478],"dailygame.at":[539],"itavisen.no":[540,541],"camaramar.com":[542],"poki.com":[543,544],"aftonbladet.se":[545],"omni.se":[545],"boostmusic.com":[546],"gowinston.ai":[547],"cookie.bmgproductionmusic.com":[548],"offers-exchange.com":[549],"nv-allesbestens.de":[550],"zonerai.com":[551]};
const EXCEPT = {"logistics.vr.fi":["trusted-set-local-storage-item\u0001cookieConsent\u0001{\"consented\":true,\"consentId\":\"1\",\"timestamp\":\"$now$\",\"levels\":{\"level1\":true,\"level2\":false,\"level3\":false,\"level4\":false}}"],"app.filen.io":["trusted-set-cookie-reload\u0001cookieConsent\u0001onlyNeeded"],"mywot.com":["set-cookie\u0001cookies_consent_disclaimer\u0001false"],"internet.a1.by":["trusted-set-cookie-reload\u0001cookie_agreement_level\u0001FUNCTIONAL"],"myaccount.a1.by":["trusted-set-cookie-reload\u0001cookie_agreement_level\u0001FUNCTIONAL"],"shop.a1.by":["trusted-set-cookie-reload\u0001cookie_agreement_level\u0001FUNCTIONAL"],"support.a1.by":["trusted-set-cookie-reload\u0001cookie_agreement_level\u0001FUNCTIONAL"]};
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
context[prop] = new Proxy(fn, {
apply(target, thisArg, args) {
return handler({
thisArg,
callArgs: args,
reflect: () => reflectApply(target, thisArg, args),
});
},
});
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
observer = new MutationObserver(handleMutations);
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
function installXhrResponseTransform(needles, transform) {
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
proxyApply('fetch', (ctx) => {
const fetchPromise = ctx.reflect();
if (needles.size !== 0 && matchObjectProps(needles, collateFetchArgs(...ctx.callArgs)) === undefined) return fetchPromise;
return fetchPromise.then((before) => before.clone().json().then((obj) => {
if (typeof obj !== 'object') return before;
const after = pruneObject(obj, rawPrune, rawNeedle);
if (typeof after !== 'object') return before;
return respondLike(before, nativeJSONStringify(after));
}).catch(() => before)).catch(() => fetchPromise);
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
proxyApply('fetch', (ctx) => {
const fetchPromise = ctx.reflect();
if (pattern === '') return fetchPromise;
if (needles.size !== 0 && matchObjectProps(needles, collateFetchArgs(...ctx.callArgs)) === undefined) return fetchPromise;
return fetchPromise.then((before) => before.clone().text().then((textBefore) => {
if (reIncludes && reIncludes.test(textBefore) === false) return before;
const textAfter = textBefore.replace(rePattern, replacement);
if (textAfter === textBefore) return before;
return respondLike(before, textAfter);
}).catch(() => before)).catch(() => fetchPromise);
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
proxyApply(methodPath, (ctx) => {
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
win[name] = new Proxy(win[name], {
apply(target, thisArg, args) {
const [a, b] = args;
if ((delay === -1 || b === delay) && reNeedle.test(a.toString())) args[1] = b * boost;
return target.apply(thisArg, args);
},
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
proxyApply('fetch', (ctx) => {
const fetchPromise = ctx.reflect();
if (needles.size !== 0 && matchObjectProps(needles, collateFetchArgs(...ctx.callArgs)) === undefined) return fetchPromise;
return fetchPromise.then((before) => before.clone().json().then((obj) => {
if (typeof obj !== 'object') return before;
const after = jsonp.apply(obj);
if (after === undefined) return before;
return respondLike(before, nativeJSONStringify(after));
}).catch(() => before)).catch(() => fetchPromise);
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
proxyApply(chain, (ctx) => {
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
try { fn(...call.slice(1)); } catch { /* scriptlet nie może zepsuć strony */ }
}
}
runForHost(CALLS, HOSTS, EXCEPT);
})();
