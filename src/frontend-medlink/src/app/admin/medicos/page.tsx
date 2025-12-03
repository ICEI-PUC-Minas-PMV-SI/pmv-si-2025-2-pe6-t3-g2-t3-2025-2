"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { api } from "@/app/services/api";
import styles from "./page.module.css";

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
      const { data } = await api.get<MedicoResponse[]>(
        "/medlink/admin/medicos",
      );
      return data;
    },
    staleTime: 30_000,
  });

  return (
    <div className={styles.medicos}>
      <div className="container">
        <header className={styles.medicos__header}>
          <h1 className={styles.medicos__title}>Médicos</h1>

          <div
            className={styles.medicos__actions}
            role="toolbar"
            aria-label="Ações"
          >
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className={`${styles.btn} ${styles["btn--refresh"]}`}
              aria-live="polite"
              aria-label={isFetching ? "Atualizando lista" : "Atualizar lista"}
            >
              <RefreshCw
                size={16}
                className={isFetching ? styles["icon-spin"] : ""}
                aria-hidden="true"
              />
              <span>{isFetching ? "Atualizando..." : "Atualizar"}</span>
            </button>

            <Link
              href="/admin/medicos/novo"
              className={`${styles.btn} ${styles["btn--primary"]}`}
            >
              <Plus size={16} aria-hidden="true" />
              <span>Novo Médico</span>
            </Link>
          </div>
        </header>

        {isLoading && <p className={styles.medicos__info}>Carregando...</p>}
        {isError && (
          <p
            className={`${styles.medicos__info} ${styles["medicos__info--error"]}`}
            role="alert"
          >
            Erro ao carregar médicos.
          </p>
        )}

        {data && data.length === 0 && (
          <div className={styles.medicos__empty}>
            <p className={styles.medicos__emptytext}>
              Nenhum médico cadastrado.
            </p>
            <Link
              href="/admin/medicos/novo"
              className={`${styles.btn} ${styles["btn--primary"]} ${styles["btn--mt"]}`}
            >
              Cadastrar primeiro médico
            </Link>
          </div>
        )}

        {data && data.length > 0 && (
          <div className={styles.medicos__tablewrap}>
            <table
              className={styles.medicos__table}
              aria-label="Lista de médicos"
            >
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Especialidade</th>
                  <th scope="col">CRM</th>
                  <th scope="col">Telefone</th>
                </tr>
              </thead>
              <tbody>
                {data.map((m) => (
                  <tr key={m.id}>
                    <td>{m.nome}</td>
                    <td className={styles["is-muted"]}>{m.especialidade}</td>
                    <td className={styles["is-muted"]}>{m.crm || "—"}</td>
                    <td className={styles["is-muted"]}>{m.telefone || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
