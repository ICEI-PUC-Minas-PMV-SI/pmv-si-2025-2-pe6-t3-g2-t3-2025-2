'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/services/api';

export function useCancelarConsultaAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (consultaId: string) => {
      const url = `/medlink/admin/consultas/${consultaId}/cancelar`;
      const resp = await api.post(url);
      return resp.data;
    },
    onSuccess: (_data, _variables) => {
      qc.invalidateQueries({ queryKey: ['admin-consultas'], exact: false });
    },
    onError: (err: any) => {
      console.error('[CancelarConsulta][error]', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      alert(
        `Falha ao cancelar: ${err?.response?.status ?? ''} ${
          typeof err?.response?.data === 'string'
            ? err.response.data
            : JSON.stringify(err?.response?.data ?? {})
        }`,
      );
    },
  });
}