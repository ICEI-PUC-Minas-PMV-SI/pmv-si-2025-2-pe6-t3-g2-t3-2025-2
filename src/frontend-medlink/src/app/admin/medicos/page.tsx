'use client';

import Link from 'next/link';
import { RefreshCw, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/services/api';
import './styles.css';

type MedicoResponse = {
  id: string;
  nome: string;
  especialidade: 'OFTALMOLOGIA' | 'CARDIOLOGIA' | 'ORTOPEDIA' | 'PEDIATRIA';
  crm?: string;
  telefone?: string;
};

export default function MedicosListPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['admin-medicos'],
    queryFn: async () => {
      const { data } = await api.get<MedicoResponse[]>('/medlink/admin/medicos');
      return data;
    },
    staleTime: 30_000,
  });

  return (
    <div className="medicos">
      <header className="medicos__header">
        <h1 className="medicos__title">Médicos</h1>

        <div className="medicos__actions">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn"
            aria-live="polite"
          >
            <RefreshCw size={16} className={isFetching ? 'icon-spin' : ''} aria-hidden="true" />
            <span>{isFetching ? 'Atualizando...' : 'Atualizar'}</span>
          </button>

          <Link href="/admin/medicos/novo" className="btn btn--primary">
            <Plus size={16} aria-hidden="true" />
            <span>Novo Médico</span>
          </Link>
        </div>
      </header>

      {isLoading && <p className="medicos__info">Carregando...</p>}
      {isError && <p className="medicos__info medicos__info--error">Erro ao carregar médicos.</p>}

      {data && data.length === 0 && (
        <div className="medicos__empty">
          <p className="medicos__emptytext">Nenhum médico cadastrado.</p>
          <Link href="/admin/medicos/novo" className="btn btn--primary btn--mt">
            Cadastrar primeiro médico
          </Link>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="medicos__tablewrap">
          <table className="medicos__table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Especialidade</th>
                <th>CRM</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {data.map((m) => (
                <tr key={m.id}>
                  <td>{m.nome}</td>
                  <td className="is-muted">{m.especialidade}</td>
                  <td className="is-muted">{m.crm || '—'}</td>
                  <td className="is-muted">{m.telefone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}