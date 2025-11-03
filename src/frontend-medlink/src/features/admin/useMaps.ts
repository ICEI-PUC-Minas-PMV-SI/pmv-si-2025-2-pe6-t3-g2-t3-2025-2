'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/services/api';

type MedicoItem = {
  id: string;
  nome: string;
  especialidade?: string | null;
};

type PacienteItem = {
  id: string;
  nome: string;
  email?: string | null;
};

function toMedicosMap(list: MedicoItem[]) {
  const map = new Map<string, { nome: string; especialidade?: string | null }>();
  for (const m of list) {
    map.set(m.id, { nome: m.nome, especialidade: m.especialidade ?? null });
  }
  return map;
}

function toPacientesMap(list: PacienteItem[]) {
  const map = new Map<string, { nome: string; email?: string | null }>();
  for (const p of list) {
    map.set(p.id, { nome: p.nome, email: p.email ?? null });
  }
  return map;
}

export function useAdminMedicosMap() {
  return useQuery({
    queryKey: ['admin-medicos-map'],
    queryFn: async () => {
      const { data } = await api.get<MedicoItem[]>('/medlink/admin/medicos');
      return toMedicosMap(data ?? []);
    },
    staleTime: 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus: false,
  });
}

export function useAdminPacientesMap() {
  return useQuery({
    queryKey: ['admin-pacientes-map'],
    queryFn: async () => {
      const { data } = await api.get<PacienteItem[]>('/medlink/admin/pacientes');
      return toPacientesMap(data ?? []);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}