// src/app/paciente/consultas/page.tsx
"use client";

import Link from "next/link";
import { Trash2, RefreshCw, Plus } from "lucide-react";
import { useConsultasPaciente } from "@/features/paciente/useConsultasPaciente";
import { useCancelarConsulta } from "@/features/paciente/useCancelarConsulta";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

// Opcional: helper para saber se falta < 1h
function menosDeUmaHora(iso: string) {
  return new Date(iso).getTime() - Date.now() < 60 * 60 * 1000;
}

export default function ConsultasPacientePage() {
  const { data: consultas, isLoading, isError, refetch, isFetching } = useConsultasPaciente();
  const { mutate: cancelar, isPending: cancelando } = useCancelarConsulta();

  const handleCancelar = (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta consulta?")) return;
    cancelar(id, {
      onSuccess: (msg: any) => {
        alert(typeof msg === "string" ? msg : "Consulta cancelada.");
      },
      onError: (err: any) => {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data ||
          "Não foi possível cancelar a consulta.";

        if (status === 404) alert("Consulta não encontrada.");
        else if (status === 403) alert("Você não tem permissão para cancelar esta consulta.");
        else if (status === 400) alert("Cancelamento indisponível a menos de 1 hora do início."); // NOVO
        else alert(msg);

        console.log("[CancelarConsulta][ERR]", {
          status,
          url: err?.config?.url,
          method: err?.config?.method,
          data: err?.response?.data,
        });
      },
    });
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Minhas Consultas</h1>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Link href="/paciente/consulta/nova">
            <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Plus size={16} />
              Nova
            </button>
          </Link>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <RefreshCw size={16} className={isFetching ? "spin" : ""} />
            {isFetching ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
      </header>

      {isLoading && <p>Carregando...</p>}
      {isError && <p style={{ color: "crimson" }}>Erro ao carregar suas consultas.</p>}

      {!isLoading && consultas?.length === 0 && <p>Nenhuma consulta encontrada.</p>}

      <ul style={{ display: "grid", gap: 8, padding: 0, listStyle: "none" }}>
        {consultas?.map((c) => {
          const bloquearCancelamento = menosDeUmaHora(c.dataHora); // OPCIONAL

          return (
            <li
              key={c.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: 12,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>
                  {c.medicoNome} {c.especialidade && <span>({c.especialidade})</span>}
                </div>
                <div style={{ color: "#555" }}>{formatDateTime(c.dataHora)}</div>
                {c.observacoes && <div style={{ marginTop: 6 }}>Obs.: {c.observacoes}</div>}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleCancelar(c.id)}
                  disabled={cancelando || bloquearCancelamento} // OPCIONAL
                  title={bloquearCancelamento ? "Não é possível cancelar a menos de 1h do início" : "Cancelar consulta"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: bloquearCancelamento ? "#888" : "#a00",
                    border: "1px solid #f1d0d0",
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: bloquearCancelamento ? "#f7f7f7" : "#fff6f6",
                    cursor: bloquearCancelamento ? "not-allowed" : "pointer",
                  }}
                >
                  <Trash2 size={16} />
                  {cancelando ? "Cancelando..." : bloquearCancelamento ? "Indisponível" : "Cancelar"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

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