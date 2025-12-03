"use client";

import {
  CalendarCheck2,
  Clock8,
  Gauge,
  LogOut,
  Menu,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAdminLogout } from "@/hooks/useAdminAuth";
import styles from "./layout.module.css";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const logout = useAdminLogout();
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDrawerOpen(false);
      }
    }

    function onClickOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [drawerOpen]);

  const links = [
    {
      href: "/admin",
      label: "Dashboard",
      Icon: Gauge,
      match: (p: string) => p === "/admin",
    },
    {
      href: "/admin/medicos",
      label: "Médicos",
      Icon: Stethoscope,
      match: (p: string) => p.startsWith("/admin/medicos"),
    },
    {
      href: "/admin/pacientes",
      label: "Pacientes",
      Icon: Users,
      match: (p: string) => p.startsWith("/admin/pacientes"),
    },
    {
      href: "/admin/consultas",
      label: "Consultas",
      Icon: CalendarCheck2,
      match: (p: string) => p.startsWith("/admin/consultas"),
    },
    {
      href: "/admin/slots",
      label: "Slots",
      Icon: Clock8,
      match: (p: string) => p.startsWith("/admin/slots"),
    },
  ];

  return (
    <div className={styles["admin-layout"]}>
      {/* Sidebar fixa lateral (desktop/tablet) */}
      <aside className={styles["admin-layout__sidebar"]}>
        <h2 className={styles["admin-layout__brand"]}>Admin</h2>

        {/* Nav vertical desktop/tablet */}
        <nav
          className={styles["admin-layout__nav"]}
          aria-label="Admin navigation"
        >
          {links.map(({ href, label, Icon, match }) => {
            const active = match(pathname ?? "");
            const linkClass = `${styles["admin-layout__link"]} ${
              active ? styles["admin-layout__link--active"] : ""
            }`;
            return (
              <Link
                key={href}
                href={href}
                className={linkClass}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  aria-hidden="true"
                  className={styles["admin-layout__icon"]}
                  size={18}
                />
                <span className={styles["admin-layout__linktext"]}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={styles["admin-layout__footer"]}>
          <button
            onClick={logout}
            type="button"
            className={styles["admin-layout__logout"]}
            aria-label="Sair"
          >
            <LogOut
              aria-hidden="true"
              className={styles["admin-layout__icon"]}
              size={18}
            />
            <span className={styles["admin-layout__linktext"]}>Sair</span>
          </button>
        </div>
      </aside>

      {/* Header mobile com botão hamburger */}
      <header className={styles["admin-layout__mobile-header"]}>
        <button
          aria-label="Abrir menu"
          aria-expanded={drawerOpen}
          aria-controls="admin-drawer"
          onClick={() => setDrawerOpen(true)}
          className={styles["admin-layout__hamburger"]}
          type="button"
        >
          <Menu size={24} />
        </button>
        <h1 className={styles["admin-layout__mobile-brand"]}>Admin</h1>
      </header>

      {/* Drawer lateral mobile */}
      {drawerOpen && (
        <div
          className={styles["admin-layout__drawer-overlay"]}
          role="dialog"
          aria-modal="true"
          id="admin-drawer"
        >
          <div className={styles["admin-layout__drawer"]} ref={drawerRef}>
            <button
              aria-label="Fechar menu"
              onClick={() => setDrawerOpen(false)}
              className={styles["admin-layout__drawer-close"]}
              type="button"
            >
              <X size={24} />
            </button>

            <nav
              className={styles["admin-layout__drawer-nav"]}
              aria-label="Admin navigation"
            >
              {links.map(({ href, label, Icon, match }) => {
                const active = match(pathname ?? "");
                const linkClass = `${styles["admin-layout__link"]} ${
                  active ? styles["admin-layout__link--active"] : ""
                }`;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={linkClass}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setDrawerOpen(false)} // fecha drawer ao clicar
                  >
                    <Icon
                      aria-hidden="true"
                      className={styles["admin-layout__icon"]}
                      size={18}
                    />
                    <span className={styles["admin-layout__linktext"]}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className={styles["admin-layout__drawer-footer"]}>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                }}
                type="button"
                className={styles["admin-layout__logout"]}
                aria-label="Sair"
              >
                <LogOut
                  aria-hidden="true"
                  className={styles["admin-layout__icon"]}
                  size={18}
                />
                <span className={styles["admin-layout__linktext"]}>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={styles["admin-layout__main"]}>
        <div className="container">{children}</div>
      </main>
    </div>
  );
}

export default AdminShell;
