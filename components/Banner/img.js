import React from "react";
import Router from "next/router";
import LaunchGame from "@/Games/openGame";
import Image from "next/image";
import { getQueryVariable } from '$ACTIONS/helper'
import { connect } from "react-redux";
import pubilcData from "$DATA/game.static.js";

class Banner extends React.Component {
    constructor() {
        super();
        this.state = {
            WalletCloseBanner: false,
        };
    }
    componentDidMount() {
        this.setState({
            WalletCloseBanner: sessionStorage.getItem("WalletCloseBanner"),
        });
    }

    CloseBanner() {
        sessionStorage.setItem("WalletCloseBanner", true);
        this.setState({
            WalletCloseBanner: true,
        });
    }

    /**
     * @description: 轮播图跳转动作
     * @param {*} data
     * @return {*}
     */

    BannerAction(data) {
        let item = data.action;
        const isLogin = localStorage.getItem("access_token");
        const gmaeCategories = this.props.gameInfo?.categories ?? [];
        const gamesToFilter = this.props.gameInfo?.gamesToFilter ?? [];
        if (!item.actionId || item.actionId == 0) {
            return;
        }
        switch (item.actionId) {
            case 28:
                location.href = item.url;
                break;
            case 29:
                Router.push(`/promotions?id=${item.ID}&jumpfrom=BANNER`);
                break;
            case 30:
                Router.push("/help/sponsorship/");
                break;
            case 31:
                if(!isLogin){
                    global.goUserSign(getQueryVariable("isAgent") === "1" ? "2" : "1");
                    return;
                }
                global.showDialog({ key: 'wallet:{"type": "deposit"}' });
                break;
            case 32:
            case 34:
                let GameData = {
                    provider: item.cgmsVendorCode,
                    gameId: item.gameId,
                    type: "Game",
                };
                const codelist = gmaeCategories
                    .flatMap(category =>
                        (category.subProviders || [])
                            .filter(subProvider => subProvider.code && !gamesToFilter.includes(subProvider.code))
                            .map(subProvider => subProvider.code)
                    );

                if (codelist.includes(item.cgmsVendorCode)) {
                    const itemCode = gmaeCategories.find(category =>
                        category.subProviders.some(subProvider => subProvider.code === item.cgmsVendorCode)
                    )?.code;

                    if (itemCode) {
                        const path = pubilcData.find(data => data.providerName === itemCode)?.path;
                        Router.push(`/games/${path}/${item.cgmsVendorCode}`);
                        return;
                    }
                }

                if (
                    item.launchMode == "game_id" ||
                    item.launchMode == "web_view"
                ) {
                    this.QuickStartGame.openGame(GameData);
                    return;
                }

                break;
            case 33:
                PopUpLiveChat();
                break;
            default:
                break;
        }
    }

    render() {
        const { WalletCloseBanner } = this.state;
        const { item, type, height, width, imgType, bannerFlag, bannerList } =
            this.props;
        return (
            <React.Fragment>
                {!WalletCloseBanner && (
                    <div
                        className="BannerBox"
                        style={{ padding: !type || type == "home" ? "0" : "" }}
                    >
                        <React.Fragment>
                            {type == "home" ? (
                                <Image
                                    src={item.cmsImageUrl}
                                    width={width}
                                    height={height}
                                    onClick={() => {
                                        this.BannerAction(item);
                                        Pushgtagdata(
                                            `Home`,
                                            "Click Banner",
                                            "Home_C_Banner",
                                            "",
                                            [
                                                {customVariableKey: "Home_C_Banner_PromoName",
                                                customVariableValue: item.title}
                                            ]
                                            
                                        );
                                    }}
                                    alt={item ? item.title : ""}
                                    priority
                                />
                            ) : (
                                <React.Fragment>
                                    <Image
                                        src={item ? item.cmsImageUrl : ""}
                                        priority
                                        width={width ? width : 360}
                                        height={height ? height : 70}
                                        onClick={() => {
                                            this.BannerAction(item);
                                        }}
                                        alt={item ? item.title : ""}
                                    />
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    </div>
                )}
                <LaunchGame
                    QuickStartGame={true}
                    OnRef={(QuickStartGame) =>
                        (this.QuickStartGame = QuickStartGame)
                    }
                />
            </React.Fragment>
        );
    }
}
const mapStateToProps = function (state) {
    return {
        gameInfo: state.game,
    };
}
export default connect(mapStateToProps, null)(Banner);
