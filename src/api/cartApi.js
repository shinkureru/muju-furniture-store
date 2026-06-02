import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 取得購物車
export const getCart = async () => {
  const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
  return res.data;
};

// 加入購物車
export const addToCart = async (productId, qty = 1) => {
  const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
    data: {
      product_id: productId,
      qty,
    },
  });

  return res.data;
};

// 修改購物車數量
export const updateCartItem = async (cartItemId, productId, qty) => {
  // cartItemId	購物車品項自己的 id
  // productId	商品本身的 id
  // 刪除或修改購物車品項時，用的是：cartItem.id
  // 不是：cartItem.product_id
  const res = await axios.put(
    `${BASE_URL}/v2/api/${API_PATH}/cart/${cartItemId}`,
    {
      data: {
        product_id: productId,
        qty,
      },
    },
  );

  return res.data;
};

// 刪除單一品項
export const removeCartItem = async (cartItemId) => {
  const res = await axios.delete(
    `${BASE_URL}/v2/api/${API_PATH}/cart/${cartItemId}`,
  );
  return res.data;
};

// 清空購物車
export const clearCart = async () => {
  const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
  // 注意路徑是：/carts 不是：/cart
  // 這種命名差異很煩，但 API 世界就是這樣
  return res.data;
};
