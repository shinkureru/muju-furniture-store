import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

// 建立訂單
export const createOrder = async (orderData) => {
  const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/order`, {
    data: orderData,
  });

  return res.data;
};

// 取得單筆訂單
export const getOrderById = async (orderId) => {
  const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/order/${orderId}`);

  return res.data;
};

// 整個檔案在做的事情是：
// 先拿到 API 主網址和 API 路徑，然後寫一個 createOrder 函式。
// 當 CheckoutPage 把訂單資料傳進來時，我就用 axios.post 把資料送到 HexSchool 的建立訂單 API。
// API 回傳結果後，我只把 res.data 回傳給頁面使用
