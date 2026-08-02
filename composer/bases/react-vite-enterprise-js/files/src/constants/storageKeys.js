// Every localStorage/sessionStorage key the app writes. One place to see
// what's actually persisted, and to avoid two features silently colliding
// on the same key.
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "app:accessToken",
  REFRESH_TOKEN: "app:refreshToken",
  THEME_MODE: "app:themeMode",
  OFFLINE_QUEUE: "app:offlineQueue",
};
