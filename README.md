# 沐居 Muju｜React 家具電商前後台作品

沐居 Muju 是一個以家具選品為主題的 React 電商作品，包含前台商品瀏覽、商品收藏、購物車、結帳流程、訂單完成頁，以及後台商品管理功能。

本專案使用 React、Vite、React Router、Redux Toolkit、Axios、SCSS、Bootstrap 與 HexSchool 電商 API 製作，目標是練習完整電商購物流程、API 串接、全域狀態管理與 RWD 響應式頁面整合。

---

## Demo

> 部署完成後補上 Demo 連結

- 前台網址：
- 後台登入：

---

## 使用技術

### 前端框架與建置工具

- React
- Vite
- React Router

### API 與資料處理

- Axios
- HexSchool 電商 API
- RESTful API
- async / await
- try...catch 錯誤處理

### 狀態管理

- Redux Toolkit
- React Redux
- createSlice
- createAsyncThunk
- useSelector
- useDispatch

### 表單與驗證

- react-hook-form

### 樣式與 UI

- SCSS
- Bootstrap
- Bootstrap Icons
- RWD 響應式設計
- Skeleton Loading
- Toast 提示
- Loading Overlay

### 瀏覽器儲存

- localStorage

---

## 前台功能

### 商品相關

- 商品列表 API 串接
- 商品分類篩選
- 商品排序
- 商品分頁
- Header 搜尋關鍵字並串接商品列表篩選
- 商品詳情頁
- 商品圖片與標題可點擊進入詳情頁
- 首頁 Banner 商品隨機輪播
- 商品網格 / 清單模式切換

### 收藏功能

- 使用 localStorage 儲存收藏商品 ID
- 商品卡與商品詳情頁可加入 / 移除收藏
- Header 顯示收藏數量
- 會員中心顯示收藏商品

### 購物車功能

- 購物車 API 封裝
- 加入購物車
- 購物車頁面
- 商品數量增加 / 減少
- 刪除單一購物車商品
- 清空購物車
- Header 購物車數量同步
- CartPage Skeleton Loading
- 購物車操作 loading / disabled 防呆

### 結帳與訂單

- CheckoutPage 結帳頁
- react-hook-form 表單驗證
- 訂購人姓名、Email、電話、地址、留言欄位
- 空購物車時顯示提示畫面
- 建立訂單 API 串接
- 訂單送出後同步 Redux 購物車狀態
- 訂單完成頁 `/order/:orderId`
- 訂單完成頁顯示訂購人資料、商品明細、總金額與付款狀態

### 全站 UX

- 全站 Toast 成功 / 錯誤提示
- Toast 自動消失與淡入淡出動畫
- Loading Overlay
- 空狀態提示
- 手機版 Header 漢堡選單
- RWD 響應式版面調整

---

## 後台功能

- 後台登入頁
- HexSchool signin API 串接
- token 儲存於 localStorage
- 後台商品列表
- 新增商品 Modal
- 編輯商品 Modal
- 刪除商品
- 商品上架 / 下架
- token 過期或 API 回傳 401 時清除 token 並導回登入頁

---

## 專案路由

### 前台

| 路徑               | 說明       |
| ------------------ | ---------- |
| `/`                | 首頁       |
| `/shop`            | 商品列表   |
| `/shop/:productId` | 商品詳情   |
| `/cart`            | 購物車     |
| `/checkout`        | 結帳頁     |
| `/order/:orderId`  | 訂單完成頁 |
| `/about`           | 關於我們   |
| `/contact`         | 聯絡我們   |
| `/member`          | 會員中心   |

### 後台

| 路徑                           | 說明         |
| ------------------------------ | ------------ |
| `/admin/login`                 | 後台登入     |
| `/admin`                       | 後台入口     |
| `/admin/products`              | 商品管理     |
| `/admin/tools/delete-products` | 商品刪除工具 |

---

## 專案架構

