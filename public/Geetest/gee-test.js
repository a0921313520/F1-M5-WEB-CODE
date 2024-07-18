/*
	************************************************************************************************************************
																												DATA ATTRIBUTES
	************************************************************************************************************************

	data-req-head          : Will call the custom function to set headers or modify ajax request.
	data-first-callback    : Will call the custom function after the first validation (captcha initialize) step is complete.
	data-gt                 : This will initiate the gt blocks.
    data-post              : Specify params to send in POST request. Default is NULL.
    data-extend-time       : will specify how many seconds will the session extended up to.

	***********************************************************************************************************************
																												PUBLIC METHODS
	***********************************************************************************************************************

    init             : call this after defining all the overrides method
    registerCaptcha: call this to start the first validation to initialize captcha. Supporting string with prefix '.'(class) and '#'(id)

	*************************************************************************************************************************
					                                                                                            OVERRIDES
	*************************************************************************************************************************

	funpodiumGeetest.Overrides   : Declare all override methods under this namespace.
								   Example: funpodiumGeetest.Overrides.YOUR_FUNCTION_NAME = function(){}

*/

"use strict";

// gt.js library
/* initGeetest 1.0.0
 * 用于加载id对应的验证码库，并支持宕机模式
 * 暴露 initGeetest 进行验证码的初始化
 * 一般不需要用户进行修改
 */
