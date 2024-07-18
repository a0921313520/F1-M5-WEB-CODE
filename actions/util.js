import { CLEAR_COOKIE_KEY } from "./constantsData";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
class Util {
    constructor() {}
    hasClass(elem, cls) {
        cls = cls || "";
        if (cls.replace(/\s/g, "").length == 0) return false;
        return new RegExp(" " + cls + " ").test(" " + elem.className + " ");
    }
    addClass(elem, cls) {
        if (!this.hasClass(elem, cls)) {
            ele.className =
                ele.className == "" ? cls : ele.className + " " + cls;
        }
    }
    removeClass(elem, cls) {
        if (this.hasClass(elem, cls)) {
            let newClass = " " + elem.className.replace(/[\t\r\n]/g, "") + " ";
            while (newClass.indexOf(" " + cls + " ") >= 0) {
                newClass = newClass.replace(" " + cls + " ", " ");
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, "");
        }
    }
    parentsUtil(elem, cls) {
        if (elem) {
            while (elem && !this.hasClass(elem, cls)) {
                elem = elem.parentNode;
            }
            return elem;
        } else {
            return null;
        }
    }
}

/**
 * @description: 手机号码**替代
 * @param {*} number
 * @return {*}
 */
export function numberConversion(number = "") {
    // 如果输入为空，则直接返回空字符串
    if (!number) {
        return "";
    }
    // console.log(number);
    let numberDelPrefix = number.split("-")[1];
    let numberArr = numberDelPrefix.split("");
    //Mask & display last 4 characters when length > 4 characters else no mask is required
    if (numberArr && numberArr.length > 4) {
        const tail4 = numberArr.slice(-4);
        return [...Array(numberArr.length - 4).fill("*"), ...tail4].join("");
    } else {
        return numberArr.join("");
    }
}

// 移除沙巴体育
export function checkIsRemoveShaba(RegisterDate) {
    const timestamp = new Date(RegisterDate).getTime();
    const HeaderShabaDisplay = document.getElementById("Sportsbook_OWS");
    let times = false;
    if (HeaderShabaDisplay) {
        times = timestamp >= 1606752001000;
        HeaderShabaDisplay.style.display =
            timestamp >= 1606752001000 ? "none" : "inline-block";
    }

    return times;
}

export function getUrlVars() {
    var vars = {},
        hash;
    var hashes = window.location.href
        .slice(window.location.href.indexOf("?") + 1)
        .split("&");
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split("=");
        if (hash[1]) {
            // vars.push(hash[0]);
            vars[hash[0]] = hash[1].split("#")[0];
        }
    }
    return vars;
}

/**
 * 格式化金额
 * 金额有小数点则保留后二位
 * 可选择带是否需要后缀 .00。
 * @param {Number/String} num 金额
 * @param {String} suffixes 是否需要.00后缀
 * @returns 返回格式化后的金额
 */
export function formatAmount(num, suffixes = "") {
    if (!num) {
        return 0;
    }
    let numCount = num.toString().split(".");
    const numCountVal =
        (numCount[0] + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,") +
        (numCount[1]
            ? "." + numCount[1].toString().substr(0, 2)
            : suffixes === "TwoDecimalSuffixes"
              ? ".00"
              : "");
    return typeof num === "number" && isNaN(num) ? 0 : numCountVal;
}

export function Cookie(name, value, options) {
    // 如果第二个参数存在
    if (typeof value !== "undefined") {
        options = options || {};
        if (value === null) {
            // 设置失效时间
            options.expires = -1;
        }
        var expires = "";
        // 如果存在事件参数项，并且类型为 number，或者具体的时间，那么分别设置事件
        if (
            options.expires &&
            (typeof options.expires == "number" || options.expires.toUTCString)
        ) {
            var date;
            if (typeof options.expires == "number") {
                date = new Date();
                date.setTime(date.getTime() + options.expires * 60 * 1000);
            } else {
                date = options.expires;
            }
            expires = "; expires=" + date.toUTCString();
        }
        // var path = options.path ? '; path=' + options.path : '', // 设置路径
        var domain = options.domain ? "; domain=" + options.domain : "", // 设置域
            secure = options.secure ? "; secure" : ""; // 设置安全措施，为 true 则直接设置，否则为空

        // 如果第一个参数不存在则清空所有Cookie
        if (name === null) {
            const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (let i = keys.length; i--; ) {
                    if (~CLEAR_COOKIE_KEY.indexOf(keys[i])) {
                        document.cookie = [
                            keys[i],
                            "=",
                            encodeURIComponent(value),
                            expires,
                            "; path=/zh",
                            domain,
                            secure,
                        ].join("");
                    }
                }
                for (let i = keys.length; i--; ) {
                    document.cookie = [
                        keys[i],
                        "=",
                        encodeURIComponent(value),
                        expires,
                        "; path=/",
                        domain,
                        secure,
                    ].join("");
                }
            }
        } else {
            // 把所有字符串信息都存入数组，然后调用 join() 方法转换为字符串，并写入 Cookie 信息
            document.cookie = [
                name,
                "=",
                encodeURIComponent(value),
                expires,
                "; path=/",
                domain,
                secure,
            ].join("");
        }
    } else {
        // 如果第二个参数不存在
        var CookieValue = null;
        if (document.cookie && document.cookie != "") {
            var Cookie = document.cookie.split(";");
            for (var i = 0; i < Cookie.length; i++) {
                var CookieIn = (Cookie[i] || "").replace(/^\s*|\s*$/g, "");

                if (CookieIn.substring(0, name.length + 1) == name + "=") {
                    CookieValue = decodeURIComponent(
                        CookieIn.substring(name.length + 1),
                    );
                    break;
                }
            }
        }
        return CookieValue;
    }
}

