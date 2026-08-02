import { ROUTES } from "@/constants/routes";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";

// Consumed by routes/routeRegistry.js. Auth pages are eagerly imported
// (not React.lazy) on purpose — they're on the critical path for a signed-
// out visitor, so code-splitting them would only add a network waterfall
// for no benefit. Compare with features/contacts/routes.jsx, which does
// lazy-load — a heavier, not-always-needed feature is exactly what benefits.
export const authRoutes = [
  { path: ROUTES.LOGIN, element: <LoginPage />, layout: "auth", public: true, breadcrumb: "Log in" },
  { path: ROUTES.REGISTER, element: <RegisterPage />, layout: "auth", public: true, breadcrumb: "Register" },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
    layout: "auth",
    public: true,
    breadcrumb: "Forgot password",
  },
];
