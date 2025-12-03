"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default function MedicoDisponibilidadesPage() {
  return (
    <div className={styles.disponibilidades}>
      <div className="container">
        <header className={styles.disponibilidades__header}>
          <h1 className={styles.disponibilidades__title}>
            Minhas Disponibilidades
          </h1>
          <div
            className={styles.disponibilidades__actions}
            role="toolbar"
            aria-label="Ações da página"
          >
            <Link
              href="/medico"
              className={styles.btn}
              aria-label="Voltar para painel"
            >
              ← Voltar
            </Link>
          </div>
        </header>

        <div className={styles.disponibilidades__placeholder}>
          <div
            className={styles.disponibilidades__placeholder_icon}
            aria-hidden="true"
          >
            <Calendar size={48} />
          </div>
          <p className={styles.disponibilidades__placeholder_text}>
            Gerenciamento de Disponibilidades
          </p>
          <p className={styles.disponibilidades__placeholder_hint}>
            Este recurso será implementado em breve. Você poderá criar e
            gerenciar seus horários de atendimento.
          </p>
          <Link
            href="/medico"
            className={styles.btn}
            aria-label="Voltar para painel"
          >
            Voltar ao Painel
          </Link>
        </div>
      </div>
    </div>
  );
}