(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        // CommonJS
        module.exports = global.document
            ? factory(global, true)
            : function (w) {
                  if (!w.document) {
                      throw new Error(
                          "Geetest requires a window with a document",
                      );
                  }
                  return factory(w);
              };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
    "use strict";
    if (typeof window === "undefined") {
        throw new Error("Geetest requires browser environment");
    }
    var document = window.document;
    var Math = window.Math;
    var head = document.getElementsByTagName("head")[0];

    function _Object(obj) {
        this._obj = obj;
    }

    _Object.prototype = {
        _each: function (process) {
            var _obj = this._obj;
            for (var k in _obj) {
                if (_obj.hasOwnProperty(k)) {
                    process(k, _obj[k]);
                }
            }
            return this;
        },
    };
    function Config(config) {
        var self = this;
        new _Object(config)._each(function (key, value) {
            self[key] = value;
        });
    }

    Config.prototype = {
        api_server: "api.geetest.com",
        protocol: "http://",
        type_path: "/gettype.php",
        fallback_config: {
            slide: {
                static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
                type: "slide",
                slide: "/static/js/geetest.0.0.0.js",
            },
            fullpage: {
                static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
                type: "fullpage",
                fullpage: "/static/js/fullpage.0.0.0.js",
            },
        },
        _get_fallback_config: function () {
            var self = this;
            if (isString(self.type)) {
                return self.fallback_config[self.type];
            } else if (self.new_captcha) {
                return self.fallback_config.fullpage;
            } else {
                return self.fallback_config.slide;
            }
        },
        _extend: function (obj) {
            var self = this;
            new _Object(obj)._each(function (key, value) {
                self[key] = value;
            });
        },
    };
    var isNumber = function (value) {
        return typeof value === "number";
    };
    var isString = function (value) {
        return typeof value === "string";
    };
    var isBoolean = function (value) {
        return typeof value === "boolean";
    };
    var isObject = function (value) {
        return typeof value === "object" && value !== null;
    };
    var isFunction = function (value) {
        return typeof value === "function";
    };
    var callbacks = {};
    var status = {};
    var random = function () {
        return parseInt(Math.random() * 10000) + new Date().valueOf();
    };
    var loadScript = function (url, cb) {
        var script = document.createElement("script");
        script.charset = "UTF-8";
        script.async = true;
        script.onerror = function () {
            cb(true);
        };
        var loaded = false;
        script.onload = script.onreadystatechange = function () {
            if (
                !loaded &&
                (!script.readyState ||
                    "loaded" === script.readyState ||
                    "complete" === script.readyState)
            ) {
                loaded = true;
                setTimeout(function () {
                    cb(false);
                }, 0);
            }
        };
        script.src = url;
        head.appendChild(script);
    };
    var normalizeDomain = function (domain) {
        return domain.replace(/^https?:\/\/|\/$/g, "");
    };
    var normalizePath = function (path) {
        path = path.replace(/\/+/g, "/");
        if (path.indexOf("/") !== 0) {
            path = "/" + path;
        }
        return path;
    };
    var normalizeQuery = function (query) {
        if (!query) {
            return "";
        }
        var q = "?";
        new _Object(query)._each(function (key, value) {
            if (isString(value) || isNumber(value) || isBoolean(value)) {
                q =
                    q +
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(value) +
                    "&";
            }
        });
        if (q === "?") {
            q = "";
        }
        return q.replace(/&$/, "");
    };
    var makeURL = function (protocol, domain, path, query) {
        domain = normalizeDomain(domain);

        var url = normalizePath(path) + normalizeQuery(query);
        if (domain) {
            url = protocol + domain + url;
        }

        return url;
    };
    var load = function (protocol, domains, path, query, cb) {
        var tryRequest = function (at) {
            var url = makeURL(protocol, domains[at], path, query);
            loadScript(url, function (err) {
                if (err) {
                    if (at >= domains.length - 1) {
                        cb(true);
                    } else {
                        tryRequest(at + 1);
                    }
                } else {
                    cb(false);
                }
            });
        };
        tryRequest(0);
    };
    var jsonp = function (domains, path, config, callback) {
        if (isObject(config.getLib)) {
            config._extend(config.getLib);
            callback(config);
            return;
        }
        if (config.offline) {
            callback(config._get_fallback_config());
            return;
        }
        var cb = "geetest_" + random();
        window[cb] = function (data) {
            if (data.status === "success") {
                callback(data.data);
            } else if (!data.status) {
                callback(data);
            } else {
                callback(config._get_fallback_config());
            }
            window[cb] = undefined;
            try {
                delete window[cb];
            } catch (e) {}
        };
        load(
            config.protocol,
            domains,
            path,
            {
                gt: config.gt,
                callback: cb,
            },
            function (err) {
                if (err) {
                    callback(config._get_fallback_config());
                }
            },
        );
    };
    var throwError = function (errorType, config) {
        var errors = {
            networkError: "网络错误",
        };
        if (typeof config.onError === "function") {
            config.onError(errors[errorType]);
        } else {
            throw new Error(errors[errorType]);
        }
    };
    var detect = function () {
        return !!window.Geetest;
    };
    if (detect()) {
        status.slide = "loaded";
    }
    var initGeetest = function (userConfig, callback) {
        var config = new Config(userConfig);
        if (userConfig.https) {
            config.protocol = "https://";
        } else if (!userConfig.protocol) {
            config.protocol = window.location.protocol + "//";
        }
        jsonp(
            [config.api_server || config.apiserver],
            config.type_path,
            config,
            function (newConfig) {
                var type = newConfig.type;
                var init = function () {
                    config._extend(newConfig);
                    callback(new window.Geetest(config));
                };
                callbacks[type] = callbacks[type] || [];
                var s = status[type] || "init";
                if (s === "init") {
                    status[type] = "loading";
                    callbacks[type].push(init);
                    load(
                        config.protocol,
                        newConfig.static_servers || newConfig.domains,
                        newConfig[type] || newConfig.path,
                        null,
                        function (err) {
                            if (err) {
                                status[type] = "fail";
                                throwError("networkError", config);
                            } else {
                                status[type] = "loaded";
                                var cbs = callbacks[type];
                                for (
                                    var i = 0, len = cbs.length;
                                    i < len;
                                    i = i + 1
                                ) {
                                    var cb = cbs[i];
                                    if (isFunction(cb)) {
                                        cb();
                                    }
                                }
                                callbacks[type] = [];
                            }
                        },
                    );
                } else if (s === "loaded") {
                    init();
                } else if (s === "fail") {
                    throwError("networkError", config);
                } else if (s === "loading") {
                    callbacks[type].push(init);
                }
            },
        );
    };
    window.initGeetest = initGeetest;
    return initGeetest;
});
//gt.js library end

