'use client';

import { useState, useMemo } from 'react';
import {
  useAdminConsultas,
  type ConsultasAdminFilters,
  type ConsultaAdminDTO,
} from '@/features/admin/useAdminConsultas';
import { useCancelarConsultaAdmin } from '@/features/admin/useCancelarConsulta';
import { useAdminMedicosMap, useAdminPacientesMap } from '@/features/admin/useMaps';

type StatusFilter = '' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';

function pad(n: number) { return n.toString().padStart(2, '0'); }
function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    const dd = pad(d.getDate());
    const mm = pad(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  } catch {
    return iso;
  }
}

const statusLabel: Record<'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO', string> = {
  CONFIRMADO: 'Agendada',
  CANCELADO: 'Cancelada',
  CONCLUIDO: 'Finalizada',
};

export default function AdminConsultasPage() {
  // Filtros que o backend aceita (sem paginação no servidor)
  const [filters, setFilters] = useState<ConsultasAdminFilters>({
    status: '', // listar todos
  });

  // Estados locais de UI dos filtros
  const [q, setQ] = useState(filters.q ?? '');
  const [from, setFrom] = useState(filters.from ?? '');
  const [to, setTo] = useState(filters.to ?? '');
  const [status, setStatus] = useState<StatusFilter>(filters.status ?? '');

  // Paginação local
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Dados
  const { data, isLoading, isError, error } = useAdminConsultas(filters);
  const cancelar = useCancelarConsultaAdmin();

  // Mapas de nomes (opcional, já funciona com fallback ao ID)
  const { data: medicosMap } = useAdminMedicosMap();
  const { data: pacientesMap } = useAdminPacientesMap();
  const medicoLabel = (id: string) => medicosMap?.get(id)?.nome ?? id;
  const pacienteLabel = (id: string) => pacientesMap?.get(id)?.nome ?? id;

  // A API retorna LISTA simples
  const consultas: ConsultaAdminDTO[] = data ?? [];

  // Paginação local derivada
  const totalPages = Math.max(Math.ceil(consultas.length / pageSize), 1);
  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  const pageItems = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return (consultas ?? []).slice(start, end);
  }, [consultas, page, pageSize]);

  function applyFilters() {
    setFilters({
      q: q || undefined,
      from: from || undefined,
      to: to || undefined,
      status: status || undefined,
    });
    // Resetar paginação local
    setPage(0);
  }

  function clearFilters() {
    setQ('');
    setFrom('');
    setTo('');
    setStatus('');
    setFilters({});
    setPage(0);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Consultas</h1>

      {/* Filtros */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ gridColumn: 'span 2 / span 2' }}>
          <label htmlFor='buscar' className="block text-sm font-medium mb-1">Buscar (livre)</label>
          <input id="buscar" value={q} onChange={(e) => setQ(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label htmlFor='de' className="block text-sm font-medium mb-1">De</label>
          <input id="de" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label htmlFor='ate' className="block text-sm font-medium mb-1">Até</label>
          <input id="ate" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label htmlFor='status' className="block text-sm font-medium mb-1">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} className="w-full border rounded px-3 py-2">
            <option value="">Todos</option>
            <option value="CONFIRMADO">Agendada</option>
            <option value="CANCELADO">Cancelada</option>
            <option value="CONCLUIDO">Finalizada</option>
          </select>
        </div>
        <div style={{ gridColumn: 'span 5 / span 5', display: 'flex', gap: 8 }}>
          <button type='button' onClick={applyFilters} className="px-4 py-2 rounded bg-blue-600 text-white">Aplicar filtros</button>
          <button type='button' onClick={clearFilters} className="px-4 py-2 rounded border">Limpar</button>
        </div>
      </div>

      {/* Tabela */}
      <div style={{ overflow: 'auto', borderRadius: 8, border: '1px solid #e5e7eb', marginTop: 16 }}>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Data/Hora</th>
              <th className="p-3">Paciente</th>
              <th className="p-3">Médico</th>
              <th className="p-3">Observação</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={6}>Carregando...</td></tr>}
            {isError && <tr><td className="p-3 text-red-600" colSpan={6}>Erro: {(error as Error)?.message ?? 'Falha ao carregar'}</td></tr>}
            {!isLoading && (pageItems ?? []).length === 0 && <tr><td className="p-3" colSpan={6}>Nenhuma consulta encontrada.</td></tr>}

            {(pageItems ?? []).map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{formatDateTime(c.dataHora)}</td>
                <td className="p-3">
                  <div className="font-medium">{pacienteLabel(c.pacienteId)}</div>
                  {/* <div className="text-xs text-gray-500">{pacientesMap?.get(c.pacienteId)?.email ?? ''}</div> */}
                </td>
                <td className="p-3">
                  <div className="font-medium">{medicoLabel(c.medicoId)}</div>
                  <div className="text-xs text-gray-500">{medicosMap?.get(c.medicoId)?.especialidade ?? ''}</div>
                </td>
                <td className="p-3">{c.observacao ?? '-'}</td>
                <td className="p-3">
                  <span
                    className={[
                      'px-2 py-1 rounded text-xs',
                      c.status === 'CONFIRMADO' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'CANCELADO' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800',
                    ].join(' ')}
                  >
                    {c.status ? statusLabel[c.status] : '-'}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    type='button'
                    aria-label="Cancelar consulta"
                    className="px-2 py-1 rounded border hover:bg-gray-50"
                    disabled={c.status !== 'CONFIRMADO' || cancelar.isPending}
                    onClick={() => {
                      if (confirm(`Cancelar a consulta #${c.id}?`)) {
                        cancelar.mutate(c.id);
                      }
                    }}
                  >
                    {cancelar.isPending ? 'Cancelando...' : 'Cancelar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação local */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <div className="text-sm text-gray-600">Página {page + 1} de {Math.max(totalPages, 1)}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type='button'
            className="px-3 py-2 rounded border"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={!canPrev}
          >
            Anterior
          </button>
          <button
            type='button'
            className="px-3 py-2 rounded border"
            onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
            disabled={!canNext}
          >
            Próxima
          </button>
          <select
            className="px-2 py-2 rounded border"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
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