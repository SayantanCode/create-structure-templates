import axios from "axios";
import { env } from "@/config/env";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "@/services/auth/tokenStorage";

// The one axios instance the whole app uses — components never import
// axios directly or know this URL/header/refresh logic exists, they only
// ever go through a feature's own api/ module, which calls apiClient.
export const apiClient = axios.create({
  baseURL: env.apiUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available.");

  // Plain axios (not apiClient) — going through apiClient here would loop
  // this same 401 interceptor on the refresh call itself.
  const { data } = await axios.post(`${env.apiUrl}/auth/refresh`, { refreshToken });
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.accessToken;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (response?.status !== 401 || config._retried) {
      return Promise.reject(normalizeError(error));
    }

    config._retried = true;
    try {
      refreshPromise ||= refreshAccessToken();
      const accessToken = await refreshPromise;
      refreshPromise = null;
      config.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(config);
    } catch (refreshError) {
      refreshPromise = null;
      clearTokens();
      return Promise.reject(normalizeError(refreshError));
    }
  }
);

// Every rejected promise from apiClient carries a consistent shape, so a
// feature's catch block never has to guess whether it got an axios error,
// a network error, or something else.
function normalizeError(error) {
  return {
    message: error.response?.data?.message || error.message || "Something went wrong.",
    status: error.response?.status ?? null,
    cause: error,
  };
}
