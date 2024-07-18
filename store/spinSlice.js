/*
 * @Author: Alan
 * @Date: 2023-06-01 21:58:05
 * @LastEditors: Alan
 * @LastEditTime: 2023-06-02 09:23:50
 * @Description: 在 Redux store 中定义了一个名为 spin 的 slice，用于全局控制加载 spinner 是否可见。
 * @FilePath: \F1-M1-WEB-Code\store\spinSlice.js
 */
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { translate } from "$ACTIONS/Translate";

// 定义 slice
const spinSlice = createSlice({
    name: "spin",
    initialState: { status: false, text: "" },
    reducers: {
        showSpin: (state, action) => {
            const [status, text = translate("加载中")] = action.payload; // 添加默认值
            return { ...state, status, text };
        },
        hideSpin: (state) => ({ status: false, text: "" }),
    },
});

// 导出 store
export default spinSlice;

// 获取 actions 对象
export const { showSpin, hideSpin } = spinSlice.actions;
