import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  clearCartAsync,
  fetchCartAsync,
  removeCartItemAsync,
  updateCartItemAsync,
} from "../store/cartSlice"; // 由 Redux thunk 管
// 這就是建立 cartApi.js 的價值。
// CartPage.jsx 不需要知道 API URL 怎麼組，只要呼叫函式
// 把購物車相關 API 封裝在 cartApi.js，讓頁面元件不用直接處理 API URL、HTTP method 和 request body 格式。這樣可以讓元件更專注在畫面狀態與事件處理，也讓 API 請求集中管理，後續如果 API 路徑或格式改變，只需要修改 api 檔案，不需要到每個元件裡面找 axios

import { showSuccessToast, showErrorToast } from "../utils/toastHelpers";
import CartSkeleton from "../components/skeleton/CartSkeleton";

const CartPage = () => {
  const { cart, isLoading } = useSelector((state) => state.cart);

  // const [isLoading, setIsLoading] = useState(false);
  const [updatingCartItemId, setUpdatingCartItemId] = useState(null);
  // 控制「哪一筆購物車商品正在更新」
  // 使用 updatingCartItemId 記錄目前正在操作的購物車品項，讓 loading 狀態可以精準套用到單一商品，避免使用者重複點擊造成 API 重複請求

  const [isClearingCart, setIsClearingCart] = useState(false);
  // 目前是不是正在清空購物車
  // 拿來控制：
  // 前往結帳按鈕 disabled
  // 清空購物車按鈕 disabled

  const isCartOperating = Boolean(updatingCartItemId) || isClearingCart;
  // 只要有商品正在更新，或正在清空購物車，就代表購物車目前正在操作中

  const dispatch = useDispatch();

  // 增加數量
  const handleUpdateCartItem = async (cartItem, nextQty) => {
    if (nextQty < 1) return;
    // 購物車數量不能小於 1
    // 基本防呆，避免送出小於 1 的購物車數量，減少不必要的 API 請求

    try {
      setUpdatingCartItemId(cartItem.id);
      // 目前正在更新這一筆購物車品項

      await dispatch(
        updateCartItemAsync({
          cartItemId: cartItem.id,
          productId: cartItem.product_id,
          qty: nextQty,
        }),
      ).unwrap();
      dispatch(showSuccessToast("商品數量已更新"));
      // showSuccessToast 建立 action
      // → dispatch 發送 action
      // → toastSlice reducer 更新 items
      // → ToastContainer 顯示 Toast
    } catch (error) {
      console.error("更新購物車數量失敗：", error);

      dispatch(showErrorToast("更新數量失敗，請稍後再試"));
    } finally {
      setUpdatingCartItemId(null);
    }
  };

  // 刪除商品
  const handleRemoveCartItem = async (cartItemId) => {
    const isConfirm = window.confirm("確定要刪除這項商品嗎？");
    // 如果按「確定」：isConfirm = true
    // 如果按「取消」：isConfirm = false

    if (!isConfirm) return; // 如果使用者沒有確認，就直接停止函式
    // !isConfirm：不是確認
    try {
      setUpdatingCartItemId(cartItemId);
      // 設定目前正在操作的購物車品項 id
      // 這樣畫面可以知道：哪一筆商品正在刪除
      // 之後該筆商品的按鈕可以 disabled，避免使用者連續點垃圾桶。

      await dispatch(removeCartItemAsync(cartItemId)).unwrap();
      dispatch(showSuccessToast("商品已從購物車移除"));
    } catch (error) {
      console.error("刪除購物車商品失敗：", error);

      dispatch(showErrorToast("刪除商品失敗，請稍後再試"));
    } finally {
      setUpdatingCartItemId(null); // 清除單筆 loading 狀態
    }
  };

  // 建立清空購物車的事件函式
  const handleClearCart = async () => {
    const isConfirm = window.confirm("確定要清空購物車嗎？");

    if (!isConfirm) return;

    try {
      setIsClearingCart(true);

      await dispatch(clearCartAsync()).unwrap();

      dispatch(showSuccessToast("購物車已清空"));
    } catch (error) {
      console.error("清空購物車失敗：", error);

      dispatch(showErrorToast("清空購物車失敗，請稍後再試"));
    } finally {
      setIsClearingCart(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);

  const hasCartItems = cart.carts.length > 0;
  // 把常用的條件判斷抽成語意化變數，例如 hasCartItems，讓 JSX 判斷更直覺，也提升程式碼可讀性

  return (
    <main className="cart-page">
      {/* <LoadingOverlay
        isLoading={isLoading}
        variant="fullscreen"
        text="購物車載入中..."
      /> */}

      <div className="site-container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-muted mb-1">Shopping Cart</p>
            <h1 className="h2 mb-0">購物車</h1>
          </div>

          {hasCartItems && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleClearCart}
              disabled={isClearingCart || Boolean(updatingCartItemId)}
            >
              {/* 正在清空購物車時，不能再點清空
              正在更新單筆商品時，也先不要清空整台購物車 */}
              {/* Boolean(updatingCartItemId) 是把目前正在操作的商品 ID 轉成布林值 */}
              {isClearingCart ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  清空中...
                </>
              ) : (
                "清空購物車"
              )}
            </button>
          )}
        </div>

        {isLoading ? (
          <CartSkeleton />
        ) : !hasCartItems ? (
          <div className="text-center py-5 border rounded-4">
            <i className="bi bi-cart-x fs-1"></i>
            <h2 className="h4 mt-3">購物車目前是空的</h2>
            <p className="text-muted">去挑幾件適合你空間的家具吧。</p>

            <Link to="/shop" className="btn btn-dark mt-2">
              前往商品列表
            </Link>
          </div>
        ) : (
          // 有商品
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>商品</th>
                      <th className="text-center">數量</th>
                      <th className="text-end">小計</th>
                      <th className="text-end">刪除</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.carts.map((cartItem) => {
                      const isUpdating = updatingCartItemId === cartItem.id;
                      // 宣告一個變數 isUpdating。
                      // 如果目前正在更新的購物車品項 id，等於這一列商品的 cartItem.id，代表這一列正在更新，isUpdating 就是 true。
                      // 否則 isUpdating 是 false。

                      return (
                        <tr key={cartItem.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={cartItem.product.imageUrl}
                                alt={cartItem.product.title}
                                style={{
                                  width: "88px",
                                  height: "88px",
                                  objectFit: "cover",
                                }}
                                className="rounded-3"
                              />

                              <div>
                                <h2 className="h6 mb-1">
                                  {cartItem.product.title}
                                </h2>

                                <p className="text-muted mb-0">
                                  NT$ {cartItem.product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="d-flex justify-content-center align-items-center gap-2">
                              <button
                                type="button"
                                className="btn btn-outline-dark btn-sm"
                                disabled={
                                  cartItem.qty <= 1 ||
                                  isUpdating ||
                                  isClearingCart
                                }
                                // 如果商品數量已經小於等於 1，或是這一列正在更新，
                                // 減號按鈕就不能按
                                onClick={() =>
                                  handleUpdateCartItem(
                                    cartItem,
                                    cartItem.qty - 1,
                                  )
                                }
                              >
                                {/* {isUpdating ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    aria-hidden="true"
                                  ></span>
                                ) : (
                                  "-"
                                )} */}
                                -
                              </button>

                              <span>{cartItem.qty}</span>

                              <button
                                type="button"
                                className="btn btn-outline-dark btn-sm"
                                disabled={isUpdating || isClearingCart}
                                onClick={() =>
                                  handleUpdateCartItem(
                                    cartItem,
                                    cartItem.qty + 1,
                                  )
                                }
                              >
                                {/* {isUpdating ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    aria-hidden="true"
                                  ></span>
                                ) : (
                                  "+"
                                )} */}
                                +
                              </button>
                            </div>
                          </td>

                          <td className="text-end">
                            NT$ {cartItem.final_total.toLocaleString()}
                          </td>

                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              disabled={isUpdating || isClearingCart}
                              onClick={() => handleRemoveCartItem(cartItem.id)}
                              aria-label="刪除商品"
                            >
                              {/* {isUpdating ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <i className="bi bi-trash"></i>
                              )} */}
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="border rounded-4 p-4">
                <h2 className="h5 mb-4">訂單摘要</h2>

                <div className="d-flex justify-content-between mb-2">
                  <span>商品總額</span>
                  <span>NT$ {cart.total.toLocaleString()}</span>
                </div>

                <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-3 mt-3">
                  <span>應付總額</span>
                  <span>NT$ {cart.final_total.toLocaleString()}</span>
                </div>

                {updatingCartItemId || isClearingCart ? (
                  <button
                    type="button"
                    className="btn btn-dark w-100 mt-4"
                    disabled
                  >
                    {/* <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    /> */}
                    購物車更新中...
                  </button>
                ) : (
                  <Link to="/checkout" className="btn btn-dark w-100 mt-4">
                    前往結帳
                  </Link>
                  // 可以結帳時：顯示 Link
                  // 不能結帳時：顯示 disabled button
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
