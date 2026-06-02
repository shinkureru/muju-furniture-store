import { useEffect, useMemo, useState } from "react";
// useState → 存商品資料、目前輪播第幾張、loading 狀態
// useEffect → 進入首頁時抓商品、自動輪播
// useMemo → 計算 Banner 要顯示的商品清單
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";

const SLIDE_LIMIT = 5; // 最多取 5 筆商品當 Banner 輪播
// 為什麼不要全部 30 筆？
// 因為首頁 Banner 是精選，不是商品列表。
// 你要讓使用者感覺「被推薦」，不是被商品雨砸臉
const AUTO_PLAY_INTERVAL = 4500;
// 每 4.5 秒換下一張，太快會煩，太慢會像睡著

// 洗牌函式
const shuffleProducts = (products) => {
  return [...products].sort(() => Math.random() - 0.5); // 把商品順序打亂
};
// [...products] 是複製一份新陣列。不要直接改原本的 products，因為 React state 不該被直接修改
// sort(() => Math.random() - 0.5) 這是一種簡單洗牌法。
// 正式大型資料要用 Fisher-Yates，但你現在只是首頁小輪播，這樣足夠

function Banner() {
  const [products, setProducts] = useState([]); // 存 API 回來的商品
  const [activeIndex, setActiveIndex] = useState(0); // 目前顯示第幾張 Banner，一開始是第 0 張
  const [isLoading, setIsLoading] = useState(false);
  // 控制是否正在載入。
  // 目前我們只用它在 fallback 文字上，之後也可以加 LoadingOverlay

  // 計算 Banner 商品
  const bannerProducts = useMemo(() => {
    const enabledProducts = products.filter(
      (product) => product.is_enabled === 1, // 先篩出已啟用商品
    ); // API 的啟用欄位是 is_enabled

    return shuffleProducts(enabledProducts).slice(0, SLIDE_LIMIT);
  }, [products]); // 只取前 5 筆

  const activeProduct = bannerProducts[activeIndex];
  // 從輪播商品裡，取出目前這一張

  // 建立一個非同步函式，用來抓商品
  const fetchBannerProducts = async () => {
    try {
      setIsLoading(true); // 開始載入

      const data = await getProducts(); // 呼叫商品 API

      setProducts(data);
      // 把 API 回來的商品放進 state。
      // 這行會觸發重新 render，bannerProducts 也會重新計算
    } catch (error) {
      console.error("首頁 Banner 商品載入失敗：", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 點下面圓點時，切到指定商品
  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // 下一張
  const goToNextSlide = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex === bannerProducts.length - 1) {
        return 0;
      }
      return prevIndex + 1;
    });
  }; // 如果目前已經是最後一張，就回到第 0 張

  // 第一次進入首頁抓資料
  useEffect(() => {
    fetchBannerProducts();
  }, []);

  // 自動輪播，每 4.5 秒換下一張
  useEffect(() => {
    if (bannerProducts.length <= 1) return;
    // 如果商品只有 0 或 1 筆，就不要輪播

    const timer = setInterval(() => {
      // 建立定時器
      goToNextSlide();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      clearInterval(timer);
      // 清除定時器。如果不清掉，元件離開後 timer 還在跑
    };
  }, [bannerProducts.length]);

  // 商品改變時重設第一張
  useEffect(() => {
    setActiveIndex(0);
  }, [bannerProducts.length]);
  // 當輪播商品數量改變時，回到第一張。避免 activeIndex 超出陣列範圍

  if (!activeProduct) {
    return (
      <section className="hero-section no-select">
        <div className="hero-bg"></div>

        <div className="container hero-container">
          <div className="hero-card">
            <p className="eyebrow">Muju Collection</p>
            <h1>
              為日常生活，
              <br />
              留下一點溫柔
            </h1>
            <p className="hero-desc">
              {isLoading
                ? "正在為你整理精選家具..."
                : "精選溫潤材質、柔和色調與實用設計，讓家具成為日常風景。"}
            </p>
            <Link to="/shop" className="btn btn-primary-custom">
              立即選購
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section hero-section--dynamic no-select">
      <div className="hero-bg">
        <img src={activeProduct.imageUrl} alt={activeProduct.title} />
      </div>

      <div className="hero-bg-overlay"></div>

      <div className="container hero-container">
        <div className="hero-card hero-card--dynamic">
          <p className="eyebrow">{activeProduct.category}</p>

          <h1>{activeProduct.title}</h1>

          <p className="hero-desc">{activeProduct.description}</p>

          <div className="hero-product-meta">
            <span>NT$ {activeProduct.price.toLocaleString()}</span>

            {activeProduct.origin_price > activeProduct.price && (
              <del>NT$ {activeProduct.origin_price.toLocaleString()}</del>
            )}
          </div>

          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary-custom">
              查看商品
            </Link>

            <button
              type="button"
              className="hero-next-btn"
              onClick={goToNextSlide}
            >
              下一件
            </button>
          </div>
        </div>

        <div className="hero-preview">
          <img src={activeProduct.imageUrl} alt={activeProduct.title} />
        </div>

        <div className="hero-dots" aria-label="首頁商品輪播切換">
          {bannerProducts.map((product, index) => (
            <button
              type="button"
              key={product.id}
              className={activeIndex === index ? "is-active" : ""}
              onClick={() => goToSlide(index)}
              aria-label={`切換到 ${product.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Banner;
