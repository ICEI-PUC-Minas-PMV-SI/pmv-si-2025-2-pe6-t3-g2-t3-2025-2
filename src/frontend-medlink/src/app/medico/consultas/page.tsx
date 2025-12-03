"use client";

import { RefreshCw } from "lucide-react";
import { useMedicoConsultas } from "@/features/medico/useMedicoConsultas";
import { formatDateTime } from "@/lib/datetime";
import styles from "../../paciente/consultas/page.module.css";

export default function MedicoConsultasPage() {
  const {
    data: consultas,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMedicoConsultas();

  return (
    <div className={styles.consultas}>
      <div className="container">
        <header className={styles.consultas__header}>
          <h1 className={styles.consultas__title}>Minhas Consultas</h1>
          <div
            className={styles.consultas__actions}
            role="toolbar"
            aria-label="Ações da página"
          >
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className={styles.btn}
              aria-label={
                isFetching ? "Atualizando consultas" : "Atualizar consultas"
              }
              aria-live="polite"
            >
              <RefreshCw
                size={16}
                className={isFetching ? styles["icon-spin"] : ""}
                aria-hidden="true"
              />
              <span>{isFetching ? "Atualizando..." : "Atualizar"}</span>
            </button>
          </div>
        </header>

        {isLoading && <p className={styles.consultas__info}>Carregando...</p>}
        {isError && (
          <p
            className={`${styles.consultas__info} ${styles["consultas__info--error"]}`}
            role="alert"
          >
            Erro ao carregar suas consultas.
          </p>
        )}

        {!isLoading && (consultas?.length ?? 0) === 0 && (
          <p className={styles.consultas__info}>Nenhuma consulta encontrada.</p>
        )}

        <ul
          className={styles.consultas__list}
          aria-label="Lista de consultas do médico"
        >
          {consultas
            ?.filter((c) => c.status !== "CANCELADO")
            .map((c) => (
              <li key={c.id} className={styles.consulta}>
                <div className={styles.consulta__left}>
                  <div className={styles.consulta__medico}>
                    Paciente: {c.pacienteNome}
                  </div>

                  {/* Badge de status */}
                  {c.status !== "CONFIRMADO" && (
                    <output
                      className={[
                        styles.badge,
                        c.status === "CANCELADO"
                          ? styles["badge--danger"]
                          : styles["badge--success"],
                        styles.consulta__status,
                      ].join(" ")}
                    >
                      {c.status === "CANCELADO" ? "Cancelada" : "Concluída"}
                    </output>
                  )}

                  <div className={styles.consulta__datetime}>
                    {formatDateTime(c.dataHora)}
                  </div>
                  {c.observacoes && (
                    <div className={styles.consulta__obs}>
                      Obs.: {c.observacoes}
                    </div>
                  )}
                </div>

                <div className={styles.consulta__right}>
                  <output
                    className={[
                      styles.badge,
                      c.status === "CONFIRMADO"
                        ? styles["badge--info"]
                        : c.status === "CONCLUIDO"
                          ? styles["badge--success"]
                          : styles["badge--danger"],
                    ].join(" ")}
                  >
                    {c.status === "CONFIRMADO"
                      ? "Confirmada"
                      : c.status === "CONCLUIDO"
                        ? "Concluída"
                        : "Cancelada"}
                  </output>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