export function formatSeconds(value) {
    function checkZero(str) {
        str = str.toString();
        return str.length === 1 ? "0" + str : str;
    }

    var seconds = parseInt(value); // 秒
    var minute = 0; // 分
    var hour = 0; // 小时

    if (seconds > 60) {
        minute = parseInt(seconds / 60);
        seconds = parseInt(seconds % 60);
        if (minute > 60) {
            hour = parseInt(minute / 60);
            minute = parseInt(minute % 60);
        }
    }
    var result = "" + checkZero(parseInt(seconds));
    if (minute > 0) {
        result = "" + checkZero(parseInt(minute)) + ":" + result;
    } else {
        result = "00:" + result;
    }
    if (hour > 0) {
        result = "" + checkZero(parseInt(hour)) + ":" + result;
    }
    return result;
}
// 根据秒格式化时间
export function formatDateTime(value) {
    // 前置加零
    const checkZero = (str) => {
        str = str.toString();
        return str <= 9 ? "0" + str : str;
    };
    var seconds = parseInt(value), // 秒
        minute = 0, // 分
        hour = 0, // 小时
        day = 0; // 天

    if (seconds >= 60) {
        minute = parseInt(seconds / 60);
        seconds = parseInt(seconds % 60);
        if (minute >= 60) {
            hour = parseInt(minute / 60);
            minute = parseInt(minute % 60);
            if (hour >= 24) {
                day = parseInt(hour / 24);
                hour = parseInt(hour % 24);
            }
        }
    }
    return [
        checkZero(parseInt(day)),
        checkZero(parseInt(hour)),
        checkZero(parseInt(minute)),
        checkZero(parseInt(seconds)),
    ];
}
// 获取本地格式化时间
export function dateFormat() {
    let date = new Date(Date.now() + 8 * 3600000);
    let str = date.toISOString().replace("T", " ");
    return str.substr(0, str.lastIndexOf("."));
}

//格式化后台接口返回时间，例："2021-01-05T18:17:47.624"
export function formatTime(value) {
    if (value) {
        let time = value.split("T").join(" ").split(".")[0];
        return time;
    }
}
// 浮点数计算
export function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return (
        (Number(d.replace(".", "")) * Number(e.replace(".", ""))) /
        Math.pow(10, c)
    );
}
function div(a, b) {
    var c,
        d,
        e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return (
        (c = Number(a.toString().replace(".", ""))),
        (d = Number(b.toString().replace(".", ""))),
        mul(c / d, Math.pow(10, f - e))
    );
}
export function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) + mul(b, e)) / e;
}
export function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) - mul(b, e)) / e;
}

export function formatDate(dateStr) {
    const hasPointIdx = dateStr && dateStr.indexOf(".");
    return dateStr
        ? hasPointIdx >= 0
            ? dateStr.replace("T", " ").substring(5, hasPointIdx - 3)
            : dateStr.replace("T", " ").substring(5, dateStr.length - 3)
        : "";
}

export function formatYearMonthDate(dateStr) {
    const hasPointIdx = dateStr && dateStr.indexOf(".");
    return dateStr
        ? hasPointIdx >= 0
            ? dateStr.replace("T", " ").substring(0, hasPointIdx - 3)
            : dateStr.replace("T", " ").substring(0, dateStr.length - 3)
        : "";
}

