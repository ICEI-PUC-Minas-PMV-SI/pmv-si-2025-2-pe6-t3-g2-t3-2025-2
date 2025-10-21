import Image from "next/image";
import logo from "../../assets/logo.svg"
import logo_name from "../../assets/logo_nome.svg"

export function Logo() {
    return (
        <div className="logo">
            <Image src={logo} alt="logo Medlink" width={36}></Image>
            <Image src={logo_name} alt="logo Medlink" width={120}></Image>
        </div>
    )
}