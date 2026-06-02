import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import {
  getFavoriteProductIds,
  toggleFavoriteProduct,
} from "../utils/favoriteStorage";
import LoadingOverlay from "../components/common/LoadingOverlay";

import { useDispatch } from "react-redux";
import { addCartItemAsync } from "../store/cartSlice";

import { showSuccessToast, showErrorToast } from "../utils/toastHelpers";

function ProductDetailPage() {
  const { productId } = useParams(); // 動態路由的核心
  // 如果網址是：/shop/-OsABC123
  // 那：productId = "-OsABC123"
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cartLoadingId, setCartLoadingId] = useState(null);

  const dispatch = useDispatch();

  const isFavorite = product ? favoriteIds.includes(product.id) : false;
  // 如果目前商品 id 在收藏清單裡，就顯示已收藏

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getProductById(productId);
      // 根據網址上的 productId 去 API 取得單一商品

      setProduct(data);
    } catch (error) {
      console.error("商品詳情載入失敗：", error);
      setErrorMessage("商品資料載入失敗，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;

    const nextFavoriteIds = toggleFavoriteProduct(product.id);

    setFavoriteIds(nextFavoriteIds);
  };

  const handleAddToCart = async () => {
    try {
      setCartLoadingId(product.id);

      await dispatch(
        addCartItemAsync({
          productId: product.id,
          qty: 1,
        }), // 本身回傳的是 Redux action 結果
      ).unwrap(); // 讓它比較像一般 Promise：成功 → 繼續往下，失敗 → 進 catch

      dispatch(showSuccessToast("已加入購物車"));
    } catch (error) {
      console.error("加入購物車失敗：", error);
      dispatch(showErrorToast("加入購物車失敗，請稍後再試"));
    } finally {
      setCartLoadingId(null);
    }
  };

  useEffect(() => {
    setFavoriteIds(getFavoriteProductIds());
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (errorMessage) {
    return (
      <main className="product-detail-page">
        <div className="site-container">
          <div className="alert alert-danger rounded-4 my-5" role="alert">
            {errorMessage}
          </div>

          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => navigate(-1)}
          >
            返回上一頁
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      <LoadingOverlay
        isLoading={isLoading}
        variant="fullscreen"
        text="商品資料載入中..."
      />

      <div className="site-container">
        <nav className="product-detail-breadcrumb">
          <Link to="/">首頁</Link>
          <span>/</span>
          <Link to="/shop">商品列表</Link>
          <span>/</span>
          <strong>{product?.title || "商品詳情"}</strong>
        </nav>

        {product && (
          <section className="product-detail">
            <div className="product-detail__gallery">
              <div className="product-detail__main-image">
                <img src={product.imageUrl} alt={product.title} />
              </div>

              {product.imagesUrl?.length > 0 && (
                <div className="product-detail__thumbs">
                  {product.imagesUrl.slice(0, 4).map((imageUrl) => (
                    <img
                      key={imageUrl}
                      src={imageUrl}
                      alt={`${product.title} 商品圖片`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="product-detail__content">
              <span className="product-detail__category">
                {product.category}
              </span>

              <h1>{product.title}</h1>

              <div className="product-detail__price">
                <strong>NT$ {product.price.toLocaleString()}</strong>

                {product.origin_price > product.price && (
                  <del>NT$ {product.origin_price.toLocaleString()}</del>
                )}
              </div>

              <p className="product-detail__description">
                {product.description}
              </p>

              <div className="product-detail__meta">
                <div>
                  <span>顏色</span>
                  <strong>{product.color || "未標示"}</strong>
                </div>

                <div>
                  <span>材質</span>
                  <strong>{product.material || "未標示"}</strong>
                </div>

                <div>
                  <span>單位</span>
                  <strong>{product.unit || "件"}</strong>
                </div>
              </div>

              <div className="product-detail__actions">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={handleAddToCart}
                  // disabled={cartLoadingId === product.id}
                  disabled={cartLoadingId === product.id}
                >
                  {/* {cartLoadingId === product.id ? "加入中..." : "加入購物車"} */}
                  {cartLoadingId === product.id ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      ></span>
                      加入中...
                    </>
                  ) : (
                    "加入購物車"
                  )}
                </button>

                <button
                  type="button"
                  className={`btn ${
                    isFavorite ? "btn-outline-danger" : "btn-outline-dark"
                  }`}
                  onClick={handleToggleFavorite}
                >
                  <i
                    className={
                      isFavorite ? "bi bi-heart-fill me-2" : "bi bi-heart me-2"
                    }
                  ></i>
                  {isFavorite ? "已收藏" : "加入收藏"}
                </button>
              </div>

              {product.content && (
                <div className="product-detail__content-text">
                  <h2>商品說明</h2>
                  <p>{product.content}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ProductDetailPage;
