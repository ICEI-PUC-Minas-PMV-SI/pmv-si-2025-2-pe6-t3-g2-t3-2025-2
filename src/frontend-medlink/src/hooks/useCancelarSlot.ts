"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export function useCancelarSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slotId: string) => {
      const { data } = await api.delete(`/medlink/admin/slots/${slotId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-slots"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}
