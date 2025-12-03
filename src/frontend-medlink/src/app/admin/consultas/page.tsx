"use client";

import { useMemo, useState } from "react";
import {
  type ConsultaAdminDTO,
  type ConsultasAdminFilters,
  useAdminConsultas,
} from "@/features/admin/useAdminConsultas";
import { useCancelarConsultaAdmin } from "@/features/admin/useCancelarConsulta";
import {
  useAdminMedicosMap,
  useAdminPacientesMap,
} from "@/features/admin/useMaps";
import styles from "./page.module.css";

type StatusFilter = "" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    const dd = pad(d.getDate());
    const mm = pad(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  } catch {
    return iso;
  }
}

const statusLabel: Record<"CONFIRMADO" | "CANCELADO" | "CONCLUIDO", string> = {
  CONFIRMADO: "Agendada",
  CANCELADO: "Cancelada",
  CONCLUIDO: "Finalizada",
};

export default function AdminConsultasPage() {
  const [filters, setFilters] = useState<ConsultasAdminFilters>({ status: "" });

  const [q, setQ] = useState(filters.q ?? "");
  const [from, setFrom] = useState(filters.from ?? "");
  const [to, setTo] = useState(filters.to ?? "");
  const [status, setStatus] = useState<StatusFilter>(filters.status ?? "");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error } = useAdminConsultas(filters);
  const cancelar = useCancelarConsultaAdmin();

  const { data: medicosMap } = useAdminMedicosMap();
  const { data: pacientesMap } = useAdminPacientesMap();
  const medicoLabel = (id: string) => medicosMap?.get(id)?.nome ?? id;
  const pacienteLabel = (id: string) => pacientesMap?.get(id)?.nome ?? id;

  const consultas: ConsultaAdminDTO[] = data ?? [];

  const totalPages = Math.max(Math.ceil(consultas.length / pageSize), 1);
  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  const pageItems = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return (consultas ?? []).slice(start, end);
  }, [consultas, page, pageSize]);

  function applyFilters() {
    setFilters({
      q: q || undefined,
      from: from || undefined,
      to: to || undefined,
      status: status || undefined,
    });
    setPage(0);
  }

  function clearFilters() {
    setQ("");
    setFrom("");
    setTo("");
    setStatus("");
    setFilters({});
    setPage(0);
  }

  return (
    <div className={styles["admin-consultas"]}>
      <div className="container">
        <h1 className={styles["admin-consultas__title"]}>Consultas</h1>

        {/* Filtros */}
        <section
          className={styles["admin-consultas__filters"]}
          aria-label="Filtros"
        >
          <div
            className={`${styles["admin-consultas__field"]} ${styles["admin-consultas__field--span2"]}`}
          >
            <label htmlFor="buscar" className={styles["ac-label"]}>
              Buscar (livre)
            </label>
            <input
              id="buscar"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={styles["ac-input"]}
              placeholder="Nome, email, observação..."
            />
          </div>
          <div className={styles["admin-consultas__field"]}>
            <label htmlFor="de" className={styles["ac-label"]}>
              De
            </label>
            <input
              id="de"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={styles["ac-input"]}
            />
          </div>
          <div className={styles["admin-consultas__field"]}>
            <label htmlFor="ate" className={styles["ac-label"]}>
              Até
            </label>
            <input
              id="ate"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={styles["ac-input"]}
            />
          </div>
          <div className={styles["admin-consultas__field"]}>
            <label htmlFor="status" className={styles["ac-label"]}>
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className={styles["ac-input"]}
            >
              <option value="">Todos</option>
              <option value="CONFIRMADO">Agendada</option>
              <option value="CANCELADO">Cancelada</option>
              <option value="CONCLUIDO">Finalizada</option>
            </select>
          </div>

          <div className={styles["admin-consultas__actions"]}>
            <button
              type="button"
              onClick={applyFilters}
              className={`${styles["ac-button"]} ${styles["ac-button--primary"]}`}
            >
              Aplicar filtros
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className={styles["ac-button"]}
            >
              Limpar
            </button>
          </div>
        </section>

        {/* Tabela */}
        <div className={styles["admin-consultas__tablewrap"]}>
          <table className={styles["ac-table"]} aria-label="Lista de consultas">
            <thead>
              <tr>
                <th scope="col">Data/Hora</th>
                <th scope="col">Paciente</th>
                <th scope="col">Médico</th>
                <th scope="col">Observação</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td className={styles["ac-cell"]} colSpan={6}>
                    Carregando...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td
                    className={`${styles["ac-cell"]} ${styles["ac-cell--error"]}`}
                    colSpan={6}
                  >
                    Erro: {(error as Error)?.message ?? "Falha ao carregar"}
                  </td>
                </tr>
              )}
              {!isLoading && (pageItems ?? []).length === 0 && (
                <tr>
                  <td className={styles["ac-cell"]} colSpan={6}>
                    Nenhuma consulta encontrada.
                  </td>
                </tr>
              )}

              {(pageItems ?? []).map((c) => (
                <tr key={c.id}>
                  <td className={styles["ac-cell"]}>
                    {formatDateTime(c.dataHora)}
                  </td>
                  <td className={styles["ac-cell"]}>
                    <div className={styles["ac-strong"]}>
                      {pacienteLabel(c.pacienteId)}
                    </div>
                  </td>
                  <td className={styles["ac-cell"]}>
                    <div className={styles["ac-strong"]}>
                      {medicoLabel(c.medicoId)}
                    </div>
                    <div className={styles["ac-subtle"]}></div>
                  </td>
                  <td className={styles["ac-cell"]}>{c.observacao ?? "-"}</td>
                  <td className={styles["ac-cell"]}>
                    <span
                      className={[
                        styles["ac-chip"],
                        c.status === "CONFIRMADO"
                          ? styles["ac-chip--ok"]
                          : c.status === "CANCELADO"
                            ? styles["ac-chip--danger"]
                            : styles["ac-chip--muted"],
                      ].join(" ")}
                    >
                      {c.status ? statusLabel[c.status] : "-"}
                    </span>
                  </td>
                  <td className={styles["ac-cell"]}>
                    <button
                      type="button"
                      aria-label="Cancelar consulta"
                      className={`${styles["ac-button"]} ${styles["ac-button--ghost"]}`}
                      disabled={c.status !== "CONFIRMADO" || cancelar.isPending}
                      onClick={() => {
                        if (confirm(`Cancelar a consulta #${c.id}?`)) {
                          cancelar.mutate(c.id);
                        }
                      }}
                    >
                      {cancelar.isPending ? "Cancelando..." : "Cancelar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação local */}
        <div className={styles["admin-consultas__pagination"]}>
          <div className={styles["ac-muted"]}>
            Página {page + 1} de {Math.max(totalPages, 1)}
          </div>
          <div className={styles["admin-consultas__pager"]}>
            <button
              type="button"
              className={styles["ac-button"]}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={!canPrev}
            >
              Anterior
            </button>
            <button
              type="button"
              className={styles["ac-button"]}
              onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
              disabled={!canNext}
            >
              Próxima
            </button>
            <select
              className={`${styles["ac-input"]} ${styles["ac-input--sm"]}`}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              aria-label="Resultados por página"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
