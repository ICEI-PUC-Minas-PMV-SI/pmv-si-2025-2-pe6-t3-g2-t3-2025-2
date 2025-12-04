"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from 'axios';
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/auth-context";
import { api } from "./api";

const FORGOT_PASSWORD_PATH = process.env.NEXT_PUBLIC_FORGOT_PASSWORD_PATH ?? "/medlink/paciente/forgot-password";
const RESET_PASSWORD_PATH = process.env.NEXT_PUBLIC_RESET_PASSWORD_PATH ?? "/medlink/paciente/reset-password";

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
}

interface LoginData {
  email: string;
  password: string;
}

type LoginResponse = { token: string };

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const payload = {
        nome: data.name,
        email: data.email,
        telefone: data.phone,
        password: data.password,
        endereco: data.address ?? "",
      };
      const response = await api.post("/medlink/paciente/register", payload);
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (err: AxiosError | unknown) => {
      const status = (err as AxiosError)?.response?.status;
      if (status === 409) {
        throw new Error("E-mail já cadastrado.");
      }
      throw new Error("Não foi possível criar a conta. Tente novamente.");
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<LoginResponse>("/medlink/login", data);
      return response.data;
    },
    onSuccess: ({ token }) => {
      queryClient.clear();
      login(token);
      router.push("/paciente/consultas");
    },
    onError: (err: AxiosError | unknown) => {
      const status = (err as AxiosError)?.response?.status;
      if (status === 401 || status === 403) {
        throw new Error("E-mail ou senha inválidos.");
      }
      throw new Error("Não foi possível entrar. Tente novamente.");
    },
  });
};

export const useRequestPasswordReset = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (email: { email: string }) => {
      const response = await api.post(FORGOT_PASSWORD_PATH, email);
      return response.data;
    },
    onSuccess: async () => {
      router.push("/login?reset=sent");
    },
    onError: (err: AxiosError | unknown) => {
      const status = (err as AxiosError)?.response?.status;
      if (status === 404) {
        throw new Error("E-mail não encontrado.");
      }
      throw new Error("Não foi possível enviar o e-mail de recuperação. Tente novamente.");
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const response = await api.post(RESET_PASSWORD_PATH, data);
      return response.data;
    },
    onSuccess: async () => {
      router.push("/login?reset=ok");
    },
    onError: (err: AxiosError | unknown) => {
      const status = (err as AxiosError)?.response?.status;
      if (status === 400) {
        throw new Error("Token inválido ou expirado.");
      }
      throw new Error("Não foi possível redefinir a senha. Tente novamente.");
    },
  });
};