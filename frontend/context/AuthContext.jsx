"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add this

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const { token: t, user: u } = JSON.parse(stored);
      setToken(t);
      setUser(u);
    }
    setIsLoading(false); // Add this - loading complete
  }, []);

  const login = (t, u) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("auth", JSON.stringify({ token: t, user: u }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      isAuthenticated: !!token,
      isLoading, 
    }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
