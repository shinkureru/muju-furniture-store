import { useEffect, useState } from "react";
// useState → 存商品列表、loading、錯誤訊息、token
// useEffect → 頁面載入時自動抓後台商品

import { Link, useNavigate } from "react-router-dom";
import {
  createAdminProduct, // 新增商品
  deleteAdminProduct, // 刪除商品 API
  getAdminProducts, // 讀取商品列表
  updateAdminProduct, // 編輯商品
} from "../api/adminProductApi";

const defaultProductForm = {
  title: "",
  category: "",
  unit: "件",
  origin_price: 0,
  price: 0,
  description: "",
  content: "",
  imageUrl: "",
  imagesUrl: [],
  is_enabled: 1,
  color: "",
  material: "",
}; // 新增商品表單的初始值
// 為什麼要拉到元件外面？ 因為它是固定常數，不需要每次 render 都重新建立

function AdminProductsPage() {
  const navigate = useNavigate();
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("furniroAdminToken") || "",
  ); // 從 localStorage 讀取後台 token

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  // 控制新增商品 Modal 是否打開
  const [modalMode, setModalMode] = useState("create");
  // 控制目前 Modal 是新增還是編輯。 "create" → 新增商品 "edit"   → 編輯商品
  const [editingProductId, setEditingProductId] = useState(null);
  // 記錄目前正在編輯哪一筆商品
  const [productForm, setProductForm] = useState(defaultProductForm);
  // 儲存表單目前輸入的資料
  const [isSaving, setIsSaving] = useState(false);
  // 控制表單是否正在送出
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const [operatingProductId, setOperatingProductId] = useState(null);
  // 記錄目前正在操作哪一筆商品

  const fetchProducts = async () => {
    if (!adminToken) {
      setErrorMessage("請先登入後台。");

      navigate("/admin/login");

      return;
      // 如果沒有 token，就不要打 API，因為管理端 API 一定需要 token
    }

    try {
      setIsLoading(true); // 開始 loading
      setErrorMessage(""); // 清空錯誤訊息

      const data = await getAdminProducts(adminToken);
      // 呼叫後台商品 API
      setProducts(data);
      // 把回傳商品存進 products state
    } catch (error) {
      console.error("取得後台商品失敗：", error);
      console.error("API 回應：", error.response?.data);
      console.error("HTTP 狀態碼：", error.response?.status);
      if (error.response?.status === 401) {
        localStorage.removeItem("furniroAdminToken");
        localStorage.removeItem("furniroAdminExpired");

        setAdminToken("");
        setErrorMessage("後台 token 已過期，請重新登入。");

        navigate("/admin/login");
        return;
      }
      setErrorMessage(
        error.response?.data?.message ||
          "取得後台商品失敗，請確認 token 是否正確或是否過期。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 新增產品
  const handleOpenCreateModal = () => {
    setModalMode("create"); // 點「新增商品」時，要明確切回新增模式
    setEditingProductId(null);
    setProductForm(defaultProductForm); // 表單重設成預設值
    setFormErrorMessage(""); // 清掉錯誤訊息
    setIsProductModalOpen(true); // 打開 Modal
  };

  // 編輯產品
  const handleOpenEditModal = (product) => {
    setModalMode("edit"); // 切成編輯模式
    setEditingProductId(product.id); // 記住要編輯哪一筆商品

    setProductForm({
      title: product.title || "",
      category: product.category || "",
      unit: product.unit || "件",
      origin_price: product.origin_price || 0,
      price: product.price || 0,
      description: product.description || "",
      content: product.content || "",
      imageUrl: product.imageUrl || "",
      imagesUrl: product.imagesUrl || [],
      is_enabled: product.is_enabled ? 1 : 0,
      color: product.color || "",
      material: product.material || "",
    });
    // 把商品原本資料放進表單 state。
    // 因為你的 input 是 controlled input：value={productForm.title}
    // 所以 productForm 一改，表單欄位就會自動顯示原本商品資料

    setFormErrorMessage("");
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    if (isSaving) return; // 如果正在儲存，不允許關閉

    setIsProductModalOpen(false); // 關閉 Modal
    setModalMode("create"); // 模式回到 create
    setEditingProductId(null); // editingProductId 清空
    setFormErrorMessage(""); // 清錯誤
    setProductForm(defaultProductForm); // 清表單
  };

  const handleProductInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    // 從 input 裡拿出資料

    setProductForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      // 這是共用表單更新寫法。
      // 如果是一般 input，就用 value。
      // 如果是 checkbox，就根據 checked 轉成： 勾選 → 1 沒勾 → 0
    }));
  };

  // 新增表單送出函式
  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    // 避免表單送出後整頁重新整理。 React 表單必做

    if (
      // 基本驗證
      !productForm.title.trim() || // 商品名稱
      !productForm.category.trim() || // 分類
      !productForm.imageUrl.trim() || // 主圖網址
      Number(productForm.price) <= 0 // 售價大於 0
    ) {
      // 如果不符合
      setFormErrorMessage("請輸入商品名稱、分類、主圖網址與有效售價。");
      return; // 直接停止，不打 API
    }

    try {
      setIsSaving(true);
      setFormErrorMessage("");

      // 組 payload
      const payload = buildProductPayload(productForm);

      let result;

      // 新增模式時，呼叫 POST API
      if (modalMode === "create") {
        result = await createAdminProduct(adminToken, payload);
      }
      // 編輯模式時，呼叫 PUT API
      if (modalMode === "edit") {
        result = await updateAdminProduct(
          adminToken,
          editingProductId,
          payload,
        );
      }

      if (!result.success) {
        setFormErrorMessage(result.message || "商品儲存失敗。");
        return;
      }

      await fetchProducts(); // 儲存成功後重新取得商品列表

      handleCloseProductModal();
    } catch (error) {
      console.error("新增商品失敗：", error);
      setFormErrorMessage(
        error.response?.data?.message || "新增商品失敗，請稍後再試。",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 刪除商品函式
  const handleDeleteProduct = async (product) => {
    const isConfirm = window.confirm(`確定要刪除「${product.title}」嗎？`);
    // 刪除是危險操作，所以先跳確認視窗

    if (!isConfirm) return; // 如果使用者按取消，就停止，不打 API

    try {
      setOperatingProductId(product.id); // 記錄目前正在操作這筆商品
      setErrorMessage("");

      const result = await deleteAdminProduct(adminToken, product.id);
      // 呼叫刪除 API

      if (!result.success) {
        setErrorMessage(result.message || "刪除商品失敗。");
        return;
      }

      await fetchProducts(); // 刪除成功後重新抓商品列表
    } catch (error) {
      console.error("刪除商品失敗：", error);
      setErrorMessage(
        error.response?.data?.message || "刪除商品失敗，請稍後再試。",
      );
    } finally {
      setOperatingProductId(null);
    }
  };

  // 上下架切換函式
  const handleToggleProductEnabled = async (product) => {
    const nextEnabled = product.is_enabled ? 0 : 1;
    // 如果目前啟用，就切成 0。如果目前未啟用，就切成 1。
    // 也就是：啟用 → 下架 未啟用 → 上架

    try {
      setOperatingProductId(product.id);
      setErrorMessage("");

      const payload = buildProductPayload({
        ...product,
        is_enabled: nextEnabled,
      });
      // 用原本商品資料，覆蓋 is_enabled。
      // 然後整理成乾淨的 API payload

      const result = await updateAdminProduct(adminToken, product.id, payload);
      // 用編輯商品 API 更新這筆商品
      // 這裡本質上也是 Update，只是你只改「上下架狀態」

      if (!result.success) {
        setErrorMessage(result.message || "更新商品狀態失敗。");
        return;
      }

      await fetchProducts();
    } catch (error) {
      console.error("更新商品狀態失敗：", error);
      setErrorMessage(
        error.response?.data?.message || "更新商品狀態失敗，請稍後再試。",
      );
    } finally {
      setOperatingProductId(null);
    }
  };

  // 整理一份乾淨 payload，比較安全。
  // 這也讓之後新增、編輯、上下架都能共用同一種資料格式
  const buildProductPayload = (product) => {
    return {
      title: product.title || "",
      category: product.category || "",
      unit: product.unit || "件",
      origin_price: Number(product.origin_price) || 0,
      price: Number(product.price) || 0,
      description: product.description || "",
      content: product.content || "",
      imageUrl: product.imageUrl || "",
      imagesUrl: product.imagesUrl || [],
      is_enabled: Number(product.is_enabled) || 0,
      color: product.color || "",
      material: product.material || "",
    }; // 為什麼要轉 Number？ 因為 input 輸入出來都是字串。
    // 即使你寫：<input type="number" /> 拿到的 value 仍然是字串
  };

  useEffect(() => {
    fetchProducts();
  }, [adminToken]);
  //  AdminProductsPage 第一次顯示
  // 或 adminToken 改變時 → 自動抓商品列表

  return (
    <main className="admin-products-page py-5">
      <section className="site-container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <span className="badge text-bg-warning mb-3">Admin Products</span>

            <h1 className="display-6 fw-bold mb-2">商品管理</h1>

            <p className="text-secondary mb-0">
              管理後台商品資料，這裡會逐步加入新增、編輯、刪除與上下架功能。
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <Link to="/admin" className="btn btn-outline-dark">
              返回後台首頁
            </Link>

            <Link to="/admin/login" className="btn btn-outline-secondary">
              後台登入
            </Link>

            <button
              type="button"
              className="btn btn-dark"
              onClick={fetchProducts}
              disabled={isLoading}
            >
              {isLoading ? "讀取中..." : "重新整理"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="alert alert-danger rounded-4" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              <div>
                <h2 className="h5 fw-bold mb-1">商品列表</h2>
                <p className="text-secondary mb-0">
                  目前共有 {products.length} 筆商品
                </p>
              </div>

              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={handleOpenCreateModal}
              >
                新增商品
              </button>
            </div>

            {isLoading && (
              <div className="admin-table-loading">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">商品載入中...</span>
                </div>
                <p>商品資料載入中...</p>
              </div>
            )}

            {!isLoading && products.length === 0 && !errorMessage && (
              <div className="admin-empty-state">
                <i className="bi bi-box-seam"></i>
                <h3>目前沒有商品資料</h3>
                <p>之後可以透過新增商品功能建立後台商品。</p>
              </div>
            )}

            {!isLoading && products.length > 0 && (
              <div className="table-responsive">
                <table className="table admin-product-table align-middle table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>圖片</th>
                      <th>商品名稱</th>
                      <th>分類</th>
                      <th>原價</th>
                      <th>售價</th>
                      <th>啟用狀態</th>
                      <th className="text-end">操作</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="admin-product-table__image"
                          />
                        </td>

                        <td>
                          <strong>{product.title}</strong>
                          <p>{product.description}</p>
                        </td>

                        <td>{product.category}</td>

                        <td>NT$ {product.origin_price?.toLocaleString()}</td>

                        <td>
                          <span className="fw-bold">
                            NT$ {product.price?.toLocaleString()}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              product.is_enabled
                                ? "text-bg-success"
                                : "text-bg-secondary"
                            }`}
                          >
                            {product.is_enabled ? "啟用" : "未啟用"}
                          </span>
                        </td>

                        <td className="text-end">
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => handleOpenEditModal(product)}
                              disabled={operatingProductId === product.id}
                            >
                              編輯
                            </button>

                            <button
                              type="button"
                              className={
                                product.is_enabled
                                  ? "btn btn-sm btn-outline-secondary"
                                  : "btn btn-sm btn-outline-success"
                              }
                              onClick={() =>
                                handleToggleProductEnabled(product)
                              }
                              disabled={operatingProductId === product.id}
                            >
                              {product.is_enabled ? "下架" : "上架"}
                            </button>
                            {/* 如果商品目前啟用，按鈕顯示「下架」。
                            如果商品目前未啟用，按鈕顯示「上架」。 */}

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteProduct(product)}
                              disabled={operatingProductId === product.id}
                            >
                              {operatingProductId === product.id
                                ? "處理中"
                                : "刪除"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
      {isProductModalOpen && (
        <div className="admin-product-modal">
          <div
            className="admin-product-modal__backdrop"
            onClick={handleCloseProductModal}
          ></div>

          <div className="admin-product-modal__dialog">
            <div className="admin-product-modal__header">
              <div>
                <span className="badge text-bg-warning mb-2">
                  {modalMode === "create" ? "Create Product" : "Edit Product"}
                </span>

                <h2>{modalMode === "create" ? "新增商品" : "編輯商品"}</h2>
              </div>

              <button
                type="button"
                className="admin-product-modal__close"
                onClick={handleCloseProductModal}
                aria-label="關閉商品表單視窗"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {formErrorMessage && (
              <div className="alert alert-danger rounded-4" role="alert">
                {formErrorMessage}
              </div>
            )}

            <form className="admin-product-form" onSubmit={handleSubmitProduct}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="product-title">
                    商品名稱
                  </label>
                  <input
                    id="product-title"
                    type="text"
                    name="title"
                    className="form-control"
                    value={productForm.title}
                    onChange={handleProductInputChange}
                    placeholder="例如：奶油風雙人沙發"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="product-category">
                    分類
                  </label>
                  <input
                    id="product-category"
                    type="text"
                    name="category"
                    className="form-control"
                    value={productForm.category}
                    onChange={handleProductInputChange}
                    placeholder="例如：沙發"
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label" htmlFor="product-origin-price">
                    原價
                  </label>
                  <input
                    id="product-origin-price"
                    type="number"
                    name="origin_price"
                    className="form-control"
                    value={productForm.origin_price}
                    onChange={handleProductInputChange}
                    min="0"
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label" htmlFor="product-price">
                    售價
                  </label>
                  <input
                    id="product-price"
                    type="number"
                    name="price"
                    className="form-control"
                    value={productForm.price}
                    onChange={handleProductInputChange}
                    min="0"
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label" htmlFor="product-unit">
                    單位
                  </label>
                  <input
                    id="product-unit"
                    type="text"
                    name="unit"
                    className="form-control"
                    value={productForm.unit}
                    onChange={handleProductInputChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="product-color">
                    顏色
                  </label>
                  <input
                    id="product-color"
                    type="text"
                    name="color"
                    className="form-control"
                    value={productForm.color}
                    onChange={handleProductInputChange}
                    placeholder="例如：米白"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="product-material">
                    材質
                  </label>
                  <input
                    id="product-material"
                    type="text"
                    name="material"
                    className="form-control"
                    value={productForm.material}
                    onChange={handleProductInputChange}
                    placeholder="例如：布料"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="product-image">
                    主圖網址
                  </label>
                  <input
                    id="product-image"
                    type="url"
                    name="imageUrl"
                    className="form-control"
                    value={productForm.imageUrl}
                    onChange={handleProductInputChange}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="product-description">
                    商品描述
                  </label>
                  <textarea
                    id="product-description"
                    name="description"
                    className="form-control"
                    rows="3"
                    value={productForm.description}
                    onChange={handleProductInputChange}
                    placeholder="簡短描述商品特色"
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="product-content">
                    商品說明
                  </label>
                  <textarea
                    id="product-content"
                    name="content"
                    className="form-control"
                    rows="3"
                    value={productForm.content}
                    onChange={handleProductInputChange}
                    placeholder="例如：適合客廳、臥室或小坪數空間。"
                  ></textarea>
                </div>

                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      id="product-enabled"
                      type="checkbox"
                      name="is_enabled"
                      className="form-check-input"
                      checked={Boolean(productForm.is_enabled)}
                      onChange={handleProductInputChange}
                    />

                    <label
                      className="form-check-label"
                      htmlFor="product-enabled"
                    >
                      啟用商品
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-product-form__actions">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCloseProductModal}
                  disabled={isSaving}
                >
                  取消
                </button>

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "儲存中..."
                    : modalMode === "create"
                      ? "新增商品"
                      : "儲存修改"}
                  {/* 如果正在送出：儲存中...
                  如果不是送出中，而且是新增模式：新增商品
                  如果是編輯模式：儲存修改 */}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminProductsPage;
