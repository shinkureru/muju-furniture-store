import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../api/adminProductApi";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  }); // 後台登入需要帳號和密碼

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // 會根據目前輸入框更新對應欄位
      // React 表單都要做這件事，不然送出後整個頁面重載
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表單預設刷新頁面

    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMessage("請輸入後台帳號與密碼。");
      return;
    } // 簡單驗證。如果帳號或密碼空白，就不送 API

    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await adminLogin({
        username: formData.username.trim(),
        password: formData.password.trim(),
      }); // 呼叫剛剛新增的登入 API

      if (!result.success) {
        setErrorMessage(result.message || "登入失敗，請確認帳號密碼。");
        return;
      }

      localStorage.setItem("furniroAdminToken", result.token);
      localStorage.setItem("furniroAdminExpired", result.expired);
      // 登入成功後，把 token 和過期時間存起來

      navigate("/admin/products"); // 登入成功後直接前往正式商品管理頁
    } catch (error) {
      console.error("後台登入失敗：", error);
      setErrorMessage(
        error.response?.data?.message || "登入失敗，請稍後再試。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="site-container">
        <div className="admin-login-card">
          <div className="admin-login-card__header">
            <span className="badge text-bg-warning mb-3">Admin Login</span>

            <h1>後台登入</h1>

            <p>請使用 Hex 後台帳號密碼登入，系統會自動取得後台 token。</p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger rounded-4" role="alert">
              {errorMessage}
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="admin-username" className="form-label">
                後台帳號
              </label>

              <input
                id="admin-username"
                type="email"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="請輸入 Hex 後台 Email"
                autoComplete="username"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="admin-password" className="form-label">
                後台密碼
              </label>

              <input
                id="admin-password"
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="請輸入後台密碼"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100"
              disabled={isLoading}
            >
              {isLoading ? "登入中..." : "登入後台"}
            </button>
          </form>

          <div className="admin-login-card__footer">
            <Link to="/admin">返回後台首頁</Link>
            <Link to="/">回到前台首頁</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminLoginPage;
