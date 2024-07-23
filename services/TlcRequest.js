import { Modal, message } from "antd";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import {
    getQueryVariable,
    Cookie,
    getDisplayPublicError,
} from "$SERVICEShelper";
import { LogPost } from "./Log";

//这个些API 如果返回400，则返回给函数内部处理。不在这里使用公共的message显示
const APIERRORLIST = [
    "api/Payment/Application/UploadAttachment",
    "api/Member/InfoValidity",
    // "api/Promotion/ManualPromo",
    "api/Auth/ForgetUsername/Email",
    "api/Auth/ChangePassword", //otp重置密码
];
message.config({
    top: 50,
    maxCount: 1,
});
export default function request(method, url, body, token) {
    const localToken = localStorage.getItem("access_token");
    let redirectToken = null;

    localToken && (redirectToken = getQueryVariable("redirectToken"));
    method = method.toUpperCase();
    if (method === "GET") {
        body = undefined;
    } else {
        body = body && JSON.stringify(body);
    }
    //区分两种Api CMS/Flash
    let isCms = url.indexOf("vi-vn/api/v1/") != -1;
    let isCaptcha = url.indexOf("/api/v1.0/") != -1;

    let header;
    header = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Culture: "vi-vn",
        token: "71b512d06e0ada5e23e7a0f287908ac1",
    };
    if (token || JSON.parse(localToken)) {
        header["Authorization"] = token || JSON.parse(localToken);
    }
    //仅Flash会添加
    if (!isCms && !isCaptcha) {
        header["x-bff-key"] = "51EXaTN7NUeCbjnvg95tgA==";
    }

    //Api日志
    let logData = {
        method: method,
        responseStatus: 0,
        request_time: new Date(),
        responseData: null,
    };
    const apiUrl = url + (isCms ? "" : "");

    return timeout_fetch(
        fetch(url, {
            method,
            headers: header,
            body,
        }),
    )
        .then((res) => {
            //記下 responseStatus
            if (res && res.status) {
                logData.responseStatus = res.status;
            }

            if (
                res.status === 401 ||
                res.status === 400 ||
                res.status === 503 ||
                res.status === 403 ||
                res.status === 428
            ) {
                let json = res.json();
                return json.then(Promise.reject.bind(Promise));
            }

            if (res.status === 500) {
                // 根据某些需求，某些api响应500状态码异常情况不需要报错。
                if (
                    !APIERRORLIST.some((apiErrVal) => ~url.indexOf(apiErrVal))
                ) {
                    //Router.push('/');
                } else {
                    return res.json();
                }
            } else if (res.status === 504) {
                //Router.push('/');
            } else if (res.status === 404) {
            } else {
                return res.json();
            }
        })
        .then((response) => {
            if (response) {
                logData.responseData = response;
            } else {
                logData.responseData = {};
            }
            // 日志
            LogPost(apiUrl, body, logData);
            return response;
        })
        .catch((error) => {
            logData.error = error;
            //避免日誌拿到空的error
            if (error && JSON.stringify(error) === "{}") {
                let newError = {};
                if (error.message) {
                    newError.message = error.message;
                }
                if (error.stack) {
                    newError.stack = error.stack;
                }
                if (JSON.stringify(newError) !== "{}") {
                    logData.error = newError;
                }
            }
            LogPost(apiUrl, body, logData);
            if (error.redirect) {
                var searchURL = window.location.search;
                searchURL = searchURL.substring(1, searchURL.length);
                var targetPageId = searchURL.split("&")[0].split("=")[1];
                if (error.redirect.Code == "GEN0003") {
                    if (targetPageId) {
                        window.location.href =
                            error.redirect.message + "?aff=" + targetPageId;
                    } else {
                        window.location.href = error.redirect.message;
                    }
                }
            }
            // 公共错误处理
            if (
                APIERRORLIST.some((apiErrVal) => ~url.indexOf(apiErrVal)) &&
                getDisplayPublicError(error)
            ) {
                return Promise.reject(error);
            }

            if (error && error.errors && error.errors.length != 0) {
                const ERRORCODE = error.errors[0].errorCode;

                switch (ERRORCODE) {
                    case "GEN0001":
                        // 维护界面
                        Cookie.Create(
                            "maintainTime",
                            error.error_details.RetryAfter,
                            1,
                        );
                        HttpStatus = 3;
                        Router.push("/");
                        break;
                    case "GEN0002":
                        // 不允许访问（地域限制）
                        HttpStatus = 4;
                        Router.push("/");
                        break;
                    case "GEN0005":
                    case "GEN0006":
                    case "IDSVR00006":
                    case "VAL99902":
                    case "VAL18014":
                    case "VAL99903":
                        if (!redirectToken) {
                            message.error("请重新登录，访问过期！", 3);
                            setTimeout(() => {
                                global.globalExit();
                                Router.push("/");
                            }, 1500);
                        }
                        return Promise.reject(error);
                    case "MEM00141":
                    case "MEM00140":
                        message.error(
                            error.errors[0].message ||
                                "您的账户已根据账户管理政策关闭了。",
                        );
                        localStorage.setItem(
                            "RestrictAccessCode",
                            error.error_details.Code,
                        );
                        Router.push(`/RestrictAccess`);
                        break;
                    case "MEM00145":
                        Nonecsbutton = true;
                        HttpStatus = 4;
                        global.globalExit();
                        Router.push("/");
                        break;
                    case "GEN0008":
                        if (window.location.href.indexOf("Safehouse") > -1) {
                            message.error(error.errors[0].message, 4);
                            global.redirectDomin &&
                                typeof global.redirectDomin === "function" &&
                                setTimeout(() => {
                                    global.redirectDomin();
                                }, 4000);
                        }
                        break;

                    case "MEM00004":
                    case "MEM00059":
                    case "MEM00060":

                    case "SafeHouseLoginFailed":
                        // Modal.info({
                        // 	className: 'confirm-modal-of-public',
                        // 	icon: <div />,
                        // 	title: '登入失败',
                        // 	centered: true,
                        // 	okText: '确认',
                        // 	zIndex: 2000,
                        // 	content: (
                        // 		<div
                        // 			style={{
                        // 				textAlign: 'center'
                        // 			}}
                        // 			dangerouslySetInnerHTML={{
                        // 				__html: error.errors[0].description
                        // 			}}
                        // 		/>
                        // 	)
                        // });
                        // GeetestFaile();
                        // error.json();
                        // break;

                        return Promise.reject(error);
                    //待處理PII問題
                    // case "PII00702":
                    //     Router.push("/RestrictAccess");
                    //     global.globalBlackListExit();
                    //     break;
                    case "VAL11056":
                        message.error(
                            error.errors[0]?.message ||
                                "系统错误，请联系在线支持！",
                            3,
                        );
                        break;
                    // 忘記密碼/忘記用戶名
                    case "VAL00001":
                    case "VAL08025":
                    case "VAL08026":
                    case "VAL03012":
                    case "VAL03001":
                    case "MEM00051":
                    case "P109001":
                    case "P109003":
                    case "VAL13014":
                    case "VAL13007":
                    case "VAL08052":
                    case "VAL03016": //重置密码 新密码不能与旧密码相同
                    case "VAL18015": // 手機驗證嘗試超過五次
                    case "VAL18016": // 驗證碼已發送，五分鐘後再嘗試
                    case "VAL18024": // 手機驗證碼失效
                    case "P103001":
                    case "P103114":
                    case "VAL11012":
                    case "SNC0002":
                    case "VERI9999": // usercenter无法生成安全码
                    case "P103106":
                    case "P101103":
                    case "VAL18023":
                    case "VAL18013":
                    case "P103103":
                    case "P101104":
                    case "P103109":
                    case "P103110":
                    case "P103111":
                    case "P103112":
                    case "P103113":
                    case "P103114":
                    case "P103115":
                    case "P101106":
                    case "P101053":
                    case "P101019":
                    case "P101017":
                    case "P106003":
                    case "SNC0001":
                    case "SNC0002":
                    case "SNC0003":
                    case "P111001":
                    case "VAL13034":
                    case "VAL13035":
                    case "MEM00061":
                        return error;
                    default:
                        message.error(error.errors[0].description);
                }
            } else if (error.message) {
                if (
                    error.status == "BAD_REQUEST" &&
                    (error.code == "63401" || error.code == "63403") &&
                    error.path == "/api/v1.0/judgement"
                ) {
                    // 登录图形滑动验证 确认滑动坐标的API，验证错误
                    // return error.json();
                    return Promise.reject(error);
                } else {
                    message.error(error.message);
                }
            }
        });
}
// GET 请求
export const get = (url) => request("GET", url);
// POST 请求
export const post = (url, body, token) => request("POST", url, body, token);
// PATCH 请求
export const patch = (url, body) => request("PATCH", url, body);
// PUT 上传
export const put = (url, body) => request("PUT", url, body);
// DELETE 删除
export const del = (url, body) => request("DELETE", url, body);

export const timeout_fetch = (fetch_promise, timeout = 600000) => {
    let timeout_fn = null;
    let timeout_promise = new Promise(function (resolve, reject) {
        timeout_fn = function () {
            reject({ message: "网络错误，请重试" });
        };
    });
    let abortable_promise = Promise.race([fetch_promise, timeout_promise]);
    setTimeout(function () {
        timeout_fn();
    }, timeout);

    return abortable_promise;
};
