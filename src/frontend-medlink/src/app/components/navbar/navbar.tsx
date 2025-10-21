import { Logo } from "../logo/logo";
import "./styles.css"
import Link from "next/link";

interface NavbarLink {
    label: string
    href: string
}

export function Navbar() {

    const links: NavbarLink[] = [
        {label: "Sobre", href: "#sobre"},
        {label: "Especialidades", href: "#especialidades"},
        {label: "Profissionais", href: "#profissionais"},
        {label: "Entrar", href: "/register"},
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
            </div>
        </nav>
    )
}