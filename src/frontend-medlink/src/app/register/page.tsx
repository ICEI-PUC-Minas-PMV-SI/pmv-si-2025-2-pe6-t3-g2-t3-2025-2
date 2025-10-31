'use client';

import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { NewTaskFormData, newTaskFormSchema } from '../validators/tasks-validators';
import { useRegister } from '../services/auth';

import register_img from '../assets/register_img.png';
import { ArrowHome } from '../components/arrow-home/arrow-home';
import { Logo } from '../components/logo/logo';
import { Input } from '../components/input/input';
import { toast } from '../components/ui/toast';

import './styles.css';

export default function Register() {
  const form = useForm<NewTaskFormData>({
    resolver: zodResolver(newTaskFormSchema),
    mode: 'onTouched',
  });

  const { mutate: register, isPending, isError, error } = useRegister();

  function onSubmit(data: NewTaskFormData) {
    register(data, {
      onSuccess: () => {
        toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
        form.reset();
      },
      onError: (err: any) => {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          'Não foi possível concluir o cadastro.';

        if (status === 409) toast.warning('Este e-mail já está cadastrado. Tente outro.');
        else if (status === 400) toast.info('Verifique os dados informados.');
        else if (status === 500) toast.error('Erro interno no servidor.');
        else toast.error(msg);

        console.log('[Register][ERR]', {
          status,
          url: err?.config?.url,
          method: err?.config?.method,
          data: err?.response?.data,
        });
      },
    });
  }

  const nameError = form.formState.errors.name?.message;
  const emailError = form.formState.errors.email?.message;
  const phoneError = form.formState.errors.phone?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <main className="register container">
      <header className="register__top">
        <Link href="/" className="btn btn--ghost" aria-label="Voltar para a página inicial">
          <ArrowHome />
          <span className="sr-only">Início</span>
        </Link>
      </header>

      <section className="register__grid">
        {/* Lado visual */}
        <aside className="register__aside">
          <div className="register__media">
            <Image src={register_img} alt="Profissional de saúde" className="register__img" priority />
          </div>
          <div className="register__overlay">
            <h1 className="register__headline">
              Crie sua conta e gerencie seus agendamentos com praticidade e segurança
            </h1>
            <div className="register__brand">
              <Logo />
            </div>
          </div>
        </aside>

        {/* Formulário */}
        <form
          className="register__form card"
          onSubmit={form.handleSubmit(
            onSubmit,
            (errors) => {
              const firstMsg =
                errors.name?.message ||
                errors.email?.message ||
                errors.phone?.message ||
                errors.password?.message;
              if (firstMsg) toast.info(firstMsg);
            },
          )}
          noValidate
        >
          <fieldset className="stack-md">
            <legend className="register__legend">Criar uma conta</legend>

            {isError && (
              <div className="alert alert--error" role="alert">
                <p>Erro ao criar conta: {error?.message || 'Tente novamente'}</p>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="name">Nome</label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                disabled={isPending}
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'name-error' : undefined}
                {...form.register('name')}
              />
              {nameError && (
                <div id="name-error" className="form-error">
                  {nameError}
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="email@email.com"
                disabled={isPending}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                {...form.register('email')}
              />
              {emailError && (
                <div id="email-error" className="form-error">
                  {emailError}
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="phone">Telefone</label>
              <Input
                id="phone"
                type="tel"
                placeholder="(99) 9 9999-9999"
                disabled={isPending}
                aria-invalid={!!phoneError}
                aria-describedby={phoneError ? 'phone-error' : undefined}
                {...form.register('phone')}
              />
              {phoneError && (
                <div id="phone-error" className="form-error">
                  {phoneError}
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="password">Senha</label>
              <Input
                id="password"
                type="password"
                placeholder="Crie uma senha"
                disabled={isPending}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'password-error' : undefined}
                {...form.register('password')}
              />
              {passwordError && (
                <div id="password-error" className="form-error">
                  {passwordError}
                </div>
              )}
            </div>
          </fieldset>

          <div className="register__terms">
            <Input id="terms" type="checkbox" disabled={isPending} />
            <label htmlFor="terms">
              Confirmo que li e concordo com o Contrato do Cliente, os Termos e Condições e as políticas legais da Medlink.
            </label>
          </div>

          <div className="register__actions">
            <button type="submit" disabled={isPending} className="btn btn--primary btn--lg" aria-live="polite">
              {isPending ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            <p className="register__hint">
              Já possui cadastro?{' '}
              <Link href="/login" className="link">
                Entrar
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}