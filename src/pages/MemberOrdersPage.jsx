import { Link } from "react-router-dom";

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
];

const formatPrice = (price = 0) => {
  return price.toLocaleString();
};

const MemberOrdersPage = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return (
      <section className="member-page">
        <div className="site-container">
          <div className="member-guest">
            <span className="member-page__label">Orders</span>

            <h1>請先登入會員</h1>

            <p>登入後可以查看你的訂單紀錄。</p>

            <Link to="/shop" className="btn btn-dark">
              先去逛逛商品
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="member-page">
      <div className="site-container">
        <div className="member-page__heading">
          <span className="member-page__label">Orders</span>

          <h1>我的訂單</h1>

          <p>這裡目前使用展示資料，之後可以串接會員訂單 API。</p>
        </div>

        <div className="member-panel">
          <div className="member-panel__heading">
            <div>
              <h2>訂單紀錄</h2>
              <p>查看近期訂單狀態與消費紀錄。</p>
            </div>

            <Link to="/member">返回會員中心</Link>
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

                <strong>NT$ {formatPrice(order.total)}</strong>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberOrdersPage;
