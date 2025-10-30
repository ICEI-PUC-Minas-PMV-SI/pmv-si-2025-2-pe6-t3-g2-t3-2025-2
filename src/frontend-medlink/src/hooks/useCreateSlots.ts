"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export interface CreateSlotsRequest {
  medicoId: string;
  data: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaFim: string; // HH:mm
  intervaloMinutos: number;
}

export function useCreateSlots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSlotsRequest) => {
      const { data } = await api.post("/medlink/admin/slots", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-slots"] });
    },
  });
}