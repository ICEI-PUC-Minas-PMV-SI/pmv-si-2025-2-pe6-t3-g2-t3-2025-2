"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/services/api";

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
      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;

      const redirect = search.get("redirect");
      router.push(redirect || "/admin");
    },
  });
};

export const useAdminLogout = () => {
  const router = useRouter();
  return () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0;";
    router.push("/admin/login");
  };
};