import React, { useState, useEffect } from "react";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import Banner from "@/Banner/game";
import GameInfoBox from "@/Games/Game-Page-1/GameInfo";
import GameBanner from "@/Games/Banner";
import staticdata from "$DATA/game.static";
import Router from "next/router";
import { connect } from "react-redux";
import {
    getFlashProviderListAction,
    setResetGameHideAction,
} from "$STORE/thunk/gameThunk";
import { gameLobbyPageTrackingPiwik} from "$ACTIONS/piwikData";

const Sportsbook = ({
    gameCatCode,
    GameInfo,
    getFlashProviderList,
    categories,
    providerCmsList,
    GameHideArray,
    resetGameHide
}) => {
    const [gameData, setGameCategoriesData] = useState([]);
    const [CmsProvidersList, setCmsProvidersList] = useState([]);
    const [Bannerkey, setBannerKey] = useState(0);
    const [CmsCategoryGamedata, setCmsCategoryGamedata] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ProviderData, setProviderData] = useState([]);
    const [GamesProviderList, setGamesProviderList] = useState([]);
    let CatCode =  gameCatCode;
    useEffect(() => {
        getCmsProviderInfo();
        getFlashProviderList(CatCode);
        if (!localStorage.getItem("access_token")) {
            resetGameHide();
        }
    }, [gameCatCode]);

    useEffect(() => {
        gameLobbyPageTrackingPiwik(gameCatCode)
    },[])

    const getCmsProviderInfo = () => {
        if (providerCmsList) {
            const providerCms = providerCmsList[CatCode];

            if (providerCms) {
                setCmsProvidersList(providerCms);
                if (categories) {
                    var index = providerCms.findIndex(
                        (x) => x.providerCode == Router.router.query.name
                    );
                    if (index != -1) {
                        setBannerKey(index);
                    }

                    setCmsCategoryGamedata(
                        categories.find((item) => item.code == CatCode)
                    );
                }
            }
        }
    };

    const changeset = (e) => {
        setBannerKey(e);
    };

    const GamesProvider = GameInfo && GameInfo[`provider_${CatCode}`];

    //如果含有隐藏的游戏 就需要过滤
    const filteredGamesProvider = GamesProvider.filter(
        (provider) =>
            !GameHideArray.some((code) => code === provider.providerCode)
    );

    let filteredStaticdata = staticdata.find(data => data.providerName === CatCode)
    return (
        <div className="common-distance">
            {CmsCategoryGamedata && (
                <GameBanner
                    banner={[CmsCategoryGamedata]}
                    Routertype={CatCode}
                />
            )}
            <div className="game-box-content">
                {filteredGamesProvider && filteredGamesProvider.length != 0 ? (
                    <div className="md">
                        {/* 游戏菜单幻灯片 */}
                        <Banner
                            Routertype={CatCode}
                            Gameslist={filteredGamesProvider}
                            changeset={(e) => changeset(e)}
                            bannertype={Router.router && Router.router.query}
                            CmsProvidersList={filteredGamesProvider}
                        />
                        {/* 游戏优势介绍 */}
                        <GameInfoBox
                            key={JSON.stringify(filteredGamesProvider)}
                            Gameslist={filteredGamesProvider}
                            index={Bannerkey}
                            staticdata={filteredStaticdata}
                            Routertype={CatCode}
                            Gametypedata={[CmsCategoryGamedata]}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const mapStateToProps = function (state) {
    return {
        GameInfo: state.game,
        providerCmsList: state.game.providerCmsList,
        categories: state.game.categories,
        GameHideArray: state.game.gamesToFilter,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        getFlashProviderList: (categoryType) => {
            dispatch(getFlashProviderListAction(categoryType));
        },
        resetGameHide: () => {
            dispatch(setResetGameHideAction());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sportsbook);
