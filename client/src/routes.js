import { ADMIN_ROUTE, BASKET_ROUTE, DEVICE_ROUTE, HOME_ROUTE, LOGIN_ROUTE, ORDER_ROUTE, REGISTER_ROUTE, USER_ROUTE } from "./utils/consts";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Basket from "./pages/Basket";
import Device from "./pages/Device";
import Home from "./pages/Home";
import Order from "./pages/Order";
import User from "./pages/User";

export const publicRoutes = [
    { path: HOME_ROUTE, Component: Home },
    { path: LOGIN_ROUTE, Component: Auth },
    { path: REGISTER_ROUTE, Component: Auth },
    { path: DEVICE_ROUTE, Component: Device },
]

export const privateRoutes = [
    { path: BASKET_ROUTE, Component: Basket },
    { path: ADMIN_ROUTE, Component: Admin },
    { path: USER_ROUTE, Component: User },
    { path: ORDER_ROUTE, Component: Order },
]