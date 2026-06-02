import { BsHeart } from "react-icons/bs";
import { Link } from "react-router-dom";

const products = [
  {
    name: "Syltherine",
    desc: "質感單椅",
    price: "NT$ 2,500",
    oldPrice: "NT$ 3,500",
    badge: "-30%",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Leviosa",
    desc: "輕盈餐椅",
    price: "NT$ 2,500",
    oldPrice: "",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
    active: true,
  },
  {
    name: "Lolito",
    desc: "奢華雙人沙發",
    price: "NT$ 7,000",
    oldPrice: "NT$ 14,000",
    badge: "-50%",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Respira",
    desc: "戶外桌椅組",
    price: "NT$ 500",
    oldPrice: "",
    badge: "新品",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Grifo",
    desc: "柔光夜燈",
    price: "NT$ 1,500",
    oldPrice: "",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Muggo",
    desc: "日常馬克杯",
    price: "NT$ 150",
    oldPrice: "",
    badge: "新品",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Pingky",
    desc: "柔感寢具組",
    price: "NT$ 7,000",
    oldPrice: "NT$ 14,000",
    badge: "-50%",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Potty",
    desc: "極簡植栽盆",
    price: "NT$ 500",
    oldPrice: "",
    badge: "新品",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
  },
];

function ProductList() {
  return (
    <section className="product-section section-padding pt-2">
      <div className="site-container">
        <div className="section-title">
          <h2>人氣商品</h2>
          <p>精選兼具美感與實用性的居家單品，讓每個角落都更有溫度。</p>
        </div>

        <div className="row g-4">
          {products.map((product) => (
            <div className="col-6 col-lg-3" key={product.name}>
              <article
                className={`product-card ${product.active ? "is-active" : ""}`}
              >
                <div className="product-img-wrap">
                  <img src={product.image} alt={product.name} />

                  {product.badge && (
                    <span
                      className={`badge-tag ${product.badge === "新品" ? "new" : ""}`}
                    >
                      {product.badge}
                    </span>
                  )}

                  <div className="product-overlay no-select">
                    <button className="add-cart-btn">加入購物車</button>
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
                  <h3>{product.name}</h3>
                  <p>{product.desc}</p>
                  <div className="price-row">
                    <strong>{product.price}</strong>
                    {product.oldPrice && <del>{product.oldPrice}</del>}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link to="/shop" className="btn btn-outline-custom">
            查看更多商品
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProductList;
