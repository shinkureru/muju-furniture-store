import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cartApi";

export const fetchCartAsync = createAsyncThunk("cart/fetchCart", async () => {
  // "cart/fetchCart" 這是 action type。可以理解成這個非同步 action 的名字。
  // 格式通常是：功能名稱 / 動作名稱
  // 所以：cart/fetchCart 代表：購物車 / 取得購物車
  const res = await getCart();
  return res.data;
});

// 建立 Redux 版的「加入購物車」非同步 action
export const addCartItemAsync = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, qty = 1 }, { dispatch }) => {
    await addToCart(productId, qty); // 呼叫原本封裝好的 API，把商品加入購物車

    dispatch(fetchCartAsync()); // 加入成功後，重新取得購物車資料，更新 Redux store
  },
);

export const updateCartItemAsync = createAsyncThunk(
  "cart/updateCartItem",
  async ({ cartItemId, productId, qty }, { dispatch }) => {
    await updateCartItem(cartItemId, productId, qty);

    dispatch(fetchCartAsync());
  },
);

export const removeCartItemAsync = createAsyncThunk(
  "cart/removeCartItem",
  async (cartItemId, { dispatch }) => {
    await removeCartItem(cartItemId);

    dispatch(fetchCartAsync());
  },
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (_, { dispatch }) => {
    // 清空購物車不需要參數
    // 但 thunk callback 第一個參數位置還是存在。所以慣例用： _
    await clearCart();

    dispatch(fetchCartAsync());
  },
);

// Redux 裡購物車的初始狀態
const initialState = {
  cart: {
    carts: [], // 存完整購物車資料
    total: 0,
    final_total: 0,
  },
  cartCount: 0, // Header 要顯示的總商品數量
  isLoading: false, // 購物車 API loading 狀態
  error: null,
};

const cartSlice = createSlice({
  name: "cart", // slice 的名稱
  initialState, // 使用剛剛定義的初始狀態
  reducers: {}, // 放同步 action
  extraReducers: (builder) => {
    // 處理 createAsyncThunk 產生的狀態
    // createAsyncThunk 會自動產生三種狀態：
    // pending：API 執行中 fulfilled：API 成功 rejected：API 失敗
    builder
      // pending
      .addCase(fetchCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        // 開始取得購物車 → loading 開啟 → 清空舊錯誤
      })
      // fulfilled
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // action.payload 是 fetchCartAsync裡面：return res.data; 回傳的資料
        state.cart = action.payload;
        // 把購物車資料存進 Redux

        // 計算 Header 要顯示的數量
        state.cartCount = action.payload.carts.reduce((total, cartItem) => {
          return total + cartItem.qty;
        }, 0);
        // 我要更新 Redux state 裡的 cartCount。
        // cartCount 的值來自 API 回傳的 carts 陣列。
        // 用 reduce 把每一筆 cartItem 的 qty 加總起來。
        // 初始值從 0 開始。
      })
      // rejected
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
