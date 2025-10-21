import "./styles.css"
import logo from "../../assets/logo.svg"
import logo_name from "../../assets/logo_nome.svg"
import Image from "next/image";
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
        {label: "Entrar", href: "#entrar"},
    ]

    return (
        <nav>
            <Link href="/" className="logo">
                <Image src={logo} alt="logo Medlink" width={36}></Image>
                <Image src={logo_name} alt="logo Medlink" width={120}></Image>
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