import "url-search-params-polyfill"; //用于兼容URLSearchParams
import { ApiPort } from "$SERVICES/TLCAPI";
import HostConfig from "./Host.config";
import { get } from "$SERVICES/TlcRequest";
import {
    SportsbookGameCatCode,
    ESportsGameCatCode,
    InstantGamesGameCatCode,
    LiveCasinoGameCatCode,
    P2PGameCatCode,
    SlotGameCatCode,
    KenoLotteryGameCatCode,
} from "$SERVICESconstantsData";
/* 目前会有两个地方用到，都很重要! 所有涉及到注册的会有，涉及到下载APP，客户端，中心会有 */
/* 仅仅是用在注册而已 */
export const checkAffQueryString = () => {
    if (window.location.search) {
        var urlParams = new URLSearchParams(querystring);
        if (urlParams.has("aff"))
            Cookie.Create(
                "CO_affiliate",
                "affiliate=" + urlParams.get("aff"),
                2,
            );
        if (urlParams.has("media"))
            Cookie.Create("CO_Media", "Media=" + urlParams.get("media"), 2);
        if (urlParams.has("web"))
            Cookie.Create(
                "CO_WebStieID",
                "WebStieID=" + urlParams.get("web"),
                2,
            );
        if (urlParams.has("referrer"))
            Cookie.Create(
                "CO_Referer",
                "Referer=" + urlParams.get("referrer"),
                2,
            );
    }
};

/* 获取url的指定参数值  */
export function getQueryVariable(call) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == call) {
            return pair[1];
        }
    }
    return false;
}

/*目前逻辑会先获取url中的代理没有则获取api域名返回的代理code */
let GetDomainOnce = false;
export const getAffiliateReferralCode = () => {
    let affiliaUrl = localStorage.getItem("affiliateUrlLM");
    if (affiliaUrl != null) {
        global.affiliateUrlLM = affiliaUrl;
    }
    /* 先获取域名里面的代理code,没有再去检查api返回的 */
    if (getQueryVariable("aff")) {
        Cookie.Create(
            "CO_affiliate",
            "affiliate=" + getQueryVariable("aff"),
            2,
        );
        return getQueryVariable("aff");
    } else if (
        Cookie.GetCookieKeyValue("CO_affiliate") != "undefined" &&
        Cookie.GetCookieKeyValue("CO_affiliate") != ""
    ) {
        return Cookie.GetCookieKeyValue("CO_affiliate");
    } else {
        !GetDomainOnce &&
            get(ApiPort.GETDomainUrl, ApiPort.LOCAL_HOST).then((res) => {
                if (res) {
                    global.affiliateUrlLM = res.affiliateUrlLM;
                    localStorage.setItem("affiliateUrlLM", res.affiliateUrlLM);
                    if (res.affiliateCode != "") {
                        Cookie.Create(
                            "CO_affiliate",
                            "affiliate=" + res.affiliateCode,
                            2,
                        );
                        return res.affiliateCode;
                    }
                }
            });
        GetDomainOnce = true;
    }

    return "";
};

