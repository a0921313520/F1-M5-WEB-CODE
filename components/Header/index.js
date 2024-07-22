import React from "react";
import { Row, Col, Button, Icon, Menu, Modal, message, Spin } from "antd";
import dynamic from "next/dynamic";
import Router from "next/router";
import HasLogged from "./HasLogged";
import NotLogged from "./NotLogged";
import HeaderMenuBar from "./HeaderMenuBar";
import UserSign from "@/UserSign";
import { ApiPort, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { Cookie, formatAmount } from "$ACTIONS/util";
import { getMemberInfo } from "$DATA/userinfo";
import { get, post } from "$ACTIONS/TlcRequest";
import { LEARN_TIME } from "$ACTIONS/constantsData";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import {
    getQueryVariable,
    getAffiliateReferralCode,
    Cookie as Cookiehelper,
} from "$ACTIONS/helper";
import OpenGame from "@/Games/openGame";
import { getUrlVars } from "$ACTIONS/util";
import ImageWithFallback from "@/ImageWithFallback/imgLocal";
import { translate } from "$ACTIONS/Translate";
import { PopUpLiveChat as ContactCustomerService } from "$ACTIONS/util";
import { connect } from "react-redux";
import { userCenterActions } from "$STORE/userCenterSlice";
import { pathNameList } from "$DATA/me.static";
// 邮箱链接重置密码
// const DynamicResetPassword = dynamic(import('@/ResetPassword'), {
// 	loading: () => (""),
// 	ssr: true
// });

function HeaderComponent(props) {
    switch (props.status) {
        case 0:
            return (
                <NotLogged
                    smallHeader={props.smallHeader}
                    AlreadLogin={() => props.this.AlreadLogin()}
                    {...props}
                />
            );
        case 1:
            return (
                <HasLogged
                    LoginExit={() => props.this.LoginExit()}
                    {...props}
                    key={JSON.stringify(props.status)}
                />
            );
        default:
            return null;
    }
}
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            smallHeader: "",
            allBalance: 0, // 子组件余额记录
            isLogin: 0, // 0 未登录 1 已登录
            showType: -1, // 子组件HasLogged：-1 初始化 0.1 隐藏个人中心 0.2 隐藏余额 1 个人中心简介 2 余额
            messageHasUnRead: false, // 是否有未读消息（交易/个人）
            csvisible: false,
            csurl: "",
            lockHeader: 0, // 锁定Header状态（0：free、大：2、小：1）
            toggleCenterPopover: false, // 是否显示个人中心弹出框
            logoutType: "", // 8号商城登出问题
            referFriendLearn: false, // 推荐好友导引步骤
            rafStep: 1, // 推荐好友导引步骤
            isDeposit: false,
            isVerified: false,
            verifyEmail: false, // email link彈窗
            verifyEmailResult: "", // eamil link驗證結果
            EmailResultMessage: "", // eamil link驗證結果
            loading: false,
            logoHref: "",
            Referineligible: false,
            GameOpenModal: false,
        };

        this.onUserSign = () => {}; // 初始化登录注册呼出事件
        this.showSimple = () => {}; // 初始化显示个人或者余额下拉
        this.hideSimple = () => {}; // 初始化隐藏个人或者余额下拉
        this.parentShowSimple = this.parentShowSimple.bind(this); // 父组件呼出个人余额下拉
        this.parentHideSimple = this.parentHideSimple.bind(this); // 父组件隐藏个人余额下拉
        this.onHasLoggedEvent = this.onHasLoggedEvent.bind(this); // 获取子组件切换个人余额下拉
        this.ReferrerLinkActivity = this.ReferrerLinkActivity.bind(this);
        this.ReferreeTaskStatus = this.ReferreeTaskStatus.bind(this);
        this.getBrowser = this.getBrowser.bind(this);
        // this.closeLearn = this.closeLearn.bind(this);
        this.referLearnCancel = this.referLearnCancel.bind(this);
        // this.toggleHeaderCenterLearn = this.toggleHeaderCenterLearn.bind(this); // 切换个人中心弹出框教程状态
        this.resizeThrottle = this.resizeThrottle.bind(this);
        this.toggleHeader = this.toggleHeader.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);

        this.timer = null;
        this.urlParams = {}; // 传递一下链接参数
        this.verifyEmailLink = this.verifyEmailLink.bind(this); // 驗證email link
        global.PopUpLiveChat = this.PopUpLiveChat.bind(this); // 全局化打开客服窗口
        global.goReferFriend = this.goReferFriend.bind(this); // 全局化前往推荐好友
        global.GetThroughoutVerification =
            this.GetThroughoutVerification.bind(this);
    }
    componentDidMount() {
        // 因为导航二级菜单使用了全局属性url，所以每个有Hader的界面都需要赋值
        const affcode = getAffiliateReferralCode(),
            disabled =
                Cookiehelper.GetCookieKeyValue("CO_affiliate") != "undefined" &&
                Cookiehelper.GetCookieKeyValue("CO_affiliate") != "";
        global.downloadLinks = `${window.location.origin}/vn/Appinstall.html${
            disabled ? "?affCode=" + affcode : ""
        }`;

        window.addEventListener("scroll", this.resizeThrottle);
        // 传递锁定Header状态的方法出去
        this.props.setLockHeader &&
            this.props.setLockHeader((statusId) => {
                this.setState({
                    lockHeader: statusId,
                    smallHeader: statusId === 1 ? "zoom-out" : "",
                });
            });

        // 设置右侧滚动条宽度（避免弹出框因为滚动条抖动的问题）
        this.addStyle(
            `.ant-scrolling-effect .header-warp, .ant-scrolling-effect .fixed-right{right:${this.getScrollbarWidth()}px}.fixed-right{right: 0}`,
        );

        // 设置登陆状态
        if (localStorage.getItem("access_token")) {
            this.setState({ isLogin: 1 });
            this.props.setLoginStatus && this.props.setLoginStatus(true);
        }

        // 默认获取客服链接，只有在客服链接不同的情况才会替换已记录客服链接
        get(ApiPort.GETLiveChat).then((res) => {
            if (res && res.url !== localStorage.getItem("serverUrl")) {
                localStorage.setItem("serverUrl", res.result);
            }
        });

        // 邮箱链接进入界面重置密码流程
        const enc = getQueryVariable("enc"),
            actionParam = getQueryVariable("action");
        // 如果action参数为registered则弹出注册窗口
        actionParam === "registered" && global.goUserSign("2");
        if (enc) {
            // this.urlParams = {
            // 	enc: enc,
            // 	action: actionParam
            // };
            // this.setState({ showEmailResetPassword: true });
            window.location.href = `/vn/resetpassword?enc=${enc}`;
        }
        // email link的驗證
        if (
            global.location.pathname.indexOf("/vn/emailverification") != -1 &&
            enc &&
            actionParam === "EmailVerification"
        ) {
            // Router.push('/');
            setTimeout(() => this.verifyEmailLink(enc), 500);
        }

        // 跳转充值窗口，可以指定支付方式
        const payMethod = getQueryVariable("payMethod");
        if (payMethod) {
            if (!localStorage.getItem("access_token")) {
                global.goUserSign("1");
                return;
            }
            setTimeout(() => {
                const walletKey =
                    payMethod === "default"
                        ? `wallet:{"type": "deposit"}`
                        : `wallet:{"type": "deposit", "currentPayValue": "${payMethod}"}`;
                global.showDialog({ key: walletKey });
            });
        }

        // 推荐好友
        const raf = getQueryVariable("raf");
        if (!!raf) {
            localStorage.setItem("queleaReferrerId", raf);
            !localStorage.getItem("UserName") &&
                this.setState({ referFriendLearn: true });
            if (!sessionStorage.getItem("isReferrerFirst")) {
                // this.ReferrerLinkActivity(raf);
                sessionStorage.setItem("isReferrerFirst", "has");
            }
        }

        // 獲取是否支持第三方cookie
        window.addEventListener("message", this.receiveMessage, false);
        this.CheckUrkTokenToLogin();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.resizeThrottle);
        this.setState = () => false;
    }

    /**
     * @description: QRP登录
     * @return {*}
     */

    CheckUrkTokenToLogin() {
        let vars = getUrlVars();
        if (vars.ref && vars.ref !== "" && vars.token && vars.token !== "") {
            localStorage.setItem(
                "access_token",
                JSON.stringify("Bearer" + " " + vars.token),
            );
            localStorage.setItem("refresh_token", JSON.stringify(vars.ref));
        } else {
            return;
        }

        setTimeout(() => {
            this.AlreadLogin();
        }, 1000);

        setTimeout(() => {
            this.RefreshToken(vars.ref);
        }, 3000);
    }

    /**
     * @description: 刷新令牌
     * @param {*}
     * @return {*}
     */
    RefreshToken = (rstoken) => {
        const postData = {
            grantType: "refresh_token",
            clientId: "Fun88.VN.App",
            clientSecret: "FUNmuittenVN",
            refreshToken: rstoken,
        };

        post(ApiPort.RefreshTokenapi, postData)
            .then((res) => {
                if (res?.isSuccess && res.result) {
                    if (
                        res.result.accessToken?.accessToken &&
                        res.result.accessToken?.refreshToken
                    ) {
                        localStorage.setItem(
                            "access_token",
                            JSON.stringify(
                                "bearer " + res.result.accessToken.accessToken,
                            ),
                        );
                        ApiPort.Token =
                            "bearer " + res.result.accessToken.accessToken;
                        localStorage.setItem(
                            "refresh_token",
                            JSON.stringify(res.result.accessToken.refreshToken),
                        );
                    } else {
                        message.error(translate("请重新登录，访问过期！"), 3);
                        setTimeout(() => {
                            global.globalExit();
                            Router.push("/");
                        }, 1500);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    receiveMessage(evt) {
        if (evt.data === "MM:3PCunsupported") {
            localStorage.setItem("thirdPartyCookie", false);
            // console.log('第三方cookie不支持');
        } else if (evt.data === "MM:3PCsupported") {
            localStorage.setItem("thirdPartyCookie", true);
            // console.log('支持第三cookie');
        }
    }
    /**
     * 联系客服
     */
    PopUpLiveChat() {
        ContactCustomerService();
    }

    ReferreeTaskStatus() {
        // if (!sessionStorage.getItem("isLoginStatusFirst")) {

        // getMemberInfo((res) => {
        // 	this.setState({
        // 		isDeposit: !!res.isDeposited,
        // 		isVerified: res.isVerifiedPhone && res.isVerifiedPhone[1] && res.isVerifiedEmail[1]
        // 	});
        // });
        let memberInfo = JSON.parse(localStorage.getItem("memberInfo"));
        if (memberInfo) {
            this.setState({
                isDeposit: !!memberInfo.isDeposited,
                isVerified:
                    memberInfo.isVerifiedPhone &&
                    memberInfo.isVerifiedPhone[1] &&
                    memberInfo.isVerifiedEmail[1],
            });
        }
        get(ApiPort.ReferreeTaskStatus).then((data) => {
            if (localStorage.getItem("OpenReferDone")) {
                return;
            }
            if (data && data.isSuccess && data.result) {
                console.log("推荐好友状态", data);
                if (memberInfo.displayReferee) {
                    if (!data.result.isDeposited) {
                        this.setState({
                            rafStep: 2,
                            referFriendLearn: true,
                        });
                    } else {
                        if (!data.result.isContactVerified) {
                            this.setState({
                                rafStep: 3,
                                referFriendLearn: true,
                            });
                        } else {
                            this.setState({
                                rafStep: 4,
                                referFriendLearn: true,
                            });
                        }
                    }
                } else {
                    if (
                        data.result.isActiveCampaign &&
                        data.result.isContactVerified
                    ) {
                        this.GetThroughoutVerification();
                    }
                }
            }
        });
    }

    //获取推荐好友的状态
    GetThroughoutVerification() {
        post(ApiPort.ThroughoutVerification)
            .then((data) => {
                let GameReferModal = localStorage.getItem(
                    localStorage.getItem("UserName") + "_GameReferModal",
                );
                if (GameReferModal) {
                    return;
                }
                if (data.isSuccess && data.result) {
                    this.setState({
                        GameOpenModal: true,
                    });
                } else {
                    //重置修改密码后，才弹下面的窗口，否则不弹
                    if (data.errors && data.errors[0].errorCode == "VAL99903") {
                        return;
                    }
                    //弹出不符合资格弹窗
                    this.setState({
                        Referineligible: true,
                    });
                }
                this.setState({
                    referFriendLearn: false,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    goReferFriend() {
        get(ApiPort.GetQueleaActiveCampaign).then((res) => {
            if (res?.isSuccess) {
                if (!localStorage.getItem("access_token")) {
                    global.goUserSign("1");
                    return;
                } else {
                    Router.push("/referrer-activity");
                }
            } else {
                Modal.confirm({
                    className: "confirm-modal-of-public dont-show-close-button",
                    title: translate("不符合资格的账户"),
                    centered: true,
                    okText: translate("在线客服"),
                    cancelText: translate("明白了"),
                    closable: true,
                    content: (
                        <div>
                            <img
                                src={`${process.env.BASE_PATH}/img/icons/icon-warn.svg`}
                            />
                            <div className="line-distance"></div>
                            <p>
                                {translate(
                                    "抱歉，您的帐户目前不符合推荐朋友计划的资格。 请尝试参与其他免费奖金或联系在线聊天寻求建议。",
                                )}
                            </p>
                        </div>
                    ),
                    icon: null,
                    onOk: () => {
                        ContactCustomerService();
                    },
                });
            }
        });
    }

    getBrowser = () => {
        var browser = {
                msie: false,
                firefox: false,
                opera: false,
                safari: false,
                chrome: false,
                netscape: false,
                appname: "unknown",
                version: 0,
            },
            ua = window.navigator.userAgent.toLowerCase();
        if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(ua)) {
            browser[RegExp.$1] = true;
            browser.appname = RegExp.$1;
            browser.version = RegExp.$2;
        } else if (/version\D+(\d[\d.]*).*safari/.test(ua)) {
            // safari
            browser.safari = true;
            browser.appname = "safari";
            browser.version = RegExp.$2;
        }
        return {
            BrowserType: browser.appname + browser.version,
            BrowserName: browser.appname,
            BrowserVersion: browser.version,
        };
    };
    ReferrerLinkActivity(referCode) {
        let data = {
            ReferrerId: referCode,
            LandingPage: window.location.origin,
            BrowserType: this.getBrowser().BrowserType,
            BrowserName: this.getBrowser().BrowserName,
            BrowserVersion: this.getBrowser().BrowserVersion,
            BrowserPlatform: window.navigator.platform,
            UserAgent: window.navigator.userAgent,
            HttpReferer: window.location.origin + "/?raf=" + referCode,
        };
        post(ApiPort.ReferrerLinkActivity, data)
            .then((res) => {})
            .catch((error) => {});
    }
    referLearnCancel() {
        this.setState({ referFriendLearn: false });
        localStorage.setItem("OpenReferDone", localStorage.getItem("UserName"));
        this.SetdisplayRefereeStatus();
    }
    /**
     * 个人中心页面 跳转key
     * @param {*} key
     */
    goUserCenter = (key) => {
        const pathKey = this.props.userCenterTabKey;
        if (
            ~global.location.pathname.indexOf(`/vn/me/${pathNameList[pathKey]}`)
        ) {
            if (key === this.props.userCenterTabKey) return; //禁止重复选择一样的tab
        }
        switch (key) {
            case "userinfo":
                this.props.changeUserCenterTabKey(key);
                Router.push("/me/account-info");
                break;
            case "bankaccount":
                this.props.changeUserCenterTabKey(key);
                Router.push("/me/bank-account");
                break;
            case "securitycheck":
                this.props.changeUserCenterTabKey(key);
                Router.push("/me/verifications");
                break;
            case "createsecuritycode":
                this.props.changeUserCenterTabKey(key);
                Router.push("/me/security-code");
                break;
            case "uploadFiles":
                this.props.changeUserCenterTabKey(key);
                Router.push("/me/upload-files");
                break;
            case "addresses":
                this.props.changeUserCenterTabKey(currKey);
                Router.push("/me/shipment-address");
                break;
            case "message":
                this.props.changeUserCenterTabKey(key);
                Router.push("/notification");
                break;
            case "records":
                this.props.changeUserCenterTabKey(key);
                Router.push("/transaction-record");
                break;
            case "betrecords":
                this.props.changeUserCenterTabKey(key);
                Router.push("/betting-record");
                break;
            default:
                break;
        }
    };

    // 切换个人中心弹出框教程状态
    // toggleHeaderCenterLearn(status) {
    //     this.setState({
    //         // smallHeader: "", 若沒有comment out this line, 會造成onMouseEnter進個人或者餘額時, header top消失
    //         //lockHeader: status ? 2 : 0,
    //         //toggleCenterPopover: status
    //     });
    // }
    // closeLearn() {
    //     //this.toggleHeaderCenterLearn(false);
    //     let LearnArr = Cookie("learnStep").split("");
    //     LearnArr.splice(2, 1, "1");
    //     Cookie("learnStep", LearnArr.join(""), { expires: LEARN_TIME });
    //     Pushgtagdata("Profilepage_userguide");
    // }
    // 已登录组件事件传递
    onHasLoggedEvent(showEvent, hideEvent) {
        this.showSimple = showEvent;
        this.hideSimple = hideEvent;
    }
    parentShowSimple(type) {
        this.setState({ showType: type });
        this.showSimple(type, "top");
    }
    parentHideSimple(type) {
        this.setState({ showType: 0 });
        this.hideSimple(type);
    }
    resizeThrottle() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(this.toggleHeader, 30);
    }
    toggleHeader() {
        if (this.state.lockHeader) {
            return;
        }
        const h = window,
            e = document.body,
            a = document.documentElement;
        const offsetY =
            Math.max(0, h.pageYOffset || a.scrollTop || e.scrollTop || 0) -
            (a.clientTop || 0);
        this.setState({ smallHeader: offsetY >= 10 ? "zoom-out" : "" });
    }
    getScrollbarWidth() {
        // Creating invisible container
        const outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.overflow = "scroll"; // forcing scrollbar to appear
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
        document.body.appendChild(outer);

        // Creating inner element and placing it in the container
        const inner = document.createElement("div");
        outer.appendChild(inner);

        // Calculating difference between container's full width and the child width
        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

        // Removing temporary elements from the DOM
        outer.parentNode.removeChild(outer);

        return scrollbarWidth;
    }
    addStyle(newStyle) {
        const overflowDistance = "overflow_distance";
        var styleElement = document.getElementById(overflowDistance);

        if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.type = "text/css";
            styleElement.id = overflowDistance;
            document.getElementsByTagName("head")[0].appendChild(styleElement);
            styleElement.appendChild(document.createTextNode(newStyle));
        }
    }

    AlreadLogin = () => {
        this.setState({ isLogin: 1, logoutType: "" });
        this.props.setLoginStatus && this.props.setLoginStatus(true);
    };

    LoginExit = () => {
        this.setState({ isLogin: 0 });
        this.props.setLoginStatus && this.props.setLoginStatus(false);
    };

    cschange() {
        this.setState({
            csvisible: false,
        });
    }

    verifyEmailLink(enc) {
        this.setState({ loading: true });
        let data = {
            EncyptedText: enc,
        };
        this.setState({ verifyEmail: true });
        post(ApiPort.POSTEmailVerifyLink, data)
            .then((res) => {
                if (res != "") {
                    res.result &&
                        this.setState({
                            loading: false,
                            verifyEmailResult: res.isSuccess,
                            EmailResultMessage: res.result.message,
                        });
                }
            })
            .catch((error) => {});
    }

    /**
     * @description: 写入打开Referee弹窗的状态
     * @return {*}
     */

    SetdisplayRefereeStatus() {
        if (this.state.rafStep == 4) {
            localStorage.setItem(
                localStorage.getItem("UserName") + "_displayReferee",
                true,
            );
        }
    }

    SetGameReferStatus() {
        localStorage.setItem(
            localStorage.getItem("UserName") + "_GameReferModal",
            "TRUE",
        );
    }

    render() {
        const { smallHeader, showType, Referineligible, GameOpenModal } =
            this.state;
        const { definedHeaderNode } = this.props;
        return (
            <React.Fragment>
                {/* 自定义Header并不损失Header处引入的功能 */}
                {!definedHeaderNode ? null : definedHeaderNode}
                <div
                    style={{
                        display: !definedHeaderNode ? "block" : "none",
                        color: "#fff",
                    }}
                >
                    {/* {this.state.toggleCenterPopover ? (
						<div className="tlc-learn-shadow-wrap">
							<div className="common-distance">
								<img src="/vn/img/learn/user-center-popover_1.png" />
							</div>
							<div className="tlc-learn-shadow header-center" onClick={this.closeLearn}>
								<button className="learn-knew" />
							</div>
						</div>
					) : null} */}

                    <div
                        className={`header-warp next-header-bar-wrap common-distance-wrap ${smallHeader}`}
                    >
                        <div className="common-distance">
                            <Row className="header-Row">
                                <Col span={3}>
                                    <div
                                        className="logo-wrap"
                                        onClick={() => {
                                            Router.push("/");
                                        }}
                                    >
                                        <ImageWithFallback
                                            src={`${process.env.BASE_PATH}/img/logo/logo.svg`}
                                            width={145}
                                            height={32}
                                            alt="fun88"
                                            fallbackSrc="/vn/img/logo/logo.svg"
                                        />
                                    </div>
                                </Col>
                                <Col span={21}>
                                    <Row className="next-menu-bar">
                                        <Col span={10}>
                                            {/* <Menu
                                                mode="horizontal"
                                                // zoom-out-section
                                                className="helpMenu left-head head-menu-left"
                                                onClick={(item) => {
                                                    switch (item.key) {
                                                        case "3":
                                                            Router.push(
                                                                "/help"
                                                            );
                                                            Pushgtagdata(
                                                                "Support_homepage"
                                                            );
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }}
                                            >
                                                <Menu.Item
                                                    key="3"
                                                    className="helpCenter"
                                                >
                                                    <a>{translate("帮助中心")}</a>
                                                </Menu.Item>
                                            </Menu> */}
                                        </Col>
                                        <Col span={14}>
                                            {this.state.isLogin ? (
                                                <Menu
                                                    mode="horizontal"
                                                    className="right-head zoom-in-section head-menu-right"
                                                    onClick={(item) => {
                                                        switch (item.key) {
                                                            case "3":
                                                                global.showDialog(
                                                                    {
                                                                        key: 'wallet:{"type": "deposit"}',
                                                                    },
                                                                );
                                                                Pushgtagdata(
                                                                    "Deposit Nav",
                                                                    "Click",
                                                                    "Deposit_TopNav",
                                                                );
                                                                break;
                                                            case "4":
                                                                global.showDialog(
                                                                    {
                                                                        key: 'wallet:{"type": "withdraw"}',
                                                                    },
                                                                );
                                                                Pushgtagdata(
                                                                    "Withdrawal Nav",
                                                                    "Click",
                                                                    "Withdrawal_TopNav",
                                                                );
                                                                break;
                                                            case "5":
                                                                global.showDialog(
                                                                    {
                                                                        key: 'wallet:{"type": "transfer"}',
                                                                    },
                                                                );
                                                                Pushgtagdata(
                                                                    "Transfer Nav",
                                                                    "Click",
                                                                    "Transfer_TopNav",
                                                                );
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }}
                                                >
                                                    <Menu.Item
                                                        key="1"
                                                        className="clear-padding"
                                                    >
                                                        <div
                                                            className={`user-center-btn${
                                                                showType === 1
                                                                    ? " active"
                                                                    : ""
                                                            }`}
                                                            onMouseEnter={() =>
                                                                this.parentShowSimple(
                                                                    1,
                                                                )
                                                            }
                                                            onMouseLeave={() =>
                                                                this.parentHideSimple(
                                                                    0.1,
                                                                )
                                                            }
                                                        >
                                                            <span>
                                                                {translate(
                                                                    "个人中心",
                                                                )}
                                                            </span>
                                                            <i
                                                                className={`tlc-sprite user-message ${
                                                                    this.state
                                                                        .messageHasUnRead
                                                                        ? "remind-circle"
                                                                        : ""
                                                                }`}
                                                            />
                                                            <Icon type="caret-down" />
                                                        </div>
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        key="2"
                                                        className="clear-padding"
                                                    >
                                                        <div
                                                            className={`wallet-center-btn${
                                                                showType === 2
                                                                    ? " active"
                                                                    : ""
                                                            }`}
                                                            onMouseEnter={() =>
                                                                this.parentShowSimple(
                                                                    2,
                                                                )
                                                            }
                                                            onMouseLeave={() =>
                                                                this.parentHideSimple(
                                                                    0.2,
                                                                )
                                                            }
                                                        >
                                                            <span>￥</span>
                                                            <span>
                                                                {formatAmount(
                                                                    this.state
                                                                        .allBalance,
                                                                )}
                                                            </span>
                                                            <Icon type="caret-down" />
                                                        </div>
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        key="3"
                                                        className="header-btn btnYellow"
                                                    >
                                                        {translate("存款")}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        key="5"
                                                        className="header-btn btnBlue"
                                                    >
                                                        {translate("转账")}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        key="4"
                                                        className="header-btn btnPurple"
                                                    >
                                                        {translate("提款")}
                                                    </Menu.Item>
                                                </Menu>
                                            ) : (
                                                <Menu
                                                    mode="horizontal"
                                                    className="zoom-in-section head-menu-right text-right"
                                                    onClick={(item) => {
                                                        switch (item.key) {
                                                            case "1":
                                                            case "2":
                                                                this.onUserSign(
                                                                    item.key,
                                                                );
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }}
                                                >
                                                    <Menu.Item
                                                        key="1"
                                                        className="header-btn btn-orange login-btn"
                                                    >
                                                        {translate("登录")}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        key="2"
                                                        className="header-btn btn-blue btn-header-register register-btn"
                                                    >
                                                        {translate("注册")}
                                                    </Menu.Item>
                                                </Menu>
                                            )}
                                        </Col>
                                    </Row>
                                    <HeaderMenuBar
                                        getPromotionList={
                                            this.props.getPromotionList
                                        }
                                    />
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <HeaderComponent
                        ReferreeTaskStatus={this.ReferreeTaskStatus}
                        goUserCenter={this.goUserCenter}
                        onChangeShowType={(v) => {
                            this.setState({ showType: v });
                        }}
                        onHasLoggedEvent={this.onHasLoggedEvent}
                        setUserAllBalance={(v) => {
                            this.setState({ allBalance: v });
                        }}
                        toggleCenterPopover={this.state.toggleCenterPopover}
                        // toggleHeaderCenterLearn={this.toggleHeaderCenterLearn}
                        setUsercnnterCircle={this.props.setUsercnnterCircle}
                        headerHeightLock={this.props.headerHeightLock}
                        setMessageHasUnRead={(v) => {
                            this.setState({ messageHasUnRead: v });
                        }}
                        setCircleHasUnRead={this.props.setCircleHasUnRead}
                        setUserCenterMoney={this.props.setUserCenterMoney}
                        setUserCenterMemberInfo={
                            this.props.setUserCenterMemberInfo
                        }
                        smallHeader={this.state.smallHeader}
                        status={this.state.isLogin}
                        exitShop={(v) => {
                            this.setState({ logoutType: v });
                        }}
                        this={this}
                        key={this.state.isLogin + "status"}
                        GetThroughoutVerification={() => {
                            this.GetThroughoutVerification();
                        }}
                    />
                </div>

                <UserSign
                    AlreadLogin={() => this.AlreadLogin()}
                    onUserSign={(handleEvent) =>
                        (this.onUserSign = handleEvent)
                    }
                />

                <Modal
                    visible={this.state.referFriendLearn}
                    footer={false}
                    width={316}
                    maskClosable={false}
                    centered={true}
                    onCancel={() => {
                        this.referLearnCancel();
                    }}
                    closable={false}
                    title={translate("注册奖金等你来拿")}
                    className="referFriendLearn"
                >
                    {/* <h3 className="refer-friend-title center">
                        {translate("注册奖金等你来拿！")}
                    </h3> */}
                    <ul className="invite-list-step has-login learn">
                        <li>
                            <div className="invite-step-content step1">
                                <h4>{translate("步骤")} 1 </h4>
                                <p>
                                    {translate("点击“立即注册”成为我们的会员")}
                                </p>
                                <Button
                                    type="danger"
                                    onClick={() => {
                                        this.referLearnCancel();
                                        global.goUserSign("2");
                                    }}
                                    disabled={this.state.rafStep !== 1}
                                >
                                    {translate("立即注册")}
                                </Button>
                            </div>
                            {this.state.rafStep !== 1 ? (
                                <Icon
                                    type="check-circle"
                                    theme="filled"
                                    className="success"
                                />
                            ) : (
                                <Icon type="check-circle" />
                            )}
                        </li>
                        <li>
                            <div className="invite-step-content">
                                <h4>{translate("步骤")} 2 </h4>
                                <p>{translate("将钱存入帐户")}</p>
                                <Button
                                    type="danger"
                                    onClick={() => {
                                        this.referLearnCancel();
                                        global.showDialog({
                                            key: 'wallet:{"type": "deposit"}',
                                        });
                                        this.SetdisplayRefereeStatus();
                                    }}
                                    disabled={
                                        this.state.isDeposit ||
                                        this.state.rafStep === 1
                                    }
                                >
                                    {translate("立即存款")}
                                </Button>
                            </div>
                            {this.state.isDeposit &&
                            this.state.rafStep !== 1 ? (
                                <Icon
                                    type="check-circle"
                                    theme="filled"
                                    className="success"
                                />
                            ) : (
                                <Icon type="check-circle" />
                            )}
                        </li>
                        <li>
                            <div className="invite-step-content">
                                <h4>{translate("步骤")} 3 </h4>
                                <p>{translate("验证电话号码和电子邮件")}</p>
                                <Button
                                    type="danger"
                                    onClick={() => {
                                        this.referLearnCancel();
                                        this.goUserCenter("userinfo");
                                        this.SetdisplayRefereeStatus();
                                    }}
                                    disabled={
                                        this.state.isVerified ||
                                        this.state.rafStep === 1
                                    }
                                >
                                    {translate("立即验证")}
                                </Button>
                            </div>
                            {this.state.isVerified &&
                            this.state.rafStep !== 1 ? (
                                <Icon
                                    type="check-circle"
                                    theme="filled"
                                    className="success"
                                />
                            ) : (
                                <Icon type="check-circle" />
                            )}
                        </li>
                    </ul>
                    <Button
                        block
                        type="link"
                        size="small"
                        onClick={this.referLearnCancel}
                    >
                        {translate("关闭")}
                    </Button>
                </Modal>

                <Modal
                    title={translate("帐户不符合资格")}
                    className="SecurityAnnouncement modal-pubilc OTP-modal"
                    visible={Referineligible}
                    closable={false}
                    onCancel={() => {
                        this.setState({
                            Referineligible: false,
                        });
                        this.SetGameReferStatus();
                    }}
                    centered={true}
                    width={400}
                    footer={null}
                    zIndex={1500}
                >
                    <Row>
                        <Col span={24}>
                            <img
                                className="otp-warn"
                                src={`${process.env.BASE_PATH}/img/icons/icon-warn.svg`}
                                alt="icon-warn"
                            />
                            <div className="line-distance" />
                            <p>
                                {translate(
                                    "抱歉，您的帐户目前不符合推荐朋友计划。 请尝试其他免费奖金或联系在线聊天寻求建议",
                                )}
                            </p>
                        </Col>
                    </Row>
                    <div className={`btn-wrap otp-btn-wrap`}>
                        <center>
                            <Button
                                className="changeVerify"
                                onClick={() => {
                                    this.setState({
                                        Referineligible: false,
                                    });
                                    this.SetGameReferStatus();
                                }}
                            >
                                {translate("明白了")}
                            </Button>
                            <Button
                                className="otpBtn readMore"
                                onClick={() => global.PopUpLiveChat()}
                                block
                            >
                                {translate("在线客服")}
                            </Button>
                        </center>
                    </div>
                </Modal>

                <Modal
                    title={translate("建议")}
                    visible={GameOpenModal}
                    className="modal-pubilc ReferModal"
                    maskClosable={false}
                    footer={null}
                    onCancel={() => {
                        this.setState({
                            GameOpenModal: false,
                        });
                        this.SetGameReferStatus();
                    }}
                    centered={true}
                >
                    <React.Fragment>
                        <center>
                            <img
                                className="referGame"
                                src={`${process.env.BASE_PATH}/img/icons/icon-reject.svg`}
                            />
                        </center>
                        <div className="line-distance" />
                        <div className="note" style={{ textAlign: "center" }}>
                            {translate(
                                "完成推荐好友任务，奖金将在24小时内转账",
                            )}
                        </div>
                        <div className="line-distance" />
                        <div className="RecommendedGames">
                            {translate("火热优惠")}
                        </div>
                        <div className="GameReferImg">
                            {/* <OpenGame
                                itemsData={{
                                    type: "Game",
                                    name: "乐体育",
                                    code: "SB2",
                                    imageUrl: "/vn/img/game/sports.jpg",
                                    isMaintenance: true,
                                    isTournament: false,
                                    isHot: false,
                                    isNew: false,
                                }}
                                hideTag={true}
                            /> */}
                            <OpenGame
                                itemsData={{
                                    type: "Game",
                                    name: "热门游戏",
                                    code: "AVIATOR",
                                    imageUrl: "/vn/img/game/v2g.jpg",
                                    isMaintenance: false,
                                    isTournament: false,
                                    isHot: true,
                                    isNew: false,
                                }}
                                hideTag={true}
                            />
                            <OpenGame
                                itemsData={{
                                    type: "Category",
                                    name: "至尊堂（AG）",
                                    code: "AG",
                                    imageUrl: "/vn/img/game/ag.jpg",
                                    isMaintenance: false,
                                    isTournament: false,
                                    isHot: false,
                                    isNew: false,
                                    gameCatCode: "LiveCasino",
                                    gameCatId: 124,
                                }}
                                hideTag={true}
                            />
                        </div>
                    </React.Fragment>
                </Modal>

                {/* email link 驗證彈窗*/}
                <Modal
                    title={
                        !this.state.loading
                            ? this.state.verifyEmailResult
                                ? translate("成功验证")
                                : "验证失败"
                            : ""
                    }
                    closeIcon={
                        <Icon type="close" style={{ fontSize: "18px" }} />
                    }
                    className="modal-pubilc"
                    // visible={true}
                    visible={this.state.verifyEmail}
                    onOk={this.handleEvent}
                    onCancel={() => this.setState({ verifyEmail: false })}
                    width={400}
                    footer={null}
                >
                    <Spin spinning={this.state.loading}>
                        {this.verifyEmailResult != "" && (
                            <React.Fragment>
                                <div
                                    style={{
                                        padding: "30px 40px 47px 40px",
                                        margin: "0 auto",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: this.state.EmailResultMessage,
                                    }}
                                />
                                <Button
                                    size="large"
                                    type="primary"
                                    block
                                    onClick={() => {
                                        this.setState({ verifyEmail: false });
                                        if (this.state.verifyEmailResult) {
                                            global.goUserSign("1");
                                            Pushgtagdata("Submit_login");
                                        }
                                    }}
                                >
                                    {this.state.verifyEmailResult
                                        ? "立即登录"
                                        : "确认"}
                                </Button>
                            </React.Fragment>
                        )}
                    </Spin>
                </Modal>
                {/* {this.state.showEmailResetPassword ? <DynamicResetPassword {...this.urlParams} /> : null} */}
                {this.state.isLogin ? (
                    <iframe
                        src="https://www.zbbc88.com/cms/3rdCookie/start.html"
                        style={{ display: "none" }}
                    />
                ) : null}
                {/* 8号商城登出Iframe */}
                {this.state.logoutType ? (
                    <iframe
                        src={this.state.logoutType}
                        style={{ display: "none" }}
                    />
                ) : null}
            </React.Fragment>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        userCenterTabKey: state.userCenter.userCenterPageTabKey,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        changeUserCenterTabKey: (tabkey) => {
            dispatch(userCenterActions.changeUserCenterTabKey(tabkey));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
