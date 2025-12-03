"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "@/app/components/ui/toast";
import { useRegister } from "@/app/services/auth";
import type { NewTaskFormData } from "@/app/validators/tasks-validators";
import { newTaskFormSchema } from "@/app/validators/tasks-validators";

import register_img from "../assets/register_img.png";
import { ArrowHome } from "../components/arrow-home/arrow-home";
import { Input } from "../components/input/input";
import { Logo } from "../components/logo/logo";

import styles from "./page.module.css";

export default function RegisterPage() {
  const form = useForm<NewTaskFormData>({
    resolver: zodResolver(newTaskFormSchema),
    mode: "onTouched",
  });

  const { mutate: registerUser, isPending, isError, error } = useRegister();

  function onSubmit(data: NewTaskFormData) {
    registerUser(data, {
      onSuccess: () => {
        toast.success(
          "Cadastro realizado com sucesso! Faça login para continuar.",
        );
        form.reset();
      },
      onError: (err: unknown) => {
        const axiosErr = err as import("axios").AxiosError | undefined;
        const status = axiosErr?.response?.status;
        const msg =
          ((axiosErr?.response?.data as Record<string, unknown>)?.message as string | undefined) ||
          axiosErr?.response?.data ||
          axiosErr?.message ||
          String(err) ||
          "Não foi possível concluir o cadastro.";

        if (status === 409)
          toast.warning("Este e-mail já está cadastrado. Tente outro.");
        else if (status === 400) toast.info("Verifique os dados informados.");
        else if (status === 500) toast.error("Erro interno no servidor.");
        else toast.error(String(msg));

        console.log("[Register][ERR]", {
          status,
          url: axiosErr?.config?.url,
          method: axiosErr?.config?.method,
          data: axiosErr?.response?.data,
        });
      },
    });
  }

  const nameError = form.formState.errors.name?.message;
  const emailError = form.formState.errors.email?.message;
  const phoneError = form.formState.errors.phone?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <main className={`${styles.register} ${styles.container}`}>
      <header className={styles.register__top}>
        <Link
          href="/"
          className={`${styles.btn} ${styles["btn--ghost"]}`}
          aria-label="Voltar para a página inicial"
        >
          <ArrowHome />
          <span className="sr-only">Início</span>
        </Link>
      </header>

      <section className={styles.register__grid}>
        {/* Visual */}
        <aside className={styles.register__aside}>
          <div className={styles.register__media}>
            <Image
              src={register_img}
              alt="Profissional de saúde"
              className={styles.register__img}
              priority
            />
          </div>
          <div className={styles.register__overlay}>
            <h1 className={styles.register__headline}>
              Crie sua conta e gerencie seus agendamentos com praticidade e
              segurança
            </h1>
            <div className={styles.register__brand}>
              <Logo />
            </div>
          </div>
        </aside>

        {/* Form */}
        <form
          className={`${styles.register__form} ${styles.card}`}
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            const firstMsg =
              errors.name?.message ||
              errors.email?.message ||
              errors.phone?.message ||
              errors.password?.message;
            if (firstMsg) toast.info(firstMsg);
          })}
          noValidate
        >
          <fieldset className={styles["stack-md"]}>
            <legend className={styles.register__legend}>Criar uma conta</legend>

            {isError && (
              <div
                className={`${styles.alert} ${styles["alert--error"]}`}
                role="alert"
              >
                <p>
                  Erro ao criar conta:{" "}
                  {(error as import("axios").AxiosError)?.message ||
                    "Tente novamente"}
                </p>
              </div>
            )}

            <div className={styles["form-field"]}>
              <label htmlFor="name">Nome</label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                disabled={isPending}
                error={nameError as string | undefined}
                {...form.register("name")}
              />
              {nameError && (
                <div id="name-error" className={styles["form-error"]}>
                  {nameError}
                </div>
              )}
            </div>

            <div className={styles["form-field"]}>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="email@email.com"
                disabled={isPending}
                error={emailError as string | undefined}
                {...form.register("email")}
              />
              {emailError && (
                <div id="email-error" className={styles["form-error"]}>
                  {emailError}
                </div>
              )}
            </div>

            <div className={styles["form-field"]}>
              <label htmlFor="phone">Telefone</label>
              <Input
                id="phone"
                type="tel"
                placeholder="(99) 9 9999-9999"
                disabled={isPending}
                error={phoneError as string | undefined}
                {...form.register("phone")}
              />
              {phoneError && (
                <div id="phone-error" className={styles["form-error"]}>
                  {phoneError}
                </div>
              )}
            </div>

            <div className={styles["form-field"]}>
              <label htmlFor="password">Senha</label>
              <Input
                id="password"
                type="password"
                placeholder="Crie uma senha"
                disabled={isPending}
                error={passwordError as string | undefined}
                {...form.register("password")}
              />
              {passwordError && (
                <div id="password-error" className={styles["form-error"]}>
                  {passwordError}
                </div>
              )}
            </div>
          </fieldset>

          <div className={styles.register__terms}>
            <input id="terms" type="checkbox" disabled={isPending} />
            <label htmlFor="terms" className={styles["register__terms-label"]}>
              Confirmo que li e concordo com o Contrato do Cliente, os Termos e
              Condições e as políticas legais da Medlink.
            </label>
          </div>

          <div className={styles.register__actions}>
            <button
              type="submit"
              disabled={isPending}
              className={`${styles.btn} ${styles["btn--primary"]} ${styles["btn--lg"]}`}
              aria-live="polite"
            >
              {isPending ? "Cadastrando..." : "Cadastrar"}
            </button>
            <p className={styles.register__hint}>
              Já possui cadastro?{" "}
              <Link href="/login" className={styles.link}>
                Entrar
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
