import { configureStore, createSlice } from "@reduxjs/toolkit";

// 定义 slice
const spinSlice = createSlice({
    name: "spin",
    initialState: { status: false, text: "" },
    reducers: {
        showSpin: (state, action) => {
            const [status, text = "加载中"] = action.payload; // 添加默认值
            return { ...state, status, text };
        },
        hideSpin: (state) => ({ status: false, text: "" }),
    },
});

// 导出 store
export default spinSlice;

// 获取 actions 对象
export const { showSpin, hideSpin } = spinSlice.actions;
