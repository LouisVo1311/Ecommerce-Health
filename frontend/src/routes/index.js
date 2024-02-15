// System
import AdminPage from "../pages/Admin";
import UserLogInPage from "../pages/UserLogIn/UserLogInPage";
import AdminLogInPage from "../pages/AdminLogIn/AdminLogInPage";
import SignUpPage from "../pages/SignUp/SignUpPage";

// Client
import HomePage from "../pages/Home";
import OrderDetailsPage from "../pages/OrderDetails/OrderDetailsPage";
import OrderPage from "../pages/Order/OrderPage";
import OrderSucessPage from "../pages/OrderSuccess/OrderSuccessPage";
import CartPage from "../pages/Cart/CartPage";
import PaymentPage from "../pages/Payment/PaymentPage";
import ProductDetailsPage from "../pages/ProductDetails/ProductDetailsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import TypePage from "../pages/Type/TypePage";

// Global
import NotFoundPage from "../pages/NotFound";

export const routes = [
    {
        path: "/",
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: "/profile",
        page: ProfilePage,
        isShowHeader: true,
    },
    {
        path: "/sign-up",
        page: SignUpPage,
        isShowHeader: false,
    },
    {
        path: "/log-in",
        page: UserLogInPage,
        isShowHeader: false,
    },
    {
        path: "/log-in/admin",
        page: AdminLogInPage,
        isShowHeader: false,
    },
    // Chi tiết sản phẩm
    {
        path: "/product-details/:id",
        page: ProductDetailsPage,
        isShowHeader: true,
    },
    // Phân loại sản phẩm
    {
        path: "/product/:type",
        page: TypePage,
        isShowHeader: true,
    },
    // Giỏ hàng
    {
        path: "/cart",
        page: CartPage,
        isShowHeader: true,
    },
    // Thanh toán
    {
        path: "/payment",
        page: PaymentPage,
        isShowHeader: true,
    },
    // Đơn hàng thành công
    {
        path: "/order-success",
        page: OrderSucessPage,
        isShowHeader: true,
    },
    // Tất cả đơn hàng
    {
        path: "/my-order",
        page: OrderPage,
        isShowHeader: true,
    },
    // Chi tiết 1 đơn hàng
    {
        path: "/details-order/:id",
        page: OrderDetailsPage,
        isShowHeader: true,
    },

    {
        path: "/system/admin",
        page: AdminPage,
        isShowHeader: false,
        isPrivated: true,
    },
    {
        path: "*",
        page: NotFoundPage,
    },
];
