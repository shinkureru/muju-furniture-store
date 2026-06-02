import { useState } from "react";
import { BsX, BsEye, BsEyeSlash } from "react-icons/bs";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const role = formData.email === "admin@muju.com" ? "admin" : "member";

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", formData.email);
    localStorage.setItem("userRole", role);

    // 一般會員：
    // //Email：test@gmail.com
    // //Password：123456

    // 商家管理人員：
    // //Email：admin@muju.com
    // //Password：123456

    onLoginSuccess(role);
  };

  return (
    <div className="login-modal">
      <div className="login-modal__backdrop" onClick={onClose}></div>

      <div className="login-modal__panel" role="dialog" aria-modal="true">
        <button
          type="button"
          className="login-modal__close"
          onClick={onClose}
          aria-label="關閉登入視窗"
        >
          <BsX />
        </button>

        <div className="login-modal__visual">
          <div className="login-modal__brand">
            <span>沐居</span>
            <strong>Living with warmth.</strong>
          </div>
        </div>

        <form className="login-modal__form" onSubmit={handleSubmit}>
          <div className="login-modal__heading">
            <span>會員登入</span>
            <h2>歡迎回來</h2>
            <p>登入後即可查看收藏清單、購物車與會員專屬資訊。</p>
          </div>

          <div className="login-field">
            <label htmlFor="login-email">電子信箱</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="請輸入電子信箱"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">密碼</label>

            <div className="login-password">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="請輸入密碼"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <span>記住我</span>
            </label>

            <button type="button">忘記密碼？</button>
          </div>

          <button type="submit" className="login-submit">
            登入
          </button>

          <p className="login-register">
            還沒有帳號？
            <button type="button">立即註冊</button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
