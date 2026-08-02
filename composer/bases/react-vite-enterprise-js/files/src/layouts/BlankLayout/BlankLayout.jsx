import { Outlet } from "react-router-dom";

// No chrome at all — for 404s, print views, or any page that shouldn't
// inherit the app's header/sidebar.
export function BlankLayout() {
  return <Outlet />;
}
