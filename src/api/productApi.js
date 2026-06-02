import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export const getProducts = async () => {
  const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products/all`);

  return res.data.products;
};

// 取得單一商品的 API 函式
export const getProductById = async (productId) => {
  const res = await axios.get(
    `${BASE_URL}/v2/api/${API_PATH}/product/${productId}`,
  );

  return res.data.product;
};
