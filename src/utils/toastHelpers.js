import { showToast } from "../store/toastSlice";

export const showSuccessToast = (message) => {
  // 建立一個 success 類型的 Toast action
  return showToast({
    type: "success",
    message,
  });
};

export const showErrorToast = (message) => {
  // 建立一個 error 類型的 Toast action
  return showToast({
    type: "error",
    message,
  });
};
