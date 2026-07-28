const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export interface AuthUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
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
  register: (name: string, email: string, password: string) =>
    request<AuthResult>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    request<AuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  refresh: () => request<{ accessToken: string }>("/auth/refresh", { method: "POST" }),
  logout: () => request<{ loggedOut: boolean }>("/auth/logout", { method: "POST" }),
  me: (accessToken: string) =>
    request<AuthUser>("/auth/me", { headers: { Authorization: `Bearer ${accessToken}` } }),
};
