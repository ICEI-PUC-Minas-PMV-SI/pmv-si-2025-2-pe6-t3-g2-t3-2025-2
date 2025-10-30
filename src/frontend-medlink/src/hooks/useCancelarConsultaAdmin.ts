'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/services/api';

export function useCancelarConsultaAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (consultaId: number) => {
      const { data } = await api.post(`/medlink/admin/consultas/${consultaId}/cancelar`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-consultas'] });
    },
  });
}