export const Cookie = {
    Create: (name, value, days) => {
        let expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        let domain = document.location.hostname;
        let domainSplits = domain.split(".");
        let isIPDomain =
            /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(
                domain,
            );
        if (!(domainSplits.length === 1) && !isIPDomain) {
            if (domainSplits.length >= 3) {
                domainSplits = domainSplits.slice(-2);
                domain = "." + domainSplits.join(".");
            } else {
                domain = "." + domainSplits.join(".");
            }
        }
        var encodeValue = encodeURIComponent(value);
        document.cookie =
            name + "=" + encodeValue + expires + "; path=/; domain=" + domain;
        // document.cookie = name + '=' + value + expires + '; path=/;';
    },
    Delete: (cookieName) => {
        Cookie.Create(cookieName, "", -1);
        document.cookie =
            cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },
    Get: (cookieName) => {
        var name = cookieName + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    GetCookieKeyValue: (cookieName) => {
        let aff = Cookie.Get(cookieName);
        return aff ? aff.split("=")[1] : "";
    },
};

export function isGuest() {
    return (
        typeof localStorage !== "undefined" &&
        !localStorage.getItem("access_token")
    );
}

/**
 * 未登录可以打开的游戏
 * @param {*} _gameCatCode
 * @param {*} _provider
 * @returns
 */
export function isThisAllowGuestOpenGame(_gameCatCode, _provider) {
    _provider =
        _provider && typeof _provider === "string"
            ? _provider.toUpperCase()
            : undefined;
    return (
        (_gameCatCode === SportsbookGameCatCode && _provider !== "IPSB") ||
        (_gameCatCode === ESportsGameCatCode && _provider === "IPES") ||
        (_gameCatCode === ESportsGameCatCode && _provider === "TFG")
    );
}

/**
 * 未登录可以查看列表的游戏
 * @param {*} _gameCatCode
 * @param {*} _provider
 * @returns
 */
export function isThisAllowGuestOpenGCategory(_gameCatCode, _provider) {
    _provider =
        _provider && typeof _provider === "string"
            ? _provider.toUpperCase()
            : undefined;
    return (
        (_gameCatCode === InstantGamesGameCatCode && _provider === "SPR") ||
        (_gameCatCode === SportsbookGameCatCode && _provider === "VTG") ||
        _gameCatCode === LiveCasinoGameCatCode ||
        _gameCatCode === P2PGameCatCode ||
        _gameCatCode === SlotGameCatCode ||
        _gameCatCode === KenoLotteryGameCatCode
    );
}

/* 以下是 进行客户端判断 */
export function isMobile() {
    var check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                a,
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4),
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

export function isMobileAndroid() {
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
    };

    return isMobile.Android();
}

export function isMobileIOS() {
    var isMobile = {
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
    };

    return isMobile.iOS();
}

export function getE2BBValue() {
    return window.E2GetBlackbox
        ? window.E2GetBlackbox().blackbox == "" ||
          window.E2GetBlackbox().blackbox == undefined
            ? ""
            : window.E2GetBlackbox().blackbox
        : "";
}

export function getMaskHandler(type, value) {
    if (!value) {
        return "";
    }
    const strValue = String(value);
    let maskedValue;

    function getStar(number) {
        const statString = Array.from(
            { length: number },
            (cur) => (cur = "*"),
        ).join("");
        return statString;
    }
    function formatRealname(name) {
        const words = name.split(" ");
        const Initials = words[0][0];
        const stars = "*".repeat(words[0].length - 1);
        let formattedName = `${Initials}${stars}`;
        if (words.length > 1) {
            for (let i = 1; i < words.length; i++) {
                const initial = words[i][0];
                const wordStars = "*".repeat(words[i].length - 1);
                formattedName += ` ${initial}${wordStars}`;
            }
        }
        return formattedName;
    }

    switch (type) {
        case "RealName":
            maskedValue = formatRealname(strValue);
            break;
        case "cardID":
            maskedValue = getStar(12) + strValue.slice(12);
            break;
        case "Email":
            const [frontPart, rearPart] = strValue.split("@");
            if (frontPart.length < 3) {
                maskedValue = strValue;
            } else {
                maskedValue =
                    getStar(frontPart.length - 3) +
                    frontPart.slice(frontPart.length - 3) +
                    "@" +
                    rearPart;
            }
            break;
        case "Phone":
            maskedValue =
                getStar(strValue.length - 4) +
                strValue.slice(strValue.length - 4);
            break;
        case "Date":
            // maskedValue = strValue.slice(0, 2) + "**日**月**年";
            maskedValue = strValue;
            break;
        case "Security answer":
            maskedValue = strValue.slice(0, 1) + getStar(strValue.length - 1);
            break;
        default:
            break;
    }

    return maskedValue;
}
\
/***
 * 用戶存款狀態檢查函數
 *
 * 返回 { code: 下面的結果碼, flags: api返回的result數據 }
 * NO_OTP_TIMES: 	未通過手機驗證，沒剩餘OTP次數 		=> 	展示超過驗證次數頁
 * HAS_OTP_TIMES: 未通過手機驗證，還有OTP剩餘次數 	=>	進入手機驗證頁面
 * IS_IWMM: 			已通過手機驗證，還沒驗證銀行卡		=>	只展示部分存款方式，和提示按鈕
 * NOT_IWMM: 			已通過手機驗證，已驗證銀行卡			=>  展示全部可用存款方式
 *
 * 錯誤(需要用catch抓)
 * DATA_ERROR0: 	CustomFlag API有通 但返回數據不對
 * NET_ERROR0: 		CustomFlag API請求報錯
 */
