'use client';

import { useState, useMemo } from 'react';
import './styles.css'; // importa os estilos desta página

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
  const [filters, setFilters] = useState<ConsultasAdminFilters>({ status: '' });

  const [q, setQ] = useState(filters.q ?? '');
  const [from, setFrom] = useState(filters.from ?? '');
  const [to, setTo] = useState(filters.to ?? '');
  const [status, setStatus] = useState<StatusFilter>(filters.status ?? '');

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error } = useAdminConsultas(filters);
  const cancelar = useCancelarConsultaAdmin();

  const { data: medicosMap } = useAdminMedicosMap();
  const { data: pacientesMap } = useAdminPacientesMap();
  const medicoLabel = (id: string) => medicosMap?.get(id)?.nome ?? id;
  const pacienteLabel = (id: string) => pacientesMap?.get(id)?.nome ?? id;

  const consultas: ConsultaAdminDTO[] = data ?? [];

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
    <div className="admin-consultas">
      <h1 className="admin-consultas__title">Consultas</h1>

      {/* Filtros */}
      <section className="admin-consultas__filters">
        <div className="admin-consultas__field admin-consultas__field--span2">
          <label htmlFor="buscar" className="ac-label">Buscar (livre)</label>
          <input
            id="buscar"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="ac-input"
            placeholder="Nome, email, observação..."
          />
        </div>
        <div className="admin-consultas__field">
          <label htmlFor="de" className="ac-label">De</label>
          <input
            id="de"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="ac-input"
          />
        </div>
        <div className="admin-consultas__field">
          <label htmlFor="ate" className="ac-label">Até</label>
          <input
            id="ate"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="ac-input"
          />
        </div>
        <div className="admin-consultas__field">
          <label htmlFor="status" className="ac-label">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="ac-input"
          >
            <option value="">Todos</option>
            <option value="CONFIRMADO">Agendada</option>
            <option value="CANCELADO">Cancelada</option>
            <option value="CONCLUIDO">Finalizada</option>
          </select>
        </div>

        <div className="admin-consultas__actions">
          <button type="button" onClick={applyFilters} className="ac-button ac-button--primary">
            Aplicar filtros
          </button>
          <button type="button" onClick={clearFilters} className="ac-button">
            Limpar
          </button>
        </div>
      </section>

      {/* Tabela */}
      <div className="admin-consultas__tablewrap">
        <table className="ac-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Observação</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="ac-cell" colSpan={6}>Carregando...</td>
              </tr>
            )}
            {isError && (
              <tr>
                <td className="ac-cell ac-cell--error" colSpan={6}>
                  Erro: {(error as Error)?.message ?? 'Falha ao carregar'}
                </td>
              </tr>
            )}
            {!isLoading && (pageItems ?? []).length === 0 && (
              <tr>
                <td className="ac-cell" colSpan={6}>Nenhuma consulta encontrada.</td>
              </tr>
            )}

            {(pageItems ?? []).map((c) => (
              <tr key={c.id}>
                <td className="ac-cell">{formatDateTime(c.dataHora)}</td>
                <td className="ac-cell">
                  <div className="ac-strong">{pacienteLabel(c.pacienteId)}</div>
                </td>
                <td className="ac-cell">
                  <div className="ac-strong">{medicoLabel(c.medicoId)}</div>
                  <div className="ac-subtle">{/* especialidade opcional */}</div>
                </td>
                <td className="ac-cell">{c.observacao ?? '-'}</td>
                <td className="ac-cell">
                  <span
                    className={[
                      'ac-chip',
                      c.status === 'CONFIRMADO' ? 'ac-chip--ok' :
                      c.status === 'CANCELADO' ? 'ac-chip--danger' :
                      'ac-chip--muted',
                    ].join(' ')}
                  >
                    {c.status ? statusLabel[c.status] : '-'}
                  </span>
                </td>
                <td className="ac-cell">
                  <button
                    type="button"
                    aria-label="Cancelar consulta"
                    className="ac-button ac-button--ghost"
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
      <div className="admin-consultas__pagination">
        <div className="ac-muted">Página {page + 1} de {Math.max(totalPages, 1)}</div>
        <div className="admin-consultas__pager">
          <button
            type="button"
            className="ac-button"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={!canPrev}
          >
            Anterior
          </button>
          <button
            type="button"
            className="ac-button"
            onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
            disabled={!canNext}
          >
            Próxima
          </button>
          <select
            className="ac-input ac-input--sm"
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