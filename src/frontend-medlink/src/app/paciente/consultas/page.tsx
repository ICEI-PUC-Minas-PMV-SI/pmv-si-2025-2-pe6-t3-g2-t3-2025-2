"use client";

import { Plus, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { ArrowHome } from "@/app/components/arrow-home/arrow-home";
import { toast } from "@/app/components/ui/toast";
import { useCancelarConsulta } from "@/features/paciente/useCancelarConsulta";
import { useConsultasPaciente } from "@/features/paciente/useConsultasPaciente";
import { formatDateTime, isLessThanHourFromNow } from "@/lib/datetime";
import styles from "./page.module.css";

export default function ConsultasPacientePage() {
  const {
    data: consultas,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useConsultasPaciente();
  const { mutate: cancelar, isPending: cancelando } = useCancelarConsulta();

  const handleCancelar = (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta consulta?")) return;
    cancelar(id, {
      onSuccess: (msg: unknown) => {
        toast.success(typeof msg === "string" ? msg : "Consulta cancelada.");
      },
      onError: (err: unknown) => {
        const axiosErr = err as import("axios").AxiosError | undefined;
        const status = axiosErr?.response?.status;
        const msg =
          ((axiosErr?.response?.data as Record<string, unknown>)?.message as string | undefined) ||
          axiosErr?.response?.data ||
          "Não foi possível cancelar a consulta.";

        if (status === 404) toast.error("Consulta não encontrada.");
        else if (status === 403)
          toast.warning("Você não tem permissão para cancelar esta consulta.");
        else if (status === 400)
          toast.info("Cancelamento indisponível a menos de 1 hora do início.");
        else if (status === 409)
          toast.info("Esta consulta não pode ser cancelada no estado atual.");
        else toast.error(String(msg));

        console.log("[CancelarConsulta][ERR]", {
          status,
          url: axiosErr?.config?.url,
          method: axiosErr?.config?.method,
          data: axiosErr?.response?.data,
        });
      },
    });
  };

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
            <Link
              href="/paciente/consultas/nova"
              className={`${styles.btn} ${styles["btn--primary"]}`}
            >
              <Plus size={16} aria-hidden="true" />
              <span>Nova</span>
            </Link>
            <Link
              href="/paciente/perfil"
              className={styles.btn}
              aria-label="Meu Perfil"
            >
              <span>Perfil</span>
            </Link>
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
            <Link href="/" className={styles.btn} aria-label="Voltar para home">
              <ArrowHome />
            </Link>
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

        <ul className={styles.consultas__list} aria-label="Lista de consultas">
          {consultas
            ?.filter((c) => c.status !== "CANCELADO")
            .map((c) => {
              const bloquearCancelamento = isLessThanHourFromNow(c.dataHora);
              const podeCancelar =
                c.status === "CONFIRMADO" && !bloquearCancelamento;

              return (
                <li key={c.id} className={styles.consulta}>
                  <div className={styles.consulta__left}>
                    <div className={styles.consulta__medico}>
                      {c.medicoNome}{" "}
                      {c.especialidade && (
                        <span className={styles.consulta__esp}>
                          ({c.especialidade})
                        </span>
                      )}
                    </div>

                    {/* Badge de status solicitado */}
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
                    <button
                      type="button"
                      onClick={() => handleCancelar(c.id)}
                      disabled={cancelando || !podeCancelar}
                      title={
                        c.status !== "CONFIRMADO"
                          ? "Esta consulta não pode ser cancelada."
                          : bloquearCancelamento
                            ? "Não é possível cancelar a menos de 1h do início"
                            : "Cancelar consulta"
                      }
                      className={[
                        styles.btn,
                        styles["btn--danger"],
                        styles["btn--sm"],
                        !podeCancelar ? styles["btn--disabled"] : "",
                      ].join(" ")}
                      aria-label={`Cancelar consulta com ${c.medicoNome} em ${formatDateTime(c.dataHora)}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      <span>
                        {cancelando
                          ? "Cancelando..."
                          : !podeCancelar
                            ? "Indisponível"
                            : "Cancelar"}
                      </span>
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
