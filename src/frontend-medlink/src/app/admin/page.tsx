import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

function parseJwt(token: string | undefined | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default async function AdminHome() {
  const cookieStore = await cookies();
  const token = cookieStore.get?.("token")?.value;
  if (!token) redirect("/admin/login");

  const user = parseJwt(token);
  // Accept role in `role` or OR in `authorities` (e.g. ['ROLE_ADMIN'])
  const isAdmin =
    user &&
    (user.role === "ADMIN" ||
      (Array.isArray(user.authorities) &&
        user.authorities.includes("ROLE_ADMIN")));
  if (!isAdmin) redirect("/admin/login");
  return (
    <div className={styles.admin}>
      <header className={styles.admin__header}>
        <div className={styles.admin__headinfo}>
          <h1 className={styles.admin__title}>Dashboard do Administrador</h1>
          <p className={styles.admin__subtitle}>
            Gerencie médicos, pacientes e consultas.
          </p>
        </div>

        <div
          className={styles.admin__headactions}
          role="toolbar"
          aria-label="Ações do administrador"
        >
          <Link
            href="/admin/medicos/novo"
            className={`${styles.btn} ${styles["btn--primary"]}`}
          >
            Novo Médico
          </Link>
          <Link href="/admin/slots" className={styles.btn}>
            Gerenciar Slots
          </Link>
        </div>
      </header>

      <section className={styles.admin__cards} aria-label="Resumo">
        <Card
          title="Médicos"
          value="—"
          href="/admin/medicos"
          subtitle="Gerenciar médicos"
        />
        <Card
          title="Pacientes"
          value="—"
          href="/admin/pacientes"
          subtitle="Lista de pacientes"
        />
        <Card
          title="Consultas"
          value="—"
          href="/admin/consultas"
          subtitle="Agenda e histórico"
        />
        <Card
          title="Slots"
          value="—"
          href="/admin/slots"
          subtitle="Gerenciar disponibilidade"
        />
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
    <Link
      href={href}
      className={styles.card}
      aria-label={`${title} — ${subtitle ?? ""}`}
    >
      <div className={styles.card__content}>
        <div className={styles.card__title}>{title}</div>
        <div className={styles.card__value}>{value}</div>
        {subtitle && <div className={styles.card__subtitle}>{subtitle}</div>}
      </div>
    </Link>
  );
}
