import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import { translate } from "$ACTIONS/Translate";

const pubilcData = [
    {
        gameName: "体育竞技",
        providerName: "Sportsbook",
        color: [
            "#1C8EFF",
            "#00A7FA",
            "#2979FF",
        ] /* 0 按钮色 字体色 1，2 顶部背景图渐变色 */,
        egameNames: "FUN88 SPORT BETTING",
        egameName: "TLC SPORT BETTING",
        topbanner: "/vn/img/game/sport/products-sport.png",
        centerbanner: "/vn/img/game/sport/sport-bg-3.png",
        centertxt: "",
        iconleft: "/vn/img/game/icon-01.png",
        iconright: "/vn/img/game/icon-02.png",
        howtoplaytitle: [],
        howtoplay: [],
        bonus: "12",
        howtoplayid: CMSOBJ[HostConfig.CMS_ID][14],
        gameList: [
            {
                providerName: translate("IM 体育"),
                description: translate(
                    "IM Sports 现代投注平台，在线中心更新比赛信息和统计数据。"
                ),
                iconLeftText: translate("最稳固的品质"),
                iconBonus: "1",
                iconBonusText: translate("业界最高返水"),
                iconRightText: translate("独家授权信用"),
                providerCode: "IPSB",
            },
            {
                providerName: translate("沙巴体育"),
                description: translate(
                    "SABA Sports 亚洲第一博彩平台。 经营超过20年。 威严而稳定。"
                ),
                iconLeftText: translate("最稳固的品质"),
                iconBonus: "1",
                iconBonusText: translate("业界最高返水"),
                iconRightText: translate("独家授权信用"),
                providerCode: "OWS",
            },
            {
                providerName: translate("CMD体育"),
                description: translate(
                    "CMD体育具有特色的可靠投注平台自动投注支付和实时比赛统计数据。"
                ),
                iconLeftText: translate("最稳固的品质"),
                iconBonus: "1",
                iconBonusText: translate("业界最高返水"),
                iconRightText: translate("独家授权信用"),
                providerCode: "CML",
            },
            {
                providerName: translate("BTI体育"),
                description: translate(
                    "BTi Sports 亚洲领先的投注平台。 投注类型多样，赔率诱人。"
                ),
                iconLeftText: translate("最稳固的品质"),
                iconBonus: "1",
                iconBonusText: translate("业界最高返水"),
                iconRightText: translate("独家授权信用"),
                providerCode: "SBT",
            },
            {
                providerName: translate("V2体育"),
                description: translate(
                    "Sports V2 先进的虚拟投注技术。 随时玩就有机会赢取巨额奖金！"
                ),
                iconLeftText: translate("最稳固的品质"),
                iconBonus: "1",
                iconBonusText: translate("业界最高返水"),
                iconRightText: translate("独家授权信用"),
                providerCode: "VTG",
            },
        ],
        path:"the-thao"
    },
    {
        gameName: "电子竞技",
        providerName: "ESports",
        color: ["#00C853", "#00C853", "#66E67F"],
        egameNames: "eSPORT BETTING",
        egameName: "TLC ESPORT BETTING",
        topbanner: "/vn/img/game/esport/top.png",
        centerbanner: "/vn/img/game/esport/center.png",
        centertxt: "",
        iconleft: "/vn/img/game/icon-01.png",
        iconright: "/vn/img/game/icon-02.png",
        howtoplaytitle: [],
        howtoplay: [],
        bonus: "12",
        howtoplayid: CMSOBJ[HostConfig.CMS_ID][15],
        gameList: [
            {
                providerName: translate("TF 电竞"),
                description: translate(
                    "TF E-Sports 提供多种投注类型和诱人的赔率。 清晰在线电视，顶级娱乐。"
                ),
                iconLeftText: translate("最稳固的品质"),
                iconBonus: "1",
                iconBonusText: translate("业界最高返水"),
                iconRightText: translate("独家授权信用"),
                providerCode: "TFG",
            },
            {
                providerName: translate("FUN88 电竞"),
                description: translate(
                    "FUN88 电子竞技 FUN88 电子竞技提供特殊、独特的投注，赔率颇具吸引力。"
                ),
                iconLeftText: translate("最稳固的品质"),
                iconBonus: "1",
                iconBonusText: translate("业界最高返水"),
                iconRightText: translate("独家授权信用"),
                providerCode: "IPES",
            },
        ],
        path:"esports"
    },
    {
        gameName: "真人娱乐",
        providerName: "LiveCasino",
        color: ["#E91E63", "#FF679B", "#E91E63"],
        egameNames: "LIVE CASINO",
        egameName: "ASIA GAMING LIVE CASINO",
        topbanner: "/vn/img/game/casino/products-casino.png",
        centerbanner: "/vn/img/game/casino/live-evo-bg.png",
        centertxt: "",
        iconleft: "/vn/img/game/icon-01.png",
        iconright: "/vn/img/game/icon-02.png",
        howtoplaytitle: [],
        /* 玩法内容 */
        howtoplay: [],
        bonus: "12" /* 返水 */,
        howtoplayid: CMSOBJ[HostConfig.CMS_ID][13],
        path:"live-casino"
    },
    {
        gameName: "棋牌游戏",
        providerName: "P2P",
        color: ["#99683D", "#99683D", "#C9952E"],
        egameNames: "P2P GAMES",
        egameName: "KAIYUAN P2P GAMES",
        topbanner: "/vn/img/game/chess/top.png",
        centerbanner: "/vn/img/game/chess/center.png",
        centertxt: "",
        iconleft: "/vn/img/game/icon-01.png",
        iconright: "/vn/img/game/icon-02.png",
        howtoplaytitle: [],
        howtoplay: [],
        bonus: "12",
        howtoplayid: CMSOBJ[HostConfig.CMS_ID][3],
        path:"P2P"
    },
    {
        gameName: "彩票游戏",
        providerName: "KenoLottery",
        color: ["#A633CC", "#A633CC", "#D56AEB"],
        egameNames: "LOTTERY",
        egameName: "VR LOTTERY",
        topbanner: "/vn/img/game/lottery/top.png",
        centerbanner: "/vn/img/game/lottery/center_TC.png",
        centertxt: "",
        iconleft: "/vn/img/game/icon-01.png",
        iconright: "/vn/img/game/icon-02.png",
        howtoplaytitle: [],
        howtoplay: [],
        bonus: "12",
        howtoplayid: CMSOBJ[HostConfig.CMS_ID][1],
        path:"xo-so"
    },
    {
        gameName: "电子游戏",
        providerName: "Slot",
        color: ["#673AB7", "#FF679B", "#967ACC"],
        egameNames: "SLOT GAMES",
        egameName: "FISHING KING 2",
        topbanner: "/vn/img/game/slot/top.png",
        centerbanner: "/vn/img/game/slot/center.png",
        centertxt: "",
        iconleft: "/vn/img/game/icon-01.png",
        iconright: "/vn/img/game/icon-02.png",
        howtoplaytitle: [],
        howtoplay: [],
        bonus: "12",
        howtoplayid: CMSOBJ[HostConfig.CMS_ID][2],
        path:"slots"
    },
    {
        providerName: "InstantGames",
        gameName: "小游戏",
        path:"arcade-games",
    },
];

export default pubilcData;
