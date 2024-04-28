// 表单公用间距
export const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
export const tailFormItemLayout = {
    wrapperCol: { span: 24 },
};

// 新手导引Cookie保存时间长度
export const LEARN_TIME = 9999999999;

// 退出需要清除Cookie的key值
// 不需要清空的Cookie的key值 ["learnStep"]
export const CLEAR_COOKIE_KEY = [
    "personMessage",
    "systemMessage",
    "emailTime",
    "phoneTime",
    "dateTime",
    "ALBtype",
    "isAlbSecond",
    "isAlbThird",
    "isThird",
    "isWCThird",
    "withdrawLastTime",
];

export const isWindowOpenGame = ["IMOPT", "SGW", "NLE", "LBK","SLC"]; //不支持iframe的游戏放进去
export const isCookieNoOpenGame = ["MGSQF", "BGG", "AGL"]; //不支持第三方cookie
export const SportsbookGameCatCode = 'Sportsbook';
export const ESportsGameCatCode = 'ESports';
export const InstantGamesGameCatCode = 'InstantGames';
export const LiveCasinoGameCatCode = 'LiveCasino';
export const P2PGameCatCode = 'P2P';
export const SlotGameCatCode = 'Slot';
export const KenoLotteryGameCatCode = 'KenoLottery';