// 延迟加载图片
export function lazyLoadImg(parentNodeId) {
    const imgs = Array.from(
        document.getElementById(parentNodeId).getElementsByTagName("img"),
    );
    if (imgs[0] && imgs[0].getAttribute("src")) return;
    imgs.forEach((item) => {
        item && item.setAttribute("src", item.getAttribute("data-src"));
    });
}

/**
 * 无缝滚动
 * @param {string/boolean} target 祖先React节点  [boolean] 是否清除定时器
 * @param {number} [sp=18] 速度
 * @param {string top/right} 移动方位
 * @return 返回 定时器状态
 */
export function marqueeAnimate(target, direction, sp, call) {
    // 清除定时器
    if (typeof target === "boolean" && target === true) {
        clearInterval(timer);
        clearTimeout(onlyTimer);
        return false;
    }

    var timer = null,
        onlyTimer = null;
    var $container = target.childNodes[0],
        container = $container.childNodes[0],
        $marqueeItem =
            container.tagName === "UL"
                ? container.childNodes
                : $container.childNodes,
        last = $marqueeItem[$marqueeItem.length - 1],
        len = $marqueeItem.length,
        speed = sp || 18,
        dir = direction || "top";

    var rolling;
    if (dir == "top") {
        $container.appendChild(container.cloneNode(true));
        // let height = last.offsetTop + last.offsetHeight;

        rolling = function () {
            if (target.scrollTop === last.offsetTop) {
                target.scrollTop = 0;
            } else {
                target.scrollTop++;
            }
            if (target.scrollTop % last.offsetHeight === 0) {
                clearInterval(timer);
                onlyTimer = setTimeout(() => {
                    timer = setInterval(rolling, speed);
                    let index = target.scrollTop / last.offsetHeight + 1;
                    typeof call === "function" &&
                        call(index === len ? 0 : index);
                }, 3000);
            }
        };
    } else if (dir == "right") {
        $container.appendChild(container.cloneNode(true));
        // 此处减去左边的图标显示所占的偏移值
        var width =
            last.offsetLeft + last.offsetWidth - $marqueeItem[0].offsetLeft;
        rolling = function () {
            if (target.scrollLeft == width) {
                target.scrollLeft = 0;
            } else {
                target.scrollLeft++;
            }
        };
    }

    timer = setInterval(rolling, speed); // 设置定时器
    container.addEventListener("mouseenter", function () {
        clearInterval(timer);
        clearTimeout(onlyTimer);
    });
    container.addEventListener("mouseleave", function () {
        onlyTimer = setTimeout(() => {
            // 鼠标移开时重设定时器
            timer = setInterval(rolling, speed);
            let index = target.scrollTop / last.offsetHeight + 1;
            typeof call === "function" && call(index === len ? 0 : index);
        }, 3000);
    });

    return false;
}

/**
 * @description: 邮箱隐藏 ***占位
 * @param {*} email
 * @return {*}
 */
export const mailConversion = (email = "") => {
    // 如果输入为空，则直接返回空字符串
    if (!email) {
        return "";
    }
    //Mask & display last 3 characters before @ when length > 3 characters else no mask is required
    let head = email.split("@")[0];
    let tail = email.split("@")[1];
    let headArr = head.split("");
    if (headArr && headArr.length > 3) {
        const headsTail3 = head.slice(-3);
        return (
            [...Array(head.length - 3).fill("*"), ...headsTail3].join("") +
            "@" +
            tail
        );
    } else {
        return email;
    }
    // const atIndex = email.indexOf('@');

    // // 如果 @ 符号前面的字符数小于等于 4，则将全部的字符替换成 *
    // if (atIndex <= 4) {
    //   return email.replace(/^(.*?@)/, '******@');
    // }

    // // 如果 @ 符号前面的字符数大于 4，则只替换前四个字符
    // return email.replace(/^(.{4}).*?@/, '$1******@');
};

/**
 * @description: 数组对象去重
 * @param {*} obj 数组对象
 * @return {*}
 */
export const deteleObject = (obj) => {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function (a, b) {
            return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniques.push(obj[i]);
            stringify[str] = true;
        }
    }
    uniques = uniques;
    return uniques;
};

/**
 * @description:指定数组元素相加
 * @param undefined
 * @return {*}
 */
export function SumValue(arr, key) {
    if (Array.isArray(arr)) {
        let arrSum = 0;
        arr.forEach((item, index) => {
            arrSum += item[key];
        });
        return arrSum;
    }
    return 0;
}

/**
 * @description: 获取二级域名 转换动态api 域名
 * @param {*} input 完整域名
 * @return {*}
 */
