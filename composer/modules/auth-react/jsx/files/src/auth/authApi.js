const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    // The refresh token lives in an httpOnly cookie the backend composer's
    // auth-jwt* modules set — this is what lets /auth/refresh work at all.
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body?.error?.message || "Request failed");
  }
  return body.data;
}

// Matches the exact contract the backend composer's auth-jwt* modules
// expose — see create-structure-templates/composer/modules/auth-jwt*.
export const authApi = {
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  refresh: () => request("/auth/refresh", { method: "POST" }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: (accessToken) => request("/auth/me", { headers: { Authorization: `Bearer ${accessToken}` } }),
};
