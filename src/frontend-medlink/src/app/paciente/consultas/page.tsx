'use client';

import Link from 'next/link';
import { Trash2, RefreshCw, Plus } from 'lucide-react';
import { useConsultasPaciente } from '@/features/paciente/useConsultasPaciente';
import { useCancelarConsulta } from '@/features/paciente/useCancelarConsulta';
import { toast } from '@/app/components/ui/toast';
import { formatDateTime, isLessThanHourFromNow } from '@/lib/datetime';
import './styles.css';
import { ArrowHome } from '@/app/components/arrow-home/arrow-home';

export default function ConsultasPacientePage() {
  const { data: consultas, isLoading, isError, refetch, isFetching } = useConsultasPaciente();
  const { mutate: cancelar, isPending: cancelando } = useCancelarConsulta();

  const handleCancelar = (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;
    cancelar(id, {
      onSuccess: (msg: any) => {
        toast.success(typeof msg === 'string' ? msg : 'Consulta cancelada.');
      },
      onError: (err: any) => {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data ||
          'Não foi possível cancelar a consulta.';

        if (status === 404) toast.error('Consulta não encontrada.');
        else if (status === 403)
          toast.warning('Você não tem permissão para cancelar esta consulta.');
        else if (status === 400)
          toast.info('Cancelamento indisponível a menos de 1 hora do início.');
        else if (status === 409)
          toast.info('Esta consulta não pode ser cancelada no estado atual.');
        else toast.error(msg);

        console.log('[CancelarConsulta][ERR]', {
          status,
          url: err?.config?.url,
          method: err?.config?.method,
          data: err?.response?.data,
        });
      },
    });
  };

  return (
    <div className="consultas">
      <header className="consultas__header">
        <h1 className="consultas__title">Minhas Consultas</h1>
        <div className="consultas__actions">
          <Link href="/paciente/consultas/nova" className="btn btn--primary">
            <Plus size={16} aria-hidden="true" />
            <span>Nova</span>
          </Link>
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
          <Link href="/" className="btn" aria-live="polite">
            <ArrowHome />
          </Link>
        </div>
      </header>

      {isLoading && <p className="consultas__info">Carregando...</p>}
      {isError && <p className="consultas__info consultas__info--error">Erro ao carregar suas consultas.</p>}

      {!isLoading && (consultas?.length ?? 0) === 0 && (
        <p className="consultas__info">Nenhuma consulta encontrada.</p>
      )}

      <ul className="consultas__list">
        {consultas
          // Remova esta linha se o backend já filtrar CANCELADO
          ?.filter((c) => c.status !== 'CANCELADO')
          .map((c) => {
            const bloquearCancelamento = isLessThanHourFromNow(c.dataHora);
            const podeCancelar = c.status === 'CONFIRMADO' && !bloquearCancelamento;

            return (
              <li key={c.id} className="consulta">
                <div className="consulta__left">
                  <div className="consulta__medico">
                    {c.medicoNome}{' '}
                    {c.especialidade && <span className="consulta__esp">({c.especialidade})</span>}
                  </div>

                  {/* Badge de status solicitado */}
                  {c.status !== 'CONFIRMADO' && (
                    <output
                      className={[
                        'badge',
                        c.status === 'CANCELADO' ? 'badge--danger' : 'badge--success',
                        'consulta__status',
                      ].join(' ')}
                    >
                      {c.status === 'CANCELADO' ? 'Cancelada' : 'Concluída'}
                    </output>
                  )}

                  <div className="consulta__datetime">{formatDateTime(c.dataHora)}</div>
                  {c.observacoes && <div className="consulta__obs">Obs.: {c.observacoes}</div>}
                </div>

                <div className="consulta__right">
                  <button
                    type="button"
                    onClick={() => handleCancelar(c.id)}
                    disabled={cancelando || !podeCancelar}
                    title={
                      c.status !== 'CONFIRMADO'
                        ? 'Esta consulta não pode ser cancelada.'
                        : bloquearCancelamento
                        ? 'Não é possível cancelar a menos de 1h do início'
                        : 'Cancelar consulta'
                    }
                    className={[
                      'btn',
                      'btn--danger',
                      'btn--sm',
                      !podeCancelar ? 'btn--disabled' : '',
                    ].join(' ')}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    <span>
                      {cancelando
                        ? 'Cancelando...'
                        : !podeCancelar
                        ? 'Indisponível'
                        : 'Cancelar'}
                    </span>
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}