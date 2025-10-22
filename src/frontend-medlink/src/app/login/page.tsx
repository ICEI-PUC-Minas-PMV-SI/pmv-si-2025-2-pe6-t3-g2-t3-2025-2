import { ArrowHome } from "../components/arrow-home/arrow-home";
import "./styles.css"
import register_img from "../assets/register_img.png"
import Image from "next/image";
import { Logo } from "../components/logo/logo";
import Link from "next/link";
import { Input } from "../components/input/input";

export default function Login() {
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
                            Bem-vindo(a)! Conte com uma clínica que cuida da sua saúde com praticidade e atenção
                        </h1>
                        <Logo/>
                    </div>
                </aside>
                <form className="form">

                    <fieldset>
                        <legend>Login</legend>

                        <label htmlFor="email">Email</label>
                        <Input name="email" type="" required placeholder="email@email.com" min={5}/> 
                        <label htmlFor="password">Senha</label>
                        <Input name="password" type="password" required placeholder="Crie uma senha" min={5}/>  
                    </fieldset>

                    <div className="login">
                        <button type="submit">Entrar</button>
                        <span>
                            Não possui cadastro? <Link href="/register" className="login-link">Cadastre-se</Link>
                        </span>
                    </div>
                    
                </form>
            </div>
        </main>
    )
}