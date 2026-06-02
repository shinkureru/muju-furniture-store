import { Link } from "react-router-dom";

// Link 是用來切換頁面的。
// 不要用：
// <a href="/admin/products">
// 因為 <a> 會讓整個頁面重新載入。
// React SPA 裡面通常用：
// <Link to="/admin/products">
// 它會讓 React Router 接管頁面切換。

function AdminPage() {
  return (
    <main className="admin-page py-5">
      <section className="site-container">
        <div className="mb-5">
          <span className="badge text-bg-warning mb-3">Admin Dashboard</span>

          <h1 className="display-5 fw-bold mb-3">電商後台</h1>

          <p className="text-secondary fs-5 mb-0">
            這裡是後台管理首頁，可以進入商品管理與資料工具。
          </p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="card h-100 border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h4 fw-bold mb-3">商品管理</h2>

                <p className="text-secondary mb-4">
                  管理正式商品資料，之後會放新增、編輯、上下架與商品細項設定。
                </p>

                <Link to="/admin/products" className="btn btn-dark px-4">
                  進入商品管理
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card h-100 border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h4 fw-bold mb-3">快速刪除商品工具</h2>

                <p className="text-secondary mb-4">
                  臨時清理商品資料用，適合刪除測試資料或錯誤上傳的商品。
                </p>

                <Link
                  to="/admin/tools/delete-products"
                  className="btn btn-outline-danger px-4"
                >
                  進入刪除工具
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminPage;
