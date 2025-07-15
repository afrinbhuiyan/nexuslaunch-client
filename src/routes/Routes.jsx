import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Error from "../pages/Error";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import PrivateRoute from "./PrivateRoute";
import AddProduct from "../pages/products/AddProduct";
import AllProducts from "../pages/products/AllProducts";
import ProductDetails from "../pages/products/ProductDetails";
import MyProfile from "../pages/dashboard/MyProfile";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import MyProducts from "../pages/dashboard/MyProducts";
import ProductReviewQueue from "../pages/dashboard/ProductReviewQueue";
import ReportedContents from "../pages/dashboard/ReportedContents";
import StatisticsPage from "../pages/dashboard/StatisticsPage";
import ManageUsersPage from "../pages/dashboard/ManageUsersPage";
import ManageCouponPage from "../pages/dashboard/ManageCouponPage";
import UserRoute from "./UserRoute";
import ModeratorRoute from "./ModeratorRoute";
import AdminRoute from "./AdminRoute";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/products",
        Component: AllProducts,
      },
      {
        path: "/products/:id",
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "products",
        Component: AllProducts,
      },
      {
        path: "my-products",
        Component: MyProducts,
      },
      {
        path: "profile",
        element: (
          <Elements stripe={stripePromise}>
            <MyProfile />
          </Elements>
        ),
      },
      {
        path: "add-product",
        element: (
          <PrivateRoute>
            <UserRoute>
              <AddProduct />
            </UserRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "review-products",
        element: (
          <PrivateRoute>
            <ModeratorRoute>
              <ProductReviewQueue />
            </ModeratorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "reports-products",
        element: (
          <ModeratorRoute>
            <ReportedContents />
          </ModeratorRoute>
        ),
      },
      {
        path: "statistics",
        element: (
          <AdminRoute>
            <StatisticsPage />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsersPage />
          </AdminRoute>
        ),
      },
      {
        path: "manage-coupons",
        element: (
          <AdminRoute>
            <ManageCouponPage />
          </AdminRoute>
        ),
      },
    ],
  },
]);
