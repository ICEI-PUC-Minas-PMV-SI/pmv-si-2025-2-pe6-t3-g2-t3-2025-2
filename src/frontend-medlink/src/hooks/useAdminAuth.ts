"use client";

import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/services/api";

interface AdminLoginData {
  email: string;
  password: string;
}

function parseJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const useAdminLogin = () => {
  const router = useRouter();
  const search = useSearchParams();

  return useMutation({
    mutationFn: async (data: AdminLoginData) => {
      const response = await api.post("/medlink/login", data);
      return response.data; // { token }
    },
    onSuccess: (data: { token: string }) => {
      // TEMP LOG: show token value briefly to help debugging (remove later)
      // Note: remove this in production — token is sensitive.
      // eslint-disable-next-line no-console
      console.debug("[DEBUG][useAdminLogin] received token:", data.token);
      // Persist token in cookie (httpOnly should be set by server ideally).
      // In development on localhost we must not set `secure: true` otherwise cookie
      // won't be sent over HTTP. Use secure when running on HTTPS / production.
      const secure =
        typeof window !== "undefined"
          ? window.location.protocol === "https:"
          : false;
      Cookies.set("token", data.token, {
        path: "/",
        sameSite: "lax",
        secure,
        expires: 7,
      });
      // TEMP LOG: confirm cookie set
      // eslint-disable-next-line no-console
      console.debug(
        "[DEBUG][useAdminLogin] cookie set token (exists?):",
        !!Cookies.get("token"),
      );

      // Detectar role e redirecionar apropriadamente
      const user = parseJwt(data.token);
      const isAdmin =
        user?.role === "ADMIN" ||
        (Array.isArray(user?.authorities) &&
          user.authorities.includes("ROLE_ADMIN"));
      const isMedico =
        user?.role === "MEDICO" ||
        (Array.isArray(user?.authorities) &&
          user.authorities.includes("ROLE_MEDICO"));

      const redirect = search.get("redirect");

      if (redirect) {
        router.push(redirect);
      } else if (isAdmin) {
        router.push("/admin");
      } else if (isMedico) {
        router.push("/medico");
      } else {
        router.push("/admin");
      }
    },
  });
};

export const useAdminLogout = () => {
  const router = useRouter();
  return () => {
    Cookies.remove("token", { path: "/" });
    router.push("/admin/login");
  };
};
