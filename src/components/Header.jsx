import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// useDispatch → 發送 action
// useSelector → 從 Redux store 讀資料
// 現在 Header 不需要更新 cart。它只需要： 讀取 cartCount
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// useNavigate 是 React Router 提供的跳轉工具

import {
  FAVORITE_CHANGE_EVENT,
  getFavoriteProductIds,
} from "../utils/favoriteStorage";

function Header({ isLoggedIn, userRole, onAccountClick, onLogout }) {
  const navigate = useNavigate();
  // 建立頁面跳轉工具
  // 之後可以寫：navigate("/shop"); 讓頁面切到商品列表
  const location = useLocation(); // 取得目前路由資訊
  // 例如現在網址是：/shop
  // 那 location.pathname 就會是：/shop

  const cartCount = useSelector((state) => state.cart.cartCount);
  // state.cart.cartCount 意思是：Redux store → cart slice → cartCount

  const headerActionsRef = useRef(null);
  // 一開始是 null，等 JSX render 後，會把它綁到：
  // <div className="header-icons">
  // 這樣就能拿到那個 DOM 區塊

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // 控制搜尋框是否打開
  const [searchKeyword, setSearchKeyword] = useState("");
  // 儲存搜尋框目前輸入的文字
  const [favoriteCount, setFavoriteCount] = useState(0);
  // Header 要顯示收藏數量，所以它需要一個 state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // 控制手機版漢堡選單是否打開

  const isAdmin = userRole === "admin";
  // 方便後面判斷用
  // 如果使用者是管理員：
  // isAdmin === true
  // 如果不是：
  // isAdmin === false

  const getNavClassName = ({ isActive }) =>
    isActive ? "main-nav__link is-active" : "main-nav__link";

  const [tooltip, setTooltip] = useState({
    isVisible: false,
    label: "",
    x: 0,
    y: 0,
  });

  const handleMouseMove = (event, label) => {
    setTooltip({
      isVisible: true,
      label,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const toggleUserMenu = () => {
    hideTooltip();
    setIsSearchOpen(false);
    // 加 setIsSearchOpen(false)是因為會員選單和搜尋框不應該同時打開
    setIsUserMenuOpen((prev) => !prev);
  }; // 點人像 icon 開 dropdown 時，tooltip 會消失

  // 點漢堡按鈕時，切換手機選單打開或關閉
  const toggleMobileMenu = () => {
    hideTooltip();
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    hideTooltip();
  };

  const hideTooltip = () => {
    setTooltip({
      isVisible: false,
      label: "",
      x: 0,
      y: 0,
    });
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false); // 關閉會員 dropdown
    hideTooltip(); // 順便關閉滑鼠提示，因為 dropdown 關掉時，tooltip 還卡著會很煩
  };

  // 更新收藏數量函式
  const updateFavoriteCount = () => {
    const favoriteIds = getFavoriteProductIds();
    // 從 localStorage 讀目前收藏 id

    setFavoriteCount(favoriteIds.length); // 把收藏數量放進 Header state
  };

  const handleLogout = () => {
    closeUserMenu(); // 關閉會員 dropdown
    setIsUserMenuOpen(false); // 關閉會員選單
    onLogout(); // 真正登出的邏輯交給 App.jsx
  };

  const openSearch = () => {
    // 打開搜尋
    hideTooltip();
    // 關掉滑鼠 tooltip，避免搜尋框打開後旁邊還殘留「搜尋商品」
    setIsUserMenuOpen(false);
    // 如果會員 dropdown 正在打開，就把它關掉
    // 不要讓搜尋框和會員選單同時存在，畫面會很髒
    setIsMobileMenuOpen(false);
    // 搜尋打開時關閉手機選單
    setIsSearchOpen(true); // 打開搜尋模式
  };

  const closeSearch = () => {
    // 關閉搜尋
    setIsSearchOpen(false); // 關閉搜尋框
    setSearchKeyword(""); // 清空搜尋文字
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // 阻止表單送出的預設行為，不然瀏覽器會重新整理頁面。

    const keyword = searchKeyword.trim();
    // 把前後空白拿掉。
    // 例如："  沙發  " 會變成： "沙發"
    if (!keyword) return;
    // 如果使用者什麼都沒輸入，就不要搜尋

    hideTooltip(); // tooltip 關掉
    setIsUserMenuOpen(false); // 會員 dropdown 關掉
    setIsMobileMenuOpen(false); // 手機選單關掉

    setIsSearchOpen(false);
    navigate(`/shop?keyword=${encodeURIComponent(keyword)}`);
    // 導向商品列表頁，並把搜尋字放到網址 query string
    // 例如搜尋：沙發
    // 會導到：/shop?keyword=%E6%B2%99%E7%99%BC
    // encodeURIComponent 是為了處理中文、空白、特殊符號。沒有它，網址可能壞掉
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 建立一個處理點擊事件的函式。每次你點頁面任何地方，它都會執行
      if (
        headerActionsRef.current &&
        // headerActionsRef.current 這是右側 icon 區域的 DOM。
        !headerActionsRef.current.contains(event.target)
        // 意思是：如果你點的位置，不在 headerActionsRef 這個區塊裡面，那就是點外面
      ) {
        setIsUserMenuOpen(false);
        hideTooltip();
        // 點外面就關閉 dropdown 和 tooltip
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // 監聽整份文件的滑鼠按下事件

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }; // 元件卸載時移除事件監聽，這很重要，否則事件監聽會殘留
  }, []);

  // Esc 關閉功能
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        // 如果使用者按的是 Esc，就執行關閉動作
        setIsUserMenuOpen(false);
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false); // Esc 也要關閉手機選單
        hideTooltip();
        // Esc 會關掉：會員 dropdown，搜尋框，tooltip
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // 監聽收藏變更事件
  useEffect(() => {
    updateFavoriteCount(); // Header 第一次載入時，先讀一次目前收藏數量

    window.addEventListener(FAVORITE_CHANGE_EVENT, updateFavoriteCount);
    // 監聽收藏變更事件
    // 只要商品卡點了收藏，favoriteStorage.js 會發出事件，Header 就會執行 updateFavoriteCount

    return () => {
      window.removeEventListener(FAVORITE_CHANGE_EVENT, updateFavoriteCount); // 清除事件監聽
    };
  }, []);

  // 路由切換時關閉 Header 浮層
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false); // 路由切換時也關閉手機選單
    hideTooltip();
  }, [location.pathname]);
  // 只要路由變了，就關閉 Header 上所有浮層，因為換頁後 dropdown 還開著會很怪

  return (
    <header className="site-header no-select">
      {/* 漢堡按鈕 JSX */}
      <div className="site-container header-inner">
        <button
          type="button"
          className={`header-mobile-toggle d-md-none ${
            isMobileMenuOpen ? "is-open" : ""
          }`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={isMobileMenuOpen}
        >
          <i className={isMobileMenuOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
        </button>

        <NavLink to="/" className="brand" aria-label="回到首頁">
          <span className="brand-icon">
            <i className="bi bi-house-heart"></i>
          </span>

          <span className="brand-name">沐居</span>
        </NavLink>

        <nav className="main-nav d-none d-md-flex">
          <NavLink to="/" end className={getNavClassName}>
            首頁
          </NavLink>

          <NavLink to="/shop" className={getNavClassName}>
            商品列表
          </NavLink>

          <NavLink to="/about" className={getNavClassName}>
            關於我們
          </NavLink>

          <NavLink to="/contact" className={getNavClassName}>
            聯絡我們
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={getNavClassName}>
              後台管理
            </NavLink>
          )}
        </nav>

        <div
          className={`header-icons ${isSearchOpen ? "is-searching" : ""}`}
          ref={headerActionsRef} // 把 ref 掛到 header-icons
        >
          <div className="header-icons__actions">
            <div className="header-user">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    className="header-icon header-icon--logged-in"
                    onClick={toggleUserMenu}
                    aria-label="會員選單"
                    onMouseMove={(event) => {
                      if (!isUserMenuOpen) {
                        handleMouseMove(event, "會員選單");
                      }
                    }}
                    onMouseEnter={(event) => {
                      if (!isUserMenuOpen) {
                        handleMouseMove(event, "會員選單");
                      }
                    }}
                    onMouseLeave={hideTooltip}
                  >
                    <i className="bi bi-person-check"></i>
                    <span className="header-icon__status-dot"></span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="header-user__dropdown">
                      <Link to="/member" onClick={closeUserMenu}>
                        會員中心
                      </Link>

                      <Link to="/member/orders" onClick={closeUserMenu}>
                        我的訂單
                      </Link>

                      <button type="button" onClick={handleLogout}>
                        登出
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  className="header-icon"
                  onClick={onAccountClick}
                  aria-label="會員登入"
                  onMouseMove={(event) => handleMouseMove(event, "會員登入")}
                  onMouseEnter={(event) => handleMouseMove(event, "會員登入")}
                  onMouseLeave={hideTooltip}
                >
                  <i className="bi bi-person"></i>
                </button>
              )}
            </div>

            <button
              type="button"
              className="header-icon"
              aria-label="搜尋商品"
              onClick={openSearch}
              onMouseMove={(event) => handleMouseMove(event, "搜尋商品")}
              onMouseEnter={(event) => handleMouseMove(event, "搜尋商品")}
              onMouseLeave={hideTooltip}
            >
              <i className="bi bi-search"></i>
            </button>

            <Link
              to="/member"
              className="header-icon header-icon--link"
              aria-label="收藏清單"
              onMouseMove={(event) => handleMouseMove(event, "收藏清單")}
              onMouseEnter={(event) => handleMouseMove(event, "收藏清單")}
              onMouseLeave={hideTooltip}
            >
              <i
                className={
                  favoriteCount > 0 ? "bi bi-heart-fill" : "bi bi-heart"
                }
              ></i>

              {favoriteCount > 0 && (
                <span className="header-icon__badge">{favoriteCount}</span>
              )}
              {/* 只有收藏數量大於 0 時，才顯示小徽章 */}
            </Link>

            <Link
              to="/cart"
              className="header-icon header-icon--link"
              aria-label="購物車"
              onMouseMove={(event) => handleMouseMove(event, "購物車")}
              onMouseEnter={(event) => handleMouseMove(event, "購物車")}
              onMouseLeave={hideTooltip}
            >
              <i
                className={cartCount > 0 ? "bi bi-cart-fill" : "bi bi-cart3"}
              ></i>

              {cartCount > 0 && (
                <span className="header-icon__badge">{cartCount}</span>
              )}
            </Link>
          </div>

          <form className="header-search" onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="search"
                className="form-control"
                placeholder="搜尋商品..."
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                aria-label="搜尋商品"
              />

              <button className="btn-search-submit" type="submit">
                搜尋
              </button>

              <button
                className="btn-search-close"
                type="button"
                onClick={closeSearch}
                aria-label="關閉搜尋"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* mobile nav JSX */}
      <nav
        className={`mobile-nav d-md-none ${isMobileMenuOpen ? "is-open" : ""}`}
        aria-label="手機版主選單"
      >
        <NavLink
          to="/"
          end
          className={getNavClassName}
          onClick={closeMobileMenu}
        >
          首頁
        </NavLink>

        <NavLink
          to="/shop"
          className={getNavClassName}
          onClick={closeMobileMenu}
        >
          商品列表
        </NavLink>

        <NavLink
          to="/about"
          className={getNavClassName}
          onClick={closeMobileMenu}
        >
          關於我們
        </NavLink>

        <NavLink
          to="/contact"
          className={getNavClassName}
          onClick={closeMobileMenu}
        >
          聯絡我們
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            className={getNavClassName}
            onClick={closeMobileMenu}
          >
            後台管理
          </NavLink>
        )}
      </nav>

      {tooltip.isVisible && (
        <div
          className="cursor-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          {tooltip.label}
        </div>
      )}
    </header>
  );
}

export default Header;
