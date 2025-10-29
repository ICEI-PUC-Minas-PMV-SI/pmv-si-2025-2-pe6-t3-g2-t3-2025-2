"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export type ConsultaPaciente = {
  id: string;
  medicoId: string;
  medicoNome: string;
  especialidade: string;
  dataHora: string;       // LocalDateTime em ISO sem timezone
  observacoes?: string;
};

export function useConsultasPaciente() {
  return useQuery<ConsultaPaciente[]>({
    queryKey: ["consultas-paciente"],
    queryFn: async () => {
      const { data } = await api.get("/medlink/paciente/consultas");
      return data;
    },
    staleTime: 1000 * 30, // 30s
  });
}