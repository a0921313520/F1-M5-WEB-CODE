/*
 * @Author: Alan
 * @Date: 2023-05-09 18:01:56
 * @LastEditors: Alan
 * @LastEditTime: 2023-06-02 19:32:39
 * @Description: Redux store 的配置文件。该文件定义了 Redux store 并将多个 Reducer 合并到一个根 reducer 中。
 * @FilePath: \F1-M1-WEB-Code\store\store.js
 */

import { configureStore } from "@reduxjs/toolkit";
import promotionSlice from "./promotionSlice";
import userCenterSlice from "./userCenterSlice";
import spinSlice from "./spinSlice";
import gameSlice from "./gameSlice";
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';


import {
	MethodsDetails,
	Methods,
	MethodsActive,
	DepositMoneyStatus,
	DepositMemberBanks,
	BanksBankAccounts,
	DepositBankSearch,
	DepositBankActive,
	DepositMemberBanksActive,
	DepositDateSelect,
	UploadFileList,
	UploadFileErr,
	DepositTimeSelect,
	DepositPayments,
	DepositNextStep,
	MethodCodeActive,
	DepositSuccessPage,
	UploadFileStatus,
	DepositCardNumber_CC,
	DepositCardPIN_CC,
	SuggestedAmounts,
	MemberCancelDeposit,
	DepositOldBank,
	DepositOldBankSixNumberStatus,
	RemoveAllReducersState,
	CopyKey,
	DepositAccountByAmount,
	MemberInfo,
	Announcement,
	LoginOTP,
	DepositBouns
  } from '$Deposits/store/reducers/DepositReducer'

  const RootReducer = combineReducers({
    // 中心化==str
	MethodsDetails: MethodsDetails,
	Methods: Methods,
	MethodsActive: MethodsActive,
	DepositMoneyStatus: DepositMoneyStatus,
	DepositMemberBanks: DepositMemberBanks,
	BanksBankAccounts: BanksBankAccounts,
	DepositBankSearch: DepositBankSearch,
	DepositBankActive: DepositBankActive,
	DepositMemberBanksActive: DepositMemberBanksActive,
	DepositDateSelect: DepositDateSelect,
	UploadFileList: UploadFileList,
	UploadFileErr: UploadFileErr,
	DepositTimeSelect: DepositTimeSelect,
	DepositPayments: DepositPayments,
	DepositNextStep: DepositNextStep,
	MethodCodeActive: MethodCodeActive,
	DepositSuccessPage: DepositSuccessPage,
	UploadFileStatus: UploadFileStatus,
	DepositCardNumber_CC: DepositCardNumber_CC,
	DepositCardPIN_CC: DepositCardPIN_CC,
	SuggestedAmounts: SuggestedAmounts,
	MemberCancelDeposit: MemberCancelDeposit,
	DepositOldBank: DepositOldBank,
	DepositOldBankSixNumberStatus: DepositOldBankSixNumberStatus,
	RemoveAllReducersState: RemoveAllReducersState,
	CopyKey: CopyKey,
	DepositAccountByAmount: DepositAccountByAmount,
	MemberInfo: MemberInfo,
	Announcement: Announcement,
	LoginOTP: LoginOTP,
	DepositBouns:DepositBouns,
    // 中心化==end


	promotion: promotionSlice.reducer,
	userCenter: userCenterSlice.reducer,
	spin: spinSlice.reducer,
	game: gameSlice.reducer,

});

const store = createStore(RootReducer, applyMiddleware(thunk))

export default store;
