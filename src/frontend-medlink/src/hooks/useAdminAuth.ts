"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/services/api";
import Cookies from 'js-cookie';

interface AdminLoginData {
  email: string;
  password: string;
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
      console.debug('[DEBUG][useAdminLogin] received token:', data.token);
      // Persist token in cookie (httpOnly should be set by server ideally).
      // In development on localhost we must not set `secure: true` otherwise cookie
      // won't be sent over HTTP. Use secure when running on HTTPS / production.
      const secure = typeof window !== 'undefined' ? window.location.protocol === 'https:' : false;
      Cookies.set('token', data.token, { path: '/', sameSite: 'lax', secure, expires: 7 });
      // TEMP LOG: confirm cookie set
      // eslint-disable-next-line no-console
      console.debug('[DEBUG][useAdminLogin] cookie set token (exists?):', !!Cookies.get('token'));

      const redirect = search.get("redirect");
      router.push(redirect || "/admin");
    },
  });
};

export const useAdminLogout = () => {
  const router = useRouter();
  return () => {
    Cookies.remove('token', { path: '/' });
    router.push("/admin/login");
  };
};