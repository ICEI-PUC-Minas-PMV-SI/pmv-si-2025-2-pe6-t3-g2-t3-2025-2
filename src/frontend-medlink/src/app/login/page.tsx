'use client';

import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ArrowHome } from '@/app/components/arrow-home/arrow-home';
import { Logo } from '@/app/components/logo/logo';
import { Input } from '../components/input/input';
import register_img from '../assets/register_img.png';

import type { NewTaskFormDataLogin } from '@/app/validators/tasks-validators';
import { newTaskFormSchemaLogin } from '@/app/validators/tasks-validators';
import { useLogin } from '@/app/services/auth';
import { toast } from '@/app/components/ui/toast';

import styles from './page.module.css';

export default function LoginPage() {
  const form = useForm<NewTaskFormDataLogin>({
    resolver: zodResolver(newTaskFormSchemaLogin),
    mode: 'onTouched',
  });

  const { mutate: login, isPending } = useLogin();

  function onSubmit(data: NewTaskFormDataLogin) {
    login(data, {
      onSuccess: () => {
        toast.success('Login realizado com sucesso!');
      },
      onError: (err: unknown) => {
        const status = (err as import('axios').AxiosError)?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          'Não foi possível fazer login. Verifique suas credenciais.';

        if (status === 401) {
          toast.warning('Credenciais inválidas. Tente novamente.');
        } else if (status === 403) {
          toast.warning('Acesso negado. Verifique seu perfil ou permissões.');
        } else {
          toast.error(msg);
        }

        const axiosErr = err as import('axios').AxiosError | undefined;
        console.log('[Login][ERR]', {
          status,
          url: axiosErr?.config?.url,
          method: axiosErr?.config?.method,
          data: axiosErr?.response?.data,
        });
      },
    });
  }

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <main className={`${styles.login} ${styles.container}`}>
      <header className={styles.login__top}>
        <Link href="/" className={`${styles.btn} ${styles['btn--ghost']}`} aria-label="Voltar para a página inicial">
          <ArrowHome />
          <span className="sr-only">Início</span>
        </Link>
      </header>

      <section className={styles.login__grid}>
        <aside className={styles.login__aside}>
          <div className={styles.login__media}>
            <Image src={register_img} alt="Profissional de saúde" className={styles.login__img} priority />
          </div>
          <div className={styles.login__overlay}>
            <h1 className={styles.login__headline}>
              Bem-vindo(a)! Conte com uma clínica que cuida da sua saúde com praticidade e atenção
            </h1>
            <div className={styles.login__brand}>
              <Logo />
            </div>
          </div>
        </aside>

        <form className={`${styles.login__form} ${styles.card}`} onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <fieldset className={styles['stack-md']}>
            <legend className={styles.login__legend}>Login</legend>

            <div className={styles['form-field']}>
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
                <div id="email-error" className={styles['form-error']}>
                  {emailError}
                </div>
              )}
            </div>

            <div className={styles['form-field']}>
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
                <div id="password-error" className={styles['form-error']}>
                  {passwordError}
                </div>
              )}
            </div>
          </fieldset>

          <div className={styles.login__actions}>
            <button type="submit" disabled={isPending} className={`${styles.btn} ${styles['btn--primary']} ${styles['btn--lg']}`} aria-live="polite">
              {isPending ? "Entrando..." : "Entrar"}
            </button>
            <p className={styles.login__hint}>
              Não possui cadastro?{" "}
              <Link href="/register" className={styles.link}>
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}