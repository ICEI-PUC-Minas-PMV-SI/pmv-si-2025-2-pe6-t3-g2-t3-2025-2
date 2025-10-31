// src/features/paciente/useConsultasPaciente.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export type ConsultaPaciente = {
  id: string;                 // mesmo vindo UUID no Java, chega como string no JSON
  medicoId: string;
  medicoNome: string;
  especialidade: string;
  dataHora: string;           // ISO string
  observacoes?: string | null;
  status: "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";
};

async function fetchConsultasPaciente(): Promise<ConsultaPaciente[]> {
  const { data } = await api.get<ConsultaPaciente[]>("/medlink/paciente/consultas");
  // data já vem pronto; se precisar normalizar, faça aqui
  return data;
}

export function useConsultasPaciente() {
  return useQuery({
    queryKey: ["consultas-paciente"],
    queryFn: fetchConsultasPaciente,
    staleTime: 1000 * 30, // 30s
  });
}