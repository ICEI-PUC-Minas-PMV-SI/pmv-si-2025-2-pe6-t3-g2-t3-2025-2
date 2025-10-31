"use client";

import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ArrowHome } from "../components/arrow-home/arrow-home";
import { Logo } from "../components/logo/logo";
import { Input } from "../components/input/input";
import register_img from "../assets/register_img.png";

import { NewTaskFormDataLogin, newTaskFormSchemaLogin } from "../validators/tasks-validators";
import { useLogin } from "../services/auth";
import { toast } from "../components/ui/toast";

import "./styles.css";

export default function Login() {
  const form = useForm<NewTaskFormDataLogin>({
    resolver: zodResolver(newTaskFormSchemaLogin),
    mode: "onTouched",
  });

  const { mutate: login, isPending } = useLogin();

  function onSubmit(data: NewTaskFormDataLogin) {
    login(data, {
      onSuccess: () => {
        toast.success("Login realizado com sucesso!");
      },
      onError: (err: any) => {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Não foi possível fazer login. Verifique suas credenciais.";

        if (status === 401) {
          toast.warning("Credenciais inválidas. Tente novamente.");
        } else if (status === 403) {
          toast.warning("Acesso negado. Verifique seu perfil ou permissões.");
        } else {
          toast.error(msg);
        }

        console.log("[Login][ERR]", {
          status,
          url: err?.config?.url,
          method: err?.config?.method,
          data: err?.response?.data,
        });
      },
    });
  }

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <main className="login container">
      <header className="login__top">
        <Link href="/" className="btn btn--ghost" aria-label="Voltar para a página inicial">
          <ArrowHome />
          <span className="sr-only">Início</span>
        </Link>
      </header>

      <section className="login__grid">
        <aside className="login__aside">
          <div className="login__media">
            <Image src={register_img} alt="Profissional de saúde" className="login__img" priority />
          </div>
          <div className="login__overlay">
            <h1 className="login__headline">
              Bem-vindo(a)! Conte com uma clínica que cuida da sua saúde com praticidade e atenção
            </h1>
            <div className="login__brand">
              <Logo />
            </div>
          </div>
        </aside>

        <form className="login__form card" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <fieldset className="stack-md">
            <legend className="login__legend">Login</legend>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="email@email.com"
                disabled={isPending}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
                {...form.register("email")}
              />
              {emailError && (
                <div id="email-error" className="form-error">
                  {emailError}
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="password">Senha</label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                disabled={isPending}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
                {...form.register("password")}
              />
              {passwordError && (
                <div id="password-error" className="form-error">
                  {passwordError}
                </div>
              )}
            </div>
          </fieldset>

          <div className="login__actions">
            <button type="submit" disabled={isPending} className="btn btn--primary btn--lg" aria-live="polite">
              {isPending ? "Entrando..." : "Entrar"}
            </button>
            <p className="login__hint">
              Não possui cadastro?{" "}
              <Link href="/register" className="link">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}