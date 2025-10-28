// src/app/admin/layout.tsx
"use client";

import Link from "next/link";
import { useAdminLogout } from "@/hooks/useAdminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const logout = useAdminLogout();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #eee", padding: 16 }}>
        <h2 style={{ marginBottom: 16 }}>Admin</h2>
        <nav style={{ display: "grid", gap: 8 }}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/medicos">Médicos</Link>
          <Link href="/admin/pacientes">Pacientes</Link>
          <Link href="/admin/consultas">Consultas</Link>
          <button onClick={logout} style={{ marginTop: 16 }} type="button">Sair</button>
        </nav>
      </aside>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}