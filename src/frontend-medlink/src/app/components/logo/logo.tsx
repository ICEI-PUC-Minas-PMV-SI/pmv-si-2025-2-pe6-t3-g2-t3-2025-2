import Image from "next/image";
import logo from "../../assets/logo.svg"

export function Logo() {
    return (
        <div className="logo">
            <Image src={logo} alt="logo Medlink"></Image>
        </div>
    )
}