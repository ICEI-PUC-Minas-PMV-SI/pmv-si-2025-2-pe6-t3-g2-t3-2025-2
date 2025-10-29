"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/services/api";

export type Especialidade = "OFTALMOLOGIA" | "CARDIOLOGIA" | "ORTOPEDIA" | "PEDIATRIA";

export interface MedicoItem {
  id: string;
  nome: string;
  especialidade: Especialidade;
}

export function useListMedicosParaPaciente() {
  return useQuery({
    queryKey: ["paciente-medicos"],
    queryFn: async () => {
      const { data } = await api.get<MedicoItem[]>("/medlink/paciente/medicos");
      return data;
    },
    staleTime: 1000 * 60, // 1 min
  });
}

export type SlotDTO = {
  id: string;
  inicio: string; // ISO local "YYYY-MM-DDTHH:mm:ss"
  fim: string;    // ISO local "YYYY-MM-DDTHH:mm:ss"
  status: "LIVRE" | "RESERVADO";
};

export function useSlotsLivresDoMedico(medicoId?: string, dataISO?: string) {
  return useQuery({
    queryKey: ["slots", medicoId, dataISO],
    queryFn: async () => {
      const { data } = await api.get<SlotDTO[]>(
        `/medlink/paciente/medicos/${medicoId}/slots`,
        { params: { data: dataISO } }
      );
      return data;
    },
    enabled: !!medicoId && !!dataISO,
  });
}