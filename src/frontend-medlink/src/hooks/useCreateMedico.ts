"use client";

import { api } from "@/app/services/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export type Especialidade = "OFTALMOLOGIA" | "CARDIOLOGIA" | "ORTOPEDIA" | "PEDIATRIA";

export interface MedicoRequest {
  email: string;
  password: string;
  nome: string;
  endereco?: string;
  telefone?: string;
  especialidade: Especialidade;
  crm: string;
}

export function useCreateMedico() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: MedicoRequest) => {
      // Temporário: usa a rota de médico, já que ADMIN tem ROLE_MEDICO
      const { data } = await api.post("/medlink/medico/register", payload);
      return data;
    },
    onSuccess: () => {
      alert("Médico cadastrado com sucesso!");
      router.push("/admin/medicos");
    },
    onError: (err: any) => {
      const status = err?.response?.status;
      if (status === 403) {
        alert("Sem permissão para cadastrar médico.");
      } else if (status === 409) {
        alert("E-mail já cadastrado.");
      } else if (status === 400) {
        const msg = err?.response?.data?.message || "Dados inválidos.";
        alert(msg);
      } else {
        alert("Ocorreu um erro ao cadastrar o médico.");
      }
    },
  });
}