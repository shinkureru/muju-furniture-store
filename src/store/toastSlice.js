import { createSlice, nanoid } from "@reduxjs/toolkit";
// nanoid 是 Redux Toolkit 內建的小工具，用來產生唯一 id
// Toast 需要 id，因為畫面上可能同時有多個提示

const initialState = {
  items: [], // items 是目前畫面上所有 Toast
};
// 例如：
// items: [
//   {
//     id: "abc",
//     type: "success",
//     message: "已加入購物車",
//   },
// ];

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: {
      // 顯示 Toast 的 action，寫成物件形式，是因為我們要使用 prepare

      reducer: (state, action) => {
        state.items.push(action.payload); // 把新的 Toast 放進陣列
        // 看起來像直接 push，但 Redux Toolkit 內部有 Immer，所以可以這樣寫
      },

      // prepare 可以在 action 送進 reducer 前，先整理 payload
      prepare: ({ type = "success", message }) => {
        // 也就是你在元件只需要傳：
        // showToast({
        //   type: "success",
        //   message: "已加入購物車",
        // }); Redux 會自動幫你補上：id: nanoid()
        return {
          payload: {
            id: nanoid(),
            type,
            message,
          },
        };
      },
    },

    // 移除指定 id 的 Toast
    removeToast: (state, action) => {
      state.items = state.items.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.items = [];
    },
  },
});

export const { showToast, removeToast, clearToasts } = toastSlice.actions;

export default toastSlice.reducer;
