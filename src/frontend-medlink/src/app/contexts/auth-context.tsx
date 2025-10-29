// contexts/AuthContext.tsx
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Considera cookie OU localStorage
    const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string) => {
    // Salva nos dois: cookie (para middleware/interceptors) e localStorage (fallback)
    localStorage.setItem("token", token);
    Cookies.set("token", token, { sameSite: "lax", path: "/" });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token", { path: "/" });
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);