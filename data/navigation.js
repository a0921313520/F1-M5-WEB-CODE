//header 的導覽列
export const NAV_ITEMS = [
    "divider",
    { text: "account", link: "/member", img: "/img/icon/icon_profile02.svg" },
    {
        text: "deposit",
        link: "/wallet/deposit",
        img: "/img/icon/icon_deposit.svg",
    },
    {
        text: "transfer",
        link: "/wallet/withdraw",
        img: "/img/icon/icon_transfer.svg",
    },
    "divider",
    { text: "promotion", link: "/promotions", img: "/img/icon/icon_promo.svg" },
    { text: "sports", link: "/sports", img: "/img/icon/icon_sport02.svg" },
    {
        text: "exchange",
        link: "/sports/exchange",
        img: "/img/icon/icon_exchange02.svg",
    },
    {
        text: "live-casino",
        link: "/live-casino",
        img: "/img/icon/icon_live_casino02.svg",
    },
    {
        text: "instant-games",
        link: "/instant-games",
        img: "/img/icon/icon_instant_game02.svg",
    },
    { text: "tv-games", link: "/tv-games", img: "/img/icon/icon_TV02.svg" },
    {
        text: "card-games",
        link: "/card-games",
        img: "/img/icon/icon_card_games02.svg",
    },
    {
        text: "virtual",
        link: "/sports/virtual",
        img: "/img/icon/icon_virtual02.svg",
    },
    { text: "slot", link: "/slots", img: "/img/icon/icon_slot02.svg" },
    "divider",
    {
        text: "sponsorships",
        link: "/sponsor",
        img: "/img/icon/icon_sponsorships.svg",
    },
    {
        text: "refer-a-friend",
        link: "/referral",
        img: "/img/icon/icon_RAF.svg",
        isNew: true,
    },
    { text: "vip", link: "/vip", img: "/img/icon/icon_VIP02.svg" },
    {
        text: "rewards",
        link: "/rewards",
        img: "/img/icon/icon_rewards02.svg",
        isUpdated: true,
    },
    {
        text: "t20-world-cup",
        link: "/sports/cricket/t20",
        img: "/img/icon/icon_t20_dark1.svg",
    },
    { text: "support", link: "/support", img: "/img/icon/icon_CS02.svg" },
    {
        text: "app-android/ios",
        link: "/mobile-app",
        img: "/img/icon/icon_app_download.svg",
    },
    {
        text: "affiliate",
        link: "/",
        img: "/img/icon/icon_affiliate.svg",
        isExternal: true,
    },
    { text: "faq", link: "/help", img: "/img/icon/icon_FAQ.svg" },
    { text: "blog", link: "/faq", img: "/img/icon/icon_blog.svg" },
];

//底部的導覽列
export const BOTTOM_ITEMS = [
    {
        text: "home",
        link: "/",
        img: "/img/icon/icon_home.svg",
        activeImg: "/img/icon/icon_home_active.svg",
    },
    {
        text: "sports",
        link: "/sports",
        img: "/img/icon/icon_sport01.svg",
        activeImg: "/img/icon/icon_sport01_active.svg",
    },
    {
        text: "evolution",
        link: "/live-casino/evolution",
        img: "/img/icon/icon_live_casino.svg",
        activeImg: "/img/icon/icon_live_casino_active.svg",
    },
    {
        text: "my-bets",
        link: "/my-bets",
        img: "/img/icon/icon_my_bets.svg",
        activeImg: "/img/icon/icon_my_bets_active.svg",
    },
    "menu",
];

//header 的遊戲導覽列
export const HEADER_ITEMS = [
    { text: "Home", link: "/", img: "/img/header/home.svg" },
    { text: "Sports", link: "/sports", img: "/img/header/sport.svg" },
    {
        text: "Exchange",
        link: "/sports/exchange",
        img: "/img/header/exchange.svg",
    },
    {
        text: "Evolution",
        link: "/live-casino/evolution",
        img: "/img/header/live-casino-evolution.svg",
    },
    {
        text: "Instant Games",
        link: "/instant-games",
        img: "/img/header/instant-game.svg",
    },
    {
        text: "TV Games",
        link: "/tv-games",
        img: "/img/header/TV.svg",
    },
    {
        text: "Card Games",
        link: "/card-games",
        img: "/img/header/card-games.svg",
    },
    {
        text: "Virtual",
        link: "/virtual",
        img: "/img/header/virtual.svg",
    },
    { text: "Slots", link: "/slots", img: "/img/header/slot.svg" },
];
