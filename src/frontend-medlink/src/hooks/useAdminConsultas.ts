'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/services/api';

export type ConsultaStatus = 'AGENDADA' | 'CANCELADA' | 'FINALIZADA';

export interface ConsultaAdminDTO {
  id: number;
  pacienteNome: string;
  pacienteEmail?: string;
  medicoNome: string;
  especialidade?: string | null;
  dataHora: string; // ISO sem offset (compatível com LocalDateTime)
  status: ConsultaStatus;
  observacoes?: string | null;
}

export type ConsultasAdminFilters = {
  q?: string;          // busca por paciente/médico
  status?: ConsultaStatus | ''; 
  medicoId?: string;
  pacienteId?: string;
  from?: string;       // yyyy-mm-dd
  to?: string;         // yyyy-mm-dd
  page?: number;       // 0-based
  size?: number;       // itens por página
};

type PageResponse<T> = {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
};

async function fetchConsultasAdmin(filters: ConsultasAdminFilters): Promise<PageResponse<ConsultaAdminDTO>> {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.status) params.set('status', filters.status);
  if (filters.medicoId) params.set('medicoId', filters.medicoId);
  if (filters.pacienteId) params.set('pacienteId', filters.pacienteId);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  params.set('page', String(filters.page ?? 0));
  params.set('size', String(filters.size ?? 10));

  const { data } = await api.get<PageResponse<ConsultaAdminDTO>>(`/medlink/admin/consultas?${params.toString()}`);
  return data;
}

export function useAdminConsultas(filters: ConsultasAdminFilters) {
  return useQuery({
    queryKey: ['admin-consultas', filters],
    queryFn: () => fetchConsultasAdmin(filters),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}