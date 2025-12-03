import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "../admin/page.module.css";

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

export default async function MedicoHome() {
  const cookieStore = await cookies();
  const token = cookieStore.get?.("token")?.value;
  if (!token) redirect("/admin/login");

  const user = parseJwt(token);
  const isMedico =
    user &&
    (user.role === "MEDICO" ||
      (Array.isArray(user.authorities) &&
        user.authorities.includes("ROLE_MEDICO")));
  if (!isMedico) redirect("/admin/login");

  return (
    <div className={styles.admin}>
      <header className={styles.admin__header}>
        <div className={styles.admin__headinfo}>
          <h1 className={styles.admin__title}>Painel do Médico</h1>
          <p className={styles.admin__subtitle}>
            Visualize suas consultas e crie disponibilidades.
          </p>
        </div>

        <div
          className={styles.admin__headactions}
          role="toolbar"
          aria-label="Ações do médico"
        >
          <Link
            href="/medico/disponibilidades"
            className={`${styles.btn} ${styles["btn--primary"]}`}
          >
            Nova Disponibilidade
          </Link>
        </div>
      </header>

      <section className={styles.admin__cards} aria-label="Resumo">
        <Card
          title="Minhas Consultas"
          value="—"
          href="/medico/consultas"
          subtitle="Agendamentos"
        />
        <Card
          title="Disponibilidades"
          value="—"
          href="/medico/disponibilidades"
          subtitle="Gerenciar horários"
        />
      </section>

      <section className={styles.admin__list}>
        <h2 className={styles.admin__sectiontitle}>Início rápido</h2>
        <ul className={styles.admin__ul}>
          <li className={styles.admin__li}>
            <Link
              href="/medico/consultas"
              style={{ color: "#0066cc", textDecoration: "underline" }}
            >
              Ver minhas consultas agendadas
            </Link>
          </li>
          <li className={styles.admin__li}>
            <Link
              href="/medico/disponibilidades"
              style={{ color: "#0066cc", textDecoration: "underline" }}
            >
              Adicionar nova disponibilidade
            </Link>
          </li>
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
