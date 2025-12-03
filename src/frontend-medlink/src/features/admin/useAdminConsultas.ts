"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export type ConsultaStatus = "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";

export interface ConsultaAdminDTO {
  id: string;
  pacienteId: string;
  medicoId: string;
  observacao?: string | null;
  dataHora: string;
  status?: ConsultaStatus;
}

export type ConsultasAdminFilters = {
  q?: string;
  status?: "" | ConsultaStatus;
  medicoId?: string;
  pacienteId?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
};

async function fetchConsultasAdmin(filters: ConsultasAdminFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.status) params.set("status", filters.status);
  if (filters.medicoId) params.set("medicoId", filters.medicoId);
  if (filters.pacienteId) params.set("pacienteId", filters.pacienteId);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);

  const { data } = await api.get<ConsultaAdminDTO[]>(
    `/medlink/admin/consultas?${params.toString()}`,
  );
  return data ?? [];
}

export function useAdminConsultas(filters: ConsultasAdminFilters) {
  return useQuery({
    queryKey: ["admin-consultas", filters],
    queryFn: () => fetchConsultasAdmin(filters),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
