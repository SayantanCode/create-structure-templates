import { getRouteRegistry } from "@/routes/routeRegistry";
import { ROUTES } from "@/constants/routes";

// A simple one-level trail derived from routeRegistry's `breadcrumb` field
// — Home -> current page. Extend to a real parent chain once routes
// actually nest more than one level deep (e.g. /contacts/:id).
export function getBreadcrumbs(pathname) {
  const route = getRouteRegistry().find((r) => r.path === pathname);
  if (!route || route.path === ROUTES.HOME) return [];
  return [{ label: "Home", to: ROUTES.HOME }, { label: route.breadcrumb || route.path }];
}
