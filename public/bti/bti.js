var RBInt = {
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toGMTString();
        document.cookie =
            cname +
            "=" +
            cvalue +
            "; path=/; " +
            expires +
            "; SameSite=None; Secure";
        document.cookie =
            cname + "-legacy" + "=" + cvalue + "; path=/; " + expires;
    },
    getCookie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    },
    deleteCookie: function (cookieName) {
        RBInt.setCookie(cookieName, "", -1);
        document.cookie =
            cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },
    getQueryString: function (key) {
        return decodeURIComponent(
            window.location.search.replace(
                new RegExp(
                    "^(?:.*[&\\?]" +
                        encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") +
                        "(?:\\=([^&]*))?)?.*$",
                    "i"
                ),
                "$1"
            )
        );
    },
};

function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href
        .slice(window.location.href.indexOf("?") + 1)
        .split("&");
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split("=");
        if (hash[1]) {
            vars.push(hash[0]);
            vars[hash[0]] = decodeURIComponent(hash[1].split("#")[0]);
        }
    }
    return vars;
}

var ReferURLLink = "";
var CoinKey = "";

var strReferURL = localStorage.getItem("ReferURL");
var strCookieReferURL = RBInt.getCookie("ReferURLCooKie");
var strSSReferURL = sessionStorage.getItem("ReferURLSession");

if (strReferURL != "" && strReferURL != undefined) {
    ReferURLLink = strReferURL;
    RBInt.setCookie("ReferURLCooKie", strReferURL, 1);
    sessionStorage.setItem("ReferURLSession", strReferURL);
} else if (strCookieReferURL != "" && strCookieReferURL != undefined) {
    ReferURLLink = strCookieReferURL;
    sessionStorage.setItem("ReferURLSession", strCookieReferURL);
} else if (strSSReferURL != "" && strSSReferURL != undefined) {
    ReferURLLink = strSSReferURL;
    RBInt.setCookie("ReferURLCooKie", strSSReferURL, 1);
}

var strUrlToken = getUrlVars()["sToken"];
var strCookieToken = RBInt.getCookie("sTokenCookie");
var strSSToken = sessionStorage.getItem("sTokenSession");

if (strUrlToken != "" && strUrlToken != undefined) {
    CoinKey = strUrlToken;
    RBInt.setCookie("sTokenCookie", strUrlToken, 1);
    sessionStorage.setItem("sTokenSession", strUrlToken);
} else if (strCookieToken != "" && strCookieToken != undefined) {
    CoinKey = strCookieToken;
    sessionStorage.setItem("sTokenSession", strCookieToken);
} else if (strSSToken != "" && strSSToken != undefined) {
    CoinKey = strSSToken;
    RBInt.setCookie("sTokenCookie", strSSToken, 1);
}

(function (whl, $) {
    this.errorMessages = new Object();
    this.errorMessages[-1] = "Unknown error.";
    this.errorMessages[-100] = "Invalid input parameters.";
    this.errorMessages[-102] = "Username is not entered.";
    this.errorMessages[-104] = "Password is not entered";
    this.errorMessages[-205] = "Username/password is not correct.";
    this.errorMessages[-7] = "User account is locked.";

    this.siteURL = ReferURLLink;
    this.linkStatus =
        localStorage.getItem("APIUrl") +
        "/api/Vendor/SBT/MemberInfo?api-version=2.0&brand=tlc&Platform=Desktop";
    //console.log(window.localStorage)
    this.linkLogin = ReferURLLink;
    this.linkLogout = ReferURLLink;
    this.coin = CoinKey;

    whl.status = function (callback) {
        if (
            ((strUrlToken != "" &&
                strUrlToken != undefined &&
                strUrlToken !== "logout") ||
                (strSSToken != "" &&
                    strSSToken != undefined &&
                    strSSToken !== "logout")) &&
            memberSportsbookBalance != undefined &&
            memberSportsbookBalance != "" &&
            memberSportsbookBalance != "logout"
        ) {
            this.status_callback = callback;
            var that = this;
            var data = new Object();
            data.Code = 0;
            data.Status = "success";
            data.Message = "success";
            data.balance = memberSportsbookBalance;

            that.statusCallback(data);
            if (!RBInt.getCookie("oSt2")) RBInt.setCookie("oSt2", 3, 999);
        }
    };

    whl.statusCallback = function (data) {
        if (this.status_callback) {
            var result = new Object();
            result.token = CoinKey;
            result.status = "anon";
            if (data.Code === 0) result.status = "real";
            result.message = data.Message;
            result.balance = data.balance;
            this.status_callback(result);

            /* logout for invalid session (non-iframe integration only) */
            try {
                var operator = parent.document;
                if (operator)
                    setTimeout(function () {
                        if (window.UserInfo && !window.UserInfo.current)
                            whl.logout();
                    }, 3000);
            } catch (DOMException) {
                console.info("iFrame integration. skip session validation.");
            }
        }
    };
    /* REFRESH */
    whl.refreshSession = function (callback) {
        this.refresh_callback = callback;

        if (
            ((strUrlToken != "" &&
                strUrlToken != undefined &&
                strUrlToken !== "logout") ||
                (strSSToken != "" &&
                    strSSToken != undefined &&
                    strSSToken !== "logout")) &&
            memberSportsbookBalance != undefined &&
            memberSportsbookBalance != "" &&
            memberSportsbookBalance != "logout"
        ) {
            var that = this;
            var data = new Object();
            data.Code = 0;
            data.Status = "success";
            data.Message = "success";
            data.balance = memberSportsbookBalance;
            that.refreshCallback(data);
        }
    };

    whl.refreshCallback = function (data) {
        if (this.refresh_callback) {
            var result = new Object();
            result.status = "failure";
            if (data.code < 0) {
                RBInt.deleteCookie("sTokenCookie");
                sessionStorage.removeItem("sTokenSession");
            } else result.status = "success";
            result.Message = data.message;
            result.balance = data.balance
                ? data.balance.toString()
                : data.balance;
            this.refresh_callback(result);
        }
    };

    whl.betAccepted = function (data) {
        var that = this;
        $.ajax({
            type: "GET",
            url: linkStatus,
            dataType: "json",
            headers: {
                Authorization: "bearer " + localStorage.getItem("MemberToken"),
                Culture: "vi-vn",
            },
            jsonp: false,
            jsonpCallback: "jsoncb",
            crossDomain: true,
            data: {},
            success: function (data) {
                memberSportsbookBalance = data.balance.toString();
                that.refreshCallback(data);
            },
        });
    };

    whl.logout = function () {
        window.location.reload();
        // window.parent.location.href = ReferURLLink;
    };
    whl.setIframeHeight = function (newHeight) {
        window.parent.postMessage(
            JSON.stringify({
                eventType: "CHANGE_IFRAME_SIZE_EVENT",
                eventData: {
                    newHeight: newHeight,
                },
            }),
            "*"
        );
    };

    whl.getMobileRegistrationURL = function () {
        return ReferURLLink;
    };

    whl.getMobileBankURL = function () {
        window.location.href = ReferURLLink;
    };
    whl.getMobilePasswordResetURL = function () {
        return ReferURLLink;
    };
})((window.whl = window.whl || {}), jQuery);
