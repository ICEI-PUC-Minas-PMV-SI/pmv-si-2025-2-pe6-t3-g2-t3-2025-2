'use client';

import Link from 'next/link';
import './styles.css';

export default function AdminHome() {
  // Futuro: buscar métricas reais com React Query
  // const { data } = useQuery({ queryKey: ['admin-stats'], queryFn: getAdminStats });

  return (
    <div className="admin">
      <header className="admin__header">
        <div className="admin__headinfo">
          <h1 className="admin__title">Dashboard do Administrador</h1>
          <p className="admin__subtitle">Gerencie médicos, pacientes e consultas.</p>
        </div>
        <div className="admin__headactions">
          <Link href="/admin/medicos/novo" className="btn btn--primary">Novo Médico</Link>
          <Link href="/admin/slots" className="btn">Gerenciar Slots</Link>
        </div>
      </header>

      <section className="admin__cards">
        <Card title="Médicos" value="—" href="/admin/medicos" subtitle="Gerenciar médicos" />
        <Card title="Pacientes" value="—" href="/admin/pacientes" subtitle="Lista de pacientes" />
        <Card title="Consultas" value="—" href="/admin/consultas" subtitle="Agenda e histórico" />
        <Card title="Slots" value="—" href="/admin/slots" subtitle="Gerenciar disponibilidade" />
      </section>

      <section className="admin__list">
        <h2 className="admin__sectiontitle">Atividades recentes</h2>
        <ul className="admin__ul">
          <li className="admin__li">Sem atividades recentes</li>
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
    <Link href={href} className="card">
      <div className="card__content">
        <div className="card__title">{title}</div>
        <div className="card__value">{value}</div>
        {subtitle && <div className="card__subtitle">{subtitle}</div>}
      </div>
    </Link>
  );
}