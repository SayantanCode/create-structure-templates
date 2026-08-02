// Central map of every route path in the app. Features reference these
// instead of hardcoding strings, so a path can move without a find/replace
// across every <Link>/navigate() call.
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  CONTACTS: "/contacts",
  NOT_FOUND: "*",
};