```txt
src
├─ api
│  ├─ productApi.js
│  ├─ cartApi.js
│  └─ orderApi.js
│
├─ components
│  ├─ Header.jsx
│  ├─ Footer.jsx
│  ├─ LoginModal.jsx
│  ├─ ToastContainer.jsx
│  └─ CartSkeleton.jsx
│
├─ pages
│  ├─ HomePage.jsx
│  ├─ ShopPage.jsx
│  ├─ ProductDetailPage.jsx
│  ├─ CartPage.jsx
│  ├─ CheckoutPage.jsx
│  ├─ OrderCompletePage.jsx
│  ├─ MemberPage.jsx
│  ├─ AdminLoginPage.jsx
│  └─ AdminProductsPage.jsx
│
├─ router
│  └─ AppRouter.jsx
│
├─ store
│  ├─ store.js
│  ├─ cartSlice.js
│  └─ toastSlice.js
│
├─ styles
│  ├─ main.scss
│  ├─ abstracts
│  ├─ base
│  ├─ components
│  ├─ pages
│  └─ responsive
│
└─ utils
   └─ toastHelpers.js
```

---

## Redux Toolkit 資料流

### 購物車資料流

商品詳情頁或購物車頁 dispatch async thunk
→ cartSlice 呼叫 cartApi
→ HexSchool API 回傳購物車資料
→ Redux store 更新 cart state
→ Header、CartPage、CheckoutPage 透過 useSelector 重新取得最新資料
→ 畫面同步更新購物車數量與訂單摘要

### Toast 資料流

頁面元件 dispatch Toast action
→ toastSlice 將 Toast 加入 items
→ ToastContainer 透過 useSelector 讀取 items
→ 畫面顯示 Toast
→ 時間到後 dispatch removeToast
→ Toast 從畫面移除

### API 封裝

本專案將 API 依照功能拆分：

productApi.js：商品相關 API
cartApi.js：購物車相關 API
orderApi.js：訂單相關 API

讓頁面元件不直接處理 API URL，提升可讀性與維護性。

## 專案亮點

### 1. 完整電商購物流程

從商品列表、商品詳情、加入購物車、結帳到訂單完成頁，完成前台購物流程。

### 2. Redux Toolkit 全域狀態管理

使用 Redux Toolkit 管理購物車與 Toast，讓 Header、CartPage、CheckoutPage 等不同頁面能共用同一份狀態。

### 3. API 封裝與錯誤處理

將商品、購物車、訂單 API 分別封裝，並在頁面中使用 try...catch 處理成功與失敗狀態。

### 4. 表單驗證

使用 react-hook-form 管理 CheckoutPage 表單，包含必填驗證與 Email 格式驗證。

### 5. UX 狀態設計

包含 loading、disabled、empty state、Toast、Skeleton Loading 與手機版導覽選單，提升使用者操作體驗。

### 6. RWD 響應式設計

針對桌機、平板、手機版調整商品列表、Header、購物車與結帳流程，確保手機版也能順利操作。

## 開發過程中解決的問題

### Checkout 建立訂單流程

建立訂單時需要將 react-hook-form 收集到的表單資料，整理成 HexSchool API 需要的 user 格式後送出。

### Redux async thunk 錯誤處理

在需要等待 Redux async thunk 結果時，使用 .unwrap() 讓 rejected thunk 可以被 try...catch 捕捉。

### Toast helper 重構

將重複的 showToast({ type, message }) 寫法整理成 showSuccessToast 與 showErrorToast helper，降低重複程式碼。

### SCSS 變數整理

將 SCSS 變數依賴從 main.scss 全域 import，整理成各 partial 自己使用 @use 引入 variables，提升樣式模組的可維護性。

### 手機版導覽

原本手機版 Header 缺少主要導覽入口，後來補上漢堡選單，讓使用者能快速前往商品列表、關於我們與聯絡我們等頁面。

### 未來優化方向

- 加入 TypeScript
- 前台會員登入與會員訂單查詢
- 商品收藏改由 Redux Toolkit 管理
- 後台 auth 狀態改由 Redux Toolkit 管理
- 購物車 optimistic update
- 商品圖片上傳功能
- 單元測試與整合測試
- 更完整的後台權限保護
- SEO 與 Lighthouse 優化
- CI/CD 自動部署流程

---

## 作者

此專案為 React 前端工程作品集，主要練習電商 API 串接、React Router 路由管理、Redux Toolkit 全域狀態管理、表單驗證與 RWD 響應式設計。
