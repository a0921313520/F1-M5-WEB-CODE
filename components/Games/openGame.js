/*
 * @Author: Alan
 * @Date: 2023-02-12 20:37:42
 * @LastEditors: Alan
 * @LastEditTime: 2023-07-07 09:30:43
 * @Description: 启动游戏组件（所有关于启动游戏皆用此组件）
 * @FilePath: /F1-M1-WEB-Code/components/Games/openGame.js
 */
import React from "react";
import { message, Modal, Button } from "antd";
import Router from "next/router";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { get } from "$ACTIONS/TlcRequest";
import Tag from "@/Games/Tag";
import { showSpin, hideSpin } from "../../store/spinSlice";
import { connect } from "react-redux";
import ImageWithFallback from "@/ImageWithFallback";
import classNames from "classnames";
import { translate } from "$ACTIONS/Translate";
import GameStatic from "$DATA/game.static";
import { GetAllBalance } from "$DATA/wallet";
import { isWindowOpenGame, isCookieNoOpenGame } from "$ACTIONS/constantsData";
import {
    getQueryVariable,
    isGuest,
    isThisAllowGuestOpenGame,
    isThisAllowGuestOpenGCategory,
} from "$ACTIONS/helper";
import { gameActions } from "$STORE/gameSlice";
class openGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentList: [], // 当前显示的数据
            showBalanceError: false,
            isDeposit: false,
        };
        if (props.OnRef) {
            props.OnRef(this);
        }
    }
    componentDidMount() {}

    /**
     * @description: 启动游戏
     * @param {*} items 游戏参数
     * @return {*}
     */
    openGame(items) {
        let IS_GUEST = isGuest();
        let IS_LOGINNED_MEMBER = !IS_GUEST;
        let IS_ALLOW_GUEST_OPEN_IFRAME_OR_NEW_WINDOW_GAME =
            isThisAllowGuestOpenGame(items.gameCatCode, items.provider);
        let IS_ALLOW_GUEST_OPEN_GCATEGORY = isThisAllowGuestOpenGCategory(
            items.gameCatCode,
            items.provider,
        );
        //如果未登录，弹出登录窗口 //點擊產品頁平台，跳转游戏大厅游戏列表页面不弹出登录窗口
        if (
            IS_GUEST &&
            !items.isProductPage &&
            !IS_ALLOW_GUEST_OPEN_IFRAME_OR_NEW_WINDOW_GAME &&
            !IS_ALLOW_GUEST_OPEN_GCATEGORY
        ) {
            global.goUserSign("1");
            return;
        }

        //检测账户是否封锁
        if (
            IS_LOGINNED_MEMBER &&
            JSON.parse(localStorage.getItem("memberInfo"))?.isGameLock
        ) {
            message.error(
                translate("您的账户已根据账户管理政策关闭了,请联系在线客服"),
            );
            return;
        }
        //跳转游戏大厅游戏列表页面
        if (
            (items.provider == "VTG" && items.Type == "HeaderMenu") ||
            items.OpenGamesListPage
        ) {
            const routerPath = GameStatic.find(
                (game) => game.providerName === items.gameCatCode,
            ).path;
            if (routerPath) {
                Router.push(`/games/${routerPath}/${items.provider}`);
                return;
            }
        }

        if (
            typeof SelfExclusionsisDisabled != "undefined" &&
            SelfExclusionsisDisabled
        ) {
            CheckSelfExclusions(true);
            return;
        }
        this.actionGame(items);
    }
    //不支持ifame
    IsNoIframe(provider) {
        let thirdPartyCookie = JSON.parse(
            localStorage.getItem("thirdPartyCookie"),
        );
        if (
            (thirdPartyCookie == false &&
                isCookieNoOpenGame.find((v) => v == provider)) ||
            isWindowOpenGame.find((v) => v == provider)
        ) {
            return true;
        }
        return false;
    }

    _isEnterGameByJustRefreshGameUrl() {
        return (
            typeof window !== "undefined" &&
            window.location?.hash?.includes("REFRESH_AFTER_LOGIN_SUCC")
        );
    }

    /**
     * @description: 游戏跳转
     * @return {*}
     */
    actionGame(items, isTriggerFromGameLobbyButton) {
        const IS_THIS_ALLOW_GUEST_OPEN_GAME = isThisAllowGuestOpenGame(
            items.gameCatCode,
            items.provider,
        );
        if (isGuest() && !IS_THIS_ALLOW_GUEST_OPEN_GAME) {
            global.goUserSign("1");
            return;
        }
        global.dataAboutCheckBalanceModalOpenedFromIframeOpenGame = {
            // integrating and workaround with existed code & the spec of this task/ticket
            theGameItem: items,
            isTriggerFromGameLobbyButton: isTriggerFromGameLobbyButton,
        };

        const queryOfIsTriggerFromGameLobbyButton = `&trigger_from_game_lobby_button=${isTriggerFromGameLobbyButton ? "YES" : "NO"}`;

        const isEnterGameByJustRefreshGameUrl =
            this._isEnterGameByJustRefreshGameUrl(); // for example: guest enter game --> guest login successfully --> webpage will refresh current page to re-load game iframe.
        if (isEnterGameByJustRefreshGameUrl) {
            // supplying items by url.
            items = items || {};
            items.provider = Router.router.query?.name;
            items.gameCatCode = Router.router.query?.vendor;
            items.gameId = Router.router.query?.gameId || 0;
        }

        if (items.provider == "AVIATOR" || items.launchGameCode == "aviator") {
            //启动飞行游戏
            this.OpenSPR(queryOfIsTriggerFromGameLobbyButton);
            return;
        }
        // const gameTypeCode = items.gameCatCode.toLowerCase();
        const routerPath = GameStatic.find(
            (game) => game.providerName === items.gameCatCode,
        ).path;
        //直接iframe启动游戏
        const params = {
            name: items.provider,
            id: items.gameId,
            deme: isGuest() ? "true" : "false",
            launchGameCode: items.launchGameCode || "",
            isNeedOpenWallet: queryOfIsTriggerFromGameLobbyButton,
        };
        this.props.updateWillOpenGameParams(params);
        Router.push(
            `/games/${routerPath}/${items.provider}/?gameid=${items.gameId}&vendor=${items.gameCatCode}&name=${items.provider}&demo=${isGuest() ? "true" : "false"}&launchGameCode=${items.launchGameCode || ""}` +
                queryOfIsTriggerFromGameLobbyButton,
        );
    }

    /**
     * @description: 检查余额是否充足，进行相关执行
     * @return {*}
     */
    async checkBalanceNeedAsyncAPIChecking(code, provider) {
        const isEnterGameByJustRefreshGameUrl =
            this._isEnterGameByJustRefreshGameUrl();
        const isBalanceDoesNotSetup =
            typeof window !== "undefined" &&
            typeof window.TotalBal === "undefined";
        const NEED_SETUP_BALANCE_FROM_API_THEN_showBalanceError =
            isEnterGameByJustRefreshGameUrl && isBalanceDoesNotSetup;

        if (NEED_SETUP_BALANCE_FROM_API_THEN_showBalanceError) {
            const res = await GetAllBalance();
            res?.result?.map(function (item) {
                window[item.name] = item.balance;
            });
            return this.checkBalance(code, provider);
        }
        return this.checkBalance(code, provider);
    }

    checkBalance(code, provider) {
        this.setState({ providerTag: provider });
        if (window.TotalBal < 20) {
            this.setState({ showBalanceError: true, isDeposit: true });
            return false;
        }
        switch (code) {
            case "Sportsbook":
            case "ESports":
                const status = window.SB < 20 ? true : false;
                this.setState({ showBalanceError: status });
                return !status;
            case "InstantGames":
            case "P2P":
                const status2 =
                    (provider == "YBP" && window.YBP < 20) ||
                    (provider != "YBP" && window.P2P < 20);
                this.setState({ showBalanceError: status2 });
                return !status2;
            case "LiveCasino":
                const status3 = window.LD < 20 ? true : false;
                this.setState({ showBalanceError: status3 });
                return !status3;
            case "Slot":
                if (provider == "IMOPT") {
                    const status4pttiger =
                        provider == "IMOPT" && window.IMOPT < 20;
                    this.setState({ showBalanceError: status4pttiger });
                    return !status4pttiger;
                } else {
                    const status4 =
                        (provider == "YBF" && window.YBF < 20) ||
                        (provider != "YBF" && window.SLOT < 20);
                    this.setState({ showBalanceError: status4 });
                    return !status4;
                }
            case "KenoLottery":
                const status5 =
                    (provider == "YBK" && window.YBK < 20) ||
                    (provider == "SGW" && window.KENO < 20) ||
                    (provider == "LBK" && window.LBK < 20) ||
                    (provider == "SLC" && window.SLC < 20);
                this.setState({ showBalanceError: status5 });
                return !status5;
            default:
                return true;
        }
    }

    /**
     * @description: 开启飞行游戏
     * @return {*}
     */
    OpenSPR(queryOfIsTriggerFromGameLobbyButton) {
        const { showSpin, hideSpin, updateWillOpenGameParams } = this.props;
        showSpin([true, translate("加载中")]);
        get(
            ApiPort.CmsGames +
                `?gameType=InstantGames&gameSortingType=Default&provider=SPR&api-version=2.0&Platform=Desktop`,
        ).then((res) => {
            hideSpin();
            if (res.result && res.result.gameDetails.length != 0) {
                let item = res.result.gameDetails.find(
                    (ele) => ele.launchGameCode === "aviator",
                );
                if (item) {
                    const params = {
                        name: item.provider,
                        id: item.gameId,
                        deme: false,
                        launchGameCode: item.launchGameCode,
                        isNeedOpenWallet: queryOfIsTriggerFromGameLobbyButton,
                    };
                    updateWillOpenGameParams(params);
                    Router.push(
                        `/games/arcade-games/${item.provider}/?gameid=${item.gameId}&name=${item.provider}&type=&demo=${false}&launchGameCode=${item.launchGameCode || ""}` +
                            queryOfIsTriggerFromGameLobbyButton,
                    );
                } else {
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
                }
            }
        });
    }

    render() {
        const { itemsData, customHtml, hideTag, QuickStartGame, className } =
            this.props;
        const getImageDimensions = (gameCatCode) => {
            switch (gameCatCode) {
                case "P2P":
                    return { width: 349, height: 216 };
                case "LiveCasino":
                    return { width: 358, height: 220 };
                case "Slot":
                    return { width: 294, height: 181 };
                default:
                    return { width: 400, height: 300 };
            }
        };
        return (
            <React.Fragment>
                {!QuickStartGame && (
                    <React.Fragment>
                        {/* 头部导航栏启动 */}
                        {itemsData &&
                            itemsData.Type &&
                            itemsData.Type == "HeaderMenu" && (
                                <a
                                    onClick={() => {
                                        this.openGame(itemsData);
                                    }}
                                    className={classNames({
                                        isNew: itemsData.isNew,
                                        isHot: itemsData.isHot,
                                    })}
                                >
                                    <div
                                        className={classNames({
                                            ["list-content"]: true,
                                        })}
                                    >
                                        <ImageWithFallback
                                            src={
                                                itemsData.image ||
                                                "/vn/img/icon/bluebg.png"
                                            }
                                            width={100}
                                            height={100}
                                            alt={itemsData.gameName}
                                            fallbackSrc="/vn/img/icon/bluebg.png"
                                        />
                                        <p>{itemsData.gameName}</p>
                                    </div>
                                </a>
                            )}
                        {/* 普通游戏图片启动 */}
                        {itemsData && !itemsData.Type && !customHtml && (
                            <div
                                className="openGame"
                                onClick={() => {
                                    this.openGame(itemsData);
                                }}
                            >
                                {!hideTag && (
                                    <Tag provider={itemsData.provider} />
                                )}
                                <ImageWithFallback
                                    src={
                                        itemsData.imageUrl ||
                                        "/vn/img/logo/logo.svg"
                                    }
                                    width={
                                        getImageDimensions(
                                            itemsData.gameCatCode,
                                        ).width
                                    }
                                    height={
                                        getImageDimensions(
                                            itemsData.gameCatCode,
                                        ).height
                                    }
                                    alt={itemsData.gameName}
                                    fallbackSrc="/vn/img/logo/logo.svg"
                                />
                                <div className="GameName">
                                    {itemsData.gameName}
                                </div>
                            </div>
                        )}
                        {/* 自定义显示 */}
                        {customHtml && customHtml(this)}
                    </React.Fragment>
                )}
                <Modal
                    centered={true}
                    title={translate("提醒")}
                    footer={null}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState(
                            {
                                showBalanceError: false,
                            },
                            () => {
                                Router.push("/");
                            },
                        );
                    }}
                    visible={this.state.showBalanceError}
                    width={400}
                    className="leaveAddWalletModal"
                    icon={null}
                >
                    <div className="content">
                        {translate("余额不足，请转账或充值")}
                    </div>
                    <div className="buttonWrap">
                        <Button
                            onClick={() => {
                                this.setState(
                                    {
                                        showBalanceError: false,
                                    },
                                    () => {
                                        if (
                                            this.IsNoIframe(
                                                getQueryVariable("name"),
                                            )
                                        ) {
                                            this.props.openWindow();
                                            return;
                                        }
                                        let inMemoryDataAboutCheckBalanceModalOpenedFromIframeOpenGame =
                                            global.dataAboutCheckBalanceModalOpenedFromIframeOpenGame;
                                        delete global.dataAboutCheckBalanceModalOpenedFromIframeOpenGame;
                                        let inMemoryItemData =
                                            inMemoryDataAboutCheckBalanceModalOpenedFromIframeOpenGame
                                                ? inMemoryDataAboutCheckBalanceModalOpenedFromIframeOpenGame.theGameItem
                                                : undefined;
                                        this.actionGame(
                                            itemsData || inMemoryItemData,
                                            true,
                                        );
                                    },
                                );
                            }}
                        >
                            <span className="ticket743uat">
                                {translate("返回大厅")}
                            </span>
                        </Button>
                        <Button
                            onClick={() => {
                                this.setState(
                                    {
                                        showBalanceError: false,
                                    },
                                    () => {
                                        if (this.state.isDeposit) {
                                            global.showDialog({
                                                key: 'wallet:{"type": "deposit"}',
                                            });
                                        } else {
                                            let type =
                                                this.state.providerTag ||
                                                getQueryVariable("name");
                                            let moreDialogParams = "";
                                            switch (
                                                getQueryVariable("vendor") ||
                                                itemsData.gameCatCode
                                            ) {
                                                case "Sportsbook":
                                                case "ESports":
                                                    type = "SB";
                                                    break;
                                                case "InstantGames":
                                                case "P2P":
                                                    type =
                                                        type == "YBP"
                                                            ? "YBP"
                                                            : "P2P";
                                                    break;
                                                case "LiveCasino":
                                                    type = "LD";
                                                    break;
                                                case "Slot":
                                                    if (type == "IMOPT") {
                                                        moreDialogParams = `, "IS_PT_TIGER_MACHINE":true`;
                                                    }
                                                    type =
                                                        type == "YBF"
                                                            ? "YBF"
                                                            : "SLOT";
                                                    break;
                                                case "KenoLottery":
                                                    type =
                                                        type == "SGW"
                                                            ? "KENO"
                                                            : type;
                                                    break;
                                            }

                                            global.showDialog({
                                                key: `wallet:{"type": "transfer", "currentPayValue":"${type}"${moreDialogParams}}`,
                                            });
                                        }
                                    },
                                );
                            }}
                        >
                            <span className="ticket743uat">
                                {translate("银行(大写)")}
                            </span>
                        </Button>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = function (dispatch) {
    return {
        showSpin,
        hideSpin,
        updateWillOpenGameParams: (params) => {
            //这个设置数据的方法还没有地方在使用，暂时先留着。
            dispatch(gameActions.setWillOpenGameParams(params));
        },
    };
};

export default connect(null, mapDispatchToProps)(openGame);
