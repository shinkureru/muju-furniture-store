import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/main.scss";
import AppRouter from "./router/AppRouter.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* 把 Redux store 提供給整個 React App */}
      <AppRouter />
    </Provider>
  </React.StrictMode>,
);
