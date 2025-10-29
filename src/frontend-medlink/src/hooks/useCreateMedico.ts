"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export type Especialidade = "OFTALMOLOGIA" | "CARDIOLOGIA" | "ORTOPEDIA" | "PEDIATRIA";

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
      // Temporário: usa a rota de médico, já que ADMIN tem ROLE_MEDICO
      const { data } = await api.post("/medlink/medico/register", payload);
      return data;
    },
    onSuccess: () => {
      // Invalida a lista de médicos para forçar refetch automático
      queryClient.invalidateQueries({ queryKey: ["admin-medicos"] });
    },
    // onError e onSuccess específicos são tratados na página via callbacks
  });
}