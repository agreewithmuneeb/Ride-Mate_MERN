import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext(null);

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    refreshUser()
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  function persist(nextToken, nextUser) {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }

  async function login(credentials) {
    const data = await api.post("/auth/login", credentials);
    persist(data.token, data.user);
    return data.user;
  }

  async function loginWithGoogle(idToken, role) {
    const data = await api.post("/auth/google", { idToken, role });
    persist(data.token, data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await api.post("/auth/register", payload);
    persist(data.token, data.user);
    return data.user;
  }

  async function refreshUser() {
    const data = await api.get("/auth/me");
    if (!data.user) throw new Error("Session refresh failed");
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function updateProfile(payload) {
    const data = await api.put("/auth/profile", payload);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, loading, login, loginWithGoogle, register, logout, refreshUser, updateProfile }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
