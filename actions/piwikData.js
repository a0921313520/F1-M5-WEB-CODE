/**
 * home header每一项游戏 piwik
 * @param {*} gameCatCode  游戏类型
 * @param {*} providerCode  游戏code
 * @param {*} actionType 
 */
export function SetPiwikData(gameCatCode, providerCode, actionType) {
    console.log("🚀 ~ file: piwikData.js:8 ~ SetPiwikData ~ gameCatCode:", gameCatCode)
    sessionStorage.setItem("isGamePage", true);
    if (gameCatCode === "Sportsbook") {
        switch (providerCode) {
            case "SBT":
                Pushgtagdata("Sports_TopNav", "Launch BTi​", "Sports_TopNav_C_BTiSports​");
                break;
            case "IPSB":
                Pushgtagdata("Sports_TopNav", "Launch IM", "Sports_TopNav_C_IMSports");
                break;
            case "OWS":
                Pushgtagdata("Sports_TopNav", "Launch Saba", "Sports_TopNav_C_SabaSports");
                break;
            case "CMD":
                Pushgtagdata("Sports_TopNav", "Launch CMD", "Sports_TopNav_C_CMDSports");
                break;
            case "VTG":
                Pushgtagdata("Sports_TopNav", "Go to V2 Lobby", "Sports_TopNav_C_V2Sports");
                break;
            default:
                break;
        }
    }

    if (gameCatCode === "Esports") {
        switch (providerCode) {
            case "IPES":
                Pushgtagdata("ESports_TopNav​","Launch Fun88 Esports​","ESports_TopNav_C_Fun88");
                break;
            case "TFG":
                Pushgtagdata("ESports_TopNav​", "Launch TF​", "TF_Esports_TopNav");
                break;
            case "OWS":
                Pushgtagdata("ESports_TopNav​", "Launch", "OW_Esports_TopNav");
                break;
            default:
                break;
        }
    }
    if (gameCatCode === "InstantGames") {
        switch (providerCode) {
            case "SPR":
                Pushgtagdata("InstantGames_TopNav​​", "Go to Spribe Lobby​", "InstantGames_TopNav_C_Spribe​");
                break;
            case "AVIATOR":
                Pushgtagdata("InstantGames_TopNav​", "Launch Game Aviator​", "InstantGames_TopNav_C_Aviator​");
                break;

            default:
                break;
        }
    }
    if (gameCatCode === "LiveCasino") {
        switch (providerCode) {
            case "EVO":
                Pushgtagdata("LiveDealer_TopNav​", "Go to EVO Palace Lobby​", "LiveDealer_TopNav_C_EVO_Palace");
                break;
            case "GPI":
                Pushgtagdata("LiveDealer_TopNav​","Go to Fun88 Palace Lobby​","LiveDealer_TopNav_C_Fun88_Palace​");
                break;
            case "AGL":
                Pushgtagdata("LiveDealer_TopNav​", "Go to ROYAL Palace​ Lobby​​", "LiveDealer_TopNav_C_ROYAL_Palace​​");
                break;
            case "NLE":
                Pushgtagdata("LiveDealer_TopNav​","Go to HAPPY Palace​ Lobby​​","LiveDealer_TopNav​​_C_HAPPY_Palace​​​");
                break;
            // case "SXY":
            //     Pushgtagdata("LiveDealer_TopNav​", "Go to SEXY Lobby​", "LiveDealer_TopNav_C_SEXY​");
            //     break;
            case "EBT":
                Pushgtagdata("LiveDealer_TopNav​", "Go to E Palace Lobby​", "LiveDealer_TopNav_C__E_Palace​​​");
                break;
            case "WEC":
                Pushgtagdata("LiveDealer_TopNav​", "Go to WE Palace Lobby​", "LiveDealer_TopNav_C_WE​");
                break;
            case "WMC":
                Pushgtagdata("LiveDealer_TopNav​", "Go to WM Palace​ Lobby​​", "LiveDealer_TopNav​​_C_WM_Palace​​​");
                break;
            case "PP":
                Pushgtagdata("LiveDealer_TopNav​", "Go to PP Palace​ Lobby​​", "LiveDealer_TopNav_C_PP_Palace​​​​");
                break;
            case "AEC​​":
                Pushgtagdata("LiveDealer_TopNav​", "Go to S Palace​ Lobby​​​", "LiveDealer_TopNav​​_C_S_Palace​​​");
                break;
            default:
                break;
        }
    }
    if (gameCatCode === "P2P") {
        switch (providerCode) {
            case "YBP":
                Pushgtagdata("Game Nav​", "View", "ANG_P2P_TopNav(乐天使棋牌)");
                break;
            case "BLE":
                Pushgtagdata("Game Nav​", "View", "BLE_P2P_TopNav(BLE棋牌)");
                break;
            case "KYG":
                Pushgtagdata("Game Nav​", "View", "KYG_P2P_TopNav(开元棋牌)");
                break;
            case "JBP":
                Pushgtagdata("Game Nav​", "View", "JBP_P2P_TopNav(双赢棋牌)");
                break;

            default:
                break;
        }
    }
    if (gameCatCode === "Slot") {
        switch (providerCode) {
            case "MGSQF":
                Pushgtagdata("Game Nav​", "View", "MG_Slots_TopNav");
                break;
            case "PT":
                Pushgtagdata("Game Nav​", "View", "PT_Slots_TopNav");
                break;
            case "TG":
                Pushgtagdata("Game Nav​", "View", "PP_Slots_TopNav");
                break;
            case "DTG":
                Pushgtagdata("Game Nav​", "View", "DTG_Slots_TopNav");
                break;
            case "SPG":
                Pushgtagdata("Game Nav​", "View", "SG_Slots_TopNav");
                break;
            case "CW":
                Pushgtagdata("Game Nav​", "View", "CW_Slots_TopNav");
                break;
            case "BSG":
                Pushgtagdata("Game Nav​", "View", "BSG_Slots_TopNav");
                break;
            case "AG":
                Pushgtagdata("Game Nav​", "View", "AG_Slots_TopNav");
                break;
            case "PGS":
                Pushgtagdata("Game Nav", "View", "PG_Slots_TopNav");
                break;
            case "YBF":
                Pushgtagdata("Game Nav", "View", "YBF_Slots_TopNav");
                break;
            case "IMOPT":
                Pushgtagdata("Game Nav", "View", "PT_Slots_TopNav");
                break;
            case "TG_SLOT":
                Pushgtagdata("Game Nav", "View", "PP_Slots_TopNav");
                break;
            case "IMONET":
                Pushgtagdata("Game Nav", "View", "NET_Slots_TopNav");
                break;
            case "SWF":
                Pushgtagdata("Game Nav", "View", "SW_Slots_TopNav");
                break;
            case "CQG":
                Pushgtagdata("Game Nav", "View", "CQ9_Slots_TopNav");
                break;
            case "FISHING":
                Pushgtagdata("Game Nav", "View", "FISHING_Slots_TopNav");
                break;
            default:
                break;
        }
    }
    if (gameCatCode === "KenoLottery") {
        switch (providerCode) {
            case "TCG":
                Pushgtagdata("Game", "Launch", "TC_Lottery_TopNav");
                break;
            case "BOY":
                Pushgtagdata("Game", "Launch", "BY_Lottery_TopNav");
                break;
            case "VRL":
                Pushgtagdata("Game", "Launch", "VR_Lottery_TopNav");
                break;
            case "YBK":
                Pushgtagdata("Game", "Launch", "OBG_Lottery_TopNav");
                break;
            case "SGW":
                Pushgtagdata("Game", "Launch", "SGW_Lottery_TopNav(双赢彩票)");
                break;
            case "LBK":
                Pushgtagdata("Game", "Launch", "LB_Lottery_TopNav");
                break;
            default:
                break;
        }
    }
}

