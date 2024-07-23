import {
    getAppliedHistory,
    getPromotionList,
    getFreePromotions,
    getRebateData,
} from "../../$SERVICESpromotionRequest";
import { promotionActions } from "../slices/promotionSlice";

export function updateBonusPromotionHistoryAction(promoId) {
    console.log("thunk2");
    return async function updatePromotionHistoryThunk(dispatch, getState) {
        try {
            console.log("thunk", 123213);
            const appliedHistories = await getAppliedHistory();
            console.log("thunk", appliedHistories);
            const justCreatedHistoryIndex =
                getState().promotion.promotions.findIndex(
                    (history) => history.promotionId === promoId,
                );
            const justCreatedHistory = appliedHistories.find(
                (history) => history.promotionId === promoId,
            );

            dispatch(
                promotionActions.updatePromotionHistroy({
                    index: justCreatedHistoryIndex,
                    history: justCreatedHistory,
                }),
            );
        } catch (e) {
            console.error(e.message);
        }
    };
}

export function getPromotionListAction() {
    return async function getPromotionListThunk(dispatch, getState) {
        try {
            const promotions = await getPromotionList();
            dispatch(promotionActions.setPromotions(promotions));
        } catch (e) {
            console.error(e.message);
        }
    };
}

export function getFreePromotionsAction() {
    return async function getFreePromotionsThunk(dispatch, getState) {
        try {
            const freePromotions = await getFreePromotions();
            console.log("thunk free", freePromotions);
            dispatch(promotionActions.setFreePromotions(freePromotions));
        } catch (e) {
            console.error(e.message);
        }
    };
}

export function getAppliedHistoryAction(stopLoading) {
    return async function getAppliedHistoryThunk(dispatch, getState) {
        try {
            const appliedHistories = await getAppliedHistory();
            console.log("thunk appliedHistories", appliedHistories);
            dispatch(promotionActions.setAppliedPromotions(appliedHistories));
        } catch (e) {
            console.error("thunk getAppliedHistory error", e.message);
        } finally {
            stopLoading && stopLoading();
        }
    };
}

export function getRebateListAction(
    startDate,
    endDate,
    selectedCategory = "All",
    stopLoading,
) {
    console.log("thunk11", stopLoading);
    return async function getRebateListThunk(dispatch, getState) {
        try {
            const rebateList = await getRebateData(startDate, endDate);

            if (!rebateList) {
                dispatch(promotionActions.setRebateData({ data: [] }));
                return;
            }
            dispatch(
                promotionActions.setRebateData({
                    data: rebateList.filter((item) => !!item.promotionCategory),
                    selectedCategory,
                }),
            );
        } catch (e) {
            console.error("thunk getRebateList error", e.message);
        } finally {
            stopLoading && stopLoading();
        }
    };
}

export function getAllPromotionRelatedDataAction() {
    return async function getAllPromotionRelatedDataThunk(dispatch, getState) {
        dispatch(getPromotionListAction());
        dispatch(getAppliedHistoryAction());
        //dispatch(getFreePromotionsAction());
        if (localStorage.getItem("access_token")) {
            dispatch(getRebateListAction());
        }
    };
}

export function changeTabAction(i) {
    return async function changeTabActionThunk(dispatch, getState) {
        dispatch(promotionActions.changeTab(i));
        switch (i) {
            case "1":
                dispatch(getPromotionListAction());
                break;
            case "2":
                dispatch(getAppliedHistoryAction());
                break;
            case "3":
                dispatch(getRebateListAction());
                break;
            default:
                return;
        }
    };
}
