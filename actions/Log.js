/*
 * @Description:  请求日志
 * 	注意 : 相關勿傳
 *  會員個資/姓名/電話/銀行卡帳號/銀行卡姓名 /email /安全問題答案/ 身分證ID / social media info/ 密碼
 *	用 欄位名 過濾掉
 */
import { timeout_fetch } from "./TlcRequest";
import HostConfig from "./Host.config";
import { cloneDeep } from "lodash";

export function LogPost(apiUrl, paramsinfo, logData) {
    if (process.env.NODE_ENV !== "production") {
        return;
    }
    //判断是不是CMS API
    const isCms = apiUrl.indexOf("/vi-vn/api/v1/") != -1;
    const memberInfo =
        (!!localStorage.getItem("memberInfo") &&
            JSON.parse(localStorage.getItem("memberInfo"))) ||
        {};
    const params = {
        api_category: isCms ? "CMS api" : "Flash api",
        api_url: apiUrl,
        app_version: "2.0",
        brand: "fun88",
        client_id: "F1M3.Web",
        client_ip: "--",
        device_brand: navigator.vendor,
        device_model: navigator.userAgent,
        duration:
            new Date().getTime() - new Date(logData.request_time).getTime(),
        global_session_id: !!localStorage.getItem("access_token")
            ? JSON.parse(localStorage.getItem("access_token"))
            : "--",
        log_group: "--",
        log_level: logData.responseStatus != 200 ? "error" : "info",
        membership_id: "--",
        method: logData.method,
        os_type: getOS(),
        os_version: navigator.appVersion,
        page: window.location.pathname,
        public_ip: "--",
        request: JSON.stringify(filterLogging(paramsinfo)) ?? "--",
        request_time: getCurrentTime(logData.request_time),
        response: logData.error
            ? JSON.stringify({
                  responseData: logData.responseData,
                  error: logData.error,
              })
            : (filterLogging(logData.responseData) ?? "--"),
        response_time: getCurrentTime(new Date()),
        session_id: "--",
        status_code: logData.responseStatus,
        user_id: memberInfo?.memberCode ?? "--",
        user_name: memberInfo?.userName ?? "--",
    };
    PostLog(params);
}

function getCurrentTime(dateData) {
    if (!dateData) {
        return "--";
    }
    var date = dateData; //当前时间
    var year = date.getFullYear(); //年
    var month = repair(date.getMonth() + 1); //月
    var day = repair(date.getDate()); //日
    var hour = repair(date.getHours()); //时
    var minute = repair(date.getMinutes()); //分
    var second = repair(date.getSeconds()); //秒

    //当前时间
    var curTime =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second;
    return curTime;
}

//若是小于10就加个0

function repair(i) {
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return i;
    }
}

async function PostLog(params) {
    let apiUrl = HostConfig.Config.IsLIVE
        ? "https://logging-gateway.gamealiyun.com/api/v1.0/logs"
        : "https://stlogging.gamealiyun.com/api/v1.0/logs";
    try {
        timeout_fetch(
            fetch(apiUrl, {
                method: "POST",
                body: JSON.stringify([params]),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
            }),
            5000,
        )
            .then((responseData) => {})
            .then((responseData) => {})
            .catch((err) => {
                // 网络请求失败返回的数据
                console.log("ApiHost.serverUrl:" + JSON.stringify(err));
            });
    } catch (error) {
        console.log("Request Failed", error);
    }
}

const isMobile = (thisUserAgent) => {
    if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            thisUserAgent,
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            thisUserAgent.substr(0, 4),
        )
    ) {
        return true;
    }
    return false;
};

const getOS = () => {
    const thisUserAgent =
        navigator.userAgent || navigator.vendor || window.opera;
    if (isMobile(thisUserAgent)) {
        if (/(android)/i.test(thisUserAgent)) return "android";
        if (/iPad|iPhone|iPod/i.test(thisUserAgent)) return "ios";
        return "mobile(others)";
    } else {
        //Desktop
        if (thisUserAgent.indexOf("Win") !== -1) return "windows";
        if (thisUserAgent.indexOf("Mac") !== -1) return "mac";
        return "desktop(others)";
    }
};
// 過濾會員隱私資料
const keyWord = [
    "password",
    "oldpassword",
    "newpassword",
    "Password",
    "oldPassword",
    "newPassword",
    "confirmPassword",
];

function filterLogging(obj) {
    if (!obj) return "--";
    const result = cloneDeep(obj); // 深拷貝複製物件
    const properties = Object.keys(result); // 取得物件中的所有屬性名稱
    for (const property of properties) {
        if (keyWord.includes(property)) {
            // 檢查屬性名稱是否在 keyWord 陣列中
            delete result[property]; // 刪除該屬性
        } else if (typeof result[property] === "object") {
            // 如果該屬性是物件，則遞迴檢查
            result[property] = filterLogging(result[property]);
        }
    }
    return result;
}
