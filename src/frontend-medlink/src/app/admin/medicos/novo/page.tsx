'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateMedico } from '@/hooks/useCreateMedico';
import { toast } from '@/app/components/ui/toast';
import './styles.css';

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
    <div className="novo-medico">
      <header className="novo-medico__header">
        <h1 className="novo-medico__title">Cadastrar Médico</h1>
        <Link href="/admin/medicos" className="btn">
          Voltar
        </Link>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="novo-medico__form">
        <div className="form-field">
          <label htmlFor="nome" className="form-label">Nome</label>
          <input
            id="nome"
            {...register('nome')}
            placeholder="Nome completo"
            className="form-input"
            disabled={isPending}
          />
          {errors.nome && <small className="form-error">{errors.nome.message}</small>}
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="medico@exemplo.com"
              className="form-input"
              disabled={isPending}
            />
            {errors.email && <small className="form-error">{errors.email.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="form-input"
              disabled={isPending}
            />
            {errors.password && <small className="form-error">{errors.password.message}</small>}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="crm" className="form-label">CRM</label>
            <input
              id="crm"
              {...register('crm')}
              placeholder="CRM"
              className="form-input"
              disabled={isPending}
            />
            {errors.crm && <small className="form-error">{errors.crm.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="telefone" className="form-label">Telefone</label>
            <input
              id="telefone"
              {...register('telefone')}
              placeholder="(99) 99999-9999"
              className="form-input"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="endereco" className="form-label">Endereço</label>
            <input
              id="endereco"
              {...register('endereco')}
              placeholder="Rua, nº, bairro"
              className="form-input"
              disabled={isPending}
            />
          </div>

          <div className="form-field">
            <label htmlFor="especialidade" className="form-label">Especialidade</label>
            <select
              id="especialidade"
              {...register('especialidade')}
              className="form-input"
              disabled={isPending}
            >
              {EspecialidadeEnum.options.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            {errors.especialidade && <small className="form-error">{errors.especialidade.message}</small>}
          </div>
        </div>

        <button type="submit" className="btn btn--primary" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}