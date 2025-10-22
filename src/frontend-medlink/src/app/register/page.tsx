"use client"

import { ArrowHome } from "../components/arrow-home/arrow-home"
import "./styles.css"
import register_img from "../assets/register_img.png"
import Image from "next/image";
import { Logo } from "../components/logo/logo";
import Link from "next/link";
import { Input } from "../components/input/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewTaskFormData, newTaskFormSchema } from "../validators/tasks-validators";

export default function Register() {
    const form = useForm<NewTaskFormData>({
        resolver: zodResolver(newTaskFormSchema)
    })

    function onSubmit(data: NewTaskFormData) {
        console.log(data)
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
                            Crie sua conta e gerencie seus agendamentos com praticidade e segurança
                        </h1>
                        <Logo/>
                    </div>
                </aside>
                <form className="form" onSubmit={form.handleSubmit(onSubmit)}>

                    <fieldset>
                        <legend>Criar uma conta</legend>
                        <div className="err-form">
                            <label htmlFor="nome">Nome</label>
                            <Input type="text" placeholder="Digite seu nome completo" { ...form.register("name") }/>
                            {form.formState.errors.name && (
                                <p className="err-message">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="err-form">
                            <label htmlFor="email">Email</label>
                            <Input type="" placeholder="email@email.com" { ...form.register("email") }/>
                            {form.formState.errors.email && (
                                <p className="err-message">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="err-form">
                            <label htmlFor="phone">Telefone</label>
                            <Input type="tel" placeholder="(99) 9 9999-9999" { ...form.register("phone") }/>
                            {form.formState.errors.phone && (
                                <p className="err-message">
                                    {form.formState.errors.phone.message}
                                </p>
                            )}
                        </div>
                        <div className="err-form">
                            <label htmlFor="password">Senha</label>
                            <Input type="password" placeholder="Crie uma senha" { ...form.register("password") }/>
                            {form.formState.errors.password && (
                                <p className="err-message">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                    </fieldset>

                    <div className="checkbox">
                        <Input type="checkbox" />
                        <label htmlFor="terms">Confirmo que li e concordo com o Contrato do Cliente, os Termos ce Condições e as políticas legais da Medlink.</label>
                    </div>

                    <div className="register">
                        <button type="submit">Cadastrar</button>
                        <span>
                            Já possui cadastro? <Link href="/login" className="register-link">Entrar</Link>
                        </span>
                    </div>
                    
                </form>
            </div>
        </main>
    )
}