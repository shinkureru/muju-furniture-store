import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAdminProduct, getAdminProducts } from "../api/adminProductApi";

function AdminDeleteProductsPage() {
  // 建立一個 React 頁面元件

  const [tokenInput, setTokenInput] = useState("");
  // 輸入框正在輸入的 token

  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("furniroAdminToken") || "",
  );
  // 真正拿來打 API 的 token
  // 頁面剛載入時
  // → 先去 localStorage 找 furniroAdminToken
  // → 如果有，就拿來當 adminToken
  // → 如果沒有，就用空字串

  const [products, setProducts] = useState([]);
  // 後台 API 回來的商品陣列會放這裡，一開始是空陣列 []
  // API 成功後會變成：
  // [
  //   { id: "...", title: "雲朵三人布沙發", price: 12800 },
  //   { id: "...", title: "暮森 L 型沙發", price: 26800 }
  // ]

  const [isLoading, setIsLoading] = useState(false);
  // 用來顯示提示文字，例如：
  // Token 已儲存
  // 取得商品失敗
  // 已刪除：雲朵三人布沙發

  const [message, setMessage] = useState("");

  const saveToken = () => {
    localStorage.setItem("furniroAdminToken", tokenInput);
    // 把輸入框裡的 token 存到瀏覽器
    setAdminToken(tokenInput);
    // 把 token 放進 React state，讓頁面後續可以拿它打 API
    setTokenInput("");
    // 清空輸入框
    setMessage("Token 已儲存");
  };

  const clearToken = () => {
    localStorage.removeItem("furniroAdminToken");
    // 把瀏覽器裡存的 token 移除
    setAdminToken("");
    // 清掉目前 state 裡的 token
    setProducts([]);
    // 清空畫面上的商品列表
    setMessage("Token 已清除");
  };

  const fetchAdminProducts = async () => {
    // 這是一個非同步函式，專門取得後台商品列表
    if (!adminToken) {
      setMessage("請先輸入後台 token");
      return;
      // 如果沒有 token，就不要打 API，return 代表函式到這裡直接結束
    }

    try {
      // 開始嘗試執行可能失敗的程式
      // API 請求可能因為 token 過期、網路錯誤、API_PATH 錯誤而失敗，所以要包 try...catch
      setIsLoading(true); // 開始載入
      setMessage(""); // 清空上一個訊息

      const data = await getAdminProducts(adminToken);
      // 呼叫 API 函式
      // 這個函式會去打： GET /v2/api/{API_PATH}/admin/products?page=1 拿到商品列表

      setProducts(data); // 把 API 回來的商品放進畫面 state，這行一執行，React 會重新 render，表格就會出現商品
    } catch (error) {
      console.error(error);
      setMessage("取得商品失敗，請確認 token 是否正確或是否過期");
    } finally {
      setIsLoading(false);
      // 不管成功或失敗，最後都關掉 loading
    }
  };

  const handleDeleteProduct = async (product) => {
    // 這個函式會收到一整筆商品資料
    // 例如：
    // {
    //   id: "-Osxxxx",
    //   title: "雲朵三人布沙發",
    //   price: 12800
    // }

    const isConfirm = window.confirm(`確定要刪除「${product.title}」嗎？`); // 跳出確認視窗，避免你手滑把商品刪爆

    if (!isConfirm) return;
    // 如果使用者按取消，就直接結束，不做刪除

    try {
      setIsLoading(true);
      setMessage("");

      await deleteAdminProduct(adminToken, product.id);
      // 這行才是真正呼叫刪除 API
      // 會打：
      // DELETE /v2/api/{API_PATH}/admin/product/{productId}
      // 這裡的 product.id 很重要，API 要靠它知道要刪哪一筆

      setProducts((prevProducts) =>
        prevProducts.filter((item) => item.id !== product.id),
      );
      // 這是在刪除成功後，更新畫面
      // 意思是：
      // 保留所有 id 不等於剛剛被刪除商品 id 的資料

      setMessage(`已刪除：${product.title}`);
    } catch (error) {
      console.error(error);
      setMessage("刪除失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminProducts();
    }
  }, [adminToken]);
  // 只要 adminToken 改變
  // → 如果 adminToken 有值
  // → 自動取得後台商品

  //所以你按「儲存 Token」後：
  // setAdminToken(tokenInput)
  // → adminToken 改變
  // → useEffect 觸發
  // → fetchAdminProducts()
  // → 商品列表出現

  return (
    <main className="admin-page py-5">
      <section className="site-container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <span className="badge text-bg-danger mb-3">Danger Zone</span>

            <h1 className="display-6 fw-bold mb-2">快速刪除商品工具</h1>

            <p className="text-secondary mb-0">
              這個頁面是臨時清理商品資料用，不是正式後台商品編輯頁。
            </p>
          </div>

          <Link to="/admin" className="btn btn-outline-dark">
            返回後台首頁
          </Link>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h2 className="h5 fw-bold mb-3">後台 Token</h2>

            <div className="row g-3 align-items-end">
              <div className="col-12 col-lg-6">
                <label htmlFor="admin-token" className="form-label">
                  請輸入後台 token
                </label>

                <input
                  id="admin-token"
                  type="password"
                  className="form-control"
                  value={tokenInput}
                  onChange={(event) => setTokenInput(event.target.value)}
                  placeholder="貼上你的後台 token"
                />
              </div>

              <div className="col-12 col-lg-6">
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={saveToken}
                  >
                    儲存 Token
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={clearToken}
                  >
                    清除 Token
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={fetchAdminProducts}
                  >
                    重新取得商品
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="alert alert-info rounded-4" role="alert">
            {message}
          </div>
        )}

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
              <div>
                <h2 className="h5 fw-bold mb-1">商品列表</h2>
                <p className="text-secondary mb-0">
                  目前共有 {products.length} 筆商品
                </p>
              </div>

              {isLoading && (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">處理中...</span>
                </div>
              )}
            </div>

            <div className="table-responsive">
              <table className="table align-middle table-hover">
                <thead className="table-light">
                  <tr>
                    <th>圖片</th>
                    <th>分類</th>
                    <th>商品名稱</th>
                    <th>價格</th>
                    <th>啟用</th>
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
                          className="rounded-3 object-fit-cover"
                          style={{
                            width: "80px",
                            height: "60px",
                          }}
                        />
                      </td>

                      <td>{product.category}</td>

                      <td className="fw-semibold">{product.title}</td>

                      <td>NT$ {product.price.toLocaleString()}</td>

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
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center text-secondary py-5"
                      >
                        目前沒有商品資料
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDeleteProductsPage;
