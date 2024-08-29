import { configureStore } from "@reduxjs/toolkit";
import promotionSlice from "./slices/promotionSlice";
import userCenterSlice from "./slices/userCenterSlice";
import spinSlice from "./slices/spinSlice";
import gameSlice from "./slices/gameSlice";
import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import {
    Methods,
    MethodsActive,
    MethodCodeActive,
    MethodsDetails,
    MoneyStatus,
    SelectedBankAccOrType,
    PaymentNextStep,
    DepositPayments,
    DepositDateSelect,
    DepositTimeSelect,
    UploadFileList,
    UploadFileErr,
    PaymentSuccessPage,
    MemberInfo,
    DepositTriggerFrom,
    TutorialVisible, // 充值教程
    CryptoDepositInfo,
    FastNetBankingInfo, // 設置 fast net banking info for step2
    UploadFileModalVisible, // upload file modal visible
    DepositPaymentFailed, // 充值 提交 失敗
    UploadFileSubmitFailed, // 上傳檔案的結果
    CurrentLanguage,
} from "$CentralPayment/common/redux/reducers/DepositReducer";

import {
    AddBankAccPageVisible,
    GetCryptoAccTypeData,
    GetCryptoExchangeRate,
    WithdrawalPayments,
    RetrievalVisible,
} from "$CentralPayment/common/redux/reducers/WithdrawalReducer";

const RootReducer = combineReducers({
    // 中心化存款
    Methods,
    MethodsActive,
    MethodCodeActive,
    MethodsDetails,
    MoneyStatus,
    SelectedBankAccOrType,
    PaymentNextStep,
    DepositPayments,
    DepositDateSelect,
    DepositTimeSelect,
    UploadFileList,
    UploadFileErr,
    PaymentSuccessPage,
    MemberInfo,
    DepositTriggerFrom,
    TutorialVisible, // 充值教程
    CryptoDepositInfo,
    FastNetBankingInfo, // 設置 fast net banking info for step2
    UploadFileModalVisible, // upload file modal visible
    DepositPaymentFailed, // 充值 提交 失敗
    UploadFileSubmitFailed, // 上傳檔案的結果
    CurrentLanguage,
    // 中心化存款

    // 中心化提現
    AddBankAccPageVisible,
    GetCryptoAccTypeData,
    GetCryptoExchangeRate,
    WithdrawalPayments,
    RetrievalVisible,
    // 中心化提現

    promotion: promotionSlice.reducer,
    userCenter: userCenterSlice.reducer,
    spin: spinSlice.reducer,
    game: gameSlice.reducer,
});

const store = createStore(RootReducer, applyMiddleware(thunk));

export default store;
