import { useState } from "react";

import { Link } from "react-router-dom";
// 站內頁面切換要用 Link，不要用 <a href="">。
// Link → React Router 控制頁面切換，不重新整理
// <a href=""> → 瀏覽器重新載入整個頁面

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();

    const emailValue = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue) {
      setSubscribeStatus("error");
      setSubscribeMessage("請先輸入 Email");
      return;
    }

    if (!emailPattern.test(emailValue)) {
      setSubscribeStatus("error");
      setSubscribeMessage("請輸入正確的 Email 格式");
      return;
    }

    setSubscribeStatus("success");
    setSubscribeMessage("訂閱成功！我們會將最新消息寄送到您的信箱。");
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="row gy-5 gx-lg-5">
          <div className="col-12 col-lg-4">
            <Link to="/" className="footer-brand">
              <span className="footer-brand__icon">
                <i className="bi bi-house-heart"></i>
              </span>

              <span className="footer-brand__name">沐居</span>
            </Link>

            <p className="footer-text mt-4">
              嚴選日常家具與居家單品，陪你打造舒服、安定且有溫度的生活空間。
            </p>

            <div className="footer-contact mt-4">
              <p>
                <i className="bi bi-geo-alt"></i>
                台北市中山區木質路 88 號
              </p>

              <p>
                <i className="bi bi-telephone"></i>
                02-2345-6789
              </p>

              <p>
                <i className="bi bi-envelope"></i>
                service@muju.com
              </p>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h2 className="footer-title">網站導覽</h2>

            <ul className="footer-links">
              <li>
                <Link to="/">首頁</Link>
              </li>
              <li>
                <Link to="/shop">商品列表</Link>
              </li>
              <li>
                <Link to="/about">關於我們</Link>
              </li>
              <li>
                <Link to="/contact">聯絡我們</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h2 className="footer-title">會員服務</h2>

            <ul className="footer-links">
              <li>
                <Link to="/member">會員中心</Link>
              </li>
              <li>
                <Link to="/member/orders">訂單查詢</Link>
              </li>
              <li>
                <Link to="/member">收藏清單</Link>
              </li>
              <li>
                <Link to="/contact">客服支援</Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-lg-4">
            <h2 className="footer-title">訂閱電子報</h2>

            <p className="footer-text">
              接收新品上市、限時優惠與居家佈置靈感。
            </p>

            <form className="footer-subscribe mt-4" onSubmit={handleSubscribe}>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="請輸入 Email"
                  aria-label="請輸入 Email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSubscribeMessage("");
                    setSubscribeStatus("");
                  }}
                />

                <button className="btn btn-dark" type="submit">
                  訂閱
                </button>
              </div>

              {subscribeMessage && (
                <p
                  className={`footer-subscribe__message mt-2 mb-0 ${
                    subscribeStatus === "success"
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {subscribeMessage}
                </p>
              )}
            </form>

            <div className="footer-social mt-4">
              <a href="#" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="#" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="#" aria-label="LINE">
                <i className="bi bi-line"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 沐居 Muju. All rights reserved.</p>

          <div>
            <Link to="/about">品牌理念</Link>
            <Link to="/contact">聯絡客服</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
