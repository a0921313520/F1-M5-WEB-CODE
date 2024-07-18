import { ApiPort } from "$ACTIONS/TLCAPI";
import { get } from "$ACTIONS/TlcRequest";
import moment from "moment";
import {
    PromotionList,
    GetAppliedHistory,
    GetRebateList,
} from "../actions/cmsApi";

// 取得免費優惠資料
export async function getFreePromotions() {
    let params = {
        type: "free",
    };
    return PromotionList(params) // 返回一個 Promise
        .then((res) => {
            if (res) {
                console.log("🚀 ~ .then ~ res:", res);
                const freebetWithBonus = Array.isArray(res)
                    ? res.filter((v) => v.bonusData)
                    : [];
                return freebetWithBonus;
            }
        });
}

// 取得已申請優惠資料
export async function getAppliedHistory() {
    let params = {
        startDate: moment(new Date())
            .subtract(90, "d")
            .startOf("day")
            .utcOffset(8)
            .format("YYYY-MM-DD HH:mm:ss"),
        endDate: moment(new Date()).utcOffset(8).format("YYYY-MM-DDTHH:mm:ss"),
    };
    return GetAppliedHistory(params).then((res) => {
        if (res) {
            return res;
        }
    });
}

// 取得Promotions資料 （加入本地存储 优化加载速度体验）
export async function getPromotionList() {
    let params = {
        type: "general",
        transactionType: "",
        wallet: "",
    };
    return PromotionList(params) // 返回一個 Promise
        .then((res) => {
            if (res) {
                return res;
            }
        });
}

/**
 * @description: 获取优惠的菜单分类 （加入本地存储 优化加载速度体验）
 * @return {*}
 */
export async function getPromotionCategories() {
    let Categories =
        JSON.parse(localStorage.getItem("PromotionCategories")) || [];

    const res = await get(ApiPort.PromotionCategories);

    if (res && res.length != 0) {
        Categories = res || [];

        localStorage.setItem("PromotionCategories", JSON.stringify(Categories));
    }
    return Categories;
}

//取得反水資料
export async function getRebateData(
    startTime = moment(new Date()).format("YYYY-MM-DD"),
    endTime = moment(new Date()).format("YYYY-MM-DD"),
) {
    let params = {
        startDate: startTime,
        endDate: endTime,
    };
    return GetRebateList(params).then((res) => {
        if (res) {
            return res.result;
        }
    });
}
