import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import toastReducer from "./toastSlice";

// 建立並匯出全站 Redux store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    toast: toastReducer,
  },
});
// 這樣 Redux state 會變成：
// state = {
//   cart: {
//     cart: {},
//     cartCount: 0,
//     isLoading: false,
//     error: null,
//   },
//   toast: {
//     items: [],
//   },
// };
