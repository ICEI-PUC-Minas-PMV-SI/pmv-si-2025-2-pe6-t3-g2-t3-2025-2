"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export type ConsultaResponse = {
  id: string;
  pacienteId: string | null;
  medicoId: string;
  observacao: string | null; // atenção: no seu DTO do backend o campo é "observacao" (singular)
  dataHora: string;          // LocalDateTime em ISO sem timezone
};

export interface AgendarPorSlotPayload {
  slotId: string;        // UUID do slot
  observacoes?: string;  // string opcional
}

export function useAgendarConsultaPorSlot() {
  return useMutation({
    mutationFn: async (payload: AgendarPorSlotPayload) => {
      const { data } = await api.post<ConsultaResponse>(
        "/medlink/paciente/consulta/por-slot",
        payload
      );
      return data;
    },
  });
}