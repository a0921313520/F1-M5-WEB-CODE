/* 全局函数初始化 */
if (process.browser) {
    let piwikTimer = null;
    let piwikUrl = [];
    function pushUrl(_paq, url,trackTitle) {
        console.log("🚀 ~ file: Globalfun.js:6 ~ url,trackTitle:", url,trackTitle)
        if (!window.piwikLoadFinished && ~window.location.href.indexOf(url)) {
            return;
        }
        _paq.push(["setCustomUrl", url]);
        _paq.push(["trackPageView"]);
        trackTitle && _paq.push(["setDocumentTitle",trackTitle]);
    }
    global.Pushgtagpiwikurl = (url,trackTitle="") => {
        if (!url) {
            return;
        } else {
            url = window.location.origin + "/vn/" + url + "/";
        }
        if (typeof _paq === "object") {
            pushUrl(_paq, url,trackTitle);
        } else {
            piwikUrl.push(url);
            clearInterval(piwikTimer);
            piwikTimer = setInterval(() => {
                if (typeof _paq === "object") {
                    clearInterval(piwikTimer);
                    Array.isArray(piwikUrl) &&
                        piwikUrl.length &&
                        piwikUrl.forEach((v) => {
                            pushUrl(_paq, v,trackTitle);
                        });
                    piwikUrl = [];
                }
            }, 1000);
        }
    };
    global.Pushgtagdata = (
        eventCategory,
        action,
        name,
        number="",
        customVariableArr = []
    ) => {
        if (eventCategory == undefined) {
            return;
        }
        console.log("Piwik 追中:", eventCategory,",", action,",", name,",",number,",",customVariableArr);
        let data = eventCategory.replace(/[&\|\\\*^%/$#@\-]/g, "");
        if (typeof _paq === "object") {
            customVariableArr.length && customVariableArr.forEach((variableItem,i)=> {
                variableItem.customVariableKey &&
                _paq.push([
                    "setCustomVariable",
                    i+1,
                    variableItem.customVariableKey,
                    variableItem.customVariableValue,
                    "page",
                ])
            });
            _paq.push(["trackEvent", data, action ? action : "touch", name,number]);
            customVariableArr.length && customVariableArr.forEach((variableItem,i)=> { variableItem.customVariableKey && _paq.push(["deleteCustomVariable", i+1, "page"])});
        }
    };
    let StagingApi = Boolean(
        [
            "p5stag1.fun88.biz",
            "p5stag2.fun88.biz",
            "p5stag3.fun88.biz",
            "p5stag4.fun88.biz",
            "p5stag5.fun88.biz",
            "p5stag6.fun88.biz",
            "p5stag7.fun88.biz",
            "p5stag8.fun88.biz",
            "localhost:8003",
        ].find((v) => global.location.href.includes(v))
    );
    setTimeout(() => {
        let e2src = "https://e2.platform88798.com/E2/EagleEye.js";
        if (StagingApi) {
            e2src = "https://ytl.ylyofb45n.com/E2/EagleEye.js";
        }
        // let script1 = document.createElement('script');
        // script1.src = 'https://mpsnare.iesnare.com/snare.js';
        // script1.type = 'text/javascript';
        // document.querySelectorAll('body')[0].appendChild(script1);
        let script2 = document.createElement("script");
        script2.src = e2src;
        script2.type = "text/javascript";
        document.querySelectorAll("body")[0].appendChild(script2);
    }, 5000);

    if (StagingApi) {
        (function (window, document, dataLayerName, id) {
            (window[dataLayerName] = window[dataLayerName] || []),
                window[dataLayerName].push({
                    start: new Date().getTime(),
                    event: "stg.start",
                });
            var scripts = document.getElementsByTagName("script")[0],
                tags = document.createElement("script");

            function stgCreateCookie(a, b, c) {
                var d = "";
                if (c) {
                    var e = new Date();
                    e.setTime(e.getTime() + 24 * c * 60 * 60 * 1e3),
                        (d = "; expires=" + e.toUTCString());
                }
                document.cookie = a + "=" + b + d + "; path=/";
            }

            var isStgDebug =
                (window.location.href.match("stg_debug") ||
                    document.cookie.match("stg_debug")) &&
                !window.location.href.match("stg_disable_debug");
            stgCreateCookie(
                "stg_debug",
                isStgDebug ? 1 : "",
                isStgDebug ? 14 : -1
            );

            var qP = [];
            dataLayerName !== "dataLayer" &&
                qP.push("data_layer_name=" + dataLayerName),
                isStgDebug && qP.push("stg_debug");
            var qPString = qP.length > 0 ? "?" + qP.join("&") : "";

            (tags.async = !0),
                (tags.src =
                    "//analytics.ravelz.com/containers/" +
                    id +
                    ".js" +
                    qPString),
                scripts.parentNode.insertBefore(tags, scripts);

            !(function (a, n, i) {
                a[n] = a[n] || {};
                for (var c = 0; c < i.length; c++)
                    !(function (i) {
                        (a[n][i] = a[n][i] || {}),
                            (a[n][i].api =
                                a[n][i].api ||
                                function () {
                                    var a = [].slice.call(arguments, 0);
                                    "string" == typeof a[0] &&
                                        window[dataLayerName].push({
                                            event: n + "." + i + ":" + a[0],
                                            parameters: [].slice.call(
                                                arguments,
                                                1
                                            ),
                                        });
                                });
                    })(i[c]);
            })(window, "ppms", ["tm", "cm"]);
        })(window, document, "dataLayer", "d276117d-58ce-4b99-8418-9b11484cb34e" || "9ede9ab4-cea2-4a10-bf94-02ac2600e615");
    } else {
        (function (window, document, dataLayerName, id) {
            (window[dataLayerName] = window[dataLayerName] || []),
                window[dataLayerName].push({
                    start: new Date().getTime(),
                    event: "stg.start",
                });
            var scripts = document.getElementsByTagName("script")[0],
                tags = document.createElement("script");

            function stgCreateCookie(a, b, c) {
                var d = "";
                if (c) {
                    var e = new Date();
                    e.setTime(e.getTime() + 24 * c * 60 * 60 * 1e3),
                        (d = "; expires=" + e.toUTCString());
                }
                document.cookie = a + "=" + b + d + "; path=/";
            }

            var isStgDebug =
                (window.location.href.match("stg_debug") ||
                    document.cookie.match("stg_debug")) &&
                !window.location.href.match("stg_disable_debug");
            stgCreateCookie(
                "stg_debug",
                isStgDebug ? 1 : "",
                isStgDebug ? 14 : -1
            );

            var qP = [];
            dataLayerName !== "dataLayer" &&
                qP.push("data_layer_name=" + dataLayerName),
                isStgDebug && qP.push("stg_debug");
            var qPString = qP.length > 0 ? "?" + qP.join("&") : "";

            (tags.async = !0),
                (tags.src =
                    "//analytics.ravelz.com/containers/" +
                    id +
                    ".js" +
                    qPString),
                scripts.parentNode.insertBefore(tags, scripts);

            !(function (a, n, i) {
                a[n] = a[n] || {};
                for (var c = 0; c < i.length; c++)
                    !(function (i) {
                        (a[n][i] = a[n][i] || {}),
                            (a[n][i].api =
                                a[n][i].api ||
                                function () {
                                    var a = [].slice.call(arguments, 0);
                                    "string" == typeof a[0] &&
                                        window[dataLayerName].push({
                                            event: n + "." + i + ":" + a[0],
                                            parameters: [].slice.call(
                                                arguments,
                                                1
                                            ),
                                        });
                                });
                    })(i[c]);
            })(window, "ppms", ["tm", "cm"]);
        })(window, document, "dataLayer", "d276117d-58ce-4b99-8418-9b11484cb34e");
    }
}
