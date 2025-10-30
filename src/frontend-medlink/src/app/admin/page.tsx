"use client";

import "./styles.css";
import Link from "next/link";

export default function AdminHome() {
  // Futuro: buscar métricas reais com React Query
  // const { data } = useQuery({ queryKey: ['admin-stats'], queryFn: getAdminStats });

  return (
    <div className="container">
      <header className="content-header">
        <div className="content-info">
          <h1>Dashboard do Administrador</h1>
          <p>Gerencie médicos, pacientes e consultas.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/admin/medicos/novo">
            <button type="button">Novo Médico</button>
          </Link>
          <Link href="/admin/slots">
            <button type="button">Gerenciar Slots</button>
          </Link>
        </div>
      </header>

      <section className="content-cards">
        <Card title="Médicos" value="—" href="/admin/medicos" subtitle="Gerenciar médicos" />
        <Card title="Pacientes" value="—" href="/admin/pacientes" subtitle="Lista de pacientes" />
        <Card title="Consultas" value="—" href="/admin/consultas" subtitle="Agenda e histórico" />
        <Card title="Slots" value="—" href="/admin/slots" subtitle="Gerenciar disponibilidade" />
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