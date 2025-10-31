'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './layout.css';
import { useAdminLogout } from '@/hooks/useAdminAuth';

// Ícones do lucide-react
import {
  Gauge,
  Stethoscope,
  Users,
  CalendarCheck2,
  Clock8,
  LogOut,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const logout = useAdminLogout();
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', Icon: Gauge, match: (p: string) => p === '/admin' },
    { href: '/admin/medicos', label: 'Médicos', Icon: Stethoscope, match: (p: string) => p.startsWith('/admin/medicos') },
    { href: '/admin/pacientes', label: 'Pacientes', Icon: Users, match: (p: string) => p.startsWith('/admin/pacientes') },
    { href: '/admin/consultas', label: 'Consultas', Icon: CalendarCheck2, match: (p: string) => p.startsWith('/admin/consultas') },
    { href: '/admin/slots', label: 'Slots', Icon: Clock8, match: (p: string) => p.startsWith('/admin/slots') },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <h2 className="admin-layout__brand">Admin</h2>
        <nav className="admin-layout__nav" aria-label="Admin navigation">
          {links.map(({ href, label, Icon, match }) => {
            const active = match(pathname ?? '');
            return (
              <Link
                key={href}
                href={href}
                className={`admin-layout__link${active ? ' admin-layout__link--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon aria-hidden="true" className="admin-layout__icon" size={18} />
                <span className="admin-layout__linktext">{label}</span>
              </Link>
            );
          })}
          <button
            onClick={logout}
            type="button"
            className="admin-layout__logout"
            aria-label="Sair"
          >
            <LogOut aria-hidden="true" className="admin-layout__icon" size={18} />
            <span className="admin-layout__linktext">Sair</span>
          </button>
        </nav>
      </aside>
      <main className="admin-layout__main">{children}</main>
    </div>
  );
}