export function platformsGtag(gameCatCode, providerCode) {
    const TypeGame = "Game Nav";
    const dataType = "View";
    if (gameCatCode === "LiveCasino") {
        switch (providerCode) {
            case "EVO":
                Pushgtagdata(TypeGame, dataType, "EVO_LiveDealer_ProductPage");
                break;
            case "YBL":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    "YBL_LiveDealer_ProductPage(醉天堂)"
                );
                break;
            case "BGG":
                Pushgtagdata(TypeGame, dataType, "BG_LiveDealer_ProductPage");
                break;
            case "GPI":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    "GPI_LiveDealer_ProductPage(乐天堂)"
                );
                break;
            case "AG":
                Pushgtagdata(TypeGame, dataType, "AG_LiveDealer_ProductPage");
                break;
            case "GDL":
                Pushgtagdata(TypeGame, dataType, "GD_LiveDealer_ProductPage");
                break;
            case "ABT":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    "Allbet_LiveDealer_ProductPage(隆运堂)"
                );
                break;
            case "NLE":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    "N2_LiveDealer_ProductPage(双赢堂N2)"
                );
                break;
            case "SAL":
                Pushgtagdata(TypeGame, dataType, "SAG_LiveDealer_ProductPage");
                break;
            case "NLE":
                Pushgtagdata(TypeGame, dataType, "NLE_LiveDealer_ProductPage");
                break;
            case "EBT":
                Pushgtagdata(TypeGame, dataType, "eEBT_LiveDealer_ProductPage");
                break;
            case "WEC":
                Pushgtagdata(TypeGame, dataType, "WEC_LiveDealer_ProductPage");
                break;
            default:
                break;
        }
    }
    if (gameCatCode === "P2P") {
        switch (providerCode) {
            case "YBP":
                Pushgtagdata(TypeGame, dataType, "ANG_P2P_ProductPage");
                break;
            case "BLE":
                Pushgtagdata(TypeGame, dataType, "BLE_P2P_ProductPage");
                break;
            case "KYG":
                Pushgtagdata(TypeGame, dataType, "KYG_P2P_ProductPage");
                break;
            case "JBP":
                Pushgtagdata(TypeGame, dataType, "JBP_P2P_ProductPage");
                break;
            default:
                break;
        }
    }
    if (gameCatCode === "Slot") {
        switch (providerCode) {
            case "MGSQF":
                Pushgtagdata(TypeGame, dataType, "MG_Slots_ProductPage");
                break;
            case "PT":
                Pushgtagdata(TypeGame, dataType, "PT_Slots_ProductPage");
                break;
            case "TG":
                Pushgtagdata(TypeGame, dataType, "PP_Slots_ProductPage");
                break;
            case "DTG":
                Pushgtagdata(TypeGame, dataType, "DTG_Slots_ProductPage");
                break;
            case "SPG":
                Pushgtagdata(TypeGame, dataType, "SG_Slots_ProductPage");
                break;
            case "CW":
                Pushgtagdata(TypeGame, dataType, "CW_Slots_ProductPage");
                break;
            case "BSG":
                Pushgtagdata(TypeGame, dataType, "BSG_Slots_ProductPage");
                break;
            case "AG":
                Pushgtagdata(TypeGame, dataType, "AG_Slots_ProductPage");
                break;
            case "PGS":
                Pushgtagdata(TypeGame, dataType, "PG_Slots_ProductPage");
                break;
            case "YBF":
                Pushgtagdata(TypeGame, dataType, "YBF_Slots_ProductPage");
                break;
            case "IMOPT":
                Pushgtagdata(TypeGame, dataType, "PT_Slots_ProductPage");
                break;
            case "TG_SLOT":
                Pushgtagdata(TypeGame, dataType, "PP_Slots_ProductPage");
                break;
            case "IMONET":
                Pushgtagdata(TypeGame, dataType, "NET_Slots_ProductPage");
                break;
            case "SWF":
                Pushgtagdata(TypeGame, dataType, "SW_Slots_ProductPage");
                break;
            case "CQG":
                Pushgtagdata(TypeGame, dataType, "CQ9_Slots_ProductPage");
                break;
            case "FISHING":
                Pushgtagdata(TypeGame, dataType, "FISHING_Slots_ProductPage");
                break;
            default:
                break;
        }
    }
}
/**
 * 游戏列表页点击立即开始按钮 piwik
 * @param {*} gameCatCode  游戏类型code
 * @param {*} providerCode  子类code
 * @param {*} providerId    子类id
 * @param {*} gameName      子类游戏名
 * @param {*} category 
 * @returns 
 */
