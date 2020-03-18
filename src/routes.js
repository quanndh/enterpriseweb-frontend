import LoginForm from "./components/LoginForm";
import BaseLayout from "./views/BaseLayout";

export default [
    {
        path: "/login",
        component: LoginForm,
        isPrivate: false,
        isAdmin: false
    },
    {
        path: "/",
        component: BaseLayout,
        isPrivate: true,
        isAdmin: false
    },
    {
        path: "/",
        component: BaseLayout,
        isPrivate: true,
        isAdmin: false
    },
    {
        path: "/",
        component: BaseLayout,
        isPrivate: true,
        isAdmin: false
    }
]