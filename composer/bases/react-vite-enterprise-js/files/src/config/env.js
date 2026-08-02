// Single source of truth for runtime configuration. Nothing else in the app
// should read import.meta.env directly — that keeps every environment
// variable this app actually uses discoverable in one file, with one
// documented fallback each.
export const env = {
  appName: import.meta.env.VITE_APP_NAME || "Enterprise App",
  apiUrl: import.meta.env.VITE_API_URL || "https://jsonplaceholder.typicode.com",
  socketUrl: import.meta.env.VITE_SOCKET_URL || "http://localhost:4000",
  isDev: import.meta.env.DEV,
};
