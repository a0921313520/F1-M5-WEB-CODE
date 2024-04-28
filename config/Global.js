/* 全局变量初始化 */
global.goUserSign = function () {}; // 登陆注册弹窗呼出方法
global.goPage = function () {}; // 会员中心切换界面方法
global.showDialog = function () {}; // 钱包窗口呼出
global.globalExit = function () {}; // 公用退出方法
global.globalCS = function () {}; // 客服弹窗呼出方法
global.GeetestFaile = function () {};
global.PopUpLiveChat = function () {
    alert("Tải vui lòng đợi...");
}; // 呼出客服弹窗
global.Shopdatalist = "";
/* 联系方式 */
global.IsFromEmail = false;
/* 地区限制 */
global.isAffDisabled = false;
/* normal is 1, have header and footer is 1, no footer is 2, maintain is 3, restrictAccess is 4 */
global.HttpStatus = undefined;
global.NamePwdVerify = false;
global.Serverbtnnone = false;
global.PTStatus = true;
global.devhide = true;
global.RB88GpiStatus = false;
global.MGDEV = true;
global.Nonecsbutton = false;
global.isContactReg = false;
global.isContactPwd = false;
global.downloadLinks = "";
global.affiliateUrlLM = "";
global.SB = 0;
if (typeof global.location !== "undefined") {
    if (global.location.host == "localhost:6666") {
        global.PTStatus = true;
        global.devhide = true;
        global.RB88GpiStatus = true;
        global.MGDEV = true;
    } else {
        global.PTStatus = true;
        global.devhide = true;
        global.RB88GpiStatus = true;
        global.MGDEV = true;
    }
}
