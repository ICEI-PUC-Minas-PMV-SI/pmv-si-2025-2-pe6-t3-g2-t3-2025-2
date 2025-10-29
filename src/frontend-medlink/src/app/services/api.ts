import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

function clearAuthAndRedirect() {
  // Limpa token de ambos os lugares
  localStorage.removeItem("token");
  Cookies.remove("token", { path: "/" });

  // Redirecionamento contextual (opcional)
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const isAdminArea = path.startsWith("/admin");
  window.location.href = isAdminArea ? "/admin/login" : "/login";
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Prioriza cookie; se ausente, usa localStorage
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (typeof window !== "undefined" && status === 401) {
      clearAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);