import { createSlice } from "@reduxjs/toolkit";

const promotionSlice = createSlice({
    name: "promotion",
    initialState: {
        topTabIndex: "1",
        categories: [],
        promotions: [],
        selectedBonus: null,
        appliedPromotions: null,
        freePromotions: [],
        rebateData: null,
        rebateFilteredTotalAmount: null,
        ValidAppliedList: null,
        inValidAppliedList: null,
        initialPromotionItemDetail: {}
    },
    reducers: {
        changeTab(state, action) {
            state.topTabIndex = action.payload;
        },
        setSelectedBonus(state, action) {
            state.selectedBonus = action.payload;
        },
        setCategories(state, action) {
            state.categories = action.payload;
        },
        setPromotions(state, action) {
            state.promotions = action.payload;
        },
        updatePromotionHistroy(state, action) {
            console.log("update history", state.promotions, action);
            state.promotions[action.payload.index].history =
                action.payload.history;
        },
        setAppliedPromotions(state, action) {
            if (!action.payload) {
                state.appliedPromotions = [];
                state.ValidAppliedList = [];
                state.inValidAppliedList = [];
                return;
            }
            const ValidAppliedList = action.payload.filter(
                (item) =>
                    (item.promotionType === "Manual" &&
                        item.status !== "Approved" &&
                        item.status !== "Not Eligible") ||
                    ((item.promotionType === "Bonus" || !item.promotionType) &&
                        item.status !== "Expired" &&
                        item.status !== "Served" &&
                        item.status !== "Canceled" &&
                        item.status !== "Force to served")
            );

            const inValidAppliedList = action.payload.filter(
                (item) =>
                    (item.promotionType === "Manual" &&
                        (item.status === "Approved" ||
                            item.status === "Not Eligible")) ||
                    ((item.promotionType === "Bonus" || !item.promotionType) &&
                        item.status === "Expired") ||
                    item.status === "Served" ||
                    item.status === "Canceled" ||
                    item.status === "Force to served"
            );

            state.appliedPromotions = action.payload;
            state.ValidAppliedList = ValidAppliedList;
            state.inValidAppliedList = inValidAppliedList;
            localStorage.setItem(
                "ValidAppliedList",
                JSON.stringify(ValidAppliedList)
            );
            localStorage.setItem(
                "inValidAppliedList",
                JSON.stringify(inValidAppliedList)
            );
        },

        setFreePromotions(state, action) {
            state.freePromotions = action.payload;
        },
        setRebateData(state, action) {
            console.log("action.payload", action.payload);
            state.rebateData = action.payload.data;
            if (action.payload.data.length) {
                let total = 0;
                if (action.payload.selectedCategory === "All") {
                    total = action.payload.data.reduce((acc, item) => {
                        acc += item.totalGivenAmount;
                        return acc;
                    }, 0);
                } else {
                    total = action.payload.data
                        .filter(
                            (item) =>
                                item.promotionCategory ===
                                action.payload.selectedCategory
                        )
                        .reduce((acc, item) => {
                            acc += item.totalGivenAmount;
                            return acc;
                        }, 0);
                }
                state.rebateFilteredTotalAmount = total;
            }
        },
        setRebateFilterTotalAmount(state, action) {
            state.rebateFilteredTotalAmount = action.payload;
        },
        openPromotionDetail(state,action){
            state.openPromotionDetail = action.payload;
        },
        resetData(state) {
            state.topTabIndex = "1";
            state.categories = [];
            state.promotions = [];
            state.selectedBonus = null;
            state.appliedPromotions = null;
            state.freePromotions = [];
            state.rebateData = null;
            state.rebateFilteredTotalAmount = null;
            state.ValidAppliedList = null;
            state.inValidAppliedList = null;
            state.initialPromotionItemDetail = {};
        },
    },
});

export default promotionSlice;

export const promotionActions = promotionSlice.actions;
