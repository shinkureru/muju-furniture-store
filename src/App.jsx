import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import LoginModal from "./components/LoginModal";

import { useDispatch } from "react-redux";
import { fetchCartAsync } from "./store/cartSlice";

import ToastContainer from "./components/common/ToastContainer";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 整個網站目前是否登入

  const [userRole, setUserRole] = useState("");
  // 目前登入者的角色

  useEffect(() => {
    dispatch(fetchCartAsync()); // 觸發 Redux async thunk
  }, [dispatch]);
  // fetchCartAsync → getCart API → Redux store 更新

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole") || "";

    setIsLoggedIn(loginStatus);
    setUserRole(role);
  }, []);
  // App 第一次載入時，去 localStorage 裡恢復登入狀態
  // 意思是：
  // 重新整理頁面
  // → 從 localStorage 讀登入資料
  // → 還原到 React state

  const handleAccountClick = () => {
    setIsLoginOpen(true);
  }; // 只負責打開登入 Modal

  const handleLoginSuccess = (role) => {
    // 這個 role 是 LoginModal 傳回來的
    // 也就是：admin 或 member
    setIsLoggedIn(true);
    // 前端畫面知道「現在已登入」
    setUserRole(role);
    // 把角色放進 Header 的 state
    // 這行很重要，因為它會讓 Header 重新 render
    setIsLoginOpen(false);
    // 登入成功後關掉 Modal

    navigate("/member");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    setIsLoggedIn(false);
    setUserRole("");

    navigate("/");
  };
  // 登出時：
  // 1. 清掉 localStorage
  // 2. 清掉 React state
  // 3. 回首頁

  return (
    <>
      <ScrollToTop />

      <Header
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onAccountClick={handleAccountClick}
        onLogout={handleLogout}
      />

      <main>
        <Outlet />
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <ToastContainer />
    </>
  );
}
// 完整概念是：
// <>
//   <ScrollToTop />
//   <Header />
//   <main>
//     <Outlet />
//   </main>
//   <Footer />
//   <LoginModal />
//   <ToastContainer />
// </>
// Toast 要放在 App 層，因為它是全站共用提示

export default App;

// ScrollToTop 一定要放在 RouterProvider 裡面，也就是放在 App.jsx 這種被 router 管理的元件裡是對的。不要放到 main.jsx 的 <AppRouter /> 外面，不然 useLocation() 會抓不到 router 狀態。
