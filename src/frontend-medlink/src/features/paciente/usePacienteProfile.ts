"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/services/api";
import { getUserIdFromToken } from "@/lib/auth-utils";

export type PacienteProfile = {
  id: string;
  email: string;
  nome: string;
  telefone: string;
  endereco: string;
};

export type UpdatePacientePayload = {
  nome: string;
  telefone: string;
  endereco: string;
};

async function fetchPacienteProfile(): Promise<PacienteProfile> {
  const { data } = await api.get<PacienteProfile>("/medlink/paciente");
  return data;
}

export function useGetPacienteProfile() {
  const userId = getUserIdFromToken();

  return useQuery({
    queryKey: ["paciente-profile", userId],
    queryFn: fetchPacienteProfile,
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });
}

export function useUpdatePacienteProfile() {
  const queryClient = useQueryClient();
  const userId = getUserIdFromToken();

  return useMutation({
    mutationFn: async (payload: UpdatePacientePayload) => {
      const { data } = await api.put<PacienteProfile>(
        "/medlink/paciente",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paciente-profile", userId] });
    },
  });
}