export function staticHeaderGtag(
    gameCatCode,
    providerCode,
    providerId,
    gameName,
    category,
    notDistinguish
) {
    console.log("🚀 ~ file: piwikData.js:356 ~ gameCatCode:", gameCatCode,providerCode)
    sessionStorage.setItem("isGamePage", true);
    let TypeGame = gameName ? "Game" : "Game Nav";
    let dataType = gameName ? "Launch" : category ? "View" : "Launch";

    if (gameCatCode === "InstantGames") {
        switch (providerCode) {
            case "SPR":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "SPR"}_InstantGame_ProductPage`
                );
                break;
            case "AVIATOR":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "Avatar"}_SPR_ProductPage`
                );
                break;

            default:
                break;
        }
    }
    if (gameCatCode === "LiveCasino") {
        switch (providerCode) {
            case "EVO":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "EVO"}_LiveDealer_ProductPage`
                );
                break;
            case "YBL":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "YBL"
                    }_LiveDealer_ProductPage(醉天堂)`
                );
                break;
            case "BGG":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "BG"}_LiveDealer_ProductPage`
                );
                break;
            case "GPI":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "GPI"
                    }_LiveDealer_ProductPage(乐天堂)`
                );
                break;
            case "AG":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "AG"}_LiveDealer_ProductPage`
                );
                break;
            case "GDL":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "GD"}_LiveDealer_ProductPage`
                );
                break;
            case "ABT":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "Allbet"
                    }_LiveDealer_ProductPage(隆运堂)`
                );
                break;
            case "NLE":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "N2"
                    }_LiveDealer_ProductPage(双赢堂N2)`
                );
                break;
            case "SAL":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "SAG"}_LiveDealer_ProductPage`
                );
                break;
            case "NLE":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "NLE"}_LiveDealer_ProductPage`
                );
                break;
            case "EBT":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "eEBT"}_LiveDealer_ProductPage`
                );
                break;
            case "WEC":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "WEC"}_LiveDealer_ProductPage`
                );
                break;
            default:
                break;
        }
    }
    if (gameCatCode === "P2P") {
        switch (providerCode) {
            case "YBP":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "ANG"}_P2P_ProductPage(乐天使棋牌)`
                );
                break;
            case "BLE":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "BLE"}_P2P_ProductPage(BLE棋牌)`
                );
                break;
            case "KYG":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "KYG"}_P2P_ProductPage(开元棋牌)`
                );
                break;
            case "JBP":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "JBP"}_P2P_ProductPage(双赢棋牌)`
                );
                break;
            case "Category":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${category ? category : "Category"}_P2P_ProductPage`
                );
                break;
            default:
                break;
        }
    }
    if (gameCatCode === "Slot") {
        switch (providerCode) {
            case "MGSQF":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "MG"}_Slots_ProductPage`
                );
                break;
            case "PT":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "PT"}_Slots_ProductPage`
                );
                break;
            case "TG":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "PP"}_Slots_ProductPage`
                );
                break;
            case "DTG":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "DTG"}_Slots_ProductPage`
                );
                break;
            case "SPG":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "SG"}_Slots_ProductPage`
                );
                break;
            case "CW":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "CW"}_Slots_ProductPage`
                );
                break;
            case "BSG":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "BSG"}_Slots_ProductPage`
                );
                break;
            case "AG":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "AG"}_Slots_ProductPage`
                );
                break;
            case "PGS":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "PG"}_Slots_ProductPage`
                );
                break;
            case "YBF":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "YBF"}_Slots_ProductPage`
                );
                break;

            case "IMOPT":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "PT"}_Slots_ProductPage`
                );
                break;
            case "TG_SLOT":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "PP"}_Slots_ProductPage`
                );
                break;
            case "IMONET":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "NET"}_Slots_ProductPage`
                );
                break;
            case "SWF":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "SW"}_Slots_ProductPage`
                );
                break;
            case "CQG":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "CQ9"}_Slots_ProductPage`
                );
                break;
            case "FISHING":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${gameName ? gameName : "FISHING"}_Slots_ProductPage`
                );
                break;
            case "Category":
                Pushgtagdata(
                    TypeGame,
                    dataType,
                    `${category ? category : "Category"}_Slots_ProductPage`
                );
                break;
            default:
                break;
        }
    }

    if (gameCatCode === "Sportsbook") {
        Pushgtagdata()
    }

    if (gameCatCode === "Esports") {
        switch (providerCode) {
            case "IPES":
                Pushgtagdata(
                    "Game​",
                    "Launch",
                    "IM_Esports_ProductPage(乐天堂电竞)"
                );
                break;
            case "TFG":
                Pushgtagdata("Game​", "Launch", "TF_Esports_ProductPage");
                break;
            case "OWS":
                Pushgtagdata("Game​", "Launch", "OW_Esports_ProductPage");
                break;
            default:
                break;
        }
    }

    if (gameCatCode === "Lottery") {
        switch (providerCode) {
            case "TCG":
                Pushgtagdata("Game", "Launch", "TC_Lottery_ProductPage");
                break;
            case "BOY":
                Pushgtagdata("Game", "Launch", "BY_Lottery_ProductPage");
                break;
            case "VRL":
                Pushgtagdata("Game", "Launch", "VR_Lottery_ProductPage");
                break;
            case "YBK":
                Pushgtagdata(
                    "Game",
                    "Launch",
                    "OBG_Lottery_ProductPage(醉心彩票)"
                );
                break;
            case "SGW":
                Pushgtagdata(
                    "Game",
                    "Launch",
                    "SGW_Lottery_ProductPage(双赢彩票)"
                );
                break;
            case "LBK":
                Pushgtagdata(
                    "Game",
                    "Launch",
                    "LB_Lottery_ProductPage(LB 快乐彩)"
                );
                break;
            default:
                break;
        }
    }
}

//Header 点击菜单中的每个游戏的 piwik
export const HeaderGameNavPiwik = (code) => {
    switch (code) {
        case "Sportsbook":
            Pushgtagdata("Home_TopNav", "Go to Sports Listing", "Home_TopNav_C_Sports")
            break;
        case "ESports":
            Pushgtagdata("Home_TopNav", "Go to Esports Listing", "Home_TopNav_C_Esports")
            break;
        case "InstantGames":
            Pushgtagdata("Home_TopNav", "Go to Instant Game Listing", "Home_TopNav_C_InstantGames")
            break;
        case "LiveCasino":
            Pushgtagdata("Home_TopNav", "Go to LD Listing", "Home_TopNav_C_LiveDealer")
            break;
        case "Slot":
            Pushgtagdata("Home_TopNav", "Go to Slot/Fishing Listing", "Home_TopNav_C_SlotFishing")
            break;
        case "P2P":
            Pushgtagdata("Home_TopNav", "Go to P2P Listing", "Home_TopNav_C_P2P")
            break;
        case "KenoLottery":
            Pushgtagdata("Home_TopNav", "Go to Lottery Listing", "Home_TopNav_C_Lottery")
            break;
        case "promotions":
            Pushgtagdata("Home_TopNav", "Go to Promotion", "Home_TopNav_C_Promotion")
            break;
        case "KingsClub":
            Pushgtagdata("Home_TopNav", "Go to Rewards", "Home_TopNav_C_Rewards")
            break;
        case "Alliance":
            Pushgtagdata("Home_TopNav", "Go to Affiliate Page", "Home_TopNav_C_Affiliate")
            break;
        default:
            break;
    }
}


//Header 点击菜单中各个游戏的more按钮 piwik
export const HeaderGameNavMoreBtnPiwik = (code) => {
    switch (code) {
        case "Sportsbook":
            Pushgtagdata("Home_TopNav", "Go to Sports Listing", "Sports_TopNav_C_Listing")
            break;
        case "ESports":
            Pushgtagdata("Esports_TopNav", "Go to Esports Listing", "Esports_TopNav_C_Listing")
            break;
        case "InstantGames":
            Pushgtagdata("InstantGames_TopNav", "Go to InstantGames Listing", "InstantGames_TopNav_C_Listing")
            break;
        case "LiveCasino":
            Pushgtagdata("LiveDealer_TopNav", "Go to LiveDealer Listing", "LiveDealer_TopNav_C_Listing​")
            break;
        case "Slot":
            Pushgtagdata("SlotFishing_TopNav", "Go to Slots Listing", "SlotFishing_TopNav_C_Listing​")
            break;
        case "P2P":
            Pushgtagdata("P2P_TopNav", "Go to P2P Listing​​", "P2P_TopNav_C_Listing​")
            break;
        case "KenoLottery":
            Pushgtagdata("Lottery_TopNav", "Go to Lottery Listing", "Lottery_TopNav_C_Listing")
            break;
        default:
            break;
    }
}

/**
 * 游戏大厅内选择左边的游戏类型按钮 piwik
 * @param {*} providerCode  游戏
 * @param {*} gameType 筛选类型
 */
export const gameLobbyFilterTypeDataPiwik =(providerCode,gameType) => {
    console.log("🚀 ~ file: piwikData.js:779 ~ gameLobbyFilterTypeDataPiwik ~ providerCode:", providerCode,",",gameType)
    switch (providerCode) {
        case "Sportsbook":
            Pushgtagdata(
                "V2Sports_Lobby", 
                "Filter Game​", 
                "V2Sports_Lobby_C_GameType​",
                "",
                [
                    {customVariableKey: "V2Sports_Lobby_C_GameType​",
                    customVariableValue: gameType}
                ]
            )
            break;
        case "InstantGames":
            Pushgtagdata(
                "InstantGame_Lobby",
                "Filter Vendor​",
                `InstantGame_Lobby_C_Vendor​`,
                "",
                [
                    {customVariableKey: `InstantGame_Lobby_C_VendorName​​`},
                    {customVariableValue: gameType},
                ]
            );
            break;
        default:
            break
    }
}

/**
 * 游戏大厅内立即游戏按钮 piwik
 * @param {*} gameCatCode 
 * @param {*} providerCode 
 */
export const gameLobbyOpenGamePiwik =(gameCatCode, providerCode)=> {
    console.log("🚀 ~ file: piwikData.js:805 ~ gameLobbyOpenGamePiwik ~ gameCatCode, providerCode:", gameCatCode, providerCode)

    switch(gameCatCode){
        case "Sportsbook":
            Pushgtagdata("SportsListing​",`Launch ${providerCode} Game​`, `SportsListing_C_Enter_${providerCode}_Game​`)
            break;
        case "ESports":
            Pushgtagdata("ESports_Listing​",`Launch ${providerCode} Game​`, `ESports_Listing_C_Enter_${providerCode}_Game​`)
            break;
        default:
            break
    }
}

/**
 * 游戏列表页立即游戏按钮 piwik
 * @param {*} provider 
 */
export const gameListOpenGamePiwik =(item) => {
    console.log("🚀 ~ file: piwikData.js:826 ~ gameListOpenGamePiwik ~ item:", item)
    switch(item?.gameType){
        case "Sportsbook":
            Pushgtagdata(
                "V2Sports_Lobby",
                "Launch Game",
                `V2Sports_Lobby_C_Game​`,
                "",
                [
                    {customVariableKey: `V2Sports_Lobby_C_${item.provider}_GameName`},
                    {customVariableValue: item.gameName},
                ]
            );
            break;
        case "Instant Games":
            Pushgtagdata(
                "InstantGame_Lobby",
                "Launch Game" ,
                `InstantGame_Lobby_C_${item.provider}_Game​`,
                "",
                [
                    {customVariableKey: `InstantGame_Listing_C_${item.provider}_GameName`},
                    {customVariableValue: item.gameName},
                ]
            );
            break; 
        default:
            break;
    }
}

/**
 * 游戏列表页面 title 和 url 的piwik
 * @param {*} item 
 */
export const gameListPageTrackingPiwik =(item)=> {
    switch (item){
        case "LiveCasino":
            global.Pushgtagpiwikurl && global.Pushgtagpiwikurl(`live_dealer_listing​​`,`${item} Listing​​`);
            break;
        case "InstantGames":
            global.Pushgtagpiwikurl && global.Pushgtagpiwikurl(`${item.toLowerCase()}_lobby​`,`${item} Lobby​​​​`);
            break;
        case "ESports":
            global.Pushgtagpiwikurl && global.Pushgtagpiwikurl(`esports​_listing​​​`,`ESports Listing​​​`);
            break;
        case "Sportsbook":
            global.Pushgtagpiwikurl && global.Pushgtagpiwikurl(`sports_​listing​`,`Sports Listing​​​`);
            break;
        default:
            break;
    }
}

/**
 * 游戏大厅页面 title 和 url 的piwik
 * esports 没有大厅页面
 * sport 只有v2体育有大厅页面
 * @param {*} item 
 */
 export const gameLobbyPageTrackingPiwik =(item)=> {
    console.log("🚀 ~ file: piwikData.js:866 ~ gameLobbyPageTrackingPiwik ~ item:", item)
    switch (item){
        case "LiveCasino":
            global.Pushgtagpiwikurl && global.Pushgtagpiwikurl(`livedealer_lobby​​`,`LiveDealer​ Lobby​​`);
            break;
        case "InstantGames":
            global.Pushgtagpiwikurl && global.Pushgtagpiwikurl(`${item.toLowerCase()}_lobby​​`,`${item} Lobby​​`);
            break;
        case "Sportsbook":
            global.Pushgtagpiwikurl && global.Pushgtagpiwikurl(`v2_sports_lobby​​​`,`V2 Sports Lobby​​​`);
            break;
        default:
            break;
    }
}


/**
 * 游戏列表页点击more piwik
 */
 export const gameListPageCheckMorePiwik =(path)=> {
    switch (path){
        case "LiveCasino":
            Pushgtagdata(
                "LiveDealer_Listing​",
                "Go to LiveDealer Lobby​" ,
                `LiveDealer_Listing_C_More​`
            );
            break; 
        default:
            break;
    }
}