export function Domainparse(input) {
    if (typeof input !== "string") {
        throw new TypeError("Domain name must be a string.");
    }
    // Force domain to lowercase.
    var domain = input.slice(0).toLowerCase();
    // Handle FQDN.
    // TODO: Simply remove trailing dot?
    if (domain.charAt(domain.length - 1) === ".") {
        domain = domain.slice(0, domain.length - 1);
    }
    var parsed = {
        input: input,
        tld: null,
        sld: null,
        domain: null,
        subdomain: null,
        listed: false,
    };
    var domainParts = domain.split(".");
    // Non-Internet TLD
    if (domainParts[domainParts.length - 1] === "local") {
        return parsed;
    }
    var handlePunycode = function () {
        if (!/xn--/.test(domain)) {
            return parsed;
        }
        if (parsed.domain) {
            parsed.domain = Punycode.toASCII(parsed.domain);
        }
        if (parsed.subdomain) {
            parsed.subdomain = Punycode.toASCII(parsed.subdomain);
        }
        return parsed;
    };
    var rule = null;
    // Unlisted tld.
    if (!rule) {
        if (domainParts.length < 2) {
            return parsed;
        }
        parsed.tld = domainParts.pop();
        parsed.sld = domainParts.pop();
        parsed.domain = [parsed.sld, parsed.tld].join(".");
        if (domainParts.length) {
            parsed.subdomain = domainParts.pop();
        }
        return handlePunycode();
    }
    // At this point we know the public suffix is listed.
    parsed.listed = true;

    var tldParts = rule.suffix.split(".");
    var privateParts = domainParts.slice(
        0,
        domainParts.length - tldParts.length,
    );

    if (rule.exception) {
        privateParts.push(tldParts.shift());
    }
    parsed.tld = tldParts.join(".");
    if (!privateParts.length) {
        return handlePunycode();
    }
    if (rule.wildcard) {
        tldParts.unshift(privateParts.pop());
        parsed.tld = tldParts.join(".");
    }

    if (!privateParts.length) {
        return handlePunycode();
    }
    parsed.sld = privateParts.pop();
    parsed.domain = [parsed.sld, parsed.tld].join(".");
    if (privateParts.length) {
        parsed.subdomain = privateParts.join(".");
    }
    return handlePunycode();
}

/**
 * @description: 客服
 * @param {*}
 * @return {*}
 */
export function PopUpLiveChat() {
    FUN88Live && FUN88Live.close();
    let FUN88Live = window.open(
        "about:blank",
        "chat",
        "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=540, height=650",
    );
    const openServer = (serverUrl) => {
        FUN88Live.document.title = "FUN88 Live Chat";
        FUN88Live.location.href = serverUrl;
        FUN88Live.focus();
    };

    let url = localStorage.getItem("serverUrl");
    if (url) {
        openServer(url);
    }
    get(ApiPort.GETLiveChat).then((res) => {
        if (res.isSuccess) {
            localStorage.setItem("serverUrl", res.result);
            !url && openServer(res.result);
        }
    });
}
/**
 * @description: 生产区间随机数
 * @param {*} min 最低
 * @param {*} max 最大
 * @return {*}
 */
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//节流
export const throttle = (func, delay) => {
    let timerId = null;
    let lastArgs = null;
    const throttledFunc = (...args) => {
        lastArgs = args;
        if (!timerId) {
            timerId = setTimeout(() => {
                func(...lastArgs);
                timerId = null;
            }, delay);
        }
    };
    return throttledFunc;
};

//返回顶部
export const backToTop = () => {
    document.querySelector("body")?.scrollIntoView({
        behavior: "smooth", // 平滑滚动
        block: "start", // 垂直方向上对齐到顶部
    });
};

/**
 * 格式化数字
 * @param {String} value
 * @returns {Number} 数字类型的结果
 * 例子：123*-45/！@#6￥%7……&*8（9；
 * 返回 123456789
 * 如果是纯字符没数字会返回0
 */
export const numberValidatorHandler = (value) => {
    if (!value) return "";
    const regex1 = /[^0-9]/g;
    const regex2 = /[+*/e-]/g;
    let validValue = Number(
        String(value).replace(regex1, "").replace(regex2, ""),
    );
    return validValue;
};

/**
 * 使用正则表达式匹配两个及以上的空白字符，并替换为一个空格
 * @param {*} str
 * @returns
 */
export const replaceMultipleSpacesWithSingle = (str) => {
    return str.replace(/\s{2,}/g, " ");
};
export default Util;
