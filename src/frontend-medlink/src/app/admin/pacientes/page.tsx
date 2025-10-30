"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/services/api";
import { useMemo, useState } from "react";

type PacienteResponse = {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  endereco?: string | null; // corrigido (sem acento)
};

export default function PacientesListPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-pacientes"],
    queryFn: async () => {
      const { data } = await api.get<PacienteResponse[]>("/medlink/admin/pacientes");
      return data;
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (p) =>
        p.nome?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        (p.telefone || "").toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Pacientes</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, email ou telefone"
          style={{ marginLeft: "auto", padding: 8, width: 320 }}
        />
      </header>

      {isLoading && <p>Carregando...</p>}
      {isError && <p style={{ color: "crimson" }}>Erro ao carregar pacientes.</p>}

      {filtered && filtered.length === 0 && !isLoading && <p>Nenhum paciente encontrado.</p>}

      {filtered && filtered.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Nome</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Email</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ borderBottom: "1px solid #f2f2f2", padding: 8 }}>{p.nome}</td>
                  <td style={{ borderBottom: "1px solid #f2f2f2", padding: 8 }}>{p.email}</td>
                  <td style={{ borderBottom: "1px solid #f2f2f2", padding: 8 }}>{p.telefone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}