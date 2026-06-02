import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi"; // 抓 API 商品資料
import {
  FAVORITE_CHANGE_EVENT,
  getFavoriteProductIds, // 讀 localStorage 收藏 id
  toggleFavoriteProduct, // 在會員中心也可以取消收藏
} from "../utils/favoriteStorage";

const mockOrders = [
  {
    id: "MUJU-20260501",
    date: "2026/05/01",
    status: "已完成",
    total: 38600,
    items: 3,
  },
  {
    id: "MUJU-20260418",
    date: "2026/04/18",
    status: "配送中",
    total: 12800,
    items: 1,
  },
  {
    id: "MUJU-20260402",
    date: "2026/04/02",
    status: "處理中",
    total: 7200,
    items: 2,
  },
]; // 暫時資料

function MemberPage() {
  // 從 localStorage 讀登入資料
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // 因為 localStorage 讀出來都是字串。所以 "true" 要轉成真正的 boolean
  const userEmail = localStorage.getItem("userEmail") || "尚未登入"; // 如果有登入，就顯示登入信箱，如果沒有，就顯示：尚未登入
  const userRole = localStorage.getItem("userRole") || "guest";
  // 角色可能是：admin，member，guest
  // 這三行是會員中心的核心

  const isAdmin = userRole === "admin";
  // 判斷是不是管理員

  const [products, setProducts] = useState([]);
  // 存 API 回來的所有商品
  const [favoriteIds, setFavoriteIds] = useState([]);
  // 存 localStorage 裡的收藏商品 id
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  // 控制收藏區是否正在載入

  // 專門從 localStorage 讀收藏 id，放進 state
  const updateFavoriteIds = () => {
    setFavoriteIds(getFavoriteProductIds());
  };

  // 抓商品 API，然後同步讀收藏 id
  const fetchFavoriteProducts = async () => {
    try {
      setIsFavoriteLoading(true);

      const data = await getProducts();

      setProducts(data);
      updateFavoriteIds();
    } catch (error) {
      console.error("收藏商品載入失敗：", error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  // 進入會員頁時抓資料
  useEffect(() => {
    if (!isLoggedIn) return; // 如果沒有登入就停止

    fetchFavoriteProducts();
  }, [isLoggedIn]);
  // 未登入時不需要抓收藏商品

  useEffect(() => {
    const handleFavoriteChange = () => {
      updateFavoriteIds();
    };

    window.addEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange);

    return () => {
      window.removeEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange);
    };
  }, []);
  // 當你在商品列表點收藏或取消收藏時，favoriteStorage.js 會發出事件。
  // MemberPage 如果正在開著，就會重新讀收藏 id

  // 計算收藏商品
  const favoriteProducts = useMemo(() => {
    return products.filter((product) => favoriteIds.includes(product.id));
    // 從所有商品中找出有被收藏的商品，如果商品 id 在收藏清單裡，就留下
  }, [products, favoriteIds]);
  // 為什麼用 useMemo？
  // 因為這是根據 products 和 favoriteIds 算出來的衍生資料。
  // 只要這兩個沒變，就不用重新計算

  // 新增會員中心取消收藏函式
  const handleRemoveFavorite = (productId) => {
    const nextFavoriteIds = toggleFavoriteProduct(productId);

    setFavoriteIds(nextFavoriteIds);
  };
  // 點移除時：更新 localStorage，發出 favoriteChange 事件
  // 更新 MemberPage 自己的 favoriteIds state

  if (!isLoggedIn) {
    return (
      <section className="member-page">
        <div className="site-container">
          <div className="member-guest">
            <span className="member-page__label">Member Center</span>

            <h1>請先登入會員</h1>

            <p>登入後可以查看訂單紀錄、收藏商品與會員專屬資訊。</p>

            <Link to="/shop" className="btn btn-dark">
              先去逛逛商品
            </Link>
          </div>
        </div>
      </section>
    );
  }
  // 這是條件渲染。如果沒登入，就直接回傳「請先登入會員」的畫面。這樣後面的會員資料區塊就不會顯示

  return (
    <section className="member-page">
      <div className="site-container">
        <div className="member-page__heading">
          <span className="member-page__label">Member Center</span>

          <h1>會員中心</h1>

          <p>歡迎回來，這裡可以查看你的會員資料、訂單紀錄與收藏商品。</p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="member-profile-card">
              <div className="member-avatar">
                <i className="bi bi-person-check"></i>
              </div>

              <div>
                <span className="member-profile-card__tag">
                  {isAdmin ? "管理員帳號" : "一般會員"}
                </span>

                <h2>{userEmail}</h2>

                <p>
                  {isAdmin
                    ? "你目前擁有後台管理權限，也可以查看一般會員中心。"
                    : "你目前是沐居一般會員，可以查看訂單與收藏商品。"}
                </p>
              </div>

              <div className="member-profile-card__actions">
                <Link to="/shop" className="btn btn-dark">
                  繼續選購
                </Link>

                {isAdmin && (
                  <Link to="/admin" className="btn btn-outline-dark">
                    進入後台
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="member-dashboard-grid">
              <div className="member-stat-card">
                <span>訂單數</span>
                <strong>{mockOrders.length}</strong>
                <p>近期消費紀錄</p>
              </div>

              <div className="member-stat-card">
                <span>收藏商品</span>
                <strong>{favoriteProducts.length}</strong>
                <p>目前收藏清單</p>
              </div>

              <div className="member-stat-card">
                <span>會員身份</span>
                <strong>{isAdmin ? "Admin" : "Member"}</strong>
                <p>目前登入角色</p>
              </div>
            </div>

            <div className="member-panel mt-4">
              <div className="member-panel__heading">
                <div>
                  <h2>近期訂單</h2>
                  <p>目前使用假資料展示，之後會接上訂單 API。</p>
                </div>

                <Link to="/member/orders">查看全部</Link>
              </div>

              <div className="member-order-list">
                {mockOrders.map((order) => (
                  <article className="member-order-card" key={order.id}>
                    <div>
                      <span className="member-order-card__id">{order.id}</span>
                      <p>{order.date}</p>
                    </div>

                    <div>
                      <span className="member-order-card__status">
                        {order.status}
                      </span>
                      <p>{order.items} 件商品</p>
                    </div>

                    <strong>NT$ {order.total.toLocaleString()}</strong>
                  </article>
                ))}
              </div>
            </div>

            <div className="member-panel mt-4">
              <div className="member-panel__heading">
                <div>
                  <h2>收藏商品</h2>
                  <p>這裡會顯示你在商品列表收藏的家具。</p>
                </div>

                <Link to="/shop">前往商品列表</Link>
              </div>

              {isFavoriteLoading && (
                <div className="member-empty-box">
                  <i className="bi bi-arrow-repeat"></i>
                  <p>收藏商品載入中...</p>
                </div>
              )}

              {!isFavoriteLoading && favoriteProducts.length === 0 && (
                <div className="member-empty-box">
                  <i className="bi bi-heart"></i>
                  <p>目前還沒有收藏商品。</p>
                </div>
              )}

              {!isFavoriteLoading && favoriteProducts.length > 0 && (
                <div className="member-favorite-grid">
                  {favoriteProducts.map((product) => (
                    <article className="member-favorite-card" key={product.id}>
                      <img src={product.imageUrl} alt={product.title} />

                      <div>
                        <span>{product.category}</span>
                        <h3>{product.title}</h3>
                        <p>NT$ {product.price.toLocaleString()}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFavorite(product.id)}
                      >
                        移除
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MemberPage;
