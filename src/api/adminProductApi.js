import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const getAuthConfig = (token) => ({
  headers: {
    Authorization: token,
  },
});

// 建立後台登入函式
export const adminLogin = async ({ username, password }) => {
  const res = await axios.post(`${BASE_URL}/v2/admin/signin`, {
    username,
    password,
  });

  return res.data;
};

export const getAdminProducts = async (token, page = 1) => {
  const res = await axios.get(
    `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`,
    getAuthConfig(token),
  );

  return res.data.products;
};

// 建立一個新增商品的 API 函式
export const createAdminProduct = async (token, productData) => {
  const res = await axios.post(
    `${BASE_URL}/v2/api/${API_PATH}/admin/product`, // 這是新增商品的 API endpoint
    {
      data: productData, // Hex API 新增商品時，資料要包在 data 裡
    },
    getAuthConfig(token), // 因為這是管理端 API，沒有 token 就會 401
  );

  return res.data;
};

// 建立編輯商品 API 函式
export const updateAdminProduct = async (token, productId, productData) => {
  // token  → 後台 token
  // productId → 要編輯哪一筆商品
  // productData  → 編輯後的商品資料
  const res = await axios.put(
    // 編輯商品用：PUT
    `${BASE_URL}/v2/api/${API_PATH}/admin/product/${productId}`,
    {
      data: productData,
      // 跟新增一樣，Hex API 需要把商品資料包在 data 裡
    },
    getAuthConfig(token),
  );

  return res.data;
};

export const deleteAdminProduct = async (token, productId) => {
  const res = await axios.delete(
    `${BASE_URL}/v2/api/${API_PATH}/admin/product/${productId}`,
    getAuthConfig(token),
  );

  return res.data;
};
