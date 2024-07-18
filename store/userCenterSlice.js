import { createSlice } from "@reduxjs/toolkit";
//这三个pagekey的页面不在个人中心
//当跳转到这些pagekey所代表的页面时Key 需变成 userinfo
export const WILLUPDATETODEFAULT_KEYARRAY = [
    "mypromotion",
    "mybonus",
    "dailybonus",
];
export const DEFAULT_TABKEY = "userinfo";

let changeableKey = DEFAULT_TABKEY;
if (typeof Storage !== "undefined") {
    changeableKey = !!sessionStorage.getItem("userCenterPageKey")
        ? sessionStorage.getItem("userCenterPageKey")
        : DEFAULT_TABKEY;
}

const userCenterSlice = createSlice({
    name: "userCenter",
    initialState: {
        memberInfo: {},
        isPersonalDataEditable: false, //帳戶資料-基本訊息是否可編輯
        userCenterPageTabKey: changeableKey,
        refreshCurrentPage: "", //当前页面是否需要重新请求一次数据 (充值： deposit，转账：transfer，提款：withdraw)
    },
    reducers: {
        setMemberInfo(state, action) {
            state.memberInfo = action.payload;
            const { firstName, dob, gender } = action.payload;
            if (firstName.length && dob && gender) {
                state.isPersonalDataEditable = false;
            } else {
                state.isPersonalDataEditable = true;
            }
        },
        changeUserCenterTabKey(state, action) {
            state.userCenterPageTabKey = WILLUPDATETODEFAULT_KEYARRAY.some(
                (item) => item === action.payload,
            )
                ? DEFAULT_TABKEY
                : action.payload;
            sessionStorage.setItem(
                "userCenterPageKey",
                state.userCenterPageTabKey,
            );
        },
        setRefreshCurrentPage(state, action) {
            state.refreshCurrentPage = action.payload;
        },
        resetData(state) {
            state.memberInfo = {};
            state.isPersonalDataEditable = false;
            state.userCenterPageTabKey = DEFAULT_TABKEY;
            state.refreshCurrentPage = "";
        },
    },
});

export default userCenterSlice;
export const userCenterActions = userCenterSlice.actions;
