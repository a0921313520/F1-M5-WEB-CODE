/*
 * @Author: Alan
 * @Date: 2023-06-01 21:58:05
 * @LastEditors: Alan
 * @LastEditTime: 2023-07-01 08:23:13
 * @Description: 在 Redux store 中定义了一个名为 game 的 slice，用于游戏数据相关处理。
 * @FilePath: /F1-M1-WEB-Code/store/gameSlice.js
 */
import { createSlice } from "@reduxjs/toolkit";
const isWindowObject = typeof window === "object";
const gameSlice = createSlice({
    name: "game",
    initialState: {
        //需要隐藏过滤的游戏
        gamesToFilter: ["SB2", "YBS", "IPSB-Virtual"],
        isLoading: false,
        topTabIndex: "1",
        //页面顶部的导航菜单数据
        categories: isWindowObject
            ? JSON.parse(localStorage.getItem("GameMergeData") || "[]")
            : [],
        //游戏产品页面相关 【平台】分类列表数据的图片 CMS游戏供应商类别数据(主要用于平台列表的图片，介绍文本信息) /vi-vn/api/v1/web/game/provider/123
        providerCmsList: isWindowObject
            ? JSON.parse(localStorage.getItem("CmsProviderArrayList") || "[]")
            : {},

        //游戏产品页面 【平台】分类列表数据 /api/Games/Providers/Details
        provider_Slot: [],
        provider_LiveCasino: [],
        provider_ESports: [],
        provider_P2P: [],
        provider_InstantGames: [],
        provider_KenoLottery: [],
        provider_Sportsbook: [],
        willOpenGameParams: {}, //要打开游戏的数据
    },
    reducers: {
        updateGameHide(state, action) {
            const gameToAdd = action.payload;
            if (!state.gamesToFilter.includes(gameToAdd)) {
                const updatedGamesToFilter = [
                    ...state.gamesToFilter,
                    gameToAdd,
                ];

                state.gamesToFilter = updatedGamesToFilter;
                console.log("state.gamesToFilter", state.gamesToFilter);
            }
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        setGameCategoriesData(state, action) {
            state.categories = action.payload;
        },
        setGameProviderListData(state, action) {
            state.providerCmsList = action.payload;
        },
        set_Slot_ProviderData(state, action) {
            state.provider_Slot = action.payload;
        },
        set_LiveCasino_ProviderData(state, action) {
            state.provider_LiveCasino = action.payload;
        },
        set_ESports_ProviderData(state, action) {
            state.provider_ESports = action.payload;
        },
        set_P2P_ProviderData(state, action) {
            state.provider_P2P = action.payload;
        },
        set_InstantGames_ProviderData(state, action) {
            state.provider_InstantGames = action.payload;
        },
        set_KenoLottery_ProviderData(state, action) {
            state.provider_KenoLottery = action.payload;
        },
        set_Sportsbook_ProviderData(state, action) {
            state.provider_Sportsbook = action.payload;
        },
        setWillOpenGameParams(state, action) {
            state.willOpenGameParams = action.payload;
        },
        resetData(state) {
            state.gamesToFilter = ["SB2", "YBS", "IPSB-Virtual"];
            state.willOpenGameParams = {};
        },
    },
});

export default gameSlice;

export const gameActions = gameSlice.actions;
