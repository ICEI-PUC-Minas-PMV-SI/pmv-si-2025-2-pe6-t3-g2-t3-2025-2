"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export type SlotStatus = "LIVRE" | "RESERVADO" | "CANCELADO";

export interface AdminSlotDTO {
  id: string;
  medicoId: string;
  medicoNome?: string;
  data: string;
  inicio: string;
  fim: string;
  status: SlotStatus;
}

export function useAdminSlots(medicoId?: string, data?: string) {
  return useQuery({
    queryKey: ["admin-slots", medicoId, data],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (medicoId) params.append("medicoId", medicoId);
      if (data) params.append("data", data);

      const { data: response } = await api.get<AdminSlotDTO[]>(
        `/medlink/admin/slots?${params.toString()}`,
      );
      return response;
    },
    enabled: !!medicoId && !!data,
  });
}
