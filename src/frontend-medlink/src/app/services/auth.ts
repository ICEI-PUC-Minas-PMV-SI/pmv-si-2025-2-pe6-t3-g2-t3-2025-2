"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/auth-context";
import { api } from "./api";

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
      // Cadastro de paciente não retorna token → enviar para login
      router.push("/login");
    },
    onError: (err: any) => {
      const status = err?.response?.status;
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

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<LoginResponse>("/medlink/login", data);
      return response.data;
    },
    onSuccess: ({ token }) => {
      // Centraliza no AuthContext
      login(token);
      // Redirecione para a área do paciente (ajuste se preferir outra rota)
      router.push("/paciente/consultas");
    },
    onError: (err: any) => {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        throw new Error("E-mail ou senha inválidos.");
      }
      throw new Error("Não foi possível entrar. Tente novamente.");
    },
  });
};