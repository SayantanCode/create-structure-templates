import { apiClient } from "@/services/api/client";

// Hits `/auth/*` on whatever VITE_API_URL points to. The demo API
// (JSONPlaceholder, the default) has no such routes, so these calls fail
// with a real 404/error out of the box — see this base's README ("Demo
// API") for why that's expected, not a bug. Point VITE_API_URL at your real
// backend to see them succeed.
export const authApi = {
  async login({ email, password }) {
    const { data } = await apiClient.post("/auth/login", { email, password });
    return data;
  },
  async register({ name, email, password }) {
    const { data } = await apiClient.post("/auth/register", { name, email, password });
    return data;
  },
  async forgotPassword({ email }) {
    const { data } = await apiClient.post("/auth/forgot-password", { email });
    return data;
  },
};
