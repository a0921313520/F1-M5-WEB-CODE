import { ApiPort } from "$ACTIONS/TLCAPI";
import { get } from "$ACTIONS/TlcRequest";
import store from "../store/store";
const { gamesToFilter } = store.getState().game;
/**
 * @description:取得游戏分类导航相关資料 （加入本地存储 优化加载速度体验）
 * @return {*}
 */
export async function GetCategoryList() {
    let mergedArray = JSON.parse(localStorage.getItem("GameMergeData")) || [];
    try {
        const res = await get(ApiPort.GameCategory);
        if (res && res.isSuccess && Array.isArray(res.result)) {
            localStorage.setItem("GameMergeData", JSON.stringify(res.result));
            localStorage.setItem("AllGameID", JSON.stringify(res.result));
            mergedArray = res.result;
        }
    } catch (error) {
        console.error(error);
    }
    return mergedArray;
}

/**
 * @description: 获取Flash Provider 数据主要是用于平台列表
 * @param {*} categoryType 当前游戏的分类 类型
 * @param {*} gameCatId 当前游戏分类的 ID
 * @return {*}
 */
export async function GetFlashProviderList(
    categoryType,
    isShowFishingGames = false,
) {
    let providerList = JSON.parse(
        localStorage.getItem(`Flash_${categoryType}_Provider`) || "[]",
    );
    try {
        const res = await get(
            ApiPort.ProvidersDetails +
                `&gameType=${categoryType}&isShowFishingGames=${isShowFishingGames}`,
        );

        if (res && res.isSuccess) {
            providerList = res.result;
            localStorage.setItem(
                `Flash_${categoryType}_Provider`,
                JSON.stringify(providerList),
            );
        }
    } catch (e) {
        console.error("Error fetching provider list from API", e);
    }

    return providerList || [];
}

/**
 * @description: 获取CMS Provider 数据主要是用于显示游戏平台列表的文本介绍和平台图片配置
 * @param {*} categoryType 当前游戏的分类 类型
 * @param {*} gameCatId 当前游戏分类的 ID
 * @return {*}
 */
export async function GetCmsProviderList(categoryType, gameCatId) {
    let providerList = JSON.parse(
        localStorage.getItem(`${categoryType}Provider`) || "[]",
    );
    try {
        const res = await get(ApiPort.GameCategory);

        if (res && res.providers) {
            providerList = res.providers;
            localStorage.setItem(
                `${categoryType}Provider`,
                JSON.stringify(providerList),
            );
        }
    } catch (e) {
        console.error("Error fetching provider list from API", e);
    }

    return providerList || [];
}

/**
 * @description: 获取平台状态 新 热 敬请期待
 * @param {*} categoryType 当前游戏的分类 类型
 * @return {*}
 */
export async function GetGameNavStatus(categoryType) {
    let NavStatus = JSON.parse(
        localStorage.getItem(`${categoryType}_NavStatus`) || "{}",
    );
    try {
        const res = await get(
            ApiPort.GetGameMaintenanceStatus + `&providerCode=${categoryType}`,
        );

        if (res && res.isSuccess) {
            NavStatus = res.result;
            localStorage.setItem(
                `${categoryType}_NavStatus`,
                JSON.stringify(NavStatus),
            );
        }
    } catch (e) {
        console.error("Error fetching GetGameNavStatus list from API", e);
    }

    return NavStatus || {};
}