var FunpodiumGeetest = function () {
    //private geetest var
    var gtBlocks = null; //object

    // gt block object
    var GtBlock = function (block, apiUrl) {
        /* private variable */
        var gt = this,
            handlerEmbed = null,
            gtBlock = null,
            postData = null, //object of post data, required by service
            firstCallBack = null, // callback for first call (succ,fail)
            extendTime = null,
            timeInterval = null,
            gtParams = null,
            getcaptObj = null,
            uniqueUId = makeid(4) + "_" + Date.now();

        var init = function () {
            if (typeof block.attributes.id === "undefined") {
                block.setAttribute("id", "gt_block_" + idx);
            }
            gtBlock = block;
            postData = block.getAttribute("data-post");

            if (typeof FunpodiumGeetest.Overrides[postData] == "function") {
                //if function to override request header
                postData = FunpodiumGeetest.Overrides[postData]();
            } else {
                if (typeof postData != "object") {
                    postData = {};
                }
            }
            postData = $.extend(
                {
                    type: "web", // or "type":"h5"
                    userId: uniqueUId,
                },
                postData,
            );

            firstCallBack = block.getAttribute("data-first-callback");
            if (
                typeof FunpodiumGeetest.Overrides[firstCallBack] == "undefined"
            ) {
                firstCallBack = function (resp) {};
            } else if (
                typeof FunpodiumGeetest.Overrides[firstCallBack] == "function"
            ) {
                //if function to override request header
                firstCallBack = FunpodiumGeetest.Overrides[firstCallBack];
            }
        };
        //IE9

        var isIE = function () {
            var ua = window.navigator.userAgent,
                msie = null;
            msie = ua.indexOf("MSIE ");
            if (msie > 0) {
                // If Internet Explorer, return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
            } else if (!!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                //detect if IE 11
                return true;
            }
            return false;
        };

        //IE9 end

        function makeid(length) {
            var result = "";
            var characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength),
                );
            }
            return result;
        }

        var extendTimeRequest = function () {
            var extendData = {};
            extendData.userId = postData.userId;
            extendData.extendTime = extendTime;
            if (isIE() == 9) {
                var xdr = new XDomainRequest();
                xdr.open("post", apiUrl + "/extendRegisterTime");
                xdr.onload = function () {
                    console.log(
                        "Extending the session for: " + extendTime + "secs",
                    );
                };
                xdr.send(urlParams(extendData));
            } else {
                $.ajax({
                    contentType: "application/json; charset=utf-8",
                    url: apiUrl + "/extendRegisterTime",
                    type: "post",
                    data: JSON.stringify(extendData),
                    success: function (data) {
                        console.log(
                            "Extending the session for: " + extendTime + "secs",
                        );
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        clearInterval(timeInterval);
                    },
                });
            }
        };

        // private function
        handlerEmbed = function (captchaObj) {
            captchaObj.onSuccess(function () {
                var validate = captchaObj.getValidate(),
                    defaultPostData = {},
                    stringFormObject = "";
                defaultPostData = {
                    challenge: validate.geetest_challenge,
                    validate: validate.geetest_validate,
                    seccode: validate.geetest_seccode,
                };
                defaultPostData = $.extend({}, defaultPostData, postData);
                for (var key in defaultPostData) {
                    if (defaultPostData.hasOwnProperty(key)) {
                        var element = defaultPostData[key];
                        $(gtBlock)
                            .parent()
                            .find("input[name='" + key + "'][type=hidden]")
                            .remove();
                        stringFormObject +=
                            "<input type='hidden' name='" +
                            key +
                            "' value='" +
                            element +
                            "'>";
                    }
                }

                $(gtBlock).append(stringFormObject);

                var callbackObj = {},
                    idBlock = $(gtBlock).attr("id");
                callbackObj[idBlock] = {
                    isValidated: true,
                    data: defaultPostData,
                };
                getcaptObj(callbackObj);
                clearInterval(timeInterval);
            });

            if (
                typeof gtParams.product == "undefined" ||
                gtParams.product == "popup"
            ) {
                $(gtBlock).html("");
                captchaObj.appendTo(gtBlock);
            } else if (gtParams.product == "bind") {
                $(gtBlock).click(function () {
                    if (NamePwdVerify) {
                        captchaObj.verify();
                    }
                });
            }

            captchaObj.onReady(function () {
                console.log("captcha ready");
            });

            if (parseInt(extendTime) < 180) extendTime = 180;
            timeInterval = setInterval(
                extendTimeRequest,
                (extendTime - 30) * 1000,
            );
        };

        var urlParams = function (paramsToSend) {
            return Object.keys(paramsToSend)
                .map(function (k) {
                    return (
                        encodeURIComponent(k) +
                        "=" +
                        encodeURIComponent(paramsToSend[k])
                    );
                })
                .join("&");
        };

        //public function
        this.setExtendTime = function (seconds) {
            extendTime = parseInt(seconds) || 180;
        };

        this.setGtParams = function (params) {
            gtParams = params;
        };

        this.startGt = function (callback) {
            $.support.cors = true;
            getcaptObj = callback;
            var defaultParams = { lang: "en", width: "100%" };
            defaultParams = $.extend({}, defaultParams, gtParams);
            if (isIE() == 9) {
                var xdr = new XDomainRequest();
                xdr.open("post", apiUrl + "/register?" + urlParams(postData));
                xdr.onload = function () {
                    var data = JSON.parse(xdr.responseText);
                    firstCallBack({
                        code: xdr.status,
                        isValidated: true,
                        message: data,
                    });
                    initGeetest(
                        $.extend(defaultParams, {
                            gt: data.gt,
                            challenge: data.challenge,
                            new_captcha: data.new_captcha,
                            offline: !data.success,
                        }),
                        handlerEmbed,
                    );
                };
                xdr.send();
            } else {
                $.ajax({
                    url: apiUrl + "/register",
                    method: "POST",
                    timeout: 0,
                    headers: {
                        Origin: "http://geetest-helper-peter.test",
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify(postData),
                    crossDomain: true,
                    processData: false,
                    cache: false,
                    async: true,
                    success: function (data, status, xhr) {
                        data = JSON.parse(data);
                        firstCallBack({
                            code: xhr.status,
                            isValidated: true,
                            message: data,
                        });
                        initGeetest(
                            $.extend(defaultParams, {
                                gt: data.gt,
                                challenge: data.challenge,
                                new_captcha: data.new_captcha,
                                offline: !data.success,
                            }),
                            handlerEmbed,
                        );
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        $(block).html(
                            "<div class='form-group col-md-4'><input class='validation-error' value='captcha not found!' readonly></div>",
                        );
                        firstCallBack({
                            code: xhr.status,
                            isValidated: false,
                            message: thrownError,
                        });
                        console.error(xhr);
                        console.error(ajaxOptions);
                    },
                });
            }
        };

        init();
    };

    var runPublicFunctionGtBlock = function (id, func, needReturn, callback) {
        var indexes = [],
            stringId = null,
            returnedObj = {};
        if (typeof id == "string") {
            //support string with # and . prefix only
            switch (id[0]) {
                case ".":
                    $(id).each(function (i, obj) {
                        stringId = $(obj).attr("id") || "classWithNoID";
                        indexes.push(stringId);
                    });
                    break;
                case "#":
                    indexes.push(id.substr(1));
                    break;
                default:
                    console.error(
                        "Cannot resolve prefix " +
                            id[0] +
                            " , only support '.' for class and '#' for id",
                    );
                    break;
            }
        } else if (id instanceof HTMLElement || typeof id == "object") {
            //does not support jquery (obj) and dom element
            console.error("Function startBlock() does not object");
            return false;
        }
        indexes.forEach(function (index) {
            if (!gtBlocks[index]) {
                console.error(
                    "Can not find geeTest object (element with data-gt) with ID: " +
                        index,
                );
                return false;
            }
            if (needReturn) {
                //map the result to each index
                returnedObj[index] = gtBlocks[index][func]();
            } else {
                gtBlocks[index][func](callback);
            }
        });
        if (needReturn) {
            return returnedObj;
        }
    };

    this.registerCaptcha = function (id, callback) {
        if (typeof callback != "function") {
            console.error("Invalid callback function");
            return;
        }
        runPublicFunctionGtBlock(id, "startGt", false, callback);
    };

    this.init = function (gtObj) {
        //{"apiUrl":"string","ieProxy":"/some_proxy_path_under_same_domain", "extendTime":180, "gtParams":{lang:"en"}, "success": function(), "fail":function()}
        gtBlocks = document.querySelectorAll("[data-gt]");
        gtBlocks = [].slice.call(gtBlocks);
        gtBlocks.forEach(function (block, idx) {
            var id = null;
            if (typeof block.attributes.id === "undefined") {
                id = "gt_block_" + idx;
                block.setAttribute("id", id);
            } else {
                id = block.attributes.id.value;
            }
            if (typeof gtObj != "object" || !gtObj.apiUrl) {
                console.error(
                    "Initiation parameters neet to be an object that requires to contain apiUrl",
                );
                return false;
            }
            var newBlock = new GtBlock(block, gtObj.apiUrl);
            gtBlocks[id] = newBlock;
            gtBlocks[id].setExtendTime(gtObj.extendTime);
            if (gtObj.gtParams && typeof gtObj.gtParams == "object")
                gtBlocks[id].setGtParams(gtObj.gtParams);
        });
    };
};
FunpodiumGeetest.Overrides = {};
