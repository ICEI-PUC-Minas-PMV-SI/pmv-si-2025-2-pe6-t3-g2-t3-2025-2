'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/services/api';
import { useMemo, useState } from 'react';
import './styles.css';

type PacienteResponse = {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  endereco?: string | null;
};

export default function PacientesListPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-pacientes'],
    queryFn: async () => {
      const { data } = await api.get<PacienteResponse[]>('/medlink/admin/pacientes');
      return data;
    },
    staleTime: 30_000,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (p) =>
        p.nome?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        (p.telefone || '').toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <div className="pacientes">
      <header className="pacientes__header">
        <h1 className="pacientes__title">Pacientes</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, email ou telefone"
          className="pacientes__search"
          aria-label="Buscar pacientes"
        />
      </header>

      {isLoading && <p className="pacientes__info">Carregando...</p>}
      {isError && <p className="pacientes__info pacientes__info--error">Erro ao carregar pacientes.</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="pacientes__info">Nenhum paciente encontrado.</p>
      )}

      {filtered.length > 0 && (
        <div className="pacientes__tablewrap">
          <table className="pacientes__table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.email}</td>
                  <td>{p.telefone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}