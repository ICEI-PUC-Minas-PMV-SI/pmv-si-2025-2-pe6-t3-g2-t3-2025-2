import { ArrowHome } from "../components/arrow-home/arrow-home";
import "./styles.css"
import register_img from "../assets/register_img.png"
import Image from "next/image";
import { Logo } from "../components/logo/logo";
import Link from "next/link";

export default function Register() {
    return (
        <main className="container">
            <Link href="/">
                <ArrowHome/>
            </Link>
            <div className="app">
                <aside className="aside">
                    <Image src={register_img} alt="Imagem de uma médica" className="img"/>
                    <div className="info">
                        <h1>
                            Crie sua conta e gerencie seus agendamentos com praticidade e segurança
                        </h1>
                        <Logo/>
                    </div>
                </aside>
                <form className="form">
                    <h2>Criar uma conta</h2>
                </form>
            </div>
        </main>
    )
}