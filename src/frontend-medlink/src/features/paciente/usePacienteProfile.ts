"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export interface PacienteProfile {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export interface UpdatePacienteProfilePayload {
  nome: string;
  telefone: string;
  endereco: string;
}

export function useGetPacienteProfile() {
  return useQuery({
    queryKey: ["paciente-profile"],
    queryFn: async () => {
      const { data } = await api.get<PacienteProfile>("/medlink/paciente");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useUpdatePacienteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePacienteProfilePayload) => {
      const { data } = await api.put<PacienteProfile>(
        "/medlink/paciente",
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      // Atualiza cache com os dados retornados
      queryClient.setQueryData(["paciente-profile"], data);
    },
  });
}
