import { ArrowHome } from "../components/arrow-home/arrow-home";
import "./styles.css"
import register_img from "../assets/register_img.png"
import Image from "next/image";
import { Logo } from "../components/logo/logo";
import Link from "next/link";
import { Input } from "../components/input/input";

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

                    <fieldset>
                        <legend>Criar uma conta</legend>
                        <label htmlFor="nome">Nome</label>
                        <Input name="name" type="text" required placeholder="Digite seu nome completo" min={5}/>

                        <label htmlFor="email">Email</label>
                        <Input name="email" type="" required placeholder="email@email.com" min={5}/>

                        <label htmlFor="phone">Telefone</label>
                        <Input name="phone" type="tel" required placeholder="(99) 9 9999-9999" min={5}/>  
                        <label htmlFor="password">Senha</label>
                        <Input name="password" type="password" required placeholder="Crie uma senha" min={5}/>  
                    </fieldset>

                    <div className="checkbox">
                        <Input type="checkbox" />
                        <label htmlFor="terms">Confirmo que li e concordo com o Contrato do Cliente, os Termos ce Condições e as políticas legais da Medlink.</label>
                    </div>

                    <div className="register">
                        <button type="submit">Cadastrar</button>
                    </div>
                    
                </form>
            </div>
        </main>
    )
}