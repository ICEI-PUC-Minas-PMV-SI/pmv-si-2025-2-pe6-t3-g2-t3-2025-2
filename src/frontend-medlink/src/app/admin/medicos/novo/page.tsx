'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateMedico } from '@/hooks/useCreateMedico';
import { toast } from '@/app/components/ui/toast';
import styles from './page.module.css';

const EspecialidadeEnum = z.enum(['OFTALMOLOGIA', 'CARDIOLOGIA', 'ORTOPEDIA', 'PEDIATRIA']);

const schema = z.object({
  email: z
    .string()
    .regex(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/, { message: 'E-mail inválido' }),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  nome: z.string().min(3, 'Informe o nome completo'),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  especialidade: EspecialidadeEnum,
  crm: z.string().min(3, 'CRM inválido'),
});

type FormData = z.infer<typeof schema>;

export default function NovoMedicoPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { especialidade: 'OFTALMOLOGIA' },
  });
  const { mutate, isPending } = useCreateMedico();

  const onSubmit = (values: FormData) => {
    mutate({
      email: values.email,
      password: values.password,
      nome: values.nome,
      endereco: values.endereco ?? '',
      telefone: values.telefone ?? '',
      especialidade: values.especialidade,
      crm: values.crm,
    }, {
      onSuccess: () => {
        toast.success('Médico cadastrado com sucesso!');
        router.push('/admin/medicos');
      },
      onError: (err: any) => {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.response?.data;
        if (status === 409) toast.warning('Este e-mail já está cadastrado.');
        else if (status === 400) toast.info(msg || 'Dados inválidos. Verifique os campos.');
        else if (status === 403) toast.error('Você não tem permissão para cadastrar médicos.');
        else toast.error('Erro ao cadastrar médico. Tente novamente.');
        console.log('[CadastrarMedico][ERR]', {
          status,
          url: err?.config?.url,
          method: err?.config?.method,
          payload: err?.config?.data,
          data: err?.response?.data,
        });
      },
    });
  };

  return (
    <div className={styles['novo-medico']}>
      <div className="container">
        <header className={styles['novo-medico__header']}>
          <h1 className={styles['novo-medico__title']}>Cadastrar Médico</h1>
          <Link href="/admin/medicos" className={`${styles.btn} ${styles['btn--secondary']}`}>
            Voltar
          </Link>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className={styles['novo-medico__form']} noValidate>
          <div className={styles['form-field']}>
            <label htmlFor="nome" className={styles['form-label']}>Nome</label>
            <input
              id="nome"
              {...register('nome')}
              placeholder="Nome completo"
              className={styles['form-input']}
              disabled={isPending}
              aria-invalid={!!errors.nome}
              aria-describedby={errors.nome ? "nome-error" : undefined}
            />
            {errors.nome && (
              <small id="nome-error" className={styles['form-error']}>
                {errors.nome.message}
              </small>
            )}
          </div>

          <div className={styles['form-grid']}>
            <div className={styles['form-field']}>
              <label htmlFor="email" className={styles['form-label']}>Email</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="medico@exemplo.com"
                className={styles['form-input']}
                disabled={isPending}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <small id="email-error" className={styles['form-error']}>
                  {errors.email.message}
                </small>
              )}
            </div>

            <div className={styles['form-field']}>
              <label htmlFor="password" className={styles['form-label']}>Senha</label>
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className={styles['form-input']}
                disabled={isPending}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <small id="password-error" className={styles['form-error']}>
                  {errors.password.message}
                </small>
              )}
            </div>
          </div>

          <div className={styles['form-grid']}>
            <div className={styles['form-field']}>
              <label htmlFor="crm" className={styles['form-label']}>CRM</label>
              <input
                id="crm"
                {...register('crm')}
                placeholder="CRM"
                className={styles['form-input']}
                disabled={isPending}
                aria-invalid={!!errors.crm}
                aria-describedby={errors.crm ? "crm-error" : undefined}
              />
              {errors.crm && (
                <small id="crm-error" className={styles['form-error']}>
                  {errors.crm.message}
                </small>
              )}
            </div>

            <div className={styles['form-field']}>
              <label htmlFor="telefone" className={styles['form-label']}>Telefone</label>
              <input
                id="telefone"
                {...register('telefone')}
                placeholder="(99) 99999-9999"
                className={styles['form-input']}
                disabled={isPending}
              />
            </div>
          </div>

          <div className={styles['form-grid']}>
            <div className={styles['form-field']}>
              <label htmlFor="endereco" className={styles['form-label']}>Endereço</label>
              <input
                id="endereco"
                {...register('endereco')}
                placeholder="Rua, nº, bairro"
                className={styles['form-input']}
                disabled={isPending}
              />
            </div>

            <div className={styles['form-field']}>
              <label htmlFor="especialidade" className={styles['form-label']}>Especialidade</label>
              <select
                id="especialidade"
                {...register('especialidade')}
                className={styles['form-input']}
                disabled={isPending}
                aria-invalid={!!errors.especialidade}
                aria-describedby={errors.especialidade ? "especialidade-error" : undefined}
              >
                {EspecialidadeEnum.options.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              {errors.especialidade && (
                <small id="especialidade-error" className={styles['form-error']}>
                  {errors.especialidade.message}
                </small>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className={`${styles.btn} ${styles['btn--primary']}`} 
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
}