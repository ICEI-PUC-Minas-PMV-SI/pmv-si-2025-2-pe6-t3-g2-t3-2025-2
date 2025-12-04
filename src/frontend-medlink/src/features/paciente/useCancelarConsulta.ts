"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/services/api";
import { getUserIdFromToken } from "@/lib/auth-utils";

export function useCancelarConsulta() {
  const qc = useQueryClient();
  const userId = getUserIdFromToken();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<string>(
        `/medlink/paciente/consulta/${id}`,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["consultas-paciente", userId] });
      qc.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}
