"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { Logo } from "../logo/logo";
import styles from "./navbar.module.css";

interface NavbarLink {
  label: string;
  href: string;
}

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  const links: NavbarLink[] = [
    { label: "Sobre", href: "#sobre" },
    { label: "Especialidades", href: "#especialidades" },
    { label: "Profissionais", href: "#profissionais" },
  ];

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Fecha o menu ao navegar (click nos links)
  function handleNavigate() {
    setOpen(false);
  }

  // Fecha com Escape e clique fora
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <nav className={styles.navbar} aria-label="Barra de navegação principal">
      <Link href="/" className={styles.logo} onClick={handleNavigate}>
        <Logo />
      </Link>

      {/* Links desktop */}
      <div className={styles.links}>
        {links.map((link) => (
          <Link key={link.label} href={link.href} className={styles.link}>
            {link.label}
          </Link>
        ))}

        {isAuthenticated ? (
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className={`${styles.link} ${styles["btn-reset"]}`}
            type="button"
          >
            Sair
          </button>
        ) : (
          <Link href="/login" className={styles.link}>
            Entrar
          </Link>
        )}
      </div>

      {/* Botão mobile */}
      <button
        type="button"
        ref={btnRef}
        className={`${styles.navbar__toggle} ${styles["btn-reset"]}`}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="navbar-mobile-panel"
        onClick={() => setOpen((s) => !s)}
      >
        {open ? (
          <X size={22} aria-hidden="true" />
        ) : (
          <Menu size={22} aria-hidden="true" />
        )}
      </button>

      {/* Painel mobile */}
      <div
        id="navbar-mobile-panel"
        ref={panelRef}
        className={`${styles.navbar__panel} ${open ? styles["is-open"] : ""}`}
      >
        <div className={styles.navbar__panel_inner}>
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.label}
              className={`${styles.link} ${styles["link--block"]}`}
              onClick={handleNavigate}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className={`${styles.link} ${styles["link--block"]} ${styles["btn-reset"]}`}
              type="button"
            >
              Sair
            </button>
          ) : (
            <Link
              href="/login"
              className={`${styles.link} ${styles["link--block"]}`}
              onClick={handleNavigate}
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
