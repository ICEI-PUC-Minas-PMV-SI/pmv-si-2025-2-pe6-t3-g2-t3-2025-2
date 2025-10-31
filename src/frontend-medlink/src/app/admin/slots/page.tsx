'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/services/api';
import { useCreateSlots } from '@/hooks/useCreateSlots';
import { useAdminSlots } from '@/hooks/useAdminSlots';
import { useCancelarSlot } from '@/hooks/useCancelarSlot';
import { toast } from '@/app/components/ui/toast';
import { formatTime } from '@/lib/datetime';
import { Trash2, RefreshCw, Calendar } from 'lucide-react';
import { useState } from 'react';
import './styles.css';

const schema = z.object({
  medicoId: z.string().min(1, 'Selecione um médico'),
  data: z.string().min(1, 'Informe a data'),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:mm'),
  horaFim: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:mm'),
  intervaloMinutos: z.number().min(15, 'Mínimo 15 minutos').max(120, 'Máximo 120 minutos'),
});

type FormData = z.infer<typeof schema>;

type MedicoResponse = {
  id: string;
  nome: string;
  especialidade: string;
};

export default function AdminSlotsPage() {
  const [filtroMedicoId, setFiltroMedicoId] = useState<string>('');
  const [filtroData, setFiltroData] = useState<string>('');

  const { data: medicos, isLoading: medicosLoading } = useQuery({
    queryKey: ['admin-medicos'],
    queryFn: async () => {
      const { data } = await api.get<MedicoResponse[]>('/medlink/admin/medicos');
      return data;
    },
    staleTime: 30_000,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { intervaloMinutos: 30 },
  });

  const { mutate: criarSlots, isPending: criando } = useCreateSlots();
  const { mutate: cancelarSlot, isPending: cancelando } = useCancelarSlot();

  const medicoIdForm = watch('medicoId');
  const dataForm = watch('data');

  const {
    data: slots,
    isLoading: slotsLoading,
    refetch: refetchSlots,
    isFetching: slotsFetching,
  } = useAdminSlots(filtroMedicoId, filtroData);

  const onSubmit = (values: FormData) => {
    criarSlots(
      {
        medicoId: values.medicoId,
        data: values.data,
        horaInicio: values.horaInicio,
        horaFim: values.horaFim,
        intervaloMinutos: values.intervaloMinutos,
      },
      {
        onSuccess: (resp: any) => {
          const count = Array.isArray(resp) ? resp.length : resp?.count || 'vários';
          toast.success(`${count} slot(s) criado(s) com sucesso!`);
          reset({ intervaloMinutos: 30, medicoId: '', data: '', horaInicio: '', horaFim: '' });
          setFiltroMedicoId(values.medicoId);
          setFiltroData(values.data);
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const msg = err?.response?.data?.message || err?.response?.data;
          if (status === 404) toast.error('Médico não encontrado.');
          else if (status === 400) toast.info(msg || 'Dados inválidos. Verifique os horários.');
          else if (status === 403) toast.error('Você não tem permissão para criar slots.');
          else toast.error('Erro ao criar slots. Tente novamente.');
          console.log('[CriarSlots][ERR]', {
            status,
            url: err?.config?.url,
            payload: err?.config?.data,
            data: err?.response?.data,
          });
        },
      },
    );
  };

  const handleCancelar = (slotId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este slot?')) return;
    cancelarSlot(slotId, {
      onSuccess: () => toast.success('Slot cancelado com sucesso!'),
      onError: (err: any) => {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.response?.data;
        if (status === 404) toast.error('Slot não encontrado.');
        else if (status === 400) toast.info(msg || 'Não é possível cancelar este slot.');
        else if (status === 403) toast.error('Você não tem permissão para cancelar slots.');
        else toast.error('Erro ao cancelar slot.');
        console.log('[CancelarSlot][ERR]', { status, url: err?.config?.url, data: err?.response?.data });
      },
    });
  };

  const handleBuscarSlots = () => {
    if (!medicoIdForm || !dataForm) {
      toast.warning('Selecione médico e data para buscar slots.');
      return;
    }
    setFiltroMedicoId(medicoIdForm);
    setFiltroData(dataForm);
  };

  const slotsOrdenados = (slots ?? [])
    .slice()
    .sort((a, b) => a.inicio.localeCompare(b.inicio));

  return (
    <div className="slots">
      <header className="slots__header">
        <h1 className="slots__title">Gerenciar Slots de Consulta</h1>
        <p className="slots__subtitle">Crie horários disponíveis para os médicos e gerencie a agenda.</p>
      </header>

      <div className="slots__grid">
        {/* Criar slots */}
        <section className="card card--muted">
          <h2 className="card__title">Criar Slots</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-field">
              <label htmlFor="medicoId" className="form-label">Médico</label>
              <select id="medicoId" {...register('medicoId')} disabled={criando || medicosLoading} className="form-input">
                <option value="">Selecione</option>
                {medicos?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} — {m.especialidade}
                  </option>
                ))}
              </select>
              {errors.medicoId && <small className="form-error">{errors.medicoId.message}</small>}
            </div>

            <div className="form-field">
              <label htmlFor="data" className="form-label">Data</label>
              <input id="data" type="date" {...register('data')} disabled={criando} className="form-input" />
              {errors.data && <small className="form-error">{errors.data.message}</small>}
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="horaInicio" className="form-label">Início</label>
                <input id="horaInicio" type="time" {...register('horaInicio')} disabled={criando} className="form-input" />
                {errors.horaInicio && <small className="form-error">{errors.horaInicio.message}</small>}
              </div>
              <div className="form-field">
                <label htmlFor="horaFim" className="form-label">Fim</label>
                <input id="horaFim" type="time" {...register('horaFim')} disabled={criando} className="form-input" />
                {errors.horaFim && <small className="form-error">{errors.horaFim.message}</small>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="intervaloMinutos" className="form-label">Intervalo (minutos)</label>
              <input
                id="intervaloMinutos"
                type="number"
                {...register('intervaloMinutos', { valueAsNumber: true })}
                placeholder="30"
                disabled={criando}
                className="form-input"
              />
              {errors.intervaloMinutos && <small className="form-error">{errors.intervaloMinutos.message}</small>}
            </div>

            <button type="submit" className="btn btn--primary" disabled={criando}>
              {criando ? 'Criando...' : 'Criar Slots'}
            </button>
          </form>
        </section>

        {/* Lista de slots */}
        <section className="card">
          <div className="slots__listhead">
            <h2 className="card__title">Slots Criados</h2>
            <div className="slots__listactions">
              <button
                type="button"
                onClick={handleBuscarSlots}
                disabled={!medicoIdForm || !dataForm}
                className="btn"
              >
                <Calendar size={16} aria-hidden="true" />
                <span>Buscar</span>
              </button>
              <button
                type="button"
                onClick={() => refetchSlots()}
                disabled={slotsFetching || !filtroMedicoId || !filtroData}
                className="btn"
                aria-live="polite"
              >
                <RefreshCw size={16} className={slotsFetching ? 'icon-spin' : ''} aria-hidden="true" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>

          {!filtroMedicoId || !filtroData ? (
            <p className="slots__hint">Selecione médico e data no formulário e clique em “Buscar” para ver os slots.</p>
          ) : slotsLoading ? (
            <p>Carregando slots...</p>
          ) : slotsOrdenados.length === 0 ? (
            <p className="slots__hint">Nenhum slot encontrado para esta data.</p>
          ) : (
            <ul className="slots__list">
              {slotsOrdenados.map((slot) => (
                <li
                  key={slot.id}
                  className={[
                    'slot',
                    slot.status === 'LIVRE' ? 'slot--ok' : slot.status === 'RESERVADO' ? 'slot--warn' : 'slot--danger',
                  ].join(' ')}
                >
                  <div className="slot__info">
                    <div className="slot__range">
                      {formatTime(slot.inicio)} - {formatTime(slot.fim)}
                    </div>
                    <div className="slot__status">
                      Status:{' '}
                      <span className="slot__statusvalue">{slot.status}</span>
                    </div>
                  </div>

                  {slot.status === 'LIVRE' && (
                    <button
                      type="button"
                      onClick={() => handleCancelar(slot.id)}
                      disabled={cancelando}
                      className="btn btn--danger btn--sm"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span>Cancelar</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}