"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export interface ConsultaMedico {
  id: string;
  pacienteId: string;
  pacienteNome?: string;
  medicoId: string;
  medicoNome?: string;
  dataHora: string; // ISO LocalDateTime
  observacoes?: string | null;
  status: "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";
}

export function useMedicoConsultas() {
  return useQuery({
    queryKey: ["medico-consultas"],
    queryFn: async () => {
      const { data } = await api.get<ConsultaMedico[]>(
        "/medlink/medico/consultas",
      );
      return data;
    },
    staleTime: 1000 * 30, // 30 segundos
  });
}
