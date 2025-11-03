'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  useListMedicosParaPaciente,
  useSlotsLivresDoMedico,
  type SlotDTO,
} from '@/features/paciente/queries';
import { useAgendarConsultaPorSlot } from '@/features/paciente/useAgendarConsulta';
import { useEffect, useMemo, useState } from 'react';
import { toast } from '@/app/components/ui/toast';
import { formatTime } from '@/lib/datetime';
import styles from './page.module.css';

const schema = z.object({
  medicoId: z.string().min(1, 'Selecione um médico'),
  data: z.string().min(1, 'Informe a data'),
  slotId: z.string().min(1, 'Selecione um horário'),
  observacoes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function formatHoraLabel(s: SlotDTO) {
  return `${formatTime(s.inicio)} - ${formatTime(s.fim)}`;
}

export default function NovaConsultaPacientePage() {
  const router = useRouter();
  const { data: medicos, isLoading: medicosLoading, isError: medicosError } =
    useListMedicosParaPaciente();
  const { mutate: agendar, isPending } = useAgendarConsultaPorSlot();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      medicoId: '',
      data: '',
      slotId: '',
      observacoes: '',
    },
  });

  const medicoId = watch('medicoId');
  const dataISO = watch('data');

  useEffect(() => {
    console.log('[NovaConsulta] medicoId=', medicoId, 'dataISO=', dataISO);
  }, [medicoId, dataISO]);

  const { data: slots, isLoading: slotsLoading, isError: slotsError } = useSlotsLivresDoMedico(
    medicoId,
    dataISO,
  );

  useEffect(() => {
    if (slots) {
      console.log('[NovaConsulta][Slots]', slots);
    }
  }, [slots]);

  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const slotsOrdenados = useMemo(
    () => (slots ?? []).slice().sort((a, b) => a.inicio.localeCompare(b.inicio)),
    [slots],
  );

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlot(slotId);
    setValue('slotId', slotId, { shouldValidate: true });
  };

  const onSubmit = (values: FormData) => {
    agendar(
      { slotId: values.slotId, observacoes: values.observacoes || '' },
      {
        onSuccess: () => {
          toast.success('Consulta agendada com sucesso!');
          router.push('/paciente/consultas');
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          if (status === 409) {
            toast.warning('Esse horário acabou de ser reservado. Escolha outro.');
          } else if (status === 404) {
            toast.error('Slot não encontrado.');
          } else if (status === 400) {
            toast.info(err?.response?.data?.message || 'Dados inválidos.');
          } else if (status === 403) {
            toast.error('Você não tem permissão para agendar. Faça login como paciente.');
          } else {
            toast.error('Erro ao agendar consulta.');
          }
          console.log('[AgendarConsulta][ERR]', {
            status,
            url: err?.config?.url,
            method: err?.config?.method,
            payload: err?.config?.data,
            data: err?.response?.data,
          });
        },
      },
    );
  };

  const medicoOuDataIndef = !medicoId || !dataISO;
  const disabledSlots = isPending || slotsLoading || slotsError || medicoOuDataIndef;

  return (
    <div className={styles['nova-consulta']}>
      <div className="container">
        <header className={styles['nova-consulta__header']}>
          <h1 className={styles['nova-consulta__title']}>Agendar Consulta</h1>
          <Link href="/paciente/consultas" className={`${styles.btn}`}>
            Voltar
          </Link>
        </header>

        {medicosError && (
          <p className={`${styles['nova-consulta__info']} ${styles['nova-consulta__info--error']}`} role="alert">
            Erro ao carregar médicos. Verifique sua sessão e permissões.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <div className={styles['form-field']}>
            <label htmlFor="medico" className={styles['form-label']}>
              Médico
            </label>
            <select
              id="medico"
              {...register('medicoId')}
              disabled={isPending || medicosLoading}
              defaultValue=""
              onChange={(e) => {
                const val = e.target.value;
                setValue('medicoId', val, { shouldValidate: true, shouldDirty: true });
                setSelectedSlot('');
                setValue('slotId', '', { shouldValidate: true });
              }}
              className={styles['form-input']}
              aria-invalid={!!errors.medicoId}
              aria-describedby={errors.medicoId ? "medico-error" : undefined}
            >
              <option value="">Selecione</option>
              {medicos?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} — {m.especialidade}
                </option>
              ))}
            </select>
            {errors.medicoId && (
              <small id="medico-error" className={styles['form-error']}>
                {errors.medicoId.message}
              </small>
            )}
          </div>

          <div className={styles['form-field']}>
            <label htmlFor="data" className={styles['form-label']}>
              Data
            </label>
            <input
              id="data"
              type="date"
              {...register('data')}
              disabled={isPending}
              onChange={(e) => {
                const val = e.target.value;
                setValue('data', val, { shouldValidate: true, shouldDirty: true });
                setSelectedSlot('');
                setValue('slotId', '', { shouldValidate: true });
              }}
              className={styles['form-input']}
              aria-invalid={!!errors.data}
              aria-describedby={errors.data ? "data-error" : undefined}
            />
            {errors.data && (
              <small id="data-error" className={styles['form-error']}>
                {errors.data.message}
              </small>
            )}
          </div>

          {/* Campo escondido para validação do slotId */}
          <input type="hidden" {...register('slotId')} />

          <div className={styles['form-field']}>
            <label htmlFor="horarios" className={styles['form-label']}>
              Horários disponíveis
            </label>
            <div
              className={styles['slots-grid']}
              aria-busy={slotsLoading}
              aria-live="polite"
              arial-label="Grade de horários disponíveis"
            >
              {medicoOuDataIndef && (
                <div className={styles['slots-hint']}>Selecione médico e data para ver horários.</div>
              )}

              {!medicoOuDataIndef && slotsLoading && (
                <div className={styles['slots-hint']}>Carregando horários...</div>
              )}

              {!medicoOuDataIndef && !slotsLoading && slotsError && (
                <div className={styles['slots-error']}>Erro ao carregar horários.</div>
              )}

              {!medicoOuDataIndef && !slotsLoading && !slotsError && slotsOrdenados.length === 0 && (
                <div className={styles['slots-hint']}>Sem horários disponíveis para esta data.</div>
              )}

              {!medicoOuDataIndef &&
                !slotsLoading &&
                !slotsError &&
                slotsOrdenados.map((slot) => {
                  const selected = selectedSlot === slot.id;
                  const indisponivel = slot.status !== 'LIVRE';
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleSelectSlot(slot.id)}
                      disabled={disabledSlots || indisponivel}
                      title={formatHoraLabel(slot)}
                      className={[
                        styles.slotcard,
                        selected ? styles['slotcard--selected'] : '',
                        indisponivel ? styles['slotcard--disabled'] : '',
                      ].join(' ')}
                      aria-pressed={selected}
                      aria-label={`Selecionar horário das ${formatTime(slot.inicio)} até ${formatTime(slot.fim)}`}
                    >
                      <div className={styles['slotcard__start']}>{formatTime(slot.inicio)}</div>
                      <div className={styles['slotcard__end']}>até {formatTime(slot.fim)}</div>
                      {indisponivel && (
                        <div className={styles['slotcard__badge']}>Indisponível</div>
                      )}
                    </button>
                  );
                })}
            </div>
            {errors.slotId && (
              <small id="slot-error" className={styles['form-error']}>
                {errors.slotId.message}
              </small>
            )}
          </div>

          <div className={styles['form-field']}>
            <label htmlFor="observacoes" className={styles['form-label']}>
              Observações
            </label>
            <textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Observações (opcional)"
              disabled={isPending}
              rows={4}
              className={styles['form-input']}
            />
          </div>

          <button
            type="submit"
            className={`${styles.btn} ${styles['btn--primary']}`}
            disabled={isPending || !selectedSlot}
            aria-busy={isPending}
          >
            {isPending ? 'Agendando...' : 'Agendar'}
          </button>
        </form>
      </div>
    </div>
  );
}