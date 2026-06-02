import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const BASE_URL = process.env.VITE_BASE_URL;
const API_PATH = process.env.VITE_API_PATH;
const TOKEN = process.env.ADMIN_TOKEN;

const products = JSON.parse(
  await fs.readFile("./furniture-products-30.json", "utf-8"),
);

async function uploadProduct(product) {
  const res = await fetch(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN,
    },
    body: JSON.stringify({
      data: product,
    }),
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(`${product.title} 上傳失敗：${result.message}`);
  }

  console.log(`✅ ${product.title} 上傳成功`);
}

async function main() {
  if (!BASE_URL || !API_PATH || !TOKEN) {
    throw new Error("請確認 .env 是否有 BASE_URL、API_PATH、ADMIN_TOKEN");
  }

  for (const product of products) {
    await uploadProduct(product);
  }

  console.log("🎉 全部商品上傳完成");
}

main().catch((error) => {
  console.error("❌ 發生錯誤：", error.message);
});
