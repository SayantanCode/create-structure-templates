import { ROUTES } from "@/constants/routes";
import { DashboardHomePage } from "@/features/dashboard/pages/DashboardHomePage";

export const dashboardRoutes = [
  { path: ROUTES.HOME, element: <DashboardHomePage />, layout: "dashboard", breadcrumb: "Home" },
];
