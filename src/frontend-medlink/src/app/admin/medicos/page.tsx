"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/services/api";

type MedicoResponse = {
  id: string;
  nome: string;
  especialidade: "OFTALMOLOGIA" | "CARDIOLOGIA" | "ORTOPEDIA" | "PEDIATRIA";
};

export default function MedicosListPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-medicos"],
    queryFn: async () => {
      const { data } = await api.get<MedicoResponse[]>("/medlink/admin/medicos");
      return data;
    },
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <header style={{ display: "flex", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Médicos</h1>
        <Link href="/admin/medicos/novo" style={{ marginLeft: "auto" }}>
          <button type="button">Novo Médico</button>
        </Link>
      </header>

      {isLoading && <p>Carregando...</p>}
      {isError && <p style={{ color: "crimson" }}>Erro ao carregar médicos.</p>}

      {data && data.length === 0 && <p>Nenhum médico encontrado.</p>}

      {data && data.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Nome</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Especialidade</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.id}>
                <td style={{ borderBottom: "1px solid #f2f2f2", padding: 8 }}>{m.nome}</td>
                <td style={{ borderBottom: "1px solid #f2f2f2", padding: 8 }}>{m.especialidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}