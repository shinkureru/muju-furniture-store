import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../api/orderApi";
import { fetchCartAsync } from "../store/cartSlice";
// import { showToast } from "../store/toastSlice";
import { showSuccessToast, showErrorToast } from "../utils/toastHelpers";

// react-hook-form 處理 submit
const CheckoutPage = () => {
  const { cart } = useSelector((state) => state.cart);
  // 從 Redux store 裡的 cartSlice 取出 cart 資料。
  // 這個 cart 裡面有 carts、total、final_total

  const hasCartItems = cart.carts.length > 0;
  // 宣告 hasCartItems
  // 如果 cart.carts 裡面有商品，hasCartItems 就是 true。
  // 如果沒有商品，就是 false

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const {
    register, // 把 input 註冊進 react-hook-form
    handleSubmit, // 處理表單送出
    formState: { errors }, // 表單驗證錯誤狀態
  } = useForm();

  const onSubmit = async (formData) => {
    if (!hasCartItems) return;

    setIsSubmittingOrder(true); // 控制「訂單正在送出中」的狀態

    // orderData 是我們自己整理出來的資料
    const orderData = {
      user: {
        name: formData.name,
        email: formData.email,
        tel: formData.tel,
        address: formData.address,
      },
      message: formData.message || "",
    };

    try {
      const result = await createOrder(orderData);

      dispatch(showSuccessToast("訂單建立成功"));

      // await dispatch(fetchCartAsync()); // 訂單成功後，跳轉到 /order/這筆訂單的 ID

      await dispatch(fetchCartAsync()).unwrap();
      // 訂單建立成功後，重新同步購物車。如果同步購物車失敗，
      // 要讓錯誤真的進入 catch，而不是被 Redux thunk 包在 action 裡面悄悄帶過
      // unwrap() 是 Redux Toolkit async thunk 提供的方法

      // 為什麼要加 .unwrap()
      // 一般 await dispatch(fetchCartAsync()) 拿到的不是普通 API response，而是一個 Redux action 結果。
      // 也就是說，即使 thunk 裡面的 API 失敗，它也可能回傳一個 rejected action，而不是像普通 await axios(...) 一樣直接 throw error

      navigate(`/order/${result.orderId}`);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "訂單建立失敗，請稍後再試";

      dispatch(showErrorToast(errorMessage));
    } finally {
      setIsSubmittingOrder(false);
    }
  }; // 表單送出成功後執行的函式

  if (!hasCartItems) {
    return (
      <main className="checkout-page">
        <div className="site-container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="border rounded-4 p-5 text-center bg-white">
                <div className="mb-4">
                  <i className="bi bi-cart-x display-4 text-muted"></i>
                </div>

                <h1 className="h3 mb-3">購物車目前沒有商品</h1>

                <p className="text-muted mb-4">
                  請先選購商品後，再回來填寫訂單資料。
                </p>

                <Link to="/shop" className="btn btn-dark px-5">
                  前往商品列表
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="site-container py-5">
        <div className="mb-5">
          <p className="text-muted mb-1">Checkout</p>
          <h1 className="h2 mb-0">填寫訂單資料</h1>
        </div>

        <div className="row g-5">
          <div className="col-lg-7">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label">
                  收件人姓名
                </label>

                <input
                  id="name"
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="請輸入姓名"
                  {...register("name", {
                    required: "請輸入姓名",
                  })}
                />

                <div className="invalid-feedback">{errors.name?.message}</div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="example@email.com"
                  {...register("email", {
                    required: "請輸入 Email",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email 格式不正確",
                    },
                  })}
                />

                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>

              <div className="mb-4">
                <label htmlFor="tel" className="form-label">
                  電話
                </label>

                <input
                  id="tel"
                  type="tel"
                  className={`form-control ${errors.tel ? "is-invalid" : ""}`}
                  placeholder="0912345678"
                  {...register("tel", {
                    required: "請輸入電話",
                  })}
                />

                <div className="invalid-feedback">{errors.tel?.message}</div>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="form-label">
                  地址
                </label>

                <input
                  id="address"
                  type="text"
                  className={`form-control ${
                    errors.address ? "is-invalid" : ""
                  }`}
                  placeholder="請輸入地址"
                  {...register("address", {
                    required: "請輸入地址",
                  })}
                />

                <div className="invalid-feedback">
                  {errors.address?.message}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="form-label">
                  留言
                </label>

                <textarea
                  id="message"
                  rows="4"
                  className="form-control"
                  placeholder="有任何需求都可以告訴我們"
                  {...register("message")}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-dark px-5"
                disabled={isSubmittingOrder}
              >
                {isSubmittingOrder ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    訂單建立中...
                  </>
                ) : (
                  "送出訂單"
                )}
              </button>
            </form>
          </div>

          <div className="col-lg-5">
            <div className="border rounded-4 p-4">
              <h2 className="h5 mb-4">訂單摘要</h2>

              <div className="checkout-summary-list mb-4">
                {cart.carts.map((cartItem) => (
                  // 如果購物車有商品，就用 map 把每一筆商品列出來，
                  // 包含商品名稱、單價、數量與小計
                  <div
                    key={cartItem.id}
                    className="d-flex justify-content-between gap-3 mb-3"
                  >
                    <div>
                      <p className="mb-1 fw-bold">{cartItem.product.title}</p>
                      <p className="text-muted mb-0">
                        NT$ {cartItem.product.price.toLocaleString()} ×{" "}
                        {cartItem.qty}
                      </p>
                    </div>

                    <strong>NT$ {cartItem.final_total.toLocaleString()}</strong>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>商品總額</span>
                <strong>NT$ {cart.total.toLocaleString()}</strong>
              </div>

              <div className="border-top pt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">應付總額</span>

                  <strong className="fs-5">
                    NT$ {cart.final_total.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
