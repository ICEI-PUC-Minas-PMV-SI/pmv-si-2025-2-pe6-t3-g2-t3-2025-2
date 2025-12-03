import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

function clearAuthAndRedirect() {
  // Limpa token do cookie (do not use localStorage for auth)
  Cookies.remove("token", { path: "/" });

  // TEMP LOG: debug auth clear
  // eslint-disable-next-line no-console
  console.debug("[DEBUG][api] cleared auth cookie token");

  // Redirecionamento contextual (opcional)
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const isAdminArea = path.startsWith("/admin");
  window.location.href = isAdminArea ? "/admin/login" : "/login";
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Use cookie-only approach
    const token = Cookies.get("token");
    // TEMP LOG: what token is read from cookie (only for localhost debugging)
    // eslint-disable-next-line no-console
    console.debug(
      "[DEBUG][api] token from cookie:",
      token ? "<<REDACTED>>" : null,
    );
    if (token) {
      // TEMP LOG: confirm setting Authorization header
      // eslint-disable-next-line no-console
      console.debug("[DEBUG][api] attaching Authorization header");
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
  },
);
