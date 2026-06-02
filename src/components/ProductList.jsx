import { useEffect, useMemo, useState } from "react";
import { BsHeart } from "react-icons/bs";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi"; // 抓 API 所有商品

const getRandomProducts = (products, count = 8) => {
  // 隨機取 8 筆
  return [...products].sort(() => Math.random() - 0.5).slice(0, count);
};

const formatPrice = (price = 0) => {
  return price.toLocaleString();
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error("首頁人氣商品載入失敗：", error);
        setErrorMessage("商品載入失敗，請稍後再試");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const randomProducts = useMemo(() => {
    return getRandomProducts(products, 8);
  }, [products]);

  return (
    <section className="product-section section-padding pt-2">
      <div className="site-container">
        <div className="section-title">
          <h2>人氣商品</h2>
          <p>精選兼具美感與實用性的居家單品，讓每個角落都更有溫度。</p>
        </div>

        {isLoading && (
          <div className="text-center py-5">
            <div
              className="spinner-border mb-3"
              role="status"
              aria-hidden="true"
            />
            <p className="text-muted mb-0">人氣商品載入中...</p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="text-center py-5">
            <p className="text-muted mb-0">{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && (
          <div className="row g-4">
            {randomProducts.map((product) => (
              <div className="col-6 col-lg-3" key={product.id}>
                <article className="product-card">
                  <div className="product-img-wrap">
                    <Link to={`/shop/${product.id}`}>
                      <img src={product.imageUrl} alt={product.title} />
                    </Link>

                    {product.is_enabled && (
                      <span className="badge-tag new">熱銷</span>
                    )}

                    <div className="product-overlay no-select">
                      <Link
                        to={`/shop/${product.id}`}
                        className="add-cart-btn text-decoration-none"
                      >
                        查看商品
                      </Link>

                      <div className="overlay-actions">
                        <span>分享</span>
                        <span>比較</span>
                        <span>
                          <BsHeart /> 收藏
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="product-body">
                    <h3>
                      <Link
                        to={`/shop/${product.id}`}
                        className="text-reset text-decoration-none"
                      >
                        {product.title}
                      </Link>
                    </h3>

                    <p>{product.category}</p>

                    <div className="price-row">
                      <strong>NT$ {formatPrice(product.price)}</strong>

                      {product.origin_price > product.price && (
                        <del>NT$ {formatPrice(product.origin_price)}</del>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-5">
          <Link to="/shop" className="btn btn-outline-custom">
            查看更多商品
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
