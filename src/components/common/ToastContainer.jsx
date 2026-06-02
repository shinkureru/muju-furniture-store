import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "../../store/toastSlice";

const ToastItem = ({ toast }) => {
  const dispatch = useDispatch();

  const [isLeaving, setIsLeaving] = useState(false);
  // 宣告一個 isLeaving 狀態

  useEffect(() => {
    const leaveTimerId = window.setTimeout(() => {
      setIsLeaving(true);
    }, 2200);
    // 2.2 秒後 → 開始播放淡出動畫

    const removeTimerId = window.setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 2500);
    // 再 0.3 秒後 → 真正刪除 Toast

    return () => {
      window.clearTimeout(leaveTimerId);
      window.clearTimeout(removeTimerId);
    };
  }, [dispatch, toast.id]);

  const iconClassName =
    toast.type === "success"
      ? "bi bi-check-circle-fill"
      : "bi bi-exclamation-triangle-fill";

  return (
    <div
      className={`app-toast app-toast--${toast.type} ${
        isLeaving ? "app-toast--leaving" : ""
      }`}
      role="status"
    >
      <i className={iconClassName}></i>

      <span>{toast.message}</span>

      <button
        type="button"
        className="app-toast__close"
        aria-label="關閉提示"
        onClick={() => dispatch(removeToast(toast.id))}
      >
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const toastItems = useSelector((state) => state.toast.items);
  // 從 Redux 讀目前所有 Toast

  if (toastItems.length === 0) return null;

  return (
    <div className="app-toast-container">
      {toastItems.map((toast) => (
        // 有幾筆 Toast，就顯示幾個 Toast
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
