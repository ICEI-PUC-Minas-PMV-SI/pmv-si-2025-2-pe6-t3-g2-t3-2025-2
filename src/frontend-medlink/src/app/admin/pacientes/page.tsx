"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api } from "@/app/services/api";
import styles from "./page.module.css";

type PacienteResponse = {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  endereco?: string | null;
};

export default function PacientesListPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-pacientes"],
    queryFn: async () => {
      const { data } = await api.get<PacienteResponse[]>(
        "/medlink/admin/pacientes",
      );
      return data;
    },
    staleTime: 30_000,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (p) =>
        p.nome?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        (p.telefone || "").toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <div className={styles.pacientes}>
      <div className="container">
        <header className={styles.pacientes__header}>
          <h1 className={styles.pacientes__title}>Pacientes</h1>

          <div className={styles.pacientes__searchwrap}>
            <label
              htmlFor="pacientes-search"
              className={styles["visually-hidden"]}
            >
              Buscar pacientes
            </label>
            <input
              id="pacientes-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, email ou telefone"
              className={styles.pacientes__search}
              aria-label="Buscar pacientes"
            />
          </div>
        </header>

        {isLoading && <p className={styles.pacientes__info}>Carregando...</p>}
        {isError && (
          <p
            className={`${styles.pacientes__info} ${styles["pacientes__info--error"]}`}
            role="alert"
          >
            Erro ao carregar pacientes.
          </p>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className={styles.pacientes__info}>Nenhum paciente encontrado.</p>
        )}

        {filtered.length > 0 && (
          <div className={styles.pacientes__tablewrap}>
            <table
              className={styles.pacientes__table}
              aria-label="Lista de pacientes"
            >
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Email</th>
                  <th scope="col">Telefone</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.email}</td>
                    <td>{p.telefone || "-"}</td>
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
