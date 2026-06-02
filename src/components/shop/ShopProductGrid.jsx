import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getFavoriteProductIds,
  toggleFavoriteProduct,
} from "../../utils/favoriteStorage";

function ShopProductGrid({ viewMode, products }) {
  const [favoriteIds, setFavoriteIds] = useState([]); // 存目前收藏商品 id

  const pageProducts = products;

  useEffect(() => {
    setFavoriteIds(getFavoriteProductIds());
  }, []);
  // 元件第一次出現在畫面時，從 localStorage 讀收藏資料

  // 新增收藏點擊函式
  const handleToggleFavorite = (productId) => {
    const nextFavoriteIds = toggleFavoriteProduct(productId);
    // 這個函式會：更新 localStorage
    // 回傳更新後的收藏 id 陣列

    setFavoriteIds(nextFavoriteIds); // 更新 React state
    // 這行很重要。因為 localStorage 改變，不會自動讓 React 重新 render
  };

  return (
    <section className="shop-products">
      <div className="site-container">
        <div
          className={`shop-products__grid ${
            viewMode === "list" ? "is-list" : ""
          }`}
        >
          {pageProducts.map((product) => {
            const hasDiscount = product.origin_price > product.price;

            const discountPercent = hasDiscount
              ? Math.round(
                  ((product.origin_price - product.price) /
                    product.origin_price) *
                    100,
                )
              : 0;

            return (
              <article className="shop-card" key={product.id}>
                <div className="shop-card__image">
                  <Link
                    to={`/shop/${product.id}`}
                    className="shop-card__image-link"
                    aria-label={`查看 ${product.title} 詳情`}
                  >
                    <img src={product.imageUrl} alt={product.title} />
                  </Link>

                  <button
                    type="button"
                    className={`shop-card__favorite ${
                      favoriteIds.includes(product.id) ? "is-active" : ""
                    }`}
                    onClick={() => handleToggleFavorite(product.id)}
                    aria-label={
                      favoriteIds.includes(product.id)
                        ? "取消收藏商品"
                        : "收藏商品"
                    }
                  >
                    <i
                      className={
                        favoriteIds.includes(product.id)
                          ? "bi bi-heart-fill"
                          : "bi bi-heart"
                      }
                    ></i>
                  </button>
                </div>

                <div className="shop-card__body">
                  <div className="shop-card__main">
                    <div className="shop-card__title-row">
                      <h3>
                        <Link
                          to={`/shop/${product.id}`}
                          className="shop-card__title-link"
                        >
                          {product.title}
                        </Link>
                      </h3>

                      {hasDiscount && (
                        <span className="shop-card__label is-sale">優惠</span>
                      )}
                    </div>

                    <p>{product.category}</p>

                    <p className="shop-card__desc">{product.description}</p>
                  </div>

                  <div className="shop-card__price">
                    <strong>NT$ {product.price.toLocaleString()}</strong>

                    {hasDiscount && (
                      <div className="shop-card__old-price">
                        <del>NT$ {product.origin_price.toLocaleString()}</del>

                        <span className="shop-card__discount">
                          -{discountPercent}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="shop-card__actions">
                    <button type="button">加入購物車</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ShopProductGrid;
