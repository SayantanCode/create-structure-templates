import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, AuthUser } from "@/auth/authApi";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
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

  async function login(email: string, password: string) {
    const result = await authApi.login(email, password);
    setAccessToken(result.accessToken);
    setUser(result.user);
  }

  async function register(name: string, email: string, password: string) {
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