export function getDepositVerifyInfo() {
    return new Promise((resolve, reject) => {
        get(ApiPort.MemberFlagsStatus + "&flagKey=BankCardVerification")
            .then((data) => {
                if (data.isSuccess) {
                    //手机验证
                    if (data.result.isDepositVerificationOTP) {
                        //检查验证剩余次数
                        let channelType = "SMS";
                        let serviceAction = "DepositVerification";

                        get(
                            ApiPort.VerificationAttempt +
                                `&channelType=${channelType}&serviceAction=${serviceAction}`,
                        )
                            .then((data) => {
                                if (data) {
                                    if (data.remainingAttempt <= 0) {
                                        //沒剩餘次數，直接展示超過驗證次數頁
                                        resolve({
                                            code: "NO_OTP_TIMES",
                                            flags: data.result,
                                        });
                                    } else {
                                        //還有剩餘次數，進入手機驗證頁面
                                        resolve({
                                            code: "HAS_OTP_TIMES",
                                            flags: data.result,
                                        });
                                    }
                                } else {
                                    //reject('DATA_ERROR1'); 增加可用性：無數據或失敗 也當作有OTP次數，反正最後提交OTP API應該也不會過
                                    resolve({
                                        code: "HAS_OTP_TIMES",
                                        flags: data.result,
                                    });
                                }
                            })
                            .catch((err) => {
                                //reject('NET_ERROR1'); 增加可用性：無數據或失敗 也當作有OTP次數，反正最後提交OTP API應該也不會過
                                resolve({
                                    code: "HAS_OTP_TIMES",
                                    flags: data.result,
                                });
                            });
                    } else {
                        //已通過手機驗證
                        if (data.result.isIWMM) {
                            resolve({ code: "IS_IWMM", flags: data.result });
                        } else {
                            resolve({ code: "NOT_IWMM", flags: data.result });
                        }
                    }
                } else {
                    reject("DATA_ERROR0");
                }
            })
            .catch((err) => {
                reject("NET_ERROR0");
            });
    });
}

//是否支持webp 格式
export function isWebPSupported() {
    if (typeof window === "undefined") return false;
    const elem = document.createElement("canvas");
    if (elem.getContext && elem.getContext("2d")) {
        // was able or not to get WebP representation
        return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
    }
    return false;
}

/**
 * 公用处理 API Error 来显示
 * @param {Object} error API 返回的error
 * @returns 要显示的具体error内容
 */
export const getDisplayPublicError = (error = {}) => {
    console.log(
        "🚀 ~ file: helper.js:480 ~ getDisplayPublicError ~ error:",
        error,
    );
    let Msg = "";
    if (error?.errors && Array.isArray(error.errors) && error.errors[0]) {
        if (error.errors[0].description) {
            Msg = error.errors[0].description;
        } else if (error.errors[0].message) {
            Msg = error.errors[0].message;
        }
    }
    return Msg;
};

/**
 * 游戏在测试环境用http还是https根据当前网址来判断
 * 仅测试环境这样
 * @param {String} PRODUCT_CODE  游戏的Provider code
 * @returns
 */
export const whichUseHttpForGameLaunch = (PRODUCT_CODE) => {
    const protocol = window?.location?.protocol;
    if (HostConfig.Config.IsStaging && protocol) {
        return ApiPort.LOCAL_HOST.replace("https", protocol);
    } else {
        return ApiPort.LOCAL_HOST;
    }
};
