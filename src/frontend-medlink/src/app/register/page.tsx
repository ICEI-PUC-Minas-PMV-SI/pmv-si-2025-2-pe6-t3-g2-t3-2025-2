"use client"

import { NewTaskFormData, newTaskFormSchema } from "../validators/tasks-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../services/auth";
import Image from "next/image";
import register_img from "../assets/register_img.png"
import Link from "next/link";
import { ArrowHome } from "../components/arrow-home/arrow-home"
import { Logo } from "../components/logo/logo";
import { useForm } from "react-hook-form";
import { Input } from "../components/input/input";
import "./styles.css"

export default function Register() {
    const form = useForm<NewTaskFormData>({
        resolver: zodResolver(newTaskFormSchema)
    })

    const { mutate: register, isPending, isError, error } = useRegister()

    function onSubmit(data: NewTaskFormData) {
        register(data, {
            onSuccess: () => {
                form.reset()
            }
        })
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
                        {isError && (
                            <div className="erro-banner">
                                <p>Erro ao criar conta: {error?.message || "Tente novamente"}</p>
                            </div>
                        )}
                        <div className="err-form">
                            <label htmlFor="nome">Nome</label>
                            <Input 
                                type="text" 
                                placeholder="Digite seu nome completo" 
                                disabled={isPending}
                                { ...form.register("name") }
                            />
                            {form.formState.errors.name && (
                                <p className="err-message">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="err-form">
                            <label htmlFor="email">Email</label>
                            <Input 
                                type="" 
                                placeholder="email@email.com"
                                disabled={isPending} 
                                { ...form.register("email") }
                            />
                            {form.formState.errors.email && (
                                <p className="err-message">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="err-form">
                            <label htmlFor="phone">Telefone</label>
                            <Input 
                                type="tel" 
                                placeholder="(99) 9 9999-9999" 
                                disabled={isPending}
                                { ...form.register("phone") }
                            />
                            {form.formState.errors.phone && (
                                <p className="err-message">
                                    {form.formState.errors.phone.message}
                                </p>
                            )}
                        </div>
                        <div className="err-form">
                            <label htmlFor="password">Senha</label>
                            <Input 
                                type="password" 
                                placeholder="Crie uma senha"
                                disabled={isPending} 
                                { ...form.register("password") }
                            />
                            {form.formState.errors.password && (
                                <p className="err-message">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                    </fieldset>

                    <div className="checkbox">
                        <Input type="checkbox" disabled={isPending} />
                        <label htmlFor="terms">Confirmo que li e concordo com o Contrato do Cliente, os Termos ce Condições e as políticas legais da Medlink.</label>
                    </div>

                    <div className="register">
                        <button type="submit" disabled={isPending}>
                            {isPending ? "Cadastrando..." : "Cadastrar"}
                        </button>
                        <span>
                            Já possui cadastro? <Link href="/login" className="register-link">Entrar</Link>
                        </span>
                    </div>
                    
                </form>
            </div>
        </main>
    )
}