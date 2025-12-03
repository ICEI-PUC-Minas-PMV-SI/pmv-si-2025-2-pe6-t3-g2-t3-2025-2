"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export function useCancelarConsultaAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (consultaId: string) => {
      const url = `/medlink/admin/consultas/${consultaId}/cancelar`;
      const resp = await api.post(url);
      return resp.data;
    },
    onSuccess: (_data, _variables) => {
      qc.invalidateQueries({ queryKey: ["admin-consultas"], exact: false });
    },
    onError: (err: unknown) => {
      const axiosErr = err as import("axios").AxiosError | undefined;
      console.error("[CancelarConsulta][error]", {
        message: axiosErr?.message || String(err),
        status: axiosErr?.response?.status,
        data: axiosErr?.response?.data,
      });
      alert(
        `Falha ao cancelar: ${axiosErr?.response?.status ?? ""} ${
          typeof axiosErr?.response?.data === "string"
            ? axiosErr?.response?.data
            : JSON.stringify(axiosErr?.response?.data ?? {})
        }`,
      );
    },
  });
}
