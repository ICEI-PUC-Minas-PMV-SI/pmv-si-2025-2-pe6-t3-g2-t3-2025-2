"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export type Especialidade =
  | "OFTALMOLOGIA"
  | "CARDIOLOGIA"
  | "ORTOPEDIA"
  | "PEDIATRIA";

export interface MedicoRequest {
  email: string;
  password: string;
  nome: string;
  endereco?: string;
  telefone?: string;
  especialidade: Especialidade;
  crm: string;
}

export function useCreateMedico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MedicoRequest) => {
      const { data } = await api.post("/medlink/medico/register", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-medicos"] });
    },
  });
}
