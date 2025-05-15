import { Component } from "react";

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