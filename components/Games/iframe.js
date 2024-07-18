import React from "react";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort, APISETS, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { Spin, message, Modal, Icon } from "antd";
import { LEARN_TIME } from "$ACTIONS/constantsData";
import { Cookie } from "$ACTIONS/util";
import Router from "next/router";
import Drawer from "@/Drawer";
import { getUrlVars } from "$ACTIONS/util";
import {
    isWebPSupported,
    getQueryVariable,
    isGuest,
    isThisAllowGuestOpenGame,
    whichUseHttpForGameLaunch,
} from "$ACTIONS/helper";
import { isWindowOpenGame, isCookieNoOpenGame } from "$ACTIONS/constantsData";
import { translate } from "$ACTIONS/Translate";
import OpenGame from "@/Games/openGame";
import { connect } from "react-redux";
class iframebox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameUrl: "",
            visible: true,
            productCode: "IPSB",

            isFullScreen: false,
            isSliderVisible: false,
            userName: "",
            balance: 0,
            isLoadingBalance: false,
            isLearn: 0,
            launchGameCode: "",
        };

        this.checkFull = this.checkFull.bind(this); // 判断是否全屏
        this.requestFullScreen = this.requestFullScreen.bind(this); // 全屏显示
        this.exitFullScreen = this.exitFullScreen.bind(this); // 取消全屏
        this.backPage = this.backPage.bind(this); // 返回上一页
        this.frameload = this.frameload.bind(this); // 刷新IFrame
        this.openDeposit = this.openDeposit.bind(this); // Iframe 呼出充值
        this.openServer = this.openServer.bind(this);
        this.iframeUpdateBalance = this.iframeUpdateBalance.bind(this);
        this.openIframeDrawer = this.openIframeDrawer.bind(this);
        this.closeLearn = this.closeLearn.bind(this);
        this.nextStep = this.nextStep.bind(this);

        this.fullScreen = React.createRef();
        this.isFirst = true;
        this.PRODUCT_CODE = "";

        // 自定义宽度
        this.definedWidth = {
            YBK: 1450,
        };
    }

    componentDidMount() {
        const IS_THIS_ALLOW_GUEST_OPEN_GAME = isThisAllowGuestOpenGame(
            Router.router?.query?.vendor,
            Router.router?.query?.name,
        );
        if (isGuest() && !IS_THIS_ALLOW_GUEST_OPEN_GAME) {
            Router.push("/");
        }
        this.setState(
            {
                launchGameCode: getQueryVariable("launchGameCode"),
            },
            () => {
                this.startGame();
            },
        );
    }
    componentDidUpdate(prevProps, prevState) {
        const { productCode, isTriggerFromGameLobbyButton } = this.props;
        if (
            (productCode && productCode !== prevProps.productCode) ||
            isTriggerFromGameLobbyButton !==
                prevProps.isTriggerFromGameLobbyButton
        ) {
            this.startGame();
            console.log(
                "🚀 ~ iframebox ~ componentDidUpdate ~ this.props.willOpenGameParams:",
                this.props.willOpenGameParams,
            );
        }
    }

    componentWillUnmount() {
        window.onresize = null;
        sessionStorage.removeItem("isGamePage");
        this.setState = () => false;
    }
    startGame = () => {
        let teststatus = !localStorage.getItem("access_token");
        let localUserName = localStorage.getItem("UserName");
        if (
            // Router.router.pathname == "/vn/games/xo-so/game" ||
            // Router.router.pathname == "/vn/games/P2P/game" ||
            // Router.router.pathname == "/vn/games/slots/game" ||
            getQueryVariable("name") === "AIS" ||
            getQueryVariable("name") === "IPSB"
        ) {
            if (teststatus) {
                Router.push("/");
                setTimeout(() => {
                    global.goUserSign("1");
                }, 500);
                return;
            }
        }
        this.Opengame();
        this.setState({ userName: localUserName });
        window.onresize = () => {
            if (!this.checkFull()) {
                this.setState({
                    isFullScreen: false,
                    isSliderVisible: false,
                });
            }
        };
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    };
    closeLearn() {
        this.setState({
            isLearn: false,
            isSliderVisible: false,
        });
        // 设置开启的记录
        let LearnArr = Cookie("learnStep").split("");
        LearnArr.splice(7, 1, "1");
        Cookie("learnStep", LearnArr.join(""), { expires: LEARN_TIME });
    }
    nextStep() {
        this.openIframeDrawer();
        this.setState({ isLearn: 2 });
    }
    openDeposit() {
        this.exitFullScreen();
        if (localStorage.getItem("access_token") === null) {
            global.goUserSign("1");
        } else {
            global.showDialog({ key: 'wallet:{"type": "deposit"}' });
        }
    }
    openServer() {
        this.exitFullScreen();
        global.PopUpLiveChat();
    }
    openIframeDrawer() {
        if (this.isFirst) {
            this.isFirst = false;
            this.iframeUpdateBalance(true);
        }
        this.setState({ isSliderVisible: true });
    }
    iframeUpdateBalance(isLearn = false) {
        if (localStorage.getItem("access_token") === null && isLearn !== true) {
            this.exitFullScreen();
            global.goUserSign("1");
        } else {
            this.setState({ isLoadingBalance: true });
            this.props.getBalance((allBalance) => {
                this.setState({
                    balance: allBalance,
                    isLoadingBalance: false,
                });
            });
        }
    }

    frameload() {
        const ifr = document.getElementById("setIframe");
        if (!ifr) {
            return;
        }
        if (typeof ifr.setAttribute === "function") {
            ifr.setAttribute("src", this.state.gameUrl);
            return;
        }
        ifr.src = this.state.gameUrl;
    }
    checkFull() {
        let isFull =
            document.fullscreenElement ||
            document.msFullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            false;
        return isFull;
    }
    requestFullScreen() {
        let learnStepString = Cookie("learnStep");
        typeof learnStepString === "string" &&
            learnStepString.substr(7, 1) === "0" &&
            this.setState({ isLearn: 1 });
        this.setState({ isFullScreen: true });
        let el = this.fullScreen.current;
        let rfs =
            el.requestFullScreen ||
            el.webkitRequestFullScreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen;
        el.setAttribute(
            "style",
            "text-align: center; position: relative; height: 100vh;",
        );
        if (typeof rfs !== "undefined" && rfs) {
            rfs.call(el);
        } else if (
            typeof window !== "undefined" &&
            typeof window.ActiveXObject != "undefined"
        ) {
            // for IE
            let wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    exitFullScreen() {
        this.setState({
            isFullScreen: false,
            isSliderVisible: false,
        });
        let el = document;
        let cfs =
            el.cancelFullScreen ||
            el.webkitCancelFullScreen ||
            el.mozCancelFullScreen ||
            el.exitFullScreen ||
            el.msExitRequestFullscreen ||
            el.msExitFullscreen;
        this.fullScreen.current.setAttribute(
            "style",
            "text-align: center; position: relative;",
        );
        if (typeof cfs != "undefined" && cfs) {
            cfs.call(el);
        } else if (
            typeof window !== "undefined" &&
            typeof window.ActiveXObject != "undefined"
        ) {
            let wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    backPage() {
        if (window.history.length <= 2) {
            Router.push("/");
        } else {
            Router.back();
        }
    }

    async Opengame() {
        const { productCode, isdemo } = this.props;
        let gameId = getUrlVars()["gameid"];

        let Demostatus = isdemo || false;
        if (typeof isdemo === "string" && isdemo.toLowerCase() === "false") {
            Demostatus = false;
        }
        // if (
        //     Router.router.pathname == "/vn/games/the-thao/game" ||
        //     Router.router.pathname == "/vn/games/xo-so/game" ||
        //     Router.router.pathname == "/vn/games/P2P/lobby" ||
        //     Router.router.pathname == "/vn/games/exports/game"
        // ) {
        //     Demostatus = !localStorage.getItem("access_token");
        // }
        let IS_GUEST = isGuest();
        let IS_LOGINNED_MEMBER = !IS_GUEST;
        const PRODUCT_CODE = getQueryVariable("name");
        const EVENT_ID = getQueryVariable("eventid");
        let thirdPartyCookie = JSON.parse(
            localStorage.getItem("thirdPartyCookie"),
        );
        let boolIsThisWindowOpenGame =
            (thirdPartyCookie == false &&
                isCookieNoOpenGame.find((v) => v == PRODUCT_CODE)) ||
            isWindowOpenGame.find((v) => v == PRODUCT_CODE);

        if (IS_LOGINNED_MEMBER && !boolIsThisWindowOpenGame) {
            let IS_NO_NEED_CHECK_BALANCE =
                global.dataAboutCheckBalanceModalOpenedFromIframeOpenGame
                    ?.isTriggerFromGameLobbyButton;
            if (
                !IS_NO_NEED_CHECK_BALANCE &&
                this.QuickStartGame &&
                !(await this.QuickStartGame.checkBalanceNeedAsyncAPIChecking(
                    getQueryVariable("vendor"),
                    PRODUCT_CODE,
                ))
            ) {
                return;
            }
            if (IS_NO_NEED_CHECK_BALANCE) {
                if (global.dataAboutCheckBalanceModalOpenedFromIframeOpenGame) {
                    delete global
                        .dataAboutCheckBalanceModalOpenedFromIframeOpenGame
                        .isTriggerFromGameLobbyButton; // use once then delete
                }
            }
        }
        this.PRODUCT_CODE = PRODUCT_CODE;
        const vqParams =
            !!EVENT_ID && EVENT_ID !== "null"
                ? `${getQueryVariable("sportid")}/${EVENT_ID}`
                : "";
        const whichUseProtocol = whichUseHttpForGameLaunch(PRODUCT_CODE);
        const data = {
            provider: PRODUCT_CODE,
            platform: "web",
            gameId: gameId,
            isDemo: !!Demostatus,
            hostName: whichUseProtocol,
            vendorQuery: vqParams,
            mobileLobbyUrl: whichUseProtocol,
            bankingUrl: whichUseProtocol,
            logoutUrl: whichUseProtocol,
            sportid: "",
            eventId: "",
        };
        post(`${ApiPort.Opengame}?isDemo=${Demostatus}${APISETS}`, data)
            .then((res) => {
                if (res?.result) {
                    const errorModalInfo = function () {
                        Modal.info({
                            className:
                                "confirm-modal-of-public oneButton elementTextLeft",
                            icon: null,
                            okText: translate("同意"),
                            title: translate("通知"),
                            content:
                                res.message ||
                                translate(
                                    "您打开的游戏正在维护中，请稍后再回来。 如果您有任何疑问，请联系在线聊天以获得支持",
                                ),
                            centered: true,
                        });
                    };
                    if (
                        (res.result.isGameMaintenance ||
                            !res.result.gameLobbyUrl) &&
                        PRODUCT_CODE !== "PGS"
                    ) {
                        errorModalInfo();
                        Router.push("/");
                        return;
                    }
                    let gameUrlString = res.result.gameLobbyUrl;

                    if (PRODUCT_CODE === "VTG") {
                        this.OpenV2G(gameUrlString);
                        this.setState({
                            visible: false,
                        });
                        return;
                    }
                    if (PRODUCT_CODE === "PGS" && res.result?.contents?.body) {
                        try {
                            const decoded = atob(res.result.contents.body);
                            if (
                                decoded &&
                                /<!DOCTYPE html>|<html/i.test(decoded)
                            ) {
                                gameUrlString = decoded;
                            } else {
                                errorModalInfo();
                                Router.push("/");
                                return;
                            }
                        } catch (error) {
                            console.error(
                                "Error decoding Base64 data:",
                                error.message,
                            );
                            errorModalInfo();
                            Router.push("/");
                            return;
                        }
                    }
                    if (PRODUCT_CODE === "SBT") {
                        function replaceCharInUrl(
                            url,
                            targetChar,
                            replacementChar,
                        ) {
                            if (url.indexOf(targetChar) !== -1) {
                                const newUrl = url.replace(
                                    targetChar,
                                    replacementChar,
                                );
                                return newUrl;
                            }
                            return url;
                        }
                        const tempUrl = replaceCharInUrl(
                            gameUrlString,
                            "btiv3.js",
                            "btiv3vn.js",
                        );
                        gameUrlString =
                            tempUrl +
                            "&ReferURL=" +
                            ApiPort.LOCAL_HOST +
                            "&oddsstyleid=3&APIUrl=" +
                            ApiPort.URL +
                            "&bal=" +
                            SB +
                            "&MemberToken=" +
                            JSON.parse(localStorage.getItem("access_token"));
                    }

                    const _this = this;
                    if (
                        boolIsThisWindowOpenGame ||
                        (IS_GUEST &&
                            typeof localStorage !== "undefined" &&
                            localStorage.getItem("forceUseNewWindowToOpenGame"))
                    ) {
                        if (IS_GUEST) {
                            Modal.info({
                                icon: null,
                                centered: true,
                                title: translate("注意"),
                                content: (
                                    <p>
                                        {translate(
                                            "为了提升更好的用户游戏体验，平台页面将会为您开启新的窗口。",
                                        )}
                                    </p>
                                ),
                                okText: translate("同意"),
                                className:
                                    "confirm-modal-of-public oneButton elementTextLeft",
                                onOk: () => {
                                    this.setState(
                                        { gameUrlOpen: gameUrlString },
                                        () => {
                                            this.openWindow(gameUrlString);
                                        },
                                    );
                                },
                                onCancel: () => {
                                    Router.push("/");
                                },
                            });
                        } else {
                            Modal.info({
                                icon: null,
                                centered: true,
                                title: translate("注意"),
                                content: (
                                    <p>
                                        {translate(
                                            "为了提升更好的用户游戏体验，平台页面将会为您开启新的窗口。",
                                        )}
                                    </p>
                                ),
                                okText: translate("同意"),
                                className:
                                    "confirm-modal-of-public oneButton elementTextLeft",
                                onOk: () => {
                                    this.setState(
                                        {
                                            gameUrlOpen: gameUrlString,
                                        },
                                        () => {
                                            if (
                                                this.QuickStartGame &&
                                                !this.QuickStartGame.checkBalance(
                                                    getQueryVariable("vendor"),
                                                    PRODUCT_CODE,
                                                )
                                            ) {
                                                return;
                                            }
                                            this.openWindow(gameUrlString);
                                        },
                                    );
                                },
                                onCancel: () => {
                                    Router.push("/");
                                },
                            });
                            this.setState({
                                visible: false,
                            });
                            return;
                        }
                    } else {
                        if (document.getElementById("setIframe")) {
                            this.setState({ gameUrl: gameUrlString });
                            const ImsportsIframe =
                                document.getElementById("setIframe");
                            if (ImsportsIframe) {
                                ImsportsIframe.onload =
                                    ImsportsIframe.onreadystatechange =
                                        function (e) {
                                            if (
                                                e.type != "load" &&
                                                this.readyState &&
                                                this.readyState != "complete"
                                            )
                                                return;
                                            else {
                                                _this.setState({
                                                    visible: false,
                                                });
                                            }
                                        };
                                this.frameload();
                            }
                        }
                    }
                } else {
                    message.error(translate("系统错误，请联系在线支持！"));
                    Router.push("/");
                }
            })
            .finally(() => {
                this.setState({
                    visible: false,
                });
            });
    }

    //新窗口打开
    openWindow(gameUrlString) {
        Router.push("/");
        let popup = window.open(
            gameUrlString || this.state.gameUrlOpen,
            "Fun88",
            "width=" +
                (window.screen.availWidth - 10) +
                ",height=" +
                (window.screen.availHeight - 30) +
                ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes",
        );
        popup.document.title = Router.router.query.name;
        popup.focus();
    }

    getStrQueryOfGameOpenUrl = (Url) => {
        let vars = {};
        const hashes = Url.slice(Url.indexOf("?") + 1).split("&");
        for (var i = 0; i < hashes.length; i++) {
            let hash = hashes[i].split("=");
            if (hash[1]) {
                vars[hash[0]] = hash[1].split("#")[0];
            }
        }
        return vars;
    };

    /**
     * @description: v2g虚拟体育特殊处理
     * @param {*} GameOpenUrl
     * @return {*}
     */
    OpenV2G(GameOpenUrl) {
        // 检查 GameOpenUrl 参数是否存在
        if (!GameOpenUrl) {
            throw new Error("GameOpenUrl Không thể trống");
        }
        let queryParams = this.getStrQueryOfGameOpenUrl(GameOpenUrl);
        let onlineHash = queryParams["onlineHash"];
        let language = queryParams["language"];
        let profile = queryParams["profile"];
        // 检查必需的查询参数是否存在
        // if (!onlineHash || !language || !profile) {
        //     throw new Error("缺少必需的查询参数");
        // }
        console.log("query variables: ", onlineHash, language, profile);
        let iframe = document.getElementById("setIframe");
        let doc = iframe.contentDocument || iframe.contentWindow.document;
        let htmlContent = `
          <!DOCTYPE html>
          <html>
            <meta
              key="viewport"
              name="viewport"
              content="width=device-width,initial-scale=1.0,maximum-scale=1.0,viewport-fit=cover"
            />
            <style>
              body {
                margin: 0;
              }
              #golden-race-desktop-app {
                width: 100%;
                height: 100%;
              }
              #golden-race-desktop-app > iframe[style] {
                width: 100% !important;
                min-height: calc(100vh - 75px) !important;
              }
            </style>
            <body>
              <div id="golden-race-desktop-app"></div>
              <script
                src="${GameOpenUrl}"
                id="golden-race-desktop-loader"
              ></script>
              <script>
                console.log('开始执行此脚本');
                document.addEventListener("DOMContentLoaded", function () {
                  let loader = grDesktopLoader({ 
                    onInit: function(type, content) {
                      navigate('${this.state.launchGameCode}');
                    },
                    onlineHash: '${onlineHash}',
                    profile: '${profile}',
                    showOddFormatSelector: false,
                    language: '${language}'
                  });
                });
                function navigate(path) {
                  loader.navigateByDisplayId(path);
                }
              </script>
            </body>
          </html>
        `;

        // 将 HTML 内容写入 iframe
        doc.open();
        doc.write(htmlContent);
        doc.close();
    }

    render() {
        const { gameUrl, visible } = this.state;
        const { productCode } = this.props;
        return (
            <Spin spinning={visible} tip={translate("加载中")}>
                <div
                    ref={this.fullScreen}
                    className="common-distance-wrap"
                    style={{ position: "relative", textAlign: "center" }}
                    key={productCode}
                >
                    {/* 小屏幕内容 */}
                    <div
                        style={{
                            margin: "auto",
                            position: "relative",
                            width: this.definedWidth[this.PRODUCT_CODE] || 1370,
                        }}
                    >
                        <div
                            className={`small-screen small-screen-${
                                this.definedWidth[this.PRODUCT_CODE]
                                    ? this.PRODUCT_CODE
                                    : "default"
                            }`}
                            style={{
                                display: this.state.isFullScreen
                                    ? "none"
                                    : "block",
                                left: "auto",
                                right: -80,
                            }}
                        >
                            <div
                                className="scale-large acreen-btn"
                                onClick={this.requestFullScreen}
                            >
                                {translate("全屏")}
                            </div>
                            <div
                                className="page-back acreen-btn"
                                onClick={this.backPage}
                            >
                                {translate("返回")}
                            </div>
                        </div>
                    </div>
                    <iframe
                        id="setIframe"
                        align="center"
                        style={{
                            maxWidth: "initial",
                            width: this.state.isFullScreen ? "100%" : "71%",
                            height: this.state.isFullScreen
                                ? "100%"
                                : this.props.hardHeight || 800,
                        }}
                        srcDoc={this.PRODUCT_CODE === "PGS" ? gameUrl : null}
                        src={this.PRODUCT_CODE === "PGS" ? null : gameUrl}
                        frameBorder="0"
                    />
                    {/* 大屏幕内容 */}
                    <div
                        className="large-screen"
                        style={{
                            display: this.state.isFullScreen ? "block" : "none",
                        }}
                    >
                        <div
                            className="scale-small acreen-btn"
                            onClick={this.exitFullScreen}
                        >
                            {translate("退出")}
                        </div>
                        <div
                            className={`games-slider${
                                this.state.isLearn === 1 ? " learn" : ""
                            }`}
                            onClick={this.openIframeDrawer}
                        />
                    </div>

                    <Drawer
                        wrapDom={this.fullScreen}
                        onClose={() =>
                            this.setState({ isSliderVisible: false })
                        }
                        visible={this.state.isSliderVisible}
                        className={this.state.isLearn === 2 ? "learn" : ""}
                    >
                        <div
                            className="scale-small acreen-btn drawer"
                            onClick={this.exitFullScreen}
                        >
                            {translate("退出")}
                        </div>
                        <div className="tlc-user-info">
                            <div className="tlc-user-picture-wrap">
                                <div className="tlc-user-picture">
                                    <img
                                        src={`${process.env.BASE_PATH}/img/icon/fun.svg`}
                                    />
                                </div>
                                <h4 className="tlc-user-name">
                                    {this.state.userName}
                                </h4>
                            </div>
                            <div className="tlc-user-wallet-wrap draw">
                                <div className="tlc-user-wallet">
                                    <Spin
                                        spinning={this.state.isLoadingBalance}
                                        size="small"
                                    >
                                        <div className="tlc-all-balance">
                                            <span className="inline-block">
                                                ￥
                                            </span>
                                            <span className="inline-block">
                                                {this.state.balance}
                                            </span>
                                        </div>
                                    </Spin>
                                </div>
                                <div
                                    className="inline-block"
                                    onClick={this.iframeUpdateBalance}
                                >
                                    <Icon type="reload" />
                                </div>
                            </div>
                        </div>
                        <ul className="tlc-iframe-bar">
                            <li onClick={this.openDeposit}>
                                {translate("存款")}
                            </li>
                            <li onClick={this.frameload}>
                                {translate("刷新游戏")}
                            </li>
                        </ul>
                        <div
                            className="tlc-iframe-live-btn"
                            onClick={this.openServer}
                        >
                            <div className="tlc-sprite live-service" />
                            <span>{translate("在线客服")}</span>
                        </div>
                    </Drawer>
                </div>
                <OpenGame
                    OnRef={(QuickStartGame) =>
                        (this.QuickStartGame = QuickStartGame)
                    }
                    openWindow={(url) => {
                        this.openWindow(url);
                    }}
                />
            </Spin>
        );
    }
}
const mapStateToProps = function (state) {
    return {
        willOpenGameParams: state.willOpenGameParams,
    };
};

export default connect(mapStateToProps, null)(iframebox);
