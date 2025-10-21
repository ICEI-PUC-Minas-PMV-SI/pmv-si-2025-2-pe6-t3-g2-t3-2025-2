import { ComponentProps } from "react";
import "./styles.css"
import logo from "../../assets/logo.svg"
import logo_name from "../../assets/logo_nome.svg"
import Image from "next/image";

interface NavbarProps extends ComponentProps<'link'> {}

export function Navbar(props: NavbarProps) {
    return (
        <nav>
            <div className="logo">
               <Image src={logo} alt="logo Medlink" width={36}></Image>
               <Image src={logo_name} alt="logo Medlink" width={120}></Image>
            </div>
        </nav>
    )
}