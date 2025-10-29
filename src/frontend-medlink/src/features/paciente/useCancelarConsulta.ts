"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export function useCancelarConsulta() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<string>(`/medlink/paciente/consulta/${id}`);
      return data; // mensagem do backend
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["consultas-paciente"] });
      qc.invalidateQueries({ queryKey: ["slots"] }); // opcional: recarregar slots
    },
  });
}