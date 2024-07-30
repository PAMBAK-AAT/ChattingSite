

/// Routing Technique ---> Routing in a web application allows you to navigate between different views or pages without reloading the entire page.
///  It enables the creation of single-page applications (SPAs) where different URLs map to different components.
///  This approach provides a smoother and faster user experience compared to traditional multi-page applications.


/// Outlet ---> The Outlet component is a placeholder used in parent routes to render child routes.
///  It is part of react-router-dom and is used to indicate where the child routes should be rendered.


import { createBrowserRouter } from "react-router-dom";
/// Pages...
import RegisterPage from "../pages/RegisterPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import HomePage from "../pages/Home"
import MessagePage from "../components/MessagePage";
import AuthLayout from "../layouts/index";

import App from "../App";
import ForgotPassword from "../pages/ForgotPassword";

const router = createBrowserRouter([

    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "register",
                element: <AuthLayout><RegisterPage /></AuthLayout>
            },
            {
                path: "email",
                element: <AuthLayout> <CheckEmailPage /> </AuthLayout>
            },
            {
                path: "password",
                element: <AuthLayout> <CheckPasswordPage /> </AuthLayout>
            },
            {
                path: "forgotPassword",
                element: <AuthLayout> <ForgotPassword /> </AuthLayout>
            },
            {
                path: "",
                element: <HomePage />,
                children: [
                    {
                        path: ":userId",
                        element: <MessagePage />
                    }
                ]
            }
        ]
    }
])

export default router

