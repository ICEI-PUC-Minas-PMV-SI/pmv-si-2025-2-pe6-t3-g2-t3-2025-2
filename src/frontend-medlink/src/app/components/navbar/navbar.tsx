"use client"

import { useAuth } from "@/app/contexts/auth-context";
import { Logo } from "../logo/logo";
import "./styles.css"
import Link from "next/link";

interface NavbarLink {
    label: string
    href: string
}

export function Navbar() {

    const { isAuthenticated, logout } = useAuth()

    const links: NavbarLink[] = [
        {label: "Sobre", href: "#sobre"},
        {label: "Especialidades", href: "#especialidades"},
        {label: "Profissionais", href: "#profissionais"},
    ]

    return (
        <nav>
            <Link href="/" className="logo">
               <Logo/>
            </Link>
            <div className="links">
                {links.map((link) => (
                    <Link href={link.href} key={link.label} className="link">
                        {link.label}
                    </Link>
                ))}
                {isAuthenticated ? (
                    <button onClick={logout} className="link" type="button">
                        Sair
                    </button>
                ) : (
                    <Link href="/login" className="link">
                        Entrar
                    </Link>
                )}
            </div>
        </nav>
    )
}