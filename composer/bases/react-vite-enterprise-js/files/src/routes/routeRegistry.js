import { authRoutes } from "@/features/auth/routes";
import { dashboardRoutes } from "@/features/dashboard/routes";
import { contactsRoutes } from "@/features/contacts/routes";
import { getPluginRoutes } from "@/platform/plugins";

// Each feature contributes its own route array; this only aggregates them
// (plus whatever platform/plugins' registry holds at call time) so
// routes/AppRoutes.jsx has one flat list to group by layout instead of
// reaching into every feature individually. Add a new feature's routes
// here — one line — the same way dashboard/contacts/auth already are.
export function getRouteRegistry() {
  return [...dashboardRoutes, ...contactsRoutes, ...authRoutes, ...getPluginRoutes()];
}
