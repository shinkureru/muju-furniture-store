import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../api/orderApi";

const OrderCompletePage = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const orderProducts = Object.values(order?.products || {});

  const formatPrice = (price = 0) => {
    return price.toLocaleString();
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      setIsLoading(true);
      setErrorMessage("");

      try {
        const result = await getOrderById(orderId);

        setOrder(result.order);
      } catch (error) {
        const message =
          error?.response?.data?.message || "訂單資料載入失敗，請稍後再試";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <section className="container py-5">
        <div className="text-center py-5">
          <div
            className="spinner-border mb-3"
            role="status"
            aria-hidden="true"
          />
          <p className="text-muted mb-0">訂單資料載入中...</p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm text-center p-4 p-md-5">
              <div className="mb-4">
                <i className="bi bi-exclamation-circle text-danger display-3" />
              </div>

              <h1 className="h3 fw-bold mb-3">訂單資料載入失敗</h1>

              <p className="text-muted mb-4">{errorMessage}</p>

              <Link to="/shop" className="btn btn-dark px-4">
                返回商品列表
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card border-0 shadow-sm p-4 p-md-5">
            <div className="text-center mb-5">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success display-3" />
              </div>

              <h1 className="h3 fw-bold mb-3">訂單建立成功</h1>

              <p className="text-muted mb-0">
                感謝您的訂購，我們已收到您的訂單。
              </p>
            </div>

            <div className="bg-light rounded-3 p-3 mb-4">
              <p className="mb-1 text-muted">訂單編號</p>
              <p className="mb-0 fw-semibold text-break">{orderId}</p>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <h2 className="h5 fw-bold mb-3">訂購人資料</h2>

                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <span className="text-muted">姓名：</span>
                    {order?.user?.name}
                  </li>

                  <li className="mb-2">
                    <span className="text-muted">Email：</span>
                    {order?.user?.email}
                  </li>

                  <li className="mb-2">
                    <span className="text-muted">電話：</span>
                    {order?.user?.tel}
                  </li>

                  <li className="mb-2">
                    <span className="text-muted">地址：</span>
                    {order?.user?.address}
                  </li>

                  {order?.message && (
                    <li>
                      <span className="text-muted">留言：</span>
                      {order.message}
                    </li>
                  )}
                </ul>
              </div>

              <div className="col-md-6">
                <h2 className="h5 fw-bold mb-3">訂單狀態</h2>

                <p className="mb-2">
                  <span className="text-muted">付款狀態：</span>
                  {order?.is_paid ? (
                    <span className="badge text-bg-success">已付款</span>
                  ) : (
                    <span className="badge text-bg-warning">尚未付款</span>
                  )}
                </p>

                <p className="mb-0">
                  <span className="text-muted">訂單金額：</span>
                  <span className="fw-bold">
                    NT$ {formatPrice(order?.total)}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-5">
              <h2 className="h5 fw-bold mb-3">商品明細</h2>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th scope="col">商品</th>
                      <th scope="col" className="text-end">
                        單價
                      </th>
                      <th scope="col" className="text-center">
                        數量
                      </th>
                      <th scope="col" className="text-end">
                        小計
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orderProducts.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="fw-semibold">
                            {item.product?.title}
                          </div>
                        </td>

                        <td className="text-end">
                          NT$ {formatPrice(item.product?.price)}
                        </td>

                        <td className="text-center">{item.qty}</td>

                        <td className="text-end fw-semibold">
                          NT$ {formatPrice(item.final_total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">
                        總金額
                      </td>

                      <td className="text-end fw-bold">
                        NT$ {formatPrice(order?.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Link to="/" className="btn btn-outline-dark px-4">
                返回首頁
              </Link>

              <Link to="/shop" className="btn btn-dark px-4">
                繼續逛商品
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderCompletePage;

// 從網址拿出 orderId，然後顯示「訂單建立成功」和訂單編號。
// 使用者可以點按鈕回首頁，也可以回商品列表繼續逛
