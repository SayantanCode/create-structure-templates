// Minimal plugin registry: a plugin is just `{ key, routes?, menuItems? }`.
// registerPlugin() must run before routes/routeRegistry.js and
// layouts/DashboardLayout's Sidebar read the registry (both do it at
// module-load time), so call it from your plugin's own entry file, imported
// once near the top of src/app/App.jsx — before <AppRoutes/> renders.
// This is also what the spec calls a "registry": one plugin registry, not a
// second, separate concept.
const plugins = new Map();

export function registerPlugin(plugin) {
  if (!plugin?.key) throw new Error("registerPlugin() requires a plugin with a unique `key`.");
  plugins.set(plugin.key, plugin);
}

export function unregisterPlugin(key) {
  plugins.delete(key);
}

export function getPlugins() {
  return Array.from(plugins.values());
}

export function getPluginRoutes() {
  return getPlugins().flatMap((plugin) => plugin.routes || []);
}

export function getPluginMenuItems() {
  return getPlugins().flatMap((plugin) => plugin.menuItems || []);
}
