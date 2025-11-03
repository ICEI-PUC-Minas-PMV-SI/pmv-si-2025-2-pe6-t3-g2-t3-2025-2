'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function AdminHome() {
  return (
    <div className={styles.admin}>
      <header className={styles.admin__header}>
        <div className={styles.admin__headinfo}>
          <h1 className={styles.admin__title}>Dashboard do Administrador</h1>
          <p className={styles.admin__subtitle}>Gerencie médicos, pacientes e consultas.</p>
        </div>

        <div className={styles.admin__headactions} role="toolbar" aria-label="Ações do administrador">
          <Link href="/admin/medicos/novo" className={`${styles.btn} ${styles['btn--primary']}`}>
            Novo Médico
          </Link>
          <Link href="/admin/slots" className={styles.btn}>
            Gerenciar Slots
          </Link>
        </div>
      </header>

      <section className={styles.admin__cards} aria-label="Resumo">
        <Card title="Médicos" value="—" href="/admin/medicos" subtitle="Gerenciar médicos" />
        <Card title="Pacientes" value="—" href="/admin/pacientes" subtitle="Lista de pacientes" />
        <Card title="Consultas" value="—" href="/admin/consultas" subtitle="Agenda e histórico" />
        <Card title="Slots" value="—" href="/admin/slots" subtitle="Gerenciar disponibilidade" />
      </section>

      <section className={styles.admin__list}>
        <h2 className={styles.admin__sectiontitle}>Atividades recentes</h2>
        <ul className={styles.admin__ul}>
          <li className={styles.admin__li}>Sem atividades recentes</li>
        </ul>
      </section>
    </div>
  );
}

function Card({
  title,
  value,
  href,
  subtitle,
}: {
  title: string;
  value: string | number;
  href: string;
  subtitle?: string;
}) {
  return (
    <Link href={href} className={styles.card} aria-label={`${title} — ${subtitle ?? ''}`}>
      <div className={styles.card__content}>
        <div className={styles.card__title}>{title}</div>
        <div className={styles.card__value}>{value}</div>
        {subtitle && <div className={styles.card__subtitle}>{subtitle}</div>}
      </div>
    </Link>
  );
}