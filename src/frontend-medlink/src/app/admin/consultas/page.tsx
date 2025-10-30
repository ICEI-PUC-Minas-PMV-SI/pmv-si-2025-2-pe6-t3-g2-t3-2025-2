'use client';

import { useState } from 'react';
import { useAdminConsultas, type ConsultasAdminFilters } from '@/hooks/useAdminConsultas';
import { useCancelarConsultaAdmin } from '@/hooks/useCancelarConsultaAdmin';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

type StatusFilter = '' | 'AGENDADA' | 'CANCELADA' | 'FINALIZADA';

function formatDateTime(iso: string) {
  try {
    return format(new Date(iso), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch {
    return iso;
  }
}

export default function AdminConsultasPage() {
  const [filters, setFilters] = useState<ConsultasAdminFilters>({
    page: 0,
    size: 10,
    status: 'AGENDADA',
  });

  const { data, isLoading, isError, error } = useAdminConsultas(filters);
  const cancelar = useCancelarConsultaAdmin();

  const consultas = data?.content ?? [];
  const page = data?.number ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  const [q, setQ] = useState(filters.q ?? '');
  const [from, setFrom] = useState(filters.from ?? '');
  const [to, setTo] = useState(filters.to ?? '');
  const [status, setStatus] = useState<StatusFilter>('');

  const applyFilters = () =>
    setFilters((prev) => ({
      ...prev,
      q: q || undefined,
      from: from || undefined,
      to: to || undefined,
      status: (status as any) || undefined,
      page: 0,
    }));

  const clearFilters = () => {
    setQ('');
    setFrom('');
    setTo('');
    setStatus('');
    setFilters({ page: 0, size: filters.size ?? 10 });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Consultas agendadas</h1>

      <div className="grid gap-3 md:grid-cols-5 bg-white p-4 rounded border">
        <div className="md:col-span-2">
          <label htmlFor='buscar' className="block text-sm font-medium mb-1">Buscar (paciente/médico)</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nome do paciente ou do médico"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor='de' className="block text-sm font-medium mb-1">De</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor='ate' className="block text-sm font-medium mb-1">Até</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor='status' className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="AGENDADA">Agendada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="FINALIZADA">Finalizada</option>
          </select>
        </div>
        <div className="md:col-span-5 flex gap-2">
          <button onClick={applyFilters} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" type='button'>
            Aplicar filtros
          </button>
          <button onClick={clearFilters} className="px-4 py-2 rounded border hover:bg-gray-50" type='button'>
            Limpar
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Data/Hora</th>
              <th className="p-3">Paciente</th>
              <th className="p-3">Médico</th>
              <th className="p-3">Especialidade</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td className="p-3" colSpan={6}>Carregando...</td></tr>
            )}
            {isError && (
              <tr><td className="p-3 text-red-600" colSpan={6}>
                Erro: {(error as Error)?.message ?? 'Falha ao carregar'}
              </td></tr>
            )}
            {!isLoading && consultas.length === 0 && (
              <tr><td className="p-3" colSpan={6}>Nenhuma consulta encontrada.</td></tr>
            )}
            {consultas.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{formatDateTime(c.dataHora)}</td>
                <td className="p-3">
                  <div className="font-medium">{c.pacienteNome}</div>
                  {c.pacienteEmail && <div className="text-xs text-gray-500">{c.pacienteEmail}</div>}
                </td>
                <td className="p-3">{c.medicoNome}</td>
                <td className="p-3">{c.especialidade ?? '-'}</td>
                <td className="p-3">
                  <span className={[
                    'px-2 py-1 rounded text-xs',
                    c.status === 'AGENDADA' ? 'bg-emerald-100 text-emerald-800' :
                    c.status === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800',
                  ].join(' ')}>
                    {c.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                        type='button'
                      aria-label="Cancelar consulta"
                      className="px-2 py-1 rounded border hover:bg-gray-50"
                      disabled={c.status !== 'AGENDADA' || cancelar.isPending}
                      onClick={() => {
                        if (confirm(`Cancelar a consulta #${c.id}?`)) {
                          cancelar.mutate(c.id);
                        }
                      }}
                    >
                      Cancelar
                    </button>
                    {/* TODO: botão Finalizar/Detalhes se necessário */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Página {page + 1} de {Math.max(totalPages, 1)}
        </div>
        <div className="flex items-center gap-2">
          <button
            type='button'
            aria-label="Página anterior"
            className="px-3 py-2 rounded border hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 0) - 1 }))}
            disabled={!canPrev}
          >
            Anterior
          </button>
          <button
            type='button'
            aria-label="Próxima página"
            className="px-3 py-2 rounded border hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 0) + 1 }))}
            disabled={!canNext}
          >
            Próxima
          </button>
          <select
            aria-label="Itens por página"
            className="px-2 py-2 rounded border"
            value={filters.size ?? 10}
            onChange={(e) => setFilters((f) => ({ ...f, page: 0, size: Number(e.target.value) }))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>
    </div>
  );
}