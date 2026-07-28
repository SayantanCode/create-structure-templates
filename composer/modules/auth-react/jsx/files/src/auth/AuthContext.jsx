import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "./authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, try to silently resume the session using the httpOnly
  // refresh cookie — this is what keeps a user logged in across page
  // reloads without persisting the access token anywhere (it's kept in
  // memory only, on purpose).
  useEffect(() => {
    authApi
      .refresh()
      .then(async ({ accessToken }) => {
        setAccessToken(accessToken);
        setUser(await authApi.me(accessToken));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const result = await authApi.login(email, password);
    setAccessToken(result.accessToken);
    setUser(result.user);
  }

  async function register(name, email, password) {
    const result = await authApi.register(name, email, password);
    setAccessToken(result.accessToken);
    setUser(result.user);
  }

  async function logout() {
    await authApi.logout().catch(() => {});
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
