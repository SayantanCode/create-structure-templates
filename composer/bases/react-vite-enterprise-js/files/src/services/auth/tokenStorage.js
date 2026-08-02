import { STORAGE_KEYS } from "@/constants/storageKeys";

// The one place tokens touch localStorage. services/api/client.js and
// platform/realtime/socketClient.js both read through here instead of
// calling localStorage directly — swap the storage mechanism (e.g. an
// httpOnly cookie handled server-side instead) in one place if you need to.
export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}
