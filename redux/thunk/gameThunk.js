import {
    GetCategoryList,
    GetFlashProviderList,
    GetCmsProviderList,
} from "$SERVICES/gameRequest";
import { gameActions } from "../slices/gameSlice";
import store from "./store";
const { gamesToFilter } = store.getState().game;
/**
 * @description: 获取CMS-Api（优势介绍文案信息相关） 和 Flash-Api （游戏菜单数据分类导航相关）菜单数据 合并
 * @param {*} selectedCategory
 * @param {*} stopLoading
 * @return {*}
 */
export function getGameCategoryListAction(selectedCategory, stopLoading) {
    return async function getGameListThunk(dispatch, getState) {
        dispatch(gameActions.setLoading(true));
        try {
            const GameList = await GetCategoryList();
            if (!GameList) {
                dispatch(gameActions.setGameCategoriesData([]));
                return;
            }
            dispatch(gameActions.setGameCategoriesData(GameList));

            // 存储所有 Async Thunk 的 Promise
            const promises = [];
            promises.push(GameList);
            // GameList.forEach((item) => {
            //     promises.push(
            //         dispatch(
            //             getCmsProviderListAction(item.code, item.gameCatId)
            //         )
            //     );
            // });

            // 等待所有 Async Thunk 完成并收集它们的结果

            const results = await Promise.all(promises);
            if (results) {
                const providerListData = results.reduce(
                    (acc, result, index) => {
                        const item = GameList[index];
                        acc[item.code] = result;
                        return acc;
                    },
                    {},
                );
                dispatch(gameActions.setGameProviderListData(providerListData));
                localStorage.setItem(
                    "CmsProviderArrayList",
                    JSON.stringify(providerListData),
                );
            }
            dispatch(gameActions.setLoading(false));
        } catch (e) {
            console.error("thunk getGameList error", e.message);
        } finally {
            stopLoading && stopLoading();
        }
    };
}

/**
 * @description: 获取 CMS Provider,目的是为了那CMS数据的图片和一些文本信息
 * @param {*} categoryType 游戏种类
 * @param {*} gameCatId 游戏种类ID
 * @return {*}
 */
export function getCmsProviderListAction(categoryType, gameCatId) {
    return async function getCmsProviderListThunk(dispatch, getState) {
        try {
            const CmsProviderList = await GetCmsProviderList(
                categoryType,
                gameCatId,
            );

            localStorage.setItem(
                `${categoryType}Provider`,
                JSON.stringify(CmsProviderList),
            );

            return CmsProviderList;
            // 返回结果给 Promise.all()
        } catch (e) {
            console.error(e.message);
        }
    };
}

/**
 * @description: 获取 CMS Provider,目的是为了那CMS数据的图片和一些文本信息
 * @param {*} categoryType 游戏种类
 * @param {*} gameCatId 游戏种类ID
 * @return {*}
 */
export function getCmsProviderAction(categoryType, gameCatId) {
    return async function getCmsProviderThunk(dispatch, getState) {
        try {
            const localProvider =
                JSON.parse(
                    localStorage.getItem(`${categoryType}Provider`) || "[]",
                ) || [];
            if (localProvider) {
                dispatch(
                    gameActions[`${categoryType}SetCmsProviderData`](
                        localProvider,
                    ),
                );
            } else {
                dispatch(getCmsProviderListAction(categoryType, gameCatId));
            }
        } catch (e) {
            console.error(e.message);
        }
    };
}

/**
 * @description: 获取 FlashProvider,目的是为了获得平台列表
 * @param {*} categoryType 游戏种类
 * @param {*} gameCatId 游戏种类ID
 * @return {*}
 */
export function getFlashProviderListAction(categoryType, isShowFishingGames) {
    return async function (dispatch, getState) {
        try {
            const providerData = await GetFlashProviderList(
                categoryType,
                isShowFishingGames,
            );

            const filteredData = providerData.filter(
                (provider) => !gamesToFilter.includes(provider.providerCode),
            );
            const savedProviders =
                JSON.parse(localStorage.getItem(`${categoryType}Provider`)) ||
                [];

            const updatedProviderData = filteredData.map((item) => {
                const matchingSavedProvider = savedProviders.find(
                    (savedItem) => savedItem.providerCode === item.providerCode,
                );

                if (matchingSavedProvider) {
                    return {
                        ...item,
                        imageUrl: matchingSavedProvider.providerImageUrl,
                        providerDesc: matchingSavedProvider.providerDesc,
                        providerSubtitle:
                            matchingSavedProvider.providerSubtitle,
                        providerTitle: matchingSavedProvider.providerTitle,
                        providerClass: matchingSavedProvider.providerClass,
                    };
                } else {
                    return item;
                }
            });

            dispatch(
                gameActions[`set_${categoryType}_ProviderData`](
                    updatedProviderData,
                ),
            );
        } catch (error) {
            console.error(error.message);
        }
    };
}

/**
 * @description: 设置隐藏游戏
 * @param {*} gameCatId 游戏种类
 * @return {*}
 */
export function setGameHideAction(gameCat) {
    return async function updateGameHideThunk(dispatch, getState) {
        await dispatch(gameActions.updateGameHide(gameCat));
        // await dispatch(getGameCategoryListAction());
        // await dispatch(getFlashProviderListAction("Sportsbook"));
    };
}

/**
 * @description: 重置游戏隐藏
 * @param {*} gameCatId 游戏种类
 * @return {*}
 */
export function setResetGameHideAction() {
    return function updateResetGameHideThunk(dispatch, getState) {
        dispatch(gameActions.resetData());
    };
}
