// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "../App.jsx";
import HomePage from "../pages/HomePage.jsx";
import ShopPage from "../pages/ShopPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import MemberPage from "../pages/MemberPage.jsx";
import MemberOrdersPage from "../pages/MemberOrdersPage.jsx";
import CartPage from "../pages/CartPage";
import AdminPage from "../pages/AdminPage.jsx";
import AdminProductsPage from "../pages/AdminProductsPage.jsx";
import AdminDeleteProductsPage from "../pages/AdminDeleteProductsPage.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";
import ProductDetailPage from "../pages/ProductDetailPage.jsx";
import CheckoutPage from "../pages/CheckoutPage";
import OrderCompletePage from "../pages/OrderCompletePage.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "member",
        element: <MemberPage />,
      },
      {
        path: "member/orders",
        element: <MemberOrdersPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "admin/products",
        element: <AdminProductsPage />,
      },
      {
        path: "admin/tools/delete-products",
        element: <AdminDeleteProductsPage />,
      },
      {
        path: "admin/login",
        element: <AdminLoginPage />,
      },
      {
        path: "shop/:productId",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "order/:orderId",
        element: <OrderCompletePage />,
      },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
