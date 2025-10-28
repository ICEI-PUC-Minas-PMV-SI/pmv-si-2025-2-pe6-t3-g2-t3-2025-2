"use client";

import "./styles.css"

import Link from "next/link";

export default function AdminHome() {
  // Aqui você pode, no futuro, usar React Query para buscar contagens:
  // const { data } = useQuery({ queryKey: ['admin-stats'], queryFn: getAdminStats });

  return (
    <div className="container">
      <header className="content-header">
        <div className="content-info">
          <h1>Dashboard do Administrador</h1>
          <p>Gerencie médicos, pacientes e consultas.</p>
        </div>
        <Link href="/admin/medicos/novo">
          <button type="button">Novo Médico</button>
        </Link>
      </header>

      <section className="content-cards">
        <Card title="Médicos" value="—" href="/admin/medicos" subtitle="Gerenciar médicos" />
        <Card title="Pacientes" value="—" href="/admin/pacientes" subtitle="Lista de pacientes" />
        <Card title="Consultas" value="—" href="/admin/consultas" subtitle="Agenda e histórico" />
      </section>

      <section className="content-list">
        <h2>Atividades recentes</h2>
        <ul>
          <li>Sem atividades recentes</li>
        </ul>
      </section>
    </div>
  );
}

function Card({ title, value, href, subtitle }: { title: string; value: string | number; href: string; subtitle?: string }) {
  return (
    <Link href={href} className="card-link">
      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-value">{value}</div>
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
      </div>
    </Link>
  );
}