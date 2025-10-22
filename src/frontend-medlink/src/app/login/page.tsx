"use client"

import { ArrowHome } from "../components/arrow-home/arrow-home";
import "./styles.css"
import register_img from "../assets/register_img.png"
import Image from "next/image";
import { Logo } from "../components/logo/logo";
import Link from "next/link";
import { Input } from "../components/input/input";
import { NewTaskFormDataLogin, newTaskFormSchemaLogin } from "../validators/tasks-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "../services/auth";

export default function Login() {
    
    const form = useForm<NewTaskFormDataLogin>({
        resolver: zodResolver(newTaskFormSchemaLogin)
    })

    const { mutate: login, isPending, isError, error } = useLogin()

    function onSubmit(data: NewTaskFormDataLogin) {
        login(data)
    }
    
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
                <form className="form" onSubmit={form.handleSubmit(onSubmit)}>

                    <fieldset>
                        <legend>Login</legend>
                        {isError && (
                            <div className="erro-banner">
                                <p>
                                    Erro ao fazer login: {error?.message || "Verifique suas credenciais"}
                                </p>
                            </div>
                        )}
                        <div className="err-form">
                            <label htmlFor="email">Email</label>
                            <Input 
                                type="email" 
                                placeholder="email@email.com"
                                disabled={isPending}
                                {...form.register("email")}
                            />
                            {form.formState.errors.email && (
                                <div className="err-message">
                                    {form.formState.errors.email.message}
                                </div>
                            )}                           

                        </div>
                        <div className="err-form">
                            <label htmlFor="password">Senha</label>
                            <Input 
                                type="password"    
                                placeholder="Crie uma senha"
                                disabled={isPending}
                                {...form.register("password")}
                            /> 
                            {form.formState.errors.password && (
                                <div className="err-message">
                                    {form.formState.errors.password.message}
                                </div>
                            )} 

                        </div>
                    </fieldset>

                    <div className="login">
                        <button type="submit" disabled={isPending}>
                            {isPending ? "Entrando..." : "Entrar"}
                        </button>
                        <span>
                            Não possui cadastro? <Link href="/register" className="login-link">Cadastre-se</Link>
                        </span>
                    </div>
                    
                </form>
            </div>
        </main>
    )
}