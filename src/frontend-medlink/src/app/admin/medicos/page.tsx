"use client";

import Link from "next/link";
import { RefreshCw, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/services/api";

type MedicoResponse = {
  id: string;
  nome: string;
  especialidade: "OFTALMOLOGIA" | "CARDIOLOGIA" | "ORTOPEDIA" | "PEDIATRIA";
  crm?: string;
  telefone?: string;
};

export default function MedicosListPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-medicos"],
    queryFn: async () => {
      const { data } = await api.get<MedicoResponse[]>("/medlink/admin/medicos");
      return data;
    },
  });

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Médicos</h1>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <RefreshCw size={16} className={isFetching ? "spin" : ""} />
            {isFetching ? "Atualizando..." : "Atualizar"}
          </button>
          <Link href="/admin/medicos/novo">
            <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Plus size={16} />
              Novo Médico
            </button>
          </Link>
        </div>
      </header>

      {isLoading && <p>Carregando...</p>}
      {isError && <p style={{ color: "crimson" }}>Erro ao carregar médicos.</p>}

      {data && data.length === 0 && (
        <div
          style={{
            padding: 32,
            textAlign: "center",
            border: "1px dashed #ddd",
            borderRadius: 8,
            color: "#666",
          }}
        >
          <p style={{ margin: 0 }}>Nenhum médico cadastrado.</p>
          <Link href="/admin/medicos/novo">
            <button type="button" style={{ marginTop: 12 }}>
              Cadastrar primeiro médico
            </button>
          </Link>
        </div>
      )}

      {data && data.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid #e5e7eb",
                    padding: "10px 12px",
                    fontWeight: 600,
                  }}
                >
                  Nome
                </th>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid #e5e7eb",
                    padding: "10px 12px",
                    fontWeight: 600,
                  }}
                >
                  Especialidade
                </th>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid #e5e7eb",
                    padding: "10px 12px",
                    fontWeight: 600,
                  }}
                >
                  CRM
                </th>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid #e5e7eb",
                    padding: "10px 12px",
                    fontWeight: 600,
                  }}
                >
                  Telefone
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 12px" }}>{m.nome}</td>
                  <td style={{ padding: "10px 12px", color: "#555" }}>{m.especialidade}</td>
                  <td style={{ padding: "10px 12px", color: "#555" }}>{m.crm || "—"}</td>
                  <td style={{ padding: "10px 12px", color: "#555" }}>{m.telefone || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx global>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}