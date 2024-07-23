import React from "react";
import { Row, Col, Spin, Button, Modal, Icon, Popover, message } from "antd";
import dynamic from "next/dynamic";
import Router from "next/router";
import Notice from "./Notice";
import { get, post } from "$SERVICES/TlcRequest";
import { ApiPort } from "$SERVICES/TLCAPI";
import { Cookie as CookieUtil, formatAmount } from "$SERVICES/util";
import { GetAllBalance } from "$DATA/wallet";
import { getMemberInfo } from "$DATA/userinfo";
import { getQueryVariable, Cookie } from "$SERVICES/helper";
import { connect, Provider } from "react-redux";
import { promotionActions } from "../../redux/slices/promotionSlice";
import { userCenterActions } from "../../redux/slices/userCenterSlice";
import store from "../../redux/store";
import classNames from "classnames";

// Modal加载状态组件
const ModalLoading = (
    <Spin spinning={true} size="large" tip="加载中，请稍后..." />
);
// 财务管理
const DynamicWallet = dynamic(import("@/Wallet"), {
    loading: () => ModalLoading,
    ssr: true,
});
// 安全系统升级
const DynamicOtpPopUp = dynamic(import("@/OTP/OtpPopUp"), {
    ssr: false,
});

class HasLogged extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showType: -1, // -1 初始化 0.1 隐藏个人中心 0.2 隐藏余额 1 个人中心简介 2 余额
            showTypePosition: { x: 122, y: 166 },
            isModalLoad: false,
            modalTabKey: {}, // showDailog的公用属性对象
            balanceLoading: true,
            walletVisible: false,
            balanceList: [],
            memberInfo: {},
            token: "",
            messageIsRead: false, // 是否有未读消息
            logoutType: "", // 8号商城登出问题
            otpVisible: false, // otp 驗證匡
            kindOfVerification: "", //是otp验证还是otp+密码验证
            isLoadOtpModal: false,
            countBalance: 0,
        };

        this.otpModal = this.otpModal.bind(this); // otp modal
        this.showModal = this.showModal.bind(this); // showModal公用方法
        this.getBalance = this.getBalance.bind(this); // 获取余额
        this.showSimple = this.showSimple.bind(this); // 显示个人或者余额下拉
        this.hideSimple = this.hideSimple.bind(this); // 隐藏个人或者余额下拉
        this.closeWallet = this.closeWallet.bind(this); // 关闭钱包弹层
        this.globalExit = this.globalExit.bind(this); // 退出方法
        this.setGlobalMemberInfo = this.setGlobalMemberInfo.bind(this);
        this.setHasUnRead = this.setHasUnRead.bind(this); // 设置（Header弹窗、UserCenter）是否有未读消息
        this.checkHasReadMessage = this.checkHasReadMessage.bind(this); // 判断是否有未读消息
        this.currentModalKey = ""; // 当前显示的ModalKey
        this.delayTimer = null; // 个人或者余额下拉延迟关闭timer（防止过度闪动，高频率打开关闭！）
        this.messageIntervalTimer = null;
        this.controlExit = false; // 控制請求logout時,勿重複請求，如重複登入引起的強制登出
        global.globalExit = this.globalExit; // 全局化退出方法
        global.globalBlackListExit = this.globalBlackListExit; //黑名單專用退出
        global.setGlobalMemberInfo = this.setGlobalMemberInfo; // 全局更新会员信息（HasLogged&&UserCenter内部的memberInfo）
    }
    componentDidMount() {
        if (getQueryVariable("redirectToken")) return;
        this.getBalance();
        global.showDialog = this.showModal;
        this.props.onHasLoggedEvent(this.showSimple, this.hideSimple);

        if (localStorage.getItem("memberInfo")) {
            const memberdate = JSON.parse(localStorage.getItem("memberInfo"));
            if (!localStorage.getItem("login-otp") && memberdate.loginOTP) {
                //Login OTP流程
                this.setState({
                    isLoadOtpModal: true,
                    otpVisible: true,
                    kindOfVerification: "login-otp",
                });
            }
            if (
                !JSON.parse(localStorage.getItem("login-otpPwd")) &&
                memberdate.revalidate
            ) {
                //Login OTP流程 + 重置密码流程
                this.setState({
                    isLoadOtpModal: true,
                    otpVisible: true,
                    kindOfVerification: "login-otpPwd",
                });
            }
        }

        getMemberInfo((res) => {
            this.setGlobalMemberInfo(res);
        }, true);

        // 传递设置已读未读状态的方法出去、另外还需要传递设置usercenter左侧的小圆点的方法进来
        this.props.setCircleHasUnRead &&
            this.props.setCircleHasUnRead((status) => {
                this.props.setMessageHasUnRead(status);
                this.setState({ messageIsRead: status });
            });

        // 判断是否有未读消息
        this.checkHasReadMessage();
        this.messageIntervalTimer = setInterval(
            this.checkHasReadMessage,
            360000,
        );

        // 默认呼出组件（开发需要）
        // this.showModal({ key: 'wallet:{"type": "withdraw", "currentPayValue": "CCW"}' })
        // this.showModal({ key: 'wallet:{"type": "deposit", "currentPayValue": "CTC"}' })
        // key: 'wallet:{"type": "deposit", "currentPayValue": "LB", "targetAccount": "SB", "bonusId": 103502}'
        this.checkIsSafeHouse();
    }
    componentWillUnmount() {
        global.showDialog = function () {};
        clearTimeout(this.delayTimer);
        clearInterval(this.messageIntervalTimer);
        this.setState = () => false;
    }

    setGlobalMemberInfo(res) {
        this.setState({ memberInfo: res });
        //登录OTP PASS 进行下面Ref流程
        !res.loginOTP && this.props.ReferreeTaskStatus();
        // 同步HasHeader MemberInfo 到子元素同时设置更新HasHeader MemberInfo的方法
        this.props.setUserCenterMemberInfo &&
            this.props.setUserCenterMemberInfo(
                res,
                (v) => {
                    this.setState({ memberInfo: v });
                },
                this.getBalance,
            );
    }
    checkHasReadMessage() {
        get(
            ApiPort.Announcements +
                "&messageTypeOptionID=0&pageSize=1&pageIndex=1",
        ).then((res) => {
            if (res && res.result?.totalUnreadCount !== 0) {
                this.setHasUnRead(res.result.totalUnreadCount !== 0);
            } else {
                get(
                    ApiPort.InboxMessages +
                        "&MessageTypeID=2&messageTypeOptionID=0&pageSize=1&pageIndex=1",
                ).then((res) => {
                    if (res && res.result?.totalUnreadCount !== 0) {
                        this.setHasUnRead(res.result.totalUnreadCount !== 0);
                    } else {
                        get(
                            ApiPort.InboxMessages +
                                "&MessageTypeID=1&messageTypeOptionID=0&pageSize=1&pageIndex=1",
                        ).then((res) => {
                            this.setHasUnRead(
                                res && res.result?.totalUnreadCount !== 0,
                            );
                        });
                    }
                });
            }
        });
    }
    setHasUnRead(status) {
        this.props.setUsercnnterCircle &&
            this.props.setUsercnnterCircle(status);
        this.props.setMessageHasUnRead(status);
        this.setState({ messageIsRead: status });
    }

    getBalance(call) {
        this.setState({ balanceLoading: true });
        GetAllBalance((res) => {
            if (res.isSuccess) {
                res.result.map(function (item, index) {
                    window[item.name] = item.balance;
                });
                const allBalance = res.result[0].balance;
                this.props.setUserCenterMoney &&
                    this.props.setUserCenterMoney({
                        balanceList: res.result,
                        mainMoney: allBalance,
                    });
                this.props.setUserAllBalance(allBalance);
                this.setState({
                    balanceList: res.result,
                    balanceLoading: false,
                    countBalance:
                        res.result && res.result.length
                            ? res.result[0].balance
                            : 0,
                });
                typeof call === "function" && call(allBalance);
            } else {
                message.error(res.errors && res.errors[0].message);
            }
        });
    }
    // 关闭钱包弹层
    closeWallet(type) {
        this.setState({ walletVisible: false });
        if (type == "ToHome") {
            if (Router.router.pathname != "/vn") {
                Router.push("/");
            }
        }
        if (Router.router.pathname == "/vn/games/OpenGame") {
            Router.push("/");
        }
        typeof global.openLearnDialog === "function" &&
            global.openLearnDialog();
    }
    // 呼出组件（所有弹出层窗口都可公用这个函数，需设置一级State和二级State，只需传入对应State即可！）
    showModal({ key }) {
        if (typeof key !== "string") return null;
        const keySpacer = key.indexOf(":");
        const dialogKey = key.substring(0, keySpacer);
        const keyMap = key.substring(keySpacer + 1);
        const currentParentModalMap =
            typeof keyMap !== "" ? JSON.parse(keyMap) : {}; // 当前呼出窗口携带的默认属性
        this.setState({
            [dialogKey + "Visible"]: true,
            modalTabKey: currentParentModalMap,
        });
        if (dialogKey === "wallet") {
            this.props.setRefreshCurrentPage("");
        }
    }
    showSimple(type, positionType) {
        // 因为游戏界面锁定了小Header，而此教程需要锁定大Header，因此会出现UI乱掉，需要关闭弹出此教程。
        // if (this.props.headerHeightLock !== 1) {
        //     const learnStepString = CookieUtil("learnStep");
        //     typeof learnStepString === "string" &&
        //         learnStepString.substr(2, 1) === "0" &&
        //         this.props.toggleHeaderCenterLearn(true);
        // }

        clearTimeout(this.delayTimer);
        positionType === "top" &&
            this.setState({
                showTypePosition: { x: type === 1 ? 75 : 25, y: 42 },
            });
        positionType === "bottom" &&
            this.setState({
                showTypePosition: { x: type === 1 ? 50 : 5, y: 166 },
            });
        this.setState({ showType: type });
        this.props.onChangeShowType(type);
    }
    hideSimple(type) {
        if (this.state.showType === -1) {
            return;
        }
        this.delayTimer && clearTimeout(this.delayTimer);
        this.delayTimer = setTimeout(() => {
            this.setState({ showType: type });
            this.props.onChangeShowType(0);
        }, 200);
    }

    globalExit(snapExitStatus) {
        const { memberInfo } = this.state;
        const access_token = JSON.parse(localStorage.getItem("access_token"));
        const refresh_token = JSON.parse(localStorage.getItem("refresh_token"));
        let data = {
            clientId: "FUNmuittenCN",
            clientSecret: "muitten",
            refreshToken: refresh_token,
            accessToken: access_token,
            memberCode: memberInfo.memberCode,
            packageName: "net.funpodium.tlc",
        };

        if (this.controlExit) return;
        const IsSnapExitStatus = typeof snapExitStatus === "undefined";

        // IsSnapExitStatus &&
        // 	post(ApiPort.LogoutAPI, data)
        // 		.then((res) => {
        // 			// 8shop导向登录退出立即就会登录，登录会更正客服链接，所以此处如果传递function不需要调用。
        // 			get(ApiPort.GETLiveChat).then((res) => {
        // 				localStorage.setItem('serverUrl', res.url);
        // 				setTimeout(() => {
        // 					this.controlExit = false;
        // 				}, 3000);
        // 			});
        // 		})
        // 		.catch((error) => {});

        this.controlExit = true;
        localStorage.getItem("access_token") !== null && this.props.LoginExit(); // 更正会员登录状态
        Modal.destroyAll(); // 清除所有弹出层
        CookieUtil(null, null);
        Cookie.Delete("emailTime"); //測試分支上無法刪除，再執行一次
        Cookie.Delete("phoneTime"); //測試分支上無法刪除，再執行一次
        // Member LocalData
        localStorage.removeItem("affiliateUrlLM");
        localStorage.removeItem("PreferWallet");
        localStorage.removeItem("UserName");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("memberInfo");
        localStorage.removeItem("memberInfo");
        localStorage.removeItem("walletList");
        localStorage.removeItem("Address");
        // Bti LocalData
        localStorage.removeItem("ReferURL");
        localStorage.removeItem("APIUrl");
        localStorage.removeItem("MemberToken");
        localStorage.removeItem("login-otp");
        localStorage.removeItem("login-otpPwd");

        this.props.resetPromotionData();
        this.props.resetMemberData();

        // 因为多语言目录层级关系，配置了默认页面位/vn/index.js，此处为了应对开发时退出会刷新界面，使用强刷！
        // process.env.LANGUAGE_PREFIX ? Router.push('/vn/') : window.location.href = "/vn/";
        // 此处为了测试退出后的一些状态时是否及时更新预留
        IsSnapExitStatus &&
            Router.push("/").then(() => {
                IsSnapExitStatus && message.success("您已退出登录！");
                sessionStorage.clear();
            });

        if (IsSnapExitStatus) {
            if (this.state.checkSafeHouse || Cookie.Get("isLoginS")) {
                window.location.href = "/vn/Safehouse";
                Cookie.Delete("isLoginS");
            } else {
                Cookie.Delete("isLoginS");
            }
        }
        if (localStorage.getItem("BankcardBlacklist")) {
            return;
            //银行卡黑名单
            const removeBankcardBlacklist = () => {
                localStorage.removeItem("BankcardBlacklist");
            };
            Modal.info({
                className: "confirm-modal-of-public",
                icon: <div />,
                title: "",
                width: 340,
                zIndex: "1600",
                centered: true,
                content: (
                    <div className="inline-link-btn">
                        <div>
                            <img
                                src={`${process.env.BASE_PATH}/img/maintain/img-restricted.png`}
                                style={{ width: "120px", height: "130px" }}
                            />
                        </div>
                        <h3
                            style={{
                                fontSize: "18px",
                                fontWeight: 900,
                                marginTop: "20px",
                            }}
                        >
                            用户账号违反同乐城规章
                        </h3>
                        <div style={{ textAlign: "center" }}>
                            抱歉 ， 由于您的账号违反同乐城规章，即日起已被关闭
                        </div>
                    </div>
                ),
                okText: (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={`${process.env.BASE_PATH}/img/icons/icon-cs.png`}
                            style={{ marginRight: "10px" }}
                        />
                        在线客服
                    </div>
                ),
                onOk: () => {
                    global.PopUpLiveChat();
                    removeBankcardBlacklist();
                },
                onCancel: () => {
                    removeBankcardBlacklist();
                },
            });
        }
    }

    /*專門給黑名單使用的logout 不跳回首頁  */

    globalBlackListExit(snapExitStatus) {
        if (this.controlExit) return;
        const IsSnapExitStatus = typeof snapExitStatus === "undefined";
        this.controlExit = true;
        localStorage.getItem("access_token") !== null && this.props.LoginExit(); // 更正会员登录状态
        Modal.destroyAll(); // 清除所有弹出层
        CookieUtil(null, null);
        // Member LocalData
        localStorage.removeItem("affiliateUrlLM");
        localStorage.removeItem("PreferWallet");
        localStorage.removeItem("UserName");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("memberInfo");
        localStorage.removeItem("memberInfo");
        localStorage.removeItem("walletList");
        // Bti LocalData
        localStorage.removeItem("ReferURL");
        localStorage.removeItem("APIUrl");
        localStorage.removeItem("MemberToken");
        localStorage.removeItem("login-otp");
        localStorage.removeItem("login-otpPwd");
        sessionStorage.clear();
        IsSnapExitStatus && message.success("您已退出登录！");

        if (IsSnapExitStatus) {
            if (this.state.checkSafeHouse || Cookie.Get("isLoginS")) {
                window.location.href = "/vn/Safehouse";
                Cookie.Delete("isLoginS");
            } else {
                Cookie.Delete("isLoginS");
            }
        }
    }

    checkIsSafeHouse = () => {
        let domain = window.location.origin;
        get(ApiPort.GETisSafeHouse + `&domain=${domain}`)
            .then((res) => {
                console.log("isSafeHouse Domain res: ", res);
                if (res.result) {
                    this.setState({
                        checkSafeHouse: true,
                    });
                }
            })
            .catch((error) => {
                console.log("isSafeHouse Domain error: ", error);
            });
    };

    // Exit() {
    //     Modal.confirm({
    //         icon: null,
    //         centered: true,
    //         title: "确认退出",
    //         content: "确认要退出登录吗？",
    //         okButtonProps: {size: "large"},
    //         cancelButtonProps: {size: "large"},
    //         okText: "退出",
    //         cancelText: "取消",
    //         onOk: () => {
    //             this.globalExit();
    //         },
    //     });
    // }

    otpModal(v) {
        this.setState({ otpVisible: v });
    }
    render() {
        // HasLogged组件因为是在渲染之后才会render出来，所以在内部可调用dom相关事件
        const { showType, memberInfo, balanceList, countBalance } = this.state;
        let userPopover, walletPopover;
        switch (showType) {
            case -1:
                (userPopover = ""), (walletPopover = "");
                break;
            case 1:
                userPopover = "show";
                break;
            case 2:
                walletPopover = "show";
                break;
            case 0.1:
                userPopover = "hide";
                break;
            case 0.2:
                walletPopover = "hide";
                break;
            default:
                break;
        }
        return (
            <React.Fragment>
                <div className="common-distance-wrap">
                    <div
                        className={`common-distance tlc-sign-header ${
                            this.props.smallHeader === "zoom-out" && "hidden"
                        }${
                            this.props.toggleCenterPopover
                                ? " user-center-popover"
                                : ""
                        }`}
                    >
                        <Row>
                            <Col span={12} className="tlc-notice-wrapper">
                                <Notice propsData={this.props} />
                            </Col>
                            <Col span={12} className="tlc-sign">
                                <div className="login-wrap">
                                    <div className="good-greeting">
                                        Hi. &nbsp;{" "}
                                        {memberInfo?.userName ? (
                                            <span>{memberInfo.userName}</span>
                                        ) : (
                                            <div className="nameLoading" />
                                        )}
                                    </div>
                                    <div className="Right-Login-Action">
                                        <div className="input-wrap">
                                            <div
                                                className={`user-center-btn${
                                                    showType === 1
                                                        ? " active"
                                                        : ""
                                                }`}
                                                onMouseEnter={() =>
                                                    this.showSimple(1, "bottom")
                                                }
                                                onMouseLeave={() =>
                                                    this.hideSimple(0.1)
                                                }
                                                onClick={() => {
                                                    Pushgtagdata(
                                                        "Profile_homepage",
                                                    );
                                                }}
                                            >
                                                <span>
                                                    {translate("个人中心")}
                                                </span>
                                                <i
                                                    className={`tlc-sprite user-message ${
                                                        this.state.messageIsRead
                                                            ? "remind-circle"
                                                            : ""
                                                    }`}
                                                />
                                                <Icon type="caret-down" />
                                            </div>
                                            <div
                                                className={`wallet-center-btn${
                                                    showType === 2
                                                        ? " active"
                                                        : ""
                                                }`}
                                                onMouseEnter={() =>
                                                    this.showSimple(2, "bottom")
                                                }
                                                onMouseLeave={() =>
                                                    this.hideSimple(0.2)
                                                }
                                                onClick={() => {
                                                    Pushgtagdata(
                                                        "Accountwallet_homepage",
                                                    );
                                                }}
                                            >
                                                <span>￥</span>
                                                <span>
                                                    {formatAmount(countBalance)}
                                                </span>
                                                <Icon type="caret-down" />
                                            </div>
                                        </div>
                                        <div className="BtnList">
                                            <div
                                                className="deposit-btn btnYellow "
                                                onClick={() => {
                                                    this.showModal({
                                                        key: 'wallet:{"type": "deposit"}',
                                                    });

                                                    Pushgtagdata(
                                                        "Home",
                                                        "Go to Deposit",
                                                        "Home_C_Deposit",
                                                    );
                                                }}
                                            >
                                                {translate("存款")}
                                            </div>
                                            <div
                                                className="transfer-btn btnBlue "
                                                onClick={() => {
                                                    this.showModal({
                                                        key: 'wallet:{"type": "transfer"}',
                                                    });

                                                    Pushgtagdata(
                                                        "Home",
                                                        "Go to Transfer",
                                                        "Home_C_Transfer",
                                                    );
                                                }}
                                            >
                                                {translate("转账")}
                                            </div>
                                            <div
                                                className="withdraw-btn btnPurple "
                                                onClick={() => {
                                                    this.showModal({
                                                        key: 'wallet:{"type": "withdraw"}',
                                                    });

                                                    Pushgtagdata(
                                                        "Home",
                                                        "Go to Withdrawal",
                                                        "Home_C_Withdraw",
                                                    );
                                                }}
                                            >
                                                {translate("提款")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                {/* Header头部弹窗 */}
                <div
                    className={`common-distance-wrap header-popover-wrap${
                        this.props.headerHeightLock === "has-login"
                            ? " show-hard"
                            : ""
                    }${
                        this.props.toggleCenterPopover
                            ? " has-header-center"
                            : ""
                    }`}
                >
                    <div className="common-distance">
                        <div
                            style={{
                                right: this.state.showTypePosition.x,
                                top: this.state.showTypePosition.y,
                            }}
                            className={`header-popover ${
                                this.props.headerHeightLock === "has-login" ||
                                this.props.toggleCenterPopover
                                    ? "show"
                                    : userPopover
                            }`}
                            onMouseEnter={() => this.showSimple(1)}
                            onMouseLeave={() => this.hideSimple(0.1)}
                        >
                            <div className="header-popover-content">
                                <div className="header-popover-arrow" />
                                <div className="header-popover-inner">
                                    <div className="header-popover-inner-title user-title-wrap">
                                        <div className="inline-block">
                                            <div className="user-picture-wrap">
                                                <img
                                                    src={`${process.env.BASE_PATH}/img/icons/head.svg`}
                                                    alt="useravatar"
                                                />
                                            </div>
                                        </div>
                                        <div className="inline-block">
                                            <h4>
                                                {memberInfo?.userName || ""}
                                            </h4>
                                            <div className="user-info-thumb">
                                                <div className="inline-block">
                                                    <i
                                                        className={`tlc-sprite member-grade _${
                                                            this.state
                                                                .memberInfo
                                                                .levelName !==
                                                            "普通会员"
                                                                ? "1"
                                                                : "2"
                                                        }`}
                                                    />
                                                    <span>
                                                        {
                                                            this.state
                                                                .memberInfo
                                                                .levelName
                                                        }
                                                    </span>
                                                </div>
                                                <span className="inline-block">
                                                    &nbsp;
                                                </span>
                                                <div className="inline-block">
                                                    <i
                                                        className={`tlc-sprite user-email ${
                                                            this.state
                                                                .memberInfo
                                                                .isVerifiedEmail &&
                                                            this.state
                                                                .memberInfo
                                                                .isVerifiedEmail[1] &&
                                                            "curr"
                                                        }`}
                                                    />
                                                    <i
                                                        className={`tlc-sprite user-phone ${
                                                            this.state
                                                                .memberInfo
                                                                .isVerifiedPhone &&
                                                            this.state
                                                                .memberInfo
                                                                .isVerifiedPhone[1] &&
                                                            "curr"
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            ghost
                                            className="user-exit"
                                            onClick={() => {
                                                //  this.Exit();
                                                this.globalExit();
                                                Pushgtagdata(
                                                    "Logout_accountbar_homepage",
                                                );
                                            }}
                                        >
                                            {translate("退出")}
                                        </Button>
                                    </div>
                                    <ul className="header-popover-inner-content headerHoverBox">
                                        <li
                                            className="userinfo"
                                            onClick={() => {
                                                this.props.goUserCenter(
                                                    "userinfo",
                                                );
                                                Pushgtagdata(
                                                    "Account",
                                                    "Click",
                                                    "Profile_TopNav",
                                                );
                                            }}
                                        >
                                            <i className="tlc-sprite user-info" />
                                            {translate("账户资料")}
                                        </li>
                                        <li
                                            className={`message${
                                                this.state.messageIsRead
                                                    ? " remind-circle"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                this.props.goUserCenter(
                                                    "message",
                                                );
                                                Pushgtagdata(
                                                    "PMA_accountbar_homepage",
                                                );
                                            }}
                                        >
                                            <i className="tlc-sprite message-center" />
                                            {translate("通知")}
                                        </li>
                                        <li
                                            className="records"
                                            onClick={() => {
                                                this.props.goUserCenter(
                                                    "records",
                                                );
                                                Pushgtagdata(
                                                    "Transactionrecord_accountbar_homepage",
                                                );
                                            }}
                                        >
                                            <i className="tlc-sprite record" />
                                            {translate("交易记录")}
                                        </li>
                                        <li
                                            className="bankaccount"
                                            onClick={() => {
                                                this.props.goUserCenter(
                                                    "bankaccount",
                                                );
                                                Pushgtagdata(
                                                    "Bankacc_accountbar_homepage",
                                                );
                                            }}
                                        >
                                            <i className="tlc-sprite bank-user" />
                                            {translate("银行和钱包")}
                                        </li>
                                        <li
                                            className="mypromotion"
                                            onClick={() => {
                                                this.props.changeTab("2");
                                                Router.push("/promotions");
                                                Pushgtagdata(
                                                    "Promorecord_accountbar_homepage",
                                                );
                                            }}
                                        >
                                            <i className="tlc-sprite my-promotion" />
                                            {translate("每日优惠")}
                                        </li>
                                        <li
                                            className="betrecords"
                                            onClick={() => {
                                                this.props.goUserCenter(
                                                    "betrecords",
                                                );
                                                Pushgtagdata(
                                                    "Account",
                                                    "Click",
                                                    "BetRecord_TopNav",
                                                );
                                            }}
                                        >
                                            <i className="tlc-sprite bet-record" />
                                            {translate("投注记录")}
                                        </li>
                                        <li
                                            className="mybonus"
                                            onClick={() => {
                                                this.props.changeTab("3");
                                                Router.push("/promotions");
                                                Pushgtagdata(
                                                    "Rebaterecord_accountbar_homepage",
                                                );
                                            }}
                                        >
                                            <i className="tlc-sprite my-bonus" />
                                            {translate("返水")}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                right: this.state.showTypePosition.x,
                                top: this.state.showTypePosition.y,
                            }}
                            className={`header-popover wallet ${walletPopover}`}
                            onMouseEnter={() => this.showSimple(2)}
                            onMouseLeave={() => this.hideSimple(0.2)}
                        >
                            <div className="header-popover-content">
                                <div
                                    className={`header-popover-arrow${
                                        this.state.balanceLoading
                                            ? " loading"
                                            : ""
                                    }`}
                                />
                                <div className="header-popover-inner">
                                    <Spin spinning={this.state.balanceLoading}>
                                        <div className="header-popover-inner-title">
                                            <div className="inline-block">
                                                {translate("总余额")}
                                            </div>
                                            <div className="inline-block balance-main">
                                                ￥{formatAmount(countBalance)}
                                            </div>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    right: "20px",
                                                }}
                                                className="inline-block"
                                                onClick={() => {
                                                    this.getBalance();
                                                    Pushgtagdata(
                                                        "Refresh_amountbar_homepage",
                                                    );
                                                }}
                                            >
                                                <Icon type="reload" />
                                            </div>
                                        </div>
                                        <ul className="header-popover-inner-content">
                                            {balanceList && balanceList.length
                                                ? balanceList.map(
                                                      (val, index) => {
                                                          if (
                                                              val.category ===
                                                              "TotalBal"
                                                          )
                                                              return null;
                                                          return (
                                                              <li
                                                                  key={index}
                                                                  className={classNames(
                                                                      {
                                                                          UnderMaintenance:
                                                                              val.state ==
                                                                              "UnderMaintenance",
                                                                      },
                                                                  )}
                                                              >
                                                                  <span>
                                                                      <span className="localizedName">
                                                                          {
                                                                              val.localizedName
                                                                          }
                                                                      </span>
                                                                      {/* {val.name ===
                                                                      "SB" ? (
                                                                          <Popover
                                                                              overlayStyle={{
                                                                                  zIndex: 90000,
                                                                              }}
                                                                              align={{
                                                                                  offset: [
                                                                                      -4,
                                                                                      0,
                                                                                  ],
                                                                              }}
                                                                              placement="bottomLeft"
                                                                              overlayClassName="popover-dark"
                                                                              content={
                                                                                  <div
                                                                                      style={{
                                                                                          textAlign:
                                                                                              "center",
                                                                                          width: "15rem",
                                                                                      }}
                                                                                  >
                                                                                      包含
                                                                                      V2虚拟体育,
                                                                                      沙巴体育,
                                                                                      BTI
                                                                                      体育,
                                                                                      IM
                                                                                      体育和电竞
                                                                                  </div>
                                                                              }
                                                                              title=""
                                                                              trigger="hover"
                                                                          >
                                                                              <span className="header-popover-inner-tip pointer">
                                                                                  <img
                                                                                      style={{
                                                                                          paddingBottom:
                                                                                              "0.2rem",
                                                                                      }}
                                                                                      src={`/vn/img/home/icon/icon-question.svg`}
                                                                                  />
                                                                              </span>
                                                                          </Popover>
                                                                      ) : null} */}
                                                                      {/* {val.name ===
                                                                      "P2P" ? (
                                                                          <Popover
                                                                              overlayStyle={{
                                                                                  zIndex: 1000,
                                                                              }}
                                                                              align={{
                                                                                  offset: [
                                                                                      -4,
                                                                                      0,
                                                                                  ],
                                                                              }}
                                                                              placement="bottomLeft"
                                                                              overlayClassName="popover-dark"
                                                                              content={
                                                                                  <div
                                                                                      style={{
                                                                                          textAlign:
                                                                                              "center",
                                                                                          width: "15rem",
                                                                                      }}
                                                                                  >
                                                                                      包含双赢棋牌，开元棋牌和小游戏​
                                                                                  </div>
                                                                              }
                                                                              title=""
                                                                              trigger="hover"
                                                                          >
                                                                              <span className="header-popover-inner-tip pointer">
                                                                                  <img
                                                                                      style={{
                                                                                          paddingBottom:
                                                                                              "0.2rem",
                                                                                      }}
                                                                                      src={`/vn/img/home/icon/icon-question.svg`}
                                                                                  />
                                                                              </span>
                                                                          </Popover>
                                                                      ) : null} */}
                                                                  </span>
                                                                  <span className="balance">
                                                                      {val.state ===
                                                                      "UnderMaintenance"
                                                                          ? translate(
                                                                                "维护中",
                                                                            )
                                                                          : formatAmount(
                                                                                val.balance,
                                                                            ) +
                                                                            " đ"}
                                                                  </span>
                                                              </li>
                                                          );
                                                      },
                                                  )
                                                : null}
                                        </ul>
                                    </Spin>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 财务管理，DynamicWallet內有元件使用到redux，需加上	Provider以免抓不抓不到store */}
                <Modal
                    title={translate("钱包")}
                    footer={null}
                    maskClosable={false}
                    width={750}
                    className="wallet-modal"
                    visible={this.state.walletVisible}
                    onCancel={this.closeWallet}
                    destroyOnClose={true}
                    closeIcon={
                        <img
                            src={`${process.env.BASE_PATH}/img/wallet/icon-close.svg`}
                            style={{ width: "18px", height: "18px" }}
                        />
                    }
                >
                    <Provider store={store}>
                        <Spin
                            className={this.state.isModalLoad ? "show" : "hide"}
                            size="large"
                            tip={translate("加载中")}
                        />
                        {this.state.modalTabKey !== "" ? (
                            <DynamicWallet
                                dialogTabKey={this.state.modalTabKey}
                                getBalance={this.getBalance}
                                balanceList={this.state.balanceList}
                                onCancel={this.closeWallet}
                                visible={this.state.walletVisible}
                                goUserCenter={this.props.goUserCenter}
                                setModalTabKey={(v, run) =>
                                    this.setState({ modalTabKey: v }, () => {
                                        typeof run === "function" && run();
                                    })
                                }
                                setLoading={(v) =>
                                    this.setState({ isModalLoad: v })
                                }
                                GetThroughoutVerification={() => {
                                    this.props.GetThroughoutVerification();
                                }}
                            />
                        ) : null}
                    </Provider>
                </Modal>

                {this.state.isLoadOtpModal == true ? (
                    <DynamicOtpPopUp
                        otpVisible={this.state.otpVisible} // 彈窗顯示
                        otpModal={(v) => {
                            this.otpModal(v);
                            getMemberInfo((res) => {
                                this.setGlobalMemberInfo(res);
                            }, true);
                        }} // 彈窗控制
                        otpParam={this.state.kindOfVerification} // 類別
                        memberInfo={this.state.memberInfo} // 會員信息
                        GetThroughoutVerification={() => {
                            this.props.GetThroughoutVerification();
                        }}
                    />
                ) : null}
            </React.Fragment>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        topTabIndex: state.promotion.topTabIndex,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        changeTab: (i) => {
            dispatch(promotionActions.changeTab(i));
        },
        resetPromotionData: () => {
            dispatch(promotionActions.resetData());
        },
        resetMemberData: () => {
            dispatch(userCenterActions.resetData());
        },
        setRefreshCurrentPage: (v) => {
            dispatch(userCenterActions.setRefreshCurrentPage(v));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HasLogged);
