/*
 * @Author: Alan
 * @Date: 2023-02-11 21:58:16
 * @LastEditors: Alan
 * @LastEditTime: 2023-07-06 00:40:09
 * @Description: 老虎机 平台筛选
 * @FilePath: /F1-M1-WEB-Code/components/Games/Game-Page-2/index.js
 */
import React from "react";
import { Spin, Icon, Modal } from "antd";
import OpenGame from "../openGame";
import { ApiPort, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { get } from "$ACTIONS/TlcRequest";
import SlotJackpotRollover from "../Slot-Jackpot-Rollover";
import Tag from "@/Games/Tag";
import GameBanner from "@/Games/Banner";
import Router from "next/router";
import { connect } from "react-redux";
import { getFlashProviderListAction } from "$STORE/thunk/gameThunk";
import ImageWithFallback from "@/ImageWithFallback/imgLocal";
import { staticHeaderGtag, gameListPageTrackingPiwik, gameListOpenGamePiwik, gameListPageCheckMorePiwik } from "$ACTIONS/piwikData";
import classNames from "classnames";
import { translate } from "$ACTIONS/Translate";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentList: [], // 当前显示的数据
            xCoord: 0,
            distance: 0,
            isSlot: false,
        };

        this.jackpotGames = React.createRef();
        this.dontShowGameTypeList = ["InstantGames", "KenoLottery"];
    }

    componentDidMount() {
        /* 获取推荐游戏 */
        this.changeGamesType("IsRecommendedGames");
        /* 获取奖池游戏 */
        this.props.Routertype === "Slot" && this.changeGamesType("Jackpot");
        /* 获取平台列表 */
        this.getProvider();
        /* 获取游戏类型列表 */
        this.getSubCategory();
        gameListPageTrackingPiwik(this.props.Routertype)
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.JackpotGameList !== this.state.JackpotGameList) {
            this.setState({
                hasJackpot: true, // update state to get createRef data of JackpotGames
            });
        }
        if (prevState.hasJackpot !== this.state.hasJackpot) {
            const jackpotGames = this.jackpotGames.current;
            const distance =
                jackpotGames.scrollWidth -
                jackpotGames.getBoundingClientRect().width;
            this.setState({ distance });
        }
    };

    /**
     * @description: 切换游戏类型
     * @return {*}
     */
    changeGamesType(Recommended) {
        this.setState({
            isLoading: true,
        });

        let GameType = this.props.Routertype;
        const isSlot = GameType === "Slot";

        /* 获取游戏列表 */
        get(
            ApiPort.CmsGames +
            `?gameType=${GameType}&gameSortingType=Default&category=${Recommended}&api-version=2.0&Platform=Desktop`
        ).then((res) => {
            if (res && res.result && Array.isArray(res.result.gameDetails) && res.result.gameDetails.length) {
                const gameDetails = res.result.gameDetails;
                const jackpotGameDetails = gameDetails.filter(item =>
                    item.categories.some(cate => cate.categoryName === "Jackpot")
                );
                if (Recommended === "Jackpot") {
                    this.setState({
                        ["JackpotGameList"]: jackpotGameDetails.slice(0, 9),
                    });
                } else {
                    this.setState({
                        ["GameList"]: gameDetails.slice(0, 9),
                    });
                }

                this.setState({
                    isLoading: false,
                    isSlot: isSlot,
                });
            }
        });
    }

    /**
     * @description: 平台列表
     * @return {*}
     */

    getProvider() {
        this.props.getFlashProviderList(this.props.Routertype);
    }


    /**
     * @description: 游戏类型 （捕鱼游戏，街机游戏）
     * @return {*}
     */
    getSubCategory() {
        this.setState({
            isLoading: true,
        });
        let GameType = this.props.Routertype;
        get(
            ApiPort.CmsSubCategory +
            `?gameType=${GameType}&api-version=2.0&Platform=Desktop`
        ).then((res) => {
            if (res && res.isSuccess && res.result && res.result.length != 0) {
                this.setState({
                    SubCategory: res.result,
                });
                this.setState({
                    isLoading: false,
                });
            }
        });
    }

    slide = (direction) => {
        const jackpotGames = this.jackpotGames.current;
        const { xCoord, distance } = this.state;
        const itemWidth = 840;
        const gap = 15;
        const oneClick = itemWidth + gap;
        let slidedDistance;

        if (direction === "next") {
            slidedDistance = xCoord - oneClick;

            if (slidedDistance * -1 >= distance + itemWidth / 3) {
                // negative to positive
                slidedDistance = (distance + itemWidth / 3) * -1; // change back to negatice
            }
        }
        if (direction === "prev") {
            slidedDistance = xCoord + oneClick;

            if (slidedDistance >= 0) {
                slidedDistance = 0;
            }
        }

        this.setState({
            xCoord: slidedDistance,
        });
        jackpotGames.style.left = slidedDistance + "px";
    };

    render() {
        const {
            isLoading,
            isSlot
        } = this.state;
        const {
            GameInfo,
            Routertype
        } = this.props;
        const GamesProvider = GameInfo && GameInfo[`provider_${Routertype}`];
        const routerPath =
            Routertype === "KenoLottery" ?
                "xo-so" :
                Routertype === "LiveCasino" ?
                    "live-casino" :
                    Routertype === "Slot" ?
                        "slots" :
                        Routertype === "InstantGames" ?
                            "arcade-games" :
                            Routertype;

        return (
            <Spin spinning={isLoading} tip={translate("加载中")}>
                <div className="common-distance">
                    <GameBanner
                        Routertype={Routertype}
                    />
                    <div className="Gameslobby game-box-content">
                        <div
                            className="GamesHome"
                            key={JSON.stringify(
                                this.state.GameList +
                                this.state.JackpotGameList +
                                GamesProvider +
                                this.state.SubCategory
                            )}
                        >
                            {this.state.GameList && (
                                <React.Fragment>
                                    <div className="Top">
                                        <h3 className="Title">
                                            {Routertype === "InstantGames" ? translate("所有游戏") : translate("推荐游戏")}
                                        </h3>
                                        {this.props.Routertype !== "InstantGames" && (
                                            <div
                                                onClick={() => {
                                                    Router.push(
                                                        `/games/${routerPath}/gamelist?sortingType=Recommended`
                                                    );
                                                    gameListPageCheckMorePiwik(Routertype)
                                                }}
                                            >
                                                {translate("查看全部")} <Icon type="right" />
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        id={this.props.Routertype}
                                        className={`${this.props.Routertype}-RecommendGames RecommendGames `}
                                    >
                                        {this.state.GameList &&
                                            this.state.GameList.map((item, index) => {
                                                return (
                                                    <div
                                                        className="item"
                                                        key={index + "RecommendGames"}
                                                        onClick={() => {
                                                            gameListOpenGamePiwik(
                                                                // this.props.Routertype,
                                                                // item.provider,
                                                                // item.gameId,
                                                                // item.gameName,
                                                                item
                                                            )
                                                        }}
                                                    >
                                                        <OpenGame
                                                            itemsData={{
                                                                gameName: item.gameName,
                                                                provider: item.provider,
                                                                gameId: item.gameId,
                                                                imageUrl: item.imageUrl,
                                                                gameCatCode:
                                                                    this.props
                                                                        .Routertype,
                                                                OpenGamesListPage: false,
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </React.Fragment>
                            )}

                            <div style={{ clear: "both" }} />
                            {this.state.JackpotGameList && (
                                <React.Fragment>
                                    <div className="Top">
                                        <h3 className="Title">{translate("彩池游戏")}</h3>
                                        {this.props.Routertype !== "InstantGames" && (
                                            <div
                                                onClick={() => {
                                                    Router.push(
                                                        `/games/${routerPath}/gamelist?catagory=Jackpot`
                                                    );
                                                }}
                                            >
                                                {translate("查看全部")} <Icon type="right" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="JackpotGamesContainer">
                                        <div
                                            ref={this.jackpotGames}
                                            className="JackpotGames"
                                        >
                                            {this.state.JackpotGameList.map(
                                                (item, index) => {
                                                    const gameData = {
                                                        gameName: item.gameName,
                                                        provider: item.provider,
                                                        gameId: item.gameId,
                                                        imageUrl: item.imageUrl,
                                                        gameCatCode:
                                                            this.props.Routertype,
                                                        OpenGamesListPage: false,
                                                    };
                                                    return (
                                                        <div
                                                            className="item"
                                                            key={index + "JackpotGames"}
                                                        >
                                                            <div
                                                                className="left"
                                                                onClick={() => {
                                                                    this.QuickStartGame.openGame(
                                                                        gameData
                                                                    );
                                                                    staticHeaderGtag(
                                                                        this.props
                                                                            .Routertype,
                                                                        item.provider,
                                                                        item.gameId,
                                                                        item.gameName
                                                                    );
                                                                }}
                                                            >
                                                                <OpenGame
                                                                    itemsData={gameData}
                                                                    OnRef={(
                                                                        QuickStartGame
                                                                    ) =>
                                                                    (this.QuickStartGame =
                                                                        QuickStartGame)
                                                                    }
                                                                />
                                                            </div>
                                                            <div
                                                                className="right"
                                                                onClick={() => {
                                                                    this.QuickStartGame.openGame(
                                                                        gameData
                                                                    );
                                                                }}
                                                            >
                                                                <SlotJackpotRollover />
                                                                <div className="JackpotName">
                                                                    <Tag
                                                                        provider={
                                                                            item.provider
                                                                        }
                                                                    />
                                                                    <span>
                                                                        {item.gameName}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                        {isSlot && (
                                            <div>
                                                <button
                                                    className="jackpot-slide-arrow slide-prev"
                                                    onClick={this.slide.bind(this, "prev")}
                                                />
                                                <button
                                                    className="jackpot-slide-arrow slide-next"
                                                    onClick={this.slide.bind(this, "next")}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            )}

                            {GamesProvider && this.props.Routertype !== "InstantGames" && (
                                <React.Fragment>
                                    <h3 className="Title">{translate("游戏平台")}</h3>
                                    <div className="GamesPlatform">
                                        {GamesProvider.map((item, index) => {
                                            return (
                                                <OpenGame
                                                    key={index + "List"}
                                                    customHtml={(porps) => {
                                                        return (
                                                            <div
                                                                onClick={() => {
                                                                    porps.openGame({
                                                                        gameName:
                                                                            item.providerName,
                                                                        provider:
                                                                            item.providerCode,
                                                                        gameId: 0,
                                                                        imageUrl:
                                                                            item.imageUrl,
                                                                        gameCatCode:
                                                                            this.props
                                                                                .Routertype,
                                                                        OpenGamesListPage: true, //等于-1 就是列表页面
                                                                        isProductPage: true
                                                                    });
                                                                    staticHeaderGtag(
                                                                        this.props
                                                                            .Routertype,
                                                                        item.providerCode,
                                                                        item.providerId
                                                                    );
                                                                }}
                                                                className={classNames({
                                                                    ["item"]: true,
                                                                    isNew: item.isNew,
                                                                    isHot: item.isHot,
                                                                })}
                                                                key={
                                                                    index +
                                                                    "GamesPlatform"
                                                                }
                                                            >
                                                                <img
                                                                    src={item.imageUrl}
                                                                    width="100%"
                                                                />
                                                                <p className="name">
                                                                    {item.providerName}
                                                                </p>
                                                            </div>
                                                        );
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </React.Fragment>
                            )}

                            {this.state.SubCategory && !this.dontShowGameTypeList.includes(Routertype) && (
                                <React.Fragment>
                                    <h3 className="Title">{translate("游戏类型")}</h3>
                                    <div className="GamesType">
                                        {this.state.SubCategory.map((item, index) => {
                                            if (item.categoryType != "Category") {
                                                return;
                                            }
                                            return (
                                                <div
                                                    className="item"
                                                    key={index + "GamesPlatform"}
                                                    onClick={() => {
                                                        Router.push(
                                                            `/games/${routerPath}/gamelist?catagory=${item.category}`
                                                        );
                                                        staticHeaderGtag(
                                                            this.props.Routertype,
                                                            item.categoryType,
                                                            item.id,
                                                            null,
                                                            item.category
                                                        );
                                                    }}
                                                >
                                                    <ImageWithFallback
                                                        src={item.iconNormal || "/vn/img/logo/logo.svg"}
                                                        width={46}
                                                        height={46}
                                                        alt={item.category}
                                                        fallbackSrc="/vn/img/logo/logo.svg"
                                                        local={true}
                                                    />

                                                    {item.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        GameInfo: state.game,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        getFlashProviderList: (categoryType) => {
            dispatch(getFlashProviderListAction(categoryType));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
